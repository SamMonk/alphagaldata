import * as React from 'react';
import { graphql, PageProps } from 'gatsby';
import { useAuth } from 'react-oidc-context';
import Layout from '../components/Layout';

// ── Types ────────────────────────────────────────────────────────────────────

type RecipeTemplateData = {
  mdx?: {
    frontmatter?: {
      title?: string | null;
      description?: string | null;
      date?: string | null;
      servings?: string | null;
      prep_time?: string | null;
      cook_time?: string | null;
      safety_notes?: string[] | null;
      ingredients?: string[] | null;
      steps?: string[] | null;
      image?: string | null;
      cms_id?: string | null;
    } | null;
  } | null;
};

interface RecipeTemplateProps extends PageProps<RecipeTemplateData> {}

// ── Editor button (client-only) ───────────────────────────────────────────────
// Rendered only after hydration so useAuth is never called during SSR.

function EditorButtonInner({ cmsId }: { cmsId: string | null | undefined }) {
  const auth = useAuth();
  const groups =
    (auth.user?.profile?.['cognito:groups'] as string[] | undefined) ?? [];
  if (!auth.isAuthenticated || !groups.includes('editors')) return null;

  const href = cmsId
    ? `/admin/#/collections/recipes/entries/${cmsId}`
    : '/admin/#/collections/recipes';

  return (
    <a
      href={href}
      className="inline-flex items-center gap-1 text-sm bg-teal-700 text-white px-3 py-1.5 rounded hover:bg-teal-800 shrink-0"
    >
      ✏ Edit Recipe
    </a>
  );
}

function EditorButton({ cmsId }: { cmsId: string | null | undefined }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return <EditorButtonInner cmsId={cmsId} />;
}

// ── Template ──────────────────────────────────────────────────────────────────

const RecipeTemplate: React.FC<RecipeTemplateProps> = ({ data }) => {
  const fm = data.mdx?.frontmatter;
  const title = fm?.title ?? 'Alpha-Gal Safe Recipe';
  const description = fm?.description ?? '';
  const safetyNotes = fm?.safety_notes ?? [];
  const ingredients = fm?.ingredients ?? [];
  const steps = fm?.steps ?? [];

  return (
    <Layout title={title} description={description}>
      {/* ── Hardcoded site-level safety banner ── */}
      <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-800">
        <strong>Alpha-Gal Safety:</strong> Every recipe on this site is
        screened to exclude mammalian meat, lard, gelatin, and other common
        alpha-gal triggers. Ingredient formulas change — always re-read labels
        before each purchase.{' '}
        <a href="/learn/what-is-alpha-gal" className="underline font-medium">
          Learn about alpha-gal →
        </a>
      </div>

      <article className="max-w-3xl mx-auto space-y-6">
        {/* ── Header card ── */}
        <div className="card">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
            <h1 className="text-3xl font-bold text-slate-900 leading-tight">
              {title}
            </h1>
            <EditorButton cmsId={fm?.cms_id} />
          </div>

          {description && (
            <p className="text-slate-600 mb-4 text-base">{description}</p>
          )}

          <div className="flex flex-wrap gap-5 text-sm text-slate-500 border-t pt-3">
            {fm?.servings && (
              <span>
                🍽{' '}
                <strong className="text-slate-700">{fm.servings}</strong>{' '}
                servings
              </span>
            )}
            {fm?.prep_time && (
              <span>
                ⏱ Prep:{' '}
                <strong className="text-slate-700">{fm.prep_time}</strong>
              </span>
            )}
            {fm?.cook_time && (
              <span>
                🔥 Cook:{' '}
                <strong className="text-slate-700">{fm.cook_time}</strong>
              </span>
            )}
          </div>
        </div>

        {/* ── Image ── */}
        {fm?.image && (
          <div className="overflow-hidden rounded-xl">
            <img
              src={fm.image}
              alt={title}
              className="w-full object-cover max-h-72 rounded-xl"
            />
          </div>
        )}

        {/* ── Editor-provided safety notes ── */}
        {safetyNotes.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3">
              ⚠ Ingredient Safety Notes
            </h2>
            <ul className="space-y-2">
              {safetyNotes.map((note, i) => (
                <li key={i} className="flex gap-2 text-sm text-amber-900">
                  <span className="mt-0.5 shrink-0">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Ingredients + Steps ── */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-3 text-slate-900">
              Ingredients
            </h2>
            <ul className="space-y-2">
              {ingredients.map((ing, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700">
                  <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-3 text-slate-900">
              Instructions
            </h2>
            <ol className="space-y-4">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700">
                  <span className="font-bold text-teal-700 shrink-0 text-base leading-snug">
                    {i + 1}.
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ── Legal disclaimer ── */}
        <p className="text-xs text-slate-400 border-t pt-4">
          Recipes are provided for educational and informational purposes only.
          Alpha-gal sensitivity varies by individual — what is safe for one
          person may not be safe for another. Always read ingredient labels and
          consult your allergist or physician before trying new ingredients or
          recipes.
        </p>
      </article>
    </Layout>
  );
};

export const query = graphql`
  query RecipeTemplate($id: String!) {
    mdx(id: { eq: $id }) {
      id
      frontmatter {
        title
        description
        date
        servings
        prep_time
        cook_time
        safety_notes
        ingredients
        steps
        image
        cms_id
      }
    }
  }
`;

export default RecipeTemplate;

export const Head: React.FC<RecipeTemplateProps> = ({ data }) => {
  const fm = data.mdx?.frontmatter;
  const title = fm?.title
    ? `${fm.title} | AlphaGalData`
    : 'Safe Recipe | AlphaGalData';
  const description =
    fm?.description ?? 'Alpha-gal safe recipe from AlphaGalData.';
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
    </>
  );
};

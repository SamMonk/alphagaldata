import * as React from 'react';
import { graphql, PageProps } from 'gatsby';
import { useAuth } from 'react-oidc-context';
import Layout from '../components/Layout';
import RecipeSafetyNoteBlock from '../components/RecipeSafetyNoteBlock';
import RecipeSaveButton from '../components/RecipeSaveButton';
import TrustNotice from '../components/TrustNotice';

// ── Types ────────────────────────────────────────────────────────────────────

type RecipeTemplateData = {
  allRecipes: {
    nodes: Array<{
      id: string;
      frontmatter?: {
        title?: string | null;
        slug?: string | null;
        description?: string | null;
      } | null;
    }>;
  };
  mdx?: {
    frontmatter?: {
      title?: string | null;
      description?: string | null;
      date?: string | null;
      servings?: string | null;
      prep_time?: string | null;
      cook_time?: string | null;
      safety_summary?: string | null;
      safety_notes?: string[] | null;
      substitutions?: string[] | null;
      caution_points?: string[] | null;
      ingredients?: string[] | null;
      steps?: string[] | null;
      image?: string | null;
      cms_id?: string | null;
      slug?: string | null;
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
      className="inline-flex min-h-11 items-center gap-1 rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 shrink-0"
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
  const safetySummary = fm?.safety_summary ?? '';
  const safetyNotes = fm?.safety_notes ?? [];
  const substitutions = fm?.substitutions ?? [];
  const cautionPoints = fm?.caution_points ?? [];
  const ingredients = fm?.ingredients ?? [];
  const steps = fm?.steps ?? [];
  const relatedRecipes = (data.allRecipes?.nodes ?? [])
    .filter((node) => node.frontmatter?.slug && node.frontmatter?.title)
    .filter((node) => node.frontmatter?.slug !== fm?.slug)
    .slice(0, 2);

  return (
    <Layout title={title} description={description}>
      <div className="mb-6">
        <TrustNotice title="Recipe safety context" tone="teal">
          Every recipe on AlphaGalData is screened to avoid common alpha-gal triggers, but ingredient formulas and
          personal tolerance still vary. Re-read labels each time you shop, use the safety notes on the page, and make
          clinician-guided decisions when you are testing uncertain ingredients.
        </TrustNotice>
      </div>

      <article className="mx-auto max-w-4xl space-y-6">
        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <div className="card border border-stone-200 bg-gradient-to-br from-white via-amber-50/60 to-emerald-50/40">
            <div className="mb-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
              Recipe detail
            </div>
            <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
              <h1 className="max-w-3xl text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
                {title}
              </h1>
              <EditorButton cmsId={fm?.cms_id} />
            </div>

            {description && (
              <p className="max-w-3xl text-base leading-7 text-slate-700 md:text-lg">
                {description}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-3 border-t border-stone-200 pt-4 text-sm text-slate-600">
              {fm?.servings && (
                <span className="rounded-full bg-white px-3 py-2">
                  Serves <strong className="text-slate-900">{fm.servings}</strong>
                </span>
              )}
              {fm?.prep_time && (
                <span className="rounded-full bg-white px-3 py-2">
                  Prep <strong className="text-slate-900">{fm.prep_time}</strong>
                </span>
              )}
              {fm?.cook_time && (
                <span className="rounded-full bg-white px-3 py-2">
                  Cook <strong className="text-slate-900">{fm.cook_time}</strong>
                </span>
              )}
            </div>
          </div>

          <aside className="card border border-emerald-200 bg-emerald-50/80">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900">
              At a glance
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              {safetySummary ||
                'Read the safety notes before cooking so the recipe still works with the ingredients you can actually trust and buy.'}
            </p>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-emerald-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-900">Why it may work</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This page keeps the safety reasoning, substitutions, and caution points visible before you commit to cooking.
                </p>
              </div>

              {cautionPoints.length > 0 && (
                <div className="rounded-2xl border border-amber-200 bg-white p-4">
                  <h3 className="text-sm font-semibold text-slate-900">Verify before you cook</h3>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                    {cautionPoints.slice(0, 2).map((point, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="mt-1 shrink-0 text-amber-700">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {substitutions.length > 0 && (
                <div className="rounded-2xl border border-stone-200 bg-white p-4">
                  <h3 className="text-sm font-semibold text-slate-900">Useful substitutions</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {substitutions[0]}
                  </p>
                </div>
              )}
            </div>
          </aside>
        </section>

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

        <RecipeSafetyNoteBlock
          summary={safetySummary}
          safetyNotes={safetyNotes}
          substitutions={substitutions}
          cautionPoints={cautionPoints}
        />

        {fm?.slug && (
          <RecipeSaveButton recipeSlug={fm.slug} variant='detail' />
        )}

        {/* ── Ingredients + Steps ── */}
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
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
                <li key={i} className="flex gap-3 text-sm leading-7 text-slate-700">
                  <span className="font-bold text-teal-700 shrink-0 text-base leading-snug">
                    {i + 1}.
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {(relatedRecipes.length > 0 || true) && (
          <section className="space-y-4 border-t border-slate-200 pt-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Keep moving with confidence</h2>
                <p className="text-sm leading-6 text-slate-600">
                  Use the next step that fits your decision: open another recipe, verify an ingredient, or grab practical support.
                </p>
              </div>
              <a
                className="inline-flex min-h-11 items-center text-sm font-semibold text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                href="/recipes"
              >
                Browse all recipes →
              </a>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {relatedRecipes.map((recipe) => (
                <a key={recipe.id} className="card-link p-4 text-sm" href={recipe.frontmatter?.slug ?? '/recipes'}>
                  <h3 className="text-base font-semibold text-slate-900">
                    {recipe.frontmatter?.title}
                  </h3>
                  {recipe.frontmatter?.description && (
                    <p className="mt-2 text-slate-600">{recipe.frontmatter.description}</p>
                  )}
                </a>
              ))}
              <a className="card-link p-4 text-sm" href="/scanner">
                <h3 className="text-base font-semibold text-slate-900">Check ingredients</h3>
                <p className="mt-2 text-slate-600">Paste a label into the scanner when the packaged ingredient choice is still unclear.</p>
              </a>
              <a className="card-link p-4 text-sm" href="/learn/alpha-gal-101">
                <h3 className="text-base font-semibold text-slate-900">Read the basics</h3>
                <p className="mt-2 text-slate-600">Step back into a calm primer when you need context before making the meal decision.</p>
              </a>
            </div>
          </section>
        )}

        {/* ── Legal disclaimer ── */}
        <p className="text-xs text-slate-500 border-t pt-4">
          Recipes are educational support only. Alpha-gal sensitivity varies by individual, so use the ingredient notes,
          verify labels, and talk with your clinician when your tolerance or risk profile is unclear.
        </p>

        <section className="grid gap-4 border-t border-slate-200 pt-6 md:grid-cols-3">
          <a className="card-link p-4 text-sm" href="/scanner">
            <h2 className="text-base font-semibold text-slate-900">Check ingredients</h2>
            <p className="mt-2 text-slate-600">Paste a label into the scanner when you need a conservative read on packaged ingredients.</p>
          </a>
          <a className="card-link p-4 text-sm" href="/downloads">
            <h2 className="text-base font-semibold text-slate-900">Dining cards & prep</h2>
            <p className="mt-2 text-slate-600">Keep printable cards and practical resources handy for meals away from home.</p>
          </a>
          <a className="card-link p-4 text-sm" href="/caregivers">
            <h2 className="text-base font-semibold text-slate-900">Share with caregivers</h2>
            <p className="mt-2 text-slate-600">Give family members and helpers one routed guide for safer planning and support.</p>
          </a>
        </section>
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
        safety_summary
        safety_notes
        substitutions
        caution_points
        ingredients
        steps
        image
        cms_id
        slug
      }
    }
    allRecipes: allMdx(
      filter: { internal: { contentFilePath: { regex: "/content/recipes/" } } }
      sort: { frontmatter: { date: DESC } }
      limit: 4
    ) {
      nodes {
        id
        frontmatter {
          title
          slug
          description
        }
      }
    }
  }
`;

export default RecipeTemplate;

function toISO8601Duration(timeStr: string | null | undefined): string | null {
  if (!timeStr) return null;
  const match = timeStr.match(/(\d+)\s*(hours?|minutes?|mins?|hrs?)/i);
  if (!match) return null;
  const num = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  if (unit.startsWith('h')) return `PT${num}H`;
  return `PT${num}M`;
}

export const Head: React.FC<RecipeTemplateProps> = ({ data, location }) => {
  const fm = data.mdx?.frontmatter;
  const title = fm?.title
    ? `${fm.title} | AlphaGalData`
    : 'Safe Recipe | AlphaGalData';
  const description =
    fm?.description ?? 'Alpha-gal safe recipe from AlphaGalData.';
  const url = `https://alphagaldata.com${location.pathname}`;

  const recipeJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: fm?.title ?? 'Alpha-Gal Safe Recipe',
    description,
    author: { '@type': 'Organization', name: 'AlphaGalData' },
    ...(fm?.image && { image: fm.image }),
    ...(fm?.servings && { recipeYield: fm.servings }),
    ...(toISO8601Duration(fm?.prep_time) && { prepTime: toISO8601Duration(fm?.prep_time) }),
    ...(toISO8601Duration(fm?.cook_time) && { cookTime: toISO8601Duration(fm?.cook_time) }),
    ...(fm?.safety_summary && {
      recipeCuisine: 'Alpha-gal aware home cooking',
    }),
    ...(fm?.ingredients && { recipeIngredient: fm.ingredients }),
    ...(fm?.steps && { recipeInstructions: fm.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: step,
    })) }),
    recipeCategory: 'Alpha-gal safe',
  };

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="AlphaGalData" />
      {fm?.image && <meta property="og:image" content={fm.image} />}
      <meta name="twitter:card" content={fm?.image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {fm?.image && <meta name="twitter:image" content={fm.image} />}
      <script type="application/ld+json">
        {JSON.stringify(recipeJsonLd)}
      </script>
    </>
  );
};

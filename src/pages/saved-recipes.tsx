import * as React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/Layout';
import RecipeSaveButton from '../components/RecipeSaveButton';
import type { RecipeSaveRecord } from '../contracts/recipes';
import { listSaves, subscribe } from '../services/recipes/saves';

type RecipeNode = {
  id: string;
  frontmatter: {
    title?: string | null;
    slug?: string | null;
    description?: string | null;
    servings?: string | null;
    prep_time?: string | null;
    cook_time?: string | null;
    image?: string | null;
  } | null;
};

type SavedRecipesPageData = {
  allMdx: {
    nodes: RecipeNode[];
  };
};

type SavedRecipeMatch = {
  recipe: RecipeNode;
  savedAt: string;
};

const orderSavedRecipes = (
  saves: RecipeSaveRecord[],
  recipes: RecipeNode[]
): SavedRecipeMatch[] => {
  const recipeBySlug = new Map<string, RecipeNode>();
  recipes.forEach((recipe) => {
    const slug = recipe.frontmatter?.slug;
    if (slug) recipeBySlug.set(slug, recipe);
  });

  return [...saves]
    .sort((a, b) => b.saved_at.localeCompare(a.saved_at))
    .flatMap((record) => {
      const recipe = recipeBySlug.get(record.recipe_slug);
      return recipe ? [{ recipe, savedAt: record.saved_at }] : [];
    });
};

const formatSavedAt = (savedAt: string): string => {
  const parsed = new Date(savedAt);
  if (Number.isNaN(parsed.getTime())) return 'Saved recently';
  return `Saved ${parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;
};

export default function SavedRecipesPage({
  data,
}: PageProps<SavedRecipesPageData>) {
  const recipes = data.allMdx.nodes.filter(
    (node) => node.frontmatter?.slug && node.frontmatter?.title
  );
  const [saves, setSaves] = React.useState<RecipeSaveRecord[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    let active = true;

    const refresh = async () => {
      const next = await listSaves();
      if (active) {
        setSaves(next);
        setHydrated(true);
      }
    };

    void refresh();
    const unsubscribe = subscribe(() => {
      void refresh();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const savedRecipes = orderSavedRecipes(saves, recipes);
  const hiddenStaleCount = Math.max(saves.length - savedRecipes.length, 0);

  return (
    <Layout
      title="Saved Recipes"
      description="Return to recipes you saved on this device and keep your next safe meal decision close."
      noindex
    >
      <div className="space-y-8">
        <section className="card border border-emerald-200 bg-gradient-to-br from-white via-emerald-50/70 to-amber-50/60">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900">
                Return to trusted choices
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                Saved recipes on this device
              </h1>
              <p className="mt-3 text-base leading-7 text-slate-700">
                Keep recipes you already reviewed close at hand. This list only
                stores the recipe slug and save timestamp on this device, not
                health tracking or profile data.
              </p>
            </div>
            <a
              className="inline-flex min-h-11 items-center rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              href="/recipes"
            >
              Browse all recipes
            </a>
          </div>
        </section>

        {!hydrated ? (
          <section className="grid gap-4 md:grid-cols-2">
            {[0, 1].map((index) => (
              <div
                key={index}
                className="card animate-pulse border border-stone-200"
              >
                <div className="h-44 rounded-lg bg-stone-200" />
                <div className="mt-4 h-6 w-2/3 rounded bg-stone-200" />
                <div className="mt-3 h-4 w-full rounded bg-stone-100" />
                <div className="mt-2 h-4 w-5/6 rounded bg-stone-100" />
                <div className="mt-6 h-11 w-40 rounded-full bg-stone-200" />
              </div>
            ))}
          </section>
        ) : savedRecipes.length > 0 ? (
          <section className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Your saved recipe list
                </h2>
                <p className="text-sm leading-6 text-slate-600">
                  Open any recipe to review the safety notes again or remove it
                  from this list when it is no longer useful.
                </p>
              </div>
              <p className="text-sm text-slate-500">
                {savedRecipes.length} saved recipe
                {savedRecipes.length === 1 ? '' : 's'}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {savedRecipes.map(({ recipe, savedAt }) => {
                const fm = recipe.frontmatter!;
                return (
                  <article
                    key={recipe.id}
                    className="card border border-stone-200 p-5"
                  >
                    <a href={fm.slug!} className="block focus-visible:outline-none">
                      {fm.image ? (
                        <img
                          src={fm.image}
                          alt={fm.title ?? ''}
                          className="mb-3 h-44 w-full rounded-lg object-cover"
                        />
                      ) : null}
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900">
                        {formatSavedAt(savedAt)}
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-slate-900">
                        {fm.title}
                      </h2>
                      {fm.description ? (
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {fm.description}
                        </p>
                      ) : null}
                      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                        {fm.servings ? <span>Serves {fm.servings}</span> : null}
                        {fm.prep_time ? <span>Prep: {fm.prep_time}</span> : null}
                        {fm.cook_time ? <span>Cook: {fm.cook_time}</span> : null}
                      </div>
                    </a>
                    <RecipeSaveButton recipeSlug={fm.slug!} variant="card" />
                  </article>
                );
              })}
            </div>

            {hiddenStaleCount > 0 ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                {hiddenStaleCount} saved item
                {hiddenStaleCount === 1 ? ' is' : 's are'} no longer published,
                so {hiddenStaleCount === 1 ? 'it is' : 'they are'} hidden from this list.
              </div>
            ) : null}
          </section>
        ) : (
          <section className="card border border-dashed border-stone-300 bg-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Nothing saved yet
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Start with a recipe you already understand
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
              When you save a recipe after reviewing its safety notes and substitutions,
              it will appear here for quick return on this device.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                href="/recipes"
              >
                Browse recipes
              </a>
              <a
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-stone-400 hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                href="/scanner"
              >
                Check ingredients first
              </a>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}

export const query = graphql`
  query SavedRecipesPage {
    allMdx(
      filter: { internal: { contentFilePath: { regex: "/content/recipes/" } } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        id
        frontmatter {
          title
          slug
          description
          servings
          prep_time
          cook_time
          image
        }
      }
    }
  }
`;

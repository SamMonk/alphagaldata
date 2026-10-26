import React, { useEffect, useState } from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/Layout';
import PreparednessResourcePanel from '../components/PreparednessResourcePanel';
import RecipeSaveButton from '../components/RecipeSaveButton';
import {
  applyFeaturedRecipeOverrides,
  getEditorialConfig,
} from '../services/editorial/config';

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
    featured?: boolean | null;
    featured_order?: number | null;
  } | null;
};

type RecipesPageData = {
  allMdx: {
    nodes: RecipeNode[];
  };
};

interface RecipesPageProps extends PageProps<RecipesPageData> {}

function RecipeCard({ node, featured }: { node: RecipeNode; featured?: boolean }) {
  const fm = node.frontmatter!;
  const cardClass = featured
    ? 'card-link card border-amber-300 p-5'
    : 'card-link card p-5';
  return (
    <article className={cardClass}>
      <a href={fm.slug!} className='block focus-visible:outline-none'>
        {featured && (
          <span className='mb-2 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-900'>
            Featured
          </span>
        )}
        {fm.image && (
          <img
            src={fm.image}
            alt={fm.title ?? ''}
            className='w-full h-44 object-cover rounded-lg mb-3'
          />
        )}
        <h3 className='text-lg font-semibold mb-1'>{fm.title}</h3>
        {fm.description && (
          <p className='text-sm text-slate-600 mb-3 line-clamp-2'>{fm.description}</p>
        )}
        <div className='flex flex-wrap gap-3 text-xs text-slate-500'>
          {fm.servings && <span>🍽 {fm.servings} servings</span>}
          {fm.prep_time && <span>⏱ Prep: {fm.prep_time}</span>}
          {fm.cook_time && <span>🔥 Cook: {fm.cook_time}</span>}
        </div>
      </a>
      <RecipeSaveButton recipeSlug={fm.slug!} variant='card' />
    </article>
  );
}

export default function RecipesPage({ data }: RecipesPageProps) {
  const recipes = data.allMdx.nodes.filter(
    (n) => n.frontmatter?.slug && n.frontmatter?.title,
  );

  const baseFeaturedRecipes = [...recipes]
    .filter((n) => n.frontmatter?.featured === true)
    .sort((a, b) => {
      const ao = a.frontmatter?.featured_order ?? Number.MAX_SAFE_INTEGER;
      const bo = b.frontmatter?.featured_order ?? Number.MAX_SAFE_INTEGER;
      return ao - bo;
    });
  const [featuredRecipes, setFeaturedRecipes] = useState(baseFeaturedRecipes);

  useEffect(() => {
    let cancelled = false;

    const loadEditorialConfig = async () => {
      const response = await getEditorialConfig();
      if (cancelled || response.error || !response.data) return;

      const overridden = applyFeaturedRecipeOverrides(recipes, response.data);
      if (overridden.length > 0) setFeaturedRecipes(overridden);
    };

    void loadEditorialConfig();

    return () => {
      cancelled = true;
    };
  }, [recipes]);

  return (
    <Layout title="Safe Recipes" description="Family-tested recipes safe for alpha-gal syndrome. Each recipe avoids mammalian meat and dairy triggers with clear ingredient lists.">
      <div className="space-y-8">
        <section className="card">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Safe recipes for alpha-gal households
              </h1>
              <p className="max-w-3xl text-base leading-7 text-slate-700">
                Every recipe is reviewed to exclude mammalian meat, lard, gelatin,
                and other common alpha-gal triggers. Each post includes ingredient
                safety notes with specific label-reading tips.
              </p>
            </div>
            <a
              className="inline-flex min-h-11 items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              href="/saved-recipes"
            >
              View saved recipes
            </a>
          </div>
        </section>

        {featuredRecipes.length > 0 && (
          <section>
            <h2 className='text-xs font-semibold uppercase tracking-wider text-amber-900 mb-3'>
              Editor featured
            </h2>
            <div className='grid gap-4 md:grid-cols-2'>
              {featuredRecipes.map((node) => (
                <RecipeCard key={node.id} node={node} featured />
              ))}
            </div>
          </section>
        )}

        {recipes.length > 0 ? (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              All Recipes
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {recipes.map((node) => (
                <RecipeCard key={node.id} node={node} />
              ))}
            </div>
          </section>
        ) : (
          <section className="card">
            <h2 className="text-lg font-semibold mb-2">Coming soon</h2>
            <p className="text-slate-700">
              We are curating the first batch of safe recipes now. Check back
              soon for the initial lineup.
            </p>
          </section>
        )}

        <section className="card">
          <h2 className="text-xl font-semibold mb-2">
            What makes a recipe "safe"
          </h2>
          <ul className="list-disc ml-6 space-y-1 text-slate-700">
            <li>
              No mammalian meat (beef, pork, lamb, venison, rabbit, or other
              mammal proteins).
            </li>
            <li>
              No lard, tallow, gelatin, or hidden mammalian fats in processed
              ingredients.
            </li>
            <li>
              Specific label-reading guidance for broth, plant butter, and
              seasoning blends.
            </li>
            <li>
              Flags for carrageenan, which some people with alpha-gal also react
              to.
            </li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-lg font-semibold mb-2">Submit a recipe</h2>
          <p className="text-slate-700 mb-3">
            Share your family favorite and include ingredient notes or safe
            swaps that made the meal work.
          </p>
          <a className="inline-flex min-h-11 items-center text-emerald-700 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700" href="/submit-recipe">
            Start a submission →
          </a>
        </section>

        <PreparednessResourcePanel
          eyebrow='Practical next steps'
          title='Keep meal planning tied to real-world backup tools'
          description='When a recipe looks good but dining out, travel, or emergency visibility is still part of the decision, keep the same preparedness routes close instead of leaving food flow entirely.'
          links={[
            {
              href: '/downloads',
              label: 'Preparedness downloads',
              description:
                'Open dining cards, wallet cards, and the printable files most useful for meal planning and daily backup.',
            },
            {
              href: '/learn/dining-card-guide',
              label: 'Get dining cards',
              description:
                'Use the restaurant-facing card when you need kitchen staff to see restrictions clearly and quickly.',
            },
            {
              href: '/learn/wallet-card-guide',
              label: 'Wallet card guide',
              description:
                'Keep a detailed written summary nearby for intake, travel, and situations where someone else may need to explain your restrictions.',
            },
          ]}
        />

        <section className="grid gap-4 md:grid-cols-3">
          <a
            className="card-link card p-5"
            href="/scanner"
          >
            <h2 className="text-lg font-semibold mb-2">Check ingredients</h2>
            <p className="text-slate-700">
              Paste a label and get conservative guidance before you buy or cook.
            </p>
          </a>
          <a
            className="card-link card p-5"
            href="/downloads"
          >
            <h2 className="text-lg font-semibold mb-2">Preparedness downloads</h2>
            <p className="text-slate-700">
              Keep printable dining cards, wallet cards, and preparedness resources close for daily use.
            </p>
          </a>
          <a
            className="card-link card p-5"
            href="/caregivers"
          >
            <h2 className="text-lg font-semibold mb-2">Caregiver help</h2>
            <p className="text-slate-700">
              Share a routed guide for family, partners, or helpers who cook and plan with you.
            </p>
          </a>
        </section>
      </div>
    </Layout>
  );
}

export const query = graphql`
  query RecipesPage {
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
          featured
          featured_order
        }
      }
    }
  }
`;

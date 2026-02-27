import React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/Layout';

type RecipesPageData = {
  allMdx: {
    nodes: {
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
    }[];
  };
};

interface RecipesPageProps extends PageProps<RecipesPageData> {}

export default function RecipesPage({ data }: RecipesPageProps) {
  const recipes = data.allMdx.nodes.filter(
    (n) => n.frontmatter?.slug && n.frontmatter?.title,
  );

  return (
    <Layout title="Safe Recipes">
      <div className="space-y-8">
        <section className="card">
          <h1 className="text-3xl font-bold mb-2">
            Safe recipes for alpha-gal households
          </h1>
          <p className="text-slate-700">
            Every recipe is reviewed to exclude mammalian meat, lard, gelatin,
            and other common alpha-gal triggers. Each post includes ingredient
            safety notes with specific label-reading tips.
          </p>
        </section>

        {recipes.length > 0 ? (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              All Recipes
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {recipes.map((node) => {
                const fm = node.frontmatter!;
                return (
                  <a
                    key={node.id}
                    href={fm.slug!}
                    className="card block hover:shadow-md transition-shadow"
                  >
                    {fm.image && (
                      <img
                        src={fm.image}
                        alt={fm.title ?? ''}
                        className="w-full h-44 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h3 className="text-lg font-semibold mb-1">{fm.title}</h3>
                    {fm.description && (
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                        {fm.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      {fm.servings && <span>🍽 {fm.servings} servings</span>}
                      {fm.prep_time && <span>⏱ Prep: {fm.prep_time}</span>}
                      {fm.cook_time && <span>🔥 Cook: {fm.cook_time}</span>}
                    </div>
                  </a>
                );
              })}
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
          <a
            className="inline-flex text-emerald-700 font-semibold"
            href="/submit-recipe"
          >
            Start a submission →
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
        }
      }
    }
  }
`;

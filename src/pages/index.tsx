import React, { useEffect, useMemo, useState } from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/Layout';
import PreparednessResourcePanel from '../components/PreparednessResourcePanel';
import { IconBrandTick } from '../components/icons';
import {
  applyFeaturedRecipeOverrides,
  getEditorialConfig,
} from '../services/editorial/config';

type FeaturedRecipeNode = {
  id: string;
  frontmatter: {
    title?: string | null;
    slug?: string | null;
    description?: string | null;
    image?: string | null;
    featured_order?: number | null;
  } | null;
};

type HomePageData = {
  featuredRecipes: {
    nodes: FeaturedRecipeNode[];
  };
};

const recipeHighlightsFallback = [
  {
    title: 'Comfort-first recipe ideas',
    description:
      'Start with meals people actually want to eat, with safety context and practical substitutions attached.',
    href: '/recipes',
    cta: 'Browse recipes',
  },
  {
    title: 'Kitchen clarity before you save',
    description:
      'Each recipe path should help you understand why it may work for alpha-gal households before you commit.',
    href: '/recipes',
    cta: 'See featured dishes',
  },
];

const supportingGuides = [
  {
    title: 'Alpha-gal 101',
    description: 'A clear starting point for understanding the condition and the everyday implications.',
    href: '/learn/alpha-gal-101',
  },
  {
    title: 'Symptoms & Diagnosis',
    description: 'Review symptom patterns and testing context with calm, educational framing.',
    href: '/learn/symptoms-and-diagnosis',
  },
  {
    title: 'Dining cards',
    description: 'Keep printable dining and wallet cards close when you need a practical next step.',
    href: '/downloads',
  },
];

export default function HomePage({ data }: PageProps<HomePageData>) {
  const baseFeaturedRecipes = (data?.featuredRecipes?.nodes ?? [])
    .filter((n) => n.frontmatter?.slug && n.frontmatter?.title)
    .sort((a, b) => {
      const ao = a.frontmatter?.featured_order ?? Number.MAX_SAFE_INTEGER;
      const bo = b.frontmatter?.featured_order ?? Number.MAX_SAFE_INTEGER;
      return ao - bo;
    });
  const [editorialFeaturedRecipes, setEditorialFeaturedRecipes] =
    useState(baseFeaturedRecipes);

  useEffect(() => {
    let cancelled = false;

    const loadEditorialConfig = async () => {
      const response = await getEditorialConfig();
      if (cancelled || response.error || !response.data) return;

      const overridden = applyFeaturedRecipeOverrides(
        data?.featuredRecipes?.nodes ?? [],
        response.data
      );
      if (overridden.length > 0) setEditorialFeaturedRecipes(overridden);
    };

    void loadEditorialConfig();

    return () => {
      cancelled = true;
    };
  }, [data?.featuredRecipes?.nodes]);

  const featuredRecipes = useMemo(
    () => editorialFeaturedRecipes,
    [editorialFeaturedRecipes]
  );

  return (
    <Layout
      title='AlphaGalData — What Can I Eat? Check Ingredients. Stay Prepared.'
      description='Find trusted recipe ideas, check ingredient lists conservatively, and keep dining and preparedness tools close at hand.'
    >
      <div className='space-y-8'>
        <section className='grid gap-5 xl:grid-cols-[1.5fr_1fr]'>
          <div className='card border border-stone-200 bg-gradient-to-br from-white via-amber-50/70 to-emerald-50/40 p-8 shadow-sm'>
            <div className='mb-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-900'>
              Food-first guidance for real life
            </div>
            <h1 className='max-w-3xl text-4xl font-bold tracking-tight text-slate-950 md:text-5xl'>
              Find something you can trust and still want to eat.
            </h1>
            <p className='mt-5 max-w-2xl text-lg leading-8 text-slate-700'>
              AlphaGalData is built for the real question behind alpha-gal meal planning:
              what can I eat, how safe does it look, and what should I do next? Start with
              a recipe you actually want, then move into the safety context that helps you
              save it with confidence.
            </p>
            <div className='mt-6 flex flex-wrap gap-3'>
              <a
                className='inline-flex items-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700'
                href='/recipes'
              >
                What can I eat?
              </a>
              <a
                className='inline-flex items-center rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-stone-400 hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700'
                href='/downloads'
              >
                Get dining cards
              </a>
            </div>

            {featuredRecipes.length > 0 ? (
              <div className='mt-8'>
                <p className='text-xs font-semibold uppercase tracking-[0.18em] text-amber-900'>
                  Editor-featured recipes
                </p>
                <div className='mt-3 grid gap-4 md:grid-cols-2'>
                  {featuredRecipes.map((node) => {
                    const fm = node.frontmatter!;
                    return (
                      <a
                        key={node.id}
                        className='rounded-2xl border border-amber-300 bg-white/95 p-5 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700'
                        href={fm.slug!}
                      >
                        <span className='inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-900'>
                          Featured
                        </span>
                        <h2 className='mt-3 text-lg font-semibold text-slate-900'>{fm.title}</h2>
                        {fm.description && (
                          <p className='mt-2 text-sm leading-6 text-slate-600 line-clamp-3'>
                            {fm.description}
                          </p>
                        )}
                        <span className='mt-4 inline-flex text-sm font-semibold text-emerald-700'>
                          Open recipe →
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className='mt-8 grid gap-4 md:grid-cols-2'>
                {recipeHighlightsFallback.map((item) => (
                  <a
                    key={item.title}
                    className='rounded-2xl border border-stone-200 bg-white/90 p-5 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700'
                    href={item.href}
                  >
                    <h2 className='text-lg font-semibold text-slate-900'>{item.title}</h2>
                    <p className='mt-2 text-sm leading-6 text-slate-600'>{item.description}</p>
                    <span className='mt-4 inline-flex text-sm font-semibold text-emerald-700'>
                      {item.cta} →
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <aside className='card border border-emerald-200 bg-emerald-50/80 p-6 shadow-sm'>
            <div className='inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900'>
              Ingredient decisions
            </div>
            <h2 className='mt-4 text-2xl font-semibold text-slate-950'>
              Check ingredients before you buy, cook, or order.
            </h2>
            <p className='mt-3 text-sm leading-7 text-slate-700'>
              Paste an ingredient list and get conservative guidance built for everyday label
              reading. The scanner is here to help you slow down, spot likely issues, and take
              the safest next step when the answer is not obvious.
            </p>
            <div className='mt-5 rounded-2xl border border-emerald-200 bg-white p-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
                Scanner mindset
              </p>
              <ul className='mt-3 space-y-2 text-sm text-slate-700'>
                <li>Known risk: avoid</li>
                <li>Caution: verify before using</li>
                <li>Unknown: research before buying</li>
              </ul>
            </div>
            <a
              className='mt-6 inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700'
              href='/scanner'
            >
              Check ingredients
            </a>
            <p className='mt-4 text-xs leading-6 text-slate-600'>
              Educational support only. The scanner is designed to be conservative, not to
              promise guaranteed safety.
            </p>
          </aside>
        </section>

        <section className='grid gap-4 lg:grid-cols-[1.2fr_0.8fr]'>
          <div className='card border border-stone-200 bg-white p-6 shadow-sm'>
            <div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
                  Recipe-led next steps
                </p>
                <h2 className='mt-2 text-2xl font-semibold text-slate-950'>
                  Start with food, then understand why it may work.
                </h2>
              </div>
              <a
                className='inline-flex text-sm font-semibold text-emerald-700'
                href='/recipes'
              >
                See all recipes →
              </a>
            </div>

            <div className='mt-6 grid gap-4 md:grid-cols-2'>
              <a
                className='rounded-2xl border border-stone-200 bg-stone-50 p-5 transition hover:border-stone-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700'
                href='/recipes'
              >
                <h3 className='text-lg font-semibold text-slate-900'>Comfort recipes with context</h3>
                <p className='mt-2 text-sm leading-6 text-slate-600'>
                  Browse the recipe collection with substitutions, ingredient clarity, and notes
                  that support real meal decisions.
                </p>
              </a>
              <a
                className='rounded-2xl border border-stone-200 bg-stone-50 p-5 transition hover:border-stone-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700'
                href='/submit-recipe'
              >
                <h3 className='text-lg font-semibold text-slate-900'>Share what works in real life</h3>
                <p className='mt-2 text-sm leading-6 text-slate-600'>
                  Contribute recipe ideas for moderation and review without turning the homepage
                  into a submission-first experience.
                </p>
              </a>
            </div>
          </div>

          <div className='card border border-stone-200 bg-stone-100/70 p-6 shadow-sm'>
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
              Other starting points
            </p>
            <div className='mt-4 space-y-4'>
              {supportingGuides.map((item) => (
                <a
                  key={item.title}
                  className='block rounded-2xl border border-stone-200 bg-white p-4 transition hover:border-stone-300 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700'
                  href={item.href}
                >
                  <h3 className='text-base font-semibold text-slate-900'>{item.title}</h3>
                  <p className='mt-2 text-sm leading-6 text-slate-600'>{item.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <PreparednessResourcePanel
          eyebrow='Stay prepared'
          title='Keep dining and emergency tools within reach'
          description='If you already know the meal or ingredient question is only part of the problem, move directly into the practical tools that support restaurant conversations, intake paperwork, and emergency visibility.'
          links={[
            {
              href: '/downloads',
              label: 'Preparedness downloads',
              description:
                'Open the printable dining cards, wallet cards, and practical files without hunting through deeper navigation.',
            },
            {
              href: '/learn/wallet-card-guide',
              label: 'Wallet card guide',
              description:
                'Use a compact written backup when you need clinicians, family, or travel companions to scan the essentials quickly.',
            },
            {
              href: '/learn/medical-alert-tattoo',
              label: 'Medical alert guide',
              description:
                'Review visibility-focused preparedness options and when they may help as one layer of a broader emergency plan.',
            },
          ]}
        />

        <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          <a
            className='card block border border-stone-200 bg-white p-5 transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700'
            href='/learn/treatment-and-management'
          >
            <h2 className='text-lg font-semibold text-slate-900'>Preparedness and management</h2>
            <p className='mt-2 text-sm leading-6 text-slate-600'>
              Review practical educational guidance for daily avoidance strategies, treatment
              context, and staying prepared.
            </p>
          </a>
          <a
            className='card block border border-stone-200 bg-white p-5 transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700'
            href='/downloads'
          >
            <h2 className='text-lg font-semibold text-slate-900'>Dining and wallet tools</h2>
            <p className='mt-2 text-sm leading-6 text-slate-600'>
              Keep printable dining cards, wallet cards, and other practical resources within
              reach when you need them.
            </p>
          </a>
          <a
            className='card block border border-stone-200 bg-white p-5 transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 md:col-span-2 xl:col-span-1'
            href='/heat-map'
          >
            <h2 className='text-lg font-semibold text-slate-900'>
              Tick activity context <IconBrandTick className='inline-block align-text-bottom' size={18} />
            </h2>
            <p className='mt-2 text-sm leading-6 text-slate-600'>
              Check regional lone star tick activity when travel, prevention, or local context
              matters.
            </p>
          </a>
        </section>
      </div>
    </Layout>
  );
}

export const query = graphql`
  query HomePage {
    featuredRecipes: allMdx(
      filter: {
        internal: { contentFilePath: { regex: "/content/recipes/" } }
        frontmatter: { featured: { eq: true } }
      }
    ) {
      nodes {
        id
        frontmatter {
          title
          slug
          description
          image
          featured_order
        }
      }
    }
  }
`;

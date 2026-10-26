import React, { useEffect, useMemo, useState } from 'react';
import { graphql, PageProps } from 'gatsby';
import { Helmet } from 'react-helmet';
import { useAuth } from 'react-oidc-context';
import Layout from '../components/Layout';
import TrustNotice from '../components/TrustNotice';
import type {
  EditorialConfig,
  PublicDownloadAsset,
} from '../contracts/editorial';
import {
  DEFAULT_DOWNLOAD_ASSETS,
  getEditorialConfig,
  saveEditorialConfig,
} from '../services/editorial/config';
import { EDITOR_GROUPS, hasAllowedGroup } from '../services/auth/access';

type RecipeNode = {
  id: string;
  frontmatter?: {
    title?: string | null;
    slug?: string | null;
    description?: string | null;
    featured_order?: number | null;
  } | null;
};

type EditorialPageData = {
  allMdx: {
    nodes: RecipeNode[];
  };
};

const clientId = process.env.GATSBY_COGNITO_CLIENT_ID || '';
const logoutUri =
  process.env.GATSBY_COGNITO_LOGOUT_URI ||
  process.env.GATSBY_COGNITO_REDIRECT_URI ||
  '';
const cognitoDomain = process.env.GATSBY_COGNITO_DOMAIN || '';
const initialConfig: EditorialConfig = {
  featured_recipes: [],
  resource_overrides: [],
};

function EditorialInner({ data }: PageProps<EditorialPageData>) {
  const auth = useAuth();
  const [config, setConfig] = useState<EditorialConfig>(initialConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const groups =
    (auth.user?.profile?.['cognito:groups'] as string[] | undefined) ?? [];
  const isAuthorized =
    auth.isAuthenticated && hasAllowedGroup(groups, EDITOR_GROUPS);

  const recipes = useMemo(
    () =>
      data.allMdx.nodes.filter(
        (node) =>
          node.frontmatter?.slug &&
          node.frontmatter?.title &&
          node.frontmatter.slug.startsWith('/recipes/')
      ),
    [data.allMdx.nodes]
  );

  const signOutRedirect = () => {
    if (!clientId || !logoutUri || !cognitoDomain) return;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  useEffect(() => {
    if (!isAuthorized) return;

    let cancelled = false;
    const loadConfig = async () => {
      setIsLoading(true);
      const response = await getEditorialConfig();
      if (cancelled) return;
      if (response.error) {
        setErrorMessage(response.error.recovery_guidance);
        setIsLoading(false);
        return;
      }
      setConfig(response.data ?? initialConfig);
      setIsLoading(false);
    };

    void loadConfig();

    return () => {
      cancelled = true;
    };
  }, [isAuthorized]);

  const featuredOrderFor = (slug: string): string => {
    const entry = config.featured_recipes.find((item) => item.recipe_slug === slug);
    return entry ? String(entry.featured_order) : '';
  };

  const resourceOverrideFor = (key: string) =>
    config.resource_overrides.find((entry) => entry.resource_key === key);

  const setFeaturedRecipeOrder = (slug: string, nextOrder: string) => {
    const parsed = Number(nextOrder);
    setConfig((current) => {
      const without = current.featured_recipes.filter(
        (entry) => entry.recipe_slug !== slug
      );
      if (!Number.isFinite(parsed) || parsed <= 0) {
        return { ...current, featured_recipes: without };
      }
      return {
        ...current,
        featured_recipes: [
          ...without,
          {
            recipe_slug: slug,
            featured_order: parsed,
          },
        ],
      };
    });
  };

  const setResourceOverride = (
    key: string,
    field: 'title_override' | 'description_override' | 'display_order',
    value: string
  ) => {
    setConfig((current) => {
      const existing = resourceOverrideFor(key) ?? {
        resource_key: key,
        title_override: null,
        description_override: null,
        display_order: Number.MAX_SAFE_INTEGER,
      };

      const nextEntry = {
        ...existing,
        [field]:
          field === 'display_order'
            ? Number(value) || Number.MAX_SAFE_INTEGER
            : value || null,
      };

      return {
        ...current,
        resource_overrides: [
          ...current.resource_overrides.filter((entry) => entry.resource_key !== key),
          nextEntry,
        ],
      };
    });
  };

  if (!clientId || !cognitoDomain) {
    return (
      <section className='card'>
        <h1 className='mb-2 text-2xl font-semibold'>Editorial access is not configured</h1>
        <p className='text-slate-700'>
          Set the Cognito environment variables used by the current auth flow
          before exposing protected editorial tools.
        </p>
      </section>
    );
  }

  if (auth.isLoading) {
    return <section className='card'>Loading editorial access…</section>;
  }

  if (auth.error) {
    return <section className='card'>Authentication error: {auth.error.message}</section>;
  }

  if (!auth.isAuthenticated) {
    return (
      <section className='card space-y-4'>
        <h1 className='text-2xl font-semibold'>Protected editorial workflow</h1>
        <p className='text-slate-700'>
          This route is reserved for authorized editors updating trusted public
          surfaces such as featured recipes and download/resource metadata. It
          is not a member dashboard or a future consumer account area.
        </p>
        <button
          className='inline-flex items-center rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white'
          onClick={() => auth.signinRedirect()}
        >
          Sign in to edit
        </button>
      </section>
    );
  }

  if (!isAuthorized) {
    return (
      <section className='card space-y-4'>
        <h1 className='text-2xl font-semibold'>You do not have editorial access</h1>
        <p className='text-slate-700'>
          This account is signed in, but it is not assigned to the `editors`
          group required for featured-content and resource updates.
        </p>
        <button
          className='inline-flex items-center rounded-full border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-700'
          onClick={signOutRedirect}
        >
          Sign out
        </button>
      </section>
    );
  }

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSaving(true);

    const normalized: EditorialConfig = {
      featured_recipes: [...config.featured_recipes].sort(
        (left, right) => left.featured_order - right.featured_order
      ),
      resource_overrides: [...config.resource_overrides].sort(
        (left, right) => left.display_order - right.display_order
      ),
    };

    const response = await saveEditorialConfig(normalized);
    if (response.error) {
      setErrorMessage(response.error.recovery_guidance);
      setIsSaving(false);
      return;
    }

    setConfig(response.data ?? normalized);
    setSuccessMessage(
      'Editorial settings saved. Public pages will reflect these metadata updates after hydration.'
    );
    setIsSaving(false);
  };

  return (
    <div className='space-y-8'>
      <section className='card'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
          <div>
            <h1 className='mb-2 text-3xl font-bold'>Editorial controls</h1>
            <p className='max-w-3xl text-slate-700'>
              Curate featured recipes and public resource metadata without
              reopening moderation or changing stable public download paths.
            </p>
          </div>
          <button
            className='inline-flex items-center rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-slate-700'
            onClick={signOutRedirect}
            type='button'
          >
            Sign out
          </button>
        </div>
      </section>

      <TrustNotice title='Editorial Guardrails' tone='amber'>
        <p>
          These controls update trusted public presentation only. They do not
          approve community submissions, bypass moderation, or replace the
          site&apos;s educational-only posture.
        </p>
      </TrustNotice>

      {errorMessage ? (
        <section className='rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900'>
          {errorMessage}
        </section>
      ) : null}

      {successMessage ? (
        <section className='rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900'>
          {successMessage}
        </section>
      ) : null}

      {isLoading ? (
        <section className='card'>Loading editorial settings…</section>
      ) : (
        <form className='space-y-8' onSubmit={handleSave}>
          <section className='card space-y-5'>
            <div>
              <h2 className='text-xl font-semibold'>Featured recipes</h2>
              <p className='mt-2 text-sm text-slate-600'>
                Assign a positive order number to place a recipe into public
                featured surfaces. Clearing the field removes it from editorial
                featuring without changing recipe content.
              </p>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              {recipes.map((recipe) => {
                const fm = recipe.frontmatter!;
                return (
                  <label
                    key={recipe.id}
                    className='rounded-2xl border border-stone-200 bg-white p-4'
                  >
                    <span className='block text-base font-semibold text-slate-900'>
                      {fm.title}
                    </span>
                    {fm.description ? (
                      <span className='mt-2 block text-sm text-slate-600'>
                        {fm.description}
                      </span>
                    ) : null}
                    <span className='mt-4 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
                      Featured order
                    </span>
                    <input
                      className='mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200'
                      min='1'
                      onChange={(event) =>
                        setFeaturedRecipeOrder(
                          fm.slug ?? '',
                          event.target.value
                        )
                      }
                      placeholder='Leave blank to keep out of featured lists'
                      type='number'
                      value={featuredOrderFor(fm.slug ?? '')}
                    />
                  </label>
                );
              })}
            </div>
          </section>

          <section className='card space-y-5'>
            <div>
              <h2 className='text-xl font-semibold'>Download and resource metadata</h2>
              <p className='mt-2 text-sm text-slate-600'>
                Update labels, descriptions, and display order for public
                download/resource cards while keeping their underlying public
                file paths stable.
              </p>
            </div>

            <div className='space-y-4'>
              {DEFAULT_DOWNLOAD_ASSETS.map((asset: PublicDownloadAsset) => {
                const override = resourceOverrideFor(asset.key);
                return (
                  <section
                    key={asset.key}
                    className='rounded-2xl border border-stone-200 bg-white p-4'
                  >
                    <div className='grid gap-4 lg:grid-cols-[0.9fr_1.1fr_0.45fr]'>
                      <label className='block'>
                        <span className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
                          Public title
                        </span>
                        <input
                          className='mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200'
                          onChange={(event) =>
                            setResourceOverride(
                              asset.key,
                              'title_override',
                              event.target.value
                            )
                          }
                          placeholder={asset.label}
                          type='text'
                          value={override?.title_override ?? ''}
                        />
                      </label>

                      <label className='block'>
                        <span className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
                          Public description
                        </span>
                        <textarea
                          className='mt-2 min-h-24 w-full rounded-xl border border-stone-300 px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200'
                          onChange={(event) =>
                            setResourceOverride(
                              asset.key,
                              'description_override',
                              event.target.value
                            )
                          }
                          placeholder={asset.description}
                          value={override?.description_override ?? ''}
                        />
                      </label>

                      <label className='block'>
                        <span className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
                          Display order
                        </span>
                        <input
                          className='mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200'
                          min='1'
                          onChange={(event) =>
                            setResourceOverride(
                              asset.key,
                              'display_order',
                              event.target.value
                            )
                          }
                          placeholder='999'
                          type='number'
                          value={
                            override &&
                            Number.isFinite(override.display_order) &&
                            override.display_order !== Number.MAX_SAFE_INTEGER
                              ? String(override.display_order)
                              : ''
                          }
                        />
                      </label>
                    </div>

                    <p className='mt-3 text-xs text-slate-500'>
                      Stable public path: <code>{asset.file}</code>
                    </p>
                  </section>
                );
              })}
            </div>
          </section>

          <div className='flex justify-end'>
            <button
              className='inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-400'
              disabled={isSaving}
              type='submit'
            >
              {isSaving ? 'Saving editorial settings...' : 'Save editorial settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function EditorialPage(props: PageProps<EditorialPageData>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Layout title='Editorial Controls'>
      <Helmet>
        <meta content='noindex, nofollow' name='robots' />
      </Helmet>
      {mounted ? (
        <EditorialInner {...props} />
      ) : (
        <section className='card'>Loading editorial workflow…</section>
      )}
    </Layout>
  );
}

export const query = graphql`
  query EditorialPageQuery {
    allMdx {
      nodes {
        id
        frontmatter {
          title
          slug
          description
          featured_order
        }
      }
    }
  }
`;

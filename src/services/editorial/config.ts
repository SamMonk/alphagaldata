import type {
  EditorialConfig,
  EditorialConfigResponseEnvelope,
  PublicDownloadAsset,
  SaveEditorialConfigRequest,
  SaveEditorialConfigResponseEnvelope,
} from '../../contracts/editorial';

// Editorial settings are operator-only workflow metadata.
// They intentionally do not represent public member preferences, private user
// materials, or any health-tracking profile state.
const STORAGE_KEY = 'alphagaldata:editorial-config';
const API_BASE_URL = process.env.GATSBY_API_BASE_URL?.replace(/\/$/, '') ?? '';
const EDITORIAL_ENDPOINT =
  process.env.GATSBY_EDITORIAL_CONFIG_URL ??
  (API_BASE_URL ? `${API_BASE_URL}/admin/editorial` : '');

const hasBrowser = (): boolean => typeof window !== 'undefined';

const makeId = (prefix: string): string =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const makeMeta = (editorial_source: 'api' | 'local_fallback') => ({
  request_id: makeId('req'),
  editorial_source,
});

const defaultEditorialConfig: EditorialConfig = {
  featured_recipes: [],
  resource_overrides: [],
};

export const DEFAULT_DOWNLOAD_ASSETS: PublicDownloadAsset[] = [
  {
    key: 'wallet-card',
    label: 'Wallet Card',
    file: '/downloads/ags_wallet_card_v1.pdf',
    format: 'PDF',
    size: '3.375 x 2.125 in',
    description:
      'Credit-card size. Lists mammalian allergens and safe alternatives.',
    preview: '/downloads/ags_wallet_card_v1.pdf',
    category: 'card',
  },
  {
    key: 'dining-card',
    label: 'Dining Card',
    file: '/downloads/ags_dining_card_v1.pdf',
    format: 'PDF',
    size: '6 x 4 in (landscape)',
    description:
      'Hand to restaurant staff. Covers meats, dairy, broths, cross-contact.',
    preview: '/downloads/ags_dining_card_v1.pdf',
    category: 'card',
  },
  {
    key: 'medical-alert-tattoo',
    label: 'Medical Alert Tattoo',
    file: '/downloads/ags_medical_alert_tattoo.svg',
    format: 'SVG',
    size: '3.5 x 1.5 in',
    description:
      'Full design with Star of Life, lone star tick, and medication warnings. For upper arm or chest.',
    preview: '/downloads/ags_medical_alert_tattoo.svg',
    category: 'tattoo',
  },
  {
    key: 'wrist-tattoo',
    label: 'Wrist Tattoo',
    file: '/downloads/ags_wrist_tattoo_simple.svg',
    format: 'SVG',
    size: '2.5 x 1 in',
    description:
      'Bold black-ink design for inner wrist. Optimized for temporary tattoo printing or permanent ink.',
    preview: '/downloads/ags_wrist_tattoo_simple.svg',
    category: 'tattoo',
  },
  {
    key: 'lone-star-tick-icon',
    label: 'Lone Star Tick Icon',
    file: '/favicon.svg',
    format: 'SVG',
    size: '64 x 64 px',
    description:
      'Brand icon — lone star tick with white dorsal marking. Use for stickers, merch, or awareness materials.',
    preview: '/favicon.svg',
    category: 'brand',
  },
];

const readLocalConfig = (): EditorialConfig => {
  if (!hasBrowser()) return defaultEditorialConfig;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultEditorialConfig;
    const parsed = JSON.parse(raw);
    return {
      featured_recipes: Array.isArray(parsed?.featured_recipes)
        ? parsed.featured_recipes
        : [],
      resource_overrides: Array.isArray(parsed?.resource_overrides)
        ? parsed.resource_overrides
        : [],
    };
  } catch {
    return defaultEditorialConfig;
  }
};

const writeLocalConfig = (config: EditorialConfig): void => {
  if (!hasBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

export const getEditorialConfig =
  async (): Promise<EditorialConfigResponseEnvelope> => {
    if (EDITORIAL_ENDPOINT) {
      try {
        const response = await fetch(EDITORIAL_ENDPOINT);
        if (response.ok) {
          const payload =
            (await response.json()) as EditorialConfigResponseEnvelope;
          if (payload?.meta && 'data' in payload && 'error' in payload) {
            return payload;
          }
        }
      } catch {
        // Fall through to the local editorial config in MVP environments.
      }
    }

    return {
      data: readLocalConfig(),
      meta: makeMeta('local_fallback'),
      error: null,
    };
  };

export const saveEditorialConfig = async (
  request: SaveEditorialConfigRequest
): Promise<SaveEditorialConfigResponseEnvelope> => {
  if (EDITORIAL_ENDPOINT) {
    try {
      const response = await fetch(EDITORIAL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      if (response.ok) {
        const payload =
          (await response.json()) as SaveEditorialConfigResponseEnvelope;
        if (payload?.meta && 'data' in payload && 'error' in payload) {
          return payload;
        }
      }
    } catch {
      // Fall through to the local editorial config in MVP environments.
    }
  }

  writeLocalConfig(request);
  return {
    data: request,
    meta: makeMeta('local_fallback'),
    error: null,
  };
};

export const applyFeaturedRecipeOverrides = <
  T extends { frontmatter?: { slug?: string | null; featured_order?: number | null } | null },
>(
  recipes: T[],
  config: EditorialConfig
): T[] => {
  if (config.featured_recipes.length === 0) return recipes;

  const orderMap = new Map(
    config.featured_recipes.map((entry) => [entry.recipe_slug, entry.featured_order])
  );

  return recipes
    .filter((recipe) => {
      const slug = recipe.frontmatter?.slug;
      return typeof slug === 'string' && orderMap.has(slug);
    })
    .sort((left, right) => {
      const leftOrder = orderMap.get(left.frontmatter?.slug ?? '') ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = orderMap.get(right.frontmatter?.slug ?? '') ?? Number.MAX_SAFE_INTEGER;
      return leftOrder - rightOrder;
    });
};

export const applyResourceOverrides = (
  assets: PublicDownloadAsset[],
  config: EditorialConfig
): PublicDownloadAsset[] => {
  const overrideMap = new Map(
    config.resource_overrides.map((entry) => [entry.resource_key, entry])
  );

  return [...assets]
    .map((asset) => {
      const override = overrideMap.get(asset.key);
      if (!override) return asset;

      return {
        ...asset,
        label: override.title_override?.trim() || asset.label,
        description: override.description_override?.trim() || asset.description,
      };
    })
    .sort((left, right) => {
      const leftOrder =
        overrideMap.get(left.key)?.display_order ?? Number.MAX_SAFE_INTEGER;
      const rightOrder =
        overrideMap.get(right.key)?.display_order ?? Number.MAX_SAFE_INTEGER;
      return leftOrder - rightOrder;
    });
};

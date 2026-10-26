export type EditorialFeaturedRecipe = {
  recipe_slug: string;
  featured_order: number;
};

export type EditorialResourceOverride = {
  resource_key: string;
  title_override: string | null;
  description_override: string | null;
  display_order: number;
};

export type EditorialConfig = {
  featured_recipes: EditorialFeaturedRecipe[];
  resource_overrides: EditorialResourceOverride[];
};

export type EditorialConfigMeta = {
  request_id: string;
  editorial_source: 'api' | 'local_fallback';
};

export type EditorialConfigError = {
  code: 'LOAD_FAILED' | 'SAVE_FAILED';
  message: string;
  recovery_guidance: string;
};

export type EditorialConfigResponseEnvelope = {
  data: EditorialConfig | null;
  meta: EditorialConfigMeta;
  error: EditorialConfigError | null;
};

export type SaveEditorialConfigRequest = EditorialConfig;

export type SaveEditorialConfigResponseEnvelope = {
  data: EditorialConfig | null;
  meta: EditorialConfigMeta;
  error: EditorialConfigError | null;
};

export type PublicDownloadAsset = {
  key: string;
  label: string;
  file: string;
  format: string;
  size: string;
  description: string;
  preview: string;
  category: 'card' | 'tattoo' | 'brand';
};

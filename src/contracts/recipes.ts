// Shared frontend contract for recipe save state.
//
// MVP persistence is device-local (localStorage) behind `src/services/recipes/saves.ts`.
// When authenticated accounts ship, this same shape will back an API Gateway wrapper
// targeting `/recipes/save` + `/recipes/unsave` against the `user_recipe_saves` table.
// Field names use snake_case to match the future backend payload contract.

export type RecipeSaveRecord = {
  recipe_slug: string;
  saved_at: string;
};

export type RecipeSaveState =
  | 'unsaved'
  | 'saving'
  | 'saved'
  | 'unsaving'
  | 'failed';

export type RecipeSaveErrorCode =
  | 'SAVE_FAILED'
  | 'UNSAVE_FAILED'
  | 'STORAGE_UNAVAILABLE';

export type RecipeSaveError = {
  code: RecipeSaveErrorCode;
  message: string;
  recovery_guidance: string;
};

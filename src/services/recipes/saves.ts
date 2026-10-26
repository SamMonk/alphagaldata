import type {
  RecipeSaveError,
  RecipeSaveErrorCode,
  RecipeSaveRecord,
} from '../../contracts/recipes';

// Device-local convenience only.
// This stores recipe slug + save timestamp, not a user profile, health record,
// or cross-device member state. If accounts ship later, keep that as a separate
// protected capability rather than expanding this browser-only storage silently.
const STORAGE_KEY = 'alphagaldata:saved-recipes';
const UPDATE_EVENT = 'alphagaldata:saved-recipes:updated';

const hasBrowser = (): boolean => typeof window !== 'undefined';

const makeError = (
  code: RecipeSaveErrorCode,
  message: string,
  recovery_guidance: string
): RecipeSaveError => ({ code, message, recovery_guidance });

const readAll = (): RecipeSaveRecord[] => {
  if (!hasBrowser()) return [];
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return [];
  }
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (record: unknown): record is RecipeSaveRecord =>
        typeof record === 'object' &&
        record !== null &&
        typeof (record as RecipeSaveRecord).recipe_slug === 'string' &&
        typeof (record as RecipeSaveRecord).saved_at === 'string'
    );
  } catch {
    return [];
  }
};

const writeAll = (records: RecipeSaveRecord[]): void => {
  if (!hasBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    const name = err instanceof Error ? err.name : '';
    throw makeError(
      name === 'QuotaExceededError' ? 'SAVE_FAILED' : 'STORAGE_UNAVAILABLE',
      'Your browser could not store this save.',
      'Free up some browser storage or try again in a private window.'
    );
  }
};

const broadcast = (): void => {
  if (!hasBrowser()) return;
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
};

export const listSaves = async (): Promise<RecipeSaveRecord[]> => {
  return readAll();
};

export const isSaved = async (recipe_slug: string): Promise<boolean> => {
  return readAll().some((record) => record.recipe_slug === recipe_slug);
};

export const saveRecipe = async (
  recipe_slug: string
): Promise<RecipeSaveRecord> => {
  if (!hasBrowser()) {
    throw makeError(
      'STORAGE_UNAVAILABLE',
      'Saving is not available in this environment.',
      'Try again from a supported browser.'
    );
  }
  const records = readAll();
  const existing = records.find((r) => r.recipe_slug === recipe_slug);
  if (existing) return existing;
  const record: RecipeSaveRecord = {
    recipe_slug,
    saved_at: new Date().toISOString(),
  };
  writeAll([...records, record]);
  broadcast();
  return record;
};

export const unsaveRecipe = async (recipe_slug: string): Promise<void> => {
  if (!hasBrowser()) {
    throw makeError(
      'STORAGE_UNAVAILABLE',
      'Removing a save is not available in this environment.',
      'Try again from a supported browser.'
    );
  }
  const records = readAll();
  const next = records.filter((r) => r.recipe_slug !== recipe_slug);
  if (next.length === records.length) return;
  writeAll(next);
  broadcast();
};

const noopUnsubscribe = () => undefined;

export const subscribe = (listener: () => void): (() => void) => {
  if (!hasBrowser()) return noopUnsubscribe;
  const handleUpdate = () => listener();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener(UPDATE_EVENT, handleUpdate);
  window.addEventListener('storage', handleStorage);
  return () => {
    window.removeEventListener(UPDATE_EVENT, handleUpdate);
    window.removeEventListener('storage', handleStorage);
  };
};

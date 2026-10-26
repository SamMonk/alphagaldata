import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  RecipeSaveError,
  RecipeSaveState,
} from '../../contracts/recipes';
import {
  isSaved,
  saveRecipe,
  subscribe,
  unsaveRecipe,
} from './saves';

type UseRecipeSaveResult = {
  state: RecipeSaveState;
  error: RecipeSaveError | null;
  save: () => Promise<void>;
  unsave: () => Promise<void>;
  toggle: () => Promise<void>;
};

const isRecipeSaveError = (value: unknown): value is RecipeSaveError =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as RecipeSaveError).code === 'string' &&
  typeof (value as RecipeSaveError).message === 'string';

export const useRecipeSave = (recipe_slug: string): UseRecipeSaveResult => {
  const [state, setState] = useState<RecipeSaveState>('unsaved');
  const [error, setError] = useState<RecipeSaveError | null>(null);
  const pendingRef = useRef(false);

  const refresh = useCallback(async () => {
    const saved = await isSaved(recipe_slug);
    setState((current) =>
      current === 'saving' || current === 'unsaving'
        ? current
        : saved
        ? 'saved'
        : 'unsaved'
    );
  }, [recipe_slug]);

  useEffect(() => {
    refresh();
    const unsubscribe = subscribe(() => {
      refresh();
    });
    return unsubscribe;
  }, [refresh]);

  const save = useCallback(async () => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setState('saving');
    setError(null);
    try {
      await saveRecipe(recipe_slug);
      setState('saved');
    } catch (err) {
      setState('failed');
      setError(
        isRecipeSaveError(err)
          ? err
          : {
              code: 'SAVE_FAILED',
              message: 'We could not save this recipe right now.',
              recovery_guidance: 'Try again in a moment.',
            }
      );
    } finally {
      pendingRef.current = false;
    }
  }, [recipe_slug]);

  const unsave = useCallback(async () => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setState('unsaving');
    setError(null);
    try {
      await unsaveRecipe(recipe_slug);
      setState('unsaved');
    } catch (err) {
      setState('failed');
      setError(
        isRecipeSaveError(err)
          ? err
          : {
              code: 'UNSAVE_FAILED',
              message: 'We could not remove this save right now.',
              recovery_guidance: 'Try again in a moment.',
            }
      );
    } finally {
      pendingRef.current = false;
    }
  }, [recipe_slug]);

  const toggle = useCallback(async () => {
    if (pendingRef.current) return;
    if (state === 'saved') {
      await unsave();
    } else {
      await save();
    }
  }, [state, save, unsave]);

  return { state, error, save, unsave, toggle };
};

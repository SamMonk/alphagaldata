import * as React from 'react';
import { useRecipeSave } from '../services/recipes/useRecipeSave';
import type { RecipeSaveState } from '../contracts/recipes';

type RecipeSaveButtonProps = {
  recipeSlug: string;
  variant?: 'card' | 'detail';
};

type Label = { text: string; icon: string };

const labelFor = (state: RecipeSaveState): Label => {
  switch (state) {
    case 'saved':
      return { text: 'Saved', icon: '✓' };
    case 'saving':
      return { text: 'Saving…', icon: '…' };
    case 'unsaving':
      return { text: 'Removing…', icon: '…' };
    case 'failed':
      return { text: "Couldn't save — try again", icon: '!' };
    case 'unsaved':
    default:
      return { text: 'Save recipe', icon: '+' };
  }
};

const announcementFor = (state: RecipeSaveState): string => {
  switch (state) {
    case 'saved':
      return 'Recipe saved.';
    case 'unsaved':
      return 'Recipe removed from saved list.';
    case 'failed':
      return 'Save action failed. Try again.';
    default:
      return '';
  }
};

export default function RecipeSaveButton({
  recipeSlug,
  variant = 'card',
}: RecipeSaveButtonProps) {
  const { state, error, toggle } = useRecipeSave(recipeSlug);
  const isPending = state === 'saving' || state === 'unsaving';
  const isSaved = state === 'saved';
  const isFailed = state === 'failed';
  const label = labelFor(state);

  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed';
  const sizeClasses =
    variant === 'detail'
      ? 'min-h-[2.75rem] min-w-[11rem] px-5 py-2.5 text-base'
      : 'min-h-[2.75rem] min-w-[2.75rem] px-4 py-2 text-sm';

  const stateClasses = isFailed
    ? 'border border-red-300 bg-red-50 text-red-900 hover:bg-red-100'
    : isSaved
    ? 'border border-emerald-700 bg-white text-emerald-900 hover:bg-emerald-50'
    : 'border border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800';

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    void toggle();
  };

  const wrapperClasses =
    variant === 'detail'
      ? 'mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'
      : '';

  const content = (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={isSaved}
        aria-busy={isPending}
        className={`${baseClasses} ${sizeClasses} ${stateClasses}`}
      >
        <span aria-hidden="true" className="text-base leading-none">
          {label.icon}
        </span>
        <span>{label.text}</span>
      </button>
      {isFailed && error ? (
        <p className="mt-2 text-sm text-red-800">
          {error.message}{' '}
          <span className="text-red-700">{error.recovery_guidance}</span>
        </p>
      ) : null}
      <span
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {announcementFor(state)}
      </span>
    </>
  );

  if (variant === 'detail') {
    return (
      <div className={wrapperClasses}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-900">
          Keep this recipe
        </p>
        <p className="mt-1 text-sm leading-6 text-slate-700">
          Save it to your device so you can return after reviewing the safety context above.
        </p>
        <div className="mt-3">{content}</div>
        {isSaved ? (
          <a
            href="/saved-recipes"
            className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            View saved recipes →
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-col items-start">
      {content}
      {isSaved ? (
        <a
          href="/saved-recipes"
          className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          View saved recipes →
        </a>
      ) : null}
    </div>
  );
}

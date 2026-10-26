import * as React from 'react';

type RecipeSafetyNoteBlockProps = {
  summary?: string | null;
  safetyNotes?: string[];
  substitutions?: string[];
  cautionPoints?: string[];
};

const hasItems = (items?: string[] | null) => Array.isArray(items) && items.length > 0;

export default function RecipeSafetyNoteBlock({
  summary,
  safetyNotes = [],
  substitutions = [],
  cautionPoints = [],
}: RecipeSafetyNoteBlockProps) {
  const hasSummary = Boolean(summary?.trim());
  const hasSafetyNotes = hasItems(safetyNotes);
  const hasSubstitutions = hasItems(substitutions);
  const hasCautionPoints = hasItems(cautionPoints);

  return (
    <section
      aria-labelledby="recipe-safety-heading"
      className="rounded-[1.5rem] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-emerald-50/70 p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
            Safety note block
          </p>
          <h2 id="recipe-safety-heading" className="mt-2 text-2xl font-semibold text-slate-950">
            Understand why this recipe may work and where caution still applies.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Alpha-gal decisions are rarely all-or-nothing. This block keeps the known logic, uncertainty, substitutions, and safest next step attached to the recipe instead of scattering them across generic page sections.
          </p>
        </div>

        <div className="grid min-w-[13rem] gap-2 text-sm">
          <div className="rounded-2xl border border-emerald-200 bg-white px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-900">
              Status
            </p>
            <p className="mt-1 font-medium text-slate-900">Caution</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-white px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-900">
              Next action
            </p>
            <p className="mt-1 font-medium text-slate-900">Verify before using</p>
          </div>
        </div>
      </div>

      {hasSummary && (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-900">Immediate read</h3>
          <p className="mt-2 text-sm leading-7 text-slate-700">{summary}</p>
        </div>
      )}

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          {hasSafetyNotes && (
            <div className="rounded-2xl border border-stone-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-900">What is known</h3>
              <ul className="mt-3 space-y-3">
                {safetyNotes.map((note, index) => (
                  <li key={index} className="flex gap-3 text-sm leading-7 text-slate-700">
                    <span className="mt-1 shrink-0 text-emerald-700">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasSubstitutions && (
            <div className="rounded-2xl border border-stone-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-900">Substitutions that keep the logic intact</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                These swaps are meant to preserve the trust reasoning of the recipe, not just its flavor.
              </p>
              <ul className="mt-3 space-y-3">
                {substitutions.map((item, index) => (
                  <li key={index} className="flex gap-3 text-sm leading-7 text-slate-700">
                    <span className="mt-1 shrink-0 text-emerald-700">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-900">What may vary by person or product</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Packaged ingredient formulas, sourcing, and individual tolerance can change the outcome. That uncertainty should be treated as part of the decision, not hidden.
            </p>
            {hasCautionPoints ? (
              <ul className="mt-3 space-y-3">
                {cautionPoints.map((point, index) => (
                  <li key={index} className="flex gap-3 text-sm leading-7 text-slate-700">
                    <span className="mt-1 shrink-0 text-amber-700">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm leading-7 text-slate-700">
                No extra caution points are listed, but label changes and ingredient sourcing still need a real check.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
              Safest next step
            </p>
            <p className="mt-2 text-base font-semibold">Verify before using any ingredient that feels unclear.</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              This recipe is educational support, not a universal promise of safety. Keep the substitutions and caution points attached to your final decision.
            </p>
          </div>
        </div>
      </div>

      <details className="mt-5 rounded-2xl border border-stone-200 bg-white p-4">
        <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
          See the deeper trust explanation
        </summary>
        <div className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
          <p>
            The goal is not to sound more certain than the ingredients justify. The summary gives a quick read, while the detailed notes explain where the recipe may work, where substitutions matter, and where caution still belongs.
          </p>
          <p>
            Use the scanner or manufacturer verification whenever a packaged ingredient, seasoning blend, broth, dairy substitute, or prepared shortcut feels ambiguous.
          </p>
        </div>
      </details>
    </section>
  );
}

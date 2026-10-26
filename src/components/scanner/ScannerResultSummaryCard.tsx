import * as React from 'react';
import type {
  ScannerClassificationSummary,
  ScannerRiskTier,
} from '../../contracts/scanner';

type ScannerResultSummaryCardProps = {
  summary: ScannerClassificationSummary;
  ingredientCount: number;
  watchlistCount: number;
  resultCount: number;
};

const TIER_META: Record<
  ScannerRiskTier,
  { badge: string; border: string; background: string; text: string; label: string }
> = {
  known_risk: {
    badge: 'bg-red-200 text-red-900',
    border: 'border-red-300',
    background: 'bg-red-50',
    text: 'text-red-900',
    label: 'Known risk',
  },
  caution: {
    badge: 'bg-amber-200 text-amber-950',
    border: 'border-amber-300',
    background: 'bg-amber-50',
    text: 'text-amber-950',
    label: 'Caution',
  },
  unknown: {
    badge: 'bg-blue-200 text-blue-900',
    border: 'border-blue-300',
    background: 'bg-blue-50',
    text: 'text-blue-900',
    label: 'Unknown',
  },
};

const NEXT_ACTION_LABELS: Record<ScannerClassificationSummary['next_action'], string> =
  {
    avoid: 'Avoid',
    verify_before_using: 'Verify before using',
    research_before_buying: 'Research before buying',
  };

export default function ScannerResultSummaryCard({
  summary,
  ingredientCount,
  watchlistCount,
  resultCount,
}: ScannerResultSummaryCardProps) {
  const meta = TIER_META[summary.risk_tier];
  const nextAction = NEXT_ACTION_LABELS[summary.next_action];

  return (
    <section
      className={`rounded-2xl border p-4 ${meta.border} ${meta.background}`}
      aria-labelledby="scanner-summary-heading"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Scanner summary
          </p>
          <h3
            id="scanner-summary-heading"
            className={`mt-2 text-xl font-semibold ${meta.text}`}
          >
            {summary.message}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex min-h-11 items-center rounded-full px-3 py-2 text-sm font-semibold ${meta.badge}`}
          >
            {meta.label}
          </span>
          <span className="inline-flex min-h-11 items-center rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900">
            {nextAction}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/60 bg-white/80 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Ingredients checked
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {ingredientCount}
          </p>
        </div>
        <div className="rounded-xl border border-white/60 bg-white/80 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Findings shown
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {resultCount}
          </p>
        </div>
        <div className="rounded-xl border border-white/60 bg-white/80 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Watchlist entries
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {watchlistCount}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-700">
        Results use conservative educational language. If the ingredient source
        is still unclear, follow the next action instead of assuming the product
        is safe.
      </p>
    </section>
  );
}

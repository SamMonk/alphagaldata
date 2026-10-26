import * as React from 'react';
import type { ScannerClassification, ScannerRiskTier } from '../../contracts/scanner';

type ScannerClassificationListProps = {
  items: ScannerClassification[];
};

const GROUP_ORDER: ScannerRiskTier[] = ['known_risk', 'caution', 'unknown'];

const GROUP_LABELS: Record<ScannerRiskTier, string> = {
  known_risk: 'Known risk',
  caution: 'Caution',
  unknown: 'Unknown',
};

const TIER_META: Record<
  ScannerRiskTier,
  { border: string; background: string; text: string; chip: string }
> = {
  known_risk: {
    border: 'border-red-300',
    background: 'bg-red-50',
    text: 'text-red-900',
    chip: 'bg-red-200 text-red-900',
  },
  caution: {
    border: 'border-amber-300',
    background: 'bg-amber-50',
    text: 'text-amber-950',
    chip: 'bg-amber-200 text-amber-950',
  },
  unknown: {
    border: 'border-blue-300',
    background: 'bg-blue-50',
    text: 'text-blue-900',
    chip: 'bg-blue-200 text-blue-900',
  },
};

const NEXT_ACTION_LABELS: Record<ScannerClassification['next_action'], string> = {
  avoid: 'Avoid',
  verify_before_using: 'Verify before using',
  research_before_buying: 'Research before buying',
};

export default function ScannerClassificationList({
  items,
}: ScannerClassificationListProps) {
  const grouped = GROUP_ORDER.map((tier) => ({
    tier,
    items: items.filter((item) => item.risk_tier === tier),
  })).filter((group) => group.items.length > 0);

  return (
    <section aria-labelledby="scanner-findings-heading">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Structured findings
          </p>
          <h3
            id="scanner-findings-heading"
            className="mt-1 text-lg font-semibold text-slate-900"
          >
            Ingredient classifications
          </h3>
        </div>
        <p className="text-sm text-slate-600">
          Review the reason and next action for each flagged ingredient.
        </p>
      </div>

      <div className="mt-4 space-y-4">
        {grouped.map((group) => {
          const meta = TIER_META[group.tier];
          return (
            <div key={group.tier} className="space-y-3">
              <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${meta.chip}`}>
                {GROUP_LABELS[group.tier]}
              </div>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <article
                    key={`${item.risk_tier}-${item.ingredient_name}-${item.matched_text}`}
                    className={`rounded-2xl border p-4 ${meta.border} ${meta.background}`}
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className={`text-base font-semibold ${meta.text}`}>
                            {item.ingredient_name}
                          </h4>
                          <span className="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                            {NEXT_ACTION_LABELS[item.next_action]}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {item.explanation}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/70 bg-white/85 px-3 py-2 text-sm text-slate-700">
                        <span className="font-medium text-slate-900">
                          Matched text:
                        </span>{' '}
                        {item.matched_text}
                      </div>
                    </div>
                    {item.source_note ? (
                      <p className="mt-3 text-sm text-slate-600">
                        <span className="font-medium text-slate-900">
                          Source note:
                        </span>{' '}
                        {item.source_note}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

import * as React from 'react';
import type {
  ScannerClassification,
  ScannerClassificationSummary,
  ScannerRiskTier,
} from '../../contracts/scanner';

type ScannerEducationGuidanceProps = {
  summary: ScannerClassificationSummary;
  items: ScannerClassification[];
};

type GuidanceLink = {
  href: string;
  label: string;
  description: string;
};

const TIER_META: Record<
  ScannerRiskTier,
  {
    badge: string;
    border: string;
    background: string;
    heading: string;
    intro: string;
  }
> = {
  known_risk: {
    badge: 'bg-red-200 text-red-900',
    border: 'border-red-300',
    background: 'bg-red-50',
    heading: 'What to do after a known risk result',
    intro:
      'A known risk result is a signal to avoid the ingredient and move to safer alternatives, not to keep searching for reassurance on the same product.',
  },
  caution: {
    badge: 'bg-amber-200 text-amber-950',
    border: 'border-amber-300',
    background: 'bg-amber-50',
    heading: 'What to review after a caution result',
    intro:
      'A caution result usually means the ingredient name or sourcing can vary. Review the label closely and verify the source before using the product.',
  },
  unknown: {
    badge: 'bg-blue-200 text-blue-900',
    border: 'border-blue-300',
    background: 'bg-blue-50',
    heading: 'What to review after an unknown result',
    intro:
      'An unknown result is a normal scanner outcome when the source is still unclear. Treat it as a decision point and gather more context before buying.',
  },
};

const NEXT_ACTION_LABELS: Record<ScannerClassificationSummary['next_action'], string> =
  {
    avoid: 'Avoid',
    verify_before_using: 'Verify before using',
    research_before_buying: 'Research before buying',
  };

function buildPriorityLinks(
  summary: ScannerClassificationSummary,
  items: ScannerClassification[]
): GuidanceLink[] {
  const mentionsDiningRisk = items.some((item) => {
    const combined = [item.ingredient_name, item.explanation, item.source_note]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return /(broth|stock|grill|fryer|shared|restaurant|dining|butter|lard|tallow|sauce)/.test(
      combined
    );
  });

  const labelReadingLink: GuidanceLink = {
    href: '/learn/label-reading-and-cross-contamination',
    label:
      summary.next_action === 'avoid'
        ? 'Review hidden ingredient and label-reading guidance'
        : 'Review label-reading and hidden ingredient guidance',
    description:
      'Learn which ingredient wording deserves extra scrutiny and what to verify before buying.',
  };

  const diningLink: GuidanceLink = {
    href: mentionsDiningRisk
      ? '/learn/dining-card-guide'
      : '/learn/label-reading-and-cross-contamination',
    label: mentionsDiningRisk
      ? 'Check dining and shared-surface guidance'
      : 'Check cross-contamination guidance',
    description: mentionsDiningRisk
      ? 'Use the dining card flow when restaurant ingredients, broths, fats, or shared cooking surfaces are part of the risk.'
      : 'Review how otherwise safe ingredients can still become risky through shared prep surfaces, fryers, broths, and fats.',
  };

  const returnLink: GuidanceLink = {
    href:
      summary.next_action === 'avoid' ? '/recipes' : '/scanner',
    label:
      summary.next_action === 'avoid'
        ? 'Browse safer recipe ideas'
        : 'Return to scanner with a clearer ingredient panel',
    description:
      summary.next_action === 'avoid'
        ? 'Move to recipes with safety notes and substitutions instead of forcing a questionable product to work.'
        : 'Upload the ingredient panel, paste a cleaner ingredient list, or compare another product once you have more context.',
  };

  return [labelReadingLink, diningLink, returnLink];
}

export default function ScannerEducationGuidance({
  summary,
  items,
}: ScannerEducationGuidanceProps) {
  const meta = TIER_META[summary.risk_tier];
  const guidanceLinks = buildPriorityLinks(summary, items);
  const knownCount = items.filter((item) => item.risk_tier === 'known_risk').length;
  const cautionCount = items.filter((item) => item.risk_tier === 'caution').length;
  const unknownCount = items.filter((item) => item.risk_tier === 'unknown').length;

  return (
    <section
      aria-labelledby="scanner-guidance-heading"
      className={`rounded-2xl border p-4 ${meta.border} ${meta.background}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Next step guidance
          </p>
          <h3
            id="scanner-guidance-heading"
            className="mt-2 text-lg font-semibold text-slate-900"
          >
            {meta.heading}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">{meta.intro}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex min-h-11 items-center rounded-full px-3 py-2 text-sm font-semibold ${meta.badge}`}
          >
            {NEXT_ACTION_LABELS[summary.next_action]}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/70 bg-white/85 p-3 text-sm text-slate-700">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Label reading
          </p>
          <p className="mt-2">
            Watch for hidden terms, sourcing gaps, and formulation changes before assuming a product is safe.
          </p>
        </div>
        <div className="rounded-xl border border-white/70 bg-white/85 p-3 text-sm text-slate-700">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Cross-contamination
          </p>
          <p className="mt-2">
            Shared grills, fryers, broths, pans, and preparation surfaces can matter even when the ingredient list looks better.
          </p>
        </div>
        <div className="rounded-xl border border-white/70 bg-white/85 p-3 text-sm text-slate-700">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Current mix
          </p>
          <p className="mt-2">
            {knownCount} known risk, {cautionCount} caution, {unknownCount} unknown.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {guidanceLinks.map((link) => (
          <a
            key={link.href + link.label}
            href={link.href}
            className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            <span className="block text-base font-semibold text-slate-900">
              {link.label}
            </span>
            <span className="mt-2 block leading-6">{link.description}</span>
          </a>
        ))}
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-700">
        This follow-up guidance is educational support. Keep technical errors separate from uncertain ingredient outcomes, and use the linked guidance to decide what to verify next.
      </p>
    </section>
  );
}

import * as React from 'react';
import { PERSONAL_TRIGGERS, findPersonalTriggers } from '../../services/scanner/classify';

const STORAGE_KEY = 'agd_personal_triggers';

function readSaved(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function writeSaved(keys: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  } catch {
    // Storage blocked (private mode, site data off): the choice just won't persist.
  }
}

/** Personal triggers the reader has marked, kept in sync across every notice on the page. */
function usePersonalTriggers() {
  const [mine, setMine] = React.useState<string[]>([]);

  React.useEffect(() => {
    setMine(readSaved());
    const onChange = () => setMine(readSaved());
    window.addEventListener('agd-personal-triggers', onChange);
    return () => window.removeEventListener('agd-personal-triggers', onChange);
  }, []);

  const toggle = (key: string, on: boolean) => {
    const next = on ? Array.from(new Set([...readSaved(), key])) : readSaved().filter((k) => k !== key);
    writeSaved(next);
    setMine(next);
    window.dispatchEvent(new Event('agd-personal-triggers'));
  };

  return { mine, toggle };
}

type PersonalTriggerNoticeProps = {
  /** The ingredient text that was checked. */
  text: string;
};

/**
 * Shows ingredients from PERSONAL_TRIGGERS (e.g. carrageenan) separately from the alpha-gal
 * result. Matches are informational unless the reader has marked that trigger as their own.
 */
export default function PersonalTriggerNotice({ text }: PersonalTriggerNoticeProps) {
  const { mine, toggle } = usePersonalTriggers();
  const found = findPersonalTriggers(text);

  return (
    <section aria-labelledby="personal-triggers-heading" className="space-y-3">
      <p
        id="personal-triggers-heading"
        className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
      >
        Personal triggers
      </p>

      {PERSONAL_TRIGGERS.map((trigger) => {
        const hit = found.find((f) => f.trigger.key === trigger.key);
        const isMine = mine.includes(trigger.key);
        const checkboxId = `personal-trigger-${trigger.key}`;

        const box = hit
          ? isMine
            ? 'border-red-300 bg-red-50'
            : 'border-violet-200 bg-violet-50'
          : 'border-slate-200 bg-white';

        return (
          <article key={trigger.key} className={`rounded-2xl border p-4 ${box}`}>
            {hit ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className={`text-base font-semibold ${isMine ? 'text-red-900' : 'text-violet-950'}`}>
                    {isMine ? `Contains ${trigger.label.toLowerCase()}: one of your triggers` : `Contains ${trigger.label.toLowerCase()}`}
                  </h4>
                  <span className="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {isMine ? 'Avoid' : 'Not mammalian'}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-700">{trigger.explanation}</p>
                <p className="mt-2 text-sm text-slate-700">
                  <span className="font-medium text-slate-900">Matched text:</span> {hit.matched_text}
                </p>
              </>
            ) : (
              <p className="text-sm leading-6 text-slate-700">
                {isMine
                  ? `${trigger.label} wasn't found in this ingredient text. Check the full label, since scanned or pasted lists can be incomplete.`
                  : `${trigger.label} wasn't found. Some people with alpha-gal also react to it.`}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
              <label htmlFor={checkboxId} className="flex cursor-pointer items-center gap-2 text-slate-800">
                <input
                  id={checkboxId}
                  type="checkbox"
                  checked={isMine}
                  onChange={(e) => toggle(trigger.key, e.target.checked)}
                  className="h-4 w-4 accent-emerald-700"
                />
                I react to {trigger.label.toLowerCase()}
                <span className="text-xs text-slate-500">(saved only in this browser)</span>
              </label>
              <a href={trigger.learn_more} className="font-medium text-emerald-800 underline">
                About {trigger.label.toLowerCase()} and alpha-gal
              </a>
            </div>
          </article>
        );
      })}
    </section>
  );
}

import React from "react";

/**
 * Visual building blocks for MDX articles in content/articles/. They are passed to
 * every article through MDXProvider in src/templates/learn-article.tsx, so drafts can
 * use them without imports, e.g. <Callout tone="warning" title="...">...</Callout>.
 * Markdown (links, bold) works inside them.
 */

type WithChildren = { children?: React.ReactNode };

/** Lowercase, hyphenated id for a heading. Shared by the h2 override and the table of contents. */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (React.isValidElement(node)) return textOf((node.props as WithChildren).children);
  return "";
}

/** h2 with an id so the "On this page" links can jump to it. */
export function H2({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 id={props.id ?? slugify(textOf(children))} {...props}>
      {children}
    </h2>
  );
}

// ---------------------------------------------------------------- Callout

const CALLOUT_TONES = {
  info: { box: "border-sky-200 bg-sky-50", title: "text-sky-900", icon: "i" },
  tip: { box: "border-emerald-200 bg-emerald-50", title: "text-emerald-900", icon: "✓" },
  warning: { box: "border-amber-300 bg-amber-50", title: "text-amber-900", icon: "!" },
  emergency: { box: "border-red-300 bg-red-50", title: "text-red-900", icon: "!" },
} as const;

type CalloutProps = WithChildren & { tone?: keyof typeof CALLOUT_TONES; title?: string };

export function Callout({ tone = "info", title, children }: CalloutProps) {
  const t = CALLOUT_TONES[tone] ?? CALLOUT_TONES.info;
  return (
    <aside className={`not-prose my-8 flex gap-4 rounded-2xl border p-5 ${t.box}`} role={tone === "emergency" ? "note" : undefined}>
      <span
        aria-hidden="true"
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white font-bold ${t.title}`}
      >
        {t.icon}
      </span>
      <div className="min-w-0 space-y-2 text-[0.95rem] leading-7 text-slate-800 [&_a]:font-medium [&_a]:underline">
        {title ? <p className={`font-semibold ${t.title}`}>{title}</p> : null}
        {children}
      </div>
    </aside>
  );
}

// ------------------------------------------------------------ At a glance

export function AtAGlance({ title = "At a glance", children }: WithChildren & { title?: string }) {
  return (
    <section className="not-prose my-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">{title}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function Fact({ label, children }: WithChildren & { label: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <div className="mt-1 text-sm leading-6 text-slate-700 [&_a]:underline">{children}</div>
    </div>
  );
}

// ------------------------------------------------------------- Plate guide

const PLATE_LEVELS = {
  fine: {
    label: "Usually fine",
    hint: "if cooked plain",
    head: "bg-emerald-600",
    dot: "bg-emerald-500",
    ring: "border-emerald-200",
  },
  ask: {
    label: "Ask how it was made",
    hint: "often hides butter, milk, or meat stock",
    head: "bg-amber-500",
    dot: "bg-amber-400",
    ring: "border-amber-200",
  },
  avoid: {
    label: "Often contains mammal",
    hint: "pork, beef, lard, or gelatin",
    head: "bg-red-600",
    dot: "bg-red-500",
    ring: "border-red-200",
  },
} as const;

/** Three-column "traffic light" guide. Children are <PlateGroup>s. */
export function PlateGuide({ children }: WithChildren) {
  return <div className="not-prose my-8 grid gap-4 md:grid-cols-3">{children}</div>;
}

export function PlateGroup({ level, children }: WithChildren & { level: keyof typeof PLATE_LEVELS }) {
  const l = PLATE_LEVELS[level];
  return (
    <section className={`overflow-hidden rounded-2xl border bg-white ${l.ring}`}>
      <header className={`${l.head} px-4 py-3 text-white`}>
        <p className="font-semibold">{l.label}</p>
        <p className="text-xs opacity-90">{l.hint}</p>
      </header>
      <ul className="divide-y divide-slate-100">
        {React.Children.map(children, (child) =>
          React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<{ dot?: string }>, { dot: l.dot }) : child
        )}
      </ul>
    </section>
  );
}

export function PlateItem({ name, dot, children }: WithChildren & { name: string; dot?: string }) {
  return (
    <li className="flex gap-3 px-4 py-3">
      <span aria-hidden="true" className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${dot ?? "bg-slate-400"}`} />
      <div className="text-sm leading-6">
        <p className="font-semibold text-slate-900">{name}</p>
        {children ? <div className="text-slate-600 [&_a]:underline">{children}</div> : null}
      </div>
    </li>
  );
}

// ------------------------------------------------------------------- Steps

/** Numbered step cards. Children are <Step>s. */
export function Steps({ children }: WithChildren) {
  let n = 0;
  return (
    <ol className="not-prose my-8 space-y-3">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        n += 1;
        return React.cloneElement(child as React.ReactElement<{ n?: number }>, { n });
      })}
    </ol>
  );
}

export function Step({ title, n, children }: WithChildren & { title: string; n?: number }) {
  return (
    <li className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-700 font-semibold text-white"
      >
        {n}
      </span>
      <div className="min-w-0 text-[0.95rem] leading-7 text-slate-700 [&_a]:underline">
        <p className="font-semibold text-slate-900">{title}</p>
        {children}
      </div>
    </li>
  );
}

// ---------------------------------------------------------------- Timeline

/** Vertical timeline. Children are <When>s. */
export function Timeline({ children }: WithChildren) {
  return <ol className="not-prose relative my-8 ml-3 space-y-6 border-l-2 border-emerald-200 pl-6">{children}</ol>;
}

export function When({ label, title, children }: WithChildren & { label: string; title: string }) {
  return (
    <li className="relative">
      <span aria-hidden="true" className="absolute -left-[2.1rem] top-1 h-4 w-4 rounded-full border-4 border-white bg-emerald-600 shadow" />
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{title}</p>
      <div className="mt-1 space-y-2 text-[0.95rem] leading-7 text-slate-700 [&_a]:underline">{children}</div>
    </li>
  );
}

// --------------------------------------------------------------- Checklist

/** Tickable list (state lives only in the reader's browser tab). Children are <Check>s. */
export function Checklist({ title, children }: WithChildren & { title?: string }) {
  return (
    <section className="not-prose my-8 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
      {title ? <p className="font-semibold text-emerald-900">{title}</p> : null}
      <ul className="mt-3 space-y-2">{children}</ul>
    </section>
  );
}

export function Check({ children }: WithChildren) {
  const [done, setDone] = React.useState(false);
  return (
    <li>
      <label className="flex cursor-pointer gap-3 rounded-lg p-1 text-[0.95rem] leading-7 text-slate-800 hover:bg-white/70">
        <input
          type="checkbox"
          checked={done}
          onChange={(e) => setDone(e.target.checked)}
          className="mt-1.5 h-4 w-4 shrink-0 accent-emerald-700"
        />
        <span className={done ? "text-slate-500 line-through" : undefined}>{children}</span>
      </label>
    </li>
  );
}

// ------------------------------------------------------------------- Cards

/** Two-up card grid, e.g. for "what to ask" pairs. Children are <Card>s. */
export function CardGrid({ children }: WithChildren) {
  return <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">{children}</div>;
}

/** `badge` is a short label shown above the title, e.g. the type of study. */
export function Card({ title, badge, children }: WithChildren & { title: string; badge?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      {badge ? (
        <p className="mb-2 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">{badge}</p>
      ) : null}
      <p className="font-semibold text-slate-900">{title}</p>
      <div className="mt-2 space-y-2 text-[0.95rem] leading-7 text-slate-700 [&_a]:underline">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------- Bar list

/** Simple horizontal bar chart. Children are <Bar label="..." value={10.85} />; values are percentages. */
export function BarList({ title, note, children }: WithChildren & { title?: string; note?: string }) {
  const values = React.Children.toArray(children)
    .filter(React.isValidElement)
    .map((c) => Number((c.props as { value?: number }).value) || 0);
  const max = Math.max(1, ...values);
  return (
    <figure className="not-prose my-8 rounded-2xl border border-slate-200 bg-white p-5">
      {title ? <figcaption className="font-semibold text-slate-900">{title}</figcaption> : null}
      <ul className="mt-4 space-y-2">
        {React.Children.map(children, (child) =>
          React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<{ max?: number }>, { max }) : child
        )}
      </ul>
      {note ? <p className="mt-4 text-xs leading-5 text-slate-500">{note}</p> : null}
    </figure>
  );
}

export function Bar({ label, value, max = 100, highlight }: { label: string; value: number; max?: number; highlight?: boolean }) {
  return (
    <li className="grid grid-cols-[minmax(6rem,9rem)_1fr_3.5rem] items-center gap-3 text-sm">
      <span className={highlight ? "font-semibold text-slate-900" : "text-slate-700"}>{label}</span>
      <span className="h-3 rounded-full bg-slate-100" aria-hidden="true">
        <span
          className={`block h-3 rounded-full ${highlight ? "bg-amber-500" : "bg-emerald-600/70"}`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </span>
      <span className={`text-right tabular-nums ${highlight ? "font-semibold text-slate-900" : "text-slate-600"}`}>{value}%</span>
    </li>
  );
}

export const articleComponents = {
  BarList,
  Bar,
  h2: H2,
  Callout,
  AtAGlance,
  Fact,
  PlateGuide,
  PlateGroup,
  PlateItem,
  Steps,
  Step,
  Timeline,
  When,
  Checklist,
  Check,
  CardGrid,
  Card,
};

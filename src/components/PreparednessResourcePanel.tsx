import * as React from 'react';

type PreparednessLink = {
  href: string;
  label: string;
  description: string;
};

type PreparednessResourcePanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  links: PreparednessLink[];
};

export default function PreparednessResourcePanel({
  eyebrow,
  title,
  description,
  links,
}: PreparednessResourcePanelProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">{description}</p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {links.map((link) => (
          <a
            key={link.href + link.label}
            href={link.href}
            className="rounded-2xl border border-white/80 bg-white p-4 text-sm text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            <span className="block text-base font-semibold text-slate-900">
              {link.label}
            </span>
            <span className="mt-2 block leading-6">{link.description}</span>
          </a>
        ))}
      </div>

      <p className="mt-4 text-xs leading-6 text-slate-600">
        Educational support only. These links keep practical tools close at hand without replacing ingredient checks, clinician guidance, or direct confirmation in stressful situations.
      </p>
    </section>
  );
}

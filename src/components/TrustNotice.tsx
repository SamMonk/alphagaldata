import React from 'react';

type TrustNoticeProps = {
  title: string;
  tone?: 'amber' | 'teal' | 'slate';
  children: React.ReactNode;
};

const toneStyles = {
  amber: 'border-amber-200 bg-amber-50 text-amber-950',
  teal: 'border-teal-200 bg-teal-50 text-teal-950',
  slate: 'border-slate-200 bg-slate-100 text-slate-900',
};

export default function TrustNotice({
  title,
  tone = 'amber',
  children,
}: TrustNoticeProps) {
  return (
    <section
      aria-label={title}
      className={`rounded-xl border p-4 text-sm leading-7 ${toneStyles[tone]}`}
    >
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em]">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

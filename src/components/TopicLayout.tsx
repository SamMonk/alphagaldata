import React from "react";
import Layout from "../components/Layout";
import { AUTHOR_SCHEMA, PUBLISHER_SCHEMA } from "./SEO";

type TopicLayoutProps = {
  title: string;
  description?: string;
  image?: string;
  /** ISO date (YYYY-MM-DD) the page was last checked against its sources. Shows the byline. */
  reviewed?: string;
  children: React.ReactNode;
};

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function TopicLayout({ title, description, image, reviewed, children }: TopicLayoutProps) {
  const schema = reviewed
    ? [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          ...(description && { description }),
          dateModified: reviewed,
          author: AUTHOR_SCHEMA,
          publisher: PUBLISHER_SCHEMA,
        },
      ]
    : undefined;

  return (
    <Layout title={title} description={description} image={image} ogType={reviewed ? "article" : undefined} schema={schema}>
      <article className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-teal-800 mb-2">{title}</h1>
        {description && <p className="max-w-2xl text-base leading-7 text-slate-700">{description}</p>}
        {reviewed ? (
          <p className="text-sm text-slate-500">
            By <a className="underline" href="/about/#who-we-are">Shawn Monk</a>, who lives with alpha-gal syndrome ·
            Checked against sources {formatDate(reviewed)} ·{" "}
            <a className="underline" href="/editorial-policy/">How we write and review</a>
          </p>
        ) : null}
        <div className="prose prose-slate max-w-none prose-p:leading-8 prose-li:leading-7 prose-headings:scroll-mt-24">
          {children}
        </div>
      </article>
    </Layout>
  );
}

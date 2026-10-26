import React from "react";
import Layout from "../components/Layout";

type TopicLayoutProps = {
  title: string;
  description?: string;
  image?: string;
  children: React.ReactNode;
};

export default function TopicLayout({ title, description, image, children }: TopicLayoutProps) {
  return (
    <Layout title={title} description={description} image={image}>
      <article className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-teal-800 mb-2">{title}</h1>
        {description && <p className="max-w-2xl text-base leading-7 text-slate-700">{description}</p>}
        <div className="prose prose-slate max-w-none prose-p:leading-8 prose-li:leading-7 prose-headings:scroll-mt-24">
          {children}
        </div>
      </article>
    </Layout>
  );
}

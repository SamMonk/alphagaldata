import React from "react";
import Layout from "../components/Layout";

type TopicLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function TopicLayout({ title, description, children }: TopicLayoutProps) {
  return (
    <Layout title={title}>
      <section className="max-w-3xl">
        <h1 className="text-3xl font-bold text-teal-800 mb-2">{title}</h1>
        {description && <p className="text-slate-700 mb-6">{description}</p>}
        <div className="prose prose-slate max-w-none">{children}</div>
      </section>
    </Layout>
  );
}


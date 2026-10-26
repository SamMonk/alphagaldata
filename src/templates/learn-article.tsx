import * as React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/Layout';

type ArticleTemplateData = {
  mdx?: {
    frontmatter?: {
      title?: string | null;
      description?: string | null;
      date?: string | null;
      updated?: string | null;
    } | null;
  } | null;
};

interface ArticleTemplateProps extends PageProps<ArticleTemplateData> {}

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({ data, children }) => {
  const frontmatter = data.mdx?.frontmatter;
  const title = frontmatter?.title ?? 'Alpha-gal resource';
  const description = frontmatter?.description ?? 'Alpha-gal resource';
  const publishDate = frontmatter?.date ? new Date(frontmatter.date) : null;
  const updatedDate = frontmatter?.updated ? new Date(frontmatter.updated) : publishDate;

  return (
    <Layout title={title} description={description}>
      <article className='prose prose-emerald mx-auto max-w-3xl prose-headings:scroll-mt-24 prose-headings:text-slate-900 prose-a:text-emerald-600 prose-p:leading-8 prose-li:leading-7'>
        <header className='not-prose mb-6 border-b border-slate-200 pb-4'>
          <p className='text-sm uppercase tracking-widest text-emerald-600 font-semibold'>Alpha-gal 101</p>
          <h1 className='text-3xl font-semibold text-slate-900 mt-2'>{title}</h1>
          <div className='text-xs text-slate-500 mt-3 flex flex-wrap gap-4'>
            {publishDate ? <span>Published {publishDate.toLocaleDateString()}</span> : null}
            {updatedDate && publishDate && updatedDate.getTime() !== publishDate.getTime() ? (
              <span>Updated {updatedDate.toLocaleDateString()}</span>
            ) : null}
          </div>
        </header>
        <div>{children}</div>
        <section className='not-prose mt-10 grid gap-4 border-t border-slate-200 pt-6 md:grid-cols-3'>
          <a className='card-link p-4 text-sm' href='/recipes'>
            <h2 className='text-base font-semibold text-slate-900'>What can I eat?</h2>
            <p className='mt-2 text-slate-600'>Move from education into recipe discovery when you are ready to act.</p>
          </a>
          <a className='card-link p-4 text-sm' href='/scanner'>
            <h2 className='text-base font-semibold text-slate-900'>Check ingredients</h2>
            <p className='mt-2 text-slate-600'>Use the scanner when a label or packaged ingredient list is the next decision.</p>
          </a>
          <a className='card-link p-4 text-sm' href='/downloads'>
            <h2 className='text-base font-semibold text-slate-900'>Dining cards & prep</h2>
            <p className='mt-2 text-slate-600'>Keep practical tools close once you finish reading the guide.</p>
          </a>
        </section>
      </article>
    </Layout>
  );
};

export const query = graphql`
  query ArticleTemplate($id: String!) {
    mdx(id: { eq: $id }) {
      id
      frontmatter {
        title
        description
        date
        updated
      }
    }
  }
`;

export default ArticleTemplate;

export const Head: React.FC<ArticleTemplateProps> = ({ data, location }) => {
  const frontmatter = data.mdx?.frontmatter;
  const title = frontmatter?.title ? `${frontmatter.title} | AlphaGalData` : 'AlphaGalData';
  const description = frontmatter?.description ?? 'Alpha-gal resources and ingredient data.';
  const url = `https://alphagaldata.com${location.pathname}`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: frontmatter?.title ?? 'AlphaGalData',
    description,
    ...(frontmatter?.date && { datePublished: frontmatter.date }),
    ...(frontmatter?.updated && { dateModified: frontmatter.updated }),
    author: { '@type': 'Organization', name: 'AlphaGalData', url: 'https://alphagaldata.com' },
    publisher: { '@type': 'Organization', name: 'AlphaGalData', url: 'https://alphagaldata.com' },
    mainEntityOfPage: url,
  };

  return (
    <>
      <title>{title}</title>
      <meta name='description' content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="AlphaGalData" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <script type="application/ld+json">
        {JSON.stringify(articleJsonLd)}
      </script>
    </>
  );
};

import * as React from 'react';
import { graphql, PageProps } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import Layout from '../components/Layout';
import { articleComponents, slugify } from '../components/article/ArticleBlocks';
import { AUTHOR_SCHEMA, PUBLISHER_SCHEMA } from '../components/SEO';

type TocItem = { title?: string; items?: TocItem[] };

type ArticleTemplateData = {
  mdx?: {
    tableOfContents?: { items?: TocItem[] } | null;
    body?: string | null;
    frontmatter?: {
      title?: string | null;
      description?: string | null;
      date?: string | null;
      updated?: string | null;
      category?: string | null;
      reviewer?: string | null;
      reviewed_date?: string | null;
    } | null;
  } | null;
};

interface ArticleTemplateProps extends PageProps<ArticleTemplateData> {}

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({ data, children }) => {
  const frontmatter = data.mdx?.frontmatter;
  const title = frontmatter?.title ?? 'Alpha-gal resource';
  const description = frontmatter?.description ?? 'Alpha-gal resource';
  // Noon local time so a YYYY-MM-DD date doesn't display as the previous day in US time zones.
  const toDate = (iso?: string | null) => (iso ? new Date(`${iso.slice(0, 10)}T12:00:00`) : null);
  const publishDate = toDate(frontmatter?.date);
  const updatedDate = toDate(frontmatter?.updated) ?? publishDate;
  const reviewedDate = toDate(frontmatter?.reviewed_date);
  const sections = (data.mdx?.tableOfContents?.items ?? []).filter(
    (item) => item.title && item.title !== 'Sources'
  );
  const words = (data.mdx?.body ?? '').replace(/<[^>]+>|\(https?:[^)]+\)/g, ' ').split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 230));

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    ...(frontmatter?.date && { datePublished: frontmatter.date }),
    ...((frontmatter?.updated || frontmatter?.reviewed_date) && {
      dateModified: frontmatter?.updated ?? frontmatter?.reviewed_date,
    }),
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_SCHEMA,
  };

  return (
    <Layout title={title} description={description} ogType='article' schema={[articleSchema]}>
      <article className='prose prose-emerald mx-auto max-w-3xl prose-headings:scroll-mt-24 prose-headings:text-slate-900 prose-a:text-emerald-600 prose-p:leading-8 prose-li:leading-7'>
        <header className='not-prose mb-6 border-b border-slate-200 pb-4'>
          <p className='text-sm uppercase tracking-widest text-emerald-600 font-semibold'>{frontmatter?.category ?? 'Alpha-gal 101'}</p>
          <h1 className='text-3xl font-semibold text-slate-900 mt-2'>{title}</h1>
          <div className='text-xs text-slate-500 mt-3 flex flex-wrap gap-4'>
            <span>
              By <a className='underline' href='/about/#who-we-are'>Shawn Monk</a>
            </span>
            {publishDate ? <span>Published {publishDate.toLocaleDateString()}</span> : null}
            {updatedDate && publishDate && updatedDate.getTime() !== publishDate.getTime() ? (
              <span>Updated {updatedDate.toLocaleDateString()}</span>
            ) : null}
            {frontmatter?.reviewer ? (
              <span>
                Reviewed by {frontmatter.reviewer === 'Shawn Monk' ? 'Shawn' : frontmatter.reviewer}
                {reviewedDate ? ` on ${reviewedDate.toLocaleDateString()}` : ''}
              </span>
            ) : null}
            {words > 0 ? <span>{minutes} min read</span> : null}
          </div>
        </header>
        {sections.length >= 3 ? (
          <nav aria-label='On this page' className='not-prose mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-4'>
            <p className='text-xs font-semibold uppercase tracking-widest text-slate-500'>On this page</p>
            <ul className='mt-3 flex flex-wrap gap-2'>
              {sections.map((item) => (
                <li key={item.title}>
                  <a
                    href={`#${slugify(item.title ?? '')}`}
                    className='inline-block rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 hover:border-emerald-300 hover:text-emerald-800'
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
        <MDXProvider components={articleComponents}>{children}</MDXProvider>
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
      body
      tableOfContents(maxDepth: 2)
      frontmatter {
        title
        description
        date
        updated
        category
        reviewer
        reviewed_date
      }
    }
  }
`;

export default ArticleTemplate;

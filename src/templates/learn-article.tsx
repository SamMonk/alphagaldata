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
      <article className='prose prose-emerald max-w-3xl mx-auto prose-headings:text-slate-900 prose-a:text-emerald-600'>
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
        <div className='prose'>{children}</div>
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

export const Head: React.FC<ArticleTemplateProps> = ({ data }) => {
  const frontmatter = data.mdx?.frontmatter;
  const title = frontmatter?.title ? `${frontmatter.title} | AlphaGalData` : 'AlphaGalData';
  const description = frontmatter?.description ?? 'Alpha-gal resources and ingredient data.';
  return (
    <>
      <title>{title}</title>
      <meta name='description' content={description} />
    </>
  );
};

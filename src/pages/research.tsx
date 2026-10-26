import React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/Layout';
import trialsData from '../data/research/trials.json';

type Study = {
  nctId: string;
  title: string;
  status: string;
  startDate?: string | null;
  sponsor?: string | null;
  studyType?: string | null;
  phases?: string[];
  locations?: string[];
  plainSummary?: string | null;
  url: string;
};

type ResearchPageData = {
  allMdx: {
    nodes: {
      id: string;
      frontmatter: { title: string; slug: string; date: string; description?: string | null };
    }[];
  };
};

const STATUS_LABELS: Record<string, string> = {
  RECRUITING: 'Recruiting',
  NOT_YET_RECRUITING: 'Not yet recruiting',
  ACTIVE_NOT_RECRUITING: 'Active, not recruiting',
  ENROLLING_BY_INVITATION: 'Enrolling by invitation',
  COMPLETED: 'Completed',
  TERMINATED: 'Terminated',
  WITHDRAWN: 'Withdrawn',
  SUSPENDED: 'Suspended',
  UNKNOWN: 'Status unknown',
};
const OPEN_STATUSES = new Set(['RECRUITING', 'NOT_YET_RECRUITING', 'ENROLLING_BY_INVITATION']);

function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function StudyCard({ study }: { study: Study }) {
  return (
    <li className='rounded-xl border border-slate-200 bg-white p-4'>
      <div className='flex flex-wrap items-center gap-2 text-xs'>
        <span
          className={`rounded-full px-2 py-0.5 font-semibold ${
            OPEN_STATUSES.has(study.status) ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-700'
          }`}
        >
          {STATUS_LABELS[study.status] ?? study.status}
        </span>
        <span className='text-slate-500'>{study.nctId}</span>
        {study.phases?.filter((p) => p !== 'NA').length ? (
          <span className='text-slate-500'>{study.phases.join(', ').replace(/PHASE/g, 'Phase ')}</span>
        ) : null}
      </div>
      <h3 className='mt-2 text-base font-semibold text-slate-900'>
        <a className='hover:underline' href={study.url} rel='noopener noreferrer' target='_blank'>
          {study.title}
        </a>
      </h3>
      {study.plainSummary ? <p className='mt-2 text-sm text-slate-700'>{study.plainSummary}</p> : null}
      <p className='mt-2 text-xs text-slate-500'>
        {[study.sponsor, study.startDate && `Started ${study.startDate}`, study.locations?.slice(0, 3).join(' · ')]
          .filter(Boolean)
          .join(' — ')}
      </p>
    </li>
  );
}

export default function ResearchPage({ data }: PageProps<ResearchPageData>) {
  const digests = data.allMdx.nodes;
  const studies = trialsData.studies as Study[];
  const open = studies.filter((s) => OPEN_STATUSES.has(s.status));
  const closed = studies.filter((s) => !OPEN_STATUSES.has(s.status));

  return (
    <Layout
      title='Alpha-Gal Research Tracker'
      description='Weekly plain-language summaries of new alpha-gal syndrome research from PubMed, plus a tracker of alpha-gal clinical trials from ClinicalTrials.gov.'
    >
      <div className='mx-auto max-w-4xl'>
        <header className='border-b border-slate-200 pb-6'>
          <p className='text-sm font-semibold uppercase tracking-widest text-emerald-600'>Research</p>
          <h1 className='mt-2 text-3xl font-semibold text-slate-900'>Alpha-gal research tracker</h1>
          <p className='mt-3 text-slate-700'>
            Alpha-gal syndrome research is moving fast. Each week we check PubMed for newly indexed studies and
            ClinicalTrials.gov for new or updated trials, then write a plain-language roundup of what was published and
            what it does (and does not) mean for people living with AGS. Every summary links to the original source.
          </p>
        </header>

        <section className='mt-8'>
          <h2 className='text-xl font-semibold text-slate-900'>Weekly research roundups</h2>
          {digests.length ? (
            <ul className='mt-4 space-y-4'>
              {digests.map((d) => (
                <li key={d.id}>
                  <a className='card-link block p-4' href={d.frontmatter.slug}>
                    <p className='text-xs text-slate-500'>{formatDate(d.frontmatter.date)}</p>
                    <h3 className='mt-1 text-base font-semibold text-slate-900'>{d.frontmatter.title}</h3>
                    {d.frontmatter.description ? (
                      <p className='mt-1 text-sm text-slate-600'>{d.frontmatter.description}</p>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className='mt-3 text-sm text-slate-600'>The first roundup is being reviewed and will appear here soon.</p>
          )}
        </section>

        <section className='mt-10'>
          <h2 className='text-xl font-semibold text-slate-900'>Alpha-gal clinical trials</h2>
          <p className='mt-2 text-sm text-slate-600'>
            Studies registered on ClinicalTrials.gov that focus on alpha-gal syndrome or tick-related meat allergy.
            {trialsData.updatedAt ? ` Last checked ${formatDate(trialsData.updatedAt)}.` : ''} Talk with your allergist
            before contacting a study team. Listing a study here is not an endorsement.
          </p>
          {open.length ? (
            <>
              <h3 className='mt-6 text-sm font-semibold uppercase tracking-wider text-slate-500'>
                Open or opening soon ({open.length})
              </h3>
              <ul className='mt-3 space-y-3'>
                {open.map((s) => (
                  <StudyCard key={s.nctId} study={s} />
                ))}
              </ul>
            </>
          ) : null}
          {closed.length ? (
            <>
              <h3 className='mt-6 text-sm font-semibold uppercase tracking-wider text-slate-500'>
                Completed and other studies ({closed.length})
              </h3>
              <ul className='mt-3 space-y-3'>
                {closed.map((s) => (
                  <StudyCard key={s.nctId} study={s} />
                ))}
              </ul>
            </>
          ) : null}
          {!studies.length ? <p className='mt-3 text-sm text-slate-600'>Trial listings are being reviewed.</p> : null}
        </section>

        <section className='mt-10 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700'>
          <h2 className='text-base font-semibold text-slate-900'>How we put this together</h2>
          <p className='mt-2'>
            New studies are pulled automatically from the National Library of Medicine&apos;s PubMed database and from
            ClinicalTrials.gov. A draft summary is written from each study&apos;s published abstract, then a person on our
            team reviews every summary against the source before it is published. We summarize abstracts, not full
            papers, and we say so when a finding is preliminary, small, or from animal or lab work. Spot an error?{' '}
            <a className='text-emerald-700 underline' href='/contact'>
              Tell us
            </a>
            . This page is educational and is not medical advice.
          </p>
        </section>
      </div>
    </Layout>
  );
}

export const query = graphql`
  query ResearchPage {
    allMdx(
      filter: { internal: { contentFilePath: { regex: "/content/research/" } } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        id
        frontmatter {
          title
          slug
          date
          description
        }
      }
    }
  }
`;

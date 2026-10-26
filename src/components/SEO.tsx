import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from '@reach/router';

type SEOProps = {
  description?: string;
  title?: string;
  url?: string;
  image?: string;
  type?: string;
  noindex?: boolean;
  /** Page-specific JSON-LD (Article, Recipe, …) in addition to Organization/WebSite. */
  schema?: Record<string, unknown>[];
};

const SITE_URL = 'https://alphagaldata.com';
const SITE_NAME = 'AlphaGalData';
const DEFAULT_DESCRIPTION = 'Evidence-based resources, maps, and tools for the alpha-gal community.';

export const PUBLISHER_SCHEMA = { '@type': 'Organization', name: SITE_NAME, url: SITE_URL };

// Default author for articles: Shawn lives with AGS and is responsible for the site's content.
export const AUTHOR_SCHEMA = {
  '@type': 'Person',
  name: 'Shawn Monk',
  url: `${SITE_URL}/about/`,
};

// Organization + WebSite schema — included on every page
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  sameAs: [],
};

const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
};

// The site's single source for <head> tags. Pages must not also export a Gatsby
// `Head` that sets title/description/canonical, or those tags get duplicated.
export default function SEO({ description, title, url, image, type, noindex, schema = [] }: SEOProps) {
  const { pathname } = useLocation();
  const canonical = url || `${SITE_URL}${pathname}`;
  const desc = description || DEFAULT_DESCRIPTION;
  const ogType = type || 'website';
  const ogImage = image || `${SITE_URL}/pins/newly-diagnosed.png`;

  return (
    <Helmet>
      <meta name='viewport' content='width=device-width, initial-scale=1'/>
      <meta name='description' content={desc}/>
      {!noindex && <link rel='canonical' href={canonical}/>}
      {/* Index policy — thin/functional/personal pages are excluded from search */}
      {noindex && <meta name='robots' content='noindex, follow'/>}
      {/* Favicons */}
      <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
      <link rel="alternate icon" href="/icon.png" type="image/png"/>
      <meta name="theme-color" content="#0f766e"/>
      {/* Open Graph */}
      <meta property="og:type" content={ogType}/>
      {title && <meta property="og:title" content={title}/>}
      <meta property="og:description" content={desc}/>
      <meta property="og:url" content={canonical}/>
      <meta property="og:site_name" content={SITE_NAME}/>
      <meta property="og:image" content={ogImage}/>
      <meta property="og:image:width" content="1000"/>
      <meta property="og:image:height" content="1500"/>
      {/* Pinterest */}
      <meta name="pinterest-rich-pin" content="true"/>
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image"/>
      {title && <meta name="twitter:title" content={title}/>}
      <meta name="twitter:description" content={desc}/>
      <meta name="twitter:image" content={ogImage}/>
      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(webSiteSchema)}</script>
      {schema.map((item, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(item)}</script>
      ))}
    </Helmet>
  );
}

// FAQ schema for the FAQ page — renders FAQPage structured data
export function FAQSchema({ items }: { items: { question: string; answer: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(i => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: i.answer,
      },
    })),
  };
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// Article schema for learn pages
export function ArticleSchema({
  title,
  description,
  path,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${SITE_URL}${path}`,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    about: {
      '@type': 'MedicalCondition',
      name: 'Alpha-gal syndrome',
      alternateName: ['AGS', 'alpha-gal allergy', 'mammalian meat allergy'],
      associatedAnatomy: { '@type': 'AnatomicalStructure', name: 'Immune system' },
      cause: {
        '@type': 'MedicalCause',
        name: 'Tick bite (Amblyomma americanum)',
      },
    },
  };
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

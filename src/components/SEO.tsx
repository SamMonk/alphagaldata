import React from 'react';
import { Helmet } from 'react-helmet';

type SEOProps = {
  description?: string;
  title?: string;
  url?: string;
  image?: string;
  type?: string;
};

export default function SEO({ description, title, url, image, type }: SEOProps) {
  const defaultDescription = 'Evidence-based resources, maps, and tools for the alpha-gal community.';
  const desc = description || defaultDescription;
  const siteName = 'AlphaGalData';
  const ogType = type || 'website';

  return (
    <Helmet>
      <meta name='viewport' content='width=device-width, initial-scale=1'/>
      <meta name='description' content={desc}/>
      {/* Favicons */}
      <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
      <link rel="alternate icon" href="/icon.png" type="image/png"/>
      <meta name="theme-color" content="#0f766e"/>
      {/* Open Graph */}
      <meta property="og:type" content={ogType}/>
      {title && <meta property="og:title" content={title}/>}
      <meta property="og:description" content={desc}/>
      {url && <meta property="og:url" content={url}/>}
      <meta property="og:site_name" content={siteName}/>
      {image && <meta property="og:image" content={image}/>}
      {/* Twitter Card */}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'}/>
      {title && <meta name="twitter:title" content={title}/>}
      <meta name="twitter:description" content={desc}/>
      {image && <meta name="twitter:image" content={image}/>}
    </Helmet>
  );
}

import React from 'react';
import { Helmet } from 'react-helmet';

export default function SEO(){
  return (
    <Helmet>
      <meta name='viewport' content='width=device-width, initial-scale=1'/>
      <meta name='description' content='Evidence-based resources, maps, and tools for the alpha-gal community.'/>
      {/* Favicons */}
      <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
      <link rel="alternate icon" href="/icon.png" type="image/png"/>
      <meta name="theme-color" content="#0f766e"/>
    </Helmet>
  );
}

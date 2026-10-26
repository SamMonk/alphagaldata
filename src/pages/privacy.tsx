import React from 'react';
import Layout from '../components/Layout';

export default function PrivacyPage() {
  return (
    <Layout
      title='Privacy'
      description='How AlphaGalData handles data in the current MVP. Public routes remain login-free and we minimize sensitive data collection.'
    >
      <div className='card space-y-4'>
        <h1 className='text-2xl font-bold'>Privacy & Data</h1>
        <p>
          AlphaGalData treats health-related information as sensitive and keeps
          data collection narrow in the current MVP.
        </p>
        <p>
          Public routes such as recipes, scanner use, downloads, and learning
          content do not require a member account. Current browser-side storage
          is limited to workflow and convenience data such as saved recipe slugs
          or local fallback settings in development-oriented flows.
        </p>
        <p>
          Protected moderation and editorial routes are operator workflows, not
          consumer accounts. Future account or private-feature work, if pursued
          later, will require explicit privacy and trust decisions rather than
          being inferred from today&apos;s MVP behavior.
        </p>
      </div>
    </Layout>
  );
}

import React from 'react';
import Layout from '../components/Layout';

export default function SubmitRecipePage() {
  return (
    <Layout title='Submit a Recipe'>
      <div className='space-y-8'>
        <section className='card'>
          <h1 className='text-3xl font-bold mb-2'>Submit a safe recipe</h1>
          <p className='text-slate-700'>
            We are setting up a streamlined recipe submission workflow so new dishes can be added quickly and safely. For now, gather the details below
            so we can publish your recipe with complete ingredient context.
          </p>
        </section>

        <section className='card'>
          <h2 className='text-xl font-semibold mb-2'>Include these details</h2>
          <ul className='list-disc ml-6 space-y-1 text-slate-700'>
            <li>Recipe name, servings, and prep time.</li>
            <li>Full ingredient list with brand notes if needed.</li>
            <li>Step-by-step instructions and any safe substitutions.</li>
            <li>Optional: a photo and a short story about why this recipe matters.</li>
          </ul>
        </section>

        <section className='card'>
          <h2 className='text-xl font-semibold mb-2'>Submission workflow</h2>
          <p className='text-slate-700'>
            We plan to use a lightweight content management system with an S3 backend so recipes can be submitted without code changes. Once the CMS
            is wired up, we will link the secure submission form here.
          </p>
        </section>
      </div>
    </Layout>
  );
}

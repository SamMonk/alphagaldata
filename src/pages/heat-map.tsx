import React from 'react';
import Layout from '../components/Layout';
import HeatMap from '../components/HeatMap';

export default function HeatMapPage() {
  return (
    <Layout title='U.S. Heat Map'>
      <div className='space-y-6'>
        <section className='card'>
          <h1 className='text-3xl font-bold mb-2'>U.S. Heat Map</h1>
          <p className='text-slate-700'>
            Review regional signals for lone star tick activity and alpha-gal awareness. Use this alongside prevention steps and symptom education for a
            complete picture. Educational only; not medical advice.
          </p>
        </section>
        <section className='card'>
          <HeatMap />
        </section>
      </div>
    </Layout>
  );
}

import React from 'react';
import Layout from '../components/Layout';
import HeatMap from '../components/HeatMap';
import { IconBrandTick } from '../components/icons';

export default function HomePage() {
  return (
    <Layout title='AlphaGalData — Maps and Guides'>
      <div className='space-y-8'>
        <section className='card'>
          <h1 className='text-3xl font-bold mb-2'>Alpha-gal Syndrome (AGS): Data, Maps, and Plain-Language Guides</h1>
          <p className='text-slate-700'>Explore current distribution signals of the lone star tick <IconBrandTick className="inline-block align-text-bottom" size={18}/> and learn how to prevent bites, avoid triggers, and work with clinicians. Educational only; not medical advice.</p>
        </section>

        <section className='card'>
          <h2 className='text-xl font-semibold mb-3'>U.S. Heat Map</h2>
          <HeatMap />
        </section>

        <section className='grid gap-4 md:grid-cols-2'>
          <a className='card block hover:shadow-md transition' href='/learn/alpha-gal-101'>
            <h3 className='text-lg font-semibold'>Alpha-gal 101</h3>
            <p className='text-slate-700'>Primer on what AGS is and who’s affected.</p>
          </a>
          <a className='card block hover:shadow-md transition' href='/learn/symptoms-and-diagnosis'>
            <h3 className='text-lg font-semibold'>Symptoms & Diagnosis</h3>
            <p className='text-slate-700'>Recognize patterns and learn about testing.</p>
          </a>
          <a className='card block hover:shadow-md transition' href='/learn/treatment-and-management'>
            <h3 className='text-lg font-semibold'>Treatment & Management</h3>
            <p className='text-slate-700'>Practical avoidance and preparedness strategies.</p>
          </a>
          <a className='card block hover:shadow-md transition' href='/learn/prevention'>
            <h3 className='text-lg font-semibold'>Prevention</h3>
            <p className='text-slate-700'>Reduce tick exposure for you and your household.</p>
          </a>
        </section>

        <section className='card'>
          <h2 className='text-xl font-semibold mb-2'>More Resources</h2>
          <ul className='list-disc ml-6 space-y-1'>
            <li><a href='/learn/faq'>FAQ</a></li>
            <li><a href='/downloads'>Wallet and dining cards</a></li>
            <li><a href='/privacy'>Privacy and data handling</a></li>
          </ul>
        </section>
      </div>
    </Layout>
  );
}

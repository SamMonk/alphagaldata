import React from 'react';
import Layout from '../components/Layout';
import { IconBrandTick } from '../components/icons';

export default function HomePage() {
  return (
    <Layout title='AlphaGalData — Recipes, Tools, and Guides'>
      <div className='space-y-8'>
        <section className='card'>
          <div className='text-xs uppercase tracking-widest text-amber-700 font-semibold mb-2'>Safe cooking for alpha-gal</div>
          <h1 className='text-3xl font-bold mb-3'>Feel confident in the kitchen with safe, comforting recipes and data-backed guidance.</h1>
          <p className='text-slate-700 mb-6'>
            Our family-tested recipes are built for alpha-gal households, with ingredient clarity and notes on substitutions. Explore the latest guides,
            use the ingredient scanner, and check regional tick activity when you need context. Educational only; not medical advice.
          </p>
          <div className='flex flex-wrap gap-3'>
            <a className='inline-flex items-center rounded-full bg-emerald-600 text-white px-4 py-2 text-sm font-semibold' href='/recipes'>Browse safe recipes</a>
            <a className='inline-flex items-center rounded-full border border-emerald-600 text-emerald-700 px-4 py-2 text-sm font-semibold' href='/submit-recipe'>Submit a recipe</a>
            <a className='inline-flex items-center rounded-full border border-slate-300 text-slate-700 px-4 py-2 text-sm font-semibold' href='/heat-map'>View the heat map</a>
          </div>
        </section>

        <section className='grid gap-4 md:grid-cols-3'>
          <div className='card'>
            <h2 className='text-lg font-semibold mb-2'>Safe recipes, made for you</h2>
            <p className='text-slate-700'>Cooking guidance from my wife’s kitchen, tuned to avoid mammalian triggers.</p>
            <a className='mt-3 inline-flex text-emerald-700 font-semibold' href='/recipes'>See recipes →</a>
          </div>
          <div className='card'>
            <h2 className='text-lg font-semibold mb-2'>Ingredient scanner</h2>
            <p className='text-slate-700'>Check ingredient lists against our updated dataset before you buy or cook.</p>
            <a className='mt-3 inline-flex text-emerald-700 font-semibold' href='/scanner'>Try the scanner →</a>
          </div>
          <div className='card'>
            <h2 className='text-lg font-semibold mb-2'>Tick activity context</h2>
            <p className='text-slate-700'>Review regional signals from the lone star tick <IconBrandTick className='inline-block align-text-bottom' size={18}/> before travel or outdoor plans.</p>
            <a className='mt-3 inline-flex text-emerald-700 font-semibold' href='/heat-map'>Open heat map →</a>
          </div>
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
          <a className='card block hover:shadow-md transition' href='/learn/wallet-card-guide'>
            <h3 className='text-lg font-semibold'>Wallet Card Guide</h3>
            <p className='text-slate-700'>Carry a quick-reference summary for emergencies.</p>
          </a>
          <a className='card block hover:shadow-md transition' href='/learn/dining-card-guide'>
            <h3 className='text-lg font-semibold'>Dining Card Guide</h3>
            <p className='text-slate-700'>Explain AGS needs to restaurant teams with confidence.</p>
          </a>
        </section>

        <section className='card'>
          <h2 className='text-xl font-semibold mb-2'>More resources</h2>
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

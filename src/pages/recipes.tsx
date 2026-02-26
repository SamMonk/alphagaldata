import React from 'react';
import Layout from '../components/Layout';

export default function RecipesPage() {
  return (
    <Layout title='Safe Recipes'>
      <div className='space-y-8'>
        <section className='card'>
          <h1 className='text-3xl font-bold mb-2'>Safe recipes for alpha-gal households</h1>
          <p className='text-slate-700'>
            These recipes are designed around ingredient transparency, smart substitutions, and comfort-first cooking. As we publish more dishes from
            our family kitchen, you will be able to filter by meal type, prep time, and avoidance notes.
          </p>
        </section>

        <section className='grid gap-4 md:grid-cols-2'>
          <div className='card'>
            <h2 className='text-lg font-semibold mb-2'>Featured recipes</h2>
            <p className='text-slate-700'>
              We are curating the first batch of safe recipes now. Check back soon for the initial lineup and ongoing weekly additions.
            </p>
          </div>
          <div className='card'>
            <h2 className='text-lg font-semibold mb-2'>Submit a recipe</h2>
            <p className='text-slate-700'>
              Share your family favorite and include ingredient notes or safe swaps that made the meal work.
            </p>
            <a className='mt-3 inline-flex text-emerald-700 font-semibold' href='/submit-recipe'>Start a submission →</a>
          </div>
        </section>

        <section className='card'>
          <h2 className='text-xl font-semibold mb-2'>What makes a recipe “safe”</h2>
          <ul className='list-disc ml-6 space-y-1 text-slate-700'>
            <li>Clear ingredient lists that flag mammalian sources, gelatin, and hidden fats.</li>
            <li>Substitution notes for dairy fats, broths, and seasoning blends.</li>
            <li>Preparation tips to avoid cross-contact in shared kitchens.</li>
          </ul>
        </section>
      </div>
    </Layout>
  );
}

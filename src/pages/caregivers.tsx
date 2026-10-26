import React from 'react';
import Layout from '../components/Layout';

const caregiverActions = [
  {
    title: 'Plan meals with more confidence',
    description:
      'Use the recipe collection when you need practical food ideas that already account for common alpha-gal triggers.',
    href: '/recipes',
  },
  {
    title: 'Check labels before shopping',
    description:
      'Paste packaged ingredient lists into the scanner when you want a conservative read before buying or cooking.',
    href: '/scanner',
  },
  {
    title: 'Keep practical tools close',
    description:
      'Download dining cards, wallet cards, and other preparedness resources that help in real-world settings.',
    href: '/downloads',
  },
];

export default function CaregiversPage() {
  return (
    <Layout
      title='Caregiver Guide'
      description='A routed starting point for family members, partners, and helpers supporting someone living with alpha-gal syndrome.'
      noindex
    >
      <div className='max-w-4xl mx-auto space-y-8'>
        <section className='card space-y-4'>
          <div className='inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900'>
            Family and helper support
          </div>
          <h1 className='text-3xl font-bold text-slate-900'>
            A clearer starting point for caregivers, partners, and family members.
          </h1>
          <p className='text-lg leading-8 text-slate-700'>
            If you help shop, cook, plan meals, or prepare for appointments, this page
            gives you one routed place to start. AlphaGalData is an educational support
            resource: use it to understand the daily food decisions, ingredient checks,
            and preparedness tools that make life with alpha-gal easier to manage.
          </p>
        </section>

        <section className='grid gap-4 md:grid-cols-3'>
          {caregiverActions.map((item) => (
            <a
              key={item.title}
              className='card block hover:shadow-md transition-shadow'
              href={item.href}
            >
              <h2 className='text-lg font-semibold text-slate-900'>{item.title}</h2>
              <p className='mt-2 text-sm leading-6 text-slate-600'>{item.description}</p>
            </a>
          ))}
        </section>

        <section className='grid gap-4 md:grid-cols-2'>
          <div className='card'>
            <h2 className='text-xl font-semibold mb-3 text-slate-900'>What helps most</h2>
            <ul className='list-disc ml-6 space-y-2 text-slate-700'>
              <li>Learn which mammalian ingredients commonly cause problems and where they hide.</li>
              <li>Use practical tools like dining cards and wallet cards when meals or appointments feel stressful.</li>
              <li>Share testing and preparedness pages with the person’s clinician when more context is needed.</li>
            </ul>
          </div>
          <div className='card'>
            <h2 className='text-xl font-semibold mb-3 text-slate-900'>Next routes to visit</h2>
            <ul className='space-y-3 text-sm text-slate-700'>
              <li>
                <a className='font-semibold text-emerald-700' href='/learn'>
                  Learn to stay safe →
                </a>
                <div className='mt-1 text-slate-600'>Start with the condition overview, prevention, and management guides.</div>
              </li>
              <li>
                <a className='font-semibold text-emerald-700' href='/testing'>
                  Testing guide →
                </a>
                <div className='mt-1 text-slate-600'>Understand testing context, lab routes, and clinician follow-up.</div>
              </li>
              <li>
                <a className='font-semibold text-emerald-700' href='/downloads'>
                  Dining cards & prep →
                </a>
                <div className='mt-1 text-slate-600'>Download practical tools for restaurants, emergencies, and everyday support.</div>
              </li>
            </ul>
          </div>
        </section>

        <section className='rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950'>
          Educational only. AlphaGalData helps caregivers understand food, ingredient,
          and preparedness decisions, but it does not replace clinician guidance or
          individualized medical advice.
        </section>
      </div>
    </Layout>
  );
}

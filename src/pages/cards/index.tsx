import React, { FormEvent, useState } from 'react';
import Layout from '../../components/Layout';
import affiliates from '../../../config/affiliates.json';
import ingredients from '../../data/ingredients.json';

const unique = <T,>(values: T[]) => Array.from(new Set(values));

const printPartnerIds = unique([
  ...(affiliates.placements?.wallet_cards || []),
  ...(affiliates.placements?.dining_cards || []),
]);

const printPartners = printPartnerIds
  .map((id) => ({ id, ...affiliates.programs?.[id] }))
  .filter((partner): partner is { id: string; programId: string; url: string; description?: string } => Boolean(partner && partner.url));

const subscribeEndpoint = process.env.GATSBY_NEWSLETTER_ENDPOINT || '';

const CardsLandingPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!subscribeEndpoint) {
      setStatus('error');
      setMessage('Set GATSBY_NEWSLETTER_ENDPOINT to enable email capture.');
      return;
    }

    try {
      setStatus('loading');
      setMessage('');
      const response = await fetch(subscribeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`Subscription failed: ${response.status}`);
      }

      setStatus('success');
      setMessage('Check your inbox to confirm the subscription and download link.');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  const downloadLinks = [
    {
      label: 'Wallet Card (PDF)',
      href: '/downloads/ags_wallet_card_v1.pdf',
      description: 'Fits in any card slot so you can explain AGS quickly.'
    },
    {
      label: 'Dining Card (PDF)',
      href: '/downloads/ags_dining_card_v1.pdf',
      description: 'Hand to waitstaff to flag cross-contact and safe swaps.'
    }
  ];

  const highRiskCount = ingredients.items.filter(item => item.risk_level === 'avoid' || item.risk_level === 'high').length;

  return (
    <Layout title='Wallet & Dining Cards' description='Download wallet and dining cards for alpha-gal syndrome and stay updated with our ingredient risk tracker.'>
      <section className='max-w-3xl mx-auto space-y-10'>
        <header className='text-center space-y-4'>
          <h1 className='text-3xl font-bold text-slate-900'>Alpha-gal Wallet & Dining Cards</h1>
          <p className='text-lg text-slate-600'>Grab printable cards, get quarterly ingredient updates, and share safe-print partners with your care team.</p>
        </header>

        <div className='card space-y-4'>
          <h2 className='text-xl font-semibold text-slate-800'>Download the latest cards</h2>
          <ul className='grid gap-4 md:grid-cols-2'>
            {downloadLinks.map(link => (
              <li key={link.href} className='border rounded-md p-4 shadow-sm bg-white'>
                <h3 className='text-lg font-semibold text-slate-800'>{link.label}</h3>
                <p className='text-sm text-slate-600 mb-3'>{link.description}</p>
                <a
                  className='btn inline-block'
                  href={link.href}
                  target='_blank'
                  rel='noreferrer'
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
          <p className='text-xs text-slate-500'>Need custom messaging? Duplicate the PDF and edit in your preferred design tool or ask one of the print partners below.</p>
        </div>

        <div className='card space-y-4'>
          <h2 className='text-xl font-semibold text-slate-800'>Stay in the loop</h2>
          <p className='text-sm text-slate-600'>We add new ingredients, restaurant scripts, and care tips as fresh data rolls in. Drop your email to get quarterly updates plus instant access to the editable card templates.</p>
          <form onSubmit={handleSubmit} className='flex flex-col gap-3 md:flex-row'>
            <label className='sr-only' htmlFor='email'>Email</label>
            <input
              id='email'
              type='email'
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder='you@example.com'
              className='flex-1 rounded-md border border-slate-300 px-4 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200'
            />
            <button
              type='submit'
              className='btn'
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending…' : 'Send me the cards'}
            </button>
          </form>
          {message ? (
            <p className={`text-sm ${status === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>{message}</p>
          ) : null}
        </div>

        <div className='card space-y-6'>
          <div>
            <h2 className='text-xl font-semibold text-slate-800'>Print-ready partners</h2>
            <p className='text-sm text-slate-600'>We vet vendors that allow custom uploads, matte finishes, and fast reprints. Files open in a new tab with affiliate tracking where available.</p>
          </div>
          <div className='grid gap-4 md:grid-cols-2'>
            {printPartners.map((partner) => (
              <div key={partner.id} className='border rounded-md p-4 bg-white shadow-sm space-y-2'>
                <h3 className='text-lg font-semibold capitalize text-slate-800'>{partner.id}</h3>
                {partner.description ? <p className='text-sm text-slate-600'>{partner.description}</p> : null}
                <a className='btn inline-block' href={partner.url} target='_blank' rel='noreferrer'>Order prints</a>
                <p className='text-xs text-slate-500'>Program ID: {partner.programId}</p>
              </div>
            ))}
          </div>
          <p className='text-xs text-slate-500'>Some links are affiliate links. Read our <a className='underline' href='/disclosure'>disclosure</a> for details.</p>
        </div>

        <div className='card space-y-3'>
          <h2 className='text-xl font-semibold text-slate-800'>Ingredient watchlist</h2>
          <p className='text-sm text-slate-600'>Our automated pipeline now tracks <strong>{highRiskCount}</strong> high or avoid-risk ingredients. The dataset powers the `/learn` hub and the card templates so they stay current.</p>
          <a className='btn inline-block' href='/learn/alpha-gal-101-what-to-avoid'>Read the latest ingredient guide</a>
          <pre className='bg-slate-900 text-slate-100 text-xs p-4 rounded-md overflow-auto'>
            {JSON.stringify(ingredients.items.slice(0, 2), null, 2)}
          </pre>
        </div>
      </section>
    </Layout>
  );
};

export default CardsLandingPage;

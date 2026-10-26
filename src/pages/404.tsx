import React from 'react';
import Layout from '../components/Layout';

const SUGGESTIONS = [
  { href: '/learn/what-is-alpha-gal', label: 'What is alpha-gal syndrome?' },
  { href: '/recipes', label: 'Alpha-gal friendly recipes' },
  { href: '/scanner', label: 'Check an ingredient list' },
  { href: '/downloads', label: 'Free dining and wallet cards' },
  { href: '/learn/faq', label: 'Frequently asked questions' },
];

export default function NotFoundPage() {
  return (
    <Layout title='Page not found' description='This page could not be found on AlphaGalData.' noindex>
      <div className='prose max-w-2xl'>
        <h1>We couldn&apos;t find that page</h1>
        <p>
          The link may be old, or the page may have moved. These are the places most people are looking for:
        </p>
        <ul>
          {SUGGESTIONS.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
        <p>
          If a link on our site sent you here, please <a href='/contact'>let us know</a> so we can fix it.
        </p>
      </div>
    </Layout>
  );
}

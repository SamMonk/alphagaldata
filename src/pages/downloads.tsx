import React from 'react';
import Layout from '../components/Layout';
import affiliates from '../data/affiliates.json';

export default function DownloadsPage(){
  return (
    <Layout title='Downloads'>
      <div className='card'>
        <h1 className='text-2xl font-bold mb-4'>Downloads</h1>
        <ul className='list-disc ml-6 space-y-2'>
          {/* <li>
            <a href='/downloads/alphagal_cards_v1.pdf' target='_blank' rel='noreferrer'>Legacy: Wallet & Dining Cards (PDF, v1)</a>
          </li> */}
          <li>
            <a href='/downloads/ags_wallet_card_v1.pdf' target='_blank' rel='noreferrer'>Wallet Card (PDF)</a> — credit‑card size for printing
          </li>
          {/* Affiliate print options for Wallet Card */}
          <li className='ml-4 list-none'>
            <div className='flex flex-wrap gap-2 text-sm'>
              {affiliates.wallet?.vistaprint ? (
                <a className='btn' href={affiliates.wallet.vistaprint} target='_blank' rel='noreferrer'>Print Wallet Card at Vistaprint (affiliate)</a>
              ) : null}
              {affiliates.wallet?.moo ? (
                <a className='btn' href={affiliates.wallet.moo} target='_blank' rel='noreferrer'>Print Wallet Card at MOO (affiliate)</a>
              ) : null}
              {affiliates.wallet?.zazzle ? (
                <a className='btn' href={affiliates.wallet.zazzle} target='_blank' rel='noreferrer'>Print Wallet Card at Zazzle (affiliate)</a>
              ) : null}
            </div>
          </li>
          <li>
            <a href='/downloads/ags_dining_card_v1.pdf' target='_blank' rel='noreferrer'>Dining Card (PDF)</a> — 4×6 in landscape for restaurants
          </li>
          {/* Affiliate print options for Dining Card */}
          <li className='ml-4 list-none'>
            <div className='flex flex-wrap gap-2 text-sm'>
              {affiliates.dining?.vistaprint ? (
                <a className='btn' href={affiliates.dining.vistaprint} target='_blank' rel='noreferrer'>Print Dining Card at Vistaprint (affiliate)</a>
              ) : null}
              {affiliates.dining?.moo ? (
                <a className='btn' href={affiliates.dining.moo} target='_blank' rel='noreferrer'>Print Dining Card at MOO (affiliate)</a>
              ) : null}
              {affiliates.dining?.zazzle ? (
                <a className='btn' href={affiliates.dining.zazzle} target='_blank' rel='noreferrer'>Print Dining Card at Zazzle (affiliate)</a>
              ) : null}
            </div>
          </li>
        </ul>
        <div className='text-sm text-slate-600 mt-4'>
          Tip: If the new cards are missing, run <code>npm run tasks:cards</code> to regenerate PDFs. The dining card is sized 6×4 inches (landscape). When printing, select landscape orientation or rotate to fit.
        </div>
        <div className='text-xs text-slate-500 mt-2'>Some links above are affiliate links. See our <a className='underline' href='/disclosure'>Disclosure</a>.</div>
      </div>
    </Layout>
  );
}

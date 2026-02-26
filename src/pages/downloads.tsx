import React from 'react';
import Layout from '../components/Layout';
import affiliateConfig from '../../config/affiliates.json';

const walletPartners = (affiliateConfig.placements?.wallet_cards || []).map((id) => ({
  id,
  ...affiliateConfig.programs?.[id],
})).filter((partner) => partner?.url);

const diningPartners = (affiliateConfig.placements?.dining_cards || []).map((id) => ({
  id,
  ...affiliateConfig.programs?.[id],
})).filter((partner) => partner?.url);

export default function DownloadsPage(){
  return (
    <Layout title='Downloads'>
      <div className='card'>
        <h1 className='text-2xl font-bold mb-4'>Downloads</h1>
        <ul className='list-disc ml-6 space-y-2'>
          <li>
            <a href='/downloads/ags_wallet_card_v1.pdf' target='_blank' rel='noreferrer'>Wallet Card (PDF)</a> — credit‑card size for printing
          </li>
          <li className='ml-4 list-none'>
            <div className='flex flex-wrap gap-2 text-sm'>
              {walletPartners.map((partner) => (
                <a key={partner.id} className='btn' href={partner.url} target='_blank' rel='noreferrer'>
                  Print Wallet Card at {partner.id} (affiliate)
                </a>
              ))}
            </div>
          </li>
          <li>
            <a href='/downloads/ags_dining_card_v1.pdf' target='_blank' rel='noreferrer'>Dining Card (PDF)</a> — 4×6 in landscape for restaurants
          </li>
          <li className='ml-4 list-none'>
            <div className='flex flex-wrap gap-2 text-sm'>
              {diningPartners.map((partner) => (
                <a key={partner.id} className='btn' href={partner.url} target='_blank' rel='noreferrer'>
                  Print Dining Card at {partner.id} (affiliate)
                </a>
              ))}
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

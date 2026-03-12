import React from 'react';
import Layout from '../components/Layout';
import affiliateConfig from '../../config/affiliates.json';

type Program = { programId: string; category: string; url: string; description?: string };
const programs = affiliateConfig.programs as Record<string, Program>;
const placements = affiliateConfig.placements as Record<string, string[]>;

const resolve = (ids: string[]) =>
  ids.map((id) => ({ id, ...programs[id] })).filter((p) => p?.url);

const printPartners = resolve(placements.wallet_cards ?? []);
const tattooPartners = resolve(placements.tattoos ?? []);
const medicalAlertPartners = resolve(placements.medical_alert ?? []);
const testingPartners = resolve(placements.testing ?? []);
const marketplacePartners = resolve(placements.marketplaces ?? []);

const assets = [
  {
    label: 'Wallet Card',
    file: '/downloads/ags_wallet_card_v1.pdf',
    format: 'PDF',
    size: '3.375 x 2.125 in',
    description: 'Credit-card size. Lists mammalian allergens and safe alternatives.',
    preview: '/downloads/ags_wallet_card_v1.pdf',
    category: 'card',
  },
  {
    label: 'Dining Card',
    file: '/downloads/ags_dining_card_v1.pdf',
    format: 'PDF',
    size: '6 x 4 in (landscape)',
    description: 'Hand to restaurant staff. Covers meats, dairy, broths, cross-contact.',
    preview: '/downloads/ags_dining_card_v1.pdf',
    category: 'card',
  },
  {
    label: 'Medical Alert Tattoo',
    file: '/downloads/ags_medical_alert_tattoo.svg',
    format: 'SVG',
    size: '3.5 x 1.5 in',
    description: 'Full design with Star of Life, lone star tick, and medication warnings. For upper arm or chest.',
    preview: '/downloads/ags_medical_alert_tattoo.svg',
    category: 'tattoo',
  },
  {
    label: 'Wrist Tattoo',
    file: '/downloads/ags_wrist_tattoo_simple.svg',
    format: 'SVG',
    size: '2.5 x 1 in',
    description: 'Bold black-ink design for inner wrist. Optimized for temporary tattoo printing or permanent ink.',
    preview: '/downloads/ags_wrist_tattoo_simple.svg',
    category: 'tattoo',
  },
  {
    label: 'Lone Star Tick Icon',
    file: '/favicon.svg',
    format: 'SVG',
    size: '64 x 64 px',
    description: 'Brand icon — lone star tick with white dorsal marking. Use for stickers, merch, or awareness materials.',
    preview: '/favicon.svg',
    category: 'brand',
  },
];

function WatermarkPreview({ src, alt, isSvg }: { src: string; alt: string; isSvg: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-md border border-slate-200 bg-white">
      {isSvg ? (
        <img src={src} alt={alt} className="w-full h-auto p-3" />
      ) : (
        <div className="flex items-center justify-center h-32 bg-slate-50">
          <div className="text-center text-sm text-slate-500">
            <svg className="mx-auto mb-1 w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            PDF Preview
          </div>
        </div>
      )}
      {/* Diagonal watermark overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <span
          className="text-slate-300 font-bold text-lg tracking-widest uppercase opacity-60"
          style={{ transform: 'rotate(-25deg)', fontSize: '1.1rem', letterSpacing: '0.15em' }}
        >
          alphagaldata.com
        </span>
      </div>
    </div>
  );
}

function PartnerChips({ partners, verb }: { partners: ReturnType<typeof resolve>; verb: string }) {
  if (partners.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {partners.map((p) => (
        <a
          key={p.id}
          href={p.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
          title={p.description}
        >
          {verb} {p.id}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      ))}
    </div>
  );
}

export default function DownloadsPage() {
  const cards = assets.filter((a) => a.category === 'card');
  const tattoos = assets.filter((a) => a.category === 'tattoo');
  const brand = assets.filter((a) => a.category === 'brand');

  return (
    <Layout
      title="Downloads & Designs"
      description="Free alpha-gal wallet cards, dining cards, medical alert tattoo designs, and brand assets. Print at home or order from our partners."
    >
      <section className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-slate-900">Downloads & Designs</h1>
          <p className="text-lg text-slate-600">
            Free resources to communicate your alpha-gal allergy. Download, print, or order through our partners.
          </p>
        </header>

        {/* Wallet & Dining Cards */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-800">Wallet & Dining Cards</h2>
          <p className="text-sm text-slate-600">
            Carry these cards to explain your allergy at restaurants, pharmacies, and doctor visits.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {cards.map((asset) => (
              <div key={asset.file} className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                <WatermarkPreview src={asset.preview} alt={asset.label} isSvg={asset.format === 'SVG'} />
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-slate-800">{asset.label}</h3>
                  <p className="text-sm text-slate-600">{asset.description}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono">{asset.format}</span>
                    <span>{asset.size}</span>
                  </div>
                  <a
                    href={asset.file}
                    target="_blank"
                    rel="noreferrer"
                    className="btn inline-block mt-2"
                  >
                    Download {asset.format}
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Print with a partner:</p>
            <PartnerChips partners={printPartners} verb="Print at" />
          </div>
        </div>

        {/* Medical Alert Tattoos */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-800">Medical Alert Tattoos</h2>
          <p className="text-sm text-slate-600">
            EMTs check the inner wrist for medical alerts. These designs warn responders to avoid mammal-derived medications like heparin, gelatin IVs, and bovine surgical products.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {tattoos.map((asset) => (
              <div key={asset.file} className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                <WatermarkPreview src={asset.preview} alt={asset.label} isSvg={asset.format === 'SVG'} />
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-slate-800">{asset.label}</h3>
                  <p className="text-sm text-slate-600">{asset.description}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono">{asset.format}</span>
                    <span>{asset.size}</span>
                  </div>
                  <a
                    href={asset.file}
                    target="_blank"
                    rel="noreferrer"
                    className="btn inline-block mt-2"
                  >
                    Download {asset.format}
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Order temporary tattoos:</p>
            <PartnerChips partners={tattooPartners} verb="Order at" />
          </div>
          <div className="rounded-md bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
            <strong>Tip:</strong> For temporary tattoos at home, use inkjet temporary tattoo paper (available on Amazon). Print the SVG at actual size, apply with water, and it lasts 2-5 days. For semi-permanent options lasting 2+ weeks, check Inkbox above.
          </div>
        </div>

        {/* Brand Assets */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-800">Brand Assets</h2>
          <p className="text-sm text-slate-600">
            Use the lone star tick icon for alpha-gal awareness materials, stickers, and merchandise.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {brand.map((asset) => (
              <div key={asset.file} className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                <WatermarkPreview src={asset.preview} alt={asset.label} isSvg={asset.format === 'SVG'} />
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-slate-800">{asset.label}</h3>
                  <p className="text-sm text-slate-600">{asset.description}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono">{asset.format}</span>
                    <span>{asset.size}</span>
                  </div>
                  <a
                    href={asset.file}
                    target="_blank"
                    rel="noreferrer"
                    className="btn inline-block mt-2"
                  >
                    Download {asset.format}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medical Alert Partners */}
        {medicalAlertPartners.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800">Medical Alert Products</h2>
            <p className="text-sm text-slate-600">
              Complement your tattoo or card with an engraved medical alert bracelet or tag.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {medicalAlertPartners.map((p) => (
                <div key={p.id} className="border rounded-md p-4 bg-white shadow-sm space-y-2">
                  <h3 className="text-lg font-semibold capitalize text-slate-800">{p.id}</h3>
                  {p.description && <p className="text-sm text-slate-600">{p.description}</p>}
                  <a className="btn inline-block" href={p.url} target="_blank" rel="noreferrer">
                    Visit {p.id}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testing & Marketplaces */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-800">Testing</h2>
            <p className="text-sm text-slate-600">Get tested or connect with alpha-gal aware clinicians.</p>
            <PartnerChips partners={testingPartners} verb="Visit" />
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-800">AGS-Safe Marketplaces</h2>
            <p className="text-sm text-slate-600">Find vetted products and community-made alternatives.</p>
            <PartnerChips partners={marketplacePartners} verb="Shop" />
          </div>
        </div>

        {/* License & Disclosure */}
        <div className="rounded-md bg-slate-50 border border-slate-200 p-4 text-xs text-slate-500 space-y-1">
          <p>All designs are provided free for personal use. The alphagaldata.com watermark is for attribution and trademark protection. Commercial redistribution requires permission.</p>
          <p>Some links above are affiliate links. We may earn a small commission at no extra cost to you. See our <a className="underline" href="/disclosure">disclosure</a> for details.</p>
        </div>
      </section>
    </Layout>
  );
}

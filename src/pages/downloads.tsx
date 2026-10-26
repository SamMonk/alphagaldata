import React from 'react';
import Layout from '../components/Layout';
import affiliateConfig from '../../config/affiliates.json';
import TrustNotice from '../components/TrustNotice';
import {
  applyResourceOverrides,
  DEFAULT_DOWNLOAD_ASSETS,
  getEditorialConfig,
} from '../services/editorial/config';
import type { PublicDownloadAsset } from '../contracts/editorial';

type Program = { programId: string; category: string; url: string; description?: string };
const programs = affiliateConfig.programs as Record<string, Program>;
const placements = affiliateConfig.placements as Record<string, string[]>;

const resolve = (ids: string[]) =>
  ids.map((id) => ({ id, ...programs[id] })).filter((p) => p?.url);

const printPartners = resolve([
  ...(placements.wallet_cards ?? []),
  ...(placements.dining_cards ?? []),
]);
const tattooPartners = resolve(placements.tattoos ?? []);
const medicalAlertPartners = resolve(placements.medical_alert ?? []);
const testingPartners = resolve(placements.testing ?? []);
const marketplacePartners = resolve(placements.marketplaces ?? []);

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
  const [assets, setAssets] = React.useState<PublicDownloadAsset[]>(
    DEFAULT_DOWNLOAD_ASSETS
  );

  React.useEffect(() => {
    let cancelled = false;

    const loadEditorialConfig = async () => {
      const response = await getEditorialConfig();
      if (cancelled || response.error || !response.data) return;
      setAssets(applyResourceOverrides(DEFAULT_DOWNLOAD_ASSETS, response.data));
    };

    void loadEditorialConfig();

    return () => {
      cancelled = true;
    };
  }, []);

  const cards = assets.filter((a) => a.category === 'card');
  const tattoos = assets.filter((a) => a.category === 'tattoo');
  const brand = assets.filter((a) => a.category === 'brand');
  const diningCard = cards.find((asset) => asset.label === 'Dining Card');
  const walletCard = cards.find((asset) => asset.label === 'Wallet Card');
  const otherCards = cards.filter((asset) => asset.label !== 'Dining Card');

  return (
    <Layout
      title="Downloads & Designs"
      description="Free alpha-gal wallet cards, dining cards, medical alert tattoo designs, and brand assets. Print at home or order from our partners."
    >
      <section className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-3 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Downloads & Designs</h1>
          <p className="mx-auto max-w-3xl text-lg leading-8 text-slate-600">
            Free resources to communicate your alpha-gal allergy. Download, print, or order through our partners.
          </p>
        </header>

        <TrustNotice title="Preparedness support" tone="amber">
          These downloads are practical tools for meals, emergencies, and medical-alert communication. They are meant to
          support safer conversations and preparedness, not to replace individualized clinician guidance or emergency protocols.
        </TrustNotice>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Emergency preparedness
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Start with the tool you need to carry
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  When the goal is emergency planning rather than meal support, start by choosing the right kind of alert:
                  a wallet card for fuller detail, a bracelet or tattoo for fast visibility, and printable files you can stage in a bag, car, or shared family folder.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <a
                  href="/learn/wallet-card-guide"
                  className="rounded-xl border border-white/70 bg-white/90 p-4 text-sm text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                >
                  <span className="block text-base font-semibold text-slate-900">
                    Wallet card guide
                  </span>
                  <span className="mt-2 block">
                    Best for intake, travel, and situations where staff or family need a quick written summary.
                  </span>
                </a>
                <a
                  href="/learn/medical-alert-tattoo"
                  className="rounded-xl border border-white/70 bg-white/90 p-4 text-sm text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                >
                  <span className="block text-base font-semibold text-slate-900">
                    Medical alert guide
                  </span>
                  <span className="mt-2 block">
                    Best for visible alerts when you may not be able to explain the restriction before treatment starts.
                  </span>
                </a>
                <a
                  href="/learn/printing-alpha-gal-cards"
                  className="rounded-xl border border-white/70 bg-white/90 p-4 text-sm text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                >
                  <span className="block text-base font-semibold text-slate-900">
                    Printing guide
                  </span>
                  <span className="mt-2 block">
                    Use once you know what to carry and want durable copies, extras, or home-print instructions.
                  </span>
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-white/70 bg-white/90 p-4 text-sm text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Quick readiness checklist
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Carry one visible alert and one detailed backup.</li>
                <li>Keep emergency contacts and medication notes current.</li>
                <li>Store printable files where a family member can reprint them fast.</li>
                <li>Use these resources to support conversations, not replace them.</li>
              </ul>
            </div>
          </div>
        </section>

        {diningCard ? (
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Primary dining resource
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                    Dining card preview and quick download
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    Use this card when you need a fast, clear way to explain alpha-gal restrictions to restaurant staff.
                    It highlights the kitchen details that matter most, including mammalian ingredients, broths, dairy,
                    and cross-contact concerns.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/70 bg-white/85 p-4 text-sm text-slate-700">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Best for
                    </p>
                    <p className="mt-2">
                      Restaurant visits, travel, catered events, and any meal where you need kitchen staff to see the restriction in writing.
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/70 bg-white/85 p-4 text-sm text-slate-700">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Before you print
                    </p>
                    <p className="mt-2">
                      Add your personal notes, keep a phone photo as backup, and still confirm ingredients and preparation with staff.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={diningCard.file}
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                  >
                    Open dining card PDF
                  </a>
                  <a
                    href="/learn/dining-card-guide"
                    className="btn"
                  >
                    Read dining card guide
                  </a>
                  <a
                    href="/cards"
                    className="btn"
                  >
                    Print and card shortcuts
                  </a>
                </div>

                <p className="text-xs text-slate-600">
                  Download path stays public and stable. The card helps communication, but it does not guarantee safety or replace direct kitchen confirmation.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-3 shadow-sm">
                <iframe
                  src={`${diningCard.preview}#view=FitH`}
                  title="Dining card preview"
                  className="h-[420px] w-full rounded-xl border border-slate-200"
                />
              </div>
            </div>
          </section>
        ) : null}

        <div className="grid gap-4 md:grid-cols-3">
          <a className="card-link p-4 text-sm" href="/recipes">
            <h2 className="text-base font-semibold text-slate-900">Need food ideas too?</h2>
            <p className="mt-2 text-slate-600">Go back into recipe discovery when you are done with practical tools.</p>
          </a>
          <a className="card-link p-4 text-sm" href="/testing">
            <h2 className="text-base font-semibold text-slate-900">Testing and clinician next steps</h2>
            <p className="mt-2 text-slate-600">Move from printable resources into testing context and care pathways.</p>
          </a>
          <a className="card-link p-4 text-sm" href="/caregivers">
            <h2 className="text-base font-semibold text-slate-900">Share with caregivers</h2>
            <p className="mt-2 text-slate-600">Point family members and helpers to one routed page that explains what supports daily life.</p>
          </a>
        </div>

        {/* Wallet & Dining Cards */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-800">Wallet & Dining Cards</h2>
          <p className="text-sm text-slate-600">
            Carry these cards to explain your allergy at restaurants, pharmacies, and doctor visits.
          </p>
          {walletCard ? (
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950">
              <p className="font-semibold">Preparedness note: the wallet card is your detailed backup.</p>
              <p className="mt-2">
                Use it when you need more clinical detail than a bracelet or tattoo can provide, especially for intake, travel, and emergency-contact handoff.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a className="btn" href={walletCard.file} target="_blank" rel="noreferrer">
                  Open wallet card PDF
                </a>
                <a className="btn" href="/learn/wallet-card-guide">
                  Read wallet card guide
                </a>
              </div>
            </div>
          ) : null}
          {otherCards.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {otherCards.map((asset) => (
                <div key={asset.file} className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <WatermarkPreview src={asset.preview} alt={asset.label} isSvg={asset.format === 'SVG'} />
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-slate-800">{asset.label}</h3>
                    <p className="text-sm text-slate-600">{asset.description}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono">{asset.format}</span>
                      <span>{asset.size}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <a
                        href={asset.file}
                        target="_blank"
                        rel="noreferrer"
                        className="btn inline-block"
                      >
                        Open {asset.label.toLowerCase()} {asset.format}
                      </a>
                      <a
                        href="/cards"
                        className="btn inline-block"
                      >
                        More card options
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-medium text-slate-900">Looking for the dining card?</p>
            <p className="mt-2">
              The dining card is featured above as the primary meal-support resource so visitors do not have to hunt for it among broader downloads.
            </p>
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
            A wrist alert backs up your medical ID bracelet and wallet card, telling your care team about AGS before mammal-derived products such as heparin or animal-tissue heart valves are used.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {tattoos.map((asset) => (
              <div key={asset.file} className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                <WatermarkPreview src={asset.preview} alt={asset.label} isSvg={asset.format === 'SVG'} />
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-slate-800">{asset.label}</h3>
                  <p className="text-sm text-slate-600">{asset.description}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
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
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
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

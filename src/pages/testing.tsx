import React from 'react';
import Layout from '../components/Layout';
import { IconFlask, IconLabcorp, IconQuest, IconMapPin, IconCart, IconStethoscope, IconExternal, IconInfo } from '../components/icons';
import TrustNotice from '../components/TrustNotice';

export default function TestingPage() {
  return (
    <Layout title="Testing for Alpha-Gal" description="How to get tested for alpha-gal syndrome. Lab test codes for Labcorp and Quest, find an allergist, and direct-to-consumer testing options.">
      <div className="space-y-8">
        <section className="card flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="shrink-0 rounded-lg bg-teal-600/10 p-2 text-teal-700">
            <IconFlask size={28} />
          </div>
          <div className="prose max-w-none">
            <h1>Testing for Alpha-Gal</h1>
            <p>
              Clinicians typically order a blood test measuring IgE to galactose‑α‑1,3‑galactose (“alpha‑gal”). Major labs include
              Labcorp and Quest. Always discuss testing and results with a board‑certified allergist.
            </p>
          </div>
        </section>

        <TrustNotice title="Testing guidance, not diagnosis" tone="amber">
          AlphaGalData can help you understand testing pathways and clinician questions, but it does not diagnose AGS or
          interpret results for you. Bloodwork, symptom history, and treatment decisions should be reviewed with a qualified allergist.
        </TrustNotice>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/80 bg-white/90 p-4 text-sm text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                What this page can do
              </p>
              <p className="mt-2">
                Help you find official lab information, prepare questions, and decide which clinician or lab directory to open next.
              </p>
            </div>
            <div className="rounded-xl border border-white/80 bg-white/90 p-4 text-sm text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                What this page cannot do
              </p>
              <p className="mt-2">
                Diagnose AGS, tell you whether a result is positive enough, or replace an allergist’s interpretation of symptoms and timing.
              </p>
            </div>
            <div className="rounded-xl border border-white/80 bg-white/90 p-4 text-sm text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Safer next step
              </p>
              <p className="mt-2">
                Bring your symptom history, exposure history, and lab questions to a board-certified allergist before treating any result as a full answer.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="card">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <IconFlask className="text-teal-700" /> Orderable lab tests
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <IconLabcorp className="mt-1 text-slate-600" />
                <div>
                  <div className="font-medium">Labcorp</div>
                  <div className="text-sm text-slate-700">Galactose‑α‑1,3‑galactose (Alpha‑Gal) IgE — Test <strong>#650001</strong></div>
                  <a className="inline-flex items-center gap-1 text-teal-700 hover:underline text-sm" href="https://www.labcorp.com/tests/650001/galactose-%CE%B1-1-3-galactose-alpha-gal-ige" target="_blank" rel="noreferrer noopener">
                    Labcorp test page <IconExternal className="inline-block" />
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <IconQuest className="mt-1 text-slate-600" />
                <div>
                  <div className="font-medium">Quest Diagnostics</div>
                  <div className="text-sm text-slate-700">Alpha‑Gal IgE — Test <strong>10554</strong>; Alpha‑Gal Panel — Test <strong>10555</strong></div>
                  <a className="inline-flex items-center gap-1 text-teal-700 hover:underline text-sm" href="https://testdirectory.questdiagnostics.com/test/home" target="_blank" rel="noreferrer noopener">
                    Quest test directory <IconExternal className="inline-block" />
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <IconMapPin className="text-teal-700" /> Find testing locations
            </h2>
            <p className="text-slate-700 text-sm">Use official lab finders to schedule nearby blood draws.</p>
            <div className="not-prose flex flex-wrap gap-2 mt-2">
              <a className="btn inline-flex items-center gap-2" href="https://www.labcorp.com/labs-and-appointments" target="_blank" rel="noreferrer noopener" aria-label="Labcorp Locations (opens in new tab)">
                <IconMapPin /> Labcorp Locations
              </a>
              <a className="btn inline-flex items-center gap-2" href="https://www.questdiagnostics.com/locations" target="_blank" rel="noreferrer noopener" aria-label="Quest Diagnostics Locations (opens in new tab)">
                <IconMapPin /> Quest Locations
              </a>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="card">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <IconCart className="text-teal-700" /> Direct‑to‑consumer
            </h2>
            <p className="text-slate-700 text-sm">
              Purchase testing directly in select states if that fits your situation, but do not treat direct ordering as a substitute for clinician review of symptoms, cofactors, and result meaning.
            </p>
            <div className="not-prose mt-2">
              <a className="btn inline-flex items-center gap-2" href="https://www.ondemand.labcorp.com/" target="_blank" rel="noreferrer noopener">
                <IconCart /> Labcorp OnDemand
              </a>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <IconStethoscope className="text-teal-700" /> Find an allergist
            </h2>
            <p className="text-slate-700 text-sm">Board‑certified allergists can help interpret results and build a management plan.</p>
            <div className="not-prose flex flex-wrap gap-2 mt-2">
              <a className="btn inline-flex items-center gap-2" href="https://allergist.aaaai.org/find/" target="_blank" rel="noreferrer noopener">
                <IconStethoscope /> AAAAI directory
              </a>
              <a className="btn inline-flex items-center gap-2" href="https://acaai.org/find-an-allergist/" target="_blank" rel="noreferrer noopener">
                <IconStethoscope /> ACAAI directory
              </a>
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <IconInfo className="text-teal-700" /> Important context
          </h2>
          <ul className="list-disc ml-6 text-slate-700">
            <li>Tick presence maps correlate with alpha‑gal hotspots but do not guarantee personal risk or confirm why a reaction happened.</li>
            <li>Lab results need clinical context: exposure history, cofactors, timing of reactions, and discussion with an allergist still matter.</li>
            <li>A test order, a lab result, or a direct-to-consumer pathway should not be treated as the site confirming a diagnosis.</li>
          </ul>
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Known, uncertain, next step</p>
            <ul className="mt-2 list-disc pl-5">
              <li><strong>Known:</strong> official lab pathways and allergist directories can help you move the conversation forward.</li>
              <li><strong>Uncertain:</strong> isolated numbers do not explain the full picture without symptom and exposure review.</li>
              <li><strong>Next step:</strong> bring your questions and any results to an allergist who can interpret them in context.</li>
            </ul>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Sources</h3>
            <ul className="list-disc ml-6">
              <li><a className="inline-flex items-center gap-1" href="https://www.cdc.gov/ticks/alpha-gal/index.html" target="_blank" rel="noreferrer noopener">CDC: Alpha‑gal Syndrome <IconExternal className="inline-block" /></a></li>
              <li><a className="inline-flex items-center gap-1" href="https://www.labcorp.com/tests/650001/galactose-%CE%B1-1-3-galactose-alpha-gal-ige" target="_blank" rel="noreferrer noopener">Labcorp: Alpha‑Gal IgE (650001) <IconExternal className="inline-block" /></a></li>
              <li><a className="inline-flex items-center gap-1" href="https://testdirectory.questdiagnostics.com/test/home" target="_blank" rel="noreferrer noopener">Quest Diagnostics: Test Directory <IconExternal className="inline-block" /></a></li>
            </ul>
          </div>

          <div className="mt-6 p-3 rounded bg-amber-50 text-amber-900 border border-amber-200">
            Educational only. This page helps you prepare for testing conversations and locate official resources, but diagnosis, result interpretation, and treatment decisions belong with your clinician.
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <a className="card-link card p-5" href="/learn">
            <h2 className="text-lg font-semibold mb-2">Learn the basics</h2>
            <p className="text-slate-700">Move into alpha-gal guides, prevention, and management context after testing.</p>
          </a>
          <a className="card-link card p-5" href="/downloads">
            <h2 className="text-lg font-semibold mb-2">Get practical tools</h2>
            <p className="text-slate-700">Download wallet cards, dining cards, and medical-alert resources for real-world use.</p>
          </a>
          <a className="card-link card p-5" href="/caregivers">
            <h2 className="text-lg font-semibold mb-2">Caregiver support</h2>
            <p className="text-slate-700">Share a routed guide with the people helping manage appointments, meals, and emergencies.</p>
          </a>
        </section>
      </div>
    </Layout>
  );
}

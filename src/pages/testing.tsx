import React from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { IconFlask, IconLabcorp, IconQuest, IconMapPin, IconCart, IconStethoscope, IconExternal, IconInfo } from '../components/icons';

export default function TestingPage() {
  return (
    <Layout title="Testing for Alpha-Gal">
      <SEO />
      <div className="space-y-8">
        <section className="card flex items-start gap-4">
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
            <p className="text-slate-700 text-sm">Purchase testing directly in select states; review results with your clinician.</p>
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
            <li>Tick presence maps correlate with alpha‑gal hotspots but don’t guarantee risk.</li>
            <li>Interpret results in clinical context: exposure history, cofactors, and timing of reactions.</li>
          </ul>
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Sources</h3>
            <ul className="list-disc ml-6">
              <li><a className="inline-flex items-center gap-1" href="https://www.cdc.gov/ticks/alpha-gal/index.html" target="_blank" rel="noreferrer noopener">CDC: Alpha‑gal Syndrome <IconExternal className="inline-block" /></a></li>
              <li><a className="inline-flex items-center gap-1" href="https://www.labcorp.com/tests/650001/galactose-%CE%B1-1-3-galactose-alpha-gal-ige" target="_blank" rel="noreferrer noopener">Labcorp: Alpha‑Gal IgE (650001) <IconExternal className="inline-block" /></a></li>
              <li><a className="inline-flex items-center gap-1" href="https://testdirectory.questdiagnostics.com/test/home" target="_blank" rel="noreferrer noopener">Quest Diagnostics: Test Directory <IconExternal className="inline-block" /></a></li>
            </ul>
          </div>

          <div className="mt-6 p-3 rounded bg-amber-50 text-amber-900 border border-amber-200">
            Educational only, not medical advice. Always consult your clinician for diagnosis and treatment decisions.
          </div>
        </section>
      </div>
    </Layout>
  );
}

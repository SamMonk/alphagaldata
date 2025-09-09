import React from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

export default function TestingPage(){
  return (
    <Layout title="Testing for Alpha-Gal">
      <SEO />
      <div className="prose max-w-none">
        <h1>Testing for Alpha-Gal</h1>
        <p>
          Clinicians typically order a blood test measuring IgE to galactose-α-1,3-galactose (“alpha-gal”). Major labs
          include Labcorp and Quest. Always discuss testing and results with a board-certified allergist.
        </p>

        <h2>Orderable lab tests</h2>
        <ul>
          <li>
            <strong>Labcorp</strong>: Galactose-α-1,3-galactose (Alpha-Gal) IgE — Test <strong>#650001</strong> ·{' '}
            <a href="https://www.labcorp.com/tests/650001/galactose-%CE%B1-1-3-galactose-alpha-gal-ige" target="_blank" rel="noreferrer">Labcorp test page</a>
          </li>
          <li>
            <strong>Quest Diagnostics</strong>: Alpha-Gal IgE — Test <strong>10554</strong>; Alpha-Gal Panel — Test <strong>10555</strong> ·{' '}
            <a href="https://testdirectory.questdiagnostics.com/test/home" target="_blank" rel="noreferrer">Quest test directory</a>
          </li>
        </ul>

        <h2>Find testing locations</h2>
        <p>
          Use the lab location finders to schedule a nearby blood draw (most don’t require fasting). These tools do not
          expose public APIs, so we link directly to their official finders:
        </p>
        <ul>
          <li>
            <a href="https://www.labcorp.com/labs-and-appointments" target="_blank" rel="noreferrer">Labcorp Locations</a>
          </li>
          <li>
            <a href="https://www.questdiagnostics.com/locations" target="_blank" rel="noreferrer">Quest Diagnostics Locations</a>
          </li>
        </ul>

        <h2>Direct-to-consumer option</h2>
        <p>
          Some users prefer to purchase the test directly and bring results to their clinician. Availability varies by
          state. Always pair results with clinician guidance.
        </p>
        <ul>
          <li>
            <a href="https://www.ondemand.labcorp.com/" target="_blank" rel="noreferrer">Labcorp OnDemand</a>
          </li>
        </ul>

        <h2>Find an allergist</h2>
        <p>
          Board-certified allergists can help interpret results and manage alpha-gal syndrome.
        </p>
        <div className="not-prose flex flex-wrap gap-3">
          <a className="btn" href="https://allergist.aaaai.org/find/" target="_blank" rel="noreferrer">Find an allergist (AAAAI)</a>
          <a className="btn" href="https://acaai.org/find-an-allergist/" target="_blank" rel="noreferrer">Find an allergist (ACAAI)</a>
        </div>

        <h2>Important context</h2>
        <ul>
          <li>
            Tick presence maps do not equal guaranteed risk, but they correlate with alpha-gal hotspots. See our map and CDC
            overview.
          </li>
          <li>
            Test interpretation should consider clinical history, exposures, cofactors, and timing of reactions.
          </li>
        </ul>

        <h3>Sources</h3>
        <ul>
          <li>
            <a href="https://www.cdc.gov/ticks/alpha-gal/index.html" target="_blank" rel="noreferrer">CDC: Alpha-gal Syndrome (AGS)</a>
          </li>
          <li>
            <a href="https://www.labcorp.com/tests/650001/galactose-%CE%B1-1-3-galactose-alpha-gal-ige" target="_blank" rel="noreferrer">Labcorp: Alpha-Gal IgE (650001)</a>
          </li>
          <li>
            <a href="https://testdirectory.questdiagnostics.com/test/home" target="_blank" rel="noreferrer">Quest Diagnostics: Test Directory</a>
          </li>
        </ul>

        <div className="mt-6 p-3 rounded bg-amber-50 text-amber-900 border border-amber-200">
          Educational only, not medical advice. Always consult your clinician for diagnosis and treatment decisions.
        </div>
      </div>
    </Layout>
  );
}


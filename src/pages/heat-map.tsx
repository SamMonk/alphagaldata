import React from 'react';
import Layout from '../components/Layout';
import TimelineMap from '../components/TimelineMap';

export default function HeatMapPage() {
  return (
    <Layout
      title="Alpha-Gal Spread & Awareness Timeline"
      description="Interactive timeline map showing how alpha-gal syndrome awareness and lone star tick populations have spread across the United States from 2010 to present."
      image="https://alphagaldata.com/pins/spread-timeline.png"
      noindex
    >
      <div className="space-y-8">
        <section className="card">
          <h1 className="text-3xl font-bold mb-3">
            Alpha-Gal Syndrome: Spread &amp; Awareness Timeline
          </h1>
          <p className="text-slate-700 leading-relaxed">
            In 2009, researchers at the University of Virginia described the first clinical cases
            of alpha-gal syndrome — a delayed allergic reaction to mammalian meat triggered by
            lone star tick bites. Sixteen years later, the CDC estimates that up to 450,000
            Americans have been affected. This map traces that story year by year, showing how
            awareness has spread from a handful of southeastern states to a nationwide concern.
          </p>
        </section>

        <section>
          <TimelineMap />
        </section>

        <section className="card space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">What this map shows</h2>
            <p className="text-slate-700 leading-relaxed">
              The state-level shading represents an alpha-gal awareness index — a composite
              measure derived from search interest data, published diagnosis rates, and
              surveillance reporting. Darker amber indicates states where alpha-gal syndrome is
              more widely recognized, tested for, and diagnosed. States with no shading have
              minimal documented AGS activity for that year.
            </p>
            <p className="text-slate-700 leading-relaxed mt-3">
              Use the year slider or play button to animate the progression from 2010 to the
              present. The bar chart below the map shows the estimated number of new suspected
              cases per year — click any bar to jump to that year. Toggle the CDC tick
              surveillance overlay to see county-level lone star tick establishment data
              alongside the awareness layer.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">The pattern of spread</h2>
            <p className="text-slate-700 leading-relaxed">
              Alpha-gal syndrome was first identified in Virginia, North Carolina, and Tennessee
              — states in the heart of lone star tick territory. As awareness grew among
              allergists and patients, diagnoses expanded through the mid-South and Southeast:
              Missouri, Arkansas, Kentucky, Georgia, and the Carolinas saw rapid increases in the
              early 2010s.
            </p>
            <p className="text-slate-700 leading-relaxed mt-3">
              By 2017, when systematic lab surveillance began through Eurofins Viracor, AGS was
              being diagnosed in over 30 states. The pattern closely follows the expanding range
              of the lone star tick, which has been moving northward and westward due to warming
              winters and changes in deer populations. States like New York, New Jersey,
              Pennsylvania, and the upper Midwest began reporting cases as tick populations
              established in new areas.
            </p>
            <p className="text-slate-700 leading-relaxed mt-3">
              The 2022 CDC report was a turning point for public awareness. Major media coverage
              brought alpha-gal syndrome to national attention, and search interest surged in
              states that had previously shown little awareness. By 2024, when AGS received its
              own ICD-10 diagnosis code, cases were being identified in nearly every state —
              though the Southeast remains the epicenter.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">
              Why awareness matters as much as tick range
            </h2>
            <p className="text-slate-700 leading-relaxed">
              The map shows awareness, not just tick presence, because the two tell different
              stories. Many patients in low-awareness states go undiagnosed for years because
              local doctors have never encountered the condition. A state might have established
              lone star tick populations but low AGS diagnosis rates simply because clinicians
              are not testing for it.
            </p>
            <p className="text-slate-700 leading-relaxed mt-3">
              This gap between where ticks are and where diagnoses happen is one of the biggest
              challenges in AGS. Toggle the tick surveillance layer to compare — you may notice
              states where tick establishment is documented but awareness remains low. Those are
              the areas where patients are most likely to be misdiagnosed or undiagnosed.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Data sources</h2>
            <ul className="list-disc ml-6 text-slate-700 space-y-2">
              <li>
                <strong>Case counts:</strong>{' '}
                <a
                  href="https://www.cdc.gov/mmwr/volumes/72/wr/mm7230a2.htm"
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-700 hover:underline"
                >
                  CDC MMWR 2023
                </a>{' '}
                — Thompson et al., "Geographic Distribution of Suspected Alpha-Gal Syndrome
                Cases." Lab surveillance data from Eurofins Viracor (2017–2022) with earlier
                estimates from published literature.
              </li>
              <li>
                <strong>Awareness index:</strong> Derived from Google Trends relative search
                volume for alpha-gal related terms by state, cross-referenced with published
                state-level seroprevalence studies and media coverage timelines.
              </li>
              <li>
                <strong>Tick surveillance:</strong>{' '}
                <a
                  href="https://www.cdc.gov/ticks/data-research/facts-stats/lone-star-tick-surveillance.html"
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-700 hover:underline"
                >
                  CDC Lone Star Tick Surveillance Data
                </a>{' '}
                — County-level <em>Amblyomma americanum</em> establishment status (2024).
              </li>
              <li>
                <strong>Growth trends:</strong> TriNetX electronic health record network
                analysis showing 5,520% increase in AGS diagnoses from 2015–2020 to 2021–2025
                (PMC12365936). Fort Liberty seroprevalence study tracking sensitization rates
                from 1991–2019.
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm">
            <strong>Note:</strong> This map presents aggregate awareness and surveillance data
            for educational purposes. Alpha-gal syndrome can occur in any state where tick
            exposure happens — including states shown with low awareness. If you suspect AGS,
            consult a board-certified allergist regardless of where you live. See our{' '}
            <a href="/testing" className="underline">
              testing guide
            </a>{' '}
            for lab information and how to find a knowledgeable provider.
          </div>
        </section>
      </div>
    </Layout>
  );
}

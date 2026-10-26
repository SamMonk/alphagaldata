/**
 * Generates a state-level GeoJSON from us-atlas for the timeline map.
 * Output: src/data/us_states.geojson
 */
const fs = require('fs');
const path = require('path');
const topojson = require('topojson-client');
const statesTopo = require('us-atlas/states-10m.json');

const OUT = path.join(__dirname, '..', 'src', 'data', 'us_states.json');

// FIPS code → 2-letter abbreviation
const FIPS_TO_ABBR = {
  '01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT',
  '10':'DE','11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL',
  '18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD',
  '25':'MA','26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE',
  '32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND',
  '39':'OH','40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD',
  '47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV',
  '55':'WI','56':'WY'
};

function main() {
  const fc = topojson.feature(statesTopo, statesTopo.objects.states);
  for (const f of fc.features) {
    const fips = String(f.id).padStart(2, '0');
    const abbr = FIPS_TO_ABBR[fips] || '';
    f.properties = {
      ...(f.properties || {}),
      FIPS: fips,
      abbr,
      name: f.properties?.name || ''
    };
  }
  // Filter out territories (keep only 50 states + DC)
  fc.features = fc.features.filter(f => f.properties.abbr);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(fc));
  console.log('Wrote', OUT, 'with', fc.features.length, 'states');
}

main();

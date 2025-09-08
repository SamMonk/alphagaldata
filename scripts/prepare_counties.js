const fs = require('fs');
const path = require('path');
const topojson = require('topojson-client');
const countiesTopo = require('us-atlas/counties-10m.json');

const OUT = path.join(__dirname, '..', 'src', 'data', 'us_counties.geojson');

function main() {
  const fc = topojson.feature(countiesTopo, countiesTopo.objects.counties);
  // Ensure properties include GEOID string
  for (const f of fc.features) {
    const geoid = String(f.id).padStart(5, '0');
    f.properties = { ...(f.properties || {}), GEOID: geoid };
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(fc));
  console.log('Wrote', OUT, 'with', fc.features.length, 'counties');
}

main();


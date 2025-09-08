const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const XLSX_PATH = path.join(__dirname, '..', '2024-A.americanum-Surveillance-Map-Data.xlsx');
const COUNTIES_GEOJSON = path.join(__dirname, '..', 'src', 'data', 'us_counties.geojson');
const OUT_PATH_SRC = path.join(__dirname, '..', 'src', 'data', 'lone_star_ticks.geojson');
const OUT_PATH_STATIC = path.join(__dirname, '..', 'static', 'data', 'lone_star_ticks.geojson');

function normalizeStatus(s) {
  if (!s) return null;
  const v = String(s).trim().toLowerCase();
  if (v.includes('establish')) return 'Established';
  if (v.includes('report')) return 'Reported';
  if (v.includes('no record') || v === 'none') return 'No records';
  return s;
}

function loadXlsx() {
  const wb = XLSX.readFile(XLSX_PATH);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: null });
  // The file has odd headers; row 0 describes column names
  const header = rows[0];
  const fipsKey = Object.keys(header).find((k) => String(header[k]).toLowerCase().includes('fips'));
  const stateKey = Object.keys(header).find((k) => String(header[k]).toLowerCase() === 'state');
  const countyKey = Object.keys(header).find((k) => String(header[k]).toLowerCase().includes('county'));
  const statusKey = Object.keys(header).find((k) => String(header[k]).toLowerCase().includes('status'));
  const sourceKey = Object.keys(header).find((k) => String(header[k]).toLowerCase().includes('source'));

  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const fipsRaw = r[fipsKey];
    if (fipsRaw == null || fipsRaw === '') continue;
    const geoid = String(fipsRaw).padStart(5, '0');
    out.push({
      GEOID: geoid,
      state: r[stateKey],
      county: r[countyKey],
      status: normalizeStatus(r[statusKey]),
      source: r[sourceKey] ?? null,
    });
  }
  return out;
}

function main() {
  if (!fs.existsSync(COUNTIES_GEOJSON)) {
    console.error('Counties GeoJSON missing. Run: npm run tasks:counties');
    process.exit(1);
  }
  const counties = JSON.parse(fs.readFileSync(COUNTIES_GEOJSON, 'utf8'));
  const rows = loadXlsx();
  const byFips = new Map(rows.map((r) => [r.GEOID, r]));

  let matched = 0;
  for (const f of counties.features) {
    const r = byFips.get(f.properties.GEOID);
    if (r) {
      matched++;
      f.properties = { ...f.properties, ...r };
    } else {
      // Keep unmatched counties but mark as unknown
      f.properties = { ...f.properties, status: null };
    }
  }

  console.log('Matched counties:', matched, 'of', counties.features.length);
  fs.mkdirSync(path.dirname(OUT_PATH_SRC), { recursive: true });
  fs.mkdirSync(path.dirname(OUT_PATH_STATIC), { recursive: true });
  fs.writeFileSync(OUT_PATH_SRC, JSON.stringify(counties));
  fs.writeFileSync(OUT_PATH_STATIC, JSON.stringify(counties));
  console.log('Wrote joined map to', OUT_PATH_SRC, 'and', OUT_PATH_STATIC);
}

main();

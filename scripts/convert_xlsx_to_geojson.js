const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const XLSX_PATH = path.join(__dirname, '..', '2024-A.americanum-Surveillance-Map-Data.xlsx');
const OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'lone_star_ticks.geojson');

function findKey(obj, candidates) {
  const keys = Object.keys(obj);
  for (const k of keys) {
    const lk = k.toLowerCase().replace(/\s+/g, '');
    if (candidates.some((c) => lk.includes(c))) return k;
  }
  return null;
}

function toNumber(v) {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const n = Number(v.trim());
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function main() {
  if (!fs.existsSync(XLSX_PATH)) {
    console.error('Input XLSX not found:', XLSX_PATH);
    process.exit(1);
  }
  const wb = XLSX.readFile(XLSX_PATH);
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: null });
  if (!rows.length) {
    console.error('No rows found in first sheet.');
    process.exit(1);
  }

  const sample = rows[0];
  const latKey = findKey(sample, ['lat', 'latitude', 'y']);
  const lonKey = findKey(sample, ['lon', 'lng', 'long', 'longitude', 'x']);

  if (!latKey || !lonKey) {
    console.error('Could not find latitude/longitude columns.');
    console.error('Detected columns:', Object.keys(sample));
    console.error('Expected headers like: latitude/longitude or lat/lon');
    process.exit(2);
  }

  const features = [];
  for (const row of rows) {
    const lat = toNumber(row[latKey]);
    const lon = toNumber(row[lonKey]);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    // Basic validity check for US extents
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) continue;
    const props = { ...row };
    features.push({
      type: 'Feature',
      properties: props,
      geometry: { type: 'Point', coordinates: [lon, lat] },
    });
  }

  if (!features.length) {
    console.error('No valid coordinate rows found. Nothing to write.');
    process.exit(3);
  }

  const fc = { type: 'FeatureCollection', features };
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(fc));
  console.log(`Wrote ${features.length} features to`, OUT_PATH);
}

main();


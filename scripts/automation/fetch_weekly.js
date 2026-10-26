#!/usr/bin/env node
/**
 * Weekly alpha-gal data pull. Deterministic, no AI.
 *
 * Sources:
 *   - PubMed (NCBI E-utilities): new alpha-gal papers with abstracts
 *   - ClinicalTrials.gov API v2: alpha-gal related studies
 *
 * Writes automation/inbox/data/weekly-YYYY-MM-DD.json and marks which items
 * are new relative to automation/state/published.json (updated by publish.js).
 *
 * Usage: node scripts/automation/fetch_weekly.js [--days 14]
 * Runs on the host or inside the OpenClaw container (Node 18+, no deps).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const AUTOMATION = process.env.ALPHAGAL_AUTOMATION_DIR || path.join(ROOT, 'automation');
const DATA_DIR = path.join(AUTOMATION, 'inbox', 'data');
const STATE_FILE = path.join(AUTOMATION, 'state', 'published.json');

const daysArg = process.argv.indexOf('--days');
const DAYS = daysArg > -1 ? Number(process.argv[daysArg + 1]) : 14;

const PUBMED_TERM = [
  '"alpha-gal"[tiab]',
  '"alpha-gal syndrome"[tiab]',
  '"galactose-alpha-1,3-galactose"[tiab]',
  '"mammalian meat allergy"[tiab]',
  '"red meat allergy"[tiab]',
].join(' OR ');
const TRIALS_TERM = 'alpha-gal OR "alpha gal" OR "galactose-alpha-1,3-galactose" OR "mammalian meat allergy"';
// The trials search is fuzzy (it also hits alpha-galactosidase / Fabry studies), so
// keep only studies whose text is actually about alpha-gal syndrome.
const TRIALS_RELEVANT = /alpha[- ]?gal(?!actosidase)\b|α-gal|galactose-alpha-1,3-galactose|mammalian meat allerg|red meat allerg|tick bite/i;
const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const UA = 'AlphaGalData weekly fetch (https://alphagaldata.com; info@alphagaldata.com)';

async function getText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.text();
}

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return { pmids: [], trials: {} };
  }
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
function clean(xml) {
  return (xml || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e) => {
      if (e[0] === '#') return String.fromCodePoint(parseInt(e.slice(e[1] === 'x' ? 2 : 1), e[1] === 'x' ? 16 : 10));
      return ENTITIES[e] ?? m;
    })
    .replace(/\s+/g, ' ')
    .trim();
}

function first(xml, re) {
  const m = xml.match(re);
  return m ? clean(m[1]) : null;
}

function parseArticle(xml) {
  const abstractParts = [...xml.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)].map(([, attrs, body]) => {
    const label = attrs.match(/Label="([^"]+)"/);
    return (label ? `${label[1]}: ` : '') + clean(body);
  });
  const year = first(xml, /<PubDate>[\s\S]*?<Year>(\d{4})<\/Year>/) || first(xml, /<MedlineDate>(\d{4})/);
  const month = first(xml, /<PubDate>[\s\S]*?<Month>(\w+)<\/Month>/);
  const authors = [...xml.matchAll(/<Author[^>]*>[\s\S]*?<LastName>([\s\S]*?)<\/LastName>[\s\S]*?(?:<Initials>([\s\S]*?)<\/Initials>)?[\s\S]*?<\/Author>/g)]
    .map(([, last, init]) => `${clean(last)} ${clean(init || '')}`.trim());
  const pmid = first(xml, /<PMID[^>]*>(\d+)<\/PMID>/);
  const doi = first(xml, /<ArticleId IdType="doi">([\s\S]*?)<\/ArticleId>/);
  return {
    pmid,
    title: first(xml, /<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/),
    journal: first(xml, /<Journal>[\s\S]*?<Title>([\s\S]*?)<\/Title>/),
    published: [year, month].filter(Boolean).join(' ') || null,
    authors: authors.length > 3 ? `${authors.slice(0, 3).join(', ')}, et al.` : authors.join(', '),
    publicationTypes: [...xml.matchAll(/<PublicationType[^>]*>([\s\S]*?)<\/PublicationType>/g)].map((m) => clean(m[1])),
    abstract: abstractParts.join('\n') || null,
    url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
    doi: doi ? `https://doi.org/${doi}` : null,
  };
}

async function fetchPubmed(seen) {
  const search = JSON.parse(
    await getText(
      `${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=100&sort=pub_date&datetype=edat&reldate=${DAYS}&term=${encodeURIComponent(PUBMED_TERM)}`
    )
  );
  const ids = search.esearchresult?.idlist || [];
  if (!ids.length) return { searched: 0, new: [], alreadyPublished: [] };
  const xml = await getText(`${EUTILS}/efetch.fcgi?db=pubmed&retmode=xml&id=${ids.join(',')}`);
  const articles = [...xml.matchAll(/<PubmedArticle>([\s\S]*?)<\/PubmedArticle>/g)].map((m) => parseArticle(m[1]));
  const seenSet = new Set(seen);
  return {
    searched: ids.length,
    new: articles.filter((a) => !seenSet.has(a.pmid)),
    alreadyPublished: articles.filter((a) => seenSet.has(a.pmid)).map((a) => a.pmid),
  };
}

function summarizeStudy(study) {
  const p = study.protocolSection || {};
  const locations = p.contactsLocationsModule?.locations || [];
  return {
    nctId: p.identificationModule?.nctId,
    title: p.identificationModule?.briefTitle,
    status: p.statusModule?.overallStatus,
    startDate: p.statusModule?.startDateStruct?.date || null,
    completionDate: p.statusModule?.completionDateStruct?.date || null,
    lastUpdated: p.statusModule?.lastUpdatePostDateStruct?.date || null,
    sponsor: p.sponsorCollaboratorsModule?.leadSponsor?.name || null,
    studyType: p.designModule?.studyType || null,
    phases: p.designModule?.phases || [],
    enrollment: p.designModule?.enrollmentInfo?.count ?? null,
    conditions: p.conditionsModule?.conditions || [],
    interventions: (p.armsInterventionsModule?.interventions || []).map((i) => i.name),
    summary: p.descriptionModule?.briefSummary || null,
    locations: [...new Set(locations.map((l) => [l.city, l.state, l.country].filter(Boolean).join(', ')))].slice(0, 10),
    url: `https://clinicaltrials.gov/study/${p.identificationModule?.nctId}`,
  };
}

async function fetchTrials(previous) {
  const studies = [];
  let pageToken = '';
  do {
    const url = `https://clinicaltrials.gov/api/v2/studies?pageSize=100&query.term=${encodeURIComponent(TRIALS_TERM)}${pageToken ? `&pageToken=${pageToken}` : ''}`;
    const page = JSON.parse(await getText(url));
    studies.push(
      ...(page.studies || [])
        .filter((study) => {
          const p = study.protocolSection || {};
          const text = [
            p.identificationModule?.briefTitle,
            p.identificationModule?.officialTitle,
            ...(p.conditionsModule?.conditions || []),
            ...(p.conditionsModule?.keywords || []),
          ].join(' ');
          return TRIALS_RELEVANT.test(text);
        })
        .map(summarizeStudy)
    );
    pageToken = page.nextPageToken || '';
  } while (pageToken);
  return {
    all: studies,
    changed: studies.filter((s) => previous[s.nctId] !== s.lastUpdated).map((s) => s.nctId),
  };
}

(async () => {
  const state = readState();
  const [pubmed, trials] = await Promise.all([fetchPubmed(state.pmids), fetchTrials(state.trials)]);
  const date = new Date().toISOString().slice(0, 10);
  const out = path.join(DATA_DIR, `weekly-${date}.json`);
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(
    out,
    JSON.stringify({ fetchedAt: new Date().toISOString(), windowDays: DAYS, pubmedQuery: PUBMED_TERM, pubmed, trials }, null, 2)
  );
  console.log(
    `Wrote ${path.relative(ROOT, out)}: ${pubmed.new.length} new papers (${pubmed.searched} found), ` +
      `${trials.all.length} trials (${trials.changed.length} new/updated)`
  );
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

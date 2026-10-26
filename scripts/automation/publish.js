#!/usr/bin/env node
/**
 * Human approval gate for OpenClaw drafts in automation/inbox/drafts/.
 *
 *   npm run inbox                                   # list pending drafts
 *   npm run inbox:publish -- <file> --reviewer "Name"
 *   npm run inbox:reject -- <file>
 *
 * Draft types (by filename prefix):
 *   research-*.mdx        -> content/research/   (weekly digest; marks its PMIDs as published)
 *   article-*.mdx         -> content/articles/   (evergreen article)
 *   trials-curation.json  -> src/data/research/trials.json (clinical trials tracker)
 *
 * After publishing, run `npm run deploy`.
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT = path.resolve(__dirname, '..', '..');
const AUTOMATION = path.join(ROOT, 'automation');
const DRAFTS = path.join(AUTOMATION, 'inbox', 'drafts');
const DATA_DIR = path.join(AUTOMATION, 'inbox', 'data');
const ARCHIVE = path.join(AUTOMATION, 'archive');
const STATE_FILE = path.join(AUTOMATION, 'state', 'published.json');
const TRIALS_OUT = path.join(ROOT, 'src', 'data', 'research', 'trials.json');

const [command, target, ...rest] = process.argv.slice(2);
const reviewerIdx = rest.indexOf('--reviewer');
const reviewer = reviewerIdx > -1 ? rest[reviewerIdx + 1] : process.env.ALPHAGAL_REVIEWER;
const today = new Date().toISOString().slice(0, 10);

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function archive(file, suffix = '') {
  fs.mkdirSync(ARCHIVE, { recursive: true });
  const ext = path.extname(file);
  const dest = path.join(ARCHIVE, `${path.basename(file, ext)}${suffix}${ext}`);
  fs.renameSync(file, dest);
  return dest;
}

function existingSlugs() {
  const slugs = new Map();
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.mdx?$/.test(entry.name)) {
        const slug = matter.read(full).data.slug;
        if (slug) slugs.set(slug, full);
      }
    }
  };
  walk(path.join(ROOT, 'content'));
  // File-system routed pages under src/pages/learn
  for (const f of fs.readdirSync(path.join(ROOT, 'src', 'pages', 'learn'))) {
    slugs.set(`/learn/${f.replace(/\.(mdx|tsx)$/, '').replace(/^index$/, '')}`.replace(/\/$/, ''), f);
  }
  return slugs;
}

function list() {
  const files = fs.existsSync(DRAFTS) ? fs.readdirSync(DRAFTS).filter((f) => !f.startsWith('.')) : [];
  if (!files.length) return console.log('Inbox is empty.');
  for (const f of files) {
    const full = path.join(DRAFTS, f);
    if (f.endsWith('.json')) {
      const c = readJson(full, {});
      console.log(`• ${f}  (${(c.include || []).length} trials to list)`);
      continue;
    }
    const { data, content } = matter.read(full);
    const words = content.split(/\s+/).filter(Boolean).length;
    console.log(`• ${f}\n    ${data.title}\n    ${data.slug} · ${words} words`);
  }
  console.log('\nReview each file, edit as needed, then: npm run inbox:publish -- <file> --reviewer "Your Name"');
}

function publishMdx(full, file) {
  if (!reviewer) fail('Pass --reviewer "Name" (or set ALPHAGAL_REVIEWER). Reviewed-by is shown on the page.');
  const parsed = matter.read(full);
  const fm = parsed.data;
  for (const key of ['title', 'slug', 'date', 'description']) if (!fm[key]) fail(`Frontmatter is missing "${key}"`);
  if (/TODO|VERIFY|\[citation needed\]/i.test(parsed.content)) fail('Draft still contains TODO/VERIFY markers. Resolve them first.');
  const clash = existingSlugs().get(fm.slug);
  if (clash) fail(`Slug ${fm.slug} already used by ${clash}`);

  const isResearch = file.startsWith('research-');
  const destDir = path.join(ROOT, 'content', isResearch ? 'research' : 'articles');
  fs.mkdirSync(destDir, { recursive: true });

  const { draft, pmids, ...published } = fm;
  Object.assign(published, { reviewer, reviewed_date: today });
  const dest = path.join(destDir, file.replace(/^(research|article)-/, ''));
  fs.writeFileSync(dest, matter.stringify(parsed.content, published));

  if (isResearch && Array.isArray(pmids)) {
    const state = readJson(STATE_FILE, { pmids: [], trials: {} });
    state.pmids = [...new Set([...state.pmids, ...pmids.map(String)])];
    writeJson(STATE_FILE, state);
    console.log(`  marked ${pmids.length} PMIDs as published`);
  }
  archive(full);
  console.log(`✓ Published ${path.relative(ROOT, dest)} → ${fm.slug}`);
}

function publishTrials(full) {
  const curation = readJson(full, null);
  if (!curation?.include) fail('trials-curation.json needs an "include" array of NCT ids');
  const latest = fs.readdirSync(DATA_DIR).filter((f) => f.startsWith('weekly-')).sort().pop();
  if (!latest) fail('No weekly data file found to pull trial details from');
  const { trials } = readJson(path.join(DATA_DIR, latest), {});
  const byId = new Map(trials.all.map((t) => [t.nctId, t]));
  const missing = curation.include.filter((id) => !byId.has(id));
  if (missing.length) fail(`Not in ${latest}: ${missing.join(', ')}`);

  const studies = curation.include.map((id) => ({ ...byId.get(id), plainSummary: curation.notes?.[id] || null }));
  writeJson(TRIALS_OUT, { updatedAt: today, source: 'ClinicalTrials.gov', studies });

  const state = readJson(STATE_FILE, { pmids: [], trials: {} });
  for (const t of trials.all) state.trials[t.nctId] = t.lastUpdated;
  writeJson(STATE_FILE, state);
  archive(full, `-${today}`);
  console.log(`✓ Wrote ${studies.length} trials to ${path.relative(ROOT, TRIALS_OUT)}`);
}

function resolveDraft() {
  if (!target) fail('Which draft? Run `npm run inbox` to list them.');
  const file = path.basename(target);
  const full = path.join(DRAFTS, file);
  if (!fs.existsSync(full)) fail(`${file} not found in automation/inbox/drafts`);
  return { file, full };
}

if (!command || command === 'list') list();
else if (command === 'publish') {
  const { file, full } = resolveDraft();
  if (file === 'trials-curation.json') publishTrials(full);
  else publishMdx(full, file);
  console.log('Next: npm run deploy');
} else if (command === 'reject') {
  const { full } = resolveDraft();
  console.log(`Archived to ${path.relative(ROOT, archive(full, '-rejected'))}`);
} else fail(`Unknown command ${command}`);

// Weekly research candidate collection.
//
// This script only writes src/data/research.pending.json. It never edits the
// reviewed research.json, never assigns a summary to a paper it has not read,
// and never marks anything as reviewed. A human editor promotes records.
//
// Source: Crossref REST API (public, no key). Crossref asks clients to identify
// themselves and to use the polite pool with a contact address. Set
// CROSSREF_MAILTO in the environment (or in the repository variable used by the
// GitHub Action). No paywalled content is fetched.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('.');
const today = new Date();
const iso = (date) => date.toISOString().slice(0, 10);
const daysAgo = (n) => {
  const d = new Date(today);
  d.setUTCDate(d.getUTCDate() - n);
  return d;
};

const from = iso(daysAgo(14));
const until = iso(today);
const mailto = process.env.CROSSREF_MAILTO?.trim();

const QUERIES = ['dinosaur', 'paleontology fossil', 'prehistoric vertebrate'];
const rows = 25;

const existing = JSON.parse(await readFile(path.join(root, 'src/data/research.json'), 'utf8'));
const pendingPath = path.join(root, 'src/data/research.pending.json');
let previous = [];
try {
  previous = JSON.parse(await readFile(pendingPath, 'utf8'));
} catch {
  previous = [];
}

const seen = new Set([
  ...existing.map((r) => r.doi).filter(Boolean).map((d) => d.toLowerCase()),
  ...previous.map((r) => r.doi).filter(Boolean).map((d) => d.toLowerCase()),
]);

const clean = (value = '') =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^Abstract\s*/i, '')
    .trim();

const records = [];

for (const [index, query] of QUERIES.entries()) {
  const params = new URLSearchParams({
    'query.bibliographic': query,
    filter: `from-pub-date:${from},until-pub-date:${until},type:journal-article`,
    rows: String(rows),
    select: 'DOI,title,author,published,container-title,publisher,URL,abstract,type',
    sort: 'published',
    order: 'desc',
  });
  if (mailto) params.set('mailto', mailto);

  const url = `https://api.crossref.org/works?${params.toString()}`;
  let response;
  try {
    response = await fetch(url, {
      headers: {
        'User-Agent': `MESOZO-data-review/1.0${mailto ? ` (mailto:${mailto})` : ''}`,
        Accept: 'application/json',
      },
    });
  } catch (error) {
    console.error(`Crossref request failed: ${error.message}`);
    process.exitCode = 1;
    continue;
  }

  if (!response.ok) {
    console.error(`Crossref returned HTTP ${response.status} for "${query}"`);
    process.exitCode = 1;
    continue;
  }

  const payload = await response.json();
  const items = payload?.message?.items ?? [];
  for (const item of items) {
    const doi = item.DOI?.toLowerCase();
    if (!doi || seen.has(doi)) continue;
    seen.add(doi);

    const published = item.published?.['date-parts']?.[0];
    if (!published?.length) continue;
    const date = `${published[0]}-${String(published[1] ?? 1).padStart(2, '0')}-${String(published[2] ?? 1).padStart(2, '0')}`;

    records.push({
      id: `pending-${doi.replace(/[^a-z0-9]+/g, '-')}`,
      title: clean(item.title?.[0] ?? 'Untitled record'),
      species: 'Not yet verified',
      publicationDate: date,
      institution: 'Not yet verified',
      journal: clean(item['container-title']?.[0] ?? item.publisher ?? 'Not yet verified'),
      summary:
        clean(item.abstract ?? '') ||
        'Abstract not deposited with Crossref. The editor must read the source before writing a summary.',
      sourceUrl: item.URL ?? `https://doi.org/${doi}`,
      doi: item.DOI,
      retrievedAt: iso(today),
      lastVerified: iso(today),
      reviewStatus: 'pending',
      evidenceType: 'peer-reviewed',
    });
  }

  // Crossref's polite pool permits modest use. Three queries per week is well
  // inside the limit; this delay is an extra courtesy.
  if (index < QUERIES.length - 1) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
  }
}

records.sort((a, b) => b.publicationDate.localeCompare(a.publicationDate));
await writeFile(pendingPath, `${JSON.stringify(records, null, 2)}\n`);

console.log(
  `Crossref: ${records.length} new pending candidate(s) from ${from} to ${until}. ` +
    'Nothing was published; research.json was not modified.',
);

if (records.length === 0 && previous.length === 0) {
  console.log('No candidates. The review PR will be skipped.');
}

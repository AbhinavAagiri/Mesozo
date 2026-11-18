// Cross-link validation for the species / period / formation / debate / glossary
// layer. Read-only: it reports broken or inconsistent links instead of changing
// data. Run before a build or after editing the learning layer.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('.');
const readJson = async (file) => JSON.parse(await readFile(path.join(root, file), 'utf8'));
const readText = (file) => readFile(path.join(root, file), 'utf8');

const errors = [];
const notes = [];
const fail = (message) => errors.push(message);
const note = (message) => notes.push(message);

const speciesFiles = (await readdir(path.join(root, 'src/data/species')))
  .filter((file) => file.endsWith('.json'))
  .map((file) => file.replace(/\.json$/, ''))
  .sort();
const species = [];
for (const slug of speciesFiles) species.push(await readJson(`src/data/species/${slug}.json`));
const speciesBySlug = new Map(species.map((item) => [item.slug, item]));

const archive = await readJson('src/data/discovery-archive.json');
const geological = await readJson('src/data/geological-time.json');
const claims = await readJson('src/data/claim-reviews.json');
const spinosaurusHypotheses = await readJson('src/data/spinosaurus-hypotheses.json');
const learning = await readText('src/data/learning.ts');

const formations = new Map((archive.formations ?? []).map((item) => [item.id, item]));
const locations = new Map((archive.locations ?? []).map((item) => [item.id, item]));
const events = new Map((archive.discoveries ?? []).map((item) => [item.id, item]));
const specimens = new Map((archive.specimens ?? []).map((item) => [item.id, item]));
const units = new Map(geological.units.map((item) => [item.id, item]));

/* Learning layer: glossary ids, topic slugs and paths. */

const glossaryStart = learning.indexOf('export const glossaryEntries');
const glossaryBlock = learning.slice(glossaryStart);
const glossaryIds = new Set(
  [...glossaryBlock.matchAll(/\n    id: '([^']+)'/g)].map((match) => match[1]),
);
const topicSection = learning.slice(0, learning.indexOf('export const learningPaths'));

for (const id of glossaryIds) {
  if (!/^[a-z0-9-]+$/.test(id)) fail(`glossary id is not URL-safe: "${id}"`);
}
for (const match of topicSection.matchAll(/terms: \[([^\]]*)\]/g)) {
  for (const id of [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1])) {
    if (!glossaryIds.has(id)) fail(`guide section term: unknown glossary id "${id}"`);
  }
}
for (const match of topicSection.matchAll(/keyTerms: \[([^\]]*)\]/g)) {
  for (const id of [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1])) {
    if (!glossaryIds.has(id)) fail(`guide keyTerms: unknown glossary id "${id}"`);
  }
}

const learningTargets = [
  ...[...learning.matchAll(/to: '([^']+)'/g)].map((match) => match[1]),
  ...[...learning.matchAll(/url: '(\/[^']+)'/g)].map((match) => match[1]),
];

const staticAnchors = {
  '/prehistoric-world': new Set(['worlds']),
  '/discoveries': new Set(['archive', 'history', 'map']),
  '/fossil-evidence': new Set(['standards']),
  '/about': new Set(['evidence']),
  '/anatomy': new Set(['sources']),
  '/glossary': glossaryIds,
};
const staticRoutes = new Set([
  '/',
  '/explore',
  '/prehistoric-world',
  '/fossil-evidence',
  '/learn',
  '/glossary',
  '/species',
  '/classification',
  '/deep-time',
  '/anatomy',
  '/discoveries',
  '/journal',
  '/about',
]);

function checkRoute(where, url) {
  if (/^https?:/i.test(url)) return;
  const [beforeHash, hash = ''] = url.split('#');
  const [pathPart, query = ''] = beforeHash.split('?');
  if (!pathPart.startsWith('/')) {
    fail(`${where}: relative link ${url}`);
    return;
  }
  if (pathPart.startsWith('/learn/paths/')) {
    const id = pathPart.slice('/learn/paths/'.length);
    if (!learning.includes(`id: '${id}',\n    title:`)) fail(`${where}: unknown learning path ${url}`);
    return;
  }
  if (pathPart.startsWith('/learn/')) {
    const slug = pathPart.slice('/learn/'.length);
    if (!learning.includes(`slug: '${slug}'`)) fail(`${where}: unknown learning guide ${url}`);
    return;
  }
  if (pathPart.startsWith('/species/')) {
    if (!speciesBySlug.has(pathPart.slice('/species/'.length))) {
      fail(`${where}: unknown species ${url}`);
    }
    return;
  }
  if (pathPart.startsWith('/prehistoric-world/ecosystem/')) {
    if (!formations.has(pathPart.slice('/prehistoric-world/ecosystem/'.length))) {
      fail(`${where}: unknown formation ${url}`);
    }
    return;
  }
  if (pathPart.startsWith('/discoveries/specimen/')) {
    if (!specimens.has(pathPart.slice('/discoveries/specimen/'.length))) {
      fail(`${where}: unknown specimen ${url}`);
    }
    return;
  }
  if (pathPart.startsWith('/journal/')) return;
  if (pathPart === '/deep-time') {
    const period = new URLSearchParams(query).get('period');
    if (period && !units.has(period)) fail(`${where}: unknown deep-time unit ${url}`);
    return;
  }
  if (pathPart === '/anatomy') {
    const speciesId = new URLSearchParams(query).get('species');
    if (speciesId && !speciesBySlug.has(speciesId)) fail(`${where}: unknown atlas species ${url}`);
    return;
  }
  if (staticRoutes.has(pathPart)) {
    const anchors = staticAnchors[pathPart];
    if (hash && anchors && !anchors.has(hash)) fail(`${where}: unknown ${pathPart} anchor #${hash}`);
    return;
  }
  fail(`${where}: unknown route ${url}`);
}

for (const url of new Set(learningTargets)) checkRoute('learning.ts', url);

const pathHeaders = [...learning.matchAll(/    id: '([a-z-]+)',\n    title: '([^']+)',/g)].map(
  (match) => match[1],
);
if (pathHeaders.length !== 5) fail(`expected 5 learning paths, found ${pathHeaders.length}`);

const pathBlocks = [
  ...learning.matchAll(/    id: '([a-z-]+)',\n    title: '[^']+',[\s\S]*?    steps: \[([\s\S]*?)\n    \],\n  \},/g),
];
if (pathBlocks.length !== 5) fail(`could not read every learning path (${pathBlocks.length})`);
for (const [, id, steps] of pathBlocks) {
  const targets = [...steps.matchAll(/to: '([^']+)'/g)].map((match) => match[1]);
  const labels = [...steps.matchAll(/label: '([^']+)'/g)].map((match) => match[1]);
  if (!targets.length) fail(`learning path ${id}: no steps`);
  if (labels.length !== targets.length) fail(`learning path ${id}: step labels/targets mismatch`);
  if (new Set(targets).size !== targets.length) fail(`learning path ${id}: repeated step`);
}

/* Species ↔ period ↔ formation. */

const formationsWithSpecimens = new Set();
for (const item of species) {
  const unit = units.get(item.period);
  if (!unit) {
    fail(`${item.slug}: unknown period ${item.period}`);
    continue;
  }
  if (item.ageMa[0] > unit.startMa || item.ageMa[1] < unit.endMa) {
    fail(`${item.slug}: age range outside ${item.period}`);
  }
  if (!item.stage?.trim()) fail(`${item.slug}: missing stage`);
}

for (const formation of archive.formations ?? []) {
  const unit = units.get(formation.periodId);
  if (!unit) {
    fail(`formation ${formation.id}: unknown period ${formation.periodId}`);
    continue;
  }
  if (formation.ageMa[0] > unit.startMa || formation.ageMa[1] < unit.endMa) {
    fail(`formation ${formation.id}: age range outside ${formation.periodId}`);
  }
}

for (const specimen of archive.specimens ?? []) {
  const item = speciesBySlug.get(specimen.speciesId);
  if (!item) {
    fail(`specimen ${specimen.id}: unknown species ${specimen.speciesId}`);
    continue;
  }
  const event = events.get(specimen.discoveryId);
  if (!event) {
    fail(`specimen ${specimen.id}: unknown discovery event ${specimen.discoveryId}`);
    continue;
  }
  const formation = formations.get(event.formationId);
  if (!formation) {
    fail(`specimen ${specimen.id}: unknown formation ${event.formationId}`);
    continue;
  }
  formationsWithSpecimens.add(formation.id);
  if (!locations.has(event.locationId)) {
    fail(`specimen ${specimen.id}: unknown locality ${event.locationId}`);
  }
  if (formation.periodId !== item.period) {
    fail(`${specimen.identifier}: species period ${item.period} but formation ${formation.id} is ${formation.periodId}`);
  }
  const overlap =
    Math.min(item.ageMa[0], formation.ageMa[0]) - Math.max(item.ageMa[1], formation.ageMa[1]);
  if (overlap < 0) {
    fail(`${specimen.identifier}: species ${item.ageLabel} does not overlap formation ${formation.ageLabel}`);
  }
  if (!event.specimenIds?.includes(specimen.id)) {
    fail(`specimen ${specimen.id}: discovery event ${event.id} does not list it`);
  }
  if (!event.relatedSpeciesIds?.includes(specimen.speciesId)) {
    fail(`specimen ${specimen.id}: discovery event ${event.id} does not list ${specimen.speciesId}`);
  }
}

for (const formation of formations.values()) {
  if (!formationsWithSpecimens.has(formation.id)) {
    note(`formation ${formation.id}: no specimen in the archive is linked to it`);
  }
}

/* Species relationships. */

const relationshipKinds = new Set(['genus', 'family', 'context', 'period', 'region', 'clade', 'ecology']);
let periodComparisons = 0;
for (const item of species) {
  for (const relation of item.relationships ?? []) {
    const target = speciesBySlug.get(relation.slug);
    if (!target) {
      fail(`${item.slug}: relationship to unknown species ${relation.slug}`);
      continue;
    }
    if (!relationshipKinds.has(relation.kind)) {
      fail(`${item.slug}: unknown relationship kind ${relation.kind}`);
    }
    if (relation.kind === 'period') {
      periodComparisons += 1;
      if (target.period !== item.period) {
        fail(`${item.slug}: period comparison with ${target.slug} spans different periods`);
      }
    }
  }
}

/* Debate layer. */

const dossierDebateSpecies = [];
let claimDebateSpecies = 0;
for (const slug of speciesFiles) {
  const review = claims.reviews?.[slug];
  const debateClaims = (review?.claims ?? []).filter((claim) => claim.evidence === 'debate');
  if (debateClaims.length) claimDebateSpecies += 1;

  let page;
  try {
    page = await readJson(`src/data/species-pages/${slug}.json`);
  } catch {
    page = undefined;
  }
  if (!page?.debates) continue;
  dossierDebateSpecies.push(slug);

  const hypotheses =
    page.debates.hypotheses ?? (slug === 'spinosaurus' ? spinosaurusHypotheses : []);
  const hypothesisIds = new Set(hypotheses.map((hypothesis) => hypothesis.id));
  for (const id of Object.keys(page.debates.questions ?? {})) {
    if (!hypothesisIds.has(id)) fail(`${slug}: debate question "${id}" has no hypothesis`);
  }
  for (const hypothesis of hypotheses) {
    if (!page.debates.questions?.[hypothesis.id]) {
      fail(`${slug}: hypothesis "${hypothesis.id}" has no question label`);
    }
  }
}

if (claimDebateSpecies > dossierDebateSpecies.length) {
  note(
    `${claimDebateSpecies - dossierDebateSpecies.length} species carry debate-tagged claims without a separate debates section; they are shown in the claims layer.`,
  );
}

/* Summary. */

const speciesWithSpecimens = new Set(
  (archive.specimens ?? []).map((specimen) => specimen.speciesId),
);
const glossarySpecimenLinks = [...glossaryBlock.matchAll(/to: '\/discoveries\/specimen\//g)].length;

console.log(
  `Cross-links: ${species.length} species, ${speciesWithSpecimens.size} with specimen records, ${specimens.size} specimens, ${formations.size} formations, ${locations.size} localities.`,
);
console.log(
  `Learning: ${pathHeaders.length} paths, ${learningTopicsCount(topicSection)} guides, ${glossaryIds.size} glossary ids, ${glossarySpecimenLinks} glossary→specimen links, ${periodComparisons} period comparisons.`,
);
console.log(`Debates: ${claimDebateSpecies} species with debate-tagged claims, ${dossierDebateSpecies.length} dossier debates section(s).`);
for (const message of notes) console.log(`NOTE  ${message}`);
for (const message of errors) console.error(`ERROR ${message}`);
if (errors.length) {
  console.error(`\n${errors.length} cross-link error(s).`);
  process.exit(1);
}
console.log('Cross-link validation passed.');

function learningTopicsCount(text) {
  return new Set([...text.matchAll(/slug: '([^']+)'/g)].map((match) => match[1])).size;
}

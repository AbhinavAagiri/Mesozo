// Static-data checks. Run before every build or update PR.
// Exits non-zero on errors; warnings do not fail the build.
import { readFile, access, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('.');
const errors = [];
const warnings = [];

const readJson = async (file) => JSON.parse(await readFile(path.join(root, file), 'utf8'));
const exists = async (file) => {
  try {
    await access(path.join(root, file));
    return true;
  } catch {
    return false;
  }
};

const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);

const assets = await readJson('src/data/assets.json');
const geologicalTime = await readJson('src/data/geological-time.json');
const deepTime = await readJson('src/data/deep-time-content.json');
const references = [
  ...(await readJson('src/data/references.json')),
  ...(await readJson('src/data/references-v19.json')),
];
const referenceSourceTypes = new Set([
  'Peer-reviewed article',
  'Museum bulletin',
  'Museum catalogue',
  'Historical monograph',
  'Historical article',
  'Institutional report',
  'Book chapter',
]);
const research = await readJson('src/data/research.json');
const researchTrails = await readJson('src/data/research-trails.json');
const claimReviews = await readJson('src/data/claim-reviews.json');
const speciesAudit = await readJson('src/data/species-audit.json');
const discoveries = await readJson('src/data/discoveries.json');
const discoveryArchive = await readJson('src/data/discovery-archive.json');
const timeline = await readJson('src/data/spinosaurus-timeline.json');
const hypotheses = await readJson('src/data/spinosaurus-hypotheses.json');
const atlas = await readJson('src/data/anatomical-atlas.json');
const classification = await readJson('src/data/classification.json');
const speciesFiles = (await readdir(path.join(root, 'src/data/species')))
  .filter((file) => file.endsWith('.json'))
  .map((file) => file.replace(/\.json$/, ''))
  .sort();
const species = [];
for (const slug of speciesFiles) {
  species.push(await readJson(`src/data/species/${slug}.json`));
}
const learningSource = await readFile(path.join(root, 'src/data/learning.ts'), 'utf8');
const learningTopicSlugs = new Set(
  [...learningSource.matchAll(/slug: '([^']+)'/g)].map((match) => match[1]),
);
const primerAtlasSpeciesIds = new Set((atlas.cases ?? []).map((item) => item.speciesId));

const geoUnits = geologicalTime.units;
const geoUnitById = new Map(geoUnits.map((unit) => [unit.id, unit]));
const periodUnits = geoUnits.filter((unit) => unit.rank === 'period');
const validPeriods = new Set(periodUnits.map((unit) => unit.id));

/* Assets */

const assetIds = new Set();
const licensed = new Set(['CC0 1.0', 'CC BY 2.0', 'CC BY 2.5', 'CC BY 3.0', 'CC BY 4.0', 'CC BY-SA 2.0', 'CC BY-SA 2.5', 'CC BY-SA 3.0', 'CC BY-SA 4.0', 'Public domain', 'SIL Open Font License 1.1']);
for (const asset of assets) {
  if (!asset.id) fail('Asset without id');
  if (assetIds.has(asset.id)) fail(`Duplicate asset id: ${asset.id}`);
  assetIds.add(asset.id);
  for (const field of ['title', 'creator', 'sourceUrl', 'license', 'licenseUrl', 'attribution', 'modifications', 'usedIn']) {
    if (!asset[field] || (Array.isArray(asset[field]) && asset[field].length === 0)) {
      fail(`Asset ${asset.id}: missing ${field}`);
    }
  }
  if (!licensed.has(asset.license)) {
    fail(`Asset ${asset.id}: licence "${asset.license}" is not on the approved list`);
  }
  if (!/^https:\/\/.+/.test(asset.sourceUrl ?? '')) fail(`Asset ${asset.id}: sourceUrl must be https`);
  if (!/^https:\/\/.+/.test(asset.licenseUrl ?? '')) fail(`Asset ${asset.id}: licenseUrl must be https`);
  if (!Array.isArray(asset.widths)) {
    fail(`Asset ${asset.id}: widths must be an array`);
    continue;
  }
  for (const width of asset.widths) {
    for (const ext of ['avif', 'webp']) {
      const file = `public/assets/img/${asset.id}-${width}.${ext}`;
      if (!(await exists(file))) fail(`Missing derivative: ${file}`);
    }
  }
}

/* References */

const refIds = new Set();
for (const ref of references) {
  if (!ref.id) fail('Reference without id');
  if (refIds.has(ref.id)) fail(`Duplicate reference id: ${ref.id}`);
  refIds.add(ref.id);
  if (!ref.authors || !ref.year || !ref.title) fail(`Reference ${ref.id}: incomplete`);
  if (ref.sourceType && !referenceSourceTypes.has(ref.sourceType)) {
    fail(`Reference ${ref.id}: unknown source type "${ref.sourceType}"`);
  }
  if (ref.issue !== undefined && typeof ref.issue !== 'string') {
    fail(`Reference ${ref.id}: issue must be a string`);
  }
  if (ref.openAccessUrl !== undefined && !/^https:\/\/.+/.test(ref.openAccessUrl)) {
    fail(`Reference ${ref.id}: openAccessUrl must be https`);
  }
  if (ref.subjects !== undefined && (!Array.isArray(ref.subjects) || ref.subjects.some((subject) => typeof subject !== 'string'))) {
    fail(`Reference ${ref.id}: subjects must be an array of strings`);
  }
  if (!ref.doi && !ref.url) warn(`Reference ${ref.id}: no DOI or URL`);
}

/* Claim reviews and the species audit */

const claimEvidence = new Set(['direct', 'inference', 'debate', 'unknown']);
const claimStatuses = new Set([
  'researched-enriched',
  'reviewed-no-new-evidence',
  'partially-researched',
  'requires-verification',
]);
const reviewSlugs = new Set();
const allClaimIds = new Set();
for (const [slug, review] of Object.entries(claimReviews.reviews ?? {})) {
  if (reviewSlugs.has(slug)) fail(`Duplicate claim review: ${slug}`);
  if (!speciesFiles.includes(slug)) fail(`Claim review ${slug}: no matching species file`);
  reviewSlugs.add(slug);
  if (!claimStatuses.has(review.status)) fail(`Claim review ${slug}: unknown status ${review.status}`);
  if (!review.reviewed || !/^\d{4}-\d{2}-\d{2}$/.test(review.reviewed)) {
    fail(`Claim review ${slug}: invalid reviewed date`);
  }
  if (!review.scope || !Array.isArray(review.sourcesRead) || !review.sourcesRead.length) {
    fail(`Claim review ${slug}: missing scope or access record`);
  }
  if (!Array.isArray(review.claims) || !review.claims.length) {
    fail(`Claim review ${slug}: no claims`);
  }
  if (!Array.isArray(review.gaps) || !review.gaps.length) {
    fail(`Claim review ${slug}: no stated gaps`);
  }
  const claimIds = new Set();
  for (const claim of review.claims ?? []) {
    if (!claim.id || claimIds.has(claim.id)) fail(`Claim review ${slug}: duplicate or missing claim id ${claim.id}`);
    if (claim.id && allClaimIds.has(claim.id)) fail(`Claim id is reused across reviews: ${claim.id}`);
    claimIds.add(claim.id);
    if (claim.id) allClaimIds.add(claim.id);
    if (!claim.statement || typeof claim.statement !== 'string') {
      fail(`Claim review ${slug} / ${claim.id}: missing statement`);
    }
    if (!claimEvidence.has(claim.evidence)) {
      fail(`Claim review ${slug} / ${claim.id}: unknown evidence category ${claim.evidence}`);
    }
    checkRefs(`Claim review ${slug} / ${claim.id}`, claim.refs);
  }
}

const auditEntries = speciesAudit.entries ?? {};
if (speciesAudit.total !== Object.keys(auditEntries).length) {
  fail(`Species audit: total ${speciesAudit.total} does not match ${Object.keys(auditEntries).length} entries`);
}
for (const [slug, entry] of Object.entries(auditEntries)) {
  if (!claimStatuses.has(entry.status) && entry.status !== 'protected-existing') {
    fail(`Species audit ${slug}: unknown status ${entry.status}`);
  }
  if (!Array.isArray(entry.flags)) fail(`Species audit ${slug}: flags must be an array`);
  if (!entry.note) fail(`Species audit ${slug}: missing note`);
}
for (const slug of reviewSlugs) {
  if (!auditEntries[slug]) fail(`Claim review ${slug}: missing from species audit`);
  if (auditEntries[slug]?.status !== 'researched-enriched') {
    fail(`Claim review ${slug}: audit status is not researched-enriched`);
  }
}

function checkRefs(where, ids) {
  if (!Array.isArray(ids)) {
    fail(`${where}: refs must be an array`);
    return;
  }
  for (const id of ids) {
    if (!refIds.has(id)) fail(`${where}: unknown reference "${id}"`);
  }
}

/* Species */

const slugs = new Set();
const accessions = new Set();
const validGroups = new Set(['Theropoda', 'Sauropodomorpha', 'Ornithischia', 'Saurischia']);
const sourceText = [];
for (const s of species) {
  if (slugs.has(s.slug)) fail(`Duplicate species slug: ${s.slug}`);
  slugs.add(s.slug);
  for (const field of [
    'slug', 'accession', 'scientificName', 'commonName', 'genus', 'epithet', 'status', 'namedBy',
    'group', 'groupKey', 'period', 'periodLabel', 'stage', 'ageLabel', 'region', 'regionKeys',
    'diet', 'dietLabel', 'length', 'mass', 'sizeNote', 'tagline', 'summary', 'taxonomy',
    'discovery', 'fossilEvidence', 'anatomy', 'behaviour', 'reconstruction', 'references',
    'related', 'confidenceNote', 'updated', 'added', 'dietEvidence', 'sizeRefs',
  ]) {
    if (s[field] === undefined || s[field] === null || s[field] === '') {
      fail(`${s.slug}: missing ${field}`);
    }
  }
  if (!validPeriods.has(s.period)) fail(`${s.slug}: unknown period ${s.period}`);
  if (s.accession && !/^MZ-\d{3}$/.test(s.accession)) fail(`${s.slug}: accession must be MZ-000`);
  if (accessions.has(s.accession)) fail(`${s.slug}: duplicate accession ${s.accession}`);
  accessions.add(s.accession);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s.added ?? '')) fail(`${s.slug}: added must be YYYY-MM-DD`);
  if (!validGroups.has(s.groupKey)) fail(`${s.slug}: unexpected groupKey ${s.groupKey}`);
  if (!Array.isArray(s.ageMa) || s.ageMa.length !== 2 || s.ageMa[0] <= s.ageMa[1]) {
    fail(`${s.slug}: ageMa must be [older, younger]`);
  }
  const speciesPeriod = geoUnitById.get(s.period);
  if (speciesPeriod && (s.ageMa[0] > speciesPeriod.startMa || s.ageMa[1] < speciesPeriod.endMa)) {
    fail(`${s.slug}: ageMa extends outside ${s.period}`);
  }
  if (s.image && !assetIds.has(s.image)) fail(`${s.slug}: image asset "${s.image}" is not registered`);
  if (s.fossilImage && !assetIds.has(s.fossilImage)) fail(`${s.slug}: fossilImage "${s.fossilImage}" is not registered`);
  checkRefs(`${s.slug} references`, s.references);
  checkRefs(`${s.slug} discovery`, s.discovery.refs);
  checkRefs(`${s.slug} behaviour`, s.behaviour.refs);
  checkRefs(`${s.slug} reconstruction`, s.reconstruction.refs);
  checkRefs(`${s.slug} diet`, s.dietEvidence.refs);
  checkRefs(`${s.slug} size`, s.sizeRefs);
  for (const item of [...s.fossilEvidence, ...s.anatomy]) checkRefs(`${s.slug} / ${item.title}`, item.refs);
  const researchTopics = new Set([
    'taxonomy', 'anatomy', 'growth', 'geology', 'palaeobiology', 'history', 'general',
  ]);
  const evidenceKinds = new Set(['fossil', 'reconstruction', 'inference', 'contested', 'unknown']);
  const trail = researchTrails[s.slug];
  for (const entry of trail?.entries ?? []) {
    if (!entry.title || !entry.body || !entry.topic || !entry.access) {
      fail(`${s.slug}: incomplete research entry`);
      continue;
    }
    if (!researchTopics.has(entry.topic)) fail(`${s.slug}: unknown research topic ${entry.topic}`);
    if (!evidenceKinds.has(entry.evidence)) fail(`${s.slug}: unknown evidence kind ${entry.evidence}`);
    checkRefs(`${s.slug} research / ${entry.title}`, entry.refs ?? []);
  }
  if (Number(s.accession.slice(3)) >= 14) {
    if (!Array.isArray(trail?.entries) || trail.entries.length === 0) {
      fail(`${s.slug}: expanded species requires a V19 research trail`);
    }
    if (!s.researchStatus) fail(`${s.slug}: expanded species requires a research status`);
  }
  if (s.synonyms && (!Array.isArray(s.synonyms) || s.synonyms.some((item) => typeof item !== 'string'))) {
    fail(`${s.slug}: synonyms must be an array of strings`);
  }
  for (const related of s.related) {
    if (!speciesFiles.includes(related)) fail(`${s.slug}: related slug "${related}" has no dossier`);
  }
  const cladeValues = s.taxonomy.filter((row) => row.rank === 'Clade').map((row) => row.value);
  if (!cladeValues.includes('Dinosauria')) fail(`${s.slug}: taxonomy must include Dinosauria`);
  if (!cladeValues.includes(s.groupKey)) fail(`${s.slug}: groupKey ${s.groupKey} is not a Clade row`);
  if (!s.taxonomy.some((row) => row.rank === 'Genus')) fail(`${s.slug}: taxonomy must include Genus`);
  if (!s.taxonomy.some((row) => row.rank === 'Species')) fail(`${s.slug}: taxonomy must include Species`);
  if (!s.taxonomy.some((row) => row.rank === 'Family')) fail(`${s.slug}: taxonomy must include Family`);
  sourceText.push(`${s.scientificName} ${s.summary} ${s.discovery.body}`);
}

if (species.length < 100) fail(`Species expansion incomplete: ${species.length} records`);
for (const slug of Object.keys(researchTrails)) {
  if (!slugs.has(slug)) fail(`Research trail for unknown species: ${slug}`);
}
for (const slug of Object.keys(auditEntries)) {
  if (!slugs.has(slug)) fail(`Species audit for unknown species: ${slug}`);
}
for (const slug of reviewSlugs) {
  if (!slugs.has(slug)) fail(`Claim review for unknown species: ${slug}`);
}
for (const slug of slugs) {
  if (!auditEntries[slug]) fail(`Species ${slug}: missing from the species audit`);
}

/* Beginner primers ------------------------------------------------- */

const formationIds = new Set((discoveryArchive.formations ?? []).map((item) => item.id));
const staticPrimerRoutes = new Set(['/fossil-evidence', '/about', '/glossary']);

function checkPrimerLink(where, url) {
  if (typeof url !== 'string' || !url.trim()) {
    fail(`${where}: empty link`);
    return;
  }
  if (/\s/.test(url)) fail(`${where}: link contains whitespace — ${url}`);
  if (/^https?:/i.test(url)) fail(`${where}: external link in primer — ${url}`);

  const [beforeHash, hash = ''] = url.split('#');
  const [pathPart, query = ''] = beforeHash.split('?');
  const params = new URLSearchParams(query);

  if (pathPart.startsWith('/learn/')) {
    const topic = pathPart.slice('/learn/'.length);
    if (!learningTopicSlugs.has(topic)) fail(`${where}: unknown learning guide "${topic}"`);
    return;
  }
  if (pathPart.startsWith('/species/')) {
    const slug = pathPart.slice('/species/'.length);
    if (!slugs.has(slug)) fail(`${where}: unknown species "${slug}"`);
    return;
  }
  if (pathPart.startsWith('/prehistoric-world/ecosystem/')) {
    const formation = pathPart.slice('/prehistoric-world/ecosystem/'.length);
    if (!formationIds.has(formation)) fail(`${where}: unknown formation "${formation}"`);
    return;
  }
  if (pathPart === '/prehistoric-world') {
    if (hash && hash !== 'worlds') fail(`${where}: unknown prehistoric-world anchor #${hash}`);
    return;
  }
  if (pathPart === '/deep-time') {
    const period = params.get('period');
    if (!period || !validPeriods.has(period)) fail(`${where}: invalid deep-time period "${period}"`);
    return;
  }
  if (pathPart === '/anatomy') {
    const speciesId = params.get('species');
    if (!speciesId || !primerAtlasSpeciesIds.has(speciesId)) {
      fail(`${where}: invalid anatomy species "${speciesId}"`);
    }
    return;
  }
  if (staticPrimerRoutes.has(pathPart)) return;
  fail(`${where}: unknown internal route "${url}"`);
}

for (const s of species) {
  if (!s.primer) continue;
  if (typeof s.primer.lead !== 'string' || !s.primer.lead.trim()) {
    fail(`${s.slug}: primer lead is missing`);
  }
  if (!Array.isArray(s.primer.paragraphs) || s.primer.paragraphs.length < 2) {
    fail(`${s.slug}: primer needs at least two paragraphs`);
  }
  const texts = [s.primer.lead, ...(s.primer.paragraphs ?? []), s.primer.takeaway]
    .filter((text) => typeof text === 'string');
  let linkCount = 0;
  for (const [position, text] of texts.entries()) {
    for (const match of text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
      if (!match[1].trim()) fail(`${s.slug}: primer link has no label`);
      checkPrimerLink(`${s.slug} primer ${position + 1}`, match[2]);
      linkCount += 1;
    }
  }
  if (!linkCount) fail(`${s.slug}: primer has no internal links`);
}

/* Classification */

const classificationNodes = classification.nodes ?? [];
const classificationIds = new Set();
const classificationById = new Map();
for (const node of classificationNodes) {
  if (!node.id || !node.label || !node.rank || !node.note) {
    fail(`Classification node incomplete: ${node.id ?? 'unknown'}`);
    continue;
  }
  if (classificationIds.has(node.id)) fail(`Duplicate classification node: ${node.id}`);
  classificationIds.add(node.id);
  classificationById.set(node.id, node);
  if (!['Clade', 'Superfamily', 'Family', 'Subfamily'].includes(node.rank)) {
    fail(`Classification node ${node.id}: invalid rank ${node.rank}`);
  }
  if (!Array.isArray(node.taxa) || !node.taxa.length) {
    fail(`Classification node ${node.id}: missing taxa`);
  }
}
for (const node of classificationNodes) {
  if (node.parentId && !classificationIds.has(node.parentId)) {
    fail(`Classification node ${node.id}: unknown parent ${node.parentId}`);
  }
  const seen = new Set([node.id]);
  let current = node;
  while (current?.parentId) {
    if (seen.has(current.parentId)) {
      fail(`Classification cycle at ${node.id}`);
      break;
    }
    seen.add(current.parentId);
    current = classificationById.get(current.parentId);
  }
  if (!node.note) fail(`Classification node ${node.id}: missing note`);
}
for (const s of species) {
  if (!s.groupKey || !classificationNodes.some((node) => node.taxa.includes(s.groupKey))) {
    fail(`${s.slug}: groupKey ${s.groupKey} is absent from the classification tree`);
  }
  const family = s.taxonomy.find((row) => row.rank === 'Family')?.value;
  if (family && !classificationNodes.some((node) => node.taxa.includes(family))) {
    fail(`${s.slug}: family ${family} is absent from the classification tree`);
  }
}

/* Geological hierarchy */

const validRanks = new Set(['supereon', 'eon', 'era', 'period', 'epoch']);
const expectedParentRank = {
  supereon: null,
  eon: 'supereon',
  era: 'eon',
  period: 'era',
  epoch: 'period',
};
const geoIds = new Set();
for (const unit of geoUnits) {
  if (!unit.id || !unit.name) fail('Geological unit without id/name');
  if (geoIds.has(unit.id)) fail(`Duplicate geological unit id: ${unit.id}`);
  geoIds.add(unit.id);
  if (!validRanks.has(unit.rank)) fail(`Geological unit ${unit.id}: invalid rank ${unit.rank}`);
  if (!Number.isFinite(unit.startMa) || !Number.isFinite(unit.endMa) || unit.startMa <= unit.endMa) {
    fail(`Geological unit ${unit.id}: invalid boundaries`);
  }
  checkRefs(`Geological unit ${unit.id}`, unit.sourceRefs ?? []);
  if (unit.parentId === null) {
    if (unit.rank === 'era' || unit.rank === 'period' || unit.rank === 'epoch') {
      fail(`Geological unit ${unit.id}: ${unit.rank} must have a parent`);
    }
  } else {
    const parent = geoUnitById.get(unit.parentId);
    if (!parent) fail(`Geological unit ${unit.id}: unknown parent ${unit.parentId}`);
    else {
      const parentRank = expectedParentRank[unit.rank];
      if (parentRank && parentRank !== parent.rank) {
        fail(`Geological unit ${unit.id}: ${unit.rank} cannot be a child of ${parent.rank}`);
      }
      if (unit.startMa > parent.startMa || unit.endMa < parent.endMa) {
        fail(`Geological unit ${unit.id}: extends outside its parent ${parent.id}`);
      }
    }
  }
  if (unit.rank === 'period') {
    const periodEpochs = geoUnits.some((child) => child.parentId === unit.id && child.rank === 'epoch');
    if (!unit.stages?.length && !periodEpochs) warn(`Period ${unit.id}: no stage list`);
    for (const stage of unit.stages ?? []) {
      if (stage.startMa <= stage.endMa) fail(`Period ${unit.id} / ${stage.name}: invalid stage boundaries`);
    }
    if (unit.stages?.length) {
      if (unit.stages[0].startMa !== unit.startMa) {
        fail(`Period ${unit.id}: first stage does not start at the period boundary`);
      }
      if (unit.stages[unit.stages.length - 1].endMa !== unit.endMa) {
        fail(`Period ${unit.id}: last stage does not end at the period boundary`);
      }
      for (let i = 1; i < unit.stages.length; i += 1) {
        if (unit.stages[i].startMa !== unit.stages[i - 1].endMa) {
          fail(`Period ${unit.id}: stage gap between ${unit.stages[i - 1].name} and ${unit.stages[i].name}`);
        }
      }
    }
  }
}

for (const parent of geoUnits) {
  const children = geoUnits
    .filter((unit) => unit.parentId === parent.id)
    .sort((a, b) => b.startMa - a.startMa);
  if (!children.length) continue;
  if (children[0].startMa !== parent.startMa) {
    fail(`Geological hierarchy ${parent.id}: children start at ${children[0].startMa}, parent starts at ${parent.startMa}`);
  }
  if (children[children.length - 1].endMa !== parent.endMa) {
    fail(`Geological hierarchy ${parent.id}: children end at ${children[children.length - 1].endMa}, parent ends at ${parent.endMa}`);
  }
  for (let i = 1; i < children.length; i += 1) {
    if (children[i].startMa !== children[i - 1].endMa) {
      fail(`Geological hierarchy ${parent.id}: gap between ${children[i - 1].id} and ${children[i].id}`);
    }
  }
}

const orderedPeriods = [...periodUnits].sort((a, b) => b.startMa - a.startMa);
if (orderedPeriods[0]?.startMa !== 538.8) fail('Phanerozoic period sequence must start at 538.8 Ma');
if (orderedPeriods[orderedPeriods.length - 1]?.endMa !== 0) fail('Phanerozoic period sequence must end at 0 Ma');
for (let i = 1; i < orderedPeriods.length; i += 1) {
  if (orderedPeriods[i].startMa !== orderedPeriods[i - 1].endMa) {
    fail(`Period boundary mismatch: ${orderedPeriods[i - 1].id} ends ${orderedPeriods[i - 1].endMa}, ${orderedPeriods[i].id} starts ${orderedPeriods[i].startMa}`);
  }
}

if (geologicalTime.version !== 'v2026/06') fail('Geological time scale version must be v2026/06');
if (geologicalTime.sourceRef !== 'ics2026') fail('Geological time scale must cite ics2026');

/* Editorial content and events */

const contentUnits = Object.keys(deepTime.units ?? {});
for (const unit of geoUnits) {
  const content = deepTime.units?.[unit.id];
  if (!content) {
    if (unit.rank !== 'epoch') fail(`Missing Deep Time content for unit ${unit.id}`);
    continue;
  }
  if (!content.tagline || !content.summary) fail(`Deep Time content ${unit.id}: missing tagline/summary`);
  if (!Array.isArray(content.life) || !content.life.length) fail(`Deep Time content ${unit.id}: missing life entries`);
  checkRefs(`Deep Time content ${unit.id}`, content.refs);
  if (unit.rank === 'period') {
    for (const field of ['climate', 'geography', 'endedBy']) {
      if (!content[field]) fail(`Deep Time period ${unit.id}: missing ${field}`);
    }
  }
}
for (const id of contentUnits) {
  if (!geoUnitById.has(id)) fail(`Deep Time content has unknown unit ${id}`);
}

const eventIds = new Set();
for (const event of deepTime.events ?? []) {
  if (!event.id || !event.title || !event.dateLabel || !event.body) fail(`Deep Time event incomplete: ${event.id ?? event.title}`);
  if (eventIds.has(event.id)) fail(`Duplicate Deep Time event id: ${event.id}`);
  eventIds.add(event.id);
  const unit = geoUnitById.get(event.unitId);
  if (!unit) {
    fail(`Deep Time event ${event.id}: unknown unit ${event.unitId}`);
  } else if (event.dateMa > unit.startMa || event.dateMa < unit.endMa) {
    fail(`Deep Time event ${event.id}: date ${event.dateMa} outside ${unit.id}`);
  }
  if (event.endMa !== undefined && (event.endMa > event.dateMa || event.endMa < (unit?.endMa ?? 0))) {
    fail(`Deep Time event ${event.id}: invalid end date`);
  }
  if (!['first-evidence', 'diversification', 'extinction', 'transition'].includes(event.kind)) {
    fail(`Deep Time event ${event.id}: invalid kind`);
  }
  if (!['fossil', 'proxy'].includes(event.basis)) {
    fail(`Deep Time event ${event.id}: invalid basis`);
  }
  checkRefs(`Deep Time event ${event.id}`, event.refs);
}

/* Derived Mesozoic periods used by the V10 archive */

for (const id of ['triassic', 'jurassic', 'cretaceous']) {
  const unit = geoUnitById.get(id);
  const content = deepTime.units?.[id];
  if (!unit || unit.rank !== 'period') fail(`Missing Mesozoic period ${id}`);
  if (!content) fail(`Missing editorial content for Mesozoic period ${id}`);
}

/* Research */

const researchIds = new Set();
for (const r of research) {
  for (const field of ['id', 'title', 'species', 'publicationDate', 'institution', 'journal', 'summary', 'sourceUrl', 'retrievedAt', 'lastVerified', 'reviewStatus', 'evidenceType']) {
    if (!r[field]) fail(`Research ${r.id}: missing ${field}`);
  }
  if (researchIds.has(r.id)) fail(`Duplicate research id: ${r.id}`);
  researchIds.add(r.id);
  if (!/^https:\/\/.+/.test(r.sourceUrl)) fail(`Research ${r.id}: sourceUrl must be https`);
  if (!['reviewed', 'pending'].includes(r.reviewStatus)) fail(`Research ${r.id}: invalid reviewStatus`);
  if (!['peer-reviewed', 'museum-announcement'].includes(r.evidenceType)) fail(`Research ${r.id}: invalid evidenceType`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(r.publicationDate)) fail(`Research ${r.id}: publicationDate must be YYYY-MM-DD`);
}

/* Timeline, hypotheses, discoveries */

for (const event of timeline) {
  if (!event.year || !event.title || !event.kind) fail(`Timeline: incomplete entry "${event.title}"`);
  checkRefs(`Timeline / ${event.title}`, event.refs ?? []);
}
for (const h of hypotheses) {
  if (!h.name || !h.claim || !h.support?.length || !h.criticism?.length) fail(`Hypothesis ${h.id}: incomplete`);
  checkRefs(`Hypothesis / ${h.name}`, h.refs);
}
for (const d of discoveries) {
  if (!d.title || !d.year || !d.summary) fail(`Discovery ${d.id}: incomplete`);
  checkRefs(`Discovery / ${d.title}`, d.refs);
}
/* Anatomical atlas */

const atlasEvidence = new Set(['fossil', 'reconstruction', 'interpretation', 'debate']);
const atlasCategories = new Set((atlas.categories ?? []).map((category) => category.id));
const atlasCaseIds = new Set();
const atlasStructureIds = new Set();
const atlasSpeciesIds = new Set();
for (const category of atlas.categories ?? []) {
  if (!category.id || !category.label || !category.shortLabel) fail(`Atlas category incomplete: ${category.id ?? 'unknown'}`);
}
for (const entry of atlas.evidenceKey ?? []) {
  if (!atlasEvidence.has(entry.id)) fail(`Atlas evidence key: invalid class ${entry.id}`);
  if (!entry.label || !entry.shortLabel || !entry.body) fail(`Atlas evidence key ${entry.id}: incomplete`);
}
for (const item of atlas.cases ?? []) {
  if (!item.id || !item.speciesId || !item.plate || !item.views?.length || !item.structures?.length) {
    fail(`Atlas case incomplete: ${item.id ?? 'unknown'}`);
    continue;
  }
  if (atlasCaseIds.has(item.id)) fail(`Duplicate atlas case id: ${item.id}`);
  atlasCaseIds.add(item.id);
  if (!speciesFiles.includes(item.speciesId)) fail(`Atlas case ${item.id}: no species dossier ${item.speciesId}`);
  if (atlasSpeciesIds.has(item.speciesId)) fail(`Atlas case ${item.id}: duplicate species ${item.speciesId}`);
  atlasSpeciesIds.add(item.speciesId);
  if (!assetIds.has(item.plate.assetId)) fail(`Atlas case ${item.id}: unknown plate asset ${item.plate.assetId}`);
  if (!Number.isFinite(item.plate.width) || !Number.isFinite(item.plate.height) || item.plate.width <= 0 || item.plate.height <= 0) {
    fail(`Atlas case ${item.id}: invalid plate dimensions`);
  }
  if (!item.defaultView || !item.views.some((view) => view.id === item.defaultView)) {
    fail(`Atlas case ${item.id}: defaultView does not exist`);
  }
  if (!item.defaultStructure || !item.structures.some((structure) => structure.id === item.defaultStructure)) {
    fail(`Atlas case ${item.id}: defaultStructure does not exist`);
  }

  const viewIds = new Set();
  for (const view of item.views) {
    if (!view.id || !view.label || !view.shortLabel || !view.note) fail(`Atlas case ${item.id}: incomplete view`);
    if (viewIds.has(view.id)) fail(`Atlas case ${item.id}: duplicate view ${view.id}`);
    viewIds.add(view.id);
    if (!Number.isFinite(view.scale) || view.scale < 1 || view.scale > 4) fail(`Atlas case ${item.id} / ${view.id}: scale out of range`);
    if (!Number.isFinite(view.focusX) || !Number.isFinite(view.focusY)) fail(`Atlas case ${item.id} / ${view.id}: invalid focus`);
    if (!Array.isArray(view.structureIds) || view.structureIds.length === 0) fail(`Atlas case ${item.id} / ${view.id}: no structures`);
    for (const structureId of view.structureIds ?? []) {
      if (!item.structures.some((structure) => structure.id === structureId)) {
        fail(`Atlas case ${item.id} / ${view.id}: unknown structure ${structureId}`);
      }
    }
  }

  const specimenIds = new Set();
  for (const specimen of item.specimens ?? []) {
    if (!specimen.id || !specimen.identifier || !specimen.status || !specimen.material || !specimen.locality) {
      fail(`Atlas case ${item.id}: incomplete specimen ${specimen.id ?? 'unknown'}`);
    }
    if (specimenIds.has(specimen.id)) fail(`Atlas case ${item.id}: duplicate specimen ${specimen.id}`);
    specimenIds.add(specimen.id);
    checkRefs(`Atlas specimen ${specimen.id}`, specimen.refs ?? []);
  }

  for (const structure of item.structures) {
    if (!structure.id || !structure.name || !structure.shortName || !structure.summary) {
      fail(`Atlas case ${item.id}: incomplete structure`);
      continue;
    }
    if (atlasStructureIds.has(structure.id)) fail(`Duplicate atlas structure id: ${structure.id}`);
    atlasStructureIds.add(structure.id);
    if (!atlasCategories.has(structure.category)) fail(`Atlas structure ${structure.id}: unknown category ${structure.category}`);
    if (!atlasEvidence.has(structure.primaryEvidence)) fail(`Atlas structure ${structure.id}: invalid evidence class`);
    for (const block of ['observation', 'reconstruction', 'function', 'debate']) {
      if (!structure[block]) continue;
      if (!structure[block].body) fail(`Atlas structure ${structure.id} / ${block}: missing body`);
      checkRefs(`Atlas structure ${structure.id} / ${block}`, structure[block].refs ?? []);
    }
    if (structure.locator) {
      const { x, y, radius } = structure.locator;
      if (![x, y, radius].every(Number.isFinite)) fail(`Atlas structure ${structure.id}: invalid locator`);
      if (x < 0 || x > 100 || y < 0 || y > 100) fail(`Atlas structure ${structure.id}: locator outside plate`);
      if (radius <= 0 || radius > 30) fail(`Atlas structure ${structure.id}: locator radius out of range`);
    }
    if (!Array.isArray(structure.views)) fail(`Atlas structure ${structure.id}: views must be an array`);
    for (const viewId of structure.views ?? []) {
      const view = item.views.find((candidate) => candidate.id === viewId);
      if (!view) fail(`Atlas structure ${structure.id}: unknown view ${viewId}`);
      else if (!view.structureIds.includes(structure.id)) fail(`Atlas structure ${structure.id}: missing from view ${viewId}`);
    }
    if (structure.primaryView && !viewIds.has(structure.primaryView)) {
      fail(`Atlas structure ${structure.id}: unknown primaryView ${structure.primaryView}`);
    }
    if (structure.locator && !(structure.views ?? []).length) {
      fail(`Atlas structure ${structure.id}: locatable structure has no view`);
    }
    for (const specimenId of structure.specimens ?? []) {
      if (!specimenIds.has(specimenId)) fail(`Atlas structure ${structure.id}: unknown specimen ${specimenId}`);
    }
    for (const relatedId of structure.relatedStructures ?? []) {
      if (!item.structures.some((candidate) => candidate.id === relatedId)) {
        fail(`Atlas structure ${structure.id}: unknown related structure ${relatedId}`);
      }
    }
    if (structure.legacy) {
      if (!structure.legacy.label || !Number.isFinite(structure.legacy.order)) fail(`Atlas structure ${structure.id}: invalid legacy hotspot`);
      if (!structure.locator) fail(`Atlas structure ${structure.id}: legacy hotspot needs a locator`);
    }
  }

  const adaptationIds = new Set();
  for (const adaptation of item.adaptations ?? []) {
    if (!adaptation.id || !adaptation.title || !adaptation.summary) fail(`Atlas case ${item.id}: incomplete adaptation`);
    if (adaptationIds.has(adaptation.id)) fail(`Atlas case ${item.id}: duplicate adaptation ${adaptation.id}`);
    adaptationIds.add(adaptation.id);
    if (!atlasEvidence.has(adaptation.evidence)) fail(`Atlas adaptation ${adaptation.id}: invalid evidence`);
    for (const structureId of adaptation.structureIds ?? []) {
      if (!item.structures.some((structure) => structure.id === structureId)) {
        fail(`Atlas adaptation ${adaptation.id}: unknown structure ${structureId}`);
      }
    }
    checkRefs(`Atlas adaptation ${adaptation.id}`, adaptation.refs ?? []);
  }
}

for (const comparison of atlas.comparisons ?? []) {
  if (!comparison.id || !comparison.title || !comparison.caveat || !comparison.rows?.length) {
    fail(`Atlas comparison incomplete: ${comparison.id ?? 'unknown'}`);
  }
  for (const side of ['left', 'right']) {
    const entry = comparison[side];
    if (!entry || !atlasSpeciesIds.has(entry.speciesId)) fail(`Atlas comparison ${comparison.id}: invalid ${side} species`);
    if (!entry || !assetIds.has(entry.imageAsset)) fail(`Atlas comparison ${comparison.id}: invalid ${side} image`);
  }
  for (const row of comparison.rows ?? []) {
    if (!row.label || !row.left || !row.right) fail(`Atlas comparison ${comparison.id}: incomplete row`);
    if (!atlasEvidence.has(row.evidence)) fail(`Atlas comparison ${comparison.id}: invalid row evidence`);
  }
  checkRefs(`Atlas comparison ${comparison.id}`, comparison.refs ?? []);
}
if (!/not to scale/i.test(atlas.comparisons?.[0]?.caveat ?? '')) {
  fail('Atlas comparison must state that its images are not to scale');
}
if (!atlas.statement || !/fossil is evidence/i.test(atlas.statement)) {
  fail('Atlas must state the evidence / interpretation distinction');
}

/* Discoveries — V13 linked specimen, expedition and revision archive */

const discoveryMediaRoles = new Set([
  'fossil-photograph',
  'cast',
  'historical-illustration',
  'skeletal-reconstruction',
  'mounted-reconstruction',
  'excavation-photograph',
]);
const discoveryTypeGroups = new Set(['type', 'neotype', 'referred']);
const discoveryPreservationClasses = new Set([
  'lost',
  'partial',
  'nearly-complete',
  'integument',
]);

const discoveryLocationIds = new Set();
const discoveryFormationIds = new Set();
const discoveryResearcherIds = new Set();
const discoveryExpeditionIds = new Set();
const discoveryEventIds = new Set();
const discoverySpecimenIds = new Set();
const discoveryRevisionIds = new Set();
const discoveryMilestoneIds = new Set(discoveries.map((milestone) => milestone.id));

if (!discoveryArchive.statement || !/every reconstruction begins with evidence/i.test(discoveryArchive.statement)) {
  fail('Discoveries archive: missing central evidence statement');
}
if (!discoveryArchive.version) fail('Discoveries archive: missing version');
if (!Array.isArray(discoveryArchive.limits) || !discoveryArchive.limits.length) {
  fail('Discoveries archive: missing limits');
}

for (const location of discoveryArchive.locations ?? []) {
  if (!location.id || !location.label || !location.region || !location.country) {
    fail(`Discoveries location incomplete: ${location.id ?? 'unknown'}`);
    continue;
  }
  if (discoveryLocationIds.has(location.id)) fail(`Duplicate discovery location id: ${location.id}`);
  discoveryLocationIds.add(location.id);
  if (!Number.isFinite(location.latitude) || location.latitude < -90 || location.latitude > 90) {
    fail(`Discoveries location ${location.id}: invalid latitude`);
  }
  if (!Number.isFinite(location.longitude) || location.longitude < -180 || location.longitude > 180) {
    fail(`Discoveries location ${location.id}: invalid longitude`);
  }
  if (!location.coordinateNote) fail(`Discoveries location ${location.id}: missing coordinate note`);
  checkRefs(`Discoveries location ${location.id}`, location.refs ?? []);
}

for (const formation of discoveryArchive.formations ?? []) {
  if (!formation.id || !formation.name || !formation.periodId || !formation.ageLabel) {
    fail(`Discoveries formation incomplete: ${formation.id ?? 'unknown'}`);
    continue;
  }
  if (discoveryFormationIds.has(formation.id)) fail(`Duplicate discovery formation id: ${formation.id}`);
  discoveryFormationIds.add(formation.id);
  if (!validPeriods.has(formation.periodId)) {
    fail(`Discoveries formation ${formation.id}: unknown period ${formation.periodId}`);
  }
  if (!Array.isArray(formation.ageMa) || formation.ageMa.length !== 2 || formation.ageMa[0] <= formation.ageMa[1]) {
    fail(`Discoveries formation ${formation.id}: ageMa must be [older, younger]`);
  }
  for (const locationId of formation.locationIds ?? []) {
    if (!discoveryLocationIds.has(locationId)) {
      fail(`Discoveries formation ${formation.id}: unknown location ${locationId}`);
    }
  }
  if (!formation.note) fail(`Discoveries formation ${formation.id}: missing note`);
  checkRefs(`Discoveries formation ${formation.id}`, formation.refs ?? []);
}

for (const researcher of discoveryArchive.researchers ?? []) {
  if (!researcher.id || !researcher.name || !researcher.role || !researcher.note) {
    fail(`Discoveries researcher incomplete: ${researcher.id ?? 'unknown'}`);
    continue;
  }
  if (discoveryResearcherIds.has(researcher.id)) {
    fail(`Duplicate discovery researcher id: ${researcher.id}`);
  }
  discoveryResearcherIds.add(researcher.id);
  checkRefs(`Discoveries researcher ${researcher.id}`, researcher.refs ?? []);
}

for (const expedition of discoveryArchive.expeditions ?? []) {
  if (!expedition.id || !expedition.name || !expedition.dateLabel || !expedition.summary) {
    fail(`Discoveries expedition incomplete: ${expedition.id ?? 'unknown'}`);
    continue;
  }
  if (discoveryExpeditionIds.has(expedition.id)) {
    fail(`Duplicate discovery expedition id: ${expedition.id}`);
  }
  discoveryExpeditionIds.add(expedition.id);
  if (!Number.isFinite(expedition.yearStart)) {
    fail(`Discoveries expedition ${expedition.id}: invalid start year`);
  }
  if (expedition.yearEnd !== null && !Number.isFinite(expedition.yearEnd)) {
    fail(`Discoveries expedition ${expedition.id}: invalid end year`);
  }
  if (expedition.yearEnd !== null && expedition.yearEnd < expedition.yearStart) {
    fail(`Discoveries expedition ${expedition.id}: end year before start year`);
  }
  for (const researcherId of expedition.researcherIds ?? []) {
    if (!discoveryResearcherIds.has(researcherId)) {
      fail(`Discoveries expedition ${expedition.id}: unknown researcher ${researcherId}`);
    }
  }
  for (const locationId of expedition.locationIds ?? []) {
    if (!discoveryLocationIds.has(locationId)) {
      fail(`Discoveries expedition ${expedition.id}: unknown location ${locationId}`);
    }
  }
  for (const formationId of expedition.formationIds ?? []) {
    if (!discoveryFormationIds.has(formationId)) {
      fail(`Discoveries expedition ${expedition.id}: unknown formation ${formationId}`);
    }
  }
  for (const specimenId of expedition.specimenIds ?? []) {
    if (!discoverySpecimenIds.has(specimenId)) {
      // Specimens are declared later; defer this check to the specimen pass.
      continue;
    }
  }
  checkRefs(`Discoveries expedition ${expedition.id}`, expedition.refs ?? []);
}

for (const event of discoveryArchive.discoveries ?? []) {
  if (!event.id || !event.dateLabel || !event.summary) {
    fail(`Discoveries event incomplete: ${event.id ?? 'unknown'}`);
    continue;
  }
  if (discoveryEventIds.has(event.id)) fail(`Duplicate discovery event id: ${event.id}`);
  discoveryEventIds.add(event.id);
  if (event.year !== null && (!Number.isFinite(event.year) || event.year < 1600)) {
    fail(`Discoveries event ${event.id}: invalid discovery year`);
  }
  for (const researcherId of event.researcherIds ?? []) {
    if (!discoveryResearcherIds.has(researcherId)) {
      fail(`Discoveries event ${event.id}: unknown researcher ${researcherId}`);
    }
  }
  if (event.expeditionId !== null && !discoveryExpeditionIds.has(event.expeditionId)) {
    fail(`Discoveries event ${event.id}: unknown expedition ${event.expeditionId}`);
  }
  if (!discoveryLocationIds.has(event.locationId)) {
    fail(`Discoveries event ${event.id}: unknown location ${event.locationId}`);
  }
  if (!discoveryFormationIds.has(event.formationId)) {
    fail(`Discoveries event ${event.id}: unknown formation ${event.formationId}`);
  }
  checkRefs(`Discoveries event ${event.id}`, event.refs ?? []);
}

for (const specimen of discoveryArchive.specimens ?? []) {
  if (!specimen.id || !specimen.identifier || !specimen.speciesId || !specimen.typeStatus) {
    fail(`Discoveries specimen incomplete: ${specimen.id ?? 'unknown'}`);
    continue;
  }
  if (discoverySpecimenIds.has(specimen.id)) fail(`Duplicate discovery specimen id: ${specimen.id}`);
  discoverySpecimenIds.add(specimen.id);
  if (!speciesFiles.includes(specimen.speciesId)) {
    fail(`Discoveries specimen ${specimen.id}: unknown species ${specimen.speciesId}`);
  }
  if (!discoveryTypeGroups.has(specimen.typeGroup)) {
    fail(`Discoveries specimen ${specimen.id}: invalid type group ${specimen.typeGroup}`);
  }
  if (!discoveryPreservationClasses.has(specimen.preservationClass)) {
    fail(`Discoveries specimen ${specimen.id}: invalid preservation class`);
  }
  if (!discoveryEventIds.has(specimen.discoveryId)) {
    fail(`Discoveries specimen ${specimen.id}: unknown discovery ${specimen.discoveryId}`);
  }
  for (const field of ['material', 'preservation', 'repository', 'collectionNote', 'significance', 'anatomy', 'uncertainty']) {
    if (!specimen[field]) fail(`Discoveries specimen ${specimen.id}: missing ${field}`);
  }
  for (const topic of specimen.topics ?? []) {
    if (!['skull', 'axial', 'limbs', 'tail', 'integument', 'armour', 'history'].includes(topic)) {
      fail(`Discoveries specimen ${specimen.id}: unknown topic ${topic}`);
    }
  }
  for (const media of specimen.media ?? []) {
    if (!assetIds.has(media.assetId)) {
      fail(`Discoveries specimen ${specimen.id}: unknown asset ${media.assetId}`);
    }
    if (!discoveryMediaRoles.has(media.role)) {
      fail(`Discoveries specimen ${specimen.id}: invalid media role ${media.role}`);
    }
    if (!media.caption) fail(`Discoveries specimen ${specimen.id}: media caption missing`);
  }
  for (const structureId of specimen.anatomyStructureIds ?? []) {
    if (!atlasStructureIds.has(structureId)) {
      fail(`Discoveries specimen ${specimen.id}: unknown atlas structure ${structureId}`);
    }
  }
  for (const relatedId of specimen.relatedSpecimenIds ?? []) {
    if (!discoverySpecimenIds.has(relatedId) && relatedId !== specimen.id) {
      // Later specimens may not have been visited yet; check at the end.
      continue;
    }
  }
  checkRefs(`Discoveries specimen ${specimen.id}`, specimen.refs ?? []);
  checkRefs(`Discoveries specimen ${specimen.id} publications`, specimen.publications ?? []);
}

for (const expedition of discoveryArchive.expeditions ?? []) {
  for (const specimenId of expedition.specimenIds ?? []) {
    if (!discoverySpecimenIds.has(specimenId)) {
      fail(`Discoveries expedition ${expedition.id}: unknown specimen ${specimenId}`);
    }
  }
  for (const eventId of expedition.discoveryIds ?? []) {
    if (!discoveryEventIds.has(eventId)) {
      fail(`Discoveries expedition ${expedition.id}: unknown discovery ${eventId}`);
    }
  }
  for (const slug of expedition.relatedSpeciesIds ?? []) {
    if (!speciesFiles.includes(slug)) {
      fail(`Discoveries expedition ${expedition.id}: unknown species ${slug}`);
    }
  }
}

for (const event of discoveryArchive.discoveries ?? []) {
  for (const specimenId of event.specimenIds ?? []) {
    if (!discoverySpecimenIds.has(specimenId)) {
      fail(`Discoveries event ${event.id}: unknown specimen ${specimenId}`);
    }
  }
  for (const slug of event.relatedSpeciesIds ?? []) {
    if (!speciesFiles.includes(slug)) {
      fail(`Discoveries event ${event.id}: unknown species ${slug}`);
    }
  }
}

for (const specimen of discoveryArchive.specimens ?? []) {
  for (const relatedId of specimen.relatedSpecimenIds ?? []) {
    if (!discoverySpecimenIds.has(relatedId)) {
      fail(`Discoveries specimen ${specimen.id}: unknown related specimen ${relatedId}`);
    }
  }
}

for (const revision of discoveryArchive.revisions ?? []) {
  if (!revision.id || !revision.title || !revision.kicker) {
    fail(`Discoveries revision incomplete: ${revision.id ?? 'unknown'}`);
    continue;
  }
  if (discoveryRevisionIds.has(revision.id)) fail(`Duplicate discovery revision id: ${revision.id}`);
  discoveryRevisionIds.add(revision.id);
  if (!speciesFiles.includes(revision.speciesId)) {
    fail(`Discoveries revision ${revision.id}: unknown species ${revision.speciesId}`);
  }
  for (const stage of ['earlier', 'evidenceThen', 'trigger', 'revised', 'uncertainty']) {
    if (!revision[stage]?.label || !revision[stage]?.body) {
      fail(`Discoveries revision ${revision.id}: incomplete ${stage}`);
    }
    checkRefs(`Discoveries revision ${revision.id} / ${stage}`, revision[stage]?.refs ?? []);
  }
  for (const specimenId of revision.specimenIds ?? []) {
    if (!discoverySpecimenIds.has(specimenId)) {
      fail(`Discoveries revision ${revision.id}: unknown specimen ${specimenId}`);
    }
  }
  checkRefs(`Discoveries revision ${revision.id}`, revision.refs ?? []);
}

for (const chapter of discoveryArchive.caseStudy?.chapters ?? []) {
  if (!chapter.id || !chapter.title || !chapter.body || !chapter.yearLabel) {
    fail(`Discoveries case chapter incomplete: ${chapter.id ?? 'unknown'}`);
  }
  for (const specimenId of chapter.specimenIds ?? []) {
    if (!discoverySpecimenIds.has(specimenId)) {
      fail(`Discoveries case chapter ${chapter.id}: unknown specimen ${specimenId}`);
    }
  }
  checkRefs(`Discoveries case chapter ${chapter.id}`, chapter.refs ?? []);
}

for (const [milestoneId, links] of Object.entries(discoveryArchive.milestoneLinks ?? {})) {
  if (!discoveryMilestoneIds.has(milestoneId)) {
    fail(`Discoveries milestone link: unknown milestone ${milestoneId}`);
  }
  for (const specimenId of links.specimenIds ?? []) {
    if (!discoverySpecimenIds.has(specimenId)) {
      fail(`Discoveries milestone ${milestoneId}: unknown specimen ${specimenId}`);
    }
  }
  for (const expeditionId of links.expeditionIds ?? []) {
    if (!discoveryExpeditionIds.has(expeditionId)) {
      fail(`Discoveries milestone ${milestoneId}: unknown expedition ${expeditionId}`);
    }
  }
  if (links.revisionId && !discoveryRevisionIds.has(links.revisionId)) {
    fail(`Discoveries milestone ${milestoneId}: unknown revision ${links.revisionId}`);
  }
}

/* Placeholders / unsupported claims */

const banned = [/lorem ipsum/i, /\bTBD\b/, /\bTODO\b/, /insert image/i];
for (const text of sourceText) {
  for (const pattern of banned) {
    if (pattern.test(text)) fail(`Placeholder text found: ${text.slice(0, 60)}`);
  }
}

console.log(`Checked ${species.length} species, ${assets.length} assets, ${references.length} references, ${research.length} research records.`);
console.log(
  `Discoveries: ${discoveryArchive.specimens?.length ?? 0} specimens, ${discoveryArchive.expeditions?.length ?? 0} expeditions, ${discoveryArchive.locations?.length ?? 0} localities, ${discoveryArchive.revisions?.length ?? 0} revisions.`,
);
console.log(`Atlas: ${atlasCaseIds.size} cases, ${atlasStructureIds.size} structures, ${atlas.comparisons?.length ?? 0} comparison(s).`);
for (const warning of warnings) console.warn(`WARN  ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);
if (errors.length) {
  console.error(`\n${errors.length} error(s). Data validation failed.`);
  process.exit(1);
}
console.log('Data validation passed.');

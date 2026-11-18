// Applies the third researched cohort. Existing reviews are preserved; the
// script is safe to re-run and reports any missing or duplicate identity.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { batch3Reviews } from './batch3-reviews.mjs';
import {
  newReferences,
  newTrails,
  referenceCorrections,
  speciesEdits,
} from './batch3-edits.mjs';

const root = path.resolve('.');
const readJson = async (file) => JSON.parse(await readFile(path.join(root, file), 'utf8'));
const writeJson = async (file, data) =>
  writeFile(path.join(root, file), `${JSON.stringify(data, null, 2)}\n`);

const cohort = Object.keys(batch3Reviews).sort();
const expected = [
  'acrocanthosaurus',
  'albertosaurus',
  'allosaurus',
  'ankylosaurus',
  'apatosaurus',
  'bajadasaurus',
  'baryonyx',
  'beipiaosaurus',
  'brachiosaurus',
  'camarasaurus',
  'carcharodontosaurus',
  'centrosaurus',
  'ceratosaurus',
  'chasmosaurus',
  'citipati',
  'compsognathus',
  'concavenator',
  'corythosaurus',
  'cryolophosaurus',
  'daspletosaurus',
].sort();

if (cohort.length !== expected.length || expected.some((slug) => !batch3Reviews[slug])) {
  throw new Error(`Batch 3 review set incomplete: ${cohort.join(', ')}`);
}
for (const slug of expected) {
  if (!speciesEdits[slug]) throw new Error(`Missing content edit for ${slug}`);
}

/* References ------------------------------------------------------- */

const references = await readJson('src/data/references.json');
const referencesV19 = await readJson('src/data/references-v19.json');
const allReferences = [...references, ...referencesV19];
const referenceIds = new Set(allReferences.map((item) => item.id));
if (referenceIds.size !== allReferences.length) {
  throw new Error('Duplicate reference id already present in the registry');
}

for (const reference of newReferences) {
  if (referenceIds.has(reference.id)) continue;
  references.push(reference);
  referenceIds.add(reference.id);
}

for (const [id, patch] of Object.entries(referenceCorrections)) {
  const reference = [...references, ...referencesV19].find((item) => item.id === id);
  if (!reference) throw new Error(`Reference to correct not found: ${id}`);
  Object.assign(reference, patch);
}

await writeJson('src/data/references.json', references);
await writeJson('src/data/references-v19.json', referencesV19);

const allRefs = [...references, ...referencesV19];
const allRefIds = new Set(allRefs.map((item) => item.id));

/* Claim reviews ---------------------------------------------------- */

const reviewData = await readJson('src/data/claim-reviews.json');
const previousReviewCount = Object.keys(reviewData.reviews).length;
if (previousReviewCount < 47) {
  throw new Error(`Expected at least 47 existing reviews, found ${previousReviewCount}`);
}
const previousClaims = Object.values(reviewData.reviews).reduce(
  (sum, review) => sum + review.claims.length,
  0,
);

for (const slug of expected) {
  reviewData.reviews[slug] = {
    ...batch3Reviews[slug],
    status: 'researched-enriched',
    reviewed: '2026-11-17',
  };
}
reviewData.updated = '2026-11-17';
await writeJson('src/data/claim-reviews.json', reviewData);

/* Research trails -------------------------------------------------- */

const trails = await readJson('src/data/research-trails.json');
for (const [slug, trail] of Object.entries(newTrails)) {
  if (!expected.includes(slug)) throw new Error(`Trail for unexpected slug: ${slug}`);
  if (trails[slug]) {
    if (trail.note) trails[slug].note = trail.note;
    if (trail.specimenStatus) trails[slug].specimenStatus = trail.specimenStatus;
    const existingTitles = new Set((trails[slug].entries ?? []).map((entry) => entry.title));
    for (const entry of trail.entries) {
      if (!existingTitles.has(entry.title)) trails[slug].entries.push(entry);
    }
  } else {
    trails[slug] = trail;
  }
}
await writeJson('src/data/research-trails.json', trails);

/* Species content ------------------------------------------------- */

let addedEvidence = 0;
let addedReferences = 0;
for (const slug of expected) {
  const file = `src/data/species/${slug}.json`;
  const species = await readJson(file);
  const edit = speciesEdits[slug];

  if (edit.set) Object.assign(species, edit.set);
  if (edit.discovery) species.discovery = edit.discovery;

  for (const entry of edit.addFossilEvidence ?? []) {
    if (!species.fossilEvidence.some((item) => item.title === entry.title)) {
      species.fossilEvidence.push(entry);
      addedEvidence += 1;
    }
  }

  for (const referenceId of edit.addReferences ?? []) {
    if (!allRefIds.has(referenceId)) {
      throw new Error(`${slug}: unknown reference ${referenceId}`);
    }
    if (!species.references.includes(referenceId)) {
      species.references.push(referenceId);
      addedReferences += 1;
    }
  }

  species.updated = '2026-11-17';
  await writeJson(file, species);
}

/* Integrity checks ------------------------------------------------- */

for (const slug of expected) {
  const review = reviewData.reviews[slug];
  for (const claim of review.claims) {
    for (const referenceId of claim.refs ?? []) {
      if (!allRefIds.has(referenceId)) {
        throw new Error(`${slug} / ${claim.id}: unknown reference ${referenceId}`);
      }
    }
  }
  const species = await readJson(`src/data/species/${slug}.json`);
  for (const referenceId of species.references) {
    if (!allRefIds.has(referenceId)) {
      throw new Error(`${slug}: unknown species reference ${referenceId}`);
    }
  }
  for (const entry of trails[slug]?.entries ?? []) {
    for (const referenceId of entry.refs ?? []) {
      if (!allRefIds.has(referenceId)) {
        throw new Error(`${slug} trail: unknown reference ${referenceId}`);
      }
    }
  }
}

const finalClaimCount = Object.values(reviewData.reviews).reduce(
  (sum, review) => sum + review.claims.length,
  0,
);

console.log(`Batch 3 species: ${expected.length}`);
console.log(`Reviews: ${previousReviewCount} -> ${Object.keys(reviewData.reviews).length}`);
console.log(`Claims: ${previousClaims} -> ${finalClaimCount} (+${finalClaimCount - previousClaims})`);
console.log(`New references: ${newReferences.filter((ref) => allRefIds.has(ref.id)).length}`);
console.log(`Species evidence entries added: ${addedEvidence}`);
console.log(`Species bibliography links added: ${addedReferences}`);
console.log(`Reference registry: ${allRefs.length} records.`);

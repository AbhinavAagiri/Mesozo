// Applies the second researched cohort. This script is idempotent: it updates
// the 23 cohort keys and leaves the first 24 reviews untouched.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { batch2Reviews } from './batch2-reviews.mjs';
import {
  newReferences,
  primers,
  referenceCorrections,
  speciesEdits,
} from './batch2-edits.mjs';

const root = path.resolve('.');
const readJson = async (file) => JSON.parse(await readFile(path.join(root, file), 'utf8'));
const writeJson = async (file, data) =>
  writeFile(path.join(root, file), `${JSON.stringify(data, null, 2)}\n`);

const cohort = Object.keys(batch2Reviews);
const expected = [
  'argentinosaurus',
  'camptosaurus',
  'dilong',
  'dreadnoughtus',
  'einiosaurus',
  'falcarius',
  'gigantspinosaurus',
  'guanlong',
  'herrerasaurus',
  'huayangosaurus',
  'hypsilophodon',
  'iguanodon',
  'jobaria',
  'mamenchisaurus',
  'megalosaurus',
  'minmi',
  'ouranosaurus',
  'plateosaurus',
  'polacanthus',
  'shunosaurus',
  'therizinosaurus',
  'turiasaurus',
  'yutyrannus',
];
if (cohort.length !== expected.length || expected.some((slug) => !batch2Reviews[slug])) {
  throw new Error(`Batch 2 review set incomplete: ${cohort.join(', ')}`);
}
for (const slug of expected) {
  if (!speciesEdits[slug]) throw new Error(`Missing content edit for ${slug}`);
  if (!primers[slug]) throw new Error(`Missing primer for ${slug}`);
}

/* References ------------------------------------------------------- */

const references = await readJson('src/data/references.json');
const referencesV19 = await readJson('src/data/references-v19.json');
const allReferences = [...references, ...referencesV19];

for (const reference of newReferences) {
  if (allReferences.some((item) => item.id === reference.id)) continue;
  referencesV19.push(reference);
}

for (const correction of referenceCorrections) {
  const records = [references, referencesV19];
  let found = false;
  for (const collection of records) {
    const reference = collection.find((item) => item.id === correction.id);
    if (!reference) continue;
    Object.assign(reference, correction.patch);
    found = true;
    break;
  }
  if (!found) throw new Error(`Reference to correct not found: ${correction.id}`);
}

await writeJson('src/data/references.json', references);
await writeJson('src/data/references-v19.json', referencesV19);

/* Claim reviews ---------------------------------------------------- */

const reviewData = await readJson('src/data/claim-reviews.json');
const previousReviewCount = Object.keys(reviewData.reviews).length;
if (previousReviewCount < 24) {
  throw new Error(`Expected at least 24 existing reviews, found ${previousReviewCount}`);
}

for (const slug of expected) {
  reviewData.reviews[slug] = {
    ...batch2Reviews[slug],
    status: 'researched-enriched',
    reviewed: '2026-11-17',
  };
}
reviewData.updated = '2026-11-17';
await writeJson('src/data/claim-reviews.json', reviewData);

/* Species content ------------------------------------------------- */

for (const slug of expected) {
  const file = `src/data/species/${slug}.json`;
  const species = await readJson(file);
  speciesEdits[slug](species);
  species.primer = primers[slug];
  species.updated = '2026-11-17';
  await writeJson(file, species);
}

console.log(`Updated ${expected.length} species and merged ${expected.length} claim reviews.`);
console.log(`Reference registry: ${references.length + referencesV19.length} records.`);

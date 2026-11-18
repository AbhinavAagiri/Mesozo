// Journal content checks. Run with `npm run data:journal` or as part of `npm run data:check`.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('.');
const errors = [];
const warnings = [];

const readJson = async (file) => JSON.parse(await readFile(path.join(root, file), 'utf8'));
const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);
const isNonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;

const categories = await readJson('src/data/journal/categories.json');
const paths = await readJson('src/data/journal/reading-paths.json');
const assets = await readJson('src/data/assets.json');
const references = await readJson('src/data/references.json');
const archive = await readJson('src/data/discovery-archive.json');
const atlas = await readJson('src/data/anatomical-atlas.json');
const geologicalTime = await readJson('src/data/geological-time.json');
const speciesFiles = (await readdir(path.join(root, 'src/data/species'))).filter((file) =>
  file.endsWith('.json'),
);
const species = await Promise.all(
  speciesFiles.map((file) => readJson(path.join('src/data/species', file))),
);
const articleFiles = (await readdir(path.join(root, 'src/data/journal/articles'))).filter((file) =>
  file.endsWith('.json'),
);
const articles = await Promise.all(
  articleFiles.map((file) => readJson(path.join('src/data/journal/articles', file))),
);

const categoryIds = new Set(categories.map((category) => category.id));
const assetIds = new Set(assets.map((asset) => asset.id));
const referenceIds = new Set(references.map((reference) => reference.id));
const speciesIds = new Set(species.map((item) => item.slug));
const unitIds = new Set(geologicalTime.units.map((unit) => unit.id));
const specimenIds = new Set(archive.specimens.map((specimen) => specimen.id));
const structureBySpecies = new Map(
  atlas.cases.map((item) => [item.speciesId, new Set(item.structures.map((s) => s.id))]),
);

const articleIds = new Set();
const slugs = new Set();
const numbers = new Set();
const pathIds = new Set();
const published = articles.filter((article) => !article.draft);
const publishedIds = new Set(published.map((article) => article.id));
const publishedSlugs = new Set(published.map((article) => article.slug));

for (const article of articles) {
  const label = article.id || article.slug || '<untitled>';
  if (!isNonEmpty(article.id)) fail('Journal article: missing id');
  if (!isNonEmpty(article.slug)) fail(`Journal article ${label}: missing slug`);
  if (articleIds.has(article.id)) fail(`Journal article: duplicate id ${article.id}`);
  if (slugs.has(article.slug)) fail(`Journal article: duplicate slug ${article.slug}`);
  if (numbers.has(article.number)) fail(`Journal article ${label}: duplicate issue number ${article.number}`);
  if (!Number.isInteger(article.number) || article.number < 1) {
    fail(`Journal article ${label}: invalid issue number`);
  }
  if (!isNonEmpty(article.headline)) fail(`Journal article ${label}: missing headline`);
  if (!isNonEmpty(article.standfirst)) fail(`Journal article ${label}: missing standfirst`);
  if (!categoryIds.has(article.category)) {
    fail(`Journal article ${label}: unknown category ${article.category}`);
  }
  if (!isNonEmpty(article.byline)) fail(`Journal article ${label}: missing byline`);
  if (!Array.isArray(article.tags) || !article.tags.length) {
    fail(`Journal article ${label}: at least one tag is required`);
  }
  if (!Number.isInteger(article.readingMinutes) || article.readingMinutes < 1) {
    fail(`Journal article ${label}: invalid reading time`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(article.publishedAt ?? '')) {
    fail(`Journal article ${label}: invalid publication date`);
  }
  if (article.updatedAt && !/^\d{4}-\d{2}-\d{2}$/.test(article.updatedAt)) {
    fail(`Journal article ${label}: invalid updated date`);
  }
  if (article.updatedAt && article.updatedAt < article.publishedAt) {
    fail(`Journal article ${label}: updated date is before publication`);
  }
  if (!['cover', 'type', 'plate', 'map'].includes(article.hero?.variant)) {
    fail(`Journal article ${label}: invalid hero variant`);
  }
  if (!['light', 'dark', 'bone'].includes(article.hero?.tone)) {
    fail(`Journal article ${label}: invalid hero tone`);
  }
  if (!isNonEmpty(article.hero?.label)) {
    fail(`Journal article ${label}: missing hero label`);
  }
  if (article.hero?.assetId) {
    if (!assetIds.has(article.hero.assetId)) {
      fail(`Journal article ${label}: unknown hero asset ${article.hero.assetId}`);
    }
    if (!isNonEmpty(article.hero.alt)) fail(`Journal article ${label}: hero image has no alt text`);
    if (!isNonEmpty(article.hero.caption)) fail(`Journal article ${label}: hero image has no caption`);
  }

  for (const ref of article.references ?? []) {
    if (!referenceIds.has(ref)) fail(`Journal article ${label}: unknown reference ${ref}`);
  }

  for (const speciesId of article.relatedSpeciesIds ?? []) {
    if (!speciesIds.has(speciesId)) {
      fail(`Journal article ${label}: unknown species ${speciesId}`);
    }
  }
  for (const unitId of article.relatedPeriodIds ?? []) {
    if (!unitIds.has(unitId)) {
      fail(`Journal article ${label}: unknown geological unit ${unitId}`);
    }
  }
  for (const specimenId of article.relatedSpecimenIds ?? []) {
    if (!specimenIds.has(specimenId)) {
      fail(`Journal article ${label}: unknown specimen ${specimenId}`);
    }
  }
  for (const link of article.relatedAnatomy ?? []) {
    if (!speciesIds.has(link.speciesId)) {
      fail(`Journal article ${label}: anatomy link has unknown species ${link.speciesId}`);
    }
    const structures = structureBySpecies.get(link.speciesId);
    for (const structureId of link.structureIds ?? []) {
      if (!structures?.has(structureId)) {
        fail(`Journal article ${label}: unknown structure ${structureId} for ${link.speciesId}`);
      }
    }
  }

  if (!Array.isArray(article.blocks) || !article.blocks.length) {
    fail(`Journal article ${label}: no article blocks`);
  }

  const headingIds = new Set();
  const cited = new Set();
  const tokens = new Set();
  const addRefs = (refs, where) => {
    for (const ref of refs ?? []) {
      if (!referenceIds.has(ref)) fail(`Journal article ${label}: ${where} cites unknown ${ref}`);
      cited.add(ref);
    }
  };

  for (const block of article.blocks ?? []) {
    if (!isNonEmpty(block.type)) fail(`Journal article ${label}: block has no type`);
    addRefs(block.refs, `${block.type} block`);
    if (block.type === 'text') {
      for (const paragraph of block.paragraphs ?? []) {
        for (const match of paragraph.matchAll(/\[\[([a-z0-9-]+)\]\]/gi)) {
          if (!referenceIds.has(match[1])) {
            fail(`Journal article ${label}: inline citation has unknown ${match[1]}`);
          }
          tokens.add(match[1]);
          cited.add(match[1]);
        }
      }
    }
    if (block.type === 'heading') {
      if (!isNonEmpty(block.id)) fail(`Journal article ${label}: heading has no id`);
      if (!isNonEmpty(block.title)) fail(`Journal article ${label}: heading has no title`);
      if (headingIds.has(block.id)) fail(`Journal article ${label}: duplicate heading id ${block.id}`);
      headingIds.add(block.id);
    }
    if (block.type === 'image') {
      if (!assetIds.has(block.assetId)) fail(`Journal article ${label}: unknown image asset ${block.assetId}`);
      if (!isNonEmpty(block.alt)) fail(`Journal article ${label}: image has no alt text`);
      if (!isNonEmpty(block.caption)) fail(`Journal article ${label}: image has no caption`);
      if (!['full', 'wide', 'inset'].includes(block.layout)) {
        fail(`Journal article ${label}: invalid image layout ${block.layout}`);
      }
    }
    if (block.type === 'duo' || block.type === 'gallery') {
      if (!block.images?.length) fail(`Journal article ${label}: ${block.type} has no images`);
      for (const image of block.images ?? []) {
        if (!assetIds.has(image.assetId)) {
          fail(`Journal article ${label}: unknown ${block.type} asset ${image.assetId}`);
        }
        if (!isNonEmpty(image.alt)) fail(`Journal article ${label}: ${block.type} image has no alt text`);
      }
    }
    if (block.type === 'timeline') {
      for (const entry of block.entries ?? []) {
        if (!isNonEmpty(entry.date) || !isNonEmpty(entry.title) || !isNonEmpty(entry.body)) {
          fail(`Journal article ${label}: incomplete timeline entry`);
        }
        addRefs(entry.refs, 'timeline entry');
      }
    }
    if (block.type === 'comparison') {
      for (const side of [block.left, block.right]) {
        if (!isNonEmpty(side.label) || !isNonEmpty(side.title) || !isNonEmpty(side.body)) {
          fail(`Journal article ${label}: incomplete comparison side`);
        }
        addRefs(side.refs, 'comparison side');
      }
    }
    if (block.type === 'data') {
      if (!block.entries?.length) fail(`Journal article ${label}: data block has no entries`);
      for (const entry of block.entries ?? []) {
        if (!isNonEmpty(entry.label) || !isNonEmpty(entry.value)) {
          fail(`Journal article ${label}: incomplete data entry`);
        }
        addRefs(entry.refs, 'data entry');
      }
    }
    if (block.type === 'timescale') {
      if (!block.unitIds?.length) fail(`Journal article ${label}: timescale has no units`);
      for (const unitId of block.unitIds ?? []) {
        if (!unitIds.has(unitId)) fail(`Journal article ${label}: timescale has unknown unit ${unitId}`);
      }
    }
    if (block.type === 'evidence' || block.type === 'annotation') {
      if (!isNonEmpty(block.title) || !isNonEmpty(block.body)) {
        fail(`Journal article ${label}: incomplete ${block.type} block`);
      }
    }
    if (block.type === 'evidence' && !['established', 'interpretation', 'debate', 'open'].includes(block.stance)) {
      fail(`Journal article ${label}: invalid evidence stance ${block.stance}`);
    }
    if (block.type === 'specimen' && !specimenIds.has(block.specimenId)) {
      fail(`Journal article ${label}: block has unknown specimen ${block.specimenId}`);
    }
    if (block.type === 'species' && !speciesIds.has(block.speciesId)) {
      fail(`Journal article ${label}: block has unknown species ${block.speciesId}`);
    }
    if (block.type === 'period' && !unitIds.has(block.unitId)) {
      fail(`Journal article ${label}: block has unknown period ${block.unitId}`);
    }
    if (block.type === 'anatomy') {
      if (!structureBySpecies.get(block.speciesId)?.has(block.structureId)) {
        fail(`Journal article ${label}: anatomy block has unknown structure ${block.structureId}`);
      }
    }
    if (block.type === 'diagram') {
      if (!isNonEmpty(block.title) || !isNonEmpty(block.caption)) {
        fail(`Journal article ${label}: incomplete diagram block`);
      }
    }
  }

  for (const ref of cited) {
    if (!(article.references ?? []).includes(ref)) {
      fail(`Journal article ${label}: cited reference ${ref} is missing from article.references`);
    }
  }
  for (const ref of article.references ?? []) {
    if (!cited.has(ref)) {
      warn(`Journal article ${label}: reference ${ref} is listed but not cited`);
    }
  }

  if (article.featured && article.draft) {
    fail(`Journal article ${label}: a draft cannot be featured`);
  }

  articleIds.add(article.id);
  slugs.add(article.slug);
  numbers.add(article.number);
}

const featured = published.filter((article) => article.featured);
if (featured.length !== 1) {
  fail(`Journal: expected exactly one published featured article, found ${featured.length}`);
}

for (const category of categories) {
  const count = published.filter((article) => article.category === category.id).length;
  if (!count) fail(`Journal category ${category.id}: no published stories`);
}

for (const path of paths) {
  if (!isNonEmpty(path.id) || !isNonEmpty(path.title)) fail('Journal reading path: missing id or title');
  if (pathIds.has(path.id)) fail(`Journal reading path: duplicate id ${path.id}`);
  pathIds.add(path.id);
  if (!path.steps?.length) fail(`Journal reading path ${path.id}: no steps`);
  for (const step of path.steps ?? []) {
    if (!publishedIds.has(step.articleId)) {
      fail(`Journal reading path ${path.id}: unpublished or unknown article ${step.articleId}`);
    }
    if (!isNonEmpty(step.label)) fail(`Journal reading path ${path.id}: step has no label`);
  }
}

for (const article of articles) {
  for (const id of article.relatedArticleIds ?? []) {
    if (!publishedIds.has(id) || id === article.id) {
      fail(`Journal article ${article.id}: invalid related article ${id}`);
    }
  }
  for (const id of article.readingPathIds ?? []) {
    if (!pathIds.has(id)) fail(`Journal article ${article.id}: unknown reading path ${id}`);
  }
}

// Drafts must not leak into the published dataset's category counts or paths.
const draftIds = new Set(articles.filter((article) => article.draft).map((article) => article.id));
for (const id of draftIds) {
  if (publishedIds.has(id)) fail(`Journal draft ${id}: is also present as published`);
}

console.log(`Journal: ${published.length} published stories, ${categories.length} categories, ${paths.length} reading paths.`);
if (published.length > 8) {
  warn(`Journal: ${published.length} published stories is above the deliberately small launch range.`);
}

if (warnings.length) {
  for (const message of warnings) console.warn(`WARN  ${message}`);
}
if (errors.length) {
  for (const message of errors) console.error(`ERROR ${message}`);
  console.error(`Journal validation failed with ${errors.length} error(s).`);
  process.exit(1);
}
console.log('Journal validation passed.');

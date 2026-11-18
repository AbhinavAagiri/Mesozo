#!/usr/bin/env node
/**
 * Search needs trail titles, specimen status and reference IDs. It does not
 * need every trail paragraph. Keeping this compact projection separate stops
 * the search dialog from downloading the full research-trails dataset.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const source = path.join(root, 'src/data/research-trails.json');
const target = path.join(root, 'src/data/search-trails.json');
const trails = JSON.parse(await readFile(source, 'utf8'));

const compact = {};
for (const [slug, trail] of Object.entries(trails)) {
  compact[slug] = {
    status: trail.specimenStatus ?? '',
    titles: (trail.entries ?? []).map((entry) => entry.title),
    refs: Array.from(
      new Set((trail.entries ?? []).flatMap((entry) => entry.refs ?? [])),
    ),
  };
}

await writeFile(target, `${JSON.stringify(compact)}\n`, 'utf8');
console.log(`Search trails: wrote ${Object.keys(compact).length} compact trail records.`);

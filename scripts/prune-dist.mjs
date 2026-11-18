#!/usr/bin/env node
/**
 * Vite copies everything in public/ into dist. The archive's raw source images
 * are intentionally kept in the repository for the derivative pipeline, but
 * they are not part of the deployed exhibition and make the upload far larger
 * than the generated AVIF/WebP set.
 */
import { readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';

const target = path.join(process.cwd(), 'dist', 'assets', 'raw');
const devPreview = path.join(process.cwd(), 'dist', 'model-preview.html');
const modelDir = path.join(process.cwd(), 'dist', 'assets', 'model');

// These are authoring intermediates used by the texture build scripts. The
// runtime hero reads textures embedded in scene.glb; the legacy lab glTF
// reads assets/model/spinosaurus/*.webp, not these top-level originals.
const sourceOnlyModelAssets = [
  'spinosaurus-skin-albedo.webp',
  'spinosaurus-skin-bump.webp',
  'spinosaurus-skin-base.webp',
  'spinosaurus-eye.webp',
];

try {
  const info = await stat(target);
  if (info.isDirectory()) {
    await rm(target, { recursive: true, force: true });
    console.log('Prune: removed dist/assets/raw (source originals, not served).');
  }
} catch {
  // A clean build may not contain the directory; that is not an error.
  console.log('Prune: dist/assets/raw not present.');
}

// This standalone inspection page imports Three from /node_modules, which is
// not present on static hosting. Keep the source tool for local model checks,
// but do not publish a broken development URL.
await rm(devPreview, { force: true });
console.log('Prune: removed dist/model-preview.html (development tool).');

for (const file of sourceOnlyModelAssets) {
  await rm(path.join(modelDir, file), { force: true });
}
console.log('Prune: removed source-only model texture intermediates.');

// `/lab` is an internal model-inspection tool, not part of the exhibition.
// Its route is compiled out of production, so its source models and textures
// must not be published either. Keep the one runtime hero model intact.
const LAB_ONLY_MODEL_PATHS = [
  'oxalaia-skull.glb',
  'triceratops',
  'triceratops-skull.glb',
];
for (const relative of LAB_ONLY_MODEL_PATHS) {
  await rm(path.join(modelDir, relative), { recursive: true, force: true });
}

// The legacy Spinosaurus glTF, rig, and external texture maps are read only by
// ModelLab. `scene.glb` is the protected, self-contained hero asset.
for (const entry of await readdir(path.join(modelDir, 'spinosaurus'))) {
  if (entry === 'scene.glb') continue;
  await rm(path.join(modelDir, 'spinosaurus', entry), { recursive: true, force: true });
}
console.log('Prune: removed lab-only model assets; kept the hero scene.glb.');

// Turn the 4K Spinosaurus (Julian Johnson-Mortimer, CC BY 4.0) into a compact
// glTF. Five original 4096 px skin/detail sheets plus the original 512 px eye
// are preserved at full resolution and encoded as high-quality WebP; materials
// are pinned to a matte dielectric so the hero's own grade does the lighting.
// Usage: node scripts/build-spino-body.mjs .tmp-assets/spino public/assets/model/spinosaurus
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = path.resolve(process.argv[2] ?? '.tmp-assets/spino');
const OUT = path.resolve(process.argv[3] ?? 'public/assets/model/spinosaurus');
await mkdir(OUT, { recursive: true });

const gltf = JSON.parse(await readFile(path.join(SRC, 'scene.gltf'), 'utf8'));

const MAPS = [
  { from: 'head_filled.jpeg', to: 'head.webp', size: 4096 },
  { from: 'legs_filled.jpeg', to: 'legs.webp', size: 4096 },
  { from: 'body_filled.jpeg', to: 'body.webp', size: 4096 },
  { from: 'tails_filled.jpeg', to: 'tails.webp', size: 4096 },
  { from: 'bits_baseColor.jpeg', to: 'bits.webp', size: 4096 },
  { from: 'eye1_baseColor.jpeg', to: 'eye.webp', size: 512 },
];

for (const map of MAPS) {
  const input = path.join(SRC, 'textures', map.from);
  const meta = await sharp(input).metadata();
  await sharp(input)
    .resize(map.size, map.size, { fit: 'inside', kernel: 'lanczos3' })
    .webp({ quality: 88, effort: 6, smartSubsample: true })
    .toFile(path.join(OUT, map.to));
  const out = await sharp(path.join(OUT, map.to)).metadata();
  console.log(`${map.from} ${meta.width} -> ${map.to} ${out.width}`);
}

await copyFile(path.join(SRC, 'scene.bin'), path.join(OUT, 'scene.bin'));

const normalizeMapName = (name) =>
  name.replace(/_filled|_baseColor/g, '').replace(/\.(jpeg|jpg|png)$/i, '');
const byName = new Map(MAPS.map((map, index) => [normalizeMapName(map.from), index]));
const sourceNames = gltf.images.map((image) => normalizeMapName(image.uri.split('/').pop()));
gltf.images = MAPS.map((map) => ({ uri: map.to }));
gltf.samplers = [{ magFilter: 9729, minFilter: 9987, wrapS: 10497, wrapT: 10497 }];
gltf.textures = gltf.images.map((_, index) => ({ sampler: 0, source: index }));
gltf.materials = gltf.materials.map((material) => {
  const image = material.pbrMetallicRoughness?.baseColorTexture?.index ?? 0;
  const source = sourceNames[image] ?? sourceNames[0];
  const texture = byName.get(source) ?? 0;
  return {
    name: material.name,
    pbrMetallicRoughness: {
      baseColorTexture: { index: texture },
      metallicFactor: 0,
      roughnessFactor: material.name === 'eye1' ? 0.35 : 0.9,
    },
  };
});
delete gltf.extensionsUsed;
delete gltf.extensionsRequired;

await writeFile(path.join(OUT, 'scene.gltf'), JSON.stringify(gltf, null, 1));
const tris = gltf.meshes.reduce(
  (sum, mesh) =>
    sum +
    mesh.primitives.reduce(
      (n, p) => n + gltf.accessors[p.indices ?? p.attributes.POSITION].count / 3,
      0,
    ),
  0,
);
console.log(`wrote ${path.relative(process.cwd(), OUT)} tris=${Math.round(tris)}`);

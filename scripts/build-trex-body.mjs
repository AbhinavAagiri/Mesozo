// Turn the 4K "Tyrant King" T. rex (mschanz, CC BY 4.0) into a compact glTF:
// spec-gloss converted to metallic-roughness, textures resampled to 2048.
// Usage: node scripts/build-trex-body.mjs .tmp-assets/cand/mschanz public/assets/model/tyrannosaurus
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = path.resolve(process.argv[2] ?? '.tmp-assets/cand/mschanz');
const OUT = path.resolve(process.argv[3] ?? 'public/assets/model/tyrannosaurus');
await mkdir(OUT, { recursive: true });

const gltf = JSON.parse(await readFile(path.join(SRC, 'scene.gltf'), 'utf8'));

const JOBS = [
  { from: 'Body_diffuse.jpeg', to: 'body-diffuse.jpg', size: 2048, quality: 90 },
  { from: 'Body_normal.png', to: 'body-normal.jpg', size: 2048, quality: 92 },
  { from: 'Body_occlusion.png', to: 'body-occlusion.jpg', size: 1024, quality: 88 },
  { from: 'material_diffuse.jpeg', to: 'eye-diffuse.jpg', size: 1024, quality: 90 },
  { from: 'material_normal.png', to: 'eye-normal.jpg', size: 1024, quality: 92 },
];

for (const job of JOBS) {
  const input = path.join(SRC, 'textures', job.from);
  const meta = await sharp(input).metadata();
  await sharp(input)
    .resize(job.size, job.size, { fit: 'inside', kernel: 'lanczos3' })
    .jpeg({ quality: job.quality, mozjpeg: true })
    .toFile(path.join(OUT, job.to));
  const out = await sharp(path.join(OUT, job.to)).metadata();
  console.log(`${job.from} ${meta.width}x${meta.height} -> ${job.to} ${out.width}x${out.height}`);
}

await copyFile(path.join(SRC, 'scene.bin'), path.join(OUT, 'scene.bin'));

gltf.images = JOBS.map((job) => ({ uri: job.to }));
gltf.samplers = [{ magFilter: 9729, minFilter: 9987, wrapS: 10497, wrapT: 10497 }];
gltf.textures = gltf.images.map((_, index) => ({ sampler: 0, source: index }));
gltf.materials = [
  {
    name: 'Body',
    pbrMetallicRoughness: {
      baseColorTexture: { index: 0 },
      metallicFactor: 0,
      roughnessFactor: 0.92,
    },
    normalTexture: { index: 1 },
    occlusionTexture: { index: 2 },
  },
  {
    name: 'Eye',
    pbrMetallicRoughness: {
      baseColorTexture: { index: 3 },
      metallicFactor: 0,
      roughnessFactor: 0.3,
    },
    normalTexture: { index: 4 },
  },
];
gltf.materials.forEach((material) => delete material.extensions);
gltf.extensionsUsed = (gltf.extensionsUsed ?? []).filter(
  (name) => name !== 'KHR_materials_pbrSpecularGlossiness',
);
gltf.extensionsRequired = (gltf.extensionsRequired ?? []).filter(
  (name) => name !== 'KHR_materials_pbrSpecularGlossiness',
);
if (gltf.extensionsUsed.length === 0) delete gltf.extensionsUsed;
if (gltf.extensionsRequired.length === 0) delete gltf.extensionsRequired;

// Mesh 0 is the body, mesh 1 the eyes; their primitives must point at the rebuilt materials.
gltf.meshes.forEach((mesh, index) => {
  for (const primitive of mesh.primitives) {
    primitive.material = index === 0 ? 0 : 1;
    delete primitive.extensions;
  }
});

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

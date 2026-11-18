// Triceratops body (IagoMendez, CC BY 4.0) -> compact glTF for the hero.
// Base colour and normal maps resampled to 2048; the metallic-roughness map is
// dropped because the hero pins every material to a matte dielectric.
// Usage: node scripts/build-trike-body.mjs .tmp-assets/trike public/assets/model/triceratops
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = path.resolve(process.argv[2] ?? '.tmp-assets/trike');
const OUT = path.resolve(process.argv[3] ?? 'public/assets/model/triceratops');
await mkdir(OUT, { recursive: true });

const gltf = JSON.parse(await readFile(path.join(SRC, 'scene.gltf'), 'utf8'));

await sharp(path.join(SRC, 'textures/Material_baseColor.jpeg'))
  .resize(2048, 2048, { fit: 'inside', kernel: 'lanczos3' })
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(path.join(OUT, 'body.jpg'));
await sharp(path.join(SRC, 'textures/Material_normal.jpeg'))
  .resize(2048, 2048, { fit: 'inside', kernel: 'lanczos3' })
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(path.join(OUT, 'body-normal.jpg'));
await sharp(path.join(SRC, 'textures/material_baseColor.jpeg'))
  .resize(1024, 1024, { fit: 'inside', kernel: 'lanczos3' })
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(path.join(OUT, 'detail.jpg'));

await copyFile(path.join(SRC, 'scene.bin'), path.join(OUT, 'scene.bin'));

gltf.images = [{ uri: 'body.jpg' }, { uri: 'body-normal.jpg' }, { uri: 'detail.jpg' }];
gltf.samplers = [{ magFilter: 9729, minFilter: 9987, wrapS: 10497, wrapT: 10497 }];
gltf.textures = gltf.images.map((_, index) => ({ sampler: 0, source: index }));
gltf.materials = gltf.materials.map((material, index) => ({
  name: material.name || `surface-${index}`,
  pbrMetallicRoughness: {
    baseColorTexture: { index: index === 0 ? 0 : 2 },
    metallicFactor: 0,
    roughnessFactor: 0.9,
  },
  ...(index === 0 ? { normalTexture: { index: 1 } } : {}),
}));
delete gltf.extensionsUsed;
delete gltf.extensionsRequired;

await writeFile(path.join(OUT, 'scene.gltf'), JSON.stringify(gltf, null, 1));
console.log('wrote', path.relative(process.cwd(), OUT));

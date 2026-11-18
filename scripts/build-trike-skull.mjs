// The AMNH Triceratops skull (james, CC BY 4.0) is a 408k-triangle unlit
// photogrammetry scan. The hero renders bone with its own material, so the baked
// texture is dropped and the geometry decimated to ~140k.
// Usage: node scripts/build-trike-skull.mjs .tmp-assets/trikeSkull/scene.gltf public/assets/model/triceratops-skull.glb
import { NodeIO } from '@gltf-transform/core';
import { simplify } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';

const SRC = process.argv[2] ?? '.tmp-assets/trikeSkull/scene.gltf';
const OUT = process.argv[3] ?? 'public/assets/model/triceratops-skull.glb';

const io = new NodeIO();
const doc = await io.read(SRC);
const root = doc.getRoot();

for (const material of root.listMaterials()) {
  material.setBaseColorTexture(null);
  material.setMetallicRoughnessTexture(null);
  material.setNormalTexture(null);
  material.setOcclusionTexture(null);
  material.setEmissiveTexture(null);
  material.setBaseColorFactor([0.62, 0.6, 0.54, 1]);
  material.setRoughnessFactor(0.96);
  material.setMetallicFactor(0);
}
for (const texture of root.listTextures()) texture.dispose();

await MeshoptSimplifier.ready;
let total = 0;
for (const mesh of root.listMeshes()) {
  for (const primitive of mesh.listPrimitives()) {
    const indices = primitive.getIndices();
    total += (indices ? indices.getCount() : primitive.getAttribute('POSITION').getCount()) / 3;
  }
}
const ratio = Math.min(1, 140_000 / total);
await doc.transform(simplify({ simplifier: MeshoptSimplifier, ratio, error: 0.002 }));

let after = 0;
for (const mesh of root.listMeshes()) {
  for (const primitive of mesh.listPrimitives()) {
    const indices = primitive.getIndices();
    after += (indices ? indices.getCount() : primitive.getAttribute('POSITION').getCount()) / 3;
  }
}

await io.write(OUT, doc);
console.log(`${Math.round(total)} -> ${Math.round(after)} tris, wrote ${OUT}`);

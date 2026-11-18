// The Oxalaia quilombensis skull (GeoHereditas, CC BY 4.0) is a 3M-triangle
// scan of a physical replica. The hero lights bone with its own material, so the
// baked colour maps are dropped and the geometry decimated to ~160k triangles.
// Usage: node scripts/build-oxalaia-skull.mjs .tmp-assets/oxalaia/scene.gltf public/assets/model/oxalaia-skull.glb
import { NodeIO } from '@gltf-transform/core';
import { simplify } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';

const SRC = process.argv[2] ?? '.tmp-assets/oxalaia/scene.gltf';
const OUT = process.argv[3] ?? 'public/assets/model/oxalaia-skull.glb';

const io = new NodeIO();
const doc = await io.read(SRC);
const root = doc.getRoot();

const bounds = () => {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (const mesh of root.listMeshes()) {
    for (const primitive of mesh.listPrimitives()) {
      const position = primitive.getAttribute('POSITION');
      if (!position) continue;
      const lo = position.getMin([]);
      const hi = position.getMax([]);
      for (let i = 0; i < 3; i++) {
        min[i] = Math.min(min[i], lo[i]);
        max[i] = Math.max(max[i], hi[i]);
      }
    }
  }
  return { min, max, size: max.map((n, i) => n - min[i]) };
};

const before = bounds();

for (const material of root.listMaterials()) {
  material.setBaseColorTexture(null);
  material.setMetallicRoughnessTexture(null);
  material.setNormalTexture(null);
  material.setOcclusionTexture(null);
  material.setEmissiveTexture(null);
  material.setBaseColorFactor([0.64, 0.62, 0.55, 1]);
  material.setRoughnessFactor(0.97);
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
const ratio = Math.min(1, 160_000 / total);
await doc.transform(simplify({ simplifier: MeshoptSimplifier, ratio, error: 0.0015 }));

let after = 0;
for (const mesh of root.listMeshes()) {
  for (const primitive of mesh.listPrimitives()) {
    const indices = primitive.getIndices();
    after += (indices ? indices.getCount() : primitive.getAttribute('POSITION').getCount()) / 3;
  }
}

await io.write(OUT, doc);
const fmt = (v) => v.map((n) => n.toFixed(2)).join(' × ');
console.log(`source bounds ${fmt(before.size)} units (min ${fmt(before.min)})`);
console.log(`${Math.round(total)} -> ${Math.round(after)} tris, wrote ${OUT}`);

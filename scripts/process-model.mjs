import { NodeIO } from '@gltf-transform/core';

/**
 * Prepare the licensed bind-pose Spinosaurus for the web exhibition.
 *
 * Source: "Spinosaurus" by Julian Johnson-Mortimer (Sketchfab, CC BY 4.0).
 * The author's bind-pose archive provides the mesh and 8K UDIM displacement
 * maps. The high mesh uses UDIM tiles 1001–1004 along U; the skin atlas packs
 * those four tiles horizontally, so U is divided by four here.
 */
const io = new NodeIO();
const doc = await io.read('.tmp-research/spinoBind.glb');
const root = doc.getRoot();

const low = root.listNodes().find((node) => node.getName() === 'low');
low?.dispose();

const high = root.listNodes().find((node) => node.getName() === 'high');
if (!high) throw new Error('High mesh not found');

for (const node of root.listNodes()) {
  const mesh = node.getMesh();
  if (!mesh) continue;
  for (const prim of mesh.listPrimitives()) {
    prim.setAttribute('TEXCOORD_1', null);
    if (node === high) {
      const uv = prim.getAttribute('TEXCOORD_0');
      if (!uv) continue;
      const array = uv.getArray();
      for (let i = 0; i < array.length; i += 2) array[i] /= 4;
      uv.setArray(array);
    }
  }
}

for (const material of root.listMaterials()) {
  material.setName('raw-lambert');
}

await io.write('.tmp-research/spino-base.glb', doc);
console.log('Wrote .tmp-research/spino-base.glb');

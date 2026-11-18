import { NodeIO } from '@gltf-transform/core';
import * as fn from '@gltf-transform/functions';

const io = new NodeIO().registerExtensions(fn.ALL_EXTENSIONS ?? []);
const doc = await io.read('public/assets/model/spino-high.glb');
const root = doc.getRoot();

console.log('MESHES');
for (const mesh of root.listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    const pos = prim.getAttribute('POSITION');
    const mat = prim.getMaterial();
    console.log(
      JSON.stringify({
        mesh: mesh.getName(),
        material: mat ? mat.getName() : null,
        vertices: pos ? pos.getCount() : 0,
        hasUV: Boolean(prim.getAttribute('TEXCOORD_0')),
        hasNormal: Boolean(prim.getAttribute('NORMAL')),
        triangles: prim.getIndices() ? prim.getIndices().getCount() / 3 : 0,
        min: pos ? pos.getMin([]) : null,
        max: pos ? pos.getMax([]) : null,
      }),
    );
  }
}

console.log('MATERIALS');
for (const mat of root.listMaterials()) {
  console.log(
    JSON.stringify({
      name: mat.getName(),
      baseColor: mat.getBaseColorFactor(),
      baseTex: mat.getBaseColorTexture()?.getName() ?? null,
      normalTex: mat.getNormalTexture()?.getName() ?? null,
      roughness: mat.getRoughnessFactor(),
      metallic: mat.getMetallicFactor(),
      doubleSided: mat.getDoubleSided(),
      alphaMode: mat.getAlphaMode(),
    }),
  );
}

console.log('TEXTURES', root.listTextures().map((t) => `${t.getName()}:${(t.getSize() ?? []).join('x')}:${t.getMimeType()}`));
console.log('NODES', root.listNodes().map((n) => `${n.getName()}[${n.getMesh() ? n.getMesh().getName() : '-'}]`));

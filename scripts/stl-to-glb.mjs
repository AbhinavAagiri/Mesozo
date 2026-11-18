import fs from 'node:fs';
import { MeshoptSimplifier } from 'meshoptimizer';
import { Document, NodeIO, Accessor, BufferUtils } from '@gltf-transform/core';

const SRC = process.argv[2] ?? '.tmp-assets/spino-skull.stl';
const OUT = process.argv[3] ?? 'public/assets/model/spinosaurus-skull.glb';
const TARGET_TRIANGLES = 140_000;

const raw = fs.readFileSync(SRC);
const triangles = raw.readUInt32LE(80);
const expected = 84 + triangles * 50;
if (raw.length < expected) throw new Error(`Truncated STL: ${raw.length} < ${expected}`);

// 1. Read triangle soup and weld coincident vertices on a fine spatial grid.
const positions = new Float32Array(triangles * 9);
let p = 84;
for (let i = 0; i < triangles; i++) {
  const o = i * 9;
  positions[o + 0] = raw.readFloatLE(p + 12);
  positions[o + 1] = raw.readFloatLE(p + 16);
  positions[o + 2] = raw.readFloatLE(p + 20);
  positions[o + 3] = raw.readFloatLE(p + 24);
  positions[o + 4] = raw.readFloatLE(p + 28);
  positions[o + 5] = raw.readFloatLE(p + 32);
  positions[o + 6] = raw.readFloatLE(p + 36);
  positions[o + 7] = raw.readFloatLE(p + 40);
  positions[o + 8] = raw.readFloatLE(p + 44);
  p += 50;
}

let minX = Infinity, minY = Infinity, minZ = Infinity;
let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
for (let i = 0; i < positions.length; i += 3) {
  const x = positions[i], y = positions[i + 1], z = positions[i + 2];
  if (x < minX) minX = x; if (x > maxX) maxX = x;
  if (y < minY) minY = y; if (y > maxY) maxY = y;
  if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
}
const extent = Math.max(maxX - minX, maxY - minY, maxZ - minZ);
console.log('bounds', [minX, minY, minZ], [maxX, maxY, maxZ], 'extent', extent);

const STEPS = 30000; // quantisation cells across the longest axis
const inv = STEPS / extent;
const qx = new Int32Array(positions.length / 3);
const qy = new Int32Array(positions.length / 3);
const qz = new Int32Array(positions.length / 3);
for (let i = 0, v = 0; i < positions.length; i += 3, v++) {
  qx[v] = Math.round((positions[i] - minX) * inv);
  qy[v] = Math.round((positions[i + 1] - minY) * inv);
  qz[v] = Math.round((positions[i + 2] - minZ) * inv);
}

const COUNT = positions.length / 3;
const BUCKETS = 1 << 24;
const head = new Int32Array(BUCKETS).fill(-1);
const next = new Int32Array(COUNT).fill(-1);
const remap = new Uint32Array(COUNT);
const weldedPos = new Float32Array(COUNT * 3);
const wqx = new Int32Array(COUNT);
const wqy = new Int32Array(COUNT);
const wqz = new Int32Array(COUNT);
let welded = 0;

for (let v = 0; v < COUNT; v++) {
  const a = qx[v] | 0, b = qy[v] | 0, c = qz[v] | 0;
  let h = (Math.imul(a, 73856093) ^ Math.imul(b, 19349663) ^ Math.imul(c, 83492791)) >>> 0;
  h &= BUCKETS - 1;
  let found = -1;
  let cur = head[h];
  while (cur !== -1) {
    if (wqx[cur] === a && wqy[cur] === b && wqz[cur] === c) {
      const dx = weldedPos[cur * 3] - positions[v * 3];
      const dy = weldedPos[cur * 3 + 1] - positions[v * 3 + 1];
      const dz = weldedPos[cur * 3 + 2] - positions[v * 3 + 2];
      if (dx * dx + dy * dy + dz * dz < (extent * 1e-6) ** 2) { found = cur; break; }
    }
    cur = next[cur];
  }
  if (found === -1) {
    found = welded++;
    weldedPos[found * 3] = positions[v * 3];
    weldedPos[found * 3 + 1] = positions[v * 3 + 1];
    weldedPos[found * 3 + 2] = positions[v * 3 + 2];
    wqx[found] = a; wqy[found] = b; wqz[found] = c;
    next[found] = head[h];
    head[h] = found;
  }
  remap[v] = found;
}
console.log('welded', COUNT, '->', welded);

const indices = new Uint32Array(triangles * 3);
for (let i = 0; i < indices.length; i++) indices[i] = remap[i];

// 2. Remove degenerate triangles and simplify with the meshoptimizer quadric simplifier.
await MeshoptSimplifier.ready;
const source = weldedPos.slice(0, welded * 3);
let [simplified, error] = MeshoptSimplifier.simplify(
  indices,
  source,
  3,
  TARGET_TRIANGLES * 3,
  extent * 0.006,
);
for (const tolerance of [0.01, 0.02, 0.035]) {
  if (simplified.length / 3 <= TARGET_TRIANGLES * 1.15) break;
  [simplified, error] = MeshoptSimplifier.simplify(
    indices,
    source,
    3,
    TARGET_TRIANGLES * 3,
    extent * tolerance,
  );
}
console.log('simplified triangles', simplified.length / 3, 'error', error);

// 3. Compact to the referenced vertex set.
const used = new Map();
const outPos = [];
const outIdx = new Uint32Array(simplified.length);
for (let i = 0; i < simplified.length; i++) {
  const v = simplified[i];
  let n = used.get(v);
  if (n === undefined) {
    n = used.size;
    used.set(v, n);
    outPos.push(weldedPos[v * 3], weldedPos[v * 3 + 1], weldedPos[v * 3 + 2]);
  }
  outIdx[i] = n;
}
console.log('compacted vertices', used.size);

// 4. Smooth normals from face accumulation.
const vcount = used.size;
const normals = new Float32Array(vcount * 3);
for (let i = 0; i < outIdx.length; i += 3) {
  const a = outIdx[i] * 3, b = outIdx[i + 1] * 3, c = outIdx[i + 2] * 3;
  const ax = outPos[a], ay = outPos[a + 1], az = outPos[a + 2];
  const e1x = outPos[b] - ax, e1y = outPos[b + 1] - ay, e1z = outPos[b + 2] - az;
  const e2x = outPos[c] - ax, e2y = outPos[c + 1] - ay, e2z = outPos[c + 2] - az;
  const nx = e1y * e2z - e1z * e2y;
  const ny = e1z * e2x - e1x * e2z;
  const nz = e1x * e2y - e1y * e2x;
  normals[a] += nx; normals[a + 1] += ny; normals[a + 2] += nz;
  normals[b] += nx; normals[b + 1] += ny; normals[b + 2] += nz;
  normals[c] += nx; normals[c + 1] += ny; normals[c + 2] += nz;
}
for (let i = 0; i < normals.length; i += 3) {
  const l = Math.hypot(normals[i], normals[i + 1], normals[i + 2]) || 1;
  normals[i] /= l; normals[i + 1] /= l; normals[i + 2] /= l;
}

// 5. Recentre on the model's own origin so alignment happens in scene space.
const posArray = new Float32Array(outPos);
let cx = 0, cy = 0, cz = 0;
for (let i = 0; i < posArray.length; i += 3) { cx += posArray[i]; cy += posArray[i + 1]; cz += posArray[i + 2]; }
cx /= vcount; cy /= vcount; cz /= vcount;
for (let i = 0; i < posArray.length; i += 3) { posArray[i] -= cx; posArray[i + 1] -= cy; posArray[i + 2] -= cz; }

// 6. Write a minimal GLB.
const doc = new Document();
const buffer = doc.createBuffer();
const posAcc = doc.createAccessor('POSITION').setType(Accessor.Type.VEC3).setArray(posArray).setBuffer(buffer);
const normAcc = doc.createAccessor('NORMAL').setType(Accessor.Type.VEC3).setArray(normals).setBuffer(buffer);
const idxAcc = doc.createAccessor('indices').setType(Accessor.Type.SCALAR).setArray(outIdx).setBuffer(buffer);
const material = doc.createMaterial('fossil-bone').setBaseColorFactor([0.72, 0.68, 0.58, 1]).setRoughnessFactor(0.86).setMetallicFactor(0);
const prim = doc.createPrimitive().setAttribute('POSITION', posAcc).setAttribute('NORMAL', normAcc).setIndices(idxAcc).setMaterial(material);
const mesh = doc.createMesh('skull').addPrimitive(prim);
const node = doc.createNode('skull').setMesh(mesh);
doc.createScene('Scene').addChild(node);

const io = new NodeIO();
await io.write(OUT, doc);
console.log('wrote', OUT, (fs.statSync(OUT).size / 1024 / 1024).toFixed(2), 'MB');
console.log('centred at', cx.toFixed(2), cy.toFixed(2), cz.toFixed(2));

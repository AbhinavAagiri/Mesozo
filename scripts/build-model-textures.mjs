import sharp from 'sharp';
import fs from 'node:fs/promises';

/**
 * Turn the four 8K UDIM displacement maps supplied by the model author into
 * one horizontally packed skin atlas. The atlas is used as a bump map and as
 * the basis for a restrained bone/umber patina map. This is a material study
 * of a licensed 3D reconstruction, not invented fossil imagery.
 */
const TILES = ['dis.1001.tif', 'dis.1002.tif', 'dis.1003.tif', 'dis.1004.tif'];
const TILE = 1024;
const W = TILE * TILES.length;
const H = TILE;

const heights = new Float32Array(W * H);
let globalMin = Infinity;
let globalMax = -Infinity;

for (let t = 0; t < TILES.length; t++) {
  const path = `.tmp-research/spinoBits/${TILES[t]}`;
  const { data, info } = await sharp(path)
    .resize(TILE, TILE, { fit: 'fill' })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const is16 = data.length === TILE * TILE * 2;
  const source = is16 ? new Uint16Array(data.buffer, data.byteOffset, TILE * TILE) : data;
  const max = is16 ? 65535 : 255;
  for (let y = 0; y < TILE; y++) {
    for (let x = 0; x < TILE; x++) {
      const value = source[y * TILE + x] / max;
      heights[y * W + t * TILE + x] = value;
      if (value < globalMin) globalMin = value;
      if (value > globalMax) globalMax = value;
    }
  }
  console.log('read', TILES[t], is16 ? '16-bit' : '8-bit');
}

const range = Math.max(0.0001, globalMax - globalMin);
const bump = Buffer.alloc(W * H);
for (let i = 0; i < heights.length; i++) {
  bump[i] = Math.round(Math.max(0, Math.min(1, (heights[i] - globalMin) / range)) * 255);
}

await sharp(bump, { raw: { width: W, height: H, channels: 1 } })
  .webp({ quality: 92, effort: 6 })
  .toFile('public/assets/model/spinosaurus-skin-bump.webp');

// A deterministic low-frequency field gives the patina broad variation
// without pretending to know the animal's actual colour pattern.
function hash(x, y) {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967295;
}
function smoothNoise(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const tx = x - xi;
  const ty = y - yi;
  const sx = tx * tx * (3 - 2 * tx);
  const sy = ty * ty * (3 - 2 * ty);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}
function fbm(x, y) {
  return (
    smoothNoise(x, y) * 0.55 +
    smoothNoise(x * 2.1 + 13.4, y * 2.1 + 8.2) * 0.28 +
    smoothNoise(x * 4.3 + 3.7, y * 4.3 + 19.1) * 0.17
  );
}

const albedo = Buffer.alloc(W * H * 3);
const low = [62, 58, 50];
const mid = [137, 128, 112];
const high = [204, 195, 177];
const orange = [168, 59, 41];
const slate = [89, 107, 120];

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = y * W + x;
    const h = bump[i] / 255;
    const broad = fbm(x / 380, y / 380);
    const fine = fbm(x / 34 + 4.1, y / 34 + 9.7);
    const t = Math.min(1, Math.max(0, h * 0.8 + fine * 0.2));
    let r;
    let g;
    let b;
    if (t < 0.55) {
      const k = t / 0.55;
      r = low[0] + (mid[0] - low[0]) * k;
      g = low[1] + (mid[1] - low[1]) * k;
      b = low[2] + (mid[2] - low[2]) * k;
    } else {
      const k = (t - 0.55) / 0.45;
      r = mid[0] + (high[0] - mid[0]) * k;
      g = mid[1] + (high[1] - mid[1]) * k;
      b = mid[2] + (high[2] - mid[2]) * k;
    }
    // Mineral staining in broad recesses, slate in the deepest folds.
    const stain = Math.max(0, broad - 0.6) * 1.15;
    r = r * (1 - stain * 0.2) + orange[0] * stain * 0.2;
    g = g * (1 - stain * 0.2) + orange[1] * stain * 0.2;
    b = b * (1 - stain * 0.2) + orange[2] * stain * 0.2;
    const cool = Math.max(0, 0.3 - broad) * 1.1;
    r = r * (1 - cool * 0.07) + slate[0] * cool * 0.07;
    g = g * (1 - cool * 0.07) + slate[1] * cool * 0.07;
    b = b * (1 - cool * 0.07) + slate[2] * cool * 0.07;
    albedo[i * 3] = Math.max(0, Math.min(255, Math.round(r)));
    albedo[i * 3 + 1] = Math.max(0, Math.min(255, Math.round(g)));
    albedo[i * 3 + 2] = Math.max(0, Math.min(255, Math.round(b)));
  }
}

await sharp(albedo, { raw: { width: W, height: H, channels: 3 } })
  .webp({ quality: 88, effort: 6 })
  .toFile('public/assets/model/spinosaurus-skin-albedo.webp');

const stat = (file) => fs.stat(file).then((s) => `${file} ${(s.size / 1024 / 1024).toFixed(1)} MB`);
console.log(await Promise.all([
  stat('public/assets/model/spinosaurus-skin-bump.webp'),
  stat('public/assets/model/spinosaurus-skin-albedo.webp'),
]));

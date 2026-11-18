import sharp from 'sharp';
import fs from 'node:fs/promises';

/**
 * The Sketchfab viewer serves the author's original 4K UDIM diffuse maps.
 * This script packs the four tiles (03/04/05/07 correspond to UDIM 1001–1004)
 * into a single atlas and re-grades them into MESOZO's chalk / umber / mineral
 * palette. The luminance detail is the original authored skin pattern; the
 * colour is a deliberate exhibition treatment.
 */
const TILE = 2048;
const W = TILE * 4;
const H = TILE;
const files = ['tex-03.jpeg', 'tex-04.jpeg', 'tex-05.jpeg', 'tex-07.jpeg'];
const kinds = ['body', 'sail', 'body', 'body'];

const out = Buffer.alloc(W * H * 3);
const palette = {
  body: [
    [46, 39, 31],
    [143, 124, 101],
    [219, 206, 184],
  ],
  sail: [
    [48, 40, 31],
    [139, 120, 97],
    [216, 201, 177],
  ],
};

function mix(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

for (let t = 0; t < 4; t++) {
  const { data, info } = await sharp(`.tmp-research/sketchfab-textures/${files[t]}`)
    .resize(TILE, TILE, { fit: 'fill' })
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (info.channels !== 3) throw new Error(`unexpected channels ${info.channels}`);
  const stops = palette[kinds[t]];
  for (let y = 0; y < TILE; y++) {
    for (let x = 0; x < TILE; x++) {
      const si = (y * TILE + x) * 3;
      const r = data[si];
      const g = data[si + 1];
      const b = data[si + 2];
      // Perceptual luminance keeps the authored scale folds and sail ribs.
      let l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      // Lift the midtones but keep the deep crevices.
      l = Math.pow(Math.max(0, Math.min(1, (l - 0.055) / 0.56)), 0.82);
      let c;
      if (l < 0.5) c = mix(stops[0], stops[1], l / 0.5);
      else c = mix(stops[1], stops[2], (l - 0.5) / 0.5);
      // A little cool mineral in the deepest body folds.
      if (kinds[t] === 'body' && l < 0.2) {
        const k = (0.2 - l) / 0.2;
        c = mix(c, [72, 83, 91], k * 0.06);
      }
      const di = (y * W + t * TILE + x) * 3;
      out[di] = Math.max(0, Math.min(255, Math.round(c[0])));
      out[di + 1] = Math.max(0, Math.min(255, Math.round(c[1])));
      out[di + 2] = Math.max(0, Math.min(255, Math.round(c[2])));
    }
  }
  console.log('graded', files[t], kinds[t]);
}

await sharp(out, { raw: { width: W, height: H, channels: 3 } })
  .webp({ quality: 89, effort: 6 })
  .toFile('public/assets/model/spinosaurus-skin-albedo.webp');

// Preserve the original eye texture, graded to amber rather than the green
// iris in the raw viewport texture.
const eye = await sharp('.tmp-research/sketchfab-textures/tex-06.jpeg')
  .resize(512, 512, { fit: 'fill' })
  .raw()
  .toBuffer({ resolveWithObject: true });
const eyeOut = Buffer.alloc(512 * 512 * 3);
for (let i = 0; i < 512 * 512; i++) {
  const r = eye.data[i * 3];
  const g = eye.data[i * 3 + 1];
  const b = eye.data[i * 3 + 2];
  const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const base = l < 0.45
    ? mix([26, 23, 17], [116, 67, 32], l / 0.45)
    : mix([116, 67, 32], [214, 166, 84], (l - 0.45) / 0.55);
  eyeOut[i * 3] = Math.round(base[0]);
  eyeOut[i * 3 + 1] = Math.round(base[1]);
  eyeOut[i * 3 + 2] = Math.round(base[2]);
}
await sharp(eyeOut, { raw: { width: 512, height: 512, channels: 3 } })
  .webp({ quality: 90 })
  .toFile('public/assets/model/spinosaurus-eye.webp');

const stat = (file) => fs.stat(file).then((s) => `${file} ${(s.size / 1024 / 1024).toFixed(2)} MB`);
console.log(await Promise.all([
  stat('public/assets/model/spinosaurus-skin-albedo.webp'),
  stat('public/assets/model/spinosaurus-eye.webp'),
]));

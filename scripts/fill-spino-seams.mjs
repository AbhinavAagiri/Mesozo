// The Sketchfab artist's albedo maps leave empty UV space as light, nearly
// neutral grey. A few seam-spanning triangles sample that margin, making white
// slivers at the shoulder and tail base. Fill low-saturation margin texels with
// each map's mean skin colour. Original maps stay untouched; filled copies are
// written beside them.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const TEX = path.resolve('.tmp-assets/spino/textures');
const maps = ['head_baseColor.jpeg', 'body_baseColor.jpeg', 'tails_baseColor.jpeg', 'legs_baseColor.jpeg'];

for (const filename of maps) {
  const input = path.join(TEX, filename);
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const isMargin = (r, g, b) => {
    const hi = Math.max(r, g, b);
    const lo = Math.min(r, g, b);
    return hi > 110 && hi - lo <= 20;
  };
  let n = 0;
  let r = 0;
  let g = 0;
  let b = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (isMargin(data[i], data[i + 1], data[i + 2])) continue;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    n += 1;
  }
  const fill = n ? [Math.round(r / n), Math.round(g / n), Math.round(b / n)] : [24, 27, 22];
  const pixels = info.width * info.height;
  const source = new Int32Array(pixels).fill(-1);
  const distance = new Float32Array(pixels).fill(1e9);
  for (let p = 0; p < pixels; p += 1) {
    const i = p * 4;
    if (!isMargin(data[i], data[i + 1], data[i + 2])) {
      source[p] = p;
      distance[p] = 0;
    }
  }
  // Two-pass nearest-valid-pixel fill. This clones real skin texels into the
  // empty margins instead of painting a flat block.
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const p = y * info.width + x;
      if (source[p] >= 0) continue;
      let best = distance[p];
      let bestSource = source[p];
      if (x > 0 && distance[p - 1] + 1 < best) {
        best = distance[p - 1] + 1;
        bestSource = source[p - 1];
      }
      if (y > 0 && distance[p - info.width] + 1 < best) {
        best = distance[p - info.width] + 1;
        bestSource = source[p - info.width];
      }
      distance[p] = best;
      source[p] = bestSource;
    }
  }
  for (let y = info.height - 1; y >= 0; y -= 1) {
    for (let x = info.width - 1; x >= 0; x -= 1) {
      const p = y * info.width + x;
      if (source[p] >= 0 && distance[p] === 0) continue;
      let best = distance[p];
      let bestSource = source[p];
      if (x + 1 < info.width && distance[p + 1] + 1 < best) {
        best = distance[p + 1] + 1;
        bestSource = source[p + 1];
      }
      if (y + 1 < info.height && distance[p + info.width] + 1 < best) {
        best = distance[p + info.width] + 1;
        bestSource = source[p + info.width];
      }
      distance[p] = best;
      source[p] = bestSource;
    }
  }
  let replaced = 0;
  for (let p = 0; p < pixels; p += 1) {
    const i = p * 4;
    if (!isMargin(data[i], data[i + 1], data[i + 2])) continue;
    const s = source[p];
    if (s >= 0) {
      const si = s * 4;
      data[i] = data[si];
      data[i + 1] = data[si + 1];
      data[i + 2] = data[si + 2];
    } else {
      data[i] = fill[0];
      data[i + 1] = fill[1];
      data[i + 2] = fill[2];
    }
    data[i + 3] = 255;
    replaced += 1;
  }
  const out = path.join(TEX, filename.replace('_baseColor.jpeg', '_filled.jpeg'));
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .jpeg({ quality: 94, chromaSubsampling: '4:4:4' })
    .toFile(out);
  console.log(filename, 'fill', fill.join(','), 'replaced', replaced, '->', path.basename(out));
}

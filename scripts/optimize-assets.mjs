// Build the responsive image set from the licensed originals in public/assets/raw.
// Naming contract used by the app: /assets/img/{assetId}-{width}.{avif|webp}
import sharp from 'sharp';
import { mkdir, readFile, access, stat } from 'node:fs/promises';
import path from 'node:path';

const RAW = path.resolve('public/assets/raw');
const OUT = path.resolve('public/assets/img');
const registry = JSON.parse(await readFile(path.resolve('src/data/assets.json'), 'utf8'));

const SOURCES = {
  'spinosaurus-living': 'hero-living-3200.png',
  'spinosaurus-mount': 'hero-fossil-3200.jpg',
  'spinosaurus-skull': 'spino-skull-2400.jpg',
  'spinosaurus-field': 'spino-field-2600.jpg',
  'spinosaurus-plate-1934': 'stromer-plates.webp',
  'spinosaurus-mandible-1915': 'stromer-mandible.png',
  'spinosaurus-jaw-1919': 'abel-jaw.jpg',
  'spinosaurus-skeletal-2020': 'skeletal-auditore.jpg',
  'spinosaurus-art-aquatic': 'spino-arm.jpg',
  'tyrannosaurus-living': 'v20-tyrannosaurus.png',
  'tyrannosaurus-skull': 'fossil-trex-skull.jpg',
  'triceratops-living': 'v20-triceratops.png',
  'triceratops-skull': 'fossil-trike-skull.jpg',
  'brachiosaurus-living': 'brachio-nye.png',
  'brachiosaurus-mount': 'fossil-brachio-mount.jpg',
  'velociraptor-living': 'raptor-wierum.png',
  'velociraptor-skull': 'fossil-raptor-skull.jpg',
  'allosaurus-living': 'allo-wierum.jpg',
  'allosaurus-skull': 'fossil-allo-skull.jpg',
  'ankylosaurus-living': 'anky-willoughby.png',
  'ankylosaurus-skull': 'fossil-anky-skull.jpg',
  'deinonychus-living': 'deino-willoughby.png',
  'deinonychus-skull': 'fossil-deino-skull.jpg',
  'baryonyx-living': 'baryonyx-sauroarchive.png',
  'suchomimus-living': 'suchomimus-sauroarchive.png',
  'carnotaurus-living': 'carnotaurus-wierum.png',
  'stegosaurus-living': 'stegosaurus-ashbridge.png',
  'giganotosaurus-living': 'v20-giganotosaurus.png',
};

// Sources with a flat white background. Removed with a border flood fill only,
// so white detail enclosed inside the animal is preserved.
const CUTOUTS = new Set([
  'triceratops-living',
  'velociraptor-living',
  'allosaurus-living',
  'deinonychus-living',
  'baryonyx-living',
  'suchomimus-living',
  'carnotaurus-living',
]);

// Transparent sources that only need their empty margin trimmed.
const TRIM = new Set([
  'spinosaurus-living',
  'brachiosaurus-living',
  'ankylosaurus-living',
  'baryonyx-living',
  'suchomimus-living',
  'stegosaurus-living',
  'tyrannosaurus-living',
  'giganotosaurus-living',
]);

// The skull cast is lit against black. Removing that black turns the reveal
// into bone over the reconstruction rather than a black rectangle.
const DARK_CUTOUTS = new Set(['spinosaurus-skull']);

const WHITE = 232;

async function floodWhite(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const total = width * height;
  const queue = new Int32Array(total);
  const seen = new Uint8Array(total);
  let head = 0;
  let tail = 0;

  const isBackground = (index) => {
    const o = index * 4;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    return r >= WHITE && g >= WHITE && b >= WHITE && Math.max(r, g, b) - Math.min(r, g, b) < 16;
  };

  const push = (index) => {
    if (seen[index] || !isBackground(index)) return;
    seen[index] = 1;
    queue[tail++] = index;
  };

  for (let x = 0; x < width; x += 1) {
    push(x);
    push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    push(y * width);
    push(y * width + width - 1);
  }

  while (head < tail) {
    const index = queue[head++];
    data[index * 4 + 3] = 0;
    const x = index % width;
    const y = (index / width) | 0;
    if (x > 0) push(index - 1);
    if (x < width - 1) push(index + 1);
    if (y > 0) push(index - width);
    if (y < height - 1) push(index + width);
  }

  return sharp(data, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

async function floodDark(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const total = width * height;
  const queue = new Int32Array(total);
  const seen = new Uint8Array(total);
  let head = 0;
  let tail = 0;

  const isDark = (index) => {
    const o = index * 4;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    return r < 38 && g < 38 && b < 38;
  };

  const push = (index) => {
    if (seen[index] || !isDark(index)) return;
    seen[index] = 1;
    queue[tail++] = index;
  };

  for (let x = 0; x < width; x += 1) {
    push(x);
    push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    push(y * width);
    push(y * width + width - 1);
  }

  while (head < tail) {
    const index = queue[head++];
    data[index * 4 + 3] = 0;
    const x = index % width;
    const y = (index / width) | 0;
    if (x > 0) push(index - 1);
    if (x < width - 1) push(index + 1);
    if (y > 0) push(index - width);
    if (y < height - 1) push(index + width);
  }

  return sharp(data, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

async function erodeAlpha(input, radius = 2) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const source = new Uint8Array(width * height);
  const target = new Uint8Array(width * height);
  for (let i = 0; i < source.length; i += 1) source[i] = data[i * 4 + 3];
  target.set(source);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let alpha = 255;
      for (let dy = -radius; dy <= radius; dy += 1) {
        const yy = y + dy;
        if (yy < 0 || yy >= height) continue;
        for (let dx = -radius; dx <= radius; dx += 1) {
          const xx = x + dx;
          if (xx < 0 || xx >= width) continue;
          alpha = Math.min(alpha, source[yy * width + xx]);
        }
      }
      target[y * width + x] = alpha;
    }
  }

  for (let i = 0; i < target.length; i += 1) data[i * 4 + 3] = target[i];
  return sharp(data, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

async function prepare(assetId, source, auto = false) {
  let buffer = await sharp(path.join(RAW, source), { failOn: 'none', limitInputPixels: false })
    .rotate()
    .png()
    .toBuffer();

  if (auto) {
    buffer = await floodWhite(buffer);
    buffer = await erodeAlpha(buffer, 2);
    buffer = await sharp(buffer)
      .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
      .png()
      .toBuffer();
  }

  if (CUTOUTS.has(assetId)) {
    buffer = await floodWhite(buffer);
    buffer = await erodeAlpha(buffer, 2);
  }

  if (DARK_CUTOUTS.has(assetId)) {
    buffer = await floodDark(buffer);
    buffer = await erodeAlpha(buffer, 1);
  }

  if (CUTOUTS.has(assetId) || TRIM.has(assetId) || DARK_CUTOUTS.has(assetId)) {
    buffer = await sharp(buffer)
      .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
      .png()
      .toBuffer();
  }

  if (assetId === 'spinosaurus-living') {
    buffer = await sharp(buffer).flop().png().toBuffer();
  }

  return buffer;
}

await mkdir(OUT, { recursive: true });
let files = 0;
let bytes = 0;

for (const asset of registry) {
  if (!asset.widths?.length) continue;
  const auto = !SOURCES[asset.id];
  const source =
    SOURCES[asset.id] ??
    (asset.id.endsWith('-living') ? `v20-${asset.id.replace(/-living$/, '')}.png` : undefined);
  if (!source) {
    console.log('SKIP (no source mapping)', asset.id);
    continue;
  }
  try {
    await access(path.join(RAW, source));
  } catch {
    console.log('MISSING', asset.id, source);
    continue;
  }

  const original = await sharp(path.join(RAW, source)).metadata();
  const buffer = await prepare(asset.id, source, auto);

  for (const width of asset.widths) {
    const name = `${asset.id}-${width}`;
    const base = sharp(buffer).resize({
      width,
      fit: 'inside',
      withoutEnlargement: false,
    });

    await base
      .clone()
      .avif({ quality: 52, effort: 5, chromaSubsampling: '4:2:0' })
      .toFile(path.join(OUT, `${name}.avif`));
    await base
      .clone()
      .webp({ quality: 80, alphaQuality: 90, effort: 5 })
      .toFile(path.join(OUT, `${name}.webp`));

    for (const ext of ['avif', 'webp']) {
      const info = await stat(path.join(OUT, `${name}.${ext}`));
      files += 1;
      bytes += info.size;
    }
    console.log(
      `${name.padEnd(38)} <- ${String(original.width).padStart(4)}px  ` +
        `${asset.widths.join('/')}  ok`,
    );
  }
}

console.log(`\n${files} files, ${(bytes / 1024 / 1024).toFixed(2)} MB total`);

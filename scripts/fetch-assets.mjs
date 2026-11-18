// Download candidate Commons files by filename via Special:FilePath.
// Usage: node scripts/fetch-assets.mjs <list.json>
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';

const listPath = process.argv[2];
const list = JSON.parse(await readFile(listPath, 'utf8'));
const outDir = path.resolve('public/assets/raw');
await mkdir(outDir, { recursive: true });

for (const item of list) {
  const { file, name, width = 2200 } = item;
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file).replace(/%2F/g, '/')}?width=${width}`;
  const target = path.join(outDir, name);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'MESOZO-asset-research/1.0 (local build)' },
      redirect: 'follow',
    });
    if (!res.ok) {
      console.log('FAIL', res.status, file);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(target, buf);
    console.log('OK', Math.round(buf.length / 1024) + 'KB', name);
  } catch (e) {
    console.log('ERR', file, e.message);
  }
}

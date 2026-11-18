// Research helper: list Wikimedia Commons files with license metadata.
// Usage: node scripts/commons-search.mjs search "Spinosaurus skull" | category "Category:Spinosaurus"
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = { 'User-Agent': 'MESOZO-asset-research/1.0 (local build)' };

const strip = (s = '') =>
  s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const OK_LICENSES = /^(cc0|public domain|cc by|cc-by|pd)/i;

function printPage(p) {
  const ii = p.imageinfo?.[0];
  if (!ii) return;
  const m = ii.extmetadata || {};
  const lic = m.LicenseShortName?.value || '?';
  if (!OK_LICENSES.test(lic)) return;
  const artist = strip(m.Artist?.value).slice(0, 90);
  console.log(
    [p.title, `${ii.width}x${ii.height}`, lic, artist, ii.descriptionurl].join('\t'),
  );
}

const [mode, ...args] = process.argv.slice(2);
if (mode === 'search') {
  for (const q of args) {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      generator: 'search',
      gsrsearch: `filetype:bitmap ${q}`,
      gsrnamespace: '6',
      gsrlimit: '50',
      prop: 'imageinfo',
      iiprop: 'url|size|extmetadata',
    });
    const res = await fetch(`${API}?${params}`, { headers: UA });
    const json = await res.json();
    const pages = Object.values(json.query?.pages ?? {});
    console.log(`\n### SEARCH: ${q} (${pages.length} hits)`);
    pages.sort((a, b) => (b.imageinfo?.[0]?.width ?? 0) - (a.imageinfo?.[0]?.width ?? 0));
    for (const p of pages) printPage(p);
  }
} else if (mode === 'category') {
  for (const cat of args) {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      generator: 'categorymembers',
      gcmtitle: cat,
      gcmtype: 'file',
      gcmlimit: '200',
      prop: 'imageinfo',
      iiprop: 'url|size|extmetadata',
    });
    const res = await fetch(`${API}?${params}`, { headers: UA });
    const json = await res.json();
    const pages = Object.values(json.query?.pages ?? {});
    console.log(`\n### CATEGORY: ${cat} (${pages.length} files)`);
    pages.sort((a, b) => (b.imageinfo?.[0]?.width ?? 0) - (a.imageinfo?.[0]?.width ?? 0));
    for (const p of pages) printPage(p);
  }
} else if (mode === 'info') {
  for (const title of args) {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      titles: title,
      prop: 'imageinfo',
      iiprop: 'url|size|extmetadata|mime',
    });
    const res = await fetch(`${API}?${params}`, { headers: UA });
    const json = await res.json();
    for (const p of Object.values(json.query?.pages ?? {})) {
      const ii = p.imageinfo?.[0];
      if (!ii) { console.log('MISSING', title); continue; }
      const m = ii.extmetadata || {};
      console.log(`\n### ${p.title}`);
      console.log('size:', ii.width, 'x', ii.height, '| mime:', ii.mime);
      console.log('file:', ii.url);
      console.log('page:', ii.descriptionurl);
      for (const k of [
        'LicenseShortName', 'LicenseUrl', 'Artist', 'Credit', 'ObjectName',
        'ImageDescription', 'DateTimeOriginal', 'AttributionRequired', 'UsageTerms',
      ]) {
        if (m[k]) console.log(`${k}:`, strip(m[k].value).slice(0, 500));
      }
    }
  }
}

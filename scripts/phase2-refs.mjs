import { readFile, writeFile, readdir } from 'node:fs/promises';

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));
const writeJson = async (path, data) => writeFile(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

const referencesPath = 'src/data/references.json';
const v19Path = 'src/data/references-v19.json';
const references = await readJson(referencesPath);
const v19References = await readJson(v19Path);

/* ------------------------------------------------------------------ */
/* Bibliographic corrections verified against publisher/archive records */
/* ------------------------------------------------------------------ */

const stromer1915 = references.find((r) => r.id === 'stromer1915');
if (stromer1915) {
  stromer1915.url = 'https://publikationen.badw.de/en/008681370/008681370.pdf';
  stromer1915.note =
    'Bavarian Academy of Sciences digital facsimile of the 1915 original description (Abhandlungen, Band XXVIII, 3. Abhandlung). Historical publication without a DOI.';
}

const osmolska1970 =
  references.find((r) => r.id === 'osmolska1970') ??
  v19References.find((r) => r.id === 'osmolska1970');
if (osmolska1970) {
  osmolska1970.title = 'Deinocheiridae, a new family of theropod dinosaurs';
  osmolska1970.pages = '5–19';
  osmolska1970.url = 'https://www.palaeontologia.pan.pl/Archive/1969-21_5-22_1-5.pdf';
  osmolska1970.note =
    'Original description of Deinocheirus mirificus. The Palaeontologia Polonica volume is dated 1969 on the archive index; the article is conventionally cited as 1970. The archive PDF is the publisher-hosted facsimile.';
}

/* ------------------------------------------------------------------ */
/* Duplicate publication: Lambe 1914                                    */
/*                                                                      */
/* `primary-gryposaurus` and `lambe1914` described the same paper.      */
/* The author-year record is retained because the same paper also       */
/* erects Chasmosaurus, so `primary-gryposaurus` was a misleading ID.   */
/* ------------------------------------------------------------------ */

const duplicate = references.find((r) => r.id === 'primary-gryposaurus');
const canonical = references.find((r) => r.id === 'lambe1914');

let mergedCount = 0;
if (duplicate && canonical) {
  canonical.volume = '27';
  canonical.issue = '11';
  canonical.pages = '145–155';
  canonical.url =
    'https://geology.utah.gov/apps/dino-database/pdf/lambe1914-gryposaurus-notabli.pdf';
  canonical.sourceType = 'Historical article';
  canonical.note =
    'Names Gryposaurus notabilis and also proposes Chasmosaurus as a replacement name for the preoccupied Protorosaurus. The same paper describes the skull of Chasmosaurus belli, originally named Monoclonius belli by Lambe in 1902.';
  canonical.subjects = ['Gryposaurus notabilis', 'Chasmosaurus belli'];

  const index = references.indexOf(duplicate);
  references.splice(index, 1);

  const replaceId = (value) => {
    if (Array.isArray(value)) {
      let changed = false;
      const next = value.map((item) => {
        if (item === 'primary-gryposaurus') {
          changed = true;
          return 'lambe1914';
        }
        const replaced = replaceId(item);
        if (replaced !== item) changed = true;
        return replaced;
      });
      return changed ? next : value;
    }
    if (value && typeof value === 'object') {
      let changed = false;
      const next = {};
      for (const [key, item] of Object.entries(value)) {
        const replaced = replaceId(item);
        if (replaced !== item) changed = true;
        next[key] = replaced;
      }
      return changed ? next : value;
    }
    return value;
  };

  const dataDir = 'src/data';
  const speciesDir = `${dataDir}/species`;
  const targets = [
    `${dataDir}/claim-reviews.json`,
    `${dataDir}/research-trails.json`,
    `${dataDir}/search-trails.json`,
    `${dataDir}/species-audit.json`,
  ];
  for (const file of await readdir(speciesDir)) {
    if (file.endsWith('.json')) targets.push(`${speciesDir}/${file}`);
  }

  for (const file of targets) {
    let data;
    try {
      data = await readJson(file);
    } catch {
      continue;
    }
    const next = replaceId(data);
    if (next !== data) {
      await writeJson(file, next);
      mergedCount += 1;
    }
  }
}

await writeJson(referencesPath, references);
await writeJson(v19Path, v19References);

console.log(`References: ${references.length + v19References.length} total.`);
console.log(`Duplicate Gryposaurus record merged into lambe1914 in ${mergedCount} files.`);
console.log(`Osmólska & Roniewicz title/pages corrected: ${Boolean(osmolska1970)}.`);
console.log(`Stromer 1915 facsimile linked: ${Boolean(stromer1915)}.`);

const reviews = await readJson('src/data/claim-reviews.json');
const missing = [];
for (const [slug, entry] of Object.entries(reviews.reviews)) {
  for (const claim of entry.claims ?? []) {
    if ((claim.refs ?? []).includes('primary-gryposaurus')) missing.push(`${slug}/${claim.id}`);
  }
}
console.log(`Remaining primary-gryposaurus claim refs: ${missing.length}`);

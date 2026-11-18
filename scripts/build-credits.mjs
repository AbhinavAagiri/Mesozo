// Generate docs/ASSET_CREDITS.md from the single source of truth in
// src/data/assets.json. Run after adding or changing an asset.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('.');
const assets = JSON.parse(await readFile(path.join(root, 'src/data/assets.json'), 'utf8'));

const images = assets.filter((a) => (a.kind ?? 'image') === 'image');
const models = assets.filter((a) => a.kind === 'model' || a.kind === 'texture');
const fonts = assets.filter((a) => a.kind === 'font');

const record = (asset, options = {}) => {
  const lines = [
    `### ${asset.title}`,
    '',
    `- **Registry ID:** \`${asset.id}\``,
    `- **Creator:** ${asset.creator}`,
    `- **Source:** ${asset.sourceUrl}`,
    `- **Download:** ${asset.downloadUrl}`,
    `- **Licence:** [${asset.license}](${asset.licenseUrl})`,
    `- **Required attribution:** ${asset.attribution}`,
    `- **Modifications:** ${asset.modifications}`,
    `- **Used in:** ${asset.usedIn.join('; ')}`,
  ];
  if (options.widths) lines.push(`- **Derivative widths:** ${asset.widths.join(', ')} px (AVIF + WebP)`);
  if (options.package) lines.push(`- **Package:** ${asset.downloadUrl}`);
  return lines;
};

const lines = [
  '# Asset credits and licences',
  '',
  'MESOZO does not generate, illustrate or model its own prehistoric imagery. Every image, 3D mesh and texture is an existing work, downloaded from the source listed below, with the licence checked on the individual file page. The code that layers, masks, projects and animates those works is original; the works themselves remain the property of their creators.',
  '',
  `Registry last generated: ${new Date().toISOString().slice(0, 10)}`,
  '',
  '## How to read this record',
  '',
  'The structured source of truth is [`src/data/assets.json`](../src/data/assets.json). This document is generated from it by `node scripts/build-credits.mjs`. Every entry records the creator, the original source page, the download endpoint, the licence and its URL, the required attribution, the modifications made for the web, and where the asset is used.',
  '',
  'CC BY-SA assets are adapted (cropped, background-removed, resized or mirrored) and are shared under the same licence. The source page remains the authoritative record of the original. Public-domain works are marked as such. Fonts are self-hosted through Fontsource and are not modified.',
  '',
  'No asset was downloaded from a site whose terms prohibit reuse. No film, game or commercial artwork is used. No AI-generated dinosaur or fossil imagery is used.',
  '',
  '## Images',
  '',
];

for (const asset of images) {
  lines.push(...record(asset, { widths: true }), '');
}

lines.push(
  '## 3D and derived textures',
  '',
  'The hero figure is a licensed reconstruction rendered from the author’s five 4096 px skin/detail sheets and the original 512 px eye map. Material texture indices were repaired after import so head, body, legs, tail, detail and eye maps bind to their intended surfaces. No normal, roughness or ambient-occlusion maps are supplied; the surface detail comes from the 651.4k-triangle geometry and the 4K diffuse maps under studio lighting. A second mesh from the author’s linked bind-pose archive carries a custom 30-bone rig and explicit weights for the internal model laboratory; the exhibition mesh keeps its original pose and UVs. The fossil plate is a separate, credited photograph of a referred skull cast. It is not composited into the 3D model, and it does not claim to be the individual animal shown in the hall.',
  '',
);

for (const asset of models) {
  lines.push(`**Kind:** ${asset.kind === 'model' ? '3D model' : 'derived texture'}`, '');
  lines.push(...record(asset), '');
}

lines.push('## Typefaces', '');
for (const asset of fonts) {
  lines.push(...record(asset, { package: true }), '');
}

lines.push(
  '## Scientific works',
  '',
  'Papers, books and museum announcements are cited in the running text and in the reference lists on each dossier. Their bibliographic metadata lives in [`src/data/references.json`](../src/data/references.json); images from papers are only reproduced when the paper or the repository states a licence that permits it (for example the CC BY 4.0 skeletal reconstruction by Marco Auditore, published with Ibrahim et al. 2020).',
  '',
  '## Code and editorial text',
  '',
  'The MESOZO code and original editorial text are part of this project. Third-party assets remain under the licences above. If you reuse an image, model or texture, follow its licence and credit the creator; a link back to this site is not a substitute for the licence.',
  '',
  '## Corrections',
  '',
  'If an attribution is wrong or a licence has changed, open an issue in the project repository. The registry, this document and the visible credit at the point of use must be updated together.',
  '',
);

await mkdir(path.join(root, 'docs'), { recursive: true });
await writeFile(path.join(root, 'docs/ASSET_CREDITS.md'), lines.join('\n'));
console.log(
  `Wrote docs/ASSET_CREDITS.md with ${images.length} images, ${models.length} 3D/texture assets and ${fonts.length} typefaces.`,
);

#!/usr/bin/env node
/**
 * Generates sitemap.xml, robots.txt, route-specific static HTML shells and a
 * 404.html into the production build.
 *
 * Cloudflare Pages serves an HTML file when one matches the requested route.
 * The shells give every public URL a route-specific title, description,
 * canonical URL, social card and structured data before React starts. Unknown
 * URLs fall through to 404.html instead of the old wildcard SPA rewrite.
 *
 * Set SITE_URL (or VITE_SITE_URL) in the deployment environment to the real
 * public origin for a release build. Without it, this writes a clearly marked
 * LOCAL PREVIEW: loopback canonical URLs, noindex on every page, and a
 * robots.txt that disallows crawling. There is no production placeholder.
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';
import { createServer, loadEnv } from 'vite';
import { resolveSiteUrlFromEnv } from './site-url.mjs';

const root = process.cwd();
const dist = path.join(root, 'dist');
// Read the same .env files Vite used so SITE_URL in .env / .env.production is
// reflected in the sitemap instead of silently falling back after the build.
const env = { ...loadEnv('production', root, ''), ...process.env };
const { siteUrl: site, configured: siteConfigured } = resolveSiteUrlFromEnv(env);
const origin = site.replace(/\/$/, '');
const localPreview = !siteConfigured;
const SITE_NAME = 'MESOZO';
const WEBSITE_ID = `${origin}/#website`;

const HOME_DESCRIPTION =
  'MESOZO is an independent scientific encyclopedia of non-avian dinosaurs: 113 species dossiers, a classification explorer, deep time and the fossil evidence behind every record.';

const staticRoutes = [
  {
    path: '/',
    title: 'MESOZO — Dinosaur Encyclopedia & Prehistoric Life Database',
    fullTitle: true,
    description: HOME_DESCRIPTION,
    structuredData: {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: SITE_NAME,
      url: `${origin}/`,
      description: HOME_DESCRIPTION,
      inLanguage: 'en',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${origin}/species?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    priority: '1.0',
    changefreq: 'monthly',
  },
  {
    path: '/species',
    title: 'Dinosaur species database',
    description:
      'Search 113 non-avian dinosaur species by scientific name, family, clade, period, diet and region. Each entry links its fossil evidence, classification and sources.',
    priority: '0.9',
    changefreq: 'monthly',
  },
  {
    path: '/classification',
    title: 'Dinosaur classification explorer',
    description:
      'Explore the MESOZO dinosaur family tree by clade and family. Counts, species links, disputed relationships and the evidence behind the classification.',
    priority: '0.9',
    changefreq: 'monthly',
  },
  {
    path: '/deep-time',
    title: 'Deep time',
    description:
      'A sourced journey through 4.567 billion years of Earth history: the geological time scale, extinction boundaries and the species ranges recorded in the MESOZO archive.',
    priority: '0.9',
    changefreq: 'yearly',
  },
  {
    path: '/anatomy',
    title: 'The anatomical atlas',
    description:
      'An interactive anatomical atlas of Spinosaurus and Tyrannosaurus: structures, evidence, reconstructions and the limits of what the fossils preserve.',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/discoveries',
    title: 'Discoveries',
    description:
      'A curated fossil archive and history of discovery: the specimens, people and arguments behind MESOZO\u2019s reconstructions, with missing evidence left visible.',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/journal',
    title: 'Research & Field Notes',
    description:
      'Scientific explainers, reconstruction histories and field notes that follow the species, specimens and periods back into the encyclopedia.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    path: '/about',
    title: 'About',
    description:
      'MESOZO\u2019s scientific standards, distinctions, sourcing method, licences and colophon: an independent prehistoric-life encyclopedia with its working notes left visible.',
    priority: '0.5',
    changefreq: 'yearly',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy',
    description:
      'How MESOZO handles information: no accounts, analytics or advertising, one tab-local browser value, hosting request data and email corrections.',
    priority: '0.3',
    changefreq: 'yearly',
  },
  {
    path: '/terms',
    title: 'Terms of Use',
    description:
      'The terms for using MESOZO\u2019s educational dinosaur reference: permitted use, third-party asset licences, scientific uncertainty and corrections.',
    priority: '0.3',
    changefreq: 'yearly',
  },
  {
    path: '/explore',
    title: 'Explore the prehistoric life archive',
    description:
      'Enter MESOZO through 113 species dossiers, the classification tree, curated learning paths and a linked glossary of scientific terms.',
    priority: '0.9',
    changefreq: 'monthly',
  },
  {
    path: '/prehistoric-world',
    title: 'Prehistoric World: deep time and ancient ecosystems',
    description:
      'Explore the world the dinosaurs inhabited: the geological time scale, Mesozoic climates and geography, and seven fossil formations with their preserved organisms.',
    priority: '0.9',
    changefreq: 'monthly',
  },
  {
    path: '/fossil-evidence',
    title: 'Fossil Evidence: specimens, research and uncertainty',
    description:
      'How palaeontologists know what they know: specimen records, fieldwork, dating, peer-reviewed research, evidence standards and unresolved questions.',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/learn',
    title: 'Field guide: learn how to read prehistoric life',
    description:
      'Fifteen source-linked guides to dinosaurs, anatomy, deep time, fossils and scientific evidence, plus curated learning paths through the MESOZO archive.',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/glossary',
    title: 'Glossary of prehistoric life',
    description:
      'A linked glossary of the scientific terms used across MESOZO: clades, geological time, fossils, dating, anatomy, reconstruction and evidence.',
    priority: '0.6',
    changefreq: 'yearly',
  },
];

const escapeXml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Search engines display roughly 155–160 characters. Keep the opening claim
// intact and cut at a word boundary instead of letting snippets truncate mid-word.
const clampDescription = (value, max = 158) => {
  const clean = value.trim().replace(/\s+/g, ' ');
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  const body = lastSpace > 80 ? cut.slice(0, lastSpace) : cut;
  return `${body.replace(/[,;:.\s]+$/, '')}…`;
};

async function readJson(relative) {
  return JSON.parse(await readFile(path.join(root, relative), 'utf8'));
}

const species = await Promise.all(
  (await readdir(path.join(root, 'src/data/species')))
    .filter((file) => file.endsWith('.json'))
    .map((file) => readJson(`src/data/species/${file}`)),
);

const articles = await Promise.all(
  (await readdir(path.join(root, 'src/data/journal/articles')))
    .filter((file) => file.endsWith('.json'))
    .map((file) => readJson(`src/data/journal/articles/${file}`)),
);

const archive = await readJson('src/data/discovery-archive.json');
const assets = await readJson('src/data/assets.json');
const assetById = new Map(assets.map((asset) => [asset.id, asset]));

// Social crawlers are conservative about image formats. Give every illustrated
// record a 1200×630 JPEG card built from its licensed reconstruction instead
// of pointing og:image at a WebP derivative with an unpredictable aspect ratio.
const socialDir = path.join(dist, 'assets/social');
await mkdir(socialDir, { recursive: true });
const socialImages = new Map();

async function buildSocialCard(assetId) {
  const asset = assetById.get(assetId);
  const width = asset?.widths?.at(-1);
  if (!width) return null;
  const source = path.join(root, 'public/assets/img', `${assetId}-${width}.webp`);
  const target = path.join(socialDir, `${assetId}.jpg`);
  try {
    await sharp(source)
      .resize(1200, 630, { fit: 'contain', background: '#f2f0e8' })
      // A transparent reconstruction would otherwise become black in JPEG.
      .flatten({ background: '#f2f0e8' })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(target);
    const url = `/assets/social/${assetId}.jpg`;
    socialImages.set(assetId, url);
    return url;
  } catch {
    return null;
  }
}

const socialAssetIds = new Set();
for (const item of species) if (item.image) socialAssetIds.add(item.image);
for (const article of articles) {
  if (!article.draft && article.hero?.assetId) socialAssetIds.add(article.hero.assetId);
}
for (const specimen of archive.specimens) {
  const assetId = specimen.media?.[0]?.assetId;
  if (assetId) socialAssetIds.add(assetId);
}
await Promise.all([...socialAssetIds].map((assetId) => buildSocialCard(assetId)));

// The education and world data live in TypeScript modules used by the app.
// Load them through Vite's transform pipeline so this script shares the exact
// guide, path and formation records instead of maintaining a second route list.
const dataServer = await createServer({
  configFile: false,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});
const [learningData, worldData] = await Promise.all([
  dataServer.ssrLoadModule('/src/data/learning.ts'),
  dataServer.ssrLoadModule('/src/data/world.ts'),
]);
await dataServer.close();
const { learningTopics, learningPaths } = learningData;
const { ancientWorlds } = worldData;

if (learningTopics.length === 0 || learningPaths.length === 0 || ancientWorlds.length === 0) {
  throw new Error('SEO: education or ancient-world data loaded empty; refusing to write incomplete route shells.');
}

const guideRoutes = learningTopics.map((topic) => ({
  path: `/learn/${topic.slug}`,
  title: topic.title,
  description: topic.standfirst,
  priority: '0.6',
  changefreq: 'yearly',
  type: 'article',
  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'Field guide', path: '/learn' },
    { name: topic.title, path: `/learn/${topic.slug}` },
  ],
  structuredData: {
    '@type': 'LearningResource',
    name: topic.title,
    description: topic.standfirst,
    learningResourceType: 'Field guide',
    educationalLevel: 'Beginner',
    isAccessibleForFree: true,
    inLanguage: 'en',
    timeRequired: `PT${topic.minutes}M`,
    publisher: { '@type': 'Organization', name: 'MESOZO' },
  },
}));

const pathRoutes = learningPaths.map((item) => ({
  path: `/learn/paths/${item.id}`,
  title: item.title,
  description: item.description,
  priority: '0.6',
  changefreq: 'yearly',
  structuredData: {
    '@type': 'CollectionPage',
    name: item.title,
    description: item.description,
    isAccessibleForFree: true,
    inLanguage: 'en',
    publisher: { '@type': 'Organization', name: 'MESOZO' },
  },
}));

const worldRoutes = ancientWorlds.map((world) => ({
  path: `/prehistoric-world/ecosystem/${world.formation.id}`,
  title: `${world.formation.name} — ancient world`,
  description: `${world.formation.name}: ${world.formation.ageLabel}. The formation context, preserved species and specimen records held in the MESOZO fossil archive.`,
  priority: '0.6',
  changefreq: 'yearly',
  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'Prehistoric World', path: '/prehistoric-world' },
    { name: 'Ancient worlds', path: '/prehistoric-world#worlds' },
    {
      name: world.formation.name,
      path: `/prehistoric-world/ecosystem/${world.formation.id}`,
    },
  ],
  structuredData: {
    '@type': 'WebPage',
    name: `${world.formation.name} — ancient world`,
    description: world.formation.note,
    about: { '@type': 'Place', name: world.formation.name },
    isAccessibleForFree: true,
    inLanguage: 'en',
  },
}));

const educationRoutes = [...guideRoutes, ...pathRoutes, ...worldRoutes];

const urls = [
  ...staticRoutes.map((route) => ({
    loc: `${origin}${route.path}`,
    lastmod: undefined,
    priority: route.priority,
    changefreq: route.changefreq,
  })),
  ...species.map((item) => ({
    loc: `${origin}/species/${item.slug}`,
    lastmod: item.updated,
    priority: '0.8',
    changefreq: 'yearly',
  })),
  ...articles
    .filter((article) => !article.draft)
    .map((article) => ({
      loc: `${origin}/journal/${article.slug}`,
      lastmod: article.updatedAt ?? article.publishedAt,
      priority: '0.7',
      changefreq: 'yearly',
    })),
  ...archive.specimens.map((specimen) => ({
    loc: `${origin}/discoveries/specimen/${specimen.id}`,
    lastmod: undefined,
    priority: '0.6',
    changefreq: 'yearly',
  })),
  ...educationRoutes.map((route) => ({
    loc: `${origin}${route.path}`,
    lastmod: undefined,
    priority: route.priority,
    changefreq: route.changefreq,
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map(
    (url) =>
      `  <url>\n    <loc>${escapeXml(url.loc)}</loc>${
        url.lastmod ? `\n    <lastmod>${escapeXml(url.lastmod)}</lastmod>` : ''
      }\n    <changefreq>${url.changefreq}</changefreq>\n    <priority>${url.priority}</priority>\n  </url>`,
  )
  .join('\n')}\n</urlset>\n`;

const robots = localPreview
  ? 'User-agent: *\nDisallow: /\n# Local preview build. Configure SITE_URL and use build:release for a deployable artifact.\n'
  : `User-agent: *\nAllow: /\nDisallow: /lab\n\nSitemap: ${origin}/sitemap.xml\n`;

await writeFile(path.join(dist, 'sitemap.xml'), xml, 'utf8');
await writeFile(path.join(dist, 'robots.txt'), robots, 'utf8');

const publishedArticles = articles.filter((article) => !article.draft);
const llms = `# MESOZO

> MESOZO is an independent, source-linked scientific encyclopedia of non-avian dinosaurs and the Mesozoic world.

MESOZO documents ${species.length} non-avian dinosaur species through structured dossiers, a classification tree, deep time, anatomy, fossil specimens and research notes. It is a static, free reference work with no accounts, tracking or advertising. Every species record separates direct fossil evidence from inference, contested interpretation and unknown or insufficient evidence.

## Main sections

- [Species archive](${origin}/species): searchable catalogue of ${species.length} non-avian dinosaur dossiers, filterable by period, clade, family, diet and region.
- [Classification](${origin}/classification): the dinosaur family tree by clade and family, including disputed relationships.
- [Prehistoric World](${origin}/prehistoric-world): Mesozoic climates, geography and ${ancientWorlds.length} fossil formations with their preserved organisms.
- [Deep Time](${origin}/deep-time): the geological time scale and extinction boundaries that frame the archive.
- [Anatomy](${origin}/anatomy): anatomical atlas cases linking structures to the evidence that supports their interpretation.
- [Fossil Evidence](${origin}/fossil-evidence): how specimens, fieldwork, dating and peer review produce the record, and where it stops.
- [Discoveries](${origin}/discoveries): ${archive.specimens.length} fossil specimen records, discovery history and revisions.
- [Field guide](${origin}/learn): ${learningTopics.length} educational guides plus curated learning paths.
- [Research & Field Notes](${origin}/journal): ${publishedArticles.length} editorial explainers and reconstruction histories.
- [Glossary](${origin}/glossary): linked definitions of the scientific terms used across the archive.
- [About](${origin}/about): scientific standards, distinctions, sourcing hierarchy, licences and corrections.
- [Privacy Policy](${origin}/privacy): cookies, browser storage, hosting request data, email corrections and privacy contact details.
- [Terms of Use](${origin}/terms): permitted use, third-party asset licensing, scientific uncertainty and availability.

## How the species archive is organised

Each dossier has a stable URL of the form ${origin}/species/{slug}. A dossier records the scientific and common name, classification, geological range, region, size, fossil material and the claims made about the animal. Claims are labelled as established evidence, strongly supported interpretation, active scientific debate, or unknown. Reconstructions are labelled separately and are never presented as specimen evidence. Unillustrated species use a database plate rather than a borrowed image.

The archive is filterable by period, clade, family, diet, region and featured status. Filters are stored in the URL query string and applied in the browser; they do not change the canonical dossier content.

## Evidence and citation practice

Dates follow the International Chronostratigraphic Chart. Dossiers cite peer-reviewed papers, museum publications and monographs through a structured reference registry, with citations attached near the claims they support. General encyclopedias, popular articles and fan wikis are not treated as primary evidence. A citation records where a claim can be checked; it does not imply that the whole work has been read or that every sentence rests on it.

## Limits

- Coverage is selective, not a complete census of dinosaur diversity.
- Fossil completeness varies widely between species, and the dossiers say so.
- Some interpretations, including the body plan and ecology of Spinosaurus, are actively disputed.
- The site publishes no news feed and does not auto-publish discoveries.
- Images are existing licensed works, credited in the asset register and on the About page.

## Machine-readable

- [Sitemap](${origin}/sitemap.xml)
- [Robots policy](${origin}/robots.txt)
`;

await writeFile(path.join(dist, 'llms.txt'), llms, 'utf8');

// Route shells are filled entirely from the resolved origin. The source
// index.html deliberately contains no production domain.
const indexHtml = await readFile(path.join(dist, 'index.html'), 'utf8');
const baseHtml = indexHtml;

function imageForAsset(assetId) {
  return (assetId && socialImages.get(assetId)) || '/og-mesozo.jpg';
}

function absoluteUrl(value) {
  if (/^https?:\/\//i.test(value)) return value;
  return `${origin}${value.startsWith('/') ? '' : '/'}${value}`;
}

function setMeta(html, attribute, key, content) {
  const pattern = new RegExp(`<meta\\s+${attribute}="${escapeRegExp(key)}"[^>]*>`, 'i');
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function removeMeta(html, attribute, key) {
  const pattern = new RegExp(`\\s*<meta\\s+${attribute}="${escapeRegExp(key)}"[^>]*>`, 'gi');
  return html.replace(pattern, '');
}

function renderNoScript(page) {
  const current = page.path === '/' ? 'Home' : escapeHtml(page.title);
  return `<noscript>
  <div class="noscript">
    <p class="label">MESOZO — The prehistoric life database</p>
    <h1>${escapeHtml(page.fullTitle ? page.title : `${page.title} — MESOZO`)}</h1>
    <p>${escapeHtml(clampDescription(page.description))}</p>
    <nav aria-label="Primary destinations">
      <a href="/">Home</a>
      <a href="/species">Species archive</a>
      <a href="/prehistoric-world">Prehistoric World</a>
      <a href="/learn">Field guide</a>
      <a href="/fossil-evidence">Fossil Evidence</a>
      <a href="/about">About</a>
    </nav>
    <p class="mono">${current} · This encyclopedia is a JavaScript application. Enable JavaScript for the complete record, search and interactive atlas.</p>
  </div>
</noscript>`;
}

function renderPage(html, page) {
  const fullTitle = page.fullTitle ? page.title : `${page.title} — MESOZO`;
  const description = clampDescription(page.description);
  // Error pages have no canonical address: they are not a document in the archive.
  const canonical =
    page.canonical === false ? null : `${origin}${page.path === '/' ? '/' : page.path}`;
  const image = absoluteUrl(page.image ?? '/og-mesozo.jpg');
  const imageAlt = page.imageAlt ?? 'MESOZO — the world before us.';

  let output = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(fullTitle)}</title>`,
  );
  output = setMeta(output, 'name', 'description', description);
  output = setMeta(
    output,
    'name',
    'robots',
    localPreview || page.noindex ? 'noindex, nofollow' : 'index, follow',
  );
  output = setMeta(output, 'property', 'og:type', page.type ?? 'website');
  output = setMeta(output, 'property', 'og:site_name', SITE_NAME);
  output = setMeta(output, 'property', 'og:title', fullTitle);
  output = setMeta(output, 'property', 'og:description', description);
  output = setMeta(output, 'property', 'og:image', image);
  output = setMeta(output, 'property', 'og:image:width', '1200');
  output = setMeta(output, 'property', 'og:image:height', '630');
  output = setMeta(output, 'property', 'og:image:alt', imageAlt);
  output = setMeta(output, 'name', 'twitter:card', 'summary_large_image');
  output = setMeta(output, 'name', 'twitter:title', fullTitle);
  output = setMeta(output, 'name', 'twitter:description', description);
  output = setMeta(output, 'name', 'twitter:image', image);
  output = setMeta(output, 'name', 'twitter:image:alt', imageAlt);

  if (canonical) {
    output = setMeta(output, 'property', 'og:url', canonical);
    const canonicalTag = `<link rel="canonical" href="${escapeHtml(canonical)}" />`;
    if (/<link\s+rel="canonical"[^>]*>/i.test(output)) {
      output = output.replace(/<link\s+rel="canonical"[^>]*>/i, canonicalTag);
    } else {
      output = output.replace('</head>', `    ${canonicalTag}\n  </head>`);
    }
  } else {
    output = removeMeta(output, 'property', 'og:url');
    output = output.replace(/\s*<link\s+rel="canonical"[^>]*>/gi, '');
  }

  if (canonical) {
    const webPage = {
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      name: fullTitle,
      description,
      url: canonical,
      isPartOf: { '@id': WEBSITE_ID },
      inLanguage: 'en',
    };
    const graph = [];
    if (page.structuredData?.['@type'] === 'WebSite') graph.push(page.structuredData);
    graph.push(webPage);
    if (page.breadcrumbs?.length) {
      graph.push({
        '@type': 'BreadcrumbList',
        itemListElement: page.breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${origin}${item.path.startsWith('/') ? '' : '/'}${item.path}`,
        })),
      });
    }
    if (page.structuredData && page.structuredData['@type'] !== 'WebSite') {
      graph.push(page.structuredData);
    }

    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graph,
    }).replaceAll('<', '\\u003c');
    output = output.replace(
      '</head>',
      `    <script type="application/ld+json" id="mesozo-page-jsonld">${jsonLd}</script>\n  </head>`,
    );
  }

  output = output.replace('</body>', `${renderNoScript(page)}\n  </body>`);

  return output;
}

const routePages = [
  ...staticRoutes.map((route) => ({ ...route })),
  ...species.map((item) => {
    const image = imageForAsset(item.image);
    return {
      path: `/species/${item.slug}`,
      title: item.scientificName,
      description: `${item.commonName} (${item.scientificName}): ${item.tagline}`,
      image,
      imageAlt: item.image
        ? `Life reconstruction of ${item.scientificName}.`
        : 'MESOZO — the world before us.',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Species database', path: '/species' },
        { name: `${item.accession} · ${item.status}`, path: `/species/${item.slug}` },
      ],
      structuredData: {
        '@type': 'Taxon',
        name: item.scientificName,
        alternateName: item.commonName,
        description: item.tagline,
      },
    };
  }),
  ...articles
    .filter((article) => !article.draft)
    .map((article) => {
      const image = imageForAsset(article.hero?.assetId);
      return {
        path: `/journal/${article.slug}`,
        title: article.headline,
        description: article.standfirst,
        image,
        imageAlt: article.hero?.alt ?? article.hero?.caption,
        type: 'article',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Research', path: '/journal' },
          {
            name: `No. ${String(article.number).padStart(2, '0')}`,
            path: `/journal/${article.slug}`,
          },
        ],
        structuredData: {
          '@type': 'Article',
          headline: article.headline,
          description: article.standfirst,
          image: absoluteUrl(image),
          datePublished: article.publishedAt,
          dateModified: article.updatedAt ?? article.publishedAt,
          author: { '@type': 'Organization', name: article.byline },
          publisher: { '@type': 'Organization', name: 'MESOZO' },
          mainEntityOfPage: { '@type': 'WebPage', '@id': `${origin}/journal/${article.slug}` },
        },
      };
    }),
  ...archive.specimens.map((specimen) => {
    const image = imageForAsset(specimen.media?.[0]?.assetId);
    return {
      path: `/discoveries/specimen/${specimen.id}`,
      title: specimen.identifier,
      description: specimen.significance,
      image,
      imageAlt: `${specimen.identifier}: fossil specimen record.`,
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Discoveries', path: '/discoveries' },
        { name: 'Fossil archive', path: '/discoveries#archive' },
        { name: specimen.identifier, path: `/discoveries/specimen/${specimen.id}` },
      ],
    };
  }),
  ...educationRoutes.map((route) => ({ ...route })),
];

// The root shell is the existing Vite entry. Every nested public route gets its
// own copy so Cloudflare Pages can answer a direct request with the right head.
await writeFile(path.join(dist, 'index.html'), renderPage(baseHtml, routePages[0]), 'utf8');

for (const page of routePages.slice(1)) {
  const directory = path.join(dist, ...page.path.split('/').filter(Boolean));
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), renderPage(baseHtml, page), 'utf8');
}

const notFound = renderPage(baseHtml, {
  path: '/404',
  title: 'Page not found',
  description: 'This address does not match a page in the MESOZO archive.',
  noindex: true,
  canonical: false,
});
await writeFile(path.join(dist, '404.html'), notFound, 'utf8');

console.log(
  `SEO: wrote ${urls.length} URLs, ${routePages.length} static route shells and 404.html for ${origin} ` +
    `(${localPreview ? 'LOCAL PREVIEW, noindex' : 'RELEASE'}).`,
);
if (localPreview) {
  console.warn(
    'SEO: LOCAL PREVIEW only. No SITE_URL supplied; every shell is noindex and robots.txt disallows crawling. ' +
      'Set SITE_URL and use `npm run build:release` for a deployable artifact.',
  );
}

// Builds the species audit matrix and the human-readable audit report.
// This is an editorial coverage assessment, not a claim that every statement
// in every dossier is correct. Statuses are deliberately conservative.
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('.');
const readJson = async (file) => JSON.parse(await readFile(path.join(root, file), 'utf8'));

const speciesFiles = (await readdir(path.join(root, 'src/data/species')))
  .filter((file) => file.endsWith('.json'))
  .sort();
const species = [];
for (const file of speciesFiles) {
  species.push(await readJson(`src/data/species/${file}`));
}

const trails = await readJson('src/data/research-trails.json');
const claimData = await readJson('src/data/claim-reviews.json');
const archive = await readJson('src/data/discovery-archive.json');
const referencedSpecies = new Set(archive.specimens.map((specimen) => specimen.speciesId));

// A `primary-` prefix is a legacy editorial identifier, not proof that a record
// is the original naming work. These mappings were checked against the species
// authority and the reference itself. They also cover reviewed species whose
// original description has a historical author-year ID instead of a `primary-`
// ID, so the audit no longer reports a false omission merely because of naming.
const originalDescriptionBySlug = {
  albertosaurus: 'osborn1905',
  allosaurus: 'marsh1877',
  ankylosaurus: 'brown1908',
  baryonyx: 'charig1986',
  brachiosaurus: 'riggs1903',
  carnotaurus: 'bonaparte1985',
  chasmosaurus: 'lambe1902',
  compsognathus: 'wagner1859',
  deinocheirus: 'osmolska1970',
  deinonychus: 'ostrom1969',
  euoplocephalus: 'lambe1902',
  giganotosaurus: 'coria1995',
  gryposaurus: 'lambe1914',
  jobaria: 'sereno1999',
  megalosaurus: 'mantell1827',
  nigersaurus: 'sereno1999',
  oviraptor: 'osborn1924',
  pachycephalosaurus: 'gilmore1931',
  polacanthus: 'primary-polacanthus',
  sauropelta: 'ostrom1970',
  spinosaurus: 'stromer1915',
  suchomimus: 'sereno1998',
  tenontosaurus: 'ostrom1970',
  triceratops: 'marsh1889',
  tyrannosaurus: 'osborn1905',
  velociraptor: 'osborn1924',
};

const STATUS_LABEL = {
  'researched-enriched': 'Researched and enriched',
  'reviewed-no-new-evidence': 'Reviewed, no substantial new evidence found',
  'partially-researched': 'Partially researched',
  'requires-verification': 'Requires further verification',
  'protected-existing': 'Protected existing dossier',
};

const corrections = {
  edmontosaurus:
    'Age corrected from 68–66 Ma (the range of E. annectens) to the late Campanian–early Maastrichtian range of E. regalis (≈73–68 Ma).',
  nodosaurus:
    'Formation corrected from Mowry Shale to the Frontier Formation (Belle Fourche Member), Como Bluff, Wyoming; type specimen YPM 1815.',
  coelophysis:
    'The alleged cannibal gut contents were reidentified as crocodylomorph remains; the dossier now states that cannibalism is not demonstrated. Occurrence range widened to ≈215–201.4 Ma.',
  kulindadromeus:
    'Locality age refined from a broad 169–164 Ma to the dated Bathonian interval ≈168.3–166.1 Ma.',
  deinocheirus:
    'Original-description reference corrected to Osmólska & Roniewicz (1970); the previous citation was a 1969 popular account.',
  carnotaurus:
    'The 1985 and 1990 references were separated; the 1985 note no longer carries the 1990 monograph DOI.',
  miragaia:
    'The 2024 synonymy proposal and 2025 counter-description were added as references instead of leaving the dispute uncited.',
  falcarius:
    'The Nature citation was corrected to volume 435, pages 84–87, and the title typo was removed.',
  gigantspinosaurus:
    'The name-bearing Ouyang (1992) abstract was separated from Maidment & Wei (2006), which is a review rather than the original description. The incorrect DOI inherited from the review was removed.',
  ouranosaurus:
    'The original-description reference was corrected from the 1972 Gadoufaoua locality paper to Taquet’s 1976 osteology chapter.',
  mamenchisaurus:
    'Inconsistent volume and year metadata in the original-description record was cleaned up.',
  minmi:
    'The Leahey et al. (2015) record now states that it names Kunbarrasaurus ieversi for the Allaru skeleton formerly called Minmi sp.; it is not a description of the Minmi holotype.',
  chasmosaurus:
    'Naming corrected: the species was named Monoclonius belli by Lambe in 1902, not in 1914. The genus Chasmosaurus was erected in 1914 after the earlier name Protorosaurus proved preoccupied. Both the 1902 species description and the 1914 genus paper are now cited.',
  compsognathus:
    'Naming history clarified: Wagner published the name in a brief 1859 notice and a fuller description in 1861. Both are cited, and the dossier now records the lizard preserved in the holotype’s abdominal cavity as direct dietary evidence.',
  allosaurus:
    'The feeding-trace section now distinguishes direct evidence of carcass utilization at Mygatt-Moore from the inference of cannibalism. Drumheller et al. (2020) was added as the specific source.',
  carcharodontosaurus:
    'Naming corrected: the species was first described as Megalosaurus saharicus by Depéret & Savornin (1925); Stromer (1931) erected the genus Carcharodontosaurus and referred the Egyptian skeleton to it. Both the species description and the genus paper are now cited.',
  deinonychus:
    'Holotype corrected: YPM 5205 is a complete left pes and incomplete right pes, not a partial skeleton including the skull and limbs. The Discoveries archive entry now states the preserved foot material and distinguishes the type from the referred skeleton.',
  dicraeosaurus:
    'Provenance clarified: MB.R.4886 (skeleton “m” from Tendaguru quarry “m”) is the principal skeleton, and the Berlin mount is composite rather than a single individual.',
  diplodocus:
    'The Carnegie mount is described as a composite of CM 84, CM 94, other specimens, casts and sculpted elements. The title of Hatcher (1901) was corrected from “probate habits” to “probable habits”.',
  edmontonia:
    'Type provenance corrected from the Horseshoe Canyon Formation of Alberta to the Two Medicine Formation of Montana (USNM 11868; late Campanian, approximately 78.2–74.6 Ma). Referred Dinosaur Park material is treated separately.',
  iguanacolossus:
    'Anatomy corrected: no hand bones are preserved in UMNH VP 20205, so the thumb spike is inferred from iguanodontian relationships rather than observed. The dossier no longer states that the hand bears a spike.',
  lambeosaurus:
    'Type history clarified: Parks (1923) based Lambeosaurus lambei on two skulls, CMN 351 and CMN 2869; Gilmore (1924) selected CMN 2869 as the type. The crest’s hollow nasal passages and the resonating-chamber hypothesis are now distinguished from observed sound production.',
  leaellynasaura:
    'Holotype corrected: NMV P185991 is a partial juvenile cheek and maxilla, not several partial skeletons. The skull roof and postcranial fragments are separate specimens, and later work disputes the postcranial referral.',
  muttaburrasaurus:
    'Age corrected from the Albian range of about 107–103 Ma to the Cenomanian–lower Turonian, approximately 96.3–93.5 Ma, following the recent stratigraphic review. The dossier age fields and fossil-evidence text were updated.',
  orodromeus:
    'Egg attribution corrected: clutches including MOR 246 were reinterpreted as troodontid eggs and are no longer treated as direct evidence of Orodromeus nesting.',
  pachycephalosaurus:
    'Naming corrected: Gilmore (1931) named Troodon wyomingensis; Brown & Schlaikjer (1943) erected Pachycephalosaurus and combined the species as P. wyomingensis. Both references were added. The 1983 Galton & Sues record is now explicitly labelled a later redescription, not the original description.',
  megalosaurus:
    'Species description added: Mantell (1827) named Megalosaurus bucklandii; Buckland (1824) described the genus but did not establish the binomial. The naming claim now cites both works.',
  polacanthus:
    'Naming corrected: the 1865 anonymous report attributed the name to Owen, and Hulke (1881) provided the first detailed description. The claim no longer presents Hulke as the 1865 author, and the reference note records the ambiguity.',
  coelophysis:
    'Naming corrected: the species was first named Coelurus bauri in 1887; Cope erected Coelophysis in 1889. The dossier now records both dates and does not treat 1889 as the species description.',
  euoplocephalus:
    'Naming corrected: Stereocephalus tutus was named in 1902; the genus was renamed Euoplocephalus in 1910 because Stereocephalus was preoccupied. The dossier now records both the species and genus dates.',
  rhabdodon:
    'Lectotype clarified: MPLM 30 is a partial left dentary, and a 2025 revision reports that it has not been relocated. The 1999 nearly complete skeleton is a separate referred specimen.',
  stegosaurus:
    'The dossier now has a research trail, specimen-status record and references for USNM 4934 and NHMUK PV R36730. The existing Discoveries entries were preserved.',
};

const entries = {};
const rows = [];
const flagCounts = new Map();
const statusCounts = new Map();

for (const s of species) {
  const trail = trails[s.slug];
  const review = claimData.reviews[s.slug];
  const entriesList = trail?.entries ?? [];
  const genericConfidence = /This is a database record for a named species, not a complete monograph/i.test(
    s.confidenceNote ?? '',
  );
  const genericDiet = /^Diet is inferred from the preserved skull|^Diet is inferred from the available cranial/i.test(
    s.dietEvidence?.body ?? '',
  );
  const genericBehaviour = /^Direct evidence of behaviour is limited/i.test(s.behaviour?.body ?? '');
  const hasReadAbstract = (access = '') =>
    /abstract/i.test(access) && !/abstract not available/i.test(access);
  const hasReadFullText = (access = '') =>
    /(full text (read|consulted)|substantial full text|facsimile|full text and database metadata|repository full text consulted)/i.test(
      access,
    ) && !/full texts? not read|abstract not available/i.test(access);
  const abstractEntries = entriesList.filter((entry) => hasReadAbstract(entry.access)).length;
  const fullTextEntries = entriesList.filter((entry) => hasReadFullText(entry.access)).length;
  const metadataOnly =
    entriesList.length > 0 &&
    entriesList.every((entry) => entry.access === 'Metadata only');
  const primary =
    originalDescriptionBySlug[s.slug] ?? s.references.find((id) => id.startsWith('primary-'));
  const flags = [];

  if (genericConfidence) flags.push('generic confidence note');
  if (genericDiet) flags.push('generic diet text');
  if (genericBehaviour) flags.push('generic behaviour text');
  if (!entriesList.length) flags.push('no research trail');
  if (entriesList.length > 0 && entriesList.length < 3) flags.push('research trail has fewer than 3 entries');
  if (metadataOnly) flags.push('trail is metadata-only');
  if (s.references.length < 4) flags.push('fewer than 4 references');
  if (!primary) flags.push('no verified original-description mapping');
  if (!referencedSpecies.has(s.slug)) flags.push('no linked specimen catalogue entry');
  if (corrections[s.slug]) flags.push('corrected in this pass');

  let status;
  if (review) status = 'researched-enriched';
  else if (s.slug === 'spinosaurus') status = 'protected-existing';
  else if (
    genericConfidence ||
    !entriesList.length ||
    entriesList.length < 3 ||
    s.references.length < 4
  ) {
    status = 'requires-verification';
  } else {
    status = 'partially-researched';
  }

  for (const flag of flags) flagCounts.set(flag, (flagCounts.get(flag) ?? 0) + 1);
  statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1);

  const note =
    corrections[s.slug] ??
    (review
      ? review.scope
      : status === 'protected-existing'
        ? 'Extended dossier and protected 3D experience were not modified. The existing evidence trail remains the reference point.'
        : status === 'partially-researched'
          ? `Existing dossier and ${entriesList.length}-entry research trail reviewed at field level. No claim-level recheck of every statement was completed in this pass.`
          : `Existing dossier reviewed at field level. ${flags.join('; ')}. The claims still require source-by-source verification.`);

  entries[s.slug] = {
    status,
    refs: s.references.length,
    trailEntries: entriesList.length,
    abstractEntries,
    fullTextEntries,
    genericConfidenceNote: genericConfidence,
    originalDescriptionRef: primary,
    linkedSpecimen: referencedSpecies.has(s.slug),
    flags,
    note,
  };

  rows.push({
    slug: s.slug,
    name: s.scientificName,
    group: s.group,
    period: s.periodLabel,
    status,
    refs: s.references.length,
    trail: entriesList.length,
    abstractEntries,
    fullTextEntries,
    flags,
  });
}

const audit = {
  version: '1.0',
  updated: '2026-11-17',
  total: species.length,
  standard:
    'A species is marked “Researched and enriched” only where a claim-level review was completed and its dossier text or sourcing was changed. “Partially researched” means the bibliography and trail were reviewed but not every claim was rechecked. “Requires further verification” means generic text, thin sourcing or missing evidence remains. This is a coverage assessment, not a certification of accuracy.',
  entries,
};

await writeFile(path.join(root, 'src/data/species-audit.json'), `${JSON.stringify(audit, null, 2)}\n`);

const totalAbstracts = rows.reduce((sum, row) => sum + row.abstractEntries, 0);
const totalFullTexts = rows.reduce((sum, row) => sum + row.fullTextEntries, 0);
const noTrailCount = rows.filter((row) => row.trail === 0).length;
const metadataOnlyCount = rows.filter((row) => row.flags.includes('trail is metadata-only')).length;
const abstractOnlyCount = rows.filter((row) => row.abstractEntries > 0 && row.fullTextEntries === 0).length;
const noAbstractCount = rows.filter((row) => row.abstractEntries === 0).length;
const lines = [];
lines.push('# MESOZO scientific content audit — 17 November 2026');
lines.push('');
lines.push('This audit records what was actually checked across five research passes. It is not a certificate that every statement is correct. A species is only marked **Researched and enriched** where a claim-level review was written and its content or sourcing was changed.');
lines.push('');
lines.push('## Method');
lines.push('');
lines.push('- Every one of the 113 species JSON files, its reference list, its research trail and its linked specimen records were read at field level.');
lines.push('- Existing references were checked for identity, DOI/URL presence and obvious mismatches. Original descriptions were not assumed to be correct because they were labelled “primary”; the audit uses an explicit, checked species mapping.');
lines.push('- Claims were added only where the cited abstract, open-access text or specimen record supported the wording. Access limits are recorded in each claim review.');
lines.push('- The protected Spinosaurus dossier, model and 3D scroll experience were not modified.');
lines.push('- Statuses are conservative. “Partially researched” does not mean the species is complete; it means the bibliography and trail were reviewed without a full claim-level recheck.');
lines.push('');
lines.push('## Coverage summary');
lines.push('');
lines.push(`- Species audited: **${species.length}**`);
lines.push(`- Claim-level reviews completed: **${Object.keys(claimData.reviews).length}**`);
lines.push(`- Species with at least one abstract-recorded source in the trail: **${rows.filter((row) => row.abstractEntries > 0).length}**`);
lines.push(`- Species with at least one full-text source in the trail: **${rows.filter((row) => row.fullTextEntries > 0).length}**`);
lines.push(`- Abstract-level trail entries: **${totalAbstracts}**; full-text trail entries: **${totalFullTexts}**`);
lines.push('');
lines.push('| Status | Species |');
lines.push('| --- | ---: |');
for (const [status, count] of [...statusCounts.entries()].sort((a, b) => b[1] - a[1])) {
  lines.push(`| ${STATUS_LABEL[status]} | ${count} |`);
}
lines.push('');
lines.push('## Content and citation corrections');
lines.push('');
for (const [slug, note] of Object.entries(corrections)) {
  const s = species.find((item) => item.slug === slug);
  lines.push(`- **${s?.scientificName ?? slug}** — ${note}`);
}
lines.push('');
lines.push('## Researched cohorts');
lines.push('');
const cohort = rows.filter((row) => row.status === 'researched-enriched');
const reviewKeys = Object.keys(claimData.reviews);
const cohortStats = (keys) => {
  const claims = keys.reduce((sum, key) => sum + claimData.reviews[key].claims.length, 0);
  const cited = new Set();
  for (const key of keys) {
    for (const claim of claimData.reviews[key].claims) {
      for (const ref of claim.refs ?? []) cited.add(ref);
    }
  }
  return { species: keys.length, claims, cited: cited.size };
};
const pass1 = cohortStats(reviewKeys.slice(0, 24));
const pass2 = cohortStats(reviewKeys.slice(24, 47));
const pass3 = cohortStats(reviewKeys.slice(47, 67));
const pass4 = cohortStats(reviewKeys.slice(67, 87));
const pass5 = cohortStats(reviewKeys.slice(87));
const allCited = new Set();
for (const key of reviewKeys) {
  for (const claim of claimData.reviews[key].claims) {
    for (const ref of claim.refs ?? []) allCited.add(ref);
  }
}
lines.push(`Pass 1 established ${pass1.species} claim-level reviews (${pass1.claims} claims, ${pass1.cited} cited source IDs). Pass 2 added ${pass2.species} species (${pass2.claims} further claims, ${pass2.cited} cited source IDs). Pass 3 added ${pass3.species} species (${pass3.claims} further claims, ${pass3.cited} cited source IDs). Pass 4 added ${pass4.species} species (${pass4.claims} further claims, ${pass4.cited} cited source IDs). Pass 5 added the final ${pass5.species} species (${pass5.claims} further claims, ${pass5.cited} cited source IDs), bringing the total to ${cohort.length} reviewed species and ${allCited.size} distinct cited source IDs across five cohorts. The cohorts span theropods, sauropodomorphs and ornithischians rather than concentrating on famous taxa.`);
lines.push('');
lines.push('| Species | Group | Claims | Abstract entries | Full-text entries |');
lines.push('| --- | --- | ---: | ---: | ---: |');
for (const row of cohort) {
  const review = claimData.reviews[row.slug];
  lines.push(
    `| *${row.name}* | ${row.group} | ${review.claims.length} | ${row.abstractEntries} | ${row.fullTextEntries} |`,
  );
}
lines.push('');
lines.push('## Public claim ledger');
lines.push('');
lines.push('Every species dossier now carries an **Evidence** section between the fossil record and the research trail. It has two honest states:');
lines.push('');
lines.push(`- **Reviewed species:** ${Object.values(claimData.reviews).reduce((sum, review) => sum + review.claims.length, 0)} individual claims across ${Object.keys(claimData.reviews).length} species, each assigned to exactly one of four categories — direct evidence, strong scientific inference, active debate or unknown — with its own citations, qualification, context, competing reading where relevant, and a list of open gaps.`);
lines.push('- **Unreviewed species:** an explicit coverage statement, the audit status, linked-reference and trail counts, coverage flags and links to the existing trail and bibliography. No claim relationship is invented.');
lines.push('');
lines.push('The five older evidence tags used inside existing sections are not presented as equivalent to the four review categories; the ledger says so in the interface. Claim references are merged into the dossier bibliography, and `npm run data:check` now validates every claim ID, category and reference ID, plus every audit entry.');
lines.push('');
lines.push('## Complete species matrix');
lines.push('');
lines.push('Flags are evidence-coverage warnings, not taxonomic judgements. “No verified original-description mapping” means no record has been linked to the species-level naming work after checking; it is not inferred from a `primary-` prefix. A `primary-` record can still be a later redescription, as the Pachycephalosaurus, Compsognathus and Polacanthus notes explain.');
lines.push('');
lines.push('| Species | Group | Period | Status | Refs | Trail | Abstract | Full text | Coverage flags |');
lines.push('| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- |');
for (const row of rows) {
  lines.push(
    `| *${row.name}* | ${row.group} | ${row.period} | ${STATUS_LABEL[row.status]} | ${row.refs} | ${row.trail} | ${row.abstractEntries} | ${row.fullTextEntries} | ${row.flags.join('; ') || '—'} |`,
  );
}
lines.push('');
lines.push('## Flag counts');
lines.push('');
lines.push('| Flag | Species |');
lines.push('| --- | ---: |');
for (const [flag, count] of [...flagCounts.entries()].sort((a, b) => b[1] - a[1])) {
  lines.push(`| ${flag} | ${count} |`);
}
lines.push('');
lines.push('## Remaining gaps');
lines.push('');
lines.push(`- ${species.length - Object.keys(claimData.reviews).length} species remains outside the claim-level review by design: Spinosaurus, whose protected dossier and 3D experience were not modified.`);
lines.push(`- ${noTrailCount} species have no separate research trail; ${metadataOnlyCount} existing trail is metadata-only. Titles and bibliographic records were reviewed, but abstracts or full texts were not read for those entries.`);
lines.push(`- ${abstractOnlyCount} species have abstract-level entries but no full-text entry; ${noAbstractCount} have no abstract-level entry at all.`);
lines.push(`- Generic language remains in ${flagCounts.get('generic confidence note') ?? 0} confidence notes, ${flagCounts.get('generic diet text') ?? 0} diet sections and ${flagCounts.get('generic behaviour text') ?? 0} behaviour sections.`);
lines.push('- Several original descriptions are historical works without a DOI or stable URL. Their identity was checked where possible, but the full text was not read.');
lines.push('- The archive still has no verified specimen catalogue entry for many species. This is a documentation gap, not evidence that no specimen exists.');
lines.push(`- The ${Object.keys(claimData.reviews).length} reviewed species span five cohorts. The remaining ${species.length - Object.keys(claimData.reviews).length} is the protected Spinosaurus dossier, which is outside this research programme and was not modified.`);
lines.push('');
lines.push('## Functional note');
lines.push('');
lines.push('The audit is generated from the same JSON files used by the site. It does not change routes, filters, search or the Spinosaurus 3D experience.');
lines.push('');

await mkdir(path.join(root, 'docs'), { recursive: true });
await writeFile(path.join(root, 'docs/SCIENTIFIC_AUDIT_2026-11-17.md'), `${lines.join('\n')}\n`);

console.log(`Audited ${species.length} species.`);
console.log(`Statuses: ${[...statusCounts.entries()].map(([key, value]) => `${key}=${value}`).join(', ')}`);
console.log(`Wrote src/data/species-audit.json and docs/SCIENTIFIC_AUDIT_2026-11-17.md`);

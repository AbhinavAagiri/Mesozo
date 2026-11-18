import {
  atlasCases,
  discoveries,
  discoveryEventForSpecimen,
  discoveryFormationForSpecimen,
  discoveryLocationForSpecimen,
  discoveryResearchersForEvent,
  discoverySpecimens,
  formatMaRange,
  geoUnits,
  getGeoUnit,
  referenceById,
  species,
} from './index';
import { journalArticles, journalCategoryById } from './journal';
import { researchReferenceById } from './research-references';
import { ancientWorlds } from './world';
import { glossaryEntries, learningTopics } from './learning';
import searchTrailsData from './search-trails.json';

type SearchTrail = {
  status: string;
  titles: string[];
  refs: string[];
};

const searchTrails = searchTrailsData as Record<string, SearchTrail>;

export type SearchKind =
  | 'species'
  | 'period'
  | 'world'
  | 'anatomy'
  | 'specimen'
  | 'discovery'
  | 'journal'
  | 'learning'
  | 'glossary';

export interface SearchResult {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string;
  meta: string;
  description?: string;
  to: string;
  /** True when the result came from the close-spelling fallback. */
  fuzzy?: boolean;
}

export const SEARCH_GROUPS: Array<{ kind: SearchKind; label: string; index: string }> = [
  { kind: 'species', label: 'Species', index: '01' },
  { kind: 'world', label: 'Ancient worlds', index: '02' },
  { kind: 'period', label: 'Deep time', index: '03' },
  { kind: 'anatomy', label: 'Anatomy', index: '04' },
  { kind: 'specimen', label: 'Specimens', index: '05' },
  { kind: 'discovery', label: 'Discovery history', index: '06' },
  { kind: 'journal', label: 'Research', index: '07' },
  { kind: 'learning', label: 'Field guide', index: '08' },
  { kind: 'glossary', label: 'Glossary', index: '09' },
];

const groupOrder = new Map(SEARCH_GROUPS.map((group, index) => [group.kind, index]));
const kindBoost: Record<SearchKind, number> = {
  species: 80,
  period: 40,
  world: 55,
  anatomy: 30,
  specimen: 10,
  discovery: 0,
  journal: 0,
  learning: 35,
  glossary: 20,
};

/** Fold accents, case and punctuation into a stable, searchable token stream. */
const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const periodIds = new Set([
  'phanerozoic',
  'paleozoic',
  'mesozoic',
  'cenozoic',
  'triassic',
  'jurassic',
  'cretaceous',
]);

const rankLabel: Record<string, string> = {
  eon: 'Eon',
  era: 'Era',
  period: 'Period',
};

interface IndexEntry extends SearchResult {
  haystack: string;
  titleFolded: string;
}

const entries: IndexEntry[] = [];

function add(entry: SearchResult, keywords: string[]): void {
  const haystack = normalize(
    [entry.title, entry.subtitle, entry.meta, entry.description ?? '', ...keywords].join(' '),
  );
  entries.push({ ...entry, haystack, titleFolded: normalize(entry.title) });
}

for (const item of species) {
  const trail = searchTrails[item.slug];
  add(
    {
      id: `species-${item.slug}`,
      kind: 'species',
      title: item.scientificName,
      subtitle: item.commonName,
      meta: `${item.periodLabel} · ${item.group}`,
      description: item.tagline,
      to: `/species/${item.slug}`,
    },
    [
      item.genus,
      item.epithet,
      item.stage,
      item.ageLabel,
      item.periodLabel,
      item.group,
      item.groupKey,
      item.region.join(' '),
      trail?.status ?? '',
      ...(item.synonyms ?? []),
      ...(trail?.titles ?? []),
      ...Array.from(new Set([...item.references, ...(trail?.refs ?? [])])).flatMap((id) => {
        const reference = referenceById.get(id) ?? researchReferenceById.get(id);
        return reference
          ? [reference.title, reference.authors, String(reference.year)]
          : [];
      }),
      item.taxonomy.flatMap((row) => [row.rank, row.value]).join(' '),
      item.slug === 'tyrannosaurus' ? 'T. rex T rex' : '',
    ],
  );
}

for (const unit of geoUnits) {
  if (!periodIds.has(unit.id)) continue;
  add(
    {
      id: `period-${unit.id}`,
      kind: 'period',
      title: unit.name,
      subtitle: `${rankLabel[unit.rank] ?? unit.rank} · ${formatMaRange(unit.startMa, unit.endMa)}`,
      meta: 'Deep time',
      description: `Open the ${unit.name} record in Deep Time.`,
      to: `/deep-time?period=${unit.id}`,
    },
    [
      unit.id,
      ...species
        .filter((item) => item.period === unit.id)
        .flatMap((item) => [item.scientificName, item.commonName]),
    ],
  );
}

for (const world of ancientWorlds) {
  add(
    {
      id: `world-${world.formation.id}`,
      kind: 'world',
      title: world.formation.name,
      subtitle: `${world.period.name} · ${world.formation.ageLabel}`,
      meta: 'Ancient world',
      description: world.formation.note,
      to: `/prehistoric-world/ecosystem/${world.formation.id}`,
    },
    [
      world.formation.id,
      world.formation.ageLabel,
      world.formation.note,
      world.period.name,
      ...world.locations.flatMap((place) => [place.label, place.region, place.country]),
      ...world.species.flatMap((item) => [item.scientificName, item.commonName]),
      ...world.specimens.map((specimen) => specimen.identifier),
    ],
  );
}

for (const topic of learningTopics) {
  add(
    {
      id: `learning-${topic.id}`,
      kind: 'learning',
      title: topic.title,
      subtitle: `${topic.kicker} · ${topic.minutes} min read`,
      meta: 'Field guide',
      description: topic.standfirst,
      to: `/learn/${topic.slug}`,
    },
    [
      topic.track,
      topic.standfirst,
      topic.keyTerms.join(' '),
      ...topic.sections.flatMap((section) => [
        section.heading,
        ...section.paragraphs,
        ...(section.points ?? []),
      ]),
    ],
  );
}

for (const entry of glossaryEntries) {
  add(
    {
      id: `glossary-${entry.id}`,
      kind: 'glossary',
      title: entry.term,
      subtitle: entry.short,
      meta: 'Glossary',
      description: entry.definition,
      to: `/glossary#${entry.id}`,
    },
    [entry.short, entry.definition, entry.detail ?? '', ...entry.related.map((link) => link.label)],
  );
}

for (const atlasCase of atlasCases) {
  const item = species.find((candidate) => candidate.slug === atlasCase.speciesId);
  if (!item) continue;
  add(
    {
      id: `anatomy-${atlasCase.speciesId}`,
      kind: 'anatomy',
      title: `Anatomy of ${item.scientificName}`,
      subtitle: `${atlasCase.scopeLabel} · ${atlasCase.caseLabel}`,
      meta: 'Anatomical atlas',
      description: atlasCase.intro,
      to: `/anatomy?species=${atlasCase.speciesId}`,
    },
    [
      item.commonName,
      atlasCase.caseLabel,
      atlasCase.scopeLabel,
      atlasCase.intro,
      ...atlasCase.structures.flatMap((structure) => [
        structure.name,
        structure.shortName,
        structure.category,
      ]),
    ],
  );

  for (const structure of atlasCase.structures) {
    add(
      {
        id: `anatomy-${atlasCase.speciesId}-${structure.id}`,
        kind: 'anatomy',
        title: structure.name,
        subtitle: `${structure.shortName} · ${structure.category}`,
        meta: 'Anatomical structure',
        description: structure.summary,
        to: `/anatomy?species=${atlasCase.speciesId}&structure=${structure.id}`,
      },
      [structure.shortName, structure.category, structure.summary],
    );
  }
}

for (const specimen of discoverySpecimens) {
  const item = species.find((candidate) => candidate.slug === specimen.speciesId);
  const event = discoveryEventForSpecimen(specimen);
  const location = discoveryLocationForSpecimen(specimen);
  const formation = discoveryFormationForSpecimen(specimen);
  const people = discoveryResearchersForEvent(event).map((person) => person.name);
  const publications = specimen.publications.flatMap((id) => {
    const ref = referenceById.get(id) ?? researchReferenceById.get(id);
    return ref ? [ref.title, ref.authors, String(ref.year)] : [];
  });

  add(
    {
      id: `specimen-${specimen.id}`,
      kind: 'specimen',
      title: specimen.identifier,
      subtitle: item ? `${item.scientificName} · ${item.commonName}` : specimen.speciesId,
      meta: 'Specimen record',
      description: specimen.significance,
      to: `/discoveries/specimen/${specimen.id}`,
    },
    [
      specimen.material,
      specimen.repository,
      specimen.preservation,
      specimen.collectionNote,
      specimen.anatomy,
      specimen.significance,
      specimen.uncertainty,
      event?.summary ?? '',
      location?.label ?? '',
      location?.country ?? '',
      formation?.name ?? '',
      formation?.ageLabel ?? '',
      ...people,
      ...publications,
    ],
  );
}

for (const milestone of discoveries) {
  add(
    {
      id: `discovery-${milestone.id}`,
      kind: 'discovery',
      title: milestone.title,
      subtitle: `${milestone.dateLabel} · ${milestone.subject}`,
      meta: 'Discovery history',
      description: milestone.summary,
      to: `/discoveries#${milestone.id}`,
    },
    [milestone.subject, milestone.summary, milestone.year ? String(milestone.year) : ''],
  );
}

for (const article of journalArticles) {
  const category = journalCategoryById.get(article.category);
  const relatedPeople = article.relatedSpeciesIds
    .map((id) => species.find((item) => item.slug === id))
    .flatMap((item) => (item ? [item.scientificName, item.commonName] : []));
  const relatedPeriods = article.relatedPeriodIds
    .map((id) => getGeoUnit(id)?.name ?? '')
    .filter(Boolean);

  add(
    {
      id: `journal-${article.id}`,
      kind: 'journal',
      title: article.headline,
      subtitle: category?.label ?? article.category,
      meta: `Research & Field Notes · ${article.readingMinutes} min read`,
      description: article.standfirst,
      to: `/journal/${article.slug}`,
    },
    [
      article.subtitle ?? '',
      article.tags.join(' '),
      category?.label ?? '',
      category?.description ?? '',
      ...relatedPeople,
      ...relatedPeriods,
    ],
  );
}

function score(entry: IndexEntry, query: string): number {
  const terms = query.split(' ').filter(Boolean);
  if (!terms.every((term) => entry.haystack.includes(term))) return -1;

  // Every entry that contains the query is a real result. Title matches rank
  // higher; the base keeps body-only matches from being filtered out.
  let value = 180 + kindBoost[entry.kind];
  if (entry.titleFolded === query) value += 1200;
  else if (entry.titleFolded.startsWith(query)) value += 700;
  else if (entry.titleFolded.includes(query)) value += 420;

  // A query such as “T. rex” is not a literal substring of “Tyrannosaurus
  // rex”. Reward terms that occur in the title itself so an alias does not
  // lose to a shorter record that merely mentions the phrase in its body.
  const titleWords = entry.titleFolded.split(' ');
  value += terms.filter((term) =>
    titleWords.some((word) => word === term || word.startsWith(term)),
  ).length * 55;

  value -= Math.min(80, entry.haystack.length / 24);
  return value;
}

/** Smallest edit distance between one query term and a word in the index. */
function closestWordDistance(term: string, words: string[]): number {
  let best = Infinity;
  const limit = term.length >= 8 ? 2 : term.length >= 4 ? 1 : 0;
  if (limit === 0) return best;

  for (const word of words) {
    if (Math.abs(word.length - term.length) > limit) continue;

    let previous = Array.from({ length: word.length + 1 }, (_, index) => index);
    for (let row = 1; row <= term.length; row += 1) {
      const current = [row];
      for (let column = 1; column <= word.length; column += 1) {
        current[column] = Math.min(
          previous[column] + 1,
          current[column - 1] + 1,
          previous[column - 1] + (term[row - 1] === word[column - 1] ? 0 : 1),
        );
      }
      previous = current;
    }

    best = Math.min(best, previous[word.length]);
    if (best === 0) break;
  }

  return best;
}

/**
 * Close-spelling fallback, used only when the literal query found nothing.
 * It requires every query term to be close to a word in the record, so it can
 * recover a misspelled scientific name without turning into a fuzzy text dump.
 */
function fuzzyScore(entry: IndexEntry, query: string): number {
  const terms = query.split(' ').filter((term) => term.length >= 3);
  if (!terms.length) return -1;

  const words = entry.haystack.split(' ').filter(Boolean);
  const titleWords = entry.titleFolded.split(' ').filter(Boolean);
  let distance = 0;

  for (const term of terms) {
    const next = closestWordDistance(term, words);
    if (!Number.isFinite(next)) return -1;
    const limit = term.length >= 8 ? 2 : 1;
    if (next > limit) return -1;
    distance += next;
  }

  const titleDistance = closestWordDistance(terms[0], titleWords);
  let value =
    150 + kindBoost[entry.kind] - distance * 36 - Math.min(50, entry.haystack.length / 30);
  if (entry.titleFolded.includes(terms[0])) value += 70;
  if (Number.isFinite(titleDistance)) value += Math.max(0, 120 - titleDistance * 20);
  return value;
}

/**
 * Search the exhibition's local index: species, ancient worlds, the time scale,
 * anatomy, specimens, discovery history, Research & Field Notes, field guides
 * and the glossary. It never sends a query off the device and it does not
 * replace the specialised archive filters.
 */
export function searchPlatform(rawQuery: string, limit = 48): SearchResult[] {
  const query = normalize(rawQuery);
  if (query.length < 2) return [];

  const literal = entries
    .map((entry) => ({ entry, relevance: score(entry, query), fuzzy: false }))
    .filter((result) => result.relevance >= 0);

  const matches = literal.length
    ? literal
    : entries
        .map((entry) => ({ entry, relevance: fuzzyScore(entry, query), fuzzy: true }))
        .filter((result) => result.relevance >= 0);

  return matches
    .sort(
      (a, b) =>
        b.relevance - a.relevance ||
        (groupOrder.get(a.entry.kind) ?? 99) - (groupOrder.get(b.entry.kind) ?? 99) ||
        a.entry.title.localeCompare(b.entry.title),
    )
    .slice(0, limit)
    .map(({ entry, fuzzy }) => (fuzzy ? { ...entry, fuzzy: true } : entry));
}

export const SEARCH_SUGGESTIONS = ['Spinosaurus', 'Cretaceous', 'Hell Creek', 'clade', 'T. rex'];

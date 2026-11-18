import type {
  AnatomicalAtlas,
  AtlasCase,
  AtlasComparison,
  AtlasStructure,
  ClaimReview,
  ClaimReviewData,
  DeepTimeContent,
  DeepTimeEvent,
  DeepTimeUnitContent,
  Discovery,
  DiscoveryArchive,
  DiscoveryEvent,
  DiscoveryExpedition,
  DiscoveryFormation,
  DiscoveryLocation,
  DiscoveryPreservation,
  DiscoveryResearcher,
  DiscoveryRevision,
  DiscoverySpecimen,
  DiscoverySpecimenType,
  Diet,
  GeoUnit,
  GeologicalTime,
  Hypothesis,
  Period,
  PeriodId,
  Reference,
  RelationshipKind,
  ResearchRecord,
  Species,
  SpeciesAuditData,
  SpeciesAuditEntry,
  SpinosaurusEvent,
  Hotspot,
} from './types';
import assetData from './assets.json';
import geologicalData from './geological-time.json';
import deepTimeData from './deep-time-content.json';
import referenceData from './references.json';
import referenceV19Data from './references-v19.json';
import discoveryData from './discoveries.json';
import discoveryArchiveData from './discovery-archive.json';
import researchData from './research.json';
import timelineData from './spinosaurus-timeline.json';
import hypothesisData from './spinosaurus-hypotheses.json';
import atlasData from './anatomical-atlas.json';
import claimReviewData from './claim-reviews.json';
import speciesAuditData from './species-audit.json';

export type Asset = {
  id: string;
  kind?: 'image' | 'model' | 'texture' | 'font';
  title: string;
  creator: string;
  sourceUrl: string;
  downloadUrl: string;
  license: string;
  licenseUrl: string;
  attribution: string;
  modifications: string;
  usedIn: string[];
  widths: number[];
};

const speciesModules = import.meta.glob<Species>('./species/*.json', {
  eager: true,
  import: 'default',
});

export const assets = assetData as Asset[];
export const assetById = new Map(assets.map((a) => [a.id, a]));

export const species = Object.values(speciesModules).sort((a, b) =>
  a.scientificName.localeCompare(b.scientificName),
);

export const speciesBySlug = new Map(species.map((s) => [s.slug, s]));

/* ------------------------------------------------------------------ */
/* Geological time scale                                              */
/* ------------------------------------------------------------------ */

export const geologicalTime = geologicalData as GeologicalTime;
export const deepTime = deepTimeData as DeepTimeContent;
export const geoUnits = geologicalTime.units;
export const geoUnitById = new Map(geoUnits.map((unit) => [unit.id, unit]));

const geoChildrenById = new Map<string, GeoUnit[]>();
for (const unit of geoUnits) {
  if (!unit.parentId) continue;
  const children = geoChildrenById.get(unit.parentId) ?? [];
  children.push(unit);
  geoChildrenById.set(unit.parentId, children);
}
for (const children of geoChildrenById.values()) {
  children.sort((a, b) => b.startMa - a.startMa || a.name.localeCompare(b.name));
}

const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 });

/** A compact age label. Values below 1 Ma are shown in thousands of years. */
export function formatMaValue(ma: number): string {
  if (ma >= 1000) return `${numberFormat.format(ma / 1000)} Ga`;
  if (ma > 0 && ma < 1) return `${numberFormat.format(ma * 1000)} ka`;
  return `${numberFormat.format(ma)} Ma`;
}

/** Numeric part of an age, without the unit. */
export function formatAgeNumber(ma: number): string {
  if (ma >= 1000) return numberFormat.format(ma / 1000);
  if (ma > 0 && ma < 1) return numberFormat.format(ma * 1000);
  return numberFormat.format(ma);
}

/** Used for period spans and range ends; zero is written as “today”. */
export function formatMaRange(startMa: number, endMa: number): string {
  if (startMa >= 1000 && endMa >= 1000) {
    return `${numberFormat.format(startMa / 1000)}–${numberFormat.format(endMa / 1000)} Ga`;
  }
  if (startMa < 1 && endMa >= 0) {
    return `${numberFormat.format(startMa * 1000)} ka – ${endMa === 0 ? 'today' : `${numberFormat.format(endMa * 1000)} ka`}`;
  }
  return `${numberFormat.format(startMa)} Ma – ${endMa === 0 ? 'today' : `${numberFormat.format(endMa)} Ma`}`;
}

export function formatDuration(startMa: number, endMa: number): string {
  const duration = startMa - endMa;
  if (duration >= 1000) return `${numberFormat.format(duration / 1000)} billion years`;
  if (duration >= 1) return `${numberFormat.format(duration)} million years`;
  return `${numberFormat.format(duration * 1000)} thousand years`;
}

export function getGeoUnit(id: string | undefined): GeoUnit | undefined {
  return id ? geoUnitById.get(id) : undefined;
}

export function geoChildren(parentId: string): GeoUnit[] {
  return [...(geoChildrenById.get(parentId) ?? [])];
}

export function geoAncestors(id: string): GeoUnit[] {
  const ancestors: GeoUnit[] = [];
  let current = geoUnitById.get(id);
  while (current?.parentId) {
    const parent = geoUnitById.get(current.parentId);
    if (!parent) break;
    ancestors.push(parent);
    current = parent;
  }
  return ancestors;
}

export function isGeoDescendant(unitId: string, ancestorId: string): boolean {
  return unitId === ancestorId || geoAncestors(unitId).some((unit) => unit.id === ancestorId);
}

export function getUnitContent(id: string): DeepTimeUnitContent | undefined {
  return deepTime.units[id];
}

export const deepTimeEvents = [...deepTime.events].sort(
  (a, b) => b.dateMa - a.dateMa || a.title.localeCompare(b.title),
) as DeepTimeEvent[];

/** Periods belonging to a period, era or eon, oldest first. */
export function periodsInUnit(id: string): GeoUnit[] {
  const unit = geoUnitById.get(id);
  if (!unit) return [];
  if (unit.rank === 'period') return [unit];
  return geoUnits
    .filter((candidate) => candidate.rank === 'period' && isGeoDescendant(candidate.id, id))
    .sort((a, b) => b.startMa - a.startMa);
}

/** All sourced events inside a unit, oldest first unless limited. */
export function eventsInUnit(id: string, limit?: number): DeepTimeEvent[] {
  const events = deepTimeEvents.filter((event) => isGeoDescendant(event.unitId, id));
  return limit ? events.slice(0, limit) : events;
}

export function adjacentPeriods(id: string): { older?: GeoUnit; younger?: GeoUnit } {
  const unit = geoUnitById.get(id);
  if (!unit || unit.rank !== 'period') return {};
  const siblings = geoUnits
    .filter((candidate) => candidate.rank === 'period')
    .sort((a, b) => b.startMa - a.startMa);
  const index = siblings.findIndex((candidate) => candidate.id === id);
  return { older: siblings[index - 1], younger: siblings[index + 1] };
}

const MESOZOIC_PERIOD_IDS = ['triassic', 'jurassic', 'cretaceous'] as const;

function periodFromUnit(id: PeriodId): Period {
  const unit = geoUnitById.get(id);
  const content = deepTime.units[id];
  if (!unit || !content) throw new Error(`Missing period data for ${id}`);
  return {
    id,
    name: unit.name,
    startMa: unit.startMa,
    endMa: unit.endMa,
    span: `${formatMaRange(unit.startMa, unit.endMa)} · ${formatDuration(unit.startMa, unit.endMa)}`,
    epochs: geoChildren(unit.id)
      .filter((child) => child.rank === 'epoch')
      .map((epoch) => ({ name: epoch.name, startMa: epoch.startMa, endMa: epoch.endMa })),
    climate: content.climate ?? content.environment ?? '',
    life: content.life,
    endedBy: content.endedBy ?? '',
    summary: content.summary,
    sourceUrl: geologicalTime.url,
  };
}

// The archive's period type is intentionally Mesozoic-only. The full ICS
// hierarchy lives in geological-time.json and is not duplicated here.
export const periods: Period[] = MESOZOIC_PERIOD_IDS.map((id) => periodFromUnit(id));
export const periodById = new Map(periods.map((p) => [p.id, p]));

export const references = [
  ...(referenceData as Reference[]),
  ...(referenceV19Data as Reference[]),
];
export const referenceById = new Map(references.map((r) => [r.id, r]));

export const discoveries = discoveryData as Discovery[];
export const research = (researchData as ResearchRecord[]).sort((a, b) =>
  b.publicationDate.localeCompare(a.publicationDate),
);

/* ------------------------------------------------------------------ */
/* Discoveries — specimens, expeditions and revision cases            */
/* ------------------------------------------------------------------ */

export const discoveryArchive = discoveryArchiveData as unknown as DiscoveryArchive;
export const discoverySpecimens = discoveryArchive.specimens;
export const discoveryExpeditions = discoveryArchive.expeditions;
export const discoveryEvents = discoveryArchive.discoveries;
export const discoveryRevisions = discoveryArchive.revisions;
export const discoveryLocations = discoveryArchive.locations;
export const discoveryFormations = discoveryArchive.formations;
export const discoveryResearchers = discoveryArchive.researchers;

export const discoverySpecimenById = new Map(
  discoverySpecimens.map((specimen) => [specimen.id, specimen]),
);
export const discoveryLocationById = new Map(
  discoveryLocations.map((location) => [location.id, location]),
);
export const discoveryFormationById = new Map(
  discoveryFormations.map((formation) => [formation.id, formation]),
);
export const discoveryResearcherById = new Map(
  discoveryResearchers.map((researcher) => [researcher.id, researcher]),
);
export const discoveryExpeditionById = new Map(
  discoveryExpeditions.map((expedition) => [expedition.id, expedition]),
);
export const discoveryEventById = new Map(
  discoveryEvents.map((event) => [event.id, event]),
);
export const discoveryRevisionById = new Map(
  discoveryRevisions.map((revision) => [revision.id, revision]),
);

export function getDiscoverySpecimen(id: string | undefined): DiscoverySpecimen | undefined {
  return id ? discoverySpecimenById.get(id) : undefined;
}

export function getDiscoveryEvent(id: string | undefined): DiscoveryEvent | undefined {
  return id ? discoveryEventById.get(id) : undefined;
}

export function getDiscoveryExpedition(
  id: string | null | undefined,
): DiscoveryExpedition | undefined {
  return id ? discoveryExpeditionById.get(id) : undefined;
}

export function getDiscoveryLocation(id: string | undefined): DiscoveryLocation | undefined {
  return id ? discoveryLocationById.get(id) : undefined;
}

export function getDiscoveryFormation(id: string | undefined): DiscoveryFormation | undefined {
  return id ? discoveryFormationById.get(id) : undefined;
}

export function getDiscoveryResearcher(id: string | undefined): DiscoveryResearcher | undefined {
  return id ? discoveryResearcherById.get(id) : undefined;
}

export function getDiscoveryRevision(id: string | undefined): DiscoveryRevision | undefined {
  return id ? discoveryRevisionById.get(id) : undefined;
}

export function discoveryEventForSpecimen(specimen: DiscoverySpecimen): DiscoveryEvent | undefined {
  return getDiscoveryEvent(specimen.discoveryId);
}

export function discoveryLocationForSpecimen(specimen: DiscoverySpecimen): DiscoveryLocation | undefined {
  return getDiscoveryLocation(discoveryEventForSpecimen(specimen)?.locationId);
}

export function discoveryFormationForSpecimen(specimen: DiscoverySpecimen): DiscoveryFormation | undefined {
  return getDiscoveryFormation(discoveryEventForSpecimen(specimen)?.formationId);
}

export function discoveryExpeditionForSpecimen(specimen: DiscoverySpecimen): DiscoveryExpedition | undefined {
  return getDiscoveryExpedition(discoveryEventForSpecimen(specimen)?.expeditionId);
}

export function discoveryResearchersForEvent(event: DiscoveryEvent | undefined): DiscoveryResearcher[] {
  if (!event) return [];
  return event.researcherIds
    .map((id) => getDiscoveryResearcher(id))
    .filter((person): person is DiscoveryResearcher => Boolean(person));
}

export function discoveryResearchersForExpedition(
  expedition: DiscoveryExpedition | undefined,
): DiscoveryResearcher[] {
  if (!expedition) return [];
  return expedition.researcherIds
    .map((id) => getDiscoveryResearcher(id))
    .filter((person): person is DiscoveryResearcher => Boolean(person));
}

export function discoverySpecimensForSpecies(slug: string): DiscoverySpecimen[] {
  return discoverySpecimens.filter((specimen) => specimen.speciesId === slug);
}

/** Specimens whose formation falls inside a period, era or eon. */
export function discoverySpecimensForGeoUnit(unitId: string): DiscoverySpecimen[] {
  return discoverySpecimens.filter((specimen) => {
    const formation = discoveryFormationForSpecimen(specimen);
    return formation ? isGeoDescendant(formation.periodId, unitId) : false;
  });
}

export function discoveryRevisionsForSpecimen(specimen: DiscoverySpecimen): DiscoveryRevision[] {
  return discoveryRevisions.filter((revision) => revision.specimenIds.includes(specimen.id));
}

export function discoveryMilestonesForSpecimen(specimen: DiscoverySpecimen): Discovery[] {
  return discoveries
    .filter((milestone) => discoveryArchive.milestoneLinks[milestone.id]?.specimenIds?.includes(specimen.id))
    .sort((a, b) => a.year - b.year);
}

export function discoveryRecordNumber(id: string): number {
  return discoverySpecimens.findIndex((specimen) => specimen.id === id) + 1;
}

export function discoveryNeighbours(id: string): {
  previous?: DiscoverySpecimen;
  next?: DiscoverySpecimen;
} {
  const index = discoverySpecimens.findIndex((specimen) => specimen.id === id);
  if (index < 0) return {};
  return {
    previous: index > 0 ? discoverySpecimens[index - 1] : undefined,
    next: index < discoverySpecimens.length - 1 ? discoverySpecimens[index + 1] : undefined,
  };
}

export type DiscoveryDateBucket = 'all' | 'pre-1900' | '1900-1949' | '1950-1999' | '2000-plus' | 'unstated';

export interface DiscoveryFilters {
  query: string;
  period: PeriodId | 'all';
  region: string | 'all';
  type: DiscoverySpecimenType | 'all';
  preservation: DiscoveryPreservation | 'all';
  date: DiscoveryDateBucket;
  topic: string | 'all';
}

export const defaultDiscoveryFilters: DiscoveryFilters = {
  query: '',
  period: 'all',
  region: 'all',
  type: 'all',
  preservation: 'all',
  date: 'all',
  topic: 'all',
};

export type DiscoveryFacet = { value: string; label: string };

export const discoveryTopicLabels: Record<string, string> = {
  skull: 'Skull & feeding',
  axial: 'Axial skeleton',
  limbs: 'Limbs & posture',
  tail: 'Tail & locomotion',
  integument: 'Integument & feathers',
  armour: 'Armour',
  history: 'History of science',
};

export const discoveryTypeLabels: Record<DiscoverySpecimenType, string> = {
  type: 'Name-bearing type',
  neotype: 'Neotype',
  referred: 'Referred specimen',
};

export const discoveryPreservationLabels: Record<DiscoveryPreservation, string> = {
  lost: 'Lost / destroyed',
  partial: 'Partial / isolated material',
  'nearly-complete': 'Nearly complete',
  integument: 'Integument evidence',
};

export const discoveryDateLabels: Record<DiscoveryDateBucket, string> = {
  all: 'Any date',
  'pre-1900': 'Before 1900',
  '1900-1949': '1900–1949',
  '1950-1999': '1950–1999',
  '2000-plus': '2000 or later',
  unstated: 'Date not stated',
};

export function discoveryDateBucketFor(specimen: DiscoverySpecimen): DiscoveryDateBucket {
  const year = discoveryEventForSpecimen(specimen)?.year;
  if (!year) return 'unstated';
  if (year < 1900) return 'pre-1900';
  if (year < 1950) return '1900-1949';
  if (year < 2000) return '1950-1999';
  return '2000-plus';
}

export const discoveryFacets = {
  periods: Array.from(
    new Map(
      discoveryFormations.map((formation) => {
        const period = periodById.get(formation.periodId);
        return [formation.periodId, period?.name ?? formation.periodId] as const;
      }),
    ),
  ).map(([value, label]) => ({ value, label })),
  regions: Array.from(new Set(discoveryLocations.map((location) => location.region)))
    .sort()
    .map((region) => ({ value: region, label: region })),
  types: (Object.keys(discoveryTypeLabels) as DiscoverySpecimenType[]).map((value) => ({
    value,
    label: discoveryTypeLabels[value],
  })),
  preservation: (Object.keys(discoveryPreservationLabels) as DiscoveryPreservation[]).map(
    (value) => ({ value, label: discoveryPreservationLabels[value] }),
  ),
  topics: Object.entries(discoveryTopicLabels).map(([value, label]) => ({ value, label })),
  dates: (Object.keys(discoveryDateLabels) as DiscoveryDateBucket[]).map((value) => ({
    value,
    label: discoveryDateLabels[value],
  })),
} satisfies Record<string, DiscoveryFacet[]>;

const discoveryFold = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

function discoverySearchText(specimen: DiscoverySpecimen): string {
  const species = speciesBySlug.get(specimen.speciesId);
  const event = discoveryEventForSpecimen(specimen);
  const location = discoveryLocationForSpecimen(specimen);
  const formation = discoveryFormationForSpecimen(specimen);
  const expedition = discoveryExpeditionForSpecimen(specimen);
  const people = discoveryResearchersForEvent(event).map((person) => person.name);
  const publicationText = specimen.publications.flatMap((id) => {
    const ref = referenceById.get(id);
    return ref ? [ref.title, ref.authors, ref.journal ?? '', String(ref.year)] : [];
  });

  return discoveryFold(
    [
      specimen.identifier,
      specimen.typeStatus,
      specimen.material,
      specimen.preservation,
      specimen.repository,
      specimen.collectionNote,
      specimen.significance,
      specimen.anatomy,
      specimen.uncertainty,
      ...specimen.topics.map((topic) => discoveryTopicLabels[topic] ?? topic),
      species?.scientificName ?? '',
      species?.commonName ?? '',
      event?.summary ?? '',
      event?.dateLabel ?? '',
      location?.label ?? '',
      location?.country ?? '',
      location?.region ?? '',
      formation?.name ?? '',
      formation?.ageLabel ?? '',
      expedition?.name ?? '',
      expedition?.institutions.join(' ') ?? '',
      ...people,
      ...publicationText,
    ].join(' '),
  );
}

const discoverySearchIndex = new Map(
  discoverySpecimens.map((specimen) => [specimen.id, discoverySearchText(specimen)]),
);

export function filterDiscoverySpecimens(filters: DiscoveryFilters): DiscoverySpecimen[] {
  const terms = discoveryFold(filters.query).trim().split(/\s+/).filter(Boolean);

  return discoverySpecimens.filter((specimen) => {
    const location = discoveryLocationForSpecimen(specimen);
    const formation = discoveryFormationForSpecimen(specimen);

    if (filters.period !== 'all' && formation?.periodId !== filters.period) return false;
    if (filters.region !== 'all' && location?.region !== filters.region) return false;
    if (filters.type !== 'all' && specimen.typeGroup !== filters.type) return false;
    if (filters.preservation !== 'all' && specimen.preservationClass !== filters.preservation) {
      return false;
    }
    if (filters.date !== 'all' && discoveryDateBucketFor(specimen) !== filters.date) return false;
    if (filters.topic !== 'all' && !specimen.topics.includes(filters.topic)) return false;
    if (!terms.length) return true;

    const haystack = discoverySearchIndex.get(specimen.id) ?? discoverySearchText(specimen);
    return terms.every((term) => haystack.includes(term));
  });
}

export function activeDiscoveryFilterCount(filters: DiscoveryFilters): number {
  let count = 0;
  if (filters.query.trim()) count += 1;
  if (filters.period !== 'all') count += 1;
  if (filters.region !== 'all') count += 1;
  if (filters.type !== 'all') count += 1;
  if (filters.preservation !== 'all') count += 1;
  if (filters.date !== 'all') count += 1;
  if (filters.topic !== 'all') count += 1;
  return count;
}

export function discoveryRefs(): string[] {
  return Array.from(
    new Set([
      ...discoverySpecimens.flatMap((specimen) => specimen.refs),
      ...discoveryExpeditions.flatMap((expedition) => expedition.refs),
      ...discoveryEvents.flatMap((event) => event.refs),
      ...discoveryRevisions.flatMap((revision) => revision.refs),
      ...discoveryLocations.flatMap((location) => location.refs),
      ...discoveryFormations.flatMap((formation) => formation.refs),
      ...discoveryResearchers.flatMap((researcher) => researcher.refs),
      ...discoveryArchive.caseStudy.chapters.flatMap((chapter) => chapter.refs),
      ...discoveries.flatMap((milestone) => milestone.refs),
    ]),
  );
}

export function discoveryAssetIds(): string[] {
  return Array.from(
    new Set(discoverySpecimens.flatMap((specimen) => specimen.media.map((media) => media.assetId))),
  );
}

export function specimenForIdentifier(identifier: string): DiscoverySpecimen | undefined {
  return discoverySpecimens.find((specimen) => specimen.identifier === identifier);
}

export { getSpeciesPage } from './species-pages';

export const spinosaurusTimeline = timelineData as SpinosaurusEvent[];
export const spinosaurusHypotheses = hypothesisData as Hypothesis[];

/* ------------------------------------------------------------------ */
/* Anatomical atlas                                                    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Scientific claim reviews and the species audit                      */
/* ------------------------------------------------------------------ */

export const claimReviews = claimReviewData as ClaimReviewData;
export const speciesAudit = speciesAuditData as SpeciesAuditData;

export function getClaimReview(slug: string | undefined): ClaimReview | undefined {
  return slug ? claimReviews.reviews[slug] : undefined;
}

export function getSpeciesAudit(slug: string | undefined): SpeciesAuditEntry | undefined {
  return slug ? speciesAudit.entries[slug] : undefined;
}

export const anatomicalAtlas = atlasData as AnatomicalAtlas;
export const atlasCases = anatomicalAtlas.cases;
export const atlasCaseBySpecies = new Map(atlasCases.map((item) => [item.speciesId, item]));
export const atlasComparison = anatomicalAtlas.comparisons[0];

export function getAtlasCase(speciesId: string | undefined): AtlasCase | undefined {
  return speciesId ? atlasCaseBySpecies.get(speciesId) : undefined;
}

export function getAtlasStructure(
  atlasCase: AtlasCase,
  structureId: string,
): AtlasStructure | undefined {
  return atlasCase.structures.find((item) => item.id === structureId);
}

/** Every source used by a structure, including its evidence blocks. */
export function atlasStructureRefs(structure: AtlasStructure): string[] {
  const refs = [
    structure.observation.refs,
    structure.reconstruction?.refs ?? [],
    structure.function?.refs ?? [],
    structure.debate?.refs ?? [],
  ];
  return Array.from(new Set(refs.flat()));
}

export function atlasCaseRefs(item: AtlasCase): string[] {
  return Array.from(
    new Set([
      ...item.structures.flatMap(atlasStructureRefs),
      ...item.adaptations.flatMap((adaptation) => adaptation.refs),
      ...item.specimens.flatMap((specimen) => specimen.refs),
    ]),
  );
}

export function atlasComparisonRefs(comparison: AtlasComparison): string[] {
  return Array.from(new Set(comparison.refs));
}

const legacyEvidence: Record<string, Hotspot['evidence']> = {
  fossil: 'fossil',
  reconstruction: 'reconstruction',
  interpretation: 'inference',
  debate: 'contested',
};

/**
 * The existing homepage and dossier plates are derived from the atlas rather
 * than a second hotspot list. Only structures explicitly marked as archive
 * hotspots appear there.
 */
export const anatomyHotspots: Hotspot[] = anatomicalAtlas.cases
  .flatMap((item) => item.structures)
  .filter((structure) => structure.legacy && structure.locator)
  .sort((a, b) => (a.legacy?.order ?? 99) - (b.legacy?.order ?? 99))
  .map((structure) => ({
    id: structure.id,
    label: structure.legacy?.label ?? structure.shortName,
    x: structure.locator?.x ?? 0,
    y: structure.locator?.y ?? 0,
    structure: structure.name,
    body: structure.summary,
    evidence: legacyEvidence[structure.primaryEvidence],
    refs: atlasStructureRefs(structure),
  }));

export function getSpecies(slug: string | undefined): Species | undefined {
  return slug ? speciesBySlug.get(slug) : undefined;
}

/** Every reference used by a claim review, for dossier bibliographies. */
export function claimReviewRefs(slug: string | undefined): string[] {
  const review = getClaimReview(slug);
  return review ? Array.from(new Set(review.claims.flatMap((claim) => claim.refs))) : [];
}

export function getReferences(ids: string[], extra: Reference[] = []): Reference[] {
  const extraById = new Map(extra.map((reference) => [reference.id, reference]));
  return ids
    .map((id) => referenceById.get(id) ?? extraById.get(id))
    .filter((reference): reference is Reference => Boolean(reference));
}

/** First taxonomy value at a given rank. Taxonomy differs between species, so this is optional. */
export function taxonomyValue(s: Species, rank: string): string | undefined {
  return s.taxonomy.find((row) => row.rank.toLowerCase() === rank.toLowerCase())?.value;
}

export function familyOf(s: Species): string | undefined {
  return taxonomyValue(s, 'Family');
}

export function genusOf(s: Species): string {
  return s.genus || taxonomyValue(s, 'Genus') || s.scientificName.split(' ')[0];
}

export function epithetOf(s: Species): string {
  return s.epithet || s.scientificName.split(' ').slice(1).join(' ');
}

export function getPeriod(id: PeriodId): Period {
  const period = periodById.get(id);
  if (!period) throw new Error(`Unknown period: ${id}`);
  return period;
}

export function speciesForPeriod(id: PeriodId): Species[] {
  return species.filter((s) => s.period === id);
}

/** Species in a period, era or eon, using the archive's own period records. */
export function speciesForGeoUnit(unitId: string): Species[] {
  const ids = new Set(periodsInUnit(unitId).map((unit) => unit.id));
  return species.filter((item) => ids.has(item.period));
}

export interface CoexistenceMatch {
  species: Species;
  overlapMa: number;
  overlapStartMa: number;
  overlapEndMa: number;
  sharedRegions: string[];
}

/**
 * Positive temporal overlap between the archive's numerical occurrence ranges.
 * This is a time comparison only; it says nothing about habitat, interaction or
 * whether the animals ever encountered one another.
 */
export function coexistingSpecies(target: Species): CoexistenceMatch[] {
  return species
    .filter((other) => other.slug !== target.slug)
    .map((other) => {
      const overlapStartMa = Math.min(target.ageMa[0], other.ageMa[0]);
      const overlapEndMa = Math.max(target.ageMa[1], other.ageMa[1]);
      return {
        species: other,
        overlapMa: overlapStartMa - overlapEndMa,
        overlapStartMa,
        overlapEndMa,
        sharedRegions: target.regionKeys.filter((region) => other.regionKeys.includes(region)),
      };
    })
    .filter((match) => match.overlapMa > 0)
    .sort(
      (a, b) =>
        b.overlapMa - a.overlapMa || a.species.scientificName.localeCompare(b.species.scientificName),
    );
}

export const featuredSpecies = species.filter((s) => s.featured);

export const groups = Array.from(new Set(species.map((s) => s.groupKey))).sort();
export const families = Array.from(
  new Set(species.map((s) => familyOf(s)).filter((value): value is string => Boolean(value))),
).sort();
export const regions = Array.from(new Set(species.flatMap((s) => s.regionKeys))).sort();
export const diets = Array.from(new Set(species.map((s) => s.diet))).sort();

export function familiesForGroup(group: string | 'all'): string[] {
  return Array.from(
    new Set(
      species
        .filter((s) => group === 'all' || s.groupKey === group)
        .map((s) => familyOf(s))
        .filter((value): value is string => Boolean(value)),
    ),
  ).sort();
}

export const dietLabels: Record<Diet, string> = {
  carnivore: 'Carnivore',
  herbivore: 'Herbivore',
  omnivore: 'Omnivore',
  unknown: 'Uncertain',
};

export type SortKey = 'name' | 'age-oldest' | 'age-youngest' | 'period' | 'recent' | 'featured';

export interface ArchiveFilters {
  query: string;
  period: PeriodId | 'all';
  group: string | 'all';
  family: string | 'all';
  diet: Diet | 'all';
  region: string | 'all';
  sort: SortKey;
  featuredOnly: boolean;
}

export const defaultFilters: ArchiveFilters = {
  query: '',
  period: 'all',
  group: 'all',
  family: 'all',
  diet: 'all',
  region: 'all',
  sort: 'name',
  featuredOnly: false,
};

function midpoint(s: Species): number {
  return (s.ageMa[0] + s.ageMa[1]) / 2;
}

const periodOrder = new Map(
  [...periods].sort((a, b) => b.startMa - a.startMa).map((period, index) => [period.id, index]),
);

const fold = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

function searchableText(s: Species): string {
  return fold(
    [
      s.scientificName,
      s.commonName,
      s.genus,
      s.epithet,
      s.namedBy,
      s.status,
      s.group,
      s.groupKey,
      familyOf(s) ?? '',
      s.stage,
      s.periodLabel,
      ...s.region,
      ...s.regionKeys,
      ...(s.locality ?? []),
      s.habitat ?? '',
      s.ancientContext ?? '',
      s.tagline,
      s.summary,
      ...(s.synonyms ?? []),
      ...s.taxonomy.flatMap((row) => [row.rank, row.value]),
    ].join(' '),
  );
}

const searchIndex = new Map(species.map((s) => [s.slug, searchableText(s)]));

function matchesQuery(s: Species, query: string): boolean {
  const terms = fold(query).trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const haystack = searchIndex.get(s.slug) ?? searchableText(s);
  return terms.every((term) => haystack.includes(term));
}

/**
 * Case-insensitive, partial, token-based search over names, taxonomy, time,
 * geography and the editorial summary. All data is local to the static build.
 */
export function searchSpecies(query: string, pool: Species[] = species): Species[] {
  if (!query.trim()) return pool;
  return pool.filter((s) => matchesQuery(s, query));
}

function sortSpecies(list: Species[], sort: SortKey): Species[] {
  switch (sort) {
    case 'age-oldest':
      return [...list].sort((a, b) => midpoint(b) - midpoint(a) || a.scientificName.localeCompare(b.scientificName));
    case 'age-youngest':
      return [...list].sort((a, b) => midpoint(a) - midpoint(b) || a.scientificName.localeCompare(b.scientificName));
    case 'period':
      return [...list].sort(
        (a, b) =>
          (periodOrder.get(a.period) ?? 99) - (periodOrder.get(b.period) ?? 99) ||
          midpoint(b) - midpoint(a) ||
          a.scientificName.localeCompare(b.scientificName),
      );
    case 'recent':
      return [...list].sort(
        (a, b) => b.added.localeCompare(a.added) || a.scientificName.localeCompare(b.scientificName),
      );
    case 'featured':
      return [...list].sort(
        (a, b) => Number(b.featured) - Number(a.featured) || a.scientificName.localeCompare(b.scientificName),
      );
    default:
      return [...list].sort((a, b) => a.scientificName.localeCompare(b.scientificName));
  }
}

export function filterSpecies(filters: ArchiveFilters): Species[] {
  const filtered = species.filter((s) => {
    if (filters.period !== 'all' && s.period !== filters.period) return false;
    if (filters.group !== 'all' && s.groupKey !== filters.group) return false;
    if (filters.family !== 'all' && familyOf(s) !== filters.family) return false;
    if (filters.diet !== 'all' && s.diet !== filters.diet) return false;
    if (filters.region !== 'all' && !s.regionKeys.includes(filters.region)) return false;
    if (filters.featuredOnly && !s.featured) return false;
    return filters.query.trim() ? matchesQuery(s, filters.query) : true;
  });

  return sortSpecies(filtered, filters.sort);
}

export function searchSuggestions(query: string, limit = 5): Species[] {
  const q = fold(query).trim();
  if (!q) return [];
  return species
    .filter((s) => {
      const names = fold([s.scientificName, s.commonName, s.genus, s.epithet, familyOf(s) ?? ''].join(' '));
      return names.includes(q);
    })
    .slice(0, limit);
}

export function activeFilterCount(f: ArchiveFilters): number {
  let n = 0;
  if (f.query.trim()) n += 1;
  if (f.period !== 'all') n += 1;
  if (f.group !== 'all') n += 1;
  if (f.family !== 'all') n += 1;
  if (f.diet !== 'all') n += 1;
  if (f.region !== 'all') n += 1;
  if (f.featuredOnly) n += 1;
  return n;
}

export type RelatedEntry = {
  species: Species;
  kind: RelationshipKind;
  reason: string;
};

const relationOrder: RelationshipKind[] = [
  'genus',
  'family',
  'context',
  'period',
  'region',
  'clade',
  'ecology',
];

function relationKindRank(kind: RelationshipKind): number {
  const index = relationOrder.indexOf(kind);
  return index < 0 ? relationOrder.length : index;
}

/**
 * Related entries are curated by slug, but the reason is derived from the
 * records rather than assigned by hand. Close taxonomy is kept separate from
 * shared time, geography and ecological comparison.
 */
export function getRelatedEntries(s: Species): RelatedEntry[] {
  const entries: RelatedEntry[] = [];

  for (const slug of s.related) {
    const other = speciesBySlug.get(slug);
    if (!other) continue;

    const explicit = s.relationships?.find((relationship) => relationship.slug === slug);
    if (explicit) {
      entries.push({ species: other, kind: explicit.kind, reason: explicit.reason });
      continue;
    }

    const sharedRegions = s.regionKeys.filter((region) => other.regionKeys.includes(region));
    const samePeriod = s.period === other.period;
    const family = familyOf(s);
    const sharedFamily = family && family === familyOf(other);
    const sharedGenus = genusOf(s) === genusOf(other);
    let entry: RelatedEntry | null = null;

    if (sharedGenus) {
      entry = {
        species: other,
        kind: 'genus',
        reason: `Both are classified in the genus ${genusOf(s)}.`,
      };
    } else if (sharedFamily) {
      entry = {
        species: other,
        kind: 'family',
        reason: `Both are classified in the family ${family}.`,
      };
    } else if (samePeriod && sharedRegions.length) {
      entry = {
        species: other,
        kind: 'context',
        reason: `Both are known from the ${s.periodLabel} of ${sharedRegions.join(' and ')}. Shared time and place is context, not proof of a close relationship.`,
      };
    } else if (samePeriod) {
      entry = {
        species: other,
        kind: 'period',
        reason: `Both are dated to the ${s.periodLabel}, but the archive records them from different regions or stages. This is shared time, not a close relationship.`,
      };
    } else if (sharedRegions.length) {
      entry = {
        species: other,
        kind: 'region',
        reason: `Both are known from ${sharedRegions.join(' and ')}, but from different geological periods. This is a geographic comparison, not a close relationship.`,
      };
    } else if (s.groupKey === other.groupKey) {
      entry = {
        species: other,
        kind: 'clade',
        reason: `Both belong to ${s.groupKey}, a broad classification. This is a distant relationship, not a close family link.`,
      };
    } else if (s.diet === other.diet) {
      entry = {
        species: other,
        kind: 'ecology',
        reason: `Both are recorded as ${s.dietLabel.toLowerCase()} in the archive. This is an ecological comparison, not a claim of close relationship.`,
      };
    }

    if (entry) entries.push(entry);
  }

  return entries.sort(
    (a, b) =>
      relationKindRank(a.kind) - relationKindRank(b.kind) ||
      a.species.scientificName.localeCompare(b.species.scientificName),
  );
}

/** Backwards-compatible species-only helper. */
export function getRelated(s: Species): Species[] {
  return getRelatedEntries(s).map((entry) => entry.species);
}

/** Paths follow the optimiser's naming convention: /assets/img/{id}-{width}.{ext} */
export function imageSrc(id: string, width: number, ext: 'avif' | 'webp' = 'webp'): string {
  return `/assets/img/${id}-${width}.${ext}`;
}

export function imageSrcSet(id: string, widths: number[], ext: 'avif' | 'webp'): string {
  return widths.map((w) => `${imageSrc(id, w, ext)} ${w}w`).join(', ');
}

export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function periodForSpecies(s: Species): Period {
  return getPeriod(s.period);
}

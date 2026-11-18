export type EvidenceKind =
  | 'fossil'
  | 'reconstruction'
  | 'inference'
  | 'contested'
  | 'unknown';

/**
 * The four claim-level categories used by the scientific review layer. These
 * are deliberately separate from the older section tags: a reconstruction is
 * not a kind of evidence, and “strongly supported” is not a synonym for
 * “directly observed”.
 */
export type ClaimEvidence = 'direct' | 'inference' | 'debate' | 'unknown';

export type ClaimReviewStatus =
  | 'researched-enriched'
  | 'reviewed-no-new-evidence'
  | 'partially-researched'
  | 'requires-verification';

export interface ScientificClaim {
  id: string;
  statement: string;
  evidence: ClaimEvidence;
  refs: string[];
  /** What the source actually establishes, or how far the claim can be pushed. */
  qualification?: string;
  /** Geological or specimen context needed to read the claim correctly. */
  context?: string;
  /** A competing interpretation, stated without resolving it by preference. */
  conflict?: string;
}

export interface ClaimReview {
  species: string;
  status: ClaimReviewStatus;
  reviewed: string;
  scope: string;
  sourcesRead: string[];
  claims: ScientificClaim[];
  gaps: string[];
}

export interface ClaimReviewData {
  version: string;
  updated: string;
  standard: string;
  reviews: Record<string, ClaimReview>;
}

export interface SpeciesAuditEntry {
  status: ClaimReviewStatus | 'protected-existing';
  refs: number;
  trailEntries: number;
  abstractEntries: number;
  fullTextEntries: number;
  genericConfidenceNote: boolean;
  originalDescriptionRef?: string;
  linkedSpecimen: boolean;
  flags: string[];
  note: string;
}

export interface SpeciesAuditData {
  version: string;
  updated: string;
  total: number;
  standard: string;
  entries: Record<string, SpeciesAuditEntry>;
}

export type ResearchTopic =
  | 'taxonomy'
  | 'anatomy'
  | 'growth'
  | 'geology'
  | 'palaeobiology'
  | 'history'
  | 'general';

export interface SpeciesResearchEntry {
  title: string;
  body: string;
  evidence: EvidenceKind;
  topic: ResearchTopic;
  refs: string[];
  /** Normalised access level used for consistent display. */
  access: 'Metadata only' | 'Abstract read' | 'Full text read' | 'Institutional record';
  /** Original access note, retained so normalisation does not erase what was checked. */
  accessDetail?: string;
}

export type PeriodId = 'triassic' | 'jurassic' | 'cretaceous';

export type GeoRank = 'supereon' | 'eon' | 'era' | 'period' | 'epoch';

export interface GeoStage {
  name: string;
  startMa: number;
  endMa: number;
}

export interface GeoUnit {
  id: string;
  name: string;
  rank: GeoRank;
  parentId: string | null;
  startMa: number;
  endMa: number;
  informal?: boolean;
  stages?: GeoStage[];
  sourceRefs: string[];
}

export interface GeologicalTime {
  id: string;
  name: string;
  version: string;
  released: string;
  accessed: string;
  sourceRef: string;
  url: string;
  chartUrl: string;
  citation: string;
  note: string;
  units: GeoUnit[];
}

export type DeepTimeEventKind =
  | 'first-evidence'
  | 'diversification'
  | 'extinction'
  | 'transition';

export type DeepTimeEventBasis = 'fossil' | 'proxy';

export interface DeepTimeEvent {
  id: string;
  title: string;
  dateMa: number;
  endMa?: number;
  dateLabel: string;
  unitId: string;
  kind: DeepTimeEventKind;
  basis: DeepTimeEventBasis;
  body: string;
  note?: string;
  refs: string[];
}

export interface DeepTimeUnitContent {
  tagline: string;
  summary: string;
  climate?: string;
  environment?: string;
  geography?: string;
  life: string[];
  endedBy?: string;
  refs: string[];
}

export interface DeepTimeMeasure {
  yearLabel: string;
  kicker: string;
  standfirst: string;
  analogy: string;
  analogyNote: string;
  scaleNote: string;
}

export interface DeepTimeContent {
  measure: DeepTimeMeasure;
  units: Record<string, DeepTimeUnitContent>;
  events: DeepTimeEvent[];
}

export type Diet = 'carnivore' | 'herbivore' | 'omnivore' | 'unknown';

export type RelationshipKind = 'genus' | 'family' | 'context' | 'period' | 'region' | 'clade' | 'ecology';

export interface SpeciesRelationship {
  slug: string;
  kind: RelationshipKind;
  reason: string;
}

export interface Reference {
  id: string;
  authors: string;
  year: number;
  title: string;
  sourceType?:
    | 'Peer-reviewed article'
    | 'Museum bulletin'
    | 'Museum catalogue'
    | 'Historical monograph'
    | 'Historical article'
    | 'Institutional report'
    | 'Book chapter';
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  doi?: string;
  url?: string;
  openAccessUrl?: string;
  /** Species or broader subjects the publication actually treats. */
  subjects?: string[];
  note?: string;
}

export interface TaxonomyRow {
  rank: string;
  value: string;
}

export interface EvidenceSection {
  title: string;
  body: string;
  evidence: EvidenceKind;
  refs?: string[];
}

export interface SpeciesPrimer {
  /** A short, plain-language introduction written for a first-time reader. */
  lead: string;
  /** Two or three short paragraphs that add context without duplicating the dossier. */
  paragraphs: string[];
  /** Optional one-line takeaway shown at the end of the primer. */
  takeaway?: string;
}

export interface Species {
  slug: string;
  accession: string;
  scientificName: string;
  commonName: string;
  genus: string;
  epithet: string;
  status: string;
  namedBy: string;
  group: string;
  groupKey: string;
  period: PeriodId;
  periodLabel: string;
  stage: string;
  ageMa: [number, number];
  ageLabel: string;
  region: string[];
  regionKeys: string[];
  diet: Diet;
  dietLabel: string;
  dietEvidence: {
    body: string;
    evidence: EvidenceKind;
    refs: string[];
  };
  length: string;
  mass: string;
  sizeNote: string;
  sizeRefs: string[];
  /** Registered life reconstruction. Optional for unillustrated database records. */
  image?: string;
  fossilImage?: string;
  featured: boolean;
  tagline: string;
  summary: string;
  taxonomy: TaxonomyRow[];
  discovery: {
    body: string;
    evidence: EvidenceKind;
    refs: string[];
  };
  fossilEvidence: EvidenceSection[];
  anatomy: EvidenceSection[];
  behaviour: {
    body: string;
    evidence: EvidenceKind;
    refs: string[];
  };
  reconstruction: {
    body: string;
    evidence: EvidenceKind;
    refs: string[];
  };
  references: string[];
  related: string[];
  confidenceNote: string;
  /** Optional hand-written beginner primer; other species use a data-driven fallback. */
  primer?: SpeciesPrimer;
  /** Research trail added in V19. Optional for the original curated dossiers. */
  research?: SpeciesResearchEntry[];
  researchStatus?: 'verified' | 'partially-verified' | 'limited' | 'curated';
  researchNote?: string;
  specimenStatus?: string;
  synonyms?: string[];
  updated: string;
  added: string;
  locomotion?: string;
  habitat?: string;
  ancientContext?: string;
  locality?: string[];
  relationships?: SpeciesRelationship[];
}

export interface Period {
  id: PeriodId;
  name: string;
  startMa: number;
  endMa: number;
  span: string;
  epochs: { name: string; startMa: number; endMa: number }[];
  climate: string;
  life: string[];
  endedBy: string;
  summary: string;
  sourceUrl: string;
}

export interface Discovery {
  id: string;
  year: number;
  dateLabel: string;
  title: string;
  subject: string;
  kind: 'discovery' | 'publication' | 'interpretation' | 'extinction';
  summary: string;
  refs: string[];
}

/* ------------------------------------------------------------------ */
/* Discoveries — specimen, expedition and revision archive              */
/* ------------------------------------------------------------------ */

export type DiscoveryMediaRole =
  | 'fossil-photograph'
  | 'cast'
  | 'historical-illustration'
  | 'skeletal-reconstruction'
  | 'mounted-reconstruction'
  | 'excavation-photograph';

export interface DiscoveryMedia {
  assetId: string;
  role: DiscoveryMediaRole;
  caption: string;
}

export interface DiscoveryLocation {
  id: string;
  label: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  coordinateNote: string;
  refs: string[];
}

export interface DiscoveryFormation {
  id: string;
  name: string;
  periodId: PeriodId;
  ageLabel: string;
  ageMa: [number, number];
  locationIds: string[];
  note: string;
  refs: string[];
}

export interface DiscoveryResearcher {
  id: string;
  name: string;
  role: string;
  affiliation?: string;
  note: string;
  refs: string[];
}

export interface DiscoveryEvent {
  id: string;
  year: number | null;
  dateLabel: string;
  summary: string;
  researcherIds: string[];
  expeditionId: string | null;
  locationId: string;
  formationId: string;
  specimenIds: string[];
  relatedSpeciesIds: string[];
  refs: string[];
}

export interface DiscoveryExpedition {
  id: string;
  name: string;
  dateLabel: string;
  yearStart: number;
  yearEnd: number | null;
  researcherIds: string[];
  institutions: string[];
  locationIds: string[];
  formationIds: string[];
  summary: string;
  specimenIds: string[];
  discoveryIds: string[];
  relatedSpeciesIds: string[];
  refs: string[];
}

export type DiscoverySpecimenType = 'type' | 'neotype' | 'referred';
export type DiscoveryPreservation =
  | 'lost'
  | 'partial'
  | 'nearly-complete'
  | 'integument';

export interface DiscoverySpecimen {
  id: string;
  identifier: string;
  speciesId: string;
  typeGroup: DiscoverySpecimenType;
  typeStatus: string;
  material: string;
  preservation: string;
  preservationClass: DiscoveryPreservation;
  repository: string;
  collectionNote: string;
  discoveryId: string;
  significance: string;
  anatomy: string;
  uncertainty: string;
  topics: string[];
  media: DiscoveryMedia[];
  anatomyStructureIds: string[];
  relatedSpecimenIds: string[];
  publications: string[];
  refs: string[];
  featured: boolean;
}

export interface DiscoveryRevisionStage {
  label: string;
  body: string;
  refs: string[];
}

export interface DiscoveryRevision {
  id: string;
  title: string;
  kicker: string;
  speciesId: string;
  earlier: DiscoveryRevisionStage;
  evidenceThen: DiscoveryRevisionStage;
  trigger: DiscoveryRevisionStage;
  revised: DiscoveryRevisionStage;
  uncertainty: DiscoveryRevisionStage;
  specimenIds: string[];
  refs: string[];
}

export interface DiscoveryCaseChapter {
  id: string;
  yearLabel: string;
  title: string;
  body: string;
  specimenIds: string[];
  refs: string[];
}

export interface DiscoveryCaseStudy {
  id: string;
  kicker: string;
  title: string;
  standfirst: string;
  chapters: DiscoveryCaseChapter[];
  limits: string[];
}

export interface DiscoveryMilestoneLink {
  specimenIds?: string[];
  expeditionIds?: string[];
  revisionId?: string;
}

export interface DiscoveryArchive {
  version: string;
  updated: string;
  statement: string;
  locations: DiscoveryLocation[];
  formations: DiscoveryFormation[];
  researchers: DiscoveryResearcher[];
  expeditions: DiscoveryExpedition[];
  discoveries: DiscoveryEvent[];
  specimens: DiscoverySpecimen[];
  revisions: DiscoveryRevision[];
  caseStudy: DiscoveryCaseStudy;
  milestoneLinks: Record<string, DiscoveryMilestoneLink>;
  limits: string[];
}

export interface ResearchRecord {
  id: string;
  title: string;
  species: string;
  publicationDate: string;
  institution: string;
  journal: string;
  summary: string;
  sourceUrl: string;
  doi?: string;
  retrievedAt: string;
  lastVerified: string;
  reviewStatus: 'reviewed' | 'pending';
  evidenceType: 'peer-reviewed' | 'museum-announcement';
}

export interface SpinosaurusEvent {
  year: string;
  dateLabel: string;
  title: string;
  kind: 'fieldwork' | 'publication' | 'interpretation' | 'loss' | 'hypothesis';
  body: string;
  people?: string;
  refs?: string[];
}

export interface Hypothesis {
  id: string;
  name: string;
  status: string;
  claim: string;
  support: string[];
  criticism: string[];
  refs: string[];
}

export interface SpeciesPageField {
  label: string;
  value: string;
  note?: string;
  refs?: string[];
}

export interface SpeciesPageNote {
  value: string;
  note: string;
}

export interface SpeciesPageImage {
  id: string;
  label: string;
  caption: string;
}

export interface SpeciesPageSpecimen {
  identifier: string;
  status: string;
  material: string;
  locality: string;
  date: string;
  repository?: string;
  significance: string;
  image: string;
  imageCaption: string;
  refs: string[];
}

export interface SpeciesPageEcology {
  intro: string;
  paragraphs: string[];
  image: string;
  imageLabel: string;
  imageCaption: string;
  refs: string[];
  limits: string[];
}

export interface SpeciesPageContent {
  hero: {
    kicker: string;
    intro: string;
    image: string;
    imageLabel: string;
  };
  overview: {
    intro: string;
    fields: SpeciesPageField[];
    material: string;
  };
  taxonomy: {
    intro: string;
    notes: SpeciesPageNote[];
  };
  anatomy: {
    intro: string;
    note: string;
    image?: string;
  };
  ecology?: SpeciesPageEcology;
  fossilRecord?: {
    intro: string;
    specimens: SpeciesPageSpecimen[];
  };
  history?: {
    intro: string;
    events?: SpinosaurusEvent[];
  };
  historyImages?: Record<string, { id: string; caption: string }>;
  debates?: {
    intro: string;
    questions: Record<string, string>;
    commonGround: string;
    whatWouldChange: string;
    hypotheses?: Hypothesis[];
  };
  relatedNote?: string;
}

export type ClassificationRank = 'Clade' | 'Superfamily' | 'Family' | 'Subfamily';

export interface ClassificationNode {
  id: string;
  parentId: string | null;
  label: string;
  rank: ClassificationRank;
  /** Taxonomy values that place a species at or below this node. */
  taxa: string[];
  note: string;
  disputed?: boolean;
}

export interface ClassificationData {
  version: string;
  statement: string;
  nodes: ClassificationNode[];
}

export interface ClassificationEntry {
  node: ClassificationNode;
  children: ClassificationEntry[];
  species: Species[];
  total: number;
}

export interface Hotspot {
  id: string;
  label: string;
  x: number;
  y: number;
  structure: string;
  body: string;
  evidence: EvidenceKind;
  refs: string[];
}

/* ------------------------------------------------------------------ */
/* Anatomical atlas                                                    */
/* ------------------------------------------------------------------ */

/**
 * A finer evidence key than the archive's general tags. These describe the
 * status of a statement, not the quality of an illustration.
 */
export type AtlasEvidence = 'fossil' | 'reconstruction' | 'interpretation' | 'debate';

export interface AtlasEvidenceKey {
  id: AtlasEvidence;
  label: string;
  shortLabel: string;
  body: string;
}

export interface AtlasCategory {
  id: string;
  label: string;
  shortLabel: string;
}

export interface AtlasPlate {
  assetId: string;
  title: string;
  alt: string;
  caption: string;
  note: string;
  width: number;
  height: number;
}

export interface AtlasLocator {
  x: number;
  y: number;
  radius: number;
}

export interface AtlasEvidenceBlock {
  body: string;
  refs: string[];
}

export interface AtlasLegacyHotspot {
  label: string;
  order: number;
}

export interface AtlasStructure {
  id: string;
  name: string;
  shortName: string;
  category: string;
  summary: string;
  observation: AtlasEvidenceBlock;
  reconstruction?: AtlasEvidenceBlock;
  function?: AtlasEvidenceBlock;
  debate?: AtlasEvidenceBlock;
  primaryEvidence: AtlasEvidence;
  locator?: AtlasLocator;
  views: string[];
  primaryView?: string;
  specimens: string[];
  relatedStructures: string[];
  softTissue: boolean;
  legacy?: AtlasLegacyHotspot;
}

export interface AtlasView {
  id: string;
  label: string;
  shortLabel: string;
  note: string;
  scale: number;
  focusX: number;
  focusY: number;
  structureIds: string[];
}

export interface AtlasSpecimen {
  id: string;
  identifier: string;
  status: string;
  material: string;
  locality: string;
  repository?: string;
  refs: string[];
}

export type AtlasAdaptationKind =
  | 'feeding'
  | 'locomotion'
  | 'support'
  | 'display'
  | 'posture';

export interface AtlasAdaptation {
  id: string;
  kind: AtlasAdaptationKind;
  title: string;
  summary: string;
  structureIds: string[];
  evidence: AtlasEvidence;
  refs: string[];
}

export interface AtlasCase {
  id: string;
  speciesId: string;
  caseLabel: string;
  status: string;
  scope: 'full-body' | 'skull';
  scopeLabel: string;
  intro: string;
  plate: AtlasPlate;
  views: AtlasView[];
  defaultView: string;
  defaultStructure: string;
  structures: AtlasStructure[];
  specimens: AtlasSpecimen[];
  adaptations: AtlasAdaptation[];
  limits: string[];
}

export interface AtlasComparisonSide {
  speciesId: string;
  imageAsset: string;
  imageLabel: string;
  imageNote: string;
}

export interface AtlasComparisonRow {
  label: string;
  left: string;
  right: string;
  evidence: AtlasEvidence;
}

export interface AtlasComparison {
  id: string;
  kicker: string;
  title: string;
  intro: string;
  left: AtlasComparisonSide;
  right: AtlasComparisonSide;
  caveat: string;
  rows: AtlasComparisonRow[];
  refs: string[];
}

export interface AnatomicalAtlas {
  version: string;
  updated: string;
  statement: string;
  evidenceKey: AtlasEvidenceKey[];
  categories: AtlasCategory[];
  cases: AtlasCase[];
  comparisons: AtlasComparison[];
  limits: string[];
}

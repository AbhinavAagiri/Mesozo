import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  anatomyHotspots,
  claimReviewRefs,
  getRelatedEntries,
  getSpecies,
  getSpeciesPage,
  spinosaurusHypotheses,
  spinosaurusTimeline,
} from '../data';
import type { SpeciesSection } from '../sections/species/SpeciesNav';
import { SpeciesAnatomy } from '../sections/species/SpeciesAnatomy';
import { SpeciesClaims } from '../sections/species/SpeciesClaims';
import { SpeciesDebates } from '../sections/species/SpeciesDebates';
import { SpeciesEcology } from '../sections/species/SpeciesEcology';
import { SpeciesFossilRecord } from '../sections/species/SpeciesFossilRecord';
import { SpeciesHero } from '../sections/species/SpeciesHero';
import { SpeciesHistory } from '../sections/species/SpeciesHistory';
import { SpeciesJournal } from '../sections/species/SpeciesJournal';
import { SpeciesNav } from '../sections/species/SpeciesNav';
import { SpeciesOrientation } from '../sections/species/SpeciesOrientation';
import { SpeciesOverview } from '../sections/species/SpeciesOverview';
import { SpeciesPrimer } from '../sections/species/SpeciesPrimer';
import { SpeciesReferences } from '../sections/species/SpeciesReferences';
import { SpeciesRelated } from '../sections/species/SpeciesRelated';
import {
  SpeciesResearch,
  type SpeciesResearchTrail,
} from '../sections/species/SpeciesResearch';
import { SpeciesTaxonomy } from '../sections/species/SpeciesTaxonomy';
import researchTrailsData from '../data/research-trails.json';
import { researchReferences } from '../data/research-references';
import { journalStoriesForSpecies } from '../data/journal';
import { usePageTitle } from '../lib/usePageTitle';
import { useReveal } from '../lib/useReveal';
import '../styles/pages.css';
import '../styles/species.css';

export default function SpeciesDossier() {
  const { slug } = useParams();
  const item = getSpecies(slug);
  const page = getSpeciesPage(slug);
  const researchTrail = item
    ? (researchTrailsData as Record<string, SpeciesResearchTrail>)[item.slug]
    : undefined;
  const journalStories = journalStoriesForSpecies(item?.slug ?? '');
  usePageTitle(item ? item.scientificName : 'Species not found', {
    description: item
      ? `${item.commonName} (${item.scientificName}): ${item.tagline}`
      : 'This species dossier is not in the MESOZO archive.',
    image: item?.image ? `/assets/social/${item.image}.jpg` : undefined,
    imageAlt:
      item && item.image ? `Life reconstruction of ${item.scientificName}.` : undefined,
    noindex: !item,
    breadcrumbs: item
      ? [
          { name: 'Home', path: '/' },
          { name: 'Species database', path: '/species' },
          { name: `${item.accession} · ${item.status}`, path: `/species/${item.slug}` },
        ]
      : undefined,
    structuredData: item
      ? {
          '@type': 'Taxon',
          name: item.scientificName,
          alternateName: item.commonName,
          description: item.tagline,
        }
      : undefined,
  });
  const root = useReveal<HTMLDivElement>();
  const hasResearch = Boolean(researchTrail?.entries.length);

  const sections = useMemo<SpeciesSection[]>(() => {
    const entries: Array<[string, string]> = [
      ['overview', 'Overview'],
      ['primer', 'Start here'],
      ['orientation', 'Reading guide'],
      ['classification', 'Classification'],
      ['anatomy', 'Anatomy'],
    ];

    if (page?.ecology) entries.push(['ecology', 'Ecology']);
    entries.push(['fossil-record', 'Fossil record']);
    entries.push(['claims', 'Evidence']);
    entries.push(['research-trail', hasResearch ? 'Research trail' : 'Research coverage']);
    if (page?.history) entries.push(['reconstruction', 'History']);
    if (page?.debates) entries.push(['debates', 'Debates']);
    if (journalStories.length) entries.push(['journal', 'Research']);
    entries.push(['related', 'Related']);
    entries.push(['references', 'References']);

    return entries.map(([id, label], position) => ({
      id,
      label,
      index: String(position + 1).padStart(2, '0'),
    }));
  }, [page, journalStories.length, hasResearch]);

  if (!item) {
    return (
      <div className="page notfound shell">
        <p className="label">404 — Not in the archive</p>
        <h1 className="serif">This dossier does not exist.</h1>
        <Link className="text-link" to="/species">
          Back to the species archive <span aria-hidden="true">↗</span>
        </Link>
      </div>
    );
  }

  const related = getRelatedEntries(item);
  const sectionIndex = (id: string) => sections.find((section) => section.id === id)?.index ?? '01';
  const historyEvents = page?.history
    ? (page.history.events ?? (slug === 'spinosaurus' ? spinosaurusTimeline : []))
    : [];
  const debateHypotheses = page?.debates
    ? (page.debates.hypotheses ?? (slug === 'spinosaurus' ? spinosaurusHypotheses : []))
    : [];

  const referenceIds = Array.from(
    new Set([
      ...item.references,
      ...(researchTrail?.entries.flatMap((entry) => entry.refs) ?? []),
      ...historyEvents.flatMap((event) => event.refs ?? []),
      ...debateHypotheses.flatMap((hypothesis) => hypothesis.refs),
      ...claimReviewRefs(item.slug),
    ]),
  );

  const extraRefs = researchReferences.filter((reference) =>
    referenceIds.includes(reference.id),
  );

  const creditIds = Array.from(
    new Set(
      [
        page?.hero.image ?? item.image,
        ...(page?.anatomy?.image ? [page.anatomy.image] : []),
        ...(page?.ecology ? [page.ecology.image] : []),
        ...(page?.fossilRecord?.specimens.map((specimen) => specimen.image) ?? []),
        ...Object.values(page?.historyImages ?? {}).map((image) => image.id),
        ...(item.fossilImage ? [item.fossilImage] : []),
      ].filter((id): id is string => Boolean(id)),
    ),
  );

  return (
    <article className="spx" ref={root}>
      <SpeciesHero species={item} page={page} />
      <SpeciesNav sections={sections} />

      <SpeciesOverview species={item} page={page} index={sectionIndex('overview')} />
      <SpeciesPrimer species={item} index={sectionIndex('primer')} />
      <SpeciesOrientation species={item} index={sectionIndex('orientation')} />
      <SpeciesTaxonomy species={item} page={page} index={sectionIndex('classification')} />
      <SpeciesAnatomy
        species={item}
        page={page}
        hotspots={page?.anatomy ? anatomyHotspots : []}
        index={sectionIndex('anatomy')}
      />

      {page?.ecology ? (
        <SpeciesEcology
          species={item}
          ecology={page.ecology}
          index={sectionIndex('ecology')}
        />
      ) : null}

      <SpeciesFossilRecord
        species={item}
        page={page}
        extraRefs={extraRefs}
        index={sectionIndex('fossil-record')}
      />

      <SpeciesClaims species={item} index={sectionIndex('claims')} />

      <SpeciesResearch
        species={item}
        trail={researchTrail}
        extraRefs={extraRefs}
        index={sectionIndex('research-trail')}
      />

      {page?.history ? (
        <SpeciesHistory
          history={page.history}
          images={page.historyImages ?? {}}
          events={historyEvents}
          index={sectionIndex('reconstruction')}
        />
      ) : null}

      {page?.debates ? (
        <SpeciesDebates
          debates={page.debates}
          hypotheses={debateHypotheses}
          index={sectionIndex('debates')}
        />
      ) : null}

      <SpeciesJournal stories={journalStories} index={sectionIndex('journal')} />

      <SpeciesRelated related={related} note={page?.relatedNote} index={sectionIndex('related')} />
      <SpeciesReferences
        ids={referenceIds}
        creditIds={creditIds}
        reviewed={item.updated}
        extraRefs={extraRefs}
        index={sectionIndex('references')}
      />
    </article>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AssetImage } from '../components/ui/AssetImage';
import { PageHeader } from '../components/ui/PageHeader';
import { ReferenceList } from '../components/ui/Sources';
import {
  anatomicalAtlas,
  assetById,
  atlasCaseRefs,
  atlasCases,
  atlasComparison,
  atlasComparisonRefs,
  getAtlasCase,
  getAtlasStructure,
  getPeriod,
  getSpecies,
  species as speciesRecords,
} from '../data';
import type { AtlasCase, AtlasStructure } from '../data/types';
import { usePageTitle } from '../lib/usePageTitle';
import { useReducedMotion } from '../lib/useReducedMotion';
import { AtlasAdaptations } from '../sections/anatomy/AtlasAdaptations';
import { AtlasComparison } from '../sections/anatomy/AtlasComparison';
import { AtlasEvidenceKey } from '../sections/anatomy/AtlasEvidenceKey';
import { AtlasExplorer } from '../sections/anatomy/AtlasExplorer';
import { GuideLink } from '../components/learning/GuideLink';
import '../styles/pages.css';
import '../styles/destination.css';
import '../styles/learning.css';
import '../styles/anatomy-atlas.css';

function defaultStructureFor(atlasCase: AtlasCase) {
  return (
    getAtlasStructure(atlasCase, atlasCase.defaultStructure) ??
    atlasCase.structures[0]
  );
}

/** Keep a structure deep link and a view deep link consistent. */
function initialViewFor(
  atlasCase: AtlasCase,
  structure: AtlasStructure,
  requestedView: AtlasCase['views'][number] | undefined,
) {
  const fallback =
    requestedView ??
    atlasCase.views.find((view) => view.id === atlasCase.defaultView) ??
    atlasCase.views[0];
  if (!structure.locator || fallback.structureIds.includes(structure.id)) return fallback;
  return (
    atlasCase.views.find((view) => view.id === structure.primaryView) ??
    atlasCase.views.find((view) => view.structureIds.includes(structure.id)) ??
    fallback
  );
}

export default function AnatomyPage() {
  usePageTitle('The anatomical atlas', {
    description:
      'An interactive anatomical atlas of Spinosaurus and Tyrannosaurus: structures, evidence, reconstructions and the limits of what the fossils preserve.',
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const reducedMotion = useReducedMotion();

  const requestedCase =
    getAtlasCase(searchParams.get('species') ?? undefined) ?? atlasCases[0];
  const requestedStructure = getAtlasStructure(
    requestedCase,
    searchParams.get('structure') ?? '',
  );
  const requestedView = requestedCase.views.find(
    (view) => view.id === searchParams.get('view'),
  );

  const initialStructure = requestedStructure ?? defaultStructureFor(requestedCase);
  const initialView = initialViewFor(requestedCase, initialStructure, requestedView);

  const [caseId, setCaseId] = useState(requestedCase.speciesId);
  const [structureId, setStructureId] = useState(initialStructure.id);
  const [viewId, setViewId] = useState(initialView.id);
  const [panelOpen, setPanelOpen] = useState(
    () => !window.matchMedia('(max-width: 980px)').matches,
  );

  // Back/forward navigation can change any atlas query without a page reload.
  useEffect(() => {
    const nextCase = getAtlasCase(searchParams.get('species') ?? undefined) ?? atlasCases[0];
    const nextStructure =
      getAtlasStructure(nextCase, searchParams.get('structure') ?? '') ??
      defaultStructureFor(nextCase);
    const nextRequestedView = nextCase.views.find(
      (view) => view.id === searchParams.get('view'),
    );
    const nextView = initialViewFor(nextCase, nextStructure, nextRequestedView);

    setCaseId(nextCase.speciesId);
    setStructureId(nextStructure.id);
    setViewId(nextView.id);
  }, [searchParams]);

  const atlasCase = getAtlasCase(caseId) ?? atlasCases[0];
  const structure =
    getAtlasStructure(atlasCase, structureId) ??
    defaultStructureFor(atlasCase);
  const view = atlasCase.views.find((item) => item.id === viewId) ?? atlasCase.views[0];
  const species = getSpecies(atlasCase.speciesId);
  const period = species ? getPeriod(species.period) : undefined;
  const totalStructures = atlasCases.reduce((total, item) => total + item.structures.length, 0);

  const allRefs = useMemo(
    () =>
      Array.from(
        new Set([
          ...atlasCases.flatMap(atlasCaseRefs),
          ...atlasComparisonRefs(atlasComparison),
        ]),
      ),
    [],
  );

  const creditIds = useMemo(
    () =>
      Array.from(
        new Set([
          ...atlasCases.map((item) => item.plate.assetId),
          atlasComparison.left.imageAsset,
          atlasComparison.right.imageAsset,
        ]),
      ),
    [],
  );

  const chooseCase = (nextId: string) => {
    const nextCase = getAtlasCase(nextId);
    if (!nextCase || nextCase.speciesId === caseId) return;
    setCaseId(nextCase.speciesId);
    setStructureId(defaultStructureFor(nextCase).id);
    setViewId(nextCase.defaultView);
    setPanelOpen(true);

    const next = new URLSearchParams(searchParams);
    next.set('species', nextCase.speciesId);
    next.delete('structure');
    next.delete('view');
    setSearchParams(next);
  };

  const syncAtlasUrl = (nextCaseId: string, nextStructureId: string, nextViewId: string) => {
    const next = new URLSearchParams(searchParams);
    const nextCase = getAtlasCase(nextCaseId) ?? atlasCases[0];
    if (nextCaseId !== atlasCases[0].speciesId) next.set('species', nextCaseId);
    else next.delete('species');
    if (nextStructureId !== defaultStructureFor(nextCase).id) next.set('structure', nextStructureId);
    else next.delete('structure');
    if (nextViewId !== nextCase.defaultView) next.set('view', nextViewId);
    else next.delete('view');
    if (next.toString() !== searchParams.toString()) setSearchParams(next);
  };

  const chooseStructure = (nextId: string) => {
    const next = getAtlasStructure(atlasCase, nextId);
    if (!next) return;
    setStructureId(next.id);
    setPanelOpen(true);
    const nextViewId =
      next.primaryView && !view.structureIds.includes(next.id) ? next.primaryView : view.id;
    if (nextViewId !== view.id) setViewId(nextViewId);
    syncAtlasUrl(atlasCase.speciesId, next.id, nextViewId);

    // On compact layouts the reading panel sits above the index, so bring it
    // back into view rather than leaving the selection below the fold.
    if (window.matchMedia('(max-width: 980px)').matches) {
      window.setTimeout(() => {
        document.getElementById('atlas-detail')?.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }, 60);
    }
  };

  const openStructureFromArgument = (nextId: string) => {
    const next = getAtlasStructure(atlasCase, nextId);
    if (!next) return;
    setStructureId(next.id);
    if (next.primaryView) setViewId(next.primaryView);
    setPanelOpen(true);
    syncAtlasUrl(atlasCase.speciesId, next.id, next.primaryView ?? view.id);
    window.setTimeout(() => {
      document.getElementById('atlas-explorer')?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }, 40);
  };

  const chooseView = (nextId: string) => {
    const next = atlasCase.views.find((item) => item.id === nextId);
    if (!next) return;
    setViewId(next.id);
    setPanelOpen(true);
    let nextStructureId = structure.id;
    if (!next.structureIds.includes(structure.id)) {
      const first = next.structureIds[0];
      if (first) {
        setStructureId(first);
        nextStructureId = first;
      }
    }
    syncAtlasUrl(atlasCase.speciesId, nextStructureId, next.id);
  };

  const reset = () => {
    const next = defaultStructureFor(atlasCase);
    setStructureId(next.id);
    setViewId(atlasCase.defaultView);
    setPanelOpen(true);
    syncAtlasUrl(atlasCase.speciesId, next.id, atlasCase.defaultView);
  };

  return (
    <div className="page atlas-page">
      <PageHeader
        index="03"
        kicker="Anatomy & Biology / Atlas"
        title={
          <>
            The body, <em>read in bone.</em>
          </>
        }
        intro="An interactive atlas of the animals in the archive: inspect the skeleton, understand the function argued from it, and see exactly where observation ends and interpretation begins."
        meta={[
          { label: 'Cases', value: `${atlasCases.length} available` },
          { label: 'Structures', value: `${totalStructures} documented` },
          { label: 'Evidence', value: `${anatomicalAtlas.evidenceKey.length} classes` },
        ]}
      />

      <section className="atlas-principle" data-theme="dark">
        <div className="shell atlas-principle__grid">
          <p className="label">The distinction</p>
          <div>
            <p className="atlas-principle__statement serif">
              A fossil is <em>evidence.</em>
              <br />
              An anatomical reconstruction is <em>an interpretation of that evidence.</em>
            </p>
            <div className="atlas-principle__notes">
              <p>
                The skeleton can show a joint, a tooth, a ridge or a broken shaft. It cannot by
                itself show how the animal moved, what it ate, or what the soft tissue around the
                bone looked like. Those are arguments, and they belong in the exhibit with their
                evidence attached.
              </p>
              <p>
                Every mark in this atlas is classified. A locator points to a region of a published
                plate; it is not a measured anatomical landmark. A tag describes the status of the
                claim, not the quality of the drawing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="atlas-learn shell" aria-labelledby="atlas-learn-title">
        <div className="atlas-learn__head">
          <div>
            <p className="label">Anatomy & Biology / Learning layer</p>
            <h2 className="serif" id="atlas-learn-title">
              A skeleton is a set of questions.
            </h2>
          </div>
          <p>
            The atlas shows what is preserved and how it has been interpreted. These short guides
            explain the concepts behind the labels before you use them on another animal.
          </p>
        </div>
        <div className="atlas-learn__links">
          <GuideLink
            link={{
              label: 'How dinosaurs moved',
              to: '/learn/how-dinosaurs-moved',
              note: 'Joints, limb proportions, muscle scars and trackways — and why a skeleton does not record a speed.',
            }}
          />
          <GuideLink
            link={{
              label: 'What dinosaurs ate',
              to: '/learn/what-dinosaurs-ate',
              note: 'Teeth, jaws, wear and gut contents: what can be inferred, and what cannot.',
            }}
          />
          <GuideLink
            link={{
              label: 'Reconstructing extinct animals',
              to: '/learn/reconstructing-extinct-animals',
              note: 'Skeleton, muscle, integument and behaviour are separate claims. The image should not hide them.',
            }}
          />
        </div>
      </section>

      <section className="atlas-intro shell" aria-label="Atlas introduction">
        <div className="atlas-intro__index">
          <p className="label">The atlas</p>
          <p className="mono">V12 · 2026</p>
        </div>
        <div className="atlas-intro__copy">
          <p className="lead">
            Anatomy is easiest to understand when it is allowed to be an argument. Select a bone,
            see what is preserved, then read the interpretation that has been built around it.
          </p>
          <div className="atlas-intro__meta">
            <Link to="/species" data-cursor="link">
              Browse all {speciesRecords.length} dossiers <span aria-hidden="true">↗</span>
            </Link>
            {species ? (
              <Link to={`/species/${species.slug}`} data-cursor="link">
                {species.scientificName} dossier <span aria-hidden="true">↗</span>
              </Link>
            ) : null}
            {period ? (
              <Link to={`/deep-time?period=${period.id}`} data-cursor="link">
                {period.name} in Deep Time <span aria-hidden="true">↗</span>
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <AtlasExplorer
        atlasCase={atlasCase}
        structure={structure}
        viewId={view.id}
        panelOpen={panelOpen}
        onPanelToggle={() => setPanelOpen((open) => !open)}
        onSelectStructure={chooseStructure}
        onSelectView={chooseView}
        onSelectCase={chooseCase}
        onReset={reset}
      />

      <AtlasEvidenceKey entries={anatomicalAtlas.evidenceKey} />

      <AtlasAdaptations atlasCase={atlasCase} onOpenStructure={openStructureFromArgument} />

      <AtlasComparison comparison={atlasComparison} />

      <section className="atlas-register" id="sources" aria-labelledby="atlas-register-title">
        <div className="shell">
          <div className="atlas-register__head">
            <div>
              <p className="label">05 — Sources & plates</p>
              <h2 className="serif" id="atlas-register-title">
                What this atlas rests on.
              </h2>
            </div>
            <p>
              The anatomical case is built from peer-reviewed descriptions, museum material and
              comparative anatomy. Every image is a registered, licensed work. The limits below are
              part of the exhibit, not a disclaimer hidden at the end.
            </p>
          </div>

          <div className="atlas-register__grid">
            <div className="atlas-register__sources">
              <p className="label">References</p>
              <ReferenceList ids={allRefs} />
            </div>

            <aside className="atlas-register__aside">
              <div>
                <p className="label">This atlas does not claim</p>
                <ul className="atlas-limits">
                  {[...atlasCase.limits, ...anatomicalAtlas.limits].map((limit) => (
                    <li key={limit}>{limit}</li>
                  ))}
                </ul>
              </div>

              <div className="atlas-register__credits">
                <p className="label">Plates & image credits</p>
                <ul>
                  {creditIds.map((id) => {
                    const asset = assetById.get(id);
                    if (!asset) return null;
                    return (
                      <li key={id}>
                        <div className="atlas-register__credit-title">
                          <AssetImage
                            id={id}
                            alt=""
                            sizes="72px"
                            fit="cover"
                            className="atlas-register__thumb"
                          />
                          <span className="serif">{asset.title}</span>
                        </div>
                        <p>
                          {asset.creator} · {asset.license}
                        </p>
                        <a href={asset.sourceUrl} target="_blank" rel="noreferrer">
                          Source & licence ↗
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="atlas-register__links">
                <p className="label">Continue</p>
                <Link to="/discoveries">
                  Discovery archive <span aria-hidden="true">↗</span>
                </Link>
                <Link to="/species">Species archive <span aria-hidden="true">↗</span></Link>
                <Link to="/about#credits">All sources & licences <span aria-hidden="true">↗</span></Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

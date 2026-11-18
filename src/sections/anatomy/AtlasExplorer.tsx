import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { AssetImage } from '../../components/ui/AssetImage';
import { AtlasEvidenceTag } from '../../components/ui/AtlasEvidenceTag';
import { InlineSources } from '../../components/ui/Sources';
import type {
  AtlasCase,
  AtlasEvidence,
  AtlasEvidenceBlock,
  AtlasStructure,
} from '../../data/types';
import {
  anatomicalAtlas,
  assetById,
  atlasCases,
  atlasStructureRefs,
  getPeriod,
  speciesBySlug,
} from '../../data';

type Props = {
  atlasCase: AtlasCase;
  structure: AtlasStructure;
  viewId: string;
  panelOpen: boolean;
  onPanelToggle: () => void;
  onSelectStructure: (id: string) => void;
  onSelectView: (id: string) => void;
  onSelectCase: (id: string) => void;
  onReset: () => void;
};

function StructureBlock({
  evidence,
  block,
  title,
}: {
  evidence: AtlasEvidence;
  block: AtlasEvidenceBlock;
  title: string;
}) {
  return (
    <section className="atlas-detail__block">
      <div className="atlas-detail__block-head">
        <p className="label">{title}</p>
        <AtlasEvidenceTag kind={evidence} short />
      </div>
      <p>{block.body}</p>
      <InlineSources ids={block.refs} />
    </section>
  );
}

function getSpecimens(atlasCase: AtlasCase, structure: AtlasStructure) {
  return structure.specimens
    .map((id) => atlasCase.specimens.find((specimen) => specimen.id === id))
    .filter((specimen): specimen is NonNullable<typeof specimen> => Boolean(specimen));
}

function getCaseIndex(atlasCase: AtlasCase, structure: AtlasStructure) {
  return atlasCase.structures.findIndex((item) => item.id === structure.id) + 1;
}

/**
 * One reusable plate explorer. It knows nothing about Spinosaurus except what
 * the atlas data provides: an image, views, locatable structures and evidence.
 */
export function AtlasExplorer({
  atlasCase,
  structure,
  viewId,
  panelOpen,
  onPanelToggle,
  onSelectStructure,
  onSelectView,
  onSelectCase,
  onReset,
}: Props) {
  const view = atlasCase.views.find((item) => item.id === viewId) ?? atlasCase.views[0];
  const species = speciesBySlug.get(atlasCase.speciesId);
  const plateAsset = assetById.get(atlasCase.plate.assetId);
  const period = species ? getPeriod(species.period) : undefined;
  const structureIndex = getCaseIndex(atlasCase, structure);
  const specimens = getSpecimens(atlasCase, structure);
  const listRef = useRef<HTMLDivElement | null>(null);
  const categoryId = atlasCase.structures.find((item) => item.id === structure.id)?.category;
  const categoryLabel =
    anatomicalAtlas.categories.find((item) => item.id === categoryId)?.shortLabel ?? 'Internal';

  const visibleStructures = atlasCase.structures.filter(
    (item) =>
      item.locator &&
      (view.structureIds.includes(item.id) || item.id === structure.id),
  );

  const transform = `translate(${(50 - view.focusX) * view.scale}%, ${(50 - view.focusY) * view.scale}%) scale(${view.scale})`;

  return (
    <section className="atlas-explorer" id="atlas-explorer" aria-labelledby="atlas-explorer-title">
      <div className="shell">
        <div className="atlas-explorer__head">
          <div>
            <p className="label">01 — Explore anatomy</p>
            <h2 className="serif" id="atlas-explorer-title">
              Read the plate.
            </h2>
          </div>
          <p className="atlas-explorer__intro">
            Choose a view, then select a structure on the plate or in the index. The evidence panel
            separates the bone from the body built around it.
          </p>
        </div>

        <div className="atlas-casebar">
          <div className="atlas-casebar__cases" role="group" aria-label="Atlas cases">
            {atlasCases.map((entry) => {
              const active = entry.speciesId === atlasCase.speciesId;
              const entrySpecies = speciesBySlug.get(entry.speciesId);
              return (
                <button
                  key={entry.speciesId}
                  type="button"
                  className={`atlas-casebar__case${active ? ' is-active' : ''}`}
                  onClick={() => onSelectCase(entry.speciesId)}
                  aria-pressed={active}
                  data-cursor="link"
                >
                  <span className="label">
                    {entry.caseLabel} · {entry.status}
                  </span>
                  <span className="serif">{entrySpecies?.genus ?? entry.speciesId}</span>
                  <span className="mono">{entry.scopeLabel}</span>
                </button>
              );
            })}
          </div>
          <p className="atlas-casebar__note mono">
            {atlasCase.scopeLabel} · {atlasCase.status}
          </p>
        </div>

        <p className="atlas-case-intro">{atlasCase.intro}</p>

        <div className="atlas-stage">
          <figure className="atlas-plate">
            <div className="atlas-plate__head">
              <div>
                <p className="label">Plate {atlasCase.caseLabel.replace('Case ', '')}</p>
                <p className="atlas-plate__title serif">{atlasCase.plate.title}</p>
              </div>
              <span className="atlas-plate__scope mono">{view.shortLabel}</span>
            </div>

            <div
              className="atlas-plate__viewport"
              data-dense={visibleStructures.length > 6 ? 'true' : undefined}
              style={{ ['--atlas-aspect' as string]: `${atlasCase.plate.width} / ${atlasCase.plate.height}` }}
            >
              <div className="atlas-plate__canvas" style={{ transform }}>
                <AssetImage
                  id={atlasCase.plate.assetId}
                  alt={atlasCase.plate.alt}
                  sizes="(max-width: 900px) 96vw, 72vw"
                  fit="contain"
                  priority
                />
                {visibleStructures.map((item) => {
                  const active = item.id === structure.id;
                  const markerIndex = getCaseIndex(atlasCase, item);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`atlas-marker${active ? ' is-active' : ''}`}
                      style={{
                        left: `${item.locator?.x ?? 0}%`,
                        top: `${item.locator?.y ?? 0}%`,
                        ['--marker-inv' as string]: String(1 / view.scale),
                      }}
                      onClick={() => onSelectStructure(item.id)}
                      aria-pressed={active}
                      data-cursor="link"
                    >
                      <span className="atlas-marker__dot mono">{String(markerIndex).padStart(2, '0')}</span>
                      <span className="atlas-marker__label">{item.shortName}</span>
                      <span className="visually-hidden">
                        {item.name}: {item.summary}
                      </span>
                    </button>
                  );
                })}
                {structure.locator ? (
                  <span
                    className="atlas-locator"
                    aria-hidden="true"
                    style={{
                      left: `${structure.locator.x}%`,
                      top: `${structure.locator.y}%`,
                      width: `${structure.locator.radius * 2}%`,
                    }}
                  />
                ) : null}
              </div>
            </div>

            <div className="atlas-plate__views">
              <div className="atlas-view-tabs" role="group" aria-label={`Views of ${atlasCase.plate.title}`}>
                {atlasCase.views.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`atlas-view-tab${item.id === view.id ? ' is-active' : ''}`}
                    onClick={() => onSelectView(item.id)}
                    aria-pressed={item.id === view.id}
                    data-cursor="link"
                  >
                    {item.shortLabel === item.label ? (
                      <span>{item.label}</span>
                    ) : (
                      <>
                        <span className="label">{item.shortLabel}</span>
                        <span>{item.label}</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
              <p className="atlas-plate__view-note">{view.note}</p>
            </div>

            <figcaption className="atlas-plate__caption">
              <span>{atlasCase.plate.caption}</span>
              <span>{atlasCase.plate.note}</span>
              {plateAsset ? (
                <a href={plateAsset.sourceUrl} target="_blank" rel="noreferrer">
                  Image source · {plateAsset.license} ↗
                </a>
              ) : null}
            </figcaption>
          </figure>

          <aside className="atlas-detail" id="atlas-detail" aria-live="polite">
            <button
              type="button"
              className="atlas-detail__toggle"
              aria-expanded={panelOpen}
              aria-controls="atlas-detail-body"
              onClick={onPanelToggle}
            >
              <span className="label">Selected structure</span>
              <span className="serif">{structure.shortName}</span>
              <span aria-hidden="true">{panelOpen ? '−' : '+'}</span>
            </button>

            <div className="atlas-detail__body" id="atlas-detail-body" data-open={panelOpen}>
              <div className="atlas-detail__eyebrow">
                <p className="label">
                  {String(structureIndex).padStart(2, '0')} /{' '}
                  {String(atlasCase.structures.length).padStart(2, '0')} · {categoryLabel}
                </p>
                <AtlasEvidenceTag kind={structure.primaryEvidence} />
              </div>
              <h3 className="atlas-detail__name serif">{structure.name}</h3>
              <p className="atlas-detail__summary">{structure.summary}</p>

              <div className="atlas-detail__blocks">
                <StructureBlock evidence="fossil" block={structure.observation} title="Observed in the fossil" />
                {structure.reconstruction ? (
                  <StructureBlock
                    evidence="reconstruction"
                    block={structure.reconstruction}
                    title="Reconstructed anatomy"
                  />
                ) : null}
                {structure.function ? (
                  <StructureBlock
                    evidence="interpretation"
                    block={structure.function}
                    title="Proposed function"
                  />
                ) : null}
                {structure.debate ? (
                  <StructureBlock evidence="debate" block={structure.debate} title="What remains debated" />
                ) : null}
              </div>

              {specimens.length ? (
                <div className="atlas-detail__specimens">
                  <p className="label">Specimen anchors</p>
                  {specimens.map((specimen) => (
                    <div key={specimen.id}>
                      <span className="mono">{specimen.identifier}</span>
                      <span>{specimen.status}</span>
                      <p>{specimen.material}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="atlas-detail__specimen-note">
                  No specimen number is stated by the source for this cast.
                </p>
              )}

              <div className="atlas-detail__foot">
                <div>
                  <p className="label">Continue</p>
                  {species ? (
                    <Link to={`/species/${species.slug}`} data-cursor="link">
                      Species dossier ↗
                    </Link>
                  ) : null}
                  {period ? (
                    <Link to={`/deep-time?period=${period.id}`} data-cursor="link">
                      {period.name} in Deep Time ↗
                    </Link>
                  ) : null}
                </div>
                <button type="button" className="atlas-reset" onClick={onReset} data-cursor="link">
                  Reset selection <span aria-hidden="true">↺</span>
                </button>
              </div>

              <InlineSources ids={atlasStructureRefs(structure)} />
            </div>
          </aside>
        </div>

        <div
          className="atlas-index"
          ref={listRef}
          role="group"
          aria-label={`Structures in the ${atlasCase.plate.title}`}
        >
          <div className="atlas-index__head">
            <p className="label">Structure index</p>
            <p className="mono">
              {atlasCase.structures.length} documented structures · {atlasCase.views.length} views
            </p>
          </div>
          <div className="atlas-index__grid">
            {atlasCase.structures.map((item, index) => {
              const itemCategory = atlasCase.structures.find((candidate) => candidate.id === item.id)?.category;
              const itemCategoryLabel = anatomicalAtlas.categories.find((entry) => entry.id === itemCategory)?.shortLabel;
              const active = item.id === structure.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`atlas-index__item${active ? ' is-active' : ''}`}
                  onClick={() => onSelectStructure(item.id)}
                  aria-pressed={active}
                  data-cursor="link"
                >
                  <span className="atlas-index__num mono">{String(index + 1).padStart(2, '0')}</span>
                  <span className="atlas-index__name serif">{item.shortName}</span>
                  {itemCategoryLabel && itemCategoryLabel !== item.shortName ? (
                    <span className="atlas-index__category label">{itemCategoryLabel}</span>
                  ) : null}
                  <span className="atlas-index__arrow" aria-hidden="true">
                    {item.locator ? '↗' : '·'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AssetImage } from '../../components/ui/AssetImage';
import { EvidenceTag } from '../../components/ui/EvidenceTag';
import { InlineSources } from '../../components/ui/Sources';
import { assetById, getAtlasCase } from '../../data';
import type { Hotspot, Species, SpeciesPageContent } from '../../data/types';
import { SpeciesSectionHead } from './SpeciesSectionHead';

type Props = {
  species: Species;
  page?: SpeciesPageContent;
  hotspots: Hotspot[];
  index?: string;
};

/** Interactive anatomy plate; falls back to a text-led anatomy index. */
export function SpeciesAnatomy({ species, page, hotspots, index = '03' }: Props) {
  const [activeId, setActiveId] = useState(hotspots[2]?.id ?? hotspots[0]?.id ?? '');
  const active = hotspots.find((item) => item.id === activeId) ?? hotspots[0];
  const activeIndex = active ? hotspots.indexOf(active) : 0;
  const plate = assetById.get('spinosaurus-skeletal-2020');
  const atlasCase = getAtlasCase(species.slug);

  if (!page?.anatomy) {
    return (
      <section id="anatomy" className="spx-section">
        <div className="shell">
          <SpeciesSectionHead
            index={index}
            title="Anatomy and adaptations"
            intro="The structures preserved in the skeleton, and the functions inferred from them."
          />
          <div className="spx-anat__blocks">
            {species.anatomy.map((section) => (
              <article className="spx-anat__block" key={section.title} data-reveal>
                <div className="spx-anat__block-head">
                  <h3 className="serif">{section.title}</h3>
                  <EvidenceTag kind={section.evidence} />
                </div>
                <p>{section.body}</p>
                <InlineSources ids={section.refs ?? []} />
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="anatomy" className="spx-section">
      <div className="shell">
        <SpeciesSectionHead
          index={index}
          title="The anatomy of an argument"
          intro={page.anatomy.intro}
        />

        <div className="spx-anat">
          <figure className="spx-anat__plate" data-reveal>
            <div className="spx-anat__image">
              <div className="spx-anat__map">
                <AssetImage
                  id="spinosaurus-skeletal-2020"
                  alt="Skeletal reconstruction of Spinosaurus aegyptiacus in lateral view."
                  sizes="(max-width: 1000px) 96vw, 78vw"
                  fit="contain"
                  priority
                />
                {hotspots.map((hotspot, index) => (
                  <button
                    key={hotspot.id}
                    type="button"
                    className={`spx-anat__hotspot spx-anat__hotspot--${hotspot.id}${hotspot.id === active?.id ? ' is-active' : ''}`}
                    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                    onClick={() => setActiveId(hotspot.id)}
                    aria-pressed={hotspot.id === active?.id}
                    aria-label={`${index + 1}. ${hotspot.label}: ${hotspot.structure}`}
                    data-cursor="link"
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
            <figcaption className="spx-anat__caption">
              <span className="label">Plate 01 — composite reconstruction</span>
              <span>
                {page.anatomy.note}
                {plate ? ` Drawing: ${plate.creator}, ${plate.license}.` : ''}
              </span>
            </figcaption>
          </figure>

          <div className="spx-anat__panel">
            <div className="spx-anat__list" role="group" aria-label="Anatomical features">
              {hotspots.map((hotspot, index) => (
                <button
                  key={hotspot.id}
                  type="button"
                  className={`spx-anat__item${hotspot.id === active?.id ? ' is-active' : ''}`}
                  onClick={() => setActiveId(hotspot.id)}
                  aria-pressed={hotspot.id === active?.id}
                  data-cursor="link"
                >
                  <span className="spx-anat__item-num mono">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="spx-anat__item-label label">{hotspot.label}</span>
                  <span className="spx-anat__item-structure">{hotspot.structure}</span>
                </button>
              ))}
            </div>

            {active ? (
              <div className="spx-anat__detail" aria-live="polite" key={active.id}>
                <p className="label spx-anat__detail-index">
                  {String(activeIndex + 1).padStart(2, '0')} /{' '}
                  {String(hotspots.length).padStart(2, '0')}
                </p>
                <div className="spx-anat__detail-head">
                  <h3 className="serif">{active.label}</h3>
                  <EvidenceTag kind={active.evidence} />
                </div>
                <p className="spx-anat__structure mono">{active.structure}</p>
                <p className="spx-anat__body">{active.body}</p>
                <InlineSources ids={active.refs} />
              </div>
            ) : null}
          </div>
        </div>

        {atlasCase ? (
          <div className="spx-anat__atlas-link">
            <div>
              <p className="label">Go deeper</p>
              <p className="serif">Read this skeleton in the anatomical atlas.</p>
            </div>
            <Link to={`/anatomy?species=${species.slug}`} data-cursor="link">
              Open the {atlasCase.scope === 'full-body' ? 'full-body atlas' : 'skull study'}{' '}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { AtlasEvidenceTag } from '../../components/ui/AtlasEvidenceTag';
import { InlineSources } from '../../components/ui/Sources';
import type { AtlasCase } from '../../data/types';
import { anatomicalAtlas, speciesBySlug } from '../../data';

type Props = {
  atlasCase: AtlasCase;
  onOpenStructure: (id: string) => void;
};

const KIND_LABEL: Record<string, string> = {
  feeding: 'Feeding',
  locomotion: 'Locomotion',
  support: 'Support & buoyancy',
  display: 'Display',
  posture: 'Posture',
};

/**
 * Adaptation rows are arguments, not exhibits. Each one names the structures
 * it uses and the evidence class of its conclusion.
 */
export function AtlasAdaptations({ atlasCase, onOpenStructure }: Props) {
  const species = speciesBySlug.get(atlasCase.speciesId);
  const categoryLabel = (id: string) =>
    anatomicalAtlas.categories.find((category) => category.id === id)?.shortLabel ?? 'Internal';

  return (
    <section className="atlas-adaptations" id="adaptations" aria-labelledby="atlas-adaptations-title">
      <div className="shell">
        <div className="atlas-section-head">
          <div>
            <p className="label">02 — Understand adaptations</p>
            <h2 className="serif" id="atlas-adaptations-title">
              Function is an argument.
            </h2>
          </div>
          <div className="atlas-section-head__body">
            <p>
              An anatomical structure can be measured. Its function is a claim about how that
              structure was used, usually built from comparison and biomechanics. These entries keep
              the claim and its evidence in the same frame.
            </p>
            {species ? (
              <Link className="text-link" to={`/species/${species.slug}`}>
                Read the full {species.scientificName} dossier <span aria-hidden="true">↗</span>
              </Link>
            ) : null}
          </div>
        </div>

        <div className="atlas-adaptations__list">
          {atlasCase.adaptations.map((adaptation, index) => (
            <article className="atlas-adaptation" key={adaptation.id}>
              <div className="atlas-adaptation__marker">
                <span className="mono">{String(index + 1).padStart(2, '0')}</span>
                <span className="label">{KIND_LABEL[adaptation.kind] ?? 'Function'}</span>
              </div>
              <div className="atlas-adaptation__copy">
                <h3 className="serif">{adaptation.title}</h3>
                <p>{adaptation.summary}</p>
                <InlineSources ids={adaptation.refs} />
              </div>
              <div className="atlas-adaptation__links">
                <p className="label">Anatomy used</p>
                <div className="atlas-adaptation__chips">
                  {adaptation.structureIds.map((id) => {
                    const structure = atlasCase.structures.find((item) => item.id === id);
                    if (!structure) return null;
                    const category = categoryLabel(structure.category);
                    return (
                      <button
                        key={id}
                        type="button"
                        className="atlas-structure-chip"
                        onClick={() => onOpenStructure(id)}
                        data-cursor="link"
                      >
                        <span>{structure.shortName}</span>
                        <span className="mono" aria-hidden="true">
                          {category === structure.shortName ? '↗' : `${category} ↗`}
                        </span>
                        <span className="visually-hidden">
                          Open {structure.name} anatomy for {adaptation.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <AtlasEvidenceTag kind={adaptation.evidence} />
              </div>
            </article>
          ))}
        </div>

        <p className="atlas-adaptations__note">
          The absence of an entry is meaningful. This atlas has no dedicated sensory, flight or
          defence modules for these animals because the available material does not support them.
        </p>
      </div>
    </section>
  );
}

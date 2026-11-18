import { Link } from 'react-router-dom';
import { AssetImage } from '../../components/ui/AssetImage';
import { SpeciesPlate } from '../../components/species/SpeciesPlate';
import type { RelatedEntry } from '../../data';
import type { RelationshipKind } from '../../data/types';
import { SpeciesSectionHead } from './SpeciesSectionHead';

type Props = {
  related: RelatedEntry[];
  note?: string;
  index?: string;
};

const KIND_LABELS: Record<RelationshipKind, string> = {
  genus: 'Same genus',
  family: 'Same family',
  context: 'Same time and place',
  period: 'Same period',
  region: 'Same region',
  clade: 'Broad clade',
  ecology: 'Ecological comparison',
};

const GROUPS: { id: string; kinds: RelationshipKind[]; title: string; intro: string }[] = [
  {
    id: 'close',
    kinds: ['genus', 'family'],
    title: 'Close relatives',
    intro: 'Shared classification below the level of the wider dinosaur tree. These are evolutionary relationships, not merely visual similarities.',
  },
  {
    id: 'context',
    kinds: ['context', 'period', 'region'],
    title: 'Shared time or place',
    intro: 'Animals that overlapped in geological time or geography. Context can suggest comparison, but it does not imply a close family relationship.',
  },
  {
    id: 'broad',
    kinds: ['clade', 'ecology'],
    title: 'Broader comparisons',
    intro: 'Distant branches and ecological parallels. These links are explicitly labelled so that analogy is not mistaken for ancestry.',
  },
];

/** Links into the wider archive, grouped by the kind of relationship claimed. */
export function SpeciesRelated({ related, note, index = '08' }: Props) {
  if (!related.length) return null;

  return (
    <section id="related" className="spx-section">
      <div className="shell">
        <SpeciesSectionHead
          index={index}
          title="Elsewhere in the archive"
          intro={
            note ??
            'Related specimens in the archive. Every entry links to its own dossier, with its own sources and evidence notes.'
          }
        />

        {GROUPS.map((group) => {
          const entries = related.filter((entry) => group.kinds.includes(entry.kind));
          if (!entries.length) return null;

          return (
            <div
              className="spx-rel-group"
              key={group.id}
              role="group"
              aria-labelledby={`related-${group.id}`}
            >
              <div className="spx-rel-group__head">
                <h3 className="serif" id={`related-${group.id}`}>
                  {group.title}
                </h3>
                <p>{group.intro}</p>
              </div>

              <div className={`spx-rel${entries.length === 2 ? ' spx-rel--pair' : ''}`}>
                {entries.map((entry) => (
                  <Link
                    key={entry.species.slug}
                    to={`/species/${entry.species.slug}`}
                    className="spx-rel__card"
                    data-cursor="view"
                    data-reveal
                  >
                    <div className="spx-rel__media">
                      {entry.species.image ? (
                        <AssetImage
                          id={entry.species.image}
                          alt={`Life reconstruction of ${entry.species.scientificName}.`}
                          sizes="(max-width: 900px) 94vw, 30vw"
                          fit="contain"
                        />
                      ) : (
                        <SpeciesPlate species={entry.species} size="thumb" />
                      )}
                    </div>
                    <div className="spx-rel__body">
                      <p className="label spx-rel__kind">{KIND_LABELS[entry.kind]}</p>
                      <p className="label spx-rel__meta">
                        {entry.species.periodLabel} · {entry.species.group}
                      </p>
                      <h4 className="serif">{entry.species.scientificName}</h4>
                      <p className="spx-rel__common">{entry.species.commonName}</p>
                      <p className="spx-rel__reason">{entry.reason}</p>
                      <span className="spx-rel__arrow" aria-hidden="true">
                        ↗
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

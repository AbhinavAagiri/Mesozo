import { useState } from 'react';
import { Link } from 'react-router-dom';
import { familyOf } from '../../data';
import { classificationNodeForTaxon } from '../../data/classification';
import type { Species, SpeciesPageContent } from '../../data/types';
import { SpeciesSectionHead } from './SpeciesSectionHead';

type Props = {
  species: Species;
  page?: SpeciesPageContent;
  index?: string;
};

/** Taxonomy as a readable hierarchy, with notes that open in place. */
export function SpeciesTaxonomy({ species, page, index = '02' }: Props) {
  const notes = new Map((page?.taxonomy.notes ?? []).map((note) => [note.value, note.note]));
  const family = familyOf(species);
  const familyNode = classificationNodeForTaxon(family);
  const initial = family && notes.has(family) ? family : null;
  const [open, setOpen] = useState<string | null>(initial);

  return (
    <section id="classification" className="spx-section spx-section--tint">
      <div className="shell">
        <SpeciesSectionHead
          index={index}
          title="Where it sits"
          intro={
            page?.taxonomy.intro ??
            'The classification used across this archive, from the animal kingdom down to the species.'
          }
        />

        <div className="spx-tax">
          <aside className="spx-tax__aside" data-reveal>
            <p className="label">Classification</p>
            <p className="serif">{species.group}</p>
            <p className="spx-tax__note">
              {species.scientificName} is one species in the {family ?? species.groupKey} branch of
              the dinosaur tree. Ranks above the family are a map of relationships, not a ladder of
              importance.
            </p>
            {familyNode ? (
              <Link className="spx-tax__explore" to={`/classification?node=${familyNode.id}`}>
                Explore this branch <span aria-hidden="true">↗</span>
              </Link>
            ) : null}
          </aside>

          <ol className="spx-tax__list">
            {species.taxonomy.map((row, index) => {
              const note = notes.get(row.value);
              const isOpen = open === row.value;

              return (
                <li className="spx-taxon" key={`${row.rank}-${row.value}`} data-reveal>
                  <div
                    className="spx-taxon__row"
                    style={{ paddingLeft: `${Math.min(index, 6) * 0.55}rem` }}
                  >
                    <span className="spx-taxon__rank label">{row.rank}</span>
                    <span className="spx-taxon__value serif">{row.value}</span>
                    {note ? (
                      <>
                        <span className="spx-taxon__leader" aria-hidden="true" />
                        <button
                          type="button"
                          className="spx-taxon__toggle mono"
                          aria-expanded={isOpen}
                          aria-controls={`taxon-note-${index}`}
                          onClick={() => setOpen(isOpen ? null : row.value)}
                          data-cursor="link"
                        >
                          <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
                          <span className="visually-hidden">
                            {isOpen ? 'Hide' : 'Show'} note on {row.value}
                          </span>
                        </button>
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                      </>
                    )}
                  </div>
                  {note && isOpen ? (
                    <p className="spx-taxon__note" id={`taxon-note-${index}`}>
                      {note}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

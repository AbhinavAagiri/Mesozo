import { Link } from 'react-router-dom';
import { getAtlasCase, getPeriod } from '../../data';
import { ancientWorldForSpecies } from '../../data/world';
import { glossaryTermsFor } from '../../data/learning';
import type { Species } from '../../data/types';
import { SpeciesSectionHead } from './SpeciesSectionHead';

type Props = {
  species: Species;
  index?: string;
};

const GROUP_GUIDE: Record<string, { slug: string; label: string }> = {
  Theropoda: { slug: 'major-dinosaur-groups', label: 'Where theropods sit in the tree' },
  Sauropodomorpha: { slug: 'major-dinosaur-groups', label: 'Where sauropodomorphs sit' },
  Ornithischia: { slug: 'major-dinosaur-groups', label: 'Where ornithischians sit' },
  Saurischia: { slug: 'major-dinosaur-groups', label: 'The saurischian branch' },
};

/**
 * A reading frame for every dossier. It contains no species-specific claims:
 * it points a new reader to the concepts, the world context and the evidence
 * standard needed to understand the record below.
 */
export function SpeciesOrientation({ species, index = '02' }: Props) {
  const period = getPeriod(species.period);
  const world = ancientWorldForSpecies(species.slug);
  const atlasCase = getAtlasCase(species.slug);
  const groupGuide = GROUP_GUIDE[species.groupKey] ?? {
    slug: 'what-is-a-dinosaur',
    label: 'What makes a dinosaur',
  };
  const terms = glossaryTermsFor([
    'dinosauria',
    species.groupKey === 'Ornithischia'
      ? 'ornithischian'
      : species.groupKey === 'Sauropodomorpha'
        ? 'sauropodomorph'
        : species.groupKey === 'Theropoda'
          ? 'theropod'
          : 'saurischia',
    'fossil',
    'holotype',
    'inference',
  ]);

  return (
    <section id="orientation" className="spx-section spx-section--tint spx-orientation">
      <div className="shell">
        <SpeciesSectionHead
          index={index}
          title="How to read this dossier"
          intro="You do not need to know the terminology before you begin. These three routes explain the animal, place it in a world, and show how to test the claims that follow."
        />

        <div className="spx-orientation__grid">
          <article className="spx-orientation__column">
            <p className="label">01 — Start with the animal</p>
            <h3 className="serif">What kind of dinosaur is this?</h3>
            <p>
              {species.scientificName} is placed in {species.group}. The branch is a hypothesis about
              relationships, not a ladder of progress.
            </p>
            <div className="spx-orientation__links">
              <Link to={`/learn/${groupGuide.slug}`}>
                {groupGuide.label} <span aria-hidden="true">↗</span>
              </Link>
              <Link to="/learn/what-is-a-dinosaur">
                What is a dinosaur? <span aria-hidden="true">↗</span>
              </Link>
              {atlasCase ? (
                <Link to={`/anatomy?species=${species.slug}`}>
                  Read the skeleton in the atlas <span aria-hidden="true">↗</span>
                </Link>
              ) : null}
            </div>
          </article>

          <article className="spx-orientation__column">
            <p className="label">02 — Place it in a world</p>
            <h3 className="serif">The time and the rock.</h3>
            <p>
              The dossier dates this animal to the {period.name}, {species.ageLabel}. A period is a
              geological interval, not a single habitat; regional environments differed.
            </p>
            <div className="spx-orientation__links">
              <Link to={`/deep-time?period=${period.id}`}>
                {period.name} in Deep Time <span aria-hidden="true">↗</span>
              </Link>
              {world ? (
                <Link to={`/prehistoric-world/ecosystem/${world.formation.id}`}>
                  {world.formation.name} — ancient world <span aria-hidden="true">↗</span>
                </Link>
              ) : (
                <Link to="/prehistoric-world#worlds">
                  Explore ancient worlds <span aria-hidden="true">↗</span>
                </Link>
              )}
              <Link to="/learn/ancient-worlds">
                How ancient worlds are reconstructed <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </article>

          <article className="spx-orientation__column">
            <p className="label">03 — Test the claim</p>
            <h3 className="serif">Where the evidence stops.</h3>
            <p>
              This dossier contains {species.fossilEvidence.length} evidence-tagged fossil sections
              and {new Set(species.references).size} linked references. A citation identifies where a
              claim can be checked; it is not a guarantee that every interpretation is settled.
            </p>
            <div className="spx-orientation__links">
              <Link to="/about#evidence">
                Read the archive evidence key <span aria-hidden="true">↗</span>
              </Link>
              <Link to="/fossil-evidence#standards">
                Source hierarchy and standards <span aria-hidden="true">↗</span>
              </Link>
              <Link to="/learn/reconstructing-extinct-animals">
                How reconstruction works <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </article>
        </div>

        <div className="spx-orientation__terms">
          <p className="label">Key terms in this record</p>
          {terms.map((term) => (
            <Link key={term.id} to={`/glossary#${term.id}`}>
              {term.term}
            </Link>
          ))}
          <Link to="/glossary">
            Full glossary <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

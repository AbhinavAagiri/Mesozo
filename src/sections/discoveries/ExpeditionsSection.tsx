import { Link } from 'react-router-dom';
import { InlineSources } from '../../components/ui/Sources';
import {
  discoveryExpeditions,
  discoveryFormationById,
  discoveryLocationById,
  discoveryResearchersForExpedition,
  discoverySpecimenById,
  speciesBySlug,
} from '../../data';
import type { DiscoveryExpedition } from '../../data/types';

function ExpeditionCard({ expedition }: { expedition: DiscoveryExpedition }) {
  const researchers = discoveryResearchersForExpedition(expedition);
  const locations = expedition.locationIds
    .map((id) => discoveryLocationById.get(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const formations = expedition.formationIds
    .map((id) => discoveryFormationById.get(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const specimens = expedition.specimenIds
    .map((id) => discoverySpecimenById.get(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <article className="dsc-expedition" id={`expedition-${expedition.id}`} data-reveal>
      <div className="dsc-expedition__head">
        <p className="label">{expedition.dateLabel}</p>
        <p className="mono">Field record</p>
      </div>
      <h3 className="serif">{expedition.name}</h3>
      <p className="dsc-expedition__summary">{expedition.summary}</p>

      <dl className="dsc-expedition__data">
        <div>
          <dt className="label">People</dt>
          <dd>{researchers.map((person) => person.name).join(' · ') || 'Not stated'}</dd>
        </div>
        <div>
          <dt className="label">Institution</dt>
          <dd>{expedition.institutions.join(' · ')}</dd>
        </div>
        <div>
          <dt className="label">Region</dt>
          <dd>
            {locations.map((location) => `${location.label}, ${location.country}`).join(' · ') ||
              'Not stated'}
          </dd>
        </div>
        <div>
          <dt className="label">Formation</dt>
          <dd>{formations.map((formation) => formation.name).join(' · ') || 'Not stated'}</dd>
        </div>
      </dl>

      {specimens.length ? (
        <div className="dsc-expedition__records">
          <p className="label">Specimen records</p>
          <ul>
            {specimens.map((specimen) => {
              const species = speciesBySlug.get(specimen.speciesId);
              return (
                <li key={specimen.id}>
                  <Link className="dsc-text-link" to={`/discoveries/specimen/${specimen.id}`}>
                    {specimen.identifier}
                    {species ? ` · ${species.scientificName}` : ''} <span aria-hidden="true">↗</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {!specimens.length && expedition.relatedSpeciesIds.length ? (
        <div className="dsc-expedition__records">
          <p className="label">Related species</p>
          <ul>
            {expedition.relatedSpeciesIds.map((slug) => {
              const species = speciesBySlug.get(slug);
              return species ? (
                <li key={slug}>
                  <Link className="dsc-text-link" to={`/species/${species.slug}`}>
                    {species.scientificName} <span aria-hidden="true">↗</span>
                  </Link>
                </li>
              ) : null;
            })}
          </ul>
        </div>
      ) : null}

      <InlineSources ids={expedition.refs} />
    </article>
  );
}

export function ExpeditionsSection() {
  return (
    <section className="dsc-expeditions" id="expeditions" aria-labelledby="dsc-expeditions-title">
      <div className="shell">
        <header className="dsc-section-head">
          <div className="dsc-section-head__index">
            <p className="label">02 — Expeditions &amp; excavations</p>
            <p className="label">{discoveryExpeditions.length} field records</p>
          </div>
          <div className="dsc-section-head__main">
            <h2 className="serif" id="dsc-expeditions-title">
              The work before <em>the specimen.</em>
            </h2>
            <p>
              A catalogue number is the end of a chain of fieldwork, preparation, transport and
              publication. These records document what the sources say about the people and places
              behind the fossils — and where the record runs out.
            </p>
          </div>
        </header>

        <div className="dsc-expeditions__grid">
          {discoveryExpeditions.map((expedition) => (
            <ExpeditionCard expedition={expedition} key={expedition.id} />
          ))}
        </div>

        <p className="dsc-archive__note">
          No licensed photographs of these excavations are held in the MESOZO asset archive. The
          records are text-led rather than illustrated with stand-in field photography.
        </p>
      </div>
    </section>
  );
}

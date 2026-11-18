import { Link, useParams } from 'react-router-dom';
import { AssetImage } from '../components/ui/AssetImage';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { InlineSources, ReferenceList } from '../components/ui/Sources';
import {
  assetById,
  discoveryEventForSpecimen,
  discoveryExpeditionForSpecimen,
  discoveryFormationForSpecimen,
  discoveryLocationForSpecimen,
  discoveryMilestonesForSpecimen,
  discoveryNeighbours,
  discoveryRecordNumber,
  discoveryResearchersForEvent,
  discoveryRevisionsForSpecimen,
  discoverySpecimenById,
  discoverySpecimensForSpecies,
  getAtlasCase,
  getAtlasStructure,
  getPeriod,
  speciesBySlug,
} from '../data';
import type { DiscoveryMedia } from '../data/types';
import { usePageTitle } from '../lib/usePageTitle';
import '../styles/pages.css';
import '../styles/discoveries.css';
import { MEDIA_ROLE_LABEL } from '../sections/discoveries/labels';

function MediaCredit({ media }: { media: DiscoveryMedia }) {
  const asset = assetById.get(media.assetId);
  if (!asset) return null;
  return (
    <a className="dsc-record__asset-credit" href={asset.sourceUrl} target="_blank" rel="noreferrer">
      {asset.creator} · {asset.license} · source ↗
    </a>
  );
}

export default function SpecimenPage() {
  const { id } = useParams();
  const specimen = discoverySpecimenById.get(id ?? '');
  const socialAssetId = specimen?.media[0]?.assetId;
  usePageTitle(specimen ? specimen.identifier : 'Specimen not found', {
    description: specimen
      ? specimen.significance
      : 'This specimen record is not in the MESOZO fossil archive.',
    image: socialAssetId ? `/assets/social/${socialAssetId}.jpg` : undefined,
    imageAlt: specimen ? `${specimen.identifier}: fossil specimen record.` : undefined,
    noindex: !specimen,
    breadcrumbs: specimen
      ? [
          { name: 'Home', path: '/' },
          { name: 'Discoveries', path: '/discoveries' },
          { name: 'Fossil archive', path: '/discoveries#archive' },
          { name: specimen.identifier, path: `/discoveries/specimen/${specimen.id}` },
        ]
      : undefined,
  });

  if (!specimen) {
    return (
      <div className="page notfound shell">
        <p className="label">404 — Not in the collection</p>
        <h1 className="serif">This specimen record does not exist.</h1>
        <Link className="text-link" to="/discoveries#archive">
          Back to the fossil archive <span aria-hidden="true">↗</span>
        </Link>
      </div>
    );
  }

  const species = speciesBySlug.get(specimen.speciesId);
  const event = discoveryEventForSpecimen(specimen);
  const location = discoveryLocationForSpecimen(specimen);
  const formation = discoveryFormationForSpecimen(specimen);
  const expedition = discoveryExpeditionForSpecimen(specimen);
  const researchers = discoveryResearchersForEvent(event);
  const period = species ? getPeriod(species.period) : undefined;
  const atlasCase = species ? getAtlasCase(species.slug) : undefined;
  const anatomyStructures = atlasCase
    ? specimen.anatomyStructureIds
        .map((structureId) => getAtlasStructure(atlasCase, structureId))
        .filter((structure): structure is NonNullable<typeof structure> => Boolean(structure))
    : [];
  const primaryMedia = specimen.media[0];
  const primaryAsset = primaryMedia ? assetById.get(primaryMedia.assetId) : undefined;
  const extraMedia = specimen.media.slice(1);

  const sameSpecies = discoverySpecimensForSpecies(specimen.speciesId);
  const explicitRelated = specimen.relatedSpecimenIds
    .map((relatedId) => discoverySpecimenById.get(relatedId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const relatedSpecimens = Array.from(
    new Map(
      [...sameSpecies, ...explicitRelated]
        .filter((item) => item.id !== specimen.id)
        .map((item) => [item.id, item]),
    ).values(),
  );
  const revisions = discoveryRevisionsForSpecimen(specimen);
  const milestones = discoveryMilestonesForSpecimen(specimen);
  const neighbours = discoveryNeighbours(specimen.id);
  const recordNumber = discoveryRecordNumber(specimen.id);

  return (
    <article className="dsc-record">
      <header className="dsc-record__hero" data-theme="dark">
        <div className="shell">
          <div className="dsc-record__crumbs">
            <Breadcrumbs
              tone="dark"
              items={[
                { label: 'Home', to: '/' },
                { label: 'Discoveries', to: '/discoveries' },
                { label: 'Fossil archive', to: '/discoveries#archive' },
                { label: specimen.identifier },
              ]}
            />
          </div>

          <div className="dsc-record__hero-grid">
            <div className="dsc-record__hero-copy">
              <p className="label dsc-record__kicker">
                Record {String(recordNumber).padStart(2, '0')} · {specimen.typeStatus}
              </p>
              <h1 className="serif">{specimen.identifier}</h1>
              <p className="dsc-record__species">
                {species ? (
                  <Link to={`/species/${species.slug}`}>
                    {species.scientificName} <span aria-hidden="true">↗</span>
                  </Link>
                ) : (
                  specimen.speciesId
                )}
                {species ? ` · ${species.commonName}` : null}
              </p>
              <p className="dsc-record__standfirst">{specimen.significance}</p>

              <dl className="dsc-record__hero-meta">
                <div>
                  <dt className="label">Type</dt>
                  <dd>{specimen.typeStatus}</dd>
                </div>
                <div>
                  <dt className="label">Discovery</dt>
                  <dd>{event?.dateLabel ?? 'Not stated'}</dd>
                </div>
                <div>
                  <dt className="label">Locality</dt>
                  <dd>{location?.label ?? 'Not stated'}</dd>
                </div>
                <div>
                  <dt className="label">Repository</dt>
                  <dd>{specimen.repository}</dd>
                </div>
              </dl>
            </div>

            <figure className="dsc-record__hero-figure">
              <div className="dsc-record__hero-media">
                {primaryMedia && primaryAsset ? (
                  <AssetImage
                    id={primaryMedia.assetId}
                    alt={`${specimen.identifier}: ${primaryMedia.caption}`}
                    sizes="(max-width: 900px) 92vw, 46vw"
                    fit="contain"
                    priority
                  />
                ) : (
                  <div className="dsc-record__placeholder">
                    <span className="label">No licensed specimen photograph</span>
                    <span className="serif">{specimen.identifier}</span>
                    <span className="mono">Catalogue record only</span>
                  </div>
                )}
              </div>
              {primaryMedia ? (
                <figcaption className="dsc-record__hero-caption">
                  <span className="label">{MEDIA_ROLE_LABEL[primaryMedia.role]}</span>
                  <span>{primaryMedia.caption}</span>
                  <MediaCredit media={primaryMedia} />
                </figcaption>
              ) : (
                <figcaption className="dsc-record__hero-caption">
                  <span className="label">Image status</span>
                  <span>
                    No photograph of this specimen is registered in the MESOZO asset archive. The
                    record is shown as a catalogue entry rather than a stand-in image.
                  </span>
                </figcaption>
              )}
            </figure>
          </div>
        </div>
      </header>

      <div className="dsc-record__layout shell">
        <aside className="dsc-record__rail">
          <p className="label">On this record</p>
          <nav aria-label="Specimen record sections">
            <a href="#identification">Identification</a>
            <a href="#discovery">Discovery history</a>
            <a href="#geology">Geological context</a>
            <a href="#evidence">Physical evidence</a>
            <a href="#significance">Significance</a>
            <a href="#anatomy">Anatomy</a>
            <a href="#research">Research history</a>
            <a href="#related">Related records</a>
          </nav>
          <div className="dsc-record__rail-foot">
            <p className="label">Archive record</p>
            <p className="mono">Specimen ledger · {specimen.typeGroup}</p>
            <Link className="dsc-text-link" to="/discoveries#archive">
              All specimens <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </aside>

        <div className="dsc-record__content">
          <section className="dsc-record__section" id="identification" aria-labelledby="identification-title">
            <header className="dsc-record__section-head">
              <p className="label">01 — Identification record</p>
              <h2 className="serif" id="identification-title">
                What the catalogue says.
              </h2>
            </header>
            <dl className="dsc-record__table">
              <div>
                <dt className="label">Organism</dt>
                <dd>
                  {species ? (
                    <Link to={`/species/${species.slug}`}>
                      {species.scientificName} <span aria-hidden="true">↗</span>
                    </Link>
                  ) : (
                    specimen.speciesId
                  )}
                </dd>
              </div>
              <div>
                <dt className="label">Specimen type</dt>
                <dd>{specimen.typeStatus}</dd>
              </div>
              <div>
                <dt className="label">Material</dt>
                <dd>{specimen.material}</dd>
              </div>
              <div>
                <dt className="label">Preservation</dt>
                <dd>{specimen.preservation}</dd>
              </div>
              <div>
                <dt className="label">Repository</dt>
                <dd>{specimen.repository}</dd>
              </div>
              <div>
                <dt className="label">Collection note</dt>
                <dd>{specimen.collectionNote}</dd>
              </div>
            </dl>
          </section>

          <section className="dsc-record__section" id="discovery" aria-labelledby="discovery-title">
            <header className="dsc-record__section-head">
              <p className="label">02 — Discovery history</p>
              <h2 className="serif" id="discovery-title">
                How it entered the record.
              </h2>
            </header>
            {event ? (
              <>
                <div className="dsc-record__event">
                  <p className="dsc-record__event-date serif">{event.dateLabel}</p>
                  <p>{event.summary}</p>
                </div>
                <dl className="dsc-record__table">
                  <div>
                    <dt className="label">People</dt>
                    <dd>
                      {researchers.length
                        ? researchers.map((person) => person.name).join(' · ')
                        : 'Not stated'}
                    </dd>
                  </div>
                  <div>
                    <dt className="label">Expedition</dt>
                    <dd>
                      {expedition ? (
                        <Link to={`/discoveries#expedition-${expedition.id}`}>
                          {expedition.name} <span aria-hidden="true">↗</span>
                        </Link>
                      ) : (
                        'No expedition record is linked'
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="label">Discovery date</dt>
                    <dd>{event.year ? event.dateLabel : `${event.dateLabel} — exact year not stated`}</dd>
                  </div>
                </dl>
                <InlineSources ids={event.refs} />
              </>
            ) : (
              <p className="dsc-record__missing">
                No separate discovery event is recorded for this specimen.
              </p>
            )}
          </section>

          <section className="dsc-record__section" id="geology" aria-labelledby="geology-title">
            <header className="dsc-record__section-head">
              <p className="label">03 — Geological context</p>
              <h2 className="serif" id="geology-title">
                The rock that held it.
              </h2>
            </header>
            <dl className="dsc-record__table">
              <div>
                <dt className="label">Formation</dt>
                <dd>{formation?.name ?? 'Not stated'}</dd>
              </div>
              <div>
                <dt className="label">Age</dt>
                <dd>{formation?.ageLabel ?? 'Not stated'}</dd>
              </div>
              <div>
                <dt className="label">Period</dt>
                <dd>
                  {period ? (
                    <Link to={`/deep-time?period=${period.id}`}>
                      {period.name} · {period.span} <span aria-hidden="true">↗</span>
                    </Link>
                  ) : (
                    'Not stated'
                  )}
                </dd>
              </div>
              <div>
                <dt className="label">Locality</dt>
                <dd>
                  {location
                    ? `${location.label}, ${location.country}`
                    : 'Not stated'}
                </dd>
              </div>
            </dl>
            {location ? <p className="dsc-record__coordinate-note">{location.coordinateNote}</p> : null}
            {formation?.note ? <p className="dsc-record__note">{formation.note}</p> : null}
            {formation ? <InlineSources ids={formation.refs} /> : null}
          </section>

          <section className="dsc-record__section" id="evidence" aria-labelledby="evidence-title">
            <header className="dsc-record__section-head">
              <p className="label">04 — Physical evidence</p>
              <h2 className="serif" id="evidence-title">
                What actually survives.
              </h2>
            </header>
            <div className="dsc-record__evidence-grid">
              <div>
                <h3 className="serif">Material</h3>
                <p>{specimen.material}</p>
              </div>
              <div>
                <h3 className="serif">Anatomy preserved</h3>
                <p>{specimen.anatomy}</p>
              </div>
              <div>
                <h3 className="serif">Preservation</h3>
                <p>{specimen.preservation}</p>
              </div>
            </div>
            <div className="dsc-record__caution">
              <p className="label">Do not confuse</p>
              <p>
                A cast, historical drawing or reconstructed mount can represent a specimen without
                being the fossil. The media labels on this record say which is which.
              </p>
            </div>
            {extraMedia.length ? (
              <div className="dsc-record__gallery">
                {extraMedia.map((media) => {
                  const asset = assetById.get(media.assetId);
                  return (
                    <figure className="dsc-record__gallery-item" key={media.assetId}>
                      <div className="dsc-record__gallery-media">
                        {asset ? (
                          <AssetImage
                            id={media.assetId}
                            alt={`${specimen.identifier}: ${media.caption}`}
                            sizes="(max-width: 760px) 92vw, 28vw"
                            fit="contain"
                          />
                        ) : null}
                      </div>
                      <figcaption>
                        <span className="label">{MEDIA_ROLE_LABEL[media.role]}</span>
                        <span>{media.caption}</span>
                        <MediaCredit media={media} />
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            ) : null}
          </section>

          <section className="dsc-record__section" id="significance" aria-labelledby="significance-title">
            <header className="dsc-record__section-head">
              <p className="label">05 — Scientific significance</p>
              <h2 className="serif" id="significance-title">
                Why this record matters.
              </h2>
            </header>
            <p className="dsc-record__lead">{specimen.significance}</p>
            <div className="dsc-record__uncertainty">
              <p className="label">Limits and uncertainty</p>
              <p>{specimen.uncertainty}</p>
            </div>
            <InlineSources ids={specimen.refs} />
          </section>

          <section className="dsc-record__section" id="anatomy" aria-labelledby="anatomy-title">
            <header className="dsc-record__section-head">
              <p className="label">Anatomy connection</p>
              <h2 className="serif" id="anatomy-title">
                Structures preserved.
              </h2>
            </header>
            {anatomyStructures.length ? (
              <ul className="dsc-record__anatomy">
                {anatomyStructures.map((structure) => (
                  <li key={structure.id}>
                    <Link
                      className="dsc-record-link"
                      to={`/anatomy?species=${specimen.speciesId}&structure=${structure.id}`}
                    >
                      <span className="label">{structure.shortName}</span>
                      <span>{structure.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="dsc-record__missing">
                {atlasCase
                  ? 'This record is not yet connected to a structure in the anatomical atlas.'
                  : 'No anatomical atlas case covers this species yet. The record does not invent an anatomical link.'}
              </p>
            )}
          </section>

          <section className="dsc-record__section" id="research" aria-labelledby="research-title">
            <header className="dsc-record__section-head">
              <p className="label">06 — Research history</p>
              <h2 className="serif" id="research-title">
                What the literature records.
              </h2>
            </header>
            <ReferenceList ids={specimen.publications} />
            {revisions.length ? (
              <div className="dsc-record__revisions">
                <p className="label">When the evidence changed</p>
                <ul>
                  {revisions.map((revision) => (
                    <li key={revision.id}>
                      <Link className="dsc-text-link" to={`/discoveries#revision-${revision.id}`}>
                        {revision.title} <span aria-hidden="true">↗</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>

          <section className="dsc-record__section" id="related" aria-labelledby="related-title">
            <header className="dsc-record__section-head">
              <p className="label">07 — Related records</p>
              <h2 className="serif" id="related-title">
                Continue through the archive.
              </h2>
            </header>

            {relatedSpecimens.length ? (
              <div className="dsc-record__related">
                <p className="label">Specimens</p>
                <ul>
                  {relatedSpecimens.map((related) => {
                    const relatedSpecies = speciesBySlug.get(related.speciesId);
                    return (
                      <li key={related.id}>
                        <Link className="dsc-record-link" to={`/discoveries/specimen/${related.id}`}>
                          <span className="label">{related.typeStatus}</span>
                          <span>{related.identifier}</span>
                          <span>{relatedSpecies?.scientificName ?? related.speciesId}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}

            {milestones.length ? (
              <div className="dsc-record__related">
                <p className="label">History milestones</p>
                <ul>
                  {milestones.map((milestone) => (
                    <li key={milestone.id}>
                      <Link className="dsc-text-link" to={`/discoveries#${milestone.id}`}>
                        {milestone.year} · {milestone.title} <span aria-hidden="true">↗</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {species ? (
              <Link className="dsc-record__species-cta" to={`/species/${species.slug}`}>
                <span className="label">Species profile</span>
                <span className="serif">{species.scientificName}</span>
                <span className="mono">Open the dossier ↗</span>
              </Link>
            ) : null}
          </section>

          <nav className="dsc-record__pager" aria-label="Specimen records">
            {neighbours.previous ? (
              <Link className="dsc-record__pager-link" to={`/discoveries/specimen/${neighbours.previous.id}`}>
                <span className="label">Previous record</span>
                <span className="serif">{neighbours.previous.identifier}</span>
              </Link>
            ) : (
              <span />
            )}
            {neighbours.next ? (
              <Link className="dsc-record__pager-link dsc-record__pager-link--next" to={`/discoveries/specimen/${neighbours.next.id}`}>
                <span className="label">Next record</span>
                <span className="serif">{neighbours.next.identifier}</span>
              </Link>
            ) : null}
          </nav>
        </div>
      </div>
    </article>
  );
}

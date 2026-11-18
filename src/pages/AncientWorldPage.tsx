import { Link, useParams } from 'react-router-dom';
import { AssetImage } from '../components/ui/AssetImage';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ReferenceList } from '../components/ui/Sources';
import { DestinationNav } from '../components/layout/DestinationNav';
import { ancientWorlds, getAncientWorld } from '../data/world';
import { NAV } from '../data/nav';
import { usePageTitle } from '../lib/usePageTitle';
import '../styles/pages.css';
import '../styles/destination.css';

const DESTINATION = NAV.find((item) => item.id === 'world')!;

export default function AncientWorldPage() {
  const { id } = useParams();
  const world = getAncientWorld(id);
  usePageTitle(world ? `${world.formation.name} — ancient world` : 'Ancient world not found', {
    description: world
      ? `${world.formation.name}: ${world.formation.ageLabel}. The formation context, preserved species and specimen records held in the MESOZO fossil archive.`
      : 'This ancient-world record is not in the MESOZO archive.',
    noindex: !world,
    breadcrumbs: world
      ? [
          { name: 'Home', path: '/' },
          { name: 'Prehistoric World', path: '/prehistoric-world' },
          { name: 'Ancient worlds', path: '/prehistoric-world#worlds' },
          {
            name: world.formation.name,
            path: `/prehistoric-world/ecosystem/${world.formation.id}`,
          },
        ]
      : undefined,
  });

  if (!world) {
    return (
      <div className="page notfound shell">
        <p className="label">404 — Not in the record</p>
        <h1 className="serif">This ancient world is not in the archive.</h1>
        <Link className="text-link" to="/prehistoric-world#worlds">
          Back to the ancient worlds <span aria-hidden="true">↗</span>
        </Link>
      </div>
    );
  }

  const referenceIds = Array.from(
    new Set([
      ...world.formation.refs,
      ...world.specimens.flatMap((specimen) => specimen.refs),
      ...world.specimens.flatMap((specimen) => specimen.publications),
    ]),
  );
  const countries = Array.from(new Set(world.locations.map((place) => place.country)));
  const nextWorld = ancientWorlds[(ancientWorlds.findIndex((item) => item.formation.id === world.formation.id) + 1) % ancientWorlds.length];

  return (
    <article className="page ecosystem-page">
      <header className="eco-hero" data-theme="dark">
        <div className="shell">
          <div className="eco-hero__crumbs">
            <Breadcrumbs
              tone="dark"
              items={[
                { label: 'Home', to: '/' },
                { label: 'Prehistoric World', to: '/prehistoric-world' },
                { label: 'Ancient worlds', to: '/prehistoric-world#worlds' },
                { label: world.formation.name },
              ]}
            />
          </div>

          <div className="eco-hero__grid">
            <div className="eco-hero__copy">
              <p className="label eco-hero__kicker">
                {world.period.name} · {world.formation.ageLabel}
              </p>
              <h1 className="serif">{world.formation.name}</h1>
              <p className="eco-hero__standfirst">{world.formation.note}</p>
              <p className="eco-hero__places">
                {world.locations.map((place) => place.label).join(' · ')}
                {countries.length ? ` — ${countries.join(', ')}` : ''}
              </p>
            </div>

            <dl className="eco-hero__facts">
              <div>
                <dt className="label">Period</dt>
                <dd>
                  <Link to={`/deep-time?period=${world.period.id}`}>
                    {world.period.name} <span aria-hidden="true">↗</span>
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="label">Age</dt>
                <dd>{world.formation.ageLabel}</dd>
              </div>
              <div>
                <dt className="label">Organisms preserved</dt>
                <dd>{world.species.length} archived species</dd>
              </div>
              <div>
                <dt className="label">Specimen records</dt>
                <dd>{world.specimens.length}</dd>
              </div>
            </dl>
          </div>
        </div>
      </header>

      <DestinationNav destination={DESTINATION} current="/prehistoric-world" />

      <section className="eco-intro shell" aria-labelledby="eco-intro-title">
        <div className="eco-intro__rail">
          <p className="label">The setting</p>
          <p className="mono">Formation record</p>
        </div>
        <div className="eco-intro__copy">
          <h2 className="serif" id="eco-intro-title">
            What the rock unit records.
          </h2>
          <p>
            {world.formation.note} This page gathers the specimens the archive connects to the
            formation. It is not a complete census of the ancient ecosystem, and the formation may
            span more time than any single species occurrence.
          </p>
          <div className="eco-intro__links">
            <Link to={`/deep-time?period=${world.period.id}`}>
              {world.period.name} in Deep Time <span aria-hidden="true">↗</span>
            </Link>
            <Link to="/learn/ancient-worlds">
              How ancient worlds are reconstructed <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="eco-species" aria-labelledby="eco-species-title">
        <div className="shell">
          <div className="explore-section-head">
            <div>
              <p className="label">Organisms in the record</p>
              <h2 className="serif" id="eco-species-title">
                What the formation preserves.
              </h2>
            </div>
            <p>
              These species have at least one specimen connected to the formation in this archive.
              The list is an evidence index, not a reconstructed food web.
            </p>
          </div>

          <div className="eco-species__grid">
            {world.species.map((item) => {
              const specimen = world.specimens.find((entry) => entry.speciesId === item.slug);
              return (
                <article className="eco-species__item" key={item.slug}>
                  <Link
                    className="eco-species__figure"
                    to={`/species/${item.slug}`}
                    data-cursor="view"
                  >
                    {item.image ? (
                      <AssetImage
                        id={item.image}
                        alt={`Life reconstruction of ${item.scientificName}.`}
                        sizes="(max-width: 900px) 88vw, 28vw"
                        fit="contain"
                      />
                    ) : (
                      <span className="label">Database record</span>
                    )}
                  </Link>
                  <div className="eco-species__body">
                    <p className="label">{item.periodLabel} · {item.group}</p>
                    <h3 className="serif">{item.scientificName}</h3>
                    <p>{item.commonName}</p>
                    <p className="eco-species__note">{item.tagline}</p>
                    {specimen ? (
                      <Link className="text-link" to={`/discoveries/specimen/${specimen.id}`}>
                        Specimen {specimen.identifier} <span aria-hidden="true">↗</span>
                      </Link>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="eco-specimens shell" aria-labelledby="eco-specimens-title">
        <div className="eco-specimens__head">
          <div>
            <p className="label">Specimen ledger</p>
            <h2 className="serif" id="eco-specimens-title">
              Evidence with a catalogue number.
            </h2>
          </div>
          <p>
            A specimen is a physical object with a repository and a history. A cast or reconstruction
            may represent it, but only the catalogue record identifies the fossil material.
          </p>
        </div>

        <div className="eco-specimens__table">
          <div className="eco-specimens__row eco-specimens__row--head">
            <span>Specimen</span>
            <span>Organism</span>
            <span>Material</span>
            <span>Record</span>
          </div>
          {world.specimens.map((specimen) => (
            <div className="eco-specimens__row" key={specimen.id}>
              <span className="serif">{specimen.identifier}</span>
              <span>{world.species.find((item) => item.slug === specimen.speciesId)?.scientificName ?? specimen.speciesId}</span>
              <span>{specimen.material}</span>
              <Link to={`/discoveries/specimen/${specimen.id}`}>
                Open record <span aria-hidden="true">↗</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="eco-limits" data-theme="dark" aria-labelledby="eco-limits-title">
        <div className="shell eco-limits__grid">
          <p className="label">Limits</p>
          <div>
            <h2 className="serif" id="eco-limits-title">
              Shared rock is not a shared scene.
            </h2>
            <p>
              Two species in the same formation may have lived at different times within its
              depositional history, in different local habitats, or may simply never have been
              preserved together. The archive can identify co-occurrence in a rock unit. It does not
              turn that into predation, competition or social behaviour without separate evidence.
            </p>
            <p>
              Environmental descriptions are interpretations of sedimentology and fossil
              assemblages. They are not photographs of an ancient landscape.
            </p>
          </div>
          <Link className="eco-limits__next" to={`/prehistoric-world/ecosystem/${nextWorld.formation.id}`}>
            <span className="label">Next world</span>
            <span className="serif">{nextWorld.formation.name}</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="eco-sources shell" aria-labelledby="eco-sources-title">
        <div className="eco-sources__head">
          <p className="label">References</p>
          <h2 className="serif" id="eco-sources-title">
            The record behind this world.
          </h2>
          <Link className="text-link" to="/fossil-evidence">
            How evidence is classified <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <ReferenceList ids={referenceIds} />
      </section>

      <nav className="eco-pager shell" aria-label="Ancient worlds">
        <Link to="/prehistoric-world#worlds" className="eco-pager__all">
          <span className="label">All ancient worlds</span>
          <span className="serif">The formation register</span>
        </Link>
        <Link to={`/prehistoric-world/ecosystem/${nextWorld.formation.id}`} className="eco-pager__next">
          <span className="label">Continue</span>
          <span className="serif">{nextWorld.formation.name}</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </nav>
    </article>
  );
}

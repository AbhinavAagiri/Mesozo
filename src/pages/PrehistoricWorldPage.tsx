import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { DestinationNav } from '../components/layout/DestinationNav';
import { GuideLink } from '../components/learning/GuideLink';
import { ancientWorlds, ancientWorldSiteCount } from '../data/world';
import { deepTimeEvents, geoUnits, periods, speciesForPeriod } from '../data';
import { learningTopics } from '../data/learning';
import { NAV } from '../data/nav';
import { usePageTitle } from '../lib/usePageTitle';
import '../styles/pages.css';
import '../styles/destination.css';

const DESTINATION = NAV.find((item) => item.id === 'world')!;

const WORLD_GUIDES = ['reading-deep-time', 'how-fossils-form', 'end-cretaceous-extinction', 'birds-living-dinosaurs']
  .map((slug) => learningTopics.find((topic) => topic.slug === slug))
  .filter((topic): topic is (typeof learningTopics)[number] => Boolean(topic));

export default function PrehistoricWorldPage() {
  usePageTitle('Prehistoric World: deep time and ancient ecosystems', {
    description:
      'Explore the world the dinosaurs inhabited: the geological time scale, Mesozoic climates and geography, and seven fossil formations with their preserved organisms.',
  });

  const periodStats = periods.map((period) => ({
    period,
    count: speciesForPeriod(period.id).length,
    worlds: ancientWorlds.filter((world) => world.formation.periodId === period.id),
  }));
  const periodCount = geoUnits.filter((unit) => unit.rank === 'period').length;

  return (
    <div className="page world-page">
      <PageHeader
        index="02"
        kicker="Prehistoric World"
        title={
          <>
            The world <em>around the animal.</em>
          </>
        }
        intro="A species is one part of a larger record. This is the place to read the time, the climate, the moving continents and the rock formations that preserve a whole community of organisms."
        meta={[
          { label: 'Periods', value: String(periodCount) },
          { label: 'Formations', value: String(ancientWorlds.length) },
          { label: 'Field sites', value: String(ancientWorldSiteCount) },
          { label: 'Sourced events', value: String(deepTimeEvents.length) },
        ]}
      />

      <DestinationNav destination={DESTINATION} current="/prehistoric-world" />

      <section className="world-thesis" data-theme="dark" aria-labelledby="world-thesis-title">
        <div className="shell world-thesis__grid">
          <p className="label">The premise</p>
          <div>
            <p className="world-thesis__statement serif" id="world-thesis-title">
              A formation is not a diorama.
            </p>
            <p className="world-thesis__body">
              The rock records where sediments accumulated, what lived and was buried there, and
              what happened afterwards. A scene is a reconstruction built from those fragments.
              MESOZO keeps the distinction visible: ancient worlds are read from evidence, not
              imagined from atmosphere.
            </p>
          </div>
          <dl className="world-thesis__stats">
            <div>
              <dt>Deep time</dt>
              <dd className="serif">4.567 Ga</dd>
            </div>
            <div>
              <dt>Mesozoic</dt>
              <dd className="serif">252–66 Ma</dd>
            </div>
            <div>
              <dt>Archive worlds</dt>
              <dd className="serif">{ancientWorlds.length}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="world-periods shell" aria-labelledby="world-periods-title">
        <div className="explore-section-head">
          <div>
            <p className="label">The Mesozoic</p>
            <h2 className="serif" id="world-periods-title">
              Three periods, not three moods.
            </h2>
          </div>
          <p>
            Periods are intervals of geological time with boundaries and subdivisions. Each one
            contains regional worlds that differed from one another, so “the Jurassic” is a
            convenient label, not a single landscape.
          </p>
        </div>

        <div className="world-periods__list">
          {periodStats.map(({ period, count, worlds }, index) => (
            <article className="world-period" key={period.id}>
              <span className="world-period__index mono">0{index + 1}</span>
              <div className="world-period__head">
                <h3 className="serif">{period.name}</h3>
                <p className="mono">{period.span}</p>
              </div>
              <div className="world-period__body">
                <p>{period.summary}</p>
                <p className="world-period__climate">
                  <span className="label">Climate & environment</span>
                  {period.climate}
                </p>
              </div>
              <div className="world-period__links">
                <span className="label">In the archive</span>
                <span className="mono">
                  {count} dossier{count === 1 ? '' : 's'} · {worlds.length} formation
                  {worlds.length === 1 ? '' : 's'}
                </span>
                <Link to={`/deep-time?period=${period.id}`}>
                  Open the {period.name} record <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="world-worlds" id="worlds" aria-labelledby="world-worlds-title">
        <div className="shell">
          <div className="explore-section-head">
            <div>
              <p className="label">Ancient worlds</p>
              <h2 className="serif" id="world-worlds-title">
                Seven windows in the rock.
              </h2>
            </div>
            <p>
              These pages gather the specimens the archive connects to a formation. They can tell
              you what was preserved in the same rock unit. They cannot tell you that every animal
              met, competed or shared a single habitat.
            </p>
          </div>

          <div className="world-register">
            {ancientWorlds.map((world, index) => {
              const countries = Array.from(new Set(world.locations.map((place) => place.country)));
              return (
                <article className="world-row" key={world.formation.id}>
                  <span className="world-row__index mono">{String(index + 1).padStart(2, '0')}</span>
                  <div className="world-row__identity">
                    <p className="label">
                      {world.period.name} · {world.formation.ageLabel}
                    </p>
                    <h3 className="serif">{world.formation.name}</h3>
                    <p className="world-row__where">
                      {world.locations.map((place) => place.label).join(' · ')}
                      {countries.length ? ` — ${countries.join(', ')}` : ''}
                    </p>
                  </div>
                  <div className="world-row__context">
                    <p>{world.formation.note}</p>
                    <div className="world-row__species">
                      {world.species.map((item) => (
                        <Link key={item.slug} to={`/species/${item.slug}`} data-cursor="link">
                          {item.scientificName}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link
                    className="world-row__open"
                    to={`/prehistoric-world/ecosystem/${world.formation.id}`}
                    data-cursor="link"
                  >
                    <span className="label">{world.specimens.length} specimen records</span>
                    <span>Read the world</span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                </article>
              );
            })}
          </div>

          <p className="world-register__note">
            Formation ages follow the archive’s discovery records and the International
            Chronostratigraphic Chart. A formation can span more time than a single species
            occurrence; the age labels are context, not exact co-occurrence dates.
          </p>
        </div>
      </section>

      <section className="world-method shell" aria-labelledby="world-method-title">
        <div className="world-method__head">
          <p className="label">Reading an ancient world</p>
          <h2 className="serif" id="world-method-title">
            What the rocks can support.
          </h2>
        </div>
        <div className="world-method__grid">
          <article>
            <span className="label">01 — Sediment</span>
            <h3 className="serif">Environment</h3>
            <p>
              Grain size and sedimentary structures indicate rivers, lakes, dunes, coasts or shallow
              seas. They reconstruct settings, not complete scenes.
            </p>
          </article>
          <article>
            <span className="label">02 — Organisms</span>
            <h3 className="serif">Presence</h3>
            <p>
              Pollen, plants, invertebrates and vertebrates show what lived in or near the setting.
              Preservation bias means the list is incomplete.
            </p>
          </article>
          <article>
            <span className="label">03 — Chemistry</span>
            <h3 className="serif">Climate</h3>
            <p>
              Isotopes and other proxies provide evidence about temperature, water and carbon. Each
              proxy has assumptions and uncertainty.
            </p>
          </article>
          <article>
            <span className="label">04 — Geography</span>
            <h3 className="serif">Position</h3>
            <p>
              Palaeogeographic reconstructions place continents and oceans. Coastlines and
              elevations are hypotheses, not survey maps.
            </p>
          </article>
        </div>
        <div className="world-method__foot">
          <Link className="text-link" to="/learn/ancient-worlds">
            Read the guide to reconstructing ancient worlds <span aria-hidden="true">↗</span>
          </Link>
          <Link className="text-link" to="/fossil-evidence">
            See how the evidence is classified <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="world-guides shell" aria-labelledby="world-guides-title">
        <div className="explore-section-head">
          <div>
            <p className="label">Go deeper</p>
            <h2 className="serif" id="world-guides-title">
              The world beyond the dinosaur.
            </h2>
          </div>
          <p>
            The geological atlas contains the full time scale; the field guide explains how to read
            it without assuming prior knowledge.
          </p>
        </div>
        <div className="world-guides__grid">
          {WORLD_GUIDES.map((topic, index) => (
            <GuideLink
              key={topic.id}
              index={index}
              link={{
                label: topic.title,
                to: `/learn/${topic.slug}`,
                note: topic.standfirst,
              }}
            />
          ))}
        </div>
        <Link className="world-deep-time" to="/deep-time">
          <span>
            <span className="label">The geological atlas</span>
            <span className="serif">Open Deep Time</span>
          </span>
          <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </div>
  );
}

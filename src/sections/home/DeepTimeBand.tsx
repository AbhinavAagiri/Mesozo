import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fieldAnalogues } from '../../data/field-photography';
import { periods, species } from '../../data';
import type { PeriodId } from '../../data/types';
import { useReveal } from '../../lib/useReveal';

const MESOZOIC: PeriodId[] = ['triassic', 'jurassic', 'cretaceous'];

const NOT_DINOSAURS = [
  { title: 'Pterosaurs', body: 'Flying reptiles, close relatives of dinosaurs — not dinosaurs.' },
  { title: 'Marine reptiles', body: 'Ichthyosaurs, plesiosaurs and mosasaurids lived alongside them.' },
  { title: 'Birds', body: 'Living dinosaurs: the only dinosaur lineage that survived 66 Ma.' },
];

export function DeepTimeBand() {
  const [active, setActive] = useState<PeriodId>('cretaceous');
  const period = periods.find((item) => item.id === active) ?? periods[2];
  const field = fieldAnalogues[active];
  const root = useReveal<HTMLElement>();
  const mesozoicPeriods = MESOZOIC.map((id) => periods.find((item) => item.id === id)).filter(
    (item): item is (typeof periods)[number] => Boolean(item),
  );

  return (
    <section className="geo section" id="deep-time" ref={root} data-theme="dark">
      <div className="shell">
        <header className="geo__masthead">
          <div className="geo__rail">
            <span className="mono">02</span>
            <span>Deep time</span>
          </div>
          <h2 className="geo__title" data-line>
            <span>The record beneath</span>
            <span>the animal.</span>
          </h2>
          <div className="geo__intro">
            <p>
              The Mesozoic spans 185.9 million years. Choose a period to read its climate, its
              ending and the world the archive’s animals inhabited. Field photographs are modern
              analogues, not reconstructions.
            </p>
            <div className="geo__scale" aria-label="The Mesozoic within the Phanerozoic">
              <div className="geo__scale-bar" aria-hidden="true">
                <span style={{ width: '38.1%' }} />
                <span className="is-mesozoic" style={{ width: '34.5%' }} />
                <span style={{ width: '27.4%' }} />
              </div>
              <div className="geo__scale-labels mono">
                <span>Palaeozoic</span>
                <span>Mesozoic · 251.9–66 Ma</span>
                <span>Cenozoic</span>
              </div>
            </div>
          </div>
        </header>

        <div className="geo__core" data-reveal>
          <div className="geo__column">
            <p className="geo__column-label">Mesozoic periods</p>
            <div className="geo__periods" role="group" aria-label="Choose a geological period">
              {mesozoicPeriods.map((item) => {
                const count = species.filter((record) => record.period === item.id).length;
                const isActive = item.id === active;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`geo__period${isActive ? ' is-active' : ''}`}
                    onClick={() => setActive(item.id as PeriodId)}
                    aria-pressed={isActive}
                    data-cursor="link"
                  >
                    <span className="geo__period-band" aria-hidden="true" />
                    <span className="geo__period-copy">
                      <span className="geo__period-name">{item.name}</span>
                      <span className="geo__period-range mono">{item.span}</span>
                    </span>
                    <span className="geo__period-count mono">{count}</span>
                  </button>
                );
              })}
            </div>
            <p className="geo__column-note mono">
              Species counts are records in this archive, not estimates of past diversity.
            </p>
          </div>

          <div className="geo__stage" aria-live="polite">
            <figure className="geo__figure">
              {field ? (
                <img
                  src={field.src1600}
                  srcSet={`${field.src900} 900w, ${field.src1600} 1600w`}
                  sizes="(max-width: 900px) 94vw, 48vw"
                  width={field.width}
                  height={field.height}
                  alt={field.alt}
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
              <figcaption className="geo__caption mono">
                <span>Modern field analogue</span>
                <span>
                  {field?.environment} · {field?.location}
                </span>
                <span>
                  {field?.photographer} · {field?.license}
                </span>
              </figcaption>
            </figure>

            <div className="geo__readout">
              <p className="geo__readout-index">{period.name}</p>
              <h3 className="geo__readout-title">{period.span}</h3>
              <p className="geo__readout-summary">{period.summary}</p>

              <dl className="geo__facts">
                <div>
                  <dt>Climate</dt>
                  <dd>{period.climate}</dd>
                </div>
                <div>
                  <dt>Ended by</dt>
                  <dd>{period.endedBy}</dd>
                </div>
              </dl>

              <ul className="geo__life">
                {period.life.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>

              <Link
                className="geo__enter"
                to={`/deep-time?period=${period.id}`}
                data-cursor="link"
              >
                Explore this period <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="geo__foot">
          <div className="geo__not-dinosaurs">
            <p className="geo__foot-label">Not every ancient reptile is a dinosaur</p>
            <dl>
              {NOT_DINOSAURS.map((item) => (
                <div key={item.title}>
                  <dt>{item.title}</dt>
                  <dd>{item.body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="geo__source mono">
            Dates: International Chronostratigraphic Chart v2026/06 ·{' '}
            <a href="https://stratigraphy.org/chart" target="_blank" rel="noreferrer">
              stratigraphy.org ↗
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

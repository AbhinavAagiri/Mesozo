import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AssetImage } from '../../components/ui/AssetImage';
import { SpeciesPlate } from '../../components/species/SpeciesPlate';
import { formatAgeNumber, formatMaRange, periods, species } from '../../data';
import type { PeriodId } from '../../data/types';

const MESOZOIC_START = 251.902;
const MESOZOIC_END = 66;
const SPAN = MESOZOIC_START - MESOZOIC_END;
const TICKS = [251.902, 200, 150, 100, 66];
const BIN_SIZE = 5;
const BIN_COUNT = Math.ceil(SPAN / BIN_SIZE);
const ORDERED = [...species].sort((a, b) => b.ageMa[0] - a.ageMa[0]);

const BINS = Array.from({ length: BIN_COUNT }, (_, index) => {
  const startMa = MESOZOIC_START - index * BIN_SIZE;
  const endMa = Math.max(MESOZOIC_END, startMa - BIN_SIZE);
  const count = species.filter(
    (item) => item.ageMa[0] >= endMa && item.ageMa[1] <= startMa,
  ).length;
  return { startMa, endMa, count };
});

const MAX_BIN = Math.max(...BINS.map((bin) => bin.count), 1);

function position(ma: number): number {
  return ((MESOZOIC_START - ma) / SPAN) * 100;
}

const PERIOD_COUNTS = new Map(
  periods.map((period) => [
    period.id,
    species.filter((item) => item.period === period.id).length,
  ]),
);

export function OccurrenceLedger() {
  const [filter, setFilter] = useState<PeriodId | 'all'>('all');
  const rows = filter === 'all' ? ORDERED : ORDERED.filter((item) => item.period === filter);
  const filterLabel = filter === 'all' ? 'all periods' : periods.find((p) => p.id === filter)?.name;

  return (
    <section className="dt-ranges" id="occurrences" aria-labelledby="dt-ranges-title">
      <div className="shell">
        <header className="dt-ranges__head">
          <div>
            <p className="label">02 / Occurrence archive</p>
            <h2 className="serif" id="dt-ranges-title">
              What the archive can place in time.
            </h2>
          </div>
          <div className="dt-ranges__intro">
            <p>
              Every bar is a dossier&apos;s numerical <span className="mono">ageMa</span> range.
              Counts below describe records, not fossil abundance or population size.
            </p>
            <p className="mono">
              {species.length} dossiers · 3 Mesozoic periods · 185.9 million years
            </p>
          </div>
        </header>

        <div className="dt-ranges__overview">
          <div className="dt-ranges__chart" aria-hidden="true">
            <div className="dt-ranges__chart-head">
              <span className="label">Coverage by 5 Ma bin</span>
              <span className="mono">max {MAX_BIN} dossiers</span>
            </div>
            <div className="dt-ranges__bars">
              {BINS.map((bin) => (
                <span
                  key={bin.startMa}
                  className="dt-ranges__bar"
                  style={{ height: `${Math.max(2, (bin.count / MAX_BIN) * 100)}%` }}
                  title={`${formatMaRange(bin.startMa, bin.endMa)}: ${bin.count} dossier${bin.count === 1 ? '' : 's'}`}
                />
              ))}
            </div>
            <div className="dt-ranges__period-band">
              {periods.map((period) => (
                <span
                  key={period.id}
                  data-period={period.id}
                  style={{ flexGrow: period.startMa - period.endMa }}
                >
                  <strong className="serif">{period.name}</strong>
                  <span className="mono">{PERIOD_COUNTS.get(period.id)}</span>
                </span>
              ))}
            </div>
            <div className="dt-ranges__axis">
              {TICKS.map((ma, index) => (
                <span
                  key={ma}
                  className="mono"
                  data-edge={index === 0 ? 'start' : index === TICKS.length - 1 ? 'end' : undefined}
                  style={{ left: `${position(ma)}%` }}
                >
                  {formatAgeNumber(ma)}
                </span>
              ))}
            </div>
          </div>

          <div className="dt-ranges__filters" role="group" aria-label="Filter the range ledger by period">
            <div className="dt-ranges__filters-head">
              <p className="label">Filter records</p>
              <p className="mono">Period counts</p>
            </div>
            <button
              type="button"
              className={`dt-range-filter${filter === 'all' ? ' is-active' : ''}`}
              onClick={() => setFilter('all')}
              aria-pressed={filter === 'all'}
            >
              <span>All archive</span>
              <span className="mono">{species.length}</span>
            </button>
            {periods.map((period) => (
              <button
                key={period.id}
                type="button"
                className={`dt-range-filter${filter === period.id ? ' is-active' : ''}`}
                data-period={period.id}
                onClick={() => setFilter(period.id)}
                aria-pressed={filter === period.id}
              >
                <span>
                  {period.name}
                  <small className="mono">{formatMaRange(period.startMa, period.endMa)}</small>
                </span>
                <span className="mono">{PERIOD_COUNTS.get(period.id)}</span>
              </button>
            ))}
            <p className="dt-ranges__filter-note mono" aria-live="polite">
              Showing {rows.length} of {species.length} · {filterLabel}
            </p>
          </div>
        </div>

        <div className="dt-ranges__table">
          <div className="dt-ranges__row-head" aria-hidden="true">
            <span className="label">Dossier</span>
            <span className="label">Numerical occurrence range</span>
            <span className="label">Estimate</span>
          </div>
          <div
            className="dt-ranges__scroll"
            tabIndex={0}
            role="region"
            aria-label="Dossier occurrence ranges"
          >
            {rows.map((item) => {
              const left = position(item.ageMa[0]);
              const width = Math.max(0.35, position(item.ageMa[1]) - left);

              return (
                <Link
                  key={item.slug}
                  className="dt-range-row"
                  to={`/species/${item.slug}`}
                  aria-label={`${item.scientificName}, ${item.ageLabel}, ${item.periodLabel}. Open dossier.`}
                >
                  <span className="dt-range-row__identity">
                    <span className="dt-range-row__thumb">
                      {item.image ? (
                        <AssetImage id={item.image} alt="" sizes="48px" fit="contain" />
                      ) : (
                        <SpeciesPlate species={item} size="thumb" />
                      )}
                    </span>
                    <span className="dt-range-row__names">
                      <span className="dt-range-row__scientific serif">{item.scientificName}</span>
                      <span className="dt-range-row__common">
                        {item.commonName} · {item.periodLabel}
                      </span>
                    </span>
                  </span>

                  <span className="dt-range-row__track">
                    {TICKS.map((ma) => (
                      <span
                        key={ma}
                        className="dt-range-row__gridline"
                        style={{ left: `${position(ma)}%` }}
                        aria-hidden="true"
                      />
                    ))}
                    <span
                      className="dt-range-row__bar"
                      data-period={item.period}
                      style={{ left: `${left}%`, width: `${width}%` }}
                      aria-hidden="true"
                    />
                  </span>

                  <span className="dt-range-row__age mono">{item.ageLabel}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="dt-ranges__foot">
          <p>
            The range says when a species is known from fossils, not when its lineage originated or
            disappeared. Ends are shown with broken caps to mark uncertainty. Records without
            explicit numerical ages are not plotted.
          </p>
          <p className="mono">
            Hover or focus a dossier to open its full scientific record. Image and citation credits
            are listed at the end of this page.
          </p>
        </div>
      </div>
    </section>
  );
}

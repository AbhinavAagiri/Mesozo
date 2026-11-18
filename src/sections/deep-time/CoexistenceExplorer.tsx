import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AssetImage } from '../../components/ui/AssetImage';
import { SpeciesPlate } from '../../components/species/SpeciesPlate';
import {
  assetById,
  coexistingSpecies,
  formatDuration,
  formatMaRange,
  getPeriod,
  species,
  speciesBySlug,
} from '../../data';
import type { PeriodId } from '../../data/types';

const MESOZOIC_START = 251.902;
const MESOZOIC_END = 66;
const SPAN = MESOZOIC_START - MESOZOIC_END;
const PERIOD_ORDER: { id: PeriodId; label: string }[] = [
  { id: 'triassic', label: 'Triassic' },
  { id: 'jurassic', label: 'Jurassic' },
  { id: 'cretaceous', label: 'Cretaceous' },
];

function leftFor(ma: number): number {
  return ((MESOZOIC_START - ma) / SPAN) * 100;
}

function widthFor(startMa: number, endMa: number): number {
  return ((startMa - endMa) / SPAN) * 100;
}

export function CoexistenceExplorer() {
  const [selectedSlug, setSelectedSlug] = useState('spinosaurus');
  const selected = speciesBySlug.get(selectedSlug) ?? species[0];
  const matches = coexistingSpecies(selected);
  const selectedAsset = selected.image ? assetById.get(selected.image) : undefined;
  const period = getPeriod(selected.period);

  return (
    <section className="dt-coexist" id="coexistence" data-theme="dark" aria-labelledby="dt-coexist-title">
      <div className="shell">
        <header className="dt-coexist__head">
          <div>
            <p className="label">04 / Temporal overlap</p>
            <h2 className="serif" id="dt-coexist-title">
              Who shares the record?
            </h2>
          </div>
          <div className="dt-coexist__intro">
            <p>
              Choose a dossier and compare its numerical occurrence range with the rest of the
              archive. The result is a time comparison, not evidence of an encounter.
            </p>
            <p className="mono">Strict positive overlap · archive ranges only</p>
          </div>
        </header>

        <div className="dt-coexist__control">
          <label className="dt-coexist__select" htmlFor="coexist-dossier">
            <span className="label">Dossier to compare</span>
            <select
              id="coexist-dossier"
              value={selected.slug}
              onChange={(event) => setSelectedSlug(event.target.value)}
            >
              {PERIOD_ORDER.map((group) => {
                const options = species
                  .filter((item) => item.period === group.id)
                  .sort((a, b) => a.scientificName.localeCompare(b.scientificName));
                return (
                  <optgroup key={group.id} label={group.label}>
                    {options.map((item) => (
                      <option value={item.slug} key={item.slug}>
                        {item.scientificName} — {item.ageLabel}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </label>
          <p className="dt-coexist__count mono" aria-live="polite">
            <strong>{matches.length}</strong> overlapping dossier{matches.length === 1 ? '' : 's'}
          </p>
        </div>

        <div className="dt-coexist__layout">
          <article className="dt-coexist__profile">
            <div className="dt-coexist__media">
              {selected.image ? (
                <AssetImage
                  id={selected.image}
                  alt={`Life reconstruction of ${selected.scientificName}.`}
                  sizes="(max-width: 700px) 90vw, 32vw"
                  fit="contain"
                />
              ) : (
                <SpeciesPlate species={selected} size="hero" />
              )}
            </div>
            <div className="dt-coexist__profile-copy">
              <p className="label">
                {selected.periodLabel} · {selected.stage} · {selected.ageLabel}
              </p>
              <h3 className="serif">{selected.scientificName}</h3>
              <p className="dt-coexist__common">{selected.commonName}</p>
              <p className="dt-coexist__summary">{selected.summary}</p>
              <dl className="dt-coexist__facts">
                <div>
                  <dt className="label">Occurrence</dt>
                  <dd className="mono">{formatMaRange(selected.ageMa[0], selected.ageMa[1])}</dd>
                </div>
                <div>
                  <dt className="label">Recorded region</dt>
                  <dd>{selected.region.join(' · ')}</dd>
                </div>
                <div>
                  <dt className="label">Period</dt>
                  <dd>{period.name}</dd>
                </div>
                <div>
                  <dt className="label">Dossier</dt>
                  <dd>
                    <Link to={`/species/${selected.slug}`}>
                      Open record <span aria-hidden="true">↗</span>
                    </Link>
                  </dd>
                </div>
              </dl>
              {selectedAsset ? (
                <p className="dt-coexist__credit">
                  Reconstruction: {selectedAsset.attribution}{' '}
                  <a href={selectedAsset.sourceUrl} target="_blank" rel="noreferrer">
                    source ↗
                  </a>
                </p>
              ) : null}
            </div>
          </article>

          <section className="dt-coexist__results" aria-labelledby="dt-coexist-results-title">
            <div className="dt-coexist__results-head">
              <div>
                <p className="label">Positive temporal overlap</p>
                <h3 className="serif" id="dt-coexist-results-title">
                  {matches.length
                    ? `${matches.length} ${matches.length === 1 ? 'match' : 'matches'}`
                    : 'No matches in the archive'}
                </h3>
              </div>
              <p className="mono">overlap = min(older) − max(younger)</p>
            </div>

            {matches.length ? (
              <ol className="dt-coexist__list">
                {matches.map((match) => {
                  const sameRegion = match.sharedRegions.length > 0;
                  return (
                    <li className="dt-coexist__result" key={match.species.slug}>
                      <Link className="dt-coexist__identity" to={`/species/${match.species.slug}`}>
                        <span className="dt-coexist__thumb">
                          {match.species.image ? (
                            <AssetImage
                              id={match.species.image}
                              alt=""
                              sizes="56px"
                              fit="contain"
                            />
                          ) : (
                            <SpeciesPlate species={match.species} size="thumb" />
                          )}
                        </span>
                        <span>
                          <span className="dt-coexist__name serif">
                            {match.species.scientificName}
                          </span>
                          <span className="dt-coexist__meta">
                            {match.species.commonName} · {match.species.periodLabel}
                          </span>
                        </span>
                      </Link>

                      <div className="dt-coexist__overlap">
                        <span className="dt-coexist__overlap-amount serif">
                          {formatDuration(match.overlapStartMa, match.overlapEndMa)}
                        </span>
                        <span className="dt-coexist__overlap-range mono">
                          {formatMaRange(match.overlapStartMa, match.overlapEndMa)} overlap
                        </span>
                        <div className="dt-overlap" aria-hidden="true">
                          <div className="dt-overlap__line">
                            <span>This record</span>
                            <span className="dt-overlap__track">
                              <i
                                className="dt-overlap__bar dt-overlap__bar--target"
                                style={{
                                  left: `${leftFor(selected.ageMa[0])}%`,
                                  width: `${widthFor(selected.ageMa[0], selected.ageMa[1])}%`,
                                }}
                              />
                            </span>
                          </div>
                          <div className="dt-overlap__line">
                            <span>{match.species.commonName}</span>
                            <span className="dt-overlap__track">
                              <i
                                className="dt-overlap__bar dt-overlap__bar--other"
                                style={{
                                  left: `${leftFor(match.species.ageMa[0])}%`,
                                  width: `${widthFor(match.species.ageMa[0], match.species.ageMa[1])}%`,
                                }}
                              />
                            </span>
                          </div>
                          <div className="dt-overlap__line dt-overlap__line--overlap">
                            <span>Overlap</span>
                            <span className="dt-overlap__track">
                              <i
                                className="dt-overlap__bar dt-overlap__bar--intersection"
                                style={{
                                  left: `${leftFor(match.overlapStartMa)}%`,
                                  width: `${widthFor(match.overlapStartMa, match.overlapEndMa)}%`,
                                }}
                              />
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className={`dt-coexist__region${sameRegion ? ' is-shared' : ''}`}>
                        {sameRegion
                          ? `Shared broad region: ${match.sharedRegions.join(' · ')}`
                          : `Different recorded regions: ${selected.regionKeys.join(' · ')} / ${match.species.regionKeys.join(' · ')}`}
                      </p>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="dt-coexist__empty">
                <p className="serif">
                  No other dossier has a positive temporal overlap with {selected.scientificName}.
                </p>
                <p>
                  This does not mean the animal lived alone. It means the archive&apos;s numerical
                  ranges do not overlap enough to support a comparison. A shared period label would
                  not be sufficient evidence.
                </p>
              </div>
            )}
          </section>
        </div>

        <aside className="dt-coexist__caveat">
          <p className="label">What this comparison means — and does not</p>
          <ul>
            <li>
              Overlap is calculated only from <span className="mono">ageMa</span>, the archive&apos;s
              numerical occurrence estimate. It is not a stratigraphic range chart.
            </li>
            <li>
              Geographic keys are broad modern regions. They are not a reconstruction of past
              geography, and different continents do not prove that two animals never met.
            </li>
            <li>
              Temporal overlap does not establish that two species interacted, competed, hunted one
              another, or even occupied the same habitat.
            </li>
            <li>
              When the ranges do not overlap, the archive says so. It does not fill the gap with a
              speculative encounter.
            </li>
          </ul>
          <p className="dt-coexist__method mono">
            Overlap = min(older endpoints) − max(younger endpoints), requiring a positive result.
            This is a time-only calculation.
          </p>
        </aside>

        <p className="dt-coexist__link-row">
          <Link className="text-link" to="/species">
            Open every dossier in the archive <span aria-hidden="true">↗</span>
          </Link>
        </p>
      </div>
    </section>
  );
}

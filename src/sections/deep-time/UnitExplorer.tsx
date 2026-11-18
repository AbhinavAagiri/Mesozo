import { Link } from 'react-router-dom';
import { AssetImage } from '../../components/ui/AssetImage';
import { InlineSources } from '../../components/ui/Sources';
import { SpeciesPlate } from '../../components/species/SpeciesPlate';
import {
  adjacentPeriods,
  assetById,
  discoverySpecimensForGeoUnit,
  eventsInUnit,
  formatDuration,
  formatMaRange,
  geoAncestors,
  geoChildren,
  getGeoUnit,
  getSpecies,
  getUnitContent,
  speciesForGeoUnit,
} from '../../data';
import { journalStoriesForPeriod } from '../../data/journal';
import type { DeepTimeEventKind, GeoRank } from '../../data/types';
import { FieldAnalogue } from './FieldAnalogue';

const RANK_LABEL: Record<GeoRank, string> = {
  supereon: 'Supereon',
  eon: 'Eon',
  era: 'Era',
  period: 'Period',
  epoch: 'Epoch',
};

const EVENT_KIND_LABEL: Record<DeepTimeEventKind, string> = {
  'first-evidence': 'First evidence',
  diversification: 'Diversification',
  extinction: 'Extinction',
  transition: 'Transition',
};

type Props = {
  selectedId: string;
  onSelect: (id: string) => void;
  onReset: () => void;
};

export function UnitExplorer({ selectedId, onSelect, onReset }: Props) {
  const unit = getGeoUnit(selectedId);
  const content = unit ? getUnitContent(unit.id) : undefined;

  if (!unit || !content) {
    return (
      <section className="dt-record dt-record--empty" id="period-detail">
        <div className="shell">
          <p className="label">Selected record</p>
          <h2 className="serif">Select a time unit.</h2>
          <p>Choose a period from the timescale or its index to open a record.</p>
          <button type="button" className="dt-inline-button" onClick={onReset}>
            Open the default record
          </button>
        </div>
      </section>
    );
  }

  const parent = unit.parentId ? getGeoUnit(unit.parentId) : undefined;
  const ancestors = geoAncestors(unit.id);
  const children = geoChildren(unit.id);
  const epochs = children.filter((child) => child.rank === 'epoch');
  const childPeriods = children.filter((child) => child.rank === 'period');
  const species = speciesForGeoUnit(unit.id);
  const shownSpecies = species.slice(0, unit.rank === 'period' ? 8 : 6);
  const allEvents = eventsInUnit(unit.id);
  const events = allEvents.slice(0, unit.rank === 'period' ? 4 : 3);
  const neighbours = adjacentPeriods(unit.id);
  const titleId = `dt-detail-title-${unit.id}`;
  const imageAssets = shownSpecies
    .map((item) => (item.image ? assetById.get(item.image) : undefined))
    .filter(
      (asset, index, list): asset is NonNullable<typeof asset> =>
        Boolean(asset) && list.findIndex((other) => other?.id === asset?.id) === index,
    );
  const archiveLink = unit.rank === 'period' ? `/species?period=${unit.id}` : '/species';
  const climate = content.climate ?? content.environment;
  const fossilRecords = unit.rank === 'period' ? discoverySpecimensForGeoUnit(unit.id) : [];
  const journalStories = unit.rank === 'period' ? journalStoriesForPeriod(unit.id) : [];
  const ancestorPath = [...ancestors].reverse().map((ancestor) => ancestor.name).join(' / ');

  return (
    <section
      className="dt-record"
      id="period-detail"
      aria-labelledby={titleId}
      key={unit.id}
      data-rank={unit.rank}
    >
      <div className="dt-record__seam" aria-hidden="true" />
      <div className="shell">
        <header className="dt-record__head">
          <div className="dt-record__indexline">
            <p className="label">
              Selected record <span aria-hidden="true">/</span> {RANK_LABEL[unit.rank]}
            </p>
            <p className="mono">
              {ancestorPath ? `${ancestorPath} / ` : ''}
              {unit.name}
            </p>
          </div>

          <div className="dt-record__title-row">
            <div className="dt-record__title-block">
              <p className="dt-record__unit-id mono">
                UNIT {unit.id.toUpperCase()} · ICS v2026/06
              </p>
              <h2 className="serif" id={titleId}>
                {unit.name}
              </h2>
              <p className="dt-record__tagline">{content.tagline}</p>
            </div>

            <dl className="dt-record__facts">
              <div>
                <dt className="label">Span</dt>
                <dd className="mono">{formatMaRange(unit.startMa, unit.endMa)}</dd>
              </div>
              <div>
                <dt className="label">Duration</dt>
                <dd className="mono">{formatDuration(unit.startMa, unit.endMa)}</dd>
              </div>
              <div>
                <dt className="label">Parent</dt>
                <dd>
                  {parent ? (
                    <button
                      type="button"
                      className="dt-inline-button"
                      onClick={() => onSelect(parent.id)}
                    >
                      {parent.name} <span aria-hidden="true">↑</span>
                    </button>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
              <div>
                <dt className="label">Dossiers</dt>
                <dd className="mono">{species.length || '—'}</dd>
              </div>
            </dl>
          </div>

          {epochs.length ? (
            <div
              className="dt-epoch-bar"
              role="group"
              aria-label={`${unit.name} subdivisions, drawn to scale`}
            >
              {epochs.map((epoch) => (
                <div
                  key={epoch.id}
                  className="dt-epoch"
                  style={{ flexGrow: epoch.startMa - epoch.endMa }}
                  title={`${epoch.name}: ${formatMaRange(epoch.startMa, epoch.endMa)}`}
                >
                  <span className="dt-epoch__name serif">{epoch.name}</span>
                  <span className="dt-epoch__span mono">
                    {formatMaRange(epoch.startMa, epoch.endMa)}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </header>

        <FieldAnalogue unitId={unit.id} unitName={unit.name} />

        <div className="dt-record__layout">
          <article className="dt-record__main">
            <p className="dt-record__summary">{content.summary}</p>

            <div className="dt-record__signals">
              <section>
                <p className="label">{unit.rank === 'period' ? 'Climate' : 'Environment'}</p>
                <p>{climate}</p>
              </section>
              <section>
                <p className="label">Geography</p>
                <p>{content.geography}</p>
              </section>
            </div>

            <section className="dt-record__life" aria-labelledby={`dt-life-${unit.id}`}>
              <header className="dt-record__section-head">
                <div>
                  <p className="label" id={`dt-life-${unit.id}`}>
                    Biological record
                  </p>
                  <h3 className="serif">What the fossil record preserves.</h3>
                </div>
                <span className="mono">{content.life.length} statements</span>
              </header>
              <ol>
                {content.life.map((line, index) => (
                  <li key={line}>
                    <span className="mono">{String(index + 1).padStart(2, '0')}</span>
                    <p>{line}</p>
                  </li>
                ))}
              </ol>
            </section>

            {content.endedBy ? (
              <section className="dt-record__boundary">
                <p className="label">Boundary & aftermath</p>
                <p>{content.endedBy}</p>
              </section>
            ) : null}

            {events.length ? (
              <section className="dt-record__events" aria-labelledby={`dt-events-${unit.id}`}>
                <header className="dt-record__section-head">
                  <div>
                    <p className="label" id={`dt-events-${unit.id}`}>
                      Recorded events
                    </p>
                    <h3 className="serif">Dated evidence inside this unit.</h3>
                  </div>
                  <span className="mono">
                    {events.length} of {allEvents.length}
                  </span>
                </header>

                <ol>
                  {events.map((event) => (
                    <li key={event.id}>
                      <details className="dt-record-event">
                        <summary>
                          <span className="dt-record-event__date mono">{event.dateLabel}</span>
                          <span className="dt-record-event__title">{event.title}</span>
                          <span className="dt-record-event__kind">
                            {EVENT_KIND_LABEL[event.kind]}
                          </span>
                          <span className="dt-record-event__toggle" aria-hidden="true">
                            +
                          </span>
                        </summary>
                        <div className="dt-record-event__body">
                          <p>{event.body}</p>
                          {event.note ? <p className="dt-record-event__note">{event.note}</p> : null}
                          <div className="dt-record-event__foot">
                            <button
                              type="button"
                              className="dt-inline-button"
                              onClick={() => onSelect(event.unitId)}
                            >
                              Open {getGeoUnit(event.unitId)?.name ?? 'unit'}{' '}
                              <span aria-hidden="true">↗</span>
                            </button>
                            <span className="dt-record-event__basis mono">
                              {event.basis === 'fossil' ? 'Fossil evidence' : 'Proxy evidence'}
                            </span>
                            <InlineSources ids={event.refs} />
                          </div>
                        </div>
                      </details>
                    </li>
                  ))}
                </ol>

                {allEvents.length > events.length ? (
                  <a className="dt-record__more" href="#life-through-time">
                    Open the complete event register{' '}
                    <span aria-hidden="true">↓</span>
                  </a>
                ) : null}
              </section>
            ) : null}

            {unit.stages?.length ? (
              <section className="dt-record__stages">
                <div className="dt-record__section-head">
                  <div>
                    <p className="label">Stages · numeric ages</p>
                    <h3 className="serif">Subdivisions in the chart.</h3>
                  </div>
                  <span className="mono">older → younger</span>
                </div>
                <ol>
                  {unit.stages.map((stage) => (
                    <li key={stage.name}>
                      <span className="serif">{stage.name}</span>
                      <span className="mono">{formatMaRange(stage.startMa, stage.endMa)}</span>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            <InlineSources ids={content.refs} />
          </article>

          <aside className="dt-record__aside">
            <section>
              <p className="label">Position</p>
              <p className="dt-record__parent">
                {parent ? (
                  <>
                    Nested inside{' '}
                    <button
                      type="button"
                      className="dt-inline-button"
                      onClick={() => onSelect(parent.id)}
                    >
                      {parent.name}
                    </button>
                  </>
                ) : (
                  'A root unit in the chart.'
                )}
              </p>
              {childPeriods.length ? (
                <div className="dt-branch">
                  <p className="label">Periods inside</p>
                  {childPeriods.map((period) => (
                    <button
                      key={period.id}
                      type="button"
                      className="dt-branch__item"
                      onClick={() => onSelect(period.id)}
                    >
                      <span>
                        <span className="dt-branch__name serif">{period.name}</span>
                        <span className="dt-branch__span mono">
                          {formatMaRange(period.startMa, period.endMa)}
                        </span>
                      </span>
                      <span className="dt-branch__arrow" aria-hidden="true">
                        ↗
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
              {unit.rank !== 'period' && !childPeriods.length && children.length ? (
                <div className="dt-branch">
                  <p className="label">Units inside</p>
                  {children.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      className="dt-branch__item"
                      onClick={() => onSelect(child.id)}
                    >
                      <span>
                        <span className="dt-branch__name serif">{child.name}</span>
                        <span className="dt-branch__span mono">
                          {formatMaRange(child.startMa, child.endMa)}
                        </span>
                      </span>
                      <span className="dt-branch__arrow" aria-hidden="true">
                        ↗
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </section>

            {unit.rank === 'period' ? (
              <section>
                <p className="label">Adjacent periods</p>
                <div className="dt-neighbours">
                  {neighbours.older ? (
                    <button type="button" onClick={() => onSelect(neighbours.older!.id)}>
                      <span className="label">Older</span>
                      <span className="serif">{neighbours.older.name}</span>
                      <span className="mono">
                        {formatMaRange(neighbours.older.startMa, neighbours.older.endMa)}
                      </span>
                    </button>
                  ) : null}
                  {neighbours.younger ? (
                    <button type="button" onClick={() => onSelect(neighbours.younger!.id)}>
                      <span className="label">Younger</span>
                      <span className="serif">{neighbours.younger.name}</span>
                      <span className="mono">
                        {formatMaRange(neighbours.younger.startMa, neighbours.younger.endMa)}
                      </span>
                    </button>
                  ) : null}
                </div>
              </section>
            ) : null}

            {(fossilRecords.length || journalStories.length) ? (
              <section>
                <p className="label">Beyond this timeline</p>
                {fossilRecords.length ? (
                  <>
                    <p className="dt-record__aside-note">
                      {fossilRecords.length} specimen{' '}
                      {fossilRecords.length === 1 ? 'record' : 'records'} from this period are
                      documented in the fossil archive.
                    </p>
                    <div className="dt-record__links">
                      {fossilRecords.slice(0, 3).map((specimen) => (
                        <Link
                          to={`/discoveries/specimen/${specimen.id}`}
                          key={specimen.id}
                          className="dt-record__link"
                        >
                          <span className="mono">{specimen.identifier}</span>
                          <span>
                            {getSpecies(specimen.speciesId)?.scientificName ?? specimen.speciesId}
                          </span>
                        </Link>
                      ))}
                    </div>
                    <Link className="text-link" to={`/discoveries?period=${unit.id}#archive`}>
                      Open the fossil archive <span aria-hidden="true">↗</span>
                    </Link>
                  </>
                ) : null}
                {journalStories.length ? (
                  <>
                    <p className="dt-record__aside-note">
                      {journalStories.length} research{' '}
                      {journalStories.length === 1 ? 'note' : 'notes'} connect to this period.
                    </p>
                    <div className="dt-record__links">
                      {journalStories.slice(0, 2).map((story) => (
                        <Link
                          className="dt-record__link"
                          to={`/journal/${story.slug}`}
                          key={story.id}
                        >
                          <span>{story.headline}</span>
                        </Link>
                      ))}
                    </div>
                    <Link className="text-link" to={`/journal?period=${unit.id}`}>
                      Read the research <span aria-hidden="true">↗</span>
                    </Link>
                  </>
                ) : null}
              </section>
            ) : null}

            <section>
              <p className="label">Reading the record</p>
              <p className="dt-record__aside-note">
                Boundaries follow the International Chronostratigraphic Chart v2026/06. Climate and
                geography are cited summaries, not reconstructions drawn from a single map.
              </p>
              <InlineSources ids={content.refs.slice(0, 4)} />
              <button type="button" className="dt-inline-button" onClick={onReset}>
                Return to the default record <span aria-hidden="true">↺</span>
              </button>
            </section>
          </aside>
        </div>

        <section className="dt-species-block" aria-labelledby={`dt-species-${unit.id}`}>
          <div className="dt-species-block__head">
            <div>
              <p className="label">Archive connection</p>
              <h3 className="serif" id={`dt-species-${unit.id}`}>
                {species.length
                  ? `${species.length} dossier${species.length === 1 ? '' : 's'} in this ${RANK_LABEL[unit.rank].toLowerCase()}`
                  : 'No dossiers assigned yet'}
              </h3>
            </div>
            <Link className="text-link" to={archiveLink}>
              {unit.rank === 'period'
                ? `Filter the archive to the ${unit.name}`
                : 'Open the species archive'}{' '}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          {species.length ? (
            <div className="dt-species-grid">
              {shownSpecies.map((item) => {
                const asset = item.image ? assetById.get(item.image) : undefined;
                return (
                  <div className="dt-species-card" key={item.slug}>
                    <Link
                      className="dt-species-card__link"
                      to={`/species/${item.slug}`}
                      aria-label={`Open the dossier for ${item.scientificName}`}
                    >
                      <div className="dt-species-card__media">
                        {item.image ? (
                          <AssetImage
                            id={item.image}
                            alt={`Life reconstruction of ${item.scientificName}.`}
                            sizes="(max-width: 700px) 45vw, 18vw"
                            fit="contain"
                          />
                        ) : (
                          <SpeciesPlate species={item} />
                        )}
                      </div>
                      <p className="label">
                        {item.periodLabel} · {item.stage}
                      </p>
                      <h4 className="serif">{item.scientificName}</h4>
                      <p className="dt-species-card__common">{item.commonName}</p>
                      <p className="dt-species-card__age mono">{item.ageLabel}</p>
                    </Link>
                    {asset ? (
                      <p className="dt-species-card__credit">
                        {asset.attribution}{' '}
                        <a href={asset.sourceUrl} target="_blank" rel="noreferrer">
                          source ↗
                        </a>
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="dt-species-empty">
              No MESOZO dossier is currently assigned to the {unit.name}. This atlas does not invent
              one to fill the gap.
            </p>
          )}

          {species.length > shownSpecies.length ? (
            <div className="dt-species-block__foot">
              <p className="mono">
                Showing {shownSpecies.length} of {species.length}. The archive filter shows every
                dossier in this period.
              </p>
              <Link className="text-link" to={archiveLink}>
                Browse all records <span aria-hidden="true">↗</span>
              </Link>
            </div>
          ) : null}

          {imageAssets.length ? (
            <p className="dt-species-credit-note">
              Image credits: {imageAssets.map((asset) => asset?.creator).filter(Boolean).join(' · ')}.
              Full source and licence details are listed below.
            </p>
          ) : null}
        </section>
      </div>
    </section>
  );
}

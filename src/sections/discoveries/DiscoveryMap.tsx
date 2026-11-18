import { useState } from 'react';
import { Link } from 'react-router-dom';
import { InlineSources } from '../../components/ui/Sources';
import {
  discoveryEvents,
  discoveryExpeditions,
  discoveryFormationById,
  discoveryLocations,
  discoverySpecimens,
  discoveryLocationForSpecimen,
  speciesBySlug,
} from '../../data';
import { WORLD_LAND_PATH } from '../../data/world-land-path';

function project(latitude: number, longitude: number) {
  return {
    x: ((longitude + 180) / 360) * 100,
    y: ((90 - latitude) / 180) * 100,
  };
}

function coordinateLabel(latitude: number, longitude: number) {
  const lat = `${Math.abs(latitude).toFixed(2)}° ${latitude >= 0 ? 'N' : 'S'}`;
  const lon = `${Math.abs(longitude).toFixed(2)}° ${longitude >= 0 ? 'E' : 'W'}`;
  return `${lat}, ${lon}`;
}

/**
 * Several archive localities sit within a few degrees of one another. A
 * percentage-positioned pin cannot resolve that overlap on its own, so nearby
 * points are fanned out into a small grid around the true map position. The
 * markers remain approximate regional references, as the map caption states.
 */
function pinLayout(points: Array<{ x: number; y: number }>): Array<{
  left: number;
  top: number;
  dx: number;
  dy: number;
}> {
  const groups: number[][] = [];
  const grouped = new Set<number>();
  const step = 36;

  points.forEach((_, index) => {
    if (grouped.has(index)) return;
    const group = [index];
    grouped.add(index);
    for (let candidate = index + 1; candidate < points.length; candidate += 1) {
      if (grouped.has(candidate)) continue;
      if (
        group.some(
          (memberIndex) =>
            Math.abs(points[memberIndex].x - points[candidate].x) < 12 &&
            Math.abs(points[memberIndex].y - points[candidate].y) < 20,
        )
      ) {
        group.push(candidate);
        grouped.add(candidate);
      }
    }
    groups.push(group);
  });

  const layout = points.map((point) => ({ left: point.x, top: point.y, dx: 0, dy: 0 }));
  for (const group of groups) {
    if (group.length < 2) continue;
    const centerX = group.reduce((sum, index) => sum + points[index].x, 0) / group.length;
    const centerY = group.reduce((sum, index) => sum + points[index].y, 0) / group.length;
    const columns = Math.ceil(Math.sqrt(group.length));
    const rows = Math.ceil(group.length / columns);
    group.forEach((index, order) => {
      layout[index] = {
        left: centerX,
        top: centerY,
        dx: (order % columns - (columns - 1) / 2) * step,
        dy: (Math.floor(order / columns) - (rows - 1) / 2) * step,
      };
    });
  }
  return layout;
}

export function DiscoveryMap() {
  const entries = discoveryLocations.map((location) => {
    const specimens = discoverySpecimens.filter(
      (specimen) => discoveryLocationForSpecimen(specimen)?.id === location.id,
    );
    const expeditions = discoveryExpeditions.filter((expedition) =>
      expedition.locationIds.includes(location.id),
    );
    const events = discoveryEvents.filter((event) => event.locationId === location.id);
    const formationIds = Array.from(new Set(events.map((event) => event.formationId)));
    const formations = formationIds
      .map((id) => discoveryFormationById.get(id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
    return { location, specimens, expeditions, events, formations };
  });

  const [selectedId, setSelectedId] = useState(entries[0]?.location.id ?? '');
  const selected = entries.find((entry) => entry.location.id === selectedId) ?? entries[0];
  const projected = entries.map((entry) =>
    project(entry.location.latitude, entry.location.longitude),
  );
  const pinPositions = pinLayout(projected);

  if (!selected) return null;

  const allRefs = Array.from(
    new Set([
      ...selected.location.refs,
      ...selected.events.flatMap((event) => event.refs),
      ...selected.formations.flatMap((formation) => formation.refs),
    ]),
  );

  return (
    <section className="dsc-map" id="map" aria-labelledby="dsc-map-title">
      <div className="shell">
        <header className="dsc-section-head">
          <div className="dsc-section-head__index">
            <p className="label">05 — Discovery map</p>
            <p className="label">{discoveryLocations.length} localities</p>
          </div>
          <div className="dsc-section-head__main">
            <h2 className="serif" id="dsc-map-title">
              Where the evidence <em>came from.</em>
            </h2>
            <p>
              These are regional reference points, not quarry coordinates. Select a point to see the
              formation, specimens and fieldwork recorded there. The map is drawn locally from
              longitude and latitude; it uses no map API.
            </p>
          </div>
        </header>

        <div className="dsc-map__layout">
          <div className="dsc-map__figure">
            <div className="dsc-map__stage">
              <svg
                className="dsc-map__land"
                viewBox="0 0 1000 500"
                role="img"
                aria-label="Equirectangular world map showing the approximate regions of fossil localities in the archive."
              >
                <path d={WORLD_LAND_PATH} className="dsc-map__land-shape" />
                <g className="dsc-map__graticule" aria-hidden="true">
                  {[60, 120, 180, 240, 300, 360, 420].map((y) => (
                    <line key={`lat-${y}`} x1="0" x2="1000" y1={y} y2={y} />
                  ))}
                  {[166.7, 333.3, 500, 666.7, 833.3].map((x) => (
                    <line key={`lon-${x}`} x1={x} x2={x} y1="0" y2="500" />
                  ))}
                </g>
              </svg>

              <div className="dsc-map__pins">
                {entries.map((entry, index) => {
                  const position = pinPositions[index];
                  const isActive = entry.location.id === selected.location.id;
                  return (
                    <button
                      type="button"
                      className={`dsc-map__pin${isActive ? ' is-active' : ''}${
                        position.left > 68 ? ' dsc-map__pin--label-left' : ''
                      }`}
                      style={
                        {
                          left: `${position.left}%`,
                          top: `${position.top}%`,
                          '--pin-dx': `${position.dx}px`,
                          '--pin-dy': `${position.dy}px`,
                        } as React.CSSProperties
                      }
                      key={entry.location.id}
                      aria-pressed={isActive}
                      onClick={() => setSelectedId(entry.location.id)}
                    >
                      <span className="dsc-map__pin-dot mono">{String(index + 1).padStart(2, '0')}</span>
                      <span className="dsc-map__pin-label label">{entry.location.label}</span>
                      <span className="visually-hidden">
                        {entry.location.country}. {entry.specimens.length} specimen records and{' '}
                        {entry.expeditions.length} expeditions.
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="dsc-map__caption">
              <p className="mono">Equirectangular projection · 1:110m land outline</p>
              <p className="mono">Locality points are approximate regional references.</p>
            </div>

            <div className="dsc-map__index">
              <p className="label">Locality index</p>
              <ul>
                {entries.map((entry, index) => {
                  const isActive = entry.location.id === selected.location.id;
                  return (
                    <li key={entry.location.id}>
                      <button
                        type="button"
                        className={`dsc-map__index-item${isActive ? ' is-active' : ''}`}
                        aria-pressed={isActive}
                        onClick={() => setSelectedId(entry.location.id)}
                      >
                        <span className="mono">{String(index + 1).padStart(2, '0')}</span>
                        <span>{entry.location.label}</span>
                        <span className="mono">{entry.location.country}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <aside className="dsc-map__detail" aria-live="polite">
            <div className="dsc-map__detail-head">
              <p className="label">
                {selected.location.region} · {selected.location.country}
              </p>
              <h3 className="serif">{selected.location.label}</h3>
              <p className="dsc-map__coords mono">
                {coordinateLabel(selected.location.latitude, selected.location.longitude)}
              </p>
            </div>

            <p className="dsc-map__note">{selected.location.coordinateNote}</p>

            <dl className="dsc-map__facts">
              <div>
                <dt className="label">Formation</dt>
                <dd>
                  {selected.formations.map((formation) => formation.name).join(' · ') || 'Not stated'}
                </dd>
              </div>
              <div>
                <dt className="label">Age</dt>
                <dd>
                  {selected.formations.map((formation) => formation.ageLabel).join(' · ') ||
                    'Not stated'}
                </dd>
              </div>
            </dl>

            {selected.specimens.length ? (
              <div className="dsc-map__records">
                <p className="label">Specimen records</p>
                <ul>
                  {selected.specimens.map((specimen) => {
                    const species = speciesBySlug.get(specimen.speciesId);
                    return (
                      <li key={specimen.id}>
                        <Link className="dsc-text-link" to={`/discoveries/specimen/${specimen.id}`}>
                          {specimen.identifier}
                          {species ? ` · ${species.scientificName}` : ''}{' '}
                          <span aria-hidden="true">↗</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div className="dsc-map__records">
                <p className="label">Specimen records</p>
                <p className="dsc-map__empty">No specimen record is plotted at this locality.</p>
              </div>
            )}

            {selected.expeditions.length ? (
              <div className="dsc-map__records">
                <p className="label">Expeditions</p>
                <ul>
                  {selected.expeditions.map((expedition) => (
                    <li key={expedition.id}>
                      <Link className="dsc-text-link" to={`/discoveries#expedition-${expedition.id}`}>
                        {expedition.name} <span aria-hidden="true">↗</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {selected.events.length ? (
              <div className="dsc-map__records">
                <p className="label">Discovery notes</p>
                <ul>
                  {selected.events.map((event) => (
                    <li className="dsc-map__event" key={event.id}>
                      <span className="mono">{event.dateLabel}</span>
                      <span>{event.summary}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <InlineSources ids={allRefs} />
          </aside>
        </div>

        <p className="dsc-map__credit">
          Base map: Natural Earth 1:110m land, public domain. The outline is simplified and projected
          from geographic coordinates; it is not a navigation map. The MESOZO archive does not
          publish precise coordinates for sensitive fossil localities.
        </p>
      </div>
    </section>
  );
}

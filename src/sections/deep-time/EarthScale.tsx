import { formatMaRange, getGeoUnit, isGeoDescendant } from '../../data';
import type { GeoUnit } from '../../data/types';

const EON_IDS = ['hadean', 'archean', 'proterozoic', 'phanerozoic'] as const;
const TOTAL_MA = 4567;

type Props = {
  selectedId: string;
  onSelect: (id: string) => void;
};

export function EarthScale({ selectedId, onSelect }: Props) {
  const eons = EON_IDS.map((id) => getGeoUnit(id)).filter((unit): unit is GeoUnit => Boolean(unit));

  return (
    <div className="dt-earth">
      <div className="dt-earth__head">
        <p className="label">Whole Earth</p>
        <p className="mono">4.567 Ga → present</p>
      </div>

      <div className="dt-earth__bar" role="group" aria-label="Earth history by eon, drawn to scale">
        {eons.map((eon) => {
          const share = ((eon.startMa - eon.endMa) / TOTAL_MA) * 100;
          const active =
            selectedId === eon.id ||
            isGeoDescendant(selectedId, eon.id) ||
            isGeoDescendant(eon.id, selectedId);

          return (
            <button
              key={eon.id}
              type="button"
              className={`dt-earth__eon${active ? ' is-active' : ''}`}
              data-eon={eon.id}
              style={{ flexGrow: eon.startMa - eon.endMa }}
              onClick={() => onSelect(eon.id)}
              aria-pressed={active}
              aria-label={`${eon.name}, ${formatMaRange(eon.startMa, eon.endMa)}, ${share.toFixed(1)} percent of Earth history`}
            >
              <span className="dt-earth__name serif">{eon.name}</span>
              <span className="dt-earth__share mono">{share.toFixed(1)}%</span>
            </button>
          );
        })}
      </div>

      <div className="dt-earth__axis mono" aria-hidden="true">
        <span>4.567 Ga</span>
        <span>today</span>
      </div>

      <div className="dt-earth__legend" aria-hidden="true">
        {eons.map((eon) => (
          <span key={eon.id}>
            <i data-eon={eon.id} />
            {eon.name}
          </span>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  formatAgeNumber,
  formatDuration,
  formatMaRange,
  geoAncestors,
  getGeoUnit,
  isGeoDescendant,
  periodsInUnit,
  speciesForGeoUnit,
} from '../../data';
import type { GeoRank, GeoUnit } from '../../data/types';

type ScopeId = 'phanerozoic' | 'paleozoic' | 'mesozoic' | 'cenozoic';

const SCOPES: { id: ScopeId; label: string }[] = [
  { id: 'phanerozoic', label: 'Phanerozoic' },
  { id: 'paleozoic', label: 'Paleozoic' },
  { id: 'mesozoic', label: 'Mesozoic' },
  { id: 'cenozoic', label: 'Cenozoic' },
];

const AXIS_TICKS: Record<ScopeId, number[]> = {
  phanerozoic: [538.8, 500, 450, 400, 350, 300, 250, 200, 150, 100, 66, 0],
  paleozoic: [538.8, 500, 450, 400, 350, 300, 251.902],
  mesozoic: [251.902, 230, 200, 150, 100, 66],
  cenozoic: [66, 60, 50, 40, 30, 20, 10, 0],
};

const RANK_LABEL: Record<GeoRank, string> = {
  supereon: 'Supereon',
  eon: 'Eon',
  era: 'Era',
  period: 'Period',
  epoch: 'Epoch',
};

type Props = {
  selectedId: string;
  onSelect: (id: string) => void;
  onReset: () => void;
};

export function GeologicalTimeline({ selectedId, onSelect, onReset }: Props) {
  const [scopeId, setScopeId] = useState<ScopeId>('phanerozoic');
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const trackRef = useRef<HTMLDivElement | null>(null);
  const scope = getGeoUnit(scopeId) ?? getGeoUnit('phanerozoic')!;
  const domain = scope.startMa - scope.endMa;
  const scopePeriods = periodsInUnit(scopeId);
  const selected = getGeoUnit(selectedId) ?? getGeoUnit('mesozoic')!;
  const selectedCount = speciesForGeoUnit(selected.id).length;
  const eras = useMemo(
    () =>
      ['paleozoic', 'mesozoic', 'cenozoic']
        .map((id) => getGeoUnit(id))
        .filter((unit): unit is GeoUnit => Boolean(unit)),
    [],
  );

  const periodGroups = useMemo(() => {
    const groups = new Map<string, { era: GeoUnit; periods: GeoUnit[] }>();
    for (const period of periodsInUnit('phanerozoic')) {
      const era = geoAncestors(period.id).find((unit) => unit.rank === 'era');
      if (!era) continue;
      const group = groups.get(era.id) ?? { era, periods: [] };
      group.periods.push(period);
      groups.set(era.id, group);
    }
    return Array.from(groups.values());
  }, []);

  const chooseScope = (next: ScopeId) => {
    setScopeId(next);
    onSelect(next);
  };

  const choosePeriod = (period: GeoUnit) => {
    const era = geoAncestors(period.id).find((unit) => unit.rank === 'era');
    if (era) setScopeId(era.id as ScopeId);
    onSelect(period.id);
  };

  const reset = () => {
    setScopeId('phanerozoic');
    onReset();
  };

  const moveTo = (index: number) => {
    if (!scopePeriods.length) return;
    const wrapped = (index + scopePeriods.length) % scopePeriods.length;
    const next = scopePeriods[wrapped];
    buttonRefs.current.get(next.id)?.focus();
    onSelect(next.id);
  };

  const onPeriodKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = scopePeriods.findIndex((period) => period.id === selected.id);
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveTo(index < 0 ? 0 : index + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveTo(index < 0 ? scopePeriods.length - 1 : index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      moveTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      moveTo(scopePeriods.length - 1);
    }
  };

  const selectedPeriod =
    selected.rank === 'period' && isGeoDescendant(selected.id, scope.id) ? selected : undefined;

  // On narrow screens the timeline is a horizontal viewport. Start at the
  // selected period's era so the visible axis and era band agree with each
  // other; fall back to centring the period when that would hide it.
  useEffect(() => {
    const wrap = trackRef.current;
    const button = buttonRefs.current.get(selectedId);
    if (!wrap || !button) return;
    const wrapRect = wrap.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const selectedOffset = wrap.scrollLeft + buttonRect.left - wrapRect.left;
    const era = button.dataset.era
      ? wrap.querySelector<HTMLElement>(`.dt-era[data-era="${button.dataset.era}"]`)
      : null;
    const eraOffset = era
      ? wrap.scrollLeft + era.getBoundingClientRect().left - wrapRect.left
      : selectedOffset;
    const maxScroll = Math.max(0, wrap.scrollWidth - wrap.clientWidth);
    const selectedVisibleAtEraStart =
      selectedOffset >= eraOffset &&
      selectedOffset + buttonRect.width <= eraOffset + wrap.clientWidth;
    const centered = selectedOffset - (wrap.clientWidth - buttonRect.width) / 2;
    const target = selectedVisibleAtEraStart ? eraOffset : centered;
    wrap.scrollTo({ left: Math.max(0, Math.min(maxScroll, target)), behavior: 'auto' });
  }, [selectedId, scopeId]);

  return (
    <div className="dt-timescale">
      <div className="dt-timescale__tools">
        <div className="dt-scopes" role="group" aria-label="Choose a geological scope">
          <span className="label">Window</span>
          {SCOPES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`dt-scope${scopeId === item.id ? ' is-active' : ''}`}
              onClick={() => chooseScope(item.id)}
              aria-pressed={scopeId === item.id}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="dt-timescale__hint mono">
          {scopePeriods.length} period{scopePeriods.length === 1 ? '' : 's'} in view · scroll the band
          or use ← →
        </p>
      </div>

      <div className="dt-timescale__layout">
        <div className="dt-timescale__stage">
          <div className="dt-track-wrap" ref={trackRef}>
            <div className="dt-track-inner">
              <div className="dt-axis" aria-hidden="true">
                <span className="dt-axis__unit mono">Ma before present</span>
                {AXIS_TICKS[scopeId].map((ma, index, list) => (
                  <span
                    key={ma}
                    className="dt-axis__tick mono"
                    data-edge={
                      index === 0 ? 'start' : index === list.length - 1 ? 'end' : undefined
                    }
                    style={{ left: `${((scope.startMa - ma) / domain) * 100}%` }}
                  >
                    {ma === 0 ? 'today' : formatAgeNumber(ma)}
                  </span>
                ))}
              </div>

              <div className="dt-era-band" role="group" aria-label="Zoom to an era">
                {eras.map((era) => {
                  const active = scopeId === era.id;
                  return (
                    <button
                      key={era.id}
                      type="button"
                      className={`dt-era${active ? ' is-active' : ''}`}
                      data-era={era.id}
                      style={{ flexGrow: era.startMa - era.endMa }}
                      onClick={() => chooseScope(era.id as ScopeId)}
                      aria-pressed={active}
                      aria-label={`Zoom to the ${era.name} era, ${formatMaRange(era.startMa, era.endMa)}`}
                    >
                      <span className="dt-era__name serif">{era.name}</span>
                      <span className="dt-era__span mono">
                        {formatMaRange(era.startMa, era.endMa)}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div
                className="dt-period-track"
                role="group"
                aria-label={`Periods of the ${scope.name}`}
                aria-describedby="dt-keyboard-help"
                onKeyDown={onPeriodKeyDown}
                key={scopeId}
              >
                {scopePeriods.map((period) => {
                  const share = (period.startMa - period.endMa) / domain;
                  const tiny = share < (scopeId === 'phanerozoic' ? 0.02 : 0.015);
                  const active = selectedPeriod?.id === period.id;
                  const era = geoAncestors(period.id).find((unit) => unit.rank === 'era');
                  const count = speciesForGeoUnit(period.id).length;

                  return (
                    <button
                      key={period.id}
                      ref={(node) => {
                        if (node) buttonRefs.current.set(period.id, node);
                        else buttonRefs.current.delete(period.id);
                      }}
                      type="button"
                      className={`dt-period${active ? ' is-active' : ''}${tiny ? ' is-tiny' : ''}`}
                      data-era={era?.id}
                      data-period={period.id}
                      style={{ flexGrow: period.startMa - period.endMa }}
                      onClick={() => onSelect(period.id)}
                      aria-pressed={active}
                      title={`${period.name} · ${formatMaRange(period.startMa, period.endMa)} · ${count} dossier${count === 1 ? '' : 's'}`}
                      aria-label={`${period.name}, ${formatMaRange(period.startMa, period.endMa)}, ${count} dossier${count === 1 ? '' : 's'}`}
                    >
                      <span className="dt-period__bar" aria-hidden="true" />
                      <span className="dt-period__age mono">{formatAgeNumber(period.startMa)}</span>
                      <span className="dt-period__name">{period.name}</span>
                      <span className="dt-period__count mono">{count || '—'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="dt-timescale__foot mono" aria-hidden="true">
            <span>{formatMaRange(scope.startMa, scope.endMa)}</span>
            <span>drawn to scale · period · dossier count</span>
          </div>
        </div>

        <aside className="dt-period-index" aria-label="Period index">
          <div className="dt-period-index__head">
            <p className="label">Period index</p>
            <p className="mono">12 units</p>
          </div>
          <div className="dt-period-index__groups">
            {periodGroups.map((group) => (
              <div className="dt-period-index__group" key={group.era.id}>
                <p className="dt-period-index__era" data-era={group.era.id}>
                  <span>{group.era.name}</span>
                  <span className="mono">{formatMaRange(group.era.startMa, group.era.endMa)}</span>
                </p>
                <div className="dt-period-index__buttons">
                  {group.periods.map((period) => {
                    const active = selected.id === period.id;
                    const count = speciesForGeoUnit(period.id).length;
                    return (
                      <button
                        key={period.id}
                        type="button"
                        className={`dt-period-index__button${active ? ' is-active' : ''}`}
                        onClick={() => choosePeriod(period)}
                        aria-pressed={active}
                      >
                        <span>{period.name}</span>
                        <span className="mono">
                          {count ? `${count}` : '—'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="dt-selection" aria-live="polite">
        <div className="dt-selection__copy">
          <span className="label">Selected record</span>
          <strong className="serif">{selected.name}</strong>
          <span className="mono">
            {RANK_LABEL[selected.rank]} · {formatMaRange(selected.startMa, selected.endMa)} ·{' '}
            {formatDuration(selected.startMa, selected.endMa)}
          </span>
        </div>
        <p className="dt-selection__archive mono">
          {selectedCount} dossier{selectedCount === 1 ? '' : 's'} in the archive
        </p>
        <a className="dt-selection__open" href="#period-detail">
          Read the record <span aria-hidden="true">↓</span>
        </a>
        <button type="button" className="dt-selection__reset" onClick={reset}>
          Default view
        </button>
      </div>

      <p className="dt-keyboard-help mono" id="dt-keyboard-help">
        Select a period to inspect its record. Scope buttons zoom the scale; the index exposes every
        period even when its segment is too narrow to label.
      </p>
    </div>
  );
}

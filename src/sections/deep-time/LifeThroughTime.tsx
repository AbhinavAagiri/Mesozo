import { InlineSources } from '../../components/ui/Sources';
import { deepTimeEvents, getGeoUnit, isGeoDescendant } from '../../data';
import type { DeepTimeEventKind } from '../../data/types';

const KIND_LABEL: Record<DeepTimeEventKind, string> = {
  'first-evidence': 'First evidence',
  diversification: 'Diversification',
  extinction: 'Extinction',
  transition: 'Transition',
};

const GROUPS = [
  { id: 'precambrian', label: 'Precambrian', range: '4.567 Ga – 538.8 Ma' },
  { id: 'paleozoic', label: 'Paleozoic', range: '538.8 – 251.902 Ma' },
  { id: 'mesozoic', label: 'Mesozoic', range: '251.902 – 66 Ma' },
  { id: 'cenozoic', label: 'Cenozoic', range: '66 Ma – today' },
];

type Props = {
  onSelect: (id: string) => void;
};

export function LifeThroughTime({ onSelect }: Props) {
  return (
    <section className="dt-events" id="life-through-time" aria-labelledby="dt-events-title">
      <div className="shell">
        <header className="dt-events__head">
          <div>
            <p className="label">03 / Event register</p>
            <h2 className="serif" id="dt-events-title">
              Life through time.
            </h2>
          </div>
          <div className="dt-events__intro">
            <p>
              A dated register of first appearances, transitions and extinctions. Open a row to read
              the evidence, its limits and the geological unit it belongs to.
            </p>
            <p className="mono">
              {deepTimeEvents.length} selected events · fossil evidence and inferred origins kept
              separate
            </p>
          </div>
        </header>

        <div className="dt-events__register">
          {GROUPS.map((group) => {
            const events = deepTimeEvents.filter((event) =>
              isGeoDescendant(event.unitId, group.id),
            );
            if (!events.length) return null;

            return (
              <section className="dt-events__group" data-group={group.id} key={group.id}>
                <header className="dt-events__group-head">
                  <p className="label">{group.label}</p>
                  <p className="mono">{group.range}</p>
                  <p className="mono">
                    {events.length} {events.length === 1 ? 'event' : 'events'}
                  </p>
                </header>

                <ol className="dt-events__list">
                  {events.map((event) => {
                    const unit = getGeoUnit(event.unitId);
                    return (
                      <li key={event.id}>
                        <details className="dt-event">
                          <summary>
                            <span className="dt-event__date mono">{event.dateLabel}</span>
                            <span className="dt-event__title">{event.title}</span>
                            <span className="dt-event__kind">{KIND_LABEL[event.kind]}</span>
                            <span className="dt-event__toggle" aria-hidden="true">
                              +
                            </span>
                          </summary>
                          <div className="dt-event__body">
                            <p>{event.body}</p>
                            {event.note ? <p className="dt-event__note">{event.note}</p> : null}
                            <div className="dt-event__foot">
                              {unit ? (
                                <button
                                  type="button"
                                  className="dt-inline-button"
                                  onClick={() => onSelect(unit.id)}
                                >
                                  Place in the {unit.name} <span aria-hidden="true">↗</span>
                                </button>
                              ) : null}
                              <span className="mono">
                                {event.basis === 'fossil' ? 'Fossil evidence' : 'Environmental proxy'}
                              </span>
                              <InlineSources ids={event.refs} />
                            </div>
                          </div>
                        </details>
                      </li>
                    );
                  })}
                </ol>
              </section>
            );
          })}
        </div>

        <div className="dt-events__method">
          <p className="label">How to read this register</p>
          <p>
            <strong>Fossil evidence</strong> is the age of the oldest known material assigned to a
            group. <strong>An inferred origin</strong> may be older than the first fossil. A species
            appearance is not the origin of its lineage. The labels keep those claims separate.
          </p>
          <p>
            The register is deliberately incomplete. It omits events for which the atlas does not
            have a defensible date and citation, and it does not treat the oldest known fossil as
            the moment a lineage began.
          </p>
        </div>
      </div>
    </section>
  );
}

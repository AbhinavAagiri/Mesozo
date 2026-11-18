type Props = {
  items: string[];
  label?: string;
};

// Enough repeats to cover the widest common viewport while the strip moves
// through one full copy. The animation advances by exactly one of these runs.
const RUN_COPIES = 6;

/** Thin geological ticker: the reference marquee, re-voiced as a strata strip. */
export function Ticker({ items, label }: Props) {
  return (
    <div className="ticker">
      {label ? <p className="ticker__label label">{label}</p> : null}
      <div className="ticker__viewport">
        <div className="ticker__track">
          {Array.from({ length: RUN_COPIES }, (_, runIndex) => (
            <div className="ticker__run" aria-hidden="true" key={runIndex}>
              {items.map((item) => (
                <span className="ticker__item" key={item}>
                  <span>{item}</span>
                  <i className="ticker__mark" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="visually-hidden">{items.join(' · ')}</p>
    </div>
  );
}

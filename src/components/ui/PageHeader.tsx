import type { ReactNode } from 'react';

type Meta = { label: string; value: string };

type Props = {
  index: string;
  kicker: string;
  title: ReactNode;
  intro?: string;
  meta?: Meta[];
  children?: ReactNode;
};

export function PageHeader({ index, kicker, title, intro, meta, children }: Props) {
  return (
    <header className="phead">
      <div className="shell phead__grid">
        <div className="phead__rail">
          <span className="phead__index mono">{index}</span>
          <span className="phead__kicker">{kicker}</span>
          <span className="phead__edition mono">MESOZO / 2026</span>
        </div>

        <div className="phead__main">
          <h1 className="phead__title">{title}</h1>
          <div className="phead__rule" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="phead__aside">
          {intro ? <p className="phead__intro">{intro}</p> : null}
          {meta?.length ? (
            <dl className="phead__meta">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd className="mono">{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {children}
        </div>
      </div>
    </header>
  );
}

import { useEffect, useRef, useState } from 'react';
import { AssetImage } from '../../components/ui/AssetImage';
import { InlineSources } from '../../components/ui/Sources';
import { assetById } from '../../data';
import type { SpeciesPageContent, SpinosaurusEvent } from '../../data/types';
import { SpeciesSectionHead } from './SpeciesSectionHead';

type Props = {
  history: NonNullable<SpeciesPageContent['history']>;
  images: NonNullable<SpeciesPageContent['historyImages']>;
  events: SpinosaurusEvent[];
  index?: string;
};

/** Reconstruction history as a selectable record of interpretations. */
export function SpeciesHistory({ history, images, events, index = '06' }: Props) {
  const start = events.findIndex((event) => event.year === '2014');
  const [active, setActive] = useState(start >= 0 ? start : 0);
  const railRef = useRef<HTMLDivElement>(null);
  const event = events[active];
  const image = event ? images[event.year] : undefined;
  const asset = image ? assetById.get(image.id) : undefined;

  useEffect(() => {
    const rail = railRef.current;
    const tab = rail?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!rail || !tab) return;

    const railRect = rail.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    const top =
      rail.scrollTop + tabRect.top - railRect.top - (railRect.height - tabRect.height) / 2;
    const left =
      rail.scrollLeft + tabRect.left - railRect.left - (railRect.width - tabRect.width) / 2;
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches
      ? 'auto'
      : 'smooth';

    rail.scrollTo({ top, left, behavior });
  }, [active]);

  if (!event) return null;

  const go = (next: number) => {
    setActive(Math.max(0, Math.min(events.length - 1, next)));
  };

  return (
    <section id="reconstruction" className="spx-section spx-section--dark" data-theme="dark">
      <div className="shell">
        <SpeciesSectionHead
          index={index}
          title="The animal has not changed. The reading of it has."
          intro={history.intro}
        />

        <div className="spx-hist">
          <div
            ref={railRef}
            className="spx-hist__rail"
            role="tablist"
            aria-label="Reconstruction history"
          >
            {events.map((entry, index) => (
              <button
                key={`${entry.year}-${entry.title}`}
                type="button"
                role="tab"
                id={`hist-tab-${index}`}
                aria-selected={index === active}
                className={`spx-hist__step${index === active ? ' is-active' : ''}`}
                onClick={() => setActive(index)}
                data-cursor="link"
              >
                <span className="mono">{entry.year}</span>
                <span className="spx-hist__step-title">{entry.title}</span>
              </button>
            ))}
          </div>

          <div
            className={`spx-hist__panel${image ? '' : ' spx-hist__panel--text'}`}
            role="tabpanel"
            aria-labelledby={`hist-tab-${active}`}
          >
            {image ? (
              <figure className="spx-hist__figure">
                <div className="spx-hist__media">
                  <AssetImage
                    id={image.id}
                    alt={asset?.title ?? image.caption}
                    sizes="(max-width: 900px) 94vw, 34vw"
                    fit="contain"
                  />
                </div>
                <figcaption className="spx-hist__caption">
                  <span>{image.caption}</span>
                  {asset ? (
                    <a href={asset.sourceUrl} target="_blank" rel="noreferrer">
                      Source ↗
                    </a>
                  ) : null}
                </figcaption>
              </figure>
            ) : (
              <div className="spx-hist__void" aria-hidden="true">
                <span className="serif">{event.year}</span>
                <span className="label">No image in the archive for this entry</span>
              </div>
            )}

            <div className="spx-hist__text" key={`${event.year}-${event.title}`}>
              <div className="spx-hist__meta">
                <span className="label">
                  {event.dateLabel} · {event.kind}
                </span>
                <span className="label">
                  {String(active + 1).padStart(2, '0')} / {String(events.length).padStart(2, '0')}
                </span>
              </div>

              <h3 className="serif spx-hist__title">{event.title}</h3>
              {event.people ? <p className="spx-hist__people label">{event.people}</p> : null}
              <p className="spx-hist__body">{event.body}</p>
              <InlineSources ids={event.refs ?? []} className="inline-sources--light" />

              <div className="spx-hist__controls">
                <button
                  type="button"
                  className="spx-hist__control"
                  onClick={() => go(active - 1)}
                  disabled={active === 0}
                  data-cursor="link"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  className="spx-hist__control"
                  onClick={() => go(active + 1)}
                  disabled={active === events.length - 1}
                  data-cursor="link"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

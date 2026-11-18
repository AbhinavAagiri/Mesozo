import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AssetImage } from '../../components/ui/AssetImage';
import { species } from '../../data';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { useReducedMotion } from '../../lib/useReducedMotion';

const FEATURED_COUNT = 10;

type IllustratedSpecies = (typeof species)[number] & { image: string };

function pickFeaturedSpecies(count: number): IllustratedSpecies[] {
  const pool = species.filter((item): item is IllustratedSpecies => Boolean(item.image));

  // A partial Fisher–Yates shuffle: pick a fresh, unique set on every mount
  // without touching the imported archive array.
  for (let index = 0; index < count && index < pool.length; index += 1) {
    const swapWith = index + Math.floor(Math.random() * (pool.length - index));
    [pool[index], pool[swapWith]] = [pool[swapWith], pool[index]];
  }

  return pool.slice(0, count);
}

export function Specimens() {
  const rootRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const [featured] = useState(() => pickFeaturedSpecies(FEATURED_COUNT));

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || reduced) return;
    if (window.matchMedia('(max-width: 700px)').matches) return;

    const ctx = gsap.context(() => {
      const distance = () =>
        track.scrollWidth - window.innerWidth + parseFloat(getComputedStyle(root).paddingLeft || '0');

      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reduced]);

  return (
    <section className="specimens" id="species" ref={rootRef}>
      <div className="specimens__head shell">
        <p className="section-head__index">
          <span className="label">03</span>
          <span className="label">Specimens</span>
        </p>
        <h2 className="specimens__title serif">The archive.</h2>
        <p className="specimens__intro">
          Ten animals, drawn at random from the full archive each time you arrive. Every dossier
          separates what the fossils preserve from what researchers infer.
        </p>
        <Link className="specimens__all" to="/species" data-cursor="link">
          All {species.length} species <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="specimens__track" ref={trackRef}>
        {featured.map((item, index) => (
          <article className="specimen" key={item.slug}>
            <Link className="specimen__link" to={`/species/${item.slug}`} data-cursor="view">
              <div className="specimen__figure">
                <AssetImage
                  id={item.image}
                  alt={`Life reconstruction of ${item.scientificName}.`}
                  sizes="(max-width: 700px) 80vw, 36vw"
                  fit="contain"
                  eager
                />
                <span className="specimen__figure-index mono">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="specimen__meta">
                <div className="specimen__names">
                  <h3 className="specimen__name serif">{item.scientificName.split(' ')[0]}</h3>
                  <p className="specimen__sci mono">{item.scientificName}</p>
                </div>
                <p className="specimen__period label">
                  {item.periodLabel}
                  <br />
                  {item.ageLabel}
                </p>
                <span className="specimen__arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </Link>
          </article>
        ))}

        <article className="specimen specimen--end">
          <p className="label">End of selection</p>
          <Link className="specimen__end-link serif" to="/species" data-cursor="link">
            Browse the full archive <span aria-hidden="true">↗</span>
          </Link>
          <p className="specimen__end-note">
            Each dossier separates fossil evidence from inference, and lists its sources.
          </p>
        </article>
      </div>

      <div className="specimens__foot shell">
        <span className="label">Drag or scroll to move through the archive</span>
        <span className="label specimens__count">
          {featured.length} of {species.length} shown
        </span>
      </div>
    </section>
  );
}

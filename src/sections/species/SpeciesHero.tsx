import { useLayoutEffect, useRef } from 'react';
import { AssetImage } from '../../components/ui/AssetImage';
import { SpeciesPlate } from '../../components/species/SpeciesPlate';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { assetById } from '../../data';
import type { Species, SpeciesPageContent } from '../../data/types';
import { gsap } from '../../lib/gsap';
import { useReducedMotion } from '../../lib/useReducedMotion';

type Props = {
  species: Species;
  page?: SpeciesPageContent;
};

/** Editorial cover for a single specimen; restrained parallax, no 3D dependency. */
export function SpeciesHero({ species, page }: Props) {
  const root = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const imageId = page?.hero.image ?? species.image;
  const asset = imageId ? assetById.get(imageId) : undefined;
  const [genus, ...rest] = species.scientificName.split(' ');
  const epithet = rest.join(' ');

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.spx-hero__media',
        { yPercent: -2 },
        {
          yPercent: 4,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <header className="spx-hero" ref={root} data-theme="dark">
      <div className="spx-hero__top shell">
        <div className="spx-hero__crumbs">
          <Breadcrumbs
            tone="dark"
            items={[
              { label: 'Home', to: '/' },
              { label: 'Species database', to: '/species' },
              { label: `${species.accession} · ${species.status}` },
            ]}
          />
        </div>
      </div>

      <div className="spx-hero__grid shell">
        <div className="spx-hero__copy">
          <p className="eyebrow spx-hero__kicker" data-reveal>
            {page?.hero.kicker ?? 'Species record'}
          </p>

          <h1 className="spx-hero__title" aria-label={species.scientificName}>
            <span className="spx-hero__line" data-line>
              <span>{genus}</span>
            </span>
            <span className="spx-hero__line spx-hero__line--epithet" data-line>
              <span>
                <em>{epithet}</em>
              </span>
            </span>
          </h1>

          <p className="spx-hero__named mono" data-reveal>
            {species.commonName} · {species.namedBy}
          </p>
          <p className="spx-hero__intro" data-reveal>
            {page?.hero.intro ?? species.tagline}
          </p>

          <dl className="spx-hero__meta" data-reveal>
            <div>
              <dt className="label">Period</dt>
              <dd className="mono">
                {species.periodLabel} · {species.stage}
              </dd>
            </div>
            <div>
              <dt className="label">Age</dt>
              <dd className="mono">{species.ageLabel}</dd>
            </div>
            <div>
              <dt className="label">Range</dt>
              <dd className="mono">{species.region.join(' · ')}</dd>
            </div>
            <div>
              <dt className="label">Group</dt>
              <dd className="mono">{species.group}</dd>
            </div>
          </dl>
        </div>

        <figure className="spx-hero__figure" data-reveal>
          <div className={`spx-hero__media${imageId ? '' : ' spx-hero__media--record'}`}>
            {imageId ? (
              <AssetImage
                id={imageId}
                alt={`Life reconstruction of ${species.scientificName}.`}
                sizes="(max-width: 980px) 92vw, 52vw"
                fit="contain"
                priority
              />
            ) : (
              <SpeciesPlate species={species} size="hero" />
            )}
          </div>
          <figcaption className="spx-hero__caption">
            <span className="label">
              {imageId ? (page?.hero.imageLabel ?? 'Life reconstruction') : 'Database record'}
            </span>
            {asset ? (
              <span>
                {asset.creator} · {asset.license} ·{' '}
                <a href={asset.sourceUrl} target="_blank" rel="noreferrer">
                  source
                </a>
              </span>
            ) : (
              <span>No licensed life reconstruction. The plate identifies the record, not the animal's appearance.</span>
            )}
          </figcaption>
        </figure>
      </div>

      <div className="spx-hero__foot shell">
        <a className="spx-hero__scroll" href="#overview">
          <span className="label">Read the dossier</span>
          <span aria-hidden="true">↓</span>
        </a>
        <p className="spx-hero__note mono">
          {imageId
            ? 'A reconstruction is an argument about soft tissue, colour and pose — not a photograph.'
            : 'This is an unillustrated database record. The plate is not a reconstruction of the living animal.'}
        </p>
      </div>
    </header>
  );
}

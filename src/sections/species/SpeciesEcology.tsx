import { AssetImage } from '../../components/ui/AssetImage';
import { InlineSources } from '../../components/ui/Sources';
import { assetById, getPeriod } from '../../data';
import type { Species, SpeciesPageEcology } from '../../data/types';
import { SpeciesSectionHead } from './SpeciesSectionHead';

type Props = {
  species: Species;
  ecology: SpeciesPageEcology;
  index?: string;
};

/** Habitat and palaeoecology, with reconstructions labelled as interpretations. */
export function SpeciesEcology({ species, ecology, index = '04' }: Props) {
  const asset = assetById.get(ecology.image);
  const period = getPeriod(species.period);

  return (
    <section id="ecology" className="spx-section spx-section--tint">
      <div className="shell">
        <SpeciesSectionHead index={index} title="An animal at the water’s edge" intro={ecology.intro} />

        <div className="spx-eco">
          <figure className="spx-eco__figure-wrap" data-reveal>
            <div className="spx-eco__figure">
              <AssetImage
                id={ecology.image}
                alt={asset?.title ?? 'Interpretive drawing of Spinosaurus with prey.'}
                sizes="(max-width: 900px) 94vw, 46vw"
                fit="contain"
              />
            </div>
            <figcaption className="spx-eco__caption">
              <span className="label">{ecology.imageLabel}</span>
              <span>
                {ecology.imageCaption}
                {asset ? (
                  <>
                    {' '}
                    <a href={asset.sourceUrl} target="_blank" rel="noreferrer">
                      Source ↗
                    </a>
                  </>
                ) : null}
              </span>
            </figcaption>
          </figure>

          <div className="spx-eco__copy" data-reveal>
            {ecology.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <InlineSources ids={ecology.refs} />

            <div className="spx-eco__limits">
              <p className="label">Not recoverable from these rocks</p>
              <ul>
                {ecology.limits.map((limit) => (
                  <li key={limit}>{limit}</li>
                ))}
              </ul>
            </div>
          </div>

          <dl className="spx-eco__deposits" data-reveal>
            <div>
              <dt className="label">Egypt</dt>
              <dd className="serif">Bahariya Oasis</dd>
              <dd className="mono">
                {species.periodLabel} · {species.stage}
              </dd>
            </div>
            <div>
              <dt className="label">Morocco</dt>
              <dd className="serif">Kem Kem Group</dd>
              <dd className="mono">
                {species.periodLabel} · {species.stage}
              </dd>
            </div>
            <div className="spx-eco__deposit-note">
              <dt className="label">What the deposits record</dt>
              <dd>
                {period.name} river and coastal settings, with fish and other terrestrial and
                aquatic organisms. The presence of an animal in a deposit does not by itself
                establish how it lived.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

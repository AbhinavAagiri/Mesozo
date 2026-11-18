import { Link } from 'react-router-dom';
import { AssetImage } from '../../components/ui/AssetImage';
import { AtlasEvidenceTag } from '../../components/ui/AtlasEvidenceTag';
import { InlineSources } from '../../components/ui/Sources';
import type { AtlasComparison } from '../../data/types';
import { assetById, getPeriod, speciesBySlug } from '../../data';

type Props = {
  comparison: AtlasComparison;
};

/** A comparison only where both sides have a real specimen image. */
export function AtlasComparison({ comparison }: Props) {
  const leftSpecies = speciesBySlug.get(comparison.left.speciesId);
  const rightSpecies = speciesBySlug.get(comparison.right.speciesId);
  const leftAsset = assetById.get(comparison.left.imageAsset);
  const rightAsset = assetById.get(comparison.right.imageAsset);
  const leftLabel = leftSpecies?.genus ?? comparison.left.speciesId;
  const rightLabel = rightSpecies?.genus ?? comparison.right.speciesId;
  const sharedPeriod =
    leftSpecies && rightSpecies && leftSpecies.period === rightSpecies.period
      ? getPeriod(leftSpecies.period)
      : undefined;

  return (
    <section className="atlas-comparison" id="comparison" aria-labelledby="atlas-comparison-title">
      <div className="shell">
        <div className="atlas-section-head">
          <div>
            <p className="label">03 — Compare</p>
            <h2 className="serif" id="atlas-comparison-title">
              {comparison.title}
            </h2>
          </div>
          <div className="atlas-section-head__body">
            <p>{comparison.intro}</p>
          </div>
        </div>

        <div className="atlas-compare-plates">
          <figure className="atlas-compare-plate">
            <div className="atlas-compare-plate__media">
              <AssetImage
                id={comparison.left.imageAsset}
                alt={`Skull of ${leftSpecies?.scientificName ?? comparison.left.speciesId}, lateral view.`}
                sizes="(max-width: 800px) 94vw, 44vw"
                fit="contain"
              />
              <span className="atlas-compare-plate__stamp mono">Not to scale</span>
            </div>
            <figcaption>
              <p className="label">{comparison.left.imageLabel}</p>
              <p>{comparison.left.imageNote}</p>
              {leftAsset ? (
                <a href={leftAsset.sourceUrl} target="_blank" rel="noreferrer">
                  {leftAsset.creator} · {leftAsset.license} ↗
                </a>
              ) : null}
            </figcaption>
          </figure>

          <figure className="atlas-compare-plate">
            <div className="atlas-compare-plate__media">
              <AssetImage
                id={comparison.right.imageAsset}
                alt={`Skull of ${rightSpecies?.scientificName ?? comparison.right.speciesId}, lateral view.`}
                sizes="(max-width: 800px) 94vw, 44vw"
                fit="contain"
              />
              <span className="atlas-compare-plate__stamp mono">Not to scale</span>
            </div>
            <figcaption>
              <p className="label">{comparison.right.imageLabel}</p>
              <p>{comparison.right.imageNote}</p>
              {rightAsset ? (
                <a href={rightAsset.sourceUrl} target="_blank" rel="noreferrer">
                  {rightAsset.creator} · {rightAsset.license} ↗
                </a>
              ) : null}
            </figcaption>
          </figure>
        </div>

        <aside className="atlas-compare-caveat">
          <p className="label">Scale warning</p>
          <p className="serif">{comparison.caveat}</p>
        </aside>

        <div className="atlas-compare-table" role="table" aria-label="Comparison of skull anatomy and evidence">
          <div className="atlas-compare-table__head" role="row">
            <span role="columnheader">Structure</span>
            <span role="columnheader">{leftLabel}</span>
            <span role="columnheader">{rightLabel}</span>
            <span role="columnheader">Claim type</span>
          </div>
          {comparison.rows.map((row) => (
            <div
              className="atlas-compare-table__row"
              role="row"
              key={row.label}
              data-left-label={leftLabel}
              data-right-label={rightLabel}
            >
              <span className="atlas-compare-table__label" role="rowheader">
                {row.label}
              </span>
              <p role="cell" data-left-label={leftLabel}>
                {row.left}
              </p>
              <p role="cell" data-right-label={rightLabel}>
                {row.right}
              </p>
              <span role="cell">
                <AtlasEvidenceTag kind={row.evidence} short />
              </span>
            </div>
          ))}
        </div>

        <div className="atlas-compare-links">
          {leftSpecies ? (
            <Link to={`/species/${leftSpecies.slug}`}>
              Open {leftSpecies.genus} dossier <span aria-hidden="true">↗</span>
            </Link>
          ) : null}
          {rightSpecies ? (
            <Link to={`/species/${rightSpecies.slug}`}>
              Open {rightSpecies.genus} dossier <span aria-hidden="true">↗</span>
            </Link>
          ) : null}
          {sharedPeriod ? (
            <Link to={`/deep-time?period=${sharedPeriod.id}`}>
              Both lived in the {sharedPeriod.name} <span aria-hidden="true">↗</span>
            </Link>
          ) : null}
        </div>

        <InlineSources ids={comparison.refs} />
      </div>
    </section>
  );
}

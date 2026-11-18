import type { Species } from '../../data/types';
import '../../styles/species-plate.css';

type Props = {
  species: Species;
  size?: 'card' | 'hero' | 'thumb';
};

/**
 * An explicit unillustrated-record plate. It is not a life reconstruction and
 * must never be captioned as one. The 100 V18 database additions use this until
 * a correctly identified, licence-cleared image is registered for the species.
 */
export function SpeciesPlate({ species, size = 'card' }: Props) {
  const initial = species.genus.charAt(0).toUpperCase();
  const group = species.groupKey.toLowerCase();

  return (
    <div
      className={`species-plate species-plate--${size}`}
      data-group={group}
      role="img"
      aria-label={`${species.scientificName}. Database record without a licensed life reconstruction.`}
    >
      <span className="species-plate__rule" aria-hidden="true" />
      <span className="species-plate__group mono">{species.groupKey}</span>
      <span className="species-plate__initial serif" aria-hidden="true">
        {initial}
      </span>
      <span className="species-plate__period mono">{species.periodLabel}</span>
      <span className="species-plate__meta mono">
        <span>{species.accession}</span>
        <span>{species.stage}</span>
      </span>
      <span className="species-plate__note mono">No licensed life reconstruction</span>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { AssetImage } from '../../components/ui/AssetImage';
import {
  assetById,
  discoveryEventForSpecimen,
  discoveryFormationForSpecimen,
  discoveryLocationForSpecimen,
  speciesBySlug,
} from '../../data';
import type { DiscoverySpecimen } from '../../data/types';
import { MEDIA_ROLE_LABEL } from './labels';

type Props = {
  specimen: DiscoverySpecimen;
  index: number;
};

export function SpecimenCard({ specimen, index }: Props) {
  const species = speciesBySlug.get(specimen.speciesId);
  const event = discoveryEventForSpecimen(specimen);
  const formation = discoveryFormationForSpecimen(specimen);
  const location = discoveryLocationForSpecimen(specimen);
  const media = specimen.media[0];
  const asset = media ? assetById.get(media.assetId) : undefined;

  return (
    <Link
      className={`dsc-card${specimen.featured ? ' dsc-card--lead' : ''}`}
      to={`/discoveries/specimen/${specimen.id}`}
      data-reveal
    >
      <figure className="dsc-card__figure">
        <div className="dsc-card__media">
          {media && asset ? (
            <AssetImage
              id={media.assetId}
              alt={`${specimen.identifier}: ${media.caption}`}
              sizes={specimen.featured ? '(max-width: 760px) 92vw, 58vw' : '(max-width: 760px) 92vw, 30vw'}
              fit="contain"
            />
          ) : (
            <div className="dsc-card__placeholder">
              <span className="label">No licensed specimen photograph</span>
              <span className="dsc-card__placeholder-id serif">{specimen.identifier}</span>
              <span className="mono">Collection record only</span>
            </div>
          )}
        </div>
        <figcaption className="dsc-card__media-label">
          <span className="label">{media ? MEDIA_ROLE_LABEL[media.role] : 'Catalogue record'}</span>
          <span className="mono">{String(index + 1).padStart(2, '0')}</span>
        </figcaption>
      </figure>

      <div className="dsc-card__body">
        <p className="dsc-card__eyebrow label">
          {species?.commonName ?? specimen.speciesId} · {event?.dateLabel ?? 'Date not stated'}
        </p>
        <h3 className="dsc-card__title serif">{specimen.identifier}</h3>
        <p className="dsc-card__species">{species?.scientificName ?? specimen.speciesId}</p>

        <dl className="dsc-card__facts">
          <div>
            <dt className="label">Type</dt>
            <dd>{specimen.typeStatus}</dd>
          </div>
          <div>
            <dt className="label">Formation</dt>
            <dd>{formation?.name ?? 'Not stated'}</dd>
          </div>
          <div>
            <dt className="label">Locality</dt>
            <dd>{location?.label ?? 'Not stated'}</dd>
          </div>
        </dl>

        <span className="dsc-card__open mono">
          Open collection record <span aria-hidden="true">↗</span>
        </span>
      </div>
    </Link>
  );
}

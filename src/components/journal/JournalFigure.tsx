import { assetById } from '../../data';
import { AssetImage } from '../ui/AssetImage';

type Props = {
  assetId: string;
  alt: string;
  caption?: string;
  label?: string;
  fit?: 'cover' | 'contain';
  position?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  showCredit?: boolean;
};

/**
 * A licensed editorial figure. The credit is generated from the same asset
 * registry as the rest of MESOZO; no article has a parallel image registry.
 */
export function JournalFigure({
  assetId,
  alt,
  caption,
  label,
  fit = 'cover',
  position = '50% 50%',
  sizes = '100vw',
  priority = false,
  className = '',
  showCredit = true,
}: Props) {
  const asset = assetById.get(assetId);
  if (!asset) return null;

  return (
    <figure className={`jrn-figure ${className}`.trim()}>
      <div className="jrn-figure__frame">
        <AssetImage
          id={assetId}
          alt={alt}
          sizes={sizes}
          fit={fit}
          position={position}
          priority={priority}
        />
      </div>
      <figcaption className="jrn-figure__caption">
        {label ? <span className="label jrn-figure__label">{label}</span> : null}
        {caption ? <p>{caption}</p> : null}
        {showCredit ? (
          <p className="jrn-figure__credit">
            {asset.creator} · {asset.license} ·{' '}
            <a href={asset.sourceUrl} target="_blank" rel="noreferrer">
              source ↗
            </a>
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}

import { contourReference, fieldAnalogues } from '../../data/field-photography';

type Props = {
  unitId: string;
  unitName: string;
};

export function FieldAnalogue({ unitId, unitName }: Props) {
  const analogue = fieldAnalogues[unitId];
  if (!analogue) return null;

  return (
    <aside className="dt-field" aria-label={`Modern field reference for the ${unitName}`}>
      <figure className="dt-field__photo">
        <div className="dt-field__frame">
          <img
            src={analogue.src1600}
            srcSet={`${analogue.src900} 900w, ${analogue.src1600} 1600w`}
            sizes="(max-width: 900px) 100vw, 72vw"
            alt={analogue.alt}
            width={analogue.width}
            height={analogue.height}
            loading="lazy"
            decoding="async"
          />
        </div>
        <figcaption className="dt-field__caption">
          <div className="dt-field__caption-head">
            <span className="label">Modern analogue</span>
            <span className="mono">
              {analogue.environment} · {analogue.location}
            </span>
          </div>
          <p>{analogue.caption}</p>
          <p className="dt-field__disclaimer mono">
            Field reference only — not a {unitName} reconstruction.
          </p>
          <p className="dt-field__credit mono">
            Photograph: {analogue.photographer}.{' '}
            <a
              href={analogue.sourceUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Photograph source: ${analogue.photographer}`}
            >
              Source <span aria-hidden="true">↗</span>
            </a>{' '}
            ·{' '}
            <a
              href={analogue.licenseUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${analogue.license} details`}
            >
              {analogue.license}
            </a>
          </p>
        </figcaption>
      </figure>

      <figure className="dt-field__sheet">
        <div className="dt-field__frame">
          <img
            src={contourReference.src}
            alt={contourReference.alt}
            width={600}
            height={600}
            loading="lazy"
            decoding="async"
          />
        </div>
        <figcaption className="dt-field__caption">
          <div className="dt-field__caption-head">
            <span className="label">Field-sheet method</span>
            <span className="mono">Contours / 20 ft</span>
          </div>
          <p>{contourReference.caption}</p>
          <p className="dt-field__credit mono">
            {contourReference.creator}.{' '}
            <a
              href={contourReference.sourceUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Contour sheet source: U.S. Geological Survey"
            >
              Source <span aria-hidden="true">↗</span>
            </a>{' '}
            ·{' '}
            <a
              href={contourReference.licenseUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${contourReference.license} details`}
            >
              {contourReference.license}
            </a>
          </p>
        </figcaption>
      </figure>
    </aside>
  );
}

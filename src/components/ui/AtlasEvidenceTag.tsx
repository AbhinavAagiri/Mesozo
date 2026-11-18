import type { AtlasEvidence } from '../../data/types';

const LABEL: Record<AtlasEvidence, string> = {
  fossil: 'Fossil evidence',
  reconstruction: 'Anatomical reconstruction',
  interpretation: 'Functional interpretation',
  debate: 'Scientific debate',
};

type Props = {
  kind: AtlasEvidence;
  className?: string;
  short?: boolean;
};

/**
 * The atlas uses a four-part key: observed bone, reconstructed anatomy,
 * inferred function and open disagreement. The marks are meaningful, not
 * decorative.
 */
export function AtlasEvidenceTag({ kind, className = '', short = false }: Props) {
  return (
    <span className={`atlas-tag atlas-tag--${kind} ${className}`.trim()}>
      <span className="atlas-tag__mark" aria-hidden="true" />
      <span>{short ? LABEL[kind].replace('Anatomical ', '').replace('Functional ', '') : LABEL[kind]}</span>
    </span>
  );
}

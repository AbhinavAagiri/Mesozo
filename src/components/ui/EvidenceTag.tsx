import type { EvidenceKind } from '../../data/types';

const LABEL: Record<EvidenceKind, string> = {
  fossil: 'Established evidence',
  reconstruction: 'Reconstruction',
  inference: 'Strongly supported',
  contested: 'Active debate',
  unknown: 'Insufficient evidence',
};

type Props = {
  kind: EvidenceKind;
  className?: string;
};

/** Keeps the evidence hierarchy visible wherever a claim is made. */
export function EvidenceTag({ kind, className = '' }: Props) {
  return (
    <span className={`evidence-tag evidence-tag--${kind} ${className}`.trim()}>
      <span className="evidence-tag__mark" aria-hidden="true" />
      {LABEL[kind]}
    </span>
  );
}

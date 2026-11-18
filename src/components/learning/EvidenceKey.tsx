const CATEGORIES = [
  {
    label: 'Established evidence',
    marker: 'Direct',
    body: 'Fossil material, geological evidence or a strong scientific consensus. The claim is as close to the record as the record allows.',
  },
  {
    label: 'Strongly supported interpretation',
    marker: 'Inferred',
    body: 'A well-supported inference from anatomy, comparison or experiment. It is not preserved directly, and the reasoning should be visible.',
  },
  {
    label: 'Active scientific debate',
    marker: 'Open',
    body: 'Credible researchers have proposed competing explanations. The archive presents the disagreement rather than choosing a winner by tone.',
  },
  {
    label: 'Unknown / insufficient evidence',
    marker: 'Gap',
    body: 'The surviving evidence does not support a reliable conclusion. The gap is stated rather than filled with a plausible story.',
  },
];

/**
 * A four-part public evidence key. It is deliberately not a decorative legend:
 * every category describes the status of a claim, not the quality of an image.
 */
export function EvidenceKey({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`evidence-key${compact ? ' evidence-key--compact' : ''}`}>
      {CATEGORIES.map((category, index) => (
        <article className="evidence-key__item" key={category.label}>
          <span className="evidence-key__index mono">0{index + 1}</span>
          <span className="evidence-key__marker label">{category.marker}</span>
          <h3 className="serif">{category.label}</h3>
          <p>{category.body}</p>
        </article>
      ))}
    </div>
  );
}

export const EVIDENCE_CATEGORIES = CATEGORIES;

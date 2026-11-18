import { getReferences } from '../../data';
import type { Reference } from '../../data/types';

type Props = {
  ids: string[];
  className?: string;
  extraRefs?: Reference[];
};

/** Compact author–year citations with DOI links, used beside claims. */
export function InlineSources({ ids, className = '', extraRefs = [] }: Props) {
  const refs = getReferences(ids, extraRefs);
  if (!refs.length) return null;

  return (
    <p className={`inline-sources ${className}`.trim()}>
      <span className="label">Sources</span>
      {refs.map((ref) => {
        const href = ref.doi ? `https://doi.org/${ref.doi}` : ref.url;
        const label = `${ref.authors.split(',')[0]} ${ref.year}`;
        return href ? (
          <a key={ref.id} href={href} target="_blank" rel="noreferrer" data-cursor="link">
            {label}
          </a>
        ) : (
          <span key={ref.id}>{label}</span>
        );
      })}
    </p>
  );
}

/** Full bibliography for a dossier or page. */
export function ReferenceList({ ids, extraRefs = [] }: Props) {
  const refs = getReferences(ids, extraRefs);
  if (!refs.length) return null;

  return (
    <ol className="refs">
      {refs.map((ref, index) => {
        const href = ref.doi ? `https://doi.org/${ref.doi}` : ref.url;
        return (
          <li className="refs__item" key={ref.id} id={`ref-${ref.id}`}>
            <span className="refs__num mono">{String(index + 1).padStart(2, '0')}</span>
            <div className="refs__body">
              <p>
                {ref.authors} ({ref.year}). <em>{ref.title}</em>
                {ref.journal ? `. ${ref.journal}` : ''}
                {ref.volume ? ` ${ref.volume}` : ''}
                {ref.pages ? `, ${ref.pages}` : ''}.
              </p>
              {ref.sourceType || href ? (
                <div className="refs__foot">
                  {ref.sourceType ? <span className="refs__type label">{ref.sourceType}</span> : null}
                  {href ? (
                    <a className="refs__link mono" href={href} target="_blank" rel="noreferrer">
                      {ref.doi ? `doi:${ref.doi}` : 'Source'} ↗
                    </a>
                  ) : (
                    <span className="refs__type label">No DOI or URL located</span>
                  )}
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

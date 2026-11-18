import { Link } from 'react-router-dom';
import type { LearningLink } from '../../data/learning';

type Props = {
  link: LearningLink;
  index?: number;
};

/** A quiet, reusable link row for guide and glossary cross-references. */
export function GuideLink({ link, index }: Props) {
  return (
    <Link className="guide-link" to={link.to} data-cursor="link">
      {typeof index === 'number' ? (
        <span className="guide-link__index mono">{String(index + 1).padStart(2, '0')}</span>
      ) : null}
      <span className="guide-link__body">
        <span className="guide-link__label">{link.label}</span>
        {link.note ? <span className="guide-link__note">{link.note}</span> : null}
      </span>
      <span className="guide-link__arrow" aria-hidden="true">
        ↗
      </span>
    </Link>
  );
}

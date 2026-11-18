import { Fragment } from 'react';
import { referenceById } from '../../data';

type Props = {
  text: string;
};

function shortAuthor(authors: string): string {
  if (/international commission on stratigraphy/i.test(authors)) return 'ICS';
  return authors.split(',')[0]?.trim() || authors;
}

/**
 * Article paragraphs use [[reference-id]] tokens. They render as small
 * author–year links to the end-of-article reference list.
 */
export function JournalProse({ text }: Props) {
  const parts = text.split(/(\[\[[a-z0-9-]+\]\])/gi);

  return (
    <>
      {parts.map((part, index) => {
        const match = part.match(/^\[\[([a-z0-9-]+)\]\]$/i);
        if (!match) return <Fragment key={`text-${index}`}>{part}</Fragment>;

        const ref = referenceById.get(match[1]);
        if (!ref) return null;

        const label = `${shortAuthor(ref.authors)} ${ref.year}`;
        return (
          <sup className="jrn-cite" key={`cite-${ref.id}-${index}`}>
            <a href={`#ref-${ref.id}`} aria-label={`Reference: ${label}`}>
              {label}
            </a>
          </sup>
        );
      })}
    </>
  );
}

type ParagraphsProps = {
  paragraphs: string[];
  className?: string;
};

export function JournalParagraphs({ paragraphs, className = '' }: ParagraphsProps) {
  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p className={className || undefined} key={index}>
          <JournalProse text={paragraph} />
        </p>
      ))}
    </>
  );
}

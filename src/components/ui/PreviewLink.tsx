import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AssetImage } from './AssetImage';

export interface PreviewData {
  eyebrow: string;
  title: string;
  body?: string;
  imageId?: string;
  imageAlt?: string;
  caption?: string;
}

type Props = {
  to: string;
  children: ReactNode;
  preview?: PreviewData;
};

type Position = {
  left: number;
  top: number;
  width: number;
};

/**
 * A normal internal link with a small, non-interactive preview on hover or
 * keyboard focus. The card is rendered in a portal so a section cannot clip it.
 */
export function PreviewLink({ to, children, preview }: Props) {
  const anchor = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState<Position | null>(null);

  const show = () => {
    if (!preview || !anchor.current) return;
    const rect = anchor.current.getBoundingClientRect();
    const width = Math.min(320, window.innerWidth - 32);
    const left = Math.min(
      Math.max(16, rect.left + rect.width / 2 - width / 2),
      window.innerWidth - width - 16,
    );
    const estimatedHeight = preview.imageId ? 250 : 150;
    const top =
      rect.bottom + estimatedHeight + 12 > window.innerHeight
        ? Math.max(16, rect.top - estimatedHeight - 12)
        : rect.bottom + 10;
    setPosition({ left, top, width });
  };

  const hide = () => setPosition(null);

  useEffect(() => {
    if (!position) return;
    const close = () => setPosition(null);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [position]);

  const card =
    position && preview
      ? createPortal(
          <span
            className="preview-card"
            role="tooltip"
            style={{ left: position.left, top: position.top, width: position.width }}
          >
            {preview.imageId ? (
              <span className="preview-card__media">
                <AssetImage
                  id={preview.imageId}
                  alt={preview.imageAlt ?? ''}
                  sizes="320px"
                />
              </span>
            ) : null}
            <span className="preview-card__text">
              <span className="preview-card__eyebrow mono">{preview.eyebrow}</span>
              <span className="preview-card__title serif">{preview.title}</span>
              {preview.body ? <span className="preview-card__body">{preview.body}</span> : null}
              {preview.caption ? (
                <span className="preview-card__caption mono">{preview.caption}</span>
              ) : null}
            </span>
          </span>,
          document.body,
        )
      : null;

  return (
    <span
      className="preview-link"
      ref={anchor}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <Link className="preview-link__anchor" to={to}>
        {children}
      </Link>
      {card}
    </span>
  );
}

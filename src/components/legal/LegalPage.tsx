import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../ui/PageHeader';
import '../../styles/legal.css';

export const LEGAL_UPDATED = {
  display: '18 November 2026',
  iso: '2026-11-18',
};

export type LegalSection = {
  id: string;
  title: string;
  body: ReactNode;
};

export type LegalMeta = {
  label: string;
  value: string;
};

export type LegalRelatedLink = {
  label: string;
  to: string;
};

type Props = {
  index: string;
  kicker: string;
  title: ReactNode;
  intro: string;
  meta: LegalMeta[];
  summary: string;
  sections: LegalSection[];
  related: LegalRelatedLink[];
};

export function LegalPage({
  index,
  kicker,
  title,
  intro,
  meta,
  summary,
  sections,
  related,
}: Props) {
  return (
    <div className="page legal-page">
      <PageHeader
        index={index}
        kicker={kicker}
        title={title}
        intro={intro}
        meta={[
          { label: 'Last updated', value: LEGAL_UPDATED.display },
          ...meta,
        ]}
      />

      <section className="legal shell" aria-label="Document contents">
        <div className="legal__layout">
          <aside className="legal__rail">
            <nav className="legal__toc" aria-label="On this page">
              <p className="label">On this page</p>
              <ol>
                {sections.map((section, sectionIndex) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>
                      <span className="mono" aria-hidden="true">
                        {String(sectionIndex + 1).padStart(2, '0')}
                      </span>
                      <span>{section.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <p className="legal__rail-note">
              A public, plain-language document based on the current MESOZO build.
            </p>
          </aside>

          <article className="legal__article">
            <div className="legal__summary">
              <p className="label">In brief</p>
              <p className="legal__summary-text serif">{summary}</p>
            </div>

            {sections.map((section, sectionIndex) => (
              <section
                className="legal__section"
                id={section.id}
                key={section.id}
                aria-labelledby={`${section.id}-heading`}
              >
                <div className="legal__section-head">
                  <span className="legal__number mono" aria-hidden="true">
                    {String(sectionIndex + 1).padStart(2, '0')}
                  </span>
                  <h2 id={`${section.id}-heading`}>{section.title}</h2>
                </div>
                <div className="legal__section-body">{section.body}</div>
              </section>
            ))}

            <footer className="legal__foot">
              <div>
                <p className="label">Last updated</p>
                <p>
                  <time dateTime={LEGAL_UPDATED.iso}>{LEGAL_UPDATED.display}</time>
                </p>
              </div>
              <nav className="legal__related" aria-label="Related information">
                {related.map((link) => (
                  <Link key={link.to} to={link.to}>
                    {link.label} <span aria-hidden="true">↗</span>
                  </Link>
                ))}
              </nav>
            </footer>
          </article>
        </div>
      </section>
    </div>
  );
}

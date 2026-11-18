import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { DestinationNav } from '../components/layout/DestinationNav';
import { GuideLink } from '../components/learning/GuideLink';
import {
  LEARNING_TRACKS,
  getLearningTopic,
  glossaryTermsFor,
  learningTopicNeighbours,
} from '../data/learning';
import { NAV } from '../data/nav';
import { usePageTitle } from '../lib/usePageTitle';
import '../styles/pages.css';
import '../styles/destination.css';
import '../styles/learning.css';

const DESTINATION = NAV.find((item) => item.id === 'explore')!;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function LearningTopicPage() {
  const { slug } = useParams();
  const topic = getLearningTopic(slug);
  usePageTitle(topic ? topic.title : 'Guide not found', {
    description: topic ? topic.standfirst : 'This field guide is not in the MESOZO archive.',
    noindex: !topic,
    breadcrumbs: topic
      ? [
          { name: 'Home', path: '/' },
          { name: 'Field guide', path: '/learn' },
          { name: topic.title, path: `/learn/${topic.slug}` },
        ]
      : undefined,
  });

  if (!topic) {
    return (
      <div className="page notfound shell">
        <p className="label">404 — Not in the field guide</p>
        <h1 className="serif">This guide does not exist.</h1>
        <Link className="text-link" to="/learn">
          Back to the field guide <span aria-hidden="true">↗</span>
        </Link>
      </div>
    );
  }

  const track = LEARNING_TRACKS.find((item) => item.id === topic.track)!;
  const terms = glossaryTermsFor(topic.keyTerms);
  const neighbours = learningTopicNeighbours(topic);

  return (
    <article className="page guide-page">
      <header className="guide-hero" data-theme="dark">
        <div className="shell">
          <div className="guide-hero__crumbs">
            <Breadcrumbs
              tone="dark"
              items={[
                { label: 'Home', to: '/' },
                { label: 'Field guide', to: '/learn' },
                { label: topic.title },
              ]}
            />
          </div>
          <p className="label guide-hero__kicker">
            {track.label} · {topic.kicker}
          </p>
          <h1 className="guide-hero__title serif">{topic.title}</h1>
          <div className="guide-hero__foot">
            <p className="guide-hero__standfirst">{topic.standfirst}</p>
            <p className="guide-hero__meta mono">
              {topic.minutes} min read · {terms.length} key terms · {topic.sources.length} sources
            </p>
          </div>
        </div>
      </header>

      <DestinationNav destination={DESTINATION} current="/learn" />

      <div className="guide-layout shell">
        <aside className="guide-rail">
          <div className="guide-rail__block">
            <p className="label">In this guide</p>
            <nav aria-label="Guide sections">
              {topic.sections.map((section) => (
                <a key={section.heading} href={`#${slugify(section.heading)}`}>
                  {section.heading}
                </a>
              ))}
            </nav>
          </div>

          <div className="guide-rail__block">
            <p className="label">Key terms</p>
            <div className="guide-rail__terms">
              {terms.map((term) => (
                <Link key={term.id} to={`/glossary#${term.id}`}>
                  {term.term}
                </Link>
              ))}
            </div>
          </div>

          <div className="guide-rail__block guide-rail__block--note">
            <p className="label">Reading note</p>
            <p>
              This guide explains the current scientific picture at the level its sources support.
              It is not a peer-reviewed paper and it does not replace the cited literature.
            </p>
            <Link className="text-link" to="/about#evidence">
              Evidence key <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </aside>

        <div className="guide-body">
          <div className="guide-body__prose">
            {topic.sections.map((section, sectionIndex) => (
              <section
                className="guide-section"
                id={slugify(section.heading)}
                key={section.heading}
                aria-labelledby={`${slugify(section.heading)}-title`}
              >
                <div className="guide-section__head">
                  <span className="guide-section__index mono">
                    {String(sectionIndex + 1).padStart(2, '0')}
                  </span>
                  <h2 className="serif" id={`${slugify(section.heading)}-title`}>
                    {section.heading}
                  </h2>
                </div>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.points?.length ? (
                  <ul className="guide-section__points">
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                ) : null}
                {section.terms?.length ? (
                  <p className="guide-section__terms">
                    <span className="label">In the glossary</span>
                    {section.terms.map((termId) => {
                      const term = glossaryTermsFor([termId])[0];
                      return term ? (
                        <Link key={term.id} to={`/glossary#${term.id}`}>
                          {term.term}
                        </Link>
                      ) : null;
                    })}
                  </p>
                ) : null}
              </section>
            ))}
          </div>

          <section className="guide-sources" aria-labelledby="guide-sources-title">
            <div className="guide-sources__head">
              <p className="label">Sources & further reading</p>
              <h2 className="serif" id="guide-sources-title">
                Where to check this guide.
              </h2>
            </div>
            <ol>
              {topic.sources.map((source) => (
                <li key={source.url}>
                  {source.url.startsWith('/') ? (
                    <Link to={source.url}>{source.label}</Link>
                  ) : (
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.label}
                    </a>
                  )}
                  {source.note ? <span>{source.note}</span> : null}
                </li>
              ))}
            </ol>
            <p>
              A source link records where a claim can be checked. It does not imply that every
              sentence in the guide rests on that source, or that the source has been reproduced in
              full.
            </p>
          </section>

          <section className="guide-related" aria-labelledby="guide-related-title">
            <div className="guide-related__head">
              <p className="label">Continue in the archive</p>
              <h2 className="serif" id="guide-related-title">
                Where this idea leads.
              </h2>
            </div>
            <div className="guide-related__links">
              {topic.related.map((link, index) => (
                <GuideLink key={link.to} link={link} index={index} />
              ))}
            </div>
          </section>

          <nav className="guide-pager" aria-label="Field guide pagination">
            {neighbours.previous ? (
              <Link to={`/learn/${neighbours.previous.slug}`} className="guide-pager__link">
                <span className="label">Previous guide</span>
                <span className="serif">{neighbours.previous.title}</span>
              </Link>
            ) : (
              <Link to="/learn" className="guide-pager__link">
                <span className="label">Field guide</span>
                <span className="serif">All guides</span>
              </Link>
            )}
            {neighbours.next ? (
              <Link to={`/learn/${neighbours.next.slug}`} className="guide-pager__link guide-pager__link--next">
                <span className="label">Next guide</span>
                <span className="serif">{neighbours.next.title}</span>
              </Link>
            ) : (
              <Link to="/learn" className="guide-pager__link guide-pager__link--next">
                <span className="label">Return</span>
                <span className="serif">Field guide index</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </article>
  );
}

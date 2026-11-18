import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { DestinationNav } from '../components/layout/DestinationNav';
import { glossaryEntries, glossaryLetters } from '../data/learning';
import { NAV } from '../data/nav';
import { usePageTitle } from '../lib/usePageTitle';
import '../styles/pages.css';
import '../styles/destination.css';
import '../styles/learning.css';

const DESTINATION = NAV.find((item) => item.id === 'explore')!;

export default function GlossaryPage() {
  usePageTitle('Glossary of prehistoric life', {
    description:
      'A linked glossary of the scientific terms used across MESOZO: clades, geological time, fossils, dating, anatomy, reconstruction and evidence.',
  });
  const [query, setQuery] = useState('');
  const linkedDestinationCount = new Set(
    glossaryEntries.flatMap((entry) => entry.related.map((link) => link.to)),
  ).size;

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return glossaryEntries;
    return glossaryEntries.filter((entry) =>
      [entry.term, entry.short, entry.definition, entry.detail ?? ''].join(' ').toLowerCase().includes(term),
    );
  }, [query]);

  const groups = useMemo(() => {
    const entriesByLetter = new Map<string, typeof glossaryEntries>();
    for (const entry of filtered) {
      const letter = entry.term[0].toUpperCase();
      const list = entriesByLetter.get(letter) ?? [];
      list.push(entry);
      entriesByLetter.set(letter, list);
    }
    return Array.from(entriesByLetter.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="page glossary-page">
      <PageHeader
        index="01.4"
        kicker="Explore / Glossary"
        title={
          <>
            The words <em>in the record.</em>
          </>
        }
        intro="Scientific terms are not passwords. Each entry explains what the word means, why it matters and where to see it used in the archive."
        meta={[
          { label: 'Entries', value: String(glossaryEntries.length) },
          { label: 'Begins with', value: String(glossaryLetters.length) },
          { label: 'Linked', value: `${linkedDestinationCount} destinations` },
        ]}
      />

      <DestinationNav destination={DESTINATION} current="/glossary" />

      <section className="glossary-intro shell" aria-labelledby="glossary-intro-title">
        <div>
          <p className="label">How to read a definition</p>
          <h2 className="serif" id="glossary-intro-title">
            A short answer, then the useful context.
          </h2>
        </div>
        <div>
          <p>
            The first line is the working definition used by MESOZO. The longer entry explains the
            distinction that makes the term useful. Related links go to the pages where the concept
            is used with evidence attached.
          </p>
          <p className="glossary-intro__note">
            Definitions are editorial summaries, not quotations from a single authority. The
            scientific literature and institutional sources cited in the field guides are the place
            to check a disputed or technical detail.
          </p>
        </div>
      </section>

      <section className="glossary-tools shell" aria-label="Glossary tools">
        <div className="glossary-search">
          <label htmlFor="glossary-filter">Filter the glossary</label>
          <div>
            <input
              id="glossary-filter"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="clade, fossil, Ma, theropod…"
              autoComplete="off"
              maxLength={120}
            />
            {query ? (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear glossary filter">
                ×
              </button>
            ) : null}
          </div>
          <p aria-live="polite">
            {filtered.length} of {glossaryEntries.length} entries
          </p>
        </div>

        <nav className="glossary-alpha" aria-label="Jump to a letter">
          {glossaryLetters.map((letter) => (
            <a key={letter} href={`#letter-${letter}`}>
              {letter}
            </a>
          ))}
        </nav>
      </section>

      <section className="glossary-list shell" aria-label="Glossary entries">
        {groups.length ? (
          groups.map(([letter, entries]) => (
            <div className="glossary-group" id={`letter-${letter}`} key={letter}>
              <div className="glossary-group__letter" aria-hidden="true">
                {letter}
              </div>
              <div className="glossary-group__entries">
                {entries.map((entry) => (
                  <article className="glossary-entry" id={entry.id} key={entry.id}>
                    <div className="glossary-entry__head">
                      <h2 className="serif">
                        <dfn>{entry.term}</dfn>
                      </h2>
                      <p className="label">{entry.short}</p>
                    </div>
                    <p className="glossary-entry__definition">{entry.definition}</p>
                    {entry.detail ? <p>{entry.detail}</p> : null}
                    <div className="glossary-entry__links">
                      <span className="label">See it in context</span>
                      {entry.related.map((link) => (
                        <Link key={link.to} to={link.to}>
                          {link.label} <span aria-hidden="true">↗</span>
                        </Link>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="glossary-empty" role="status">
            <p className="label">No entry</p>
            <h2 className="serif">No term matches “{query.trim()}”.</h2>
            <p>Try a shorter word, or clear the filter to browse the full glossary.</p>
            <button type="button" className="button-line" onClick={() => setQuery('')}>
              Clear the filter
            </button>
          </div>
        )}
      </section>

      <section className="glossary-foot" data-theme="dark">
        <div className="shell glossary-foot__grid">
          <div>
            <p className="label">From words to evidence</p>
            <h2 className="serif">A definition is a starting point.</h2>
          </div>
          <div className="glossary-foot__links">
            <Link to="/learn">
              <span className="serif">Field guide</span>
              <span className="mono">Read the concept in full ↗</span>
            </Link>
            <Link to="/fossil-evidence">
              <span className="serif">Fossil Evidence</span>
              <span className="mono">See how claims are classified ↗</span>
            </Link>
            <Link to="/about#evidence">
              <span className="serif">Evidence key</span>
              <span className="mono">The archive&apos;s editorial standard ↗</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { JOURNAL_ISSUE, journalArticles, journalFacets } from '../../data/journal';

export function JournalMasthead() {
  const categoryLinks = journalFacets.categories;

  return (
    <header className="jrn-masthead">
      <div className="shell">
        <div className="jrn-masthead__utility">
          <p className="label">MESOZO / Research &amp; Field Notes</p>
          <p className="label">{JOURNAL_ISSUE.label}</p>
          <p className="label">{journalArticles.length} stories</p>
        </div>

        <div className="jrn-masthead__main">
          <div className="jrn-masthead__title-block">
            <p className="label jrn-masthead__kicker">
              Research notes · Deep time · Evidence
            </p>
            <h1 className="jrn-masthead__title serif">
              Research &amp; <em>Field Notes</em>
            </h1>
            <p className="jrn-masthead__statement serif">
              Context for the <em>encyclopedia.</em>
            </p>
          </div>

          <aside className="jrn-masthead__note">
            <p className="lead">{JOURNAL_ISSUE.description}</p>
            <p>
              Written from the same records as the species archive, Deep Time, the anatomical
              atlas and the fossil archive. No story is a separate database.
            </p>
            <p className="mono jrn-masthead__motto">
              Secondary to the database. Grounded in the same evidence.
            </p>
          </aside>
        </div>

        <div className="jrn-masthead__footer">
          <div className="jrn-masthead__issue">
            <span className="label">The collection</span>
            <span className="jrn-masthead__issue-number serif">07</span>
            <span className="jrn-masthead__issue-copy">
              Seven launch notes on fossils, deep time, ancient bodies and the arguments that
              connect them.
            </span>
          </div>

          <nav className="jrn-masthead__categories" aria-label="Research categories">
            {categoryLinks.map((category) => (
              <Link
                key={category.value}
                to={`/journal?category=${category.value}`}
                className="jrn-masthead__category"
                data-cursor="link"
              >
                <span>{category.label}</span>
                <span className="mono">{String(category.count).padStart(2, '0')}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

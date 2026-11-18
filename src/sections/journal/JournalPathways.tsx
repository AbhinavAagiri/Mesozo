import { Link } from 'react-router-dom';
import {
  formatJournalDate,
  journalCategoryById,
  journalPathArticles,
  journalReadingPaths,
} from '../../data/journal';

export function JournalPathways() {
  return (
    <section className="jrn-paths" data-theme="dark" aria-labelledby="jrn-paths-title">
      <div className="shell">
        <header className="jrn-paths__head">
          <div>
            <p className="label">02 — Reading paths</p>
            <h2 className="serif" id="jrn-paths-title">
              Follow a question <em>across stories.</em>
            </h2>
          </div>
          <p>
            A reading path is a curated route through the issue, not an algorithmic recommendation.
            Each step adds a different kind of evidence.
          </p>
        </header>

        <div className="jrn-paths__grid">
          {journalReadingPaths.map((path, pathIndex) => {
            const articles = journalPathArticles(path);
            return (
              <article className="jrn-path" key={path.id}>
                <div className="jrn-path__top">
                  <span className="mono">Path {String(pathIndex + 1).padStart(2, '0')}</span>
                  <span className="label">{articles.length} stories</span>
                </div>
                <h3 className="serif">{path.title}</h3>
                <p className="jrn-path__description">{path.description}</p>

                <ol className="jrn-path__steps">
                  {path.steps.map((step, index) => {
                    const article = articles[index];
                    if (!article) return null;
                    const category = journalCategoryById.get(article.category);
                    return (
                      <li key={step.articleId}>
                        <span className="jrn-path__step-number mono">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <Link to={`/journal/${article.slug}`} className="jrn-path__step-title">
                            {article.headline}
                          </Link>
                          <p>{step.label}</p>
                          <p className="jrn-path__step-meta mono">
                            {category?.label} · {article.readingMinutes} min ·{' '}
                            {formatJournalDate(article.publishedAt)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

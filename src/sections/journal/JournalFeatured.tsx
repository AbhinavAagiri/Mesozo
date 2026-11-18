import { Link } from 'react-router-dom';
import { JournalFigure } from '../../components/journal/JournalFigure';
import {
  featuredJournalArticle,
  formatJournalDate,
  journalCategoryById,
} from '../../data/journal';

export function JournalFeatured() {
  const article = featuredJournalArticle;
  if (!article) return null;

  const category = journalCategoryById.get(article.category);
  const hero = article.hero;

  return (
    <section className="jrn-feature" data-theme="dark" aria-labelledby="jrn-feature-title">
      <div className="shell jrn-feature__grid">
        <div className="jrn-feature__copy">
          <div className="jrn-feature__kicker">
            <span className="label">Cover story</span>
            <span className="label">No. {String(article.number).padStart(2, '0')}</span>
          </div>

          <p className="jrn-feature__category">
            <Link to={`/journal?category=${article.category}`}>{category?.label}</Link>
            <span aria-hidden="true"> / </span>
            <span>{article.readingMinutes} min read</span>
          </p>

          <h2 className="jrn-feature__title serif" id="jrn-feature-title">
            <Link to={`/journal/${article.slug}`}>{article.headline}</Link>
          </h2>

          <p className="jrn-feature__standfirst">{article.standfirst}</p>

          <div className="jrn-feature__meta">
            <span>{article.byline}</span>
            <span>{formatJournalDate(article.publishedAt)}</span>
            <span className="mono">Filed in {category?.kicker}</span>
          </div>

          <Link className="jrn-cta" to={`/journal/${article.slug}`} data-cursor="link">
            <span>Read the cover story</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="jrn-feature__visual">
          <JournalFigure
            assetId={hero.assetId ?? ''}
            alt={hero.alt ?? ''}
            caption={hero.caption}
            label={hero.label}
            fit={hero.fit ?? 'contain'}
            position={hero.position}
            sizes="(max-width: 900px) 92vw, 52vw"
            priority
            className="jrn-feature__figure"
          />
          <p className="jrn-feature__fineprint mono">
            Cover image: licensed reconstruction, not a fossil photograph. Credits accompany the
            figure and the story.
          </p>
        </div>
      </div>
    </section>
  );
}

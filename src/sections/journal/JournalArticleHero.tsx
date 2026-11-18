import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { JournalDiagram } from '../../components/journal/JournalDiagram';
import { JournalFigure } from '../../components/journal/JournalFigure';
import { formatJournalDate, journalCategoryById } from '../../data/journal';
import type { JournalArticle } from '../../data/journal/types';

type Props = {
  article: JournalArticle;
};

export function JournalArticleHero({ article }: Props) {
  const category = journalCategoryById.get(article.category);
  const hero = article.hero;
  const dark = hero.tone === 'dark';

  return (
    <header
      className={`jrn-hero jrn-hero--${hero.variant} jrn-hero--${hero.tone}`}
      data-theme={dark ? 'dark' : undefined}
    >
      <div className="shell">
        <div className="jrn-hero__top">
          <Breadcrumbs
            tone={dark ? 'dark' : 'light'}
            items={[
              { label: 'Home', to: '/' },
              { label: 'Research', to: '/journal' },
              { label: `No. ${String(article.number).padStart(2, '0')}` },
            ]}
          />
          <p className="label">Research note / 2026 · No. {String(article.number).padStart(2, '0')}</p>
        </div>

        <div className="jrn-hero__grid">
          <div className="jrn-hero__copy">
            <p className="jrn-hero__category">
              <Link to={`/journal?category=${article.category}`}>{category?.label}</Link>
              <span aria-hidden="true"> / </span>
              <span>{category?.kicker}</span>
            </p>

            <h1 className="jrn-hero__title serif">{article.headline}</h1>
            {article.subtitle ? (
              <p className="jrn-hero__subtitle serif">{article.subtitle}</p>
            ) : null}
            <p className="jrn-hero__standfirst">{article.standfirst}</p>

            <dl className="jrn-hero__meta">
              <div>
                <dt className="label">By</dt>
                <dd>{article.byline}</dd>
              </div>
              <div>
                <dt className="label">Published</dt>
                <dd>{formatJournalDate(article.publishedAt)}</dd>
              </div>
              {article.updatedAt && article.updatedAt !== article.publishedAt ? (
                <div>
                  <dt className="label">Updated</dt>
                  <dd>{formatJournalDate(article.updatedAt)}</dd>
                </div>
              ) : null}
              <div>
                <dt className="label">Reading time</dt>
                <dd>{article.readingMinutes} min</dd>
              </div>
            </dl>
          </div>

          <div className="jrn-hero__visual">
            {hero.assetId ? (
              <JournalFigure
                assetId={hero.assetId}
                alt={hero.alt ?? ''}
                caption={hero.caption}
                label={hero.label}
                fit={hero.fit ?? 'cover'}
                position={hero.position}
                sizes={
                  hero.variant === 'plate'
                    ? '(max-width: 900px) 100vw, 82vw'
                    : '(max-width: 900px) 100vw, 53vw'
                }
                priority
                className={`jrn-hero__figure jrn-hero__figure--${hero.variant}`}
              />
            ) : hero.variant === 'map' ? (
              <div className="jrn-hero__map">
                <JournalDiagram variant="world-regions" title={hero.label} />
                <p className="jrn-hero__visual-note">{hero.caption}</p>
              </div>
            ) : (
              <div className="jrn-hero__type-visual">
                <span
                  className="jrn-hero__type-number serif"
                  data-number={String(article.number).padStart(2, '0')}
                  aria-hidden="true"
                />
                <span className="jrn-hero__type-label mono">{hero.label}</span>
                <span className="jrn-hero__type-rule" />
                <span className="jrn-hero__type-rule jrn-hero__type-rule--short" />
                <span className="jrn-hero__type-caption">{hero.caption}</span>
              </div>
            )}
          </div>
        </div>

        {article.editorialCredit ? (
          <p className="jrn-hero__credit mono">{article.editorialCredit}</p>
        ) : null}
      </div>
    </header>
  );
}

import { Link } from 'react-router-dom';
import { AssetImage } from '../../components/ui/AssetImage';
import {
  activeJournalFilterCount,
  formatJournalDate,
  journalArticles,
  journalCategoryById,
  journalCategoryLabel,
  journalFacets,
} from '../../data/journal';
import type { JournalArticle, JournalFilters } from '../../data/journal/types';

type Props = {
  filters: JournalFilters;
  results: JournalArticle[];
  onChange: (patch: Partial<JournalFilters>) => void;
  onClear: () => void;
};

function StoryRow({ article, lead }: { article: JournalArticle; lead: boolean }) {
  const category = journalCategoryById.get(article.category);
  const hero = article.hero;

  return (
    <Link
      className={`jrn-index__row${lead ? ' is-lead' : ''}`}
      to={`/journal/${article.slug}`}
      data-cursor="link"
    >
      <span className="jrn-index__number mono">
        {String(article.number).padStart(2, '0')}
      </span>

      <div className="jrn-index__copy">
        <div className="jrn-index__topline">
          <span className="jrn-index__category">{category?.label}</span>
          {article.featured ? <span className="label">Cover story</span> : null}
          <span className="label">{article.readingMinutes} min</span>
        </div>
        <h3 className="jrn-index__headline serif">{article.headline}</h3>
        <p className="jrn-index__standfirst">{article.standfirst}</p>
        <div className="jrn-index__meta">
          <span>{formatJournalDate(article.publishedAt)}</span>
          <span>{article.byline}</span>
          <span>{article.tags.slice(0, 2).join(' · ')}</span>
        </div>
      </div>

      <div className={`jrn-index__media${hero.assetId ? '' : ' jrn-index__media--type'}`}>
        {hero.assetId ? (
          <AssetImage
            id={hero.assetId}
            alt={hero.alt ?? ''}
            sizes={lead ? '(max-width: 900px) 100vw, 34vw' : '(max-width: 900px) 100vw, 18vw'}
            fit={lead ? (hero.fit ?? 'cover') : 'cover'}
            position={hero.position}
          />
        ) : (
          <span className="jrn-index__media-mark serif">{category?.kicker}</span>
        )}
      </div>
    </Link>
  );
}

export function JournalIndex({ filters, results, onChange, onClear }: Props) {
  const activeCount = activeJournalFilterCount(filters);
  const allCount = journalArticles.length;
  const categoryCounts = new Map(journalFacets.categories.map((item) => [item.value, item.count]));

  return (
    <section className="jrn-index" id="journal-index" aria-labelledby="jrn-index-title">
      <div className="shell">
        <header className="jrn-index__head">
          <div>
            <p className="label">01 — The index</p>
            <h2 className="serif" id="jrn-index-title">
              Read the <em>notes.</em>
            </h2>
          </div>
          <p className="jrn-index__intro">
            Seven launch notes, each built from the same linked records as the encyclopedia. Filter
            by subject, organism, period or publication month.
          </p>
        </header>

        <div className="jrn-index__tools">
          <label className="jrn-index__search">
            <span className="label">Search the notes</span>
            <input
              type="search"
              value={filters.query}
              onChange={(event) => onChange({ query: event.target.value })}
              placeholder="Species, place, idea…"
              maxLength={120}
            />
          </label>

          <label className="jrn-index__select">
            <span className="label">Subject</span>
            <select
              value={filters.tag}
              onChange={(event) => onChange({ tag: event.target.value })}
            >
              <option value="all">Any subject</option>
              {journalFacets.tags.map((tag) => (
                <option value={tag.value} key={tag.value}>
                  {tag.label} ({tag.count})
                </option>
              ))}
            </select>
          </label>

          <label className="jrn-index__select">
            <span className="label">Species</span>
            <select
              value={filters.species}
              onChange={(event) => onChange({ species: event.target.value })}
            >
              <option value="all">Any species</option>
              {journalFacets.species.map((species) => (
                <option value={species.value} key={species.value}>
                  {species.label}
                </option>
              ))}
            </select>
          </label>

          <label className="jrn-index__select">
            <span className="label">Period</span>
            <select
              value={filters.period}
              onChange={(event) => onChange({ period: event.target.value })}
            >
              <option value="all">Any period</option>
              {journalFacets.periods.map((period) => (
                <option value={period.value} key={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </label>

          <label className="jrn-index__select">
            <span className="label">Published</span>
            <select
              value={filters.date}
              onChange={(event) => onChange({ date: event.target.value })}
            >
              <option value="all">Any month</option>
              {journalFacets.dates.map((date) => (
                <option value={date.value} key={date.value}>
                  {date.label} ({date.count})
                </option>
              ))}
            </select>
          </label>

          <label className="jrn-index__select jrn-index__select--sort">
            <span className="label">Order</span>
            <select
              value={filters.sort}
              onChange={(event) =>
                onChange({ sort: event.target.value as JournalFilters['sort'] })
              }
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>

                  <div className="jrn-index__cats" role="group" aria-label="Filter by research category">
          <button
            type="button"
            className={`jrn-index__cat${filters.category === 'all' ? ' is-active' : ''}`}
            aria-pressed={filters.category === 'all'}
            onClick={() => onChange({ category: 'all' })}
          >
            <span>All notes</span>
            <span className="mono">{allCount}</span>
          </button>
          {journalFacets.categories.map((category) => (
            <button
              type="button"
              className={`jrn-index__cat${filters.category === category.value ? ' is-active' : ''}`}
              aria-pressed={filters.category === category.value}
              onClick={() =>
                onChange({ category: category.value as JournalFilters['category'] })
              }
              key={category.value}
            >
              <span>{category.label}</span>
              <span className="mono">{categoryCounts.get(category.value) ?? category.count}</span>
            </button>
          ))}
        </div>

        <div className="jrn-index__status">
          <p className="mono" aria-live="polite">
            {results.length} {results.length === 1 ? 'note' : 'notes'}
            {activeCount ? ` · ${activeCount} active ${activeCount === 1 ? 'filter' : 'filters'}` : ''}
          </p>
          {activeCount && results.length ? (
            <button type="button" className="jrn-index__clear" onClick={onClear}>
              Clear all filters <span aria-hidden="true">×</span>
            </button>
          ) : (
            <p className="mono jrn-index__sort-note">
              {journalCategoryLabel(filters.category)} · {filters.sort === 'newest' ? 'newest first' : 'oldest first'}
            </p>
          )}
        </div>

        {results.length ? (
          <div className="jrn-index__list">
            {results.map((article, index) => (
              <StoryRow article={article} lead={index === 0} key={article.id} />
            ))}
          </div>
        ) : (
          <div className="jrn-index__empty">
            <p className="label">No records</p>
            <h3 className="serif">No notes match this combination.</h3>
            <p>
              Try a broader subject, a different period or a species that appears in more than one
              story.
            </p>
            <button type="button" className="jrn-cta jrn-cta--light" onClick={onClear}>
              <span>Reset the index</span>
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

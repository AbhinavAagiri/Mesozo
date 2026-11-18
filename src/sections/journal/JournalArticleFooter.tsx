import { Link } from 'react-router-dom';
import { assetById } from '../../data';
import {
  formatJournalDate,
  journalAssetIds,
  journalCategoryById,
  journalNeighbours,
  journalPathArticles,
  journalPathForArticle,
  journalRelatedFor,
  journalSections,
} from '../../data/journal';
import type { JournalArticle } from '../../data/journal/types';
import { JournalEntityCard } from '../../components/journal/JournalEntity';
import { JournalFigure } from '../../components/journal/JournalFigure';
import { ReferenceList } from '../../components/ui/Sources';

type Props = {
  article: JournalArticle;
};

export function JournalArticleFooter({ article }: Props) {
  const related = journalRelatedFor(article, 3);
  const neighbours = journalNeighbours(article);
  const path = journalPathForArticle(article);
  const pathArticles = path ? journalPathArticles(path) : [];
  const creditAssets = journalAssetIds(article)
    .map((id) => assetById.get(id))
    .filter((asset): asset is NonNullable<typeof asset> => Boolean(asset));
  const category = journalCategoryById.get(article.category);
  const sectionCount = journalSections(article).length;
  const sequence = (offset: number) => String(sectionCount + offset).padStart(2, '0');

  return (
    <footer className="jrn-article-footer">
      <section className="jrn-connections" id="connections" data-theme="dark" aria-labelledby="jrn-connections-title">
        <div className="shell">
          <header className="jrn-connections__head">
            <div>
              <p className="label">{sequence(1)} — Continue exploring</p>
              <h2 className="serif" id="jrn-connections-title">
                Leave the page with a <em>record.</em>
              </h2>
            </div>
            <p>
              These are not related links added for decoration. They are the species, periods,
              specimens and anatomical structures named in the story.
            </p>
          </header>

          {article.relatedSpeciesIds.length ? (
            <div className="jrn-connections__group">
              <p className="label">Species</p>
              <div className="jrn-connections__grid">
                {article.relatedSpeciesIds.map((speciesId) => (
                  <JournalEntityCard kind="species" speciesId={speciesId} key={speciesId} />
                ))}
              </div>
            </div>
          ) : null}

          {article.relatedSpecimenIds.length ? (
            <div className="jrn-connections__group">
              <p className="label">Fossil records</p>
              <div className="jrn-connections__grid">
                {article.relatedSpecimenIds.map((specimenId) => (
                  <JournalEntityCard kind="specimen" specimenId={specimenId} key={specimenId} />
                ))}
              </div>
            </div>
          ) : null}

          {article.relatedPeriodIds.length ? (
            <div className="jrn-connections__group">
              <p className="label">Deep time</p>
              <div className="jrn-connections__grid jrn-connections__grid--periods">
                {article.relatedPeriodIds.map((periodId) => (
                  <JournalEntityCard kind="period" unitId={periodId} key={periodId} />
                ))}
              </div>
            </div>
          ) : null}

          {article.relatedAnatomy.length ? (
            <div className="jrn-connections__group">
              <p className="label">Anatomy</p>
              <div className="jrn-connections__grid">
                {article.relatedAnatomy.flatMap((link) =>
                  link.structureIds.map((structureId) => (
                    <JournalEntityCard
                      kind="anatomy"
                      speciesId={link.speciesId}
                      structureId={structureId}
                      key={`${link.speciesId}-${structureId}`}
                    />
                  )),
                )}
              </div>
            </div>
          ) : null}

          <Link className="jrn-connections__archive-link" to={category ? `/journal?category=${category.id}` : '/journal'}>
            More from {category?.label ?? 'Research & Field Notes'} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="jrn-article-sources" id="sources" aria-labelledby="jrn-sources-title">
        <div className="shell">
          <header className="jrn-article-sources__head">
            <div>
              <p className="label">{sequence(2)} — Sources & credits</p>
              <h2 className="serif" id="jrn-sources-title">
                The notes behind <em>the story.</em>
              </h2>
            </div>
            <p>
              Every substantive claim is tied to a publication or institutional record in the
              MESOZO reference registry. Image credits are generated from the asset licence
              registry.
            </p>
          </header>

          <div className="jrn-article-sources__grid">
            <div>
              <div className="jrn-article-sources__label">
                <p className="label">References</p>
                <p className="mono">{article.references.length} cited works</p>
              </div>
              <ReferenceList ids={article.references} />
            </div>

            <aside>
              <p className="label">Image credits</p>
              <ul className="jrn-credit-list">
                {creditAssets.map((asset) => (
                  <li key={asset.id}>
                    <p className="jrn-credit-list__title">{asset.title}</p>
                    <p className="jrn-credit-list__meta">
                      {asset.creator} · {asset.license}
                    </p>
                    <a href={asset.sourceUrl} target="_blank" rel="noreferrer" className="mono">
                      Source &amp; licence ↗
                    </a>
                  </li>
                ))}
              </ul>

              <p className="jrn-article-sources__method">
                Published {formatJournalDate(article.publishedAt)}
                {article.updatedAt && article.updatedAt !== article.publishedAt
                  ? ` · updated ${formatJournalDate(article.updatedAt)}`
                  : ''}
                . {article.editorialCredit}
              </p>
              <p className="jrn-article-sources__method">
                MESOZO does not generate prehistoric imagery. Every photograph, drawing,
                reconstruction, cast and diagram is registered with its creator, source and licence.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="jrn-related" aria-labelledby="jrn-related-title">
          <div className="shell">
            <header className="jrn-related__head">
              <div>
                <p className="label">{sequence(3)} — Related reading</p>
                <h2 className="serif" id="jrn-related-title">
                  Continue with <em>another question.</em>
                </h2>
              </div>
              <Link to="/journal" className="text-link">
                All notes <span aria-hidden="true">↗</span>
              </Link>
            </header>

            <div className="jrn-related__list">
              {related.map((entry) => {
                const entryCategory = journalCategoryById.get(entry.article.category);
                return (
                  <Link
                    className="jrn-related__row"
                    to={`/journal/${entry.article.slug}`}
                    key={entry.article.id}
                    data-cursor="link"
                  >
                    <span className="jrn-related__number mono">
                      {String(entry.article.number).padStart(2, '0')}
                    </span>
                    <span className="jrn-related__copy">
                      <span className="label">
                        {entryCategory?.label} · {entry.article.readingMinutes} min
                      </span>
                      <span className="jrn-related__title serif">{entry.article.headline}</span>
                      <span className="jrn-related__reason">{entry.reason}</span>
                    </span>
                    {entry.article.hero.assetId ? (
                      <JournalFigure
                        assetId={entry.article.hero.assetId}
                        alt={entry.article.hero.alt ?? ''}
                        caption={entry.article.hero.caption}
                        showCredit={false}
                        sizes="(max-width: 760px) 36vw, 160px"
                        className="jrn-related__thumb"
                      />
                    ) : (
                      <span className="jrn-related__thumb jrn-related__thumb--type serif" aria-hidden="true">
                        {entryCategory?.kicker}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {path ? (
        <section className="jrn-reading-path" aria-labelledby="jrn-reading-path-title">
          <div className="shell">
            <div className="jrn-reading-path__head">
              <p className="label">Reading path</p>
              <h2 className="serif" id="jrn-reading-path-title">
                {path.title}
              </h2>
              <p>{path.description}</p>
            </div>
            <ol className="jrn-reading-path__steps">
              {path.steps.map((step, index) => {
                const stepArticle = pathArticles[index];
                if (!stepArticle) return null;
                const current = stepArticle.id === article.id;
                return (
                  <li className={current ? 'is-current' : undefined} key={step.articleId}>
                    <span className="mono">{String(index + 1).padStart(2, '0')}</span>
                    <Link to={`/journal/${stepArticle.slug}`}>
                      <span className="label">{current ? 'You are here' : step.label}</span>
                      <span className="serif">{stepArticle.headline}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      ) : null}

      <nav className="jrn-pager" aria-label="Article navigation">
        <div className="shell jrn-pager__grid">
          {neighbours.previous ? (
            <Link className="jrn-pager__link" to={`/journal/${neighbours.previous.slug}`}>
              <span className="label">Previous story</span>
              <span className="serif">{neighbours.previous.headline}</span>
            </Link>
          ) : (
            <span />
          )}
          <Link className="jrn-pager__index" to="/journal">
            <span className="label">Research &amp; Field Notes</span>
            <span className="serif">Back to the index</span>
          </Link>
          {neighbours.next ? (
            <Link className="jrn-pager__link jrn-pager__link--next" to={`/journal/${neighbours.next.slug}`}>
              <span className="label">Next story</span>
              <span className="serif">{neighbours.next.headline}</span>
            </Link>
          ) : (
            <span />
          )}
        </div>
      </nav>
    </footer>
  );
}

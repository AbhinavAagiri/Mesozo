import { Link } from 'react-router-dom';
import { AssetImage } from '../../components/ui/AssetImage';
import { journalCategoryById } from '../../data/journal';
import type { JournalArticle } from '../../data/journal/types';
import { SpeciesSectionHead } from './SpeciesSectionHead';

type Props = {
  stories: JournalArticle[];
  index?: string;
};

/** Reverse integration: research notes that name this species. */
export function SpeciesJournal({ stories, index = '07' }: Props) {
  if (!stories.length) return null;

  return (
    <section id="journal" className="spx-section spx-journal">
      <div className="shell">
        <SpeciesSectionHead
          index={index}
          title="Research & field notes"
          intro="Notes that connect this dossier to the wider fossil record, the arguments around it and the worlds it inhabited."
        />

        <div className="spx-journal__grid">
          {stories.map((article) => {
            const category = journalCategoryById.get(article.category);
            return (
              <Link
                className="spx-journal__card"
                to={`/journal/${article.slug}`}
                key={article.id}
                data-cursor="link"
              >
                <div className="spx-journal__media">
                  {article.hero.assetId ? (
                    <AssetImage
                      id={article.hero.assetId}
                      alt={article.hero.alt ?? ''}
                      sizes="(max-width: 900px) 94vw, 30vw"
                      fit="contain"
                    />
                  ) : (
                    <span className="spx-journal__media-type serif">{category?.kicker}</span>
                  )}
                </div>
                <div className="spx-journal__body">
                  <p className="label">
                    {category?.label} · {article.readingMinutes} min
                  </p>
                  <h3 className="serif">{article.headline}</h3>
                  <p>{article.standfirst}</p>
                  <span className="spx-journal__open mono">Read the note ↗</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

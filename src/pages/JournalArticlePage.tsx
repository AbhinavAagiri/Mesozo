import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  formatJournalDate,
  getJournalArticle,
  journalCategoryById,
  journalSections,
} from '../data/journal';
import { usePageTitle } from '../lib/usePageTitle';
import { JournalArticleBody } from '../sections/journal/JournalArticleBody';
import { JournalArticleFooter } from '../sections/journal/JournalArticleFooter';
import { JournalArticleHero } from '../sections/journal/JournalArticleHero';
import { JournalToc } from '../sections/journal/JournalToc';
import '../styles/pages.css';
import '../styles/journal.css';

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="jrn-progress" aria-hidden="true">
      <span style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}

export default function JournalArticlePage() {
  const { slug } = useParams();
  const article = getJournalArticle(slug);
  const category = article ? journalCategoryById.get(article.category) : undefined;
  const heroAssetId = article?.hero.assetId;
  const imagePath = heroAssetId
    ? `/assets/social/${heroAssetId}.jpg`
    : '/og-mesozo.jpg';
  const pageUrl = `${window.location.origin}${window.location.pathname}`;
  usePageTitle(article ? article.headline : 'Story not found', {
    description: article
      ? article.standfirst
      : 'This research note is not in the MESOZO archive.',
    image: imagePath,
    imageAlt: article?.hero.alt ?? article?.hero.caption,
    type: 'article',
    noindex: !article,
    breadcrumbs: article
      ? [
          { name: 'Home', path: '/' },
          { name: 'Research', path: '/journal' },
          {
            name: `No. ${String(article.number).padStart(2, '0')}`,
            path: `/journal/${article.slug}`,
          },
        ]
      : undefined,
    structuredData: article
      ? {
          '@type': 'Article',
          headline: article.headline,
          description: article.standfirst,
          image: `${window.location.origin}${imagePath}`,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt ?? article.publishedAt,
          articleSection: category?.label,
          author: { '@type': 'Organization', name: article.byline },
          publisher: { '@type': 'Organization', name: 'MESOZO' },
          mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
        }
      : undefined,
  });

  if (!article) {
    return (
      <div className="page notfound shell">
        <p className="label">404 — Not in Research &amp; Field Notes</p>
        <h1 className="serif">This story does not exist.</h1>
        <Link className="text-link" to="/journal">
          Back to the notes <span aria-hidden="true">↗</span>
        </Link>
      </div>
    );
  }

  const sections = journalSections(article);

  return (
    <article className="page jrn-article-page">
      <ReadingProgress />
      <JournalArticleHero article={article} />

      <div className="shell jrn-article__layout">
        <JournalToc sections={sections} />

        <div className="jrn-article__main">
          <div className="jrn-article__byline">
            <span className="label">Filed under</span>
            <Link to={`/journal?category=${article.category}`}>{category?.label}</Link>
            <span className="mono">{formatJournalDate(article.publishedAt)}</span>
          </div>

          <JournalArticleBody article={article} sections={sections} />
        </div>
      </div>

      <JournalArticleFooter article={article} />
    </article>
  );
}

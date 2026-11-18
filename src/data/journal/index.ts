import categoryData from './categories.json';
import pathData from './reading-paths.json';
import type {
  JournalArticle,
  JournalBlock,
  JournalCategory,
  JournalCategoryId,
  JournalFacet,
  JournalFilters,
  JournalReadingPath,
} from './types';
import { discoverySpecimenById, getGeoUnit, getSpecies, referenceById } from '../index';

const articleModules = import.meta.glob<JournalArticle>('./articles/*.json', {
  eager: true,
  import: 'default',
});

export const JOURNAL_ISSUE = {
  label: 'Field notes / 2026',
  title: 'MESOZO Research & Field Notes',
  statement: 'Notes from the record.',
  description:
    'Scientific explainers, reconstruction histories and field notes that follow the species, specimens and periods back into the encyclopedia.',
};

export const journalCategories = categoryData as JournalCategory[];
export const journalCategoryById = new Map(
  journalCategories.map((category) => [category.id, category]),
);

export const journalReadingPaths = pathData as JournalReadingPath[];

const allArticles = Object.values(articleModules) as JournalArticle[];
export const journalArticles: JournalArticle[] = allArticles
  .filter((article) => !article.draft)
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.number - b.number);

export const journalArticleBySlug = new Map(
  journalArticles.map((article) => [article.slug, article]),
);
export const journalArticleById = new Map(
  journalArticles.map((article) => [article.id, article]),
);

export const featuredJournalArticle =
  journalArticles.find((article) => article.featured) ?? journalArticles[0];

export function getJournalArticle(slug: string | undefined): JournalArticle | undefined {
  return slug ? journalArticleBySlug.get(slug) : undefined;
}

export function getJournalArticleById(id: string | undefined): JournalArticle | undefined {
  return id ? journalArticleById.get(id) : undefined;
}

const longDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const monthDate = new Intl.DateTimeFormat('en-GB', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

function asUtcDate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export function formatJournalDate(iso: string): string {
  return longDate.format(asUtcDate(iso));
}

export function journalMonthLabel(value: string): string {
  return monthDate.format(asUtcDate(`${value}-01`));
}

export function journalMonth(article: JournalArticle): string {
  return article.publishedAt.slice(0, 7);
}

export function journalCategoryLabel(id: JournalCategoryId | 'all'): string {
  return id === 'all' ? 'All notes' : (journalCategoryById.get(id)?.label ?? id);
}

export interface JournalSection {
  id: string;
  title: string;
  kicker?: string;
  number: string;
}

export function journalSections(article: JournalArticle): JournalSection[] {
  return article.blocks
    .filter((block): block is Extract<JournalBlock, { type: 'heading' }> => block.type === 'heading')
    .map((block, index) => ({
      id: block.id,
      title: block.title,
      kicker: block.kicker,
      number: String(index + 1).padStart(2, '0'),
    }));
}

export function journalAssetIds(article: JournalArticle): string[] {
  const ids = new Set<string>();
  if (article.hero.assetId) ids.add(article.hero.assetId);

  for (const block of article.blocks) {
    if (block.type === 'image') ids.add(block.assetId);
    if (block.type === 'duo' || block.type === 'gallery') {
      for (const image of block.images) ids.add(image.assetId);
    }
  }

  return Array.from(ids);
}

function blockText(block: JournalBlock): string {
  const values: string[] = [];

  const collect = (value: unknown) => {
    if (typeof value === 'string') {
      values.push(value);
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) collect(item);
      return;
    }
    if (value && typeof value === 'object') {
      for (const [key, item] of Object.entries(value)) {
        if (key === 'assetId' || key === 'id' || key === 'variant') continue;
        collect(item);
      }
    }
  };

  collect(block);
  return values.join(' ');
}

function articleSearchText(article: JournalArticle): string {
  const category = journalCategoryById.get(article.category);
  const speciesText = article.relatedSpeciesIds
    .map((id) => getSpecies(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .flatMap((item) => [item.scientificName, item.commonName]);
  const periodText = article.relatedPeriodIds
    .map((id) => getGeoUnit(id)?.name ?? '')
    .filter(Boolean);
  const specimenText = article.relatedSpecimenIds.flatMap((id) => {
    const specimen = discoverySpecimenById.get(id);
    return specimen ? [specimen.identifier, specimen.repository, specimen.material] : [];
  });
  const referenceText = article.references.flatMap((id) => {
    const ref = referenceById.get(id);
    return ref ? [ref.title, ref.authors, String(ref.year), ref.journal ?? ''] : [];
  });

  return [
    article.headline,
    article.subtitle ?? '',
    article.standfirst,
    article.byline,
    article.editorialCredit ?? '',
    category?.label ?? '',
    category?.description ?? '',
    ...article.tags,
    ...speciesText,
    ...periodText,
    ...specimenText,
    ...referenceText,
    ...article.blocks.map(blockText),
  ]
    .join(' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

const searchIndex = new Map(
  journalArticles.map((article) => [article.id, articleSearchText(article)]),
);

export const defaultJournalFilters: JournalFilters = {
  query: '',
  category: 'all',
  tag: 'all',
  species: 'all',
  period: 'all',
  date: 'all',
  sort: 'newest',
};

export function filterJournalArticles(filters: JournalFilters): JournalArticle[] {
  const terms = filters.query
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const filtered = journalArticles.filter((article) => {
    if (filters.category !== 'all' && article.category !== filters.category) return false;
    if (filters.tag !== 'all' && !article.tags.includes(filters.tag)) return false;
    if (filters.species !== 'all' && !article.relatedSpeciesIds.includes(filters.species)) {
      return false;
    }
    if (filters.period !== 'all' && !article.relatedPeriodIds.includes(filters.period)) {
      return false;
    }
    if (filters.date !== 'all' && journalMonth(article) !== filters.date) return false;
    if (!terms.length) return true;

    const haystack = searchIndex.get(article.id) ?? articleSearchText(article);
    return terms.every((term) => haystack.includes(term));
  });

  return filtered.sort((a, b) => {
    const dateOrder = b.publishedAt.localeCompare(a.publishedAt) || a.number - b.number;
    return filters.sort === 'oldest' ? -dateOrder : dateOrder;
  });
}

export function activeJournalFilterCount(filters: JournalFilters): number {
  let count = 0;
  if (filters.query.trim()) count += 1;
  if (filters.category !== 'all') count += 1;
  if (filters.tag !== 'all') count += 1;
  if (filters.species !== 'all') count += 1;
  if (filters.period !== 'all') count += 1;
  if (filters.date !== 'all') count += 1;
  return count;
}

function countFacet(values: string[]): JournalFacet[] {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return Array.from(counts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([value, count]) => ({ value, label: value, count }));
}

const speciesFacetValues = Array.from(
  new Set(journalArticles.flatMap((article) => article.relatedSpeciesIds)),
)
  .map((id) => {
    const species = getSpecies(id);
    if (!species) return null;
    return {
      value: id,
      label: `${species.commonName} · ${species.scientificName}`,
      count: journalArticles.filter((article) => article.relatedSpeciesIds.includes(id)).length,
    };
  })
  .filter((item): item is JournalFacet => Boolean(item))
  .sort((a, b) => a.label.localeCompare(b.label));

const periodFacetValues = Array.from(
  new Set(journalArticles.flatMap((article) => article.relatedPeriodIds)),
)
  .map((id) => {
    const unit = getGeoUnit(id);
    if (!unit) return null;
    return {
      value: id,
      label: unit.name,
      count: journalArticles.filter((article) => article.relatedPeriodIds.includes(id)).length,
    };
  })
  .filter((item): item is JournalFacet => Boolean(item))
  .sort((a, b) => a.label.localeCompare(b.label));

const dateFacetValues = Array.from(
  new Set(journalArticles.map((article) => journalMonth(article))),
)
  .sort()
  .reverse()
  .map((value) => ({
    value,
    label: journalMonthLabel(value),
    count: journalArticles.filter((article) => journalMonth(article) === value).length,
  }));

export const journalFacets = {
  categories: journalCategories
    .map((category) => ({
      value: category.id,
      label: category.label,
      count: journalArticles.filter((article) => article.category === category.id).length,
    }))
    .filter((facet) => facet.count > 0),
  tags: countFacet(journalArticles.flatMap((article) => article.tags)),
  species: speciesFacetValues,
  periods: periodFacetValues,
  dates: dateFacetValues,
};

export function journalStoriesForSpecies(speciesId: string): JournalArticle[] {
  return journalArticles.filter((article) => article.relatedSpeciesIds.includes(speciesId));
}

export function journalStoriesForPeriod(periodId: string): JournalArticle[] {
  return journalArticles.filter((article) => article.relatedPeriodIds.includes(periodId));
}

export interface JournalRelatedEntry {
  article: JournalArticle;
  reason: string;
}

/**
 * Curated article relationships come first. The fallback only uses meaningful
 * shared records: a species, a tag or, last, the same editorial category.
 */
export function journalRelatedFor(article: JournalArticle, limit = 3): JournalRelatedEntry[] {
  const entries: JournalRelatedEntry[] = [];
  const seen = new Set<string>([article.id]);

  for (const id of article.relatedArticleIds) {
    const related = journalArticleById.get(id);
    if (!related || seen.has(related.id)) continue;
    seen.add(related.id);

    const sharedSpecies = related.relatedSpeciesIds
      .filter((speciesId) => article.relatedSpeciesIds.includes(speciesId))
      .map((speciesId) => getSpecies(speciesId)?.commonName)
      .filter((label): label is string => Boolean(label));
    const sharedTags = related.tags.filter((tag) => article.tags.includes(tag));

    entries.push({
      article: related,
      reason: sharedSpecies.length
        ? `Both stories connect to ${sharedSpecies.slice(0, 2).join(' and ')}.`
        : sharedTags.length
          ? `Shared subject: ${sharedTags.slice(0, 2).join(' · ')}.`
          : 'Related reading selected by the editorial desk.',
    });
  }

  if (entries.length < limit) {
    const scored = journalArticles
      .filter((candidate) => !seen.has(candidate.id))
      .map((candidate) => {
        const sharedSpecies = candidate.relatedSpeciesIds.filter((id) =>
          article.relatedSpeciesIds.includes(id),
        ).length;
        const sharedTags = candidate.tags.filter((tag) => article.tags.includes(tag)).length;
        const sameCategory = candidate.category === article.category ? 1 : 0;
        return { candidate, score: sharedSpecies * 3 + sharedTags * 2 + sameCategory };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.candidate.number - b.candidate.number);

    for (const { candidate } of scored) {
      if (entries.length >= limit) break;
      if (seen.has(candidate.id)) continue;
      seen.add(candidate.id);
      const sharedSpecies = candidate.relatedSpeciesIds
        .filter((id) => article.relatedSpeciesIds.includes(id))
        .map((id) => getSpecies(id)?.commonName)
        .filter((label): label is string => Boolean(label));
      entries.push({
        article: candidate,
        reason: sharedSpecies.length
          ? `Also connects to ${sharedSpecies.slice(0, 2).join(' and ')}.`
          : `More from ${journalCategoryLabel(candidate.category)}.`,
      });
    }
  }

  return entries.slice(0, limit);
}

export function journalNeighbours(article: JournalArticle): {
  previous?: JournalArticle;
  next?: JournalArticle;
} {
  const ordered = [...journalArticles].sort((a, b) => a.number - b.number);
  const index = ordered.findIndex((item) => item.id === article.id);
  return {
    previous: index > 0 ? ordered[index - 1] : undefined,
    next: index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : undefined,
  };
}

export function journalPathForArticle(article: JournalArticle): JournalReadingPath | undefined {
  return journalReadingPaths.find(
    (path) =>
      article.readingPathIds.includes(path.id) ||
      path.steps.some((step) => step.articleId === article.id),
  );
}

export function journalPathArticles(path: JournalReadingPath): JournalArticle[] {
  return path.steps
    .map((step) => journalArticleById.get(step.articleId))
    .filter((article): article is JournalArticle => Boolean(article));
}

export type JournalCategoryId =
  | 'paleontology'
  | 'evolution'
  | 'anatomy'
  | 'ancient-worlds'
  | 'debates'
  | 'field-notes';

export type JournalHeroVariant = 'cover' | 'type' | 'plate' | 'map';
export type JournalTone = 'light' | 'dark' | 'bone';
export type JournalStance = 'established' | 'interpretation' | 'debate' | 'open';
export type JournalImageLayout = 'full' | 'wide' | 'inset';

export interface JournalCategory {
  id: JournalCategoryId;
  label: string;
  kicker: string;
  description: string;
}

export interface JournalHero {
  variant: JournalHeroVariant;
  tone: JournalTone;
  label: string;
  assetId?: string;
  alt?: string;
  caption?: string;
  fit?: 'cover' | 'contain';
  position?: string;
}

export interface JournalImage {
  assetId: string;
  alt: string;
  caption?: string;
  label?: string;
}

export interface JournalAnatomyLink {
  speciesId: string;
  structureIds: string[];
}

export type JournalBlock =
  | {
      type: 'text';
      paragraphs: string[];
      refs?: string[];
      dropCap?: boolean;
    }
  | {
      type: 'heading';
      id: string;
      kicker?: string;
      title: string;
      level?: 2 | 3;
    }
  | {
      type: 'image';
      assetId: string;
      alt: string;
      caption?: string;
      label?: string;
      layout: JournalImageLayout;
      fit?: 'cover' | 'contain';
      position?: string;
      refs?: string[];
    }
  | {
      type: 'duo';
      images: [JournalImage, JournalImage];
      caption?: string;
      refs?: string[];
    }
  | {
      type: 'gallery';
      title?: string;
      images: JournalImage[];
      refs?: string[];
    }
  | {
      type: 'pullquote';
      text: string;
      attribution?: string;
      label?: string;
    }
  | {
      type: 'evidence';
      stance: JournalStance;
      title: string;
      body: string;
      refs?: string[];
    }
  | {
      type: 'annotation';
      title: string;
      body: string;
      refs?: string[];
    }
  | {
      type: 'timeline';
      title: string;
      entries: Array<{
        date: string;
        title: string;
        body: string;
        refs?: string[];
      }>;
    }
  | {
      type: 'comparison';
      title: string;
      left: {
        label: string;
        title: string;
        body: string;
        points?: string[];
        refs?: string[];
      };
      right: {
        label: string;
        title: string;
        body: string;
        points?: string[];
        refs?: string[];
      };
      note?: string;
      refs?: string[];
    }
  | {
      type: 'data';
      title: string;
      intro?: string;
      entries: Array<{
        label: string;
        value: string;
        detail?: string;
        refs?: string[];
      }>;
      note?: string;
      refs?: string[];
    }
  | {
      type: 'timescale';
      title: string;
      unitIds: string[];
      highlightId?: string;
      note?: string;
      refs?: string[];
    }
  | {
      type: 'specimen';
      specimenId: string;
      note?: string;
    }
  | {
      type: 'species';
      speciesId: string;
      note?: string;
    }
  | {
      type: 'period';
      unitId: string;
      note?: string;
    }
  | {
      type: 'anatomy';
      speciesId: string;
      structureId: string;
      note?: string;
    }
  | {
      type: 'diagram';
      variant: 'feather-quill' | 'kpg-boundary' | 'world-regions' | 'reconstruction-layers';
      title: string;
      caption: string;
      refs?: string[];
    };

export interface JournalArticle {
  id: string;
  slug: string;
  number: number;
  headline: string;
  subtitle?: string;
  standfirst: string;
  category: JournalCategoryId;
  tags: string[];
  byline: string;
  editorialCredit?: string;
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  featured: boolean;
  hero: JournalHero;
  blocks: JournalBlock[];
  references: string[];
  relatedSpeciesIds: string[];
  relatedPeriodIds: string[];
  relatedSpecimenIds: string[];
  relatedAnatomy: JournalAnatomyLink[];
  relatedArticleIds: string[];
  readingPathIds: string[];
  draft?: boolean;
}

export interface JournalReadingPath {
  id: string;
  title: string;
  description: string;
  steps: Array<{
    articleId: string;
    label: string;
  }>;
}

export interface JournalFilters {
  query: string;
  category: JournalCategoryId | 'all';
  tag: string | 'all';
  species: string | 'all';
  period: string | 'all';
  date: string | 'all';
  sort: 'newest' | 'oldest';
}

export interface JournalFacet {
  value: string;
  label: string;
  count: number;
}

import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { usePageTitle } from '../lib/usePageTitle';
import { useReveal } from '../lib/useReveal';
import {
  JOURNAL_ISSUE,
  activeJournalFilterCount,
  filterJournalArticles,
  journalFacets,
  journalArticles,
} from '../data/journal';
import type { JournalCategoryId, JournalFilters } from '../data/journal/types';
import { JournalExplore } from '../sections/journal/JournalExplore';
import { JournalIndex } from '../sections/journal/JournalIndex';
import { JournalPathways } from '../sections/journal/JournalPathways';
import '../styles/pages.css';
import '../styles/journal.css';

const categoryValues = new Set<string>(journalFacets.categories.map((category) => category.value));
const tagValues = new Set<string>(journalFacets.tags.map((tag) => tag.value));
const speciesValues = new Set<string>(journalFacets.species.map((species) => species.value));
const periodValues = new Set<string>(journalFacets.periods.map((period) => period.value));
const dateValues = new Set<string>(journalFacets.dates.map((date) => date.value));

function filtersFromParams(params: URLSearchParams): JournalFilters {
  const category = params.get('category') ?? 'all';
  const tag = params.get('tag') ?? 'all';
  const species = params.get('species') ?? 'all';
  const period = params.get('period') ?? 'all';
  const date = params.get('date') ?? 'all';
  const sort = params.get('sort') === 'oldest' ? 'oldest' : 'newest';

  return {
    query: (params.get('q') ?? '').slice(0, 120),
    category: (categoryValues.has(category) ? category : 'all') as JournalCategoryId | 'all',
    tag: tagValues.has(tag) ? tag : 'all',
    species: speciesValues.has(species) ? species : 'all',
    period: periodValues.has(period) ? period : 'all',
    date: dateValues.has(date) ? date : 'all',
    sort,
  };
}

export default function JournalPage() {
  usePageTitle('Research & Field Notes', {
    description: JOURNAL_ISSUE.description,
  });
  const root = useReveal<HTMLDivElement>();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = filtersFromParams(searchParams);
  const results = filterJournalArticles(filters);
  const active = activeJournalFilterCount(filters);

  const update = (patch: Partial<JournalFilters>) => {
    const next = { ...filters, ...patch };
    const params = new URLSearchParams();
    if (next.query.trim()) params.set('q', next.query);
    if (next.category !== 'all') params.set('category', next.category);
    if (next.tag !== 'all') params.set('tag', next.tag);
    if (next.species !== 'all') params.set('species', next.species);
    if (next.period !== 'all') params.set('period', next.period);
    if (next.date !== 'all') params.set('date', next.date);
    if (next.sort !== 'newest') params.set('sort', next.sort);
    const replace = Object.keys(patch).every((key) => key === 'query');
    setSearchParams(params, { replace });
  };

  const clear = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="page jrn-page" ref={root}>
      <PageHeader
        index="04.2"
        kicker="Fossil Evidence / Research & field notes"
        title={
          <>
            The evidence <em>trail.</em>
          </>
        }
        intro="Notes that follow an argument back through the encyclopedia: to a specimen, a paper, a period, or a question the fossils do not settle."
        meta={[
          { label: 'Published', value: String(journalArticles.length) },
          { label: 'Subjects', value: String(journalFacets.categories.length) },
          { label: 'Issue', value: JOURNAL_ISSUE.label },
        ]}
      />

      <section className="jrn-principle">
        <div className="shell jrn-principle__grid">
          <p className="jrn-principle__index">Reading the record</p>
          <p className="jrn-principle__statement">
            These are working notes, not a feed. Each one is tied to the same species records,
            references and fossil evidence as the rest of MESOZO.
          </p>
          <p className="jrn-principle__note">
            {active
              ? 'Filters are applied locally and stored in the URL.'
              : 'Filter by subject, species, period or publication month.'}
          </p>
        </div>
      </section>

      <JournalIndex filters={filters} results={results} onChange={update} onClear={clear} />
      <JournalPathways />
      <JournalExplore />
    </div>
  );
}

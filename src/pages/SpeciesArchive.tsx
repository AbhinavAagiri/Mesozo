import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AssetImage } from '../components/ui/AssetImage';
import { SpeciesPlate } from '../components/species/SpeciesPlate';
import { PageHeader } from '../components/ui/PageHeader';
import {
  activeFilterCount,
  defaultFilters,
  dietLabels,
  diets,
  families,
  familiesForGroup,
  filterSpecies,
  formatDate,
  getAtlasCase,
  groups,
  periods,
  regions,
  species,
} from '../data';
import type { ArchiveFilters, SortKey } from '../data';
import type { PeriodId } from '../data/types';
import { usePageTitle } from '../lib/usePageTitle';
import '../styles/pages.css';

const PERIOD_TABS = periods
  .filter((period) => species.some((item) => item.period === period.id))
  .map((period) => ({ id: period.id, label: period.name }));

const SORT_KEYS: SortKey[] = ['name', 'age-oldest', 'age-youngest', 'period', 'recent', 'featured'];

function filtersFromParams(params: URLSearchParams): ArchiveFilters {
  const groupValue = params.get('group') ?? 'all';
  const group = groups.includes(groupValue) ? groupValue : 'all';
  const familyValue = params.get('family') ?? 'all';
  const familyOptions = group === 'all' ? families : familiesForGroup(group);
  const periodValue = params.get('period') ?? 'all';
  const dietValue = params.get('diet') ?? 'all';
  const regionValue = params.get('region') ?? 'all';
  const sortValue = params.get('sort') ?? defaultFilters.sort;

  return {
    query: (params.get('q') ?? '').slice(0, 120),
    period: periods.some((period) => period.id === periodValue)
      ? (periodValue as PeriodId)
      : 'all',
    group,
    family: familyOptions.includes(familyValue) ? familyValue : 'all',
    diet: diets.includes(dietValue as (typeof diets)[number])
      ? (dietValue as (typeof diets)[number])
      : 'all',
    region: regions.includes(regionValue) ? regionValue : 'all',
    sort: SORT_KEYS.includes(sortValue as SortKey) ? (sortValue as SortKey) : 'name',
    featuredOnly: params.get('featured') === '1',
  };
}

function paramsFromFilters(filters: ArchiveFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set('q', filters.query);
  if (filters.period !== 'all') params.set('period', filters.period);
  if (filters.group !== 'all') params.set('group', filters.group);
  if (filters.family !== 'all') params.set('family', filters.family);
  if (filters.diet !== 'all') params.set('diet', filters.diet);
  if (filters.region !== 'all') params.set('region', filters.region);
  if (filters.sort !== defaultFilters.sort) params.set('sort', filters.sort);
  if (filters.featuredOnly) params.set('featured', '1');
  return params;
}

type FilterChip = {
  key: string;
  label: string;
  clear: () => void;
};

export default function SpeciesArchive() {
  usePageTitle('Dinosaur species database', {
    description: `Search ${species.length} non-avian dinosaur species by scientific name, family, clade, period, diet and region. Each entry links its fossil evidence, classification and sources.`,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filters = useMemo(() => filtersFromParams(searchParams), [searchParams]);

  useEffect(() => {
    const canonical = paramsFromFilters(filters).toString();
    if (canonical !== searchParams.toString()) {
      setSearchParams(new URLSearchParams(canonical), { replace: true });
    }
  }, [filters, searchParams, setSearchParams]);

  useEffect(() => {
    setFiltersOpen(false);
  }, [searchParams]);

  const results = useMemo(() => filterSpecies(filters), [filters]);
  const filtered = activeFilterCount(filters) > 0;
  const modified = filtered || filters.sort !== defaultFilters.sort;
  const familyOptions = filters.group === 'all' ? families : familiesForGroup(filters.group);
  const latestReview = formatDate(
    species.reduce((latest, item) => (item.updated > latest ? item.updated : latest), ''),
  );

  const commit = (patch: Partial<ArchiveFilters>, replace = false) => {
    const next = { ...filters, ...patch };
    const params = paramsFromFilters(next);
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace });
    }
  };

  const setField = <K extends keyof ArchiveFilters>(key: K, value: ArchiveFilters[K]) => {
    commit({ [key]: value } as Partial<ArchiveFilters>);
  };

  const chooseGroup = (group: string | 'all') => {
    commit({
      group,
      family:
        group === 'all'
          ? 'all'
          : filters.family !== 'all' && !familiesForGroup(group).includes(filters.family)
            ? 'all'
            : filters.family,
    });
  };

  const clearOne = (key: keyof ArchiveFilters) => {
    if (key === 'query') setField('query', '');
    else if (key === 'featuredOnly') setField('featuredOnly', false);
    else if (key === 'sort') setField('sort', 'name');
    else if (key === 'period') setField('period', 'all');
    else if (key === 'group') setField('group', 'all');
    else if (key === 'family') setField('family', 'all');
    else if (key === 'diet') setField('diet', 'all');
    else if (key === 'region') setField('region', 'all');
  };

  const clearFilters = () => commit(defaultFilters);

  const chips: FilterChip[] = [];
  if (filters.query.trim()) {
    chips.push({
      key: 'query',
      label: `Search: “${filters.query.trim()}”`,
      clear: () => clearOne('query'),
    });
  }
  if (filters.period !== 'all') {
    const period = periods.find((item) => item.id === filters.period);
    chips.push({
      key: 'period',
      label: period?.name ?? filters.period,
      clear: () => clearOne('period'),
    });
  }
  if (filters.group !== 'all') {
    chips.push({
      key: 'group',
      label: filters.group === 'Saurischia' ? 'Basal Saurischia' : filters.group,
      clear: () => clearOne('group'),
    });
  }
  if (filters.family !== 'all') {
    chips.push({
      key: 'family',
      label: filters.family,
      clear: () => clearOne('family'),
    });
  }
  if (filters.diet !== 'all') {
    chips.push({ key: 'diet', label: dietLabels[filters.diet], clear: () => clearOne('diet') });
  }
  if (filters.region !== 'all') {
    chips.push({ key: 'region', label: filters.region, clear: () => clearOne('region') });
  }
  if (filters.featuredOnly) {
    chips.push({
      key: 'featuredOnly',
      label: 'Featured only',
      clear: () => clearOne('featuredOnly'),
    });
  }

  const emptyMessage = filters.query.trim()
    ? `Nothing in the archive matches “${filters.query.trim()}”.`
    : 'No dossiers match this combination of filters.';

  return (
    <div className="page page--archive">
      <PageHeader
        index="01.1"
        kicker="Explore / Species collection"
        title={
          <>
            The dinosaur <em>collection.</em>
          </>
        }
        intro="A working catalogue of non-avian dinosaurs, organised by the evidence that survives. Search the collection, narrow it by time and place, then open a specimen record."
        meta={[
          { label: 'Dossiers', value: String(species.length) },
          { label: 'Families', value: String(families.length) },
          { label: 'Range', value: 'Triassic–Cretaceous' },
          { label: 'Last review', value: latestReview },
        ]}
      />

      <section className="collection shell" aria-labelledby="collection-title">
        <div className="collection__masthead">
          <div>
            <p className="collection__eyebrow">The catalogue</p>
            <h2 className="collection__title" id="collection-title">
              Browse the collection, or start from a branch.
            </h2>
          </div>
          <p className="collection__note">
            Every record names what the fossils preserve and what researchers infer. Images are
            licensed reconstructions or database plates; nothing is borrowed from a different animal.
          </p>
        </div>

        <div className="collection__branches" role="group" aria-label="Browse by dinosaur clade">
          <button
            type="button"
            className={`collection__branch${filters.group === 'all' ? ' is-active' : ''}`}
            onClick={() => chooseGroup('all')}
            aria-pressed={filters.group === 'all'}
          >
            <span className="collection__branch-name">Dinosauria</span>
            <span className="collection__branch-count mono">{species.length}</span>
            <span className="collection__branch-note">All branches</span>
          </button>
          {groups.map((group) => {
            const count = species.filter((item) => item.groupKey === group).length;
            const groupLabel = group === 'Saurischia' ? 'Basal Saurischia' : group;
            return (
              <button
                key={group}
                type="button"
                className={`collection__branch${filters.group === group ? ' is-active' : ''}`}
                onClick={() => chooseGroup(group)}
                aria-pressed={filters.group === group}
              >
                <span className="collection__branch-name">{groupLabel}</span>
                <span className="collection__branch-count mono">{count}</span>
                <span className="collection__branch-note">
                  {familiesForGroup(group).slice(0, 3).join(' · ')}
                  {familiesForGroup(group).length > 3 ? ' …' : ''}
                </span>
              </button>
            );
          })}
          <Link className="collection__tree-link" to="/classification">
            <span>Classification tree</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="collection__workspace">
          <aside
            className="collection-filters"
            id="collection-filters"
            data-open={filtersOpen}
            aria-label="Filter the species collection"
          >
            <div className="collection-filters__head">
              <p className="collection-filters__title">Filter the collection</p>
              <div className="collection-filters__actions">
                <button
                  type="button"
                  className="collection-filters__clear"
                  onClick={clearFilters}
                  disabled={!modified}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="collection-filters__close"
                  onClick={() => setFiltersOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="collection-filters__search">
              <label htmlFor="species-search">Search</label>
              <div>
                <input
                  id="species-search"
                  type="search"
                  value={filters.query}
                  onChange={(event) => commit({ query: event.target.value }, true)}
                  placeholder="Name, family, country"
                  autoComplete="off"
                  maxLength={120}
                  aria-describedby="archive-search-hint"
                />
                {filters.query ? (
                  <button
                    type="button"
                    className="collection-filters__search-clear"
                    onClick={() => clearOne('query')}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                ) : null}
              </div>
              <p id="archive-search-hint">Common name, scientific name, family or country.</p>
            </div>

            <div className="collection-filters__group">
              <p className="collection-filters__label">Geological period</p>
              <div className="collection-filters__periods">
                <button
                  type="button"
                  className={filters.period === 'all' ? 'is-active' : ''}
                  onClick={() => setField('period', 'all')}
                  aria-pressed={filters.period === 'all'}
                >
                  <span>All periods</span>
                  <span className="mono">{species.length}</span>
                </button>
                {PERIOD_TABS.map((tab) => {
                  const count = species.filter((item) => item.period === tab.id).length;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      className={filters.period === tab.id ? 'is-active' : ''}
                      onClick={() => setField('period', tab.id as PeriodId)}
                      aria-pressed={filters.period === tab.id}
                    >
                      <span>{tab.label}</span>
                      <span className="mono">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="collection-filters__group collection-filters__group--selects">
              <label htmlFor="species-family">
                <span className="collection-filters__label">Family</span>
                <select
                  id="species-family"
                  value={filters.family}
                  onChange={(event) => setField('family', event.target.value)}
                >
                  <option value="all">All families</option>
                  {familyOptions.map((family) => (
                    <option value={family} key={family}>
                      {family}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor="species-diet">
                <span className="collection-filters__label">Diet</span>
                <select
                  id="species-diet"
                  value={filters.diet}
                  onChange={(event) =>
                    setField('diet', event.target.value as ArchiveFilters['diet'])
                  }
                >
                  <option value="all">All diets</option>
                  {diets.map((diet) => (
                    <option value={diet} key={diet}>
                      {dietLabels[diet]}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor="species-region">
                <span className="collection-filters__label">Region</span>
                <select
                  id="species-region"
                  value={filters.region}
                  onChange={(event) => setField('region', event.target.value)}
                >
                  <option value="all">All regions</option>
                  {regions.map((region) => (
                    <option value={region} key={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="collection-filters__toggle">
              <input
                type="checkbox"
                checked={filters.featuredOnly}
                onChange={(event) => setField('featuredOnly', event.target.checked)}
              />
              <span>Featured records only</span>
            </label>

            <p className="collection-filters__foot">
              Filters are stored in the URL and applied in your browser. Nothing about this visit
              is sent anywhere.
            </p>
          </aside>

          <div className="collection-results">
            <div className="collection-toolbar">
              <button
                type="button"
                className="collection-toolbar__toggle"
                aria-expanded={filtersOpen}
                aria-controls="collection-filters"
                onClick={() => setFiltersOpen((open) => !open)}
              >
                Filters {activeFilterCount(filters) ? `(${activeFilterCount(filters)})` : ''}
                <span aria-hidden="true">{filtersOpen ? '−' : '+'}</span>
              </button>

              <p className="collection-toolbar__count" aria-live="polite">
                <strong className="mono">{results.length}</strong>
                <span>of {species.length} records</span>
              </p>

              <label className="collection-toolbar__order" htmlFor="species-sort">
                <span>Order</span>
                <select
                  id="species-sort"
                  value={filters.sort}
                  onChange={(event) => setField('sort', event.target.value as SortKey)}
                >
                  <option value="name">Alphabetical</option>
                  <option value="age-oldest">Oldest first</option>
                  <option value="age-youngest">Youngest first</option>
                  <option value="period">Geological period</option>
                  <option value="recent">Recently added</option>
                  <option value="featured">Featured first</option>
                </select>
              </label>
            </div>

            {chips.length ? (
              <div className="collection-chips">
                <p>Applied</p>
                <ul>
                  {chips.map((chip) => (
                    <li key={chip.key}>
                      <button
                        type="button"
                        onClick={chip.clear}
                        aria-label={`Clear filter: ${chip.label}`}
                      >
                        {chip.label}
                        <span aria-hidden="true">×</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {results.length ? (
              <ul className="archive__grid" aria-label="Species records">
                {results.map((item) => {
                  const atlasCase = getAtlasCase(item.slug);
                  return (
                    <li className="archive-card" key={item.slug}>
                      <Link
                        to={`/species/${item.slug}`}
                        className="archive-card__link"
                        data-cursor="view"
                      >
                        <div
                          className={`archive-card__figure${item.image ? '' : ' archive-card__figure--record'}`}
                        >
                          {item.image ? (
                            <AssetImage
                              id={item.image}
                              alt={`Life reconstruction of ${item.scientificName}.`}
                              sizes="(max-width: 700px) 92vw, (max-width: 1100px) 44vw, 28vw"
                              fit="contain"
                            />
                          ) : (
                            <SpeciesPlate species={item} />
                          )}
                          <span className="archive-card__index mono">{item.accession}</span>
                        </div>
                        <div className="archive-card__body">
                          <p className="label archive-card__period">
                            {item.periodLabel} · {item.group}
                          </p>
                          <h3 className="archive-card__name serif">{item.scientificName}</h3>
                          <p className="archive-card__common">{item.commonName}</p>
                          <p className="archive-card__tagline">{item.tagline}</p>
                          {atlasCase ? (
                            <span className="archive-card__atlas mono">
                              <span aria-hidden="true">◎</span> Anatomical atlas ·{' '}
                              {atlasCase.scopeLabel}
                            </span>
                          ) : null}
                          <dl className="archive-card__facts">
                            <div>
                              <dt className="label">Age</dt>
                              <dd className="mono">{item.ageLabel}</dd>
                            </div>
                            <div>
                              <dt className="label">Region</dt>
                              <dd className="mono">{item.region.join(', ')}</dd>
                            </div>
                            <div>
                              <dt className="label">Length</dt>
                              <dd className="mono">{item.length}</dd>
                            </div>
                          </dl>
                          <span className="archive-card__open">
                            Open dossier <span aria-hidden="true">↗</span>
                          </span>
                        </div>
                      </Link>
                      {atlasCase ? (
                        <Link
                          className="archive-card__atlas-link mono"
                          to={`/anatomy?species=${item.slug}`}
                          aria-label={`Open anatomical atlas for ${item.scientificName}`}
                          data-cursor="link"
                        >
                          Open anatomical atlas <span aria-hidden="true">↗</span>
                        </Link>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="collection-empty" role="status">
                <p className="collection-empty__index mono">No records</p>
                <h2>{emptyMessage}</h2>
                <p>Try a broader term, or reset the filters to see all {species.length} records.</p>
                <button type="button" className="button-line" onClick={clearFilters}>
                  Reset the collection
                </button>
              </div>
            )}

            <div className="collection__foot">
              <p>
                The collection currently documents {PERIOD_TABS.map((item) => item.label).join(', ')}.
                Reviewed through {latestReview}. Records without a licensed life reconstruction show
                a database plate.
              </p>
              <p className="mono">
                {species.length} records · {families.length} families
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

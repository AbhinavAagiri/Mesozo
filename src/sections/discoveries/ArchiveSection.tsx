import { useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  activeDiscoveryFilterCount,
  defaultDiscoveryFilters,
  discoveryDateLabels,
  discoveryFacets,
  discoveryPreservationLabels,
  discoverySpecimens,
  discoveryTopicLabels,
  discoveryTypeLabels,
  filterDiscoverySpecimens,
} from '../../data';
import type { DiscoveryFilters } from '../../data';
import { SpecimenCard } from './SpecimenCard';

type FilterOption = { value: string; label: string };

const allowed = {
  period: new Set(discoveryFacets.periods.map((item) => item.value)),
  region: new Set(discoveryFacets.regions.map((item) => item.value)),
  type: new Set(discoveryFacets.types.map((item) => item.value)),
  preservation: new Set(discoveryFacets.preservation.map((item) => item.value)),
  date: new Set(discoveryFacets.dates.map((item) => item.value)),
  topic: new Set(discoveryFacets.topics.map((item) => item.value)),
};

function filtersFromParams(params: URLSearchParams): DiscoveryFilters {
  const pick = (key: string, values: Set<string>) => {
    const value = params.get(key) ?? 'all';
    return values.has(value) ? value : 'all';
  };

  return {
    query: params.get('q') ?? '',
    period: pick('period', allowed.period) as DiscoveryFilters['period'],
    region: pick('region', allowed.region),
    type: pick('type', allowed.type) as DiscoveryFilters['type'],
    preservation: pick('preservation', allowed.preservation) as DiscoveryFilters['preservation'],
    date: pick('date', new Set([...allowed.date, 'all'])) as DiscoveryFilters['date'],
    topic: pick('topic', allowed.topic),
  };
}

function paramsFromFilters(filters: DiscoveryFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set('q', filters.query);
  if (filters.period !== 'all') params.set('period', filters.period);
  if (filters.region !== 'all') params.set('region', filters.region);
  if (filters.type !== 'all') params.set('type', filters.type);
  if (filters.preservation !== 'all') params.set('preservation', filters.preservation);
  if (filters.date !== 'all') params.set('date', filters.date);
  if (filters.topic !== 'all') params.set('topic', filters.topic);
  return params;
}

function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="dsc-filter" htmlFor={id}>
      <span className="label">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ArchiveSection() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const filters = filtersFromParams(searchParams);
  const setFilters = (
    value: DiscoveryFilters | ((current: DiscoveryFilters) => DiscoveryFilters),
    replace = false,
  ) => {
    const next = typeof value === 'function' ? value(filters) : value;
    const params = paramsFromFilters(next);
    navigate(
      {
        pathname: location.pathname,
        search: params.toString() ? `?${params.toString()}` : '',
        hash: location.hash,
      },
      { replace, preventScrollReset: true },
    );
  };
  const filtered = useMemo(() => filterDiscoverySpecimens(filters), [filters]);
  const activeCount = activeDiscoveryFilterCount(filters);

  const all = (label: string): FilterOption => ({ value: 'all', label });

  const chips: Array<{ key: string; label: string; clear: () => void }> = [];
  if (filters.query.trim()) {
    chips.push({
      key: 'query',
      label: `Search: “${filters.query.trim()}”`,
      clear: () => setFilters((current) => ({ ...current, query: '' })),
    });
  }
  if (filters.period !== 'all') {
    chips.push({
      key: 'period',
      label: `Period: ${discoveryFacets.periods.find((item) => item.value === filters.period)?.label ?? filters.period}`,
      clear: () => setFilters((current) => ({ ...current, period: 'all' })),
    });
  }
  if (filters.region !== 'all') {
    chips.push({
      key: 'region',
      label: `Region: ${filters.region}`,
      clear: () => setFilters((current) => ({ ...current, region: 'all' })),
    });
  }
  if (filters.type !== 'all') {
    chips.push({
      key: 'type',
      label: `Type: ${discoveryTypeLabels[filters.type]}`,
      clear: () => setFilters((current) => ({ ...current, type: 'all' })),
    });
  }
  if (filters.preservation !== 'all') {
    chips.push({
      key: 'preservation',
      label: `Preservation: ${discoveryPreservationLabels[filters.preservation]}`,
      clear: () => setFilters((current) => ({ ...current, preservation: 'all' })),
    });
  }
  if (filters.date !== 'all') {
    chips.push({
      key: 'date',
      label: `Discovery: ${discoveryDateLabels[filters.date]}`,
      clear: () => setFilters((current) => ({ ...current, date: 'all' })),
    });
  }
  if (filters.topic !== 'all') {
    chips.push({
      key: 'topic',
      label: `Topic: ${discoveryTopicLabels[filters.topic] ?? filters.topic}`,
      clear: () => setFilters((current) => ({ ...current, topic: 'all' })),
    });
  }

  return (
    <section className="dsc-archive" id="archive" aria-labelledby="dsc-archive-title">
      <div className="shell">
        <header className="dsc-section-head">
          <div className="dsc-section-head__index">
            <p className="label">01 — The fossil archive</p>
            <p className="label">{discoverySpecimens.length} records</p>
          </div>
          <div className="dsc-section-head__main">
            <h2 className="serif" id="dsc-archive-title">
              The specimens behind <em>the pictures.</em>
            </h2>
            <p>
              A specimen is not a species. Each record below is a particular collection, with its own
              material, history and limits. Search the identifiers, people, places and publications
              that connect them.
            </p>
          </div>
        </header>

        <div className="dsc-filterbar">
          <div className="dsc-filterbar__search">
            <label className="dsc-filter dsc-filter--search" htmlFor="dsc-search">
              <span className="label">Search the archive</span>
              <span className="dsc-search">
                <input
                  id="dsc-search"
                  type="search"
                  value={filters.query}
                  placeholder="BSP 1912, Kem Kem, a paper…"
                  maxLength={120}
                  onChange={(event) =>
                    setFilters(
                      (current) => ({ ...current, query: event.target.value }),
                      true,
                    )
                  }
                />
                {filters.query ? (
                  <button
                    type="button"
                    className="dsc-search__clear"
                    aria-label="Clear search"
                    onClick={() => setFilters((current) => ({ ...current, query: '' }))}
                  >
                    ×
                  </button>
                ) : null}
              </span>
            </label>
            <p className="dsc-filterbar__hint mono">
              Identifier · species · locality · formation · researcher · institution · publication
            </p>
          </div>

          <div className="dsc-filterbar__grid">
            <FilterSelect
              id="dsc-period"
              label="Period"
              value={filters.period}
              options={[all('All periods'), ...discoveryFacets.periods]}
              onChange={(value) =>
                setFilters((current) => ({
                  ...current,
                  period: value as DiscoveryFilters['period'],
                }))
              }
            />
            <FilterSelect
              id="dsc-region"
              label="Region"
              value={filters.region}
              options={[all('All regions'), ...discoveryFacets.regions]}
              onChange={(value) => setFilters((current) => ({ ...current, region: value }))}
            />
            <FilterSelect
              id="dsc-type"
              label="Specimen type"
              value={filters.type}
              options={[all('All types'), ...discoveryFacets.types]}
              onChange={(value) =>
                setFilters((current) => ({
                  ...current,
                  type: value as DiscoveryFilters['type'],
                }))
              }
            />
            <FilterSelect
              id="dsc-preservation"
              label="Preservation"
              value={filters.preservation}
              options={[all('All preservation'), ...discoveryFacets.preservation]}
              onChange={(value) =>
                setFilters((current) => ({
                  ...current,
                  preservation: value as DiscoveryFilters['preservation'],
                }))
              }
            />
            <FilterSelect
              id="dsc-date"
              label="Discovery date"
              value={filters.date}
              options={discoveryFacets.dates}
              onChange={(value) =>
                setFilters((current) => ({
                  ...current,
                  date: value as DiscoveryFilters['date'],
                }))
              }
            />
            <FilterSelect
              id="dsc-topic"
              label="Research topic"
              value={filters.topic}
              options={[all('All topics'), ...discoveryFacets.topics]}
              onChange={(value) => setFilters((current) => ({ ...current, topic: value }))}
            />
          </div>
        </div>

        <div className="dsc-archive__status">
          <p className="dsc-archive__count mono" aria-live="polite">
            Showing {filtered.length} of {discoverySpecimens.length} records
          </p>
          {activeCount && filtered.length ? (
            <button
              type="button"
              className="dsc-text-button"
              onClick={() => setFilters(defaultDiscoveryFilters)}
            >
              Clear all filters ({activeCount})
            </button>
          ) : (
            <p className="mono dsc-archive__status-note">
              Filters combine; no record is ranked by popularity.
            </p>
          )}
        </div>

        {chips.length ? (
          <ul className="dsc-chips" aria-label="Active filters">
            {chips.map((chip) => (
              <li key={chip.key}>
                <button type="button" className="dsc-chip" onClick={chip.clear}>
                  <span>{chip.label}</span>
                  <span aria-hidden="true">×</span>
                  <span className="visually-hidden">Remove filter</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {filtered.length ? (
          <div className="dsc-archive__grid">
            {filtered.map((specimen, index) => (
              <SpecimenCard specimen={specimen} index={index} key={specimen.id} />
            ))}
          </div>
        ) : (
          <div className="dsc-empty">
            <p className="label">No records match</p>
            <h3 className="serif">The archive has nothing under that combination.</h3>
            <p>
              Try a broader search, remove a filter, or clear the set. The archive is deliberately
              small; an empty result is a real answer, not a loading state.
            </p>
            <button
              type="button"
              className="dsc-text-button"
              onClick={() => setFilters(defaultDiscoveryFilters)}
            >
              Clear the archive filters
            </button>
          </div>
        )}

        <div className="dsc-archive__foot">
          <p className="mono">
            {discoverySpecimens.length} specimen records · {discoveryFacets.regions.length} regions ·
            curated, dated and cited
          </p>
          <p className="mono">
            Missing information stays missing. No specimen number or date is inferred to fill a card.
          </p>
        </div>
      </div>
    </section>
  );
}

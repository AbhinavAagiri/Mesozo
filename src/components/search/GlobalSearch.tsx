import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  BookOpen,
  Bone,
  Footprints,
  Globe2,
  Hourglass,
  Search,
  Shell,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SEARCH_GROUPS, SEARCH_SUGGESTIONS, searchPlatform } from '../../data/search';
import type { SearchKind, SearchResult } from '../../data/search';
import { getLenis } from '../../lib/useSmoothScroll';
import { releasePageTriggers } from '../../lib/gsap';
import '../../styles/search.css';

type Props = {
  open: boolean;
  onClose: () => void;
};

type ScopeId = 'all' | 'explore' | 'world' | 'anatomy' | 'evidence' | 'guides';

type SearchScope = {
  id: ScopeId;
  label: string;
  readout: string;
  description: string;
  kinds: SearchKind[] | null;
  Icon: LucideIcon;
};

const SEARCH_SCOPES: SearchScope[] = [
  {
    id: 'all',
    label: 'All',
    readout: 'All sections',
    description:
      'One query can find a dinosaur, its ancient world, its anatomy, the specimen behind the reconstruction and the guide that explains the idea.',
    kinds: null,
    Icon: Globe2,
  },
  {
    id: 'explore',
    label: 'Explore',
    readout: 'Explore',
    description: 'Species dossiers, scientific names, common names and their classification.',
    kinds: ['species'],
    Icon: Footprints,
  },
  {
    id: 'world',
    label: 'World',
    readout: 'Prehistoric World',
    description: 'Geological periods, formations, ancient environments and their organisms.',
    kinds: ['period', 'world'],
    Icon: Globe2,
  },
  {
    id: 'anatomy',
    label: 'Anatomy',
    readout: 'Anatomy',
    description: 'Anatomical cases, structures and the evidence used to interpret them.',
    kinds: ['anatomy'],
    Icon: Bone,
  },
  {
    id: 'evidence',
    label: 'Evidence',
    readout: 'Fossil Evidence',
    description: 'Specimen records, discovery history and the research notes behind the reconstructions.',
    kinds: ['specimen', 'discovery', 'journal'],
    Icon: Shell,
  },
  {
    id: 'guides',
    label: 'Guides',
    readout: 'Field guide & glossary',
    description: 'Educational guides, scientific concepts and glossary definitions.',
    kinds: ['learning', 'glossary'],
    Icon: BookOpen,
  },
];

const KIND_ICONS: Record<SearchKind, LucideIcon> = {
  species: Footprints,
  period: Hourglass,
  world: Globe2,
  anatomy: Bone,
  specimen: Shell,
  discovery: Shell,
  journal: BookOpen,
  learning: BookOpen,
  glossary: BookOpen,
};

// PhyloPic silhouette proxies, tinted by the search icon styles.
const SPECIES_ICON_BY_SLUG: Record<string, string> = {
  allosaurus: '/assets/icons/dinosaurs/allosaurus.png',
  ankylosaurus: '/assets/icons/dinosaurs/ankylosaurus.png',
  baryonyx: '/assets/icons/dinosaurs/baryonyx.png',
  brachiosaurus: '/assets/icons/dinosaurs/brachiosaurus.png',
  carnotaurus: '/assets/icons/dinosaurs/carnotaurus.png',
  deinonychus: '/assets/icons/dinosaurs/deinonychus.png',
  giganotosaurus: '/assets/icons/dinosaurs/giganotosaurus.png',
  spinosaurus: '/assets/icons/dinosaurs/spinosaurus.png',
  stegosaurus: '/assets/icons/dinosaurs/stegosaurus.png',
  suchomimus: '/assets/icons/dinosaurs/suchomimus.png',
  triceratops: '/assets/icons/dinosaurs/triceratops.png',
  tyrannosaurus: '/assets/icons/dinosaurs/tyrannosaurus.png',
  velociraptor: '/assets/icons/dinosaurs/velociraptor.png',
};

function dinosaurIconFor(result: SearchResult): string | undefined {
  if (result.kind !== 'species') return undefined;
  return SPECIES_ICON_BY_SLUG[result.id.replace('species-', '')];
}

const optionId = (index: number) => `global-search-option-${index}`;

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Mark literal query fragments without changing the accessible text. */
function highlightText(text: string, rawQuery: string): ReactNode {
  const terms = rawQuery
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter((term) => term.length >= 2);

  if (!terms.length) return text;

  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
  return text.split(pattern).map((part, index) =>
    terms.includes(part.toLowerCase()) ? (
      <mark className="search__match" key={`${part}-${index}`}>
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export function GlobalSearch({ open, onClose }: Props) {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const navigatedRef = useRef(false);
  const [query, setQuery] = useState('');
  const [scopeId, setScopeId] = useState<ScopeId>('all');
  const [active, setActive] = useState(0);

  const scope = SEARCH_SCOPES.find((item) => item.id === scopeId) ?? SEARCH_SCOPES[0];
  const results = useMemo(() => searchPlatform(query), [query]);
  const fuzzyResults = results.some((result) => result.fuzzy);
  const allGroups = useMemo(
    () =>
      SEARCH_GROUPS.map((group) => ({
        ...group,
        results: results.filter((result) => result.kind === group.kind),
      }))
        .filter((group) => group.results.length)
        // The flat result order is relevance order. Let the strongest match
        // decide which section appears first instead of always leading with
        // species when the visitor asked for a period or a structure.
        .sort(
          (a, b) =>
            results.findIndex((result) => result.kind === a.kind) -
            results.findIndex((result) => result.kind === b.kind),
        ),
    [results],
  );
  const groups = useMemo(
    () =>
      allGroups.filter(
        (group) => !scope.kinds || scope.kinds.includes(group.kind as SearchKind),
      ),
    [allGroups, scope],
  );
  const flatResults = useMemo(
    () => groups.flatMap((group) => group.results) as SearchResult[],
    [groups],
  );
  const searchable = query.trim().length >= 2;

  useEffect(() => {
    setActive(0);
  }, [query, scopeId]);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    navigatedRef.current = false;
    const lenis = getLenis();
    document.body.classList.add('is-locked');
    lenis?.stop();

    const background = Array.from(
      document.querySelectorAll<HTMLElement>('.header, #main, .footer'),
    );
    background.forEach((element) => {
      element.inert = true;
    });

    // Focus in the same commit that opens the panel. A delayed focus timer could
    // land after Escape had already closed the panel and steal focus back.
    inputRef.current?.focus();
    return () => {
      document.body.classList.remove('is-locked');
      lenis?.start();
      lenis?.resize();
      background.forEach((element) => {
        element.inert = false;
      });

      if (!navigatedRef.current) {
        const previous = previousFocusRef.current;
        if (previous?.isConnected) previous.focus();
        else document.querySelector<HTMLButtonElement>('.header__search')?.focus();
      }
    };
  }, [open]);

  const close = useCallback(() => {
    navigatedRef.current = false;
    onClose();
  }, [onClose]);

  const choose = useCallback(
    (result: SearchResult) => {
      navigatedRef.current = true;
      onClose();
      releasePageTriggers();
      navigate(result.to);
    },
    [navigate, onClose],
  );

  const chooseScope = (nextScope: ScopeId) => {
    setScopeId(nextScope);
    setActive(0);
  };

  const onPanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    // Result navigation belongs to the search field. Keep Enter and arrow keys
    // native on the scope tabs and the other controls in the dialog.
    if (event.target === inputRef.current) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        if (!flatResults.length) return;
        event.preventDefault();
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        const next = (active + direction + flatResults.length) % flatResults.length;
        setActive(next);
        window.requestAnimationFrame(() => {
          document.getElementById(optionId(next))?.scrollIntoView({ block: 'nearest' });
        });
        return;
      }

      if (event.key === 'Enter' && flatResults[active]) {
        event.preventDefault();
        choose(flatResults[active]);
        return;
      }
    }

    if (event.key !== 'Tab') return;
    const focusable = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), a[href]',
      ) ?? [],
    ).filter((element) => element.getAttribute('tabindex') !== '-1');

    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!open) return null;

  const tooShort = query.trim().length > 0 && query.trim().length < 2;
  const empty = searchable && !results.length;
  const noScopeResults = searchable && results.length > 0 && !flatResults.length;
  const activeResult = flatResults[active];

  const introTitle =
    scopeId === 'all'
      ? 'Search the whole encyclopedia.'
      : `Search the ${scope.label.toLowerCase()} index.`;

  let optionIndex = -1;

  return (
    <div
      className="search"
      role="dialog"
      aria-modal="true"
      aria-labelledby="global-search-title"
      onKeyDown={onPanelKeyDown}
    >
      <button
        type="button"
        className="search__backdrop"
        aria-hidden="true"
        tabIndex={-1}
        onClick={close}
      />

      <div className="search__panel" ref={panelRef}>
        <h2 className="visually-hidden" id="global-search-title">
          Search the MESOZO encyclopedia
        </h2>

        <div className="search__topbar">
          <div className="search__scopes" role="group" aria-label="Filter results by section">
            {SEARCH_SCOPES.map((item) => {
              const Icon = item.Icon;
              return (
                <button
                  type="button"
                  className="search__scope"
                  key={item.id}
                  aria-pressed={scopeId === item.id}
                  onClick={() => chooseScope(item.id)}
                  data-cursor="link"
                >
                  <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="search__close"
            onClick={close}
            aria-label="Close search"
            data-cursor="link"
          >
            <X size={18} strokeWidth={1.9} aria-hidden="true" />
          </button>
        </div>

        <div className="search__bar-wrap">
          <div className="search__bar">
            <div className="search__field">
              <label className="search__label" htmlFor="global-search-input">
                Find
              </label>
              <input
                id="global-search-input"
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Species, period, specimen…"
                maxLength={120}
                autoComplete="off"
                spellCheck={false}
                role="combobox"
                aria-expanded="true"
                aria-controls="global-search-results"
                aria-autocomplete="list"
                aria-activedescendant={activeResult ? optionId(active) : undefined}
              />
            </div>

            <div className="search__scope-readout" aria-hidden="true">
              <span className="search__label">Index</span>
              <span className="search__scope-value">{scope.readout}</span>
            </div>

            <button
              type="button"
              className="search__submit"
              onClick={() => {
                if (activeResult) choose(activeResult);
                else inputRef.current?.focus();
              }}
              disabled={!activeResult}
              aria-label={activeResult ? `Open ${activeResult.title}` : 'Search the encyclopedia'}
              title={activeResult ? `Open ${activeResult.title}` : 'Search the encyclopedia'}
              data-cursor="link"
            >
              <Search size={20} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          className="search__body"
          id="global-search-results"
          role="region"
          data-lenis-prevent
          tabIndex={0}
          aria-label="Search results"
        >
          <p className="visually-hidden" role="status" aria-live="polite">
            {searchable
              ? `${flatResults.length} ${flatResults.length === 1 ? 'result' : 'results'} for ${query.trim()}${
                  scopeId === 'all' ? '' : ` in ${scope.label}`
                }${fuzzyResults ? '. Close spelling matches.' : ''}`
              : ''}
          </p>

          {tooShort ? (
            <div className="search__empty">
              <p className="label">Keep typing</p>
              <h3 className="search__empty-title serif">Two letters open the index.</h3>
              <p>
                Search species, ancient worlds, the geological time scale, anatomical structures,
                fossil specimens, discovery history, field guides and glossary terms.
              </p>
            </div>
          ) : null}

          {empty ? (
            <div className="search__empty">
              <p className="label">No result</p>
              <h3 className="search__empty-title serif">
                Nothing in this edition matches “{query.trim()}”.
              </h3>
              <p>
                Try a scientific or common name, a period, a formation, a specimen number or a
                broader term. The database is deliberately evidence-led; an empty result is a real
                answer.
              </p>
              <div className="search__suggestions" role="group" aria-label="Suggested searches">
                {SEARCH_SUGGESTIONS.map((suggestion) => (
                  <button
                    type="button"
                    className="search__suggestion"
                    key={suggestion}
                    onClick={() => {
                      setQuery(suggestion);
                      inputRef.current?.focus();
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {noScopeResults ? (
            <div className="search__empty">
              <p className="label">No result in {scope.readout.toLowerCase()}</p>
              <h3 className="search__empty-title serif">
                Nothing in the {scope.label.toLowerCase()} index matches “{query.trim()}”.
              </h3>
              <p>
                The query does return records elsewhere in the encyclopedia. Widen the index to see
                them.
              </p>
              <button
                type="button"
                className="search__suggestion search__suggestion--reset"
                onClick={() => {
                  chooseScope('all');
                  inputRef.current?.focus();
                }}
              >
                Search all sections
              </button>
            </div>
          ) : null}

          {!query.trim() ? (
            <div className="search__empty">
              <p className="label">
                {scopeId === 'all' ? 'A single index' : `${scope.label} index`}
              </p>
              <h3 className="search__empty-title serif">{introTitle}</h3>
              <p>{scope.description}</p>
              <div className="search__suggestions" role="group" aria-label="Suggested searches">
                {SEARCH_SUGGESTIONS.map((suggestion) => (
                  <button
                    type="button"
                    className="search__suggestion"
                    key={suggestion}
                    onClick={() => {
                      setQuery(suggestion);
                      inputRef.current?.focus();
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {groups.length ? (
            <div
              className={`search__groups${
                groups.length === 1 ? ' search__groups--single' : ''
              }`}
              role="listbox"
              aria-label="Search results"
            >
              {groups.map((group) => {
                const GroupIcon = KIND_ICONS[group.kind];
                return (
                  <section
                    className="search__group"
                    key={group.kind}
                    aria-labelledby={`search-group-${group.kind}`}
                    role="group"
                  >
                    <div className="search__group-head">
                      <p className="search__group-title" id={`search-group-${group.kind}`}>
                        <span className="search__group-icon" aria-hidden="true">
                          <GroupIcon size={14} strokeWidth={1.8} />
                        </span>
                        <span>
                          {group.index} — {group.label}
                        </span>
                      </p>
                      <span className="mono search__group-count">{group.results.length}</span>
                    </div>
                    <div className="search__options">
                      {group.results.map((result) => {
                        optionIndex += 1;
                        const index = optionIndex;
                        const ResultIcon = KIND_ICONS[result.kind];
                        const dinosaurIcon = dinosaurIconFor(result);
                        return (
                          <Link
                            className="search__option"
                            id={optionId(index)}
                            key={result.id}
                            to={result.to}
                            role="option"
                            aria-selected={index === active}
                            tabIndex={-1}
                            onMouseEnter={() => setActive(index)}
                            onClick={() => {
                              navigatedRef.current = true;
                              onClose();
                            }}
                            data-cursor="link"
                          >
                            {dinosaurIcon ? (
                              <span
                                className="search__option-icon search__option-icon--dino"
                                aria-hidden="true"
                                style={
                                  {
                                    '--dino-icon': `url("${dinosaurIcon}")`,
                                  } as CSSProperties
                                }
                              />
                            ) : (
                              <span className="search__option-icon" aria-hidden="true">
                                <ResultIcon size={16} strokeWidth={1.7} />
                              </span>
                            )}
                            <span className="search__option-copy">
                              <span className="search__option-title">
                                {highlightText(result.title, query)}
                              </span>
                              <span className="search__option-subtitle">
                                {highlightText(result.subtitle, query)}
                              </span>
                              {result.description ? (
                                <span className="search__option-description">
                                  {highlightText(result.description, query)}
                                </span>
                              ) : null}
                            </span>
                            <span className="search__option-meta mono" title={result.meta}>
                              {result.meta}
                            </span>
                            <span className="search__option-arrow" aria-hidden="true">
                              <ArrowUpRight size={15} strokeWidth={1.8} />
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : null}
        </div>

        <footer className="search__foot">
          <span className="mono search__status">
            {searchable
              ? `${flatResults.length} ${flatResults.length === 1 ? 'result' : 'results'} · ${
                  scope.readout
                } · local index${fuzzyResults ? ' · close spelling' : ''}`
              : 'Species · worlds · anatomy · evidence · guides'}
          </span>
          <span className="mono search__hints">
            <span>
              <kbd>↑</kbd> <kbd>↓</kbd> browse
            </span>
            <span>
              <kbd>Enter</kbd> open
            </span>
            <span>
              <kbd>Esc</kbd> close
            </span>
          </span>
        </footer>
      </div>
    </div>
  );
}

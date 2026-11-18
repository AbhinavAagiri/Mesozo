import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { InlineSources } from '../../components/ui/Sources';
import {
  discoveryRevisions,
  discoverySpecimenById,
  speciesBySlug,
} from '../../data';
import type { DiscoveryRevision } from '../../data/types';

const STAGE_KEYS = ['earlier', 'evidenceThen', 'trigger', 'revised', 'uncertainty'] as const;

function RevisionPanel({ revision }: { revision: DiscoveryRevision }) {
  const species = speciesBySlug.get(revision.speciesId);
  const specimens = revision.specimenIds
    .map((id) => discoverySpecimenById.get(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div
      className="dsc-revision-panel"
      role="tabpanel"
      id={`revision-panel-${revision.id}`}
      aria-labelledby={`revision-${revision.id}`}
      tabIndex={0}
    >
      <div className="dsc-revision-panel__head">
        <p className="label">{revision.kicker}</p>
        <h3 className="serif">{revision.title}</h3>
        {species ? (
          <Link className="dsc-text-link" to={`/species/${species.slug}`}>
            {species.scientificName} dossier <span aria-hidden="true">↗</span>
          </Link>
        ) : null}
      </div>

      <ol className="dsc-revision-steps">
        {STAGE_KEYS.map((key, index) => {
          const stage = revision[key];
          return (
            <li className="dsc-revision-step" key={key}>
              <div className="dsc-revision-step__number mono">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="dsc-revision-step__body">
                <p className="label">{stage.label}</p>
                <p>{stage.body}</p>
                <InlineSources ids={stage.refs} />
              </div>
            </li>
          );
        })}
      </ol>

      {specimens.length ? (
        <div className="dsc-revision-panel__records">
          <p className="label">Records in this case</p>
          <ul>
            {specimens.map((specimen) => (
              <li key={specimen.id}>
                <Link className="dsc-text-link" to={`/discoveries/specimen/${specimen.id}`}>
                  {specimen.identifier} <span aria-hidden="true">↗</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function RevisionsSection() {
  const [activeId, setActiveId] = useState(discoveryRevisions[0]?.id ?? '');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = discoveryRevisions.find((revision) => revision.id === activeId) ?? discoveryRevisions[0];

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (!hash.startsWith('revision-')) return;
      const requested = hash.slice('revision-'.length);
      if (discoveryRevisions.some((revision) => revision.id === requested)) {
        setActiveId(requested);
      }
    };

    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = discoveryRevisions.length - 1;
    let next = index;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    else return;

    event.preventDefault();
    const revision = discoveryRevisions[next];
    if (!revision) return;
    setActiveId(revision.id);
    tabRefs.current[next]?.focus();
  };

  if (!active) return null;

  return (
    <section
      className="dsc-revisions section--dark"
      id="revisions"
      data-theme="dark"
      aria-labelledby="dsc-revisions-title"
    >
      <div className="shell">
        <header className="dsc-revisions__head">
          <div>
            <p className="label">04 — Scientific revisions</p>
            <h2 className="serif" id="dsc-revisions-title">
              When the <em>evidence changed.</em>
            </h2>
          </div>
          <p className="lead">
            New fossils do not simply replace old ideas. They change what can be tested. These cases
            show the evidence available at each stage, the discovery that forced a rethink, and what
            still is not settled.
          </p>
        </header>

        <div className="dsc-revisions__layout">
          <div className="dsc-revisions__tabs" role="tablist" aria-label="Revision cases">
            {discoveryRevisions.map((revision, index) => (
              <button
                type="button"
                role="tab"
                id={`revision-${revision.id}`}
                key={revision.id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                className={`dsc-revision-tab${revision.id === active.id ? ' is-active' : ''}`}
                aria-selected={revision.id === active.id}
                aria-controls={`revision-panel-${revision.id}`}
                tabIndex={revision.id === active.id ? 0 : -1}
                onClick={() => setActiveId(revision.id)}
                onKeyDown={(event) => onKeyDown(event, index)}
              >
                <span className="label">{String(index + 1).padStart(2, '0')}</span>
                <span className="dsc-revision-tab__title serif">{revision.title}</span>
                <span className="mono">{revision.kicker}</span>
              </button>
            ))}
            <div className="dsc-revisions__note">
              <p className="label">Not a simple ladder</p>
              <p>
                A newer paper is not automatically right. The panel keeps the earlier reading, the
                new evidence and the remaining disagreement in the same frame.
              </p>
            </div>
          </div>

          <div className="dsc-revision-panels">
            {discoveryRevisions.map((revision) => (
              <div hidden={revision.id !== active.id} key={revision.id}>
                <RevisionPanel revision={revision} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

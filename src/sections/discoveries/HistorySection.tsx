import { Link } from 'react-router-dom';
import { InlineSources } from '../../components/ui/Sources';
import {
  discoveries,
  discoveryArchive,
  discoveryExpeditionById,
  discoveryRevisionById,
  discoverySpecimenById,
} from '../../data';
import { MILESTONE_KIND_LABEL } from './labels';

export function HistorySection() {
  const ordered = [...discoveries].sort((a, b) => a.year - b.year || a.title.localeCompare(b.title));

  return (
    <section className="dsc-history" id="history" aria-labelledby="dsc-history-title">
      <div className="shell">
        <header className="dsc-section-head">
          <div className="dsc-section-head__index">
            <p className="label">03 — History of discovery</p>
            <p className="label">1824–2022</p>
          </div>
          <div className="dsc-section-head__main">
            <h2 className="serif" id="dsc-history-title">
              A history of evidence, <em>not a parade of heroes.</em>
            </h2>
            <p>
              Names, publications, museum collections and arguments. Each milestone is tied to the
              specimen, expedition or revision it changed — where the archive has one.
            </p>
          </div>
        </header>

        <ol className="dsc-history__list">
          {ordered.map((milestone, index) => {
            const links = discoveryArchive.milestoneLinks[milestone.id];
            const specimens = (links?.specimenIds ?? [])
              .map((id) => discoverySpecimenById.get(id))
              .filter((item): item is NonNullable<typeof item> => Boolean(item));
            const expeditions = (links?.expeditionIds ?? [])
              .map((id) => discoveryExpeditionById.get(id))
              .filter((item): item is NonNullable<typeof item> => Boolean(item));
            const revision = links?.revisionId
              ? discoveryRevisionById.get(links.revisionId)
              : undefined;

            return (
              <li className="dsc-history-item" id={milestone.id} key={milestone.id} data-reveal>
                <div className="dsc-history-item__rail">
                  <p className="dsc-history-item__year serif">{milestone.year}</p>
                  <span className="dsc-history-item__line" aria-hidden="true" />
                  <span className="mono">{String(index + 1).padStart(2, '0')}</span>
                </div>

                <div className="dsc-history-item__body">
                  <p className="label">
                    {MILESTONE_KIND_LABEL[milestone.kind] ?? milestone.kind} · {milestone.dateLabel}
                  </p>
                  <h3 className="serif">{milestone.title}</h3>
                  <p className="dsc-history-item__subject">{milestone.subject}</p>
                  <p className="dsc-history-item__summary">{milestone.summary}</p>

                  {specimens.length || expeditions.length || revision ? (
                    <div className="dsc-history-item__links">
                      {specimens.map((specimen) => (
                        <Link
                          className="dsc-record-link"
                          to={`/discoveries/specimen/${specimen.id}`}
                          key={specimen.id}
                        >
                          <span className="label">Specimen</span>
                          <span>{specimen.identifier}</span>
                        </Link>
                      ))}
                      {expeditions.map((expedition) => (
                        <Link
                          className="dsc-record-link"
                          to={`/discoveries#expedition-${expedition.id}`}
                          key={expedition.id}
                        >
                          <span className="label">Expedition</span>
                          <span>{expedition.name}</span>
                        </Link>
                      ))}
                      {revision ? (
                        <Link
                          className="dsc-record-link"
                          to={`/discoveries#revision-${revision.id}`}
                        >
                          <span className="label">Revision</span>
                          <span>{revision.title}</span>
                        </Link>
                      ) : null}
                    </div>
                  ) : null}

                  <InlineSources ids={milestone.refs} />
                </div>
              </li>
            );
          })}
        </ol>

        <div className="dsc-history__note">
          <p className="label">Scope note</p>
          <p>
            This is a focused chronology of the specimens and debates in this archive, not a complete
            history of palaeontology. It leaves out many researchers, institutions and discoveries
            that do not have a record here.
          </p>
        </div>
      </div>
    </section>
  );
}

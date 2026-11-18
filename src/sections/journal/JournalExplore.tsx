import { Link } from 'react-router-dom';
import { atlasCases, discoverySpecimens, geologicalTime, species } from '../../data';

const ENTRIES = [
  {
    index: '01',
    label: 'The species database',
    to: '/species',
    note: 'Dossiers, evidence and the animals behind the stories.',
    value: () => `${species.length} dossiers`,
  },
  {
    index: '02',
    label: 'Deep Time',
    to: '/deep-time',
    note: '4.567 billion years, from the first minerals to the present.',
    value: () => geologicalTime.version,
  },
  {
    index: '03',
    label: 'The anatomical atlas',
    to: '/anatomy',
    note: 'Read the skeleton and separate bone from interpretation.',
    value: () => `${atlasCases.length} plates`,
  },
  {
    index: '04',
    label: 'Discoveries',
    to: '/discoveries',
    note: 'The fossil archive, field records and changing interpretations.',
    value: () => `${discoverySpecimens.length} specimens`,
  },
];

export function JournalExplore() {
  return (
    <section className="jrn-explore" aria-labelledby="jrn-explore-title">
      <div className="shell">
        <header className="jrn-explore__head">
          <div>
            <p className="label">03 — Beyond the page</p>
            <h2 className="serif" id="jrn-explore-title">
              Research is a second entrance <em>into the encyclopedia.</em>
            </h2>
          </div>
          <p>
            Follow a reference back to the database. Every species, period, specimen and anatomical
            structure in a note is a live record, not a footnote.
          </p>
        </header>

        <div className="jrn-explore__grid">
          {ENTRIES.map((entry) => (
            <Link className="jrn-explore__item" to={entry.to} key={entry.to} data-cursor="link">
              <span className="label">{entry.index}</span>
              <span className="jrn-explore__title serif">{entry.label}</span>
              <span className="jrn-explore__note">{entry.note}</span>
              <span className="jrn-explore__value mono">{entry.value()}</span>
              <span className="jrn-explore__open" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

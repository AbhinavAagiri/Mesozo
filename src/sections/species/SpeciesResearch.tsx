import { EvidenceTag } from '../../components/ui/EvidenceTag';
import { InlineSources } from '../../components/ui/Sources';
import type {
  EvidenceKind,
  ResearchTopic,
  Species,
  SpeciesResearchEntry,
  Reference,
} from '../../data/types';
import { SpeciesSectionHead } from './SpeciesSectionHead';

const LEDGER: Array<{ kind: EvidenceKind; meaning: string }> = [
  {
    kind: 'fossil',
    meaning: 'Bone, teeth, eggs, impressions or traces recovered from rock and described in the fossil record.',
  },
  {
    kind: 'reconstruction',
    meaning: 'Missing or incomplete parts restored for display. A reconstruction is an argument, not preserved material.',
  },
  {
    kind: 'inference',
    meaning: 'A function or behaviour read from preserved anatomy and comparison, not observed directly.',
  },
  {
    kind: 'contested',
    meaning: 'Credible published interpretations disagree. The dossier gives the competing positions instead of one answer.',
  },
  {
    kind: 'unknown',
    meaning: 'The surviving evidence does not support a responsible conclusion. The gap is stated rather than filled.',
  },
];

const TOPIC_LABEL: Record<ResearchTopic, string> = {
  taxonomy: 'Taxonomy',
  anatomy: 'Anatomy',
  growth: 'Growth & ontogeny',
  geology: 'Geology & stratigraphy',
  palaeobiology: 'Palaeobiology',
  history: 'History & collections',
  general: 'General',
};

const STATUS_LABEL: Record<string, string> = {
  verified: 'Verified against species-level literature',
  'partially-verified': 'Partially verified',
  limited: 'Literature-limited',
  curated: 'Curated dossier',
};

export type SpeciesResearchTrail = {
  entries: SpeciesResearchEntry[];
  note: string;
  specimenStatus: string;
};

type Props = {
  species: Species;
  trail?: SpeciesResearchTrail;
  extraRefs?: Reference[];
  index?: string;
};

/**
 * The research trail makes the evidence hierarchy operational: it explains the
 * categories, states what was actually checked, and records the limits of the
 * bibliography instead of implying that every species is equally known.
 */
export function SpeciesResearch({ species, trail, extraRefs = [], index = '05' }: Props) {
  const entries = trail?.entries ?? [];
  const evidenceKinds = Array.from(new Set(species.fossilEvidence.map((item) => item.evidence)));
  const referenceCount = new Set([
    ...species.references,
    ...species.fossilEvidence.flatMap((item) => item.refs ?? []),
    ...extraRefs.map((reference) => reference.id),
  ]).size;

  if (!entries.length) {
    return (
      <section id="research-trail" className="spx-section">
        <div className="shell">
          <SpeciesSectionHead
            index={index}
            title="Research coverage and limits"
            intro="A dossier is not a claim that everything is known. This statement separates the evidence presented above from the current state of the bibliography, and says plainly where coverage stops."
          />

          <div className="spx-research">
            <aside className="spx-research__ledger" data-reveal>
              <p className="label">Evidence ledger</p>
              <dl className="spx-research__key">
                {LEDGER.map((item) => (
                  <div key={item.kind}>
                    <dt>
                      <EvidenceTag kind={item.kind} />
                    </dt>
                    <dd>{item.meaning}</dd>
                  </div>
                ))}
              </dl>

              <div className="spx-research__status">
                <p className="label">Research status</p>
                <p className="serif">
                  {species.researchStatus
                    ? (STATUS_LABEL[species.researchStatus] ?? species.researchStatus)
                    : 'Reviewed'}
                </p>
                <p>No separate source-by-source trail is published for this dossier.</p>
              </div>
            </aside>

            <div className="spx-research__coverage" data-reveal>
              <p className="label">Coverage statement</p>
              <h3 className="serif">Supported by the record, but not yet trail-indexed.</h3>
              <p>
                This dossier presents evidence-tagged fossil material and a linked bibliography,
                but it does not yet have a separately compiled research trail. That is an editorial
                coverage limit, not a finding that the scientific literature is absent. No trail
                or source relationship has been invented to make the archive look uniform.
              </p>
              <dl className="spx-research__coverage-counts">
                <div>
                  <dt>Evidence-tagged sections</dt>
                  <dd>{species.fossilEvidence.length}</dd>
                </div>
                <div>
                  <dt>Evidence categories</dt>
                  <dd>{evidenceKinds.length}</dd>
                </div>
                <div>
                  <dt>Linked references</dt>
                  <dd>{referenceCount}</dd>
                </div>
              </dl>
              <p>
                Check the <a href="#fossil-record">fossil record</a> for the preserved material,
                any contested interpretations stated in the dossier, and the{' '}
                <a href="#references">bibliography</a> for every citation used here. Historical
                works without a DOI or URL stay listed without one; no link has been fabricated.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="research-trail" className="spx-section">
      <div className="shell">
        <SpeciesSectionHead
          index={index}
          title="What the evidence can carry"
          intro="A dossier is not a claim that everything is known. This ledger separates the kinds of evidence used above, records the research trail, and states what remains unresolved."
        />

        <div className="spx-research">
          <aside className="spx-research__ledger" data-reveal>
            <p className="label">Evidence ledger</p>
            <dl className="spx-research__key">
              {LEDGER.map((item) => (
                <div key={item.kind}>
                  <dt>
                    <EvidenceTag kind={item.kind} />
                  </dt>
                  <dd>{item.meaning}</dd>
                </div>
              ))}
            </dl>

            <div className="spx-research__status">
              <p className="label">Research status</p>
              <p className="serif">
                {species.researchStatus
                  ? (STATUS_LABEL[species.researchStatus] ?? species.researchStatus)
                  : 'Reviewed'}
              </p>
              {trail?.specimenStatus ? <p>{trail.specimenStatus}</p> : null}
            </div>
          </aside>

          <ol className="spx-research__list">
            {entries.map((entry, entryIndex) => (
              <li className="spx-research__item" key={`${entry.title}-${entryIndex}`} data-reveal>
                <span className="spx-research__num mono">
                  {String(entryIndex + 1).padStart(2, '0')}
                </span>
                <div className="spx-research__body">
                  <div className="spx-research__head">
                    <h3 className="serif">{entry.title}</h3>
                    <EvidenceTag kind={entry.evidence} />
                  </div>
                  <p>{entry.body}</p>
                  <p className="spx-research__meta mono">
                    {TOPIC_LABEL[entry.topic] ?? entry.topic} · {entry.access}
                    {entry.accessDetail && entry.accessDetail !== entry.access ? (
                      <span className="spx-research__access-detail">{entry.accessDetail}</span>
                    ) : null}
                  </p>
                  <InlineSources ids={entry.refs} extraRefs={extraRefs} />
                </div>
              </li>
            ))}
          </ol>
        </div>

        {trail?.note ? (
          <p className="spx-research__note" data-reveal>
            {trail.note}
          </p>
        ) : null}
      </div>
    </section>
  );
}

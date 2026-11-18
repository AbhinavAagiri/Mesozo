import { Link } from 'react-router-dom';
import { getClaimReview, getSpeciesAudit } from '../../data';
import type {
  ClaimEvidence,
  ClaimReview,
  ClaimReviewStatus,
  Species,
  SpeciesAuditEntry,
} from '../../data/types';
import { InlineSources } from '../../components/ui/Sources';
import { SpeciesSectionHead } from './SpeciesSectionHead';

type Props = {
  species: Species;
  index?: string;
};

const EVIDENCE: Array<{
  id: ClaimEvidence;
  label: string;
  meaning: string;
}> = [
  {
    id: 'direct',
    label: 'Direct evidence',
    meaning: 'Preserved bone, teeth, eggs, impressions, rock or specimen evidence that can be examined directly.',
  },
  {
    id: 'inference',
    label: 'Strong scientific inference',
    meaning: 'A conclusion supported by multiple lines of evidence, but not itself preserved.',
  },
  {
    id: 'debate',
    label: 'Active debate',
    meaning: 'Credible published interpretations disagree. The competing readings are stated, not resolved by preference.',
  },
  {
    id: 'unknown',
    label: 'Unknown',
    meaning: 'The surviving evidence does not support a reliable conclusion. The gap is stated rather than filled.',
  },
];

const REVIEW_STATUS: Record<ClaimReviewStatus | 'protected-existing', string> = {
  'researched-enriched': 'Researched and enriched',
  'reviewed-no-new-evidence': 'Reviewed, no substantial new evidence found',
  'partially-researched': 'Partially researched',
  'requires-verification': 'Requires further verification',
  'protected-existing': 'Protected existing dossier',
};

function EvidenceKey({ review }: { review?: ClaimReview }) {
  return (
    <aside className="spx-claims__key" data-reveal>
      <p className="label">Claim evidence key</p>
      <dl className="spx-claims__key-list">
        {EVIDENCE.map((item) => (
          <div key={item.id} className={`spx-claims__key-row spx-claims__key-row--${item.id}`}>
            <dt>
              <span className="spx-claims__swatch" aria-hidden="true" />
              {item.label}
            </dt>
            <dd>{item.meaning}</dd>
          </div>
        ))}
      </dl>
      <p className="spx-claims__note">
        These four categories are the claim-review standard. Older section tags elsewhere in the
        dossier use the archive’s five working labels; they are not silently treated as equivalent.{' '}
        <Link to="/learn/how-palaeontologists-work">How a claim is built</Link>.
      </p>
      {review ? (
        <div className="spx-claims__status">
          <p className="label">Review status</p>
          <p className="serif">{REVIEW_STATUS[review.status]}</p>
          <p>{review.scope}</p>
          <details className="spx-claims__access">
            <summary>What was actually read</summary>
            <ul>
              {review.sourcesRead.map((source) => (
                <li key={source}>{source}</li>
              ))}
            </ul>
          </details>
        </div>
      ) : null}
    </aside>
  );
}

function ClaimReviewBody({ review }: { review: ClaimReview }) {
  return (
    <div className="spx-claims__body">
      <ol className="spx-claims__list">
        {review.claims.map((claim, claimIndex) => (
          <li className={`spx-claim spx-claim--${claim.evidence}`} key={claim.id} data-reveal>
            <span className="spx-claim__num mono">
              {String(claimIndex + 1).padStart(2, '0')}
            </span>
            <div className="spx-claim__content">
              <div className="spx-claim__head">
                <span className={`spx-claim__tag spx-claim__tag--${claim.evidence}`}>
                  {EVIDENCE.find((item) => item.id === claim.evidence)?.label ?? claim.evidence}
                </span>
                <span className="spx-claim__id mono">{claim.id}</span>
              </div>
              <p className="spx-claim__statement">{claim.statement}</p>
              {claim.qualification ? (
                <p className="spx-claim__qualification">{claim.qualification}</p>
              ) : null}
              {claim.context ? <p className="spx-claim__context mono">{claim.context}</p> : null}
              {claim.conflict ? (
                <div className="spx-claim__conflict">
                  <p className="label">Competing reading</p>
                  <p>{claim.conflict}</p>
                </div>
              ) : null}
              <InlineSources ids={claim.refs} />
            </div>
          </li>
        ))}
      </ol>

      <div className="spx-claims__gaps" data-reveal>
        <p className="label">What remains open</p>
        <ul>
          {review.gaps.map((gap) => (
            <li key={gap}>{gap}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CoverageBody({
  species,
  audit,
}: {
  species: Species;
  audit?: SpeciesAuditEntry;
}) {
  return (
    <div className="spx-claims__body spx-claims__body--coverage" data-reveal>
      <div className="spx-claims__coverage">
        <p className="label">Coverage statement</p>
        <h3 className="serif">No claim-level review has been published for this species yet.</h3>
        <p>
          The dossier still carries evidence-tagged fossil and anatomy sections and a linked
          bibliography, but its individual statements have not been rechecked one by one against
          the primary literature. That is a coverage limit, not a finding that the science is
          absent. No claim relationship has been invented to make the archive look uniform.
        </p>
        <dl className="spx-claims__coverage-counts">
          <div>
            <dt>Research status</dt>
            <dd>{audit ? REVIEW_STATUS[audit.status] : 'Not audited'}</dd>
          </div>
          <div>
            <dt>Linked references</dt>
            <dd>{audit?.refs ?? species.references.length}</dd>
          </div>
          <div>
            <dt>Trail entries</dt>
            <dd>{audit?.trailEntries ?? 0}</dd>
          </div>
        </dl>
        {audit?.flags.length ? (
          <div className="spx-claims__flags">
            <p className="label">Coverage flags</p>
            <ul>
              {audit.flags.map((flag) => (
                <li key={flag}>{flag}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {audit?.note ? <p className="spx-claims__audit-note">{audit.note}</p> : null}
        <p>
          Read the <a href="#research-trail">research trail</a> for the source-by-source access
          record, and the <a href="#references">bibliography</a> for every citation used in this
          dossier.
        </p>
      </div>
    </div>
  );
}

/**
 * The claim ledger is the public face of the scientific review. It only shows
 * claims that were actually written from a source; otherwise it says so.
 */
export function SpeciesClaims({ species, index = '06' }: Props) {
  const review = getClaimReview(species.slug);
  const audit = getSpeciesAudit(species.slug);

  return (
    <section id="claims" className="spx-section spx-section--tint">
      <div className="shell">
        <SpeciesSectionHead
          index={index}
          title="Claims and what carries them"
          intro="A statement is not stronger because it sounds confident. This ledger separates what the rocks preserve from what has been inferred, disputed or left open."
        />

        <div className="spx-claims">
          <EvidenceKey review={review} />
          {review ? <ClaimReviewBody review={review} /> : <CoverageBody species={species} audit={audit} />}
        </div>
      </div>
    </section>
  );
}

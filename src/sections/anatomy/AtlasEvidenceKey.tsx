import { AtlasEvidenceTag } from '../../components/ui/AtlasEvidenceTag';
import type { AtlasEvidenceKey } from '../../data/types';

type Props = {
  entries: AtlasEvidenceKey[];
};

/** The atlas key is content, not decoration. */
export function AtlasEvidenceKey({ entries }: Props) {
  return (
    <section className="atlas-key" aria-labelledby="atlas-key-title">
      <div className="shell">
        <div className="atlas-key__head">
          <div>
            <p className="label">Evidence register</p>
            <h2 className="serif" id="atlas-key-title">
              Four kinds of claim.
            </h2>
          </div>
          <p>
            The archive's general evidence tags describe the broad status of a claim. The atlas uses
            a finer four-part key: a bone, a reconstruction, a functional argument, or an open
            disagreement. The distinction is the exhibit.
          </p>
        </div>

        <div className="atlas-key__grid">
          {entries.map((entry) => (
            <article className="atlas-key__item" key={entry.id}>
              <AtlasEvidenceTag kind={entry.id} />
              <h3 className="serif">{entry.label}</h3>
              <p>{entry.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

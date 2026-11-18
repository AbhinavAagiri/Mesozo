import { ReferenceList } from '../../components/ui/Sources';
import { assetById, type Asset } from '../../data';
import type { Reference } from '../../data/types';
import { SpeciesSectionHead } from './SpeciesSectionHead';

type Props = {
  ids: string[];
  creditIds: string[];
  reviewed: string;
  extraRefs?: Reference[];
  index?: string;
};

/** Sources, image licences and the editorial standard for the dossier. */
export function SpeciesReferences({
  ids,
  creditIds,
  reviewed,
  extraRefs = [],
  index = '09',
}: Props) {
  const credits = creditIds
    .map((id) => assetById.get(id))
    .filter((asset): asset is Asset => Boolean(asset));

  return (
    <section id="references" className="spx-section">
      <div className="shell">
        <SpeciesSectionHead
          index={index}
          title="Sources and credits"
          intro="Scientific claims in this dossier are cited to the literature or institution that supports them. The bibliography follows the page; the credits list every image used and the licence it is used under."
        />

        <div className="spx-refs">
          <div className="spx-refs__main">
            <p className="label">Bibliography</p>
            <ReferenceList ids={ids} extraRefs={extraRefs} />
          </div>

          <aside className="spx-refs__aside">
            <p className="label">Image credits</p>
            <ul className="spx-credits">
              {credits.map((asset) => (
                <li key={asset.id}>
                  <p className="spx-credit__title serif">{asset.title}</p>
                  <p className="spx-credit__meta mono">
                    {asset.creator} · {asset.license}
                  </p>
                  <a href={asset.sourceUrl} target="_blank" rel="noreferrer">
                    Source ↗
                  </a>
                </li>
              ))}
            </ul>

            <div className="spx-method">
              <p className="label">Editorial method</p>
              <p>
                Direct fossil evidence, reconstruction, inference, contested interpretation
                and unknown are labelled separately throughout. Where the record is
                incomplete, the dossier says so instead of filling the gap. No specimen number,
                measurement or citation on this page is invented.
              </p>
              <p className="mono spx-method__reviewed">Last reviewed {reviewed}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

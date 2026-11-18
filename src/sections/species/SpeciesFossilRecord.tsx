import { Link } from 'react-router-dom';
import { AssetImage } from '../../components/ui/AssetImage';
import { EvidenceTag } from '../../components/ui/EvidenceTag';
import { InlineSources } from '../../components/ui/Sources';
import { assetById, discoverySpecimensForSpecies } from '../../data';
import type { Reference, Species, SpeciesPageContent, SpeciesPageSpecimen } from '../../data/types';
import { SpeciesSectionHead } from './SpeciesSectionHead';

type Props = {
  species: Species;
  page?: SpeciesPageContent;
  extraRefs?: Reference[];
  index?: string;
};

function Specimen({
  specimen,
  index,
  extraRefs,
}: {
  specimen: SpeciesPageSpecimen;
  index: number;
  extraRefs?: Reference[];
}) {
  const asset = assetById.get(specimen.image);

  return (
    <article className="spx-spec" data-reveal>
      <div className="spx-spec__marker">
        <span className="mono">{String(index + 1).padStart(2, '0')}</span>
        <span className="label">{specimen.status}</span>
      </div>

      <div className="spx-spec__body">
        <h3 className="serif">{specimen.identifier}</h3>
        <dl className="spx-spec__data">
          <div>
            <dt className="label">Material</dt>
            <dd>{specimen.material}</dd>
          </div>
          <div>
            <dt className="label">Locality</dt>
            <dd>{specimen.locality}</dd>
          </div>
          <div>
            <dt className="label">Date</dt>
            <dd>{specimen.date}</dd>
          </div>
          {specimen.repository ? (
            <div>
              <dt className="label">Repository</dt>
              <dd>{specimen.repository}</dd>
            </div>
          ) : null}
        </dl>
        <p className="spx-spec__why">{specimen.significance}</p>
        <InlineSources ids={specimen.refs} extraRefs={extraRefs} />
      </div>

      <figure className="spx-spec__figure">
        <div className="spx-spec__media">
          <AssetImage
            id={specimen.image}
            alt={asset?.title ?? `Specimen ${specimen.identifier}.`}
            sizes="(max-width: 900px) 94vw, 28vw"
            fit="contain"
          />
        </div>
        <figcaption className="spx-spec__caption">
          <span>{specimen.imageCaption}</span>
          {asset ? (
            <a href={asset.sourceUrl} target="_blank" rel="noreferrer">
              Source ↗
            </a>
          ) : null}
        </figcaption>
      </figure>
    </article>
  );
}

/** The fossil record: specimens, what survives, and what was lost. */
export function SpeciesFossilRecord({ species, page, extraRefs = [], index = '05' }: Props) {
  const record = page?.fossilRecord;
  const archiveSpecimens = discoverySpecimensForSpecies(species.slug);

  return (
    <section id="fossil-record" className="spx-section">
      <div className="shell">
        <SpeciesSectionHead
          index={index}
          title="What the rocks preserved"
          intro={
            record?.intro ??
            'The specimens and preserved structures behind this dossier. Every claim about the animal begins here.'
          }
        />

        {record ? (
          <div className="spx-specs">
            {record.specimens.map((specimen, index) => (
              <Specimen
                specimen={specimen}
                index={index}
                extraRefs={extraRefs}
                key={specimen.identifier}
              />
            ))}
          </div>
        ) : (
          <div className="spx-anat__blocks">
            {species.fossilEvidence.map((section) => (
              <article className="spx-anat__block" key={section.title} data-reveal>
                <div className="spx-anat__block-head">
                  <h3 className="serif">{section.title}</h3>
                  <EvidenceTag kind={section.evidence} />
                </div>
                <p>{section.body}</p>
                <InlineSources ids={section.refs ?? []} extraRefs={extraRefs} />
              </article>
            ))}
          </div>
        )}

        {archiveSpecimens.length ? (
          <div className="spx-spec__discoveries" data-reveal>
            <p className="label">Collection records</p>
            <div className="spx-spec__discoveries-list">
              {archiveSpecimens.map((specimen) => (
                <Link
                  className="spx-spec__discoveries-link"
                  to={`/discoveries/specimen/${specimen.id}`}
                  key={specimen.id}
                >
                  <span className="mono">{specimen.identifier}</span>
                  <span>{specimen.typeStatus}</span>
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
            <p className="spx-spec__discoveries-note">
              Catalogue records for this species in the Discoveries archive. Each one is a separate
              specimen with its own provenance; they are not parts of a single animal.
            </p>
          </div>
        ) : (
          <div className="spx-spec__discoveries" data-reveal>
            <p className="label">Fossil archive</p>
            <Link className="spx-spec__discoveries-link" to="/discoveries#archive">
              <span>Search the fossil record</span>
              <span className="mono">No linked specimen record</span>
              <span aria-hidden="true">↗</span>
            </Link>
            <p className="spx-spec__discoveries-note">
              No individual specimen is currently catalogued under this species in the Discoveries
              archive. The account above is based on the published material cited for this record;
              the absence of a linked catalogue entry is not evidence that no fossil exists.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

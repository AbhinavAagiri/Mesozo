import { Link } from 'react-router-dom';
import { AssetImage } from '../../components/ui/AssetImage';
import { InlineSources } from '../../components/ui/Sources';
import {
  assetById,
  discoveryArchive,
  discoverySpecimenById,
  speciesBySlug,
} from '../../data';
import { MEDIA_ROLE_LABEL } from './labels';

const CASE_SPECIMENS = ['bsp-1912-viii-19', 'msnm-v4047', 'fsac-kk-11888'];

export function SpinosaurusCase() {
  const study = discoveryArchive.caseStudy;
  const species = speciesBySlug.get('spinosaurus');

  return (
    <section
      className="dsc-case section--dark"
      id="spinosaurus"
      data-theme="dark"
      aria-labelledby="dsc-case-title"
    >
      <div className="shell">
        <header className="dsc-case__head">
          <div>
            <p className="label">{study.kicker}</p>
            <h2 className="serif" id="dsc-case-title">
              {study.title}
            </h2>
          </div>
          <div className="dsc-case__intro">
            <p className="lead">{study.standfirst}</p>
            {species ? (
              <Link className="dsc-text-link" to={`/species/${species.slug}`}>
                Open the Spinosaurus dossier <span aria-hidden="true">↗</span>
              </Link>
            ) : null}
          </div>
        </header>

        <div className="dsc-case__principle" data-reveal>
          <p className="label">Read the records separately</p>
          <p className="serif">Three specimens. Not three pieces of one animal.</p>
        </div>

        <div className="dsc-case__triptych">
          {CASE_SPECIMENS.map((id, index) => {
            const specimen = discoverySpecimenById.get(id);
            if (!specimen) return null;
            const media = specimen.media[0];
            const asset = media ? assetById.get(media.assetId) : undefined;
            return (
              <Link
                className="dsc-case-plate"
                to={`/discoveries/specimen/${specimen.id}`}
                key={specimen.id}
                data-reveal
              >
                <div className="dsc-case-plate__media">
                  {media && asset ? (
                    <AssetImage
                      id={media.assetId}
                      alt={`${specimen.identifier}: ${media.caption}`}
                      sizes="(max-width: 760px) 92vw, 31vw"
                      fit="contain"
                    />
                  ) : (
                    <div className="dsc-card__placeholder">
                      <span className="label">No licensed photograph</span>
                      <span className="serif">{specimen.identifier}</span>
                    </div>
                  )}
                </div>
                <div className="dsc-case-plate__body">
                  <p className="label">
                    {String(index + 1).padStart(2, '0')} · {media ? MEDIA_ROLE_LABEL[media.role] : 'Record'}
                  </p>
                  <h3 className="serif">{specimen.identifier}</h3>
                  <p className="mono">{specimen.typeStatus}</p>
                  {media ? <p className="dsc-case-plate__caption">{media.caption}</p> : null}
                  <span className="dsc-case-plate__open mono">Read the record ↗</span>
                </div>
              </Link>
            );
          })}
        </div>

        <ol className="dsc-case__chapters">
          {study.chapters.map((chapter, index) => (
            <li className="dsc-case-chapter" id={chapter.id} key={chapter.id} data-reveal>
              <div className="dsc-case-chapter__marker">
                <span className="mono">{String(index + 1).padStart(2, '0')}</span>
                <span className="label">{chapter.yearLabel}</span>
              </div>
              <div className="dsc-case-chapter__body">
                <h3 className="serif">{chapter.title}</h3>
                <p>{chapter.body}</p>
                <div className="dsc-case-chapter__links">
                  {chapter.specimenIds.map((id) => {
                    const specimen = discoverySpecimenById.get(id);
                    return specimen ? (
                      <Link className="dsc-text-link" to={`/discoveries/specimen/${specimen.id}`} key={id}>
                        {specimen.identifier} <span aria-hidden="true">↗</span>
                      </Link>
                    ) : null;
                  })}
                </div>
                <InlineSources ids={chapter.refs} className="inline-sources--light" />
              </div>
            </li>
          ))}
        </ol>

        <aside className="dsc-case__limits" data-reveal>
          <p className="label">What this case study does not claim</p>
          <ul>
            {study.limits.map((limit) => (
              <li key={limit}>{limit}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AssetImage } from '../../components/ui/AssetImage';
import { InlineSources } from '../../components/ui/Sources';
import { assetById, spinosaurusHypotheses, spinosaurusTimeline } from '../../data';
import { useReveal } from '../../lib/useReveal';

const STAGE_YEARS = ['1915', '1934', '2014', '2020'];

const IMAGES: Record<string, { id: string; note: string; fit: 'contain' | 'cover' }> = {
  '1915': { id: 'spinosaurus-mandible-1915', note: 'Stromer’s 1915 mandible drawings', fit: 'contain' },
  '1934': { id: 'spinosaurus-plate-1934', note: 'Stromer’s 1934 plates of ‘Spinosaurus B’', fit: 'contain' },
  '2014': { id: 'spinosaurus-art-aquatic', note: 'Aquatic hypothesis, interpretation', fit: 'cover' },
  '2020': { id: 'spinosaurus-skeletal-2020', note: 'Ibrahim et al. 2020 skeletal reconstruction', fit: 'contain' },
};

export function Reconstruction() {
  const [year, setYear] = useState('2020');
  const stage = spinosaurusTimeline.find((event) => event.year === year) ?? spinosaurusTimeline[0];
  const image = IMAGES[year];
  const asset = image ? assetById.get(image.id) : undefined;
  const root = useReveal<HTMLElement>();

  return (
    <section className="recon section--dark" id="reconstruction" ref={root} data-theme="dark">
      <div className="shell">
        <div className="section-head">
          <p className="section-head__index">
            <span className="label">05</span>
            <span className="label">Reconstructing the past</span>
          </p>
          <h2 className="section-head__title" data-line>
            <span>The animal has not changed. The reading of it has.</span>
          </h2>
          <div className="section-head__aside">
            <p>
              Spinosaurus is known from fragmentary, partly destroyed material. Its body has been
              rebuilt as a bipedal predator, a semi-aquatic swimmer and a shoreline forager — each
              time from the same bones, read differently.
            </p>
          </div>
        </div>

        <div className="recon__stepper" role="tablist" aria-label="Spinosaurus reconstruction history">
          {STAGE_YEARS.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={item === year}
              className={`recon__step${item === year ? ' is-active' : ''}`}
              onClick={() => setYear(item)}
              data-cursor="link"
            >
              <span className="recon__step-year">{item}</span>
              <span className="recon__step-line" aria-hidden="true" />
            </button>
          ))}
        </div>

        <div className="recon__body" role="tabpanel">
          <figure className="recon__figure">
            <div className="recon__image">
              {image ? (
                <AssetImage
                  id={image.id}
                  alt={asset?.title ?? image.note}
                  sizes="(max-width: 900px) 94vw, 52vw"
                  fit={image.fit}
                  eager
                />
              ) : null}
            </div>
            <figcaption className="recon__caption mono">
              {image?.note}
              {asset ? ` · ${asset.creator} · ${asset.license}` : ''}
            </figcaption>
          </figure>

          <div className="recon__text">
            <p className="eyebrow">
              {stage.dateLabel} — {stage.kind}
            </p>
            <h3 className="recon__title serif">{stage.title}</h3>
            {stage.people ? <p className="recon__people label">{stage.people}</p> : null}
            <p className="recon__copy">{stage.body}</p>
            <InlineSources ids={stage.refs ?? []} className="inline-sources--light" />
          </div>
        </div>

        <div className="recon__debate">
          <div className="recon__debate-head">
            <p className="label">Where the evidence is still contested</p>
            <p>
              These are hypotheses, not settled facts. Each one is argued from the same fragmentary
              record.
            </p>
          </div>

          <ul className="recon__hypotheses">
            {spinosaurusHypotheses.map((item) => (
              <li key={item.id} className="recon__hypothesis" data-reveal>
                <div className="recon__hypothesis-head">
                  <h4 className="serif">{item.name}</h4>
                  <span className="label recon__status">{item.status}</span>
                </div>
                <p className="recon__claim">{item.claim}</p>
                <div className="recon__split">
                  <div>
                    <p className="label">Support</p>
                    <ul>
                      {item.support.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="label">Criticism</p>
                    <ul>
                      {item.criticism.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <InlineSources ids={item.refs} className="inline-sources--light" />
              </li>
            ))}
          </ul>

          <Link className="text-link text-link--light" to="/species/spinosaurus" data-cursor="link">
            Open the Spinosaurus dossier <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

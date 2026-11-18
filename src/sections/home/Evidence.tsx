import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AssetImage } from '../../components/ui/AssetImage';
import { EvidenceTag } from '../../components/ui/EvidenceTag';
import { InlineSources } from '../../components/ui/Sources';
import { anatomyHotspots } from '../../data';
import type { EvidenceKind } from '../../data/types';
import { useReveal } from '../../lib/useReveal';

const KEY: { kind: EvidenceKind; meaning: string }[] = [
  { kind: 'fossil', meaning: 'Recovered from rock: bone, teeth, impressions, trackways.' },
  { kind: 'inference', meaning: 'Read from anatomy by comparison with living animals.' },
  { kind: 'reconstruction', meaning: 'An authored image, argument made visible.' },
  { kind: 'contested', meaning: 'Credible researchers disagree; the dossier gives both positions.' },
  { kind: 'unknown', meaning: 'The evidence does not support a responsible conclusion.' },
];

export function Evidence() {
  const [active, setActive] = useState(anatomyHotspots[2]?.id ?? anatomyHotspots[0].id);
  const hotspot = anatomyHotspots.find((item) => item.id === active) ?? anatomyHotspots[0];
  const root = useReveal<HTMLElement>();

  return (
    <section className="evidence" id="anatomy" ref={root}>
      <div className="shell evidence__grid">
        <div className="evidence__copy">
          <p className="section-head__index">
            <span className="label">04</span>
            <span className="label">Anatomy of evidence</span>
          </p>

          <h2 className="evidence__title serif" data-line>
            <span>What survived</span>
          </h2>
          <h2 className="evidence__title evidence__title--indent serif" data-line>
            <span>is the argument.</span>
          </h2>

          <blockquote className="evidence__quote serif" data-reveal>
            What we know comes from what survived. What we imagine begins where the evidence ends.
          </blockquote>

          <p className="body evidence__body" data-reveal>
            A skeleton is not an animal. Bone gives us joints, muscle scars, tooth wear and growth
            lines; it does not give us colour, behaviour or the shape of a throat. Those are
            arguments built on comparison, and they are labelled as such throughout MESOZO.
          </p>

          <ul className="evidence__key" data-reveal>
            {KEY.map((item) => (
              <li key={item.kind}>
                <EvidenceTag kind={item.kind} />
                <span>{item.meaning}</span>
              </li>
            ))}
          </ul>

          <Link className="text-link" to="/anatomy" data-cursor="link">
            Enter the anatomical atlas <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="evidence__plate-wrap" data-reveal>
          <figure className="evidence__plate">
            <div className="evidence__image">
              <div className="evidence__map">
                <AssetImage
                  id="spinosaurus-skeletal-2020"
                  alt="Skeletal reconstruction of Spinosaurus aegyptiacus in lateral view."
                  sizes="(max-width: 900px) 94vw, 48vw"
                  fit="contain"
                  eager
                />
                {anatomyHotspots.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`evidence__hotspot evidence__hotspot--${item.id}${item.id === active ? ' is-active' : ''}`}
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    onClick={() => setActive(item.id)}
                    aria-pressed={item.id === active}
                    aria-label={`${item.label}: ${item.structure}`}
                    data-cursor="link"
                  >
                    <span className="visually-hidden">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <figcaption className="evidence__caption mono">
              Spinosaurus aegyptiacus — composite skeletal reconstruction, Ibrahim et al. 2020.
              Drawing: Marco Auditore, CC BY 4.0. Hotspot positions are diagrammatic.
            </figcaption>
          </figure>

          <div className="evidence__panel" aria-live="polite">
            <div className="evidence__panel-head">
              <span className="label">{hotspot.label}</span>
              <EvidenceTag kind={hotspot.evidence} />
            </div>
            <p className="evidence__structure serif">{hotspot.structure}</p>
            <p className="evidence__panel-body">{hotspot.body}</p>
            <InlineSources ids={hotspot.refs} />
          </div>
        </div>
      </div>
    </section>
  );
}

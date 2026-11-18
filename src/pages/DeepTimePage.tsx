import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ReferenceList } from '../components/ui/Sources';
import {
  assetById,
  deepTime,
  deepTimeEvents,
  geologicalTime,
  geoUnits,
  getGeoUnit,
  species,
} from '../data';
import { usePageTitle } from '../lib/usePageTitle';
import { useReducedMotion } from '../lib/useReducedMotion';
import { CoexistenceExplorer } from '../sections/deep-time/CoexistenceExplorer';
import { EarthScale } from '../sections/deep-time/EarthScale';
import { GeologicalTimeline } from '../sections/deep-time/GeologicalTimeline';
import { LifeThroughTime } from '../sections/deep-time/LifeThroughTime';
import { OccurrenceLedger } from '../sections/deep-time/OccurrenceLedger';
import { UnitExplorer } from '../sections/deep-time/UnitExplorer';
import '../styles/pages.css';
import '../styles/deep-time.css';

const DEFAULT_UNIT = 'cretaceous';

export default function DeepTimePage() {
  usePageTitle('Deep time', {
    description:
      'A sourced journey through 4.567 billion years of Earth history: the geological time scale, extinction boundaries and the species ranges recorded in the MESOZO archive.',
  });
  const reduced = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('period') ?? searchParams.get('unit') ?? '';
  const [selectedId, setSelectedId] = useState(() =>
    getGeoUnit(requested) ? requested : DEFAULT_UNIT,
  );
  const [timelineKey, setTimelineKey] = useState(0);

  useEffect(() => {
    setSelectedId(getGeoUnit(requested) ? requested : DEFAULT_UNIT);
  }, [requested]);

  const select = (id: string) => {
    setSelectedId(id);
    const next = new URLSearchParams(searchParams);
    next.delete('unit');
    next.set('period', id);
    if (next.toString() !== searchParams.toString()) setSearchParams(next);
  };

  const selectAndOpen = (id: string) => {
    select(id);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById('period-detail')?.scrollIntoView({
          behavior: reduced ? 'auto' : 'smooth',
          block: 'start',
        });
      });
    });
  };

  const reset = () => {
    setSelectedId(DEFAULT_UNIT);
    setTimelineKey((key) => key + 1);
    const next = new URLSearchParams(searchParams);
    next.delete('period');
    next.delete('unit');
    if (next.toString() !== searchParams.toString()) setSearchParams(next, { replace: true });
    document.getElementById('atlas')?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const contentRefs = useMemo(() => {
    const timeRefs = new Set(['ics2026', 'cohen2025', 'gradstein2020']);
    const refs = new Set<string>();
    for (const unit of Object.values(deepTime.units)) {
      for (const ref of unit.refs) refs.add(ref);
    }
    for (const event of deepTimeEvents) {
      for (const ref of event.refs) refs.add(ref);
    }
    for (const unit of geoUnits) {
      for (const ref of unit.sourceRefs) refs.add(ref);
    }
    return Array.from(refs).filter((ref) => !timeRefs.has(ref));
  }, []);

  const timeRefs = useMemo(
    () => Array.from(new Set([geologicalTime.sourceRef, 'cohen2025', 'gradstein2020'])),
    [],
  );

  const imageAssets = useMemo(() => {
    const assets = species
      .map((item) => (item.image ? assetById.get(item.image) : undefined))
      .filter((asset) => Boolean(asset));
    return Array.from(new Map(assets.map((asset) => [asset!.id, asset!])).values());
  }, []);

  return (
    <div className="page dt-page">
      <header className="dt-masthead" data-theme="dark">
        <div className="shell">
          <div className="dt-masthead__meta">
            <p className="label">
              <span>02.1</span> Deep time
            </p>
            <p className="label">Prehistoric World / Geological atlas</p>
            <p className="label">ICS v2026/06</p>
          </div>

          <div className="dt-masthead__grid">
            <div className="dt-masthead__copy">
              <p className="dt-masthead__kicker mono">Earth history / chronostratigraphy</p>
              <h1 className="serif">
                Geological <em>atlas.</em>
              </h1>
              <p className="dt-masthead__intro">
                Read the Phanerozoic as a physical record: choose a period, compare its duration
                with the rest of Earth history, then follow its climate, fossil evidence and
                archived species into the database.
              </p>
              <div className="dt-masthead__legend">
                <span>
                  <i data-era="paleozoic" /> Paleozoic
                </span>
                <span>
                  <i data-era="mesozoic" /> Mesozoic
                </span>
                <span>
                  <i data-era="cenozoic" /> Cenozoic
                </span>
              </div>
            </div>

            <div className="dt-masthead__instrument">
              <EarthScale selectedId={selectedId} onSelect={selectAndOpen} />
              <dl className="dt-masthead__stats">
                <div>
                  <dt className="label">Earth</dt>
                  <dd className="mono">4.567 Ga</dd>
                </div>
                <div>
                  <dt className="label">Phanerozoic</dt>
                  <dd className="mono">538.8 Ma</dd>
                </div>
                <div>
                  <dt className="label">Periods</dt>
                  <dd className="mono">
                    {geoUnits.filter((unit) => unit.rank === 'period').length}
                  </dd>
                </div>
                <div>
                  <dt className="label">Dossiers</dt>
                  <dd className="mono">{species.length}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </header>

      <section className="dt-atlas" id="atlas" data-theme="dark" aria-labelledby="dt-atlas-title">
        <div className="shell">
          <header className="dt-atlas__head">
            <div>
              <p className="label">01 / Chronostratigraphy</p>
              <h2 className="serif" id="dt-atlas-title">
                Phanerozoic timescale
              </h2>
            </div>
            <div className="dt-atlas__intro">
              <p>
                The last 538.8 million years, drawn in proportion. Periods are selectable at every
                scale; the period index gives every unit a readable target.
              </p>
              <p className="mono">
                Boundaries: {geologicalTime.name} {geologicalTime.version} · older at left
              </p>
            </div>
          </header>

          <GeologicalTimeline
            key={timelineKey}
            selectedId={selectedId}
            onSelect={select}
            onReset={reset}
          />
        </div>
      </section>

      <UnitExplorer key={selectedId} selectedId={selectedId} onSelect={select} onReset={reset} />
      <OccurrenceLedger />
      <LifeThroughTime onSelect={selectAndOpen} />
      <CoexistenceExplorer />

      <section className="dt-sources" id="sources" data-theme="dark" aria-labelledby="dt-sources-title">
        <div className="shell">
          <header className="dt-sources__head">
            <div>
              <p className="label">05 / Sources & method</p>
              <h2 className="serif" id="dt-sources-title">
                Evidence behind the atlas.
              </h2>
            </div>
            <p>
              Every boundary, event and species range in this interface comes from a named record.
              Missing data stays missing; no chart is decorated with invented evidence.
            </p>
          </header>

          <div className="dt-sources__method">
            <section>
              <p className="label">Time scale</p>
              <h3 className="serif">{geologicalTime.name}</h3>
              <p>{geologicalTime.citation}</p>
              <p className="dt-sources__note">{geologicalTime.note}</p>
              <div className="dt-sources__links">
                <a href={geologicalTime.url} target="_blank" rel="noreferrer">
                  ICS chart page <span aria-hidden="true">↗</span>
                </a>
                <a href={geologicalTime.chartUrl} target="_blank" rel="noreferrer">
                  Current chart PDF <span aria-hidden="true">↗</span>
                </a>
              </div>
            </section>
            <section>
              <p className="label">Ranges & overlap</p>
              <p>
                Species bars use the archive&apos;s <span className="mono">ageMa</span> estimates,
                not the full duration of a lineage. A range end is softened because the date is
                uncertain.
              </p>
              <p>
                Coexistence requires strict positive overlap:{' '}
                <span className="mono">min(older endpoints) − max(younger endpoints)</span>. Shared
                continents are broad archive keys, not palaeogeographic reconstructions. Temporal
                overlap does not establish interaction.
              </p>
            </section>
            <section>
              <p className="label">Images & reconstructions</p>
              <p>
                Every image is a licensed reconstruction, specimen photograph, or modern field
                reference. Landscape photographs are identified as analogues, never as
                reconstructions; the contour sheet is a modern method reference, not a
                palaeogeographic map. Credits appear with each field plate and in the dossier.
              </p>
              <Link className="text-link" to="/species">
                Explore all {species.length} dossiers <span aria-hidden="true">↗</span>
              </Link>
            </section>
          </div>

          <div className="dt-sources__disclosures">
            <details className="dt-disclosure">
              <summary>
                <span className="label">Bibliography</span>
                <span className="mono">
                  {timeRefs.length + contentRefs.length} references · open the list
                </span>
              </summary>
              <div className="dt-bibliography">
                <div>
                  <p className="label">Time-scale references</p>
                  <ReferenceList ids={timeRefs} />
                </div>
                <div>
                  <p className="label">Content & event references</p>
                  <ReferenceList ids={contentRefs} />
                </div>
              </div>
            </details>

            <details className="dt-disclosure">
              <summary>
                <span className="label">Image credits</span>
                <span className="mono">{imageAssets.length} licensed assets · open the list</span>
              </summary>
              <div className="dt-credits">
                <div className="dt-credits__head">
                  <p className="label">Image credits</p>
                  <p className="mono">All derivative images are AVIF/WebP; originals are linked.</p>
                </div>
                <ul>
                  {imageAssets.map((asset) => (
                    <li key={asset.id}>
                      <p className="dt-credits__title">{asset.title}</p>
                      <p className="dt-credits__attribution">{asset.attribution}</p>
                      <a href={asset.sourceUrl} target="_blank" rel="noreferrer">
                        Source & licence <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>

          <p className="dt-sources__foot mono">
            Static, data-driven reference · accessed {geologicalTime.accessed} · version{' '}
            {geologicalTime.version} · no account, live API or paid service required
          </p>
        </div>
      </section>
    </div>
  );
}

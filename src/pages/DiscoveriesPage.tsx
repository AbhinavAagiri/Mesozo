import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { ReferenceList } from '../components/ui/Sources';
import {
  assetById,
  discoveryArchive,
  discoveryAssetIds,
  discoveryExpeditions,
  discoveryRefs,
  discoverySpecimens,
} from '../data';
import { usePageTitle } from '../lib/usePageTitle';
import { useReveal } from '../lib/useReveal';
import { ArchiveSection } from '../sections/discoveries/ArchiveSection';
import { DiscoveryMap } from '../sections/discoveries/DiscoveryMap';
import { ExpeditionsSection } from '../sections/discoveries/ExpeditionsSection';
import { HistorySection } from '../sections/discoveries/HistorySection';
import { RevisionsSection } from '../sections/discoveries/RevisionsSection';
import { SpinosaurusCase } from '../sections/discoveries/SpinosaurusCase';
import '../styles/pages.css';
import '../styles/discoveries.css';

const SECTION_LINKS = [
  { href: '#archive', index: '01', label: 'Fossil archive' },
  { href: '#spinosaurus', index: '02', label: 'Spinosaurus case' },
  { href: '#expeditions', index: '03', label: 'Expeditions' },
  { href: '#history', index: '04', label: 'History' },
  { href: '#revisions', index: '05', label: 'Revisions' },
  { href: '#map', index: '06', label: 'Map' },
];

export default function DiscoveriesPage() {
  usePageTitle('Discoveries', {
    description:
      'A curated fossil archive and history of discovery: the specimens, people and arguments behind MESOZO\u2019s reconstructions, with missing evidence left visible.',
  });
  const root = useReveal<HTMLDivElement>();
  const creditAssets = discoveryAssetIds()
    .map((id) => assetById.get(id))
    .filter((asset): asset is NonNullable<typeof asset> => Boolean(asset));

  return (
    <div className="page dsc-page" ref={root}>
      <PageHeader
        index="04.1"
        kicker="Fossil Evidence / Discoveries"
        title={
          <>
            Evidence, before <em>the image.</em>
          </>
        }
        intro="A curated fossil archive, a history of fieldwork and a record of the arguments that changed the science. Nothing here begins with the picture."
        meta={[
          { label: 'Specimens', value: `${discoverySpecimens.length}` },
          { label: 'Field records', value: `${discoveryExpeditions.length}` },
          { label: 'Chronology', value: '1824–2024' },
        ]}
      />

      <section className="dsc-overture" aria-labelledby="dsc-principle">
        <div className="shell">
          <div className="dsc-overture__grid">
            <p className="label">The central principle</p>
            <div>
              <p className="dsc-overture__statement serif" id="dsc-principle">
                Every piece of evidence <em>has a story.</em>
              </p>
              <p className="dsc-overture__body">
                A specimen is a physical object with a collection history. A reconstruction is an
                argument about that object. This archive keeps the two apart, then shows how one
                informs the other.
              </p>
            </div>
          </div>

          <nav className="dsc-jump" aria-label="Discoveries sections">
            {SECTION_LINKS.map((link) => (
              <a href={link.href} key={link.href}>
                <span className="mono">{link.index}</span>
                <span>{link.label}</span>
                <span aria-hidden="true">↓</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      <ArchiveSection />
      <SpinosaurusCase />
      <ExpeditionsSection />
      <HistorySection />
      <RevisionsSection />
      <DiscoveryMap />

      <section className="dsc-sources" id="sources" aria-labelledby="dsc-sources-title">
        <div className="shell">
          <header className="dsc-section-head">
            <div className="dsc-section-head__index">
              <p className="label">07 — Sources &amp; limits</p>
              <p className="label">Version {discoveryArchive.version}</p>
            </div>
            <div className="dsc-section-head__main">
              <h2 className="serif" id="dsc-sources-title">
                The record, with its <em>edges visible.</em>
              </h2>
              <p>
                Every claim in the archive is tied to a reference. The limits below are part of the
                record, not a disclaimer added at the end.
              </p>
            </div>
          </header>

          <div className="dsc-sources__grid">
            <div className="dsc-sources__block">
              <p className="label">What this archive does not show</p>
              <ul>
                {discoveryArchive.limits.map((limit) => (
                  <li key={limit}>{limit}</li>
                ))}
              </ul>
            </div>

            <div className="dsc-sources__block">
              <p className="label">Image credits</p>
              <ul className="dsc-credit-list">
                {creditAssets.map((asset) => (
                  <li key={asset.id}>
                    <p className="dsc-credit-list__title">{asset.title}</p>
                    <p className="dsc-credit-list__meta">
                      {asset.creator} · {asset.license}
                    </p>
                    <a
                      className="dsc-credit-list__source mono"
                      href={asset.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source ↗
                    </a>
                  </li>
                ))}
              </ul>
              <p className="dsc-sources__credit-note">
                All image derivatives and licences are registered in the project asset archive. See{' '}
                <Link to="/about#credits">Sources &amp; licences</Link> for the full colophon.
              </p>
            </div>
          </div>

          <details className="dsc-disclosure">
            <summary>
              <span className="label">Bibliography</span>
              <span className="mono">
                {discoveryRefs().length} references · open the list
              </span>
            </summary>
            <div className="dsc-bibliography">
              <div className="dsc-bibliography__head">
                <p className="label">Bibliography</p>
                <p className="mono">
                  {discoveryRefs().length} references · cited in the records above
                </p>
              </div>
              <ReferenceList ids={discoveryRefs()} />
            </div>
          </details>

          <p className="dsc-sources__method">
            The archive is static and local. Search, filtering and the map run in the browser without
            a backend, account or paid map API. Map geometry is Natural Earth 1:110m land, public
            domain.
          </p>
        </div>
      </section>
    </div>
  );
}

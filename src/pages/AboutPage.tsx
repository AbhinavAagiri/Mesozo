import { Link } from 'react-router-dom';
import { assets, references, species } from '../data';
import { researchReferences } from '../data/research-references';
import { NAV } from '../data/nav';
import { PageHeader } from '../components/ui/PageHeader';
import { CorrectionForm } from '../components/CorrectionForm';
import { EvidenceTag } from '../components/ui/EvidenceTag';
import { usePageTitle } from '../lib/usePageTitle';
import { useReveal } from '../lib/useReveal';
import '../styles/pages.css';

const DISTINCTIONS = [
  {
    title: 'Birds are dinosaurs',
    body: 'Birds sit inside the dinosaur family tree, closer to Tyrannosaurus than either is to a crocodile. The non-avian dinosaurs died out 66 million years ago; the avian line did not.',
  },
  {
    title: 'Pterosaurs are not dinosaurs',
    body: 'They are a separate lineage of flying reptiles that shared the Mesozoic with dinosaurs.',
  },
  {
    title: 'Marine reptiles are not dinosaurs',
    body: 'Ichthyosaurs, plesiosaurs and mosasaurs are reptiles adapted to water, not dinosaurs.',
  },
  {
    title: 'Deinonychus is not Velociraptor',
    body: 'Deinonychus antirrhopus is a larger North American dromaeosaur; Velociraptor mongoliensis is a smaller Asian genus. They are relatives, not synonyms.',
  },
  {
    title: 'Spinosaurus is unsettled',
    body: 'Its body, posture and ecology are actively debated. Where the archive describes a hypothesis, it says so.',
  },
];

const TYPE = [
  { name: 'Instrument Serif', role: 'Display, scientific names, statements', licence: 'SIL OFL 1.1' },
  { name: 'Archivo', role: 'Interface and body text', licence: 'SIL OFL 1.1' },
  { name: 'System monospace', role: 'Specimen codes, dates, measurements', licence: 'System font' },
];

export default function AboutPage() {
  usePageTitle('About', {
    description:
      'MESOZO\u2019s scientific standards, distinctions, sourcing method, licences and colophon: an independent prehistoric-life encyclopedia with its working notes left visible.',
  });
  const root = useReveal<HTMLDivElement>();
  const images = assets.filter((asset) => !asset.kind || asset.kind === 'image');
  const referenceCount = references.length + researchReferences.length;

  return (
    <div className="page" ref={root}>
      <PageHeader
        index="R"
        kicker="Reference / About"
        title={
          <>
            A reference work, <em>in the open.</em>
          </>
        }
        intro="MESOZO is an independent scientific encyclopedia of prehistoric life, organised as four connected ways into the record: the animals, the world they lived in, how their bodies worked, and the fossils that support the account."
        meta={[
          { label: 'Collection', value: '2026' },
          { label: 'Dossiers', value: String(species.length) },
          { label: 'References', value: String(referenceCount) },
          { label: 'Standards & limits', value: 'Stated' },
        ]}
      />

      <section className="about shell">
        <div className="about__intro">
          <h2 className="label">01 — What this is</h2>
          <div className="about__intro-body">
            <p className="lead">
              A natural-history museum is a set of arguments arranged in a room. This one is
              arranged as a database: species, classification, deep time, anatomy, and the history
              of the science that keeps changing its mind.
            </p>
            <p>
              The four destinations are not separate products. Explore holds the species and the
              tree that relates them; Prehistoric World supplies the time and place; Anatomy asks
              how the organism worked; Fossil Evidence shows what survives and what has been argued
              from it. Every dossier is a junction between all four.
            </p>
            <p>
              The database is deliberately evidence-led rather than evenly illustrated. Each animal
              has a structured dossier, with its substantive claims sorted into direct fossil
              evidence, reconstruction, inference, contested interpretation or unknown. Where a
              question is unresolved — Spinosaurus is the obvious example — the page says so rather
              than choosing a side. Records without
              a licence-cleared life reconstruction are shown as database plates, not filled with a
              borrowed animal.
            </p>
          </div>
        </div>

        <div className="about__destinations" id="destinations">
          <h2 className="label">02 — Four ways in</h2>
          <div className="about__destination-list">
            {NAV.map((destination) => (
              <Link key={destination.id} to={destination.to} className="about__destination">
                <span className="mono">{destination.index}</span>
                <span className="serif">{destination.label}</span>
                <p>{destination.note}</p>
                <span className="about__destination-open" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="about__evidence" id="evidence">
          <h2 className="label">03 — Evidence key</h2>
          <div className="about__evidence-grid">
            <div>
              <EvidenceTag kind="fossil" />
              <p>Specimens, casts, trace fossils and measured dates. The most direct layer.</p>
            </div>
            <div>
              <EvidenceTag kind="inference" />
              <p>Anatomy read by comparison: joints imply range of motion, teeth imply diet broadly.</p>
            </div>
            <div>
              <EvidenceTag kind="contested" />
              <p>Credible published interpretations disagree; the dossier gives the competing positions.</p>
            </div>
            <div>
              <EvidenceTag kind="unknown" />
              <p>The surviving evidence does not support a responsible conclusion.</p>
            </div>
            <div>
              <EvidenceTag kind="reconstruction" />
              <p>An authored image. It is never cited as if it were a specimen.</p>
            </div>
          </div>
          <p className="about__evidence-note">
            The working key has four claim categories: established evidence, strongly supported
            interpretation, active scientific debate, and unknown or insufficient evidence.
            Reconstruction is a fifth, separate label because an authored image is not a claim about
            the animal — it is a representation of one. The same categories are used in the species
            dossiers, the fossil register and the field guide.
          </p>
        </div>

        <div className="about__distinctions">
          <h2 className="label">04 — Scientific distinctions</h2>
          <ul>
            {DISTINCTIONS.map((item) => (
              <li key={item.title}>
                <h3 className="serif">{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="about__sources" id="sources">
          <h2 className="label">05 — Sourcing</h2>
          <div>
            <p className="lead">
              Dates follow the International Chronostratigraphic Chart. Dossiers cite peer-reviewed
              papers, museum publications and monographs through a structured reference registry.
            </p>
            <p>
              The site does not scrape, invent or auto-publish. There is no news feed and no
              speculative “latest discovery” module. Claims are cited to the literature or
              institution that supports them; where the evidence is incomplete or disputed, the page
              says so. A citation records where a claim can be checked; it does not imply that every
              cited work has been read in full.
            </p>
            <div className="about__source-hierarchy">
              <p className="label">Source hierarchy</p>
              <ol>
                <li>
                  <span className="mono">01</span>
                  Original peer-reviewed research and species descriptions.
                </li>
                <li>
                  <span className="mono">02</span>
                  Subsequent peer-reviewed studies that revise, test or extend the original work.
                </li>
                <li>
                  <span className="mono">03</span>
                  Reputable scientific journals and academic publications.
                </li>
                <li>
                  <span className="mono">04</span>
                  University and museum research publications.
                </li>
                <li>
                  <span className="mono">05</span>
                  Established scientific databases and institutional collections.
                </li>
              </ol>
            </div>
            <p>
              General encyclopedias, popular science articles, fan wikis and unsourced websites are
              not treated as primary evidence. They can identify a subject worth checking, but the
              claim must be verified against the literature or an institutional source. A reference
              is attached near the claim it supports rather than to a whole page.
            </p>
            <a
              className="text-link"
              href="https://stratigraphy.org/chart"
              target="_blank"
              rel="noreferrer"
            >
              International Stratigraphic Chart <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="about__credits" id="credits">
          <h2 className="label">06 — Colophon and licences</h2>
          <div className="about__credits-body">
            <p>
              No prehistoric imagery is generated. Every reconstruction, photograph and diagram is an
              existing work reproduced under the licence recorded below and in the asset registry.
              CC BY-SA works are adapted and shared under the same licence. Unillustrated species use
              the database plate and are never presented as life reconstructions.
            </p>

            <h3 className="visually-hidden" id="image-credit-register">
              Licensed image register
            </h3>
            <ul className="credits-table" aria-labelledby="image-credit-register">
              {images.map((asset) => (
                <li className="credits-row" key={asset.id}>
                  <span className="credits-row__title">{asset.title}</span>
                  <span className="credits-row__creator">{asset.creator}</span>
                  <a
                    className="credits-row__licence mono"
                    href={asset.licenseUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${asset.license} licence for ${asset.title} (opens in a new tab)`}
                  >
                    {asset.license}
                  </a>
                  <a
                    className="credits-row__source mono"
                    href={asset.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Source for ${asset.title} (opens in a new tab)`}
                  >
                    source ↗
                  </a>
                </li>
              ))}
            </ul>

            <p className="about__icon-credit">
              Search-result dinosaur silhouettes are identification glyphs derived from{' '}
              <a href="https://www.phylopic.org/" target="_blank" rel="noreferrer">
                PhyloPic
              </a>{' '}
              artwork. They are not anatomical evidence. Most are CC0.{' '}
              <a
                href="https://www.phylopic.org/images/452d28c2-9f32-49c8-8181-392b2aa66d71"
                target="_blank"
                rel="noreferrer"
              >
                <em>Baryonyx</em> by Alessio Ciaffi
              </a>{' '}
              (
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noreferrer"
              >
                CC BY 4.0
              </a>
              ) and{' '}
              <a
                href="https://www.phylopic.org/images/8615a4b7-52fc-4aaf-89fc-1dac69bc9f7a"
                target="_blank"
                rel="noreferrer"
              >
                <em>Deinonychus</em> by Manabu Sakamoto
              </a>{' '}
              (
              <a
                href="https://creativecommons.org/licenses/by/3.0/"
                target="_blank"
                rel="noreferrer"
              >
                CC BY 3.0
              </a>
              ) are used with attribution. The{' '}
              <em>Suchomimus</em> glyph uses a closely related spinosaurid silhouette.
            </p>

            <div className="about__type">
              <p className="label">Typefaces</p>
              {TYPE.map((font) => (
                <p key={font.name}>
                  <span>{font.name}</span>
                  <span>{font.role}</span>
                  <span className="mono">{font.licence}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="about__tech">
          <h2 className="label">07 — Technical</h2>
          <p>
            A static React encyclopedia. No accounts, no tracking, no paid APIs, no server-dependent
            species pages. Motion is progressive: with{
              ' '
            }<span className="mono">prefers-reduced-motion</span> the scroll sequences, ticker and
            cursor are removed and all content remains.
          </p>
          <Link className="text-link" to="/species">
            Enter the archive <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="about__corrections" id="corrections">
          <h2 className="label">08 — Corrections</h2>
          <div>
            <p className="lead">
              Scientific reference work depends on correction. Report an incorrect statement, a
              broken or unsuitable citation, an attribution problem or an accessibility barrier —
              or propose a species for addition.
            </p>
            <CorrectionForm />
          </div>
        </div>
      </section>
    </div>
  );
}

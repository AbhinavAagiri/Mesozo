import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { DestinationNav } from '../components/layout/DestinationNav';
import { EvidenceKey } from '../components/learning/EvidenceKey';
import {
  discoveryFormationForSpecimen,
  discoveryFormations,
  discoveryLocationForSpecimen,
  discoverySpecimens,
  speciesBySlug,
} from '../data';
import { journalArticles, journalCategoryById } from '../data/journal';
import { NAV } from '../data/nav';
import { usePageTitle } from '../lib/usePageTitle';
import '../styles/pages.css';
import '../styles/destination.css';

const DESTINATION = NAV.find((item) => item.id === 'evidence')!;

const SOURCE_HIERARCHY = [
  {
    title: 'Original peer-reviewed research',
    body: 'Species descriptions, anatomical studies, stratigraphic papers and impact research. The primary literature is the first place a scientific claim should be checked.',
  },
  {
    title: 'Subsequent peer-reviewed studies',
    body: 'Revisions, reanalyses, biomechanical tests and new specimens. A later paper can strengthen, qualify or overturn an earlier interpretation.',
  },
  {
    title: 'Reputable journals and academic publications',
    body: 'Palaeontology, geology and biology journals that apply editorial and peer-review standards. A journal name is not a guarantee; the claim and its evidence still matter.',
  },
  {
    title: 'University and museum publications',
    body: 'Monographs, bulletins, collection catalogues and exhibition research. These can be authoritative, especially for specimens and collections.',
  },
  {
    title: 'Institutional databases and collections',
    body: 'Museum catalogues, palaeobiology databases and stratigraphic charts. They are excellent for records and occurrence data, but not a substitute for reading the supporting paper.',
  },
];

const CLAIM_SEQUENCE = [
  {
    label: '01 · Observed',
    title: 'A physical object',
    body: 'A bone, tooth, footprint, eggshell or geochemical signal. It exists in a collection or in the field, with a provenance and a condition.',
    to: '/learn/how-palaeontologists-work',
    link: 'How a specimen is recorded',
  },
  {
    label: '02 · Described',
    title: 'Anatomy and context',
    body: 'The object is measured, figured, compared and placed in a rock unit. Description is not yet an explanation of behaviour.',
    to: '/learn/how-fossils-form',
    link: 'How fossils are preserved',
  },
  {
    label: '03 · Interpreted',
    title: 'Function or behaviour',
    body: 'Muscle reconstructions, bite models, trackways and comparisons support an inference. The claim should carry its assumptions.',
    to: '/learn/reconstructing-extinct-animals',
    link: 'How reconstruction works',
  },
  {
    label: '04 · Tested',
    title: 'Agreement and disagreement',
    body: 'Other researchers re-examine the material, add specimens or apply new methods. The result may be consensus, revision or a live debate.',
    to: '/learn/dating-fossils',
    link: 'How the record is dated',
  },
];

export default function FossilEvidencePage() {
  usePageTitle('Fossil Evidence: specimens, research and uncertainty', {
    description:
      'How palaeontologists know what they know: specimen records, fieldwork, dating, peer-reviewed research, evidence standards and unresolved questions.',
  });

  const archiveSpecies = Array.from(
    new Set(discoverySpecimens.map((specimen) => specimen.speciesId).filter(Boolean)),
  ).length;
  const totalRefs = journalArticles.length;

  return (
    <div className="page fossil-page">
      <PageHeader
        index="04"
        kicker="Fossil Evidence"
        title={
          <>
            How we know <em>what we know.</em>
          </>
        }
        intro="A conclusion about an extinct animal begins with a physical object and a chain of reasoning. This destination keeps the object, the interpretation and the disagreement in the same view."
        meta={[
          { label: 'Specimens', value: String(discoverySpecimens.length) },
          { label: 'Worlds', value: String(discoveryFormations.length) },
          { label: 'Research notes', value: String(totalRefs) },
        ]}
      />

      <DestinationNav destination={DESTINATION} current="/fossil-evidence" />

      <section className="fossil-thesis" data-theme="dark" aria-labelledby="fossil-thesis-title">
        <div className="shell fossil-thesis__grid">
          <p className="label">The central distinction</p>
          <div>
            <p className="fossil-thesis__statement serif" id="fossil-thesis-title">
              A fossil is not a fact about behaviour.
            </p>
            <p className="fossil-thesis__body">
              It is a physical trace of an organism, often incomplete and always altered by burial
              and time. “This tooth has serrations” is an observation. “This animal hunted large
              prey” is an interpretation built from that observation and others. The archive labels
              the step between them.
            </p>
          </div>
          <div className="fossil-thesis__aside">
            <span className="label">In the archive</span>
            <span className="serif">{discoverySpecimens.length} catalogue records</span>
            <span>{archiveSpecies} species connected to a specimen</span>
            <Link to="/discoveries#archive">
              Open the fossil archive <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="fossil-chain shell" aria-labelledby="fossil-chain-title">
        <div className="explore-section-head">
          <div>
            <p className="label">From object to claim</p>
            <h2 className="serif" id="fossil-chain-title">
              Four steps, not one leap.
            </h2>
          </div>
          <p>
            The sequence is not a conveyor belt. A claim can move backwards when a specimen is
            re-prepared, a publication is challenged, or a new fossil changes the comparison.
          </p>
        </div>

        <ol className="fossil-chain__list">
          {CLAIM_SEQUENCE.map((step) => (
            <li key={step.label} className="fossil-chain__step">
              <span className="fossil-chain__bar" aria-hidden="true" />
              <span className="fossil-chain__label label">{step.label}</span>
              <h3 className="serif">{step.title}</h3>
              <p>{step.body}</p>
              <Link className="text-link" to={step.to}>
                {step.link} <span aria-hidden="true">↗</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="fossil-key-section" aria-labelledby="fossil-key-title">
        <div className="shell">
          <div className="fossil-key-section__head">
            <div>
              <p className="label">The evidence key</p>
              <h2 className="serif" id="fossil-key-title">
                Strength is not the same as certainty.
              </h2>
            </div>
            <p>
              The key below is used across the species dossiers and the field guide. It describes
              the status of a claim, not the confidence of the person making it.
            </p>
          </div>
          <EvidenceKey />
        </div>
      </section>

      <section className="fossil-ledger shell" id="ledger" aria-labelledby="fossil-ledger-title">
        <div className="fossil-ledger__head">
          <div>
            <p className="label">Specimen register</p>
            <h2 className="serif" id="fossil-ledger-title">
              The objects behind the names.
            </h2>
          </div>
          <p>
            {discoverySpecimens.length} catalogue records are currently linked to an ancient
            world. More species exist in the archive than in this specimen register; the absence of
            a record is a coverage limit, not evidence that no fossil exists.
          </p>
        </div>

        <div className="fossil-ledger__table">
          <div className="fossil-ledger__row fossil-ledger__row--head">
            <span>Record</span>
            <span>Organism</span>
            <span>Formation</span>
            <span>Type</span>
            <span>Open</span>
          </div>
          {discoverySpecimens.map((specimen) => {
            const item = speciesBySlug.get(specimen.speciesId);
            const formation = discoveryFormationForSpecimen(specimen);
            const location = discoveryLocationForSpecimen(specimen);
            return (
              <div className="fossil-ledger__row" key={specimen.id}>
                <span className="serif">{specimen.identifier}</span>
                <span>
                  {item?.scientificName ?? specimen.speciesId}
                  {location ? <small>{location.label}</small> : null}
                </span>
                <span>{formation?.name ?? 'Not stated'}</span>
                <span>{specimen.typeStatus}</span>
                <Link to={`/discoveries/specimen/${specimen.id}`}>
                  Open <span aria-hidden="true">↗</span>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="fossil-research" aria-labelledby="fossil-research-title">
        <div className="shell">
          <div className="explore-section-head">
            <div>
              <p className="label">Research & field notes</p>
              <h2 className="serif" id="fossil-research-title">
                Arguments followed to their sources.
              </h2>
            </div>
            <p>
              These notes are the archive’s working essays. Each one links to species, specimens,
              periods and the literature behind the claim.
            </p>
          </div>

          <div className="fossil-research__list">
            {journalArticles.map((article, index) => (
              <Link
                className="fossil-research__item"
                to={`/journal/${article.slug}`}
                key={article.id}
                data-cursor="link"
              >
                <span className="fossil-research__index mono">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="fossil-research__body">
                  <span className="label">
                    {journalCategoryById.get(article.category)?.label ?? article.category} ·{' '}
                    {article.readingMinutes} min
                  </span>
                  <span className="serif">{article.headline}</span>
                  <span>{article.standfirst}</span>
                </span>
                <span className="fossil-research__arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>
          <Link className="text-link" to="/journal">
            Open Research & Field Notes <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="fossil-standards shell" id="standards" aria-labelledby="fossil-standards-title">
        <div className="fossil-standards__grid">
          <div className="fossil-standards__intro">
            <p className="label">Standards</p>
            <h2 className="serif" id="fossil-standards-title">
              What counts as a source here.
            </h2>
            <p>
              MESOZO does not treat general encyclopedias, fan wikis or unsourced web pages as
              primary evidence. They can help identify a question, but the claim must be checked
              against research or an institutional record.
            </p>
            <Link className="text-link" to="/about#sources">
              Read the full sourcing statement <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <ol className="fossil-standards__list">
            {SOURCE_HIERARCHY.map((item, index) => (
              <li key={item.title}>
                <span className="fossil-standards__num mono">0{index + 1}</span>
                <div>
                  <h3 className="serif">{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="fossil-standards__note">
          <p>
            A citation records where a claim can be checked. It does not mean every sentence on a
            page rests on the same source, and it does not prove that the cited work is correct. Where
            a claim cannot be verified, it belongs in a correction queue or an uncertainty note — not
            in the confident voice of the archive.
          </p>
          <div>
            <Link className="text-link" to="/about#corrections">
              Report a correction <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" to="/discoveries#sources">
              Discovery archive references <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="fossil-cta shell">
        <div>
          <p className="label">Continue</p>
          <h2 className="serif">Follow a specimen into its world.</h2>
        </div>
        <div className="fossil-cta__links">
          <Link to="/discoveries" className="explore-gates__cta">
            <span className="label">The archive</span>
            <span className="serif">Fossil record</span>
            <span aria-hidden="true">↗</span>
          </Link>
          <Link to="/prehistoric-world" className="explore-gates__cta explore-gates__cta--quiet">
            <span className="label">The context</span>
            <span className="serif">Prehistoric World</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { AssetImage } from '../components/ui/AssetImage';
import { PageHeader } from '../components/ui/PageHeader';
import { DestinationNav } from '../components/layout/DestinationNav';
import { GuideLink } from '../components/learning/GuideLink';
import { families, groups, species } from '../data';
import { learningPaths, learningTopics } from '../data/learning';
import { NAV } from '../data/nav';
import { usePageTitle } from '../lib/usePageTitle';
import '../styles/pages.css';
import '../styles/destination.css';

const DESTINATION = NAV.find((item) => item.id === 'explore')!;

const BRANCHES = [
  {
    key: 'Theropoda',
    label: 'Theropods',
    note: 'Mostly bipedal dinosaurs, including birds and the large predatory lineages.',
  },
  {
    key: 'Sauropodomorpha',
    label: 'Sauropodomorphs',
    note: 'The long-necked branch, from small early relatives to the largest land animals.',
  },
  {
    key: 'Ornithischia',
    label: 'Ornithischians',
    note: 'Stegosaurs, ankylosaurs, ceratopsians, hadrosaurs and their relatives.',
  },
  {
    key: 'Saurischia',
    label: 'Basal saurischians',
    note: 'Early branches retained in the archive where classification is unsettled.',
  },
];

const LOOKUP_IMAGE = 'spinosaurus-living';
const SECOND_IMAGE = 'tyrannosaurus-living';

export default function ExplorePage() {
  usePageTitle('Explore the prehistoric life archive', {
    description:
      'Enter the MESOZO encyclopedia through 113 species dossiers, the classification tree, curated learning paths and a linked glossary of scientific terms.',
  });

  const featured = species.filter((item) => item.featured).slice(0, 4);

  return (
    <div className="page explore-page">
      <PageHeader
        index="01"
        kicker="Explore"
        title={
          <>
            The record, <em>open at any page.</em>
          </>
        }
        intro="Start with an animal, a branch of the family tree, a question you have never asked, or a term you have seen but never had explained. Every route leads back to the same evidence."
        meta={[
          { label: 'Dossiers', value: String(species.length) },
          { label: 'Families', value: String(families.length) },
          { label: 'Field guides', value: String(learningTopics.length) },
        ]}
      />

      <DestinationNav destination={DESTINATION} current="/explore" />

      <section className="explore-gates shell" aria-labelledby="explore-gates-title">
        <div className="explore-gates__main">
          <p className="label">The collection</p>
          <h2 className="explore-gates__title serif" id="explore-gates-title">
            Begin with a specimen, or with the question behind it.
          </h2>
          <p className="explore-gates__intro">
            The species archive is the centre of MESOZO: a working catalogue of non-avian
            dinosaurs, each record stating what the fossils preserve and what researchers infer.
            The field guide is the way in if the terminology is new.
          </p>
          <div className="explore-gates__actions">
            <Link className="explore-gates__cta" to="/species">
              <span className="label">Open the archive</span>
              <span className="serif">Search all {species.length} dossiers</span>
              <span aria-hidden="true">↗</span>
            </Link>
            <Link className="explore-gates__cta explore-gates__cta--quiet" to="/learn">
              <span className="label">New to the subject</span>
              <span className="serif">Start with the field guide</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        <div className="explore-gates__specimens">
          <Link to="/species/spinosaurus" className="explore-gates__figure" data-cursor="view">
            <div>
              <AssetImage
                id={LOOKUP_IMAGE}
                alt="Life reconstruction of Spinosaurus aegyptiacus."
                sizes="(max-width: 900px) 90vw, 28vw"
                fit="contain"
              />
            </div>
            <span className="label">01 · A contested animal</span>
            <span className="serif">Spinosaurus aegyptiacus</span>
          </Link>
          <Link to="/species/tyrannosaurus" className="explore-gates__figure" data-cursor="view">
            <div>
              <AssetImage
                id={SECOND_IMAGE}
                alt="Life reconstruction of Tyrannosaurus rex."
                sizes="(max-width: 900px) 90vw, 22vw"
                fit="contain"
              />
            </div>
            <span className="label">02 · A familiar skeleton</span>
            <span className="serif">Tyrannosaurus rex</span>
          </Link>
          <p className="explore-gates__caption">
            Two records, two different evidential situations. The archive does not make them look
            equally complete.
          </p>
        </div>
      </section>

      <section className="explore-register shell" aria-labelledby="explore-register-title">
        <div className="explore-register__head">
          <p className="label">The shape of the collection</p>
          <h2 className="serif" id="explore-register-title">
            {species.length} records, arranged by relationship.
          </h2>
          <p>
            Classification is not a separate destination from species discovery. It is the map that
            tells you what you are looking at. Select a branch, or open the full tree.
          </p>
        </div>

        <div className="explore-register__stats" aria-label="Collection statistics">
          <div>
            <span className="explore-register__number serif">{species.length}</span>
            <span className="label">Dossiers</span>
          </div>
          <div>
            <span className="explore-register__number serif">{families.length}</span>
            <span className="label">Families</span>
          </div>
          <div>
            <span className="explore-register__number serif">{groups.length}</span>
            <span className="label">Major branches</span>
          </div>
          <div>
            <span className="explore-register__number serif">3</span>
            <span className="label">Periods</span>
          </div>
        </div>

        <div className="explore-register__branches">
          {BRANCHES.map((branch) => {
            const count = species.filter((item) => item.groupKey === branch.key).length;
            return (
              <Link
                key={branch.key}
                to={`/species?group=${encodeURIComponent(branch.key)}`}
                className="explore-branch"
                data-cursor="link"
              >
                <span className="explore-branch__bar" aria-hidden="true" />
                <span className="explore-branch__count mono">{count}</span>
                <span className="explore-branch__name serif">{branch.label}</span>
                <span className="explore-branch__note">{branch.note}</span>
                <span className="explore-branch__arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            );
          })}
          <Link className="explore-branch explore-branch--tree" to="/classification">
            <span className="explore-branch__bar" aria-hidden="true" />
            <span className="explore-branch__count mono">↗</span>
            <span className="explore-branch__name serif">The whole tree</span>
            <span className="explore-branch__note">
              Open the classification explorer and follow any branch into its dossiers.
            </span>
          </Link>
        </div>
      </section>

      <section className="explore-paths" aria-labelledby="explore-paths-title">
        <div className="shell">
          <div className="explore-section-head">
            <div>
              <p className="label">Curated routes</p>
              <h2 className="serif" id="explore-paths-title">
                Not sure what to look for?
              </h2>
            </div>
            <p>
              Each path is a sequence of real pages — guides, species, formations and evidence — not
              a course with a certificate at the end. Take a step, leave, come back.
            </p>
          </div>

          <div className="explore-paths__list">
            {learningPaths.map((path, index) => (
              <Link
                className="explore-path"
                to={`/learn/paths/${path.id}`}
                key={path.id}
                data-cursor="link"
              >
                <span className="explore-path__index mono">{String(index + 1).padStart(2, '0')}</span>
                <span className="explore-path__body">
                  <span className="explore-path__kicker label">{path.kicker}</span>
                  <span className="explore-path__title serif">{path.title}</span>
                  <span className="explore-path__desc">{path.description}</span>
                </span>
                <span className="explore-path__meta mono">
                  {path.steps.length} steps · {path.minutes} min
                </span>
                <span className="explore-path__arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="explore-guides shell" aria-labelledby="explore-guides-title">
        <div className="explore-section-head">
          <div>
            <p className="label">Field guide</p>
            <h2 className="serif" id="explore-guides-title">
              The ideas behind the labels.
            </h2>
          </div>
          <p>
            Short explanations of the concepts the archive uses: what a clade is, how a fossil is
            dated, why a mass estimate is a model, and where a behaviour claim stops being evidence.
          </p>
        </div>

        <div className="explore-guides__grid">
          {learningTopics.slice(0, 6).map((topic, index) => (
            <GuideLink
              key={topic.id}
              index={index}
              link={{
                label: topic.title,
                to: `/learn/${topic.slug}`,
                note: topic.standfirst,
              }}
            />
          ))}
        </div>
        <div className="explore-guides__foot">
          <Link className="text-link" to="/learn">
            All {learningTopics.length} field guides <span aria-hidden="true">↗</span>
          </Link>
          <Link className="text-link" to="/glossary">
            Open the glossary <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="explore-featured shell" aria-labelledby="explore-featured-title">
        <p className="label">A place to begin</p>
        <div className="explore-featured__head">
          <h2 className="serif" id="explore-featured-title">
            Four records to begin with.
          </h2>
          <p>
            Not a ranking. They show different kinds of evidence and different degrees of
            completeness, which makes them useful starting points for learning how a dossier is
            built.
          </p>
        </div>
        <div className="explore-featured__list">
          {featured.map((item) => (
            <Link key={item.slug} to={`/species/${item.slug}`} data-cursor="view">
              <span className="label">{item.periodLabel}</span>
              <span className="serif">{item.scientificName}</span>
              <span>{item.commonName}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { DestinationNav } from '../components/layout/DestinationNav';
import { GuideLink } from '../components/learning/GuideLink';
import {
  LEARNING_TRACKS,
  learningPaths,
  learningTopics,
  learningTopicsForTrack,
} from '../data/learning';
import { NAV } from '../data/nav';
import { usePageTitle } from '../lib/usePageTitle';
import '../styles/pages.css';
import '../styles/destination.css';
import '../styles/learning.css';

const DESTINATION = NAV.find((item) => item.id === 'explore')!;

export default function LearnPage() {
  usePageTitle('Field guide: learn how to read prehistoric life', {
    description:
      'Fifteen source-linked guides to dinosaurs, anatomy, deep time, fossils and scientific evidence, plus curated learning paths through the MESOZO archive.',
  });

  return (
    <div className="page learn-page">
      <PageHeader
        index="01.3"
        kicker="Explore / Field guide"
        title={
          <>
            Learn to read <em>the record.</em>
          </>
        }
        intro="These guides explain the ideas the encyclopedia depends on. They are written for a visitor with no prior palaeontology, and they keep the technical terms because those terms are part of the science."
        meta={[
          { label: 'Guides', value: String(learningTopics.length) },
          { label: 'Paths', value: String(learningPaths.length) },
          { label: 'Subject areas', value: String(LEARNING_TRACKS.length) },
        ]}
      />

      <DestinationNav destination={DESTINATION} current="/learn" />

      <section className="learn-intro shell" aria-labelledby="learn-intro-title">
        <div className="learn-intro__rail">
          <p className="label">How to use this</p>
          <p className="mono">Read → follow → return</p>
        </div>
        <div className="learn-intro__copy">
          <h2 className="serif" id="learn-intro-title">
            A guide is a way of looking, not a lesson to finish.
          </h2>
          <p>
            Each page introduces a concept, names the evidence behind it and links to real specimens
            and dossiers. Terms in the text point to the glossary. A guide can be read in five
            minutes; the archive behind it can take much longer.
          </p>
          <div className="learn-intro__actions">
            <Link className="text-link" to="/glossary">
              Open the glossary <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" to="/species">
              Go straight to the species archive <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="learn-paths" aria-labelledby="learn-paths-title">
        <div className="shell">
          <div className="explore-section-head">
            <div>
              <p className="label">Curated routes</p>
              <h2 className="serif" id="learn-paths-title">
                Five ways through the archive.
              </h2>
            </div>
            <p>
              Paths do not lock content or track progress. They are editorial sequences for a
              visitor who wants a coherent route rather than a search box.
            </p>
          </div>

          <div className="learn-paths__list">
            {learningPaths.map((path, index) => (
              <Link
                className="learn-path-row"
                key={path.id}
                to={`/learn/paths/${path.id}`}
                data-cursor="link"
              >
                <span className="learn-path-row__num mono">{String(index + 1).padStart(2, '0')}</span>
                <span className="learn-path-row__body">
                  <span className="label">{path.kicker}</span>
                  <span className="learn-path-row__title serif">{path.title}</span>
                  <span className="learn-path-row__desc">{path.description}</span>
                </span>
                <span className="learn-path-row__meta mono">
                  {path.steps.length} steps · {path.minutes} min
                </span>
                <span className="learn-path-row__arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="learn-topics shell" aria-labelledby="learn-topics-title">
        <div className="explore-section-head">
          <div>
            <p className="label">The guides</p>
            <h2 className="serif" id="learn-topics-title">
              Choose a question.
            </h2>
          </div>
          <p>
            The guides are grouped by the kind of problem they solve. Some explain a definition;
            others explain how a claim is built or how a geological boundary is dated.
          </p>
        </div>

        {LEARNING_TRACKS.map((track) => (
          <div className="learn-track" key={track.id}>
            <div className="learn-track__head">
              <p className="label">{track.label}</p>
              <p>{track.description}</p>
            </div>
            <div className="learn-track__list">
              {learningTopicsForTrack(track.id).map((topic) => (
                <GuideLink
                  key={topic.id}
                  link={{
                    label: topic.title,
                    to: `/learn/${topic.slug}`,
                    note: topic.standfirst,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="learn-cta" data-theme="dark">
        <div className="shell learn-cta__grid">
          <div>
            <p className="label">The connected record</p>
            <h2 className="serif">Every explanation has an exhibit behind it.</h2>
          </div>
          <div className="learn-cta__links">
            <Link to="/anatomy">
              <span className="serif">Anatomy & Biology</span>
              <span className="mono">Skeletons, function, inference ↗</span>
            </Link>
            <Link to="/prehistoric-world">
              <span className="serif">Prehistoric World</span>
              <span className="mono">Time, climate, formations ↗</span>
            </Link>
            <Link to="/fossil-evidence">
              <span className="serif">Fossil Evidence</span>
              <span className="mono">Specimens, research, uncertainty ↗</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

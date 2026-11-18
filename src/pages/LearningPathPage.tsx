import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { DestinationNav } from '../components/layout/DestinationNav';
import { getLearningPath, learningPaths } from '../data/learning';
import { NAV } from '../data/nav';
import { usePageTitle } from '../lib/usePageTitle';
import '../styles/pages.css';
import '../styles/destination.css';
import '../styles/learning.css';

const DESTINATION = NAV.find((item) => item.id === 'explore')!;

const KIND_LABEL: Record<string, string> = {
  guide: 'Field guide',
  species: 'Species dossier',
  world: 'Ancient world',
  anatomy: 'Anatomical atlas',
  evidence: 'Evidence archive',
};

export default function LearningPathPage() {
  const { id } = useParams();
  const path = getLearningPath(id);
  usePageTitle(path ? path.title : 'Learning path not found', {
    description: path ? path.description : 'This learning path is not in the MESOZO field guide.',
    noindex: !path,
  });

  if (!path) {
    return (
      <div className="page notfound shell">
        <p className="label">404 — Not a path</p>
        <h1 className="serif">This learning path does not exist.</h1>
        <Link className="text-link" to="/learn">
          Back to the field guide <span aria-hidden="true">↗</span>
        </Link>
      </div>
    );
  }

  const pathIndex = learningPaths.findIndex((item) => item.id === path.id);
  const nextPath = learningPaths[(pathIndex + 1) % learningPaths.length];

  return (
    <div className="page path-page">
      <PageHeader
        index="01.3"
        kicker={`Explore / Learning path · ${path.kicker}`}
        title={path.title}
        intro={path.description}
        meta={[
          { label: 'Steps', value: String(path.steps.length) },
          { label: 'Reading', value: `${path.minutes} min` },
          { label: 'Audience', value: path.audience },
        ]}
      />

      <DestinationNav destination={DESTINATION} current="/learn" />

      <section className="path-intro shell" aria-labelledby="path-intro-title">
        <div>
          <p className="label">The route</p>
          <h2 className="serif" id="path-intro-title">
            Follow the argument, not a syllabus.
          </h2>
        </div>
        <p>
          Every step opens a page that already exists in MESOZO. You can leave the path at any point,
          follow a citation, or return to the previous step. Nothing is gated and no account is
          required.
        </p>
      </section>

      <section className="path-steps shell" aria-label={`Steps in ${path.title}`}>
        <ol>
          {path.steps.map((step, index) => (
            <li className="path-step" key={`${step.to}-${index}`}>
              <div className="path-step__rail">
                <span className="path-step__number mono">{String(index + 1).padStart(2, '0')}</span>
                <span className="path-step__line" aria-hidden="true" />
              </div>
              <div className="path-step__copy">
                <p className="label">
                  {step.label} · {KIND_LABEL[step.kind]}
                </p>
                <h2 className="serif">{step.title}</h2>
                <p>{step.body}</p>
                <Link className="path-step__open" to={step.to} data-cursor="link">
                  Open this step <span aria-hidden="true">↗</span>
                </Link>
              </div>
              <span className="path-step__kind mono">{KIND_LABEL[step.kind]}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="path-after shell" aria-labelledby="path-after-title">
        <div className="path-after__main">
          <p className="label">After the path</p>
          <h2 className="serif" id="path-after-title">
            The record is wider than the route.
          </h2>
          <p>
            A path is a curated selection, not a complete account. The species archive, Deep Time and
            the fossil register contain material this route does not visit.
          </p>
          <div className="path-after__links">
            <Link className="text-link" to="/species">
              Search the species archive <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" to="/prehistoric-world">
              Explore the prehistoric world <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" to="/fossil-evidence">
              Read the evidence standards <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <Link className="path-next" to={`/learn/paths/${nextPath.id}`} data-cursor="link">
          <span className="label">Another path</span>
          <span className="serif">{nextPath.title}</span>
          <span className="mono">
            {nextPath.steps.length} steps · {nextPath.minutes} min
          </span>
          <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <section className="path-index shell" aria-labelledby="path-index-title">
        <p className="label" id="path-index-title">
          All learning paths
        </p>
        <div>
          {learningPaths.map((item, index) => (
            <Link
              key={item.id}
              to={`/learn/paths/${item.id}`}
              className={item.id === path.id ? 'is-current' : undefined}
              aria-current={item.id === path.id ? 'page' : undefined}
            >
              <span className="mono">{String(index + 1).padStart(2, '0')}</span>
              <span className="serif">{item.title}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

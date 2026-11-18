import { Link } from 'react-router-dom';
import { discoveries } from '../../data';
import { useReveal } from '../../lib/useReveal';

const KIND_LABEL: Record<string, string> = {
  discovery: 'Discovery',
  publication: 'Publication',
  interpretation: 'Interpretation',
  extinction: 'Extinction',
};

export function DiscoveryBand() {
  const rows = [...discoveries].sort((a, b) => a.year - b.year).slice(0, 6);
  const root = useReveal<HTMLElement>();

  return (
    <section className="discoveries section" id="discoveries" ref={root}>
      <div className="shell">
        <div className="section-head">
          <p className="section-head__index">
            <span className="label">05</span>
            <span className="label">Discoveries</span>
          </p>
          <h2 className="section-head__title" data-line>
            <span>How we came to know.</span>
          </h2>
          <div className="section-head__aside">
            <p>
              A quarry, a jaw, a name in a journal. These are the moments when the fossil record
              became evidence, each with the publication that carries it.
            </p>
          </div>
        </div>

        <ol className="discovery-list">
          {rows.map((item) => (
            <li key={item.id} data-reveal>
              <Link
                className="discovery-row"
                to={`/discoveries#${item.id}`}
                data-cursor="link"
              >
                <span className="discovery-row__year mono">{item.year}</span>
                <span className="discovery-row__main">
                  <span className="discovery-row__title serif">{item.title}</span>
                  <span className="discovery-row__summary">{item.summary}</span>
                </span>
                <span className="discovery-row__meta">
                  <span className="label">{KIND_LABEL[item.kind]}</span>
                  <span className="mono">{item.subject}</span>
                </span>
                <span className="discovery-row__arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <div className="discoveries__foot">
          <Link className="text-link" to="/discoveries" data-cursor="link">
            Read the discovery archive <span aria-hidden="true">↗</span>
          </Link>
          <p className="mono">Curated, dated and cited — not a live news feed.</p>
        </div>
      </div>
    </section>
  );
}

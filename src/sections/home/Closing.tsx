import { Link } from 'react-router-dom';
import { useReveal } from '../../lib/useReveal';

export function Closing() {
  const root = useReveal<HTMLElement>();

  return (
    <section className="closing" id="closing" ref={root} data-theme="dark">
      <div className="closing__strata" aria-hidden="true" />
      <div className="shell closing__inner">
        <p className="eyebrow closing__eyebrow">The world before us</p>

        <h2 className="closing__statement serif">
          <span data-line>
            <span>The world we inhabit</span>
          </span>{' '}
          <span data-line>
            <span>was shaped by a world</span>
          </span>{' '}
          <span data-line>
            <span>
              we will <em>never see.</em>
            </span>
          </span>
        </h2>

        <div className="closing__foot">
          <p className="closing__note">
            MESOZO is an independent scientific reference project. It does not invent specimens,
            dates or citations; where the science is unsettled, the page says so.
          </p>
          <div className="closing__actions">
            <Link className="closing__cta" to="/species" data-cursor="link">
              <span>Enter the archive</span>
              <span className="closing__cta-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
            <Link className="closing__journal" to="/journal" data-cursor="link">
              Research & field notes <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { usePageTitle } from '../lib/usePageTitle';
import '../styles/pages.css';

export default function NotFound() {
  usePageTitle('Page not found', { noindex: true, canonical: false });

  return (
    <div className="page notfound shell">
      <p className="label">404 — Outside the map</p>
      <h1 className="serif">
        This stratum does not <em>exist.</em>
      </h1>
      <p className="lead">
        The address does not match a page in this edition. The archive is still open.
      </p>
      <div className="notfound__links">
        <Link className="text-link" to="/">
          Return to the encyclopedia <span aria-hidden="true">↗</span>
        </Link>
        <Link className="text-link" to="/species">
          Browse the species archive <span aria-hidden="true">↗</span>
        </Link>
        <Link className="text-link" to="/prehistoric-world">
          Enter the prehistoric world <span aria-hidden="true">↗</span>
        </Link>
        <Link className="text-link" to="/learn">
          Read the field guide <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  );
}

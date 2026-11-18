import { Link } from 'react-router-dom';
import { species } from '../../data';

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { label: 'Species archive', to: '/species' },
      { label: 'Classification', to: '/classification' },
      { label: 'Field guide', to: '/learn' },
      { label: 'Glossary', to: '/glossary' },
    ],
  },
  {
    title: 'World & biology',
    links: [
      { label: 'Prehistoric World', to: '/prehistoric-world' },
      { label: 'Deep Time', to: '/deep-time' },
      { label: 'Ancient worlds', to: '/prehistoric-world#worlds' },
      { label: 'Anatomy & Biology', to: '/anatomy' },
      { label: 'How dinosaurs moved', to: '/learn/how-dinosaurs-moved' },
    ],
  },
  {
    title: 'Evidence & standards',
    links: [
      { label: 'Fossil Evidence', to: '/fossil-evidence' },
      { label: 'Fossil archive', to: '/discoveries' },
      { label: 'Research & field notes', to: '/journal' },
      { label: 'About MESOZO', to: '/about' },
      { label: 'Sources & licences', to: '/about#credits' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="footer" data-theme="dark">
      <div className="shell">
        <div className="footer__top">
          <div className="footer__lead">
            <p className="eyebrow footer__eyebrow">Independent reference · 2026</p>
            <p className="footer__statement serif">
              A record of the world before us, kept in the open.
            </p>
            <Link className="footer__cta" to="/explore" data-cursor="link">
              <span>Find a way into the encyclopedia</span>
              <span className="footer__cta-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
            <p className="footer__count mono">{species.length} dossiers · 4 destinations · 1 record</p>
          </div>

          <div className="footer__columns">
            {COLUMNS.map((column) => (
              <nav className="footer__column" key={column.title} aria-label={column.title}>
                <p className="label">{column.title}</p>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} data-cursor="link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="footer__wordmark" aria-hidden="true" />

        <div className="footer__base">
          <span>© 2026 MESOZO · Independent scientific reference</span>
          <span className="footer__credit">
            <a
              href="https://abhinavaagiri.com"
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
            >
              ~ Abhinav Aagiri ~
            </a>
          </span>
          <nav className="footer__base-links" aria-label="Site information">
            <Link to="/about#corrections" data-cursor="link">
              Corrections <span aria-hidden="true">↗</span>
            </Link>
            <Link to="/privacy" data-cursor="link">
              Privacy
            </Link>
            <Link to="/terms" data-cursor="link">
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { NAV, navItemIsActive } from '../../data/nav';
import { SailMark } from '../brand/SailMark';

type Props = {
  menuOpen: boolean;
  onMenu: () => void;
  onSearch: () => void;
  onSearchIntent: () => void;
};

export function SiteHeader({ menuOpen, onMenu, onSearch, onSearchIntent }: Props) {
  const [lifted, setLifted] = useState(false);
  const [dark, setDark] = useState(false);
  const [pastOpening, setPastOpening] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let frame = 0;

    const probe = () => {
      const header = document.querySelector<HTMLElement>('.header');
      const headerBottom = header?.getBoundingClientRect().bottom ?? 58;
      setLifted(window.scrollY > 20);

      // The protected opening occupies the first screen plus its pinned
      // reconstruction. The masthead adopts the reference treatment only once
      // the next section reaches it; the opening itself is never restyled.
      const nextSectionTop = document.getElementById('deep-time')?.getBoundingClientRect().top;
      const openingComplete = nextSectionTop !== undefined && nextSectionTop < headerBottom + 42;
      setPastOpening(openingComplete || window.scrollY > window.innerHeight * 2.28);

      // Look just below the masthead so a dark section that begins under the
      // bar adopts its treatment immediately rather than after another scroll.
      const probe = headerBottom + 24;
      const under = [...document.querySelectorAll<HTMLElement>('[data-theme="dark"]')].some(
        (el) => {
          const rect = el.getBoundingClientRect();
          return rect.top <= probe && rect.bottom > probe;
        },
      );
      setDark(under);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        probe();
      });
    };

    probe();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Lazy route chunks mount their hero after the navigation effect. Watch the
    // page instead of leaving the transparent masthead in its light-on-light
    // state until the first scroll.
    const page = document.querySelector('main');
    const observer = page
      ? new MutationObserver(onScroll)
      : null;
    observer?.observe(page!, { childList: true, subtree: true });

    // Keep a short fallback for fonts/images that change the first section's
    // measured height after insertion.
    const settleTimers = [80, 450].map((delay) => window.setTimeout(onScroll, delay));
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      observer?.disconnect();
      settleTimers.forEach((timer) => window.clearTimeout(timer));
    };
    // A new route can begin on a dark section at the same scroll position, so
    // recompute the header treatment when the location changes, not only on
    // the next scroll event.
  }, [location.pathname, location.key]);

  return (
    <header
      className="header"
      data-lifted={lifted}
      data-dark={dark}
      data-open={menuOpen}
      data-home={location.pathname === '/' && !pastOpening}
      data-past-opening={pastOpening}
    >
      <div className="header__brand">
        <Link className="wordmark" to="/" aria-label="MESOZO — home">
          <SailMark className="wordmark__mark" />
          <span className="wordmark__text">Mesozo</span>
        </Link>
        <p className="header__tagline mono">The prehistoric life database</p>
      </div>

      <nav className="nav nav--destinations" aria-label="Primary destinations">
        {NAV.map((item) => {
          const active = navItemIsActive(item, location.pathname);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`nav__link${active ? ' is-active' : ''}`}
              aria-current={active ? 'page' : undefined}
              data-cursor="link"
            >
              <span className="nav__index mono">{item.index}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="header__utils">
        <button
          type="button"
          className="header__search"
          onClick={onSearch}
          onMouseEnter={onSearchIntent}
          onFocus={onSearchIntent}
          aria-label="Search the encyclopedia"
          aria-keyshortcuts="/ Control+K"
          data-cursor="link"
        >
          <span className="header__search-mark" aria-hidden="true">
            <SearchIcon size={15} strokeWidth={2} />
          </span>
          <span className="header__search-label">Search</span>
          <span className="header__search-key mono" aria-hidden="true">
            /
          </span>
        </button>
        <span className="header__issue mono">
          {location.pathname === '/' ? 'Collection / 2026' : 'Reference / 2026'}
        </span>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={onMenu}
        >
          <span className="menu-toggle__label">{menuOpen ? 'Close' : 'Index'}</span>
          <span className="menu-toggle__icon" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </div>
    </header>
  );
}

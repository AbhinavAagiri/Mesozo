import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV, SECONDARY_NAV, navItemIsActive } from '../../data/nav';
import { getLenis } from '../../lib/useSmoothScroll';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MenuOverlay({ open, onClose }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    document.body.classList.toggle('is-locked', open);
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open]);

  // Keep the page beneath the index out of the tab order while it is open.
  // The masthead remains available because it contains the close control.
  useEffect(() => {
    if (!open) return;
    const main = document.getElementById('main');
    const footer = document.querySelector<HTMLElement>('.footer');
    if (main) main.inert = true;
    if (footer) footer.inert = true;
    return () => {
      if (main) main.inert = false;
      if (footer) footer.inert = false;
    };
  }, [open]);

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const focusable = () => {
      const nodes = Array.from(
        rootRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
      ).filter((node) => node.tabIndex >= 0 && node.getBoundingClientRect().width > 0);
      const toggle = document.querySelector<HTMLElement>('.menu-toggle');
      if (toggle) nodes.push(toggle);
      return nodes;
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;

      const nodes = focusable();
      if (!nodes.length) return;
      event.preventDefault();
      const current = nodes.indexOf(document.activeElement as HTMLElement);
      const next = event.shiftKey
        ? (current <= 0 ? nodes.length : current) - 1
        : (current + 1) % nodes.length;
      nodes[next]?.focus({ preventScroll: true });
    };
    window.addEventListener('keydown', onKey);
    const first = rootRef.current?.querySelector<HTMLAnchorElement>('.menu__item');
    first?.focus({ preventScroll: true });
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Return focus to the toggle when the overlay closes, so keyboard users are
  // not left inside a hidden panel.
  useEffect(() => {
    if (open) return;
    const active = document.activeElement;
    if (active && rootRef.current?.contains(active)) {
      document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus({ preventScroll: true });
    }
  }, [open]);

  return (
    <div
      className="menu"
      id="site-menu"
      data-open={open}
      aria-hidden={!open}
      inert={!open}
      ref={rootRef}
    >
      <div className="menu__panel">
        <div className="menu__head shell">
          <span className="label">Collection index</span>
          <span className="label">MESOZO — 2026</span>
        </div>

        <nav className="menu__nav shell" aria-label="Site index">
          {NAV.map((item, index) => {
            const active = navItemIsActive(item, location.pathname);
            return (
              <Link
                key={item.to}
                className={`menu__item${active ? ' is-active' : ''}`}
                to={item.to}
                onClick={onClose}
                tabIndex={open ? 0 : -1}
                aria-current={active ? 'page' : undefined}
                data-cursor="link"
                style={{ ['--i' as string]: index }}
              >
                <span className="menu__num mono">{item.index}</span>
                <span className="menu__mask">
                  <span className="menu__label serif">{item.label}</span>
                </span>
                <span className="menu__note label">{item.note}</span>
              </Link>
            );
          })}
        </nav>

        <div className="menu__foot shell">
          <div>
            <p className="label">A prehistoric life database</p>
            <nav className="menu__secondary" aria-label="Secondary navigation">
              {SECONDARY_NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  tabIndex={open ? 0 : -1}
                  data-cursor="link"
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/glossary" onClick={onClose} tabIndex={open ? 0 : -1} data-cursor="link">
                Glossary
              </Link>
            </nav>
          </div>
          <p className="menu__foot-note mono">
            Four ways into one interconnected record: life, world, body and evidence.
          </p>
        </div>
      </div>
    </div>
  );
}

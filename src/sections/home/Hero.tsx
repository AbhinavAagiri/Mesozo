import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Link } from 'react-router-dom';
import { species } from '../../data';
import { gsap } from '../../lib/gsap';
import { getLenis } from '../../lib/useSmoothScroll';
import { useReducedMotion } from '../../lib/useReducedMotion';

const SpinoStage = lazy(() => import('./SpinoStage'));

class StageBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef(0);
  const fossilTriggerRef = useRef<HTMLButtonElement | null>(null);
  const fossilCloseRef = useRef<HTMLButtonElement | null>(null);
  const fossilPanelRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const [stageEnabled, setStageEnabled] = useState(false);
  const [fossilOpen, setFossilOpen] = useState(false);
  const [fossilClosing, setFossilClosing] = useState(false);
  const fossilCloseTimer = useRef(0);

  const closeFossil = useCallback(() => {
    setFossilClosing(true);
    window.clearTimeout(fossilCloseTimer.current);
    fossilCloseTimer.current = window.setTimeout(() => {
      setFossilOpen(false);
      setFossilClosing(false);
    }, 240);
  }, []);

  useEffect(() => () => window.clearTimeout(fossilCloseTimer.current), []);
  const capture = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('capture');

  useEffect(() => {
    if (reduced) return;
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && /(^|-)2g$/.test(connection.effectiveType)) return;
    // The full-bleed WebGL scene is a desktop enhancement. Smaller viewports
    // keep the composed poster, which is sharper per pixel and much cheaper.
    if (window.matchMedia('(max-width: 900px)').matches) return;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    if (memory !== undefined && memory < 4) return;
    setStageEnabled(true);
  }, [reduced]);

  useEffect(() => {
    if (!fossilOpen) return;
    const lenis = getLenis();
    const previous = document.activeElement as HTMLElement | null;
    lenis?.stop();
    fossilCloseRef.current?.focus();

    const header = document.querySelector<HTMLElement>('.header');
    const footer = document.querySelector<HTMLElement>('.footer');
    if (header) header.inert = true;
    if (footer) footer.inert = true;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeFossil();
      if (event.key !== 'Tab') return;
      const focusable = Array.from(
        fossilPanelRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href]',
        ) ?? [],
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      if (header) header.inert = false;
      if (footer) footer.inert = false;
      lenis?.start();
      previous?.focus();
    };
  }, [fossilOpen, closeFossil]);

  const openFossil = useCallback(() => {
    window.clearTimeout(fossilCloseTimer.current);
    setFossilClosing(false);
    setFossilOpen(true);
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      gsap.set('[data-hero-line] > span', { yPercent: 112 });
      gsap.set('.hero__specimen', { autoAlpha: 0, y: 22 });

      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .to('[data-hero-line] > span', { yPercent: 0, duration: 1.3, stagger: 0.12 }, 0.15)
        .from('.hero__atmosphere', { autoAlpha: 0, duration: 1.4 }, 0)
        .from('.hero__poster', { scale: 1.04, duration: 1.6, ease: 'power3.out' }, 0.1);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: '+=125%',
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          onUpdate: (self) => {
            progressRef.current = self.progress;
            root.dataset.heroProgress = self.progress.toFixed(3);
          },
        },
      });

      tl.fromTo(
        '.hero__copy',
        { autoAlpha: 1, yPercent: 0 },
        { autoAlpha: 0, yPercent: -12, ease: 'none', duration: 0.62 },
        0.04,
      )
        .fromTo(
          '.hero__intro, .hero__cta',
          { autoAlpha: 1, y: 0 },
          { autoAlpha: 0, y: -18, duration: 0.24 },
          0.16,
        )
        .fromTo('.hero__scroll', { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.1 }, 0.12)
        .fromTo(
          '.hero__scrim-side',
          { autoAlpha: 1 },
          { autoAlpha: 0, ease: 'none', duration: 0.5 },
          0.08,
        )
        .fromTo(
          '.hero__specimen',
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.2, ease: 'power2.out' },
          0.6,
        )
        .fromTo(
          '.hero__final',
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.18 },
          0.72,
        );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      className={`hero hero--exhibit${capture ? ' hero--capture' : ''}`}
      id="top"
      ref={rootRef}
      data-theme="dark"
    >
      <div className="hero__atmosphere" aria-hidden="true">
        <div className="hero__glow" />
        <div className="hero__floor" />
      </div>

      <picture>
        <source
          type="image/avif"
          media="(max-width: 900px)"
          srcSet="/assets/img/spinosaurus-exhibit-poster-mobile.avif"
        />
        <source type="image/avif" srcSet="/assets/img/spinosaurus-exhibit-poster.avif" />
        <source
          type="image/webp"
          media="(max-width: 900px)"
          srcSet="/assets/img/spinosaurus-exhibit-poster-mobile.webp"
        />
        <img
          className="hero__poster"
          src="/assets/img/spinosaurus-exhibit-poster.webp"
          alt="Reconstruction of Spinosaurus aegyptiacus, head lit against a dark exhibition hall."
          width={1600}
          height={1000}
          fetchPriority="high"
        />
      </picture>

      {stageEnabled ? (
        <StageBoundary>
          <Suspense fallback={null}>
            <SpinoStage progressRef={progressRef} />
          </Suspense>
        </StageBoundary>
      ) : null}

      <div className="hero__scrim" aria-hidden="true" />
      <div className="hero__scrim-side" aria-hidden="true" />

      <div className="hero__content shell">
        <div className="hero__lower">
          <div className="hero__copy">
            <h1 className="hero__title serif">
              <span className="hero__line" data-hero-line>
                <span>The dinosaur</span>
              </span>{' '}
              <span className="hero__line" data-hero-line>
                <span>
                  <em>database.</em>
                </span>
              </span>
            </h1>
            <p className="hero__intro" data-hero-meta>
              A scientific encyclopedia of non-avian dinosaurs. Search {species.length} species
              records, trace the family tree, and follow each claim back to the fossil evidence.
            </p>
            <div className="hero__actions" data-hero-meta>
              <Link className="hero__cta" to="/species" data-cursor="link">
                Browse {species.length} species <span aria-hidden="true">↗</span>
              </Link>
              <Link className="hero__secondary" to="/classification" data-cursor="link">
                Classification <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          <aside className="hero__specimen" data-hero-meta>
            <p className="label hero__specimen-index">Reconstruction — specimen 01</p>
            <dl className="hero__data">
              <div>
                <dt>Period</dt>
                <dd>Late Cretaceous</dd>
              </div>
              <div>
                <dt>Age</dt>
                <dd>≈99–94 Ma · Cenomanian</dd>
              </div>
              <div>
                <dt>Range</dt>
                <dd>North Africa</dd>
              </div>
            </dl>

            <p className="hero__credit">
              Digital reconstruction: Julian Johnson-Mortimer, CC BY 4.0
            </p>

            <button
              type="button"
              className="hero__fossil"
              onClick={openFossil}
              ref={fossilTriggerRef}
              aria-haspopup="dialog"
              data-cursor="link"
            >
              <img src="/assets/img/spinosaurus-skull-1200.webp" alt="" width={1200} height={1026} loading="lazy" />
              <span>
                <span className="hero__fossil-label">Fossil evidence</span>
                <span className="hero__fossil-meta">
                  Private collection, Morocco · Didier Descouens, CC BY-SA 4.0
                </span>
              </span>
            </button>
          </aside>
        </div>

        <div className="hero__scroll" data-hero-meta>
          <span className="label">Scroll to enter</span>
          <i aria-hidden="true" />
        </div>

        <div className="hero__final" aria-hidden="true">
          <span className="serif">Spinosaurus <em>aegyptiacus</em></span>
        </div>
      </div>

      <div className="hero__fade" aria-hidden="true" />

      {fossilOpen ? (
        <div
          className={`fossil-plate${fossilClosing ? ' is-closing' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="Fossil evidence"
        >
          <button
            type="button"
            className="fossil-plate__backdrop"
            onClick={closeFossil}
            aria-label="Close fossil plate"
          />
          <figure className="fossil-plate__panel" ref={fossilPanelRef}>
            <button
              type="button"
              className="fossil-plate__close"
              onClick={closeFossil}
              ref={fossilCloseRef}
            >
              Close <span aria-hidden="true">×</span>
            </button>
            <div className="fossil-plate__image">
              <img
                src="/assets/img/spinosaurus-skull-2000.webp"
                alt="Lateral view of a privately held Spinosaurus skull from Morocco, not the Milan specimen."
                width={2000}
                height={1710}
              />
            </div>
            <figcaption className="fossil-plate__caption">
              <p className="label">Fossil evidence / plate 01</p>
              <p className="fossil-plate__title serif">Spinosaurus skull, Morocco</p>
              <p className="fossil-plate__note">
                MSNM V4047, a partial skull from the Kem Kem Group of Morocco, preserves the long,
                narrow rostrum and the terminal rosette of teeth, and clarified the shape of the
                snout and the position of the nares. The photograph here shows a different,
                privately held Moroccan skull; it is not MSNM V4047 and is used only as a
                comparative image. The skull of Spinosaurus remains incomplete.
              </p>
              <p className="fossil-plate__credit mono">
                Photo: Didier Descouens · CC BY-SA 4.0 · Private collection, Morocco
              </p>
              <Link className="text-link" to="/species/spinosaurus#fossil">
                Read the fossil evidence <span aria-hidden="true">↗</span>
              </Link>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </section>
  );
}

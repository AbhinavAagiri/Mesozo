import { useEffect, useLayoutEffect, useRef } from 'react';
import { AssetImage } from '../ui/AssetImage';
import { SailMark } from '../brand/SailMark';
import { preloaderAlternate, preloaderOpening } from '../../data/preloader';
import type { PreloaderSpecimen } from '../../data/preloader';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { getLenis } from '../../lib/useSmoothScroll';
import { useReducedMotion } from '../../lib/useReducedMotion';
import './preloader.css';

type Props = {
  onComplete: () => void;
};

type Plates = {
  frame: HTMLElement;
  media: HTMLElement;
};

function plateParts(root: HTMLElement, side: 'a' | 'b'): Plates[] {
  return Array.from(root.querySelectorAll<HTMLElement>(`.preloader__frame--${side}`)).map(
    (frame) => ({
      frame,
      media: frame.querySelector<HTMLElement>('.preloader__frame-media')!,
    }),
  );
}

function Frame({
  specimen,
  side,
}: {
  specimen: PreloaderSpecimen;
  side: 'a' | 'b';
}) {
  return (
    <div className={`preloader__frame preloader__frame--${side}`} data-frame={side} aria-hidden="true">
      <div className="preloader__frame-media">
        <AssetImage
          id={specimen.image}
          alt=""
          sizes="(max-width: 900px) 46vw, 24vw"
          fit="contain"
          priority={side === 'a'}
          eager={side === 'a'}
        />
      </div>
    </div>
  );
}

function Caption({ specimen, side }: { specimen: PreloaderSpecimen; side: 'a' | 'b' }) {
  return (
    <div className={`preloader__caption preloader__caption--${side}`} aria-hidden="true">
      <span className="preloader__scientific">{specimen.scientificName}</span>
      <span className="preloader__common">{specimen.commonName}</span>
    </div>
  );
}

function Plate({
  specimenA,
  specimenB,
  index,
}: {
  specimenA: PreloaderSpecimen;
  specimenB: PreloaderSpecimen;
  index: number;
}) {
  return (
    <figure className="preloader__plate">
      <span className="preloader__plate-index">{String(index + 1).padStart(2, '0')}</span>
      <Frame specimen={specimenA} side="a" />
      <Frame specimen={specimenB} side="b" />
      <Caption specimen={specimenA} side="a" />
      <Caption specimen={specimenB} side="b" />
    </figure>
  );
}

export function Preloader({ onComplete }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const reduced = useReducedMotion();

  // The overlay is opaque from the first paint, so the homepage can initialise
  // underneath it without ever flashing through.
  useLayoutEffect(() => {
    const doc = document.documentElement;
    const body = document.body;
    const scrollbar = Math.max(0, window.innerWidth - doc.clientWidth);

    doc.style.setProperty('--preloader-scrollbar', `${scrollbar}px`);
    doc.classList.add('is-preloading');
    body.classList.add('is-preloading');
    return () => {
      doc.classList.remove('is-preloading');
      doc.style.removeProperty('--preloader-scrollbar');
      body.classList.remove('is-preloading');
    };
  }, []);

  useEffect(() => {
    const stop = () => getLenis()?.stop();
    stop();
    const stopTimer = window.setTimeout(stop, 0);

    return () => {
      window.clearTimeout(stopTimer);
      const lenis = getLenis();
      lenis?.start();
      lenis?.resize();
      window.setTimeout(() => ScrollTrigger.refresh(), 60);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const q = gsap.utils.selector(root);
    const inner = root.querySelector<HTMLElement>('.preloader__inner');
    const header = q<HTMLElement>('.preloader__head-item');
    const plates = q<HTMLElement>('.preloader__plate');
    const footer = q<HTMLElement>('.preloader__foot-item');
    const index = q<HTMLElement>('.preloader__plate-index');
    const wordmark = root.querySelector<HTMLElement>('.preloader__wordmark');
    const frameA = plateParts(root, 'a');
    const frameB = plateParts(root, 'b');
    const captionA = q<HTMLElement>('.preloader__caption--a');
    const captionB = q<HTMLElement>('.preloader__caption--b');

    let finished = false;
    let fallbackTimer = 0;
    let timeline: gsap.core.Timeline | null = null;

    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(fallbackTimer);
      root.setAttribute('aria-hidden', 'true');
      onCompleteRef.current();
    };

    const ctx = gsap.context(() => {
      if (reduced) {
        timeline = gsap.timeline({ onComplete: finish });
        timeline
          // Reduced motion keeps the editorial opening but removes the long
          // montage: the archive is available in about one second.
          .to(header, { autoAlpha: 1, duration: 0.18, stagger: 0.02 }, 0)
          .to(plates, { autoAlpha: 1, duration: 0.2, stagger: 0.02 }, 0.04)
          .to(footer, { autoAlpha: 1, duration: 0.18, stagger: 0.02 }, 0.1)
          .to(inner, {
            autoAlpha: 0,
            duration: 0.2,
            ease: 'power1.out',
          }, 0.78)
          .to(root, { autoAlpha: 0, duration: 0.26, ease: 'power1.inOut' }, 0.96);
      } else {
        timeline = gsap.timeline({ defaults: { ease: 'power2.out' }, onComplete: finish });

        gsap.set(frameA.map((part) => part.frame), { autoAlpha: 1 });
        gsap.set(frameB.map((part) => part.frame), { autoAlpha: 0 });
        gsap.set(captionA, { autoAlpha: 1 });
        gsap.set(captionB, { autoAlpha: 0 });
        gsap.set(frameA.map((part) => part.media), { scale: 1.045 });
        gsap.set(frameB.map((part) => part.media), { scale: 1.045 });

        timeline
          .to(header, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08 }, 0)
          .to(plates, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06 }, 0.08)
          .to(
            frameA.map((part) => part.media),
            { scale: 1, duration: 1.25, stagger: 0.05, ease: 'power3.out' },
            0.18,
          )
          .to(footer, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05 }, 0.3);

        // The montage changes one plate at a time, like an editor laying down
        // specimen plates, then returns to the opening quartet for the finish.
        frameA.forEach((part, i) => {
          const at = 1.38 + i * 0.045;
          timeline
            ?.to(part.frame, { autoAlpha: 0, duration: 0.55, ease: 'power2.inOut' }, at)
            .to(captionA[i], { autoAlpha: 0, duration: 0.18, ease: 'power1.out' }, at)
            .fromTo(
              frameB[i].media,
              { scale: 1.045 },
              { scale: 1, duration: 0.8, ease: 'power3.out', immediateRender: false },
              at,
            )
            .to(frameB[i].frame, { autoAlpha: 1, duration: 0.55, ease: 'power2.inOut' }, at)
            .to(captionB[i], { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, at + 0.27);
        });

        frameB.forEach((part, i) => {
          const at = 2.56 + i * 0.045;
          timeline
            ?.to(part.frame, { autoAlpha: 0, duration: 0.55, ease: 'power2.inOut' }, at)
            .to(captionB[i], { autoAlpha: 0, duration: 0.18, ease: 'power1.out' }, at)
            .fromTo(
              frameA[i].media,
              { scale: 1.045 },
              { scale: 1, duration: 0.8, ease: 'power3.out', immediateRender: false },
              at,
            )
            .to(frameA[i].frame, { autoAlpha: 1, duration: 0.55, ease: 'power2.inOut' }, at)
            .to(captionA[i], { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, at + 0.27);
        });

        timeline
          .to(index, { color: '#d65b36', duration: 0.5, stagger: 0.04 }, 3.12)
          .to(wordmark, { letterSpacing: '0.42em', duration: 0.6, ease: 'power2.inOut' }, 3.1)
          .to(
            root,
            {
              yPercent: -100,
              duration: 0.68,
              ease: 'power4.inOut',
              onStart: () => root.classList.add('is-exiting'),
            },
            3.62,
          );
      }
    }, root);

    fallbackTimer = window.setTimeout(finish, reduced ? 2200 : 6000);

    return () => {
      window.clearTimeout(fallbackTimer);
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      className="preloader"
      ref={rootRef}
      role="status"
      aria-label="MESOZO is opening. The world before us."
    >
      <div className="preloader__inner">
        <header className="preloader__top">
          <div className="preloader__brand preloader__head-item">
            <div className="preloader__brand-row">
              <SailMark className="preloader__mark" />
              <span className="preloader__wordmark">Mesozo</span>
            </div>
            <p className="preloader__tagline">The world before us</p>
          </div>

          <div className="preloader__meta preloader__head-item">
            <span>Collection / 2026</span>
            <span>08 archive plates</span>
          </div>
        </header>

        <div className="preloader__strip-wrap">
          <div className="preloader__strip" aria-hidden="true">
            {preloaderOpening.map((specimenA, index) => (
              <Plate
                key={specimenA.slug}
                specimenA={specimenA}
                specimenB={preloaderAlternate[index]}
                index={index}
              />
            ))}
          </div>
        </div>

        <footer className="preloader__foot">
          <p className="preloader__foot-item preloader__statement serif">
            A database of <em>deep time.</em>
          </p>
          <p className="preloader__foot-item preloader__folio">
            <span>Archive sequence</span>
            <span>01 — 08</span>
          </p>
        </footer>
      </div>
    </section>
  );
}

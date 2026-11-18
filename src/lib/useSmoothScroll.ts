import Lenis from 'lenis';
import { useEffect } from 'react';
import { gsap, ScrollTrigger } from './gsap';
import { useReducedMotion } from './useReducedMotion';

let instance: Lenis | null = null;

/** Shared handle so the menu can stop and resume scrolling. */
export function getLenis() {
  return instance;
}

export function useSmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      instance?.destroy();
      instance = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      touchMultiplier: 1.4,
      // Hash navigation is handled by ScrollManager. Lenis's own anchor handler
      // can swallow cross-route links whose target lives on the next page.
      anchors: false,
    });
    instance = lenis;


    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      if (instance === lenis) instance = null;
    };
  }, [reduced]);
}

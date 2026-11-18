import { useEffect, useRef } from 'react';
import { gsap } from './gsap';
import { useReducedMotion } from './useReducedMotion';

type Options = {
  /** ScrollTrigger start for masked lines. */
  lineStart?: string;
  /** ScrollTrigger start for stacked items. */
  itemStart?: string;
};

/**
 * Reveals children marked `data-line` (masked text) and `data-reveal` (stacked
 * blocks). Sections opt in; nothing is hidden when reduced motion is requested.
 */
export function useReveal<T extends HTMLElement>(options: Options = {}) {
  const ref = useRef<T | null>(null);
  const reduced = useReducedMotion();
  const { lineStart = 'top 82%', itemStart = 'top 76%' } = options;

  useEffect(() => {
    const root = ref.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      const lines = root.querySelectorAll<HTMLElement>('[data-line] > span');
      if (lines.length) {
        gsap.fromTo(
          lines,
          { yPercent: 118 },
          {
            yPercent: 0,
            duration: 1.05,
            stagger: 0.085,
            ease: 'power4.out',
            scrollTrigger: { trigger: root, start: lineStart, once: true },
          },
        );
      }

      const items = root.querySelectorAll<HTMLElement>('[data-reveal]');
      if (items.length) {
        gsap.fromTo(
          items,
          { y: 26, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.85,
            stagger: 0.07,
            ease: 'power3.out',
            scrollTrigger: { trigger: root, start: itemStart, once: true },
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, [reduced, lineStart, itemStart]);

  return ref;
}

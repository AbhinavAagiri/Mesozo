import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.defaults({ ease: 'power3.out', duration: 0.9 });

export { gsap, ScrollTrigger };

/** Restore any ScrollTrigger-managed DOM before React unmounts a route. */
export function releasePageTriggers(): void {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

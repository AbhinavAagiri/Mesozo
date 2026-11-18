import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../lib/useReducedMotion';
import './cursor.css';

export function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let frame = 0;

    const move = (event: PointerEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      const target = (event.target as Element | null)?.closest?.('[data-cursor]');
      dot.dataset.cursor = target ? (target as HTMLElement).dataset.cursor || 'link' : '';
    };

    const leave = () => {
      dot.dataset.hidden = 'true';
    };
    const enter = () => {
      delete dot.dataset.hidden;
    };

    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    document.addEventListener('pointerenter', enter);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      document.removeEventListener('pointerenter', enter);
    };
  }, [reduced]);

  if (reduced) return null;

  return <div className="cursor" ref={dotRef} aria-hidden="true" />;
}

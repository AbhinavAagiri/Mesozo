import { useEffect, useRef, useState } from 'react';

export type SpeciesSection = {
  id: string;
  label: string;
  index: string;
};

type Props = {
  sections: SpeciesSection[];
};

/** Sticky table of contents; it tracks the section nearest the reading line. */
export function SpeciesNav({ sections }: Props) {
  const [active, setActive] = useState(sections[0]?.id ?? '');
  const [dark, setDark] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const probe = window.innerHeight * 0.34;
      let current = sections[0]?.id ?? '';

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= probe) current = section.id;
      }

      setActive(current);

      const nav = navRef.current;
      if (nav) {
        const navRect = nav.getBoundingClientRect();
        const navProbe = navRect.top + navRect.height / 2;
        const underDark = [
          ...document.querySelectorAll<HTMLElement>('[data-theme="dark"]'),
        ].some((el) => {
          const rect = el.getBoundingClientRect();
          return rect.top <= navProbe && rect.bottom > navProbe;
        });
        setDark(underDark);
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sections]);

  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>('.spx-nav__link.is-active');
    if (!list || !link) return;

    const overflow = list.scrollWidth - list.clientWidth;
    if (overflow <= 1) return;

    const listRect = list.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const left =
      list.scrollLeft + linkRect.left - listRect.left - (listRect.width - linkRect.width) / 2;
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches
      ? 'auto'
      : 'smooth';

    list.scrollTo({ left: Math.max(0, Math.min(left, overflow)), behavior });
  }, [active]);

  return (
    <nav
      ref={navRef}
      className="spx-nav"
      data-dark={dark ? 'true' : undefined}
      aria-label="Dossier contents"
    >
      <div className="spx-nav__inner shell">
        <span className="spx-nav__title label">Contents</span>
        <ol ref={listRef} className="spx-nav__list">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`spx-nav__link${active === section.id ? ' is-active' : ''}`}
                aria-current={active === section.id ? 'true' : undefined}
                data-cursor="link"
              >
                <span className="spx-nav__index mono">{section.index}</span>
                {section.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { SiteHeader } from './components/layout/SiteHeader';
import { MenuOverlay } from './components/layout/MenuOverlay';
import { SiteFooter } from './components/layout/SiteFooter';
import { Preloader } from './components/preloader/Preloader';
import { releasePageTriggers, ScrollTrigger } from './lib/gsap';
import { getLenis, useSmoothScroll } from './lib/useSmoothScroll';
import { shouldPlayPreloader } from './lib/preloaderSession';
import { loadSearch } from './lib/loadSearch';
import './styles/layout.css';

const preloaderOnFirstLoad = shouldPlayPreloader();

// The search index reads every public dataset, so it stays out of the initial
// shell and is requested only when the visitor shows intent to search.
const GlobalSearch = lazy(() =>
  loadSearch().then((module) => ({ default: module.GlobalSearch })),
);

// Home carries the Spinosaurus exhibition and Three.js. Lazy-loading it keeps
// the 3D runtime out of every other route's entry bundle.
const Home = lazy(() => import('./pages/Home'));
// The model laboratory is an internal development tool. Keep its route and
// Three.js room environment out of the production application entirely.
const ModelLab = import.meta.env.DEV ? lazy(() => import('./pages/ModelLab')) : null;
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const PrehistoricWorldPage = lazy(() => import('./pages/PrehistoricWorldPage'));
const AncientWorldPage = lazy(() => import('./pages/AncientWorldPage'));
const FossilEvidencePage = lazy(() => import('./pages/FossilEvidencePage'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const LearningTopicPage = lazy(() => import('./pages/LearningTopicPage'));
const LearningPathPage = lazy(() => import('./pages/LearningPathPage'));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage'));
const SpeciesArchive = lazy(() => import('./pages/SpeciesArchive'));
const ClassificationPage = lazy(() => import('./pages/ClassificationPage'));
const SpeciesDossier = lazy(() => import('./pages/SpeciesDossier'));
const DeepTimePage = lazy(() => import('./pages/DeepTimePage'));
const AnatomyPage = lazy(() => import('./pages/AnatomyPage'));
const DiscoveriesPage = lazy(() => import('./pages/DiscoveriesPage'));
const SpecimenPage = lazy(() => import('./pages/SpecimenPage'));
const JournalPage = lazy(() => import('./pages/JournalPage'));
const JournalArticlePage = lazy(() => import('./pages/JournalArticlePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollManager() {
  const { pathname, hash } = useLocation();

  // ScrollTrigger's pin wrapper lives outside React's DOM bookkeeping. Release
  // the current page's triggers before a route link is handled, so React can
  // remove the old route without trying to remove a pinned node from the wrong
  // parent. The next page recreates its own triggers on mount.
  useEffect(() => {
    const releaseCurrentPage = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      const anchor = target instanceof Element ? target.closest<HTMLAnchorElement>('a[href]') : null;
      if (
        !anchor ||
        (anchor.target && anchor.target !== '_self') ||
        anchor.hasAttribute('download')
      ) {
        return;
      }

      const next = new URL(anchor.href, window.location.href);
      if (next.origin !== window.location.origin || next.pathname === window.location.pathname) {
        return;
      }

      releasePageTriggers();
    };

    document.addEventListener('click', releaseCurrentPage, true);
    return () => document.removeEventListener('click', releaseCurrentPage, true);
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    let retry: number | undefined;
    let timer: number | undefined;
    let lateTimer: number | undefined;
    let cancelled = false;

    if (!hash) {
      lenis?.stop();
      window.scrollTo(0, 0);
      lenis?.start();
    } else {
      // The target section may mount a tick after the route commits. Look it up
      // after the transition instead of freezing a null result at effect time.
      const scrollToHash = (attempt = 0) => {
        if (cancelled) return;
        const target = document.querySelector<HTMLElement>(hash);
        if (!target) {
          if (attempt < 8) retry = window.setTimeout(() => scrollToHash(attempt + 1), 120);
          return;
        }

        // Native scrolling respects each target's scroll-margin-top and avoids
        // Lenis clamping a deep anchor to the previous route's height.
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
      };

      timer = window.setTimeout(() => scrollToHash(), 200);
      // The destination route can keep its previous scroll limit for a beat.
      // A second pass after layout settles keeps deep links from being clamped.
      lateTimer = window.setTimeout(() => scrollToHash(), 900);
    }

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      cancelled = true;
      window.clearTimeout(refresh);
      if (timer) window.clearTimeout(timer);
      if (lateTimer) window.clearTimeout(lateTimer);
      if (retry) window.clearTimeout(retry);
    };
  }, [pathname, hash]);

  return null;
}

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openSearch = useCallback(() => {
    void loadSearch();
    setMenuOpen(false);
    setSearchOpen(true);
  }, []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    setSearchOpen(false);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    const isEditable = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      (target.isContentEditable ||
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat) return;
      // The shell is inert while the opening sequence runs. Do not open a
      // dialog that cannot receive focus until the sequence has finished.
      if (document.querySelector<HTMLElement>('.app-shell')?.inert) return;
      const commandK =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      const slash = event.key === '/' && !isEditable(event.target);
      if (!commandK && !slash) return;
      event.preventDefault();
      if (!searchOpen) openSearch();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openSearch, searchOpen]);

  useSmoothScroll();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader
        menuOpen={menuOpen}
        onMenu={toggleMenu}
        onSearch={openSearch}
        onSearchIntent={loadSearch}
      />
      <MenuOverlay open={menuOpen} onClose={closeMenu} />
      {searchOpen ? (
        <Suspense
          fallback={
            <div className="search-loading" role="status" aria-live="polite">
              <span className="label">MESOZO</span>
              <span className="serif">Opening the index…</span>
            </div>
          }
        >
          <GlobalSearch open onClose={closeSearch} />
        </Suspense>
      ) : null}
      <ScrollManager />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}

export default function App() {
  const [showPreloader, setShowPreloader] = useState(preloaderOnFirstLoad);

  return (
    <>
      <div className="app-shell" inert={showPreloader}>
        <Suspense
          fallback={
            <div className="route-loading" role="status" aria-live="polite">
              <span className="label">MESOZO</span>
              <span className="serif">Opening the record…</span>
            </div>
          }
        >
          <Routes>
            {import.meta.env.DEV && ModelLab ? <Route path="lab" element={<ModelLab />} /> : null}
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="prehistoric-world" element={<PrehistoricWorldPage />} />
              <Route path="prehistoric-world/ecosystem/:id" element={<AncientWorldPage />} />
              <Route path="fossil-evidence" element={<FossilEvidencePage />} />
              <Route path="learn" element={<LearnPage />} />
              <Route path="learn/paths/:id" element={<LearningPathPage />} />
              <Route path="learn/:slug" element={<LearningTopicPage />} />
              <Route path="glossary" element={<GlossaryPage />} />
              <Route path="species" element={<SpeciesArchive />} />
              <Route path="classification" element={<ClassificationPage />} />
              <Route path="species/:slug" element={<SpeciesDossier />} />
              <Route path="deep-time" element={<DeepTimePage />} />
              <Route path="anatomy" element={<AnatomyPage />} />
              <Route path="discoveries" element={<DiscoveriesPage />} />
              <Route path="discoveries/specimen/:id" element={<SpecimenPage />} />
              <Route path="journal" element={<JournalPage />} />
              <Route path="journal/:slug" element={<JournalArticlePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
      {showPreloader ? <Preloader onComplete={() => setShowPreloader(false)} /> : null}
    </>
  );
}

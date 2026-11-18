import { useEffect } from 'react';

const BASE_TITLE = 'MESOZO — Dinosaur Encyclopedia & Prehistoric Life Database';
const BASE_DESCRIPTION =
  'MESOZO is an independent scientific encyclopedia of non-avian dinosaurs: 113 species dossiers, a classification explorer, deep time and the fossil evidence behind every record.';
const DEFAULT_IMAGE = '/og-mesozo.jpg';
const SITE_NAME = 'MESOZO';

export interface BreadcrumbMeta {
  name: string;
  /** Site-absolute path, e.g. `/species` or `/discoveries#archive`. */
  path: string;
}

export interface PageMeta {
  description?: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  /** Set false on error pages that must not claim a canonical address. */
  canonical?: boolean;
  /** Mirrors breadcrumb navigation that is visibly present on the page. */
  breadcrumbs?: BreadcrumbMeta[];
  structuredData?: Record<string, unknown>;
}

// Keep the visible opening claim and cut at a word boundary so search snippets
// do not end mid-word. Matches the build-time shell generator.
function clampDescription(value: string, max = 158): string {
  const clean = value.trim().replace(/\s+/g, ' ');
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  const body = lastSpace > 80 ? cut.slice(0, lastSpace) : cut;
  return `${body.replace(/[,;:.\s]+$/, '')}…`;
}

function absoluteUrl(value: string, origin: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  return `${origin}${value.startsWith('/') ? '' : '/'}${value}`;
}

/** Collapse trailing slashes so `/species/` and `/species` share one canonical. */
function canonicalPath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed || '/';
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertLink(rel: string, href: string): void {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}

function removeLink(rel: string): void {
  document.head.querySelector(`link[rel="${rel}"]`)?.remove();
}

function removeMeta(attribute: 'name' | 'property', key: string): void {
  document.head.querySelector(`meta[${attribute}="${key}"]`)?.remove();
}

function removeJsonLd(): void {
  document.getElementById('mesozo-page-jsonld')?.remove();
}

/**
 * Sets the document title and the page-level sharing metadata. The canonical
 * origin is injected at build time, so localhost and preview hosts can never
 * become a production canonical by accident.
 */
export function usePageTitle(title?: string, meta: PageMeta = {}): void {
  // Serialise object props so a parent re-render does not rebuild the head
  // metadata and JSON-LD on every commit.
  const structuredDataKey = JSON.stringify(meta.structuredData ?? null);
  const breadcrumbsKey = JSON.stringify(meta.breadcrumbs ?? null);

  useEffect(() => {
    const pageTitle = title ? `${title} — MESOZO` : BASE_TITLE;
    const description = clampDescription(meta.description ?? BASE_DESCRIPTION);
    const origin = __SITE_URL__.replace(/\/$/, '');
    const canonical = `${origin}${canonicalPath(window.location.pathname)}`;
    const image = absoluteUrl(meta.image ?? DEFAULT_IMAGE, origin);
    const imageAlt = meta.imageAlt ?? 'MESOZO — the world before us.';

    document.title = pageTitle;
    upsertMeta('name', 'description', description);
    upsertMeta(
      'name',
      'robots',
      __SITE_INDEXABLE__ && !meta.noindex ? 'index, follow' : 'noindex, nofollow',
    );
    upsertMeta('property', 'og:type', meta.type ?? 'website');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', pageTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:image:width', '1200');
    upsertMeta('property', 'og:image:height', '630');
    upsertMeta('property', 'og:image:alt', imageAlt);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', pageTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);
    upsertMeta('name', 'twitter:image:alt', imageAlt);

    if (meta.canonical === false) {
      removeLink('canonical');
      removeMeta('property', 'og:url');
    } else {
      upsertLink('canonical', canonical);
    }

    removeJsonLd();
    if (meta.noindex && meta.structuredData === undefined) {
      return () => {
        document.title = BASE_TITLE;
      };
    }

    const webPage = {
      '@type': 'WebPage',
      name: pageTitle,
      description,
      url: canonical,
    };
    const graph: Record<string, unknown>[] = [webPage];

    const breadcrumbs = meta.breadcrumbs ?? [];
    if (breadcrumbs.length) {
      graph.push({
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${origin}${item.path.startsWith('/') ? '' : '/'}${item.path}`,
        })),
      });
    }

    const structuredData = meta.structuredData ?? JSON.parse(structuredDataKey ?? 'null');
    if (structuredData) graph.push(structuredData);

    const script = document.createElement('script');
    script.id = 'mesozo-page-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graph,
    });
    document.head.appendChild(script);

    return () => {
      document.title = BASE_TITLE;
    };
    // `meta` fields are read inside the effect; the serialised keys below track
    // the object-valued ones without rebuilding on unrelated renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    title,
    meta.description,
    meta.image,
    meta.imageAlt,
    meta.type,
    meta.noindex,
    meta.canonical,
    structuredDataKey,
    breadcrumbsKey,
  ]);
}

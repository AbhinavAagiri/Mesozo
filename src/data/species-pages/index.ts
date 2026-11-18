import type { SpeciesPageContent } from '../types';

const pageModules = import.meta.glob<SpeciesPageContent>('./*.json', {
  eager: true,
  import: 'default',
});

const pagesBySlug = new Map<string, SpeciesPageContent>(
  Object.entries(pageModules).map(([path, content]) => [
    path.split('/').pop()?.replace('.json', '') ?? '',
    content,
  ]),
);

/** Extended dossier content. Species without a file use the base archive data. */
export function getSpeciesPage(slug: string | undefined): SpeciesPageContent | undefined {
  return slug ? pagesBySlug.get(slug) : undefined;
}

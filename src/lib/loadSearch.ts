let pending: Promise<typeof import('../components/search/GlobalSearch')> | null = null;

/** Start (or reuse) the on-demand search chunk request. */
export function loadSearch() {
  pending ??= import('../components/search/GlobalSearch');
  return pending;
}

import classificationData from './classification.json';
import { familyOf, species } from './index';
import type {
  ClassificationData,
  ClassificationEntry,
  ClassificationNode,
  Species,
} from './types';

export const classification = classificationData as ClassificationData;
export const classificationNodes = classification.nodes;

export const classificationNodeById = new Map(
  classificationNodes.map((node) => [node.id, node]),
);

const childrenById = new Map<string, ClassificationNode[]>();
for (const node of classificationNodes) {
  if (!node.parentId) continue;
  const children = childrenById.get(node.parentId) ?? [];
  children.push(node);
  childrenById.set(node.parentId, children);
}

for (const children of childrenById.values()) {
  children.sort((a, b) => a.label.localeCompare(b.label));
}

const roots = classificationNodes
  .filter((node) => node.parentId === null)
  .sort((a, b) => a.label.localeCompare(b.label));

function valuesFor(species: Species): Set<string> {
  const values = new Set(species.taxonomy.map((row) => row.value));
  values.add(species.groupKey);
  const family = familyOf(species);
  if (family) values.add(family);
  return values;
}

/**
 * A species can satisfy more than one node because the underlying records use
 * different ranks. Resolve that once, then propagate the species through every
 * ancestor so a clade count is a count of unique species, not occurrences.
 */
const nodesBySpecies = new Map<string, Set<string>>();

function nodesFor(species: Species): Set<string> {
  const cached = nodesBySpecies.get(species.slug);
  if (cached) return cached;

  const values = valuesFor(species);
  const matched = classificationNodes.filter((node) =>
    node.taxa.some((taxon) => values.has(taxon)),
  );
  const resolved = new Set<string>();

  for (const node of matched) {
    let current: ClassificationNode | undefined = node;
    while (current) {
      resolved.add(current.id);
      current = current.parentId ? classificationNodeById.get(current.parentId) : undefined;
    }
  }

  nodesBySpecies.set(species.slug, resolved);
  return resolved;
}

const speciesByNode = new Map<string, Species[]>();
for (const item of species) {
  for (const nodeId of nodesFor(item)) {
    const list = speciesByNode.get(nodeId) ?? [];
    list.push(item);
    speciesByNode.set(nodeId, list);
  }
}

for (const list of speciesByNode.values()) {
  list.sort((a, b) => a.scientificName.localeCompare(b.scientificName));
}

export function speciesInClassificationNode(nodeId: string): Species[] {
  return [...(speciesByNode.get(nodeId) ?? [])];
}

export function classificationCount(nodeId: string): number {
  return speciesByNode.get(nodeId)?.length ?? 0;
}

export function classificationChildren(nodeId: string): ClassificationNode[] {
  return [...(childrenById.get(nodeId) ?? [])];
}

export function classificationRoots(): ClassificationNode[] {
  return [...roots];
}

export function classificationAncestors(nodeId: string): ClassificationNode[] {
  const ancestors: ClassificationNode[] = [];
  let current = classificationNodeById.get(nodeId);
  while (current?.parentId) {
    const parent = classificationNodeById.get(current.parentId);
    if (!parent) break;
    ancestors.unshift(parent);
    current = parent;
  }
  return ancestors;
}

export function classificationPath(nodeId: string): string {
  const node = classificationNodeById.get(nodeId);
  if (!node) return '';
  return [...classificationAncestors(nodeId), node].map((item) => item.label).join(' › ');
}

export function classificationEntries(): ClassificationEntry[] {
  const build = (node: ClassificationNode): ClassificationEntry => ({
    node,
    children: classificationChildren(node.id).map(build),
    species: speciesInClassificationNode(node.id),
    total: classificationCount(node.id),
  });
  return roots.map(build);
}

export const disputedClassificationNodes = classificationNodes.filter((node) => node.disputed);

export function directChildrenCount(nodeId: string): number {
  return classificationChildren(nodeId).length;
}

/** A species-facing link to the most specific node that names its family or group. */
export function classificationNodeForTaxon(taxon: string | undefined): ClassificationNode | undefined {
  if (!taxon) return undefined;
  return classificationNodes.find((node) => node.taxa.includes(taxon));
}

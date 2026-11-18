import type { Reference } from './types';
import researchReferenceData from './references-v19.json';

/** References added by the V19 research pass. Kept out of the initial bundle. */
export const researchReferences = researchReferenceData as Reference[];
export const researchReferenceById = new Map(
  researchReferences.map((reference) => [reference.id, reference]),
);

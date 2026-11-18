import { speciesBySlug } from './index';

export interface PreloaderSpecimen {
  slug: string;
  image: string;
  scientificName: string;
  commonName: string;
}

function specimen(slug: string): PreloaderSpecimen {
  const species = speciesBySlug.get(slug);

  if (!species) {
    throw new Error(`Preloader specimen is missing from the archive: ${slug}`);
  }
  if (!species.image) {
    throw new Error(`Preloader specimen has no licensed plate: ${slug}`);
  }

  return {
    slug: species.slug,
    image: species.image,
    scientificName: species.scientificName,
    commonName: species.commonName,
  };
}

/**
 * Eight plates are selected from the illustrated dossiers for the opening
 * sequence. The opening quartet is the iconic set; the alternating quartet
 * broadens the sequence across the Jurassic and Cretaceous.
 */
export const preloaderOpening: PreloaderSpecimen[] = [
  'tyrannosaurus',
  'triceratops',
  'spinosaurus',
  'velociraptor',
].map(specimen);

export const preloaderAlternate: PreloaderSpecimen[] = [
  'allosaurus',
  'ankylosaurus',
  'brachiosaurus',
  'deinonychus',
].map(specimen);

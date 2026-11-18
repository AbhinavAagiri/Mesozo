import {
  discoveryEventForSpecimen,
  discoveryFormationForSpecimen,
  discoveryFormations,
  discoveryLocationById,
  discoveryLocations,
  discoverySpecimens,
  getPeriod,
  species,
} from './index';
import type {
  DiscoveryEvent,
  DiscoveryFormation,
  DiscoveryLocation,
  DiscoverySpecimen,
  Period,
  Species,
} from './types';

export interface AncientWorld {
  formation: DiscoveryFormation;
  period: Period;
  locations: DiscoveryLocation[];
  specimens: DiscoverySpecimen[];
  species: Species[];
  events: DiscoveryEvent[];
}

/**
 * A formation is a rock unit, not an ecosystem. This object gathers the
 * specimens and species the archive actually connects to that unit; it does
 * not infer interactions between them.
 */
export const ancientWorlds: AncientWorld[] = discoveryFormations
  .map((formation) => {
    const specimens = discoverySpecimens.filter(
      (specimen) => discoveryFormationForSpecimen(specimen)?.id === formation.id,
    );
    const events = specimens
      .map((specimen) => discoveryEventForSpecimen(specimen))
      .filter((event): event is DiscoveryEvent => Boolean(event));
    const worldSpecies = Array.from(
      new Map(
        specimens
          .map((specimen) => species.find((item) => item.slug === specimen.speciesId))
          .filter((item): item is Species => Boolean(item))
          .map((item) => [item.slug, item]),
      ).values(),
    );
    const locations = formation.locationIds
      .map((id) => discoveryLocationById.get(id))
      .filter((location): location is DiscoveryLocation => Boolean(location));

    return {
      formation,
      period: getPeriod(formation.periodId),
      locations,
      specimens,
      species: worldSpecies,
      events,
    };
  })
  .sort((a, b) => b.formation.ageMa[0] - a.formation.ageMa[0]);

export const ancientWorldById = new Map(
  ancientWorlds.map((world) => [world.formation.id, world]),
);

export function getAncientWorld(id: string | undefined): AncientWorld | undefined {
  return id ? ancientWorldById.get(id) : undefined;
}

export function ancientWorldForSpecies(slug: string): AncientWorld | undefined {
  return ancientWorlds.find((world) => world.species.some((item) => item.slug === slug));
}

export function ancientWorldsForPeriod(periodId: string): AncientWorld[] {
  return ancientWorlds.filter((world) => world.formation.periodId === periodId);
}

export const ancientWorldReferenceIds = Array.from(
  new Set(
    ancientWorlds.flatMap((world) => [
      ...world.formation.refs,
      ...world.specimens.flatMap((specimen) => specimen.refs),
    ]),
  ),
);

export const ancientWorldSiteCount = discoveryLocations.length;

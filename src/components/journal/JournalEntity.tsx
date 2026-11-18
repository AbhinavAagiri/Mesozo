import { Link } from 'react-router-dom';
import {
  discoverySpecimenById,
  formatMaRange,
  getAtlasCase,
  getAtlasStructure,
  getGeoUnit,
  getSpecies,
} from '../../data';

type Props =
  | { kind: 'species'; speciesId: string; note?: string }
  | { kind: 'specimen'; specimenId: string; note?: string }
  | { kind: 'period'; unitId: string; note?: string }
  | { kind: 'anatomy'; speciesId: string; structureId: string; note?: string };

/**
 * Contextual records generated from the MESOZO entity IDs on the article.
 * The Journal never copies species, period, specimen or anatomy descriptions.
 */
export function JournalEntityCard(props: Props) {
  if (props.kind === 'species') {
    const species = getSpecies(props.speciesId);
    if (!species) return null;
    return (
      <Link className="jrn-entity" to={`/species/${species.slug}`} data-cursor="link">
        <span className="label">Species dossier</span>
        <span className="jrn-entity__title serif">{species.scientificName}</span>
        <span className="jrn-entity__meta">
          {species.commonName} · {species.periodLabel} · {species.ageLabel}
        </span>
        {props.note ? <span className="jrn-entity__note">{props.note}</span> : null}
        <span className="jrn-entity__open mono">Open dossier ↗</span>
      </Link>
    );
  }

  if (props.kind === 'specimen') {
    const specimen = discoverySpecimenById.get(props.specimenId);
    if (!specimen) return null;
    const species = getSpecies(specimen.speciesId);
    return (
      <Link
        className="jrn-entity"
        to={`/discoveries/specimen/${specimen.id}`}
        data-cursor="link"
      >
        <span className="label">Fossil specimen</span>
        <span className="jrn-entity__title serif">{specimen.identifier}</span>
        <span className="jrn-entity__meta">
          {species?.scientificName ?? specimen.speciesId} · {specimen.repository}
        </span>
        {props.note ? <span className="jrn-entity__note">{props.note}</span> : null}
        <span className="jrn-entity__open mono">Open record ↗</span>
      </Link>
    );
  }

  if (props.kind === 'period') {
    const unit = getGeoUnit(props.unitId);
    if (!unit) return null;
    return (
      <Link className="jrn-entity" to={`/deep-time?period=${unit.id}`} data-cursor="link">
        <span className="label">Deep Time</span>
        <span className="jrn-entity__title serif">{unit.name}</span>
        <span className="jrn-entity__meta">
          {unit.rank} · {formatMaRange(unit.startMa, unit.endMa)}
        </span>
        {props.note ? <span className="jrn-entity__note">{props.note}</span> : null}
        <span className="jrn-entity__open mono">Open period ↗</span>
      </Link>
    );
  }

  const atlasCase = getAtlasCase(props.speciesId);
  const structure = atlasCase ? getAtlasStructure(atlasCase, props.structureId) : undefined;
  if (!atlasCase || !structure) return null;

  return (
    <Link
      className="jrn-entity"
      to={`/anatomy?species=${atlasCase.speciesId}&structure=${structure.id}`}
      data-cursor="link"
    >
      <span className="label">Anatomical atlas</span>
      <span className="jrn-entity__title serif">{structure.name}</span>
      <span className="jrn-entity__meta">
        {atlasCase.speciesId} · {structure.category}
      </span>
      {props.note ? <span className="jrn-entity__note">{props.note}</span> : null}
      <span className="jrn-entity__open mono">Open structure ↗</span>
    </Link>
  );
}

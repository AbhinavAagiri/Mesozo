import { Link } from 'react-router-dom';
import { InlineSources } from '../../components/ui/Sources';
import { getAtlasCase, getPeriod } from '../../data';
import type { Species, SpeciesPageContent, SpeciesPageField } from '../../data/types';
import { SpeciesSectionHead } from './SpeciesSectionHead';

type Props = {
  species: Species;
  page?: SpeciesPageContent;
  index?: string;
};

function fallbackFields(species: Species): SpeciesPageField[] {
  const fields: SpeciesPageField[] = [
    { label: 'Scientific name', value: species.scientificName, note: `Named by ${species.namedBy}.` },
    { label: 'Common name', value: species.commonName },
    { label: 'Status', value: species.status },
    { label: 'Classification', value: species.group },
    { label: 'Period', value: `${species.periodLabel} · ${species.stage}` },
    { label: 'Approximate age', value: species.ageLabel },
    { label: 'Geographic range', value: species.region.join(' · ') },
    { label: 'Diet', value: species.dietLabel },
    { label: 'Estimated length', value: species.length },
    { label: 'Estimated mass', value: species.mass, note: species.sizeNote, refs: species.sizeRefs },
  ];

  if (species.locomotion) fields.push({ label: 'Locomotion', value: species.locomotion });
  if (species.habitat) fields.push({ label: 'Habitat', value: species.habitat });
  if (species.locality?.length) {
    fields.push({ label: 'Fossil locality', value: species.locality.join(' · ') });
  }
  if (species.ancientContext) {
    fields.push({ label: 'Ancient geography', value: species.ancientContext });
  }

  return fields;
}

/** At-a-glance specimen data, written as a label sheet rather than a dashboard. */
function FieldValue({ field }: { field: SpeciesPageField }) {
  if (field.label === 'Scientific name') {
    const [genus, ...rest] = field.value.split(' ');
    const epithet = rest.join(' ');

    return (
      <p className="spx-fact__value">
        {genus} {epithet ? <em>{epithet}</em> : null}
      </p>
    );
  }

  return <p className="spx-fact__value">{field.value}</p>;
}

const RESEARCH_STATUS: Record<string, string> = {
  verified: 'Verified',
  'partially-verified': 'Partially verified',
  limited: 'Literature-limited',
  curated: 'Curated dossier',
};

export function SpeciesOverview({ species, page, index = '01' }: Props) {
  const fields = page?.overview.fields ?? fallbackFields(species);
  const material = page?.overview.material;
  const period = getPeriod(species.period);
  const atlasCase = getAtlasCase(species.slug);
  const researchStatus = species.researchStatus
    ? (RESEARCH_STATUS[species.researchStatus] ?? species.researchStatus)
    : undefined;

  return (
    <section id="overview" className="spx-section spx-section--overview">
      <div className="shell">
        <SpeciesSectionHead
          index={index}
          title="The record at a glance"
          intro={page?.overview.intro ?? species.summary}
        />

        <div className="spx-overview">
          <dl className="spx-facts">
            {fields.map((field, index) => (
              <div
                className={`spx-fact${index === 0 ? ' spx-fact--wide' : ''}`}
                key={field.label}
                data-reveal
              >
                <dt className="label">{field.label}</dt>
                <dd>
                  <FieldValue field={field} />
                  {field.note ? <p className="spx-fact__note">{field.note}</p> : null}
                  {field.refs?.length ? <InlineSources ids={field.refs} /> : null}
                </dd>
              </div>
            ))}
          </dl>

          <aside className="spx-overview__aside" data-reveal>
            {material ? (
              <div>
                <p className="label">Known material</p>
                <p>{material}</p>
              </div>
            ) : null}
            <div>
              <p className="label">Confidence note</p>
              <p className="serif">{species.confidenceNote}</p>
            </div>
            {atlasCase ? (
              <div className="spx-deep-link-block">
                <p className="label">Anatomical atlas</p>
                <Link className="spx-deep-link" to={`/anatomy?species=${species.slug}`}>
                  <span>
                    <span className="serif">Read the skeleton</span>
                    <span className="mono">{atlasCase.scopeLabel}</span>
                  </span>
                  <span className="spx-deep-link__arrow" aria-hidden="true">
                    ↗
                  </span>
                </Link>
                <p>Inspect the structures, functions and fossil evidence in the anatomical atlas.</p>
              </div>
            ) : null}
            <div className="spx-deep-link-block">
              <p className="label">Deep time</p>
              <Link className="spx-deep-link" to={`/deep-time?period=${period.id}`}>
                <span>
                  <span className="serif">{period.name}</span>
                  <span className="mono">{period.span}</span>
                </span>
                <span className="spx-deep-link__arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
              <p>Open the {period.name} in the interactive geological timeline.</p>
            </div>
            <p className="spx-overview__review mono">
              {researchStatus ? `Research status: ${researchStatus} · ` : ''}
              Last reviewed {species.updated}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

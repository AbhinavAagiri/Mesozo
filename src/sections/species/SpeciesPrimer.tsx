import type { ReactNode } from 'react';
import { PreviewLink, type PreviewData } from '../../components/ui/PreviewLink';
import { getAtlasCase, getPeriod, getSpecies, species as allSpecies } from '../../data';
import { getGlossaryEntry, getLearningTopic } from '../../data/learning';
import { ancientWorldForSpecies, getAncientWorld } from '../../data/world';
import type { Species } from '../../data/types';
import { SpeciesSectionHead } from './SpeciesSectionHead';

type Props = {
  species: Species;
  index?: string;
};

const GROUP_GUIDE: Record<string, { slug: string; label: string; phrase: string }> = {
  Theropoda: {
    slug: 'major-dinosaur-groups',
    label: 'theropod dinosaurs',
    phrase: 'a theropod dinosaur',
  },
  Sauropodomorpha: {
    slug: 'major-dinosaur-groups',
    label: 'sauropodomorph dinosaurs',
    phrase: 'a sauropodomorph dinosaur',
  },
  Ornithischia: {
    slug: 'major-dinosaur-groups',
    label: 'ornithischian dinosaurs',
    phrase: 'an ornithischian dinosaur',
  },
  Saurischia: {
    slug: 'major-dinosaur-groups',
    label: 'early saurischian dinosaurs',
    phrase: 'an early saurischian dinosaur',
  },
};

const DIET_GUIDE = '/learn/what-dinosaurs-ate';
const SIZE_GUIDE = '/learn/dinosaur-size';
const WORLDS_GUIDE = '/prehistoric-world#worlds';

function previewFor(to: string): PreviewData | undefined {
  const [path, query = ''] = to.split('?');
  const [cleanPath, hash = ''] = path.split('#');
  const params = new URLSearchParams(query);

  if (cleanPath.startsWith('/learn/')) {
    const topic = getLearningTopic(cleanPath.replace('/learn/', ''));
    if (topic) {
      return {
        eyebrow: `Field guide · ${topic.minutes} min`,
        title: topic.title,
        body: topic.standfirst,
      };
    }
  }

  if (cleanPath === '/deep-time' && params.get('period')) {
    const period = getPeriod(params.get('period') as Species['period']);
    return {
      eyebrow: 'Deep time',
      title: period.name,
      body: period.summary,
      caption: period.span,
    };
  }

  if (cleanPath.startsWith('/prehistoric-world/ecosystem/')) {
    const world = getAncientWorld(cleanPath.replace('/prehistoric-world/ecosystem/', ''));
    if (world) {
      return {
        eyebrow: 'Ancient world',
        title: world.formation.name,
        body: world.formation.note,
        caption: `${world.period.name} · ${world.formation.ageLabel}`,
      };
    }
  }

  if (cleanPath.startsWith('/species/')) {
    const species = getSpecies(cleanPath.replace('/species/', ''));
    if (species) {
      return {
        eyebrow: species.group,
        title: species.scientificName,
        body: species.tagline,
        imageId: species.image,
        imageAlt: species.image
          ? `Life reconstruction of ${species.scientificName}.`
          : undefined,
        caption: species.image
          ? `Life reconstruction · ${species.commonName}`
          : 'Database record · no licensed life reconstruction',
      };
    }
  }

  if (cleanPath === '/glossary' && hash) {
    const entry = getGlossaryEntry(hash);
    if (entry) {
      return {
        eyebrow: 'Glossary',
        title: entry.term,
        body: entry.short,
      };
    }
  }

  if (cleanPath === '/anatomy' && params.get('species')) {
    const atlasCase = getAtlasCase(params.get('species') ?? undefined);
    if (atlasCase) {
      return {
        eyebrow: 'Anatomical atlas',
        title: atlasCase.caseLabel,
        body: atlasCase.intro,
        caption: atlasCase.scopeLabel,
      };
    }
  }

  const staticPages: Record<string, PreviewData> = {
    '/fossil-evidence': {
      eyebrow: 'Fossil evidence',
      title: 'How a fossil becomes evidence',
      body: 'Specimens, preparation, provenance, dating and the difference between observation and reconstruction.',
    },
    '/about': {
      eyebrow: 'About MESOZO',
      title: 'How this archive works',
      body: 'The evidence key, editorial standards and the limits of a database record.',
    },
    '/prehistoric-world': {
      eyebrow: 'Prehistoric world',
      title: 'Ancient worlds from the rock record',
      body: 'Formations, environments and the species preserved together — without assuming they interacted.',
    },
  };

  return staticPages[cleanPath];
}

const GROUP_TERMS = [
  'sauropodomorphs',
  'sauropodomorph',
  'ornithischians',
  'ornithischian',
  'tyrannosauroids',
  'tyrannosauroid',
  'therizinosaurs',
  'therizinosaur',
  'ceratopsians',
  'ceratopsian',
  'stegosaurs',
  'stegosaur',
  'ankylosaurs',
  'ankylosaur',
  'ornithopods',
  'ornithopod',
  'titanosaurs',
  'titanosaur',
  'sauropods',
  'sauropod',
  'theropods',
  'theropod',
  'Sauropodomorpha',
  'Ornithischia',
  'Theropoda',
  'Sauropoda',
  'Titanosauria',
  'Stegosauridae',
  'Ankylosauria',
  'Ceratopsia',
  'Ornithopoda',
];

const termTargets = new Map<string, string>();
const genusCounts = new Map<string, number>();
for (const item of allSpecies) {
  genusCounts.set(item.genus, (genusCounts.get(item.genus) ?? 0) + 1);
  termTargets.set(item.scientificName, `/species/${item.slug}`);
}
for (const item of allSpecies) {
  if (genusCounts.get(item.genus) === 1) termTargets.set(item.genus, `/species/${item.slug}`);
}
for (const term of GROUP_TERMS) termTargets.set(term, '/learn/major-dinosaur-groups');
termTargets.set('dinosaurs', '/learn/what-is-a-dinosaur');
termTargets.set('dinosaur', '/learn/what-is-a-dinosaur');
termTargets.set('fossils', '/fossil-evidence');
termTargets.set('fossil', '/fossil-evidence');

const termPattern = new RegExp(
  `\\b(${[...termTargets.keys()]
    .sort((a, b) => b.length - a.length)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')})\\b`,
  'g',
);

function autoLinkedText(
  text: string,
  seen: Set<string>,
  keyPrefix: string,
  currentSlug?: string,
) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  termPattern.lastIndex = 0;

  while ((match = termPattern.exec(text))) {
    const term = match[0];
    if (term === 'Mamenchisaurus' && /^\s+youngi\b/.test(text.slice(match.index + term.length))) {
      continue;
    }
    const target = termTargets.get(term);
    if (!target || seen.has(target)) continue;
    if (currentSlug && target === `/species/${currentSlug}`) continue;
    seen.add(target);
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <PreviewLink
        key={`${keyPrefix}-auto-${match.index}`}
        to={target}
        preview={previewFor(target)}
      >
        {term}
      </PreviewLink>,
    );
    lastIndex = termPattern.lastIndex;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

function LinkedText({ text, currentSlug }: { text: string; currentSlug?: string }) {
  const nodes: ReactNode[] = [];
  const seen = new Set<string>();
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(
        ...autoLinkedText(text.slice(lastIndex, match.index), seen, `plain-${lastIndex}`, currentSlug),
      );
    }
    seen.add(match[2]);
    nodes.push(
      <PreviewLink key={`${match[2]}-${match.index}`} to={match[2]} preview={previewFor(match[2])}>
        {match[1]}
      </PreviewLink>,
    );
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(...autoLinkedText(text.slice(lastIndex), seen, `tail-${lastIndex}`, currentSlug));
  }
  return <>{nodes}</>;
}

function fallbackPrimer(species: Species) {
  const period = getPeriod(species.period);
  const group = GROUP_GUIDE[species.groupKey] ?? {
    slug: 'what-is-a-dinosaur',
    label: 'dinosaurs',
    phrase: 'a dinosaur',
  };
  const [dietBase, dietQualifier] = species.dietLabel.split(' · ');
  const dietArticle = /^[aeiou]/i.test(dietBase) ? 'an' : 'a';
  const dietLink = `${dietArticle} [${dietBase.toLowerCase()}](${DIET_GUIDE})`;
  const dietText =
    dietQualifier === 'inferred'
      ? `probably ${dietLink}`
      : dietQualifier === 'debated'
        ? `${dietLink}, although its diet is debated`
        : dietQualifier
          ? `${dietLink} with a ${dietQualifier.toLowerCase()} diet`
          : dietLink;
  const ageText = species.ageLabel.replace(/^≈\s*/, '');
  const genus = species.scientificName.split(' ')[0];
  const common = species.commonName.toLowerCase() === genus.toLowerCase() ? '' : ` (${species.commonName})`;
  const join = (...parts: Array<string | undefined>) =>
    parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  const regionNames = species.region.map((name) =>
    /^United (States|Kingdom)$/.test(name) ? `the ${name}` : name,
  );
  const regionText =
    regionNames.length > 1
      ? `${regionNames.slice(0, -1).join(', ')} and ${regionNames[regionNames.length - 1]}`
      : regionNames[0];

  return {
    lead: `${species.scientificName}${common} was ${group.phrase} from what is now ${regionText}. It lived during the [${period.name}](/deep-time?period=${period.id}), about ${ageText}, and was ${dietText}.`,
    paragraphs: [
      species.discovery.body,
      join(species.dietEvidence.body, species.behaviour.body),
    ],
    takeaway: undefined,
  };
}

function Facts({ species }: { species: Species }) {
  const period = getPeriod(species.period);
  const world = ancientWorldForSpecies(species.slug);
  const worldLink = world
    ? `/prehistoric-world/ecosystem/${world.formation.id}`
    : WORLDS_GUIDE;

  return (
    <dl className="spx-primer__facts">
      <div>
        <dt className="label">Lived</dt>
        <dd>
          <PreviewLink
            to={`/deep-time?period=${period.id}`}
            preview={previewFor(`/deep-time?period=${period.id}`)}
          >
            {period.name}
          </PreviewLink>
          <span className="mono">{species.ageLabel}</span>
        </dd>
      </div>
      <div>
        <dt className="label">Where</dt>
        <dd>
          {world ? (
            <PreviewLink to={worldLink} preview={previewFor(worldLink)}>
              {world.formation.name}
            </PreviewLink>
          ) : (
            species.region.join(', ')
          )}
        </dd>
      </div>
      <div>
        <dt className="label">Size</dt>
        <dd>
          {species.length}
          <span className="mono">{species.mass}</span>
        </dd>
      </div>
      <div>
        <dt className="label">Diet</dt>
        <dd>
          <PreviewLink to={DIET_GUIDE} preview={previewFor(DIET_GUIDE)}>
            {species.dietLabel}
          </PreviewLink>
        </dd>
      </div>
    </dl>
  );
}

/**
 * A beginner-facing introduction above the reading guide. Custom primers were
 * written for the reviewed species; the rest are assembled from the same
 * sourced fields the dossier uses, without inventing new claims.
 */
export function SpeciesPrimer({ species, index = '02' }: Props) {
  const period = getPeriod(species.period);
  const group = GROUP_GUIDE[species.groupKey] ?? {
    slug: 'what-is-a-dinosaur',
    label: 'dinosaurs',
    phrase: 'a dinosaur',
  };
  const world = ancientWorldForSpecies(species.slug);
  const primer = species.primer ?? fallbackPrimer(species);
  const sizeLink = SIZE_GUIDE;
  const worldLink = world
    ? `/prehistoric-world/ecosystem/${world.formation.id}`
    : WORLDS_GUIDE;
  const atlasCase = getAtlasCase(species.slug);

  return (
    <section id="primer" className="spx-section spx-section--primer">
      <div className="shell">
        <SpeciesSectionHead
          index={index}
          title="Start here: the short version"
          intro="A shorter route through the animal's discovery and way of life. The sections that follow open up the anatomy, the fossil evidence and the arguments behind each statement."
        />

        <div className="spx-primer">
          <div className="spx-primer__main" data-reveal>
            <p className="spx-primer__lead serif">
              <LinkedText text={primer.lead} currentSlug={species.slug} />
            </p>
            {primer.paragraphs.map((paragraph, position) => (
              <p className="spx-primer__paragraph" key={`${species.slug}-primer-${position}`}>
                <LinkedText text={paragraph} currentSlug={species.slug} />
              </p>
            ))}
            <p className="spx-primer__more">
              The dossier continues below with anatomy, the fossil record and the sources behind
              each claim.
            </p>
          </div>

          <aside className="spx-primer__aside" data-reveal>
            <p className="label">At a glance</p>
            <Facts species={species} />
            {primer.takeaway ? (
              <p className="spx-primer__takeaway serif">
                <LinkedText text={primer.takeaway} currentSlug={species.slug} />
              </p>
            ) : null}
            <div className="spx-primer__links">
              <PreviewLink
                to={`/learn/${group.slug}`}
                preview={previewFor(`/learn/${group.slug}`)}
              >
                {group.label}
              </PreviewLink>
              <PreviewLink
                to={`/deep-time?period=${period.id}`}
                preview={previewFor(`/deep-time?period=${period.id}`)}
              >
                {period.name} in deep time
              </PreviewLink>
              <PreviewLink
                to={sizeLink}
                preview={previewFor(sizeLink)}
              >
                How size is estimated
              </PreviewLink>
              {atlasCase ? (
                <PreviewLink
                  to={`/anatomy?species=${species.slug}`}
                  preview={previewFor(`/anatomy?species=${species.slug}`)}
                >
                  Read the skeleton
                </PreviewLink>
              ) : null}
              <PreviewLink to={worldLink} preview={previewFor(worldLink)}>
                The ancient world
              </PreviewLink>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

import { JournalDiagram } from '../../components/journal/JournalDiagram';
import { JournalEntityCard } from '../../components/journal/JournalEntity';
import { JournalFigure } from '../../components/journal/JournalFigure';
import { JournalParagraphs } from '../../components/journal/JournalProse';
import { InlineSources } from '../../components/ui/Sources';
import { formatMaRange, getGeoUnit } from '../../data';
import type { JournalSection } from '../../data/journal';
import type { JournalArticle, JournalBlock, JournalStance } from '../../data/journal/types';

type Props = {
  article: JournalArticle;
  sections: JournalSection[];
};

const STANCE_LABELS: Record<JournalStance, string> = {
  established: 'Established evidence',
  interpretation: 'Current interpretation',
  debate: 'Scientific debate',
  open: 'Open question',
};

function ImageBlock({ block }: { block: Extract<JournalBlock, { type: 'image' }> }) {
  const sizes =
    block.layout === 'inset'
      ? '(max-width: 900px) 100vw, 360px'
      : block.layout === 'wide'
        ? '(max-width: 900px) 100vw, 78vw'
        : '(max-width: 900px) 100vw, 860px';

  return (
    <div className={`jrn-body__figure jrn-body__figure--${block.layout}`}>
      <JournalFigure
        assetId={block.assetId}
        alt={block.alt}
        caption={block.caption}
        label={block.label}
        fit={block.fit ?? 'cover'}
        position={block.position}
        sizes={sizes}
      />
      <InlineSources ids={block.refs ?? []} />
    </div>
  );
}

function DuoBlock({ block }: { block: Extract<JournalBlock, { type: 'duo' }> }) {
  return (
    <div className="jrn-body__duo">
      <div className="jrn-body__duo-grid">
        {block.images.map((image) => (
          <JournalFigure
            key={image.assetId + image.alt}
            assetId={image.assetId}
            alt={image.alt}
            caption={image.caption}
            label={image.label}
            sizes="(max-width: 760px) 100vw, 46vw"
          />
        ))}
      </div>
      {block.caption ? <p className="jrn-body__group-caption">{block.caption}</p> : null}
      <InlineSources ids={block.refs ?? []} />
    </div>
  );
}

function GalleryBlock({ block }: { block: Extract<JournalBlock, { type: 'gallery' }> }) {
  return (
    <div className="jrn-body__gallery">
      {block.title ? <h3 className="jrn-gallery__title serif">{block.title}</h3> : null}
      <div className="jrn-gallery">
        {block.images.map((image) => (
          <JournalFigure
            key={image.assetId + image.alt}
            assetId={image.assetId}
            alt={image.alt}
            caption={image.caption}
            label={image.label}
            fit="contain"
            sizes="(max-width: 760px) 100vw, 30vw"
          />
        ))}
      </div>
      <InlineSources ids={block.refs ?? []} />
    </div>
  );
}

function TimescaleBlock({ block }: { block: Extract<JournalBlock, { type: 'timescale' }> }) {
  const units = block.unitIds
    .map((id) => getGeoUnit(id))
    .filter((unit): unit is NonNullable<typeof unit> => Boolean(unit));
  const total = units.reduce((sum, unit) => sum + (unit.startMa - unit.endMa), 0);

  if (!units.length || total <= 0) return null;

  return (
    <section className="jrn-timescale" aria-label={block.title}>
      <h3 className="jrn-subhead serif">{block.title}</h3>
      <div className="jrn-timescale__bar" role="img" aria-label={`${block.title}: a proportional period bar.`}>
        {units.map((unit) => (
          <span
            className={unit.id === block.highlightId ? 'is-highlight' : undefined}
            style={{ width: `${((unit.startMa - unit.endMa) / total) * 100}%` }}
            key={unit.id}
            title={`${unit.name}: ${formatMaRange(unit.startMa, unit.endMa)}`}
          />
        ))}
      </div>
      <ol className="jrn-timescale__legend">
        {units.map((unit) => (
          <li key={unit.id} className={unit.id === block.highlightId ? 'is-highlight' : undefined}>
            <span className="mono">{unit.name}</span>
            <span className="mono">{formatMaRange(unit.startMa, unit.endMa)}</span>
          </li>
        ))}
      </ol>
      {block.note ? <p className="jrn-note">{block.note}</p> : null}
      <InlineSources ids={block.refs ?? []} />
    </section>
  );
}

function renderBlock(block: JournalBlock, section: JournalSection | undefined) {
  switch (block.type) {
    case 'heading': {
      const Tag = block.level === 3 ? 'h3' : 'h2';
      return (
        <header className="jrn-section-head" key={`heading-${block.id}`}>
          <p className="label">
            {block.kicker ?? `Section ${section?.number ?? ''}`}
          </p>
          <Tag id={block.id} className="jrn-section-head__title serif">
            {block.title}
          </Tag>
        </header>
      );
    }
    case 'text':
      return (
        <div
          className={`jrn-prose${block.dropCap ? ' jrn-prose--dropcap' : ''}`}
          key={`text-${block.paragraphs[0]?.slice(0, 24)}`}
        >
          <JournalParagraphs paragraphs={block.paragraphs} />
          <InlineSources ids={block.refs ?? []} />
        </div>
      );
    case 'image':
      return <ImageBlock block={block} key={`image-${block.assetId}-${block.caption ?? ''}`} />;
    case 'duo':
      return <DuoBlock block={block} key={`duo-${block.images[0].assetId}-${block.images[1].assetId}`} />;
    case 'gallery':
      return <GalleryBlock block={block} key={`gallery-${block.title ?? block.images[0]?.assetId}`} />;
    case 'pullquote':
      return (
        <figure className="jrn-pullquote" key={`quote-${block.text.slice(0, 24)}`}>
          <p className="label">{block.label ?? 'The argument'}</p>
          <blockquote>
            <p className="serif">{block.text}</p>
          </blockquote>
          {block.attribution ? (
            <figcaption className="mono">{block.attribution}</figcaption>
          ) : null}
        </figure>
      );
    case 'evidence':
      return (
        <aside
          className={`jrn-evidence jrn-evidence--${block.stance}`}
          key={`evidence-${block.title}`}
        >
          <p className="label">{STANCE_LABELS[block.stance]}</p>
          <h3 className="jrn-evidence__title serif">{block.title}</h3>
          <p>{block.body}</p>
          <InlineSources ids={block.refs ?? []} />
        </aside>
      );
    case 'annotation':
      return (
        <aside className="jrn-annotation" key={`annotation-${block.title}`}>
          <p className="label">Scientific annotation</p>
          <h3 className="serif">{block.title}</h3>
          <p>{block.body}</p>
          <InlineSources ids={block.refs ?? []} />
        </aside>
      );
    case 'timeline':
      return (
        <section className="jrn-timeline" key={`timeline-${block.title}`} aria-label={block.title}>
          <h3 className="jrn-subhead serif">{block.title}</h3>
          <ol>
            {block.entries.map((entry) => (
              <li key={`${entry.date}-${entry.title}`}>
                <span className="jrn-timeline__date mono">{entry.date}</span>
                <div>
                  <h4 className="serif">{entry.title}</h4>
                  <p>{entry.body}</p>
                  <InlineSources ids={entry.refs ?? []} />
                </div>
              </li>
            ))}
          </ol>
        </section>
      );
    case 'comparison':
      return (
        <section className="jrn-comparison" key={`comparison-${block.title}`} aria-label={block.title}>
          <h3 className="jrn-subhead serif">{block.title}</h3>
          <div className="jrn-comparison__grid">
            {[block.left, block.right].map((side, index) => (
              <article className="jrn-comparison__side" key={`${side.label}-${index}`}>
                <p className="label">{side.label}</p>
                <h4 className="serif">{side.title}</h4>
                <p>{side.body}</p>
                {side.points?.length ? (
                  <ul>
                    {side.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                ) : null}
                <InlineSources ids={side.refs ?? []} />
              </article>
            ))}
          </div>
          {block.note ? <p className="jrn-note">{block.note}</p> : null}
          <InlineSources ids={block.refs ?? []} />
        </section>
      );
    case 'data':
      return (
        <section className="jrn-data" key={`data-${block.title}`} aria-label={block.title}>
          <h3 className="jrn-subhead serif">{block.title}</h3>
          {block.intro ? <p className="jrn-data__intro">{block.intro}</p> : null}
          <dl className="jrn-data__list">
            {block.entries.map((entry) => (
              <div className="jrn-data__row" key={`${entry.label}-${entry.value}`}>
                <dt>
                  <span className="label">{entry.label}</span>
                  <span className="mono">{entry.value}</span>
                </dt>
                <dd>
                  {entry.detail ? <p>{entry.detail}</p> : null}
                  <InlineSources ids={entry.refs ?? []} />
                </dd>
              </div>
            ))}
          </dl>
          {block.note ? <p className="jrn-note">{block.note}</p> : null}
          <InlineSources ids={block.refs ?? []} />
        </section>
      );
    case 'timescale':
      return <TimescaleBlock block={block} key={`timescale-${block.title}`} />;
    case 'specimen':
      return (
        <div className="jrn-embed" key={`specimen-${block.specimenId}`}>
          <JournalEntityCard kind="specimen" specimenId={block.specimenId} note={block.note} />
        </div>
      );
    case 'species':
      return (
        <div className="jrn-embed" key={`species-${block.speciesId}`}>
          <JournalEntityCard kind="species" speciesId={block.speciesId} note={block.note} />
        </div>
      );
    case 'period':
      return (
        <div className="jrn-embed" key={`period-${block.unitId}`}>
          <JournalEntityCard kind="period" unitId={block.unitId} note={block.note} />
        </div>
      );
    case 'anatomy':
      return (
        <div className="jrn-embed" key={`anatomy-${block.speciesId}-${block.structureId}`}>
          <JournalEntityCard
            kind="anatomy"
            speciesId={block.speciesId}
            structureId={block.structureId}
            note={block.note}
          />
        </div>
      );
    case 'diagram':
      return (
        <figure className="jrn-diagram-block" key={`diagram-${block.variant}-${block.title}`}>
          <figcaption>
            <p className="label">Diagram</p>
            <h3 className="serif">{block.title}</h3>
          </figcaption>
          <div className="jrn-diagram-block__frame">
            <JournalDiagram variant={block.variant} title={block.title} />
          </div>
          <p className="jrn-note">{block.caption}</p>
          <InlineSources ids={block.refs ?? []} />
        </figure>
      );
    default:
      return null;
  }
}

export function JournalArticleBody({ article, sections }: Props) {
  const sectionById = new Map(sections.map((section) => [section.id, section]));

  return (
    <div className="jrn-body">
      {article.blocks.map((block) =>
        renderBlock(block, block.type === 'heading' ? sectionById.get(block.id) : undefined),
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import {
  classification,
  classificationChildren,
  classificationCount,
  classificationNodeById,
  classificationPath,
  classificationRoots,
  disputedClassificationNodes,
  speciesInClassificationNode,
} from '../data/classification';
import type { ClassificationNode } from '../data/types';
import { usePageTitle } from '../lib/usePageTitle';
import { useReveal } from '../lib/useReveal';
import '../styles/pages.css';
import '../styles/classification.css';

const DEFAULT_NODE = 'dinosauria';

type BranchProps = {
  node: ClassificationNode;
  depth: number;
  selectedId: string;
  expanded: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
};

function Branch({ node, depth, selectedId, expanded, onSelect, onToggle }: BranchProps) {
  const children = classificationChildren(node.id);
  const isOpen = expanded.has(node.id);
  const isSelected = selectedId === node.id;

  return (
    <li className={`clade-tree__node${isSelected ? ' is-selected' : ''}`}>
      <div className="clade-tree__row" style={{ ['--depth' as string]: depth }}>
        <button
          type="button"
          className="clade-tree__toggle"
          onClick={() => onToggle(node.id)}
          aria-expanded={children.length ? isOpen : undefined}
          aria-label={
            children.length
              ? `${isOpen ? 'Collapse' : 'Expand'} ${node.label}`
              : `${node.label} has no child clades in this archive`
          }
          disabled={!children.length}
        >
          <ChevronRight size={12} strokeWidth={1.8} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="clade-tree__name"
          onClick={() => {
            onSelect(node.id);
            if (children.length) onToggle(node.id);
          }}
          aria-current={isSelected ? 'true' : undefined}
        >
          <span className="clade-tree__label">{node.label}</span>
          <span className="clade-tree__rank mono">{node.rank}</span>
          <span className="clade-tree__count mono">{classificationCount(node.id)}</span>
          {node.disputed ? (
            <span className="clade-tree__flag" title="Disputed classification">
              ?
            </span>
          ) : null}
        </button>
      </div>

      {children.length && isOpen ? (
        <ul className="clade-tree__children">
          {children.map((child) => (
            <Branch
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              expanded={expanded}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default function ClassificationPage() {
  usePageTitle('Dinosaur classification explorer', {
    description:
      'Explore the MESOZO dinosaur family tree by clade and family. Counts, species links, disputed relationships and the evidence behind the classification.',
  });
  const root = useReveal<HTMLDivElement>();
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('node') ?? DEFAULT_NODE;
  const selectedId = classificationNodeById.has(requested) ? requested : DEFAULT_NODE;
  const selected = classificationNodeById.get(selectedId) ?? classificationNodeById.get(DEFAULT_NODE)!;
  const selectedSpecies = speciesInClassificationNode(selected.id);
  const children = classificationChildren(selected.id);
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(['dinosauria', 'saurischia', 'ornithischia']),
  );

  // The tree opens along the selected path even when the visitor arrives from
  // a shared URL rather than by clicking through the branches.
  useEffect(() => {
    setExpanded((current) => {
      const next = new Set(current);
      next.add(selected.id);
      let cursor: ClassificationNode | undefined = selected;
      while (cursor?.parentId) {
        next.add(cursor.parentId);
        cursor = classificationNodeById.get(cursor.parentId);
      }
      return next;
    });
  }, [selected.id]);

  const selectNode = (id: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('node', id);
    setSearchParams(next, { replace: true });
  };

  const toggleNode = (id: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalWithChildren = selectedSpecies.length;
  const visibleSpecies = selectedSpecies.slice(0, 36);

  return (
    <div className="page classification-page" ref={root}>
      <PageHeader
        index="01.2"
        kicker="Explore / Classification"
        title={
          <>
            A working <em>family tree.</em>
          </>
        }
        intro="Browse the relationships behind the species records. This is a navigational tree, not a ladder of progress: branches can be disputed, and a count includes every species in the descendant clades."
        meta={[
          { label: 'Nodes', value: String(classification.nodes.length) },
          { label: 'Species', value: String(classificationCount(DEFAULT_NODE)) },
          {
            label: 'Disputed',
            value: String(disputedClassificationNodes.length),
          },
        ]}
      />

      <section className="classification shell" aria-labelledby="classification-browse">
        <p className="classification__statement">{classification.statement}</p>

        <div className="classification__layout">
          <aside className="clade-tree" aria-labelledby="classification-browse">
            <div className="clade-tree__head">
              <p className="label" id="classification-browse">
                Browse the tree
              </p>
              <p className="mono">Dinosauria · {classificationCount(DEFAULT_NODE)} species</p>
            </div>
            <ul className="clade-tree__root">
              {classificationRoots().map((node) => (
                <Branch
                  key={node.id}
                  node={node}
                  depth={0}
                  selectedId={selected.id}
                  expanded={expanded}
                  onSelect={selectNode}
                  onToggle={toggleNode}
                />
              ))}
            </ul>
            <p className="clade-tree__note mono">
              ‘?’ marks a node whose relationships or membership are disputed. Counts are species
              in this archive, not estimates of total diversity.
            </p>
          </aside>

          <article className="clade-panel" aria-live="polite">
            <div className="clade-panel__crumb">
              <Link to="/classification">Classification</Link>
              <span aria-hidden="true"> / </span>
              <span>{classificationPath(selected.id)}</span>
            </div>

            <div className="clade-panel__head">
              <div>
                <p className="label">
                  {selected.rank} · {classificationCount(selected.id)} species
                </p>
                <h2 className="serif">{selected.label}</h2>
              </div>
              {selected.disputed ? (
                <span className="clade-panel__disputed">Disputed relationships</span>
              ) : null}
            </div>

            <p className="clade-panel__note">{selected.note}</p>

            {children.length ? (
              <div className="clade-panel__branches">
                <p className="label">Immediate branches</p>
                <div className="clade-panel__chips">
                  {children.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      className="clade-panel__chip"
                      onClick={() => selectNode(child.id)}
                    >
                      <span>{child.label}</span>
                      <span className="mono">{classificationCount(child.id)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="clade-panel__species-head">
              <div>
                <p className="label">Species in this branch</p>
                <h3 className="serif">
                  {totalWithChildren
                    ? `${totalWithChildren} dossier${totalWithChildren === 1 ? '' : 's'}`
                    : 'No dossiers yet'}
                </h3>
              </div>
              <Link
                className="text-link"
                to={
                  selected.taxa.includes('Theropoda')
                    ? '/species?group=Theropoda'
                    : selected.taxa.includes('Sauropodomorpha')
                      ? '/species?group=Sauropodomorpha'
                      : selected.taxa.includes('Ornithischia')
                        ? '/species?group=Ornithischia'
                        : '/species'
                }
              >
                Open the archive <span aria-hidden="true">↗</span>
              </Link>
            </div>

            {selectedSpecies.length ? (
              <ul className="clade-species">
                {visibleSpecies.map((species) => (
                  <li key={species.slug}>
                    <Link to={`/species/${species.slug}`} className="clade-species__link">
                      <span className="clade-species__accession mono">{species.accession}</span>
                      <span className="clade-species__names">
                        <span className="clade-species__sci serif">{species.scientificName}</span>
                        <span className="clade-species__common">{species.commonName}</span>
                      </span>
                      <span className="clade-species__period mono">{species.periodLabel}</span>
                      <span className="clade-species__arrow" aria-hidden="true">
                        ↗
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="clade-panel__empty">
                This branch has no species records in the current archive. It is retained so the
                tree can show the classification without inventing a dossier.
              </p>
            )}

            <p className="clade-panel__foot mono">
              {selectedSpecies.length > visibleSpecies.length
                ? `Showing ${visibleSpecies.length} of ${selectedSpecies.length}. Select a branch to narrow the list.`
                : `${classificationCount(selected.id)} of ${classificationCount(DEFAULT_NODE)} species`}{' '}
              · counts include descendant clades
            </p>
          </article>
        </div>

        <section className="classification__disputed" aria-labelledby="disputed-title">
          <div className="classification__disputed-head">
            <p className="label">Where the tree is unsettled</p>
            <h2 className="serif" id="disputed-title">
              Disagreement is part of the record.
            </h2>
            <p>
              These nodes are flagged because their relationships, membership or rank are actively
              debated. The archive keeps them visible rather than resolving the argument in a
              caption.
            </p>
          </div>
          <ul className="classification__disputed-list">
            {disputedClassificationNodes.map((node) => (
              <li key={node.id}>
                <button type="button" onClick={() => selectNode(node.id)}>
                  <span className="label">{node.rank}</span>
                  <span className="serif">{node.label}</span>
                  <span>{node.note}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </div>
  );
}

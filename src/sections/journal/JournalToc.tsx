import type { JournalSection } from '../../data/journal';

type Props = {
  sections: JournalSection[];
};

export function JournalToc({ sections }: Props) {
  if (!sections.length) return null;

  return (
    <>
      <aside className="jrn-toc" aria-label="In this story">
        <p className="label">In this story</p>
        <nav aria-label="Article contents">
          <ol>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>
                  <span className="mono">{section.number}</span>
                  <span>{section.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <p className="jrn-toc__note mono">Use the index to move without losing the argument.</p>
      </aside>

      <details className="jrn-toc-mobile">
        <summary>
          <span className="label">In this story</span>
          <span className="mono">{sections.length} sections</span>
        </summary>
        <nav aria-label="Article contents">
          <ol>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>
                  <span className="mono">{section.number}</span>
                  <span>{section.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </details>
    </>
  );
}

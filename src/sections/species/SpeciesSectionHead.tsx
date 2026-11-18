import type { ReactNode } from 'react';

type Props = {
  index: string;
  title: ReactNode;
  intro?: string;
};

/** Shared section masthead for every part of a species dossier. */
export function SpeciesSectionHead({ index, title, intro }: Props) {
  return (
    <header className="spx-head" data-reveal>
      <p className="spx-head__index label">{index}</p>
      <div className="spx-head__body">
        <h2 className="serif" data-line>
          <span>{title}</span>
        </h2>
        {intro ? <p className="spx-head__intro">{intro}</p> : null}
      </div>
    </header>
  );
}

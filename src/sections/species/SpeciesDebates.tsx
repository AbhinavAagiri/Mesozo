import { InlineSources } from '../../components/ui/Sources';
import type { Hypothesis, SpeciesPageContent } from '../../data/types';
import { SpeciesSectionHead } from './SpeciesSectionHead';

type Props = {
  debates: NonNullable<SpeciesPageContent['debates']>;
  hypotheses: Hypothesis[];
  index?: string;
};

/** Open questions, presented as evidence and limitations rather than a contest. */
export function SpeciesDebates({ debates, hypotheses, index = '07' }: Props) {
  return (
    <section id="debates" className="spx-section spx-section--tint">
      <div className="shell">
        <SpeciesSectionHead
          index={index}
          title="What is still being argued"
          intro={debates.intro}
        />

        <div className="spx-debates">
          {hypotheses.map((hypothesis, position) => (
            <article className="spx-debate" key={hypothesis.id} data-reveal>
              <header className="spx-debate__head">
                <span className="spx-debate__num mono">
                  {String(position + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="label spx-debate__question">
                    {debates.questions[hypothesis.id] ?? 'Open question'}
                  </p>
                  <h3 className="serif">{hypothesis.name}</h3>
                </div>
                <span className="spx-debate__status label">{hypothesis.status}</span>
              </header>

              <p className="spx-debate__claim">{hypothesis.claim}</p>

              <div className="spx-debate__split">
                <div>
                  <p className="label">What supports it</p>
                  <ul>
                    {hypothesis.support.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="label">What it has to explain</p>
                  <ul>
                    {hypothesis.criticism.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <InlineSources ids={hypothesis.refs} />
            </article>
          ))}
        </div>

        <div className="spx-debates__close" data-reveal>
          <div>
            <p className="label">Common ground</p>
            <p className="serif">{debates.commonGround}</p>
          </div>
          <div>
            <p className="label">What would change the picture</p>
            <p>{debates.whatWouldChange}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

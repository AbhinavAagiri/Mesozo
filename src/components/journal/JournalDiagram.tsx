import { WORLD_LAND_PATH } from '../../data/world-land-path';

type Props = {
  variant: 'feather-quill' | 'kpg-boundary' | 'world-regions' | 'reconstruction-layers';
  title: string;
};

const REGIONS = [
  { label: 'Western North America', x: 175, y: 188, line: 48 },
  { label: 'North Africa', x: 505, y: 245, line: 38 },
  { label: 'Europe', x: 493, y: 171, line: 30 },
  { label: 'Mongolia', x: 690, y: 195, line: 32 },
];

function FeatherQuill({ title }: { title: string }) {
  return (
    <svg
      className="jrn-diagram__svg jrn-diagram__svg--feather"
      viewBox="0 0 900 300"
      role="img"
      aria-label={`${title}. A diagrammatic forearm with six quill knobs.`}
    >
      <g className="jrn-diagram__grid" aria-hidden="true">
        {[56, 112, 168, 224].map((y) => (
          <line key={y} x1="30" x2="870" y1={y} y2={y} />
        ))}
      </g>
      <g aria-hidden="true">
        <path
          className="jrn-diagram__bone"
          d="M 135 167 C 245 142 380 145 505 160 C 610 173 675 173 765 155"
        />
        <path
          className="jrn-diagram__bone-inner"
          d="M 150 167 C 255 151 380 155 505 169 C 605 180 675 180 748 163"
        />
        <path className="jrn-diagram__bone" d="M 676 157 L 733 143 L 760 153 L 730 169 Z" />
        <path className="jrn-diagram__bone" d="M 145 167 L 116 150 L 99 154 L 120 172 Z" />
        {[250, 313, 376, 439, 502, 565].map((x, index) => (
          <circle className="jrn-diagram__mark" cx={x} cy={index < 3 ? 151 : 169} r="8" key={x} />
        ))}
        <line className="jrn-diagram__leader" x1="250" x2="250" y1="142" y2="91" />
        <line className="jrn-diagram__leader" x1="565" x2="565" y1="178" y2="228" />
      </g>
      <text className="jrn-diagram__label" x="250" y="78" textAnchor="middle">
        quill knobs
      </text>
      <text className="jrn-diagram__label" x="565" y="248" textAnchor="middle">
        attachment points for large feathers
      </text>
      <text className="jrn-diagram__small" x="126" y="130">
        proximal
      </text>
      <text className="jrn-diagram__small" x="704" y="132">
        distal
      </text>
      <text className="jrn-diagram__small" x="100" y="205">
        ulna, schematic
      </text>
    </svg>
  );
}

function KpgBoundary({ title }: { title: string }) {
  const layers = [
    { y: 22, h: 48, label: 'Latest Cretaceous' },
    { y: 70, h: 30, label: 'ejecta / boundary clay' },
    { y: 100, h: 56, label: 'earliest Paleogene' },
  ];
  return (
    <svg
      className="jrn-diagram__svg jrn-diagram__svg--kpg"
      viewBox="0 0 900 310"
      role="img"
      aria-label={`${title}. A diagrammatic rock section showing the Cretaceous–Paleogene boundary clay and impact evidence.`}
    >
      <g className="jrn-diagram__grid" aria-hidden="true">
        {[50, 100, 150, 200, 250].map((y) => (
          <line key={y} x1="30" x2="870" y1={y} y2={y} />
        ))}
      </g>
      <rect className="jrn-diagram__section" x="112" y="22" width="220" height="226" />
      {layers.map((layer) => (
        <rect
          className={`jrn-diagram__layer jrn-diagram__layer--${layer.label.includes('boundary') ? 'boundary' : 'rock'}`}
          x="112"
          y={layer.y}
          width="220"
          height={layer.h}
          key={layer.label}
        />
      ))}
      <line className="jrn-diagram__leader" x1="332" x2="430" y1="85" y2="85" />
      <line className="jrn-diagram__leader" x1="332" x2="430" y1="96" y2="136" />
      <line className="jrn-diagram__leader" x1="332" x2="430" y1="123" y2="187" />
      <line className="jrn-diagram__leader" x1="332" x2="430" y1="164" y2="236" />
      <text className="jrn-diagram__small" x="112" y="14">
        younger
      </text>
      <text className="jrn-diagram__small" x="112" y="270">
        older
      </text>
      <g className="jrn-diagram__label">
        <text x="442" y="84">
          boundary clay
        </text>
        <text x="442" y="140">
          iridium anomaly
        </text>
        <text x="442" y="191">
          shocked quartz
        </text>
        <text x="442" y="240">
          melt spherules / ejecta
        </text>
      </g>
      <text className="jrn-diagram__small" x="442" y="278">
        diagrammatic section · not to scale
      </text>
    </svg>
  );
}

function WorldRegions({ title }: { title: string }) {
  return (
    <div className="jrn-world">
      <svg
        className="jrn-diagram__svg jrn-diagram__svg--world"
        viewBox="0 0 1000 500"
        role="img"
        aria-label={`${title}. Diagrammatic modern world outline with approximate regional references for western North America, North Africa, Europe and Mongolia.`}
      >
      <g className="jrn-diagram__grid" aria-hidden="true">
        {[60, 120, 180, 240, 300, 360, 420].map((y) => (
          <line key={`lat-${y}`} x1="0" x2="1000" y1={y} y2={y} />
        ))}
        {[166.7, 333.3, 500, 666.7, 833.3].map((x) => (
          <line key={`lon-${x}`} x1={x} x2={x} y1="0" y2="500" />
        ))}
      </g>
      <path className="jrn-diagram__land" d={WORLD_LAND_PATH} />
      {REGIONS.map((region) => (
        <g key={region.label}>
          <line
            className="jrn-diagram__leader"
            x1={region.x}
            x2={region.x}
            y1={region.y}
            y2={region.y - region.line}
          />
          <circle className="jrn-diagram__mark" cx={region.x} cy={region.y} r="5" />
          <text
            className="jrn-diagram__label jrn-diagram__label--region"
            x={region.x}
            y={region.y - region.line - 12}
            textAnchor="middle"
          >
            {region.label}
          </text>
        </g>
      ))}
      </svg>
      <ul className="jrn-world__legend" aria-label="Approximate regions marked">
        {REGIONS.map((region) => (
          <li key={region.label}>
            <span className="jrn-world__dot" aria-hidden="true" />
            {region.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReconstructionLayers({ title }: { title: string }) {
  const layers = [
    {
      number: '01',
      label: 'Preserved bone',
      body: 'The specimen, cast or impression. This is the observational anchor.',
      kind: 'Evidence',
    },
    {
      number: '02',
      label: 'Missing bone',
      body: 'Reconstructed by comparison with relatives or by mirroring preserved elements.',
      kind: 'Inference',
    },
    {
      number: '03',
      label: 'Soft tissue',
      body: 'Muscle, skin, colour and integument. Rarely preserved; usually an interpretation.',
      kind: 'Interpretation',
    },
    {
      number: '04',
      label: 'Behaviour',
      body: 'Posture, locomotion and ecology. A model built from anatomy and context, not a fossil.',
      kind: 'Hypothesis',
    },
  ];

  return (
    <div className="jrn-layer-diagram" role="group" aria-label={`${title}. Four layers of reconstruction.`}>
      {layers.map((layer) => (
        <div className="jrn-layer-diagram__row" key={layer.label}>
          <span className="jrn-layer-diagram__number mono">{layer.number}</span>
          <div>
            <p className="jrn-layer-diagram__label">{layer.label}</p>
            <p className="jrn-layer-diagram__body">{layer.body}</p>
          </div>
          <span className="jrn-layer-diagram__kind label">{layer.kind}</span>
        </div>
      ))}
    </div>
  );
}

/** Diagrammatic editorial figures, drawn from article data rather than stock imagery. */
export function JournalDiagram({ variant, title }: Props) {
  if (variant === 'feather-quill') return <FeatherQuill title={title} />;
  if (variant === 'kpg-boundary') return <KpgBoundary title={title} />;
  if (variant === 'world-regions') return <WorldRegions title={title} />;
  return <ReconstructionLayers title={title} />;
}

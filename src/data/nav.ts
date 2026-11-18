export type DestinationId = 'explore' | 'world' | 'anatomy' | 'evidence';

export interface NavChild {
  label: string;
  to: string;
  note: string;
  /** Path prefixes that belong to this child. */
  match: string[];
}

export interface NavItem {
  id: DestinationId;
  index: string;
  label: string;
  shortLabel: string;
  to: string;
  note: string;
  children: NavChild[];
}

/**
 * Four destinations, four kinds of question.
 *
 * The parent path is also the hub. Existing routes remain first-class and
 * become the working rooms inside each destination rather than competing
 * headings in the masthead.
 */
export const NAV: NavItem[] = [
  {
    id: 'explore',
    index: '01',
    label: 'Explore',
    shortLabel: 'Explore',
    to: '/explore',
    note: 'Species, classification & field guide',
    children: [
      {
        label: 'Species archive',
        to: '/species',
        note: '113 dossiers, filterable by clade, time, diet and place.',
        match: ['/species'],
      },
      {
        label: 'Classification',
        to: '/classification',
        note: 'The working family tree, with disputed nodes marked.',
        match: ['/classification'],
      },
      {
        label: 'Field guide',
        to: '/learn',
        note: 'Fifteen short guides to dinosaurs, anatomy, time and evidence.',
        match: ['/learn'],
      },
      {
        label: 'Glossary',
        to: '/glossary',
        note: 'Scientific terms explained in plain language.',
        match: ['/glossary'],
      },
    ],
  },
  {
    id: 'world',
    index: '02',
    label: 'Prehistoric World',
    shortLabel: 'Prehistoric World',
    to: '/prehistoric-world',
    note: 'Deep time & ancient ecosystems',
    children: [
      {
        label: 'Deep Time',
        to: '/deep-time',
        note: 'The geological atlas, from the Paleozoic to the present.',
        match: ['/deep-time'],
      },
      {
        label: 'Ancient worlds',
        to: '/prehistoric-world#worlds',
        note: 'Seven formations and the organisms preserved in them.',
        match: ['/prehistoric-world/ecosystem'],
      },
    ],
  },
  {
    id: 'anatomy',
    index: '03',
    label: 'Anatomy & Biology',
    shortLabel: 'Anatomy',
    to: '/anatomy',
    note: 'Bones, function & evidence',
    children: [
      {
        label: 'Anatomical atlas',
        to: '/anatomy',
        note: 'Interactive skeletons with the evidence attached to every structure.',
        match: ['/anatomy'],
      },
      {
        label: 'How movement is read',
        to: '/learn/how-dinosaurs-moved',
        note: 'Joints, limbs, muscles and trackways.',
        match: [],
      },
      {
        label: 'Feeding and growth',
        to: '/learn/what-dinosaurs-ate',
        note: 'What teeth, jaws and bone histology can support.',
        match: [],
      },
    ],
  },
  {
    id: 'evidence',
    index: '04',
    label: 'Fossil Evidence',
    shortLabel: 'Fossil Evidence',
    to: '/fossil-evidence',
    note: 'Specimens, research & uncertainty',
    children: [
      {
        label: 'Fossil archive',
        to: '/discoveries',
        note: 'Specimens, expeditions, revisions and the people behind them.',
        match: ['/discoveries'],
      },
      {
        label: 'Research & field notes',
        to: '/journal',
        note: 'Long-form notes that follow an argument back to its evidence.',
        match: ['/journal'],
      },
      {
        label: 'Evidence standards',
        to: '/fossil-evidence#standards',
        note: 'How a fossil becomes a claim — and where claims stop.',
        match: [],
      },
    ],
  },
];

export const SECONDARY_NAV = [
  { label: 'About MESOZO', to: '/about' },
  { label: 'Sources & licences', to: '/about#credits' },
  { label: 'Corrections', to: '/about#corrections' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Use', to: '/terms' },
];

export function navItemIsActive(item: NavItem, pathname: string): boolean {
  if (pathname === item.to) return true;
  return item.children.some((child) =>
    child.match.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)),
  );
}

export function activeDestination(pathname: string): NavItem | undefined {
  return NAV.find((item) => navItemIsActive(item, pathname));
}

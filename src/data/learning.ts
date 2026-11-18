/**
 * The educational layer.
 *
 * These are short, source-linked reading guides rather than species records.
 * They deliberately explain how a claim is made, not only what the current
 * conclusion is. Internal links are checked by the TypeScript build; external
 * sources point to stable institutional or peer-reviewed pages.
 */

export type LearningTrack = 'foundations' | 'world' | 'anatomy' | 'evidence';

export interface LearningSource {
  label: string;
  url: string;
  note?: string;
}

export interface LearningLink {
  label: string;
  to: string;
  note?: string;
}

export interface LearningSection {
  heading: string;
  paragraphs: string[];
  points?: string[];
  terms?: string[];
}

export interface LearningTopic {
  id: string;
  slug: string;
  title: string;
  kicker: string;
  track: LearningTrack;
  standfirst: string;
  minutes: number;
  sections: LearningSection[];
  keyTerms: string[];
  related: LearningLink[];
  sources: LearningSource[];
}

export interface LearningPathStep {
  label: string;
  title: string;
  body: string;
  to: string;
  kind: 'guide' | 'species' | 'world' | 'anatomy' | 'evidence';
}

export interface LearningPath {
  id: string;
  title: string;
  kicker: string;
  description: string;
  audience: string;
  minutes: number;
  steps: LearningPathStep[];
}

export interface GlossaryEntry {
  id: string;
  term: string;
  short: string;
  definition: string;
  detail?: string;
  related: LearningLink[];
}

export const LEARNING_TRACKS: Array<{
  id: LearningTrack;
  label: string;
  description: string;
}> = [
  {
    id: 'foundations',
    label: 'Foundations',
    description: 'The basic ideas needed to read the rest of the encyclopedia.',
  },
  {
    id: 'world',
    label: 'Prehistoric world',
    description: 'Time, environments and the evidence used to reconstruct them.',
  },
  {
    id: 'anatomy',
    label: 'Anatomy & biology',
    description: 'How bones, teeth and living tissue support arguments about extinct animals.',
  },
  {
    id: 'evidence',
    label: 'How we know',
    description: 'Fossils, fieldwork, dating, reconstruction and scientific uncertainty.',
  },
];

export const learningTopics: LearningTopic[] = [
  {
    id: 'LT01',
    slug: 'what-is-a-dinosaur',
    title: 'What is a dinosaur?',
    kicker: 'Identity, not size',
    track: 'foundations',
    standfirst:
      'Dinosaurs are a branch of reptiles defined by shared skeletal features, not by being large, extinct or frightening. Birds belong inside that branch.',
    minutes: 5,
    sections: [
      {
        heading: 'A branch of the reptile family tree',
        paragraphs: [
          'Dinosauria is a clade: a group containing an ancestor and all of its descendants. The first dinosaurs appeared in the Triassic, roughly 230–245 million years ago, and their descendants include every non-avian dinosaur as well as modern birds.',
          'The name was coined by Richard Owen in 1842 from Greek words meaning “fearfully great lizard”. The name is historical; the scientific definition is genealogical. A dinosaur is not simply any large prehistoric reptile.',
        ],
        terms: ['clade', 'dinosauria', 'mesozoic'],
      },
      {
        heading: 'What the skeleton preserves',
        paragraphs: [
          'Dinosaurs share features of the skull and skeleton, including an upright stance in which the legs sit closer beneath the body than in a sprawling lizard or crocodile. The hip socket is open in a way that allows the femur to move in an upright posture.',
          'These features are preserved in bone. They do not tell us everything about an animal’s life, but they are direct anatomical evidence and they are testable against new fossils.',
        ],
        terms: ['holotype', 'fossil'],
      },
      {
        heading: 'Dinosaurs are not everything in the Mesozoic',
        paragraphs: [
          'Pterosaurs were flying reptiles and a separate branch of the archosaur tree. Plesiosaurs, ichthyosaurs and mosasaurs were marine reptiles. Mammoths and mastodons are mammals that lived long after non-avian dinosaurs. None of them is a dinosaur.',
          'Birds are the exception in the other direction: they are living dinosaurs, nested within the theropod branch. The end-Cretaceous extinction removed the non-avian dinosaurs, not the whole dinosaur clade.',
        ],
        terms: ['archosaur', 'theropod', 'avialae'],
      },
    ],
    keyTerms: ['clade', 'dinosauria', 'archosaur', 'theropod', 'avialae'],
    related: [
      { label: 'The major dinosaur groups', to: '/learn/major-dinosaur-groups' },
      { label: 'Did all dinosaurs go extinct?', to: '/learn/birds-living-dinosaurs' },
      { label: 'Browse the species archive', to: '/species', note: '113 dossiers, each with its own evidence trail.' },
    ],
    sources: [
      {
        label: 'Natural History Museum — What are dinosaurs?',
        url: 'https://www.nhm.ac.uk/discover/what-are-dinosaurs.html',
      },
      {
        label: 'American Museum of Natural History — Types of dinosaurs',
        url: 'https://www.amnh.org/dinosaurs/types-of-dinosaurs',
      },
      {
        label: 'UC Museum of Paleontology — The Dinosauria',
        url: 'https://ucmp.berkeley.edu/diapsids/dinosaur.html',
      },
    ],
  },
  {
    id: 'LT02',
    slug: 'major-dinosaur-groups',
    title: 'The major dinosaur groups',
    kicker: 'A tree, not a ladder',
    track: 'foundations',
    standfirst:
      'The familiar division into theropods, sauropodomorphs and ornithischians is a map of relationships. It is useful precisely because it can be tested and revised.',
    minutes: 6,
    sections: [
      {
        heading: 'Three branches you will meet constantly',
        paragraphs: [
          'Theropods are mostly bipedal dinosaurs and include forms such as Tyrannosaurus, Velociraptor and Spinosaurus. Birds are a surviving theropod lineage. Sauropodomorphs include the long-necked, often enormous plant-eaters such as Brachiosaurus and Patagotitan, as well as early relatives that did not look like them.',
          'Ornithischians were plant-eaters with a backward-pointing pubis, a hip arrangement once compared to birds. The comparison is anatomical, not evidence that ornithischians are closer to birds than theropods are. Stegosaurus, Triceratops and Edmontosaurus are ornithischians.',
        ],
        terms: ['theropod', 'sauropodomorph', 'ornithischian', 'pubis'],
      },
      {
        heading: 'Old names and changing branches',
        paragraphs: [
          'Saurischia was traditionally divided into theropods and sauropodomorphs, while Ornithischia formed the other major branch. Some analyses recover different arrangements among early dinosaurs, so the archive flags disputed nodes instead of presenting the tree as settled.',
          'A family is a smaller branch inside a larger one. Theropoda contains many families; Tyrannosauridae is one of them. A clade can contain another clade, and ranks are labels applied to parts of that nested structure.',
        ],
        terms: ['saurischia', 'family', 'phylogeny'],
      },
      {
        heading: 'How to read a branch',
        paragraphs: [
          'A shared branch means shared ancestry. It does not mean every member looked alike or behaved the same way. Crocodiles are not dinosaurs, but birds and crocodiles are both archosaurs, which is why the archosaur branch is wider than Dinosauria.',
          'When a dossier says “broad clade”, it is making a comparison at that scale. When it says “same family”, the relationship is narrower. The archive labels the strength of the relationship so that a shared habitat is not mistaken for a close cousin.',
        ],
      },
    ],
    keyTerms: ['theropod', 'sauropodomorph', 'ornithischian', 'saurischia', 'family', 'phylogeny'],
    related: [
      { label: 'Open the classification explorer', to: '/classification', note: 'Search the tree by clade and family.' },
      { label: 'Browse theropods', to: '/species?group=Theropoda' },
      { label: 'Browse ornithischians', to: '/species?group=Ornithischia' },
      { label: 'Browse sauropodomorphs', to: '/species?group=Sauropodomorpha' },
    ],
    sources: [
      {
        label: 'National Park Service — Major groups of dinosaurs',
        url: 'https://home.nps.gov/subjects/fossils/major-groups-of-dinosaurs.htm',
      },
      {
        label: 'American Museum of Natural History — Types of dinosaurs',
        url: 'https://www.amnh.org/dinosaurs/types-of-dinosaurs',
      },
    ],
  },
  {
    id: 'LT03',
    slug: 'dinosaur-evolution',
    title: 'How dinosaurs evolved',
    kicker: 'Origins and diversification',
    track: 'foundations',
    standfirst:
      'Dinosaur history is a sequence of branching and extinction, not a single march from small to large. The birds are one surviving branch.',
    minutes: 6,
    sections: [
      {
        heading: 'Triassic beginnings',
        paragraphs: [
          'The earliest dinosaurs appear in the fossil record during the Triassic. They lived alongside many other reptile groups, and for a long time they were not the largest or most abundant land animals.',
          'The end-Triassic extinction, around 201 million years ago, removed many competing groups. Dinosaur lineages survived and diversified in the Jurassic. The pattern is an ecological opening followed by branching, not a single cause-and-effect story that explains every lineage.',
        ],
        terms: ['triassic', 'jurassic', 'extinction'],
      },
      {
        heading: 'Jurassic and Cretaceous worlds',
        paragraphs: [
          'During the Jurassic, sauropods reached enormous body sizes and theropod lineages diversified. In the Cretaceous, flowering plants spread, dinosaur faunas changed regionally, and several groups — including hadrosaurs, ceratopsians and pachycephalosaurs — became prominent in the northern continents.',
          'Geography matters. Continents were moving apart, and provincial faunas developed. A species from Asia and a species from North America may be contemporaries without ever having met.',
        ],
        terms: ['cretaceous', 'sauropod', 'paleogeography'],
      },
      {
        heading: 'Birds are the surviving branch',
        paragraphs: [
          'Feathers, wishbones and other bird-like features occur in non-avian theropods. The evidence for the dinosaur–bird relationship comes from anatomical comparisons, fossil intermediates and the nesting of birds within theropod phylogeny.',
          'The Cretaceous–Paleogene extinction ended the non-avian dinosaurs. The bird lineage survived, which is why “the age of dinosaurs” is not a closed chapter in the history of life.',
        ],
        terms: ['theropod', 'avialae', 'k-pg-boundary'],
      },
    ],
    keyTerms: ['triassic', 'jurassic', 'cretaceous', 'extinction', 'paleogeography', 'avialae'],
    related: [
      { label: 'Read the deep-time atlas', to: '/deep-time' },
      { label: 'The end-Cretaceous extinction', to: '/learn/end-cretaceous-extinction' },
      { label: 'Did all dinosaurs go extinct?', to: '/learn/birds-living-dinosaurs' },
    ],
    sources: [
      {
        label: 'Natural History Museum — Dinosaurs',
        url: 'https://www.nhm.ac.uk/discover/dinosaurs.html',
      },
      {
        label: 'International Chronostratigraphic Chart',
        url: 'https://stratigraphy.org/chart/',
      },
    ],
  },
  {
    id: 'LT04',
    slug: 'reading-deep-time',
    title: 'How to read deep time',
    kicker: 'Eons, eras, periods, epochs',
    track: 'world',
    standfirst:
      'Geological time is a nested hierarchy of names and numerical ages. “Ma” means millions of years before present, and boundaries are conventions backed by evidence.',
    minutes: 5,
    sections: [
      {
        heading: 'The hierarchy',
        paragraphs: [
          'The geological time scale nests eons, eras, periods and epochs. The Phanerozoic eon contains the Paleozoic, Mesozoic and Cenozoic eras. The Mesozoic contains the Triassic, Jurassic and Cretaceous periods. Each period can be divided into epochs and ages.',
          'A period is not a habitat or a type of animal. It is a division of geological time, defined by rock sequences and boundary ages. The same animal can appear in more than one epoch, and a formation can span a boundary.',
        ],
        terms: ['eon', 'era', 'period', 'epoch', 'formation'],
      },
      {
        heading: 'What “Ma” means',
        paragraphs: [
          '“Ma” stands for millions of years before present. A date of 100 Ma is approximately 100 million years before the present. “Mya” is also used for the same idea; this archive uses Ma for consistency.',
          'Numerical ages are estimates with uncertainty. The geological time scale is periodically revised as radiometric dates, stratigraphy and correlation improve. This is why a page should state which chart and version it follows.',
        ],
        terms: ['ma', 'radiometric-dating', 'stratigraphy'],
      },
      {
        heading: 'Why boundaries matter',
        paragraphs: [
          'The end-Cretaceous boundary is not simply a date stamped onto a timeline. It is a horizon in the rock record where a global extinction pattern, impact evidence and radiometric ages converge. The boundary is a scientific object, not a decorative line.',
          'When this archive says “about 66 Ma”, it is compressing a body of stratigraphic work into a readable label. The Deep Time page links the underlying chart and sources.',
        ],
        terms: ['k-pg-boundary', 'biostratigraphy'],
      },
    ],
    keyTerms: ['eon', 'era', 'period', 'epoch', 'ma', 'stratigraphy', 'k-pg-boundary'],
    related: [
      { label: 'Explore the geological time scale', to: '/deep-time' },
      { label: 'How fossils are dated', to: '/learn/dating-fossils' },
      { label: 'Prehistoric World hub', to: '/prehistoric-world' },
    ],
    sources: [
      {
        label: 'International Commission on Stratigraphy — chart',
        url: 'https://stratigraphy.org/chart/',
      },
      {
        label: 'USGS — Divisions of geologic time',
        url: 'https://pubs.usgs.gov/fs/2026/3023/fs20263023.pdf',
      },
    ],
  },
  {
    id: 'LT05',
    slug: 'how-dinosaurs-moved',
    title: 'How dinosaurs moved',
    kicker: 'Bones, joints and tracks',
    track: 'anatomy',
    standfirst:
      'Locomotion is reconstructed from joint surfaces, limb proportions, muscle attachments and fossil trackways. A skeleton can constrain a movement; it rarely records a speed.',
    minutes: 6,
    sections: [
      {
        heading: 'The hip and the limb',
        paragraphs: [
          'An upright stance places the femur closer to vertical beneath the body. In dinosaurs, the hip socket and the shape of the femoral head are part of the evidence for that posture. The arrangement differs from the sprawling gait of crocodiles and lizards.',
          'The limb proportions indicate whether an animal was habitually bipedal, quadrupedal or capable of both. But a bone does not carry a speedometer. Speed estimates combine trackways, stride length, anatomy and assumptions about soft tissue and behaviour.',
        ],
        terms: ['femur', 'bipedal', 'quadrupedal', 'trackway'],
      },
      {
        heading: 'Muscles and soft tissue',
        paragraphs: [
          'Muscle scars on bone mark where muscles attached, not how large or strong they were. Reconstructing musculature requires comparison with living relatives and explicit assumptions about missing tissue.',
          'This is why the anatomical atlas separates preserved bone from reconstructed muscle and from functional inference. A drawing of a running dinosaur can be scientifically informed without being a direct observation.',
        ],
        terms: ['inference', 'reconstruction'],
      },
      {
        heading: 'What tracks add',
        paragraphs: [
          'Trackways preserve footfalls, stride patterns and sometimes social spacing. They can show that animals walked, ran, waded or changed direction. They rarely preserve the trackmaker’s identity, so a track is often attributed to a group rather than a species.',
          'Tracks and skeletons are different kinds of evidence. The best interpretations compare both and state what remains unknown.',
        ],
        terms: ['trace-fossil', 'trackway'],
      },
    ],
    keyTerms: ['femur', 'bipedal', 'quadrupedal', 'trackway', 'inference'],
    related: [
      { label: 'Open the anatomical atlas', to: '/anatomy', note: 'Compare a spinosaurid and a tyrannosaurid skeleton.' },
      { label: 'Tyrannosaurus dossier', to: '/species/tyrannosaurus' },
      { label: 'Spinosaurus dossier', to: '/species/spinosaurus' },
    ],
    sources: [
      {
        label: 'Natural History Museum — What are dinosaurs?',
        url: 'https://www.nhm.ac.uk/discover/what-are-dinosaurs.html',
      },
      {
        label: 'MESOZO anatomical atlas — evidence register',
        url: '/anatomy#sources',
      },
    ],
  },
  {
    id: 'LT06',
    slug: 'what-dinosaurs-ate',
    title: 'What dinosaurs ate',
    kicker: 'Teeth are a start, not a menu',
    track: 'anatomy',
    standfirst:
      'Diet is reconstructed from teeth, jaw mechanics, gut contents, coprolites and tooth wear. Each line of evidence has limits, and a tooth does not record a complete diet.',
    minutes: 6,
    sections: [
      {
        heading: 'Reading the jaws',
        paragraphs: [
          'Serrated, recurved teeth are consistent with slicing flesh. Broad, closely packed teeth and wear patterns are consistent with processing plants. But teeth alone do not tell us what an animal ate on a particular day, how it caught prey, or whether it scavenged.',
          'Jaw joints, bite force estimates and microwear can add functional evidence. Bite force is a model based on skull dimensions, muscle reconstruction and comparison with living animals; it is not a measurement of a living bite.',
        ],
        terms: ['heterodont', 'microwear', 'inference'],
      },
      {
        heading: 'Direct evidence of a meal',
        paragraphs: [
          'Gut contents and coprolites can preserve fragments of food, but they are rare and sample only one moment. A bone in a predator’s body cavity is strong evidence of ingestion; it does not prove whether the animal hunted or scavenged.',
          'The Baryonyx holotype, NHMUK PV R9951, preserved fish scales and teeth in the body-cavity region. That is direct evidence that the animal ate fish. It does not show that fish were its only prey, and the enlarged thumb claw is anatomical evidence whose function is inferred rather than observed.',
          'Isotopes and dental wear can suggest broad dietary categories. They cannot reconstruct a full food web from a single specimen, and they should not be presented as a behavioural script.',
        ],
        terms: ['coprolite', 'isotope'],
      },
      {
        heading: 'Herbivory is not one behaviour',
        paragraphs: [
          'Sauropods, stegosaurs, ceratopsians and hadrosaurs had different jaws, teeth and body sizes. “Herbivore” groups them by a broad diet, not by identical feeding mechanics. Some dinosaurs may have been omnivorous even when their teeth look specialised.',
          'This archive labels diet as a broad category and keeps feeding reconstructions in the evidence-tagged sections. The uncertainty is part of the record.',
        ],
        terms: ['herbivore', 'omnivore'],
      },
    ],
    keyTerms: ['heterodont', 'microwear', 'coprolite', 'isotope', 'herbivore', 'omnivore'],
    related: [
      { label: 'Browse carnivorous dinosaurs', to: '/species?diet=carnivore' },
      { label: 'Browse herbivorous dinosaurs', to: '/species?diet=herbivore' },
      { label: 'Triceratops dossier', to: '/species/triceratops' },
      { label: 'Baryonyx holotype — NHMUK PV R9951', to: '/discoveries/specimen/nhmuk-pv-r9951' },
    ],
    sources: [
      {
        label: 'American Museum of Natural History — Dinosaur facts',
        url: 'https://www.amnh.org/dinosaurs/dinosaur-facts',
      },
      {
        label: 'Natural History Museum — What are dinosaurs?',
        url: 'https://www.nhm.ac.uk/discover/what-are-dinosaurs.html',
      },
      {
        label: 'MESOZO specimen record — Baryonyx holotype, NHMUK PV R9951',
        url: '/discoveries/specimen/nhmuk-pv-r9951',
      },
    ],
  },
  {
    id: 'LT07',
    slug: 'dinosaur-reproduction',
    title: 'Dinosaur reproduction and growth',
    kicker: 'Nests, eggs and ontogeny',
    track: 'anatomy',
    standfirst:
      'Eggs and nests are direct evidence of reproduction. Growth lines and bone histology reveal how some dinosaurs grew. Parental care is an inference that needs more than a nest.',
    minutes: 6,
    sections: [
      {
        heading: 'Eggs, nests and clutches',
        paragraphs: [
          'Dinosaur eggs are known from many formations, and some sites preserve nests with eggs and embryos. The shape and arrangement of eggs can identify a group, but attributing a nest to an exact species is often difficult without embryos or associated adults.',
          'A nest shows where eggs were laid. It does not by itself show who cared for them, how long incubation lasted, or whether several females used the same site. Those questions require additional evidence and careful comparison.',
        ],
        terms: ['ontogeny', 'trace-fossil'],
      },
      {
        heading: 'Growth from the inside',
        paragraphs: [
          'Bone histology can reveal growth lines, fibrolamellar tissue and remodelling. These features suggest that many dinosaurs grew rapidly for part of their lives, but growth rates differ by lineage and body size.',
          'A growth curve is a model built from multiple individuals, not a record of one animal’s life. The age at death and the population sample both affect the result.',
        ],
        terms: ['histology', 'ontogeny'],
      },
      {
        heading: 'Parental care and social behaviour',
        paragraphs: [
          'Maiasaura is famous for nests and juveniles in association with adults, which supports the interpretation of parental care. Even here, the behaviour is inferred from spatial association and comparative biology, not observed directly.',
          'The archive labels such claims as interpretations. A fossil nest is evidence; “a caring parent” is a reconstruction of behaviour.',
        ],
        terms: ['inference'],
      },
    ],
    keyTerms: ['ontogeny', 'histology', 'inference'],
    related: [
      { label: 'Maiasaura dossier', to: '/species/maiasaura' },
      { label: 'Oviraptor dossier', to: '/species/oviraptor' },
      { label: 'Read the evidence key', to: '/about#evidence' },
    ],
    sources: [
      {
        label: 'American Museum of Natural History — Dinosaur eggs',
        url: 'https://www.amnh.org/dinosaurs/dinosaur-eggs',
      },
      {
        label: 'Natural History Museum — Dinosaurs',
        url: 'https://www.nhm.ac.uk/discover/dinosaurs.html',
      },
    ],
  },
  {
    id: 'LT08',
    slug: 'dinosaur-size',
    title: 'How scientists estimate dinosaur size',
    kicker: 'Models with error bars',
    track: 'anatomy',
    standfirst:
      'Length and mass are estimates, not readings from a scale. Different specimens, methods and reconstructions can produce different numbers.',
    minutes: 5,
    sections: [
      {
        heading: 'From bones to body length',
        paragraphs: [
          'A length estimate requires a reconstructed skeleton. Missing bones are restored by comparison with relatives, and the result depends on how the animal is posed. A mounted skeleton can be longer or shorter than the living animal because cartilage and soft tissue are absent.',
          'When a dossier gives a length, it should say whether the figure is a specimen measurement, a reconstructed estimate or a range. A single number without a method looks more precise than the evidence allows.',
        ],
        terms: ['reconstruction', 'holotype'],
      },
      {
        heading: 'Mass is harder',
        paragraphs: [
          'Mass is usually estimated from limb-bone dimensions and body-volume models. These methods depend on how the body is reconstructed, how dense the animal is assumed to have been and whether the specimen is an adult.',
          'A mass estimate can be useful for comparison without being exact. “About 6 tonnes” is a scientific statement with uncertainty; “exactly 6 tonnes” would not be.',
        ],
        terms: ['allometry', 'estimation'],
      },
      {
        heading: 'The largest and the smallest',
        paragraphs: [
          'The largest known sauropods are represented by fragmentary specimens, so their size estimates have wide uncertainty. The smallest non-avian dinosaurs were chicken-sized or smaller. Both extremes are real records, but they are not equally complete.',
          'The archive keeps size notes and citations beside the figures. A number is only as good as the specimen and method behind it.',
        ],
      },
    ],
    keyTerms: ['reconstruction', 'allometry', 'estimation'],
    related: [
      { label: 'Browse the largest sauropods', to: '/species?group=Sauropodomorpha' },
      { label: 'Patagotitan dossier', to: '/species/patagotitan' },
      { label: 'Compsognathus dossier', to: '/species/compsognathus' },
    ],
    sources: [
      {
        label: 'American Museum of Natural History — Dinosaur facts',
        url: 'https://www.amnh.org/dinosaurs/dinosaur-facts',
      },
      {
        label: 'Natural History Museum — Dinosaurs',
        url: 'https://www.nhm.ac.uk/discover/dinosaurs.html',
      },
    ],
  },
  {
    id: 'LT09',
    slug: 'how-fossils-form',
    title: 'How fossils form',
    kicker: 'Preservation is the exception',
    track: 'evidence',
    standfirst:
      'Most organisms leave no fossil. Bones, shells, impressions and traces survive only when burial, chemistry and later geology allow it.',
    minutes: 5,
    sections: [
      {
        heading: 'Burial first',
        paragraphs: [
          'A fossil usually begins when remains are buried quickly enough to escape scavenging and decay. River sediments, lake beds, dunes and volcanic ash can all bury material. The environment at death shapes what can survive.',
          'Bones may be mineralised, replaced or preserved as impressions. Soft tissue is far rarer and usually requires exceptional conditions. A fossil assemblage is therefore a biased sample of the living community.',
        ],
        terms: ['taphonomy', 'permineralisation', 'trace-fossil'],
      },
      {
        heading: 'Body fossils and trace fossils',
        paragraphs: [
          'Body fossils include bones, teeth, shells and eggs. Trace fossils record behaviour or activity: footprints, burrows, bite marks and coprolites. A footprint is not a body, but it can preserve evidence of movement that a skeleton cannot.',
          'The two kinds of evidence answer different questions. A skeleton can identify an animal; a trackway can show that a dinosaur walked through a muddy plain. Neither automatically explains the other.',
        ],
        terms: ['body-fossil', 'trace-fossil', 'coprolite'],
      },
      {
        heading: 'What is lost',
        paragraphs: [
          'Erosion, metamorphism and human activity destroy fossils. Many species are known from a single tooth or a few bones. Absence from the fossil record is not proof of absence in life.',
          'The name-bearing specimen of Leaellynasaura, NMV P185991, is a left cheek and maxilla from a juvenile. The rest of the skull and the postcranial skeleton were not part of the holotype, so the familiar long-tailed reconstruction is not a portrait of the type. The gap is part of the record, not an invitation to fill it with a guess.',
          'The archive marks unillustrated species with a database plate rather than a borrowed reconstruction. A gap in the record is information, not an invitation to fill it.',
        ],
        terms: ['taphonomy'],
      },
    ],
    keyTerms: ['taphonomy', 'permineralisation', 'body-fossil', 'trace-fossil', 'coprolite'],
    related: [
      { label: 'Fossil Evidence hub', to: '/fossil-evidence' },
      { label: 'Open the fossil archive', to: '/discoveries#archive' },
      { label: 'How palaeontologists work', to: '/learn/how-palaeontologists-work' },
      { label: 'Leaellynasaura holotype — NMV P185991', to: '/discoveries/specimen/nmv-p185991' },
    ],
    sources: [
      {
        label: 'Natural History Museum — How are dinosaur fossils formed?',
        url: 'https://www.nhm.ac.uk/discover/how-are-fossils-formed.html',
      },
      {
        label: 'National Park Service — Fossils and paleontology',
        url: 'https://www.nps.gov/subjects/fossils/',
      },
      {
        label: 'MESOZO specimen record — Leaellynasaura holotype, NMV P185991',
        url: '/discoveries/specimen/nmv-p185991',
      },
    ],
  },
  {
    id: 'LT10',
    slug: 'how-palaeontologists-work',
    title: 'How palaeontologists work',
    kicker: 'Fieldwork, provenance, preparation',
    track: 'evidence',
    standfirst:
      'A fossil without provenance loses much of its scientific value. Discovery is a process of survey, recording, excavation, preparation and publication.',
    minutes: 6,
    sections: [
      {
        heading: 'Finding and recording',
        paragraphs: [
          'Fieldwork begins with geological mapping and survey. Palæontologists look for rock units of the right age and environment, then record the position of every find. GPS coordinates, stratigraphic level and association with other fossils all matter.',
          'A specimen removed without context can still be studied, but its age, environment and relationships become harder or impossible to establish. Provenance is part of the evidence.',
        ],
        terms: ['provenance', 'stratigraphy', 'formation'],
      },
      {
        heading: 'Excavation and preparation',
        paragraphs: [
          'Fragile fossils are often encased in a plaster jacket before removal. In the laboratory, preparators remove matrix under magnification, stabilise cracks and record what was done. Preparation can reveal anatomy, but it can also damage evidence if not documented.',
          'Casts and mounted skeletons are useful for display and research, but they are not the original fossil. Museum labels should distinguish specimen, cast and reconstruction.',
        ],
        terms: ['holotype', 'reconstruction'],
      },
      {
        heading: 'Publication and replication',
        paragraphs: [
          'A discovery becomes part of the scientific record when it is described, figured and deposited in an accessible collection. Peer review does not guarantee that an interpretation is correct, but it exposes the claim to expert scrutiny.',
          'The Spinosaurus holotype, BSP 1912 VIII 19, was destroyed in Munich in 1944. Its jaw fragments, teeth and vertebral spines can no longer be rechecked, so later referrals to the species rely on morphology and provenance rather than direct comparison with the type. The loss is a permanent limit on the evidence, not an inconvenience.',
          'Later researchers may re-examine the specimen, apply new methods or find more material. Scientific knowledge changes because the evidence base changes, not because someone simply decides that an old answer is unfashionable.',
        ],
        terms: ['peer-review', 'holotype'],
      },
    ],
    keyTerms: ['provenance', 'stratigraphy', 'peer-review', 'holotype'],
    related: [
      { label: 'Discovery archive', to: '/discoveries' },
      { label: 'Research & field notes', to: '/journal' },
      { label: 'Read a referred skull — MSNM V4047', to: '/discoveries/specimen/msnm-v4047' },
      { label: 'Read a lost holotype — BSP 1912 VIII 19', to: '/discoveries/specimen/bsp-1912-viii-19' },
    ],
    sources: [
      {
        label: 'Natural History Museum — How are dinosaur fossils formed?',
        url: 'https://www.nhm.ac.uk/discover/how-are-fossils-formed.html',
      },
      {
        label: 'National Park Service — Fossils and paleontology',
        url: 'https://www.nps.gov/subjects/fossils/',
      },
      {
        label: 'MESOZO specimen record — Spinosaurus holotype, BSP 1912 VIII 19',
        url: '/discoveries/specimen/bsp-1912-viii-19',
      },
    ],
  },
  {
    id: 'LT11',
    slug: 'dating-fossils',
    title: 'How fossils are dated',
    kicker: 'Rocks, isotopes and correlation',
    track: 'evidence',
    standfirst:
      'Fossils are usually dated through the rocks around them. Relative order, biostratigraphy and radiometric ages work together; a fossil does not carry its own date stamp.',
    minutes: 6,
    sections: [
      {
        heading: 'Relative and numerical ages',
        paragraphs: [
          'Relative dating places rocks in order using superposition and cross-cutting relationships. A fossil in a lower layer is older than one in an undisturbed layer above it. This gives sequence without a number.',
          'Numerical dating uses radioactive decay in minerals. Volcanic ash beds can be dated radiometrically and correlated across a basin. The result is an age for the ash, and a bracket for fossils above and below it.',
          'The archive’s own formations show why a period label is coarse. Tyrannosaurus is recorded from the Hell Creek Formation, about 68–66 Ma; Spinosaurus from the Kem Kem Group, about 100–94 Ma. Both are Cretaceous, but they are separated by roughly 30 million years. The stage name, not the period alone, makes the comparison meaningful.',
        ],
        terms: ['relative-dating', 'radiometric-dating', 'biostratigraphy'],
      },
      {
        heading: 'Biostratigraphy and index fossils',
        paragraphs: [
          'Some fossils have short geological ranges and wide geographic distributions, making them useful for correlation. If the same species appears in two separated rock sections, those sections may be close in age.',
          'Index fossils are not clocks. They are correlation tools that depend on accurate taxonomy and on the assumption that the species’ range is correctly known.',
        ],
        terms: ['biostratigraphy', 'index-fossil'],
      },
      {
        heading: 'The K–Pg boundary',
        paragraphs: [
          'At the end of the Cretaceous, impact ejecta, iridium enrichment, shocked quartz and radiometric ages converge on a boundary about 66 million years old. The age is a result of multiple independent lines of evidence, not a single measurement.',
          'Even a well-dated boundary has uncertainty. The archive reports approximate ages and links the time scale it uses rather than pretending to a precision the data do not support.',
        ],
        terms: ['k-pg-boundary', 'radiometric-dating'],
      },
    ],
    keyTerms: ['relative-dating', 'radiometric-dating', 'biostratigraphy', 'index-fossil', 'k-pg-boundary'],
    related: [
      { label: 'Deep Time atlas', to: '/deep-time' },
      { label: 'How to read deep time', to: '/learn/reading-deep-time' },
      { label: 'Hell Creek Formation — latest Cretaceous', to: '/prehistoric-world/ecosystem/hell-creek-formation' },
      { label: 'The end-Cretaceous extinction', to: '/learn/end-cretaceous-extinction' },
    ],
    sources: [
      {
        label: 'International Commission on Stratigraphy — chart',
        url: 'https://stratigraphy.org/chart/',
      },
      {
        label: 'USGS — Divisions of geologic time',
        url: 'https://pubs.usgs.gov/fs/2026/3023/fs20263023.pdf',
      },
      {
        label: 'MESOZO ancient world — Kem Kem Group',
        url: '/prehistoric-world/ecosystem/kem-kem-group',
      },
      {
        label: 'MESOZO ancient world — Hell Creek Formation',
        url: '/prehistoric-world/ecosystem/hell-creek-formation',
      },
    ],
  },
  {
    id: 'LT12',
    slug: 'reconstructing-extinct-animals',
    title: 'Reconstructing extinct animals',
    kicker: 'Layers of inference',
    track: 'evidence',
    standfirst:
      'A life reconstruction combines skeleton, muscle, integument and behaviour. Each layer is a separate claim, and a convincing image can hide how much is inferred.',
    minutes: 6,
    sections: [
      {
        heading: 'From skeleton to body',
        paragraphs: [
          'The skeleton provides the framework. Muscles are reconstructed from attachment scars, comparative anatomy and biomechanics. Cartilage, fat and skin are added by inference. The result is a model, not a photograph of the past.',
          'Spinosaurus shows how many layers one reconstruction can contain. BSP 1912 VIII 19, the name-bearing material, is a partial skeleton destroyed in 1944. FSAC-KK 11888 is a partial associated skeleton proposed as a neotype, and its referral to the Egyptian species is contested; published mounts restore missing parts. MSNM V4047 is a referred skull. The silhouette is an argument built from several specimens of different completeness, not a portrait of one individual.',
          'Different researchers can produce different reconstructions from the same bones. That is not a failure of the method; it is a visible consequence of missing soft tissue and competing functional hypotheses.',
        ],
        terms: ['reconstruction', 'inference', 'phylogenetic-bracketing', 'composite-reconstruction'],
      },
      {
        heading: 'Colour and integument',
        paragraphs: [
          'Melanosomes preserved in feathers and skin can suggest colour in exceptional cases. For most dinosaurs, colour is unknown. A colourful reconstruction is an artistic choice unless it is explicitly tied to preserved evidence.',
          'Feathers are known in many theropods and in some ornithischians. The distribution is patchy, and the absence of preserved feathers is not proof that an animal was scaly.',
        ],
        terms: ['melanosome', 'integument'],
      },
      {
        heading: 'How to read an image',
        paragraphs: [
          'Ask what is preserved, what is reconstructed and what is speculation. The caption should identify the artist, the source and the licence. An image without that information is not a scientific figure.',
          'This archive labels life reconstructions as reconstructions and uses database plates where no licensed image exists. The image is never treated as a specimen.',
        ],
        terms: ['reconstruction'],
      },
    ],
    keyTerms: ['reconstruction', 'inference', 'phylogenetic-bracketing', 'composite-reconstruction', 'melanosome', 'integument'],
    related: [
      { label: 'Anatomy & Biology hub', to: '/anatomy' },
      { label: 'Read a reconstruction case', to: '/species/spinosaurus' },
      { label: 'Proposed neotype — FSAC-KK 11888', to: '/discoveries/specimen/fsac-kk-11888' },
      { label: 'Research & field notes', to: '/journal' },
    ],
    sources: [
      {
        label: 'Natural History Museum — Dinosaurs',
        url: 'https://www.nhm.ac.uk/discover/dinosaurs.html',
      },
      {
        label: 'MESOZO — About the evidence key',
        url: '/about#evidence',
      },
      {
        label: 'MESOZO specimen record — Spinosaurus, FSAC-KK 11888',
        url: '/discoveries/specimen/fsac-kk-11888',
      },
    ],
  },
  {
    id: 'LT13',
    slug: 'end-cretaceous-extinction',
    title: 'The end-Cretaceous extinction',
    kicker: 'What happened 66 million years ago',
    track: 'world',
    standfirst:
      'A large asteroid struck Chicxulub at a time of volcanic activity and climate stress. The impact is the leading explanation for the end-Cretaceous mass extinction.',
    minutes: 6,
    sections: [
      {
        heading: 'The evidence at the boundary',
        paragraphs: [
          'A thin clay layer at the Cretaceous–Paleogene boundary contains elevated iridium, shocked quartz, microtektites and other impact markers at sites around the world. The Chicxulub crater, buried beneath the Yucatán Peninsula, is the matching impact structure.',
          'Radiometric dates place the impact and the boundary very close in time. The convergence of stratigraphic, geochemical and geophysical evidence is why the impact hypothesis is not just a story about a rock from space.',
        ],
        terms: ['k-pg-boundary', 'iridium-anomaly', 'chicxulub'],
      },
      {
        heading: 'Why ecosystems collapsed',
        paragraphs: [
          'The impact would have produced heat, shock waves, tsunamis and a long period of reduced sunlight. Food webs dependent on photosynthesis would have been disrupted. The details of the kill mechanism are still researched.',
          'The Deccan Traps eruptions in India were ongoing around the same interval and may have stressed ecosystems before the impact. The relative contributions are debated; the evidence does not support a simple single-cause story with no uncertainty.',
        ],
        terms: ['deccan-traps', 'extinction'],
      },
      {
        heading: 'What survived',
        paragraphs: [
          'Non-avian dinosaurs disappeared. Birds, mammals, crocodilians, turtles and many other lineages survived. Survival was selective, and the reasons differ by group and region.',
          'The extinction did not end all dinosaurs because birds are dinosaurs. The phrase “non-avian dinosaurs” is the precise one.',
        ],
        terms: ['avialae', 'extinction'],
      },
    ],
    keyTerms: ['k-pg-boundary', 'iridium-anomaly', 'chicxulub', 'deccan-traps', 'extinction', 'avialae'],
    related: [
      { label: 'Deep Time atlas — Cretaceous', to: '/deep-time?period=cretaceous' },
      { label: 'Did all dinosaurs go extinct?', to: '/learn/birds-living-dinosaurs' },
      { label: 'Read the research notes', to: '/journal' },
    ],
    sources: [
      {
        label: 'Schulte et al. (2010), Science — Chicxulub impact and the K–Pg boundary',
        url: 'https://www.science.org/doi/10.1126/science.1177265',
      },
      {
        label: 'Chiarenza et al. (2020), PNAS — Asteroid impact and dinosaur extinction',
        url: 'https://www.pnas.org/doi/10.1073/pnas.2006087117',
      },
      {
        label: 'National Park Service — Extinction events',
        url: 'https://www.nps.gov/subjects/fossils/extinction-events.htm',
      },
    ],
  },
  {
    id: 'LT14',
    slug: 'birds-living-dinosaurs',
    title: 'Did all dinosaurs go extinct?',
    kicker: 'The surviving branch',
    track: 'foundations',
    standfirst:
      'Birds are living dinosaurs. The end-Cretaceous extinction removed the non-avian branches, not the entire clade.',
    minutes: 5,
    sections: [
      {
        heading: 'The family tree is the argument',
        paragraphs: [
          'Birds share a common ancestor with theropod dinosaurs and are nested within that branch. Their skeletons retain dinosaurian features: a wishbone, a three-fingered hand modified for flight, and a hip and ankle structure that places them among theropods.',
          'Feathered non-avian dinosaurs and early bird-like fossils document a series of transitional forms. The evidence is not a single “missing link”; it is a branching pattern supported by many specimens.',
        ],
        terms: ['theropod', 'avialae', 'clade'],
      },
      {
        heading: 'What the extinction removed',
        paragraphs: [
          'The Cretaceous–Paleogene extinction ended all non-avian dinosaur lineages. The bird lineage survived, diversified and produced the roughly 11,000 living bird species recognised today.',
          'Calling birds “living dinosaurs” is therefore a statement about ancestry, not a metaphor. It also means that “dinosaur extinction” needs a qualifier: non-avian dinosaurs went extinct.',
        ],
        terms: ['extinction', 'k-pg-boundary'],
      },
      {
        heading: 'Why the distinction matters',
        paragraphs: [
          'The bird–dinosaur relationship changes how we interpret feathers, growth, metabolism and behaviour. It also makes clear that extinction is not a single event that erases a whole branch evenly.',
          'The archive follows the same convention: birds are dinosaurs, pterosaurs are not, and the phrase “non-avian dinosaur” is used when the distinction matters.',
        ],
        terms: ['avialae', 'dinosauria'],
      },
    ],
    keyTerms: ['theropod', 'avialae', 'clade', 'dinosauria', 'extinction'],
    related: [
      { label: 'Read the end-Cretaceous guide', to: '/learn/end-cretaceous-extinction' },
      { label: 'Archaeopteryx and early birds in the journal', to: '/journal/the-feather-question' },
      { label: 'Browse theropods', to: '/species?group=Theropoda' },
    ],
    sources: [
      {
        label: 'American Museum of Natural History — Dinosaurs',
        url: 'https://www.amnh.org/dinosaurs',
      },
      {
        label: 'UC Museum of Paleontology — The Dinosauria',
        url: 'https://ucmp.berkeley.edu/diapsids/dinosaur.html',
      },
    ],
  },
  {
    id: 'LT15',
    slug: 'ancient-worlds',
    title: 'Reconstructing ancient worlds',
    kicker: 'Landscapes from fragments',
    track: 'world',
    standfirst:
      'Ancient environments are reconstructed from sediments, fossils, chemistry and geology. A scene is an interpretation of those lines of evidence, never a photograph.',
    minutes: 6,
    sections: [
      {
        heading: 'The rock records an environment',
        paragraphs: [
          'Sandstone, mudstone, limestone and volcanic ash each form in particular settings. Grain size, sedimentary structures and cross-bedding can indicate rivers, lakes, dunes or shallow seas. A formation is a body of rock with a measurable extent, not a single habitat.',
          'Fossils add biological context: pollen, plant fragments, invertebrates and vertebrates. Their relative abundance and preservation can suggest water depth, salinity, climate and the proximity of land.',
        ],
        terms: ['formation', 'sedimentology', 'facies'],
      },
      {
        heading: 'Climate and geography',
        paragraphs: [
          'Oxygen isotopes, plant fossils and growth rings can provide climate clues. Palaeogeographic maps reconstruct where continents and oceans were, but their coastlines and elevations carry uncertainty.',
          'An ancient environment is not a modern ecosystem relocated. It is a set of conditions reconstructed from evidence, with no guarantee that every organism present has been found or that every reconstructed interaction happened.',
        ],
        terms: ['paleogeography', 'isotope'],
      },
      {
        heading: 'What an ecosystem page can and cannot say',
        paragraphs: [
          'A formation page can say which species are preserved in the same rock unit and what the sediment suggests about the setting. It cannot assume that every pair of species met, competed or ate one another.',
          'The Prehistoric World pages keep those limits visible. Shared stratigraphic context is a starting point for ecological questions, not a conclusion about behaviour.',
        ],
        terms: ['formation', 'taphonomy'],
      },
    ],
    keyTerms: ['formation', 'sedimentology', 'facies', 'paleogeography', 'isotope', 'taphonomy'],
    related: [
      { label: 'Prehistoric World hub', to: '/prehistoric-world' },
      { label: 'Explore the ancient worlds', to: '/prehistoric-world#worlds' },
      { label: 'Deep Time atlas', to: '/deep-time' },
    ],
    sources: [
      {
        label: 'Natural History Museum — Dinosaurs',
        url: 'https://www.nhm.ac.uk/discover/dinosaurs.html',
      },
      {
        label: 'International Commission on Stratigraphy — chart',
        url: 'https://stratigraphy.org/chart/',
      },
    ],
  },
];

export const learningTopicById = new Map(learningTopics.map((topic) => [topic.id, topic]));
export const learningTopicBySlug = new Map(learningTopics.map((topic) => [topic.slug, topic]));

export function learningTopicsForTrack(track: LearningTrack): LearningTopic[] {
  return learningTopics.filter((topic) => topic.track === track);
}

export function getLearningTopic(slug: string | undefined): LearningTopic | undefined {
  return slug ? learningTopicBySlug.get(slug) : undefined;
}

export function learningTopicNeighbours(topic: LearningTopic): {
  previous?: LearningTopic;
  next?: LearningTopic;
} {
  const index = learningTopics.findIndex((item) => item.id === topic.id);
  return {
    previous: index > 0 ? learningTopics[index - 1] : undefined,
    next: index >= 0 && index < learningTopics.length - 1 ? learningTopics[index + 1] : undefined,
  };
}

export const learningPaths: LearningPath[] = [
  {
    id: 'understanding-dinosaurs',
    title: 'Understanding dinosaurs',
    kicker: 'Start from zero',
    description:
      'A short route through the definition, the family tree, the fossil evidence and the living descendants. No prior palaeontology required.',
    audience: 'For the first-time visitor',
    minutes: 26,
    steps: [
      {
        label: '01 · Identity',
        title: 'What makes a dinosaur?',
        body: 'Begin with the clade and the skeletal features that define it. Separate dinosaurs from pterosaurs, marine reptiles and mammals.',
        to: '/learn/what-is-a-dinosaur',
        kind: 'guide',
      },
      {
        label: '02 · Branches',
        title: 'The major groups',
        body: 'Meet theropods, sauropodomorphs and ornithischians, then open the classification tree and follow a branch into the archive.',
        to: '/learn/major-dinosaur-groups',
        kind: 'guide',
      },
      {
        label: '03 · Time',
        title: 'Origins and diversification',
        body: 'Follow the Triassic beginning, Jurassic and Cretaceous worlds, and the branching that produced birds.',
        to: '/learn/dinosaur-evolution',
        kind: 'guide',
      },
      {
        label: '04 · Body',
        title: 'How a dinosaur worked',
        body: 'Read a real skeleton in the anatomical atlas, separating preserved bone from reconstructed muscle and inferred function.',
        to: '/anatomy',
        kind: 'anatomy',
      },
      {
        label: '05 · Survival',
        title: 'The surviving branch',
        body: 'Finish with the end-Cretaceous extinction and the evidence that birds are living dinosaurs.',
        to: '/learn/birds-living-dinosaurs',
        kind: 'guide',
      },
    ],
  },
  {
    id: 'age-of-dinosaurs',
    title: 'The age of dinosaurs',
    kicker: 'Triassic to Cretaceous',
    description:
      'Read the Mesozoic as a sequence of worlds: origins, diversification, regional ecosystems and the boundary that ended the non-avian branches.',
    audience: 'For the visitor who wants the big picture',
    minutes: 24,
    steps: [
      {
        label: '01 · Triassic',
        title: 'Before the dinosaurs dominated',
        body: 'Start in the Triassic, when the first dinosaurs lived alongside many other reptile groups.',
        to: '/deep-time?period=triassic',
        kind: 'world',
      },
      {
        label: '02 · Jurassic',
        title: 'A world of giants',
        body: 'Explore the Jurassic through the Morrison Formation and the sauropods, stegosaurs and theropods preserved there.',
        to: '/prehistoric-world/ecosystem/morrison-formation',
        kind: 'world',
      },
      {
        label: '03 · Cretaceous',
        title: 'Regional ecosystems',
        body: 'Compare the Kem Kem, Djadochta, Hell Creek and Weald Clay records. Each is a different window into the Cretaceous.',
        to: '/prehistoric-world#worlds',
        kind: 'world',
      },
      {
        label: '04 · Boundary',
        title: 'The end of the Cretaceous',
        body: 'Examine the impact evidence, the Deccan eruptions and the selective survival of birds.',
        to: '/learn/end-cretaceous-extinction',
        kind: 'guide',
      },
    ],
  },
  {
    id: 'how-palaeontology-works',
    title: 'How palaeontology works',
    kicker: 'From field to claim',
    description:
      'Follow a fossil from burial to publication, then learn how dating, reconstruction and disagreement are handled.',
    audience: 'For the student or sceptical reader',
    minutes: 28,
    steps: [
      {
        label: '01 · Preservation',
        title: 'How fossils form',
        body: 'Start with burial, mineralisation and the bias built into the fossil record.',
        to: '/learn/how-fossils-form',
        kind: 'guide',
      },
      {
        label: '02 · Fieldwork',
        title: 'Finding and recording a specimen',
        body: 'See how provenance, excavation and preparation turn a find into evidence.',
        to: '/learn/how-palaeontologists-work',
        kind: 'guide',
      },
      {
        label: '03 · Dating',
        title: 'Putting the fossil in time',
        body: 'Learn how relative order, biostratigraphy and radiometric dates combine.',
        to: '/learn/dating-fossils',
        kind: 'guide',
      },
      {
        label: '04 · Reconstruction',
        title: 'Building an extinct animal',
        body: 'Separate skeleton, muscle, integument and behaviour, then test a reconstruction against its evidence.',
        to: '/learn/reconstructing-extinct-animals',
        kind: 'guide',
      },
      {
        label: '05 · Specimen',
        title: 'Reading the claim',
        body: 'Open a type specimen and follow its material, publications and uncertainty statement back to the animal it names.',
        to: '/discoveries/specimen/nmv-p185991',
        kind: 'evidence',
      },
    ],
  },
  {
    id: 'meet-the-giants',
    title: 'Meet the giants',
    kicker: 'Size, not a single group',
    description:
      'Large body size evolved more than once. Compare giant sauropods, giant theropods and the evidence behind their estimates.',
    audience: 'For the visitor who came for the spectacular',
    minutes: 30,
    steps: [
      {
        label: '01 · Scale',
        title: 'How we estimate size',
        body: 'Understand why mass and length are models with error bars before meeting the largest animals.',
        to: '/learn/dinosaur-size',
        kind: 'guide',
      },
      {
        label: '02 · Sauropods',
        title: 'Argentinosaurus',
        body: 'Open one giant sauropod and read its size note. The figures are modelled ranges, not measurements of a complete animal.',
        to: '/species/argentinosaurus',
        kind: 'species',
      },
      {
        label: '03 · Sauropods',
        title: 'Patagotitan',
        body: 'A second giant, known from several associated skeletons from one quarry. Compare what its completeness does — and does not — settle.',
        to: '/species/patagotitan',
        kind: 'species',
      },
      {
        label: '04 · Theropods',
        title: 'Tyrannosaurus',
        body: 'A large predator recorded from the latest Cretaceous of Hell Creek, with a dense research record and a familiar silhouette.',
        to: '/species/tyrannosaurus',
        kind: 'species',
      },
      {
        label: '05 · Theropods',
        title: 'Spinosaurus',
        body: 'A second large predator whose skeleton, ecology and posture are actively debated. Read the dossier for what the specimens do not settle.',
        to: '/species/spinosaurus',
        kind: 'species',
      },
      {
        label: '06 · Anatomy',
        title: 'Read a giant skeleton',
        body: 'Use the atlas to see how size changes the interpretation of the skull, limbs and body.',
        to: '/anatomy',
        kind: 'anatomy',
      },
    ],
  },
  {
    id: 'life-in-ancient-worlds',
    title: 'Life in ancient ecosystems',
    kicker: 'Formation by formation',
    description:
      'Choose a rock formation, meet the organisms preserved in it, and learn what the sediment can and cannot say about their interactions.',
    audience: 'For the visitor who wants context, not just a species',
    minutes: 25,
    steps: [
      {
        label: '01 · Method',
        title: 'Reconstructing an ancient world',
        body: 'Begin with the limits: a formation is a rock unit, not a complete ecosystem.',
        to: '/learn/ancient-worlds',
        kind: 'guide',
      },
      {
        label: '02 · Rivers and coasts',
        title: 'The Kem Kem Group',
        body: 'Explore a mid-Cretaceous North African record with several large predators and a fragmentary fossil record.',
        to: '/prehistoric-world/ecosystem/kem-kem-group',
        kind: 'world',
      },
      {
        label: '03 · Floodplains',
        title: 'The Morrison Formation',
        body: 'Compare the Late Jurassic floodplain record and its sauropod-dominated fauna.',
        to: '/prehistoric-world/ecosystem/morrison-formation',
        kind: 'world',
      },
      {
        label: '04 · The last world',
        title: 'Hell Creek',
        body: 'End in the latest Cretaceous, shortly before the non-avian dinosaurs disappear.',
        to: '/prehistoric-world/ecosystem/hell-creek-formation',
        kind: 'world',
      },
    ],
  },
];

export const learningPathById = new Map(learningPaths.map((path) => [path.id, path]));

export function getLearningPath(id: string | undefined): LearningPath | undefined {
  return id ? learningPathById.get(id) : undefined;
}

export const glossaryEntries: GlossaryEntry[] = [
  {
    id: 'allometry',
    term: 'Allometry',
    short: 'How body proportions change with size.',
    definition:
      'The study of how different parts of an organism scale relative to one another as body size changes. It is used when estimating mass, limb proportions and growth.',
    related: [
      { label: 'Estimating dinosaur size', to: '/learn/dinosaur-size' },
    ],
  },
  {
    id: 'archosaur',
    term: 'Archosaur',
    short: 'The wider reptile branch containing birds and crocodilians.',
    definition:
      'A member of Archosauria, the reptile clade that includes birds, crocodilians, pterosaurs and dinosaurs. Dinosaurs are archosaurs, but not all archosaurs are dinosaurs.',
    related: [
      { label: 'What is a dinosaur?', to: '/learn/what-is-a-dinosaur' },
      { label: 'Classification explorer', to: '/classification' },
    ],
  },
  {
    id: 'avialae',
    term: 'Avialae',
    short: 'The bird-line dinosaur branch.',
    definition:
      'The clade containing birds and the theropod dinosaurs more closely related to them than to other theropods. The exact membership depends on the analysis used.',
    detail:
      'Avialae is nested inside Theropoda. The word is useful because “bird” is a living category while Avialae is a genealogical one.',
    related: [
      { label: 'Did all dinosaurs go extinct?', to: '/learn/birds-living-dinosaurs' },
      { label: 'Theropoda', to: '/glossary#theropod' },
    ],
  },
  {
    id: 'bipedal',
    term: 'Bipedal',
    short: 'Walking on two legs.',
    definition:
      'A posture in which the hind limbs support the body during walking or running. Many dinosaurs were habitually bipedal; others were quadrupedal or facultatively bipedal.',
    related: [
      { label: 'How dinosaurs moved', to: '/learn/how-dinosaurs-moved' },
    ],
  },
  {
    id: 'biostratigraphy',
    term: 'Biostratigraphy',
    short: 'Correlating rocks using their fossils.',
    definition:
      'The use of fossil distributions to correlate rock layers and establish relative ages. It depends on accurate taxonomy and known stratigraphic ranges.',
    related: [
      { label: 'Dating fossils', to: '/learn/dating-fossils' },
    ],
  },
  {
    id: 'body-fossil',
    term: 'Body fossil',
    short: 'Preserved remains of an organism.',
    definition:
      'A fossil that preserves part of an organism’s body, such as a bone, tooth, shell, egg or leaf. It is distinguished from a trace fossil, which records activity.',
    related: [
      { label: 'How fossils form', to: '/learn/how-fossils-form' },
      { label: 'Trace fossil', to: '/glossary#trace-fossil' },
    ],
  },
  {
    id: 'chicxulub',
    term: 'Chicxulub',
    short: 'The buried impact structure in Mexico.',
    definition:
      'A roughly 180-kilometre-wide impact structure beneath the Yucatán Peninsula, dated to the Cretaceous–Paleogene boundary. It is the strongest candidate for the impact associated with the end-Cretaceous extinction.',
    related: [
      { label: 'The end-Cretaceous extinction', to: '/learn/end-cretaceous-extinction' },
    ],
  },
  {
    id: 'clade',
    term: 'Clade',
    short: 'An ancestor and all its descendants.',
    definition:
      'A monophyletic group: one common ancestor plus every descendant of that ancestor. Dinosauria and Theropoda are clades; “large dinosaurs” is not.',
    detail:
      'Clades are nested. A bird is inside Avialae, which is inside Theropoda, which is inside Dinosauria. This nesting is what “birds are dinosaurs” means.',
    related: [
      { label: 'What is a dinosaur?', to: '/learn/what-is-a-dinosaur' },
      { label: 'Major dinosaur groups', to: '/learn/major-dinosaur-groups' },
    ],
  },
  {
    id: 'coprolite',
    term: 'Coprolite',
    short: 'A fossilised dropping.',
    definition:
      'Fossilised faecal material. Coprolites can preserve food fragments and parasites, but attribution to a specific animal is often uncertain.',
    related: [
      { label: 'What dinosaurs ate', to: '/learn/what-dinosaurs-ate' },
    ],
  },
  {
    id: 'cretaceous',
    term: 'Cretaceous',
    short: 'The final Mesozoic period, about 145–66 Ma.',
    definition:
      'The third and youngest period of the Mesozoic era. It ended at the Cretaceous–Paleogene boundary, when all non-avian dinosaurs became extinct.',
    related: [
      { label: 'Deep Time — Cretaceous', to: '/deep-time?period=cretaceous' },
      { label: 'The end-Cretaceous extinction', to: '/learn/end-cretaceous-extinction' },
    ],
  },
  {
    id: 'deccan-traps',
    term: 'Deccan Traps',
    short: 'Large flood-basalt eruptions in India.',
    definition:
      'A large igneous province formed by volcanic eruptions around the end of the Cretaceous. Their role in the extinction is debated alongside the Chicxulub impact.',
    related: [
      { label: 'The end-Cretaceous extinction', to: '/learn/end-cretaceous-extinction' },
    ],
  },
  {
    id: 'dinosauria',
    term: 'Dinosauria',
    short: 'The dinosaur clade.',
    definition:
      'The clade containing the most recent common ancestor of Megalosaurus and Iguanodon and all its descendants. Modern birds are descendants within Dinosauria.',
    related: [
      { label: 'What is a dinosaur?', to: '/learn/what-is-a-dinosaur' },
    ],
  },
  {
    id: 'eon',
    term: 'Eon',
    short: 'The largest division of geological time.',
    definition:
      'The highest formal rank in the geological time scale. The Phanerozoic eon contains the Paleozoic, Mesozoic and Cenozoic eras.',
    related: [
      { label: 'Reading deep time', to: '/learn/reading-deep-time' },
    ],
  },
  {
    id: 'epoch',
    term: 'Epoch',
    short: 'A subdivision of a geological period.',
    definition:
      'A formal unit of geological time below a period. The Cretaceous, for example, is divided into epochs such as the Early and Late Cretaceous.',
    related: [
      { label: 'Reading deep time', to: '/learn/reading-deep-time' },
    ],
  },
  {
    id: 'era',
    term: 'Era',
    short: 'A major division of an eon.',
    definition:
      'A formal geological time unit below an eon and above a period. The Mesozoic era contains the Triassic, Jurassic and Cretaceous periods.',
    related: [
      { label: 'Reading deep time', to: '/learn/reading-deep-time' },
    ],
  },
  {
    id: 'extinction',
    term: 'Extinction',
    short: 'The end of a lineage.',
    definition:
      'The disappearance of a species or clade. A mass extinction is a geologically rapid loss of many lineages across many environments.',
    detail:
      'Extinction is not always a single moment. Background extinction occurs continuously; mass extinctions cluster at boundaries such as the end of the Cretaceous.',
    related: [
      { label: 'The end-Cretaceous extinction', to: '/learn/end-cretaceous-extinction' },
      { label: 'Did all dinosaurs go extinct?', to: '/learn/birds-living-dinosaurs' },
    ],
  },
  {
    id: 'family',
    term: 'Family',
    short: 'A rank below order and above genus.',
    definition:
      'A taxonomic rank grouping related genera. Families are nested inside larger clades and can be revised when relationships change.',
    related: [
      { label: 'Classification explorer', to: '/classification' },
      { label: 'Major dinosaur groups', to: '/learn/major-dinosaur-groups' },
    ],
  },
  {
    id: 'facies',
    term: 'Facies',
    short: 'A rock body distinguished by its characteristics.',
    definition:
      'A set of sedimentary features that reflect a particular environment or process, such as a river channel, lagoon or dune field. Facies are used to reconstruct ancient landscapes.',
    related: [
      { label: 'Reconstructing ancient worlds', to: '/learn/ancient-worlds' },
    ],
  },
  {
    id: 'formation',
    term: 'Formation',
    short: 'A mappable body of rock.',
    definition:
      'A named rock unit with a defined lower and upper boundary, mapped at the Earth’s surface or in the subsurface. A formation can contain several environments and span a range of time.',
    detail:
      'The Hell Creek Formation is a rock unit, not an ecosystem. Species found in the same formation are stratigraphic neighbours; they need not have lived side by side.',
    related: [
      { label: 'Prehistoric World — ancient worlds', to: '/prehistoric-world#worlds' },
      { label: 'Reconstructing ancient worlds', to: '/learn/ancient-worlds' },
    ],
  },
  {
    id: 'fossil',
    term: 'Fossil',
    short: 'Preserved evidence of past life.',
    definition:
      'Physical evidence of a past organism, including body fossils such as bones and teeth, and trace fossils such as footprints, burrows and coprolites.',
    related: [
      { label: 'How fossils form', to: '/learn/how-fossils-form' },
      { label: 'Fossil Evidence hub', to: '/fossil-evidence' },
    ],
  },
  {
    id: 'herbivore',
    term: 'Herbivore',
    short: 'An animal that eats plants.',
    definition:
      'A broad dietary category. Herbivorous dinosaurs had diverse feeding mechanics and may have consumed different plant parts or included other foods occasionally.',
    related: [
      { label: 'What dinosaurs ate', to: '/learn/what-dinosaurs-ate' },
    ],
  },
  {
    id: 'heterodont',
    term: 'Heterodont',
    short: 'Having more than one tooth form.',
    definition:
      'A dentition with different tooth shapes in different positions of the jaw. Heterodonty can indicate a complex feeding repertoire, but it does not by itself prove diet.',
    related: [
      { label: 'What dinosaurs ate', to: '/learn/what-dinosaurs-ate' },
    ],
  },
  {
    id: 'histology',
    term: 'Histology',
    short: 'The microscopic study of tissue.',
    definition:
      'In palaeontology, the study of bone microstructure. Growth lines reveal ontogeny, and tissue type can suggest growth rates and remodelling.',
    related: [
      { label: 'Dinosaur reproduction and growth', to: '/learn/dinosaur-reproduction' },
    ],
  },
  {
    id: 'holotype',
    term: 'Holotype',
    short: 'The specimen that anchors a species name.',
    definition:
      'The single specimen designated as the name-bearing type of a species. Other specimens can be referred to the species, but the holotype is the permanent reference.',
    related: [
      { label: 'How palaeontologists work', to: '/learn/how-palaeontologists-work' },
      { label: 'Specimen records', to: '/discoveries#archive' },
      { label: 'Baryonyx holotype — NHMUK PV R9951', to: '/discoveries/specimen/nhmuk-pv-r9951' },
    ],
  },
  {
    id: 'lectotype',
    term: 'Lectotype',
    short: 'A specimen later chosen from a syntype series to anchor a name.',
    definition:
      'A name-bearing specimen selected after the original description when no single holotype was designated. A lectotype designation fixes one specimen as the permanent reference, but it does not change the original publication date.',
    related: [
      { label: 'How palaeontologists work', to: '/learn/how-palaeontologists-work' },
      { label: 'Specimen records', to: '/discoveries#archive' },
    ],
  },
  {
    id: 'neotype',
    term: 'Neotype',
    short: 'A replacement name-bearing specimen for a lost type.',
    definition:
      'A specimen designated to replace a holotype, lectotype or syntype series that is lost or destroyed, under the conditions of the zoological code. A proposed neotype is not automatically accepted, and its status can be disputed.',
    related: [
      { label: 'Spinosaurus specimen record', to: '/discoveries/specimen/fsac-kk-11888' },
      { label: 'How palaeontologists work', to: '/learn/how-palaeontologists-work' },
    ],
  },
  {
    id: 'referred-specimen',
    term: 'Referred specimen',
    short: 'A specimen assigned to a species after its original description.',
    definition:
      'A fossil that was not part of the name-bearing type series but is later assigned to the species by an author. A referral is an anatomical argument, not a fact of the original description, and it can be revised or rejected.',
    related: [
      { label: 'Specimen records', to: '/discoveries#archive' },
      { label: 'Reconstructing extinct animals', to: '/learn/reconstructing-extinct-animals' },
      { label: 'Referred skull — MSNM V4047', to: '/discoveries/specimen/msnm-v4047' },
    ],
  },
  {
    id: 'synonymy',
    term: 'Synonymy',
    short: 'Different names applied to the same taxon.',
    definition:
      'A taxonomic relationship in which two or more names refer to the same species or genus. The older available name usually has priority, but a synonymy is a tested taxonomic conclusion, not a guess based on similar appearance.',
    related: [
      { label: 'Classification explorer', to: '/classification' },
      { label: 'How palaeontologists work', to: '/learn/how-palaeontologists-work' },
    ],
  },
  {
    id: 'composite-reconstruction',
    term: 'Composite reconstruction',
    short: 'A skeleton or restoration assembled from more than one individual.',
    definition:
      'A mount, skeleton drawing or life restoration that combines bones from several specimens, casts or sculpted missing parts. It can be a useful exhibit, but it is not a single excavated animal and should not be read as one.',
    related: [
      { label: 'Reconstructing extinct animals', to: '/learn/reconstructing-extinct-animals' },
      { label: 'Fossil evidence standards', to: '/fossil-evidence#standards' },
      { label: 'Proposed neotype — FSAC-KK 11888', to: '/discoveries/specimen/fsac-kk-11888' },
    ],
  },
  {
    id: 'hypothesis',
    term: 'Hypothesis',
    short: 'A testable explanation, not a settled fact.',
    definition:
      'A proposed explanation that can be checked against evidence. A scientific hypothesis is expected to make predictions that could fail; it is not a guess, and a well-supported hypothesis is still open to revision.',
    detail:
      'MESOZO labels a claim as an active debate when competing hypotheses remain defensible. The Spinosaurus debates section sets out the support and the criticisms side by side rather than choosing one for the reader.',
    related: [
      { label: 'Spinosaurus — open questions', to: '/species/spinosaurus#debates' },
      { label: 'The end-Cretaceous extinction', to: '/learn/end-cretaceous-extinction' },
      { label: 'Evidence standards', to: '/fossil-evidence#standards' },
    ],
  },
  {
    id: 'index-fossil',
    term: 'Index fossil',
    short: 'A fossil used to correlate rock layers.',
    definition:
      'A fossil with a short geological range and broad geographic distribution, useful for identifying contemporaneous rocks in different places.',
    related: [
      { label: 'Dating fossils', to: '/learn/dating-fossils' },
    ],
  },
  {
    id: 'inference',
    term: 'Inference',
    short: 'A conclusion drawn from evidence, not observed directly.',
    definition:
      'An interpretation based on preserved evidence and comparison. A feeding behaviour or a muscle reconstruction is an inference, not a fossil.',
    related: [
      { label: 'Read the evidence key', to: '/about#evidence' },
      { label: 'Reconstructing extinct animals', to: '/learn/reconstructing-extinct-animals' },
    ],
  },
  {
    id: 'integument',
    term: 'Integument',
    short: 'The outer covering of an animal.',
    definition:
      'Skin, scales, feathers and other outer tissues. Integument is rarely preserved, so reconstructions of colour and covering usually involve inference.',
    related: [
      { label: 'Reconstructing extinct animals', to: '/learn/reconstructing-extinct-animals' },
    ],
  },
  {
    id: 'iridium-anomaly',
    term: 'Iridium anomaly',
    short: 'A thin layer enriched in iridium at the K–Pg boundary.',
    definition:
      'An enrichment of iridium found at many Cretaceous–Paleogene boundary sites. It is one line of evidence for a large impact, alongside shocked minerals and ejecta.',
    related: [
      { label: 'The end-Cretaceous extinction', to: '/learn/end-cretaceous-extinction' },
    ],
  },
  {
    id: 'isotope',
    term: 'Isotope',
    short: 'An atom variant used as an environmental tracer.',
    definition:
      'Atoms of the same element with different numbers of neutrons. Stable and radiogenic isotopes can provide evidence about diet, climate, temperature and age.',
    related: [
      { label: 'What dinosaurs ate', to: '/learn/what-dinosaurs-ate' },
      { label: 'Reconstructing ancient worlds', to: '/learn/ancient-worlds' },
    ],
  },
  {
    id: 'jurassic',
    term: 'Jurassic',
    short: 'The middle Mesozoic period, about 201–145 Ma.',
    definition:
      'The second period of the Mesozoic era. It saw the diversification of many dinosaur groups, including very large sauropods, and is represented in this archive by the Morrison Formation.',
    related: [
      { label: 'Deep Time — Jurassic', to: '/deep-time?period=jurassic' },
      { label: 'Morrison Formation', to: '/prehistoric-world/ecosystem/morrison-formation' },
    ],
  },
  {
    id: 'k-pg-boundary',
    term: 'K–Pg boundary',
    short: 'The Cretaceous–Paleogene boundary, about 66 Ma.',
    definition:
      'The geological boundary marking the end of the Cretaceous and the beginning of the Paleogene. It coincides with the extinction of non-avian dinosaurs and many other groups.',
    detail:
      '“K” is the traditional abbreviation for Cretaceous, from the German Kreide. “Pg” stands for Paleogene.',
    related: [
      { label: 'The end-Cretaceous extinction', to: '/learn/end-cretaceous-extinction' },
      { label: 'Reading deep time', to: '/learn/reading-deep-time' },
    ],
  },
  {
    id: 'ma',
    term: 'Ma',
    short: 'Millions of years before present.',
    definition:
      'A unit of geological age equal to one million years. “66 Ma” means approximately 66 million years before the present.',
    related: [
      { label: 'Reading deep time', to: '/learn/reading-deep-time' },
    ],
  },
  {
    id: 'melanosome',
    term: 'Melanosome',
    short: 'A pigment-bearing cell structure.',
    definition:
      'Microscopic structures that carry melanin pigment. When preserved in fossils, their shape can sometimes suggest original colour, but the inference is not always straightforward.',
    related: [
      { label: 'Reconstructing extinct animals', to: '/learn/reconstructing-extinct-animals' },
    ],
  },
  {
    id: 'mesozoic',
    term: 'Mesozoic',
    short: 'The era of the dinosaurs, about 252–66 Ma.',
    definition:
      'The middle era of the Phanerozoic eon, containing the Triassic, Jurassic and Cretaceous periods. It ended with the Cretaceous–Paleogene extinction.',
    related: [
      { label: 'Prehistoric World hub', to: '/prehistoric-world' },
      { label: 'Deep Time atlas', to: '/deep-time' },
    ],
  },
  {
    id: 'microwear',
    term: 'Microwear',
    short: 'Microscopic marks on teeth.',
    definition:
      'Fine scratches, pits and polish on tooth surfaces that can provide evidence of diet or jaw movement. It is an inference-based method and depends on comparison with known diets.',
    related: [
      { label: 'What dinosaurs ate', to: '/learn/what-dinosaurs-ate' },
    ],
  },
  {
    id: 'omnivore',
    term: 'Omnivore',
    short: 'An animal that eats both plant and animal food.',
    definition:
      'A broad dietary category. Omnivory can be difficult to detect in fossils and may be inferred from tooth shape, wear or gut contents.',
    related: [
      { label: 'What dinosaurs ate', to: '/learn/what-dinosaurs-ate' },
    ],
  },
  {
    id: 'ontogeny',
    term: 'Ontogeny',
    short: 'The growth and development of an individual.',
    definition:
      'The sequence of growth from embryo to adult. Ontogenetic variation can make juveniles look like different species, so it matters in taxonomy and size estimation.',
    related: [
      { label: 'Dinosaur reproduction and growth', to: '/learn/dinosaur-reproduction' },
    ],
  },
  {
    id: 'ornithischian',
    term: 'Ornithischian',
    short: 'One of the major dinosaur branches.',
    definition:
      'A member of Ornithischia, a dinosaur clade characterised in part by a backward-pointing pubis. It includes stegosaurs, ankylosaurs, ceratopsians, pachycephalosaurs and hadrosaurs.',
    related: [
      { label: 'Major dinosaur groups', to: '/learn/major-dinosaur-groups' },
      { label: 'Browse ornithischians', to: '/species?group=Ornithischia' },
    ],
  },
  {
    id: 'paleogeography',
    term: 'Palaeogeography',
    short: 'The geography of ancient Earth.',
    definition:
      'The reconstruction of continents, oceans, mountain belts and coastlines at a past time. It is based on geology and geophysics and carries uncertainty.',
    related: [
      { label: 'Reconstructing ancient worlds', to: '/learn/ancient-worlds' },
    ],
  },
  {
    id: 'peer-review',
    term: 'Peer review',
    short: 'Expert scrutiny before publication.',
    definition:
      'The process in which independent researchers evaluate a manuscript before publication. It is a filter, not a guarantee that a conclusion is correct.',
    related: [
      { label: 'How palaeontologists work', to: '/learn/how-palaeontologists-work' },
      { label: 'Research & field notes', to: '/journal' },
    ],
  },
  {
    id: 'period',
    term: 'Period',
    short: 'A major subdivision of an era.',
    definition:
      'A formal geological time unit below an era. The Triassic, Jurassic and Cretaceous are the three periods of the Mesozoic.',
    related: [
      { label: 'Reading deep time', to: '/learn/reading-deep-time' },
      { label: 'Deep Time atlas', to: '/deep-time' },
    ],
  },
  {
    id: 'permineralisation',
    term: 'Permineralisation',
    short: 'Minerals filling spaces in buried tissue.',
    definition:
      'A fossilisation process in which minerals precipitate in the pores and cavities of bone or other tissue. It can preserve fine internal structure.',
    related: [
      { label: 'How fossils form', to: '/learn/how-fossils-form' },
    ],
  },
  {
    id: 'phylogenetic-bracketing',
    term: 'Phylogenetic bracketing',
    short: 'Inferring a trait from living relatives.',
    definition:
      'A method of inferring an unknown feature in an extinct organism from its position between living relatives that share that feature. It is an inference, not a direct observation.',
    related: [
      { label: 'Reconstructing extinct animals', to: '/learn/reconstructing-extinct-animals' },
    ],
  },
  {
    id: 'phylogeny',
    term: 'Phylogeny',
    short: 'The branching history of a group.',
    definition:
      'A hypothesis of evolutionary relationships, usually represented as a tree. Different data and methods can produce different trees, which is why disputed nodes are marked.',
    related: [
      { label: 'Classification explorer', to: '/classification' },
      { label: 'Major dinosaur groups', to: '/learn/major-dinosaur-groups' },
    ],
  },
  {
    id: 'provenance',
    term: 'Provenance',
    short: 'The origin and history of a specimen.',
    definition:
      'The documented place, stratigraphic context and collection history of a fossil. Provenance is essential for establishing age, environment and authenticity.',
    related: [
      { label: 'How palaeontologists work', to: '/learn/how-palaeontologists-work' },
      { label: 'Fossil archive', to: '/discoveries#archive' },
    ],
  },
  {
    id: 'pubis',
    term: 'Pubis',
    short: 'One of the three bones of the pelvis.',
    definition:
      'The forward-pointing bone of the hip in most tetrapods. Its orientation is one of the traditional differences between saurischian and ornithischian dinosaurs.',
    related: [
      { label: 'Major dinosaur groups', to: '/learn/major-dinosaur-groups' },
    ],
  },
  {
    id: 'quadrupedal',
    term: 'Quadrupedal',
    short: 'Walking on four legs.',
    definition:
      'A posture in which all four limbs support the body. Many ornithischians and sauropodomorphs were quadrupedal; some dinosaurs could use both postures.',
    related: [
      { label: 'How dinosaurs moved', to: '/learn/how-dinosaurs-moved' },
    ],
  },
  {
    id: 'radiometric-dating',
    term: 'Radiometric dating',
    short: 'Age from radioactive decay.',
    definition:
      'A method of estimating the age of rocks or minerals from the ratio of radioactive parent to daughter isotopes. It dates the material, not necessarily the fossil inside it.',
    related: [
      { label: 'Dating fossils', to: '/learn/dating-fossils' },
    ],
  },
  {
    id: 'femur',
    term: 'Femur',
    short: 'The thigh bone.',
    definition:
      'The upper bone of the hind limb, between the hip and the knee. Its shape, orientation and muscle scars are central evidence for posture, stance and locomotion in dinosaurs.',
    detail:
      'A femur can show that the limb was held close to the body, but it does not record how fast the animal moved. Speed claims require trackways, limb proportions and explicit biomechanical assumptions.',
    related: [
      { label: 'How dinosaurs moved', to: '/learn/how-dinosaurs-moved' },
      { label: 'Anatomy & Biology', to: '/anatomy' },
    ],
  },
  {
    id: 'estimation',
    term: 'Estimation',
    short: 'A number produced by a model, with uncertainty.',
    definition:
      'A quantitative claim derived from measurements and assumptions rather than direct observation. Length, mass and speed estimates are models: the method and the error should travel with the number.',
    related: [
      { label: 'How dinosaur size is estimated', to: '/learn/dinosaur-size' },
      { label: 'Allometry', to: '/glossary#allometry' },
    ],
  },
  {
    id: 'relative-dating',
    term: 'Relative dating',
    short: 'Ordering rocks without a numerical age.',
    definition:
      'Establishing the sequence of geological events using superposition, cross-cutting relationships and fossil correlation. It gives order, not a date.',
    related: [
      { label: 'Dating fossils', to: '/learn/dating-fossils' },
    ],
  },
  {
    id: 'reconstruction',
    term: 'Reconstruction',
    short: 'An authored model of something not preserved.',
    definition:
      'A drawing, model or mount that restores missing anatomy or depicts a living animal. It is an interpretation and should be labelled as such.',
    related: [
      { label: 'Reconstructing extinct animals', to: '/learn/reconstructing-extinct-animals' },
      { label: 'Anatomy & Biology', to: '/anatomy' },
    ],
  },
  {
    id: 'saurischia',
    term: 'Saurischia',
    short: 'The “lizard-hipped” dinosaur branch.',
    definition:
      'A traditional dinosaur division containing theropods and sauropodomorphs. The name refers to the hip arrangement, not to a living lizard relationship.',
    related: [
      { label: 'Major dinosaur groups', to: '/learn/major-dinosaur-groups' },
      { label: 'Classification explorer', to: '/classification' },
    ],
  },
  {
    id: 'sauropod',
    term: 'Sauropod',
    short: 'A long-necked, usually large sauropodomorph.',
    definition:
      'A member of Sauropoda, the branch of Sauropodomorpha that includes the familiar long-necked, four-legged plant-eaters. Not every sauropodomorph was a sauropod, and not every sauropod was equally large.',
    detail:
      'Sauropod body size is estimated from incomplete skeletons, so the largest known forms carry wide uncertainty. A single femur can establish that an animal was large; it cannot by itself reconstruct the whole animal.',
    related: [
      { label: 'Major dinosaur groups', to: '/learn/major-dinosaur-groups' },
      { label: 'How dinosaur size is estimated', to: '/learn/dinosaur-size' },
      { label: 'Browse sauropodomorphs', to: '/species?group=Sauropodomorpha' },
    ],
  },
  {
    id: 'sauropodomorph',
    term: 'Sauropodomorph',
    short: 'The long-necked dinosaur branch.',
    definition:
      'A member of Sauropodomorpha, the dinosaur clade that includes sauropods and their early relatives. Many later sauropodomorphs were large, long-necked quadrupeds.',
    related: [
      { label: 'Major dinosaur groups', to: '/learn/major-dinosaur-groups' },
      { label: 'Browse sauropodomorphs', to: '/species?group=Sauropodomorpha' },
    ],
  },
  {
    id: 'sedimentology',
    term: 'Sedimentology',
    short: 'The study of sediments and sedimentary rocks.',
    definition:
      'The study of how sediments are produced, transported and deposited. It provides the environmental context for fossils and formations.',
    related: [
      { label: 'Reconstructing ancient worlds', to: '/learn/ancient-worlds' },
    ],
  },
  {
    id: 'stratigraphy',
    term: 'Stratigraphy',
    short: 'The order and correlation of rock layers.',
    definition:
      'The study of the sequence, age and correlation of sedimentary and other layered rocks. It is fundamental to dating fossils and reconstructing environments.',
    related: [
      { label: 'Reading deep time', to: '/learn/reading-deep-time' },
      { label: 'Dating fossils', to: '/learn/dating-fossils' },
    ],
  },
  {
    id: 'taphonomy',
    term: 'Taphonomy',
    short: 'What happens between death and discovery.',
    definition:
      'The study of how organisms decay, are buried, preserved or destroyed. Taphonomy explains why the fossil record is incomplete and biased.',
    related: [
      { label: 'How fossils form', to: '/learn/how-fossils-form' },
      { label: 'Reconstructing ancient worlds', to: '/learn/ancient-worlds' },
    ],
  },
  {
    id: 'theropod',
    term: 'Theropod',
    short: 'The mostly bipedal dinosaur branch.',
    definition:
      'A member of Theropoda, a large dinosaur clade including Tyrannosaurus, Spinosaurus, Velociraptor and birds. Most non-avian theropods were bipedal and many were carnivorous.',
    related: [
      { label: 'Major dinosaur groups', to: '/learn/major-dinosaur-groups' },
      { label: 'Browse theropods', to: '/species?group=Theropoda' },
    ],
  },
  {
    id: 'trace-fossil',
    term: 'Trace fossil',
    short: 'Evidence of activity, not a body.',
    definition:
      'A fossil record of behaviour or activity, such as a footprint, trackway, burrow, bite mark or coprolite. It is distinct from a body fossil.',
    related: [
      { label: 'How fossils form', to: '/learn/how-fossils-form' },
      { label: 'How dinosaurs moved', to: '/learn/how-dinosaurs-moved' },
    ],
  },
  {
    id: 'trackway',
    term: 'Trackway',
    short: 'A series of footprints.',
    definition:
      'A sequence of footprints that records movement. Trackways can provide evidence of gait, speed and social spacing, but usually not the exact species of the trackmaker.',
    related: [
      { label: 'How dinosaurs moved', to: '/learn/how-dinosaurs-moved' },
      { label: 'Trace fossil', to: '/glossary#trace-fossil' },
    ],
  },
  {
    id: 'triassic',
    term: 'Triassic',
    short: 'The first Mesozoic period, about 252–201 Ma.',
    definition:
      'The earliest period of the Mesozoic era. Dinosaurs first appear in the Triassic, alongside many other reptile groups; the end-Triassic extinction changed the balance of faunas.',
    related: [
      { label: 'Deep Time — Triassic', to: '/deep-time?period=triassic' },
      { label: 'How dinosaurs evolved', to: '/learn/dinosaur-evolution' },
    ],
  },
].sort((a, b) => a.term.localeCompare(b.term));

export const glossaryById = new Map(glossaryEntries.map((entry) => [entry.id, entry]));

export function getGlossaryEntry(id: string | undefined): GlossaryEntry | undefined {
  return id ? glossaryById.get(id) : undefined;
}

export function glossaryTermsFor(ids: string[]): GlossaryEntry[] {
  return ids.map((id) => glossaryById.get(id)).filter((entry): entry is GlossaryEntry => Boolean(entry));
}

export const glossaryLetters = Array.from(
  new Set(glossaryEntries.map((entry) => entry.term[0].toUpperCase())),
).sort();

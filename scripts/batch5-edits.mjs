// References, research trails and targeted dossier corrections for the fifth
// and final research cohort. Applied by enrich-species-pass5.mjs.

export const newReferences = [
  {
    id: 'gilmore1931',
    authors: 'Gilmore, C. W.',
    year: 1931,
    title: 'A new species of troödont dinosaur from the Lance Formation of Wyoming',
    journal: 'Proceedings of the United States National Museum',
    volume: '79',
    issue: '2875',
    pages: '1–6',
    doi: '10.5479/si.00963801.79-2875.1',
    url: 'https://doi.org/10.5479/si.00963801.79-2875.1',
    sourceType: 'Peer-reviewed article',
    note: 'Names Troodon wyomingensis for USNM 12031; the species later became the type species of Pachycephalosaurus.',
  },
  {
    id: 'brown1943',
    authors: 'Brown, B., & Schlaikjer, E. M.',
    year: 1943,
    title:
      'A study of the troödont dinosaurs, with the description of a new genus and four new species',
    journal: 'Bulletin of the American Museum of Natural History',
    volume: '82',
    issue: '5',
    pages: '119–149',
    sourceType: 'Peer-reviewed article',
    note: 'Erects Pachycephalosaurus and transfers Gilmore’s Troodon wyomingensis to it.',
  },
  {
    id: 'primary-stegosaurus',
    authors: 'Marsh, O. C.',
    year: 1887,
    title:
      'Principal characters of American Jurassic dinosaurs. Part IX. The skull and dermal armour of Stegosaurus',
    journal: 'American Journal of Science',
    volume: 's3-34',
    issue: '203',
    pages: '413–417',
    doi: '10.2475/ajs.s3-34.203.413',
    url: 'https://doi.org/10.2475/ajs.s3-34.203.413',
    sourceType: 'Peer-reviewed article',
    note: 'Original description of Stegosaurus stenops, based on USNM 4934 from Garden Park, Colorado.',
  },
  {
    id: 'nmv-p185991',
    authors: 'Museums Victoria',
    year: 2026,
    title: 'Fossil specimen P185991: Leaellynasaura amicagraphica holotype',
    url: 'https://collections.museumsvictoria.com.au/specimens/1065222',
    sourceType: 'Museum catalogue',
    note: 'Item-level Museums Victoria record for the holotype, identified as a dinosaur jaw and marked holotype. Access date 2026.',
  },
  {
    id: 'herne2019',
    authors: 'Herne, M. C., Tait, A. M., & Salisbury, S. W.',
    year: 2019,
    title:
      'New small-bodied ornithopods (Dinosauria, Neornithischia) from the Early Cretaceous Wonthaggi Formation (Strzelecki Group) of the Australian-Antarctic rift system, with revision of Qantassaurus intrepidus Rich and Vickers-Rich, 1999',
    journal: 'Journal of Paleontology',
    volume: '93',
    issue: '3',
    pages: '543–584',
    doi: '10.1017/jpa.2018.95',
    url: 'https://doi.org/10.1017/jpa.2018.95',
    sourceType: 'Peer-reviewed article',
    note: 'Reviews Victorian ornithopod material and questions the referral of postcranial fossils to Leaellynasaura amicagraphica.',
  },
  {
    id: 'sereno2007',
    authors:
      'Sereno, P. C., Wilson, J. A., Witmer, L. M., Whitlock, J. A., Maga, A., Ide, O., & Rowe, T. A.',
    year: 2007,
    title: 'Structural extremes in a Cretaceous dinosaur',
    journal: 'PLoS ONE',
    volume: '2',
    issue: '11',
    pages: 'e1230',
    doi: '10.1371/journal.pone.0001230',
    url: 'https://doi.org/10.1371/journal.pone.0001230',
    sourceType: 'Peer-reviewed article',
    note: 'Osteological monograph of Nigersaurus taqueti, including the skull, dental battery and axial pneumaticity.',
  },
  {
    id: 'czepinski2025',
    authors: 'Czepiński, Ł., & Madzia, D.',
    year: 2025,
    title:
      'Exploring the diversity and disparity of rhabdodontomorph ornithopods from the Late Cretaceous European archipelago',
    journal: 'Scientific Reports',
    volume: '15',
    pages: '15209',
    doi: '10.1038/s41598-025-98083-z',
    url: 'https://doi.org/10.1038/s41598-025-98083-z',
    sourceType: 'Peer-reviewed article',
    note: 'Reviews European rhabdodontomorph diversity and reports that the Rhabdodon priscus lectotype, MPLM 30, has not been relocated.',
  },
  {
    id: 'britt1991',
    authors: 'Britt, B. B.',
    year: 1991,
    title:
      'Theropods of Dry Mesa Quarry (Morrison Formation, Late Jurassic), Colorado, with emphasis on the osteology of Torvosaurus tanneri',
    journal: 'Brigham Young University Geology Studies',
    volume: '37',
    pages: '1–72',
    sourceType: 'Peer-reviewed article',
    note: 'Designates the left humerus of BYU-VP 2002 as the lectotype of Torvosaurus tanneri.',
  },
  {
    id: 'varricchio2002',
    authors: 'Varricchio, D. J., Horner, J. R., & Jackson, F. D.',
    year: 2002,
    title: 'Embryos and eggs for the Cretaceous theropod dinosaur Troodon formosus',
    journal: 'Journal of Vertebrate Paleontology',
    volume: '22',
    issue: '3',
    pages: '564–576',
    doi: '10.1671/0272-4634(2002)022[0564:EAEFTC]2.0.CO;2',
    url: 'https://doi.org/10.1671/0272-4634(2002)022[0564:EAEFTC]2.0.CO;2',
    sourceType: 'Peer-reviewed article',
    note: 'Reinterprets egg clutches previously assigned to Orodromeus makelai as Troodon formosus.',
  },
];

export const referenceCorrections = {};

const trailData = [
  {
    slug: 'leaellynasaura',
    title: 'Holotype and referred material: NMV P185991',
    body: 'The holotype is a partial left cheek and maxilla of a juvenile. The skull roof NMV P185990 and postcranial fragments NMV P185992–P185993 are separate specimens; later work questions whether the postcrania belong to Leaellynasaura.',
    refs: ['primary-leaellynasaura', 'v19-leaellynasaura-140', 'nmv-p185991', 'herne2019'],
    access: 'Museums Victoria specimen record inspected; later referral arguments reviewed from published excerpts.',
    status:
      'Holotype NMV P185991 (partial left cheek and maxilla of a juvenile), Museums Victoria. NMV P185990 (skull roof) and NMV P185992–P185993 (postcrania) are separate specimens; postcranial referral is disputed. A public item-level Museums Victoria catalogue record exists for NMV P185991. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'lesothosaurus',
    title: 'Syntypes: NHMUK PV RU B17 and NHMUK PV RU B23',
    body: 'The type series comprises two disarticulated specimens. NHMUK PV R8501 is referred material, not the name-bearing type. No complete articulated skeleton is known.',
    refs: ['primary-lesothosaurus', 'pbdb'],
    access: 'Primary description metadata and PBDB taxon record inspected; item-level NHMUK catalogue page not checked.',
    status:
      'Syntypes NHMUK PV RU B17 and NHMUK PV RU B23, Natural History Museum, London. NHMUK PV R8501 is referred, not type. No complete articulated skeleton. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'mapusaurus',
    title: 'Holotype: MCF-PVPH-108.1',
    body: 'The name-bearing specimen is a right nasal. The hypodigm comes from a bonebed and includes multiple individuals; the mounted skeleton is a composite.',
    refs: ['primary-mapusaurus', 'pbdb'],
    access: 'Primary description metadata and PBDB taxon record inspected; item-level Museo Carmen Funes catalogue page not checked.',
    status:
      'Holotype MCF-PVPH-108.1 (right nasal), Museo Carmen Funes, Plaza Huincul. Paratypes and referred material come from a bonebed and represent multiple individuals. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'monolophosaurus',
    title: 'Holotype: IVPP 84019',
    body: 'The specimen preserves a skull, pelvis and part of the axial column. It is not a complete skeleton.',
    refs: ['primary-monolophosaurus', 'pbdb'],
    access: 'Primary description metadata and PBDB taxon record inspected; item-level IVPP catalogue page not checked.',
    status:
      'Holotype IVPP 84019 (skull with partial postcranium), Institute of Vertebrate Paleontology and Paleoanthropology, Beijing. The specimen is not a complete skeleton. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'muttaburrasaurus',
    title: 'Holotype: QM F6140',
    body: 'The holotype is a partial skeleton including a skull. The species is now dated to the Cenomanian–lower Turonian, approximately 96.3–93.5 Ma.',
    refs: ['primary-muttaburrasaurus', 'v19-muttaburrasaurus-141'],
    access: 'Primary description metadata and the 2026 stratigraphic review abstract inspected; item-level Queensland Museum catalogue page not checked.',
    status:
      'Holotype QM F6140 (partial skeleton including skull), Queensland Museum, Brisbane. The hypodigm is incomplete. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'nasutoceratops',
    title: 'Holotype: UMNH VP 16800',
    body: 'The specimen is a nearly complete skull with an associated forelimb. The rest of the skeleton is incomplete.',
    refs: ['primary-nasutoceratops', 'pbdb'],
    access: 'Primary description metadata and PBDB taxon record inspected; item-level Natural History Museum of Utah catalogue page not checked.',
    status:
      'Holotype UMNH VP 16800 (nearly complete skull with associated forelimb), Natural History Museum of Utah. The postcranial skeleton is incomplete. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'nigersaurus',
    title: 'Holotype: MNN GAD512',
    body: 'The holotype is a partial skull and neck. Some sources cite the number as MNN GDF512. The mounted skeleton is reconstructed from several individuals.',
    refs: ['sereno1999', 'sereno2007', 'pbdb'],
    access: 'Primary description and osteology metadata inspected; item-level Musée National du Niger catalogue page not checked.',
    status:
      'Holotype MNN GAD512 (partial skull and neck), Musée National du Niger, Niamey; the number is also cited as MNN GDF512. The mounted skeleton is composite. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'nothronychus',
    title: 'Holotype: MSM P2117',
    body: 'The holotype is a partial skeleton. Older accounts cite the number as P2106. A second species, N. graffami, is known from the Tropic Shale.',
    refs: ['primary-nothronychus', 'pbdb'],
    access: 'Primary description metadata and PBDB taxon record inspected; item-level Mesa Southwest Museum catalogue page not checked.',
    status:
      'Holotype MSM P2117 (partial skeleton), Mesa Southwest Museum, Arizona; older accounts cite P2106. No complete skeleton. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'orodromeus',
    title: 'Holotype: MOR 294',
    body: 'The holotype is a partial skeleton with a skull. Egg clutches once attributed to Orodromeus, including MOR 246, were reinterpreted as troodontid.',
    refs: ['primary-orodromeus', 'varricchio2002'],
    access: 'Primary description metadata and the 2002 egg reidentification abstract inspected; item-level Museum of the Rockies catalogue page not checked.',
    status:
      'Holotype MOR 294 (partial skeleton with skull), Museum of the Rockies, Bozeman. Egg clutch MOR 246 is no longer attributed to Orodromeus. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'oviraptor',
    title: 'Holotype: AMNH 6517',
    body: 'The holotype is a partial skeleton with a skull and lower jaws. The nest often associated with the specimen is AMNH 6508; proximity alone does not establish egg predation.',
    refs: ['osborn1924', 'v19-oviraptor-179', 'pbdb'],
    access: 'Primary description metadata and later holotype re-evaluation abstract inspected; item-level AMNH catalogue page not checked.',
    status:
      'Holotype AMNH 6517 (partial skeleton with skull and lower jaws), American Museum of Natural History, New York. Associated nest AMNH 6508. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'pachycephalosaurus',
    title: 'Holotype: USNM 12031',
    body: 'The holotype is a partial skull roof from the Lance Formation. The species was first named Troodon wyomingensis by Gilmore (1931), not by Brown & Schlaikjer (1943).',
    refs: ['gilmore1931', 'brown1943', 'pbdb'],
    access: 'Gilmore’s published description and the 1943 revision metadata inspected; item-level Smithsonian catalogue page not checked.',
    status:
      'Holotype USNM 12031 (partial skull roof), Smithsonian National Museum of Natural History, Washington, D.C. The species name dates to Gilmore, 1931; the genus Pachycephalosaurus dates to Brown & Schlaikjer, 1943. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'pachyrhinosaurus',
    title: 'Holotype: NMC 8867',
    body: 'The holotype is a skull with associated material. The nasal horn is replaced by a broad bony boss.',
    refs: ['primary-pachyrhinosaurus', 'pbdb'],
    access: 'Primary description metadata and PBDB taxon record inspected; item-level Canadian Museum of Nature catalogue page not checked.',
    status:
      'Holotype NMC 8867 (skull with associated material), Canadian Museum of Nature, Ottawa. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'parasaurolophus',
    title: 'Holotype: ROM 768',
    body: 'The holotype is a nearly complete skeleton with a skull and crest. The crest is a hollow tube connected to the nasal passages.',
    refs: ['primary-parasaurolophus', 'v19-parasaurolophus-8'],
    access: 'Primary description metadata and the 2020 pathology abstract inspected; item-level Royal Ontario Museum catalogue page not checked.',
    status:
      'Holotype ROM 768 (nearly complete skeleton with skull and crest), Royal Ontario Museum, Toronto. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'patagotitan',
    title: 'Holotype: MPEF-PV 3400',
    body: 'The holotype is a partial skeleton from a bonebed. The hypodigm includes at least six individuals, and the mounted skeleton is composite.',
    refs: ['primary-patagotitan', 'pbdb'],
    access: 'Primary description metadata and PBDB taxon record inspected; item-level Museo Paleontológico Egidio Feruglio catalogue page not checked.',
    status:
      'Holotype MPEF-PV 3400 (partial skeleton), Museo Paleontológico Egidio Feruglio, Trelew. The hypodigm draws on at least six individuals. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'pentaceratops',
    title: 'Holotype: AMNH 6325',
    body: 'The holotype is a skull. Later material includes a very large skull and partial skeleton.',
    refs: ['primary-pentaceratops', 'pbdb'],
    access: 'Primary description metadata and later revision abstracts inspected; item-level AMNH catalogue page not checked.',
    status:
      'Holotype AMNH 6325 (skull), American Museum of Natural History, New York. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'puertasaurus',
    title: 'Holotype: MPM-PV 10002',
    body: 'The holotype consists of four disarticulated vertebrae: one cervical, one dorsal and two caudal. No skull, ribs or limb bones are known.',
    refs: ['primary-puertasaurus', 'pbdb'],
    access: 'Primary description metadata and PBDB taxon record inspected; item-level Museo Regional Padre Molina catalogue page not checked.',
    status:
      'Holotype MPM-PV 10002 (four disarticulated vertebrae), Museo Regional Padre Molina, Río Gallegos. No skull, ribs or limb bones. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'rhabdodon',
    title: 'Lectotype: MPLM 30',
    body: 'The lectotype is a partial left dentary and has not been relocated according to the 2025 revision. A nearly complete skeleton from Provence was described in 1999.',
    refs: ['primary-rhabdodon', 'czepinski2025', 'v19-rhabdodon-142'],
    access: 'Primary description metadata and the 2025 revision abstract inspected; item-level Musée de Paléontologie de La Mémoire catalogue page not checked.',
    status:
      'Lectotype MPLM 30 (partial left dentary), Musée de Paléontologie de La Mémoire, Marseille; reported not relocated in 2025. The 1999 skeleton is a separate referred specimen. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'saltasaurus',
    title: 'Type series: PVL 4017-92',
    body: 'The type series includes a sacrum with fused ilia. Several partial skeletons and osteoderms are known.',
    refs: ['primary-saltasaurus', 'v19-saltasaurus-148'],
    access: 'Primary description metadata and armour/presacral abstracts inspected; item-level Instituto Miguel Lillo catalogue page not checked.',
    status:
      'Type series includes PVL 4017-92 (sacrum with fused ilia), Instituto Miguel Lillo, Tucumán. No single complete skeleton. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'sauropelta',
    title: 'Holotype: AMNH 3032',
    body: 'The holotype is a partial skeleton with armour. The tail lacks a club.',
    refs: ['ostrom1970', 'pbdb'],
    access: 'Primary description metadata and PBDB taxon record inspected; item-level AMNH catalogue page not checked.',
    status:
      'Holotype AMNH 3032 (partial skeleton with armour), American Museum of Natural History, New York. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'scelidosaurus',
    title: 'Lectotype: NHMUK PV R1111',
    body: 'The lectotype is an articulated skeleton with skull, postcranium and armour. Several articulated skeletons are known from the Charmouth Mudstone.',
    refs: ['primary-scelidosaurus', 'pbdb'],
    access: 'Primary description metadata and the 2019–2020 monographs’ abstracts inspected; item-level NHMUK catalogue page not checked.',
    status:
      'Lectotype NHMUK PV R1111 (articulated skeleton), Natural History Museum, London. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'sinraptor',
    title: 'Holotype: IVPP 10600',
    body: 'The holotype is a nearly complete skeleton with a skull. The publication is cited as 1993 or 1994.',
    refs: ['primary-sinraptor', 'pbdb'],
    access: 'Primary description metadata and dental monograph abstract inspected; item-level IVPP catalogue page not checked.',
    status:
      'Holotype IVPP 10600 (nearly complete skeleton with skull), Institute of Vertebrate Paleontology and Paleoanthropology, Beijing. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'stegosaurus',
    title: 'Holotype: USNM 4934',
    body: 'The holotype is a nearly complete skeleton from Garden Park, Colorado, with the skull, axial skeleton, limbs and armour. NHMUK PV R36730 is a referred specimen, not the type.',
    refs: ['primary-stegosaurus', 'usnm4934record', 'pbdb'],
    access: 'Smithsonian specimen record and Marsh’s published description excerpt inspected; full monographic literature not re-read.',
    status:
      'Holotype USNM 4934 (nearly complete skeleton), Smithsonian National Museum of Natural History. Referred specimen NHMUK PV R36730 (articulated skeleton), Natural History Museum, London. Both have dedicated MESOZO Discoveries entries.',
    entries: [
      {
        title: 'Holotype: USNM 4934',
        body: 'The name-bearing skeleton is nearly complete and preserves the skull, axial skeleton, limbs and armour. It is the basis of Stegosaurus stenops and of much early work on stegosaur armour.',
        evidence: 'fossil',
        topic: 'taxonomy',
        refs: ['primary-stegosaurus', 'usnm4934record'],
        access: 'Smithsonian specimen record and Marsh’s published description excerpt inspected.',
      },
      {
        title: 'Referred specimen: NHMUK PV R36730',
        body: 'The “Sophie” specimen preserves much of the skeleton and armour in articulation, including the plates and tail spikes. It documents one individual’s armour arrangement.',
        evidence: 'fossil',
        topic: 'anatomy',
        refs: ['maidment2015'],
        access: 'Abstract and metadata reviewed; full text not read.',
      },
      {
        title: 'Plate and spike function',
        body: 'The plates are osteoderms in two alternating rows; the tail bears four spikes. Display, thermoregulation and species recognition remain competing functional hypotheses.',
        evidence: 'contested',
        topic: 'palaeobiology',
        refs: ['maidment2015', 'galton2004'],
        access: 'Abstract and metadata reviewed; full text not read.',
      },
    ],
  },
  {
    slug: 'styracosaurus',
    title: 'Holotype: CMN 344',
    body: 'The holotype is a skull. Several skulls and partial skeletons are known, and the sample shows variation and asymmetry.',
    refs: ['primary-styracosaurus', 'v19-styracosaurus-92'],
    access: 'Primary description metadata and variation/revision abstracts inspected; item-level Canadian Museum of Nature catalogue page not checked.',
    status:
      'Holotype CMN 344 (skull), Canadian Museum of Nature, Ottawa. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'tarbosaurus',
    title: 'Holotype: PIN 551-1',
    body: 'The holotype is a skull with a partial skeleton. Many skulls and skeletons are known, including juveniles.',
    refs: ['primary-tarbosaurus', 'pbdb'],
    access: 'Primary description metadata and juvenile/growth abstracts inspected; item-level PIN catalogue page not checked.',
    status:
      'Holotype PIN 551-1 (skull with partial skeleton), Paleontological Institute, Russian Academy of Sciences, Moscow. No dedicated MESOZO Discoveries entry is linked.',
  },
  {
    slug: 'torvosaurus',
    title: 'Lectotype: BYU-VP 2002',
    body: 'The type series includes BYU-VP 2002; Britt (1991) designated its left humerus as the lectotype. The original material was disarticulated and represented more than one individual.',
    refs: ['primary-torvosaurus', 'britt1991', 'pbdb'],
    access: 'Primary description metadata, Britt’s lectotype designation and later cranial abstracts inspected; item-level BYU catalogue page not checked.',
    status:
      'Lectotype BYU-VP 2002 (left humerus), Brigham Young University, Provo. The rest of the forelimbs are paralectotype material. No dedicated MESOZO Discoveries entry is linked.',
  },
];

export const newTrails = Object.fromEntries(
  trailData.map(({ slug, status, entries, ...trail }) => [
    slug,
    {
      note: `Batch 5 added a claim-level review and a specimen-status record. ${status.split('. ')[0]}. Access limits are recorded on each entry; no dedicated MESOZO Discoveries page was invented where none exists.`,
      specimenStatus: status,
      entries:
        entries ??
        [
          {
            title: trail.title,
            body: trail.body,
            evidence: 'fossil',
            topic: 'taxonomy',
            refs: trail.refs,
            access: trail.access,
          },
        ],
    },
  ]),
);

const discovery = {
  leaellynasaura:
    'Named by Rich & Vickers-Rich, 1989. The holotype, NMV P185991, is a partial left cheek and maxilla of a juvenile from the Eumeralla Formation at Dinosaur Cove, Victoria. The skull roof NMV P185990 and postcranial fragments NMV P185992–P185993 were collected nearby, but their referral to the species is disputed.',
  lesothosaurus:
    'Named by Galton, 1978. The syntypes are NHMUK PV RU B17 and NHMUK PV RU B23 from the Upper Elliot Formation. NHMUK PV R8501 is referred material, not the name-bearing type. No complete articulated skeleton is known.',
  mapusaurus:
    'Named by Coria & Currie, 2006. The holotype, MCF-PVPH-108.1, is a right nasal. The hypodigm comes from a bonebed in the Huincul Formation and includes multiple individuals; the mounted skeleton is a composite.',
  monolophosaurus:
    'Named by Zhao & Currie (1993/1994). The holotype, IVPP 84019, preserves a skull, pelvis and part of the axial column from the Shishugou Formation, Xinjiang. It is not a complete skeleton.',
  muttaburrasaurus:
    'Named by Bartholomai & Molnar, 1981. The holotype, QM F6140, is a partial skeleton including a skull from the Mackunda Formation, Queensland. The species is now dated to the Cenomanian–lower Turonian, approximately 96.3–93.5 Ma.',
  nasutoceratops:
    'Named by Sampson et al., 2013. The holotype, UMNH VP 16800, is a nearly complete skull with an associated forelimb from the Kaiparowits Formation, Utah.',
  nigersaurus:
    'Named by Sereno et al., 1999. The holotype, MNN GAD512 (also cited as MNN GDF512), is a partial skull and neck from the Elrhaz Formation, Niger. The mounted skeleton is reconstructed from several individuals.',
  nothronychus:
    'Named by Kirkland & Wolfe, 2001. The holotype, MSM P2117 (older accounts cite P2106), is a partial skeleton from the Moreno Hill Formation, New Mexico. A second species, N. graffami, is known from the Tropic Shale.',
  orodromeus:
    'Named by Horner & Weishampel, 1988. The holotype, MOR 294, is a partial skeleton with a skull from the Two Medicine Formation, Montana. Egg clutches once attributed to Orodromeus, including MOR 246, were later reinterpreted as troodontid.',
  oviraptor:
    'Named by Osborn, 1924. The holotype, AMNH 6517, is a partial skeleton with a skull and lower jaws from the Djadochta Formation, Mongolia. The name reflects an old egg-thief interpretation that later work has not supported.',
  pachycephalosaurus:
    'The species was first named Troodon wyomingensis by Gilmore, 1931; Brown & Schlaikjer, 1943 erected Pachycephalosaurus and combined it as P. wyomingensis. The holotype, USNM 12031, is a partial skull roof from the Lance Formation, Wyoming.',
  pachyrhinosaurus:
    'Named by Sternberg, 1950. The holotype, NMC 8867, is a skull with associated material from the Horseshoe Canyon Formation, Alberta. The nasal horn is replaced by a broad bony boss.',
  parasaurolophus:
    'Named by Parks, 1922. The holotype, ROM 768, is a nearly complete skeleton with a skull and crest from the Dinosaur Park Formation, Alberta. The crest is a hollow tube connected to the nasal passages.',
  patagotitan:
    'Named by Carballido et al., 2017. The holotype, MPEF-PV 3400, is a partial skeleton from a bonebed in the Cerro Barcino Formation, Chubut. The hypodigm includes at least six individuals; the mounted skeleton is composite.',
  pentaceratops:
    'Named by Osborn, 1923. The holotype, AMNH 6325, is a skull from the Kirtland Formation, New Mexico. Later material includes a very large skull and partial skeleton.',
  puertasaurus:
    'Named by Novas et al., 2005. The holotype, MPM-PV 10002, consists of four disarticulated vertebrae from the Cerro Fortaleza Formation (originally reported as Pari Aike), Santa Cruz. No skull, ribs or limb bones are known.',
  rhabdodon:
    'Named by Matheron, 1869. The lectotype, MPLM 30, is a partial left dentary; a 2025 revision reports that it has not been relocated. A nearly complete skeleton from the lower Maastrichtian of Provence was described in 1999.',
  saltasaurus:
    'Named by Bonaparte & Powell, 1980. The type series includes PVL 4017-92, a sacrum with fused ilia, from the Lecho Formation, Salta. Several partial skeletons and osteoderms are known.',
  sauropelta:
    'Named by Ostrom, 1970. The holotype, AMNH 3032, is a partial skeleton with armour from the Cloverly Formation. The tail lacks a club.',
  scelidosaurus:
    'Named by Owen, 1861. The lectotype, NHMUK PV R1111, is an articulated skeleton from the Charmouth Mudstone, Dorset. Several articulated skeletons are known.',
  sinraptor:
    'Named by Currie & Zhao (1993/1994). The holotype, IVPP 10600, is a nearly complete skeleton with a skull from the Shishugou Formation, Xinjiang.',
  styracosaurus:
    'Named by Lambe, 1913. The holotype, CMN 344, is a skull from the Dinosaur Park Formation, Alberta. Several skulls and partial skeletons are known.',
  tarbosaurus:
    'Named by Maleev, 1955. The holotype, PIN 551-1, is a skull with a partial skeleton from the Nemegt Formation, Mongolia. Many skulls and skeletons are known, including juveniles.',
  torvosaurus:
    'Named by Galton & Jensen, 1979. The type series includes BYU-VP 2002; Britt (1991) designated its left humerus as the lectotype. The original material was disarticulated and represented more than one individual.',
};

export const speciesEdits = Object.fromEntries(
  Object.entries(discovery).map(([slug, body]) => [slug, { discovery: { ...{ body, evidence: 'fossil', refs: [] } } }]),
);

// Give each discovery the species-specific primary/type reference.
const discoveryRefs = {
  leaellynasaura: ['primary-leaellynasaura', 'nmv-p185991', 'pbdb'],
  lesothosaurus: ['primary-lesothosaurus', 'pbdb'],
  mapusaurus: ['primary-mapusaurus', 'pbdb'],
  monolophosaurus: ['primary-monolophosaurus', 'pbdb'],
  muttaburrasaurus: ['primary-muttaburrasaurus', 'pbdb'],
  nasutoceratops: ['primary-nasutoceratops', 'pbdb'],
  nigersaurus: ['sereno1999', 'sereno2007', 'pbdb'],
  nothronychus: ['primary-nothronychus', 'pbdb'],
  orodromeus: ['primary-orodromeus', 'varricchio2002', 'pbdb'],
  oviraptor: ['osborn1924', 'pbdb'],
  pachycephalosaurus: ['gilmore1931', 'brown1943', 'pbdb'],
  pachyrhinosaurus: ['primary-pachyrhinosaurus', 'pbdb'],
  parasaurolophus: ['primary-parasaurolophus', 'pbdb'],
  patagotitan: ['primary-patagotitan', 'pbdb'],
  pentaceratops: ['primary-pentaceratops', 'pbdb'],
  puertasaurus: ['primary-puertasaurus', 'pbdb'],
  rhabdodon: ['primary-rhabdodon', 'czepinski2025', 'pbdb'],
  saltasaurus: ['primary-saltasaurus', 'pbdb'],
  sauropelta: ['ostrom1970', 'pbdb'],
  scelidosaurus: ['primary-scelidosaurus', 'pbdb'],
  sinraptor: ['primary-sinraptor', 'pbdb'],
  styracosaurus: ['primary-styracosaurus', 'pbdb'],
  tarbosaurus: ['primary-tarbosaurus', 'pbdb'],
  torvosaurus: ['primary-torvosaurus', 'britt1991', 'pbdb'],
};
for (const [slug, refs] of Object.entries(discoveryRefs)) {
  speciesEdits[slug].discovery.refs = refs;
}

speciesEdits.muttaburrasaurus.set = {
  periodLabel: 'Late Cretaceous',
  stage: 'Cenomanian–lower Turonian',
  ageMa: [96.3, 93.5],
  ageLabel: '≈96.3–93.5 Ma',
};
speciesEdits.muttaburrasaurus.replaceFossilEvidence = [
  {
    title: 'Stratigraphic and geographic occurrence',
    body: 'Mackunda Formation, Queensland. The recent stratigraphic review dates the occurrence to the Cenomanian–lower Turonian, approximately 96.3–93.5 Ma, rather than the Albian range of about 107–103 Ma used in older summaries.',
    evidence: 'fossil',
    refs: ['v19-muttaburrasaurus-141', 'pbdb'],
  },
];

speciesEdits.leaellynasaura.set = {
  tagline:
    'A small ornithopod from a high-latitude Australian environment. The name is based on a partial juvenile skull; the long-tailed postcranial reconstruction is disputed.',
  summary:
    'A small ornithopod from a high-latitude Australian environment. The holotype is a partial juvenile cheek and maxilla; postcranial fossils once referred to the species are not securely assigned to it.',
  reconstruction: {
    body: 'A licensed life reconstruction is assigned to this record and credited in Sources and credits. The species is known from the holotype skull material and disputed postcranial referrals from the Eumeralla Formation. The reconstruction is an artist’s interpretation of appearance, not a direct observation from the fossil record; preserved integument is not known, and the long-tailed body outline depends on referred material.',
    evidence: 'reconstruction',
    refs: ['primary-leaellynasaura', 'v19-leaellynasaura-140', 'herne2019'],
  },
};
speciesEdits.leaellynasaura.replaceAnatomy = [
  {
    title: 'Preserved anatomy',
    body: 'Referred postcranial material is lightly built, with long hindlimbs and a long tail, but those fossils are not securely assigned to Leaellynasaura. The skull is incompletely known and the holotype preserves only part of the cheek and maxilla.',
    evidence: 'fossil',
    refs: ['primary-leaellynasaura', 'v19-leaellynasaura-140', 'herne2019'],
  },
];

speciesEdits.leaellynasaura.replaceFossilEvidence = [
  {
    title: 'Preserved material',
    body: 'The holotype, NMV P185991, is a partial left cheek and maxilla of a juvenile. The skull roof NMV P185990 and postcranial fragments NMV P185992–P185993 were collected nearby, but later work questions whether the postcrania belong to Leaellynasaura. The long-tailed body reconstruction is therefore not securely tied to the name-bearing specimen.',
    evidence: 'fossil',
    refs: ['primary-leaellynasaura', 'v19-leaellynasaura-140', 'herne2019'],
  },
];

speciesEdits.orodromeus.set = {
  tagline:
    'A small ornithopod known from partial skeletons. Egg clutches once attributed to it are now referred to a troodontid, so the nesting evidence is not secure.',
  summary:
    'A small ornithopod known from partial skeletons. Egg clutches once attributed to Orodromeus, including MOR 246, were reinterpreted as troodontid eggs and are not direct evidence of its nesting.',
  reconstruction: {
    body: 'A licensed life reconstruction is assigned to this record and credited in Sources and credits. The species is known from partial skeletons from the Two Medicine Formation. The reconstruction is an artist’s interpretation of appearance, not a direct observation from the fossil record; preserved integument is unknown, and the soft-tissue outline is inferred.',
    evidence: 'reconstruction',
    refs: ['primary-orodromeus', 'varricchio2002'],
  },
};

speciesEdits.orodromeus.replaceFossilEvidence = [
  {
    title: 'Preserved material',
    body: 'Several partial skeletons, including the holotype MOR 294. Egg clutches once attributed to Orodromeus, including MOR 246, were reinterpreted as troodontid eggs; they are not direct evidence of Orodromeus nesting. Completeness varies between specimens; missing elements are not reconstructed in this record.',
    evidence: 'fossil',
    refs: ['primary-orodromeus', 'varricchio2002'],
  },
];

speciesEdits.rhabdodon.replaceFossilEvidence = [
  {
    title: 'Preserved material',
    body: 'The lectotype, MPLM 30, is a partial left dentary and has not been relocated according to a 2025 revision. A nearly complete skeleton from the lower Maastrichtian of Provence was described in 1999 and provides most of the known postcranial anatomy.',
    evidence: 'fossil',
    refs: ['primary-rhabdodon', 'czepinski2025', 'v19-rhabdodon-142'],
  },
];

speciesEdits.pachycephalosaurus.set = {
  namedBy: 'Gilmore, 1931 (as Troodon wyomingensis); Brown & Schlaikjer, 1943 (genus)',
};

speciesEdits.stegosaurus = {};
const addReferences = {
  leaellynasaura: ['herne2019', 'nmv-p185991'],
  nigersaurus: ['sereno2007'],
  orodromeus: ['varricchio2002'],
  pachycephalosaurus: ['gilmore1931', 'brown1943'],
  rhabdodon: ['czepinski2025'],
  stegosaurus: ['primary-stegosaurus', 'pbdb'],
  torvosaurus: ['britt1991'],
};
for (const [slug, refs] of Object.entries(addReferences)) {
  speciesEdits[slug].addReferences = refs;
}

speciesEdits.stegosaurus = {
  addReferences: ['primary-stegosaurus', 'pbdb'],
};

export const specimenFixes = {};

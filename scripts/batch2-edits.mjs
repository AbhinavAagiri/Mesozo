// Content and reference corrections for the second research cohort.
// The script that consumes this file is idempotent and preserves the first 24 reviews.

export const newReferences = [
  {
    id: 'maidment2006',
    authors: 'Maidment, S. C. R., & Wei, G.',
    year: 2006,
    title:
      "A review of the Late Jurassic stegosaurs (Dinosauria, Stegosauria) from the People's Republic of China",
    journal: 'Geological Magazine',
    volume: '143',
    issue: '5',
    pages: '621–634',
    doi: '10.1017/S0016756806002500',
    url: 'https://doi.org/10.1017/S0016756806002500',
    sourceType: 'Peer-reviewed article',
    subjects: ['Gigantspinosaurus sichuanensis', 'Huayangosaurus taibaii', 'Stegosauria'],
    note: 'Reviews Chinese Late Jurassic stegosaurs and treats Gigantspinosaurus as a valid taxon. Used as a review, not as the original description.',
  },
  {
    id: 'benson2008',
    authors: 'Benson, R. B. J., & Barrett, P. M.',
    year: 2008,
    title:
      'The taxonomic status of Megalosaurus bucklandii (Dinosauria, Theropoda) from the Middle Jurassic of Oxfordshire, UK',
    journal: 'Palaeontology',
    volume: '51',
    issue: '2',
    pages: '419–424',
    doi: '10.1111/j.1475-4983.2008.00751.x',
    url: 'https://doi.org/10.1111/j.1475-4983.2008.00751.x',
    sourceType: 'Peer-reviewed article',
    subjects: ['Megalosaurus bucklandii'],
    note: 'Diagnoses the lectotype dentary and discusses the fragmentary historical hypodigm.',
  },
  {
    id: 'benson2010',
    authors: 'Benson, R. B. J.',
    year: 2010,
    title:
      'A description of Megalosaurus bucklandii (Dinosauria: Theropoda) from the Bathonian of the UK and the relationships of Middle Jurassic theropods',
    journal: 'Zoological Journal of the Linnean Society',
    volume: '158',
    issue: '4',
    pages: '882–935',
    doi: '10.1111/j.1096-3642.2009.00569.x',
    url: 'https://doi.org/10.1111/j.1096-3642.2009.00569.x',
    sourceType: 'Peer-reviewed article',
    subjects: ['Megalosaurus bucklandii'],
    note: 'Describes the lectotype and referred Stonesfield material and reviews Middle Jurassic theropod relationships.',
  },
];

export const referenceCorrections = [
  {
    id: 'primary-falcarius',
    patch: {
      title: 'A primitive therizinosauroid dinosaur from the Early Cretaceous of Utah',
      volume: '435',
      pages: '84–87',
      subjects: ['Falcarius utahensis'],
    },
  },
  {
    id: 'primary-gigantspinosaurus',
    patch: {
      authors: 'Ouyang, H.',
      year: 1992,
      title:
        'Discovery of Gigantspinosaurus sichuanensis and its scapular spine orientation',
      journal:
        'Abstracts and Summaries for Youth Academic Symposium on New Discoveries and Ideas in Stratigraphic Paleontology',
      volume: '',
      pages: '47–49',
      sourceType: 'Institutional report',
      doi: '',
      url: '',
      subjects: ['Gigantspinosaurus sichuanensis'],
      note:
        'Original name-bearing abstract, in Chinese. The 2018 redescription by Hao et al. provides the detailed anatomy used in this dossier.',
    },
  },
  {
    id: 'primary-ouranosaurus',
    patch: {
      year: 1976,
      title:
        "Géologie et paléontologie du gisement de Gadoufaoua (Aptien du Niger). Chapitre III: Ostéologie d'Ouranosaurus nigeriensis, iguanodontidé du Crétacé inférieur du Niger",
      journal: 'Cahiers de Paléontologie',
      publisher: 'CNRS, Paris',
      volume: '',
      pages: '57–63, 102–113, 118–120, 155–168',
      url: 'https://naturalhistory.si.edu/sites/default/files/media/translated_publications/Taquet_76.pdf',
      subjects: ['Ouranosaurus nigeriensis'],
      note:
        'Original osteology, published in French; an English translation is linked. The 1972 locality paper previously attached to this ID was not the naming description.',
    },
  },
  {
    id: 'primary-mamenchisaurus',
    patch: {
      title: 'Mamenchisaurus hochuanensis sp. nov.',
      journal: 'Monograph Series I, Science Press',
      volume: '8',
      pages: '1–48',
      subjects: ['Mamenchisaurus hochuanensis'],
      note:
        'Original description, in Chinese. The publication year is 1972; earlier catalogue metadata attached to this record was inconsistent.',
    },
  },
  {
    id: 'v19-minmi-83',
    patch: {
      subjects: ['Kunbarrasaurus ieversi', 'Minmi paravertebra'],
      note:
        'This paper names Kunbarrasaurus ieversi for the skeleton formerly called Minmi sp. from the Allaru Mudstone. It is not a description of the Minmi paravertebra holotype.',
    },
  },
];

export const speciesEdits = {
  argentinosaurus(s) {
    s.confidenceNote =
      'The holotype, MCF-PVPH 1, preserves dorsal and sacral vertebrae, ribs and part of a hindlimb, but no skull. Body mass is a model rather than a measurement: Mazzetta et al. (2004) preferred about 73 t within a wider 60–88 t range, and later estimates differ. There is no direct evidence of herding, nesting or feeding.';
    s.dietEvidence.body =
      'No skull, gut contents or coprolites are known. Herbivory is inferred from titanosaur anatomy; the plants eaten, the feeding height and the jaw mechanics remain unknown.';
    s.behaviour.body =
      'No direct evidence of social, parental or migratory behaviour. The Huincul Formation indicates a riverine floodplain, which is habitat context rather than a record of how the animal lived.';
    s.anatomy[0].body =
      'The preserved dorsal and sacral vertebrae are massive and highly pneumatised; the ribs are robust and the right tibia is relatively slender. No skull is known, so the jaws and teeth cannot be described.';
    s.fossilEvidence[0].body =
      'The holotype, MCF-PVPH 1, preserves three anterior and three posterior dorsal vertebrae, sacral material, a rib and the right tibia. No skull is known; an isolated femur has been referred separately.';
  },

  camptosaurus(s) {
    s.confidenceNote =
      'Camptosaurus dispar is a Morrison Formation ornithopod known from several partial skeletons and skulls. McDonald (2011) restricted the species and treated several historical referrals as distinct, so older “Camptosaurus” specimens are not all conspecific. The family Camptosauridae is not recovered by every analysis.';
    s.dietEvidence.body =
      'The beak and closely packed teeth indicate herbivory. No gut contents are known; the plants eaten and the feeding mechanics are inferred from jaw anatomy.';
    s.behaviour.body =
      'No direct evidence of social, nesting or parental behaviour. The Morrison Formation indicates a floodplain woodland, and the limb proportions support a facultatively bipedal posture. Neither is a record of behaviour.';
    s.anatomy[0].body =
      'The skull is relatively small, the forelimbs are shorter than the hindlimbs, and the hand bears a small thumb spike. Several partial skeletons preserve the postcranium, but the hypodigm is uneven.';
    s.fossilEvidence[0].body =
      'Several partial skeletons and skulls are known, including articulated material. The completeness of individual specimens varies, and historical referrals require reidentification.';
  },

  dilong(s) {
    s.confidenceNote =
      'The holotype is IVPP V14243, a semi-articulated skeleton with an almost complete skull from the Lujiatun Unit of the Yixian Formation. Filamentous integument is preserved. Brusatte & Carr (2016) recovered Dilong outside Proceratosauridae, so the family label is provisional; no gut contents are known.';
    s.dietEvidence.body =
      'The curved, serrated teeth indicate carnivory. No gut contents are known, so the prey taken, hunting versus scavenging, and feeding frequency remain unknown.';
    s.behaviour.body =
      'No direct evidence of social, nesting or parental behaviour. The filaments are direct evidence of a body covering, but their function is not established. The Lujiatun lake-margin setting is habitat context, not a behavioural record.';
    s.anatomy[0].body =
      'The skeleton is lightly built, the forelimbs are relatively long and three-fingered, and filamentous integument is preserved around the tail and body. The skull is almost complete.';
    s.fossilEvidence[0].body =
      'The holotype, IVPP V14243, is a semi-articulated skeleton with an almost complete skull. IVPP V14242 and TNP01109 are referred specimens; IVPP V11579 is a referred skull, not the holotype.';
  },

  dreadnoughtus(s) {
    s.confidenceNote =
      'The holotype, MPM-PV 1156, preserves about 45% of the skeleton, including much of the appendicular skeleton, pelvis, tail and a maxilla fragment; the paratype is MPM-PV 3546. The skull is almost unknown. Body mass is reconstructed from limb dimensions and body volume, and published estimates vary.';
    s.dietEvidence.body =
      'The skull is represented only by a maxilla fragment and a tooth. Herbivory is inferred from titanosaur anatomy; no gut contents are known, and the plants eaten cannot be identified.';
    s.behaviour.body =
      'No direct evidence of social or parental behaviour. The two skeletons were buried together, but that is a taphonomic association, not proof that the animals lived as a herd.';
    s.anatomy[0].body =
      'The dorsal vertebrae are extensively pneumatised, the limb girdles are robust, and the tail includes 32 caudal vertebrae. The skull is represented by a maxilla fragment and a tooth.';
    s.fossilEvidence[0].body =
      'The holotype, MPM-PV 1156, is a partially articulated skeleton preserving much of the appendicular skeleton and tail; the paratype, MPM-PV 3546, is a smaller partial postcranial skeleton from the same locality.';
  },

  einiosaurus(s) {
    s.confidenceNote =
      'Two monospecific bonebeds in the Two Medicine Formation have produced at least 15 individuals, including the holotype skull MOR 456-8-9-6-1. Wilson & Scannella (2021) documented ontogenetic changes in the cranial ornament. Herding is inferred from the bonebed association, not observed.';
    s.dietEvidence.body =
      'The beak and dental battery indicate herbivory. No gut contents are known; the plants eaten and the feeding style are inferred from jaw anatomy.';
    s.behaviour.body =
      'The two bonebeds show that many individuals accumulated together, which is consistent with gregarious behaviour but does not prove it. The function of the nasal horn and frill in display or combat is unresolved.';
    s.anatomy[0].body =
      'The nasal horn is strongly procurved, the supracranial ornament is inflated, and the parietal bears a single pair of elongate P3 processes. The postcranial skeleton is robust.';
    s.fossilEvidence[0].body =
      'Two monospecific bonebeds, the Canyon Bonebed and Dino Ridge Quarry, have produced skulls and partial skeletons of at least 15 individuals. The holotype is an adult partial skull.';
  },

  falcarius(s) {
    s.confidenceNote =
      'Falcarius is known from a large bonebed in the Cedar Mountain Formation, including multiple individuals and growth stages. Its skeleton combines therizinosaur features with more primitive theropod anatomy. The family placement is provisional, and no gut contents are known.';
    s.dietEvidence.body =
      'The reduced, leaf-shaped teeth and jaw apparatus are consistent with herbivory, but no gut contents are known. The plants eaten and the feeding mechanics remain inferences.';
    s.behaviour.body =
      'The bonebed is direct evidence that many individuals accumulated at one site. It does not show that they lived together. Hindlimb reconstruction supports a habitual bipedal stance, not a recorded gait.';
    s.anatomy[0].body =
      'The skull has reduced, leaf-shaped teeth, the forelimbs are relatively long, and the hindlimbs are robust. The mosaic of features is central to its position as an early therizinosaur.';
    s.fossilEvidence[0].body =
      'The species is known from a large bonebed in the Crystal Geyser quarry, Cedar Mountain Formation, Utah, with multiple individuals and growth stages.';
  },

  gigantspinosaurus(s) {
    s.references = Array.from(new Set([...s.references, 'maidment2006']));
    s.confidenceNote =
      'Ouyang (1992) named Gigantspinosaurus in a short abstract; Hao et al. (2018) redescribed the holotype, ZDM 0019, and recovered it as a stegosaur more derived than Huayangosaurus. The enormous parascapular spines are preserved; their function is inferred. A femoral osteopathy is direct evidence of pathology.';
    s.dietEvidence.body =
      'The jaws and teeth indicate herbivory. No gut contents are known, and the plants eaten and the feeding posture are not preserved.';
    s.behaviour.body =
      'No direct evidence of social or display behaviour. The parascapular spines are preserved bone; display and defence are hypotheses, not observations. The femoral osteopathy records an injury or chronic condition, not its cause.';
    s.anatomy[0].body =
      'The skeleton bears a pair of very large parascapular spines and relatively small dorsal plates. The 2018 redescription also documents the external mandibular foramen and a high femur-to-humerus ratio.';
    s.fossilEvidence[0].body =
      'The holotype, ZDM 0019, is a partial skeleton from the Upper Shaximiao Formation, Sichuan. It preserves jaws, vertebrae, limb material, plates and the parascapular spines.';
  },

  guanlong(s) {
    s.confidenceNote =
      'Guanlong is known from an adult skeleton, IVPP V14531, and a smaller, nearly complete specimen, IVPP V14532, from the Oxfordian upper Shishugou Formation. The skull bears a large, delicate crest. Its proceratosaurid placement is supported by recent analyses but early tyrannosauroid relationships remain unstable.';
    s.dietEvidence.body =
      'The dentition indicates carnivory. No gut contents are known; prey choice and hunting behaviour are not preserved.';
    s.behaviour.body =
      'The delicate cranial crest is plausibly a display structure, but its function is not demonstrated. No social, nesting or parental behaviour is known.';
    s.anatomy[0].body =
      'The skull is relatively deep and bears a large, thin, pneumatic median crest. The skeleton is lightly built, and the two known specimens sample an adult and an immature individual.';
    s.fossilEvidence[0].body =
      'The adult holotype, IVPP V14531, is partly articulated; the immature paratype, IVPP V14532, is nearly complete and articulated. Both are from the upper Shishugou Formation.';
  },

  herrerasaurus(s) {
    s.confidenceNote =
      'Herrerasaurus is known from several skulls and skeletons from the Ischigualasto Formation, approximately 231–228 Ma. Its skull and forelimb anatomy are well sampled, but its position inside or outside Theropoda is contested. No gut contents are known.';
    s.dietEvidence.body =
      'The long, low skull, curved serrated teeth and jaw articulation indicate carnivory. No gut contents are known, so the prey taken and whether the animal hunted or scavenged remain unknown.';
    s.behaviour.body =
      'No direct evidence of social, nesting or parental behaviour. The seasonal river plain is habitat context, not a behavioural record.';
    s.anatomy[0].body =
      'The skull is long and low, with large, curved, serrated teeth and a jaw articulation that permits a wide gape. The forelimb is short but powerfully built, with a mobile shoulder and a grasping hand.';
    s.fossilEvidence[0].body =
      'Several skulls and partial skeletons are known from the Ischigualasto Formation of San Juan, Argentina. The material samples the skull, forelimb and postcranium.';
  },

  huayangosaurus(s) {
    s.confidenceNote =
      'Huayangosaurus is known from skull and postcranial material from the Middle Jurassic Shaximiao Formation. It is usually placed outside Stegosauridae as a basal stegosaur, but the family label is navigational. No gut contents are known.';
    s.dietEvidence.body =
      'The short snout, jaws and teeth indicate herbivory. No gut contents are known; the plants eaten and the feeding posture remain unknown.';
    s.behaviour.body =
      'No direct evidence of social or display behaviour. The small dorsal plates and tail spines are preserved; their function in display, thermoregulation or defence is not established.';
    s.anatomy[0].body =
      'The skull is relatively short-snouted and less derived than those of later stegosaurs. The postcranium bears small dorsal plates and at least one pair of tail spines.';
    s.fossilEvidence[0].body =
      'The species is known from skull and postcranial material from the Shaximiao Formation of Sichuan. The hypodigm includes multiple individuals but not a complete growth series.';
  },

  hypsilophodon(s) {
    s.confidenceNote =
      'Hypsilophodon is known from multiple partial skeletons from the Wessex Formation of the Isle of Wight. The old arboreal reconstruction is not supported by its limb and foot anatomy. No gut contents are known.';
    s.dietEvidence.body =
      'The beak and teeth indicate herbivory. No gut contents are known; the plants eaten and the feeding mechanics are inferred from anatomy.';
    s.behaviour.body =
      'The species is reconstructed as primarily terrestrial. Experimental tracks show how footprint shape changes with sand wetness, but they do not identify a wild trackmaker or record speed. No social behaviour is known.';
    s.anatomy[0].body =
      'The skull is small and lightweight, with a beak and teeth suited to cropping plants. The hindlimbs are long and the forelimbs short, consistent with a bipedal stance.';
    s.fossilEvidence[0].body =
      'Multiple partial skeletons are known from the Wessex Formation, including skull and postcranial material. The hypodigm samples several individuals.';
  },

  iguanodon(s) {
    s.confidenceNote =
      'The Bernissart skeletons established much of the anatomy of Iguanodon bernissartensis, including the thumb spike and scaly integument. The bonebed is direct evidence of accumulation; herding is an inference. No gut contents are known.';
    s.dietEvidence.body =
      'The beak and dental battery indicate herbivory. No gut contents are known; the plants eaten and the feeding style are inferred from jaw anatomy.';
    s.behaviour.body =
      'Many skeletons accumulated at Bernissart, which is consistent with gregarious behaviour but does not prove it. The thumb spike is preserved; its use in defence, feeding or display is inferred.';
    s.anatomy[0].body =
      'The skull is deep, the dental battery is well developed, and the hand bears a large conical thumb spike. Skin impressions show a scaly covering.';
    s.fossilEvidence[0].body =
      'The Sainte-Barbe Clays at Bernissart produced many articulated skeletons. The bonebed is direct evidence of a mass accumulation; the cause of the accumulation is a separate taphonomic question.';
  },

  jobaria(s) {
    s.confidenceNote =
      'The holotype, MNN TIG3, is a largely complete skeleton including the skull and most of the postcranium. Several individuals, including a juvenile, were found at the same locality. The Tiourarén Formation is now read as Middle Jurassic, not Early Cretaceous as in the original description.';
    s.dietEvidence.body =
      'The skull and dentition indicate herbivory. No gut contents are known; the plants eaten and the feeding height are inferred from anatomy.';
    s.behaviour.body =
      'Several individuals, including a juvenile, occur at one site. That is a mass-death assemblage; gregarious behaviour is an inference from the association, not an observed fact.';
    s.anatomy[0].body =
      'The skull and most of the postcranium are known. The vertebral column is relatively simple for a sauropod, and the neck is short relative to the body.';
    s.fossilEvidence[0].body =
      'The holotype, MNN TIG3, is a largely complete skeleton. Several individuals, including a juvenile with possible tooth marks, were found at the same locality.';
  },

  mamenchisaurus(s) {
    s.confidenceNote =
      'The neck contains 19 elongated cervical vertebrae, and the distal tail bears a bony club. The Upper Shaximiao Formation is not reliably radiometrically dated; the archive uses an Oxfordian age, but some treatments place the fauna in the Middle Jurassic. Neck-pose work used Mamenchisaurus youngi, not M. hochuanensis.';
    s.dietEvidence.body =
      'The dentition indicates herbivory. No gut contents are known; the long neck has been interpreted as a browsing adaptation, but the plants eaten and the feeding height are not established.';
    s.behaviour.body =
      'No direct evidence of social or display behaviour. The tail club is preserved bone; its function in defence or display is inferred.';
    s.anatomy[0].body =
      'The neck is exceptionally long and composed of 19 elongated cervical vertebrae. The distal tail bears a club formed by fused vertebrae.';
    s.fossilEvidence[0].body =
      'The holotype is a partial skeleton from the Upper Shaximiao Formation, Sichuan. It preserves the long neck and tail club but not a complete skull or entire postcranium.';
  },

  megalosaurus(s) {
    s.references = Array.from(new Set([...s.references, 'benson2008', 'benson2010']));
    s.confidenceNote =
      'Megalosaurus was the first non-avian dinosaur genus to be validly named, but its lectotype is only a partial right dentary, OUMNH J.13505. Benson (2008, 2010) diagnosed the dentary and treated many historical referrals as uncertain. The Stonesfield material is Bathonian; size and life appearance are estimates.';
    s.dietEvidence.body =
      'The curved, serrated teeth indicate carnivory. No gut contents are known, and the hunting or scavenging behaviour of this animal is not preserved.';
    s.behaviour.body =
      'No direct evidence of social or parental behaviour. The Stonesfield deposits indicate a lowland, coastal-margin environment; this is habitat context, not a record of hunting.';
    s.anatomy[0].body =
      'The lectotype is a partial right dentary with diagnostic grooves and a slit-like anterior Meckelian foramen. Referred Stonesfield material includes skull bones, vertebrae and limb elements, but the hypodigm is fragmentary.';
    s.fossilEvidence[0].body =
      'The lectotype, OUMNH J.13505, is a partial right dentary. The historical hypodigm includes skull, vertebral and limb material from several individuals; many referrals are contested.';
  },

  minmi(s) {
    s.confidenceNote =
      'Minmi paravertebra is based on the holotype, QM F10329, a partial skeleton from the Bungil Formation that lacks a skull. The much more complete Allaru Mudstone skeleton formerly called Minmi sp. was named Kunbarrasaurus ieversi in 2015. The family placement of Minmi remains unresolved.';
    s.dietEvidence.body =
      'Herbivory is inferred from ankylosaur anatomy. The skull of Minmi is unknown, so its jaw apparatus and feeding style cannot be examined directly.';
    s.behaviour.body =
      'No direct evidence of social or parental behaviour. The armour is preserved; its defensive function is inferred from structure and position.';
    s.anatomy[0].body =
      'The holotype preserves vertebrae, ribs, part of a hindlimb and armour, including the unusual paravertebral elements that give the species its name. The skull is unknown.';
    s.fossilEvidence[0].body =
      'The holotype, QM F10329, is a partial skeleton from the Bungil Formation near Roma, Queensland. It lacks a skull. The Allaru specimen formerly called Minmi sp. is Kunbarrasaurus ieversi.';
  },

  ouranosaurus(s) {
    s.confidenceNote =
      'Taquet (1976) described Ouranosaurus from the Elrhaz Formation of Niger. Elongated neural spines form the structure often called a sail, but the connecting soft tissue is not preserved. The animal’s locomotion and the function of the sail remain debated; no gut contents are known.';
    s.dietEvidence.body =
      'The skull and dentition indicate herbivory. No gut contents are known; the plants eaten and the feeding style are inferred from anatomy.';
    s.behaviour.body =
      'No direct evidence of social or display behaviour. The elongated neural spines are preserved bone; the silhouette and function of the “sail” are reconstructions, not observations.';
    s.anatomy[0].body =
      'Elongated neural spines run along the back and tail. The skull is deep and the postcranium is robust; the Venice specimen adds anatomical detail but is not a complete skeleton.';
    s.fossilEvidence[0].body =
      'The holotype and referred material come from the Elrhaz Formation at Gadoufaoua, Niger. The hypodigm includes skull and postcranial material; the soft tissue around the neural spines is not preserved.';
  },

  plateosaurus(s) {
    s.confidenceNote =
      'Plateosaurus is known from hundreds of individuals, including the Frick and Knollenmergel accumulations. Body mass estimates range from about 0.6 t for a 6 m individual to about 4 t for the largest adults. Growth was plastic, and the bonebed accumulations may reflect drought, flood or mudflow rather than social behaviour.';
    s.dietEvidence.body =
      'The skull and jaw mechanics are consistent with herbivory, but the feeding apparatus differs from that of later sauropods. No gut contents are known; occasional omnivory is not resolved by the preserved anatomy alone.';
    s.behaviour.body =
      'The bonebeds show that many individuals accumulated together. Whether they congregated in life or were concentrated by drought, flood or mudflow is debated. No nesting or parental behaviour is known.';
    s.anatomy[0].body =
      'The skull is relatively small, the neck is long, and the body is robust. The forelimbs are shorter than the hindlimbs, and the hand bears a large thumb claw.';
    s.fossilEvidence[0].body =
      'Hundreds of individuals are known from the Knollenmergel of Germany and the Frick quarry in Switzerland. The sample includes juveniles and adults but is time-averaged.';
  },

  polacanthus(s) {
    s.confidenceNote =
      'Polacanthus foxii is based on a partial skeleton from the Wessex Formation with a solid pelvic armour shield and large spines; the skull is incomplete. Its placement in Nodosauridae is provisional, and some analyses use Polacanthidae. No gut contents are known.';
    s.dietEvidence.body =
      'Herbivory is inferred from ankylosaur anatomy. The incomplete skull limits direct evidence, and no gut contents are known.';
    s.behaviour.body =
      'No direct evidence of social or parental behaviour. The armour and spines are preserved; their defensive function is inferred from structure and position.';
    s.anatomy[0].body =
      'A solid shield of fused armour covers the pelvic region, and large spines line the neck and shoulders. The tail lacks a club. The skull is incomplete.';
    s.fossilEvidence[0].body =
      'The holotype and referred specimens are partial skeletons from the Wessex Formation, mostly armour and postcrania. The skull is incomplete.';
  },

  shunosaurus(s) {
    s.confidenceNote =
      'Shunosaurus is known from many partial skeletons from the Lower Shaximiao Formation, including complete skulls and tail clubs. The neck is relatively short for a sauropod, and the tail club is formed by fused vertebrae. No gut contents are known, and social behaviour is not established.';
    s.dietEvidence.body =
      'The skull and leaf-shaped teeth indicate herbivory. No gut contents are known; the plants eaten and the jaw mechanics are inferred from anatomy.';
    s.behaviour.body =
      'No direct evidence of social or parental behaviour. The tail club is preserved bone; its function in defence or display is inferred.';
    s.anatomy[0].body =
      'The neck is relatively short, the skull has a short snout and leaf-shaped teeth, and the distal tail bears a small bony club. Many individuals are known.';
    s.fossilEvidence[0].body =
      'The species is known from many partial skeletons in the Lower Shaximiao Formation of Sichuan, including complete skulls and tail clubs.';
  },

  therizinosaurus(s) {
    s.confidenceNote =
      'The holotype, PIN 551-483, preserves fragmentary postcranial material and isolated manual unguals; no skull is known. Herbivory is inferred from the wider therizinosaur record, not from this species’ jaws or gut contents. No integument is preserved.';
    s.dietEvidence.body =
      'No skull or gut contents are known. Herbivory is inferred from related therizinosaurs with plant-processing dentitions and, in some cases, gastroliths; it is not a direct observation for Therizinosaurus.';
    s.behaviour.body =
      'No direct evidence of behaviour. The enormous manual claws are preserved; their function in feeding, defence or display is unresolved. No nesting or social evidence is known.';
    s.anatomy[0].body =
      'The manual unguals are exceptionally large and curved. Referred forelimb and pelvic material indicates a bulky, short-legged body, but no skull is known.';
    s.fossilEvidence[0].body =
      'The holotype, PIN 551-483, preserves fragmentary postcranial material and isolated manual unguals. Referred forelimb and hindlimb material has been described, but the hypodigm remains incomplete.';
  },

  turiasaurus(s) {
    s.confidenceNote =
      'Turiasaurus is known from a partial skeleton and isolated teeth from the Villar del Arzobispo Formation of Teruel, Spain. It is one of the largest known European sauropods, but the size estimates depend on reconstruction. A 2024 migration hypothesis is comparative and untested.';
    s.dietEvidence.body =
      'The large, spatulate teeth indicate herbivory. No gut contents are known; the plants eaten and the feeding height are inferred from anatomy.';
    s.behaviour.body =
      'No direct evidence of social or migratory behaviour. A 2024 study proposed that large foraging migrations could help explain the animal’s size, but the hypothesis is not based on tracked individuals.';
    s.anatomy[0].body =
      'The humerus is massive, the teeth are large and spatulate, and the appendicular skeleton is robust. The skull is known from referred material.';
    s.fossilEvidence[0].body =
      'The hypodigm includes a partial skeleton and isolated teeth from the Villar del Arzobispo Formation, Teruel. The skeleton is incomplete, and size estimates depend on reconstructed missing parts.';
  },

  yutyrannus(s) {
    s.confidenceNote =
      'Yutyrannus is known from three nearly complete skeletons, all preserving filamentous integument. The specimens were purchased from commercial collectors, so their exact quarry provenance is uncertain. Brusatte & Carr (2016) recovered it within Proceratosauridae, but other analyses place it outside.';
    s.dietEvidence.body =
      'The skull and dentition indicate carnivory. No gut contents are known; prey choice and hunting behaviour are not preserved.';
    s.behaviour.body =
      'No direct evidence of social or parental behaviour. The filaments are direct evidence of a body covering, but their function and colour are unknown.';
    s.anatomy[0].body =
      'The skull is deep and bears a midline nasal crest; the forelimbs are relatively short and three-fingered. Filamentous feathers are preserved on the body and tail of all three individuals.';
    s.fossilEvidence[0].body =
      'Three nearly complete skeletons are known: the holotype ZCDM V5000 and the paratypes ZCDM V5001 and ELDM V1001. All preserve filamentous integument.';
  },
};

export const primers = {
  argentinosaurus: {
    lead:
      'Argentinosaurus huinculensis was one of the largest land animals ever to live. It was a [sauropodomorph](/learn/major-dinosaur-groups) — a long-necked, plant-eating dinosaur — from the [Late Cretaceous](/deep-time?period=cretaceous) of what is now Argentina.',
    paragraphs: [
      'The only well-established skeleton is very incomplete: a set of huge back and hip vertebrae, ribs and part of a hindlimb. There is no skull. Even so, the size of the bones shows that this was an enormous animal, and palaeontologists have used the limb dimensions to estimate a mass of roughly 60–88 tonnes.',
      'Because the skull and gut are unknown, its diet is inferred from other titanosaurs rather than observed. There is no direct evidence of herding, nesting or the plants it ate. The dossier below separates those certainties from the estimates.',
    ],
    takeaway: 'A giant known from a fragmentary skeleton — its size is clear, but much of its life is not.',
  },
  camptosaurus: {
    lead:
      'Camptosaurus dispar was a medium-sized plant-eating dinosaur that lived in the [Morrison Formation](/prehistoric-world/ecosystem/morrison-formation) of North America during the [Late Jurassic](/deep-time?period=jurassic). It belonged to the broad ornithischian branch and is one of the better-known Morrison ornithopods.',
    paragraphs: [
      'It had a relatively small skull, short front limbs and a small thumb spike. The limb proportions suggest it could walk on two legs or four. Several partial skeletons and skulls are known, but the species has a complicated history of referrals, and not every fossil once called Camptosaurus belongs to C. dispar.',
      'Its plant diet is inferred from the beak and teeth. No gut contents are known, and there is no direct evidence of its social or nesting behaviour.',
    ],
    takeaway: 'A robust Jurassic plant-eater with a small thumb spike and a taxonomically tangled family tree.',
  },
  dilong: {
    lead:
      'Dilong paradoxus was a small, feathered [theropod](/learn/major-dinosaur-groups) from the [Early Cretaceous](/deep-time?period=cretaceous) of Liaoning, China. It is an early relative of Tyrannosaurus, but it was about the size of a large dog rather than a giant predator.',
    paragraphs: [
      'The best specimen preserves an almost complete skull and a lightly built skeleton. Filamentous integument is preserved around the body and tail, showing that a feather-like covering was present in this part of the tyrannosauroid family tree. The filaments are not modern flight feathers, and their function is unknown.',
      'Its teeth indicate a meat-eating diet, but no gut contents are known. The exact family placement is debated: some analyses put Dilong outside Proceratosauridae, and others place it outside Tyrannosauroidea altogether.',
    ],
    takeaway: 'A small feathered cousin of Tyrannosaurus, important for the early history of the group.',
  },
  dreadnoughtus: {
    lead:
      'Dreadnoughtus schrani was a giant titanosaur from the [Late Cretaceous](/deep-time?period=cretaceous) of Patagonia. It is one of the most completely known giant sauropods, even though its skull is still almost unknown.',
    paragraphs: [
      'The holotype preserves about 45% of the skeleton, including much of the limbs, pelvis and tail. That is exceptional for a sauropod of this size, and it gives palaeontologists a detailed view of the appendicular anatomy. A second, smaller skeleton was found at the same site.',
      'Body mass has been estimated in different ways, with published figures varying substantially. The animal was certainly enormous, but “22–38 tonnes” is a modelled range, not a reading from a scale. Its plant diet is inferred from other titanosaurs, and there is no direct evidence of its behaviour.',
    ],
    takeaway: 'A giant known from an unusually complete body skeleton — but still without a usable skull.',
  },
  einiosaurus: {
    lead:
      'Einiosaurus procurvicornis was a plant-eating ceratopsian from the [Two Medicine Formation](/prehistoric-world#worlds) of Montana, about 75 million years ago. It belonged to the centrosaurine branch of horned dinosaurs.',
    paragraphs: [
      'Its most distinctive feature is a nasal horn that curves strongly forward, together with a relatively simple frill. Two bonebeds have produced at least 15 individuals, including skulls from different growth stages. That sample lets palaeontologists study how the horns and frill changed as the animals grew.',
      'The bonebeds are direct evidence that many individuals accumulated together, but herding is an inference. The function of the ornaments — display, species recognition or combat — is not settled, and no gut contents are known.',
    ],
    takeaway: 'A horned dinosaur with a forward-curving nose horn and a rare growth series.',
  },
  falcarius: {
    lead:
      'Falcarius utahensis was an early therizinosaur from the [Early Cretaceous](/deep-time?period=cretaceous) of Utah. It is important because it preserves a mosaic of features: its ancestors were meat-eating theropods, but its own anatomy is closer to the plant-eating therizinosaurs.',
    paragraphs: [
      'A large bonebed in the Cedar Mountain Formation has produced many individuals and growth stages. The skull has reduced, leaf-shaped teeth, and the hindlimb reconstruction supports a habitual bipedal stance. These features are used to reconstruct the transition toward herbivory.',
      'No gut contents are known, so the diet is inferred from the teeth and from other therizinosaurs. The bonebed shows that many animals accumulated at one place; it does not prove that they lived in a herd.',
    ],
    takeaway: 'A transitional therizinosaur that helps document the shift from carnivory toward plant eating.',
  },
  gigantspinosaurus: {
    lead:
      'Gigantspinosaurus sichuanensis was a stegosaur from the [Upper Shaximiao Formation](/prehistoric-world#worlds) of Sichuan, China, during the [Late Jurassic](/deep-time?period=jurassic). It is named for the enormous spines that projected from its shoulder region.',
    paragraphs: [
      'The holotype, ZDM 0019, preserves jaws, vertebrae, limb bones, small dorsal plates and a pair of very large parascapular spines. A 2018 redescription placed Gigantspinosaurus as a stegosaur more derived than Huayangosaurus but less derived than Tuojiangosaurus. The animal also preserves a femoral osteopathy — a bone abnormality that records injury or disease.',
      'The spines are preserved bone, but their function is not. Display and defence are both plausible. Its plant diet is inferred from the jaws and teeth, and there is no direct evidence of its social behaviour.',
    ],
    takeaway: 'A stegosaur whose shoulder spines are more dramatic than its plates.',
  },
  guanlong: {
    lead:
      'Guanlong wucaii was an early tyrannosauroid from the [Shishugou Formation](/prehistoric-world#worlds) of Xinjiang, China, about 160 million years ago. Despite its small size, it is one of the earliest known members of the lineage that eventually produced Tyrannosaurus.',
    paragraphs: [
      'It is known from an adult skeleton and a smaller, nearly complete immature specimen. The skull bears a large, thin, pneumatic crest. Because the crest is delicate, palaeontologists have interpreted it as a display structure rather than a weapon, but that function is not proven.',
      'Its teeth indicate carnivory. No gut contents are known, and there is no direct evidence of social or nesting behaviour. The family Proceratosauridae is a hypothesis about relationships, not a fixed category.',
    ],
    takeaway: 'A small, crested forerunner of the tyrannosaurs.',
  },
  herrerasaurus: {
    lead:
      'Herrerasaurus ischigualastensis was one of the earliest dinosaurs, living in the [Late Triassic](/deep-time?period=triassic) of Argentina about 231–228 million years ago. It was a lightly built, long-legged predator with a long, low skull.',
    paragraphs: [
      'Several skulls and skeletons are known from the Ischigualasto Formation. The skull has large, curved, serrated teeth, and the forelimb is short but powerfully built, with a mobile shoulder and a grasping hand. These features are consistent with a predatory lifestyle.',
      'Its evolutionary position is debated: some analyses place it inside Theropoda, others outside it among the earliest saurischians. No gut contents are known, so its prey and hunting behaviour remain unknown.',
    ],
    takeaway: 'An early dinosaur that sits near the base of the saurischian family tree — exactly where is still argued.',
  },
  huayangosaurus: {
    lead:
      'Huayangosaurus taibaii was an early stegosaur from the [Middle Jurassic](/deep-time?period=jurassic) of Sichuan, China. It is one of the oldest well-known stegosaurs and helps document how the group’s plates and spines evolved.',
    paragraphs: [
      'The skull is relatively short-snouted and less derived than those of later stegosaurs. The postcranium bears small dorsal plates and at least one pair of tail spines. Huayangosaurus is usually placed outside Stegosauridae, as a basal stegosaur.',
      'Its plant diet is inferred from the jaws and teeth. The function of the plates and spines — display, thermoregulation or defence — is not established, and there is no direct evidence of its social behaviour.',
    ],
    takeaway: 'A small-plated early stegosaur from the Middle Jurassic.',
  },
  hypsilophodon: {
    lead:
      'Hypsilophodon foxii was a small, fast-running plant-eater from the [Wessex Formation](/prehistoric-world#worlds) of the Isle of Wight, England, during the [Early Cretaceous](/deep-time?period=cretaceous). It is one of the best-known small ornithopods.',
    paragraphs: [
      'The skull is lightweight, with a beak and teeth suited to cropping plants. The long hindlimbs and short forelimbs indicate a bipedal stance. Early reconstructions placed Hypsilophodon in trees, but later anatomical work treated it as primarily terrestrial.',
      'Experimental footprints show how track shape changes with sand wetness, but they do not identify a wild trackmaker. No gut contents are known, and its social and nesting behaviour is unknown.',
    ],
    takeaway: 'A small bipedal plant-eater, once wrongly imagined as a tree-dweller.',
  },
  iguanodon: {
    lead:
      'Iguanodon bernissartensis was a large plant-eating ornithopod from the [Early Cretaceous](/deep-time?period=cretaceous) of Belgium. The amazing Bernissart skeletons transformed early ideas about dinosaur posture and anatomy.',
    paragraphs: [
      'It had a deep skull, a dental battery for processing plants, and a large conical thumb spike. Skin impressions show a scaly covering. Many articulated skeletons were found together at Bernissart, which is consistent with gregarious behaviour, though herding is an inference.',
      'The animal could walk on four legs but also adopt a bipedal stance. The thumb spike’s function — defence, feeding or display — is unresolved, and no gut contents are known.',
    ],
    takeaway: 'A large, thumb-spiked plant-eater known from a spectacular bonebed.',
  },
  jobaria: {
    lead:
      'Jobaria tiguidensis was a large sauropod from the [Middle Jurassic](/deep-time?period=jurassic) of Niger. It had a relatively short neck for a sauropod and a vertebral column that is simpler than those of many later giants.',
    paragraphs: [
      'The holotype, MNN TIG3, is a largely complete skeleton including the skull and most of the postcranium. Several individuals, including a juvenile, were found at the same site. The Tiourarén Formation was originally thought to be Early Cretaceous, but later work supports a Middle Jurassic age.',
      'The mass-death assemblage is direct evidence that several animals were buried together; gregarious behaviour is an inference. Its plant diet is inferred from the skull and teeth, and no gut contents are known.',
    ],
    takeaway: 'A short-necked sauropod from a Middle Jurassic mass-death site.',
  },
  mamenchisaurus: {
    lead:
      'Mamenchisaurus hochuanensis was a sauropod from the [Late Jurassic](/deep-time?period=jurassic) of Sichuan, China, famous for its extremely long neck. The neck alone contains 19 elongated vertebrae.',
    paragraphs: [
      'The distal tail bears a bony club formed by fused vertebrae. The neck has been interpreted as an adaptation for browsing over a wide area, but the plants eaten and the feeding height are not preserved. A neck-pose study used a different species, Mamenchisaurus youngi, so its conclusions do not automatically apply here.',
      'The Upper Shaximiao Formation is not reliably radiometrically dated, and some researchers place its fauna in the Middle Jurassic. No gut contents are known, and there is no direct evidence of social behaviour.',
    ],
    takeaway: 'A long-necked sauropod with a tail club and an uncertain geological age.',
  },
  megalosaurus: {
    lead:
      'Megalosaurus bucklandii was the first non-avian dinosaur genus to be validly named. It lived in the [Middle Jurassic](/deep-time?period=jurassic) of England, about 167 million years ago, and was a large bipedal predator.',
    paragraphs: [
      'The name has a long history. William Buckland named the genus in 1824, and Gideon Mantell named the species in 1827. The lectotype is a partial right dentary, OUMNH J.13505. Many other fossils were referred to Megalosaurus over the centuries, but modern work treats many of those referrals as uncertain.',
      'The teeth indicate carnivory, but no gut contents are known. Its size is estimated at roughly one tonne, and its life appearance is reconstructed from fragmentary remains. The dossier below separates the historical name from the animal’s actual anatomy.',
    ],
    takeaway: 'The first named dinosaur — and a lesson in how fragmentary evidence can grow into a legend.',
  },
  minmi: {
    lead:
      'Minmi paravertebra was a small armoured dinosaur from the [Early Cretaceous](/deep-time?period=cretaceous) of Queensland, Australia. It belonged to Ankylosauria, the group with body armour and, in many species, a tail club.',
    paragraphs: [
      'The holotype, QM F10329, is a partial skeleton that lacks a skull. It preserves vertebrae, ribs, part of a hindlimb and armour, including the unusual paravertebral elements that give the species its name. A much more complete skeleton from the Allaru Mudstone was formerly called Minmi sp., but it was renamed Kunbarrasaurus ieversi in 2015.',
      'Its plant diet is inferred from ankylosaur anatomy, not from its own skull. The family placement of Minmi is unresolved, and there is no direct evidence of its behaviour.',
    ],
    takeaway: 'A small Australian ankylosaur known mainly from a skull-less partial skeleton.',
  },
  ouranosaurus: {
    lead:
      'Ouranosaurus nigeriensis was a large plant-eating ornithopod from the [Early Cretaceous](/deep-time?period=cretaceous) of Niger. It is instantly recognisable for the long neural spines along its back and tail, which supported a sail-like structure.',
    paragraphs: [
      'The spines are preserved bone, but the soft tissue that connected them is not. The animal’s silhouette is therefore a reconstruction. A second specimen, the Venice specimen, adds postcranial anatomy. Locomotion has been reconstructed as facultatively bipedal or predominantly quadrupedal, and the analyses disagree.',
      'Its plant diet is inferred from the skull and teeth. No gut contents are known, and the function of the “sail” — display, thermoregulation or something else — remains unresolved.',
    ],
    takeaway: 'A sail-backed plant-eater whose most famous feature is still functionally mysterious.',
  },
  plateosaurus: {
    lead:
      'Plateosaurus engelhardti was a large early sauropodomorph from the [Late Triassic](/deep-time?period=triassic) of Central Europe. It lived before the giant sauropods, but it already had a long neck, a robust body and a partly bipedal stance.',
    paragraphs: [
      'Hundreds of individuals are known from the Knollenmergel of Germany and the Frick quarry in Switzerland. That abundance makes Plateosaurus one of the best-sampled early dinosaurs, but the bonebeds may have formed through drought, flood or mudflow rather than social behaviour.',
      'Body mass estimates range from about 0.6 tonnes for a 6 m individual to about 4 tonnes for the largest adults. Growth was plastic, and the jaw mechanics are consistent with herbivory. No gut contents are known.',
    ],
    takeaway: 'An abundant Triassic early sauropodomorph with a long neck and a contested body mass.',
  },
  polacanthus: {
    lead:
      'Polacanthus foxii was an armoured dinosaur from the [Early Cretaceous](/deep-time?period=cretaceous) of the Isle of Wight, England. It belonged to Ankylosauria and is known mainly from armour and postcranial bones rather than a complete skull.',
    paragraphs: [
      'A solid shield of fused armour covers the pelvic region, and large spines line the neck and shoulders. The tail lacks a club. The armour is preserved, but its defensive function is inferred from structure and position.',
      'Polacanthus is usually placed in Nodosauridae, though some analyses use Polacanthidae or recover it elsewhere. Its plant diet is inferred from ankylosaur anatomy, and no gut contents are known.',
    ],
    takeaway: 'A spiny, shield-backed ankylosaur known mostly from its armour.',
  },
  shunosaurus: {
    lead:
      'Shunosaurus lii was a sauropod from the [Middle Jurassic](/deep-time?period=jurassic) of Sichuan, China. It had a relatively short neck for a sauropod and a small bony club at the end of its tail.',
    paragraphs: [
      'Many partial skeletons are known, including complete skulls and tail clubs, making Shunosaurus one of the better-sampled early sauropods. The skull has a short snout and leaf-shaped teeth. The tail club is formed by fused vertebrae.',
      'Its plant diet is inferred from the skull and teeth. The function of the tail club — defence or display — is unresolved, and there is no direct evidence of its social behaviour.',
    ],
    takeaway: 'An early sauropod with a short neck and a small tail club.',
  },
  therizinosaurus: {
    lead:
      'Therizinosaurus cheloniformis was a huge therizinosaur from the [Late Cretaceous](/deep-time?period=cretaceous) of Mongolia. It is known mainly from enormous manual claws and fragmentary postcranial material; no skull has been found.',
    paragraphs: [
      'The claws are among the largest of any known animal. Referred forelimb and hindlimb material suggests a bulky, short-legged body, but the animal’s exact proportions are reconstructed from incomplete remains. Herbivory is inferred from the wider therizinosaur record, not from this species’ jaws or gut contents.',
      'No feathers are preserved, so the presence of a covering is unknown. The function of the claws — feeding, defence or display — is unresolved. The dossier below is deliberately cautious about a dinosaur known from so little.',
    ],
    takeaway: 'A giant therizinosaur known mostly from its claws, with no skull to tell us what it ate.',
  },
  turiasaurus: {
    lead:
      'Turiasaurus riodevensis was one of the largest sauropods ever found in Europe. It lived in the [Late Jurassic](/deep-time?period=jurassic) of what is now Spain and is known from a partial skeleton and isolated teeth.',
    paragraphs: [
      'The humerus is massive, the teeth are large and spatulate, and the appendicular skeleton is robust. Length estimates of 30–37 m and mass estimates of 40–50 tonnes depend on reconstructing missing parts, so they are not measurements.',
      'Its plant diet is inferred from the teeth. A 2024 study proposed that large foraging migrations could help explain its size, but the hypothesis is comparative and has not been tested with direct evidence of migration. No gut contents are known.',
    ],
    takeaway: 'A huge European sauropod known from an incomplete skeleton.',
  },
  yutyrannus: {
    lead:
      'Yutyrannus huali was a large feathered tyrannosauroid from the [Early Cretaceous](/deep-time?period=cretaceous) of Liaoning, China. At about 9 metres long, it is one of the largest known dinosaurs with direct evidence of a feather-like covering.',
    paragraphs: [
      'Three nearly complete skeletons are known, and all preserve filamentous integument. The skull is deep and bears a midline nasal crest. The specimens were purchased from commercial collectors, so their exact quarry provenance is uncertain.',
      'Its teeth indicate carnivory, but no gut contents are known. The family placement is debated: some analyses put Yutyrannus in Proceratosauridae, while others place it outside. The feathers are direct evidence; their function and colour are not.',
    ],
    takeaway: 'A large feathered tyrannosauroid that shows feathers were not limited to small dinosaurs.',
  },
};

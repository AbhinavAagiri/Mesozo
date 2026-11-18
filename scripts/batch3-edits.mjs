// References, trails and species-text enrichment for the third research cohort.
// Applied by enrich-species-pass3.mjs. Existing reviews are never replaced.

export const newReferences = [
  {
    id: 'lambe1914',
    authors: 'Lambe, L. M.',
    year: 1914,
    title:
      'On Gryposaurus notabilis, a new genus and species of trachodont dinosaur from the Belly River Formation of Alberta, with a description of the skull of Chasmosaurus belli',
    journal: 'The Ottawa Naturalist',
    volume: '27',
    issue: '11',
    pages: '145–155',
    url: 'https://geology.utah.gov/apps/dino-database/pdf/lambe1914-gryposaurus-notabli.pdf',
    sourceType: 'Historical article',
    note:
      'Erects the genus Chasmosaurus for the species originally described as Monoclonius belli (Lambe, 1902). The same paper also proposed the preoccupied name Protorosaurus; Chasmosaurus is the replacement name.',
  },
  {
    id: 'conrad2018',
    authors: 'Conrad, J. L.',
    year: 2018,
    title:
      'A new lizard (Squamata) was the last meal of Compsognathus (Theropoda: Dinosauria) and is a holotype in a holotype',
    journal: 'Zoological Journal of the Linnean Society',
    volume: '183',
    issue: '3',
    pages: '584–634',
    doi: '10.1093/zoolinnean/zlx055',
    url: 'https://doi.org/10.1093/zoolinnean/zlx055',
    sourceType: 'Peer-reviewed article',
    note:
      'Redescribes the lizard preserved in the abdominal cavity of the Compsognathus longipes holotype as Schoenesmahl dyspepsia.',
  },
  {
    id: 'drumheller2020',
    authors: 'Drumheller, S. K., McHugh, J. B., Kane, M., Riedel, A., & D’Amore, D. C.',
    year: 2020,
    title:
      'High frequencies of theropod bite marks provide evidence for feeding, scavenging, and possible cannibalism in a stressed Late Jurassic ecosystem',
    journal: 'PLoS ONE',
    volume: '15',
    issue: '5',
    pages: 'e0233115',
    doi: '10.1371/journal.pone.0233115',
    url: 'https://doi.org/10.1371/journal.pone.0233115',
    sourceType: 'Peer-reviewed article',
    note:
      'Documents a high frequency of theropod bite marks at the Mygatt-Moore Quarry, including marks on Allosaurus bones consistent with possible cannibalism.',
  },
  {
    id: 'stromer1931',
    authors: 'Stromer, E.',
    year: 1931,
    title:
      'Ergebnisse der Forschungsreisen Prof. E. Stromers in den Wüsten Ägyptens. II. Wirbeltier-Reste der Baharîjestufe (unterstes Cenoman). 10. Ein Skelett-Rest von Carcharodontosaurus nov. gen.',
    journal:
      'Abhandlungen der Bayerischen Akademie der Wissenschaften, Mathematisch-naturwissenschaftliche Abteilung, Neue Folge',
    volume: '9',
    pages: '1–23',
    url: 'https://archiv.badw.de/de/005955625/005955625.pdf',
    sourceType: 'Historical article',
    note:
      'Erects the genus Carcharodontosaurus for the species originally described as Megalosaurus saharicus, based on a partial skeleton from the Bahariya Formation of Egypt.',
  },
  {
    id: 'wagner1859',
    authors: 'Wagner, J. A.',
    year: 1859,
    title:
      'Über einige im lithographischen Schiefer neu aufgefundene Schildkröten und Saurier',
    journal: 'Gelehrte Anzeigen der Bayerischen Akademie der Wissenschaften',
    volume: '49',
    pages: '553',
    sourceType: 'Historical article',
    note:
      'Brief notice in which the name Compsognathus longipes was first published. Wagner’s fuller 1861 monograph is the standard detailed description.',
  },
];

export const referenceCorrections = {
  lambe1902: {
    note:
      'This paper described Monoclonius belli, the species later made the type of Chasmosaurus by Lambe (1914). The same paper also named other Belly River taxa, so the note applies specifically to the Chasmosaurus material.',
  },
};

export const newTrails = {
  allosaurus: {
    note:
      'Four species-specific sources were located in this pass. Three had an accessible abstract or metadata record; full texts were not read. No verified specimen catalogue entry is linked in the MESOZO Discoveries archive. The original description remains the primary material reference; this is a documentation gap, not evidence that no specimen exists.',
    specimenStatus:
      'No verified specimen catalogue entry is linked in the MESOZO Discoveries archive. The original description remains the primary material reference; this is a documentation gap, not evidence that no specimen exists.',
    entries: [
      {
        title: 'Original description: Notice of new dinosaurian reptiles from the Jurassic formation',
        body:
          'Marsh’s 1877 notice is the name-bearing description. The material was fragmentary, so later referrals and the Cleveland-Lloyd sample, not the original type alone, supply most of the anatomy.',
        evidence: 'fossil',
        topic: 'taxonomy',
        refs: ['marsh1877'],
        access: 'Bibliographic record reviewed; full text not read in this pass.',
      },
      {
        title: 'Allosaurus fragilis: a revised osteology',
        body:
          'Madsen’s monograph is the baseline for the Cleveland-Lloyd sample. It documents dozens of individuals and the quarry’s taphonomy; the cause of the accumulation remains an interpretation.',
        evidence: 'fossil',
        topic: 'anatomy',
        refs: ['madsen1976'],
        access: 'Metadata and abstract reviewed; full text not read.',
      },
      {
        title: 'Cranial design and function in a large theropod dinosaur',
        body:
          'Rayfield and colleagues modelled the skull and jaw. The results constrain bite function; they do not record hunting behaviour.',
        evidence: 'inference',
        topic: 'anatomy',
        refs: ['rayfield2001'],
        access: 'Metadata and abstract reviewed; full text not read.',
      },
      {
        title:
          'High frequencies of theropod bite marks provide evidence for feeding, scavenging, and possible cannibalism',
        body:
          'Drumheller and colleagues document direct feeding traces at Mygatt-Moore, including marks on Allosaurus bones. The traces establish carcass utilization, not the hunting method.',
        evidence: 'fossil',
        topic: 'palaeobiology',
        refs: ['drumheller2020'],
        access: 'Abstract reviewed; full text not read.',
      },
    ],
  },
  ankylosaurus: {
    note:
      'Three species-specific sources were located in this pass. Two had an accessible abstract or metadata record; full texts were not read. No verified specimen catalogue entry is linked in the MESOZO Discoveries archive. The original description remains the primary material reference; this is a documentation gap, not evidence that no specimen exists.',
    specimenStatus:
      'No verified specimen catalogue entry is linked in the MESOZO Discoveries archive. The original description remains the primary material reference; this is a documentation gap, not evidence that no specimen exists.',
    entries: [
      {
        title: 'Original description: The Ankylosauridae, a new family of armored dinosaurs',
        body:
          'Brown’s 1908 description is the name-bearing account. The original material was incomplete; later specimens and comparisons supply the armour and tail-club anatomy.',
        evidence: 'fossil',
        topic: 'taxonomy',
        refs: ['brown1908'],
        access: 'Bibliographic record reviewed; full text not read in this pass.',
      },
      {
        title: 'Redescription of Ankylosaurus magniventris',
        body:
          'Carpenter’s redescription is the main anatomical reference for the skull, osteoderms and tail club. It also makes clear how small the sampled hypodigm is.',
        evidence: 'fossil',
        topic: 'anatomy',
        refs: ['carpenter2004'],
        access: 'Metadata and abstract reviewed; full text not read.',
      },
      {
        title: 'Tail-club impact mechanics',
        body:
          'Arbour’s modelling estimates the forces a club could generate. The model supports a defensive function but cannot demonstrate that the animal used the club in combat.',
        evidence: 'inference',
        topic: 'anatomy',
        refs: ['arbour2009'],
        access: 'Abstract reviewed; full text not read.',
      },
    ],
  },
  baryonyx: {
    note:
      'Three species-specific sources were located in this pass. Two had an accessible abstract or metadata record; full texts were not read. No verified specimen catalogue entry is linked in the MESOZO Discoveries archive. The original description remains the primary material reference; this is a documentation gap, not evidence that no specimen exists.',
    specimenStatus:
      'No verified specimen catalogue entry is linked in the MESOZO Discoveries archive. The original description remains the primary material reference; this is a documentation gap, not evidence that no specimen exists.',
    entries: [
      {
        title: 'Original description: Baryonyx, a remarkable new theropod dinosaur',
        body:
          'Charig and Milner’s 1986 announcement established the name and the significance of the Smokejacks skeleton. The full monograph followed in 1997.',
        evidence: 'fossil',
        topic: 'taxonomy',
        refs: ['charig1986'],
        access: 'Bibliographic record reviewed; full text not read in this pass.',
      },
      {
        title: 'The osteology of Baryonyx walkeri',
        body:
          'The 1997 monograph describes the skull, postcranium and associated fish remains. It is the primary source for the diet and manual-claw evidence.',
        evidence: 'fossil',
        topic: 'anatomy',
        refs: ['charig1997'],
        access: 'Metadata and abstract reviewed; full text not read.',
      },
      {
        title: 'A long-snouted predatory dinosaur from Africa and the evolution of spinosaurids',
        body:
          'Sereno and colleagues compared Baryonyx with African spinosaurids. The comparison supports the spinosaurid affinities of Baryonyx and the convergent long-snout anatomy.',
        evidence: 'inference',
        topic: 'taxonomy',
        refs: ['sereno1998'],
        access: 'Metadata and abstract reviewed; full text not read.',
      },
    ],
  },
  cryolophosaurus: {
    entries: [
      {
        title: 'Osteology of Cryolophosaurus ellioti',
        body:
          'Smith and colleagues describe the skull and postcranium and clarify the crest’s construction from the lacrimals. The description is the main anatomical reference for the species and supports the revised crest wording.',
        evidence: 'fossil',
        topic: 'anatomy',
        refs: ['v19-cryolophosaurus-46'],
        access: 'Metadata reviewed; full text not read.',
      },
    ],
  },
  brachiosaurus: {
    note:
      'Three species-specific sources were located in this pass. Two had an accessible abstract or metadata record; full texts were not read. No verified specimen catalogue entry is linked in the MESOZO Discoveries archive. The original description remains the primary material reference; this is a documentation gap, not evidence that no specimen exists.',
    specimenStatus:
      'No verified specimen catalogue entry is linked in the MESOZO Discoveries archive. The original description remains the primary material reference; this is a documentation gap, not evidence that no specimen exists.',
    entries: [
      {
        title: 'Original description: Brachiosaurus altithorax, the largest known dinosaur',
        body:
          'Riggs’ 1903 description is the name-bearing account. The holotype is a partial postcranial skeleton, so the skull and many proportional details come from referred material.',
        evidence: 'fossil',
        topic: 'taxonomy',
        refs: ['riggs1903'],
        access: 'Bibliographic record reviewed; full text not read in this pass.',
      },
      {
        title: 'A re-evaluation of Brachiosaurus and Giraffatitan',
        body:
          'Taylor’s analysis separates the African species into Giraffatitan and restricts Brachiosaurus altithorax to the North American holotype and close material. The separation is anatomical and phylogenetic.',
        evidence: 'inference',
        topic: 'taxonomy',
        refs: ['taylor2009'],
        access: 'Metadata and abstract reviewed; full text not read.',
      },
      {
        title: 'The skull of Brachiosaurus and its attribution',
        body:
          'D’Emic and Carrano redescribe the referred skull material and review its bearing on brachiosaurid anatomy. The attribution remains an inference because the holotype lacks a skull.',
        evidence: 'fossil',
        topic: 'anatomy',
        refs: ['demic2020'],
        access: 'Metadata and abstract reviewed; full text not read.',
      },
    ],
  },
};

const evidenceEntry = (title, body, evidence, refs) => ({ title, body, evidence, refs });

export const speciesEdits = {
  acrocanthosaurus: {
    set: {
      summary:
        'Acrocanthosaurus atokensis is a large carcharodontosaurid from the Aptian–Albian of the southern Western Interior. It is known from a partial type skeleton and referred skull and postcranial material. The tall neural spines supported a muscle-and-skin ridge, not a thin sail, and its forelimb function is reconstructed rather than observed.',
      confidenceNote:
        'The type is incomplete, but referred skull and postcranial material make the species anatomically well known. The soft tissue over the neural spines is not preserved, and the forelimb’s role in hunting is inferred from joint mechanics.',
      dietEvidence: {
        body:
          'The dentition is consistent with carnivory. No gut contents or direct feeding traces are known for Acrocanthosaurus, so prey choice and hunting method are inferred from anatomy and from other large theropods.',
        evidence: 'inference',
        refs: ['primary-acrocanthosaurus', 'v19-acrocanthosaurus-33'],
      },
      behaviour: {
        body:
          'The behavioural evidence is skeletal: the tall neural spines are consistent with a display or muscle-support ridge, but the soft tissue is unknown. Forelimb range of motion is compatible with grasping, not proof of a particular hunting strategy. No bonebed or trackway establishes social behaviour.',
        evidence: 'inference',
        refs: ['primary-acrocanthosaurus', 'v19-acrocanthosaurus-35'],
      },
    },
    addFossilEvidence: [
      evidenceEntry(
        'Type and referred material',
        'The holotype is a partial skeleton from the Antlers Formation. Referred skull and postcranial specimens add anatomy, but the species is not known from a complete skeleton. The neural-spine ridge is reconstructed from the preserved vertebrae.',
        'fossil',
        ['primary-acrocanthosaurus', 'v19-acrocanthosaurus-34'],
      ),
    ],
  },

  albertosaurus: {
    set: {
      summary:
        'Albertosaurus sarcophagus is an albertosaurine tyrannosaurid from the Horseshoe Canyon Formation of Alberta. The Dry Island bonebed has produced at least 26 individuals, and growth-series studies document changes in jaw force and tooth morphology. The bonebed is direct evidence of accumulation; social behaviour is an inference.',
      confidenceNote:
        'The skeleton and growth series are well sampled, and the Dry Island bonebed provides a population sample. The cause of the accumulation, the extent of social behaviour and the soft-tissue profile remain uncertain.',
      dietEvidence: {
        body:
          'The teeth and jaws are consistent with carnivory, and growth-series work shows changes in mandibular force and tooth morphology through ontogeny. No gut contents are known; prey choice is inferred from anatomy and from other tyrannosaurids.',
        evidence: 'inference',
        refs: ['v19-albertosaurus-22', 'osborn1905'],
      },
      behaviour: {
        body:
          'The Dry Island bonebed contains at least 26 individuals, including several growth stages. That is direct evidence of a mass accumulation, but a flood, drought or predator trap could concentrate animals that did not live as a group. Pack hunting and parental care are not demonstrated.',
        evidence: 'inference',
        refs: ['v19-albertosaurus-20', 'v19-albertosaurus-21'],
      },
    },
    addFossilEvidence: [
      evidenceEntry(
        'Dry Island bonebed',
        'The bonebed is monodominant and preserves at least 26 Albertosaurus individuals. It is the strongest population sample for the species, but the taphonomic cause of the concentration is debated.',
        'fossil',
        ['v19-albertosaurus-20', 'v19-albertosaurus-21'],
      ),
    ],
  },

  allosaurus: {
    set: {
      summary:
        'Allosaurus fragilis is a large allosaurid from the Morrison Formation, known from an exceptionally large sample including the Cleveland-Lloyd Quarry. The skull is relatively lightly built, with a wide gape and brow horns. Bite-marked bones show feeding on large dinosaurs, including other Allosaurus, but the accumulation and social behaviour are debated.',
      confidenceNote:
        'The skeleton is exceptionally well sampled. Feeding traces support predation and scavenging; social hunting is not established. The integument and soft-tissue profile are unknown. Size estimates depend on which specimens are included.',
      dietEvidence: {
        body:
          'Tooth-marked bones at Mygatt-Moore show that Allosaurus fed on large dinosaurs, including other Allosaurus. The traces establish carcass utilization; whether the animals were hunted or scavenged is not settled. No gut contents are known.',
        evidence: 'direct',
        refs: ['drumheller2020', 'hone2010'],
      },
      behaviour: {
        body:
          'Allosaurus was a predator and scavenger. The Cleveland-Lloyd accumulation was once read as evidence of pack hunting, but a predator trap or drought accumulation can produce the same pattern. There is no direct evidence of coordinated social hunting. Cannibalism is supported by tooth-marked Allosaurus bones, but whether this reflects predation or scavenging is unclear.',
        evidence: 'debate',
        refs: ['drumheller2020', 'madsen1976'],
      },
    },
    addFossilEvidence: [
      evidenceEntry(
        'Mygatt-Moore feeding traces',
        'About 29% of the bones at Mygatt-Moore preserve theropod bite marks, including marks on Allosaurus bones. The traces are direct evidence of feeding and possible cannibalism; the trace-maker is identified from tooth morphology and relative abundance.',
        'fossil',
        ['drumheller2020'],
      ),
    ],
    addReferences: ['drumheller2020'],
  },

  ankylosaurus: {
    set: {
      summary:
        'Ankylosaurus magniventris is a large ankylosaurid from the Hell Creek Formation of Montana. It is known from relatively few specimens, but these preserve the distinctive osteoderm armour and a tail club formed from fused vertebrae and armour. Club impact has been modelled, but its use in combat is inferred.',
      confidenceNote:
        'The armour and tail club are well supported. The sample is small, the growth series is limited, and soft tissue is unknown. Club function is reconstructed from mechanics, not observed behaviour.',
      dietEvidence: {
        body:
          'The skull and dentition are consistent with herbivory. No gut contents are known, and the plants eaten are inferred from tooth morphology and comparisons with other ankylosaurs.',
        evidence: 'inference',
        refs: ['carpenter2004', 'brown1908'],
      },
      behaviour: {
        body:
          'The tail club is a defensive structure by inference from its mass and shape. Modelling shows that it could deliver a high-impact strike, but no fossil records a strike against a predator. Social behaviour, parental care and vocalisation are unknown.',
        evidence: 'inference',
        refs: ['arbour2009', 'carpenter2004'],
      },
    },
    addFossilEvidence: [
      evidenceEntry(
        'Armour and tail club',
        'The body osteoderms and the tail club are preserved in articulated material. The club combines fused caudal vertebrae with a bony sheath; its impact force has been modelled, but no direct trace of use is known.',
        'fossil',
        ['carpenter2004', 'arbour2009'],
      ),
    ],
    addReferences: ['pbdb'],
  },

  apatosaurus: {
    set: {
      summary:
        'Apatosaurus louisae is a diplodocid sauropod from the Morrison Formation. It is known from partial skeletons and skull material, and its anatomical history includes a famous reconstruction error: an early mount used a Camarasaurus-like skull. Later work established the diplodocid skull and documented prolonged growth.',
      confidenceNote:
        'The postcranium is well known, but the skull and soft tissue are less completely sampled. Growth is inferred from histology, and the species’ taxonomy has a complicated history.',
      dietEvidence: {
        body:
          'The dentition is consistent with herbivory. No gut contents are known, and feeding height and plant choice are inferred from neck anatomy and comparisons with other diplodocids.',
        evidence: 'inference',
        refs: ['primary-apatosaurus', 'v19-apatosaurus-6'],
      },
      behaviour: {
        body:
          'Behaviour is reconstructed from the skeleton: the neck and tail are anatomically capable of a wide range of postures, but habitual posture is not preserved. No bonebed or trackway establishes social behaviour for this species.',
        evidence: 'unknown',
        refs: ['v19-apatosaurus-4'],
      },
    },
    addFossilEvidence: [
      evidenceEntry(
        'The skull problem',
        'Early reconstructions gave Apatosaurus a Camarasaurus-like skull. Later work established a diplodocid-style skull, and the old mount is now a classic example of reconstruction error.',
        'fossil',
        ['v19-apatosaurus-6'],
      ),
    ],
  },

  bajadasaurus: {
    set: {
      summary:
        'Bajadasaurus pronuspinax is a dicraeosaurid sauropod from the Bajada Colorada Formation of Argentina. It is known from a partial skull and skeleton, including extremely long cervical neural spines that curve forward. The spine function—display, defence or both—remains unresolved.',
      confidenceNote:
        'The material is incomplete and the sample is small. The elongated spines are direct evidence, but their soft-tissue covering and function are inferred. No gut contents or behaviour traces are known.',
      dietEvidence: {
        body:
          'The dentition is consistent with herbivory. No gut contents are known, and the plants eaten and feeding height are inferred from tooth shape and neck anatomy.',
        evidence: 'inference',
        refs: ['v19-bajadasaurus-201', 'primary-bajadasaurus'],
      },
      behaviour: {
        body:
          'The forward-curving neck spines are unusual and may have supported display structures or defensive spines. Neither function is demonstrated. Social behaviour and parental care are unknown.',
        evidence: 'debate',
        refs: ['primary-bajadasaurus', 'v19-bajadasaurus-199'],
      },
    },
    addFossilEvidence: [
      evidenceEntry(
        'Cervical spine series',
        'The holotype preserves a partial skull and skeleton, including the elongated cervical neural spines. The spines are bone; the soft tissue that covered them is not preserved.',
        'fossil',
        ['primary-bajadasaurus', 'v19-bajadasaurus-199'],
      ),
    ],
  },

  baryonyx: {
    set: {
      summary:
        'Baryonyx walkeri is a spinosaurid from the Weald Clay of Surrey, known from a partial associated skeleton. Fish scales and teeth in its body cavity are direct evidence of fish eating, while the long narrow skull and large manual claw are anatomical specialisations whose exact functions are inferred.',
      confidenceNote:
        'The holotype is relatively complete and includes direct gut contents. The skull is known but not complete, and the claw’s function and the animal’s hunting method are not preserved.',
      dietEvidence: {
        body:
          'Fish scales and fish teeth preserved in the body cavity are direct evidence that Baryonyx ate fish. The gut contents record at least one meal; they do not show that fish was the only food or how the animal caught it.',
        evidence: 'direct',
        refs: ['charig1997'],
      },
      behaviour: {
        body:
          'The long narrow skull, conical teeth and large manual claw are consistent with a specialized feeding ecology, but no direct observation of hunting is possible. The claw may have been used for fishing, digging or display; the function is unresolved.',
        evidence: 'inference',
        refs: ['charig1997', 'sereno1998'],
      },
    },
    addFossilEvidence: [
      evidenceEntry(
        'Gut contents',
        'Fish scales and teeth were preserved in the body cavity of the holotype. This is direct evidence of at least one fish meal, not a complete diet.',
        'fossil',
        ['charig1997'],
      ),
    ],
  },

  beipiaosaurus: {
    set: {
      summary:
        'Beipiaosaurus inexpectus is a therizinosaur from the Yixian Formation of Liaoning, China. It preserves filamentous integument and a pygostyle-like cluster of fused caudal vertebrae. Herbivory is inferred from the dentition and from other therizinosaurs; no gut contents are known.',
      confidenceNote:
        'The integument and tail structure are direct evidence from the holotype. The skull and skeleton are incomplete, the sample is small, and the function of the filamentous covering is unknown.',
      dietEvidence: {
        body:
          'The dentition is consistent with herbivory, and other therizinosaurs are interpreted as plant eaters. No gut contents are known; the plants eaten and the jaw mechanics remain inferred.',
        evidence: 'inference',
        refs: ['v19-beipiaosaurus-186', 'primary-beipiaosaurus'],
      },
      behaviour: {
        body:
          'The behavioural record is skeletal: the filamentous integument may have had display or thermoregulatory functions, but this is inferred. The pygostyle-like structure’s function is also unresolved. Social behaviour is unknown.',
        evidence: 'unknown',
        refs: ['primary-beipiaosaurus', 'v19-beipiaosaurus-187'],
      },
    },
    addFossilEvidence: [
      evidenceEntry(
        'Integument and tail',
        'The holotype preserves filamentous integument and a pygostyle-like cluster of fused caudal vertebrae. Both are direct anatomical evidence; their function and homology are interpreted.',
        'fossil',
        ['primary-beipiaosaurus', 'v19-beipiaosaurus-187'],
      ),
    ],
  },

  brachiosaurus: {
    set: {
      summary:
        'Brachiosaurus altithorax is a brachiosaurid sauropod from the Morrison Formation, known from a partial postcranial skeleton. Its forelimbs are longer than its hindlimbs, giving a high-shouldered profile. The African material formerly called B. brancai is now Giraffatitan, and the skull of Brachiosaurus is known mainly from a referred specimen.',
      confidenceNote:
        'The limb and shoulder anatomy is well supported. The skull is known mainly from a referred specimen, and total length and mass are reconstructed from incomplete material. Neck posture and social behaviour are hypotheses. Many “Brachiosaurus” images actually depict Giraffatitan.',
      dietEvidence: {
        body:
          'Spatulate teeth and a very large gut indicate herbivory. The long neck may have allowed browsing at height, but the habitual feeding posture is debated. No direct gut contents are known for Brachiosaurus.',
        evidence: 'inference',
        refs: ['taylor2009', 'taylor2009neck'],
      },
      behaviour: {
        body:
          'Direct evidence for Brachiosaurus behaviour is very limited. Trackways from the Morrison Formation show that sauropods walked on land, but they cannot be assigned to this genus with confidence. Herding, parental care and vocalisation are inferences, not observations.',
        evidence: 'unknown',
        refs: ['taylor2009'],
      },
    },
    addFossilEvidence: [
      evidenceEntry(
        'Holotype and referred skull',
        'The holotype, FMNH P 25107, preserves parts of the vertebral column, ribs, pelvis and limbs but no skull. A large skull from the Felch Quarry has been referred to the species, but the attribution is not universally accepted.',
        'fossil',
        ['riggs1903', 'demic2020'],
      ),
    ],
  },

  camarasaurus: {
    set: {
      summary:
        'Camarasaurus supremus is a common Morrison Formation sauropod, known from multiple skulls and partial skeletons. It has a deep, relatively short skull with spoon-shaped teeth. Growth marks in dorsal ribs and cranial myology provide evidence for its growth and feeding, but no gut contents are known.',
      confidenceNote:
        'The skull and postcranium are well sampled. Growth and feeding are inferred from histology and biomechanics, and soft tissue is unknown.',
      dietEvidence: {
        body:
          'The deep skull, robust jaws and spoon-shaped teeth are consistent with herbivory. Tooth replacement and jaw mechanics have been studied, but no gut contents are known; the plants eaten are inferred.',
        evidence: 'inference',
        refs: ['v19-camarasaurus-159', 'v19-camarasaurus-160'],
      },
      behaviour: {
        body:
          'Behaviour is inferred from the skull and jaws: they are capable of cropping and processing vegetation, but habitual feeding height and social behaviour are reconstructed from anatomy and bonebed associations, not observed.',
        evidence: 'inference',
        refs: ['v19-plateosaurus-63'],
      },
    },
    addFossilEvidence: [
      evidenceEntry(
        'Skull and growth series',
        'Multiple skulls and partial skeletons are known. Dorsal-rib histology records growth marks; the sample shows variation in growth among individuals.',
        'fossil',
        ['v19-camarasaurus-158', 'v19-camarasaurus-160'],
      ),
    ],
  },

  carcharodontosaurus: {
    set: {
      namedBy: 'Depéret & Savornin, 1925; genus Stromer, 1931',
      summary:
        'Carcharodontosaurus saharicus is a large carcharodontosaurid from the Kem Kem Group of North Africa. Much of the original Egyptian material was destroyed in the Second World War, and later Moroccan and Nigerien finds supply most of the current anatomy. The skull is long and relatively lightly built, with large serrated teeth.',
      confidenceNote:
        'The original type material is destroyed or fragmentary, so the species concept depends heavily on referred material. Size and bite estimates are reconstructed from incomplete specimens.',
      dietEvidence: {
        body:
          'The large, laterally compressed, serrated teeth are consistent with carnivory and flesh slicing. No gut contents are known; prey choice and hunting method are inferred from anatomy and biomechanics.',
        evidence: 'inference',
        refs: ['v19-carcharodontosaurus-32'],
      },
      behaviour: {
        body:
          'The behavioural evidence is indirect: biomechanical modelling suggests a powerful bite and the ability to remove large pieces of flesh, but the maximum prey size it could handle is an estimate. Social behaviour is unknown.',
        evidence: 'inference',
        refs: ['v19-carcharodontosaurus-31'],
      },
    },
    discovery: {
      body:
        'The species was first described as Megalosaurus saharicus by Depéret and Savornin in 1925 from isolated teeth from Algeria. In 1931 Ernst Stromer erected the genus Carcharodontosaurus and referred a partial skeleton from the Bahariya Formation of Egypt to the species. The name-bearing teeth are lost and much of the Egyptian material was destroyed during the Second World War; later Moroccan and Nigerien finds supply most of the current anatomy.',
      evidence: 'fossil',
      refs: ['primary-carcharodontosaurus', 'stromer1931'],
    },
    addFossilEvidence: [
      evidenceEntry(
        'Destroyed type and referred skulls',
        'The original Egyptian material was largely destroyed during the Second World War. Later skull material from Morocco and Niger provides most of the current anatomical sample, but the species remains known from incomplete material.',
        'fossil',
        ['primary-carcharodontosaurus', 'stromer1931', 'v19-carcharodontosaurus-32'],
      ),
    ],
    addReferences: ['stromer1931'],
  },

  centrosaurus: {
    set: {
      summary:
        'Centrosaurus apertus is a centrosaurine ceratopsid from the Dinosaur Park and Oldman formations of Alberta. A monodominant bonebed has produced many individuals, and cranial ontogeny has been reconstructed from a size series. Bite marks on a juvenile frill record a direct carnivore interaction.',
      confidenceNote:
        'The bonebed provides a large sample, but herding is inferred from the accumulation. Ornament function and the cause of the bonebed remain debated. The bite-marked frill records damage, not the identity of the attacker.',
      dietEvidence: {
        body:
          'The beak and dentition are consistent with herbivory. No gut contents are known; the plants eaten and feeding height are inferred from anatomy and comparisons with other ceratopsids.',
        evidence: 'inference',
        refs: ['primary-centrosaurus', 'v19-centrosaurus-89'],
      },
      behaviour: {
        body:
          'A monodominant bonebed containing many individuals is direct evidence of a mass accumulation. Herding is an inference; a drought, flood or other concentrating event could produce the same pattern. The frill and horns are usually interpreted as display or species-recognition structures, but their function is not demonstrated.',
        evidence: 'inference',
        refs: ['v19-centrosaurus-88', 'v19-centrosaurus-89'],
      },
    },
    addFossilEvidence: [
      evidenceEntry(
        'Bonebed and bite-marked juvenile',
        'A monodominant Centrosaurus bonebed preserves many individuals. A separate juvenile frill preserves bite marks, direct evidence of a carnivore interaction.',
        'fossil',
        ['v19-centrosaurus-88', 'v19-centrosaurus-91'],
      ),
    ],
  },

  ceratosaurus: {
    set: {
      summary:
        'Ceratosaurus nasicornis is a ceratosaurid from the Morrison Formation, known from partial skeletons and skulls. It has a prominent nasal horn and paired brow horns, and its forearm and hand are anatomically distinct from those of larger tetanurans. Isolated teeth from Uruguay extend the genus’s range.',
      confidenceNote:
        'The skull and postcranium are known from several specimens, but no complete skeleton is known. Horn function is inferred, and the South American record is tooth-based.',
      dietEvidence: {
        body:
          'The recurved, serrated teeth are consistent with carnivory. No gut contents are known; prey choice is inferred from anatomy and from the Morrison ecosystem.',
        evidence: 'inference',
        refs: ['primary-ceratosaurus', 'v19-ceratosaurus-37'],
      },
      behaviour: {
        body:
          'The nasal and brow horns are usually interpreted as display or species-recognition structures, but they could also have been used in combat. Direct evidence of behaviour is limited to the skeleton; social behaviour is unknown.',
        evidence: 'inference',
        refs: ['v19-ceratosaurus-37'],
      },
    },
    addFossilEvidence: [
      evidenceEntry(
        'Horns and forelimb',
        'The skull preserves a nasal horn and paired brow horns. The forearm and hand are known from associated material and differ from those of larger tetanurans.',
        'fossil',
        ['primary-ceratosaurus', 'v19-ceratosaurus-36'],
      ),
    ],
  },

  chasmosaurus: {
    set: {
      namedBy: 'Lambe, 1902',
      summary:
        'Chasmosaurus belli is a chasmosaurine ceratopsid from the Dinosaur Park Formation of Alberta. The species was named as Monoclonius belli in 1902 and moved to the new genus Chasmosaurus in 1914. It has a long, fenestrated frill, short brow horns and preserved skin impressions; claims of sexual dimorphism have been re-examined and are not strongly supported.',
      confidenceNote:
        'The skull and frill are well known from several specimens, and skin impressions are preserved. Frill function and sexual dimorphism are unresolved. The species has a complicated nomenclatural history and should be cited as Chasmosaurus belli (Lambe, 1902).',
      dietEvidence: {
        body:
          'The beak and dentition are consistent with herbivory. No gut contents are known; the plants eaten and feeding height are inferred from anatomy and comparisons with other ceratopsids.',
        evidence: 'inference',
        refs: ['lambe1902', 'lambe1914'],
      },
      behaviour: {
        body:
          'The long frill and short brow horns are usually interpreted as display or species-recognition structures, but their function is not demonstrated. A re-evaluation of the postcranium found the evidence for sexual dimorphism weak or inconsistent. Social behaviour is unknown.',
        evidence: 'debate',
        refs: ['v19-chasmosaurus-109', 'v19-chasmosaurus-111'],
      },
    },
    discovery: {
      body:
        'Lawrence Lambe named the species Monoclonius belli in 1902 from a partial parietal, CMN 0491, from the Dinosaur Park Formation of Alberta. In 1914 he erected the genus Chasmosaurus for it after the earlier name Protorosaurus proved preoccupied. The species epithet honours collector Walter Bell; the genus name refers to the large openings in the frill.',
      evidence: 'fossil',
      refs: ['lambe1902', 'lambe1914'],
    },
    addFossilEvidence: [
      evidenceEntry(
        'Naming history and type',
        'The holotype is a partial parietal, CMN 0491. Lambe named the species Monoclonius belli in 1902 and erected Chasmosaurus in 1914. Later specimens include skulls and skin impressions.',
        'fossil',
        ['lambe1902', 'lambe1914'],
      ),
    ],
    addReferences: ['lambe1914'],
  },

  citipati: {
    set: {
      summary:
        'Citipati osmolskae is an oviraptorid from the Djadokhta Formation of Mongolia. Several specimens are preserved on nests, providing direct evidence of nesting association; brooding is inferred from posture and context. The skull is deep and short with a robust edentulous beak.',
      confidenceNote:
        'The nesting specimens are exceptional, but the behaviour is inferred from preserved association and posture. Diet is not directly known, and soft tissue and colour are unknown.',
      dietEvidence: {
        body:
          'The edentulous beak and robust jaws are consistent with a specialized diet, but no gut contents are known. Diet is inferred from skull anatomy and from other oviraptorids.',
        evidence: 'inference',
        refs: ['v19-oviraptor-179', 'primary-citipati'],
      },
      behaviour: {
        body:
          'Several Citipati specimens are preserved in contact with nests of eggs. The association is direct evidence of nesting; brooding is inferred from the preserved posture and nest context. Parental care beyond brooding is not demonstrated.',
        evidence: 'inference',
        refs: ['v19-citipati-182'],
      },
    },
    addFossilEvidence: [
      evidenceEntry(
        'Nesting specimens',
        'Several skeletons are preserved on nests. The association is direct; the interpretation of the animals as brooding parents is based on posture and comparison with living archosaurs.',
        'fossil',
        ['v19-citipati-182'],
      ),
    ],
  },

  compsognathus: {
    set: {
      summary:
        'Compsognathus longipes is a small compsognathid from the Solnhofen Limestone of Bavaria, known from a German holotype and a larger French specimen. A lizard is preserved in the holotype’s abdominal cavity, providing direct evidence of diet. The hand is reduced, and its digital count has been disputed.',
      confidenceNote:
        'Two well-preserved skeletons provide most of the anatomy. The gut content records one meal, not the full diet. The integument is poorly known, and the hand’s digital identity is reconstructed.',
      dietEvidence: {
        body:
          'A small lizard is preserved in the abdominal cavity of the German holotype. It was redescribed as Schoenesmahl dyspepsia in 2018. This is direct evidence of at least one meal; the rest of the diet is inferred.',
        evidence: 'direct',
        refs: ['conrad2018'],
      },
      behaviour: {
        body:
          'The behavioural record is limited to the gut content and preservation. The animal was a small bipedal predator, but hunting method, social behaviour and home range are unknown. The hand’s reduced digital count is anatomical, not behavioural, evidence.',
        evidence: 'inference',
        refs: ['v19-compsognathus-18', 'conrad2018'],
      },
    },
    discovery: {
      body:
        'Johann A. Wagner named Compsognathus longipes in 1859 from the Solnhofen Limestone of Bavaria and published a fuller description in 1861. The German holotype, BSP AS I 563, preserves a lizard in its abdominal cavity. A larger French specimen from Canjuers was once named C. corallestris but is now referred to C. longipes.',
      evidence: 'fossil',
      refs: ['wagner1859', 'primary-compsognathus', 'conrad2018'],
    },
    addFossilEvidence: [
      evidenceEntry(
        'Gut content',
        'A lizard skeleton is preserved in the abdominal cavity of the German holotype. The specimen was redescribed as Schoenesmahl dyspepsia in 2018, making it a direct record of at least one meal.',
        'fossil',
        ['conrad2018'],
      ),
    ],
    addReferences: ['conrad2018', 'wagner1859'],
  },

  concavenator: {
    set: {
      summary:
        'Concavenator corcovatus is a carcharodontosaurid from the Las Hoyas locality of Spain, known from a nearly complete articulated skeleton. It has a tall triangular hump over the pelvis formed by elongated neural spines. Possible quill knobs on the ulna have been interpreted as evidence for a feather-like covering, but the identification is contested.',
      confidenceNote:
        'The holotype is exceptionally complete and articulated. The quill-knob interpretation is debated, and the soft tissue of the hump is unknown. The species is known from a single major specimen.',
      dietEvidence: {
        body:
          'The dentition is consistent with carnivory. No gut contents are known; prey choice and hunting method are inferred from skull and postcranial anatomy.',
        evidence: 'inference',
        refs: ['primary-concavenator', 'v19-concavenator-198'],
      },
      behaviour: {
        body:
          'The behavioural evidence is skeletal: the pelvic hump and possible ulnar quill knobs are usually interpreted as display structures, but their function is not demonstrated. Social behaviour is unknown.',
        evidence: 'inference',
        refs: ['v19-concavenator-196', 'v19-concavenator-197'],
      },
    },
    addFossilEvidence: [
      evidenceEntry(
        'Articulated holotype',
        'The holotype is a nearly complete, articulated skeleton from Las Hoyas. It preserves the pelvic hump and the ulna, including the structures interpreted as possible quill knobs.',
        'fossil',
        ['primary-concavenator', 'v19-concavenator-197'],
      ),
    ],
  },

  corythosaurus: {
    set: {
      summary:
        'Corythosaurus casuarius is a lambeosaurine hadrosaurid from the Dinosaur Park Formation of Alberta. It has a tall, hollow, helmet-like crest connected to the nasal passages. The holotype was historically separated into different collections and later reunited, and the species is also known from the Judith River Formation of Montana.',
      confidenceNote:
        'The crest and skull anatomy are well known. Crest function is inferred, and soft tissue and colour are unknown. The Judith River occurrence extends the range but does not establish population structure.',
      dietEvidence: {
        body:
          'The dental battery and beak are consistent with herbivory. No gut contents are known; the plants eaten and feeding mechanics are inferred from anatomy and comparisons with other hadrosaurids.',
        evidence: 'inference',
        refs: ['primary-corythosaurus', 'v19-corythosaurus-116'],
      },
      behaviour: {
        body:
          'The hollow crest is usually interpreted as a resonating or display structure, but its function is not demonstrated. Bonebed associations in other hadrosaurids suggest social behaviour, but no such association is established for this species here.',
        evidence: 'inference',
        refs: ['primary-corythosaurus'],
      },
    },
    addFossilEvidence: [
      evidenceEntry(
        'Crest and holotype',
        'The skull bears a tall, hollow crest connected to the nasal passages. The holotype was historically separated into different collections and later reunited.',
        'fossil',
        ['primary-corythosaurus', 'v19-corythosaurus-116'],
      ),
    ],
  },

  cryolophosaurus: {
    set: {
      summary:
        'Cryolophosaurus ellioti is a theropod from the Hanson Formation of Antarctica, known from a partial skull and postcranial skeleton. It bears a prominent transverse crest on the skull. The Hanson Formation records a high-latitude, cool-temperate environment during the Early Jurassic.',
      confidenceNote:
        'The skull and postcranium are known from associated material, but the skeleton is incomplete. Crest function is inferred, and the high-latitude ecology is reconstructed from geology and flora.',
      dietEvidence: {
        body:
          'The dentition is consistent with carnivory. No gut contents are known; prey choice and hunting method are inferred from skull and postcranial anatomy.',
        evidence: 'inference',
        refs: ['primary-cryolophosaurus', 'v19-cryolophosaurus-46'],
      },
      behaviour: {
        body:
          'The transverse crest is usually interpreted as a display structure, but its function is not demonstrated. The animal lived in a seasonal, high-latitude environment; social behaviour and overwintering strategy are unknown.',
        evidence: 'inference',
        refs: ['primary-cryolophosaurus'],
      },
    },
    addFossilEvidence: [
      evidenceEntry(
        'Crest and skeleton',
        'The skull bears a prominent transverse crest. The associated postcranium is incomplete but includes diagnostic material. Soft tissue is not preserved.',
        'fossil',
        ['primary-cryolophosaurus', 'v19-cryolophosaurus-46'],
      ),
    ],
  },

  daspletosaurus: {
    set: {
      summary:
        'Daspletosaurus torosus is a tyrannosaurine from the Dinosaur Park Formation of Alberta. It is known from several skeletons and a growth series, and a juvenile metatarsal informs locomotor development. The genus is central to debates about transitional species and anagenesis in tyrannosaurines.',
      confidenceNote:
        'The skull and postcranium are well known, but the growth series is incomplete and species-level taxonomy is contested. The anagenesis hypothesis is debated, not established.',
      dietEvidence: {
        body:
          'The teeth and jaws are consistent with carnivory, and growth-related changes in the skull have been studied. No gut contents are known; prey choice is inferred from anatomy and from other tyrannosaurids.',
        evidence: 'inference',
        refs: ['primary-daspletosaurus', 'v19-daspletosaurus-24'],
      },
      behaviour: {
        body:
          'The behavioural evidence is skeletal: the skull and jaws indicate a large predator, but hunting method and social behaviour are inferred. The transitional-species and anagenesis debates concern taxonomy and stratigraphy, not observed behaviour.',
        evidence: 'inference',
        refs: ['v19-daspletosaurus-25', 'v19-daspletosaurus-26'],
      },
    },
    addFossilEvidence: [
      evidenceEntry(
        'Growth and stratigraphic sample',
        'Several skeletons and a juvenile metatarsal inform growth and locomotion. The stratigraphic succession is central to the anagenesis debate, but the species assignments are contested.',
        'fossil',
        ['v19-daspletosaurus-24', 'v19-daspletosaurus-26'],
      ),
    ],
  },
};

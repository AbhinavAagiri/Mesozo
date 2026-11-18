// Phase 2 content corrections. Run once from `mesozo/`.
// Every edit is data-only: no routes, components, assets or Spinosaurus files.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('.');
const readJson = async (file) => JSON.parse(await readFile(path.join(root, file), 'utf8'));
const writeJson = async (file, data) =>
  writeFile(path.join(root, file), `${JSON.stringify(data, null, 2)}\n`);

const referencesPath = 'src/data/references.json';
const v19ReferencesPath = 'src/data/references-v19.json';
const references = await readJson(referencesPath);
const v19References = await readJson(v19ReferencesPath);
const referenceById = new Map([...references, ...v19References].map((ref) => [ref.id, ref]));

/* ------------------------------------------------------------------ */
/* Reference corrections                                               */
/* ------------------------------------------------------------------ */

if (!referenceById.has('derooij2022')) {
  references.push({
    id: 'derooij2022',
    authors:
      'de Rooij, J., van der Lubbe, J. H. J. L., Verdegaal, S., Hulscher, M., Tooms, D., Kaskes, P., Verhage, O., Portanger, L., & Schulp, A. S.',
    year: 2022,
    title:
      'Stable isotope record of Triceratops from a mass accumulation (Lance Formation, Wyoming, USA) provides insights into Triceratops behaviour and ecology',
    journal: 'Palaeogeography, Palaeoclimatology, Palaeoecology',
    volume: '607',
    pages: '111274',
    doi: '10.1016/j.palaeo.2022.111274',
    url: 'https://doi.org/10.1016/j.palaeo.2022.111274',
    sourceType: 'Peer-reviewed article',
    subjects: ['Triceratops horridus'],
    note:
      'Open-access study of the Darnell Triceratops Bonebed. It documents a multi-individual accumulation and discusses, but does not establish, a stable social group.',
  });
}

if (!referenceById.has('mantell1827')) {
  references.push({
    id: 'mantell1827',
    authors: 'Mantell, G. A.',
    year: 1827,
    title:
      'Illustrations of the geology of Sussex: containing a general view of the geological relations of the south-eastern part of England, with figures and descriptions of the fossils of Tilgate Forest',
    publisher: 'Lupton Relfe, London',
    pages: '67, pls 18–19',
    sourceType: 'Historical monograph',
    subjects: ['Megalosaurus bucklandii'],
    note:
      'Names Megalosaurus bucklandii. Buckland (1824) had described the genus and its material but did not establish the binomial species name. No DOI is appropriate for this historical monograph.',
  });
}

const referenceUpdates = {
  ostrom1969: {
    url: 'https://elischolar.library.yale.edu/peabody_museum_natural_history_bulletin/30',
    note:
      'Open-access facsimile at EliScholar, Yale Peabody Museum. The bulletin is the original 1969 monograph, not a later reprint.',
  },
  brown1908: {
    url: 'https://hdl.handle.net/2246/1435',
    note: 'AMNH Digital Library record and PDF for Bulletin of the AMNH 24, article 12.',
  },
  charig1997: {
    url: 'https://www.biodiversitylibrary.org/part/75343',
    note:
      'Biodiversity Heritage Library article record for the 1997 monograph. The name Baryonyx walkeri was first published in the 1986 Nature paper, which is a separate record.',
  },
  welles1970: {
    url: 'https://pubs.geoscienceworld.org/paleosoc/jpaleontol/article/44/5/989/107647/Dilophosaurus-Reptilia-Saurischia-a-new-name-for-a',
    note:
      'Stable publisher record for the short 1970 taxonomic note. The species was first described as Megalosaurus wetherilli by Welles (1954).',
  },
  brown1943: {
    url: 'https://hdl.handle.net/2246/387',
    note: 'AMNH Digital Library record and PDF for Bulletin of the AMNH 82, article 5.',
  },
  owen1842: {
    url: 'https://archive.org/details/cbarchive_108440_1842reportonbritishfossilrepti9999',
    note:
      'Internet Archive facsimile of the 1842 British Association report. It is a historical publication without a DOI.',
  },
  'primary-pachycephalosaurus': {
    note:
      'This is Galton and Sues’s 1983 redescription, not the original species description. Gilmore (1931) named the species Troodon wyomingensis; Brown and Schlaikjer (1943) erected Pachycephalosaurus and combined it as P. wyomingensis.',
  },
  'primary-compsognathus': {
    note:
      'This is Wagner’s 1861 detailed monograph, not the first publication of the name. The binomial Compsognathus longipes was first published in Wagner (1859), which is recorded separately.',
  },
  'primary-polacanthus': {
    note:
      'Hulke’s 1881 paper is the first detailed description of the specimen. The name Polacanthus foxii had already been published in 1865 and attributed to Owen, but no conventional Owen 1865 description exists; the 1865 naming act is an anonymous report. The dossier states this qualification rather than treating Hulke as the 1865 author.',
  },
};

for (const ref of [...references, ...v19References]) {
  const patch = referenceUpdates[ref.id];
  if (patch) Object.assign(ref, patch);
}

/* ------------------------------------------------------------------ */
/* Nomenclatural and claim corrections                                 */
/* ------------------------------------------------------------------ */

const speciesCorrections = {
  coelophysis: {
    namedBy: 'Cope, 1887 (species, as Coelurus bauri); Cope, 1889 (genus)',
  },
  euoplocephalus: {
    namedBy: 'Lambe, 1902 (species, as Stereocephalus tutus); Lambe, 1910 (genus)',
  },
  polacanthus: {
    namedBy: 'Owen vide Anonymous, 1865; first described by Hulke, 1881',
  },
  megalosaurus: {
    addReferences: ['mantell1827'],
  },
  triceratops: {
    addReferences: ['derooij2022'],
  },
  tenontosaurus: {
    addReferences: ['maxwell1995', 'roach2007'],
  },
  velociraptor: {
    addReferences: ['roach2007'],
  },
};

for (const [slug, correction] of Object.entries(speciesCorrections)) {
  const file = `src/data/species/${slug}.json`;
  const species = await readJson(file);
  if (correction.namedBy) species.namedBy = correction.namedBy;
  if (correction.addReferences) {
    for (const id of correction.addReferences) {
      if (!species.references.includes(id)) species.references.push(id);
    }
  }
  species.updated = '2026-11-17';
  await writeJson(file, species);
}

const claimsPath = 'src/data/claim-reviews.json';
const claimData = await readJson(claimsPath);
const claim = (slug, id) => {
  const found = claimData.reviews[slug]?.claims.find((item) => item.id === id);
  if (!found) throw new Error(`Missing claim ${slug}/${id}`);
  return found;
};

claim('megalosaurus', 'megalosaurus-naming').refs = ['buckland1824', 'mantell1827', 'benson2008'];
claim('megalosaurus', 'megalosaurus-naming').qualification =
  'Buckland (1824) described the genus and its material; Mantell (1827) established the binomial M. bucklandii. The 1824 description was based on a collection of bones from several individuals, not a single skeleton.';

const polacanthusHolotype = claim('polacanthus', 'polacanthus-holotype');
polacanthusHolotype.statement =
  'The name Polacanthus foxii was first published in 1865 and attributed to Richard Owen; John Whitaker Hulke described the holotype in detail in 1881. The specimen is a partial skeleton from the Wessex Formation of the Isle of Wight.';
polacanthusHolotype.qualification =
  'The 1865 naming act is an anonymous report of Fox’s lecture; no conventional Owen 1865 description exists. Hulke’s 1881 paper is the first detailed description and the basis for the anatomy used here. The skull is incomplete.';
polacanthusHolotype.refs = ['primary-polacanthus', 'pbdb'];

const triceratopsHerding = claim('triceratops', 'triceratops-herding');
triceratopsHerding.statement =
  'Triceratops is often reconstructed as solitary, but a juvenile bonebed in Montana and a five-individual mass accumulation in Wyoming show that some individuals were associated. Whether these associations represent a herd, a family group or a time-averaged accumulation is debated.';
triceratopsHerding.evidence = 'debate';
triceratopsHerding.refs = ['derooij2022'];
triceratopsHerding.context = 'Darnell Triceratops Bonebed, Lance Formation, Wyoming; juvenile bonebed, Hell Creek Formation, Montana.';
triceratopsHerding.qualification =
  'The Wyoming bonebed preserves at least five individuals in a single horizon, and the authors argue for rapid burial of associated animals. The deposit does not establish a stable herd, and the Montana juvenile bonebed is a separate accumulation. Older solitary reconstructions and newer group reconstructions are both represented in the literature.';
triceratopsHerding.conflict =
  'Some accounts treat the bonebeds as evidence of herding; others emphasize that a mass accumulation can form without a living social group.';

const velociraptorPack = claim('velociraptor', 'velociraptor-pack-hunting');
velociraptorPack.evidence = 'debate';
velociraptorPack.refs = ['roach2007'];
velociraptorPack.qualification =
  'Associated theropod remains and popular reconstructions have been read as evidence of group hunting. Roach and Brinkman (2007) review the comparative and fossil evidence and argue that coordinated pack hunting is not demonstrated; the null hypothesis is solitary hunting or loose foraging.';
velociraptorPack.conflict =
  'Popular accounts often reconstruct Velociraptor as a coordinated pack hunter; the reviewed fossil evidence does not establish that behaviour.';

const tenontosaurusDeinonychus = claim('tenontosaurus', 'tenontosaurus-deinonychus');
tenontosaurusDeinonychus.refs = ['ostrom1970', 'maxwell1995', 'roach2007'];
tenontosaurusDeinonychus.qualification =
  'The association is direct evidence that Tenontosaurus and Deinonychus remains occur together at some sites. It does not establish predation, coordinated hunting or scavenging; Maxwell and Ostrom (1995) and Roach and Brinkman (2007) treat the behavioural interpretation as unresolved.';

const turiasaurusTeeth = claim('turiasaurus', 'turiasaurus-teeth');
turiasaurusTeeth.evidence = 'inference';
turiasaurusTeeth.qualification =
  'The large, spatulate tooth crowns are preserved. Herbivory is a functional inference from tooth shape and wear, not a direct observation of diet; the plants eaten and the feeding height are unknown.';

await writeJson(claimsPath, claimData);

/* ------------------------------------------------------------------ */
/* Species-specific biology                                            */
/* ------------------------------------------------------------------ */

const biology = {
  dicraeosaurus: {
    behaviour:
      'No nest, trackway or social association is known for Dicraeosaurus. Several partial skeletons from Tendaguru show that more than one individual is represented, but the deposits do not record a living group, and the Berlin mount is a composite. Feeding is inferred from the jaw and teeth, not observed.',
  },
  leaellynasaura: {
    diet:
      'Herbivory is inferred from the small maxilla and teeth of the holotype, NMV P185991. No gut contents or coprolites are known; the plants eaten and the feeding height are not preserved. Because the postcranial material is disputed, the diet cannot be tied to the long-tailed reconstruction.',
    behaviour:
      'The only direct evidence is skeletal. The polar setting is geological, not behavioural: no feathers, skin, burrow or hibernation trace is known, and the postcranial fragments once used to reconstruct a long-tailed body are not securely referable to the species. Social behaviour and seasonal activity remain unknown.',
  },
  lesothosaurus: {
    diet:
      'The dentition and jaw apparatus support herbivory, but no gut contents are known. CT work clarified the skull and palate while leaving the snout and jaw muscles partly reconstructed; the plants eaten and the feeding style are therefore inferences.',
    behaviour:
      'Muscle-moment-arm modelling supports a bipedal, cursorial posture, but this is a functional reconstruction from an incomplete skeleton, not a measured speed or a trackway. No nests, social associations or direct feeding traces are known. The available sample is dominated by juveniles, which complicates interpretation of adult behaviour.',
    confidence:
      'Confidence is high for the disarticulated skull and postcranial anatomy and for the 1978 type designation. It is low for adult variation, the proposed synonymy of Stormbergia, and any social or feeding behaviour. The species is known from several individuals, but no complete articulated skeleton.',
  },
  mapusaurus: {
    diet:
      'The skull, serrated teeth and carcharodontosaurid anatomy support a predatory, flesh-slicing diet. No gut contents, coprolites or feeding traces are tied to Mapusaurus, so prey choice and hunting method remain inferences. Pathologies document injury and feeding-related damage, not a hunting strategy.',
    behaviour:
      'The Huincul bonebed contains at least seven individuals, which is direct evidence that several animals were buried together. It does not demonstrate cooperative hunting: a predator trap, a carcass accumulation or a social group are all compatible with the association. The mounted skeleton is a composite, and no trackway or nest is known.',
    confidence:
      'Confidence is high for the cranial anatomy, the bonebed association and the composite nature of the mount. It is low for the cause of the accumulation, pack hunting, prey selection and the completeness of any single individual. The name-bearing specimen is a right nasal, not a skeleton.',
  },
  monolophosaurus: {
    diet:
      'The dentition and jaw apparatus support carnivory, but no gut contents or feeding traces are known. The prey species and hunting method are inferred from skull and tooth morphology, not observed.',
    behaviour:
      'The median crest is preserved bone, and display is a plausible functional hypothesis based on its size and position. No direct evidence shows a social or signalling function, and the animal’s vision and behaviour are unknown. No nest, trackway or associated assemblage is known.',
    confidence:
      'Confidence is high for the skull and partial postcranial skeleton of IVPP 84019. It is lower for the crest’s function, the missing postcranium, diet and behaviour. The publication is dated 1993 in the journal but often cited as 1994, and the dossier preserves that inconsistency rather than silently normalising it.',
  },
  muttaburrasaurus: {
    diet:
      'Dental and jaw anatomy support herbivory, but no gut contents or direct feeding traces are known. The plants eaten and the feeding posture are inferred; the incomplete skull and unknown nasal soft tissue limit dietary reconstruction.',
    behaviour:
      'Facultative bipedality is reconstructed from limb proportions, but the centre of mass and habitual posture depend on soft-tissue reconstruction. No nest, trackway or social association is known. The bulbous nasal region may have supported a soft-tissue display structure, but its function is not established.',
    confidence:
      'Confidence is high for the partial skull and postcranium of the holotype, QM F6140. It is lower for the nasal soft tissue, habitual gait, diet and behaviour. The phylogenetic position within Ornithopoda is contested, and the skull is incomplete.',
  },
  nasutoceratops: {
    diet:
      'Herbivory is inferred from the ceratopsian dentition and jaw apparatus. No gut contents are known, and the plants eaten are not preserved; the broad diet is a group-level inference, not a species-specific observation.',
    behaviour:
      'The skull and horns are well preserved, but no trackway, nest or bonebed establishes social behaviour. The function of the horns and frill — display, species recognition or combat — remains a hypothesis. The known sample is too small to test sexual dimorphism or herding.',
    confidence:
      'Confidence is high for the skull and associated forelimb of the holotype, UMNH VP 16800. It is low for the rest of the postcranium, horn and frill function, sexual dimorphism and social behaviour. The species is not known from a complete skeleton.',
  },
  nigersaurus: {
    diet:
      'The broad, squared snout, downturned skull and densely packed dental battery support low-level cropping, but the plants eaten and the exact feeding height are inferred. Tooth replacement is well documented; no gut contents are known, and the soft tissue of the snout is not preserved.',
    behaviour:
      'No nest, trackway or socially associated assemblage is known. The mounted skeleton is reconstructed from several individuals, so it is not a record of one animal’s posture or behaviour. The extensive pneumaticity is direct skeletal evidence, but its respiratory or buoyancy function is inferred.',
    confidence:
      'Confidence is high for the dental battery, snout shape and pneumatic axial skeleton. It is lower for the catalogue number (MNN GAD512 or GDF512), the reconstructed skull, feeding height, soft tissue and any social behaviour. No gut contents are known.',
  },
  nothronychus: {
    diet:
      'Herbivory is inferred from the broad pelvis, short tail and the wider therizinosaur record. No gut contents are known for N. mckinleyi, and the skull is incomplete; the diet could have included other plant or animal matter. This is a comparative inference, not an observation.',
    behaviour:
      'The holotype is a partial skeleton, and no nest, trackway or social association is known. The large claws and forelimbs are preserved, but their use in feeding, defence or display is inferred. Soft-tissue impressions are known from N. graffami, not from the type species.',
    confidence:
      'Confidence is high for the type specimen and its stratigraphic occurrence. It is low for the skull, diet, claw function and social behaviour. The catalogue number has been cited as MSM P2117 and P2106, and the species is not known from a complete skeleton.',
  },
  orodromeus: {
    diet:
      'The dentition and jaw apparatus support herbivory, but no gut contents are known. The diet is a comparative inference for a small ornithopod; the plants eaten and the feeding style are not preserved.',
    behaviour:
      'Long-bone histology shows rapid growth with growth marks, but the age at maturity is not precisely known. Egg clutches once attributed to Orodromeus, including MOR 246, are now reinterpreted as troodontid eggs, so they are not evidence of nesting or parental care. No trackway or social association is known.',
    confidence:
      'Confidence is high for the histology and the bipedal limb proportions. It is low for the original egg attribution, the age at maturity, social behaviour and the completeness of the skull and postcranium. MOR 246 is not an Orodromeus nest.',
  },
  oviraptor: {
    diet:
      'The jaws are deep, edentulous and robust, but toothlessness alone does not identify diet. No direct stomach contents are known for the holotype, and small vertebrates, eggs and plants have all been proposed for oviraptorosaurs. The species’ feeding ecology remains unresolved.',
    behaviour:
      'The original egg-thief interpretation rested on the holotype’s proximity to a nest; later work showed the eggs were theropod eggs and that the association is compatible with brooding or nesting. Proximity alone does not establish parental care, and no trackway or social group is known. The crest is broken in the holotype.',
    confidence:
      'Confidence is high for the toothless skull and beak, and for the history of the egg-thief interpretation. It is low for diet, crest soft tissue, parental behaviour and the completeness of the holotype. The nest association is not proof of brooding.',
  },
  pachycephalosaurus: {
    diet:
      'Herbivory is inferred from the dentition and jaw apparatus of pachycephalosaurs. No gut contents are known for Pachycephalosaurus, and the plants eaten are not preserved; the diet is a comparative inference.',
    behaviour:
      'The dome is preserved bone, but its use in head-butting is contested. Cranial pathologies have been read as combat trauma by some authors and as ontogenetic or display-related changes by others. Dracorex and Stygimoloch may be growth stages, but that synonymy is not universally accepted. No trackway or social group is known.',
    confidence:
      'Confidence is high for the dome and the 1931 species name, but lower for dome function, postcranial anatomy and the Dracorex/Stygimoloch synonymy. The name-bearing specimen, USNM 12031, is a partial skull roof, not a complete animal.',
  },
  pachyrhinosaurus: {
    diet:
      'Herbivory is inferred from the ceratopsian dentition and jaw apparatus. No gut contents are known, and the plants eaten are not preserved; the broad diet is a group-level inference.',
    behaviour:
      'Bonebeds show that several Pachyrhinosaurus individuals were buried together, but they do not demonstrate herding or a single mass-death event; transport and time-averaging are possible. The nasal boss changes shape through growth, which complicates species identification of isolated skulls. No direct evidence of boss function is known.',
    confidence:
      'Confidence is high for the skull and nasal boss of the holotype. It is lower for the growth series of P. canadensis, boss function, bonebed behaviour and the completeness of the postcranium. The growth series is better known in P. perotorum.',
  },
  parasaurolophus: {
    diet:
      'Herbivory is inferred from the hadrosaur dentition and jaw apparatus. No gut contents are known for P. walkeri, and the plants eaten are not preserved; the diet is a comparative inference.',
    behaviour:
      'The crest is a hollow bony tube connected to the nasal passages, but its soft-tissue covering and function are reconstructed. Sound production, display and thermoregulation have been proposed; none is directly demonstrated. The holotype preserves a gap in the neural spines, but its cause is not established. No nest or social group is known.',
    confidence:
      'Confidence is high for the crest’s internal anatomy and the nearly complete holotype, ROM 768. It is low for the soft tissue, vocalization, crest function and social behaviour. The spinal defect is observable; its cause is not.',
  },
  patagotitan: {
    diet:
      'Herbivory is inferred from titanosaur anatomy. No skull or gut contents are known for Patagotitan, so the plants eaten and the feeding height cannot be reconstructed directly. The diet is a group-level inference.',
    behaviour:
      'The bonebed contains at least six individuals, which is direct evidence of a mass accumulation. It does not demonstrate herding: drought, flood or another concentrating process could produce the same association. The mounted skeleton is composite, and no trackway or nest is known.',
    confidence:
      'Confidence is high for the associated skeletons and the bonebed. It is low for the skull, body mass, the cause of the accumulation and any social behaviour. Body mass is estimated from incomplete material, not measured.',
  },
  pentaceratops: {
    diet:
      'Herbivory is inferred from the ceratopsian dentition and jaw apparatus. No gut contents are known, and the plants eaten are not preserved; the broad diet is a group-level inference.',
    behaviour:
      'The frill and horns are preserved bone, but their function — display, species recognition or combat — is not demonstrated. No trackway, nest or bonebed establishes herding. The postcranium is less complete than the skull, which limits locomotion and social inference.',
    confidence:
      'Confidence is high for the skull and the large skull specimen. It is lower for the postcranium, body size, horn and frill function, and social behaviour. No direct evidence of herding is known.',
  },
  puertasaurus: {
    behaviour:
      'The holotype is four disarticulated vertebrae. No limb bones, trackway, nest or social association is known, so posture, locomotion and behaviour cannot be reconstructed responsibly. The body reconstruction is extrapolated from the vertebrae.',
    confidence:
      'Confidence is high only for the four vertebrae and their titanosaur affinities. It is low for body size, posture, diet, soft tissue and phylogenetic placement. The species is too fragmentary for a complete behavioural profile.',
  },
  rhabdodon: {
    diet:
      'The dentition and jaw support herbivory, but no gut contents are known. The plants eaten and the feeding style are inferred; the lost lectotype limits direct comparison with the referred skeleton.',
    behaviour:
      'No nest, trackway or social association is known. The nearly complete Provence skeleton provides most of the postcranial anatomy, but it is a referred specimen, not the lost lectotype. Locomotion and social behaviour remain inferences.',
  },
  saltasaurus: {
    diet:
      'Herbivory is inferred from the broad snout and simple teeth. No gut contents are known, and the plants eaten are not preserved. The diet is a comparative inference for a titanosaur.',
    behaviour:
      'The armour and eggs are preserved, but the armour arrangement is reconstructed and the eggs do not establish parental care. No trackway or social group is known. The relatively small body size and osteoderms are direct anatomy, not behavioural evidence.',
    confidence:
      'Confidence is high for the osteoderms and presacral vertebrae. It is lower for the skull, armour arrangement, diet and behaviour. No complete skull or skeleton is known.',
  },
  sauropelta: {
    diet:
      'Low browsing is inferred from the small, leaf-shaped teeth and beak. No gut contents are known, and the plants eaten are not preserved; the skull is incomplete, so the feeding apparatus is only partly known.',
    behaviour:
      'The armour is well preserved, but no trackway, nest or social association is known. The tail lacks a club, and the body outline is reconstructed. Defensive posture and social behaviour are inferences, not observations.',
    confidence:
      'Confidence is high for the armour and the 1970 type specimen. It is lower for the skull, full body outline, diet and social behaviour. The holotype is a partial skeleton, not a complete animal.',
  },
  scelidosaurus: {
    diet:
      'Herbivory is inferred from the dentition and jaw apparatus. No gut contents are known, and the plants eaten are not preserved; the diet is a comparative inference for an early thyreophoran.',
    behaviour:
      'Several articulated skeletons preserve the armour in place, which is direct evidence of arrangement but not of its use. No trackway, nest or social association is known. The keratin covering and colour are not preserved, and defensive behaviour is inferred.',
    confidence:
      'Confidence is high for the articulated skeletons and osteoderm arrangement. It is lower for soft tissue, phylogeny, diet and behaviour. The armour is preserved bone; its keratin covering and living appearance are reconstructed.',
  },
  sinraptor: {
    diet:
      'The serrated, laterally compressed teeth support carnivory, but no gut contents or feeding traces are known. The prey species and hunting method are inferred from tooth morphology and comparisons with other allosauroids.',
    behaviour:
      'The skull and limbs indicate a large predatory theropod, but hunting is inferred, not observed. No trackway, nest or social association is known. The nearly complete skeleton documents anatomy, not behaviour.',
    confidence:
      'Confidence is high for the skull and postcranial skeleton of IVPP 10600. It is lower for diet, prey choice, soft tissue and social behaviour. The publication year is cited as 1993 or 1994.',
  },
  styracosaurus: {
    diet:
      'Herbivory is inferred from the ceratopsian dentition and jaw apparatus. No gut contents are known, and the plants eaten are not preserved; the broad diet is a group-level inference.',
    behaviour:
      'The nasal horn and frill spikes are preserved bone, but their function — display, species recognition or combat — is not demonstrated. Skull shape varies within the sample, and not every difference is taxonomic. No trackway or social group is known.',
    confidence:
      'Confidence is high for the skull and horn morphology. It is lower for horn and frill function, the growth series and social behaviour. No direct evidence of combat or herding is known.',
  },
  tarbosaurus: {
    diet:
      'Carnivory is inferred from the dentition, jaw apparatus and comparisons with other tyrannosaurids. Oxygen and carbon isotopes from tooth enamel provide indirect dietary evidence, not stomach contents; the interpretation depends on the local baseline.',
    behaviour:
      'Juvenile skulls and tooth replacement document growth, and frontal shape changes allometrically with age. No trackway, nest or social association is known. Hunting and scavenging are inferred from anatomy, not observed.',
    confidence:
      'Confidence is high for the skull, growth series and frontal allometry. It is lower for diet, prey choice, soft tissue and social behaviour. The isotope evidence is indirect and does not identify prey species.',
  },
  torvosaurus: {
    diet:
      'Carnivory is inferred from the dentition and jaw apparatus. No gut contents or feeding traces are known for T. tanneri; the prey species and hunting method are inferred from anatomy and comparison with other megalosaurids.',
    behaviour:
      'The forelimb bones are robust, but their use in prey capture is inferred. The skull is less complete than the postcranium and the reconstruction depends on several specimens. No trackway, nest or social association is known. Portuguese material may belong to a separate species, T. gurneyi.',
    confidence:
      'Confidence is high for the lectotype humerus and the forelimb anatomy. It is lower for the skull, the Portuguese species assignment and hunting behaviour. The type series was disarticulated and represented more than one individual.',
  },
};

for (const [slug, edits] of Object.entries(biology)) {
  const file = `src/data/species/${slug}.json`;
  const species = await readJson(file);
  if (edits.diet) species.dietEvidence.body = edits.diet;
  if (edits.behaviour) species.behaviour.body = edits.behaviour;
  if (edits.confidence) species.confidenceNote = edits.confidence;
  species.updated = '2026-11-17';
  await writeJson(file, species);
}

await writeJson(referencesPath, references);
await writeJson(v19ReferencesPath, v19References);

/* ------------------------------------------------------------------ */
/* Controlled research-access vocabulary                               */
/* ------------------------------------------------------------------ */

const accessLevel = (access = '') => {
  if (/abstract not available/i.test(access)) return 'Metadata only';
  if (
    /(full text (read|consulted)|substantial full text|facsimile|full text and database metadata|repository full text consulted)/i.test(
      access,
    ) &&
    !/full texts? not read/i.test(access)
  ) {
    return 'Full text read';
  }
  if (/abstract/i.test(access)) return 'Abstract read';
  if (
    /(institutional or collection|collection record|repository metadata|specimen record|museum summary|database metadata)/i.test(
      access,
    )
  ) {
    return 'Institutional record';
  }
  return 'Metadata only';
};

const trailsPath = 'src/data/research-trails.json';
const trails = await readJson(trailsPath);
for (const trail of Object.values(trails)) {
  for (const entry of trail.entries ?? []) {
    if (!entry.accessDetail) entry.accessDetail = entry.access;
    entry.access = accessLevel(entry.accessDetail);
  }
}
await writeJson(trailsPath, trails);

console.log(`Updated ${Object.keys(biology).length} species biology records.`);
console.log(`References: ${references.length + v19References.length} total.`);
console.log('Normalised research-access labels to four categories.');

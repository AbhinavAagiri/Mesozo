// Applies the first researched content pass to species JSON files.
// Every replacement is limited to statements supported by the claim reviews.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('.');
const read = async (slug) =>
  JSON.parse(await readFile(path.join(root, `src/data/species/${slug}.json`), 'utf8'));
const write = async (slug, data) =>
  writeFile(path.join(root, `src/data/species/${slug}.json`), `${JSON.stringify(data, null, 2)}\n`);

const edits = {
  psittacosaurus(s) {
    s.confidenceNote =
      "The growth series and tail bristles are directly studied, but the bristles' function is not established. Erickson & Tumanova (2000) reconstructed an S-shaped growth curve from long-bone histology; Mayr et al. (2016) found bundles of bristles with a pulp cavity and considered them probably homologous with filamentous structures in other dinosaurs, while noting that a follicle has not been demonstrated. Body colour and social behaviour are not established here.";
    s.dietEvidence.body =
      'The deep rostral beak and leaf-shaped teeth indicate herbivory. The jaw apparatus is consistent with cropping vegetation, but no gut contents are known; the plants eaten and the feeding mechanics remain inferences.';
    s.behaviour.body =
      'The tail bristles are direct evidence of integument, but their function is unresolved. Mayr et al. (2016) found them in bundles of three to six and noted that they covered only part of the tail, which argues against a simple insulation function; display is a hypothesis. No nesting or social evidence is asserted.';
    s.anatomy[0].body =
      'The skull is deep and short, with a strong rostral beak. The tail bears a dorsal row of bristle-like appendages in bundles; the rest of the body is covered in scales. The bristles are preserved as carbonaceous impressions and are not true feathers.';
    s.anatomy[0].refs = ['primary-psittacosaurus', 'v19-psittacosaurus-101'];
    s.anatomy[1].body =
      'The species is reconstructed as facultatively bipedal. The posture is inferred from limb proportions and comparison with other ceratopsians, not observed.';
  },
  maiasaura(s) {
    s.confidenceNote =
      'The nesting and growth series are exceptional, but parental care and the extent of colonial nesting are inferences from assemblage structure. Horner et al. (2000) recognised six growth stages and found that lines of arrested growth appear regularly by the subadult stage. Dilkes (2001) found a shift from bipedal juveniles to quadrupedal adults. The original 1979 nesting study is the basis for the family-structure hypothesis, not a direct observation of feeding or defence.';
    s.dietEvidence.body =
      'The dental battery and broad snout indicate a herbivorous diet. No gut contents are known; the plants eaten and the feeding style are inferred from jaw morphology and comparison with other hadrosaurs.';
    s.behaviour.body =
      "Nests containing juvenile remains support the interpretation that Maiasaura nested colonially and that juveniles were associated with nests. Whether adults fed or defended the young is not directly preserved. The original 'family structure' interpretation is an inference from the association, and trackways or bonebeds do not by themselves establish herding.";
    s.anatomy[0].body =
      'The skull is low and broad, with a small crest, and the dental battery is well developed. The snout is broad and the jaws carry tightly packed teeth.';
    s.anatomy[0].refs = ['primary-maiasaura', 'v19-maiasaura-122'];
    s.anatomy[1].body =
      'Juveniles walked primarily as bipeds; adults shifted toward a quadrupedal stance. The change is inferred from morphometrics and beam-theory analysis of limb bones across growth, not from trackways.';
    s.anatomy[1].refs = ['v19-maiasaura-121'];
  },
  coelophysis(s) {
    s.stage = 'Norian–Rhaetian';
    s.ageMa = [215, 201.4];
    s.ageLabel = '≈215–201.4 Ma';
    s.confidenceNote =
      'The Ghost Ranch sample is exceptional, but the famous cannibalism claim has been re-examined: the supposed juvenile gut contents are crocodylomorph remains (Nesbitt et al. 2006). The age of the quarry is latest Norian–Rhaetian; the species range used here is ≈215–201.4 Ma. Juvenile skulls show ontogenetic variation, not separate taxa.';
    s.dietEvidence.body =
      'The supposed cannibal gut contents are early crocodylomorph remains, so the direct evidence supports a diet including small crocodylomorphs, not cannibalism. The slender skull and recurved teeth indicate carnivory; prey choice beyond the preserved gut contents is inferred.';
    s.behaviour.body =
      'The Ghost Ranch bonebed is a mass accumulation of many individuals, but it does not demonstrate pack hunting. The 2006 reanalysis removed the strongest support for cannibalism. Social behaviour and hunting coordination are unknown.';
    s.fossilEvidence[1].body =
      'Chinle Formation, Ghost Ranch, New Mexico records the species in the Late Triassic. The numeric range used here is ≈215–201.4 Ma, combining the older Baldwin locality (radiometrically dated near 211.9 Ma) with the Rhaetian Ghost Ranch quarry; it is an occurrence estimate rather than a direct date on every specimen.';
  },
  borealopelta(s) {
    s.confidenceNote =
      'The holotype is a single, exceptionally preserved individual; it anchors anatomy, integument and gut contents, but population variation and behaviour are unknown. Brown et al. (2017) identified melanin and a countershaded pattern; Kalyniuk et al. (2023) found stomach contents dominated by fern leaf tissue with little gymnosperm material, implying selective feeding.';
    s.dietEvidence.body =
      'Direct stomach contents are dominated by fern leaf tissues, with low amounts of gymnosperm material. This is direct evidence of ingested plants, but it is one meal from one individual and does not define the full diet.';
    s.behaviour.body =
      "The carcass was buried in marine sediment after floating from a coastal setting; this is taphonomy, not behaviour. Countershading is interpreted as camouflage against predation, but the ecological inference depends on the reconstruction of the animal's visual environment.";
    s.anatomy[0].body =
      'The body is covered in large osteoderms and a shoulder spine. The holotype preserves continuous epidermal scales, horn sheaths and organic residues; the gut contains plant material.';
    s.anatomy[0].refs = ['primary-borealopelta'];
    s.anatomy[1].body =
      'The species is reconstructed as quadrupedal from the preserved limb skeleton and comparison with other nodosaurids; the posture is not observed.';
    s.anatomy[1].refs = ['primary-borealopelta'];
  },
  kulindadromeus(s) {
    s.stage = 'Bathonian';
    s.ageMa = [168.3, 166.1];
    s.ageLabel = '≈168.3–166.1 Ma';
    s.confidenceNote =
      'The integument is directly preserved and includes scales, monofilaments and branched feather-like structures. Cincotta et al. (2019) dated the Kulinda locality to the Bathonian, ≈168.3–166.1 Ma, older than earlier estimates. The functional and evolutionary significance of the filaments is debated; they are not simply feathers.';
    s.dietEvidence.body =
      'The dentition and jaw morphology indicate herbivory. No gut contents are known; the diet is inferred from anatomy.';
    s.behaviour.body =
      'The several partial skeletons were deposited in a lake-margin setting; they do not preserve behaviour. The integument is direct evidence of appearance, not of display or insulation.';
    s.fossilEvidence[1].body =
      'Ukureyskaya Formation, Transbaikalia records the species in the Middle Jurassic. U–Pb dating of detrital zircons and monazites, combined with palynology, constrains the locality to the Bathonian, ≈168.3–166.1 Ma. The date applies to the enclosing volcaniclastic deposits, not directly to the bones.';
    s.anatomy[0].body =
      'The body bears small scales on the distal hindlimb, larger overlapping scales on the tail, monofilaments on the head and thorax, and branched feather-like structures on the humerus, femur and tibia.';
    s.anatomy[0].refs = ['primary-kulindadromeus'];
  },
  microraptor(s) {
    s.confidenceNote =
      'The feathers are preserved and reach the body, but flight style is actively debated. Chatterjee & Templin (2007) reconstructed a staggered biplane and found a plausible gliding performance; Alexander et al. (2010) found multiple hindwing configurations stable in glide tests. Neither establishes powered flight. The species-level distinction from M. zhaoianus is also contested.';
    s.dietEvidence.body =
      'The dentition indicates carnivory. No gut contents are treated in the cited flight studies; prey choice is not established here.';
    s.behaviour.body =
      'The preserved plumage is direct evidence of appearance. Gliding is an inference from feather geometry and model tests, not an observation. The animal was not capable of powered flight under the tested models.';
    s.anatomy[0].body =
      'The forelimbs and hindlimbs bear long asymmetric flight feathers, and ultraviolet imaging shows that the feathers reached the body rather than drifting after death. The tail is long and feathered.';
    s.anatomy[0].refs = ['primary-microraptor', 'v19-microraptor-169'];
  },
  mussaurus(s) {
    s.confidenceNote +=
      ' The 2021 study reports more than 100 eggs and 80 individuals; age segregation is an inference from clustering, not observed behaviour.';
    s.dietEvidence.body =
      'The skull and dentition indicate herbivory. No gut contents are known; the diet is inferred from anatomy.';
    s.anatomy[0].body =
      'Hatchlings have proportionally large heads and short limbs; adults are robust with a moderately long neck. The growth series includes embryos, hatchlings, juveniles and adults.';
    s.anatomy[0].refs = ['primary-mussaurus', 'v19-mussaurus-216', 'v19-mussaurus-218'];
    s.anatomy[1].body =
      'Hatchlings were quadrupedal and adults bipedal. The shift is inferred from digital models, limb proportions and the position of the centre of mass, not from trackways.';
    s.anatomy[1].refs = ['v19-mussaurus-218'];
  },
  massospondylus(s) {
    s.confidenceNote =
      'The growth series is large, but growth was plastic: 20 femora show major variation in growth-mark spacing, and a 27-specimen multielement study found that growth trajectories vary by bone. The 2022 study found no evidence of differential forelimb/hindlimb growth rates and rejected a simple ontogenetic postural shift. Eggs and embryos are known but are not treated in these claims.';
    s.dietEvidence.body =
      'The skull and dentition indicate herbivory. No gut contents are known; the diet is inferred from anatomy.';
    s.behaviour.body =
      'Eggs and embryos show nesting, but the nesting site and parental behaviour are not established by the sources cited here. The 2022 study removes support for a simple postural shift; locomotion likely changed with growth, but the pattern is not resolved.';
    s.anatomy[0].body =
      'The neck is moderately long, the skull has a proportionally large orbit and a short antorbital region, and the forelimbs are shorter than the hindlimbs. The skull description is based on four well-preserved specimens.';
    s.anatomy[0].refs = ['primary-massospondylus', 'v19-massospondylus-66'];
    s.anatomy[1].body =
      'The species is reconstructed as facultatively bipedal. Growth was plastic and the ontogenetic pattern of posture is unresolved; the reconstruction is not a direct observation of gait.';
    s.anatomy[1].refs = ['v19-massospondylus-64', 'v19-massospondylus-65'];
  },
  protoceratops(s) {
    s.confidenceNote =
      'The frill is well sampled, but its function is inferred. Knapp et al. (2021) found low integration with the skull, high shape variance and a high ontogenetic rate of change, consistent with socio-sexual signalling; they did not find sexual dimorphism. Słowiak et al. (2019) show that subadults are intermediate between bipedal Psittacosaurus and quadrupedal adults.';
    s.dietEvidence.body =
      'The beak and dental battery indicate herbivory. No gut contents are known; the diet is inferred from anatomy.';
    s.behaviour.body =
      "Nests and eggs are known, but the cited sources do not establish parental care. The frill's function is a hypothesis; display and species recognition are plausible, but combat is not demonstrated.";
    s.anatomy[0].body =
      'The skull has a small rostral bone and a short frill. The frill is weakly integrated with the rest of the skull and has high morphological variance; these are the features used to argue for a socio-sexual signal.';
    s.anatomy[0].refs = ['primary-protoceratops', 'v19-protoceratops-96'];
    s.anatomy[1].body =
      'Subadult limb anatomy is intermediate between bipedal Psittacosaurus and fully quadrupedal adult Protoceratops. The change is inferred from ontogenetic comparison, not from observed gait.';
    s.anatomy[1].refs = ['v19-protoceratops-97'];
  },
  edmontosaurus(s) {
    s.stage = 'late Campanian–early Maastrichtian';
    s.ageMa = [73, 68];
    s.ageLabel = '≈73–68 Ma';
    s.confidenceNote =
      'The age in this record was corrected from 68–66 Ma, which is the range of E. annectens, to the late Campanian–early Maastrichtian range of E. regalis (≈73–68 Ma). Vanderven et al. (2014) found that somatic maturity began at about 10–15 years in the Danek Bonebed sample. Sharpe et al. (2023) described a juvenile skull about 500 mm long and showed that the diagnostic postorbital fossa develops during growth.';
    s.dietEvidence.body =
      'The dental battery and broad snout indicate herbivory. No gut contents are known; the plants eaten and the feeding style are inferred from jaw morphology.';
    s.behaviour.body =
      'Bonebeds show that many individuals accumulated together, but that is not proof of herding. Histology suggests overwintering at high latitudes, but the evidence is indirect. No parental care or migration is demonstrated.';
    s.fossilEvidence[1].body =
      'Horseshoe Canyon Formation, Alberta records the species in the Late Cretaceous. The age used here is ≈73–68 Ma, a formation-level range for E. regalis, not the 68–66 Ma range of E. annectens. The specimen is not directly dated.';
    s.anatomy[0].body =
      'The skull is long and flat, the snout is broad, and the jaws carry hundreds of tightly packed teeth. A juvenile skull about 500 mm long shows that the deep postorbital fossa is acquired during growth.';
    s.anatomy[0].refs = ['primary-edmontosaurus', 'v19-edmontosaurus-115'];
    s.anatomy[1].body =
      'The species is reconstructed as facultatively bipedal; juveniles and adults could probably use both postures. The inference comes from limb proportions and bone histology, not from trackways.';
    s.anatomy[1].refs = ['v19-edmontosaurus-113'];
  },
  miragaia(s) {
    s.references = [...new Set([...s.references, 'sanchezfenollosa2024', 'costa2025'])];
    s.confidenceNote =
      'The neck is directly preserved: at least 17 cervical vertebrae, eight more than basal ornithischians and more than most sauropods. The validity of the species is contested: Sánchez-Fenollosa et al. (2024) proposed it as a junior synonym of Dacentrurus armatus, while Costa et al. (2025) argued that MG 4863 preserves differences supporting distinction. The functional significance of the long neck is not established.';
    s.dietEvidence.body =
      'The skull and dentition indicate herbivory. No gut contents are known. The long neck has been interpreted as a browsing adaptation, but the function is not demonstrated.';
    s.behaviour.body =
      'Neck elongation is direct anatomy; low browsing is a hypothesis. No social or display behaviour is established.';
    s.anatomy[0].body =
      'The neck contains at least 17 cervical vertebrae, eight more than the ancestral ornithischian condition. Elongation involved cervicalization of anterior dorsal vertebrae and probable lengthening of the centra; the plates and tail spikes remain characteristic.';
    s.anatomy[0].refs = ['primary-miragaia', 'v19-miragaia-71'];
    s.anatomy[1].body =
      "The species is reconstructed as quadrupedal from the preserved limb skeleton. The posture is not observed, and the long neck's function is unresolved.";
    s.anatomy[1].refs = ['primary-miragaia', 'costa2025'];
    s.fossilEvidence[0].body =
      'The holotype is a partial articulated skeleton with cranial remains. A second, more complete specimen, MG 4863, was excavated in 1959 and prepared in the 2010s; it preserves anterior and posterior portions of the skeleton and is central to the validity debate.';
    s.fossilEvidence[0].refs = ['primary-miragaia', 'v19-miragaia-71', 'costa2025'];
  },
  nodosaurus(s) {
    s.locality = ['Frontier Formation (Belle Fourche Member), Como Bluff, Wyoming'];
    s.ancientContext = 'Frontier Formation (Belle Fourche Member), Como Bluff, Wyoming';
    s.habitat = 'Marginal marine coastal plain';
    s.discovery.body =
      'Named by Marsh, 1889. The type and only well-established specimen is YPM 1815, a partial postcranial skeleton from the Frontier Formation (Belle Fourche Member) at Como Bluff, Wyoming. The skull is unknown.';
    s.fossilEvidence[0].body =
      'YPM 1815 includes dorsal and caudal vertebrae, ribs, part of the pelvis, fragmentary forelimbs, a partial hindlimb and osteoderms. The skull is not known, so cranial anatomy and diet cannot be directly observed.';
    s.fossilEvidence[1].body =
      'Frontier Formation (Belle Fourche Member), Como Bluff, Wyoming records the species in the Late Cretaceous. The numeric range used here is ≈100–97 Ma, an occurrence estimate rather than a direct date on the specimen.';
    s.confidenceNote =
      'The species is known from one partial postcranial skeleton, YPM 1815, from the Frontier Formation (Belle Fourche Member) at Como Bluff, Wyoming; the skull is unknown. The formation was corrected from the Mowry Shale. Size, armour arrangement and body proportions are reconstructed from a fragmentary specimen and comparisons with relatives.';
    s.dietEvidence.body =
      "The skull is unknown, so direct dietary evidence is unavailable. Herbivory is inferred from the animal's relationships and the preserved postcranial anatomy.";
    s.behaviour.body =
      'No direct behavioural evidence. Quadrupedality is inferred from limb anatomy. Armour function is inferred, not observed.';
    s.anatomy[0].body =
      "The body armour consists of keeled plates and low spines, including a sacral shield. The osteoderms are preserved, but their complete arrangement and the animal's live profile are reconstructed.";
    s.anatomy[0].refs = ['primary-nodosaurus', 'v19-nodosaurus-82', 'pbdb'];
    s.anatomy[1].body =
      'The species is reconstructed as quadrupedal from the preserved limb bones and comparison with other nodosaurids; the posture is not observed.';
    s.anatomy[1].refs = ['primary-nodosaurus', 'v19-nodosaurus-82'];
  },
  velociraptor(s) {
    s.confidenceNote =
      'The skeleton and quill knobs are well documented. Turner et al. (2007) identified quill knobs on the posterior ulna as direct evidence of large secondary feathers; the animal was flightless. Sickle-claw function and hunting behaviour are inferences. Coordinated pack hunting is not demonstrated, and size is frequently exaggerated in popular media.';
    s.anatomy[1].body =
      'Quill knobs on the posterior ulna show that the forearm bore large secondary feathers. The rest of the body was probably covered in filamentous plumage, as in other dromaeosaurs, but direct preservation is limited. Velociraptor could not fly; the feathers may have been used for display, insulation or balance.';
  },
  anchiornis(s) {
    s.confidenceNote =
      'The plumage is directly preserved, but the family placement is contested. Pei et al. (2017) described new specimens that share derived features with avialans but lack some deinonychosaur features. Other analyses recover Anchiornis as a troodontid. The wing feather arrangement is preserved; flight capability is not established.';
    s.dietEvidence.body =
      'The dentition indicates carnivory. No gut contents are known; prey choice is not established.';
    s.behaviour.body =
      'The feathers are direct evidence of appearance. Their function — display, insulation or gliding — is not established. No social behaviour is asserted.';
    s.anatomy[0].body =
      'The skeleton is small and lightly built, with long feathered limbs and a short tail. The arms, legs and tail bear pennaceous feathers; the plumage is preserved as impressions.';
    s.anatomy[0].refs = ['primary-anchiornis', 'v19-anchiornis-172'];
  },
  yi(s) {
    s.dietEvidence.body =
      'No gut contents are known. The diet is not established; insectivory or omnivory are hypotheses, not observations.';
    s.behaviour.body =
      'The membranous wing is preserved; whether it supported gliding, flapping or display is debated. Dececchi et al. (2020) found powered flight highly unlikely and gliding limited. Diet is inferred from anatomy; no gut contents are known.';
  },
  sinosauropteryx(s) {
    s.confidenceNote =
      'The filamentous integument is directly preserved; the family placement is contested. Currie & Chen (2001) documented the longest tail known for any theropod and a three-fingered hand. Lingham-Soliar (2010) interpreted pigment-bearing structures in the tail as a colour pattern, but that reconstruction has been questioned. The 2015 study documents three stages of post-mortem opisthotonus.';
    s.dietEvidence.body =
      'The dentition indicates carnivory. Gut contents are known from some specimens, but the cited integument studies do not establish prey choice; diet is treated as an inference here.';
    s.behaviour.body =
      'The opisthotonus is a post-mortem posture, not behaviour. No social behaviour is asserted.';
    s.anatomy[0].body =
      'The body is covered in short filaments, the tail is long, and the skull is small and lightly built. The tail is the longest known for any theropod, and the hand retains three fingers.';
    s.anatomy[0].refs = ['primary-sinosauropteryx', 'v19-sinosauropteryx-176'];
  },
  triceratops(s) {
    s.confidenceNote =
      'The skull anatomy and growth series are well documented. Farke et al. (2009) found a higher rate of squamosal lesions in Triceratops than in Centrosaurus, a pattern consistent with combat, but this is a statistical inference, not an observed fight. Horner & Goodwin (2006) documented four cranial growth stages. The Torosaurus synonymy question is genuinely contested; Longrich & Field (2012) argued that Torosaurus is distinct.';
    s.behaviour.body =
      'Horn use in combat is supported by lesion-rate comparisons, not by healed injuries alone. Display is plausible given the size and vascularity of the frill. Whether Triceratops formed herds is less clear: some bonebeds contain multiple individuals, but such accumulations can form without social groups. Nests and eggs are not known for certain. Claims about herding or defensive circles are inferences, not observations.';
    s.anatomy[0].refs = ['farke2009', 'horner2006'];
  },
  tyrannosaurus(s) {
    s.confidenceNote =
      'The skeleton and growth series are exceptionally well documented. DePalma et al. (2013) described a tooth crown embedded in a hadrosaur vertebra with healed bone, direct evidence of predation. The coprolite attributed to T. rex is indirect because the animal itself is not preserved. Social behaviour, feather coverage and lips remain debated.';
    s.dietEvidence.body =
      "T. rex was a large carnivore. Direct evidence includes an embedded tooth in a hadrosaur vertebra with healed bone and a large coprolite containing bone fragments. The coprolite's attribution to T. rex is indirect. Scavenging is also plausible; most large predators do both.";
  },
  europasaurus(s) {
    s.confidenceNote =
      'The dwarfism is supported by a growth series and bone histology, but the island context is inferred from sedimentology and palaeogeography. Sander et al. (2006) diagnosed insular dwarfism from histology; later work described the axial, cranial and appendicular skeleton. The phylogenetic position within Macronaria is debated.';
    s.dietEvidence.body =
      'The dentition indicates herbivory. Régent et al. (2024) described the dentition and a possible rhamphotheca-like structure; no gut contents are known.';
    s.behaviour.body =
      'The many individuals from one locality show that the species occurred together, but social behaviour is not established. Dwarfism is a body-size pattern, not a behaviour.';
    s.anatomy[0].body =
      'The skeleton is miniature for a brachiosaurid but retains the high shoulders and long forelimbs of the group. The sample includes juvenile and adult material, allowing ontogenetic comparison.';
    s.anatomy[0].refs = ['primary-europasaurus', 'v19-europasaurus-161', 'v19-europasaurus-163'];
    s.anatomy[1].body =
      'The species is reconstructed as quadrupedal from the preserved limb skeleton. The posture is not observed; the island setting is inferred from the geology.';
    s.anatomy[1].refs = ['primary-europasaurus', 'v19-europasaurus-161'];
  },
  majungasaurus(s) {
    s.references = [...new Set([...s.references, 'rogers2003'])];
    s.confidenceNote =
      'The skull and forelimb anatomy are well described, and tooth marks on conspecific bones provide direct evidence of feeding on Majungasaurus. Whether this was predation or scavenging is not established. Rogers et al. (2003) attributed the marks to Majungasaurus on the basis of tooth size, spacing and serration spacing.';
    s.dietEvidence.body =
      'Tooth marks on sauropod and conspecific bones show that Majungasaurus fed on both. The marks do not establish whether it killed its prey or scavenged. Cannibalism is documented as feeding on conspecifics, not necessarily predation.';
    s.dietEvidence.refs = ['rogers2003'];
    s.behaviour.body =
      'The tooth marks are direct evidence of feeding behaviour. Social hunting, parental care and other behaviour are unknown.';
    s.behaviour.refs = ['rogers2003'];
    s.anatomy[0].body =
      'The skull is short and deep, with a rugose nasal region and a tall, narrow lower jaw. A virtually complete skull has clarified the craniofacial anatomy and extensive ossification.';
    s.anatomy[0].refs = ['primary-majungasaurus', 'v19-majungasaurus-39'];
    s.anatomy[1].body =
      'The forelimbs are short and robust, with reduced muscle lever arms compared with more basal theropods. The reduction is documented by osteology and reconstructed myology.';
    s.anatomy[1].refs = ['v19-majungasaurus-41'];
    s.fossilEvidence.push({
      title: 'Feeding traces',
      body: 'Tooth-marked bones from multiple Majungasaurus individuals preserve marks that match the size, spacing and serration spacing of Majungasaurus teeth. They show feeding on conspecifics; they do not distinguish predation from scavenging.',
      evidence: 'fossil',
      refs: ['rogers2003'],
    });
  },
  carnotaurus(s) {
    s.confidenceNote =
      'The skeleton and scaly skin are exceptionally well preserved for an abelisaurid. The 1985 naming note and the 1990 monograph are separate publications; the monograph is the detailed anatomical description. The specimen has not been directly dated: the range here is that of the fossil-bearing La Colonia Formation, whose base is younger than about 71.7 Ma and which extends to the Cretaceous–Paleogene boundary. The function of the horns, the arms and the hunting method are inferred. The species is known from one individual, so individual variation is unknown.';
  },
  suchomimus(s) {
    s.confidenceNote =
      'The skull, teeth, furcula and sail supports are known from fossils. A furcula is preserved in the shoulder girdle. The fish-focused diet, the hunting method and the soft-tissue profile are inferred. The skeleton is incomplete, so size estimates vary.';
    s.anatomy.push({
      title: 'Furcula',
      body: 'A furcula (wishbone) is preserved in the shoulder girdle. Its presence is direct anatomical evidence; it does not by itself establish the function of the forelimbs.',
      evidence: 'fossil',
      refs: ['v19-suchomimus-221'],
    });
  },
  deinocheirus(s) {
    s.references = s.references.map((id) => (id === 'primary-deinocheirus' ? 'osmolska1970' : id));
    s.discovery.refs = ['osmolska1970', 'v19-deinocheirus-167'];
    s.confidenceNote =
      'The 2014 skeletons resolved the postcranial anatomy: a long toothless beak, tall neural spines, broad hips and large feet. The stomach area preserved more than 1,400 gastroliths and fish remains, indicating omnivory. The original 1970 description was based on giant arms and a shoulder girdle; the rest of the body was unknown for decades.';
    s.dietEvidence.body =
      'Direct stomach contents include more than 1,400 gastroliths and fish vertebrae and scales. This supports omnivory, with plant material ground by gastroliths and fish ingested. The stomach contents are from one specimen; the full diet is not known.';
    s.dietEvidence.refs = ['v19-deinocheirus-167'];
    s.behaviour.body =
      'The large feet and broad hips suggest a slow, non-cursorial animal; this is an inference from proportions. The 2012 bite marks show that Tarbosaurus fed on Deinocheirus, not that Deinocheirus was a predator. No social behaviour is established.';
    s.behaviour.refs = ['v19-deinocheirus-167', 'v19-deinocheirus-168'];
    s.anatomy[0].body =
      'The forelimbs are exceptionally long and robust, the dorsal neural spines are tall, and the skull is long, low and edentulous with a broad beak. The jaws are toothless, and the feet are large and broad.';
    s.anatomy[0].refs = ['osmolska1970', 'v19-deinocheirus-167'];
    s.fossilEvidence[0].body =
      'Two partial skeletons from Bugiin Tsav and Altan Uul, together with repatriated poached skull, hand and foot material, made the skull and postcranium known. The original holotype preserves the giant forelimbs and shoulder girdle.';
    s.fossilEvidence[0].refs = ['osmolska1970', 'v19-deinocheirus-167'];
    s.fossilEvidence.push({
      title: 'Stomach contents',
      body: 'More than 1,400 gastroliths, ranging from 8 to 87 mm, were found inside the ribs and gastralia, together with fish vertebrae and scales. The association is direct evidence of ingested material; it shows what one individual had in its gut.',
      evidence: 'fossil',
      refs: ['v19-deinocheirus-167'],
    });
  },
  tenontosaurus(s) {
    s.confidenceNote =
      'The growth series is well sampled: histology shows rapid early growth, sustained growth through subadults, and an extended slow-growth phase before maturity. The skull was poorly known until the 2015 description. The association with Deinonychus is not proof of predation.';
    s.dietEvidence.body =
      'The dentition and jaw indicate herbivory. No gut contents are known; the diet is inferred from anatomy.';
    s.behaviour.body =
      'Multiple Tenontosaurus specimens are associated with Deinonychus remains, but the association could reflect scavenging or independent accumulation. It does not demonstrate a predator-prey encounter or social behaviour.';
    s.anatomy[0].body =
      'The tail is long and deep, the forelimbs are moderately long, and the skull is small relative to the body. The skull was poorly known before the 2015 description.';
    s.anatomy[0].refs = ['ostrom1970', 'v19-tenontosaurus-128', 'v19-tenontosaurus-129'];
    s.anatomy[1].body =
      'The species is reconstructed as facultatively bipedal from limb proportions and the deep tail. No trackway or direct observation establishes the preferred gait.';
    s.anatomy[1].refs = ['v19-tenontosaurus-128'];
  },
};

for (const [slug, edit] of Object.entries(edits)) {
  const species = await read(slug);
  edit(species);
  species.updated = '2026-11-17';
  await write(slug, species);
  console.log(`updated ${slug}`);
}
console.log(`Applied ${Object.keys(edits).length} species content updates.`);

import { readFile, writeFile } from 'node:fs/promises';

const path = 'src/data/discovery-archive.json';
const archive = JSON.parse(await readFile(path, 'utf8'));
const has = (list, id) => list.some((item) => item.id === id);

if (!has(archive.locations, 'dinosaur-cove')) {
  archive.locations.push({
    id: 'dinosaur-cove',
    label: 'Dinosaur Cove',
    region: 'Otway Coast, Victoria',
    country: 'Australia',
    latitude: -38.78,
    longitude: 143.405,
    coordinateNote:
      'Approximate Dinosaur Cove locality on the Otway coast, not a quarry coordinate. The 1987 specimen was recovered from a tunnel cut into the coastal cliff.',
    refs: ['nmv-p185991', 'primary-leaellynasaura'],
  });
}

if (!has(archive.formations, 'eumeralla-formation')) {
  archive.formations.push({
    id: 'eumeralla-formation',
    name: 'Eumeralla Formation',
    periodId: 'cretaceous',
    ageLabel: 'Aptian–Albian, ≈113–100.5 Ma',
    ageMa: [113, 100.5],
    locationIds: ['dinosaur-cove'],
    note:
      'Early Cretaceous fluvial and volcaniclastic deposits of the Otway Basin. The Leaellynasaura holotype came from the Eumeralla Formation at Dinosaur Cove.',
    refs: ['primary-leaellynasaura', 'nmv-p185991'],
  });
}

if (!has(archive.researchers, 'thomas-rich')) {
  archive.researchers.push({
    id: 'thomas-rich',
    name: 'Thomas H. Rich',
    role: 'Palaeontologist',
    affiliation: 'Museums Victoria',
    note:
      'Led the Dinosaur Cove excavations and identified NMV P185991 as the holotype of Leaellynasaura amicagraphica in 1989.',
    refs: ['primary-leaellynasaura', 'nmv-p185991'],
  });
}

if (!has(archive.researchers, 'patricia-vickers-rich')) {
  archive.researchers.push({
    id: 'patricia-vickers-rich',
    name: 'Patricia Vickers-Rich',
    role: 'Palaeontologist',
    affiliation: 'Museums Victoria / Monash University',
    note:
      'Co-described Leaellynasaura amicagraphica and the Early Cretaceous polar dinosaur fauna of southeastern Australia.',
    refs: ['primary-leaellynasaura'],
  });
}

if (!has(archive.discoveries, 'disc-nmv-p185991')) {
  archive.discoveries.push({
    id: 'disc-nmv-p185991',
    year: 1987,
    dateLabel: '1987',
    summary:
      'Excavations at Dinosaur Cove recovered a left cheek and maxilla of a juvenile ornithopod from the Eumeralla Formation. The specimen became the holotype of Leaellynasaura amicagraphica in 1989.',
    researcherIds: ['thomas-rich', 'patricia-vickers-rich'],
    expeditionId: null,
    locationId: 'dinosaur-cove',
    formationId: 'eumeralla-formation',
    specimenIds: ['nmv-p185991'],
    relatedSpeciesIds: ['leaellynasaura'],
    refs: ['primary-leaellynasaura', 'nmv-p185991', 'herne2019'],
  });
}

if (!has(archive.specimens, 'nmv-p185991')) {
  archive.specimens.push({
    id: 'nmv-p185991',
    identifier: 'NMV P185991',
    speciesId: 'leaellynasaura',
    typeGroup: 'type',
    typeStatus: 'Holotype — partial left cheek and maxilla of a juvenile',
    material:
      'Left cheek fragment including the maxilla. The dentary, skull roof and postcranial skeleton are not part of the name-bearing specimen.',
    preservation:
      'Partial and fragmentary. The jaw belongs to a juvenile individual, so adult skull proportions and body size are not directly preserved.',
    preservationClass: 'partial',
    repository: 'Museums Victoria, Melbourne, Australia',
    collectionNote:
      'Collected in 1987 from a tunnel at Dinosaur Cove. The Museums Victoria catalogue record identifies the jaw as the holotype and provides an item-level image.',
    discoveryId: 'disc-nmv-p185991',
    significance:
      'The name-bearing specimen of Leaellynasaura amicagraphica. It anchors the species to a juvenile jaw rather than a complete skeleton and is central to debates about the Victorian ornithopod material.',
    anatomy:
      'Partial left cheek and maxilla. The specimen does not preserve the rest of the skull or the postcranial skeleton.',
    uncertainty:
      'NMV P185990 and NMV P185992/P185993 were once treated as parts of the holotype individual, but later work questions their referral. The familiar long-tailed body reconstruction should not be read as the holotype.',
    topics: ['skull', 'history'],
    media: [],
    anatomyStructureIds: [],
    relatedSpecimenIds: [],
    publications: ['primary-leaellynasaura', 'nmv-p185991', 'herne2019'],
    refs: ['primary-leaellynasaura', 'nmv-p185991', 'herne2019'],
    featured: false,
  });
}

archive.updated = '2026-11-17';
await writeFile(path, `${JSON.stringify(archive, null, 2)}\n`);
console.log(
  `Discoveries archive: ${archive.specimens.length} specimens, ${archive.discoveries.length} discoveries, ${archive.locations.length} localities.`,
);

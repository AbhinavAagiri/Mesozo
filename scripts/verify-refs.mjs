// Verify citation metadata against Crossref. Prints the best match for each query.
const queries = [
  'Semiaquatic adaptations in a giant predatory dinosaur Ibrahim 2014',
  'Tail-propelled aquatic locomotion in a theropod dinosaur Ibrahim 2020',
  'Spinosaurus is not an aquatic dinosaur Sereno 2022',
  'Subaqueous foraging among carnivorous dinosaurs Fabbri 2022',
  'Evaluating the ecology of Spinosaurus shoreline generalist or aquatic pursuit specialist Hone Holtz',
  'Diving dinosaurs caveats on the use of bone compactness and pFDA Myhrvold',
  'New information on the skull of the enigmatic theropod Spinosaurus Dal Sasso 2005',
  'The predatory ecology of Deinonychus and the origin of flapping in birds Fowler 2011',
  'Taphonomy and paleobiological implications of Tenontosaurus Deinonychus associations Maxwell Ostrom',
  'A reevaluation of cooperative pack hunting and gregariousness in Deinonychus antirrhopus Roach Brinkman',
  'Feather quill knobs in the dinosaur Velociraptor Turner 2007',
  'A king-sized theropod coprolite Chin 1998',
  'Physical evidence of predatory behavior in Tyrannosaurus rex DePalma 2013',
  'A high-resolution growth series of Tyrannosaurus rex Carr 2020',
  'Theropod dinosaur facial reconstruction and the importance of soft tissues Cullen 2023',
  'Evidence of combat in Triceratops Farke 2009',
  'Major cranial changes during Triceratops ontogeny Horner Goodwin 2006',
  'Torosaurus is not Triceratops Longrich Field 2012',
  'A re-evaluation of Brachiosaurus altithorax Riggs 1903 and its generic separation from Giraffatitan brancai Taylor',
  'Head and neck posture in sauropod dinosaurs inferred from extant animals Taylor Wedel Naish',
  'Cranial design and function in a large theropod dinosaur Rayfield 2001',
  'Feeding behaviour and bone utilization by theropod dinosaurs Hone Rauhut',
  'Redescription of Ankylosaurus magniventris Brown 1908 Carpenter 2004',
  'A giant tyrannosaur from the Campanian Maastrichtian of southern North America Dalman 2024',
  'Lokiceratops rangiformis a new centrosaurine Loewen 2024',
  'Fona herzogae a new burrowing thescelosaurine Avrahami 2024',
  'Alpkarakush kyrgyzicus a new giant theropod from the Middle Jurassic Rauhut 2024',
  'Iani smithi a mid-Cretaceous ornithopod Zanno 2023',
  'Meraxes gigas a giant carcharodontosaurid Canale 2022',
];

for (const q of queries) {
  const url = `https://api.crossref.org/works?rows=1&select=DOI,title,issued,container-title,author&query.bibliographic=${encodeURIComponent(q)}`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'MESOZO-reference-check/1.0 (mailto:editorial@mesozo.example)' },
    });
    if (!res.ok) {
      console.log('HTTP', res.status, q);
      continue;
    }
    const json = await res.json();
    const item = json.message.items?.[0];
    if (!item) {
      console.log('NOMATCH', q);
      continue;
    }
    const authors = (item.author ?? [])
      .map((a) => `${a.family ?? ''} ${(a.given ?? '').charAt(0)}`)
      .join(', ');
    console.log(
      [
        'Q: ' + q,
        'T: ' + (item.title?.[0] ?? ''),
        'A: ' + authors,
        'Y: ' + (item.issued?.['date-parts']?.[0]?.[0] ?? ''),
        'J: ' + (item['container-title']?.[0] ?? ''),
        'DOI: ' + item.DOI,
      ].join('\n  '),
    );
  } catch (e) {
    console.log('ERR', q, e.message);
  }
  await new Promise((r) => setTimeout(r, 350));
}

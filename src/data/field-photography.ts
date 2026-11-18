export type FieldAnalogue = {
  periodId: 'triassic' | 'jurassic' | 'cretaceous';
  environment: string;
  location: string;
  caption: string;
  alt: string;
  src900: string;
  src1600: string;
  width: number;
  height: number;
  photographer: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
};

export type ContourReference = {
  src: string;
  alt: string;
  title: string;
  caption: string;
  creator: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
};

/**
 * Real, locally stored landscape photographs used only as modern field
 * analogues. They are never presented as reconstructions of a past
 * environment or as fossil evidence. Sources and licences are recorded in
 * docs/FIELD_PHOTOGRAPHY.md.
 */
export const fieldAnalogues: Partial<Record<string, FieldAnalogue>> = {
  triassic: {
    periodId: 'triassic',
    environment: 'Semi-arid sedimentary basin',
    location: 'Utah, United States',
    caption:
      'Eroded badlands beneath cloud. A modern analogue for the arid, strongly seasonal continental interiors described for the Triassic.',
    alt: 'Eroded badlands and buttes under a pale, clouded sky in Utah.',
    src900: '/assets/img/field/triassic-arid-900.jpg',
    src1600: '/assets/img/field/triassic-arid-1600.jpg',
    width: 1600,
    height: 1067,
    photographer: 'Alex Moliski / Pexels',
    sourceUrl:
      'https://www.pexels.com/photo/desolate-utah-canyon-landscape-under-cloudy-skies-34410860/',
    license: 'Pexels License',
    licenseUrl: 'https://www.pexels.com/license/',
  },
  jurassic: {
    periodId: 'jurassic',
    environment: 'Humid forest understory',
    location: 'North Wales, United Kingdom',
    caption:
      'Ferns and tall trees in humid woodland. A modern analogue for the warm, humid terrestrial settings described for the Jurassic.',
    alt: 'Dense ferns and tall trees in a misty forest clearing in North Wales.',
    src900: '/assets/img/field/jurassic-forest-900.jpg',
    src1600: '/assets/img/field/jurassic-forest-1600.jpg',
    width: 1600,
    height: 2133,
    photographer: 'Mitchell Orr / Unsplash',
    sourceUrl:
      'https://unsplash.com/photos/sunlight-streams-through-a-misty-forest-filled-with-lush-ferns-szGbbTdm8jA',
    license: 'Unsplash License',
    licenseUrl: 'https://unsplash.com/license',
  },
  cretaceous: {
    periodId: 'cretaceous',
    environment: 'Wetland mosaic',
    location: 'Teijo, Finland',
    caption:
      'Mist over a mire and pine stand. A modern analogue for the wet lowland settings that occurred within the high-sea-level Cretaceous greenhouse world.',
    alt: 'A misty mire with pines and still water at Teijo, Finland.',
    src900: '/assets/img/field/cretaceous-wetland-900.jpg',
    src1600: '/assets/img/field/cretaceous-wetland-1600.jpg',
    width: 1600,
    height: 1060,
    photographer: 'Huldi Muuri / Pexels',
    sourceUrl: 'https://www.pexels.com/photo/swamp-and-forest-in-countryside-20616987/',
    license: 'Pexels License',
    licenseUrl: 'https://www.pexels.com/license/',
  },
};

/**
 * A genuine USGS contour sheet, used as a method reference. It is not a
 * palaeogeographic map and does not depict any of the geological periods.
 */
export const contourReference: ContourReference = {
  src: '/assets/img/field/stowe-contour-map.png',
  alt: 'USGS topographic map of Stowe, Vermont, with dense brown contour lines and a river running through the valley.',
  title: 'USGS 1:24,000 topographic sheet',
  caption:
    'Contour interval 20 ft, Stowe, Vermont. A field-sheet method reference: it shows how elevation is read from contour lines, not the palaeogeography of this period.',
  creator: 'U.S. Geological Survey',
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:Topographic_map_example.png',
  license: 'Public domain',
  licenseUrl: 'https://www.usgs.gov/information-policies-and-instructions/copyrights-and-credits',
};

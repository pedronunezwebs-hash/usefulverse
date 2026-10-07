export const pondVolumeCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Pond Volume Calculator',
  title: 'Pond Volume Calculator Free | UsefulVerse',
  description: 'Estimate pond water volume and liner sheet size for rectangular, round or oval ponds. Free and private in your browser.',
  intro: 'Estimate geometric water capacity and a simple liner sheet size. Use average depth for water volume, maximum depth for liner sizing, and enter the overlap you want at each edge.',
  howQuestion: 'How do I calculate pond volume and liner size?',
  howAnswer: 'Choose the pond footprint, enter its plan dimensions and average water depth, then set the fill percentage. For the liner estimate, enter the maximum depth and the edge overlap to add around the perimeter. The tool reports liters, US and imperial gallons, and a rectangular sheet size.',
  privacyQuestion: 'Are pond measurements uploaded?',
  privacyAnswer: 'No. The estimate runs locally in your browser; your measurements are not sent to a server or saved by this tool.',
  fields: {
    shape: 'Pond plan shape', length: 'Longest plan dimension', width: 'Shortest plan dimension or width', diameter: 'Inside pond diameter', dimensionUnit: 'Dimension unit',
    averageDepth: 'Average water depth', maximumDepth: 'Maximum pond depth for liner estimate', edgeOverlap: 'Extra liner overlap at each edge', fillPercent: 'Water fill percentage',
    accuracyNote: 'Volume assumes a flat-bottom prism at the average depth entered. Liner dimensions apply the maximum depth to all sides and add your overlap around every edge. Sloped sides, shelves, curves, stones, folds, anchoring and supplier installation rules can change the actual volume and liner size. This is a geometric estimate, not a construction or water-treatment plan.',
  },
  actions: { calculate: 'Estimate pond volume', reset: 'Reset', copy: 'Copy result', example: 'Try an example', result: 'Pond estimate', rectangle: 'Rectangle', circle: 'Circle', oval: 'Oval', meters: 'Meters', feet: 'Feet' },
  messages: {
    copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate ready.', checkInputs: 'Check the pond shape, dimensions, depths, overlap and fill percentage.',
    footprint: 'Pond footprint area', geometricCapacity: 'Geometric capacity at average depth', filledVolume: 'Estimated water volume at fill level', liters: 'Liters', usGallons: 'US gallons', imperialGallons: 'Imperial gallons', linerLength: 'Estimated liner sheet length', linerWidth: 'Estimated liner sheet width', linerArea: 'Estimated rectangular liner area',
  },
  additionalFaqs: [
    { question: 'Should I use average or maximum depth?', answer: 'Use average water depth for the simple volume estimate. Use the deepest point as maximum depth for the liner-size estimate, which applies that depth around all sides.' },
    { question: 'Does this tell me the exact liner size to buy?', answer: 'No. It estimates a rectangular sheet with the entered overlap. Slopes, shelves, folds, anchoring and supplier installation requirements may need more material; confirm dimensions with the liner supplier.' },
  ],
});

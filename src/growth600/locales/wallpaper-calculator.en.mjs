export const wallpaperCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Wallpaper calculator',
  title: 'Wallpaper calculator free & unlimited | UsefulVerse',
  description: 'Estimate wallpaper rolls, strips and pattern-repeat waste from your wall and roll measurements. Free, unlimited browser calculator.',
  intro: 'Enter the total wall perimeter, height and the roll details from its label. Add the pattern repeat and openings for a more useful estimate.',
  howQuestion: 'How many wallpaper rolls do I need?',
  howAnswer: 'The estimate divides your adjusted wall run into strips, rounds each drop up to a full pattern repeat, adds a 10 cm trim allowance and counts how many drops fit in each roll. Add extra material for cuts, corners and mistakes.',
  privacyQuestion: 'Are my room measurements uploaded?',
  privacyAnswer: 'No. The calculation runs in your browser and does not send your measurements to a server.',
  fields: {
    unit: 'Measurement unit', perimeter: 'Total wall perimeter', wallHeight: 'Wall height', openingsArea: 'Total door and window area (optional)',
    rollWidth: 'Wallpaper roll width', rollLength: 'Wallpaper roll length', patternRepeat: 'Pattern repeat from label (0 if none)', wastePercent: 'Extra material (%)',
    accuracyNote: 'Planning estimate, not a wall-by-wall cutting plan. Door and window area is deducted proportionally; it does not model their position, corners or pattern alignment. Check the roll label and add a practical allowance.',
    relatedPaintCalculator: 'Also planning paint? Use the paint calculator.',
  },
  actions: { calculate: 'Estimate rolls', reset: 'Reset', copy: 'Copy result', example: 'Try an example', result: 'Wallpaper estimate', meters: 'Metres', feet: 'Feet' },
  messages: {
    copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate ready.', checkInputs: 'Check the measurements, roll details and extra-material percentage.',
    netArea: 'Estimated wall area after openings', strips: 'Wall strips needed', dropLength: 'Cut length per strip', dropsPerRoll: 'Usable strips per roll', stripsToOrder: 'Strips including extra material', rolls: 'Whole rolls to buy',
  },
  additionalFaqs: [
    { question: 'Why does a pattern repeat increase the number of rolls?', answer: 'Each strip may need to start at the same point in the design. The cut length is rounded up to a full repeat, so fewer strips may fit on each roll.' },
    { question: 'Does the estimate account for doors, windows and corners exactly?', answer: 'No. Entered opening area is converted into equivalent wall width. The estimate cannot place openings, corners or pattern matches; measure each wall and check the manufacturer guidance before buying.' },
  ],
});

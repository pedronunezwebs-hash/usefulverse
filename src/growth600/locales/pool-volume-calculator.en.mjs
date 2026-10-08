export const poolVolumeCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Pool volume calculator',
  title: 'Pool volume calculator | UsefulVerse',
  description: 'Estimate pool water volume in litres and gallons for round, oval or rectangular pools. Free and calculated in your browser.',
  intro: 'Estimate how much water a pool holds. Choose its shape, dimensions and flat or sloped floor to see volume in litres and both gallon standards.',
  howQuestion: 'How many gallons of water does my pool hold?',
  howAnswer: 'Choose the pool shape and length unit, then enter the inside dimensions. For a flat floor, enter one water depth. For a sloped floor, enter the shallow and deep depths; the calculator uses their average. Results include cubic metres, litres, US gallons and imperial gallons. Steps, benches and curved walls can change the actual capacity.',
  privacyQuestion: 'Are my pool measurements uploaded?',
  privacyAnswer: 'No. The estimate runs in this browser and does not send your measurements to a server.',
  fields: {
    shape: 'Pool shape', length: 'Inside length', width: 'Inside width', ovalLength: 'Oval pool length', ovalWidth: 'Oval pool width', diameter: 'Inside diameter',
    floor: 'Pool floor', shallowDepth: 'Water depth at shallow end', deepDepth: 'Water depth at deep end', dimensionUnit: 'Measurement unit',
    accuracyNote: 'Use inside water dimensions. This is a geometric estimate; steps, benches, curved walls, fill level and displacement can change capacity. Use verified pool capacity for chemical dosing.',
  },
  actions: {
    calculate: 'Calculate', reset: 'Reset', copy: 'Copy result', example: 'Try 2 × 3 × 1 m example', result: 'Estimated pool volume',
    rectangle: 'Rectangle', circle: 'Circle', oval: 'Oval', flat: 'Flat floor', sloped: 'Sloped floor', meters: 'Meters', centimeters: 'Centimeters', feet: 'Feet', inches: 'Inches',
  },
  messages: {
    copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate ready.', checkInputs: 'Check pool shape, dimensions and water depth.',
    volume: 'Water volume', liters: 'Litres', usGallons: 'US gallons', imperialGallons: 'Imperial gallons', averageDepth: 'Average water depth',
  },
  additionalFaqs: [
    { question: 'How do I calculate volume for a sloped pool floor?', answer: 'Measure the water depth at the shallow and deep ends. This estimate averages those depths, then multiplies by the pool footprint. It is an approximation for a gradually sloped floor.' },
    { question: 'Are US gallons and imperial gallons the same?', answer: 'No. A US gallon is smaller than an imperial gallon. The calculator shows both values so you can use the unit specified by your pool or product instructions.' },
  ],
});

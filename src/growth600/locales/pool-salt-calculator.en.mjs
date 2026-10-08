export const poolSaltCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Pool salt calculator',
  title: 'Pool salt calculator free | UsefulVerse',
  description: 'Estimate pool salt to add from water volume, current salinity and your chlorinator target. Free, in-browser calculator.',
  intro: 'Estimate salt for a pool from its water volume, measured current salinity and the target listed by your salt system manufacturer.',
  howQuestion: 'How much salt should I add to my pool?',
  howAnswer: 'Enter the pool volume, the measured current salinity and the target specified for your salt system. The calculator estimates the salinity increase, adjusts for salt purity and can round up to whole bags. It does not choose a target or test your water.',
  privacyQuestion: 'Are my pool details uploaded?',
  privacyAnswer: 'No. This estimate runs in your browser and does not send your pool details to a server.',
  fields: {
    volume: 'Pool water volume', volumeUnit: 'Volume unit', currentSalinityPpm: 'Current salinity (ppm)', targetSalinityPpm: 'Target salinity from manufacturer (ppm)',
    saltPurityPercent: 'Salt purity (%)', bagSize: 'Salt bag size (optional)', bagUnit: 'Salt bag weight unit',
    accuracyNote: 'Use a reliable water test and the target in your chlorinator manual. This estimate does not recommend a salinity target or account for product composition, water replacement or actual pool capacity. Follow the manufacturer label and chemical safety directions.',
  },
  actions: { calculate: 'Calculate salt estimate', reset: 'Reset', copy: 'Copy result', example: 'Try 1,000 L and a 1,000 ppm increase', result: 'Pool salt estimate', liters: 'litres', usGallons: 'US gallons', imperialGallons: 'Imperial gallons', kilograms: 'Kilograms', pounds: 'Pounds' },
  messages: {
    copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate ready.', noSaltNeeded: 'The target is at or below the current salinity; this estimate adds no salt.',
    checkInputs: 'Check the pool volume, salinity values, purity and optional bag size.', poolVolume: 'Pool volume', currentSalinity: 'Current salinity', targetSalinity: 'Target salinity', increase: 'Salinity increase',
    pureSalt: 'Ideal pure salt amount', saltToAdd: 'Salt to add for entered purity', bags: 'Whole bags to buy',
  },
  additionalFaqs: [
    { question: 'Does this calculator choose the right salt target?', answer: 'No. Use the target in your salt chlorinator manual and verify current salinity with a suitable water test.' },
    { question: 'What happens when current salinity is already at the target?', answer: 'The estimate shows zero salt to add when the target is at or below the entered current salinity.' },
  ],
});

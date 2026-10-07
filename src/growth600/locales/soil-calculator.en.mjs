const sharedActions = { calculate: 'Calculate', reset: 'Reset', copy: 'Copy result', example: 'Try 1 m cube', result: 'Soil estimate', rectangle: 'Rectangular bed', circle: 'Round pot', meters: 'Meters', centimeters: 'Centimeters', feet: 'Feet', inches: 'Inches', liters: 'Liters', cubicFeet: 'Cubic feet' };

export const soilEnglishCopy = Object.freeze({
  copyLanguage: 'en', name: 'Soil calculator', title: 'Soil calculator free unlimited | UsefulVerse',
  description: 'Estimate soil for raised beds and pots, including total volume and optional bag count. Free, unlimited and calculated in your browser.',
  intro: 'Calculate fill for rectangular beds or round pots. Add the number of matching containers, an extra-material allowance and bag volume if known.',
  howQuestion: 'How much soil do I need for a raised bed or pot?',
  howAnswer: 'Choose a rectangular bed or round pot, enter its usable inside dimensions and soil depth, then set how many identical containers you have. The result shows volume per container and in total. Enter the volume printed on a soil bag to estimate whole bags to buy. Use the inside dimensions below the rim; tapered pots and settling can change the real amount.',
  privacyQuestion: 'Are my container measurements uploaded?',
  privacyAnswer: 'No. The calculation runs in your browser and does not send your measurements to a server.',
  fields: {
    shape: 'Container shape', length: 'Inside length', width: 'Inside width', diameter: 'Inside diameter', depth: 'Soil fill depth',
    dimensionUnit: 'Dimension unit', containerCount: 'Number of matching containers', wastePercent: 'Extra soil (%)',
    bagVolume: 'Volume of one bag (optional)', bagUnit: 'Bag volume unit',
    accuracyNote: 'Use usable inside measurements. The estimate does not account for tapered sides, settling, drainage materials or differences in bag fill.',
  },
  actions: sharedActions,
  messages: { copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate ready.', checkInputs: 'Check the shape, dimensions, depth, container count and optional bag volume.', volumePerContainer: 'Volume per container', totalVolume: 'Total soil volume', orderVolume: 'Volume including extra soil', bagsToBuy: 'Whole bags to buy' },
  additionalFaqs: [
    { question: 'How do I estimate bags for several raised beds?', answer: 'Calculate one bed using its inside length, width and fill depth, enter the number of matching beds, then add the bag volume from its label. The calculator rounds the required bag count up to a whole bag.' },
    { question: 'Does this calculator estimate soil coverage or weight?', answer: 'No. It estimates the volume needed to fill a rectangular bed or round pot. It does not calculate ground coverage, soil weight, nutrients or plant suitability.' },
  ],
});

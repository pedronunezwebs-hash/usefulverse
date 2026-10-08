export const roofingCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en', name: 'Roofing calculator', title: 'Roofing calculator free & unlimited | UsefulVerse',
  description: 'Estimate sloped roof area, roofing squares, shingle bundles and material cost. Free calculator that runs in your browser.',
  intro: 'Turn a horizontal roof footprint into a sloped material estimate. Add pitch, extra material, bundle coverage and an optional price.',
  howQuestion: 'How many roofing bundles do I need?',
  howAnswer: 'Enter the roof area measured as a horizontal projection, then enter the vertical rise and horizontal run in the same unit. Add extra material and the coverage rate printed on your package. The calculator estimates sloped area, roofing squares and whole bundles.',
  privacyQuestion: 'Are my roof measurements uploaded?',
  privacyAnswer: 'No. This estimate runs in your browser and does not send your measurements to a server.',
  fields: {
    projectedArea: 'Horizontal projected roof area', areaUnit: 'Area unit', rise: 'Vertical rise', run: 'Horizontal run', pitchUnit: 'Rise and run unit',
    wastePercent: 'Extra material for cuts (%)', bundlesPerSquare: 'Bundles per roofing square', pricePerBundle: 'Price per bundle (optional)',
    safetyNote: 'Planning estimate only. Assumes one pitch over the entered footprint. Roof shape, valleys, dormers, layers, starter/ridge pieces, underlayment, fastening, product coverage and local rules can change the order. Check package coverage and measurements with a qualified roofer. Never climb or measure a roof unsafely.',
  },
  actions: {
    calculate: 'Calculate', reset: 'Reset', copy: 'Copy result', example: 'Try a 6:12 roof example', result: 'Roofing estimate',
    squareMeters: 'Square metres (m²)', squareFeet: 'Square feet (ft²)', meters: 'Meters', centimeters: 'Centimeters', millimeters: 'Millimeters', feet: 'Feet', inches: 'Inches',
  },
  messages: {
    copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate ready.',
    checkInputs: 'Check the projected area, rise, run, extra material, bundle coverage and optional price.',
    projectedArea: 'Horizontal projected area', roofArea: 'Estimated sloped roof area', extraArea: 'Area including extra material', pitch: 'Pitch (rise per 12 units of run)', slopeFactor: 'Slope multiplier', roofingSquares: 'Roofing squares to order', bundles: 'Whole bundles to order', estimatedCost: 'Estimated material cost', costNotEntered: 'Add a bundle price to estimate material cost.',
  },
  additionalFaqs: [
    { question: 'What is a roofing square?', answer: 'One roofing square is 100 square feet of roof area. The result converts the sloped area plus your extra-material allowance into squares.' },
    { question: 'How do I find bundles per square?', answer: 'Use the coverage information on the specific shingle package. Products differ, so this calculator does not assume that every bundle covers the same area.' },
  ],
});

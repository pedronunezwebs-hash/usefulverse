export const fertilizerCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Fertilizer Calculator',
  title: 'Fertilizer Calculator Free | UsefulVerse',
  description: 'Calculate labeled N-P-K nutrient amounts or product mass from your own area and rate. Free and private in your browser.',
  intro: 'Use the product label’s N-P₂O₅-K₂O percentages to calculate nutrient amounts, or enter your own application rate and area to estimate product quantity. This tool does not recommend a rate.',
  howQuestion: 'How do I calculate fertilizer nutrients from an NPK label?',
  howAnswer: 'Multiply the fertilizer mass by each label percentage and divide by 100. For example, 10 kg of product labeled 20% nitrogen contains 2 kg nitrogen. In area mode, product quantity comes from the rate and area you enter; nutrient masses then use the same label calculation.',
  privacyQuestion: 'Are fertilizer amounts or area uploaded?',
  privacyAnswer: 'No. All calculations run locally in this browser; your inputs are not sent to a server or saved by this tool.',
  fields: {
    mode: 'Calculation mode', productMode: 'Nutrients in a product amount', areaMode: 'Product amount from area and rate',
    productMass: 'Fertilizer product mass', massUnit: 'Mass unit', area: 'Area to apply', areaUnit: 'Area unit', productRate: 'Product application rate', rateUnit: 'Rate unit',
    nitrogenPercent: 'Nitrogen (N) label percentage', phosphatePercent: 'Phosphate equivalent (P₂O₅) label percentage', potashPercent: 'Potash equivalent (K₂O) label percentage',
    accuracyNote: 'Use the exact guaranteed-analysis percentages and a rate you selected from the product label or qualified local guidance. Labels use N-P₂O₅-K₂O; phosphate and potash values are oxide-equivalent label amounts, not elemental phosphorus and potassium masses. This tool does not recommend rates, fertilizer, crops, timing, soil amendments or nutrient targets, and does not assess runoff or local requirements.',
  },
  actions: { calculate: 'Calculate fertilizer amounts', reset: 'Reset', copy: 'Copy result', example: 'Try an example', result: 'Fertilizer estimate', kilograms: 'Kilograms', pounds: 'Pounds', squareMeters: 'Square meters', hectares: 'Hectares', squareFeet: 'Square feet', acres: 'Acres', kg100m2: 'kg per 100 m²', kgHa: 'kg per hectare', lb1000ft2: 'lb per 1,000 ft²', lbAcre: 'lb per acre' },
  messages: {
    copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate ready.', checkInputs: 'Check the product amount or area and rate, the units, and the N-P-K label percentages.',
    productMass: 'Estimated fertilizer product mass', nitrogenMass: 'Nitrogen (N)', phosphateMass: 'Phosphate equivalent (P₂O₅)', potashMass: 'Potash equivalent (K₂O)',
  },
  additionalFaqs: [
    { question: 'How much nitrogen is in 10 kg of fertilizer labeled 20% N?', answer: '10 kg × 20 ÷ 100 = 2 kg of labeled nitrogen.' },
    { question: 'Does this calculator tell me how much fertilizer my plants need?', answer: 'No. It only applies the label percentages to a product mass or a rate and area you enter. Use the product label, soil test and qualified local guidance to choose an application rate.' },
  ],
});

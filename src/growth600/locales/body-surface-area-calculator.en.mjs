export const bodySurfaceAreaCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en', localizationStatus: 'approved', name: 'Body Surface Area Calculator',
  title: 'Body Surface Area Calculator Free | UsefulVerse',
  description: 'Estimate adult body surface area with Mosteller and Du Bois formulas. Free, local calculations with metric or US units.',
  intro: 'Enter height and weight to compare two common body-surface-area estimates. Formula results can differ; this is math information, not medical guidance.',
  howQuestion: 'How is body surface area estimated?',
  howAnswer: 'Mosteller uses the square root of height in centimeters times weight in kilograms divided by 3,600. Du Bois uses a different height-and-weight equation. Both return an estimate in square meters.',
  privacyQuestion: 'Are my measurements uploaded?',
  privacyAnswer: 'No. The estimates run in this browser. Measurements are not saved or uploaded.',
  fields: {
    height: 'Height', heightUnit: 'Height unit', weight: 'Weight', weightUnit: 'Weight unit', centimeters: 'Centimeters (cm)', inches: 'Inches (in)', kilograms: 'Kilograms (kg)', pounds: 'Pounds (lb)',
    accuracyNote: 'Adult estimate only. Supported range: 50–250 cm and 10–500 kg, including equivalent US units.',
    safetyNote: 'Do not use these estimates for medication doses, diagnosis or treatment decisions. Follow a qualified healthcare professional’s instructions. Not intended for children.',
    mosteller: 'Mosteller estimate', duBois: 'Du Bois estimate', difference: 'Difference between formulas', formulaNote: 'Mosteller: √(height cm × weight kg ÷ 3,600). Du Bois: 0.007184 × weight kg^0.425 × height cm^0.725. Results are estimates, not direct measurements.',
  },
  actions: { calculate: 'Calculate estimates', reset: 'Clear', example: 'Try example', result: 'Estimated body surface area', copy: 'Copy results' },
  messages: { calculated: 'Estimates calculated.', checkInputs: 'Check the measurements and supported ranges.', copied: 'Results copied.', copyUnavailable: 'Copy is unavailable in this browser.' },
  additionalFaqs: [
    { question: 'Why do the formulas give different results?', answer: 'Each formula models height and weight differently. The displayed difference is arithmetic, not a measure of which formula is right for a particular person.' },
    { question: 'Can I use body surface area to calculate a medicine dose?', answer: 'No. Do not use this page to choose or change a dose. Use only instructions from a qualified healthcare professional.' },
    { question: 'Does this calculator work for children?', answer: 'No. It is presented only as an adult estimate and does not implement pediatric formulas or clinical interpretation.' },
  ],
});

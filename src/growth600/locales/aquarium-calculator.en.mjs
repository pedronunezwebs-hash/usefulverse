export const aquariumCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Aquarium volume calculator',
  title: 'Aquarium Volume Calculator Free & Unlimited | UsefulVerse',
  description: 'Estimate usable aquarium water, gallons and water weight after substrate and air space. Free and calculated in your browser.',
  intro: 'Use the tank’s inside dimensions to estimate water volume after substrate displacement and the unfilled space at the top.',
  howQuestion: 'How much water does my aquarium hold?',
  howAnswer: 'Multiply the aquarium’s inside length, width and height for its geometric capacity. This estimate then subtracts the air gap and an entered percentage of the substrate layer as solid displacement. It converts the remaining water to litres and US/imperial gallons and estimates water mass at about 1 kg per litre.',
  privacyQuestion: 'Are my aquarium measurements uploaded?',
  privacyAnswer: 'No. The calculation runs in your browser; the measurements are not sent to a server or saved by this tool.',
  fields: {
    length: 'Inside length', width: 'Inside width', height: 'Inside height', dimensionUnit: 'Dimension unit',
    substrateDepth: 'Substrate layer depth', substrateSolidPercent: 'Estimated solid share of substrate (%)', airGap: 'Unfilled air gap above water',
    accuracyNote: 'Planning estimate for a rectangular tank only. Use internal dimensions. Substrate displacement depends on its material; enter an approximate solid share. Gravel, rocks, equipment, braces, water displacement, glass thickness, stand, decorations and safety loads are not fully modeled. Water mass assumes about 1 kg per litre and excludes the aquarium and everything else. Check manufacturer capacity and support requirements. This lightweight calculation runs locally in your browser.',
  },
  actions: { calculate: 'Estimate water volume', reset: 'Reset', copy: 'Copy result', example: 'Try an example', result: 'Aquarium estimate', meters: 'Metres', centimeters: 'Centimetres', feet: 'Feet', inches: 'Inches', liters: 'Litres', usGallons: 'US gallons', imperialGallons: 'Imperial gallons' },
  messages: {
    copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate ready.',
    checkInputs: 'Check internal dimensions, substrate values and air gap. Their combined depth must leave water in the tank.',
    tankVolume: 'Geometric tank capacity', substrateDisplacement: 'Estimated substrate displacement', airSpace: 'Unfilled air-space volume',
    waterVolume: 'Estimated water volume', waterMassKg: 'Estimated water mass', waterMassLb: 'Estimated water mass',
  },
  additionalFaqs: [
    { question: 'Does this include gravel, rocks and aquarium equipment?', answer: 'Only the estimated solid displacement from the substrate depth you enter. Rocks, filters, decorations and other objects are not individually modeled, so actual water volume may be lower.' },
    { question: 'Does the weight include the glass tank or stand?', answer: 'No. The result estimates water mass only, using about 1 kg per litre. Add the tank, substrate, equipment and stand separately, and check the manufacturer’s support guidance.' },
  ],
});

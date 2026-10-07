export const grassSeedCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Grass seed calculator',
  title: 'Grass Seed Calculator Free & Unlimited | UsefulVerse',
  description: 'Estimate grass seed by lawn area and your chosen rate. Plan a two-variety mix and whole bags. Free, in your browser.',
  intro: 'Enter the lawn area and the seeding rate from your seed label or supplier. Estimate the total amount, split a two-variety mix and round up to full bags.',
  howQuestion: 'How much grass seed do I need?',
  howAnswer: 'Multiply the lawn area by the seeding rate you enter. The rate can be in grams per square metre or pounds per 1,000 square feet. An optional extra percentage is added before the amount is split between two varieties or rounded up to full bags.',
  privacyQuestion: 'Are my lawn measurements uploaded?',
  privacyAnswer: 'No. This estimate runs in your browser; measurements and mix details are not sent to a server or saved by this tool.',
  fields: {
    area: 'Lawn area', areaUnit: 'Area unit', seedingRate: 'Seeding rate from your seed label/supplier', rateUnit: 'Rate unit', wastePercent: 'Optional extra seed (%)',
    varietyA: 'Seed variety A (optional name)', percentA: 'Variety A share (%)', varietyB: 'Seed variety B (optional name)', percentB: 'Variety B share (%)', bagSize: 'Bag size (0 to skip bag count)', bagUnit: 'Bag-size unit',
    accuracyNote: 'Use the rate stated on your seed package or by your supplier; this tool does not recommend a universal rate. The estimate assumes the entered rate applies uniformly to the full area. Optional mix shares must total 100%. It does not account for germination, soil, climate, preparation, overseeding guidance, uneven ground or local regulations. Confirm product directions before sowing. All calculations run locally in this browser.',
  },
  actions: { calculate: 'Estimate seed', reset: 'Reset', copy: 'Copy result', example: 'Try an example', result: 'Grass seed estimate', m2: 'm²', ft2: 'ft²', acre: 'acres', gM2: 'g/m²', lb1000ft2: 'lb/1,000 ft²', kg: 'kg', lb: 'lb' },
  messages: {
    copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate ready.', checkInputs: 'Check area, rate, mix percentages and bag size. The two variety shares must add up to 100%.',
    area: 'Entered lawn area', baseSeed: 'Seed before extra allowance', extraSeed: 'Extra seed allowance', totalSeed: 'Estimated seed to buy', bags: 'Whole bags (estimated package weight)',
  },
  additionalFaqs: [
    { question: 'What seeding rate should I enter?', answer: 'Use the rate printed on your seed label or provided by the supplier for your specific product and use. Rates vary; the calculator does not choose one for you.' },
    { question: 'Can I calculate a grass seed blend?', answer: 'Yes. Enter two variety shares that total 100%. The result splits the estimated total by those percentages. You can leave names blank and use the shares just to divide a generic mix.' },
  ],
});

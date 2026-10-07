export const rainwaterHarvestingCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Rainwater Harvesting Calculator',
  title: 'Rainwater Calculator Free | UsefulVerse',
  description: 'Estimate monthly rainwater collection, tank storage, overflow and unmet demand from your roof area and rainfall. Free calculator.',
  intro: 'Plan a simple rainwater balance for a roof catchment. Enter monthly rainfall, runoff efficiency, tank size and expected non-potable use to estimate collection and storage through the year.',
  howQuestion: 'How much rainwater can a roof collect?',
  howAnswer: 'One millimeter of rain on one square meter produces one liter before runoff losses. Multiply each month’s rainfall by catchment area and the runoff percentage; this estimate then adds captured water to the tank, limits storage to capacity and subtracts that month’s demand.',
  privacyQuestion: 'Are my roof or water-use numbers uploaded?',
  privacyAnswer: 'No. The balance runs locally in your browser. Your entries are not sent to a server or saved by this tool.',
  fields: {
    catchmentArea: 'Horizontal roof catchment area', areaUnit: 'Roof area unit', rainfallUnit: 'Rainfall unit', rainfallValues: 'Monthly rainfall, January to December (one number per line)', runoffPercent: 'Runoff efficiency assumption (%)', tankCapacity: 'Tank capacity', tankUnit: 'Tank and demand volume unit', startingStorage: 'Water already in tank at start', monthlyDemandValues: 'Monthly non-potable demand, January to December (one number per line)',
    accuracyNote: 'Planning estimate only. The monthly model adds rain before subtracting demand and does not model daily timing, first-flush systems, leaks, evaporation or roof-specific runoff. Rainwater may need treatment and may not be safe to drink; check local rules and qualified water-safety guidance.',
  },
  actions: { calculate: 'Estimate harvest', reset: 'Reset', copy: 'Copy annual balance', example: 'Try an example', result: 'Annual and monthly water balance', squareMeters: 'Square meters (m²)', squareFeet: 'Square feet (ft²)', millimeters: 'Millimeters (mm)', inches: 'Inches (in)', liters: 'Liters (L)', usGallons: 'US gallons (gal)' },
  messages: {
    copied: 'Water balance copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Rainwater balance ready.', checkInputs: 'Check area, rainfall, tank, starting storage and all 12 demand entries.',
    totalCollected: 'Potential roof runoff before tank overflow', totalDemand: 'Total entered demand', totalOverflow: 'Estimated tank overflow', unmetDemand: 'Demand not met by modeled tank', endingStorage: 'Storage at end of December', rainfall: 'rainfall', collected: 'collected', demand: 'demand', overflow: 'overflow', storage: 'ending tank',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  },
  additionalFaqs: [
    { question: 'How do I estimate roof runoff?', answer: 'Use a runoff percentage appropriate to your roof and collection setup. This tool does not select that value because materials, gutters, first-flush diversion and maintenance vary.' },
    { question: 'Can I drink the collected rainwater?', answer: 'This calculator does not test or treat water. Safety depends on the roof, storage, treatment and local requirements; do not assume harvested water is potable.' },
  ],
});

export const mulchCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Mulch calculator',
  title: 'Mulch calculator free & unlimited | UsefulVerse',
  description: 'Estimate mulch volume, bags and optional cost from bed dimensions, depth and waste. Free and unlimited in your browser.',
  intro: 'Choose rectangular or circular beds, enter how many you have, and set the mulch depth and bag size to estimate how much to buy.',
  howQuestion: 'How much mulch do I need?',
  howAnswer: 'Multiply the total bed area by the chosen depth. Add an optional allowance for uneven ground or settling, then divide by the bag volume and round up to whole bags.',
  privacyQuestion: 'Are my measurements uploaded?',
  privacyAnswer: 'No. The calculation runs in this browser. Measurements are not sent to a server or saved by this tool.',
  fields: {
    shape: 'Bed shape', dimensionUnit: 'Length unit', length: 'Length of each rectangular bed', width: 'Width of each rectangular bed', diameter: 'Diameter of each circular bed',
    bedCount: 'Number of same-size beds', depth: 'Mulch depth', depthUnit: 'Depth unit', bagVolume: 'Volume in each bag', bagUnit: 'Bag-volume unit',
    wastePercent: 'Extra material (%)', pricePerBag: 'Price per bag (optional)', currency: 'Currency', currencyNote: 'Cost is an estimate using the price you enter; it does not include tax, delivery or local price differences.',
    accuracyNote: 'Planning estimate only. Real bed edges, uneven ground, settling and the product label can change the amount. This tool does not recommend plant-specific depth; follow local gardening guidance and product instructions.',
    relatedGravelCalculator: 'Need gravel instead? Try the gravel calculator.', relatedSoilCalculator: 'Filling pots or planters? Try the soil calculator.',
  },
  actions: {
    calculate: 'Calculate mulch', reset: 'Reset', copy: 'Copy result', example: 'Try example', result: 'Mulch estimate', rectangle: 'Rectangle', circle: 'Circle',
    meters: 'Metres', feet: 'Feet', centimeters: 'Centimetres', millimeters: 'Millimetres', inches: 'Inches', liters: 'Litres', cubicFeet: 'Cubic feet',
    squareMeters: 'Square metres', squareFeet: 'Square feet', copyUnavailable: 'Copy is not available in this browser.',
  },
  messages: {
    copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate ready.', checkInputs: 'Check bed dimensions, count, depth, bag size and extra-material percentage.',
    bedArea: 'Total bed area', mulchDepth: 'Mulch depth', volume: 'Volume before extra material', orderVolume: 'Volume including extra material', cubicYards: 'Approximate cubic yards', bags: 'Whole bags to buy', estimatedCost: 'Estimated bag cost', costNotEntered: 'Enter a bag price to estimate cost.',
  },
  additionalFaqs: [
    { question: 'How many bags cover one cubic metre?', answer: 'Divide 1,000 litres by the litres in one bag, then round up if you are buying for exactly one cubic metre. For example, 50-litre bags require 20 bags before any extra allowance.' },
    { question: 'Should I add extra mulch?', answer: 'You can enter an allowance for uneven surfaces, settling or handling. The calculator does not choose a horticultural depth or waste percentage for you; follow plant-care guidance and the product label.' },
  ],
});

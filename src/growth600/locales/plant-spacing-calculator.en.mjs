export const plantSpacingCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Plant Spacing Calculator',
  title: 'Plant Spacing Calculator Free | UsefulVerse',
  description: 'Estimate garden rows and plant count with grid or staggered spacing. Free plant population calculator in your browser.',
  intro: 'Estimate how many plants fit in a rectangular bed. Compare a regular grid with staggered triangular rows using the spacing you choose.',
  howQuestion: 'How do I calculate plant spacing and population?',
  howAnswer: 'Enter the bed dimensions and center-to-center spacing within and between rows. This calculator places the first and last centers half a spacing from each edge, then counts the layout. A staggered pattern offsets alternate rows by half the in-row spacing.',
  privacyQuestion: 'Are my garden dimensions uploaded?',
  privacyAnswer: 'No. The estimate runs locally in your browser; dimensions are not sent to a server or saved by this tool.',
  fields: {
    bedLength: 'Bed length', bedWidth: 'Bed width', inRowSpacing: 'Plant spacing within a row (center to center)', rowSpacing: 'Spacing between rows (center to center)', unit: 'Shared length unit', pattern: 'Planting layout',
    accuracyNote: 'Geometry estimate only. Uses a rectangular bed and half-spacing edge margins; real plants may need different spacing, paths and growth room. Follow the guidance for your variety and check the layout before planting.',
  },
  actions: { calculate: 'Count plants', reset: 'Reset', copy: 'Copy estimate', example: 'Try an example', result: 'Planting estimate', meters: 'Meters (m)', centimeters: 'Centimeters (cm)', millimeters: 'Millimeters (mm)', feet: 'Feet (ft)', inches: 'Inches (in)', grid: 'Regular grid', triangular: 'Staggered triangular', squareUnits: 'square units' },
  messages: {
    copied: 'Estimate copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Plant count ready.', checkInputs: 'Check bed dimensions, both spacing values and layout.',
    totalPlants: 'Estimated plants', rows: 'Rows', plantsPerRow: 'Plants per even / offset row', bedArea: 'Bed area', plantDensity: 'Estimated density', plantsPerArea: 'plants per square unit',
  },
  additionalFaqs: [
    { question: 'What is triangular plant spacing?', answer: 'Alternate rows are shifted by half the in-row spacing. This creates a staggered pattern; the number of plants can differ from a regular grid.' },
    { question: 'Does this choose the right spacing for my plant?', answer: 'No. It only counts a layout from the dimensions you enter. Use seed-packet, nursery or local extension guidance to choose spacing for the variety and growing conditions.' },
  ],
});

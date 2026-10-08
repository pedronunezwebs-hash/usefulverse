export const retainingWallCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Retaining Wall Calculator',
  title: 'Retaining Wall Calculator Free | UsefulVerse',
  description: 'Estimate retaining-wall block courses, base material and backfill from your own dimensions. Free browser calculator.',
  intro: 'Estimate blocks for one straight wall and rectangular base/backfill quantities from dimensions you enter. Adjust block sizes, joint thickness and extra material.',
  howQuestion: 'How do I estimate retaining-wall blocks?',
  howAnswer: 'Divide wall height by the block height plus joint thickness and round up to whole courses. Divide wall length by the block length plus joint thickness and round up to blocks per course. This simple estimate does not create a staggered layout or cut plan.',
  privacyQuestion: 'Are my wall measurements uploaded?',
  privacyAnswer: 'No. This material estimate runs locally in your browser; the dimensions are not sent to a server or saved by this tool.',
  fields: {
    wallLength: 'Straight wall length', wallHeight: 'Wall height (zero for no wall)', wallUnit: 'Wall and fill unit',
    blockLength: 'Block length', blockHeight: 'Block height', blockDepth: 'Block depth', blockUnit: 'Block dimension unit', joint: 'Joint thickness',
    baseWidth: 'Base material width you specify', baseDepth: 'Base material depth you specify', backfillThickness: 'Rectangular backfill thickness you specify', wastePercent: 'Extra material allowance (%)',
    accuracyNote: 'Planning estimate only. Base and backfill use the simple rectangular dimensions you enter; they are not recommendations. The tool does not calculate wall stability, drainage, reinforcement, geogrid, foundations, soil pressure, slopes, loads or building-code compliance. Retaining-wall design can be hazardous; verify local requirements and get qualified engineering advice before construction.',
  },
  actions: { calculate: 'Estimate materials', reset: 'Reset', copy: 'Copy result', example: 'Try an example', result: 'Material estimate', meters: 'Metres', feet: 'Feet', centimeters: 'Centimetres', inches: 'Inches' },
  messages: {
    copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate ready.', checkInputs: 'Check wall, block, joint, base, backfill and extra-material dimensions.',
    courses: 'Whole block courses', blocksPerCourse: 'Blocks per course', blocksBeforeWaste: 'Blocks before extra allowance', blocksToOrder: 'Blocks to order', baseMaterial: 'Base material to order', backfill: 'Rectangular backfill to order',
  },
  additionalFaqs: [
    { question: 'Does this calculate whether a retaining wall is safe?', answer: 'No. It estimates simple material quantities only. It does not analyze soil pressure, drainage, reinforcement, foundations, loads, stability or code. Have a qualified professional design and review a retaining wall before building.' },
    { question: 'Why enter base and backfill dimensions myself?', answer: 'Required dimensions depend on soil, drainage, wall system, loads and local conditions. The calculator uses only the rectangular dimensions you enter and does not prescribe a base or backfill design.' },
  ],
});

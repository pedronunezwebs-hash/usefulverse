export const brickCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en', name: 'Brick calculator', title: 'Brick Calculator Free & Unlimited | UsefulVerse',
  description: 'Estimate bricks, wall courses and mortar for a wall with openings. Free, unlimited and calculated in your browser.',
  intro: 'Enter the wall, brick and mortar-joint dimensions. Add doors or windows, wall layers and an optional mortar-bag yield to estimate materials.',
  howQuestion: 'How many bricks do I need for my wall?',
  howAnswer: 'The estimate divides the net wall area by the face area of one brick plus its mortar joint, then adjusts for wall layers and your extra-material percentage. It also estimates courses and mortar volume.',
  privacyQuestion: 'Are my wall measurements uploaded?', privacyAnswer: 'No. This estimate runs in your browser; measurements are not sent to a server or saved by this tool.',
  fields: {
    wallLength: 'Wall length', wallHeight: 'Wall height', wallUnit: 'Wall measurement unit', brickLength: 'Brick length', brickHeight: 'Brick height',
    brickDepth: 'Brick depth', brickUnit: 'Brick size unit', joint: 'Mortar joint thickness', jointUnit: 'Joint unit', openingWidth: 'Each opening width',
    openingHeight: 'Each opening height', openingCount: 'Number of identical openings', wythes: 'Wall layers (wythes)', wastePercent: 'Extra bricks (%)',
    bagYieldLiters: 'Mortar yield per bag in litres (optional)', accuracyNote: 'Planning estimate for a flat rectangular wall. Openings are deducted by area; their position, interrupted courses, corners, lintels, cuts, bond pattern and structural requirements are not modeled. Mortar volume is geometric and bag coverage varies by product and technique. Verify dimensions and coverage with the supplier; consult a qualified mason for construction decisions.',
  },
  actions: { calculate: 'Estimate materials', reset: 'Reset', copy: 'Copy result', example: 'Try an example', result: 'Brick and mortar estimate', meters: 'Metres', feet: 'Feet', centimeters: 'Centimetres', inches: 'Inches' },
  messages: {
    copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate ready.', checkInputs: 'Check the wall, brick, joint and opening dimensions, layers and extra-material percentage.',
    grossArea: 'Gross wall area', netArea: 'Wall area after openings', courses: 'Approximate courses', bricksPerCourse: 'Average bricks per course',
    bricksBeforeWaste: 'Bricks before extra allowance', bricksToOrder: 'Bricks to order', mortarVolume: 'Approximate mortar volume', mortarBags: 'Mortar bags by entered yield',
  },
  additionalFaqs: [
    { question: 'Does a door or window reduce the brick estimate?', answer: 'Yes. Enter the opening width, height and count; its area is deducted from the wall before estimating bricks. The result does not model where an opening interrupts individual courses.' },
    { question: 'How is mortar volume estimated?', answer: 'The calculator estimates the difference between each nominal brick-and-joint module and the brick volume, then multiplies by the order quantity. Actual use depends on joint size, bond, workmanship, waste and the mortar product; check its coverage label.' },
  ],
});

export const wallFramingCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Wall framing calculator',
  title: 'Wall Framing Calculator Free & Unlimited | UsefulVerse',
  description: 'Estimate wall studs and plate lengths from spacing and opening positions. Free planning math in your browser.',
  intro: 'Estimate stud positions and linear material for one straight wall. Enter the wall dimensions, maximum stud spacing, plate rows and up to three opening positions.',
  howQuestion: 'How many studs do I need for a wall?',
  howAnswer: 'The estimate divides each uninterrupted wall section into equal spaces no greater than the entered spacing. It includes a stud at both wall ends and at each opening edge, then calculates stud and plate linear lengths.',
  privacyQuestion: 'Are my wall dimensions uploaded?',
  privacyAnswer: 'No. This planning estimate runs locally in your browser; wall and opening dimensions are not sent to a server or saved by this tool.',
  fields: {
    wallLength: 'Wall length', wallHeight: 'Wall height', wallUnit: 'Wall dimension unit', spacing: 'Maximum stud spacing', spacingUnit: 'Spacing unit',
    openingStart1: 'Opening 1 start from left end (optional)', openingWidth1: 'Opening 1 width (leave blank if unused)', breakBottomPlate1: 'This opening interrupts the bottom plate (for example, a doorway)',
    openingStart2: 'Opening 2 start from left end (optional)', openingWidth2: 'Opening 2 width (leave blank if unused)', breakBottomPlate2: 'This opening interrupts the bottom plate (for example, a doorway)',
    openingStart3: 'Opening 3 start from left end (optional)', openingWidth3: 'Opening 3 width (leave blank if unused)', breakBottomPlate3: 'This opening interrupts the bottom plate (for example, a doorway)',
    topPlateRows: 'Top plate rows', bottomPlateRows: 'Bottom plate rows (0 if none)',
    accuracyNote: 'Planning estimate for one straight, flat wall only. Openings are defined by their left offset and width. Each uninterrupted section is evenly spaced; the endpoints of every section are counted as supported positions. Mark only openings that interrupt the bottom plate; other openings leave it continuous. It does not size headers, king/jack studs, sills, corners, intersections, bracing, loads, fasteners, cuts, stock-length waste or code compliance. Follow local building requirements and have a qualified professional review structural plans. This tool does not produce a construction-ready framing plan; all calculations run locally in your browser.',
  },
  actions: { calculate: 'Estimate framing', reset: 'Reset', copy: 'Copy result', example: 'Try an example', result: 'Wall framing estimate', meters: 'Metres', feet: 'Feet', centimeters: 'Centimetres', millimeters: 'Millimetres', inches: 'Inches' },
  messages: {
    copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate ready.', checkInputs: 'Check wall dimensions, spacing, rows and opening positions. Openings must be inside the wall and must not overlap.',
    studCount: 'Stud positions counted', studPositions: 'Stud positions from left end', studLinearLength: 'Total stud linear length', openings: 'Openings entered', topPlateMaterial: 'Top plate length', bottomPlateMaterial: 'Bottom plate length', totalPlateMaterial: 'Total plate length', rows: 'rows',
  },
  additionalFaqs: [
    { question: 'Does this calculator include a stud beside every opening?', answer: 'It counts the two opening edges as supported positions. It does not determine the number or size of king studs, jack studs, headers, sills or cripple studs; those depend on the design and local requirements.' },
    { question: 'Does it create a code-compliant framing plan?', answer: 'No. It provides a spacing-based quantity estimate for one straight wall. It does not check loads, bracing, connections, corners, intersections or building codes.' },
  ],
});

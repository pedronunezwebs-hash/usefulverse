export const rafterCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Rafter calculator',
  title: 'Rafter Calculator Free & Unlimited | UsefulVerse',
  description: 'Calculate roof rafter length, pitch and plumb-cut angle. Free, unlimited and calculated in your browser.',
  intro: 'Estimate one straight rafter from the full roof span, ridge-board thickness, roof rise or pitch, and horizontal eave overhang.',
  howQuestion: 'How do I calculate rafter length?',
  howAnswer: 'For a symmetric roof, the calculator halves the full span, subtracts half the ridge-board thickness, and applies the roof slope. A horizontal overhang extends the rafter along the same slope. The result is geometric and does not size a structural member.',
  privacyQuestion: 'Are my roof measurements uploaded?',
  privacyAnswer: 'No. The calculation runs in your browser; the measurements are not sent to a server or saved by this tool.',
  fields: {
    unit: 'Measurement unit', mode: 'Enter roof slope as', span: 'Full roof span', rise: 'Rise from wall plate to ridge',
    pitch: 'Pitch (rise per 12 units of horizontal run)', ridgeThickness: 'Ridge-board thickness', ridgeUnit: 'Ridge-board thickness unit', overhang: 'Horizontal eave overhang',
    diagramLabel: 'Simple symmetric roof geometry diagram. It is illustrative and not a construction plan.',
    accuracyNote: 'Geometry estimate for a straight, symmetric roof. Overhang is measured horizontally; the tool follows the same slope to extend the rafter. It does not design a birdsmouth/seat cut, tail, structural size, connections, loads or code compliance. Verify dimensions and ask a qualified professional to review construction plans. This lightweight calculation runs locally in your browser.',
  },
  actions: { calculate: 'Calculate rafter', reset: 'Reset', copy: 'Copy result', example: 'Try an example', result: 'Rafter geometry', meters: 'Metres', feet: 'Feet', centimeters: 'Centimetres', inches: 'Inches', riseMode: 'Rise', pitchMode: 'Pitch' },
  messages: {
    copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate ready.',
    checkInputs: 'Check the span, slope, ridge thickness and overhang. The ridge must be thinner than the full span.',
    effectiveRun: 'Horizontal run to ridge board', rafterLength: 'Geometric rafter length', pitch: 'Roof pitch (rise per 12)',
    roofAngle: 'Roof angle above horizontal', plumbCut: 'Plumb-cut angle from vertical', overhangRun: 'Horizontal eave overhang',
  },
  additionalFaqs: [
    { question: 'Does eave overhang increase rafter length?', answer: 'Yes. Enter overhang as a horizontal distance. The calculator extends the rafter at the same roof slope, so a positive overhang produces a longer geometric rafter.' },
    { question: 'Does this calculate a birdsmouth cut?', answer: 'No. A birdsmouth or seat cut depends on the wall plate, bearing length, cut depth, lumber dimensions and local requirements. This tool only reports basic roof geometry and a plumb-cut angle; have a qualified professional verify construction details.' },
  ],
});

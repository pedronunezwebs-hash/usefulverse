export const roofPitchCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en', name: 'Roof pitch calculator', title: 'Roof pitch calculator | UsefulVerse',
  description: 'Calculate roof pitch, slope, angle and rafter length from rise and run. Free and calculated in your browser.',
  intro: 'Enter vertical rise and horizontal run to calculate roof pitch, slope percentage, angle and approximate rafter length.',
  howQuestion: 'How do I calculate roof pitch?',
  howAnswer: 'Measure the vertical rise and horizontal run in the same unit. The calculator reports rise per 12 units of run, slope percentage, angle in degrees and radians, and the sloping rafter length. Add an optional horizontal eave overhang to include it in the rafter-length estimate.',
  privacyQuestion: 'Are roof measurements uploaded?', privacyAnswer: 'No. This geometry calculation runs in your browser and does not send measurements to a server.',
  fields: {
    rise: 'Vertical rise', run: 'Horizontal run', overhang: 'Horizontal eave overhang (optional)', unit: 'Length unit',
    safetyNote: 'Geometry only, not a structural or code assessment. Confirm framing, loads, ventilation, weatherproofing, access and local requirements with a qualified professional.',
  },
  actions: { calculate: 'Calculate', reset: 'Reset', copy: 'Copy result', example: 'Try equal rise and run', result: 'Roof geometry', meters: 'Meters', centimeters: 'Centimeters', millimeters: 'Millimeters', feet: 'Feet', inches: 'Inches' },
  messages: { copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate ready.', checkInputs: 'Check rise, run and optional overhang.', angleDegrees: 'Angle', angleRadians: 'Angle in radians', slopePercent: 'Slope', pitch: 'Rise per 12 units of run', rafterLength: 'Estimated rafter length' },
  additionalFaqs: [
    { question: 'What does a 12:12 roof pitch mean?', answer: 'It means the roof rises 12 units vertically for every 12 units of horizontal run, which is a 45-degree angle.' },
    { question: 'Does the rafter-length estimate include overhang?', answer: 'Only if you enter a horizontal eave overhang. The estimate uses a straight right triangle and does not account for cuts, ridge board, fascia or framing details.' },
  ],
});

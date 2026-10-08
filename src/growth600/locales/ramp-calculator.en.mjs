export const rampCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Ramp Calculator',
  title: 'Ramp Calculator Free | UsefulVerse',
  description: 'Estimate ramp run, sloped length and landing space from a rise and chosen slope ratio. Free geometry calculator in your browser.',
  intro: 'Estimate horizontal run and ramp surface length from the rise and slope ratio you choose. Add level landing space to see a simple total horizontal planning length.',
  howQuestion: 'How do I calculate ramp length from rise and slope?',
  howAnswer: 'For a 1:N slope ratio, multiply the vertical rise by N to estimate horizontal run. The sloped surface is the hypotenuse of rise and run. For example, a 1 m rise at 1:12 needs 12 m of horizontal run before landings.',
  privacyQuestion: 'Are my measurements uploaded?',
  privacyAnswer: 'No. The geometry runs locally in your browser. Your measurements are not sent to a server or saved by this tool.',
  fields: { rise: 'Vertical rise', slopeRatioDenominator: 'Chosen slope ratio denominator (1:N)', landingCount: 'Number of level landings', landingDepth: 'Depth of each landing', unit: 'Length unit', safetyNote: 'Geometry only, not an accessibility or code-compliance assessment. The slope and landing requirements depend on local rules, use and site conditions. This calculator does not check them or design structure. Ask a qualified professional to review the plan before building.' },
  actions: { calculate: 'Calculate ramp geometry', reset: 'Reset', copy: 'Copy estimate', example: 'Try an example', result: 'Ramp geometry estimate', millimeters: 'Millimeters (mm)', centimeters: 'Centimeters (cm)', meters: 'Meters (m)', inches: 'Inches (in)', feet: 'Feet (ft)' },
  messages: { copied: 'Estimate copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Ramp estimate ready.', checkInputs: 'Check the rise, slope ratio, landing count, landing depth and unit.', horizontalRun: 'Horizontal ramp run', rampSurface: 'Sloped ramp surface length', landings: 'Landings (count × depth)', totalHorizontal: 'Total horizontal length including landings', slopePercent: 'Chosen slope percentage', angle: 'Slope angle' },
  additionalFaqs: [
    { question: 'Does a 1:12 ratio mean 1 foot up for every 12 feet forward?', answer: 'Yes. It describes one unit of vertical rise for twelve units of horizontal run. This calculator only applies the ratio you enter; it does not decide whether that ratio is permitted or suitable.' },
    { question: 'Does this confirm a wheelchair ramp meets accessibility rules?', answer: 'No. Standards vary by jurisdiction and situation, and may specify landings, width, handrails, edge protection, surfaces and other details. Check the rules that apply and consult a qualified professional.' },
  ],
});

export const pressureCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en', name: 'Pressure Calculator', title: 'Pressure Calculator Free & Unlimited | UsefulVerse',
  description: 'Calculate pressure from force and area or estimate liquid pressure by depth. Free, local, with no account or usage limit.',
  intro: 'Choose average force over an area or hydrostatic pressure from fluid depth, then select units for a clear result.',
  howQuestion: 'How do I calculate pressure?',
  howAnswer: 'For average pressure, divide the normal force by the contact area. For static liquid pressure, multiply fluid density, gravity and depth. Pick units for the inputs and result. The hydrostatic answer is gauge pressure relative to the fluid surface, not total absolute pressure.',
  privacyQuestion: 'Are my measurements uploaded?', privacyAnswer: 'No. All calculations run in this browser and the values are not uploaded or saved.',
  fields: { mode: 'Calculation method', forceAreaMode: 'Force ÷ area', hydrostaticMode: 'Static liquid depth', force: 'Normal force', forceUnit: 'Force unit', area: 'Contact area', areaUnit: 'Area unit', density: 'Fluid density', densityUnit: 'Density unit', depth: 'Depth below the surface', depthUnit: 'Depth unit', gravity: 'Gravitational acceleration (m/s²)', pressureUnit: 'Result pressure unit', accuracyNote: 'Ideal average pressure p = F/A or static-fluid gauge pressure Δp = ρgh. Force is assumed evenly distributed across the entered area. Liquid density and gravity are user inputs. Does not model flow, pressure loss, atmospheric pressure, vessel strength or system safety. Not engineering advice; consult a qualified professional for real equipment. Runs locally; no upload.' },
  actions: { calculate: 'Calculate pressure', reset: 'Reset', copy: 'Copy result', example: 'Load example', result: 'Pressure result' },
  messages: { copied: 'Result copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Calculation complete.', checkInputs: 'Check the entered values and supported units.', model: 'Model', pressure: 'Pressure', pressurePascals: 'Pressure in pascals', force: 'Normal force', area: 'Area', density: 'Fluid density', depth: 'Depth', gravity: 'Gravity' },
  additionalFaqs: [
    { question: 'What is the formula for pressure from force and area?', answer: 'Average pressure is p = F/A: divide a force perpendicular to a surface by its area. The result depends on the assumption that the force is uniformly distributed; this calculator does not find local stress peaks.' },
    { question: 'How is pressure under a liquid calculated?', answer: 'For a static fluid with constant density, gauge pressure increase is Δp = ρgh, where density is in kg/m³, gravity in m/s² and depth in metres. It is the increase relative to the surface, not absolute pressure.' },
    { question: 'What is the difference between gauge and absolute pressure?', answer: 'Gauge pressure is measured relative to local atmospheric pressure. Absolute pressure includes atmospheric pressure. The hydrostatic result here is only the fluid-column gauge pressure; it does not add atmospheric pressure.' },
  ],
});

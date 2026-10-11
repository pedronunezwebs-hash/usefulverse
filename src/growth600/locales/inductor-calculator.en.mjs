export const inductorCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en', localizationStatus: 'approved',
  name: 'Inductor Calculator', title: 'Inductance Calculator Free | UsefulVerse',
  description: 'Estimate single-layer air-core coil inductance or turns with Wheeler’s formula. Free, no sign-up, local in your browser.',
  intro: 'Estimate an air-core coil’s inductance from its winding dimensions, or estimate how many turns reach a target. Free to use in your browser.',
  howQuestion: 'How do I estimate coil inductance?',
  howAnswer: 'For a single-layer circular air-core coil, the calculator applies Wheeler’s approximate formula using mean winding diameter, winding length and whole turns. For example, 40 turns on a 20 mm diameter, 50 mm long winding with 0.8 mm wire gives about 10.68 µH.',
  privacyQuestion: 'Are my coil dimensions uploaded?',
  privacyAnswer: 'No. The estimate runs in this browser. Coil dimensions and target values are not uploaded or saved by this tool.',
  howTo: ['Choose whether to estimate inductance from a turn count or estimate turns for a target inductance.', 'Enter the mean winding diameter, winding length and wire diameter. These must describe a single layer.', 'Calculate and compare the approximate result; check it against the coil geometry and a suitable measurement for real hardware.'],
  example: { label: 'Load a 40-turn, 20 mm diameter coil', values: [] },
  actions: { calculate: 'Estimate inductance', example: 'Load example', reset: 'Reset', copy: 'Copy results', result: 'Approximate coil estimate' },
  fields: {
    mode: 'What do you want to estimate?', inductanceMode: 'Inductance from turns', turnsMode: 'Turns for target inductance', turns: 'Whole number of turns', targetInductance: 'Target inductance (µH)', diameter: 'Mean winding diameter', length: 'Winding length', wireDiameter: 'Wire diameter (one layer fit check)', dimensionUnit: 'Dimension unit', millimeters: 'Millimetres', centimeters: 'Centimetres', inches: 'Inches', accuracyNote: 'Approximate Wheeler formula for a single-layer, circular, air-core coil only. It assumes a uniform winding and does not model a magnetic core, multiple layers, wire insulation, lead inductance, nearby materials, parasitic capacitance, resistance, heating or frequency effects. The wire diameter is used only to check that turns fit in one layer. Not a component design or safety approval; verify real coils with suitable measurement equipment.', resultSummary: 'Calculated estimate', turnsResult: 'Turns', inductanceMicrohenries: 'Approximate inductance (µH)', inductanceMillihenries: 'Approximate inductance (mH)', inductanceHenries: 'Approximate inductance (H)', targetValue: 'Requested target (µH)', fitCheck: 'Single-layer fit check',
  },
  messages: { calculated: 'Approximate coil estimate calculated.', exampleLoaded: 'Example loaded.', checkInputs: 'Check the coil dimensions, turn count, target and units.', fitYes: 'The turns fit the entered one-layer length estimate.', fitNo: 'The turns exceed the entered one-layer length estimate.', copied: 'Results copied.', copyUnavailable: 'Copy is not available in this browser.' },
  additionalFaqs: [
    { question: 'Can this calculate an iron-core or multi-layer inductor?', answer: 'No. It uses a Wheeler approximation for one circular air-core layer. A core or multiple layers change the magnetic field and require a different model.' },
    { question: 'Why does doubling turns increase inductance by about four times?', answer: 'In this model inductance is proportional to the square of turn count, as long as the coil geometry and single-layer assumptions remain valid.' },
    { question: 'Does wire diameter change the inductance result?', answer: 'It is only used to check whether the requested turns can fit along the entered winding length in one layer. The formula does not model wire thickness, insulation or spacing in detail.' },
  ],
});

export const miterAngleCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Miter Angle Calculator',
  title: 'Miter Angle Calculator Free & Unlimited | UsefulVerse',
  description: 'Calculate simple or compound miter-saw settings for an inside corner. Free, unlimited, local in your browser, and no account required.',
  intro: 'Calculate a symmetric miter cut, or compound miter and bevel settings for flat crown molding. Enter the inside corner angle; compound mode also needs the molding spring angle.',
  howQuestion: 'How do I calculate a miter angle?',
  howAnswer: 'For a symmetric simple miter, divide the inside corner angle by two. For flat crown molding in compound mode, enter the spring angle measured from the wall-side back of the molding. A 90° corner with a 38° spring angle gives about a 31.62° miter and 33.86° bevel.',
  privacyQuestion: 'Are my measurements uploaded?',
  privacyAnswer: 'No. The calculation runs in your browser. The angles you enter are not uploaded or saved by this tool.',
  fields: {
    mode: 'Cut type', cornerAngle: 'Inside corner angle (degrees)', springAngle: 'Molding spring angle (degrees)',
    simpleMode: 'Simple miter', compoundMode: 'Compound miter for flat crown molding', diagramLabel: 'Angle diagram: two pieces meet symmetrically at the entered inside corner angle.',
    diagramCorner: 'Inside corner', diagramCut: 'Miter cut', diagramSpring: 'Spring angle',
    accuracyNote: 'Compound convention: spring angle is measured from the wall-side back of the molding. Results are unsigned saw-setting magnitudes, not left/right orientation. Confirm the molding profile, saw scale and manufacturer instructions with a test piece before cutting. Geometry only; not construction or safety advice.',
  },
  actions: { calculate: 'Calculate cut settings', reset: 'Reset', copy: 'Copy result', example: 'Try 90° / 38° example', result: 'Saw settings' },
  messages: { copied: 'Result copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Cut settings calculated.', checkInputs: 'Enter a corner from 1° to 179° and a spring angle from 0° to 90°.', miterSetting: 'Miter-saw setting', bevelSetting: 'Bevel-saw setting', halfCorner: 'Half of inside corner' },
  additionalFaqs: [
    { question: 'What is the simple miter setting for a 90-degree corner?', answer: 'For two pieces that meet symmetrically, each cut is half the inside corner: 45 degrees.' },
    { question: 'Why does compound mode show both miter and bevel?', answer: 'Flat crown molding is tilted between the wall and ceiling. A compound cut combines a miter rotation with a bevel tilt; the result depends on the inside corner and the molding spring angle.' },
    { question: 'Does the result tell me which direction to tilt the saw?', answer: 'No. The calculator reports setting magnitudes, not left/right orientation. Orientation depends on which corner and molding edge you are cutting. Check the saw manual and make a test cut.' },
  ],
});

export const frictionCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Friction Calculator',
  title: 'Friction Calculator Free & Unlimited | UsefulVerse',
  description: 'Calculate static or kinetic friction, normal force, incline effects and net force. Free browser calculator with no account.',
  intro: 'Calculate friction force from a known normal force or a mass on an incline. Compare static friction with its limit, then estimate kinetic friction and net force if the object slides.',
  howQuestion: 'How do I calculate friction force?',
  howAnswer: 'Static friction adjusts up to its maximum, μs × normal force. If the object slides, kinetic friction is μk × normal force and acts opposite its motion. On an incline, gravity also acts along the slope.',
  privacyQuestion: 'Are my measurements uploaded?',
  privacyAnswer: 'No. The calculation runs in this browser. Your mass, force, angle and coefficients are not uploaded or saved by this tool.',
  fields: {
    mode: 'Calculation mode', normalForce: 'Known normal force', mass: 'Object mass', massUnit: 'Mass unit', angle: 'Incline angle from horizontal (degrees)', gravity: 'Gravity (m/s²)',
    staticCoefficient: 'Static friction coefficient (μs)', kineticCoefficient: 'Kinetic friction coefficient (μk)', appliedForce: 'Additional force along the surface (+ down slope; − up slope)', forceUnit: 'Force unit', motionState: 'Object state', atRest: 'Starting at rest', movingUp: 'Already moving in the negative direction', movingDown: 'Already moving in the positive direction',
    positiveSurfaceDirection: 'The positive direction is down the slope; on a horizontal surface it is simply the chosen positive axis. Applied force uses the same signed direction. Use coefficients for the actual materials and conditions.',
    accuracyNote: 'Ideal Coulomb-friction estimate. Static friction varies up to μsN; kinetic friction is μkN. Coefficients depend on materials and conditions. This does not model rolling, deformation, vibration, heat, wear or safety limits and is not engineering advice.',
  },
  actions: { calculate: 'Calculate friction', reset: 'Reset', copy: 'Copy results', example: 'Try a sliding example', result: 'Friction results', normalMode: 'Known normal force', inclineMode: 'Mass on an incline', newtons: 'Newtons (N)', kilonewtons: 'Kilonewtons (kN)', poundsForce: 'Pounds-force (lbf)', kilograms: 'Kilograms (kg)', pounds: 'Pounds (lb)' },
  messages: {
    calculated: 'Friction results calculated.', checkInputs: 'Check the forces, coefficients, mass, angle and motion state.', copied: 'Results copied.', copyUnavailable: 'Clipboard is unavailable in this browser.',
    normalForce: 'Normal force', gravityComponent: 'Gravity along surface', requiredStatic: 'Static friction needed to stay still', maximumStatic: 'Maximum static friction', frictionMagnitude: 'Friction force', frictionDirection: 'Friction direction', regime: 'Motion result', netForce: 'Net force along surface', acceleration: 'Acceleration along surface',
    noDirection: 'None', positiveDirection: 'Positive surface direction', negativeDirection: 'Negative surface direction', uphill: 'Up the slope', downhill: 'Down the slope', static: 'Remains at rest (static friction)', startsDownhill: 'Starts sliding down the slope', startsUphill: 'Starts sliding up the slope',
  },
  additionalFaqs: [
    { question: 'What is the difference between static and kinetic friction?', answer: 'Static friction prevents motion and adjusts only as much as needed, up to μsN. Once sliding starts, kinetic friction is modeled as μkN opposite the direction of motion.' },
    { question: 'How does an incline affect friction?', answer: 'For a mass on a straight incline, normal force is mg cos(θ), while gravity along the slope is mg sin(θ). The calculator compares this downslope force plus your applied force with the static-friction limit.' },
    { question: 'Does the calculator know the coefficient for my materials?', answer: 'No. Friction coefficients vary with materials, surface condition, temperature and other conditions. Enter a value from a suitable reference or measurement; this estimate does not select safe engineering values.' },
  ],
});

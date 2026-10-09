export const torqueCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Torque Calculator',
  title: 'Torque Calculator Free | UsefulVerse',
  description: 'Calculate torque from force, lever arm and angle, or solve for force or distance. Free, unlimited, and processed in your browser.',
  intro: 'Use the perpendicular part of a force to calculate the turning effect around a pivot.',
  howQuestion: 'How do I calculate torque?',
  howAnswer: 'Multiply force by the perpendicular distance from the pivot. For an angled force, use τ = r × F × sin(θ). The result is commonly measured in newton-meters.',
  privacyQuestion: 'Are the force and torque values uploaded?',
  privacyAnswer: 'No. This calculation runs locally in your browser. The values you enter are not uploaded or saved by this tool.',
  fields: {
    mode: 'Calculate', solveTorque: 'Torque from force and arm', solveForce: 'Force from torque and arm', solveArm: 'Lever arm from torque and force',
    force: 'Force', forceUnit: 'Force unit', newton: 'Newtons (N)', kilonewton: 'Kilonewtons (kN)', poundForce: 'Pound-force (lbf)',
    arm: 'Distance from pivot to force line', distanceUnit: 'Distance unit', meters: 'Meters (m)', centimeters: 'Centimeters (cm)', millimeters: 'Millimeters (mm)', feet: 'Feet (ft)', inches: 'Inches (in)',
    angle: 'Angle between arm and force (degrees)', torque: 'Torque magnitude', torqueUnit: 'Torque unit', newtonMeters: 'Newton-meters (N·m)', kilonewtonMeters: 'Kilonewton-meters (kN·m)', poundFeet: 'Pound-feet (lb·ft)', poundInches: 'Pound-inches (lb·in)',
    direction: 'Rotation direction', clockwise: 'Clockwise', counterclockwise: 'Counterclockwise', perpendicularForce: 'Perpendicular force component', momentArm: 'Perpendicular moment arm',
    accuracyNote: 'Model: τ = r × F × sin(θ), where r is the distance from the pivot to the force application point. Angle must be 0°–180°. This ideal calculation is not structural, vehicle, lifting or safety advice.',
  },
  actions: { calculate: 'Calculate torque', reset: 'Reset', copy: 'Copy result', example: 'Load example', result: 'Result' },
  messages: {
    torque: 'Torque', direction: 'Rotation direction', force: 'Force', arm: 'Lever arm', angle: 'Angle', perpendicularForce: 'Perpendicular force component', momentArm: 'Perpendicular moment arm', formula: 'Formula', diagram: 'Lever, pivot and force direction',
    calculated: 'Calculation complete.', checkInputs: 'Check the values and leave the quantity you are solving for blank.', exampleLoaded: 'Example loaded.', solved: 'Calculated quantity',
  },
  additionalFaqs: [
    { question: 'What is the lever arm in a torque calculation?', answer: 'The lever arm is the distance from the pivot to the point where force is applied. The perpendicular moment arm is r × sin(θ), which is multiplied by force to find torque.' },
    { question: 'What angle creates the most torque?', answer: 'A 90-degree force creates the most torque for a given force and lever arm. A force along the arm (0 or 180 degrees) creates zero torque in this model.' },
    { question: 'Can I solve for force or lever arm?', answer: 'Yes. Select the quantity to find, enter torque and the other known value, and leave the requested value blank. The angle must have a nonzero perpendicular component.' },
  ],
});

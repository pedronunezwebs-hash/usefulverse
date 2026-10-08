export const kineticEnergyCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Kinetic Energy Calculator',
  title: 'Kinetic Energy Calculator Free | UsefulVerse',
  description: 'Calculate kinetic and potential energy or solve speed from energy. Free, local and no account.',
  intro: 'Calculate kinetic energy from mass and speed, gravitational potential energy from height, or solve speed from a known kinetic energy. Choose the zero-height reference and gravity used for the estimate.',
  howQuestion: 'How do you calculate kinetic energy?',
  howAnswer: 'Kinetic energy is one half of mass times speed squared: KE = ½mv². Gravitational potential energy relative to a chosen height is PE = mgh. For example, a 2 kg object moving at 3 m/s has 9 J of kinetic energy. The total shown is the sum of these idealized values, not a prediction that includes friction or other losses.',
  privacyQuestion: 'Are my values uploaded?',
  privacyAnswer: 'No. The calculation runs locally in this browser; the values are not uploaded or saved.',
  fields: {
    mode: 'Calculation mode', energyMode: 'Calculate energy from speed', speedMode: 'Solve speed from kinetic energy',
    massKg: 'Mass (kg)', velocityMps: 'Speed (m/s)', kineticEnergyJ: 'Kinetic energy (J)',
    heightM: 'Height above the zero reference (m)', gravityMps2: 'Gravitational acceleration (m/s²)',
    accuracyNote: 'Use height relative to your chosen zero level. Gravity defaults to 9.80665 m/s² but can be changed. This ideal estimate ignores friction, air resistance, rotation and relativistic effects; it is not an engineering or safety assessment.',
  },
  actions: { calculate: 'Calculate energy', reset: 'Reset', copy: 'Copy result', example: 'Try 2 kg at 3 m/s', result: 'Energy result' },
  messages: {
    calculated: 'Calculation ready.', checkInputs: 'Enter a positive mass and valid speed or kinetic energy. Height may be negative; gravity must be greater than zero.',
    velocity: 'Speed', kineticEnergy: 'Kinetic energy', potentialEnergy: 'Gravitational potential energy', totalEnergy: 'Total mechanical energy',
  },
  additionalFaqs: [
    { question: 'Can I find speed from kinetic energy?', answer: 'Yes. Select “Solve speed from kinetic energy,” then enter a positive mass and a kinetic-energy value of zero or greater. The calculator uses v = √(2KE/m).'},
    { question: 'Why can potential energy be negative?', answer: 'Potential energy is measured relative to a reference height that you choose. A position below that zero level has negative mgh; this does not mean the object has negative mass or that kinetic energy is negative.'},
    { question: 'Does total mechanical energy include energy losses?', answer: 'No. It is the sum of kinetic and gravitational potential energy only. Friction, air resistance, rotation, deformation and other energy transfers are not modeled.'},
  ],
});

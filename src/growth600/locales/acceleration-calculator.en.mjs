export const accelerationCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Acceleration Calculator',
  title: 'Acceleration Calculator Free | UsefulVerse',
  description: 'Solve acceleration, time, final velocity or displacement with constant acceleration. Free and no account.',
  intro: 'Use the constant-acceleration equations to find a missing motion value. Choose what to solve and metric or imperial units; the calculator also shows the resulting displacement and final position.',
  howQuestion: 'How do you calculate acceleration?',
  howAnswer: 'For constant acceleration, a = (final velocity − initial velocity) ÷ time. For example, changing from 0 to 20 m/s in 5 seconds gives 4 m/s² and a displacement of 50 m. The tool also solves elapsed time, final velocity or displacement from the other values.',
  privacyQuestion: 'Are my values uploaded?',
  privacyAnswer: 'No. The calculation runs in this browser; values are not uploaded or saved.',
  fields: {
    mode: 'Solve for', solveAcceleration: 'Acceleration', solveTime: 'Time', solveFinalVelocity: 'Final velocity', solveDisplacement: 'Displacement',
    units: 'Unit system', metric: 'Metric · m/s, m/s², m', imperial: 'Imperial · ft/s, ft/s², ft',
    initialVelocity: 'Initial velocity', finalVelocity: 'Final velocity', acceleration: 'Acceleration', timeSeconds: 'Time in seconds', initialPosition: 'Initial position',
    accuracyNote: 'Assumes one-dimensional motion with constant acceleration. Velocity and acceleration may be negative to show direction; elapsed time must be positive. Changing acceleration, drag, rotation and safety suitability are not modeled.',
  },
  actions: { calculate: 'Calculate motion', reset: 'Reset', copy: 'Copy result', example: 'Try 0 to 20 m/s in 5 seconds', result: 'Motion result' },
  messages: {
    calculated: 'Calculation ready.', checkInputs: 'Check the selected values and enter a positive elapsed time.',
    acceleration: 'Acceleration', time: 'Elapsed time', initialVelocity: 'Initial velocity', finalVelocity: 'Final velocity', initialPosition: 'Initial position', displacement: 'Displacement', finalPosition: 'Final position',
  },
  additionalFaqs: [
    { question: 'What is the formula for acceleration?', answer: 'For constant acceleration, divide the change in velocity by elapsed time: a = (vf − vi) / t.' },
    { question: 'What is the difference between acceleration and speed?', answer: 'Speed describes how fast an object moves. Acceleration describes how its velocity changes over time, including a change of direction.' },
    { question: 'Does this calculator assume constant acceleration?', answer: 'Yes. It uses one-dimensional constant-acceleration equations; it does not model changing acceleration, drag, rotation or a real vehicle’s braking distance.' },
  ],
});

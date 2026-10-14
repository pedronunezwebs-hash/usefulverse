export const centripetalForceCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Centripetal force calculator',
  title: 'Centripetal Force Calculator Free | UsefulVerse',
  description: 'Calculate centripetal force, acceleration, speed, RPM and period from circular motion inputs. Free online, locally.',
  intro: 'Calculate the inward acceleration and force for ideal circular motion. Enter linear speed or rotation frequency, then choose the radius and mass units. The tool also converts speed, RPM and period.',
  howQuestion: 'How do you calculate centripetal force?',
  howAnswer: 'Centripetal acceleration is speed squared divided by radius (a = v²/r), and force is mass times that acceleration (F = ma). With rotation frequency f, speed is 2πrf. The force points toward the center of the circular path.',
  privacyQuestion: 'Are my motion values uploaded?',
  privacyAnswer: 'No. The calculation runs in this browser. Your values are not uploaded or saved by this tool.',
  fields: {
    mode: 'Known motion input', speedMode: 'Linear speed', frequencyMode: 'Rotation frequency',
    mass: 'Moving mass', massUnit: 'Mass unit', radius: 'Path radius', radiusUnit: 'Radius unit',
    speed: 'Linear speed', speedUnit: 'Speed unit', frequency: 'Rotation frequency', frequencyUnit: 'Frequency unit',
    accuracyNote: 'Ideal classical circular-motion estimate for constant radius and speed. It does not model tangential acceleration, changing radius, gravity, friction, structural stress, vehicle handling or relativistic speeds. It is not a design or safety rating; check real systems with a qualified engineer.',
    resultMethod: 'Motion input', speedInput: 'Linear speed entered', frequencyInput: 'Rotation frequency entered',
  },
  actions: { calculate: 'Calculate motion', example: 'Load example', reset: 'Reset', copy: 'Copy results', result: 'Centripetal motion results' },
  messages: {
    calculated: 'Circular-motion results ready.', checkInputs: 'Check mass, radius and the selected speed or frequency.',
    acceleration: 'Centripetal acceleration', force: 'Centripetal force', speed: 'Linear speed', frequency: 'Rotation frequency',
    angularVelocity: 'Angular velocity', period: 'Time per revolution', rpm: 'Revolutions per minute',
    copied: 'Results copied.', copyUnavailable: 'Copy is unavailable in this browser.',
  },
  additionalFaqs: [
    { question: 'Does doubling speed double centripetal force?', answer: 'No. With mass and radius unchanged, force varies with speed squared. Doubling speed makes the ideal centripetal acceleration and force four times as large.' },
    { question: 'What is the difference between centripetal and centrifugal force?', answer: 'Centripetal force describes the inward net force needed for circular motion in an inertial frame. “Centrifugal force” is an apparent outward force used in a rotating reference frame.' },
  ],
});

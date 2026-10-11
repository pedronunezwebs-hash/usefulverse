export const centripetalForceCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en', localizationStatus: 'approved',
  name: 'Centripetal Force Calculator', title: 'Centripetal Force Calculator Free | UsefulVerse',
  description: 'Calculate centripetal force, acceleration and g-force from mass, radius and speed or rotation rate. Free and local.',
  intro: 'Calculate the inward force and acceleration for circular motion. Enter tangential speed or rotational frequency and compare the equivalent result.',
  howQuestion: 'How do you calculate centripetal force?',
  howAnswer: 'Use F = m × v² ÷ r, where mass is in kilograms, speed in metres per second and radius in metres. A 2 kg object moving at 4 m/s on a 3 m radius needs about 10.67 N of inward force.',
  privacyQuestion: 'Are my motion values uploaded?',
  privacyAnswer: 'No. The calculation runs in this browser. Your mass, radius and speed are not uploaded or saved by this tool.',
  howTo: ['Enter the mass and circular-path radius, then choose whether you know tangential speed or rotation rate.', 'Enter the speed or frequency with its unit. Rotation rate is converted to tangential speed using the entered radius.', 'Calculate the inward force, acceleration, g-force and equivalent frequency.'],
  example: { label: 'Load a 2 kg object at 4 m/s on a 3 m radius', values: [] },
  actions: { calculate: 'Calculate force', example: 'Load example', reset: 'Reset', copy: 'Copy results', result: 'Circular-motion estimate' },
  fields: {
    mass: 'Mass', massUnit: 'Mass unit', kilograms: 'Kilograms (kg)', grams: 'Grams (g)', pounds: 'Pounds (lb)', radius: 'Path radius', lengthUnit: 'Distance unit', meters: 'Metres (m)', centimeters: 'Centimetres (cm)', millimeters: 'Millimetres (mm)', feet: 'Feet (ft)', inches: 'Inches (in)', inputMode: 'Known motion value', speedMode: 'Tangential speed', rotationMode: 'Rotation rate', speed: 'Tangential speed', speedUnit: 'Speed unit', metersPerSecond: 'Metres per second (m/s)', kilometersPerHour: 'Kilometres per hour (km/h)', milesPerHour: 'Miles per hour (mph)', frequency: 'Rotations per time', frequencyUnit: 'Frequency unit', revolutionsPerMinute: 'Revolutions per minute (rpm)', hertz: 'Hertz (Hz)', accuracyNote: 'Classical point-mass estimate for uniform circular motion. It does not model gravity, friction, string/track strength, changing speed, extended-body rotation, orbital mechanics or relativistic motion. The force is inward (centripetal), not an extra outward force. Use correct units and consult a qualified source for safety-critical designs. All calculations run locally; values are not uploaded or stored.', centripetalForce: 'Inward centripetal force', poundForce: 'Inward force', acceleration: 'Centripetal acceleration', gForce: 'Acceleration in standard g', speedResult: 'Tangential speed', frequencyResult: 'Equivalent rotation rate',
  },
  messages: { calculated: 'Centripetal-force estimate calculated.', exampleLoaded: 'Example loaded: 2 kg, 4 m/s and a 3 m radius.', checkInputs: 'Check mass, radius, motion value and units.', copied: 'Results copied.', copyUnavailable: 'Copy is not available in this browser.' },
  additionalFaqs: [
    { question: 'What is the centripetal-force formula?', answer: 'For a point mass moving in a circle at constant speed, F = m × v² ÷ r. The inward acceleration is v² ÷ r.' },
    { question: 'Can I enter RPM instead of speed?', answer: 'Yes. Choose rotation rate and enter RPM or hertz. The tool converts it using v = 2π × radius × frequency.' },
    { question: 'Is centripetal force a real outward force?', answer: 'The required centripetal force points inward toward the centre. An apparent outward centrifugal force is a description used in a rotating reference frame, not an extra inward-force input here.' },
  ],
});

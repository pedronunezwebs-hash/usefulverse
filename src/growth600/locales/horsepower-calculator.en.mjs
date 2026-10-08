export const horsepowerCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Horsepower Calculator',
  title: 'Horsepower Calculator Free | UsefulVerse',
  description: 'Calculate engine horsepower from torque and RPM, or solve torque and RPM from power. Free, no usage limits; calculations stay in your browser.',
  intro: 'Convert torque and engine speed into mechanical or metric horsepower, watts and kilowatts. You can also solve for torque or RPM when you know the other two values.',
  howQuestion: 'How do you calculate horsepower from torque and RPM?',
  howAnswer: 'Mechanical power is torque × angular speed. With torque in newton-metres and speed in RPM, power in watts is torque × 2π × RPM ÷ 60. For example, 100 N·m at 1,000 RPM is about 10.47 kW or 14.24 metric horsepower. This ideal shaft-power calculation does not include drivetrain losses.',
  privacyQuestion: 'Are my values uploaded?',
  privacyAnswer: 'No. The calculation runs in this browser; values are not uploaded or saved.',
  fields: {
    mode: 'Calculate', solvePower: 'Power from torque and RPM', solveTorque: 'Torque from power and RPM', solveRpm: 'RPM from power and torque',
    torque: 'Torque', torqueUnit: 'Torque unit', rpm: 'Engine speed (RPM)', power: 'Power', powerUnit: 'Power unit',
    accuracyNote: 'Uses ideal rotational shaft power: P = torque × 2π × RPM ÷ 60. Mechanical hp and metric horsepower (PS) are different units. Results do not account for engine condition, test standards, drivetrain losses or vehicle performance.',
  },
  actions: { calculate: 'Calculate', reset: 'Reset', copy: 'Copy result', example: 'Try 100 N·m at 1,000 RPM', result: 'Power result' },
  messages: { calculated: 'Calculation ready.', checkInputs: 'Check the values and units.', torque: 'Torque', rpm: 'Engine speed', power: 'Power', watts: 'Watts', kilowatts: 'Kilowatts', horsepower: 'Mechanical horsepower', metricHorsepower: 'Metric horsepower (PS)' },
  additionalFaqs: [
    { question: 'What is the difference between horsepower and metric horsepower?', answer: 'Mechanical horsepower (hp) is 745.699871582 watts. Metric horsepower (PS) is 735.49875 watts. They are close, but not identical.' },
    { question: 'Why do torque and RPM determine engine power?', answer: 'Power is the rate of rotational work. At a given torque, a shaft turning faster transfers more energy each second. The formula assumes steady rotation and ideal shaft measurements.' },
    { question: 'Does this show horsepower at the wheels?', answer: 'No. It calculates ideal power at the shaft from the torque and RPM you enter. Wheel power is usually lower because the drivetrain loses energy, and measurement methods differ.' },
  ],
});

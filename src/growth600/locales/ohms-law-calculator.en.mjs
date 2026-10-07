export const ohmsLawCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Ohm’s Law Calculator',
  title: 'Ohm’s Law Calculator Free & Unlimited | UsefulVerse',
  description: 'Solve voltage, current, resistance and power, or find series and parallel resistance. Free, local and no account.',
  intro: 'Solve any two missing values in an ideal DC resistive circuit, or calculate the equivalent resistance of a series or parallel resistor network.',
  howQuestion: 'How do I use the Ohm’s law calculator?',
  howAnswer: 'Enter exactly two positive values among voltage (V), current (A), resistance (Ω) and power (W). For example, 12 V and 6 Ω give 2 A and 24 W. Or choose the network mode and enter 2 to 20 resistors.',
  privacyQuestion: 'Are my circuit values uploaded?',
  privacyAnswer: 'No. Calculations run in this browser; your values are not uploaded or saved.',
  fields: {
    mode: 'Calculator mode', solverMode: 'Solve circuit values', networkMode: 'Equivalent resistor network', voltage: 'Voltage (V)', current: 'Current (A)', resistance: 'Resistance (Ω)', power: 'Power (W)', topology: 'Resistor connection', series: 'Series', parallel: 'Parallel', resistorValues: 'Resistor values in ohms (separate with commas, spaces or new lines)',
    accuracyNote: 'Ideal DC resistive math only. This does not check AC impedance, component ratings, wiring, shock/fire risk or electrical codes. Do not use it to certify a circuit or choose safe components; check datasheets and ask a qualified professional. Values stay in this browser.',
  },
  actions: { calculate: 'Calculate', reset: 'Reset', copy: 'Copy result', example: 'Try 12 V and 6 Ω', result: 'Result' },
  messages: { copied: 'Result copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Calculation ready.', checkInputs: 'Check the values. Enter exactly two positive circuit values, or 2 to 20 positive resistor values.' , solvedVoltage: 'Voltage', solvedCurrent: 'Current', solvedResistance: 'Resistance', solvedPower: 'Power', equivalentResistance: 'Equivalent resistance', resistorCount: 'Resistor count', topology: 'Connection' },
  additionalFaqs: [
    { question: 'What does Ohm’s law calculate?', answer: 'For an ideal resistive DC circuit, it relates voltage, current and resistance: V=IR. Power follows P=VI, so any two known positive values determine the other two.' },
    { question: 'How is equivalent resistance calculated?', answer: 'Resistors in series add. For parallel resistors, add their reciprocals and take the reciprocal of that sum. This calculator supports 2 to 20 positive resistor values.' },
    { question: 'Can I use this to design a safe electrical circuit?', answer: 'No. It is basic idealized arithmetic, not a safety assessment. AC, heat, component power ratings, wiring and local code requirements need separate qualified review.' },
  ],
});

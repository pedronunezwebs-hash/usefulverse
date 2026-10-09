export const ledResistorCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'LED Resistor Calculator',
  title: 'LED Resistor Calculator Free & Unlimited | UsefulVerse',
  description: 'Find an LED series resistor, current and power rating. Free, unlimited browser calculator; no sign-up or upload.',
  intro: 'Calculate a current-limiting resistor for one or more LEDs in series. Compare E12 and E24 values and check the estimated current and resistor power.',
  howQuestion: 'How do I calculate a resistor for an LED?',
  howAnswer: 'Subtract the combined LED forward voltage from the supply voltage, then divide by the target current in amperes. The calculator also rounds up to a preferred E12 or E24 value and estimates the resulting current and resistor dissipation.',
  privacyQuestion: 'Are my circuit values uploaded?',
  privacyAnswer: 'No. The calculation runs in this browser; the values you enter are not uploaded or saved by this tool.',
  fields: {
    supplyVoltage: 'Supply voltage (V)', forwardVoltage: 'Forward voltage per LED (V)', ledCount: 'LEDs in series',
    targetCurrentMa: 'Target current (mA)', standardSeries: 'Preferred resistor series', e12: 'E12 — common values', e24: 'E24 — more choices',
    accuracyNote: 'Ideal DC series-circuit estimate. The selected standard value rounds resistance upward, so calculated current will not exceed the target under the entered ideal values. Check LED and resistor datasheets, tolerances, temperature and supply variation. Power suggestion uses a simple 2× margin; it is not a safety certification.',
  },
  actions: { calculate: 'Calculate resistor', reset: 'Reset', copy: 'Copy results', example: 'Try 12 V, one 2 V LED, 20 mA', result: 'LED resistor estimate' },
  messages: {
    calculated: 'LED resistor estimate calculated.', checkInputs: 'Check the values. Supply voltage must exceed the total LED forward voltage.', exampleLoaded: 'Example calculated.',
    totalLedVoltage: 'Combined LED forward voltage', resistorVoltage: 'Voltage across resistor', requiredResistance: 'Required resistance',
    standardResistor: 'Suggested standard resistor', actualCurrent: 'Estimated current with selected resistor', resistorPower: 'Estimated resistor dissipation',
    minimumPowerRating: 'Suggested minimum power rating (2× margin)', powerRatingExceeds: 'Above the listed standard ratings; choose a suitably rated part and verify its datasheet.',
  },
  additionalFaqs: [
    { question: 'What resistor do I need for a 12 V supply and a 2 V LED at 20 mA?', answer: 'The ideal required resistance is (12 − 2) ÷ 0.02 = 500 Ω. This calculator selects 560 Ω from E12, which gives about 17.9 mA and 0.179 W dissipation in the ideal model.' },
    { question: 'Can I put several LEDs in series?', answer: 'Yes. Enter the number of LEDs and the forward voltage of each one. The calculator adds their forward voltages, then uses the remaining supply voltage to calculate the resistor.' },
    { question: 'How do I choose resistor wattage?', answer: 'The tool estimates resistor dissipation from its selected resistance and shows the next common rating at or above twice that estimate. This simple margin does not account for enclosure, ambient temperature, ventilation, pulse loads or manufacturer derating; check the datasheet and circuit conditions.' },
    { question: 'Does this prove my LED circuit is safe?', answer: 'No. LED forward voltage and supply voltage vary, and this ideal calculator does not check transient behavior, wiring, temperature or component limits. Verify actual datasheets and consult a qualified person when needed.' },
  ],
});

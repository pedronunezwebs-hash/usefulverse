export const voltageDropCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Voltage Drop Calculator',
  title: 'Voltage Drop Calculator Free & Unlimited | UsefulVerse',
  description: 'Estimate resistive voltage drop for copper or aluminum wire, DC, single-phase or balanced three-phase. Free, local and no account.',
  intro: 'Estimate voltage drop from conductor material, one-way run length, current, cross-sectional area and supply voltage. AC modes can include a power factor.',
  howQuestion: 'How do I estimate voltage drop in a wire?',
  howAnswer: 'Choose the circuit and conductor material, then enter the one-way route length, current, conductor area and supply voltage. For a resistive single-phase copper example at 20°C, 20 A over 30 m with 2.5 mm² at 230 V is about 8.27 V or 3.60%.',
  privacyQuestion: 'Are my electrical inputs uploaded?',
  privacyAnswer: 'No. The estimate runs in your browser; entered values are not sent to a server by this tool.',
  fields: {
    circuit: 'Circuit type', dc: 'DC, two conductors', singlePhase: 'Single-phase AC', threePhase: 'Balanced three-phase AC',
    material: 'Conductor material', copper: 'Copper', aluminum: 'Aluminum', oneWayLength: 'One-way route length', lengthUnit: 'Length unit', currentA: 'Load current (A)', crossSectionMm2: 'Conductor cross-sectional area (mm²)', supplyVoltageV: 'Supply voltage (V)', powerFactor: 'Power factor (0–1)',
    accuracyNote: 'Resistive-only estimate using nominal material resistivity at 20°C. It omits conductor heating, AC reactance, harmonics, connections, installation conditions and code requirements; actual drop can be higher. Three-phase mode assumes balanced load; AC power factor scales only the resistive term. Not cable sizing, ampacity, protection, compliance or electrical safety advice. Have a qualified electrician verify the design against local rules and manufacturer data.',
  },
  actions: { calculate: 'Estimate voltage drop', reset: 'Reset', copy: 'Copy estimate', example: 'Try an example', result: 'Estimated circuit values', meters: 'Meters', feet: 'Feet' },
  messages: { copied: 'Estimate copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Voltage-drop estimate ready.', checkInputs: 'Check length, current, conductor area, voltage, circuit, material and power factor.', voltageDrop: 'Estimated voltage drop', voltageDropPercent: 'Drop as a share of supply voltage', estimatedReceivingVoltage: 'Estimated voltage at load', resistancePerConductor: 'Reference resistance per conductor' },
  additionalFaqs: [
    { question: 'Does this calculate the correct wire size?', answer: 'No. It estimates resistive voltage drop for entered values. Safe conductor sizing also depends on ampacity, insulation, installation method, ambient temperature, grouping, fault protection, terminals and local electrical codes.' },
    { question: 'Why might the real voltage drop be higher?', answer: 'Conductor resistance rises as it heats. This estimate uses a reference material resistivity at 20°C and omits AC reactance, harmonics, connectors and installation details.' },
    { question: 'What does one-way length mean?', answer: 'Enter the distance from the supply to the load once. The DC and single-phase formulas account for the outgoing and return conductors; balanced three-phase uses its standard square-root-of-three resistive approximation.' },
  ],
});

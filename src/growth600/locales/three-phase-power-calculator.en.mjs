export const threePhasePowerCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en', name: 'Three Phase Power Calculator',
  title: 'Three Phase Power Calculator Free | UsefulVerse',
  description: 'Calculate single- or three-phase AC active, apparent and reactive power. Free, unlimited and calculated locally in your browser.',
  intro: 'Estimate AC power from line voltage, line current and power factor. Switch between single-phase and balanced three-phase systems, and compare star (wye) or delta phase values.',
  howQuestion: 'How do I calculate three-phase power?',
  howAnswer: 'For a balanced three-phase system, apparent power S = √3 × line voltage × line current, active power P = S × power factor, and reactive-power magnitude Q = S × √(1 − PF²). Single-phase apparent power is V × I. These estimates assume sinusoidal AC and a balanced load for three-phase mode.',
  privacyQuestion: 'Are my electrical values uploaded?',
  privacyAnswer: 'No. The calculation runs in this browser; values you enter are not uploaded or saved by this tool.',
  fields: {
    system: 'AC system', singlePhase: 'Single phase', threePhase: 'Three phase (balanced)', topology: 'Three-phase connection', star: 'Star / wye', delta: 'Delta',
    lineVoltage: 'Line voltage', voltageUnit: 'Voltage unit', volts: 'Volts (V)', kilovolts: 'Kilovolts (kV)',
    lineCurrent: 'Line current', currentUnit: 'Current unit', amperes: 'Amperes (A)', kiloamperes: 'Kiloamperes (kA)', powerFactor: 'Power factor (0 to 1)',
    accuracyNote: 'Ideal balanced sinusoidal AC estimate. Power factor is treated as a magnitude; reactive power is shown unsigned. Harmonics, phase imbalance, voltage drops, transient conditions, conductor sizing, protection, safety and electrical-code compliance are not modeled. Use measured equipment data and qualified engineering review for real designs. Values stay in this browser.',
  },
  actions: { calculate: 'Calculate AC power', reset: 'Reset', copy: 'Copy results', example: 'Try 400 V, 10 A and PF 0.8', result: 'Power estimate' },
  messages: {
    calculated: 'AC power estimate calculated.', checkInputs: 'Check voltage, current, power factor and supported units.',
    activePower: 'Active power (P)', apparentPower: 'Apparent power (S)', reactivePower: 'Reactive power magnitude (Q)', lineVoltage: 'Line voltage', lineCurrent: 'Line current', phaseVoltage: 'Phase voltage', phaseCurrent: 'Phase current', powerFactor: 'Power factor', formula: 'Formula',
    singlePhaseFormula: 'S = V × I; P = S × PF; Q = S × √(1 − PF²)', threePhaseFormula: 'S = √3 × Vline × Iline; P = S × PF; Q = S × √(1 − PF²)',
  },
  additionalFaqs: [
    { question: 'What is the formula for balanced three-phase power?', answer: 'Using line-to-line voltage and line current, apparent power is S = √3 × Vline × Iline. Active power is P = S × PF. This assumes a balanced sinusoidal AC system.' },
    { question: 'What is the difference between star and delta?', answer: 'For a balanced star (wye) connection, phase voltage is line voltage divided by √3 and phase current equals line current. In delta, phase voltage equals line voltage and phase current is line current divided by √3. The total power for the same line values is the same.' },
    { question: 'Does power factor affect active power?', answer: 'Yes. Active power is apparent power multiplied by power factor. Lower power factor means less active power for the same line voltage and current; reactive-power magnitude is estimated from S × √(1 − PF²).' },
    { question: 'Can I use this for unbalanced loads or electrical safety design?', answer: 'No. This is an idealized estimate for single phase or balanced three phase. It does not analyze unbalanced phases, harmonics, wiring, equipment ratings, protection, shock or fire risk, or local electrical codes.' },
  ],
  localizationStatus: 'approved', localizationAcceptedBy: 'site-owner', localizationAcceptedAt: '2026-10-09',
});

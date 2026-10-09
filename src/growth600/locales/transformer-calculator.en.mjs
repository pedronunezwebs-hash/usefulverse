export const transformerCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Transformer Calculator',
  title: 'Transformer Calculator Free & Unlimited | UsefulVerse',
  description: 'Calculate transformer voltage, turns ratio or current with efficiency. Free local calculator, no account or upload.',
  intro: 'Estimate ideal transformer voltage, turns ratio or secondary current from the values you know. Choose one calculation mode and enter its inputs.',
  howQuestion: 'How do I calculate transformer voltage?',
  howAnswer: 'For voltage, enter primary voltage and both winding turn counts. A 100-turn primary, 50-turn secondary and 120 V input gives 60 V ideal output. Turns ratio mode uses secondary voltage divided by primary voltage; current mode uses the inverse turns ratio and your efficiency estimate.',
  privacyQuestion: 'Are my transformer values uploaded?',
  privacyAnswer: 'No. This calculator runs in your browser. It does not upload or save the values you enter.',
  fields: {
    mode: 'Calculation mode', voltageMode: 'Secondary voltage from turns', ratioMode: 'Turns ratio from voltages', currentMode: 'Secondary current estimate',
    primaryVoltage: 'Primary voltage (V RMS)', secondaryVoltage: 'Secondary voltage (V RMS)', primaryTurns: 'Primary turns (Np)', secondaryTurns: 'Secondary turns (Ns)', primaryCurrent: 'Primary current (A)', efficiencyPercent: 'Assumed efficiency (%)',
    accuracyNote: 'Ideal educational estimate using RMS voltage and turns ratio Ns/Np. Real transformers depend on frequency, core, load and winding losses. This does not select a rating or check isolation, wiring or electrical safety. Not design or safety advice; consult a qualified professional and manufacturer data.',
  },
  actions: { calculate: 'Calculate', reset: 'Reset', copy: 'Copy result', example: 'Try 120 V, 100:50 turns', result: 'Result' },
  messages: { copied: 'Result copied.', copyUnavailable: 'Copy is unavailable in this browser.', calculated: 'Calculation ready.', checkInputs: 'Check the required positive values and efficiency (above 0% to 100%).', turnsRatio: 'Turns ratio (Ns/Np)', direction: 'Transformer type', 'step-up': 'Step-up', 'step-down': 'Step-down', '1:1': 'Equal turns', primaryVoltage: 'Primary voltage', secondaryVoltage: 'Secondary voltage', primaryCurrent: 'Primary current', secondaryCurrent: 'Estimated secondary current', efficiency: 'Assumed efficiency' },
  additionalFaqs: [
    { question: 'What is the transformer turns ratio?', answer: 'This calculator defines it as secondary turns divided by primary turns (Ns/Np). For an ideal transformer, the secondary-to-primary voltage ratio is the same.' },
    { question: 'How does turns ratio affect current?', answer: 'In an ideal transformer, current ratio is inverse to the turns ratio. The current mode also multiplies by the efficiency percentage you enter, so it is only an estimate.' },
    { question: 'Can this choose or verify a safe transformer?', answer: 'No. It does not check power rating, frequency, core saturation, temperature, insulation, fault protection or local electrical rules. Use manufacturer data and qualified engineering review.' },
  ],
});

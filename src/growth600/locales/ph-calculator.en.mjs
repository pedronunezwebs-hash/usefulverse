export const phCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'pH Calculator',
  title: 'pH Calculator Free & Unlimited | UsefulVerse',
  description: 'Calculate pH and pOH for ideal strong or weak acid and base solutions. Free, unlimited use in your browser; no account.',
  intro: 'Estimate pH, pOH, hydrogen-ion and hydroxide-ion concentrations for a simple strong or monoprotic weak acid/base solution.',
  howQuestion: 'How do I calculate pH?',
  howAnswer: 'For a strong acid model, pH = −log₁₀[H⁺]; for a strong base, pOH = −log₁₀[OH⁻] and pH = 14 − pOH at 25 °C. Weak monoprotic models solve the mass balance and Ka/Kb equilibrium, including water autoionization. For example, [H⁺] = 1 × 10⁻⁷ mol/L gives pH 7 in this ideal 25 °C model.',
  privacyQuestion: 'Are my concentrations uploaded?',
  privacyAnswer: 'No. The calculation runs in this browser; values are not uploaded or saved by this tool.',
  fields: {
    mode: 'Solution model', strongAcid: 'Strong monoprotic acid', strongBase: 'Strong base', weakAcid: 'Weak monoprotic acid', weakBase: 'Weak base', concentration: 'Analytical concentration (mol/L)', equilibriumConstant: 'Equilibrium constant (Ka or Kb)',
    accuracyNote: 'Ideal dilute-solution estimate at 25 °C. Concentrations are used as activities; strong acids/bases are assumed fully dissociated, and weak models assume one ionization step. Real solutions depend on activity coefficients, temperature and other dissolved species. Not laboratory, medical, food, pool or soil advice; verify measurements with an appropriate method.',
  },
  actions: { calculate: 'Calculate pH', reset: 'Reset', copy: 'Copy result', example: 'Try the pH 7 example', result: 'Estimated result' },
  messages: { copied: 'Result copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate calculated.', checkInputs: 'Check the selected model and enter concentrations and constants within the stated ranges.', pH: 'pH', pOH: 'pOH', hydrogen: 'Hydrogen-ion concentration [H+]', hydroxide: 'Hydroxide-ion concentration [OH−]', percentIonized: 'Estimated ionization', classification: 'Solution estimate', acidic: 'Acidic', neutral: 'Neutral', basic: 'Basic', method: 'Model', at25C: 'At 25 °C' },
  additionalFaqs: [
    { question: 'What is the difference between pH and pOH?', answer: 'At 25 °C in this ideal model, pH describes hydrogen-ion concentration and pOH describes hydroxide-ion concentration; their values add to 14.' },
    { question: 'Can this calculate every acid or base?', answer: 'No. It supports ideal strong acid/base concentration estimates and one-step monoprotic weak acid/base equilibrium. It does not model polyprotic acids, buffers, salts, activity coefficients or titration curves.' },
    { question: 'Is this a measured pH value?', answer: 'No. It is a simplified calculation, not a measurement. Real pH is defined using hydrogen-ion activity, and temperature and solution composition matter. Use an appropriate calibrated method when an actual measurement is needed.' },
  ],
});

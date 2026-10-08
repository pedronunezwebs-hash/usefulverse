export const dilutionCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Dilution Calculator',
  title: 'Dilution Calculator Free & Unlimited | UsefulVerse',
  description: 'Calculate stock aliquot and diluent with C₁V₁=C₂V₂, or plan equal serial dilution steps. Free, local and no account.',
  intro: 'Calculate the stock volume and diluent for a target concentration and final volume, or split a total dilution into equal serial steps.',
  howQuestion: 'How do I calculate a dilution?',
  howAnswer: 'For a direct dilution, use C₁V₁=C₂V₂: stock concentration × stock aliquot equals target concentration × final volume. For example, 10 M stock diluted to 2 M with a 1 L final volume needs 0.2 L of stock and 0.8 L of diluent, assuming volumes are additive.',
  privacyQuestion: 'Are my solution values uploaded?',
  privacyAnswer: 'No. The calculator runs in your browser and does not upload or save your inputs.',
  fields: {
    mode: 'Dilution type', directMode: 'Direct dilution (C₁V₁=C₂V₂)', serialMode: 'Equal-step serial dilution', stockConcentration: 'Stock concentration (any consistent unit)', targetConcentration: 'Target concentration (same unit)', finalVolume: 'Final volume per solution or step', volumeUnit: 'Volume unit', steps: 'Number of serial steps',
    accuracyNote: 'Math only; not a lab protocol. Concentration units must match. Direct and serial estimates assume the entered final volume is achievable; volumes may not be additive for real mixtures. No allowance for stock purity, chemical compatibility, temperature, measurement uncertainty or hazards. Follow product safety information and qualified laboratory procedures; not medical or chemical-handling advice.',
  },
  actions: { calculate: 'Calculate dilution', reset: 'Reset', copy: 'Copy result', example: 'Try 10 M to 2 M in 1 L', result: 'Dilution plan', liters: 'Liters (L)', milliliters: 'Milliliters (mL)' },
  messages: { copied: 'Result copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Dilution estimate ready.', checkInputs: 'Check that stock and target concentrations, final volume and step count are valid.', stockAliquot: 'Stock-solution volume', diluent: 'Additional diluent volume (idealized)', dilutionFactor: 'Total dilution factor', steps: 'Serial step count', perStepFactor: 'Dilution factor per step', transferVolume: 'Transfer volume per step', totalDilutionFactor: 'Total dilution factor' },
  additionalFaqs: [
    { question: 'What does C₁V₁=C₂V₂ mean?', answer: 'It equates the amount of solute before and after an ideal dilution: stock concentration times stock aliquot equals target concentration times final solution volume. Use matching concentration units and the total final volume.' },
    { question: 'How does equal-step serial dilution work?', answer: 'The calculator divides the total stock-to-target factor into the selected number of equal concentration factors, then estimates the transfer aliquot and remaining diluent for each same-size step.' },
    { question: 'Does the result give safe instructions for mixing chemicals?', answer: 'No. It is arithmetic only and does not assess hazards, compatibility, purity, heat release or lab technique. Follow the chemical safety documentation and qualified laboratory procedures.' },
  ],
});

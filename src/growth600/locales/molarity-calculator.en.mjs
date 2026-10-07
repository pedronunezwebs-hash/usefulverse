export const molarityCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Molarity Calculator',
  title: 'Molarity Calculator Free & Unlimited | UsefulVerse',
  description: 'Calculate solution molarity, moles, volume or solute mass. Free, unlimited chemistry math in your browser; no account or upload.',
  intro: 'Solve for concentration, amount in moles, solution volume, or the solute mass needed for a chosen final solution. Calculations stay in your browser.',
  howQuestion: 'How do I calculate molarity?',
  howAnswer: 'Molarity is the amount of solute in moles divided by the total solution volume in liters. For example, 1 mol in 2 L of solution is 0.5 mol/L (0.5 M). Use the final solution volume, not the volume of solvent before adding solute.',
  privacyQuestion: 'Are my chemistry values uploaded?',
  privacyAnswer: 'No. The calculator runs locally in your browser and does not upload or save your inputs.',
  fields: {
    mode: 'What do you want to calculate?', concentrationMode: 'Molarity from moles and solution volume', molesMode: 'Moles from molarity and solution volume', volumeMode: 'Solution volume from moles and molarity', soluteMassMode: 'Solute mass from molarity and solution volume', prepareMode: 'Solute mass for a target solution',
    moles: 'Amount of solute (mol)', molarity: 'Molarity (mol/L or M)', volume: 'Total solution volume', volumeUnit: 'Volume unit', molarMass: 'Molar mass (g/mol)',
    accuracyNote: 'Use total final solution volume. In preparation mode, the result is the calculated solute mass; it does not give a lab procedure or account for purity, hydration, density, temperature, non-ideal behavior or safety requirements. Follow the chemical label and your institution’s safety procedures. This is educational arithmetic, not laboratory or medical advice.',
  },
  actions: { calculate: 'Calculate', reset: 'Reset', copy: 'Copy result', example: 'Try 1 mol in 2 L', result: 'Result', liters: 'Liters (L)', milliliters: 'Milliliters (mL)' },
  messages: {
    copied: 'Result copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Calculation complete.', checkInputs: 'Check the selected values and units.',
    concentrationResult: 'Solution concentration', molesResult: 'Amount of solute', volumeResult: 'Total solution volume', soluteMassResult: 'Solute mass', soluteForSolutionResult: 'Solute mass for target solution', finalVolume: 'Target final solution volume',
  },
  additionalFaqs: [
    { question: 'Is molarity the same as molality?', answer: 'No. Molarity uses moles per volume of solution (mol/L). Molality uses moles per mass of solvent (mol/kg). This calculator handles molarity only.' },
    { question: 'Should I enter the solvent volume or final solution volume?', answer: 'Enter the total final solution volume. It is not generally equal to the starting solvent volume because adding solute can change the total volume.' },
    { question: 'Can this tell me how to safely prepare any chemical?', answer: 'No. It only solves basic concentration arithmetic. It does not assess hazards, purity, compatibility, heat release, equipment or handling steps. Follow the product safety information and qualified laboratory guidance.' },
  ],
});

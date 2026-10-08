export const chemicalEquationBalancerEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Chemical Equation Balancer',
  title: 'Balance Chemical Equations Free | UsefulVerse',
  description: 'Balance supported neutral chemical equations in your browser. Free, local and no account.',
  intro: 'Enter neutral reactant and product formulas to find whole-number coefficients that conserve each supported element.',
  howQuestion: 'How do I balance a chemical equation?',
  howAnswer: 'Separate formulas with plus signs and use one arrow, for example H2 + O2 -> H2O. The local solver checks atom counts and returns 2H2 + O2 → 2H2O. Parentheses are supported for formula groups; equations with multiple valid balances are marked.',
  privacyQuestion: 'Are my equations uploaded?',
  privacyAnswer: 'No. Equation balancing runs locally in this browser; your input is not uploaded or saved.',
  fields: {
    equation: 'Unbalanced equation',
    formulaHint: 'Use neutral formulas, + between species, and one ->, → or = arrow. Parentheses and hydrate dots are supported for elements in our formula parser. Charges and ionic half-reactions are not supported.',
    accuracyNote: 'Educational atom-count balancing only, not reaction prediction or a lab protocol. Does not balance ionic charge/electrons, predict products, assess yields or hazards, or give safe handling instructions. For equations with multiple valid balances, the bounded solver returns a small valid result, not a guaranteed global minimum; some cases are rejected. Verify the chemistry and follow qualified lab safety procedures.',
  },
  actions: { calculate: 'Balance equation', reset: 'Reset', copy: 'Copy result', example: 'Try H2 + O2 → H2O', result: 'Balanced equation' },
  messages: { copied: 'Result copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Equation balanced.', checkInputs: 'Check the equation and formula syntax. Use neutral formulas and one arrow.', balancedEquation: 'Balanced equation', atomCheck: 'Atom count', leftSide: 'Reactants', rightSide: 'Products', multipleSolutions: 'This equation has multiple valid balances. This is a small valid result, not a guaranteed globally smallest one.' },
  additionalFaqs: [
    { question: 'What does balancing an equation mean?', answer: 'It chooses coefficients so the count of every supported element is the same on the reactant and product sides. It does not change the formulas or predict whether a reaction occurs.' },
    { question: 'Can it balance ionic equations?', answer: 'No. This version accepts neutral molecular formulas only; ionic charges, electrons and half-reactions need a separate charge-aware method.' },
    { question: 'Which formulas can I enter?', answer: 'Use element symbols supported by the local molar-mass formula parser, numbers, parentheses or brackets, and hydrate separators. Reaction states and charge notation are not accepted.' },
  ],
});

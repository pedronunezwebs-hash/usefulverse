export const polynomialLongDivisionCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Polynomial Long Division Calculator',
  title: 'Polynomial Long Division Calculator Free | UsefulVerse',
  description: 'Divide polynomials and see each long-division step, exact quotient and remainder. Free in your browser, no account.',
  intro: 'Divide one polynomial by another and follow the quotient term, subtraction and remainder at each step. Integer input coefficients are kept exact, including fractional results.',
  howQuestion: 'How do you divide polynomials with long division?',
  howAnswer: 'Write both polynomials in descending powers, divide the leading terms, multiply the divisor by that term, subtract, and repeat until the remainder has a lower degree than the divisor. For example, (x² − 1) ÷ (x − 1) gives quotient x + 1 and remainder 0.',
  privacyQuestion: 'Are my polynomial expressions uploaded?',
  privacyAnswer: 'No. The calculation runs locally in this browser. Your expressions are not uploaded or saved.',
  fields: {
    dividend: 'Dividend polynomial',
    divisor: 'Divisor polynomial',
    accuracyNote: 'Use x, ^ for powers, integer coefficients and + or − between terms, for example 2x^3 - x + 4. Maximum degree: 20; maximum 64 terms and 256 characters per expression. Decimal and fractional input coefficients, multiple variables and other functions are not supported. Fractional quotient or remainder coefficients are shown exactly.',
  },
  actions: { calculate: 'Divide polynomials', reset: 'Reset', copy: 'Copy worked steps', example: 'Load x² − 1 ÷ x − 1', result: 'Long division result' },
  messages: {
    copied: 'Worked result copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Polynomial division complete.', checkInputs: 'Check both polynomial expressions and supported syntax.',
    quotient: 'Quotient', remainder: 'Remainder', step: 'Step', quotientTerm: 'Divide leading terms', subtract: 'Subtract', newRemainder: 'New remainder', exampleLoaded: 'Example loaded: (x² − 1) ÷ (x − 1).',
  },
  additionalFaqs: [
    { question: 'What is the remainder in polynomial long division?', answer: 'The remainder is the polynomial left after repeated division and subtraction. Its degree must be lower than the divisor’s degree; it may be zero when the divisor divides evenly.' },
    { question: 'Can polynomial division produce fractions?', answer: 'Yes. Integer input coefficients can produce exact fractional quotient or remainder coefficients. This calculator displays them as reduced fractions, such as 1/2.' },
    { question: 'Does this divide ordinary numbers or factor a polynomial?', answer: 'No. It divides one polynomial in x by another. Use an integer long-division calculator for whole numbers and a factorization tool to find polynomial factors.' },
  ],
});

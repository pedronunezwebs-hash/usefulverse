export const helocCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'HELOC payment calculator',
  title: 'Free HELOC calculator: payment & interest | UsefulVerse',
  description: 'Estimate HELOC interest-only and repayment payments from your balance, APR and terms. Free browser calculator; actual lender terms vary.',
  intro: 'Estimate the interest-only payment during a HELOC draw period and the monthly payment after repayment begins, using your own balance, rate and terms.',
  howQuestion: 'How do HELOC draw and repayment payments work?',
  howAnswer: 'Enter the credit limit, current balance, APR, draw period and repayment period. The estimate assumes the balance does not change during the draw period, then uses equal monthly principal-and-interest payments. It is simplified math, not a lender quote.',
  privacyQuestion: 'Are my HELOC details uploaded?',
  privacyAnswer: 'No. The calculation runs in your browser; entered balances and rates are not sent to a server or saved by this page.',
  fields: {
    currency: 'Display currency', creditLimit: 'Total HELOC credit limit', balance: 'Current amount drawn', annualApr: 'Annual APR (%)',
    drawMonths: 'Draw period (months)', repaymentMonths: 'Repayment period (months)',
    accuracyNote: 'Illustration only. Assumes a fixed APR, no additional draws or principal payments during the draw period, then equal monthly payments. Fees, variable-rate changes and lender-specific rules are not included; this is not a quote or financial advice.',
    relatedLoanCalculator: 'Compare with the loan payment calculator.',
  },
  actions: { calculate: 'Calculate estimate', reset: 'Reset', example: 'Load example', copy: 'Copy result', result: 'HELOC estimate' },
  messages: {
    copied: 'Estimate copied.', copyUnavailable: 'Copy is not available in this browser.', checkInputs: 'Check the balance, limit, APR and whole-month terms.',
    estimateOnly: 'Illustrative estimate only. Actual HELOC rates and payments vary by lender and can change.',
    availableCredit: 'Credit remaining', interestOnlyPayment: 'Monthly interest-only payment during draw', repaymentPayment: 'Estimated monthly payment after draw',
    paymentChange: 'Change in monthly payment after draw', drawInterest: 'Interest over draw period', repaymentInterest: 'Interest over repayment period',
    totalInterest: 'Total modeled interest', totalPayments: 'Total modeled payments',
  },
  additionalFaqs: [
    { question: 'What happens when the HELOC draw period ends?', answer: 'This estimate switches the entered balance to equal monthly principal-and-interest payments over the repayment term you choose.' },
    { question: 'Does this include new draws or a changing interest rate?', answer: 'No. It keeps the balance and APR constant during the draw period. Many HELOCs have variable rates, lender-specific minimums and fees, so actual payments can differ.' },
  ],
});

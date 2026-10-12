export const debtToIncomeRatioEnglishCopy = Object.freeze({
  copyLanguage: 'en', localizationStatus: 'approved', name: 'Debt-to-Income Ratio Calculator',
  title: 'Debt-to-Income Calculator — Free DTI Tool | UsefulVerse',
  description: 'Calculate your front-end and total debt-to-income ratios from gross monthly income, housing costs, and monthly debt payments. Free and private.',
  intro: 'Estimate your monthly debt-to-income ratio (DTI). Enter gross monthly income, monthly housing costs, and other debt payments to compare the housing ratio with total monthly debt. This is a math estimate, not a loan decision.',
  howQuestion: 'How do you calculate a debt-to-income ratio?',
  howAnswer: 'Divide monthly debt payments by gross monthly income, then multiply by 100. The housing ratio uses housing costs; total DTI adds the other monthly debt payments.',
  privacyQuestion: 'Does this DTI calculator send my financial details?',
  privacyAnswer: 'No. The calculator works in this browser tab and does not upload or automatically save your entries.',
  fields: Object.freeze({
    grossIncome: 'Gross monthly income', housing: 'Monthly housing costs', debts: 'Other monthly debt payments', debt1: 'Credit card minimums', debt2: 'Auto loans', debt3: 'Student loans', debt4: 'Other monthly debts',
    currencyNote: 'Use the same currency and monthly period for every amount. Enter gross income before tax.', housingRatio: 'Housing ratio', totalRatio: 'Total debt-to-income ratio', totalDebt: 'Total monthly debt payments', accuracyNote: 'This estimate does not determine approval or a safe borrowing amount. Lenders and rules differ; check the requirements that apply to you.', privacyNote: 'Your entries stay in this browser tab. They are not uploaded or automatically saved.', exampleHint: 'Example: $5,000 gross monthly income and $2,000 in total monthly debt gives a 40% total DTI.',
  }),
  actions: Object.freeze({ calculate: 'Calculate DTI', example: 'Load example', reset: 'Reset', result: 'Your estimate', copy: 'Copy results' }),
  messages: Object.freeze({ calculated: 'DTI estimate calculated.', checkInputs: 'Check the amounts. Income must be above zero; payments cannot be negative.', copied: 'Results copied.', copyUnavailable: 'Copy is not available in this browser.' }),
  additionalFaqs: Object.freeze([
    Object.freeze({ question: 'What is the difference between front-end and total DTI?', answer: 'The housing ratio compares monthly housing costs with gross monthly income. Total DTI compares housing plus other monthly debt payments with gross monthly income.' }),
    Object.freeze({ question: 'Does a DTI result guarantee mortgage approval?', answer: 'No. This is arithmetic only. A lender may use different rules and review many other details.' }),
    Object.freeze({ question: 'Should I enter net or gross income?', answer: 'This tool uses gross monthly income before tax. Make sure all payments and income use the same currency and monthly period.' }),
  ]),
});

export const rentalYieldCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en', name: 'Rental Yield Calculator', title: 'Rental Yield Calculator Free | UsefulVerse',
  description: 'Estimate gross and net rental yield with vacancy and annual expenses. Free, local and no account needed; not investment advice.',
  intro: 'Estimate a rental property’s gross yield and operating yield from the price, rent, vacancy and expenses you enter. No data is uploaded.',
  howQuestion: 'How do I calculate rental yield?',
  howAnswer: 'Annualize the monthly rent and divide it by the purchase price for gross yield. For estimated net yield, subtract vacancy loss and the annual operating expenses you enter first.',
  privacyQuestion: 'Does this rental yield calculator send my figures anywhere?',
  privacyAnswer: 'No. The estimates run in this browser. Property and rent figures are not uploaded, saved or sent to a lender or property service.',
  fields: { propertyPrice: 'Property purchase price', monthlyRent: 'Monthly rent', currencySymbol: 'Currency symbol or code', vacancyPercent: 'Estimated vacancy (%)', annualPropertyTax: 'Annual property tax', annualMaintenance: 'Annual maintenance', annualInsurance: 'Annual insurance', annualAssociationFees: 'Annual association or service fees', annualOtherExpenses: 'Other annual operating expenses', currencyNote: 'Use one currency for every amount. This tool does not convert currencies.', accuracyNote: 'Estimate only. Mortgage payments, taxes on rental income, closing costs and property value changes are not included.', resultTitle: 'Rental yield estimate', grossAnnualRent: 'Gross annual rent', vacancyLoss: 'Estimated vacancy loss', effectiveAnnualRent: 'Rent after vacancy', annualExpensesTotal: 'Entered annual expenses', netOperatingIncome: 'Estimated net operating income', grossYieldPercent: 'Gross rental yield', netYieldPercent: 'Estimated net yield', monthlyNetIncome: 'Average monthly operating income' },
  actions: { example: 'Load example', reset: 'Reset', calculate: 'Calculate yield', copy: 'Copy summary' },
  messages: { calculated: 'Yield estimate calculated.', checkInputs: 'Check the price, rent, vacancy and expense amounts.', copied: 'Summary copied.', copyUnavailable: 'Clipboard is unavailable in this browser.', exampleLoaded: 'Example loaded.' },
  additionalFaqs: [
    { question: 'What is the difference between gross and net rental yield?', answer: 'Gross yield compares annual rent with the purchase price. This estimate of net yield also subtracts the vacancy amount and annual operating expenses entered here.' },
    { question: 'Does net yield include mortgage payments or income tax?', answer: 'No. Financing, rental-income tax, closing costs and property value changes are outside this simple operating-yield estimate.' },
    { question: 'How does vacancy affect rental yield?', answer: 'The entered vacancy percentage reduces collected annual rent before entered operating expenses are subtracted.' },
  ],
});

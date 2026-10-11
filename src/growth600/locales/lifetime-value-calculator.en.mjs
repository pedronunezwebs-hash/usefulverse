export const lifetimeValueCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en', localizationStatus: 'approved',
  name: 'Customer Lifetime Value Calculator',
  title: 'Customer Lifetime Value Calculator Free | UsefulVerse',
  description: 'Estimate customer lifetime value from monthly revenue, gross margin and churn. Add CAC for payback and LTV:CAC. Free and private in your browser.',
  intro: 'Estimate a simple customer lifetime value (LTV) from monthly revenue per customer, gross margin and monthly churn. Optionally add customer acquisition cost (CAC) to compare payback and LTV:CAC.',
  howQuestion: 'How do you calculate customer lifetime value from churn?',
  howAnswer: 'This simple method estimates LTV as monthly revenue per customer × gross margin ÷ monthly customer churn. With monthly revenue 100, 50% margin and 5% monthly churn, LTV is 1,000 before CAC and overhead.',
  privacyQuestion: 'Are my business figures uploaded?',
  privacyAnswer: 'No. The calculation runs locally in this browser. Your revenue, margin, churn and CAC values are not uploaded or saved by this tool.',
  howTo: ['Enter monthly revenue per customer, gross margin percentage and monthly customer churn percentage.', 'Optionally enter customer acquisition cost (CAC) and a three-letter currency code for display.', 'Calculate and review estimated LTV, expected lifetime, gross profit per month, CAC payback and LTV:CAC when CAC is above zero.'],
  example: { label: 'Load 100 monthly revenue, 50% margin and 5% churn', values: [] },
  actions: { calculate: 'Calculate LTV', example: 'Load example', reset: 'Reset', copy: 'Copy results', result: 'Estimated customer economics' },
  fields: {
    monthlyRevenue: 'Monthly revenue per customer', grossMarginPercent: 'Gross margin (%)', monthlyChurnPercent: 'Monthly customer churn (%)', customerAcquisitionCost: 'Customer acquisition cost (CAC)', currencyCode: 'Display currency code (3 letters)',
    accuracyNote: 'Simple illustration, not a business forecast or advice. Assumes revenue, margin and churn remain constant; real cohorts vary. Excludes discounting, expansion, refunds, overhead and taxes. Churn must be above zero. Currency only formats numbers; it does not convert them.',
    resultSummary: 'Estimated customer value', monthlyGrossProfit: 'Gross profit per customer per month', expectedLifetimeMonths: 'Estimated customer lifetime (months)', lifetimeValue: 'Estimated customer lifetime value (LTV)', cacPaybackMonths: 'CAC payback from monthly gross profit (months)', lifetimeValueToCac: 'LTV:CAC ratio',
  },
  messages: { calculated: 'Customer value estimate calculated.', exampleLoaded: 'Example loaded: 100 monthly revenue, 50% margin and 5% monthly churn.', checkInputs: 'Check revenue, margin, churn, CAC and currency.', copied: 'Results copied.', copyUnavailable: 'Copy is not available in this browser.' },
  additionalFaqs: [
    { question: 'How does monthly churn estimate customer lifetime?', answer: 'Under a simple constant-churn assumption, expected lifetime in months is 100 divided by the monthly churn percentage. At 5% churn, that is 20 months. Real retention can change over time.' },
    { question: 'Does LTV include customer acquisition cost or overhead?', answer: 'LTV here is based on revenue and gross margin. CAC is shown separately as a ratio and simple payback comparison; overhead, taxes, discounting and changing cohorts are excluded.' },
  ],
});

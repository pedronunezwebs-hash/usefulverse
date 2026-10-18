export const customerAcquisitionCostCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Customer Acquisition Cost Calculator',
  title: 'CAC Calculator — Free & Unlimited | UsefulVerse',
  description: 'Calculate customer acquisition cost from marketing and sales spend, then estimate gross-profit payback. Free, private and unlimited.',
  intro: 'Add the costs used to acquire customers and the number of new customers in the same period. See blended CAC and, when revenue and margin are known, an estimated gross-profit payback period.',
  howQuestion: 'How do you calculate customer acquisition cost?',
  howAnswer: 'Add the acquisition costs for one period and divide by the new customers acquired in that same period: CAC = total acquisition spend ÷ new customers. Estimated payback months = CAC ÷ (monthly revenue per customer × gross margin).',
  privacyQuestion: 'Are my business figures uploaded?',
  privacyAnswer: 'No. All calculations run in this browser. Your figures are not uploaded or saved by this tool.',
  fields: {
    marketingSpend: 'Marketing and advertising spend', salesSpend: 'Sales team spend', toolsSpend: 'Sales and marketing tools', agencySpend: 'Agency or contractor spend', otherSpend: 'Other acquisition spend',
    newCustomers: 'New customers acquired in this period', currency: 'Currency code (ISO 4217)', monthlyRevenue: 'Monthly revenue per customer', grossMargin: 'Gross margin (%)',
    accuracyNote: 'Count costs and customers from the same period and acquisition scope. CAC is a blended average, not marginal CAC or proof that a campaign caused each sale. Payback uses revenue × gross margin as a simple monthly gross-profit estimate; it excludes churn, payment timing, taxes, overhead and changing customer cohorts. Not financial advice.',
    resultHeading: 'Acquisition estimate', totalSpend: 'Total acquisition spend', customers: 'New customers', cac: 'Blended customer acquisition cost (CAC)', monthlyGrossProfit: 'Estimated monthly gross profit per customer', payback: 'Estimated gross-profit payback', notAvailable: 'Not available when monthly gross profit is zero', months: 'months',
  },
  actions: { calculate: 'Calculate CAC', example: 'Load example', reset: 'Reset', copy: 'Copy results', result: 'Results' },
  messages: { calculated: 'CAC estimate calculated.', checkInputs: 'Check the amounts, customer count, margin and currency code.', copied: 'Results copied.', copyUnavailable: 'Copy is not available in this browser.' },
  additionalFaqs: [
    { question: 'What does a CAC of 100 mean?', answer: 'It means the included acquisition costs averaged 100 currency units for each new customer in the selected period. It does not show whether each channel or customer had the same cost.' },
    { question: 'Is CAC payback the same as customer lifetime value?', answer: 'No. CAC payback estimates how many months of gross profit cover acquisition cost. It does not estimate the customer’s full lifetime value, retention or future revenue.' },
  ],
});

export const overtimeCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en', localizationStatus: 'approved', name: 'Overtime Calculator',
  title: 'Overtime Calculator Free | UsefulVerse',
  description: 'Estimate regular and overtime pay from your own hours, threshold, hourly rate, and multiplier. Free calculator; no account.',
  intro: 'Enter your weekly hours, hourly pay, overtime threshold, and multiplier to estimate regular pay and overtime pay separately.',
  howQuestion: 'How do I calculate overtime pay?',
  howAnswer: 'This calculator applies the threshold and overtime multiplier you enter: regular hours are paid at the entered hourly rate, and hours above the threshold use the entered multiplier.',
  privacyQuestion: 'Is my pay information uploaded?',
  privacyAnswer: 'No. The estimate runs in this browser. Inputs are not saved or uploaded.',
  fields: {
    totalHours: 'Total hours this week', hourlyRate: 'Hourly rate', thresholdHours: 'Overtime threshold (hours)', overtimeMultiplier: 'Overtime pay multiplier',
    regularHours: 'Regular hours', overtimeHours: 'Overtime hours', regularPay: 'Estimated regular pay', overtimePay: 'Estimated overtime pay', totalPay: 'Estimated total pay', blendedHourlyRate: 'Estimated average pay per hour',
    accuracyNote: 'Enter the threshold, multiplier, and pay rules that apply to your situation. The calculator does not assume a currency or determine legal eligibility.',
    legalNote: 'No country or employer rules are assumed. This is arithmetic based only on your entries, not a payroll statement, legal advice, tax estimate, or guarantee of wages.',
    privacyNote: 'Inputs stay in this browser tab and are not stored or uploaded.',
  },
  actions: { calculate: 'Estimate pay', example: 'Try example', reset: 'Clear', result: 'Pay estimate', copy: 'Copy results' },
  messages: { calculated: 'Estimate calculated.', checkInputs: 'Check the hours, rate, threshold, and multiplier.', copied: 'Results copied.', copyUnavailable: 'Copy is unavailable in this browser.' },
  additionalFaqs: [
    { question: 'Does this calculator apply a specific country’s overtime law?', answer: 'No. It uses only the threshold and multiplier you enter. Legal rules can depend on location, job classification, agreement, and other details.' },
    { question: 'How is overtime pay estimated?', answer: 'Hours at or below your entered threshold use the hourly rate. Hours above it use the hourly rate multiplied by your selected overtime multiplier.' },
    { question: 'Does the estimate include taxes or deductions?', answer: 'No. It shows gross arithmetic from the entered rate and hours, before taxes, deductions, bonuses, or other payroll items.' },
  ],
});

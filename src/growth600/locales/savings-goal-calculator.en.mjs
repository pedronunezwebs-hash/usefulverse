export const savingsGoalCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Savings Goal Calculator',
  title: 'Savings Goal Calculator Free | UsefulVerse',
  description: 'Find a monthly saving target or estimate when you may reach a savings goal. Free, local calculations with a 100-year cap.',
  intro: 'Work backward from a target and date, or estimate how many months fixed deposits may take. Add a starting balance and an optional rate.',
  howQuestion: 'How do I calculate a savings goal?',
  howAnswer: 'Choose whether to solve for the monthly deposit or the number of months. Enter a target, starting balance, annual rate and deposit timing. Use the same currency units for all amounts.',
  privacyQuestion: 'Are my savings details uploaded?',
  privacyAnswer: 'No. The estimate runs in this browser. Your numbers are not sent to a server or stored by this tool.',
  fields: {
    mode: 'What do you want to calculate?', startingBalance: 'Current savings', targetAmount: 'Savings target', annualRatePercent: 'Nominal annual rate (%)', months: 'Months to save', monthlyContribution: 'Monthly deposit', contributionTiming: 'When each monthly deposit is made', timingEnd: 'End of month', timingBeginning: 'Beginning of month', accuracyNote: 'Illustration only. The rate is treated as constant and compounded monthly; real accounts may use different terms.', currencyNote: 'Enter all amounts in the same currency. No currency conversion is performed.', resultSummary: 'Estimate', monthlyResult: 'Required monthly deposit', monthsResult: 'Months to reach target', projectedBalance: 'Projected balance', totalContributions: 'Total deposits', estimatedInterest: 'Estimated interest',
  },
  actions: { calculate: 'Calculate', example: 'Load example', copy: 'Copy result', reset: 'Clear', requiredContribution: 'Monthly deposit needed', monthsToGoal: 'Time needed for my deposit', beginning: 'Beginning of month', end: 'End of month' },
  messages: { calculated: 'Savings estimate ready.', checkInputs: 'Check the amounts, rate and selected time range.', exampleLoaded: 'Example loaded.', calculateFirst: 'Calculate an estimate first.', copied: 'Estimate copied.', copyUnavailable: 'Copy is unavailable in this browser.', unreachable: 'The target cannot be reached with these inputs.', horizonCapped: 'The target was not reached within 100 years. Projected balance at the cap:' , alreadyReached: 'Your starting balance is projected to meet the target without additional deposits.' },
  additionalFaqs: [
    { question: 'Does this calculator guarantee the savings target?', answer: 'No. It is a mathematical estimate using a fixed monthly rate and regular deposits. Rates, fees, taxes, timing and account terms can change the outcome.' },
    { question: 'Does it convert currencies?', answer: 'No. Enter the target, balance and deposit in the same currency. The calculator does not fetch exchange rates.' },
  ],
  localizationStatus: 'approved',
});

export const effectiveInterestRateCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Effective Interest Rate Calculator',
  title: 'APR to APY Calculator — Free & Unlimited | UsefulVerse',
  description: 'Convert nominal APR to effective APY or back for monthly, daily and other compounding frequencies. Free, local and unlimited.',
  intro: 'Compare a nominal annual rate (APR) with the effective annual rate (APY). Choose a compounding schedule, convert in either direction and see the periodic rate when applicable.',
  howQuestion: 'How do I convert APR to APY?',
  howAnswer: 'For periodic compounding, APY = (1 + APR ÷ m)^m − 1, where m is the number of compounding periods per year. To convert APY back to nominal APR, use APR = m × ((1 + APY)^(1/m) − 1). Continuous compounding uses APY = e^APR − 1. Enter rates as percentages; for example, 12 means 12%.',
  privacyQuestion: 'Are my rates uploaded?',
  privacyAnswer: 'No. The conversion runs in this browser. Values are not uploaded or saved by this tool.',
  fields: {
    mode: 'Conversion', aprToApy: 'Nominal APR to effective APY', apyToApr: 'Effective APY to nominal APR', rate: 'Annual rate (%)', frequency: 'Compounding frequency',
    annual: 'Annually (1 per year)', semiannual: 'Semiannually (2 per year)', quarterly: 'Quarterly (4 per year)', monthly: 'Monthly (12 per year)', twiceMonthly: 'Twice monthly (24 per year)', biweekly: 'Biweekly (26 per year)', weekly: 'Weekly (52 per year)', daily: 'Daily (365 per year)', continuous: 'Continuously',
    accuracyNote: 'Enter a rate from 0 to 1,000,000%. This is a mathematical rate conversion, not a lender’s legal APR disclosure or financial advice. Actual fees, payment timing, taxes and account terms can change the rate shown by a financial provider.',
  },
  actions: { calculate: 'Convert rate', reset: 'Reset', copy: 'Copy results', example: 'Try 12% APR monthly', result: 'Rate conversion' },
  messages: {
    calculated: 'Rate conversion complete.', exampleLoaded: 'Example loaded: 12% nominal APR, compounded monthly.', checkInputs: 'Enter a supported rate, conversion direction and compounding frequency.', copied: 'Results copied.', copyUnavailable: 'Copy is not available in this browser.',
    apr: 'Nominal annual rate (APR)', apy: 'Effective annual rate (APY)', periodicRate: 'Rate per compounding period', formula: 'Formula', compounding: 'Compounding frequency',
  },
  additionalFaqs: [
    { question: 'What APY is equivalent to 12% APR compounded monthly?', answer: 'The effective APY is about 12.6825%. Each monthly period is 1%, and those monthly gains compound over the year.' },
    { question: 'Is this the same as the APR disclosed by a bank or lender?', answer: 'Not necessarily. This tool converts a user-entered nominal annual rate using a selected compounding frequency. Legal APR disclosures may include fees, payment schedules or rules that this mathematical conversion does not model.' },
  ],
});

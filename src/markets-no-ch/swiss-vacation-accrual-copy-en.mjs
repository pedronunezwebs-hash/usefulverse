export const swissVacationAccrualEnglish = Object.freeze({
  name: 'Swiss Vacation Accrual Estimator',
  title: 'Swiss Vacation Accrual Calculator — Prorated Leave Balance',
  description: 'Estimate a Swiss vacation-day balance from the annual leave in your contract, workweek, employment dates and days already taken.',
  intro: 'Estimate prorated paid leave for one calendar year using the entitlement and work schedule you enter. No contract terms are guessed.',
  details: 'The estimator prorates the annual leave days in your contract by calendar days employed in the selected year. For part-time work, enter your usual working days per week and the annual leave in weeks.',
  exampleHeading: 'Example', example: 'With four weeks of leave, a five-day workweek and employment throughout the year, the annual entitlement is 20 working days before subtracting leave already taken.',
  howItWorks: 'How the estimate works', faqHeading: 'Common questions', limitsHeading: 'Scope and exclusions', related: 'Related tools',
  faq: [
    { q: 'What is the Swiss statutory minimum?', a: 'Federal guidance states at least four weeks per service year, and five weeks for workers who have not reached age 20. A contract or collective agreement may grant more.' },
    { q: 'Does this decide my legal balance?', a: 'No. It is a simple calendar-day proration. Contract terms, applicable collective rules, qualifying absences, rounding and employer records can change the balance.' },
  ],
  limits: 'This estimate does not decide a legal entitlement or calculate holiday pay. It excludes reductions for certain prolonged absences, contract-specific accrual and rounding rules, public holidays, overtime, carry-over deadlines and disputes. Check your contract and obtain advice for a contested balance.',
  fields: {
    year: 'Leave year', weeks: 'Annual leave in your contract (weeks)', workdays: 'Usual working days per week', start: 'Employment start date', end: 'Employment end date', taken: 'Leave days already taken in this leave year',
    note: 'For orientation only. Enter the contractual annual entitlement; the legal minimum is generally four weeks, or five weeks for workers under 20.',
    calculate: 'Estimate balance', clear: 'Clear', ready: 'Enter your contract and dates to estimate a balance.', resultHeading: 'Estimated leave balance', annualDays: 'Annual leave at this schedule', employedDays: 'Calendar days employed in this leave year', earned: 'Prorated days accrued', takenResult: 'Days already taken', remaining: 'Estimated days remaining',
    explanation: 'This prorates annual leave by calendar days in the employment period. Employer and contract rules may differ.',
  },
  messages: { done: 'Estimate calculated. Check it against your contract and employer records.', cleared: 'Entries cleared.', invalid: 'Check the year, dates, work schedule and values.' },
});

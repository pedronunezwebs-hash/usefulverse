export const fourOhOneKCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: '401(k) Calculator',
  title: '401(k) Calculator Free | UsefulVerse',
  description: 'Estimate 401(k) contributions, employer match, vesting and a savings scenario. Free, local, no account.',
  intro: 'Estimate how your contribution and an employer match could add up over time. Enter the terms from your plan; this simple scenario is not a forecast.',
  howQuestion: 'How does this 401(k) calculator estimate the match?',
  howAnswer: 'It applies your match rate to the smaller of your contribution percentage and the eligible salary percentage you enter. It then projects monthly deposits using your assumed annual return.',
  privacyQuestion: 'Are my salary and savings uploaded?',
  privacyAnswer: 'No. The estimate runs in this browser; the tool does not upload or save your inputs.',
  fields: {
    annualSalary: 'Annual salary (one currency unit)', currentBalance: 'Current 401(k) balance', employeeContributionPercent: 'Your contribution (%)', employerMatchPercent: 'Employer match rate (%)', matchLimitPercent: 'Salary percentage eligible for match (%)', vestingPercent: 'Vested share of employer match (%)', years: 'Years to project', annualReturnPercent: 'Assumed annual return (%)',
    assumptionsNote: 'Your salary stays constant. Deposits are added monthly at month-end. The opening balance is treated as fully vested, and one vesting percentage is applied to all future employer matches. This does not apply IRS limits, fees, tax rules, eligibility rules or your plan’s full vesting schedule. Check your plan documents. Results are educational estimates, not financial or investment advice.',
    resultTitle: 'Illustrative estimate', annualEmployeeContribution: 'Your estimated annual contribution', annualEmployerMatch: 'Estimated annual employer match', annualVestedMatch: 'Vested share of annual match', totalAnnualContribution: 'Total estimated annual deposits', projectedBalance: 'Projected account balance', projectedVestedBalance: 'Projected vested balance', year: 'Year-end checkpoints',
  },
  actions: { calculate: 'Calculate estimate', example: 'Use example', reset: 'Reset', result: 'Estimate results' },
  messages: { calculated: 'Estimate calculated in this browser.', invalid: 'Check that every amount and percentage is within the stated range.' },
  additionalFaqs: [
    { question: 'How is an employer match calculated?', answer: 'The estimate uses the match rate and eligible salary percentage that you enter. For example, a 50% match on a $4,000 eligible contribution is $2,000. Your plan may use different rules.' },
    { question: 'Does this check current 401(k) contribution limits?', answer: 'No. Contribution limits and plan rules can change. This calculator does not check IRS limits, tax treatment or eligibility. Review current official guidance and your plan documents.' },
    { question: 'Is the projected balance guaranteed?', answer: 'No. Returns are assumptions, not predictions. Actual investments can rise or fall, and fees, taxes, timing and plan rules affect results.' },
  ],
});

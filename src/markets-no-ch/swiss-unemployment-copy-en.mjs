export const swissUnemploymentEnglish = Object.freeze({
  name: 'Swiss Unemployment Benefit Estimator',
  title: 'Swiss Unemployment Benefits Calculator — Daily Allowance Scenario',
  description: 'Estimate a gross Swiss unemployment daily allowance from the insured monthly salary and replacement rate confirmed by your unemployment insurance fund.',
  intro: 'Enter the insured salary shown by your fund and select 70% or 80% only if that rate applies to you. This is a gross scenario, not an eligibility decision.',
  details: 'Swiss unemployment insurance calculates a daily allowance from the insured salary. The rate is generally 70%, or 80% when a statutory condition applies. Monthly payments vary with 20 to 23 payable weekdays.',
  exampleHeading: 'Example', example: 'At an insured salary of CHF 5,000 per month and a confirmed rate of 70%, the gross daily scenario is about CHF 161.29, before deductions.',
  howItWorks: 'How the estimate works', faqHeading: 'Common questions', limitsHeading: 'Scope and exclusions', related: 'Related tools',
  faq: [
    { q: 'When does the 80% rate apply?', a: 'The official conditions include maintenance obligations for children under 25, insured salary up to CHF 3,797, or an IV disability benefit at a degree of at least 40%. Confirm your rate with your fund.' },
    { q: 'Does this determine how long I can receive benefits?', a: 'No. The maximum number of daily allowances depends on contribution period, age and personal circumstances and is decided by the implementing authority.' },
  ],
  limits: 'This is a gross rate scenario only. It does not decide eligibility, contribution periods, waiting or suspension days, exempt-person flat rates, child allowances, cross-border rules, deductions, withholding tax or entitlement duration. Use the salary and rate from your unemployment fund and check its statement.',
  fields: { salary: 'Monthly insured salary confirmed by your fund (CHF)', rate: 'Replacement rate confirmed for your case', rate70: '70% — standard scenario', rate80: '80% — only if a statutory condition applies', note: 'The statutory ceiling is CHF 12,350 per month. If you enter more, the estimate uses that maximum.', calculate: 'Estimate gross allowance', clear: 'Clear', ready: 'Enter the insured salary and applicable rate.', resultHeading: 'Gross daily allowance scenario', insured: 'Insured monthly salary used', daily: 'Estimated allowance per payable weekday', monthlyRange: 'Monthly gross range (20–23 weekdays)', monthlyTypical: 'Average-month illustration (21.7 weekdays)', cap: 'The insured salary was limited to the statutory CHF 12,350 monthly ceiling.' },
  messages: { done: 'Estimate complete. The unemployment fund determines your actual payment.', cleared: 'Entries cleared.', invalid: 'Check the salary and replacement rate.' },
});

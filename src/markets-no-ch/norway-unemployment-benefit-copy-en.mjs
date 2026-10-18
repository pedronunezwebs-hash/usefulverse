export const norwayUnemploymentBenefitEnglish = Object.freeze({
  name: 'Norway Unemployment Benefit Estimator',
  title: 'Norway Unemployment Benefit Estimate 2026 — Dagpenger',
  description: 'Estimate a dated Norwegian unemployment-benefit scenario from separate NAV income bases, lost working hours, the 6G cap and child supplement.',
  intro: 'Enter the income NAV uses for eligibility, benefit amount and duration separately. This is a private estimate; NAV decides applications and current eligibility.',
  example: 'Example: with a NOK 500,000 annual benefit basis and full loss of working hours, the simplified gross estimate is about NOK 120,000 per year before tax and individual adjustments.',
  details: 'The scenario applies 2026 reference rates to the supplied benefit basis, caps that basis at 6G, and shows an estimated daily, weekly and monthly amount. The three income periods are separate because eligibility, amount and duration can use different bases. A child supplement is shown separately. The estimate does not model tax withholding or case-specific NAV adjustments.',
  limits: 'Norway only. Rules and amounts are dated 2026 and must be checked against NAV before use. This does not decide eligibility or reproduce NAV’s official calculator. Residence, insurance, real job-seeker status, previous benefits, cross-border work, fisheries, partial claims and other special rules require an individual NAV assessment. Enter income values using the same definition and period NAV asks for. Results are gross estimates before tax.',
  exampleHeading: 'Example', howItWorks: 'How the estimate works', faqHeading: 'Common questions', limitsHeading: 'Rules and limits', related: 'Related tools', home: 'Home', siteName: 'UsefulVerse', language: 'Language', freeBadge: 'Free browser tool', useTool: 'Estimate a scenario',
  faq: [
    { q: 'Is this an official NAV decision?', a: 'No. NAV reviews your application and decides whether you qualify and what amount applies.' },
    { q: 'Why are there three income sections?', a: 'The minimum-income eligibility test, benefit amount and benefit duration can use different periods. Enter each independently; do not copy one figure into all three unless it matches your records.' },
    { q: 'Does language change the country rules?', a: 'No. The page is translated, but the rules and NOK amounts remain specific to Norway.' },
    { q: 'Are the figures net of tax?', a: 'No. These are gross estimates before tax and other case-specific deductions.' },
  ],
  fields: {
    scope: 'Norway only · standard 2026 rules · basic amount effective 1 May 2026 · amounts are gross estimates and not an eligibility decision.',
    minimumHeading: 'Income used for the minimum-income eligibility check', benefitHeading: 'Income used for the benefit amount', durationHeading: 'Income used for the benefit duration',
    last12: 'Income over the last 12 months · NOK', last36: 'Income over the last 36 months · NOK',
    lostHours: 'Normal working hours lost · percent', children: 'Eligible children for supplement', under67: 'Under age 67', residence: 'Norwegian residence and insurance conditions appear to apply', jobSeeker: 'Registered and genuinely seeking work', military: 'Recently discharged from military service', serviceMonths: 'Military service duration · months',
    calculate: 'Estimate benefits', clear: 'Clear entries', ready: 'Enter the three separate NAV income bases to see a scenario.', resultHeading: 'Estimated gross scenario', daily: 'Estimated per day', weekly: 'Estimated per week', monthly: 'Monthly equivalent', annual: 'Annual equivalent', childDaily: 'Child supplement per day', basis: 'Selected benefit basis', cap: '6G maximum benefit basis', duration: 'Possible standard duration', deductible: 'Illustrative first-payment deduction', threshold: 'Minimum-income threshold met from entered values', conditions: 'Self-reported conditions to review', rateNote: 'Static standard 2026 values; confirm current rules with NAV before relying on them.',
    sourceNav: 'NAV · unemployment benefit guidance', sourceCalculator: 'NAV · official calculator', sourceG: 'NAV · current basic amount', sourceLink: 'Check current NAV guidance and use the official calculator', error: 'Check that all income, working-hour, child and service entries are valid.', notDecision: 'This scenario does not decide eligibility. NAV makes the official assessment.', yes: 'Yes', no: 'No', weeks: 'weeks',
  },
});

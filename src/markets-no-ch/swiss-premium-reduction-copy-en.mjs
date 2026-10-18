export const swissPremiumReductionEnglish = Object.freeze({
  name: 'Swiss Health Premium Reduction Calculator',
  title: 'Swiss Premium Subsidy Calculator — Your Net Premium',
  description: 'Calculate the net Swiss health-insurance premium from the current premium and a monthly reduction already granted by your canton.',
  intro: 'Enter the premium and confirmed monthly reduction from your insurer or cantonal decision. This tool does not decide whether you qualify.',
  details: 'Swiss cantons determine who qualifies, how much support is granted and whether an application is needed. This calculator only subtracts a confirmed monthly reduction from one policy premium and shows the annual amount.',
  exampleHeading: 'Example', example: 'If the monthly premium is CHF 420 and the confirmed reduction is CHF 120, the estimated net premium is CHF 300 per month.',
  howItWorks: 'How the calculation works', faqHeading: 'Common questions', limitsHeading: 'Scope and exclusions', related: 'Related tools',
  faq: [
    { q: 'Does this tell me whether I qualify?', a: 'No. Eligibility and award amounts are decided by the canton of residence. Use the linked official information or contact the cantonal office.' },
    { q: 'Where do I find the reduction amount?', a: 'Use the current decision or the reduced premium shown by your insurer. Some cantons grant reductions automatically; others require an application.' },
  ],
  limits: 'This is arithmetic for one policy, not an eligibility or benefit decision. It does not calculate household income, assets, family status, deadlines, cantonal thresholds or application rights. Premiums and awards can change; confirm them with your insurer and canton.',
  fields: { premium: 'Current monthly premium (CHF)', reduction: 'Monthly reduction already granted (CHF)', note: 'Enter an amount confirmed by the canton or insurer; do not use an estimate as an award.', calculate: 'Calculate net premium', clear: 'Clear', ready: 'Enter the current premium and confirmed reduction.', resultHeading: 'Estimated premium after reduction', gross: 'Current monthly premium', reductionValue: 'Monthly reduction', net: 'Estimated net monthly premium', annual: 'Reduction over 12 months', percent: 'Reduction as a share of premium' },
  messages: { done: 'Calculation complete. Confirm the award and effective dates with your canton and insurer.', cleared: 'Entries cleared.', invalid: 'Check that the reduction is not greater than the monthly premium.' },
});

export const severancePayCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Severance Pay Calculator',
  title: 'Severance Pay Calculator Free | UsefulVerse',
  description: 'Estimate severance with your assumptions or a Great Britain statutory redundancy estimate. Free, no account.',
  intro: 'Use your own weekly-pay assumptions, or switch to a separate Great Britain statutory redundancy estimate with its date and limits shown.',
  howQuestion: 'How do I estimate severance pay?',
  howAnswer: 'Choose custom assumptions or the Great Britain statutory mode. Custom mode multiplies weekly pay by service years and weeks per year. Great Britain mode uses your birth date, employment start date, redundancy date and average weekly pay to estimate statutory redundancy pay only.',
  privacyQuestion: 'Are my employment details uploaded?',
  privacyAnswer: 'No. The calculation runs in this browser and does not send or store your dates or pay details.',
  fields: {
    mode: 'Calculation type', weeklyPay: 'Average gross weekly pay (GBP in Great Britain mode)', yearsOfService: 'Years of service', weeksPerYear: 'Weeks of pay per service year', birthDate: 'Date of birth', employmentStartDate: 'Employment start date', redundancyDate: 'Employment end date used for this estimate', accuracyNote: 'Estimate only, not legal, tax, employment or financial advice. Actual rights depend on your contract, circumstances and local law. Your statutory relevant date can differ from the date entered, for example because of notice rules.', customNote: 'Custom mode uses your assumptions and does not apply a country’s legal formula. Keep pay and the estimate in the same currency.', ukNote: 'Great Britain mode covers England, Scotland and Wales, not Northern Ireland. Use average weekly pay from the 12 weeks before redundancy notice and enter it in GBP. This simplified estimate only covers employment end dates from 6 April 2026; it counts full service years backwards from the date entered and applies the £751 weekly-pay cap, up to 20 service years and the age bands described by GOV.UK. Notice rules or other circumstances can change the statutory relevant date. Check official guidance for eligibility and current rules.', officialSource: 'Read official GOV.UK redundancy pay guidance', estimate: 'Estimated severance (same currency as input; GBP in Great Britain mode)', appliedWeeklyPay: 'Weekly pay used (GBP in Great Britain mode)', yearsOfService: 'Completed service years', totalWeeks: 'Weeks of pay', resultSummary: 'Estimate details', rulesAsOf: 'Great Britain rule set from',
  },
  actions: { calculate: 'Calculate estimate', example: 'Load example', copy: 'Copy estimate', reset: 'Clear', customMode: 'Custom assumptions', ukMode: 'Great Britain statutory estimate' },
  messages: { calculated: 'Estimate ready.', checkInputs: 'Check the dates and amounts.', calculationFailed: 'Could not calculate this estimate.', exampleLoaded: 'Custom example loaded.', calculateFirst: 'Calculate an estimate first.', copied: 'Estimate copied.', copyUnavailable: 'Copy is unavailable in this browser.', belowServiceMinimum: 'This scenario has fewer than two completed service years; the standard UK statutory minimum is not met.', capApplied: 'One or more statutory caps were applied.', noCapApplied: 'No weekly-pay cap was needed for these inputs.', customAssumptions: 'Calculated only from the custom assumptions you entered.' },
  additionalFaqs: [
    { question: 'Does the Great Britain estimate decide if I qualify?', answer: 'No. It only applies a simplified statutory calculation to the entered dates and weekly pay. Worker status, continuity, exceptions, contract terms and other facts can change entitlement; Northern Ireland has different rules.' },
    { question: 'Does custom mode use the same formula in every country?', answer: 'No. Custom mode is only arithmetic using the weeks-per-year assumption you provide. Employment laws and contractual packages differ by location.' },
  ],
  localizationStatus: 'approved',
});

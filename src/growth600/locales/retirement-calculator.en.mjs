export const retirementCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Retirement Calculator',
  title: 'Retirement Calculator Free | UsefulVerse',
  description: 'Project retirement savings and withdrawals with base and conservative return assumptions. See inflation-adjusted value. Free, local, no account.',
  intro: 'Model how current savings and monthly contributions may grow before retirement, then compare inflation-adjusted withdrawals through a planning age. Every rate is your assumption; results are not a forecast.',
  howQuestion: 'How does this retirement calculator estimate future savings?',
  howAnswer: 'It compounds an assumed annual return monthly, adds each monthly contribution at month-end until retirement, then models an annual withdrawal that increases yearly by your inflation assumption. The base and conservative scenarios use separate return assumptions.',
  privacyQuestion: 'Are my financial inputs uploaded or saved?',
  privacyAnswer: 'No. The projection runs in this browser. Inputs are not uploaded or stored by this tool.',
  fields: {
    currentAge: 'Current age', retirementAge: 'Retirement age', planThroughAge: 'Plan through age', currentSavings: 'Current retirement savings', monthlyContribution: 'Monthly contribution until retirement',
    annualReturnPercent: 'Base annual return assumption (%)', conservativeReturnPercent: 'Conservative annual return assumption (%)', annualWithdrawal: 'First annual retirement withdrawal', annualInflationPercent: 'Annual inflation assumption (%)',
    assumptionsNote: 'Enter amounts in one currency unit; no conversion is performed. Contributions are added at each month end. Withdrawals begin at retirement and rise once per year by your inflation assumption. Both return rates stay constant in the model. Taxes, fees, pensions, benefits, market volatility and contribution increases are excluded. Use these scenarios for planning, not as a guaranteed forecast or personal financial advice.',
    resultsTitle: 'Scenario comparison', measure: 'Estimate', scenarioBase: 'Base return', scenarioConservative: 'Conservative return', totalContributions: 'Total savings plus contributions', balanceAtRetirement: 'Projected balance at retirement', balanceAtRetirementToday: 'Retirement balance in today’s purchasing power', endingBalance: 'Estimated balance at planning age', depletionAge: 'Estimated age funds run out', noDepletion: 'No modeled withdrawal depleted the balance by the selected planning age',
  },
  actions: { calculate: 'Calculate scenarios', example: 'Use example', reset: 'Reset', result: 'Projection results' },
  messages: { calculated: 'Scenarios calculated in this browser.', invalid: 'Check that ages, amounts and assumptions are within the stated ranges.', depletion: 'At this assumed withdrawal, the projected balance reaches zero around age {age}.', noDepletion: 'Under these assumptions, the balance remains above zero through age {age}.' },
  additionalFaqs: [
    { question: 'What does the conservative scenario mean?', answer: 'It repeats the same contribution, withdrawal and inflation assumptions using the lower annual return you enter. It is a comparison scenario, not a probability, guarantee or worst-case market simulation.' },
    { question: 'Does this include Social Security, pensions or taxes?', answer: 'No. It models only the savings, contributions, returns, inflation and withdrawals entered here. Add other income or costs separately; tax rules and benefits depend on location and personal circumstances.' },
    { question: 'Are the projected returns guaranteed?', answer: 'No. A constant return assumption simplifies the math and does not represent variable markets, investment risk or future results. The calculator is educational and is not financial, tax or investment advice.' },
  ],
});

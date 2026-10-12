export const inflationCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Inflation Calculator',
  title: 'Inflation Calculator Free | UsefulVerse',
  description: 'Compare historical U.S. prices with CPI-U or model a custom inflation rate. See adjusted value and cumulative change. Free, local, no upload.',
  intro: 'Estimate how a price level changes between years with U.S. CPI-U annual averages, or enter your own annual rate for another market. Calculations stay in this browser.',
  howQuestion: 'How do I calculate inflation between two years?',
  howAnswer: 'Enter an amount and two years. The U.S. mode multiplies it by the later annual CPI-U index divided by the earlier index. Use the custom-rate mode when you want to model an assumed annual rate instead.',
  privacyQuestion: 'Is my amount or rate uploaded?',
  privacyAnswer: 'No. The amount, years and rate are calculated in this browser and are not uploaded or saved by the tool.',
  fields: {
    mode: 'Calculation method', usCpiMode: 'U.S. CPI-U annual average', customMode: 'Custom annual rate', amount: 'Amount at the start', amountHint: 'Use the same currency unit for your amount; this tool does not convert currencies.',
    startYear: 'Start year', endYear: 'End year', annualRatePercent: 'Assumed annual inflation rate (%)', years: 'Number of years',
    accuracyNote: 'U.S. mode uses annual-average CPI-U for all items, U.S. city average, from 1913–2025. It is a broad historical estimate, not your personal basket or a live forecast. Other markets require your own assumed rate. Use a computer or larger screen if helpful; this lightweight calculator needs no model download.',
    resultSummary: 'Estimate', adjustedAmount: 'Equivalent amount at the end', cumulativeChange: 'Cumulative price-level change', annualizedRate: 'Equivalent annual rate',
    sourceNote: 'U.S. annual CPI-U source and methodology:',
  },
  actions: { calculate: 'Calculate', reset: 'Reset', example: 'Use example', result: 'Estimate' },
  messages: {
    calculated: 'Inflation estimate calculated locally.', invalid: 'Check the amount, selected years and rate limits.',
    cpiSummary: 'Annual-average U.S. CPI-U comparison from {start} to {end}.',
    customSummary: 'Illustrative compounding at your entered rate for {years} years; not an official CPI series.',
  },
  additionalFaqs: [
    { question: 'Which U.S. inflation data does this calculator use?', answer: 'It uses the BLS Consumer Price Index for All Urban Consumers (CPI-U), U.S. city average, all items, annual-average index values from 1913 through 2025. Annual averages can differ from a particular month or household experience.' },
    { question: 'Can I use this for another country?', answer: 'Yes, select Custom annual rate and enter an assumed rate and duration. That is a scenario, not an official inflation measure for that country; use a local statistics agency index for a data-based comparison.' },
    { question: 'Does the result include investment returns or currency conversion?', answer: 'No. It compares price levels only. It does not include interest, investment returns, exchange rates, taxes, fees or a personal spending basket.' },
  ],
});

export const heatPumpCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Heat Pump Calculator',
  title: 'Heat Pump Calculator Free & Unlimited | UsefulVerse',
  description: 'Free, unlimited heat-pump energy and running-cost estimate from heat output, COP, hours and your electricity rate. No account.',
  intro: 'Estimate electricity use and running cost for free from a heat-output rate, coefficient of performance (COP), operating hours and your tariff.',
  howQuestion: 'How much electricity does a heat pump use?',
  howAnswer: 'Divide the heat output rate by COP to estimate electrical input power. Multiply by operating hours to estimate energy. For example, 10 kW of heat at COP 5 needs 2 kW of electrical input, or 2 kWh for one hour.',
  privacyQuestion: 'Are my energy details uploaded?',
  privacyAnswer: 'No. This estimate runs in your browser. The heat output, COP, hours and tariff you enter are not sent to a server or saved by this tool.',
  fields: {
    heatOutput: 'Heat-output rate', heatOutputUnit: 'Heat-output unit', cop: 'Coefficient of performance (COP)',
    electricityRatePerKwh: 'Electricity price per kWh', hoursPerDay: 'Operating hours per day', currency: 'Three-letter currency code',
    accuracyNote: 'Estimate only. COP changes with weather, system design, flow temperature, cycling and maintenance. The comparison assumes an idealized resistance heater at COP 1. Monthly figures assume 30 identical days. Enter a current tariff and measured or manufacturer COP; taxes, fixed charges and seasonal performance are not included. This is not equipment sizing or purchase advice.',
  },
  actions: { calculate: 'Estimate energy and cost', reset: 'Reset', copy: 'Copy estimate', example: 'Try an example', result: 'Estimated use and cost', kilowatts: 'Kilowatts (kW)', btuPerHour: 'BTU per hour (BTU/h)' },
  messages: { copied: 'Estimate copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Heat-pump estimate ready.', checkInputs: 'Check heat output, COP, electricity rate, operating hours and currency code.', heatOutputKw: 'Heat-output rate', electricalInput: 'Estimated electrical input power', dailyEnergy: 'Heat-pump electricity per day', monthlyEnergy: 'Heat-pump electricity per 30 days', dailyCost: 'Heat-pump cost per day', monthlyCost: 'Heat-pump cost per 30 days', resistanceDailyEnergy: 'Resistance-heater baseline energy per day (COP 1)', resistanceDailyCost: 'Resistance-heater baseline cost per day', dailyEnergyDifference: 'Estimated daily energy saved vs COP 1 baseline', dailyCostDifference: 'Estimated daily cost difference vs COP 1 baseline' },
  additionalFaqs: [
    { question: 'What does COP mean?', answer: 'COP is the ratio of heat delivered to electrical energy used over a stated operating condition. Use a measured or manufacturer value appropriate to the conditions; it is not constant across weather and systems.' },
    { question: 'Does this predict my monthly bill?', answer: 'No. The 30-day estimate assumes the same heat-output rate, COP, hours and energy tariff every day. It excludes seasonal variation, fixed charges, taxes, other household use and utility billing rules.' },
  ],
});

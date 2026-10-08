export const evChargingCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'EV Charging Calculator',
  title: 'EV Charging Calculator Free | UsefulVerse',
  description: 'Estimate EV charge time, grid energy and optional charging cost from battery size, charge level and charger power. Free calculator.',
  intro: 'Estimate energy, time and optional electricity cost for an electric-car charge. Set battery capacity, starting and target charge, charger input power and an efficiency assumption.',
  howQuestion: 'How do you estimate EV charging time?',
  howAnswer: 'Calculate the battery energy between the starting and target charge percentages, divide by charging efficiency to estimate energy from the grid, then divide by charger input power. For a 50 kWh pack from 20% to 80%, 30 kWh reaches the battery; at 90% efficiency, about 33.33 kWh comes from the grid.',
  privacyQuestion: 'Are my vehicle or electricity details uploaded?',
  privacyAnswer: 'No. This estimate runs locally in your browser. Your inputs are not sent to a server or saved by this tool.',
  fields: {
    batteryCapacityKwh: 'Usable battery capacity (kWh)', startSocPercent: 'Starting charge (%)', targetSocPercent: 'Target charge (%)', chargerPowerKw: 'Charger input power (kW)', efficiencyPercent: 'Charging efficiency assumption (%)', electricityRatePerKwh: 'Electricity price per kWh (optional)', currency: 'Currency code for optional cost (for example USD)',
    accuracyNote: 'Constant-power estimate only; real vehicles often slow charging as the battery fills. Vehicle and charger limits, temperature, battery conditioning, shared power and tariff rules change real results. Check your vehicle and charger documentation. This tool does not size or install electrical equipment.',
  },
  actions: { calculate: 'Estimate charging', reset: 'Reset', copy: 'Copy estimate', example: 'Try an example', result: 'Estimated charge', kwh: 'Kilowatt-hours (kWh)', kw: 'Kilowatts (kW)', percent: 'Percent (%)' },
  messages: {
    copied: 'Estimate copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Charging estimate ready.', checkInputs: 'Check battery size, charge levels, charger power, efficiency and optional rate.',
    batteryEnergy: 'Energy added to battery', gridEnergy: 'Estimated energy from grid', chargingTime: 'Estimated constant-power time', estimatedCost: 'Estimated electricity cost',
  },
  additionalFaqs: [
    { question: 'Why is the estimate different from my car display?', answer: 'This model assumes constant input power and one efficiency value. Many vehicles taper power as the battery fills, and temperature, battery conditioning, charger limits and shared circuits also affect actual time.' },
    { question: 'How is the optional charging cost calculated?', answer: 'The estimate multiplies grid energy by the electricity rate you enter. It excludes time-of-use periods, taxes, session fees, subscriptions and other tariff rules.' },
  ],
});

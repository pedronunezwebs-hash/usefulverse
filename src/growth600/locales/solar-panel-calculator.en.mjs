export const solarPanelCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Solar panel calculator',
  title: 'Solar panel calculator free & unlimited | UsefulVerse',
  description: 'Estimate solar panel count, energy output, roof area, bill offset and simple payback. Free, unlimited and calculated in your browser.',
  intro: 'Estimate energy from a solar array or the panel count for a daily energy target. Enter your own sunlight, system-loss and price assumptions.',
  howQuestion: 'How do I estimate solar panel output?',
  howAnswer: 'Multiply system capacity in kilowatts by peak sun hours and the share remaining after losses. Monthly output uses 365 days divided by 12; yearly output uses 365 days. Peak sun hours and losses are estimates you provide.',
  privacyQuestion: 'Are my energy details uploaded?',
  privacyAnswer: 'No. The calculation runs in your browser. Your energy use, prices and system assumptions are not sent to a server or saved by this tool.',
  fields: {
    mode: 'What do you want to estimate?', dailyTargetKwh: 'Daily electricity use or target (kWh)', panelCount: 'Number of solar panels',
    panelWatts: 'Rated power per panel (W)', peakSunHours: 'Peak sun hours per day', lossPercent: 'Estimated system losses (%)',
    panelLengthM: 'Panel length (m, optional)', panelWidthM: 'Panel width (m, optional)',
    electricityRate: 'Electricity price per kWh (optional)', systemCost: 'Installed system cost (optional)', currency: 'Currency',
    assumptionNote: 'Use a local annual-average peak-sun-hours estimate if available. Panel dimensions must both be entered to estimate area. Prices are your own inputs.',
    accuracyNote: 'Planning estimate only, not a production guarantee or system design. Output changes with season, local weather, shade, orientation, temperature and equipment. Savings assume every generated kWh offsets a purchased kWh at your entered rate; actual self-use, export credits, utility fees, incentives, maintenance and financing may change the result. Check local conditions and electrical requirements with a qualified solar professional.',
  },
  actions: {
    calculate: 'Calculate estimate', reset: 'Reset', copy: 'Copy result', example: 'Try example', result: 'Solar estimate',
    productionMode: 'Estimate output from panel count', sizingMode: 'Estimate panel count for daily use', years: 'years',
  },
  messages: {
    copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate ready.',
    checkInputs: 'Check the panel mode, power, sunlight, losses, optional dimensions and prices.',
    panelCount: 'Solar panels needed', systemSize: 'Array capacity', dailyProduction: 'Estimated daily energy',
    monthlyProduction: 'Estimated monthly energy', annualProduction: 'Estimated yearly energy', panelArea: 'Total panel area',
    annualSavings: 'Potential yearly bill offset', simplePayback: 'Simple payback', paybackUnavailable: 'Not estimated without a positive yearly bill offset.',
  },
  additionalFaqs: [
    { question: 'How many solar panels do I need for my daily use?', answer: 'Enter daily electricity use, panel wattage, peak sun hours and estimated system losses. The calculator rounds the panel count up. It does not account for hourly usage, seasonal production, battery sizing or grid rules.' },
    { question: 'Can I treat estimated solar savings as guaranteed?', answer: 'No. Savings are a simple scenario using your entered electricity price and assuming all generated energy offsets purchased power. Self-consumption, export rates, fixed utility fees, weather and installation costs can change actual savings and payback.' },
  ],
});

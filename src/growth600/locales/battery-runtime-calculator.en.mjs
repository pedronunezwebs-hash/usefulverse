export const batteryRuntimeCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Battery Runtime Calculator',
  title: 'Battery Runtime Calculator Free | UsefulVerse',
  description: 'Estimate battery runtime from Wh or Ah, load power, discharge depth and efficiency. Free browser calculator.',
  intro: 'Estimate how long a battery can supply a constant load. Enter its energy in Wh/kWh or capacity in Ah with voltage, then choose your own discharge and efficiency assumptions.',
  howQuestion: 'How do you calculate battery runtime?',
  howAnswer: 'Convert battery capacity to watt-hours, multiply by the depth-of-discharge and efficiency percentages, then divide usable watt-hours by the load in watts. For example, 100 Wh ÷ 10 W = 10 ideal hours before losses.',
  privacyQuestion: 'Are my battery or load values uploaded?',
  privacyAnswer: 'No. The calculation runs locally in your browser; inputs are not sent to a server or saved by this tool.',
  fields: {
    capacityMode: 'Battery capacity format', energyMode: 'Energy rating (Wh or kWh)', ampHourMode: 'Amp-hours (Ah) and voltage',
    capacityEnergy: 'Battery energy capacity', energyUnit: 'Energy unit', capacityAh: 'Battery capacity (Ah)', voltage: 'Battery voltage (V)',
    loadWatts: 'Constant load power (W)', depthOfDischargePercent: 'Depth of discharge you assume (%)', efficiencyPercent: 'System efficiency you assume (%)',
    accuracyNote: 'Idealized estimate, not a guaranteed runtime. Actual results vary with load changes, chemistry, discharge rate, temperature, battery age, voltage sag, inverter losses and cutoff behavior. Enter realistic depth-of-discharge and efficiency values from product documentation. Do not use this to size or install electrical systems; follow manufacturer instructions and local rules.',
  },
  actions: { calculate: 'Estimate runtime', reset: 'Reset', copy: 'Copy result', example: 'Try an example', result: 'Estimated battery runtime', wh: 'Watt-hours (Wh)', kwh: 'Kilowatt-hours (kWh)' },
  messages: {
    copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Runtime estimate ready.', checkInputs: 'Check battery capacity, units, voltage, load, discharge depth and efficiency.',
    nominalEnergy: 'Nominal battery energy', usableEnergy: 'Estimated usable energy', runtimeHours: 'Estimated runtime', runtimeDays: 'Equivalent days at this constant load',
  },
  additionalFaqs: [
    { question: 'How do I convert amp-hours to watt-hours?', answer: 'Multiply amp-hours by nominal voltage: Wh = Ah × V. This is an energy estimate; the usable amount depends on discharge limits and real system losses.' },
    { question: 'Will the battery last exactly this many hours?', answer: 'No. It is an idealized estimate for a constant load. Real runtime depends on battery chemistry, discharge rate, temperature, age, voltage sag, system losses and low-voltage cutoff.' },
  ],
});

export const heatLossCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Heat Loss Calculator',
  title: 'Heat Loss Calculator Free & Unlimited | UsefulVerse',
  description: 'Free, unlimited heat-loss estimate for walls, roof, windows, floor and ventilation. Runs in your browser with no account.',
  intro: 'Estimate steady-state heat loss by building component. Enter each area and U-value, the indoor–outdoor temperature difference, and an optional simplified ventilation estimate.',
  howQuestion: 'How do you calculate heat loss through a building component?',
  howAnswer: 'For transmission, multiply area by U-value and temperature difference: watts = m² × W/(m²·K) × K. A component with U = 1, area 10 m² and a 20 K difference contributes 200 W. Ventilation is estimated separately from room volume and air changes.',
  privacyQuestion: 'Are my room measurements uploaded?',
  privacyAnswer: 'No. This estimate runs locally in your browser; your inputs are not sent to a server or saved by this tool.',
  fields: {
    areaUnit: 'Area unit for all components', temperatureUnit: 'Temperature-difference unit', volumeUnit: 'Room volume unit', temperatureDifference: 'Indoor–outdoor temperature difference',
    wallArea: 'Wall area', wallUValue: 'Wall U-value (W/m²·K)', roofArea: 'Roof area', roofUValue: 'Roof U-value (W/m²·K)', windowArea: 'Window area', windowUValue: 'Window U-value (W/m²·K)', floorArea: 'Floor area', floorUValue: 'Floor U-value (W/m²·K)',
    roomVolume: 'Room volume for ventilation estimate', airChangesPerHour: 'Air changes per hour (ACH)', accuracyNote: 'Simplified steady-state estimate, not a heating-system size recommendation. Use U-values and air changes from reliable building data. This omits thermal bridges, solar/internal gains, moisture, wind, ducts and dynamic operation. Have a qualified energy professional review assumptions before making building or equipment decisions.',
  },
  actions: { calculate: 'Estimate heat loss', reset: 'Reset', copy: 'Copy estimate', example: 'Try an example', result: 'Estimated heat-loss rate', squareMeters: 'Square meters (m²)', squareFeet: 'Square feet (ft²)', cubicMeters: 'Cubic meters (m³)', cubicFeet: 'Cubic feet (ft³)', kelvin: 'Kelvin difference (K)', fahrenheit: 'Fahrenheit difference (°F)' },
  messages: { copied: 'Estimate copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Heat-loss estimate ready.', checkInputs: 'Check areas, U-values, temperature difference and ventilation entries.', wallLoss: 'Wall transmission', roofLoss: 'Roof transmission', windowLoss: 'Window transmission', floorLoss: 'Floor transmission', transmissionLoss: 'Total transmission', ventilationLoss: 'Ventilation estimate', totalLoss: 'Total estimated heat loss' },
  additionalFaqs: [
    { question: 'Is a temperature difference in Fahrenheit converted like a normal temperature?', answer: 'No. A Fahrenheit temperature difference is multiplied by 5/9 to convert to kelvin difference; an offset is not added.' },
    { question: 'Can I use this to choose a furnace or heat pump?', answer: 'No. It is a simplified component estimate and does not include all design conditions or local standards. Heating equipment selection needs a complete, qualified load assessment.' },
  ],
});

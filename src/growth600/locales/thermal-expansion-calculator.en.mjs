export const thermalExpansionCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Thermal Expansion Calculator',
  title: 'Thermal Expansion Calculator Free | UsefulVerse',
  description: 'Calculate linear, area or volume expansion from a dimension, coefficient and temperature change. Free, local and no account.',
  intro: 'Estimate how a length, area or volume changes when temperature changes. Enter a coefficient that matches the selected dimension and see the change and final size.',
  howQuestion: 'How do you calculate thermal expansion?',
  howAnswer: 'Multiply the starting dimension by its matching expansion coefficient and the temperature difference: change = coefficient × starting dimension × temperature change. The coefficient must match a linear, area or volume calculation.',
  privacyQuestion: 'Are my measurements uploaded?',
  privacyAnswer: 'No. This calculation runs in your browser. Your dimension, coefficient and temperature change are not uploaded or saved by this tool.',
  fields: {
    mode: 'Expansion type', linearMode: 'Linear (length)', areaMode: 'Area', volumeMode: 'Volume',
    initialDimension: 'Starting dimension', lengthUnit: 'Length unit', areaUnit: 'Area unit', volumeUnit: 'Volume unit',
    coefficient: 'Expansion coefficient for this type', coefficientTemperatureUnit: 'Coefficient is stated per',
    perCelsius: 'degree Celsius (°C)', perFahrenheit: 'degree Fahrenheit (°F)', perCelsiusShort: 'per °C', perFahrenheitShort: 'per °F',
    deltaTemperature: 'Temperature change (final − initial)', temperatureUnit: 'Temperature-difference unit', celsius: 'Celsius degrees (°C)', fahrenheit: 'Fahrenheit degrees (°F)',
    accuracyNote: 'Use a coefficient for the selected type (linear, area or volume); this tool does not convert one type into another or choose material data. It assumes uniform first-order expansion over the temperature range. Real materials may vary by temperature, direction, phase, moisture and constraints. Not engineering or safety advice.',
  },
  actions: {
    calculate: 'Calculate expansion', reset: 'Reset', copy: 'Copy results', example: 'Try an example', result: 'Expansion estimate',
    meters: 'Meters (m)', centimeters: 'Centimeters (cm)', millimeters: 'Millimeters (mm)', inches: 'Inches (in)', feet: 'Feet (ft)',
    squareMeters: 'Square meters (m²)', squareCentimeters: 'Square centimeters (cm²)', squareFeet: 'Square feet (ft²)', squareInches: 'Square inches (in²)',
    cubicMeters: 'Cubic meters (m³)', cubicCentimeters: 'Cubic centimeters (cm³)', liters: 'Liters (L)', cubicFeet: 'Cubic feet (ft³)', cubicInches: 'Cubic inches (in³)',
  },
  messages: {
    calculated: 'Expansion estimate ready.', checkInputs: 'Check the dimension, matching coefficient and temperature change.',
    copied: 'Results copied.', copyUnavailable: 'Copy is not available in this browser.', mode: 'Expansion type', initialDimension: 'Starting dimension', coefficient: 'Expansion coefficient', temperatureChange: 'Temperature change', dimensionChange: 'Dimension change', finalDimension: 'Final dimension', relativeChange: 'Relative change',
  },
  additionalFaqs: [
    { question: 'What is the difference between linear, area and volume expansion?', answer: 'They describe changes in length, surface area and volume. Each needs a coefficient for that same type; the calculator does not assume that an area coefficient is exactly twice a linear value or that a volume coefficient is exactly three times it.' },
    { question: 'Can I use a coefficient per Fahrenheit degree?', answer: 'Yes. Select whether the coefficient is per °C or per °F, then choose the unit for the temperature difference. The tool converts the difference and coefficient consistently.' },
    { question: 'Does this calculator know my material?', answer: 'No. Coefficients depend on the exact material and conditions. Enter a value from a suitable reference for the temperature range; this estimate is not engineering or safety advice.' },
  ],
});

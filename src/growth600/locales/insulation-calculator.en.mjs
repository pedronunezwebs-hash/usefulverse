export const insulationCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Insulation R-value calculator',
  title: 'Insulation R-Value Calculator Free & Unlimited | UsefulVerse',
  description: 'Add thermal resistance across insulation layers, quantities and R/RSI units. Free calculation in your browser.',
  intro: 'Add the thermal-resistance values shown for each material layer. The tool totals layers in series, accounts for repeated layers and converts R-value to RSI.',
  howQuestion: 'How do you calculate total insulation R-value?',
  howAnswer: 'For layers in series, multiply each layer value by its quantity and add the contributions. This calculator converts between US R-value and metric RSI and shows the reciprocal U-factor for reference.',
  privacyQuestion: 'Are my insulation values uploaded?',
  privacyAnswer: 'No. The calculation runs locally in your browser; entered layer names and values are not sent to a server or saved by this tool.',
  fields: {
    unit: 'Input resistance unit', layerName1: 'Layer 1 name (optional)', layerResistance1: 'Layer 1 resistance', layerQuantity1: 'Layer 1 quantity',
    layerName2: 'Layer 2 name (optional)', layerResistance2: 'Layer 2 resistance', layerQuantity2: 'Layer 2 quantity',
    layerName3: 'Layer 3 name (optional)', layerResistance3: 'Layer 3 resistance', layerQuantity3: 'Layer 3 quantity',
    layerName4: 'Layer 4 name (optional)', layerResistance4: 'Layer 4 resistance', layerQuantity4: 'Layer 4 quantity',
    accuracyNote: 'This is arithmetic for user-entered layer values in series. It does not estimate whole-wall performance, thermal bridges, air leakage, moisture, material properties, installation quality or code compliance. R and RSI depend on tested product data and assembly conditions. Use manufacturer documentation and local building requirements; consult a qualified professional for design. All calculations run locally in this browser.',
  },
  actions: { calculate: 'Add layer values', reset: 'Reset', copy: 'Copy result', example: 'Try R-2 + R-3', result: 'Layer resistance estimate', R: 'US R-value (ft²·°F·h/Btu)', RSI: 'Metric RSI (m²·K/W)' },
  messages: {
    copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate ready.', checkInputs: 'Enter at least one positive layer value and check each quantity.',
    layerTotal: 'Layers included', totalR: 'Total US thermal resistance', totalRsi: 'Total metric thermal resistance', uFactorUs: 'Reciprocal U-factor (US)', uFactorSi: 'Reciprocal U-factor (SI)',
  },
  additionalFaqs: [
    { question: 'Can I add R-values for layers in a wall?', answer: 'This calculator adds the values you provide as layers in series. It does not account for parallel paths such as studs, gaps or thermal bridges, so the sum is not necessarily the whole-wall effective R-value.' },
    { question: 'What is the difference between R-value and RSI?', answer: 'They both describe thermal resistance in different unit systems. This tool uses RSI = R × 0.1761 (approximately) and reports the reciprocal U-factor only as a unit conversion.' },
  ],
});

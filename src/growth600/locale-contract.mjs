export const REQUIRED_GROWTH_COPY = Object.freeze(['name', 'title', 'description', 'intro', 'howQuestion', 'howAnswer', 'privacyQuestion', 'privacyAnswer']);
export const REQUIRED_GROWTH_HOME_COPY = Object.freeze(['title', 'description', 'intro', 'directoryLabel', 'freeLabel', 'footerFree', 'skipToTool', 'home', 'languageLabel', 'breadcrumbLabel', 'faqLabel']);
export const REQUIRED_TOOL_MESSAGES = Object.freeze({
  'soil-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'volumePerContainer', 'totalVolume', 'orderVolume', 'bagsToBuy'],
  'gravel-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'area', 'volume', 'orderVolume', 'estimatedWeight', 'bagsToBuy'],
  'molar-mass-calculator': ['copied', 'copyUnavailable', 'calculated', 'invalidFormula', 'atomCount', 'molarMass'],
  'auto-loan-refinance-calculator': ['copied', 'copyUnavailable', 'estimateOnly', 'checkInputs', 'currentPayment', 'newPayment', 'paymentDifference', 'currentTotal', 'newTotal', 'estimatedDifference', 'breakEven', 'noBreakEven', 'monthCount'],
  'secret-santa-generator': ['copied', 'copyUnavailable', 'privatePair', 'allRevealed', 'drawReady', 'checkNamesAndRules', 'downloaded'],
  'tire-size-calculator': ['copied', 'copyUnavailable', 'calculated', 'sameSize', 'checkInputs', 'diameter', 'sidewall', 'circumference', 'revolutions', 'diameterDifference', 'diameterChange', 'groundClearance', 'actualSpeed'],
  'stair-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'riserHeight', 'treadCount', 'totalRun', 'angle', 'stringerLength', 'diagram'],
  'asphalt-calculator': ['copied', 'copyUnavailable', 'calculated', 'checkInputs', 'compactedVolume', 'orderVolume', 'metricTonnes', 'shortTons', 'estimatedCost'],
  mancala: ['pit', 'seeds', 'playerOne', 'playerTwo', 'playerOneWins', 'playerTwoWins', 'tie', 'gameOver', 'turn'],
});
export const REQUIRED_TOOL_FIELDS = Object.freeze({
  'soil-calculator': ['shape', 'length', 'width', 'diameter', 'depth', 'dimensionUnit', 'containerCount', 'wastePercent', 'bagVolume', 'bagUnit', 'accuracyNote'],
  'gravel-calculator': ['shape', 'depth', 'length', 'width', 'diameter', 'base', 'triangleHeight', 'dimensionUnit', 'depthUnit', 'density', 'densityUnit', 'waste', 'bagSize', 'bagUnit'],
  'molar-mass-calculator': ['formula', 'supportedHint'],
  'auto-loan-refinance-calculator': ['balance', 'currentApr', 'currentMonths', 'newApr', 'newMonths', 'fees', 'feeTreatment', 'upfront', 'rolledIn', 'currencyNote'],
  'secret-santa-generator': ['names', 'exclusions', 'exclusionsHint'],
  'tire-size-calculator': ['originalSize', 'replacementSize', 'indicatedSpeed', 'speedUnit', 'fitmentNote', 'relatedUnitConverter'],
  'stair-calculator': ['totalRise', 'riserCount', 'treadDepth', 'unit', 'codeNote', 'relatedUnitConverter'],
  'asphalt-calculator': ['area', 'areaUnit', 'compactedThickness', 'thicknessUnit', 'density', 'densityUnit', 'wastePercent', 'pricePerTonne', 'accuracyNote', 'relatedConcreteCalculator'],
  mancala: ['mode', 'board', 'rules'],
});
export const REQUIRED_TOOL_ACTIONS = Object.freeze({
  'soil-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'rectangle', 'circle', 'meters', 'centimeters', 'feet', 'inches', 'liters', 'cubicFeet'],
  'gravel-calculator': ['calculate', 'reset', 'copy', 'result', 'rectangle', 'circle', 'triangle', 'meters', 'centimeters', 'feet', 'inches', 'kgPerCubicMeter', 'lbPerCubicFoot', 'kilograms', 'pounds'],
  'molar-mass-calculator': ['calculate', 'reset', 'example', 'copy', 'result'],
  'auto-loan-refinance-calculator': ['calculate', 'reset', 'copy', 'result'],
  'secret-santa-generator': ['generate', 'reset', 'copy', 'download', 'result', 'reveal', 'next', 'privacyNote'],
  'tire-size-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'kmh', 'mph'],
  'stair-calculator': ['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'centimeters', 'feet', 'inches'],
  'asphalt-calculator': ['calculate', 'reset', 'copy', 'example', 'result'],
  mancala: ['newGame', 'rules', 'result', 'computer', 'twoPlayers'],
});
const MESSAGE_PLACEHOLDERS = Object.freeze({ monthCount: ['{count}'], privatePair: ['{giver}', '{recipient}'], turn: ['{player}'] });

export function assertGrowthLocaleCoverage(tools, localeEntries, copyByLocale, { titleMax = 60, descriptionMax = 160 } = {}) {
  const errors = [];
  for (const locale of localeEntries) {
    const languageCopy = copyByLocale?.[locale.key];
    if (!languageCopy) { errors.push(`${locale.key}: locale copy is missing`); continue; }
    const home = languageCopy._home;
    for (const key of REQUIRED_GROWTH_HOME_COPY) {
      if (typeof home?.[key] !== 'string' || !home[key].trim()) errors.push(`${locale.key}/home: ${key} is missing`);
    }
    if (home?.copyLanguage !== locale.key) errors.push(`${locale.key}/home: copy language does not match its route`);
    if (typeof home?.title === 'string' && home.title.length > titleMax) errors.push(`${locale.key}/home: title is ${home.title.length} characters (max ${titleMax})`);
    if (typeof home?.description === 'string' && home.description.length > descriptionMax) errors.push(`${locale.key}/home: description is ${home.description.length} characters (max ${descriptionMax})`);
    for (const tool of tools) {
      const copy = languageCopy[tool.id];
      if (!copy) { errors.push(`${locale.key}/${tool.id}: translation is missing`); continue; }
      for (const key of REQUIRED_GROWTH_COPY) {
        if (typeof copy[key] !== 'string' || !copy[key].trim()) errors.push(`${locale.key}/${tool.id}: ${key} is missing`);
      }
      for (const key of REQUIRED_TOOL_FIELDS[tool.id] ?? []) {
        if (typeof copy.fields?.[key] !== 'string' || !copy.fields[key].trim()) errors.push(`${locale.key}/${tool.id}: fields.${key} is missing`);
      }
      for (const key of REQUIRED_TOOL_ACTIONS[tool.id] ?? []) {
        if (typeof copy.actions?.[key] !== 'string' || !copy.actions[key].trim()) errors.push(`${locale.key}/${tool.id}: actions.${key} is missing`);
      }
      for (const key of REQUIRED_TOOL_MESSAGES[tool.id] ?? []) {
        if (typeof copy.messages?.[key] !== 'string' || !copy.messages[key].trim()) errors.push(`${locale.key}/${tool.id}: messages.${key} is missing`);
        for (const token of MESSAGE_PLACEHOLDERS[key] ?? []) {
          if (typeof copy.messages?.[key] === 'string' && !copy.messages[key].includes(token)) errors.push(`${locale.key}/${tool.id}: messages.${key} must preserve ${token}`);
        }
      }
      if (['soil-calculator', 'tire-size-calculator', 'stair-calculator', 'asphalt-calculator'].includes(tool.id)
        && (!Array.isArray(copy.additionalFaqs) || copy.additionalFaqs.length !== 2
          || copy.additionalFaqs.some((faq) => !faq.question?.trim() || !faq.answer?.trim()))) {
        errors.push(`${locale.key}/${tool.id}: two complete localized tool FAQs are required`);
      }
      if (typeof copy.title === 'string' && copy.title.length > titleMax) errors.push(`${locale.key}/${tool.id}: title is ${copy.title.length} characters (max ${titleMax})`);
      if (typeof copy.description === 'string' && copy.description.length > descriptionMax) errors.push(`${locale.key}/${tool.id}: description is ${copy.description.length} characters (max ${descriptionMax})`);
      if (copy.title?.includes('UsefulVerse') === false) errors.push(`${locale.key}/${tool.id}: title must include the brand suffix`);
      if (copy.copyLanguage !== locale.key) errors.push(`${locale.key}/${tool.id}: copy language does not match its route`);
    }
  }
  if (errors.length) throw new Error(`Growth locale release gate failed:\n${errors.map((error) => `- ${error}`).join('\n')}`);
  return true;
}

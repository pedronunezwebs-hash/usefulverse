import { localeEntries, ui } from '../../locales.mjs';
import { insulationCalculatorEnglishCopy as english } from './insulation-calculator.en.mjs';

const actionLabels = Object.freeze({
  calculate: [['Calculate'], english.actions.calculate], reset: [['Reset'], english.actions.reset], copy: [['Copy result'], english.actions.copy],
  example: [['Try an example', 'Example'], english.actions.example], result: [['Result'], english.actions.result], R: [['R-value'], english.actions.R], RSI: [['RSI'], english.actions.RSI],
});
const fieldLabels = Object.freeze({
  unit: ['Unit'], layerName1: ['Layer name', 'Name'], layerResistance1: ['Resistance'], layerQuantity1: ['Quantity'],
  layerName2: ['Layer name', 'Name'], layerResistance2: ['Resistance'], layerQuantity2: ['Quantity'],
  layerName3: ['Layer name', 'Name'], layerResistance3: ['Resistance'], layerQuantity3: ['Quantity'],
  layerName4: ['Layer name', 'Name'], layerResistance4: ['Resistance'], layerQuantity4: ['Quantity'],
});
function translated(language, candidates, fallback) {
  for (const key of candidates) {
    const value = ui[language]?.[key];
    if (typeof value === 'string' && value.trim() && value !== key) return value;
  }
  return fallback;
}
const drafts = Object.fromEntries(localeEntries.map(({ key }) => {
  if (key === 'en') return [key, Object.freeze({ ...english, localizationStatus: 'approved' })];
  const actions = Object.fromEntries(Object.entries(actionLabels).map(([name, [labels, fallback]]) => [name, translated(key, labels, fallback)]));
  const fields = Object.fromEntries(Object.entries(fieldLabels).map(([name, labels]) => [name, translated(key, labels, english.fields[name])]));
  return [key, Object.freeze({ ...english, actions: Object.freeze({ ...english.actions, ...actions }), fields: Object.freeze({ ...english.fields, ...fields }), copyLanguage: key, localizationStatus: 'pending-tool-specific-translation' })];
}));
export default Object.freeze(drafts);

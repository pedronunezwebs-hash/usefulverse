import { localeEntries, ui } from '../../locales.mjs';
import { fertilizerCalculatorEnglishCopy as english } from './fertilizer-calculator.en.mjs';

const actionKeys = Object.freeze({ calculate: [['Calculate'], english.actions.calculate], reset: [['Reset'], english.actions.reset], copy: [['Copy result'], english.actions.copy], example: [['Try an example', 'Example'], english.actions.example], result: [['Result'], english.actions.result], kilograms: [['Kilograms'], english.actions.kilograms], pounds: [['Pounds'], english.actions.pounds], squareMeters: [['Square meters', 'Square metres'], english.actions.squareMeters], hectares: [['Hectares'], english.actions.hectares], squareFeet: [['Square feet'], english.actions.squareFeet], acres: [['Acres'], english.actions.acres] });
function translated(language, keys, fallback) {
  for (const key of keys) {
    const value = ui[language]?.[key];
    if (typeof value === 'string' && value.trim() && value !== key) return value;
  }
  return fallback;
}
const drafts = Object.fromEntries(localeEntries.map(({ key }) => {
  if (key === 'en') return [key, Object.freeze({ ...english, localizationStatus: 'approved' })];
  const actions = Object.fromEntries(Object.entries(actionKeys).map(([name, [keys, fallback]]) => [name, translated(key, keys, fallback)]));
  return [key, Object.freeze({ ...english, actions: Object.freeze({ ...english.actions, ...actions }), copyLanguage: key, localizationStatus: 'pending-tool-specific-translation' })];
}));
export default Object.freeze(drafts);

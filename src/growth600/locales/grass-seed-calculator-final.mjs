import { localeEntries, ui } from '../../locales.mjs';
import { grassSeedCalculatorEnglishCopy as english } from './grass-seed-calculator.en.mjs';

// Reuse existing generic UI labels where available. Tool-specific non-English copy stays
// explicitly pending until translated; the production release gate rejects these drafts.
const labelMap = Object.freeze({
  calculate: [['Calculate'], english.actions.calculate], reset: [['Reset'], english.actions.reset], copy: [['Copy result'], english.actions.copy],
  example: [['Try an example', 'Example'], english.actions.example], result: [['Result'], english.actions.result],
  m2: [['Square meters', 'Square metres'], english.actions.m2], ft2: [['Square feet'], english.actions.ft2], acre: [['Acres', 'Acre'], english.actions.acre],
  gM2: [['Grams per square meter', 'Grams per square metre'], english.actions.gM2], lb1000ft2: [['Pounds'], english.actions.lb1000ft2], kg: [['Kilograms'], english.actions.kg], lb: [['Pounds'], english.actions.lb],
});
const fieldMap = Object.freeze({
  area: ['Area'], areaUnit: ['Unit'], seedingRate: ['Rate'], rateUnit: ['Unit'], wastePercent: ['Waste percentage', 'Extra percentage'],
  varietyA: ['Name'], percentA: ['Percentage'], varietyB: ['Name'], percentB: ['Percentage'], bagSize: ['Bag size'], bagUnit: ['Unit'],
});

function translated(language, options, fallback) {
  for (const key of options) {
    const value = ui[language]?.[key];
    if (typeof value === 'string' && value.trim() && value !== key) return value;
  }
  return fallback;
}

const copies = Object.fromEntries(localeEntries.map(({ key }) => {
  if (key === 'en') return [key, Object.freeze({ ...english, localizationStatus: 'approved' })];
  const actions = Object.fromEntries(Object.entries(labelMap).map(([name, [candidates, fallback]]) => [name, translated(key, candidates, fallback)]));
  const fields = Object.fromEntries(Object.entries(fieldMap).map(([name, candidates]) => [name, translated(key, candidates, english.fields[name])]));
  return [key, Object.freeze({ ...english, actions: Object.freeze({ ...english.actions, ...actions }), fields: Object.freeze({ ...english.fields, ...fields }), copyLanguage: key, localizationStatus: 'pending-tool-specific-translation' })];
}));

export default Object.freeze(copies);

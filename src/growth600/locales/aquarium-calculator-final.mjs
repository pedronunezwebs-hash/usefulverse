import { localeEntries, ui } from '../../locales.mjs';
import { aquariumCalculatorEnglishCopy as english } from './aquarium-calculator.en.mjs';

// Common labels reuse existing locale dictionaries. Aquarium-specific copy is deliberately
// marked incomplete until machine translation is available; the production release gate blocks it.
const labels = Object.freeze({
  length: [['Length', 'Room length'], 'Inside length'],
  width: [['Width', 'Room width'], 'Inside width'],
  height: [['Height'], 'Inside height'],
  dimensionUnit: [['Unit', 'Dimension unit'], 'Dimension unit'],
  calculate: [['Calculate'], english.actions.calculate], reset: [['Reset'], english.actions.reset],
  copy: [['Copy result'], english.actions.copy], example: [['Try an example', 'Example'], english.actions.example],
  result: [['Result'], english.actions.result], meters: [['Meters', 'Metres'], english.actions.meters],
  centimeters: [['Centimeters', 'Centimetres'], english.actions.centimeters], feet: [['Feet'], english.actions.feet], inches: [['Inches'], english.actions.inches],
  liters: [['Liters', 'Litres'], english.actions.liters], usGallons: [['US gallons'], english.actions.usGallons], imperialGallons: [['Imperial gallons'], english.actions.imperialGallons],
});

function translated(language, keys, fallback) {
  for (const key of keys) {
    const value = ui[language]?.[key];
    if (typeof value === 'string' && value.trim() && value !== key) return value;
  }
  return fallback;
}

const copies = Object.fromEntries(localeEntries.map(({ key }) => {
  if (key === 'en') return [key, Object.freeze({ ...english, localizationStatus: 'approved' })];
  const fields = { ...english.fields };
  for (const name of ['length', 'width', 'height', 'dimensionUnit']) fields[name] = translated(key, labels[name][0], labels[name][1]);
  const actions = Object.fromEntries(Object.entries(labels).filter(([name]) => name in english.actions).map(([name, [keys, fallback]]) => [name, translated(key, keys, fallback)]));
  return [key, Object.freeze({
    ...english, fields: Object.freeze(fields), actions: Object.freeze({ ...english.actions, ...actions }),
    copyLanguage: key, localizationStatus: 'pending-tool-specific-translation',
  })];
}));

export default Object.freeze(copies);

import { localeEntries, ui } from '../../locales.mjs';
import { wallFramingCalculatorEnglishCopy as english } from './wall-framing-calculator.en.mjs';

const actionKeys = Object.freeze({ calculate: [['Calculate'], english.actions.calculate], reset: [['Reset'], english.actions.reset], copy: [['Copy result'], english.actions.copy], example: [['Try an example', 'Example'], english.actions.example], result: [['Result'], english.actions.result], meters: [['Meters', 'Metres'], english.actions.meters], feet: [['Feet'], english.actions.feet], centimeters: [['Centimeters', 'Centimetres'], english.actions.centimeters], millimeters: [['Millimeters', 'Millimetres'], english.actions.millimeters], inches: [['Inches'], english.actions.inches] });
const fieldKeys = Object.freeze({ wallLength: ['Length'], wallHeight: ['Height'], wallUnit: ['Unit'], spacing: ['Spacing'], spacingUnit: ['Unit'], openingStart1: ['Position'], openingWidth1: ['Width'], breakBottomPlate1: ['Opening interrupts bottom plate'], openingStart2: ['Position'], openingWidth2: ['Width'], breakBottomPlate2: ['Opening interrupts bottom plate'], openingStart3: ['Position'], openingWidth3: ['Width'], breakBottomPlate3: ['Opening interrupts bottom plate'], topPlateRows: ['Rows'], bottomPlateRows: ['Rows'] });
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
  const fields = Object.fromEntries(Object.entries(fieldKeys).map(([name, keys]) => [name, translated(key, keys, english.fields[name])]));
  return [key, Object.freeze({ ...english, actions: Object.freeze({ ...english.actions, ...actions }), fields: Object.freeze({ ...english.fields, ...fields }), copyLanguage: key, localizationStatus: 'pending-tool-specific-translation' })];
}));
export default Object.freeze(drafts);

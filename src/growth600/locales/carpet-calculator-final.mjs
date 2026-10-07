import { localeEntries, ui } from '../../locales.mjs';
import { carpetCalculatorEnglishCopy as english } from './carpet-calculator.en.mjs';

// Structural drafts only. Shared control labels reuse the site's existing translations,
// but carpet-specific SEO copy must be machine-translated and checked before release.
const sharedLabels = Object.freeze({
  unit: ['Unit'], roomLength: ['Room length', 'Length'], roomWidth: ['Room width', 'Width'],
  rollWidth: ['Carpet roll width', 'Roll width'], rooms: ['Number of identical rooms', 'Number of rooms'],
  pileDirection: ['Pile direction', 'Direction'], wastePercent: ['Cutting allowance (%)', 'Waste allowance (%)', 'Extra material (%)'],
  calculate: ['Calculate'], reset: ['Reset'], copy: ['Copy result'], example: ['Try an example', 'Example'], result: ['Result'], meters: ['Meters', 'Metres'], feet: ['Feet'],
});

function translatedLabel(language, candidates, fallback) {
  const dictionary = ui[language] ?? {};
  for (const candidate of candidates) {
    const value = dictionary[candidate];
    if (typeof value === 'string' && value.trim() && value !== candidate) return value;
  }
  return fallback;
}

const drafts = Object.fromEntries(localeEntries.map(({ key }) => {
  if (key === 'en') return [key, Object.freeze({ ...english, localizationStatus: 'approved' })];
  const actions = Object.fromEntries(['calculate', 'reset', 'copy', 'example', 'result', 'meters', 'feet'].map((name) => [
    name, translatedLabel(key, sharedLabels[name], english.actions[name]),
  ]));
  const fields = Object.fromEntries(Object.entries(sharedLabels).filter(([name]) => ['unit', 'roomLength', 'roomWidth', 'rollWidth', 'rooms', 'pileDirection', 'wastePercent'].includes(name)).map(([name, candidates]) => [
    name, translatedLabel(key, candidates, english.fields[name]),
  ]));
  return [key, Object.freeze({
    ...english,
    fields: Object.freeze({ ...english.fields, ...fields }),
    actions: Object.freeze({ ...english.actions, ...actions }),
    copyLanguage: key,
    localizationStatus: 'pending-tool-specific-translation',
  })];
}));

export default Object.freeze(drafts);

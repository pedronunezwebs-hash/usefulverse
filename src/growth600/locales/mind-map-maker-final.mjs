import { localeEntries, ui } from '../../locales.mjs';
import { mindMapMakerEnglishCopy as english } from './mind-map-maker.en.mjs';

const actions = Object.freeze({
  generate: [['Generate', 'Create'], english.actions.generate],
  reset: [['Reset'], english.actions.reset],
  example: [['Try an example', 'Example'], english.actions.example],
  undo: [['Undo'], english.actions.undo],
  redo: [['Redo'], english.actions.redo],
});
const translated = (language, keys, fallback) => keys.map((key) => ui[language]?.[key]).find((value) => typeof value === 'string' && value.trim() && value !== keys[0]) ?? fallback;
const copies = Object.fromEntries(localeEntries.map(({ key }) => {
  if (key === 'en') return [key, Object.freeze({ ...english, localizationStatus: 'approved' })];
  const localizedActions = Object.fromEntries(Object.entries(actions).map(([name, [keys, fallback]]) => [name, translated(key, keys, fallback)]));
  return [key, Object.freeze({ ...english, actions: Object.freeze({ ...english.actions, ...localizedActions }), copyLanguage: key, localizationStatus: 'pending-tool-specific-translation' })];
}));

export default Object.freeze(copies);

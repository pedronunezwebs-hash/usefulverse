import { localeEntries, ui } from '../../locales.mjs';
import { goalPlannerEnglishCopy as english } from './goal-planner.en.mjs';

const actionKeys = Object.freeze({
  generate: [['Generate', 'Create'], english.actions.generate],
  reset: [['Reset'], english.actions.reset],
  example: [['Try an example', 'Example'], english.actions.example],
  copy: [['Copy result', 'Copy'], english.actions.copy],
  download: [['Download'], english.actions.download],
});

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

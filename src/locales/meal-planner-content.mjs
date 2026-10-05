import { mealPlannerLocaleData } from './meal-planner.mjs';
import { mealPlannerEnglishCopy, mealPlannerUiKeys } from './meal-planner-source.mjs';

const englishUi = Object.fromEntries(mealPlannerUiKeys.map((key) => [key, key]));
const corrections = {
  ca: { ui: { Snack: 'Berenar' } },
  nl: { ui: { Lunch: 'Middageten' } },
  pl: { ui: { 'Import JSON backup': 'Importuj kopię zapasową JSON' } },
  sv: { ui: { Lunch: 'Måltid mitt på dagen', Snack: 'Mellanmål' } },
  ha: { copy: { 2: 'Ka tsara karin kumallo, abincin rana, abincin dare da kayan ciye-ciye na mako, sannan ka ƙirƙiri jerin siyayya daga kayan abincin.' } },
  zh: { ui: { 'Add meal': '添加餐点' } },
  zh_tw: { ui: { 'Add meal': '新增餐點' } },
};

export function mealPlannerContent(language) {
  if (language === 'en') return { ui: englishUi, copy: mealPlannerEnglishCopy };
  const data = mealPlannerLocaleData[language];
  if (!data || mealPlannerUiKeys.some((key) => !data.ui?.[key]?.trim()) || data.copy?.length !== mealPlannerEnglishCopy.length || data.copy.some((text) => !text?.trim())) {
    throw new Error(`Meal planner translations are incomplete for ${language}.`);
  }
  const copy = [...data.copy];
  Object.assign(copy, corrections[language]?.copy);
  copy[0] = copy[0].replace(/\.$/u, '');
  copy[1] = copy[1].replace(/\.$/u, '');
  return { ui: { ...data.ui, ...corrections[language]?.ui }, copy };
}

// No machine translations are included; all non-English routes use source copy pending human review.
import { localeEntries } from '../locales.mjs';
import { swissVacationAccrualEnglish } from './swiss-vacation-accrual-copy-en.mjs';
const collect = (value, output = new Set()) => {
  if (typeof value === 'string') output.add(value);
  else if (Array.isArray(value)) value.forEach((item) => collect(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => collect(item, output));
  return output;
};
const englishFallback = Object.freeze(Object.fromEntries([...collect(swissVacationAccrualEnglish)].map((text) => [text, text])));
const localeKeys = [...localeEntries.map(({ key }) => key), 'nb'].filter((key) => key !== 'en');
export const swissVacationAccrualTranslationsByLocale = Object.freeze(Object.fromEntries(localeKeys.map((key) => [key, englishFallback])));

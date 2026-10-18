// Generated model drafts were withheld after visible quality defects.
// Routes deliberately use English source copy until human-reviewed locale packs are ready.
import { localeEntries } from '../locales.mjs';
import { swissHealthDeductibleEnglish } from './swiss-health-deductible-copy-en.mjs';
const collect = (value, output = new Set()) => {
  if (typeof value === 'string') output.add(value);
  else if (Array.isArray(value)) value.forEach((item) => collect(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => collect(item, output));
  return output;
};
const englishFallback = Object.freeze(Object.fromEntries([...collect(swissHealthDeductibleEnglish)].map((text) => [text, text])));
const localeKeys = [...localeEntries.map(({ key }) => key), 'nb'].filter((key) => key !== 'en');
export const swissHealthDeductibleTranslationsByLocale = Object.freeze(Object.fromEntries(localeKeys.map((key) => [key, englishFallback])));

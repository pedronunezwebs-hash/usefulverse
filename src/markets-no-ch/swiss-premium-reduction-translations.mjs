// English source fallback until reviewed translations are available.
import { localeEntries } from '../locales.mjs';
import { swissPremiumReductionEnglish } from './swiss-premium-reduction-copy-en.mjs';
const collect = (value, output = new Set()) => { if (typeof value === 'string') output.add(value); else if (Array.isArray(value)) value.forEach((item) => collect(item, output)); else if (value && typeof value === 'object') Object.values(value).forEach((item) => collect(item, output)); return output; };
const source = Object.freeze(Object.fromEntries([...collect(swissPremiumReductionEnglish)].map((text) => [text, text])));
const locales = [...localeEntries.map(({ key }) => key), 'nb'].filter((key) => key !== 'en');
export const swissPremiumReductionTranslationsByLocale = Object.freeze(Object.fromEntries(locales.map((key) => [key, source])));

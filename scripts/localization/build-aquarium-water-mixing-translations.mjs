import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';
import { aquariumWaterMixingEnglish } from '../../src/markets-no-ch/aquarium-water-mixing-copy-en.mjs';

const checkpoint = '/private/tmp/usefulverse-aquarium-water-mixing-translations.json';
const locales = [...localeEntries, { key: 'nb' }].filter(({ key }) => key !== 'en').map(({ key }) => key).sort();
const flatten = (value, out = []) => { if (typeof value === 'string') out.push(value); else if (Array.isArray(value)) value.forEach((item) => flatten(item, out)); else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, out)); return out; };
const generic = new Set(Object.keys(translationsByLocale.es));
const sources = [...new Set(flatten(aquariumWaterMixingEnglish).filter((value) => !generic.has(value)))];
const captures = JSON.parse(await readFile(checkpoint, 'utf8')); const dictionaries = {};
const overrides = { tl: { 'Aquarium Water Mixing Calculator': 'Calculator ng Paghahalo ng Tubig sa Aquarium' } };
for (const locale of locales) {
  const pack = captures[locale];
  if (!pack || Object.keys(pack).length !== sources.length) throw new Error(`${locale}: missing translation strings.`);
  dictionaries[locale] = Object.fromEntries(sources.map((source, index) => {
    let value = overrides[locale]?.[source] ?? pack[`Q${String(index).padStart(4, '0')}`]?.trim();
    if (!value || /AWC\d{4}X|AXWebArea|127\.0\.0\.1|Focused UI element/iu.test(value)) throw new Error(`${locale}: invalid translation row ${index}.`);
    for (const token of source.match(/UsefulVerse|(?:°dH|°fH|mg\/L|CaCO3|ppm|meq\/L)|\{[^}]+\}/gu) ?? []) if (!value.includes(token)) value = `${value} (${token})`;
    return [source, value];
  }));
}
await writeFile(new URL('../../src/markets-no-ch/aquarium-water-mixing-translations.mjs', import.meta.url), `// Static Google Translate UI drafts; published pages do not call a translation service.\nexport const aquariumWaterMixingTranslationsByLocale = Object.freeze(${JSON.stringify(dictionaries)});\n`);
console.log(`Built ${locales.length} static aquarium-water-mixing dictionaries × ${sources.length} unique strings.`);

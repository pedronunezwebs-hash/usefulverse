import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';
import { miniGolfEnglish } from '../../src/markets-no-ch/minigolf-copy-en.mjs';

const checkpoint = '/private/tmp/usefulverse-minigolf-translations.json';
const locales = [...localeEntries, { key: 'nb' }].filter(({ key }) => key !== 'en').map(({ key }) => key).sort();
const generic = new Set(Object.keys(translationsByLocale.es));
const flatten = (value, result = []) => { if (typeof value === 'string') result.push(value); else if (Array.isArray(value)) value.forEach((item) => flatten(item, result)); else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, result)); return result; };
const sources = [...new Set(flatten(miniGolfEnglish).filter((text) => !generic.has(text)))];
const captures = JSON.parse(await readFile(checkpoint, 'utf8')); const dictionaries = {};
for (const locale of locales) {
  const pack = captures[locale];
  if (!pack || Object.keys(pack).length !== sources.length) throw new Error(`${locale}: missing translation strings`);
  dictionaries[locale] = Object.fromEntries(sources.map((source, index) => {
    let translated = pack[`Q${String(index).padStart(4, '0')}`]?.trim();
    // The last copied result can include a numeric Google Translate tab/focus index.
    if (index === sources.length - 1 && !/\d$/u.test(source)) translated = translated?.replace(/\s+\d{1,3}$/u, '').trim();
    if (!translated || /UVMG\d{4}X|AXWebArea|127\.0\.0\.1|Focused UI element|Resultados de traducción disponibles/iu.test(translated)) throw new Error(`${locale}: invalid translation at ${index}`);
    return [source, translated];
  }));
}
await writeFile(new URL('../../src/markets-no-ch/minigolf-translations.mjs', import.meta.url), `// Static Google Translate UI drafts. The published page does not translate at runtime.\nexport const miniGolfTranslationsByLocale = Object.freeze(${JSON.stringify(dictionaries)});\n`);
console.log(`Built ${locales.length} static locale dictionaries × ${sources.length} unique strings.`);

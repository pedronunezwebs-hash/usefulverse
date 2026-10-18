import { readFile, writeFile } from 'node:fs/promises';
import { suguruEnglish } from '../../src/markets-no-ch/suguru-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const checkpointPath = '/private/tmp/usefulverse-suguru-translations.json';
const outputPath = new URL('../../src/markets-no-ch/suguru-translations.mjs', import.meta.url);
const generic = new Set(Object.keys(translationsByLocale.es));
const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const sources = [...new Set(flatten(suguruEnglish).filter((value) => !generic.has(value)))];
const captures = JSON.parse(await readFile(checkpointPath, 'utf8'));
const locales = Object.keys(translationsByLocale).sort();
const dictionaries = {};
for (const locale of locales) {
  const pack = captures[locale];
  if (!pack || Object.keys(pack).length !== sources.length) throw new Error(`${locale}: expected ${sources.length} translated strings.`);
  const dictionary = {};
  sources.forEach((source, index) => {
    const translated = pack[`Q${String(index).padStart(4, '0')}`]?.trim();
    if (!translated || /UVTAG\d{4}QVU:|AXWebArea|127\.0\.0\.1|Focused UI element/iu.test(translated)) throw new Error(`${locale}: invalid translation at ${index}.`);
    dictionary[source] = translated;
  });
  dictionaries[locale] = dictionary;
}

await writeFile(outputPath, `// Static Google Translate drafts. All values are local and require ordinary localization review.\nexport const suguruTranslationsByLocale = Object.freeze(${JSON.stringify(dictionaries)});\n`);
console.log(`Built ${locales.length} locale dictionaries × ${sources.length} strings (${sources.reduce((sum, value) => sum + value.length, 0)} English source characters).`);

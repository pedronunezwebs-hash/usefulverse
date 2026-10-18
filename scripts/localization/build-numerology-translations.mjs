import { readFile, writeFile } from 'node:fs/promises';
import { numerologyEnglish } from '../../src/markets-no-ch/numerology-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const checkpointPath = '/private/tmp/usefulverse-numerology-translation-checkpoint.json';
const genericEnglish = new Set(Object.keys(translationsByLocale.es));
const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const sources = [...new Set(flatten(numerologyEnglish).filter((text) => !genericEnglish.has(text)))];
const locales = Object.keys(translationsByLocale).filter((locale) => locale !== 'en').sort();
const packs = JSON.parse(await readFile(checkpointPath, 'utf8'));
if (JSON.stringify(Object.keys(packs).sort()) !== JSON.stringify(locales)) throw new Error('Translation checkpoint does not contain all 36 non-English locales.');
const dictionaries = {};
for (const locale of locales) {
  const pack = packs[locale];
  const ids = sources.map((_, index) => `Q${String(index).padStart(4, '0')}`);
  const missing = ids.filter((id) => typeof pack[id] !== 'string' || !pack[id].trim());
  const extra = Object.keys(pack).filter((id) => !ids.includes(id));
  if (missing.length || extra.length) throw new Error(`${locale}: missing ${missing.length} or extra ${extra.length} translations.`);
  dictionaries[locale] = Object.fromEntries(sources.map((source, index) => [source, pack[ids[index]].trim()]));
  if (Object.values(dictionaries[locale]).some((text) => /[⟦⟧]|UVNMX\d{4}X|UVNFX\d{4}X|AXWebArea|127\.0\.0\.1|Focused UI element|focused UI element|The focused UI element|Resultados de traducción disponibles/iu.test(text))) {
    throw new Error(`${locale}: leaked translation marker or browser/debug residue.`);
  }
}
const target = new URL('../../src/markets-no-ch/numerology-translations.mjs', import.meta.url);
await writeFile(target, `// Static machine translations. The site never calls a translation service at runtime.\nexport const numerologyTranslationsByLocale = Object.freeze(${JSON.stringify(dictionaries)});\n`);
console.log(`Wrote ${locales.length} locale packs × ${sources.length} strings to ${target.pathname}.`);

import { readFile, writeFile } from 'node:fs/promises';
import { doppelkopfEnglish } from '../../src/markets-no-ch/doppelkopf-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const checkpointPath = '/private/tmp/usefulverse-doppelkopf-translations.json';
const genericEnglish = new Set(Object.keys(translationsByLocale.es));
const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const sources = [...new Set(flatten(doppelkopfEnglish).filter((text) => !genericEnglish.has(text)))];
const targets = Object.keys(translationsByLocale).sort();
const packs = JSON.parse(await readFile(checkpointPath, 'utf8'));
if (JSON.stringify(Object.keys(packs).sort()) !== JSON.stringify(targets)) {
  throw new Error('Translation checkpoint does not contain exactly the 36 non-English locales.');
}
const dictionaries = {};
for (const locale of targets) {
  const pack = packs[locale];
  const ids = sources.map((_, index) => `Q${String(index).padStart(4, '0')}`);
  if (ids.some((id) => typeof pack[id] !== 'string' || !pack[id].trim()) || Object.keys(pack).some((id) => !ids.includes(id))) {
    throw new Error(`${locale}: translations are missing or extra.`);
  }
  const dictionary = Object.fromEntries(sources.map((source, index) => [source, pack[ids[index]].trim()]));
  if (Object.values(dictionary).some((value) => /[⟦⟧]|D\d{4}\||UVTAG\d{4}QVU|AXWebArea|127\.0\.0\.1|Focused UI element|focused UI element|The focused UI element|Resultados de traducción disponibles/iu.test(value))) {
    throw new Error(`${locale}: marker or browser/debug residue leaked.`);
  }
  dictionaries[locale] = dictionary;
}
const target = new URL('../../src/markets-no-ch/doppelkopf-translations.mjs', import.meta.url);
await writeFile(target, `// Static machine translations captured from the Google Translate web UI; nothing translates at page load.\nexport const doppelkopfTranslationsByLocale = Object.freeze(${JSON.stringify(dictionaries)});\n`);
console.log(`Wrote ${targets.length} locale packs × ${sources.length} strings to ${target.pathname}.`);

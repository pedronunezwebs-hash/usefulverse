import { readFile, writeFile } from 'node:fs/promises';
import { schafkopfEnglish } from '../../src/markets-no-ch/schafkopf-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const checkpointPath = '/private/tmp/usefulverse-schafkopf-translations.json';
const generic = new Set(Object.keys(translationsByLocale.es));
const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const sources = [...new Set(flatten(schafkopfEnglish).filter((text) => !generic.has(text)))];
const targets = Object.keys(translationsByLocale).sort();
const packs = JSON.parse(await readFile(checkpointPath, 'utf8'));
if (JSON.stringify(Object.keys(packs).sort()) !== JSON.stringify(targets)) throw new Error('Checkpoint must contain exactly the 36 non-English locales.');
const dictionaries = {};
for (const locale of targets) {
  const pack = packs[locale]; const ids = sources.map((_, index) => `Q${String(index).padStart(4, '0')}`);
  if (!pack || ids.some((id) => typeof pack[id] !== 'string' || !pack[id].trim()) || Object.keys(pack).some((id) => !ids.includes(id))) throw new Error(`${locale}: missing/extra translation rows.`);
  const dictionary = Object.fromEntries(sources.map((source, index) => [source, pack[ids[index]].trim()]));
  if (Object.values(dictionary).some((value) => /S\d{4}\||UVS\d{4}QVU:|AXWebArea|127\.0\.0\.1|Focused UI element|Resultados de traducción disponibles/iu.test(value))) throw new Error(`${locale}: marker or browser residue in translation.`);
  dictionaries[locale] = dictionary;
}
const target = new URL('../../src/markets-no-ch/schafkopf-translations.mjs', import.meta.url);
await writeFile(target, `// Static machine translations from the Google Translate website. No page-load translation requests.\nexport const schafkopfTranslationsByLocale = Object.freeze(${JSON.stringify(dictionaries)});\n`);
console.log(`Wrote ${targets.length} locale packs × ${sources.length} strings.`);

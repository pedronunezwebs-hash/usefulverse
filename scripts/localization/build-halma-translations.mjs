import { readFile, writeFile } from 'node:fs/promises';
import { halmaGameEnglish } from '../../src/markets-no-ch/halma-game-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const checkpointPath = '/private/tmp/usefulverse-halma-translations.json';
const genericEnglish = new Set(Object.keys(translationsByLocale.es));
const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const sources = [...new Set(flatten(halmaGameEnglish).filter((text) => !genericEnglish.has(text)))];
const targets = Object.keys(translationsByLocale).sort();
const packs = JSON.parse(await readFile(checkpointPath, 'utf8'));
if (JSON.stringify(Object.keys(packs).sort()) !== JSON.stringify(targets)) throw new Error('Translation checkpoint does not contain exactly the 36 non-English locales.');
const dictionaries = {};
for (const locale of targets) {
  const pack = packs[locale];
  const ids = sources.map((_, index) => `Q${String(index).padStart(4, '0')}`);
  if (ids.some((id) => typeof pack[id] !== 'string' || !pack[id].trim()) || Object.keys(pack).some((id) => !ids.includes(id))) throw new Error(`${locale}: translations are missing or extra.`);
  const dictionary = Object.fromEntries(sources.map((source, index) => {
    let translation = pack[ids[index]].trim();
    const sourcePlaceholders = [...source.matchAll(/\{[^{}]+\}/gu)].map(([placeholder]) => placeholder);
    const targetPlaceholders = [...translation.matchAll(/\{[^{}]+\}/gu)];
    if (sourcePlaceholders.length !== targetPlaceholders.length) throw new Error(`${locale}: placeholder count changed for ${source}.`);
    for (let placeholderIndex = 0; placeholderIndex < sourcePlaceholders.length; placeholderIndex += 1) {
      const targetPlaceholder = targetPlaceholders[placeholderIndex][0];
      translation = translation.replace(targetPlaceholder, sourcePlaceholders[placeholderIndex]);
    }
    return [source, translation];
  }));
  if (Object.values(dictionary).some((text) => /[⟦⟧]|UVHM\d{4}H|AXWebArea|127\.0\.0\.1|Focused UI element|focused UI element|The focused UI element|Resultados de traducción disponibles/iu.test(text))) throw new Error(`${locale}: marker or browser/debug residue leaked.`);
  dictionaries[locale] = dictionary;
}
const target = new URL('../../src/markets-no-ch/halma-game-translations.mjs', import.meta.url);
await writeFile(target, `// Static machine translations captured from the Google Translate web UI; nothing translates at page load.\nexport const halmaGameTranslationsByLocale = Object.freeze(${JSON.stringify(dictionaries)});\n`);
console.log(`Wrote ${targets.length} locale packs × ${sources.length} strings to ${target.pathname}.`);

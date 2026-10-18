import { readFile, writeFile } from 'node:fs/promises';
import { pinballEnglish } from '../../src/markets-no-ch/pinball-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const sources = [...new Set(flatten(pinballEnglish))];
const locales = Object.keys(translationsByLocale).filter((locale) => locale !== 'en').sort();
const captures = JSON.parse(await readFile(new URL('../../src/markets-no-ch/pinball-translation-captures.json', import.meta.url), 'utf8'));
for (const locale of locales) {
  const row = captures[locale];
  if (!row || row.length !== sources.length) throw new Error(`${locale}: expected ${sources.length} captured strings`);
  for (let index = 0; index < sources.length; index += 1) {
    if (row[index]?.index !== index) throw new Error(`${locale}: source index mismatch at ${index}`);
    if (!row[index]?.translation?.trim()) throw new Error(`${locale}: empty translation at ${index}`);
  }
}
const packs = Object.fromEntries(locales.map((locale) => [locale, Object.fromEntries(captures[locale].map(({ index, translation }) => [
  sources[index],
  translation.replaceAll('⟪UV_SCORE⟫', '{score}').replaceAll('⟪UV_POINTS⟫', '{points}'),
]))]));
const titleSource = 'Pinball Game — Free Local Flipper and Bumper Table';
for (const dictionary of Object.values(packs)) {
  const name = dictionary['Pinball Game'];
  const rawTitle = dictionary[titleSource] ?? name;
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
  const tail = rawTitle.replace(new RegExp(`^${escapedName}\\s*[—–:·-]?\\s*`, 'iu'), '').replace(/^[\s—–:·-]+/u, '').trim();
  dictionary[titleSource] = tail ? `${name} — ${tail}` : name;
}
await writeFile(new URL('../../src/markets-no-ch/pinball-translations.mjs', import.meta.url), `// Static interface translations; the original casual game works across regions.\nexport const pinballTranslationsByLocale = Object.freeze(${JSON.stringify(packs)});\n`);
console.log(`Built ${sources.length} static strings for ${locales.length} non-English locales.`);

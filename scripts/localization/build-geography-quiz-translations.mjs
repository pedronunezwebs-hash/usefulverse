import { readFile, writeFile } from 'node:fs/promises';
import { geographyQuizEnglish } from '../../src/markets-no-ch/geography-quiz-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const sources = [...new Set(flatten(geographyQuizEnglish))];
const locales = Object.keys(translationsByLocale).filter((locale) => locale !== 'en').sort();
const captures = JSON.parse(await readFile(new URL('../../src/markets-no-ch/geography-quiz-translation-captures.json', import.meta.url), 'utf8'));
const placeholders = new Map([
  ['ZXVARDATEZX', '{date}'], ['ZXVARNUMBERZX', '{number}'], ['ZXVARTOTALZX', '{total}'],
  ['ZXVARCOUNTRYZX', '{country}'], ['ZXVARCONTINENTZX', '{continent}'], ['ZXVARSCOREZX', '{score}'],
]);

for (const locale of locales) {
  const row = captures[locale]?.filter((_, index) => ![11, 12].includes(index));
  if (!Array.isArray(row) || row.length !== sources.length) throw new Error(`${locale}: expected ${sources.length} captured strings after excluding the Norway/Switzerland-specific FAQ`);
  for (let index = 0; index < sources.length; index += 1) {
    if (typeof row[index] !== 'string' || !row[index].trim()) throw new Error(`${locale}: empty translation at ${index}`);
  }
}

const packs = {};
for (const locale of locales) {
  const dictionary = {};
  sources.forEach((source, index) => {
    let translation = captures[locale].filter((_, captureIndex) => ![11, 12].includes(captureIndex))[index];
    for (const [marker] of placeholders) {
      const placeholder = placeholders.get(marker);
      translation = translation.replaceAll(marker, placeholder);
    }
    for (const placeholder of source.match(/\{[a-z]+\}/gu) ?? []) {
      const marker = [...placeholders].find(([, candidate]) => candidate === placeholder)?.[0];
      if (marker && !translation.includes(placeholder)) throw new Error(`${locale}: lost ${placeholder} in source ${index}`);
    }
    dictionary[source] = translation.trim();
  });
  if (locale === 'nb') dictionary[geographyQuizEnglish.name] = 'Verdenskartquiz i geografi';
  packs[locale] = dictionary;
}

const titleSource = geographyQuizEnglish.title;
for (const dictionary of Object.values(packs)) {
  const name = dictionary[geographyQuizEnglish.name];
  const rawTitle = dictionary[titleSource] ?? name;
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
  const titleWithoutName = rawTitle.startsWith(name) ? rawTitle.slice(name.length).replace(/^[\s—–:·-]+/u, '').trim() : '';
  const tail = titleWithoutName || rawTitle.split(' — ').slice(1).join(' — ').trim();
  dictionary[titleSource] = tail ? `${name} — ${tail}` : name;
}

await writeFile(new URL('../../src/markets-no-ch/geography-quiz-translations.mjs', import.meta.url), `// Static machine translations; geography is a global practice activity. Native review is still advisable.\nexport const geographyQuizTranslationsByLocale = Object.freeze(${JSON.stringify(packs)});\n`);
console.log(`Built ${sources.length} static strings for ${locales.length} non-English locales.`);

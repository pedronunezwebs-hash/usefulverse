import { writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { carbonFootprintEnglish } from '../../src/markets-no-ch/carbon-footprint-copy-en.mjs';

const targets = localeEntries.filter(({ key }) => key !== 'en');
const languageCode = (locale) => ({ pt: 'pt-BR', zh_tw: 'zh-TW', tl: 'fil' })[locale] ?? locale;
const flatten = (value, out = {}) => {
  if (typeof value === 'string') out[value] = value;
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, out));
  return out;
};
const sources = [...new Set(Object.keys(flatten(carbonFootprintEnglish)))];
const marker = (index) => `CFROW${String(index).padStart(4, '0')}X`;
async function translateBatch(language, rows, offset) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'gtx', sl: 'en', tl: languageCode(language), dt: 't', q: rows.map((row, i) => `${marker(offset + i)}|${row}`).join('\n') })) url.searchParams.set(key, value);
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Translation failed for ${language}: HTTP ${response.status}`);
  const data = await response.json();
  const translated = Array.isArray(data?.[0]) ? data[0].map((part) => part?.[0] ?? '').join('') : '';
  const pattern = /CFROW\d{4}X\s*\|?\s*([\s\S]*?)(?=CFROW\d{4}X\s*\|?|$)/gu;
  const values = [...translated.matchAll(pattern)].map((match) => match[1].trim());
  if (values.length !== rows.length || values.some((value) => !value)) throw new Error(`Translation omitted rows for ${language}`);
  return values;
}
const dictionaries = {};
for (const { key } of targets) {
  const dictionary = {};
  for (let offset = 0; offset < sources.length; offset += 16) {
    const rows = sources.slice(offset, offset + 16);
    const values = await translateBatch(key, rows, offset);
    rows.forEach((source, index) => { dictionary[source] = values[index]; });
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  dictionaries[key] = dictionary;
  console.log(`${key}: ${Object.keys(dictionary).length} strings`);
}
for (const [locale, dictionary] of Object.entries(dictionaries)) {
  for (const source of sources) {
    const value = dictionary[source];
    if (!value?.trim()) throw new Error(`${locale} is missing a translation`);
    for (const token of source.match(/\{[^}]+\}/gu) ?? []) if (!value.includes(token)) throw new Error(`${locale} lost placeholder ${token} in ${source}`);
  }
}
await writeFile(new URL('../../src/markets-no-ch/carbon-footprint-translations.mjs', import.meta.url), `// Static translated copy; this build script is never used by published pages.\nexport const carbonFootprintTranslationsByLocale = Object.freeze(${JSON.stringify(dictionaries)});\n`);
console.log(`Wrote static translations for ${Object.keys(dictionaries).length} locales.`);

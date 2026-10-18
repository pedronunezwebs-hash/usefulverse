import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { english } from '../../src/markets-no-ch/copy-en.mjs';

const locales = [...localeEntries, { key: 'nb', code: 'nb-NO', name: 'Norsk bokmål', prefix: '/nb' }]
  .filter(({ key }) => key !== 'en');
const languageCode = (locale) => ({ pt: 'pt-BR', zh: 'zh-CN', zh_tw: 'zh-TW', tl: 'fil', nb: 'no' })[locale] ?? locale;
const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const sources = flatten(english.norwayWealthTax);
if (sources.length !== 59) throw new Error(`Expected 59 source strings; found ${sources.length}.`);
const marker = (index) => `UVNWX${String(index).padStart(4, '0')}X`;
const checkpointUrl = new URL('../../norway-wealth-tax-translation-checkpoint.json', import.meta.url);
const localeOverrides = {
  uk: { 'Norway Wealth Tax Calculator': 'Калькулятор податку на майно в Норвегії' },
  tl: { 'Norway Wealth Tax Calculator': 'Kalkulador ng buwis sa yaman ng Norway' },
};

async function translateOne(locale, source) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'gtx', sl: 'en', tl: languageCode(locale), dt: 't', q: source })) url.searchParams.set(key, value);
  const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
  if (!response.ok) throw new Error(`Google Translate returned HTTP ${response.status} for ${locale}.`);
  const data = await response.json();
  const value = Array.isArray(data?.[0]) ? data[0].map(([translated]) => translated ?? '').join('').replace(/\s+/gu, ' ').trim() : '';
  if (!value) throw new Error(`Google Translate returned an empty ${locale} string.`);
  return value;
}

async function translateBatch(locale, rows, offset) {
  const text = rows.map((source, index) => `${marker(offset + index)}|${source}`).join('\n');
  if (text.length > 2800) throw new Error(`Translation batch exceeded 2,800 characters for ${locale}.`);
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'gtx', sl: 'en', tl: languageCode(locale), dt: 't', q: text })) url.searchParams.set(key, value);
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
      if (!response.ok) throw new Error(`Google Translate returned HTTP ${response.status} for ${locale}.`);
      const data = await response.json();
      const joined = Array.isArray(data?.[0]) ? data[0].map(([translated]) => translated ?? '').join('') : '';
      const values = [];
      for (let index = 0; index < rows.length; index += 1) {
        const currentMarker = marker(offset + index);
        const start = joined.indexOf(`${currentMarker}|`);
        if (start < 0) throw new Error(`Google Translate omitted ${locale} marker ${offset + index + 1}.`);
        const valueStart = start + currentMarker.length + 1;
        const nextMarker = index + 1 < rows.length ? joined.indexOf(`${marker(offset + index + 1)}|`, valueStart) : joined.length;
        if (index + 1 < rows.length && nextMarker < 0) throw new Error(`Google Translate omitted ${locale} marker ${offset + index + 2}.`);
        const value = joined.slice(valueStart, nextMarker < 0 ? joined.length : nextMarker).replace(/\s+/gu, ' ').trim();
        if (!value || /UVNWX\d{4}X/u.test(value)) throw new Error(`Google Translate returned a malformed ${locale} row ${offset + index + 1}.`);
        values.push(value);
      }
      if (values.length !== rows.length) throw new Error(`Google Translate returned an incomplete batch for ${locale}.`);
      return values;
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 700 * (attempt + 1)));
    }
  }
  throw lastError;
}

let dictionaries = {};
try { dictionaries = JSON.parse(await readFile(checkpointUrl, 'utf8')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
for (const { key: locale } of locales) {
  if (Array.isArray(dictionaries[locale]) && dictionaries[locale].length === sources.length && dictionaries[locale].every((value) => typeof value === 'string' && value.trim())) {
    console.log(`${locale}: checkpoint ${sources.length}/${sources.length}`);
    continue;
  }
  const translated = [];
  try {
    for (let offset = 0; offset < sources.length; offset += 12) {
      const rows = sources.slice(offset, offset + 12);
      translated.push(...await translateBatch(locale, rows, offset));
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
  } catch (batchError) {
    console.warn(`${locale}: batch markers were unreliable; retrying its strings individually (${batchError.message}).`);
    translated.length = 0;
    for (let index = 0; index < sources.length; index += 1) {
      let lastError;
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try { translated.push(await translateOne(locale, sources[index])); lastError = null; break; }
        catch (error) { lastError = error; if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1))); }
      }
      if (lastError) throw lastError;
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
  }
  if (translated.length !== sources.length || translated.some((value) => !value.trim())) {
    throw new Error(`${locale} translation pack is incomplete.`);
  }
  dictionaries[locale] = translated;
  await writeFile(checkpointUrl, `${JSON.stringify(dictionaries)}\n`);
  console.log(`${locale}: ${translated.length}/${sources.length}`);
}

if (Object.keys(dictionaries).length !== locales.length) throw new Error('Not all locale packs were generated.');
const localeMaps = Object.fromEntries(locales.map(({ key }) => [key, Object.fromEntries(sources.map((source, index) => [source, dictionaries[key][index]]))]));
for (const [locale, overrides] of Object.entries(localeOverrides)) Object.assign(localeMaps[locale], overrides);
const output = `// Static machine-translated strings. No translation service is called at runtime.\nexport const norwayWealthTaxTranslationsByLocale = Object.freeze(${JSON.stringify(localeMaps)});\n`;
await writeFile(new URL('../../src/markets-no-ch/norway-wealth-tax-translations.mjs', import.meta.url), output);
console.log(`Wrote ${Object.keys(dictionaries).length} complete locale packs × ${sources.length} strings.`);

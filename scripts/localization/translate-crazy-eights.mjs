import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';
import { crazyEightsEnglish } from '../../src/markets-no-ch/crazy-eights-copy-en.mjs';
import { crazyEightsTranslationsByLocale } from '../../src/markets-no-ch/crazy-eights-translations.mjs';

const locales = [...localeEntries, { key: 'nb', code: 'nb-NO', name: 'Norsk bokmål', prefix: '/nb' }].filter(({ key }) => key !== 'en');
const languageCode = (locale) => ({ pt: 'pt-BR', zh: 'zh-CN', zh_tw: 'zh-TW', tl: 'fil', nb: 'no' })[locale] ?? locale;
const flatten = (value, out = []) => {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, out));
  return out;
};
const genericEnglish = new Set(Object.keys(translationsByLocale.es));
const sources = [...new Set(flatten(crazyEightsEnglish).filter((text) => !genericEnglish.has(text)))];
const marker = (index) => `UVCE${String(index).padStart(5, '0')}X`;
const protectedRows = sources.map((source, index) => ({
  source,
  text: source.replace(/\{([^{}]+)\}/gu, (_, name) => `UVPLACEHOLDER${name.toUpperCase()}X`),
  marker: marker(index),
}));
const checkpointPath = '/private/tmp/usefulverse-crazy-eights-translations.json';
const outputPath = new URL('../../src/markets-no-ch/crazy-eights-translations.mjs', import.meta.url);
let packs = Object.fromEntries(Object.entries(crazyEightsTranslationsByLocale).map(([locale, dictionary]) => [locale, { ...dictionary }]));
try {
  const checkpoint = JSON.parse(await readFile(checkpointPath, 'utf8'));
  for (const [locale, dictionary] of Object.entries(checkpoint)) packs[locale] = { ...packs[locale], ...dictionary };
} catch (error) { if (error.code !== 'ENOENT') throw error; }

async function translateBatch(language, rows) {
  const q = rows.map((row) => `${row.marker}|${row.text}`).join('\n');
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'gtx', sl: 'en', tl: languageCode(language), dt: 't', q })) url.searchParams.set(key, value);
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after');
        throw Object.assign(new Error(`Translation service rate-limited ${language}${retryAfter ? `; Retry-After: ${retryAfter}` : ''}. Stop and use the free web interface.`), { rateLimited: true });
      }
      if (!response.ok) throw new Error(`Translation service returned HTTP ${response.status} for ${language}.`);
      const data = await response.json();
      const translated = Array.isArray(data?.[0]) ? data[0].map(([value]) => value ?? '').join('') : '';
      const found = [];
      for (let index = 0; index < rows.length; index += 1) {
        const start = translated.indexOf(`${rows[index].marker}|`);
        if (start < 0) throw new Error(`Missing translation marker for ${language}, row ${index}.`);
        const valueStart = start + rows[index].marker.length + 1;
        const next = index + 1 < rows.length ? translated.indexOf(`${rows[index + 1].marker}|`, valueStart) : translated.length;
        let value = translated.slice(valueStart, next).trim();
        const protectedTokens = [...rows[index].text.matchAll(/UVPLACEHOLDER[A-Z]+X/gu)].map(([token]) => token);
        if (protectedTokens.some((token) => value.split(token).length - 1 !== 1)) throw new Error(`A protected variable changed for ${language}, row ${index}.`);
        value = value.replace(/UVPLACEHOLDER([A-Z]+)X/gu, (_, name) => `{${name.toLowerCase()}}`);
        if (!value || /UVCE\d{5}X/u.test(value)) throw new Error(`Incomplete translation for ${language}, row ${index}.`);
        found.push(value);
      }
      return found;
    } catch (error) {
      if (error.rateLimited) throw error;
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  throw lastError;
}

const packs = {};
for (const { key: locale } of locales) {
  const dictionary = packs[locale] ?? {};
  for (const key of Object.keys(dictionary)) if (!sources.includes(key)) delete dictionary[key];
  for (let offset = 0; offset < protectedRows.length; offset += 10) {
    const rows = protectedRows.slice(offset, offset + 10).filter(({ source }) => typeof dictionary[source] !== 'string' || !dictionary[source].trim());
    if (!rows.length) continue;
    if (rows.map(({ text }) => text).join('\n').length > 3000) throw new Error('Translation request exceeded the conservative batch size.');
    const values = await translateBatch(locale, rows);
    rows.forEach(({ source }, index) => { dictionary[source] = values[index]; });
    packs[locale] = dictionary;
    await writeFile(checkpointPath, JSON.stringify(packs));
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  if (Object.keys(dictionary).length !== sources.length) throw new Error(`${locale} has an incomplete translation pack.`);
  packs[locale] = dictionary;
  console.log(`${locale}: ${Object.keys(dictionary).length} strings`);
}
await writeFile(outputPath, `// Static machine-translated UI copy; visitors make no translation requests.\nexport const crazyEightsTranslationsByLocale = Object.freeze(${JSON.stringify(packs)});\n`);
console.log(`Wrote ${Object.keys(packs).length} locale packs for ${sources.length} distinct strings.`);

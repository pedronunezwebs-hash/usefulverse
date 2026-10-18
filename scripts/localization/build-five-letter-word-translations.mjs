import { writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { fiveLetterWordEnglish as english } from '../../src/markets-no-ch/five-letter-word-copy-en.mjs';

const locales = [...localeEntries, { key: 'nb', code: 'nb-NO' }];
const langCode = (key) => ({ pt: 'pt-BR', zh: 'zh-CN', zh_tw: 'zh-TW', tl: 'fil', nb: 'no' })[key] ?? key;
const collect = (value, out = []) => { if (typeof value === 'string') out.push(value); else if (Array.isArray(value)) value.forEach((item) => collect(item, out)); else if (value && typeof value === 'object') Object.values(value).forEach((item) => collect(item, out)); return out; };
const sources = [...new Set(collect(english))];
const packs = { en: Object.fromEntries(sources.map((source) => [source, source])) };
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
for (const locale of locales.filter(({ key }) => key !== 'en')) {
  const dictionary = {};
  for (let start = 0; start < sources.length; start += 8) {
    const batch = sources.slice(start, start + 8);
    const markers = batch.map((_, offset) => `UWF${String(start + offset).padStart(3, '0')}X`);
    const variableValues = batch.map((text, offset) => {
      const values = [];
      const protectedText = text.replace(/\{[^{}]+\}/gu, (token) => { const marker = `UWT${String(start + offset).padStart(3, '0')}V${values.length}X`; values.push([marker, token]); return marker; });
      return { protectedText, values };
    });
    const payload = batch.map((_, offset) => `${markers[offset]}|${variableValues[offset].protectedText}`).join('\n');
    const url = new URL('https://translate.googleapis.com/translate_a/single');
    for (const [key, value] of Object.entries({ client: 'gtx', sl: 'en', tl: langCode(locale.key), dt: 't', q: payload })) url.searchParams.set(key, value);
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`Translation failed for ${locale.key}: HTTP ${response.status}`);
    const data = await response.json();
    const translated = Array.isArray(data?.[0]) ? data[0].map(([text]) => text ?? '').join('') : '';
    for (let offset = 0; offset < batch.length; offset += 1) {
      const pattern = new RegExp(`${markers[offset]}\\s*\\|?\\s*([\\s\\S]*?)(?=UWF\\d{3}X|$)`, 'u');
      let value = translated.match(pattern)?.[1]?.trim();
      if (!value) {
        const single = new URL('https://translate.googleapis.com/translate_a/single');
        for (const [key, item] of Object.entries({ client: 'gtx', sl: 'en', tl: langCode(locale.key), dt: 't', q: variableValues[offset].protectedText })) single.searchParams.set(key, item);
        const retry = await fetch(single, { signal: AbortSignal.timeout(30000) });
        const retryData = await retry.json();
        value = Array.isArray(retryData?.[0]) ? retryData[0].map(([text]) => text ?? '').join('').trim() : '';
      }
      if (!value) throw new Error(`Empty translation for ${locale.key}: ${batch[offset]}`);
      for (const [marker, token] of variableValues[offset].values) {
        if (!value.includes(marker)) throw new Error(`Lost placeholder marker in ${locale.key}: ${batch[offset]}`);
        value = value.replace(marker, token);
      }
      const tokens = batch[offset].match(/\{[^{}]+\}/gu) ?? [];
      if (tokens.some((token) => !value.includes(token))) throw new Error(`Lost placeholder in ${locale.key}: ${batch[offset]}`);
      dictionary[batch[offset]] = value.replace(/[\u200b-\u200f\u2060\ufeff]/gu, '');
    }
    await wait(120);
  }
  packs[locale.key] = dictionary;
  console.log(`Translated ${locale.key}: ${sources.length} strings`);
}
const output = `export const fiveLetterWordTranslationsByLocale = Object.freeze(${JSON.stringify(packs)});\n`;
await writeFile(new URL('../../src/markets-no-ch/five-letter-word-translations.mjs', import.meta.url), output);

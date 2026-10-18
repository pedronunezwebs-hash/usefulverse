import { writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { swissAhvPensionEnglish } from '../../src/markets-no-ch/swiss-ahv-pension-copy-en.mjs';

const locales = [...localeEntries, { key: 'nb' }].filter(({ key }) => key !== 'en');
const mapLanguage = (key) => ({ pt: 'pt-BR', zh: 'zh-CN', zh_tw: 'zh-TW', tl: 'fil', nb: 'no' })[key] ?? key;
const collect = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((entry) => collect(entry, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((entry) => collect(entry, output));
  return output;
};
const sources = [...new Set(collect(swissAhvPensionEnglish))];
const translate = async ({ key }) => {
  const dictionary = {};
  for (let start = 0; start < sources.length; start += 8) {
    const batch = sources.slice(start, start + 8);
    const url = new URL('https://translate.googleapis.com/translate_a/single');
    const marked = batch.map((source, index) => `UVAVS${String(index).padStart(2, '0')}|${source}`).join('\n');
    for (const [name, value] of Object.entries({ client: 'gtx', sl: 'en', tl: mapLanguage(key), dt: 't', q: marked })) url.searchParams.set(name, value);
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`Translation failed for ${key}: HTTP ${response.status}`);
    const payload = await response.json();
    const result = Array.isArray(payload?.[0]) ? payload[0].map(([part]) => part ?? '').join('') : '';
    for (let index = 0; index < batch.length; index += 1) {
      const marker = `UVAVS${String(index).padStart(2, '0')}`;
      const match = result.match(new RegExp(`${marker}\\s*\\|?\\s*([\\s\\S]*?)(?=UVAVS\\d{2}|$)`, 'u'));
      let value = match?.[1]?.trim();
      if (!value || value === batch[index]) {
        const retry = new URL('https://translate.googleapis.com/translate_a/single');
        for (const [name, item] of Object.entries({ client: 'gtx', sl: 'en', tl: mapLanguage(key), dt: 't', q: batch[index] })) retry.searchParams.set(name, item);
        const retryResponse = await fetch(retry, { signal: AbortSignal.timeout(30000) });
        if (!retryResponse.ok) throw new Error(`Translation retry failed for ${key}: HTTP ${retryResponse.status}`);
        const retryData = await retryResponse.json();
        value = Array.isArray(retryData?.[0]) ? retryData[0].map(([part]) => part ?? '').join('').trim() : '';
      }
      if (!value) throw new Error(`Missing translation for ${key}: ${batch[index]}`);
      dictionary[batch[index]] = value;
    }
  }
  console.log(`Translated ${key}`);
  return [key, dictionary];
};
const queue = [...locales];
const packs = {};
const workers = Array.from({ length: 3 }, async () => {
  while (queue.length) {
    const locale = queue.shift();
    const [key, dictionary] = await translate(locale);
    packs[key] = dictionary;
  }
});
await Promise.all(workers);
const ordered = Object.fromEntries(locales.map(({ key }) => [key, packs[key]]));
await writeFile(new URL('../../src/markets-no-ch/swiss-ahv-pension-translations.mjs', import.meta.url), `// Static translations generated once; no translation request runs for visitors.\nexport const swissAhvPensionTranslationsByLocale = Object.freeze(${JSON.stringify(ordered)});\n`);
console.log(`Generated ${sources.length} static source strings for ${locales.length} non-English locales.`);

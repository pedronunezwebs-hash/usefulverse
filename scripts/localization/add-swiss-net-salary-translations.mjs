import { writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { swissNetSalaryEnglish } from '../../src/markets-no-ch/swiss-net-salary-copy-en.mjs';
import { swissNetSalaryTranslationsByLocale } from '../../src/markets-no-ch/swiss-net-salary-translations.mjs';

const locales = [...localeEntries, { key: 'nb' }].filter(({ key }) => key !== 'en');
const mapLanguage = (key) => ({ pt: 'pt-BR', zh: 'zh-CN', zh_tw: 'zh-TW', tl: 'fil', nb: 'no' })[key] ?? key;
const additions = ['employerShare', 'employerAhv', 'employerAlv', 'employerNote'];
const sources = additions.map((key) => swissNetSalaryEnglish.fields[key]);
const packs = Object.fromEntries(Object.entries(swissNetSalaryTranslationsByLocale).map(([locale, dictionary]) => [locale, { ...dictionary }]));
const translateLocale = async ({ key }) => {
  const missing = sources.filter((source) => !packs[key]?.[source]);
  if (!missing.length) return;
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  const text = missing.map((source, index) => `UVEMP${index}|${source}`).join('\n');
  for (const [name, value] of Object.entries({ client: 'gtx', sl: 'en', tl: mapLanguage(key), dt: 't', q: text })) url.searchParams.set(name, value);
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Translation failed for ${key}: HTTP ${response.status}`);
  const data = await response.json();
  const result = Array.isArray(data?.[0]) ? data[0].map(([part]) => part ?? '').join('') : '';
  for (let index = 0; index < missing.length; index += 1) {
    const marker = `UVEMP${index}`;
    const match = result.match(new RegExp(`${marker}\\s*\\|?\\s*([\\s\\S]*?)(?=UVEMP\\d+|$)`, 'u'));
    let value = match?.[1]?.trim();
    if (!value) {
      const retry = new URL('https://translate.googleapis.com/translate_a/single');
      for (const [name, item] of Object.entries({ client: 'gtx', sl: 'en', tl: mapLanguage(key), dt: 't', q: missing[index] })) retry.searchParams.set(name, item);
      const retryResponse = await fetch(retry, { signal: AbortSignal.timeout(30000) });
      if (!retryResponse.ok) throw new Error(`Translation retry failed for ${key}: HTTP ${retryResponse.status}`);
      const retryData = await retryResponse.json();
      value = Array.isArray(retryData?.[0]) ? retryData[0].map(([part]) => part ?? '').join('').trim() : '';
    }
    if (!value) throw new Error(`Empty translation for ${key}: ${missing[index]}`);
    packs[key][missing[index]] = value;
  }
  console.log(`Added employer contribution labels: ${key}`);
};

const queue = [...locales];
const workers = Array.from({ length: 5 }, async () => { while (queue.length) await translateLocale(queue.shift()); });
await Promise.all(workers);
const output = `// Static translations, generated once; no translation request runs for visitors.\nexport const swissNetSalaryTranslationsByLocale = Object.freeze(${JSON.stringify(packs)});\n`;
await writeFile(new URL('../../src/markets-no-ch/swiss-net-salary-translations.mjs', import.meta.url), output);
console.log(`Added ${sources.length} strings for ${locales.length} locale packs.`);

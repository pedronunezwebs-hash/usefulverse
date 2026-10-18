import { writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { localeEntries } from '../../src/locales.mjs';
import { swissNetSalaryEnglish } from '../../src/markets-no-ch/swiss-net-salary-copy-en.mjs';

const locales = [...localeEntries, { key: 'nb' }].filter(({ key }) => key !== 'en');
const languageCode = (locale) => ({ pt: 'pt-BR', zh: 'zh-CN', zh_tw: 'zh-TW', tl: 'fil', nb: 'no' })[locale] ?? locale;
const flatten = (value, out = []) => {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, out));
  return out;
};
const strings = [...new Set(flatten(swissNetSalaryEnglish))];
const checkpoint = join(tmpdir(), 'usefulverse-swiss-net-salary-translations-v2.json');
const packs = {};
try { Object.assign(packs, JSON.parse(await (await import('node:fs/promises')).readFile(checkpoint, 'utf8'))); } catch {}
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

for (const { key } of locales) {
  if (packs[key]?.length === strings.length) continue;
  const translated = [];
  for (let start = 0; start < strings.length; start += 8) {
    const batch = strings.slice(start, start + 8);
    const markers = batch.map((_, i) => `USN${String(start + i).padStart(3, '0')}X`);
    const source = batch.map((text, i) => `${markers[i]}|${text.replace(/\{[^{}]+\}/gu, (token, offset) => `UV${String(start + i).padStart(3, '0')}P${offset}X`)}`).join('\n');
    const url = new URL('https://translate.googleapis.com/translate_a/single');
    for (const [name, value] of Object.entries({ client: 'gtx', sl: 'en', tl: languageCode(key), dt: 't', q: source })) url.searchParams.set(name, value);
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`Translation failed for ${key}: HTTP ${response.status}`);
    const data = await response.json();
    const text = Array.isArray(data?.[0]) ? data[0].map(([part]) => part ?? '').join('') : '';
    for (let i = 0; i < batch.length; i += 1) {
      const pattern = new RegExp(`${markers[i]}\\s*\\|?\\s*([\\s\\S]*?)(?=USN\\d{3}X|$)`, 'u');
      let value = text.match(pattern)?.[1]?.trim();
      if (!value) {
        const retry = new URL('https://translate.googleapis.com/translate_a/single');
        for (const [name, entry] of Object.entries({ client: 'gtx', sl: 'en', tl: languageCode(key), dt: 't', q: batch[i] })) retry.searchParams.set(name, entry);
        const again = await fetch(retry, { signal: AbortSignal.timeout(30000) });
        if (!again.ok) throw new Error(`Translation retry failed for ${key}: HTTP ${again.status}`);
        const retryData = await again.json();
        value = Array.isArray(retryData?.[0]) ? retryData[0].map(([part]) => part ?? '').join('').trim() : '';
      }
      if (!value) throw new Error(`Empty translation for ${key}: ${batch[i]}`);
      for (const token of batch[i].match(/\{[^{}]+\}/gu) ?? []) {
        const marker = `UV${String(start + i).padStart(3, '0')}P${batch[i].indexOf(token)}X`;
        if (!value.includes(marker)) throw new Error(`Lost protected value in ${key}: ${batch[i]}`);
        value = value.replace(marker, token);
      }
      translated.push(value.replace(/[\u200b-\u200f\u2060\ufeff]/gu, '').trim());
    }
    await wait(90);
  }
  packs[key] = translated;
  await writeFile(checkpoint, JSON.stringify(packs));
  console.log(`Translated ${key}: ${translated.length} strings`);
}

const output = Object.fromEntries(Object.entries(packs).map(([locale, values]) => [locale, Object.fromEntries(strings.map((source, index) => [source, values[index]]))]));
await writeFile(new URL('../../src/markets-no-ch/swiss-net-salary-translations.mjs', import.meta.url), `// Static translations, generated once; no translation request runs for visitors.\nexport const swissNetSalaryTranslationsByLocale = Object.freeze(${JSON.stringify(output)});\n`);
console.log(`Wrote ${Object.keys(output).length} locale packs × ${strings.length} strings.`);

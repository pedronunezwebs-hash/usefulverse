import { readFile, unlink, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { swissPensionWithdrawalEnglish } from '../../src/markets-no-ch/swiss-pension-withdrawal-copy-en.mjs';

const locales = [...localeEntries, { key: 'nb' }].filter(({ key }) => key !== 'en');
const mapLanguage = (key) => ({ pt: 'pt-BR', zh: 'zh-CN', zh_tw: 'zh-TW', tl: 'fil', nb: 'no' })[key] ?? key;
const collect = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((entry) => collect(entry, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((entry) => collect(entry, output));
  return output;
};
const sources = [...new Set(collect(swissPensionWithdrawalEnglish))];
const progressPath = '/private/tmp/usefulverse-swiss-pension-withdrawal-translations-progress.json';
const outputPath = new URL('../../src/markets-no-ch/swiss-pension-withdrawal-translations.mjs', import.meta.url);
let progress = {};
try { progress = JSON.parse(await readFile(progressPath, 'utf8')); } catch {}

for (const { key } of locales) {
  const dictionary = progress[key] ?? {};
  for (let start = 0; start < sources.length; start += 6) {
    const batch = sources.slice(start, start + 6).filter((source) => typeof dictionary[source] !== 'string' || !dictionary[source].trim());
    if (!batch.length) continue;
    const marked = batch.map((source, index) => `UVCH6${String(index).padStart(2, '0')}|${source}`).join('\n');
    const url = new URL('https://translate.googleapis.com/translate_a/single');
    for (const [name, value] of Object.entries({ client: 'gtx', sl: 'en', tl: mapLanguage(key), dt: 't', q: marked })) url.searchParams.set(name, value);
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (response.status === 429) throw new Error(`HTTP 429 for ${key}; stopped immediately. Progress is saved; do not retry until the rate limit clears.`);
    if (!response.ok) throw new Error(`Translation failed for ${key}: HTTP ${response.status}`);
    const payload = await response.json();
    const result = Array.isArray(payload?.[0]) ? payload[0].map(([part]) => part ?? '').join('') : '';
    for (let index = 0; index < batch.length; index += 1) {
      const marker = `UVCH6${String(index).padStart(2, '0')}`;
      const match = result.match(new RegExp(`${marker}\\s*\\|?\\s*([\\s\\S]*?)(?=UVCH6\\d{2}|$)`, 'u'));
      const value = match?.[1]?.trim();
      if (!value) throw new Error(`Missing translation for ${key}: ${batch[index]}`);
      dictionary[batch[index]] = value;
    }
    progress[key] = dictionary;
    await writeFile(progressPath, JSON.stringify(progress));
  }
  console.log(`Translated ${key}`);
}

const ordered = Object.fromEntries(locales.map(({ key }) => [key, progress[key]]));
await writeFile(outputPath, `// Static translations; no translation request runs for visitors.\nexport const swissPensionWithdrawalTranslationsByLocale = Object.freeze(${JSON.stringify(ordered)});\n`);
await unlink(progressPath).catch(() => {});
console.log(`Generated ${sources.length} source strings for ${locales.length} non-English locales.`);

import { readFile, unlink, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { swissBvgPensionEnglish } from '../../src/markets-no-ch/swiss-bvg-pension-copy-en.mjs';

const locales = [...localeEntries, { key: 'nb' }].filter(({ key }) => key !== 'en');
const mapLanguage = (key) => ({ pt: 'pt-BR', zh: 'zh-CN', zh_tw: 'zh-TW', tl: 'fil', nb: 'no' })[key] ?? key;
const collect = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((entry) => collect(entry, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((entry) => collect(entry, output));
  return output;
};
const sources = [...new Set(collect(swissBvgPensionEnglish))];
const progressPath = '/private/tmp/usefulverse-swiss-bvg-pension-translations-progress.json';
let progress = {};
try { progress = JSON.parse(await readFile(progressPath, 'utf8')); } catch {}
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const translateBatch = async (batch, locale) => {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  const marked = batch.map((source, index) => `UVBVG${String(index).padStart(2, '0')}|${source}`).join('\n');
  for (const [name, value] of Object.entries({ client: 'gtx', sl: 'en', tl: mapLanguage(locale), dt: 't', q: marked })) url.searchParams.set(name, value);
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (response.status === 429) {
      if (attempt === 3) throw new Error(`Translation rate limit remains active for ${locale}; stop and resume later.`);
      const retryAfter = Number(response.headers.get('retry-after'));
      const waitMs = retryAfter > 0 ? retryAfter * 1000 : Math.min(30_000 * (attempt + 1), 90_000);
      console.warn(`HTTP 429 for ${locale}; honoring a ${Math.ceil(waitMs / 1000)}s cooldown.`);
      await delay(waitMs);
      continue;
    }
    if (!response.ok) throw new Error(`Translation failed for ${locale}: HTTP ${response.status}`);
    const payload = await response.json();
    const translated = Array.isArray(payload?.[0]) ? payload[0].map(([part]) => part ?? '').join('') : '';
    const dictionary = {};
    for (let index = 0; index < batch.length; index += 1) {
      const marker = `UVBVG${String(index).padStart(2, '0')}`;
      const match = translated.match(new RegExp(`${marker}\\s*\\|?\\s*([\\s\\S]*?)(?=UVBVG\\d{2}|$)`, 'u'));
      const value = match?.[1]?.trim();
      if (!value) throw new Error(`Empty or missing translation for ${locale}: ${batch[index]}`);
      dictionary[batch[index]] = value;
    }
    return dictionary;
  }
  throw new Error(`Translation retries exhausted for ${locale}.`);
};
const packs = progress;
for (const { key } of locales) {
  const dictionary = packs[key] ?? {};
  for (let start = 0; start < sources.length; start += 8) {
    const batch = sources.slice(start, start + 8).filter((source) => typeof dictionary[source] !== 'string' || !dictionary[source].trim());
    if (!batch.length) continue;
    Object.assign(dictionary, await translateBatch(batch, key));
    packs[key] = dictionary;
    await writeFile(progressPath, JSON.stringify(packs));
    await delay(350);
  }
  console.log(`Translated ${key}`);
}
const output = new URL('../../src/markets-no-ch/swiss-bvg-pension-translations.mjs', import.meta.url);
await writeFile(output, `// Static translations generated once; no translation request runs for visitors.\nexport const swissBvgPensionTranslationsByLocale = Object.freeze(${JSON.stringify(packs)});\n`);
await unlink(progressPath).catch(() => {});
console.log(`Generated ${sources.length} static source strings for ${locales.length} non-English locales.`);

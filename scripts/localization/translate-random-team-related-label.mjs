import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { randomTeamGeneratorEnglishCopy } from '../../src/growth600/locales/random-team-generator.en.mjs';

const path = new URL('../../src/growth600/locales/random-team-generator-final.mjs', import.meta.url);
const source = await readFile(path, 'utf8');
const moduleUrl = `${path.href}?label=${Date.now()}`;
const translations = { ...(await import(moduleUrl)).default };
async function request(url, locale) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (response.ok) return response;
      if (response.status < 500 && response.status !== 429) throw new Error(`${locale}: HTTP ${response.status}`);
    } catch (error) { if (attempt === 2) throw error; }
    await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
  }
  throw new Error(`${locale}: translation retries exhausted`);
}
for (const { key } of localeEntries) {
  if (!translations[key]) throw new Error(`${key}: main localized copy is not ready yet`);
  if (key === 'en') translations[key].fields.relatedNamePicker = randomTeamGeneratorEnglishCopy.fields.relatedNamePicker;
  else {
    const url = new URL('https://translate.googleapis.com/translate_a/single');
    url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', key === 'zh_tw' ? 'zh-TW' : key); url.searchParams.set('dt', 't');
    url.searchParams.set('q', randomTeamGeneratorEnglishCopy.fields.relatedNamePicker);
    const response = await request(url, key);
    const text = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('').trim();
    if (!text) throw new Error(`${key}: empty related-tool label`);
    translations[key].fields.relatedNamePicker = text;
  }
  console.log(`${key}: related tool label ready`);
}
await writeFile(path, `${source.slice(0, source.indexOf('export default'))}export default Object.freeze(${JSON.stringify(translations)});\n`);

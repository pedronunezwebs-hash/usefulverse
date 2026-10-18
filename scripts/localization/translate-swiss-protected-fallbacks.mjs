import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { swissPillar3aEnglish } from '../../src/markets-no-ch/swiss-pillar-3a-copy-en.mjs';
import { swissBvgPensionEnglish } from '../../src/markets-no-ch/swiss-bvg-pension-copy-en.mjs';
import { swissPensionWithdrawalEnglish } from '../../src/markets-no-ch/swiss-pension-withdrawal-copy-en.mjs';

const fallbackUrl = new URL('../../docs/markets-no-ch/CH004-CH006-translation-review-fallbacks.json', import.meta.url);
const checkpointUrl = new URL('./swiss-protected-fallback-full-checkpoint.json', import.meta.url);
const outputUrl = new URL('../../src/markets-no-ch/swiss-protected-fallback-full-translation-overrides.mjs', import.meta.url);
const locales = [...localeEntries, { key: 'nb' }];
const languageCode = (locale) => ({ pt: 'pt-BR', zh_tw: 'zh-TW', tl: 'fil', nb: 'no' })[locale] ?? locale;
const nap = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const tools = {
  'swiss-pillar-3a': ['swissPillar3a', swissPillar3aEnglish],
  'swiss-bvg-pension': ['swissBvgPension', swissBvgPensionEnglish],
  'swiss-pension-withdrawal': ['swissPensionWithdrawal', swissPensionWithdrawalEnglish],
};
const rows = JSON.parse(await readFile(fallbackUrl, 'utf8'));
const collect = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collect(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => collect(item, output));
  return output;
};
const fullSources = Object.fromEntries(Object.entries(tools).map(([slug, [, copy]]) => [slug, [...new Set(collect(copy))]]));
const pairs = new Map();
for (const row of rows) {
  const sources = fullSources[row.tool];
  if (!sources) throw new Error(`Unknown fallback tool: ${row.tool}`);
  const needle = row.source.trim();
  const full = sources.find((source) => source === row.source) ?? sources.find((source) => source.includes(needle));
  if (!full) throw new Error(`Could not map fallback fragment into full copy: ${row.tool}/${row.locale}/${row.source}`);
  pairs.set(`${row.tool}\u0000${row.locale}\u0000${full}`, { tool: row.tool, locale: row.locale, full });
}

let checkpoint = {};
try { checkpoint = JSON.parse(await readFile(checkpointUrl, 'utf8')); } catch { /* Start a fresh checkpoint. */ }
const output = {};
const numbersIn = (text) => [...text.matchAll(/\d+(?:[.,]\d+)*/gu)].map(([number]) => number);
function maskNumbers(source) {
  const numbers = [];
  const masked = source.replace(/\d+(?:[.,]\d+)*/gu, (number) => {
    const marker = `UVFULLNUMTOKEN${numbers.length}X`;
    numbers.push(number);
    return marker;
  });
  return { masked, numbers };
}
async function translate(locale, masked) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'gtx', sl: 'en', tl: languageCode(locale), dt: 't', q: masked })) url.searchParams.set(key, value);
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error(`Free translator returned HTTP ${response.status} for ${locale}.`);
      const data = await response.json();
      const result = Array.isArray(data?.[0]) ? data[0].map((part) => part?.[0] ?? '').join('') : '';
      if (!result.trim()) throw new Error(`Empty translation for ${locale}.`);
      return result.trim();
    } catch (error) { lastError = error; if (attempt < 3) await nap(800 * (attempt + 1)); }
  }
  throw lastError;
}

let accepted = 0;
let retained = 0;
let index = 0;
const completedPairs = [...pairs.values()];
for (const pair of completedPairs) {
  const key = `${pair.tool}\u0000${pair.locale}\u0000${pair.full}`;
  let result = checkpoint[key];
  if (typeof result !== 'string') {
    const { masked, numbers } = maskNumbers(pair.full);
    result = await translate(pair.locale, masked);
    const markersValid = numbers.every((_, numberIndex) => result.split(`UVFULLNUMTOKEN${numberIndex}X`).length === 2);
    if (markersValid) {
      numbers.forEach((number, numberIndex) => { result = result.replace(`UVFULLNUMTOKEN${numberIndex}X`, number); });
      if (numbersIn(result).sort().join('|') !== numbersIn(pair.full).sort().join('|')) result = '';
    } else result = '';
    if (!result.trim()) { result = pair.full; retained += 1; }
    checkpoint[key] = result;
    await writeFile(checkpointUrl, JSON.stringify(checkpoint));
    await nap(100);
  }
  const [mode] = tools[pair.tool];
  output[pair.locale] ??= {};
  output[pair.locale][mode] ??= {};
  output[pair.locale][mode][pair.full] = result;
  if (result === pair.full) retained += 0;
  else accepted += 1;
  index += 1;
  if (index % 25 === 0 || index === completedPairs.length) console.log(`${index}/${completedPairs.length} affected full strings translated; ${accepted} accepted and ${retained} newly kept in English after marker checks.`);
}

for (const { key } of locales) output[key] ??= {};
const moduleText = `// Static free-service translations of full clauses whose local translations changed protected numeric values. Each numeric marker was checked before the whole sentence override was accepted. Native review remains required.\nexport const swissProtectedFallbackFullTranslationOverridesByLocale = Object.freeze(${JSON.stringify(output)});\n`;
await writeFile(outputUrl, moduleText);
console.log(`Wrote ${completedPairs.length} full-source overrides from the ${rows.length}-row fallback inventory; native review remains required.`);

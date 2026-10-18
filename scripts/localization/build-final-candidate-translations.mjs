import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { localeEntries } from '../../src/locales.mjs';
import { remainingToolsEnglish } from '../../src/markets-no-ch/remaining-tools-copy-en.mjs';
import { resumeStructureEnglish } from '../../src/markets-no-ch/resume-structure-copy-en.mjs';
import { vocalRemoverEnglish } from '../../src/markets-no-ch/vocal-remover-copy-en.mjs';
import { swissHealthDeductibleEnglish } from '../../src/markets-no-ch/swiss-health-deductible-copy-en.mjs';
import { swissPremiumReductionEnglish } from '../../src/markets-no-ch/swiss-premium-reduction-copy-en.mjs';
import { swissRentAdjustmentEnglish } from '../../src/markets-no-ch/swiss-rent-adjustment-copy-en.mjs';
import { swissVacationAccrualEnglish } from '../../src/markets-no-ch/swiss-vacation-accrual-copy-en.mjs';

const locales = [...localeEntries.filter(({ key }) => key !== 'en'), { key: 'nb' }];
const checkpointUrl = new URL('./final-candidate-translations-checkpoint.json', import.meta.url);
const outputUrl = new URL('../../src/markets-no-ch/final-candidate-translations.mjs', import.meta.url);
const tools = [...Object.entries(remainingToolsEnglish).filter(([mode]) => mode !== 'resume'), ['resumeStructure', resumeStructureEnglish], ['vocalRemover', vocalRemoverEnglish], ['swissHealthDeductible', swissHealthDeductibleEnglish], ['swissPremiumReduction', swissPremiumReductionEnglish], ['swissRentAdjustment', swissRentAdjustmentEnglish], ['swissVacationAccrual', swissVacationAccrualEnglish]];
const sourcesSet = new Set();
const collect = (value) => { if (typeof value === 'string') sourcesSet.add(value); else if (Array.isArray(value)) value.forEach(collect); else if (value && typeof value === 'object') Object.values(value).forEach(collect); };
for (const [, copy] of tools) collect(copy);
const sources = [...sourcesSet];
const languageCode = (locale) => ({ pt: 'pt-BR', zh_tw: 'zh-TW', tl: 'fil', nb: 'no' })[locale] ?? locale;
const marker = (index) => `UVROW${String(index).padStart(5, '0')}X`;
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let packs = {};
try { packs = JSON.parse(await readFile(checkpointUrl, 'utf8')); } catch { /* Start a fresh static-translation checkpoint. */ }

async function translate(locale, rows, offset) {
  const query = rows.map((source, index) => `${marker(offset + index)}|${source}`).join('\n');
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'gtx', sl: 'en', tl: languageCode(locale), dt: 't', q: query })) url.searchParams.set(key, value);
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
      if (!response.ok) throw new Error(`Translator returned HTTP ${response.status} for ${locale}.`);
      const data = await response.json(); const text = Array.isArray(data?.[0]) ? data[0].map((part) => part?.[0] ?? '').join('') : '';
      const pattern = /UVROW\d{5}X\s*\|?\s*([\s\S]*?)(?=UVROW\d{5}X\s*\|?|$)/gu;
      const values = [...text.matchAll(pattern)].map((match) => match[1].trim());
      if (values.length === rows.length && values.every(Boolean)) return values;
      if (rows.length > 1) {
        const singles = [];
        for (const source of rows) {
          const singleUrl = new URL('https://translate.googleapis.com/translate_a/single');
          for (const [key, value] of Object.entries({ client: 'gtx', sl: 'en', tl: languageCode(locale), dt: 't', q: source })) singleUrl.searchParams.set(key, value);
          const singleResponse = await fetch(singleUrl, { signal: AbortSignal.timeout(12000) });
          if (!singleResponse.ok) throw new Error(`Translator returned HTTP ${singleResponse.status} for ${locale}.`);
          const singleData = await singleResponse.json(); const translated = Array.isArray(singleData?.[0]) ? singleData[0].map((part) => part?.[0] ?? '').join('') : '';
          if (!translated.trim()) throw new Error(`Single-string translation is empty for ${locale} at ${offset}.`);
          singles.push(translated.trim()); await pause(90);
        }
        return singles;
      }
      throw new Error(`Translation markers are incomplete for ${locale} batch ${offset}.`);
    } catch (error) { lastError = error; if (attempt < 2) await pause(600 * (attempt + 1)); }
  }
  throw lastError;
}

for (const locale of locales) {
  const dictionary = packs[locale.key] ?? {};
  for (const key of Object.keys(dictionary)) if (!sourcesSet.has(key)) delete dictionary[key];
  if (sources.every((source) => dictionary[source]?.trim()) && Object.keys(dictionary).length === sources.length) { console.log(`${locale.key}: recovered from checkpoint`); continue; }
  for (let offset = 0; offset < sources.length; offset += 8) {
    const batch = sources.slice(offset, offset + 8);
    if (batch.every((source) => dictionary[source]?.trim())) continue;
    const values = await translate(locale.key, batch, offset);
    batch.forEach((source, index) => { dictionary[source] = values[index]; });
    packs[locale.key] = dictionary;
    await writeFile(checkpointUrl, JSON.stringify(packs));
    if (offset % 40 === 0) console.log(`${locale.key}: ${Math.min(offset + batch.length, sources.length)}/${sources.length}`);
    await pause(120);
  }
  if (Object.keys(dictionary).length !== sources.length) throw new Error(`Translation coverage is incomplete for ${locale.key}.`);
  packs[locale.key] = dictionary;
  await writeFile(checkpointUrl, JSON.stringify(packs));
  console.log(`${locale.key}: ${Object.keys(dictionary).length}/${sources.length} strings`);
}

const localeKeys = locales.map(({ key }) => key);
for (const key of localeKeys) for (const source of sources) if (!packs[key]?.[source]?.trim()) throw new Error(`Missing static translation: ${key}/${source}`);
const moduleText = `// Static machine translations. Runtime pages make no translation requests.\nexport const finalCandidateTranslationsByLocale = Object.freeze(${JSON.stringify(packs)});\n`;
await writeFile(outputUrl, moduleText);
console.log(`Wrote ${localeKeys.length} locale dictionaries for ${tools.length} final tools (${sources.length} unique source strings). Native review is still required before publishing.`);

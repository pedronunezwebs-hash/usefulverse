// One-time static translation drafts. The published site never calls this service.
import { readFile, writeFile } from 'node:fs/promises';
import { locales, packs } from '../../src/locales.mjs';
import { habitTrackerEnglishCopy, habitTrackerUiKeys } from '../../src/locales/habit-tracker-source.mjs';

const outputUrl = new URL('../../src/locales/habit-tracker.mjs', import.meta.url);
const sourceRows = [
  ...habitTrackerUiKeys.map((source) => ({ kind: 'ui', source })),
  ...habitTrackerEnglishCopy.map((source, index) => ({ kind: 'copy', index, source })),
];
const languageCodes = {
  pt: 'pt-BR', zh_tw: 'zh-TW', tl: 'fil', ha: 'ha', am: 'am', gu: 'gu', mr: 'mr', te: 'te', ta: 'ta', fa: 'fa',
};
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

let output = {};
try {
  const moduleText = await readFile(outputUrl, 'utf8');
  const serialized = moduleText.match(/export const habitTrackerLocaleData = (.*);\s*$/su)?.[1];
  if (serialized) output = JSON.parse(serialized);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

async function translateBatch(language, locale, rows, batchIndex) {
  const marker = (index) => `ZUVHAB${String(batchIndex * 100 + index + 1).padStart(4, '0')}X`;
  const text = rows.map((row, index) => `${marker(index)} ${row.source}`).join('\n');
  const query = new URLSearchParams({ client: 'gtx', sl: 'en', tl: locale, dt: 't', q: text });
  let response;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    response = await fetch(`https://translate.googleapis.com/translate_a/single?${query}`);
    if (response.ok) break;
    if (attempt === 4 || response.status < 500 && response.status !== 429) throw new Error(`Google Translate request failed for ${language}: HTTP ${response.status}`);
    await wait(500 * 2 ** attempt);
  }
  let payload;
  try { payload = await response.json(); }
  catch { throw new Error(`Google Translate returned invalid data for ${language}.`); }
  const result = new Map();
  let activeId = null;
  for (const segments of payload[0] ?? []) {
    const translated = segments?.[0] ?? '';
    const source = segments?.[1] ?? '';
    const sourceMarkers = [...source.matchAll(/ZUVHAB(\d{4})X/gu)];
    if (sourceMarkers.length === 1) {
      activeId = Number(sourceMarkers[0][1]);
      const clean = translated.replace(/ZUVHAB\d{4}X/gu, '').trim();
      if (clean) result.set(activeId, `${result.get(activeId) ?? ''}${clean}`);
      continue;
    }
    const markers = [...translated.matchAll(/ZUVHAB(\d{4})X\s*/gu)];
    if (!markers.length) {
      if (activeId !== null) result.set(activeId, `${result.get(activeId) ?? ''}${translated}`);
      continue;
    }
    if (activeId !== null && translated.slice(0, markers[0].index)) result.set(activeId, `${result.get(activeId) ?? ''}${translated.slice(0, markers[0].index)}`);
    markers.forEach((match, index) => {
      activeId = Number(match[1]);
      const start = match.index + match[0].length;
      const end = markers[index + 1]?.index ?? translated.length;
      result.set(activeId, `${result.get(activeId) ?? ''}${translated.slice(start, end)}`);
    });
  }
  const values = [];
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    let value = result.get(batchIndex * 100 + index + 1)?.trim();
    if (!value) {
      // Very short labels can disappear when the free endpoint joins adjacent
      // lines; retry only that one label, keeping the common case batched.
      const singleQuery = new URLSearchParams({ client: 'gtx', sl: 'en', tl: locale, dt: 't', q: `ZUVHAB0001X ${row.source}` });
      let singleResponse;
      for (let attempt = 0; attempt < 5; attempt += 1) {
        singleResponse = await fetch(`https://translate.googleapis.com/translate_a/single?${singleQuery}`);
        if (singleResponse.ok) break;
        if (attempt === 4 || singleResponse.status < 500 && singleResponse.status !== 429) throw new Error(`Google Translate retry failed for ${language}: HTTP ${singleResponse.status}`);
        await wait(500 * 2 ** attempt);
      }
      const singlePayload = await singleResponse.json();
      value = (singlePayload[0] ?? []).map((segment) => segment?.[0] ?? '').join('').replace(/ZUVHAB\d{4}X/gu, '').trim();
    }
    if (!value) throw new Error(`Google Translate returned an empty row for ${language}: ${row.source}`);
    if ((value.match(/\{[^{}]+\}/gu) ?? []).sort().join('|') !== (row.source.match(/\{[^{}]+\}/gu) ?? []).sort().join('|')) {
      throw new Error(`A placeholder changed in ${language}: ${row.source}`);
    }
    values.push(value);
  }
  return values;
}

for (const language of Object.keys(locales).filter((key) => key !== 'en')) {
  const locale = languageCodes[language] ?? packs[language]?.meta?.code ?? language.replaceAll('_', '-');
  const existing = output[language];
  if (existing && habitTrackerUiKeys.every((key) => typeof existing.ui?.[key] === 'string') && existing.copy?.length === habitTrackerEnglishCopy.length) continue;
  const batches = [];
  let batch = [];
  let size = 0;
  for (const row of sourceRows) {
    const cost = row.source.length + 20;
    if (size + cost > 700 && batch.length) { batches.push(batch); batch = []; size = 0; }
    batch.push(row); size += cost;
  }
  if (batch.length) batches.push(batch);
  const translations = [];
  for (let index = 0; index < batches.length; index += 1) {
    translations.push(...await translateBatch(language, locale, batches[index], index));
    await wait(100);
  }
  const ui = Object.fromEntries(habitTrackerUiKeys.map((key, index) => [key, translations[index]]));
  const copy = translations.slice(habitTrackerUiKeys.length);
  output[language] = { ui, copy };
  await writeFile(outputUrl, `// Static translation drafts. The published site never calls a translation service.\nexport const habitTrackerLocaleData = ${JSON.stringify(output)};\n`);
  console.log(`${language}: ${translations.length} strings translated`);
}

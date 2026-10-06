// One-time static Google Translate drafts. This script is never called by the site or build.
import { readFile, writeFile } from 'node:fs/promises';
import { kanbanBoardEnglishCopy, kanbanBoardUiKeys } from '../../src/locales/kanban-board-source.mjs';
import { packs } from '../../src/locales.mjs';

const targets = Object.fromEntries(Object.entries(packs).map(([language, pack]) => [language, pack.meta.code]));
targets.es = 'es'; targets.fr = 'fr'; targets.pt = 'pt-BR'; targets.de = 'de';
const sources = [...kanbanBoardUiKeys, ...kanbanBoardEnglishCopy];
const output = {};

try {
  const existing = await readFile(new URL('../../src/locales/kanban-board.mjs', import.meta.url), 'utf8');
  const serialized = existing.match(/export const kanbanBoardLocaleData = (.*);\s*$/su)?.[1];
  if (serialized) Object.assign(output, JSON.parse(serialized));
} catch {}

async function translateBatch(language, locale, batch, batchIndex) {
  const text = batch.map((source, index) => `@@KBN${batchIndex * 100 + index + 1}@@ ${source}`).join('\n');
  const query = new URLSearchParams({ client: 'gtx', sl: 'en', tl: locale, dt: 't', q: text });
  const response = await fetch(`https://translate.googleapis.com/translate_a/single?${query}`);
  if (!response.ok) throw new Error(`Google Translate request failed for ${language}: HTTP ${response.status}`);
  const payload = await response.json();
  const result = new Map();
  let activeRow = null;
  for (const segments of payload[0] ?? []) {
    const translated = segments?.[0] ?? '';
    const markers = [...translated.matchAll(/@@KBN(\d+)@@\s*/gu)];
    if (!markers.length) {
      if (activeRow !== null) result.set(activeRow, `${result.get(activeRow) ?? ''}${translated}`);
      continue;
    }
    if (activeRow !== null && translated.slice(0, markers[0].index)) {
      result.set(activeRow, `${result.get(activeRow) ?? ''}${translated.slice(0, markers[0].index)}`);
    }
    markers.forEach((marker, index) => {
      activeRow = Number(marker[1]);
      const start = marker.index + marker[0].length;
      const end = markers[index + 1]?.index ?? translated.length;
      result.set(activeRow, `${result.get(activeRow) ?? ''}${translated.slice(start, end)}`);
    });
  }
  return batch.map((source, index) => {
    const value = result.get(batchIndex * 100 + index + 1);
    // Some locale targets are not supported by the free web endpoint (Hausa is one).
    // Reuse the site's existing shared UI translation where available, else keep English.
    return value || packs[language]?.[source] || source;
  });
}

for (const [language, locale] of Object.entries(targets)) {
  if (output[language]
    && kanbanBoardUiKeys.every((key) => Object.hasOwn(output[language].ui ?? {}, key))
    && output[language].copy?.length === kanbanBoardEnglishCopy.length) continue;
  const batches = [];
  let batch = []; let size = 0;
  for (const source of sources) {
    // Keep GET URLs short: the free web endpoint may return model metadata instead of
    // translations for long queries, and this simple public UI has no need for large batches.
    if (size + source.length > 850 && batch.length) { batches.push(batch); batch = []; size = 0; }
    batch.push(source); size += source.length + 24;
  }
  if (batch.length) batches.push(batch);
  const translated = [];
  for (let index = 0; index < batches.length; index += 1) translated.push(...await translateBatch(language, locale, batches[index], index));
  output[language] = {
    ui: Object.fromEntries(kanbanBoardUiKeys.map((key, index) => [key, translated[index]])),
    copy: translated.slice(kanbanBoardUiKeys.length),
  };
  const moduleText = `// Static translation drafts. The published site does not call a translation service.\nexport const kanbanBoardLocaleData = ${JSON.stringify(output)};\n`;
  await writeFile(new URL('../../src/locales/kanban-board.mjs', import.meta.url), moduleText);
  console.log(`${language}: ${translated.length} strings`);
}

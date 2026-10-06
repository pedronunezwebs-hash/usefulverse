// One-time static Google Translate drafts; never called by the site or build.
import { readFile, writeFile } from 'node:fs/promises';
import { readingSpeedEnglishCopy, readingSpeedSample, readingSpeedUiKeys } from '../../src/locales/reading-speed-source.mjs';
import { packs } from '../../src/locales.mjs';

const targets = Object.fromEntries(Object.entries(packs).map(([language, pack]) => [language, pack.meta.code]));
targets.es = 'es'; targets.fr = 'fr'; targets.pt = 'pt-BR'; targets.de = 'de';
const sources = [...readingSpeedUiKeys, readingSpeedSample, ...readingSpeedEnglishCopy];
const output = {};

try {
  const existing = await readFile(new URL('../../src/locales/reading-speed.mjs', import.meta.url), 'utf8');
  const serialized = existing.match(/export const readingSpeedLocaleData = (.*);\s*$/su)?.[1];
  if (serialized) Object.assign(output, JSON.parse(serialized));
} catch {}

for (const localized of Object.values(output)) {
  const label = localized.ui?.['Words: {count}'];
  if (label && !label.includes('{count}')) localized.ui['Words: {count}'] = label.replace(/\{[^{}]*\}/u, '{count}');
}
Object.assign(output.ja?.ui ?? {}, { Most: 'ほとんど' });
Object.assign(output.tl?.ui ?? {}, { 'Comprehension self-rating': 'Pagtataya sa pag-unawa' });

async function translate(language, locale, batch, offset) {
  const marked = batch.map((source, index) => `@@RDS${offset + index + 1}@@ ${source}`).join('\n');
  const query = new URLSearchParams({ client: 'gtx', sl: 'en', tl: locale, dt: 't', q: marked });
  const response = await fetch(`https://translate.googleapis.com/translate_a/single?${query}`);
  if (!response.ok) throw new Error(`Translation failed for ${language}: HTTP ${response.status}`);
  const payload = await response.json();
  const result = new Map(); let active = null;
  for (const segments of payload[0] ?? []) for (const segment of [segments]) {
    const text = segment?.[0] ?? ''; const markers = [...text.matchAll(/@@RDS(\d+)@@\s*/gu)];
    if (!markers.length) { if (active !== null) result.set(active, `${result.get(active) ?? ''}${text}`); continue; }
    if (active !== null && text.slice(0, markers[0].index)) result.set(active, `${result.get(active) ?? ''}${text.slice(0, markers[0].index)}`);
    markers.forEach((marker, index) => {
      active = Number(marker[1]); const start = marker.index + marker[0].length;
      result.set(active, `${result.get(active) ?? ''}${text.slice(start, markers[index + 1]?.index ?? text.length)}`);
    });
  }
  return batch.map((source, index) => result.get(offset + index + 1) || packs[language]?.[source] || source);
}

for (const [language, locale] of Object.entries(targets)) {
  if (output[language]?.ui && readingSpeedUiKeys.every((key) => Object.hasOwn(output[language].ui, key)) && output[language].copy?.length === readingSpeedEnglishCopy.length && output[language].sample) continue;
  const batches = []; let batch = []; let size = 0;
  for (const source of sources) {
    if (size + source.length > 800 && batch.length) { batches.push(batch); batch = []; size = 0; }
    batch.push(source); size += source.length + 22;
  }
  if (batch.length) batches.push(batch);
  const translated = [];
  for (let index = 0; index < batches.length; index++) translated.push(...await translate(language, locale, batches[index], index * 100));
  const sampleIndex = readingSpeedUiKeys.length;
  output[language] = {
    ui: Object.fromEntries(readingSpeedUiKeys.map((key, index) => [key, translated[index]])),
    sample: translated[sampleIndex],
    copy: translated.slice(sampleIndex + 1),
  };
  if (language === 'ha') {
    output.ha.sample = 'Tsarin karatu mai sauƙi yana taimaka maka ka maimaita atisaye. Zaɓi ɗan gajeren rubutu, ka guji abubuwan da ke ɗauke hankali, sannan ka karanta cikin saurin da ya dace. Bayan ka gama, ka tuna da babban ra’ayi da wani daki-daki. Lambar sauri kaɗai ba ta nuna abin da ka fahimta ba, don haka ka ɗauki sakamakon a matsayin ƙiyasin kawai.';
  }
  await writeFile(new URL('../../src/locales/reading-speed.mjs', import.meta.url), `// Static translation drafts; no translation service is called by the site.\nexport const readingSpeedLocaleData = ${JSON.stringify(output)};\n`);
  console.log(`${language}: ${translated.length} strings`);
}

await writeFile(new URL('../../src/locales/reading-speed.mjs', import.meta.url), `// Static translation drafts; no translation service is called by the site.\nexport const readingSpeedLocaleData = ${JSON.stringify(output)};\n`);

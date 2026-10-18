import { writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { dicomViewerEnglish } from '../../src/markets-no-ch/dicom-viewer-copy-en.mjs';
import { dicomViewerTranslationsByLocale } from '../../src/markets-no-ch/dicom-viewer-translations.mjs';

const locales = [...localeEntries, { key: 'nb' }].filter(({ key }) => key !== 'en');
const languageCode = (locale) => ({ pt: 'pt-BR', zh: 'zh-CN', zh_tw: 'zh-TW', tl: 'fil', nb: 'no' })[locale] ?? locale;
const flatten = (value, output = {}) => {
  if (typeof value === 'string') output[value] = value;
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const sources = Object.keys(flatten(dicomViewerEnglish));
const marker = (index) => `QZVKX${String(index).padStart(5, '0')}NQZ`;

async function translateBatch(locale, rows) {
  const query = rows.map(({ index, source }) => `${marker(index)}|${source}`).join('\n');
  const url = new URL('https://clients5.google.com/translate_a/t');
  for (const [key, value] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: languageCode(locale), q: query })) url.searchParams.set(key, value);
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
      if (!response.ok) throw new Error(`Translation returned HTTP ${response.status} for ${locale}.`);
      const data = await response.json();
      const translated = Array.isArray(data) && data.every((part) => typeof part === 'string')
        ? data.join('\n')
        : Array.isArray(data?.[0]) ? data[0].map((part) => part?.[0] ?? '').join('') : '';
      const markers = [...translated.matchAll(/QZVKX\d{5}NQZ/gu)];
      const values = rows.map(({ index }) => {
        const markerIndex = markers.findIndex((match) => match[0] === marker(index));
        if (markerIndex < 0) return '';
        const match = markers[markerIndex];
        let start = match.index + match[0].length;
        if (translated[start] === '|') start += 1;
        while (/\s/u.test(translated[start] ?? '')) start += 1;
        const end = markers[markerIndex + 1]?.index ?? translated.length;
        return translated.slice(start, end).trim();
      });
      if (values.length !== rows.length || values.some((value) => !value)) throw new Error(`Translation omitted a row in ${locale}.`);
      return values;
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 700 * (attempt + 1)));
    }
  }
  throw lastError;
}

async function translateSafely(locale, rows) {
  try {
    return await translateBatch(locale, rows);
  } catch (error) {
    if (rows.length === 1) {
      console.warn(`${locale}: public translator omitted one string; retaining its English source for this entry.`);
      return [rows[0].source];
    }
    const middle = Math.ceil(rows.length / 2);
    return [
      ...(await translateSafely(locale, rows.slice(0, middle))),
      ...(await translateSafely(locale, rows.slice(middle))),
    ];
  }
}

const packs = { ...dicomViewerTranslationsByLocale };
const manualOverrides = {
  ha: {
    'DICOM Viewer — Open Medical Images Privately in Your Browser': 'Mai nuna hotunan DICOM — buɗe hotunan likita cikin sirri a burauzarka',
    'The DICOM file is truncated or malformed.': 'Fayil ɗin DICOM ya lalace ko bai cika ba.',
    'Image dimensions exceed this viewer’s safe limit (2,048 per side and 4 megapixels per image).': 'Girman hoton ya wuce iyakar aminci na wannan mai kallo (pixels 2,048 a kowane gefe da megapixels 4 ga kowane hoto).',
    'This selection exceeds the safe series limit (100 files, 128 MiB input or 20 megapixels total). Select a smaller series.': 'Zaɓin ya wuce iyakar aminci ta jerin (fayil 100, shigarwar 128 MiB ko megapixels 20 gaba ɗaya). Zaɓi ƙaramin jerin.',
  },
};
for (const { key: locale } of locales) {
  if (packs[locale] && Object.keys(packs[locale]).length === sources.length && sources.every((source) => typeof packs[locale][source] === 'string' && packs[locale][source].trim())) {
    console.log(`${locale}: existing ${sources.length}-string static pack reused.`);
    continue;
  }
  const dictionary = { ...(packs[locale] ?? {}) };
  for (const key of Object.keys(dictionary)) if (!sources.includes(key)) delete dictionary[key];
  let batch = [];
  let batchLength = 0;
  const batches = [];
  const missing = sources.flatMap((source, index) => typeof dictionary[source] === 'string' && dictionary[source].trim() ? [] : [{ index, source }]);
  for (const item of missing) {
    const rowLength = item.source.length + 22;
    if (batch.length && (batch.length >= 4 || batchLength + rowLength > 900)) { batches.push(batch); batch = []; batchLength = 0; }
    batch.push(item); batchLength += rowLength;
  }
  if (batch.length) batches.push(batch);
  for (const batch of batches) {
    const translated = await translateSafely(locale, batch);
    batch.forEach((item, index) => { dictionary[item.source] = translated[index]; });
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
  if (Object.keys(dictionary).length !== sources.length || Object.values(dictionary).some((value) => !value.trim())) throw new Error(`${locale}: incomplete translation pack.`);
  packs[locale] = dictionary;
  const partial = `// Static, machine-translated UI copy. The published viewer does not call a translation service.\nexport const dicomViewerTranslationsByLocale = Object.freeze(${JSON.stringify(packs)});\n`;
  await writeFile(new URL('../../src/markets-no-ch/dicom-viewer-translations.mjs', import.meta.url), partial);
  console.log(`${locale}: ${Object.keys(dictionary).length} static strings prepared.`);
}

for (const [locale, overrides] of Object.entries(manualOverrides)) packs[locale] = { ...(packs[locale] ?? {}), ...overrides };

const output = `// Static, machine-translated UI copy. The published viewer does not call a translation service.\nexport const dicomViewerTranslationsByLocale = Object.freeze(${JSON.stringify(packs)});\n`;
await writeFile(new URL('../../src/markets-no-ch/dicom-viewer-translations.mjs', import.meta.url), output);
console.log(`Wrote ${Object.keys(packs).length} locale packs; review medical terminology before publication.`);

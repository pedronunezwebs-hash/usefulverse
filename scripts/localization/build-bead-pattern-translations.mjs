import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { beadPatternEnglish as english } from '../../src/markets-no-ch/bead-pattern-copy-en.mjs';

const locales = [...localeEntries, { key: 'nb', code: 'nb-NO' }];
const progressPath = new URL('../../src/markets-no-ch/.bead-pattern-translation-progress.json', import.meta.url);
const languageCode = (key) => ({ pt: 'pt-BR', zh: 'zh-CN', zh_tw: 'zh-TW', tl: 'fil', nb: 'no' })[key] ?? key;
const flatten = (value, out = []) => {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, out));
  return out;
};
const sources = [...new Set(flatten(english))];
const marker = (index) => `UVN023${String(index).padStart(4, '0')}X`;
const digitMap = {};
for (const base of [0x0660, 0x06f0, 0x0966, 0x09e6, 0x0a66, 0x0ae6, 0x0b66, 0x0be6, 0x0c66, 0x0ce6, 0x0d66, 0x0e50, 0x0ed0, 0x0f20, 0x1040, 0x17e0, 0x1810, 0xff10]) {
  for (let value = 0; value <= 9; value += 1) digitMap[String.fromCodePoint(base + value)] = String(value);
}
function numericTokens(text) {
  const normalized = [...text].map((character) => digitMap[character] ?? character).join('')
    .replace(/[\u066c\u060c]/gu, ',').replace(/\u066b/gu, '.')
    // A translated date may place a word between day and year (e.g. “17 October 2026”).
    // Keep the day and year separate so the thousands-grouping check cannot read “17 202”.
    .replace(/(^|[^\d])(\d{1,2})\s+\D{1,30}\s+(20\d{2})(?!\d)/gu, '$1$2#$3');
  const rawTokens = normalized.match(/\d{1,3}(?:(?:[ '\u00a0\u202f])\d{3})+(?:[.,]\d+)?|\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?/gu) ?? [];
  return rawTokens.map((raw) => {
    const groups = raw.replace(/[ '\u00a0\u202f]/gu, '').split(/[.,]/u);
    const canonical = groups.length > 1 && groups.slice(1).every((group) => group.length === 3)
      ? groups.join('')
      : groups.length > 1 ? groups.slice(0, -1).join('') + '.' + groups.at(-1) : groups[0];
    const normalizedNumber = canonical.includes('.') ? canonical.replace(/0+$/u, '').replace(/\.$/u, '') : canonical;
    // Thai translations may express Gregorian years as Buddhist Era years (Gregorian + 543).
    return /^\d{4}$/u.test(normalizedNumber) && Number(normalizedNumber) >= 2500 && Number(normalizedNumber) <= 2700
      ? String(Number(normalizedNumber) - 543)
      : normalizedNumber;
  }).sort();
}

async function translate(locale, rows, start) {
  const payload = rows.map((source, index) => `${marker(start + index)}|${source}`).join('\n');
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'gtx', sl: 'en', tl: languageCode(locale), dt: 't', q: payload })) url.searchParams.set(key, value);
  let error;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`Translation request failed for ${locale} (${response.status}).`);
      const data = await response.json();
      const result = Array.isArray(data?.[0]) ? data[0].map((part) => part?.[0] ?? '').join('') : '';
      const pattern = /UVN023(\d{4})X\s*\|?\s*([\s\S]*?)(?=UVN023\d{4}X\s*\|?|$)/giu;
      const values = new Map([...result.matchAll(pattern)].map((match) => [Number(match[1]), match[2].trim()]));
      for (let index = 0; index < rows.length; index += 1) {
        if (values.get(start + index)) continue;
        const singleUrl = new URL('https://translate.googleapis.com/translate_a/single');
        const singlePayload = `${marker(start + index)}|${rows[index]}`;
        for (const [key, value] of Object.entries({ client: 'gtx', sl: 'en', tl: languageCode(locale), dt: 't', q: singlePayload })) singleUrl.searchParams.set(key, value);
        let translated = '';
        for (let retry = 0; retry < 4 && !translated; retry += 1) {
          const singleResponse = await fetch(singleUrl, { signal: AbortSignal.timeout(30000) });
          if (!singleResponse.ok) throw new Error(`Translation retry failed for ${locale} (${singleResponse.status}).`);
          const singleData = await singleResponse.json();
          const singleText = Array.isArray(singleData?.[0]) ? singleData[0].map((part) => part?.[0] ?? '').join('') : '';
          const singlePattern = new RegExp(`${marker(start + index)}\\s*\\|?\\s*([\\s\\S]*)`, 'iu');
          const match = singleText.match(singlePattern);
          translated = match?.[1]?.trim() || '';
          if (retry < 3 && !translated) await new Promise((resolve) => setTimeout(resolve, 1000 * (retry + 1)));
        }
        if (!translated) {
          const plainUrl = new URL('https://translate.googleapis.com/translate_a/single');
          for (const [key, value] of Object.entries({ client: 'gtx', sl: 'en', tl: languageCode(locale), dt: 't', q: rows[index] })) plainUrl.searchParams.set(key, value);
          const plainResponse = await fetch(plainUrl, { signal: AbortSignal.timeout(30000) });
          if (!plainResponse.ok) throw new Error(`Unmarked translation retry failed for ${locale} (${plainResponse.status}).`);
          const plainData = await plainResponse.json();
          translated = Array.isArray(plainData?.[0]) ? plainData[0].map((part) => part?.[0] ?? '').join('').trim() : '';
        }
        if (!translated || translated.includes(marker(start + index))) throw new Error(`Could not translate row ${start + index} for ${locale}.`);
        values.set(start + index, translated);
        await new Promise((resolve) => setTimeout(resolve, 160));
      }
      return rows.map((_, index) => values.get(start + index).replace(/[\u200b-\u200f\u2060\ufeff]/gu, ''));
    } catch (caught) {
      error = caught;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
    }
  }
  throw error;
}

async function translateUnmarked(locale, source) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'gtx', sl: 'en', tl: languageCode(locale), dt: 't', q: source })) url.searchParams.set(key, value);
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`Unmarked translation failed for ${locale} (${response.status}).`);
      const data = await response.json();
      const translated = Array.isArray(data?.[0]) ? data[0].map((part) => part?.[0] ?? '').join('').trim() : '';
      if (translated) return translated;
    } catch (error) { lastError = error; }
    if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
  }
  throw lastError ?? new Error(`Unmarked translation was empty for ${locale}.`);
}

let packs = { en: Object.fromEntries(sources.map((source) => [source, source])) };
try { packs = { ...packs, ...JSON.parse(await readFile(progressPath, 'utf8')) }; } catch (error) { if (error.code !== 'ENOENT') throw error; }
for (const locale of locales.filter(({ key }) => key !== 'en')) {
  const previous = packs[locale.key] ?? {};
  const existing = Object.fromEntries(sources.filter((source) => previous[source]).map((source) => [source, previous[source].replace(/[\u200b-\u200f\u2060\ufeff]/gu, '')]));
  const missingSources = sources.filter((source) => !existing[source]);
  if (!missingSources.length) { packs[locale.key] = existing; continue; }
  const missingBatches = [];
  let nextBatch = [];
  let nextChars = 0;
  for (const source of missingSources) {
    if (nextBatch.length && (nextBatch.length >= 12 || nextChars + source.length + 24 > 3000)) {
      missingBatches.push(nextBatch); nextBatch = []; nextChars = 0;
    }
    nextBatch.push(source); nextChars += source.length + 24;
  }
  if (nextBatch.length) missingBatches.push(nextBatch);
  const translated = [];
  let offset = 0;
  for (const rows of missingBatches) {
    translated.push(...await translate(locale.key, rows, offset));
    offset += rows.length;
    await new Promise((resolve) => setTimeout(resolve, 140));
  }
  packs[locale.key] = { ...existing, ...Object.fromEntries(missingSources.map((source, index) => [source, translated[index]])) };
  await writeFile(progressPath, JSON.stringify(Object.fromEntries(Object.entries(packs).filter(([key]) => key !== 'en'))));
  console.log(`${locale.key}: ${Object.keys(packs[locale.key]).length} static strings`);
}

for (const locale of locales.filter(({ key }) => key !== 'en')) {
  if (Object.keys(packs[locale.key]).length !== sources.length || Object.values(packs[locale.key]).some((value) => !value?.trim())) throw new Error(`${locale.key}: incomplete translation pack.`);
  for (const source of sources) {
    const expected = numericTokens(source);
    let actual = numericTokens(packs[locale.key][source]);
    const missing = (tokens) => expected.some((token) => tokens.filter((entry) => entry === token).length < expected.filter((entry) => entry === token).length);
    if (missing(actual)) {
      packs[locale.key][source] = await translateUnmarked(locale.key, source);
      actual = numericTokens(packs[locale.key][source]);
      await writeFile(progressPath, JSON.stringify(Object.fromEntries(Object.entries(packs).filter(([key]) => key !== 'en'))));
      await new Promise((resolve) => setTimeout(resolve, 160));
    }
    if (missing(actual)) throw new Error(`${locale.key}: protected numbers changed in: ${source} -> ${packs[locale.key][source]}`);
  }
}
await writeFile(new URL('../../src/markets-no-ch/bead-pattern-translations.mjs', import.meta.url), `// Static generated copy; no translation requests run when the tool is used.\nexport const beadPatternTranslationsByLocale = Object.freeze(${JSON.stringify(packs)});\n`);
console.log(`Wrote ${sources.length} strings for ${Object.keys(packs).length} locales.`);

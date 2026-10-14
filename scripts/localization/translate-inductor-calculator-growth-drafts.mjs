import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { inductorCalculatorEnglishCopy as source } from '../../src/growth600/locales/inductor-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/inductor-calculator-final.mjs', import.meta.url);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (path.at(-1) !== 'copyLanguage') paths.push(path); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
collect(source);
function at(value, path) { return path.reduce((parent, key) => Array.isArray(parent) ? parent[Number(key)] : parent[key], value); }
function setAt(object, path, value) {
  let parent = object;
  for (const key of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(key)] : parent[key];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value;
  else parent[path.at(-1)] = value;
}
function normalize(value) {
  if (typeof value === 'string') return value.replace(/\s+/gu, ' ').trim();
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, normalize(child)]));
  return value;
}
const localeCode = (locale) => locale === 'zh_tw' ? 'zh-TW' : locale;
function fitTitle(copy) {
  const suffix = ' | UsefulVerse';
  let prefix = copy.title.split('|')[0].trim();
  prefix = prefix.slice(0, 60 - suffix.length).replace(/\s+\S*$/u, '').replace(/[,:;–—-]+$/u, '').trim();
  return `${prefix}${suffix}`;
}
async function translate(locale, phrases) {
  const markers = phrases.map((_, i) => `987654${String(i).padStart(4, '0')}456789`);
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'gtx', sl: 'en', tl: localeCode(locale), dt: 't' })) url.searchParams.set(key, value);
  url.searchParams.set('q', phrases.map((phrase, i) => `${markers[i]} ${phrase.replace(/\{[a-z][a-zA-Z0-9]*\}/gu, (token) => `UVTOKEN${token.slice(1, -1)}X`)}`).join('\n'));
  let response;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (response.ok) break;
    if (response.status !== 429 || attempt === 4) throw new Error(`Google Translate returned HTTP ${response.status} for ${locale}.`);
    const retryAfter = Number(response.headers.get('retry-after'));
    await new Promise((resolve) => setTimeout(resolve, Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1000 * (attempt + 1)));
  }
  const text = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('\n');
  const values = markers.map((marker, i) => {
    const start = text.indexOf(marker);
    const from = start < 0 ? -1 : start + marker.length;
    const next = markers.slice(i + 1).map((nextMarker) => text.indexOf(nextMarker, from)).find((position) => position >= 0);
    let output = from < 0 ? '' : text.slice(from, next ?? text.length).trim();
    output = output.replace(/UVTOKEN([a-z][a-zA-Z0-9]*)X/gu, '{$1}');
    for (const token of phrases[i].match(/\{[a-z][a-zA-Z0-9]*\}/gu) ?? []) if (!output.includes(token)) output = `${output} ${token}`.trim();
    return output;
  });
  for (let i = 0; i < values.length; i += 1) {
    if (values[i]) continue;
    const single = new URL(url);
    single.searchParams.set('q', phrases[i].replace(/\{[a-z][a-zA-Z0-9]*\}/gu, (token) => `UVTOKEN${token.slice(1, -1)}X`));
    let singleResponse;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      singleResponse = await fetch(single, { signal: AbortSignal.timeout(30000) });
      if (singleResponse.ok) break;
      if (singleResponse.status !== 429 || attempt === 4) throw new Error(`Google Translate fallback returned HTTP ${singleResponse.status} for ${locale}.`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
    let output = ((await singleResponse.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('').trim();
    output = output.replace(/UVTOKEN([a-z][a-zA-Z0-9]*)X/gu, '{$1}');
    for (const token of phrases[i].match(/\{[a-z][a-zA-Z0-9]*\}/gu) ?? []) if (!output.includes(token)) output = `${output} ${token}`.trim();
    values[i] = output;
  }
  return values;
}

const result = {};
for (const locale of Object.keys(locales)) {
  const draft = structuredClone(source);
  draft.copyLanguage = locale;
  if (locale !== 'en') {
    for (let start = 0; start < paths.length; start += 10) {
      const batchPaths = paths.slice(start, start + 10);
      const values = await translate(locale, batchPaths.map((path) => at(source, path)));
      if (values.some((value) => !value)) throw new Error(`Empty machine translation in ${locale}, batch ${start / 10 + 1}.`);
      values.forEach((value, index) => setAt(draft, batchPaths[index], value));
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    draft.localizationStatus = 'machine-accepted';
    draft.localizationAcceptedBy = 'site-owner';
    draft.localizationAcceptedAt = '2026-10-14';
  }
  draft.title = fitTitle(draft);
  if (draft.description.length > 160) draft.description = `${draft.description.slice(0, 157).replace(/\s+\S*$/u, '')}…`;
  result[locale] = normalize(draft);
}
if (Object.keys(result).length !== Object.keys(locales).length) throw new Error('Locale matrix is incomplete.');
for (const [locale, copy] of Object.entries(result)) {
  if (copy.copyLanguage !== locale || copy.title.length > 60 || copy.description.length > 160) throw new Error(`Invalid locale metadata for ${locale}.`);
}
await writeFile(target, '// Static machine-translated drafts, accepted for simple usability; no runtime translation or translation API.\nexport default Object.freeze(' + JSON.stringify(result) + ');\n');
console.log(`Saved ${Object.keys(result).length} static locale drafts.`);

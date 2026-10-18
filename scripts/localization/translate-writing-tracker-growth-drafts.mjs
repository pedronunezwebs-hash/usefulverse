import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { writingTrackerEnglishCopy as source } from '../../src/growth600/locales/writing-tracker.en.mjs';

const target = new URL('../../src/growth600/locales/writing-tracker-final.mjs', import.meta.url);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (path.at(-1) !== 'copyLanguage') paths.push(path); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
collect(source);
const at = (value, path) => path.reduce((parent, key) => Array.isArray(parent) ? parent[Number(key)] : parent[key], value);
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
  let prefix = copy.title.split('|')[0].trim().slice(0, 60 - suffix.length);
  prefix = prefix.replace(/\s+\S*$/u, '').replace(/[,:;–—-]+$/u, '').trim();
  return `${prefix}${suffix}`;
}
async function translate(locale, phrases) {
  const markers = phrases.map((_, index) => `887766${String(index).padStart(4, '0')}665588`);
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'gtx', sl: 'en', tl: localeCode(locale), dt: 't' })) url.searchParams.set(key, value);
  url.searchParams.set('q', phrases.map((phrase, index) => `${markers[index]} ${phrase}`).join('\n'));
  let response;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (response.ok) break;
    if (response.status !== 429 || attempt === 4) throw new Error(`Google Translate returned HTTP ${response.status} for ${locale}.`);
    const retryAfter = Number(response.headers.get('retry-after'));
    await new Promise((resolve) => setTimeout(resolve, Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : (attempt + 1) * 1000));
  }
  const text = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('\n');
  const values = markers.map((marker, index) => {
    const markerAt = text.indexOf(marker);
    if (markerAt < 0) return '';
    const start = markerAt + marker.length;
    const nextAt = markers.slice(index + 1).map((next) => text.indexOf(next, start)).find((position) => position >= 0);
    return text.slice(start, nextAt ?? text.length).trim();
  });
  for (let index = 0; index < values.length; index += 1) {
    if (values[index]) continue;
    const fallback = new URL(url);
    fallback.searchParams.set('q', phrases[index]);
    const fallbackResponse = await fetch(fallback, { signal: AbortSignal.timeout(30000) });
    if (!fallbackResponse.ok) throw new Error(`Google Translate fallback failed for ${locale}.`);
    values[index] = ((await fallbackResponse.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('').trim();
  }
  return values;
}

const result = {};
for (const locale of Object.keys(locales)) {
  const draft = structuredClone(source);
  draft.copyLanguage = locale;
  if (locale !== 'en') {
    for (let start = 0; start < paths.length; start += 10) {
      const batch = paths.slice(start, start + 10);
      const values = await translate(locale, batch.map((path) => at(source, path)));
      if (values.some((value) => !value)) throw new Error(`Empty translation in ${locale}, batch ${start / 10 + 1}.`);
      values.forEach((value, index) => {
        let restored = value;
        for (const token of at(source, batch[index]).match(/\{[a-z][a-zA-Z0-9]*\}/gu) ?? []) if (!restored.includes(token)) restored = `${restored} ${token}`.trim();
        setAt(draft, batch[index], restored);
      });
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    draft.localizationStatus = 'machine-accepted';
    draft.localizationAcceptedBy = 'site-owner';
    draft.localizationAcceptedAt = '2026-10-15';
  }
  draft.title = fitTitle(draft);
  if (draft.description.length > 160) draft.description = `${draft.description.slice(0, 157).replace(/\s+\S*$/u, '')}…`;
  result[locale] = normalize(draft);
}
if (Object.keys(result).length !== Object.keys(locales).length) throw new Error('Locale matrix is incomplete.');
for (const [locale, copy] of Object.entries(result)) if (copy.copyLanguage !== locale || copy.title.length > 60 || copy.description.length > 160) throw new Error(`Invalid SEO metadata for ${locale}.`);
await writeFile(target, '// Static machine-translated drafts, accepted for simple usability; no runtime translation or translation API.\nexport default Object.freeze(' + JSON.stringify(result) + ');\n');
console.log(`Saved ${Object.keys(result).length} static locale drafts.`);

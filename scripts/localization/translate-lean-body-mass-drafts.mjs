import { access, writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { leanBodyMassCalculatorEnglishCopy as source } from '../../src/growth600/locales/lean-body-mass-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/lean-body-mass-calculator-final.mjs', import.meta.url);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (path.at(-1) !== 'copyLanguage') paths.push(path); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
collect(source);
const at = (value, path) => path.reduce((parent, key) => parent[key], value);
function setAt(object, path, value) { let parent = object; for (const key of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(key)] : parent[key]; if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value; }
function hasAt(object, path) { let value = object; for (const key of path) { if (value == null || !(key in value)) return false; value = Array.isArray(value) ? value[Number(key)] : value[key]; } return true; }
const code = (locale) => locale === 'zh_tw' ? 'zh-TW' : locale;
const normalize = (value) => typeof value === 'string' ? value.replace(/\s+/gu, ' ').trim() : Array.isArray(value) ? value.map(normalize) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key, child]) => [key, normalize(child)])) : value;
function fitTitle(copy) { const suffix = ' | UsefulVerse'; const max = 60 - suffix.length; let prefix = copy.title.split('|')[0].trim(); if (prefix.length > max) prefix = prefix.slice(0, max).replace(/\s+\S*$/u, '').trim(); return prefix.replace(/[,:;–—-]+$/u, '').trim() + suffix; }
async function request(url, locale) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (response.ok) return response;
    if (response.status !== 429 || attempt === 5) throw new Error(`Translation request failed (${locale}, HTTP ${response.status}).`);
    const retryAfter = Number(response.headers.get('retry-after'));
    const wait = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : Math.min(2000 * (2 ** attempt), 30000);
    console.log(`${locale}: provider rate limit; retrying in ${Math.ceil(wait / 1000)}s`);
    await new Promise((resolve) => setTimeout(resolve, wait));
  }
  throw new Error(`Translation request exhausted retries (${locale}).`);
}
async function translateBatch(locale, phrases) {
  const markers = phrases.map((_, index) => '987654' + String(index).padStart(4, '0') + '456789');
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'gtx', sl: 'en', tl: code(locale), dt: 't' })) url.searchParams.set(key, value);
  url.searchParams.set('q', phrases.map((phrase, index) => markers[index] + ' ' + phrase.replace(/\{[a-z][a-zA-Z0-9]*\}/gu, (token) => 'UVTOKEN' + token.slice(1, -1) + 'X')).join('\n'));
  const response = await request(url, locale);
  const text = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('\n');
  const values = markers.map((marker, index) => { const start = text.indexOf(marker); if (start < 0) return ''; const from = start + marker.length; const next = markers.slice(index + 1).map((item) => text.indexOf(item, from)).find((position) => position >= 0); return text.slice(from, next ?? text.length).trim(); });
  for (let index = 0; index < values.length; index += 1) {
    if (!values[index]) {
      const retryUrl = new URL(url);
      retryUrl.searchParams.set('q', phrases[index].replace(/\{[a-z][a-zA-Z0-9]*\}/gu, (token) => 'UVTOKEN' + token.slice(1, -1) + 'X'));
      const retry = await request(retryUrl, locale);
      values[index] = ((await retry.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('').trim();
    }
    if (!values[index]) throw new Error(`Empty translation (${locale}, item ${index}).`);
    let restored = values[index].replace(/UVTOKEN([a-z][a-zA-Z0-9]*)X/gu, '{$1}');
    for (const token of phrases[index].match(/\{[a-z][a-zA-Z0-9]*\}/gu) ?? []) if (!restored.includes(token)) restored = restored.replace(/[.!?。！？؟\s]*$/u, '').trim() + ' ' + token;
    values[index] = restored;
  }
  return values;
}
let result = {};
try { await access(target); result = { ...(await import(target.href + '?resume=' + Date.now())).default }; } catch (error) { if (error.code !== 'ENOENT') throw error; }
for (const locale of Object.keys(locales)) {
  const draft = structuredClone(result[locale] ?? source);
  const missing = locale === 'en' ? paths.filter((path) => !hasAt(draft, path)) : paths.filter((path) => !hasAt(draft, path) || at(draft, path) === at(source, path));
  for (let start = 0; start < missing.length; start += 10) {
    console.log(`${locale}: batch ${start / 10 + 1}`);
    const values = await translateBatch(locale, missing.slice(start, start + 10).map((path) => at(source, path)));
    values.forEach((value, index) => setAt(draft, missing[start + index], value));
    draft.copyLanguage = locale;
    result[locale] = normalize(draft);
    await writeFile(target, '// Static machine-translated drafts; no runtime translation service.\nexport default Object.freeze(' + JSON.stringify(result) + ');\n');
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  draft.copyLanguage = locale;
  draft.title = fitTitle(draft);
  if (draft.description.length > 160) draft.description = draft.description.slice(0, 157).replace(/\s+\S*$/u, '') + '…';
  result[locale] = normalize(draft);
  await writeFile(target, '// Static machine-translated drafts; no runtime translation service.\nexport default Object.freeze(' + JSON.stringify(result) + ');\n');
  if (missing.length) console.log(`${locale}: translated ${missing.length} strings`);
}
if (Object.keys(result).length !== Object.keys(locales).length) throw new Error('Locale matrix is incomplete.');
for (const [locale, copy] of Object.entries(result)) if (copy.title.length > 60 || copy.description.length > 160 || copy.copyLanguage !== locale) throw new Error(`Invalid metadata (${locale}).`);
console.log(`Saved ${Object.keys(result).length} static locale drafts.`);

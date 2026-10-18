import { access, writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { mazeGeneratorEnglishCopy as source } from '../../src/growth600/locales/maze-generator.en.mjs';

const target = new URL('../../src/growth600/locales/maze-generator-final.mjs', import.meta.url);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (path.at(-1) !== 'copyLanguage') paths.push(path); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
collect(source);
const at = (value, path) => path.reduce((parent, key) => parent[key], value);
function setAtPath(object, path, value) { let parent = object; for (const key of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(key)] : parent[key]; if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value; }
function hasAtPath(object, path) { let value = object; for (const key of path) { if (value == null || !(key in value)) return false; value = Array.isArray(value) ? value[Number(key)] : value[key]; } return true; }
function targetCode(locale) { return locale === 'zh_tw' ? 'zh-TW' : locale; }
function normalize(value) { if (typeof value === 'string') return value.replace(/\s+/gu, ' ').trim(); if (Array.isArray(value)) return value.map(normalize); if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, normalize(child)])); return value; }
function fitTitle(copy) { const suffix = ' | UsefulVerse'; const max = 60 - suffix.length; let prefix = copy.title.split('|')[0].trim(); if (prefix.length > max) prefix = prefix.slice(0, max).replace(/\s+\S*$/u, '').trim(); return prefix.replace(/[,:;–—-]+$/u, '').trim() + suffix; }
async function translate(locale, phrases) {
  const markers = phrases.map((_, index) => '987654' + String(index).padStart(4, '0') + '456789');
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'gtx', sl: 'en', tl: targetCode(locale), dt: 't' })) url.searchParams.set(key, value);
  url.searchParams.set('q', phrases.map((phrase, index) => markers[index] + ' ' + phrase.replace(/\{[a-z][a-zA-Z0-9]*\}/gu, (token) => 'UVTOKEN' + token.slice(1, -1) + 'X')).join('\n'));
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error('Google Translate HTTP ' + response.status + ' (' + locale + ').');
  const text = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('\n');
  const values = markers.map((marker, index) => { const start = text.indexOf(marker); if (start < 0) return ''; const from = start + marker.length; const next = markers.slice(index + 1).map((item) => text.indexOf(item, from)).find((position) => position >= 0); return text.slice(from, next ?? text.length).trim(); });
  async function translateOne(phrase) {
    const singleUrl = new URL('https://translate.googleapis.com/translate_a/single');
    for (const [key, setting] of Object.entries({ client: 'gtx', sl: 'en', tl: targetCode(locale), dt: 't' })) singleUrl.searchParams.set(key, setting);
    singleUrl.searchParams.set('q', phrase.replace(/\{[a-z][a-zA-Z0-9]*\}/gu, (token) => 'UVTOKEN' + token.slice(1, -1) + 'X'));
    const singleResponse = await fetch(singleUrl, { signal: AbortSignal.timeout(30000) });
    if (!singleResponse.ok) throw new Error('Google Translate retry HTTP ' + singleResponse.status + ' (' + locale + ').');
    return ((await singleResponse.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('').trim();
  }
  for (let index = 0; index < values.length; index += 1) {
    let value = values[index];
    if (!value) value = await translateOne(phrases[index]);
    if (!value) throw new Error('Missing translation (' + locale + '/' + index + ').');
    let restored = value.replace(/UVTOKEN([a-z][a-zA-Z0-9]*)X/gu, '{$1}');
    for (const token of phrases[index].match(/\{[a-z][a-zA-Z0-9]*\}/gu) ?? []) if (!restored.includes(token)) restored = restored.replace(/[.!?。！？؟\s]*$/u, '').trim() + ' ' + token;
    values[index] = restored;
  }
  return values;
}
let result = {};
try { await access(target); result = { ...(await import(target.href + '?resume=' + Date.now())).default }; } catch (error) { if (error.code !== 'ENOENT') throw error; }
for (const locale of Object.keys(locales)) {
  const draft = structuredClone(result[locale] ?? source);
  const missingPaths = locale === 'en' ? paths.filter((path) => !hasAtPath(draft, path)) : paths.filter((path) => !hasAtPath(draft, path) || at(draft, path) === at(source, path));
  if (locale !== 'en' && missingPaths.length) {
    const translated = [];
    const phrases = missingPaths.map((path) => at(source, path));
    for (let start = 0; start < phrases.length; start += 10) {
      console.log(locale + ': batch ' + (start / 10 + 1));
      const batch = await translate(locale, phrases.slice(start, start + 10));
      translated.push(...batch);
      batch.forEach((value, index) => setAtPath(draft, missingPaths[start + index], value));
      draft.copyLanguage = locale;
      result[locale] = normalize(draft);
      await writeFile(target, '// Static machine-translated drafts; no runtime translation service.\nexport default Object.freeze(' + JSON.stringify(result) + ');\n');
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    if (translated.length !== missingPaths.length) throw new Error('Incomplete locale copy (' + locale + ').');
  } else if (locale === 'en') missingPaths.forEach((path) => setAtPath(draft, path, at(source, path)));
  draft.copyLanguage = locale;
  draft.title = fitTitle(draft);
  if (draft.description.length > 160) draft.description = draft.description.slice(0, 157).replace(/\s+\S*$/u, '') + '…';
  result[locale] = normalize(draft);
  await writeFile(target, '// Static machine-translated drafts; no runtime translation service.\nexport default Object.freeze(' + JSON.stringify(result) + ');\n');
  if (missingPaths.length) console.log(locale + ': translated ' + missingPaths.length + ' strings');
}
if (Object.keys(result).length !== Object.keys(locales).length) throw new Error('Incomplete locale matrix.');
for (const [locale, copy] of Object.entries(result)) if (copy.title.length > 60 || copy.description.length > 160 || copy.copyLanguage !== locale) throw new Error('Invalid metadata: ' + locale);
await writeFile(target, '// Static machine-translated drafts; no runtime translation service.\nexport default Object.freeze(' + JSON.stringify(result) + ');\n');
console.log('Saved ' + Object.keys(result).length + ' locale drafts.');

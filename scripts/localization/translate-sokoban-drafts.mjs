// One-time Google Translate drafts. Runtime pages consume only this static module.
import { access, writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { sokobanEnglishCopy as source } from '../../src/growth600/locales/sokoban.en.mjs';
const target = new URL('../../src/growth600/locales/sokoban-final.mjs', import.meta.url);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (path.at(-1) !== 'copyLanguage') paths.push(path); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
collect(source);
function setAtPath(object, path, value) { let parent = object; for (const key of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(key)] : parent[key]; if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value; }
function hasAtPath(object, path) { let value = object; for (const key of path) { if (value == null || !(key in value)) return false; value = Array.isArray(value) ? value[Number(key)] : value[key]; } return true; }
function targetCode(locale) { return locale === 'zh_tw' ? 'zh-TW' : locale; }
function normalize(value) { if (typeof value === 'string') return value.replace(/\s+/gu, ' ').trim(); if (Array.isArray(value)) return value.map(normalize); if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, normalize(child)])); return value; }
function fitTitle(copy) { const suffix = ' | UsefulVerse'; const max = 60 - suffix.length; let prefix = copy.title.split('|')[0].trim(); if (prefix.length > max) prefix = prefix.slice(0, max).replace(/\s+\S*$/u, '').trim(); return prefix + suffix; }
async function request(locale, phrases, markers) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'gtx', sl: 'en', tl: targetCode(locale), dt: 't' })) url.searchParams.set(key, value);
  url.searchParams.set('q', phrases.map((phrase, index) => { let token = 0; return markers[index] + ' ' + phrase.replace(/\{[a-z][a-zA-Z0-9]*\}/gu, () => 'UVTOKEN' + token++ + 'X'); }).join('\n'));
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error('Google Translate HTTP ' + response.status + ' (' + locale + ').');
  const text = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('\n');
  return markers.map((marker, index) => { const start = text.indexOf(marker); if (start < 0) return ''; const from = start + marker.length; const next = markers.slice(index + 1).map((item) => text.indexOf(item, from)).find((position) => position >= 0); return text.slice(from, next ?? text.length).replace(/987654\d{4}456789/gu, '').trim(); });
}
async function translate(locale, phrases) {
  const markers = phrases.map((_, index) => '987654' + String(index).padStart(4, '0') + '456789');
  const values = await request(locale, phrases, markers);
  return Promise.all(values.map(async (value, index) => {
    let translated = value;
    if (!translated) {
      const url = new URL('https://translate.googleapis.com/translate_a/single');
      for (const [key, setting] of Object.entries({ client: 'gtx', sl: 'en', tl: targetCode(locale), dt: 't' })) url.searchParams.set(key, setting);
      let token = 0;
      url.searchParams.set('q', phrases[index].replace(/\{[a-z][a-zA-Z0-9]*\}/gu, () => 'UVTOKEN' + token++ + 'X'));
      const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error('Google Translate retry HTTP ' + response.status + ' (' + locale + '/' + index + ').');
      translated = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('').trim();
    }
    const tokens = [...phrases[index].matchAll(/\{[a-z][a-zA-Z0-9]*\}/gu)].map((match) => match[0]);
    const restored = translated.replace(/UVTOKEN(\d+)X/gu, (_, number) => tokens[Number(number)] ?? '');
    if (!restored) throw new Error('Empty translation ' + locale + '/' + index);
    for (const placeholder of tokens) if (!restored.includes(placeholder)) throw new Error('Lost ' + placeholder + ' in ' + locale + '/' + index);
    return restored;
  }));
}
let result = {};
try { await access(target); result = { ...(await import(target.href + '?resume=' + Date.now())).default }; } catch (error) { if (error.code !== 'ENOENT') throw error; }
const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));
for (const locale of Object.keys(locales)) {
  const draft = structuredClone(result[locale] ?? source);
  const missingPaths = paths.filter((path) => !hasAtPath(draft, path));
  if (locale !== 'en' && missingPaths.length) {
    const missingPhrases = missingPaths.map((path) => path.reduce((parent, key) => parent[key], source));
    const translated = [];
    for (let start = 0; start < missingPhrases.length; start += 10) { translated.push(...await translate(locale, missingPhrases.slice(start, start + 10))); await new Promise((resolve) => setTimeout(resolve, 100)); }
    missingPaths.forEach((path, index) => setAtPath(draft, path, translated[index]));
  }
  if (locale === 'en' && missingPaths.length) missingPaths.forEach((path) => setAtPath(draft, path, path.reduce((parent, key) => parent[key], source)));
  draft.copyLanguage = locale;
  draft.title = fitTitle(draft);
  if (draft.description.length > 160) draft.description = draft.description.slice(0, 157).replace(/\s+\S*$/u, '') + '…';
  result[locale] = normalize(draft);
  await writeFile(target, '// Static machine-translated drafts; no runtime translation service.\nexport default Object.freeze(' + JSON.stringify(result) + ');\n');
  if (missingPaths.length) console.log(locale + ': translated ' + missingPaths.length + ' missing strings');
}
if (Object.keys(result).length !== Object.keys(locales).length) throw new Error('Incomplete locale matrix.');
for (const [locale, copy] of Object.entries(result)) if (copy.title.length > 60 || copy.description.length > 160 || copy.copyLanguage !== locale) throw new Error('Invalid metadata: ' + locale);
await writeFile(target, '// Static machine-translated drafts; no runtime translation service.\nexport default Object.freeze(' + JSON.stringify(result) + ');\n');
console.log('Saved ' + Object.keys(result).length + ' locale drafts.');

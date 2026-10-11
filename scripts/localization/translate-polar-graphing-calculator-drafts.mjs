// One-time free Google Translate drafts; production ships only static localized copy.
import { rename, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { polarGraphingCalculatorEnglishCopy as source } from '../../src/growth600/locales/polar-graphing-calculator.en.mjs';

const output = new URL('../../src/growth600/locales/polar-graphing-calculator-final.mjs', import.meta.url);
const codes = { zh_tw: 'zh-TW', pt_br: 'pt-BR', zh: 'zh-CN', tl: 'fil' };
const target = (key) => codes[key] ?? key.replace('_', '-');
const skipKeys = new Set(['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt']);
const paths = [];
function collect(node, path = []) {
  if (typeof node === 'string') { if (!skipKeys.has(path.at(-1))) paths.push(path); }
  else if (Array.isArray(node)) node.forEach((value, index) => collect(value, [...path, String(index)]));
  else if (node && typeof node === 'object') for (const [key, value] of Object.entries(node)) collect(value, [...path, key]);
}
function get(node, path) { return path.reduce((value, key) => Array.isArray(value) ? value[Number(key)] : value[key], node); }
function set(node, path, value) { const parent = path.slice(0, -1).reduce((item, key) => Array.isArray(item) ? item[Number(key)] : item[key], node); if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value; }
function shorten(text, max) { const chars = Array.from(text); return chars.length <= max ? text : `${chars.slice(0, max - 1).join('').replace(/\s+\S*$/u, '').trimEnd()}…`; }
function finish(copy, locale) {
  copy.name = shorten(copy.name, 44);
  let title = copy.title.replace(/uvbrandtokenx/giu, 'UsefulVerse').replace(/(?:\s*[|｜]\s*UsefulVerse)+\s*$/iu, '').replace(/\s*(?:[|｜]\s*)?(?:…|\.{3,})\s*$/u, '').trim();
  if (Array.from(title).length + 14 > 60) title = copy.name;
  copy.title = `${title} | UsefulVerse`;
  copy.description = shorten(copy.description.replace(/\s+/gu, ' ').trim(), 160);
  copy.copyLanguage = locale; copy.localizationStatus = locale === 'en' ? 'approved' : 'machine-accepted';
  if (locale !== 'en') { copy.localizationAcceptedBy = 'site-owner'; copy.localizationAcceptedAt = '2026-10-11'; }
}
async function translate(locale, phrases) {
  const url = new URL('https://clients5.google.com/translate_a/t');
  url.searchParams.set('client', 'dict-chrome-ex'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', target(locale)); url.searchParams.set('dt', 't');
  for (const phrase of phrases) url.searchParams.append('q', phrase.replaceAll('UsefulVerse', 'UVBRANDTOKENX'));
  const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
  if (!response.ok) throw new Error(`Translation failed for ${locale}: HTTP ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data) || data.length !== phrases.length) throw new Error(`Incomplete translation batch for ${locale}`);
  return data.map((value, index) => typeof value === 'string' && value.trim() ? value.replace(/uvbrandtokenx/giu, 'UsefulVerse').replace(/\s+/gu, ' ').trim() : phrases[index]);
}
async function save(copies) { const temp = new URL(`${output.href}.tmp`); await writeFile(temp, `// Static machine-translation drafts; no runtime translation service.\nexport default Object.freeze(${JSON.stringify(copies)});\n`); await rename(temp, output); }
collect(source);
const copies = { en: source };
const phrases = paths.map((path) => get(source, path));
for (const { key } of localeEntries) {
  if (key === 'en') continue;
  const copy = structuredClone(source), translated = [];
  for (let index = 0; index < phrases.length; index += 8) translated.push(...await translate(key, phrases.slice(index, index + 8)));
  paths.forEach((path, index) => set(copy, path, translated[index]));
  finish(copy, key); copies[key] = copy; await save(copies); console.log(`Translated ${key}`);
}
if (Object.keys(copies).length !== localeEntries.length) throw new Error('Missing locale draft.');
for (const { key } of localeEntries) if (key !== 'en') finish(copies[key], key);
await save(copies);
console.log(`Saved static drafts for ${Object.keys(copies).length} locales.`);

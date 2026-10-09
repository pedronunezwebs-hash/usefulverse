// Creates static Google Translate drafts once; the published tool makes no translation-service calls.
import { writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { locales } from '../../src/locales.mjs';
import { harViewerEnglishCopy as source } from '../../src/growth600/locales/har-viewer.en.mjs';

const target = new URL('../../src/growth600/locales/har-viewer.mjs', import.meta.url);
const separator = '###61845029###'; const run = promisify(execFile);
const targetCodes = { zh_tw: 'zh-TW', pt_br: 'pt', zh: 'zh-CN' };
const localeCode = (key) => targetCodes[key] ?? key.replace('_', '-');
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') {
    if (!['copyLanguage', 'exampleHar', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt'].includes(path.at(-1))) paths.push(path);
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function setAtPath(object, path, value) {
  let parent = object;
  for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value;
}
function normalize(copy) {
  const brand = ' | UsefulVerse'; const maxTitle = 60 - [...brand].length;
  let prefix = [...String(copy.title).split('|', 1)[0].trim()].slice(0, maxTitle).join('').trimEnd();
  if ([...String(copy.title).split('|', 1)[0].trim()].length > maxTitle) prefix = prefix.slice(0, Math.max(0, prefix.lastIndexOf(' '))).trimEnd();
  copy.title = `${prefix}${brand}`;
  if ([...copy.description].length > 160) copy.description = `${[...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '')}...`;
  return copy;
}
async function translateBatch(locale, phrases) {
  const url = new URL('https://translate.google.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', localeCode(locale)); url.searchParams.set('dt', 't');
  url.searchParams.set('q', phrases.join(`\n${separator}\n`));
  const { stdout } = await run('curl', ['-fsS', '--connect-timeout', '5', '--max-time', '15', '--retry', '1', '--retry-delay', '1', '--retry-all-errors', url.href], { maxBuffer: 2 * 1024 * 1024, timeout: 20_000 });
  const body = JSON.parse(stdout); const translated = Array.isArray(body?.[0]) ? body[0].map((part) => part?.[0] ?? '').join('') : '';
  const values = translated.split(`\n${separator}\n`);
  return values.length === phrases.length ? values.map((value, index) => value.trim() || phrases[index]) : null;
}
async function translate(locale, phrases) {
  const batch = await translateBatch(locale, phrases);
  if (batch) return batch;
  const output = [];
  for (const phrase of phrases) { const result = await translateBatch(locale, [phrase]); if (!result?.[0]) throw new Error(`Empty translation response for ${locale}.`); output.push(result[0]); }
  return output;
}
function preserveTerms(value, key = '') {
  if (typeof value === 'string') {
    if (key === 'exampleHar') return value;
    return value.replace(/\b(?:HAR|HTTP|JSON|MiB|UsefulVerse|4xx|5xx)\b/giu, (term) => ({ har: 'HAR', http: 'HTTP', json: 'JSON', mib: 'MiB', usefulverse: 'UsefulVerse', '4xx': '4xx', '5xx': '5xx' })[term.toLowerCase()] ?? term);
  }
  if (Array.isArray(value)) return value.map((item) => preserveTerms(item));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([childKey, child]) => [childKey, preserveTerms(child, childKey)]));
  return value;
}

collect(source);
const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));
const batches = []; let current = []; let length = 0;
for (const phrase of phrases) { if (current.length && length + phrase.length > 3000) { batches.push(current); current = []; length = 0; } current.push(phrase); length += phrase.length; }
if (current.length) batches.push(current);
let copies = {};
try { copies = { ...(await import(`${target.href}?resume=${Date.now()}`)).default }; } catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }
async function save() {
  for (const [locale, copy] of Object.entries(copies)) {
    if (locale !== 'en') Object.assign(copy, { localizationStatus: 'machine-accepted', localizationAcceptedBy: 'site-owner', localizationAcceptedAt: '2026-10-09' });
  }
  await writeFile(target, `// Static machine-translated drafts; no translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
}
for (const locale of Object.keys(locales)) {
  if (copies[locale]) continue;
  const copy = structuredClone(source);
  if (locale !== 'en') {
    const translated = [];
    for (const batch of batches) translated.push(...await translate(locale, batch));
    paths.forEach((path, index) => setAtPath(copy, path, translated[index]));
  }
  copy.copyLanguage = locale; copies[locale] = preserveTerms(normalize(copy)); await save();
  console.log(`${locale}: ${phrases.length} strings`);
}
await save();

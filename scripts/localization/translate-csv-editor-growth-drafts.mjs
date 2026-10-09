// One-time creation of static CSV-editor translations via Google's free web translator.
// This script is never loaded by the published site; translated drafts are stored in the repo.
import { writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { locales } from '../../src/locales.mjs';
import { csvEditorEnglishCopy as source } from '../../src/growth600/locales/csv-editor.en.mjs';

const target = new URL('../../src/growth600/locales/csv-editor.mjs', import.meta.url);
const separator = '###CSVEDIT834921###'; const run = promisify(execFile);
const targetCodes = { zh_tw: 'zh-TW', pt_br: 'pt', zh: 'zh-CN' };
const localeCode = (key) => targetCodes[key] ?? key.replace('_', '-');
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') {
    if (!['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt'].includes(path.at(-1))) paths.push(path);
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function setAtPath(object, path, value) {
  let parent = object; for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value;
}
function getAtPath(object, path) { return path.reduce((parent, key) => parent?.[Array.isArray(parent) ? Number(key) : key], object); }
function normalize(copy) {
  const suffix = ' | UsefulVerse'; const maxTitle = 60 - [...suffix].length;
  let prefix = [...String(copy.title).split('|', 1)[0].trim()].slice(0, maxTitle).join('').trimEnd();
  if ([...String(copy.title).split('|', 1)[0].trim()].length > maxTitle) prefix = prefix.slice(0, Math.max(0, prefix.lastIndexOf(' '))).trimEnd();
  copy.title = `${prefix}${suffix}`;
  if ([...copy.description].length > 160) copy.description = `${[...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '')}...`;
  return copy;
}
async function translateBatch(locale, phrases) {
  const url = new URL('https://translate.google.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', localeCode(locale)); url.searchParams.set('dt', 't');
  url.searchParams.set('q', phrases.join(`\n${separator}\n`));
  const { stdout } = await run('curl', ['-fsS', '--connect-timeout', '5', '--max-time', '20', '--retry', '2', '--retry-delay', '1', '--retry-all-errors', url.href], { maxBuffer: 2 * 1024 * 1024, timeout: 25_000 });
  const body = JSON.parse(stdout); const translated = Array.isArray(body?.[0]) ? body[0].map((part) => part?.[0] ?? '').join('') : '';
  const values = translated.split(`\n${separator}\n`);
  if (values.length !== phrases.length) throw new Error(`Response split mismatch: ${locale}`);
  return values.map((value, index) => value.trim() || phrases[index]);
}
function preserveTerms(value) {
  if (typeof value === 'string') return value.replace(/CSV|UTF-8|UsefulVerse/giu, (term) => ({ csv: 'CSV', 'utf-8': 'UTF-8', usefulverse: 'UsefulVerse' })[term.toLowerCase()]);
  if (Array.isArray(value)) return value.map(preserveTerms);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, preserveTerms(child)]));
  return value;
}
function improveLocale(copy, locale) {
  if (locale === 'zh') Object.assign(copy.fields, { columnType: '列类型', numberType: '数值' });
  if (locale === 'zh_tw') Object.assign(copy.fields, { columnType: '欄類型', numberType: '數值' });
  if (locale === 'ru') copy.fields.numberType = 'Число';
  if (locale === 'ja') copy.fields.numberType = '数値';
  const titles = {
    de: 'CSV-Editor gratis, unbegrenzt', ru: 'Бесплатный CSV-редактор без лимита',
    bg: 'Безплатен CSV редактор без лимит', el: 'Δωρεάν επεξεργασία CSV, χωρίς όρια',
    uk: 'Безкоштовний редактор CSV без лімітів', tl: 'Libreng CSV editor, walang limit',
  };
  if (titles[locale]) copy.title = `${titles[locale]} | UsefulVerse`;
  return copy;
}
function batchesFor(locale) {
  const batches = []; let batch = []; let chars = 0;
  for (const path of paths) {
    const phrase = path.reduce((parent, key) => parent[key], source); const cost = [...phrase].length + [...separator].length + 2;
    if (batch.length && chars + cost > 3_000) { batches.push(batch); batch = []; chars = 0; }
    batch.push(path); chars += cost;
  }
  if (batch.length) batches.push(batch);
  return batches;
}
collect(source);
let copies = {};
try { copies = { ...(await import(`${target.href}?resume=${Date.now()}`)).default }; } catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }
async function save() { await writeFile(target, `// Static machine-translated drafts; translation services are not called on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`); }
for (const locale of Object.keys(locales)) {
  const copy = locale === 'en' ? structuredClone(source) : copies[locale] ?? structuredClone(source);
  if (locale !== 'en') {
    const missingPaths = paths.filter((path) => ['title', 'description'].includes(path[0]) || typeof getAtPath(copy, path) !== 'string' || !getAtPath(copy, path).trim());
    const batches = []; let batch = []; let chars = 0;
    for (const path of missingPaths) {
      const phrase = path.reduce((parent, key) => parent[key], source); const cost = [...phrase].length + [...separator].length + 2;
      if (batch.length && chars + cost > 3_000) { batches.push(batch); batch = []; chars = 0; }
      batch.push(path); chars += cost;
    }
    if (batch.length) batches.push(batch);
    for (const pathBatch of batches) {
      const translated = await translateBatch(locale, pathBatch.map((path) => path.reduce((parent, key) => parent[key], source)));
      pathBatch.forEach((path, index) => setAtPath(copy, path, translated[index]));
    }
  }
  copy.copyLanguage = locale;
  if (locale !== 'en') Object.assign(copy, { localizationStatus: 'machine-accepted', localizationAcceptedBy: 'site-owner', localizationAcceptedAt: '2026-10-09' });
  copies[locale] = preserveTerms(normalize(improveLocale(copy, locale))); await save();
  console.log(`${locale}: ${locale === 'en' ? 'English source saved' : 'missing strings translated'} (${paths.length} total strings)`);
}
await save();

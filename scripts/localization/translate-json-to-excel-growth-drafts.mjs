// One-time static machine translations. Published pages make no translation-service calls.
import { writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { locales } from '../../src/locales.mjs';
import { jsonToExcelEnglishCopy as source } from '../../src/growth600/locales/json-to-excel.en.mjs';

const target = new URL('../../src/growth600/locales/json-to-excel.mjs', import.meta.url);
const separator = '###90157364###'; const run = promisify(execFile);
const targetCodes = { zh_tw: 'zh-TW', pt_br: 'pt', zh: 'zh-CN' };
const localeCode = (key) => targetCodes[key] ?? key.replace('_', '-');
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') {
    if (!['copyLanguage', 'exampleJson', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt'].includes(path.at(-1))) paths.push(path);
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function setAtPath(object, path, value) { let parent = object; for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part]; if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value; }
function getAtPath(object, path) { return path.reduce((parent, key) => parent?.[key], object); }
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
  const { stdout } = await run('curl', ['-fsS', '--connect-timeout', '5', '--max-time', '15', '--retry', '1', '--retry-delay', '1', '--retry-all-errors', url.href], { maxBuffer: 2 * 1024 * 1024, timeout: 20_000 });
  const body = JSON.parse(stdout); const translated = Array.isArray(body?.[0]) ? body[0].map((part) => part?.[0] ?? '').join('') : '';
  const values = translated.split(`\n${separator}\n`);
  return values.length === phrases.length ? values.map((value, index) => value.trim() || phrases[index]) : null;
}
async function translate(locale, phrases) {
  const batch = await translateBatch(locale, phrases); if (batch) return batch;
  const output = []; for (const phrase of phrases) { const result = await translateBatch(locale, [phrase]); if (!result?.[0]) throw new Error(`Empty translation response for ${locale}.`); output.push(result[0]); }
  return output;
}
function preserveTerms(value, key = '') {
  if (typeof value === 'string') return key === 'exampleJson' ? value : value.replace(/\b(?:JSON|Excel|XLSX|UsefulVerse)\b/giu, (term) => ({ json: 'JSON', excel: 'Excel', xlsx: 'XLSX', usefulverse: 'UsefulVerse' })[term.toLowerCase()]);
  if (Array.isArray(value)) return value.map((item) => preserveTerms(item));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([childKey, child]) => [childKey, preserveTerms(child, childKey)]));
  return value;
}

collect(source);
const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));
let copies = {};
try { copies = { ...(await import(`${target.href}?resume=${Date.now()}`)).default }; } catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }
async function save() {
  if (copies.ar?.actions) copies.ar.actions.reset = 'مسح';
  if (copies.ar?.howAnswer) copies.ar.howAnswer = copies.ar.howAnswer.replaceAll('Preview', 'معاينة JSON');
  for (const faq of copies.ar?.additionalFaqs ?? []) { faq.question = faq.question.replaceAll('Preview', 'معاينة JSON'); faq.answer = faq.answer.replaceAll('Preview', 'معاينة JSON'); }
  for (const [locale, copy] of Object.entries(copies)) if (locale !== 'en') Object.assign(copy, { localizationStatus: 'machine-accepted', localizationAcceptedBy: 'site-owner', localizationAcceptedAt: '2026-10-09' });
  await writeFile(target, `// Static machine-translated drafts; no translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
}
for (const locale of Object.keys(locales)) {
  const previous = copies[locale];
  const missingPaths = paths.filter((path) => typeof getAtPath(previous, path) !== 'string' || (locale !== 'en' && path.at(-1) === 'name' && getAtPath(previous, path) === getAtPath(source, path)));
  if (previous && !missingPaths.length) continue;
  const copy = structuredClone(previous ?? source);
  if (locale !== 'en') {
    const missingBatches = []; let batch = []; let chars = 0;
    for (const path of missingPaths) { const phrase = getAtPath(source, path); if (batch.length && chars + phrase.length > 3_000) { missingBatches.push(batch); batch = []; chars = 0; } batch.push(path); chars += phrase.length; }
    if (batch.length) missingBatches.push(batch);
    for (const pathBatch of missingBatches) { const translations = await translate(locale, pathBatch.map((path) => getAtPath(source, path))); pathBatch.forEach((path, index) => setAtPath(copy, path, translations[index])); }
  } else for (const path of missingPaths) setAtPath(copy, path, getAtPath(source, path));
  copy.copyLanguage = locale; copies[locale] = preserveTerms(normalize(copy)); await save();
  console.log(`${locale}: ${missingPaths.length} updated strings`);
}
await save();

// One-time static Google Translate drafts; no translation service runs on the site.
import { writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { locales } from '../../src/locales.mjs';
import { jsonToXmlEnglishCopy as source } from '../../src/growth600/locales/json-to-xml-converter.en.mjs';

const target = new URL('../../src/growth600/locales/json-to-xml-converter.mjs', import.meta.url);
const separator = '###61845029###';
const run = promisify(execFile);
const targetCodes = { zh_tw: 'zh-TW', pt_br: 'pt', zh: 'zh-CN' };
const localeCode = (key) => targetCodes[key] ?? key.replace('_', '-');
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') {
    if (!['copyLanguage', 'exampleJson', 'exampleXml'].includes(path.at(-1))) paths.push(path);
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function setAtPath(object, path, value) {
  let parent = object;
  for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value;
  else parent[path.at(-1)] = value;
}
function normalize(copy) {
  const brand = ' | UsefulVerse';
  const maxTitle = 60 - [...brand].length;
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
  const { stdout } = await run('curl', ['-fsS', url.href], { maxBuffer: 2 * 1024 * 1024 });
  const body = JSON.parse(stdout);
  const text = Array.isArray(body?.[0]) ? body[0].map((part) => part?.[0] ?? '').join('') : '';
  const values = text.split(`\n${separator}\n`);
  return values.length === phrases.length ? values.map((value, index) => value.trim() || phrases[index]) : null;
}
async function translate(locale, phrases) {
  const batch = await translateBatch(locale, phrases);
  if (batch) return batch;
  const values = [];
  for (const phrase of phrases) {
    const response = await translateBatch(locale, [phrase]);
    if (!response?.[0]) throw new Error(`Translation response empty for ${locale}.`);
    values.push(response[0]);
  }
  return values;
}
collect(source);
const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));
const chunks = [];
let chunk = []; let length = 0;
for (const phrase of phrases) {
  if (chunk.length && length + phrase.length > 3000) { chunks.push(chunk); chunk = []; length = 0; }
  chunk.push(phrase); length += phrase.length;
}
if (chunk.length) chunks.push(chunk);
let copies = {};
try { copies = { ...(await import(`${target.href}?resume=${Date.now()}`)).default }; }
catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }
async function saveCopies() {
  await writeFile(target, `// Static machine-translated drafts; no translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
}
for (const locale of Object.keys(locales)) {
  if (copies[locale]) continue;
  const copy = structuredClone(source);
  if (locale !== 'en') {
    const translated = [];
    for (const batch of chunks) translated.push(...await translate(locale, batch));
    paths.forEach((path, index) => setAtPath(copy, path, translated[index]));
    copy.localizationStatus = 'machine-accepted'; copy.localizationAcceptedBy = 'site-owner'; copy.localizationAcceptedAt = '2026-10-09';
  }
  copy.copyLanguage = locale;
  copies[locale] = normalize(copy);
  await saveCopies();
  console.log(`${locale}: ${phrases.length} strings`);
}

function preserveSyntax(value, key = '') {
  if (typeof value === 'string') {
    if (key === 'exampleJson' || key === 'exampleXml') return value;
    return value.replace(/@[\p{L}\p{M}]+/gu, '@name').replace(/#[\p{L}\p{M}]+/gu, '#text');
  }
  if (Array.isArray(value)) return value.map((item) => preserveSyntax(item));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([childKey, child]) => [childKey, preserveSyntax(child, childKey)]));
  return value;
}
const arrayFaqAnswer = source.additionalFaqs[0].answer;
const protectedArrayFaq = arrayFaqAnswer.replace(/\bitem\b/giu, 'ZXQXMLITEM493');
copies.en.additionalFaqs[0].answer = arrayFaqAnswer;
for (const locale of Object.keys(locales)) {
  if (locale === 'en' || copies[locale].additionalFaqs[0].answer.includes('item')) continue;
  const translated = await translate(locale, [protectedArrayFaq]);
  copies[locale].additionalFaqs[0].answer = translated[0].replace(/ZXQ[A-Z]*ITEM493/giu, 'item');
}
for (const [locale, copy] of Object.entries(copies)) copies[locale] = preserveSyntax(copy);
await saveCopies();

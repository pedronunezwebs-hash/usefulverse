import { readFile, rename, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { locales } from '../../src/locales.mjs';
import { aesEncryptionToolEnglishCopy as source } from '../../src/growth600/locales/aes-encryption-tool.en.mjs';

const target = new URL('../../src/growth600/locales/aes-encryption-tool-final.mjs', import.meta.url);
const checkpoint = new URL('../../src/growth600/locales/aes-encryption-tool-final.mjs.tmp', import.meta.url);
const run = promisify(execFile);
const separator = '###UVRAESSEP###';
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
  const url = new URL('https://clients5.google.com/translate_a/t');
  for (const [key, value] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: localeCode(locale) })) url.searchParams.set(key, value);
  url.searchParams.set('q', phrases.join(`\n${separator}\n`));
  const { stdout } = await run('curl', ['-fsS', '--connect-timeout', '5', '--max-time', '20', '--retry', '3', '--retry-delay', '2', '--retry-all-errors', url.href], { maxBuffer: 2 * 1024 * 1024, timeout: 90_000 });
  const body = JSON.parse(stdout);
  const translated = Array.isArray(body) ? body.map((part) => typeof part === 'string' ? part : '').join('') : '';
  const values = translated.split(`\n${separator}\n`);
  if (values.length !== phrases.length) {
    if (phrases.length === 1) return [translated.replaceAll(separator, '').trim() || phrases[0]];
    const middle = Math.ceil(phrases.length / 2);
    return [...await translate(locale, phrases.slice(0, middle)), ...await translate(locale, phrases.slice(middle))];
  }
  return values.map((value, index) => value.trim() || phrases[index]);
}

let result = {};
try {
  const saved = await readFile(target, 'utf8');
  result = JSON.parse(saved.replace(/^export default\s+/u, '').replace(/;\s*$/u, ''));
} catch (error) { if (error.code !== 'ENOENT') throw error; }
async function saveCheckpoint() {
  await writeFile(checkpoint, `export default ${JSON.stringify(result, null, 2)};\n`);
  await rename(checkpoint, target);
}
for (const locale of Object.keys(locales)) {
  if (result[locale]?.copyLanguage === locale) continue;
  const draft = structuredClone(source);
  draft.copyLanguage = locale;
  if (locale !== 'en') {
    let batch = []; let chars = 0;
    for (const path of paths) {
      const phrase = at(source, path);
      const cost = [...phrase].length + [...separator].length + 2;
      if (batch.length && chars + cost > 2_800) {
        const values = await translate(locale, batch.map((item) => item.phrase));
        batch.forEach((item, index) => setAt(draft, item.path, values[index]));
        batch = []; chars = 0;
      }
      batch.push({ path, phrase }); chars += cost;
    }
    if (batch.length) {
      const values = await translate(locale, batch.map((item) => item.phrase));
      batch.forEach((item, index) => setAt(draft, item.path, values[index]));
    }
    draft.localizationStatus = 'machine-accepted';
    draft.localizationAcceptedBy = 'site-owner';
    draft.localizationAcceptedAt = '2026-10-15';
  }
  draft.title = fitTitle(draft);
  if (draft.description.length > 160) draft.description = `${draft.description.slice(0, 157).replace(/\s+\S*$/u, '')}…`;
  result[locale] = normalize(draft);
  await saveCheckpoint();
}
if (Object.keys(result).length !== Object.keys(locales).length) throw new Error('Locale matrix is incomplete.');
for (const [locale, copy] of Object.entries(result)) if (copy.copyLanguage !== locale || copy.title.length > 60 || copy.description.length > 160) throw new Error(`Invalid SEO metadata for ${locale}.`);
await writeFile(target, `export default ${JSON.stringify(result, null, 2)};\n`);
console.log(`Saved ${Object.keys(result).length} static locale drafts.`);

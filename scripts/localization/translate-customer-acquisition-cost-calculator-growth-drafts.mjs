import { readFile, rename, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { locales } from '../../src/locales.mjs';
import { customerAcquisitionCostCalculatorEnglishCopy as source } from '../../src/growth600/locales/customer-acquisition-cost-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/customer-acquisition-cost-calculator-final.mjs', import.meta.url);
const checkpoint = new URL('../../src/growth600/locales/customer-acquisition-cost-calculator-final.mjs.tmp', import.meta.url);
const run = promisify(execFile);
const separator = '###UVRCACSEP###';
const localeCodes = { zh_tw: 'zh-TW', pt_br: 'pt' };
const localeCode = (locale) => localeCodes[locale] ?? locale.replace('_', '-');
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (path.at(-1) !== 'copyLanguage') paths.push(path); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
collect(source);
const at = (value, path) => path.reduce((parent, key) => Array.isArray(parent) ? parent[Number(key)] : parent[key], value);
function setAt(object, path, value) { let parent = object; for (const key of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(key)] : parent[key]; if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value; }
function normalize(copy) {
  const suffix = ' | UsefulVerse';
  let prefix = [...String(copy.title).split('|', 1)[0].trim()].slice(0, 60 - [...suffix].length).join('').trimEnd();
  if ([...String(copy.title).split('|', 1)[0].trim()].length > 60 - [...suffix].length) prefix = prefix.slice(0, Math.max(0, prefix.lastIndexOf(' '))).trimEnd();
  copy.title = `${prefix}${suffix}`;
  if ([...copy.description].length > 160) copy.description = `${[...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '')}…`;
  return copy;
}
async function translate(locale, phrases) {
  const url = new URL('https://clients5.google.com/translate_a/t');
  for (const [key, value] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: localeCode(locale) })) url.searchParams.set(key, value);
  url.searchParams.set('q', phrases.join(`\n${separator}\n`));
  const { stdout } = await run('curl', ['-fsS', '--connect-timeout', '5', '--max-time', '20', '--retry', '3', '--retry-delay', '2', '--retry-all-errors', url.href], { maxBuffer: 2 * 1024 * 1024, timeout: 90_000 });
  const body = JSON.parse(stdout);
  const text = Array.isArray(body) ? body.map((part) => typeof part === 'string' ? part : '').join('') : '';
  const values = text.split(`\n${separator}\n`);
  if (values.length !== phrases.length) {
    if (phrases.length === 1) return [text.replaceAll(separator, '').trim() || phrases[0]];
    const middle = Math.ceil(phrases.length / 2);
    return [...await translate(locale, phrases.slice(0, middle)), ...await translate(locale, phrases.slice(middle))];
  }
  return values.map((value, index) => value.trim() || phrases[index]);
}
let copies = {};
try {
  const saved = await readFile(target, 'utf8');
  const serialized = saved.replace(/^export default\s+(?:Object\.freeze\()?\s*/u, '').replace(/\)?;\s*$/u, '');
  try { copies = JSON.parse(serialized); }
  catch { if (/customerAcquisitionCostCalculatorEnglishCopy/u.test(saved)) copies = { en: source }; else throw new Error('Existing CAC locale file is not a recognized checkpoint.'); }
} catch (error) { if (error.code !== 'ENOENT') throw error; }
async function save() { await writeFile(checkpoint, `export default Object.freeze(${JSON.stringify(copies)});\n`); await rename(checkpoint, target); }
for (const locale of Object.keys(locales)) {
  if (copies[locale]?.copyLanguage === locale) continue;
  const draft = structuredClone(source);
  draft.copyLanguage = locale;
  if (locale !== 'en') {
    let batch = []; let chars = 0;
    for (const path of paths) {
      const phrase = at(source, path); const cost = [...phrase].length + [...separator].length + 2;
      if (batch.length && chars + cost > 2_800) {
        const values = await translate(locale, batch.map((item) => item.phrase));
        batch.forEach((item, index) => setAt(draft, item.path, values[index])); batch = []; chars = 0;
      }
      batch.push({ path, phrase }); chars += cost;
    }
    if (batch.length) { const values = await translate(locale, batch.map((item) => item.phrase)); batch.forEach((item, index) => setAt(draft, item.path, values[index])); }
    draft.localizationStatus = 'machine-accepted';
    draft.localizationAcceptedBy = 'site-owner';
    draft.localizationAcceptedAt = '2026-10-15';
  }
  copies[locale] = normalize(draft);
  await save();
  console.log(`${locale}: static copy saved`);
}
if (Object.keys(copies).length !== Object.keys(locales).length || Object.keys(locales).some((locale) => copies[locale]?.copyLanguage !== locale)) throw new Error('CAC locale matrix is incomplete.');
console.log(`Saved ${Object.keys(copies).length} static locale drafts.`);

import { writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { locales } from '../../src/locales.mjs';
import source from '../../src/growth600/locales/killer-sudoku.en.mjs';

const run = promisify(execFile);
const separator = '###UVKILLERSEP###';
const output = new URL('../../src/growth600/locales/killer-sudoku-final.mjs', import.meta.url);
const localeCodes = { zh_tw: 'zh-TW', pt_br: 'pt' };
const asCode = (locale) => localeCodes[locale] ?? locale.replace('_', '-');
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (path.at(-1) !== 'copyLanguage') paths.push(path); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function at(value, path) { return path.reduce((parent, key) => Array.isArray(parent) ? parent[Number(key)] : parent[key], value); }
function setAt(value, path, nextValue) { let parent = value; for (const key of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(key)] : parent[key]; if (Array.isArray(parent)) parent[Number(path.at(-1))] = nextValue; else parent[path.at(-1)] = nextValue; }
collect(source);

async function translate(locale, phrases) {
  const url = new URL('https://clients5.google.com/translate_a/t');
  for (const [key, value] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: asCode(locale) })) url.searchParams.set(key, value);
  url.searchParams.set('q', phrases.join(`\n${separator}\n`));
  const { stdout } = await run('curl', ['-fsS', '--connect-timeout', '5', '--max-time', '20', '--retry', '3', '--retry-delay', '2', '--retry-all-errors', url.href], { maxBuffer: 2 * 1024 * 1024, timeout: 90_000 });
  const response = JSON.parse(stdout);
  const translated = Array.isArray(response) ? response.map((part) => typeof part === 'string' ? part : '').join('') : '';
  const segments = translated.split(`\n${separator}\n`);
  if (segments.length === phrases.length) return segments.map((value, index) => value.trim() || phrases[index]);
  if (phrases.length === 1) return [translated.replaceAll(separator, '').trim() || phrases[0]];
  const middle = Math.ceil(phrases.length / 2);
  return [...await translate(locale, phrases.slice(0, middle)), ...await translate(locale, phrases.slice(middle))];
}

function fitMetadata(copy) {
  const suffix = ' | UsefulVerse';
  let prefix = [...copy.title.split('|', 1)[0].trim()].slice(0, 60 - [...suffix].length).join('').trimEnd();
  if ([...copy.title.split('|', 1)[0].trim()].length > 60 - [...suffix].length) prefix = prefix.slice(0, Math.max(0, prefix.lastIndexOf(' '))).trimEnd();
  copy.title = `${prefix}${suffix}`;
  if ([...copy.description].length > 160) copy.description = `${[...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '')}…`;
  return copy;
}

const copies = {};
for (const locale of Object.keys(locales)) {
  const draft = structuredClone(source);
  draft.copyLanguage = locale;
  if (locale !== 'en') {
    let batch = []; let characters = 0;
    for (const path of paths) {
      const phrase = at(source, path);
      const cost = [...phrase].length + [...separator].length + 2;
      if (batch.length && characters + cost > 2_800) {
        const translated = await translate(locale, batch.map(({ phrase: item }) => item));
        batch.forEach(({ path: itemPath }, index) => setAt(draft, itemPath, translated[index]));
        batch = []; characters = 0;
      }
      batch.push({ path, phrase }); characters += cost;
    }
    if (batch.length) {
      const translated = await translate(locale, batch.map(({ phrase }) => phrase));
      batch.forEach(({ path }, index) => setAt(draft, path, translated[index]));
    }
    draft.localizationStatus = 'machine-accepted';
    draft.localizationAcceptedBy = 'site-owner';
    draft.localizationAcceptedAt = '2026-10-15';
  }
  copies[locale] = fitMetadata(draft);
  console.log(`${locale}: static copy translated`);
}
if (Object.keys(copies).length !== Object.keys(locales).length || Object.keys(locales).some((locale) => copies[locale]?.copyLanguage !== locale)) throw new Error('Killer Sudoku locale matrix is incomplete.');
await writeFile(output, `export default Object.freeze(${JSON.stringify(copies)});\n`);
console.log(`Saved ${Object.keys(copies).length} static locale copies.`);

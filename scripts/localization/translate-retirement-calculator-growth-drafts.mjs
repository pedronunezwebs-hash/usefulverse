// Create static one-time Google Translate drafts for Retirement Calculator.
// Translation requests run only during development; the published site is static.
import { writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { locales } from '../../src/locales.mjs';
import { retirementCalculatorEnglishCopy as source } from '../../src/growth600/locales/retirement-calculator.en.mjs';
import inflationCalculatorCopies from '../../src/growth600/locales/inflation-calculator-final.mjs';

const target = new URL('../../src/growth600/locales/retirement-calculator-final.mjs', import.meta.url);
const languageCodes = { zh_tw: 'zh-TW', zh: 'zh-CN' };
const run = promisify(execFile);
const excludedKeys = new Set(['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt', 'measure', 'calculate', 'example', 'reset']);
const protectedPattern = /\{[A-Za-z][A-Za-z0-9_]*\}|https?:\/\/[^\s<>]+|UsefulVerse/gu;

function collect(value, path = [], rows = []) {
  if (typeof value === 'string') {
    if (!excludedKeys.has(path.at(-1))) rows.push({ path, source: value });
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)], rows));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key], rows);
  return rows;
}

function setAtPath(object, path, value) {
  let parent = object;
  for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value;
  else parent[path.at(-1)] = value;
}

function letters(index, width = 4) {
  let value = index;
  let output = '';
  do {
    output = String.fromCharCode(65 + (value % 26)) + output;
    value = Math.floor(value / 26) - 1;
  } while (value >= 0);
  return output.padStart(width, 'A');
}

function prepareRows(sourceRows) {
  return sourceRows.map((row, index) => {
    let masked = '';
    let cursor = 0;
    const replacements = [];
    for (const match of row.source.matchAll(protectedPattern)) {
      const token = `UVKEEP${letters(index)}${letters(replacements.length, 2)}X`;
      masked += row.source.slice(cursor, match.index) + token;
      replacements.push({ token, value: match[0] });
      cursor = match.index + match[0].length;
    }
    masked += row.source.slice(cursor);
    return { ...row, masked, replacements, marker: `UVROW${letters(index)}X` };
  });
}

function normalize(copy, locale) {
  copy.copyLanguage = locale;
  copy.localizationStatus = locale === 'en' ? 'approved' : 'machine-accepted';
  if (locale !== 'en') {
    copy.localizationAcceptedBy = 'site-owner';
    copy.localizationAcceptedAt = '2026-10-12';
  }
  const suffix = ' | UsefulVerse';
  const translatedPrefix = String(copy.title || copy.name).split(/[|｜]/u, 1)[0].trim() || copy.name;
  let prefix = [...translatedPrefix].slice(0, 60 - [...suffix].length).join('').trimEnd();
  if ([...translatedPrefix].length > [...prefix].length) prefix = prefix.slice(0, Math.max(0, prefix.lastIndexOf(' '))).trimEnd() || [...translatedPrefix].slice(0, 60 - [...suffix].length).join('');
  copy.title = `${prefix}${suffix}`;
  if ([...copy.description].length > 160) copy.description = `${[...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '')}...`;
  return copy;
}

async function requestTranslation(locale, text) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', languageCodes[locale] ?? locale.replace('_', '-'));
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', text);
  const { stdout } = await run('curl', ['-fsS', '--connect-timeout', '5', '--max-time', '30', '--retry', '2', '--retry-delay', '2', '--retry-all-errors', url.href], { maxBuffer: 2 * 1024 * 1024, timeout: 90_000 });
  const response = JSON.parse(stdout);
  return Array.isArray(response?.[0]) ? response[0].map((part) => part?.[0] ?? '').join('\n') : '';
}

function restoreProtectedTokens(locale, index, row, rawTranslation) {
  let translation = rawTranslation;
  for (const replacement of row.replacements) {
    const tokenMatch = translation.match(new RegExp(replacement.token, 'iu'));
    if (!tokenMatch || tokenMatch.index === undefined) {
      translation = `${translation.trim()} ${replacement.value}`;
      continue;
    }
    const withoutToken = translation.replace(new RegExp(replacement.token, 'giu'), '');
    const position = Math.min(tokenMatch.index, withoutToken.length);
    translation = `${withoutToken.slice(0, position)}${replacement.value}${withoutToken.slice(position)}`;
  }
  translation = translation.replace(/UV(?:ROW|KEEP)[A-Z]+X/giu, '').replace(/^\s*[|｜:]?\s*/u, '').trim();
  if (!translation) throw new Error(`Google Translate returned an incomplete phrase ${locale}/${index}`);
  return translation;
}

async function translate(locale, rows) {
  const translations = new Array(rows.length);
  const groups = [];
  let group = [];
  let groupLength = 0;
  for (const row of rows) {
    const size = row.marker.length + row.masked.length + 2;
    if (group.length && groupLength + size > 1800) {
      groups.push(group);
      group = [];
      groupLength = 0;
    }
    group.push(row);
    groupLength += size;
  }
  if (group.length) groups.push(group);

  let batchOffset = 0;
  for (const batch of groups) {
    const response = await requestTranslation(locale, batch.map(({ marker, masked }) => `${marker} ${masked}`).join('\n'));
    const markerPositions = batch.map((row) => {
      const match = response.match(new RegExp(row.marker, 'iu'));
      return { marker: row.marker, position: match?.index ?? -1 };
    }).filter(({ position }) => position >= 0);
    for (const [localIndex, row] of batch.entries()) {
      const match = response.match(new RegExp(row.marker, 'iu'));
      const start = match?.index ?? -1;
      const followingPosition = markerPositions.map(({ position }) => position).filter((position) => position > start).sort((a, b) => a - b)[0];
      let translated = start < 0 ? '' : response.slice(start + row.marker.length, followingPosition ?? response.length).trim();
      const protectedOk = row.replacements.every(({ token }) => new RegExp(token, 'iu').test(translated));
      if (!translated || !protectedOk || /UV(?:ROW|KEEP)[A-Z]+X/iu.test(translated)) {
        translated = await requestTranslation(locale, row.masked);
      }
      const globalIndex = batchOffset + localIndex;
      translations[globalIndex] = restoreProtectedTokens(locale, globalIndex, row, translated);
    }
    batchOffset += batch.length;
  }
  return translations;
}

const rows = prepareRows(collect(source));
let previous = {};
try { previous = (await import(`${target.href}?resume=${Date.now()}`)).default; }
catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }
const copies = { ...previous, en: structuredClone(source) };
copies.en.localizationStatus = 'approved';
for (const [locale, copy] of Object.entries(copies)) {
  if (locale === 'en' || !copy?.fields) continue;
  copy.fields.measure = inflationCalculatorCopies[locale].fields.resultSummary;
  copy.actions.calculate = inflationCalculatorCopies[locale].actions.calculate;
  copy.actions.example = inflationCalculatorCopies[locale].actions.example;
  copy.actions.reset = inflationCalculatorCopies[locale].actions.reset;
}
const checkpoint = async () => writeFile(target, `// Static machine-translated copy. No translation request runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
await checkpoint();

if (process.env.GROWTH600_REPAIR_EXISTING === '1') {
  for (const locale of Object.keys(locales)) {
    const copy = copies[locale];
    if (!copy?.intro || /UV(?:ROW|KEEP)[A-Z]+X/iu.test(JSON.stringify(copy))) throw new Error(`Incomplete existing copy in ${locale}`);
    if ([...copy.title].length > 60 || [...copy.description].length > 160 || copy.actions.example.length > 80 || copy.actions.reset.length > 50) throw new Error(`Out-of-bound metadata or action copy in ${locale}`);
  }
  console.log(`Repaired static measure and common action labels in ${Object.keys(copies).length} locales; no translation request was made.`);
  process.exit(0);
}

for (const locale of Object.keys(locales)) {
  if (locale === 'en') continue;
  const onlyLocales = process.env.GROWTH600_TRANSLATE_ONLY?.split(',').filter(Boolean);
  if (onlyLocales?.length && !onlyLocales.includes(locale)) continue;
  const copy = structuredClone(source);
  const translated = await translate(locale, rows);
  rows.forEach((row, index) => setAtPath(copy, row.path, translated[index]));
  copy.fields.measure = inflationCalculatorCopies[locale].fields.resultSummary;
  copy.actions.calculate = inflationCalculatorCopies[locale].actions.calculate;
  copy.actions.example = inflationCalculatorCopies[locale].actions.example;
  copy.actions.reset = inflationCalculatorCopies[locale].actions.reset;
  copies[locale] = normalize(copy, locale);
  await checkpoint();
  console.log(`${locale}: ${rows.length} mapped strings in up to 3 compact batches`);
}
for (const locale of Object.keys(locales)) {
  const copy = copies[locale];
  if (!copy?.intro || copy.intro === source.intro && locale !== 'en') throw new Error(`Missing translated introduction for ${locale}`);
  if (/UV(?:ROW|KEEP)[A-Z]+X/iu.test(JSON.stringify(copy))) throw new Error(`Unrestored translation marker in ${locale}`);
  if ([...copy.title].length > 60 || [...copy.description].length > 160 || copy.actions.example.length > 80 || copy.actions.reset.length > 50) throw new Error(`Out-of-bound metadata or action copy in ${locale}`);
  if ((copy.messages.depletion.match(/\{age\}/gu) ?? []).length !== 1 || (copy.messages.noDepletion.match(/\{age\}/gu) ?? []).length !== 1) throw new Error(`Missing dynamic age marker in ${locale}`);
}
console.log(`Saved static translations for ${Object.keys(copies).length} locales.`);

// One-time static Google Translate drafts. Published pages never call Google Translate.
import { writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { locales } from '../../src/locales.mjs';
import { reynoldsNumberCalculatorEnglishCopy as source } from '../../src/growth600/locales/reynolds-number-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/reynolds-number-calculator.mjs', import.meta.url);
const languageCodes = { zh_tw: 'zh-TW', zh: 'zh-CN' };
const run = promisify(execFile);
function collect(value, path = [], rows = []) {
  if (typeof value === 'string') { if (path.at(-1) !== 'copyLanguage') rows.push({ path, source: value }); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)], rows));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key], rows);
  return rows;
}
function setAtPath(object, path, value) {
  let parent = object;
  for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value;
  else parent[path.at(-1)] = value;
}
function normalize(copy, locale) {
  copy.copyLanguage = locale;
  copy.localizationStatus = locale === 'en' ? 'approved' : 'machine-accepted';
  copy.localizationAcceptedBy = 'site-owner';
  copy.localizationAcceptedAt = '2026-10-09';
  copy.messages.dynamicFormula = 'Re = ρ × v × L ÷ μ';
  copy.messages.kinematicFormula = 'Re = v × L ÷ ν';
  if (locale === 'hi') copy.name = 'रेनॉल्ड्स संख्या कैलकुलेटर';
  if (locale === 'tl') copy.name = 'Kalkulador ng Numero ng Reynolds';
  const suffix = ' | UsefulVerse';
  const sourceTitle = String(copy.name || 'Reynolds Number Calculator');
  let prefix = [...sourceTitle].slice(0, 60 - [...suffix].length).join('').trimEnd();
  if ([...sourceTitle].length > 60 - [...suffix].length) prefix = prefix.slice(0, Math.max(0, prefix.lastIndexOf(' '))).trimEnd();
  copy.title = `${prefix}${suffix}`;
  if ([...copy.description].length > 160) copy.description = `${[...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '')}...`;
  if (locale === 'en') copy.title = 'Reynolds Number Calculator Free & Unlimited | UsefulVerse';
  if (locale === 'es') {
    copy.title = 'Calculadora del número de Reynolds gratis | UsefulVerse';
    copy.description = 'Calcula el número de Reynolds con viscosidad dinámica o cinemática. Gratis, sin límites ni registro; todo se procesa en tu navegador.';
  }
  if (locale === 'ar') {
    copy.title = 'حاسبة رقم رينولدز مجانًا | UsefulVerse';
    copy.description = 'احسب رقم رينولدز باستخدام اللزوجة الديناميكية أو الحركية. مجانية في المتصفح دون رفع البيانات.';
  }
  if (locale === 'hi') copy.title = 'रेनॉल्ड्स संख्या कैलकुलेटर | UsefulVerse';
  if (locale === 'tl') copy.title = 'Kalkulador ng Numero ng Reynolds | UsefulVerse';
  return copy;
}
async function translate(locale, rows) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', languageCodes[locale] ?? locale.replace('_', '-')); url.searchParams.set('dt', 't');
  const markers = rows.map((_, index) => `654321${String(index).padStart(5, '0')}123456`);
  url.searchParams.set('q', rows.map((row, index) => `${markers[index]} ${row.source}`).join('\n'));
  const { stdout } = await run('curl', ['-fsS', '--connect-timeout', '5', '--max-time', '30', '--retry', '3', '--retry-delay', '2', '--retry-all-errors', url.href], { maxBuffer: 2 * 1024 * 1024, timeout: 120_000 });
  const response = JSON.parse(stdout);
  const text = Array.isArray(response?.[0]) ? response[0].map((part) => part?.[0] ?? '').join('\n') : '';
  return markers.map((marker, index) => {
    const start = text.indexOf(marker);
    if (start < 0) return rows[index].source;
    const contentStart = start + marker.length;
    const following = markers.slice(index + 1).map((next) => text.indexOf(next, contentStart)).filter((position) => position >= 0);
    const end = following.length ? Math.min(...following) : text.length;
    return text.slice(contentStart, end).trim() || rows[index].source;
  });
}
async function checkpoint(copies) { await writeFile(target, `// Static machine-translated drafts. No translation request runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`); }

const rows = collect(source);
const redoLocales = new Set(process.argv.filter((arg) => arg.startsWith('--redo=')).flatMap((arg) => arg.slice('--redo='.length).split(',')));
let copies = {};
try { copies = { ...(await import(`${target.href}?resume=${Date.now()}`)).default }; } catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }
copies.en = normalize(structuredClone(source), 'en');
for (const [locale, copy] of Object.entries(copies)) if (locale !== 'en') copies[locale] = normalize(copy, locale);
await checkpoint(copies);
for (const locale of Object.keys(locales)) {
  if (locale === 'en' || (copies[locale]?.intro && !redoLocales.has(locale))) continue;
  const copy = structuredClone(source);
  const batches = []; let batch = []; let size = 0;
  for (const row of rows) {
    const rowSize = [...row.source].length + 24;
    if (batch.length && size + rowSize > 2600) { batches.push(batch); batch = []; size = 0; }
    batch.push(row); size += rowSize;
  }
  if (batch.length) batches.push(batch);
  for (const group of batches) {
    const translated = await translate(locale, group);
    group.forEach((row, index) => setAtPath(copy, row.path, translated[index] || row.source));
  }
  copies[locale] = normalize(copy, locale);
  await checkpoint(copies);
  console.log(`${locale}: translated ${rows.length} strings in ${batches.length} batches`);
}
console.log(`Saved static drafts for ${Object.keys(copies).length} locales.`);

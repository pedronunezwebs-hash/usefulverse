// One-time Google Translate drafts; no translation service runs on published pages.
import { rename, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { stockProfitCalculatorEnglishCopy as source } from '../../src/growth600/locales/stock-profit-calculator.en.mjs';

const output = new URL('../../src/growth600/locales/stock-profit-calculator-final.mjs', import.meta.url);
const targetCodes = { zh_tw: 'zh-TW', pt_br: 'pt-BR', zh: 'zh-CN', tl: 'fil' };
const language = (key) => targetCodes[key] ?? key.replace('_', '-');
const refreshPaths = process.env.STOCK_PROFIT_REFRESH_TRANSLATIONS ? {
  it: ['actions.reset'],
  el: ['fields.sharesRemaining', 'fields.grossProceeds', 'fields.remainingBasis', 'messages.copyUnavailable'],
  ms: ['fields.sharesRemaining', 'fields.grossProceeds', 'additionalFaqs.0.answer', 'additionalFaqs.1.question', 'additionalFaqs.2.answer', 'additionalFaqs.3.answer'],
  th: ['howQuestion', 'privacyQuestion', 'fields.fifo', 'fields.sharesSold', 'fields.salePrice', 'fields.saleFee', 'fields.currencyCode', 'fields.resultSummary', 'fields.sharesOwned'],
  mr: ['howTo.0', 'howTo.1', 'fields.fifo', 'additionalFaqs.2.question'],
  te: ['messages.copied', 'additionalFaqs.0.answer', 'additionalFaqs.2.question', 'additionalFaqs.3.question'],
  tl: ['fields.grossProceeds'],
  ta: ['messages.exampleLoaded'],
  fa: ['intro', 'privacyAnswer', 'fields.purchaseCost', 'fields.realizedProfit', 'fields.returnPercent', 'messages.calculated'],
} : {};
const ignored = new Set(['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt']);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (!ignored.has(path.at(-1))) paths.push(path); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function get(path) { return path.reduce((value, key) => Array.isArray(value) ? value[Number(key)] : value[key], source); }
function set(path, value, target) {
  let parent = target;
  for (const key of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(key)] : parent[key];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value;
}
function truncate(value, maximum) {
  const points = Array.from(value);
  if (points.length <= maximum) return value;
  let shortened = points.slice(0, maximum - 1).join('').replace(/\s+\S*$/u, '').trimEnd();
  return `${shortened}…`;
}
function cleanTitle(copy, locale) {
  let title = copy.title
    .replace(/uvbrandtokenx/giu, 'UsefulVerse')
    .replace(/यूवीब्रांडटोकनएक्स/giu, 'UsefulVerse')
    .replace(/(?:\s*[|｜]\s*UsefulVerse)+\s*$/iu, '')
    .replace(/\s*(?:[|｜]\s*)?(?:…|\.{3,})\s*$/u, '')
    .trim();
  if (locale === 'th') {
    copy.name = 'เครื่องคำนวณกำไรหุ้น';
    title = 'เครื่องคำนวณกำไรหุ้นฟรีและไม่จำกัด';
  } else if (locale === 'tl') {
    copy.name = 'Kalkulador ng tubo sa stock';
    title = 'Kita sa stock: libre at walang limitasyon';
  } else if (locale === 'ar') {
    copy.privacyQuestion = 'هل تُرفع بيانات أسهمي؟';
    copy.fields.purchaseLot = 'دفعة شراء';
    copy.fields.quantity = 'عدد الأسهم المشتراة';
    copy.fields.sharesSold = 'عدد الأسهم المباعة';
  } else if (locale === 'es') {
    copy.privacyQuestion = '¿Se suben los datos de mis acciones?';
  }
  const suffix = ' | UsefulVerse';
  if (Array.from(title).length + Array.from(suffix).length > 60) title = copy.name;
  copy.title = `${title}${suffix}`;
}
async function translateBatch(locale, phrases, offset) {
  const url = new URL('https://clients5.google.com/translate_a/t');
  url.searchParams.set('client', 'dict-chrome-ex'); url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', language(locale)); url.searchParams.set('dt', 't');
  for (const phrase of phrases) url.searchParams.append('q', phrase.replaceAll('UsefulVerse', 'UVBRANDTOKENX'));
  const response = await fetch(url, { signal: AbortSignal.timeout(25_000) });
  if (!response.ok) throw new Error(`Google Translate returned HTTP ${response.status} for ${locale}.`);
  const values = await response.json();
  if (!Array.isArray(values) || values.length !== phrases.length) throw new Error(`Google Translate returned an incomplete batch for ${locale} near ${offset}.`);
  return values.map((value, index) => typeof value === 'string' && value.trim()
    ? value.replace(/uvbrandtokenx/giu, 'UsefulVerse').replace(/यूवीब्रांडटोकनएक्स/giu, 'UsefulVerse').replace(/[\r\n\t]+/gu, ' ').replace(/ {2,}/gu, ' ').trim()
    : phrases[index]);
}
async function save(copies) {
  const temporary = new URL(`${output.href}.tmp`);
  await writeFile(temporary, `// One-time static machine-translation drafts; no runtime translation service.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
  await rename(temporary, output);
}

collect(source);
const phrases = paths.map(get);
const copies = { en: structuredClone(source) };
try { Object.assign(copies, (await import(`${output.href}?resume=${Date.now()}`)).default); } catch { /* Start a fresh draft. */ }
copies.en = structuredClone(source);
for (const { key } of localeEntries) {
  if (key === 'en') continue;
  const retry = refreshPaths[key]?.map((path) => path.split('.')) ?? null;
  if (copies[key]?.copyLanguage === key && !retry) continue;
  const copy = copies[key]?.copyLanguage === key ? structuredClone(copies[key]) : structuredClone(source);
  const selectedPaths = retry ? paths.filter((path) => retry.some((candidate) => candidate.join('.') === path.join('.'))) : paths;
  const translated = [];
  const selectedPhrases = selectedPaths.map(get);
  for (let start = 0; start < selectedPhrases.length; start += 8) translated.push(...await translateBatch(key, selectedPhrases.slice(start, start + 8), start));
  selectedPaths.forEach((path, index) => set(path, translated[index], copy));
  copy.name = truncate(copy.name, 44);
  copy.title = truncate(copy.title, 60);
  copy.description = truncate(copy.description.replace(/\s+/gu, ' ').trim(), 160);
  cleanTitle(copy, key);
  copy.copyLanguage = key;
  copy.localizationStatus = 'machine-accepted';
  copy.localizationAcceptedBy = 'site-owner';
  copy.localizationAcceptedAt = '2026-10-11';
  copies[key] = copy;
  await save(copies);
  console.log(`Translated ${key}`);
}
if (Object.keys(copies).length !== localeEntries.length) throw new Error('Not every configured locale was translated.');
const punctuationOnly = /^[\p{P}\p{S}\s]+$/u;
for (const [locale, copy] of Object.entries(copies)) {
  cleanTitle(copy, locale);
  if (!copy.name || Array.from(copy.title).length > 60 || Array.from(copy.description).length > 160) throw new Error(`Metadata limit failed for ${locale}.`);
  for (const group of [copy.actions, copy.messages]) for (const [key, value] of Object.entries(group)) if (punctuationOnly.test(value)) throw new Error(`Empty/punctuation translation at ${locale}.${key}.`);
}
await save(copies);
console.log(`Wrote ${Object.keys(copies).length} static copies (${phrases.length} translatable strings per locale).`);

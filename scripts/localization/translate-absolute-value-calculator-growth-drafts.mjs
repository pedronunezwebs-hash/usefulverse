// One-time Google Translate drafts; translations are static files, never requested by visitors.
import { rename, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { absoluteValueCalculatorEnglishCopy as source } from '../../src/growth600/locales/absolute-value-calculator.en.mjs';

const output = new URL('../../src/growth600/locales/absolute-value-calculator-final.mjs', import.meta.url);
const metadata = new Set(['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt']);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') {
    if (!metadata.has(path.at(-1)) && path.at(-1) !== 'title') paths.push(path);
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function get(path) { return path.reduce((parent, key) => parent[key], source); }
function set(path, value, object) {
  let parent = object;
  for (const key of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(key)] : parent[key];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value;
}
function truncate(value, limit) { return value.length <= limit ? value : `${value.slice(0, limit - 1).replace(/\s+\S*$/u, '')}…`; }
function title(name, freeWord) {
  const suffix = ' | UsefulVerse';
  return `${truncate(`${name} ${freeWord}`, 60 - Array.from(suffix).length)}${suffix}`;
}
async function translate(locale, phrases, offset) {
  const target = locale === 'zh_tw' ? 'zh-TW' : locale === 'tl' ? 'fil' : locale;
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: target, dt: 't' })) url.searchParams.set(key, value);
  const markers = phrases.map((_, index) => `QZAV${(offset + index).toString(36).toUpperCase()}ZQ`);
  url.searchParams.set('q', phrases.map((phrase, index) => `${markers[index]} ${phrase.replaceAll('UsefulVerse', 'UVBRANDTOKENX')} ${markers[index]}`).join('\n'));
  let response;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
      if (!response.ok) throw new Error(`Google Translate returned HTTP ${response.status} for ${locale}`);
      break;
    } catch (error) {
      if (attempt === 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 800));
    }
  }
  const translated = ((await response.json())?.[0] ?? []).map((part) => Array.isArray(part?.[0]) ? part[0][0] : (part?.[0] ?? '')).join('');
  return markers.map((marker, index) => {
    const begin = translated.indexOf(marker); const end = begin < 0 ? -1 : translated.indexOf(marker, begin + marker.length);
    let value = begin >= 0 && end >= 0 ? translated.slice(begin + marker.length, end).trim() : '';
    if (!value) value = phrases[index].replaceAll('UsefulVerse', 'UVBRANDTOKENX');
    value = value.replaceAll('UVBRANDTOKENX', 'UsefulVerse').replace(/[\r\n\t]+/gu, ' ').replace(/ {2,}/gu, ' ').trim();
    if (!value) throw new Error(`Empty translation for ${locale}, string ${offset + index}`);
    return value;
  });
}

async function translateSingle(locale, phrase) {
  const target = locale === 'zh_tw' ? 'zh-TW' : locale === 'tl' ? 'fil' : locale;
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: target, dt: 't', q: phrase.replaceAll('UsefulVerse', 'UVBRANDTOKENX') })) url.searchParams.set(key, value);
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`Google Translate fallback returned HTTP ${response.status} for ${locale}`);
  const parts = (await response.json())?.[0] ?? [];
  const value = parts.map((part) => Array.isArray(part?.[0]) ? part[0][0] : (part?.[0] ?? '')).join('')
    .replaceAll('UVBRANDTOKENX', 'UsefulVerse').replace(/[\r\n\t]+/gu, ' ').replace(/ {2,}/gu, ' ').trim();
  if (!value) throw new Error(`Empty fallback translation for ${locale}: ${phrase}`);
  return value;
}

function needsUiTranslation(path, value, original) {
  const visible = ['name', 'fields', 'actions', 'messages', 'additionalFaqs'].includes(path[0]);
  const punctuationOnly = original.length > 1 && /^[\p{P}\p{S}\s]+$/u.test(value);
  const brokenNumberLabel = path[0] === 'fields' && path[1] === 'value' && value.length <= 1;
  return visible && (value === original || punctuationOnly || brokenNumberLabel);
}

function isBrokenVisibleString(path, value, original) {
  return (original.length > 1 && /^[\p{P}\p{S}\s]+$/u.test(value))
    || (path[0] === 'fields' && path[1] === 'value' && value.length <= 1);
}

function preserveComparisonOperator(path, value) {
  const operators = { equals: '=', lessThan: '<', lessOrEqual: '≤', greaterThan: '>', greaterOrEqual: '≥' };
  if (path[0] !== 'fields' || !operators[path[1]]) return value;
  const label = value.replace(/\s*\([^)]*\)\s*$/u, '').replace(/[=<>≤≥]/gu, '').trim();
  return `${label} (${operators[path[1]]})`;
}

collect(source);
const pathsToTranslate = paths;
const values = pathsToTranslate.map(get);
const result = { en: { ...structuredClone(source), copyLanguage: 'en', localizationStatus: 'approved' } };
const free = { es: 'gratis', fr: 'gratuit', pt: 'grátis', de: 'kostenlos', ja: '無料', ko: '무료', id: 'gratis', hi: 'मुफ़्त', ar: 'مجانا', zh: '免费', bn: 'বিনামূল্যে', ru: 'бесплатно', ur: 'مفت', tr: 'ücretsiz', vi: 'miễn phí', it: 'gratis', zh_tw: '免費', bg: 'безплатно', ca: 'gratuït', nl: 'gratis', el: 'δωρεάν', ms: 'percuma', pl: 'za darmo', sv: 'gratis', th: 'ฟรี', uk: 'безкоштовно', sw: 'bure', mr: 'मोफत', te: 'ఉచితం', ha: 'kyauta', tl: 'libre', ta: 'இலவசம்', fa: 'رایگان', am: 'ነፃ', gu: 'મફત' };
for (const { key: locale } of localeEntries) {
  if (locale === 'en') continue;
  const copy = structuredClone(source);
  for (let start = 0; start < values.length;) {
    let end = start; let length = 0;
    while (end < values.length && length + values[end].length + 44 <= 4_400) { length += values[end].length + 44; end += 1; }
    if (end === start) throw new Error(`String at ${start} exceeds translation chunk limit`);
    const translated = await translate(locale, values.slice(start, end), start);
    for (let index = 0; index < translated.length; index += 1) {
      const path = pathsToTranslate[start + index];
      const original = values[start + index];
      let value = translated[index];
      if (needsUiTranslation(path, value, original)) value = await translateSingle(locale, original);
      if (isBrokenVisibleString(path, value, original)) throw new Error(`Could not repair visible UI string for ${locale}: ${path.join('.')}`);
      value = preserveComparisonOperator(path, value);
      set(path, value, copy);
    }
    start = end;
  }
  copy.title = title(copy.name, free[locale] ?? 'Free');
  copy.description = truncate(copy.description.replace(/\s+/gu, ' ').trim(), 160);
  copy.copyLanguage = locale;
  copy.localizationStatus = 'machine-accepted';
  copy.localizationAcceptedBy = 'site-owner';
  copy.localizationAcceptedAt = '2026-10-11';
  result[locale] = copy;
  const temp = new URL(`${output.href}.tmp`);
  await writeFile(temp, `// One-time Google Translate drafts; no runtime translation service.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
  await rename(temp, output);
  console.log(`Translated ${locale}`);
}
for (const { key } of localeEntries) if (!result[key]) throw new Error(`Missing translation for ${key}`);

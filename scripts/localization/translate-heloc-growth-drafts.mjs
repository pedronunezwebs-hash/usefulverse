import { access, writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { helocCalculatorEnglishCopy as source } from '../../src/growth600/locales/heloc-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/heloc-calculator-final.mjs', import.meta.url);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string' && path.at(-1) !== 'copyLanguage') paths.push(path);
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function atPath(obj, path) { return path.reduce((value, key) => Array.isArray(value) ? value[Number(key)] : value[key], obj); }
function setAtPath(obj, path, value) {
  const parent = path.slice(0, -1).reduce((current, key) => Array.isArray(current) ? current[Number(key)] : current[key], obj);
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value;
}
function normalize(value) {
  if (typeof value === 'string') return value.replace(/\s+/gu, ' ').trim();
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, normalize(child)]));
  return value;
}
function boundMetadata(copy) {
  const suffix = ' | UsefulVerse';
  const max = 60 - suffix.length;
  let prefix = copy.title.split('|')[0].trim();
  if (prefix.length > max) prefix = prefix.slice(0, max).replace(/\s+\S*$/u, '').trim();
  copy.title = `${prefix}${suffix}`;
  if (copy.description.length > 160) copy.description = `${copy.description.slice(0, 157).replace(/\s+\S*$/u, '')}…`;
}
async function translate(locale, phrases) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', locale === 'zh_tw' ? 'zh-TW' : locale); url.searchParams.set('dt', 't');
  const markers = phrases.map((_, index) => `UVHL${String(index).padStart(4, '0')}QXZ`);
  url.searchParams.set('q', phrases.map((phrase, index) => `${phrase} ${markers[index]}`).join('\n'));
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`${locale}: translation HTTP ${response.status}`);
    const output = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('\n');
    let previousEnd = 0;
    const translated = markers.map((marker) => {
      const end = output.indexOf(marker, previousEnd);
      if (end < 0) return '';
      const phrase = output.slice(previousEnd, end).replace(/UVHL\d{4}QXZ/gu, '').trim();
      previousEnd = end + marker.length;
      return phrase;
    });
    if (!translated.some((item) => !item)) return translated;
    if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 350 * (attempt + 1)));
  }
  const values = [];
  for (const phrase of phrases) {
    const single = new URL('https://translate.googleapis.com/translate_a/single');
    single.searchParams.set('client', 'gtx'); single.searchParams.set('sl', 'en'); single.searchParams.set('tl', locale === 'zh_tw' ? 'zh-TW' : locale); single.searchParams.set('dt', 't'); single.searchParams.set('q', phrase);
    const response = await fetch(single, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`${locale}: translation HTTP ${response.status}`);
    const translated = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('').trim();
    if (!translated) throw new Error(`${locale}: empty translation`);
    values.push(translated);
  }
  return values;
}

collect(source);
const phrases = paths.map((path) => atPath(source, path));
let result = {};
try { await access(target); result = { ...(await import(`${target.href}?resume=${Date.now()}`)).default }; }
catch (error) { if (error.code !== 'ENOENT') throw error; }
for (const locale of Object.keys(locales)) {
  if (result[locale]) continue;
  const copy = structuredClone(source);
  if (locale !== 'en') {
    const translated = [];
    for (let start = 0; start < phrases.length; start += 5) translated.push(...await translate(locale, phrases.slice(start, start + 5)));
    paths.forEach((path, index) => setAtPath(copy, path, translated[index]));
  }
  copy.copyLanguage = locale;
  result[locale] = normalize(copy);
  boundMetadata(result[locale]);
  await writeFile(target, `// Static machine-translated drafts; no translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
  console.log(`${locale}: ${phrases.length} strings`);
}
result.en = structuredClone(source);
result.es.title = 'Calculadora HELOC gratis: pagos e interés | UsefulVerse';
result.ar.fields.annualApr = 'معدل النسبة السنوية (APR %)';
for (const [locale, copy] of Object.entries(result)) {
  if (locale !== 'en') delete copy.actions; // Reuse the site's already-localized shared action labels.
  boundMetadata(copy);
}
await writeFile(target, `// Static machine-translated drafts; no translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(result)});\n`);

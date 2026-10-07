import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { randomTeamGeneratorEnglishCopy as source } from '../../src/growth600/locales/random-team-generator.en.mjs';

const target = new URL('../../src/growth600/locales/random-team-generator-final.mjs', import.meta.url);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string' && path.at(-1) !== 'copyLanguage') paths.push(path);
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function atPath(object, path) { return path.reduce((value, key) => Array.isArray(value) ? value[Number(key)] : value[key], object); }
function setAtPath(object, path, value) {
  const parent = path.slice(0, -1).reduce((current, key) => Array.isArray(current) ? current[Number(key)] : current[key], object);
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value;
}
function boundMetadata(copy) {
  const suffix = ' | UsefulVerse';
  const maxPrefix = 60 - suffix.length;
  let title = copy.title.split('|')[0].trim();
  if (title.length > maxPrefix) title = title.slice(0, maxPrefix).replace(/\s+\S*$/u, '').trim();
  copy.title = `${title}${suffix}`;
  if (copy.description.length > 160) copy.description = `${copy.description.slice(0, 157).replace(/\s+\S*$/u, '')}…`;
}
async function requestTranslation(url, locale) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (response.ok) return response;
      lastError = new Error(`${locale}: translation HTTP ${response.status}`);
    } catch (error) { lastError = error; }
    if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
  }
  throw new Error(`${locale}: translation request failed after retries`, { cause: lastError });
}
async function translate(locale, phrases) {
  const targetLocale = locale === 'zh_tw' ? 'zh-TW' : locale;
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', targetLocale); url.searchParams.set('dt', 't');
  const markers = phrases.map((_, index) => `UVRT${String(index).padStart(4, '0')}QXZ`);
  url.searchParams.set('q', phrases.map((phrase, index) => `${phrase} ${markers[index]}`).join('\n'));
  const response = await requestTranslation(url, locale);
  const output = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('\n');
  let previousEnd = 0;
  const translated = markers.map((marker) => {
    const end = output.indexOf(marker, previousEnd);
    if (end < 0) return '';
    const phrase = output.slice(previousEnd, end).replace(/UVRT\d{4}QXZ/gu, '').trim();
    previousEnd = end + marker.length;
    return phrase;
  });
  if (!translated.some((item) => !item)) return translated;
  const fallback = [];
  for (const phrase of phrases) {
    const single = new URL('https://translate.googleapis.com/translate_a/single');
    single.searchParams.set('client', 'gtx'); single.searchParams.set('sl', 'en'); single.searchParams.set('tl', targetLocale); single.searchParams.set('dt', 't'); single.searchParams.set('q', phrase);
    const one = await requestTranslation(single, locale);
    const text = ((await one.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('').trim();
    if (!text) throw new Error(`${locale}: empty translated string`);
    fallback.push(text);
  }
  return fallback;
}
function normalize(value) {
  if (typeof value === 'string') return value.replace(/\s+/gu, ' ').trim();
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, normalize(child)]));
  return value;
}

collect(source);
const phrases = paths.map((path) => atPath(source, path));
let result = { en: structuredClone(source) };
try { result = { ...result, ...(await import(`${target.href}?resume=${Date.now()}`)).default }; }
catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }
for (const locale of Object.keys(locales)) {
  if (locale === 'en' || result[locale]) continue;
  const copy = structuredClone(source);
  const values = [];
  for (let start = 0; start < phrases.length; start += 4) values.push(...await translate(locale, phrases.slice(start, start + 4)));
  paths.forEach((path, index) => setAtPath(copy, path, values[index]));
  copy.copyLanguage = locale;
  result[locale] = normalize(copy);
  boundMetadata(result[locale]);
  await writeFile(target, `// Static machine-translated drafts; no translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
  console.log(`${locale}: ${phrases.length} static strings translated`);
}
result.es.title = 'Generador de equipos gratis ilimitado | UsefulVerse';
result.es.description = 'Forma equipos equilibrados al azar, separa participantes y repite resultados con una semilla. Gratis e ilimitado, local en tu navegador.';
result.es.name = 'Generador de equipos aleatorios';
for (const copy of Object.values(result)) boundMetadata(copy);
await writeFile(target, `// Static machine-translated drafts; no translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(result)});\n`);

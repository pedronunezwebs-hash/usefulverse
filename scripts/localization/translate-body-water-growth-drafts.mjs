// One-time static translation drafts; the published site never calls this service.
import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { bodyWaterCalculatorEnglishCopy as source } from '../../src/growth600/locales/body-water-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/body-water-calculator.mjs', import.meta.url);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (path.at(-1) !== 'copyLanguage') paths.push(path); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
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
  const rawTitle = String(copy.name).replace(/\s*\|\s*UsefulVerse\s*$/iu, '').trim();
  let prefix = [...rawTitle].slice(0, 60 - [...brand].length).join('').trimEnd();
  if ([...rawTitle].length > 60 - [...brand].length) {
    const boundary = prefix.lastIndexOf(' ');
    if (boundary > 24) prefix = prefix.slice(0, boundary).trimEnd();
  }
  copy.title = `${prefix}${brand}`;
  // Keep equations byte-for-byte identical across locales: machine translation
  // can alter decimal signs or coefficients, which would misstate the method.
  copy.fields.equationNote = source.fields.equationNote;
  const cleanMarkers = (value) => {
    if (typeof value === 'string') return value.replace(/987654\d{5}456789/g, '').replace(/\s+\n/g, '\n').trim();
    if (Array.isArray(value)) return value.map(cleanMarkers);
    if (value && typeof value === 'object') for (const key of Object.keys(value)) value[key] = cleanMarkers(value[key]);
    return value;
  };
  cleanMarkers(copy);
  if ([...copy.description].length > 160) copy.description = `${[...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '')}…`;
  return copy;
}
collect(source);

async function translate(locale, phrases, offset) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', locale === 'zh_tw' ? 'zh-TW' : locale); url.searchParams.set('dt', 't');
  const markers = phrases.map((_, index) => `987654${String(offset + index).padStart(5, '0')}456789`);
  url.searchParams.set('q', phrases.map((phrase, index) => `${markers[index]} ${phrase}`).join('\n'));
  const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
  if (!response.ok) throw new Error(`Google Translate failed for ${locale}: HTTP ${response.status}`);
  const translated = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('\n');
  async function translateOne(phrase) {
    const singleUrl = new URL('https://translate.googleapis.com/translate_a/single');
    singleUrl.searchParams.set('client', 'gtx'); singleUrl.searchParams.set('sl', 'en');
    singleUrl.searchParams.set('tl', locale === 'zh_tw' ? 'zh-TW' : locale); singleUrl.searchParams.set('dt', 't'); singleUrl.searchParams.set('q', phrase);
    const singleResponse = await fetch(singleUrl, { signal: AbortSignal.timeout(25000) });
    if (!singleResponse.ok) throw new Error(`Google Translate fallback failed for ${locale}: HTTP ${singleResponse.status}`);
    const value = ((await singleResponse.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('').trim();
    if (!value) throw new Error(`Empty fallback translation for ${locale}.`);
    return value;
  }
  return Promise.all(markers.map(async (marker, index) => {
    const begin = translated.indexOf(marker);
    if (begin < 0) return translateOne(phrases[index]);
    const textStart = begin + marker.length;
    const nextPositions = markers.slice(index + 1).map((next) => translated.indexOf(next, textStart)).filter((position) => position >= 0);
    const end = nextPositions.length ? Math.min(...nextPositions) : translated.length;
    const result = translated.slice(textStart, end).trim();
    return result || translateOne(phrases[index]);
  }));
}

let result = {};
try { result = structuredClone((await import(`${target.href}?resume=${Date.now()}`)).default); }
catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }
const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));
async function checkpoint() {
  await writeFile(target, `// Static machine-translated drafts. No translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
}
for (const locale of Object.keys(locales)) {
  if (result[locale]) {
    result[locale] = normalize(result[locale]);
    await checkpoint();
    console.log(`${locale}: normalized existing draft`);
    continue;
  }
  const copy = structuredClone(source);
  if (locale !== 'en') {
    const translated = [];
    for (let start = 0; start < phrases.length; start += 8) translated.push(...await translate(locale, phrases.slice(start, start + 8), start));
    paths.forEach((path, index) => setAtPath(copy, path, translated[index]));
    copy.localizationStatus = 'machine-accepted'; copy.localizationAcceptedBy = 'site-owner'; copy.localizationAcceptedAt = '2026-10-09';
  } else copy.localizationStatus = 'approved';
  copy.copyLanguage = locale;
  result[locale] = normalize(copy);
  await checkpoint();
  console.log(`${locale}: ${phrases.length} strings`);
}
console.log(`Wrote ${Object.keys(result).length} static locale copies.`);

// One-time static translations; the published tool never calls Google Translate.
import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { fourierSeriesEnglishCopy as source } from '../../src/growth600/locales/fourier-series-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/fourier-series-calculator.mjs', import.meta.url);
const immutableFields = new Set(['formula']);
const excludedMetadata = new Set(['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt']);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') {
    if (!excludedMetadata.has(path.at(-1)) && !immutableFields.has(path.at(-1))) paths.push(path);
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function setAtPath(object, path, value) {
  let parent = object;
  for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value;
  else parent[path.at(-1)] = value;
}
function fitText(value, limit) {
  const normalized = String(value).replace(/\s+/gu, ' ').trim();
  const chars = [...normalized];
  if (chars.length <= limit) return normalized;
  const candidate = chars.slice(0, limit - 1).join('');
  const sentenceEnds = [...candidate.matchAll(/[.!?。！？](?=\s|$)/gu)];
  const sentenceEnd = sentenceEnds.at(-1)?.index;
  if (sentenceEnd != null && sentenceEnd >= Math.floor(limit * 0.6)) return candidate.slice(0, sentenceEnd + 1).trim();
  const boundary = candidate.lastIndexOf(' ');
  const text = boundary >= Math.floor(limit * 0.6) ? candidate.slice(0, boundary) : candidate;
  return `${text.replace(/[\s:;,–-]+$/u, '')}…`;
}
function normalize(copy) {
  const brand = ' | UsefulVerse';
  let prefix = String(copy.title).split('|', 1)[0].replace(/987654\d{5}456789/g, '').trim();
  if (!prefix || prefix === 'Free Fourier Series Calculator') prefix = copy.name;
  copy.title = `${fitText(prefix, 60 - [...brand].length)}${brand}`;
  copy.description = fitText(copy.description, 160);
  copy.fields.formula = source.fields.formula;
  copy.copyLanguage = copy.copyLanguage || 'en';
  const clean = (value) => {
    if (typeof value === 'string') return value.replace(/987654\d{5}456789/g, '').replace(/\s+/gu, ' ').trim();
    if (Array.isArray(value)) return value.map(clean);
    if (value && typeof value === 'object') for (const key of Object.keys(value)) value[key] = clean(value[key]);
    return value;
  };
  return clean(copy);
}
async function translate(locale, phrases, offset) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', locale === 'zh_tw' ? 'zh-TW' : locale); url.searchParams.set('dt', 't');
  const markers = phrases.map((_, index) => `987654${String(offset + index).padStart(5, '0')}456789`);
  url.searchParams.set('q', phrases.map((phrase, index) => `${markers[index]} ${phrase}`).join('\n'));
  const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
  if (!response.ok) throw new Error(`Translation failed for ${locale}: HTTP ${response.status}`);
  const joined = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('\n');
  return Promise.all(markers.map(async (marker, index) => {
    const start = joined.indexOf(marker);
    if (start < 0) return phrases[index];
    const from = start + marker.length;
    const nextPositions = markers.slice(index + 1).map((next) => joined.indexOf(next, from)).filter((position) => position >= 0);
    const end = nextPositions.length ? Math.min(...nextPositions) : joined.length;
    return joined.slice(from, end).trim() || phrases[index];
  }));
}
collect(source);
const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));
const result = {};
async function checkpoint() {
  await writeFile(target, `// Static machine-translated drafts. No translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
}
for (const locale of Object.keys(locales)) {
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

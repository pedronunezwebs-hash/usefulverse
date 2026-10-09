// One-time static translations; the published tool never calls Google Translate.
import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { timer555EnglishCopy as source } from '../../src/growth600/locales/555-timer-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/555-timer-calculator.mjs', import.meta.url);
const immutableFormulaPaths = new Set(['formulaNote']);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') {
    if (!['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt'].includes(path.at(-1)) && !immutableFormulaPaths.has(path.at(-1))) paths.push(path);
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
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
  const fieldFixes = {
    es: { monostable: 'Monoestable (pulso único)' },
    ca: { astable: 'Oscil·lador astable (repetitiu)', monostable: 'Monoestable (pols únic)' },
    zh: { monostable: '单稳态（单脉冲）' },
  }[copy.copyLanguage];
  if (fieldFixes) Object.assign(copy.fields, fieldFixes);
  let prefix = String(copy.title).split('|', 1)[0].replace(/987654\d{5}456789/g, '').trim();
  if (!prefix || prefix === 'Free 555 Timer Calculator') prefix = copy.name;
  const max = 60 - [...brand].length;
  prefix = [...prefix].slice(0, max).join('').trimEnd();
  if ([...String(copy.description)].length > 160) copy.description = `${[...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '')}…`;
  copy.title = `${prefix}${brand}`;
  copy.fields.formulaNote = `${copy.fields.astable.split(' (', 1)[0]}: tHIGH = 0.693 × (RA + RB) × C; tLOW = 0.693 × RB × C; T = tHIGH + tLOW; f = 1/T; ${copy.fields.resultWaveformDuty} = tHIGH/T. ${copy.fields.monostable.split(' (', 1)[0]}: tPULSE ≈ 1.1 × R × C.`;
  const clean = (value) => {
    if (typeof value === 'string') return value.replace(/987654\d{5}456789/g, '').replace(/\s+/gu, ' ').trim();
    if (Array.isArray(value)) return value.map(clean);
    if (value && typeof value === 'object') for (const key of Object.keys(value)) value[key] = clean(value[key]);
    return value;
  };
  clean(copy);
  return copy;
}
collect(source);
async function translate(locale, phrases, offset) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', locale === 'zh_tw' ? 'zh-TW' : locale); url.searchParams.set('dt', 't');
  const markers = phrases.map((_, index) => `987654${String(offset + index).padStart(5, '0')}456789`);
  url.searchParams.set('q', phrases.map((phrase, index) => `${markers[index]} ${phrase}`).join('\n'));
  const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
  if (!response.ok) throw new Error(`Translation failed for ${locale}: HTTP ${response.status}`);
  const text = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('\n');
  async function single(phrase) {
    const one = new URL('https://translate.googleapis.com/translate_a/single');
    one.searchParams.set('client', 'gtx'); one.searchParams.set('sl', 'en'); one.searchParams.set('tl', locale === 'zh_tw' ? 'zh-TW' : locale); one.searchParams.set('dt', 't'); one.searchParams.set('q', phrase);
    const res = await fetch(one, { signal: AbortSignal.timeout(25000) });
    if (!res.ok) throw new Error(`Translation fallback failed for ${locale}: HTTP ${res.status}`);
    return ((await res.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('').trim();
  }
  return Promise.all(markers.map(async (marker, index) => {
    const start = text.indexOf(marker);
    if (start < 0) return single(phrases[index]);
    const contentStart = start + marker.length;
    const ends = markers.slice(index + 1).map((next) => text.indexOf(next, contentStart)).filter((at) => at >= 0);
    const end = ends.length ? Math.min(...ends) : text.length;
    const value = text.slice(contentStart, end).trim();
    return value || single(phrases[index]);
  }));
}
let result = {};
try { result = structuredClone((await import(`${target.href}?resume=${Date.now()}`)).default); }
catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }
const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));
async function checkpoint() { await writeFile(target, `// Static machine-translated drafts. No translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(result)});\n`); }
for (const locale of Object.keys(locales)) {
  if (result[locale]) {
    const existing = result[locale];
    const missingPaths = paths.filter((path) => {
      const value = path.reduce((parent, key) => parent?.[key], existing);
      return typeof value !== 'string' || !value.trim();
    });
    if (missingPaths.length) {
      const missingPhrases = missingPaths.map((path) => path.reduce((parent, key) => parent[key], source));
      const translated = locale === 'en' ? missingPhrases : await translate(locale, missingPhrases, 0);
      missingPaths.forEach((path, index) => setAtPath(existing, path, translated[index]));
      existing.copyLanguage = locale;
    }
    result[locale] = normalize(existing);
    await checkpoint();
    if (missingPaths.length) console.log(`${locale}: filled ${missingPaths.length} new labels`);
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

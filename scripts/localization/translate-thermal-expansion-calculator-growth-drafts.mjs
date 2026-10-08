// One-time static machine-translated drafts; production pages make no translation-service requests.
import { readFile, writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { thermalExpansionCalculatorEnglishCopy as source } from '../../src/growth600/locales/thermal-expansion-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/thermal-expansion-calculator.mjs', import.meta.url);
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
function truncate(text, limit) { return text.length <= limit ? text : `${text.slice(0, limit - 1).replace(/\s+\S*$/u, '')}…`; }
function normalize(copy) {
  const brandSuffix = ' | UsefulVerse';
  const titlePrefix = copy.title.replace(/\s*[|｜]\s*UsefulVerse.*$/iu, '').trim();
  copy.title = `${truncate(titlePrefix, 60 - brandSuffix.length)}${brandSuffix}`;
  copy.description = truncate(copy.description, 160);
  return copy;
}

if (process.argv.includes('--normalize-titles')) {
  const { default: existing } = await import(`${target.href}?normalize=${Date.now()}`);
  const normalized = Object.fromEntries(Object.entries(existing).map(([locale, copy]) => [locale, normalize(structuredClone(copy))]));
  await writeFile(target, `// Static machine-translated drafts. No translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(normalized)});\n`);
  console.log(`Normalized brand suffix and title length for ${Object.keys(normalized).length} static locale copies.`);
  process.exit(0);
}
collect(source);

async function translate(locale, phrases, start) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', locale === 'zh_tw' ? 'zh-TW' : locale); url.searchParams.set('dt', 't');
  const markers = phrases.map((_, index) => `987654${String(start + index).padStart(4, '0')}456789`);
  const protectedTerms = ['UsefulVerse', 'ΔT', 'α', 'β', 'γ', '°C', '°F', 'm²', 'm³', 'cm²', 'cm³', 'ft²', 'ft³', 'in²', 'in³'];
  const rows = phrases.map((phrase, index) => {
    let text = phrase;
    const restore = [];
    protectedTerms.forEach((term, termIndex) => {
      const token = `UVTHRMTERM${termIndex}X`;
      if (text.includes(term)) { text = text.replaceAll(term, token); restore.push([token, term]); }
    });
    return { marker: markers[index], text, restore };
  });
  url.searchParams.set('q', rows.map(({ marker, text }) => `${marker} ${text}`).join('\n'));
  const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
  if (!response.ok) throw new Error(`Google Translate failed for ${locale}: HTTP ${response.status}`);
  const translated = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('\n');
  return rows.map(({ marker, restore }, index) => {
    const position = translated.indexOf(marker);
    const begin = position < 0 ? -1 : position + marker.length;
    const next = rows.slice(index + 1).map(({ marker: nextMarker }) => translated.indexOf(nextMarker, Math.max(begin, 0))).find((value) => value >= 0) ?? translated.length;
    let value = begin < 0 ? '' : translated.slice(begin, next).trim();
    for (const [token, term] of restore) value = value.replaceAll(token, term);
    return value || phrases[index];
  });
}

const result = {};
const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));
async function checkpoint() { await writeFile(target, `// Static machine-translated drafts. No translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(result)});\n`); }
for (const locale of Object.keys(locales)) {
  const copy = structuredClone(source);
  if (locale !== 'en') {
    const translated = [];
    for (let start = 0; start < phrases.length; start += 10) translated.push(...await translate(locale, phrases.slice(start, start + 10), start));
    paths.forEach((path, index) => setAtPath(copy, path, translated[index]));
    copy.localizationStatus = 'machine-accepted'; copy.localizationAcceptedBy = 'site-owner'; copy.localizationAcceptedAt = '2026-10-09';
  } else copy.localizationStatus = 'approved';
  copy.copyLanguage = locale;
  result[locale] = normalize(copy);
  await checkpoint();
  console.log(`${locale}: ${phrases.length} strings`);
}
console.log(`Wrote ${Object.keys(result).length} static locale copies.`);

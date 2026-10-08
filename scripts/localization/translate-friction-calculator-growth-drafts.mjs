// One-time static Google Translate drafts; the published site never calls this service.
import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { frictionCalculatorEnglishCopy as source } from '../../src/growth600/locales/friction-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/friction-calculator.mjs', import.meta.url);
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
function normalize(copy, locale) {
  if (locale !== 'en') {
    const suffix = ' free | UsefulVerse';
    copy.title = `${copy.name.slice(0, 60 - suffix.length)}${suffix}`;
  }
  if (copy.description.length > 160) copy.description = `${copy.description.slice(0, 157).replace(/\s+\S*$/u, '')}…`;
  return copy;
}
collect(source);

async function translate(locale, phrases, start) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', locale === 'zh_tw' ? 'zh-TW' : locale); url.searchParams.set('dt', 't');
  const markers = phrases.map((_, index) => `987654${String(start + index).padStart(4, '0')}456789`);
  const formulas = ['μsN', 'μkN', 'mg cos(θ)', 'mg sin(θ)', 'm/s²', 'Coulomb'];
  const rows = phrases.map((phrase, index) => {
    let text = phrase;
    const restore = [];
    formulas.forEach((formula, formulaIndex) => {
      const token = `UVFRICFORM${formulaIndex}X`;
      if (text.includes(formula)) { text = text.replaceAll(formula, token); restore.push([token, formula]); }
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
    for (const [token, formula] of restore) value = value.replaceAll(token, formula);
    return value || phrases[index];
  });
}

const result = {};
const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));
async function checkpoint() {
  await writeFile(target, `// Static machine-translated drafts. No translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
}
for (const locale of Object.keys(locales)) {
  const copy = structuredClone(source);
  if (locale !== 'en') {
    const translated = [];
    for (let start = 0; start < phrases.length; start += 10) translated.push(...await translate(locale, phrases.slice(start, start + 10), start));
    paths.forEach((path, index) => setAtPath(copy, path, translated[index]));
    copy.localizationStatus = 'machine-accepted'; copy.localizationAcceptedBy = 'site-owner'; copy.localizationAcceptedAt = '2026-10-09';
  } else copy.localizationStatus = 'approved';
  copy.copyLanguage = locale;
  result[locale] = normalize(copy, locale);
  await checkpoint();
  console.log(`${locale}: ${phrases.length} strings`);
}
console.log(`Wrote ${Object.keys(result).length} static locale copies.`);

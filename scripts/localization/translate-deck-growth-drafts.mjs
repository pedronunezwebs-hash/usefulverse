// One-time static machine translations; the published pages never call a translation service.
import { access, writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { deckCalculatorEnglishCopy as source } from '../../src/growth600/locales/deck-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/deck-calculator.mjs', import.meta.url);
const localeKeys = Object.keys(locales);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (path.at(-1) !== 'copyLanguage') paths.push(path); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
collect(source);
function setAtPath(targetObject, path, value) {
  let parent = targetObject;
  for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value;
  else parent[path.at(-1)] = value;
}
function normalize(copy) {
  copy.title = `${copy.name.slice(0, 43)} free unlimited | UsefulVerse`;
  if (copy.title.length > 60) copy.title = `${copy.name.slice(0, 60 - ' | UsefulVerse'.length)} | UsefulVerse`;
  if (copy.description.length > 160) copy.description = `${copy.description.slice(0, 157).replace(/\s+\S*$/u, '')}…`;
  return copy;
}
async function translate(locale, phrases, start) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', locale === 'zh_tw' ? 'zh-TW' : locale); url.searchParams.set('dt', 't');
  const markers = phrases.map((_, index) => `987654${String(start + index).padStart(4, '0')}456789`);
  url.searchParams.set('q', phrases.map((phrase, index) => `${markers[index]} ${phrase.replace(/\{([^{}]+)\}/gu, (_, token) => `UVTOKENX${token}X`)}`).join('\n'));
  let text = '';
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
      if (!response.ok) throw new Error(`Translation request failed: ${locale}, HTTP ${response.status}`);
      text = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('\n');
      lastError = undefined;
      break;
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  if (lastError) throw lastError;
  return markers.map((marker, index) => {
    const begin = text.indexOf(marker);
    const startText = begin < 0 ? -1 : begin + marker.length;
    const later = markers.slice(index + 1).map((next) => text.indexOf(next, Math.max(startText, 0))).find((position) => position >= 0) ?? text.length;
    const value = startText < 0 ? '' : text.slice(startText, later).replace(/UVTOKENX([^X]+)X/gu, (_, token) => `{${token}}`).trim();
    // Some short queries make Google omit a marker; keep the copy complete instead of aborting.
    return value || phrases[index];
  });
}

let result = {};
if (!process.argv.includes('--regenerate')) {
  try { await access(target); result = { ...(await import(`${target.href}?resume=${Date.now()}`)).default }; } catch (error) { if (error.code !== 'ENOENT') throw error; }
}
const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));
async function checkpoint() { await writeFile(target, `// Static machine-translated drafts. No translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(result)});\n`); }
for (const locale of localeKeys) {
  const draft = result[locale] ? structuredClone(result[locale]) : structuredClone(source);
  const missingPaths = result[locale]
    ? paths.filter((path) => typeof path.reduce((parent, key) => parent?.[key], draft) !== 'string')
    : paths;
  if (!missingPaths.length) continue;
  if (locale === 'en') {
    missingPaths.forEach((path) => setAtPath(draft, path, path.reduce((parent, key) => parent[key], source)));
  } else {
    const missingPhrases = missingPaths.map((path) => path.reduce((parent, key) => parent[key], source));
    const translated = [];
    for (let start = 0; start < missingPhrases.length; start += 10) translated.push(...await translate(locale, missingPhrases.slice(start, start + 10), start));
    missingPaths.forEach((path, index) => setAtPath(draft, path, translated[index]));
  }
  draft.copyLanguage = locale;
  result[locale] = normalize(draft);
  await checkpoint();
  console.log(`${locale}: ${missingPaths.length} translated strings`);
}
for (const locale of localeKeys) normalize(result[locale]);
await checkpoint();
console.log(`Wrote ${Object.keys(result).length} locale drafts.`);

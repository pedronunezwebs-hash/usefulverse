// One-time machine-translation drafts; no translation request runs on the published site.
import { access, writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { weightLossCalculatorEnglishCopy as source } from '../../src/growth600/locales/weight-loss-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/weight-loss-calculator-final.mjs', import.meta.url);
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
function targetCode(locale) { return locale === 'zh_tw' ? 'zh-TW' : locale; }
function titleWithBrand(copy) {
  const suffix = ' | UsefulVerse';
  const maxNameLength = 60 - suffix.length;
  const prefix = copy.title.split('|')[0].trim();
  if (prefix.length <= maxNameLength) return `${prefix}${suffix}`;
  return `${prefix.slice(0, maxNameLength).replace(/\s+\S*$/u, '').trim()}${suffix}`;
}
function normalizeStrings(value) {
  if (typeof value === 'string') return value.replace(/\s+/gu, ' ').trim();
  if (Array.isArray(value)) return value.map(normalizeStrings);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, normalizeStrings(child)]));
  return value;
}
async function translate(locale, phrases) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', targetCode(locale)); url.searchParams.set('dt', 't');
  const markers = phrases.map((_, index) => `UVZX${String(index).padStart(4, '0')}QXZ`);
  url.searchParams.set('q', phrases.map((phrase, index) => {
    let tokenIndex = 0;
    return `${phrase.replace(/\{[a-z][a-zA-Z0-9]*\}/gu, () => `UVTOKEN${tokenIndex++}X`)} ${markers[index]}`;
  }).join('\n'));
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error(`Translation request failed: ${locale}, HTTP ${response.status}`);
      const translatedText = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('\n');
      let previousEnd = 0;
      const translated = markers.map((marker) => {
        const markerPosition = translatedText.indexOf(marker, previousEnd);
        if (markerPosition < 0) return '';
        const value = translatedText.slice(previousEnd, markerPosition).replace(/UVZX\d{4}QXZ/gu, '').trim();
        previousEnd = markerPosition + marker.length;
        return value;
      });
      const missing = translated.findIndex((value) => !value);
      if (missing < 0) return translated;
      throw new Error(`Missing translation ${locale}/${missing}`);
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 750 * (attempt + 1)));
    }
  }
  try {
    const individual = [];
    for (const phrase of phrases) {
      const singleUrl = new URL(url);
      singleUrl.searchParams.set('q', phrase.replace(/\{[a-z][a-zA-Z0-9]*\}/gu, (token) => token));
      const response = await fetch(singleUrl, { signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error(`Translation fallback failed: ${locale}, HTTP ${response.status}`);
      const value = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('').trim();
      if (!value) throw new Error(`Empty translation fallback: ${locale}`);
      individual.push(value);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    return individual;
  } catch {
    throw lastError;
  }
}

let result = {};
try { await access(target); result = { ...(await import(`${target.href}?resume=${Date.now()}`)).default }; } catch (error) { if (error.code !== 'ENOENT') throw error; }
const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));
for (const locale of Object.keys(locales)) {
  if (result[locale]) continue;
  const draft = structuredClone(source);
  if (locale !== 'en') {
    const translated = [];
    for (let start = 0; start < phrases.length; start += 5) {
      translated.push(...await translate(locale, phrases.slice(start, start + 5)));
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    paths.forEach((path, index) => setAtPath(draft, path, translated[index]));
  }
  draft.copyLanguage = locale;
  draft.title = titleWithBrand(draft);
  if (draft.description.length > 160) draft.description = `${draft.description.slice(0, 157).replace(/\s+\S*$/u, '')}…`;
  result[locale] = draft;
  await writeFile(target, `// Static machine-translated drafts. No translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
  console.log(`${locale}: ${phrases.length} strings`);
}
for (const [locale, copy] of Object.entries(result)) {
  result[locale] = normalizeStrings(copy);
  result[locale].title = titleWithBrand(result[locale]);
}
await writeFile(target, `// Static machine-translated drafts. No translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(result)});\n`);

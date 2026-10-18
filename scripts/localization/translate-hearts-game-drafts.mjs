// One-time basic machine translation; no translation request runs on the published site.
import { access, writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { heartsGameEnglishCopy as source } from '../../src/growth600/locales/hearts-game.en.mjs';

const target = new URL('../../src/growth600/locales/hearts-game-final.mjs', import.meta.url);
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
function normalizeStrings(value) {
  if (typeof value === 'string') return value.replace(/\s+/gu, ' ').trim();
  if (Array.isArray(value)) return value.map(normalizeStrings);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, normalizeStrings(child)]));
  return value;
}
function titleWithBrand(copy) {
  const suffix = ' | UsefulVerse';
  const max = 60 - suffix.length;
  let prefix = copy.title.split('|')[0].trim();
  if (prefix.length > max) prefix = `${prefix.slice(0, max).replace(/\s+\S*$/u, '').trim()}`;
  return `${prefix}${suffix}`;
}
async function requestTranslationBatch(locale, phrases, markers) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', targetCode(locale)); url.searchParams.set('dt', 't');
  url.searchParams.set('q', phrases.map((phrase, index) => {
    let tokenIndex = 0;
    return `${markers[index]} ${phrase.replace(/\{[a-z][a-zA-Z0-9]*\}/gu, () => `UVTOKEN${tokenIndex++}X`)}`;
  }).join('\n'));
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`Google Translate returned HTTP ${response.status} for ${locale}.`);
  const translatedText = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('\n');
  return markers.map((marker, index) => {
    const start = translatedText.indexOf(marker);
    const valueStart = start < 0 ? -1 : start + marker.length;
    const nextStart = markers.slice(index + 1).map((next) => translatedText.indexOf(next, Math.max(0, valueStart))).find((position) => position >= 0) ?? translatedText.length;
    return valueStart < 0 ? '' : translatedText.slice(valueStart, nextStart).replace(/987654\d{4}456789/gu, '').trim();
  });
}
async function translate(locale, phrases) {
  const markers = phrases.map((_, index) => `987654${String(index).padStart(4, '0')}456789`);
  const values = await requestTranslationBatch(locale, phrases, markers);
  return Promise.all(values.map(async (value, index) => {
    let translated = value;
    if (!translated) {
      const url = new URL('https://translate.googleapis.com/translate_a/single');
      url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', targetCode(locale)); url.searchParams.set('dt', 't');
      let tokenIndex = 0;
      const phrase = phrases[index].replace(/\{[a-z][a-zA-Z0-9]*\}/gu, () => `UVTOKEN${tokenIndex++}X`);
      url.searchParams.set('q', phrase);
      const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error(`Google Translate single-string retry returned HTTP ${response.status} for ${locale}/${index}.`);
      translated = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('').trim();
    }
    const tokens = [...phrases[index].matchAll(/\{[a-z][a-zA-Z0-9]*\}/gu)].map((match) => match[0]);
    const restored = translated.replace(/UVTOKEN(\d+)X/gu, (_, tokenIndex) => tokens[Number(tokenIndex)] ?? '');
    if (!restored) throw new Error(`Missing translated text ${locale}/${index}, including single-string retry.`);
    for (const token of tokens) if (!restored.includes(token)) throw new Error(`Lost placeholder ${token} in ${locale}/${index}.`);
    return restored;
  }));
}

let result = {};
try { await access(target); result = { ...(await import(`${target.href}?resume=${Date.now()}`)).default }; } catch (error) { if (error.code !== 'ENOENT') throw error; }
const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));
for (const locale of Object.keys(locales)) {
  if (result[locale]) continue;
  const draft = structuredClone(source);
  if (locale !== 'en') {
    const translated = [];
    for (let start = 0; start < phrases.length; start += 10) {
      translated.push(...await translate(locale, phrases.slice(start, start + 10)));
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    paths.forEach((path, index) => setAtPath(draft, path, translated[index]));
  }
  draft.copyLanguage = locale;
  draft.title = titleWithBrand(draft);
  if (draft.description.length > 160) draft.description = `${draft.description.slice(0, 157).replace(/\s+\S*$/u, '')}…`;
  result[locale] = normalizeStrings(draft);
  await writeFile(target, `// Static machine-translated drafts. No translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
  console.log(`${locale}: ${phrases.length} strings translated`);
}
if (Object.keys(result).length !== Object.keys(locales).length) throw new Error('The translation matrix does not cover every locale.');
for (const [locale, copy] of Object.entries(result)) {
  if (copy.title.length > 60 || copy.description.length > 160) throw new Error(`Metadata is too long for ${locale}.`);
  if (copy.copyLanguage !== locale) throw new Error(`Wrong locale key in ${locale}.`);
}
await writeFile(target, `// Static machine-translated drafts. No translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
console.log(`Saved ${Object.keys(result).length} locale drafts to ${target.pathname}`);

// One-time static Google Translate drafts; this module is never imported at runtime.
import { writeFile } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { wallpaperCalculatorEnglishCopy as source } from '../../src/growth600/locales/wallpaper-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/wallpaper-calculator-final.mjs', import.meta.url);
const checkpointPath = '/tmp/uv-growth600-wallpaper-translations.json';
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
function translationCode(language) { return language === 'zh_tw' ? 'zh-TW' : language; }
function normalize(copy, language) {
  const brandSuffix = ' | UsefulVerse';
  const free = ({ en: 'free', es: 'gratis', fr: 'gratuit', de: 'gratis', it: 'gratis', pt: 'grátis' })[language] ?? 'free';
  const suffix = ` ${free}${brandSuffix}`;
  copy.title = `${copy.name.slice(0, Math.max(1, 60 - suffix.length))}${suffix}`;
  if (copy.description.length > 160) copy.description = `${copy.description.slice(0, 157).replace(/\s+\S*$/u, '')}…`;
  return copy;
}
async function translate(language, phrases, start) {
  const url = new URL('https://clients5.google.com/translate_a/t');
  url.searchParams.set('client', 'dict-chrome-ex'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', translationCode(language));
  const markers = phrases.map((_, index) => `UVWALL${String(start + index).padStart(4, '0')}X`);
  url.searchParams.set('q', phrases.map((phrase, index) => `${markers[index]} ${phrase.replace(/\{([^{}]+)\}/gu, (_, token, tokenIndex) => `UVTOKEN${tokenIndex}X${token}X`)}`).join('\n'));
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
      if (!response.ok) throw new Error(`Translation request failed: ${language}, HTTP ${response.status}`);
      const payload = await response.json();
      const text = Array.isArray(payload) ? payload.join('') : '';
      return markers.map((marker, index) => {
        const markerPattern = new RegExp(`${marker.slice(0, -1)}X?`, 'u');
        let value = text.split(/\r?\n/u).find((line) => markerPattern.test(line))?.replace(markerPattern, '').trim() ?? '';
        value = value.replace(/UVTOKEN(\d+)X([^X]+)X/gu, (_, _index, token) => `{${token}}`);
        if (!value) throw new Error(`Missing translation ${language}/${start + index}`);
        return value;
      });
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  throw lastError;
}

let copies = {};
try { copies = JSON.parse(await readFile(checkpointPath, 'utf8')); } catch {}
for (const language of localeKeys) {
  if (copies[language]) { console.log(`${language}: restored completed checkpoint`); continue; }
  if (language === 'en') { copies.en = { ...source, copyLanguage: 'en' }; continue; }
  const draft = structuredClone(source);
  const phrases = paths.map((path) => path.reduce((value, part) => value[part], source));
  for (let start = 0; start < phrases.length; start += 8) {
    const translated = await translate(language, phrases.slice(start, start + 8), start);
    translated.forEach((value, index) => setAtPath(draft, paths[start + index], value));
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  draft.copyLanguage = language;
  copies[language] = normalize(draft, language);
  await writeFile(checkpointPath, JSON.stringify(copies));
  console.log(`${language}: ${phrases.length} translated strings`);
}
await writeFile(target, `// Static machine-translated drafts. No translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
await (await import('node:fs/promises')).unlink(checkpointPath).catch(() => {});
console.log(`Wrote ${Object.keys(copies).length} locale drafts to ${target.pathname}`);

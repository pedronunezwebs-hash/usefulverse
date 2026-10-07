// One-time static drafts via Google's free web translation endpoint; never used at runtime.
import { access, writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { roofPitchCalculatorEnglishCopy as source } from '../../src/growth600/locales/roof-pitch-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/roof-pitch-calculator.mjs', import.meta.url);
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
  const suffix = ' | UsefulVerse';
  copy.title = `${copy.name.slice(0, 60 - suffix.length)}${suffix}`;
  if (copy.description.length > 160) copy.description = `${copy.description.slice(0, 157).replace(/\s+\S*$/u, '')}…`;
  return copy;
}
function targetCode(locale) { return locale === 'zh_tw' ? 'zh-TW' : locale; }
async function translate(locale, phrases, start) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', targetCode(locale)); url.searchParams.set('dt', 't');
  const markers = phrases.map((_, index) => `987654${String(start + index).padStart(4, '0')}456789`);
  url.searchParams.set('q', phrases.map((phrase, index) => `${markers[index]} ${phrase.replace(/\{([^{}]+)\}/gu, (_, token, i) => `UVTOKEN${i}X${token}X`)}`).join('\n'));
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
      if (!response.ok) throw new Error(`Translation request failed: ${locale}, HTTP ${response.status}`);
      const segments = (await response.json())?.[0] ?? [];
      const translatedText = segments.map((part) => part?.[0] ?? '').join('\n');
      return markers.map((marker, index) => {
        const markerPosition = translatedText.indexOf(marker);
        const markerStart = markerPosition < 0 ? -1 : markerPosition + marker.length;
        const next = markers.slice(index + 1).map((nextMarker) => translatedText.indexOf(nextMarker, Math.max(markerStart, 0))).find((position) => position >= 0) ?? translatedText.length;
        let value = markerStart < 0 ? '' : translatedText.slice(markerStart, next).replaceAll(marker, '').replace(/987654\d{4}456789/gu, '').trim();
        if (!value && markerPosition >= 0) {
          const lineStart = translatedText.lastIndexOf('\n', markerPosition - 1) + 1;
          value = translatedText.slice(lineStart, markerPosition).replace(/987654\d{4}456789/gu, '').trim();
        }
        value = value.replace(/UVTOKEN(\d+)X([^X]+)X/gu, (_, _i, token) => `{${token}}`);
        if (!value) throw new Error(`Missing translation ${locale}/${start + index}`);
        return value;
      });
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)));
    }
  }
  throw lastError;
}

let result = {};
try {
  await access(target);
  result = { ...(await import(`${target.href}?resume=${Date.now()}`)).default };
  console.log(`Resuming from ${Object.keys(result).length} saved locale drafts.`);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
async function checkpoint() {
  await writeFile(target, `// Static machine-translated drafts. No translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
}
for (const locale of localeKeys) {
  if (result[locale]) continue;
  if (locale === 'en') { result.en = { ...source, copyLanguage: 'en' }; await checkpoint(); continue; }
  const draft = structuredClone(source);
  const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));
  const translated = [];
  for (let start = 0; start < phrases.length; start += 12) translated.push(...await translate(locale, phrases.slice(start, start + 12), start));
  paths.forEach((path, index) => setAtPath(draft, path, translated[index]));
  draft.copyLanguage = locale;
  result[locale] = normalize(draft);
  await checkpoint();
  console.log(`${locale}: ${phrases.length} translated strings`);
}
await checkpoint();
console.log(`Wrote ${Object.keys(result).length} locale drafts.`);

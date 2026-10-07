// One-time static drafts via Google's free web translation endpoint; never used at runtime.
import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { poolVolumeCalculatorEnglishCopy as source } from '../../src/growth600/locales/pool-volume-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/pool-volume-calculator.mjs', import.meta.url);
const localeKeys = Object.keys(locales);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (path.at(-1) !== 'copyLanguage') paths.push(path); }
  else if (Array.isArray(value)) value.forEach((item, i) => collect(item, [...path, String(i)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
collect(source);
function setAtPath(targetObject, path, value) {
  let parent = targetObject;
  for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value;
  else parent[path.at(-1)] = value;
}
function codes(language) { return language === 'zh_tw' ? 'zh-TW' : language; }
function normalize(copy) {
  const suffix = ' | UsefulVerse';
  copy.title = `${copy.name.slice(0, 60 - suffix.length)}${suffix}`;
  if (copy.description.length > 160) copy.description = `${copy.description.slice(0, 157).replace(/\s+\S*$/u, '')}…`;
  return copy;
}

async function translate(language, phrases, start) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', codes(language)); url.searchParams.set('dt', 't');
  const markers = phrases.map((_, i) => `UVPOOL${String(start + i).padStart(4, '0')}X`);
  url.searchParams.set('q', phrases.map((phrase, i) => `${markers[i]} ${phrase.replace(/\{([^{}]+)\}/gu, (_, token, j) => `UVTOKEN${j}X${token}X`)}`).join('\n'));
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
      if (!response.ok) throw new Error(`Translation request failed: ${language}, HTTP ${response.status}`);
      const text = (await response.json())?.[0]?.map((part) => part?.[0] ?? '').join('') ?? '';
      const result = markers.map((marker, i) => {
        let value = text.split(/\r?\n/u).find((line) => line.includes(marker))?.replace(marker, '').trim() ?? '';
        value = value.replace(/UVTOKEN(\d+)X([^X]+)X/gu, (_, _i, token) => `{${token}}`);
        if (!value) throw new Error(`Missing translation ${language}/${start + i}`);
        return value;
      });
      return result;
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)));
    }
  }
  throw lastError;
}

const copies = {};
for (const language of localeKeys) {
  if (language === 'en') { copies.en = { ...source, copyLanguage: 'en' }; continue; }
  const draft = structuredClone(source);
  const phrases = paths.map((path) => path.reduce((value, part) => value[part], source));
  const translated = [];
  for (let i = 0; i < phrases.length; i += 12) translated.push(...await translate(language, phrases.slice(i, i + 12), i));
  paths.forEach((path, i) => setAtPath(draft, path, translated[i]));
  draft.copyLanguage = language;
  copies[language] = normalize(draft);
  console.log(`${language}: ${phrases.length} translated strings`);
}
await writeFile(target, `// Static machine-translated drafts. No translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
console.log(`Wrote ${Object.keys(copies).length} locale drafts.`);

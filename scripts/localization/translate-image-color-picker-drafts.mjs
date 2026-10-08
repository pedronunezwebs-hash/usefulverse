// One-time static Google Translate drafts; this module is never imported at runtime.
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { imageColorPickerEnglishCopy as source } from '../../src/growth600/locales/image-color-picker.en.mjs';

const destination = new URL('../../src/growth600/locales/image-color-picker-final.mjs', import.meta.url);
const checkpointPath = '/tmp/uv-growth600-image-color-picker-translations.json';
const localeKeys = Object.keys(locales);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (path.at(-1) !== 'copyLanguage') paths.push(path); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function setAtPath(target, path, value) {
  let parent = target;
  for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value;
  else parent[path.at(-1)] = value;
}
collect(source);

function translationCode(language) { return language === 'zh_tw' ? 'zh-TW' : language; }
function normalize(copy, language) {
  const free = ({ en: 'free', es: 'gratis', fr: 'gratuit', pt: 'grátis', de: 'kostenlos', ja: '無料', ko: '무료', id: 'gratis', hi: 'मुफ़्त', ar: 'مجاني', zh: '免费', bn: 'বিনামূল্যে', ru: 'бесплатно', ur: 'مفت', tr: 'ücretsiz', vi: 'miễn phí', it: 'gratis', zh_tw: '免費', bg: 'безплатно', ca: 'gratis', nl: 'gratis', el: 'δωρεάν', ms: 'percuma', pl: 'za darmo', sv: 'gratis', th: 'ฟรี', uk: 'безкоштовно', sw: 'bila malipo', mr: 'मोफत', te: 'ఉచితం', ha: 'kyauta', tl: 'libre', ta: 'இலவசம்', fa: 'رایگان', am: 'ነፃ', gu: 'મફત' })[language] ?? 'free';
  if (language === 'sw') copy.name = 'Kichagua rangi ya picha';
  const suffix = ` ${free} | UsefulVerse`;
  const maxNameLength = 60 - suffix.length;
  const shortName = copy.name.length <= maxNameLength ? copy.name : copy.name.slice(0, maxNameLength).replace(/\s+\S*$/u, '').trim();
  copy.title = `${shortName}${suffix}`;
  if (copy.description.length > 160) copy.description = `${copy.description.slice(0, 157).replace(/\s+\S*$/u, '')}…`;
  return copy;
}

async function translate(language, phrases, start) {
  const url = new URL('https://clients5.google.com/translate_a/t');
  url.searchParams.set('client', 'dict-chrome-ex'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', translationCode(language));
  const markers = phrases.map((_, index) => `UVCP${String(start + index).padStart(4, '0')}X`);
  url.searchParams.set('q', phrases.map((phrase, index) => `${markers[index]} ${phrase}`).join('\n'));
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
      if (!response.ok) throw new Error(`Translation request failed: ${language}, HTTP ${response.status}`);
      const payload = await response.json();
      const text = Array.isArray(payload) ? payload.join('') : '';
      return markers.map((marker, index) => {
        const markerPattern = new RegExp(`${marker.slice(0, -1)}X?`, 'u');
        const line = text.split(/\r?\n/u).find((item) => markerPattern.test(item));
        const value = line?.replace(markerPattern, '').trim() ?? '';
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
if (!Object.keys(copies).length) {
  try { copies = structuredClone((await import(`${destination.href}?normalize=${Date.now()}`)).default); } catch {}
}
for (const language of localeKeys) {
  if (copies[language]) {
    const draft = structuredClone(copies[language]);
    const pending = paths.filter((path) => typeof path.reduce((value, part) => value?.[part], draft) !== 'string');
    const phrases = pending.map((path) => path.reduce((value, part) => value[part], source));
    for (let start = 0; start < phrases.length; start += 8) {
      const translated = await translate(language, phrases.slice(start, start + 8), start);
      translated.forEach((value, index) => setAtPath(draft, pending[start + index], value));
    }
    draft.copyLanguage = language;
    copies[language] = normalize(draft, language);
    await writeFile(checkpointPath, JSON.stringify(copies));
    continue;
  }
  if (language === 'en') { copies.en = structuredClone(source); continue; }
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
  console.log(`${language}: ${phrases.length} strings translated`);
}
await writeFile(destination, `// Static machine-translated drafts; no translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
await unlink(checkpointPath).catch(() => {});
console.log(`Wrote ${Object.keys(copies).length} locale drafts to ${destination.pathname}`);

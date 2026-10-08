// One-time static Google Translate drafts; the published puzzle never translates at runtime.
import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { slitherlinkEnglishCopy as source } from '../../src/growth600/locales/slitherlink.en.mjs';

const target = new URL('../../src/growth600/locales/slitherlink.mjs', import.meta.url);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') {
    if (!['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt'].includes(path.at(-1))) paths.push(path);
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function setAtPath(targetObject, path, value) {
  let parent = targetObject;
  for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value;
  else parent[path.at(-1)] = value;
}
function targetCode(language) { return language === 'zh_tw' ? 'zh-TW' : language === 'pt' ? 'pt-BR' : language; }
function normalize(copy, language) {
  const suffix = ' | UsefulVerse';
  if (language !== 'en') {
    const maxLead = 60 - suffix.length;
    const titleLead = Array.from(copy.name).slice(0, maxLead).join('').replace(/\s+\S*$/u, '');
    copy.title = `${titleLead || 'Slitherlink'}${suffix}`;
    if (copy.description.length > 160) copy.description = `${Array.from(copy.description).slice(0, 157).join('').replace(/\s+\S*$/u, '')}…`;
    copy.localizationStatus = 'machine-accepted';
    copy.localizationAcceptedBy = 'site-owner';
    copy.localizationAcceptedAt = '2026-10-09';
  } else copy.localizationStatus = 'approved';
  copy.copyLanguage = language;
  return copy;
}
collect(source);

async function translate(language, phrases) {
  const url = new URL('https://clients5.google.com/translate_a/t');
  url.searchParams.set('client', 'dict-chrome-ex');
  url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', targetCode(language));
  url.searchParams.set('dt', 't');
  for (const phrase of phrases) url.searchParams.append('q', phrase);
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25_000) });
      if (!response.ok) throw new Error(`Google Translate failed for ${language}: HTTP ${response.status}`);
      const translated = await response.json();
      if (!Array.isArray(translated) || translated.length !== phrases.length) throw new Error(`Unexpected translation response for ${language}`);
      return translated.map((value, index) => typeof value === 'string' && value.trim() ? value.trim() : phrases[index]);
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  throw lastError;
}

const phrases = paths.map((path) => path.reduce((value, key) => value[key], source));
const copies = {};
for (const language of Object.keys(locales)) {
  if (language === 'en') { copies.en = normalize(structuredClone(source), 'en'); continue; }
  const draft = structuredClone(source);
  const translated = [];
  let batch = [];
  let chars = 0;
  for (let index = 0; index < phrases.length; index += 1) {
    const phrase = phrases[index];
    if (batch.length && chars + phrase.length + 24 > 900) {
      translated.push(...await translate(language, batch));
      batch = []; chars = 0;
    }
    batch.push(phrase); chars += phrase.length + 24;
  }
  if (batch.length) translated.push(...await translate(language, batch));
  paths.forEach((path, index) => setAtPath(draft, path, translated[index] || phrases[index]));
  copies[language] = normalize(draft, language);
  console.log(`${language}: translated ${phrases.length} strings`);
}
await writeFile(target, `// Static machine-translated drafts. No translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
console.log(`Wrote ${Object.keys(copies).length} locale drafts (${phrases.length} strings each).`);

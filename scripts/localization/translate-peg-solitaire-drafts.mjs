// One-time static Google Translate drafts; translations are not requested at runtime.
import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { pegSolitaireEnglishCopy as source } from '../../src/growth600/locales/peg-solitaire.en.mjs';

const target = new URL('../../src/growth600/locales/peg-solitaire.mjs', import.meta.url);
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
  const suffix = ` ${language === 'es' ? 'gratis' : language === 'ar' ? 'مجاني' : 'free'} | UsefulVerse`;
  if (language !== 'en') {
    const maxLead = 60 - suffix.length;
    const lead = Array.from(copy.name).slice(0, maxLead).join('').replace(/\s+\S*$/u, '');
    copy.title = `${lead || copy.name.slice(0, maxLead)}${suffix}`;
    if (copy.description.length > 160) copy.description = `${Array.from(copy.description).slice(0, 157).join('').replace(/\s+\S*$/u, '')}…`;
    copy.localizationStatus = 'machine-accepted';
    copy.localizationAcceptedBy = 'site-owner';
    copy.localizationAcceptedAt = '2026-10-09';
  } else copy.localizationStatus = 'approved';
  copy.copyLanguage = language;
  return copy;
}
collect(source);
const phrases = paths.map((path) => path.reduce((value, key) => value[key], source));

async function translate(language, batch) {
  const url = new URL('https://clients5.google.com/translate_a/t');
  for (const [key, value] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: targetCode(language), dt: 't' })) url.searchParams.set(key, value);
  for (const phrase of batch) url.searchParams.append('q', phrase);
  const response = await fetch(url, { signal: AbortSignal.timeout(25_000) });
  if (!response.ok) throw new Error(`Google Translate failed (${language}): HTTP ${response.status}`);
  const result = await response.json();
  if (!Array.isArray(result) || result.length !== batch.length) throw new Error(`Unexpected translation response for ${language}`);
  return result.map((item, index) => typeof item === 'string' && item.trim() ? item.trim() : batch[index]);
}

const copies = {};
for (const language of Object.keys(locales)) {
  const draft = structuredClone(source);
  if (language !== 'en') {
    const translated = [];
    let batch = [];
    let chars = 0;
    for (const phrase of phrases) {
      if (batch.length && chars + phrase.length + 24 > 900) {
        translated.push(...await translate(language, batch)); batch = []; chars = 0;
      }
      batch.push(phrase); chars += phrase.length + 24;
    }
    if (batch.length) translated.push(...await translate(language, batch));
    paths.forEach((path, index) => setAtPath(draft, path, translated[index] || phrases[index]));
  }
  copies[language] = normalize(draft, language);
  console.log(`${language}: ${phrases.length} strings`);
}
await writeFile(target, `// Static machine-translated drafts. No translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
console.log(`Wrote ${Object.keys(copies).length} locale drafts.`);

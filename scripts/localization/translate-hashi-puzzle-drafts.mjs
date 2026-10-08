// One-time static Google Translate drafts; translation never runs at build/visitor time.
import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { hashiPuzzleEnglishCopy } from '../../src/growth600/locales/hashi-puzzle.en.mjs';

const target = new URL('../../src/growth600/locales/hashi-puzzle.mjs', import.meta.url);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') {
    if (!['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt'].includes(path.at(-1))) paths.push(path);
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function setAtPath(object, path, value) {
  let parent = object;
  for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value;
  else parent[path.at(-1)] = value;
}
function code(language) { return language === 'zh_tw' ? 'zh-TW' : language === 'pt' ? 'pt-BR' : language; }
collect(hashiPuzzleEnglishCopy);
const sourcePhrases = paths.map((path) => path.reduce((value, key) => value[key], hashiPuzzleEnglishCopy));

async function translate(language, batch) {
  const url = new URL('https://clients5.google.com/translate_a/t');
  for (const [key, value] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: code(language), dt: 't' })) url.searchParams.set(key, value);
  batch.forEach((phrase) => url.searchParams.append('q', phrase));
  const response = await fetch(url, { signal: AbortSignal.timeout(25_000) });
  if (!response.ok) throw new Error(`Google Translate failed for ${language}: HTTP ${response.status}`);
  const result = await response.json();
  if (!Array.isArray(result) || result.length !== batch.length) throw new Error(`Unexpected Google Translate response for ${language}.`);
  return result.map((value, index) => typeof value === 'string' && value.trim() ? value.trim() : batch[index]);
}

function normalize(copy, language) {
  if (language !== 'en') {
    const brand = ' | UsefulVerse'; let lead = copy.title.split(/\s*[|｜]\s*/u, 1)[0].replace(/\s*UsefulVerse\s*$/iu, '').trim();
    const maxLead = 60 - brand.length;
    if (Array.from(lead).length > maxLead) {
      const shortened = Array.from(lead).slice(0, maxLead).join(''); const word = shortened.lastIndexOf(' ');
      lead = (word > 16 ? shortened.slice(0, word) : shortened).trimEnd();
    }
    copy.title = `${lead}${brand}`;
    if (copy.description.length > 160) copy.description = `${Array.from(copy.description).slice(0, 157).join('').replace(/\s+\S*$/u, '')}…`;
    copy.localizationStatus = 'machine-accepted'; copy.localizationAcceptedBy = 'site-owner'; copy.localizationAcceptedAt = '2026-10-09';
  } else copy.localizationStatus = 'approved';
  copy.copyLanguage = language;
  return copy;
}

async function makeCopy(language) {
  const copy = structuredClone(hashiPuzzleEnglishCopy);
  if (language !== 'en') {
    let batch = []; let chars = 0; const translations = [];
    for (const phrase of sourcePhrases) {
      if (batch.length && chars + phrase.length + 24 > 850) { translations.push(...await translate(language, batch)); batch = []; chars = 0; }
      batch.push(phrase); chars += phrase.length + 24;
    }
    if (batch.length) translations.push(...await translate(language, batch));
    paths.forEach((path, index) => {
      let value = translations[index] || sourcePhrases[index];
      for (const placeholder of sourcePhrases[index].match(/\{[^}]+\}/gu) ?? []) if (!value.includes(placeholder)) value = `${value} ${placeholder}`;
      setAtPath(copy, path, value);
    });
  }
  return [language, normalize(copy, language)];
}

const codes = Object.keys(locales); const copies = {}; let current = 0;
async function worker() {
  while (current < codes.length) {
    const language = codes[current++]; copies[language] = (await makeCopy(language))[1];
    console.log(`${language}: ${sourcePhrases.length} strings`);
  }
}
await Promise.all(Array.from({ length: 4 }, () => worker()));
await writeFile(target, `// Static machine-translated drafts; no translation call runs in the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
console.log(`Wrote ${Object.keys(copies).length} locale drafts.`);

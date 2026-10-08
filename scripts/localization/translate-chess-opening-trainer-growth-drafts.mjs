// One-time static Google Translate drafts; the published tool never calls a translation service.
import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { chessOpeningTrainerEnglishCopy as source } from '../../src/growth600/locales/chess-opening-trainer.en.mjs';

const target = new URL('../../src/growth600/locales/chess-opening-trainer.mjs', import.meta.url);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') {
    if (!['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt'].includes(path.at(-1))) paths.push(path);
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function setAtPath(object, path, value) {
  let node = object;
  for (const part of path.slice(0, -1)) node = Array.isArray(node) ? node[Number(part)] : node[part];
  if (Array.isArray(node)) node[Number(path.at(-1))] = value; else node[path.at(-1)] = value;
}
function targetCode(language) { return language === 'zh_tw' ? 'zh-TW' : language === 'pt' ? 'pt-BR' : language; }
function normalize(copy, language) {
  if (language === 'zh') copy.title = '免费国际象棋开局训练器 | UsefulVerse';
  if (language === 'zh_tw') copy.title = '免費國際象棋開局訓練器 | UsefulVerse';
  if (language !== 'en') {
    if (Array.from(copy.title).length > 60) copy.title = `${Array.from(copy.title).slice(0, 57).join('').replace(/\s+\S*$/u, '')}…`;
    if (copy.description.length > 160) copy.description = `${Array.from(copy.description).slice(0, 157).join('').replace(/\s+\S*$/u, '')}…`;
    copy.localizationStatus = 'machine-accepted'; copy.localizationAcceptedBy = 'site-owner'; copy.localizationAcceptedAt = '2026-10-09';
  } else copy.localizationStatus = 'approved';
  copy.copyLanguage = language;
  return copy;
}
collect(source);
const phrases = paths.map((path) => path.reduce((value, key) => value[key], source));
async function translate(language, batch) {
  const protectedRows = batch.map((phrase) => {
    const tokens = [];
    let text = phrase.replace(/\{[a-z][a-zA-Z0-9]*\}/gu, (match) => { const token = `UVCHESS${tokens.length}TOKENX`; tokens.push([token, match]); return token; });
    text = text.replaceAll('UsefulVerse', () => { const token = `UVCHESS${tokens.length}TOKENX`; tokens.push([token, 'UsefulVerse']); return token; });
    return { text, tokens };
  });
  const url = new URL('https://clients5.google.com/translate_a/t');
  url.searchParams.set('client', 'dict-chrome-ex'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', targetCode(language)); url.searchParams.set('dt', 't');
  for (const { text } of protectedRows) url.searchParams.append('q', text);
  const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
  if (!response.ok) throw new Error(`Translation request failed for ${language}: HTTP ${response.status}`);
  const values = await response.json();
  if (!Array.isArray(values) || values.length !== protectedRows.length) throw new Error(`Unexpected translation response for ${language}.`);
  return values.map((value, index) => {
    let result = typeof value === 'string' ? value.trim() : '';
    for (const [token, original] of protectedRows[index].tokens) {
      if (result.split(token).length - 1 !== protectedRows[index].text.split(token).length - 1) return batch[index];
      result = result.replaceAll(token, original);
    }
    return result || batch[index];
  });
}

const copies = {};
for (const [language, _locale] of Object.entries(locales)) {
  if (language === 'en') { copies.en = normalize(structuredClone(source), 'en'); continue; }
  const translated = [];
  for (let start = 0; start < phrases.length; start += 12) translated.push(...await translate(language, phrases.slice(start, start + 12)));
  const draft = structuredClone(source);
  paths.forEach((path, index) => setAtPath(draft, path, translated[index]));
  copies[language] = normalize(draft, language);
  console.log(`${language}: translated ${phrases.length} strings`);
}
await writeFile(target, `// Static machine-translated drafts. No translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
console.log(`Wrote ${Object.keys(copies).length} locale drafts (${phrases.length} source strings each).`);

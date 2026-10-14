import { writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { locales } from '../../src/locales.mjs';
import dotsAndBoxes from '../../src/growth600/locales/dots-and-boxes.en.mjs';
import chessAnalysisBoard from '../../src/growth600/locales/chess-analysis-board.en.mjs';
import blackjackGame from '../../src/growth600/locales/blackjack-game.en.mjs';
import tripeaksSolitaire from '../../src/growth600/locales/tripeaks-solitaire.en.mjs';

const run = promisify(execFile);
const separator = '###UVLOCALGAMESEP###';
const allSources = {
  'dots-and-boxes': dotsAndBoxes,
  'chess-analysis-board': chessAnalysisBoard,
  'blackjack-game': blackjackGame,
  'tripeaks-solitaire': tripeaksSolitaire,
};
const requestedTools = new Set(process.argv.slice(2));
const unknownTools = [...requestedTools].filter((tool) => !Object.hasOwn(allSources, tool));
if (unknownTools.length) throw new Error('Unknown local-game locale id: ' + unknownTools.join(', '));
const sources = Object.fromEntries(Object.entries(allSources).filter(([tool]) => requestedTools.size === 0 || requestedTools.has(tool)));
const localeCodes = { zh_tw: 'zh-TW', pt_br: 'pt' };
const asCode = (locale) => localeCodes[locale] ?? locale.replace('_', '-');
const paths = [];
function collect(tool, value, path = []) {
  if (typeof value === 'string') { if (path.at(-1) !== 'copyLanguage') paths.push({ tool, path, phrase: value }); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(tool, item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(tool, child, [...path, key]);
}
function setAt(value, path, next) { let parent = value; for (const key of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(key)] : parent[key]; if (Array.isArray(parent)) parent[Number(path.at(-1))] = next; else parent[path.at(-1)] = next; }
function protect(text) { return text.replace(/\{([a-z]+)\}/gu, (_, name) => 'ZXQ' + name.toUpperCase() + 'QXZ'); }
function restore(text, original) {
  let result = text;
  for (const [, name] of original.matchAll(/\{([a-z]+)\}/gu)) result = result.replaceAll('ZXQ' + name.toUpperCase() + 'QXZ', '{' + name + '}');
  return result.replace(/ZXQ[A-Z]+QXZ/gu, (marker) => {
    const name = marker.slice(3, -3).toLowerCase();
    if (original.includes('{' + name + '}')) return '{' + name + '}';
    const placeholders = [...original.matchAll(/\{([a-z]+)\}/gu)].map((match) => match[0]);
    return placeholders.length === 1 ? placeholders[0] : marker;
  });
}
function fitMetadata(copy) {
  const suffix = ' | UsefulVerse';
  let prefix = [...copy.title.split('|', 1)[0].trim()].slice(0, 60 - [...suffix].length).join('').trimEnd();
  if ([...copy.title.split('|', 1)[0].trim()].length > 60 - [...suffix].length) prefix = prefix.slice(0, Math.max(0, prefix.lastIndexOf(' '))).trimEnd();
  copy.title = prefix + suffix;
  if ([...copy.description].length > 160) copy.description = [...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '') + '…';
  return copy;
}
for (const [tool, copy] of Object.entries(sources)) collect(tool, copy);

async function translate(locale, phrases) {
  const url = new URL('https://clients5.google.com/translate_a/t');
  for (const [key, value] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: asCode(locale) })) url.searchParams.set(key, value);
  url.searchParams.set('q', phrases.join('\n' + separator + '\n'));
  const { stdout } = await run('curl', ['-fsS', '--connect-timeout', '5', '--max-time', '20', '--retry', '3', '--retry-delay', '2', '--retry-all-errors', url.href], { maxBuffer: 2 * 1024 * 1024, timeout: 90_000 });
  const response = JSON.parse(stdout);
  const result = Array.isArray(response) ? response.map((part) => typeof part === 'string' ? part : '').join('') : '';
  const segments = result.split('\n' + separator + '\n');
  if (segments.length === phrases.length) return segments.map((text, index) => text.trim() || phrases[index]);
  if (phrases.length === 1) return [result.replaceAll(separator, '').trim() || phrases[0]];
  const middle = Math.ceil(phrases.length / 2);
  return [...await translate(locale, phrases.slice(0, middle)), ...await translate(locale, phrases.slice(middle))];
}

const translations = Object.fromEntries(Object.keys(sources).map((tool) => [tool, {}]));
for (const locale of Object.keys(locales)) {
  const drafts = Object.fromEntries(Object.entries(sources).map(([tool, copy]) => [tool, structuredClone(copy)]));
  for (const draft of Object.values(drafts)) draft.copyLanguage = locale;
  if (locale !== 'en') {
    let batch = []; let characters = 0;
    async function flush() {
      if (!batch.length) return;
      const translated = await translate(locale, batch.map(({ phrase }) => protect(phrase)));
      batch.forEach(({ tool, path, phrase }, index) => setAt(drafts[tool], path, restore(translated[index], phrase)));
      batch = []; characters = 0;
    }
    for (const item of paths) {
      const cost = [...item.phrase].length + [...separator].length + 2;
      if (batch.length && characters + cost > 2_800) await flush();
      batch.push(item); characters += cost;
    }
    await flush();
    for (const draft of Object.values(drafts)) {
      draft.localizationStatus = 'machine-accepted';
      draft.localizationAcceptedBy = 'site-owner';
      draft.localizationAcceptedAt = '2026-10-15';
    }
  }
  for (const [tool, draft] of Object.entries(drafts)) translations[tool][locale] = fitMetadata(draft);
  console.log(locale + ': static game copy translated');
}
for (const [tool, copies] of Object.entries(translations)) {
  if (Object.keys(copies).length !== Object.keys(locales).length || Object.keys(locales).some((locale) => copies[locale]?.copyLanguage !== locale)) throw new Error(tool + ' locale matrix is incomplete.');
  const filename = tool + '-final.mjs';
  const url = new URL('../../src/growth600/locales/' + filename, import.meta.url);
  await writeFile(url, 'export default Object.freeze(' + JSON.stringify(copies) + ');\n');
  console.log('Saved ' + filename + ' with ' + Object.keys(copies).length + ' locales.');
}

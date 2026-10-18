import { readFile, writeFile } from 'node:fs/promises';
import { schnapsenEnglish } from '../../src/markets-no-ch/schnapsen-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const checkpointPath = '/private/tmp/usefulverse-schnapsen-translations.json';
const generic = new Set(Object.keys(translationsByLocale.es));
const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const sources = [...new Set(flatten(schnapsenEnglish).filter((value) => !generic.has(value)))];
const targets = Object.keys(translationsByLocale).sort();
const packs = JSON.parse(await readFile(checkpointPath, 'utf8'));
if (JSON.stringify(Object.keys(packs).sort()) !== JSON.stringify(targets)) throw new Error('Checkpoint must contain exactly the 36 non-English locales.');
const terminology = {
  zh: {
    'Claim 66': '宣布达到66分', 'Talon cards': '牌堆剩余张数', 'Trump suit': '主花色', 'Trump card': '主牌',
    'Open talon': '牌堆开放', 'Talon closed': '牌堆已关闭', 'Close talon': '关闭牌堆', 'Marriage suit': '婚配花色',
    'You have at least 66 counted points. Claim after this trick or marriage.': '你已累计至少66分。赢得本墩或宣布婚配后，可以宣布达到66分。',
  },
  zh_tw: {
    'Claim 66': '宣告達到66分', 'Talon cards': '牌堆剩餘張數', 'Trump suit': '主花色', 'Trump card': '主牌',
    'Open talon': '牌堆開放', 'Talon closed': '牌堆已關閉', 'Close talon': '關閉牌堆', 'Marriage suit': '婚配花色',
    'Declare and lead': '宣告婚配並出牌',
    'You have at least 66 counted points. Claim after this trick or marriage.': '你已累計至少66分。贏得本墩或宣告婚配後，可以宣告達到66分。',
  },
};
const dictionaries = {};
for (const locale of targets) {
  const pack = packs[locale]; const ids = sources.map((_, index) => `Q${String(index).padStart(4, '0')}`);
  if (!pack || ids.some((id) => typeof pack[id] !== 'string' || !pack[id].trim()) || Object.keys(pack).some((id) => !ids.includes(id))) throw new Error(`${locale}: missing or extra translation rows.`);
  const dictionary = Object.fromEntries(sources.map((source, index) => [source, terminology[locale]?.[source] ?? pack[ids[index]].trim()]));
  if (Object.values(dictionary).some((value) => /UVTAG\d{4}QVU:|S\d{4}\||UVS\d{4}QVU:|AXWebArea|127\.0\.0\.1|Focused UI element|Resultados de traducción disponibles/iu.test(value))) throw new Error(`${locale}: marker or browser residue in translation.`);
  dictionaries[locale] = dictionary;
}
const target = new URL('../../src/markets-no-ch/schnapsen-translations.mjs', import.meta.url);
await writeFile(target, `// Static machine translations from the Google Translate website. No page-load translation requests.\nexport const schnapsenTranslationsByLocale = Object.freeze(${JSON.stringify(dictionaries)});\n`);
console.log(`Wrote ${targets.length} locale packs × ${sources.length} strings.`);

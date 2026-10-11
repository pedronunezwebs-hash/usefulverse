// One-time free Google Translate drafts; the published site uses only static copy.
import { rename, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { pensionCalculatorEnglishCopy as source } from '../../src/growth600/locales/pension-calculator.en.mjs';

const output = new URL('../../src/growth600/locales/pension-calculator-final.mjs', import.meta.url);
const codes = { zh_tw: 'zh-TW', pt_br: 'pt-BR', zh: 'zh-CN', tl: 'fil' };
const target = (key) => codes[key] ?? key.replace('_', '-');
const excluded = new Set(['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt']);
const paths = [];
function collect(node, path = []) {
  if (typeof node === 'string') { if (!excluded.has(path.at(-1))) paths.push(path); }
  else if (Array.isArray(node)) node.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (node && typeof node === 'object') for (const [key, value] of Object.entries(node)) collect(value, [...path, key]);
}
function get(node, path) { return path.reduce((item, key) => Array.isArray(item) ? item[Number(key)] : item[key], node); }
function set(node, path, value) {
  const parent = path.slice(0, -1).reduce((item, key) => Array.isArray(item) ? item[Number(key)] : item[key], node);
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value;
}
function shorten(text, limit) {
  const chars = Array.from(text);
  if (chars.length <= limit) return text;
  return `${chars.slice(0, limit - 1).join('').replace(/\s+\S*$/u, '').trimEnd()}…`;
}
function finish(copy, locale) {
  let title = copy.title.replace(/uvbrandtokenx/giu, 'UsefulVerse').replace(/(?:\s*[|｜]\s*UsefulVerse)+\s*$/iu, '').replace(/\s*(?:[|｜]\s*)?(?:…|\.{3,})\s*$/u, '').trim();
  if (locale === 'es') copy.privacyQuestion = '¿Se suben mis datos de pensión?';
  if (locale === 'ar') copy.privacyQuestion = 'هل تُرفع بيانات معاشي؟';
  if (Array.from(title).length + 14 > 60) title = copy.name;
  copy.title = `${title} | UsefulVerse`;
  copy.description = shorten(copy.description.replace(/\s+/gu, ' ').trim(), 160);
}
async function translate(locale, phrases) {
  const url = new URL('https://clients5.google.com/translate_a/t');
  url.searchParams.set('client', 'dict-chrome-ex'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', target(locale)); url.searchParams.set('dt', 't');
  for (const phrase of phrases) url.searchParams.append('q', phrase.replaceAll('UsefulVerse', 'UVBRANDTOKENX'));
  const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
  if (!response.ok) throw new Error(`Translation failed for ${locale}: HTTP ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data) || data.length !== phrases.length) throw new Error(`Incomplete translation batch for ${locale}`);
  return data.map((value, index) => typeof value === 'string' && value.trim() ? value.replace(/uvbrandtokenx/giu, 'UsefulVerse').replace(/\s+/gu, ' ').trim() : phrases[index]);
}
async function save(copies) {
  const temp = new URL(`${output.href}.tmp`);
  await writeFile(temp, `// Static machine-translation drafts; no runtime translation service.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
  await rename(temp, output);
}
collect(source);
const copies = { en: source };
try {
  const existing = (await import(`${output.href}?v=${Date.now()}`)).default;
  Object.assign(copies, existing);
} catch {}
await save(copies);
for (const { key } of localeEntries) {
  if (key === 'en' || copies[key]) continue;
  const copy = structuredClone(source);
  const phrases = paths.map((path) => get(source, path));
  const translated = [];
  for (let index = 0; index < phrases.length; index += 10) translated.push(...await translate(key, phrases.slice(index, index + 10)));
  paths.forEach((path, index) => set(copy, path, translated[index]));
  copy.name = shorten(copy.name, 44);
  copy.title = shorten(copy.title, 60);
  copy.description = shorten(copy.description, 160);
  finish(copy, key);
  copy.copyLanguage = key; copy.localizationStatus = 'machine-accepted'; copy.localizationAcceptedBy = 'site-owner'; copy.localizationAcceptedAt = '2026-10-11';
  copies[key] = copy;
  await save(copies);
  console.log(`Translated ${key}`);
}
if (copies.tl?.intro === source.intro) {
  copies.tl.name = 'Kuwenta ng Pensiyon';
  copies.tl.intro = 'Tantiyahin ang pensiyong may tiyak na benepisyo batay sa huling suweldong saklaw ng pensiyon, mga taon ng serbisyo, at rate ng accrual. Maaari ring tantiyahin ang pagpapalit ng bahagi ng taunang pensiyon sa lump sum.';
  copies.tl.howQuestion = 'Paano tinatantiya ang pensiyong may tiyak na benepisyo?';
  copies.tl.howAnswer = 'Imultiply ang huling suweldong saklaw ng pensiyon sa mga taon ng serbisyo at taunang accrual rate. Halimbawa, ang 50,000 × 30 × 2% ay katumbas ng tinatayang 30,000 bawat taon bago ang mga tuntunin ng pension plan.';
  copies.tl.privacyQuestion = 'Ina-upload ba ang mga halaga ng pensiyon ko?';
  copies.tl.privacyAnswer = 'Hindi. Dito mismo sa browser ginagawa ang pagkalkula. Hindi ina-upload o sine-save ng tool ang iyong suweldo at mga palagay sa pensiyon.';
  copies.tl.howTo = ['Ilagay ang huling suweldong saklaw ng pensiyon, mga taon ng serbisyo at accrual rate na nakasaad sa iyong plano.', 'Kung gusto mong tantiyahin ang lump sum, ilagay ang porsiyento ng taunang pensiyon na ipagpapalit at ang conversion factor ng plano.', 'Kalkulahin at ihambing ang taunang at buwanang pensiyon bago at pagkatapos ng conversion, pati ang tinatayang lump sum.'];
}
if (Object.keys(copies).length !== localeEntries.length) throw new Error('Missing locale draft.');
await save(copies);
console.log(`Saved static drafts for ${Object.keys(copies).length} locales.`);

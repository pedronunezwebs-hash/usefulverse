// One-time static Google Translate drafts; no translation service runs on the site.
import { writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { locales } from '../../src/locales.mjs';
import { spearmanCorrelationEnglishCopy as source } from '../../src/growth600/locales/spearman-correlation-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/spearman-correlation-calculator.mjs', import.meta.url);
const separator = '###60722416###';
const run = promisify(execFile);
const targetCodes = { zh_tw: 'zh-TW', pt_br: 'pt', zh: 'zh-CN' };
const localeCode = (key) => targetCodes[key] ?? key.replace('_', '-');
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (!['copyLanguage', 'examplePairs'].includes(path.at(-1))) paths.push(path); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function setAtPath(object, path, value) {
  let parent = object;
  for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value;
}
function normalize(copy) {
  const brand = ' | UsefulVerse';
  const titleBase = [...String(copy.title).split('|', 1)[0].trim()];
  const maxTitle = 60 - [...brand].length;
  let prefix = titleBase.slice(0, maxTitle).join('').trimEnd();
  if (titleBase.length > maxTitle) prefix = prefix.slice(0, Math.max(0, prefix.lastIndexOf(' '))).trimEnd();
  copy.title = `${prefix}${brand}`;
  if ([...copy.description].length > 160) copy.description = `${[...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '')}...`;
  return copy;
}
async function translateBatch(locale, phrases) {
  const url = new URL('https://translate.google.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', localeCode(locale)); url.searchParams.set('dt', 't');
  url.searchParams.set('q', phrases.join(`\n${separator}\n`));
  const { stdout } = await run('curl', ['-fsS', url.href], { maxBuffer: 2 * 1024 * 1024 });
  const body = JSON.parse(stdout);
  const translatedText = Array.isArray(body?.[0]) ? body[0].map((part) => part?.[0] ?? '').join('') : '';
  const values = translatedText.split(`\n${separator}\n`);
  if (values.length !== phrases.length) return null;
  return values.map((value, index) => value.trim() || phrases[index]);
}
async function translate(locale, phrases, offset) {
  const batch = await translateBatch(locale, phrases);
  if (batch) return batch;
  console.warn(`Retrying ${locale} phrases ${offset}–${offset + phrases.length - 1} individually; batch separator was not preserved.`);
  const values = [];
  for (const phrase of phrases) {
    const response = await translateBatch(locale, [phrase]);
    if (!response?.[0]) throw new Error(`Translation response was empty for ${locale} near item ${offset + values.length}.`);
    values.push(response[0]);
  }
  return values;
}

collect(source);
const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));
let copies = {};
try { copies = { ...(await import(`${target.href}?resume=${Date.now()}`)).default }; } catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }
async function saveCopies() {
  await writeFile(target, `// Static machine-translated drafts; no translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
}
for (const locale of Object.keys(locales)) {
  if (copies[locale]) {
    if (!copies[locale].fields.chartLabel) {
      const [chartLabel] = locale === 'en' ? [source.fields.chartLabel] : await translate(locale, [source.fields.chartLabel], 0);
      copies[locale] = { ...copies[locale], fields: { ...copies[locale].fields, chartLabel } };
      await saveCopies();
      console.log(`${locale}: chart label added`);
    }
    continue;
  }
  const copy = structuredClone(source);
  if (locale !== 'en') {
    const translated = [];
    for (let start = 0; start < phrases.length; start += 4) translated.push(...await translate(locale, phrases.slice(start, start + 4), start));
    paths.forEach((path, index) => setAtPath(copy, path, translated[index]));
    copy.localizationStatus = 'machine-accepted';
    copy.localizationAcceptedBy = 'site-owner';
    copy.localizationAcceptedAt = '2026-10-09';
  }
  copy.copyLanguage = locale;
  copies[locale] = normalize(copy);
  await saveCopies();
  console.log(`${locale}: ${phrases.length} strings`);
}
const arabic = copies.ar;
copies.ar = {
  ...arabic,
  fields: {
    ...arabic.fields,
    pairs: 'القيم المقترنة (س، ص)',
    pairsHint: 'أدخل زوجًا واحدًا في كل سطر، مثل 1, 10. استخدم فاصلة أو فاصلة منقوطة أو مسافة للفصل بين الرقمين، ونقطة للأعداد العشرية. أدخل من 2 إلى 500 زوج.',
    accuracyNote: 'القيم المتساوية تحصل على متوسط رتبها. يصف rho الارتباط الرتيب بين الرتب، ولا يثبت السببية. لا تحسب هذه الأداة قيمة p أو فاصل الثقة.',
    resultRho: 'معامل سبيرمان rho', resultCount: 'عدد الأزواج', rankX: 'رتبة س', rankY: 'رتبة ص',
    resultTable: 'القيم المدخلة ورتبها', tiesNote: 'تم استخدام متوسط الرتب للقيم المتساوية.',
    chartLabel: 'مخطط مبعثر لمتوسط رتب القيم س وص',
  },
  actions: { ...arabic.actions, reset: 'مسح' },
};
await saveCopies();
console.log(`Wrote ${Object.keys(copies).length} static locale copies.`);

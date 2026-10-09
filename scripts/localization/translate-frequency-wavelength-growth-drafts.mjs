// One-time static translation through Google's free web endpoint; published pages never call it.
import { writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { locales } from '../../src/locales.mjs';
import { frequencyWavelengthCalculatorEnglishCopy as source } from '../../src/growth600/locales/frequency-wavelength-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/frequency-wavelength-calculator.mjs', import.meta.url);
const separator = '@@@WAVESEP@@@';
const run = promisify(execFile);
const localeCodes = { zh_tw: 'zh-TW', pt_br: 'pt', zh: 'zh-CN' };
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
function normalize(copy) {
  const suffix = ' | UsefulVerse'; const maxTitle = 60 - [...suffix].length;
  let prefix = [...String(copy.title).split('|', 1)[0].trim()].slice(0, maxTitle).join('').trimEnd();
  if ([...String(copy.title).split('|', 1)[0].trim()].length > maxTitle) prefix = prefix.slice(0, Math.max(0, prefix.lastIndexOf(' '))).trimEnd();
  copy.title = `${prefix}${suffix}`;
  if ([...copy.description].length > 160) copy.description = `${[...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '')}...`;
  return copy;
}
async function translateBatch(locale, phrases) {
  const url = new URL('https://translate.google.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', localeCodes[locale] ?? locale.replace('_', '-')); url.searchParams.set('dt', 't');
  url.searchParams.set('q', phrases.join(`\n${separator}\n`));
  const { stdout } = await run('curl', ['-fsS', '--connect-timeout', '5', '--max-time', '30', '--retry', '3', '--retry-delay', '2', '--retry-all-errors', url.href], { maxBuffer: 2 * 1024 * 1024, timeout: 120_000 });
  const body = JSON.parse(stdout);
  const translated = Array.isArray(body?.[0]) ? body[0].map((part) => part?.[0] ?? '').join('') : '';
  const values = translated.split(`\n${separator}\n`);
  if (values.length !== phrases.length) {
    if (phrases.length === 1) return [translated.replaceAll(separator, '').trim() || phrases[0]];
    const middle = Math.ceil(phrases.length / 2);
    return [...await translateBatch(locale, phrases.slice(0, middle)), ...await translateBatch(locale, phrases.slice(middle))];
  }
  return values.map((value, index) => value.trim() || phrases[index]);
}
function preserveTerms(value) {
  if (typeof value === 'string') return value.replace(/UsefulVerse|MHz|GHz|THz|kHz|Hz|km\/s|m\/s|μm|µm|nm|mm|cm/giu, (term) => ({ usefulverse: 'UsefulVerse', mhz: 'MHz', ghz: 'GHz', thz: 'THz', khz: 'kHz', hz: 'Hz', 'km/s': 'km/s', 'm/s': 'm/s', 'μm': 'µm', 'µm': 'µm', nm: 'nm', mm: 'mm', cm: 'cm' })[term.toLowerCase()]);
  if (Array.isArray(value)) return value.map(preserveTerms);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, preserveTerms(child)]));
  return value;
}
function improve(copy, locale) {
  if (locale === 'ar') Object.assign(copy, {
    name: 'حاسبة التردد والطول الموجي', title: 'حاسبة الطول الموجي مجانية | UsefulVerse',
    description: 'احسب التردد أو الطول الموجي أو سرعة الموجة مع تحويل الوحدات. مجانية داخل المتصفح دون حساب.',
    howQuestion: 'كيف أحسب الطول الموجي من التردد؟',
    howAnswer: 'استخدم العلاقة v = f × λ، حيث v سرعة الموجة وf التردد وλ الطول الموجي. لحساب الطول الموجي، اقسم السرعة على التردد. أدخل قيمتين واترك الثالثة فارغة.',
    fields: { ...copy.fields, accuracyNote: 'أدخل قيمتين موجبتين واترك القيمة الثالثة فارغة. سرعات الضوء الجاهزة تقريبية وتتغير حسب نوع الموجة والمادة والطول الموجي والظروف. للصوت أو وسط آخر، اختر مخصصاً وأدخل سرعة مناسبة. هذه حاسبة للعلاقة الأساسية وليست تحليلاً للإشارة أو الهوائي أو السلامة.' },
  });
  return copy;
}
collect(source);
let copies = {};
try { copies = { ...(await import(`${target.href}?resume=${Date.now()}`)).default }; } catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }
async function save() { await writeFile(target, `// Static machine-translated drafts; no translation service is called on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`); }
for (const locale of Object.keys(locales)) {
  if (locale !== 'en' && copies[locale]?.intro && copies[locale].intro !== source.intro) {
    copies[locale] = preserveTerms(normalize(improve(structuredClone(copies[locale]), locale)));
    await save(); console.log(`${locale}: existing draft checked and retained`); continue;
  }
  const copy = structuredClone(source);
  if (locale !== 'en') {
    let batch = []; let chars = 0;
    for (const path of paths) {
      const phrase = path.reduce((parent, key) => parent[Array.isArray(parent) ? Number(key) : key], source);
      const cost = [...phrase].length + [...separator].length + 2;
      if (batch.length && chars + cost > 3_000) {
        const translated = await translateBatch(locale, batch.map((item) => item.phrase));
        batch.forEach((item, index) => setAtPath(copy, item.path, translated[index])); batch = []; chars = 0;
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      batch.push({ path, phrase }); chars += cost;
    }
    if (batch.length) {
      const translated = await translateBatch(locale, batch.map((item) => item.phrase));
      batch.forEach((item, index) => setAtPath(copy, item.path, translated[index]));
    }
  }
  copy.copyLanguage = locale;
  if (locale !== 'en') Object.assign(copy, { localizationStatus: 'machine-accepted', localizationAcceptedBy: 'site-owner', localizationAcceptedAt: '2026-10-09' });
  copies[locale] = preserveTerms(normalize(improve(copy, locale)));
  await save(); console.log(`${locale}: ${locale === 'en' ? 'source saved' : 'static translation draft generated'}`);
}

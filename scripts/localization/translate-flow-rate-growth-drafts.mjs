// One-time static Google Translate drafts. Published pages never call Google Translate.
import { writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { locales } from '../../src/locales.mjs';
import { flowRateCalculatorEnglishCopy as source } from '../../src/growth600/locales/flow-rate-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/flow-rate-calculator.mjs', import.meta.url);
const languageCodes = { zh_tw: 'zh-TW', zh: 'zh-CN' };
const run = promisify(execFile);
function collect(value, path = [], rows = []) {
  if (typeof value === 'string') { if (path.at(-1) !== 'copyLanguage') rows.push({ path, source: value }); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)], rows));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key], rows);
  return rows;
}
function setAtPath(object, path, value) {
  let parent = object;
  for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value;
  else parent[path.at(-1)] = value;
}
function normalize(copy, locale) {
  copy.copyLanguage = locale;
  copy.localizationStatus = locale === 'en' ? 'approved' : 'machine-accepted';
  copy.localizationAcceptedBy = 'site-owner';
  copy.localizationAcceptedAt = '2026-10-09';
  // Keep the dimensional relation readable and mathematically invariant in every locale.
  copy.messages.formulaValue = 'Q = A × v; t = V ÷ Q';
  const suffix = ' | UsefulVerse';
  const titleSource = String(copy.name || String(copy.title).split('|', 1)[0].trim());
  let prefix = [...titleSource].slice(0, 60 - [...suffix].length).join('').trimEnd();
  if ([...titleSource].length > 60 - [...suffix].length) prefix = prefix.slice(0, Math.max(0, prefix.lastIndexOf(' '))).trimEnd();
  prefix = prefix.replace(/\s+\p{L}$/u, '').trimEnd();
  copy.title = `${prefix}${suffix}`;
  if ([...copy.description].length > 160) copy.description = `${[...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '')}...`;
  if (locale === 'es') {
    copy.title = 'Calculadora de caudal gratis | UsefulVerse';
    copy.description = 'Calcula caudal, área, velocidad o tiempo de llenado con unidades comunes. Gratis, sin límites ni registro; los cálculos se hacen en tu navegador.';
  }
  if (locale === 'en') copy.title = 'Flow Rate Calculator Free & Unlimited | UsefulVerse';
  if (locale === 'ar') {
    copy.title = 'حاسبة معدل التدفق مجانًا | UsefulVerse';
    copy.description = 'احسب معدل التدفق أو المساحة أو السرعة أو وقت ملء الخزان بوحدات شائعة. مجانية في المتصفح دون رفع البيانات.';
    copy.fields.solveFlow = 'معدل التدفق من مساحة المقطع وسرعة التدفق';
    copy.fields.area = 'مساحة المقطع العرضي';
    copy.actions.example = 'جرّب مساحة 2 م² وسرعة 3 م/ث';
  }
  if (locale === 'hi') {
    copy.name = 'प्रवाह दर कैलकुलेटर';
    copy.fields.accuracyNote = 'Q = A × v के आधार पर स्थिर, असंपीड्य प्रवाह का अनुमान। धनात्मक मान और एक-दूसरे से मेल खाने वाली इकाइयाँ दर्ज करें। यह दबाव-हानि, पाइप की खुरदरापन, फिटिंग, अशांति, द्रव में बदलाव, पंप का प्रदर्शन, रिसाव या टैंक के बदलते स्तरों का मॉडल नहीं है। वास्तविक प्रणालियों के लिए मापे गए या निर्माता द्वारा दिए गए मानों का उपयोग करें; यह प्लंबिंग या इंजीनियरिंग डिज़ाइन की सलाह नहीं है। गणनाएँ इसी ब्राउज़र में होती हैं।';
    copy.title = `${copy.name} | UsefulVerse`;
  }
  return copy;
}
async function translate(locale, rows) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', languageCodes[locale] ?? locale.replace('_', '-')); url.searchParams.set('dt', 't');
  const markers = rows.map((_, index) => `654321${String(index).padStart(5, '0')}123456`);
  url.searchParams.set('q', rows.map((row, index) => `${markers[index]} ${row.source}`).join('\n'));
  const { stdout } = await run('curl', ['-fsS', '--connect-timeout', '5', '--max-time', '30', '--retry', '3', '--retry-delay', '2', '--retry-all-errors', url.href], { maxBuffer: 2 * 1024 * 1024, timeout: 120_000 });
  const response = JSON.parse(stdout);
  const text = Array.isArray(response?.[0]) ? response[0].map((part) => part?.[0] ?? '').join('\n') : '';
  return markers.map((marker, index) => {
    const start = text.indexOf(marker);
    if (start < 0) return rows[index].source;
    const contentStart = start + marker.length;
    const following = markers.slice(index + 1).map((next) => text.indexOf(next, contentStart)).filter((position) => position >= 0);
    const end = following.length ? Math.min(...following) : text.length;
    return text.slice(contentStart, end).trim() || rows[index].source;
  });
}
async function checkpoint(copies) {
  await writeFile(target, `// Static machine-translated drafts. No translation request runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
}

const rows = collect(source);
const redoLocales = new Set(process.argv.filter((arg) => arg.startsWith('--redo=')).flatMap((arg) => arg.slice('--redo='.length).split(',')));
let copies = {};
try { copies = { ...(await import(`${target.href}?resume=${Date.now()}`)).default }; } catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }
copies.en = normalize(structuredClone(source), 'en');
for (const [locale, copy] of Object.entries(copies)) if (locale !== 'en') copies[locale] = normalize(copy, locale);
await checkpoint(copies);
for (const locale of Object.keys(locales)) {
  if (locale === 'en' || (copies[locale]?.intro && !redoLocales.has(locale))) continue;
  const copy = structuredClone(source);
  const batches = []; let batch = []; let size = 0;
  for (const row of rows) {
    const rowSize = [...row.source].length + 24;
    if (batch.length && size + rowSize > 2600) { batches.push(batch); batch = []; size = 0; }
    batch.push(row); size += rowSize;
  }
  if (batch.length) batches.push(batch);
  for (const group of batches) {
    const translated = await translate(locale, group);
    group.forEach((row, index) => setAtPath(copy, row.path, translated[index] || row.source));
  }
  copies[locale] = normalize(copy, locale);
  await checkpoint(copies);
  console.log(`${locale}: translated ${rows.length} strings in ${batches.length} batches`);
}
console.log(`Saved static drafts for ${Object.keys(copies).length} locales.`);

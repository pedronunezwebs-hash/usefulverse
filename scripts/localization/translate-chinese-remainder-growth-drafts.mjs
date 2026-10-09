// One-time static Google Translate drafts; no translation service runs on the site.
import { writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { locales } from '../../src/locales.mjs';
import { chineseRemainderEnglishCopy as source } from '../../src/growth600/locales/chinese-remainder-theorem-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/chinese-remainder-theorem-calculator.mjs', import.meta.url);
const separator = '###61845029###';
const run = promisify(execFile);
const targetCodes = { zh_tw: 'zh-TW', pt_br: 'pt', zh: 'zh-CN' };
const localeCode = (key) => targetCodes[key] ?? key.replace('_', '-');
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (!['copyLanguage', 'exampleCongruences'].includes(path.at(-1))) paths.push(path); }
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
  const maxTitle = 60 - [...brand].length;
  let prefix = [...String(copy.title).split('|', 1)[0].trim()].slice(0, maxTitle).join('').trimEnd();
  if ([...String(copy.title).split('|', 1)[0].trim()].length > maxTitle) prefix = prefix.slice(0, Math.max(0, prefix.lastIndexOf(' '))).trimEnd();
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
  const text = Array.isArray(body?.[0]) ? body[0].map((part) => part?.[0] ?? '').join('') : '';
  const values = text.split(`\n${separator}\n`);
  return values.length === phrases.length ? values.map((value, index) => value.trim() || phrases[index]) : null;
}
async function translate(locale, phrases) {
  const batch = await translateBatch(locale, phrases);
  if (batch) return batch;
  const values = [];
  for (const phrase of phrases) {
    const response = await translateBatch(locale, [phrase]);
    if (!response?.[0]) throw new Error(`Translation response empty for ${locale}.`);
    values.push(response[0]);
  }
  return values;
}
collect(source);
const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));
const chunks = [];
let chunk = [];
let length = 0;
for (const phrase of phrases) {
  if (chunk.length && length + phrase.length > 3000) { chunks.push(chunk); chunk = []; length = 0; }
  chunk.push(phrase); length += phrase.length;
}
if (chunk.length) chunks.push(chunk);
let copies = {};
try { copies = { ...(await import(`${target.href}?resume=${Date.now()}`)).default }; } catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }
async function saveCopies() { await writeFile(target, `// Static machine-translated drafts; no translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`); }
for (const locale of Object.keys(locales)) {
  if (copies[locale]) continue;
  const copy = structuredClone(source);
  if (locale !== 'en') {
    const translated = [];
    for (const batch of chunks) translated.push(...await translate(locale, batch));
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
if (copies.ar) {
  copies.ar = {
    ...copies.ar,
    intro: 'حل نظامًا من التطابقات المعيارية واعرض أصغر حل غير سالب مع المعامل الموحّد. تعمل الأداة أيضًا مع المقسومات المشتركة المتوافقة، وتوضح الأنظمة التي لا تملك حلًا.',
    howAnswer: 'أدخل باقيًا ومعاملًا في كل سطر، مثل 2، 3 أي س ≡ 2 (mod 3). أضف من سطرين إلى 20 سطرًا ثم احسب. تعرض النتيجة أصغر قيمة غير سالبة لـ س والمعامل الموحّد.',
    fields: {
      ...copies.ar.fields,
      congruences: 'أزواج الباقي والمقسوم عليه',
      congruencesHint: 'أدخل توافقًا واحدًا في كل سطر بصيغة الباقي، المقسوم عليه. مثال: ٢، ٣ يعني س ≡ ٢ (mod ٣). أدخل من سطرين إلى ٢٠ سطرًا.',
      accuracyNote: 'يجب أن تكون المقسومات أعدادًا صحيحة لا تقل عن ٢. تُقبل المقسومات المشتركة إذا كانت التوافقات متوافقة؛ وتُشرح الأنظمة المتعارضة.',
      resultStatus: 'حالة النظام', resultResidue: 'أصغر حل غير سالب', resultModulus: 'المقسوم عليه الموحّد', combinedEquation: 'التوافق الموحّد', equationCount: 'عدد التوافقات', conflictAt: 'أول تعارض في السطر', conflictGcd: 'القاسم المشترك الأكبر للمقسومات', difference: 'الفرق بين البواقي', stepLabel: 'خطوة الدمج',
    },
    actions: { ...copies.ar.actions, calculate: 'حل النظام', reset: 'مسح', example: 'تحميل مثال', result: 'نتيجة CRT', copy: 'نسخ النتيجة' },
    messages: { ...copies.ar.messages, calculated: 'تم حل نظام التوافقات.', incompatible: 'هذه التوافقات متعارضة، لذلك لا يوجد حل صحيح.', checkInputs: 'تحقق من كل سطر وأدخل من ٢ إلى ٢٠ زوجًا صحيحًا من الباقي والمقسوم عليه، بقاسم لا يقل عن ٢.' },
    additionalFaqs: [
      { question: 'ما الذي تحسبه نظرية الباقي الصينية؟', answer: 'تجمع عدة توافقات في فئة واحدة من الحلول المتكررة. مثلًا، س ≡ 2 (mod 3) و س ≡ 3 (mod 5) تعطيان س ≡ 8 (mod 15).' },
      { question: 'هل يمكن أن يكون للمقاسيم عامل مشترك؟', answer: 'نعم، إذا اتفقت البواقي وفق القاسم المشترك الأكبر. إذا تعارضت الشروط فلا يوجد حل.' },
      { question: 'هل الحساب دقيق؟', answer: 'نعم، تستخدم الأداة حساب الأعداد الصحيحة محليًا في المتصفح وضمن الحدود المعروضة.' },
    ],
  };
  await saveCopies();
}

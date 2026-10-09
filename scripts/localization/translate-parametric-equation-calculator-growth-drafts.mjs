// One-time static Google Translate drafts. No translation request runs on the site.
import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { parametricEquationEnglishCopy as source } from '../../src/growth600/locales/parametric-equation-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/parametric-equation-calculator.mjs', import.meta.url);
const targetCodes = { zh_tw: 'zh-TW', pt_br: 'pt', zh: 'zh-CN' };
const localeCode = (key) => targetCodes[key] ?? key.replace('_', '-');
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (path.at(-1) !== 'copyLanguage') paths.push(path); }
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
  if ([...copy.description].length > 160) copy.description = `${[...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '')}…`;
  return copy;
}
async function translate(locale, phrases, offset) {
  const url = new URL('https://clients5.google.com/translate_a/t');
  url.searchParams.set('client', 'dict-chrome-ex'); url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', localeCode(locale)); url.searchParams.set('dt', 't');
  for (const phrase of phrases) url.searchParams.append('q', phrase);
  const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
  if (!response.ok) throw new Error(`Google Translate failed for ${locale}: HTTP ${response.status}`);
  const values = await response.json();
  if (!Array.isArray(values) || values.length !== phrases.length) throw new Error(`Unexpected translation response for ${locale} near string ${offset}.`);
  return values.map((value, index) => typeof value === 'string' && value.trim() ? value.trim() : phrases[index]);
}

collect(source);
const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));
const copies = {};
for (const locale of Object.keys(locales)) {
  const copy = structuredClone(source);
  if (locale !== 'en') {
    const translated = [];
    for (let start = 0; start < phrases.length; start += 8) translated.push(...await translate(locale, phrases.slice(start, start + 8), start));
    paths.forEach((path, index) => setAtPath(copy, path, translated[index]));
    copy.localizationStatus = 'machine-accepted';
    copy.localizationAcceptedBy = 'site-owner';
    copy.localizationAcceptedAt = '2026-10-09';
  }
  // Keep the math-language tokens and expression examples exact across translations.
  for (const key of ['intro', 'howAnswer', 'fields.expressionHint']) {
    const path = key.split('.');
    let value = path.reduce((parent, part) => parent?.[part], copy);
    if (typeof value === 'string') {
      value = value.replace(/x\s*\(\s*t\s*\)/giu, 'x(t)').replace(/y\s*\(\s*t\s*\)/giu, 'y(t)')
        .replace(/cos\s*\(\s*t\s*\)/giu, 'cos(t)').replace(/sin\s*\(\s*t\s*\)/giu, 'sin(t)')
        .replace(/2\s*π/gu, '2π').replace(/0\s*(?:to|–|-)\s*2π/giu, '0 to 2π');
      let targetObject = copy;
      for (const part of path.slice(0, -1)) targetObject = targetObject[part];
      targetObject[path.at(-1)] = value;
    }
  }
  if (locale === 'ar') Object.assign(copy, {
    name: 'حاسبة المعادلات البارامترية',
    title: 'حاسبة المعادلات البارامترية مجانًا | UsefulVerse',
    description: 'ارسم x(t) وy(t)، واضبط مجال المعامل، ونزّل الإحداثيات. مجانًا وفي متصفحك.',
    intro: 'ارسم منحنى بمعادلتين منفصلتين x(t) وy(t). اختر مجال المعامل وعدد العينات، ثم نزّل الإحداثيات بصيغة CSV.',
    howQuestion: 'كيف أرسم معادلة بارامترية؟',
    howAnswer: 'أدخل تعبيرًا لـ x(t) وآخر لـ y(t)، ثم اختر بداية ونهاية المعامل وعدد العينات. الزوايا بالراديان. الدالتان x(t)=cos(t) وy(t)=sin(t) ترسمان دائرة الوحدة من 0 إلى 2π.',
    privacyQuestion: 'هل يتم رفع المعادلات؟',
    privacyAnswer: 'لا. تُحسب التعبيرات داخل متصفحك باستخدام محلل رياضي محدود، ولا يتم رفعها أو حفظها بواسطة هذه الأداة.',
    fields: {
      ...copy.fields,
      xExpression: 'معادلة x(t)', yExpression: 'معادلة y(t)', tMin: 'بداية المعامل t', tMax: 'نهاية المعامل t', samples: 'عدد العينات',
      expressionHint: 'استخدم t وpi وe والعمليات + و− و* و/ و^ والأقواس والدوال sin وcos وtan وsqrt وabs وexp وln وlog. استخدم * للضرب؛ الزوايا بالراديان. مثال: cos(t).',
      accuracyNote: 'هذا رسم عددي وليس إثباتًا رمزيًا. يصل الخط بين نقاط العينات؛ قد تتطلب الانقطاعات أو خطوط التقارب مجالًا أضيق أو عينات أكثر. تُحدّ الإحداثيات للعرض.',
      chartLabel: 'رسم المنحنى البارامتري', resultCount: 'النقاط المحدودة المرسومة',
    },
    actions: { ...copy.actions, calculate: 'ارسم المنحنى', example: 'مثال دائرة الوحدة', reset: 'مسح', result: 'الرسم البارامتري', downloadCsv: 'تنزيل الإحداثيات CSV' },
    messages: { ...copy.messages, calculated: 'تم رسم المنحنى.', checkInputs: 'تحقق من التعبيرين ونطاق المعامل المتزايد وعدد العينات (50–1500).', exampleLoaded: 'تم رسم مثال دائرة الوحدة.', downloaded: 'تم تنزيل ملف الإحداثيات CSV.', downloadUnavailable: 'تنزيل CSV غير متاح في هذا المتصفح.' },
    additionalFaqs: [
      { question: 'ما المعادلة البارامترية؟', answer: 'تعطي المعادلة البارامترية كل إحداثي بدلالة معامل مشترك، مثل x(t) وy(t). يؤدي تغيير t إلى رسم نقاط المنحنى.' },
      { question: 'هل يمكن رسم دائرة باستخدام x(t) وy(t)؟', answer: 'نعم. استخدم x(t)=cos(t) وy(t)=sin(t)، واجعل المجال من 0 إلى 2π لرسم دائرة الوحدة.' },
      { question: 'هل يمكن تنزيل نقاط الرسم؟', answer: 'نعم. بعد الرسم، نزّل ملف CSV يحوي قيمة t وإحداثيي x وy لكل عينة صالحة.' },
    ],
  });
  copy.copyLanguage = locale;
  copies[locale] = normalize(copy);
  console.log(`${locale}: ${phrases.length} strings`);
}
await writeFile(target, `// Static machine-translated drafts; no translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
console.log(`Wrote ${Object.keys(copies).length} static locale copies.`);

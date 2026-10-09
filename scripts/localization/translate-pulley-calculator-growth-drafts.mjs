import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { pulleyCalculatorEnglishCopy as source } from '../../src/growth600/locales/pulley-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/pulley-calculator-final.mjs', import.meta.url);
const localeCodes = { 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', 'pt-BR': 'pt-BR', 'zh-HK': 'zh-TW' };
const paths = [
  ['name'], ['title'], ['description'], ['intro'], ['howQuestion'], ['howAnswer'], ['privacyQuestion'], ['privacyAnswer'],
  ...Object.keys(source.fields).map((key) => ['fields', key]),
  ...Object.keys(source.actions).map((key) => ['actions', key]),
  ...Object.keys(source.messages).map((key) => ['messages', key]),
  ...source.additionalFaqs.flatMap((_, index) => [['additionalFaqs', String(index), 'question'], ['additionalFaqs', String(index), 'answer']]),
];

function setAtPath(object, path, value) {
  let parent = object;
  for (const key of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(key)] : parent[key];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value;
  else parent[path.at(-1)] = value;
}
function normalize(copy) {
  const suffix = ' | UsefulVerse';
  const titleLimit = 60 - [...suffix].length;
  let title = [...String(copy.title).split('|', 1)[0].trim()].slice(0, titleLimit).join('').trimEnd();
  if (title.length === titleLimit) title = title.slice(0, Math.max(0, title.lastIndexOf(' '))).trimEnd();
  copy.title = `${title}${suffix}`;
  if ([...copy.description].length > 160) copy.description = `${[...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '')}...`;
  return copy;
}
async function translateBatch(locale, phrases) {
  if (!phrases.length) return [];
  const url = new URL('https://clients5.google.com/translate_a/t');
  url.searchParams.set('client', 'dict-chrome-ex'); url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', localeCodes[locale] ?? locale.replace('_', '-')); url.searchParams.set('dt', 't');
  for (const phrase of phrases) url.searchParams.append('q', phrase);
  const response = await fetch(url, { signal: AbortSignal.timeout(25_000) });
  if (!response.ok) throw new Error(`Google Translate returned HTTP ${response.status} for ${locale}.`);
  let result = await response.json();
  if (Array.isArray(result) && result.length === phrases.length + 1 && result[0] === (localeCodes[locale] ?? locale.replace('_', '-'))) result = result.slice(1);
  if (Array.isArray(result) && result.length === phrases.length && result.every((value) => typeof value === 'string' && value.trim())) return result.map((value) => value.trim());
  if (phrases.length === 1) throw new Error(`Google Translate returned incomplete text for ${locale}.`);
  const midpoint = Math.ceil(phrases.length / 2);
  return [...await translateBatch(locale, phrases.slice(0, midpoint)), ...await translateBatch(locale, phrases.slice(midpoint))];
}
async function translate(locale, phrases) {
  const groups = [];
  for (let index = 0; index < phrases.length; index += 10) groups.push(phrases.slice(index, index + 10));
  return (await Promise.all(groups.map((group) => translateBatch(locale, group)))).flat();
}

let copies = { en: structuredClone(source) };
try { copies = { ...copies, ...(await import(`${target.href}?resume=${Date.now()}`)).default }; }
catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }

for (const { key } of localeEntries.filter(({ key }) => key !== 'en' && !copies[key])) {
  const phrases = paths.map((path) => path.reduce((value, item) => value[item], source));
  const translated = await translate(key, phrases);
  const copy = structuredClone(source);
  paths.forEach((path, index) => setAtPath(copy, path, translated[index]));
  copy.copyLanguage = key;
  copy.localizationStatus = 'machine-accepted';
  copy.localizationAcceptedBy = 'site-owner';
  copy.localizationAcceptedAt = '2026-10-09';
  copies[key] = normalize(copy);
  await writeFile(target, `const pulleyCalculatorCopies = ${JSON.stringify(copies, null, 2)};\n\nexport default pulleyCalculatorCopies;\n`);
  console.log(`Saved static pulley calculator copy: ${key}`);
}

if (copies.ar) {
  Object.assign(copies.ar, {
    name: 'حاسبة البكرات', title: 'حاسبة البكرات مجانًا وبلا حدود | UsefulVerse',
    description: 'احسب طول الحزام وسرعة البكرتين من الأقطار والمسافة بين المركزين. مجانية ومحلية وبلا حدود.',
    intro: 'قدّر طول الحزام وعلاقة السرعة لحزام مفتوح بسيط بين بكرتين. أدخل جميع الأبعاد بالوحدة نفسها.',
    howQuestion: 'كيف يُقدّر طول الحزام بين بكرتين؟',
    howAnswer: 'في نظام حزام مفتوح ببكرتين، تستخدم الحاسبة صيغة تقريبية تعتمد على المسافة بين مركزي البكرتين وقطريهما. كما تقدّر سرعة البكرة المُدارة من نسبة القطرين، بافتراض عدم الانزلاق.',
    privacyQuestion: 'هل تُرفع قياساتي؟',
    privacyAnswer: 'لا. تُجرى الحسابات ويُنشأ الرسم في هذا المتصفح، ولا تُرفع قياساتك أو تُحفظ.',
    additionalFaqs: [
      { question: 'ما صيغة تقدير طول الحزام؟', answer: 'من الصيغ التقريبية الشائعة لحزام مفتوح: L ≈ 2C + 1.57(D + d) + (D − d)²/(4C)، حيث C هي المسافة بين المركزين، وD وd قطرا خطوتي البكرتين الأكبر والأصغر. استخدم بيانات الشركة المصنّعة لاختيار الحزام الفعلي.' },
      { question: 'كيف يؤثر قطر البكرة في سرعة الدوران؟', answer: 'بافتراض عدم الانزلاق، تُقدّر سرعة دوران البكرة المُدارة بضرب سرعة بكرة القيادة في قطرها ثم القسمة على قطر البكرة المُدارة. تكبّر البكرة المُدارة تخفّض السرعة، بينما تكبّر بكرة القيادة ترفعها.' },
      { question: 'هل تحسب الأداة انزلاق الحزام أو شده؟', answer: 'لا. هذا تقدير هندسي ونسبة سرعة مثاليان لترتيب مفتوح بين بكرتين. لا يحسب الانزلاق أو الشد أو نوع الحزام أو الحمل أو التآكل أو المقاسات المتاحة.' },
      { question: 'هل يمكنني طلب حزام اعتمادًا على هذا التقدير؟', answer: 'استخدمه كتقدير أولي فقط. تحقّق من خطوة الحزام ونوعه وطوله الفعلي وإمكانية ضبط المسافة وجداول الشركة المصنّعة قبل الشراء أو التشغيل.' },
    ],
  });
  Object.assign(copies.ar.fields, {
    driverDiameter: 'قطر بكرة القيادة', drivenDiameter: 'قطر البكرة المُدارة', centerDistance: 'المسافة بين مركزي البكرتين', diameterUnit: 'وحدة القياس',
    millimeters: 'مليمترات (mm)', inches: 'بوصات (in)', inputRpm: 'سرعة بكرة القيادة (دورة/دقيقة)',
    accuracyNote: 'طول تقريبي لخطوة الحزام في نظام مثالي مفتوح بين بكرتين. استخدم الوحدة نفسها لكل الأبعاد. قد يختلف الطول والسرعة الفعليان حسب نوع الحزام وخطوته والشد والانزلاق والتآكل والتفاوتات. لا تختار الحاسبة حزامًا متاحًا للبيع ولا تقيّم القدرة أو وسائل الحماية أو السلامة. راجع بيانات الشركة المصنّعة قبل الشراء أو التشغيل. تعمل محليًا ولا تُرفع البيانات.',
    sketchTitle: 'ترتيب الحزام المفتوح (الرسم غير مقياسي)', sketchDescription: 'رسم لبكرتين متصلتين بحزام مفتوح، بكرة القيادة يسارًا والبكرة المُدارة يمينًا.',
  });
  Object.assign(copies.ar.actions, { calculate: 'احسب نظام الحزام', reset: 'إعادة ضبط', copy: 'نسخ النتائج', example: 'تحميل المثال', result: 'النتائج التقديرية' });
  Object.assign(copies.ar.messages, {
    copied: 'تم نسخ النتائج.', copyUnavailable: 'النسخ غير متاح في هذا المتصفح.', calculated: 'تم حساب تقدير نظام الحزام.',
    checkInputs: 'تحقق من القطرين والمسافة بين المركزين والوحدة وسرعة الدوران.', beltLength: 'طول خطوة الحزام التقريبي', outputRpm: 'سرعة البكرة المُدارة المثالية',
    speedRatio: 'نسبة السرعة (القيادة / المُدارة)', beltSpeed: 'السرعة الخطية للحزام عند بكرة القيادة', smallWrap: 'زاوية التفاف تقريبية حول البكرة الأصغر', model: 'النموذج', openBelt: 'تقريب لنظام مفتوح بين بكرتين',
  });
}
for (const copy of Object.values(copies)) normalize(copy);
await writeFile(target, `const pulleyCalculatorCopies = ${JSON.stringify(copies, null, 2)};\n\nexport default pulleyCalculatorCopies;\n`);
console.log(`Wrote ${Object.keys(copies).length} static pulley calculator locales.`);

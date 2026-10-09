// One-time static Google Translate drafts; no translation call runs on the site.
import { writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { locales } from '../../src/locales.mjs';
import { singularValueDecompositionEnglishCopy as source } from '../../src/growth600/locales/singular-value-decomposition-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/singular-value-decomposition-calculator.mjs', import.meta.url);
const separator = '###60722416###';
const run = promisify(execFile);
const targetCodes = { zh_tw: 'zh-TW', pt_br: 'pt', zh: 'zh-CN' };
const localeCode = (key) => targetCodes[key] ?? key.replace('_', '-');
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (!['copyLanguage', 'exampleMatrix'].includes(path.at(-1))) paths.push(path); }
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
    const result = await translateBatch(locale, [phrase]);
    if (!result?.[0]) throw new Error(`Translation response was empty for ${locale} near item ${offset + values.length}.`);
    values.push(result[0]);
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
  if (copies[locale]) continue;
  const copy = structuredClone(source);
  if (locale !== 'en') {
    const translated = [];
    for (let start = 0; start < phrases.length; start += 4) translated.push(...await translate(locale, phrases.slice(start, start + 4), start));
    paths.forEach((path, index) => setAtPath(copy, path, translated[index]));
    copy.localizationStatus = 'machine-accepted';
    copy.localizationAcceptedBy = 'site-owner';
    copy.localizationAcceptedAt = '2026-10-09';
  }
  // Preserve mathematical notation, matrix examples, and SVD symbols exactly.
  for (const key of ['intro', 'howAnswer', 'privacyAnswer', 'additionalFaqs.0.answer', 'additionalFaqs.1.answer', 'additionalFaqs.2.answer']) {
    const path = key.split('.');
    let value = path.reduce((parent, part) => parent?.[part], copy);
    if (typeof value === 'string') {
      value = value.replace(/U\s*Σ\s*V(?:\^|ᵀ)?/gu, 'UΣVᵀ').replace(/A\s*=\s*UΣVᵀ/gu, 'A = UΣVᵀ');
      let targetObject = copy;
      for (const part of path.slice(0, -1)) targetObject = targetObject[part];
      targetObject[path.at(-1)] = value;
    }
  }
  if (locale === 'ar') Object.assign(copy, {
    name: 'حاسبة تحليل القيم المفردة',
    title: 'حاسبة SVD مجانية | UsefulVerse',
    description: 'احسب تحليل المصفوفة SVD والرتبة العددية وخطأ إعادة البناء. مجانًا وفي متصفحك.',
    intro: 'حلّل المصفوفة المستطيلة A إلى العوامل المختصرة U وΣ وVᵀ. اعرض القيم المفردة والرتبة العددية المقدّرة والمصفوفة المعاد بناؤها وخطأها، ثم نزّل النتائج بصيغة CSV.',
    howQuestion: 'كيف أحسب تحليل SVD؟',
    howAnswer: 'أدخل مصفوفة مستطيلة، صفًا في كل سطر، وافصل القيم بمسافات أو فواصل. تحسب الأداة تقدير A = UΣVᵀ وتتحقق من مدى إعادة العوامل بناء المصفوفة.',
    privacyQuestion: 'هل يتم رفع المصفوفة؟',
    privacyAnswer: 'لا. يجري التحليل داخل متصفحك، ولا يتم رفع المصفوفة أو حفظها بواسطة هذه الأداة.',
    fields: { ...copy.fields, matrix: 'المصفوفة A', matrixHint: 'استخدم من صفين إلى 8 صفوف ومن عمودين إلى 8 أعمدة. افصل القيم بمسافات أو فواصل، وضع كل صف في سطر. تُقبل الصيغ العشرية والعلمية. يجب أن تكون القيم بين ‎−1,000,000 و1,000,000.', accuracyNote: 'تقدير عددي بالفاصلة العائمة، وليس نتيجة رمزية دقيقة. قد تختلف الرتبة قرب حد التسامح؛ العوامل المختصرة مخصصة للمصفوفات الصغيرة.', resultRank: 'الرتبة العددية المقدّرة', resultSingularValues: 'القيم المفردة', resultReconstructionError: 'خطأ إعادة البناء النسبي', resultOriginal: 'المصفوفة المدخلة A', resultU: 'U (المتجهات المفردة اليسرى)', resultSigma: 'Σ (القيم المفردة)', resultVt: 'Vᵀ (منقول المتجهات المفردة اليمنى)', resultReconstructed: 'إعادة البناء UΣVᵀ', resultFrobenius: 'باقي فروبينيوس' },
    actions: { ...copy.actions, calculate: 'احسب SVD', reset: 'مسح', example: 'تحميل مثال قطري', result: 'نتيجة SVD', downloadCsv: 'تنزيل المصفوفات CSV' },
    messages: { ...copy.messages, calculated: 'تم حساب SVD والتحقق من إعادة البناء.', checkInputs: 'تحقق من أبعاد المصفوفة وأطوال الصفوف والقيم الرقمية.', exampleLoaded: 'تم تحميل مثال المصفوفة القطرية.', downloaded: 'تم تنزيل نتائج SVD بصيغة CSV.', downloadUnavailable: 'تنزيل CSV غير متاح في هذا المتصفح.' },
    additionalFaqs: [
      { question: 'ما تحليل القيم المفردة؟', answer: 'يحلّل SVD المصفوفة إلى A = UΣVᵀ، حيث تصف القيم المفردة في Σ قوة الاتجاهات المتعامدة.' },
      { question: 'هل تدعم هذه الحاسبة المصفوفات المستطيلة؟', answer: 'نعم. أدخل من صفين إلى 8 صفوف وأعمدة؛ تستخدم العوامل صيغة مستطيلة مختصرة.' },
      { question: 'هل الرتبة العددية دقيقة تمامًا؟', answer: 'لا. تُقدّر باستخدام حد تسامح للفاصلة العائمة، لذا قد تُعامل القيم المفردة الصغيرة جدًا كأنها صفر.' },
    ],
  });
  copy.copyLanguage = locale;
  copies[locale] = normalize(copy);
  await saveCopies();
  console.log(`${locale}: ${phrases.length} strings`);
}
console.log(`Wrote ${Object.keys(copies).length} static locale copies.`);

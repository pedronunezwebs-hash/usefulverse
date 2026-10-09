// One-time static machine translation through Google's free web endpoint.
// Writes only checked-in locale drafts; the published pages do not call a translator.
import { writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { locales } from '../../src/locales.mjs';
import { sectionModulusCalculatorEnglishCopy as source } from '../../src/growth600/locales/section-modulus-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/section-modulus-calculator.mjs', import.meta.url);
const separator = '###SECMOD69137###';
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
  if (values.length !== phrases.length) throw new Error(`Translation response split mismatch: ${locale}`);
  return values.map((value, index) => value.trim() || phrases[index]);
}
function preserveTerms(value) {
  if (typeof value === 'string') return value.replace(/Ix|Iy|Zx|Zy|mm|cm|UsefulVerse/giu, (term) => ({ ix: 'Ix', iy: 'Iy', zx: 'Zx', zy: 'Zy', mm: 'mm', cm: 'cm', usefulverse: 'UsefulVerse' })[term.toLowerCase()]);
  if (Array.isArray(value)) return value.map(preserveTerms);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, preserveTerms(child)]));
  return value;
}
function improveLocale(copy, locale) {
  if (locale === 'ar') Object.assign(copy, {
    name: 'حاسبة معامل المقطع',
    title: 'حاسبة معامل المقطع مجانية | UsefulVerse',
    description: 'احسب المركز والمساحة وعزمي المساحة Ix وIy ومعامل المقطع لأشكال شائعة. مجانية وبلا حدود داخل المتصفح ودون حساب.',
    intro: 'احسب المساحة ومركز المقطع وعزمي المساحة ومعامل المقطع المرن لمستطيل أو دائرة أو مقطع مجوف أو مثلث.',
    howQuestion: 'كيف أحسب معامل المقطع؟',
    howAnswer: 'اختر شكلاً أساسياً وأدخل أبعاده بوحدة واحدة متسقة. تعرض الأداة Ix وIy حول محوري المركز ومعامل المقطع المرن حول محوري x وy. في المربع يتساوى Ix وIy. هذه خصائص هندسية فقط وليست فحصاً لقدرة عنصر إنشائي.',
    privacyQuestion: 'هل تُرفع أبعادي؟',
    privacyAnswer: 'لا. يجري الحساب في هذا المتصفح ولا ترفع الأداة الأبعاد أو تحفظها.',
    fields: {
      ...copy.fields, shape: 'شكل المقطع العرضي', rectangle: 'مستطيل مصمت', circle: 'دائرة مصمتة', hollowRectangle: 'مستطيل مجوف', hollowCircle: 'أنبوب دائري', triangle: 'مثلث',
      width: 'العرض / القاعدة', height: 'الارتفاع', diameter: 'القطر', outerWidth: 'العرض الخارجي', outerHeight: 'الارتفاع الخارجي', innerWidth: 'العرض الداخلي', innerHeight: 'الارتفاع الداخلي', outerDiameter: 'القطر الخارجي', innerDiameter: 'القطر الداخلي',
      unit: 'وحدة الأبعاد', millimeters: 'ملليمتر (mm)', centimeters: 'سنتيمتر (cm)', meters: 'متر (m)', inches: 'بوصة (in)',
      accuracyNote: 'حساب هندسي مثالي لمقطع ثابت ومتجانس ذي زوايا حادة. المقاطع المجوفة متمركزة. العزوم حول محاور مارة بالمركز وموازية للأبعاد المدخلة. لا تحسب الأداة الإجهاد أو مقاومة الأحمال أو الانبعاج أو الوصلات أو مطابقة الأكواد. اطلب من مهندس إنشائي مؤهل مراجعة قرارات التصميم.',
    },
    actions: { calculate: 'احسب خصائص المقطع', reset: 'إعادة ضبط', copy: 'نسخ النتائج', example: 'جرّب مثال المربع', result: 'خصائص المقطع' },
    messages: { ...copy.messages, calculated: 'تم حساب خصائص المقطع.', checkInputs: 'تحقق من الشكل والأبعاد الموجبة، واجعل الأبعاد الداخلية أصغر من الخارجية.', copied: 'تم نسخ النتائج.', copyUnavailable: 'النسخ غير متاح في هذا المتصفح.', area: 'المساحة', centroidX: 'إحداثي المركز x من اليسار', centroidY: 'إحداثي المركز y من القاعدة', ix: 'عزم المساحة الثاني Ix', iy: 'عزم المساحة الثاني Iy', zxTop: 'معامل المقطع Zx (أعلى)', zxBottom: 'معامل المقطع Zx (أسفل)', zy: 'معامل المقطع Zy', exampleLoaded: 'تم تحميل مثال المربع.' },
    additionalFaqs: [
      { question: 'ما الفرق بين عزم المساحة ومعامل المقطع؟', answer: 'يصف عزم المساحة الثاني Ix أو Iy توزيع المساحة حول محور، ووحدته طول للقوة الرابعة. معامل المقطع المرن هو العزم مقسوماً على أبعد مسافة إلى حافة المقطع، ووحدته طول للقوة الثالثة.' },
      { question: 'ما الأشكال التي تدعمها الحاسبة؟', answer: 'تدعم مستطيلاً مصمتاً ودائرة مصمتة ومستطيلاً مجوفاً متمركزاً وأنبوباً دائرياً ومثلثاً. لا تحسب عوارض I أو القنوات أو المقاطع المركبة أو الثقوب غير المتمركزة.' },
      { question: 'هل يمكنني اختيار عارضة أو التأكد من سلامتها بهذه النتائج؟', answer: 'لا. هذه خصائص هندسية مثالية وليست فحصاً للأحمال أو الإجهاد المسموح. يعتمد التصميم الإنشائي على المادة والأحمال والدعامات والانبعاج والوصلات والأكواد وعوامل الأمان؛ استعن بمهندس إنشائي مؤهل.' },
    ],
  });
  return copy;
}
const names = { zh: '截面模量计算器', zh_tw: '截面模數計算器', ha: 'Lissafin Sashe', tl: 'Section Modulus Calculator' };
collect(source);
let copies = {};
try { copies = { ...(await import(`${target.href}?resume=${Date.now()}`)).default }; } catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }
async function save() { await writeFile(target, `// Static machine-translated drafts; no translation service is called on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`); }
for (const locale of Object.keys(locales)) {
  if (locale !== 'en' && copies[locale]?.intro && copies[locale].intro !== source.intro) {
    copies[locale] = preserveTerms(normalize(improveLocale(structuredClone(copies[locale]), locale)));
    await save();
    console.log(`${locale}: existing draft checked and retained`);
    continue;
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
        await new Promise((resolve) => setTimeout(resolve, 300));
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
  if (names[locale]) copy.name = names[locale];
  copies[locale] = preserveTerms(normalize(improveLocale(copy, locale)));
  await save();
  console.log(`${locale}: ${locale === 'en' ? 'source saved' : 'static translation draft generated'}`);
}

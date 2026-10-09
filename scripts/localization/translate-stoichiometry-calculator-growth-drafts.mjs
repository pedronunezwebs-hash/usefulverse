// Generate static machine-assisted copy once; no translation service runs on the website.
import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { stoichiometryCalculatorEnglishCopy as source } from '../../src/growth600/locales/stoichiometry-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/stoichiometry-calculator-final.mjs', import.meta.url);
const localeCodes = { zh_tw: 'zh-TW', zh: 'zh-CN', pt_br: 'pt' };
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') {
    if (!['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt'].includes(path.at(-1))) paths.push(path);
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function getAtPath(object, path) { return path.reduce((value, key) => value?.[key], object); }
function setAtPath(object, path, value) {
  let parent = object;
  for (const key of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(key)] : parent[key];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value;
  else parent[path.at(-1)] = value;
}
function normalize(copy) {
  const suffix = ' | UsefulVerse';
  const maxTitle = 60 - [...suffix].length;
  let title = [...String(copy.title).split('|', 1)[0].trim()].slice(0, maxTitle).join('').trimEnd();
  if (title.length === maxTitle) title = title.slice(0, Math.max(0, title.lastIndexOf(' '))).trimEnd();
  copy.title = `${title}${suffix}`;
  if ([...copy.description].length > 160) copy.description = `${[...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '')}...`;
  return copy;
}
async function translate(locale, phrases) {
  const query = new URL('https://clients5.google.com/translate_a/t');
  query.searchParams.set('client', 'dict-chrome-ex'); query.searchParams.set('sl', 'en');
  query.searchParams.set('tl', localeCodes[locale] ?? locale.replace('_', '-')); query.searchParams.set('dt', 't');
  for (const phrase of phrases) query.searchParams.append('q', phrase);
  const response = await fetch(query, { signal: AbortSignal.timeout(25_000) });
  if (!response.ok) throw new Error(`Google Translate returned HTTP ${response.status} for ${locale}.`);
  const result = await response.json();
  if (!Array.isArray(result) || result.length !== phrases.length || result.some((value) => typeof value !== 'string' || !value.trim())) {
    throw new Error(`Google Translate returned an incomplete batch for ${locale}.`);
  }
  return result.map((value) => value.trim());
}

collect(source);
let copies = { en: structuredClone(source) };
try { copies = { ...copies, ...(await import(`${target.href}?resume=${Date.now()}`)).default }; }
catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }

const arabic = {
  name: 'حاسبة الحسابات الكيميائية', title: 'حاسبة الحسابات الكيميائية مجانًا | UsefulVerse',
  description: 'وازن المعادلة الكيميائية، وحدد المتفاعل المحدد، وقدّر الناتج النظري أو المئوي. مجانية ومحلية دون حساب.',
  intro: 'أدخل تفاعلًا وكمية كل متفاعل. اعرض المعادلة الموزونة والمتفاعل المحدد والناتج النظري.',
  howQuestion: 'كيف أستخدم حاسبة الحسابات الكيميائية؟',
  howAnswer: 'أدخل معادلة جزيئية متعادلة، ثم أدخل كمية لكل متفاعل حسب الترتيب المعروض. اختر الغرام أو المول. توازن الحاسبة المعادلة وتقارن الكميات بالمعاملات وتحسب تقدير كل ناتج. يمكنك إدخال كتلة الناتج الفعلية لحساب نسبة المردود.',
  privacyQuestion: 'هل تُرفع المعادلة أو القياسات؟', privacyAnswer: 'لا. تُحسب المعادلة والكميات في هذا المتصفح ولا تُرفع أو تُحفظ.',
  fields: {
    equation: 'التفاعل الكيميائي', inputMode: 'وحدة كمية المتفاعل', gramsMode: 'الكتلة بالغرام (g)', molesMode: 'الكمية بالمول (mol)',
    reactantAmounts: 'كميات المتفاعلات، كمية في كل سطر', reactantAmountsHint: 'أدخل رقمًا موجبًا واحدًا في كل سطر حسب ترتيب المتفاعلات أعلاه. في وضع الغرامات أدخل الكتلة بالغرام، وفي وضع المولات أدخل mol.',
    products: 'الناتج لحساب المردود الفعلي', actualProductMass: 'كتلة الناتج الفعلية (اختياري، g)',
    actualProductHint: 'اتركه فارغًا لتجاوز نسبة المردود. تُقارن الكمية بالكتلة النظرية للناتج المحدد.',
    accuracyNote: 'تقدير تعليمي للصيغ والعناصر المتعادلة المدعومة. يفترض حدوث التفاعل كما كُتب ولا يصحح النقاوة أو التفاعلات الجانبية أو الظروف. لا يدعم موازنة الشحنات أو الإلكترونات أو سلامة المختبر. اتبع إشرافًا مؤهلًا وبيانات السلامة؛ هذه ليست طريقة مخبرية. تبقى الحسابات في هذا المتصفح.',
  },
  actions: { calculate: 'احسب المردود', reset: 'إعادة ضبط', copy: 'انسخ النتائج', example: 'تحميل مثال الماء', result: 'نتائج الحسابات الكيميائية' },
  messages: {
    copied: 'نُسخت النتائج.', copyUnavailable: 'النسخ غير متاح في هذا المتصفح.', calculated: 'اكتمل الحساب.',
    checkInputs: 'تحقق من التفاعل وأدخل كمية موجبة لكل متفاعل حسب الترتيب المعروض.', enterValidEquation: 'أدخل تفاعلًا مدعومًا واحدًا مع متفاعلات ونواتج.',
    reactantsInOrder: 'أدخل الكميات بهذا الترتيب للمتفاعلات:', balancedEquation: 'المعادلة الموزونة', limitingReactants: 'المتفاعل المحدد',
    reactionExtent: 'أقصى مقدار للتفاعل', reactant: 'المتفاعل', theoreticalProduct: 'الناتج النظري', percentYield: 'نسبة المردود', actualOf: 'فعلي',
  },
  additionalFaqs: [
    { question: 'كيف يُحدَّد المتفاعل المحدد؟', answer: 'تحول الحاسبة كمية كل متفاعل إلى مولات، ثم تقسمها على معامله في المعادلة الموزونة. أصغر نسبة تحد التفاعل. إذا تساوت النسب ضمن هامش التقريب، تظهر جميع المتفاعلات المتساوية.' },
    { question: 'كيف يُحسب الناتج النظري؟', answer: 'يحدد المتفاعل المحدد أقصى مقدار للتفاعل. تعطي نسبة المعاملات الموزونة مولات كل ناتج نظريًا، وتحول الكتلة المولية المدعومة المولات إلى غرامات.' },
    { question: 'هل يمكن أن تتجاوز نسبة المردود 100٪؟', answer: 'نعم، تعرض الحاسبة النتيجة بحسب الكتل المدخلة. قد تشير النتيجة الأعلى من 100٪ إلى رطوبة أو شوائب أو خطأ قياس؛ ولا تثبت أن التفاعل تجاوز الاكتمال.' },
    { question: 'ما التفاعلات والعناصر المدعومة؟', answer: 'تقبل الأداة التعليمية صيغًا جزيئية متعادلة مدعومة ومجموعة العناصر الموثقة في حاسبة الكتلة المولية في UsefulVerse. لا تدعم الشحنات الأيونية أو أنصاف التفاعلات أو موازنة الإلكترونات.' },
  ],
  localizationStatus: 'machine-accepted', localizationAcceptedBy: 'site-owner', localizationAcceptedAt: '2026-10-09',
};

async function save() {
  copies.ar = { ...copies.ar, ...structuredClone(arabic) };
  await writeFile(target, `// Static machine-translated copy; no translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
}

for (const locale of Object.keys(locales)) {
  if (locale === 'en' || copies[locale]?.localizationStatus === 'machine-accepted') continue;
  const copy = structuredClone(source);
  const indices = paths.map((_, index) => index);
  for (let cursor = 0; cursor < indices.length; cursor += 8) {
    const batch = indices.slice(cursor, cursor + 8);
    let translated;
    try { translated = await translate(locale, batch.map((index) => getAtPath(source, paths[index]))); }
    catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 900));
      translated = [];
      for (const index of batch) translated.push(...await translate(locale, [getAtPath(source, paths[index])]));
    }
    batch.forEach((index, position) => setAtPath(copy, paths[index], translated[position]));
  }
  Object.assign(copy, { copyLanguage: locale, localizationStatus: 'machine-accepted', localizationAcceptedBy: 'site-owner', localizationAcceptedAt: '2026-10-09' });
  copies[locale] = normalize(copy);
  await save();
  console.log(`Translated and saved ${locale}`);
}
await save();
console.log(`Wrote static copy for ${Object.keys(copies).length} locales to ${target.pathname}`);

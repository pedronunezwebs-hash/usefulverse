// Create static machine translations once; the published site makes no translation calls.
import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { transformerCalculatorEnglishCopy as source } from '../../src/growth600/locales/transformer-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/transformer-calculator-final.mjs', import.meta.url);
const localeCodes = { zh_tw: 'zh-TW', zh: 'zh-CN', pt_br: 'pt' };
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') {
    if (!['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt'].includes(path.at(-1))) paths.push(path);
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function getAtPath(object, path) { return path.reduce((value, key) => value?.[key], object); }
function setAtPath(object, path, value) { let parent = object; for (const key of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(key)] : parent[key]; if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value; }
function normalize(copy) {
  const suffix = ' | UsefulVerse'; const maxTitle = 60 - [...suffix].length;
  let title = [...String(copy.title).split('|', 1)[0].trim()].slice(0, maxTitle).join('').trimEnd();
  if (title.length === maxTitle) title = title.slice(0, Math.max(0, title.lastIndexOf(' '))).trimEnd();
  copy.title = `${title}${suffix}`;
  if ([...copy.description].length > 160) copy.description = `${[...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '')}...`;
  return copy;
}
async function translate(locale, strings) {
  async function request(phrases) {
    const query = new URL('https://clients5.google.com/translate_a/t');
    query.searchParams.set('client', 'dict-chrome-ex'); query.searchParams.set('sl', 'en'); query.searchParams.set('tl', localeCodes[locale] ?? locale.replace('_', '-')); query.searchParams.set('dt', 't');
    for (const phrase of phrases) query.searchParams.append('q', phrase);
    const response = await fetch(query, { signal: AbortSignal.timeout(25_000) });
    if (!response.ok) throw new Error(`Google Translate returned HTTP ${response.status} for ${locale}.`);
    return response.json();
  }
  let output = await request(strings);
  if (!Array.isArray(output) || output.length !== strings.length || output.some((value) => typeof value !== 'string' || !value.trim())) {
    output = [];
    for (const phrase of strings) {
      let single = await request([phrase]);
      if (!Array.isArray(single) || typeof single[0] !== 'string' || !single[0].trim()) {
        await new Promise((resolve) => setTimeout(resolve, 700));
        single = await request([phrase]);
      }
      if (!Array.isArray(single) || typeof single[0] !== 'string' || !single[0].trim()) throw new Error(`Google Translate could not translate ${JSON.stringify(phrase)} for ${locale}.`);
      output.push(single[0]);
    }
  }
  return output.map((value) => value.trim());
}

collect(source);
let copies = { en: structuredClone(source) };
try { copies = { ...copies, ...(await import(`${target.href}?resume=${Date.now()}`)).default }; } catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }
async function save() {
  if (copies.ar) {
    Object.assign(copies.ar, {
      name: 'حاسبة المحولات',
      title: 'حاسبة المحولات مجانًا وبلا حدود | UsefulVerse',
      description: 'احسب جهد المحول أو نسبة اللفات أو التيار مع الكفاءة. أداة مجانية تعمل محليًا دون حساب أو رفع بيانات.',
      intro: 'قدّر جهد المحول المثالي أو نسبة اللفات أو التيار الثانوي. اختر طريقة الحساب وأدخل القيم المطلوبة.',
      howQuestion: 'كيف أحسب جهد المحول؟',
      howAnswer: 'لحساب الجهد، أدخل جهد الملف الابتدائي وعدد لفات الملفين. إذا كان للابتدائي 100 لفة وللثانوي 50 لفة والجهد 120 فولت، فالجهد الثانوي المثالي 60 فولت. نسبة اللفات هي Ns/Np.',
      privacyQuestion: 'هل تُرفع القيم التي أدخلها؟',
      privacyAnswer: 'لا. تعمل هذه الحاسبة في المتصفح ولا ترفع القيم أو تحفظها.',
      fields: {
        mode: 'طريقة الحساب', voltageMode: 'الجهد الثانوي من عدد اللفات', ratioMode: 'نسبة اللفات من الجهدين', currentMode: 'تقدير التيار الثانوي',
        primaryVoltage: 'جهد الملف الابتدائي (فولت RMS)', secondaryVoltage: 'جهد الملف الثانوي (فولت RMS)', primaryTurns: 'عدد لفات الملف الابتدائي (Np)', secondaryTurns: 'عدد لفات الملف الثانوي (Ns)', primaryCurrent: 'تيار الملف الابتدائي (أمبير)', efficiencyPercent: 'الكفاءة المفترضة (%)',
        accuracyNote: 'تقدير تعليمي مثالي يستخدم جهد RMS ونسبة اللفات Ns/Np. تعتمد المحولات الحقيقية على التردد والقلب والحمل وفواقد اللفات. لا يحدد هذا التقدير القدرة الاسمية أو العزل أو الأسلاك أو السلامة الكهربائية. ليس نصيحة تصميم أو سلامة؛ راجع بيانات الشركة المصنّعة واستشر مختصًا مؤهلًا.',
      },
      actions: { calculate: 'احسب', reset: 'إعادة ضبط', copy: 'انسخ النتيجة', example: 'جرّب 120 فولت ونسبة لفات 100:50', result: 'النتيجة' },
      messages: { copied: 'نُسخت النتيجة.', copyUnavailable: 'النسخ غير متاح في هذا المتصفح.', calculated: 'اكتمل الحساب.', checkInputs: 'تحقق من القيم المطلوبة. يجب أن تكون موجبة، والكفاءة أكبر من 0% وبحد أقصى 100%.', turnsRatio: 'نسبة اللفات (Ns/Np)', direction: 'نوع المحول', 'step-up': 'رافع للجهد', 'step-down': 'خافض للجهد', '1:1': 'لفات متساوية', primaryVoltage: 'جهد الملف الابتدائي', secondaryVoltage: 'جهد الملف الثانوي', primaryCurrent: 'تيار الملف الابتدائي', secondaryCurrent: 'التيار الثانوي المقدّر', efficiency: 'الكفاءة المفترضة' },
      additionalFaqs: [
        { question: 'ما نسبة اللفات في المحول؟', answer: 'تُحسب هنا بقسمة عدد لفات الملف الثانوي على الابتدائي (Ns/Np). في المحول المثالي تساوي هذه النسبة نسبة الجهد الثانوي إلى الجهد الابتدائي.' },
        { question: 'كيف تؤثر نسبة اللفات في التيار؟', answer: 'في المحول المثالي، تتناسب نسبة التيار عكسيًا مع نسبة اللفات. كما يضرب وضع التيار الناتج في نسبة الكفاءة التي أدخلتها، لذلك فهو تقدير فقط.' },
        { question: 'هل تختار هذه الأداة محولًا آمنًا؟', answer: 'لا. لا تفحص القدرة الاسمية أو التردد أو تشبع القلب أو الحرارة أو العزل أو الحماية أو الأنظمة المحلية. راجع بيانات الشركة المصنّعة واستشر مختصًا مؤهلًا.' },
      ],
      localizationStatus: 'machine-accepted', localizationAcceptedBy: 'site-owner', localizationAcceptedAt: '2026-10-09',
    });
  }
  await writeFile(target, `// Static machine-translated copy; no translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
}
for (const locale of Object.keys(locales)) {
  if (locale === 'en') continue;
  if (copies[locale]?.localizationStatus === 'machine-accepted') continue;
  const copy = structuredClone(source); const values = paths.map((path) => getAtPath(source, path));
  const groups = []; let group = []; let chars = 0;
  for (let index = 0; index < values.length; index++) {
    const length = values[index].length;
    if (group.length && chars + length > 2600) { groups.push(group); group = []; chars = 0; }
    group.push(index); chars += length;
  }
  if (group.length) groups.push(group);
  for (const indices of groups) for (let start = 0; start < indices.length; start += 32) {
    const batchIndexes = indices.slice(start, start + 32);
    const translatedBatches = await Promise.all(Array.from({ length: Math.ceil(batchIndexes.length / 8) }, (_, batchIndex) => {
      const batch = batchIndexes.slice(batchIndex * 8, (batchIndex + 1) * 8);
      return translate(locale, batch.map((index) => values[index])).then((translated) => ({ batch, translated }));
    }));
    for (const { batch, translated } of translatedBatches) batch.forEach((index, position) => setAtPath(copy, paths[index], translated[position]));
  }
  copy.copyLanguage = locale;
  copy.localizationStatus = 'machine-accepted'; copy.localizationAcceptedBy = 'site-owner'; copy.localizationAcceptedAt = '2026-10-09';
  copies[locale] = normalize(copy);
  await save();
  console.log(`${locale}: ${values.length} strings translated`);
}
copies.en = normalize(copies.en);
await save();

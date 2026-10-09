import { writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { rlcCircuitCalculatorEnglishCopy as source } from '../../src/growth600/locales/rlc-circuit-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/rlc-circuit-calculator-final.mjs', import.meta.url);
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
  const suffix = ' | UsefulVerse'; const titleLimit = 60 - [...suffix].length;
  let title = [...String(copy.title).split('|', 1)[0].trim()].slice(0, titleLimit).join('').trimEnd();
  if (title.length === titleLimit) title = title.slice(0, Math.max(0, title.lastIndexOf(' '))).trimEnd();
  copy.title = `${title}${suffix}`;
  if ([...copy.description].length > 160) copy.description = `${[...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '')}...`;
  return copy;
}
async function translateBatch(locale, phrases) {
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

const copies = { en: structuredClone(source) };
for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
  const phrases = paths.map((path) => path.reduce((value, item) => value[item], source));
  const translated = await translate(key, phrases);
  const copy = structuredClone(source);
  paths.forEach((path, index) => setAtPath(copy, path, translated[index]));
  copy.copyLanguage = key; copy.localizationStatus = 'machine-accepted'; copy.localizationAcceptedBy = 'site-owner'; copy.localizationAcceptedAt = '2026-10-09';
  copies[key] = normalize(copy);
  await writeFile(target, `const rlcCircuitCalculatorCopies = ${JSON.stringify(copies, null, 2)};\n\nexport default rlcCircuitCalculatorCopies;\n`);
  console.log(`Saved static RLC calculator copy: ${key}`);
}
if (copies.ar) {
  Object.assign(copies.ar, {
    name: 'حاسبة دائرة RLC', title: 'حاسبة دائرة RLC مجانًا وبلا حدود | UsefulVerse',
    description: 'احسب رنين دائرة RLC ومعامل Q وعرض النطاق والممانعة. مجانية ومحلية وبلا حدود.',
    intro: 'اختر دائرة RLC على التوالي أو التوازي، وأدخل قيم العناصر لعرض الرنين والممانعة عند تردد تختاره.',
    howQuestion: 'كيف تحسب دائرة RLC تردد الرنين؟',
    howAnswer: 'للعناصر المثالية المركزة، تردد الرنين هو 1/(2π√(LC)). يعتمد معامل الجودة Q وعرض النطاق على توصيل المقاومة على التوالي أو التوازي. وتحسب الأداة الممانعة المركبة عند التردد الذي تختاره.',
    privacyQuestion: 'هل تُرفع قيم الدائرة؟', privacyAnswer: 'لا. تُجرى الحسابات ويُرسم منحنى الاستجابة في هذا المتصفح، ولا تُرفع القيم أو تُحفظ.',
    additionalFaqs: [
      { question: 'ما صيغة تردد الرنين؟', answer: 'للمحث L والمكثف C المثاليين، f₀ = 1/(2π√(LC)). استخدم الهنري والفاراد لتحصل على الهرتز. تغيّر المقاومة التخميد ومعامل Q، لا صيغة الرنين المثالية.' },
      { question: 'ما الفرق بين دائرة RLC على التوالي والتوازي؟', answer: 'عند الرنين، تكون ممانعة دائرة RLC المثالية على التوالي أقل ما يمكن وتساوي R، بينما تكون ممانعة دائرة التوازي أكبر ما يمكن وتساوي R. لذلك يختلف سلوك التيار والجهد رغم تساوي تردد الرنين المثالي.' },
      { question: 'كيف يُحسب معامل Q وعرض النطاق؟', answer: 'لنموذج التوالي: Q = ω₀L/R وعرض النطاق R/(2πL). ولنموذج التوازي: Q = R/(ω₀L) وعرض النطاق 1/(2πRC). هذه علاقات مثالية لرنين واحد.' },
      { question: 'هل تحسب الأداة تفاوتات العناصر الحقيقية؟', answer: 'لا. تفترض عناصر مثالية وخطية ومركزة. قد تغيّر العناصر الطفيلية ومقاومة ملف المحث وممانعة المصدر والحمل وتفاوت المكونات استجابة الدائرة الحقيقية.' },
      { question: 'هل تثبت الحاسبة أن الدائرة آمنة؟', answer: 'لا. هذا تقدير تعليمي وليس اعتمادًا للتصميم أو تقييمًا للسلامة. تحقّق من تصنيفات العناصر والسلوك الفعلي بمراجعة البيانات الفنية ومهندس مؤهل.' },
    ],
  });
  Object.assign(copies.ar.fields, {
    topology: 'تركيب الدائرة', series: 'RLC على التوالي', parallel: 'RLC على التوازي', resistance: 'المقاومة (Ω)', inductance: 'المحث', inductanceUnit: 'وحدة المحث',
    henries: 'هنري (H)', millihenries: 'ملي هنري (mH)', microhenries: 'ميكرو هنري (µH)', capacitance: 'السعة', capacitanceUnit: 'وحدة السعة',
    farads: 'فاراد (F)', microfarads: 'ميكروفاراد (µF)', nanofarads: 'نانوفاراد (nF)', picofarads: 'بيكوفاراد (pF)',
    frequency: 'التردد المراد تحليله', frequencyUnit: 'وحدة التردد', hertz: 'هرتز (Hz)', kilohertz: 'كيلوهرتز (kHz)', voltage: 'جهد المصدر (فولت RMS)',
    accuracyNote: 'نموذج RLC مثالي وخطي ومركّز فقط. يعني وضع التوازي أن R وL وC كلها على التوازي. لا يحسب التفاوت أو العناصر الطفيلية أو مقاومة ملف المحث أو ممانعة المصدر أو العناصر غير الخطية أو اقتران الحمل أو السلامة. لا يعتمد دائرة حقيقية ولا يختار مكوناتها. راجع البيانات الفنية واستشر مختصًا قبل بناء أجهزة حقيقية أو استخدامها. يعمل محليًا ولا يرفع البيانات.',
    chartTitle: 'الممانعة حسب التردد', chartDescription: 'مسح لوغاريتمي للتردد من عُشر تردد الرنين إلى عشرة أمثاله. يوضح المنحنى مقدار الممانعة المثالي للتركيب المحدد على التوالي أو التوازي.',
  });
  Object.assign(copies.ar.actions, { calculate: 'احسب دائرة RLC', reset: 'إعادة ضبط', copy: 'نسخ النتائج', example: 'تحميل المثال', result: 'نتائج RLC' });
  Object.assign(copies.ar.messages, {
    copied: 'تم نسخ النتائج.', copyUnavailable: 'النسخ غير متاح في هذا المتصفح.', calculated: 'تم حساب تقدير دائرة RLC.', checkInputs: 'تحقق من قيم R وL وC والتردد والجهد والتركيب والوحدات.',
    model: 'النموذج', resonance: 'تردد الرنين', qualityFactor: 'معامل الجودة (Q)', bandwidth: 'عرض النطاق التقريبي', inductiveReactance: 'المفاعلة الحثية (XL)',
    capacitiveReactance: 'المفاعلة السعوية (XC)', complexImpedance: 'الممانعة المركبة (R + jX)', impedanceMagnitudePhase: 'مقدار الممانعة / الطور', current: 'تيار المصدر (RMS مثالي)',
  });
}
for (const copy of Object.values(copies)) normalize(copy);
await writeFile(target, `const rlcCircuitCalculatorCopies = ${JSON.stringify(copies, null, 2)};\n\nexport default rlcCircuitCalculatorCopies;\n`);
console.log(`Wrote ${Object.keys(copies).length} static RLC calculator locales.`);

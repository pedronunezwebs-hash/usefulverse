import { writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { antennaLengthCalculatorEnglishCopy as source } from '../../src/growth600/locales/antenna-length-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/antenna-length-calculator-final.mjs', import.meta.url);
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
  const targetLanguage = localeCodes[locale] ?? locale.replace('_', '-');
  const url = new URL('https://clients5.google.com/translate_a/t');
  url.searchParams.set('client', 'dict-chrome-ex'); url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', targetLanguage); url.searchParams.set('dt', 't');
  for (const phrase of phrases) url.searchParams.append('q', phrase);
  const response = await fetch(url, { signal: AbortSignal.timeout(25_000) });
  if (!response.ok) throw new Error(`Google Translate returned HTTP ${response.status} for ${locale}.`);
  let result = await response.json();
  if (Array.isArray(result) && result.length === phrases.length + 1 && result[0] === targetLanguage) result = result.slice(1);
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
  copy.copyLanguage = key; copy.localizationStatus = 'machine-accepted'; copy.localizationAcceptedBy = 'site-owner'; copy.localizationAcceptedAt = '2026-10-10';
  copies[key] = normalize(copy);
  await writeFile(target, `const antennaLengthCalculatorCopies = ${JSON.stringify(copies, null, 2)};\n\nexport default antennaLengthCalculatorCopies;\n`);
  console.log(`Saved static antenna length calculator copy: ${key}`);
}
if (copies.ar) {
  Object.assign(copies.ar, {
    name: 'حاسبة طول الهوائي', title: 'حاسبة طول هوائي ثنائي القطب مجانًا | UsefulVerse',
    description: 'قدّر طول هوائي نصف موجة أو ربع موجة من التردد. استخدام مجاني محلي مع معامل تقصير قابل للتعديل.',
    intro: 'قدّر طول هوائي ثنائي القطب نصف الموجة أو أحادي القطب ربع الموجة في الفضاء الحر. عدّل معامل التقصير لعرض طول ابتدائي عملي وطول كل ذراع.',
    howQuestion: 'كيف أحسب طول هوائي ثنائي القطب من التردد؟',
    howAnswer: 'احسب الطول الموجي بقسمة سرعة الضوء على التردد. يبلغ طول ثنائي القطب نصف الموجة نحو نصف الطول الموجي، مقسومًا إلى ذراعين متساويين؛ ويبلغ طول أحادي القطب ربع الموجة نحو ربعه. يمكن لمعامل تقصير قابل للتعديل إعطاء تقدير أولي، لكن الطول النهائي يعتمد على تصميم الهوائي ومحيطه.',
    privacyQuestion: 'هل تُرفع قيم الهوائي؟', privacyAnswer: 'لا. يجري الحساب في هذا المتصفح ولا تُرفع القيم أو تُحفظ بواسطة الأداة.',
    additionalFaqs: [
      { question: 'ما طول هوائي ثنائي القطب نصف الموجة عند 100 MHz؟', answer: 'في الفضاء الحر، يبلغ الطول الموجي عند 100 MHz نحو 2.998 m، ولذلك يبلغ طول الهوائي المثالي نحو 1.499 m إجمالًا، أو 0.749 m لكل ذراع. قد يستخدم الهوائي العملي معامل تقصير ويجب ضبطه في موقع تركيبه.' },
      { question: 'ما طول هوائي ربع الموجة؟', answer: 'طوله المثالي في الفضاء الحر يساوي ربع الطول الموجي: سرعة الضوء مقسومة على أربعة أضعاف التردد. قد يختلف الطول المضبوط فعليًا بسبب الموصل والتغذية والأرض والمحيط.' },
      { question: 'ماذا يعني معامل التقصير؟', answer: 'يضرب طول العنصر المثالي في الفضاء الحر ليعطي تقديرًا أوليًا لموصل عملي. القيمة الافتراضية تقريبية وليست معامل سرعة كابل المحور، ولا تغني عن القياس والضبط.' },
      { question: 'هل تضمن الحاسبة ضبط الهوائي أو سلامته؟', answer: 'لا. إنها تقدّر هندسة أساسية لثنائي القطب نصف الموجة أو أحادي القطب ربع الموجة. تعتمد الممانعة والرنين الفعليان على التصنيع والموقع. اتبع اللوائح وممارسات التركيب الآمن وتحقق بأجهزة مناسبة.' },
    ],
  });
  Object.assign(copies.ar.fields, {
    mode: 'نوع الهوائي', dipole: 'ثنائي القطب نصف الموجة', monopole: 'أحادي القطب ربع الموجة', frequency: 'تردد التشغيل', frequencyUnit: 'وحدة التردد',
    hz: 'هرتز (Hz)', khz: 'كيلوهرتز (kHz)', mhz: 'ميغاهرتز (MHz)', ghz: 'غيغاهرتز (GHz)', shorteningFactor: 'معامل التقصير (0.70–1.00)',
    accuracyNote: 'هذا تقدير لموصل مستقيم ورفيع في الفضاء الحر. معامل التقصير نقطة بداية قابلة للتعديل وليس تصحيحًا عامًا؛ فالتغذية وقطر الموصل والأجسام القريبة والأرض والتركيب تؤثر في الضبط. قِس واضبط بأمان. هذه ليست شهادة تصميم أو تقييمًا لسلامة الترددات اللاسلكية.',
  });
  Object.assign(copies.ar.actions, { calculate: 'احسب طول الهوائي', reset: 'إعادة ضبط', copy: 'نسخ النتائج', example: 'جرّب 100 MHz', result: 'تقدير طول الهوائي' });
  Object.assign(copies.ar.messages, {
    calculated: 'حُسب تقدير طول الهوائي.', exampleLoaded: 'تم تحميل مثال 100 MHz.', checkInputs: 'أدخل ترددًا موجبًا صالحًا ونوع الهوائي والوحدة ومعامل تقصير بين 0.70 و1.00.',
    copied: 'تم نسخ النتائج.', copyUnavailable: 'النسخ غير متاح في هذا المتصفح.', wavelength: 'الطول الموجي في الفضاء الحر', idealLength: 'الطول المثالي قبل التقصير',
    adjustedLength: 'الطول الإجمالي التقديري بعد التقصير', elementLength: 'طول كل ذراع من الهوائي', imperialAdjusted: 'الطول المعدل (قدم)', factor: 'معامل التقصير', formula: 'المعادلة',
  });
}
for (const copy of Object.values(copies)) normalize(copy);
await writeFile(target, `const antennaLengthCalculatorCopies = ${JSON.stringify(copies, null, 2)};\n\nexport default antennaLengthCalculatorCopies;\n`);
console.log(`Wrote ${Object.keys(copies).length} static antenna length calculator locales.`);

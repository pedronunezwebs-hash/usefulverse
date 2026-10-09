// One-time static drafts; the published tool never contacts a translation service.
import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { repeatingDecimalEnglishCopy as source } from '../../src/growth600/locales/repeating-decimal-to-fraction.en.mjs';

const target = new URL('../../src/growth600/locales/repeating-decimal-to-fraction.mjs', import.meta.url);
const targetCodes = { zh_tw: 'zh-TW', pt_br: 'pt', zh: 'zh-CN' };
const localeCode = (key) => targetCodes[key] ?? key.replace('_', '-');
const paths = [];
const resetLabels = {
  es: 'Borrar', fr: 'Effacer', pt: 'Limpar', de: 'Zurücksetzen', ja: 'クリア', ko: '지우기',
  id: 'Hapus', hi: 'साफ़ करें', ar: 'مسح', zh: '清除', bn: 'মুছুন', ru: 'Очистить',
  ur: 'صاف کریں', tr: 'Temizle', vi: 'Xóa', it: 'Cancella', zh_tw: '清除', bg: 'Изчисти',
  ca: 'Esborra', nl: 'Wissen', el: 'Εκκαθάριση', ms: 'Kosongkan', pl: 'Wyczyść', sv: 'Rensa',
  th: 'ล้าง', uk: 'Очистити', sw: 'Futa', mr: 'पुसून टाका', te: 'తొలగించు', ha: 'Share',
  tl: 'I-clear', ta: 'அழி', fa: 'پاک کردن', am: 'አጽዳ', gu: 'સાફ કરો',
};
const searchTitles = {
  es: 'Calculadora de decimal periódico a fracción',
  fr: 'Décimal périodique en fraction',
  pt: 'Conversor de dízima periódica em fração',
  de: 'Periodische Dezimalzahl in Bruch umwandeln',
  ja: '循環小数から分数への変換計算',
  ko: '순환소수 분수 변환 계산기',
  id: 'Kalkulator Desimal Berulang ke Pecahan',
  hi: 'आवर्ती दशमलव से भिन्न कैलकुलेटर',
  ar: 'تحويل العدد العشري الدوري إلى كسر',
  zh: '循环小数转分数计算器',
  ru: 'Калькулятор перевода периодической дроби',
};
const arabicOverrides = {
  name: 'محول الأعداد العشرية الدورية إلى كسور',
  title: 'تحويل العدد العشري الدوري إلى كسر | UsefulVerse',
  description: 'حوّل عددًا عشريًا دوريًا مثل 0.(3) إلى كسر دقيق. مجاني ويعمل في متصفحك دون رفع بياناتك.',
  intro: 'ضع الأرقام المتكررة بين قوسين، مثل 0.(3) أو 0.1(6). ستحصل على الكسر الدقيق وطريقة التحويل.',
  howQuestion: 'كيف أحول عددًا عشريًا دوريًا إلى كسر؟',
  howAnswer: 'أدخل الجزء الصحيح، ثم الأرقام غير المتكررة، وضع الأرقام المتكررة بين قوسين. يحول الموقع العدد إلى كسر دقيق ويختصره باستخدام حساب الأعداد الصحيحة.',
  privacyQuestion: 'هل يتم رفع العدد الذي أدخلته؟',
  privacyAnswer: 'لا. تتم عملية التحويل في متصفحك، ولا يتم رفع ما تدخله أو حفظه بواسطة هذه الأداة.',
  fields: {
    decimal: 'عدد عشري دوري',
    inputHint: 'أمثلة: 0.(3)، 0.1(6)، 1.2(34)، −2.(3)',
    accuracyNote: 'استخدم النقطة للفصل العشري وضع من 1 إلى 18 رقمًا دوريًا بين قوسين. يدعم حتى 12 رقمًا صحيحًا و18 رقمًا غير دوري. للأعداد العشرية المنتهية استخدم حاسبة الكسور.',
    resultSummary: 'الكسر الدقيق', simplified: 'النتيجة المبسطة', mixedNumber: 'الصيغة كعدد كسري', derivation: 'طريقة التحويل والطرح',
  },
  actions: { calculate: 'حوّل إلى كسر', example: 'استخدم المثال 0.1(6)', reset: 'مسح', result: 'نتيجة التحويل', copy: 'نسخ الكسر' },
  messages: {
    calculated: 'تم تحويل العدد العشري الدوري بدقة.',
    checkInputs: 'أدخل عددًا دوريًا مثل 0.(3) أو 1.2(34).',
    copied: 'تم نسخ الكسر.', copyUnavailable: 'النسخ غير متاح في هذا المتصفح.',
  },
  additionalFaqs: [
    { question: 'ما الكسر المكافئ للعدد 0.(3)؟', answer: 'يمثل 0.(3) العدد 0.333…، ويساوي الكسر 1/3 تمامًا.' },
    { question: 'كيف أكتب العدد 0.1666…؟', answer: 'اكتب 0.1(6): الرقم 1 لا يتكرر، والرقم 6 يتكرر. الناتج الدقيق هو 1/6.' },
    { question: 'ما الفرق بين العدد العشري الدوري والمنتهي؟', answer: 'في العدد الدوري تتكرر مجموعة من الأرقام، وتوضع هنا بين قوسين. للأعداد العشرية التي تنتهي استخدم حاسبة الكسور العادية.' },
  ],
};
function fixNotation(value) {
  if (typeof value === 'string') return value
    .replace(/(\d),\s*(?=\d|\()/gu, '$1.')
    .replace(/(\d)\.\s+\(/gu, '$1.(')
    .replace(/(\d)\s+\(/gu, '$1(');
  if (Array.isArray(value)) return value.map(fixNotation);
  if (value && typeof value === 'object') for (const key of Object.keys(value)) value[key] = fixNotation(value[key]);
  return value;
}
function collect(value, path = []) {
  if (typeof value === 'string') {
    if (path.at(-1) !== 'copyLanguage') paths.push(path);
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

const phrases = [];
collect(source);
for (const path of paths) phrases.push(path.reduce((parent, key) => parent[key], source));
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
  if (locale === 'ar') {
    Object.assign(copy, arabicOverrides);
    Object.assign(copy.fields, arabicOverrides.fields);
    Object.assign(copy.actions, arabicOverrides.actions);
    Object.assign(copy.messages, arabicOverrides.messages);
  }
  fixNotation(copy);
  if (resetLabels[locale]) copy.actions.reset = resetLabels[locale];
  if (searchTitles[locale]) copy.title = `${searchTitles[locale]} | UsefulVerse`;
  copy.copyLanguage = locale;
  copies[locale] = normalize(copy);
  console.log(`${locale}: ${phrases.length} strings`);
}
await writeFile(target, `// Static machine-translated drafts; no translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
console.log(`Wrote ${Object.keys(copies).length} static locale copies.`);

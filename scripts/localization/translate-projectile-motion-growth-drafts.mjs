// One-time static machine translation; no translation requests run on the published website.
import { writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { projectileMotionCalculatorEnglishCopy as source } from '../../src/growth600/locales/projectile-motion-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/projectile-motion-calculator-final.mjs', import.meta.url);
const localeCodes = { zh_tw: 'zh-TW', zh: 'zh-CN', pt_br: 'pt' };
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') {
    if (!['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt'].includes(path.at(-1))) paths.push(path);
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function setAtPath(object, path, value) {
  let parent = object;
  for (const key of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(key)] : parent[key];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value;
  else parent[path.at(-1)] = value;
}
function normalize(copy) {
  const suffix = ' | UsefulVerse';
  const limit = 60 - [...suffix].length;
  let title = [...String(copy.title).split('|', 1)[0].trim()].slice(0, limit).join('').trimEnd();
  if (title.length === limit) title = title.slice(0, Math.max(0, title.lastIndexOf(' '))).trimEnd();
  copy.title = `${title}${suffix}`;
  if ([...copy.description].length > 160) copy.description = `${[...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '')}...`;
  return copy;
}
async function translateBatch(locale, phrases) {
  if (!phrases.length) return [];
  const targetLocale = localeCodes[locale] ?? locale.replace('_', '-');
  const query = new URL('https://clients5.google.com/translate_a/t');
  query.searchParams.set('client', 'dict-chrome-ex'); query.searchParams.set('sl', 'en');
  query.searchParams.set('tl', targetLocale); query.searchParams.set('dt', 't');
  for (const phrase of phrases) query.searchParams.append('q', phrase);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(query, { signal: AbortSignal.timeout(25_000) });
    if (!response.ok) {
      if (attempt < 2 && response.status >= 500) { await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1))); continue; }
      throw new Error(`Google Translate returned HTTP ${response.status} for ${locale}.`);
    }
    let result = await response.json();
    if (Array.isArray(result) && result.length === phrases.length + 1 && result[0] === targetLocale) result = result.slice(1);
    if (Array.isArray(result) && result.length === phrases.length && result.every((value) => typeof value === 'string' && value.trim())) return result.map((value) => value.trim());
    if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
  }
  if (phrases.length === 1) throw new Error(`Google Translate returned incomplete text for ${locale}.`);
  const middle = Math.ceil(phrases.length / 2);
  return [...await translateBatch(locale, phrases.slice(0, middle)), ...await translateBatch(locale, phrases.slice(middle))];
}
async function translate(locale, phrases) {
  const batches = [];
  for (let index = 0; index < phrases.length; index += 12) batches.push(phrases.slice(index, index + 12));
  return (await Promise.all(batches.map((batch) => translateBatch(locale, batch)))).flat();
}

collect(source);
let copies = { en: structuredClone(source) };
try { copies = { ...copies, ...(await import(`${target.href}?resume=${Date.now()}`)).default }; }
catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }

const arabic = {
  copyLanguage: 'ar', localizationStatus: 'machine-accepted', localizationAcceptedBy: 'site-owner', localizationAcceptedAt: '2026-10-09',
  name: 'حاسبة حركة المقذوفات', title: 'حاسبة حركة المقذوفات مجانًا | UsefulVerse',
  description: 'احسب زمن طيران المقذوف ومداه وارتفاعه الأقصى، ثم شاهد مساره المثالي. مجانًا ومحليًا.',
  intro: 'استكشف مسارًا مثاليًا دون مقاومة الهواء. غيّر سرعة الإطلاق وزاويته والارتفاع الابتدائي والجاذبية لمشاهدة أثرها.',
  howQuestion: 'كيف تُحسب حركة المقذوف؟',
  howAnswer: 'قسّم سرعة الإطلاق إلى مركبتين أفقية ورأسية. تغيّر الجاذبية السرعة الرأسية فقط في هذا النموذج. تحسب الأداة زمن العودة إلى مستوى الارتفاع صفر ثم تعرض زمن الطيران والمدى والارتفاع الأقصى وسرعة الاصطدام.',
  privacyQuestion: 'هل تُرفع قيم الإطلاق؟', privacyAnswer: 'لا. تعمل الحسابات والرسوم المتحركة في هذا المتصفح ولا تُرفع القيم أو تُحفظ.',
  fields: {
    speed: 'سرعة الإطلاق', speedUnit: 'وحدة السرعة', metersPerSecond: 'متر في الثانية (m/s)', kilometersPerHour: 'كيلومتر في الساعة (km/h)', milesPerHour: 'ميل في الساعة (mph)',
    angleDegrees: 'زاوية الإطلاق عن الأفقي (درجة)', initialHeight: 'الارتفاع الابتدائي فوق مستوى الهبوط', lengthUnit: 'وحدة الارتفاع والمسافة', meters: 'متر (m)', feet: 'قدم (ft)', gravity: 'تسارع الجاذبية (m/s²)',
    accuracyNote: 'نموذج مثالي لجسم نقطي: بلا مقاومة هواء أو رياح أو رفع أو دوران أو تغير في الجاذبية أو عوائق. يفترض الهبوط عند ارتفاع صفر، ويُقاس الارتفاع المدخل فوقه. الإطلاق العمودي مداه الأفقي صفر. هذا تقدير تعليمي وليس نصيحة هندسية أو للسلامة. يعمل محليًا ولا يرفع البيانات.',
    plotTitle: 'المسار المثالي', plotDescription: 'رسم ثابت لمسار المقذوف المحسوب، الارتفاع عن مستوى الهبوط على المحور الرأسي والمسافة الأفقية على المحور الأفقي.', motionReduced: 'تقليل الحركة مفعّل. يظهر الرسم دون حركة.',
  },
  actions: { calculate: 'احسب المسار', reset: 'إعادة ضبط', copy: 'نسخ النتائج', example: 'تحميل مثال', result: 'نتائج المسار', playTrajectory: 'أعد عرض المسار', resetAnimation: 'العودة إلى الإطلاق' },
  messages: { copied: 'نُسخت النتائج.', copyUnavailable: 'النسخ غير متاح في هذا المتصفح.', calculated: 'تم حساب المسار.', checkInputs: 'تحقق من السرعة والزاوية والارتفاع والجاذبية والوحدات.', time: 'زمن الطيران', range: 'المدى الأفقي', maximumHeight: 'الارتفاع الأقصى', apexTime: 'الزمن حتى القمة', impactSpeed: 'سرعة الاصطدام', model: 'النموذج', horizontalVelocity: 'سرعة الإطلاق الأفقية', verticalVelocity: 'سرعة الإطلاق الرأسية' },
  additionalFaqs: [
    { question: 'ما معادلة حركة المقذوف؟', answer: 'دون مقاومة الهواء ومع جاذبية ثابتة: x(t)=v₀ cos(θ)t و y(t)=h₀+v₀ sin(θ)t−gt²/2. تحسب هذه الصفحة الزمن الموجب الذي يعود فيه y إلى الصفر.' },
    { question: 'كيف تؤثر زاوية الإطلاق والارتفاع في المدى؟', answer: 'تغيّر الزاوية السرعتين الأفقية والرأسية. ويطيل ارتفاع البداية زمن الطيران، لذلك قد تقطع السرعة والزاوية نفسيهما مسافة أكبر قبل الوصول إلى مستوى الهبوط.' },
    { question: 'هل مدى الإطلاق العمودي 90 درجة صفر؟', answer: 'في هذا النموذج المثالي لا توجد سرعة أفقية، لذلك يكون المدى الأفقي صفرًا. يظل للمقذوف زمن طيران وارتفاع أقصى.' },
    { question: 'هل تحسب الأداة مقاومة الهواء؟', answer: 'لا. إنه نموذج تعليمي مبسط بجاذبية ثابتة. قد تختلف المسارات الحقيقية بسبب السحب والرياح والرفع والدوران والشكل والظروف المتغيرة.' },
  ],
};

for (const locale of localeEntries.map(({ key }) => key).filter((key) => key !== 'en' && !copies[key])) {
  const phrases = paths.map((path) => path.reduce((value, key) => value[key], source));
  const translated = await translate(locale, phrases);
  const copy = structuredClone(source); paths.forEach((path, index) => setAtPath(copy, path, translated[index]));
  copy.copyLanguage = locale; copy.localizationStatus = 'machine-accepted'; copy.localizationAcceptedBy = 'site-owner'; copy.localizationAcceptedAt = '2026-10-09';
  if (locale === 'ar') Object.assign(copy, arabic);
  copies[locale] = normalize(copy);
  await writeFile(target, `export default Object.freeze(${JSON.stringify(copies)});\n`);
  console.log(`Saved ${locale}; ${Object.keys(copies).length}/${localeEntries.length}`);
}
console.log(`Static copy created: ${Object.keys(copies).length} locales.`);

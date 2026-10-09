// Generates one-time static machine translations; the website performs no translation requests.
import { writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { pcbTraceWidthCalculatorEnglishCopy as source } from '../../src/growth600/locales/pcb-trace-width-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/pcb-trace-width-calculator-final.mjs', import.meta.url);
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
  const maxTitle = 60 - [...suffix].length;
  let title = [...String(copy.title).split('|', 1)[0].trim()].slice(0, maxTitle).join('').trimEnd();
  if (title.length === maxTitle) title = title.slice(0, Math.max(0, title.lastIndexOf(' '))).trimEnd();
  copy.title = `${title}${suffix}`;
  if ([...copy.description].length > 160) copy.description = `${[...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '')}...`;
  return copy;
}
async function translateBatch(locale, phrases) {
  if (phrases.length === 0) return [];
  const query = new URL('https://clients5.google.com/translate_a/t');
  query.searchParams.set('client', 'dict-chrome-ex'); query.searchParams.set('sl', 'en');
  query.searchParams.set('tl', localeCodes[locale] ?? locale.replace('_', '-')); query.searchParams.set('dt', 't');
  for (const phrase of phrases) query.searchParams.append('q', phrase);
  const targetLocale = localeCodes[locale] ?? locale.replace('_', '-');
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(query, { signal: AbortSignal.timeout(25_000) });
    if (!response.ok) {
      if (attempt < 2 && response.status >= 500) { await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1))); continue; }
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
  return translateBatch(locale, phrases);
}

collect(source);
let copies = { en: structuredClone(source) };
try { copies = { ...copies, ...(await import(`${target.href}?resume=${Date.now()}`)).default }; }
catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }

const arabic = {
  copyLanguage: 'ar', localizationStatus: 'machine-accepted', localizationAcceptedBy: 'site-owner', localizationAcceptedAt: '2026-10-09',
  name: 'حاسبة عرض مسار لوحة الدوائر', title: 'حاسبة عرض مسار PCB مجانًا | UsefulVerse',
  description: 'قدّر عرض مسار لوحة الدوائر أو تياره باستخدام وزن النحاس وارتفاع الحرارة ونموذج IPC-2221. مجانية ومحلية.',
  intro: 'قدّر عرض مسار النحاس في لوحة الدوائر من التيار ووزن النحاس والطبقة وارتفاع الحرارة، أو قدّر التيار لعرض معلوم.',
  howQuestion: 'كيف أقدّر عرض مسار لوحة الدوائر؟',
  howAnswer: 'اختر تقدير العرض أو سعة التيار، وحدد الطبقة الداخلية أو الخارجية، ثم أدخل التيار ووزن النحاس وارتفاع الحرارة. تستخدم الحاسبة المعادلة التجريبية التقليدية IPC-2221 وتعرض العرض بالمليمتر وmil.',
  privacyQuestion: 'هل تُرفع قيم لوحة الدوائر؟', privacyAnswer: 'لا. يعمل التقدير في هذا المتصفح ولا تُرفع القيم أو تُحفظ.',
  fields: {
    mode: 'الحساب', requiredWidthMode: 'تقدير عرض المسار المطلوب', currentCapacityMode: 'تقدير التيار لعرض معلوم', conductor: 'طبقة النحاس', external: 'طبقة خارجية', internal: 'طبقة داخلية', current: 'التيار (A)',
    copperWeight: 'وزن النحاس (oz/ft²)', temperatureRise: 'ارتفاع الحرارة المسموح (°C)', width: 'عرض المسار', widthUnit: 'وحدة العرض',
    accuracyNote: 'تقريب تجريبي تقليدي من IPC-2221: I = k × ΔT^0.44 × A^0.725؛ مساحة المقطع A بوحدة mil²، وk=0.048 للطبقة الخارجية و0.024 للداخلية. هذا ليس اعتمادًا أو ضمانًا للسلامة. لا يحاكي طبقات اللوحة أو الحفر أو الطلاء أو خشونة النحاس أو مستويات النحاس المجاورة أو الهواء أو النبضات أو الحرارة المحيطة أو تفاوت التصنيع. راجع معيار IPC الحالي المناسب واطلب مراجعة هندسية للتصاميم الحقيقية. قد يتطلب نص المعيار شراءه. يعمل محليًا ولا يرفع البيانات.',
    formulaNote: 'النموذج: I = k × ΔT^0.44 × A^0.725. العرض = A ÷ سماكة النحاس.', sourceLink: 'دليل معايير IPC', resultWidth: 'عرض المسار المقدّر', resultCurrent: 'التيار المقدّر', resultMil: 'العرض (mil)', resultMm: 'العرض (mm)', resultArea: 'مقطع النحاس (mil²)', resultModel: 'النموذج والطبقة',
  },
  actions: { calculate: 'قدّر', example: 'تحميل مثال', reset: 'مسح', copy: 'نسخ النتائج', result: 'تقدير مسار PCB' },
  messages: { copied: 'نُسخت النتائج.', copyUnavailable: 'النسخ غير متاح في هذا المتصفح.', calculated: 'اكتمل التقدير.', checkInputs: 'أدخل قيمًا موجبة للتيار والنحاس والعرض وارتفاع الحرارة ضمن الحدود.', externalModel: 'نحاس خارجي · k=0.048', internalModel: 'نحاس داخلي · k=0.024' },
  additionalFaqs: [
    { question: 'ما المعادلة التي تستخدمها حاسبة مسار PCB؟', answer: 'تستخدم العلاقة التجريبية التقليدية IPC-2221: I = k × ΔT^0.44 × A^0.725، حيث التيار بالأمبير وارتفاع الحرارة بالدرجة المئوية ومساحة المقطع بالميل المربع. تختلف قيمة k للموصل الخارجي والداخلي.' },
    { question: 'لماذا يختلف التقدير بين المسار الداخلي والخارجي؟', answer: 'يستخدم النموذج التقليدي ثوابت تجريبية مختلفة للموصلات الداخلية والخارجية. يعتمد انتقال الحرارة الحقيقي أيضًا على طبقات اللوحة ومستويات النحاس والهواء والتصنيع، ولا تحاكيها هذه الأداة البسيطة.' },
    { question: 'هل هذا عرض آمن أو تصميم متوافق مع IPC؟', answer: 'لا. إنه تقدير تعليمي تقريبي، وليس اعتمادًا أو ضمانًا للسلامة. استخدم المعيار الحالي المناسب والتحليل الحراري والمراجعة الهندسية للتصميم الحقيقي. تعرض IPC معيارَي IPC-2221 وIPC-2152 في دليلها.' },
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

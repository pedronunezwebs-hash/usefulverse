// One-time static Google Translate drafts. The deployed site has no translation API.
import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { intervalTimerEnglishCopy as source } from '../../src/growth600/locales/interval-timer.en.mjs';

const output = new URL('../../src/growth600/locales/interval-timer-final.mjs', import.meta.url);
const englishOnly = process.env.EN_ONLY === '1';
const targetLocales = process.env.TARGET_LOCALES ? new Set(process.env.TARGET_LOCALES.split(',').map((value) => value.trim()).filter(Boolean)) : null;
const forceLocales = process.env.FORCE_LOCALES ? new Set(process.env.FORCE_LOCALES.split(',').map((value) => value.trim()).filter(Boolean)) : new Set();
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (path.at(-1) !== 'copyLanguage' && path.at(-1) !== 'localizationStatus') paths.push(path); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function get(path) { return path.reduce((parent, key) => parent[key], source); }
function set(path, value, object) {
  let parent = object;
  for (const key of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(key)] : parent[key];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value;
}
function truncate(value, limit) { return value.length <= limit ? value : `${value.slice(0, limit - 1).replace(/\s+\S*$/u, '')}…`; }
async function translate(locale, phrases, start) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', locale === 'zh_tw' ? 'zh-TW' : locale); url.searchParams.set('dt', 't');
  const markers = phrases.map((_, index) => `QZINT${(start + index).toString(36).toUpperCase()}XQZ`);
  url.searchParams.set('q', phrases.map((phrase, index) => `${markers[index]} ${phrase.replaceAll('UsefulVerse', 'UVBRANDTOKENX')} ${markers[index]}`).join('\n'));
  const response = await fetch(url, { signal: AbortSignal.timeout(45_000) });
  if (!response.ok) throw new Error(`Google Translate returned HTTP ${response.status}`);
  const translated = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('');
  return markers.map((marker, index) => {
    const begin = translated.indexOf(marker); const end = begin < 0 ? -1 : translated.indexOf(marker, begin + marker.length);
    let value = begin >= 0 && end >= 0 ? translated.slice(begin + marker.length, end).trim() : '';
    value = value.replaceAll('UVBRANDTOKENX', 'UsefulVerse').replace(/[\r\n\t]+/gu, ' ').replace(/ {2,}/gu, ' ').trim();
    if ((!value || /^[\p{P}\p{S}\s]*$/u.test(value)) && phrases[index].length <= 28) value = phrases[index];
    if (!value) throw new Error(`Empty translation for ${locale}, source phrase ${start + index}`);
    return value;
  });
}

collect(source);
const pathsToTranslate = paths;
const preserveExisting = englishOnly || Boolean(targetLocales) || forceLocales.size > 0;
const result = preserveExisting
  ? { ...(await import(`${output.href}?preserve=${Date.now()}`)).default, en: { ...structuredClone(source), localizationStatus: 'approved' } }
  : { en: { ...structuredClone(source), localizationStatus: 'approved' } };
for (const locale of Object.keys(locales)) {
  if (locale === 'en' || englishOnly || (targetLocales && !targetLocales.has(locale)) || (result[locale] && !forceLocales.has(locale))) continue;
  const copy = structuredClone(source);
  const values = pathsToTranslate.map((path) => get(path));
  for (let start = 0; start < values.length;) {
    let end = start; let requestLength = 0;
    while (end < values.length && requestLength + values[end].length + 48 <= 4_400) {
      requestLength += values[end].length + 48; end += 1;
    }
    if (end === start) throw new Error(`One source string exceeds the translation request limit: ${start}`);
    const chunk = await translate(locale, values.slice(start, end), start);
    chunk.forEach((value, index) => set(pathsToTranslate[start + index], value, copy));
    start = end;
  }
  if (locale === 'ar') {
    copy.fields.accuracyNote = 'لأفضل دقة، اترك الصفحة مفتوحة والجهاز نشطًا. قد تؤخر المتصفحات المؤقتات والصوت في علامات التبويب الخلفية أو عند نوم الجهاز. الصوت اختياري ويبدأ بعد الضغط على بدء؛ ولا يحتاج إلى إذن الإشعارات.';
    copy.fields.workSeconds = 'مدة العمل (بالثواني)'; copy.fields.restSeconds = 'مدة الراحة (بالثواني؛ 0 لإيقافها)';
    copy.fields.rounds = 'الجولات (1–99)'; copy.fields.prepSeconds = 'العد التنازلي للاستعداد (ثوانٍ؛ اختياري)';
    copy.fields.phaseLabel = 'المرحلة'; copy.fields.roundLabel = 'الجولة'; copy.fields.progressLabel = 'التقدم';
    copy.fields.sound = 'إشارات صوتية'; copy.fields.soundHint = 'تشغيل صوت قصير عند تغيير المرحلة وعند الانتهاء';
    copy.actions = { start: 'بدء', pause: 'إيقاف مؤقت', resume: 'استئناف', reset: 'إعادة تعيين' };
    copy.messages = { started: 'بدأت الجلسة.', paused: 'تم إيقاف المؤقت مؤقتًا.', resumed: 'استؤنف المؤقت.', reset: 'تمت إعادة تعيين المؤقت.', finished: 'اكتملت الجلسة. أحسنت!', checkInputs: 'أدخل أعدادًا صحيحة ضمن الحدود واختر من 1 إلى 99 جولة.', workCue: 'وقت العمل.', restCue: 'وقت الراحة.', prepCue: 'استعد.', soundUnavailable: 'الصوت غير متاح في هذا المتصفح؛ يظل المؤقت يعمل.' };
  }
  const suffix = ' | UsefulVerse';
  const title = copy.title.replace(/\s*[|｜]\s*UsefulVerse.*$/iu, '').trim();
  copy.title = `${truncate(title, 60 - suffix.length)}${suffix}`;
  copy.description = truncate(copy.description, 160);
  copy.copyLanguage = locale;
  copy.localizationStatus = 'machine-accepted';
  copy.localizationAcceptedBy = 'site-owner';
  copy.localizationAcceptedAt = '2026-10-11';
  result[locale] = copy;
  console.log(`Translated ${locale}`);
}
await writeFile(output, `// Generated one-time translation drafts; no runtime translation service.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
console.log(`Wrote ${Object.keys(result).length} locale copies to ${output.pathname}`);

// One-time static Google Translate drafts; the published site never calls a translator.
import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { julianDateConverterEnglishCopy as source } from '../../src/growth600/locales/julian-date-converter.en.mjs';

const target = new URL('../../src/growth600/locales/julian-date-converter-final.mjs', import.meta.url);
const targetLocales = process.env.TARGET_LOCALES ? new Set(process.env.TARGET_LOCALES.split(',').map((locale) => locale.trim()).filter(Boolean)) : null;
const forceLocales = process.env.FORCE_LOCALES ? new Set(process.env.FORCE_LOCALES.split(',').map((locale) => locale.trim()).filter(Boolean)) : new Set();
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (path.at(-1) !== 'copyLanguage') paths.push(path); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function setAtPath(object, path, value) {
  let parent = object;
  for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value;
}
function truncate(value, limit) { return value.length <= limit ? value : `${value.slice(0, limit - 1).replace(/\s+\S*$/u, '')}…`; }
function normalize(copy) {
  const suffix = ' | UsefulVerse';
  const title = copy.title.replace(/\s*[|｜]\s*UsefulVerse.*$/iu, '').trim();
  copy.title = `${truncate(title, 60 - suffix.length)}${suffix}`;
  copy.description = truncate(copy.description, 160);
  return copy;
}
collect(source);
const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));
const marker = (index) => `QZXV${index.toString(36).toUpperCase()}VXQZ`;

async function request(url) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (response.ok) return response;
      lastError = new Error(`Google Translate returned HTTP ${response.status}`);
      if (response.status < 500 && response.status !== 429) break;
    } catch (error) { lastError = error; }
    await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
  }
  throw lastError;
}

async function translate(locale, group, start) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', locale === 'zh_tw' ? 'zh-TW' : locale); url.searchParams.set('dt', 't');
  const markers = group.map((_, index) => marker(start + index));
  url.searchParams.set('q', group.map((text, index) => `${markers[index]} ${text.replaceAll('UsefulVerse', 'UVBRANDTOKENX')} ${markers[index]}`).join('\n'));
  const response = await request(url);
  const translated = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('');
  return Promise.all(markers.map(async (token, index) => {
    const begin = translated.indexOf(token);
    const end = begin < 0 ? -1 : translated.indexOf(token, begin + token.length);
    let value = begin >= 0 && end >= 0 ? translated.slice(begin + token.length, end).trim() : '';
    if (!value) {
      const open = `QZXVBEGIN${start + index}VXQZ`; const close = `QZXVEND${start + index}VXQZ`;
      const retryUrl = new URL(url); retryUrl.searchParams.set('q', `${open} ${group[index].replaceAll('UsefulVerse', 'UVBRANDTOKENX')} ${close}`);
      const retry = await request(retryUrl);
      const retryText = ((await retry.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('');
      const retryBegin = retryText.indexOf(open); const retryEnd = retryText.indexOf(close, retryBegin + open.length);
      if (retryBegin < 0) throw new Error(`Google Translate lost markers for ${locale}, phrase ${start + index}`);
      value = retryText.slice(retryBegin + open.length, retryEnd >= 0 ? retryEnd : undefined).trim();
    }
    value = value.replace(/UVBRANDTOKENX/giu, 'UsefulVerse').replace(/[\r\n\t]+/gu, ' ').replace(/ {2,}/gu, ' ').trim();
    if (group[index] === 'Reset' && (!value || /^[\p{P}\p{S}\s]*$/u.test(value) || /(?:\b(?:the|of|after)|на|ang)\s*$/iu.test(value))) {
      value = ({ ar: 'إعادة تعيين', bg: 'Нулиране', ca: 'Restableix', de: 'Zurücksetzen', el: 'Επαναφορά', es: 'Restablecer', fa: 'بازنشانی', fr: 'Réinitialiser', gu: 'રીસેટ કરો', ha: 'Sake saitawa', hi: 'रीसेट', id: 'Atur ulang', it: 'Reimposta', ja: 'リセット', ko: '재설정', ms: 'Tetapkan semula', mr: 'रीसेट', nl: 'Opnieuw instellen', pl: 'Resetuj', pt: 'Redefinir', ru: 'Сбросить', sv: 'Återställ', ta: 'மீட்டமை', te: 'రీసెట్ చేయండి', th: 'รีเซ็ต', tl: 'I-reset', tr: 'Sıfırla', uk: 'Скинути', ur: 'ری سیٹ', vi: 'Đặt lại', zh: '重置', zh_tw: '重設', bn: 'রিসেট', sw: 'Weka upya', am: 'ዳግም አስጀምር' })[locale];
    }
    if (!value && group[index].length <= 24) {
      value = group[index];
      console.warn(`${locale}: kept a short standard label in English: ${group[index]}`);
    }
    if (!value) throw new Error(`Google Translate returned empty text for ${locale}, phrase ${start + index}`);
    return value;
  }));
}

let result = { en: { ...structuredClone(source), localizationStatus: 'approved' } };
if (targetLocales) result = { ...(await import(`${target.href}?preserve=${Date.now()}`)).default };
for (const locale of Object.keys(locales)) {
  if (locale === 'en' || (targetLocales && !targetLocales.has(locale))) continue;
  if (result[locale] && !forceLocales.has(locale)) continue;
  const copy = structuredClone(source);
  for (let start = 0; start < phrases.length; start += 6) {
    const translated = await translate(locale, phrases.slice(start, start + 6), start);
    translated.forEach((value, index) => setAtPath(copy, paths[start + index], value));
  }
  if (locale === 'ar') {
    copy.fields.accuracyNote = 'يعتمد على التقويم الغريغوري الاستباقي والتوقيت العالمي UTC، ولا يمثل الثواني الكبيسة. يبدأ JD عند الظهر؛ MJD = JD − 2,400,000.5. يُقرَّب التحويل العكسي إلى أقرب ميلي ثانية. السنوات المدعومة: 0001–9999.';
    copy.actions.reset = 'إعادة تعيين';
    copy.messages.calculated = 'اكتمل التحويل.';
    copy.messages.exampleLoaded = 'تم تحميل المثال.';
    copy.messages.jd = 'التاريخ اليولياني (JD)';
    copy.messages.mjd = 'التاريخ اليولياني المعدل (MJD)';
    copy.messages.utc = 'التاريخ والوقت بتوقيت UTC';
    copy.messages.calendarValue = 'التقويم الغريغوري الاستباقي';
    copy.messages.timeScale = 'المقياس الزمني';
  }
  copy.localizationStatus = 'machine-accepted'; copy.localizationAcceptedBy = 'site-owner'; copy.localizationAcceptedAt = '2026-10-11';
  copy.copyLanguage = locale;
  result[locale] = normalize(copy);
  await writeFile(target, `// Static machine-translated drafts; no translation runs on the published site.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
  console.log(`${locale}: translated ${phrases.length} strings`);
}
await writeFile(target, `// Static machine-translated drafts; no translation runs on the published site.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
console.log(`Wrote ${Object.keys(result).length} static locale copies.`);

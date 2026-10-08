// One-time Google Translate static drafts; no translation service runs on the published site.
import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { decibelCalculatorEnglishCopy as source } from '../../src/growth600/locales/decibel-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/decibel-calculator.mjs', import.meta.url);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') {
    if (!['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt'].includes(path.at(-1))) paths.push(path);
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function setAtPath(object, path, value) {
  let node = object;
  for (const part of path.slice(0, -1)) node = Array.isArray(node) ? node[Number(part)] : node[part];
  if (Array.isArray(node)) node[Number(path.at(-1))] = value; else node[path.at(-1)] = value;
}
function targetCode(language) { return language === 'zh_tw' ? 'zh-TW' : language === 'pt' ? 'pt-BR' : language; }
function normalize(copy, language) {
  const titleOverrides = {
    es: 'Calculadora de decibelios gratis | UsefulVerse', fr: 'Calculateur de décibels gratuit | UsefulVerse',
    pt: 'Calculadora de decibéis grátis | UsefulVerse', it: 'Calcolatore di decibel gratis | UsefulVerse',
    ca: 'Calculadora de decibels gratuïta | UsefulVerse',
    zh: '免费分贝计算器 | UsefulVerse', zh_tw: '免費分貝計算器 | UsefulVerse',
    ja: '無料デシベル計算機 | UsefulVerse',
  };
  if (titleOverrides[language]) copy.title = titleOverrides[language];
  const resetLabels = {
    en: 'Reset values', es: 'Restablecer valores', fr: 'Réinitialiser les valeurs', pt: 'Redefinir valores', de: 'Werte zurücksetzen', ja: '値をリセット', ko: '값 초기화', id: 'Atur ulang nilai', hi: 'मान रीसेट करें', ar: 'إعادة ضبط القيم', zh: '重置数值', bn: 'মান রিসেট করুন', ru: 'Сбросить значения', ur: 'قدریں دوبارہ ترتیب دیں', tr: 'Değerleri sıfırla', vi: 'Đặt lại giá trị', it: 'Reimposta i valori', zh_tw: '重設數值', bg: 'Нулиране на стойностите', ca: 'Restableix els valors', nl: 'Waarden herstellen', el: 'Επαναφορά τιμών', ms: 'Tetapkan semula nilai', pl: 'Resetuj wartości', sv: 'Återställ värden', th: 'รีเซ็ตค่า', uk: 'Скинути значення', sw: 'Weka upya thamani', mr: 'मूल्ये रीसेट करा', te: 'విలువలను రీసెట్ చేయండి', ha: 'Sake saita ƙimomi', tl: 'I-reset ang mga value', ta: 'மதிப்புகளை மீட்டமைக்கவும்', fa: 'بازنشانی مقادیر', am: 'እሴቶችን ዳግም አስጀምር', gu: 'મૂલ્યો રીસેટ કરો',
  };
  copy.actions.reset = resetLabels[language] ?? 'Reset values';
  const suffix = ' | UsefulVerse';
  if (!copy.title.endsWith(suffix)) copy.title = `${copy.title.replace(/\s*\|\s*UsefulVerse.*$/u, '').trim()}${suffix}`;
  if (Array.from(copy.title).length > 60) {
    const maxPrefix = 60 - Array.from(suffix).length;
    const prefix = Array.from(copy.title.slice(0, copy.title.length - suffix.length)).slice(0, maxPrefix).join('').replace(/\s+\S*$/u, '').trimEnd();
    copy.title = `${prefix}${suffix}`;
  }
  if (language !== 'en') {
    if (copy.description.length > 160) copy.description = `${Array.from(copy.description).slice(0, 157).join('').replace(/\s+\S*$/u, '')}…`;
    copy.localizationStatus = 'machine-accepted'; copy.localizationAcceptedBy = 'site-owner'; copy.localizationAcceptedAt = '2026-10-09';
  } else copy.localizationStatus = 'approved';
  copy.copyLanguage = language;
  return copy;
}
collect(source);
const phrases = paths.map((path) => path.reduce((value, key) => value[key], source));
async function translate(language, batch) {
  const rows = batch.map((phrase) => {
    const tokens = [];
    let text = phrase.replace(/\{[a-z][a-zA-Z0-9]*\}/gu, (match) => { const token = `UVDB${tokens.length}TOKENX`; tokens.push([token, match]); return token; });
    text = text.replaceAll('UsefulVerse', () => { const token = `UVDB${tokens.length}TOKENX`; tokens.push([token, 'UsefulVerse']); return token; });
    return { text, tokens };
  });
  const url = new URL('https://clients5.google.com/translate_a/t');
  url.searchParams.set('client', 'dict-chrome-ex'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', targetCode(language)); url.searchParams.set('dt', 't');
  for (const { text } of rows) url.searchParams.append('q', text);
  const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
  if (!response.ok) throw new Error(`Translation request failed for ${language}: HTTP ${response.status}`);
  const values = await response.json();
  if (!Array.isArray(values) || values.length !== rows.length) throw new Error(`Unexpected translation response for ${language}.`);
  return values.map((value, index) => {
    let result = typeof value === 'string' ? value.trim() : '';
    for (const [token, original] of rows[index].tokens) {
      if (result.split(token).length - 1 !== rows[index].text.split(token).length - 1) return batch[index];
      result = result.replaceAll(token, original);
    }
    return result || batch[index];
  });
}

const copies = {};
for (const language of Object.keys(locales)) {
  if (language === 'en') { copies.en = normalize(structuredClone(source), 'en'); continue; }
  const translated = [];
  for (let start = 0; start < phrases.length; start += 12) translated.push(...await translate(language, phrases.slice(start, start + 12)));
  const draft = structuredClone(source);
  paths.forEach((path, index) => setAtPath(draft, path, translated[index]));
  copies[language] = normalize(draft, language);
  console.log(`${language}: translated ${phrases.length} strings`);
}
await writeFile(target, `// Static machine-translated drafts; no translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
console.log(`Wrote ${Object.keys(copies).length} locale drafts (${phrases.length} source strings each).`);

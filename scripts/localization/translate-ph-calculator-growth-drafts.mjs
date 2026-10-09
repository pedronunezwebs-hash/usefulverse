// One-time static machine translation through Google's free web endpoint.
// This script never runs in production and writes only the checked-in drafts.
import { writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { locales } from '../../src/locales.mjs';
import { phCalculatorEnglishCopy as source } from '../../src/growth600/locales/ph-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/ph-calculator.mjs', import.meta.url);
const separator = '###PHCALC219843###';
const run = promisify(execFile);
const targetCodes = { zh_tw: 'zh-TW', pt_br: 'pt', zh: 'zh-CN' };
const localeCode = (key) => targetCodes[key] ?? key.replace('_', '-');
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') {
    if (!['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt'].includes(path.at(-1))) paths.push(path);
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function setAtPath(object, path, value) {
  let parent = object;
  for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value;
  else parent[path.at(-1)] = value;
}
function getAtPath(object, path) { return path.reduce((parent, key) => parent?.[Array.isArray(parent) ? Number(key) : key], object); }
function normalize(copy) {
  const suffix = ' | UsefulVerse'; const maxTitle = 60 - [...suffix].length;
  let prefix = [...String(copy.title).split('|', 1)[0].trim()].slice(0, maxTitle).join('').trimEnd();
  if ([...String(copy.title).split('|', 1)[0].trim()].length > maxTitle) prefix = prefix.slice(0, Math.max(0, prefix.lastIndexOf(' '))).trimEnd();
  copy.title = `${prefix}${suffix}`;
  if ([...copy.description].length > 160) copy.description = `${[...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '')}...`;
  return copy;
}
async function translateBatch(locale, phrases) {
  const url = new URL('https://translate.google.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', localeCode(locale)); url.searchParams.set('dt', 't');
  url.searchParams.set('q', phrases.join(`\n${separator}\n`));
  const { stdout } = await run('curl', ['-fsS', '--connect-timeout', '5', '--max-time', '30', '--retry', '3', '--retry-delay', '3', '--retry-all-errors', url.href], { maxBuffer: 2 * 1024 * 1024, timeout: 120_000 });
  const body = JSON.parse(stdout);
  const translated = Array.isArray(body?.[0]) ? body[0].map((part) => part?.[0] ?? '').join('') : '';
  const values = translated.split(`\n${separator}\n`);
  if (values.length !== phrases.length) throw new Error(`Translation response split mismatch: ${locale}`);
  return values.map((value, index) => value.trim() || phrases[index]);
}
function preserveTerms(value) {
  if (typeof value === 'string') return value.replace(/pH|pOH|Ka|Kb|mol\/L|25 °C|UsefulVerse/giu, (term) => ({ ph: 'pH', poh: 'pOH', ka: 'Ka', kb: 'Kb', 'mol/l': 'mol/L', '25 °c': '25 °C', usefulverse: 'UsefulVerse' })[term.toLowerCase()]);
  if (Array.isArray(value)) return value.map(preserveTerms);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, preserveTerms(child)]));
  return value;
}
const titles = {
  es: 'Calculadora de pH gratis e ilimitada', fr: 'Calculateur pH gratuit et sans limite', pt: 'Calculadora de pH grátis e ilimitada',
  de: 'pH-Rechner kostenlos und unbegrenzt', ja: '無料・無制限のpH計算機', ko: '무료 무제한 pH 계산기', id: 'Kalkulator pH gratis tanpa batas',
  hi: 'मुफ़्त और असीमित pH कैलकुलेटर', ar: 'حاسبة pH مجانية بلا حدود', zh: '免费且不限次数的 pH 计算器', bn: 'বিনামূল্যে সীমাহীন pH ক্যালকুলেটর', ru: 'Бесплатный калькулятор pH без лимита',
  ur: 'مفت اور لامحدود pH کیلکولیٹر', tr: 'Ücretsiz ve sınırsız pH hesaplayıcı', vi: 'Máy tính pH miễn phí, không giới hạn', it: 'Calcolatore pH gratis e illimitato',
  zh_tw: '免費且不限次數的 pH 計算器', bg: 'Безплатен и неограничен pH калкулатор', ca: 'Calculadora de pH gratuïta i il·limitada', nl: 'Gratis pH-calculator zonder limiet',
  el: 'Δωρεάν υπολογιστής pH χωρίς όρια', ms: 'Kalkulator pH percuma tanpa had', pl: 'Darmowy kalkulator pH bez limitu', sv: 'Gratis pH-kalkylator utan gräns',
  th: 'เครื่องคำนวณ pH ฟรี ไม่จำกัด', uk: 'Безкоштовний калькулятор pH без обмежень', sw: 'Kikokotoo cha pH bila malipo, bila kikomo', mr: 'मोफत आणि अमर्यादित pH कॅल्क्युलेटर',
  te: 'ఉచిత అపరిమిత pH కాలిక్యులేటర్', ha: 'Kalkuletan pH kyauta ba tare da iyaka ba', tl: 'Libreng pH calculator na walang limitasyon', ta: 'இலவச வரம்பற்ற pH கணிப்பான்',
  fa: 'ماشین‌حساب pH رایگان و نامحدود', am: 'ነፃ ያልተገደበ pH ማስያ', gu: 'મફત અને અમર્યાદિત pH કેલ્ક્યુલેટર',
};
const names = { zh: 'pH 计算器', zh_tw: 'pH 計算器', ha: 'Lissafin pH', tl: 'Kalkulador ng pH' };
function improveLocale(copy, locale) {
  Object.assign(copy.messages, { pH: 'pH', pOH: 'pOH' });
  if (locale === 'es') Object.assign(copy.fields, { strongAcid: 'Ácido monoprótico fuerte', weakAcid: 'Ácido monoprótico débil', weakBase: 'Base débil', equilibriumConstant: 'Constante de equilibrio (Ka o Kb)' });
  if (locale === 'ar') Object.assign(copy.fields, { strongAcid: 'حمض أحادي البروتون قوي', strongBase: 'قاعدة قوية', weakAcid: 'حمض أحادي البروتون ضعيف', weakBase: 'قاعدة ضعيفة', equilibriumConstant: 'ثابت الاتزان (Ka أو Kb)' });
  if (locale === 'ja') Object.assign(copy.fields, { equilibriumConstant: '平衡定数（Ka または Kb）' });
  if (locale === 'zh') Object.assign(copy.fields, { equilibriumConstant: '平衡常数（Ka 或 Kb）' });
  if (locale === 'zh_tw') Object.assign(copy.fields, { equilibriumConstant: '平衡常數（Ka 或 Kb）' });
  if (locale === 'ru') Object.assign(copy.fields, { equilibriumConstant: 'Константа равновесия (Ka или Kb)' });
  if (locale === 'hi') Object.assign(copy.fields, { equilibriumConstant: 'संतुलन स्थिरांक (Ka या Kb)' });
  if (titles[locale]) copy.title = `${titles[locale]} | UsefulVerse`;
  if (names[locale]) copy.name = names[locale];
  else if (locale !== 'en' && copy.name === source.name) copy.name = String(copy.title).split('|', 1)[0].trim();
  return copy;
}
collect(source);
let copies = {};
try { copies = { ...(await import(`${target.href}?resume=${Date.now()}`)).default }; } catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }
async function save() { await writeFile(target, `// Static machine-translated drafts; translation services are not called on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`); }
for (const locale of Object.keys(locales)) {
  if (locale !== 'en' && copies[locale]?.intro && copies[locale].intro !== source.intro) {
    copies[locale] = preserveTerms(normalize(improveLocale(structuredClone(copies[locale]), locale)));
    await save();
    console.log(`${locale}: translation already present; skipped`);
    continue;
  }
  const copy = structuredClone(source);
  if (locale !== 'en') {
    const missingPaths = paths;
    let batch = []; let chars = 0;
    for (const path of missingPaths) {
      const phrase = path.reduce((parent, key) => parent[key], source); const cost = [...phrase].length + [...separator].length + 2;
      if (batch.length && chars + cost > 3_000) {
        const translated = await translateBatch(locale, batch.map((item) => item.phrase));
        batch.forEach((item, index) => setAtPath(copy, item.path, translated[index])); batch = []; chars = 0;
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      batch.push({ path, phrase }); chars += cost;
    }
    if (batch.length) {
      const translated = await translateBatch(locale, batch.map((item) => item.phrase));
      batch.forEach((item, index) => setAtPath(copy, item.path, translated[index]));
    }
  }
  copy.copyLanguage = locale;
  if (locale !== 'en') Object.assign(copy, { localizationStatus: 'machine-accepted', localizationAcceptedBy: 'site-owner', localizationAcceptedAt: '2026-10-09' });
  copies[locale] = preserveTerms(normalize(improveLocale(copy, locale)));
  await save();
  console.log(`${locale}: ${locale === 'en' ? 'source saved' : 'static translation draft generated'}`);
}

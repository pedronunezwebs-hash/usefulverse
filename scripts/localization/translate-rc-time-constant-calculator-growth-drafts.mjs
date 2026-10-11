// One-time machine-translated locale drafts. The published site makes no translation requests.
import { rename, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { rcTimeConstantCalculatorEnglishCopy as source } from '../../src/growth600/locales/rc-time-constant-calculator.en.mjs';

const output = new URL('../../src/growth600/locales/rc-time-constant-calculator-final.mjs', import.meta.url);
const ignored = new Set(['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt', 'title']);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (!ignored.has(path.at(-1))) paths.push(path); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function get(path, object = source) { return path.reduce((value, key) => Array.isArray(value) ? value[Number(key)] : value[key], object); }
function set(path, value, object) {
  let parent = object;
  for (const key of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(key)] : parent[key];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value;
}
function truncate(value, maximum) {
  if (Array.from(value).length <= maximum) return value;
  return `${Array.from(value).slice(0, maximum - 1).join('').replace(/\s+\S*$/u, '')}…`;
}
const freeWords = {
  es:'gratis',fr:'gratuit',pt:'grátis',de:'kostenlos',ja:'無料',ko:'무료',id:'gratis',hi:'मुफ़्त',ar:'مجانا',zh:'免费',bn:'বিনামূল্যে',ru:'бесплатно',ur:'مفت',tr:'ücretsiz',vi:'miễn phí',it:'gratis',zh_tw:'免費',bg:'безплатно',ca:'gratuït',nl:'gratis',el:'δωρεάν',ms:'percuma',pl:'za darmo',sv:'gratis',th:'ฟรี',uk:'безкоштовно',sw:'bure',mr:'मोफत',te:'ఉచితం',ha:'kyauta',tl:'libre',ta:'இலவசம்',fa:'رایگان',am:'ነፃ',gu:'મફત',he:'חינם',ro:'gratuit',cs:'zdarma',hu:'ingyenes',da:'gratis',no:'gratis',fi:'ilmainen',sr:'besplatno',hr:'besplatno',sk:'zadarmo',fil:'libre',my:'အခမဲ့',km:'ឥតគិតថ្លៃ',lo:'ຟຣີ',ne:'निःशुल्क',si:'නොමිලේ',af:'gratis',az:'pulsuz',uz:'bepul',kk:'тегін',be:'бясплатна',et:'tasuta',lv:'bez maksas',lt:'nemokamai',is:'ókeypis',ga:'saor in aisce',sq:'falas',mk:'бесплатно',bs:'besplatno',eu:'doan',gl:'gratuíto',cy:'am ddim',yi:'פֿרײַ',ps:'وړیا',ku:'بەخۆڕایی',so:'bilaash',yo:'ọfẹ',ig:'n\'efu',zu:'mahhala',xh:'simahla',or:'ମାଗଣା',pa:'ਮੁਫ਼ਤ',ml:'സൗജന്യം',kn:'ಉಚಿತ',as:'বিনামূলীয়া',jv:'gratis',su:'gratis',ceb:'libre',haw:'manuahi',ht:'gratis',la:'gratis',mn:'үнэгүй',tt:'бушлай',ug:'ھەقسىز',sd:'مفت',ckb:'بەخۆڕایی',prs:'رایگان',dv:'މިއަދު',mi:'kore utu',lb:'gratis',mt:'b’xejn',eo:'senpaga',br:'digoust',co:'gratis',gd:'saor',fy:'fergees',ny:'kwaulere',rw:'ubuntu',sn:'mahara',st:'mahala',tn:'mahala',ts:'mahala',ve:'mahala',wo:'gratis',om:'bilisaa',ti:'ብነጻ',tg:'ройгон',ky:'акысыз',hy:'անվճար',ka:'უფასო'
};
const symbols = Object.freeze({ ohms:'Ω', kiloohms:'kΩ', megaohms:'MΩ', farads:'F', millifarads:'mF', microfarads:'μF', nanofarads:'nF', picofarads:'pF', seconds:'s', milliseconds:'ms', microseconds:'μs' });
const nameOverrides = Object.freeze({
  el: 'Υπολογιστής σταθεράς χρόνου RC', sv: 'RC-tidskonstantkalkylator',
  sw: 'Kikokotoo cha muda wa RC', fa: 'ماشین‌حساب ثابت زمانی RC',
  ha: 'Kalkuleta na lokacin da’irar RC', tl: 'Kalkulador ng constant ng oras ng RC',
});
function makeTitle(copy, locale) {
  const suffix = ' | UsefulVerse';
  copy.title = `${truncate(`${copy.name} ${freeWords[locale] ?? 'Free'}`, 60 - Array.from(suffix).length)}${suffix}`;
}
function preserveUnits(copy, original) {
  for (const [key, symbol] of Object.entries(symbols)) {
    const translated = copy.fields[key].replace(/\s*[（(].*[）)]\s*$/u, '').trim();
    const fallback = original.fields[key].replace(/\s*[（(].*[）)]\s*$/u, '').trim();
    copy.fields[key] = `${translated || fallback} (${symbol})`;
  }
}

async function translateChunk(locale, phrases, offset) {
  const target = locale === 'zh_tw' ? 'zh-TW' : locale === 'tl' ? 'fil' : locale;
  const markers = phrases.map((_, index) => `QZRCT${(offset + index).toString(36).toUpperCase()}TRZQ`);
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: target, dt: 't' })) url.searchParams.set(key, value);
  url.searchParams.set('q', phrases.map((phrase, index) => `${markers[index]} ${phrase.replaceAll('UsefulVerse', 'UVBRANDTOKENX')} ${markers[index]}`).join('\n'));
  let response;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
      if (!response.ok) throw new Error(`Google Translate returned HTTP ${response.status} for ${locale}`);
      break;
    } catch (error) { if (attempt === 3) throw error; await new Promise((resolve) => setTimeout(resolve, attempt * 700)); }
  }
  const text = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('');
  return Promise.all(markers.map(async (marker, index) => {
    const start = text.indexOf(marker); const end = start < 0 ? -1 : text.indexOf(markers[index], start + marker.length);
    const value = start >= 0 && end >= 0 ? text.slice(start + marker.length, end).replaceAll('UVBRANDTOKENX', 'UsefulVerse').replace(/[\r\n\t]+/gu, ' ').replace(/ {2,}/gu, ' ').trim() : '';
    return value || await translateSingle(locale, phrases[index]);
  }));
}

async function translateSingle(locale, phrase) {
  const target = locale === 'zh_tw' ? 'zh-TW' : locale === 'tl' ? 'fil' : locale;
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: target, dt: 't', q: phrase.replaceAll('UsefulVerse', 'UVBRANDTOKENX') })) url.searchParams.set(key, value);
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`Google Translate fallback returned HTTP ${response.status} for ${locale}`);
  const value = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('').replaceAll('UVBRANDTOKENX', 'UsefulVerse').replace(/[\r\n\t]+/gu, ' ').replace(/ {2,}/gu, ' ').trim();
  if (!value) throw new Error(`Empty translation for ${locale}, phrase fallback`);
  return value;
}

async function writeProgress(result) {
  const temp = new URL(`${output.href}.tmp`);
  await writeFile(temp, `// One-time Google Translate drafts; no runtime translation service.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
  await rename(temp, output);
}

collect(source);
const values = paths.map((path) => get(path));
const result = { en: structuredClone(source) };
try { Object.assign(result, (await import(`${output.href}?resume=${Date.now()}`)).default); } catch { /* Fresh translation run. */ }
result.en = structuredClone(source);
preserveUnits(result.en, source);
for (const { key: locale } of localeEntries) {
  if (locale === 'en') continue;
  if (result[locale]?.copyLanguage === locale && result[locale]?.localizationStatus === 'machine-accepted') {
    const copy = structuredClone(result[locale]);
    if (!copy.fields.timeUnit) copy.fields.timeUnit = await translateSingle(locale, source.fields.timeUnit);
    if (nameOverrides[locale]) copy.name = nameOverrides[locale];
    makeTitle(copy, locale);
    preserveUnits(copy, source);
    result[locale] = copy;
    await writeProgress(result);
    continue;
  }
  const copy = structuredClone(source);
  for (let start = 0; start < values.length;) {
    let end = start; let size = 0;
    while (end < values.length && size + values[end].length + 48 <= 4_300) { size += values[end].length + 48; end += 1; }
    if (end === start) throw new Error(`Source phrase ${start} exceeds chunk size`);
    const translated = await translateChunk(locale, values.slice(start, end), start);
    translated.forEach((value, index) => set(paths[start + index], value, copy));
    start = end;
  }
  if (nameOverrides[locale]) copy.name = nameOverrides[locale];
  makeTitle(copy, locale);
  copy.description = truncate(copy.description.replace(/\s+/gu, ' ').trim(), 160);
  preserveUnits(copy, source);
  copy.copyLanguage = locale;
  copy.localizationStatus = 'machine-accepted';
  copy.localizationAcceptedBy = 'site-owner';
  copy.localizationAcceptedAt = '2026-10-11';
  result[locale] = copy;
  await writeProgress(result);
  console.log(`Translated ${locale}`);
}
for (const { key } of localeEntries) if (!result[key]) throw new Error(`Missing translation for ${key}`);

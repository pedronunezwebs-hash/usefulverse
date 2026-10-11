// One-time static Google Translate drafts; no translation requests run on the site.
import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { fiveTwentyNineCalculatorEnglishCopy as source } from '../../src/growth600/locales/529-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/529-calculator-final.mjs', import.meta.url);
const targetLocales = process.env.TARGET_LOCALES ? new Set(process.env.TARGET_LOCALES.split(',').map((locale) => locale.trim()).filter(Boolean)) : null;
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
function truncate(text, limit) { return text.length <= limit ? text : `${text.slice(0, limit - 1).replace(/\s+\S*$/u, '')}…`; }
function normalize(copy) {
  const suffix = ' | UsefulVerse';
  const title = copy.title.replace(/\s*[|｜]\s*UsefulVerse.*$/iu, '').trim();
  copy.title = `${truncate(title, 60 - suffix.length)}${suffix}`;
  copy.description = truncate(copy.description, 160);
  return copy;
}
collect(source);
const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));

async function translate(locale, group, start) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', locale === 'zh_tw' ? 'zh-TW' : locale); url.searchParams.set('dt', 't');
  const markerFor = (index) => {
    let value = index + 1;
    let letters = '';
    while (value > 0) { value -= 1; letters = String.fromCharCode(65 + (value % 26)) + letters; value = Math.floor(value / 26); }
    return `QZXV${letters}VXQZ`;
  };
  const markers = group.map((_, index) => markerFor(start + index));
  // Bracket every string. Google Translate moves standalone markers before/after
  // text depending on script direction; a single marker can then shift fields.
  url.searchParams.set('q', group.map((text, index) => `${markers[index]} ${text.replaceAll('UsefulVerse', 'UVBRANDTOKENX')} ${markers[index]}`).join('\n'));
  const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
  if (!response.ok) throw new Error(`Google Translate failed for ${locale}: HTTP ${response.status}`);
  const translated = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('');
  return Promise.all(markers.map(async (marker, index) => {
    const begin = translated.indexOf(marker);
    const end = begin < 0 ? -1 : translated.indexOf(marker, begin + marker.length);
    let value = '';
    if (begin >= 0 && end >= 0) {
      const inner = translated.slice(begin + marker.length, end).trim();
      // Some language models move short labels outside both boundaries (e.g.
      // Korean/German segmentation). Then take text after the closing marker.
      const nextOpen = markers.slice(index + 1).map((nextMarker) => translated.indexOf(nextMarker, end + marker.length)).find((position) => position >= 0) ?? translated.length;
      value = inner || translated.slice(end + marker.length, nextOpen).trim();
    }
    if (!value) {
      // Retry only the broken item with distinct start/end tokens. This keeps
      // one lost marker from shifting the rest of a form's labels.
      const open = `QZXVBEGIN${marker.slice(4, -4)}VXQZ`;
      const close = `QZXVEND${marker.slice(4, -4)}VXQZ`;
      const retryUrl = new URL(url);
      retryUrl.searchParams.set('q', `${open} ${group[index].replaceAll('UsefulVerse', 'UVBRANDTOKENX')} ${close}`);
      const retry = await fetch(retryUrl, { signal: AbortSignal.timeout(25000) });
      if (!retry.ok) throw new Error(`Google Translate retry failed for ${locale}: HTTP ${retry.status}`);
      const retryText = ((await retry.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('');
      const retryBegin = retryText.indexOf(open);
      const retryEnd = retryText.indexOf(close, retryBegin + open.length);
      if (retryBegin < 0) throw new Error(`Google Translate lost both boundary markers for ${locale}, item ${start + index}`);
      value = retryText.slice(retryBegin + open.length, retryEnd >= 0 ? retryEnd : undefined).trim();
    }
    value = value.replace(/UVBRANDTOKENX/giu, 'UsefulVerse').replace(/[\r\n\t]+/gu, ' ').replace(/ {2,}/gu, ' ');
    if (!value) {
      // Google Translate can return only the boundary markers for this short
      // Hausa button label. Use a concise Hausa label instead of a blank.
      if (locale === 'ha' && paths[start + index]?.join('.') === 'actions.reset') {
        value = 'Sake saitawa';
      } else throw new Error(`Google Translate returned empty copy for ${locale}, item ${start + index}`);
    }
    return value;
  }));
}

let result = {};
if (targetLocales) result = { ...(await import(`${target.href}?preserve=${Date.now()}`)).default };
for (const locale of Object.keys(locales)) {
  if (targetLocales && !targetLocales.has(locale)) continue;
  const copy = structuredClone(source);
  if (locale !== 'en') {
    const batches = [];
    for (let start = 0; start < phrases.length; start += 8) batches.push({ start, phrases: phrases.slice(start, start + 8) });
    const translatedBatches = await Promise.all(batches.map(({ start, phrases: group }) => translate(locale, group, start)));
    translatedBatches.forEach((translated, batchIndex) => {
      const start = batches[batchIndex].start;
      translated.forEach((value, index) => setAtPath(copy, paths[start + index], value));
    });
    if (locale === 'ar') {
      copy.fields.scholarshipPerYear = 'قيمة المنحة لكل سنة دراسية (بدولارات وقت الدراسة)';
      copy.fields.accuracyNote = 'تقدير توضيحي فقط. يفترض إيداع المبالغ في نهاية كل شهر، وثبات العائد السنوي الفعلي قبل الرسوم والضرائب قبل الدراسة وأثناءها، ودفع رسوم كل سنة دراسية في بدايتها. كما يفترض استمرار تضخم الرسوم ومنحة ثابتة لكل سنة. لا يشمل السكن والطعام والكتب أو الرسوم الأخرى أو الضرائب أو قواعد الحساب. قد تتغير العوائد والتكاليف. هذا ليس نصيحة استثمارية أو ضريبية أو مالية. راجع شروط الخطة والنفقات المؤهلة.';
      copy.howAnswer = 'أدخل تكلفة الكلية السنوية اليوم، والسنوات حتى الالتحاق، ومدة الدراسة، والمدخرات الحالية، والودائع الشهرية، والعائد المقدر، وتضخم الرسوم، والمنحة السنوية. يقدّر الحاسوب المبلغ اللازم عند بدء الدراسة ثم الإيداع الشهري المطلوب وفق هذه الافتراضات. يفترض دفع رسوم كل سنة دراسية في بدايتها.';
      copy.actions.reset = 'إعادة تعيين';
      copy.messages.calculated = 'تم حساب التقدير.';
      copy.messages.exampleLoaded = 'تم تحميل المثال.';
      copy.messages.scholarships = 'تقدير المنح الدراسية طوال فترة الدراسة';
    }
    if (locale === 'ha') {
      copy.actions.reset = 'Sake saitawa';
      copy.messages.calculated = 'An ƙididdige ƙiyasin.';
      copy.messages.exampleLoaded = 'An loda misali.';
    }
    if (locale === 'hi') copy.messages.monthlyNeeded = 'आज से आवश्यक मासिक जमा राशि';
    if (locale === 'te') copy.messages.scholarships = 'కళాశాల కాలానికి అంచనా వేసిన స్కాలర్‌షిప్‌లు';
    if (locale === 'gu') copy.messages.scholarships = 'કોલેજના સમયગાળાની શિષ્યવૃત્તિનો અંદાજ';
    if (locale === 'ja') copy.actions.example = '例を読み込む';
    if (locale === 'sw') copy.fields.annualCostToday = 'Gharama ya chuo kwa mwaka leo';
    if (locale === 'am') {
      copy.fields.yearsUntilCollege = 'ወደ ኮሌጅ እስኪጀምር ያሉ ዓመታት';
      copy.actions.copy = 'ግምቱን ቅዳ';
    }
    copy.localizationStatus = 'machine-accepted'; copy.localizationAcceptedBy = 'site-owner'; copy.localizationAcceptedAt = '2026-10-11';
  } else copy.localizationStatus = 'approved';
  copy.copyLanguage = locale;
  result[locale] = normalize(copy);
  await writeFile(target, `// Static machine-translated drafts; no translation runs on the published site.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
  console.log(`${locale}: translated ${phrases.length} strings`);
}
console.log(`Wrote ${Object.keys(result).length} localized static copies.`);

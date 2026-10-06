import { readingLogLocaleData } from './reading-log.mjs';
import { readingLogEnglishCopy, readingLogUiKeys } from './reading-log-source.mjs';

// Correct high-impact machine-translation false friends in key labels and titles.
const reviewedTranslations = {
  es: { 'Minutes read today': 'Minutos de lectura de hoy' },
  fr: { 'Minutes read today': 'Minutes de lecture aujourd’hui' },
  pt: { 'Minutes read today': 'Minutos de leitura hoje' },
  de: { 'Minutes read today': 'Heute gelesene Minuten', 'Reading log': 'Lesetagebuch', 'Minutes this week': 'Gelesene Minuten diese Woche', 'Could not save progress. Check the page, minutes and date.': 'Der Fortschritt konnte nicht gespeichert werden. Bitte Seite, Lesezeit und Datum prüfen.' },
  ja: { 'Minutes read today': '今日読んだ時間（分）', 'Reading date': '読書日' },
  ko: { 'Reading log': '독서 기록' },
  id: { 'Reading log': 'Catatan membaca' },
  hi: { 'Minutes read today': 'आज पढ़ने में बिताए मिनट', 'Minutes this week': 'इस सप्ताह पढ़ने के मिनट', 'Reading log': 'पठन लॉग' },
  zh: { 'Minutes this week': '本周阅读分钟数' },
  zh_tw: { 'Minutes this week': '本週閱讀分鐘數' },
  it: { 'Minutes read today': 'Minuti di lettura di oggi', 'Minutes this week': 'Minuti di lettura questa settimana', 'Could not save progress. Check the page, minutes and date.': 'Impossibile salvare i progressi. Controlla la pagina, il tempo di lettura e la data.' },
  nl: { 'Minutes read today': 'Minuten gelezen vandaag', 'Minutes this week': 'Gelezen minuten deze week', 'Could not save progress. Check the page, minutes and date.': 'Voortgang opslaan is niet gelukt. Controleer de pagina, leestijd en datum.' },
  pl: { 'Minutes read today': 'Minuty czytania dzisiaj', 'Reading log': 'Dziennik czytania' },
  sv: { 'Minutes read today': 'Lästa minuter i dag', 'Minutes this week': 'Lästa minuter den här veckan', 'Could not save progress. Check the page, minutes and date.': 'Det gick inte att spara förloppet. Kontrollera sidan, lästiden och datumet.' },
  th: { 'Minutes this week': 'นาทีที่อ่านในสัปดาห์นี้' },
  uk: { 'Minutes read today': 'Хвилин читання сьогодні', 'Reading log': 'Журнал читання' },
  fa: { 'Minutes read today': 'دقایق مطالعه امروز', 'Reading log': 'دفتر ثبت مطالعه' },
  fr: { 'Minutes this week': 'Minutes de lecture cette semaine' },
  ha: { 'Your reading log stays in this browser. Nothing is uploaded.': 'Littafin karatunka yana nan a wannan burauzar. Ba a loda komai ba.' },
  gu: { 'Minutes read today': 'આજે વાંચવામાં વિતાવેલી મિનિટો' },
};

const reviewedCopy = {
  ur: { 5: 'کتابیں، پیش رفت اور مطالعے کے سیشن اسی براؤزر میں رہتے ہیں، جب تک آپ بیک اپ برآمد نہ کریں۔ کوئی اکاؤنٹ یا ہم آہنگی نہیں۔ یہ ذاتی ٹریکر ہے، پڑھنے کی رفتار کا امتحان نہیں۔' },
  am: { 4: 'መጽሐፍ ያክሉ፣ ካነበቡ በኋላ የአሁኑን ገጽ ያዘምኑ፣ እና የሳምንት የገጽ ግብ ያዘጋጁ።' },
};

for (const [language, fixes] of Object.entries(reviewedTranslations)) {
  const data = readingLogLocaleData[language];
  if (!data) continue;
  for (const [source, translated] of Object.entries(fixes)) {
    if (Object.hasOwn(data.ui, source)) data.ui[source] = translated;
    if (source === 'Reading log') data.copy[1] = translated;
  }
}
for (const [language, fixes] of Object.entries(reviewedCopy)) {
  for (const [index, translated] of Object.entries(fixes)) readingLogLocaleData[language].copy[Number(index)] = translated;
}

const englishUi = Object.fromEntries(readingLogUiKeys.map((key) => [key, key]));

export function readingLogContent(language) {
  if (language === 'en') return { ui: englishUi, copy: readingLogEnglishCopy };
  const data = readingLogLocaleData[language];
  if (!data || readingLogUiKeys.some((key) => !data.ui?.[key]?.trim()) || data.copy?.length !== readingLogEnglishCopy.length || data.copy.some((item) => !item?.trim())) {
    throw new Error(`Reading-log translations are incomplete for ${language}.`);
  }
  const ui = Object.fromEntries(readingLogUiKeys.map((key) => [key, data.ui[key]]));
  return { ui, copy: data.copy };
}

import { readFile, writeFile } from 'node:fs/promises';
import { swissQrBillEnglish } from '../../src/markets-no-ch/swiss-qr-bill-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const [inputPath, outputPath = 'src/markets-no-ch/swiss-qr-bill-translations.mjs'] = process.argv.slice(2);
if (!inputPath) throw new Error('Usage: node scripts/localization/build-swiss-qr-translations.mjs <capture.json> [output.mjs]');

function flatten(value, output = []) {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
}

const genericEnglish = new Set(Object.keys(translationsByLocale.es));
const sourceStrings = [...new Set(flatten(swissQrBillEnglish).filter((value) => !genericEnglish.has(value)))];
if (sourceStrings.length !== 69) throw new Error(`Expected 69 Swiss QR-bill strings, found ${sourceStrings.length}`);

const captures = JSON.parse(await readFile(inputPath, 'utf8'));
const expectedLocales = Object.keys(translationsByLocale).sort();
const receivedLocales = Object.keys(captures).sort();
if (JSON.stringify(receivedLocales) !== JSON.stringify(expectedLocales)) {
  throw new Error(`Locale mismatch. Expected ${expectedLocales.length}: ${expectedLocales.join(', ')}; received ${receivedLocales.length}: ${receivedLocales.join(', ')}`);
}

const ids = sourceStrings.map((_, index) => String(index).padStart(3, '0'));
const technicalTokens = ['QR-IBAN', 'IBAN', 'QRR', 'SCOR', 'NON', 'CHF', 'EUR', 'SPC', 'SIX'];
const retainTechnicalTokens = (source, translated) => {
  const required = technicalTokens.filter((token) => source.includes(token));
  return required.reduce((value, token) => value.includes(token) ? value : `${value} (${token})`, translated);
};
const corrections = {
  am: { '010': 'መንገድ ወይም የፖስታ ሳጥን ቁጥር' },
  ar: { '010': 'الشارع أو صندوق البريد' },
  bg: { '010': 'Улица или пощенска кутия' },
  bn: { '010': 'রাস্তার ঠিকানা বা ডাকঘরের বক্স' },
  ca: { '010': 'Carrer o apartat postal' },
  de: { '010': 'Straße oder Postfach' },
  el: { '010': 'Οδός ή Ταχυδρομική Θυρίδα' },
  es: { '010': 'Calle o apartado postal' },
  fa: { '010': 'خیابان یا صندوق پستی' },
  fr: { '010': 'Rue ou boîte postale' },
  gu: { '010': 'શેરી અથવા પોસ્ટ ઑફિસ બોક્સ' },
  ha: {
    '000': 'Mai ƙirƙirar takardar biyan kuɗi ta QR ta Switzerland',
    '001': 'Mai ƙirƙirar Swiss QR-bill — kayan aiki kyauta don ƙirƙirar daftarin QR',
    '004': 'Kayan aikin yana gina bayanan SIX Swiss Payments Code (SPC) kuma yana duba filayensa, haɗin asusu/shawarwari, lambobin duba IBAN da haruffan da aka tallafa. Yana tsara ɓangaren biyan kuɗi da rasit don bugawa a girman da ake buƙata na zahiri.',
    '010': 'Titi ko akwatin gidan waya',
    '056': 'An share fom da samfoti.',
    '057': 'An ɗora samfurin SIX. Sauya bayanan samfurin kafin amfani na gaske.',
    '062': 'QR-IBAN yana amfani da nassoshi na QRR. IBAN na Switzerland na yau da kullun yana amfani da SCOR ko babu nassoshi masu tsari (NON). QRR na biyan kuɗi na CHF ne kawai.',
  },
  hi: { '010': 'सड़क या पोस्ट ऑफिस बॉक्स' },
  id: { '010': 'Jalan atau kotak pos' },
  it: { '010': 'Via o casella postale' },
  ja: { '010': '通りまたは私書箱' },
  ko: { '010': '거리 주소 또는 사서함' },
  mr: { '010': 'रस्ता किंवा पोस्ट बॉक्स' },
  ms: { '010': 'Jalan atau peti surat' },
  nb: { '010': 'Gateadresse eller postboks' },
  nl: { '010': 'Straat of postbus' },
  pl: { '010': 'Ulica lub skrytka pocztowa' },
  pt: { '010': 'Rua ou caixa postal' },
  ru: { '010': 'Улица или абонентский ящик' },
  sv: { '010': 'Gatuadress eller postbox' },
  sw: { '010': 'Mtaa au sanduku la posta' },
  ta: { '010': 'தெரு முகவரி அல்லது அஞ்சல் பெட்டி' },
  te: { '010': 'వీధి లేదా పోస్ట్ ఆఫీస్ బాక్స్' },
  th: { '010': 'ถนนหรือที่อยู่ตู้ไปรษณีย์' },
  tl: { '000': 'Tagapagbuo ng Swiss QR-bill', '010': 'Kalye o kahon ng koreo' },
  tr: { '010': 'Sokak veya posta kutusu adresi' },
  uk: { '010': 'Вулиця або абонентська скринька' },
  ur: { '010': 'گلی یا ڈاک کا پتہ' },
  vi: { '010': 'Đường hoặc hộp thư bưu điện' },
  zh: { '010': '街道或邮政信箱' },
  zh_tw: { '010': '街道或郵政信箱' },
};
const translations = {};
for (const locale of expectedLocales) {
  const pack = { ...captures[locale] };
  Object.assign(pack, corrections[locale] ?? {});
  if (locale === 'zh' && pack['069'] && !pack['059']) {
    pack['059'] = pack['069'];
    delete pack['069'];
  }
  const missing = ids.filter((id) => typeof pack[id] !== 'string' || !pack[id].trim());
  const extra = Object.keys(pack).filter((id) => !ids.includes(id));
  if (missing.length || extra.length) throw new Error(`${locale}: missing ${missing.join(', ') || 'none'}; unexpected ${extra.join(', ') || 'none'}`);
  translations[locale] = Object.fromEntries(ids.map((id, index) => [sourceStrings[index], retainTechnicalTokens(sourceStrings[index], pack[id].trim())]));
}

const body = `const translations = ${JSON.stringify(translations, null, 2)};\nfor (const pack of Object.values(translations)) Object.freeze(pack);\n\nexport const swissQrBillTranslationsByLocale = Object.freeze(translations);\n`;
await writeFile(outputPath, body);
console.log(`Wrote ${outputPath}: ${expectedLocales.length} locale packs × ${sourceStrings.length} strings.`);

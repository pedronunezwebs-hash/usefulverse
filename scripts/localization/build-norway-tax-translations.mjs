import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { english } from '../../src/markets-no-ch/copy-en.mjs';
import { norwayTaxTranslationsByLocale as existingTranslations } from '../../src/markets-no-ch/norway-tax-translations.mjs';

const captureUrl = new URL('../../norway-tax-translation-captures.json', import.meta.url);
const outputUrl = new URL('../../src/markets-no-ch/norway-tax-translations.mjs', import.meta.url);
const extraLocales = [{ key: 'nb', name: 'Norsk bokmål' }];
const locales = [...localeEntries, ...extraLocales];
const copy = english.norwayTax;

function flatten(value, prefix = '', output = []) {
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof child === 'string') output.push([path, child]);
    else if (Array.isArray(child)) child.forEach((item, index) => flatten(item, `${path}.${index}`, output));
    else if (child && typeof child === 'object') flatten(child, path, output);
  }
  return output;
}

const rows = flatten(copy);
if (rows.length !== 43) throw new Error(`Expected 43 source strings, found ${rows.length}.`);

const expected = locales.filter(({ key }) => key !== 'en').map(({ key }) => key);
let captures;
try {
  captures = JSON.parse(await readFile(captureUrl, 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  captures = Object.fromEntries(expected.map((locale) => [
    locale,
    rows.map(([, source]) => existingTranslations[locale]?.[source] ?? ''),
  ]));
}
const missing = expected.filter((key) => !Array.isArray(captures[key]) || captures[key].length !== rows.length);
const unexpected = Object.keys(captures).filter((key) => !expected.includes(key));
if (missing.length || unexpected.length) {
  throw new Error(`Locale capture mismatch. Missing: ${missing.join(', ') || 'none'}; unexpected: ${unexpected.join(', ') || 'none'}.`);
}

const dictionaries = {};
const fixups = {
  ar: { 'Average net per month': 'متوسط صافي الدخل الشهري' },
  am: { 'Average net per month': 'አማካይ ወርሃዊ የተጣራ ገቢ' },
  gu: { 'Average net per month': 'સરેરાશ માસિક ચોખ્ખી આવક' },
  ha: { 'Average net per month': 'Matsakaicin kuɗin shiga bayan haraji a wata' },
  hi: { 'Average net per month': 'औसत मासिक शुद्ध आय' },
  mr: { 'Average net per month': 'सरासरी मासिक निव्वळ उत्पन्न' },
  ms: { 'Average net per month': 'Purata pendapatan bersih bulanan' },
  sw: { 'Bracket tax': 'Kodi ya viwango vya mapato' },
  ta: { 'Average net per month': 'மாதாந்திர சராசரி நிகர வருமானம்' },
  te: { 'Average net per month': 'నెలవారీ సగటు నికర ఆదాయం' },
  th: { 'Average net per month': 'รายได้สุทธิเฉลี่ยต่อเดือน' },
  tl: { 'Bracket tax': 'Buwis sa bawat antas ng kita' },
  ur: { 'Average net per month': 'اوسط ماہانہ خالص آمدنی' },
  vi: { 'Average net per month': 'Thu nhập ròng trung bình mỗi tháng' },
};
for (const locale of expected) {
  const values = captures[locale];
  const invalid = values.flatMap((value, index) => typeof value !== 'string' || !value.trim() ? [index + 1] : []);
  if (invalid.length) throw new Error(`${locale}: empty or invalid rows ${invalid.join(', ')}.`);
  dictionaries[locale] = Object.fromEntries(rows.map(([, source], index) => {
    const cleaned = values[index].replace(/(?:UVROW|UVEND)\d{3}X/gu, '').replaceAll('|', '').replace(/\s+/gu, ' ').trim();
    return [source, fixups[locale]?.[source] ?? cleaned];
  }));
}

const output = `// Static machine-translated strings. Translation is never requested at runtime.\nexport const norwayTaxTranslationsByLocale = Object.freeze(${JSON.stringify(dictionaries)});\n`;
await writeFile(outputUrl, output);
console.log(`Generated ${Object.keys(dictionaries).length} static dictionaries for ${rows.length} Norway tax strings.`);

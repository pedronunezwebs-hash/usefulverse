import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';
import { norwayParentalBenefitEnglish } from '../../src/markets-no-ch/norway-parental-benefit-copy-en.mjs';

const locales = [...localeEntries, { key: 'nb', code: 'nb-NO', name: 'Norsk bokmål', prefix: '/nb' }].filter(({ key }) => key !== 'en');
const capturesUrl = new URL('../../src/markets-no-ch/norway-parental-benefit-translation-captures.json', import.meta.url);
const outputUrl = new URL('../../src/markets-no-ch/norway-parental-benefit-translations.mjs', import.meta.url);
const flatten = (value, result = []) => {
  if (typeof value === 'string') result.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, result));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, result));
  return result;
};
const sources = [...new Set(flatten(norwayParentalBenefitEnglish))];
const common = new Set(Object.keys(translationsByLocale.es));
const unique = sources.filter((source) => !common.has(source));
const captures = JSON.parse(await readFile(capturesUrl, 'utf8'));
const digitMap = Object.fromEntries([...('٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹০১২৩৪৫৬৭৮৯०१२३४५६७८९૦૧૨૩૪૫૬૭૮૯๐๑๒๓๔๕๖๗๘๙౦౧౨౩౪౫౬౭౮౯௦௧௨௩௪௫௬௭௮௯၀၁၂၃၄၅၆၇၈၉០១២៣៤៥៦៧៨៩０１２３４５６７８９٠١٢٣٤٥٦٧٨٩')].map((digit, index) => [digit, String(index % 10)]));
const numbers = (text) => [...text].map((char) => digitMap[char] ?? char).join('').match(/\d+(?:[.,\s\u00a0\u202f]\d+)*/gu)?.map((token) => token.replace(/[.,\s\u00a0\u202f]/gu, '')) ?? [];
const manual = {
  es: {
    [norwayParentalBenefitEnglish.name]: 'Planificador noruego de prestación y permiso parental',
    [norwayParentalBenefitEnglish.title]: 'Permiso parental en Noruega 2026: semanas, cuotas y calendario',
    [norwayParentalBenefitEnglish.description]: 'Planifica las semanas de prestación parental noruega por nacimiento o adopción. Compara la cobertura del 80% y el 100%, distribuye las cuotas, organiza permisos parciales y descarga un calendario privado.',
    [norwayParentalBenefitEnglish.intro]: 'Planificador práctico para organizar fechas, cuotas y tiempo de permiso parental según las reglas de NAV en Noruega. Puedes cambiar el idioma de la interfaz; el país y las reglas siguen siendo Noruega.',
    [norwayParentalBenefitEnglish.limits]: 'Solo para Noruega. Es una ayuda de planificación; no decide el derecho a la prestación, el importe del pago, los derechos laborales frente al empleador ni la solicitud a NAV. La tabla estándar supone que ambos progenitores han generado derecho. Para casos de un solo progenitor, derechos diferentes, actividad, parto prematuro, enfermedad, permisos simultáneos excepcionales, coordinación internacional o cálculo individual de ingresos, consulta NAV.',
    [norwayParentalBenefitEnglish.fields.scope]: 'Reglas noruegas únicamente · tabla de períodos de NAV consultada el 17 de octubre de 2026 · el idioma no cambia el país ni las reglas.',
  },
  nb: {
    [norwayParentalBenefitEnglish.name]: 'Planlegger for foreldrepenger og foreldrepermisjon i Norge',
    [norwayParentalBenefitEnglish.title]: 'Foreldrepermisjon i Norge 2026: uker, kvoter og kalender',
    [norwayParentalBenefitEnglish.description]: 'Planlegg uker med norske foreldrepenger ved fødsel eller adopsjon. Sammenlign 80 og 100 prosent dekning, fordel kvotene, planlegg gradert uttak og last ned en privat kalender.',
    [norwayParentalBenefitEnglish.fields.scope]: 'Bare norske regler · NAVs periodeoversikt kontrollert 17. oktober 2026 · språkvalget endrer ikke land eller regler.',
  },
};
const packs = {};
for (const { key: locale } of locales) {
  const row = captures[locale] ?? {};
  const dictionary = {};
  for (const source of unique) {
    const translated = (manual[locale]?.[source] ?? row[source] ?? '').trim();
    if (!translated) throw new Error(`${locale}: missing translation for ${source}`);
    const expected = numbers(source.replace('61 weeks and 1 day', '61 weeks and one day'));
    const actual = numbers(translated);
    for (const token of expected) {
      const expectedCount = expected.filter((item) => item === token).length;
      const actualCount = actual.filter((item) => item === token).length;
      if (actualCount < expectedCount) {
        throw new Error(`${locale}: protected number ${token} missing: ${source}`);
      }
    }
    dictionary[source] = translated;
  }
  const exactEchoes = unique.filter((source) => dictionary[source] === source);
  if (exactEchoes.length > unique.length * 0.1) throw new Error(`${locale}: too many untranslated strings: ${exactEchoes.join(' | ')}`);
  if (!dictionary[norwayParentalBenefitEnglish.fields.calculate]) throw new Error(`${locale}: calculate label missing`);
  if (new Set(Object.values(dictionary).map((value) => value.toLowerCase())).size < unique.length * 0.65) throw new Error(`${locale}: suspiciously low translation diversity`);
  packs[locale] = dictionary;
}
await writeFile(outputUrl, `// Static interface translations. Norwegian NAV jurisdiction remains explicit in every locale.\nexport const norwayParentalBenefitTranslationsByLocale = Object.freeze(${JSON.stringify(packs)});\n`);
console.log(`Built ${unique.length} tool-specific strings × ${locales.length} locales (${sources.length} English strings; shared site strings inherit the locale dictionaries).`);

import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';
import { norwayChildSupportEnglish } from '../../src/markets-no-ch/norway-child-support-copy-en.mjs';

const locales = [...localeEntries, { key: 'nb', code: 'nb-NO', name: 'Norsk bokmål', prefix: '/nb' }].filter(({ key }) => key !== 'en');
const captures = JSON.parse(await readFile(new URL('../../src/markets-no-ch/norway-child-support-translation-captures.json', import.meta.url), 'utf8'));
const output = new URL('../../src/markets-no-ch/norway-child-support-translations.mjs', import.meta.url);
const flatten = (value, result = []) => {
  if (typeof value === 'string') result.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, result));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, result));
  return result;
};
const sources = [...new Set(flatten(norwayChildSupportEnglish))];
const common = new Set(Object.keys(translationsByLocale.es));
const unique = sources.filter((source) => !common.has(source));
const digitMap = Object.fromEntries([...('٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹০১২৩৪৫৬৭৮৯०१२३४५६७८९૦૧૨૩૪૫૬૭૮૯๐๑๒๓๔๕๖๗๘๙౦౧౨౩౪౫౬౭౮౯௦௧௨௩௪௫௬௭௮௯၀၁၂၃၄၅၆၇၈၉૦១២៣៤៥៦៧៨៩０１２３４５６７８９٠١٢٣٤٥٦٧٨٩')].map((digit, index) => [digit, String(index % 10)]));
const numbers = (text) => [...text].map((char) => digitMap[char] ?? char).join('').match(/\d+(?:[.,\s\u00a0\u202f]\d+)*/gu)?.map((token) => token.replace(/[.,\s\u00a0\u202f]/gu, '')) ?? [];
const manual = {
  es: {
    [norwayChildSupportEnglish.name]: 'Estimador de manutención infantil de Noruega',
    [norwayChildSupportEnglish.title]: 'Calculadora de manutención infantil de Noruega 2026: escenario de acuerdo privado',
    [norwayChildSupportEnglish.description]: 'Explora un escenario mensual simplificado de manutención infantil con las tasas de referencia noruegas de 2026. Indica la edad, los ingresos de cada progenitor, el cuidado infantil, la convivencia y las visitas para ver el cálculo y sus supuestos.',
    [norwayChildSupportEnglish.intro]: 'Utiliza esta estimación privada para conversar sobre la manutención mensual de un hijo. Las tasas por edad y los descuentos por visitas proceden de tablas noruegas fechadas en 2026. Cambiar el idioma de la página no cambia el país ni las normas.',
    [norwayChildSupportEnglish.limits]: 'Solo para Noruega y un hijo menor de 18 años por cálculo. Es un escenario simplificado, no reproduce la definición completa de ingresos de NAV, el análisis de capacidad de pago, impuestos, otros hijos, ingresos del menor, ayudas al cuidado infantil, casos internacionales ni circunstancias especiales. El importe neto de cuidado infantil lo aporta la persona usuaria y no se determina su derecho. Los ingresos se introducen como ingresos brutos anuales aproximados. No es una resolución de NAV, asesoramiento jurídico ni una obligación de pago.',
    [norwayChildSupportEnglish.fields.scope]: 'Solo se aplican las normas noruegas · tasas de referencia de 2026 vigentes desde el 1 de julio · comprobadas el 17 de octubre de 2026 · el idioma no cambia el país ni las reglas.',
    [norwayChildSupportEnglish.fields.formulaNote]: 'El importe mensual se redondea a los 10 NOK más cercanos. El importe anual es el resultado mensual redondeado multiplicado por 12.',
  },
  fr: {
    [norwayChildSupportEnglish.fields.formulaNote]: 'Le montant est arrondi au multiple de 10 NOK le plus proche. Le montant annuel correspond à l’estimation mensuelle arrondie multipliée par 12.',
  },
  ar: {
    [norwayChildSupportEnglish.fields.class0]: 'بدون خصم / أقل من 2 ليلة في الشهر',
    [norwayChildSupportEnglish.fields.estimate]: 'مبلغ النفقة الشهرية المقدّر',
    [norwayChildSupportEnglish.fields.annualEstimate]: 'المبلغ المقدّر خلال 12 شهرًا',
    [norwayChildSupportEnglish.fields.cost]: 'أساس تكلفة نفقة الطفل الشهرية',
    [norwayChildSupportEnglish.fields.childcareCost]: 'تكلفة رعاية الطفل المُدخلة',
    [norwayChildSupportEnglish.fields.childBenefitAmount]: 'مخصص الطفل العادي المطروح',
    [norwayChildSupportEnglish.limits]: 'خاص بالنرويج فقط، وطفل واحد دون سن 18 عامًا في كل عملية حساب. لا يحاكي هذا السيناريو المبسط تعريف NAV الكامل للدخل أو حساب الضرائب والقدرة على الدفع أو دعم رعاية الأطفال والإعفاءات الضريبية أو دخل الطفل أو توزيع التكلفة على عدة أطفال أو جداول الزيارة غير المعتادة أو الدعم الإضافي أو الحالات الدولية. يجب أن يكون مبلغ رعاية الطفل الذي تدخله هو صافي المبلغ الشهري الذي تعتقد أنه مؤهل بعد أي دعم أو خصومات تعرف أنها تنطبق؛ ولا تحدد الأداة الأهلية. الدخل هو إجمالي سنوي مبسط، وليس تقييمًا رسميًا من NAV. لا تستخدم النتيجة كقرار رسمي أو مشورة قانونية أو وعد بما يجب على أي من الوالدين دفعه.',
  },
  ur: {
    [norwayChildSupportEnglish.fields.scope]: 'صرف ناروے کے قواعد · 2026 کے حوالہ جاتی نرخ 1 جولائی سے نافذ · 17 اکتوبر 2026 کو تصدیق شدہ · زبان ملک یا قواعد کو تبدیل نہیں کرتی۔',
  },
  zh_tw: {
    [norwayChildSupportEnglish.fields.class1]: '第1類 · 每月約2–3晚',
    [norwayChildSupportEnglish.fields.class2]: '第2類 · 每月約4–8晚',
    [norwayChildSupportEnglish.fields.class3]: '第3類 · 每月約9–13晚',
    [norwayChildSupportEnglish.fields.class4]: '第4類 · 每月約14–15晚',
  },
  ca: {
    [norwayChildSupportEnglish.fields.formulaNote]: 'L’import s’arrodoneix al múltiple de 10 NOK més proper. L’import anual és l’estimació mensual arrodonida multiplicada per 12.',
  },
  fa: {
    [norwayChildSupportEnglish.faq[2].a]: 'NAV و وزارتخانه در طول سال، معمولاً از 1 ژوئیه، مبالغ مرجع را به‌روزرسانی می‌کنند. این نسخه از نرخ‌های معتبر از 1 ژوئیه 2026 استفاده می‌کند؛ پیش از اتکا به نتیجه، جدول‌های رسمی پیوندشده را بررسی کنید.',
  },
  nb: {
    [norwayChildSupportEnglish.name]: 'Forenklet beregner for barnebidrag i Norge',
    [norwayChildSupportEnglish.title]: 'Barnebidragskalkulator Norge 2026 – forenklet privat scenario',
    [norwayChildSupportEnglish.description]: 'Se et forenklet månedlig scenario for barnebidrag med norske 2026-satser. Oppgi barnets alder, begge foreldrenes inntekt, barnepass, bostedsordning og samvær for å se beregningen og forutsetningene.',
    [norwayChildSupportEnglish.intro]: 'Bruk dette private overslaget som grunnlag for en samtale om månedlig barnebidrag for ett barn. Alderssatser og samværsfradrag følger daterte norske 2026-tabeller. Språket på siden endrer ikke land eller regelverk.',
    [norwayChildSupportEnglish.limits]: 'Bare for Norge og ett barn under 18 år per beregning. Dette forenklede scenarioet gjengir ikke NAVs fullstendige inntektsbegrep, beregning av betalingsevne, skatt, andre barn, barnets inntekt, støtte til barnepass, saker på tvers av landegrenser eller særtilfeller. Brukeren oppgir eventuell netto barnepasskostnad; verktøyet avgjør ikke om beløpet kvalifiserer. Inntekten oppgis som forenklet årlig bruttoinntekt. Resultatet er ikke et NAV-vedtak, juridisk rådgivning eller et bindende betalingskrav.',
    [norwayChildSupportEnglish.fields.scope]: 'Bare norske regler · 2026-referansesatser som gjelder fra 1. juli · kontrollert 17. oktober 2026 · språkvalget endrer ikke land eller regler.',
    [norwayChildSupportEnglish.example]: 'For et barn på 6–10 år er referansekostnaden for 2026 før barnepass 7 523 NOK i forbruk pluss 3 811 NOK i boutgifter, minus 2 012 NOK i ordinær barnetrygd: 9 322 NOK. Når foreldrene har en årsinntekt på henholdsvis 600 000 og 400 000 NOK og samværsklasse 2, blir det forenklede estimatet ved fast bosted hos én forelder omtrent 3 900 NOK per måned etter samværsfradraget på 1 690 NOK og avrunding.',
    [norwayChildSupportEnglish.details]: 'Verktøyet legger sammen aldersbasert forbruksbeløp og boutgifter fra 2026, legger til eventuelle fradragsberettigede netto tilsynsutgifter du oppgir og trekker fra ordinær barnetrygd. Ved fast bosted hos én forelder fordeles kostnaden etter foreldrenes oppgitte årsinntekter. Deretter brukes kostnadstaket på 5/6 og inntektstaket på 25 %, før samværsfradraget for 2026 trekkes fra og beløpet rundes til nærmeste 10 NOK. Ved delt fast bosted beregnes den delen av kostnaden som følger av at forelderen med høyest inntekt dekker mer enn 50 %.',
    [norwayChildSupportEnglish.fields.ageBand]: 'Barnets aldersgruppe',
    [norwayChildSupportEnglish.fields.residence]: 'Barnets bostedsordning',
    [norwayChildSupportEnglish.fields.oneHome]: 'Fast bosted hos én forelder',
    [norwayChildSupportEnglish.fields.shared]: 'Delt fast bosted',
    [norwayChildSupportEnglish.fields.childcare]: 'Fradragsberettigede netto tilsynsutgifter per måned, NOK',
    [norwayChildSupportEnglish.fields.childcareHelp]: 'Valgfritt. Oppgi bare månedsbeløpet du mener kan inngå etter eventuell støtte eller skattefradrag. Verktøyet kan ikke avgjøre om kostnaden kvalifiserer.',
    [norwayChildSupportEnglish.fields.class0]: 'Ingen samværsfradrag / færre enn 2 overnattinger per måned',
    [norwayChildSupportEnglish.fields.class1]: 'Samværsklasse 1 · omtrent 2–3 overnattinger per måned',
    [norwayChildSupportEnglish.fields.class2]: 'Samværsklasse 2 · omtrent 4–8 overnattinger per måned',
    [norwayChildSupportEnglish.fields.class3]: 'Samværsklasse 3 · omtrent 9–13 overnattinger per måned',
    [norwayChildSupportEnglish.fields.class4]: 'Samværsklasse 4 · omtrent 14–15 overnattinger per måned',
    [norwayChildSupportEnglish.fields.ready]: 'Oppgi begge foreldrenes årlige bruttoinntekt og barnets aldersgruppe.',
    [norwayChildSupportEnglish.fields.statusCalculated]: 'Scenarioet er beregnet på denne enheten. NAV avgjør formelle saker.',
    [norwayChildSupportEnglish.fields.statusCleared]: 'Feltene er tømt.',
    [norwayChildSupportEnglish.fields.statusError]: 'Kontroller inntektene, aldersgruppen, samværsklassen og månedsbeløpene.',
    [norwayChildSupportEnglish.fields.estimate]: 'Anslått månedlig bidrag',
    [norwayChildSupportEnglish.fields.annualEstimate]: 'Anslått beløp over 12 måneder',
    [norwayChildSupportEnglish.fields.sharedPayer]: 'Forelderen med høyest inntekt',
    [norwayChildSupportEnglish.fields.sharedNote]: 'Ved delt fast bosted sammenligner verktøyet inntektsandelen til forelderen med høyest inntekt med 50 %.',
    [norwayChildSupportEnglish.fields.rateNote]: 'Statiske norske referansesatser for 2026, gjeldende fra 1. juli. Ingen bakgrunnsoppdatering.',
    [norwayChildSupportEnglish.fields.modelNote]: 'Ett barn per beregning. Betalingsevne, andre barn, full skatteberegning, barnets inntekt og særtilfeller er ikke modellert.',
    [norwayChildSupportEnglish.fields.formulaNote]: 'Beløpet rundes til nærmeste 10 NOK. Årsbeløpet er det avrundede månedsbeløpet multiplisert med 12.',
  },
};

const packs = {};
for (const { key: locale } of locales) {
  const row = captures[locale] ?? {};
  const dictionary = {};
  for (const source of unique) {
    const translated = (manual[locale]?.[source] ?? row[source] ?? '').trim();
    if (!translated) throw new Error(`${locale}: missing translation for ${source}`);
    const expected = numbers(source);
    const actual = numbers(translated);
    for (const token of expected) {
      if (actual.filter((item) => item === token).length < expected.filter((item) => item === token).length) {
        throw new Error(`${locale}: protected number ${token} missing: ${source}`);
      }
    }
    dictionary[source] = translated;
  }
  const exactEchoes = unique.filter((source) => dictionary[source] === source);
  if (exactEchoes.length > unique.length * 0.1) throw new Error(`${locale}: too many untranslated strings: ${exactEchoes.join(' | ')}`);
  if (!dictionary[norwayChildSupportEnglish.fields.calculate]) throw new Error(`${locale}: calculate label missing`);
  if (new Set(Object.values(dictionary).map((value) => value.toLowerCase())).size < unique.length * 0.65) throw new Error(`${locale}: suspiciously low translation diversity`);
  packs[locale] = dictionary;
}
await writeFile(output, `// Static UI translations. Norwegian child-support rates and law remain explicit in every locale.\nexport const norwayChildSupportTranslationsByLocale = Object.freeze(${JSON.stringify(packs)});\n`);
console.log(`Built ${unique.length} tool-specific strings × ${locales.length} locales (${sources.length} source strings; shared site strings inherit common dictionaries).`);

import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';
import { norwayHousingBenefitEnglish } from '../../src/markets-no-ch/norway-housing-benefit-copy-en.mjs';

const locales = [...localeEntries, { key: 'nb', code: 'nb-NO', name: 'Norsk bokmål', prefix: '/nb' }].filter(({ key }) => key !== 'en');
const captures = JSON.parse(await readFile(new URL('../../src/markets-no-ch/norway-housing-benefit-translation-captures.json', import.meta.url), 'utf8'));
const output = new URL('../../src/markets-no-ch/norway-housing-benefit-translations.mjs', import.meta.url);
const flatten = (value, result = []) => { if (typeof value === 'string') result.push(value); else if (Array.isArray(value)) value.forEach((item) => flatten(item, result)); else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, result)); return result; };
const sources = [...new Set(flatten(norwayHousingBenefitEnglish))];
const common = new Set(Object.keys(translationsByLocale.es));
const unique = sources.filter((source) => !common.has(source));
const legacyExample = 'For one household member with no income and NOK 8,000 in monthly approved housing costs, the 2026 standard own contribution is about NOK 2,215 per month. The estimated benefit is about NOK 4,266 after applying the 73.7% rate.';
const digitMap = {};
for (const base of [0x0660, 0x06f0, 0x0966, 0x09e6, 0x0a66, 0x0ae6, 0x0b66, 0x0be6, 0x0c66, 0x0ce6, 0x0d66, 0x0e50, 0x0ed0, 0x0f20, 0x1040, 0x17e0, 0x1810, 0xff10]) for (let value = 0; value <= 9; value++) digitMap[String.fromCodePoint(base + value)] = String(value);
const numberTokens = (text) => [...text].map((char) => digitMap[char] ?? char).join('').replace(/\u066c/gu, ',').replace(/\u066b/gu, '.').match(/\d+(?:[.,\s\u00a0\u202f]\d+)*/gu)?.map((raw) => {
  const token = raw.replace(/[\s\u00a0\u202f]/gu, '');
  const groups = token.split(/[.,]/u);
  if (groups.length > 1 && groups.slice(1).every((group) => group.length === 3)) return groups.join('');
  return groups.length > 1 ? `${groups.slice(0, -1).join('')}.${groups.at(-1)}` : token;
}) ?? [];
const manual = {
  es: {
    [norwayHousingBenefitEnglish.name]: 'Estimador de ayuda a la vivienda de Noruega',
    [norwayHousingBenefitEnglish.title]: 'Calculadora de ayuda a la vivienda de Noruega 2026: escenario mensual',
    [norwayHousingBenefitEnglish.description]: 'Estima un escenario mensual estándar de ayuda a la vivienda de Noruega a partir de los ingresos del hogar, los gastos de vivienda aprobados, el tamaño del hogar y el grupo municipal. Consulta los supuestos de 2026 y usa el calculador vigente de Husbanken para comprobar tu caso.',
    [norwayHousingBenefitEnglish.intro]: 'Utiliza este escenario privado para entender cómo se combinan los gastos de vivienda aprobados, los ingresos ponderados del hogar y la tasa de cobertura de 2026. El idioma de la interfaz no cambia las reglas noruegas.',
    [norwayHousingBenefitEnglish.limits]: 'Solo Noruega. Este escenario estándar no decide si cumples los requisitos ni incluye el límite de ingresos del hogar, el pago mínimo, los umbrales especiales para pensionistas o personas con discapacidad desde jóvenes, la vivienda adaptada, las reglas transitorias ni todas las excepciones de ingresos y patrimonio. Las tasas de 2026 son estáticas y deben comprobarse con Husbanken. Para el mes que te interesa, utiliza el calculador oficial.',
    [norwayHousingBenefitEnglish.fields.scope]: 'Solo se aplican las normas de Noruega · tasas estándar de 2026 · comprobadas el 17 de octubre de 2026 · el idioma no cambia el país ni las reglas.',
    [norwayHousingBenefitEnglish.fields.householdIncome]: 'Base mensual de ingresos del hogar antes de ponderar, NOK',
    [norwayHousingBenefitEnglish.fields.incomeHelp]: 'Indica la base mensual bruta que utiliza Husbanken, incluido cualquier complemento por patrimonio e ingreso por alquiler libre de impuestos que corresponda. Excluye los importes que Husbanken no cuenta. Consulta su guía de ingresos antes de basarte en el resultado.',
    [norwayHousingBenefitEnglish.fields.approvedCosts]: 'Gastos mensuales de vivienda ya aprobados según las reglas de Husbanken, NOK',
    [norwayHousingBenefitEnglish.fields.costsHelp]: 'No sumes todas las facturas de vivienda. Husbanken cuenta de forma distinta el alquiler, los gastos comunes y las casas independientes. Introduce el importe mensual calculado según sus reglas vigentes. Después se aplica el límite municipal y por tamaño del hogar.',
    [norwayHousingBenefitEnglish.fields.adults]: 'Miembros del hogar de 18 años o más',
    [norwayHousingBenefitEnglish.fields.minors]: 'Miembros del hogar menores de 18 años',
    [norwayHousingBenefitEnglish.fields.municipality]: 'Grupo municipal del límite de 2026',
    [norwayHousingBenefitEnglish.fields.standard]: 'Otros municipios',
    [norwayHousingBenefitEnglish.fields.oslo]: 'Oslo',
    [norwayHousingBenefitEnglish.fields.groupB]: 'Bergen, Trondheim, Tromsø, Stavanger o Bærum',
    [norwayHousingBenefitEnglish.fields.groupC]: 'Kristiansand, Skedsmo, Frogn, Lørenskog, Nordre Follo, Asker, Nesodden, Sola o Sandnes',
    [norwayHousingBenefitEnglish.fields.calculate]: 'Estimar importe mensual',
    [norwayHousingBenefitEnglish.fields.clear]: 'Borrar datos',
    [norwayHousingBenefitEnglish.fields.ready]: 'Introduce los ingresos mensuales del hogar, los gastos aprobados y su composición.',
    [norwayHousingBenefitEnglish.fields.statusCalculated]: 'Escenario calculado en este dispositivo. Husbanken decide los casos reales.',
    [norwayHousingBenefitEnglish.fields.statusCleared]: 'Se borraron los datos.',
    [norwayHousingBenefitEnglish.fields.statusError]: 'Revisa los importes mensuales, el número de miembros y el grupo municipal.',
    [norwayHousingBenefitEnglish.fields.resultHeading]: 'Escenario mensual estándar',
    [norwayHousingBenefitEnglish.fields.estimate]: 'Ayuda mensual a la vivienda estimada',
    [norwayHousingBenefitEnglish.fields.ownContribution]: 'Aportación mensual estimada del hogar',
    [norwayHousingBenefitEnglish.fields.housingCap]: 'Límite mensual de gastos de vivienda',
    [norwayHousingBenefitEnglish.fields.costsUsed]: 'Gastos aprobados considerados tras el límite',
    [norwayHousingBenefitEnglish.fields.difference]: 'Gastos restantes tras la aportación del hogar',
    [norwayHousingBenefitEnglish.fields.coverage]: 'Tasa de cobertura',
    [norwayHousingBenefitEnglish.fields.assumptionsHeading]: 'Supuestos utilizados',
    [norwayHousingBenefitEnglish.fields.rateNote]: 'Los umbrales estándar de aportación y los límites de vivienda utilizan las tasas de Husbanken para 2026, comprobadas el 17 de octubre de 2026.',
    [norwayHousingBenefitEnglish.fields.formulaNote]: 'Ayuda estimada = máximo entre 0 y (gastos aprobados tras el límite − aportación del hogar), multiplicado por 73.7 %. El peso usa 1.00 para la primera persona, 0.13 por cada persona adicional de 18 años o más y 0.15 por cada persona adicional menor de 18 años.',
    [norwayHousingBenefitEnglish.fields.modelNote]: 'Los ingresos introducidos ya deben respetar las reglas de Husbanken. No se calculan los umbrales especiales, el límite separado de ingresos del hogar, el pago mínimo ni los requisitos personales.',
    [norwayHousingBenefitEnglish.fields.privacyNote]: 'Cálculo privado y local. Esta página no envía ni guarda los importes.',
    [norwayHousingBenefitEnglish.fields.sourceCalc]: 'Husbanken: cálculo',
    [norwayHousingBenefitEnglish.fields.sourceIncome]: 'Husbanken: base de ingresos',
    [norwayHousingBenefitEnglish.fields.sourceRates]: 'Husbanken: tasas de aportación de 2026',
    [norwayHousingBenefitEnglish.fields.sourceCaps]: 'Husbanken: límites de gastos de vivienda de 2026',
    [norwayHousingBenefitEnglish.fields.officialCalc]: 'Abrir el calculador oficial de Husbanken',
    [norwayHousingBenefitEnglish.example]: 'Para un miembro del hogar sin ingresos y con 8.000 NOK en gastos de vivienda aprobados al mes, la aportación propia estándar de 2026 es de unos 2.215 NOK al mes. La ayuda estimada es de unos 4.032 NOK tras aplicar la tasa del 73,7 %.',
  },
  tl: {
    [norwayHousingBenefitEnglish.fields.municipality]: 'Pangkat ng munisipalidad para sa limitasyon sa pabahay sa 2026',
  },
  am: {
    [norwayHousingBenefitEnglish.example]: 'ገቢ ለሌለው አንድ የቤተሰብ አባል እና በወር 8,000 NOK የጸደቁ የቤት ወጪዎች ሲኖሩ፣ የ2026 መደበኛ የግል መዋጮ በወር 2,215 NOK ገደማ ነው። የግምት የቤት እርዳታው 73.7% መጠንን ከተጠቀመ በኋላ 4,032 NOK ገደማ ነው።',
  },
  fa: {
    [norwayHousingBenefitEnglish.example]: 'برای یک عضو خانوار بدون درآمد و با ۸٬۰۰۰ کرون نروژ هزینه مسکن تأییدشده در ماه، سهم استاندارد پرداختی در سال ۲۰۲۶ حدود ۲٬۲۱۵ کرون در ماه است. کمک‌هزینه برآوردی پس از اعمال نرخ ۷۳٫۷٪ حدود ۴٬۰۳۲ کرون نروژ است.',
  },
  nb: {
    [norwayHousingBenefitEnglish.name]: 'Beregner for bostøtte i Norge',
    [norwayHousingBenefitEnglish.title]: 'Bostøttekalkulator Norge 2026 – månedlig scenario',
    [norwayHousingBenefitEnglish.description]: 'Beregn et standard månedlig scenario for norsk bostøtte ut fra husstandens inntektsgrunnlag, godkjente boutgifter, størrelse og kommunegruppe. Se forutsetningene for 2026, og bruk Husbankens oppdaterte kalkulator for å kontrollere din situasjon.',
    [norwayHousingBenefitEnglish.intro]: 'Bruk dette private scenarioet for å se hvordan godkjente boutgifter, vektet inntekt og dekningsgraden for 2026 inngår i beregningen. Språket på siden endrer ikke de norske reglene.',
    [norwayHousingBenefitEnglish.limits]: 'Bare for Norge. Dette standardscenarioet avgjør ikke om du har rett til bostøtte og beregner ikke den separate øvre inntektsgrensen for husstanden, minste utbetaling, særskilte egenandeler for enslige alderspensjonister eller unge uføre, spesialtilpasset bolig, overgangsregler eller alle unntak for inntekt og formue. 2026-satsene er statiske og må kontrolleres hos Husbanken. Bruk den offisielle kalkulatoren for måneden du undersøker.',
    [norwayHousingBenefitEnglish.fields.scope]: 'Bare norske regler · standard satser for 2026 · kontrollert 17. oktober 2026 · språkvalget endrer ikke land eller regler.',
    [norwayHousingBenefitEnglish.fields.householdIncome]: 'Husstandens månedlige inntektsgrunnlag før vekting, NOK',
    [norwayHousingBenefitEnglish.fields.incomeHelp]: 'Oppgi det brutto månedsgrunnlaget Husbanken bruker, inkludert eventuelt formuestillegg og skattefrie leieinntekter. Trekk fra inntekter Husbanken ikke regner med. Les inntektsveiledningen før du legger resultatet til grunn.',
    [norwayHousingBenefitEnglish.fields.approvedCosts]: 'Godkjente boutgifter per måned etter Husbankens regler, NOK',
    [norwayHousingBenefitEnglish.fields.costsHelp]: 'Ikke legg sammen alle boligregningene. Husbanken beregner boutgifter forskjellig for leiebolig, boliger med felleskostnader og enebolig. Oppgi månedsbeløpet etter gjeldende regler. Det brukes et tak etter kommune og husstandsstørrelse.',
    [norwayHousingBenefitEnglish.fields.adults]: 'Husstandsmedlemmer som er 18 år eller eldre',
    [norwayHousingBenefitEnglish.fields.minors]: 'Husstandsmedlemmer under 18 år',
    [norwayHousingBenefitEnglish.fields.municipality]: 'Kommunegruppe for boutgiftstak i 2026',
    [norwayHousingBenefitEnglish.fields.standard]: 'Andre kommuner',
    [norwayHousingBenefitEnglish.fields.oslo]: 'Oslo',
    [norwayHousingBenefitEnglish.fields.groupB]: 'Bergen, Trondheim, Tromsø, Stavanger eller Bærum',
    [norwayHousingBenefitEnglish.fields.groupC]: 'Kristiansand, Skedsmo, Frogn, Lørenskog, Nordre Follo, Asker, Nesodden, Sola eller Sandnes',
    [norwayHousingBenefitEnglish.fields.calculate]: 'Beregn månedlig beløp',
    [norwayHousingBenefitEnglish.fields.clear]: 'Tøm feltene',
    [norwayHousingBenefitEnglish.fields.ready]: 'Oppgi husstandens månedsinntekt, godkjente boutgifter og sammensetning.',
    [norwayHousingBenefitEnglish.fields.statusCalculated]: 'Scenarioet er beregnet på denne enheten. Husbanken avgjør faktiske saker.',
    [norwayHousingBenefitEnglish.fields.statusCleared]: 'Feltene er tømt.',
    [norwayHousingBenefitEnglish.fields.statusError]: 'Kontroller månedsbeløpene, antall husstandsmedlemmer og kommunegruppen.',
    [norwayHousingBenefitEnglish.fields.resultHeading]: 'Standard månedlig scenario',
    [norwayHousingBenefitEnglish.fields.estimate]: 'Anslått månedlig bostøtte',
    [norwayHousingBenefitEnglish.fields.ownContribution]: 'Anslått månedlig egenandel',
    [norwayHousingBenefitEnglish.fields.housingCap]: 'Månedlig boutgiftstak',
    [norwayHousingBenefitEnglish.fields.costsUsed]: 'Godkjente boutgifter etter at taket er brukt',
    [norwayHousingBenefitEnglish.fields.difference]: 'Boutgifter som gjenstår etter egenandelen',
    [norwayHousingBenefitEnglish.fields.coverage]: 'Dekningsgrad',
    [norwayHousingBenefitEnglish.fields.assumptionsHeading]: 'Forutsetninger',
    [norwayHousingBenefitEnglish.fields.rateNote]: 'Standard egenandelsgrenser og boutgiftstak bruker Husbankens 2026-satser, kontrollert 17. oktober 2026.',
    [norwayHousingBenefitEnglish.fields.formulaNote]: 'Anslått støtte = maksimum(0, godkjente boutgifter etter tak − egenandel) × 73,7 %. Vekten er 1,00 for første person, 0,13 for hver ekstra person på 18 år eller eldre og 0,15 for hver ekstra person under 18 år.',
    [norwayHousingBenefitEnglish.fields.modelNote]: 'Inntekten du oppgir, må allerede følge Husbankens inntektsregler. Særskilte grenser, den separate øvre inntektsgrensen, minsteutbetaling og personlige vilkår beregnes ikke.',
    [norwayHousingBenefitEnglish.fields.privacyNote]: 'Privat beregning på enheten. Beløp sendes ikke eller lagres av siden.',
    [norwayHousingBenefitEnglish.fields.sourceCalc]: 'Husbanken: beregning',
    [norwayHousingBenefitEnglish.fields.sourceIncome]: 'Husbanken: inntektsgrunnlag',
    [norwayHousingBenefitEnglish.fields.sourceRates]: 'Husbanken: egenandelssatser for 2026',
    [norwayHousingBenefitEnglish.fields.sourceCaps]: 'Husbanken: boutgiftstak for 2026',
    [norwayHousingBenefitEnglish.fields.officialCalc]: 'Åpne Husbankens offisielle kalkulator',
  },
};
const packs = {};
for (const { key: locale } of locales) {
  const row = captures[locale] ?? {};
  const dictionary = {};
  for (const source of unique) {
    const captured = row[source] ?? (source === norwayHousingBenefitEnglish.example ? row[legacyExample]?.replace(/4([,.\u00a0 \u202f])266/gu, (_match, separator) => `4${separator}032`) : '');
    const translated = (manual[locale]?.[source] ?? captured ?? '').trim();
    if (!translated) throw new Error(`${locale}: missing translation for ${source}`);
    const expected = numberTokens(source), actual = numberTokens(translated);
    for (const token of expected) if (actual.filter((item) => item === token).length < expected.filter((item) => item === token).length) throw new Error(`${locale}: protected number ${token} missing: ${source}`);
    dictionary[source] = translated;
  }
  const untranslated = unique.filter((source) => dictionary[source] === source && !['Oslo'].includes(source));
  if (untranslated.length) throw new Error(`${locale}: untranslated source string found: ${untranslated.join(' | ')}`);
  if (new Set(Object.values(dictionary).map((value) => value.toLowerCase())).size < unique.length * 0.62) throw new Error(`${locale}: suspiciously low translation diversity.`);
  packs[locale] = dictionary;
}
await writeFile(output, `// Static UI translations; the rules remain specifically Norwegian in every locale.\nexport const norwayHousingBenefitTranslationsByLocale = Object.freeze(${JSON.stringify(packs)});\n`);
console.log(`Built ${unique.length} tool-specific strings × ${locales.length} non-English locales.`);

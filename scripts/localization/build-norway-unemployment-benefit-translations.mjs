import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';
import { norwayUnemploymentBenefitEnglish } from '../../src/markets-no-ch/norway-unemployment-benefit-copy-en.mjs';
import { norwayUnemploymentBenefitTranslationsByLocale as previousTranslations } from '../../src/markets-no-ch/norway-unemployment-benefit-translations.mjs';
const locales = [...localeEntries, { key: 'nb', code: 'nb-NO', name: 'Norsk bokmål', prefix: '/nb' }].filter(({key})=>key!=='en');
const output = new URL('../../src/markets-no-ch/norway-unemployment-benefit-translations.mjs', import.meta.url);
const input = new URL('../../src/markets-no-ch/norway-unemployment-benefit-translation-overrides.json', import.meta.url);
const flatten=(v,a=[])=>{if(typeof v==='string')a.push(v);else if(Array.isArray(v))v.forEach(x=>flatten(x,a));else if(v&&typeof v==='object')Object.values(v).forEach(x=>flatten(x,a));return a;};
const sources=[...new Set(flatten(norwayUnemploymentBenefitEnglish))];
const common=new Set(Object.keys(translationsByLocale.es));
const unique=sources.filter(source=>!common.has(source));
let captures={};try{captures=JSON.parse(await readFile(input,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
const digitMap={'٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9','۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9','০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9','०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9','૦':'0','૧':'1','૨':'2','૩':'3','૪':'4','૫':'5','૬':'6','૭':'7','૮':'8','૯':'9','๐':'0','๑':'1','๒':'2','๓':'3','๔':'4','๕':'5','๖':'6','๗':'7','๘':'8','๙':'9','౦':'0','౧':'1','౨':'2','౩':'3','౪':'4','౫':'5','౬':'6','౭':'7','౮':'8','౯':'9','௦':'0','௧':'1','௨':'2','௩':'3','௪':'4','௫':'5','௬':'6','௭':'7','௮':'8','௯':'9','၀':'0','၁':'1','၂':'2','၃':'3','၄':'4','၅':'5','၆':'6','၇':'7','၈':'8','၉':'9','០':'0','១':'1','២':'2','៣':'3','៤':'4','៥':'5','៦':'6','៧':'7','៨':'8','៩':'9','０':'0','１':'1','２':'2','３':'3','４':'4','５':'5','６':'6','７':'7','８':'8','９':'9','〇':'0','零':'0','一':'1','二':'2','三':'3','四':'4','五':'5','六':'6','七':'7','八':'8','九':'9'};
const nums=text=>[...text].map(ch=>digitMap[ch]??ch).join('').match(/[0-9]+(?:[.,\s\u00a0\u202f][0-9]+)*/gu)?.map(s=>s.replace(/[.,\s\u00a0\u202f]/gu,''))??[];
const overrides={
 es:{
  [norwayUnemploymentBenefitEnglish.name]:'Estimador de prestación por desempleo de Noruega',
  [norwayUnemploymentBenefitEnglish.title]:'Calculadora de prestación por desempleo de Noruega 2026 — Estimación de dagpenger',
  [norwayUnemploymentBenefitEnglish.description]:'Estima la cuantía de la prestación noruega por desempleo, comprueba el requisito de ingresos mínimos y consulta la posible duración usando las distintas bases de ingresos que aplica NAV. Incluye la fecha y los límites de los datos.',
  [norwayUnemploymentBenefitEnglish.intro]:'Estima un escenario estándar de prestación noruega por desempleo con cifras separadas para calcular la cuantía, comprobar el ingreso mínimo y estimar la posible duración. NAV utiliza definiciones distintas para cada cálculo.',
  [norwayUnemploymentBenefitEnglish.exampleHeading]:'Qué puedes averiguar con esta estimación',
  [norwayUnemploymentBenefitEnglish.example]:'Esta herramienta explica con lenguaje claro las reglas noruegas de dagpenger. No deduce tu país a partir del idioma, no decide si tienes derecho ni envía nada a NAV.',
  [norwayUnemploymentBenefitEnglish.howItWorks]:'Cómo funciona la estimación',
  [norwayUnemploymentBenefitEnglish.details]:'NAV utiliza tres definiciones de ingresos distintas: una para el requisito mínimo, otra para calcular la cuantía de la prestación y una tercera para determinar la posible duración. Introduce cada base por separado. Para calcular la cuantía, NAV compara los ingresos de los últimos 12 meses con el promedio anual de los últimos 36 meses y aplica la opción que más te favorezca. En 2026, la tasa es del 62,4 % de esa base, con un límite de 6G. El equivalente mensual es un promedio orientativo, no un calendario de pagos. NAV paga cada 14 días y calcula la prestación parcial según las horas declaradas.',
  [norwayUnemploymentBenefitEnglish.faqHeading]:'Preguntas frecuentes',
  [norwayUnemploymentBenefitEnglish.faq[0].q]:'¿Esto significa que recibiré dagpenger?',
  [norwayUnemploymentBenefitEnglish.faq[0].a]:'No. Solo comprueba los ingresos y las condiciones que indicas. NAV decide sobre la afiliación, la residencia, la reducción de horas, la búsqueda activa de empleo, los tipos de ingresos, los períodos de espera, los derechos transfronterizos y la solicitud.',
  [norwayUnemploymentBenefitEnglish.faq[1].q]:'¿Por qué hay campos de ingresos separados?',
  [norwayUnemploymentBenefitEnglish.faq[1].a]:'NAV usa listas de ingresos distintas para el requisito mínimo, la cuantía de la prestación y su posible duración. Para el requisito mínimo, cuenta el salario y solo las prestaciones parentales, por embarazo y por baja relacionada con el embarazo que se especifican para personas empleadas. Para calcular la cuantía, NAV también cuenta varias prestaciones, incluida la prestación por desempleo anterior. La duración usa una tercera lista. Los ingresos por cuenta propia y la prestación AAP no se incluyen en estas bases. Consulta las listas vigentes de NAV e introduce cada total en sus campos; no copies un mismo total en todas las secciones salvo que los ingresos coincidan.',
  [norwayUnemploymentBenefitEnglish.faq[2].q]:'¿Por qué se comparan 12 y 36 meses?',
  [norwayUnemploymentBenefitEnglish.faq[2].a]:'NAV compara los ingresos de los últimos 12 meses con el promedio anual de los últimos 36 y usa la base más alta para estimar la cuantía.',
  [norwayUnemploymentBenefitEnglish.faq[3].q]:'¿Cómo se calcula aquí el desempleo parcial?',
  [norwayUnemploymentBenefitEnglish.faq[3].a]:'La cuantía se ajusta al porcentaje de horas de trabajo habituales que indiques haber perdido. Es un escenario simplificado. NAV calcula cada pago a partir de los partes de actividad y puede reducirlo por las horas trabajadas, enfermedad, vacaciones u otras prestaciones.',
  [norwayUnemploymentBenefitEnglish.faq[4].q]:'¿Qué incluye el suplemento por hijos?',
  [norwayUnemploymentBenefitEnglish.faq[4].a]:'En 2026 son 38 NOK por cada hijo menor de 18 años que cumpla los requisitos, por día de prestación y, normalmente, cinco días a la semana. Se aplican condiciones de residencia y de estancia en el extranjero. Indica solo los hijos a tu cargo que cumplan las condiciones de NAV.',
  [norwayUnemploymentBenefitEnglish.faq[5].q]:'¿Incluye todos los casos de dagpenger?',
  [norwayUnemploymentBenefitEnglish.faq[5].a]:'No. Esta herramienta no resuelve los casos de pesca, la coordinación transfronteriza y del EEE, los detalles de la suspensión temporal, los períodos previos de prestación, la renuncia voluntaria, las sanciones, las retenciones fiscales ni las excepciones individuales.',
  [norwayUnemploymentBenefitEnglish.limitsHeading]:'Reglas de Noruega y fecha de los datos',
  [norwayUnemploymentBenefitEnglish.useTool]:'Estima una prestación por desempleo en Noruega',
  [norwayUnemploymentBenefitEnglish.freeBadge]:'GRATIS · SE EJECUTA EN TU NAVEGADOR',
  [norwayUnemploymentBenefitEnglish.fields.scope]:'Reglas estándar noruegas de dagpenger, cifras de 2026. Las reglas no dependen del idioma de la página.',
  [norwayUnemploymentBenefitEnglish.fields.minimumIncomeLegend]:'Ingresos para el requisito mínimo',
  [norwayUnemploymentBenefitEnglish.fields.benefitIncomeLegend]:'Ingresos para calcular la cuantía',
  [norwayUnemploymentBenefitEnglish.fields.durationIncomeLegend]:'Ingresos para estimar la duración',
  [norwayUnemploymentBenefitEnglish.fields.incomeHelp]:'Mantén separadas estas tres bases. Requisito mínimo: salario y las prestaciones parentales, por embarazo y por baja relacionada con el embarazo que se especifican para personas empleadas. Cuantía: salario, prestaciones por enfermedad, cuidados, asistencia, formación, embarazo y maternidad/paternidad, además de prestaciones por desempleo anteriores. Duración: salario y prestaciones parentales, por embarazo y por baja relacionada con el embarazo. Los ingresos por cuenta propia y la prestación AAP no se incluyen en estas bases. Prevalecen las definiciones detalladas de NAV y tus datos oficiales; consulta la fuente enlazada antes de introducir los totales.',
  [norwayUnemploymentBenefitEnglish.fields.income12]:'Ingresos que cuentan para el requisito mínimo en los últimos 12 meses, NOK',
  [norwayUnemploymentBenefitEnglish.fields.income36]:'Ingresos que cuentan para el requisito mínimo en los últimos 36 meses en total, NOK',
  [norwayUnemploymentBenefitEnglish.fields.benefitIncome12]:'Ingresos para calcular la cuantía en los últimos 12 meses, NOK',
  [norwayUnemploymentBenefitEnglish.fields.benefitIncome36]:'Ingresos para calcular la cuantía en los últimos 36 meses en total, NOK',
  [norwayUnemploymentBenefitEnglish.fields.durationIncome12]:'Ingresos para determinar la duración en los últimos 12 meses, NOK',
  [norwayUnemploymentBenefitEnglish.fields.durationIncome36]:'Ingresos para determinar la duración en los últimos 36 meses en total, NOK',
  [norwayUnemploymentBenefitEnglish.fields.children]:'Hijos menores de 18 años a tu cargo que cumplen las condiciones de residencia de NAV',
  [norwayUnemploymentBenefitEnglish.fields.ready]:'Introduce los seis importes de ingresos y las horas de trabajo que has perdido.',
  [norwayUnemploymentBenefitEnglish.fields.error]:'Comprueba los importes, el porcentaje, el número de hijos y los meses de servicio militar.',
  [norwayUnemploymentBenefitEnglish.fields.resultHeading]:'Estimación orientativa para 2026',
  [norwayUnemploymentBenefitEnglish.fields.basis]:'Base de ingresos elegida para calcular la cuantía antes del límite de 6G',
  [norwayUnemploymentBenefitEnglish.fields.cappedBasis]:'Base de la prestación tras aplicar el límite de 6G',
  [norwayUnemploymentBenefitEnglish.fields.capStatus]:'Se ha aplicado el límite de 6G',
  [norwayUnemploymentBenefitEnglish.fields.dailyBasic]:'Prestación básica estimada por día laborable',
  [norwayUnemploymentBenefitEnglish.fields.childPerDay]:'Suplemento por hijos por día laborable',
  [norwayUnemploymentBenefitEnglish.fields.dailyTotal]:'Total estimado por día de prestación',
  [norwayUnemploymentBenefitEnglish.fields.weekly]:'Importe estimado por cinco días de prestación',
  [norwayUnemploymentBenefitEnglish.fields.monthly]:'Equivalente mensual orientativo',
  [norwayUnemploymentBenefitEnglish.fields.annual]:'Importe estimado para 52 semanas con esta tasa',
  [norwayUnemploymentBenefitEnglish.fields.duration]:'Posible período máximo estándar',
  [norwayUnemploymentBenefitEnglish.fields.weeks]:'semanas',
  [norwayUnemploymentBenefitEnglish.fields.deductible]:'Normalmente, NAV descuenta del primer pago un importe equivalente a tres días de prestación por desempleo. NAV calcula la cuantía exacta.',
  [norwayUnemploymentBenefitEnglish.fields.eligibilityHeading]:'Condiciones que debes comprobar; esto no determina el derecho',
  [norwayUnemploymentBenefitEnglish.fields.eligibilityIncome]:'Los ingresos indicados alcanzan el requisito mínimo',
  [norwayUnemploymentBenefitEnglish.fields.eligibilityHours]:'Se ha perdido al menos la mitad de las horas de trabajo habituales',
  [norwayUnemploymentBenefitEnglish.fields.eligibilityAge]:'Menor de 67 años',
  [norwayUnemploymentBenefitEnglish.fields.eligibilityResidence]:'Residencia en Noruega y cobertura del Seguro Nacional',
  [norwayUnemploymentBenefitEnglish.fields.eligibilityJobSeeker]:'Inscripción en NAV y búsqueda activa de empleo',
  [norwayUnemploymentBenefitEnglish.fields.eligible]:'Los datos indicados superan estas comprobaciones limitadas; NAV debe valorar la solicitud.',
  [norwayUnemploymentBenefitEnglish.fields.notEligible]:'Una o más comprobaciones indicadas no se cumplen. Esto no determina el derecho; NAV debe valorar el caso.',
  [norwayUnemploymentBenefitEnglish.fields.militaryNote]:'Si NAV confirma el servicio militar reciente de al menos tres meses, puede aplicarse una base mínima de 3G y un máximo de 26 semanas.',
  [norwayUnemploymentBenefitEnglish.fields.ordinaryNote]:'La posible duración estándar es de hasta 104 semanas con ingresos iguales o superiores a 2G y hasta 52 semanas si son inferiores a 2G. NAV usa una definición de ingresos distinta; esta estimación emplea los campos de duración separados.',
  [norwayUnemploymentBenefitEnglish.fields.source]:'NAV · reglas e importes de la prestación por desempleo',
  [norwayUnemploymentBenefitEnglish.fields.sourceCalculator]:'NAV · calculadora oficial de dagpenger',
  [norwayUnemploymentBenefitEnglish.fields.sourceG]:'NAV · cuantía básica del Seguro Nacional (G)',
  [norwayUnemploymentBenefitEnglish.fields.childNote]:'El suplemento por hijos depende de las condiciones de manutención y residencia. Puede dejar de corresponder si el hijo pasa más de 90 días fuera de Noruega, del EEE, de Suiza o de Gran Bretaña durante un período de 12 meses.',
  [norwayUnemploymentBenefitEnglish.fields.partialNote]:'El importe parcial es una estimación proporcional. NAV calcula los días pagados reales según cada parte de actividad de 14 días; la deducción de tres días puede reducir el primer pago.',
  [norwayUnemploymentBenefitEnglish.fields.noDecision]:'Solo NAV decide si corresponde la prestación y el importe. Esta herramienta no calcula impuestos, fechas de solicitud, recursos ni coordinación transfronteriza.',
  [norwayUnemploymentBenefitEnglish.fields.year]:'Año de las reglas',
  [norwayUnemploymentBenefitEnglish.fields.sourceDate]:'Reglas comprobadas el',
  [norwayUnemploymentBenefitEnglish.fields.privacyNote]:'Se ejecuta localmente; los importes introducidos no se envían a ningún servidor.',
  [norwayUnemploymentBenefitEnglish.limits]:'Estimación orientativa exclusiva para Noruega, basada en la información de NAV y en la cuantía básica del Seguro Nacional (G) vigente desde el 1 de mayo de 2026, comprobada el 16 de octubre de 2026. El idioma elegido no cambia las reglas del país. No decide el derecho a la prestación, no es un cálculo oficial de NAV ni una solicitud. Las reglas y G pueden cambiar; las cifras de esta versión son estáticas y no se actualizan en segundo plano. Comprueba las reglas vigentes en NAV antes de basarte en el resultado.',
 }
};
const packs={};
for(const {key:locale} of locales){
 const row=captures[locale]??{};
 const dict={}; for(let i=0;i<unique.length;i++){const source=unique[i],value=(overrides[locale]?.[source]??row[source]??previousTranslations[locale]?.[source]??'').trim();if(!value)throw new Error(`${locale}: translation missing: ${source}`);if(value===source&&!(source==='No'&&['es','it','ca'].includes(locale)))throw new Error(`${locale}: untranslated source copy: ${source}`);const expected=nums(source),actual=nums(value);for(const token of expected)if(actual.filter(x=>x===token).length<expected.filter(x=>x===token).length)throw new Error(`${locale}: protected number ${token} missing in source: ${source}`);dict[source]=value;}
 const actionSource=norwayUnemploymentBenefitEnglish.fields.calculate;if(new Set(Object.values(dict).map(v=>v.toLocaleLowerCase())).size<unique.length*0.65)throw new Error(`${locale}: suspiciously low translation diversity`);
 if(!dict[actionSource])throw new Error(`${locale}: calculate label missing`);
 packs[locale]=dict;
}
await writeFile(output,`// Static machine translations generated from public interface copy. Native review remains advisable.\nexport const norwayUnemploymentBenefitTranslationsByLocale = Object.freeze(${JSON.stringify(packs)});\n`);
console.log(`Built ${unique.length} specific strings × ${locales.length} locales; shared labels inherit the existing locale dictionaries.`);

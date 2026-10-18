import { readFile, writeFile } from 'node:fs/promises';
import { norwayCompanyCarEnglish } from '../../src/markets-no-ch/norway-company-car-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const flatten = (value, output=[]) => { if (typeof value === 'string') output.push(value); else if (Array.isArray(value)) value.forEach(item=>flatten(item,output)); else if (value&&typeof value==='object') Object.values(value).forEach(item=>flatten(item,output)); return output; };
const allSources=[...new Set(flatten(norwayCompanyCarEnglish))];
const locales=Object.keys(translationsByLocale).filter(locale=>locale!=='en').sort();
const commonSources=allSources.filter(source=>locales.every(locale=>translationsByLocale[locale]?.[source]));
const sources=allSources.filter(source=>!commonSources.includes(source));
const captures=JSON.parse(await readFile(new URL('../../src/markets-no-ch/norway-company-car-translation-captures.json',import.meta.url),'utf8'));
if(Object.keys(captures).sort().join(',')!==locales.join(',')) throw new Error('NO006 translation captures must include all 36 non-English locales.');
const bokmalOverrides={
  'Norway Company Car Tax Calculator':'Kalkulator for skatt på firmabil i Norge',
  'Norway Company Car Tax Calculator 2026 — Taxable Benefit Estimate':'Kalkulator for skatt på firmabil i Norge 2026 – estimat av skattepliktig fordel',
  'Estimate Norway’s 2026 taxable benefit for private use of a standard company passenger car. Enter list price, qualifying reductions, months and your marginal tax estimate.':'Beregn den skattepliktige fordelen i Norge i 2026 ved privat bruk av en vanlig firmabil. Oppgi listepris som ny, eventuelle reduksjoner som gjelder, antall måneder og din anslåtte marginalskatt.',
  'Estimate the Norwegian taxable salary benefit from private use of a standard company passenger car, then estimate personal tax with a marginal rate you enter.':'Beregn den skattepliktige lønnsfordelen etter norske regler for privat bruk av en vanlig firmabil. Estimer deretter personskatten med marginalskattesatsen du selv oppgir.',
  'What does this estimate?':'Hva beregner dette verktøyet?',
  'How the estimate works':'Slik beregnes estimatet',
  'The 2026 standard benefit is 30% of the reduced list price up to NOK 370,300, plus 20% of any excess. The list-price base is normally 100%; it is 75% if the car was more than three years old on 1 January or documented work driving exceeded 40,000 km, and 56.25% when both conditions apply. Enter whole months for a part-year. Estimated personal tax is the taxable benefit multiplied by your own marginal rate; this is not a full tax calculation.':'For 2026 er standardfordelen 30 % av redusert listepris opp til 370 300 NOK, pluss 20 % av beløpet over grensen. Beregningsgrunnlaget er normalt 100 % av listeprisen. Det reduseres til 75 % hvis bilen var eldre enn tre år 1. januar, eller hvis dokumentert yrkeskjøring oversteg 40 000 km. Når begge vilkårene gjelder, er grunnlaget 56,25 %. Oppgi hele måneder for et ufullstendig år. Anslått personskatt er den skattepliktige fordelen multiplisert med marginalskattesatsen du oppgir; dette er ikke en full skatteberegning.',
  'Norway scope and data date':'Norske regler og dato for satsene',
  'This is a Norway-specific planning estimate using Skatteetaten’s 2026 standard company-car rates, checked 16 October 2026. The rules do not depend on the language selected on this page. It is not an official tax return, full tax calculation or legal decision. Special vehicles and exceptions are excluded. Rates are static in this build and do not refresh in the background; check Skatteetaten for the current year before relying on them.':'Dette er et planleggingsestimat for Norge basert på Skatteetatens standardsatser for firmabil i 2026, kontrollert 16. oktober 2026. Reglene gjelder uavhengig av hvilket språk du velger på siden. Estimatet er ikke en offisiell skattemelding, full skatteberegning eller juridisk avgjørelse. Spesialkjøretøy og unntak er ikke tatt med. Satsene er faste i denne versjonen og oppdateres ikke automatisk; kontroller gjeldende satser hos Skatteetaten.',
  'Norwegian 2026 standard rules for passenger cars. This page does not infer your tax country from your language.':'Norske standardsatser for personbiler i 2026. Skattereglene bestemmes ikke ut fra språket du velger.',
  'Car list price when new, NOK':'Bilens listepris som ny, NOK',
  'Whole months the car was available, 1–12':'Hele måneder bilen var tilgjengelig, 1–12',
  'The car was more than 3 years old on 1 January':'Bilen var eldre enn 3 år 1. januar',
  'Documented work driving during the year, km':'Dokumentert yrkeskjøring i året, km',
  'I have a qualifying mileage log for the work driving':'Jeg har gyldig kjørebok for yrkeskjøringen',
  'Your estimated marginal tax rate, %':'Din anslåtte marginalskattesats, %',
  'Estimate company-car benefit':'Beregn firmabilfordel',
  'Reset inputs':'Nullstill feltene',
};
const spanishOverrides={
  'Norway Company Car Tax Calculator':'Calculadora del impuesto por coche de empresa en Noruega',
  'Norway Company Car Tax Calculator 2026 — Taxable Benefit Estimate':'Calculadora del impuesto por coche de empresa en Noruega 2026 — Estimación del beneficio imponible',
  'The 2026 standard benefit is 30% of the reduced list price up to NOK 370,300, plus 20% of any excess. The list-price base is normally 100%; it is 75% if the car was more than three years old on 1 January or documented work driving exceeded 40,000 km, and 56.25% when both conditions apply. Enter whole months for a part-year. Estimated personal tax is the taxable benefit multiplied by your own marginal rate; this is not a full tax calculation.':'En 2026, el beneficio estándar es el 30% del precio de lista reducido hasta 370.300 NOK, más el 20% del excedente. La base suele ser el 100% del precio de lista; se reduce al 75% si el coche tenía más de tres años el 1 de enero o si la conducción laboral documentada superó los 40.000 km, y al 56,25% cuando se cumplen ambas condiciones. Para un periodo parcial, introduce meses completos. El impuesto personal estimado es el beneficio imponible multiplicado por tu tipo marginal; no es un cálculo fiscal completo.',
  'This is a Norway-specific planning estimate using Skatteetaten’s 2026 standard company-car rates, checked 16 October 2026. The rules do not depend on the language selected on this page. It is not an official tax return, full tax calculation or legal decision. Special vehicles and exceptions are excluded. Rates are static in this build and do not refresh in the background; check Skatteetaten for the current year before relying on them.':'Esta estimación de planificación se limita a Noruega y usa las tarifas estándar de Skatteetaten para coches de empresa de 2026, revisadas el 16 de octubre de 2026. Las reglas no dependen del idioma de esta página. No es una declaración oficial, un cálculo fiscal completo ni una decisión legal. Se excluyen los vehículos especiales y las excepciones. Las tarifas de esta versión son estáticas y no se actualizan en segundo plano; verifica las del año vigente con Skatteetaten antes de usarlas.',
  'Norwegian 2026 standard rules for passenger cars. This page does not infer your tax country from your language.':'Reglas estándar noruegas de 2026 para coches de pasajeros. La página no deduce tu país fiscal a partir del idioma.',
};
const amharicOverrides={
  'The 2026 standard benefit is 30% of the reduced list price up to NOK 370,300, plus 20% of any excess. The list-price base is normally 100%; it is 75% if the car was more than three years old on 1 January or documented work driving exceeded 40,000 km, and 56.25% when both conditions apply. Enter whole months for a part-year. Estimated personal tax is the taxable benefit multiplied by your own marginal rate; this is not a full tax calculation.':'የ2026 መደበኛ ጥቅም ከተቀነሰው የዝርዝር ዋጋ እስከ 370,300 NOK 30% እና ከዚያ በላይ 20% ነው። የዝርዝር ዋጋ መሠረቱ በተለምዶ 100% ነው፤ መኪናው በጥር 1 ከሦስት ዓመት በላይ ከሆነ ወይም በሰነድ የተደገፈ የሥራ ጉዞ 40,000 ኪ.ሜ ከበለጠ 75% ይሆናል፤ ሁለቱም ሲፈጸሙ 56.25% ይሆናል። ለዓመት ከፊል ሙሉ ወራትን ያስገቡ። የግል ታክስ ግምቱ ታክስ የሚከፈልበትን ጥቅም በእርስዎ የኅዳግ ተመን በማባዛት ይሰላል፤ ይህ ሙሉ የታክስ ስሌት አይደለም።',
};
const digitStarts=[0x30,0x660,0x6f0,0x966,0x9e6,0xa66,0xae6,0xb66,0xbe6,0xc66,0xce6,0xd66,0xe50,0xed0,0xf20,0x1040,0x17e0,0x1810,0xff10];
const normalizeDigits=text=>[...text].map(ch=>{const cp=ch.codePointAt(0),start=digitStarts.find(x=>cp>=x&&cp<=x+9);return start===undefined?ch:String(cp-start)}).join('');
const numberTokens=text=>[...normalizeDigits(text).matchAll(/[0-9]+(?:[.,\s\u00a0\u202f\u066b\u066c][0-9]+)*/gu)].map(m=>m[0].replace(/[.,\s\u00a0\u202f\u066b\u066c]/gu,'')).sort();
const overrides={nb:bokmalOverrides,es:spanishOverrides,am:amharicOverrides};
const packs={};
for(const locale of locales){const row=captures[locale];if(!Array.isArray(row)||row.length!==sources.length)throw new Error(`${locale}: expected ${sources.length} source strings`);const dict={};for(let i=0;i<sources.length;i++){const source=sources[i],translated=(overrides[locale]?.[source]??row[i]).trim();if(!translated)throw new Error(`${locale}: empty at ${i}`);const expected=numberTokens(source),actual=numberTokens(translated);for(const num of expected){const need=expected.filter(x=>x===num).length,have=actual.filter(x=>x===num).length;if(have<need)throw new Error(`${locale}: number ${num} missing at ${i}: ${source} -> ${translated}`);}dict[source]=translated;}packs[locale]=dict;}
const introKey=norwayCompanyCarEnglish.fields.calculate;
if(new Set(Object.values(packs).map(p=>p[introKey])).size<locales.length-3)throw new Error('Too many duplicate translations for the calculate label.');
await writeFile(new URL('../../src/markets-no-ch/norway-company-car-translations.mjs',import.meta.url),`// Static machine-translated copy. Native review remains advisable; country rules stay Norway-scoped.\nexport const norwayCompanyCarTranslationsByLocale = Object.freeze(${JSON.stringify(packs)});\n`);
console.log(`Built ${sources.length} tool-specific strings × ${locales.length} locales; shared interface copy uses the established locale dictionary. Numeric values validated.`);

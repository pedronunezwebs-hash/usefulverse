import { readFile, writeFile } from 'node:fs/promises';
import { norwayEmployerCostEnglish } from '../../src/markets-no-ch/norway-employer-cost-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const sources = [...new Set(flatten(norwayEmployerCostEnglish))];
const locales = Object.keys(translationsByLocale).filter((locale) => locale !== 'en').sort();
const captures = JSON.parse(await readFile(new URL('../../src/markets-no-ch/norway-employer-cost-translation-captures.json', import.meta.url), 'utf8'));
const digitStarts = [0x30, 0x660, 0x6f0, 0x966, 0x9e6, 0xa66, 0xae6, 0xb66, 0xbe6, 0xc66, 0xce6, 0xd66, 0xe50, 0xed0, 0xf20, 0x1040, 0x17e0, 0x1810, 0xff10];
const normalizeDigits = (text) => [...text].map((character) => {
  const code = character.codePointAt(0);
  const start = digitStarts.find((candidate) => code >= candidate && code <= candidate + 9);
  return start === undefined ? character : String(code - start);
}).join('');
const numbers = (text) => [...normalizeDigits(text).matchAll(/[0-9]+(?:[.,\s\u00a0\u202f\u066b\u066c][0-9]+)*/gu)].map((match) => match[0].replace(/[.,\s\u00a0\u202f\u066b\u066c]/gu, '')).sort();
const tamilOverrides = new Map([
  [0, 'நார்வேயில் பணியாளரை நியமிப்பதற்கான செலவு கணிப்பான்'],
  [1, 'நார்வேயில் பணியாளரை நியமிப்பதற்கான செலவு கணிப்பான் 2026 — சம்பளம், விடுமுறை ஊதியம் மற்றும் முதலாளியின் பங்களிப்பு'],
  [2, '2026 ஆம் ஆண்டுக்கான நார்வே முதலாளி பங்களிப்பு மண்டல விகிதங்களைப் பயன்படுத்தி வருடாந்திர பணியாளர் செலவை மதிப்பிடுங்கள். விடுமுறை ஊதியம், ஓய்வூதியம், வரிக்குட்பட்ட ஊதியம் மற்றும் பிற செலவுகளைத் தெளிவான உள்ளீடுகளுடன் சேர்க்கவும்.'],
  [3, 'நார்வேயில் சம்பளம், விடுமுறை ஊதியம், ஓய்வூதிய பங்களிப்பு மற்றும் முதலாளியின் தேசிய காப்பீட்டு பங்களிப்பு (arbeidsgiveravgift) ஆகியவற்றை வைத்து வருடாந்திர பணியமர்த்தல் செலவை மதிப்பிடுங்கள்.'],
  [5, 'ஆண்டு மொத்த சம்பளத்தை உள்ளிட்டு, முதலாளியின் பதிவு செய்யப்பட்ட பங்களிப்பு மண்டலத்தையும் செயல்பாட்டு வகையையும் தேர்ந்தெடுக்கவும். விடுமுறை ஊதியம், ஓய்வூதியம் மற்றும் பிற ஊதியங்களையும் சேர்க்கவும். எடுத்துக்காட்டு: மண்டலம் I-இல் 1,000,000 NOK பங்களிப்பு அடிப்படைக்கு 14.1% என்றால் முதலாளியின் பங்களிப்பு 141,000 NOK.'],
  [18, 'நார்வேயின் முதலாளி பங்களிப்பு விகிதங்கள் ஆண்டுதோறும் மாறும்; மண்டலம் மற்றும் செயல்பாட்டைப் பொறுத்தும் வேறுபடும். இந்தக் கணிப்பான் 16 அக்டோபர் 2026 அன்று சரிபார்க்கப்பட்ட 2026 வரி ஆண்டின் வெளியிடப்பட்ட விகிதங்களைக் கொண்டுள்ளது. இது அதிகாரப்பூர்வ வரித்தாக்கலோ சட்ட ஆலோசனையோ அல்ல. தற்போதைய விகிதங்கள், மண்டலம், தகுதி மற்றும் நிறுவனத்திற்கான வரம்பை Skatteetaten-இல் சரிபார்க்கவும். விகிதங்கள் இங்கு நிலையாக உள்ளன; பின்னணியில் தானாகப் புதுப்பிக்கப்படுவதில்லை.'],
]);
const bengaliExample = 'মোট বার্ষিক মজুরি লিখুন, নিয়োগকর্তার নিবন্ধিত অবদান-জোন ও কার্যক্রমের ধরন বেছে নিন; তারপর ছুটির বেতন, পেনশন ও অন্যান্য পারিশ্রমিক যোগ করুন। উদাহরণ: Zone I-তে 1,000,000 NOK অবদান-ভিত্তির ওপর 14.1% হারে নিয়োগকর্তার অবদান 141,000 NOK।';
const bokmalOverrides = new Map([
  [2, 'Beregn arbeidsgiverens årlige kostnader i Norge med de publiserte satsene for arbeidsgiveravgift i 2026. Legg inn feriepenger, pensjon, skattepliktige ytelser og andre kostnader som gjelder for virksomheten.'],
  [3, 'Beregn årlige arbeidsgiverkostnader i Norge ut fra lønn, feriepenger, pensjonsinnskudd og arbeidsgiveravgift.'],
  [4, 'Hva inngår i beregningen?'],
  [5, 'Legg inn samlet årslønn, velg arbeidsgiverens registrerte avgiftssone og aktivitet, og fyll inn feriepenger, pensjon og andre ytelser. Eksempel: Et avgiftsgrunnlag på 1 000 000 NOK i sone I gir 141 000 NOK i arbeidsgiveravgift med satsen 14,1 %.'],
  [6, 'Slik beregnes estimatet'],
  [7, 'Beregningen bruker de publiserte 2026-satsene for ordinær virksomhet eller jordbruk og fiske. Inntekten som legges inn for feriepenger, skattepliktige ytelser og pensjonsinnskudd inngår i avgiftsgrunnlaget. For ordinær virksomhet i sone Ia brukes den differensierte satsen innenfor virksomhetens årlige fribeløp på 850 000 NOK. Oppgi hvor mye av fribeløpet som allerede er brukt. Estimatet gjelder norske regler; arbeidsgiverens registrerte adresse og aktivitet avgjør hvilken sone og sats som gjelder.'],
  [8, 'Vanlige spørsmål'],
  [9, 'Beregner dette nettolønnen til en ansatt?'],
  [11, 'Hvilken avgiftssone skal jeg velge?'],
  [12, 'Velg sonen som gjelder for arbeidsgiverens registrerte virksomhetsadresse, ikke den ansattes språk eller bostedsland. Kontroller kommunen hos Skatteetaten før du bruker estimatet.'],
  [13, 'Må alle arbeidsgivere betale 2 % til pensjon?'],
  [14, 'Nei. Plikten til å ha obligatorisk tjenestepensjon avhenger av om arbeidsgiveren og de ansatte omfattes av vilkårene. Oppgi bare en pensjonssats når den gjelder; den faktiske premien kan være annerledes.'],
  [15, 'Er feriepenger og alle kostnader ved ansettelse inkludert automatisk?'],
  [16, 'Nei. Du legger selv inn feriepengegrunnlag og -sats, pensjonsgrunnlag og andre kostnader. Forsikring, lønnssystem, særskilte ytelser, unntak og individuelle grenser beregnes ikke fullt ut.'],
  [17, 'Avgrensning og dato for satsene'],
  [18, 'Arbeidsgiveravgiften i Norge fastsettes for hvert inntektsår og varierer etter sone og aktivitet. Denne kalkulatoren bruker satsene for 2026, kontrollert 16. oktober 2026. Dette er et planleggingsestimat, ikke en offisiell beregning, innlevering eller juridisk avgjørelse. Kontroller gjeldende sats, sone, vilkår og fribeløp hos Skatteetaten. Satsene ligger fast i denne versjonen og oppdateres ikke automatisk.'],
  [20, 'Beregn arbeidsgiverkostnad'],
  [26, 'Samlet brutto årslønn, NOK'],
  [27, 'Feriepengegrunnlag, NOK'],
  [28, 'Feriepengesats, %'],
  [29, 'Andre skattepliktige ytelser, NOK'],
  [30, 'Pensjonsgrunnlag, NOK'],
  [31, 'Arbeidsgivers pensjonssats, %'],
  [33, 'Sone for arbeidsgiveravgift'],
  [34, 'Type virksomhet'],
  [36, 'Jordbruk og fiske (særskilte publiserte satser)'],
  [44, 'Fribeløp for sone Ia som virksomheten allerede har brukt i år, NOK'],
  [47, 'Oppgi årssummene og velg arbeidsgiverens sone og type virksomhet.'],
  [48, 'Årsestimat'],
  [49, 'Bruttolønn'],
  [50, 'Beregnet feriepenger'],
  [51, 'Andre skattepliktige ytelser'],
  [52, 'Arbeidsgivers pensjonsinnskudd'],
  [53, 'Grunnlag for arbeidsgiveravgift'],
  [54, 'Arbeidsgiveravgift'],
  [55, 'Andre arbeidsgiverbetalte kostnader'],
  [56, 'Anslåtte årlige arbeidsgiverkostnader'],
  [57, 'Gjennomsnittlig kostnad per måned'],
  [58, 'Effektiv sats for arbeidsgiveravgift'],
  [59, 'Fribeløp brukt i dette scenarioet'],
  [60, 'Fribeløp som gjenstår i dette estimatet'],
  [61, 'Inntektsår'],
  [62, 'Satsene ble kontrollert'],
  [63, 'Kontroller at alle beløp er gyldige tall som er null eller større, og at prosentene er innenfor angitt område.'],
  [64, 'Fribeløpet på 850 000 NOK gjelder per virksomhet, ikke per ansatt. Oppgi hvor mye virksomheten allerede har brukt i inneværende kalenderår.'],
  [65, 'Avgiftssonene følger arbeidsgiverens registrerte adresse. Bruk Skatteetatens kommunesøk; siden gjetter ikke sone ut fra språk.'],
  [66, 'Feriepengesats og pensjonssats kan endres. Bruk satsene og grunnlagene som gjelder for arbeidsavtalen og pensjonsordningen.'],
  [68, 'Sammenlign et annet tilbud'],
  [70, 'Sammenligning av tilbud'],
  [71, 'Begge tilbud bruker arbeidsgiverens sone og type virksomhet valgt ovenfor. Fribeløpet i sone Ia brukes separat i hvert alternativ; tilbudene er alternative scenarioer og skal ikke summeres.'],
  [72, 'Tilbud A'],
  [73, 'Forskjell (B − A)'],
]);

if (Object.keys(captures).sort().join(',') !== locales.join(',')) throw new Error('Norway employer-cost captures must cover all 36 non-English locales.');
const packs = {};
for (const locale of locales) {
  const row = captures[locale];
  if (!Array.isArray(row) || row.length !== sources.length) throw new Error(`${locale}: expected ${sources.length} captured strings.`);
  const dictionary = {};
  sources.forEach((source, index) => {
    let translated = locale === 'ta' && tamilOverrides.has(index) ? tamilOverrides.get(index) : locale === 'bn' && index === 5 ? bengaliExample : locale === 'nb' && bokmalOverrides.has(index) ? bokmalOverrides.get(index) : row[index];
    if (typeof translated !== 'string' || !translated.trim()) throw new Error(`${locale}: empty translation at ${index}.`);
    const expectedCounts = new Map();
    numbers(source).forEach((number) => expectedCounts.set(number, (expectedCounts.get(number) ?? 0) + 1));
    const translatedCounts = new Map();
    numbers(translated).forEach((number) => translatedCounts.set(number, (translatedCounts.get(number) ?? 0) + 1));
    for (const [number, count] of expectedCounts) if ((translatedCounts.get(number) ?? 0) < count) throw new Error(`${locale}: numeric value ${number} missing at ${index}: ${source} -> ${translated}`);
    dictionary[source] = translated.trim();
  });
  if (locale === 'nb') {
    dictionary[norwayEmployerCostEnglish.name] = 'Kalkulator for arbeidsgiverkostnader i Norge';
    dictionary[norwayEmployerCostEnglish.title] = 'Kalkulator for arbeidsgiverkostnader i Norge 2026 – lønn, feriepenger og arbeidsgiveravgift';
  }
  packs[locale] = dictionary;
}
if (new Set(Object.values(packs).map((dictionary) => dictionary[norwayEmployerCostEnglish.fields.compareOffers])).size < locales.length - 4) throw new Error('The compare-offers label is repeated across too many locales; verify that each capture came from its selected target language.');

await writeFile(new URL('../../src/markets-no-ch/norway-employer-cost-translations.mjs', import.meta.url), `// Static machine translations. Rates and terms stay jurisdiction-scoped; native review is still advisable.\nexport const norwayEmployerCostTranslationsByLocale = Object.freeze(${JSON.stringify(packs)});\n`);
console.log(`Built ${sources.length} strings for ${locales.length} non-English locales with numeric-value validation.`);

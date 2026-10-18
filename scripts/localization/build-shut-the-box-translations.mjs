import { readFile, writeFile } from 'node:fs/promises';
import { shutTheBoxEnglish } from '../../src/markets-no-ch/shut-the-box-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const sources = [...new Set(flatten(shutTheBoxEnglish))];
const locales = Object.keys(translationsByLocale).sort();
const captures = JSON.parse(await readFile(new URL('../../src/markets-no-ch/shut-the-box-translation-captures.json', import.meta.url), 'utf8'));
const placeholders = new Map([
  ['ZXV000ZX', '{total}'], ['ZXV001ZX', '{number}'], ['ZXV002ZX', '{state}'],
  ['ZXV003ZX', '{score}'], ['ZXV004ZX', '{player}'], ['ZXV005ZX', '{round}'], ['ZXV006ZX', '{winner}'],
]);

// Tamil MT confused dice with a hill/blanket and game tiles with unrelated objects.
// These compact, repeated controls and rules are corrected before the static pack is generated.
const tamilOverrides = new Map([
  [0, 'பெட்டியை மூடு (Shut the Box)'],
  [1, 'Shut the Box ஆன்லைன் — இலவச பகடை மற்றும் எண் கட்டை விளையாட்டு'],
  [2, 'பகடை விதிகளைத் தெளிவாகத் தேர்ந்தெடுத்து Shut the Box விளையாடுங்கள். ஒவ்வொரு வீச்சின் மொத்தத்திற்குச் சமமாகும் திறந்த எண் கட்டைகளை மூடுங்கள். தனியாகப் பயிற்சி செய்யுங்கள் அல்லது இதே சாதனத்தில் உள்ளூர் கணினி எதிரியுடன் மாறிமாறி விளையாடுங்கள். உங்கள் புள்ளிகள் இந்தச் சாதனத்திலேயே இருக்கும்.'],
  [3, 'பகடைகளை உருட்டுங்கள். அதன் மொத்தத்திற்குச் சரியாகக் கூடும் ஒன்று அல்லது அதற்கு மேற்பட்ட திறந்த எண் கட்டைகளை மூடுங்கள்.'],
  [4, 'ஏழு வரும் பகடை வீச்சு'],
  [5, '7 வந்தால், 7 என்ற கட்டையை மூடலாம் அல்லது 3 மற்றும் 4 என்ற கட்டைகளை மூடலாம். தேர்ந்தெடுக்கும் கட்டைகள் திறந்திருக்க வேண்டும்; அவற்றின் கூட்டுத்தொகை பகடை வீச்சுக்குச் சரியாகச் சமமாக வேண்டும்.'],
  [7, 'தொடங்குவதற்கு முன் பகடை விதியைத் தேர்ந்தெடுக்கவும். ஒவ்வொரு முறையும் பகடைகளை உருட்டி, விதிப்படி சரியான கூட்டுத்தொகை கொண்ட கட்டைகளை மூடுங்கள். பொருந்தும் கூட்டுத்தொகை எதுவும் இல்லாவிட்டால் உங்கள் முறை முடியும்; மீதமுள்ள கட்டைகளின் எண்களே அந்தச் சுற்றுக்கான உங்கள் புள்ளிகள். குறைந்த மொத்தப் புள்ளிகள் பெற்றவர் வெல்வார். தனியாகப் பயிற்சி செய்யலாம் அல்லது இதே சாதனத்தில் உள்ளூர் கணினியுடன் மாறிமாறி விளையாடலாம்.'],
  [10, 'ஆம். Shut the Box விளையாட்டில் வீட்டுக்கு வீடு மாறும் விதிகள் உள்ளன. இங்கே பயன்படுத்தப்படும் விதி தெளிவாகக் காட்டப்படும்: எப்போதும் இரண்டு பகடைகள்; 7, 8, 9 கட்டைகளை மூடியதும் ஒரு பகடை; அல்லது திறந்திருக்கும் கட்டைகளின் மொத்தம் 6 அல்லது அதற்குக் குறைந்ததும் ஒரு பகடை.'],
  [18, 'இந்த உலாவிப் பதிப்பில் 1 முதல் 9 வரை எண் கொண்ட கட்டைகள் உள்ளன. பலகை மற்றும் குழுவைப் பொறுத்து விதிகள் மாறலாம்; எனவே விளையாடுவதற்கு முன் தேர்ந்தெடுத்த பகடை விதி காட்டப்படும். கணக்கு, இணைய எதிரி, பணம், பரிசு அல்லது பதிவேற்றம் எதுவும் இல்லை. கணினி எதிரி இந்தச் சாதனத்திலேயே இயங்கி, விதிப்படி சரியான நகர்வுகளைத் தேர்ந்தெடுக்கிறது.'],
  [29, 'பகடை விதி'], [30, 'எப்போதும் இரண்டு பகடைகளை உருட்டு'], [31, '7, 8, 9 கட்டைகள் மூடப்பட்ட பிறகு ஒரு பகடை'], [32, 'திறந்த கட்டைகளின் மொத்தம் 6 அல்லது அதற்குக் குறைவாக இருக்கும்போது ஒரு பகடை'],
  [40, 'பகடைகளை உருட்டு'], [41, 'தேர்ந்தெடுத்த கட்டைகளை மூடு'], [42, 'தேர்வை நீக்கு'], [48, 'திறந்த கட்டைகள்'], [49, 'பகடைகள்'], [51, 'உங்கள் முறை. பகடைகளை உருட்டுங்கள்.'],
  [52, '{total} ஆகும் திறந்த கட்டைகளைத் தேர்ந்தெடுக்கவும்.'], [53, 'கட்டை {number}, {state}'], [54, 'திறந்தது'], [55, 'மூடப்பட்டது'],
  [58, 'அந்தக் கட்டைகளின் கூட்டுத்தொகை {total} ஆக இருக்க வேண்டும்.'],
  [59, 'திறந்திருக்கும் கட்டைகளில் {total} ஆகும் கூட்டுத்தொகை இல்லை. இந்தச் சுற்றில் உங்கள் முறை {score} புள்ளிகளுடன் முடிகிறது.'],
  [60, 'எல்லா கட்டைகளையும் மூடிவிட்டீர்கள்! பெட்டியை மூடி இந்தச் சுற்றில் வென்றுவிட்டீர்கள்.'],
  [61, 'கணினி எல்லா கட்டைகளையும் மூடி இந்தச் சுற்றில் வென்றது.'],
  [62, '{player} இந்தச் சுற்றை {score} புள்ளிகளுடன் முடித்தார்.'], [64, 'சுற்று {round} முடிந்தது. {player} பெற்ற புள்ளிகள்: {score}.'],
  [65, 'விளையாட்டு முடிந்தது. {score} புள்ளிகளுடன் {winner} வெற்றி பெற்றார்.'], [66, 'விளையாட்டு முடிந்தது. இருவரும் {score} புள்ளிகளுடன் சமநிலையில் உள்ளனர்.'],
  [69, 'குறைந்தது ஒரு திறந்த கட்டையையாவது தேர்ந்தெடுக்கவும்.'], [75, 'உங்கள் கட்டைகள்'], [76, 'கணினியின் கட்டைகள்'], [77, 'போட்டிப் புள்ளிகள்'],
  [78, 'கிடைக்கும் கட்டைகளில் மிக அதிகமான மொத்தத்தை மூடும் விதிப்படி சரியான நகர்வை உள்ளூர் கணினி தேர்ந்தெடுக்கிறது.'],
]);
const localizedNames = Object.freeze({
  ca: 'Tanca la caixa (Shut the Box)', de: 'Klappenspiel (Shut the Box)', id: 'Tutup kotaknya (Shut the Box)',
  it: 'Chiudi la scatola (Shut the Box)', ms: 'Tutup kotak (Shut the Box)', nb: 'Lukk boksen (Shut the Box)',
  nl: 'Sluit de doos (Shut the Box)', sv: 'Stäng lådan (Shut the Box)', ta: 'பெட்டியை மூடு (Shut the Box)',
});

if (Object.keys(captures).sort().join(',') !== locales.join(',')) throw new Error('Shut the Box captures do not cover the expected 36 non-English locales.');
const packs = {};
for (const locale of locales) {
  const row = captures[locale];
  if (!Array.isArray(row) || row.length !== sources.length) throw new Error(`${locale}: expected ${sources.length} captured strings.`);
  const dictionary = {};
  sources.forEach((source, index) => {
    let translated = locale === 'ta' && tamilOverrides.has(index) ? tamilOverrides.get(index) : row[index];
    if (typeof translated !== 'string' || !translated.trim()) throw new Error(`${locale}: empty translation at ${index}.`);
    for (const [marker, placeholder] of placeholders) translated = translated.replaceAll(marker, placeholder);
    const expectedTokens = source.match(/\{[^{}]+\}/gu) ?? [];
    for (const token of expectedTokens) if (!translated.includes(token)) throw new Error(`${locale}: lost ${token} at source ${index}.`);
    if (/ZXV\d+ZX/u.test(translated)) throw new Error(`${locale}: unresolved protected marker at source ${index}.`);
    dictionary[source] = translated.trim();
  });
  const sourceTitle = shutTheBoxEnglish.title;
  if (localizedNames[locale]) dictionary[shutTheBoxEnglish.name] = localizedNames[locale];
  const localizedName = dictionary[shutTheBoxEnglish.name];
  const rawTitle = dictionary[sourceTitle];
  const sourceName = shutTheBoxEnglish.name;
  const escapedNames = [localizedName, sourceName].map((name) => name.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&'));
  const tail = rawTitle.replace(new RegExp(`^(?:${escapedNames.join('|')})\\s*[—–:·-]?\\s*`, 'iu'), '').trim();
  dictionary[sourceTitle] = tail ? `${localizedName} — ${tail}` : localizedName;
  packs[locale] = dictionary;
}

await writeFile(new URL('../../src/markets-no-ch/shut-the-box-translations.mjs', import.meta.url), `// Static machine translations; house-rule variants are named and explained. Native review is still advisable.\nexport const shutTheBoxTranslationsByLocale = Object.freeze(${JSON.stringify(packs)});\n`);
console.log(`Built ${sources.length} static strings for ${locales.length} non-English locales.`);

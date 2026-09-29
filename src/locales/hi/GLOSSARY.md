# UsefulVerse · Hindi (hi, हिन्दी, hi-IN) · glossary, style guide and keyword research

Owner: research role. Every agent writing `src/locales/hi/*` follows this file.
One decision per item. If something here conflicts with the tool's real behaviour
(`src/template.mjs` toolMarkup, `src/app.js`), the behaviour wins: fix the copy, never the claim.

---

## 0. The 12 rules (read these first)

1. **Register**: standard, everyday Hindi with **आप**. Polite imperative **-ें / -एं** on buttons and instructions (करें, चुनें, बनाएं, हटाएं). Never तुम / -ओ, never -इए / कीजिए.
2. **Loanwords over coinages**: use the English loan that Indians actually use, in Devanagari (टूल, टेक्स्ट, पासवर्ड, कॉपी, पेस्ट, लिंक, ब्राउज़र, कैलकुलेटर, कन्वर्टर, जनरेटर). Never उपकरण (tool), प्रतिलिपि (copy), चिपकाएं (paste), संगणक. Use native Hindi for everyday concepts (तारीख, समय, शब्द, संख्या, प्रतिशत, औसत, अनुपात, लंबाई, वज़न, तापमान, नतीजा, सवाल).
3. **Sentence end = `।`** (U+0964 purna viram), not `.` and never a pipe `|`. `?` and `!` stay ASCII. No space before `। ? ! : ;`, one space after.
4. **Nukta**: write **ज़ and फ़** in loanwords where the sound is z/f (ब्राउज़र, हज़ार, ज़ोन, साइज़, ज़्यादा, मज़बूत, वज़न, रोज़, तेज़, फ़ाइल, फ़ॉर्मेट, फ़्री, मुफ़्त, साफ़, सिर्फ़, फ़र्क, फ़ुट, फ़ारेनहाइट, फ़रवरी). **No nukta on क ख ग** (तारीख, खास, गलत, गज). ड़ and ढ़ are native letters, not optional nukta: always write them (पढ़ें, बढ़ोतरी, जोड़ें, करोड़, अड़तीस). Always save text in NFC (the nukta is a combining mark U+093C after the letter; never the precomposed U+0958–U+095F).
5. **Chandrabindu** only in: यहाँ, वहाँ, कहाँ, जहाँ, हाँ, पाँच. Everything else uses anusvara: बनाएं, हटाएं, जाएं, जांचें, बांटें, लाइनें, पंक्तियां, संख्याएं, मात्राएं.
6. **Digits**: Latin 0–9 with **Indian grouping** (1,00,000 · 12,34,567 · 10,00,00,00,00,000). Decimal point `.`. Never Devanagari digits (०१२) in copy.
7. **Product/tech names stay in Latin script** (UsefulVerse, JSON, CSV, Base64, URL, HTML, UUID, SHA-256, JWT, HEX, RGB, HSL, PNG, QR, Unix, UTC, IST, UTM, Excel, PDF, WhatsApp). Put a space before the Hindi postposition: `JSON को`, `URL में`, `5 UUID`.
8. **Placeholders** end with `…` (U+2026), no `।` after it.
9. **Keywords field** (`copy[id][3]`) = comma-separated real queries: Devanagari + Latin English + Hinglish, including no-nukta spellings (मुफ्त, फॉर्मेट, हजार) because that is what people type. Visible copy always uses the canonical spellings of this file.
10. **H1 (`copy[id][0]`)** may be a noun name or an action (“… हटाएं”); **short title (`copy[id][1]`) must be a plain noun phrase** (it is inserted into “{name} कैसे इस्तेमाल करें?”). Neither may contain an internal “X का/की + noun” structure (breaks agreement when a postposition follows).
11. **Honesty**: never claim what a tool can’t do (see §8 “do not claim” list). Hindi-specific traps: character counts include मात्राएं; case conversion works only on English letters; the slug tool drops Devanagari unless the option is ticked; the average list treats commas as separators.
12. **Length**: `<title>` = `${seo.title} | UsefulVerse` must be 15–65 JS chars → **seo.title ≤ 51** (aim ≤ 50). Meta description 110–155 JS chars. Devanagari counts every मात्रा, हलंत and nukta as a char: always measure with `node -e 'console.log("…".length)'`.

---

## 1. Market and search reality (India)

- Hindi is the most-spoken language of India; Devanagari search exists but **most tool searches in India are typed in English (Latin), then Hinglish (Latin Hindi: “percentage kaise nikale”), then Devanagari** (“प्रतिशत कैलकुलेटर”). Local competitors confirm the pattern: Hindi tool pages name the tool with a **Devanagari transliteration of the English term** (वर्ड काउंटर, पासवर्ड जनरेटर, QR कोड जनरेटर, कलर कन्वर्टर) and use native Hindi only where school/everyday Hindi has a strong word (प्रतिशत, औसत, अनुपात, अभाज्य संख्या, रोमन अंक, तारीख).
- Competitor naming observed (Sept 2026): “वर्ड काउंटर (Word Counter) और कैरेक्टर काउंटर” (wordscountertool.com/hi), “प्रतिशत कैलकुलेटर” (hi.piliapp.com, okcalc.com/hi), “रैंडम पासवर्ड जनरेटर | मज़बूत पासवर्ड बनाएं” (avast.com/hi-in), “Password Generator Hindi – स्ट्रांग पासवर्ड बनाएं” (ramtoriya.com), “संख्या से हिंदी शब्द कनवर्टर” (converteraz.com), “Number to Words in Hindi | Amount to Words” (num2word.com), “रोमन अंक परिवर्तक” (rapidtables.org/hi), “तारीख अंतर कैलकुलेटर — दो तारीखों के बीच के दिन” (hourzone.io/hi), “यूनिट कन्वर्टर / इकाई परिवर्तक” (hindietools, toolsnak), “टेक्स्ट तुलना” (text-compare.com), “Base64 एन्कोड ऐंड डिकोड” (base64encode.org).
- **Strategy that follows from this**:
  - Everyday/maths tools (percentage, average, ratio, prime, Roman, number-to-words, date, duration, unit, QR, random, password, word counter, case, time zone): **Devanagari primary keyword leads** H1 and title.
  - Developer tools (JSON, Base64, URL encode, HTML entity, CSV/JSON, UUID, SHA-256, regex, JWT, URL parser, timestamp, slug): Devanagari demand is **weak**; people type the English term. **seo.title leads with the Latin English term** (“JSON Formatter – …”), H1 uses Devanagari transliteration (“JSON फ़ॉर्मेटर और वैलिडेटर”), and keywords carry both.
- India-specific use cases worth writing about (all supported by real behaviour): marks percentage, discounts and salary hikes; UPSC/State PSC answer word limits; cheque amounts in Hindi words (Indian lakh/crore system); Indian mobile-number regex `^[6-9]\d{9}$`; IST ↔ US/UK/Australia call scheduling (IT/BPO, NRI families); fever °F ↔ °C; height in feet ↔ cm; cement–sand style ratios; train journeys that cross midnight; Hindi (Devanagari) URLs that show up as `%E0%A4…`.
- High-demand Indian queries we **cannot** serve (don’t target, don’t imply): age calculator (उम्र कैलकुलेटर: years-months-days), area units (बीघा, एकड़, गज², स्क्वायर फ़ुट), GST calculator, EMI/SIP calculators, UPI payment QR, plagiarism checker, Hindi typing/transliteration, CGPA to percentage, currency converter.

---

## 2. Style guide

### 2.1 Tone
Friendly, direct, short sentences. Explain like a helpful senior colleague, not a textbook. One idea per sentence. Avoid heavy Sanskritized words where a common word exists (इस्तेमाल not प्रयोग/उपयोग in headings; ज़रूरत not आवश्यकता; आसान not सरल in marketing lines — सरल is fine in maths: “अनुपात को सरल करें”).

### 2.2 UI element forms
| Element | Form | Example |
|---|---|---|
| Button | polite imperative, object first if needed | कॉपी करें · पासवर्ड बनाएं · साफ़ करें · JSON फ़ॉर्मेट करें |
| Field label | noun phrase, no final punctuation | आपका टेक्स्ट · शुरुआती तारीख · लंबाई: (keep a colon only if English has one) |
| Placeholder | instruction or example + `…` | यहाँ टेक्स्ट लिखें या पेस्ट करें… |
| Status (success) | full sentence, past/perfective + `।` | कॉपी हो गया। · पासवर्ड आपके ब्राउज़र में बना। |
| Status (error) | say what to do + `।` | सही तारीख चुनें। · पहले टेक्स्ट पेस्ट करें। |
| Headings/eyebrows | no `।` unless the English has a period (hero lines) | सवाल-जवाब |
| Checkbox | action/state phrase | खाली लाइनें हटाएं · सिर्फ़ पूर्ण संख्या |

### 2.3 Punctuation and spacing
- `।` ends Hindi sentences; `?` `!` ASCII; comma `,`; colon `:`; semicolon rare.
- No space before `। ? ! : ;` and no space inside parentheses: `(कोलकाता)`.
- Quotation marks for UI names inside a sentence: curly “ ” — `“कॉपी करें” पर क्लिक करें।` Nested: ‘ ’.
- Dash: in titles use ` – ` (en dash, spaces both sides) as separator. `homeTitle` is keyword first, brand last: `… | UsefulVerse` (the brand has no recognition in India yet; same order as ja/ko). Avoid em dashes in body copy; use a comma or a new sentence.
- Hyphen for paired words: सवाल-जवाब, कैपिटल-स्मॉल, आगे-पीछे, बार-बार, साइन-अप.
- Ellipsis: single char `…` in placeholders and “progress” states.
- `%` directly after the number: `15%`. Degree: `38°C`, `100.4°F`. Units with a space: `256 px`, `5 मिनट`, `2 किमी`.
- Line breaks inside strings only where the English has `\n`.

### 2.4 Numbers, dates, time
- Latin digits; Indian grouping (`Intl.NumberFormat('hi-IN')` output: 12,34,567). In prose ranges write “1 से 100 तक”; in tight labels `1–100`.
- Big limits written the Indian way: 3,999 · 1,00,000 · 9,99,99,99,99,999 · 10,00,00,00,00,000 (= एक लाख करोड़ / दस खरब).
- Currency: `₹1,50,000` (no space). Paise not supported by any tool.
- Dates in prose: `29 सितंबर 2026`; numeric `29/09/2026` (DD/MM/YYYY — never MM/DD). Weekday form from Intl: `मंगलवार, 29 सितंबर 2026`.
- Months (CLDR spellings, use exactly): जनवरी, फ़रवरी, मार्च, अप्रैल, मई, जून, जुलाई, अगस्त, सितंबर, अक्टूबर, नवंबर, दिसंबर. Days: रविवार, सोमवार, मंगलवार, बुधवार, गुरुवार, शुक्रवार, शनिवार.
- Time in prose: 12-hour with part of day (सुबह 9:30, दोपहर 2 बजे, शाम 6 बजे, रात 8:30) or 24-hour in technical copy. India = **IST (UTC+5:30), no daylight saving**.

### 2.5 English terms and names
- Keep Latin: brand/product/standard names and acronyms (see rule 7). Do not transliterate acronyms (not “जेसन”, not “यूआरएल”) — exception: “QR” may appear as क्यूआर only inside keywords.
- Transliterate common English nouns/verbs the way Indian media spells them (see §4 canonical spellings). Use `ॉ` for the “aw/o” sound: कॉपी, ऑनलाइन, लॉगिन, फ़ॉर्मेट, प्रोटोकॉल, ऑक्टल.
- Latin terms never take Hindi plural endings: `5 UUID`, `3 मैच`, `JSON keys`.
- In developer copy a raw technical token may stay in Latin inside a Hindi sentence when it is what the user sees on screen: `key`, `value`, `true/false`, `g`, `i`, `m` flags, `utm_source`.
- No Hinglish in Latin script in visible copy (only in the keywords field).

### 2.6 Gender and agreement (for statuses)
Loans: टूल (m), टेक्स्ट (m), पासवर्ड (m), लिंक (m), कोड (m), QR कोड (m), नतीजा (m), हैश (m), टोकन (m), स्लग (m), रंग/कलर (m), डेटा (m), अपलोड (m), ब्राउज़र (m), डिवाइस (m) · लाइन (f), फ़ाइल (f), तारीख (f), लिस्ट (f), संख्या (f), पंक्ति (f), इमेज (f), वैल्यू (f), अवधि (f), जानकारी (f), कैटेगरी (f).
Examples: “पासवर्ड बन गया।” “लिंक कॉपी हो गया।” “नई तारीख तैयार है।” (not “तारीख निकल गई”, which reads as “the date has passed”) “लाइनें हटा दी गईं।”

---

## 3. Terminology (use exactly these)

| # | English | Hindi | Notes |
|---|---|---|---|
| 1 | tool / tools | टूल (m, plural unchanged) | “सभी टूल”, never उपकरण |
| 2 | browser | ब्राउज़र (m) | |
| 3 | in your browser / locally | आपके ब्राउज़र में ही | device-centric: “आपके डिवाइस पर ही” |
| 4 | runs in your browser | आपके ब्राउज़र में ही चलता है | |
| 5 | copy (button) | कॉपी करें | |
| 6 | copied | कॉपी हो गया | “Copied to your clipboard.” → “क्लिपबोर्ड पर कॉपी हो गया।” |
| 7 | copy result | नतीजा कॉपी करें | |
| 8 | paste | पेस्ट करें | never चिपकाएं |
| 9 | clear (button) | साफ़ करें | |
| 10 | convert (button) | बदलें | “रोमन में बदलें”, “JSON में बदलें” |
| 11 | converter | कन्वर्टर (m) | not कनवर्टर / परिवर्तक |
| 12 | converted (status) | बदल दिया गया / … में बदल गया | “Conversion complete.” → “बदल दिया गया।” |
| 13 | result | नतीजा (m), pl. नतीजे | not परिणाम in UI |
| 14 | text | टेक्स्ट (m) | |
| 15 | line / lines | लाइन (f) / लाइनें | for text lines; spreadsheet row = पंक्ति |
| 16 | row / column | पंक्ति (f) / कॉलम (m) | CSV/JSON tools |
| 17 | character(s) | कैरेक्टर (m, plural unchanged) | not अक्षर (counts include मात्राएं) |
| 18 | letter (alphabet) | अक्षर (m); in case context लेटर | “कैपिटल लेटर”, “स्मॉल लेटर” |
| 19 | word(s) | शब्द (m) | |
| 20 | space | स्पेस (m) | “स्पेस के बिना” |
| 21 | line break | लाइन ब्रेक (m) | |
| 22 | paragraph | पैराग्राफ़ (m) | |
| 23 | list | लिस्ट (f) | |
| 24 | upload / no upload | अपलोड / कोई अपलोड नहीं | “बिना अपलोड” in taglines |
| 25 | download | डाउनलोड करें | “PNG डाउनलोड करें” |
| 26 | private | निजी | “Private by design” → “प्राइवेसी सबसे पहले” |
| 27 | privacy | प्राइवेसी (f) | category name too |
| 28 | account / sign-up / login | अकाउंट (m) / साइन-अप / लॉगिन | “न अकाउंट, न अपलोड” |
| 29 | server | सर्वर (m) | |
| 30 | device | डिवाइस (m) | |
| 31 | clipboard | क्लिपबोर्ड (m) | |
| 32 | free | मुफ़्त | keywords add मुफ्त, फ्री, free |
| 33 | fast | तेज़ | |
| 34 | simple / easy | आसान | |
| 35 | generate (button) | बनाएं | random number: “नंबर निकालें” |
| 36 | generator | जनरेटर (m) | not जेनरेटर |
| 37 | generated locally | आपके ब्राउज़र में ही बना | |
| 38 | encode / encoder | एनकोड करें / एनकोडर (m) | not एन्कोड |
| 39 | decode / decoder | डिकोड करें / डिकोडर (m) | not डीकोड |
| 40 | format (verb / noun) | फ़ॉर्मेट करें / फ़ॉर्मेट (m) | formatter = फ़ॉर्मेटर |
| 41 | minify | मिनिफ़ाई करें | |
| 42 | validate / validator | वैलिडेट करें / वैलिडेटर (m) | non-dev: जांचें |
| 43 | valid / invalid | सही / सही नहीं | avoid मान्य/अमान्य |
| 44 | check (verb) | जांचें | checker = चेकर (m) |
| 45 | input / output | इनपुट (m) / आउटपुट (m) | |
| 46 | example / e.g. | उदाहरण (m) / जैसे | |
| 47 | enter (a value) | डालें | never दर्ज करें |
| 48 | type (write) | लिखें | |
| 49 | choose / select | चुनें | |
| 50 | click / tap | क्लिक करें / टैप करें | |
| 51 | calculate (button) | कैलकुलेट करें | |
| 52 | calculator | कैलकुलेटर (m) | |
| 53 | calculation done | हिसाब तैयार है | “Calculation complete.” |
| 54 | number (maths) | संख्या (f) | fixed names keep नंबर: रैंडम नंबर, नंबर (0-9) |
| 55 | whole number | पूर्ण संख्या (f) | “सिर्फ़ पूर्ण संख्या” |
| 56 | integer | पूर्णांक (m) | binary converter |
| 57 | decimal (fraction) | दशमलव संख्या | number base 10 = डेसिमल |
| 58 | percent / percentage | प्रतिशत (m) · symbol % | keywords add परसेंटेज |
| 59 | percentage change | प्रतिशत बदलाव (m) | increase/decrease = बढ़ोतरी/कमी |
| 60 | average / mean | औसत (m) / माध्य (m) | |
| 61 | sum / count | जोड़ (m) / गिनती (f) | |
| 62 | minimum / maximum | न्यूनतम / अधिकतम | |
| 63 | ratio / proportion | अनुपात (m) / समानुपात (m) | |
| 64 | value (maths / data) | मान (m) / वैल्यू (f) | “X का मान”, “JSON वैल्यू” |
| 65 | prime number / not prime | अभाज्य संख्या / अभाज्य संख्या नहीं है | 0 and 1 are neither prime nor composite — never say भाज्य for “Not prime” |
| 66 | Roman numeral | रोमन अंक (m) | |
| 67 | binary / octal / decimal / hexadecimal | बाइनरी / ऑक्टल / डेसिमल / हेक्साडेसिमल | “बाइनरी (2)” etc. |
| 68 | base (number base) | बेस (m) | “From base” → “किस बेस से”, “To base” → “किस बेस में” |
| 69 | date | तारीख (f) | not दिनांक/तिथि in UI |
| 70 | start date / end date | शुरुआती तारीख / अंतिम तारीख | |
| 71 | start / end (labels) | शुरुआत / अंत | |
| 72 | time | समय (m) | |
| 73 | duration | अवधि (f) | |
| 74 | day(s) / hour(s) / minute(s) / second(s) / millisecond(s) | दिन / घंटा, घंटे / मिनट / सेकंड / मिलीसेकंड | |
| 75 | time zone | टाइम ज़ोन (m) | two words |
| 76 | daylight saving time | डेलाइट सेविंग टाइम (DST) | |
| 77 | local time | स्थानीय समय | |
| 78 | link / URL | लिंक (m) / URL (m) | |
| 79 | password | पासवर्ड (m) | |
| 80 | strong / good (strength) | मज़बूत / अच्छा | |
| 81 | uppercase / lowercase (password sets) | कैपिटल लेटर (A-Z) / स्मॉल लेटर (a-z) | |
| 82 | numbers / symbols (password sets) | नंबर (0-9) / सिंबल (!@#) | |
| 83 | length | लंबाई (f) | |
| 84 | random | रैंडम | not यादृच्छिक (keyword only) |
| 85 | secure | सुरक्षित | |
| 86 | hash | हैश (m) | digest = हैश |
| 87 | encryption | एन्क्रिप्शन (m) | the one exception to एन- spelling (established spelling) |
| 88 | token / header / payload / signature | टोकन / हेडर / पेलोड / सिग्नेचर | |
| 89 | verify | वेरिफ़ाई करें | |
| 90 | regular expression / pattern / flag / match | रेगुलर एक्सप्रेशन (regex) / पैटर्न / फ़्लैग / मैच | |
| 91 | protocol / host / path / query / hash (#) | प्रोटोकॉल / होस्ट / पाथ / क्वेरी / हैश | |
| 92 | query parameters | क्वेरी पैरामीटर | |
| 93 | color / preview | कलर (m) / प्रीव्यू (m) | “Color preview” → “कलर प्रीव्यू” |
| 94 | unit / length / weight / temperature / volume | यूनिट / लंबाई / वज़न / तापमान / आयतन | |
| 95 | QR code / size / image | QR कोड (m) / साइज़ (m) / इमेज (f) | |
| 96 | slug | स्लग (m) | |
| 97 | compare / difference | तुलना करें / अंतर (m) | diff = डिफ़ |
| 98 | remove / duplicate / unique | हटाएं / डुप्लीकेट / यूनिक | |
| 99 | empty | खाली | “(empty)” → “(खाली)” |
| 100 | trim spaces | आगे-पीछे के स्पेस हटाएं | |
| 101 | ignore case | केस अनदेखा करें (A = a) | |
| 102 | search / find a tool | खोजें / टूल खोजें | |
| 103 | category / all | कैटेगरी (f) / सभी | |
| 104 | open tool | टूल खोलें | |
| 105 | common questions (FAQ) | सवाल-जवाब | |
| 106 | about this tool | इस टूल के बारे में | |
| 107 | how it works | यह कैसे काम करता है | |
| 108 | home | होम | |
| 109 | language | भाषा | |
| 110 | object / array | ऑब्जेक्ट / ऐरे | |
| 111 | identifier | आइडेंटिफ़ायर | |
| 112 | reading time | पढ़ने का समय | |

Category labels: Writing = **लेखन** · Text = **टेक्स्ट** · Developer = **डेवलपर** · SEO = **SEO** · Everyday = **रोज़मर्रा** · Privacy = **प्राइवेसी** · Data = **डेटा** · Design = **डिज़ाइन** · All = **सभी**.

Case-converter buttons: UPPERCASE = **कैपिटल (ABC)** · lowercase = **स्मॉल (abc)** · Sentence case = **सेंटेंस केस** · Title Case = **टाइटल केस**.

Time-zone option labels: New York (Eastern) = **न्यूयॉर्क (ईस्टर्न)** · Chicago (Central) = **शिकागो (सेंट्रल)** · Denver (Mountain) = **डेनवर (माउंटेन)** · Los Angeles (Pacific) = **लॉस एंजेलिस (पैसिफ़िक)** · London = **लंदन** · Madrid = **मैड्रिड** · India (Kolkata) = **भारत (कोलकाता, IST)** · Jakarta = **जकार्ता** · Ho Chi Minh City = **हो ची मिन्ह सिटी** · Seoul = **सियोल** · Tokyo = **टोक्यो** · Sydney = **सिडनी** · UTC stays **UTC**.

Unit names (runtimeMessages): Meters मीटर · Kilometers किलोमीटर · Centimeters सेंटीमीटर · Millimeters मिलीमीटर · Inches इंच · Feet फ़ुट · Yards गज · Miles मील · Kilograms किलोग्राम · Grams ग्राम · Milligrams मिलीग्राम · Pounds पाउंड · Ounces औंस · Liters लीटर · Milliliters मिलीलीटर · US gallons US गैलन · US quarts US क्वार्ट · US cups US कप · Celsius सेल्सियस · Fahrenheit फ़ारेनहाइट · Kelvin केल्विन.

## 4. Canonical spellings (visible copy)

कन्वर्टर · जनरेटर · कैलकुलेटर · एनकोड/एनकोडर · डिकोड/डिकोडर · फ़ॉर्मेट/फ़ॉर्मेटर · वैलिडेटर · डुप्लीकेट · टाइमस्टैम्प · हेक्साडेसिमल · ब्राउज़र · प्राइवेसी · कैरेक्टर · पैरामीटर · टेस्टर · पार्सर · रिमूवर · प्रोटोकॉल · एंटिटी · स्लग · ऑनलाइन · डेटा (not डाटा) · इस्तेमाल · मुफ़्त · फ़्री · साफ़ · सिर्फ़ · ज़्यादा · ज़रूरत · मज़बूत · वज़न · हज़ार · रोज़मर्रा · डिज़ाइन · फ़र्क · तारीख · गलत · खाली · गज · हिंदी (body text) · हिन्दी (only as the language autonym in `meta.name`).

---

## 5. Home page and page templates (core.mjs owner)

- Switcher name (`meta.name`): **हिन्दी** (CLDR/Google autonym). `meta.homeLabel`: **होम**. `meta.homeMarker`: **टूल**.
- `meta.homeTitle` (61 chars): **मुफ़्त ऑनलाइन टूल – कैलकुलेटर, कन्वर्टर, जनरेटर | UsefulVerse**
- `meta.homeDescription` (124 chars): **वर्ड काउंटर, प्रतिशत कैलकुलेटर, पासवर्ड जनरेटर, QR कोड जनरेटर जैसे तेज़ और निजी ब्राउज़र टूल। न अकाउंट, न अपलोड — सब मुफ़्त।**
- Hero: “Do the small things” → **छोटे-छोटे काम** · “faster.” → **झटपट निपटाएं।** · “A useful place on the internet” → **इंटरनेट पर काम की जगह** · “No account. No upload.” → **न अकाउंट, न अपलोड।**
- `meta.runtime` (see §8.2): `{ "textNumberInputs": true, "readingRate": 200, "longDates": true, "timeZones": { "from": "Asia/Kolkata", "to": "America/New_York" } }`.

Page strings — agreement-proof on purpose (any title shape works):

| key | value |
|---|---|
| faqHow | `{name} कैसे इस्तेमाल करें?` |
| privacyQuestion | `क्या मेरा डेटा किसी सर्वर पर भेजा जाता है?` |
| privacyAnswer | `नहीं। सारा काम आपके ब्राउज़र में होता है और आपका डेटा अपलोड नहीं होता।` |
| about | `{title}: सवाल-जवाब` |
| madeSimple | `{title}: आसान और तेज़` |
| categoryTool | `{category} · टूल` |
| workspace | `टूल वर्कस्पेस: {title}` |

Runtime templates (hi-IN plural categories are **one = 0 and 1**, other = rest; the `one` form is also shown for 0):

| key | value |
|---|---|
| reading.minutes | `{count} मिनट` |
| summary | `शब्द: {words}\nकैरेक्टर: {characters}\nस्पेस के बिना कैरेक्टर: {noSpaces}\nलाइनें: {lines}\nपढ़ने का समय: {reading} मिनट` |
| dedupe.kept | one `{count} यूनिक लाइन रखी गई।` · other `{count} यूनिक लाइनें रखी गईं।` |
| percent.of | `{base} का {percent}% = {result}` |
| percent.share | `{whole} में से {part} = {result}%` (QA: “432, 500 का …” read like the number 432,500) |
| percent.change | `{from} से {to} तक बदलाव = {change}%` |
| rows.converted | one `{count} पंक्ति बदली गई।` · other `{count} पंक्तियां बदली गईं।` |
| uuid.generated | one `{count} UUID आपके ब्राउज़र में बना।` · other `{count} UUID आपके ब्राउज़र में बने।` |
| regex.matches | one `{count} मैच मिला।` · other `{count} मैच मिले।` |
| duration.exact | `दिन: {days} · घंटे: {hours} · मिनट: {minutes} · सेकंड: {seconds}` (label form: app.js passes {hours} without plural support, so “1 घंटे” would be wrong; labels are agreement-proof) |
| diff.found | one `{count} लाइन में अंतर मिला।` · other `{count} लाइनों में अंतर मिला।` |
| diff.line | `लाइन {line}:` |
| diff.empty | `(खाली)` |
| date.days | one `{count} दिन` · other `{count} दिन` |
| url.none | `(कुछ नहीं)` |
| timestamp.local | `स्थानीय समय: {value}` |
| timestamp.seconds | `सेकंड: {value}` |
| timestamp.milliseconds | `मिलीसेकंड: {value}` |

Limit strings written the Indian way (runtimeMessages/ui owners):
- “Supports whole numbers from -999,999,999,999 to 999,999,999,999.” → `-9,99,99,99,99,999 से 9,99,99,99,99,999 तक की पूर्ण संख्याएं बदलता है।`
- “Enter a whole number from 0 to 1,000,000,000,000.” → `0 से 10,00,00,00,00,000 (एक लाख करोड़) तक की पूर्ण संख्या डालें।`
- “Checks integers up to one trillion locally.” → `एक लाख करोड़ तक की पूर्ण संख्याएं आपके ब्राउज़र में जांचता है।`
- “Use an integer range smaller than 4.29 billion.” → `429 करोड़ से छोटी रेंज चुनें।` (2³² = 4,29,49,67,296)
- “Use a link or text of 106 bytes or fewer. Short links work best.” → `लिंक या टेक्स्ट 106 बाइट से ज़्यादा न हो (हिंदी में करीब 35 कैरेक्टर)। छोटे लिंक सबसे अच्छे चलते हैं।`
- “One million two hundred...” (output placeholder; input placeholder is 1234567) → `बारह लाख चौंतीस हज़ार…`
- Slug: “Keep non-Latin letters” → `हिंदी (गैर-लैटिन) अक्षर रखें`; “Type a title first.” → `पहले टाइटल लिखें। हिंदी टाइटल के लिए “हिंदी (गैर-लैटिन) अक्षर रखें” चुनें।` (the tool empties Devanagari-only titles when that box is unticked); “How to write a great blog post” → `अच्छी ब्लॉग पोस्ट कैसे लिखें`; “your-clean-url-slug” → `अच्छी-ब्लॉग-पोस्ट-कैसे-लिखें` (exactly what the tool makes from the input placeholder with that box ticked; a Hinglish slug here would imply the tool transliterates, which it does not).

---

## 6. Per-tool keyword research and SEO sheet

Legend: **P** primary keyword · **V** variants · **H1** `copy[0]` · **S** short title `copy[1]` · **T** `seo.title` (JS length; `<title>` adds 14) · **K** ready-to-use keywords `copy[3]` · **Intent** notes · **FAQ** the 3 questions for `faq[id]` (1 how-to, 2 tool-specific, 3 privacy/free/limits). Demand: ▲ strong Devanagari demand · ● mixed · ▼ weak (users type English).

Meta description rule for every tool: 110–155 JS chars, benefit first, then “मुफ़्त”, “बिना अपलोड” or “आपके ब्राउज़र में” where natural. Example (percentage, 116): `किसी संख्या का प्रतिशत, मार्क्स का प्रतिशत और प्रतिशत बदलाव तुरंत निकालें। मुफ़्त, आसान और सब कुछ आपके ब्राउज़र में।`

### Group A

**word-counter** ▲
- P वर्ड काउंटर · V शब्द गिनती, शब्द काउंटर, कैरेक्टर काउंटर, हिंदी वर्ड काउंटर, word counter
- H1 वर्ड काउंटर (शब्द गिनती) · S वर्ड काउंटर · T `वर्ड काउंटर – हिंदी और अंग्रेज़ी के शब्द गिनें` (46)
- K `वर्ड काउंटर, शब्द गिनती, शब्द गिनें, शब्द काउंटर, कैरेक्टर काउंटर, अक्षर गिनती, हिंदी वर्ड काउंटर, पढ़ने का समय, word counter, hindi word counter, character counter, shabd ginti`
- Intent: essays and assignments, UPSC/State PSC mains answers (150/250-word limits), blog posts, Instagram/YouTube captions, SOPs. Works for Hindi and English (words = space-separated). Characters are Unicode characters: मात्राएं and हलंत count separately (“हिंदी” = 5). Reading time uses 200 words/minute.
- FAQ: 1 `हिंदी टेक्स्ट में शब्द कैसे गिनें?` 2 `क्या मात्राएं भी कैरेक्टर में गिनी जाती हैं?` (हाँ: हर मात्रा और हलंत एक कैरेक्टर है) 3 `क्या मेरा टेक्स्ट कहीं अपलोड होता है?`

**text-case-converter** ●
- P केस कन्वर्टर · V कैपिटल से स्मॉल लेटर, अपरकेस, लोअरकेस, capital to small letter converter, uppercase to lowercase
- H1 केस कन्वर्टर (कैपिटल और स्मॉल लेटर) · S केस कन्वर्टर · T `केस कन्वर्टर – कैपिटल और स्मॉल लेटर बदलें` (41)
- K `केस कन्वर्टर, कैपिटल लेटर, स्मॉल लेटर, कैपिटल से स्मॉल, स्मॉल से कैपिटल, अपरकेस, लोअरकेस, सेंटेंस केस, टाइटल केस, case converter, capital to small letter, small to capital, uppercase to lowercase`
- Intent: Indians say “capital/small letter”. Only English (Latin) letters change; Devanagari has no case and stays as it is (English words inside Hindi text are converted). Uses: CAPS LOCK text, resume headings, product names, email subjects, YouTube titles.
- FAQ: 1 `कैपिटल लेटर को स्मॉल लेटर में कैसे बदलें?` 2 `क्या यह हिंदी टेक्स्ट पर काम करता है?` 3 `क्या यह केस कन्वर्टर मुफ़्त है और टेक्स्ट सेव होता है?`

**remove-duplicate-lines** ▼ (users type “remove duplicate lines”)
- P डुप्लीकेट लाइनें हटाएं · V डुप्लिकेट लाइन हटाएं, दोहराई गई लाइनें, remove duplicate lines, duplicate line remover
- H1 डुप्लीकेट लाइनें हटाएं · S डुप्लीकेट लाइन रिमूवर · T `डुप्लीकेट लाइनें हटाएं – Remove Duplicate Lines` (47)
- K `डुप्लीकेट लाइनें हटाएं, डुप्लिकेट लाइन, दोहराई गई लाइनें, यूनिक लाइनें, लिस्ट साफ़ करें, remove duplicate lines, duplicate line remover, unique lines, dedupe list`
- Intent: WhatsApp/Excel lists of mobile numbers, emails, keywords, roll numbers, URLs. Keeps the first occurrence in original order; options: trim spaces, ignore case, remove empty lines.
- FAQ: 1 `लिस्ट से डुप्लीकेट लाइनें कैसे हटाएं?` 2 `क्या लाइनों का क्रम बदल जाता है?` 3 `क्या मोबाइल नंबर की लिस्ट यहाँ डालना सुरक्षित है?` (सब ब्राउज़र में, कुछ अपलोड नहीं)

**json-formatter** ▼
- P json formatter · V JSON फ़ॉर्मेटर, JSON वैलिडेटर, json beautifier, json minify
- H1 JSON फ़ॉर्मेटर और वैलिडेटर · S JSON फ़ॉर्मेटर · T `JSON Formatter – JSON फ़ॉर्मेट और वैलिडेट करें` (46)
- K `JSON फ़ॉर्मेटर, JSON फॉर्मेटर, JSON वैलिडेटर, JSON ब्यूटीफ़ायर, JSON मिनिफ़ाई, json formatter, json validator, json beautifier, json minifier, json format online`
- Intent: API responses, Postman output, config files, students learning web dev. Formats (indent), minifies, reports invalid JSON (check quotes, commas, brackets). Do not promise line/column numbers.
- FAQ: 1 `JSON को फ़ॉर्मेट कैसे करें?` 2 `JSON गलत होने पर क्या दिखता है?` 3 `क्या मेरा JSON किसी सर्वर पर जाता है?`

**base64-encoder-decoder** ▼
- P base64 encode decode · V Base64 एनकोड, Base64 डिकोड, Base64 कन्वर्टर, base64 to text
- H1 Base64 एनकोडर और डिकोडर · S Base64 कन्वर्टर · T `Base64 Encode/Decode – ऑनलाइन Base64 कन्वर्टर` (45)
- K `Base64 एनकोड, Base64 डिकोड, Base64 कन्वर्टर, Base64 एनकोडर, Base64 डिकोडर, base64 encode, base64 decode, base64 encoder decoder, base64 to text, text to base64`
- Intent: developers, API auth headers, data URIs. Unicode text including Hindi works. Text only — no file/image upload.
- FAQ: 1 `टेक्स्ट को Base64 में कैसे बदलें?` 2 `क्या हिंदी टेक्स्ट को Base64 में एनकोड कर सकते हैं?` 3 `क्या फ़ाइल या इमेज को Base64 में बदल सकते हैं?` (नहीं, सिर्फ़ टेक्स्ट; सब ब्राउज़र में)

**url-encoder-decoder** ▼
- P url encode decode · V URL एनकोडर, URL डिकोडर, percent encoding, %20
- H1 URL एनकोडर और डिकोडर · S URL एनकोडर · T `URL Encode/Decode – हिंदी लिंक डिकोड करें` (41)
- K `URL एनकोड, URL डिकोड, URL एनकोडर, URL डिकोडर, लिंक डिकोड, हिंदी URL, percent encoding, url encoder, url decoder, url encode online, decode url`
- Intent: Hindi (Devanagari) links copied from the browser look like `%E0%A4%B9…`; decoding makes them readable — strong local use case. Also query values with spaces/&.
- FAQ: 1 `URL एनकोड कैसे करें?` 2 `कॉपी किए हिंदी लिंक में %E0%A4 जैसे अक्षर क्यों दिखते हैं?` 3 `क्या लिंक कहीं भेजा या सेव होता है?`

**text-to-slug** ▼
- P slug generator · V URL स्लग, स्लग जनरेटर, SEO URL, permalink
- H1 URL स्लग जनरेटर · S स्लग जनरेटर · T `Slug Generator – टाइटल से SEO URL स्लग` (38)
- K `स्लग जनरेटर, URL स्लग, SEO स्लग, टाइटल से URL, परमालिंक, ब्लॉग URL, slug generator, url slug, text to slug, seo friendly url, permalink`
- Intent: Hindi bloggers (WordPress/Blogger). With “हिंदी (गैर-लैटिन) अक्षर रखें” ticked, a Hindi title becomes `हिंदी-में-ब्लॉग-कैसे-लिखें`; unticked, Devanagari is removed. Recommend Latin/Hinglish slugs for sharing (Devanagari URLs turn into long `%E0%A4…` strings when pasted).
- FAQ: 1 `ब्लॉग पोस्ट के लिए URL स्लग कैसे बनाएं?` 2 `क्या हिंदी टाइटल से स्लग बन सकता है?` 3 `क्या स्लग टूल मुफ़्त है और टाइटल कहीं सेव होता है?`

**percentage-calculator** ▲
- P प्रतिशत कैलकुलेटर · V परसेंटेज कैलकुलेटर, प्रतिशत कैसे निकालें, percentage calculator, percentage kaise nikale, marks percentage
- H1 प्रतिशत कैलकुलेटर · S प्रतिशत कैलकुलेटर · T `प्रतिशत कैलकुलेटर – मार्क्स का प्रतिशत और बदलाव` (47)
- K `प्रतिशत कैलकुलेटर, परसेंटेज कैलकुलेटर, प्रतिशत निकालें, प्रतिशत कैसे निकालें, प्रतिशत बदलाव, प्रतिशत बढ़ोतरी, छूट प्रतिशत, मार्क्स प्रतिशत, percentage calculator, percentage kaise nikale, percent calculator, percentage change`
- Intent: marks percentage (500 में से 432 = 86.4%), sale discounts, salary hike, price change, “18% of price” (it computes X% of Y; it is not a GST calculator).
- FAQ: 1 `किसी संख्या का प्रतिशत कैसे निकालें?` 2 `मार्क्स का प्रतिशत कैसे निकालें?` 3 `क्या यह प्रतिशत कैलकुलेटर मुफ़्त है?`

**password-generator** ▲
- P पासवर्ड जनरेटर · V मज़बूत पासवर्ड, स्ट्रांग पासवर्ड, रैंडम पासवर्ड, password generator
- H1 पासवर्ड जनरेटर · S पासवर्ड जनरेटर · T `पासवर्ड जनरेटर – मज़बूत रैंडम पासवर्ड बनाएं` (43)
- K `पासवर्ड जनरेटर, मजबूत पासवर्ड, मज़बूत पासवर्ड, स्ट्रांग पासवर्ड, रैंडम पासवर्ड, सुरक्षित पासवर्ड, पासवर्ड कैसे बनाएं, password generator, strong password generator, random password`
- Intent: email, social media, net-banking style rules (capital, small, number, symbol). Length 8–64; “मिलते-जुलते कैरेक्टर हटाएं” removes I, l, 1, O, 0. Web Crypto. Never suggest it for UPI PIN/ATM PIN (numeric PINs).
- FAQ: 1 `मज़बूत पासवर्ड कैसे बनाएं?` 2 `पासवर्ड कितने कैरेक्टर का होना चाहिए?` (कम से कम 12 की सलाह; टूल 8–64) 3 `क्या बनाया गया पासवर्ड कहीं सेव या भेजा जाता है?`

**timestamp-converter** ▼
- P unix timestamp converter · V epoch converter, टाइमस्टैम्प से तारीख, epoch to IST
- H1 Unix टाइमस्टैम्प कन्वर्टर · S टाइमस्टैम्प कन्वर्टर · T `Unix Timestamp कन्वर्टर – Epoch से तारीख` (40)
- K `Unix टाइमस्टैम्प, टाइमस्टैम्प कन्वर्टर, टाइमस्टैम्प से तारीख, तारीख से टाइमस्टैम्प, एपॉक टाइम, unix timestamp converter, epoch converter, timestamp to date, date to timestamp, epoch to IST`
- Intent: logs/databases; shows UTC plus local time (IST on Indian devices). Auto-detects: values ≥ 100000000000 are treated as milliseconds, smaller as seconds (typical: 10 digits = seconds, 13 = milliseconds).
- FAQ: 1 `Unix टाइमस्टैम्प को तारीख में कैसे बदलें?` 2 `टाइमस्टैम्प सेकंड में है या मिलीसेकंड में, कैसे पहचानें?` 3 `क्या तारीखें कहीं भेजी जाती हैं?`

**html-entity-encoder-decoder** ▼
- P html entity encoder decoder · V HTML एंटिटी, escape html, HTML स्पेशल कैरेक्टर
- H1 HTML एंटिटी एनकोडर और डिकोडर · S HTML एंटिटी कन्वर्टर · T `HTML Entity Encode/Decode – स्पेशल कैरेक्टर बदलें` (49)
- K `HTML एंटिटी, HTML एनकोड, HTML डिकोड, HTML एस्केप, स्पेशल कैरेक्टर, html entity encoder, html entity decoder, escape html, unescape html, html special characters`
- Intent: code snippets in blog posts, debugging `&amp;` in feeds/CMS output.
- FAQ: 1 `HTML स्पेशल कैरेक्टर को एंटिटी में कैसे बदलें?` 2 `&amp;, &lt; और &gt; का मतलब क्या है?` 3 `क्या मेरा HTML किसी सर्वर पर जाता है?`

### Group B

**csv-to-json** ▼
- P csv to json · V CSV को JSON में बदलें, CSV से JSON, excel to json
- H1 CSV से JSON कन्वर्टर · S CSV से JSON · T `CSV to JSON – CSV को JSON में बदलें` (35)
- K `CSV से JSON, CSV को JSON में बदलें, CSV कन्वर्टर, Excel से JSON, csv to json, csv to json converter, convert csv to json, csv parser`
- Intent: first row = column names (JSON keys); comma-separated; quoted commas, line breaks and escaped quotes handled. From Excel: save as CSV first — cells copied straight from Excel are tab-separated and will not parse as CSV.
- FAQ: 1 `CSV को JSON में कैसे बदलें?` 2 `Excel शीट को JSON में कैसे बदलें?` 3 `क्या CSV डेटा अपलोड होता है?`

**json-to-csv** ▼
- P json to csv · V JSON को CSV में बदलें, JSON से Excel
- H1 JSON से CSV कन्वर्टर · S JSON से CSV · T `JSON to CSV – JSON को CSV में बदलें` (35)
- K `JSON से CSV, JSON को CSV में बदलें, JSON से Excel, JSON कन्वर्टर, json to csv, json to csv converter, convert json to csv, json to excel`
- Intent: input = array of objects; keys → columns; nested values stay as JSON text. Output is CSV text to copy (save as `.csv` to open in Excel/Google Sheets). There is **no download button** — don’t promise one.
- FAQ: 1 `JSON को CSV में कैसे बदलें?` 2 `किस तरह का JSON CSV में बदल सकता है?` 3 `क्या CSV फ़ाइल डाउनलोड होती है?` (नहीं; नतीजा कॉपी करके .csv में सेव करें; कुछ अपलोड नहीं)

**random-number-generator** ▲
- P रैंडम नंबर जनरेटर · V random number generator, 1 से 100 रैंडम नंबर, लकी ड्रॉ नंबर, यादृच्छिक संख्या
- H1 रैंडम नंबर जनरेटर · S रैंडम नंबर जनरेटर · T `रैंडम नंबर जनरेटर – 1 से 100 या कोई भी रेंज` (43)
- K `रैंडम नंबर जनरेटर, रैंडम नंबर, यादृच्छिक संख्या, लकी ड्रॉ नंबर, 1 से 100 रैंडम नंबर, नंबर चुनें, random number generator, random number 1 to 100, lucky draw number, number picker`
- Intent: lucky draws/giveaways (number the entries 1…N: “एंट्री को 1, 2, 3… क्रम से नंबर दें”, not “क्रम दें”), classroom roll-number picking, games. One number per click; whole or decimal; integer range must be smaller than 429 करोड़. Not a tambola/housie caller.
- FAQ: 1 `1 से 100 के बीच रैंडम नंबर कैसे निकालें?` 2 `क्या इससे लकी ड्रॉ का विजेता चुन सकते हैं?` 3 `क्या नंबर सच में रैंडम और निजी हैं?`

**uuid-generator** ▼
- P uuid generator · V UUID v4, GUID generator, random uuid
- H1 UUID v4 जनरेटर · S UUID जनरेटर · T `UUID Generator – ऑनलाइन UUID v4 बनाएं` (37)
- K `UUID जनरेटर, UUID v4, GUID जनरेटर, रैंडम UUID, यूनिक आईडी, uuid generator, uuid v4 generator, guid generator, random uuid`
- FAQ: 1 `UUID v4 कैसे बनाएं?` 2 `एक साथ कितने UUID बना सकते हैं?` (1 से 100 तक) 3 `क्या UUID सुरक्षित तरीके से और ब्राउज़र में ही बनते हैं?`

**sha256-hash-generator** ▼
- P sha256 hash generator · V SHA-256 हैश, sha256 online, text to sha256
- H1 SHA-256 हैश जनरेटर · S SHA-256 हैश जनरेटर · T `SHA-256 Hash Generator – टेक्स्ट का हैश` (39)
- K `SHA-256 हैश, SHA256 हैश जनरेटर, हैश जनरेटर, टेक्स्ट हैश, sha256 hash generator, sha-256 online, sha256 online, text to sha256`
- Intent: text only (hex digest); no file hashing — don’t use “checksum of a file” wording.
- FAQ: 1 `टेक्स्ट का SHA-256 हैश कैसे बनाएं?` 2 `क्या SHA-256 एन्क्रिप्शन है?` 3 `क्या फ़ाइल का हैश बना सकते हैं?` (नहीं, सिर्फ़ टेक्स्ट; सब ब्राउज़र में)

**regex-tester** ▼
- P regex tester · V रेगेक्स टेस्टर, regular expression tester, javascript regex
- H1 रेगेक्स टेस्टर · S रेगेक्स टेस्टर · T `Regex Tester – रेगुलर एक्सप्रेशन जांचें` (39)
- K `रेगेक्स टेस्टर, रेगुलर एक्सप्रेशन, रेगेक्स जांचें, regex tester, regular expression tester, regex online, javascript regex tester, regexp`
- Intent: JavaScript flavour. Local examples that work: Indian mobile `^[6-9]\d{9}$`, PIN code `^\d{6}$`, Devanagari with `u` flag `\p{Script=Devanagari}+`.
- FAQ: 1 `रेगेक्स पैटर्न कैसे टेस्ट करें?` 2 `भारतीय मोबाइल नंबर के लिए रेगेक्स क्या है?` 3 `कौन-से फ़्लैग इस्तेमाल कर सकते हैं?` (JavaScript के g, i, m, s, u; सब ब्राउज़र में)

**jwt-decoder** ▼
- P jwt decoder · V decode jwt, JSON Web Token decoder
- H1 JWT डिकोडर · S JWT डिकोडर · T `JWT Decoder – JSON Web Token डिकोड करें` (39)
- K `JWT डिकोडर, JWT डिकोड, JSON वेब टोकन, टोकन डिकोड, jwt decoder, decode jwt, json web token decoder, jwt parser`
- Intent: shows header and payload only; **does not verify the signature**.
- FAQ: 1 `JWT टोकन को डिकोड कैसे करें?` 2 `क्या डिकोड करने से JWT वेरिफ़ाई हो जाता है?` 3 `क्या असली टोकन यहाँ पेस्ट करना सुरक्षित है?` (ब्राउज़र में ही डिकोड; फिर भी शेयर्ड डिवाइस पर सीक्रेट न डालें)

**color-converter** ●
- P कलर कन्वर्टर / hex to rgb · V HEX से RGB, RGB से HEX, कलर कोड कन्वर्टर
- H1 कलर कन्वर्टर (HEX, RGB, HSL) · S कलर कन्वर्टर · T `कलर कन्वर्टर – HEX से RGB और HSL` (32)
- K `कलर कन्वर्टर, कलर कोड, रंग कोड, HEX से RGB, RGB से HEX, HEX कोड, color converter, hex to rgb, rgb to hex, hex to hsl, color code converter`
- Intent: CSS, Canva/brand colours. No picker from images, no CMYK.
- FAQ: 1 `HEX कोड को RGB में कैसे बदलें?` 2 `HEX, RGB और HSL में क्या फ़र्क है?` 3 `क्या यह CMYK या इमेज से कलर निकाल सकता है?` (नहीं)

**url-parser** ▼
- P url parser · V URL के हिस्से, query parameters, UTM
- H1 URL पार्सर · S URL पार्सर · T `URL Parser – क्वेरी पैरामीटर और UTM देखें` (41)
- K `URL पार्सर, लिंक पार्सर, क्वेरी पैरामीटर, UTM पैरामीटर, URL के हिस्से, url parser, parse url, query parameters, utm parameters, url components`
- FAQ: 1 `URL को उसके हिस्सों में कैसे बांटें?` 2 `लिंक में UTM पैरामीटर कैसे देखें?` 3 `क्या लिंक किसी सर्वर पर भेजा जाता है?`

**roman-numeral-converter** ▲
- P रोमन अंक कन्वर्टर · V रोमन संख्या, रोमन नंबर, रोमन गिनती, roman numeral converter
- H1 रोमन अंक कन्वर्टर · S रोमन अंक कन्वर्टर · T `रोमन अंक कन्वर्टर – नंबर को रोमन में बदलें` (42)
- K `रोमन अंक, रोमन अंक कन्वर्टर, रोमन संख्या, रोमन नंबर, रोमन गिनती, रोमन में लिखें, roman numeral converter, roman number converter, roman numerals, number to roman`
- Intent: school maths (Roman numerals are in the primary curriculum), class names (कक्षा VIII), clocks, chapter numbers, years (2026 = MMXXVI). Range 1–3,999 (3,999 = MMMCMXCIX). Converts numbers, not full dates.
- FAQ: 1 `किसी संख्या को रोमन अंक में कैसे लिखें?` 2 `2026 को रोमन अंक में कैसे लिखते हैं?` 3 `रोमन अंक में सबसे बड़ी संख्या कौन-सी लिख सकते हैं?`

**binary-converter** ●
- P बाइनरी कन्वर्टर / binary to decimal · V डेसिमल से बाइनरी, हेक्साडेसिमल, ऑक्टल, number system converter
- H1 बाइनरी कन्वर्टर · S बाइनरी कन्वर्टर · T `बाइनरी कन्वर्टर – डेसिमल, हेक्स और ऑक्टल` (40)
- K `बाइनरी कन्वर्टर, बाइनरी से डेसिमल, डेसिमल से बाइनरी, हेक्साडेसिमल, ऑक्टल, नंबर सिस्टम, द्विआधारी संख्या, binary converter, binary to decimal, decimal to binary, hex to decimal, number system converter`
- Intent: Class 11–12 computer science, BCA, computer-awareness exams, networking. Whole numbers only (BigInt, any size); bases 2, 8, 10, 16; no fractions.
- FAQ: 1 `डेसिमल को बाइनरी में कैसे बदलें?` 2 `बाइनरी से डेसिमल कैसे निकालें?` 3 `क्या दशमलव वाली संख्या भी बदल सकते हैं?` (नहीं, सिर्फ़ पूर्ण संख्याएं)

### Group C

**prime-number-checker** ▲
- P अभाज्य संख्या · V प्राइम नंबर, रूढ़ संख्या (older textbook term), prime number checker
- H1 अभाज्य संख्या (Prime Number) चेकर · S अभाज्य संख्या चेकर · T `अभाज्य संख्या चेकर – Prime Number जांचें` (40)
- K `अभाज्य संख्या, अभाज्य संख्या चेकर, प्राइम नंबर, प्राइम नंबर चेकर, रूढ़ संख्या, अभाज्य संख्या कैसे पहचानें, prime number checker, is it prime, prime number check`
- Intent: school maths/competitive exams. Range 0 से 10,00,00,00,00,000 (एक लाख करोड़).
- Divisibility wording (school maths): `… से पूरा भाग जाता है`, never बंटना/बांटना.
- FAQ: 1 `कैसे पता करें कि कोई संख्या अभाज्य है?` 2 `क्या 1 अभाज्य संख्या है?` (नहीं; 2 इकलौती सम अभाज्य संख्या है) 3 `यह कितनी बड़ी संख्या जांच सकता है?`

**average-calculator** ▲
- P औसत कैलकुलेटर · V एवरेज कैलकुलेटर, औसत कैसे निकालें, average calculator
- H1 औसत कैलकुलेटर · S औसत कैलकुलेटर · T `औसत कैलकुलेटर – संख्याओं का औसत निकालें` (39)
- K `औसत कैलकुलेटर, एवरेज कैलकुलेटर, औसत निकालें, औसत कैसे निकालें, औसत का सूत्र, माध्य, अंकों का औसत, average calculator, average kaise nikale, mean calculator`
- Intent: marks average, monthly expenses, sales, readings. Returns average, sum, count, min, max. **Commas separate numbers in the list** — write 100000, not 1,00,000 (say so in copy). Not a cricket batting-average calculator.
- FAQ: 1 `औसत कैसे निकालते हैं?` (जोड़ ÷ गिनती; 70, 80, 90 का औसत 80) 2 `मार्क्स का औसत कैसे निकालें?` 3 `क्या 1,00,000 जैसी संख्याएं कॉमा के साथ लिख सकते हैं?` (नहीं, लिस्ट में कॉमा अलग करने का निशान है)

**ratio-proportion-calculator** ▲
- P अनुपात कैलकुलेटर · V अनुपात और समानुपात, समानुपात कैलकुलेटर, ratio calculator
- H1 अनुपात और समानुपात कैलकुलेटर · S अनुपात कैलकुलेटर · T `अनुपात कैलकुलेटर – अनुपात और समानुपात हल करें` (45)
- K `अनुपात कैलकुलेटर, अनुपात और समानुपात, समानुपात कैलकुलेटर, अनुपात कैसे निकालें, अनुपात सरल करें, ratio calculator, proportion calculator, ratio and proportion, anupat samanupat`
- Intent: school/SSC/banking-exam maths, recipes, cement–sand–gravel mixes, map scale. Solves A:B = C:X and simplifies A:B (12:18 = 2:3). Positive numbers only.
- FAQ: 1 `समानुपात में X का मान कैसे निकालें?` 2 `अनुपात को सरल रूप में कैसे लिखें?` 3 `क्या इसमें दशमलव या शून्य डाल सकते हैं?` (धनात्मक संख्याएं, दशमलव चलेगा, शून्य नहीं)

**time-duration-calculator** ●
- P समय अवधि कैलकुलेटर · V time duration calculator, घंटे कैलकुलेटर, दो समय के बीच अंतर
- H1 समय अवधि कैलकुलेटर · S समय अवधि कैलकुलेटर · T `समय अवधि कैलकुलेटर – दिन, घंटे, मिनट` (36)
- K `समय अवधि कैलकुलेटर, समय का अंतर, घंटे कैलकुलेटर, घंटा कैलकुलेटर, टाइम कैलकुलेटर, दो समय के बीच घंटे, काम के घंटे, शिफ़्ट के घंटे, time duration calculator, hours calculator, time calculator, time difference calculator, duration calculator, ghanta calculator`
- Description leads with hours/minutes (“दो समय के बीच कितने घंटे…”), never “दो तारीखों के बीच कितने दिन” (that is date-calculator’s query).
- Intent: shift/overtime hours, train journeys across midnight, exam or event length. Output: total days, total hours, exact दिन-घंटे-मिनट-सेकंड.
- FAQ: 1 `दो समय के बीच कितने घंटे हुए, कैसे निकालें?` 2 `रात की शिफ़्ट (अगले दिन तक) के घंटे कैसे निकालें?` 3 `क्या यह कैलकुलेटर मुफ़्त है और समय कहीं सेव होता है?`

**number-to-words-converter** ▲
- P संख्या को शब्दों में / number to words in hindi · V नंबर को शब्दों में, अंकों को शब्दों में, amount in words hindi, रुपये शब्दों में
- H1 संख्या को हिंदी शब्दों में बदलें · S संख्या से शब्द कन्वर्टर · T `संख्या को हिंदी शब्दों में बदलें (Number to Words)` (50)
- K `संख्या को शब्दों में, नंबर को शब्दों में, अंकों को शब्दों में, हिंदी में गिनती, रुपये शब्दों में, चेक पर राशि शब्दों में, लाख करोड़ शब्दों में, number to words in hindi, number to words, amount in words hindi, ginti in hindi`
- Intent: cheques/DDs written in Hindi, forms, invoices, homework (गिनती). Output = Hindi words, Indian system (हज़ार, लाख, करोड़, अरब, खरब); add “रुपये मात्र” yourself. Accepts 1234567 or 12,34,567; range ±9,99,99,99,99,999; whole numbers only (no paise).
- FAQ: 1 `संख्या को हिंदी शब्दों में कैसे लिखें?` 2 `चेक पर रकम शब्दों में कैसे लिखें?` (1,50,000 → एक लाख पचास हज़ार रुपये मात्र) 3 `यह कितनी बड़ी संख्या बदल सकता है?`

**remove-line-breaks** ▼
- P लाइन ब्रेक हटाएं / remove line breaks · V टूटी लाइनें जोड़ें, PDF टेक्स्ट ठीक करें
- H1 लाइन ब्रेक हटाएं · S लाइन ब्रेक रिमूवर · T `लाइन ब्रेक हटाएं – टूटी लाइनें जोड़ें` (37)
- K `लाइन ब्रेक हटाएं, लाइन ब्रेक रिमूवर, टूटी लाइनें जोड़ें, एक पैराग्राफ़ बनाएं, PDF टेक्स्ट, remove line breaks, line break remover, remove line breaks online, join lines`
- Intent: text copied from PDFs (question papers, government notices, e-books), emails, WhatsApp. Also collapses repeated spaces/tabs and trims.
- FAQ: 1 `PDF से कॉपी किए टेक्स्ट की टूटी लाइनें कैसे जोड़ें?` 2 `“स्पेस के साथ जोड़ें” और “ब्रेक हटाएं” में क्या फ़र्क है?` 3 `क्या मेरा टेक्स्ट अपलोड होता है?`

**text-diff-checker** ●
- P टेक्स्ट तुलना / diff checker · V टेक्स्ट कंपेयर, दो टेक्स्ट में अंतर, compare text online
- H1 टेक्स्ट तुलना टूल (Diff Checker) · S टेक्स्ट तुलना टूल · T `टेक्स्ट तुलना (Text Compare) – दो टेक्स्ट में अंतर` (50)
- K `टेक्स्ट तुलना, टेक्स्ट कंपेयर, दो टेक्स्ट की तुलना, टेक्स्ट में अंतर, डिफ़ चेकर, diff checker, text compare, compare text online, text difference checker`
- Intent: drafts, code, config. Compares line by line by line number and shows original vs changed line. Not word-level highlighting, **not a plagiarism checker** (huge Indian query — don’t imply).
- FAQ: 1 `दो टेक्स्ट की तुलना कैसे करें?` 2 `अंतर कैसे दिखाया जाता है?` 3 `क्या यह प्लेगरिज़्म (नकल) चेक करता है?` (नहीं; और कुछ अपलोड नहीं होता)

**unit-converter** ▲
- P यूनिट कन्वर्टर · V इकाई परिवर्तक, मात्रक, feet to meter, kg to pound, celsius to fahrenheit
- H1 यूनिट कन्वर्टर · S यूनिट कन्वर्टर · T `यूनिट कन्वर्टर – लंबाई, वज़न, तापमान` (36)
- K `यूनिट कन्वर्टर, इकाई परिवर्तक, मात्रक, लंबाई, वज़न, वजन, तापमान, आयतन, फ़ुट से मीटर, इंच से सेंटीमीटर, किलो से पाउंड, सेल्सियस से फ़ारेनहाइट, unit converter, feet to meter, inch to cm, kg to lbs, celsius to fahrenheit`
- Intent: height (5.5 फ़ुट → सेमी; one unit at a time, no combined “5 फ़ुट 6 इंच” field), fever (100.4°F = 38°C), kg↔pound, litres, US cups for recipes. Supported only: length (m, km, cm, mm, in, ft, yd, mi), weight (kg, g, mg, lb, oz), temperature (°C, °F, K), volume (L, mL, US gallon/quart/cup). **No area (बीघा, एकड़, वर्ग फ़ुट), no tola, no currency.**
- FAQ: 1 `फ़ुट को मीटर या सेंटीमीटर में कैसे बदलें?` 2 `बुखार का तापमान फ़ारेनहाइट से सेल्सियस में कैसे बदलें?` 3 `कौन-कौन सी यूनिट बदल सकते हैं?`

**date-calculator** ▲
- P तारीख कैलकुलेटर / दो तारीखों के बीच दिन · V डेट कैलकुलेटर, दिनांक कैलकुलेटर, days calculator
- H1 तारीख कैलकुलेटर · S तारीख कैलकुलेटर · T `तारीख कैलकुलेटर – दो तारीखों के बीच दिन` (39)
- K `तारीख कैलकुलेटर, डेट कैलकुलेटर, दिनांक कैलकुलेटर, दो तारीखों के बीच दिन, दिन गिनें, तारीख में दिन जोड़ें, 90 दिन बाद की तारीख, date calculator, days between dates, days calculator, add days to date`
- Intent: notice periods (30/60/90 दिन), deadlines, validity dates, “आज से 90 दिन बाद”. Adds/subtracts whole days (negative = subtract). Result shows full Hindi date (मंगलवार, 29 सितंबर 2026). **Not an age calculator** (no years-months-days).
- FAQ: 1 `दो तारीखों के बीच कितने दिन हैं, कैसे निकालें?` 2 `किसी तारीख में 90 दिन जोड़कर नई तारीख कैसे निकालें?` 3 `क्या यह उम्र (साल-महीने-दिन) भी बताता है?` (नहीं, सिर्फ़ दिन)

**qr-code-generator** ▲
- P QR कोड जनरेटर · V क्यूआर कोड, QR कोड कैसे बनाएं, qr code kaise banaye, free qr code
- H1 QR कोड जनरेटर · S QR कोड जनरेटर · T `QR कोड जनरेटर – लिंक से फ़्री QR कोड बनाएं` (42)
- K `QR कोड जनरेटर, क्यूआर कोड जनरेटर, QR कोड बनाएं, QR कोड कैसे बनाएं, फ्री QR कोड, लिंक का QR कोड, qr code generator, qr code kaise banaye, free qr code generator, create qr code`
- Intent: shop/restaurant menu links, Google Maps location, Instagram/YouTube, Google Forms, `wa.me` links, invitations. Static black-and-white PNG, 256/384/512 px, max 106 bytes (≈100 English chars, ≈35 Devanagari characters); say “छोटे लिंक”, never “किसी भी लिंक” (long Maps/UTM links fail). **No UPI payment QR, logo, colours, tracking or dynamic QR** — don’t claim.
- FAQ: 1 `लिंक का QR कोड कैसे बनाएं?` 2 `QR कोड में कितना टेक्स्ट आ सकता है?` 3 `क्या बनाया गया QR कोड हमेशा काम करेगा?` (स्टैटिक है, कभी एक्सपायर नहीं; लिंक जब तक चले; कुछ अपलोड नहीं)

**time-zone-converter** ▲ (as “IST to EST/PST/UK”)
- P टाइम ज़ोन कन्वर्टर / IST to EST · V IST से PST, भारत और अमेरिका का समय, IST to GMT, time zone converter
- H1 टाइम ज़ोन कन्वर्टर · S टाइम ज़ोन कन्वर्टर · T `टाइम ज़ोन कन्वर्टर – IST से US और UK समय` (40)
- K `टाइम ज़ोन कन्वर्टर, टाइम जोन कन्वर्टर, भारत का समय, IST से EST, IST से PST, IST से GMT, अमेरिका का समय, लंदन का समय, time zone converter, IST to EST, IST to PST, IST to UK time, IST to Sydney`
- Intent: IT/BPO meetings, NRI families (US, UK, Australia), US/UK events. IST is 10:30 ahead of New York in US winter, 9:30 during US daylight saving; 13:30 / 12:30 ahead of Los Angeles; UK 5:30 (GMT) / 4:30 (BST). Available zones only: UTC, New York, Chicago, Denver, Los Angeles, London, Madrid, India, Jakarta, Ho Chi Minh City, Seoul, Tokyo, Sydney (**no Dubai, Singapore, Toronto** in the list).
- FAQ: 1 `IST को अमेरिका के समय में कैसे बदलें?` 2 `भारत और अमेरिका के समय में कितना अंतर है?` 3 `कौन-कौन से टाइम ज़ोन उपलब्ध हैं?`

All 33 `seo.title` values above are unique and pass `15 ≤ (title + " | UsefulVerse").length ≤ 65` (verified with node).

---

## 7. Local number words (for runtime.js `numberToWords`)

Contract (from `src/app.js` and `src/locales/test-harness.mjs`): `src/locales/hi/runtime.js` sets `window.usefulverseLocale.numberToWords = (value /* BigInt */) => string`. Input is already validated to −999,999,999,999…999,999,999,999 (app strips commas/spaces, so 12,34,567 works). Output must contain no digits.

Algorithm (Indian system, CLDR `hi` spellout-cardinal structure):
1. `0n` → `शून्य`.
2. Negative → prefix `ऋण ` (CLDR `-x: ऋण >>`; formal written usage; not माइनस).
3. For n ≥ 1 take, in this order, `खरब` = 10¹¹, `अरब` = 10⁹, `करोड़` = 10⁷, `लाख` = 10⁵, `हज़ार` = 10³, `सौ` = 10²: q = n / scale (0–99, except सौ 0–9); if q ≠ 0 push `${WORDS[q]} ${scaleName}`; n %= scale. Finally if n ≠ 0 push `WORDS[n]`. Join with one space.
4. Always say the multiplier: 100 = `एक सौ`, 1000 = `एक हज़ार`, 1,00,000 = `एक लाख`. No “और/तथा” between parts.
5. Spellings exactly: `हज़ार` (nukta, U+091C U+093C), `करोड़` (ड़ is U+0921 U+093C in NFC — keep NFC), `सौ`, `लाख`, `अरब`, `खरब`, `ऋण`, `शून्य`.

WORDS[0…99] (source: Unicode CLDR `common/rbnf/hi.xml` spellout-cardinal; every entry cross-checked against hindieasy.com’s 1–100 list; deliberate deviations: 15 पंद्रह = standard anusvara spelling, 91–99 “-नवे” = the common modern/school spelling (CLDR has “-नबे”), 95 पचानवे as in the cross-check source):

```
0 शून्य 1 एक 2 दो 3 तीन 4 चार 5 पाँच 6 छह 7 सात 8 आठ 9 नौ
10 दस 11 ग्यारह 12 बारह 13 तेरह 14 चौदह 15 पंद्रह 16 सोलह 17 सत्रह 18 अठारह 19 उन्नीस
20 बीस 21 इक्कीस 22 बाईस 23 तेईस 24 चौबीस 25 पच्चीस 26 छब्बीस 27 सत्ताईस 28 अट्ठाईस 29 उनतीस
30 तीस 31 इकतीस 32 बत्तीस 33 तैंतीस 34 चौंतीस 35 पैंतीस 36 छत्तीस 37 सैंतीस 38 अड़तीस 39 उनतालीस
40 चालीस 41 इकतालीस 42 बयालीस 43 तैंतालीस 44 चौवालीस 45 पैंतालीस 46 छियालीस 47 सैंतालीस 48 अड़तालीस 49 उनचास
50 पचास 51 इक्यावन 52 बावन 53 तिरेपन 54 चौवन 55 पचपन 56 छप्पन 57 सत्तावन 58 अट्ठावन 59 उनसठ
60 साठ 61 इकसठ 62 बासठ 63 तिरेसठ 64 चौंसठ 65 पैंसठ 66 छियासठ 67 सड़सठ 68 अड़सठ 69 उनहत्तर
70 सत्तर 71 इकहत्तर 72 बहत्तर 73 तिहत्तर 74 चौहत्तर 75 पचहत्तर 76 छिहत्तर 77 सतहत्तर 78 अठहत्तर 79 उनासी
80 अस्सी 81 इक्यासी 82 बयासी 83 तिरासी 84 चौरासी 85 पचासी 86 छियासी 87 सत्तासी 88 अट्ठासी 89 नवासी
90 नब्बे 91 इक्यानवे 92 बानवे 93 तिरानवे 94 चौरानवे 95 पचानवे 96 छियानवे 97 सत्तानवे 98 अट्ठानवे 99 निन्यानवे
```
Note 79: both sources (CLDR and hindieasy, also Rekhta) give **उनासी**; the variant उन्यासी is common in speech but is not used here. 39 = उनतालीस (not उनचालीस).

Test vectors (computed from the spec above):
```
0 → शून्य
15 → पंद्रह
79 → उनासी
100 → एक सौ
101 → एक सौ एक
999 → नौ सौ निन्यानवे
1000 → एक हज़ार
2026 → दो हज़ार छब्बीस
100000 → एक लाख
150000 → एक लाख पचास हज़ार
1234567 → बारह लाख चौंतीस हज़ार पाँच सौ सड़सठ
10000000 → एक करोड़
1000000000 → एक अरब
100000000000 → एक खरब
-45 → ऋण पैंतालीस
999999999999 → नौ खरब निन्यानवे अरब निन्यानवे करोड़ निन्यानवे लाख निन्यानवे हज़ार नौ सौ निन्यानवे
-999999999999 → ऋण नौ खरब निन्यानवे अरब निन्यानवे करोड़ निन्यानवे लाख निन्यानवे हज़ार नौ सौ निन्यानवे
```

---

## 8. Market adaptations the real behaviour supports

### 8.1 What the app does with `hi-IN` (verified in node, ICU 78)
- `Intl.NumberFormat('hi-IN')` → Latin digits, Indian grouping: 12,34,567.891 · 9,99,99,99,99,999. Used by percentage, average, ratio, unit results.
- `Intl.DateTimeFormat('hi-IN', {dateStyle:'full'})` → `मंगलवार, 29 सितंबर 2026` (date calculator with `longDates: true`). Timestamp/time-zone outputs show e.g. `5 जन॰ 2026, 8:34:05 am` / `रविवार, 4 जनवरी 2026 को 10:04 pm बजे` — fine, leave as is.
- `Intl.PluralRules('hi-IN')`: 0 → one, 1 → one, 2+ → other.
- `parseInputNumber` already accepts 2- and 3-digit comma groups (`1,00,000`, `12,34,567.5`).
- Slug with “non-Latin letters” kept: `हिंदी में ब्लॉग कैसे लिखें? 2026 गाइड।` → `हिंदी-में-ब्लॉग-कैसे-लिखें-2026-गाइड` (मात्राएं/nukta kept, `।` and `?` removed). Unticked → only `2026`.

### 8.2 `meta.runtime` for hi (core.mjs owner)
- `textNumberInputs: true` — **add it**. Without it the calculators use `<input type="number">`, which rejects `1,00,000`; with it they become text inputs parsed by `parseInputNumber` (same as ja/ko).
- `readingRate: 200` (words/min) — keep. No published silent-reading norm for adult Hindi readers was found (the one Indian study found, Rathna & Bharadwaja, reports ~198 wpm for Hindi read aloud); Hindi writes postpositions as separate words, so word counts per idea are not lower than English. 200 is a safe estimate.
- No `readingUnit`/`wordSegmentation` (Hindi separates words with spaces; `Intl.Segmenter` gives the same count on real text and would split hyphenated words).
- No `commaDecimal` (India uses `.` for decimals).
- `longDates: true`; `timeZones: { from: "Asia/Kolkata", to: "America/New_York" }` (IST → US Eastern is the top Indian query).

### 8.3 Behaviour notes every copywriter must respect
- Character counts = Unicode characters (JS `length`): मात्रा, हलंत, nukta each count. Say “कैरेक्टर”, not “अक्षर”.
- Word counts = space-separated tokens; a `।` typed with spaces around it counts as a word (don’t claim “exact like MS Word”).
- Case converter changes only Latin letters.
- Average list: comma = separator (also space/newline) → Indian-grouped numbers in the list are split.
- QR: 106 UTF-8 bytes; Devanagari = 3 bytes per character (“नमस्ते” = 6 characters = 18 bytes).
- Number to words output has no “रुपये/मात्र” and no paise.
- Unit converter: one unit value at a time; no area/currency.
- Random number: single value per click; integer range < 429 करोड़.
- JWT: no signature verification. SHA-256/Base64: text only.

### 8.4 Missing UI keys (tools-c.mjs owner)
The time-zone `<select>` also renders `India (Kolkata)`, `Jakarta` and `Seoul`, which are not in the generated hi `ui` object. `translateStaticHtml` is a plain dictionary lookup, so add them to `ui` in `tools-c.mjs`: `"India (Kolkata)": "भारत (कोलकाता, IST)"`, `"Jakarta": "जकार्ता"`, `"Seoul": "सियोल"` — otherwise `check-build` reports them as untranslated English.

---

## 9. Sources (checked Sept 2026)
- Unicode CLDR Hindi RBNF (spellout rules, ऋण, हज़ार, लाख, करोड़, अरब, खरब): https://github.com/unicode-org/cldr/blob/main/common/rbnf/hi.xml
- Hindi numbers 1–100 cross-check: https://www.hindieasy.com/hindi-numbers
- Indian numbering (लाख 1,00,000 … खरब 1,00,00,00,00,000): https://hi.wikipedia.org/wiki/भारतीय_संख्या_प्रणाली · https://www.amarujala.com/photo-gallery/education/what-is-indian-numbering-system-know-about-arab-trillion-neel-padma-shankh-etc
- Microsoft Hindi Style Guide (nukta for ज़ in ब्राउज़र, ellipsis, no space in parentheses): https://download.microsoft.com/download/2/b/5/2b543b85-0ed4-49a7-8b3a-98ffa7addcfb/hin-ind-StyleGuide.pdf
- Mozilla hi-IN style guide (use । not `.`/`|`; आप; ढूँढें not ढूँढो; Latin digits): https://mozilla-l10n.github.io/styleguides/hi-IN/
- Competitor naming: https://wordscountertool.com/hi/ · https://hi.piliapp.com/calculator/percent/ · https://okcalc.com/hi/percentage/ · https://www.avast.com/hi-in/random-password-generator · https://ramtoriya.com/password-generator/ · https://www.converteraz.com/number-to-hindi-words · https://num2word.com/ · https://www.rapidtables.org/hi/convert/number/roman-numerals-converter.html · https://hourzone.io/hi/date-difference · https://www.hindietools.com/etools/unit-converter-length-area-volume-weight/ · https://www.toolsnak.com/hi/text-compare-hindi · https://text-compare.com/ · https://www.base64encode.org/ · https://hi.qr-code-generator.com/ · https://www.i2text.com/remove-duplicate-text-lines
- IST vs US Eastern offsets: https://www.worldtimebuddy.com/ist-to-est-converter · https://www.codeitbro.com/tool/ist-to-est-converter
- Hindi reading rate (aloud, ~198 wpm): https://www.languageinindia.com/nov2015/shantarateofspeech1.pdf · Brysbaert 2019 meta-analysis (English silent 238 wpm): https://www.researchgate.net/publication/332380784

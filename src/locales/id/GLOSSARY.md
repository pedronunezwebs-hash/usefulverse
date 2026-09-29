# UsefulVerse · Bahasa Indonesia (id) · Glossary, style guide and keyword research

Owner: research role. Every agent writing `src/locales/id/*` follows this file. Explanations are in English; every
target term is the exact Indonesian text to use. One decision per item: do not reopen choices, do not invent synonyms.

Research method (29 Sep 2026): Google autocomplete with `hl=id&gl=id` (what people in Indonesia actually type),
competitor SERP titles of Indonesian tool sites (kalkulator.now, indo.tools, petunjuk.id, berhitung.id,
terbilangonline.com, kalenderku.id, computing.id, urbanidea.id, timestamp.id, toolv.com/id…), EYD V / KBBI rules and
the real behavior in `src/app.js` + `src/template.mjs`. Sources at the end.

---

## 0. Decisions at a glance

| Item | Decision |
|---|---|
| meta.name (language switcher) | `Bahasa Indonesia` |
| meta.homeLabel / homeMarker | `Beranda` / `Alat` |
| meta.homeTitle (56 chars) | `UsefulVerse — Alat Online Gratis untuk Tugas Sehari-Hari` (title case, §1.2) |
| meta.homeDescription (144 chars) | `Alat online gratis yang cepat dan privat untuk teks, data, SEO, dan hitungan sehari-hari. Langsung di browser, tanpa akun dan tanpa unggah file.` |
| Register | Friendly-formal, always `Anda` (capital A, never `kamu`/`lu`), verbs `bisa` > `dapat` in UI |
| runtime.commaDecimal | `true` (keep) — inputs accept `1.000,5`; output via Intl `id-ID` = `1.234.567,891` |
| runtime.readingRate | `200` (keep) — see §6.2 |
| runtime.longDates | `true` (keep) → `Selasa, 29 September 2026` |
| runtime.timeZones | `from: "Asia/Jakarta"`, `to: "UTC"` (keep) — opens WIB → UTC because the prefilled datetime is the visitor's local time (tested in runtime.test.mjs) |
| Plural forms | `id-ID` has ONLY the plural category `other`. Every plural template must be `{"other": "…"}` or a plain string. A `one` key FAILS `packs.test.mjs`. |
| Number to words | `nol`, `seribu`, `satu juta`, `satu miliar`, negative prefix `minus`, lowercase, no `rupiah` suffix — full spec §6.1 |

---

## 1. Style guide

### 1.1 Register and tone
- Friendly-formal, like Tokopedia/Google Indonesia help pages: short, direct, helpful. Address the user as `Anda`
  (always capital A, also mid-sentence: `teks Anda`, `browser Anda`).
- Prefer everyday words: `bisa` (not `dapat` in UI; `dapat` is fine in explanatory body text), `pakai/memakai`,
  `cepat`, `praktis`, `gratis`, `tanpa daftar`, `tanpa akun`.
- No slang (`banget`, `gampang`, `cuy`, `lho`), no exclamation marks, no emojis, no “Yuk”.
- Avoid translationese: never `secara lokal` twice in one page (prefer `di browser Anda` / `di perangkat Anda`),
  never `Anda dapat melakukan…`, never `hasilkan` for generate (use `buat`), never `untuk digunakan` chains.
- Do not overuse `silakan`; use plain imperatives in instructions: `Tempel teks, lalu klik Salin hasil.`

### 1.2 Buttons, labels, headings
- Buttons: imperative verb first, sentence case, no final period: `Salin hasil`, `Buat password`, `Hitung`,
  `Konversi`, `Kosongkan`, `Unduh PNG`, `Hapus duplikat`.
- Field labels / metric names: noun phrase, sentence case, no period: `Teks yang dihitung`, `Kata`, `Waktu baca`,
  `Tanggal mulai`. A label that ends in `:` in English keeps the colon (`Panjang:`).
- Status/toast messages: full sentence with final period: `Tersalin ke papan klip.`
- In-tool headings (h2 inside tools) are sentence case: `Berapa persen dari suatu angka?`
- H1 and `seo.title`: Indonesian title case (EYD V): capitalize every word EXCEPT `dan, di, ke, dari, untuk, atau,
  yang, dengan, per, jadi` when not first. Both halves of reduplication are capitalized in titles (`Rata-Rata`).
  Brand/tech names keep their own casing (`JSON`, `Base64`, `SHA-256`, `QR Code`, `Unix`).
- Separator inside `seo.title`: ` – ` (spaced en dash), same as the English site. Home title uses ` — ` (fixed by test).

### 1.3 Punctuation, spacing, quotes
- Quotes in prose: `“…”`; nested `‘…’`. Never French/German quotes.
- UI labels named in prose (intro, body, FAQ, placeholders) are quoted exactly as shown on the page:
  `lalu klik “Hitung rata-rata”`, `Pilih “Kapital Tiap Kata”`. Meta descriptions and card descriptions stay unquoted.
- Placeholder ellipsis: single character `…` (U+2026) attached to the last word: `Tempel teks di sini…`.
- Ranges: en dash without spaces for numbers (`8–64 karakter`, `1–3.999`) or the words `sampai`/`hingga`.
- Percent: no space (`15%`), EYD. Units after numbers: one space (`5 km`, `2,54 cm`).
- Serial comma: EYD V uses a comma before `dan`/`atau` in lists of three or more (`kata, karakter, dan baris`).
  Apply consistently.
- Colon: no space before (`Waktu lokal: …`).
- Time of day: dot separator (`pukul 15.30 WIB`), as Intl `id-ID` outputs (`21.13.20`).

### 1.4 Numbers and dates
- Thousands `.`, decimal `,`: `1.500.000`, `2,5`, `4,29 miliar`, `1.000.000.000.000 (satu triliun)`.
  Rewrite every English number in values: `3,999` → `3.999`; `-999,999,999,999` → `-999.999.999.999`.
- Scale words: `ribu`, `juta`, `miliar` (not `milyar`), `triliun` (10¹²). English “billion” (10⁹) = `miliar`,
  “trillion” = `triliun`.
- Dates in prose: `29 September 2026`; months `Januari, Februari, Maret, April, Mei, Juni, Juli, Agustus, September,
  Oktober, November, Desember`; days `Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu` (capitalized).
- Time zone abbreviation for Jakarta: `WIB` (Waktu Indonesia Barat, UTC+7).

### 1.5 Product, tech and English terms
- Keep product/format names exactly: `UsefulVerse`, `JSON`, `CSV`, `Base64`, `UUID`, `SHA-256`, `JWT`,
  `JSON Web Token`, `HEX`, `RGB`, `HSL`, `PNG`, `UTC`, `Unix`, `Web Crypto API`, `JavaScript`, `BigInt`, `Excel`,
  `Google Sheets`, `Word`, `PDF`, `WhatsApp`.
- Developer vocabulary Indonesians really write stays English (no italics): `encode`, `decode`, `hash`, `header`,
  `payload`, `signature`, `host`, `path`, `query`, `flag`, `regex`, `slug`, `timestamp`, `minify`, `key` (JSON key).
- Never glue Indonesian affixes to an English word (no `di-encode`, `men-decode`, `di-copy`, `nge-paste`).
  Rephrase: `hasil encode`, `teks yang ingin di-decode` → `teks Base64 yang ingin diubah`, or use Indonesian verbs
  (`disalin`, `ditempel`, `diubah`). If truly unavoidable, EYD form is hyphenated (`di-decode`) — avoid anyway.
- KBBI spellings: `mengonversi` (not `mengkonversi`), `memvalidasi`, `memverifikasi`, `kuitansi` (users type
  `kwitansi` → keywords only), `rapor` (users type `raport` → keywords only), `Celsius` (users type `celcius` →
  keywords only), `sentimeter`, `miligram`, `mililiter`, `heksadesimal`, `praktis`, `efektif`, `sistem`, `kategori`.
- `online`, `browser`, `link`, `email`, `password`, `QR code` stay as Indonesians write them (they out-search
  `daring`, `peramban`, `tautan`, `surel`, `kata sandi`, `kode QR`). Use the Indonesian synonym at most once per
  page as a keyword variant.

---

## 2. Terminology (use exactly)

| English | Indonesian | Notes |
|---|---|---|
| tool | alat | plural also `alat`; `Semua alat`, `Cari alat` |
| tools (nav) | Alat | nav/home marker |
| toolbox | kotak alat | |
| browser | browser | not `peramban` |
| in your browser | di browser Anda | preferred over `secara lokal` |
| locally / on your device | di perangkat Anda | alternate with the above |
| online | online | not `daring` |
| free | gratis | |
| no account | tanpa akun | |
| no sign-up | tanpa daftar | |
| no upload | tanpa unggah | `tidak diunggah` in sentences |
| upload | unggah / mengunggah | |
| download | unduh / mengunduh | button `Unduh PNG` |
| server | server | |
| private | privat | adjective; `Privasi` for the category |
| privacy | privasi | |
| copy (button) | Salin | `Salin hasil`, `Salin password` |
| copied | Tersalin | `Tersalin ke papan klip.` |
| clipboard | papan klip | Google/Microsoft ID standard |
| paste | tempel / menempelkan | `Tempel teks di sini…` |
| clear (reset button) | Kosongkan | never `Hapus` (clashes with delete actions) |
| remove / delete | hapus | `Hapus duplikat`, `Hapus baris kosong` |
| convert | konversi (button) / mengubah, mengonversi (prose) | button `Konversi` |
| converter | konverter | tool names: `Konverter Warna` |
| conversion | konversi | |
| calculate | hitung / menghitung | button `Hitung` |
| calculator | kalkulator | |
| result | hasil | `Salin hasil` |
| answer(s) | jawaban | `Salin jawaban` |
| generate | buat / membuat | never `hasilkan`/`generate` in UI verbs |
| generator | generator | only in tool names people search (`Generator Password`) |
| encode | encode | `Encode ke Base64` |
| decode | decode | `Decode Base64` |
| format (JSON) | rapikan | button `Rapikan JSON`; noun `format` |
| minify | Minify | keepEnglish (button) |
| validate | validasi / memvalidasi | |
| valid / invalid | valid / tidak valid | |
| error | kesalahan | `error` only inside quoted dev messages |
| input (field) | name the content | `Teks yang diubah`, `Nilai`; avoid bare `input` |
| output | hasil | |
| example | contoh | |
| option(s) | opsi | |
| settings | pengaturan | |
| search | cari | `Cari alat` |
| text | teks | |
| word | kata | |
| character | karakter | |
| without spaces | tanpa spasi | |
| line | baris | |
| empty line | baris kosong | |
| line break | enter / baris baru | titles use `enter` (search term); UI `baris baru` |
| paragraph | paragraf | |
| duplicate | duplikat | |
| unique | unik | |
| uppercase | huruf besar | option label `HURUF BESAR` |
| lowercase | huruf kecil | |
| capital letter | huruf kapital | |
| case (letter case) | huruf besar/kecil | `Abaikan huruf besar/kecil` |
| trim spaces | hapus spasi di awal/akhir | |
| reading time | waktu baca | |
| minute(s) | menit | abbreviation not used |
| number (everyday) | angka | `angka acak`, `angka Romawi` |
| number (math) | bilangan | `bilangan prima`, `bilangan bulat`, `sistem bilangan` |
| whole number / integer | bilangan bulat | |
| decimal | desimal | |
| percent / percentage | persen / persentase | |
| percentage change | perubahan persentase | kenaikan/penurunan in prose |
| average / mean | rata-rata | `mean` only as keyword |
| sum | jumlah | |
| count (n values) | banyak data | |
| minimum / maximum | Minimum / Maksimum | `Minimum` = keepEnglish |
| ratio | rasio / perbandingan | tool name uses `perbandingan` |
| proportion | perbandingan senilai | A:B = C:X |
| random | acak | |
| secure random source | sumber acak yang aman | |
| password | password | `kata sandi` once as keyword |
| password manager | pengelola password | |
| strong / good (strength) | Kuat / Cukup kuat | |
| symbols | simbol | |
| similar characters | karakter yang mirip | e.g. `l`, `1`, `I`, `O`, `0` |
| length | panjang | |
| weight | berat | |
| volume | volume | keepEnglish |
| temperature | suhu | |
| unit (of measure) | satuan | |
| date | tanggal | |
| time | waktu / jam | `jam` for clock time |
| duration | durasi | `selisih waktu` in prose |
| day(s) / hour(s) / second(s) / millisecond(s) | hari / jam / detik / milidetik | |
| time zone | zona waktu | |
| daylight saving time | waktu musim panas (DST) | Indonesia has no DST — say it applies to other countries |
| local time | waktu lokal | |
| timestamp | timestamp | `Unix timestamp` |
| hash | hash | |
| digest | digest | `Digest heksadesimal SHA-256` |
| token | token | |
| header / payload / signature | header / payload / signature | keepEnglish for `Header`, `Payload` |
| verify | memverifikasi | |
| pattern (regex) | pola | |
| flags | flag | |
| match(es) | kecocokan | `{count} kecocokan ditemukan.` |
| regular expression | ekspresi reguler | `regex` in titles |
| URL components | komponen URL | |
| protocol / host / path / query / hash | protokol / Host / Path / Query / Hash | keepEnglish for the last four labels |
| query parameters | parameter query | |
| color / preview | warna / pratinjau | |
| base (number base) | basis | `Dari basis`, `Ke basis` |
| binary / octal / hexadecimal | biner / oktal / heksadesimal | |
| prime / not prime | bilangan prima / bukan bilangan prima | |
| Roman numeral | angka Romawi | capital R (proper adjective) |
| number to words | terbilang | |
| compare / difference | bandingkan / perbedaan | |
| original / changed | teks asli / teks yang diubah | |
| slug | slug | |
| link | link | not `tautan` |
| QR code | QR code | plural same; `kode QR` only as keyword |
| scan | memindai / dipindai | |
| size | ukuran | |
| category | kategori | |
| developer (category) | Developer | keepEnglish |
| writing / text / everyday / design / data | Menulis / Teks / Sehari-hari / Desain / Data | `Data` = keepEnglish |
| common questions (FAQ) | Pertanyaan umum | |
| about this tool | Tentang alat ini | |
| breadcrumb | Navigasi jejak | aria-label |
| home | Beranda | |
| language | Bahasa | |

---

## 3. Fixed UI decisions for tricky strings

### 3.1 Option labels and units (runtime + markup)
| Key | Value | Why |
|---|---|---|
| `UPPERCASE` | `HURUF BESAR` | label demonstrates itself |
| `lowercase` | `huruf kecil` | |
| `Sentence case` | `Kapital awal kalimat` | matches local tools (“Kapital awal”) |
| `Title Case` | `Kapital Tiap Kata` | matches local tools/Word ID (“Kapitalisasi Setiap Kata”) |
| `Meters` / `Kilometers` / `Centimeters` / `Millimeters` | `Meter` / `Kilometer` / `Sentimeter` / `Milimeter` | |
| `Inches` / `Feet` / `Yards` / `Miles` | `Inci (in)` / `Kaki (ft)` / `Yard (yd)` / `Mil (mi)` | symbols disambiguate imperial units |
| `Kilograms` / `Grams` / `Milligrams` | `Kilogram` / `Gram` / `Miligram` | |
| `Pounds` / `Ounces` | `Pound (lb)` / `Ounce (oz)` | NEVER `pon`/`ons`: in Indonesia colloquial `pon` = 500 g and `ons` = 100 g |
| `Liters` / `Milliliters` | `Liter` / `Mililiter` | |
| `US gallons` / `US quarts` / `US cups` | `Galon AS` / `Quart AS` / `Cup AS` | `galon` in Indonesia means the 19-L water jug; `AS` keeps it clear; recipes say `cup` |
| `Celsius` / `Fahrenheit` / `Kelvin` | same | keepEnglish (Reamur is NOT supported — never mention it) |
| `Length` / `Weight` / `Volume` / `Temperature` | `Panjang` / `Berat` / `Volume` / `Suhu` | |
| `New York (Eastern)` | `New York (Waktu Timur AS)` | |
| `Chicago (Central)` | `Chicago (Waktu Tengah AS)` | |
| `Denver (Mountain)` | `Denver (Waktu Pegunungan AS)` | |
| `Los Angeles (Pacific)` | `Los Angeles (Waktu Pasifik AS)` | |
| `Ho Chi Minh City` | `Kota Ho Chi Minh` | Indonesian Wikipedia name |
| `London`, `Madrid`, `Tokyo`, `Sydney` | same | keepEnglish |
| `Jakarta` (key MISSING from skeleton — tools-c owner adds it to `ui`) | `Jakarta (WIB)` | the only Indonesian zone in the list |
| `Seoul`, `India (Kolkata)` (keys MISSING — visible on the page) | same | add to meta.keepEnglish |
| `Decimal (10)` / `Binary (2)` / `Hexadecimal (16)` / `Octal (8)` | `Desimal (10)` / `Biner (2)` / `Heksadesimal (16)` / `Oktal (8)` | |
| `Strong` / `Good` | `Kuat` / `Cukup kuat` | password strength |
| `Prime number` / `Not prime` | `Bilangan prima` / `Bukan bilangan prima` | |
| `Clear` | `Kosongkan` | |
| `Join with spaces` / `Remove breaks` | `Gabung dengan spasi` / `Hapus enter` | remove-line-breaks buttons |
| `Trim spaces` / `Ignore case` / `Remove empty lines` / `Remove duplicates` | `Hapus spasi di awal/akhir` / `Abaikan huruf besar/kecil` / `Hapus baris kosong` / `Hapus duplikat` | dedupe options |
| `Format JSON` / `Minify` | `Rapikan JSON` / `Minify` | |

### 3.2 Placeholders with examples
| Key | Value |
|---|---|
| `How to write a great blog post` | `Cara Menulis Artikel Blog yang Menarik` |
| `your-clean-url-slug` | `slug-url-yang-rapi` |
| `One million two hundred...` | `satu juta dua ratus…` (lowercase, matches the tool output) |
| `MMXXVI` | unchanged (uppercase = universal) |
| `#4D6BFF, rgb(77,107,255) or hsl(231,100%,67%)` | `#4D6BFF, rgb(77,107,255) atau hsl(231,100%,67%)` |
| `Use & symbols safely` | `Gunakan simbol & dengan aman` |
| `Paste text with\nbroken lines\nhere...` | `Tempel teks dengan\nbaris yang\nterputus di sini…` (keep the two `\n`) |
| `Base64 to decode...` (runtime key MISSING from skeleton; app.js calls `translate()` on it — tools-a owner adds it to `ui`) | `Tempel teks Base64 di sini…` |

### 3.3 Strings whose English wording is WRONG for id behavior (commaDecimal)
With `commaDecimal: true`, app.js splits the average list on `;`, whitespace and `、` — NOT on commas (comma is the
decimal mark). The Indonesian text must describe the real behavior:
- ui `Separate numbers with spaces, commas or new lines.` → `Pisahkan angka dengan spasi, titik koma (;), atau baris baru. Pakai koma untuk desimal.`
- runtime `Enter valid numbers separated by spaces, commas or lines.` → `Masukkan angka yang valid, dipisahkan spasi, titik koma, atau baris baru.`
- copy intro/FAQ for `average-calculator` must say the same (never “dipisahkan koma”).

### 3.4 meta.keepEnglish (exact list; nothing else)
`["Data", "Developer", "Minimum", "Minify", "Header", "Payload", "Host", "Path", "Query", "Hash", "Volume",
"Celsius", "Fahrenheit", "Kelvin", "London", "Madrid", "Tokyo", "Sydney", "Seoul", "India (Kolkata)"]`
(Uppercase-only strings such as `SEO`, `JSON`, `UTC`, `MMXXVI` need no entry.)

### 3.5 Page strings (`page`) and templates
| Key | Value |
|---|---|
| `faqHow` | `Bagaimana cara memakai {name}?` |
| `privacyQuestion` | `Apakah data saya dikirim ke server?` |
| `privacyAnswer` | `Tidak. Semua proses berjalan di browser Anda dan data Anda tidak diunggah.` |
| `about` | `Tentang {title}.` |
| `madeSimple` | `{title}, praktis tanpa ribet.` |
| `categoryTool` | `Alat {category}` |
| `workspace` | `Area kerja {title}` |
| `reading.minutes` | `{count} menit` |
| `summary` | `Kata: {words}\nKarakter: {characters}\nKarakter tanpa spasi: {noSpaces}\nBaris: {lines}\nWaktu baca: {reading} menit` |
| `dedupe.kept` | `{"other": "{count} baris unik dipertahankan."}` |
| `percent.of` | `{percent}% dari {base} = {result}` |
| `percent.share` | `{part} adalah {result}% dari {whole}` |
| `percent.change` | `Perubahan dari {from} ke {to} = {change}%` |
| `rows.converted` | `{"other": "{count} baris berhasil dikonversi."}` |
| `uuid.generated` | `{"other": "{count} UUID berhasil dibuat di perangkat Anda."}` |
| `regex.matches` | `{"other": "{count} kecocokan ditemukan."}` |
| `duration.exact` | `{days} hari {hours} jam {minutes} menit {seconds} detik` |
| `diff.found` | `{"other": "{count} baris berbeda ditemukan."}` |
| `diff.line` | `Baris {line}:` |
| `diff.empty` | `(kosong)` |
| `date.days` | `{"other": "{count} hari"}` |
| `url.none` | `(tidak ada)` |
| `timestamp.local` / `.seconds` / `.milliseconds` | `Waktu lokal: {value}` / `Detik: {value}` / `Milidetik: {value}` |

### 3.6 Core/home voice (core owner uses these)
`A useful place on the internet` → `Tempat yang berguna di internet` · `Do the small things` / `faster.` →
`Selesaikan urusan kecil` / `lebih cepat.` · hero sentence → `Alat browser sederhana untuk teks, data, dan pekerjaan
sehari-hari. Tanpa akun. Tanpa unggah. Buka alatnya, langsung beres.` · `Fast by default` → `Selalu cepat` ·
`Private by design` → `Privat sejak awal` · `Free to use` → `Gratis dipakai` · `Explore tools` → `Jelajahi alat` ·
`Find the right tool.` → `Temukan alat yang tepat.` · `Runs in your browser. No upload.` → `Berjalan di browser Anda.
Tanpa unggah.` · `Copied to your clipboard.` → `Tersalin ke papan klip.` · `There is nothing to copy yet.` →
`Belum ada yang bisa disalin.` · `Copy was blocked. Select the result and copy it manually.` → `Penyalinan diblokir.
Pilih hasilnya, lalu salin secara manual.` · `Keep going` → `Lanjutkan` · `More useful tools` → `Alat berguna lainnya` ·
`Browse all tools` → `Lihat semua alat`.

---

## 4. Tools — keywords, titles and FAQs

Legend. **Demand**: HIGH = strong Indonesian tool-intent queries; MED = real but smaller or mixed intent;
LOW-EN = Indonesians search the English term (keep the English head term in H1/title). `seo.title` lengths are the
full `<title>` (`… | UsefulVerse`), all verified 15–65 and unique (scripts/check-build.mjs measures the escaped HTML, so each `&` costs 4 extra characters); meta descriptions verified 110–155 chars.
Keywords line = value for `copy[id][3]` (comma-separated, real variants).
FAQ = exactly 3 questions: 1) how to use, 2) the top tool-specific question, 3) privacy/free/limits. The
fact notes are what the answer MUST say (accurate to app.js); writers phrase the Indonesian answer.

### Group A

**word-counter** · Demand HIGH (`penghitung kata`, `hitung kata online`, `hitung karakter`, `word counter`)
- H1: `Penghitung Kata dan Karakter Online` · short: `Penghitung kata`
- seo.title: `Penghitung Kata Online – Hitung Kata & Karakter` (61)
- seo.description: `Hitung jumlah kata, karakter, baris, dan waktu baca secara instan. Gratis, tanpa daftar, dan teks Anda tetap di browser.`
- Keywords: `penghitung kata, hitung kata, hitung jumlah kata, hitung karakter, penghitung karakter, hitung huruf, word counter, character counter, waktu baca`
- Intent/use cases: word limits for makalah, abstrak skripsi, esai beasiswa (e.g. “maksimal 250 kata”), caption
  Instagram/TikTok, bio, artikel SEO, lamaran kerja.
- FAQ: 1) `Bagaimana cara menghitung jumlah kata secara online?` — paste/type, counts update live.
  2) `Apakah spasi ikut dihitung sebagai karakter?` — yes in `Karakter`; `Tanpa spasi` shows the count without
  spaces; waktu baca estimated at 200 kata per menit. 3) `Apakah teks saya disimpan atau diunggah?` — no, processed
  in the browser, no account.

**text-case-converter** · Demand HIGH (`ubah huruf besar kecil`, `ubah huruf kapital online`, `huruf kapital setiap kata`)
- H1: `Ubah Huruf Besar dan Kecil Online` · short: `Pengubah huruf besar kecil`
- seo.title: `Ubah Huruf Besar Kecil Online – Kapital Tiap Kata` (63)
- seo.description: `Ubah teks jadi HURUF BESAR, huruf kecil, kapital awal kalimat, atau Kapital Tiap Kata dalam sekali klik. Gratis dan teks tidak diunggah.`
- Keywords: `ubah huruf besar kecil, ubah huruf kapital, huruf besar ke kecil, huruf kecil ke besar, kapital tiap kata, huruf kapital setiap kata, konverter huruf, case converter, uppercase, lowercase, title case`
- Use cases: judul makalah/artikel, nama produk marketplace, data nama dari Excel yang semua HURUF BESAR, caption.
- FAQ: 1) `Bagaimana cara mengubah huruf besar menjadi huruf kecil?` 2) `Bagaimana membuat huruf kapital di setiap
  awal kata?` — choose `Kapital Tiap Kata`; it capitalizes EVERY word including `dan`, `di`, `ke`, `yang`, so for an
  EYD-correct title lower those manually; `Kapital awal kalimat` lowercases proper names too — fix them after.
  3) `Apakah teks saya aman?` — stays in the browser, free.

**remove-duplicate-lines** · Demand MED (`hapus duplikat online`, `remove duplicate line`; most `hapus duplikat` queries are Excel how-tos)
- H1: `Hapus Baris Duplikat Online` · short: `Penghapus baris duplikat`
- seo.title: `Hapus Baris Duplikat Online – Rapikan Daftar` (58)
- seo.description: `Hapus baris duplikat dari daftar nama, kata kunci, email, atau URL tanpa mengubah urutan. Gratis, cepat, dan diproses di browser Anda.`
- Keywords: `hapus duplikat, hapus baris duplikat, hapus data ganda, hapus data duplikat, baris unik, remove duplicate lines, rapikan daftar`
- Use cases: daftar peserta/absen, nomor WhatsApp, kata kunci SEO, kolom yang disalin dari Excel/Google Sheets.
- FAQ: 1) `Bagaimana cara menghapus data duplikat dari daftar?` — one item per line, options `Hapus spasi di
  awal/akhir`, `Abaikan huruf besar/kecil`, `Hapus baris kosong`. 2) `Apakah urutan daftar berubah?` — no, the first
  occurrence stays in place; tip: copy one Excel column and paste it (one value per line). 3) privacy/free.

**json-formatter** · Demand LOW-EN (`json formatter`, `format json online`, `json beautifier`; `rapikan json` tiny)
- H1: `JSON Formatter & Validator Online` · short: `JSON formatter`
- seo.title: `JSON Formatter Online – Rapikan & Validasi JSON` (65 as rendered; check-build counts `&` as `&amp;`)
- seo.description: `Rapikan, validasi, dan minify JSON secara online. Pesan kesalahan jelas, gratis, dan JSON Anda tidak dikirim ke server.`
- Keywords: `json formatter, format json, rapikan json, json validator, validasi json, json beautifier, minify json, json online`
- UI: button `Rapikan JSON`, `Minify` (keepEnglish).
- FAQ: 1) `Bagaimana cara merapikan JSON?` 2) `Kenapa JSON saya dianggap tidak valid?` — check quotes (JSON needs
  double quotes), trailing commas and brackets; the tool shows the error message. 3) `Apakah JSON saya dikirim ke
  server?` — no.

**base64-encoder-decoder** · Demand LOW-EN (`base64 decode`, `base64 encode`, `base64 adalah`)
- H1: `Base64 Encode & Decode Online` · short: `Konverter Base64`
- seo.title: `Base64 Encode & Decode – Teks ke Base64 Online` (60)
- seo.description: `Encode teks ke Base64 atau decode Base64 kembali ke teks biasa, termasuk karakter Unicode. Gratis, tanpa akun, dan tanpa unggah data.`
- Keywords: `base64 encode, base64 decode, decode base64, encode base64, base64 ke teks, teks ke base64, base64 converter`
- Honesty: TEXT only (no image/file ↔ Base64, although `base64 to image` is searched — do not claim it).
- FAQ: 1) `Bagaimana cara decode Base64 ke teks?` 2) `Apakah Base64 itu enkripsi?` — no, it is an encoding;
  anyone can decode it. 3) free/no upload.

**url-encoder-decoder** · Demand LOW-EN (`url encode`, `url decode online`, `encode url`)
- H1: `URL Encode & Decode Online` · short: `URL encoder`
- seo.title: `URL Encode & Decode Online – Ubah Teks URL` (60 as rendered)
- seo.description: `Encode teks agar aman dipakai di URL atau decode kode persen seperti %20 kembali menjadi teks. Gratis dan berjalan di browser Anda.`
- Keywords: `url encode, url decode, encode url, decode url, percent encoding, url encoder, url decoder, %20`
- Behavior: `encodeURIComponent` / `decodeURIComponent` (encodes `/ ? & =` too).
- FAQ: 1) `Kapan teks perlu diubah dengan URL encode?` — when it contains spaces, `&`, `?`, `#` or non-ASCII
  characters. 2) `Apa arti %20 di URL?` — a space. 3) privacy/free.

**text-to-slug** · Demand LOW-EN (`slug generator`, `url slug generator`; Indonesian queries are informational `slug adalah`)
- H1: `Slug Generator – Ubah Judul Jadi URL` · short: `Slug generator`
- seo.title: `Slug Generator – Ubah Judul Jadi URL Ramah SEO` (60)
- seo.description: `Ubah judul artikel menjadi slug URL huruf kecil yang rapi dan ramah SEO. Tanda baca dan spasi berlebih dibersihkan otomatis, gratis.`
- Keywords: `slug generator, url slug generator, buat slug, slug url, slug seo, permalink, text to slug`
- Use cases: permalink WordPress/Blogger, halaman produk toko online. Example: `Cara Membuat Website Toko Online
  2026` → `cara-membuat-website-toko-online-2026` (numbers kept by default; `Pertahankan angka` option).
- FAQ: 1) `Apa itu slug URL?` 2) `Bagaimana cara membuat slug yang ramah SEO?` — short, relevant words, lowercase,
  hyphens. 3) free/in browser.

**percentage-calculator** · Demand HIGH (`kalkulator persen`, `hitung persen`, `persentase kenaikan`, `persen diskon`)
- H1: `Kalkulator Persen Online` · short: `Kalkulator persen`
- seo.title: `Kalkulator Persen – Hitung Persentase dan Kenaikan` (64)
- seo.description: `Hitung persen dari suatu angka, persentase bagian dari total, dan persentase kenaikan atau penurunan. Cocok untuk diskon dan nilai, gratis.`
- Keywords: `kalkulator persen, hitung persen, kalkulator persentase, hitung persentase, persentase kenaikan, persentase penurunan, persen diskon, cara menghitung persen`
- Use cases: diskon belanja/flash sale, kenaikan harga, kenaikan gaji, persentase kehadiran, nilai ujian.
  Do not quote tax rates.
- FAQ: 1) `Bagaimana cara menghitung persen dari suatu angka?` — e.g. 15% dari 200 = 30. 2) `Bagaimana cara
  menghitung diskon 20% dari harga?` — first calculator gives the discount amount; harga akhir = harga − hasil.
  3) `Apakah kalkulator persen ini gratis?` — yes, no account, runs in the browser; inputs accept `1.500.000` and
  `2,5`. (Percentage change is explained in the body, not a separate FAQ.)

**password-generator** · Demand HIGH (`generator password`, `password generator`, `buat password`, `password kuat`)
- H1: `Generator Password Kuat dan Acak` · short: `Generator password`
- seo.title: `Generator Password Kuat – Buat Password Acak` (58)
- seo.description: `Buat password acak yang kuat dengan panjang 8–64 karakter dan jenis karakter pilihan Anda. Dibuat di browser, tidak pernah dikirim.`
- Keywords: `generator password, password generator, buat password, password kuat, password acak, kata sandi acak, pembuat kata sandi, random password`
- Use cases: akun email, media sosial, marketplace, password Wi-Fi.
- FAQ: 1) `Bagaimana cara membuat password yang kuat?` 2) `Berapa panjang password yang aman?` — at least 12–16
  characters with mixed types; tool range 8–64, default 16; never reuse. 3) `Apakah password yang dibuat dikirim ke
  server?` — no, Web Crypto API in the browser.

**timestamp-converter** · Demand LOW-EN (`unix timestamp converter`, `unix timestamp to date`, `epoch converter`)
- H1: `Unix Timestamp Converter – Timestamp ke Tanggal` · short: `Konverter timestamp`
- seo.title: `Unix Timestamp Converter – Timestamp ke Tanggal` (61)
- seo.description: `Ubah Unix timestamp ke tanggal dan tanggal ke timestamp dalam detik atau milidetik. Lihat waktu UTC dan lokal sekaligus, gratis.`
- Keywords: `unix timestamp converter, konversi timestamp, timestamp ke tanggal, tanggal ke timestamp, epoch converter, unix time, epoch`
- FAQ: 1) `Bagaimana cara mengubah Unix timestamp ke tanggal?` 2) `Apa bedanya timestamp detik (10 digit) dan milidetik
  (13 digit)?` 3) privacy/free.

**html-entity-encoder-decoder** · Demand LOW-EN (`html entity encode/decode`, `html encode online`)
- H1: `HTML Entity Encode & Decode Online` · short: `Konverter entity HTML`
- seo.title: `HTML Entity Encode & Decode – Karakter Khusus` (63 as rendered)
- seo.description: `Encode karakter khusus seperti <, > dan & menjadi entity HTML, atau decode entity kembali ke teks. Gratis dan tanpa mengirim data.`
- Keywords: `html entity encode, html entity decode, html encode, html decode, escape html, karakter khusus html, html entities`
- FAQ: 1) `Bagaimana cara mengubah karakter khusus menjadi entity HTML?` 2) `Kenapa karakter < > dan & perlu diubah
  menjadi entity?` — so they display as text instead of being read as HTML. 3) privacy/free.

### Group B

**csv-to-json** · Demand LOW-EN/MED (`csv to json`, `csv ke json`)
- H1: `Konversi CSV ke JSON Online` · short: `CSV ke JSON`
- seo.title: `Konversi CSV ke JSON Online Gratis` (48)
- seo.description: `Ubah data CSV dengan baris header menjadi array JSON yang rapi. Tanda kutip dan koma di dalam sel ditangani langsung di browser Anda.`
- Keywords: `csv ke json, csv to json, konversi csv ke json, ubah csv ke json, csv converter, csv parser`
- MARKET TRAP: the parser splits on COMMA only. Excel with Indonesian regional settings saves “CSV” with semicolons
  (`;`). Never claim semicolon support.
- FAQ: 1) `Bagaimana cara mengubah CSV ke JSON?` — first row = key names. 2) `Bagaimana jika file CSV dari Excel
  memakai titik koma (;)?` — the tool reads commas as the separator; save/export with comma separators first (or
  replace `;` with `,` when no cell contains commas). 3) free/no upload.

**json-to-csv** · Demand LOW-EN/MED (`json to csv`, `json ke csv`, `convert json ke excel`)
- H1: `Konversi JSON ke CSV Online` · short: `JSON ke CSV`
- seo.title: `Konversi JSON ke CSV Online Gratis` (48)
- seo.description: `Ubah array objek JSON menjadi tabel CSV dengan satu kolom untuk setiap key. Gratis, tanpa akun, dan data tidak diunggah ke server.`
- Keywords: `json ke csv, json to csv, konversi json ke csv, ubah json ke csv, json ke excel, export json ke csv`
- FAQ: 1) `Format JSON seperti apa yang bisa diubah ke CSV?` — an array of objects; keys become columns, nested values
  stay as JSON text. 2) `Bagaimana membuka hasil CSV di Excel?` — output uses commas; in Excel ID use
  Data › Dari Teks/CSV and choose koma as the delimiter. 3) privacy/free.

**random-number-generator** · Demand HIGH (`angka acak`, `random angka`, `generator angka acak`, `undian nomor acak`)
- H1: `Generator Angka Acak Online` · short: `Generator angka acak`
- seo.title: `Generator Angka Acak – Random Angka Online` (56)
- seo.description: `Buat angka acak bulat atau desimal di antara dua batas untuk undian, arisan, atau kuis. Memakai sumber acak aman di browser, gratis.`
- Keywords: `generator angka acak, angka acak, random angka, acak angka, random number generator, undian nomor acak, acak arisan, angka acak 1 sampai 100`
- COMPLIANCE: autocomplete is full of gambling terms (`togel`, `4D`, `angka keberuntungan`). Gambling is illegal in
  Indonesia — never use or target those words anywhere.
- Use cases: undian giveaway, kocok arisan (give each member a number), nomor absen/presentasi, kuis kelas.
- FAQ: 1) `Bagaimana cara membuat angka acak antara dua angka?` 2) `Bisakah dipakai untuk undian arisan atau
  giveaway?` — yes: number the participants and generate one number per click; a number can repeat (no
  no-duplicates option). 3) `Apakah hasilnya benar-benar acak dan privat?` — secure random source in the browser;
  integer range must be under 4,29 miliar.

**uuid-generator** · Demand LOW-EN (`uuid generator`, `generate uuid v4`)
- H1: `UUID v4 Generator Online` · short: `UUID generator`
- seo.title: `UUID Generator Online – Buat UUID v4 Acak` (55)
- seo.description: `Buat 1 hingga 100 UUID v4 acak sekaligus dengan sumber acak aman di browser Anda. Salin semuanya dalam satu klik, gratis tanpa akun.`
- Keywords: `uuid generator, generate uuid, uuid v4, buat uuid, guid generator, uuid online, random uuid`
- FAQ: 1) `Bagaimana cara membuat UUID v4?` 2) `Apa itu UUID v4?` — 128-bit random identifier for database/test data.
  3) `Berapa banyak UUID yang bisa dibuat sekaligus?` — 1–100, generated locally.

**sha256-hash-generator** · Demand LOW-EN (`sha256 generator`, `hash sha256 online`; also `sha256 decrypt` = misconception)
- H1: `SHA-256 Hash Generator Online` · short: `Generator hash SHA-256`
- seo.title: `SHA-256 Generator – Buat Hash SHA-256 dari Teks` (61)
- seo.description: `Buat hash SHA-256 heksadesimal dari teks memakai Web Crypto API. Gratis, cepat, dan teks Anda tetap di browser, tidak diunggah.`
- Keywords: `sha256 generator, sha-256 online, hash sha256, buat hash, sha256 hash, checksum, text to sha256`
- Honesty: text only, not files.
- FAQ: 1) `Bagaimana cara membuat hash SHA-256 dari teks?` 2) `Apakah hash SHA-256 bisa dikembalikan ke teks asli?` —
  no, hashing is one-way, not encryption. 3) privacy.

**regex-tester** · Demand LOW-EN (`regex tester online`, `regex javascript`)
- H1: `Regex Tester – Uji Ekspresi Reguler Online` · short: `Regex tester`
- seo.title: `Regex Tester Online – Uji Ekspresi Reguler` (56)
- seo.description: `Uji ekspresi reguler JavaScript dengan flag pilihan pada contoh teks dan lihat semua kecocokannya. Gratis dan berjalan di browser Anda.`
- Keywords: `regex tester, regex online, uji regex, cek regex, ekspresi reguler, regular expression, regexp, regex javascript`
- Behavior: JavaScript RegExp; `g` is always added; default flags `gi`.
- FAQ: 1) `Bagaimana cara menguji regex?` 2) `Flag regex apa saja yang bisa dipakai?` — JavaScript flags such as `g`,
  `i`, `m`, `s`, `u`. 3) privacy.

**jwt-decoder** · Demand LOW-EN (`jwt decode`, `decode jwt token online`)
- H1: `JWT Decoder – Baca Header dan Payload Token` · short: `JWT decoder`
- seo.title: `JWT Decoder Online – Decode Token JWT` (51)
- seo.description: `Decode header dan payload JSON Web Token langsung di browser tanpa mengirim token. Alat ini tidak memverifikasi signature, gratis.`
- Keywords: `jwt decoder, decode jwt, jwt decode online, decode token jwt, json web token, jwt parser`
- FAQ: 1) `Bagaimana cara decode token JWT?` 2) `Apakah decode JWT sama dengan memverifikasi token?` — no; signature is
  not verified. 3) `Apakah token saya aman?` — never sent; still avoid pasting production secrets on shared devices.

**color-converter** · Demand MED (`hex to rgb`, `konversi warna hex ke rgb`, `kode warna`)
- H1: `Konverter Warna HEX, RGB & HSL` · short: `Konverter warna`
- seo.title: `Konverter Warna – HEX ke RGB & HSL Online` (55)
- seo.description: `Konversi kode warna HEX, RGB, dan HSL dengan pratinjau langsung. Praktis untuk CSS, desain, dan palet warna brand, gratis di browser.`
- Keywords: `konverter warna, konversi warna, hex ke rgb, rgb ke hex, hex ke hsl, kode warna, color converter, hex to rgb`
- Honesty: no CMYK (searched as `rgb ke cmyk`) — do not claim it.
- FAQ: 1) `Bagaimana cara mengubah kode warna HEX ke RGB?` — e.g. `#4D6BFF`. 2) `Format warna apa saja yang
  didukung?` — HEX, RGB, HSL only. 3) free/in browser.

**url-parser** · Demand LOW-EN (`url parser online`, `parse url`)
- H1: `URL Parser – Urai Bagian dan Parameter URL` · short: `URL parser`
- seo.title: `URL Parser Online – Lihat Parameter Query URL` (59)
- seo.description: `Urai URL menjadi protokol, host, path, query, hash, dan parameter seperti UTM. Gratis, dan link Anda tidak dikirim ke server mana pun.`
- Keywords: `url parser, parse url, urai url, parameter query, cek parameter url, utm, komponen url`
- FAQ: 1) `Bagaimana cara mengurai sebuah URL?` — must include `https://`. 2) `Bisakah melihat parameter UTM di link
  iklan?` — yes (`utm_source`, `utm_campaign`). 3) privacy.

**roman-numeral-converter** · Demand HIGH (`angka romawi`, `angka romawi 2026`, `konversi angka romawi`, `romawi ke angka`)
- H1: `Konversi Angka Romawi Online` · short: `Konverter angka Romawi`
- seo.title: `Konversi Angka Romawi – Angka & Tahun ke Romawi` (61)
- seo.description: `Ubah angka biasa ke angka Romawi atau sebaliknya secara instan, termasuk tahun seperti 2026 = MMXXVI. Mendukung angka 1 sampai 3.999.`
- Keywords: `angka romawi, konversi angka romawi, angka ke romawi, romawi ke angka, tahun romawi, konverter angka romawi, roman numeral`
- Card headings (ui): `Angka ke Romawi` / `Romawi ke angka` (search phrasing; matches the buttons).
- Use cases: tahun di sampul/undangan, nomor surat resmi (bulan dalam Romawi, e.g. `IX` for September), bab
  skripsi, nomor kelas (`XII`).
- FAQ: 1) `Bagaimana cara mengubah angka ke angka Romawi?` 2) `Angka Romawi 2026 ditulis bagaimana?` — `MMXXVI`.
  3) `Berapa angka terbesar yang didukung?` — 1–3.999; free, in browser.

**binary-converter** · Demand MED (`konversi biner`, `desimal ke biner`, `kalkulator konversi bilangan`)
- H1: `Konversi Bilangan Biner, Desimal, Oktal & Heksadesimal` · short: `Konverter bilangan biner`
- seo.title: `Konversi Bilangan Biner, Desimal & Heksadesimal` (61)
- seo.description: `Konversi bilangan bulat antara biner, oktal, desimal, dan heksadesimal secara instan. Mendukung angka besar, gratis, dan berjalan di browser.`
- Keywords: `konversi bilangan, konversi biner, kalkulator biner, desimal ke biner, biner ke desimal, heksadesimal, oktal, kalkulator konversi bilangan, sistem bilangan`
- Honesty: integers only (no fractions, no `biner ke huruf` text translation).
- Use cases: tugas Informatika/TKJ, jaringan (subnet: one octet at a time, e.g. `255`; a dotted mask is rejected), pemrograman.
- FAQ: 1) `Bagaimana cara mengubah desimal ke biner?` 2) `Basis bilangan apa saja yang didukung?` — 2, 8, 10, 16.
  3) free/in browser, large integers via BigInt.

### Group C

**prime-number-checker** · Demand MED (`cek bilangan prima`, `kalkulator bilangan prima`; most queries informational: `bilangan prima adalah`, `bilangan prima 1-100`)
- H1: `Cek Bilangan Prima Online` · short: `Cek bilangan prima`
- seo.title: `Cek Bilangan Prima – Kalkulator Bilangan Prima` (60)
- seo.description: `Cek apakah sebuah bilangan bulat termasuk bilangan prima atau bukan dalam sekali klik. Mendukung angka hingga satu triliun, gratis.`
- Keywords: `bilangan prima, cek bilangan prima, kalkulator bilangan prima, apakah bilangan prima, uji bilangan prima, prime number checker`
- FAQ: 1) `Bagaimana cara mengecek bilangan prima?` 2) `Apakah 1 termasuk bilangan prima?` — no; a prime is > 1 with
  exactly two divisors (1 and itself); 2 is the only even prime. 3) `Berapa angka terbesar yang bisa dicek?` —
  0–1.000.000.000.000, in browser.

**average-calculator** · Demand HIGH (`kalkulator rata rata`, `hitung rata rata nilai raport`, `rata rata nilai`)
- H1: `Kalkulator Rata-Rata Online` · short: `Kalkulator rata-rata`
- seo.title: `Kalkulator Rata-Rata – Hitung Nilai Rata-Rata` (59)
- seo.description: `Hitung rata-rata, jumlah, banyak data, nilai terkecil, dan terbesar dari daftar angka. Cocok untuk nilai rapor dan data harian, gratis.`
- Keywords: `kalkulator rata-rata, kalkulator rata rata, hitung rata-rata, rata-rata nilai, rata-rata rapor, nilai rata-rata raport, mean, average calculator`
- Use cases: rata-rata nilai rapor (SNBP), nilai ujian, pengeluaran harian, hasil penjualan.
- Separator rule §3.3 (spasi, titik koma, baris baru; koma = desimal: `85,5; 90; 78`).
- FAQ: 1) `Bagaimana cara menghitung rata-rata nilai rapor?` — enter each grade, mean = total ÷ banyak data.
  2) `Bagaimana memisahkan angka yang mengandung desimal?` — spasi, titik koma, or new line; koma for decimals.
  3) privacy/free.

**ratio-proportion-calculator** · Demand MED (`kalkulator perbandingan`, `perbandingan senilai`, `kalkulator rasio`)
- H1: `Kalkulator Perbandingan dan Rasio` · short: `Kalkulator perbandingan`
- seo.title: `Kalkulator Perbandingan Senilai & Rasio Online` (60)
- seo.description: `Cari nilai yang belum diketahui pada perbandingan A:B = C:X dan sederhanakan rasio. Praktis untuk resep, skala, dan campuran, gratis.`
- Keywords: `kalkulator perbandingan, perbandingan senilai, kalkulator rasio, hitung perbandingan, sederhanakan rasio, proporsi, ratio calculator`
- Honesty: only direct proportion (`senilai`); NOT `berbalik nilai`. Inputs must be positive.
- Use cases: resep kue, skala peta/denah, campuran semen/cat, pupuk.
- FAQ: 1) `Bagaimana cara menghitung perbandingan senilai?` — X = B × C ÷ A. 2) `Bisakah dipakai untuk resep dan skala
  peta?` — yes. 3) free/in browser.

**time-duration-calculator** · Demand HIGH (`kalkulator jam` = SERP head term, `hitung selisih jam`, `menghitung selisih jam`, `kalkulator jam kerja`, `kalkulator durasi waktu`)
- H1: `Kalkulator Jam – Hitung Selisih Jam dan Durasi` · short: `Kalkulator jam`
- seo.title: `Kalkulator Jam – Hitung Selisih Jam dan Durasi` (60)
- seo.description: `Hitung selisih waktu antara dua tanggal dan jam dalam hari, jam, menit, dan detik. Cocok untuk jam kerja, shift, dan perjalanan, gratis.`
- Keywords: `kalkulator jam, hitung selisih jam, menghitung selisih jam, kalkulator jam kerja, kalkulator durasi waktu, hitung durasi, lama waktu, selisih waktu`
- Honesty: no break deduction, no overtime (`lembur`) pay.
- FAQ: 1) `Bagaimana cara menghitung selisih jam?` 2) `Bagaimana menghitung jam kerja shift malam yang melewati
  tengah malam?` — set the end date to the next day. 3) `Apakah kalkulator jam ini gratis?` — privacy/free.

**number-to-words-converter** · Demand HIGH (`terbilang`, `angka ke huruf online`, `terbilang rupiah`, `kwitansi`)
- H1: `Terbilang Angka ke Huruf Online` · short: `Terbilang angka`
- seo.title: `Terbilang Online – Ubah Angka ke Huruf` (52)
- seo.description: `Ubah angka menjadi huruf dalam bahasa Indonesia, misalnya 1.500.000 menjadi satu juta lima ratus ribu. Untuk kuitansi dan invoice, gratis.`
- Keywords: `terbilang, terbilang angka, angka ke huruf, terbilang online, angka terbilang, terbilang rupiah, konversi angka ke huruf, kuitansi, kwitansi`
- Use cases: kuitansi, nota, invoice, cek/bilyet giro, kontrak, surat resmi (terbilang is mandatory on many finance
  documents to prevent tampering).
- Honesty: output has NO `rupiah` suffix and is lowercase; users append `rupiah` and can use `Kapital Tiap Kata`
  from the case converter; no decimals/sen.
- FAQ: 1) `Bagaimana cara mengubah angka menjadi terbilang?` — type `1.500.000` or `1500000`. 2) `Apakah hasilnya
  sudah termasuk kata “rupiah”?` — no; add `rupiah` yourself, e.g. `satu juta lima ratus ribu rupiah`.
  3) `Berapa angka terbesar yang bisa diubah?` — -999.999.999.999 sampai 999.999.999.999; processed in browser.

**remove-line-breaks** · Demand MED (`hapus enter online`, `remove line breaks online`; many Word/Excel how-to queries)
- H1: `Hapus Enter dan Baris Baru dari Teks` · short: `Penghapus enter`
- seo.title: `Hapus Enter Online – Gabungkan Baris Teks` (55)
- seo.description: `Hapus enter dan baris baru dari teks hasil salin PDF, Word, atau email, lalu gabungkan jadi satu paragraf rapi. Gratis dan tanpa unggah.`
- Keywords: `hapus enter, hapus enter online, hapus baris baru, gabungkan baris, hapus line break, remove line breaks, rapikan teks pdf`
- Behavior: `Gabung dengan spasi` (join with spaces) or `Hapus enter` (join with nothing); repeated spaces/tabs collapse
  to one and edges are trimmed.
- FAQ: 1) `Bagaimana cara menghapus enter pada teks hasil salin dari PDF?` 2) `Apa beda Gabung dengan spasi dan
  Hapus enter?` — the second glues lines without a space (for words split across lines). 3) privacy/free.

**text-diff-checker** · Demand MED (`diff checker`, `bandingkan dua teks`, `cek perbedaan teks`; `bandingkan teks` alone = school assignments)
- H1: `Bandingkan Dua Teks Online` · short: `Pembanding teks`
- seo.title: `Bandingkan Dua Teks Online – Diff Checker` (55)
- seo.description: `Bandingkan dua teks baris demi baris dan lihat baris mana yang berubah. Cocok untuk draf, kode, dan dokumen, gratis tanpa unggah file.`
- Keywords: `bandingkan teks, bandingkan dua teks, cek perbedaan teks, diff checker, text compare, perbandingan teks, compare text`
- Honesty: compares by line number (an inserted line shifts later lines); no word-level highlighting.
- FAQ: 1) `Bagaimana cara membandingkan dua teks?` 2) `Bagaimana perbedaan ditampilkan?` — for each differing line
  number, original and changed line. 3) privacy/free.

**unit-converter** · Demand HIGH (`konversi satuan`, `inci ke cm`, `kg ke pound`, `celcius ke fahrenheit`, `galon ke liter`)
- H1: `Konversi Satuan Panjang, Berat, Suhu & Volume` · short: `Konverter satuan`
- seo.title: `Konversi Satuan Online – Panjang, Berat & Suhu` (60)
- seo.description: `Konversi satuan panjang, berat, suhu, dan volume, seperti inci ke cm, kg ke pound, atau Celsius ke Fahrenheit. Cepat dan gratis.`
- Keywords: `konversi satuan, konverter satuan, konversi panjang, konversi berat, konversi suhu, konversi volume, inci ke cm, kg ke pound, celsius ke fahrenheit, celcius, galon ke liter`
- Honesty: no area, speed, Reamur, currency, `ons`/`pon`/`kuintal`/`ton`.
- FAQ: 1) `Bagaimana cara mengonversi satuan?` 2) `Apakah galon di sini sama dengan galon air minum?` — no: `Galon
  AS` = 3,785 liter, not the 19-L water jug; also `Pound (lb)` = 0,454 kg and `Ounce (oz)` = 28,35 g (not the local
  pon/ons). 3) `Apakah konverter ini gratis?` — yes, in browser.

**date-calculator** · Demand HIGH (`hitung hari`, `kalkulator tanggal`, `menghitung jumlah hari`, `berapa hari dari tanggal … sampai sekarang`, `90 hari ke depan`)
- H1: `Kalkulator Tanggal – Hitung Jumlah Hari` · short: `Kalkulator tanggal`
- seo.title: `Kalkulator Tanggal – Hitung Jumlah Hari Online` (60)
- seo.description: `Hitung jumlah hari antara dua tanggal atau tambah dan kurangi hari dari tanggal tertentu. Cocok untuk tenggat, kontrak, dan jadwal.`
- Keywords: `kalkulator tanggal, hitung hari, hitung jumlah hari, menghitung jumlah hari, selisih tanggal, tambah hari, hitung hari ke depan, kalkulator hari`
- Honesty: calendar days only (no hari kerja/libur nasional, no weton/hari pasaran, no usia in years/months).
- Use cases: masa kontrak/sewa, tenggat tugas, 40 hari/100 hari, jatuh tempo tagihan, cuti.
- 40/100 hari: custom counts the day of death as day 1 (`masarma`/`rosarma`), so the copy says add 39 or 99 days;
  the tool adds exact days (1 Jan + 40 = 10 Feb).
- FAQ: 1) `Bagaimana cara menghitung jumlah hari antara dua tanggal?` 2) `Apakah tanggal awal ikut dihitung?` — no,
  the result is the difference (1 → 2 Januari = 1 hari); add 1 to count both days. 3) `Apakah kalkulator tanggal
  ini gratis?` — yes, runs in the browser; the second mode adds days (e.g. `90 hari ke depan`) and a negative number
  subtracts days.

**qr-code-generator** · Demand HIGH (`buat qr code`, `qr code generator gratis`, `membuat barcode link`, `qr code wa`)
- H1: `Buat QR Code Gratis dari Link atau Teks` · short: `Generator QR code`
- seo.title: `Buat QR Code Gratis – QR Code Generator Online` (60)
- seo.description: `Buat QR code hitam putih dari link atau teks singkat, lalu unduh sebagai gambar PNG. Gratis, tanpa daftar, dan dibuat di browser Anda.`
- Keywords: `buat qr code, qr code generator, bikin qr code, qr code gratis, qr code link, kode qr, barcode link, buat barcode link`
- Market note: many Indonesians call a QR code “barcode” (`membuat barcode link google form`). Mention once:
  `QR code (sering disebut barcode)`. Honesty: black/white only, PNG 256/384/512 px, max 106 byte of content,
  no logo/colors, no QRIS payment codes.
- Use cases: link Google Form pendaftaran, menu warung/kafe, link WhatsApp `wa.me/62…`, Google Maps, katalog.
- FAQ: 1) `Bagaimana cara membuat QR code dari link?` 2) `Apakah QR code ini bisa kedaluwarsa?` — no: the link is
  stored directly in the image (no redirect service), so it works as long as the link itself works. 3) `Berapa
  panjang link atau teks maksimal?` — 106 byte (≈106 Latin characters; emoji take more); generated in browser.

**time-zone-converter** · Demand HIGH (`utc ke wib`, `konversi waktu`, `jam dunia`, `perbedaan waktu indonesia …`)
- H1: `Konversi Zona Waktu – UTC ke WIB dan Kota Dunia` · short: `Konverter zona waktu`
- seo.title: `Konversi Zona Waktu – UTC ke WIB & Kota Dunia` (63 escaped). `jam dunia` = world-clock intent: keywords only.
- seo.description: `Konversi jam WIB ke UTC, Tokyo, London, New York, dan zona waktu lain, termasuk perubahan waktu musim panas. Gratis di browser Anda.`
- Keywords: `konversi zona waktu, konversi waktu, utc ke wib, wib ke utc, jam dunia, perbedaan waktu, selisih waktu negara, zona waktu`
- Honesty: the list has ONLY Jakarta (WIB) for Indonesia — never mention WITA/WIT/Makassar/Jayapura. Indonesia has
  no DST; DST changes apply to London, Madrid, New York, Chicago, Denver, Los Angeles, Sydney.
- Use cases: jadwal meeting/online class, siaran bola, rilis game/konser K-pop, call with clients abroad.
- FAQ: 1) `Bagaimana cara mengubah jam antar zona waktu?` 2) `Berapa selisih UTC dan WIB?` — WIB = UTC+7 (08.00 UTC =
  15.00 WIB). 3) privacy/free.

### 4.1 Demand summary
- HIGH: word-counter, text-case-converter, percentage-calculator, password-generator, random-number-generator,
  roman-numeral-converter, average-calculator, number-to-words-converter, unit-converter, date-calculator,
  qr-code-generator, time-zone-converter.
- MED: remove-duplicate-lines, color-converter, binary-converter, prime-number-checker (informational), ratio,
  time-duration, remove-line-breaks, text-diff-checker.
- LOW-EN (keep English head term): json-formatter, base64, url-encoder, text-to-slug, timestamp, html-entity,
  csv-to-json, json-to-csv, uuid, sha256, regex, jwt, url-parser.
- Gaps users want that the tools do NOT do (never claim): WITA/WIT, CMYK, base64↔image/file, hari kerja/libur,
  weton, Reamur, semicolon CSV, terbilang with sen/rupiah, QR with logo/colors.

---

## 5. Copy fields — writing rules per field

- `copy[id][0]` H1 exactly as §4. `[1]` short title exactly as §4 (sentence case, reads well in
  `Bagaimana cara memakai {name}?`). `[2]` card description: one sentence, verb-first (`Hitung…`, `Ubah…`,
  `Buat…`), ≤ ~110 chars. `[3]` keywords line from §4. `[4]` intro: 1–2 imperative sentences. `[5]` body: 2–3
  sentences (≤ ~350 chars) with the local use cases listed in §4.
- Never promise anything in §4 “Honesty”/“Gaps”. Always write numbers in Indonesian format.

---

## 6. Market adaptations for the engineer (runtime.js)

### 6.1 `window.usefulverseLocale.numberToWords(value: BigInt) → string`
Rules (EYD V / standard terbilang; verified against terbilangonline.com and kalkulator.click):
- digits: `nol, satu, dua, tiga, empat, lima, enam, tujuh, delapan, sembilan`
- 10 `sepuluh`, 11 `sebelas`, 12–19 `<digit> belas` (`dua belas`, `sembilan belas`)
- 20–99 `<digit> puluh[ <digit>]` (`dua puluh satu`, `sembilan puluh sembilan`)
- 100–199 `seratus[ <rest>]`; 200–999 `<digit> ratus[ <rest>]`
- groups of three digits with scales `ribu` (10³), `juta` (10⁶), `miliar` (10⁹). Range max 999.999.999.999, so
  `triliun` is never needed.
- The `se-` prefix applies ONLY to the thousands group equal to exactly 1: `seribu` (never `satu ribu`). Juta and
  miliar keep `satu`: `satu juta`, `satu miliar` (not `sejuta`, `semiliar`).
- Skip zero groups; single spaces; lowercase; no `rupiah`, no `dan`.
- 0 → `nol`; negative → `minus ` + words of the absolute value (`minus` is what terbilang tools use; `negatif` is
  also correct but pick `minus`).
- Must pass (and contain no digits):

| value | output |
|---|---|
| 0 | `nol` |
| 7 | `tujuh` |
| 10 | `sepuluh` |
| 11 | `sebelas` |
| 12 | `dua belas` |
| 21 | `dua puluh satu` |
| 99 | `sembilan puluh sembilan` |
| 100 | `seratus` |
| 101 | `seratus satu` |
| 111 | `seratus sebelas` |
| 1000 | `seribu` |
| 1001 | `seribu satu` |
| 1100 | `seribu seratus` |
| 2000 | `dua ribu` |
| 11000 | `sebelas ribu` |
| 21000 | `dua puluh satu ribu` |
| 100000 | `seratus ribu` |
| 101000 | `seratus satu ribu` |
| 1000000 | `satu juta` |
| 1001000 | `satu juta seribu` |
| 1500000 | `satu juta lima ratus ribu` |
| 10000000 | `sepuluh juta` |
| 123456789 | `seratus dua puluh tiga juta empat ratus lima puluh enam ribu tujuh ratus delapan puluh sembilan` |
| 1000000000 | `satu miliar` |
| 999999999999 | `sembilan ratus sembilan puluh sembilan miliar sembilan ratus sembilan puluh sembilan juta sembilan ratus sembilan puluh sembilan ribu sembilan ratus sembilan puluh sembilan` |
| -42 | `minus empat puluh dua` |

- Input side (already in app.js): with `commaDecimal`, `1.500.000`, `1 500 000` and `1500000` are accepted;
  `1,500,000` is rejected (comma = decimal). FAQ/intro should show `1.500.000`.

### 6.2 Reading time
Keep `readingRate: 200` words/minute and word-based counting (no `readingUnit`, no `wordSegmentation`: Indonesian
uses spaces). Indonesian adult norms are 150–300 kpm (Perpusnas cites 250–300 for fluent adults; school norms
~200), and Indonesian words are longer than English ones (affixes), so 200 is the right conservative estimate. State
“200 kata per menit” wherever reading time is explained.

### 6.3 Number, date and time formats (already provided by Intl `id-ID`)
- `formatNumber` → `1.234.567,891`; negative `-3,5`.
- Date calculator long date → `Selasa, 29 September 2026`.
- Timestamp local → `21 Sep 2026, 21.13.20`.
- Time zone output → `Selasa, 29 September 2026 pukul 15.00.00 WIB`; UTC shows `UTC`, New York `EDT`, London `GMT+1`.
- Percent/ratio/unit/random/average inputs accept `2,5` and `1.000,5`.
No runtime.js code is needed for formats; only `numberToWords`.

### 6.4 Other behavior notes to reflect in copy
- CSV→JSON splits on commas only (Indonesian Excel exports `;`) — §4 csv-to-json FAQ.
- JSON→CSV writes commas — §4 json-to-csv FAQ.
- Average list: `;`/space/new line separators in id — §3.3.
- Title Case capitalizes every word (EYD titles keep `dan/di/ke/yang` lowercase) — §4 text-case FAQ.
- Unit labels avoid local `pon`/`ons`/`galon` ambiguity — §3.1.
- Time zone list: Jakarta = `Jakarta (WIB)`; no WITA/WIT.

---

## 7. Shared-infrastructure observations (for the orchestrator)
- Skeleton is missing visible/runtime keys: `Jakarta`, `Seoul`, `India (Kolkata)` (time-zone options) and
  `Base64 to decode...` (runtime placeholder). Owners add them to their `ui` (merged pack-wide); `Seoul` and
  `India (Kolkata)` also go into `meta.keepEnglish`.
- Product gap worth a future template change (not for this task): add `Asia/Makassar` (WITA) and `Asia/Jayapura`
  (WIT) — `wib ke wita`/`wib ke wit` are top Indonesian time queries.
- Product gap: CSV parser without `;` support hurts Indonesian Excel users.

---

## Sources
- Google autocomplete `hl=id&gl=id` (queries listed in §4), 29 Sep 2026.
- terbilangonline.com (examples: 1.000.000 = satu juta, 1.000.000.000 = satu miliar, negatives with `minus`);
  kalkulator.click/kalkulator-terbilang (`seribu`, `satu juta`, `satu miliar`, `minus`/`negatif`, `nol`).
- tirto.id / kumparan.com — EYD V rules for numbers; ayobandung.id EYD V summary.
- Perpustakaan Nasional RI (x.com/perpusnas1) — adult reading 250–300 kpm; gubuk.sabda.org reading norms.
- Competitor titles: writerbuddy.ai/id, apridesain.id, ngetools.id (penghitung kata); rifqimulyawan.com,
  wordcount.com/id (konverter huruf); indo.tools, kalkulatormatematika.id, itungin.com (kalkulator persen);
  pwgen.io/id, avast.com/id-id (password); computing.id (JSON, Base64); timestamp.id, toolv.com/id (timestamp);
  berhitung.id, petunjuk.id (angka Romawi 1–3999); catatanmatematika.com, kalkulator.now (bilangan prima);
  rapidtables.org/id, petunjuk.id (rata-rata); toolv.com/id, online-kalkulator.net (perbandingan);
  kalkulatorjam.com, kalenderku.id (durasi, tanggal); textcompare.org/id (bandingkan teks); unitconv.org/id,
  indo.tools (konversi satuan); s.id, viralqr.com/id (QR code); tooleem.com/id, my-util.com/id (zona waktu);
  indo.tools, terakhir.com (angka acak).
- Microsoft Support id-ID (Word “Kapitalisasi Setiap Kata”; Excel duplicate removal).

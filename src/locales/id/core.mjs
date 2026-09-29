// Bahasa Indonesia — core strings: site meta, page templates, home/shared UI, shared runtime messages and runtime templates.
// Keys are the English source strings and must stay unchanged; translate the values only.
export const meta = {
  "code": "id",
  "name": "Bahasa Indonesia",
  "prefix": "/id",
  "tag": "id-ID",
  // EYD V title case capitalizes both halves of a reduplicated word (as in "Rata-Rata").
  "homeTitle": "UsefulVerse — Alat Online Gratis untuk Tugas Sehari-Hari",
  "homeDescription": "Alat online gratis yang cepat dan privat untuk teks, data, SEO, dan hitungan sehari-hari. Langsung di browser, tanpa akun dan tanpa unggah file.",
  "homeLabel": "Beranda",
  "homeMarker": "Alat",
  // Byte-identical strings that are correct Indonesian (GLOSSARY §3.4); pack-wide list.
  "keepEnglish": ["Data", "Developer", "Minimum", "Minify", "Header", "Payload", "Host", "Path", "Query", "Hash", "Volume", "Celsius", "Fahrenheit", "Kelvin", "London", "Madrid", "Tokyo", "Sydney", "Seoul", "India (Kolkata)"],
  // Reviewed, unchanged (GLOSSARY §0/§6): comma decimal + dot thousands; Indonesian is space-separated, so
  // word-based reading time at 200 words/min; long id-ID dates; time zones open on WIB → UTC: the prefilled
  // datetime is the visitor's local time, so WIB as the source zone is correct for most Indonesian visitors.
  "runtime": {
    "commaDecimal": true,
    "readingRate": 200,
    "longDates": true,
    "timeZones": {
      "from": "Asia/Jakarta",
      "to": "UTC"
    }
  }
};

export const page = {
  "faqHow": "Bagaimana cara memakai {name}?",
  "privacyQuestion": "Apakah data saya dikirim ke server?",
  "privacyAnswer": "Tidak. Semua proses berjalan di browser Anda dan data Anda tidak diunggah.",
  "about": "Tentang {title}.",
  "madeSimple": "{title}, praktis tanpa ribet.",
  "categoryTool": "Alat {category}",
  "workspace": "Area kerja {title}",
};

// id-ID has a single plural category ("other").
export const templates = {
  "reading.minutes": "{count} menit",
  "summary": "Kata: {words}\nKarakter: {characters}\nKarakter tanpa spasi: {noSpaces}\nBaris: {lines}\nWaktu baca: {reading} menit",
  "dedupe.kept": {"other":"{count} baris unik dipertahankan."},
  "percent.of": "{percent}% dari {base} = {result}",
  "percent.share": "{part} adalah {result}% dari {whole}",
  "percent.change": "Perubahan dari {from} ke {to} = {change}%",
  "rows.converted": {"other":"{count} baris berhasil dikonversi."},
  "uuid.generated": {"other":"{count} UUID berhasil dibuat di perangkat Anda."},
  "regex.matches": {"other":"{count} kecocokan ditemukan."},
  "duration.exact": "{days} hari {hours} jam {minutes} menit {seconds} detik",
  "diff.found": {"other":"{count} baris berbeda ditemukan."},
  "diff.line": "Baris {line}:",
  "diff.empty": "(kosong)",
  "date.days": {"other":"{count} hari"},
  "url.none": "(tidak ada)",
  "timestamp.local": "Waktu lokal: {value}",
  "timestamp.seconds": "Detik: {value}",
  "timestamp.milliseconds": "Milidetik: {value}",
};

export const ui = {
  "UsefulVerse home": "Beranda UsefulVerse",
  "Main navigation": "Navigasi utama",
  "Tools": "Alat",
  "How it works": "Cara kerja",
  "Find a tool": "Cari alat",
  "Language": "Bahasa",
  "A useful place on the internet": "Tempat yang berguna di internet",
  "Do the small things": "Selesaikan urusan kecil",
  "faster.": "lebih cepat.",
  "Simple browser tools for text, data and everyday work. No account. No upload. Just open a tool and get it done.": "Alat browser sederhana untuk teks, data, dan pekerjaan sehari-hari. Tanpa akun. Tanpa unggah. Buka alatnya, langsung beres.",
  "Explore tools": "Jelajahi alat",
  "UsefulVerse principles": "Prinsip UsefulVerse",
  "Fast by default": "Selalu cepat",
  "Private by design": "Privat sejak awal",
  "Free to use": "Gratis dipakai",
  "The toolbox": "Kotak alat",
  "Find the right tool.": "Temukan alat yang tepat.",
  "Search tools": "Cari alat",
  "Tool categories": "Kategori alat",
  "All": "Semua",
  "Writing": "Menulis",
  "Text": "Teks",
  "Developer": "Developer",
  "SEO": "SEO",
  "Everyday": "Sehari-hari",
  "Privacy": "Privasi",
  "Data": "Data",
  "Design": "Desain",
  "Open tool": "Buka alat",
  "No tools match that search yet. Try another word.": "Belum ada alat yang cocok dengan pencarian itu. Coba kata lain.",
  "Why UsefulVerse": "Kenapa UsefulVerse",
  "Small tools.": "Alat ringkas.",
  "Clear answers.": "Jawaban jelas.",
  "Open a tool": "Buka alat",
  "Each tool has one clear job. You can start in seconds.": "Setiap alat punya satu tugas yang jelas. Anda bisa mulai dalam hitungan detik.",
  "Work privately": "Tetap privat",
  "Your text stays in your browser for browser-first tools.": "Pada alat berbasis browser, teks Anda tidak keluar dari perangkat Anda.",
  "Take the result": "Ambil hasilnya",
  "Copy it or use it where you need it next.": "Salin, lalu pakai di mana pun Anda membutuhkannya.",
  "Simple tools that respect your time and your files.": "Alat sederhana yang menghargai waktu dan file Anda.",
  "All tools": "Semua alat",
  "Privacy first": "Privasi nomor satu",
  "Breadcrumb": "Navigasi jejak",
  "Runs in your browser. No upload.": "Berjalan di browser Anda. Tanpa unggah.",
  "Clear": "Kosongkan",
  "About this tool": "Tentang alat ini",
  "Common questions": "Pertanyaan umum",
  "Keep going": "Lanjutkan",
  "More useful tools": "Alat berguna lainnya",
  "Browse all tools": "Lihat semua alat",
  "Result": "Hasil",
  "Copy result": "Salin hasil",
  // Shared key: integer field label (prime checker, number to words) and sr-only "whole" field of the percentage calculator.
  "Whole number": "Bilangan bulat",
  "From": "Dari",
  "Minimum": "Minimum",
  "Maximum": "Maksimum",
};

export const runtimeMessages = {
  "There is nothing to copy yet.": "Belum ada yang bisa disalin.",
  "Copied to your clipboard.": "Tersalin ke papan klip.",
  "Copy was blocked. Select the result and copy it manually.": "Penyalinan diblokir. Pilih hasilnya, lalu salin secara manual.",
  "Choose a valid date and time.": "Pilih tanggal dan waktu yang valid.",
  "Number converted locally.": "Angka berhasil dikonversi di browser Anda.",
};

// Page-specific wording where a shared key means something else on that tool (see src/template.mjs).
export const toolUi = {
  "percentage-calculator": {"Whole number": "Nilai total"},
};

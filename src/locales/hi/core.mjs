// हिन्दी — core strings: site meta, page templates, home/shared UI, shared runtime messages and runtime templates.
// Keys are the English source strings and must stay unchanged; translate the values only.
// Style, terminology and decisions: ./GLOSSARY.md (§0 rules, §3 terms, §5 home/page templates, §8.2 runtime).
export const meta = {
  "code": "hi",
  "name": "हिन्दी",
  "prefix": "/hi",
  "tag": "hi-IN",
  "homeTitle": "मुफ़्त ऑनलाइन टूल – कैलकुलेटर, कन्वर्टर, जनरेटर | UsefulVerse",
  "homeDescription": "वर्ड काउंटर, प्रतिशत कैलकुलेटर, पासवर्ड जनरेटर, QR कोड जनरेटर जैसे तेज़ और निजी ब्राउज़र टूल। न अकाउंट, न अपलोड — सब मुफ़्त।",
  "homeLabel": "होम",
  "homeMarker": "टूल",
  "keepEnglish": [],
  "runtime": {
    // Text inputs so calculators accept Indian grouping (1,00,000 · 12,34,567); <input type="number"> rejects commas.
    "textNumberInputs": true,
    // No published silent-reading norm for Hindi; ~198 wpm read aloud (Rathna & Bharadwaja), so 200 stays.
    "readingRate": 200,
    "longDates": true,
    // IST → US Eastern is the most searched Indian time-zone conversion.
    "timeZones": {
      "from": "Asia/Kolkata",
      "to": "America/New_York"
    }
  }
};

// Colon forms are agreement-proof: tool titles can be nouns or actions (“… हटाएं”).
export const page = {
  "faqHow": "{name} कैसे इस्तेमाल करें?",
  "privacyQuestion": "क्या मेरा डेटा किसी सर्वर पर भेजा जाता है?",
  "privacyAnswer": "नहीं। सारा काम आपके ब्राउज़र में होता है और आपका डेटा अपलोड नहीं होता।",
  "about": "{title}: सवाल-जवाब",
  "madeSimple": "{title}: आसान और तेज़",
  "categoryTool": "{category} · टूल",
  "workspace": "टूल वर्कस्पेस: {title}",
};

// hi-IN plural categories: one (0 and 1) and other.
export const templates = {
  "reading.minutes": "{count} मिनट",
  "summary": "शब्द: {words}\nकैरेक्टर: {characters}\nस्पेस के बिना कैरेक्टर: {noSpaces}\nलाइनें: {lines}\nपढ़ने का समय: {reading} मिनट",
  "dedupe.kept": {"one":"{count} यूनिक लाइन रखी गई।","other":"{count} यूनिक लाइनें रखी गईं।"},
  "percent.of": "{base} का {percent}% = {result}",
  // “500 में से 432 = 86.4%”: the marks phrasing; “432, 500 का …” read like the single number 432,500.
  "percent.share": "{whole} में से {part} = {result}%",
  "percent.change": "{from} से {to} तक बदलाव = {change}%",
  "rows.converted": {"one":"{count} पंक्ति बदली गई।","other":"{count} पंक्तियां बदली गईं।"},
  "uuid.generated": {"one":"{count} UUID आपके ब्राउज़र में बना।","other":"{count} UUID आपके ब्राउज़र में बने।"},
  "regex.matches": {"one":"{count} मैच मिला।","other":"{count} मैच मिले।"},
  "duration.exact": "दिन: {days} · घंटे: {hours} · मिनट: {minutes} · सेकंड: {seconds}",
  "diff.found": {"one":"{count} लाइन में अंतर मिला।","other":"{count} लाइनों में अंतर मिला।"},
  "diff.line": "लाइन {line}:",
  "diff.empty": "(खाली)",
  "date.days": {"one":"{count} दिन","other":"{count} दिन"},
  "url.none": "(कुछ नहीं)",
  "timestamp.local": "स्थानीय समय: {value}",
  "timestamp.seconds": "सेकंड: {value}",
  "timestamp.milliseconds": "मिलीसेकंड: {value}",
};

export const ui = {
  "UsefulVerse home": "UsefulVerse होम",
  "Main navigation": "मुख्य नेविगेशन",
  "Tools": "टूल",
  "How it works": "यह कैसे काम करता है",
  "Find a tool": "टूल खोजें",
  "Language": "भाषा",
  "A useful place on the internet": "इंटरनेट पर काम की जगह",
  // H1 = “छोटे-छोटे काम<br>झटपट निपटाएं।” (one headline across the line break).
  "Do the small things": "छोटे-छोटे काम",
  "faster.": "झटपट निपटाएं।",
  "Simple browser tools for text, data and everyday work. No account. No upload. Just open a tool and get it done.": "टेक्स्ट, डेटा और रोज़मर्रा के कामों के लिए आसान ब्राउज़र टूल। न अकाउंट, न अपलोड। बस टूल खोलें और काम पूरा करें।",
  "Explore tools": "टूल देखें",
  "UsefulVerse principles": "UsefulVerse की खास बातें",
  "Fast by default": "हमेशा तेज़",
  "Private by design": "प्राइवेसी सबसे पहले",
  "Free to use": "बिल्कुल मुफ़्त",
  "The toolbox": "टूलबॉक्स",
  "Find the right tool.": "सही टूल खोजें।",
  "Search tools": "टूल खोजें",
  "Tool categories": "टूल की कैटेगरी",
  "All": "सभी",
  // Category names: filter chips, card labels, breadcrumb and the “{category} · टूल” eyebrow.
  "Writing": "लेखन",
  "Text": "टेक्स्ट",
  "Developer": "डेवलपर",
  "SEO": "SEO",
  "Everyday": "रोज़मर्रा",
  "Privacy": "प्राइवेसी",
  "Data": "डेटा",
  "Design": "डिज़ाइन",
  "Open tool": "टूल खोलें",
  "No tools match that search yet. Try another word.": "इस खोज से कोई टूल नहीं मिला। कोई दूसरा शब्द आज़माएं।",
  "Why UsefulVerse": "UsefulVerse क्यों",
  // H2 = “छोटे टूल।<br>सीधे जवाब।”
  "Small tools.": "छोटे टूल।",
  "Clear answers.": "सीधे जवाब।",
  "Open a tool": "टूल खोलें",
  "Each tool has one clear job. You can start in seconds.": "हर टूल का एक ही साफ़ काम है। आप कुछ ही सेकंड में शुरू कर सकते हैं।",
  "Work privately": "अपना काम निजी रखें",
  "Your text stays in your browser for browser-first tools.": "ब्राउज़र में चलने वाले टूल में आपका टेक्स्ट आपके ब्राउज़र से बाहर नहीं जाता।",
  "Take the result": "नतीजा पाएं",
  "Copy it or use it where you need it next.": "उसे कॉपी करें या जहाँ ज़रूरत हो, वहाँ इस्तेमाल करें।",
  "Simple tools that respect your time and your files.": "आसान टूल, जो आपके समय और आपकी फ़ाइलों की कद्र करते हैं।",
  "All tools": "सभी टूल",
  "Privacy first": "प्राइवेसी सबसे पहले",
  // Breadcrumb nav aria-label: the convention Hindi sites use for breadcrumbs.
  "Breadcrumb": "आप यहाँ हैं",
  "Runs in your browser. No upload.": "आपके ब्राउज़र में ही चलता है। कोई अपलोड नहीं।",
  "Clear": "साफ़ करें",
  "About this tool": "इस टूल के बारे में",
  // FAQ eyebrow; the H2 below it is “{title}: सवाल-जवाब”, so this avoids repeating सवाल-जवाब.
  "Common questions": "आम सवाल",
  "Keep going": "और देखें",
  "More useful tools": "और भी काम के टूल",
  "Browse all tools": "सभी टूल देखें",
  "Result": "नतीजा",
  "Copy result": "नतीजा कॉपी करें",
  "Whole number": "पूर्ण संख्या",
  // Shared label: percentage change (“से [100] … [125]”), unit converter and time zone card (से / में), as in Indian booking forms (से / तक).
  "From": "से",
  "Minimum": "न्यूनतम",
  "Maximum": "अधिकतम",
};

export const runtimeMessages = {
  "There is nothing to copy yet.": "अभी कॉपी करने के लिए कुछ नहीं है।",
  "Copied to your clipboard.": "क्लिपबोर्ड पर कॉपी हो गया।",
  "Copy was blocked. Select the result and copy it manually.": "कॉपी नहीं हो सका। नतीजा चुनकर खुद कॉपी करें।",
  "Choose a valid date and time.": "सही तारीख और समय चुनें।",
  "Number converted locally.": "संख्या आपके ब्राउज़र में ही बदल दी गई।",
};

// Page-specific wording where a shared key means something else on that tool (see src/template.mjs).
export const toolUi = {
  "percentage-calculator": {"Whole number": "कुल मान"},
};

// 한국어 — core strings: site meta, page templates, home/shared UI, shared runtime messages and runtime templates.
// Keys are the English source strings and must stay unchanged; translate the values only.
export const meta = {
  "code": "ko",
  "name": "한국어",
  "prefix": "/ko",
  "tag": "ko-KR",
  "homeTitle": "무료 온라인 도구 모음 - 텍스트·개발·계산기 | UsefulVerse",
  "homeDescription": "글자수 세기, JSON 정렬, 퍼센트 계산기, QR코드 생성기 등 33가지 무료 온라인 도구 모음입니다. 회원가입도 업로드도 없이 브라우저에서 바로 쓰세요.",
  "homeLabel": "홈",
  "homeMarker": "도구",
  "keepEnglish": [],
  // Defaults kept on purpose (GLOSSARY §6.2–6.3): Korean words are space-separated 어절 and adults read
  // ~200 어절/분, so the word unit stays (no wordSegmentation, no character unit); ko-KR Intl output
  // (1,234.5 · 2026년 9월 29일 화요일) is already native, so no commaDecimal; Seoul → New York.
  "runtime": {
    "textNumberInputs": true,
    "readingRate": 200,
    "longDates": true,
    "timeZones": {
      "from": "Asia/Seoul",
      "to": "America/New_York"
    }
  }
};

// Korean particles depend on the previous syllable, so no 은/는/이/가/을/를 follows a placeholder.
export const page = {
  "faqHow": "{name}, 어떻게 사용하나요?",
  "privacyQuestion": "입력한 데이터가 서버로 전송되나요?",
  "privacyAnswer": "아니요. 모든 처리는 브라우저에서 이루어지며 데이터는 업로드되지 않습니다.",
  // Rendered as the FAQ section H2 under the “자주 묻는 질문” eyebrow.
  "about": "{title}에 대해 궁금한 점",
  "madeSimple": "쉽고 빠른 {title}",
  "categoryTool": "{category} 도구",
  "workspace": "{title} 작업 영역",
};

// ko-KR has a single plural category ("other").
export const templates = {
  "reading.minutes": "{count}분",
  "summary": "단어 수: {words}\n글자 수(공백 포함): {characters}\n글자 수(공백 제외): {noSpaces}\n줄 수: {lines}\n읽는 시간: 약 {reading}분",
  "dedupe.kept": {"other": "중복을 제거하고 줄 {count}개를 남겼습니다."},
  "percent.of": "{base}의 {percent}% = {result}",
  "percent.share": "{whole} 중 {part}의 비율 = {result}%",
  "percent.change": "{from} → {to} 증감률 = {change}%",
  "rows.converted": {"other": "행 {count}개를 변환했습니다."},
  "uuid.generated": {"other": "브라우저에서 UUID {count}개를 생성했습니다."},
  "regex.matches": {"other": "일치 항목 {count}개를 찾았습니다."},
  "duration.exact": "{days}일 {hours}시간 {minutes}분 {seconds}초",
  "diff.found": {"other": "서로 다른 줄 {count}개를 찾았습니다."},
  "diff.line": "{line}번째 줄:",
  "diff.empty": "(빈 줄)",
  "date.days": {"other": "{count}일"},
  "url.none": "(없음)",
  "timestamp.local": "현지 시간: {value}",
  "timestamp.seconds": "초: {value}",
  "timestamp.milliseconds": "밀리초: {value}",
};

export const ui = {
  "UsefulVerse home": "UsefulVerse 홈",
  "Main navigation": "주 메뉴",
  "Tools": "도구",
  "How it works": "사용 방법",
  "Find a tool": "도구 찾기",
  "Language": "언어",
  "A useful place on the internet": "인터넷 속 쓸모 있는 공간",
  // Home H1, split by <br>: reads as one headline “사소한 일은 더 빠르게.”
  "Do the small things": "사소한 일은",
  "faster.": "더 빠르게.",
  "Simple browser tools for text, data and everyday work. No account. No upload. Just open a tool and get it done.": "텍스트, 데이터, 일상 업무를 위한 간단한 브라우저 도구입니다. 회원가입도 업로드도 필요 없습니다. 도구를 열고 바로 끝내세요.",
  "Explore tools": "도구 둘러보기",
  "UsefulVerse principles": "UsefulVerse의 원칙",
  "Fast by default": "빠른 속도는 기본",
  "Private by design": "개인정보 보호 중심 설계",
  "Free to use": "무료로 사용",
  "The toolbox": "도구 모음",
  "Find the right tool.": "필요한 도구를 찾아보세요.",
  "Search tools": "도구 검색",
  "Tool categories": "도구 카테고리",
  "All": "전체",
  // Categories: filter chips and the “{category} 도구” eyebrow (개발 도구, 생활 도구, 보안 도구…).
  "Writing": "글쓰기",
  "Text": "텍스트",
  "Developer": "개발",
  "SEO": "SEO",
  "Everyday": "생활",
  "Privacy": "보안",
  "Data": "데이터",
  "Design": "디자인",
  "Open tool": "도구 열기",
  "No tools match that search yet. Try another word.": "검색 결과가 없습니다. 다른 단어로 검색해 보세요.",
  "Why UsefulVerse": "UsefulVerse를 쓰는 이유",
  // H2, split by <br>: “작은 도구. 명쾌한 답.”
  "Small tools.": "작은 도구.",
  "Clear answers.": "명쾌한 답.",
  "Open a tool": "도구 열기",
  "Each tool has one clear job. You can start in seconds.": "도구마다 하는 일은 하나입니다. 몇 초면 바로 시작할 수 있습니다.",
  "Work privately": "안심하고 작업",
  "Your text stays in your browser for browser-first tools.": "브라우저 기반 도구에서는 입력한 텍스트가 브라우저 밖으로 나가지 않습니다.",
  "Take the result": "결과 활용",
  "Copy it or use it where you need it next.": "복사해서 필요한 곳에 바로 쓰세요.",
  "Simple tools that respect your time and your files.": "시간은 아끼고 파일은 지키는 간단한 도구.",
  "All tools": "전체 도구",
  "Privacy first": "개인정보 보호 우선",
  "Breadcrumb": "현재 위치",
  "Runs in your browser. No upload.": "브라우저에서 실행되며 아무것도 업로드하지 않습니다.",
  "Clear": "지우기",
  "About this tool": "도구 소개",
  "Common questions": "자주 묻는 질문",
  "Keep going": "계속 둘러보기",
  "More useful tools": "다른 유용한 도구",
  "Browse all tools": "전체 도구 보기",
  "Result": "결과",
  "Copy result": "결과 복사",
  // Shared label: prime checker and number-to-words input, plus the percent tool's hidden “whole” label.
  "Whole number": "정수",
  // Shared: percent change (기준 100 → 125), time-zone card heading and unit converter; “To” = 변환 (tools-c).
  "From": "기준",
  "Minimum": "최솟값",
  "Maximum": "최댓값",
};

export const runtimeMessages = {
  "There is nothing to copy yet.": "복사할 내용이 없습니다.",
  "Copied to your clipboard.": "클립보드에 복사했습니다.",
  "Copy was blocked. Select the result and copy it manually.": "복사가 차단되었습니다. 결과를 직접 선택해 복사하세요.",
  "Choose a valid date and time.": "올바른 날짜와 시각을 선택하세요.",
  // Shared by the binary converter and number-to-words (app.js), so it must fit both tools.
  "Number converted locally.": "브라우저에서 숫자를 변환했습니다.",
};

// Page-specific wording where a shared key means something else on that tool (see src/template.mjs).
export const toolUi = {
  "percentage-calculator": {"Whole number": "전체 값"},
};

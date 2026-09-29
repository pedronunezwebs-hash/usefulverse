# UsefulVerse · Korean (ko-KR) glossary, style guide and keyword research

Owner: research role. Every agent writing `src/locales/ko/*` follows this file. One decision
per item; if something here conflicts with the tool's real behavior (`src/app.js`,
`toolMarkup` in `src/template.mjs`), the behavior wins. Tell the research owner so this
file can be fixed.

Research date: 2026-09-29. Method: Google/Bing SERPs for Korean queries, the page titles and
H1s of the Korean tool sites that rank for them (사람인, 잡코리아-style counters, Toolify,
devcomma, CalcHub, 핀즈, k-calc, calculkorea, PiliApp…), 국립국어원 온라인가나다 and the
Korean orthography rules. Naver matters as much as Google in Korea (the site is verified in
Naver Search Advisor). Naver and Google both ignore spacing differences in queries
(`글자수 세기` = `글자 수 세기`), so we write correct spacing in prose and use the dominant
spelling in titles and the `keywords` field.

---

## 1. Style guide

### 1.1 Register and tone
- **All sentences use 합니다체**: descriptions, intros, explainer bodies, FAQ answers,
  helper text and status messages. Examples: `브라우저에서 바로 계산합니다.`,
  `클립보드에 복사했습니다.`
- **Instructions use the polite imperative `-세요`** (the standard in Korean UIs, not the
  stiff `-십시오`, not `-해 주세요`): `텍스트를 붙여 넣으세요.`, `올바른 날짜를 선택하세요.`
- **FAQ questions use the polite interrogative** `-나요? / -인가요? / -가요?`, phrased like
  a real search query: `1은 소수인가요?`, `서머타임도 반영되나요?`
- No pronouns for the user: never `당신`, `귀하`, `고객님`. Use no subject, or `내 기기`,
  `내 브라우저` only when it adds clarity.
- Completion status = active past (`…했습니다`), not passive (`…되었습니다`), except where
  the subject is clearly external (`복사가 차단되었습니다.`).
- Tone: calm, precise, helpful, like Toss/Naver utility copy. No hype, no exclamation
  marks, no emoji, no `꿀팁`, no `초간단`.

### 1.2 Labels and buttons
- Labels and buttons are **noun phrases, no sentence ending, no period**:
  `결과 복사`, `지우기`, `변환`, `계산`, `비밀번호 생성`, `JSON 정렬`, `PNG 다운로드`.
- Object + action noun (`날짜 계산`, `QR코드 생성`). Use `-하기` only where the verb has
  no noun form (`지우기`) or it is the established UI word (`붙여넣기`).
- Section headings in the workspace: short nouns (`시작`, `종료`, `결과`, `차이점`).

### 1.3 Punctuation and typography
- Western punctuation, half-width: `.` `,` `?` `:` `()`. Never full-width `。` `，`.
- Status messages and sentences end with `.`; labels, buttons, H1s, titles and
  placeholders never end with a period.
- Parentheses attach to the preceding word with no space: `글자 수(공백 포함)`.
- Middle dot `·` (U+00B7) joins paired terms in titles and labels: `인코딩·디코딩`,
  `HEX·RGB·HSL`, `공백 포함·제외`. No spaces around it.
- Title separator inside `seo.title`: ` - ` (space, ASCII hyphen, space).
- Quotes: curly `‘…’` to reference a UI label or a term (`‘공백 제외’ 옵션을 켜세요`),
  curly `“…”` for quoted text. Never straight `'`/`"` in visible copy (they also need no
  escaping inside the JS double-quoted strings).
- Range: `~` with no spaces: `8~64자`, `1~100개`, `1~3,999`.
- Arrow for direction only in helper text/templates: `A → B`.

### 1.4 Placeholders and ellipsis
- Input placeholders are instructions in `-세요` with **no ellipsis and no period**:
  `Start typing or paste your text here...` → `여기에 텍스트를 입력하거나 붙여 넣으세요`.
- Output placeholders describe the result: `Result...` → `결과가 여기에 표시됩니다`.
- Ellipsis `…` (U+2026, never `...`) only for truncated examples:
  `One million two hundred...` → `백이십삼만 사천…`.
- Code/data examples (`name,age…`, `[{"name":"Ada"}]`, `#4D6BFF…`, `MMXXVI`, `1234567`)
  stay as they are, except where the source example is wrong: the color example uses the HSL the tool
  itself returns for #4D6BFF, `hsl(230,100%,65%)` (the English `hsl(231,100%,67%)` is a different color).

### 1.5 Spacing (띄어쓰기) and spelling
- Follow 한글 맞춤법. One-word compounds: `줄바꿈`, `띄어쓰기`, `대소문자`, `비밀번호`,
  `특수 문자` (two words), `글자 수` (two words in prose), `단어 수`, `줄 수`.
- Fixed product names keep the dominant search spelling even where prose spacing differs:
  `글자수 세기` (tool name), `QR코드` (전문 용어 붙여 쓰기, 한글 맞춤법 제50항, and the
  dominant form, e.g. government `QR코드`).
- Numbers + counters/units attach: `10분`, `16자`, `3개`, `5일`, `100%`, `25℃`
  (한글 맞춤법 제43항 다만).
- 사이시옷 standard forms: `최솟값`, `최댓값`. Avoid `결괏값` (write `결과`).
- Loanwords per 외래어 표기법: 텍스트, 타임스탬프, 인코딩, 디코딩, 포맷터, 파서, 슬러그,
  해시, 토큰, 헤더, 페이로드, 프로토콜, 호스트, 쿼리, 파라미터, 플래그, 패턴, 브라우저,
  클립보드, 다운로드, 업로드, 콘텐츠 (not 컨텐츠), 메시지 (not 메세지), 스프레드시트,
  데이터베이스, 유니코드, 에포크, 서머타임, 인치, 피트, 야드, 마일, 파운드, 온스, 갤런,
  쿼트, 켈빈, 호찌민, 콜카타, 로스앤젤레스.

### 1.6 Particles after placeholders (critical)
Korean particles change with the final sound of the previous word (은/는, 이/가, 을/를,
와/과, 으로/로). A `{count}`, `{name}`, `{title}`, `{value}` can end in either sound, so:
- **Never attach 은/는, 이/가, 을/를, 와/과, (으)로 directly to a placeholder.**
- Allowed directly after a placeholder: `의`, `에서`, `부터`, `까지`, `도`, `만`, counters
  (`{count}개`, `{count}일`, `{count}분`), or restructure (`쉽고 빠른 {title}`).
- Do not use the `은(는)` / `을(를)` fallback style; restructure instead.

### 1.7 Numbers, dates and times
- Arabic numerals, comma thousands separator, period decimal: `1,234.5` (same as
  `Intl.NumberFormat('ko-KR')`).
- In prose write big round limits with Korean units: `1조` (1,000,000,000,000),
  `약 42억 9천만` only if needed; exact ranges may stay in digits.
- Dates: long `2026년 9월 29일 화요일` (this is what `Intl` `ko-KR` `dateStyle: 'full'`
  prints; keep `meta.runtime.longDates: true`). Short numeric form `2026. 9. 29.` (with the
  spaces and final period). ISO `2026-09-29` only in developer contexts.
- Times: `오후 3:05` style in copy. Runtime times come from `Intl` `ko-KR` (newer ICU/CLDR 48,
  e.g. Node 24, prints `PM 3:05`); tests must not depend on the day-period word. Korea Standard Time = `한국 표준시
  (KST, UTC+9)`; Korea has **no daylight saving time**.
- Currency: `원`. The amount form is `일금 …원정` (§6.1); no `₩` figure is printed.

### 1.8 Product, brand and technical names
- `UsefulVerse` always in Latin letters; never transliterate. It takes `를`/`는` (read
  유즈풀버스): `UsefulVerse를 쓰는 이유`.
- Keep in Latin: JSON, CSV, Base64, URL, UUID, SHA-256, JWT, HEX, RGB, HSL, HTML, UTF-8,
  PNG, Unix, UTC, KST, Web Crypto API, JavaScript, BigInt.
- Write `SHA-256` (with hyphen) in visible copy; `sha256` only in `keywords`.
- English terms: if Korean users have a normal Korean word, use it (`정규식`, `진법`,
  `줄바꿈`). If developers really say the loanword, use the loanword (`인코딩`, `페이로드`,
  `파라미터`). Add the English term in parentheses **once**, in the explainer body only,
  when people also search it (e.g. `정규 표현식(regex)`). Never parenthesize English in
  labels or buttons.
- Common misnomers Koreans search (`SHA256 암호화`, `JWT 복호화`, `로마자 숫자`,
  `base64 암호화`) go **only in `keywords`**; the copy states the correct concept.

### 1.9 Plurals and counters
- `Intl.PluralRules('ko-KR')` has only the `other` category. Plural templates must be
  `{"other": "…"}` only; a `one` key fails the pack test.
- Counters: items `개`, lines `줄`, CSV/spreadsheet rows `행`, columns `열`, characters
  `자`, days `일`, hours `시간`, minutes `분`, seconds `초`, milliseconds `밀리초`.

---

## 2. Terminology (use exactly these)

| English | Korean | Notes |
|---|---|---|
| tool | 도구 | Not 툴 in copy (툴 allowed in `keywords`). |
| tools (nav) | 도구 | |
| all tools | 전체 도구 | |
| browser | 브라우저 | |
| in your browser / locally | 브라우저에서 | Default rendering of "locally". |
| locally (developer copy) | 로컬에서 | Only in developer tool bodies if needed. |
| device | 기기 | |
| server | 서버 | |
| upload / no upload | 업로드 / 업로드 없이 | |
| account / no account | 회원가입 / 회원가입 없이 | Koreans say 회원가입, not 계정 생성. |
| free | 무료 | |
| privacy / private | 개인정보 보호 | "Private by design" → 처음부터 개인정보 보호. |
| secure | 안전한 | |
| copy (button) | 복사 | |
| copy result | 결과 복사 | |
| copied | 복사했습니다 | Status: 클립보드에 복사했습니다. |
| clipboard | 클립보드 | |
| clear | 지우기 | |
| paste (noun / verb) | 붙여넣기 / 붙여 넣다 | Verb in sentences: 붙여 넣으세요. |
| type / enter | 입력하다 | 입력하세요. |
| input | 입력 | |
| output / result | 결과 | Prefer 결과 over 출력. |
| convert / converter | 변환 / 변환기 | |
| calculate / calculator | 계산 / 계산기 | |
| generate / generator | 생성 / 생성기 | QR: 생성 (만들기 only in keywords/prose). |
| encode / decode | 인코딩 / 디코딩 | Encoder/decoder in names → 인코딩·디코딩. |
| format (JSON) | 정렬 | Button "Format JSON" → JSON 정렬. |
| formatter | 포맷터 | |
| minify | 압축 | "한 줄로 압축" in prose. |
| validate / validation | 검증 / 유효성 검사 | 검증 in labels, 유효성 검사 in SEO copy. |
| valid / invalid | 올바른 / 올바르지 않은 | Errors: 올바른 …을 입력하세요. |
| text | 텍스트 | |
| line | 줄 | Not 행/라인 for text lines. |
| line break | 줄바꿈 | 엔터 only in keywords/prose aside. |
| empty line | 빈 줄 | |
| row / column (CSV) | 행 / 열 | |
| character (counting) | 글자 | 글자 수. |
| character (technical) | 문자 | 문자 종류, 특수 문자, 유니코드 문자. |
| special characters / symbols | 특수 문자 | Password "Symbols" → 특수 문자. |
| word | 단어 | Counted by spaces (= 어절). |
| space / whitespace | 공백 | |
| with / without spaces | 공백 포함 / 공백 제외 | |
| uppercase / lowercase | 대문자 / 소문자 | |
| ignore case | 대소문자 무시 | |
| trim spaces | 앞뒤 공백 제거 | |
| duplicate / unique | 중복 / 고유한 | |
| list | 목록 | |
| number | 숫자 | 수 in math phrases (소수, 정수). |
| whole number / integer | 정수 | |
| decimal number | 소수점이 있는 수 | Avoid bare 소수 (collides with prime). |
| prime number | 소수 | Only in the prime tool, defined once. |
| minimum / maximum | 최솟값 / 최댓값 | |
| average / sum / count | 평균 / 합계 / 개수 | |
| ratio / proportion | 비율 / 비례식 | |
| percent / percentage change | 퍼센트(%) / 증감률 | |
| date / start date / end date | 날짜 / 시작일 / 종료일 | |
| time (clock) / duration | 시각 / 경과 시간 | 시간 for amounts of time. |
| time zone | 시간대 | 타임존 in keywords only. |
| daylight saving time | 서머타임 | |
| local time | 현지 시간 | |
| day / hour / minute / second / ms | 일 / 시간 / 분 / 초 / 밀리초 | |
| timestamp / Unix time / epoch | 타임스탬프 / 유닉스 시간 / 에포크 | |
| password / strong / good | 비밀번호 / 강함 / 양호 | Not 패스워드/암호 in copy. |
| random | 랜덤 | 무작위 only inside explanatory sentences; 난수 = random number (technical). |
| hash / one-way | 해시 / 단방향 | |
| encrypt / encryption | 암호화 | Only to say hashing/decoding is NOT encryption. |
| checksum | 체크섬 | |
| regular expression | 정규식 (UI) / 정규 표현식 (formal) | |
| pattern / flags / match | 패턴 / 플래그 / 일치 항목 | |
| token / header / payload / signature | 토큰 / 헤더 / 페이로드 / 서명 | |
| verify | 검증 | |
| link | 링크 | |
| protocol / host / path / query | 프로토콜 / 호스트 / 경로 / 쿼리 | |
| query parameters | 쿼리 파라미터 | Dev reality; not 매개변수. |
| hash (URL fragment) | 해시(#) | |
| slug | 슬러그 | |
| color / preview | 색상 / 미리보기 | |
| number base | 진법 | 2진수, 8진수, 10진수, 16진수. |
| Roman numeral | 로마 숫자 | |
| unit / length / weight / volume / temperature | 단위 / 길이 / 무게 / 부피 / 온도 | |
| QR code | QR코드 | |
| download | 다운로드 | |
| size | 크기 | |
| example / e.g. | 예시 / 예: | |
| option | 옵션 | |
| search | 검색 | |
| category | 카테고리 | |
| home | 홈 | |
| language | 언어 | |
| FAQ / common questions | 자주 묻는 질문 | |
| about this tool | 도구 소개 | |
| difference / compare | 차이 / 비교 | |
| original / changed | 원본 / 수정본 | |
| none / empty | 없음 / 빈 줄 | Templates `(없음)`, `(빈 줄)`. |
| from / to (converters) | 기준 / 변환 | Lowercase "to" in percent change → `→`. |

### 2.1 Categories
Writing → 글쓰기 · Text → 텍스트 · Developer → 개발 · SEO → SEO · Everyday → 생활 ·
Privacy → 보안 · Data → 데이터 · Design → 디자인. `categoryTool` gives `개발 도구`,
`생활 도구`, `보안 도구`.

### 2.2 Units (unit converter runtime labels)
Meters 미터(m) · Kilometers 킬로미터(km) · Centimeters 센티미터(cm) · Millimeters
밀리미터(mm) · Inches 인치(in) · Feet 피트(ft) · Yards 야드(yd) · Miles 마일(mi) ·
Kilograms 킬로그램(kg) · Grams 그램(g) · Milligrams 밀리그램(mg) · Pounds 파운드(lb) ·
Ounces 온스(oz) · Liters 리터(L) · Milliliters 밀리리터(mL) · US gallons 미국 갤런 ·
US quarts 미국 쿼트 · US cups 미국 컵 · Celsius ℃(섭씨) · Fahrenheit ℉(화씨) ·
Kelvin K(켈빈). Temperature labels put the symbol first because app.js prints
`${value} ${label}` (212 ℉(화씨), never 212 화씨); the same labels fill the unit menus.

### 2.3 Time-zone option labels
UTC → UTC · New York (Eastern) → 뉴욕(미국 동부) · Chicago (Central) → 시카고(미국 중부) ·
Denver (Mountain) → 덴버(미국 산악) · Los Angeles (Pacific) → 로스앤젤레스(미국 서부) ·
London → 런던 · Madrid → 마드리드 · India (Kolkata) → 인도(콜카타) · Jakarta → 자카르타 ·
Ho Chi Minh City → 호찌민 · Seoul → 서울 · Tokyo → 도쿄 · Sydney → 시드니.
**`Seoul`, `Jakarta` and `India (Kolkata)` are missing from the generated ko key lists;
the tools-c owner must add them to `ui` in `tools-c.mjs`** (extra keys are allowed;
`locales.mjs` says packs translate them in their own `ui`). Same for the runtime
placeholder **`Base64 to decode...` → `디코딩할 Base64를 붙여 넣으세요`**, which the
tools-a owner adds to `ui` in `tools-a.mjs` (app.js translates it at runtime; the build
check cannot see it).

---

## 3. Page, template and home strings (core owner)

### 3.1 `meta`
- `name` (language switcher): **`한국어`**
- `homeTitle` (40 chars): **`무료 온라인 도구 모음 - 텍스트·개발·계산기 | UsefulVerse`** (hub intent `무료 온라인 도구 모음`;
  brand last like tool pages; no tool head terms, so the home page does not compete with 글자수 세기/QR코드 pages)
- `homeDescription` (78 chars): **`글자수 세기, JSON 정렬, 퍼센트 계산기, QR코드 생성기 등 33가지 무료 온라인 도구 모음입니다. 회원가입도 업로드도 없이 브라우저에서 바로 쓰세요.`**
  (update 33가지 if the catalog changes)
- `homeLabel` 홈 · `homeMarker` 도구
- `runtime`: keep `readingRate: 200` with the default word unit (do **not** set
  `readingUnit: 'characters'` or `wordSegmentation`); see §6.2. Keep `textNumberInputs`,
  `longDates`, and `timeZones { from: 'Asia/Seoul', to: 'America/New_York' }`.

### 3.2 `page` (particle-safe)
- `faqHow`: `{name}, 어떻게 사용하나요?` (fallback only; every tool has its own FAQ)
- `privacyQuestion`: `입력한 데이터가 서버로 전송되나요?`
- `privacyAnswer`: `아니요. 모든 처리는 브라우저 안에서 이루어지며 데이터는 업로드되지 않습니다.`
- `about`: `{title}에 대해 궁금한 점` (it is the FAQ H2 under the `자주 묻는 질문` eyebrow)
- `madeSimple`: `쉽고 빠른 {title}` (renders as an H2 with the H1 title, so H1s must be
  clean noun phrases; see §5)
- `categoryTool`: `{category} 도구`
- `workspace`: `{title} 작업 영역`

### 3.3 `templates`
- `reading.minutes`: `{count}분`
- `summary`: `단어 수: {words}\n글자 수(공백 포함): {characters}\n글자 수(공백 제외): {noSpaces}\n줄 수: {lines}\n읽는 시간: 약 {reading}분`
- `dedupe.kept`: `{"other": "중복을 제거하고 {count}개 줄을 남겼습니다."}`
- `percent.of`: `{base}의 {percent}% = {result}`
- `percent.share`: `{whole} 중 {part}의 비율 = {result}%`
- `percent.change`: `{from} → {to} 증감률 = {change}%`
- `rows.converted`: `{"other": "{count}개 행을 변환했습니다."}`
- `uuid.generated`: `{"other": "브라우저에서 UUID {count}개를 생성했습니다."}`
- `regex.matches`: `{"other": "일치 항목 {count}개를 찾았습니다."}`
- `duration.exact`: `{days}일 {hours}시간 {minutes}분 {seconds}초`
- `diff.found`: `{"other": "서로 다른 줄 {count}개를 찾았습니다."}`
- `diff.line`: `{line}번째 줄:`
- `diff.empty`: `(빈 줄)`
- `date.days`: `{"other": "{count}일"}`
- `url.none`: `(없음)`
- `timestamp.local`: `현지 시간: {value}` · `timestamp.seconds`: `초: {value}` ·
  `timestamp.milliseconds`: `밀리초: {value}`

### 3.4 Home and shared UI (tone reference)
| Key | Korean |
|---|---|
| UsefulVerse home | UsefulVerse 홈 |
| Main navigation | 주 메뉴 |
| How it works | 사용 방법 |
| Find a tool | 도구 찾기 |
| A useful place on the internet | 인터넷 속 쓸모 있는 공간 |
| Do the small things / faster. | 사소한 일은 / 더 빠르게. |
| Simple browser tools … get it done. | 텍스트, 데이터, 일상 업무를 위한 간단한 브라우저 도구입니다. 회원가입도 업로드도 필요 없습니다. 도구를 열고 바로 끝내세요. |
| Explore tools | 도구 둘러보기 |
| UsefulVerse principles | UsefulVerse의 원칙 |
| Fast by default / Private by design / Free to use | 빠른 속도는 기본 / 개인정보 보호 중심 설계 / 무료로 사용 |
| The toolbox / Find the right tool. | 도구 모음 / 필요한 도구를 찾아보세요. |
| Search tools / Tool categories / All | 도구 검색 / 도구 카테고리 / 전체 |
| Open tool | 도구 열기 |
| No tools match that search yet. Try another word. | 검색 결과가 없습니다. 다른 단어로 검색해 보세요. |
| Why UsefulVerse | UsefulVerse를 쓰는 이유 |
| Small tools. / Clear answers. | 작은 도구. / 명확한 답. |
| Open a tool / Each tool has one clear job… | 도구 열기 / 도구마다 할 일은 하나뿐입니다. 몇 초 만에 시작할 수 있습니다. |
| Work privately / Your text stays… | 안전하게 작업 / 브라우저 기반 도구에서는 입력한 텍스트가 브라우저 밖으로 나가지 않습니다. |
| Take the result / Copy it or use it… | 결과 가져가기 / 복사해서 필요한 곳에 바로 쓰세요. |
| Simple tools that respect your time and your files. | 시간과 파일을 존중하는 간단한 도구. |
| Privacy first | 개인정보 보호 우선 |
| Breadcrumb | 현재 위치 |
| Runs in your browser. No upload. | 브라우저에서 실행되며 업로드하지 않습니다. |
| About this tool / Common questions | 도구 소개 / 자주 묻는 질문 |
| Keep going / More useful tools / Browse all tools | 계속 둘러보기 / 다른 유용한 도구 / 전체 도구 보기 |
| Result / Copy result / Whole number | 결과 / 결과 복사 / 정수 (shared key; also the sr-only label of the percent “whole” field, acceptable) |
| From / To | 기준 / 변환 (shared by unit converter, time-zone cards and percent change: `기준 [100] → [125]`) |
| Minimum / Maximum | 최솟값 / 최댓값 |
| There is nothing to copy yet. | 복사할 내용이 없습니다. |
| Copied to your clipboard. | 클립보드에 복사했습니다. |
| Copy was blocked. Select the result and copy it manually. | 복사가 차단되었습니다. 결과를 직접 선택해 복사하세요. |
| Choose a valid date and time. | 올바른 날짜와 시각을 선택하세요. |
| Number converted locally. | 브라우저에서 숫자를 변환했습니다. (shared by binary-converter and number-to-words, so it stays neutral; the amount line is explained in the number-to-words copy and FAQ) |

---

## 4. SEO field rules for Korean
- `seo.title`: the text before ` | UsefulVerse`. **≤ 28 characters**, lead with the
  primary keyword, then ` - ` and 2–3 variants joined with `·`. Use the exact strings in
  §5 (all verified: 17–26 chars, total 31–40, unique).
- `seo.description`: 60–110 characters, 합니다체, one or two sentences: benefit + the
  concrete thing it does + `무료`/`회원가입 없이`/`업로드 없이`/`브라우저에서` where natural.
  Include the primary keyword once and one variant. No keyword lists.
- `copy[id][0]` H1: the exact H1 in §5 (clean noun phrase, no dash, because it is reused in
  `쉽고 빠른 {title}` and `{title} 작업 영역`).
- `copy[id][1]` short title: exact value in §5 (used in `{name} 사용 방법은 무엇인가요?`).
- `copy[id][2]` description: one sentence, 합니다체, ≤ ~70 chars.
- `copy[id][3]` keywords: the list in §5, comma+space separated, primary first. Include
  spacing variants, loanword/English variants and common misnomers.
- `copy[id][4]` intro: 1–2 sentences, how to use (`…을 붙여 넣으면 바로 …합니다.`).
- `copy[id][5]` body: 2–3 sentences, ≤ 350 chars, Korean use cases from §5.
- `faq[id]`: exactly 3: (1) how to use, (2) the tool-specific question from §5 (a second
  real question is also listed; use it inside answers or bodies), (3) privacy/free/limits.
  Answers must match the real behavior noted in §5.

---

## 5. Per-tool keyword research and decisions

Format: **primary** · variants · H1 · short title · `seo.title` · intent/local use ·
honesty limits · 2 real questions. "Weak demand" flags say what people type instead.

### Group A

**word-counter** — primary `글자수 세기` (very high; 자소서/과제/블로그)
- Variants: 글자 수 세기, 글자수세기, 글자수 계산기, 공백 포함 글자수, 공백 제외 글자수, 자소서 글자수, 단어 수 세기
- keywords: `글자수 세기, 글자 수 세기, 글자수세기, 글자수 계산기, 공백 포함 글자수, 공백 제외 글자수, 자소서 글자수, 자기소개서 글자수, 단어 수 세기, 문자 수 세기, word counter`
- H1 `글자수 세기` · short `글자수 세기` · seo.title `글자수 세기 - 공백 포함·제외 글자 수 계산`
- Intent: Korean users need **공백 포함 and 공백 제외** separately (자기소개서 문항별 제한,
  대학 과제, 블로그, 인스타그램 캡션). UI mapping: `Characters` → `공백 포함`,
  `Without spaces` → `공백 제외`, `Words` → `단어 수`, `Lines` → `줄 수`,
  `Reading time` → `읽는 시간`, `Copy summary` → `요약 복사`.
- Honesty: counts UTF-16 characters; a line break counts as 1 character in 공백 포함 and is
  excluded in 공백 제외. **No byte count** (many Korean counters show 바이트; do not claim
  it). Words = space-separated (어절). Reading time ≈ 200 words per minute (§6.2).
- Questions: `자기소개서 글자 수는 공백 포함인가요?` (answer: depends on the company's
  form; most portals state it; this tool shows both) · `줄바꿈(엔터)도 글자 수에 들어가나요?`

**text-case-converter** — primary `대소문자 변환`
- keywords: `대소문자 변환, 대소문자 변환기, 영어 대문자 변환, 영어 소문자 변환, 대문자 소문자 바꾸기, 첫 글자 대문자, 영문 대소문자, case converter`
- H1 `영어 대소문자 변환기` · short `대소문자 변환기` · seo.title `영어 대소문자 변환기 - 대문자·소문자 바꾸기`
- UI: UPPERCASE `대문자` · lowercase `소문자` · Sentence case `문장 첫 글자 대문자` ·
  Title Case `단어 첫 글자 대문자`.
- Intent: English résumé/영문 이메일/영문 제목, product names, CAPS LOCK accidents.
- Honesty: only Latin (and other cased scripts) letters change; **Hangul has no case and
  stays as is** — say "영어 텍스트용".
- Questions: `한글도 대소문자 변환이 되나요?` · `영어 제목의 첫 글자만 대문자로 바꾸려면?`

**remove-duplicate-lines** — primary `중복 제거`
- keywords: `중복 제거, 중복 줄 제거, 텍스트 중복 제거, 중복 제거 사이트, 중복 행 삭제, 목록 중복 제거, 키워드 중복 제거, 엑셀 중복 제거`
- H1 `중복 줄 제거` · short `중복 줄 제거` · seo.title `중복 줄 제거 - 텍스트 목록 중복 제거`
- UI: Trim spaces `앞뒤 공백 제거` · Ignore case `대소문자 무시` · Remove empty lines
  `빈 줄 제거` · Remove duplicates `중복 제거`.
- Intent: many `중복 제거` searches are Excel how-tos; position the tool as "엑셀 열이나 목록을
  복사해 붙여 넣으면 첫 등장 순서를 유지한 채 중복 줄을 지웁니다" (키워드 목록, 이메일 목록,
  URL, 상품 코드).
- Questions: `엑셀 데이터의 중복도 지울 수 있나요?` (yes, paste one column; one item per
  line) · `대소문자나 띄어쓰기만 다른 중복도 지워지나요?` (with the options)

**json-formatter** — primary `JSON 정렬` / `JSON 포맷터`
- keywords: `json 정렬, json 포맷터, json formatter, json 유효성 검사, json 검사기, json 검증, json 압축, json minify, json pretty print, json 들여쓰기`
- H1 `JSON 포맷터·검증기` · short `JSON 포맷터` · seo.title `JSON 포맷터 - JSON 정렬·유효성 검사`
- UI: Format JSON `JSON 정렬` · Minify `압축`.
- Honesty: error message is generic (no line/column position); say it tells whether the
  JSON is valid, not where the error is.
- Questions: `JSON 유효성 검사는 어떻게 하나요?` · `JSON을 한 줄로 압축할 수 있나요?`

**base64-encoder-decoder** — primary `Base64 인코딩` / `Base64 디코딩`
- keywords: `base64 인코딩, base64 디코딩, base64 디코더, base64 변환, base64 encode, base64 decode, 베이스64, base64 한글, base64 암호화`
- H1 `Base64 인코딩·디코딩` · short `Base64 변환기` · seo.title `Base64 인코딩·디코딩 변환기`
- UI: Encode to Base64 `Base64로 인코딩` · Decode Base64 `Base64 디코딩`.
- Honesty: **text only** (UTF-8, so 한글 works); no files or images. Base64 is encoding,
  not encryption.
- Questions: `Base64로 한글도 인코딩되나요?` · `Base64는 암호화인가요?`

**url-encoder-decoder** — primary `URL 인코딩` / `URL 디코딩`
- keywords: `url 인코딩, url 디코딩, url 디코더, url 인코더, 한글 url 변환, url 한글 깨짐, 퍼센트 인코딩, urlencode, urldecode`
- H1 `URL 인코딩·디코딩` · short `URL 인코딩 변환기` · seo.title `URL 인코딩·디코딩 - 한글 URL 변환`
- Intent (strong local angle): turning `%EC%95%88%EB%85%95` back into readable 한글, and
  encoding 한글/공백/`&` for query strings, UTM links and APIs.
- Honesty: uses `encodeURIComponent`/`decodeURIComponent` (component encoding), so paste only the
  parameter value. Input placeholder `서울 맛집 & 카페` (a value, never a full URL, which would get `:`, `/`, `?` encoded).
- Questions: `URL의 %EC%95%88 같은 문자를 한글로 바꾸려면?` · `URL 인코딩은 언제 필요한가요?`

**text-to-slug** — primary `슬러그 생성기` (**weak demand**; people type `고유주소`,
`퍼머링크`, `워드프레스 슬러그`, `영문 URL 만들기`)
- keywords: `슬러그 생성기, url 슬러그, slug 생성, 고유주소, 퍼머링크, permalink, 워드프레스 슬러그, 영문 url 만들기, seo url`
- H1 `URL 슬러그 생성기` · short `슬러그 생성기` · seo.title `URL 슬러그 생성기 - 고유주소(퍼머링크) 만들기`
- UI: Keep numbers `숫자 유지` · Keep non-Latin letters `한글 등 비라틴 문자 유지` ·
  Create slug `슬러그 생성` · Copy slug `슬러그 복사`.
- Honesty: **does not romanize Hangul**. With the non-Latin option off, a Korean title
  produces an empty slug. `runtime.js` turns the option on by default for /ko/ (§6.4).
  Message `Type a title first.` → `제목을 입력하세요. 한글 제목은 ‘한글 등 비라틴 문자 유지’를 켜야 합니다.`
- Questions: `슬러그에 한글을 써도 되나요?` (yes, Google/Naver index Hangul URLs, but links
  shared elsewhere show as %-encoded text; short English slugs are tidier) ·
  `좋은 URL 슬러그는 어떻게 만드나요?`

**percentage-calculator** — primary `퍼센트 계산기` (high)
- keywords: `퍼센트 계산기, 퍼센트 계산, 백분율 계산기, 백분율 계산, 증감률 계산기, 할인율 계산, 퍼센트 구하는 법, 몇 퍼센트, 퍼센트 계산 공식`
- H1 `퍼센트 계산기` · short `퍼센트 계산기` · seo.title `퍼센트 계산기 - 백분율·증감률·할인율`
- UI (field order is fixed: `[15] % of [200]`, `[30] of [200]`, `From [100] to [125]`):
  `What is a percentage of a number?` → `어떤 수의 몇 %는 얼마일까요?` ·
  `What percent is one number of another?` → `한 수는 다른 수의 몇 %일까요?` ·
  `What is the percentage change?` → `증감률은 몇 %일까요?` · Percent `퍼센트` ·
  `% of` → `% ×` (reads `15 % × 200`) · `of` → `÷` (reads `30 ÷ 200`) · lowercase `to` →
  `→` · Part `부분 값` · Base number `기준 수` · New number `새 값` · Calculate `계산` ·
  Copy answers `결과 복사`. (`From` and `Whole number` are shared keys: see §3.4.)
- Intent: 할인가/할인율 (쇼핑), 연봉 인상률, 매출 증감률, 시험 점수 비율, 부가세 10%.
- Honesty: three modes only (X% of Y, A is what % of B, change A → B). Discount rate =
  use the change mode (정가 → 판매가 gives a negative %).
- Questions: `할인율은 어떻게 계산하나요?` · `증감률 공식은 무엇인가요?`
  ((새 값 − 기존 값) ÷ 기존 값 × 100)

**password-generator** — primary `비밀번호 생성기`
- keywords: `비밀번호 생성기, 랜덤 비밀번호, 비밀번호 만들기, 비밀번호 자동 생성, 패스워드 생성기, 안전한 비밀번호, 강력한 비밀번호, 비밀번호 조합, 암호 생성기, 랜덤 암호` (`암호` is a common word for password; without it the home search for 암호 finds only Base64/SHA-256)
- H1 `랜덤 비밀번호 생성기` · short `비밀번호 생성기` · seo.title `비밀번호 생성기 - 강력한 랜덤 비밀번호`
- UI: Length: `길이:` · Uppercase `영문 대문자` · Lowercase `영문 소문자` · Numbers `숫자` ·
  Symbols `특수 문자` · Exclude similar characters `헷갈리는 문자 제외` (no character list: app.js character sets never contain I, l, 1, O, 0, so the box changes nothing) ·
  Strong `강함` · Good `양호`.
- Local angle: Korean sites typically require `영문·숫자·특수 문자 조합 8~16자`. True
  behavior: length 8~64; **at least one character from each selected type is guaranteed**;
  symbols are `!@#$%^&*()-_=+[]{}:,.?/`. Advice: set 16 or less for sites with a 16자 limit;
  if a site rejects a symbol, generate again or turn off 특수 문자. Web Crypto API.
- Questions: `안전한 비밀번호는 몇 자리가 좋나요?` · `특수 문자가 안 되는 사이트는 어떻게 하나요?`

**timestamp-converter** — primary `타임스탬프 변환`
- keywords: `타임스탬프 변환, 유닉스 타임스탬프, unix timestamp 변환, 유닉스 시간 변환, epoch 변환, 에포크 시간, 타임스탬프 날짜 변환, 밀리초 타임스탬프`
- H1 `유닉스 타임스탬프 변환기` · short `타임스탬프 변환기` · seo.title `유닉스 타임스탬프 변환기 - 날짜 변환`
- Local angle: result shows UTC and 현지 시간; on a device set to Korea that is KST
  (UTC+9, no DST). 10자리 = 초, 13자리 = 밀리초.
- Questions: `유닉스 타임스탬프를 한국 시간으로 바꾸려면?` · `13자리 타임스탬프는 무엇인가요?`

**html-entity-encoder-decoder** — primary `HTML 특수문자 변환` (moderate; people search
`html 특수문자 코드`, `html 이스케이프`)
- keywords: `html 특수문자 변환, html 엔티티, html 엔티티 변환, html 이스케이프, html escape, html 특수문자 코드, html 인코딩, html 디코딩, &lt; &gt; 변환`
- H1 `HTML 특수문자·엔티티 변환기` · short `HTML 엔티티 변환기` · seo.title `HTML 특수문자 변환 - 엔티티 인코딩·디코딩`
- Honesty: encode escapes exactly `& < > " '`; decode handles named and numeric entities
  (browser parser). Hangul is not converted to entities.
- Questions: `HTML에서 < > 기호를 그대로 보여 주려면?` · `&nbsp; 같은 엔티티를 원래 문자로 바꾸려면?`

### Group B

**csv-to-json** — primary `CSV JSON 변환`
- keywords: `csv json 변환, csv to json, csv를 json으로, csv json 변환기, 엑셀 json 변환, csv 파싱, csv 변환`
- H1 `CSV JSON 변환기` · short `CSV JSON 변환기` · seo.title `CSV JSON 변환 - CSV를 JSON으로`
- Honesty: **comma-delimited text only**; paste the text (no file upload). Cells copied
  straight from Excel are tab-separated and will not split — save as `CSV(쉼표로 분리)`
  and paste the file's text. First row = keys. Quoted commas/line breaks handled.
- Questions: `엑셀 파일을 JSON으로 바꿀 수 있나요?` · `CSV 첫 줄이 JSON 키가 되나요?`

**json-to-csv** — primary `JSON CSV 변환` (low–moderate demand)
- keywords: `json csv 변환, json to csv, json을 csv로, json 엑셀 변환, json csv 변환기, json 배열 csv`
- H1 `JSON CSV 변환기` · short `JSON CSV 변환기` · seo.title `JSON CSV 변환 - JSON을 CSV로`
- Honesty: input must be an **array of objects**; nested values become JSON text in the
  cell; output is text to copy (**no file download**). Tip for Excel: save the copied text
  as a `.csv` file.
- Questions: `JSON을 엑셀에서 열 수 있게 바꾸려면?` · `중첩된 JSON은 어떻게 변환되나요?`

**random-number-generator** — primary `랜덤 숫자 생성기` / `난수 생성기`
- keywords: `랜덤 숫자 생성기, 랜덤 숫자, 난수 생성기, 숫자 뽑기, 랜덤 번호 뽑기, 무작위 숫자, 번호 추첨기, random number`
- H1 `랜덤 숫자 생성기` · short `랜덤 숫자 생성기` · seo.title `랜덤 숫자 생성기 - 숫자 뽑기·난수 생성`
- UI: Whole number only `정수만` · Generate number `숫자 생성`.
- Weak-fit flag: Korean `번호 추첨`/`로또` searches expect several numbers without
  repeats. **This tool returns one number per click** (integer range < 4.29 billion, or a
  decimal). Say "한 번에 하나씩"; never claim 중복 없는 여러 개/로또 번호/발표 순서 정하기
  (a full order needs several numbers without repeats). Use one-number examples: 발표자 한 명, 당첨 번호, 주사위 대신.
- Questions: `1부터 100까지 랜덤 숫자를 뽑으려면?` · `소수점이 있는 난수도 만들 수 있나요?`

**uuid-generator** — primary `UUID 생성기` (developer niche)
- keywords: `uuid 생성기, uuid 생성, uuid v4, uuid v4 생성기, guid 생성기, 랜덤 uuid, uuid generator`
- H1 `UUID 생성기` · short `UUID 생성기` · seo.title `UUID 생성기 - UUID v4 랜덤 생성`
- UI: How many? `몇 개 생성할까요?` · Generate UUIDs `UUID 생성` · Copy UUIDs `UUID 복사`.
- Honesty: v4 only, 1~100 at once, lowercase hyphenated, Web Crypto API.
- Questions: `UUID v4가 중복될 수도 있나요?` · `UUID를 한 번에 여러 개 만들 수 있나요?`

**sha256-hash-generator** — primary `SHA256 해시` (people also type `sha256 암호화`)
- keywords: `sha256, sha256 해시, sha-256 해시 생성기, sha256 변환, sha256 암호화, 해시 생성기, 해시값 생성, 체크섬`
- H1 `SHA-256 해시 생성기` · short `SHA-256 해시 생성기` · seo.title `SHA-256 해시 생성기 - SHA256 변환`
- Honesty: text input only (UTF-8), hex digest; **one-way hash, not encryption, cannot be
  "복호화"d**. No files.
- Questions: `SHA-256은 암호화인가요? 복호화할 수 있나요?` · `같은 텍스트는 항상 같은 해시가 나오나요?`

**regex-tester** — primary `정규식 테스트`
- keywords: `정규식 테스트, 정규식 테스터, 정규표현식 테스트, 정규 표현식, 정규식 검사, regex 테스트, regex tester, 자바스크립트 정규식`
- H1 `정규식 테스터` · short `정규식 테스터` · seo.title `정규식 테스트 - 정규 표현식 테스터`
- Local angle: examples Korean devs need: 한글만 `[가-힣]+`, 휴대폰 번호
  `01[016789]-?\d{3,4}-?\d{4}`, 이메일. Never use 주민등록번호 examples.
- Honesty: JavaScript `RegExp` syntax; `g` is always added; shows up to 1,000 matches
  (full match text only, no groups).
- Questions: `정규식으로 한글만 찾으려면?` · `정규식 플래그 g, i, m은 무엇인가요?`

**jwt-decoder** — primary `JWT 디코더` (developer niche; people also type `JWT 복호화`)
- keywords: `jwt 디코더, jwt 디코딩, jwt decode, jwt 토큰 확인, jwt 복호화, json web token, jwt 파싱`
- H1 `JWT 디코더` · short `JWT 디코더` · seo.title `JWT 디코더 - 토큰 헤더·페이로드 확인`
- Honesty: decodes header and payload only; **does not verify the signature** and does not
  decrypt (JWE not supported). Warn against pasting live tokens on shared devices.
- Questions: `JWT를 디코딩하면 서명도 검증되나요?` · `JWT 만료 시간(exp)은 어떻게 확인하나요?`
  (exp is a Unix timestamp in seconds; convert with the timestamp tool)

**color-converter** — primary `색상 코드 변환`
- keywords: `색상 코드 변환, 색상 변환기, 컬러 코드 변환, hex rgb 변환, rgb hex 변환, hsl 변환, 헥스 코드, 색상 코드`
- H1 `색상 코드 변환기` · short `색상 코드 변환기` · seo.title `색상 코드 변환기 - HEX·RGB·HSL`
- Honesty: HEX, RGB, HSL only (no CMYK, no picker from image).
- Questions: `HEX 색상 코드를 RGB로 바꾸려면?` · `HSL 값은 무엇을 뜻하나요?`

**url-parser** — primary `URL 파서` (**weak demand**; people type `쿼리스트링 분석`,
`UTM 파라미터 확인`, `URL 구조`)
- keywords: `url 파서, url 분석, url 파싱, 쿼리스트링 분석, 쿼리 파라미터 확인, utm 파라미터 확인, url 구조, query string`
- H1 `URL 파서·쿼리 분석기` · short `URL 파서` · seo.title `URL 파서 - 쿼리 파라미터·UTM 분석`
- UI: Protocol `프로토콜` · Host `호스트` · Path `경로` · Query `쿼리` · Hash `해시(#)` ·
  Query parameters `쿼리 파라미터`.
- Honesty: needs a full URL with `https://`.
- Questions: `링크의 UTM 파라미터를 확인하려면?` · `쿼리스트링이란 무엇인가요?`

**roman-numeral-converter** — primary `로마 숫자 변환` (moderate; school/시계/책 목차)
- keywords: `로마 숫자 변환, 로마 숫자 변환기, 로마숫자, 로마 숫자 읽는 법, 아라비아 숫자 로마 숫자, 로마자 숫자, roman numeral`
- H1 `로마 숫자 변환기` · short `로마 숫자 변환기` · seo.title `로마 숫자 변환기 - 아라비아 숫자 변환`
- Honesty: 1~3,999 only, both directions.
- Questions: `로마 숫자로 4는 IV인가요, IIII인가요?` · `3,999보다 큰 수도 로마 숫자로 쓸 수 있나요?`

**binary-converter** — primary `진법 변환` (high among students/devs)
- keywords: `진법 변환, 진법 변환기, 진수 변환, 2진수 변환, 10진수 2진수 변환, 16진수 변환, 8진수 변환, 2진법 계산기, binary converter`
- H1 `진법 변환기` · short `진법 변환기` · seo.title `진법 변환기 - 2진수·10진수·16진수`
- UI: From base `기준 진법` · To base `변환 진법` · Decimal (10) `10진수` ·
  Binary (2) `2진수` · Hexadecimal (16) `16진수` · Octal (8) `8진수`.
- Honesty: integers only (BigInt, any size), no fractional part. **Negative numbers only when the
  source base is 10** (-255 → -11111111); app.js builds `BigInt('-0x…')`, which throws for bases 2, 8, 16.
- Questions: `10진수를 2진수로 바꾸는 방법은?` · `소수점이 있는 수도 변환되나요?`

### Group C

**prime-number-checker** — primary `소수 판별`
- keywords: `소수 판별, 소수 판별기, 소수 확인, 소수 계산기, 소수인지 확인, 소수 찾기, prime number`
- H1 `소수 판별기` · short `소수 판별기` · seo.title `소수 판별기 - 소수인지 바로 확인`
- Ambiguity: 소수 also means decimal; define in intro/body: `1과 자기 자신으로만
  나누어떨어지는 2 이상의 자연수`. Results: `소수입니다` / `소수가 아닙니다`.
- Honesty: 0~1조 (1,000,000,000,000); yes/no only (no factor list).
- Questions: `1은 소수인가요?` · `큰 수도 소수인지 확인할 수 있나요?`

**average-calculator** — primary `평균 계산기`
- keywords: `평균 계산기, 평균 구하기, 평균 계산, 점수 평균, 산술 평균, 평균값 계산, 합계 계산`
- H1 `평균 계산기` · short `평균 계산기` · seo.title `평균 계산기 - 합계·최솟값·최댓값까지`
- Honesty: arithmetic mean + 합계, 개수, 최솟값, 최댓값; separators: spaces, commas, new
  lines. **Not** 가중 평균 or 학점(GPA) — Korean users often search `학점 계산기`; do not
  claim it. GPA wording: `‘과목 평점 × 학점’의 합 ÷ 총 이수 학점` (terms on a 성적표), not `성적`.
- Questions: `시험 점수 평균은 어떻게 구하나요?` · `학점처럼 가중 평균도 계산되나요?`

**ratio-proportion-calculator** — primary `비례식 계산기` / `비율 계산기`
- keywords: `비례식 계산기, 비율 계산기, 비례식 풀기, 비례식 계산, 비율 계산, a:b=c:x, 비율 약분, 비례 배분`
- H1 `비례식·비율 계산기` · short `비례식 계산기` · seo.title `비례식 계산기 - 비율 계산·약분`
- UI: Solve proportion `비례식 풀기` · Missing value X `구하는 값 X` · Simplified A:B
  `약분한 A:B`.
- Honesty: A:B = C:X with three positive numbers; simplification only when A and B are
  integers. (비례 배분 in keywords only if body explains using A:B = C:X.) Drop `비례 배분`
  if the writer cannot explain it honestly.
- Questions: `비례식 A:B = C:X에서 X는 어떻게 구하나요?` (X = B × C ÷ A) ·
  `비율을 가장 간단한 정수비로 줄일 수 있나요?`

**time-duration-calculator** — primary `시간 계산기`
- keywords: `시간 계산기, 시간 차이 계산, 경과 시간 계산, 시간 간격 계산, 근무 시간 계산, 몇 시간 계산, 날짜 시간 차이`
- H1 `시간 계산기` · short `시간 계산기` · seo.title `시간 계산기 - 시간 차이·경과 시간 계산`
- UI: Start `시작` · End `종료` · Date and time `날짜와 시각` · Total days `총 일수` ·
  Total hours `총 시간` · Exact duration `정확한 경과 시간`.
- Weak-fit flag: `근무시간 계산기` users expect 휴게 시간 차감/시급 — not supported; say the
  tool gives the gross interval. Night shifts across midnight work (pick the next date).
- Questions: `두 시각 사이가 몇 시간인지 계산하려면?` · `자정을 넘기는 야간 근무 시간도 계산되나요?`

**number-to-words-converter** — primary `숫자 한글 변환` (high; contracts, receipts)
- keywords: `숫자 한글 변환, 금액 한글 변환, 숫자 한글로, 금액 한글 표기, 한글 금액, 일금 원정, 계약서 금액 한글, 숫자 읽기, 숫자 한글 변환기`
- H1 `숫자 한글 변환기` · short `숫자 한글 변환기` · seo.title `숫자 한글 변환기 - 금액 한글 표기`
- Output is **Korean (한글), not English** (the English copy's "English words" must not be
  translated literally). UI: Convert to words `한글로 변환` · Written number `한글 표기` ·
  placeholder `백이십삼만 사천…`.
- Behavior spec in §6.1 (reading line + contract amount line).
- Honesty: range -999,999,999,999 ~ 999,999,999,999 (`9999억 9999만 9999`), digits and
  commas only (not `100만`, not `원`).
- Error `Use a whole number between -999,999,999,999 and 999,999,999,999.` →
  `-999,999,999,999부터 999,999,999,999까지의 정수를 숫자로만 입력하세요(쉼표 가능).`
- Questions: `계약서 금액은 한글로 어떻게 쓰나요?` · `10000은 ‘만’인가요, ‘일만’인가요?`

**remove-line-breaks** — primary `줄바꿈 제거`
- keywords: `줄바꿈 제거, 줄바꿈 없애기, 엔터 제거, 줄 바꿈 삭제, 개행 제거, pdf 줄바꿈 제거, 문단 합치기, 엔터 없애기`
- H1 `줄바꿈 제거` · short `줄바꿈 제거` · seo.title `줄바꿈 제거 - 엔터 없애고 문장 합치기`
- UI: Join with spaces `공백으로 합치기` · Remove breaks `줄바꿈만 삭제`.
- Local angle: PDF·논문·한글(HWP) 문서에서 복사한 글. **For Korean text recommend
  `공백으로 합치기`** (lines usually break between 어절; `줄바꿈만 삭제` glues words).
- Honesty: removes **all** line breaks including paragraph breaks, and collapses repeated
  spaces/tabs to one.
- Questions: `PDF에서 복사한 글의 줄바꿈을 없애려면?` · `문단 구분은 남길 수 있나요?` (no)

**text-diff-checker** — primary `텍스트 비교`
- keywords: `텍스트 비교, 문서 비교, 글자 비교, 텍스트 차이, 문장 비교, 코드 비교, diff, diff checker`
- H1 `텍스트 비교` · short `텍스트 비교` · seo.title `텍스트 비교 - 두 글의 차이 확인`
- UI: Original text `원본` · Changed text `수정본` · Compare text `비교` · Differences `차이점`.
- Honesty: compares **line by line at the same line number**; no word/character
  highlighting; an inserted line shifts the following lines and they show as different.
- Questions: `두 문서에서 달라진 부분을 찾으려면?` · `글자 단위로도 비교되나요?`

**unit-converter** — primary `단위 변환기`
- keywords: `단위 변환기, 단위 환산, 단위 계산기, 인치 cm 변환, 피트 미터 변환, 파운드 kg 변환, 온스 g 변환, 화씨 섭씨 변환, 갤런 리터 변환`
- H1 `단위 변환기` · short `단위 변환기` · seo.title `단위 변환기 - 길이·무게·부피·온도`
- Local angle: Koreans convert US units (인치, 피트, 파운드, 온스, 갤런, 화씨) for 해외 직구,
  옷·신발 사이즈, 요리 레시피, 여행.
- Weak-fit flag: `평수 계산기` (평↔㎡), 근, 돈 and area are **not** supported. Never claim.
  Write `평이나 ㎡ 같은 면적 단위`, never `평(㎡)` (on this page a parenthesis is a unit symbol; 1평 ≈ 3.3058㎡).
- Questions: `1인치는 몇 cm인가요?` (2.54cm) · `화씨를 섭씨로 바꾸는 공식은?` (℃ = (℉ − 32) × 5/9)

**date-calculator** — primary `날짜 계산기` / `디데이 계산기`
- keywords: `날짜 계산기, 디데이 계산기, d-day 계산, 날짜 차이 계산, 일수 계산, 날짜 더하기, 며칠 남았는지, 기념일 계산, 100일 계산`
- H1 `날짜 계산기` · short `날짜 계산기` · seo.title `날짜 계산기 - 디데이·일수 계산`
- UI: Days between dates `두 날짜 사이 일수` · Starting date `기준 날짜` · Days to add
  `더할 일수` · hint `빼려면 음수를 입력하세요` · Calculate difference `일수 계산` ·
  Calculate date `날짜 계산`.
- Local angle and honesty: difference = plain day difference (end − start, start day not
  counted). Korean 기념일 counting (사귄 날 = 1일) means **100일 = start date + 99일**; say so
  explicitly. D-day: pick today as the start date (no auto "today"). Result date shows the
  weekday (`2026년 12월 25일 금요일`).
- Questions: `오늘부터 100일 후는 며칠인가요?` · `디데이는 어떻게 계산하나요?`

**qr-code-generator** — primary `QR코드 만들기` / `QR코드 생성` (very high)
- keywords: `qr코드 만들기, qr코드 생성, qr코드 생성기, qr 코드, 큐알코드 만들기, 무료 qr코드, url qr코드, qr코드 만드는 법`
- H1 `QR코드 생성기` · short `QR코드 생성기` · seo.title `QR코드 생성기 - 무료 QR코드 만들기`
- UI: Link or short text `링크 또는 짧은 텍스트` · Size `크기` · Generate QR code
  `QR코드 생성` · Download PNG `PNG 다운로드`.
- Honesty: up to 106 UTF-8 bytes (영문·숫자 약 100자, **한글 약 35자**); black and white PNG
  256/384/512px; no logo, no colors, no scan statistics. It is a static code: it never
  expires because the content is stored in the code itself.
- Questions: `QR코드에 유효기간이 있나요?` · `QR코드에 한글도 넣을 수 있나요?`

**time-zone-converter** — primary `시차 계산기`
- keywords: `시차 계산기, 세계 시간 변환, 시간대 변환, 한국 미국 시차, 한국 시간 변환, 뉴욕 시차, 런던 시차, 타임존 변환`
- H1 `시차 계산기` · short `시차 계산기` · seo.title `시차 계산기 - 세계 시간 변환`
- Local angle: default 서울 → 뉴욕. Seoul is UTC+9 all year (no DST); 서울–뉴욕 = 14시간
  (뉴욕 서머타임 기간에는 13시간). Use cases: 해외 미팅, 직구 배송, 해외 주식 장 시간, 스포츠 중계.
- Honesty: only the 13 listed zones.
- Questions: `한국과 미국 시차는 몇 시간인가요?` · `서머타임도 반영되나요?`

---

## 6. Market adaptations for runtime.js and meta.runtime

### 6.1 Number to words (`window.usefulverseLocale.numberToWords`)
Sources: 한글 맞춤법 제44항 (수는 ‘만’ 단위로 띄어 쓴다; 해설: 금액은 변조 방지를 위해
붙여 쓰는 것이 관례, e.g. `일금: 삼십일만오천육백칠십팔원정`); 공문서 금액 표기
`금113,560원(금일십일만삼천오백육십원)` (행정업무운영 편람, cited by 국립국어원); 국립국어원:
`만/일만`, `천/일천` both correct, `만`/`천` usual in speech; `영`/`공` synonyms.

Output (textarea, `\n` between lines):
1. **Reading line** (always): Sino-Korean numerals, spaces between 만-groups, no `일` before
   십/백/천 and none before a 만-group equal to 1 (`만`, not `일만`); `일` always before 억.
   Zero = `영`. Negative = `마이너스 ` + reading. No `원`.
2. **Amount line** (only when value > 0): `일금 ` + digits with `일` before every unit
   (일십, 일백, 일천, 일만), **no spaces** + `원정`. No `(₩…)` suffix: `packs.test.mjs` forbids
   digits in the hook output. The status message stays neutral (§3.4); the copy and FAQ explain
   the second line.

Reference implementation (verified with the vectors below):
```js
window.usefulverseLocale.numberToWords = (value) => {
  const D = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  const U = ['', '십', '백', '천'];
  const G = ['', '만', '억'];
  const group = (n, formal) => {
    let s = '';
    for (let p = 3; p >= 0; p -= 1) { const d = Math.floor(n / 10 ** p) % 10; if (d) s += (d === 1 && p && !formal ? '' : D[d]) + U[p]; }
    return s;
  };
  if (value === 0n) return '영';
  const negative = value < 0n; const abs = negative ? -value : value;
  const read = []; const formal = [];
  for (let i = 0, rest = abs; rest; i += 1, rest /= 10000n) {
    const g = Number(rest % 10000n); if (!g) continue;
    read.unshift(i === 1 && g === 1 ? '만' : group(g, false) + G[i]);
    formal.unshift(group(g, true) + G[i]);
  }
  const reading = `${negative ? '마이너스 ' : ''}${read.join(' ')}`;
  return negative ? reading : `${reading}\n일금 ${formal.join('')}원정`;
};
```
Test vectors (implemented in `number-words.test.mjs`; runtime templates in `runtime.test.mjs`):
| input | output |
|---|---|
| 0 | `영` |
| 1 | `일\n일금 일원정` |
| 10 | `십\n일금 일십원정` |
| 1000 | `천\n일금 일천원정` |
| 1001 | `천일\n일금 일천일원정` |
| 10000 | `만\n일금 일만원정` |
| 12345 | `만 이천삼백사십오\n일금 일만이천삼백사십오원정` |
| 113560 | `십일만 삼천오백육십\n일금 일십일만삼천오백육십원정` |
| 1234567 | `백이십삼만 사천오백육십칠\n일금 일백이십삼만사천오백육십칠원정` |
| 30000000 | `삼천만\n일금 삼천만원정` |
| 100000000 | `일억\n일금 일억원정` |
| 100010000 | `일억 만\n일금 일억일만원정` |
| 999999999999 | `구천구백구십구억 구천구백구십구만 구천구백구십구\n일금 구천구백구십구억구천구백구십구만구천구백구십구원정` |
| -5000 | `마이너스 오천` |
| -999999999999 | `마이너스 구천구백구십구억 구천구백구십구만 구천구백구십구` |

Note: `runtime.js` is evaluated by the test harness in a `vm` context with `window: {}`
only (no `document`), so it must not touch `document` without a `typeof document` guard.

### 6.2 Reading speed (`meta.runtime`)
Keep the default word unit with `readingRate: 200`. Korean words are space-separated
어절; measured silent reading speed of Korean adults = **202.3 ± 88.4 어절/분** (송지호 외,
「한국어 읽기 속도 측정 애플리케이션의 유효성 및 정상인의 읽기 속도에 대한 사전 연구」,
대한안과학회지 57(4), 2016; test sentences 6.5 어절 / 18.9 음절 ≈ 590 음절/분, matching
the commonly cited 500~600자/분). The word unit also stays correct for English text pasted
on /ko/ pages; a character unit would double English estimates. Do not enable
`wordSegmentation` (Korean does not need it and `Intl.Segmenter` would split particles).

### 6.3 Number, date and time formats
- `ko-KR` `Intl` output is already native (`1,234.5`, `2026년 9월 29일 화요일`,
  `2026. 9. 29. 오후 3:05:00`); `commaDecimal` must stay off.
- Time zone defaults Seoul → New York are right for Korea; no change.

### 6.4 Slug tool default (recommended for runtime.js)
On /ko/ the slug tool's ‘한글 등 비라틴 문자 유지’ (`#preserve-language`) should start
checked, otherwise every Korean title yields an empty slug. Minimal, harness-safe hook:
```js
if (typeof document !== 'undefined' && document.querySelector) {
  const keepHangul = () => { const box = document.querySelector('#preserve-language'); if (box) box.checked = true; };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', keepHangul); else keepHangul();
}
```
If the engineer skips it, the slug intro must tell users to turn the option on, and the
`Type a title first.` message in §5 covers the empty result.

### 6.5 Word counter conventions
Korean counters label `공백 포함` / `공백 제외`; map `Characters`/`Without spaces` to those.
Line breaks count as characters in 공백 포함 (value.length). No byte count exists; do not
add it to copy.

---

## 7. Sources
- 한글 맞춤법 제44항 and 해설 (금액 붙여 쓰기 관례): https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=73&qna_seq=312302 · https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&qna_seq=328065
- 공문서 금액 표기 `금113,560원(금일십일만삼천오백육십원)`: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=311012 · https://www.korea.kr/news/cultureColumnView.do?newsId=148902755
- 만/일만, 천/일천 (국립국어원 답변 via search) and 영/공: https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mn_id=&mcfaq_seq=8082
- Amount converters (output format `일금 일백이십삼만 사천오백원정`): https://k-calc.org/number-to-korean/ · https://tooltada.com/num-korean/ · https://utilbox.io.kr/tools/number-to-korean
- Korean reading speed: https://www.jkos.org/upload/pdf/JKOS057-04-17.pdf
- Word counters (공백 포함/제외): https://www.saramin.co.kr/zf_user/tools/character-counter · https://toolify.kr/tools/text-counter/ · https://textcount.sawoo.com/
- Tool naming SERPs: 대소문자 변환 (https://tools.devcomma.com/tools/uppercase-converter), 중복 제거 (https://www.texturb.com/tools/dedupe-lines/), JSON 포맷터 (https://www.site24x7.com/ko/tools/json-formatter.html), 퍼센트 계산기 (https://finz.co.kr/percent), 비밀번호 생성기 (https://www.avast.com/ko-kr/random-password-generator), 타임스탬프 (https://time.is/ko/Unix%20time%20converter), HTML 특수문자 (https://www.site24x7.com/ko/tools/html-encoder.html), 디데이/날짜 계산기 (https://www.calchub.kr/life/date-diff), 시차 계산기 (https://tools.devcomma.com/calculators/timezone-converter), 줄바꿈 제거 (https://www.i2text.com/ko/remove-line-breaks), 텍스트 비교 (https://www.textcompare.org/ko/), 진법 변환기 (https://calculkorea.com/base-converter), 소수 판별 (https://tools.devcomma.com/tools/prime-checker), 로마 숫자 (https://calculkorea.com/roman-numeral), 단위 변환기 (https://www.jptcalc.kr/calc/tools/unit-converter/), 시간 계산기 (https://toolify.kr/tools/time-calculator/), 비례식 계산기 (https://finz.co.kr/proportional), 랜덤 숫자 (https://kr.piliapp.com/random/number/), 색상 코드 변환 (https://kutils.com/utils/color-converter/), 정규식 테스터 (https://gotool.io/ko/tools/regex/), JWT 디코더 (https://bfotool.com/ko/jwt-decoder), CSV JSON (https://www.site24x7.com/ko/tools/csv-to-json.html), SHA256 (https://bfotool.com/ko/sha256-hash-generator), UUID (https://bfotool.com/ko/uuid-generator), 평균 계산기 (https://tools.devcomma.com/calculators/average), 슬러그 (https://seo.tbwakorea.com/blog/what-is-slug/), QR코드 (https://ko.qr-code-generator.com/).

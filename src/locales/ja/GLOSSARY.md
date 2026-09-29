# UsefulVerse · Japanese (ja-JP) glossary, keyword research and style guide

Owner: research role. Every agent writing `src/locales/ja/*` follows this file. Where this file
gives a ready value (title, label, template), use it verbatim unless it breaks a build rule; if it
does, keep the meaning and the primary keyword and report the change.

Research basis (Sept 2026): Google Japan autocomplete (`hl=ja&gl=jp`) for every tool, SERP titles
of the leading Japanese tool sites (ラッコツールズ/ラッコキーワード, アサリツールズ, 計算サイト,
高精度計算サイト, LUFT, sundryst, PEKO STEP, TAG index, difff, CMAN, 時差計算ドットコム, DataEgg,
HJ Tools, benricho …), plus primary sources for 大字, 漢数字, QR trademark and reading speed.
Sources are listed at the end.

---

## 1. Style guide

### 1.1 Register and tone
- Sentences: です・ます調, plain and friendly-professional. Short sentences. No 「！」, no emoji, no
  hype (最強, 神ツール). No over-polite forms (〜させていただきます, ご利用いただけます → 使えます).
- Never write 「あなた」/「あなたの」. Omit the subject; when needed use 「お使いのブラウザ」
  「お使いの端末」.
- Say what the tool actually does. Never promise features listed as "not supported" below.

### 1.2 UI text forms
| Kind | Form | Examples |
|---|---|---|
| Button with an object in English | 目的語＋を＋動作名詞 (no する) | 結果をコピー, パスワードを生成, テキストを比較, QRコードを作成 |
| Button with a bare verb | 動作名詞 only | 変換, 計算, クリア, 圧縮 |
| Field label / heading / metric | noun phrase, no 。 | 文字数, 生成する件数, 変換元 |
| Tool-card question headings | short question with full-width ？ | 増減率は何%？ |
| Status: success | 〜しました。 | 変換しました。 / クリップボードにコピーしました。 |
| Status: idle hint | 〜します。/〜できます。 | 入力するとすぐにカウントが更新されます。 |
| Status: error | 〜してください。 (say how to fix) | 有効な数値を入力してください。 |
| Placeholder (instruction) | ends with a single 「…」 (U+2026) | ここにテキストを貼り付け… |
| Placeholder (literal Latin example) | prefix 「例：」, no trailing … | 例：How to Write a Great Blog Post |
| FAQ question | natural question ending with 「？」 | 1は素数ですか？ / 〜するには？ |
| FAQ answer | first word answers it (はい。/いいえ。 when yes/no), 1–3 sentences | いいえ。処理はすべてブラウザ内で行います。 |

The 「例：」 prefix is also how an English-only example (slug, regex text, color value) stays
honest in Japanese without tripping `check-build` (a value identical to the English source is
flagged). Do not add example strings to `meta.keepEnglish`; keep it `[]`.

### 1.3 Punctuation, spacing, quotes
- Full-width in Japanese text: 、 。 （ ） 「 」 『 』 ： ？ ・ 〜 (wave dash U+301C for ranges:
  1〜3,999). Arrow → for direction (UNIX時間 → 日時).
- Half-width: all digits, Latin letters, code, % (15%), = in formulas, : in ratios/times (16:9,
  21:00), - for negative numbers (-30).
- No space between Japanese and Latin/digits: JSON整形, UUIDを5件, 16文字, 384px, 約237mL.
  Keep normal spaces inside Latin phrases: UUID v4, JSON Web Token, Web Crypto API.
- Formula-style result templates keep spaces around 「=」: `{base}の{percent}% = {result}`.
- UI names referenced inside sentences go in 「」: 「結果をコピー」を押します。
- Adverbs in kana: たとえば (not 例えば). Formulas in prose use full-width parentheses: （℉−32）×5/9.
- Middle dot ・ joins parallel nouns: HEX・RGB・HSL, 空白・改行.
- Never use full-width alphanumerics (ＡＢＣ１２３) or half-width katakana in copy.

### 1.4 Numbers, dates, units
- Digits half-width, thousands separator 「,」 from 4 digits in prose (1,000 / 3,999 / 1,000,000),
  except years (2026年). Decimal point 「.」 (ja-JP Intl output already does this).
- In prose, large round numbers use 万/億/兆: 1兆, 約42億. Exact limits may be written in digits
  with a kanji gloss: -999,999,999,999〜999,999,999,999（1兆未満）.
- Dates in prose: 2026年9月29日（火）. Times 24-hour: 21:00. Runtime dates come from
  `Intl` with `ja-JP` (e.g. 2026年10月29日木曜日) — do not fight it.
- Unit symbols half-width, no space: px, cm, kg, mL, L, ℃, ℉. Liquid: use mL/L (JIS/計量法 style).
- Counters: 〜文字, 〜行, 〜件, 〜個, 〜日, 〜時間, 〜分, 〜秒, 〜桁 (digits of a number/password).

### 1.5 Product, brand and tech names
- Brand: 「UsefulVerse」 always in Latin, never katakana.
- Keep official casing: JSON, CSV, Base64, URL, UUID, GUID, SHA-256, JWT, HEX, RGB, HSL, CMYK, PNG,
  UTF-8, Shift_JIS, JavaScript, CSS, HTML, Excel, WordPress, Google, X（旧Twitter）, Web (Webデザイン).
- 「UNIX時間」 (caps UNIX) for Unix time; 「QRコード」 always Latin QR + katakana コード.
- Established kanji terms beat loanwords: 整形 (JSON format), 圧縮 (minify), 生成, 変換, 削除,
  判定, 比較, 換算. Loanwords stay where Japanese developers use them: エンコード, デコード,
  エスケープ, ハッシュ, トークン, ペイロード, フラグ, パターン, クエリ.
- Long-vowel decisions (use exactly these): ブラウザ, サーバー, ユーザー, パラメータ, ヘッダー,
  デコーダー, ジェネレーター, チェッカー, フォーマッター, メーカー, カラー, コンバーター (avoid;
  prefer 変換ツール).

### 1.6 Plurals and templates
Japanese has no plural. `Intl.PluralRules('ja-JP')` has only `other`, so plural templates set `other` only
(a `one` entry fails `packs.test.mjs`).

### 1.7 SEO field rules (restated for ja)
- `seo.title` ≤ 28 characters (JS length), starts with the primary keyword, separator 「｜」
  (full-width vertical bar). Full `<title>` = `${title} | UsefulVerse` (15–65 chars). All 33
  titles in §4 are pre-checked: 18–27 chars, unique.
- `seo.description` 60–110 characters: what it does + one local use case + 無料・登録不要 /
  送信されない where natural. All 33 drafts in §4 are pre-checked (70–88 chars).
- H1 (`copy[0]`): the primary keyword, 5–18 characters, no parentheses — it is reused in the
  template 「{title}をもっと手軽に。」, so a parenthetical H1 reads badly.
- short title (`copy[1]`): the compact name used in 「{name}の使い方は？」.
- card description (`copy[2]`): one sentence ending in 。 (≈ 30–50 chars).
- keywords (`copy[3]`): ", " separated; primary keyword first, then spacing/script variants,
  then the English name last (helps users who type English into the site search).
- intro (`copy[4]`): 1–2 sentences, how to use, names the real button in 「」.
- body (`copy[5]`): 2–3 sentences, ≤ ~200 Japanese characters (≈350 Latin), local use cases.
- FAQ: exactly 3 — (1) how to use, (2) the tool-specific question given below, (3) privacy/free/
  limits angle given below. Answers must match the real behavior described in §4 and §6.

---

## 2. Site-level decisions (core.mjs owner)

- Language switcher name: **日本語** (`meta.name`), tag `ja-JP`.
- `homeTitle`: **登録不要・無料のオンライン便利ツール集 | UsefulVerse** (33 chars; keyword first, the brand has no
  search demand in Japan; same ` | UsefulVerse` suffix as every tool page, no em dash)
- `homeDescription`: **文字数カウント、JSON整形、パスワード生成、QRコード作成など30種類以上の便利ツールを無料で。登録不要で、データはアップロードせずブラウザ内で処理します。** (80 chars)
- `homeLabel` ホーム · `homeMarker` ツール
- `meta.runtime` values already present are correct and research-backed: `readingUnit:
  "characters"`, `readingRate: 500`, `wordSegmentation: true`, `textNumberInputs: true`,
  `longDates: true`, `timeZones {from: "Asia/Tokyo", to: "America/New_York"}` (the top
  autocomplete for 時差 計算 日本 is ニューヨーク).

### 2.1 Page templates
| key | value |
|---|---|
| faqHow | {name}の使い方は？ |
| privacyQuestion | 入力したデータはサーバーに送信されますか？ |
| privacyAnswer | いいえ。処理はすべてブラウザ内で行われ、データがアップロードされることはありません。 |
| about | {title}について |
| madeSimple | {title}をもっと手軽に。 |
| categoryTool | {category}ツール |
| workspace | {title}の作業エリア |

### 2.2 Categories
Writing 文章作成 · Text テキスト · Developer 開発者向け · SEO SEO · Everyday 日常・計算 ·
Privacy セキュリティ (only the password generator; セキュリティ is how Japanese sites group it) ·
Data データ · Design デザイン · All すべて

### 2.3 Key home/shared UI strings
| English | 日本語 |
|---|---|
| UsefulVerse home | UsefulVerseホーム |
| Main navigation | メインナビゲーション |
| Tools | ツール |
| How it works | 使い方 |
| Find a tool | ツールを探す |
| Language | 言語 |
| A useful place on the internet | ネットの、ちょっと便利な場所 |
| Do the small things / faster. | ちょっとした作業を、 / もっと速く。 |
| Simple browser tools for text, data and everyday work. No account. No upload. Just open a tool and get it done. | テキストやデータ、日々の作業に使えるシンプルなブラウザツール。登録不要、アップロード不要。開けばすぐに使えます。 |
| Explore tools | ツールを見る |
| Fast by default / Private by design / Free to use | いつでも高速 / プライバシー重視 / 無料で使える |
| The toolbox / Find the right tool. | ツール一覧 / ぴったりのツールを見つけよう。 |
| Search tools / Tool categories | ツールを検索 / ツールのカテゴリ |
| Open tool | ツールを開く |
| No tools match that search yet. Try another word. | 該当するツールが見つかりません。別のキーワードで検索してください。 |
| Why UsefulVerse / Small tools. / Clear answers. | UsefulVerseが選ばれる理由 / 小さなツールで、 / 明快な答えを。 |
| Open a tool / Each tool has one clear job. You can start in seconds. | ツールを開く / どのツールも役割はひとつ。数秒で使い始められます。 |
| Work privately / Your text stays in your browser for browser-first tools. | プライバシーを守って作業 / ブラウザ完結型のツールでは、テキストはブラウザの外に出ません。 |
| Take the result / Copy it or use it where you need it next. | 結果を活用 / コピーして、次に使う場所へそのまま貼り付けられます。 |
| Simple tools that respect your time and your files. | 時間もファイルも大切にする、シンプルなツール。 |
| All tools / Privacy first / Breadcrumb | すべてのツール / プライバシー優先 / パンくずリスト |
| Runs in your browser. No upload. | ブラウザ内で動作。アップロード不要。 |
| About this tool / Common questions | このツールについて / よくある質問 |
| Keep going / More useful tools / Browse all tools | 次はこちら / ほかの便利ツール / すべてのツールを見る |
| There is nothing to copy yet. | コピーする内容がまだありません。 |
| Copied to your clipboard. | クリップボードにコピーしました。 |
| Copy was blocked. Select the result and copy it manually. | コピーできませんでした。結果を選択して手動でコピーしてください。 |
| Choose a valid date and time. | 正しい日時を選択してください。 |
| Number converted locally. | ブラウザ内で変換しました。 |

### 2.4 Runtime templates (core.mjs `templates`)
| key | value |
|---|---|
| reading.minutes | {count}分 |
| summary | 単語数：{words}\n文字数：{characters}\n文字数（空白・改行を除く）：{noSpaces}\n行数：{lines}\n読了時間：約{reading}分 |
| dedupe.kept | 重複を除いた{count}行を残しました。 (`other` only) |
| percent.of | {base}の{percent}% = {result} |
| percent.share | {part}は{whole}の{result}% |
| percent.change | {from}から{to}への増減率 = {change}% |
| rows.converted | {count}行を変換しました。 |
| uuid.generated | ブラウザ内でUUIDを{count}件生成しました。 |
| regex.matches | {count}件マッチしました。 |
| duration.exact | {days}日{hours}時間{minutes}分{seconds}秒 |
| diff.found | {count}行に違いがあります。 |
| diff.line | {line}行目： |
| diff.empty | （空行） |
| date.days | {count}日 |
| url.none | （なし） |
| timestamp.local | ローカル時刻：{value} |
| timestamp.seconds | 秒：{value} |
| timestamp.milliseconds | ミリ秒：{value} |

---

## 3. Terminology (use these; one choice each)

| English | 日本語 | Notes |
|---|---|---|
| tool | ツール | 「便利ツール」 on home/meta |
| tools (list) | ツール一覧 | |
| converter | 変換ツール | never コンバーター in prose |
| generator | 生成ツール | QR: 作成ツール |
| calculator | 計算ツール | H1 uses keyword (パーセント計算) |
| checker | チェッカー / 判定 | 正規表現チェッカー, 素数判定 |
| browser | ブラウザ | |
| in your browser | ブラウザ内で | 「ブラウザ上で」 only for "runs on" |
| locally | ブラウザ内で | 「ローカルで」 only in developer copy |
| device | 端末 | |
| server | サーバー | |
| upload / no upload | アップロード / アップロード不要 | |
| sent / not sent | 送信 / 送信されません | |
| download | ダウンロード | |
| no account | 登録不要 | not アカウント不要 |
| free | 無料 | |
| private / privacy | プライバシーに配慮 / プライバシー | |
| secure random | 暗号学的に安全な乱数 | short: 安全な乱数 |
| copy | コピー | |
| Copy result | 結果をコピー | |
| copied | コピーしました | |
| clipboard | クリップボード | |
| paste | 貼り付け / 貼り付けます | not ペースト |
| clear | クリア | |
| convert / conversion | 変換 | |
| Conversion complete. | 変換しました。 | |
| result | 結果 | output label: 変換結果 |
| input / output | 入力 / 出力 | prefer 結果 for output labels |
| text | テキスト | prose meaning 「文章」 |
| line | 行 | 3行目 |
| empty line | 空行 | |
| line break | 改行 | |
| character | 文字 | |
| characters (count) | 文字数 | |
| without spaces | 空白・改行を除く | the tool strips all whitespace incl. line breaks |
| space | 空白 (counting) / スペース (joining) | |
| word / words | 単語 / 単語数 | Japanese = estimate |
| reading time | 読了時間 | 「約◯分」 |
| summary | 結果をまとめて | Copy summary → 結果をまとめてコピー |
| generate | 生成 | QRコード → 作成 |
| create | 作成 | |
| encode / decode | エンコード / デコード | |
| escape / unescape | エスケープ / アンエスケープ | |
| format (JSON) | 整形 | |
| minify | 圧縮 | |
| validate / valid JSON | 構文チェック / 正しいJSON | |
| hash / hash value | ハッシュ / ハッシュ値 | |
| token / signature | トークン / 署名 | |
| header / payload | ヘッダー / ペイロード | |
| regular expression | 正規表現 | |
| pattern / flags | パターン / フラグ | |
| match / matches | マッチ / マッチした箇所 | |
| URL components | URLの構成要素 | |
| protocol / host / path | プロトコル / ホスト / パス | |
| query / query parameters | クエリ / クエリパラメータ | |
| hash (URL #) | フラグメント（#） | avoids clash with SHA hash |
| slug | スラッグ | |
| list | リスト | |
| duplicate | 重複 | |
| remove / delete | 削除 | |
| trim spaces | 前後の空白を削除 | |
| ignore case | 大文字・小文字を区別しない | |
| uppercase / lowercase | 大文字 / 小文字 | password: 英大文字 / 英小文字 |
| number (input) | 数値 | everyday prose: 数字 |
| whole number / integer | 整数 | |
| decimal (fraction) | 小数 | |
| negative number | マイナスの数 | |
| minimum / maximum | 最小値 / 最大値 | |
| average / sum / count | 平均値 / 合計 / 個数 | |
| percent / percentage change | パーセント（%） / 増減率 | |
| ratio / proportion | 比 / 比例式 | |
| simplified ratio | 簡単にした比 | 「最も簡単な整数の比」 in prose |
| binary / octal / decimal / hexadecimal | 2進数 / 8進数 / 10進数 / 16進数 | |
| base (numeral) | 進数 / 基数 | labels: 変換元 / 変換先 |
| prime number / not prime | 素数 / 素数ではありません | |
| Roman numeral | ローマ数字 | |
| number in words (ja) | 漢数字 | formal: 大字（壱・弐・参・拾） |
| unit / length / weight / volume / temperature | 単位 / 長さ / 重さ / 体積 / 温度 | |
| From / To (conversion) | 変換元 / 変換先 | shared key, see §7 |
| date / time / date and time | 日付 / 時刻 / 日時 | |
| start / end | 開始 / 終了 | |
| duration / elapsed time | 経過時間 | |
| days between dates | 2つの日付の間の日数 | |
| time zone | タイムゾーン | |
| local time (browser) | ローカル時刻 | |
| local time (city) | 現地時間 | |
| Japan time | 日本時間 | JST in dev copy |
| UTC | UTC（協定世界時） | first mention only |
| daylight saving time | サマータイム | |
| timestamp / Unix time | タイムスタンプ / UNIX時間 | |
| seconds / milliseconds | 秒 / ミリ秒 | |
| color / color code / preview | 色 / カラーコード / プレビュー | |
| QR code / size | QRコード / サイズ | |
| Download PNG | PNGをダウンロード | |
| password / length | パスワード / 文字数 | "Length: 16" → 文字数：16 |
| symbols / numbers (charset) | 記号 / 数字 | |
| Strong / Good (strength) | 強力 / 良好 | |
| example | 例 | 「例：」 prefix |
| option | オプション | |
| Search tools | ツールを検索 | |
| Common questions | よくある質問 | |

---

## 4. Per-tool research and SEO decisions

Demand ratings come from autocomplete depth and SERP competition: **High** (rich autocomplete,
many dedicated JP tools), **Medium**, **Low** (few or no query extensions; users phrase the need
differently — see note). Each block gives: primary keyword · variants · H1 · short title ·
seo.title (length) · seo.description · keywords field · card · intent notes · FAQ 1–2 questions
(with the facts the answer must state) · FAQ 3 angle · key UI labels.

### A1. word-counter — High
- Primary: **文字数カウント** · variants: 文字数カウンター, 文字数 数える, 文字数チェック, 単語数 カウント, 読了時間
- H1: 文字数カウント · short: 文字数カウント
- seo.title: 文字数カウント｜空白・改行を除く文字数も表示 (22)
- seo.description: 文字数・空白と改行を除く文字数・単語数・行数・読了時間をリアルタイムで表示。レポートやSNS投稿の文字数チェックに。登録不要・無料で、テキストは送信されません。
- keywords: 文字数カウント, 文字数カウンター, 文字数 数える, 文字数チェック, 文字カウント, 字数カウント, 単語数 カウント, ワードカウント, 読了時間, word counter, character counter
- card: 文字数・空白と改行を除く文字数・単語数・行数・読了時間をまとめて表示します。
- Intent: students (レポート), job seekers (エントリーシート), writers/SEO (記事の文字数), SNS posts. They want counts with AND without spaces/line breaks. Competitors add 原稿用紙換算 — we do not; never mention 原稿用紙 or X's weighted 140/280 limit as a feature.
- FAQ1: 文字数を数えるにはどうすればいいですか？ → paste or type; counts update instantly.
- FAQ2: 空白や改行を除いた文字数も数えられますか？ → はい。「文字数」は空白・改行を含む数、「空白・改行を除く」は半角・全角スペース、タブ、改行をすべて除いた数。
- FAQ3 angle: 入力した文章は保存・送信されますか？ → いいえ, browser only, free, no registration.
- Labels: Words 単語数 · Characters 文字数 · Without spaces 空白・改行を除く · Lines 行数 · Reading time 読了時間 · Copy summary 結果をまとめてコピー · Text to count カウントするテキスト · placeholder ここに文章を入力、または貼り付け… · status 入力するとすぐにカウントが更新されます。
- Body facts: 読了時間は1分あたり約500文字（空白を除く）で計算; 日本語の単語数はブラウザの単語分割機能による目安.

### A2. text-case-converter — Medium (intent often "keyboard shortcut")
- Primary: **大文字 小文字 変換** · variants: 大文字小文字変換, 英語 大文字 変換, 小文字 変換, 頭文字 大文字, タイトルケース
- H1: 英字の大文字・小文字変換 · short: 大文字・小文字変換
- seo.title: 大文字・小文字変換｜英語テキストを一括変換 (21)
- seo.description: 英語テキストをすべて大文字・すべて小文字・文頭だけ大文字・単語の先頭を大文字に一括変換。貼り付けてボタンを押すだけ。無料・登録不要でブラウザ内で処理します。
- keywords: 大文字 小文字 変換, 大文字小文字変換, 英語 大文字 変換, 英字 大文字 小文字, アルファベット 大文字, 小文字 変換, 頭文字 大文字, タイトルケース, uppercase, lowercase, title case
- card: 英語のテキストを大文字・小文字・文頭だけ大文字・単語の先頭を大文字に変換します。
- Intent: many searchers want the Excel/Word shortcut; the tool answers the need directly. NOT supported (do not list): カタカナ/ひらがなの小書き文字（ァ→ア）, 全角⇔半角 conversion.
- FAQ1: 英語の小文字をまとめて大文字にするには？
- FAQ2: 英単語の頭文字だけを大文字にできますか？ → はい「単語の先頭を大文字」。a・of・the なども含め、すべての単語の先頭が大文字になる（英文タイトルの細かい表記ルールには非対応）。
- FAQ3 angle: 日本語の文章も変換できますか？ → 英字（全角英字を含む）のみ変換、ひらがな・カタカナ・漢字はそのまま; + browser-only.
- Labels: UPPERCASE すべて大文字 · lowercase すべて小文字 · Sentence case 文頭だけ大文字 · Title Case 単語の先頭を大文字 · Text case options 変換方法 · Choose a format to create your result. 変換方法を選んでください。
- Behavior: 文頭 = start of text or after 「. ! ?」+space (not after 。).

### A3. remove-duplicate-lines — Medium
- Primary: **重複行削除** · variants: 重複行 削除, 重複 削除 テキスト, リスト 重複 削除, 重複データ 削除, ユニーク 抽出
- H1: 重複行削除ツール · short: 重複行削除
- seo.title: 重複行削除｜リストの重複行を一括削除 (18)
- seo.description: テキストやリストの重複行を一括削除し、最初に出てきた行を元の順番のまま残します。前後の空白や大文字・小文字の違いも無視できます。無料で、データは送信されません。
- keywords: 重複行削除, 重複行 削除, 重複 削除, 重複削除ツール, 重複 除去, リスト 重複 削除, 重複データ 削除, ユニーク 抽出, remove duplicate lines
- card: 重複している行を削除し、元の順番のままリストを整理します。
- Intent: top query is 重複 削除 エクセル → pitch "Excelやスプレッドシートの列を貼り付けて".
- FAQ1: テキストの重複行を削除するには？
- FAQ2: Excelの列の重複もこのツールで削除できますか？ → はい。列をコピーして貼り付け（1セル＝1行）、「重複を削除」後に結果を貼り戻す。複数列の行は行全体が一致した場合だけ重複扱い。
- FAQ3 angle: privacy + free.
- Labels: Trim spaces 前後の空白を削除 · Ignore case 大文字・小文字を区別しない · Remove empty lines 空行を削除 · Remove duplicates 重複を削除 · Clean list 整理後のリスト · List to clean 整理するリスト · placeholder 1行に1項目ずつ貼り付け… · Cleaned lines... 整理後の行…

### A4. json-formatter — High (dev)
- Primary: **JSON整形** · variants: JSON 整形 オンライン, JSONフォーマッター, JSON 圧縮, JSON 構文チェック, JSON バリデーション
- H1: JSON整形・圧縮ツール · short: JSON整形
- seo.title: JSON整形ツール｜整形・圧縮・構文チェック (22)
- seo.description: JSONを見やすく整形・1行に圧縮し、構文エラーもチェック。APIレスポンスや設定ファイルの確認に。無料・登録不要で、JSONはブラウザの外に送信されません。
- keywords: JSON整形, JSON 整形 オンライン, JSONフォーマッター, JSON 圧縮, JSON 構文チェック, JSON バリデーション, JSON 見やすく, json formatter, json beautifier
- card: JSONを見やすく整形・圧縮し、正しい形式かどうかをチェックします。
- FAQ1: JSONを見やすく整形するには？ → 貼り付けて「JSONを整形」; インデントは半角スペース2つ。
- FAQ2: JSONを1行に圧縮（minify）できますか？ → はい「圧縮」。
- FAQ3 angle: 機密情報を含むJSONを貼り付けても大丈夫ですか？ → browser only. Do NOT promise error line numbers: non-English UI shows a generic error.
- Labels: Format JSON JSONを整形 · Minify 圧縮 · Paste JSON to validate it. JSONを貼り付けて「JSONを整形」か「圧縮」を押すと、形式もチェックします。 (validation runs only on those buttons, never on paste) · Formatted JSON... 整形したJSON… · Valid JSON. Your result is ready. 正しいJSONです。結果を表示しました。 · Invalid JSON. Check the quotes, commas and brackets. JSONの形式が正しくありません。引用符・カンマ・括弧を確認してください。

### A5. base64-encoder-decoder — High (dev)
- Primary: **Base64 エンコード / デコード** (autocomplete: base64 デコード is #1) · variants: Base64 変換, Base64 変換ツール, Base64 日本語
- H1: Base64エンコード・デコード · short: Base64変換
- seo.title: Base64エンコード・デコード｜日本語対応 (22)
- seo.description: テキストをBase64にエンコード、Base64を元のテキストにデコード。日本語（UTF-8）にも対応しています。無料・登録不要で、変換はすべてブラウザ内で行います。
- keywords: Base64 エンコード, Base64 デコード, Base64 変換, Base64 エンコード デコード, Base64 日本語, Base64 変換ツール, base64 encode, base64 decode
- card: テキストをBase64にエンコードしたり、元のテキストにデコードしたりできます。
- Not supported: images/files (base64 画像 is a real query — do not list it).
- FAQ1: 文字列をBase64にエンコードするには？
- FAQ2: 日本語の文字列もBase64に変換できますか？ → はい、UTF-8として変換。Shift_JISなど他の文字コードで作られたBase64は文字化けする。
- FAQ3 angle: 画像やファイルもBase64に変換できますか？ → いいえ、テキストのみ; + browser-only.
- Labels: Encode to Base64 Base64にエンコード · Decode Base64 Base64をデコード · Base64 direction 変換の方向 · Text to encode... エンコードするテキスト… · Result... 結果…

### A6. url-encoder-decoder — High
- Primary: **URLエンコード** · variants: URLデコード, URLエンコード デコード, 日本語URL 変換, パーセントエンコーディング
- H1: URLエンコード・デコード · short: URLエンコード
- seo.title: URLエンコード・デコード｜日本語URLを変換 (23)
- seo.description: 日本語や記号をURLエンコード（パーセントエンコーディング）し、%E3…のような文字列を日本語に戻します。UTF-8対応、無料・登録不要でブラウザ内で変換します。
- keywords: URLエンコード, URLデコード, URLエンコード デコード, URL 日本語 変換, 日本語URL 変換, URL 文字化け 戻す, パーセントエンコーディング, url encode, url decode
- card: 日本語や記号をURLエンコードしたり、元の文字に戻したりできます。
- Behavior: `encodeURIComponent` — encodes everything except A–Z a–z 0–9 - _ . ! ~ * ' ( ), including / ? & = :. UTF-8 only (JP competitors also offer Shift_JIS/EUC-JP — we don't).
- FAQ1: 日本語をURLエンコードするには？
- FAQ2: %E3%81%82のような文字列を日本語に戻すには？ → 貼り付けて「URLデコード」。UTF-8でエンコードされた文字列に対応、Shift_JIS等はエラー。
- FAQ3 angle: URL全体をエンコードしてもいいですか？ → 「/」「?」「&」も変換されるため、検索語やパラメータの値などURLの一部に使う; + browser-only.
- Labels: Encode URL text URLエンコード · Decode URL text URLデコード · URL direction 変換の方向 · URL text to convert 変換するURL・テキスト · Use encode for text that must travel safely inside a URL. URLに含める日本語や記号はエンコードしてください。 · This text has an invalid URL escape sequence. 正しくないエンコード文字列（%XX）が含まれています。UTF-8以外でエンコードされている可能性があります。

### A7. text-to-slug — Low
- Low demand: スラッグ 生成 has no autocomplete extensions; users type パーマリンク 英語, WordPress スラッグ. Japanese competitors romanize Japanese; **we do not translate or romanize** — position it for English titles.
- Primary: **スラッグ 生成** · variants: URLスラッグ, パーマリンク 英語, スラッグ 作成, WordPress スラッグ
- H1: URLスラッグ生成ツール · short: スラッグ生成
- seo.title: スラッグ生成｜英語タイトルからURLを作成 (21)
- seo.description: 英語のタイトルを小文字・ハイフン区切りのURLスラッグに変換し、記号やアクセントも自動で除去します。ブログやWordPressのパーマリンク作成に。無料・登録不要。
- keywords: スラッグ 生成, スラッグ 作成, URLスラッグ, パーマリンク 英語, パーマリンク 作成, WordPress スラッグ, slug 生成, slug generator
- card: 英語のタイトルを、小文字とハイフンだけのURLスラッグに変換します。
- FAQ1: 英語のタイトルからスラッグを作るには？
- FAQ2: 日本語のタイトルを英語のスラッグにできますか？ → いいえ、翻訳やローマ字化はしない。英単語かローマ字で入力。「英字以外の文字（日本語など）も残す」で日本語のままのスラッグも作れるが、共有時に%E3…と長くなるため英語推奨。
- FAQ3 angle: privacy + free.
- Labels: Title or phrase タイトル・フレーズ · placeholder 例：How to Write a Great Blog Post · URL slug URLスラッグ · your-clean-url-slug 例：how-to-write-a-great-blog-post · Keep numbers 数字を残す · Keep non-Latin letters 英字以外の文字（日本語など）も残す · Create slug スラッグを作成 · Copy slug スラッグをコピー · A good slug is short, clear and easy to read. よいスラッグは短く、わかりやすく、読みやすいものです。

### A8. percentage-calculator — High
- Primary: **パーセント計算** · variants: 割合 計算, 何パーセント 計算, 増減率 計算, パーセント 計算機, 百分率
- H1: パーセント計算ツール · short: パーセント計算
- seo.title: パーセント計算｜割合・増減率を自動計算 (19)
- seo.description: 「〇〇の何%」「全体の何%」「増減率」をまとめて計算できる無料ツール。割引や前年比、正答率の計算に。登録不要で、計算はブラウザ内で行います。
- keywords: パーセント計算, 割合 計算, 何パーセント 計算, 増減率 計算, パーセント 計算機, 百分率 計算, 割引 計算, 前年比 計算, percentage calculator
- card: 「〇〇の何%」「全体の何%」「増減率」をすぐに計算します。
- Local uses: 割引（3,000円の20%）, 消費税10%, 前年比, 正答率, 達成率.
- FAQ1: 全体の何パーセントかを計算するには？ → 部分÷全体×100; use the 2nd card.
- FAQ2: 増減率（何%増えた・減った）はどう計算しますか？ → (変化後−変化前)÷変化前×100; result shows + / −.
- FAQ3 angle: privacy + free + no registration.
- Card headings: What is a percentage of a number? ある数の〇%はいくつ？ · What percent is one number of another? 全体に対して何%？ · What is the percentage change? 増減率は何%？
- Inline labels (markup order is fixed: [label][input][word][input]): Percent 割合 · "% of" %× · Part 部分 · "of" ÷ · From 変換元 (shared key) · "to" → · sr-only: Base number 元の数 · New number 変化後の数 · Whole number 整数 (shared key, see §7).
- Calculate 計算 · Copy answers 答えをコピー · Fill in any calculation you need. 必要な計算欄に数値を入力してください。

### A9. password-generator — High
- Primary: **パスワード生成** · variants: パスワード 自動生成, パスワード作成, ランダム パスワード, パスワード ジェネレーター, 強力なパスワード
- H1: パスワード生成ツール · short: パスワード生成
- seo.title: パスワード生成｜安全なランダムパスワード作成 (22)
- seo.description: 文字数（8〜64文字）と英大文字・小文字・数字・記号を選んで、安全なランダムパスワードを生成。ブラウザの暗号学的乱数を使い、どこにも送信しません。無料・登録不要。
- keywords: パスワード生成, パスワード 自動生成, パスワード作成, パスワード ジェネレーター, ランダム パスワード, 強力なパスワード, 安全なパスワード, パスワード 12桁, password generator
- card: 文字数と文字の種類を選んで、ランダムなパスワードを作成します。
- FAQ1: 安全なパスワードを作るには？
- FAQ2: パスワードは何文字（何桁）にすればいいですか？ → 8〜64文字に対応、初期値16文字。20文字以上かつ3種類以上で「強力」表示。サービスごとに別のパスワードを。
- FAQ3 angle: 作成したパスワードはどこかに保存されますか？ → いいえ; generated with crypto in the browser, not stored or sent; store it in a password manager.
- Labels: Your password 生成したパスワード · Click Generate password 「パスワードを生成」を押してください · Length: 文字数： · Uppercase 英大文字 · Lowercase 英小文字 · Numbers 数字 · Symbols 記号 · Exclude similar characters 紛らわしい文字を除く（I・l・1・O・0） · Generate password パスワードを生成 · Copy password パスワードをコピー · Strong 強力 · Good 良好 · Password created locally. Store it in a password manager. ブラウザ内でパスワードを生成しました。パスワード管理アプリなどに保存してください。

### A10. timestamp-converter — Medium (dev)
- Primary: **UNIX時間 変換** · variants: UNIXタイムスタンプ 変換, タイムスタンプ 変換, エポック秒 変換, unixtime 変換
- H1: UNIX時間・タイムスタンプ変換 · short: UNIX時間変換
- seo.title: UNIX時間変換｜タイムスタンプと日時を相互変換 (24)
- seo.description: UNIX時間（タイムスタンプ）を日時に、日時をUNIX時間（秒・ミリ秒）に相互変換。UTCとお使いの環境のローカル時刻を同時に表示します。無料・ブラウザ内で処理。
- keywords: UNIX時間 変換, UNIXタイムスタンプ 変換, タイムスタンプ 変換, エポック秒 変換, unixtime 変換, UNIX時間 日時, ミリ秒, unix timestamp converter, epoch converter
- card: UNIX時間（タイムスタンプ）と日時を相互に変換します。
- FAQ1: UNIX時間を日時に変換するには？
- FAQ2: ミリ秒（13桁）のタイムスタンプも変換できますか？ → はい。絶対値が1000億以上の値は自動でミリ秒として扱う。
- FAQ3 angle: 日本時間で表示されますか？ → ローカル時刻は端末のタイムゾーン設定で表示（日本の設定ならJST）、UTCも併記; + browser-only.
- Labels: Unix timestamp to date UNIX時間 → 日時 · Timestamp in seconds or milliseconds タイムスタンプ（秒またはミリ秒） · Convert to date 日時に変換 · Your local time ローカル時刻 · Date to Unix timestamp 日時 → UNIX時間 · Date and time in your time zone 日時（お使いのタイムゾーン） · Convert to timestamp UNIX時間に変換 · Seconds 秒 · Milliseconds ミリ秒 · Your dates stay in this browser. 日時はブラウザの外に送信されません。

### A11. html-entity-encoder-decoder — Low–Medium
- Primary: **HTMLエスケープ** · variants: HTML 特殊文字 変換, HTMLエンティティ 変換, 実体参照 変換, HTML アンエスケープ
- H1: HTMLエスケープ・アンエスケープ · short: HTMLエスケープ
- seo.title: HTMLエスケープ｜特殊文字を実体参照に変換 (22)
- seo.description: HTMLの特殊文字を実体参照（&lt;など）にエスケープし、元の文字に戻すアンエスケープにも対応。ブログへのコード掲載に。無料・登録不要でブラウザ内で変換します。
- keywords: HTMLエスケープ, HTML 特殊文字 変換, HTMLエンティティ 変換, 実体参照 変換, 文字実体参照, HTML アンエスケープ, エスケープ 解除, html escape, html entity
- card: HTMLの特殊文字を実体参照に変換し、元に戻すこともできます。
- FAQ1: HTMLの特殊文字をエスケープするには？
- FAQ2: どの文字がエスケープされますか？ → & < > " ' の5文字（&amp; &lt; &gt; &quot; &#39;）。日本語などはそのまま。アンエスケープは名前付き・数値文字参照（&#12354; など）すべてに対応。
- FAQ3 angle: privacy + free.
- Labels: Encode HTML エスケープ · Decode HTML アンエスケープ · HTML entity direction 変換の方向 · placeholder `<p>&などの記号も安全に表示</p>`

### B1. csv-to-json — Medium (dev)
- Primary: **CSV JSON 変換** · variants: CSVをJSONに変換, CSV JSON 変換ツール, CSV 変換
- H1: CSVからJSONへの変換 (reads well in 「{title}をもっと手軽に。」) · short: CSV→JSON変換
- seo.title: CSV JSON変換｜CSVをJSON形式に変換 (24)
- seo.description: CSVを貼り付けるだけでJSON形式に変換。1行目を見出し（キー）として、各行をオブジェクトの配列にします。無料・登録不要で、データはブラウザの外に出ません。
- keywords: CSV JSON 変換, CSVをJSONに変換, CSV JSON 変換ツール, CSV 変換, CSV JSON オンライン, csv to json
- card: CSVデータをJSON形式（オブジェクトの配列）に変換します。
- Behavior: comma delimiter only; quotes handled; every value is a string; empty cell → "".
- FAQ1: CSVをJSONに変換するには？
- FAQ2: Excelのデータを変換できますか？ → Excelで「CSV（コンマ区切り）」形式で保存した内容をテキストとして貼り付ける。セルを直接コピーするとタブ区切りになり、正しく変換できない。
- FAQ3 angle: 数値や空欄はどう変換されますか？ → すべて文字列、空欄は空文字; + browser-only.
- Labels: CSV data CSVデータ · Convert to JSON JSONに変換 · The first row becomes the JSON keys. 1行目がJSONのキー（見出し）になります。 · JSON result 変換結果（JSON） · JSON result... 変換結果…

### B2. json-to-csv — Medium (dev)
- Primary: **JSON CSV 変換** · variants: JSONをCSVに変換, JSON CSV 変換ツール
- H1: JSONからCSVへの変換 · short: JSON→CSV変換
- seo.title: JSON CSV変換｜JSONをCSV形式に変換 (24)
- seo.description: JSONの配列をCSV形式に変換。すべてのキーを見出し行にまとめ、各オブジェクトを1行にします。CSVファイルの作成やデータ移行に。無料・ブラウザ内で処理します。
- keywords: JSON CSV 変換, JSONをCSVに変換, JSON CSV 変換ツール, JSON 変換 CSV, json to csv
- card: JSONの配列をCSV形式に変換します。
- FAQ1: JSONをCSVに変換するには？ → オブジェクトの配列を貼り付けて「CSVに変換」。
- FAQ2: 変換したCSVをExcelで開くと文字化けします。どうすればいいですか？ → 結果はテキストで出力。ファイルに保存するときに文字コードを「UTF-8（BOM付き）」にするとExcelで日本語が文字化けしにくい。
- FAQ3 angle: ネストしたJSONはどうなりますか？ → 入れ子のオブジェクト・配列はJSON文字列として1つのセルに入る; + browser-only.
- Labels: JSON array JSON配列 · Convert to CSV CSVに変換 · Use an array of JSON objects with a shared set of keys. 同じキーを持つJSONオブジェクトの配列を入力してください。 · CSV result 変換結果（CSV）

### B3. random-number-generator — High
- Primary: **乱数生成** · variants: ランダム 数字 生成, 乱数メーカー, 乱数ジェネレーター, ランダム 数字 100 まで
- H1: 乱数生成ツール · short: 乱数生成
- seo.title: 乱数生成｜範囲指定でランダムな数字を作成 (20)
- seo.description: 最小値と最大値を指定して、ランダムな整数や小数を生成。1〜100の乱数や抽選、順番決めに。ブラウザの安全な乱数を使い、無料・登録不要で使えます。
- keywords: 乱数生成, 乱数 生成, 乱数メーカー, 乱数ジェネレーター, ランダム 数字, ランダム 数字 生成, 1から100 ランダム, 数字 抽選, random number generator
- card: 指定した範囲で、ランダムな数字を1つ生成します。
- FAQ1: 1から100までのランダムな数字を出すには？ → 初期値（最小値1・最大値100）のまま「乱数を生成」。
- FAQ2: 抽選やくじ引きに使えますか？ → はい、暗号学的に安全な乱数。1回につき1つ生成、複数人を選ぶときは繰り返す（同じ数が出ることもある）。
- FAQ3 angle: limits (整数の範囲は約42億通りまで, 小数は「整数のみ」をオフ) + free + browser-only.
- Labels: Whole number only 整数のみ · Generate number 乱数を生成 (数字 = numerals/digits; 乱数を生成 is the usual label on 乱数生成 tools) · Minimum 最小値 · Maximum 最大値 · Uses your browser’s secure random source. ブラウザの安全な乱数を使用します。

### B4. uuid-generator — Medium (dev)
- Primary: **UUID生成** · variants: UUID 生成ツール, GUID 生成, UUID v4, ランダム UUID
- H1: UUID v4生成ツール · short: UUID生成
- seo.title: UUID生成｜UUID v4を最大100件まとめて作成 (27)
- seo.description: UUID v4（GUID）を1〜100件まとめて生成。ブラウザの暗号学的乱数で作成し、どこにも送信しません。データベースのIDやテストデータに。無料・登録不要。
- keywords: UUID生成, UUID 生成, UUID 生成ツール, GUID 生成, UUID v4, ランダム UUID, uuid generator, guid generator
- card: UUID v4を最大100件まとめて生成します。
- FAQ1: UUIDをまとめて生成するには？
- FAQ2: UUIDが重複（衝突）する可能性はありますか？ → v4は122ビットの乱数、実用上は無視できるほど小さい。
- FAQ3 angle: limits (v4のみ、1〜100件、小文字・ハイフン付き、波括弧なし) + browser-only.
- Labels: How many? 生成する件数 · UUID v4 identifiers 件（UUID v4） · Generate UUIDs UUIDを生成 · Copy UUIDs UUIDをコピー · Your UUIDs will appear here... ここにUUIDが表示されます…

### B5. sha256-hash-generator — Medium (dev)
- Primary: **SHA256 ハッシュ 生成** · variants: ハッシュ値 計算, SHA-256 変換, ハッシュ化, SHA256 計算ツール
- H1: SHA-256ハッシュ生成 · short: SHA-256ハッシュ生成
- seo.title: SHA-256ハッシュ生成｜テキストのハッシュ値を計算 (27)
- seo.description: テキストのSHA-256ハッシュ値（16進数64文字）をすぐに計算。開発時の確認や値の照合に。Web Crypto APIでブラウザ内で処理し、送信はしません。無料・登録不要。
- keywords: SHA256 ハッシュ 生成, SHA-256 変換, SHA256 計算, ハッシュ値 計算, ハッシュ生成, ハッシュ化, sha256 hash generator, checksum
- card: テキストからSHA-256のハッシュ値を計算します。
- FAQ1: 文字列のSHA-256ハッシュ値を求めるには？ (UTF-8, 16進数・小文字64文字)
- FAQ2: SHA-256のハッシュ値から元の文字列に戻せますか？ → いいえ、一方向の関数。
- FAQ3 angle: ファイルのハッシュ値も計算できますか？ → いいえ、テキストのみ; + browser-only.
- Labels: Text to hash ハッシュ化するテキスト · Create SHA-256 hash SHA-256ハッシュを生成 · SHA-256 hexadecimal digest SHA-256ハッシュ値（16進数） · Copy hash ハッシュ値をコピー

### B6. regex-tester — Medium (dev)
- Primary: **正規表現 チェック** · variants: 正規表現チェッカー, 正規表現 テスト, 正規表現 テスター, JavaScript 正規表現
- H1: 正規表現チェッカー · short: 正規表現チェッカー
- seo.title: 正規表現チェッカー｜JavaScriptでマッチを確認 (27)
- seo.description: JavaScriptの正規表現を入力して、マッチした箇所と件数をすぐに確認。g・i・mなどのフラグにも対応。無料・登録不要で、テキストはブラウザの外に送信されません。
- keywords: 正規表現 チェック, 正規表現チェッカー, 正規表現 テスト, 正規表現 テスター, 正規表現 確認, JavaScript 正規表現, regex tester, regexp
- card: 正規表現がどこにマッチするかをすぐに確認できます。
- Behavior: JS `RegExp`, `g` always added, lists up to 1,000 matched strings; no replace, no capture-group view.
- FAQ1: 正規表現が正しく動くか確認するには？
- FAQ2: ひらがなやカタカナにマッチさせるには？ → ひらがな `[ぁ-ん]+`、カタカナ `[ァ-ヶー]+`、漢字 `\p{Script=Han}+`（フラグに u を追加）。
- FAQ3 angle: どの言語の正規表現に対応していますか？ → JavaScript（PHP・Pythonと一部の書き方が異なる）; + browser-only.
- Labels: Pattern パターン · Flags フラグ · Text to test テスト対象のテキスト · Paste sample text here... ここにテキストを貼り付け… · Test expression テスト実行 · Matches マッチ · No matches yet. まだマッチはありません。 · No matches found. マッチしませんでした。

### B7. jwt-decoder — Low–Medium (dev)
- Primary: **JWT デコード** · variants: JWT デコーダー, JWT 中身 確認, JWT 解析, JWT ペイロード
- H1: JWTデコーダー · short: JWTデコーダー
- seo.title: JWTデコード｜ヘッダーとペイロードを確認 (21)
- seo.description: JWT（JSON Web Token）のヘッダーとペイロードをデコードして中身を確認。署名の検証は行いません。トークンはブラウザ内だけで処理され、送信されません。無料・登録不要。
- keywords: JWT デコード, JWT デコーダー, JWT 中身 確認, JWT 解析, JWT ペイロード 確認, JSON Web Token, jwt decoder, jwt decode
- card: JWTのヘッダーとペイロードをデコードして表示します。
- FAQ1: JWTの中身（ペイロード）を確認するには？
- FAQ2: 署名の検証もできますか？ → いいえ、デコードのみ。
- FAQ3 angle: 本番のトークンを貼り付けても安全ですか？ → ブラウザ内のみで処理。ただしJWTのペイロードは暗号化されておらず誰でも読めるため、トークン自体を他人に共有しない。
- Labels: JSON Web Token JSON Web Token (keep) · Paste a JWT here... ここにJWTを貼り付け… · Decode token トークンをデコード · Header ヘッダー · Payload ペイロード · Decoding does not verify a token or its signature. デコードのみ行い、トークンや署名の検証はしません。

### B8. color-converter — Medium
- Primary: **カラーコード 変換** · variants: HEX RGB 変換, RGB カラーコード 変換, HSL 変換, 16進数 カラーコード
- H1: カラーコード変換 · short: カラーコード変換
- seo.title: カラーコード変換｜HEX・RGB・HSLを相互変換 (25)
- seo.description: カラーコードをHEX・RGB・HSLに相互変換し、色をプレビュー。#4D6BFFやrgb()、hsl()の値を入力するだけ。WebデザインやCSSの作成に。無料・登録不要。
- keywords: カラーコード 変換, カラーコード変換, HEX RGB 変換, RGB HEX 変換, RGB カラーコード, HSL 変換, 16進数 カラーコード, 色 変換, color converter, hex to rgb
- card: カラーコードをHEX・RGB・HSLに相互変換します。
- Behavior: accepts #RGB / #RRGGBB (# optional), rgb(r,g,b) with commas, hsl(h,s%,l%). No CMYK, no color names, no picker — do not use カラーピッカー.
- FAQ1: カラーコード（HEX）をRGBに変換するには？
- FAQ2: RGBやHSLの値からカラーコードを求められますか？ → はい、rgb(77,107,255) や hsl(231,100%,67%) の形式で入力。#FFFのような3桁も可。
- FAQ3 angle: CMYKにも変換できますか？ → いいえ、HEX・RGB・HSLのみ; + browser-only.
- Labels: Color value カラーコード · placeholder 例：#4D6BFF、rgb(77,107,255)、hsl(231,100%,67%) · Color preview 色のプレビュー · Convert color 色を変換 · Supports HEX, RGB and HSL colors. HEX・RGB・HSLに対応しています。

### B9. url-parser — Low–Medium
- Primary: **URLパラメータ解析** (the dominant SERP name: so-zou.jp, アサリツールズ, webtools-plus.jp, webtool-lab.com) · variants: URL 分解, URLパラメータ 確認, URL 解析, GETパラメータ 確認, クエリパラメータ 確認, UTMパラメータ 確認
- H1: URLパラメータ解析・分解 · short: URLパラメータ解析
- seo.title: URLパラメータ解析｜URLを分解してクエリを一覧表示 (27)
- seo.description: URLをプロトコル・ホスト・パス・クエリ・フラグメントに分解し、クエリパラメータを一覧表示。広告やメルマガのUTMパラメータ確認に。無料・ブラウザ内で解析します。
- keywords: URLパラメータ解析, URL パラメータ 解析, URL 分解, URL 解析, URLパラメータ 確認, URLパラメータ 分解, GETパラメータ 確認, クエリパラメータ, クエリ文字列, UTMパラメータ 確認, url parser
- card: URLを構成要素に分解し、クエリパラメータを一覧表示します。
- FAQ1: URLのパラメータを確認するには？
- FAQ2: UTMパラメータ（utm_sourceなど）を確認できますか？ → はい、すべてのクエリパラメータをデコードした値で一覧表示。
- FAQ3 angle: 短縮URLのリンク先もわかりますか？ → いいえ、URLにアクセスせず文字列を解析するだけ; + browser-only.
- Labels: URL to parse 分解するURL · Parse URL URLを分解 · URL components URLの構成要素 · Protocol プロトコル · Host ホスト · Path パス · Query クエリ · Hash フラグメント（#） · Query parameters クエリパラメータ · No query parameters. クエリパラメータはありません。 · The URL is analyzed locally. URLはブラウザ内で解析されます。

### B10. roman-numeral-converter — Medium (intent split)
- Many searches (ローマ数字 変換 パソコン/iPhone) want to TYPE Ⅳ-style characters; we output ASCII letters. Serve the "what is 2026 in Roman numerals / how to read" intent.
- Primary: **ローマ数字 変換** · variants: ローマ数字 アラビア数字, 数字 ローマ数字 変換, ローマ数字 読み方, ローマ数字 年号
- H1: ローマ数字変換 · short: ローマ数字変換
- seo.title: ローマ数字変換｜数字とローマ数字を相互変換 (21)
- seo.description: 数字をローマ数字に、ローマ数字を数字に相互変換（1〜3999）。2026→MMXXVIのような年号や章番号、時計の文字盤の読み方に。無料・登録不要でブラウザ内で変換。
- keywords: ローマ数字 変換, ローマ数字 アラビア数字, 数字 ローマ数字 変換, ローマ数字 読み方, ローマ数字 年号, ローマ数字 一覧, roman numeral converter
- card: 数字とローマ数字を1〜3,999の範囲で相互に変換します。
- FAQ1: 数字をローマ数字に変換するには？
- FAQ2: 2026年をローマ数字で書くと？ → MMXXVI（M=1000×2, XX=20, VI=6）。
- FAQ3 angle: limits: 1〜3,999; 入力は I・V・X・L・C・D・M（小文字・全角・「Ⅻ」のような記号も可、runtime.js が NFKC で正規化）; IIII のような非標準表記は不可; + browser-only.
- Labels: Number to Roman numeral 数字 → ローマ数字 · Whole number from 1 to 3,999 1〜3,999の整数 · Convert to Roman ローマ数字に変換 · Roman numeral to number ローマ数字 → 数字 · Roman numeral ローマ数字 · Convert to number 数字に変換

### B11. binary-converter — High (edu + dev)
- Primary: **進数変換** · variants: 2進数 変換, 16進数 変換, 10進数 2進数 変換, 基数変換, 8進数
- H1: 進数変換ツール · short: 進数変換
- seo.title: 進数変換｜2進数・10進数・16進数を相互変換 (23)
- seo.description: 2進数・8進数・10進数・16進数の整数を相互に変換。大きな整数やマイナスの数にも対応します。プログラミングや情報の授業に。無料・登録不要でブラウザ内で計算。
- keywords: 進数変換, 2進数 変換, 16進数 変換, 10進数 2進数, 2進数 10進数, 基数変換, 8進数 変換, binary converter
- card: 2進数・8進数・10進数・16進数を相互に変換します。
- Behavior: integers of any size (BigInt), leading - allowed, _ ignored, no 0x/0b prefix, hex output uppercase.
- FAQ1: 10進数を2進数に変換するには？
- FAQ2: 小数や文字（テキスト）も2進数に変換できますか？ → いいえ、整数のみ。
- FAQ3: 2進数や16進数を10進数に変換するには？ (real reverse-direction queries 16進数 10進数 変換 / 2進数 10進数 変換) → 変換元・変換先を選ぶ, FF→255, 1010→10, 0x/0b の接頭辞なし（A〜Fは小文字可）; + browser-only.
- Labels: From base 変換元 · To base 変換先 · Decimal (10) 10進数 · Binary (2) 2進数 · Hexadecimal (16) 16進数 · Octal (8) 8進数 · Integer to convert 変換する整数 · Convert number 変換 · Supports whole numbers in bases 2, 8, 10 and 16. 2進数・8進数・10進数・16進数の整数に対応しています。

### C1. prime-number-checker — Medium (edu)
- Primary: **素数判定** · variants: 素数判定機, 素数 判定 サイト, 素数かどうか, 素数 チェック
- H1: 素数判定ツール · short: 素数判定
- seo.title: 素数判定｜1兆までの整数が素数かすぐわかる (21; no repeated 判定, states the 1兆 limit)
- seo.description: 入力した整数が素数かどうかをすぐに判定。0〜1兆までの整数に対応しています。算数・数学の確認やプログラミングの検算に。無料・登録不要でブラウザ内で計算します。
- keywords: 素数判定, 素数 判定, 素数判定機, 素数 チェック, 素数かどうか, 素数 調べる, prime checker
- card: 入力した整数が素数かどうかを判定します。
- Not supported: 素因数分解 (competitors show it) — do not claim.
- FAQ1: ある数が素数かどうか調べるには？
- FAQ2: 1は素数ですか？ → いいえ。0と1は素数ではなく、最小の素数は2。
- FAQ3 angle: どこまでの数を判定できますか？ → 0〜1兆; 素因数分解は表示しない; + browser-only.
- Labels: Whole number 整数 · Check number 判定 · Prime number 素数です · Not prime 素数ではありません · Checks integers up to one trillion locally. 1兆までの整数をブラウザ内で判定します。

### C2. average-calculator — High
- Primary: **平均 計算** · variants: 平均値 計算, 平均 計算機, 平均点 計算, 平均 計算サイト
- H1: 平均値計算ツール · short: 平均値計算
- seo.title: 平均値計算｜合計・最大・最小もまとめて計算 (21)
- seo.description: 数値を貼り付けるだけで平均値を計算し、合計・個数・最大値・最小値も同時に表示。テストの平均点や売上の集計に。無料・登録不要で、データは送信されません。
- keywords: 平均 計算, 平均値 計算, 平均 計算機, 平均点 計算, 平均値 求め方, 合計 計算, 平均 計算サイト, average calculator
- card: 数値の平均値・合計・個数・最大値・最小値をまとめて計算します。
- FAQ1: 複数の数値の平均を求めるには？
- FAQ2: Excelからコピーした数値の平均も計算できますか？ → はい。改行・タブ・スペース・カンマ・読点（、）で区切られていれば可、全角数字も可。桁区切りのカンマ（1,234）は区切りと見なされるので外す。
- FAQ3 angle: 中央値も計算できますか？ → いいえ、算術平均（相加平均）のみ; + browser-only.
- Labels: Numbers to average 平均を求める数値 · Calculate average 平均を計算 · Separate numbers with spaces, commas or new lines. 数値はスペース・カンマ・読点（、）・改行で区切ってください。 · Average 平均値 · Sum 合計 · Count 個数 · Minimum 最小値 · Maximum 最大値

### C3. ratio-proportion-calculator — Medium (edu)
- Primary: **比率 計算** (competitors: ラッコ 比率計算ツール, noveblo, ratiocalc.blog, m-bsys 比率計算機; more demand than 比例式 計算) · variants: 比率計算, 比の計算, 比 計算, 比例式 計算, 比を簡単にする, 整数比, xを求める, アスペクト比
- H1: 比率・比例式の計算 · short: 比率計算
- seo.title: 比率計算｜比例式のxと最も簡単な比を求める (21)
- X/x: the fixed markup labels the field with an uppercase **X** (A : B = C : X), so every on-page string uses X
  (Xを求める, Xの値, A:B=C:XのX, X=B×C÷A). Lowercase x only in the search forms: seo.title and the keyword xを求める.
- seo.description: A:B=C:XのXを自動で計算し、A:Bを最も簡単な整数の比にします。レシピの分量やアスペクト比（16:9）の計算に。無料・登録不要でブラウザ内で計算します。
- keywords: 比率 計算, 比率計算, 比の計算, 比 計算, 比例式 計算, 比を簡単にする, 整数比, xを求める, 比例式 計算機, アスペクト比 計算, ratio calculator
- card: A:B=C:XのXを求め、A:Bを最も簡単な比で表示します。
- FAQ1: 比例式A:B=C:XのXを求めるには？ → X=B×C÷A、3つの正の数を入力。
- FAQ2: 比を簡単にする（最も簡単な整数の比にする）には？ → A・Bが整数なら自動表示（例：12:18→2:3）、小数はそのまま表示。
- FAQ3 angle: limits (正の数のみ) + browser-only.
- Labels: Solve proportion Xを求める · Missing value X Xの値 · Simplified A:B A:Bを簡単にした比 · Proportion solved locally. ブラウザ内でXを求めました。 · Solve A:B = C:X, then see the simplified A:B ratio. A:B=C:XのXを求め、A:Bを最も簡単な比で表示します。

### C4. time-duration-calculator — Medium
- Primary: **経過時間 計算** · variants: 時間計算, 何時間 計算, 日時 差 計算, 夜勤 時間 計算 (経過日数 belongs to date-calculator)
- H1: 経過時間計算ツール · short: 経過時間計算
- seo.title: 経過時間計算｜2つの日時の間が何時間かを計算 (22)
- seo.description: 開始と終了の日時を入れるだけで、経過時間を日数・時間数・〇日〇時間〇分〇秒で表示。夜勤など日付をまたぐ時間の計算に。無料・登録不要でブラウザ内で計算。
- keywords: 経過時間 計算, 時間計算, 何時間 計算, 日時 差 計算, 時間 差 計算, 夜勤 時間 計算, 日付またぎ 時間 計算, time duration calculator
- card: 2つの日時の間の経過時間を、合計日数・合計時間と〇日〇時間〇分〇秒で表示します。
- FAQ1: 2つの日時の間が何時間か計算するには？
- FAQ2: 日付をまたぐ時間（夜勤など）も計算できますか？ → はい、開始と終了の日付と時刻をそれぞれ指定。
- FAQ3 angle: 休憩時間を引いた勤務時間も計算できますか？ → いいえ、単純な差のみ（休憩は結果から差し引く）; + browser-only.
- Labels: Start 開始 · End 終了 · Date and time 日時 · Calculate duration 経過時間を計算 · Total days 合計日数 · Total hours 合計時間 · Exact duration 経過時間（日・時・分・秒） · Choose a start and end time. 開始と終了の日時を選んでください。

### C5. number-to-words-converter — High (Japanese-specific adaptation)
- Primary: **漢数字 変換** · variants: 数字 漢数字 変換, 大字 変換, 金額 漢数字, 小切手 漢数字, 領収書 漢数字
- H1: 漢数字変換ツール · short: 漢数字変換
- seo.title: 漢数字変換｜数字を漢数字・大字に一発変換 (20)
- seo.description: 数字を漢数字（一万二千三百四十五）に変換し、領収書やご祝儀袋で使う大字（壱・弐・参・拾）も同時に表示。1兆未満の整数に対応。無料・登録不要。
- keywords: 漢数字 変換, 漢数字変換, 数字 漢数字 変換, 算用数字 漢数字, 漢数字 大字, 大字 変換, 金額 漢数字, 小切手 漢数字, 領収書 漢数字, ご祝儀 漢数字, number to kanji
- card: 数字を漢数字と大字（壱・弐・参・拾）に変換します。
- Depends on runtime.js implementing §5.1 (both lines). If the 大字 line is dropped, remove 大字 from title/description/FAQ.
- FAQ1: 数字を漢数字に変換するには？
- FAQ2: 領収書やご祝儀袋に書く大字（壱・弐・参）にも変換できますか？ → はい、2行目に大字を表示。法令で定められた壱・弐・参・拾を使い、改ざん防止のため拾・百・千の前にも「壱」を付ける。「金」「円也」や「萬」などは用途に合わせて書き足す。
- FAQ3 angle: 対応範囲は？ → -999,999,999,999〜999,999,999,999（1兆未満）の整数、小数不可、漢数字→数字の逆変換は非対応; + browser-only.
- Labels: Whole number 整数 · Convert to words 漢数字に変換 · Written number 変換結果（漢数字） · placeholder One million two hundred... 百二十三万四千五百六十七… · Supports whole numbers from -999,999,999,999 to 999,999,999,999. -999,999,999,999〜999,999,999,999（1兆未満）の整数に対応しています。 · Use a whole number between -999,999,999,999 and 999,999,999,999. -999,999,999,999〜999,999,999,999の整数を入力してください。

### C6. remove-line-breaks — High
- Primary: **改行削除** · variants: 改行 消す, 改行削除ツール, 改行 除去, PDF 改行 削除
- H1: 改行削除ツール · short: 改行削除
- seo.title: 改行削除｜PDFからコピーした文章の改行を一括削除 (25)
- seo.description: PDFやメールからコピーした文章の改行を一括削除。日本語は改行をそのまま詰め、英文はスペースでつなげられます。無料・登録不要で、テキストは送信されません。
- keywords: 改行削除, 改行 削除, 改行 消す, 改行削除ツール, 改行 除去, 改行 取る, PDF 改行 削除, 改行 まとめて削除, remove line breaks
- card: 文章の改行をまとめて削除し、1つの段落にします。
- Behavior: removes every line break (paragraph breaks too); collapses runs of half-width spaces/tabs to one; full-width spaces untouched.
- FAQ1: 文章の改行をまとめて削除するには？
- FAQ2: 日本語の文章で改行を消すと、余計なスペースが入りませんか？ → 「改行を削除（日本語向け）」ならスペースなしでつながる。「スペースでつなぐ（英文向け）」は英文用。
- FAQ3 angle: 段落の区切り（空行）は残せますか？ → いいえ、すべての改行を削除; + browser-only.
- Labels: Join with spaces スペースでつなぐ（英文向け） · Remove breaks 改行を削除（日本語向け） · Text with line breaks 改行を含むテキスト · Clean result 変換結果 · placeholder 改行が入った\n文章をここに\n貼り付け… · Your clean paragraph will appear here... ここに改行を削除した文章が表示されます… · Line breaks removed locally. ブラウザ内で改行を削除しました。

### C7. text-diff-checker — High
- Primary: **テキスト比較** · variants: 差分 比較, 文章 比較, テキスト 差分, 差分チェック, diff
- H1: テキスト比較・差分チェック · short: テキスト比較
- seo.title: テキスト比較｜2つの文章の差分を行ごとにチェック (24)
- seo.description: 2つのテキストを行ごとに比較し、変更前と変更後の違いを一覧表示。原稿の修正確認や設定ファイルの比較に。無料・登録不要で、文章はブラウザの外に送信されません。
- keywords: テキスト比較, テキスト 差分, 差分 比較, 文章 比較, 差分チェック, 文字 比較, テキスト比較ツール, diff, diff checker
- card: 2つのテキストを行ごとに比較して、違いを一覧表示します。
- Behavior: positional line-by-line (line N vs line N); no character highlighting; an inserted line makes every following line differ. Never claim 文字単位.
- FAQ1: 2つの文章の違いを比較するには？
- FAQ2: 変わった文字だけをハイライト表示できますか？ → いいえ、行単位で比較し、違う行の変更前（-）と変更後（+）を表示。長い日本語の段落は「。」ごとに改行してから比べると見つけやすい。
- FAQ3 angle: 契約書など社外秘の文章を比較しても大丈夫ですか？ → browser only, nothing sent.
- Labels: Original text 変更前のテキスト · Changed text 変更後のテキスト · Paste the original... 元の文章を貼り付け… · Paste the changed version... 変更後の文章を貼り付け… · Compare text テキストを比較 · Differences 違い · No comparison yet. まだ比較していません。 · No differences found. 違いは見つかりませんでした。 · Comparison runs locally line by line. ブラウザ内で1行ずつ比較します。

### C8. unit-converter — High
- Primary: **単位変換** · variants: 単位換算, インチ センチ 変換, ポンド キロ 変換, 華氏 摂氏 変換, ガロン リットル
- H1: 単位変換ツール · short: 単位変換
- seo.title: 単位変換｜インチ・ポンド・華氏などを換算 (20)
- seo.description: インチ・フィート・ポンド・オンス・米ガロン・華氏などを、センチ・キロ・リットル・摂氏に換算。長さ・重さ・体積・温度に対応。無料・登録不要でブラウザ内で計算。
- keywords: 単位変換, 単位換算, インチ センチ 変換, フィート メートル, ポンド キロ 変換, オンス グラム, ガロン リットル 変換, 華氏 摂氏 変換, マイル キロ, unit converter
- card: 長さ・重さ・体積・温度の単位を換算します。
- Local intent: converting US/imperial units (通販のサイズ, 海外レシピ, 天気予報の華氏) into metric. Not supported: 面積, 圧力, 速度, 尺貫法.
- FAQ1: インチをセンチに変換するには？ → 1インチ=2.54cm。
- FAQ2: 華氏を摂氏に変換するには？ → (℉−32)×5/9、例：100℉≈37.8℃。
- FAQ3 angle: 対応している単位は？ → list; 米カップは約237mLで日本の1カップ（200mL）とは異なる; + browser-only.
- Labels: Type 種類 · Length 長さ · Weight 重さ · Temperature 温度 · Volume 体積 · From 変換元 · To 変換先 · Value 数値 · Convert unit 変換 · Units: Meters メートル（m） · Kilometers キロメートル（km） · Centimeters センチメートル（cm） · Millimeters ミリメートル（mm） · Inches インチ（in） · Feet フィート（ft） · Yards ヤード（yd） · Miles マイル（mi） · Kilograms キログラム（kg） · Grams グラム（g） · Milligrams ミリグラム（mg） · Pounds ポンド（lb） · Ounces オンス（oz） · Liters リットル（L） · Milliliters ミリリットル（mL） · US gallons 米ガロン（gal） · US quarts 米クォート（qt） · US cups 米カップ（約237mL） · Celsius 摂氏（℃） · Fahrenheit 華氏（℉） · Kelvin ケルビン（K）
- Output reads 「2.54 センチメートル（cm）」 (app.js inserts the space) — acceptable.

### C9. date-calculator — High
- Primary: **日数計算** · variants: 日付 計算, 何日後 計算, 何日前, 期間 計算, 経過日数
- H1: 日数計算ツール · short: 日数計算
- seo.title: 日数計算｜日付の差と何日後・何日前を計算 (20)
- seo.description: 2つの日付の間の日数や、ある日付から〇日後・〇日前の日付を計算。締め切りや記念日、支払期限の確認に。日付は曜日付きで表示します。無料・登録不要。
- keywords: 日数計算, 日付 計算, 何日後 計算, 何日前 計算, 期間 計算, 日数 カウント, 経過日数, 日付 差, date calculator
- card: 2つの日付の間の日数や、〇日後・〇日前の日付を計算します。
- FAQ1: 2つの日付の間が何日あるか計算するには？
- FAQ2: 初日を含めて数えることはできますか？ → 結果は初日を含まない日数（1月1日〜1月3日は2日）。初日も含める（両端入れ）場合は1を足す。
- FAQ3 angle: 営業日（土日祝日を除く日数）も計算できますか？ → いいえ、カレンダー上の日数のみ; + browser-only.
- Labels: Days between dates 2つの日付の間の日数 · Start date 開始日 · End date 終了日 · Calculate difference 日数を計算 · Add or subtract days 〇日後・〇日前の日付 · Starting date 基準日 · Days to add 加算する日数 · Use a negative number to subtract 〇日前はマイナスの数（例：-30）で入力 · Calculate date 日付を計算 · Dates are calculated in your browser. 日付はブラウザ内で計算されます。

### C10. qr-code-generator — High
- Primary: **QRコード作成** · variants: QRコード 作成 無料, QRコード 生成, QRコード URL, QRコード 作り方, QRコードメーカー
- H1: QRコード作成ツール · short: QRコード作成
- seo.title: QRコード作成｜URLから無料でPNG画像を生成 (24)
- seo.description: URLや短いテキストからQRコードを無料で作成し、PNG画像でダウンロード。登録不要・有効期限なしで、データはブラウザ内で生成され送信されません。
- keywords: QRコード作成, QRコード 作成 無料, QRコード 生成, QRコード 作り方, QRコード URL, QRコードメーカー, QRコード ジェネレーター, qr code generator
- card: URLや短いテキストからQRコードを作成し、PNGで保存できます。
- Body MUST end with: ※QRコードは株式会社デンソーウェーブの登録商標です。
- FAQ1: URLからQRコードを作成するには？
- FAQ2: 作成したQRコードに有効期限はありますか？ → いいえ。内容を直接QRコードに記録し中継サーバーを使わないため、リンク先が有効な限り読み取れる。
- FAQ3 angle: 日本語は何文字まで入れられますか？ → 106バイトまで、日本語ならおよそ35文字; 白黒のPNG（256・384・512px）; + browser-only.
- Labels: Link or short text URLまたは短いテキスト · Size サイズ · 256 px 256px · 384 px 384px · 512 px 512px · Always black and white for reliable scanning. 確実に読み取れるよう、常に白黒で作成します。 · Generate QR code QRコードを作成 · Download PNG PNGをダウンロード · Generated QR code 作成したQRコード · Generated locally in your browser. Nothing is uploaded. QRコードはブラウザ内で作成され、データはアップロードされません。 (idle status, so no progressive 〜しています)

### C11. time-zone-converter — High
- Primary: **時差計算** · variants: 時差 計算 日本 アメリカ, タイムゾーン 変換, 日本時間 変換, 現地時間, 時差 ニューヨーク
- H1: 時差計算ツール · short: 時差計算
- seo.title: 時差計算｜日本時間と海外の現地時間を変換 (20)
- seo.description: 日本時間とニューヨーク・ロサンゼルス・ロンドンなどの現地時間を変換。サマータイムも自動で反映します。海外との会議や配信時間の確認に。無料・登録不要。
- keywords: 時差計算, 時差 計算, タイムゾーン 変換, 日本時間 変換, 現地時間 計算, 時差 日本 アメリカ, 時差 ニューヨーク, 日本時間 ロサンゼルス, 時差 ロンドン, time zone converter
- card: 日本時間と世界の主な都市の現地時間を変換します。
- FAQ1: 日本時間を海外の現地時間に変換するには？
- FAQ2: 日本とニューヨークの時差は何時間ですか？ → 14時間（日本が進んでいる）。ニューヨークのサマータイム期間は13時間。
- FAQ3 angle: どの都市に対応していますか？ → the 13 options below only; サマータイムはブラウザのタイムゾーン情報で自動反映; + browser-only.
- Labels: Date and time 日時 · From 変換元 · To 変換先 · Time zone タイムゾーン · Convert time 時刻を変換 · UTC UTC（協定世界時） · New York (Eastern) ニューヨーク（米国東部時間） · Chicago (Central) シカゴ（米国中部時間） · Denver (Mountain) デンバー（米国山岳部時間） · Los Angeles (Pacific) ロサンゼルス（米国太平洋時間） · London ロンドン · Madrid マドリード · India (Kolkata) インド（コルカタ） · Jakarta ジャカルタ · Ho Chi Minh City ホーチミン · Seoul ソウル · Tokyo 東京（日本時間） · Sydney シドニー · Uses your browser’s time zone data, including daylight saving changes. ブラウザのタイムゾーン情報を使い、サマータイムも反映します。

---

## 5. Market adaptations the real behavior supports (runtime.js engineer)

### 5.1 Number to words → 漢数字 + 大字 (implement in `src/locales/ja/runtime.js`)
Hook contract (from `src/app.js`/`bundle.mjs`): runtime.js is appended after
`window.usefulverseLocale = {...}`; set `window.usefulverseLocale.numberToWords = (value) => string`.
`value` is a **BigInt** already validated to -999,999,999,999…999,999,999,999 (so 兆 is never
reached; keep it in the table anyway). Output goes into a textarea, so `\n` is allowed.

Decisions (sources: Wikipedia 漢数字 / 大字, 公証人法37条, 戸籍法施行規則31条, 商業登記規則48条):
- 命数法 (named units) with 4-digit groups: 万 (10^4), 億 (10^8), 兆 (10^12).
- Inside a group, omit 一 before 十・百・千 (十, 百, 千, 千万 — dictionary form せんまん); always
  write 一 before a group scale word (一万, 一億).
- Zero: **零** (命数法 uses 零; 〇 is for positional digits like 二〇二六).
- Negative: prefix **マイナス**.
- Second line: `大字：` + 大字 form, using only the legally prescribed 壱・弐・参・拾 (replace
  一→壱, 二→弐, 三→参, 十→拾; 四〜九, 百, 千, 万, 億 unchanged), and write the digit before
  拾・百・千 even when it is 1 (壱拾, 壱百, 壱千 — anti-tampering practice). Do NOT add 金/円/也 or
  customary 萬/阡/伍.
- Output format: `${kansuji}\n大字：${daiji}` (e.g. `一万二千三百四十五\n大字：壱万弐千参百四拾五`).

Reference algorithm (verified against all vectors below with node):
```js
const K = ['', '一','二','三','四','五','六','七','八','九'];
const D = ['', '壱','弐','参','四','五','六','七','八','九'];
function group(n, daiji) { // 1..9999
  const digits = daiji ? D : K; const ten = daiji ? '拾' : '十'; let s = '';
  for (const [u, k] of [[1000,'千'],[100,'百'],[10,ten]]) { const d = Math.floor(n / u) % 10; if (d) s += (d === 1 && !daiji ? '' : digits[d]) + k; }
  return s + digits[n % 10];
}
function words(value, daiji = false) {
  if (value === 0n) return '零';
  const neg = value < 0n; let n = neg ? -value : value; let out = ''; let i = 0;
  const scales = ['', '万', '億', '兆'];
  while (n > 0n) { const g = Number(n % 10000n); if (g) out = group(g, daiji) + scales[i] + out; n /= 10000n; i += 1; }
  return (neg ? 'マイナス' : '') + out;
}
window.usefulverseLocale.numberToWords = (value) => `${words(value)}\n大字：${words(value, true)}`;
```

Test vectors (value → 漢数字 / 大字):
| value | 漢数字 | 大字 |
|---|---|---|
| 0 | 零 | 零 |
| 1 | 一 | 壱 |
| 10 | 十 | 壱拾 |
| 11 | 十一 | 壱拾壱 |
| 20 | 二十 | 弐拾 |
| 100 | 百 | 壱百 |
| 101 | 百一 | 壱百壱 |
| 110 | 百十 | 壱百壱拾 |
| 1000 | 千 | 壱千 |
| 1001 | 千一 | 壱千壱 |
| 2026 | 二千二十六 | 弐千弐拾六 |
| 10000 | 一万 | 壱万 |
| 10001 | 一万一 | 壱万壱 |
| 12345 | 一万二千三百四十五 | 壱万弐千参百四拾五 |
| 100000 | 十万 | 壱拾万 |
| 1000000 | 百万 | 壱百万 |
| 1234567 | 百二十三万四千五百六十七 | 壱百弐拾参万四千五百六拾七 |
| 10000000 | 千万 | 壱千万 |
| 100000000 | 一億 | 壱億 |
| 100010001 | 一億一万一 | 壱億壱万壱 |
| 999999999999 | 九千九百九十九億九千九百九十九万九千九百九十九 | 九千九百九拾九億九千九百九拾九万九千九百九拾九 |
| -1 | マイナス一 | マイナス壱 |
| -12345 | マイナス一万二千三百四十五 | マイナス壱万弐千参百四拾五 |

Input side needs nothing: app.js already NFKC-normalizes (全角数字 １２３ and 全角マイナス work)
and strips commas/spaces.

### 5.2 Word counter
- `wordSegmentation: true` → Japanese 単語数 via `Intl.Segmenter('ja-JP')`; present it as a
  目安 (estimate). 文字数 is the metric Japanese users care about.
- 文字数 = JS string length (spaces and each line break count as 1; an emoji or rare kanji outside
  the BMP counts as 2). 空白・改行を除く removes all `\s` (half/full-width spaces, tabs, breaks).
- Reading time: `readingUnit: "characters"`, `readingRate: 500` (JP silent reading norm 400〜600
  字/分; 500 is the midpoint) over characters without whitespace, rounded up, min 1 分.

### 5.3 Number formats and input
- ja-JP `Intl.NumberFormat` = 1,234,567.89 (same separators as en). No comma-decimal.
- `textNumberInputs: true` turns number inputs into text so IME 全角数字 are accepted via
  `parseInputNumber` (NFKC). The fields app.js reads without NFKC (date offset, 漢数字 input,
  UNIX timestamp, base converter, Roman input) are normalized by `runtime.js` on click (NFKC, and a
  leading ー/−/‐/―/– becomes "-"), so ３０, ー30, ＦＦ, ＭＭＸＸＶＩ and Ⅻ all work: copy must not ask for 半角.
  `#date-offset` gets `inputMode = "text"` because the iOS numeric pad has no minus key (〇日前 = -30).
- Average calculator also accepts 読点「、」 as a separator.

### 5.4 Dates and time zones
- `longDates: true` → 〇日後の結果 like 2026年10月29日木曜日 (weekday included) — say 曜日付き.
- Time zone converter defaults Tokyo → New York (matches top query). Output via Intl ja-JP full
  date + long time (e.g. 2026年9月29日火曜日 21:00:00 JST). Japan has no DST; NY/LA/London/
  Madrid/Sydney do — answers must say サマータイム is applied automatically.
- Timestamp local time uses the device time zone (JST for users in Japan) — never promise "JST"
  unconditionally.

### 5.5 QR code
- Byte mode, UTF-8, versions 1–5, ≤106 bytes → Japanese ≈35 characters (3 bytes each), URLs ≈106
  ASCII characters. Black/white PNG 256/384/512px. Static code: no expiry, no redirect.
- Trademark line required by DENSO WAVE for media use: 「QRコードは株式会社デンソーウェーブの
  登録商標です。」

### 5.6 Units
Label US liquid units as 米ガロン/米クォート/米カップ; a Japanese 1カップ is 200mL, a US cup is
236.6mL — mention it once (FAQ3 of unit-converter).

---

## 6. Honesty checklist (never claim)
原稿用紙換算 · X（旧Twitter）の重み付き文字数 · 全角⇔半角/カタカナ変換 · JSONエラー行の表示 ·
画像・ファイルのBase64/ハッシュ · Shift_JIS/EUC-JP のURLエンコード · スラッグの翻訳・ローマ字化 ·
複数の乱数を重複なしで一括生成 · UUID v7/大文字/波括弧 · 正規表現の置換・キャプチャ表示 ·
JWT署名検証 · CMYK・色名・カラーピッカー · 短縮URLの展開 · 全角ローマ数字（Ⅻ）入力 ·
小数・文字の進数変換 · 素因数分解 · 中央値・加重平均 · 休憩時間の控除 · 漢数字→数字の逆変換 ·
段落を残す改行削除 · 文字単位の差分ハイライト · 面積・圧力・速度・尺貫法 · 営業日・祝日計算 ·
和暦表示 · ロゴ入り・カラーQRコード · 固定リスト以外の都市（13の選択肢のみ）.
Always true and worth saying: 無料 · 登録不要 · ブラウザ内で処理 · データはアップロード（送信）されない.

---

## 7. Shared-infrastructure notes (for the orchestrator; do not edit these files)
- Shared ui key collisions: `"Whole number"` is both the visible 整数 label (prime, number-to-words)
  and the percentage calculator's sr-only 「全体の数」; `"From"` is 変換元 (unit, time zone) and
  the percentage-change 「変化前」. Use 整数 / 変換元 (visible meaning wins). `runtime.js` relabels the two
  percentage fields in the browser (変化前 / sr-only 全体の数) until `src/template.mjs` gets its own keys.
- No NFKC before parsing in `src/app.js`: `#date-offset` (`Number(...)`), `#timestamp-unix`
  (`Number(raw)`), `parseBaseInteger` (base converter), `romanToNumber` (Roman input); `#words-number`
  does NFKC but does not read the IME ー or U+2212 − as minus. Worked around in `runtime.js` (capture-phase
  click normalizer, see §5.3); delete that block once app.js normalizes these inputs itself.
- `setupDateCalculator`: `Number('') === 0`, so an empty day count returns the base date with 「日付を計算しました。」.
- `getTextStats` counts UTF-16 code units: 𠮷 and emoji count as 2 文字 (e.g. 「𠮷野家で牛丼を食べた😀」 shows 13, not 11).
- iOS numeric/decimal keypads have no minus key: negative values in unit-input, random-min/max and percent-old/new
  (and #words-number, left numeric because 漢数字 users mostly type positive amounts) cannot be typed on iPhone.
- Password 「紛らわしい文字を除く」 is a no-op: the default sets already omit I, l, 1, O, 0.
- Average calculator splits 1,234 into 1 and 234 (the ja FAQ warns to remove 桁区切り first).

---

## 8. Sources
- Google Japan autocomplete (suggestqueries, hl=ja, gl=jp), queried 2026-09-29 for every tool.
- Word counter SERP: sundryst.com/convenienttool/strcount.html, luft.co.jp/cgi/str_counter.php, robse.jp/tools/count/, tools.bridge-coding.com/wordcounter/
- Case: rakkokeyword.com/techo/tool-case-converter/, benricho.org/moji_conv/Upper_Lower.html
- Duplicates: develop.tools/text-duplication/, temototool.com/tools/text-dedupe/
- JSON: tools.value-domain.com/json-formatter, toolkobo.jp/jsonFormatter/, tools.studioasari.co.jp/web-dev/jsonformatter
- Base64/URL: develop.tools/base64-encoding/, en-pc.jp/tech/base64/, tagindex.com/tool/url.html, rakkokeyword.com/techo/tool-url-encode-decode/
- Slug: tools.studioasari.co.jp/web-dev/slugify, open-cage.com/automatic-create-url-slug/
- Percent: rakko.tools/ja/tools/percent-calculator, rakkokeyword.com/techo/tool-percent-calc/
- Password: rakkoserver.com/plus/tool-password-generator/, luft.co.jp/cgi/randam.php
- UNIX time: tools.value-domain.com/unixtime, dataegg.co.jp/tools/unixtime/
- HTML escape: peko-step.com/tool/escphtml.html, develop.tools/html-entity/
- CSV/JSON: site24x7.com/ja/tools/csv-to-json.html, web-toolbox.dev/tools/csv-to-json
- Random: rakkokeyword.com/techo/tool-random-number/, calc-site.com/randoms/integral
- UUID: rakkokeyword.com/techo/tool-uuid-generator/
- Hash: rakko.tools/en/tools/hash-generator, dev-dojo.jp/tools/calculator/hash/
- Regex: rakkokeyword.com/techo/tool-regex-checker/, tech.softel.co.jp/labs/tools/regex/
- JWT: rakkokeyword.com/techo/tool-jwt-decoder-encoder/, jwt.io/ja
- Color: pote-chil.com/tools/color-converter, dataegg.co.jp/tools/color/
- URL parser: insightbase.jp/tools/url-parameter-checker, tools.studioasari.co.jp/web-dev/urlparams
- Roman: benricho.org/moji_conv/11.html, tools.humanity-japan.jp/roman/
- Bases: e-words.jp/p/r-radixconverter.html, peko-step.com/tool/nsin.html
- Prime: tools.m-bsys.com/calculators/prime_number.php, xenuto.com/tools/prime-checker/
- Average: calc-site.com/averages/average, keisan.site/exec/system/1309168446
- Ratio: benricho.org/calculate/Hireishiki-RatioCalc/, rakkokeyword.com/techo/tool-ratio-calculator/
- Duration: calc-site.com/times/calc_elapsed_time, luft.co.jp/cgi/days-time.php
- 漢数字/大字: ja.wikipedia.org/wiki/漢数字, ja.wikipedia.org/wiki/大字_(数字), amix-design.com/tl/tool-t-kansuji/, tools.humanity-japan.jp/kanji-num/, crd.ndl.go.jp (レファレンス協同データベース 大字)
- Line breaks: rakkokeyword.com/techo/tool-remove-space/, toolkitslab.com/tools/remove-newline
- Diff: difff.jp, cryptul.co.jp/tools/text-diff
- Units: dev-dojo.jp/tools/calculator/unit/, noveblo.com/unit-converter/
- Dates: rakkokeyword.com/techo/tool-date-calculator/, keisan-navi.jp/date/nissu/
- QR: cman.jp/QRcode/, denso-wave.com/ja/adcd/support/faq/trademark/comment/, qrcode.com/faq.html
- Time zones: jisakeisan.com, time-j.net/worldtime/country/us, hanacell.com/users/life-in-america/usa-time-difference/
- Reading speed: speed-reading.jp (読書速度の平均), pc-sokudoku.co.jp/kouza/kokugo/kyohon29.html

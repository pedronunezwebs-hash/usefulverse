// 日本語 — core strings: site meta, page templates, home/shared UI, shared runtime messages and runtime templates.
// Keys are the English source strings and must stay unchanged; translate the values only.
export const meta = {
  "code": "ja",
  "name": "日本語",
  "prefix": "/ja",
  "tag": "ja-JP",
  "homeTitle": "登録不要・無料のオンライン便利ツール集 | UsefulVerse",
  "homeDescription": "文字数カウント、JSON整形、パスワード生成、QRコード作成など30種類以上の便利ツールを無料で。登録不要で、データはアップロードせずブラウザ内で処理します。",
  "homeLabel": "ホーム",
  "homeMarker": "ツール",
  "keepEnglish": [],
  // Reviewed (GLOSSARY §2, §5): ja-JP uses "." decimals (no commaDecimal); text inputs accept IME 全角数字;
  // Intl.Segmenter for 単語数; reading time by characters at 500字/分 (JP norm 400〜600); Tokyo → New York
  // is the top 時差計算 query.
  "runtime": {
    "textNumberInputs": true,
    "wordSegmentation": true,
    "readingUnit": "characters",
    "readingRate": 500,
    "longDates": true,
    "timeZones": {
      "from": "Asia/Tokyo",
      "to": "America/New_York"
    }
  }
};

export const page = {
  "faqHow": "{name}の使い方は？",
  "privacyQuestion": "入力したデータはサーバーに送信されますか？",
  "privacyAnswer": "いいえ。処理はすべてブラウザ内で行われ、データがアップロードされることはありません。",
  "about": "{title}について",
  "madeSimple": "{title}をもっと手軽に。",
  "categoryTool": "{category}ツール",
  "workspace": "{title}の作業エリア",
};

// ja-JP has a single plural category ("other"), so plural templates carry only that form.
export const templates = {
  "reading.minutes": "{count}分",
  "summary": "単語数：{words}\n文字数：{characters}\n文字数（空白・改行を除く）：{noSpaces}\n行数：{lines}\n読了時間：約{reading}分",
  "dedupe.kept": {"other":"重複を除いた{count}行を残しました。"},
  "percent.of": "{base}の{percent}% = {result}",
  "percent.share": "{part}は{whole}の{result}%",
  "percent.change": "{from}から{to}への増減率 = {change}%",
  "rows.converted": {"other":"{count}行を変換しました。"},
  "uuid.generated": {"other":"ブラウザ内でUUIDを{count}件生成しました。"},
  "regex.matches": {"other":"{count}件マッチしました。"},
  "duration.exact": "{days}日{hours}時間{minutes}分{seconds}秒",
  "diff.found": {"other":"{count}行に違いがあります。"},
  "diff.line": "{line}行目：",
  "diff.empty": "（空行）",
  "date.days": {"other":"{count}日"},
  "url.none": "（なし）",
  "timestamp.local": "ローカル時刻：{value}",
  "timestamp.seconds": "秒：{value}",
  "timestamp.milliseconds": "ミリ秒：{value}",
};

export const ui = {
  "UsefulVerse home": "UsefulVerseホーム",
  "Main navigation": "メインナビゲーション",
  "Tools": "ツール",
  "How it works": "使い方",
  "Find a tool": "ツールを探す",
  "Language": "言語",
  "A useful place on the internet": "ネットの、ちょっと便利な場所",
  "Do the small things": "ちょっとした作業を、",
  "faster.": "もっと速く。",
  "Simple browser tools for text, data and everyday work. No account. No upload. Just open a tool and get it done.": "テキストやデータ、日々の作業に使えるシンプルなブラウザツール。登録不要、アップロード不要。開けばすぐに使えます。",
  "Explore tools": "ツールを見る",
  "UsefulVerse principles": "UsefulVerseの特長",
  "Fast by default": "いつでも高速",
  "Private by design": "プライバシー重視",
  "Free to use": "無料で使える",
  "The toolbox": "ツール一覧",
  "Find the right tool.": "ぴったりのツールを見つけよう。",
  "Search tools": "ツールを検索",
  "Tool categories": "ツールのカテゴリ",
  "All": "すべて",
  "Writing": "文章作成",
  "Text": "テキスト",
  "Developer": "開発者向け",
  "SEO": "SEO",
  "Everyday": "日常・計算",
  "Privacy": "セキュリティ",
  "Data": "データ",
  "Design": "デザイン",
  "Open tool": "ツールを開く",
  "No tools match that search yet. Try another word.": "該当するツールが見つかりません。別のキーワードで検索してください。",
  "Why UsefulVerse": "UsefulVerseが選ばれる理由",
  "Small tools.": "小さなツールで、",
  "Clear answers.": "明快な答えを。",
  "Open a tool": "ツールを開く",
  "Each tool has one clear job. You can start in seconds.": "どのツールも役割はひとつ。数秒で使い始められます。",
  "Work privately": "プライバシーを守って作業",
  "Your text stays in your browser for browser-first tools.": "ブラウザ完結型のツールでは、テキストはブラウザの外に出ません。",
  "Take the result": "結果を活用",
  "Copy it or use it where you need it next.": "コピーして、次に使う場所へそのまま貼り付けられます。",
  "Simple tools that respect your time and your files.": "時間もファイルも大切にする、シンプルなツール。",
  "All tools": "すべてのツール",
  "Privacy first": "プライバシー優先",
  "Breadcrumb": "パンくずリスト",
  "Runs in your browser. No upload.": "ブラウザ内で動作。アップロード不要。",
  "Clear": "クリア",
  "About this tool": "このツールについて",
  "Common questions": "よくある質問",
  "Keep going": "次はこちら",
  "More useful tools": "ほかの便利ツール",
  "Browse all tools": "すべてのツールを見る",
  "Result": "結果",
  "Copy result": "結果をコピー",
  // Shared key: visible label in prime/number-to-words (整数) and sr-only in the percentage calculator.
  "Whole number": "整数",
  // Shared key: unit and time zone converters (変換元) and the percentage-change "From".
  "From": "変換元",
  "Minimum": "最小値",
  "Maximum": "最大値",
};

export const runtimeMessages = {
  "There is nothing to copy yet.": "コピーする内容がまだありません。",
  "Copied to your clipboard.": "クリップボードにコピーしました。",
  "Copy was blocked. Select the result and copy it manually.": "コピーできませんでした。結果を選択して手動でコピーしてください。",
  "Choose a valid date and time.": "正しい日時を選択してください。",
  "Number converted locally.": "ブラウザ内で変換しました。",
};

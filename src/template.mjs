import { tools } from './catalog.mjs';
import { seo } from './seo.mjs';
import { localeEntries, localePath, locales, packs, translateStaticHtml, ui } from './locales.mjs';

const fill = (template, values) => template.replace(/\{(\w+)\}/gu, (match, name) => values[name] ?? match);

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const toolUrl = (id, language = 'en') => localePath(language, id);

const icon = (tool) => `<span class="tool-icon tool-icon--${tool.accent}" aria-hidden="true">${escapeHtml(tool.icon)}</span>`;

export function toolCard(tool, language = 'en') {
  return `<a class="tool-card" href="${toolUrl(tool.id, language)}" data-category="${escapeHtml(tool.category)}" data-search="${escapeHtml(`${tool.title} ${tool.description} ${tool.keywords}`)}">
    <div class="tool-card__top">${icon(tool)}<span class="tool-card__category">${escapeHtml(tool.category)}</span></div>
    <h3>${escapeHtml(tool.title)}</h3>
    <p>${escapeHtml(tool.description)}</p>
    <span class="tool-card__link">Open tool <span aria-hidden="true">↗</span></span>
  </a>`;
}

function toolMarkup(id) {
  const common = `<div class="tool-workspace" data-tool="${id}">`;
  const close = `</div>`;
  if (id === 'word-counter') return `${common}
    <label class="sr-only" for="tool-input">Text to count</label>
    <textarea id="tool-input" class="tool-textarea tool-textarea--large" placeholder="Start typing or paste your text here..."></textarea>
    <div class="metric-grid" aria-live="polite">
      <div class="metric"><strong id="metric-words">0</strong><span>Words</span></div>
      <div class="metric"><strong id="metric-characters">0</strong><span>Characters</span></div>
      <div class="metric"><strong id="metric-characters-no-spaces">0</strong><span>Without spaces</span></div>
      <div class="metric"><strong id="metric-lines">0</strong><span>Lines</span></div>
      <div class="metric"><strong id="metric-reading-time">0 min</strong><span>Reading time</span></div>
    </div>
    <div class="tool-actions"><button class="button button--primary" data-action="copy-summary">Copy summary</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Your counts update as you type.</p>
  ${close}`;
  if (id === 'text-case-converter') return `${common}
    <label class="sr-only" for="tool-input">Text to convert</label>
    <textarea id="tool-input" class="tool-textarea tool-textarea--large" placeholder="Paste text here..."></textarea>
    <div class="button-row" role="group" aria-label="Text case options">
      <button class="button button--primary" data-case="upper">UPPERCASE</button><button class="button button--ghost" data-case="lower">lowercase</button><button class="button button--ghost" data-case="sentence">Sentence case</button><button class="button button--ghost" data-case="title">Title Case</button>
    </div>
    <label class="field-label" for="tool-output">Result</label>
    <textarea id="tool-output" class="tool-textarea" readonly placeholder="Your converted text will appear here..."></textarea>
    <div class="tool-actions"><button class="button button--primary" data-action="copy-output">Copy result</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Choose a format to create your result.</p>
  ${close}`;
  if (id === 'remove-duplicate-lines') return `${common}
    <label class="sr-only" for="tool-input">List to clean</label>
    <textarea id="tool-input" class="tool-textarea tool-textarea--large" placeholder="Paste one item per line..."></textarea>
    <div class="option-row"><label><input type="checkbox" id="trim-lines" checked> Trim spaces</label><label><input type="checkbox" id="ignore-case"> Ignore case</label><label><input type="checkbox" id="remove-empty" checked> Remove empty lines</label></div>
    <div class="tool-actions"><button class="button button--primary" data-action="dedupe">Remove duplicates</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Your cleaned list will appear here.</p>
    <label class="field-label" for="tool-output">Clean list</label>
    <textarea id="tool-output" class="tool-textarea tool-textarea--large" readonly placeholder="Cleaned lines..."></textarea>
    <div class="tool-actions"><button class="button button--primary" data-action="copy-output">Copy result</button></div>
  ${close}`;
  if (id === 'json-formatter') return `${common}
    <label class="sr-only" for="tool-input">JSON to format</label>
    <textarea id="tool-input" class="tool-textarea tool-textarea--code" spellcheck="false" placeholder='{"name":"UsefulVerse","fast":true}'></textarea>
    <div class="tool-actions"><button class="button button--primary" data-action="format-json">Format JSON</button><button class="button button--ghost" data-action="minify-json">Minify</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Paste JSON to validate it.</p>
    <label class="field-label" for="tool-output">Result</label>
    <textarea id="tool-output" class="tool-textarea tool-textarea--code tool-textarea--large" readonly spellcheck="false" placeholder="Formatted JSON..."></textarea>
    <div class="tool-actions"><button class="button button--primary" data-action="copy-output">Copy result</button></div>
  ${close}`;
  if (id === 'base64-encoder-decoder') return `${common}
    <div class="segmented" role="group" aria-label="Base64 direction"><button class="segment is-active" data-mode="encode">Encode to Base64</button><button class="segment" data-mode="decode">Decode Base64</button></div>
    <label class="sr-only" for="tool-input">Value to convert</label>
    <textarea id="tool-input" class="tool-textarea tool-textarea--large" placeholder="Text to encode..."></textarea>
    <div class="tool-actions"><button class="button button--primary" data-action="convert-base64">Convert</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Runs only in your browser.</p>
    <label class="field-label" for="tool-output">Result</label>
    <textarea id="tool-output" class="tool-textarea tool-textarea--large" readonly placeholder="Result..."></textarea>
    <div class="tool-actions"><button class="button button--primary" data-action="copy-output">Copy result</button></div>
  ${close}`;
  if (id === 'url-encoder-decoder') return `${common}
    <div class="segmented" role="group" aria-label="URL direction"><button class="segment is-active" data-mode="encode">Encode URL text</button><button class="segment" data-mode="decode">Decode URL text</button></div>
    <label class="sr-only" for="tool-input">URL text to convert</label>
    <textarea id="tool-input" class="tool-textarea tool-textarea--large" placeholder="https://example.com/search?q=hello world"></textarea>
    <div class="tool-actions"><button class="button button--primary" data-action="convert-url">Convert</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Use encode for text that must travel safely inside a URL.</p>
    <label class="field-label" for="tool-output">Result</label>
    <textarea id="tool-output" class="tool-textarea tool-textarea--large" readonly placeholder="Result..."></textarea>
    <div class="tool-actions"><button class="button button--primary" data-action="copy-output">Copy result</button></div>
  ${close}`;
  if (id === 'text-to-slug') return `${common}
    <label class="field-label" for="tool-input">Title or phrase</label>
    <input id="tool-input" class="tool-input" type="text" placeholder="How to write a great blog post">
    <div class="option-row"><label><input type="checkbox" id="keep-numbers" checked> Keep numbers</label><label><input type="checkbox" id="preserve-language"> Keep non-Latin letters</label></div>
    <label class="field-label" for="tool-output">URL slug</label>
    <input id="tool-output" class="tool-input tool-input--result" type="text" readonly placeholder="your-clean-url-slug">
    <div class="tool-actions"><button class="button button--primary" data-action="make-slug">Create slug</button><button class="button button--ghost" data-action="copy-output">Copy slug</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">A good slug is short, clear and easy to read.</p>
  ${close}`;
  if (id === 'percentage-calculator') return `${common}
    <div class="calculator-grid">
      <section class="calculator-card" aria-labelledby="percentage-of-title"><h2 id="percentage-of-title">What is a percentage of a number?</h2><div class="inline-fields"><label for="percent-value">Percent <input id="percent-value" class="tool-input tool-input--small" type="number" inputmode="decimal" placeholder="15"></label><span aria-hidden="true">% of</span><label for="percent-base"><span class="sr-only">Base number</span><input id="percent-base" class="tool-input tool-input--small" type="number" inputmode="decimal" placeholder="200"></label></div><output class="calculation-result" id="percent-result" aria-live="polite">—</output></section>
      <section class="calculator-card" aria-labelledby="what-percent-title"><h2 id="what-percent-title">What percent is one number of another?</h2><div class="inline-fields"><label for="percent-part">Part <input id="percent-part" class="tool-input tool-input--small" type="number" inputmode="decimal" placeholder="30"></label><span aria-hidden="true">of</span><label for="percent-whole"><span class="sr-only">Whole number</span><input id="percent-whole" class="tool-input tool-input--small" type="number" inputmode="decimal" placeholder="200"></label></div><output class="calculation-result" id="what-percent-result" aria-live="polite">—</output></section>
      <section class="calculator-card" aria-labelledby="change-title"><h2 id="change-title">What is the percentage change?</h2><div class="inline-fields"><label for="percent-old">From <input id="percent-old" class="tool-input tool-input--small" type="number" inputmode="decimal" placeholder="100"></label><span aria-hidden="true">to</span><label for="percent-new"><span class="sr-only">New number</span><input id="percent-new" class="tool-input tool-input--small" type="number" inputmode="decimal" placeholder="125"></label></div><output class="calculation-result" id="change-result" aria-live="polite">—</output></section>
    </div>
    <div class="tool-actions"><button class="button button--primary" data-action="calculate-percentage">Calculate</button><button class="button button--ghost" data-action="copy-summary">Copy answers</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Fill in any calculation you need.</p>
  ${close}`;
  if (id === 'password-generator') return `${common}
    <div class="password-generator">
      <div class="password-output"><label class="field-label" for="password-output">Your password</label><input id="password-output" class="tool-input tool-input--result" type="text" readonly placeholder="Click Generate password"><span class="password-strength" id="password-strength" aria-live="polite"></span></div>
      <div class="password-controls"><label class="field-label" for="password-length">Length: <span id="password-length-value">16</span></label><input id="password-length" type="range" min="8" max="64" value="16"><div class="option-row"><label><input type="checkbox" id="include-uppercase" checked> Uppercase</label><label><input type="checkbox" id="include-lowercase" checked> Lowercase</label><label><input type="checkbox" id="include-numbers" checked> Numbers</label><label><input type="checkbox" id="include-symbols" checked> Symbols</label><label><input type="checkbox" id="exclude-ambiguous"> Exclude similar characters</label></div></div>
    </div>
    <div class="tool-actions"><button class="button button--primary" data-action="generate-password">Generate password</button><button class="button button--ghost" data-action="copy-output">Copy password</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Generated locally with your browser's secure random generator.</p>
  ${close}`;
  if (id === 'timestamp-converter') return `${common}
    <div class="converter-grid">
      <section class="calculator-card" aria-labelledby="unix-title"><h2 id="unix-title">Unix timestamp to date</h2><label class="field-label" for="timestamp-unix">Timestamp in seconds or milliseconds</label><input id="timestamp-unix" class="tool-input" type="text" inputmode="numeric" placeholder="1710000000"><div class="tool-actions"><button class="button button--primary" data-action="from-timestamp">Convert to date</button></div><div class="conversion-results"><p><span>UTC</span><output id="timestamp-utc">—</output></p><p><span>Your local time</span><output id="timestamp-local">—</output></p></div></section>
      <section class="calculator-card" aria-labelledby="date-title"><h2 id="date-title">Date to Unix timestamp</h2><label class="field-label" for="timestamp-date">Date and time in your time zone</label><input id="timestamp-date" class="tool-input" type="datetime-local"><div class="tool-actions"><button class="button button--primary" data-action="to-timestamp">Convert to timestamp</button></div><div class="conversion-results"><p><span>Seconds</span><output id="timestamp-seconds">—</output></p><p><span>Milliseconds</span><output id="timestamp-milliseconds">—</output></p></div></section>
    </div>
    <div class="tool-actions"><button class="button button--ghost" data-action="copy-summary">Copy result</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Your dates stay in this browser.</p>
  ${close}`;
  if (id === 'html-entity-encoder-decoder') return `${common}
    <div class="segmented" role="group" aria-label="HTML entity direction"><button class="segment is-active" data-mode="encode">Encode HTML</button><button class="segment" data-mode="decode">Decode HTML</button></div>
    <label class="sr-only" for="tool-input">Text to convert</label>
    <textarea id="tool-input" class="tool-textarea tool-textarea--large" spellcheck="false" placeholder="<p>Use & symbols safely</p>"></textarea>
    <div class="tool-actions"><button class="button button--primary" data-action="convert-html-entity">Convert</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Runs only in your browser.</p>
    <label class="field-label" for="tool-output">Result</label>
    <textarea id="tool-output" class="tool-textarea tool-textarea--large" readonly spellcheck="false" placeholder="Result..."></textarea>
    <div class="tool-actions"><button class="button button--primary" data-action="copy-output">Copy result</button></div>
  ${close}`;
  if (id === 'csv-to-json') return `${common}
    <label class="sr-only" for="tool-input">CSV data</label>
    <textarea id="tool-input" class="tool-textarea tool-textarea--code tool-textarea--large" spellcheck="false" placeholder="name,age\nAda,36\nLinus,55"></textarea>
    <div class="tool-actions"><button class="button button--primary" data-action="csv-to-json">Convert to JSON</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">The first row becomes the JSON keys.</p>
    <label class="field-label" for="tool-output">JSON result</label>
    <textarea id="tool-output" class="tool-textarea tool-textarea--code tool-textarea--large" readonly spellcheck="false" placeholder="JSON result..."></textarea>
    <div class="tool-actions"><button class="button button--primary" data-action="copy-output">Copy result</button></div>
  ${close}`;
  if (id === 'json-to-csv') return `${common}
    <label class="sr-only" for="tool-input">JSON array</label>
    <textarea id="tool-input" class="tool-textarea tool-textarea--code tool-textarea--large" spellcheck="false" placeholder='[{"name":"Ada","age":36}]'></textarea>
    <div class="tool-actions"><button class="button button--primary" data-action="json-to-csv">Convert to CSV</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Use an array of JSON objects with a shared set of keys.</p>
    <label class="field-label" for="tool-output">CSV result</label>
    <textarea id="tool-output" class="tool-textarea tool-textarea--code tool-textarea--large" readonly spellcheck="false" placeholder="CSV result..."></textarea>
    <div class="tool-actions"><button class="button button--primary" data-action="copy-output">Copy result</button></div>
  ${close}`;
  if (id === 'random-number-generator') return `${common}
    <div class="random-number-form"><label class="field-label" for="random-min">Minimum</label><input id="random-min" class="tool-input" type="number" inputmode="decimal" value="1"><label class="field-label" for="random-max">Maximum</label><input id="random-max" class="tool-input" type="number" inputmode="decimal" value="100"><label class="option-row"><input id="random-integer" type="checkbox" checked> Whole number only</label></div>
    <div class="random-result" id="random-result" aria-live="polite">—</div>
    <div class="tool-actions"><button class="button button--primary" data-action="generate-number">Generate number</button><button class="button button--ghost" data-action="copy-output">Copy result</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Uses your browser’s secure random source.</p>
  ${close}`;
  if (id === 'uuid-generator') return `${common}
    <div class="inline-fields"><label for="uuid-count">How many? <input id="uuid-count" class="tool-input tool-input--small" type="number" min="1" max="100" value="5" inputmode="numeric"></label><span>UUID v4 identifiers</span></div>
    <div class="tool-actions"><button class="button button--primary" data-action="generate-uuids">Generate UUIDs</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Generated locally with your browser’s secure random source.</p>
    <label class="field-label" for="tool-output">Result</label>
    <textarea id="tool-output" class="tool-textarea tool-textarea--code tool-textarea--large" readonly spellcheck="false" placeholder="Your UUIDs will appear here..."></textarea>
    <div class="tool-actions"><button class="button button--primary" data-action="copy-output">Copy UUIDs</button></div>
  ${close}`;
  if (id === 'sha256-hash-generator') return `${common}
    <label class="sr-only" for="tool-input">Text to hash</label>
    <textarea id="tool-input" class="tool-textarea tool-textarea--large" spellcheck="false" placeholder="Text to hash..."></textarea>
    <div class="tool-actions"><button class="button button--primary" data-action="hash-sha256">Create SHA-256 hash</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">The text stays in this browser.</p>
    <label class="field-label" for="tool-output">SHA-256 hexadecimal digest</label>
    <textarea id="tool-output" class="tool-textarea tool-textarea--code" readonly spellcheck="false" placeholder="Your hash will appear here..."></textarea>
    <div class="tool-actions"><button class="button button--primary" data-action="copy-output">Copy hash</button></div>
  ${close}`;
  if (id === 'regex-tester') return `${common}
    <div class="regex-controls"><label class="field-label" for="regex-pattern">Pattern <input id="regex-pattern" class="tool-input" type="text" spellcheck="false" placeholder="\\bUseful\\w*\\b"></label><label class="field-label" for="regex-flags">Flags <input id="regex-flags" class="tool-input" type="text" spellcheck="false" value="gi" placeholder="gi"></label></div>
    <label class="field-label" for="regex-test">Text to test</label><textarea id="regex-test" class="tool-textarea tool-textarea--large" placeholder="Paste sample text here..."></textarea>
    <div class="tool-actions"><button class="button button--primary" data-action="test-regex">Test expression</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Regular expressions run locally in your browser.</p>
    <div class="result-block"><div class="result-block__heading"><span>Matches</span><strong id="regex-match-count">0</strong></div><pre id="regex-output" class="result-pre">No matches yet.</pre></div>
  ${close}`;
  if (id === 'jwt-decoder') return `${common}
    <label class="sr-only" for="tool-input">JSON Web Token</label>
    <textarea id="tool-input" class="tool-textarea tool-textarea--code tool-textarea--large" spellcheck="false" placeholder="Paste a JWT here..."></textarea>
    <div class="tool-actions"><button class="button button--primary" data-action="decode-jwt">Decode token</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Decoding does not verify a token or its signature.</p>
    <div class="result-grid"><section class="result-block"><div class="result-block__heading"><span>Header</span></div><pre id="jwt-header" class="result-pre">—</pre></section><section class="result-block"><div class="result-block__heading"><span>Payload</span></div><pre id="jwt-payload" class="result-pre">—</pre></section></div>
  ${close}`;
  if (id === 'color-converter') return `${common}
    <div class="color-input-row"><label class="field-label" for="color-value">Color value <input id="color-value" class="tool-input" type="text" value="#4D6BFF" spellcheck="false" placeholder="#4D6BFF, rgb(77,107,255) or hsl(231,100%,67%)"></label><div id="color-preview" class="color-preview" aria-label="Color preview"></div></div>
    <div class="tool-actions"><button class="button button--primary" data-action="convert-color">Convert color</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Supports HEX, RGB and HSL colors.</p>
    <div class="result-grid result-grid--three"><div class="result-block"><div class="result-block__heading"><span>HEX</span></div><output id="color-hex">—</output></div><div class="result-block"><div class="result-block__heading"><span>RGB</span></div><output id="color-rgb">—</output></div><div class="result-block"><div class="result-block__heading"><span>HSL</span></div><output id="color-hsl">—</output></div></div>
  ${close}`;
  if (id === 'url-parser') return `${common}
    <label class="sr-only" for="tool-input">URL to parse</label>
    <input id="tool-input" class="tool-input" type="url" placeholder="https://example.com/search?q=useful&lang=en">
    <div class="tool-actions"><button class="button button--primary" data-action="parse-url">Parse URL</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">The URL is analyzed locally.</p>
    <div class="result-block"><div class="result-block__heading"><span>URL components</span></div><dl class="url-results"><div><dt>Protocol</dt><dd id="url-protocol">—</dd></div><div><dt>Host</dt><dd id="url-host">—</dd></div><div><dt>Path</dt><dd id="url-path">—</dd></div><div><dt>Query</dt><dd id="url-query">—</dd></div><div><dt>Hash</dt><dd id="url-hash">—</dd></div></dl></div>
    <div class="result-block"><div class="result-block__heading"><span>Query parameters</span></div><pre id="url-params" class="result-pre">—</pre></div>
  ${close}`;
  if (id === 'roman-numeral-converter') return `${common}
    <div class="converter-grid"><section class="calculator-card"><h2>Number to Roman numeral</h2><label class="field-label" for="roman-number">Whole number from 1 to 3,999</label><input id="roman-number" class="tool-input" type="number" min="1" max="3999" placeholder="2026"><div class="tool-actions"><button class="button button--primary" data-action="number-to-roman">Convert to Roman</button></div><output class="calculation-result" id="roman-output">—</output></section><section class="calculator-card"><h2>Roman numeral to number</h2><label class="field-label" for="roman-input">Roman numeral</label><input id="roman-input" class="tool-input" type="text" spellcheck="false" placeholder="MMXXVI"><div class="tool-actions"><button class="button button--primary" data-action="roman-to-number">Convert to number</button></div><output class="calculation-result" id="number-output">—</output></section></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Conversions run only in your browser.</p>
  ${close}`;
  if (id === 'binary-converter') return `${common}
    <div class="base-converter"><label class="field-label" for="binary-from">From base <select id="binary-from" class="tool-input"><option value="10">Decimal (10)</option><option value="2">Binary (2)</option><option value="16">Hexadecimal (16)</option><option value="8">Octal (8)</option></select></label><span class="base-arrow" aria-hidden="true">→</span><label class="field-label" for="binary-to">To base <select id="binary-to" class="tool-input"><option value="2">Binary (2)</option><option value="10">Decimal (10)</option><option value="16">Hexadecimal (16)</option><option value="8">Octal (8)</option></select></label></div>
    <label class="field-label" for="binary-input">Integer to convert</label><input id="binary-input" class="tool-input" type="text" spellcheck="false" placeholder="255"><div class="tool-actions"><button class="button button--primary" data-action="convert-binary">Convert number</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Supports whole numbers in bases 2, 8, 10 and 16.</p><div class="result-block"><div class="result-block__heading"><span>Result</span></div><output id="binary-output" class="result-output">—</output></div>
  ${close}`;
  if (id === 'prime-number-checker') return `${common}
    <label class="field-label" for="prime-input">Whole number</label><input id="prime-input" class="tool-input" type="number" min="0" max="1000000000000" inputmode="numeric" placeholder="97"><div class="tool-actions"><button class="button button--primary" data-action="check-prime">Check number</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Checks integers up to one trillion locally.</p><div class="random-result prime-result" id="prime-output" aria-live="polite">—</div>
  ${close}`;
  if (id === 'average-calculator') return `${common}
    <label class="sr-only" for="average-input">Numbers to average</label><textarea id="average-input" class="tool-textarea tool-textarea--large" placeholder="10\n20\n30\n40"></textarea><div class="tool-actions"><button class="button button--primary" data-action="calculate-average">Calculate average</button><button class="button button--ghost" data-action="clear">Clear</button></div><p class="tool-status" id="tool-status" aria-live="polite">Separate numbers with spaces, commas or new lines.</p>
    <div class="result-grid result-grid--three"><div class="result-block"><div class="result-block__heading"><span>Average</span></div><output id="average-result">—</output></div><div class="result-block"><div class="result-block__heading"><span>Sum</span></div><output id="average-sum">—</output></div><div class="result-block"><div class="result-block__heading"><span>Count</span></div><output id="average-count">—</output></div><div class="result-block"><div class="result-block__heading"><span>Minimum</span></div><output id="average-min">—</output></div><div class="result-block"><div class="result-block__heading"><span>Maximum</span></div><output id="average-max">—</output></div></div>
  ${close}`;
  if (id === 'ratio-proportion-calculator') return `${common}
    <div class="ratio-equation"><label for="ratio-a"><span>A</span><input id="ratio-a" class="tool-input tool-input--small" type="number" inputmode="decimal" placeholder="2"></label><strong>:</strong><label for="ratio-b"><span>B</span><input id="ratio-b" class="tool-input tool-input--small" type="number" inputmode="decimal" placeholder="3"></label><strong>=</strong><label for="ratio-c"><span>C</span><input id="ratio-c" class="tool-input tool-input--small" type="number" inputmode="decimal" placeholder="8"></label><strong>:</strong><label for="ratio-x"><span>X</span><input id="ratio-x" class="tool-input tool-input--small" type="text" readonly placeholder="?"></label></div><div class="tool-actions"><button class="button button--primary" data-action="solve-ratio">Solve proportion</button><button class="button button--ghost" data-action="clear">Clear</button></div><p class="tool-status" id="tool-status" aria-live="polite">Solve A:B = C:X, then see the simplified A:B ratio.</p><div class="result-grid"><div class="result-block"><div class="result-block__heading"><span>Missing value X</span></div><output id="ratio-result">—</output></div><div class="result-block"><div class="result-block__heading"><span>Simplified A:B</span></div><output id="ratio-simplified">—</output></div></div>
  ${close}`;
  if (id === 'time-duration-calculator') return `${common}
    <div class="converter-grid"><section class="calculator-card"><h2>Start</h2><label class="field-label" for="duration-start">Date and time</label><input id="duration-start" class="tool-input" type="datetime-local"></section><section class="calculator-card"><h2>End</h2><label class="field-label" for="duration-end">Date and time</label><input id="duration-end" class="tool-input" type="datetime-local"></section></div><div class="tool-actions"><button class="button button--primary" data-action="calculate-duration">Calculate duration</button><button class="button button--ghost" data-action="clear">Clear</button></div><p class="tool-status" id="tool-status" aria-live="polite">Choose a start and end time.</p><div class="result-grid result-grid--three"><div class="result-block"><div class="result-block__heading"><span>Total days</span></div><output id="duration-days">—</output></div><div class="result-block"><div class="result-block__heading"><span>Total hours</span></div><output id="duration-hours">—</output></div><div class="result-block"><div class="result-block__heading"><span>Exact duration</span></div><output id="duration-exact">—</output></div></div>
  ${close}`;
  if (id === 'number-to-words-converter') return `${common}
    <label class="field-label" for="words-number">Whole number</label><input id="words-number" class="tool-input" type="text" inputmode="numeric" placeholder="1234567"><div class="tool-actions"><button class="button button--primary" data-action="number-to-words">Convert to words</button><button class="button button--ghost" data-action="clear">Clear</button></div><p class="tool-status" id="tool-status" aria-live="polite">Supports whole numbers from -999,999,999,999 to 999,999,999,999.</p><label class="field-label" for="words-output">Written number</label><textarea id="words-output" class="tool-textarea" readonly placeholder="One million two hundred..."></textarea><div class="tool-actions"><button class="button button--primary" data-action="copy-output">Copy result</button></div>
  ${close}`;
  if (id === 'remove-line-breaks') return `${common}
    <label class="sr-only" for="tool-input">Text with line breaks</label><textarea id="tool-input" class="tool-textarea tool-textarea--large" placeholder="Paste text with\nbroken lines\nhere..."></textarea><div class="tool-actions"><button class="button button--primary" data-action="join-line-breaks">Join with spaces</button><button class="button button--ghost" data-action="remove-line-breaks">Remove breaks</button><button class="button button--ghost" data-action="clear">Clear</button></div><p class="tool-status" id="tool-status" aria-live="polite">Your text stays in this browser.</p><label class="field-label" for="tool-output">Clean result</label><textarea id="tool-output" class="tool-textarea tool-textarea--large" readonly placeholder="Your clean paragraph will appear here..."></textarea><div class="tool-actions"><button class="button button--primary" data-action="copy-output">Copy result</button></div>
  ${close}`;
  if (id === 'text-diff-checker') return `${common}
    <div class="converter-grid"><section class="calculator-card"><label class="field-label" for="diff-original">Original text</label><textarea id="diff-original" class="tool-textarea" placeholder="Paste the original..."></textarea></section><section class="calculator-card"><label class="field-label" for="diff-changed">Changed text</label><textarea id="diff-changed" class="tool-textarea" placeholder="Paste the changed version..."></textarea></section></div><div class="tool-actions"><button class="button button--primary" data-action="compare-text">Compare text</button><button class="button button--ghost" data-action="clear">Clear</button></div><p class="tool-status" id="tool-status" aria-live="polite">Comparison runs locally line by line.</p><div class="result-block"><div class="result-block__heading"><span>Differences</span><strong id="diff-count">0</strong></div><pre id="diff-output" class="result-pre">No comparison yet.</pre></div>
  ${close}`;
  if (id === 'unit-converter') return `${common}
    <div class="base-converter unit-converter"><label class="field-label" for="unit-category">Type <select id="unit-category" class="tool-input"><option value="length">Length</option><option value="weight">Weight</option><option value="temperature">Temperature</option><option value="volume">Volume</option></select></label><label class="field-label" for="unit-from">From <select id="unit-from" class="tool-input"></select></label><label class="field-label" for="unit-to">To <select id="unit-to" class="tool-input"></select></label></div><label class="field-label" for="unit-input">Value</label><input id="unit-input" class="tool-input" type="number" inputmode="decimal" placeholder="1"><div class="tool-actions"><button class="button button--primary" data-action="convert-unit">Convert unit</button><button class="button button--ghost" data-action="clear">Clear</button></div><p class="tool-status" id="tool-status" aria-live="polite">Conversions run locally in your browser.</p><div class="result-block"><div class="result-block__heading"><span>Result</span></div><output id="unit-output" class="result-output">—</output></div>
  ${close}`;
  if (id === 'date-calculator') return `${common}
    <div class="converter-grid"><section class="calculator-card"><h2>Days between dates</h2><label class="field-label" for="date-start">Start date</label><input id="date-start" class="tool-input" type="date"><label class="field-label" for="date-end">End date</label><input id="date-end" class="tool-input" type="date"><div class="tool-actions"><button class="button button--primary" data-action="date-difference">Calculate difference</button></div><output class="calculation-result" id="date-difference-result">—</output></section><section class="calculator-card"><h2>Add or subtract days</h2><label class="field-label" for="date-base">Starting date</label><input id="date-base" class="tool-input" type="date"><label class="field-label" for="date-offset">Days to add <span class="field-hint">Use a negative number to subtract</span></label><input id="date-offset" class="tool-input" type="number" inputmode="numeric" placeholder="30"><div class="tool-actions"><button class="button button--primary" data-action="date-offset">Calculate date</button></div><output class="calculation-result" id="date-offset-result">—</output></section></div><p class="tool-status" id="tool-status" aria-live="polite">Dates are calculated in your browser.</p>
  ${close}`;
  if (id === 'qr-code-generator') return `${common}
    <label class="field-label" for="qr-input">Link or short text</label><textarea id="qr-input" class="tool-textarea" maxlength="106" placeholder="https://usefulverse.com/tools/qr-code-generator"></textarea>
    <div class="qr-size-control"><label class="field-label" for="qr-size">Size <select id="qr-size" class="tool-input"><option value="256">256 px</option><option value="384" selected>384 px</option><option value="512">512 px</option></select></label></div><p class="qr-color-note">Always black and white for reliable scanning.</p>
    <div class="tool-actions"><button class="button button--primary" data-action="generate-qr">Generate QR code</button><button class="button button--ghost" data-action="clear">Clear</button></div><p class="tool-status" id="tool-status" aria-live="polite">Generated locally in your browser. Nothing is uploaded.</p>
    <div class="qr-result" id="qr-result" hidden><canvas id="qr-canvas" width="384" height="384" aria-label="Generated QR code"></canvas></div><div class="tool-actions"><button class="button button--primary" data-action="download-qr">Download PNG</button></div>
  ${close}`;
  if (id === 'time-zone-converter') return `${common}
    <label class="field-label" for="timezone-date">Date and time</label><input id="timezone-date" class="tool-input" type="datetime-local">
    <div class="converter-grid"><section class="calculator-card"><h2>From</h2><label class="field-label" for="timezone-from">Time zone</label><select id="timezone-from" class="tool-input"><option value="UTC">UTC</option><option value="America/New_York" selected>New York (Eastern)</option><option value="America/Chicago">Chicago (Central)</option><option value="America/Denver">Denver (Mountain)</option><option value="America/Los_Angeles">Los Angeles (Pacific)</option><option value="Europe/London">London</option><option value="Europe/Madrid">Madrid</option><option value="Asia/Kolkata">India (Kolkata)</option><option value="Asia/Jakarta">Jakarta</option><option value="Asia/Ho_Chi_Minh">Ho Chi Minh City</option><option value="Asia/Seoul">Seoul</option><option value="Asia/Tokyo">Tokyo</option><option value="Australia/Sydney">Sydney</option></select><output class="calculation-result" id="timezone-from-result">—</output></section><section class="calculator-card"><h2>To</h2><label class="field-label" for="timezone-to">Time zone</label><select id="timezone-to" class="tool-input"><option value="UTC">UTC</option><option value="America/New_York">New York (Eastern)</option><option value="America/Chicago">Chicago (Central)</option><option value="America/Denver">Denver (Mountain)</option><option value="America/Los_Angeles">Los Angeles (Pacific)</option><option value="Europe/London" selected>London</option><option value="Europe/Madrid">Madrid</option><option value="Asia/Kolkata">India (Kolkata)</option><option value="Asia/Jakarta">Jakarta</option><option value="Asia/Ho_Chi_Minh">Ho Chi Minh City</option><option value="Asia/Seoul">Seoul</option><option value="Asia/Tokyo">Tokyo</option><option value="Australia/Sydney">Sydney</option></select><output class="calculation-result" id="timezone-to-result">—</output></section></div>
    <div class="tool-actions"><button class="button button--primary" data-action="convert-timezone">Convert time</button><button class="button button--ghost" data-action="clear">Clear</button></div><p class="tool-status" id="tool-status" aria-live="polite">Uses your browser’s time zone data, including daylight saving changes.</p>
  ${close}`;
  return `${common}<p>This tool is not available yet.</p>${close}`;
}

export function renderToolPage(tool, assetVersion = '', language = 'en', pageTools = tools) {
  const canonical = `https://usefulverse.com${toolUrl(tool.id, language)}`;
  const faqCopy = {
    es: { how: (name) => `¿Cómo se usa «${name}»?`, privacyQuestion: '¿Se envían mis datos a un servidor?', privacyAnswer: 'No. El procesamiento se realiza en tu navegador y tus datos no se suben.' },
    fr: { how: (name) => `Comment utiliser « ${name} » ?`, privacyQuestion: 'Mes données sont-elles envoyées à un serveur ?', privacyAnswer: 'Non. Le traitement s’effectue dans votre navigateur et vos données ne sont pas envoyées.' },
    pt: { how: (name) => `Como usar ${name}?`, privacyQuestion: 'Meus dados são enviados para algum servidor?', privacyAnswer: 'Não. O processamento acontece no seu navegador, e seus dados não são enviados para um servidor.' },
  };
  const pack = packs[language];
  const seoData = language === 'en'
    ? (seo[tool.id] ?? { title: tool.title, description: `${tool.description} Free, fast and private in your browser.` })
    : pack ? {
      title: pack.seo?.[tool.id]?.title ?? tool.shortTitle,
      description: pack.seo?.[tool.id]?.description ?? tool.description,
      faq: pack.faq?.[tool.id] ?? [
        { question: fill(pack.page.faqHow, { name: tool.shortTitle }), answer: tool.intro },
        { question: pack.page.privacyQuestion, answer: pack.page.privacyAnswer },
      ],
    } : {
      title: tool.shortTitle,
      description: tool.description,
      faq: [
        { question: faqCopy[language].how(tool.shortTitle), answer: tool.intro },
        { question: faqCopy[language].privacyQuestion, answer: faqCopy[language].privacyAnswer },
      ],
    };
  const faq = seoData.faq ?? [];
  const homeHref = localePath(language);
  const alternates = localeEntries.map(({ key, code }) => `<link rel="alternate" hreflang="${code}" href="https://usefulverse.com${localePath(key, tool.id)}">`).join('\n    ');
  const dynamicTranslations = pack ? {
    [`About ${tool.title}.`]: fill(pack.page.about, { title: tool.title }),
    [`${tool.title} made simple.`]: fill(pack.page.madeSimple, { title: tool.title }),
    [`${tool.category} tool`]: fill(pack.page.categoryTool, { category: tool.category }),
    [`${tool.title} workspace`]: fill(pack.page.workspace, { title: tool.title }),
  } : {
    [`${tool.title} workspace`]: { es: `Área de trabajo: ${tool.title}`, fr: `Espace de travail : ${tool.title}`, pt: `Área de trabalho: ${tool.title}` }[language] ?? `${tool.title} workspace`,
    [`About ${tool.title}.`]: language === 'es' ? `Acerca de ${tool.title}.` : language === 'fr' ? `À propos de ${tool.title}.` : `Sobre ${tool.title}.`,
    [`${tool.title} made simple.`]: language === 'es' ? `${tool.title} sin complicaciones.` : language === 'fr' ? `${tool.title} en toute simplicité.` : `${tool.title} sem complicação.`,
    [`${tool.category} tool`]: `${tool.category} · ${ui[language]?.tool ?? 'tool'}`,
  };
  const breadcrumbs = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'UsefulVerse', item: `https://usefulverse.com${homeHref}` },
      { '@type': 'ListItem', position: 2, name: tool.category, item: `https://usefulverse.com${homeHref}#tools` },
      { '@type': 'ListItem', position: 3, name: tool.title, item: canonical },
    ],
  })}</script>`;
  const applicationSchema = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    url: canonical,
    description: seoData.description,
    inLanguage: locales[language]?.code ?? language,
    applicationCategory: tools.find((item) => item.id === tool.id)?.category === 'Developer' ? 'DeveloperApplication' : 'UtilitiesApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  })}</script>`;
  const faqSchema = faq.length ? `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
  })}</script>` : '';
  const faqSection = faq.length ? `<section class="tool-faq" aria-labelledby="faq-title"><div><p class="eyebrow">Common questions</p><h2 id="faq-title">About ${escapeHtml(tool.title)}.</h2></div><div class="faq-list">${faq.map(({ question, answer }) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join('')}</div></section>` : '';
  const rendered = shell({
    title: `${seoData.title} | UsefulVerse`,
    description: seoData.description,
    canonical,
    assetVersion,
    schema: `${applicationSchema}${breadcrumbs}${faqSchema}`,
    body: `<main class="tool-page" data-tool-page="${tool.id}">
      <div class="page-container">
      <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="${homeHref}">UsefulVerse</a><span aria-hidden="true">/</span><a href="${homeHref}#tools">${escapeHtml(tool.category)}</a><span aria-hidden="true">/</span><span>${escapeHtml(tool.title)}</span></nav>
        <div class="tool-page__heading"><div>${icon(tool)}<p class="eyebrow">${escapeHtml(tool.category)} tool</p><h1>${escapeHtml(tool.title)}</h1><p class="tool-lead">${escapeHtml(tool.intro)}</p></div><div class="privacy-note"><span class="privacy-note__dot" aria-hidden="true"></span><span>Runs in your browser. No upload.</span></div></div>
        <section class="tool-panel" aria-label="${escapeHtml(tool.title)} workspace">${toolMarkup(tool.id)}</section>
        <section class="tool-explainer"><div><p class="eyebrow">About this tool</p><h2>${escapeHtml(tool.title)} made simple.</h2></div><p>${escapeHtml(tool.body)}</p></section>
        ${faqSection}
        <section class="related-tools"><div class="section-heading"><div><p class="eyebrow">Keep going</p><h2>More useful tools</h2></div><a class="text-link" href="${homeHref}">Browse all tools <span aria-hidden="true">↗</span></a></div><div class="tool-grid tool-grid--compact">${relatedCards(tool.id, tool.category, pageTools, language)}</div></section>
      </div>
    </main>`,
    lang: language,
    alternates,
    toolId: tool.id,
  });
  return language === 'en' ? rendered : translateStaticHtml(rendered, language, dynamicTranslations);
}

function relatedCards(currentId, category, pageTools = tools, language = 'en') {
  const related = pageTools.filter((tool) => tool.id !== currentId && tool.category === category).slice(0, 3);
  const fallback = pageTools.filter((tool) => tool.id !== currentId && !related.some((item) => item.id === tool.id)).slice(0, 3 - related.length);
  return [...related, ...fallback].map((tool) => toolCard(tool, language)).join('');
}

export function shell({ title, description, canonical, body, schema = '', assetVersion = '', lang = 'en', alternates = '', toolId = '' }) {
  const assetSuffix = assetVersion ? `?v=${escapeHtml(assetVersion)}` : '';
  const homeHref = localePath(lang);
  const localeCode = locales[lang]?.code ?? lang;
  const defaultAlternate = `<link rel="alternate" hreflang="x-default" href="https://usefulverse.com${localePath('en', toolId)}">`;
  const localeSelector = `<nav class="language-switch" aria-label="Language">${localeEntries.map(({ key, code, name }) => `<a href="${localePath(key, toolId)}" hreflang="${code}" lang="${code}"${key === lang ? ' aria-current="page"' : ''} aria-label="${escapeHtml(name)}">${code.toUpperCase()}</a>`).join('')}</nav>`;
  return `<!doctype html>
<html lang="${localeCode}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${escapeHtml(canonical)}">
    ${alternates}
    ${defaultAlternate}
    <meta name="theme-color" content="#0b1324">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta property="og:site_name" content="UsefulVerse">
    <meta property="og:locale" content="${escapeHtml((packs[lang]?.meta.tag ?? { en: 'en-US', es: 'es-ES', fr: 'fr-FR', pt: 'pt-BR' }[lang] ?? localeCode).replace('-', '_'))}">
    <meta name="twitter:card" content="summary">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/assets/styles.css${assetSuffix}">
    ${schema}
  </head>
  <body>
    <header class="site-header"><div class="page-container site-header__inner"><a class="brand" href="${homeHref}" aria-label="UsefulVerse home"><span class="brand-mark" aria-hidden="true">◆</span><span>usefulverse</span></a><nav class="main-nav" aria-label="Main navigation"><a href="${homeHref}#tools">Tools</a><a href="${homeHref}#how-it-works">How it works</a></nav><a class="header-cta" href="${homeHref}#tools">Find a tool <span aria-hidden="true">↗</span></a>${localeSelector}</div></header>
    ${body}
    <footer class="site-footer"><div class="page-container site-footer__inner"><a class="brand brand--footer" href="${homeHref}"><span class="brand-mark" aria-hidden="true">◆</span><span>usefulverse</span></a><p>Simple tools that respect your time and your files.</p><div class="footer-links"><a href="${homeHref}#tools">All tools</a><a href="${homeHref}#how-it-works">Privacy first</a></div></div></footer>
    ${lang === 'en' ? '' : `<script defer src="/assets/locale-${lang}.js${assetSuffix}"></script>`}
    <script defer src="/assets/app.js${assetSuffix}"></script>
  </body>
</html>`;
}

export function renderHome(tools, categories, assetVersion = '', language = 'en') {
  const homeUrl = `https://usefulverse.com${localePath(language)}`;
  const alternates = localeEntries.map(({ key, code }) => `<link rel="alternate" hreflang="${code}" href="https://usefulverse.com${localePath(key)}">`).join('\n    ');
  const dynamicTranslations = {};
  const schema = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'UsefulVerse',
    url: homeUrl,
    description: locales[language].homeDescription,
    inLanguage: locales[language].code,
  })}</script>`;
  const rendered = shell({
    title: locales[language].homeTitle,
    description: locales[language].homeDescription,
    canonical: homeUrl,
    schema,
    assetVersion,
    lang: language,
    alternates,
    body: `<main>
      <section class="home-intro"><div class="page-container home-intro__grid"><div><p class="eyebrow">A useful place on the internet</p><h1>Do the small things<br><span>faster.</span></h1><p class="home-lead">Simple browser tools for text, data and everyday work. No account. No upload. Just open a tool and get it done.</p><a class="button button--primary button--large" href="#tools">Explore tools <span aria-hidden="true">↘</span></a></div><div class="intro-card" aria-label="UsefulVerse principles"><div class="intro-card__orb" aria-hidden="true"><span>useful</span><strong>verse</strong></div><div class="intro-card__notes"><span>Fast by default</span><span>Private by design</span><span>Free to use</span></div></div></div></section>
      <section class="tools-section" id="tools"><div class="page-container"><div class="section-heading section-heading--tools"><div><p class="eyebrow">The toolbox</p><h2>Find the right tool.</h2></div><div class="search-wrap"><label class="sr-only" for="tool-search">Search tools</label><input id="tool-search" class="search-input" type="search" placeholder="Search tools" autocomplete="off"><span aria-hidden="true">⌕</span></div></div><div class="category-row" role="group" aria-label="Tool categories">${categories.map((category) => `<button class="category-chip${category === categories[0] ? ' is-active' : ''}" data-category-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join('')}</div><div class="tool-grid" id="tool-grid">${tools.map((tool) => toolCard(tool, language)).join('')}</div><p class="empty-state" id="empty-state" hidden>No tools match that search yet. Try another word.</p></div></section>
      <section class="how-section" id="how-it-works"><div class="page-container how-grid"><div><p class="eyebrow">Why UsefulVerse</p><h2>Small tools.<br>Clear answers.</h2></div><div class="how-points"><article><span class="step-number">01</span><h3>Open a tool</h3><p>Each tool has one clear job. You can start in seconds.</p></article><article><span class="step-number">02</span><h3>Work privately</h3><p>Your text stays in your browser for browser-first tools.</p></article><article><span class="step-number">03</span><h3>Take the result</h3><p>Copy it or use it where you need it next.</p></article></div></div></section>
    </main>`,
  });
  return language === 'en' ? rendered : translateStaticHtml(rendered, language, dynamicTranslations);
}

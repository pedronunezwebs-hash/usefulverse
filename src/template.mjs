import { tools } from './catalog.mjs';
import { seo } from './seo.mjs';
import { localeEntries, localePath, locales, packs, translateStaticHtml, ui } from './locales.mjs';
import { imageFormatLocales } from './locales/image-formats.mjs';
import { longtailFaqs } from './locales/longtail.mjs';
import { guideCanonical, guidePath, guides } from './guides.mjs';
import { expandedToolMarkup } from './expanded-template.mjs';
import { browserBatchToolMarkup } from './browser-batch-template.mjs';

const fill = (template, values) => template.replace(/\{(\w+)\}/gu, (match, name) => values[name] ?? match);

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const toolUrl = (id, language = 'en') => localePath(language, id);

export const relatedToolIds = {
  'roman-numeral-converter': ['date-calculator', 'number-to-words-converter', 'binary-converter'],
  'binary-converter': ['prime-number-checker', 'timestamp-converter', 'number-to-words-converter'],
  'prime-number-checker': ['binary-converter', 'average-calculator', 'ratio-proportion-calculator'],
  'average-calculator': ['percentage-calculator', 'ratio-proportion-calculator', 'unit-converter'],
  'ratio-proportion-calculator': ['percentage-calculator', 'average-calculator', 'unit-converter'],
  'time-duration-calculator': ['date-calculator', 'time-zone-converter', 'timestamp-converter'],
  'date-calculator': ['time-duration-calculator', 'time-zone-converter', 'percentage-calculator'],
  'remove-line-breaks': ['word-counter', 'text-case-converter', 'remove-duplicate-lines'],
  'age-calculator': ['date-calculator', 'time-duration-calculator', 'business-days-calculator'],
  'business-days-calculator': ['date-calculator', 'age-calculator', 'time-duration-calculator'],
  'image-to-pdf': ['pdf-tools', 'image-resizer-compressor', 'image-format-converter'],
  'office-file-compressor': ['pdf-tools', 'image-resizer-compressor', 'image-format-converter'],
  'favicon-generator': ['image-resizer-compressor', 'color-converter', 'color-contrast-checker'],
  'image-format-converter': ['image-resizer-compressor', 'image-to-pdf', 'pdf-tools'],
  'markdown-html-converter': ['word-counter', 'text-case-converter', 'remove-line-breaks'],
  'json-yaml-converter': ['json-formatter', 'csv-to-json', 'json-to-csv'],
  'standard-deviation-calculator': ['average-calculator', 'ratio-proportion-calculator', 'percentage-calculator'],
  'discount-calculator': ['percentage-calculator', 'tip-calculator', 'ratio-proportion-calculator'],
  'square-footage-calculator': ['unit-converter', 'image-resizer-compressor', 'business-days-calculator'],
  'barcode-generator': ['qr-code-generator', 'qr-code-reader', 'favicon-generator'],
  'typing-speed-test': ['word-counter', 'text-case-converter', 'random-name-picker'],
  'fraction-calculator': ['percentage-calculator', 'average-calculator', 'ratio-proportion-calculator'],
  'time-card-calculator': ['time-duration-calculator', 'business-days-calculator', 'online-timer'],
  'online-timer': ['time-duration-calculator', 'time-card-calculator', 'typing-speed-test'],
  'lorem-ipsum-generator': ['word-counter', 'text-case-converter', 'text-to-slug'],
  'subnet-calculator': ['binary-converter', 'url-parser', 'json-formatter'],
  'random-name-picker': ['random-number-generator', 'typing-speed-test', 'lorem-ipsum-generator'],
  'fuel-cost-calculator': ['unit-converter', 'time-duration-calculator', 'percentage-calculator'],
  'image-cropper': ['image-resizer-compressor', 'image-format-converter', 'image-to-pdf'],
  'pdf-to-image': ['pdf-tools', 'image-to-pdf', 'image-format-converter'],
  'video-compressor': ['pdf-tools', 'image-resizer-compressor', 'image-format-converter'],
  'sql-formatter': ['json-formatter', 'xml-formatter', 'csv-to-json'],
};

const relatedGuideSlugs = {
  'average-calculator': ['how-to-calculate-a-weighted-grade'],
  'word-counter': ['google-docs-word-count'],
  'remove-duplicate-lines': ['remove-duplicates-in-excel-safely'],
  'binary-converter': ['hexadecimal-to-binary-conversion'],
};

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
  const expanded = expandedToolMarkup(id);
  if (expanded) return expanded;
  const browserBatch = browserBatchToolMarkup(id);
  if (browserBatch) return browserBatch;
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
      <div class="metric"><strong id="metric-sentences">0</strong><span>Sentences</span></div>
      <div class="metric"><strong id="metric-paragraphs">0</strong><span>Paragraphs</span></div>
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
    <p class="file-meta"><span>Duplicates removed:</span> <output id="dedupe-removed-count">0</output></p>
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
    <div class="tool-actions"><button class="button button--ghost" type="button" data-action="random-preset-1-100">Random number from 1 to 100</button></div>
    <div class="random-number-form"><label class="field-label" for="random-min">Minimum</label><input id="random-min" class="tool-input" type="number" inputmode="decimal" value="1"><label class="field-label" for="random-max">Maximum</label><input id="random-max" class="tool-input" type="number" inputmode="decimal" value="100"><label class="field-label" for="random-count">How many numbers? <input id="random-count" class="tool-input" type="number" min="1" max="100" value="1" inputmode="numeric"></label><label class="option-row"><input id="random-integer" type="checkbox" checked> Whole number only</label><label class="option-row"><input id="random-unique" type="checkbox"> No repeats</label></div>
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
    <section class="calculator-card roman-date-card"><h2>Roman numeral converter for dates</h2><label class="field-label" for="roman-date">Date</label><input id="roman-date" class="tool-input" type="date" min="0001-01-01" max="3999-12-31"><label class="field-label" for="roman-date-order">Date order</label><select id="roman-date-order" class="tool-input"><option value="dmy">Day / month / year</option><option value="mdy">Month / day / year</option><option value="ymd">Year / month / day</option></select><div class="tool-actions"><button class="button button--primary" data-action="convert-roman-date">Convert date to Roman numerals</button></div><output class="calculation-result" id="roman-date-output">—</output><p class="tool-hint">Each date part is converted separately; the selected order avoids ambiguous date formats.</p></section>
    <p class="tool-status" id="tool-status" aria-live="polite">Conversions run only in your browser.</p>
  ${close}`;
  if (id === 'binary-converter') return `${common}
    <div class="base-converter"><label class="field-label" for="binary-from">From base <select id="binary-from" class="tool-input">${[...Array(35)].map((_, index) => { const base = index + 2; return `<option value="${base}"${base === 10 ? ' selected' : ''}>${base}</option>`; }).join('')}</select></label><span class="base-arrow" aria-hidden="true">→</span><label class="field-label" for="binary-to">To base <select id="binary-to" class="tool-input">${[...Array(35)].map((_, index) => { const base = index + 2; return `<option value="${base}"${base === 2 ? ' selected' : ''}>${base}</option>`; }).join('')}</select></label></div>
    <label class="field-label" for="binary-input">Integer to convert</label><input id="binary-input" class="tool-input" type="text" spellcheck="false" placeholder="255"><div class="tool-actions"><button class="button button--primary" data-action="convert-binary">Convert number</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Supports whole numbers in bases 2 through 36. Digits 0–9 and letters A–Z represent values.</p><div class="result-block"><div class="result-block__heading"><span>Result</span></div><output id="binary-output" class="result-output">—</output></div>
  ${close}`;
  if (id === 'prime-number-checker') return `${common}
    <label class="field-label" for="prime-input">Whole number</label><input id="prime-input" class="tool-input" type="number" min="0" max="1000000000000" inputmode="numeric" placeholder="97"><div class="tool-actions"><button class="button button--primary" data-action="check-prime">Check number</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Checks integers up to one trillion locally.</p><div class="random-result prime-result" id="prime-output" aria-live="polite">—</div>
  ${close}`;
  if (id === 'average-calculator') return `${common}
    <div class="segmented" role="group" aria-label="Average calculation type"><button class="segment is-active" type="button" data-average-mode="simple" aria-pressed="true">Simple average</button><button class="segment" type="button" data-average-mode="weighted" aria-pressed="false">Weighted average for grades</button><button class="segment" type="button" data-average-mode="final-grade" aria-pressed="false">What grade do I need on my final?</button></div>
    <section id="average-simple-fields"><label class="sr-only" for="average-input">Numbers to average</label><textarea id="average-input" class="tool-textarea tool-textarea--large" placeholder="10\n20\n30\n40"></textarea><div class="tool-actions"><button class="button button--primary" data-action="calculate-average">Calculate average</button></div></section>
    <section id="average-weighted-fields" hidden><p class="tool-hint">Enter matching lists in the same order. For example, values 90, 80 and weights 3, 1 give a weighted average of 87.5.</p><div class="converter-grid"><label class="field-label" for="average-values">Grades or values<textarea id="average-values" class="tool-textarea" placeholder="90\n80"></textarea></label><label class="field-label" for="average-weights">Credits or weights<textarea id="average-weights" class="tool-textarea" placeholder="3\n1"></textarea></label></div><div class="tool-actions"><button class="button button--primary" data-action="calculate-weighted-average">Calculate weighted average</button></div></section>
    <section id="average-final-fields" hidden><p class="tool-hint">Assumes your current grade covers coursework before the final. A result over 100% is not attainable; 0% means you have already met the target.</p><div class="converter-grid"><label class="field-label" for="average-current-grade">Current grade before the final (%)<input id="average-current-grade" class="tool-input" type="number" min="0" max="100" step="any" inputmode="decimal" placeholder="85"></label><label class="field-label" for="average-final-weight">Final exam weight (%)<input id="average-final-weight" class="tool-input" type="number" min="0.01" max="100" step="any" inputmode="decimal" placeholder="30"></label><label class="field-label" for="average-target-grade">Desired course grade (%)<input id="average-target-grade" class="tool-input" type="number" min="0" max="100" step="any" inputmode="decimal" placeholder="90"></label></div><div class="tool-actions"><button class="button button--primary" data-action="calculate-final-grade">Calculate required grade</button></div><div class="result-block"><div class="result-block__heading"><span>Required final exam grade</span></div><output id="average-final-result" aria-live="polite">—</output></div></section>
    <div class="tool-actions"><button class="button button--ghost" data-action="clear">Clear</button></div><p class="tool-status" id="tool-status" aria-live="polite">Separate numbers with spaces, commas or new lines.</p>
    <div class="result-grid result-grid--three"><div class="result-block"><div class="result-block__heading"><span>Average</span></div><output id="average-result">—</output></div><div class="result-block"><div class="result-block__heading"><span>Sum or weighted total</span></div><output id="average-sum">—</output></div><div class="result-block"><div class="result-block__heading"><span>Count</span></div><output id="average-count">—</output></div><div class="result-block"><div class="result-block__heading"><span>Minimum</span></div><output id="average-min">—</output></div><div class="result-block"><div class="result-block__heading"><span>Maximum</span></div><output id="average-max">—</output></div><div class="result-block"><div class="result-block__heading"><span>Total weight</span></div><output id="average-weight-total">—</output></div></div>
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
  if (id === 'xml-formatter') return `${common}
    <label class="field-label" for="xml-input">XML to check</label><textarea id="xml-input" class="tool-textarea tool-textarea--code tool-textarea--large" spellcheck="false" placeholder="&lt;note&gt;&lt;to&gt;Alex&lt;/to&gt;&lt;/note&gt;"></textarea>
    <div class="tool-actions"><button class="button button--primary" data-action="format-xml">Format XML</button><button class="button button--ghost" data-action="validate-xml">Check XML</button><button class="button button--ghost" data-action="clear">Clear</button></div>
    <p class="tool-status" id="tool-status" aria-live="polite">XML is checked in your browser. No upload.</p>
    <label class="field-label" for="xml-output">Formatted XML</label><textarea id="xml-output" class="tool-textarea tool-textarea--code tool-textarea--large" readonly spellcheck="false" placeholder="Your formatted XML will appear here..."></textarea>
    <div class="tool-actions"><button class="button button--primary" data-action="copy-xml">Copy XML</button></div>
  ${close}`;
  if (id === 'color-contrast-checker') return `${common}
    <div class="contrast-fields"><label class="calculator-card" for="contrast-foreground"><span class="field-label">Text color</span><input id="contrast-foreground" class="color-input" type="color" value="#172033"><code id="contrast-foreground-hex">#172033</code></label><label class="calculator-card" for="contrast-background"><span class="field-label">Background color</span><input id="contrast-background" class="color-input" type="color" value="#FFFFFF"><code id="contrast-background-hex">#FFFFFF</code></label></div>
    <div class="contrast-preview" id="contrast-preview"><strong>Sample text</strong><span>The quick brown fox jumps over the lazy dog.</span></div>
    <div class="contrast-result"><div><span>Contrast ratio</span><strong id="contrast-ratio">—</strong></div><div><span>WCAG AA · normal text</span><strong id="contrast-aa-normal">—</strong></div><div><span>WCAG AA · large text</span><strong id="contrast-aa-large">—</strong></div><div><span>WCAG AAA · normal text</span><strong id="contrast-aaa-normal">—</strong></div></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Change either color to check readability. WCAG thresholds are guidance for this color pair only.</p>
  ${close}`;
  if (id === 'tip-calculator') return `${common}
    <div class="calculator-grid"><section class="calculator-card"><label class="field-label" for="tip-bill">Bill amount</label><input id="tip-bill" class="tool-input" type="text" inputmode="decimal" value="48"><label class="field-label" for="tip-currency">Currency</label><select id="tip-currency" class="tool-input"><option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option><option>AUD</option><option>MXN</option><option>BRL</option><option>INR</option><option>PKR</option><option>BDT</option><option>CNY</option><option>JPY</option><option>KRW</option><option>IDR</option><option>RUB</option><option>TRY</option><option>VND</option><option>SAR</option><option>AED</option></select><label class="field-label" for="tip-percent">Tip percentage <output id="tip-percent-value">15%</output></label><input id="tip-percent" type="range" min="0" max="50" step="1" value="15"><label class="field-label" for="tip-people">People</label><input id="tip-people" class="tool-input" type="number" min="1" max="100" step="1" inputmode="numeric" value="2"></section><section class="calculator-card tip-summary" aria-live="polite"><p><span>Tip total</span><strong id="tip-total">—</strong></p><p><span>Total with tip</span><strong id="tip-grand-total">—</strong></p><p><span>Tip per person</span><strong id="tip-per-person">—</strong></p><p class="tip-share"><span>Total per person</span><strong id="tip-total-per-person">—</strong></p></section></div>
    <div class="tool-actions"><button class="button button--primary" data-action="calculate-tip">Calculate tip</button><button class="button button--ghost" data-action="clear">Reset</button></div><p class="tool-status" id="tool-status" aria-live="polite">Each person's share is rounded to your currency's smallest displayed unit.</p>
  ${close}`;
  if (id === 'gpa-calculator') return `${common}
    <p class="tool-hint">Common US 4.0 scale. Your school may use different grade points.</p><div class="gpa-courses" id="gpa-courses" aria-label="Courses"><div class="gpa-course" data-course-row><label><span class="sr-only">Course name</span><input class="tool-input" name="course-name[]" data-course-name type="text" maxlength="60" placeholder="Course name (optional)"></label><label><span class="sr-only">Letter grade</span><select class="tool-input" name="course-grade[]" data-course-grade><option>A</option><option>A-</option><option>B+</option><option>B</option><option>B-</option><option>C+</option><option>C</option><option>C-</option><option>D+</option><option>D</option><option>D-</option><option>F</option></select></label><label><span class="sr-only">Credits</span><input class="tool-input" name="course-credits[]" data-course-credits type="text" inputmode="decimal" maxlength="8" value="3"></label><button class="button button--ghost gpa-remove" type="button" data-action="remove-course" aria-label="Remove course">×</button></div></div>
    <div class="tool-actions"><button class="button button--ghost" data-action="add-course">Add course</button><button class="button button--primary" data-action="calculate-gpa">Calculate GPA</button><button class="button button--ghost" data-action="clear">Reset</button></div><div class="gpa-result" aria-live="polite"><span>Weighted GPA</span><strong id="gpa-result">—</strong><small id="gpa-credits">Add your courses and credits.</small></div><p class="tool-status" id="tool-status" aria-live="polite">A+ and A both count as 4.0 on this scale.</p>
  ${close}`;
  if (id === 'file-checksum') return `${common}
    <label class="field-label" for="checksum-file">Choose a file (up to 25 MB)</label><input id="checksum-file" class="tool-input file-picker" type="file"><p class="file-meta" id="checksum-file-meta">Your file is processed on this device and is not uploaded.</p>
    <div class="tool-actions"><button class="button button--primary" data-action="hash-file">Create SHA-256 checksum</button><button class="button button--ghost" data-action="clear">Clear</button></div><p class="tool-status" id="tool-status" aria-live="polite">Choose a file to begin.</p>
    <label class="field-label" for="checksum-output">SHA-256 checksum</label><textarea id="checksum-output" class="tool-textarea tool-textarea--code" readonly spellcheck="false" placeholder="The checksum will appear here..."></textarea><div class="tool-actions"><button class="button button--ghost" data-action="copy-checksum">Copy checksum</button></div>
    <label class="field-label" for="checksum-expected">Compare with a known checksum (optional)</label><input id="checksum-expected" class="tool-input" type="text" spellcheck="false" autocomplete="off" placeholder="Paste the published SHA-256 value"><p class="checksum-match" id="checksum-match" aria-live="polite"></p>
  ${close}`;
  if (id === 'image-resizer-compressor') return `${common}
    <label class="field-label" for="image-file">Choose an image</label><input id="image-file" class="tool-input file-picker" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/avif,image/tiff,image/bmp,image/gif,image/apng,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,.jpg,.jpeg,.jpe,.jfif,.pjpeg,.pjp,.png,.apng,.webp,.heic,.heif,.avif,.tif,.tiff,.bmp,.gif,.svg,.ico,.cur"><p class="file-meta" id="image-file-meta">JPG, PNG, WebP, HEIC/HEIF, AVIF, BMP, GIF/APNG, SVG and ICO. Animated files export only their first frame. Output up to 40 megapixels.</p><p class="tool-hint">AVIF and some HEIC files may depend on browser support.</p><p class="tool-hint">Multi-page TIFF uses only its first page. Some TIFF compression variants may not decode.</p>
    <div class="image-editor"><div><label class="field-label" for="image-width">Width (px)</label><input id="image-width" class="tool-input" type="number" min="1" max="8000" value="1200" inputmode="numeric"></div><button class="button button--ghost aspect-lock" type="button" data-action="toggle-aspect" aria-pressed="true" aria-label="Keep proportions">↔</button><div><label class="field-label" for="image-height">Height (px)</label><input id="image-height" class="tool-input" type="number" min="1" max="8000" value="800" inputmode="numeric"></div></div>
    <label class="field-label" for="image-format">Output format</label><select id="image-format" class="tool-input"><option value="image/webp">WebP</option><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option></select><label class="field-label" for="image-quality">Quality <output id="image-quality-value">80%</output></label><input id="image-quality" type="range" min="40" max="95" step="1" value="80"><p class="tool-hint">Quality applies to JPEG and WebP. PNG is lossless.</p>
    <div class="tool-actions"><button class="button button--primary" data-action="resize-image">Resize and save image</button><button class="button button--ghost" data-action="clear">Clear</button></div><p class="tool-status" id="tool-status" aria-live="polite">The image is processed locally in your browser.</p><div class="image-preview" id="image-preview" hidden><img id="image-preview-img" alt="Resized image preview"><p id="image-output-meta"></p><a class="button button--ghost" id="image-download" download="usefulverse-image.webp">Download image</a></div>
  ${close}`;
  if (id === 'pdf-tools') return `${common}
    <label class="field-label" for="pdf-mode">What do you want to do?</label><select id="pdf-mode" class="tool-input"><option value="merge">Merge PDF files</option><option value="split">Extract page ranges</option><option value="optimize">Optimize PDF (keep text &amp; layout)</option><option value="smallest">Strong compression (pages become images)</option></select>
    <label class="field-label" for="pdf-files">Choose PDF file(s)</label><input id="pdf-files" class="tool-input file-picker" type="file" accept="application/pdf,.pdf" multiple><p class="file-meta" id="pdf-file-meta">PDFs are processed on this device and are never uploaded. There is no fixed file-size cap; available memory and browser support are the practical limits.</p>
    <div id="pdf-range-wrap" hidden><label class="field-label" for="pdf-ranges">Page ranges (for example: 1-3, 5-7)</label><input id="pdf-ranges" class="tool-input" type="text" inputmode="text" placeholder="1-3, 5-7"><p class="tool-hint">Each range becomes a separate PDF file.</p></div>
    <div id="pdf-optimize-note" class="tool-hint" hidden>Best first try: rewrites and recompresses PDF structure without turning pages into images. Text and layout usually remain, but not every special feature is guaranteed; editing a signed PDF may invalidate its signature. It may not get smaller.</div>
    <div id="pdf-compress-note" class="warning-note" hidden><strong>Review this before continuing</strong><p>Every page is rebuilt as an image. Text will no longer be searchable or selectable; links, forms, annotations, accessibility structure and signatures will not be preserved. Small text or fine details may look worse, and the file can even grow. Always compare the result and keep your original.</p><label><input id="pdf-compress-confirm" type="checkbox"> I understand these trade-offs and will keep the original.</label></div>
    <div id="pdf-image-options" hidden><label class="field-label" for="pdf-image-quality">Image quality</label><select id="pdf-image-quality" class="tool-input"><option value="balanced">Balanced · clearer text</option><option value="smaller">Smaller file · lower detail</option></select></div>
    <div class="tool-actions"><button class="button button--primary" data-action="run-pdf">Continue</button><button class="button button--ghost" data-action="cancel-pdf" disabled>Cancel</button><button class="button button--ghost" data-action="clear">Clear</button></div><p class="tool-status" id="tool-status" aria-live="polite">PDF processing runs in this browser. No upload.</p><div class="pdf-downloads" id="pdf-downloads" aria-live="polite"></div>
  ${close}`;
  if (id === 'video-compressor') return `${common}
    <label class="field-label" for="video-file">Choose a video</label><input id="video-file" class="tool-input file-picker" type="file" accept="video/*,.mp4,.mov,.m4v,.webm,.mkv,.avi"><p class="file-meta" id="video-file-meta">The video is processed on your device and is never uploaded. There is no fixed file-size cap; available memory, storage and browser codecs set practical limits.</p>
    <div class="calculator-grid"><section class="calculator-card"><label class="field-label" for="video-format">Output format</label><select id="video-format" class="tool-input"><option value="mp4">MP4 · broadly compatible</option><option value="webm">WebM · open format</option></select><label class="field-label" for="video-quality">Quality</label><select id="video-quality" class="tool-input"><option value="high">Higher quality · larger file</option><option value="medium" selected>Balanced</option><option value="low">Smaller file · more quality loss</option></select><label class="field-label" for="video-height">Maximum resolution</label><select id="video-height" class="tool-input"><option value="0">Keep original resolution</option><option value="1080">Up to 1080p</option><option value="720">Up to 720p</option></select></section><section class="calculator-card"><strong>Before you start</strong><p class="tool-hint">Compression re-encodes video and may reduce quality. If a format cannot keep an audio, subtitle or data track, processing stops instead of silently removing it. Your original is never changed.</p><p class="tool-hint" id="video-memory-note" hidden>This browser cannot save the result as a stream, so it will temporarily use device memory. Very large videos may exceed what the browser or device can handle.</p></section></div>
    <div class="tool-actions"><button class="button button--primary" data-action="compress-video">Compress video</button><button class="button button--ghost" data-action="cancel-video" disabled>Cancel</button><button class="button button--ghost" data-action="clear">Clear</button></div><progress id="video-progress" class="tool-progress" max="100" value="0" hidden aria-label="Video compression progress"></progress><p class="tool-status" id="tool-status" aria-live="polite">No upload. Keep this tab open while your device works.</p><div class="pdf-downloads" id="video-downloads" aria-live="polite"></div>
  ${close}`;
  if (id === 'csv-viewer') return `${common}
    <label class="field-label" for="csv-file">Choose a CSV file (up to 5 MB)</label><input id="csv-file" class="tool-input file-picker" type="file" accept=".csv,text/csv,text/plain"><p class="file-meta" id="csv-file-meta">The file opens locally and is not uploaded.</p><div class="csv-toolbar"><label class="sr-only" for="csv-search">Search table</label><input id="csv-search" class="tool-input" type="search" placeholder="Search all columns" disabled><span id="csv-summary" class="file-meta" aria-live="polite"></span></div>
    <p class="tool-status" id="tool-status" aria-live="polite">Choose a CSV file to see its table.</p><div class="csv-table-wrap" id="csv-table-wrap" hidden><table class="csv-table"><caption class="sr-only">CSV data</caption><thead id="csv-head"></thead><tbody id="csv-body"></tbody></table></div><nav class="csv-pagination" aria-label="Table pages"><button class="button button--ghost" type="button" data-action="csv-prev" disabled>Previous</button><span id="csv-page-label">—</span><button class="button button--ghost" type="button" data-action="csv-next" disabled>Next</button></nav>
  ${close}`;
  if (id === 'qr-code-reader') return `${common}
    <label class="field-label" for="qr-reader-file">Choose a QR image</label><input id="qr-reader-file" class="tool-input file-picker" type="file" accept="image/jpeg,image/png,image/webp"><p class="file-meta">The image is scanned on your device. Nothing is uploaded.</p><div class="tool-actions"><button class="button button--primary" data-action="start-camera">Start camera</button><button class="button button--ghost" data-action="stop-camera" disabled>Stop camera</button></div><p class="tool-status" id="tool-status" aria-live="polite">Camera access is optional. You will be asked before it starts.</p><video id="qr-reader-video" class="qr-reader-video" playsinline muted hidden></video><canvas id="qr-reader-canvas" hidden></canvas>
    <div class="result-block qr-reader-result"><div class="result-block__heading"><span>QR code contents</span></div><textarea id="qr-reader-output" class="tool-textarea" readonly placeholder="Scanned text will appear here..."></textarea><div class="tool-actions"><button class="button button--ghost" data-action="copy-qr-result">Copy result</button><a id="qr-reader-link" class="button button--ghost" href="#" target="_blank" hidden rel="noopener noreferrer">Open link</a><button class="button button--ghost" data-action="clear">Clear</button></div></div>
  ${close}`;
  if (id === 'standard-deviation-calculator') return `${common}
    <label class="field-label" for="stats-input">Numbers to average</label><textarea id="stats-input" class="tool-textarea tool-textarea--large" maxlength="200000" placeholder="4, 8, 6, 5, 3, 7"></textarea>
    <label class="field-label" for="stats-type">Type</label><select id="stats-type" class="tool-input"><option value="population">Population</option><option value="sample">Sample</option></select>
    <div class="tool-actions"><button class="button button--primary" data-action="calculate-statistics">Calculate</button><button class="button button--ghost" data-action="clear">Clear</button></div><p class="tool-status" id="tool-status" aria-live="polite">Enter valid numbers and choose population or sample.</p>
    <div class="result-grid"><div class="result-block"><div class="result-block__heading"><span>Count</span></div><output id="stats-count">—</output></div><div class="result-block"><div class="result-block__heading"><span>Average</span></div><output id="stats-mean">—</output></div><div class="result-block"><div class="result-block__heading"><span>Variance</span></div><output id="stats-variance">—</output></div><div class="result-block"><div class="result-block__heading"><span>Standard deviation</span></div><output id="stats-deviation">—</output></div></div>
  ${close}`;
  if (id === 'discount-calculator') return `${common}
    <div class="segmented" role="group" aria-label="Discount calculation type"><button class="segment is-active" type="button" data-discount-mode="sale" aria-pressed="true">Sale price</button><button class="segment" type="button" data-discount-mode="reverse" aria-pressed="false">Find percent off</button></div>
    <section id="discount-sale-fields"><label class="field-label" for="discount-original">Original price</label><input id="discount-original" class="tool-input" type="number" min="0" step="any" inputmode="decimal" placeholder="100"><label class="field-label" for="discount-percent">Discount (%)</label><input id="discount-percent" class="tool-input" type="number" min="0" max="100" step="any" inputmode="decimal" placeholder="20"></section>
    <section id="discount-reverse-fields" hidden><label class="field-label" for="discount-reverse-original">Original price</label><input id="discount-reverse-original" class="tool-input" type="number" min="0" step="any" inputmode="decimal" placeholder="100"><label class="field-label" for="discount-sale-price">Sale price</label><input id="discount-sale-price" class="tool-input" type="number" min="0" step="any" inputmode="decimal" placeholder="80"></section>
    <div class="tool-actions"><button class="button button--primary" data-action="calculate-discount">Calculate</button><button class="button button--ghost" data-action="clear">Clear</button></div><p class="tool-status" id="tool-status" aria-live="polite">Results are estimates before tax.</p>
    <div class="result-grid"><div class="result-block"><div class="result-block__heading"><span>Amount saved</span></div><output id="discount-saved">—</output></div><div class="result-block"><div class="result-block__heading"><span>Sale price</span></div><output id="discount-final">—</output></div><div class="result-block"><div class="result-block__heading"><span>Discount percent</span></div><output id="discount-rate-result">—</output></div></div>
  ${close}`;
  if (id === 'square-footage-calculator') return `${common}
    <div class="converter-grid"><label class="field-label" for="area-length">Length<input id="area-length" class="tool-input" type="number" min="0" step="any" inputmode="decimal" placeholder="12"></label><label class="field-label" for="area-width">Width<input id="area-width" class="tool-input" type="number" min="0" step="any" inputmode="decimal" placeholder="10"></label></div>
    <label class="field-label" for="area-unit">Unit</label><select id="area-unit" class="tool-input"><option value="ft">ft</option><option value="in">in</option><option value="m">m</option><option value="cm">cm</option></select>
    <label class="field-label" for="area-waste">Waste allowance (%)</label><input id="area-waste" class="tool-input" type="number" min="0" max="100" step="any" inputmode="decimal" value="10">
    <div class="tool-actions"><button class="button button--primary" data-action="calculate-area">Calculate</button><button class="button button--ghost" data-action="clear">Clear</button></div><p class="tool-status" id="tool-status" aria-live="polite">Enter positive room dimensions. The waste allowance is optional.</p>
    <div class="result-grid"><div class="result-block"><div class="result-block__heading"><span>Area (ft²)</span></div><output id="area-square-feet">—</output></div><div class="result-block"><div class="result-block__heading"><span>Area (m²)</span></div><output id="area-square-meters">—</output></div><div class="result-block"><div class="result-block__heading"><span>Area with waste (ft²)</span></div><output id="area-with-waste">—</output></div></div>
  ${close}`;
  if (id === 'barcode-generator') return `${common}
    <label class="field-label" for="barcode-format">Type</label><select id="barcode-format" class="tool-input"><option value="CODE128">Code 128</option><option value="EAN13">EAN-13</option><option value="UPC">UPC-A</option></select>
    <label class="field-label" for="barcode-value">Value</label><input id="barcode-value" class="tool-input" type="text" maxlength="80" autocomplete="off" spellcheck="false" placeholder="UV-2026-001">
    <label class="option-label"><input id="barcode-show-value" type="checkbox" checked> Show text below</label><p class="tool-hint" id="barcode-format-hint">Code 128 accepts up to 80 printable ASCII characters.</p>
    <div class="tool-actions"><button class="button button--primary" data-action="generate-barcode">Generate</button><button class="button button--ghost" data-action="clear">Clear</button></div><p class="tool-status" id="tool-status" aria-live="polite">Generated locally. Retail barcodes need a valid product identifier.</p>
    <div class="barcode-preview" id="barcode-preview-wrap" hidden><svg id="barcode-preview" role="img" aria-label="Generated barcode"></svg></div><div class="file-downloads" id="barcode-downloads" aria-live="polite"></div><div class="tool-actions" id="barcode-download-actions" hidden><button class="button button--ghost" data-action="download-barcode-svg">Download <span>SVG</span></button><button class="button button--ghost" data-action="download-barcode-png">Download <span>PNG</span></button></div>
  ${close}`;
  return `${common}<p>This tool is not available yet.</p>${close}`;
}

export function renderToolPage(tool, assetVersion = '', language = 'en', pageTools = tools) {
  const canonical = `https://usefulverse.com${toolUrl(tool.id, language)}`;
  const faqCopy = {
    es: { how: (name) => `¿Cómo se usa «${name}»?`, privacyQuestion: '¿Se envían mis datos a un servidor?', privacyAnswer: 'No. El procesamiento se realiza en tu navegador y tus datos no se suben.' },
    fr: { how: (name) => `Comment utiliser « ${name} » ?`, privacyQuestion: 'Mes données sont-elles envoyées à un serveur ?', privacyAnswer: 'Non. Le traitement s’effectue dans votre navigateur et vos données ne sont pas envoyées.' },
    pt: { how: (name) => `Como usar ${name}?`, privacyQuestion: 'Meus dados são enviados para algum servidor?', privacyAnswer: 'Não. O processamento acontece no seu navegador, e seus dados não são enviados para um servidor.' },
    de: { how: (name) => `Wie verwendet man „${name}“?`, privacyQuestion: 'Werden meine Daten an einen Server gesendet?', privacyAnswer: 'Nein. Die Verarbeitung findet in Ihrem Browser statt. Ihre Daten werden nicht hochgeladen.' },
  };
  const pack = packs[language];
  const imageFormatData = imageFormatLocales[language];
  const imageFormatCopy = imageFormatData?.copy?.[tool.id];
  const seoData = language === 'en'
    ? (seo[tool.id] ?? { title: tool.title, description: `${tool.description} Free, fast and private in your browser.` })
    : pack ? {
      title: pack.seo?.[tool.id]?.title ?? tool.shortTitle,
      description: pack.seo?.[tool.id]?.description ?? tool.description,
      faq: pack.faq?.[tool.id] ?? [
        { question: fill(pack.page.faqHow, { name: tool.shortTitle }), answer: tool.intro },
        { question: pack.page.privacyQuestion, answer: pack.page.privacyAnswer },
      ],
    } : imageFormatCopy ? {
      title: imageFormatData.seoTitles?.[tool.id] ?? imageFormatCopy[1],
      description: imageFormatCopy[2].length >= 25 && imageFormatCopy[2].length <= 155
        ? imageFormatCopy[2]
        : `${imageFormatCopy[4].slice(0, 145).replace(/[\s,;:]+$/u, '')}…`,
      faq: [
        { question: imageFormatData.faqQuestions?.[tool.id] ?? faqCopy[language].how(tool.shortTitle), answer: imageFormatCopy[4] },
        { question: faqCopy[language].privacyQuestion, answer: faqCopy[language].privacyAnswer },
      ],
    } : {
      title: tool.shortTitle,
      description: tool.description,
      faq: [
        { question: faqCopy[language].how(tool.shortTitle), answer: tool.intro },
        { question: faqCopy[language].privacyQuestion, answer: faqCopy[language].privacyAnswer },
      ],
    };
  const faqByQuestion = new Map();
  for (const item of [...(seoData.faq ?? []), ...(longtailFaqs[tool.id]?.[language] ?? [])]) {
    const { question } = item;
    const key = question.trim().replace(/\s+/gu, ' ').toLocaleLowerCase(language);
    faqByQuestion.set(key, item);
  }
  const faq = [...faqByQuestion.values()];
  const homeHref = localePath(language);
  const alternates = localeEntries.map(({ key, code }) => `<link rel="alternate" hreflang="${code}" href="https://usefulverse.com${localePath(key, tool.id)}">`).join('\n    ');
  // Page-specific wording for UI keys that mean something else on this tool (e.g. "Whole number" is an
  // integer elsewhere but the total in the percentage calculator). Packs bring theirs in `toolUi`.
  const toolUi = pack ? pack.toolUi?.[tool.id] : { 'percentage-calculator': { es: { 'Whole number': 'Total' }, fr: { 'Whole number': 'Total' }, pt: { 'Whole number': 'Valor total' }, de: { 'Whole number': 'Gesamtwert' } } }[tool.id]?.[language];
  const dynamicTranslations = { ...toolUi, ...(pack ? {
    [`About ${tool.title}.`]: fill(pack.page.about, { title: tool.title }),
    [`${tool.title} made simple.`]: fill(pack.page.madeSimple, { title: tool.title }),
    [`${tool.category} tool`]: fill(pack.page.categoryTool, { category: tool.category }),
    [`${tool.title} workspace`]: fill(pack.page.workspace, { title: tool.title }),
  } : {
    [`${tool.title} workspace`]: { es: `Área de trabajo: ${tool.title}`, fr: `Espace de travail : ${tool.title}`, pt: `Área de trabalho: ${tool.title}`, de: `Arbeitsbereich: ${tool.title}` }[language] ?? `${tool.title} workspace`,
    [`About ${tool.title}.`]: language === 'es' ? `Acerca de ${tool.title}.` : language === 'fr' ? `À propos de ${tool.title}.` : language === 'de' ? `Über ${tool.title}.` : `Sobre ${tool.title}.`,
    [`${tool.title} made simple.`]: language === 'es' ? `${tool.title} sin complicaciones.` : language === 'fr' ? `${tool.title} en toute simplicité.` : language === 'de' ? `${tool.title} – einfach erklärt.` : `${tool.title} sem complicação.`,
    [`${tool.category} tool`]: `${tool.category} · ${ui[language]?.tool ?? 'tool'}`,
  }) };
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
  const guideLinks = language === 'en' ? (relatedGuideSlugs[tool.id] ?? []).map((slug) => {
    const guide = guides.find((item) => item.slug === slug);
    return guide ? `<a class="guide-link-card" href="${guidePath(slug)}"><span class="eyebrow">Step-by-step guide</span><strong>${escapeHtml(guide.title)}</strong><span>Read the walkthrough <span aria-hidden="true">↗</span></span></a>` : '';
  }).join('') : '';
  const guidesSection = guideLinks ? `<section class="tool-guides" aria-labelledby="tool-guides-title"><div><p class="eyebrow">Learn the steps</p><h2 id="tool-guides-title">Helpful guides</h2></div><div class="guide-link-grid">${guideLinks}</div></section>` : '';
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
        ${usefulVerseSaveCard(canonical)}
        <section class="tool-explainer"><div><p class="eyebrow">About this tool</p><h2>${escapeHtml(tool.title)} made simple.</h2></div><p>${escapeHtml(tool.body)}</p></section>
        ${guidesSection}
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
  const preferredIds = relatedToolIds[currentId] ?? [];
  const related = preferredIds.map((id) => pageTools.find((tool) => tool.id === id)).filter(Boolean).slice(0, 3);
  const sameCategory = pageTools.filter((tool) => tool.id !== currentId && tool.category === category && !related.some((item) => item.id === tool.id));
  const fallback = [...sameCategory, ...pageTools.filter((tool) => tool.id !== currentId && !related.some((item) => item.id === tool.id) && !sameCategory.some((item) => item.id === tool.id))].slice(0, 3 - related.length);
  return [...related, ...fallback].map((tool) => toolCard(tool, language)).join('');
}

function usefulVerseSaveCard(url, compact = false) {
  return `<aside class="save-card${compact ? ' save-card--compact' : ''}" aria-labelledby="save-usefulverse-title">
    <div class="save-card__copy"><h2 id="save-usefulverse-title">Want to find UsefulVerse again?</h2><p>Free tools, no account or subscription. Save this page in your notes or send it to yourself for next time.</p><p class="save-card__status" data-save-status aria-live="polite"></p><label class="sr-only" for="save-usefulverse-link">Page link</label><input class="save-card__link" id="save-usefulverse-link" type="url" value="${escapeHtml(url)}" readonly hidden></div>
    <button class="button button--ghost save-card__button" type="button" data-save-usefulverse data-share-url="${escapeHtml(url)}">Save UsefulVerse <span aria-hidden="true">↗</span></button>
  </aside>`;
}

export function renderNotFoundPage() {
  const languageOptions = localeEntries.map(({ key, name, code }) => `<a href="${localePath(key)}" lang="${code}" hreflang="${code}">${escapeHtml(name)}</a>`).join('\n        ');
  const messages = {
    en: { title: 'Page not found', heading: 'This page took a wrong turn.', detail: 'The address may be outdated or the page may have moved. Head back to the tools directory.', home: 'Browse all tools', languages: 'Choose a language' },
    es: { title: 'Página no encontrada', heading: 'Esta página se ha perdido.', detail: 'Puede que la dirección ya no exista o que la página se haya movido. Vuelve al directorio de herramientas.', home: 'Ver todas las herramientas', languages: 'Elige un idioma' },
    fr: { title: 'Page introuvable', heading: 'Cette page a pris le mauvais chemin.', detail: 'Cette adresse est peut-être obsolète ou la page a été déplacée. Revenez au répertoire des outils.', home: 'Voir tous les outils', languages: 'Choisir une langue' },
    pt: { title: 'Página não encontrada', heading: 'Esta página saiu do caminho.', detail: 'O endereço pode estar desatualizado ou a página pode ter mudado. Volte ao diretório de ferramentas.', home: 'Ver todas as ferramentas', languages: 'Escolha um idioma' },
    de: { title: 'Seite nicht gefunden', heading: 'Diese Seite ist falsch abgebogen.', detail: 'Die Adresse ist möglicherweise veraltet oder die Seite wurde verschoben. Gehen Sie zurück zur Tool-Übersicht.', home: 'Alle Tools ansehen', languages: 'Sprache auswählen' },
    ja: { title: 'ページが見つかりません', heading: 'お探しのページが見つかりません。', detail: 'URLが古いか、ページが移動した可能性があります。ツール一覧からお探しください。', home: 'ツール一覧を見る', languages: '言語を選択' },
    ko: { title: '페이지를 찾을 수 없습니다', heading: '요청하신 페이지가 없습니다.', detail: '주소가 변경되었거나 페이지가 이동했을 수 있습니다. 도구 목록에서 찾아보세요.', home: '모든 도구 보기', languages: '언어 선택' },
    id: { title: 'Halaman tidak ditemukan', heading: 'Halaman ini tidak ditemukan.', detail: 'Alamat mungkin sudah tidak berlaku atau halamannya telah dipindahkan. Kembali ke daftar alat.', home: 'Lihat semua alat', languages: 'Pilih bahasa' },
    hi: { title: 'पेज नहीं मिला', heading: 'यह पेज नहीं मिला।', detail: 'पता पुराना हो सकता है या पेज कहीं और चला गया है। टूल की सूची पर वापस जाएं।', home: 'सभी टूल देखें', languages: 'भाषा चुनें' },
    ar: { title: 'الصفحة غير موجودة', heading: 'يبدو أن هذه الصفحة سلكت طريقًا خاطئًا.', detail: 'قد يكون العنوان قديمًا أو نُقلت الصفحة. عُد إلى دليل الأدوات.', home: 'تصفح كل الأدوات', languages: 'اختر اللغة' },
    zh: { title: '页面不存在', heading: '这个页面走错了方向。', detail: '链接可能已过期，或页面已移动。请返回工具目录。', home: '浏览全部工具', languages: '选择语言' },
    bn: { title: 'পৃষ্ঠা পাওয়া যায়নি', heading: 'এই পৃষ্ঠাটি খুঁজে পাওয়া যায়নি।', detail: 'ঠিকানাটি পুরোনো হতে পারে অথবা পৃষ্ঠাটি সরানো হয়েছে। সব টুলের তালিকায় ফিরে যান।', home: 'সব টুল দেখুন', languages: 'ভাষা বেছে নিন' },
    ru: { title: 'Страница не найдена', heading: 'Похоже, страница свернула не туда.', detail: 'Адрес мог устареть или страница была перемещена. Вернитесь к списку инструментов.', home: 'Все инструменты', languages: 'Выберите язык' },
    ur: { title: 'صفحہ نہیں ملا', heading: 'یہ صفحہ نہیں مل سکا۔', detail: 'ممکن ہے پتہ پرانا ہو یا صفحہ منتقل کر دیا گیا ہو۔ ٹولز کی فہرست پر واپس جائیں۔', home: 'تمام ٹولز دیکھیں', languages: 'زبان منتخب کریں' },
    tr: { title: 'Sayfa bulunamadı', heading: 'Bu sayfa yanlış bir yola saptı.', detail: 'Adres güncel olmayabilir veya sayfa taşınmış olabilir. Araçlar dizinine dönün.', home: 'Tüm araçlara göz at', languages: 'Dil seçin' },
    vi: { title: 'Không tìm thấy trang', heading: 'Trang này đã đi nhầm đường.', detail: 'Địa chỉ có thể đã cũ hoặc trang đã được chuyển. Hãy quay lại danh sách công cụ.', home: 'Xem tất cả công cụ', languages: 'Chọn ngôn ngữ' },
  };
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,follow">
    <meta name="theme-color" content="#0b1324">
    <title>Page not found | UsefulVerse</title>
    <style>
      :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #172033; background: #f7f8fb; }
      * { box-sizing: border-box; }
      body { min-height: 100vh; margin: 0; display: grid; place-items: center; padding: 24px; }
      main { width: min(100%, 680px); padding: clamp(28px, 7vw, 64px); background: white; border: 1px solid #e5e8ef; border-radius: 28px; box-shadow: 0 18px 60px #1720330d; }
      .brand { display: inline-flex; gap: 10px; align-items: center; color: inherit; text-decoration: none; font-size: 1.1rem; font-weight: 750; letter-spacing: -.04em; }
      .mark { color: #536dfe; }
      .code { margin: 54px 0 8px; color: #536dfe; font-size: .8rem; font-weight: 750; letter-spacing: .16em; text-transform: uppercase; }
      h1 { max-width: 12ch; margin: 0; font-size: clamp(2.4rem, 8vw, 4.8rem); line-height: .98; letter-spacing: -.065em; }
      .detail { max-width: 48ch; margin: 22px 0 28px; color: #596273; font-size: 1.08rem; line-height: 1.65; }
      .home { display: inline-flex; align-items: center; min-height: 48px; padding: 0 20px; border-radius: 999px; color: white; background: #536dfe; text-decoration: none; font-weight: 700; }
      nav { display: flex; flex-wrap: wrap; gap: 8px 16px; margin-top: 38px; padding-top: 24px; border-top: 1px solid #e9ebf0; }
      nav p { flex-basis: 100%; margin: 0 0 2px; color: #596273; font-size: .85rem; }
      nav a { color: #46546b; font-size: .9rem; text-underline-offset: 3px; }
      a:focus-visible { outline: 3px solid #f5a623; outline-offset: 4px; }
    </style>
  </head>
  <body>
    <main>
      <a class="brand" href="/" aria-label="UsefulVerse home"><span class="mark" aria-hidden="true">◆</span> usefulverse</a>
      <p class="code">404 · UsefulVerse</p>
      <h1 id="not-found-heading">This page took a wrong turn.</h1>
      <p class="detail" id="not-found-detail">The address may be outdated or the page may have moved. Head back to the tools directory.</p>
      <a class="home" id="not-found-home" href="/">Browse all tools</a>
      <nav aria-label="Choose a language"><p id="not-found-languages">Choose a language</p>${languageOptions}</nav>
    </main>
    <script>
      const copy = ${JSON.stringify(messages)};
      const prefixes = ${JSON.stringify(Object.fromEntries(localeEntries.map(({ key, prefix }) => [key, prefix])))};
      const preferred = (navigator.languages || [navigator.language || 'en']).map((value) => value.toLowerCase());
      const key = Object.keys(prefixes).find((language) => preferred.some((value) => value === language || value.startsWith(language + '-'))) || 'en';
      const text = copy[key];
      document.documentElement.lang = ({ pt: 'pt-BR', zh: 'zh-CN', bn: 'bn-BD', ru: 'ru-RU', ur: 'ur-PK' })[key] || key;
      document.documentElement.dir = ['ar', 'ur'].includes(key) ? 'rtl' : 'ltr';
      document.title = text.title + ' | UsefulVerse';
      document.getElementById('not-found-heading').textContent = text.heading;
      document.getElementById('not-found-detail').textContent = text.detail;
      document.getElementById('not-found-home').textContent = text.home;
      document.getElementById('not-found-home').href = prefixes[key] ? prefixes[key] + '/' : '/';
      document.getElementById('not-found-languages').textContent = text.languages;
    </script>
  </body>
</html>`;
}

function guideBlockMarkup(block) {
  if (block.type === 'p') return `<p>${escapeHtml(block.text)}</p>`;
  if (block.type === 'note') return `<aside class="guide-note"><strong>${escapeHtml(block.title)}</strong><p>${escapeHtml(block.text)}</p></aside>`;
  if (block.type === 'formula') return `<div class="guide-formula"><span>${escapeHtml(block.label)}</span><code>${escapeHtml(block.value)}</code></div>`;
  if (block.type === 'list' || block.type === 'steps') {
    const tag = block.type === 'steps' ? 'ol' : 'ul';
    return `<${tag}>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</${tag}>`;
  }
  if (block.type === 'table') return `<div class="guide-table-wrap" role="region" aria-label="${escapeHtml(block.caption)}" tabindex="0"><table><caption>${escapeHtml(block.caption)}</caption><thead><tr>${block.headers.map((header) => `<th scope="col">${escapeHtml(header)}</th>`).join('')}</tr></thead><tbody>${block.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  return '';
}

export function renderGuidesIndex(guides, assetVersion = '') {
  const canonical = guideCanonical();
  const alternates = '';
  const schema = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'UsefulVerse Guides',
    url: canonical,
    description: 'Practical, sourced walkthroughs for common tasks and free browser tools.',
    inLanguage: 'en-US',
  })}</script>`;
  const cards = guides.map((guide) => `<a class="guide-card" href="${guidePath(guide.slug)}"><span class="eyebrow">UsefulVerse guide</span><h2>${escapeHtml(guide.title)}</h2><p>${escapeHtml(guide.description)}</p><span class="guide-card__link">Read the guide <span aria-hidden="true">↗</span></span></a>`).join('');
  return shell({
    title: 'Practical Guides for Everyday Tools | UsefulVerse',
    description: 'Clear, sourced walkthroughs for grades, Google Docs, Excel and number conversions, with free tools to finish the task.',
    canonical,
    body: `<main class="guides-page"><div class="page-container"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">UsefulVerse</a><span aria-hidden="true">/</span><span>Guides</span></nav><header class="guides-hero"><p class="eyebrow">UsefulVerse guides</p><h1>Know the steps.<br><span>Then get it done.</span></h1><p class="home-lead">Short, practical walkthroughs that explain the details a tool cannot guess for you. Each guide links to a free browser tool when it helps.</p></header><section class="guide-card-grid" aria-label="All guides">${cards}</section></div></main>`,
    schema,
    assetVersion,
    lang: 'en',
    alternates,
    defaultAlternate: false,
  });
}

export function renderGuidePage(guide, assetVersion = '') {
  const canonical = guideCanonical(guide.slug);
  const schema = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    mainEntityOfPage: canonical,
    url: canonical,
    inLanguage: 'en-US',
  })}</script><script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'UsefulVerse', item: 'https://usefulverse.com/' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: guideCanonical() },
      { '@type': 'ListItem', position: 3, name: guide.title, item: canonical },
    ],
  })}</script>`;
  const sections = guide.sections.map((section) => `<section class="guide-section"><h2>${escapeHtml(section.heading)}</h2>${section.blocks.map(guideBlockMarkup).join('')}</section>`).join('');
  const sources = guide.sources?.length ? `<section class="guide-sources" aria-labelledby="guide-sources-title"><h2 id="guide-sources-title">Sources and further reading</h2><ul>${guide.sources.map((source) => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('')}</ul></section>` : '';
  const relatedTool = tools.find((tool) => tool.id === guide.toolId);
  const toolCta = relatedTool ? `<aside class="guide-sidebar"><p class="eyebrow">Try the free tool</p><h2>${escapeHtml(relatedTool.title)}</h2><p>${escapeHtml(guide.toolCta ?? relatedTool.description)}</p><a class="button button--primary" href="${toolUrl(relatedTool.id)}">Open the tool <span aria-hidden="true">↗</span></a><p class="guide-sidebar__privacy">Runs in your browser. Your input is not uploaded.</p></aside>` : '';
  return shell({
    title: `${guide.title} | UsefulVerse`,
    description: guide.description,
    canonical,
    body: `<main class="guide-page"><div class="page-container"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">UsefulVerse</a><span aria-hidden="true">/</span><a href="${guidePath()}">Guides</a><span aria-hidden="true">/</span><span>${escapeHtml(guide.title)}</span></nav><header class="guide-hero"><p class="eyebrow">UsefulVerse guide</p><h1>${escapeHtml(guide.title)}</h1><p class="tool-lead">${escapeHtml(guide.intro)}</p></header><div class="guide-layout"><article class="guide-content">${sections}${sources}<p class="guide-backlink"><a href="${guidePath()}">← Browse all UsefulVerse guides</a></p></article>${toolCta}</div></div></main>`,
    schema,
    assetVersion,
    lang: 'en',
    alternates: '',
    localeToolId: guide.toolId,
    defaultAlternate: false,
    ogType: 'article',
  });
}

export function shell({ title, description, canonical, body, schema = '', assetVersion = '', lang = 'en', alternates = '', toolId = '', localeToolId = toolId, defaultAlternate = true, ogType = 'website' }) {
  const assetSuffix = assetVersion ? `?v=${escapeHtml(assetVersion)}` : '';
  const homeHref = localePath(lang);
  const localeCode = locales[lang]?.code ?? lang;
  const defaultAlternateTag = defaultAlternate ? `<link rel="alternate" hreflang="x-default" href="https://usefulverse.com${localePath('en', toolId)}">` : '';
  const localeSelector = `<nav class="language-switch" aria-label="Language">${localeEntries.map(({ key, code, name }) => `<a href="${localePath(key, localeToolId)}" hreflang="${code}" lang="${code}"${key === lang ? ' aria-current="page"' : ''} aria-label="${code.toUpperCase()} — ${escapeHtml(name)}">${code.toUpperCase()}</a>`).join('')}</nav>`;
  const guideNavLink = lang === 'en' ? `<a href="${guidePath()}">Guides</a>` : '';
  return `<!doctype html>
<html lang="${localeCode}" dir="${packs[lang]?.meta.direction ?? 'ltr'}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${escapeHtml(canonical)}">
    ${alternates}
    ${defaultAlternateTag}
    <meta name="theme-color" content="#0b1324">
    <meta property="og:type" content="${escapeHtml(ogType)}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta property="og:site_name" content="UsefulVerse">
    <meta property="og:locale" content="${escapeHtml((packs[lang]?.meta.tag ?? { en: 'en-US', es: 'es-ES', fr: 'fr-FR', pt: 'pt-BR', de: 'de-DE' }[lang] ?? localeCode).replace('-', '_'))}">
    <meta name="twitter:card" content="summary">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/assets/styles.css${assetSuffix}">
    ${schema}
  </head>
  <body>
    <header class="site-header"><div class="page-container site-header__inner"><a class="brand" href="${homeHref}" aria-label="UsefulVerse home"><span class="brand-mark" aria-hidden="true">◆</span><span>usefulverse</span></a><nav class="main-nav" aria-label="Main navigation"><a href="${homeHref}#tools">Tools</a><a href="${homeHref}#how-it-works">How it works</a>${guideNavLink}</nav><a class="header-cta" href="${homeHref}#tools">Find a tool <span aria-hidden="true">↗</span></a>${localeSelector}</div></header>
    ${body}
    <footer class="site-footer"><div class="page-container site-footer__inner"><a class="brand brand--footer" href="${homeHref}"><span class="brand-mark" aria-hidden="true">◆</span><span>usefulverse</span></a><p>Simple tools that respect your time and your files.</p><div class="footer-links"><a href="${homeHref}#tools">All tools</a><a href="${homeHref}#how-it-works">Privacy first</a>${lang === 'en' ? `<a href="${guidePath()}">Guides</a>` : ''}</div></div></footer>
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
      <section class="home-intro"><div class="page-container home-intro__grid"><div><p class="eyebrow">A useful place on the internet</p><h1>Do the small things<br><span>faster.</span></h1><p class="home-lead">Simple browser tools for text, data and everyday work. No account. No upload. Just open a tool and get it done.</p><div class="home-intro__actions"><a class="button button--primary button--large" href="#tools">Explore tools <span aria-hidden="true">↘</span></a>${usefulVerseSaveCard(homeUrl, true)}</div></div><div class="intro-card" aria-label="UsefulVerse principles"><div class="intro-card__orb" aria-hidden="true"><span>useful</span><strong>verse</strong></div><div class="intro-card__notes"><span>Fast by default</span><span>Private by design</span><span>Free to use</span></div></div></div></section>
      <section class="tools-section" id="tools"><div class="page-container"><div class="section-heading section-heading--tools"><div><p class="eyebrow">The toolbox</p><h2>Find the right tool.</h2></div><div class="search-wrap"><label class="sr-only" for="tool-search">Search tools</label><input id="tool-search" class="search-input" type="search" placeholder="Search tools" autocomplete="off"><span aria-hidden="true">⌕</span></div></div><div class="category-row" role="group" aria-label="Tool categories">${categories.map((category) => `<button class="category-chip${category === categories[0] ? ' is-active' : ''}" data-category-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join('')}</div><div class="tool-grid" id="tool-grid">${tools.map((tool) => toolCard(tool, language)).join('')}</div><p class="empty-state" id="empty-state" hidden>No tools match that search yet. Try another word.</p></div></section>
      <section class="how-section" id="how-it-works"><div class="page-container how-grid"><div><p class="eyebrow">Why UsefulVerse</p><h2>Small tools.<br>Clear answers.</h2></div><div class="how-points"><article><span class="step-number">01</span><h3>Open a tool</h3><p>Each tool has one clear job. You can start in seconds.</p></article><article><span class="step-number">02</span><h3>Work privately</h3><p>Your text stays in your browser for browser-first tools.</p></article><article><span class="step-number">03</span><h3>Take the result</h3><p>Copy it or use it where you need it next.</p></article></div></div></section>
    </main>`,
  });
  return language === 'en' ? rendered : translateStaticHtml(rendered, language, dynamicTranslations);
}

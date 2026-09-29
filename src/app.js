const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const language = document.documentElement.lang || 'en';
const isPortuguese = language.toLowerCase().startsWith('pt');
const isGerman = language.toLowerCase().startsWith('de');
const localeBundle = window.usefulverseLocale ?? { runtime: {}, messages: {} };
const localeConfig = localeBundle.config ?? {};
const usesCommaDecimal = isPortuguese || isGerman || Boolean(localeConfig.commaDecimal);
const languageTag = localeBundle.tag ?? { en: 'en-US', es: 'es-ES', fr: 'fr-FR', 'pt-BR': 'pt-BR', de: 'de-DE' }[language] ?? language;
const translate = (message) => localeBundle.runtime[message] ?? localeBundle.messages[message] ?? message;
const pluralRules = new Intl.PluralRules(languageTag);
// Localized parameterized message, or null so the caller keeps its built-in wording. `n` selects the plural form.
function fmt(key, values = {}) {
  const entry = localeBundle.templates?.[key];
  if (entry === undefined) return null;
  const text = typeof entry === 'string' ? entry : entry[pluralRules.select(Number(values.n ?? 0))] ?? entry.other;
  return text.replace(/\{(\w+)\}/gu, (match, name) => (Object.hasOwn(values, name) ? String(values[name]) : match));
}

if (usesCommaDecimal || localeConfig.textNumberInputs) {
  for (const input of document.querySelectorAll('.tool-workspace input[type="number"]')) {
    input.type = 'text';
    input.inputMode = ['date-offset', 'unit-input'].includes(input.id) ? 'text' : 'decimal';
  }
}

const currentLanguageLink = $('.language-switch [aria-current="page"]');
if (currentLanguageLink) currentLanguageLink.parentElement.scrollLeft = currentLanguageLink.offsetLeft - (currentLanguageLink.parentElement.clientWidth - currentLanguageLink.offsetWidth) / 2;

// Full-width IME digits/letters become ASCII (NFKC), Devanagari digits (InScript keyboards) become 0-9,
// and a leading Unicode minus, dash or katakana ー becomes '-'.
function normalizeInput(value) {
  return String(value).normalize('NFKC')
    .replace(/[०-९]/gu, (digit) => String(digit.codePointAt(0) - 0x966))
    .replace(/[٠-٩]/gu, (digit) => String(digit.codePointAt(0) - 0x660))
    .replace(/[۰-۹]/gu, (digit) => String(digit.codePointAt(0) - 0x6f0))
    .replace(/\u066b/gu, '.')
    .replace(/\u066c/gu, '')
    .trim().replace(/^[\u2010-\u2015\u2212\u30fc\ufe63]\s*(?=[\dA-Za-z])/u, '-');
}

function setStatus(element, message, type = '') {
  if (!element) return;
  element.textContent = translate(message);
  element.className = `tool-status${type ? ` is-${type}` : ''}`;
}

async function copyText(value, status) {
  if (!value) return setStatus(status, 'There is nothing to copy yet.', 'error');
  try {
    await navigator.clipboard.writeText(value);
    setStatus(status, 'Copied to your clipboard.', 'success');
  } catch {
    setStatus(status, 'Copy was blocked. Select the result and copy it manually.', 'error');
  }
}

function getTextStats(input) {
  const value = input.normalize('NFC');
  const trimmed = value.trim();
  const segmenter = localeConfig.wordSegmentation && typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(languageTag, { granularity: 'word' }) : null;
  const words = !trimmed ? 0 : segmenter ? [...segmenter.segment(trimmed)].filter((segment) => segment.isWordLike).length : trimmed.split(/\s+/u).length;
  const lines = value ? value.split(/\r?\n/u).length : 0;
  const noSpaces = [...value.replace(/\s/gu, '')].length;
  const readingUnits = localeConfig.readingUnit === 'characters' ? noSpaces : words;
  return { words, characters: [...value].length, noSpaces, lines, reading: readingUnits ? Math.max(1, Math.ceil(readingUnits / (localeConfig.readingRate ?? 200))) : 0 };
}

function setupWordCounter(root) {
  const input = $('#tool-input', root);
  const status = $('#tool-status', root);
  const update = () => {
    const stats = getTextStats(input.value);
    $('#metric-words', root).textContent = stats.words;
    $('#metric-characters', root).textContent = stats.characters;
    $('#metric-characters-no-spaces', root).textContent = stats.noSpaces;
    $('#metric-lines', root).textContent = stats.lines;
    $('#metric-reading-time', root).textContent = fmt('reading.minutes', { n: stats.reading, count: stats.reading }) ?? `${stats.reading} ${isGerman ? 'Min.' : 'min'}`;
  };
  input.addEventListener('input', update);
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'clear') { input.value = ''; update(); input.focus(); }
    if (action === 'copy-summary') {
      const stats = getTextStats(input.value);
      const summary = fmt('summary', { words: stats.words, characters: stats.characters, noSpaces: stats.noSpaces, lines: stats.lines, reading: stats.reading });
      if (summary !== null) { copyText(summary, status); return; }
      const summaryLabels = language === 'es' ? ['Palabras', 'Caracteres', 'Caracteres sin espacios', 'Líneas', 'Tiempo de lectura'] : language === 'fr' ? ['Mots', 'Caractères', 'Caractères sans espaces', 'Lignes', 'Temps de lecture'] : isPortuguese ? ['Palavras', 'Caracteres', 'Caracteres sem espaços', 'Linhas', 'Tempo de leitura'] : isGerman ? ['Wörter', 'Zeichen', 'Zeichen ohne Leerzeichen', 'Zeilen', 'Lesezeit'] : ['Words', 'Characters', 'Characters without spaces', 'Lines', 'Reading time'];
      copyText(`${summaryLabels[0]}: ${stats.words}\n${summaryLabels[1]}: ${stats.characters}\n${summaryLabels[2]}: ${stats.noSpaces}\n${summaryLabels[3]}: ${stats.lines}\n${summaryLabels[4]}: ${stats.reading} ${isGerman ? 'Min.' : 'min'}`, status);
    }
  });
}

function setupCaseConverter(root) {
  const input = $('#tool-input', root);
  const output = $('#tool-output', root);
  const status = $('#tool-status', root);
  const update = (mode) => {
    const value = input.value;
    if (mode === 'upper') output.value = value.toLocaleUpperCase();
    if (mode === 'lower') output.value = value.toLocaleLowerCase();
    if (mode === 'sentence') output.value = value.toLocaleLowerCase().replace(/(^|[.!?]\s+)(\p{L})/gu, (_, start, letter) => `${start}${letter.toLocaleUpperCase()}`);
    if (mode === 'title') output.value = value.toLocaleLowerCase().replace(/\b[\p{L}\d]/gu, (letter) => letter.toLocaleUpperCase());
  };
  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-case]');
    if (button) { $$('.button-row [data-case]', root).forEach((item) => item.classList.toggle('button--primary', item === button)); $$('.button-row [data-case]', root).forEach((item) => item.classList.toggle('button--ghost', item !== button)); update(button.dataset.case); }
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'clear') { input.value = ''; output.value = ''; input.focus(); }
    if (action === 'copy-output') copyText(output.value, status);
  });
  input.addEventListener('input', () => update($('.button-row [data-case].button--primary', root)?.dataset.case || 'upper'));
}

function setupDedupe(root) {
  const input = $('#tool-input', root);
  const output = $('#tool-output', root);
  const status = $('#tool-status', root);
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'dedupe') {
      const trim = $('#trim-lines', root).checked;
      const ignoreCase = $('#ignore-case', root).checked;
      const removeEmpty = $('#remove-empty', root).checked;
      const seen = new Set();
      const lines = input.value.split(/\r?\n/u).map((line) => trim ? line.trim() : line).filter((line) => !removeEmpty || line !== '').filter((line) => { const key = ignoreCase ? line.toLocaleLowerCase() : line; if (seen.has(key)) return false; seen.add(key); return true; });
      output.value = lines.join('\n');
      setStatus(status, fmt('dedupe.kept', { n: lines.length, count: formatNumber(lines.length) }) ?? (language === 'es' ? `${lines.length} ${lines.length === 1 ? 'línea única conservada.' : 'líneas únicas conservadas.'}` : language === 'fr' ? `${lines.length} ${lines.length === 1 ? 'ligne unique conservée.' : 'lignes uniques conservées.'}` : isPortuguese ? `${lines.length} ${lines.length === 1 ? 'linha única mantida.' : 'linhas únicas mantidas.'}` : isGerman ? `${lines.length} ${lines.length === 1 ? 'eindeutige Zeile behalten.' : 'eindeutige Zeilen behalten.'}` : `${lines.length} unique line${lines.length === 1 ? '' : 's'} kept.`), 'success');
    }
    if (action === 'clear') { input.value = ''; output.value = ''; setStatus(status, 'Your cleaned list will appear here.'); input.focus(); }
    if (action === 'copy-output') copyText(output.value, status);
  });
}

function setupJson(root) {
  const input = $('#tool-input', root);
  const output = $('#tool-output', root);
  const status = $('#tool-status', root);
  const convert = (spacing) => {
    try {
      const parsed = JSON.parse(input.value);
      output.value = JSON.stringify(parsed, null, spacing);
      setStatus(status, 'Valid JSON. Your result is ready.', 'success');
    } catch (error) {
      output.value = '';
      setStatus(status, language === 'en' ? `This JSON has an error: ${error.message.replace(/^JSON\.parse:\s*/u, '')}` : 'Invalid JSON. Check the quotes, commas and brackets.', 'error');
    }
  };
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'format-json') convert(2);
    if (action === 'minify-json') convert(0);
    if (action === 'clear') { input.value = ''; output.value = ''; setStatus(status, 'Paste JSON to validate it.'); input.focus(); }
    if (action === 'copy-output') copyText(output.value, status);
  });
}

function utf8ToBase64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function base64ToUtf8(value) {
  const binary = atob(value.replace(/\s/gu, ''));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function setupBase64(root) {
  let mode = 'encode';
  const input = $('#tool-input', root);
  const output = $('#tool-output', root);
  const status = $('#tool-status', root);
  root.addEventListener('click', (event) => {
    const modeButton = event.target.closest('[data-mode]');
    if (modeButton) { mode = modeButton.dataset.mode; $$('.segment', root).forEach((item) => item.classList.toggle('is-active', item === modeButton)); input.placeholder = translate(mode === 'encode' ? 'Text to encode...' : 'Base64 to decode...'); }
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'convert-base64') {
      try { output.value = mode === 'encode' ? utf8ToBase64(input.value) : base64ToUtf8(input.value); setStatus(status, 'Conversion complete.', 'success'); }
      catch { output.value = ''; setStatus(status, 'That does not look like valid Base64 text.', 'error'); }
    }
    if (action === 'clear') { input.value = ''; output.value = ''; setStatus(status, 'Runs only in your browser.'); input.focus(); }
    if (action === 'copy-output') copyText(output.value, status);
  });
}

function setupUrl(root) {
  let mode = 'encode';
  const input = $('#tool-input', root);
  const output = $('#tool-output', root);
  const status = $('#tool-status', root);
  root.addEventListener('click', (event) => {
    const modeButton = event.target.closest('[data-mode]');
    if (modeButton) { mode = modeButton.dataset.mode; $$('.segment', root).forEach((item) => item.classList.toggle('is-active', item === modeButton)); }
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'convert-url') {
      try { output.value = mode === 'encode' ? encodeURIComponent(input.value) : decodeURIComponent(input.value); setStatus(status, 'Conversion complete.', 'success'); }
      catch { output.value = ''; setStatus(status, 'This text has an invalid URL escape sequence.', 'error'); }
    }
    if (action === 'clear') { input.value = ''; output.value = ''; setStatus(status, 'Use encode for text that must travel safely inside a URL.'); input.focus(); }
    if (action === 'copy-output') copyText(output.value, status);
  });
}

function makeSlug(value, preserveLanguage, keepNumbers) {
  let result = value.normalize('NFKD').replace(/[\u0300-\u036f]/gu, '').normalize('NFC');
  result = preserveLanguage ? result.replace(/[^\p{L}\p{M}\p{N}\s-]/gu, '') : result.replace(/[^\p{Script=Latin}\p{N}\s-]/gu, '');
  if (!keepNumbers) result = result.replace(/\d/gu, '');
  return result.toLocaleLowerCase().trim().replace(/[\s_-]+/gu, '-').replace(/^-+|-+$/gu, '');
}

function setupSlug(root) {
  const input = $('#tool-input', root);
  const output = $('#tool-output', root);
  const status = $('#tool-status', root);
  const update = () => { output.value = makeSlug(input.value, $('#preserve-language', root).checked, $('#keep-numbers', root).checked); };
  input.addEventListener('input', update);
  root.addEventListener('change', update);
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'make-slug') { update(); setStatus(status, output.value ? 'Slug created.' : 'Type a title first.', output.value ? 'success' : 'error'); }
    if (action === 'copy-output') copyText(output.value, status);
    if (action === 'clear') { input.value = ''; output.value = ''; setStatus(status, 'A good slug is short, clear and easy to read.'); input.focus(); }
  });
}

function numberValue(root, id) {
  const value = parseInputNumber($(`#${id}`, root)?.value ?? '');
  return Number.isFinite(value) ? value : null;
}

function parseInputNumber(value) {
  const raw = normalizeInput(value);
  if (!raw) return NaN;
  if (!usesCommaDecimal) return Number(/^[-+]?\d{1,3}(?:,\d{2,3})*,\d{3}(?:\.\d+)?$/u.test(raw) ? raw.replaceAll(',', '') : raw);
  if (raw.includes(',')) return Number(raw.replace(/\./gu, '').replace(',', '.'));
  if (/^-?\d{1,3}(?:\.\d{3})+$/u.test(raw)) return Number(raw.replace(/\./gu, ''));
  return Number(raw);
}

// Plain number (no grouping) with the locale's decimal separator, for values users copy or edit.
function localDecimal(value) {
  return usesCommaDecimal ? String(value).replace('.', ',') : String(value);
}

// Search matches with or without Latin accents and the Devanagari nukta, and full-width/precomposed forms.
function searchKey(text) {
  return text.normalize('NFKD').replace(/[\u0300-\u036f\u093c]/gu, '').normalize('NFC').toLocaleLowerCase();
}

function formatNumber(value) {
  return new Intl.NumberFormat(languageTag, { maximumFractionDigits: 6, ...(localeConfig.numberingSystem ? { numberingSystem: localeConfig.numberingSystem } : {}) }).format(value);
}

function setupPercentage(root) {
  const status = $('#tool-status', root);
  const calculate = () => {
    const percent = numberValue(root, 'percent-value');
    const base = numberValue(root, 'percent-base');
    const part = numberValue(root, 'percent-part');
    const whole = numberValue(root, 'percent-whole');
    const oldValue = numberValue(root, 'percent-old');
    const newValue = numberValue(root, 'percent-new');
    const answers = [];
    if (percent !== null && base !== null) {
      const result = percent / 100 * base;
      $('#percent-result', root).textContent = `${formatNumber(result)}`;
      answers.push(fmt('percent.of', { percent: formatNumber(percent), base: formatNumber(base), result: formatNumber(result) }) ?? (language === 'es' || language === 'fr' ? `${formatNumber(percent)} % de ${formatNumber(base)} = ${formatNumber(result)}` : isPortuguese ? `${formatNumber(percent)}% de ${formatNumber(base)} = ${formatNumber(result)}` : isGerman ? `${formatNumber(percent)} % von ${formatNumber(base)} = ${formatNumber(result)}` : `${formatNumber(percent)}% of ${formatNumber(base)} = ${formatNumber(result)}`));
    } else $('#percent-result', root).textContent = '—';
    if (part !== null && whole !== null && whole !== 0) {
      const result = part / whole * 100;
      $('#what-percent-result', root).textContent = `${formatNumber(result)}%`;
      answers.push(fmt('percent.share', { part: formatNumber(part), result: formatNumber(result), whole: formatNumber(whole) }) ?? (language === 'es' ? `${formatNumber(part)} representa el ${formatNumber(result)} % de ${formatNumber(whole)}` : language === 'fr' ? `${formatNumber(part)} représente ${formatNumber(result)} % de ${formatNumber(whole)}` : isPortuguese ? `${formatNumber(part)} representa ${formatNumber(result)}% de ${formatNumber(whole)}` : isGerman ? `${formatNumber(part)} sind ${formatNumber(result)} % von ${formatNumber(whole)}` : `${formatNumber(part)} is ${formatNumber(result)}% of ${formatNumber(whole)}`));
    } else $('#what-percent-result', root).textContent = '—';
    if (oldValue !== null && newValue !== null && oldValue !== 0) {
      const result = (newValue - oldValue) / Math.abs(oldValue) * 100;
      $('#change-result', root).textContent = `${result >= 0 ? '+' : ''}${formatNumber(result)}%`;
      answers.push(fmt('percent.change', { from: formatNumber(oldValue), to: formatNumber(newValue), change: `${result >= 0 ? '+' : ''}${formatNumber(result)}` }) ?? (language === 'es' ? `Cambio de ${formatNumber(oldValue)} a ${formatNumber(newValue)} = ${result >= 0 ? '+' : ''}${formatNumber(result)} %` : language === 'fr' ? `Variation de ${formatNumber(oldValue)} à ${formatNumber(newValue)} = ${result >= 0 ? '+' : ''}${formatNumber(result)} %` : isPortuguese ? `Variação de ${formatNumber(oldValue)} para ${formatNumber(newValue)} = ${result >= 0 ? '+' : ''}${formatNumber(result)}%` : isGerman ? `Änderung von ${formatNumber(oldValue)} auf ${formatNumber(newValue)} = ${result >= 0 ? '+' : ''}${formatNumber(result)} %` : `Change from ${formatNumber(oldValue)} to ${formatNumber(newValue)} = ${result >= 0 ? '+' : ''}${formatNumber(result)}%`));
    } else $('#change-result', root).textContent = '—';
    setStatus(status, answers.length ? 'Calculation complete.' : 'Enter valid numbers to calculate.', answers.length ? 'success' : 'error');
    return answers;
  };
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'calculate-percentage') calculate();
    if (action === 'copy-summary') copyText(calculate().join('\n'), status);
    if (action === 'clear') { $$('input', root).forEach((input) => { input.value = ''; }); $$('output', root).forEach((output) => { output.textContent = '—'; }); setStatus(status, 'Fill in any calculation you need.'); $('#percent-value', root).focus(); }
  });
}

const passwordSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}:,.?/',
};

function secureRandomIndex(max) {
  const values = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;
  do crypto.getRandomValues(values); while (values[0] >= limit);
  return values[0] % max;
}

function randomCharacter(characters) {
  return characters[secureRandomIndex(characters.length)];
}

function setupPassword(root) {
  const output = $('#password-output', root);
  const status = $('#tool-status', root);
  const strength = $('#password-strength', root);
  const length = $('#password-length', root);
  const updateLength = () => { $('#password-length-value', root).textContent = length.value; };
  const generate = () => {
    const selected = ['uppercase', 'lowercase', 'numbers', 'symbols'].filter((name) => $(`#include-${name}`, root).checked);
    if (!selected.length) { output.value = ''; strength.textContent = ''; setStatus(status, 'Choose at least one character type.', 'error'); return; }
    const excludeAmbiguous = $('#exclude-ambiguous', root).checked;
    const sets = selected.map((name) => excludeAmbiguous ? passwordSets[name].replace(/[Il1O0]/gu, '') : passwordSets[name]);
    const allCharacters = sets.join('');
    const targetLength = Number(length.value);
    const characters = sets.map((set) => randomCharacter(set));
    while (characters.length < targetLength) characters.push(randomCharacter(allCharacters));
    for (let index = characters.length - 1; index > 0; index -= 1) {
      const swap = secureRandomIndex(index + 1);
      [characters[index], characters[swap]] = [characters[swap], characters[index]];
    }
    output.value = characters.join('');
    strength.textContent = translate(targetLength >= 20 && selected.length >= 3 ? 'Strong' : 'Good');
    setStatus(status, 'Password created locally. Store it in a password manager.', 'success');
  };
  length.addEventListener('input', updateLength);
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'generate-password') generate();
    if (action === 'copy-output') copyText(output.value, status);
  });
  updateLength();
}

function setupTimestamp(root) {
  const status = $('#tool-status', root);
  const fromTimestamp = () => {
    const raw = normalizeInput($('#timestamp-unix', root).value);
    const numeric = parseInputNumber(raw);
    if (!raw || !Number.isFinite(numeric)) { setStatus(status, 'Enter a valid Unix timestamp.', 'error'); return; }
    const milliseconds = Math.abs(numeric) >= 100000000000 ? numeric : numeric * 1000;
    const date = new Date(milliseconds);
    if (Number.isNaN(date.getTime())) { setStatus(status, 'That timestamp is outside the supported date range.', 'error'); return; }
    $('#timestamp-utc', root).textContent = date.toISOString();
    $('#timestamp-local', root).textContent = date.toLocaleString(languageTag, { dateStyle: 'medium', timeStyle: 'medium' });
    setStatus(status, 'Date converted.', 'success');
  };
  const toTimestamp = () => {
    const raw = $('#timestamp-date', root).value;
    const milliseconds = raw ? new Date(raw).getTime() : NaN;
    if (Number.isNaN(milliseconds)) { setStatus(status, 'Choose a valid date and time.', 'error'); return; }
    $('#timestamp-seconds', root).textContent = Math.floor(milliseconds / 1000);
    $('#timestamp-milliseconds', root).textContent = milliseconds;
    setStatus(status, 'Timestamp converted.', 'success');
  };
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'from-timestamp') fromTimestamp();
    if (action === 'to-timestamp') toTimestamp();
    if (action === 'copy-summary') {
      const local = $('#timestamp-local', root).textContent; const seconds = $('#timestamp-seconds', root).textContent; const milliseconds = $('#timestamp-milliseconds', root).textContent;
      const values = [`UTC: ${$('#timestamp-utc', root).textContent}`, fmt('timestamp.local', { value: local }) ?? `Local time: ${local}`, fmt('timestamp.seconds', { value: seconds }) ?? `Seconds: ${seconds}`, fmt('timestamp.milliseconds', { value: milliseconds }) ?? `Milliseconds: ${milliseconds}`].filter((value) => !value.endsWith('—'));
      copyText(values.join('\n'), status);
    }
    if (action === 'clear') { $$('input', root).forEach((input) => { input.value = ''; }); $$('output', root).forEach((output) => { output.textContent = '—'; }); setStatus(status, 'Your dates stay in this browser.'); }
  });
}

function setupHtmlEntities(root) {
  let mode = 'encode';
  const input = $('#tool-input', root);
  const output = $('#tool-output', root);
  const status = $('#tool-status', root);
  const encode = (value) => value.replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/"/gu, '&quot;').replace(/'/gu, '&#39;');
  const decode = (value) => { const textarea = document.createElement('textarea'); textarea.innerHTML = value; return textarea.value; };
  root.addEventListener('click', (event) => {
    const modeButton = event.target.closest('[data-mode]');
    if (modeButton) { mode = modeButton.dataset.mode; $$('.segment', root).forEach((item) => item.classList.toggle('is-active', item === modeButton)); }
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'convert-html-entity') { output.value = mode === 'encode' ? encode(input.value) : decode(input.value); setStatus(status, 'Conversion complete.', 'success'); }
    if (action === 'clear') { input.value = ''; output.value = ''; setStatus(status, 'Runs only in your browser.'); input.focus(); }
    if (action === 'copy-output') copyText(output.value, status);
  });
}

function parseCsv(value) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (quoted) {
      if (character === '"' && value[index + 1] === '"') { field += '"'; index += 1; }
      else if (character === '"') quoted = false;
      else field += character;
    } else if (character === '"' && field === '') quoted = true;
    else if (character === ',') { row.push(field); field = ''; }
    else if (character === '\n' || character === '\r') {
      if (character === '\r' && value[index + 1] === '\n') index += 1;
      row.push(field); field = '';
      if (row.some((cell) => cell !== '')) rows.push(row);
      row = [];
    } else field += character;
  }
  if (quoted) throw new Error('A quoted field was not closed.');
  if (field !== '' || row.length) { row.push(field); if (row.some((cell) => cell !== '')) rows.push(row); }
  return rows;
}

function setupCsvToJson(root) {
  const input = $('#tool-input', root);
  const output = $('#tool-output', root);
  const status = $('#tool-status', root);
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'csv-to-json') {
      try {
        const rows = parseCsv(input.value);
        if (rows.length < 2) throw new Error('Add a header row and at least one data row.');
        const used = new Map();
        const headers = rows[0].map((header, index) => { const base = header.trim() || `column_${index + 1}`; const count = (used.get(base) || 0) + 1; used.set(base, count); return count === 1 ? base : `${base}_${count}`; });
        const result = rows.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ''])));
        output.value = JSON.stringify(result, null, 2);
        setStatus(status, fmt('rows.converted', { n: result.length, count: formatNumber(result.length) }) ?? (language === 'es' ? `${result.length} ${result.length === 1 ? 'fila convertida.' : 'filas convertidas.'}` : language === 'fr' ? `${result.length} ${result.length === 1 ? 'ligne convertie.' : 'lignes converties.'}` : isPortuguese ? `${result.length} ${result.length === 1 ? 'linha convertida.' : 'linhas convertidas.'}` : isGerman ? `${result.length} ${result.length === 1 ? 'Zeile umgewandelt.' : 'Zeilen umgewandelt.'}` : `${result.length} row${result.length === 1 ? '' : 's'} converted.`), 'success');
      } catch (error) { output.value = ''; setStatus(status, language === 'en' ? error.message : 'Could not convert the CSV. Check the header row, commas and quotes.', 'error'); }
    }
    if (action === 'clear') { input.value = ''; output.value = ''; setStatus(status, 'The first row becomes the JSON keys.'); input.focus(); }
    if (action === 'copy-output') copyText(output.value, status);
  });
}

function csvCell(value) {
  const text = value === null || value === undefined ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
  return /[",\n\r]/u.test(text) ? `"${text.replace(/"/gu, '""')}"` : text;
}

function setupJsonToCsv(root) {
  const input = $('#tool-input', root);
  const output = $('#tool-output', root);
  const status = $('#tool-status', root);
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'json-to-csv') {
      try {
        const parsed = JSON.parse(input.value);
        if (!Array.isArray(parsed) || !parsed.length || parsed.some((item) => !item || typeof item !== 'object' || Array.isArray(item))) throw new Error('Use a non-empty array of JSON objects.');
        const headers = [...new Set(parsed.flatMap((item) => Object.keys(item)))];
        output.value = [headers.map(csvCell).join(','), ...parsed.map((item) => headers.map((header) => csvCell(item[header])).join(','))].join('\n');
      setStatus(status, fmt('rows.converted', { n: parsed.length, count: formatNumber(parsed.length) }) ?? (language === 'es' ? `${parsed.length} ${parsed.length === 1 ? 'fila convertida.' : 'filas convertidas.'}` : language === 'fr' ? `${parsed.length} ${parsed.length === 1 ? 'ligne convertie.' : 'lignes converties.'}` : isPortuguese ? `${parsed.length} ${parsed.length === 1 ? 'linha convertida.' : 'linhas convertidas.'}` : isGerman ? `${parsed.length} ${parsed.length === 1 ? 'Zeile umgewandelt.' : 'Zeilen umgewandelt.'}` : `${parsed.length} row${parsed.length === 1 ? '' : 's'} converted.`), 'success');
      } catch (error) { output.value = ''; setStatus(status, language === 'en' ? (error.message.startsWith('Unexpected') ? `Invalid JSON: ${error.message}` : error.message) : 'Could not convert the JSON. Check that it is an array of objects with valid syntax.', 'error'); }
    }
    if (action === 'clear') { input.value = ''; output.value = ''; setStatus(status, 'Use an array of JSON objects with a shared set of keys.'); input.focus(); }
    if (action === 'copy-output') copyText(output.value, status);
  });
}

function secureRandomFloat() {
  const values = new Uint32Array(2);
  crypto.getRandomValues(values);
  return ((values[0] * 0x200000 + (values[1] >>> 11)) / 0x20000000000000);
}

function setupRandomNumber(root) {
  const result = $('#random-result', root);
  const status = $('#tool-status', root);
  const generate = () => {
    const min = parseInputNumber($('#random-min', root).value);
    const max = parseInputNumber($('#random-max', root).value);
    const integer = $('#random-integer', root).checked;
    if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) { result.textContent = '—'; setStatus(status, 'Enter a valid minimum and maximum.', 'error'); return; }
    if (integer) {
      const low = Math.ceil(min);
      const high = Math.floor(max);
      if (low > high || high - low >= 0x100000000) { result.textContent = '—'; setStatus(status, 'Use an integer range smaller than 4.29 billion.', 'error'); return; }
      result.textContent = String(low + secureRandomIndex(high - low + 1));
    } else result.textContent = localDecimal(min + secureRandomFloat() * (max - min));
    setStatus(status, 'Random number generated locally.', 'success');
  };
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'generate-number') generate();
    if (action === 'copy-output') copyText(result.textContent === '—' ? '' : result.textContent, status);
    if (action === 'clear') { $('#random-min', root).value = ''; $('#random-max', root).value = ''; result.textContent = '—'; setStatus(status, 'Uses your browser’s secure random source.'); $('#random-min', root).focus(); }
  });
}

function setupUuid(root) {
  const output = $('#tool-output', root);
  const status = $('#tool-status', root);
  const generate = () => {
    const count = parseInputNumber($('#uuid-count', root).value);
    if (!Number.isInteger(count) || count < 1 || count > 100) { setStatus(status, 'Choose a number from 1 to 100.', 'error'); return; }
    output.value = Array.from({ length: count }, () => crypto.randomUUID()).join('\n');
    setStatus(status, fmt('uuid.generated', { n: count, count: formatNumber(count) }) ?? (language === 'es' ? `${count} ${count === 1 ? 'UUID generado localmente.' : 'UUID generados localmente.'}` : language === 'fr' ? `${count} ${count === 1 ? 'UUID généré localement.' : 'UUID générés localement.'}` : isPortuguese ? `${count} ${count === 1 ? 'UUID gerado localmente.' : 'UUIDs gerados localmente.'}` : isGerman ? `${count} UUID${count === 1 ? '' : 's'} lokal erstellt.` : `${count} UUID${count === 1 ? '' : 's'} generated locally.`), 'success');
  };
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'generate-uuids') generate();
    if (action === 'copy-output') copyText(output.value, status);
    if (action === 'clear') { output.value = ''; setStatus(status, 'Generated locally with your browser’s secure random source.'); $('#uuid-count', root).focus(); }
  });
}

function setupSha256(root) {
  const input = $('#tool-input', root);
  const output = $('#tool-output', root);
  const status = $('#tool-status', root);
  const hash = async () => {
    try {
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input.value));
      output.value = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
      setStatus(status, 'SHA-256 hash created locally.', 'success');
    } catch { output.value = ''; setStatus(status, 'Your browser could not create the hash.', 'error'); }
  };
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'hash-sha256') hash();
    if (action === 'copy-output') copyText(output.value, status);
    if (action === 'clear') { input.value = ''; output.value = ''; setStatus(status, 'The text stays in this browser.'); input.focus(); }
  });
}

function setupRegex(root) {
  const pattern = $('#regex-pattern', root);
  const flags = $('#regex-flags', root);
  const input = $('#regex-test', root);
  const output = $('#regex-output', root);
  const count = $('#regex-match-count', root);
  const status = $('#tool-status', root);
  const test = () => {
    try {
      if (!pattern.value) throw new Error('Enter a regular expression pattern.');
      const expression = new RegExp(pattern.value, flags.value.includes('g') ? flags.value : `${flags.value}g`);
      const matches = [...input.value.matchAll(expression)].slice(0, 1000).map((match) => match[0]);
      count.textContent = matches.length;
      output.textContent = matches.length ? matches.join('\n') : translate('No matches found.');
      setStatus(status, matches.length ? (fmt('regex.matches', { n: matches.length, count: formatNumber(matches.length) }) ?? (language === 'es' ? `${matches.length} ${matches.length === 1 ? 'coincidencia encontrada.' : 'coincidencias encontradas.'}` : language === 'fr' ? `${matches.length} ${matches.length === 1 ? 'correspondance trouvée.' : 'correspondances trouvées.'}` : isPortuguese ? `${matches.length} ${matches.length === 1 ? 'correspondência encontrada.' : 'correspondências encontradas.'}` : isGerman ? `${matches.length} ${matches.length === 1 ? 'Treffer gefunden.' : 'Treffer gefunden.'}` : `${matches.length} match${matches.length === 1 ? '' : 'es'} found.`)) : 'No matches found.', matches.length ? 'success' : '');
    } catch (error) { count.textContent = '0'; output.textContent = translate('No matches yet.'); setStatus(status, language === 'en' ? `Invalid regular expression: ${error.message}` : 'Enter a valid regular expression and supported flags.', 'error'); }
  };
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'test-regex') test();
    if (action === 'clear') { pattern.value = ''; flags.value = 'gi'; input.value = ''; count.textContent = '0'; output.textContent = translate('No matches yet.'); setStatus(status, 'Regular expressions run locally in your browser.'); pattern.focus(); }
  });
}

function decodeBase64Url(value) {
  const normalized = value.replace(/-/gu, '+').replace(/_/gu, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function setupJwt(root) {
  const input = $('#tool-input', root);
  const header = $('#jwt-header', root);
  const payload = $('#jwt-payload', root);
  const status = $('#tool-status', root);
  const decode = () => {
    try {
      const parts = input.value.trim().split('.');
      if (parts.length !== 3) throw new Error('A JWT must have three dot-separated parts.');
      header.textContent = JSON.stringify(JSON.parse(decodeBase64Url(parts[0])), null, 2);
      payload.textContent = JSON.stringify(JSON.parse(decodeBase64Url(parts[1])), null, 2);
      setStatus(status, 'Header and payload decoded. Signature was not verified.', 'success');
    } catch (error) { header.textContent = '—'; payload.textContent = '—'; setStatus(status, language === 'en' ? `Could not decode this JWT: ${error.message}` : 'This JWT could not be decoded. Check that it has three dot-separated parts and valid Base64URL data.', 'error'); }
  };
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'decode-jwt') decode();
    if (action === 'clear') { input.value = ''; header.textContent = '—'; payload.textContent = '—'; setStatus(status, 'Decoding does not verify a token or its signature.'); input.focus(); }
  });
}

function clampColor(value, min = 0, max = 255) { return Math.min(max, Math.max(min, value)); }

function hslToRgb(hue, saturation, lightness) {
  const h = ((hue % 360) + 360) % 360 / 360;
  const s = saturation / 100;
  const l = lightness / 100;
  if (s === 0) return [l, l, l].map((value) => Math.round(value * 255));
  const hueToRgb = (p, q, t) => { let adjusted = t; if (adjusted < 0) adjusted += 1; if (adjusted > 1) adjusted -= 1; if (adjusted < 1 / 6) return p + (q - p) * 6 * adjusted; if (adjusted < 1 / 2) return q; if (adjusted < 2 / 3) return p + (q - p) * (2 / 3 - adjusted) * 6; return p; };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [h + 1 / 3, h, h - 1 / 3].map((value) => Math.round(hueToRgb(p, q, value) * 255));
}

function rgbToHsl(red, green, blue) {
  const r = red / 255; const g = green / 255; const b = blue / 255;
  const max = Math.max(r, g, b); const min = Math.min(r, g, b); const difference = max - min;
  let hue = 0; const lightness = (max + min) / 2;
  if (difference) {
    const saturation = difference / (1 - Math.abs(2 * lightness - 1));
    if (max === r) hue = ((g - b) / difference) % 6;
    else if (max === g) hue = (b - r) / difference + 2;
    else hue = (r - g) / difference + 4;
    hue = Math.round(hue * 60); if (hue < 0) hue += 360;
    return [hue, Math.round(saturation * 100), Math.round(lightness * 100)];
  }
  return [0, 0, Math.round(lightness * 100)];
}

function parseColor(value) {
  const text = value.trim();
  const hex = text.match(/^#?([\da-f]{3}|[\da-f]{6})$/iu);
  if (hex) {
    const digits = hex[1].length === 3 ? hex[1].split('').map((digit) => `${digit}${digit}`).join('') : hex[1];
    return [0, 2, 4].map((index) => Number.parseInt(digits.slice(index, index + 2), 16));
  }
  const rgb = text.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/iu);
  if (rgb) { const values = rgb.slice(1).map(Number); if (values.every((item) => item >= 0 && item <= 255)) return values.map(Math.round); }
  const hsl = text.match(/^hsla?\(\s*([\d.+-]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)$/iu);
  if (hsl) { const values = hsl.slice(1).map(Number); if (values[1] >= 0 && values[1] <= 100 && values[2] >= 0 && values[2] <= 100) return hslToRgb(values[0], values[1], values[2]); }
  throw new Error('Use HEX, RGB or HSL, for example #4D6BFF.');
}

function setupColor(root) {
  const input = $('#color-value', root);
  const preview = $('#color-preview', root);
  const status = $('#tool-status', root);
  const outputs = { hex: $('#color-hex', root), rgb: $('#color-rgb', root), hsl: $('#color-hsl', root) };
  const convert = () => {
    try {
      const [red, green, blue] = parseColor(input.value);
      const hex = `#${[red, green, blue].map((value) => value.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
      const hsl = rgbToHsl(red, green, blue);
      outputs.hex.textContent = hex; outputs.rgb.textContent = `rgb(${red}, ${green}, ${blue})`; outputs.hsl.textContent = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
      preview.style.backgroundColor = hex; setStatus(status, 'Color converted.', 'success');
    } catch (error) { Object.values(outputs).forEach((output) => { output.textContent = '—'; }); preview.style.backgroundColor = 'transparent'; setStatus(status, language === 'en' ? error.message : 'Use a valid HEX, RGB or HSL color, such as #4D6BFF.', 'error'); }
  };
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'convert-color') convert();
    if (action === 'clear') { input.value = ''; Object.values(outputs).forEach((output) => { output.textContent = '—'; }); preview.style.backgroundColor = 'transparent'; setStatus(status, 'Supports HEX, RGB and HSL colors.'); input.focus(); }
  });
  convert();
}

function setupUrlParser(root) {
  const input = $('#tool-input', root);
  const status = $('#tool-status', root);
  const fields = ['protocol', 'host', 'path', 'query', 'hash'].reduce((map, name) => ({ ...map, [name]: $(`#url-${name}`, root) }), {});
  const params = $('#url-params', root);
  const parse = () => {
    try {
      const url = new URL(input.value.trim());
      fields.protocol.textContent = url.protocol;
      fields.host.textContent = url.host || '—';
      fields.path.textContent = url.pathname || '/';
      fields.query.textContent = url.search || (fmt('url.none') ?? '(none)');
      fields.hash.textContent = url.hash || (fmt('url.none') ?? '(none)');
      const entries = [...url.searchParams.entries()].map(([name, value]) => ({ name, value }));
      params.textContent = entries.length ? JSON.stringify(entries, null, 2) : translate('No query parameters.');
      setStatus(status, 'URL parsed locally.', 'success');
    } catch { Object.values(fields).forEach((field) => { field.textContent = '—'; }); params.textContent = '—'; setStatus(status, 'Enter a complete URL, including https://.', 'error'); }
  };
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'parse-url') parse();
    if (action === 'clear') { input.value = ''; Object.values(fields).forEach((field) => { field.textContent = '—'; }); params.textContent = '—'; setStatus(status, 'The URL is analyzed locally.'); input.focus(); }
  });
}

const romanValues = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];

function numberToRoman(value) {
  let remaining = value;
  return romanValues.reduce((result, [number, symbol]) => {
    const count = Math.floor(remaining / number);
    remaining %= number;
    return result + symbol.repeat(count);
  }, '');
}

function romanToNumber(value) {
  const normalized = normalizeInput(value).toUpperCase();
  if (!normalized || !/^[IVXLCDM]+$/u.test(normalized)) throw new Error('Use Roman numerals I, V, X, L, C, D or M.');
  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let index = 0; index < normalized.length; index += 1) total += values[normalized[index]] < (values[normalized[index + 1]] || 0) ? -values[normalized[index]] : values[normalized[index]];
  if (total < 1 || total > 3999 || numberToRoman(total) !== normalized) throw new Error('That is not a standard Roman numeral from 1 to 3,999.');
  return total;
}

function setupRoman(root) {
  const status = $('#tool-status', root);
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    try {
      if (action === 'number-to-roman') {
        const value = parseInputNumber($('#roman-number', root).value);
        if (!Number.isInteger(value) || value < 1 || value > 3999) throw new Error('Enter a whole number from 1 to 3,999.');
        $('#roman-output', root).textContent = numberToRoman(value); setStatus(status, 'Number converted.', 'success');
      }
      if (action === 'roman-to-number') { $('#number-output', root).textContent = romanToNumber($('#roman-input', root).value); setStatus(status, 'Roman numeral converted.', 'success'); }
      if (action === 'clear') { $$('input', root).forEach((input) => { input.value = ''; }); $$('output', root).forEach((output) => { output.textContent = '—'; }); setStatus(status, 'Conversions run only in your browser.'); }
    } catch (error) { setStatus(status, language === 'en' ? error.message : 'Use a valid whole number or Roman numeral between 1 and 3,999.', 'error'); }
  });
}

function parseBaseInteger(value, base) {
  const text = normalizeInput(value).replace(/_/gu, '');
  if (!text) throw new Error('Enter an integer to convert.');
  const negative = text.startsWith('-');
  const digits = negative || text.startsWith('+') ? text.slice(1) : text;
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, base);
  if (!digits || [...digits.toUpperCase()].some((digit) => !alphabet.includes(digit))) throw new Error(`Use only valid digits for base ${base}.`);
  const prefix = base === 2 ? '0b' : base === 8 ? '0o' : base === 16 ? '0x' : '';
  const number = BigInt(`${prefix}${digits}`);
  return negative ? -number : number;
}

function setupBinary(root) {
  const input = $('#binary-input', root); const output = $('#binary-output', root); const status = $('#tool-status', root);
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'convert-binary') {
      try { const from = Number($('#binary-from', root).value); const to = Number($('#binary-to', root).value); output.textContent = parseBaseInteger(input.value, from).toString(to).toUpperCase(); setStatus(status, 'Number converted locally.', 'success'); }
      catch (error) { output.textContent = '—'; setStatus(status, language === 'en' ? error.message : 'Enter an integer using digits valid for the selected base.', 'error'); }
    }
    if (action === 'clear') { input.value = ''; output.textContent = '—'; setStatus(status, 'Supports whole numbers in bases 2, 8, 10 and 16.'); input.focus(); }
  });
}

function setupPrime(root) {
  const input = $('#prime-input', root); const output = $('#prime-output', root); const status = $('#tool-status', root);
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'check-prime') {
      const value = parseInputNumber(input.value);
      if (!Number.isSafeInteger(value) || value < 0 || value > 1_000_000_000_000) { setStatus(status, 'Enter a whole number from 0 to 1,000,000,000,000.', 'error'); output.textContent = '—'; return; }
      let prime = value >= 2;
      for (let divisor = 2; prime && divisor * divisor <= value; divisor += divisor === 2 ? 1 : 2) if (value % divisor === 0) prime = false;
      output.textContent = translate(prime ? 'Prime number' : 'Not prime'); setStatus(status, 'Number checked locally.', 'success');
    }
    if (action === 'clear') { input.value = ''; output.textContent = '—'; setStatus(status, 'Checks integers up to one trillion locally.'); input.focus(); }
  });
}

function setupAverage(root) {
  const input = $('#average-input', root); const status = $('#tool-status', root);
  const outputIds = ['average-result', 'average-sum', 'average-count', 'average-min', 'average-max'];
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'calculate-average') {
      const separator = usesCommaDecimal ? /[;\s、]+/u : /[,\s、]+/u;
      const values = normalizeInput(input.value).split(separator).filter(Boolean).map(parseInputNumber);
      if (!values.length || values.some((value) => !Number.isFinite(value))) { setStatus(status, 'Enter valid numbers separated by spaces, commas or lines.', 'error'); return; }
      const sum = values.reduce((total, value) => total + value, 0);
      $('#average-result', root).textContent = formatNumber(sum / values.length); $('#average-sum', root).textContent = formatNumber(sum); $('#average-count', root).textContent = values.length; $('#average-min', root).textContent = formatNumber(Math.min(...values)); $('#average-max', root).textContent = formatNumber(Math.max(...values)); setStatus(status, 'Average calculated locally.', 'success');
    }
    if (action === 'clear') { input.value = ''; outputIds.forEach((id) => { $(`#${id}`, root).textContent = '—'; }); setStatus(status, 'Separate numbers with spaces, commas or new lines.'); input.focus(); }
  });
}

function greatestCommonDivisor(a, b) { let x = Math.abs(a); let y = Math.abs(b); while (y) [x, y] = [y, x % y]; return x || 1; }

function setupRatio(root) {
  const status = $('#tool-status', root);
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'solve-ratio') {
      const values = ['a', 'b', 'c'].map((name) => parseInputNumber($(`#ratio-${name}`, root).value));
      if (values.some((value) => !Number.isFinite(value) || value <= 0) || values[0] === 0) { setStatus(status, 'Enter three positive numbers.', 'error'); return; }
      const x = values[1] * values[2] / values[0]; const precision = Math.abs(x) < 1 ? 6 : 4;
      $('#ratio-x', root).value = localDecimal(Number(x.toFixed(precision))); $('#ratio-result', root).textContent = formatNumber(Number(x.toFixed(precision)));
      if (values.every(Number.isInteger)) { const gcd = greatestCommonDivisor(values[0], values[1]); $('#ratio-simplified', root).textContent = `${values[0] / gcd}:${values[1] / gcd}`; } else $('#ratio-simplified', root).textContent = `${formatNumber(values[0])}:${formatNumber(values[1])}`;
      setStatus(status, 'Proportion solved locally.', 'success');
    }
    if (action === 'clear') { $$('input', root).forEach((input) => { input.value = ''; }); $('#ratio-result', root).textContent = '—'; $('#ratio-simplified', root).textContent = '—'; setStatus(status, 'Solve A:B = C:X, then see the simplified A:B ratio.'); }
  });
}

function setupDuration(root) {
  const status = $('#tool-status', root);
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'calculate-duration') {
      const start = new Date($('#duration-start', root).value).getTime(); const end = new Date($('#duration-end', root).value).getTime();
      if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) { setStatus(status, 'Choose valid times with the end after the start.', 'error'); return; }
      const milliseconds = end - start; const totalSeconds = Math.floor(milliseconds / 1000); const days = Math.floor(totalSeconds / 86400); const hours = Math.floor(totalSeconds / 3600); const minutes = Math.floor((totalSeconds % 3600) / 60); const seconds = totalSeconds % 60;
      $('#duration-days', root).textContent = formatNumber(milliseconds / 86400000); $('#duration-hours', root).textContent = formatNumber(milliseconds / 3600000); $('#duration-exact', root).textContent = fmt('duration.exact', { days: formatNumber(days), hours: hours % 24, minutes, seconds }) ?? (language === 'es' ? `${days} d ${hours % 24} h ${minutes} min ${seconds} s` : language === 'fr' ? `${days} j ${hours % 24} h ${minutes} min ${seconds} s` : isPortuguese ? `${days} d ${hours % 24} h ${minutes} min ${seconds} s` : isGerman ? `${days} T ${hours % 24} Std. ${minutes} Min. ${seconds} Sek.` : `${days}d ${hours % 24}h ${minutes}m ${seconds}s`); setStatus(status, 'Duration calculated locally.', 'success');
    }
    if (action === 'clear') { $$('input', root).forEach((input) => { input.value = ''; }); ['duration-days', 'duration-hours', 'duration-exact'].forEach((id) => { $(`#${id}`, root).textContent = '—'; }); setStatus(status, 'Choose a start and end time.'); }
  });
}

const englishSmall = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const englishTens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const spanishSmall = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
const spanishTens = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const spanishHundreds = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
const frenchSmall = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
const frenchTens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'];
const germanSmall = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
const germanTens = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];
const portugueseSmall = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez'];
portugueseSmall.push('onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove');
const portugueseTens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
const portugueseHundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
function wordsUnderThousand(value) {
  if (isGerman) {
    let words = '';
    if (value >= 100) {
      const hundreds = Math.floor(value / 100);
      words = `${hundreds === 1 ? 'ein' : germanSmall[hundreds]}hundert`;
      value %= 100;
    }
    if (value === 0 && words) return words;
    if (value < 20) return words + (value === 1 && words ? 'eins' : germanSmall[value]);
    const units = value % 10;
    const tens = germanTens[Math.floor(value / 10)];
    return words + (units ? `${units === 1 ? 'ein' : germanSmall[units]}und${tens}` : tens);
  }
  if (language === 'es') {
    const words = [];
    if (value >= 100) { const hundreds = Math.floor(value / 100); words.push(value === 100 ? 'cien' : spanishHundreds[hundreds]); value %= 100; }
    if (value >= 30) { const tens = Math.floor(value / 10); const units = value % 10; words.push(units ? `${spanishTens[tens]} y ${englishUnitSpanish(units)}` : spanishTens[tens]); value = 0; }
    if (value) words.push(spanishSmall[value]);
    return words.join(' ');
  }
  if (language === 'fr') {
    const words = [];
    if (value >= 100) { const hundreds = Math.floor(value / 100); const remainder = value % 100; words.push(hundreds === 1 ? 'cent' : `${frenchSmall[hundreds]} cent${remainder ? '' : 's'}`); value = remainder; }
    if (value < 20) { if (value) words.push(frenchSmall[value]); return words.join(' '); }
    if (value < 70) { const tens = Math.floor(value / 10); const units = value % 10; words.push(units === 1 ? `${frenchTens[tens]} et un` : `${frenchTens[tens]}${units ? `-${frenchSmall[units]}` : ''}`); return words.join(' '); }
    if (value < 80) return value === 71 ? 'soixante et onze' : `soixante-${frenchSmall[value - 60]}`;
    return value === 80 ? 'quatre-vingts' : `quatre-vingt${value > 80 ? `-${value - 80 < 20 ? frenchSmall[value - 80] : `dix-${frenchSmall[value - 90]}`}` : ''}`;
  }
  if (isPortuguese) {
    if (value < 20) return portugueseSmall[value];
    if (value < 100) return `${portugueseTens[Math.floor(value / 10)]}${value % 10 ? ` e ${portugueseSmall[value % 10]}` : ''}`;
    if (value === 100) return 'cem';
    const hundreds = portugueseHundreds[Math.floor(value / 100)];
    const remainder = value % 100;
    return remainder ? `${hundreds} e ${wordsUnderThousand(remainder)}` : hundreds;
  }
  const words = [];
  if (value >= 100) { words.push(`${englishSmall[Math.floor(value / 100)]} hundred`); value %= 100; }
  if (value >= 20) { words.push(englishTens[Math.floor(value / 10)]); value %= 10; }
  if (value) words.push(englishSmall[value]);
  return words.join(' ');
}
function englishUnitSpanish(value) { return value === 1 ? 'uno' : spanishSmall[value]; }
function spanishBeforeScale(text) { return text.replace(/veintiuno$/u, 'veintiún').replace(/ y uno$/u, ' y un').replace(/uno$/u, 'un'); }
function numberToWords(value) {
  if (typeof localeBundle.numberToWords === 'function') return localeBundle.numberToWords(value);
  if (value === 0n) return language === 'es' ? 'cero' : language === 'fr' ? 'zéro' : isGerman ? 'null' : 'zero';
  const negative = value < 0n; const absolute = negative ? -value : value; const groups = []; let remaining = absolute;
  while (remaining) { groups.push(Number(remaining % 1000n)); remaining /= 1000n; }
  if (isGerman) {
    const higherGroups = [];
    let lowerGroups = '';
    for (let index = groups.length - 1; index >= 0; index -= 1) {
      const group = groups[index];
      if (!group) continue;
      if (index === 3 || index === 2) {
        const scale = index === 3 ? 'Milliarde' : 'Million';
        const pluralEnding = index === 3 ? 'n' : 'en';
        higherGroups.push(`${group === 1 ? 'eine' : wordsUnderThousand(group)} ${scale}${group === 1 ? '' : pluralEnding}`);
      } else if (index === 1) {
        lowerGroups = `${group === 1 ? 'ein' : wordsUnderThousand(group)}tausend`;
      } else {
        lowerGroups += wordsUnderThousand(group);
      }
    }
    return `${negative ? 'minus ' : ''}${[...higherGroups, lowerGroups].filter(Boolean).join(' ')}`;
  }
  const words = [];
  for (let index = groups.length - 1; index >= 0; index -= 1) {
    const group = groups[index]; if (!group) continue;
    let part = wordsUnderThousand(group);
    if (language === 'es') {
      if (index === 3) part = `${group === 1 ? '' : `${spanishBeforeScale(part)} `}mil millones`;
      else if (index === 2) part = `${spanishBeforeScale(part)} ${group === 1 ? 'millón' : 'millones'}`;
      else if (index === 1) part = group === 1 ? 'mil' : `${spanishBeforeScale(part)} mil`;
    } else if (language === 'fr') {
      if (index === 3) part = `${part} ${group === 1 ? 'milliard' : 'milliards'}`;
      else if (index === 2) part = `${part} ${group === 1 ? 'million' : 'millions'}`;
      else if (index === 1) part = group === 1 ? 'mille' : `${part} mille`;
    } else if (isPortuguese) {
      if (index === 3) part = `${part} ${group === 1 ? 'bilhão' : 'bilhões'}`;
      else if (index === 2) part = `${part} ${group === 1 ? 'milhão' : 'milhões'}`;
      else if (index === 1) part = group === 1 ? 'mil' : `${part} mil`;
    } else {
      const scale = ['', 'thousand', 'million', 'billion'][index];
      if (scale) part = `${part} ${scale}`;
    }
    words.push(part);
  }
  const lastNonzeroGroup = groups.find((group) => group > 0);
  if (isPortuguese && words.length > 1 && (lastNonzeroGroup <= 100 || lastNonzeroGroup % 100 === 0)) {
    const finalGroup = words.pop();
    words.push('e', finalGroup);
  }
  return `${negative ? (language === 'es' ? 'menos ' : language === 'fr' ? 'moins ' : isPortuguese ? 'menos ' : 'minus ') : ''}${words.join(' ')}`;
}

function setupNumberWords(root) {
  const input = $('#words-number', root); const output = $('#words-output', root); const status = $('#tool-status', root);
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'number-to-words') {
      try { const raw = normalizeInput(input.value); const validGroupedInteger = !usesCommaDecimal || /^-?(?:\d+|\d{1,3}(?:[.\s]\d{3})+)$/u.test(raw); const text = usesCommaDecimal ? raw.replace(/[.\s]/gu, '') : raw.replace(/[,\s]/gu, ''); if (!validGroupedInteger || !/^-?\d+$/u.test(text)) throw new Error('Enter a whole number.'); const value = BigInt(text); if (value < -999_999_999_999n || value > 999_999_999_999n) throw new Error('Use a number between -999,999,999,999 and 999,999,999,999.'); output.value = numberToWords(value); setStatus(status, 'Number converted locally.', 'success'); }
      catch (error) { output.value = ''; setStatus(status, language === 'en' ? error.message : 'Use a whole number between -999,999,999,999 and 999,999,999,999.', 'error'); }
    }
    if (action === 'copy-output') copyText(output.value, status);
    if (action === 'clear') { input.value = ''; output.value = ''; setStatus(status, 'Supports whole numbers from -999,999,999,999 to 999,999,999,999.'); input.focus(); }
  });
}

function setupRemoveLineBreaks(root) {
  const input = $('#tool-input', root); const output = $('#tool-output', root); const status = $('#tool-status', root);
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'join-line-breaks' || action === 'remove-line-breaks') {
      const replacement = action === 'join-line-breaks' ? ' ' : '';
      output.value = input.value.replace(/\r?\n|\r/gu, replacement).replace(/[ \t]+/gu, ' ').trim();
      setStatus(status, output.value ? 'Line breaks removed locally.' : 'Paste text first.', output.value ? 'success' : 'error');
    }
    if (action === 'copy-output') copyText(output.value, status);
    if (action === 'clear') { input.value = ''; output.value = ''; setStatus(status, 'Your text stays in this browser.'); input.focus(); }
  });
}

function setupTextDiff(root) {
  const original = $('#diff-original', root); const changed = $('#diff-changed', root); const output = $('#diff-output', root); const count = $('#diff-count', root); const status = $('#tool-status', root);
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'compare-text') {
      const before = original.value.split(/\r?\n/u); const after = changed.value.split(/\r?\n/u); const differences = [];
      for (let index = 0; index < Math.max(before.length, after.length); index += 1) if (before[index] !== after[index]) differences.push(`${fmt('diff.line', { line: index + 1 }) ?? `Line ${index + 1}:`}\n- ${before[index] || (fmt('diff.empty') ?? '(empty)')}\n+ ${after[index] || (fmt('diff.empty') ?? '(empty)')}`);
      count.textContent = differences.length; output.textContent = differences.length ? differences.join('\n\n') : translate('No differences found.'); setStatus(status, differences.length ? (fmt('diff.found', { n: differences.length, count: formatNumber(differences.length) }) ?? `${differences.length} different line${differences.length === 1 ? '' : 's'} found.`) : 'The texts are identical.', differences.length ? 'success' : '');
    }
    if (action === 'clear') { original.value = ''; changed.value = ''; count.textContent = '0'; output.textContent = translate('No comparison yet.'); setStatus(status, 'Comparison runs locally line by line.'); original.focus(); }
  });
}

const unitDefinitions = {
  length: { label: 'Length', units: { meter: ['Meters', 1], kilometer: ['Kilometers', 1000], centimeter: ['Centimeters', 0.01], millimeter: ['Millimeters', 0.001], inch: ['Inches', 0.0254], foot: ['Feet', 0.3048], yard: ['Yards', 0.9144], mile: ['Miles', 1609.344] } },
  weight: { label: 'Weight', units: { kilogram: ['Kilograms', 1], gram: ['Grams', 0.001], milligram: ['Milligrams', 0.000001], pound: ['Pounds', 0.45359237], ounce: ['Ounces', 0.028349523125] } },
  volume: { label: 'Volume', units: { liter: ['Liters', 1], milliliter: ['Milliliters', 0.001], gallon: ['US gallons', 3.785411784], quart: ['US quarts', 0.946352946], cup: ['US cups', 0.2365882365] } },
  temperature: { label: 'Temperature', units: { celsius: ['Celsius', null], fahrenheit: ['Fahrenheit', null], kelvin: ['Kelvin', null] } },
};

function setupUnitConverter(root) {
  const category = $('#unit-category', root); const from = $('#unit-from', root); const to = $('#unit-to', root); const input = $('#unit-input', root); const output = $('#unit-output', root); const status = $('#tool-status', root);
  const updateUnits = () => {
    const definition = unitDefinitions[category.value]; from.innerHTML = ''; to.innerHTML = '';
    Object.entries(definition.units).forEach(([value, [label]]) => { const localizedLabel = translate(label); from.add(new Option(localizedLabel, value)); to.add(new Option(localizedLabel, value)); });
    if (to.options.length > 1) to.selectedIndex = 1;
  };
  const convertTemperature = (value, source, target) => {
    let celsius = source === 'celsius' ? value : source === 'fahrenheit' ? (value - 32) * 5 / 9 : value - 273.15;
    return target === 'celsius' ? celsius : target === 'fahrenheit' ? celsius * 9 / 5 + 32 : celsius + 273.15;
  };
  category.addEventListener('change', updateUnits);
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'convert-unit') {
      const value = parseInputNumber(input.value); const definition = unitDefinitions[category.value];
      if (!Number.isFinite(value)) { output.textContent = '—'; setStatus(status, 'Enter a valid number.', 'error'); return; }
      const result = category.value === 'temperature' ? convertTemperature(value, from.value, to.value) : value * definition.units[from.value][1] / definition.units[to.value][1];
      output.textContent = `${formatNumber(result)} ${to.options[to.selectedIndex].text}`; setStatus(status, 'Unit converted locally.', 'success');
    }
    if (action === 'clear') { input.value = ''; output.textContent = '—'; setStatus(status, 'Conversions run locally in your browser.'); input.focus(); }
  });
  updateUnits();
}

function parseDateOnly(value) { return /^\d{4}-\d{2}-\d{2}$/u.test(value) ? new Date(`${value}T00:00:00Z`) : null; }

function setupDateCalculator(root) {
  const status = $('#tool-status', root);
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'date-difference') {
      const start = parseDateOnly($('#date-start', root).value); const end = parseDateOnly($('#date-end', root).value);
      if (!start || !end) { setStatus(status, 'Choose two valid dates.', 'error'); return; }
      const days = Math.abs(Math.round((end - start) / 86400000)); const dayWord = language === 'es' ? (days === 1 ? 'día' : 'días') : language === 'fr' ? (days === 1 ? 'jour' : 'jours') : isPortuguese ? (days === 1 ? 'dia' : 'dias') : isGerman ? (days === 1 ? 'Tag' : 'Tage') : (days === 1 ? 'day' : 'days'); $('#date-difference-result', root).textContent = fmt('date.days', { n: days, count: formatNumber(days) }) ?? `${formatNumber(days)} ${dayWord}`; setStatus(status, 'Date difference calculated.', 'success');
    }
    if (action === 'date-offset') {
      const base = parseDateOnly($('#date-base', root).value); const offset = parseInputNumber($('#date-offset', root).value);
      if (!base || !Number.isInteger(offset)) { setStatus(status, 'Choose a date and enter a whole number of days.', 'error'); return; }
      base.setUTCDate(base.getUTCDate() + offset); $('#date-offset-result', root).textContent = localeConfig.longDates ? new Intl.DateTimeFormat(languageTag, { dateStyle: 'full', timeZone: 'UTC' }).format(base) : base.toISOString().slice(0, 10); setStatus(status, 'Date calculated.', 'success');
    }
    if (action === 'clear') { $$('input', root).forEach((input) => { input.value = ''; }); $$('output', root).forEach((output) => { output.textContent = '—'; }); setStatus(status, 'Dates are calculated in your browser.'); }
  });
}

const qrDataCodewords = [19, 34, 55, 80, 108];
const qrEccCodewords = [7, 10, 15, 20, 26];
const qrAlignmentPositions = [[], [6, 18], [6, 22], [6, 26], [6, 30]];

function qrGfMultiply(left, right) {
  let result = 0;
  let a = left;
  let b = right;
  while (b) {
    if (b & 1) result ^= a;
    a <<= 1;
    if (a & 0x100) a ^= 0x11d;
    b >>>= 1;
  }
  return result;
}

function qrGfPower(exponent) {
  let value = 1;
  for (let index = 0; index < exponent; index += 1) value = qrGfMultiply(value, 2);
  return value;
}

function qrReedSolomon(data, eccCount) {
  let generator = [1];
  for (let index = 0; index < eccCount; index += 1) {
    const next = Array(generator.length + 1).fill(0);
    const factor = qrGfPower(index);
    generator.forEach((coefficient, position) => {
      next[position] ^= coefficient;
      next[position + 1] ^= qrGfMultiply(coefficient, factor);
    });
    generator = next;
  }
  const remainder = Array(eccCount).fill(0);
  data.forEach((byte) => {
    const factor = byte ^ remainder[0];
    remainder.shift();
    remainder.push(0);
    for (let index = 0; index < eccCount; index += 1) remainder[index] ^= qrGfMultiply(generator[index + 1], factor);
  });
  return remainder;
}

function qrBchDigit(value) {
  let digits = 0;
  for (let current = value; current; current >>>= 1) digits += 1;
  return digits;
}

function qrFormatBits(value) {
  let remainder = value << 10;
  const generator = 0x537;
  while (qrBchDigit(remainder) >= qrBchDigit(generator)) remainder ^= generator << (qrBchDigit(remainder) - qrBchDigit(generator));
  return ((value << 10) | remainder) ^ 0x5412;
}

function qrAddFinder(modules, functions, row, column) {
  for (let localRow = -1; localRow <= 7; localRow += 1) for (let localColumn = -1; localColumn <= 7; localColumn += 1) {
    const targetRow = row + localRow;
    const targetColumn = column + localColumn;
    if (targetRow < 0 || targetRow >= modules.length || targetColumn < 0 || targetColumn >= modules.length) continue;
    const inPattern = localRow >= 0 && localRow <= 6 && localColumn >= 0 && localColumn <= 6 && (localRow === 0 || localRow === 6 || localColumn === 0 || localColumn === 6 || (localRow >= 2 && localRow <= 4 && localColumn >= 2 && localColumn <= 4));
    functions[targetRow][targetColumn] = true;
    modules[targetRow][targetColumn] = inPattern;
  }
}

function qrAddAlignment(modules, functions, version) {
  qrAlignmentPositions[version - 1].forEach((row) => qrAlignmentPositions[version - 1].forEach((column) => {
    if (functions[row][column]) return;
    for (let localRow = -2; localRow <= 2; localRow += 1) for (let localColumn = -2; localColumn <= 2; localColumn += 1) {
      functions[row + localRow][column + localColumn] = true;
      modules[row + localRow][column + localColumn] = Math.max(Math.abs(localRow), Math.abs(localColumn)) !== 1;
    }
  }));
}

function qrReserveFormat(modules, functions) {
  const size = modules.length;
  for (let index = 0; index < 15; index += 1) {
    const verticalRow = index < 6 ? index : index < 8 ? index + 1 : size - 15 + index;
    const horizontalColumn = index < 8 ? size - index - 1 : index < 9 ? 7 : 15 - index - 1;
    functions[verticalRow][8] = true;
    functions[8][horizontalColumn] = true;
  }
  functions[size - 8][8] = true;
}

function qrSetFormat(modules, mask) {
  const size = modules.length;
  const bits = qrFormatBits((1 << 3) | mask);
  for (let index = 0; index < 15; index += 1) {
    const verticalRow = index < 6 ? index : index < 8 ? index + 1 : size - 15 + index;
    const horizontalColumn = index < 8 ? size - index - 1 : index < 9 ? 7 : 15 - index - 1;
    const value = ((bits >>> index) & 1) !== 0;
    modules[verticalRow][8] = value;
    modules[8][horizontalColumn] = value;
  }
  modules[size - 8][8] = true;
}

function qrCreateModules(value) {
  const bytes = [...new TextEncoder().encode(value)];
  const versionIndex = qrDataCodewords.findIndex((dataCount) => bytes.length <= Math.floor((dataCount * 8 - 12) / 8));
  if (versionIndex < 0) throw new Error('Use 106 bytes or fewer. Short links work best.');
  const version = versionIndex + 1;
  const dataCount = qrDataCodewords[versionIndex];
  const bits = [];
  const appendBits = (number, count) => { for (let bit = count - 1; bit >= 0; bit -= 1) bits.push((number >>> bit) & 1); };
  appendBits(4, 4);
  appendBits(bytes.length, 8);
  bytes.forEach((byte) => appendBits(byte, 8));
  while (bits.length % 8) bits.push(0);
  const data = [];
  for (let index = 0; index < bits.length; index += 8) data.push(bits.slice(index, index + 8).reduce((total, bit) => (total << 1) | bit, 0));
  for (let index = data.length; index < dataCount; index += 1) data.push(index % 2 ? 0x11 : 0xec);
  const codewords = [...data, ...qrReedSolomon(data, qrEccCodewords[versionIndex])];
  const size = version * 4 + 17;
  const modules = Array.from({ length: size }, () => Array(size).fill(false));
  const functions = Array.from({ length: size }, () => Array(size).fill(false));
  qrAddFinder(modules, functions, 0, 0);
  qrAddFinder(modules, functions, size - 7, 0);
  qrAddFinder(modules, functions, 0, size - 7);
  qrAddAlignment(modules, functions, version);
  for (let index = 8; index < size - 8; index += 1) {
    if (!functions[index][6]) { functions[index][6] = true; modules[index][6] = index % 2 === 0; }
    if (!functions[6][index]) { functions[6][index] = true; modules[6][index] = index % 2 === 0; }
  }
  qrReserveFormat(modules, functions);
  const dataBits = codewords.flatMap((byte) => Array.from({ length: 8 }, (_, bit) => (byte >>> (7 - bit)) & 1));
  let bitIndex = 0;
  let upward = true;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right -= 1;
    for (let step = 0; step < size; step += 1) {
      const row = upward ? size - 1 - step : step;
      for (let column = right; column >= right - 1; column -= 1) if (!functions[row][column]) {
        const bit = bitIndex < dataBits.length ? dataBits[bitIndex++] : 0;
        modules[row][column] = Boolean(bit ^ ((row + column) % 2 === 0 ? 1 : 0));
      }
    }
    upward = !upward;
  }
  qrSetFormat(modules, 0);
  return modules;
}

function qrRender(canvas, modules, size, dark, light) {
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d', { alpha: false });
  const scale = size / (modules.length + 8);
  context.imageSmoothingEnabled = false;
  context.fillStyle = light;
  context.fillRect(0, 0, size, size);
  context.fillStyle = dark;
  modules.forEach((row, rowIndex) => row.forEach((isDark, columnIndex) => {
    if (!isDark) return;
    const left = Math.round((columnIndex + 4) * scale);
    const top = Math.round((rowIndex + 4) * scale);
    context.fillRect(left, top, Math.round((columnIndex + 5) * scale) - left, Math.round((rowIndex + 5) * scale) - top);
  }));
}

function setupQr(root) {
  const input = $('#qr-input', root); const canvas = $('#qr-canvas', root); const result = $('#qr-result', root); const status = $('#tool-status', root); let generated = false;
  const generate = () => {
    const value = input.value.trim();
    if (!value) { setStatus(status, 'Paste a link or short text first.', 'error'); input.focus(); return false; }
    try { qrRender(canvas, qrCreateModules(value), Number($('#qr-size', root).value), '#000000', '#ffffff'); result.hidden = false; generated = true; setStatus(status, 'QR code ready. Nothing left this browser.', 'success'); return true; }
    catch (error) { generated = false; setStatus(status, language === 'en' ? error.message : 'Use a link or text of 106 bytes or fewer. Short links work best.', 'error'); return false; }
  };
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'generate-qr') generate();
    if (action === 'download-qr') {
      if (!generated && !generate()) return;
      canvas.toBlob((blob) => { if (!blob) return setStatus(status, 'The PNG could not be created. Try again.', 'error'); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'usefulverse-qr-code.png'; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 1000); setStatus(status, 'PNG download started.', 'success'); }, 'image/png');
    }
    if (action === 'clear') { input.value = ''; canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height); result.hidden = true; generated = false; setStatus(status, 'Generated locally in your browser. Nothing is uploaded.'); input.focus(); }
  });
}

const timeZoneParts = (date, timeZone) => Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(date).filter((part) => part.type !== 'literal').map((part) => [part.type, Number(part.value)]));

function parseZonedDateTime(value, timeZone) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/u.exec(value);
  if (!match) throw new Error('Choose a valid date and time.');
  const target = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4]), Number(match[5]));
  let guess = target;
  for (let iteration = 0; iteration < 4; iteration += 1) {
    const parts = timeZoneParts(new Date(guess), timeZone);
    const observed = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    const adjusted = target - (observed - guess);
    if (adjusted === guess) break;
    guess = adjusted;
  }
  return new Date(guess);
}

function localDateTimeValue(date) {
  const pad = (number) => String(number).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function setupTimeZone(root) {
  const input = $('#timezone-date', root); const from = $('#timezone-from', root); const to = $('#timezone-to', root); const fromOutput = $('#timezone-from-result', root); const toOutput = $('#timezone-to-result', root); const status = $('#tool-status', root);
  input.value = localDateTimeValue(new Date());
  if (localeConfig.timeZones) { from.value = localeConfig.timeZones.from ?? from.value; to.value = localeConfig.timeZones.to ?? to.value; }
  const format = (date, timeZone) => new Intl.DateTimeFormat(languageTag, { timeZone, dateStyle: 'full', timeStyle: 'long' }).format(date);
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'convert-timezone') {
      try { const date = parseZonedDateTime(input.value, from.value); fromOutput.textContent = format(date, from.value); toOutput.textContent = format(date, to.value); setStatus(status, 'Time converted locally with daylight saving support.', 'success'); }
      catch (error) { fromOutput.textContent = '—'; toOutput.textContent = '—'; setStatus(status, language === 'en' ? error.message : 'This date and time is invalid for the selected time zone.', 'error'); }
    }
    if (action === 'clear') { input.value = ''; fromOutput.textContent = '—'; toOutput.textContent = '—'; setStatus(status, 'Uses your browser’s time zone data, including daylight saving changes.'); input.focus(); }
  });
}

function setupToolPage() {
  const root = $('.tool-workspace');
  if (!root) return;
  const id = root.dataset.tool;
  const setups = { 'word-counter': setupWordCounter, 'text-case-converter': setupCaseConverter, 'remove-duplicate-lines': setupDedupe, 'json-formatter': setupJson, 'base64-encoder-decoder': setupBase64, 'url-encoder-decoder': setupUrl, 'text-to-slug': setupSlug, 'percentage-calculator': setupPercentage, 'password-generator': setupPassword, 'timestamp-converter': setupTimestamp, 'html-entity-encoder-decoder': setupHtmlEntities, 'csv-to-json': setupCsvToJson, 'json-to-csv': setupJsonToCsv, 'random-number-generator': setupRandomNumber, 'uuid-generator': setupUuid, 'sha256-hash-generator': setupSha256, 'regex-tester': setupRegex, 'jwt-decoder': setupJwt, 'color-converter': setupColor, 'url-parser': setupUrlParser, 'roman-numeral-converter': setupRoman, 'binary-converter': setupBinary, 'prime-number-checker': setupPrime, 'average-calculator': setupAverage, 'ratio-proportion-calculator': setupRatio, 'time-duration-calculator': setupDuration, 'number-to-words-converter': setupNumberWords, 'remove-line-breaks': setupRemoveLineBreaks, 'text-diff-checker': setupTextDiff, 'unit-converter': setupUnitConverter, 'date-calculator': setupDateCalculator, 'qr-code-generator': setupQr, 'time-zone-converter': setupTimeZone };
  setups[id]?.(root);
}

function setupHome() {
  const grid = $('#tool-grid');
  if (!grid) return;
  const cards = $$('.tool-card', grid);
  const empty = $('#empty-state');
  const search = $('#tool-search');
  const allCategory = $('[data-category-filter]')?.dataset.categoryFilter || 'All';
  let category = allCategory;
  const render = () => {
    const term = searchKey(search.value.trim());
    let visible = 0;
    cards.forEach((card) => {
      const matchesCategory = category === allCategory || card.dataset.category === category;
      const matchesSearch = !term || searchKey(card.dataset.search).includes(term);
      const show = matchesCategory && matchesSearch;
      card.hidden = !show;
      if (show) visible += 1;
    });
    empty.hidden = visible !== 0;
  };
  search.addEventListener('input', render);
  $$('[data-category-filter]').forEach((button) => button.addEventListener('click', () => { category = button.dataset.categoryFilter; $$('[data-category-filter]').forEach((item) => item.classList.toggle('is-active', item === button)); render(); }));
}

setupHome();
setupToolPage();

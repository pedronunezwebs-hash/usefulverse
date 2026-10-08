const MAX_INPUT_BYTES = 5 * 1024 * 1024;
const MAX_OUTPUT_CHARS = 2 * 1024 * 1024;
const MAX_GROUP_DEPTH = 256;
const DESTINATIONS = new Set([
  'fonttbl', 'colortbl', 'stylesheet', 'info', 'pict', 'object', 'header', 'headerl', 'headerr',
  'footer', 'footerl', 'footerr', 'footnote', 'annotation', 'xmlnstbl', 'datastore', 'themedata',
  'colorschememapping', 'generator', 'private', 'company', 'creatim', 'revtim', 'printim', 'buptim',
  'doccomm', 'operator', 'keywords', 'subject', 'title', 'author', 'manager', 'category', 'template',
  'vern', 'edmins', 'xe', 'tc', 'index', 'nonshppict', 'shppict', 'listtable', 'listoverridetable',
  'revtbl', 'rsidtbl', 'userprops', 'mmathPr',
]);

function byteLength(value) {
  return new TextEncoder().encode(value).byteLength;
}

function codePageLabel(codePage) {
  return `windows-${codePage}`;
}

function decodeBytes(bytes, codePage) {
  try {
    return new TextDecoder(codePageLabel(codePage)).decode(Uint8Array.from(bytes));
  } catch {
    return new TextDecoder('windows-1252').decode(Uint8Array.from(bytes));
  }
}

function destinationAt(source, index) {
  const prefix = source.slice(index + 1, index + 120);
  const match = prefix.match(/^\\(?:\*\\)?([a-z]+)(?:-?\d+)?\s?/iu);
  return Boolean(match && (prefix.startsWith('\\*\\') || DESTINATIONS.has(match[1].toLowerCase())));
}

function controlAt(source, index) {
  const next = source[index + 1];
  if (!next) return { end: index + 1, symbol: '' };
  if (!/[a-z]/iu.test(next)) return { end: index + 2, symbol: next };
  let end = index + 1;
  while (/[a-z]/iu.test(source[end] ?? '')) end += 1;
  const word = source.slice(index + 1, end).toLowerCase();
  let numeric = '';
  if (source[end] === '-') {
    numeric = '-';
    end += 1;
  }
  while (/\d/u.test(source[end] ?? '')) {
    numeric += source[end];
    end += 1;
  }
  const argument = numeric && numeric !== '-' ? Number(numeric) : null;
  if (source[end] === ' ') end += 1;
  return { end, word, argument };
}

function hexRunAt(source, index, skipFallback) {
  const bytes = [];
  let cursor = index;
  let skipped = 0;
  while (source[cursor] === '\\' && source[cursor + 1] === "'" && /^[\da-f]{2}$/iu.test(source.slice(cursor + 2, cursor + 4))) {
    if (skipFallback > skipped) skipped += 1;
    else bytes.push(Number.parseInt(source.slice(cursor + 2, cursor + 4), 16));
    cursor += 4;
  }
  return { bytes, end: cursor, skipped };
}

/**
 * Extracts readable text from the declared RTF subset without evaluating or rendering RTF markup.
 * Unsupported binary/media groups are ignored, and source remains unchanged for the user.
 */
export function convertRtfToText(input) {
  if (typeof input !== 'string' || !input.trim()) throw new TypeError('Choose a non-empty RTF document.');
  if (byteLength(input) > MAX_INPUT_BYTES) throw new RangeError('The RTF file is larger than the 5 MiB local limit.');
  if (!/^\s*\{\\rtf\d/iu.test(input)) throw new TypeError('This file does not start with a supported RTF header.');

  const stack = [];
  let state = { skip: false, unicodeFallback: 1, codePage: 1252 };
  let pendingFallback = 0;
  let output = '';
  let closed = false;
  const append = (text) => {
    if (!text || state.skip) return;
    output += text;
    if (output.length > MAX_OUTPUT_CHARS) throw new RangeError('The extracted text exceeds the 2 MiB output limit.');
  };

  for (let index = 0; index < input.length;) {
    const char = input[index];
    if (char === '{') {
      if (stack.length >= MAX_GROUP_DEPTH) throw new RangeError('The RTF document has too many nested groups.');
      stack.push(state);
      state = { ...state, skip: state.skip || destinationAt(input, index) };
      index += 1;
      continue;
    }
    if (char === '}') {
      if (!stack.length) throw new TypeError('The RTF document has unbalanced braces.');
      state = stack.pop();
      index += 1;
      if (!stack.length) {
        closed = true;
        break;
      }
      continue;
    }
    if (char === '\\') {
      const token = controlAt(input, index);
      index = token.end;
      if (token.word === 'bin' && token.argument !== null) {
        if (token.argument < 0 || token.argument > MAX_INPUT_BYTES || index + token.argument > input.length) throw new TypeError('The RTF document contains an invalid binary block.');
        index += token.argument;
        continue;
      }
      if (!token.word) {
        if (token.symbol === "'") {
          const run = hexRunAt(input, index - 2, pendingFallback);
          if (run.end === index - 2) continue;
          index = run.end;
          pendingFallback = Math.max(0, pendingFallback - run.skipped);
          if (run.bytes.length) append(decodeBytes(run.bytes, state.codePage));
        } else if (token.symbol === '{' || token.symbol === '}' || token.symbol === '\\') {
          if (pendingFallback) pendingFallback -= 1;
          else append(token.symbol);
        } else if (token.symbol === '~') append(pendingFallback ? (pendingFallback -= 1, '') : '\u00a0');
        else if (token.symbol === '_') append(pendingFallback ? (pendingFallback -= 1, '') : '\u2011');
        continue;
      }
      if (token.word === 'ansicpg' && Number.isInteger(token.argument) && token.argument >= 1 && token.argument <= 65535) state.codePage = token.argument;
      else if (token.word === 'uc' && Number.isInteger(token.argument)) state.unicodeFallback = Math.max(0, Math.min(16, token.argument));
      else if (token.word === 'u' && Number.isInteger(token.argument)) {
        const codeUnit = token.argument < 0 ? token.argument + 65536 : token.argument;
        if (codeUnit >= 0 && codeUnit <= 65535) append(String.fromCharCode(codeUnit));
        pendingFallback = state.unicodeFallback;
      } else if (['par', 'line'].includes(token.word)) {
        if (pendingFallback) pendingFallback -= 1;
        else append('\n');
      } else if (token.word === 'tab') {
        if (pendingFallback) pendingFallback -= 1;
        else append('\t');
      } else if (token.word === 'emdash') append(pendingFallback ? (pendingFallback -= 1, '') : '\u2014');
      else if (token.word === 'endash') append(pendingFallback ? (pendingFallback -= 1, '') : '\u2013');
      else if (token.word === 'bullet') append(pendingFallback ? (pendingFallback -= 1, '') : '\u2022');
      else if (token.word === 'emspace' || token.word === 'enspace') append(pendingFallback ? (pendingFallback -= 1, '') : ' ');
      continue;
    }
    index += 1;
    if (char === '\r' || char === '\n') continue;
    if (pendingFallback) pendingFallback -= 1;
    else if (!state.skip) append(char);
  }

  if (!closed || stack.length) throw new TypeError('The RTF document has unbalanced braces.');
  const text = output
    .replaceAll('\u0000', '')
    .split('\n').map((line) => line.replace(/[ \t]+$/gu, '')).join('\n')
    .replace(/\n{3,}/gu, '\n\n')
    .trim();
  if (!text) throw new TypeError('No readable text was found in this RTF document.');
  return text;
}

export const RTF_INPUT_LIMIT_BYTES = MAX_INPUT_BYTES;

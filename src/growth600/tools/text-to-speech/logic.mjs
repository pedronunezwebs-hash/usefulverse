export const MAX_SPEECH_CHARACTERS = 30_000;
export const MAX_SPEECH_CHUNK_CODE_UNITS = 1_200;

export function countSpeechCharacters(value) {
  return Array.from(String(value ?? '')).length;
}

export function truncateSpeechText(value, maxCharacters = MAX_SPEECH_CHARACTERS) {
  if (!Number.isInteger(maxCharacters) || maxCharacters < 0) throw new RangeError('Speech text limit must be a non-negative integer.');
  return Array.from(String(value ?? '')).slice(0, maxCharacters).join('');
}

function keepSurrogatePairTogether(text, end) {
  if (end > 0 && end < text.length) {
    const left = text.charCodeAt(end - 1);
    const right = text.charCodeAt(end);
    if (left >= 0xD800 && left <= 0xDBFF && right >= 0xDC00 && right <= 0xDFFF) return end - 1;
  }
  return end;
}

function preferredBoundary(text, start, hardEnd) {
  const segment = text.slice(start, hardEnd);
  let sentenceEnd = -1;
  for (const match of segment.matchAll(/[.!?。！？](?:[”’"')\]]*)\s+/gu)) sentenceEnd = start + match.index + match[0].length;
  if (sentenceEnd > start) return sentenceEnd;

  const newline = text.lastIndexOf('\n', hardEnd - 1);
  if (newline > start) return newline + 1;
  const whitespace = Math.max(text.lastIndexOf(' ', hardEnd - 1), text.lastIndexOf('\t', hardEnd - 1));
  return whitespace > start ? whitespace + 1 : hardEnd;
}

export function splitSpeechText(value, maxCodeUnits = MAX_SPEECH_CHUNK_CODE_UNITS) {
  const text = String(value ?? '');
  if (!Number.isInteger(maxCodeUnits) || maxCodeUnits < 2) throw new RangeError('Speech chunk size must be an integer of at least two UTF-16 code units.');
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = Math.min(text.length, start + maxCodeUnits);
    if (end < text.length) end = preferredBoundary(text, start, end);
    end = keepSurrogatePairTogether(text, end);
    if (end <= start) end = keepSurrogatePairTogether(text, Math.min(text.length, start + maxCodeUnits));
    if (end <= start) throw new Error('Could not create a safe speech chunk.');
    chunks.push(text.slice(start, end));
    start = end;
  }
  return chunks;
}

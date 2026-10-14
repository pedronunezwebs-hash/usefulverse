export const TYPING_MODES = Object.freeze(['home', 'top', 'bottom', 'mixed']);
export const TYPING_PROMPTS = Object.freeze({
  home: Object.freeze(['a sad lad has a flask', 'a lass asks dad; a fall has a flag', 'all lads ask; a sad lass falls']),
  top: Object.freeze(['type your quiet power', 'write type your quiet power', 'we type to try your power']),
  bottom: Object.freeze(['zxcv bnm,./ zxcv bnm', 'xvbn mzxcv,./', 'zvxc bnm,./ zvxc bnm']),
  mixed: Object.freeze(['the quick brown fox jumps over the lazy dog.', 'pack my box with five dozen liquor jugs.', 'practice every row at a steady pace.']),
});

function graphemes(value) {
  const normalized = String(value).normalize('NFC');
  if (typeof Intl.Segmenter === 'function') return [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(normalized)].map(({ segment }) => segment);
  return Array.from(normalized);
}

export function getTypingPrompt(mode, index = 0) {
  if (!TYPING_MODES.includes(mode)) throw new RangeError('Choose a supported keyboard-row lesson.');
  if (!Number.isInteger(index) || index < 0) throw new RangeError('Lesson index must be a non-negative integer.');
  const prompts = TYPING_PROMPTS[mode];
  return prompts[index % prompts.length];
}

export function evaluateTyping(prompt, input) {
  const expected = graphemes(prompt);
  const typed = graphemes(input);
  const correct = typed.reduce((sum, character, index) => sum + Number(character === expected[index]), 0);
  const accuracy = typed.length ? Math.round((correct / typed.length) * 100) : 100;
  return Object.freeze({
    complete: typed.length === expected.length && typed.every((character, index) => character === expected[index]),
    correct,
    typed: typed.length,
    total: expected.length,
    accuracy,
  });
}

export function validateCustomPrompt(value, maxLength = 1000) {
  const prompt = String(value ?? '').normalize('NFC').trim();
  if (prompt.length > maxLength) return { ok: false, reason: 'too-long' };
  if (!prompt || !graphemes(prompt).some((character) => /[\p{L}\p{N}]/u.test(character))) return { ok: false, reason: 'empty' };
  return { ok: true, prompt };
}

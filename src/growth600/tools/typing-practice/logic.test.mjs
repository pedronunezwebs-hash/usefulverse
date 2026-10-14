import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateTyping, getTypingPrompt, TYPING_MODES, TYPING_PROMPTS, validateCustomPrompt } from './logic.mjs';

test('row lessons only use the advertised QWERTY row, and mixed prompts cover every letter row', () => {
  const allowed = {
    home: /^[asdfghjkl; ]+$/u,
    top: /^[qwertyuiop ]+$/u,
    bottom: /^[zxcvbnm,./ ]+$/u,
  };
  for (const mode of TYPING_MODES) {
    for (const prompt of TYPING_PROMPTS[mode]) {
      if (mode === 'mixed') {
        assert.match(prompt, /[qwertyuiop]/u);
        assert.match(prompt, /[asdfghjkl]/u);
        assert.match(prompt, /[zxcvbnm]/u);
      }
      else assert.match(prompt, allowed[mode]);
    }
  }
  assert.throws(() => getTypingPrompt('unknown'), RangeError);
});

test('typing progress accepts Unicode graphemes, preserves corrections, and completes only exact text', () => {
  assert.deepEqual(evaluateTyping('é猫', 'é猫'), { complete: true, correct: 2, typed: 2, total: 2, accuracy: 100 });
  assert.deepEqual(evaluateTyping('home', 'hX'), { complete: false, correct: 1, typed: 2, total: 4, accuracy: 50 });
  assert.deepEqual(evaluateTyping('home', ''), { complete: false, correct: 0, typed: 0, total: 4, accuracy: 100 });
});

test('custom practice text is local, normalized, and size bounded', () => {
  assert.deepEqual(validateCustomPrompt('  你好 café  '), { ok: true, prompt: '你好 café' });
  assert.deepEqual(validateCustomPrompt('   '), { ok: false, reason: 'empty' });
  assert.deepEqual(validateCustomPrompt('abcde', 4), { ok: false, reason: 'too-long' });
});

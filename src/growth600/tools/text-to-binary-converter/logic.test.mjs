import test from 'node:test';
import assert from 'node:assert/strict';
import { decodeBinaryToText, encodeTextToBinary, TEXT_BINARY_LIMITS } from './logic.mjs';

test('encodes text as exact UTF-8 bytes, including multibyte characters', () => {
  assert.equal(encodeTextToBinary('ñ'), '11000011 10110001');
  assert.equal(encodeTextToBinary('ñ', { groupBytes: false }), '1100001110110001');
  assert.equal(encodeTextToBinary('A'), '01000001');
});

test('round-trips Unicode, combining marks, newlines and a leading BOM', () => {
  for (const text of ['¡Hola, 👋!', 'e\u0301', 'line 1\nline 2', '\uFEFFstart']) {
    assert.equal(decodeBinaryToText(encodeTextToBinary(text)), text);
  }
});

test('decodes spaced or compact bit groups and allows common whitespace separators', () => {
  assert.equal(decodeBinaryToText('01001000 01101001'), 'Hi');
  assert.equal(decodeBinaryToText('01001000\n01101001\t'), 'Hi');
});

test('rejects empty, malformed, incomplete, invalid UTF-8 and oversized data', () => {
  assert.throws(() => encodeTextToBinary(''), { message: 'empty-input' });
  assert.throws(() => decodeBinaryToText(' \n '), { message: 'empty-input' });
  assert.throws(() => decodeBinaryToText('01201000'), { message: 'binary-invalid' });
  assert.throws(() => decodeBinaryToText('0100000'), { message: 'binary-incomplete' });
  assert.throws(() => decodeBinaryToText('11111111'), { message: 'utf8-invalid' });
  assert.throws(() => encodeTextToBinary('x'.repeat(TEXT_BINARY_LIMITS.textCharacters + 1)), { message: 'text-too-long' });
  assert.throws(() => decodeBinaryToText('0'.repeat(TEXT_BINARY_LIMITS.binaryBits + 8)), { message: 'binary-too-long' });
  assert.throws(() => decodeBinaryToText(' '.repeat(TEXT_BINARY_LIMITS.binaryCharacters + 1)), { message: 'binary-too-long' });
});

test('binary decode rejects truncated multibyte UTF-8 rather than replacing bytes silently', () => {
  assert.throws(() => decodeBinaryToText('11000011'), { message: 'utf8-invalid' });
});

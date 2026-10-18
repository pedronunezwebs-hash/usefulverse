import test from 'node:test';
import assert from 'node:assert/strict';
import { createWordGame, dailyWordIndex, scoreWordGuess, splitLetters, submitWordGuess, validateWordBank, wordBankFingerprint } from './five-letter-word.mjs';

test('scores repeated letters only as often as they occur in the answer', () => {
  assert.deepEqual(scoreWordGuess('allee', 'eerie'), ['present', 'absent', 'absent', 'absent', 'correct']);
  assert.deepEqual(scoreWordGuess('sassy', 'sssss'), ['correct', 'absent', 'correct', 'correct', 'absent']);
});

test('normalizes composed accents and counts visible graphemes', () => {
  assert.equal(splitLetters('a\u0301rbol').length, 5);
  assert.equal(validateWordBank(['a\u0301rbol', 'árbol', 'avión']).length, 2);
});

test('accepts five-letter alphabetic Bokmål words with locale-aware case folding', () => {
  assert.equal(validateWordBank(['Sjøen', 'åpner'], 'nb').length, 2);
});

test('daily index is stable per bank and UTC date, and varies by date/bank', () => {
  assert.equal(dailyWordIndex('2026-10-17', 5177, 'bokmal'), dailyWordIndex('2026-10-17', 5177, 'bokmal'));
  assert.notEqual(dailyWordIndex('2026-10-17', 5177, 'bokmal'), dailyWordIndex('2026-10-18', 5177, 'bokmal'));
  assert.notEqual(dailyWordIndex('2026-10-17', 5177, 'bokmal'), dailyWordIndex('2026-10-17', 5177, 'other'));
  let previous;
  for (let day = 0; day < 100; day += 1) {
    const date = new Date(Date.parse('2026-10-01T00:00:00Z') + day * 86400000).toISOString().slice(0, 10);
    const index = dailyWordIndex(date, 5177, 'bokmal');
    if (previous !== undefined) assert.notEqual(index, previous);
    previous = index;
  }
});

test('custom bank fingerprints are order-independent and change with the vocabulary', () => {
  assert.equal(wordBankFingerprint(['árbol', 'avión']), wordBankFingerprint(['avión', 'árbol']));
  assert.notEqual(wordBankFingerprint(['árbol', 'avión']), wordBankFingerprint(['silla', 'suelo']));
  assert.deepEqual(validateWordBank(['avión', 'árbol']), validateWordBank(['árbol', 'avión']));
});

test('game records guesses, wins, and ends at the configured attempt limit', () => {
  let game = createWordGame({ answer: 'sjøen', acceptedWords: ['sjøen', 'åpner', 'suger'], locale: 'nb', maxGuesses: 2 });
  game = submitWordGuess(game, 'suger');
  assert.equal(game.status, 'playing');
  game = submitWordGuess(game, 'sjøen');
  assert.equal(game.status, 'won');
  let lost = createWordGame({ answer: 'sjøen', acceptedWords: ['sjøen', 'åpner', 'suger'], locale: 'nb', maxGuesses: 1 });
  lost = submitWordGuess(lost, 'suger');
  assert.equal(lost.status, 'lost');
});

test('rejects malformed or unlisted guesses', () => {
  const game = createWordGame({ answer: 'arbol', acceptedWords: ['arbol', 'avion'] });
  assert.throws(() => submitWordGuess(game, 'xyzzy'), /not in/u);
  assert.throws(() => submitWordGuess(game, 'abc'), /five letters/u);
  assert.throws(() => createWordGame({ answer: 'other', acceptedWords: ['arbol', 'avion'] }), /selected word bank/u);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { createHangmanGame, getHangmanVisibleWord, guessHangmanLetter } from './logic.mjs';

test('a correct guess reveals every matching grapheme and a repeated guess never costs an attempt', () => {
  const game = createHangmanGame({ wordBank: ['apple'], random: () => 0 });
  const hit = guessHangmanLetter(game, 'p');
  assert.equal(hit.reason, 'hit');
  assert.equal(hit.game.wrong, 0);
  assert.deepEqual(getHangmanVisibleWord(hit.game), ['＿', 'p', 'p', '＿', '＿']);
  const repeated = guessHangmanLetter(hit.game, 'p');
  assert.equal(repeated.reason, 'duplicate');
  assert.equal(repeated.game.wrong, 0);
  assert.equal(repeated.game.guessed.length, 1);
});

test('wrong guesses use the selected limit and the lost word is revealed', () => {
  let game = createHangmanGame({ wordBank: ['oak'], random: () => 0, difficulty: 'hard' });
  for (const letter of ['x', 'y', 'z', 'v', 'w', 'q']) game = guessHangmanLetter(game, letter).game;
  assert.equal(game.status, 'lost');
  assert.equal(game.wrong, 6);
  assert.deepEqual(getHangmanVisibleWord(game), ['o', 'a', 'k']);
  assert.equal(guessHangmanLetter(game, 'o').reason, 'finished');
});

test('accented words accept a base-letter guess while preserving their displayed spelling', () => {
  const game = createHangmanGame({ wordBank: ['café'], random: () => 0 });
  const next = guessHangmanLetter(game, 'e').game;
  assert.deepEqual(getHangmanVisibleWord(next), ['＿', '＿', '＿', 'é']);
});

test('word bank, difficulty, random source and multi-grapheme guesses are validated', () => {
  assert.throws(() => createHangmanGame({ wordBank: [] }), /between 1 and 200 words/u);
  assert.throws(() => createHangmanGame({ wordBank: ['apple'], difficulty: 'extreme' }), /Choose easy/u);
  assert.throws(() => createHangmanGame({ wordBank: ['apple'], random: () => 1 }), /random source/u);
  const game = createHangmanGame({ wordBank: ['apple'], random: () => 0 });
  assert.equal(guessHangmanLetter(game, 'ab').reason, 'invalid');
});

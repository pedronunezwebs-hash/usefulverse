import assert from 'node:assert/strict';
import test from 'node:test';
import { analyzeReadability, MAX_READABILITY_CHARS } from './logic.mjs';

test('English Flesch score uses the selected formula and exposes the component counts', () => {
  const result = analyzeReadability('Cat sat. Dog ran.', 'en');
  assert.equal(result.wordCount, 4);
  assert.equal(result.sentenceCount, 2);
  assert.equal(result.syllableEstimate, 4);
  assert.equal(result.formula.id, 'flesch-reading-ease');
  assert.equal(result.score, 120.2);
  assert.equal(result.needsLongerSample, true);
});

test('Spanish uses Fernández-Huerta rather than the English formula', () => {
  const result = analyzeReadability('Casa bonita.', 'es');
  assert.equal(result.formula.id, 'fernandez-huerta');
  assert.equal(result.syllableEstimate, 5);
  assert.equal(result.score, 54.8);
});

test('French, German and Italian select language-specific indices', () => {
  assert.equal(analyzeReadability('La maison.', 'fr').formula.id, 'kandel-moles');
  assert.equal(analyzeReadability('Das Haus.', 'de').formula.id, 'amstad');
  const italian = analyzeReadability('La casa.', 'it');
  assert.equal(italian.formula.id, 'gulpease');
  assert.equal(italian.score, 209);
});

test('Unicode letters, words, whitespace and punctuation are counted without mutating text', () => {
  const source = 'Café, déjà vu!\n你好。こんにちは！';
  const result = analyzeReadability(source, 'fr');
  assert.equal(result.wordCount, 5);
  assert.equal(result.sentenceCount, 3);
  assert.equal(result.characterCountNoSpaces, [...source.replace(/\s/gu, '')].length);
  assert.equal(source, 'Café, déjà vu!\n你好。こんにちは！');
});

test('empty text, unsupported formulas and oversized input are explicit', () => {
  const empty = analyzeReadability('', 'en');
  assert.equal(empty.score, null);
  assert.equal(empty.wordCount, 0);
  assert.throws(() => analyzeReadability('text', 'ja'), /supported readability formula/u);
  assert.throws(() => analyzeReadability('x'.repeat(MAX_READABILITY_CHARS + 1)), /limited/u);
  assert.throws(() => analyzeReadability(null), /must be a string/u);
});

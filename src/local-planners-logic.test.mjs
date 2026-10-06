import test from 'node:test';
import assert from 'node:assert/strict';
import { abacusValue, canMove2048, changeAbacusRod, checkSpelling, countSudokuSolutions, create2048Board, decisionTotals, generateSudokuPuzzle, hangulChoices, kanaChoices, makeAbacusProblem, makeHangulRound, makeKanaRound, makeMemoryDeck, move2048, normalizeDecisionMatrix, normalizeQuizQuestion, parseSpellingWords, csvCell, shuffleItems, spawn2048Tile, validateWorkoutExercise } from './local-planners-logic.mjs';

test('decision matrix parses Unicode names and ranks weighted scores correctly', () => {
  const matrix = normalizeDecisionMatrix('Café\n茶', 'Cost | 2\nQuality | 8');
  matrix.scores = [[10, 4], [5, 8]];
  assert.deepEqual(decisionTotals(matrix), [5.2, 7.4]);
});

test('decision matrix rejects duplicates, malformed weights and invalid scores', () => {
  assert.throws(() => normalizeDecisionMatrix('A\na', 'Cost | 2'), /unique/u);
  assert.throws(() => normalizeDecisionMatrix('A\nB', 'Cost | 0'), /weight/u);
  const matrix = normalizeDecisionMatrix('A\nB', 'Cost | 1');
  matrix.scores[0][0] = 11;
  assert.throws(() => decisionTotals(matrix), /0 to 10/u);
});

test('CSV cells preserve commas, quotes and newlines', () => {
  assert.equal(csvCell('a,"b"'), '"a,""b"""');
  assert.equal(csvCell('plain'), 'plain');
});

test('workout entries validate bounded values without dropping Unicode names', () => {
  assert.deepEqual(validateWorkoutExercise({ name: 'Sentadilla 深蹲', sets: '4', reps: '8', rest: '90' }), { name: 'Sentadilla 深蹲', sets: 4, reps: 8, rest: 90 });
  assert.throws(() => validateWorkoutExercise({ name: '', sets: 3, reps: 10, rest: 60 }), /name/u);
  assert.throws(() => validateWorkoutExercise({ name: 'Run', sets: 0, reps: 10, rest: 60 }), /Sets/u);
});

test('quiz question validation trims Unicode text, keeps answer identity and rejects duplicates', () => {
  assert.deepEqual(normalizeQuizQuestion('  何？ ', [' correct ', 'wrong 1', 'wrong 2', 'wrong 3']), { question: '何？', answers: ['correct', 'wrong 1', 'wrong 2', 'wrong 3'], correct: 0 });
  assert.throws(() => normalizeQuizQuestion('', ['a', 'b', 'c', 'd']), /question/u);
  assert.throws(() => normalizeQuizQuestion('Q', ['a', 'a', 'b', 'c']), /different/u);
  assert.throws(() => normalizeQuizQuestion('Q', ['a', '', 'b', 'c']), /all four/u);
});

test('Fisher–Yates shuffle stays deterministic under an injected random source', () => {
  assert.deepEqual(shuffleItems(['a', 'b', 'c'], () => 0), ['b', 'c', 'a']);
  assert.throws(() => shuffleItems([1, 2], () => 1), /Random source/u);
});

test('memory deck has exactly one duplicate of every symbol for supported board sizes', () => {
  for (const count of [16, 24, 36]) {
    const deck = makeMemoryDeck(count, () => 0.5);
    assert.equal(deck.length, count);
    assert.equal(new Set(deck.map((card) => card.pair)).size, count / 2);
    assert.ok([...new Set(deck.map((card) => card.pair))].every((pair) => deck.filter((card) => card.pair === pair).length === 2));
  }
  assert.throws(() => makeMemoryDeck(20), /8, 12 or 18/u);
});

test('kana practice creates distinct basic kana in either script and answer choices contain one correct option', () => {
  for (const script of ['hiragana', 'katakana']) {
    const round = makeKanaRound(script, 20, () => 0.5);
    assert.equal(round.length, 20);
    assert.equal(new Set(round.map((item) => item.symbol)).size, 20);
    for (const item of round) {
      assert.ok(item.symbol);
      const choices = kanaChoices(item.answer, () => 0.5);
      assert.equal(choices.length, 4);
      assert.equal(choices.filter((value) => value === item.answer).length, 1);
    }
  }
  assert.throws(() => makeKanaRound('romaji', 5), /hiragana or katakana/u);
  assert.throws(() => makeKanaRound('hiragana', 6), /5, 10 or 20/u);
  assert.throws(() => kanaChoices('not-kana'), /basic kana/u);
});

test('Hangul practice creates distinct basic consonant/vowel rounds with one valid answer', () => {
  for (const group of ['all', 'consonants', 'vowels']) {
    const round = makeHangulRound(group, 5, () => 0.5);
    assert.equal(round.length, 5);
    assert.equal(new Set(round.map((item) => item.symbol)).size, 5);
    for (const item of round) {
      const choices = hangulChoices(item.answer, () => 0.5);
      assert.equal(choices.length, 4);
      assert.equal(choices.filter((value) => value === item.answer).length, 1);
    }
  }
  assert.throws(() => makeHangulRound('syllables', 5), /all, consonants or vowels/u);
  assert.throws(() => makeHangulRound('vowels', 20), /not enough symbols/u);
  assert.throws(() => hangulChoices('bad'), /basic Hangul/u);
});

test('2048 moves merge tiles once, score merges and preserve the board on a no-op', () => {
  const board = [2, 2, 2, 2, 4, 0, 4, 0, ...Array(8).fill(0)];
  const result = move2048(board, 'left');
  assert.deepEqual(result.board.slice(0, 8), [4, 4, 0, 0, 8, 0, 0, 0]);
  assert.equal(result.score, 16);
  assert.equal(result.changed, true);
  assert.deepEqual(move2048([2, 2, 2, 2, ...Array(12).fill(0)], 'right').board.slice(0, 4), [0, 0, 4, 4]);
  assert.equal(move2048([2, ...Array(15).fill(0)], 'down').board[12], 2);
  const settled = [8, 0, 0, 0, 4, 0, 0, 0, ...Array(8).fill(0)];
  assert.deepEqual(move2048(settled, 'left'), { board: settled, score: 0, changed: false });
  assert.deepEqual(move2048([2, 0, ...Array(14).fill(0)], 'up').board.slice(0, 4), [2, 0, 0, 0]);
  assert.throws(() => move2048(board, 'diagonal'), /left, right, up or down/u);
  assert.throws(() => move2048([3, ...Array(15).fill(0)], 'left'), /powers of two/u);
  assert.throws(() => move2048([2 ** 52, 2 ** 52, ...Array(14).fill(0)], 'left'), /safe integer/u);
});

test('2048 creates two starting tiles, spawns only into empty cells and detects terminal boards', () => {
  const board = create2048Board(() => 0.1);
  assert.equal(board.filter(Boolean).length, 2);
  assert.ok(board.every((value) => [0, 2, 4].includes(value)));
  assert.equal(spawn2048Tile(Array(16).fill(2), () => 0.5).length, 16);
  assert.equal(canMove2048([...Array(16).keys()].map((value) => 2 ** (value + 1))), false);
  assert.equal(canMove2048([2, 2, ...Array(14).fill(0)],), true);
  assert.throws(() => create2048Board(() => 1), /Random source/u);
});

test('Sudoku generator creates bounded puzzles with one valid solution at every difficulty', () => {
  for (const difficulty of ['easy', 'medium', 'hard']) {
    const game = generateSudokuPuzzle(difficulty, () => 0.37);
    assert.equal(game.puzzle.length, 81);
    assert.equal(game.solution.length, 81);
    assert.ok(game.solution.every((value) => Number.isInteger(value) && value >= 1 && value <= 9));
    assert.equal(game.puzzle.filter((value) => !value).length, game.blanks);
    assert.equal(countSudokuSolutions(game.puzzle, 2), 1);
    assert.ok(game.puzzle.every((value, index) => value === 0 || value === game.solution[index]));
  }
  assert.throws(() => generateSudokuPuzzle('expert'), /easy, medium or hard/u);
  assert.throws(() => countSudokuSolutions([1, 1, ...Array(79).fill(0)]), /clues conflict/u);
  assert.throws(() => countSudokuSolutions([], 3), /limit must be 1 or 2/u);
});

test('Sudoku generates different randomized boards on successive games', () => {
  const seededRandom = (seed) => () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 0x1_0000_0000;
  };
  const random = seededRandom(0x51d0_abcd);
  const first = generateSudokuPuzzle('medium', random);
  const next = generateSudokuPuzzle('medium', random);
  const anotherVisit = generateSudokuPuzzle('medium', seededRandom(0x5eed_1234));
  assert.notDeepEqual(next.puzzle, first.puzzle, 'a new game should not reuse the immediately previous puzzle');
  assert.notDeepEqual(anotherVisit.puzzle, first.puzzle, 'a separate visit should produce a different puzzle');
  for (const game of [first, next, anotherVisit]) assert.equal(countSudokuSolutions(game.puzzle, 2), 1);
});

test('Sudoku produces a distinct puzzle for each day in a 100-game sample', () => {
  const fingerprints = new Set();
  for (let day = 1; day <= 100; day += 1) {
    let seed = day * 0x9e37_79b1;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 0x1_0000_0000;
    };
    const puzzle = generateSudokuPuzzle('medium', random).puzzle.join('');
    fingerprints.add(puzzle);
  }
  assert.equal(fingerprints.size, 100, 'a long daily-play sample should receive distinct boards');
});

test('abacus builds bounded addition challenges and converts five rods to a number', () => {
  assert.deepEqual(makeAbacusProblem(() => 0), { left: 100, right: 100, sum: 200 });
  assert.equal(abacusValue([5, 2, 3, 0, 1]), 10325);
  assert.deepEqual(changeAbacusRod([0, 0, 0, 0, 0], 2, 1), [0, 0, 1, 0, 0]);
  assert.deepEqual(changeAbacusRod([9, 0, 0, 0, 0], 0, 1), [9, 0, 0, 0, 0]);
  assert.deepEqual(changeAbacusRod([0, 0, 0, 0, 0], 0, -1), [0, 0, 0, 0, 0]);
  assert.throws(() => abacusValue([10, 0, 0, 0, 0]), /0 to 9/u);
  assert.throws(() => changeAbacusRod([0, 0, 0, 0, 0], 5, 1), /rod/u);
  assert.throws(() => makeAbacusProblem(() => 1), /Random source/u);
});

test('spelling practice parses Unicode word-and-hint lists and checks spelling case-insensitively', () => {
  assert.deepEqual(parseSpellingWords('  Straße | a road\n茶 | drink'), [{ word: 'Straße', hint: 'a road' }, { word: '茶', hint: 'drink' }]);
  assert.equal(checkSpelling('  STRASSE  ', 'Straße'), false);
  assert.equal(checkSpelling('  茶 ', '茶'), true);
  assert.equal(checkSpelling('cafe\u0301', 'café'), true);
  assert.throws(() => parseSpellingWords('café | hint\ncafe\u0301 | another hint'), /unique/u);
  assert.throws(() => parseSpellingWords('word | hint'), /between 2 and 100/u);
  assert.throws(() => parseSpellingWords('word\nother'), /hint separated/u);
  assert.throws(() => parseSpellingWords('word | hint\nWORD | second'), /unique/u);
  assert.equal(checkSpelling('', 'answer'), false);
});

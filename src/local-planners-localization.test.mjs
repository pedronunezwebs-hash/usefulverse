import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { locales } from './locales.mjs';
import { generatedOpportunityCopy } from './locales/generated-opportunity-copy.mjs';
import { opportunityToolMarkup } from './opportunity-template.mjs';

const ids = ['quiz-maker', 'memory-game', 'kana-practice', 'abacus-practice', 'spelling-practice', 'hangul-practice', '2048-game', 'sudoku', 'tic-tac-toe', 'solitaire', 'minesweeper', 'nonogram', 'sliding-puzzle', 'css-animation-generator', 'css-clip-path-editor', 'css-filter-generator'];

test('study and spelling tools have localized page copy and controls in every published locale', () => {
  assert.equal(Object.keys(locales).length, 36);
  for (const language of Object.keys(locales)) {
    const data = generatedOpportunityCopy[language];
    assert.ok(data, `${language} has generated copy`);
    for (const id of ids) {
      assert.equal(data.copy[id]?.length, 6, `${language} ${id} page copy`);
      assert.ok(data.copy[id].every((value) => typeof value === 'string' && value.trim()), `${language} ${id} page copy is non-empty`);
      const html = opportunityToolMarkup(id, language, data.ui, data.copy[id][0]);
      assert.match(html, new RegExp(`data-tool="${id}"`, 'u'));
      assert.ok(!html.includes('undefined'), `${language} ${id} markup has no undefined text`);
    }
  }
});

test('study-game localized messages retain interpolation variables', () => {
  const keys = ['Question {current} of {total}', 'Not quite. The correct answer was: {answer}', 'Quiz complete: {score} out of {total}.', 'Card {number}', 'You matched all {pairs} pairs in {moves} moves and {time}.', 'Not quite. The answer is {answer}.', 'Not quite. The reading is {answer}.', 'Round complete: {score} of {total} correct.', 'Place {value}', 'Increase place {value}', 'Your value: {value}', 'Correct! {left} + {right} = {sum}.', 'Word {current} of {total}', 'Tile {value}', 'No moves left. Score: {score}.', 'Score: {score}', 'Row {row}, column {column}: {value}', 'Given: {value}', 'Notes: {value}', 'Square {number}: {value}', 'X wins: {count}', 'O wins: {count}', 'Draws: {count}', 'Mines left: {count}', 'Time: {time}', 'Minesweeper board: {rows} rows, {columns} columns', 'Row {row}, column {column}: {state}', 'Adjacent mines: {count}', 'Column {number} clues: {clues}', 'Row {number} clues: {clues}', 'Moves: {count}', 'Puzzle solved in {count} moves!', 'Tile {number}'];
  for (const [language, data] of Object.entries(generatedOpportunityCopy)) {
    for (const key of keys) {
      const translation = data.ui?.[key];
      assert.equal(typeof translation, 'string', `${language} has ${key}`);
      assert.deepEqual([...translation.matchAll(/\{(\w+)\}/gu)].map((match) => match[1]).sort(), [...key.matchAll(/\{(\w+)\}/gu)].map((match) => match[1]).sort(), `${language} keeps placeholders in ${key}`);
    }
  }
});

test('CSS design tool controls and status messages are localized in every locale', () => {
  const labels = ['Effect', 'CSS output', 'Copy CSS', 'Shape', 'Brightness', 'Filter preview', 'CSS copied.'];
  for (const language of Object.keys(locales)) {
    const html = opportunityToolMarkup('css-animation-generator', language, generatedOpportunityCopy[language].ui, generatedOpportunityCopy[language].copy['css-animation-generator'][0]);
    assert.match(html, /data-css-messages=/u, `${language} has runtime messages`);
    for (const label of labels) assert.ok(generatedOpportunityCopy[language].ui[label]?.trim(), `${language} translates ${label}`);
  }
});

test('web development generators expose localized controls and lazy runtime messages in every locale', () => {
  const labels = ['HTTP method', 'Request URL', 'Headers as JSON', 'Request body', 'Output format', 'Build code', 'Copy code', 'App name', 'Start URL', 'Display mode', 'First row contains headings', 'Tab-separated rows', 'Generate table'];
  for (const language of Object.keys(locales)) {
    for (const [id, body] of [['api-request-builder', 'Generated examples are local text only. Browser CORS, authentication, server rules and network access may affect a request you run elsewhere. Do not paste secrets into shared devices.'], ['html-table-generator', 'Cell content is escaped as text, not executed as HTML. The preview is local. Use a screen-reader-friendly table caption and headings where they help explain the data.'], ['pwa-manifest-generator', 'This creates the manifest file only. You must add it to your site and configure valid app icons and service-worker behavior separately; a manifest alone does not make a site installable.']]) {
      const html = opportunityToolMarkup(id, language, generatedOpportunityCopy[language].ui, generatedOpportunityCopy[language].copy[id][0]);
      assert.match(html, /data-web-dev-messages=/u, `${language}/${id} has runtime messages`);
      assert.match(html, /data-web-dev=/u, `${language}/${id} has a specific workspace`);
      assert.equal(generatedOpportunityCopy[language].copy[id].length, 6, `${language}/${id} has localized copy`);
      if (language !== 'en') assert.notEqual(generatedOpportunityCopy[language].copy[id][5], body, `${language}/${id} translates its SEO/body copy`);
    }
    for (const label of labels) assert.ok(generatedOpportunityCopy[language].ui[label]?.trim(), `${language} translates ${label}`);
  }
});

test('web development runtime is split from the shared runtime and never sends generated API requests', async () => {
  const [opportunity, runtime] = await Promise.all(['opportunity-runtime.js', 'web-dev-tools.js'].map((file) => readFile(new URL(`./${file}`, import.meta.url), 'utf8')));
  assert.match(opportunity, /web-dev-tools\.js/u);
  assert.match(runtime, /setupWebDevTool/u);
  assert.doesNotMatch(runtime, /fetch\(/u);
});

test('local board games expose translated turn/status text and load their engine only on the matching routes', async () => {
  const labels = ['Two players share this device. Moves are not saved or uploaded.', 'Current turn: Red', 'Current turn: Black', 'New game', 'Pass turn', 'Connect Four board', 'Reversi board', 'Row {row}, column {column}: {state}', 'Red wins!', 'Black wins!', 'Game tied.'];
  for (const language of Object.keys(locales)) {
    for (const id of ['connect-four', 'reversi']) {
      const html = opportunityToolMarkup(id, language, generatedOpportunityCopy[language].ui, generatedOpportunityCopy[language].copy[id][0]);
      assert.match(html, /data-board-game-messages=/u, `${language}/${id} has localized game messages`);
      assert.match(html, /data-board-grid/u, `${language}/${id} has a game board`);
    }
    for (const key of labels) assert.ok(generatedOpportunityCopy[language].ui[key]?.trim(), `${language} has ${key}`);
  }
  const app = await readFile(new URL('./app.js', import.meta.url), 'utf8');
  const runtime = await readFile(new URL('./board-games-runtime.js', import.meta.url), 'utf8');
  assert.match(app, /id === 'connect-four' \|\| id === 'reversi'/u);
  assert.match(app, /board-games-runtime\.js/u);
  assert.match(runtime, /setupBoardGame/u);
  assert.doesNotMatch(runtime, /fetch\(/u);
});

test('new planner, practice and puzzle engines are registered with the browser runtime loader', async () => {
  const app = await readFile(new URL('./app.js', import.meta.url), 'utf8');
  for (const id of ['packing-list-maker', 'decision-matrix', 'workout-planner', ...ids]) assert.match(app, new RegExp(`opportunityTools\\.add\\('${id}'\\)`, 'u'));
});

test('study, Hangul and puzzle runtimes load on demand instead of inflating the shared runtime', async () => {
  const [opportunity, study, spelling, hangul, game, sudoku, ticTacToe, solitaire, minesweeper] = await Promise.all(['opportunity-runtime.js', 'local-study-runtime.js', 'spelling-practice-runtime.js', 'hangul-practice-runtime.js', '2048-game-runtime.js', 'sudoku-runtime.js', 'tic-tac-toe-runtime.js', 'solitaire-runtime.js', 'minesweeper-runtime.js'].map((file) => readFile(new URL(`./${file}`, import.meta.url), 'utf8')));
  assert.match(opportunity, /spelling-practice-runtime\.js/u);
  assert.match(opportunity, /hangul-practice-runtime\.js/u);
  assert.match(opportunity, /2048-game-runtime\.js/u);
  assert.doesNotMatch(opportunity, /local-study-runtime\.js.*spelling-practice/u);
  assert.doesNotMatch(study, /spelling-practice/u);
  assert.doesNotMatch(study, /hangul-practice/u);
  assert.doesNotMatch(study, /2048-game/u);
  assert.match(spelling, /setupSpellingPractice/u);
  assert.match(hangul, /setupHangulPractice/u);
  assert.match(game, /setup2048Game/u);
  assert.match(opportunity, /sudoku-runtime\.js/u);
  assert.match(sudoku, /setupSudoku/u);
  assert.match(sudoku, /crypto\?\.getRandomValues/u);
  assert.match(sudoku, /RECENT_PUZZLE_LIMIT = 4096/u);
  assert.match(sudoku, /localStorage\.setItem\(RECENT_PUZZLES_KEY, JSON\.stringify\(recentPuzzles\)\)/u);
  assert.match(sudoku, /for \(let attempt = 0; attempt < 64; attempt \+= 1\)/u);
  assert.match(opportunity, /tic-tac-toe-runtime\.js/u);
  assert.match(ticTacToe, /setupTicTacToe/u);
  assert.match(opportunity, /minesweeper-runtime\.js/u);
  assert.match(minesweeper, /setupMinesweeper/u);
  assert.match(minesweeper, /revealMinesweeperCell\(game, index, randomMinesweeperValue\)/u);
  assert.match(minesweeper, /contextmenu/u);
  assert.match(minesweeper, /ArrowRight/u);
  assert.match(minesweeper, /tabIndex = index === focusedCell \? 0 : -1/u);
  assert.doesNotMatch(minesweeper, /fetch\(/u);
  assert.match(opportunity, /nonogram-runtime\.js/u);
  const nonogram = await readFile(new URL('./nonogram-runtime.js', import.meta.url), 'utf8');
  assert.match(nonogram, /setupNonogram/u);
  assert.match(nonogram, /checkNonogramSolution/u);
  assert.match(opportunity, /sliding-puzzle-runtime\.js/u);
  const sliding = await readFile(new URL('./sliding-puzzle-runtime.js', import.meta.url), 'utf8');
  assert.match(sliding, /setupSlidingPuzzle/u);
  assert.match(sliding, /newSlidingPuzzle\(size, randomTileValue\)/u);
});

import { checkKakuroSolution, createKakuroPuzzle, getKakuroHint, normalizeKakuroDigit } from './kakuro-logic.mjs';

export function setupKakuro(root) {
  const $ = (selector) => root.querySelector(selector);
  const messages = (() => { try { return JSON.parse(root.dataset.plannerMessages || '{}'); } catch { return {}; } })();
  const cells = [...root.querySelectorAll('[data-kakuro-cell]')];
  const status = $('#op-status');
  let puzzle = null;
  const say = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), messages[key] || key);
  const entries = () => Array.from({ length: 4 }, (_, row) => Array.from({ length: 4 }, (_, column) => Number($(`[data-kakuro-cell="${row},${column}"]`).value || 0)));
  const announce = (key, error = false) => {
    status.textContent = say(key);
    status.dataset.state = error ? 'error' : 'ready';
  };

  function start() {
    puzzle = createKakuroPuzzle();
    cells.forEach((cell) => { cell.value = ''; cell.removeAttribute('aria-invalid'); });
    puzzle.rowSums.forEach((sum, index) => { $(`[data-kakuro-row="${index}"]`).textContent = say('Row {number} sum: {sum}', { number: index + 1, sum }); });
    puzzle.columnSums.forEach((sum, index) => { $(`[data-kakuro-column="${index}"]`).textContent = say('Column {number} sum: {sum}', { number: index + 1, sum }); });
    announce('New puzzle generated.');
  }

  for (const cell of cells) {
    cell.addEventListener('input', () => {
      const digit = normalizeKakuroDigit(cell.value);
      cell.value = digit;
      cell.removeAttribute('aria-invalid');
    });
  }
  $('[data-kakuro-new]').addEventListener('click', start);
  $('[data-kakuro-clear]').addEventListener('click', () => { cells.forEach((cell) => { cell.value = ''; cell.removeAttribute('aria-invalid'); }); announce('Entries cleared.'); });
  $('[data-kakuro-hint]').addEventListener('click', () => {
    const hint = getKakuroHint(puzzle, entries());
    if (!hint) return announce('No empty cell remains for a hint.', true);
    const cell = $(`[data-kakuro-cell="${hint.row},${hint.column}"]`);
    cell.value = String(hint.value);
    cell.focus();
    announce('A hint was added.');
  });
  $('[data-kakuro-check]').addEventListener('click', () => {
    const values = entries();
    if (values.some((row) => row.some((value) => !value))) return announce('Fill all 16 cells before checking.', true);
    const valid = checkKakuroSolution(puzzle, values);
    cells.forEach((cell) => {
      const [row, column] = cell.dataset.kakuroCell.split(',').map(Number);
      const invalid = !valid && (values[row][column] < 1 || values[row][column] > 9 || new Set(values[row]).size < 4 || new Set(values.map((line) => line[column])).size < 4 || values[row].reduce((sum, digit) => sum + digit, 0) !== puzzle.rowSums[row] || values.map((line) => line[column]).reduce((sum, digit) => sum + digit, 0) !== puzzle.columnSums[column]);
      if (invalid) cell.setAttribute('aria-invalid', 'true'); else cell.removeAttribute('aria-invalid');
    });
    announce(valid ? 'Puzzle solved!' : 'Not yet. Check the row and column sums and remove repeated digits.', !valid);
  });
  start();
}

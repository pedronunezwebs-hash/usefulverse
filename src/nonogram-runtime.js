import { checkNonogramSolution, generateNonogram } from './nonogram-logic.mjs';

function randomNonogramValue() {
  if (globalThis.crypto?.getRandomValues) { const value = new Uint32Array(1); globalThis.crypto.getRandomValues(value); return value[0] / 0x1_0000_0000; }
  return Math.random();
}

export function setupNonogram(root) {
  const messages = JSON.parse(root.dataset.plannerMessages || '{}');
  const say = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll('{' + name + '}', String(value)), messages[key] ?? key);
  const board = root.querySelector('[data-nonogram-board]'); const status = root.querySelector('#op-status');
  let game = generateNonogram(randomNonogramValue); let entries = Array.from({ length: game.size }, () => Array(game.size).fill(-1)); let focused = 0;
  const announce = (key, values = {}, kind = '') => { status.textContent = say(key, values); status.className = 'tool-status' + (kind ? ' is-' + kind : ''); };
  const clueText = (clue) => clue[0] === 0 ? '0' : clue.join(' ');
  const render = (restoreFocus = false) => {
    board.replaceChildren(); board.style.setProperty('--nonogram-size', String(game.size));
    const corner = document.createElement('span'); corner.className = 'local-nonogram__corner'; corner.setAttribute('aria-hidden', 'true'); board.append(corner);
    for (let column = 0; column < game.size; column += 1) {
      const clue = document.createElement('span'); clue.className = 'local-nonogram__clue local-nonogram__clue--column'; clue.textContent = clueText(game.columns[column]);
      clue.setAttribute('aria-label', say('Column {number} clues: {clues}', { number: column + 1, clues: clueText(game.columns[column]) })); board.append(clue);
    }
    for (let row = 0; row < game.size; row += 1) {
      const clue = document.createElement('span'); clue.className = 'local-nonogram__clue local-nonogram__clue--row'; clue.textContent = clueText(game.rows[row]);
      clue.setAttribute('aria-label', say('Row {number} clues: {clues}', { number: row + 1, clues: clueText(game.rows[row]) })); board.append(clue);
      for (let column = 0; column < game.size; column += 1) {
        const index = row * game.size + column; const value = entries[row][column]; const button = document.createElement('button');
        button.type = 'button'; button.className = 'local-nonogram__cell' + (value === 1 ? ' is-filled' : value === 0 ? ' is-crossed' : '');
        button.dataset.nonogramCell = String(index); button.tabIndex = focused === index ? 0 : -1; button.setAttribute('aria-pressed', String(value === 1));
        button.textContent = value === 1 ? '■' : value === 0 ? '×' : '';
        const state = value === 1 ? 'Filled' : value === 0 ? 'Marked empty' : 'Unknown';
        button.setAttribute('aria-label', say('Row {row}, column {column}: {state}', { row: row + 1, column: column + 1, state: say(state) }));
        board.append(button);
      }
    }
    if (restoreFocus) board.querySelector(`[data-nonogram-cell="${focused}"]`)?.focus();
  };
  const mark = (index, mode = 'cycle') => {
    const row = Math.floor(index / game.size); const column = index % game.size;
    if (mode === 'empty') entries[row][column] = 0;
    else if (mode === 'fill') entries[row][column] = 1;
    else entries[row][column] = entries[row][column] === -1 ? 1 : entries[row][column] === 1 ? 0 : -1;
    focused = index; render(true);
  };
  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-nonogram-new]')) { game = generateNonogram(randomNonogramValue); entries = Array.from({ length: game.size }, () => Array(game.size).fill(-1)); focused = 0; render(true); announce('New unique puzzle generated.'); return; }
    if (event.target.closest('[data-nonogram-clear]')) { entries = Array.from({ length: game.size }, () => Array(game.size).fill(-1)); render(true); announce('Marks cleared.'); return; }
    if (event.target.closest('[data-nonogram-check]')) {
      if (entries.some((row) => row.includes(-1))) return announce('Mark every cell as filled or empty first.', {}, 'error');
      if (checkNonogramSolution(game, entries)) announce('Puzzle solved!', {}, 'success'); else announce('Not solved yet. Compare your marks with the clues.', {}, 'error');
      return;
    }
    const cell = event.target.closest('[data-nonogram-cell]');
    if (cell) mark(Number(cell.dataset.nonogramCell));
  });
  root.addEventListener('contextmenu', (event) => {
    const cell = event.target.closest('[data-nonogram-cell]'); if (!cell) return;
    event.preventDefault(); mark(Number(cell.dataset.nonogramCell), 'empty');
  });
  root.addEventListener('keydown', (event) => {
    const cell = event.target.closest('[data-nonogram-cell]'); if (!cell) return;
    const index = Number(cell.dataset.nonogramCell); const row = Math.floor(index / game.size); const column = index % game.size;
    const moves = { ArrowLeft: [row, Math.max(0, column - 1)], ArrowRight: [row, Math.min(game.size - 1, column + 1)], ArrowUp: [Math.max(0, row - 1), column], ArrowDown: [Math.min(game.size - 1, row + 1), column] };
    if (moves[event.key]) { event.preventDefault(); focused = moves[event.key][0] * game.size + moves[event.key][1]; board.querySelector(`[data-nonogram-cell="${focused}"]`)?.focus(); }
    else if (event.key.toLowerCase() === 'x') { event.preventDefault(); mark(index, 'empty'); }
  });
  render(); announce('Use the clues to find the hidden picture. Click a cell to cycle its mark.');
}

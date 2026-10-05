import { chordMinesweeperCell, createMinesweeperGame, elapsedMinesweeperSeconds, minesweeperRemaining, revealMinesweeperCell, toggleMinesweeperFlag } from './minesweeper-logic.mjs';

function randomMinesweeperValue() {
  if (globalThis.crypto?.getRandomValues) { const value = new Uint32Array(1); globalThis.crypto.getRandomValues(value); return value[0] / 0x1_0000_0000; }
  return Math.random();
}

export function setupMinesweeper(root) {
  const messages = JSON.parse(root.dataset.plannerMessages || '{}');
  const say = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll('{' + name + '}', String(value)), messages[key] ?? key);
  const difficulty = root.querySelector('[data-minesweeper-difficulty]');
  const board = root.querySelector('[data-minesweeper-board]');
  const flagButton = root.querySelector('[data-minesweeper-flag-mode]');
  const status = root.querySelector('#op-status');
  const minesLeft = root.querySelector('[data-minesweeper-mines-left]');
  const timeOutput = root.querySelector('[data-minesweeper-time]');
  let game = createMinesweeperGame(difficulty.value);
  let flagMode = false;
  let timer = 0;
  let focusedCell = 0;

  const stopTimer = () => { if (timer) clearInterval(timer); timer = 0; };
  const announce = (key, values = {}, kind = '') => { status.textContent = say(key, values); status.className = 'tool-status' + (kind ? ' is-' + kind : ''); };
  const updateClock = () => { timeOutput.textContent = say('Time: {time}', { time: elapsedMinesweeperSeconds(game) }); };
  const ensureClock = () => {
    if (!timer && game.status === 'playing') timer = setInterval(() => { updateClock(); if (game.status !== 'playing') stopTimer(); }, 1000);
  };
  const render = (restoreFocus = false) => {
    board.replaceChildren(); board.style.setProperty('--minesweeper-columns', String(game.columns));
    board.setAttribute('aria-label', say('Minesweeper board: {rows} rows, {columns} columns', { rows: game.rows, columns: game.columns }));
    game.cells.forEach((cell, index) => {
      const button = document.createElement('button'); const row = Math.floor(index / game.columns) + 1; const column = index % game.columns + 1;
      button.type = 'button'; button.className = 'local-minesweeper__cell'; button.dataset.minesweeperCell = String(index);
      button.tabIndex = index === focusedCell ? 0 : -1;
      if (cell.mine && (cell.revealed || game.status === 'lost')) {
        button.classList.add('is-revealed', 'is-mine'); button.textContent = '✹'; button.setAttribute('aria-label', say('Row {row}, column {column}: {state}', { row, column, state: say('Mine') }));
      } else if (cell.revealed) {
        button.classList.add('is-revealed');
        if (cell.adjacent) { button.classList.add('has-number', 'number-' + cell.adjacent); button.textContent = String(cell.adjacent); button.setAttribute('aria-label', say('Row {row}, column {column}: {state}', { row, column, state: say('Adjacent mines: {count}', { count: cell.adjacent }) })); }
        else { button.setAttribute('aria-label', say('Row {row}, column {column}: {state}', { row, column, state: say('Empty') })); }
      } else if (cell.flagged) { button.classList.add('is-flagged'); button.textContent = '⚑'; button.setAttribute('aria-label', say('Row {row}, column {column}: {state}', { row, column, state: say('Flagged') })); }
      else { button.setAttribute('aria-label', say('Row {row}, column {column}: {state}', { row, column, state: say('Hidden cell') })); }
      if (game.status === 'lost' && cell.mine) button.classList.add('is-mine');
      board.append(button);
    });
    minesLeft.textContent = say('Mines left: {count}', { count: minesweeperRemaining(game) });
    updateClock();
    flagButton.setAttribute('aria-pressed', String(flagMode));
    flagButton.textContent = say(flagMode ? 'Flag mode on' : 'Flag mode off');
    flagButton.disabled = game.status === 'won' || game.status === 'lost';
    if (restoreFocus) board.querySelector(`[data-minesweeper-cell="${focusedCell}"]`)?.focus();
  };
  const applyResult = (result) => {
    render(true);
    if (game.status !== 'playing') stopTimer(); else ensureClock();
    if (result === 'won') announce('Board cleared. You win!', {}, 'success');
    else if (result === 'lost') announce('Mine found. Game over.', {}, 'error');
    else if (result !== 'ignored' && result !== 'finished') announce('');
  };
  root.addEventListener('change', (event) => {
    if (!event.target.matches('[data-minesweeper-difficulty]')) return;
    stopTimer(); game = createMinesweeperGame(difficulty.value); flagMode = false; focusedCell = 0; render(true); announce('Select a cell to start. Your first click is safe.');
  });
  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-minesweeper-new]')) { stopTimer(); game = createMinesweeperGame(difficulty.value); flagMode = false; focusedCell = 0; render(true); announce('Game reset.'); return; }
    if (event.target.closest('[data-minesweeper-flag-mode]')) { flagMode = !flagMode; render(); announce(flagMode ? 'Flag mode on' : 'Flag mode off'); return; }
    const target = event.target.closest('[data-minesweeper-cell]');
    if (!target) return;
    const index = Number(target.dataset.minesweeperCell); const cell = game.cells[index];
    if (flagMode) {
      focusedCell = index; const changed = toggleMinesweeperFlag(game, index); render(true);
      announce(changed ? (game.cells[index].flagged ? 'Cell flagged.' : 'Flag removed.') : 'You have reached the flag limit.', {}, changed ? '' : 'error'); return;
    }
    if (cell.revealed) return applyResult(chordMinesweeperCell(game, index));
    return applyResult(revealMinesweeperCell(game, index, randomMinesweeperValue));
  });
  root.addEventListener('keydown', (event) => {
    const target = event.target.closest('[data-minesweeper-cell]');
    if (!target) return;
    const index = Number(target.dataset.minesweeperCell); const row = Math.floor(index / game.columns); const column = index % game.columns;
    const moves = { ArrowLeft: [row, Math.max(0, column - 1)], ArrowRight: [row, Math.min(game.columns - 1, column + 1)], ArrowUp: [Math.max(0, row - 1), column], ArrowDown: [Math.min(game.rows - 1, row + 1), column] };
    if (moves[event.key]) { event.preventDefault(); focusedCell = moves[event.key][0] * game.columns + moves[event.key][1]; board.querySelector(`[data-minesweeper-cell="${focusedCell}"]`)?.focus(); return; }
    if (event.key.toLowerCase() === 'f') {
      event.preventDefault(); focusedCell = index; const changed = toggleMinesweeperFlag(game, index); render(true);
      announce(changed ? (game.cells[index].flagged ? 'Cell flagged.' : 'Flag removed.') : 'You have reached the flag limit.', {}, changed ? '' : 'error');
    }
  });
  root.addEventListener('contextmenu', (event) => {
    const target = event.target.closest('[data-minesweeper-cell]');
    if (!target) return;
    event.preventDefault(); const index = Number(target.dataset.minesweeperCell);
    focusedCell = index; const changed = toggleMinesweeperFlag(game, index); render(true);
    announce(changed ? (game.cells[index].flagged ? 'Cell flagged.' : 'Flag removed.') : 'You have reached the flag limit.', {}, changed ? '' : 'error');
  });
  render(); announce('Select a cell to start. Your first click is safe.');
}

import { isSlidingPuzzleSolved, moveSlidingTile, newSlidingPuzzle } from './sliding-puzzle-logic.mjs';

function randomTileValue() {
  if (globalThis.crypto?.getRandomValues) { const value = new Uint32Array(1); globalThis.crypto.getRandomValues(value); return value[0] / 0x1_0000_0000; }
  return Math.random();
}

export function setupSlidingPuzzle(root) {
  const messages = JSON.parse(root.dataset.plannerMessages || '{}');
  const say = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), messages[key] ?? key);
  const boardElement = root.querySelector('[data-sliding-board]'); const status = root.querySelector('#op-status');
  const sizeSelect = root.querySelector('[data-sliding-size]'); const movesOutput = root.querySelector('[data-sliding-moves]');
  let size = Number(sizeSelect.value); let board = newSlidingPuzzle(size, randomTileValue); let moves = 0; let focusIndex = 0;
  const announce = (key, values = {}, kind = '') => { status.textContent = say(key, values); status.className = 'tool-status' + (kind ? ` is-${kind}` : ''); };
  const render = (restoreFocus = false) => {
    boardElement.replaceChildren(); boardElement.style.setProperty('--sliding-size', String(size)); movesOutput.textContent = say('Moves: {count}', { count: moves });
    board.forEach((value, index) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'local-sliding__tile' + (value === 0 ? ' is-empty' : '');
      button.dataset.slidingTile = String(index); button.tabIndex = index === focusIndex ? 0 : -1;
      button.textContent = value === 0 ? '' : String(value); button.setAttribute('aria-label', value === 0 ? say('Empty space') : say('Tile {number}', { number: value }));
      boardElement.append(button);
    });
    if (restoreFocus) boardElement.querySelector(`[data-sliding-tile="${focusIndex}"]`)?.focus();
  };
  const play = (index) => {
    const next = moveSlidingTile(board, index, size);
    if (!next) return false;
    board = next; moves += 1; focusIndex = board.indexOf(0); render(true);
    if (isSlidingPuzzleSolved(board)) announce('Puzzle solved in {count} moves!', { count: moves }, 'success');
    else announce('Tile moved.');
    return true;
  };
  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-sliding-new]')) { size = Number(sizeSelect.value); board = newSlidingPuzzle(size, randomTileValue); moves = 0; focusIndex = board.indexOf(0); render(true); announce('New puzzle ready.'); return; }
    const tile = event.target.closest('[data-sliding-tile]'); if (tile) play(Number(tile.dataset.slidingTile));
  });
  sizeSelect.addEventListener('change', () => { size = Number(sizeSelect.value); board = newSlidingPuzzle(size, randomTileValue); moves = 0; focusIndex = board.indexOf(0); render(); announce('New puzzle ready.'); });
  boardElement.addEventListener('keydown', (event) => {
    const tile = event.target.closest('[data-sliding-tile]'); if (!tile) return;
    const index = Number(tile.dataset.slidingTile); const row = Math.floor(index / size); const column = index % size;
    const target = { ArrowLeft: column > 0 ? index - 1 : -1, ArrowRight: column < size - 1 ? index + 1 : -1, ArrowUp: row > 0 ? index - size : -1, ArrowDown: row < size - 1 ? index + size : -1 }[event.key];
    if (target === undefined) return;
    event.preventDefault(); if (!play(target)) { focusIndex = index; render(true); }
  });
  render(); announce('Use the arrow keys or select a tile beside the empty space.');
}

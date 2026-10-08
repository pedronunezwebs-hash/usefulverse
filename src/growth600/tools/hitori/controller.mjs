import { checkHitoriBoard, createHitoriPuzzle, findHitoriHint } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="hitori"]');
if (root) {
  const copy = readToolCopy(root);
  const sizeControl = root.querySelector('[data-size]');
  const difficultyControl = root.querySelector('[data-difficulty]');
  const board = root.querySelector('[data-board]');
  let puzzle;
  let blackCells = new Set();

  function cellLabel(index, value, isBlack) {
    const row = Math.floor(index / puzzle.size) + 1;
    const column = index % puzzle.size + 1;
    return `${copy.fields.cell} ${copy.fields.row} ${row}, ${copy.fields.column} ${column}: ${value}, ${isBlack ? copy.fields.black : copy.fields.white}`;
  }

  function render(focusIndex = null) {
    const fragment = document.createDocumentFragment();
    board.style.setProperty('--hitori-size', String(puzzle.size));
    board.setAttribute('aria-rowcount', String(puzzle.size));
    board.setAttribute('aria-colcount', String(puzzle.size));
    for (let rowIndex = 0; rowIndex < puzzle.size; rowIndex += 1) {
      const row = document.createElement('div');
      row.className = 'hitori-row';
      row.setAttribute('role', 'row');
      row.setAttribute('aria-label', `${copy.fields.row} ${rowIndex + 1}`);
      for (let columnIndex = 0; columnIndex < puzzle.size; columnIndex += 1) {
        const index = rowIndex * puzzle.size + columnIndex;
        const isBlack = blackCells.has(index);
        const gridCell = document.createElement('div');
        gridCell.setAttribute('role', 'gridcell');
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = `hitori-cell${isBlack ? ' is-black' : ''}`;
        cell.setAttribute('aria-pressed', String(isBlack));
        cell.setAttribute('aria-label', cellLabel(index, puzzle.grid[rowIndex][columnIndex], isBlack));
        cell.dataset.cellIndex = String(index);
        cell.tabIndex = focusIndex === index || focusIndex === null && index === 0 ? 0 : -1;
        cell.textContent = isBlack ? '×' : String(puzzle.grid[rowIndex][columnIndex]);
        gridCell.append(cell);
        row.append(gridCell);
      }
      fragment.append(row);
    }
    board.replaceChildren(fragment);
    if (focusIndex !== null) board.querySelector(`[data-cell-index="${focusIndex}"]`)?.focus();
  }

  function newPuzzle() {
    try {
      puzzle = createHitoriPuzzle({ size: Number(sizeControl.value), difficulty: difficultyControl.value });
      blackCells = new Set();
      render();
      announce(root, copy.messages.newPuzzle, 'success');
    } catch {
      announce(root, copy.messages.generationFailed, 'error');
    }
  }

  board.addEventListener('click', (event) => {
    const cell = event.target.closest('[data-cell-index]');
    if (!cell || !board.contains(cell)) return;
    const index = Number(cell.dataset.cellIndex);
    if (blackCells.has(index)) blackCells.delete(index);
    else blackCells.add(index);
    render(index);
    announce(root, blackCells.has(index) ? copy.messages.markedBlack : copy.messages.markedWhite, 'info');
  });

  board.addEventListener('keydown', (event) => {
    const cell = event.target.closest('[data-cell-index]');
    if (!cell) return;
    const index = Number(cell.dataset.cellIndex);
    const row = Math.floor(index / puzzle.size);
    const column = index % puzzle.size;
    const delta = { ArrowUp: -puzzle.size, ArrowDown: puzzle.size, ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (delta === undefined) return;
    const next = index + delta;
    if (next < 0 || next >= puzzle.size * puzzle.size || (delta === -1 || delta === 1) && Math.floor(next / puzzle.size) !== row || (delta === -puzzle.size || delta === puzzle.size) && next % puzzle.size !== column) return;
    event.preventDefault();
    board.querySelector(`[data-cell-index="${next}"]`)?.focus();
  });

  root.querySelector('[data-action="new-game"]')?.addEventListener('click', newPuzzle);
  sizeControl.addEventListener('change', newPuzzle);
  difficultyControl.addEventListener('change', newPuzzle);
  root.querySelector('[data-action="check-board"]')?.addEventListener('click', () => {
    const checked = checkHitoriBoard(puzzle.grid, blackCells);
    if (checked.valid) announce(root, copy.messages.solved, 'success');
    else announce(root, checked.errors.map((error) => copy.messages[{ 'duplicate-white': 'duplicateWhite', 'adjacent-black': 'adjacentBlack', 'disconnected-white': 'disconnectedWhite' }[error]]).join(' '), 'error');
  });
  root.querySelector('[data-action="hint"]')?.addEventListener('click', () => {
    const hint = findHitoriHint(puzzle, blackCells);
    if (!hint) { announce(root, copy.messages.noHint, 'info'); return; }
    if (hint.black) blackCells.add(hint.index);
    else blackCells.delete(hint.index);
    render(hint.index);
    announce(root, hint.black ? copy.messages.hintBlack : copy.messages.hintWhite, 'success');
  });
  root.querySelector('[data-action="clear-marks"]')?.addEventListener('click', () => {
    blackCells = new Set();
    render();
    announce(root, copy.messages.marksCleared, 'info');
  });
  newPuzzle();
}

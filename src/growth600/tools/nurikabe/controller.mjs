import { checkNurikabeBoard, createNurikabePuzzle, findNurikabeHint } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="nurikabe"]');
if (root) {
  const copy = readToolCopy(root);
  const difficultyControl = root.querySelector('[data-difficulty]');
  const board = root.querySelector('[data-board]');
  let puzzle;
  let seaCells = new Set();

  function cellLabel(index, isSea) {
    const row = Math.floor(index / puzzle.size) + 1;
    const column = index % puzzle.size + 1;
    const clue = puzzle.clues.find((entry) => entry.index === index);
    const content = clue ? `${clue.size} ${copy.fields.island}` : isSea ? copy.fields.sea : copy.fields.island;
    return `${copy.fields.cell} ${copy.fields.row} ${row}, ${copy.fields.column} ${column}: ${content}`;
  }

  function render(focusIndex = null) {
    const clueAt = new Map(puzzle.clues.map((clue) => [clue.index, clue]));
    const fragment = document.createDocumentFragment();
    board.setAttribute('aria-rowcount', String(puzzle.size));
    board.setAttribute('aria-colcount', String(puzzle.size));
    for (let rowIndex = 0; rowIndex < puzzle.size; rowIndex += 1) {
      const row = document.createElement('div');
      row.className = 'nurikabe-row';
      row.setAttribute('role', 'row');
      row.setAttribute('aria-label', `${copy.fields.row} ${rowIndex + 1}`);
      for (let columnIndex = 0; columnIndex < puzzle.size; columnIndex += 1) {
        const index = rowIndex * puzzle.size + columnIndex;
        const clue = clueAt.get(index);
        const isSea = seaCells.has(index);
        const gridCell = document.createElement('div');
        gridCell.setAttribute('role', 'gridcell');
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = `nurikabe-cell${clue ? ' is-clue' : ''}${isSea ? ' is-sea' : ''}`;
        cell.setAttribute('aria-pressed', String(isSea));
        if (clue) cell.setAttribute('aria-disabled', 'true');
        cell.setAttribute('aria-label', cellLabel(index, isSea));
        if (clue) cell.dataset.clue = 'true';
        cell.dataset.cellIndex = String(index);
        cell.tabIndex = focusIndex === index || focusIndex === null && index === 0 ? 0 : -1;
        cell.textContent = clue ? String(clue.size) : isSea ? '×' : '';
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
      puzzle = createNurikabePuzzle({ difficulty: difficultyControl.value });
      seaCells = new Set();
      render();
      announce(root, copy.messages.newPuzzle, 'success');
    } catch {
      announce(root, copy.messages.generationFailed, 'error');
    }
  }

  board.addEventListener('click', (event) => {
    const cell = event.target.closest('[data-cell-index]');
    if (!cell || !board.contains(cell) || cell.dataset.clue) return;
    const index = Number(cell.dataset.cellIndex);
    if (seaCells.has(index)) seaCells.delete(index);
    else seaCells.add(index);
    render(index);
    announce(root, seaCells.has(index) ? copy.messages.markedSea : copy.messages.markedIsland, 'info');
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
  difficultyControl.addEventListener('change', newPuzzle);
  root.querySelector('[data-action="check-board"]')?.addEventListener('click', () => {
    const checked = checkNurikabeBoard(puzzle, seaCells);
    if (checked.valid) announce(root, copy.messages.solved, 'success');
    else announce(root, checked.errors.map((error) => copy.messages[{ 'clue-in-sea': 'clueInSea', 'sea-square': 'seaSquare', 'sea-disconnected': 'seaDisconnected', 'islands-touch': 'islandsTouch', 'island-without-clue': 'islandWithoutClue', 'island-size': 'islandSize' }[error]]).join(' '), 'error');
  });
  root.querySelector('[data-action="hint"]')?.addEventListener('click', () => {
    const hint = findNurikabeHint(puzzle, seaCells);
    if (!hint) { announce(root, copy.messages.noHint, 'info'); return; }
    if (hint.sea) seaCells.add(hint.index);
    else seaCells.delete(hint.index);
    render(hint.index);
    announce(root, hint.sea ? copy.messages.hintSea : copy.messages.hintIsland, 'success');
  });
  root.querySelector('[data-action="clear-marks"]')?.addEventListener('click', () => {
    seaCells = new Set();
    render();
    announce(root, copy.messages.marksCleared, 'info');
  });
  newPuzzle();
}

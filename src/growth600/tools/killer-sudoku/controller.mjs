import { checkKillerSudoku, generateKillerSudoku } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="killer-sudoku"]');
if (root) {
  const copy = readToolCopy(root);
  const board = root.querySelector('[data-board]');
  const difficulty = root.querySelector('[data-difficulty]');
  let puzzle;
  let values = Array(81).fill(0);
  let history = [];

  function render(focus = null, errors = []) {
    const fragment = document.createDocumentFragment();
    const targets = new Map(puzzle.cages.map((cage) => [Math.min(...cage.cells), cage.sum]));
    board.replaceChildren();
    for (let index = 0; index < 81; index += 1) {
      const cell = document.createElement('div');
      cell.className = 'killer-sudoku-cell';
      cell.classList.toggle('is-invalid', errors.includes(index));
      const target = targets.get(index);
      if (target !== undefined) {
        const label = document.createElement('span'); label.className = 'killer-sudoku-cage-target';
        label.setAttribute('aria-hidden', 'true'); label.textContent = String(target); cell.append(label);
      }
      const input = document.createElement('input');
      input.type = 'text'; input.inputMode = 'numeric'; input.autocomplete = 'off'; input.maxLength = 1;
      input.id = `killer-sudoku-cell-${index}`; input.name = input.id; input.dataset.cell = String(index);
      input.className = 'killer-sudoku-entry'; input.value = values[index] ? String(values[index]) : '';
      input.setAttribute('aria-label', `${copy.fields.cell} ${Math.floor(index / 9) + 1}, ${copy.fields.row} ${Math.floor(index / 9) + 1}, ${copy.fields.column} ${index % 9 + 1}${target === undefined ? '' : `, ${target} ${copy.fields.cageSum}`}`);
      if (errors.includes(index)) input.setAttribute('aria-invalid', 'true');
      input.addEventListener('input', () => {
        const raw = input.value.trim();
        if (raw && !/^[1-9]$/u.test(raw)) { input.value = values[index] ? String(values[index]) : ''; announce(root, copy.messages.invalidEntry, 'error'); return; }
        const next = raw ? Number(raw) : 0;
        if (next === values[index]) return;
        history.push(values.slice()); if (history.length > 100) history.shift();
        values[index] = next; render(index);
      });
      input.addEventListener('keydown', (event) => {
        const move = { ArrowUp: -9, ArrowDown: 9, ArrowLeft: -1, ArrowRight: 1 }[event.key];
        if (move === undefined) return;
        const next = index + move;
        if (next < 0 || next >= 81 || (Math.abs(move) === 1 && Math.floor(next / 9) !== Math.floor(index / 9))) return;
        event.preventDefault(); board.querySelector(`[data-cell="${next}"]`)?.focus();
      });
      cell.append(input); fragment.append(cell);
    }
    board.append(fragment);
    if (focus !== null) board.querySelector(`[data-cell="${focus}"]`)?.focus();
  }

  function newPuzzle() {
    try {
      const targetCages = { easy: 55, medium: 50, hard: 45 }[difficulty.value] ?? 50;
      puzzle = generateKillerSudoku({ targetCages }); values = Array(81).fill(0); history = [];
      render(); announce(root, copy.messages.newPuzzle, 'success');
    } catch {
      announce(root, copy.messages.generationFailed, 'error');
    }
  }

  root.querySelector('[data-action="new-game"]').addEventListener('click', newPuzzle);
  difficulty.addEventListener('change', newPuzzle);
  root.querySelector('[data-action="check-board"]').addEventListener('click', () => {
    const result = checkKillerSudoku(puzzle.cages, values); render(null, result.errors);
    if (result.solved) announce(root, copy.messages.solved, 'success');
    else announce(root, result.complete ? copy.messages.invalidEntry : copy.messages.incomplete, 'info');
  });
  root.querySelector('[data-action="hint"]').addEventListener('click', () => {
    const index = values.findIndex((value) => !value);
    if (index < 0) { announce(root, copy.messages.noHint, 'info'); return; }
    history.push(values.slice()); values[index] = puzzle.solution[index]; render(index);
    announce(root, copy.messages.hint.replace('{row}', String(Math.floor(index / 9) + 1)).replace('{column}', String(index % 9 + 1)), 'success');
  });
  root.querySelector('[data-action="undo"]').addEventListener('click', () => {
    const previous = history.pop();
    if (!previous) { announce(root, copy.messages.undoEmpty, 'info'); return; }
    values = previous; render(); announce(root, copy.messages.undo, 'success');
  });
  newPuzzle();
}

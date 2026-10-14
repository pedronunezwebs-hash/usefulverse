import { createSudokuExample, findSudokuConflicts, findSudokuStep, solveSudoku } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="sudoku-solver"]');
if (root) {
  const copy = readToolCopy(root);
  const board = root.querySelector('[data-board]');
  let values = Array(81).fill(0);
  let fixed = new Set();

  function render(focus = null) {
    const conflicts = new Set(findSudokuConflicts(values));
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < 81; index += 1) {
      const row = Math.floor(index / 9) + 1;
      const column = index % 9 + 1;
      const input = document.createElement('input');
      input.type = 'text'; input.inputMode = 'numeric'; input.autocomplete = 'off'; input.maxLength = 1;
      input.className = 'sudoku-solver__cell'; input.dataset.cell = String(index);
      input.id = `sudoku-solver-cell-${index}`; input.name = input.id;
      input.value = values[index] ? String(values[index]) : '';
      input.readOnly = fixed.has(index);
      input.setAttribute('aria-label', `${copy.fields.cell} ${row}, ${copy.fields.column} ${column}`);
      if (conflicts.has(index)) { input.setAttribute('aria-invalid', 'true'); input.classList.add('is-invalid'); }
      input.addEventListener('input', () => {
        const raw = input.value.trim();
        if (raw && !/^[1-9]$/u.test(raw)) { input.value = values[index] ? String(values[index]) : ''; announce(root, copy.messages.invalidDigit, 'error'); return; }
        values[index] = raw ? Number(raw) : 0;
        fixed.delete(index);
        render(index);
      });
      input.addEventListener('keydown', (event) => {
        const offset = { ArrowUp: -9, ArrowDown: 9, ArrowLeft: -1, ArrowRight: 1 }[event.key];
        if (offset === undefined) return;
        const next = index + offset;
        if (next < 0 || next >= 81 || (Math.abs(offset) === 1 && Math.floor(next / 9) !== Math.floor(index / 9))) return;
        event.preventDefault(); board.querySelector(`[data-cell="${next}"]`)?.focus();
      });
      fragment.append(input);
    }
    board.replaceChildren(fragment);
    if (focus !== null) board.querySelector(`[data-cell="${focus}"]`)?.focus();
  }

  function loadPuzzle(grid, immutable = false) {
    values = grid.slice(); fixed = immutable ? new Set(grid.flatMap((value, index) => value ? [index] : [])) : new Set();
    render();
  }

  root.querySelector('[data-action="example"]').addEventListener('click', () => {
    loadPuzzle(createSudokuExample(), true); announce(root, copy.messages.exampleLoaded, 'success');
  });
  root.querySelector('[data-action="clear"]').addEventListener('click', () => {
    loadPuzzle(Array(81).fill(0)); announce(root, copy.messages.cleared, 'info');
  });
  root.querySelector('[data-action="solve"]').addEventListener('click', () => {
    const conflicts = findSudokuConflicts(values);
    if (conflicts.length) { render(conflicts[0]); announce(root, copy.messages.conflict, 'error'); return; }
    const result = solveSudoku(values);
    if (result.status === 'invalid') { render(result.conflicts[0] ?? null); announce(root, copy.messages.conflict, 'error'); return; }
    if (result.status === 'unsatisfiable') { announce(root, copy.messages.unsatisfiable, 'error'); return; }
    if (result.status === 'incomplete') { announce(root, copy.messages.searchLimited, 'info'); return; }
    if (result.solution) {
      const original = values.slice();
      values = result.solution.slice(); fixed = new Set(original.flatMap((value, index) => value ? [index] : [])); render();
    }
    if (result.status === 'unique') announce(root, copy.messages.unique, 'success');
    else announce(root, copy.messages.multiple.replace('{count}', String(result.count)), 'info');
  });
  root.querySelector('[data-action="step"]').addEventListener('click', () => {
    const conflicts = findSudokuConflicts(values);
    if (conflicts.length) { render(conflicts[0]); announce(root, copy.messages.conflict, 'error'); return; }
    if (values.every(Boolean)) { announce(root, copy.messages.complete, 'success'); return; }
    const step = findSudokuStep(values);
    if (!step) { announce(root, copy.messages.noSingle, 'info'); return; }
    values[step.index] = step.value; render(step.index);
    const technique = step.technique === 'naked-single' ? copy.fields.nakedSingle : copy.fields.hiddenSingle;
    announce(root, copy.messages.step.replace('{row}', String(Math.floor(step.index / 9) + 1)).replace('{column}', String(step.index % 9 + 1)).replace('{digit}', String(step.value)).replace('{technique}', technique), 'success');
  });
  render();
}

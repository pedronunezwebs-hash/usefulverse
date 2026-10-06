import { generateSudokuPuzzle } from './local-planners-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);
const RECENT_PUZZLES_KEY = 'usefulverse:sudoku:recent:v1';
// Keep several years of daily visits in this browser profile so a new game
// does not cycle through a short list. This stores only tiny board fingerprints.
const RECENT_PUZZLE_LIMIT = 4096;

function randomSudokuValue() {
  if (globalThis.crypto?.getRandomValues) {
    const value = new Uint32Array(1);
    globalThis.crypto.getRandomValues(value);
    return value[0] / 0x1_0000_0000;
  }
  return Math.random();
}

function readRecentPuzzles() {
  try {
    const stored = JSON.parse(localStorage.getItem(RECENT_PUZZLES_KEY) || '[]');
    return Array.isArray(stored) ? stored.filter((value) => typeof value === 'string' && /^[\da-f]{16}$/iu.test(value)).slice(-RECENT_PUZZLE_LIMIT) : [];
  } catch { return []; }
}

export function setupSudoku(root) {
  const messages = JSON.parse(root.dataset.plannerMessages || '{}');
  const say = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), messages[key] ?? key);
  const boardElement = $('[data-sudoku-board]', root);
  const progress = $('[data-sudoku-progress]', root);
  const difficulty = $('[data-sudoku-difficulty]', root);
  const notesButton = $('[data-sudoku-notes]', root);
  let recentPuzzles = readRecentPuzzles();
  let puzzle; let solution; let entries; let givens; let notes; let selected = 0; let notesMode = false; let errors = new Set();
  const status = (message, type = '') => {
    const output = $('#op-status', root);
    output.textContent = message;
    output.className = `tool-status${type ? ` is-${type}` : ''}`;
  };
  const isConflict = (index, value) => {
    const row = Math.floor(index / 9); const column = index % 9; const boxRow = Math.floor(row / 3) * 3; const boxColumn = Math.floor(column / 3) * 3;
    for (let offset = 0; offset < 9; offset += 1) {
      const sameRow = row * 9 + offset; const sameColumn = offset * 9 + column;
      if (sameRow !== index && entries[sameRow] === value) return true;
      if (sameColumn !== index && entries[sameColumn] === value) return true;
      const boxIndex = (boxRow + Math.floor(offset / 3)) * 9 + boxColumn + offset % 3;
      if (boxIndex !== index && entries[boxIndex] === value) return true;
    }
    return false;
  };
  const render = (focus = false) => {
    boardElement.replaceChildren();
    for (let index = 0; index < 81; index += 1) {
      const row = Math.floor(index / 9); const column = index % 9; const value = entries[index];
      const cell = document.createElement('button');
      cell.type = 'button'; cell.className = 'op-sudoku__cell'; cell.dataset.sudokuCell = String(index); cell.setAttribute('role', 'gridcell'); cell.tabIndex = index === selected ? 0 : -1;
      if (givens[index]) cell.classList.add('is-given');
      if (index === selected) cell.classList.add('is-selected');
      if (errors.has(index)) cell.classList.add('is-incorrect');
      if (column === 2 || column === 5) cell.classList.add('has-right-rule');
      if (row === 2 || row === 5) cell.classList.add('has-bottom-rule');
      const cellValue = value ? (givens[index] ? say('Given: {value}', { value }) : String(value)) : notes[index].size ? say('Notes: {value}', { value: [...notes[index]].sort().join(', ') }) : say('Empty');
      cell.setAttribute('aria-label', say('Row {row}, column {column}: {value}', { row: row + 1, column: column + 1, value: cellValue }));
      if (value) cell.textContent = String(value);
      else if (notes[index].size) {
        const noteGrid = document.createElement('span'); noteGrid.className = 'op-sudoku__notes'; noteGrid.setAttribute('aria-hidden', 'true');
        for (let number = 1; number <= 9; number += 1) { const note = document.createElement('span'); note.textContent = notes[index].has(number) ? String(number) : ''; noteGrid.append(note); }
        cell.append(noteGrid);
      }
      boardElement.append(cell);
    }
    const filled = entries.filter(Boolean).length;
    progress.textContent = `${filled} / 81`;
    if (focus) boardElement.querySelector(`[data-sudoku-cell="${selected}"]`)?.focus();
  };
  const start = () => {
    let game;
    for (let attempt = 0; attempt < 64; attempt += 1) {
      game = generateSudokuPuzzle(difficulty.value, randomSudokuValue);
      let hash = 0xcbf29ce484222325n;
      for (const value of game.puzzle) {
        hash ^= BigInt(value + 48);
        hash = BigInt.asUintN(64, hash * 0x100000001b3n);
      }
      const fingerprint = hash.toString(16).padStart(16, '0');
      if (!recentPuzzles.includes(fingerprint)) {
        recentPuzzles = [...recentPuzzles, fingerprint].slice(-RECENT_PUZZLE_LIMIT);
        try { localStorage.setItem(RECENT_PUZZLES_KEY, JSON.stringify(recentPuzzles)); } catch { /* Random puzzles still work when storage is unavailable. */ }
        break;
      }
    }
    puzzle = game.puzzle; solution = game.solution; entries = [...puzzle]; givens = puzzle.map(Boolean); notes = Array.from({ length: 81 }, () => new Set()); errors = new Set(); notesMode = false;
    notesButton.setAttribute('aria-pressed', 'false'); selected = puzzle.findIndex((value) => value === 0); if (selected < 0) selected = 0;
    render(); status('');
  };
  const enter = (value) => {
    if (selected < 0 || selected > 80) return status(say('Choose an empty cell first.'), 'error');
    if (givens[selected]) return status(say('This is a starting clue and cannot be changed.'), 'error');
    if (notesMode) {
      if (notes[selected].has(value)) notes[selected].delete(value); else notes[selected].add(value);
      errors.delete(selected); render(true); return;
    }
    if (isConflict(selected, value)) return status(say('That number conflicts with a row, column or box.'), 'error');
    entries[selected] = value; notes[selected].clear(); errors.delete(selected); render(true); status('');
    if (entries.every((entry, index) => entry === solution[index])) status(say('Puzzle solved!'), 'success');
  };
  const erase = () => {
    if (givens[selected]) return status(say('This is a starting clue and cannot be changed.'), 'error');
    entries[selected] = 0; notes[selected].clear(); errors.delete(selected); render(true); status('');
  };
  const moveSelection = (direction) => {
    let row = Math.floor(selected / 9); let column = selected % 9;
    if (direction === 'left') column = (column + 8) % 9;
    if (direction === 'right') column = (column + 1) % 9;
    if (direction === 'up') row = (row + 8) % 9;
    if (direction === 'down') row = (row + 1) % 9;
    selected = row * 9 + column; render(true);
  };
  const addHint = () => {
    const index = entries[selected] === 0 && !givens[selected] ? selected : entries.findIndex((value, position) => value === 0 && !givens[position]);
    if (index < 0) return status(say('No empty cell remains for a hint.'), 'error');
    selected = index; entries[index] = solution[index]; notes[index].clear(); errors.delete(index); render(true); status(say('A hint was added.'), 'success');
  };
  const check = () => {
    errors = new Set(entries.flatMap((value, index) => value && value !== solution[index] ? [index] : []));
    render();
    if (errors.size) status(say('There are mistakes to fix.'), 'error');
    else if (entries.some((value) => !value)) status(say('Fill every cell first.'), 'error');
    else status(say('Puzzle solved!'), 'success');
  };

  root.addEventListener('click', (event) => {
    const cell = event.target.closest('[data-sudoku-cell]');
    if (cell) { selected = Number(cell.dataset.sudokuCell); render(true); status(''); return; }
    const digit = event.target.closest('[data-sudoku-digit]');
    if (digit) return enter(Number(digit.dataset.sudokuDigit));
    if (event.target.closest('[data-sudoku-new]')) return start();
    if (event.target.closest('[data-sudoku-erase]')) return erase();
    if (event.target.closest('[data-sudoku-hint]')) return addHint();
    if (event.target.closest('[data-sudoku-check]')) return check();
    if (event.target.closest('[data-sudoku-notes]')) {
      notesMode = !notesMode; notesButton.setAttribute('aria-pressed', String(notesMode));
      return status(say(notesMode ? 'Notes on.' : 'Notes off.'));
    }
  });
  root.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
    const arrows = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
    if (arrows[event.key]) { event.preventDefault(); moveSelection(arrows[event.key]); return; }
    if (/^[1-9]$/u.test(event.key)) { event.preventDefault(); enter(Number(event.key)); return; }
    if (event.key === 'Backspace' || event.key === 'Delete' || event.key === '0') { event.preventDefault(); erase(); }
  });
  start();
}

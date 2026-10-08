import { checkFutoshikiBoard, createFutoshikiPuzzle, findFutoshikiHint } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="futoshiki"]');
if (root) {
  const copy = readToolCopy(root);
  const board = root.querySelector('[data-board]');
  const sizeControl = root.querySelector('[data-size]');
  const difficultyControl = root.querySelector('[data-difficulty]');
  let puzzle;
  let values = [];
  let notes = [];
  let history = [];
  let noteMode = false;

  function saveUndo() {
    history.push({ values: values.slice(), notes: notes.map((entry) => [...entry]) });
    if (history.length > 100) history.shift();
  }

  function cellDescription(index) {
    const row = Math.floor(index / puzzle.size) + 1;
    const column = index % puzzle.size + 1;
    const clues = [];
    for (const edge of puzzle.inequalities) {
      if (edge.a === index || edge.b === index) {
        const other = edge.a === index ? edge.b : edge.a;
        const direction = edge.a === index ? edge.relation : edge.relation === '<' ? '>' : '<';
        clues.push(`${direction} ${copy.fields.cell} ${Math.floor(other / puzzle.size) + 1}, ${Math.floor(other % puzzle.size) + 1}`);
      }
    }
    const candidates = notes[index].size ? `; ${copy.fields.notes}: ${[...notes[index]].sort((a, b) => a - b).join(', ')}` : '';
    return `${copy.fields.cell}, ${copy.fields.row} ${row}, ${copy.fields.column} ${column}${clues.length ? `; ${clues.join(', ')}` : ''}${candidates}`;
  }

  function render(focusIndex = null) {
    const fragment = document.createDocumentFragment();
    const dimension = puzzle.size * 2 - 1;
    board.style.gridTemplateColumns = `repeat(${dimension}, minmax(0, 1fr))`;
    for (let row = 0; row < puzzle.size; row += 1) {
      for (let column = 0; column < puzzle.size; column += 1) {
        const index = row * puzzle.size + column;
        const input = document.createElement('input');
        input.type = 'number'; input.inputMode = 'numeric'; input.min = '1'; input.max = String(puzzle.size); input.step = '1';
        input.id = `futoshiki-cell-${index}`; input.name = input.id;
        input.className = 'futoshiki-cell'; input.dataset.cell = String(index); input.setAttribute('aria-label', cellDescription(index));
        input.value = values[index] ? String(values[index]) : ''; input.readOnly = puzzle.clues[index] !== 0;
        input.setAttribute('aria-readonly', String(input.readOnly)); input.classList.toggle('is-given', input.readOnly);
        input.style.gridRow = String(row * 2 + 1); input.style.gridColumn = String(column * 2 + 1);
        input.addEventListener('change', () => {
          if (input.value === '' && !noteMode) {
            if (values[index]) { saveUndo(); values[index] = 0; render(index); announce(root, copy.messages.cellCleared, 'info'); }
            return;
          }
          const next = input.value === '' ? 0 : Number(input.value);
          if (!Number.isInteger(next) || next < 1 || next > puzzle.size) {
            input.value = values[index] ? String(values[index]) : '';
            announce(root, copy.messages.invalidValue.replace('{size}', String(puzzle.size)), 'error');
            return;
          }
          if (noteMode && !puzzle.clues[index] && !values[index]) {
            saveUndo();
            if (notes[index].has(next)) { notes[index].delete(next); announce(root, copy.messages.noteRemoved.replace('{value}', String(next)), 'info'); }
            else { notes[index].add(next); announce(root, copy.messages.noteAdded.replace('{value}', String(next)), 'info'); }
            input.value = ''; render(index); return;
          }
          if (next === values[index]) return;
          saveUndo(); notes[index].clear(); values[index] = next; render(index);
        });
        input.addEventListener('keydown', (event) => {
          const delta = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[event.key];
          if (!delta) return;
          const nextRow = row + delta[0]; const nextColumn = column + delta[1];
          if (nextRow < 0 || nextRow >= puzzle.size || nextColumn < 0 || nextColumn >= puzzle.size) return;
          event.preventDefault(); board.querySelector(`[data-cell="${nextRow * puzzle.size + nextColumn}"]`)?.focus();
        });
        fragment.append(input);
        if (!values[index] && notes[index].size) {
          const note = document.createElement('span');
          note.className = 'futoshiki-notes'; note.setAttribute('aria-hidden', 'true');
          note.textContent = [...notes[index]].sort((a, b) => a - b).join(' · ');
          note.style.gridRow = input.style.gridRow; note.style.gridColumn = input.style.gridColumn;
          fragment.append(note);
        }
        if (column < puzzle.size - 1) {
          const edge = puzzle.inequalities.find((entry) => entry.a === index && entry.b === index + 1);
          if (edge) fragment.append(inequalitySign(edge.relation, row * 2 + 1, column * 2 + 2));
        }
      }
      if (row < puzzle.size - 1) {
        for (let column = 0; column < puzzle.size; column += 1) {
          const index = row * puzzle.size + column;
          const edge = puzzle.inequalities.find((entry) => entry.a === index && entry.b === index + puzzle.size);
          if (edge) fragment.append(inequalitySign(edge.relation, row * 2 + 2, column * 2 + 1, true));
        }
      }
    }
    board.replaceChildren(fragment);
    if (focusIndex !== null) board.querySelector(`[data-cell="${focusIndex}"]`)?.focus();
  }

  function inequalitySign(relation, row, column, vertical = false) {
    const sign = document.createElement('span');
    sign.className = `futoshiki-inequality${vertical ? ' is-vertical' : ''}`;
    sign.setAttribute('aria-hidden', 'true'); sign.textContent = relation;
    sign.style.gridRow = String(row); sign.style.gridColumn = String(column);
    return sign;
  }

  function newPuzzle() {
    try {
      puzzle = createFutoshikiPuzzle({ size: Number(sizeControl.value), difficulty: difficultyControl.value });
      values = puzzle.clues.slice(); notes = Array.from({ length: puzzle.size ** 2 }, () => new Set()); history = []; noteMode = false;
      const notesButton = root.querySelector('[data-action="notes"]'); notesButton?.setAttribute('aria-pressed', 'false');
      if (notesButton) notesButton.textContent = copy.actions.notes;
      render();
      announce(root, copy.messages.newPuzzle, 'success');
    } catch {
      announce(root, copy.messages.generationFailed, 'error');
    }
  }

  root.querySelector('[data-action="new-game"]')?.addEventListener('click', newPuzzle);
  root.querySelector('[data-action="notes"]')?.addEventListener('click', (event) => {
    noteMode = !noteMode;
    event.currentTarget.setAttribute('aria-pressed', String(noteMode));
    event.currentTarget.textContent = noteMode ? copy.actions.notesOn : copy.actions.notes;
    announce(root, noteMode ? copy.messages.notesEnabled : copy.messages.notesDisabled, 'info');
  });
  sizeControl.addEventListener('change', newPuzzle);
  difficultyControl.addEventListener('change', newPuzzle);
  root.querySelector('[data-action="check-board"]')?.addEventListener('click', () => {
    const result = checkFutoshikiBoard(puzzle, values);
    if (result.valid) announce(root, copy.messages.solved, 'success');
    else announce(root, result.errors.map((error) => copy.messages[error.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())]).join(' '), 'error');
  });
  root.querySelector('[data-action="hint"]')?.addEventListener('click', () => {
    const hint = findFutoshikiHint(puzzle, values);
    if (!hint) { announce(root, copy.messages.noHint, 'info'); return; }
    saveUndo(); notes[hint.index].clear(); values[hint.index] = hint.value; render(hint.index);
    board.querySelector(`[data-cell="${hint.index}"]`)?.classList.add('is-hint');
    announce(root, copy.messages.hint.replace('{row}', String(Math.floor(hint.index / puzzle.size) + 1)).replace('{column}', String(hint.index % puzzle.size + 1)), 'info');
  });
  root.querySelector('[data-action="undo"]')?.addEventListener('click', () => {
    const previous = history.pop();
    if (!previous) { announce(root, copy.messages.undoEmpty, 'info'); return; }
    values = previous.values; notes = previous.notes.map((entry) => new Set(entry)); render(); announce(root, copy.messages.undo, 'success');
  });
  newPuzzle();
}

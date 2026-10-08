import { checkSlitherlinkBoard, createSlitherlinkPuzzle, findSlitherlinkHint } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="slitherlink"]');
if (root) {
  const copy = readToolCopy(root);
  const sizeControl = root.querySelector('[data-size]');
  const board = root.querySelector('[data-board]');
  let puzzle;
  let selected = new Set();
  let history = [];

  function edgeName(edge) {
    const { size } = puzzle;
    const horizontalCount = size * (size + 1);
    if (edge < horizontalCount) {
      const row = Math.floor(edge / size);
      const column = edge % size;
      return `${copy.fields.horizontal}, ${copy.fields.row} ${row + 1}, ${copy.fields.column} ${column + 1}`;
    }
    const index = edge - horizontalCount;
    const row = Math.floor(index / (size + 1));
    const column = index % (size + 1);
    return `${copy.fields.vertical}, ${copy.fields.row} ${row + 1}, ${copy.fields.column} ${column + 1}`;
  }

  function addNode(fragment, row, column) {
    const node = document.createElement('span');
    node.className = 'slitherlink-node';
    node.setAttribute('aria-hidden', 'true');
    node.style.gridRow = String(row * 2 + 1);
    node.style.gridColumn = String(column * 2 + 1);
    fragment.append(node);
  }

  function addEdge(fragment, edge, row, column, orientation, tabIndex = -1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `slitherlink-edge slitherlink-edge--${orientation}`;
    button.dataset.edge = String(edge);
    button.dataset.gridRow = String(row);
    button.dataset.gridColumn = String(column);
    button.setAttribute('aria-pressed', String(selected.has(edge)));
    button.setAttribute('aria-label', `${edgeName(edge)}: ${selected.has(edge) ? copy.messages.edgeOn : copy.messages.edgeOff}`);
    button.setAttribute('aria-atomic', 'true');
    button.style.gridRow = String(row + 1);
    button.style.gridColumn = String(column + 1);
    button.tabIndex = tabIndex;
    fragment.append(button);
  }

  function render(focusEdge = null) {
    const { size } = puzzle;
    const fragment = document.createDocumentFragment();
    board.style.setProperty('--slitherlink-size', String(size));
    board.style.gridTemplateColumns = `repeat(${size * 2 + 1}, minmax(0, 1fr))`;
    board.setAttribute('aria-rowcount', String(size * 2 + 1));
    board.setAttribute('aria-colcount', String(size * 2 + 1));
    let firstEdge = true;
    for (let row = 0; row <= size; row += 1) {
      for (let column = 0; column <= size; column += 1) {
        addNode(fragment, row, column);
        if (column < size) {
          const edge = row * size + column;
          const tabIndex = focusEdge === edge || focusEdge === null && firstEdge ? 0 : -1;
          addEdge(fragment, edge, row * 2, column * 2 + 1, 'horizontal', tabIndex);
          firstEdge = false;
        }
        if (row < size) {
          const edge = size * (size + 1) + row * (size + 1) + column;
          const tabIndex = focusEdge === edge || focusEdge === null && firstEdge ? 0 : -1;
          addEdge(fragment, edge, row * 2 + 1, column * 2, 'vertical', tabIndex);
          firstEdge = false;
        }
        if (row < size && column < size) {
          const clue = document.createElement('span');
          clue.className = 'slitherlink-clue';
          clue.style.gridRow = String(row * 2 + 2);
          clue.style.gridColumn = String(column * 2 + 2);
          const value = puzzle.clues[row * size + column];
          clue.textContent = value === null ? '' : String(value);
          if (value === null) clue.setAttribute('aria-hidden', 'true');
          else {
            clue.setAttribute('role', 'img');
            clue.setAttribute('aria-label', `${copy.fields.board}, ${copy.fields.row} ${row + 1}, ${copy.fields.column} ${column + 1}: ${value}`);
          }
          fragment.append(clue);
        }
      }
    }
    board.replaceChildren(fragment);
    if (focusEdge !== null) board.querySelector(`[data-edge="${focusEdge}"]`)?.focus();
  }

  function snapshot() { history.push([...selected]); if (history.length > 200) history.shift(); }

  function newPuzzle() {
    try {
      puzzle = createSlitherlinkPuzzle({ size: Number(sizeControl.value) });
      selected = new Set();
      history = [];
      render();
      announce(root, copy.messages.newPuzzle, 'success');
    } catch {
      announce(root, copy.messages.generationFailed, 'error');
    }
  }

  board.addEventListener('click', (event) => {
    const control = event.target.closest('[data-edge]');
    if (!control || !board.contains(control)) return;
    const edge = Number(control.dataset.edge);
    snapshot();
    if (selected.has(edge)) selected.delete(edge);
    else selected.add(edge);
    render(edge);
    announce(root, selected.has(edge) ? copy.messages.edgeOn : copy.messages.edgeOff, 'info');
  });

  board.addEventListener('keydown', (event) => {
    const current = event.target.closest('[data-edge]');
    if (!current) return;
    const delta = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[event.key];
    if (!delta) return;
    const row = Number(current.dataset.gridRow);
    const column = Number(current.dataset.gridColumn);
    const candidates = [...board.querySelectorAll('[data-edge]')].map((control) => ({
      control,
      row: Number(control.dataset.gridRow),
      column: Number(control.dataset.gridColumn),
    })).map((candidate) => ({ ...candidate, along: (candidate.row - row) * delta[0] + (candidate.column - column) * delta[1], cross: Math.abs((candidate.row - row) * delta[1] - (candidate.column - column) * delta[0]) }))
      .filter((candidate) => candidate.along > 0 && candidate.cross === 0)
      .sort((a, b) => a.along - b.along);
    if (!candidates.length) return;
    event.preventDefault();
    current.tabIndex = -1;
    candidates[0].control.tabIndex = 0;
    candidates[0].control.focus();
  });

  root.querySelector('[data-action="new-game"]')?.addEventListener('click', newPuzzle);
  sizeControl.addEventListener('change', newPuzzle);
  root.querySelector('[data-action="check-board"]')?.addEventListener('click', () => {
    const result = checkSlitherlinkBoard(puzzle, selected);
    announce(root, result.valid ? copy.messages.solved : !result.loopValid ? copy.messages.loopError : copy.messages.clueError, result.valid ? 'success' : 'error');
  });
  root.querySelector('[data-action="hint"]')?.addEventListener('click', () => {
    const hint = findSlitherlinkHint(puzzle, selected);
    if (!hint) { announce(root, copy.messages.noHint, 'info'); return; }
    snapshot();
    if (hint.selected) selected.add(hint.edge);
    else selected.delete(hint.edge);
    render(hint.edge);
    announce(root, hint.selected ? copy.messages.hintOn : copy.messages.hintOff, 'success');
  });
  root.querySelector('[data-action="undo"]')?.addEventListener('click', () => {
    const previous = history.pop();
    if (!previous) { announce(root, copy.messages.undoEmpty, 'info'); return; }
    selected = new Set(previous);
    render();
    announce(root, copy.actions.undo, 'success');
  });
  root.querySelector('[data-action="clear-marks"]')?.addEventListener('click', () => {
    if (selected.size) snapshot();
    selected = new Set();
    render();
    announce(root, copy.messages.marksCleared, 'info');
  });
  newPuzzle();
}

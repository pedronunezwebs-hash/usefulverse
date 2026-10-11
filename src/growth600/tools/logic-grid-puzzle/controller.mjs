import { checkLogicGridMarks, createLogicGridPuzzle, logicGridHint, logicGridPairGroups } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="logic-grid-puzzle"]');
if (root) {
  const copy = readToolCopy(root);
  const difficulty = root.querySelector('[data-difficulty]');
  const pairSelect = root.querySelector('[data-pair]');
  const cluesList = root.querySelector('[data-clues]');
  const tableHead = root.querySelector('[data-head]');
  const tableBody = root.querySelector('[data-body]');
  const caption = root.querySelector('[data-pair-caption]');
  const marks = new Map();
  let puzzle;

  for (const [left, right] of logicGridPairGroups) {
    const option = document.createElement('option');
    option.value = `${left}:${right}`;
    option.textContent = `${copy.fields.categoryGroups[left].name} ↔ ${copy.fields.categoryGroups[right].name}`;
    pairSelect.append(option);
  }

  function selectedPair() {
    return pairSelect.value.split(':').map(Number);
  }

  function markKey(pair, row, column) { return `${pair}:${row}:${column}`; }

  function renderClues() {
    const fragment = document.createDocumentFragment();
    for (const clue of puzzle.clues) {
      const item = document.createElement('li');
      const left = document.createElement('span');
      left.textContent = `${copy.fields.categoryGroups[clue.groupA].name}: ${copy.fields.categoryGroups[clue.groupA].values[clue.valueA]}`;
      const relation = document.createElement('span');
      relation.className = 'logic-grid-clue-relation';
      relation.setAttribute('aria-label', copy.fields[clue.relation]);
      relation.textContent = clue.relation === 'same' ? '↔' : '≠';
      const right = document.createElement('span');
      right.textContent = `${copy.fields.categoryGroups[clue.groupB].name}: ${copy.fields.categoryGroups[clue.groupB].values[clue.valueB]}`;
      item.append(left, relation, right);
      fragment.append(item);
    }
    cluesList.replaceChildren(fragment);
  }

  function renderGrid(focusKey = null) {
    const [groupA, groupB] = selectedPair();
    const leftGroup = copy.fields.categoryGroups[groupA];
    const rightGroup = copy.fields.categoryGroups[groupB];
    caption.textContent = `${leftGroup.name} ↔ ${rightGroup.name}`;

    const headRow = document.createElement('tr');
    const corner = document.createElement('th');
    corner.scope = 'col';
    headRow.append(corner);
    rightGroup.values.forEach((value) => {
      const heading = document.createElement('th');
      heading.scope = 'col';
      heading.textContent = value;
      headRow.append(heading);
    });
    tableHead.replaceChildren(headRow);

    const fragment = document.createDocumentFragment();
    leftGroup.values.forEach((leftValue, row) => {
      const tr = document.createElement('tr');
      const rowHeading = document.createElement('th');
      rowHeading.scope = 'row';
      rowHeading.textContent = leftValue;
      tr.append(rowHeading);
      rightGroup.values.forEach((rightValue, column) => {
        const td = document.createElement('td');
        const button = document.createElement('button');
        const key = markKey(pairSelect.selectedIndex, row, column);
        const relation = marks.get(key);
        const stateLabel = relation === 'same' ? copy.fields.sameMark : relation === 'different' ? copy.fields.differentMark : copy.fields.unmarked;
        button.type = 'button';
        button.className = `logic-grid-cell${relation ? ` is-${relation}` : ''}`;
        button.dataset.cell = key;
        button.setAttribute('aria-pressed', String(Boolean(relation)));
        button.setAttribute('aria-label', `${leftGroup.name}: ${leftValue}; ${rightGroup.name}: ${rightValue}; ${stateLabel}`);
        button.textContent = relation === 'same' ? '✓' : relation === 'different' ? '×' : '·';
        td.append(button);
        tr.append(td);
      });
      fragment.append(tr);
    });
    tableBody.replaceChildren(fragment);
    if (focusKey) tableBody.querySelector(`[data-cell="${focusKey}"]`)?.focus();
  }

  function readMarks() {
    return [...marks].map(([key, relation]) => {
      const [pair, row, column] = key.split(':').map(Number);
      return { pair, row, column, relation };
    });
  }

  function newPuzzle() {
    try {
      const random = globalThis.crypto?.getRandomValues
        ? () => globalThis.crypto.getRandomValues(new Uint32Array(1))[0] / 0x1_0000_0000
        : Math.random;
      puzzle = createLogicGridPuzzle({ difficulty: difficulty.value, random });
      marks.clear();
      pairSelect.value = '0:1';
      renderClues();
      renderGrid();
      announce(root, copy.messages.newPuzzle, 'success');
    } catch {
      announce(root, copy.messages.generationFailed, 'error');
    }
  }

  tableBody.addEventListener('click', (event) => {
    const button = event.target.closest('[data-cell]');
    if (!button || !tableBody.contains(button)) return;
    const key = button.dataset.cell;
    const previous = marks.get(key);
    if (!previous) marks.set(key, 'same');
    else if (previous === 'same') marks.set(key, 'different');
    else marks.delete(key);
    renderGrid(key);
    const current = marks.get(key);
    announce(root, current === 'same' ? copy.messages.markedSame : current === 'different' ? copy.messages.markedDifferent : copy.messages.unmarked, 'info');
  });

  pairSelect.addEventListener('change', () => renderGrid());
  difficulty.addEventListener('change', newPuzzle);
  root.querySelector('[data-action="new-game"]')?.addEventListener('click', newPuzzle);
  root.querySelector('[data-action="check-board"]')?.addEventListener('click', () => {
    const result = checkLogicGridMarks(puzzle, readMarks());
    const message = { solved: 'solved', incomplete: 'incomplete', conflict: 'conflict', incorrect: 'incorrect' }[result.status];
    announce(root, copy.messages[message], result.status === 'solved' ? 'success' : 'info');
  });
  root.querySelector('[data-action="hint"]')?.addEventListener('click', () => {
    const hint = logicGridHint(puzzle, readMarks());
    if (!hint) { announce(root, copy.messages.noHint, 'info'); return; }
    const key = markKey(hint.pair, hint.row, hint.column);
    marks.set(key, hint.relation);
    const [groupA, groupB] = logicGridPairGroups[hint.pair];
    const left = copy.fields.categoryGroups[groupA].values[hint.row];
    const right = copy.fields.categoryGroups[groupB].values[hint.column];
    const message = (hint.relation === 'same' ? copy.messages.hintSame : copy.messages.hintDifferent).replace('{left}', left).replace('{right}', right);
    pairSelect.value = `${groupA}:${groupB}`;
    renderGrid(key);
    announce(root, message, 'success');
  });
  root.querySelector('[data-action="clear-marks"]')?.addEventListener('click', () => {
    marks.clear();
    renderGrid();
    announce(root, copy.messages.marksCleared, 'info');
  });
  newPuzzle();
}

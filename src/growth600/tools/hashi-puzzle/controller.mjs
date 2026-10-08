import { checkHashiBoard, createHashiPuzzle, findHashiHint } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="hashi-puzzle"]');
if (root) {
  const copy = readToolCopy(root);
  const board = root.querySelector('[data-board]');
  const difficultyControl = root.querySelector('[data-difficulty]');
  let puzzle; let counts = []; let history = [];

  function totals() {
    return puzzle.islands.map((_, island) => puzzle.bridges.reduce((sum, edge, index) => sum + ((edge.a === island || edge.b === island) ? counts[index] : 0), 0));
  }
  function snapshot() { history.push(counts.slice()); if (history.length > 100) history.shift(); }
  function labelIsland(index, current) {
    const island = puzzle.islands[index];
    return `${copy.fields.island} ${island.row + 1}, ${island.column + 1}; ${copy.fields.needs} ${island.degree}; ${copy.fields.current} ${current[index]}`;
  }
  function labelBridge(edge, value) {
    const a = puzzle.islands[edge.a]; const b = puzzle.islands[edge.b];
    return `${copy.fields.bridge} ${a.row + 1}, ${a.column + 1} ${copy.fields.to} ${b.row + 1}, ${b.column + 1}; ${copy.fields.current} ${value}; ${copy.fields.toggleHint}`;
  }
  function render() {
    const fragment = document.createDocumentFragment(); const current = totals();
    board.replaceChildren();
    for (const [index, edge] of puzzle.bridges.entries()) {
      const button = document.createElement('button');
      button.type = 'button'; button.className = `hashi-bridge${edge.orientation === 'vertical' ? ' is-vertical' : ''}${counts[index] ? ` has-${counts[index]}` : ''}`;
      button.dataset.bridge = String(index); button.setAttribute('aria-label', labelBridge(edge, counts[index])); button.setAttribute('aria-pressed', String(counts[index] > 0));
      if (edge.orientation === 'horizontal') { button.style.gridRow = String(edge.row + 1); button.style.gridColumn = `${Math.min(puzzle.islands[edge.a].column, puzzle.islands[edge.b].column) + 2} / ${Math.max(puzzle.islands[edge.a].column, puzzle.islands[edge.b].column) + 1}`; }
      else { button.style.gridColumn = String(edge.column + 1); button.style.gridRow = `${Math.min(puzzle.islands[edge.a].row, puzzle.islands[edge.b].row) + 2} / ${Math.max(puzzle.islands[edge.a].row, puzzle.islands[edge.b].row) + 1}`; }
      button.addEventListener('click', () => {
        const next = (counts[index] + 1) % 3;
        if (next > counts[index]) {
          const aCurrent = current[edge.a] - counts[index]; const bCurrent = current[edge.b] - counts[index];
          if (aCurrent + next > puzzle.islands[edge.a].degree || bCurrent + next > puzzle.islands[edge.b].degree) { announce(root, copy.messages.islandFull, 'info'); return; }
          for (let other = 0; other < puzzle.bridges.length; other += 1) if (counts[other] > 0) {
            const first = puzzle.bridges[index]; const second = puzzle.bridges[other];
            if (first.orientation !== second.orientation) {
              const horizontal = first.orientation === 'horizontal' ? first : second; const vertical = first.orientation === 'vertical' ? first : second;
              const hA = puzzle.islands[horizontal.a]; const hB = puzzle.islands[horizontal.b]; const vA = puzzle.islands[vertical.a];
              const left = Math.min(hA.column, hB.column); const right = Math.max(hA.column, hB.column); const top = Math.min(puzzle.islands[vertical.a].row, puzzle.islands[vertical.b].row); const bottom = Math.max(puzzle.islands[vertical.a].row, puzzle.islands[vertical.b].row);
              if (vA.column > left && vA.column < right && hA.row > top && hA.row < bottom) { announce(root, copy.messages.crossing, 'info'); return; }
            }
          }
        }
        snapshot(); counts[index] = next; render(); announce(root, copy.messages.bridgeChanged.replace('{count}', String(next)), 'info');
      });
      fragment.append(button);
    }
    puzzle.islands.forEach((island, index) => {
      const node = document.createElement('span'); node.className = `hashi-island${current[index] === island.degree ? ' is-full' : ''}`;
      node.style.gridRow = String(island.row + 1); node.style.gridColumn = String(island.column + 1);
      node.textContent = String(island.degree); node.setAttribute('role', 'img'); node.setAttribute('aria-label', labelIsland(index, current)); fragment.append(node);
    });
    board.style.gridTemplateColumns = `repeat(${puzzle.gridSize}, minmax(0, 1fr))`;
    board.replaceChildren(fragment);
  }
  function newPuzzle() {
    puzzle = createHashiPuzzle({ difficulty: difficultyControl.value }); counts = Array(puzzle.bridges.length).fill(0); history = []; render();
    announce(root, puzzle.generated ? copy.messages.newPuzzle : copy.messages.fallbackPuzzle, 'success');
  }
  root.querySelector('[data-action="new-game"]')?.addEventListener('click', newPuzzle);
  difficultyControl.addEventListener('change', newPuzzle);
  root.querySelector('[data-action="check-board"]')?.addEventListener('click', () => {
    const result = checkHashiBoard(puzzle, counts);
    if (result.valid) announce(root, copy.messages.solved, 'success');
    else announce(root, result.errors.map((error) => copy.messages[error]).join(' '), 'error');
  });
  root.querySelector('[data-action="hint"]')?.addEventListener('click', () => {
    const hint = findHashiHint(puzzle, counts);
    if (!hint) { announce(root, copy.messages.noHint, 'info'); return; }
    snapshot(); counts[hint.index] = hint.count; render();
    board.querySelector(`[data-bridge="${hint.index}"]`)?.classList.add('is-hint');
    announce(root, copy.messages.hint.replace('{count}', String(hint.count)), 'info');
  });
  root.querySelector('[data-action="undo"]')?.addEventListener('click', () => {
    const previous = history.pop();
    if (!previous) { announce(root, copy.messages.undoEmpty, 'info'); return; }
    counts = previous; render(); announce(root, copy.messages.undo, 'success');
  });
  root.querySelector('[data-action="clear-board"]')?.addEventListener('click', () => {
    if (!counts.some(Boolean)) { announce(root, copy.messages.undoEmpty, 'info'); return; }
    snapshot(); counts.fill(0); render(); announce(root, copy.messages.cleared, 'success');
  });
  newPuzzle();
}

import { createSokoban, getSokobanTile, moveSokoban, undoSokoban } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="sokoban"]');
if (root) {
  const copy = readToolCopy(root);
  const levelSelect = root.querySelector('[data-level]');
  const board = root.querySelector('[data-board]');
  const moves = root.querySelector('[data-moves]');
  const pushes = root.querySelector('[data-pushes]');
  let game = createSokoban(Number(levelSelect.value));

  function render() {
    board.replaceChildren();
    board.style.setProperty('--sokoban-columns', String(game.width));
    for (let y = 0; y < game.height; y += 1) {
      const row = document.createElement('div');
      row.className = 'sokoban-row';
      row.setAttribute('role', 'row');
      for (let x = 0; x < game.width; x += 1) {
        const tile = getSokobanTile(game, x, y);
        const cell = document.createElement('div');
        cell.className = 'sokoban-cell sokoban-cell--' + tile;
        cell.setAttribute('role', 'gridcell');
        const labelKey = tile.replace(/-([a-z])/gu, (_, letter) => letter.toUpperCase());
        cell.setAttribute('aria-label', (x + 1) + ', ' + (y + 1) + ': ' + (copy.fields[labelKey] ?? copy.fields.floor));
        cell.textContent = ({ wall: '■', floor: '', goal: '◎', player: '●', 'player-on-goal': '●', box: '□', 'box-on-goal': '▣' })[tile] ?? '';
        row.append(cell);
      }
      board.append(row);
    }
    moves.textContent = String(game.moves);
    pushes.textContent = String(game.pushes);
  }

  function move(direction) {
    if (game.solved) return;
    const next = moveSokoban(game, direction);
    if (next === game) {
      announce(root, copy.messages.blocked, 'info');
      return;
    }
    game = next;
    render();
    if (game.solved) {
      announce(root, copy.messages.levelComplete.replace('{level}', levelSelect.selectedOptions[0].textContent).replace('{moves}', String(game.moves)).replace('{pushes}', String(game.pushes)), 'success');
    } else {
      announce(root, copy.messages.moved.replace('{moves}', String(game.moves)).replace('{pushes}', String(game.pushes)), 'info');
    }
  }

  levelSelect.addEventListener('change', () => {
    game = createSokoban(Number(levelSelect.value));
    render();
    announce(root, copy.messages.ready, 'info');
  });
  root.querySelector('[data-action="restart"]')?.addEventListener('click', () => {
    game = createSokoban(Number(levelSelect.value));
    render();
    announce(root, copy.messages.restarted, 'success');
    board.focus();
  });
  root.querySelector('[data-action="undo"]')?.addEventListener('click', () => {
    if (!game.history.length) { announce(root, copy.messages.undoEmpty, 'info'); return; }
    game = undoSokoban(game);
    render();
    announce(root, copy.messages.moved.replace('{moves}', String(game.moves)).replace('{pushes}', String(game.pushes)), 'info');
    board.focus();
  });
  root.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-move]');
    if (button && root.contains(button)) move(button.dataset.move);
  });
  board.addEventListener('keydown', (event) => {
    const direction = ({ ArrowUp: 'up', w: 'up', ArrowDown: 'down', s: 'down', ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right' })[event.key.length === 1 ? event.key.toLowerCase() : event.key];
    if (!direction) return;
    event.preventDefault();
    move(direction);
  });
  render();
  announce(root, copy.messages.ready, 'info');
}

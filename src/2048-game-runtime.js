import { canMove2048, create2048Board, move2048, spawn2048Tile } from './local-planners-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);

export function setup2048Game(root) {
  const messages = JSON.parse(root.dataset.plannerMessages || '{}');
  const say = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), messages[key] ?? key);
  const status = (key, type = '', values = {}) => {
    const output = $('#op-status', root);
    output.textContent = say(key, values);
    output.className = `tool-status${type ? ` is-${type}` : ''}`;
  };
  const boardElement = $('[data-2048-board]', root);
  const scoreElement = $('[data-2048-score]', root);
  const undoButton = $('[data-2048-undo]', root);
  let board = [];
  let score = 0;
  let undoState = null;
  let won = false;

  const render = () => {
    scoreElement.textContent = String(score);
    undoButton.disabled = !undoState;
    boardElement.replaceChildren();
    board.forEach((value) => {
      const tile = document.createElement('div');
      tile.className = 'op-2048__tile';
      tile.setAttribute('role', 'gridcell');
      tile.dataset.value = String(value);
      tile.textContent = value ? String(value) : '';
      tile.setAttribute('aria-label', value ? say('Tile {value}', { value }) : say('Empty tile'));
      boardElement.append(tile);
    });
  };

  const newGame = () => {
    board = create2048Board();
    score = 0;
    undoState = null;
    won = false;
    render();
    status('Merge tiles to reach 2048.');
  };

  const move = (direction) => {
    const result = move2048(board, direction);
    if (!result.changed) return;
    undoState = { board: [...board], score, won };
    const previouslyWon = won;
    board = spawn2048Tile(result.board);
    score += result.score;
    render();
    if (!previouslyWon && board.some((tile) => tile >= 2048)) {
      won = true;
      undoState.won = false;
      status('You reached 2048! Keep going or start a new game.', 'success');
    } else if (!canMove2048(board)) status('No moves left. Score: {score}.', 'error', { score });
    else status('');
  };

  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-2048-new]')) { newGame(); return; }
    if (event.target.closest('[data-2048-undo]')) {
      if (!undoState) return status('No more moves to undo.', 'error');
      ({ board, score, won } = undoState);
      undoState = null;
      render();
      status('');
      return;
    }
    const direction = event.target.closest('[data-2048-move]')?.dataset['2048Move'];
    if (direction) move(direction);
  });

  root.addEventListener('keydown', (event) => {
    if (!root.contains(document.activeElement) || event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
    const directions = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
    if (directions[event.key]) { event.preventDefault(); move(directions[event.key]); }
  });

  newGame();
}

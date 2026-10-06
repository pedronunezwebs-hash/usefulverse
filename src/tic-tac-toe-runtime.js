import { chooseTicTacToeMove, ticTacToeResult } from './tic-tac-toe-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);

export function setupTicTacToe(root) {
  const messages = JSON.parse(root.dataset.plannerMessages || '{}');
  const say = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), messages[key] ?? key);
  const boardElement = $('[data-ttt-board]', root); const mode = $('[data-ttt-opponent]', root);
  const scores = { X: 0, O: 0, draw: 0 };
  let board = Array(9).fill(null); let turn = 'X'; let finished = false; let selected = 0;
  const status = (text, type = '') => { const element = $('[data-ttt-status]', root); element.textContent = text; element.className = `tool-status${type ? ` is-${type}` : ''}`; };
  const updateScores = () => {
    $('[data-ttt-x-score]', root).textContent = say('X wins: {count}', { count: scores.X });
    $('[data-ttt-o-score]', root).textContent = say('O wins: {count}', { count: scores.O });
    $('[data-ttt-draw-score]', root).textContent = say('Draws: {count}', { count: scores.draw });
  };
  const messageForResult = (result) => {
    if (!result) return status(say(turn === 'X' ? 'X to move.' : 'O to move.'));
    finished = true; scores[result] += 1; updateScores();
    status(say(result === 'draw' ? 'Draw game.' : `${result} wins!`), result === 'draw' ? '' : 'success');
  };
  const render = (focus = false) => {
    boardElement.replaceChildren();
    board.forEach((value, index) => {
      const cell = document.createElement('button'); cell.type = 'button'; cell.className = 'tic-tac-toe__cell';
      cell.dataset.tttCell = String(index); cell.setAttribute('role', 'gridcell'); cell.tabIndex = index === selected ? 0 : -1;
      if (index === selected) cell.classList.add('is-selected');
      cell.textContent = value ?? ''; cell.setAttribute('aria-label', say('Square {number}: {value}', { number: index + 1, value: value ?? say('Empty') }));
      cell.disabled = finished || Boolean(value); boardElement.append(cell);
    });
    if (focus) boardElement.querySelector(`[data-ttt-cell="${selected}"]`)?.focus();
  };
  const start = () => { board = Array(9).fill(null); turn = 'X'; finished = false; selected = 0; render(); status(mode.value === 'computer' ? say('You are X. The computer is O.') : say('X to move.')); };
  const place = (index) => {
    if (finished || board[index]) return;
    board[index] = turn; let result = ticTacToeResult(board);
    if (result) { render(); messageForResult(result); return; }
    turn = turn === 'X' ? 'O' : 'X';
    if (mode.value === 'computer' && turn === 'O') {
      const move = chooseTicTacToeMove(board);
      if (move !== null) board[move] = 'O';
      result = ticTacToeResult(board);
      if (result) { render(); messageForResult(result); return; }
      turn = 'X';
    }
    selected = board.findIndex((value) => value === null);
    render(true); status(say(turn === 'X' ? 'X to move.' : 'O to move.'));
  };
  root.addEventListener('click', (event) => {
    const cell = event.target.closest('[data-ttt-cell]');
    if (cell) { selected = Number(cell.dataset.tttCell); place(selected); return; }
    if (event.target.closest('[data-ttt-new]')) return start();
    if (event.target.closest('[data-ttt-reset-score]')) { scores.X = 0; scores.O = 0; scores.draw = 0; updateScores(); start(); }
  });
  root.addEventListener('change', (event) => { if (event.target.matches('[data-ttt-opponent]')) start(); });
  boardElement.addEventListener('keydown', (event) => {
    const cell = event.target.closest('[data-ttt-cell]'); if (!cell) return;
    const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 }[event.key];
    if (delta === undefined) return;
    event.preventDefault(); selected = (Number(cell.dataset.tttCell) + delta + 9) % 9; render(true);
  });
  updateScores(); start();
}

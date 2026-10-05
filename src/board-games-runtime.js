import { BLACK, createConnectFour, createReversi, dropConnectDisc, connectFourWinner, playReversiMove, reversiLegalMoves, reversiTurnOutcome, RED } from './board-games-logic.mjs';

const fill = (template, values) => Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, String(value)), template);
export function setupBoardGame(root) {
  const game = root.querySelector('[data-board-game]'); if (!game) return;
  const kind = game.dataset.boardGame; const grid = game.querySelector('[data-board-grid]'); const status = game.querySelector('[data-board-status]');
  let board = kind === 'connect-four' ? createConnectFour() : createReversi(); let player = RED; let winner = 0; let passed = false;
  let messages = {}; try { messages = JSON.parse(root.dataset.boardGameMessages || '{}'); } catch { /* use English fallback strings */ }
  const say = (key, values = {}) => fill(messages[key] || key, values);
  const updateStatus = (key, values) => { status.textContent = say(key, values); };
  const labelFor = (value, row, column, legal) => {
    const state = value === RED ? say('Red disk') : value === BLACK ? say('Black disk') : kind === 'reversi' && legal ? say('Legal move') : say('Empty square');
    return say('Row {row}, column {column}: {state}', { row: row + 1, column: column + 1, state });
  };
  const render = () => {
    const passButton = game.querySelector('[data-board-pass]'); if (passButton) passButton.disabled = !passed || Boolean(winner);
    grid.replaceChildren(); grid.setAttribute('aria-label', say(kind === 'connect-four' ? 'Connect Four board' : 'Reversi board'));
    const legal = kind === 'reversi' && !passed ? new Set(reversiLegalMoves(board, player)) : new Set();
    board.forEach((cell, index) => {
      const row = kind === 'connect-four' ? Math.floor(index / 7) : Math.floor(index / 8); const column = kind === 'connect-four' ? index % 7 : index % 8;
      const button = document.createElement('button'); button.type = 'button'; button.className = `board-game__cell${cell === RED ? ' is-red' : cell === BLACK ? ' is-black' : ''}`;
      button.dataset.boardCell = String(index); button.disabled = Boolean(winner) || (kind === 'reversi' && !legal.has(index));
      button.setAttribute('aria-label', labelFor(cell, row, column, legal.has(index))); button.setAttribute('aria-pressed', String(cell !== 0));
      if (kind === 'connect-four') button.dataset.column = String(column);
      grid.append(button);
    });
  };
  const announceTurn = () => updateStatus(player === RED ? 'Current turn: Red' : 'Current turn: Black');
  const finishReversiTurn = (nextPlayer) => {
    const outcome = reversiTurnOutcome(board, player, nextPlayer);
    if (!outcome) return;
    if (outcome.kind === 'turn') { player = outcome.player; announceTurn(); return; }
    if (outcome.kind === 'pass') { player = outcome.player; passed = true; updateStatus('No legal move. Pass this turn.'); return; }
    winner = outcome.winner;
    updateStatus(winner === 3 ? 'Game tied. Red: {red}, Black: {black}.' : winner === RED ? 'Red wins! Red: {red}, Black: {black}.' : 'Black wins! Red: {red}, Black: {black}.', outcome);
  };
  game.addEventListener('click', (event) => {
    if (event.target.closest('[data-board-reset]')) { board = kind === 'connect-four' ? createConnectFour() : createReversi(); player = RED; winner = 0; passed = false; render(); announceTurn(); return; }
    if (event.target.closest('[data-board-pass]')) {
      if (kind !== 'reversi' || !passed || winner) return;
      player = player === RED ? BLACK : RED; passed = false; announceTurn(); render(); return;
    }
    const cell = event.target.closest('[data-board-cell]'); if (!cell || winner) return;
    if (kind === 'connect-four') {
      const result = dropConnectDisc(board, Number(cell.dataset.column), player);
      if (!result) { updateStatus('Choose a non-full column.'); return; }
      board = result.board; winner = result.winner || (result.draw ? 3 : 0); render();
      if (winner) updateStatus(winner === 3 ? 'Game tied.' : winner === RED ? 'Red wins!' : 'Black wins!');
      else { player = player === RED ? BLACK : RED; announceTurn(); }
      return;
    }
    const row = Math.floor(Number(cell.dataset.boardCell) / 8); const column = Number(cell.dataset.boardCell) % 8;
    const result = playReversiMove(board, row, column, player); if (!result) { updateStatus('Choose a highlighted square.'); return; }
    board = result.board; passed = false; finishReversiTurn(result.nextPlayer); render();
  });
  render(); announceTurn();
}

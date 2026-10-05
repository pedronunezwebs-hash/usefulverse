import { BLACK, createConnectFour, createReversi, createCheckers, dropConnectDisc, connectFourWinner, playReversiMove, reversiLegalMoves, reversiTurnOutcome, checkersLegalMoves, playCheckersMove, RED } from './board-games-logic.mjs';

const fill = (template, values) => Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, String(value)), template);
export function setupBoardGame(root) {
  const game = root.querySelector('[data-board-game]'); if (!game) return;
  const kind = game.dataset.boardGame; const grid = game.querySelector('[data-board-grid]'); const status = game.querySelector('[data-board-status]');
  const initialBoard = () => kind === 'connect-four' ? createConnectFour() : kind === 'checkers' ? createCheckers() : createReversi();
  let board = initialBoard(); let player = RED; let winner = 0; let passed = false; let selected = null; let forcedFrom = null; let checkerMoves = [];
  let messages = {}; try { messages = JSON.parse(root.dataset.boardGameMessages || '{}'); } catch { /* use English fallback strings */ }
  const say = (key, values = {}) => fill(messages[key] || key, values);
  const updateStatus = (key, values) => { status.textContent = say(key, values); };
  const labelFor = (value, row, column, legal) => {
    const state = value === RED ? say(kind === 'checkers' ? 'Red checker' : 'Red disk') : value === BLACK ? say(kind === 'checkers' ? 'Black checker' : 'Black disk') : value === RED + 2 ? say('Red king') : value === BLACK + 2 ? say('Black king') : kind !== 'connect-four' && legal ? say('Legal move') : say('Empty square');
    return say('Row {row}, column {column}: {state}', { row: row + 1, column: column + 1, state });
  };
  const render = () => {
    const passButton = game.querySelector('[data-board-pass]'); if (passButton) passButton.disabled = !passed || Boolean(winner);
    grid.replaceChildren(); grid.setAttribute('aria-label', say(kind === 'connect-four' ? 'Connect Four board' : kind === 'checkers' ? 'Checkers board' : 'Reversi board'));
    const reversiLegal = kind === 'reversi' && !passed ? new Set(reversiLegalMoves(board, player)) : new Set();
    checkerMoves = kind === 'checkers' && !winner ? checkersLegalMoves(board, player, forcedFrom) : [];
    const checkerLegal = new Set(checkerMoves.flatMap((move) => [move.from, move.to]));
    const legal = kind === 'reversi' ? reversiLegal : checkerLegal;
    const columns = kind === 'connect-four' ? 7 : 8;
    board.forEach((cell, index) => {
      const row = Math.floor(index / columns); const column = index % columns;
      const button = document.createElement('button'); button.type = 'button'; button.className = `board-game__cell${cell === RED || cell === RED + 2 ? ' is-red' : cell === BLACK || cell === BLACK + 2 ? ' is-black' : ''}${cell === RED + 2 || cell === BLACK + 2 ? ' is-king' : ''}${kind === 'checkers' && (row + column) % 2 === 1 ? ' is-dark-square' : ''}${selected === index ? ' is-selected' : ''}${legal.has(index) ? ' is-legal' : ''}`;
      button.dataset.boardCell = String(index); button.disabled = Boolean(winner) || (kind !== 'connect-four' && !legal.has(index));
      button.setAttribute('aria-label', labelFor(cell, row, column, legal.has(index))); button.setAttribute('aria-pressed', String(selected === index));
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
    if (event.target.closest('[data-board-reset]')) { board = initialBoard(); player = RED; winner = 0; passed = false; selected = null; forcedFrom = null; render(); announceTurn(); return; }
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
    if (kind === 'checkers') {
      const index = Number(cell.dataset.boardCell);
      const move = selected === null ? null : checkerMoves.find((candidate) => candidate.from === selected && candidate.to === index);
      if (!move) {
        if (checkerMoves.some((candidate) => candidate.from === index)) { selected = index; render(); grid.querySelector(`[data-board-cell="${index}"]`)?.focus(); updateStatus(forcedFrom === null ? 'Piece selected. Choose a highlighted square.' : 'Continue the capture.'); }
        else updateStatus('Choose a highlighted square.');
        return;
      }
      const result = playCheckersMove(board, move.from, move.to, player, forcedFrom);
      if (!result) { updateStatus('Choose a highlighted square.'); return; }
      board = result.board; forcedFrom = result.continuation ? index : null; selected = result.continuation ? index : null; winner = result.winner;
      render();
      if (!winner && result.continuation) grid.querySelector(`[data-board-cell="${index}"]`)?.focus();
      else if (!winner) grid.querySelector(`[data-board-cell="${checkerMoves[0]?.from ?? index}"]`)?.focus();
      if (winner) updateStatus(winner === RED ? 'Red wins!' : 'Black wins!');
      else if (result.continuation) updateStatus('Continue the capture.');
      else { player = result.nextPlayer; announceTurn(); }
      return;
    }
    const row = Math.floor(Number(cell.dataset.boardCell) / 8); const column = Number(cell.dataset.boardCell) % 8;
    const result = playReversiMove(board, row, column, player); if (!result) { updateStatus('Choose a highlighted square.'); return; }
    board = result.board; passed = false; finishReversiTurn(result.nextPlayer); render();
  });
  render(); announceTurn();
}

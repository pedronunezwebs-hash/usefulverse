import { announce } from '../controller-helpers.mjs';
import { chooseDotsAndBoxesBotMove, createDotsAndBoxesGame, playDotsAndBoxesEdge } from './logic.mjs';

function escapeGrowthHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

const root = document.querySelector('[data-tool="dots-and-boxes"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
  const form = root.querySelector('#tool-form');
  const board = root.querySelector('[data-dots-board]');
  const status = root.querySelector('[data-dots-status]');
  const score = root.querySelector('[data-dots-score]');
  let game = createDotsAndBoxesGame(4, 'computer');
  let busy = false;
  let gameVersion = 0;

  function format(template, values) { return template.replace(/\{(\w+)\}/gu, (_, key) => String(values[key] ?? '')); }
  function name(player) { return player === 1 ? copy.fields.playerTwo : copy.fields.playerOne; }
  function setStatus(message, kind = '') { status.textContent = message; announce(root, message, kind); }
  function lineLabel(orientation, row, col) {
    return format(orientation === 'h' ? copy.fields.horizontalLine : copy.fields.verticalLine, { row: row + 1, column: col + 1 });
  }
  function renderBoard() {
    const { size } = game;
    board.style.setProperty('--board-columns', String(size * 2 + 1));
    board.setAttribute('aria-label', copy.fields.boardLabel);
    const cells = [];
    for (let row = 0; row <= size * 2; row += 1) {
      for (let col = 0; col <= size * 2; col += 1) {
        const gridRow = row + 1;
        const gridColumn = col + 1;
        if (row % 2 === 0 && col % 2 === 0) {
          cells.push(`<span class="dots-and-boxes__dot" aria-hidden="true" style="grid-row:${gridRow};grid-column:${gridColumn}"></span>`);
          continue;
        }
        if (row % 2 === 1 && col % 2 === 1) {
          const boxRow = (row - 1) / 2; const boxCol = (col - 1) / 2;
          const owner = game.boxes[boxRow * size + boxCol];
          const label = owner === null ? copy.fields.emptyBox : format(copy.fields.boxOwned, { player: owner + 1 });
          cells.push(`<span class="dots-and-boxes__box${owner === null ? '' : ` dots-and-boxes__box--player-${owner + 1}`}" role="img" aria-label="${escapeGrowthHtml(label)}" style="grid-row:${gridRow};grid-column:${gridColumn}">${owner === null ? '' : owner + 1}</span>`);
          continue;
        }
        const orientation = row % 2 === 0 ? 'v' : 'h';
        const edgeRow = orientation === 'h' ? (row - 1) / 2 : row / 2;
        const edgeCol = orientation === 'h' ? col / 2 : (col - 1) / 2;
        const edgeIndex = orientation === 'h' ? edgeRow * size + edgeCol : size * (size + 1) + edgeRow * (size + 1) + edgeCol;
        const drawn = game.edges[edgeIndex];
        const disabled = drawn || game.gameOver || busy || (game.mode === 'computer' && game.currentPlayer === 1);
        cells.push(`<button type="button" class="dots-and-boxes__line dots-and-boxes__line--${orientation}${drawn ? ' is-drawn' : ''}" data-orientation="${orientation}" data-row="${edgeRow}" data-col="${edgeCol}" aria-label="${escapeGrowthHtml(lineLabel(orientation, edgeRow, edgeCol))}" aria-pressed="${drawn}" ${disabled ? 'disabled' : ''} style="grid-row:${gridRow};grid-column:${gridColumn}"></button>`);
      }
    }
    board.innerHTML = cells.join('');
    score.textContent = `${copy.fields.playerOne}: ${game.scores[0]} · ${copy.fields.playerTwo}: ${game.scores[1]}`;
  }
  function announceTurn() {
    if (game.gameOver) {
      if (game.winner === 'tie') setStatus(copy.messages.gameTied, 'success');
      else setStatus(format(copy.messages.gameWon, { player: game.winner + 1, score: game.scores[game.winner] }), 'success');
      return;
    }
    setStatus(game.mode === 'computer' && game.currentPlayer === 1 ? copy.messages.computerTurn : format(copy.messages.playerTurn, { player: game.currentPlayer + 1 }));
  }
  function applyMove(move) {
    const previousPlayer = game.currentPlayer;
    game = playDotsAndBoxesEdge(game, move.orientation, move.row, move.col);
    renderBoard();
    if (game.lastMove.completed.length) {
      setStatus(format(copy.messages.boxScored, { player: previousPlayer + 1, count: game.lastMove.completed.length }), 'success');
      if (game.gameOver) announceTurn();
    } else announceTurn();
  }
  function maybePlayBot() {
    if (game.mode !== 'computer' || game.currentPlayer !== 1 || game.gameOver || busy) return;
    const version = gameVersion;
    busy = true; renderBoard(); setStatus(copy.messages.computerTurn);
    window.setTimeout(() => {
      if (version !== gameVersion) return;
      try { applyMove(chooseDotsAndBoxesBotMove(game)); }
      catch { setStatus(copy.messages.playerTurn.replace('{player}', '1'), 'error'); }
      finally { busy = false; renderBoard(); if (!game.gameOver && game.currentPlayer === 1) maybePlayBot(); }
    }, 250);
  }
  board.addEventListener('click', (event) => {
    const edge = event.target.closest('button[data-orientation]');
    if (!edge || !board.contains(edge) || busy) return;
    try { applyMove({ orientation: edge.dataset.orientation, row: Number(edge.dataset.row), col: Number(edge.dataset.col) }); maybePlayBot(); }
    catch { setStatus(copy.messages.invalidMove, 'error'); }
  });
  root.querySelector('[data-action="newGame"]')?.addEventListener('click', () => {
    gameVersion += 1;
    busy = false;
    game = createDotsAndBoxesGame(Number(form.elements.namedItem('boardSize').value), form.elements.namedItem('mode').value);
    renderBoard(); setStatus(copy.messages.gameStarted, 'success'); announceTurn();
  });
  renderBoard(); announceTurn();
}

import { chooseDominoMove, createDominoGame, drawDomino, legalDominoMoves, passDominoTurn, playDomino } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="dominoes-game"]');
if (root) {
  const copy = readToolCopy(root);
  const mode = root.querySelector('[data-mode]');
  const variant = root.querySelector('[data-variant]');
  const board = root.querySelector('[data-board]');
  const hand = root.querySelector('[data-hand]');
  const stockCount = root.querySelector('[data-stock-count]');
  const opponentSection = root.querySelector('[data-opponent-hand]');
  const opponentCount = root.querySelector('[data-opponent-count]');
  let game;

  function playerLabel(player) {
    if (player === 0) return copy.messages.playerOne;
    return mode.value === 'computer' ? copy.actions.computer : copy.messages.playerTwo;
  }

  function render() {
    board.replaceChildren();
    for (const tile of game.board) {
      const item = document.createElement('li');
      item.className = 'domino-tile domino-tile--played';
      item.setAttribute('aria-label', `${tile.a} | ${tile.b}`);
      const left = document.createElement('span');
      const right = document.createElement('span');
      left.textContent = String(tile.a);
      right.textContent = String(tile.b);
      item.append(left, right);
      board.append(item);
    }
    stockCount.textContent = String(game.stock.length);
    const computerTurn = game.mode === 'computer' && game.currentPlayer === 1;
    opponentCount.textContent = String(game.hands[1].length);
    hand.replaceChildren();
    if (computerTurn) {
      hand.hidden = true;
      opponentSection.hidden = false;
    } else {
      hand.hidden = false;
      opponentSection.hidden = game.mode !== 'computer';
      for (const tile of game.hands[game.currentPlayer]) {
        const item = document.createElement('li');
        item.className = 'domino-hand-item';
        const face = document.createElement('span');
        face.className = 'domino-tile';
        face.setAttribute('aria-label', `${tile.a} | ${tile.b}`);
        const first = document.createElement('span');
        const second = document.createElement('span');
        first.textContent = String(tile.a);
        second.textContent = String(tile.b);
        face.append(first, second);
        item.append(face);
        for (const move of legalDominoMoves(game).filter((candidate) => candidate.tileId === tile.id)) {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'button button--secondary domino-play-button';
          button.dataset.tileId = tile.id;
          button.dataset.side = move.side;
          button.textContent = move.side === 'left' ? copy.actions.playLeft : copy.actions.playRight;
          button.setAttribute('aria-label', `${button.textContent}: ${tile.a} | ${tile.b}`);
          item.append(button);
        }
        hand.append(item);
      }
    }
    const draw = root.querySelector('[data-action="draw"]');
    const pass = root.querySelector('[data-action="pass"]');
    const hasMoves = legalDominoMoves(game).length > 0;
    const canDraw = !game.over && !hasMoves && game.variant === 'draw' && game.stock.length > 0 && !computerTurn;
    draw.disabled = !canDraw;
    pass.disabled = game.over || hasMoves || (game.variant === 'draw' && game.stock.length > 0) || computerTurn;
    const result = root.querySelector('[data-result]');
    const resultContent = root.querySelector('[data-result-content]');
    if (game.over) {
      result.hidden = false;
      resultContent.textContent = game.winner === 'tie' ? copy.messages.tie : game.winner === 0 ? copy.messages.playerOneWins : copy.messages.playerTwoWins;
      announce(root, copy.messages.gameOver, 'success');
    } else {
      result.hidden = true;
      const noMoves = !hasMoves && (game.variant === 'block' || game.stock.length === 0);
      const text = noMoves ? copy.messages.noMoves : copy.messages.turn.replace('{player}', playerLabel(game.currentPlayer));
      announce(root, text, 'info');
    }
  }

  function beginGame() {
    game = createDominoGame({ mode: mode.value, variant: variant.value });
    render();
    playComputerTurnIfNeeded();
  }

  function playComputerTurnIfNeeded() {
    if (game.over || game.mode !== 'computer' || game.currentPlayer !== 1) return;
    let guard = 0;
    while (!game.over && game.mode === 'computer' && game.currentPlayer === 1 && guard < 30) {
      guard += 1;
      const move = chooseDominoMove(game);
      if (move) {
        game = playDomino(game, move);
        render();
        if (game.currentPlayer === 1) continue;
        break;
      }
      const drawn = drawDomino(game);
      if (drawn) { game = drawn; continue; }
      const passed = passDominoTurn(game);
      if (passed) game = passed;
      break;
    }
    render();
  }

  hand.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-tile-id][data-side]');
    if (!button || !hand.contains(button) || game.over || game.currentPlayer !== 0 && game.mode === 'computer') return;
    const next = playDomino(game, { tileId: button.dataset.tileId, side: button.dataset.side });
    if (!next) return;
    game = next;
    render();
    playComputerTurnIfNeeded();
  });
  root.querySelector('[data-action="draw"]')?.addEventListener('click', () => {
    const next = drawDomino(game);
    if (!next) return;
    game = next;
    render();
    announce(root, copy.messages.drew, 'success');
  });
  root.querySelector('[data-action="pass"]')?.addEventListener('click', () => {
    const next = passDominoTurn(game);
    if (!next) return;
    game = next;
    render();
    playComputerTurnIfNeeded();
  });
  root.querySelector('[data-action="new-game"]')?.addEventListener('click', beginGame);
  mode.addEventListener('change', beginGame);
  variant.addEventListener('change', beginGame);
  beginGame();
}

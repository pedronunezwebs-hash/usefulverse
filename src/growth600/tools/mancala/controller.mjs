import { chooseMancalaMove, createMancalaGame, legalMancalaPits, playMancalaMove } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="mancala"]');
if (root) {
  const copy = readToolCopy(root);
  const boardElement = root.querySelector('[data-board]');
  const mode = root.querySelector('[data-mode]');
  let game = createMancalaGame();

  function pitButton(index) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'mancala-pit';
    button.dataset.pit = String(index);
    button.textContent = String(game.board[index]);
    const owner = index < 6 ? copy.messages.playerOne : copy.messages.playerTwo;
    const ownerPit = index < 6 ? index + 1 : index - 6;
    button.setAttribute('aria-label', `${owner}, ${copy.messages.pit} ${ownerPit}: ${game.board[index]} ${copy.messages.seeds}`);
    button.disabled = game.over || !legalMancalaPits(game).includes(index) || (mode.value === 'computer' && game.currentPlayer === 1);
    return button;
  }

  function store(index, playerLabel) {
    const cell = document.createElement('div');
    cell.className = 'mancala-store';
    cell.setAttribute('aria-label', `${playerLabel}: ${game.board[index]} ${copy.messages.seeds}`);
    const label = document.createElement('span');
    label.textContent = playerLabel;
    const count = document.createElement('strong');
    count.textContent = String(game.board[index]);
    cell.append(label, count);
    return cell;
  }

  function render() {
    const top = document.createElement('div');
    top.className = 'mancala-row mancala-row--top';
    for (let pit = 12; pit >= 7; pit -= 1) top.append(pitButton(pit));
    const bottom = document.createElement('div');
    bottom.className = 'mancala-row mancala-row--bottom';
    for (let pit = 0; pit < 6; pit += 1) bottom.append(pitButton(pit));
    const upperStore = store(13, copy.messages.playerTwo);
    const lowerStore = store(6, copy.messages.playerOne);
    boardElement.replaceChildren(upperStore, top, bottom, lowerStore);
    const result = root.querySelector('[data-result]');
    const resultContent = root.querySelector('[data-result-content]');
    if (game.over) {
      result.hidden = false;
      resultContent.textContent = game.winner === 'tie' ? copy.messages.tie : game.winner === 0 ? copy.messages.playerOneWins : copy.messages.playerTwoWins;
      announce(root, copy.messages.gameOver, 'success');
    } else {
      result.hidden = true;
      const whoseTurn = game.currentPlayer === 0 ? copy.messages.playerOne : copy.messages.playerTwo;
      announce(root, copy.messages.turn.replace('{player}', whoseTurn), 'info');
    }
  }

  function move(pit) {
    const result = playMancalaMove(game, pit);
    if (!result) return;
    game = result.game;
    render();
    let botMoves = 0;
    while (!game.over && mode.value === 'computer' && game.currentPlayer === 1 && botMoves < 100) {
      const computerPit = chooseMancalaMove(game);
      if (computerPit === null) break;
      game = playMancalaMove(game, computerPit).game;
      botMoves += 1;
      render();
    }
  }

  boardElement.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-pit]');
    if (button && boardElement.contains(button)) move(Number(button.dataset.pit));
  });
  root.querySelector('[data-action="new-game"]')?.addEventListener('click', () => {
    game = createMancalaGame();
    render();
  });
  mode.addEventListener('change', () => { game = createMancalaGame(); render(); });
  render();
}

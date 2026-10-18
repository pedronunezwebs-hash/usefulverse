import { chooseDotsBoxesComputerEdge, createDotsBoxesGame, playDotsBoxesEdge } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="dots-and-boxes"]');
if (root) {
  const copy = readToolCopy(root);
  const board = root.querySelector('[data-board]');
  const sizeSelect = root.querySelector('[data-size]');
  const modeSelect = root.querySelector('[data-mode]');
  let game = createDotsBoxesGame({ size: Number(sizeSelect.value), mode: modeSelect.value });
  let botTimer = 0;

  function playerName(player) {
    return game.mode === 'computer' && player === 1 ? copy.fields.computerName : player === 0 ? copy.fields.playerOne : copy.fields.playerTwo;
  }
  function status(message, values = {}) { root.querySelector('[data-status]').textContent = Object.entries(values).reduce((text, [key, value]) => text.replaceAll('{' + key + '}', String(value)), message); }
  function render() {
    board.style.setProperty('--dots-grid', String(game.size * 2 + 1));
    const fragment = document.createDocumentFragment();
    for (let gridRow = 0; gridRow <= game.size * 2; gridRow += 1) {
      const row = document.createElement('div'); row.setAttribute('role', 'row'); row.className = 'dots-boxes__row';
      for (let gridColumn = 0; gridColumn <= game.size * 2; gridColumn += 1) {
        const isDot = gridRow % 2 === 0 && gridColumn % 2 === 0;
        const isBox = gridRow % 2 === 1 && gridColumn % 2 === 1;
        if (isDot) {
          const dot = document.createElement('span'); dot.className = 'dots-boxes__dot'; dot.setAttribute('aria-hidden', 'true'); row.append(dot); continue;
        }
        if (isBox) {
          const boxRow = Math.floor(gridRow / 2); const boxColumn = Math.floor(gridColumn / 2);
          const owner = game.boxes[boxRow * game.size + boxColumn];
          const cell = document.createElement('span'); cell.className = 'dots-boxes__box' + (owner ? ' is-owned is-player-' + owner : '');
          cell.setAttribute('role', 'gridcell'); cell.setAttribute('aria-label', owner ? playerName(owner - 1) : ''); row.append(cell); continue;
        }
        const horizontal = gridRow % 2 === 0;
        const edge = horizontal
          ? { orientation: 'h', row: gridRow / 2, column: (gridColumn - 1) / 2 }
          : { orientation: 'v', row: (gridRow - 1) / 2, column: gridColumn / 2 };
        const index = horizontal ? edge.row * game.size + edge.column : edge.row * (game.size + 1) + edge.column;
        const owner = horizontal ? game.horizontal[index] : game.vertical[index];
        const button = document.createElement('button'); button.type = 'button'; button.className = 'dots-boxes__edge dots-boxes__edge--' + edge.orientation;
        button.dataset.edge = JSON.stringify(edge); button.setAttribute('role', 'gridcell');
        button.setAttribute('aria-label', (horizontal ? copy.fields.horizontalEdge : copy.fields.verticalEdge) + ' ' + (edge.row + 1) + ', ' + (edge.column + 1));
        button.setAttribute('aria-pressed', String(Boolean(owner)));
        if (owner) button.classList.add('is-drawn', 'is-player-' + owner);
        button.disabled = Boolean(owner) || game.finished || (game.mode === 'computer' && game.turn === 1);
        row.append(button);
      }
      fragment.append(row);
    }
    board.replaceChildren(fragment);
    const first = playerName(0); const second = playerName(1);
    root.querySelector('[data-score-one]').textContent = String(game.scores[0]);
    root.querySelector('[data-score-two]').textContent = String(game.scores[1]);
    root.querySelector('[data-player-one]').textContent = first;
    root.querySelector('[data-player-two]').textContent = second;
    root.querySelector('[data-turn]').textContent = game.finished ? endMessage() : (game.turn === 0 ? copy.messages.turnPlayerOne : copy.messages.turnPlayerTwo);
    sizeSelect.disabled = modeSelect.disabled = false;
  }
  function newGame() {
    clearTimeout(botTimer);
    board.removeAttribute('aria-busy');
    game = createDotsBoxesGame({ size: Number(sizeSelect.value), mode: modeSelect.value });
    render(); status(copy.messages.ready);
  }
  function endMessage() {
    const [first, second] = game.scores;
    if (first === second) return copy.messages.tie.replaceAll('{count}', String(first));
    const winner = first > second ? 0 : 1;
    return copy.messages.won.replaceAll('{player}', playerName(winner)).replaceAll('{count}', String(game.scores[winner]));
  }
  function play(edge) {
    const result = playDotsBoxesEdge(game, edge);
    if (!result.ok) return;
    render();
    if (result.finished) { status(endMessage()); return; }
    if (result.captured.length) status(result.captured.length === 1 ? copy.messages.captured : copy.messages.capturedMany, { player: playerName(game.turn), count: result.captured.length });
    else status(game.turn === 0 ? copy.messages.turnPlayerOne : copy.messages.turnPlayerTwo);
    if (game.mode === 'computer' && game.turn === 1 && !game.finished) {
      board.setAttribute('aria-busy', 'true');
      botTimer = setTimeout(() => {
        const move = chooseDotsBoxesComputerEdge(game);
        if (move) play(move);
        board.removeAttribute('aria-busy');
      }, 180);
    }
  }
  board.addEventListener('click', (event) => {
    const button = event.target.closest('[data-edge]');
    if (button && board.contains(button)) play(JSON.parse(button.dataset.edge));
  });
  sizeSelect.addEventListener('change', newGame);
  modeSelect.addEventListener('change', newGame);
  root.querySelector('[data-action="new-game"]').addEventListener('click', newGame);
  newGame();
}

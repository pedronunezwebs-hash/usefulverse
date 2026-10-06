import { createGoGame, passGoTurn, playGoMove } from './go-game-logic.mjs';

export function setupGoGame(root) {
  const messages = (() => { try { return JSON.parse(root.dataset.plannerMessages || '{}'); } catch { return {}; } })();
  const t = (key) => messages[key] ?? key;
  const boardElement = root.querySelector('[data-go-board]'); const turnLabel = root.querySelector('[data-go-turn]');
  const capturedLabel = root.querySelector('[data-go-captures]'); const status = root.querySelector('#op-status');
  let game = createGoGame(9);
  const stateLabel = (stone) => stone === 'B' ? t('Black stone') : stone === 'W' ? t('White stone') : t('Empty intersection');
  const render = () => {
    boardElement.replaceChildren();
    turnLabel.textContent = game.finished ? t('Start a new game to play again.') : t(game.turn === 'B' ? 'Black to play' : 'White to play');
    capturedLabel.textContent = `${t('Black captured: {count}').replace('{count}', game.captures.B)} · ${t('White captured: {count}').replace('{count}', game.captures.W)}`;
    for (let index = 0; index < game.board.length; index += 1) {
      const row = Math.floor(index / game.size) + 1; const column = (index % game.size) + 1; const stone = game.board[index];
      const button = document.createElement('button'); button.type = 'button'; button.className = `go-game__point${stone ? ` go-game__point--${stone === 'B' ? 'black' : 'white'}` : ''}`;
      button.dataset.goPoint = String(index); button.setAttribute('aria-label', t('Row {row}, column {column}: {state}').replace('{row}', row).replace('{column}', column).replace('{state}', stateLabel(stone)));
      button.disabled = game.finished || stone != null; button.textContent = stone ? (stone === 'B' ? '●' : '○') : '';
      boardElement.append(button);
    }
    root.querySelector('[data-go-pass]').disabled = game.finished;
  };
  boardElement.addEventListener('click', (event) => {
    const point = event.target.closest('[data-go-point]'); if (!point) return;
    try {
      const outcome = playGoMove(game, Number(point.dataset.goPoint));
      if (outcome.status === 'occupied') status.textContent = t('That intersection is occupied.');
      else if (outcome.status === 'suicide') status.textContent = t('That move is suicide and is not allowed.');
      else if (outcome.status === 'repeat') status.textContent = t('That move repeats a previous board position.');
      else { game = outcome.game; status.textContent = t(outcome.captured ? 'Stone captured.' : 'Stone placed.'); }
    } catch { status.textContent = t('That move is not available.'); }
    render();
  });
  root.querySelector('[data-go-pass]').addEventListener('click', () => {
    try {
      const outcome = passGoTurn(game); game = outcome.game;
      status.textContent = outcome.status === 'finished'
        ? t('Game over. Black: {black}; White: {white}. Area score has no komi.').replace('{black}', outcome.score.B).replace('{white}', outcome.score.W)
        : t('Turn passed. Pass once more to score.');
    } catch { status.textContent = t('Start a new game to play again.'); }
    render();
  });
  root.querySelector('[data-go-new]').addEventListener('click', () => { game = createGoGame(9); status.textContent = t('Place a stone on an empty intersection.'); render(); });
  render();
}

import { createMahjongGame, isMahjongTileFree, selectMahjongTile } from './mahjong-solitaire-logic.mjs';

export function setupMahjongSolitaire(root) {
  const messages = (() => { try { return JSON.parse(root.dataset.plannerMessages || '{}'); } catch { return {}; } })();
  const t = (key) => messages[key] ?? key;
  const board = root.querySelector('[data-mahjong-board]');
  const status = root.querySelector('#op-status');
  const moves = root.querySelector('[data-mahjong-moves]');
  let game = createMahjongGame(); let selected = null; let moveCount = 0;
  const render = () => {
    board.replaceChildren();
    for (let index = 0; index < game.tiles.length; index += 1) {
      const tile = game.tiles[index];
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'mahjong__tile'; button.dataset.mahjongTile = String(index);
      button.disabled = tile == null || !isMahjongTileFree(game, index);
      button.setAttribute('aria-pressed', selected === index ? 'true' : 'false');
      button.setAttribute('aria-label', tile ? `${t('Tile')} ${tile} · ${isMahjongTileFree(game, index) ? t('Free') : t('Blocked')}` : t('Removed tile'));
      button.textContent = tile ?? '';
      if (selected === index) button.classList.add('is-selected');
      if (tile == null) button.classList.add('is-removed');
      board.append(button);
    }
    moves.textContent = `${t('Moves')}: ${moveCount}`;
  };
  const sayStatus = (key) => { status.textContent = t(key); };
  board.addEventListener('click', (event) => {
    const button = event.target.closest('[data-mahjong-tile]'); if (!button || button.disabled) return;
    const outcome = selectMahjongTile(game, selected, Number(button.dataset.mahjongTile));
    game = outcome.game; selected = outcome.selected;
    if (outcome.status === 'mismatch') sayStatus('Those tiles do not match.');
    else if (outcome.status === 'matched') { moveCount += 1; sayStatus('Pair removed.'); }
    else if (outcome.status === 'won') { moveCount += 1; sayStatus('Puzzle complete!'); }
    else if (outcome.status === 'selected') sayStatus('Tile selected. Choose its match.');
    else if (outcome.status === 'blocked') sayStatus('That tile is blocked. Choose a free tile.');
    else sayStatus('Selection cleared.');
    render();
  });
  root.querySelector('[data-mahjong-new]').addEventListener('click', () => {
    game = createMahjongGame(); selected = null; moveCount = 0; render(); sayStatus('New puzzle ready.');
  });
  render(); sayStatus('Choose two matching free tiles.');
}

import { discardMahjongTile, drawMahjongTile, declareMahjongWin, startMahjongGame } from './logic.mjs';

export function mountMahjongFourPlayer() {
  const form = document.querySelector('#tool-form.mahjong-four-player');
  if (!form) return;
  const board = form.querySelector('[data-mahjong-board]');
  let copy = {};
  try { copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}'); } catch { return; }
  if (!board || !copy) return;
  let game = null;
  const text = (key, values = {}) => String(copy.fields[key] ?? '').replace(/\{(\w+)\}/gu, (_, name) => values[name] ?? '');
  const button = (label, action, className = 'mahjong-four-player__tile') => {
    const element = document.createElement('button'); element.type = 'button'; element.className = className; element.textContent = label;
    element.addEventListener('click', action); return element;
  };
  const render = () => {
    board.replaceChildren(); board.hidden = false;
    const heading = document.createElement('h2'); heading.textContent = text('resultTitle'); board.append(heading);
    if (!game) return;
    if (game.status === 'won') { const winner = document.createElement('p'); winner.textContent = text('winner', { name: game.players[game.winner].name }); board.append(winner); return; }
    if (game.status === 'draw') { const message = document.createElement('p'); message.textContent = text('wallEmpty'); board.append(message); return; }
    const turn = document.createElement('p'); turn.textContent = text('currentTurn', { name: game.players[game.turn].name }); board.append(turn);
    const wall = document.createElement('p'); wall.textContent = `${text('tilesLeft')}: ${game.wall.length}`; board.append(wall);
    const handLabel = document.createElement('h3'); handLabel.textContent = text('activeHand'); board.append(handLabel);
    const hand = document.createElement('div'); hand.className = 'mahjong-four-player__hand';
    game.players[game.turn].hand.forEach((tile, index) => hand.append(button(tile, () => { try { game = discardMahjongTile(game, index); render(); } catch {} }, 'mahjong-four-player__tile')));
    board.append(hand);
    if (game.phase === 'draw') board.append(button(text('drawTile'), () => { try { game = drawMahjongTile(game); render(); } catch {} }, 'button button--primary'));
    else {
      board.append(button(text('declareWin'), () => { try { game = declareMahjongWin(game); render(); } catch { const error = document.createElement('p'); error.setAttribute('role', 'status'); error.textContent = text('moveError'); board.append(error); } }, 'button button--primary'));
      const note = document.createElement('p'); note.textContent = text('handHidden'); board.append(note);
    }
    const discardTitle = document.createElement('h3'); discardTitle.textContent = text('discards'); board.append(discardTitle);
    const piles = document.createElement('div'); piles.className = 'mahjong-four-player__players';
    for (const player of game.players) { const section = document.createElement('section'); const name = document.createElement('h4'); name.textContent = player.name; const list = document.createElement('ul'); list.className = 'mahjong-four-player__discards'; for (const tile of player.discards) { const item = document.createElement('li'); item.textContent = tile; list.append(item); } if (!player.discards.length) { const item = document.createElement('li'); item.textContent = text('noDiscards'); list.append(item); } section.append(name, list); piles.append(section); }
    board.append(piles);
  };
  form.querySelector('[data-mahjong-start]')?.addEventListener('click', () => {
    try { game = startMahjongGame([1, 2, 3, 4].map((number) => form.elements.namedItem(`player${number}`).value)); render(); }
    catch (error) { const alert = document.createElement('p'); alert.setAttribute('role', 'alert'); alert.textContent = text('namesError'); board.hidden = false; board.replaceChildren(alert); }
  });
  form.querySelector('[data-mahjong-reset]')?.addEventListener('click', () => { game = null; board.replaceChildren(); board.hidden = true; });
}

mountMahjongFourPlayer();

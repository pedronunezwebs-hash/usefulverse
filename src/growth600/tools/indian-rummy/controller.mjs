import { discardIndianRummyCard, startIndianRummy, takeIndianRummyDraw } from './logic.mjs';

export function mountIndianRummy() {
  const form = document.querySelector('#tool-form.indian-rummy'); if (!form) return;
  let copy = {}; try { copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}'); } catch { return; }
  const f = copy.fields ?? {}; let game = null;
  const board = form.querySelector('[data-rummy-board]'); const hand = form.querySelector('[data-rummy-hand]'); const status = form.querySelector('[data-rummy-status]');
  const setStatus = (key) => { status.textContent = f[key] ?? ''; };
  const cardLabel = (card) => card.joker ? f.joker : `${card.rank}${{S:'♠',H:'♥',D:'♦',C:'♣'}[card.suit] ?? ''}`;
  const render = () => {
    board.hidden = !game; if (!game) return;
    const name = form.querySelector('[name="playerName"]').value.trim() || f.you;
    const wild = game.wildIndicator.joker ? f.joker : cardLabel(game.wildIndicator);
    form.querySelector('[data-rummy-wild]').textContent = `${f.wildCard}: ${wild}`;
    form.querySelector('[data-rummy-stock]').textContent = `${f.stock}: ${game.stock.length}`;
    form.querySelector('[data-rummy-discard]').textContent = `${f.topDiscard}: ${game.discards.length ? cardLabel(game.discards.at(-1)) : '—'}`;
    hand.replaceChildren();
    for (const card of game.human) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'indian-rummy__card'; button.textContent = cardLabel(card); button.disabled = game.phase !== 'discard' || game.status !== 'playing';
      button.setAttribute('aria-label', `${f.discardCard}: ${cardLabel(card)}`); button.addEventListener('click', () => { try { game = discardIndianRummyCard(game, card.id); setStatus(game.lastAction); render(); } catch (error) { status.textContent = error.message.includes('different card') ? f.cannotDiscardDrawn : f.moveError; } }); hand.append(button);
    }
    const canDraw = game.turn === 'human' && game.phase === 'draw' && game.status === 'playing';
    form.querySelector('[data-rummy-draw-stock]').disabled = !canDraw || !game.stock.length;
    form.querySelector('[data-rummy-draw-discard]').disabled = !canDraw || !game.discards.length;
    const turnName = game.turn === 'human' ? name : f.bot;
    form.querySelector('[data-rummy-turn]').textContent = `${f.turn}: ${turnName}`;
    if (game.status === 'won') setStatus(game.winner === 'human' ? 'humanWon' : 'botWon');
    else if (game.status === 'draw') setStatus('stockEmpty');
  };
  form.querySelector('[data-rummy-start]').addEventListener('click', () => { game = startIndianRummy(); setStatus('started'); render(); });
  form.querySelector('[data-rummy-draw-stock]').addEventListener('click', () => { try { game = takeIndianRummyDraw(game, 'stock'); setStatus(game.lastAction); render(); } catch { setStatus('moveError'); } });
  form.querySelector('[data-rummy-draw-discard]').addEventListener('click', () => { try { game = takeIndianRummyDraw(game, 'discard'); setStatus(game.lastAction); render(); } catch { setStatus('moveError'); } });
  form.querySelector('[data-rummy-reset]').addEventListener('click', () => { game = null; hand.replaceChildren(); setStatus(''); board.hidden = true; });
  const rules = document.createElement('a'); rules.href = 'https://www.pagat.com/rummy/indian.html'; rules.target = '_blank'; rules.rel = 'noopener noreferrer'; rules.textContent = f.rulesSource; board.append(rules);
}

mountIndianRummy();

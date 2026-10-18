import { chooseGrisCpuCard, createGrisGame, grisNextRound, grisPass, grisReact, grisResolveReturnedCard } from './gris-game.mjs';

const root = document.querySelector('[data-market-tool="grisCardGame"]');
if (root) {
  const f = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields ?? {};
  const $ = (selector) => root.querySelector(selector);
  let game = null;
  let selected = null;
  const escape = (value) => String(value).replace(/[&<>"']/gu, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const cardName = (card) => `${({0:f.spades,1:f.hearts,2:f.diamonds,3:f.clubs})[card.suit] ?? ''} ${{11:f.jack,12:f.queen,13:f.king,14:f.ace}[card.rank] ?? card.rank}`;
  const storeKey = 'usefulverse.gris.v1';
  const save = () => { try { if (game) localStorage.setItem(storeKey, JSON.stringify(game)); } catch { $('[data-gris-save-note]').textContent = f.saveUnavailable; } };
  const setStatus = (message) => { $('[data-gris-status]').textContent = message; };
  const nextIndex = () => game.status === 'signal' || game.status === 'reacting' ? game.reactionOrder[game.reactionCursor] : null;
  const cpuAdvance = () => {
    let guard = game.players.length * 3;
    while (guard-- > 0) {
      if (game.status === 'passing' && game.activePlayer !== 0) {
        const playerId = game.activePlayer;
        const card = chooseGrisCpuCard(game, playerId);
        if (!card) return;
        grisPass(game, { playerId, cardId: card.id });
        continue;
      }
      if (game.status === 'return-check' && game.activePlayer !== 0) {
        grisResolveReturnedCard(game, { discardCard: true });
        continue;
      }
      if ((game.status === 'signal' || game.status === 'reacting') && nextIndex() !== 0 && nextIndex() !== null) {
        grisReact(game, { playerId: nextIndex() });
        continue;
      }
      break;
    }
  };
  const render = () => {
    if (!game) return;
    cpuAdvance();
    $('[data-gris-match]').hidden = false;
    $('[data-gris-round]').textContent = String(game.round);
    $('[data-gris-stock]').textContent = String(game.stock.length);
    $('[data-gris-players]').innerHTML = game.players.map((player) => `<li>${escape(player.id === 0 ? f.you : f.opponent.replace('{number}', String(player.id)))} — ${escape(f.letters)}: ${escape(game.word.slice(0, player.letters).split('').join(' '))}${player.eliminated ? ` · ${escape(f.eliminated)}` : ''}</li>`).join('');
    $('[data-gris-hand]').innerHTML = game.players[0].hand.map((card) => `<button type="button" data-gris-card="${escape(card.id)}" aria-pressed="${card.id === selected}">${escape(cardName(card))}</button>`).join('');
    const humanTurn = game.status === 'passing' && game.activePlayer === 0;
    $('[data-gris-pass]').disabled = !humanTurn || !selected;
    $('[data-gris-react]').hidden = !((game.status === 'signal' || game.status === 'reacting') && nextIndex() === 0);
    $('[data-gris-return]').hidden = game.status !== 'return-check' || game.activePlayer !== 0;
    $('[data-gris-next]').hidden = game.status !== 'round-end';
    $('[data-gris-winner]').hidden = game.status !== 'complete';
    $('[data-gris-winner]').textContent = game.status === 'complete' ? f.gameWon.replace('{player}', game.players.find(({ eliminated }) => !eliminated)?.id === 0 ? f.you : f.opponent.replace('{number}', String(game.players.find(({ eliminated }) => !eliminated)?.id ?? 1))) : '';
    if (game.status === 'passing') setStatus(game.activePlayer === 0 ? f.selectCard : f.waitingCpu.replace('{player}', f.opponent.replace('{number}', String(game.activePlayer))));
    else if (game.status === 'return-check') setStatus(f.returnText);
    else if (game.status === 'signal' || game.status === 'reacting') setStatus(nextIndex() === 0 ? f.signalText.replace('{player}', f.you) : f.waitingReaction.replace('{player}', f.opponent.replace('{number}', String(nextIndex()))));
    else if (game.status === 'round-end') setStatus(f.roundEnd);
    else if (game.status === 'complete') setStatus(f.gameWon);
    save();
  };
  $('[data-gris-new]').addEventListener('click', () => {
    const values = new Uint32Array(1); globalThis.crypto?.getRandomValues?.(values);
    game = createGrisGame({ seed: values[0] || Date.now(), players: Number($("#gris-player-count").value), word: $("#gris-penalty-word").value || 'GRIS' });
    selected = null; render();
  });
  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-gris-card]');
    if (button && game?.status === 'passing' && game.activePlayer === 0) { selected = selected === button.dataset.grisCard ? null : button.dataset.grisCard; render(); }
  });
  $('[data-gris-pass]').addEventListener('click', () => { if (!game || !selected) return; grisPass(game, { cardId: selected }); selected = null; render(); });
  $('[data-gris-react]').addEventListener('click', () => { if (nextIndex() === 0) grisReact(game, { playerId: 0 }); render(); });
  $('[data-gris-keep]').addEventListener('click', () => { grisResolveReturnedCard(game, { discardCard: false }); render(); });
  $('[data-gris-replace]').addEventListener('click', () => { grisResolveReturnedCard(game, { discardCard: true }); render(); });
  $('[data-gris-next]').addEventListener('click', () => { grisNextRound(game); render(); });
  $('[data-gris-resume]').addEventListener('click', () => { try { const value = JSON.parse(localStorage.getItem(storeKey)); if (value?.players?.length && value.players.length >= 3 && value.players.length <= 8) { game = value; render(); } } catch { setStatus(f.saveDamaged); } });
  $('[data-gris-delete]').addEventListener('click', () => { try { localStorage.removeItem(storeKey); } catch {} game = null; $('[data-gris-match]').hidden = true; setStatus(f.deleted); });
  setStatus(f.ready);
}

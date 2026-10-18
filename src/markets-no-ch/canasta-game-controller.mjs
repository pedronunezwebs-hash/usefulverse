import {
  canastaCardCount, createCanastaGame,
  discardCanastaCard, drawCanastaStock, legalCanastaMeld, playCanastaCpuTurn, playCanastaMeld,
  startNextCanastaRound, takeCanastaDiscardPile,
} from './canasta-game.mjs';

const root = document.querySelector('[data-market-tool="canasta"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields ?? {};
  const q = (selector) => root.querySelector(selector);
  const storageKey = 'usefulverse.canasta.v1';
  const suitSymbols = ['♥', '♦', '♣', '♠'];
  let game = null;
  let selected = new Set();
  let storageAvailable = true;
  let cpuTimer = 0;

  const rankName = (rank) => copy[`rank${rank + 2}`] ?? `Rank ${rank + 2}`;
  function cardFace(card) {
    if (card.rank === 13) return { rank: '★', suit: copy.joker ?? 'Joker', red: false };
    return { rank: String(card.rank + 2), suit: suitSymbols[card.suit], red: card.suit < 2 };
  }
  function cardLabel(card) {
    const face = cardFace(card);
    return `${copy.card ?? 'Card'} ${face.rank} ${face.suit}`;
  }
  function validSave(saved) {
    return saved && Array.isArray(saved.hands) && saved.hands.length === 2 && saved.hands.every(Array.isArray)
      && Array.isArray(saved.stock) && Array.isArray(saved.discard) && Array.isArray(saved.melds) && saved.melds.length === 2
      && Array.isArray(saved.scores) && saved.scores.length === 2 && saved.scores.every(Number.isFinite)
      && Array.isArray(saved.redThreeCards) && saved.redThreeCards.length === 2
      && ['draw', 'meld', 'roundEnd'].includes(saved.phase)
      && ['playing', 'roundComplete', 'stockEmpty', 'complete'].includes(saved.status)
      && [0, 1].includes(saved.toMove) && canastaCardCount(saved) === 108;
  }
  function getSaved() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const saved = JSON.parse(raw);
      return validSave(saved) ? saved : null;
    } catch { return null; }
  }
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(game)); storageAvailable = true; }
    catch { storageAvailable = false; }
  }
  function statusText() {
    if (!game) return copy.readyStatus ?? '';
    if (game.status === 'complete') return game.winner === null ? (copy.draw ?? '') : game.winner === 0 ? (copy.gameWon ?? '') : (copy.gameLost ?? '');
    if (game.status === 'roundComplete') return game.toMove === 0 ? (copy.roundWon ?? '') : (copy.roundLost ?? '');
    if (game.status === 'stockEmpty') return copy.stockEmpty ?? '';
    if (game.phase === 'draw') return game.toMove === 0 ? (copy.yourTurnDraw ?? '') : (copy.cpuTurn ?? '');
    if (game.phase === 'meld') return game.toMove === 0 ? (copy.yourTurnMeld ?? '') : (copy.cpuTurn ?? '');
    return '';
  }
  function renderCard(card, index, interactive, player) {
    const face = cardFace(card);
    const selectedCard = selected.has(card.id);
    const classes = `canasta-card${face.red ? ' is-red' : ''}${card.rank === 13 ? ' is-joker' : ''}${selectedCard ? ' is-selected' : ''}`;
    const label = cardLabel(card);
    return interactive
      ? `<button type="button" class="${classes}" data-canasta-card="${card.id}" aria-label="${label}" aria-pressed="${selectedCard}" ${game.phase !== 'meld' || player !== 0 ? 'disabled' : ''}><span>${face.rank}</span><span>${face.suit}</span></button>`
      : `<span class="${classes}" aria-label="${label}"><span>${face.rank}</span><span>${face.suit}</span></span>`;
  }
  function render() {
    const active = Boolean(game);
    q('[data-canasta-match]').hidden = !active;
    q('[data-canasta-resume]').hidden = active || !getSaved();
    if (!active) return;
    const playing = game.status === 'playing';
    const playerTurn = game.toMove === 0;
    q('[data-canasta-status]').textContent = statusText();
    q('[data-canasta-score-you]').textContent = String(game.scores[0]);
    q('[data-canasta-score-cpu]').textContent = String(game.scores[1]);
    q('[data-canasta-turn]').textContent = playerTurn ? (copy.you ?? 'You') : (copy.computer ?? 'Computer');
    q('[data-canasta-stock-count]').textContent = String(game.stock.length);
    q('[data-canasta-hand]').innerHTML = game.hands[0].map((card, index) => renderCard(card, index, true, 0)).join('');
    q('[data-canasta-melds]').innerHTML = game.melds.map((melds, player) => `<section class="canasta-player-melds"><h4>${player === 0 ? (copy.you ?? 'You') : (copy.computer ?? 'Computer')}</h4>${melds.length ? melds.map((meld) => `<div class="canasta-meld"><strong>${rankName(meld.rank)}</strong> · ${meld.cards.map((card, index) => renderCard(card, index, false, player)).join(' ')}${meld.cards.length >= 7 ? `<span class="canasta-badge">${meld.cards.some((card) => card.rank === 0 || card.rank === 13) ? (copy.mixedCanasta ?? '') : (copy.cleanCanasta ?? '')}</span>` : ''}</div>`).join('') : `<p class="hint">—</p>`}</section>`).join('');
    q('[data-canasta-discard]').innerHTML = game.discard.length ? renderCard(game.discard.at(-1), 0, false, 2) : `<span class="canasta-empty">—</span>`;
    q('[data-canasta-pile-status]').textContent = game.frozen ? (copy.frozen ?? '') : (copy.open ?? '');
    q('[data-canasta-draw]').disabled = !playing || !playerTurn || game.phase !== 'draw' || game.stock.length < 2;
    const top = game.discard.at(-1);
    const matches = top ? game.hands[0].filter((card) => card.rank === top.rank).length : 0;
    q('[data-canasta-take]').disabled = !playing || !playerTurn || game.phase !== 'draw' || game.frozen || !top || top.rank === 0 || top.rank === 13 || top.rank === 1 || matches < 2;
    q('[data-canasta-meld-actions]').hidden = !playing || !playerTurn || game.phase !== 'meld';
    q('[data-canasta-selection-count]').textContent = String(selected.size);
    q('[data-canasta-discard]').setAttribute('data-card-count', String(game.discard.length));
    q('[data-canasta-round-score]').hidden = !game.roundPoints;
    if (game.roundPoints) {
      q('[data-canasta-round-you]').textContent = `${game.roundPoints[0]} (${game.scores[0]})`;
      q('[data-canasta-round-cpu]').textContent = `${game.roundPoints[1]} (${game.scores[1]})`;
    }
    q('[data-canasta-next]').hidden = !['roundComplete', 'stockEmpty'].includes(game.status) || game.scores.some((score) => score >= 5000);
    q('[data-canasta-save-note]').textContent = storageAvailable ? (copy.saved ?? '') : (copy.saveUnavailable ?? '');
    q('[data-canasta-hand]').querySelectorAll('[data-canasta-card]').forEach((button) => button.addEventListener('click', () => {
      const id = Number(button.dataset.canastaCard);
      if (selected.has(id)) selected.delete(id); else selected.add(id);
      render();
    }));
  }
  function saveAndRender() { save(); render(); }
  function runCpu() {
    window.clearTimeout(cpuTimer);
    if (!game || game.status !== 'playing' || game.toMove !== 1) return;
    q('[data-canasta-status]').textContent = copy.cpuTurn ?? '';
    cpuTimer = window.setTimeout(() => {
      game = playCanastaCpuTurn(game);
      selected.clear();
      saveAndRender();
    }, 260);
  }
  function act(action) {
    try {
      action();
      selected.clear();
      saveAndRender();
      runCpu();
    } catch { q('[data-canasta-status]').textContent = copy.invalid ?? ''; }
  }
  q('[data-canasta-new]').addEventListener('click', () => {
    window.clearTimeout(cpuTimer);
    let seed;
    try { seed = crypto.getRandomValues(new Uint32Array(1))[0]; } catch { seed = Date.now() >>> 0; }
    game = createCanastaGame({ seed });
    selected.clear();
    saveAndRender();
  });
  q('[data-canasta-resume]').addEventListener('click', () => {
    const saved = getSaved();
    if (!saved) { q('[data-canasta-status]').textContent = copy.saveDamaged ?? ''; return; }
    game = saved;
    selected.clear();
    render();
    q('[data-canasta-status]').textContent = copy.resumed ?? '';
    runCpu();
  });
  q('[data-canasta-delete]').addEventListener('click', () => {
    window.clearTimeout(cpuTimer);
    game = null;
    selected.clear();
    let message = copy.deleted ?? '';
    try { localStorage.removeItem(storageKey); storageAvailable = true; }
    catch { storageAvailable = false; message = copy.saveUnavailable ?? ''; }
    render();
    q('[data-canasta-status]').textContent = message;
  });
  q('[data-canasta-next]').addEventListener('click', () => act(() => {
    let seed;
    try { seed = crypto.getRandomValues(new Uint32Array(1))[0]; } catch { seed = Date.now() >>> 0; }
    game = startNextCanastaRound(game, seed);
  }));
  q('[data-canasta-draw]').addEventListener('click', () => act(() => drawCanastaStock(game, 0)));
  q('[data-canasta-take]').addEventListener('click', () => act(() => takeCanastaDiscardPile(game, 0)));
  q('[data-canasta-meld]').addEventListener('click', () => act(() => {
    if (!selected.size) throw new Error('Select cards first.');
    const rank = Number(q('#canasta-rank').value);
    if (!legalCanastaMeld(game, 0, rank, [...selected])) throw new Error('That meld is invalid.');
    playCanastaMeld(game, 0, rank, [...selected]);
  }));
  q('[data-canasta-clear]').addEventListener('click', () => { selected.clear(); render(); });
  q('[data-canasta-discard]').addEventListener('click', () => act(() => {
    if (selected.size !== 1) throw new Error('Select exactly one card to discard.');
    discardCanastaCard(game, 0, [...selected][0]);
  }));
}

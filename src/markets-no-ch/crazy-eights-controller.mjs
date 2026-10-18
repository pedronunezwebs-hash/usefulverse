import {
  CRAZY_EIGHTS_SUITS, chooseCrazyEightsCpuMove, crazyEightsCardCount, crazyEightsLegalCards,
  createCrazyEightsGame, drawCrazyEightsCard, playCrazyEightsCard,
  startNextCrazyEightsRound,
} from './crazy-eights-game.mjs';

const root = document.querySelector('[data-market-tool="crazyEights"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields ?? {};
  const q = (selector) => root.querySelector(selector);
  const storageKey = 'usefulverse.crazy-eights.v1';
  const suitSymbols = ['♠', '♥', '♦', '♣'];
  let game = null;
  let selectedId = null;
  let pendingCard = null;
  let statusText = copy.ready ?? '';
  let storageAvailable = true;
  let cpuTimer = 0;
  const text = (key, values = {}) => Object.entries(values).reduce((value, [name, replacement]) => value.replaceAll(`{${name}}`, String(replacement)), copy[key] ?? key);
  const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  const playerName = (index) => index === 0 ? copy.you ?? 'You' : text('opponent', { number: index });
  const cardLabel = (card) => `${copy[`rank${card.rank}`] ?? card.rank} ${copy[`suit${card.suit}`] ?? ''}`;
  const validSave = (saved) => {
    if (!saved || !Array.isArray(saved.hands) || saved.hands.length < 2 || saved.hands.length > 6 || !saved.hands.every(Array.isArray)
      || !Array.isArray(saved.stock) || !Array.isArray(saved.discard) || !saved.discard.length
      || !Array.isArray(saved.scores) || saved.scores.length !== saved.hands.length || !saved.scores.every((score) => Number.isInteger(score) && score >= 0)
      || !Number.isInteger(saved.currentPlayer) || saved.currentPlayer < 0 || saved.currentPlayer >= saved.hands.length
      || !Number.isInteger(saved.currentSuit) || saved.currentSuit < 0 || saved.currentSuit > 3
      || !Number.isInteger(saved.target) || saved.target < 1 || saved.target > 10000
      || !Number.isInteger(saved.drawCount) || saved.drawCount < 0 || saved.drawCount > 3
      || !Number.isInteger(saved.seed) || !Number.isInteger(saved.rounds) || saved.rounds < 0
      || !['playing', 'roundEnd', 'complete'].includes(saved.status)) return false;
    const cards = [...saved.hands.flat(), ...saved.stock, ...saved.discard];
    return cards.length === 52 && cards.every((card) => card && Number.isInteger(card.suit) && card.suit >= 0 && card.suit < 4
      && Number.isInteger(card.rank) && card.rank >= 1 && card.rank <= 13 && card.id === `${card.suit}-${card.rank}`)
      && new Set(cards.map(({ id }) => id)).size === 52;
  };
  function persist() {
    try { if (game) localStorage.setItem(storageKey, JSON.stringify(game)); }
    catch { storageAvailable = false; }
    q('[data-crazy-save-note]').textContent = storageAvailable ? (game ? copy.scoreSaved : '') : copy.saveUnavailable;
  }
  function hasSave() {
    try { return Boolean(localStorage.getItem(storageKey)); } catch { storageAvailable = false; return false; }
  }
  function cardButton(card, disabled = false) {
    const selected = card.id === selectedId;
    return `<button type="button" class="crazy-card${card.suit === 1 || card.suit === 2 ? ' is-red' : ''}${selected ? ' is-selected' : ''}" data-crazy-card="${escapeHtml(card.id)}" aria-label="${escapeHtml(cardLabel(card))}" aria-pressed="${selected}" ${disabled ? 'disabled' : ''}><span>${escapeHtml(copy[`rank${card.rank}`] ?? card.rank)}</span><span aria-hidden="true">${suitSymbols[card.suit]}</span></button>`;
  }
  function finishStatus() {
    if (game.status === 'roundEnd') return game.roundPoints?.[0] === 0 ? copy.roundWon : text('roundLost', { player: playerName(game.roundPoints?.indexOf(0) ?? 1) });
    if (game.status === 'complete') return game.winner === null ? copy.tied : game.winner === 0 ? copy.gameWon : text('gameLost', { player: playerName(game.winner) });
    if (game.currentPlayer === 0) return game.drawCount ? copy.yourTurnDrawn : copy.yourTurn;
    return text('cpuTurn', { player: playerName(game.currentPlayer) });
  }
  function render() {
    q('[data-crazy-status]').textContent = statusText || finishStatus();
    q('[data-crazy-match]').hidden = !game;
    q('[data-crazy-next]').hidden = game?.status !== 'roundEnd';
    q('[data-crazy-export]').disabled = !game;
    q('[data-crazy-resume]').hidden = Boolean(game);
    q('[data-crazy-delete]').disabled = !game && !hasSave();
    if (!game) return;
    const board = game.hands.map((hand, index) => `<p class="crazy-player${index === game.currentPlayer ? ' is-turn' : ''}"><span>${escapeHtml(playerName(index))}</span><span>${escapeHtml(copy.cards ?? copy.opponentCards)}: ${hand.length}</span><span>${escapeHtml(copy.score)}: ${game.scores[index]}</span></p>`).join('');
    q('[data-crazy-scoreboard]').innerHTML = `<div>${escapeHtml(copy.round)} ${game.rounds + 1}</div><div>${escapeHtml(copy.target)}: ${game.target}</div><div class="crazy-player-list">${board}</div>`;
    const disabled = game.status !== 'playing' || game.currentPlayer !== 0;
    q('[data-crazy-hand]').innerHTML = game.hands[0].map((card) => cardButton(card, disabled)).join('');
    q('[data-crazy-discard]').innerHTML = cardButton(game.discard.at(-1), true);
    q('[data-crazy-current-suit]').textContent = `${copy[`suit${game.currentSuit}`] ?? ''} ${suitSymbols[game.currentSuit]}`;
    q('[data-crazy-stock]').textContent = `${game.stock.length} · ${crazyEightsCardCount(game)}/52`;
    const selected = game.hands[0].find(({ id }) => id === selectedId);
    q('[data-crazy-selected]').textContent = selected ? `${copy.selected}: ${cardLabel(selected)}` : copy.noSelection;
    q('[data-crazy-play]').disabled = disabled || !selected || !crazyEightsLegalCards(game, 0).some(({ id }) => id === selected.id) || pendingCard !== null;
    q('[data-crazy-draw]').disabled = disabled || game.drawCount >= 3 || pendingCard !== null;
    q('[data-crazy-suit-choice]').hidden = pendingCard === null;
    q('[data-crazy-round]').hidden = !['roundEnd', 'complete'].includes(game.status);
    if (game.status !== 'playing') {
      q('[data-crazy-round-title]').textContent = game.rounds ? `${copy.roundPoints}: ${game.roundPoints.join(' · ')}` : '';
      q('[data-crazy-round-scores]').textContent = game.scores.map((score, index) => `${playerName(index)}: ${score}`).join(' · ');
    }
    persist();
  }
  function afterMove(message = '') {
    selectedId = null;
    pendingCard = null;
    statusText = message || finishStatus();
    render();
    if (game?.status === 'playing' && game.currentPlayer !== 0) scheduleCpu();
  }
  function play(card, suit = card.suit, player = 0) {
    try {
      const who = playerName(player);
      playCrazyEightsCard(game, player, card.id, CRAZY_EIGHTS_SUITS[suit]);
      const message = game.status === 'playing' ? text('played', { player: who, card: cardLabel(card) }) : '';
      afterMove(message);
    } catch { statusText = copy.invalid; render(); }
  }
  function scheduleCpu() {
    clearTimeout(cpuTimer);
    cpuTimer = setTimeout(cpuTurn, 420);
  }
  function cpuTurn() {
    if (!game || game.status !== 'playing' || game.currentPlayer === 0) return;
    const player = game.currentPlayer;
    const move = chooseCrazyEightsCpuMove(game, player);
    if (move) {
      const card = game.hands[player].find(({ id }) => id === move.cardId);
      play(card, CRAZY_EIGHTS_SUITS.indexOf(move.chosenSuit), player);
      return;
    }
    const result = drawCrazyEightsCard(game, player);
    if (result.playable) {
      play(result.card, result.card.rank === 8 ? chooseSuitForCpu(result.card, player) : result.card.suit, player);
      return;
    }
    if (result.passed) {
      afterMove(text('passed', { player: playerName(player) }));
      return;
    }
    render();
    scheduleCpu();
  }
  function chooseSuitForCpu(card, player) {
    const counts = Array(4).fill(0);
    for (const held of game.hands[player]) if (held.id !== card.id && held.rank !== 8) counts[held.suit] += 1;
    return counts.indexOf(Math.max(...counts));
  }
  q('[data-crazy-new]').addEventListener('click', () => {
    clearTimeout(cpuTimer); selectedId = null; pendingCard = null;
    game = createCrazyEightsGame({ seed: Date.now() >>> 0, players: Number(q('[data-crazy-players]').value), target: Number(q('[data-crazy-target]').value) });
    statusText = copy.started; render();
  });
  q('[data-crazy-hand]').addEventListener('click', (event) => {
    const button = event.target.closest('[data-crazy-card]');
    if (!button || game?.currentPlayer !== 0 || game.status !== 'playing') return;
    selectedId = button.dataset.crazyCard;
    q('[data-crazy-selected]').textContent = `${copy.selected}: ${cardLabel(game.hands[0].find(({ id }) => id === selectedId))}`;
    render();
  });
  q('[data-crazy-play]').addEventListener('click', () => {
    const card = game?.hands[0].find(({ id }) => id === selectedId);
    if (!card || !crazyEightsLegalCards(game, 0).some(({ id }) => id === card.id)) { statusText = copy.invalid; render(); return; }
    if (card.rank === 8) { pendingCard = card; statusText = copy.chooseSuitMessage; render(); return; }
    play(card);
  });
  q('[data-crazy-suit-choice]').addEventListener('click', (event) => {
    const button = event.target.closest('[data-crazy-suit]');
    if (!button || !pendingCard) return;
    play(pendingCard, Number(button.dataset.crazySuit));
  });
  q('[data-crazy-draw]').addEventListener('click', () => {
    if (!game || game.currentPlayer !== 0 || game.status !== 'playing') return;
    const result = drawCrazyEightsCard(game, 0);
    if (result.playable) {
      if (result.card.rank === 8) { pendingCard = result.card; statusText = copy.chooseSuitMessage; render(); return; }
      play(result.card); return;
    }
    if (result.passed) { afterMove(result.card ? copy.drawLimit : copy.noStock); return; }
    statusText = text('drawnUnplayable', { card: cardLabel(result.card) }); render();
  });
  q('[data-crazy-next]').addEventListener('click', () => {
    game = startNextCrazyEightsRound(game, (game.seed + game.rounds + 1) >>> 0);
    selectedId = null; pendingCard = null; statusText = copy.started; render();
  });
  q('[data-crazy-resume]').addEventListener('click', () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
      if (!validSave(saved)) throw new Error('invalid');
      game = saved; selectedId = null; statusText = copy.resumed; render();
      if (game.status === 'playing' && game.currentPlayer !== 0) scheduleCpu();
    } catch { statusText = localStorage.getItem(storageKey) ? copy.saveDamaged : copy.noSave; render(); }
  });
  q('[data-crazy-delete]').addEventListener('click', () => {
    clearTimeout(cpuTimer); try { localStorage.removeItem(storageKey); } catch { storageAvailable = false; } game = null; selectedId = null; pendingCard = null; statusText = copy.deleted; render();
  });
  q('[data-crazy-export]').addEventListener('click', () => {
    if (!game) return;
    const rows = [[copy.you, copy.score], ...game.scores.map((score, index) => [playerName(index), score])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'vri-atter-score.csv'; link.click(); URL.revokeObjectURL(url);
  });
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
    if (validSave(saved)) { q('[data-crazy-resume]').hidden = false; q('[data-crazy-delete]').disabled = false; }
  } catch { storageAvailable = false; }
  render();
}

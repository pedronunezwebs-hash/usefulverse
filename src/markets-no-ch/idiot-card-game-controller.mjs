import {
  arrangeIdiotCpuCards, chooseIdiotCpuAction, createIdiotGame,
  idiotLegalHandCards, idiotRankLabel, isIdiotCardPlayable, playIdiotCards,
  playIdiotTableCard, riskIdiotDraw, startIdiotGame, swapIdiotCards, takeIdiotPile,
} from './idiot-game.mjs';

const root = document.querySelector('[data-market-tool="idiotCardGame"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields ?? {};
  const q = (selector) => root.querySelector(selector);
  const storageKey = 'usefulverse.idiot-card-game.v1';
  const suitSymbol = ['♠', '♥', '♦', '♣'];
  let game = null;
  let selectedHand = new Set();
  let swapHandId = null;
  let swapVisibleIndex = null;
  let statusText = copy.ready ?? '';
  let storageAvailable = true;
  let cpuTimer = 0;

  const text = (key, values = {}) => Object.entries(values).reduce((value, [name, replacement]) => value.replaceAll(`{${name}}`, String(replacement)), copy[key] ?? key);
  const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  const playerName = (player) => player === 0 ? copy.you ?? 'You' : text('opponent', { number: player });
  const cardLabel = (card) => `${copy[`rank${card.rank}`] ?? idiotRankLabel(card.rank)} ${copy[`suit${card.suit}`] ?? ''}`;
  const validSave = (saved) => {
    if (!saved || !Array.isArray(saved.seats) || saved.seats.length < 2 || saved.seats.length > 5
      || !saved.seats.every((seat) => seat && Array.isArray(seat.hand) && Array.isArray(seat.faceUp) && Array.isArray(seat.faceDown) && typeof seat.finished === 'boolean')
      || !Array.isArray(saved.stock) || !Array.isArray(saved.discard) || !Array.isArray(saved.burned)
      || !['setup', 'playing', 'complete'].includes(saved.status)
      || saved.status === 'playing' && (!Number.isInteger(saved.currentPlayer) || saved.currentPlayer < 0 || saved.currentPlayer >= saved.seats.length)
      || !Array.isArray(saved.placements) || !Number.isInteger(saved.seed) || !Number.isInteger(saved.turns) || saved.turns < 0) return false;
    const cards = [...saved.seats.flatMap(({ hand, faceUp, faceDown }) => [...hand, ...faceUp, ...faceDown]), ...saved.stock, ...saved.discard, ...saved.burned];
    return cards.length === 52 && cards.every((card) => card && Number.isInteger(card.suit) && card.suit >= 0 && card.suit < 4
      && Number.isInteger(card.rank) && card.rank >= 2 && card.rank <= 14 && card.id === `${card.suit}-${card.rank}`)
      && new Set(cards.map(({ id }) => id)).size === 52;
  };
  function persist() {
    try { if (game) localStorage.setItem(storageKey, JSON.stringify(game)); }
    catch { storageAvailable = false; }
    q('[data-idiot-save-note]').textContent = storageAvailable ? (game ? copy.saveNote : '') : copy.saveUnavailable;
  }
  function hasSave() {
    try { return Boolean(localStorage.getItem(storageKey)); } catch { storageAvailable = false; return false; }
  }
  function buttonCard(card, selected, zone, index, disabled = false) {
    const label = zone === 'hand' || zone === 'faceUp' ? cardLabel(card) : text('hiddenCard', { number: index + 1 });
    const shown = zone === 'faceDown' ? '◆' : escapeHtml(copy[`rank${card.rank}`] ?? idiotRankLabel(card.rank));
    const suit = zone === 'faceDown' ? '●' : suitSymbol[card.suit];
    return `<button type="button" class="crazy-card${zone !== 'faceDown' && (card.suit === 1 || card.suit === 2) ? ' is-red' : ''}${selected ? ' is-selected' : ''}" data-idiot-card="${escapeHtml(card.id)}" data-idiot-zone="${zone}" data-idiot-index="${index}" aria-label="${escapeHtml(label)}" aria-pressed="${selected}" ${disabled ? 'disabled' : ''}><span>${shown}</span><span aria-hidden="true">${suit}</span></button>`;
  }
  function updateStatusAfterMove(previousPlacements) {
    if (game.status === 'complete') {
      statusText = game.idiot === 0 ? copy.gameLost : copy.gameWon;
      return;
    }
    if (game.placements.length > previousPlacements) {
      const player = game.placements.at(-1);
      statusText = player === 0 ? copy.firstOut : text('cpuFirstOut', { player: playerName(player) });
      return;
    }
    if (game.lastAction === 'burnTen') statusText = copy.burnTen;
    else if (game.lastAction === 'burnFour') statusText = copy.burnFour;
    else if (game.lastAction === 'reset') statusText = copy.resetTwo;
    else if (game.lastAction === 'takePile') statusText = copy.tookPile;
    else if (game.lastAction === 'riskFail') statusText = copy.riskFailed;
    else if (game.lastAction === 'blindFail') statusText = copy.hiddenFailed;
    else if (game.lastAction === 'tableFail') statusText = copy.visibleFailed;
    else statusText = game.currentPlayer === 0 ? copy.yourTurn : text('cpuTurn', { player: playerName(game.currentPlayer) });
  }
  function render() {
    q('[data-idiot-status]').textContent = statusText || copy.ready;
    q('[data-idiot-match]').hidden = !game || game.status === 'setup';
    q('[data-idiot-setup]').hidden = game?.status !== 'setup';
    q('[data-idiot-resume]').hidden = Boolean(game);
    q('[data-idiot-delete]').disabled = !game && !hasSave();
    q('[data-idiot-export]').disabled = !game;
    if (!game) return;
    if (game.status === 'setup') {
      const seat = game.seats[0];
      q('[data-idiot-setup-hand]').innerHTML = seat.hand.map((card, index) => buttonCard(card, card.id === swapHandId, 'setupHand', index)).join('');
      q('[data-idiot-setup-visible]').innerHTML = seat.faceUp.map((card, index) => buttonCard(card, index === swapVisibleIndex, 'setupVisible', index)).join('');
      q('[data-idiot-swap]').disabled = !swapHandId || swapVisibleIndex === null;
      q('[data-idiot-start]').disabled = false;
      q('[data-idiot-setup-selected]').textContent = swapHandId ? `${copy.selected}: ${cardLabel(seat.hand.find(({ id }) => id === swapHandId))}` : copy.setupHelp;
      persist();
      return;
    }
    const activePlayer = game.currentPlayer === 0 && game.status === 'playing';
    const seat = game.seats[0];
    const playingHand = activePlayer && seat.hand.length > 0;
    const tablePhase = activePlayer && !seat.hand.length && !game.stock.length;
    q('[data-idiot-scoreboard]').innerHTML = game.seats.map((player, index) => `<p class="crazy-player${index === game.currentPlayer ? ' is-turn' : ''}"><span>${escapeHtml(playerName(index))}${player.finished ? ` · ${escapeHtml(copy.finished)}` : ''}</span><span>${escapeHtml(copy.cards)}: ${player.hand.length + player.faceUp.length + player.faceDown.length}</span></p>`).join('');
    q('[data-idiot-hand]').innerHTML = seat.hand.map((card, index) => buttonCard(card, selectedHand.has(card.id), 'hand', index, !playingHand)).join('');
    q('[data-idiot-visible]').innerHTML = seat.faceUp.map((card, index) => buttonCard(card, false, 'faceUp', index, !tablePhase)).join('');
    q('[data-idiot-hidden]').innerHTML = seat.faceDown.map((card, index) => buttonCard(card, false, 'faceDown', index, !tablePhase || seat.faceUp.length > 0)).join('');
    const chosen = [...selectedHand].map((id) => seat.hand.find((card) => card.id === id)).filter(Boolean);
    const selectionLegal = chosen.length > 0 && chosen.every(({ rank }) => rank === chosen[0].rank) && chosen.every((card) => isIdiotCardPlayable(game, card));
    q('[data-idiot-play]').disabled = !playingHand || !selectionLegal;
    q('[data-idiot-selected]').textContent = chosen.length ? `${copy.selected}: ${chosen.map(cardLabel).join(', ')}` : '';
    q('[data-idiot-take]').disabled = !activePlayer || !game.discard.length;
    q('[data-idiot-risk]').disabled = !activePlayer || !seat.hand.length || !game.stock.length;
    q('[data-idiot-discard]').textContent = game.discard.length ? cardLabel(game.discard.at(-1)) : '—';
    q('[data-idiot-discard-count]').textContent = String(game.discard.length);
    q('[data-idiot-stock-count]').textContent = String(game.stock.length);
    q('[data-idiot-burned-count]').textContent = String(game.burned.length);
    q('[data-idiot-turn]').textContent = game.status === 'complete' ? copy.gameComplete : playerName(game.currentPlayer);
    q('[data-idiot-rule-summary]').textContent = copy.rulesSummary;
    persist();
    if (game.status === 'playing' && game.currentPlayer !== 0) scheduleCpu();
  }
  function afterMove(previousPlacements) {
    selectedHand.clear();
    updateStatusAfterMove(previousPlacements);
    render();
  }
  function playCpu() {
    if (game?.status !== 'playing' || game.currentPlayer === 0) return;
    clearTimeout(cpuTimer);
    const player = game.currentPlayer;
    const before = game.placements.length;
    const action = chooseIdiotCpuAction(game, player);
    try {
      if (action.type === 'play') playIdiotCards(game, player, action.cardIds);
      else if (action.type === 'risk') riskIdiotDraw(game, player);
      else if (action.type === 'faceUp' || action.type === 'faceDown') playIdiotTableCard(game, player, action.type, action.index);
      else takeIdiotPile(game, player);
      if (game.status === 'complete') statusText = game.idiot === 0 ? copy.gameLost : game.idiot === player ? text('cpuIdiot', { player: playerName(player) }) : copy.gameWon;
      else if (game.placements.length > before && game.placements.at(-1) === player) statusText = text('cpuFirstOut', { player: playerName(player) });
      else statusText = game.currentPlayer === player ? text('cpuTurn', { player: playerName(player) }) : game.currentPlayer === 0 ? copy.yourTurn : text('cpuTurn', { player: playerName(game.currentPlayer) });
    } catch { statusText = copy.invalid; }
    render();
  }
  function scheduleCpu() {
    clearTimeout(cpuTimer);
    cpuTimer = setTimeout(playCpu, 450);
  }

  q('[data-idiot-new]').addEventListener('click', () => {
    clearTimeout(cpuTimer);
    game = createIdiotGame({ seed: Date.now() >>> 0, players: Number(q('[data-idiot-players]').value) });
    for (let player = 1; player < game.seats.length; player += 1) arrangeIdiotCpuCards(game, player);
    selectedHand.clear(); swapHandId = null; swapVisibleIndex = null; statusText = copy.setupHelp; render();
  });
  q('[data-idiot-setup]').addEventListener('click', (event) => {
    const button = event.target.closest('[data-idiot-card]');
    if (!button) return;
    if (button.dataset.idiotZone === 'setupHand') swapHandId = button.dataset.idiotCard;
    else if (button.dataset.idiotZone === 'setupVisible') swapVisibleIndex = Number(button.dataset.idiotIndex);
    render();
  });
  q('[data-idiot-swap]').addEventListener('click', () => {
    if (!game || !swapHandId || swapVisibleIndex === null) return;
    swapIdiotCards(game, 0, swapHandId, swapVisibleIndex);
    swapHandId = null; swapVisibleIndex = null; statusText = copy.swapSaved; render();
  });
  q('[data-idiot-start]').addEventListener('click', () => {
    if (!game || game.status !== 'setup') return;
    startIdiotGame(game); statusText = game.currentPlayer === 0 ? copy.started : text('cpuTurn', { player: playerName(game.currentPlayer) }); render();
  });
  q('[data-idiot-hand]').addEventListener('click', (event) => {
    const button = event.target.closest('[data-idiot-card][data-idiot-zone="hand"]');
    if (!button || game?.currentPlayer !== 0 || game.status !== 'playing') return;
    if (selectedHand.has(button.dataset.idiotCard)) selectedHand.delete(button.dataset.idiotCard);
    else selectedHand.add(button.dataset.idiotCard);
    render();
  });
  q('[data-idiot-play]').addEventListener('click', () => {
    if (!game || !selectedHand.size) return;
    const before = game.placements.length;
    try { playIdiotCards(game, 0, [...selectedHand]); afterMove(before); }
    catch { statusText = copy.invalid; render(); }
  });
  q('[data-idiot-visible]').addEventListener('click', (event) => {
    const button = event.target.closest('[data-idiot-card][data-idiot-zone="faceUp"]');
    if (!button || game?.currentPlayer !== 0 || game.status !== 'playing') return;
    const before = game.placements.length;
    const result = playIdiotTableCard(game, 0, 'faceUp', Number(button.dataset.idiotIndex));
    statusText = result.playable ? copy.yourTurn : copy.visibleFailed;
    updateStatusAfterMove(before); render();
  });
  q('[data-idiot-hidden]').addEventListener('click', (event) => {
    const button = event.target.closest('[data-idiot-card][data-idiot-zone="faceDown"]');
    if (!button || game?.currentPlayer !== 0 || game.status !== 'playing') return;
    const before = game.placements.length;
    const result = playIdiotTableCard(game, 0, 'faceDown', Number(button.dataset.idiotIndex));
    statusText = result.playable ? copy.yourTurn : copy.hiddenFailed;
    updateStatusAfterMove(before); render();
  });
  q('[data-idiot-take]').addEventListener('click', () => {
    if (!game || game.currentPlayer !== 0 || game.status !== 'playing') return;
    const before = game.placements.length;
    try { takeIdiotPile(game, 0); afterMove(before); } catch { statusText = copy.invalid; render(); }
  });
  q('[data-idiot-risk]').addEventListener('click', () => {
    if (!game || game.currentPlayer !== 0 || game.status !== 'playing') return;
    const before = game.placements.length;
    const result = riskIdiotDraw(game, 0);
    statusText = result.playable ? copy.riskSuccess : copy.riskFailed;
    updateStatusAfterMove(before); render();
  });
  q('[data-idiot-clear]').addEventListener('click', () => { selectedHand.clear(); render(); });
  q('[data-idiot-resume]').addEventListener('click', () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
      if (!validSave(saved)) throw new Error('invalid');
      game = saved; selectedHand.clear(); statusText = copy.resumed; render();
    } catch { statusText = hasSave() ? copy.saveDamaged : (storageAvailable ? copy.noSave : copy.saveUnavailable); render(); }
  });
  q('[data-idiot-delete]').addEventListener('click', () => {
    clearTimeout(cpuTimer);
    try { localStorage.removeItem(storageKey); } catch { storageAvailable = false; }
    game = null; selectedHand.clear(); swapHandId = null; swapVisibleIndex = null; statusText = copy.deleted; render();
  });
  q('[data-idiot-export]').addEventListener('click', () => {
    if (!game) return;
    const rows = [[copy.you, copy.turn], ...game.placements.map((player, index) => [index + 1, playerName(player)]), ...(game.idiot === null ? [] : [['Idiot', playerName(game.idiot)]])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'idiot-card-game-results.csv'; link.click(); URL.revokeObjectURL(url);
  });
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
    if (validSave(saved)) { q('[data-idiot-resume]').hidden = false; q('[data-idiot-delete]').disabled = false; }
  } catch { storageAvailable = false; }
  render();
}

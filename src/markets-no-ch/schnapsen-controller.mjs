import {
  availableSchnapsenMarriage, canCloseSchnapsenTalon, canExchangeSchnapsenTrumpJack, claimSchnapsen66,
  closeSchnapsenTalon, createSchnapsenGame, declareSchnapsenMarriage, exchangeSchnapsenTrumpJack,
  legalSchnapsenCards, playSchnapsenCard, playSchnapsenCpuTurn, schnapsenCardCount,
} from './schnapsen-game.mjs';

const root = document.querySelector('[data-market-tool="schnapsen"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields ?? {};
  const q = (selector) => root.querySelector(selector);
  const storageKey = 'usefulverse.schnapsen.v1';
  const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
  const suitSymbols = ['♣', '♦', '♥', '♠'];
  const ranks = ['J', 'Q', 'K', '10', 'A'];
  let game = null; let selected = null; let cpuTimer = 0; let storageAvailable = true;
  const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

  const validCard = (card) => card && Number.isInteger(card.id) && card.id >= 0 && card.id < 20
    && card.suit === Math.floor(card.id / 5) && card.rank === card.id % 5;
  function validGame(saved) {
    if (!saved || !Array.isArray(saved.hands) || saved.hands.length !== 2 || !saved.hands.every(Array.isArray)
      || !Array.isArray(saved.stock) || !Array.isArray(saved.trick) || !Array.isArray(saved.tricks)
      || !Array.isArray(saved.points) || saved.points.length !== 2 || !saved.points.every((v) => Number.isFinite(v) && v >= 0)
      || !Array.isArray(saved.tricksWon) || saved.tricksWon.length !== 2 || !saved.tricksWon.every(Number.isInteger)
      || !Array.isArray(saved.gamePoints) || saved.gamePoints.length !== 2 || !saved.gamePoints.every((v) => Number.isInteger(v) && v >= 0 && v <= 7)
      || !Number.isInteger(saved.trumpSuit) || saved.trumpSuit < 0 || saved.trumpSuit > 3
      || !Number.isInteger(saved.toMove) || saved.toMove < 0 || saved.toMove > 1
      || !Number.isInteger(saved.dealer) || saved.dealer < 0 || saved.dealer > 1
      || !['open', 'strict', 'complete'].includes(saved.phase) || !['playing', 'handComplete', 'matchComplete'].includes(saved.status)
      || !Array.isArray(saved.pendingMarriage) || saved.pendingMarriage.length !== 2 || !saved.pendingMarriage.every(Number.isFinite)) return false;
    const trickCards = saved.trick.map((play) => play?.card);
    const wonCards = saved.tricks.flatMap((trick) => Array.isArray(trick?.plays) ? trick.plays.map((play) => play?.card) : []);
    const cards = [...saved.hands.flat(), ...trickCards, ...wonCards, ...saved.stock, ...(saved.trumpCard ? [saved.trumpCard] : [])];
    return cards.length === 20 && cards.every(validCard) && new Set(cards.map((card) => card.id)).size === 20
      && schnapsenCardCount(saved) === 20 && (!saved.pendingLead || (saved.pendingLead.seat >= 0 && saved.pendingLead.seat <= 1 && Array.isArray(saved.pendingLead.ids)));
  }
  function getSaved() {
    try { const raw = localStorage.getItem(storageKey); if (!raw) return null; const parsed = JSON.parse(raw); return validGame(parsed) ? parsed : null; }
    catch { return null; }
  }
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(game)); storageAvailable = true; }
    catch { storageAvailable = false; }
  }
  function name(seat) { return seat === 0 ? copy.you : copy.computer; }
  function cardLabel(card) { return `${copy.card} ${copy[ranks[card.rank].toLowerCase()] ?? ranks[card.rank]} ${copy[suits[card.suit]]}`; }
  function cardMarkup(card, isSelected, disabled, selector) {
    const color = card.suit === 1 || card.suit === 2 ? ' is-red' : '';
    return `<button type="button" class="schnapsen-card${color}${isSelected ? ' is-selected' : ''}" data-${selector}="${card.id}" aria-label="${escapeHtml(cardLabel(card))}" aria-pressed="${isSelected}" ${disabled ? 'disabled' : ''}><span>${ranks[card.rank]}</span><span aria-hidden="true">${suitSymbols[card.suit]}</span></button>`;
  }
  function statusForResult() {
    if (!game?.result) return '';
    if (game.result.matchWinner === 0) return copy.matchWon;
    if (game.result.matchWinner === 1) return copy.matchLost;
    const winnerText = game.result.winner === 0 ? copy.handWon : copy.handLost;
    const reason = game.result.reason === 'failed-close' ? copy.failedClose : game.result.reason === 'last-trick' ? copy.lastTrickWin : copy.claimAvailable;
    return `${winnerText} ${reason} (${game.result.gamePointsWon} ${copy.gamePoints}).`;
  }
  function render() {
    const active = Boolean(game);
    q('[data-schnapsen-match]').hidden = !active;
    q('[data-schnapsen-resume]').hidden = active || !getSaved();
    if (!active) return;
    const humanTurn = game.status === 'playing' && game.toMove === 0;
    q('[data-schnapsen-points-you]').textContent = String(game.points[0] + game.pendingMarriage[0]);
    q('[data-schnapsen-points-cpu]').textContent = String(game.points[1] + game.pendingMarriage[1]);
    q('[data-schnapsen-tricks-you]').textContent = String(game.tricksWon[0]);
    q('[data-schnapsen-tricks-cpu]').textContent = String(game.tricksWon[1]);
    q('[data-schnapsen-game-you]').textContent = String(game.gamePoints[0]);
    q('[data-schnapsen-game-cpu]').textContent = String(game.gamePoints[1]);
    q('[data-schnapsen-turn]').textContent = game.status === 'playing' ? name(game.toMove) : '—';
    q('[data-schnapsen-trump]').textContent = `${copy[suits[game.trumpSuit]]}${game.trumpCard ? ` · ${cardLabel(game.trumpCard)}` : ''}`;
    q('[data-schnapsen-talon]').textContent = String(game.stock.length + Number(Boolean(game.trumpCard)));
    q('[data-schnapsen-phase]').textContent = game.phase === 'open' ? copy.openTalon : copy.closedTalon;
    const legal = new Set(legalSchnapsenCards(game, 0).map((card) => card.id));
    const hand = q('[data-schnapsen-hand]');
    hand.innerHTML = game.hands[0].map((card) => cardMarkup(card, card.id === selected, !humanTurn || !legal.has(card.id), 'schnapsen-card')).join('');
    q('[data-schnapsen-trick]').innerHTML = game.trick.length
      ? game.trick.map(({ seat, card }) => `<div class="schnapsen-trick-card" role="listitem"><span>${escapeHtml(name(seat))}</span>${cardMarkup(card, false, true, 'schnapsen-static-card')}</div>`).join('')
      : '<p class="hint">—</p>';
    const selectedCard = game.hands[0].find((card) => card.id === selected);
    const marriageOptions = availableSchnapsenMarriage(game, 0);
    q('[data-schnapsen-selected]').textContent = selectedCard ? `${copy.chooseCard} ${cardLabel(selectedCard)}` : copy.chooseCard;
    q('[data-schnapsen-play]').disabled = !humanTurn || selected === null || !legal.has(selected);
    q('[data-schnapsen-exchange]').disabled = !canExchangeSchnapsenTrumpJack(game, 0) || Boolean(game.pendingLead);
    q('[data-schnapsen-close]').disabled = !canCloseSchnapsenTalon(game, 0) || Boolean(game.pendingLead);
    q('[data-schnapsen-marriage-field]').hidden = marriageOptions.length === 0;
    if (marriageOptions.length && !marriageOptions.some(({ suit }) => suit === Number(q('[data-schnapsen-marriage]').value))) q('[data-schnapsen-marriage]').value = String(marriageOptions[0].suit);
    q('[data-schnapsen-meld]').disabled = !humanTurn || marriageOptions.length === 0;
    const canClaim = humanTurn && (game.tricks.length > 0 || game.pendingMarriage[0] > 0) && game.points[0] + game.pendingMarriage[0] >= 66;
    q('[data-schnapsen-claim]').hidden = !canClaim;
    q('[data-schnapsen-claim]').disabled = !canClaim;
    q('[data-schnapsen-save-note]').textContent = storageAvailable ? copy.saved : copy.saveUnavailable;
    q('[data-schnapsen-result]').hidden = game.status === 'playing';
    q('[data-schnapsen-result-summary]').textContent = statusForResult();
    q('[data-schnapsen-next]').hidden = game.status === 'playing' || game.status === 'matchComplete';
    hand.querySelectorAll('[data-schnapsen-card]').forEach((button) => button.addEventListener('click', () => {
      selected = selected === Number(button.dataset.schnapsenCard) ? null : Number(button.dataset.schnapsenCard); render();
    }));
  }
  function persist(message = '') { save(); render(); if (message) q('[data-schnapsen-status]').textContent = message; }
  function scheduleCpu() {
    window.clearTimeout(cpuTimer);
    if (!game || game.status !== 'playing' || game.toMove === 0) return;
    cpuTimer = window.setTimeout(() => {
      try {
        playSchnapsenCpuTurn(game, game.toMove); selected = null;
        persist(game.status === 'playing' ? (game.toMove === 0 ? copy.yourTurn : copy.cpuTurn) : statusForResult()); scheduleCpu();
      } catch { q('[data-schnapsen-status]').textContent = copy.invalid; }
    }, 420);
  }
  function act(callback, message = '') {
    try {
      callback(); selected = null;
      persist(message || (game.status === 'playing' ? (game.toMove === 0 ? copy.yourTurn : copy.cpuTurn) : statusForResult()));
      scheduleCpu();
    }
    catch { q('[data-schnapsen-status]').textContent = copy.invalid; }
  }
  function createHand(options) {
    window.clearTimeout(cpuTimer);
    let seed; try { seed = crypto.getRandomValues(new Uint32Array(1))[0]; } catch { seed = Date.now() >>> 0; }
    game = createSchnapsenGame({ seed, ...options }); selected = null;
    persist(copy.dealStarted); scheduleCpu();
  }
  q('[data-schnapsen-new]').addEventListener('click', () => createHand({}));
  q('[data-schnapsen-resume]').addEventListener('click', () => {
    const saved = getSaved(); if (!saved) { q('[data-schnapsen-status]').textContent = copy.damagedSave; return; }
    game = saved; selected = null; persist(copy.resumed); scheduleCpu();
  });
  q('[data-schnapsen-delete]').addEventListener('click', () => {
    window.clearTimeout(cpuTimer); game = null; selected = null;
    try { localStorage.removeItem(storageKey); storageAvailable = true; } catch { storageAvailable = false; }
    render(); q('[data-schnapsen-status]').textContent = storageAvailable ? copy.deleted : copy.saveUnavailable;
  });
  q('[data-schnapsen-next]').addEventListener('click', () => createHand({ dealer: 1 - game.dealer, gamePoints: game.gamePoints }));
  q('[data-schnapsen-play]').addEventListener('click', () => act(() => {
    if (selected === null) throw new Error('Select a card.'); playSchnapsenCard(game, 0, selected);
  }));
  q('[data-schnapsen-exchange]').addEventListener('click', () => act(() => exchangeSchnapsenTrumpJack(game, 0), copy.exchangeDone));
  q('[data-schnapsen-close]').addEventListener('click', () => act(() => closeSchnapsenTalon(game, 0), copy.talonClosed));
  q('[data-schnapsen-meld]').addEventListener('click', () => act(
    () => declareSchnapsenMarriage(game, 0, Number(q('[data-schnapsen-marriage]').value)),
    copy.marriageDeclared,
  ));
  q('[data-schnapsen-claim]').addEventListener('click', () => act(() => claimSchnapsen66(game, 0), statusForResult()));
  render();
}

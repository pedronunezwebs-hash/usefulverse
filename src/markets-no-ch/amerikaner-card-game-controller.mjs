import {
  amerikanerBid, amerikanerLead, amerikanerPlay, chooseAmerikanerCpuBid,
  chooseAmerikanerCpuCard, chooseAmerikanerCpuLead, createAmerikanerGame,
  legalAmerikanerCards, amerikanerInventory,
} from './amerikaner-game.mjs';

const root = document.querySelector('[data-market-tool="amerikanerCardGame"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields ?? {};
  const q = (selector) => root.querySelector(selector);
  const storageKey = 'usefulverse.amerikaner-card-game.v1';
  const suits = ['♠', '♥', '♦', '♣'];
  const suitNames = [copy.spades, copy.hearts, copy.diamonds, copy.clubs];
  const rankNames = { 11: copy.jack, 12: copy.queen, 13: copy.king, 14: copy.ace };
  let game = null;
  let statusText = copy.ready ?? '';
  let selectedCardId = null;
  let timer = null;
  let storageAvailable = true;
  const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  const text = (key, values = {}) => Object.entries(values).reduce((value, [name, replacement]) => value.replaceAll(`{${name}}`, String(replacement)), copy[key] ?? key);
  const playerName = (id) => id === 0 ? copy.you : text('computer', { number: id });
  const cardName = ({ rank, suit }) => `${rankNames[rank] ?? rank} ${suitNames[suit]}`;
  const cardMarkup = (card, extra = '') => `<button type="button" class="crazy-card${card.suit === 1 || card.suit === 2 ? ' is-red' : ''}" data-amerikaner-card="${card.id}" aria-label="${escapeHtml(cardName(card))}" aria-pressed="${card.id === selectedCardId}" ${extra}>${rankNames[card.rank] ?? card.rank}<span aria-hidden="true">${suits[card.suit]}</span></button>`;

  function save() {
    try { if (game) localStorage.setItem(storageKey, JSON.stringify(game)); }
    catch { storageAvailable = false; }
    const note = q('[data-amerikaner-save-note]');
    if (note) note.textContent = !storageAvailable ? copy.saveUnavailable : game ? copy.saved : '';
  }

  function render() {
    q('[data-amerikaner-status]').textContent = statusText || copy.ready;
    q('[data-amerikaner-match]').hidden = !game;
    q('[data-amerikaner-resume]').hidden = Boolean(game) || !hasSave();
    q('[data-amerikaner-delete]').disabled = !game && !hasSave();
    q('[data-amerikaner-export]').disabled = !game;
    if (!game) return;

    q('[data-amerikaner-round]').textContent = String(game.round);
    q('[data-amerikaner-dealer]').textContent = playerName(game.dealer);
    q('[data-amerikaner-current-bid]').textContent = game.currentBid
      ? `${playerName(game.currentBid.playerId)} · ${game.currentBid.type === 'americaner' ? copy.callAmericaner : game.currentBid.tricks}` : '—';
    q('[data-amerikaner-scoreboard]').innerHTML = game.players.map((player) => `<p><strong>${escapeHtml(playerName(player.id))}</strong> · ${escapeHtml(copy.score)}: ${player.score} · ${escapeHtml(copy.tricks)}: ${player.tricks}${player.id === game.dealer ? ` · ${escapeHtml(copy.dealer)}` : ''}</p>`).join('');

    const humanTurn = game.turn === 0;
    const bidding = game.status === 'bidding' && humanTurn;
    const leading = game.status === 'lead' && humanTurn;
    const playing = game.status === 'playing' && humanTurn;
    q('[data-amerikaner-bid-panel]').hidden = !bidding;
    q('[data-amerikaner-lead-panel]').hidden = !leading;
    q('[data-amerikaner-play-panel]').hidden = !playing;
    q('[data-amerikaner-hand-heading]').textContent = copy.hand;
    const hand = game.players[0].hand;
    q('[data-amerikaner-hand]').innerHTML = hand.length ? hand.toSorted((a, b) => a.suit - b.suit || a.rank - b.rank).map((card) => cardMarkup(card)).join('') : '—';
    q('[data-amerikaner-hand-count]').textContent = String(hand.length);

    const min = Math.ceil(hand.length / 2);
    const bidSelect = q('[data-amerikaner-bid-number]');
    const legalNumbers = Array.from({ length: hand.length - min + 1 }, (_, index) => min + index).filter((number) => !game.currentBid || number > game.currentBid.tricks);
    bidSelect.innerHTML = legalNumbers.map((number) => `<option value="${number}">${number}</option>`).join('');
    bidSelect.disabled = legalNumbers.length === 0;
    q('[data-amerikaner-bid]').disabled = !legalNumbers.length;

    const firstRegularLead = leading && game.currentBid.type === 'tricks' && game.trickNumber === 0;
    const leadCard = hand.find(({ id }) => id === selectedCardId);
    const requested = q('[data-amerikaner-request-card]');
    const declarerCards = new Set(hand.map(({ id }) => id));
    const opponentCards = game.players.flatMap(({ hand: cards }) => cards).filter(({ id }) => !declarerCards.has(id));
    const canRequestAnyCard = hand.some((lead) => opponentCards.some((card) => card.suit === lead.suit));
    const availableRequests = leadCard ? opponentCards.filter((card) => card.suit === leadCard.suit) : [];
    q('[data-amerikaner-request-wrap]').hidden = !firstRegularLead || !canRequestAnyCard;
    q('[data-amerikaner-lead-help]').textContent = firstRegularLead && !canRequestAnyCard ? copy.noPartnerLead : firstRegularLead ? copy.leadHelp : copy.chooseLead;
    requested.innerHTML = availableRequests.map((card) => `<option value="${card.id}">${escapeHtml(cardName(card))}</option>`).join('');
    requested.disabled = !leadCard || !availableRequests.length;
    q('[data-amerikaner-confirm-lead]').disabled = !leadCard || firstRegularLead && canRequestAnyCard && !availableRequests.length;

    const legal = legalAmerikanerCards(game, 0);
    const isLegal = (id) => legal.some((card) => card.id === id);
    q('[data-amerikaner-play]').disabled = !selectedCardId || !isLegal(selectedCardId);
    q('[data-amerikaner-turn]').textContent = playerName(game.turn);
    q('[data-amerikaner-trick]').innerHTML = game.trick.length ? game.trick.map(({ playerId, card }) => `<span class="war-reveal"><strong>${escapeHtml(playerName(playerId))}</strong>${cardMarkup(card, 'disabled')}</span>`).join('') : `<p>${escapeHtml(copy.noCards)}</p>`;
    q('[data-amerikaner-trump]').textContent = game.trumpSuit === null ? copy.noTrump : suitNames[game.trumpSuit];
    q('[data-amerikaner-partner]').textContent = game.partnerId === null ? copy.unknownPartner : playerName(game.partnerId);
    q('[data-amerikaner-summary]').textContent = copy.summary;
    save();
  }

  function hasSave() { try { return Boolean(localStorage.getItem(storageKey)); } catch { storageAvailable = false; return false; } }
  function validSave(saved) {
    if (!saved || !Array.isArray(saved.players) || saved.players.length < 3 || saved.players.length > 6
      || !saved.players.every((player, id) => player?.id === id && Array.isArray(player.hand) && Number.isInteger(player.score) && Number.isInteger(player.tricks))
      || !Array.isArray(saved.captured) || !Array.isArray(saved.trick) || !Array.isArray(saved.bidOrder)
      || !['bidding', 'lead', 'playing', 'complete', 'tie'].includes(saved.status) || !Number.isInteger(saved.seed)
      || !Number.isInteger(saved.dealer) || !saved.players[saved.dealer] || !Number.isInteger(saved.turn) || !saved.players[saved.turn]) return false;
    const cards = [...saved.players.flatMap(({ hand }) => hand), ...saved.trick.map(({ card }) => card), ...saved.captured];
    return cards.length === saved.deckSize && new Set(cards.map(({ id }) => id)).size === cards.length
      && cards.every((card) => card && Number.isInteger(card.suit) && card.suit >= 0 && card.suit < 4 && Number.isInteger(card.rank) && card.rank >= 2 && card.rank <= 14 && card.id === `${card.suit}-${card.rank}`)
      && amerikanerInventory(saved) === saved.deckSize;
  }

  function updateStatus(action, actor = 0, card = null) {
    if (game.status === 'complete') statusText = text('gameWon', { player: playerName(game.winner), count: game.players[game.winner].score });
    else if (game.status === 'tie') statusText = text('tiedWinners', { players: game.winners.map(playerName).join(', '), count: Math.max(...game.players.map(({ score }) => score)) });
    else if (game.lastAction === 'allPassed') statusText = copy.allPassed;
    else if (action === 'play' && card?.id === game.requestedCardId && game.partnerId !== null) statusText = text('partnerFound', { player: playerName(game.partnerId) });
    else if (game.lastAction === 'partnerFound') statusText = text('partnerFound', { player: playerName(game.partnerId) });
    else if (game.lastAction === 'roundScored' && game.lastResult) statusText = text('roundResult', { player: playerName(game.lastResult.bidder), count: game.lastResult.tricks[game.lastResult.bidder] });
    else if (game.lastAction === 'trickWon') statusText = text('trickWon', { player: playerName(game.turn) });
    else if (action === 'pass') statusText = actor === 0 ? copy.passedYou : text('passed', { player: playerName(actor) });
    else if (action === 'bid') statusText = text('bidMade', { player: playerName(actor), count: game.currentBid?.tricks ?? '' });
    else if (action === 'americaner') statusText = text('americanerCalled', { player: playerName(actor) });
    else if (action === 'lead') statusText = actor === 0 ? copy.leadPlayed : text('partnerRequested', { player: playerName(actor) });
    else if (action === 'play') statusText = text('cardPlayed', { player: playerName(actor), card: card ? cardName(card) : '' });
  }

  function scheduleCpu() {
    if (!game || game.turn === 0 || ['complete', 'tie'].includes(game.status)) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      try {
        const actor = game.turn;
        if (game.status === 'bidding') {
          const bid = chooseAmerikanerCpuBid(game, actor);
          amerikanerBid(game, { playerId: actor, bid });
          updateStatus(bid === 'pass' ? 'pass' : bid === 'americaner' ? 'americaner' : 'bid', actor);
        } else if (game.status === 'lead') {
          const lead = chooseAmerikanerCpuLead(game, actor);
          amerikanerLead(game, { cardId: lead.card.id, requestedCardId: lead.requestedCard?.id ?? null });
          updateStatus('lead', actor);
        } else if (game.status === 'playing') {
          const played = chooseAmerikanerCpuCard(game, actor);
          amerikanerPlay(game, { playerId: actor, cardId: played.id });
          updateStatus('play', actor, played);
        }
      } catch {
        statusText = copy.saveDamaged;
      }
      render();
      scheduleCpu();
    }, 450);
  }

  q('[data-amerikaner-new]').addEventListener('click', () => {
    clearTimeout(timer); selectedCardId = null;
    game = createAmerikanerGame({ players: Number(q('[data-amerikaner-players]').value) });
    statusText = text('started'); render(); scheduleCpu();
  });
  q('[data-amerikaner-bid]').addEventListener('click', () => {
    if (!game || game.status !== 'bidding' || game.turn !== 0) return;
    const bid = q('[data-amerikaner-bid-number]').disabled ? 'pass' : Number(q('[data-amerikaner-bid-number]').value);
    amerikanerBid(game, { playerId: 0, bid });
    updateStatus(bid === 'americaner' ? 'americaner' : 'bid', 0); render(); scheduleCpu();
  });
  q('[data-amerikaner-pass]').addEventListener('click', () => {
    if (!game || game.status !== 'bidding' || game.turn !== 0) return;
    amerikanerBid(game, { playerId: 0, bid: 'pass' }); updateStatus('pass', 0); render(); scheduleCpu();
  });
  q('[data-amerikaner-call]').addEventListener('click', () => {
    if (!game || game.status !== 'bidding' || game.turn !== 0) return;
    amerikanerBid(game, { playerId: 0, bid: 'americaner' }); updateStatus('americaner', 0); render(); scheduleCpu();
  });
  q('[data-amerikaner-hand]').addEventListener('click', (event) => {
    const button = event.target.closest('[data-amerikaner-card]');
    if (!button || !game) return;
    selectedCardId = selectedCardId === button.dataset.amerikanerCard ? null : button.dataset.amerikanerCard;
    render();
  });
  q('[data-amerikaner-confirm-lead]').addEventListener('click', () => {
    const card = game?.players[0].hand.find(({ id }) => id === selectedCardId);
    if (!game || game.status !== 'lead' || game.turn !== 0 || !card) return;
    const requestedCardId = q('[data-amerikaner-request-card]').value || null;
    amerikanerLead(game, { cardId: card.id, requestedCardId });
    selectedCardId = null; updateStatus('lead', 0); render(); scheduleCpu();
  });
  q('[data-amerikaner-play]').addEventListener('click', () => {
    if (!game || game.status !== 'playing' || game.turn !== 0 || !selectedCardId) return;
    const card = game.players[0].hand.find(({ id }) => id === selectedCardId);
    if (!legalAmerikanerCards(game, 0).some(({ id }) => id === selectedCardId)) return;
    amerikanerPlay(game, { playerId: 0, cardId: selectedCardId });
    selectedCardId = null; updateStatus('play', 0, card); render(); scheduleCpu();
  });
  q('[data-amerikaner-resume]').addEventListener('click', () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
      if (!validSave(saved)) throw new Error('Invalid saved game');
      game = saved; statusText = copy.resumed; render(); scheduleCpu();
    } catch { statusText = hasSave() ? copy.saveDamaged : copy.noSave; render(); }
  });
  q('[data-amerikaner-delete]').addEventListener('click', () => {
    clearTimeout(timer); game = null; selectedCardId = null;
    try { localStorage.removeItem(storageKey); } catch { storageAvailable = false; }
    statusText = copy.deleted; render();
  });
  q('[data-amerikaner-export]').addEventListener('click', () => {
    if (!game) return;
    const rows = [[copy.player, copy.score, copy.tricks], ...game.players.map((player) => [playerName(player.id), player.score, player.tricks])];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })); link.download = `amerikaner-round-${game.round}.csv`; link.click(); URL.revokeObjectURL(link.href);
  });
  render();
}

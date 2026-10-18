import {
  announceDoppelkopf, canAnnounceDoppelkopf, createDoppelkopfGame, doppelkopfCardCount,
  legalDoppelkopfCards, playDoppelkopfCard, playDoppelkopfCpuTurn,
} from './doppelkopf-game.mjs';

const root = document.querySelector('[data-market-tool="doppelkopf"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields ?? {};
  const q = (selector) => root.querySelector(selector);
  const storageKey = 'usefulverse.doppelkopf.v1';
  const suits = ['♥', '♦', '♣', '♠'];
  const ranks = ['9', 'J', 'Q', 'K', '10', 'A'];
  const suitNames = ['hearts', 'diamonds', 'clubs', 'spades'];
  const rankNames = ['nine', 'jack', 'queen', 'king', 'ten', 'ace'];
  let game = null;
  let selectedCard = null;
  let storageAvailable = true;
  let cpuTimer = 0;

  function validCard(card) {
    return card && Number.isInteger(card.id) && Number.isInteger(card.suit) && Number.isInteger(card.rank) && Number.isInteger(card.copy)
      && card.suit >= 0 && card.suit < 4 && card.rank >= 0 && card.rank < 6 && [0, 1].includes(card.copy)
      && card.id === card.suit * 12 + card.rank * 2 + card.copy;
  }
  function validGame(saved) {
    if (!saved || !Array.isArray(saved.hands) || saved.hands.length !== 4 || !saved.hands.every(Array.isArray)
      || !Array.isArray(saved.teams) || saved.teams.length !== 4 || saved.teams.some((side) => ![null, 're', 'kontra'].includes(side))
      || !Array.isArray(saved.owners) || saved.owners.length !== 48 || saved.owners.some((seat) => !Number.isInteger(seat) || seat < 0 || seat > 3)
      || !Array.isArray(saved.scores) || saved.scores.length !== 4 || !saved.scores.every(Number.isFinite)
      || !Array.isArray(saved.trick) || saved.trick.length > 3 || !Array.isArray(saved.tricks) || saved.tricks.length > 12
      || !Number.isInteger(saved.leader) || saved.leader < 0 || saved.leader > 3 || !Number.isInteger(saved.toMove) || saved.toMove < 0 || saved.toMove > 3
      || !['play', 'complete'].includes(saved.phase) || !['playing', 'complete'].includes(saved.status)
      || !saved.pointsWon || !['re', 'kontra'].every((side) => Number.isFinite(saved.pointsWon[side]))
      || !saved.tricksWon || !['re', 'kontra'].every((side) => Number.isInteger(saved.tricksWon[side]))
      || !saved.announcements || !['re', 'kontra'].every((side) => typeof saved.announcements[side] === 'boolean')
      || !Array.isArray(saved.announcementEvents)
      || !(saved.wedding === null || (saved.wedding && Number.isInteger(saved.wedding.seat) && saved.wedding.seat >= 0 && saved.wedding.seat < 4
        && ['pending', 'partnerFound', 'diamondSolo'].includes(saved.wedding.status)
        && (saved.wedding.resolvedAt === null || Number.isInteger(saved.wedding.resolvedAt) && saved.wedding.resolvedAt >= 1 && saved.wedding.resolvedAt <= 3)))) return false;
    if (saved.trick.some((play) => !play || !Number.isInteger(play.seat) || play.seat < 0 || play.seat > 3 || !validCard(play.card))) return false;
    if (saved.tricks.some((trick) => !trick || !Array.isArray(trick.plays) || trick.plays.length !== 4
      || !Number.isInteger(trick.winner) || trick.winner < 0 || trick.winner > 3 || !Number.isInteger(trick.eyes) || trick.eyes < 0 || trick.eyes > 44
      || trick.plays.some((play) => !play || !Number.isInteger(play.seat) || play.seat < 0 || play.seat > 3 || !validCard(play.card)))) return false;
    if (saved.status === 'complete' && (!saved.result || !Array.isArray(saved.roundScore) || saved.roundScore.length !== 4 || !saved.roundScore.every(Number.isFinite))) return false;
    const physicalCards = [...saved.hands.flat(), ...saved.trick.map((play) => play.card), ...saved.tricks.flatMap((trick) => trick.plays.map((play) => play.card))];
    return physicalCards.length === 48 && physicalCards.every(validCard) && new Set(physicalCards.map((card) => card.id)).size === 48
      && doppelkopfCardCount(saved) === 48;
  }
  function getSaved() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const saved = JSON.parse(raw);
      return validGame(saved) ? saved : null;
    } catch { return null; }
  }
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(game)); storageAvailable = true; }
    catch { storageAvailable = false; }
  }
  function seatName(seat) { return seat === 0 ? (copy.you ?? 'You') : `${copy.computer ?? 'CPU'} ${seat}`; }
  function teamName(seat) { return game.teams[seat] ? copy[game.teams[seat]] : copy.unknownTeam; }
  function publicTeamName(seat) {
    if (game.status === 'complete' || seat === 0) return teamName(seat);
    const announcement = game.announcementEvents.find((event) => event.seat === seat);
    return announcement ? copy[announcement.side] : copy.unknownTeam;
  }
  function cardLabel(card) {
    const rank = copy[rankNames[card.rank]] ?? ranks[card.rank];
    const suit = copy[suitNames[card.suit]] ?? suitNames[card.suit];
    return `${copy.cardLabel ?? 'Card'} ${rank} ${suit}${card.copy ? ` · ${copy.secondCopy ?? 'second copy'}` : ''}`;
  }
  function cardMarkup(card, selected, disabled, selector) {
    const red = card.suit < 2;
    return `<button type="button" class="doko-card${red ? ' is-red' : ''}${selected ? ' is-selected' : ''}" data-${selector}="${card.id}" aria-label="${cardLabel(card)}" aria-pressed="${selected}" ${disabled ? 'disabled' : ''}><span>${ranks[card.rank]}</span><span aria-hidden="true">${suits[card.suit]}</span></button>`;
  }
  function statusText() {
    if (!game) return copy.readyStatus ?? '';
    if (game.status === 'complete') return game.result.winner === 're' ? (copy.gameWonRe ?? '') : (copy.gameWonKontra ?? '');
    if (game.toMove !== 0) return copy.cpuTurn ?? '';
    return copy.yourTurn ?? '';
  }
  function render() {
    const active = Boolean(game);
    q('[data-doko-match]').hidden = !active;
    q('[data-doko-resume]').hidden = active || !getSaved();
    if (!active) return;
    const playing = game.status === 'playing';
    q('[data-doko-status]').textContent = statusText();
    q('[data-doko-turn]').textContent = `${seatName(game.toMove)} · ${publicTeamName(game.toMove)}`;
    for (const side of ['re', 'kontra']) {
      q(`[data-doko-eyes-${side}]`).textContent = String(game.pointsWon[side]);
      q(`[data-doko-tricks-${side}]`).textContent = String(game.tricksWon[side]);
    }
    q('[data-doko-total]').textContent = String(game.scores[0]);
    const wedding = q('[data-doko-wedding]');
    wedding.hidden = !game.wedding;
    wedding.textContent = !game.wedding ? '' : game.wedding.status === 'pending' ? (copy.weddingPending ?? '')
      : game.wedding.status === 'diamondSolo' ? (copy.weddingSolo ?? '') : (copy.weddingPartner ?? '');
    q('[data-doko-announcements]').textContent = game.announcementEvents
      .map(({ seat, side }) => `${seatName(seat)}: ${side === 're' ? (copy.announcedRe ?? '') : (copy.announcedKontra ?? '')}`)
      .join(' · ');
    const handRoot = q('[data-doko-hand]');
    const playerTurn = playing && game.toMove === 0;
    const legal = playerTurn ? new Set(legalDoppelkopfCards(game.hands[0], game.trick).map(({ id }) => id)) : new Set();
    handRoot.innerHTML = game.hands[0].slice().sort((a, b) => a.suit - b.suit || a.rank - b.rank || a.copy - b.copy)
      .map((card) => cardMarkup(card, selectedCard === card.id, !playerTurn || !legal.has(card.id), 'doko-card')).join('');
    q('[data-doko-selected]').textContent = selectedCard === null ? '' : `${copy.selected ?? ''}: ${cardLabel(game.hands[0].find((card) => card.id === selectedCard) ?? { suit: 0, rank: 0, copy: 0 })}`;
    q('[data-doko-play]').disabled = !playerTurn || selectedCard === null || !legal.has(selectedCard);
    q('[data-doko-re]').disabled = !canAnnounceDoppelkopf(game, 0) || game.teams[0] !== 're';
    q('[data-doko-kontra]').disabled = !canAnnounceDoppelkopf(game, 0) || game.teams[0] !== 'kontra';
    q('[data-doko-trick]').innerHTML = game.trick.length ? game.trick.map(({ seat, card }) => `<div class="doko-trick-card" role="listitem"><span class="doko-trick-player">${seatName(seat)}</span><span class="doko-card${card.suit < 2 ? ' is-red' : ''}" aria-label="${cardLabel(card)}"><span>${ranks[card.rank]}</span><span aria-hidden="true">${suits[card.suit]}</span></span></div>`).join('') : '<p class="hint">—</p>';
    q('[data-doko-result]').hidden = game.status !== 'complete';
    q('[data-doko-save-note]').textContent = storageAvailable ? (copy.saved ?? '') : (copy.saveUnavailable ?? '');
    if (game.status === 'complete') {
      q('[data-doko-result-summary]').textContent = `${copy[game.result.winner] ?? game.result.winner} · ${game.teams.map((side, seat) => `${seatName(seat)}: ${copy[side] ?? side}`).join(' · ')}`;
      q('[data-doko-final-eyes]').textContent = `${game.result.reEyes}–${game.result.kontraEyes}`;
      q('[data-doko-round-score]').textContent = `${game.roundScore[0] >= 0 ? '+' : ''}${game.roundScore[0]} · ${copy.totalScore ?? ''}: ${game.scores[0]}`;
    }
    handRoot.querySelectorAll('[data-doko-card]').forEach((button) => button.addEventListener('click', () => {
      selectedCard = selectedCard === Number(button.dataset.dokoCard) ? null : Number(button.dataset.dokoCard);
      render();
    }));
  }
  function saveAndRender() { save(); render(); }
  function runCpu() {
    window.clearTimeout(cpuTimer);
    if (!game || game.status !== 'playing' || game.toMove === 0) return;
    cpuTimer = window.setTimeout(() => {
      game = playDoppelkopfCpuTurn(game, game.toMove);
      selectedCard = null;
      saveAndRender();
      runCpu();
    }, 360);
  }
  function act(callback) {
    try {
      callback();
      selectedCard = null;
      saveAndRender();
      runCpu();
    } catch { q('[data-doko-status]').textContent = copy.invalid ?? ''; }
  }
  q('[data-doko-new]').addEventListener('click', () => {
    window.clearTimeout(cpuTimer);
    let seed;
    try { seed = crypto.getRandomValues(new Uint32Array(1))[0]; } catch { seed = Date.now() >>> 0; }
    game = createDoppelkopfGame({ seed });
    selectedCard = null;
    saveAndRender();
    q('[data-doko-status]').textContent = copy.newDealStatus ?? '';
    runCpu();
  });
  q('[data-doko-resume]').addEventListener('click', () => {
    const saved = getSaved();
    if (!saved) { q('[data-doko-status]').textContent = copy.damagedSave ?? ''; return; }
    game = saved;
    selectedCard = null;
    render();
    q('[data-doko-status]').textContent = copy.resumed ?? '';
    runCpu();
  });
  q('[data-doko-delete]').addEventListener('click', () => {
    window.clearTimeout(cpuTimer);
    game = null;
    selectedCard = null;
    let message = copy.deleted ?? '';
    try { localStorage.removeItem(storageKey); storageAvailable = true; }
    catch { storageAvailable = false; message = copy.saveUnavailable ?? ''; }
    render();
    q('[data-doko-status]').textContent = message;
  });
  q('[data-doko-re]').addEventListener('click', () => act(() => announceDoppelkopf(game, 0)));
  q('[data-doko-kontra]').addEventListener('click', () => act(() => announceDoppelkopf(game, 0)));
  q('[data-doko-play]').addEventListener('click', () => act(() => {
    if (selectedCard === null) throw new Error('Choose a card first.');
    playDoppelkopfCard(game, 0, selectedCard);
  }));
  render();
}

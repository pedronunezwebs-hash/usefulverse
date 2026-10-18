import {
  SKAT_BIDS, bidSkat, createSkatGame, finishSkatCpuContract,
  legalSkatCards, playSkatCard, playSkatCpuAuction, playSkatCpuUntilHuman,
  selectSkatContract, skatNextBid,
} from './skat-game.mjs';

const root = document.querySelector('[data-market-tool="skat"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields ?? {};
  const q = (selector) => root.querySelector(selector);
  const storageKey = 'usefulverse.skat.v1';
  const suitSymbols = ['♥', '♦', '♣', '♠'];
  const rankFields = ['seven', 'eight', 'nine', 'jack', 'queen', 'king', 'ten', 'ace'];
  const suitFields = ['hearts', 'diamonds', 'clubs', 'spades'];
  let game = null;
  let selectedCard = null;
  let selectedDiscards = new Set();
  let storageAvailable = true;
  let cpuTimer = 0;

  function validGame(saved) {
    if (!saved || !Array.isArray(saved.hands) || saved.hands.length !== 3 || !saved.hands.every(Array.isArray)
      || !Array.isArray(saved.skat) || saved.skat.length !== 2 || !Array.isArray(saved.trick) || saved.trick.length > 2
      || !Array.isArray(saved.tricks) || !Array.isArray(saved.scores) || saved.scores.length !== 3 || !saved.scores.every(Number.isFinite)
      || !Array.isArray(saved.tricksWon) || saved.tricksWon.length !== 3 || !saved.tricksWon.every(Number.isInteger)
      || !Array.isArray(saved.pointsWon) || saved.pointsWon.length !== 3 || !saved.pointsWon.every(Number.isFinite)
      || ![0, 1, 2].includes(saved.forehand) || ![0, 1, 2].includes(saved.toMove)
      || !['auction', 'contract', 'play', 'complete', 'redeal'].includes(saved.phase)
      || !['playing', 'complete', 'redeal'].includes(saved.status)
      || !saved.auction || !(saved.auction.bid === 0 || SKAT_BIDS.includes(saved.auction.bid))
      || !(saved.auction.bidder === null || [0, 1, 2].includes(saved.auction.bidder))
      || !Array.isArray(saved.auction.passed) || new Set(saved.auction.passed).size !== saved.auction.passed.length
      || saved.auction.passed.some((seat) => ![0, 1, 2].includes(seat))) return false;
    const playedTricks = [...saved.tricks, saved.trick];
    if (saved.tricks.some((trick) => !Array.isArray(trick) || trick.length !== 3
      || trick.some((play) => !play || ![0, 1, 2].includes(play.player) || !validCard(play.card)))) return false;
    if (saved.trick.some((play) => !play || ![0, 1, 2].includes(play.player) || !validCard(play.card))) return false;
    const cards = [...saved.hands.flat(), ...saved.skat, ...playedTricks.flat().map((play) => play.card)];
    if (cards.length !== 32 || new Set(cards.map((card) => card.id)).size !== 32 || cards.some((card) => !validCard(card))) return false;
    const contractRequired = ['play', 'complete'].includes(saved.phase);
    return (!contractRequired || (saved.contract && ['suit', 'grand', 'null'].includes(saved.contract.kind)
      && typeof saved.contract.hand === 'boolean'
      && (saved.contract.kind !== 'suit' || Number.isInteger(saved.contract.suit) && saved.contract.suit >= 0 && saved.contract.suit < 4)))
      && (saved.declarer === null || [0, 1, 2].includes(saved.declarer));
  }
  function validCard(card) {
    return card && Number.isInteger(card.id) && Number.isInteger(card.suit) && Number.isInteger(card.rank)
      && card.suit >= 0 && card.suit < 4 && card.rank >= 0 && card.rank < 8 && card.id === card.suit * 8 + card.rank;
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
  function cardFace(card) {
    const ranks = ['7', '8', '9', 'J', 'Q', 'K', '10', 'A'];
    return { rank: ranks[card.rank], suit: suitSymbols[card.suit], red: card.suit < 2 };
  }
  function cardLabel(card) {
    return `${copy[rankFields[card.rank]] ?? cardFace(card).rank} ${copy[suitFields[card.suit]] ?? ''}`;
  }
  function cardMarkup(card, selected, disabled, selector) {
    const face = cardFace(card);
    const classes = `skat-card${face.red ? ' is-red' : ''}${selected ? ' is-selected' : ''}`;
    return `<button type="button" class="${classes}" data-${selector}="${card.id}" aria-label="${cardLabel(card)}" aria-pressed="${selected}" ${disabled ? 'disabled' : ''}><span>${face.rank}</span><span aria-hidden="true">${face.suit}</span></button>`;
  }
  const seatName = (seat) => seat === 0 ? (copy.you ?? 'You') : `${copy.cpu ?? 'CPU'} ${seat}`;
  function contractLabel(contract) {
    if (!contract) return '';
    const base = contract.kind === 'suit' ? (copy[ suitFields[contract.suit] ] ?? copy.suitContract) : contract.kind === 'grand' ? copy.grand : copy.nullGame;
    return `${base}${contract.hand ? ` · ${copy.handGame}` : ''}`;
  }
  function statusText() {
    if (!game) return copy.readyStatus ?? '';
    if (game.status === 'redeal') return copy.redeal ?? '';
    if (game.status === 'complete') return game.result?.won ? (game.contract.kind === 'null' ? copy.nullWon : copy.gameWon) : (game.contract.kind === 'null' ? copy.nullLost : copy.gameLost);
    if (game.phase === 'auction') return game.toMove === 0 ? (copy.yourBid ?? '') : (copy.cpuTurn ?? '');
    if (game.phase === 'contract') return game.declarer === 0 ? (copy.wonAuction ?? '') : (copy.cpuWonAuction ?? '');
    return game.toMove === 0 ? (copy.yourPlay ?? '') : (copy.cpuTurn ?? '');
  }
  function render() {
    const active = Boolean(game);
    q('[data-skat-match]').hidden = !active;
    q('[data-skat-resume]').hidden = active || !getSaved();
    if (!active) return;
    const playing = game.status === 'playing';
    q('[data-skat-status]').textContent = statusText();
    q('[data-skat-turn]').textContent = seatName(game.toMove);
    for (const seat of [0, 1, 2]) {
      const suffix = seat === 0 ? 'you' : `cpu${seat}`;
      q(`[data-skat-total-${suffix}]`).textContent = String(game.scores[seat]);
      q(`[data-skat-tricks-${suffix}]`).textContent = String(game.tricksWon[seat]);
    }
    q('[data-skat-eyes-you]').textContent = String(game.pointsWon[0]);
    q('[data-skat-auction]').hidden = game.phase !== 'auction';
    q('[data-skat-contract]').hidden = game.phase !== 'contract' || game.declarer !== 0;
    q('[data-skat-play]').hidden = game.phase !== 'play';
    q('[data-skat-result]').hidden = game.status !== 'complete';
    q('[data-skat-next]').hidden = !['complete', 'redeal'].includes(game.status);
    q('[data-skat-current-bid]').textContent = game.auction.bid ? String(game.auction.bid) : '—';
    q('[data-skat-forehand]').textContent = seatName(game.forehand);
    const nextBid = skatNextBid(game.auction.bid);
    q('[data-skat-bid]').textContent = `${copy.bidNext ?? ''}${nextBid ? ` · ${nextBid}` : ''}`;
    q('[data-skat-bid]').disabled = !playing || game.phase !== 'auction' || game.toMove !== 0 || !nextBid;
    q('[data-skat-pass]').disabled = !playing || game.phase !== 'auction' || game.toMove !== 0;
    q('#skat-kind').disabled = game.phase !== 'contract' || game.declarer !== 0;
    q('#skat-suit').disabled = game.phase !== 'contract' || game.declarer !== 0 || q('#skat-kind').value !== 'suit';
    const handContract = q('input[name="skat-play-style"]:checked')?.value === 'hand';
    const canSelectDiscards = game.phase === 'contract' && game.declarer === 0 && !handContract;
    q('[data-skat-discard-help]').hidden = game.phase !== 'contract' || game.declarer !== 0 || handContract;
    const contractCards = [...game.hands[0], ...game.skat].sort((a, b) => a.suit - b.suit || a.rank - b.rank);
    const discardRoot = q('[data-skat-discard-options]');
    discardRoot.hidden = game.phase !== 'contract' || game.declarer !== 0 || handContract;
    discardRoot.innerHTML = canSelectDiscards ? contractCards.map((card) => cardMarkup(card, selectedDiscards.has(card.id), false, 'skat-discard-card')).join('') : '';
    q('[data-skat-confirm]').disabled = !playing || game.phase !== 'contract' || game.declarer !== 0 || (!handContract && selectedDiscards.size !== 2);
    q('[data-skat-contract-label]').textContent = contractLabel(game.contract);
    const handRoot = q('[data-skat-hand]');
    const legalIds = game.phase === 'play' && game.toMove === 0 ? new Set(legalSkatCards(game.hands[0], game.trick, game.contract).map((card) => card.id)) : new Set();
    handRoot.innerHTML = game.hands[0].slice().sort((a, b) => a.suit - b.suit || a.rank - b.rank)
      .map((card) => cardMarkup(card, selectedCard === card.id, !playing || game.phase !== 'play' || game.toMove !== 0 || !legalIds.has(card.id), 'skat-card')).join('');
    q('[data-skat-play-card]').disabled = !playing || game.phase !== 'play' || game.toMove !== 0 || selectedCard === null || !legalIds.has(selectedCard);
    q('[data-skat-trick]').innerHTML = game.trick.length ? game.trick.map(({ player, card }) => `<div class="skat-trick-card"><span class="skat-trick-player">${seatName(player)}</span>${cardMarkup(card, false, true, 'skat-face')}</div>`).join('') : `<p class="hint">—</p>`;
    if (game.result) {
      const declarerName = seatName(game.result.declarer);
      const outcome = game.result.won ? (copy.gameWon ?? '') : (copy.gameLost ?? '');
      q('[data-skat-result-summary]').textContent = `${declarerName}: ${contractLabel(game.result.contract)} · ${outcome} · ${copy.eyes ?? ''}: ${game.result.declarerPoints}/120`;
      q('[data-skat-round-score]').textContent = game.roundScore.map((value, seat) => `${seatName(seat)} ${value > 0 ? '+' : ''}${value}`).join(' · ');
    }
    q('[data-skat-save-note]').textContent = storageAvailable ? (copy.saved ?? '') : (copy.saveUnavailable ?? '');
    handRoot.querySelectorAll('[data-skat-card]').forEach((button) => button.addEventListener('click', () => {
      selectedCard = Number(button.dataset.skatCard);
      render();
    }));
    discardRoot.querySelectorAll('[data-skat-discard-card]').forEach((button) => button.addEventListener('click', () => {
      const id = Number(button.dataset.skatDiscardCard);
      if (selectedDiscards.has(id)) selectedDiscards.delete(id);
      else if (selectedDiscards.size < 2) selectedDiscards.add(id);
      render();
    }));
  }
  function saveAndRender() { save(); render(); }
  function runCpu() {
    window.clearTimeout(cpuTimer);
    if (!game || game.status !== 'playing') return;
    const cpuDue = (game.phase === 'auction' && game.toMove !== 0) || (game.phase === 'contract' && game.declarer !== 0) || (game.phase === 'play' && game.toMove !== 0);
    if (!cpuDue) return;
    q('[data-skat-status]').textContent = copy.cpuTurn ?? '';
    cpuTimer = window.setTimeout(() => {
      try {
        if (game.phase === 'auction') playSkatCpuAuction(game);
        if (game.phase === 'contract' && game.declarer !== 0) finishSkatCpuContract(game, game.declarer);
        if (game.phase === 'play' && game.toMove !== 0) playSkatCpuUntilHuman(game);
        saveAndRender();
        runCpu();
      } catch { q('[data-skat-status]').textContent = copy.invalid ?? ''; }
    }, 240);
  }
  function act(action) {
    try {
      action();
      selectedCard = null;
      selectedDiscards.clear();
      saveAndRender();
      runCpu();
    } catch { q('[data-skat-status]').textContent = copy.invalid ?? ''; }
  }
  function freshDeal(scores = [0, 0, 0], forehand = null) {
    const seed = globalThis.crypto?.getRandomValues ? globalThis.crypto.getRandomValues(new Uint32Array(1))[0] : (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
    game = createSkatGame({ seed, ...(forehand === null ? {} : { forehand }), scores });
    selectedCard = null;
    selectedDiscards.clear();
    saveAndRender();
    runCpu();
  }
  q('[data-skat-new]').addEventListener('click', () => freshDeal());
  q('[data-skat-next]').addEventListener('click', () => freshDeal(game?.scores ?? [0, 0, 0], game ? (game.forehand + 1) % 3 : null));
  q('[data-skat-resume]').addEventListener('click', () => {
    const saved = getSaved();
    if (!saved) { q('[data-skat-status]').textContent = copy.saveDamaged ?? copy.invalid ?? ''; return; }
    game = saved; selectedCard = null; selectedDiscards.clear();
    q('[data-skat-status]').textContent = copy.resumed ?? '';
    render(); runCpu();
  });
  q('[data-skat-delete]').addEventListener('click', () => {
    try {
      localStorage.removeItem(storageKey);
      storageAvailable = true;
      window.clearTimeout(cpuTimer);
      game = null;
      selectedCard = null;
      selectedDiscards.clear();
      render();
      q('[data-skat-status]').textContent = copy.deleted ?? '';
    } catch {
      storageAvailable = false;
      q('[data-skat-status]').textContent = copy.saveUnavailable ?? '';
    }
  });
  q('[data-skat-bid]').addEventListener('click', () => act(() => bidSkat(game, 0, skatNextBid(game.auction.bid))));
  q('[data-skat-pass]').addEventListener('click', () => act(() => bidSkat(game, 0, null)));
  q('#skat-kind').addEventListener('change', () => { selectedDiscards.clear(); render(); });
  root.querySelectorAll('input[name="skat-play-style"]').forEach((input) => input.addEventListener('change', () => { selectedDiscards.clear(); render(); }));
  q('[data-skat-confirm]').addEventListener('click', () => act(() => selectSkatContract(game, 0, {
    kind: q('#skat-kind').value,
    suit: Number(q('#skat-suit').value),
    hand: q('input[name="skat-play-style"]:checked')?.value === 'hand',
  }, q('input[name="skat-play-style"]:checked')?.value === 'hand' ? [] : [...selectedDiscards])));
  q('[data-skat-play-card]').addEventListener('click', () => {
    if (selectedCard === null) { q('[data-skat-status]').textContent = copy.noCard ?? ''; return; }
    act(() => playSkatCard(game, 0, selectedCard));
  });
  q('#skat-kind').addEventListener('change', () => { q('#skat-suit').disabled = q('#skat-kind').value !== 'suit'; });
  render();
}

import { availableSchafkopfCalls, callSchafkopfAce, createSchafkopfGame, legalSchafkopfCards, playSchafkopfCard, playSchafkopfCpuUntilHuman, schafkopfCpuCard } from './schafkopf-game.mjs';

const root = document.querySelector('[data-market-tool="schafkopf"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields ?? {};
  const q = (selector) => root.querySelector(selector);
  const storageKey = 'usefulverse.schafkopf.v1';
  const suits = ['♣', '♠', '♥', '♦'];
  const rankNames = ['seven', 'eight', 'nine', 'ten', 'king', 'ober', 'unter', 'sau'];
  const suitNames = ['eichel', 'gras', 'heart', 'schellen'];
  let game = null; let selected = null; let timer = 0; let storageAvailable = true;
  const validCard = (item) => item && Number.isInteger(item.id) && Number.isInteger(item.suit) && Number.isInteger(item.rank)
    && item.suit >= 0 && item.suit < 4 && item.rank >= 0 && item.rank < 8 && item.id === item.suit * 8 + item.rank;
  function validSave(value) {
    if (!value || !Array.isArray(value.hands) || value.hands.length !== 4 || !value.hands.every(Array.isArray)
      || value.hands.some((hand) => hand.length > 8) || !Array.isArray(value.trick) || value.trick.length > 3
      || !Array.isArray(value.tricks) || value.tricks.some((trick) => !Array.isArray(trick) || trick.length !== 4)
      || !Array.isArray(value.pointsWon) || value.pointsWon.length !== 4 || !value.pointsWon.every(Number.isFinite)
      || !Array.isArray(value.tricksWon) || value.tricksWon.length !== 4 || !value.tricksWon.every(Number.isInteger)
      || ![0, 1, 2, 3].includes(value.toMove) || ![0, 1, 2, 3].includes(value.leader)
      || !['call', 'play', 'complete'].includes(value.phase) || !['playing', 'complete'].includes(value.status)) return false;
    const cards = [...value.hands.flat(), ...value.trick.map((play) => play.card), ...value.tricks.flat().map((play) => play.card)];
    if (cards.length !== 32 || cards.some((item) => !validCard(item)) || new Set(cards.map((item) => item.id)).size !== 32) return false;
    return value.phase === 'call' ? value.calledSuit === null : [0, 1, 3].includes(value.calledSuit) && [1, 2, 3].includes(value.partner);
  }
  function getSaved() {
    try { const value = JSON.parse(localStorage.getItem(storageKey) ?? 'null'); return validSave(value) ? value : null; }
    catch { return null; }
  }
  function save() { try { localStorage.setItem(storageKey, JSON.stringify(game)); storageAvailable = true; } catch { storageAvailable = false; } }
  function labelCard(item) { return `${copy[rankNames[item.rank]] ?? rankNames[item.rank]} ${copy[suitNames[item.suit]] ?? ''}`; }
  function cardButton(item, active, disabled) {
    const symbol = suits[item.suit]; const rank = ['7', '8', '9', '10', 'K', 'O', 'U', 'S'][item.rank];
    return `<button type="button" class="schaf-card${item.suit < 2 ? ' is-black' : ' is-red'}${active ? ' is-selected' : ''}" data-schaf-card="${item.id}" aria-label="${labelCard(item)}" aria-pressed="${active}" ${disabled ? 'disabled' : ''}><span>${rank}</span><span aria-hidden="true">${symbol}</span></button>`;
  }
  function seatLabel(seat) { return seat === 0 ? (copy.you ?? 'You') : `${copy.cpu ?? 'CPU'} ${seat}`; }
  function render() {
    const active = Boolean(game);
    q('[data-schaf-match]').hidden = !active;
    q('[data-schaf-resume]').hidden = active || !getSaved();
    if (!active) return;
    q('[data-schaf-call]').hidden = game.phase !== 'call';
    q('[data-schaf-play-area]').hidden = game.phase === 'call';
    q('[data-schaf-status]').textContent = game.phase === 'call' ? (copy.chooseAce ?? '') : game.phase === 'complete' ? copy.completed : game.toMove === 0 ? copy.yourTurn : copy.cpuTurn;
    const callRoot = q('[data-schaf-calls]');
    callRoot.innerHTML = game.phase === 'call' ? availableSchafkopfCalls(game).map((suit) => `<button type="button" data-schaf-call-suit="${suit}">${copy.callAce}: ${copy[suitNames[suit]] ?? suitNames[suit]}</button>`).join('') : '';
    q('[data-schaf-partner]').textContent = game.teamsKnown ? `${copy.partner}: ${seatLabel(game.partner)}` : (copy.unknownPartner ?? '');
    q('[data-schaf-turn]').textContent = game.phase === 'complete' ? '—' : seatLabel(game.toMove);
    for (let seat = 0; seat < 4; seat += 1) {
      q(`[data-schaf-tricks-${seat}]`).textContent = String(game.tricksWon[seat]);
      q(`[data-schaf-points-${seat}]`).textContent = String(game.pointsWon[seat]);
    }
    q('[data-schaf-current-trick]').innerHTML = game.trick.length ? game.trick.map(({ seat, card }) => `<div class="schaf-trick-card"><span>${seatLabel(seat)}</span>${cardButton(card, false, true)}</div>`).join('') : '<p class="hint">—</p>';
    const legal = game.phase === 'play' && game.toMove === 0 ? new Set(legalSchafkopfCards(game.hands[0], game.trick, game.calledSuit).map((item) => item.id)) : new Set();
    q('[data-schaf-hand]').innerHTML = game.hands[0].slice().sort((a, b) => a.suit - b.suit || a.rank - b.rank).map((item) => cardButton(item, selected === item.id, !legal.has(item.id))).join('');
    q('[data-schaf-selected]').textContent = selected === null ? '' : `${copy.selected}: ${labelCard(game.hands[0].find((item) => item.id === selected) ?? { suit: 0, rank: 0 })}`;
    q('[data-schaf-play]').disabled = game.phase !== 'play' || game.toMove !== 0 || selected === null || !legal.has(selected);
    q('[data-schaf-result]').hidden = game.phase !== 'complete';
    if (game.score) q('[data-schaf-result-summary]').textContent = `${game.score.winner === 'callers' ? copy.callerWon : copy.defendersWon} · ${copy.finalResult}: ${game.score.callerSide}–${game.score.defenderSide}`;
    q('[data-schaf-save-note]').textContent = storageAvailable ? copy.saved : copy.saveUnavailable;
    callRoot.querySelectorAll('[data-schaf-call-suit]').forEach((button) => button.addEventListener('click', () => act(() => callSchafkopfAce(game, Number(button.dataset.schafCallSuit)))));
    q('[data-schaf-hand]').querySelectorAll('[data-schaf-card]').forEach((button) => button.addEventListener('click', () => { selected = Number(button.dataset.schafCard); render(); }));
  }
  function runCpu() {
    clearTimeout(timer);
    if (!game || game.phase !== 'play' || game.toMove === 0) return;
    timer = setTimeout(() => {
      playSchafkopfCpuUntilHuman(game, 1);
      if (game.phase === 'play' && game.toMove !== 0) playSchafkopfCard(game, game.toMove, schafkopfCpuCard(game, game.toMove));
      selected = null; save(); render(); runCpu();
    }, 260);
  }
  function act(callback) { try { callback(); selected = null; save(); render(); runCpu(); } catch { q('[data-schaf-status]').textContent = copy.invalid; } }
  q('[data-schaf-new]').addEventListener('click', () => {
    clearTimeout(timer); let seed;
    try { seed = crypto.getRandomValues(new Uint32Array(1))[0]; } catch { seed = Date.now() >>> 0; }
    game = createSchafkopfGame({ seed }); selected = null; save(); render();
  });
  q('[data-schaf-resume]').addEventListener('click', () => { game = getSaved(); if (!game) { q('[data-schaf-status]').textContent = copy.damagedSave; return; } selected = null; render(); runCpu(); });
  q('[data-schaf-delete]').addEventListener('click', () => { clearTimeout(timer); game = null; selected = null; try { localStorage.removeItem(storageKey); storageAvailable = true; } catch { storageAvailable = false; } render(); q('[data-schaf-status]').textContent = copy.deleted; });
  q('[data-schaf-play]').addEventListener('click', () => act(() => { if (selected === null) throw new Error('Select a card.'); playSchafkopfCard(game, 0, selected); }));
  render();
}

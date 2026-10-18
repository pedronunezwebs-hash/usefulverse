import { chooseJassContractAction, createJassGame, isValidJassGameState, jassGameSummary, legalJassCards, playJassCard, runJassCpuAction } from './jass-game.mjs';

const root = document.querySelector('[data-market-tool="jass"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent).fields;
  const q = (selector) => root.querySelector(selector);
  const storageKey = 'usefulverse-jass-match-v1';
  const suits = { hearts: copy.suitHearts, diamonds: copy.suitDiamonds, spades: copy.suitSpades, clubs: copy.suitClubs };
  const ranks = { 6: copy.rank6, 7: copy.rank7, 8: copy.rank8, 9: copy.rank9, 10: copy.rank10, 11: copy.rank11, 12: copy.rank12, 13: copy.rank13, 14: copy.rank14 };
  const glyphs = { hearts: '♥', diamonds: '♦', spades: '♠', clubs: '♣' };
  const shortRanks = { french: { 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: 'J', 12: 'Q', 13: 'K', 14: 'A' }, german: { 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: 'U', 12: 'O', 13: 'K', 14: 'A' } };
  const contracts = { hearts: copy.hearts, diamonds: copy.diamonds, spades: copy.spades, clubs: copy.clubs, 'top-down': copy.topDown, 'bottom-up': copy.bottomUp };
  let game = null;
  let timer = null;
  let storageAvailable = true;

  function getStored() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const value = JSON.parse(raw);
      return isValidJassGameState(value) ? value : null;
    } catch { storageAvailable = false; return null; }
  }

  function persist() {
    if (!game || !storageAvailable) return;
    try { localStorage.setItem(storageKey, JSON.stringify(game)); q('[data-jass-resume]').hidden = false; }
    catch { storageAvailable = false; q('[data-jass-status]').textContent = copy.saveUnavailable; }
  }

  function seatName(seat) {
    if (seat === 0) return copy.playerYou;
    if (seat === 2) return copy.partner;
    return seat === 1 ? copy.opponentLeft : copy.opponentRight;
  }

  function cardAccessibleName(item) { return `${ranks[item.rank]} · ${suits[item.suit]}`; }

  function createCardNode(item, { selectable = false, deckStyle = game?.deckStyle ?? 'french', disabled = false } = {}) {
    const node = document.createElement(selectable ? 'button' : 'span');
    if (selectable) { node.type = 'button'; node.disabled = disabled; node.className = 'jass-card jass-card--button'; node.setAttribute('aria-label', `${copy.play ?? 'Play'} ${cardAccessibleName(item)}`); node.dataset.cardId = item.id; }
    else { node.className = 'jass-card'; node.setAttribute('aria-label', cardAccessibleName(item)); }
    const rank = document.createElement('span'); rank.className = 'jass-card__rank'; rank.textContent = shortRanks[deckStyle][item.rank];
    const suit = document.createElement('span'); suit.className = `jass-card__suit jass-card__suit--${item.suit}`; suit.setAttribute('aria-hidden', 'true'); suit.textContent = glyphs[item.suit];
    node.append(rank, suit);
    if (selectable) node.addEventListener('click', () => playCard(item.id));
    return node;
  }

  function currentActor() {
    return game?.status === 'bidding' ? game.bidder : game?.status === 'playing' ? game.turnOrder[game.nextIndex] : null;
  }

  function statusCopy() {
    if (!game) return copy.ready;
    if (game.status === 'complete') {
      const result = jassGameSummary(game);
      return result.winner === 0 ? copy.outcomeWin : result.winner === 1 ? copy.outcomeLoss : copy.outcomeDraw;
    }
    if (game.status === 'bidding') return game.bidder === 0 ? copy.chooseContract : copy.cpuThinking;
    if (currentActor() === 0) return copy.yourTurn;
    return copy.cpuThinking;
  }

  function addScoreCell(row, value, header = false) {
    const cell = document.createElement(header ? 'th' : 'td');
    if (header) cell.scope = 'col';
    cell.textContent = String(value);
    row.append(cell);
  }

  function renderScorecard() {
    const body = q('[data-jass-scorecard] tbody');
    body.replaceChildren();
    const heading = document.createElement('tr');
    for (const label of [copy.round, copy.contract, copy.teamYou, copy.teamCpu, copy.cumulative]) addScoreCell(heading, label, true);
    q('[data-jass-scorecard] thead').replaceChildren(heading);
    if (!game) return;
    let cumulative = [0, 0];
    for (const rowData of game.scorecard) {
      cumulative[0] += rowData.team0; cumulative[1] += rowData.team1;
      const row = document.createElement('tr');
      addScoreCell(row, rowData.round); addScoreCell(row, contracts[rowData.contract]);
      addScoreCell(row, rowData.team0); addScoreCell(row, rowData.team1);
      addScoreCell(row, `${cumulative[0]}–${cumulative[1]}`);
      body.append(row);
    }
  }

  function renderTrick() {
    const holder = q('[data-jass-trick]');
    holder.replaceChildren();
    if (!game?.trick.length) {
      const empty = document.createElement('p'); empty.className = 'tool-hint'; empty.textContent = copy.noCards; holder.append(empty); return;
    }
    for (const entry of game.trick) {
      const item = document.createElement('div'); item.className = 'jass-trick-card';
      const name = document.createElement('span'); name.className = 'jass-trick-card__player'; name.textContent = seatName(entry.player);
      item.append(name, createCardNode(entry.card)); holder.append(item);
    }
  }

  function render() {
    q('[data-jass-match]').hidden = !game;
    q('[data-jass-resume]').hidden = !getStored();
    q('[data-jass-status]').textContent = statusCopy();
    if (!game) return;
    q('[data-jass-round]').textContent = `${game.round} ${copy.of} 12`;
    q('[data-jass-score-you]').textContent = String(game.scores[0]);
    q('[data-jass-score-cpu]').textContent = String(game.scores[1]);
    q('[data-jass-contract]').textContent = game.contract ? contracts[game.contract] : copy.bidding;
    q('[data-jass-bidding]').hidden = !(game.status === 'bidding' && game.bidder === 0);
    q('[data-jass-pass]').hidden = game.pendingBid !== 'forehand';
    const cards = q('[data-jass-hand]'); cards.replaceChildren();
    const actor = currentActor();
    const legalIds = game.status === 'playing' && actor === 0 ? new Set(legalJassCards(game.hands[0], game.trick, game.contract).map(({ id }) => id)) : new Set();
    q('[data-jass-cards-left]').textContent = `${game.hands[0].length} ${copy.cardsRemaining}`;
    for (const item of game.hands[0]) cards.append(createCardNode(item, { selectable: true, disabled: actor !== 0 || !legalIds.has(item.id) }));
    renderTrick(); renderScorecard();
    q('[data-jass-export]').disabled = game.scorecard.length === 0;
    q('[data-jass-print]').disabled = game.scorecard.length === 0;
    q('[data-jass-save-note]').textContent = storageAvailable ? copy.privacy : copy.saveUnavailable;
  }

  function saveAndRender() { persist(); render(); scheduleCpu(); }

  function playCard(cardId) {
    if (!game || currentActor() !== 0) return;
    try { game = playJassCard(game, 0, cardId); saveAndRender(); }
    catch { q('[data-jass-status]').textContent = copy.yourTurn; }
  }

  function scheduleCpu() {
    window.clearTimeout(timer);
    const actor = currentActor();
    if (!game || game.status === 'complete' || actor === null || actor === 0) return;
    timer = window.setTimeout(() => {
      try { game = runJassCpuAction(game); persist(); render(); scheduleCpu(); }
      catch { q('[data-jass-status]').textContent = copy.cpuThinking; }
    }, 320);
  }

  q('[data-jass-start]').addEventListener('click', () => {
    window.clearTimeout(timer);
    let seed;
    try { seed = crypto.getRandomValues(new Uint32Array(1))[0]; }
    catch { seed = Date.now() >>> 0; }
    game = createJassGame({ seed, deckStyle: q('[data-jass-style]').value });
    saveAndRender();
  });
  q('[data-jass-resume]').addEventListener('click', () => {
    const saved = getStored();
    if (!saved) { q('[data-jass-status]').textContent = copy.saveFailed; q('[data-jass-resume]').hidden = true; return; }
    game = saved; render(); q('[data-jass-status]').textContent = copy.resumed; scheduleCpu();
  });
  q('[data-jass-delete]').addEventListener('click', () => {
    window.clearTimeout(timer); game = null;
    try { localStorage.removeItem(storageKey); storageAvailable = true; q('[data-jass-status]').textContent = copy.saveDeleted; }
    catch { storageAvailable = false; q('[data-jass-status]').textContent = copy.saveUnavailable; }
    render();
  });
  q('[data-jass-choose]').addEventListener('click', () => {
    if (!game || game.status !== 'bidding' || game.bidder !== 0) return;
    try { game = chooseJassContractAction(game, 0, q('[data-jass-contract-choice]').value); saveAndRender(); }
    catch { q('[data-jass-status]').textContent = copy.chooseContract; }
  });
  q('[data-jass-pass]').addEventListener('click', () => {
    if (!game || game.status !== 'bidding' || game.pendingBid !== 'forehand' || game.bidder !== 0) return;
    try { game = chooseJassContractAction(game, 0, 'pass'); saveAndRender(); }
    catch { q('[data-jass-status]').textContent = copy.chooseContract; }
  });
  q('[data-jass-export]').addEventListener('click', () => {
    if (!game?.scorecard.length) return;
    const rows = [[copy.round, copy.contract, copy.teamYou, copy.teamCpu], ...game.scorecard.map((row) => [row.round, contracts[row.contract], row.team0, row.team1])];
    const csv = `\uFEFF${rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n')}\r\n`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'schieber-jass-score.csv'; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  q('[data-jass-print]').addEventListener('click', () => { if (game?.scorecard.length) window.print(); });
  render();
}

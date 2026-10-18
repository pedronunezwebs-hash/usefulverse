import { BRIDGE_SEATS, BRIDGE_SUITS, callBridge, createBridgeGame, legalBridgeCalls, legalBridgeCards, playBridgeCard, runBridgeCpuAuction, runBridgeCpuPlay, startNextBridgeHand } from './bridge-game.mjs';

const root = document.querySelector('[data-bridge-game]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields ?? {};
  const $ = (selector) => root.querySelector(selector);
  let game = null;
  const cardRank = (rank) => rank <= 10 ? String(rank) : ({ 11: 'J', 12: 'Q', 13: 'K', 14: 'A' })[rank];
  const suitGlyph = (suit) => ({ 0: '♣', 1: '♦', 2: '♥', 3: '♠' })[suit] ?? 'NT';
  const sideName = (side) => side === 0 ? f.nsSide : f.ewSide;
  const seatName = (seat) => f[BRIDGE_SEATS[seat]] ?? BRIDGE_SEATS[seat];
  const contractName = () => game.contract ? `${game.contract.level}${game.contract.strain === 4 ? 'NT' : suitGlyph(game.contract.strain)}${game.contract.doubled === 1 ? 'X' : game.contract.doubled === 2 ? 'XX' : ''}` : '—';
  const status = (text) => { $('[data-bridge-status]').textContent = text; };
  const appendCard = (host, card, { playable = false, seat = null } = {}) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = `bridge-card bridge-card-suit-${card.suit}`;
    button.textContent = `${cardRank(card.rank)}${suitGlyph(card.suit)}`;
    button.setAttribute('aria-label', `${cardRank(card.rank)} ${f[BRIDGE_SUITS[card.suit]] ?? BRIDGE_SUITS[card.suit]}`);
    button.disabled = !playable;
    if (playable) button.addEventListener('click', () => {
      try { playBridgeCard(game, seat, card.id, 2); runBridgeCpuPlay(game, 2); render(); }
      catch { status(f.followSuit); }
    });
    host.append(button);
  };
  const render = () => {
    if (!game) return;
    $('[data-bridge-board]').hidden = false;
    $('[data-bridge-hand-number]').textContent = String(game.handNumber);
    $('[data-bridge-dealer]').textContent = seatName(game.dealer);
    $('[data-bridge-vul]').textContent = f[game.vulnerability] ?? game.vulnerability;
    $('[data-bridge-contract]').textContent = contractName();
    $('[data-bridge-declarer]').textContent = game.declarer === null ? '—' : seatName(game.declarer);
    $('[data-bridge-ns-score]').textContent = String(game.scores[0]);
    $('[data-bridge-ew-score]').textContent = String(game.scores[1]);
    $('[data-bridge-tricks-ns]').textContent = String(game.tricksWon[0]);
    $('[data-bridge-tricks-ew]').textContent = String(game.tricksWon[1]);
    const showDummy = game.openingLeadMade && game.dummy !== null;
    $('[data-bridge-dummy-note]').textContent = showDummy ? `${f.dummy}: ${seatName(game.dummy)} · ${f.declarer}: ${seatName(game.declarer)}.` : f.dummyHidden;
    for (const seat of [0, 1, 2, 3]) {
      const panel = $(`[data-bridge-seat="${seat}"] [data-bridge-hand]`);
      panel.replaceChildren();
      const visible = seat === 2 || (showDummy && seat === game.dummy);
      if (!visible) { panel.textContent = f.hiddenHand; continue; }
      const humanControls = seat === 2 || (seat === game.dummy && game.declarer === 2 && showDummy);
      const sorted = [...game.hands[seat]].sort((a, b) => b.suit - a.suit || b.rank - a.rank);
      for (const card of sorted) appendCard(panel, card, { playable: humanControls && game.phase === 'play' && game.toMove === seat && legalBridgeCards(game, seat).some(({ id }) => id === card.id), seat });
    }
    const auction = $('[data-bridge-auction]'); auction.replaceChildren();
    game.auction.forEach((call, index) => {
      const item = document.createElement('li');
      const action = call.type === 'bid' ? `${call.level}${call.strain === 4 ? 'NT' : suitGlyph(call.strain)}` : call.type === 'pass' ? f.pass : call.type === 'double' ? f.double : f.redouble;
      item.textContent = `${seatName(call.seat)}: ${action}`; item.value = index + 1; auction.append(item);
    });
    const trick = $('[data-bridge-trick]'); trick.replaceChildren();
    game.trick.forEach(({ seat, card }) => { const play = document.createElement('span'); play.className = `bridge-play bridge-card-suit-${card.suit}`; play.textContent = `${seatName(seat)} · ${cardRank(card.rank)}${suitGlyph(card.suit)}`; trick.append(play); });
    const calls = game.phase === 'auction' && game.toMove === 2 ? legalBridgeCalls(game, 2) : [];
    $('[data-bridge-call-controls]').hidden = game.phase !== 'auction' || game.toMove !== 2;
    const selectedLevel = Number($('[data-bridge-level]').value); const selectedStrain = Number($('[data-bridge-strain]').value);
    $('[data-bridge-bid]').disabled = !calls.some((call) => call.type === 'bid' && call.level === selectedLevel && call.strain === selectedStrain);
    $('[data-bridge-pass]').disabled = !calls.some((call) => call.type === 'pass');
    $('[data-bridge-double]').disabled = !calls.some((call) => call.type === 'double');
    $('[data-bridge-redouble]').disabled = !calls.some((call) => call.type === 'redouble');
    $('[data-bridge-export]').disabled = game.status !== 'complete';
    $('[data-bridge-result]').hidden = game.status !== 'complete';
    if (game.status === 'complete') {
      const result = game.result;
      $('[data-bridge-result-text]').textContent = result?.passedOut ? f.passedOut : (result?.made ? f.made : f.failed).replace('{tricks}', result.tricksMade).replace('{score}', Math.abs(result.declarerScore)).replace('{side}', sideName(game.contract.side));
      status(result?.passedOut ? f.passedOut : f.boardResult);
    } else if (game.phase === 'play') status(game.toMove === 2 || (game.toMove === game.dummy && game.declarer === 2) ? f.yourTurn : f.cpuTurn.replace('{seat}', seatName(game.toMove)));
    else status(game.phase === 'auction' && game.toMove === 2 ? f.legalCall : f.cpuTurn.replace('{seat}', seatName(game.toMove)));
  };
  const newHand = (keep = false) => {
    const vulnerability = $('[data-bridge-vulnerability]').value;
    if (keep && game?.status === 'complete') game = startNextBridgeHand(game, { vulnerability });
    else game = createBridgeGame({ seed: (crypto.getRandomValues(new Uint32Array(1))[0] || Date.now()) >>> 0, vulnerability });
    runBridgeCpuAuction(game, 2);
    if (game.phase === 'play') runBridgeCpuPlay(game, 2);
    render();
  };
  const makeCall = (type) => {
    try {
      const call = type === 'bid' ? { type, level: Number($('[data-bridge-level]').value), strain: Number($('[data-bridge-strain]').value) } : { type };
      callBridge(game, 2, call); runBridgeCpuAuction(game, 2);
      if (game.phase === 'play') runBridgeCpuPlay(game, 2);
      render();
    } catch { status(f.legalCall); }
  };
  $('[data-bridge-new]').addEventListener('click', () => newHand(false));
  $('[data-bridge-next]').addEventListener('click', () => newHand(true));
  $('[data-bridge-bid]').addEventListener('click', () => makeCall('bid'));
  for (const type of ['pass', 'double', 'redouble']) $(`[data-bridge-${type}]`).addEventListener('click', () => makeCall(type));
  for (const selector of ['[data-bridge-level]', '[data-bridge-strain]']) $(selector).addEventListener('change', render);
  $('[data-bridge-export]').addEventListener('click', () => {
    if (!game?.result) return;
    const rows = [['Hand', 'Dealer', 'Vulnerability', 'Contract', 'Declarer', 'NS tricks', 'EW tricks', 'NS score', 'EW score'], [game.handNumber, seatName(game.dealer), f[game.vulnerability] ?? game.vulnerability, contractName(), seatName(game.declarer), game.tricksWon[0], game.tricksWon[1], game.scores[0], game.scores[1]]];
    const csv = `\uFEFF${rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = `bridge-hand-${game.handNumber}.csv`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  $('[data-bridge-vulnerability]').addEventListener('change', () => { if (game) { game.vulnerability = $('[data-bridge-vulnerability]').value; render(); } });
  newHand(false);
}

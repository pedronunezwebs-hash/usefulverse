import { announce, readToolCopy } from '../controller-helpers.mjs';
import { canCribbagePlayerPlay, passCribbageMatchTurn, playCribbageComputerTurn, playCribbageMatchCard, scoreNextCribbageCount, startCribbageMatch, submitCribbageDiscards } from './game.mjs';
import { cribbagePipValue, scoreCribbageHand } from './logic.mjs';

const root = document.querySelector('[data-tool="cribbage"]');
if (root) {
  const copy = readToolCopy(root);
  const result = root.querySelector('[data-result]');
  const total = root.querySelector('[data-total]');
  const breakdown = root.querySelector('[data-breakdown]');
  const matchBoard = root.querySelector('[data-match-board]');
  const matchStatus = root.querySelector('[data-match-status]');
  const playerHand = root.querySelector('[data-match-hand]');
  const computerHand = root.querySelector('[data-computer-hand]');
  const scoreLabels = ['fifteens', 'pairs', 'runs', 'flush', 'nobs'];
  const labels = Object.fromEntries(scoreLabels.map((key) => [key, copy.fields[key] ?? key]));
  const selectedDiscards = new Set();
  let match = null;

  function rankText(rank) {
    return rank === 1 ? copy.fields.ace : rank === 11 ? copy.fields.jack : rank === 12 ? copy.fields.queen : rank === 13 ? copy.fields.king : String(rank);
  }
  function cardText(card) { return `${rankText(card.rank)} ${copy.fields[card.suit]}`; }
  function fill(template, values) {
    return Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, String(value)), template);
  }
  function setStatus(message, kind = 'info') {
    matchStatus.textContent = message;
    announce(root, message, kind);
  }
  function clearMatch() {
    match = null;
    selectedDiscards.clear();
    matchBoard.hidden = true;
    root.querySelector('[data-action="start-match"]').hidden = false;
    root.querySelector('[data-action="new-match"]').hidden = true;
    setStatus('');
  }
  function drawCardButtons(container, cards, mode, player = 0) {
    container.replaceChildren();
    cards.forEach((card, index) => {
      if (mode === 'computer') {
        const back = document.createElement('span');
        back.className = 'cribbage-match__card cribbage-match__card--back';
        back.textContent = '◆';
        back.setAttribute('aria-label', copy.fields.hiddenCard ?? copy.fields.computerCards);
        container.append(back);
        return;
      }
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cribbage-match__card';
      button.textContent = cardText(card);
      button.setAttribute('aria-label', cardText(card));
      if (mode === 'discard') {
        button.setAttribute('aria-pressed', String(selectedDiscards.has(index)));
        button.addEventListener('click', () => {
          if (selectedDiscards.has(index)) selectedDiscards.delete(index);
          else if (selectedDiscards.size < 2) selectedDiscards.add(index);
          renderMatch();
        });
      } else {
        const legal = player === 0 && match.currentPlayer === 0 && match.phase === 'pegging' && !match.passed[0] && match.count + cribbagePipValue(card.rank) <= 31;
        button.disabled = !legal;
        button.addEventListener('click', () => { if (legal) takePlayerTurn(() => playCribbageMatchCard(match, index)); });
      }
      container.append(button);
    });
  }
  function finishCount() {
    const previousHistoryLength = match?.scoreHistory.length ?? 0;
    while (match?.phase === 'count') match = scoreNextCribbageCount(match);
    const last = match?.lastScoring;
    const roundEvents = match?.scoreHistory.slice(previousHistoryLength) ?? [];
    if (match?.phase === 'finished') {
      setStatus(fill(copy.messages.matchWon, { who: match.winner === 0 ? copy.fields.you : copy.fields.computer, points: match.scores[match.winner] }), 'success');
    } else if (last) {
      setStatus(fill(copy.messages.handCount, { who: last.player === 0 ? copy.fields.you : copy.fields.computer, points: last.total, kind: last.phase === 'crib' ? copy.fields.crib : copy.fields.hand }), 'success');
    } else {
      const summaries = roundEvents.map((entry) => fill(copy.messages.handCount, { who: entry.player === 0 ? copy.fields.you : copy.fields.computer, points: entry.points, kind: entry.phase === 'crib' ? copy.fields.crib : copy.fields.hand }));
      setStatus(summaries.length ? summaries.join(' ') : copy.messages.roundReady, 'success');
    }
  }
  function playComputerTurns() {
    let guard = 0;
    while (match?.phase === 'pegging' && match.currentPlayer === 1 && guard < 8) {
      match = playCribbageComputerTurn(match);
      guard += 1;
    }
    if (match?.phase === 'count') finishCount();
  }
  function renderMatch() {
    if (!match) return;
    matchBoard.hidden = false;
    root.querySelector('[data-action="start-match"]').hidden = true;
    root.querySelector('[data-action="new-match"]').hidden = match.phase !== 'finished';
    root.querySelector('[data-player-score]').textContent = String(match.scores[0]);
    root.querySelector('[data-computer-score]').textContent = String(match.scores[1]);
    root.querySelector('[data-dealer]').textContent = match.dealer === 0 ? copy.fields.you : copy.fields.computer;
    root.querySelector('[data-starter]').textContent = cardText(match.starter);
    root.querySelector('[data-pegging-count]').textContent = String(match.count ?? 0);
    root.querySelector('[data-turn]').textContent = match.phase === 'pegging' ? (match.currentPlayer === 0 ? copy.fields.you : copy.fields.computer) : match.phase === 'discard' ? copy.fields.you : match.phase;
    const instruction = root.querySelector('[data-phase-instruction]');
    instruction.textContent = match.phase === 'discard' ? copy.fields.selectDiscards : match.phase === 'pegging' ? (match.currentPlayer === 0 ? copy.messages.playerPegging : copy.messages.computerPegging) : match.phase === 'count' ? copy.messages.handCount : fill(copy.messages.matchWon, { who: match.winner === 0 ? copy.fields.you : copy.fields.computer, points: match.scores[match.winner] });
    const discardMode = match.phase === 'discard';
    drawCardButtons(playerHand, match.hands[0], discardMode ? 'discard' : 'play');
    drawCardButtons(computerHand, match.hands[1], 'computer', 1);
    const sendDiscards = root.querySelector('[data-action="send-discards"]');
    const sayGo = root.querySelector('[data-action="say-go"]');
    sendDiscards.hidden = !discardMode;
    sendDiscards.disabled = selectedDiscards.size !== 2;
    sayGo.hidden = match.phase !== 'pegging';
    sayGo.disabled = match.currentPlayer !== 0 || canCribbagePlayerPlay(match, 0);
  }
  function takePlayerTurn(action) {
    try {
      match = action();
      renderMatch();
      if (match.phase === 'pegging' && match.currentPlayer === 1) playComputerTurns();
      else if (match.phase === 'count') finishCount();
      renderMatch();
    } catch {
      setStatus(copy.messages.invalidMove, 'error');
    }
  }

  root.querySelector('[data-action="score-hand"]').addEventListener('click', () => {
    const cards = [...root.querySelectorAll('.cribbage-card')].slice(0, 4).map((item) => ({ rank: Number(item.querySelector('[data-rank]').value), suit: item.querySelector('[data-suit]').value }));
    const starterItem = root.querySelectorAll('.cribbage-card')[4];
    const starter = { rank: Number(starterItem.querySelector('[data-rank]').value), suit: starterItem.querySelector('[data-suit]').value };
    try {
      const score = scoreCribbageHand(cards, starter, { crib: root.querySelector('[data-mode]').value === 'crib' });
      total.textContent = copy.messages.scored.replace('{total}', String(score.total));
      breakdown.replaceChildren();
      for (const key of scoreLabels) {
        const term = document.createElement('dt');
        const value = document.createElement('dd');
        term.textContent = labels[key];
        value.textContent = String(score[key]);
        breakdown.append(term, value);
      }
      result.hidden = false;
      announce(root, total.textContent, 'success');
    } catch {
      result.hidden = true;
      announce(root, copy.messages.invalidCards, 'error');
    }
  });

  root.querySelector('[data-action="start-match"]').addEventListener('click', () => {
    const target = Number(root.querySelector('[data-target]').value);
    try {
      match = startCribbageMatch({ targetScore: target });
      selectedDiscards.clear();
      setStatus(match.heels ? copy.messages.heels : copy.messages.matchStarted, 'success');
      renderMatch();
    } catch { setStatus(copy.messages.invalidMove, 'error'); }
  });
  root.querySelector('[data-action="send-discards"]').addEventListener('click', () => {
    if (selectedDiscards.size !== 2) { setStatus(copy.messages.selectTwo, 'error'); return; }
    try {
      match = submitCribbageDiscards(match, [...selectedDiscards]);
      selectedDiscards.clear();
      renderMatch();
      if (match.phase === 'pegging' && match.currentPlayer === 1) playComputerTurns();
      if (match.phase === 'count') finishCount();
      renderMatch();
    } catch { setStatus(copy.messages.invalidMove, 'error'); }
  });
  root.querySelector('[data-action="say-go"]').addEventListener('click', () => takePlayerTurn(() => passCribbageMatchTurn(match)));
  root.querySelector('[data-action="new-match"]').addEventListener('click', () => {
    const target = Number(root.querySelector('[data-target]').value);
    try {
      match = startCribbageMatch({ targetScore: target });
      selectedDiscards.clear();
      setStatus(match.heels ? copy.messages.heels : copy.messages.matchStarted, 'success');
      renderMatch();
    } catch { setStatus(copy.messages.invalidMove, 'error'); }
  });
  root.querySelector('[data-action="reset"]').addEventListener('click', () => {
    root.querySelectorAll('.cribbage-card').forEach((item, index) => { item.querySelector('[data-rank]').value = String(index < 4 ? index + 1 : 5); item.querySelector('[data-suit]').value = 'clubs'; });
    root.querySelector('[data-mode]').value = 'hand';
    result.hidden = true;
    clearMatch();
    announce(root, '', 'info');
  });
}

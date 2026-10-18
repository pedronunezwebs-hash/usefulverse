import { createBlackjackGame, doubleBlackjack, getBlackjackState, hitBlackjack, splitBlackjack, standBlackjack, startBlackjackRound } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="blackjack-game"]');
if (root) {
  const copy = readToolCopy(root); const playerHands = root.querySelector('[data-player-hands]'); const dealerHand = root.querySelector('[data-dealer-hand]'); let game = createBlackjackGame();
  function cardNode(card, hidden = false) { const item = document.createElement('li'); item.className = 'blackjack-game__card' + (hidden ? ' is-hidden' : ''); if (!hidden) item.dataset.suit = card.suit; item.setAttribute('aria-label', hidden ? copy.fields.hidden : card.rank + ' ' + copy.fields['suit_' + card.suit]); item.textContent = hidden ? '◆' : card.rank + (card.suit === 'hearts' ? ' ♥' : card.suit === 'diamonds' ? ' ♦' : card.suit === 'clubs' ? ' ♣' : ' ♠'); return item; }
  function render(message = copy.messages.ready) {
    const state = getBlackjackState(game); dealerHand.replaceChildren(...state.dealer.map((card) => cardNode(card, false)), ...Array.from({ length: state.hiddenDealerCards }, () => cardNode(null, true)));
    playerHands.replaceChildren(...state.hands.map((hand, index) => { const section = document.createElement('section'); const heading = document.createElement('h3'); heading.textContent = `${copy.fields.hand} ${index + 1} · ${hand.value.total}`; const list = document.createElement('ul'); list.className = 'blackjack-game__hand'; list.setAttribute('aria-label', `${copy.fields.player} ${index + 1}`); list.dataset.active = String(index === state.activeHandIndex && state.phase === 'player'); list.append(...hand.cards.map((card) => cardNode(card))); section.append(heading, list); return section; }));
    root.querySelector('[data-player-value]').textContent = String(state.playerValue?.total ?? 0);
    root.querySelector('[data-dealer-value]').textContent = state.dealerValue ? String(state.dealerValue.total) : '—';
    root.querySelector('[data-remaining]').textContent = String(state.remainingCards);
    for (const key of ['rounds', 'wins', 'losses', 'pushes']) root.querySelector('[data-' + key + ']').textContent = String(state.stats[key]);
    root.querySelector('[data-action="hit"]').disabled = state.phase !== 'player'; root.querySelector('[data-action="stand"]').disabled = state.phase !== 'player';
    root.querySelector('[data-action="double"]').disabled = !state.canDouble; root.querySelector('[data-action="split"]').disabled = !state.canSplit;
    root.querySelector('[data-status]').textContent = message;
  }
  function outcomeMessage() { if (game.outcome === 'player-wins') return copy.messages.playerWins; if (game.outcome === 'dealer-wins') return copy.messages.dealerWins; return copy.messages.push; }
  root.querySelector('[data-action="new-round"]').addEventListener('click', () => { startBlackjackRound(game); render(game.phase === 'finished' ? outcomeMessage() : copy.messages.playerTurn); });
  root.querySelector('[data-action="hit"]').addEventListener('click', () => { const result = hitBlackjack(game); render(game.phase === 'finished' ? outcomeMessage() : copy.messages.playerTurn); if (!result.ok) announce(root, copy.messages.playerTurn, 'error'); });
  root.querySelector('[data-action="stand"]').addEventListener('click', () => { const result = standBlackjack(game); render(result.ok ? outcomeMessage() : copy.messages.playerTurn); });
  root.querySelector('[data-action="double"]').addEventListener('click', () => { const result = doubleBlackjack(game); render(result.ok ? (game.phase === 'finished' ? outcomeMessage() : copy.messages.playerTurn) : copy.messages.invalidDouble); });
  root.querySelector('[data-action="split"]').addEventListener('click', () => { const result = splitBlackjack(game); render(result.ok ? (game.phase === 'finished' ? outcomeMessage() : copy.messages.splitReady) : copy.messages.invalidSplit); });
  render();
}

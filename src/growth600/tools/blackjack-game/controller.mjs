import { announce } from '../controller-helpers.mjs';
import { canDoubleBlackjackHand, canSplitBlackjackHand, createBlackjackGame, doubleBlackjackHand, hitBlackjackHand, scoreBlackjackHand, splitBlackjackHand, standBlackjackHand, startNextBlackjackRound } from './logic.mjs';

const root = document.querySelector('[data-tool="blackjack-game"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
  const form = root.querySelector('#tool-form');
  const table = root.querySelector('[data-blackjack-table]');
  const dealer = root.querySelector('[data-blackjack-dealer]');
  const dealerTotal = root.querySelector('[data-blackjack-dealer-total]');
  const players = root.querySelector('[data-blackjack-players]');
  const stats = root.querySelector('[data-blackjack-stats]');
  const status = root.querySelector('[data-blackjack-status]');
  let game = null;

  function say(message, kind = '') { status.textContent = message; announce(root, message, kind); }
  function format(template, values = {}) { return template.replace(/\{(\w+)\}/gu, (_, key) => String(values[key] ?? '')); }
  function rankName(card) {
    if (card.rank === 1) return copy.fields.ace;
    if (card.rank === 11) return copy.fields.jack;
    if (card.rank === 12) return copy.fields.queen;
    if (card.rank === 13) return copy.fields.king;
    return String(card.rank);
  }
  function suitSymbol(suit) { return ({ spades: '♠', hearts: '♥', diamonds: '♦', clubs: '♣' })[suit]; }
  function cardNode(card, hidden = false) {
    const node = document.createElement('span');
    node.className = `blackjack-game__card${hidden ? ' blackjack-game__card--hidden' : ''}${!hidden && ['hearts', 'diamonds'].includes(card.suit) ? ' blackjack-game__card--red' : ''}`;
    if (hidden) { node.textContent = '◆'; node.setAttribute('aria-label', copy.fields.hiddenCard); }
    else {
      node.textContent = `${rankName(card)}${suitSymbol(card.suit)}`;
      node.setAttribute('aria-label', format(copy.fields.cardDescription, { rank: rankName(card), suit: copy.fields[card.suit] }));
    }
    return node;
  }
  function scoreLabel(cards) {
    const score = scoreBlackjackHand(cards);
    if (score.bust) return `${copy.fields.total}: ${score.total} · ${copy.fields.bust}`;
    return `${copy.fields.total}: ${score.total}${score.soft ? ` · ${copy.fields.soft}` : ''}${score.blackjack ? ` · ${copy.fields.blackjack}` : ''}`;
  }
  function resultMessage() {
    if (game.results.length === 1 && game.results[0] === 'natural') return copy.messages.natural;
    if (game.results.length === 1 && game.results[0] === 'loss' && scoreBlackjackHand(game.dealerCards).blackjack) return copy.messages.dealerNatural;
    if (game.results.length === 1 && game.results[0] === 'push' && scoreBlackjackHand(game.dealerCards).blackjack) return copy.messages.naturalPush;
    const summaries = game.results.map((result) => copy.messages[result === 'natural' ? 'natural' : result]);
    if (game.playerHands.some((hand) => scoreBlackjackHand(hand.cards).bust)) return `${copy.messages.bust} ${summaries.join(' ')}`;
    if (scoreBlackjackHand(game.dealerCards).bust) return copy.messages.dealerBust;
    if (game.results.length === 1) return copy.messages[game.results[0]];
    return summaries.join(' ');
  }
  function render() {
    if (!game) return;
    table.hidden = false;
    dealer.replaceChildren(...game.dealerCards.map((card, index) => cardNode(card, Boolean(game.dealerHidden && index === 1))));
    const upCard = game.dealerCards[0];
    dealerTotal.textContent = game.dealerHidden ? `${copy.fields.total}: ${scoreBlackjackHand([upCard]).total} · ${copy.fields.hiddenCard}` : scoreLabel(game.dealerCards);
    players.replaceChildren();
    game.playerHands.forEach((hand, index) => {
      const section = document.createElement('section'); section.className = 'blackjack-game__hand';
      const heading = document.createElement('h3'); heading.textContent = `${copy.fields.player} ${index + 1}`; section.append(heading);
      const cards = document.createElement('div'); cards.className = 'blackjack-game__cards'; cards.setAttribute('role', 'group'); cards.setAttribute('aria-label', heading.textContent);
      for (const card of hand.cards) cards.append(cardNode(card));
      section.append(cards);
      const score = document.createElement('p'); score.textContent = scoreLabel(hand.cards); section.append(score);
      if (game.phase === 'complete') { const outcome = document.createElement('p'); outcome.className = 'blackjack-game__outcome'; outcome.textContent = copy.messages[game.results[index] === 'natural' ? 'natural' : game.results[index]]; section.append(outcome); }
      if (game.phase === 'player' && game.currentHand === index) section.setAttribute('aria-current', 'true');
      players.append(section);
    });
    stats.textContent = `${copy.fields.wins}: ${game.stats.wins} · ${copy.fields.losses}: ${game.stats.losses} · ${copy.fields.pushes}: ${game.stats.pushes}`;
    const active = game.phase === 'player';
    for (const action of ['hit', 'stand']) form.querySelector(`[data-action="${action}"]`).disabled = !active;
    form.querySelector('[data-action="double"]').disabled = !canDoubleBlackjackHand(game);
    form.querySelector('[data-action="split"]').disabled = !canSplitBlackjackHand(game);
    form.querySelector('[data-action="nextRound"]').disabled = game.phase !== 'complete';
    form.querySelector('[data-action="start"]').disabled = true;
    if (game.phase === 'player') say(`${copy.messages.yourTurn} ${game.playerHands.length > 1 ? `${copy.fields.player} ${game.currentHand + 1}.` : ''}`);
    else if (game.phase === 'complete') say(resultMessage(), game.results.every((result) => result === 'loss') ? 'error' : 'success');
  }
  function settings() { return { decks: Number(form.elements.namedItem('decks').value), hitSoft17: form.elements.namedItem('hitSoft17').checked }; }
  function startNewShoe() { game = createBlackjackGame(settings()); render(); say(copy.messages.shoeStarted, 'success'); }
  function action(name) {
    try {
      if (name === 'start') {
        if (game) { say(game.phase === 'player' ? copy.messages.yourTurn : copy.messages.noRound); return; }
        game = createBlackjackGame(settings());
        render();
        if (game.phase === 'player') say(copy.messages.handStarted, 'success');
      } else if (name === 'newShoe') startNewShoe();
      else if (name === 'nextRound') { game = startNextBlackjackRound(game); render(); if (game.phase === 'player') say(copy.messages.handStarted, 'success'); }
      else if (name === 'hit') game = hitBlackjackHand(game);
      else if (name === 'stand') game = standBlackjackHand(game);
      else if (name === 'double') game = doubleBlackjackHand(game);
      else if (name === 'split') game = splitBlackjackHand(game);
      render();
    } catch { say(copy.messages.checkInputs, 'error'); }
  }
  root.addEventListener('click', (event) => {
    const name = event.target.closest('[data-action]')?.dataset.action;
    if (name) action(name);
  });
  form.addEventListener('change', (event) => {
    if (['decks', 'hitSoft17'].includes(event.target.name) && game?.phase === 'player') say(copy.messages.yourTurn);
  });
  say(copy.messages.noRound);
}

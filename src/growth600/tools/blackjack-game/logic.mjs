const RANKS = Object.freeze(['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']);
const SUITS = Object.freeze(['spades', 'hearts', 'diamonds', 'clubs']);

function randomValue(random) {
  if (typeof random !== 'function') throw new TypeError('A random-number function is required.');
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random values must be from 0 inclusive to 1 exclusive.');
  return value;
}
function shuffle(cards, random) {
  const deck = [...cards];
  for (let i = deck.length - 1; i > 0; i -= 1) { const j = Math.floor(randomValue(random) * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
  return deck;
}
export function blackjackHandValue(cards) {
  let total = 0; let aces = 0;
  for (const card of cards) { total += card.rank === 'A' ? 11 : ['K', 'Q', 'J'].includes(card.rank) ? 10 : Number(card.rank); if (card.rank === 'A') aces += 1; }
  while (total > 21 && aces > 0) { total -= 10; aces -= 1; }
  return Object.freeze({ total, soft: aces > 0 });
}
function handOutcome(playerCards, dealerCards) {
  const player = blackjackHandValue(playerCards).total; const dealer = blackjackHandValue(dealerCards).total;
  return player > 21 ? 'dealer-wins' : dealer > 21 || player > dealer ? 'player-wins' : dealer > player ? 'dealer-wins' : 'push';
}
function settle(round) {
  round.handOutcomes = round.hands.map((hand) => handOutcome(hand, round.dealer));
  const balance = round.handOutcomes.reduce((sum, result) => sum + (result === 'player-wins' ? 1 : result === 'dealer-wins' ? -1 : 0), 0);
  round.phase = 'finished'; round.outcome = balance > 0 ? 'player-wins' : balance < 0 ? 'dealer-wins' : 'push';
  round.stats.rounds += 1; if (round.outcome === 'player-wins') round.stats.wins += 1; else if (round.outcome === 'dealer-wins') round.stats.losses += 1; else round.stats.pushes += 1;
  return round.outcome;
}
function playDealer(round) {
  round.phase = 'dealer';
  while (blackjackHandValue(round.dealer).total < 17) { const next = round.drawPile.pop(); if (!next) break; round.dealer.push(next); }
  return settle(round);
}
function completeHand(round) {
  round.handDone[round.activeHandIndex] = true;
  for (let index = round.activeHandIndex + 1; index < round.hands.length; index += 1) {
    if (!round.handDone[index]) { round.activeHandIndex = index; return; }
  }
  playDealer(round);
}
function skipAutomaticTwentyOnes(round) {
  while (round.phase === 'player' && blackjackHandValue(round.player).total === 21) completeHand(round);
}
export function createBlackjackGame({ random = Math.random } = {}) {
  randomValue(random);
  const game = { drawPile: [], hands: [], handDone: [], handOutcomes: [], activeHandIndex: 0, splitUsed: false, dealer: [], phase: 'ready', outcome: '', stats: { rounds: 0, wins: 0, losses: 0, pushes: 0 }, random };
  Object.defineProperty(game, 'player', {
    enumerable: true,
    get() { return this.hands[this.activeHandIndex] ?? []; },
    set(cards) { this.hands[this.activeHandIndex] = cards; this.handDone[this.activeHandIndex] = false; },
  });
  return game;
}
export function startBlackjackRound(game) {
  if (!game || typeof game.random !== 'function') throw new TypeError('Invalid blackjack game.');
  const deck = shuffle(SUITS.flatMap((suit) => RANKS.map((rank) => Object.freeze({ rank, suit, id: rank + '-' + suit }))), game.random);
  game.hands = [[deck.pop(), deck.pop()]]; game.handDone = [false]; game.handOutcomes = []; game.activeHandIndex = 0;
  game.dealer = [deck.pop(), deck.pop()]; game.drawPile = deck; game.splitUsed = false; game.outcome = ''; game.phase = 'player';
  const playerNatural = blackjackHandValue(game.player).total === 21; const dealerNatural = blackjackHandValue(game.dealer).total === 21;
  if (playerNatural || dealerNatural) { game.handDone[0] = true; if (playerNatural && !dealerNatural) game.handOutcomes = ['player-wins']; else if (!playerNatural && dealerNatural) game.handOutcomes = ['dealer-wins']; else game.handOutcomes = ['push']; game.phase = 'finished'; game.outcome = game.handOutcomes[0]; game.stats.rounds += 1; if (game.outcome === 'player-wins') game.stats.wins += 1; else if (game.outcome === 'dealer-wins') game.stats.losses += 1; else game.stats.pushes += 1; }
  return getBlackjackState(game);
}
export function hitBlackjack(game) {
  if (!game || game.phase !== 'player') return Object.freeze({ ok: false, reason: 'not-player-turn' });
  const card = game.drawPile.pop(); if (!card) return Object.freeze({ ok: false, reason: 'deck-empty' });
  game.player.push(card);
  if (blackjackHandValue(game.player).total >= 21) completeHand(game);
  return Object.freeze({ ok: true, card, state: getBlackjackState(game) });
}
export function doubleBlackjack(game) {
  if (!game || game.phase !== 'player') return Object.freeze({ ok: false, reason: 'not-player-turn' });
  if (game.player.length !== 2) return Object.freeze({ ok: false, reason: 'double-requires-two-cards' });
  const card = game.drawPile.pop(); if (!card) return Object.freeze({ ok: false, reason: 'deck-empty' });
  game.player.push(card); completeHand(game);
  return Object.freeze({ ok: true, card, state: getBlackjackState(game) });
}
export function splitBlackjack(game) {
  if (!game || game.phase !== 'player') return Object.freeze({ ok: false, reason: 'not-player-turn' });
  const hand = game.player;
  if (game.splitUsed || game.hands.length !== 1 || hand.length !== 2 || hand[0].rank !== hand[1].rank) return Object.freeze({ ok: false, reason: 'split-unavailable' });
  if (game.drawPile.length < 2) return Object.freeze({ ok: false, reason: 'deck-empty' });
  const [first, second] = hand; game.hands = [[first, game.drawPile.pop()], [second, game.drawPile.pop()]];
  game.handDone = [false, false]; game.handOutcomes = []; game.activeHandIndex = 0; game.splitUsed = true;
  skipAutomaticTwentyOnes(game);
  return Object.freeze({ ok: true, state: getBlackjackState(game) });
}
export function standBlackjack(game) {
  if (!game || game.phase !== 'player') return Object.freeze({ ok: false, reason: 'not-player-turn' });
  completeHand(game);
  return Object.freeze({ ok: true, outcome: game.outcome, state: getBlackjackState(game) });
}
export function getBlackjackState(game) {
  if (!game || !Array.isArray(game.hands) || !Array.isArray(game.dealer)) throw new TypeError('Invalid blackjack game.');
  const revealDealer = game.phase === 'finished'; const visibleDealer = revealDealer ? game.dealer : game.dealer.slice(0, 1);
  const hands = game.hands.map((cards, index) => Object.freeze({ cards: Object.freeze([...cards]), value: blackjackHandValue(cards), done: Boolean(game.handDone[index]), index }));
  const player = hands[game.activeHandIndex]?.cards ?? Object.freeze([]);
  const dealer = Object.freeze([...visibleDealer]);
  return Object.freeze({ phase: game.phase, outcome: game.outcome, hands: Object.freeze(hands), activeHandIndex: game.activeHandIndex, splitUsed: game.splitUsed, canSplit: game.phase === 'player' && !game.splitUsed && game.hands.length === 1 && game.player.length === 2 && game.player[0].rank === game.player[1].rank && game.drawPile.length >= 2, canDouble: game.phase === 'player' && game.player.length === 2 && game.drawPile.length > 0, player, dealer, playerValue: player.length ? blackjackHandValue(player) : null, dealerValue: revealDealer && game.dealer.length ? blackjackHandValue(game.dealer) : null, hiddenDealerCards: revealDealer ? 0 : Math.max(0, game.dealer.length - visibleDealer.length), remainingCards: game.phase === 'ready' ? 52 : game.drawPile.length, stats: Object.freeze({ ...game.stats }) });
}

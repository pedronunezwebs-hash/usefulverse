export const BLACKJACK_LIMITS = Object.freeze({ minDecks: 1, maxDecks: 6, maxPlayerHands: 4, reshuffleAt: 20 });
const RANKS = Object.freeze(Array.from({ length: 13 }, (_, index) => index + 1));
const SUITS = Object.freeze(['spades', 'hearts', 'diamonds', 'clubs']);

function validCard(card) {
  return card && Number.isInteger(card.rank) && card.rank >= 1 && card.rank <= 13 && SUITS.includes(card.suit);
}
function validateShoe(shoe) {
  if (!Array.isArray(shoe) || shoe.some((card) => !validCard(card))) throw new RangeError('The local card shoe is invalid.');
  return shoe.map(({ rank, suit }) => Object.freeze({ rank, suit }));
}
function shuffledShoe(decks, random = Math.random) {
  if (!Number.isInteger(decks) || decks < BLACKJACK_LIMITS.minDecks || decks > BLACKJACK_LIMITS.maxDecks) throw new RangeError('Choose from 1 to 6 decks.');
  const shoe = [];
  for (let deck = 0; deck < decks; deck += 1) for (const suit of SUITS) for (const rank of RANKS) shoe.push({ rank, suit });
  for (let index = shoe.length - 1; index > 0; index -= 1) {
    const sample = Number(random());
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) throw new RangeError('The shuffle source returned an invalid value.');
    const swap = Math.floor(sample * (index + 1));
    [shoe[index], shoe[swap]] = [shoe[swap], shoe[index]];
  }
  return shoe;
}
function cardPoints(card) { return card.rank === 1 ? 11 : Math.min(card.rank, 10); }

export function scoreBlackjackHand(cards = []) {
  if (!Array.isArray(cards) || cards.some((card) => !validCard(card))) throw new RangeError('The hand contains an invalid card.');
  let total = cards.reduce((sum, card) => sum + cardPoints(card), 0);
  let aces = cards.filter(({ rank }) => rank === 1).length;
  while (total > 21 && aces > 0) { total -= 10; aces -= 1; }
  return Object.freeze({ total, soft: aces > 0, bust: total > 21, blackjack: cards.length === 2 && total === 21 });
}

function freezeState(state) {
  state.playerHands = Object.freeze(state.playerHands.map((hand) => Object.freeze({ ...hand, cards: Object.freeze([...hand.cards]) })));
  state.dealerCards = Object.freeze([...state.dealerCards]);
  state.shoe = Object.freeze([...state.shoe]);
  state.stats = Object.freeze({ ...state.stats });
  state.results = Object.freeze([...state.results]);
  return Object.freeze(state);
}

function settle(state) {
  const dealerScore = scoreBlackjackHand(state.dealerCards);
  const dealerBlackjack = state.dealerCards.length === 2 && dealerScore.blackjack;
  const results = state.playerHands.map((hand) => {
    const player = scoreBlackjackHand(hand.cards);
    if (player.bust) return 'loss';
    if (dealerBlackjack && hand.natural) return 'push';
    if (dealerBlackjack) return 'loss';
    if (hand.natural) return 'natural';
    if (dealerScore.bust || player.total > dealerScore.total) return 'win';
    if (player.total < dealerScore.total) return 'loss';
    return 'push';
  });
  const stats = { ...state.stats };
  for (const result of results) stats[result === 'natural' ? 'wins' : result === 'win' ? 'wins' : result === 'loss' ? 'losses' : 'pushes'] += 1;
  return freezeState({ ...state, phase: 'complete', dealerHidden: false, results: Object.freeze(results), stats, round: state.round + 1 });
}

function afterHand(state, finishedHands) {
  const nextIndex = state.playerHands.findIndex((hand, index) => index > finishedHands && !hand.finished);
  if (nextIndex >= 0) return freezeState({ ...state, currentHand: nextIndex });
  const playerHands = state.playerHands.map((hand) => hand.finished ? hand : Object.freeze({ ...hand, finished: true }));
  let next = { ...state, playerHands, currentHand: -1, phase: 'dealer', dealerHidden: false };
  let dealer = scoreBlackjackHand(next.dealerCards);
  while (dealer.total < 17 || (dealer.total === 17 && dealer.soft && next.hitSoft17)) {
    let shoe = [...next.shoe];
    if (!shoe.length) shoe = shuffledShoe(next.decks);
    const card = shoe.pop();
    next = { ...next, dealerCards: [...next.dealerCards, card], shoe };
    dealer = scoreBlackjackHand(next.dealerCards);
  }
  return settle(next);
}

function dealRound(base, shoe, random = Math.random) {
  let cards = validateShoe(shoe);
  if (cards.length < BLACKJACK_LIMITS.reshuffleAt) cards = shuffledShoe(base.decks, random);
  const deal = () => {
    if (!cards.length) cards = shuffledShoe(base.decks, random);
    const card = cards.pop();
    return card;
  };
  const playerCards = [deal(), deal()];
  const dealerCards = [deal(), deal()];
  const playerNatural = scoreBlackjackHand(playerCards).blackjack;
  const dealerNatural = scoreBlackjackHand(dealerCards).blackjack;
  const initial = { ...base, shoe: cards, playerHands: [{ cards: playerCards, finished: playerNatural || dealerNatural, doubled: false, split: false, natural: playerNatural }], dealerCards, currentHand: playerNatural || dealerNatural ? -1 : 0, phase: playerNatural || dealerNatural ? 'dealer' : 'player', dealerHidden: !playerNatural && !dealerNatural, results: [], round: base.round, handOptions: { double: true, split: true } };
  return initial.phase === 'dealer' ? settle(initial) : freezeState(initial);
}

export function createBlackjackGame({ decks = 4, hitSoft17 = false, random = Math.random, shoe: suppliedShoe } = {}) {
  if (!Number.isInteger(decks) || decks < BLACKJACK_LIMITS.minDecks || decks > BLACKJACK_LIMITS.maxDecks) throw new RangeError('Choose from 1 to 6 decks.');
  if (typeof random !== 'function') throw new TypeError('Provide a shuffle function.');
  const shoe = suppliedShoe ? validateShoe(suppliedShoe) : shuffledShoe(decks, random);
  const base = { decks, hitSoft17: Boolean(hitSoft17), stats: { wins: 0, losses: 0, pushes: 0 }, round: 0 };
  return dealRound(base, shoe, random);
}

export function canDoubleBlackjackHand(game) {
  const hand = game?.playerHands?.[game.currentHand];
  return Boolean(game?.phase === 'player' && hand && !hand.finished && hand.cards.length === 2 && game.shoe.length > 0);
}

export function canSplitBlackjackHand(game) {
  const hand = game?.playerHands?.[game.currentHand];
  return Boolean(game?.phase === 'player' && hand && !hand.finished && hand.cards.length === 2 && hand.cards[0].rank === hand.cards[1].rank && game.playerHands.length < BLACKJACK_LIMITS.maxPlayerHands && game.shoe.length >= 2);
}

function takeCard(game) {
  let shoe = [...game.shoe];
  if (!shoe.length) shoe = shuffledShoe(game.decks);
  const card = shoe.pop();
  return { card, shoe };
}

export function hitBlackjackHand(game) {
  if (game?.phase !== 'player') throw new RangeError('There is no player turn.');
  const index = game.currentHand; const hand = game.playerHands[index];
  if (!hand || hand.finished) throw new RangeError('This hand is already finished.');
  const { card, shoe } = takeCard(game);
  const cards = [...hand.cards, card]; const score = scoreBlackjackHand(cards);
  const playerHands = [...game.playerHands];
  playerHands[index] = { ...hand, cards, finished: score.bust || score.total === 21, natural: false };
  const next = { ...game, playerHands, shoe };
  return playerHands[index].finished ? afterHand(next, index) : freezeState(next);
}

export function standBlackjackHand(game) {
  if (game?.phase !== 'player') throw new RangeError('There is no player turn.');
  const index = game.currentHand; const hand = game.playerHands[index];
  if (!hand || hand.finished) throw new RangeError('This hand is already finished.');
  const playerHands = [...game.playerHands]; playerHands[index] = { ...hand, finished: true };
  return afterHand({ ...game, playerHands }, index);
}

export function doubleBlackjackHand(game) {
  if (!canDoubleBlackjackHand(game)) throw new RangeError('Double is available only on an open two-card hand with a card in the shoe.');
  const index = game.currentHand; const hand = game.playerHands[index]; const { card, shoe } = takeCard(game);
  const playerHands = [...game.playerHands]; playerHands[index] = { ...hand, cards: [...hand.cards, card], finished: true, doubled: true, natural: false };
  return afterHand({ ...game, playerHands, shoe }, index);
}

export function splitBlackjackHand(game) {
  if (!canSplitBlackjackHand(game)) throw new RangeError('Split requires a matching pair, fewer than four hands, and two cards remaining.');
  const index = game.currentHand; const hand = game.playerHands[index]; let shoe = [...game.shoe];
  const draw = () => { if (!shoe.length) shoe = shuffledShoe(game.decks); return shoe.pop(); };
  const left = { cards: [hand.cards[0], draw()], finished: hand.cards[0].rank === 1, doubled: false, split: true, natural: false };
  const right = { cards: [hand.cards[1], draw()], finished: hand.cards[0].rank === 1, doubled: false, split: true, natural: false };
  for (const entry of [left, right]) if (scoreBlackjackHand(entry.cards).total === 21) entry.finished = true;
  const playerHands = [...game.playerHands]; playerHands.splice(index, 1, left, right);
  const next = { ...game, playerHands, shoe, currentHand: index };
  return left.finished ? afterHand(next, index) : freezeState(next);
}

export function startNextBlackjackRound(game, random = Math.random) {
  if (game?.phase !== 'complete') throw new RangeError('Finish the current hand before starting another round.');
  return dealRound({ decks: game.decks, hitSoft17: game.hitSoft17, stats: game.stats, round: game.round }, game.shoe, random);
}

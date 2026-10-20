export const PREFERANS_SUITS = Object.freeze(['clubs', 'spades', 'diamonds', 'hearts']);
export const PREFERANS_RANKS = Object.freeze(['7', '8', '9', '10', 'J', 'Q', 'K', 'A']);
const strength = (card) => PREFERANS_RANKS.indexOf(card.rank);

function randomIndex(length, random, cryptoImpl) {
  if (random) {
    const value = random();
    if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a number in [0, 1).');
    return Math.floor(value * length);
  }
  if (!cryptoImpl?.getRandomValues) throw new TypeError('Secure local randomness is unavailable.');
  const limit = Math.floor(0x1_0000_0000 / length) * length;
  const value = new Uint32Array(1);
  do { cryptoImpl.getRandomValues(value); } while (value[0] >= limit);
  return value[0] % length;
}

export function createPreferansDeck() {
  return PREFERANS_SUITS.flatMap((suit) => PREFERANS_RANKS.map((rank) => Object.freeze({ id: `${suit}-${rank}`, suit, rank })));
}

export function createPreferansGame({ random, cryptoImpl = globalThis.crypto, dealer = 2 } = {}) {
  if (!Number.isInteger(dealer) || dealer < 0 || dealer > 2) throw new RangeError('Invalid dealer seat.');
  const deck = createPreferansDeck();
  for (let i = deck.length - 1; i > 0; i -= 1) { const j = randomIndex(i + 1, random, cryptoImpl); [deck[i], deck[j]] = [deck[j], deck[i]]; }
  const hands = [[], [], []], firstBidder = (dealer + 1) % 3;
  for (let i = 0; i < 30; i += 1) hands[(firstBidder + i) % 3].push(deck[i]);
  return Object.freeze({ phase: 'auction', hands: Object.freeze(hands.map((hand) => Object.freeze(hand))), talon: Object.freeze(deck.slice(30)), dealer, firstBidder, currentPlayer: firstBidder, highestBid: 0, declarer: null, passes: 0, bids: Object.freeze([]), trump: null, defenders: Object.freeze([]), defenderOrder: Object.freeze([]), defenderIndex: 0, trick: Object.freeze([]), trickNumber: 1, tricksWon: Object.freeze([0, 0, 0]), tricks: Object.freeze([]), winner: null, redeal: false });
}

function finishAuction(game) {
  if (game.highestBid === 0) return Object.freeze({ ...game, phase: 'complete', redeal: true });
  return Object.freeze({ ...game, phase: 'exchange', currentPlayer: game.declarer });
}

export function bidPreferans(game, player, bid) {
  if (!game || game.phase !== 'auction' || player !== game.currentPlayer) throw new RangeError('It is not this seat’s auction turn.');
  if (bid !== null && bid !== PREFERANS_SUITS[game.highestBid]) throw new RangeError('Choose the next suit bid or pass.');
  const bids = [...game.bids, Object.freeze({ player, bid })];
  const highestBid = bid === null ? game.highestBid : PREFERANS_SUITS.indexOf(bid) + 1;
  const declarer = bid === null ? game.declarer : player;
  const passes = bid === null ? game.passes + 1 : 0;
  const next = (player + 1) % 3;
  const updated = { ...game, highestBid, declarer, passes, bids: Object.freeze(bids), currentPlayer: next };
  return passes >= (highestBid > 0 ? 2 : 3) ? finishAuction(updated) : Object.freeze(updated);
}

export function exchangePreferans(game, player, discardedIds) {
  if (!game || game.phase !== 'exchange' || player !== game.declarer || !Array.isArray(discardedIds) || discardedIds.length !== 2 || new Set(discardedIds).size !== 2) throw new RangeError('Choose two different cards to discard.');
  const combined = [...game.hands[player], ...game.talon];
  const discarded = discardedIds.map((id) => combined.find((card) => card.id === id));
  if (discarded.some((card) => !card)) throw new RangeError('Choose cards from your hand or the talon.');
  const hand = combined.filter((card) => !discardedIds.includes(card.id));
  const hands = game.hands.map((cards, seat) => seat === player ? Object.freeze(hand) : cards);
  const defenderOrder = Object.freeze([(player + 1) % 3, (player + 2) % 3]);
  return Object.freeze({ ...game, phase: 'defend', hands: Object.freeze(hands), talon: Object.freeze([]), discarded: Object.freeze(discarded), trump: PREFERANS_SUITS[game.highestBid - 1], defenderOrder, defenderIndex: 0, currentPlayer: defenderOrder[0], defenders: Object.freeze([]) });
}

export function decidePreferansDefense(game, player, defend) {
  if (!game || game.phase !== 'defend' || player !== game.currentPlayer || typeof defend !== 'boolean') throw new RangeError('It is not this seat’s defense decision.');
  const defenders = defend ? [...game.defenders, player] : [...game.defenders];
  const defenderIndex = game.defenderIndex + 1;
  if (defenderIndex >= game.defenderOrder.length) {
    if (!defenders.length) {
      const scoreDelta = [0, 0, 0]; scoreDelta[game.declarer] = 10;
      const tricksWon = [0, 0, 0]; tricksWon[game.declarer] = 10;
      return Object.freeze({ ...game, phase: 'complete', defenders: Object.freeze(defenders), winner: game.declarer, tricksWon: Object.freeze(tricksWon), scoreDelta: Object.freeze(scoreDelta), declarerMade: true });
    }
    return Object.freeze({ ...game, phase: 'playing', defenders: Object.freeze(defenders), defenderIndex, currentPlayer: game.declarer });
  }
  return Object.freeze({ ...game, defenders: Object.freeze(defenders), defenderIndex, currentPlayer: game.defenderOrder[defenderIndex] });
}

function winningPlay(trick, trump) {
  const ledSuit = trick[0].card.suit;
  const trumps = trick.filter(({ card }) => card.suit === trump);
  const candidates = trumps.length ? trumps : trick.filter(({ card }) => card.suit === ledSuit);
  return candidates.reduce((best, play) => strength(play.card) > strength(best.card) ? play : best);
}

export function legalPreferansCards(game, player = game?.currentPlayer) {
  if (!game || game.phase !== 'playing' || player !== game.currentPlayer) return [];
  const hand = game.hands[player];
  if (!game.trick.length) return hand;
  const ledSuit = game.trick[0].card.suit;
  const following = hand.filter((card) => card.suit === ledSuit);
  const winning = winningPlay(game.trick, game.trump);
  const trumpOnTable = game.trick.some(({ card }) => card.suit === game.trump);
  if (following.length) {
    const canBeat = following.filter((card) => (card.suit === winning.card.suit) && strength(card) > strength(winning.card));
    return canBeat.length ? canBeat : following;
  }
  const trumps = hand.filter((card) => card.suit === game.trump);
  if (!trumps.length) return hand;
  if (!trumpOnTable) return trumps;
  const overtrumps = trumps.filter((card) => strength(card) > strength(winning.card));
  return overtrumps.length ? overtrumps : hand;
}

export function playPreferansCard(game, player, cardId) {
  const legal = legalPreferansCards(game, player);
  const card = legal.find((item) => item.id === cardId);
  if (!card) throw new RangeError('That card is not legal for this trick.');
  const trick = [...game.trick, Object.freeze({ player, card })];
  const hands = game.hands.map((hand, seat) => seat === player ? Object.freeze(hand.filter((item) => item.id !== card.id)) : hand);
  if (trick.length < 3) return Object.freeze({ ...game, hands: Object.freeze(hands), trick: Object.freeze(trick), currentPlayer: (player + 1) % 3 });
  const winner = winningPlay(trick, game.trump).player;
  const tricksWon = [...game.tricksWon]; tricksWon[winner] += 1;
  const tricks = [...game.tricks, Object.freeze({ number: game.trickNumber, plays: Object.freeze(trick), winner })];
  if (game.trickNumber === 10) {
    const declarerMade = tricksWon[game.declarer] >= 6;
    const scoreDelta = scorePreferansHand({ declarer: game.declarer, defenders: game.defenders, tricksWon });
    return Object.freeze({ ...game, phase: 'complete', hands: Object.freeze(hands), trick: Object.freeze([]), tricksWon: Object.freeze(tricksWon), tricks: Object.freeze(tricks), winner: declarerMade ? game.declarer : game.defenders.reduce((best, seat) => tricksWon[seat] > tricksWon[best] ? seat : best, game.defenders[0]), declarerMade, scoreDelta });
  }
  return Object.freeze({ ...game, hands: Object.freeze(hands), trick: Object.freeze([]), tricksWon: Object.freeze(tricksWon), tricks: Object.freeze(tricks), trickNumber: game.trickNumber + 1, currentPlayer: winner });
}

export function scorePreferansHand({ declarer, defenders, tricksWon }) {
  if (!Number.isInteger(declarer) || declarer < 0 || declarer > 2 || !Array.isArray(defenders) || !Array.isArray(tricksWon) || tricksWon.length !== 3 || tricksWon.some((n) => !Number.isInteger(n) || n < 0) || tricksWon.reduce((sum, n) => sum + n, 0) !== 10 || defenders.some((seat) => !Number.isInteger(seat) || seat < 0 || seat > 2 || seat === declarer)) throw new RangeError('Invalid completed Preferans hand.');
  const delta = [0, 0, 0];
  delta[declarer] += 10;
  for (const seat of defenders) {
    delta[seat] += tricksWon[seat];
    delta[declarer] -= tricksWon[seat];
    if (tricksWon[seat] < 2) delta[seat] -= 10;
  }
  if (tricksWon[declarer] < 6) delta[declarer] -= 20;
  return Object.freeze(delta);
}

export function choosePreferansBotBid(game, player) {
  const suit = PREFERANS_SUITS[game.highestBid];
  if (!suit) return null;
  const hand = game.hands[player];
  const suited = hand.filter((card) => card.suit === suit);
  const score = suited.length * 1.4 + suited.filter((card) => ['A', 'K'].includes(card.rank)).length * 0.8;
  return score >= 6.5 ? suit : null;
}

export function choosePreferansBotCard(game, player) {
  const legal = legalPreferansCards(game, player);
  if (!legal.length) return null;
  const declarer = player === game.declarer;
  return [...legal].sort((a, b) => strength(a) - strength(b))[declarer ? legal.length - 1 : 0];
}

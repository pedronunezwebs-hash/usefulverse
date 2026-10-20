export const BELOTE_SUITS = Object.freeze(['clubs', 'diamonds', 'hearts', 'spades']);
export const BELOTE_RANKS = Object.freeze([7, 8, 9, 10, 11, 12, 13, 14]);
const TRUMP_ORDER = Object.freeze([7, 8, 12, 13, 10, 14, 9, 11]);
const PLAIN_ORDER = Object.freeze([7, 8, 9, 11, 12, 13, 10, 14]);

export function createBeloteDeck() {
  return BELOTE_SUITS.flatMap((suit) => BELOTE_RANKS.map((rank) => Object.freeze({ id: `${suit}-${rank}`, suit, rank })));
}

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

export function beloteCardPoints(card, trump) {
  if (!BELOTE_SUITS.includes(card?.suit) || !BELOTE_RANKS.includes(card?.rank) || !BELOTE_SUITS.includes(trump)) throw new RangeError('Invalid Belote card or trump suit.');
  if (card.suit === trump) return ({ 7: 0, 8: 0, 9: 14, 10: 10, 11: 20, 12: 3, 13: 4, 14: 11 })[card.rank];
  return ({ 7: 0, 8: 0, 9: 0, 10: 10, 11: 2, 12: 3, 13: 4, 14: 11 })[card.rank];
}

function teamOf(player) { return player % 2; }
function cardOrder(card, trump) { return card.suit === trump ? TRUMP_ORDER.indexOf(card.rank) : PLAIN_ORDER.indexOf(card.rank); }
function bestPlay(plays, trump) {
  const leadSuit = plays[0].card.suit;
  const trumps = plays.filter(({ card }) => card.suit === trump);
  const eligible = trumps.length ? trumps : plays.filter(({ card }) => card.suit === leadSuit);
  return eligible.reduce((best, play) => cardOrder(play.card, trump) > cardOrder(best.card, trump) ? play : best);
}

export function createBeloteGame({ trump, random, cryptoImpl = globalThis.crypto } = {}) {
  if (!BELOTE_SUITS.includes(trump)) throw new RangeError('Choose a trump suit before dealing.');
  const deck = createBeloteDeck();
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swap = randomIndex(index + 1, random, cryptoImpl);
    [deck[index], deck[swap]] = [deck[swap], deck[index]];
  }
  const hands = Array.from({ length: 4 }, (_, player) => Object.freeze(deck.slice(player * 8, (player + 1) * 8)));
  return Object.freeze({ phase: 'playing', trump, declarerTeam: 0, hands: Object.freeze(hands), currentPlayer: 0, leadPlayer: 0, trick: Object.freeze([]), tricks: Object.freeze([]), teamPoints: Object.freeze([0, 0]), beloteProgress: Object.freeze([0, 0, 0, 0]), beloteAnnounced: Object.freeze([false, false, false, false]), trickNumber: 1, winnerTeam: null });
}

export function legalBeloteCards(game, player = game?.currentPlayer) {
  if (!game || game.phase !== 'playing' || player !== game.currentPlayer || !Number.isInteger(player) || player < 0 || player > 3) return [];
  const hand = game.hands[player];
  if (!hand?.length) return [];
  if (!game.trick.length) return hand;
  const leadSuit = game.trick[0].card.suit;
  const following = hand.filter((card) => card.suit === leadSuit);
  if (following.length) return following;
  const trumps = hand.filter((card) => card.suit === game.trump);
  if (!trumps.length) return hand;
  const currentTrump = game.trick.filter(({ card }) => card.suit === game.trump).reduce((best, play) => !best || cardOrder(play.card, game.trump) > cardOrder(best.card, game.trump) ? play : best, null);
  if (!currentTrump) return trumps;
  const overtrumps = trumps.filter((card) => cardOrder(card, game.trump) > cardOrder(currentTrump.card, game.trump));
  return overtrumps.length ? overtrumps : trumps;
}

export function playBeloteCard(game, player, cardId) {
  const legal = legalBeloteCards(game, player);
  const card = game?.hands?.[player]?.find(({ id }) => id === cardId);
  if (!card || !legal.some(({ id }) => id === cardId)) throw new RangeError('That card is not legal for this turn.');
  const hands = game.hands.map((hand, index) => Object.freeze(index === player ? hand.filter(({ id }) => id !== cardId) : [...hand]));
  const trick = [...game.trick, Object.freeze({ player, card })];
  const progress = [...game.beloteProgress];
  const announced = [...game.beloteAnnounced];
  const points = [...game.teamPoints];
  if (card.suit === game.trump && (card.rank === 12 || card.rank === 13)) {
    const bit = card.rank === 12 ? 1 : 2;
    if ((progress[player] & bit) === 0) {
      progress[player] |= bit;
      if (progress[player] === 3 && !announced[player]) {
        points[teamOf(player)] += 20;
        announced[player] = true;
      }
    }
  }
  let currentPlayer = (player + 1) % 4;
  let nextTrick = trick;
  let tricks = [...game.tricks];
  let leadPlayer = game.leadPlayer;
  let trickNumber = game.trickNumber;
  let phase = 'playing';
  let winnerTeam = null;
  if (trick.length === 4) {
    const winner = bestPlay(trick, game.trump);
    const cardPoints = trick.reduce((sum, play) => sum + beloteCardPoints(play.card, game.trump), 0) + (trickNumber === 8 ? 10 : 0);
    points[teamOf(winner.player)] += cardPoints;
    tricks.push(Object.freeze({ plays: Object.freeze(trick), winner: winner.player, points: cardPoints, trickNumber }));
    leadPlayer = winner.player;
    currentPlayer = winner.player;
    trickNumber += 1;
    nextTrick = [];
    if (trickNumber === 9) {
      phase = 'complete';
      winnerTeam = points[game.declarerTeam] >= 82 ? game.declarerTeam : 1 - game.declarerTeam;
    }
  }
  return Object.freeze({ ...game, phase, hands: Object.freeze(hands), currentPlayer, leadPlayer, trick: Object.freeze(nextTrick), tricks: Object.freeze(tricks), teamPoints: Object.freeze(points), beloteProgress: Object.freeze(progress), beloteAnnounced: Object.freeze(announced), trickNumber, winnerTeam });
}

export function chooseBeloteBotCard(game, player = game?.currentPlayer) {
  const legal = legalBeloteCards(game, player);
  if (!legal.length) return null;
  const order = (card) => cardOrder(card, game.trump);
  if (game.trick.length === 3) {
    const current = bestPlay(game.trick, game.trump);
    const leadSuit = game.trick[0].card.suit;
    const canWin = (card) => card.suit === game.trump
      ? current.card.suit !== game.trump || order(card) > order(current.card)
      : current.card.suit !== game.trump && card.suit === leadSuit && order(card) > order(current.card);
    const winners = legal.filter(canWin).sort((a, b) => order(a) - order(b));
    if (winners.length) return winners[0];
  }
  return [...legal].sort((a, b) => beloteCardPoints(a, game.trump) - beloteCardPoints(b, game.trump) || order(a) - order(b))[0];
}


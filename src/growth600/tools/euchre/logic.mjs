export const EUCHRE_SEATS = Object.freeze(['North', 'East', 'South', 'West']);
export const EUCHRE_SUITS = Object.freeze(['clubs', 'diamonds', 'hearts', 'spades']);
export const EUCHRE_RANKS = Object.freeze(['9', '10', 'J', 'Q', 'K', 'A']);

function assertSuit(suit) {
  if (!EUCHRE_SUITS.includes(suit)) throw new RangeError('Choose a valid suit.');
}

export function createEuchreDeck() {
  return EUCHRE_SUITS.flatMap((suit) => EUCHRE_RANKS.map((rank) => Object.freeze({ rank, suit, id: `${rank}-${suit}` })));
}

export function getEuchreCardSuit(card, trump) {
  assertSuit(trump);
  if (!card || !EUCHRE_SUITS.includes(card.suit) || !EUCHRE_RANKS.includes(card.rank)) throw new TypeError('Choose a valid card.');
  if (card.rank !== 'J') return card.suit;
  if (card.suit === trump) return trump;
  const sameColor = (trump === 'hearts' && card.suit === 'diamonds')
    || (trump === 'diamonds' && card.suit === 'hearts')
    || (trump === 'clubs' && card.suit === 'spades')
    || (trump === 'spades' && card.suit === 'clubs');
  return sameColor ? trump : card.suit;
}

export function getEuchreCardStrength(card, trump) {
  const effectiveSuit = getEuchreCardSuit(card, trump);
  if (effectiveSuit === trump) {
    if (card.rank === 'J' && card.suit === trump) return 100;
    if (card.rank === 'J') return 99;
    return 95 - ['A', 'K', 'Q', '10', '9'].indexOf(card.rank);
  }
  return 6 - ['A', 'K', 'Q', 'J', '10', '9'].indexOf(card.rank);
}

export function getLegalEuchreCards(hand, ledSuit, trump) {
  if (!Array.isArray(hand) || hand.length === 0) return [];
  assertSuit(trump);
  if (!ledSuit) return [...hand];
  assertSuit(ledSuit);
  const following = hand.filter((card) => getEuchreCardSuit(card, trump) === ledSuit);
  return following.length ? following : [...hand];
}

export function resolveEuchreTrick(plays, trump) {
  assertSuit(trump);
  if (!Array.isArray(plays) || plays.length !== 4) throw new RangeError('A trick needs exactly four cards.');
  const ids = new Set();
  for (const play of plays) {
    if (!Number.isInteger(play.player) || play.player < 0 || play.player > 3 || !play.card) throw new TypeError('A trick contains an invalid play.');
    if (ids.has(play.card.id)) throw new RangeError('A card cannot be played twice in one trick.');
    ids.add(play.card.id);
  }
  const ledSuit = getEuchreCardSuit(plays[0].card, trump);
  let winner = plays[0];
  for (const play of plays.slice(1)) {
    const suit = getEuchreCardSuit(play.card, trump);
    const bestSuit = getEuchreCardSuit(winner.card, trump);
    const beats = suit === trump && bestSuit !== trump
      || (suit === bestSuit && getEuchreCardStrength(play.card, trump) > getEuchreCardStrength(winner.card, trump));
    if (beats) winner = play;
  }
  return Object.freeze({ winner: winner.player, team: winner.player % 2, ledSuit, winningCard: winner.card });
}

export function scoreEuchreHand({ makerTeam, makerTricks, alone = false }) {
  if (![0, 1].includes(makerTeam) || !Number.isInteger(makerTricks) || makerTricks < 0 || makerTricks > 5) throw new RangeError('Invalid Euchre hand score.');
  if (makerTricks < 3) return Object.freeze({ team: 1 - makerTeam, points: 2, outcome: 'euchred' });
  if (makerTricks === 5) return Object.freeze({ team: makerTeam, points: alone ? 4 : 2, outcome: 'march' });
  return Object.freeze({ team: makerTeam, points: 1, outcome: 'made' });
}

function shuffledDeck(random) {
  const deck = createEuchreDeck();
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const sample = random();
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) throw new RangeError('Random source must return values from 0 up to 1.');
    const j = Math.floor(sample * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function dealEuchreHand({ random = Math.random, dealer = 3 } = {}) {
  if (typeof random !== 'function') throw new TypeError('Random source must be a function.');
  if (!Number.isInteger(dealer) || dealer < 0 || dealer > 3) throw new RangeError('Dealer seat must be 0–3.');
  const deck = shuffledDeck(random);
  const hands = [0, 1, 2, 3].map((seat) => deck.slice(seat * 5, seat * 5 + 5));
  return Object.freeze({ hands: Object.freeze(hands.map((hand) => Object.freeze(hand))), kitty: Object.freeze(deck.slice(20)), upcard: deck[20], dealer, firstBidder: (dealer + 1) % 4 });
}

export function isEuchreGameWon(scores, target = 10) {
  if (!Array.isArray(scores) || scores.length !== 2 || scores.some((score) => !Number.isInteger(score) || score < 0) || !Number.isInteger(target) || target < 1) throw new RangeError('Invalid score or target.');
  return scores.findIndex((score) => score >= target);
}

function cloneGame(game, patch) {
  return { ...game, ...patch };
}

function dealIntoGame(scores, dealer, random, target) {
  const dealt = dealEuchreHand({ random, dealer });
  return {
    scores: [...scores], target, dealer, hands: dealt.hands.map((hand) => [...hand]),
    kitty: [...dealt.kitty.slice(1)], upcard: dealt.upcard, firstBidder: dealt.firstBidder,
    bidRound: 1, bidPasses: 0, phase: 'bidding', currentPlayer: dealt.firstBidder,
    trump: null, makerTeam: null, maker: null, tricks: [0, 0], trick: [],
    handNumber: 1, lastHand: null, winner: null,
  };
}

export function createEuchreGame({ random = Math.random, target = 10, dealer = 3 } = {}) {
  if (typeof random !== 'function') throw new TypeError('Random source must be a function.');
  if (!Number.isInteger(target) || target < 5 || target > 15) throw new RangeError('Target score must be from 5 to 15.');
  if (!Number.isInteger(dealer) || dealer < 0 || dealer > 3) throw new RangeError('Dealer seat must be 0–3.');
  return dealIntoGame([0, 0], dealer, random, target);
}

function nextSeat(seat) { return (seat + 1) % 4; }

function finishBid(game, trump, maker) {
  const hands = game.hands.map((hand) => [...hand]);
  if (!hands[maker].some(({ id }) => id === game.upcard.id)) hands[maker].push(game.upcard);
  return cloneGame(game, {
    hands, trump, maker, makerTeam: maker % 2, currentPlayer: maker,
    phase: 'discard', bidPasses: 0,
  });
}

function redeal(game, random) {
  return { ...dealIntoGame(game.scores, nextSeat(game.dealer), random, game.target), handNumber: game.handNumber + 1 };
}

export function bidEuchre(game, { type, suit } = {}, { random = Math.random } = {}) {
  if (!game || game.phase !== 'bidding' || !['pass', 'order-up', 'name-trump'].includes(type)) return null;
  if (type === 'order-up' && game.bidRound !== 1) return null;
  if (type === 'name-trump' && (game.bidRound !== 2 || !EUCHRE_SUITS.includes(suit) || suit === game.upcard.suit)) return null;
  const player = game.currentPlayer;
  if (type === 'order-up') return finishBid(game, game.upcard.suit, player);
  if (type === 'name-trump') return finishBid(game, suit, player);
  const passes = game.bidPasses + 1;
  if (passes < 4) return cloneGame(game, { bidPasses: passes, currentPlayer: nextSeat(player) });
  if (game.bidRound === 1) return cloneGame(game, { bidRound: 2, bidPasses: 0, currentPlayer: game.firstBidder });
  return redeal(game, random);
}

export function discardEuchreCard(game, cardId) {
  if (!game || game.phase !== 'discard' || game.currentPlayer !== game.maker || !game.hands[game.maker].some(({ id }) => id === cardId)) return null;
  const hands = game.hands.map((hand, seat) => seat === game.maker ? hand.filter(({ id }) => id !== cardId) : [...hand]);
  return cloneGame(game, { hands, phase: 'play', currentPlayer: game.firstBidder, trick: [], tricks: [0, 0] });
}

export function playEuchreCard(game, cardId, { random = Math.random } = {}) {
  if (!game || game.phase !== 'play') return null;
  const player = game.currentPlayer;
  const hand = game.hands[player];
  const card = hand.find(({ id }) => id === cardId);
  if (!card) return null;
  const legal = getLegalEuchreCards(hand, game.trick.length ? getEuchreCardSuit(game.trick[0].card, game.trump) : null, game.trump);
  if (!legal.some(({ id }) => id === cardId)) return null;
  const hands = game.hands.map((cards, seat) => seat === player ? cards.filter(({ id }) => id !== cardId) : [...cards]);
  const trick = [...game.trick, { player, card }];
  if (trick.length < 4) return cloneGame(game, { hands, trick, currentPlayer: nextSeat(player) });
  const outcome = resolveEuchreTrick(trick, game.trump);
  const tricks = [...game.tricks];
  tricks[outcome.team] += 1;
  if (tricks[0] + tricks[1] < 5) return cloneGame(game, { hands, trick: [], tricks, currentPlayer: outcome.winner, lastTrick: outcome });
  const handScore = scoreEuchreHand({ makerTeam: game.makerTeam, makerTricks: tricks[game.makerTeam] });
  const scores = [...game.scores];
  scores[handScore.team] += handScore.points;
  const winner = isEuchreGameWon(scores, game.target);
  if (winner !== -1) return cloneGame(game, { hands, tricks, scores, trick: [], phase: 'over', winner, lastHand: { ...handScore, tricks: [...tricks] } });
  const next = dealIntoGame(scores, nextSeat(game.dealer), random, game.target);
  return { ...next, handNumber: game.handNumber + 1, lastHand: { ...handScore, tricks: [...tricks] } };
}

function countTrumpCards(hand, trump) {
  return hand.filter((card) => getEuchreCardSuit(card, trump) === trump).length;
}

export function chooseEuchreBid(game) {
  if (!game || game.phase !== 'bidding') return null;
  const hand = game.hands[game.currentPlayer];
  if (game.bidRound === 1) {
    const suit = game.upcard.suit;
    const strength = countTrumpCards(hand, suit) + (hand.some(({ id }) => id === game.upcard.id) ? 1 : 0);
    return strength >= 3 || strength >= 2 && hand.some((card) => card.rank === 'J' && card.suit === suit)
      ? { type: 'order-up' } : { type: 'pass' };
  }
  const options = EUCHRE_SUITS.filter((suit) => suit !== game.upcard.suit)
    .map((suit) => ({ suit, count: countTrumpCards(hand, suit), hasRight: hand.some((card) => card.rank === 'J' && card.suit === suit) }))
    .sort((a, b) => b.count - a.count || Number(b.hasRight) - Number(a.hasRight));
  const best = options[0];
  return best.count >= 3 || best.count >= 2 && best.hasRight ? { type: 'name-trump', suit: best.suit } : { type: 'pass' };
}

export function chooseEuchreCard(game) {
  if (!game || game.phase !== 'play') return null;
  const ledSuit = game.trick.length ? getEuchreCardSuit(game.trick[0].card, game.trump) : null;
  const legal = getLegalEuchreCards(game.hands[game.currentPlayer], ledSuit, game.trump);
  if (!legal.length) return null;
  return legal.slice().sort((a, b) => getEuchreCardStrength(a, game.trump) - getEuchreCardStrength(b, game.trump))[0].id;
}

export function chooseEuchreDiscard(game) {
  if (!game || game.phase !== 'discard') return null;
  const hand = game.hands[game.maker];
  return hand.slice().sort((a, b) => getEuchreCardStrength(a, game.trump) - getEuchreCardStrength(b, game.trump))[0]?.id ?? null;
}

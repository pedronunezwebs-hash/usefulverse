const SUITS = new Set(['clubs', 'diamonds', 'hearts', 'spades']);
const RANKS = new Set(Array.from({ length: 13 }, (_, index) => index + 1));

function cardKey(card) {
  return `${card.rank}:${card.suit}`;
}

function cardValue(rank) {
  return Math.min(rank, 10);
}

function validateHand(hand, expectedLength = 10) {
  if (!Array.isArray(hand) || hand.length !== expectedLength) {
    throw new RangeError(`A Gin Rummy hand must contain exactly ${expectedLength} cards.`);
  }
  const keys = new Set();
  for (const card of hand) {
    if (!card || !RANKS.has(card.rank) || !SUITS.has(card.suit)) {
      throw new RangeError('Each card must use a standard rank (1–13) and suit.');
    }
    const key = cardKey(card);
    if (keys.has(key)) throw new RangeError('A physical card cannot appear twice.');
    keys.add(key);
  }
}

function combinations(items, size, start = 0, chosen = [], output = []) {
  if (chosen.length === size) {
    output.push(chosen);
    return output;
  }
  for (let index = start; index <= items.length - (size - chosen.length); index += 1) {
    combinations(items, size, index + 1, [...chosen, items[index]], output);
  }
  return output;
}

function findMelds(hand) {
  const melds = new Map();
  for (const size of [3, 4]) {
    for (const group of combinations(hand, size)) {
      const sameRank = group.every(({ rank }) => rank === group[0].rank);
      const sameSuit = group.every(({ suit }) => suit === group[0].suit);
      const sortedRanks = group.map(({ rank }) => rank).sort((a, b) => a - b);
      const run = sameSuit && sortedRanks.every((rank, index) => index === 0 || rank === sortedRanks[index - 1] + 1);
      if (!sameRank && !run) continue;
      const indices = group.map((card) => hand.indexOf(card)).sort((a, b) => a - b);
      const key = indices.join(',');
      melds.set(key, { indices, cards: group, points: group.reduce((sum, card) => sum + cardValue(card.rank), 0), type: sameRank ? 'set' : 'run' });
    }
  }
  return [...melds.values()];
}

/** Find a maximum-value, non-overlapping meld partition for a standard 10-card hand. */
export function scoreGinRummyHand(hand) {
  validateHand(hand);
  const melds = findMelds(hand);
  let best = { covered: 0, melds: [], mask: 0 };
  const search = (start, usedMask, chosen, covered) => {
    if (covered > best.covered) best = { covered, melds: chosen, mask: usedMask };
    for (let index = start; index < melds.length; index += 1) {
      const meld = melds[index];
      const mask = meld.indices.reduce((value, cardIndex) => value | (1 << cardIndex), 0);
      if ((usedMask & mask) === 0) search(index + 1, usedMask | mask, [...chosen, meld], covered + meld.points);
    }
  };
  search(0, 0, [], 0);
  const deadwood = hand.filter((_, index) => (best.mask & (1 << index)) === 0);
  return Object.freeze({
    melds: Object.freeze(best.melds.map(({ type, cards, points }) => Object.freeze({ type, cards: Object.freeze(cards.map((card) => Object.freeze({ ...card }))), points }))),
    deadwood: Object.freeze(deadwood.map((card) => Object.freeze({ ...card }))),
    deadwoodPoints: deadwood.reduce((sum, card) => sum + cardValue(card.rank), 0),
    gin: deadwood.length === 0,
    knockEligible: deadwood.length > 0 && deadwood.reduce((sum, card) => sum + cardValue(card.rank), 0) <= 10,
  });
}

export function createGinRummyDeck(random = Math.random) {
  if (typeof random !== 'function') throw new TypeError('random must be a function.');
  const deck = [...SUITS].flatMap((suit) => Array.from(RANKS, (rank) => ({ rank, suit })));
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const sample = random();
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) throw new RangeError('random must return a value from 0 inclusive to 1 exclusive.');
    const swapIndex = Math.floor(sample * (index + 1));
    [deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
  }
  return deck;
}

export function startGinRummyGame(random = Math.random) {
  const deck = createGinRummyDeck(random);
  const hands = [[], []];
  for (let index = 0; index < 20; index += 1) hands[index % 2].push(deck[index]);
  return freezeGame({
    hands,
    stock: deck.slice(21),
    discardPile: [deck[20]],
    scores: [0, 0],
    currentPlayer: 0,
    phase: 'draw',
    drawnCard: null,
    roundResult: null,
  });
}

export function drawGinRummyCard(game, source) {
  assertActiveGame(game, 'draw');
  if (!['stock', 'discard'].includes(source)) throw new RangeError('Draw from stock or discard pile.');
  if (source === 'stock' && game.stock.length === 0) throw new RangeError('The stock is empty; end this hand as a draw.');
  if (source === 'discard' && game.discardPile.length === 0) throw new RangeError('The discard pile is empty.');
  const card = source === 'stock' ? game.stock[game.stock.length - 1] : game.discardPile[game.discardPile.length - 1];
  const stock = source === 'stock' ? game.stock.slice(0, -1) : game.stock;
  const discardPile = source === 'discard' ? game.discardPile.slice(0, -1) : game.discardPile;
  const hands = game.hands.map((hand, index) => index === game.currentPlayer ? [...hand, card] : hand);
  return freezeGame({ ...game, hands, stock, discardPile, drawnCard: { card, source }, phase: 'discard' });
}

/** Discard after drawing. Optional knock uses the explicit no-layoff scoring variant. */
export function discardGinRummyCard(game, handIndex, { knock = false } = {}) {
  assertActiveGame(game, 'discard');
  const hand = game.hands[game.currentPlayer];
  if (!Number.isInteger(handIndex) || handIndex < 0 || handIndex >= hand.length) throw new RangeError('Choose a card in your hand to discard.');
  const discarded = hand[handIndex];
  if (game.drawnCard?.source === 'discard' && cardKey(discarded) === cardKey(game.drawnCard.card)) {
    throw new RangeError('You cannot immediately discard the card just taken from the discard pile.');
  }
  const nextHand = hand.filter((_, index) => index !== handIndex);
  if (nextHand.length !== 10) throw new RangeError('A turn must end with exactly 10 cards.');
  const hands = game.hands.map((current, index) => index === game.currentPlayer ? nextHand : current);
  const discardPile = [...game.discardPile, discarded];
  const scorer = scoreGinRummyHand(nextHand);
  if (scorer.gin) return resolveGinRound({ ...game, hands, discardPile, phase: 'finished', drawnCard: null }, game.currentPlayer);
  if (knock) {
    if (!scorer.knockEligible) throw new RangeError('Knock is allowed only with 10 or fewer deadwood points.');
    return resolveKnockRound({ ...game, hands, discardPile, phase: 'finished', drawnCard: null }, game.currentPlayer);
  }
  return freezeGame({ ...game, hands, discardPile, currentPlayer: 1 - game.currentPlayer, phase: 'draw', drawnCard: null });
}

export function playGinRummyBotTurn(game) {
  assertActiveGame(game, 'draw');
  if (game.currentPlayer !== 1) throw new RangeError('The local opponent can act only on its turn.');
  const drawSources = [];
  if (game.stock.length) drawSources.push('stock');
  if (game.discardPile.length) drawSources.push('discard');
  if (!drawSources.length) throw new RangeError('The stock and discard pile are empty.');
  let best = null;
  for (const source of drawSources) {
    const card = source === 'stock' ? game.stock.at(-1) : game.discardPile.at(-1);
    const hand = [...game.hands[1], card];
    for (let index = 0; index < hand.length; index += 1) {
      if (source === 'discard' && cardKey(hand[index]) === cardKey(card)) continue;
      const afterDiscard = hand.filter((_, cardIndex) => cardIndex !== index);
      const score = scoreGinRummyHand(afterDiscard);
      const choice = { source, discardIndex: index, deadwoodPoints: score.deadwoodPoints };
      if (!best || choice.deadwoodPoints < best.deadwoodPoints || (choice.deadwoodPoints === best.deadwoodPoints && source === 'discard' && best.source === 'stock')) best = choice;
    }
  }
  const afterDraw = drawGinRummyCard(game, best.source);
  return discardGinRummyCard(afterDraw, best.discardIndex, { knock: best.deadwoodPoints <= 10 });
}

function resolveGinRound(game, winner) {
  const opponent = 1 - winner;
  const opponentDeadwood = scoreGinRummyHand(game.hands[opponent]).deadwoodPoints;
  const points = 25 + opponentDeadwood;
  const scores = game.scores.map((score, index) => score + (index === winner ? points : 0));
  return freezeGame({ ...game, scores, roundResult: { type: 'gin', winner, points, opponentDeadwood, scoringVariant: 'no-layoff' } });
}

function resolveKnockRound(game, knocker) {
  const opponent = 1 - knocker;
  const knockerDeadwood = scoreGinRummyHand(game.hands[knocker]).deadwoodPoints;
  const opponentDeadwood = scoreGinRummyHand(game.hands[opponent]).deadwoodPoints;
  const undercut = opponentDeadwood <= knockerDeadwood;
  const winner = undercut ? opponent : knocker;
  const points = undercut ? 25 + knockerDeadwood - opponentDeadwood : opponentDeadwood - knockerDeadwood;
  const scores = game.scores.map((score, index) => score + (index === winner ? points : 0));
  return freezeGame({ ...game, scores, roundResult: { type: undercut ? 'undercut' : 'knock', winner, knocker, points, knockerDeadwood, opponentDeadwood, scoringVariant: 'no-layoff' } });
}

function assertActiveGame(game, phase) {
  if (!game || game.phase !== phase || !Array.isArray(game.hands) || game.hands.length !== 2) {
    throw new RangeError(`A valid active game in the ${phase} phase is required.`);
  }
}

function freezeGame(game) {
  return Object.freeze({
    ...game,
    hands: Object.freeze(game.hands.map((hand) => Object.freeze(hand.map((card) => Object.freeze({ ...card }))))),
    stock: Object.freeze(game.stock.map((card) => Object.freeze({ ...card }))),
    discardPile: Object.freeze(game.discardPile.map((card) => Object.freeze({ ...card }))),
    scores: Object.freeze([...game.scores]),
    drawnCard: game.drawnCard ? Object.freeze({ card: Object.freeze({ ...game.drawnCard.card }), source: game.drawnCard.source }) : null,
    roundResult: game.roundResult ? Object.freeze({ ...game.roundResult }) : null,
  });
}

export function chooseGinRummyDiscard(hand, { protectCard = null } = {}) {
  validateHand(hand, 11);
  let choice = null;
  for (let index = 0; index < hand.length; index += 1) {
    if (protectCard && cardKey(hand[index]) === cardKey(protectCard)) continue;
    const remaining = hand.filter((_, cardIndex) => cardIndex !== index);
    const score = findBestPartialHand(remaining);
    const candidate = { card: hand[index], deadwoodPoints: score.deadwoodPoints, meldPoints: score.meldPoints };
    if (!choice || candidate.deadwoodPoints < choice.deadwoodPoints || (candidate.deadwoodPoints === choice.deadwoodPoints && candidate.meldPoints > choice.meldPoints)) choice = candidate;
  }
  return Object.freeze({ ...choice, knockEligible: choice.deadwoodPoints <= 10 && choice.deadwoodPoints > 0, card: Object.freeze({ ...choice.card }) });
}

function findBestPartialHand(hand) {
  // Evaluate a nine-card hand by temporarily adding a harmless sentinel that cannot meld.
  // Instead, enumerate the same meld combinations directly and total uncovered card values.
  const melds = findMelds(hand);
  let best = { covered: 0, mask: 0 };
  const search = (start, usedMask, covered) => {
    if (covered > best.covered) best = { covered, mask: usedMask };
    for (let index = start; index < melds.length; index += 1) {
      const meld = melds[index];
      const mask = meld.indices.reduce((value, cardIndex) => value | (1 << cardIndex), 0);
      if ((usedMask & mask) === 0) search(index + 1, usedMask | mask, covered + meld.points);
    }
  };
  search(0, 0, 0);
  return {
    deadwoodPoints: hand.reduce((sum, card, index) => sum + ((best.mask & (1 << index)) === 0 ? cardValue(card.rank) : 0), 0),
    meldPoints: best.covered,
  };
}

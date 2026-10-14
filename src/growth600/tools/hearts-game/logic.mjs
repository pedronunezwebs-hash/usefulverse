export const SUITS = Object.freeze(['clubs', 'diamonds', 'spades', 'hearts']);
export const RANKS = Object.freeze(Array.from({ length: 13 }, (_, index) => index + 2));
export const PASS_DIRECTIONS = Object.freeze(['left', 'right', 'across', 'hold']);
const FIRST_LEAD_ID = 'clubs-2';
const QUEEN_SPADES_ID = 'spades-12';

function randomIndex(random, length) {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a number in [0, 1).');
  return Math.floor(value * length);
}

export function createDeck() {
  return SUITS.flatMap((suit) => RANKS.map((rank) => ({ id: `${suit}-${rank}`, suit, rank })));
}

function shuffledDeck(random) {
  const deck = createDeck();
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swap = randomIndex(random, index + 1);
    [deck[index], deck[swap]] = [deck[swap], deck[index]];
  }
  return deck;
}

export function passCards(hands, direction, selectedByPlayer = []) {
  if (!Array.isArray(hands) || hands.length !== 4 || hands.some((hand) => !Array.isArray(hand) || hand.length !== 13)) throw new TypeError('Four complete 13-card hands are required.');
  if (!PASS_DIRECTIONS.includes(direction)) throw new RangeError('Unknown pass direction.');
  if (direction === 'hold') {
    if (selectedByPlayer.length) throw new RangeError('Do not select cards when holding.');
    return hands.map((hand) => hand.slice());
  }
  if (!Array.isArray(selectedByPlayer) || selectedByPlayer.length !== 4) throw new RangeError('Four sets of passing cards are required.');
  const outgoing = hands.map((hand, player) => {
    const selected = selectedByPlayer[player];
    if (!Array.isArray(selected) || selected.length !== 3 || new Set(selected).size !== 3) throw new RangeError('Each player must pass exactly three different cards.');
    const cards = hand.filter(({ id }) => selected.includes(id));
    if (cards.length !== 3) throw new RangeError('Each passed card must belong to that player.');
    return { selected, cards };
  });
  const offset = direction === 'left' ? 1 : direction === 'right' ? 3 : 2;
  return hands.map((hand, player) => [
    ...hand.filter(({ id }) => !outgoing[player].selected.includes(id)),
    ...outgoing[(player - offset + 4) % 4].cards,
  ]);
}

export function createHeartsGame({ random = Math.random, passDirection = 'left', humanCards = [] } = {}) {
  if (typeof random !== 'function') throw new TypeError('Random source must be a function.');
  const deck = shuffledDeck(random);
  const hands = Array.from({ length: 4 }, (_, player) => deck.slice(player * 13, (player + 1) * 13));
  return {
    hands,
    scores: [0, 0, 0, 0],
    tricks: [],
    currentPlayer: hands.findIndex((hand) => hand.some(({ id }) => id === FIRST_LEAD_ID)),
    leadPlayer: null,
    heartsBroken: false,
    passDirection,
    phase: passDirection === 'hold' ? 'playing' : 'passing',
    over: false,
  };
}

export function startHeartsHand(game, humanCards = []) {
  if (!game || game.phase !== 'passing') return null;
  if (game.passDirection === 'hold') return { ...game, phase: 'playing' };
  if (!Array.isArray(humanCards) || humanCards.length !== 3 || new Set(humanCards).size !== 3 || humanCards.filter((id) => game.hands[0].some((card) => card.id === id)).length !== 3) return null;
  const outgoing = game.hands.map((hand, player) => {
    const selected = player === 0 ? humanCards : chooseComputerPass(hand);
    return { selected, cards: hand.filter(({ id }) => selected.includes(id)) };
  });
  const offset = game.passDirection === 'left' ? 1 : game.passDirection === 'right' ? 3 : 2;
  const hands = game.hands.map((hand, player) => [
    ...hand.filter(({ id }) => !outgoing[player].selected.includes(id)),
    ...outgoing[(player - offset + 4) % 4].cards,
  ]);
  return { ...game, hands, currentPlayer: hands.findIndex((hand) => hand.some(({ id }) => id === FIRST_LEAD_ID)), phase: 'playing' };
}

function chooseComputerPass(hand) {
  return hand.slice().sort((a, b) => {
    const penalty = (card) => (card.id === QUEEN_SPADES_ID ? 100 : card.suit === 'spades' && card.rank >= 11 ? card.rank * 2 : 0);
    return penalty(b) - penalty(a) || b.rank - a.rank || a.id.localeCompare(b.id);
  }).slice(0, 3).map(({ id }) => id);
}

export function legalCards(game, player = game?.currentPlayer) {
  const hand = game?.hands?.[player];
  if (!game || game.over || game.phase !== 'playing' || !Array.isArray(hand) || !Number.isInteger(player) || player < 0 || player > 3) return [];
  if (!game.tricks.length && player === game.currentPlayer && hand.some(({ id }) => id === FIRST_LEAD_ID)) return hand.filter(({ id }) => id === FIRST_LEAD_ID);
  const activeTrick = game.tricks.at(-1);
  const plays = activeTrick?.plays ?? [];
  const completedTricks = game.tricks.filter(({ plays: trickPlays }) => trickPlays.length === 4).length;
  if (plays.length === 0) return game.heartsBroken ? hand : hand.filter(({ suit }) => suit !== 'hearts').length ? hand.filter(({ suit }) => suit !== 'hearts') : hand;
  const ledSuit = plays[0].card.suit;
  const follows = hand.filter(({ suit }) => suit === ledSuit);
  if (follows.length) return follows;
  if (completedTricks === 0) {
    const safe = hand.filter(({ id, suit }) => id !== QUEEN_SPADES_ID && suit !== 'hearts');
    if (safe.length) return safe;
  }
  return hand;
}

export function playCard(game, cardId) {
  if (!game || game.over) return null;
  const card = legalCards(game).find(({ id }) => id === cardId);
  if (!card) return null;
  const hands = game.hands.map((hand, player) => player === game.currentPlayer ? hand.filter(({ id }) => id !== cardId) : hand.slice());
  const prior = game.tricks.at(-1);
  const hasActiveTrick = Boolean(prior && prior.plays.length < 4);
  const plays = hasActiveTrick ? [...prior.plays, { player: game.currentPlayer, card }] : [{ player: game.currentPlayer, card }];
  const trick = { plays, winner: null, points: 0 };
  const tricks = hasActiveTrick ? [...game.tricks.slice(0, -1), trick] : [...game.tricks, trick];
  const heartsBroken = game.heartsBroken || card.suit === 'hearts';
  if (plays.length < 4) return { ...game, hands, tricks, currentPlayer: (game.currentPlayer + 1) % 4, heartsBroken, leadPlayer: game.leadPlayer ?? game.currentPlayer };
  const ledSuit = plays[0].card.suit;
  const winningPlay = plays.filter(({ card: played }) => played.suit === ledSuit).reduce((best, play) => play.card.rank > best.card.rank ? play : best);
  const points = plays.reduce((sum, { card: played }) => sum + (played.suit === 'hearts' ? 1 : played.id === QUEEN_SPADES_ID ? 13 : 0), 0);
  trick.winner = winningPlay.player;
  trick.points = points;
  const scores = game.scores.slice();
  scores[winningPlay.player] += points;
  const nextTricks = tricks;
  const over = hands.every((hand) => hand.length === 0);
  if (over) {
    if (scores.includes(26)) for (let index = 0; index < 4; index += 1) scores[index] = scores[index] === 26 ? 0 : 26;
  }
  return { ...game, hands, scores, tricks: nextTricks, currentPlayer: winningPlay.player, heartsBroken, leadPlayer: null, over };
}

export function chooseComputerCard(game, player = game?.currentPlayer) {
  const cards = legalCards(game, player);
  if (!cards.length) return null;
  const trick = game.tricks.at(-1);
  const ledSuit = trick?.plays?.[0]?.card?.suit;
  const currentWinner = trick?.plays?.filter(({ card }) => card.suit === ledSuit).reduce((best, play) => !best || play.card.rank > best.card.rank ? play : best, null);
  return cards.slice().sort((a, b) => {
    const aPoints = (a.suit === 'hearts' ? 1 : 0) + (a.id === QUEEN_SPADES_ID ? 13 : 0);
    const bPoints = (b.suit === 'hearts' ? 1 : 0) + (b.id === QUEEN_SPADES_ID ? 13 : 0);
    const aWins = Boolean(ledSuit && a.suit === ledSuit && (!currentWinner || a.rank > currentWinner.card.rank));
    const bWins = Boolean(ledSuit && b.suit === ledSuit && (!currentWinner || b.rank > currentWinner.card.rank));
    const aCost = aPoints + (aWins ? 100 : 0);
    const bCost = bPoints + (bWins ? 100 : 0);
    return aCost - bCost || a.rank - b.rank || a.id.localeCompare(b.id);
  })[0];
}

export function playComputerTurns(game, humanPlayer = 0) {
  let next = game;
  let guard = 0;
  while (next && !next.over && next.currentPlayer !== humanPlayer && guard < 4) {
    guard += 1;
    const card = chooseComputerCard(next);
    if (!card) break;
    next = playCard(next, card.id);
  }
  return next;
}

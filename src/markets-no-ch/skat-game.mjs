export const SKAT_BIDS = Object.freeze([18, 20, 22, 23, 24, 27, 30, 33, 35, 36, 40, 44, 45, 46, 48, 50, 54, 55, 59, 60, 63, 66, 70, 72, 77, 80, 81, 84, 88, 90, 96, 99, 100, 108, 110, 117, 120, 121, 126, 130, 132, 135, 140, 143, 144, 150, 153, 154, 156, 160, 162, 165, 168, 170, 171, 174, 176, 180, 187, 192, 198, 204, 216, 240, 264]);
export const SKAT_CARD_POINTS = Object.freeze([0, 0, 0, 2, 3, 4, 10, 11]);
export const SKAT_TARGET_POINTS = 61;

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const cardId = (card) => card.suit * 8 + card.rank;
const shuffle = (items, seed) => {
  let state = seed >>> 0;
  const random = () => { state = (state + 0x6d2b79f5) >>> 0; let t = state; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  for (let i = items.length - 1; i > 0; i -= 1) { const j = Math.floor(random() * (i + 1)); [items[i], items[j]] = [items[j], items[i]]; }
  return items;
};
const nextSeat = (seat) => (seat + 1) % 3;
const contractValue = (contract) => contract.kind === 'null' ? (contract.hand ? 35 : 23) : contract.kind === 'grand' ? 24 : [10, 9, 12, 11][contract.suit];
const JACK_STRENGTH = Object.freeze([1, 0, 3, 2]); // hearts, diamonds, clubs, spades
const JACK_ORDER = Object.freeze([2, 3, 0, 1]); // clubs, spades, hearts, diamonds
const isTrump = (card, contract) => contract.kind !== 'null' && (card.rank === 3 || (contract.kind === 'suit' && card.suit === contract.suit));

export function createSkatGame({ seed = Date.now() >>> 0, forehand = (seed >>> 0) % 3, scores = [0, 0, 0] } = {}) {
  assert(Number.isInteger(forehand) && forehand >= 0 && forehand < 3, 'Forehand must be one of the three seats.');
  assert(Array.isArray(scores) && scores.length === 3 && scores.every(Number.isFinite), 'Scores must contain three finite numbers.');
  const deck = shuffle(Array.from({ length: 32 }, (_, id) => ({ id, suit: Math.floor(id / 8), rank: id % 8 })), seed);
  const hands = [[], [], []];
  // The 3-2-4-3 deal is equivalent to ten cards per seat plus the two-card Skat.
  for (let packet = 0; packet < 3; packet += 1) for (let offset = 0; offset < 3; offset += 1) hands[(forehand + offset) % 3].push(deck.shift());
  const skat = deck.splice(0, 2);
  for (let packet = 0; packet < 4; packet += 1) for (let offset = 0; offset < 3; offset += 1) hands[(forehand + offset) % 3].push(deck.shift());
  for (let packet = 0; packet < 3; packet += 1) for (let offset = 0; offset < 3; offset += 1) hands[(forehand + offset) % 3].push(deck.shift());
  return {
    hands, skat, scores: [...scores], forehand, toMove: forehand,
    phase: 'auction', status: 'playing', auction: { bid: 0, bidder: null, passed: [] },
    declarer: null, contract: null, contractMatadors: null, trick: [], tricksWon: [0, 0, 0], pointsWon: [0, 0, 0],
    tricks: [], seed: seed >>> 0,
  };
}

export function skatCardCount(game) {
  return game.hands.flat().length + game.skat.length + game.trick.length + game.tricks.flat().length;
}

export function skatNextBid(current = 0) { return SKAT_BIDS.find((bid) => bid > current) ?? null; }

export function legalSkatCards(hand, trick, contract) {
  if (!hand.length || !trick.length) return [...hand];
  const lead = trick[0].card;
  const leadTrump = isTrump(lead, contract);
  const matching = hand.filter((card) => leadTrump ? isTrump(card, contract) : !isTrump(card, contract) && card.suit === lead.suit);
  return matching.length ? matching : [...hand];
}

function strength(card, lead, contract) {
  if (contract.kind === 'null') {
    const order = [7, 5, 4, 3, 6, 2, 1, 0]; // A, K, Q, J, 10, 9, 8, 7
    return card.suit === lead.suit ? 100 + (7 - order.indexOf(card.rank)) : 0;
  }
  if (isTrump(card, contract)) {
    if (card.rank === 3) return 300 + JACK_STRENGTH[card.suit];
    const trumpRankOrder = [7, 6, 5, 4, 2, 1, 0]; // A, 10, K, Q, 9, 8, 7
    return 200 + (trumpRankOrder.length - 1 - trumpRankOrder.indexOf(card.rank));
  }
  if (isTrump(lead, contract) || card.suit !== lead.suit) return 0;
  const suitOrder = [7, 6, 5, 4, 3, 2, 1, 0];
  return 100 + (7 - suitOrder.indexOf(card.rank));
}

export function winningSkatPlay(trick, contract) {
  assert(trick.length > 0, 'The trick is empty.');
  const lead = trick[0].card;
  return trick.reduce((winner, play) => strength(play.card, lead, contract) < strength(winner.card, lead, contract) ? winner : play);
}

function matadors(game) {
  const cards = game.contract.hand ? game.hands[game.declarer] : [...game.hands[game.declarer], ...game.skat];
  const jacks = JACK_ORDER.map((suit) => cards.some((card) => card.suit === suit && card.rank === 3));
  const withTop = jacks[0];
  let count = 0;
  for (const held of jacks) { if (held !== withTop) break; count += 1; }
  return count;
}

export function scoreSkatGame(game) {
  const { declarer, contract } = game;
  assert(Number.isInteger(declarer) && contract, 'A declarer and contract are required to score.');
  const defenders = [0, 1, 2].filter((seat) => seat !== declarer);
  const declarerPoints = game.pointsWon[declarer] + game.skat.reduce((sum, card) => sum + SKAT_CARD_POINTS[card.rank], 0);
  const defensePoints = 120 - declarerPoints;
  const tricks = game.tricksWon[declarer];
  let won = contract.kind === 'null' ? tricks === 0 : declarerPoints >= SKAT_TARGET_POINTS;
  let value;
  if (contract.kind === 'null') value = contractValue(contract);
  else {
    const top = game.contractMatadors ?? matadors(game);
    const opponents = 10 - tricks;
    const schneider = won ? defensePoints <= 30 : declarerPoints <= 30;
    const schwarz = won ? opponents === 0 : tricks === 0;
    const levels = 1 + top + Number(schneider) + Number(schwarz) + Number(contract.hand);
    value = contractValue(contract) * levels;
  }
  if (game.auction.bid > value) { won = false; value = Math.max(value, game.auction.bid); }
  const delta = won ? value : -2 * value;
  const roundScores = [0, 0, 0];
  if (won) roundScores[declarer] = delta;
  else {
    roundScores[declarer] = delta;
    for (const seat of defenders) roundScores[seat] = Math.ceil(-delta / 2);
  }
  game.roundScore = roundScores;
  game.scores = game.scores.map((score, seat) => score + roundScores[seat]);
  game.result = { won, value, declarerPoints, defensePoints, declarer, contract: { ...contract } };
  return game.result;
}

function finishSkatGame(game) {
  scoreSkatGame(game);
  game.phase = 'complete';
  game.status = 'complete';
  return game;
}

function estimateCpuBid(hand) {
  const jacks = hand.filter((card) => card.rank === 3).length;
  const aces = hand.filter((card) => card.rank === 7).length;
  const tens = hand.filter((card) => card.rank === 6).length;
  const suitCounts = [0, 1, 2, 3].map((suit) => hand.filter((card) => card.suit === suit).length);
  const strengthScore = jacks * 3 + aces * 2 + tens + Math.max(...suitCounts);
  return Math.min(90, 18 + Math.max(0, strengthScore - 8) * 6);
}

export function bidSkat(game, player, bid) {
  assert(game?.phase === 'auction' && game.status === 'playing' && game.toMove === player, 'It is not this player’s bidding turn.');
  assert(!game.auction.passed.includes(player), 'A player who passed cannot bid again.');
  if (bid === null || bid === 0) {
    game.auction.passed.push(player);
  } else {
    assert(SKAT_BIDS.includes(bid) && bid > game.auction.bid, 'Choose the next valid higher bid or pass.');
    game.auction.bid = bid;
    game.auction.bidder = player;
  }
  if (game.auction.passed.length === 3) {
    game.phase = 'redeal'; game.status = 'redeal'; return game;
  }
  if (game.auction.passed.length === 2 && game.auction.bidder === null) {
    game.toMove = [0, 1, 2].find((seat) => !game.auction.passed.includes(seat));
    return game;
  }
  if (game.auction.passed.length >= 2) {
    game.declarer = game.auction.bidder;
    game.phase = 'contract';
    game.toMove = game.declarer;
    return game;
  }
  let next = nextSeat(player);
  while (game.auction.passed.includes(next)) next = nextSeat(next);
  game.toMove = next;
  return game;
}

export function playSkatCpuAuction(game) {
  let safety = 0;
  while (game?.phase === 'auction' && game.toMove !== 0 && safety < 8) {
    safety += 1;
    const player = game.toMove;
    const nextBid = skatNextBid(game.auction.bid);
    const maxBid = estimateCpuBid(game.hands[player]);
    bidSkat(game, player, nextBid && nextBid <= maxBid ? nextBid : null);
  }
  return game;
}

function chooseCpuContract(hand) {
  const jacks = hand.filter((card) => card.rank === 3).length;
  const suits = [0, 1, 2, 3].map((suit) => hand.filter((card) => card.suit === suit).length + hand.filter((card) => card.rank === 3).length);
  const suit = suits.indexOf(Math.max(...suits));
  if (jacks >= 3 || suits[suit] >= 8) return { kind: 'suit', suit, hand: false };
  if (jacks >= 2) return { kind: 'grand', hand: false };
  return { kind: 'null', hand: false };
}

export function selectSkatContract(game, player, contract, discardIds = []) {
  assert(game?.phase === 'contract' && game.declarer === player && game.status === 'playing', 'Only the declarer may select the contract.');
  assert(contract && ['suit', 'grand', 'null'].includes(contract.kind), 'Choose a suit, Grand or Null contract.');
  assert(contract.kind !== 'suit' || Number.isInteger(contract.suit) && contract.suit >= 0 && contract.suit < 4, 'Choose a valid trump suit.');
  assert(Array.isArray(discardIds) && new Set(discardIds).size === (contract.hand ? 0 : 2), contract.hand ? 'A Hand contract does not discard cards into the Skat.' : 'Choose exactly two cards to discard into the Skat.');
  if (!contract.hand) {
    const available = new Set([...game.hands[player], ...game.skat].map((card) => card.id));
    assert(discardIds.every((id) => Number.isInteger(id) && available.has(id)), 'Choose two cards from the declarer’s hand or Skat.');
  }
  if (!contract.hand) game.hands[player].push(...game.skat);
  const hand = game.hands[player];
  const originalCards = [...hand];
  const discarded = discardIds.map((id) => hand.find((card) => card.id === id));
  for (const id of discardIds) hand.splice(hand.findIndex((card) => card.id === id), 1);
  if (!contract.hand) game.skat = discarded;
  game.contract = { ...contract };
  const jacks = JACK_ORDER.map((suit) => originalCards.some((card) => card.suit === suit && card.rank === 3));
  const withTop = jacks[0];
  game.contractMatadors = 0;
  for (const held of jacks) { if (held !== withTop) break; game.contractMatadors += 1; }
  game.phase = 'play';
  game.leader = game.forehand;
  game.toMove = game.leader;
  return game;
}

export function playSkatCard(game, player, id) {
  assert(game?.phase === 'play' && game.status === 'playing' && game.toMove === player, 'It is not this player’s turn.');
  const hand = game.hands[player];
  const legal = legalSkatCards(hand, game.trick, game.contract);
  const card = hand.find((entry) => entry.id === id);
  assert(card && legal.some((entry) => entry.id === id), 'You must follow the led suit or trump when possible.');
  hand.splice(hand.findIndex((entry) => entry.id === id), 1);
  game.trick.push({ player, card });
  if (game.trick.length < 3) { game.toMove = nextSeat(player); return game; }
  const winner = winningSkatPlay(game.trick, game.contract);
  const points = game.trick.reduce((sum, play) => sum + SKAT_CARD_POINTS[play.card.rank], 0);
  game.pointsWon[winner.player] += points;
  game.tricksWon[winner.player] += 1;
  game.tricks.push([...game.trick]);
  game.trick = [];
  game.leader = winner.player;
  if (game.hands.every((cards) => cards.length === 0)) return finishSkatGame(game);
  game.toMove = game.leader;
  return game;
}

function currentTrickWinnerSeat(game) { return game.trick.length ? winningSkatPlay(game.trick, game.contract).player : null; }

export function chooseSkatCpuCard(game, player) {
  assert(game?.phase === 'play' && game.toMove === player, 'The CPU is not due to play.');
  const legal = legalSkatCards(game.hands[player], game.trick, game.contract);
  const actingFor = player === game.declarer ? 'declarer' : 'defense';
  const currentWinner = currentTrickWinnerSeat(game);
  const currentWinnerIsDeclarer = currentWinner === game.declarer;
  const shouldWin = actingFor === 'declarer' ? currentWinner !== player : currentWinnerIsDeclarer;
  const ranked = legal.map((card) => ({ card, strength: game.trick.length ? strength(card, game.trick[0].card, game.contract) : 0, points: SKAT_CARD_POINTS[card.rank] }));
  const canWin = ranked.filter(({ strength: value }) => !game.trick.length || value > strength(winningSkatPlay(game.trick, game.contract).card, game.trick[0].card, game.contract));
  if (shouldWin && canWin.length) return [...canWin].sort((a, b) => a.points - b.points || a.strength - b.strength)[0].card.id;
  return [...ranked].sort((a, b) => a.points - b.points || a.strength - b.strength)[0].card.id;
}

export function playSkatCpuUntilHuman(game) {
  let safety = 0;
  while (game?.phase === 'play' && game.status === 'playing' && game.toMove !== 0 && safety < 3) {
    safety += 1;
    playSkatCard(game, game.toMove, chooseSkatCpuCard(game, game.toMove));
  }
  return game;
}

export function finishSkatCpuContract(game, player) {
  assert(game?.phase === 'contract' && game.declarer === player, 'This CPU cannot select the contract.');
  const contract = chooseCpuContract(game.hands[player]);
  const discard = [...game.hands[player], ...game.skat].sort((a, b) => SKAT_CARD_POINTS[a.rank] - SKAT_CARD_POINTS[b.rank]).slice(0, 2).map((card) => card.id);
  return selectSkatContract(game, player, contract, discard);
}

export const skatCard = Object.freeze({ id: cardId, label: (card) => `${card.suit}:${card.rank}` });

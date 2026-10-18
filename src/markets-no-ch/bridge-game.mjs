export const BRIDGE_SUITS = Object.freeze(['clubs', 'diamonds', 'hearts', 'spades', 'notrump']);
export const BRIDGE_SEATS = Object.freeze(['north', 'east', 'south', 'west']);
const PARTNERSHIP = Object.freeze([0, 1, 0, 1]);
const assert = (condition, message) => { if (!condition) throw new Error(message); };

function randomFor(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function createBridgeDeck(seed = 1) {
  const deck = Array.from({ length: 52 }, (_, id) => ({ id, suit: Math.floor(id / 13), rank: (id % 13) + 2 }));
  const random = randomFor(seed);
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [deck[index], deck[other]] = [deck[other], deck[index]];
  }
  return deck;
}

function validateVulnerability(value) {
  assert(['none', 'ns', 'ew', 'both'].includes(value), 'Choose a valid vulnerability.');
  return value;
}

function deal({ seed, dealer, vulnerability, scores, handNumber }) {
  const deck = createBridgeDeck(seed);
  const hands = Array.from({ length: 4 }, () => []);
  deck.forEach((card, index) => hands[index % 4].push(card));
  hands.forEach((hand) => hand.sort((a, b) => b.suit - a.suit || b.rank - a.rank));
  return {
    hands, deckCount: deck.length, dealer, toMove: dealer, vulnerability, scores: [...scores], handNumber,
    phase: 'auction', status: 'playing', auction: [], consecutivePasses: 0, highestBid: null,
    contract: null, declarer: null, leader: null, dummy: null, openingLeadMade: false,
    trick: [], tricks: [], tricksWon: [0, 0], result: null, seed: seed >>> 0,
  };
}

export function createBridgeGame({ seed = Date.now() >>> 0, dealer = (seed >>> 0) % 4, vulnerability = 'none', scores = [0, 0], handNumber = 1 } = {}) {
  assert(Number.isInteger(dealer) && dealer >= 0 && dealer < 4, 'Dealer must be a seat from 0 to 3.');
  assert(Number.isInteger(handNumber) && handNumber >= 1, 'Hand number must be a positive whole number.');
  assert(Array.isArray(scores) && scores.length === 2 && scores.every(Number.isFinite), 'Scores must contain two finite numbers.');
  return deal({ seed: seed >>> 0 || 1, dealer, vulnerability: validateVulnerability(vulnerability), scores, handNumber });
}

export function bridgeCardCount(game) {
  return game.hands.flat().length + game.trick.length + game.tricks.flat().length;
}

function isHigherBid(candidate, current) {
  return !current || candidate.level > current.level || (candidate.level === current.level && candidate.strain > current.strain);
}

export function legalBridgeCalls(game, seat = game?.toMove) {
  if (!game || game.phase !== 'auction' || game.status !== 'playing' || game.toMove !== seat) return [];
  const calls = [{ type: 'pass' }];
  for (let level = 1; level <= 7; level += 1) {
    for (let strain = 0; strain < BRIDGE_SUITS.length; strain += 1) {
      const bid = { type: 'bid', level, strain };
      if (isHigherBid(bid, game.highestBid)) calls.push(bid);
    }
  }
  const lastContract = game.highestBid;
  const lastNonPass = [...game.auction].reverse().find(({ type }) => type !== 'pass');
  if (lastContract && PARTNERSHIP[seat] !== PARTNERSHIP[lastContract.side] && lastNonPass?.type === 'bid') calls.push({ type: 'double' });
  if (lastContract && PARTNERSHIP[seat] === PARTNERSHIP[lastContract.side] && lastNonPass?.type === 'double') calls.push({ type: 'redouble' });
  return calls;
}

function finalizeAuction(game) {
  if (!game.highestBid) {
    game.phase = 'passedOut'; game.status = 'complete';
    game.result = { passedOut: true, score: 0 };
    return game;
  }
  const finalBid = game.highestBid;
  const firstDeclarer = game.auction.find((call) => call.type === 'bid' && call.strain === finalBid.strain && PARTNERSHIP[call.seat] === PARTNERSHIP[finalBid.side]);
  assert(firstDeclarer, 'The final contract must have a declarer.');
  game.contract = { level: finalBid.level, strain: finalBid.strain, side: finalBid.side, doubled: finalBid.doubled };
  game.declarer = firstDeclarer.seat;
  game.dummy = (game.declarer + 2) % 4;
  game.leader = (game.declarer + 1) % 4;
  game.toMove = game.leader;
  game.phase = 'play';
  return game;
}

export function callBridge(game, seat, call) {
  const legal = legalBridgeCalls(game, seat);
  assert(legal.some((candidate) => candidate.type === call?.type && (candidate.type !== 'bid' || (candidate.level === call.level && candidate.strain === call.strain))), 'That call is not legal in this auction.');
  if (call.type === 'bid') {
    game.highestBid = { ...call, side: PARTNERSHIP[seat], doubled: 0 };
  } else if (call.type === 'double') {
    game.highestBid.doubled = 1;
  } else if (call.type === 'redouble') {
    game.highestBid.doubled = 2;
  }
  const recorded = call.type === 'bid' ? { ...call, side: PARTNERSHIP[seat], seat } : { ...call, seat };
  game.auction.push(recorded);
  game.consecutivePasses = call.type === 'pass' ? game.consecutivePasses + 1 : 0;
  if ((!game.highestBid && game.consecutivePasses === 4) || (game.highestBid && game.consecutivePasses === 3)) finalizeAuction(game);
  else game.toMove = (seat + 1) % 4;
  return game;
}

export function bridgeHighCardPoints(hand) {
  return hand.reduce((sum, { rank }) => sum + (rank === 14 ? 4 : rank === 13 ? 3 : rank === 12 ? 2 : rank === 11 ? 1 : 0), 0);
}

function balancedHand(hand) {
  const counts = Array(4).fill(0);
  hand.forEach(({ suit }) => { counts[suit] += 1; });
  return Math.max(...counts) <= 5 && Math.min(...counts) >= 2;
}

function longestSuit(hand, minimum = 4) {
  const counts = Array(4).fill(0);
  hand.forEach(({ suit }) => { counts[suit] += 1; });
  return counts.map((length, strain) => ({ length, strain })).filter(({ length }) => length >= minimum).sort((a, b) => b.length - a.length || b.strain - a.strain)[0]?.strain ?? null;
}

function partnershipHasOpened(game, side) {
  return game.auction.some((call) => call.type === 'bid' && call.side === side);
}

export function chooseBridgeCpuCall(game, seat = game?.toMove) {
  assert(game?.phase === 'auction' && game.toMove === seat, 'This seat is not due to call.');
  const hand = game.hands[seat];
  const points = bridgeHighCardPoints(hand);
  const side = PARTNERSHIP[seat];
  const partner = (seat + 2) % 4;
  const contract = game.highestBid;
  if (!contract) {
    if (points >= 15 && points <= 17 && balancedHand(hand)) return { type: 'bid', level: 1, strain: 4 };
    if (points >= 12) {
      const suit = longestSuit(hand, 5) ?? longestSuit(hand, 4);
      if (suit !== null) return { type: 'bid', level: 1, strain: suit };
      if (points >= 15 && balancedHand(hand)) return { type: 'bid', level: 1, strain: 4 };
    }
    return { type: 'pass' };
  }
  const partnerOpened = game.auction.some((call) => call.type === 'bid' && call.seat === partner);
  const seatAlreadyBid = game.auction.some((call) => call.seat === seat && call.type === 'bid');
  if (contract.side === side && partnerOpened && !seatAlreadyBid && points >= 6) {
    if (contract.strain < 4) {
      const support = hand.filter(({ suit }) => suit === contract.strain).length;
      if (support >= 3 && contract.level < 3) return { type: 'bid', level: Math.min(3, contract.level + 1), strain: contract.strain };
      const newSuit = longestSuit(hand, 4);
      if (newSuit !== null && newSuit > contract.strain) return { type: 'bid', level: contract.level, strain: newSuit };
      if (balancedHand(hand) && points <= 10 && contract.level === 1) return { type: 'bid', level: 1, strain: 4 };
    } else if (contract.strain === 4 && balancedHand(hand) && points >= 8 && contract.level < 3) {
      return { type: 'bid', level: points >= 10 ? 3 : 2, strain: 4 };
    }
  }
  if (contract.side !== side && points >= 13) {
    const suit = longestSuit(hand, 5);
    if (suit !== null && isHigherBid({ level: contract.level, strain: suit }, contract)) return { type: 'bid', level: contract.level, strain: suit };
  }
  return { type: 'pass' };
}

export function runBridgeCpuAuction(game, humanSeat = 2) {
  let safety = 0;
  while (game?.phase === 'auction' && game.status === 'playing' && game.toMove !== humanSeat && safety < 80) {
    safety += 1;
    const seat = game.toMove;
    callBridge(game, seat, chooseBridgeCpuCall(game, seat));
  }
  assert(safety < 80 || game.phase !== 'auction', 'CPU auction exceeded its safety limit.');
  return game;
}

export function legalBridgeCards(game, seat = game?.toMove) {
  if (!game || game.phase !== 'play' || game.status !== 'playing' || game.toMove !== seat) return [];
  const hand = seat === game.dummy && game.openingLeadMade ? game.hands[game.dummy] : game.hands[seat];
  const leadSuit = game.trick[0]?.card.suit;
  if (leadSuit === undefined) return [...hand];
  const follow = hand.filter(({ suit }) => suit === leadSuit);
  return follow.length ? follow : [...hand];
}

function cardBeats(candidate, incumbent, leadSuit, trumpSuit) {
  if (candidate.suit === incumbent.suit) return candidate.rank > incumbent.rank;
  if (candidate.suit === trumpSuit && incumbent.suit !== trumpSuit) return true;
  if (incumbent.suit === trumpSuit) return false;
  return candidate.suit === leadSuit && incumbent.suit !== leadSuit;
}

export function winningBridgePlay(trick, trumpSuit = null) {
  assert(Array.isArray(trick) && trick.length > 0, 'The trick is empty.');
  const leadSuit = trick[0].card.suit;
  return trick.reduce((winner, play) => cardBeats(play.card, winner.card, leadSuit, trumpSuit) ? play : winner);
}

export function playBridgeCard(game, seat, cardId, actingSeat = seat) {
  assert(game?.phase === 'play' && game.status === 'playing' && game.toMove === seat, 'It is not this seat’s turn.');
  assert(seat !== game.dummy || (game.openingLeadMade && actingSeat === game.declarer), 'Only the declarer may play dummy after the opening lead.');
  const hand = game.hands[seat];
  const legal = legalBridgeCards(game, seat);
  const card = hand.find(({ id }) => id === cardId);
  assert(card && legal.some(({ id }) => id === cardId), 'Follow suit when possible and play a card from the active hand.');
  hand.splice(hand.findIndex(({ id }) => id === cardId), 1);
  game.trick.push({ seat, card });
  if (!game.openingLeadMade) game.openingLeadMade = true;
  if (game.trick.length === 4) {
    const winner = winningBridgePlay(game.trick, game.contract.strain === 4 ? null : game.contract.strain);
    game.tricksWon[PARTNERSHIP[winner.seat]] += 1;
    game.tricks.push([...game.trick]);
    game.trick = [];
    game.leader = winner.seat;
    if (game.tricks.length === 13) finishBridgeHand(game);
    else game.toMove = winner.seat;
  } else game.toMove = (seat + 1) % 4;
  return game;
}

function isVulnerable(game, side) { return game.vulnerability === 'both' || (game.vulnerability === 'ns' && side === 0) || (game.vulnerability === 'ew' && side === 1); }

export function scoreBridgeDuplicate(contract, tricksMade, vulnerable = false) {
  assert(contract && Number.isInteger(contract.level) && contract.level >= 1 && contract.level <= 7 && Number.isInteger(contract.strain) && contract.strain >= 0 && contract.strain <= 4 && Number.isInteger(contract.doubled) && contract.doubled >= 0 && contract.doubled <= 2, 'Invalid bridge contract.');
  assert(Number.isInteger(tricksMade) && tricksMade >= 0 && tricksMade <= 13, 'Tricks made must be between 0 and 13.');
  const required = 6 + contract.level;
  const factor = contract.doubled === 0 ? 1 : contract.doubled === 1 ? 2 : 4;
  const vulnerableFlag = Boolean(vulnerable);
  if (tricksMade < required) {
    const down = required - tricksMade;
    let penalty;
    if (contract.doubled === 0) penalty = down * (vulnerableFlag ? 100 : 50);
    else {
      const first = vulnerableFlag ? 200 : 100;
      const secondThird = vulnerableFlag ? 300 : 200;
      penalty = first + Math.min(down - 1, 2) * secondThird + Math.max(0, down - 3) * 300;
      if (contract.doubled === 2) penalty *= 2;
    }
    return Object.freeze({ made: false, required, tricksMade, overtricks: 0, undertricks: down, declarerScore: -penalty, trickPoints: 0, bonus: 0 });
  }
  const overtricks = tricksMade - required;
  const basePerTrick = contract.strain >= 2 && contract.strain <= 3 ? 30 : 20;
  const rawTrickPoints = contract.strain === 4 ? 40 + Math.max(0, contract.level - 1) * 30 : contract.level * basePerTrick;
  const trickPoints = rawTrickPoints * factor;
  let bonus = trickPoints >= 100 ? (vulnerableFlag ? 500 : 300) : 50;
  if (contract.strain === 4) bonus = trickPoints >= 100 ? (vulnerableFlag ? 500 : 300) : 50;
  if (contract.level === 6) bonus += vulnerableFlag ? 750 : 500;
  if (contract.level === 7) bonus += vulnerableFlag ? 1500 : 1000;
  if (contract.doubled === 1) bonus += 50;
  if (contract.doubled === 2) bonus += 100;
  const undoubledOvertrick = contract.strain === 4 ? 30 : basePerTrick;
  const overtrickValue = contract.doubled === 0 ? undoubledOvertrick : contract.doubled === 1 ? (vulnerableFlag ? 200 : 100) : (vulnerableFlag ? 400 : 200);
  return Object.freeze({ made: true, required, tricksMade, overtricks, undertricks: 0, declarerScore: trickPoints + bonus + overtricks * overtrickValue, trickPoints, bonus });
}

function finishBridgeHand(game) {
  const tricksMade = game.tricksWon[game.contract.side];
  const score = scoreBridgeDuplicate(game.contract, tricksMade, isVulnerable(game, game.contract.side));
  const signed = game.contract.side === 0 ? score.declarerScore : -score.declarerScore;
  game.scores[0] += signed;
  game.scores[1] -= signed;
  game.result = { ...score, contract: { ...game.contract }, declarer: game.declarer, dummy: game.dummy, tricksBySide: [...game.tricksWon], vulnerability: game.vulnerability, signedScore: signed };
  game.phase = 'complete';
  game.status = 'complete';
}

export function chooseBridgeCpuCard(game, seat = game?.toMove) {
  assert(game?.phase === 'play' && game.toMove === seat, 'This seat is not due to play.');
  const hand = seat === game.dummy && game.openingLeadMade ? game.hands[game.dummy] : game.hands[seat];
  const legal = legalBridgeCards(game, seat);
  if (!game.trick.length) return [...legal].sort((a, b) => a.rank - b.rank || a.suit - b.suit)[0].id;
  const incumbent = winningBridgePlay(game.trick, game.contract.strain === 4 ? null : game.contract.strain);
  const seatSide = PARTNERSHIP[seat];
  const currentSide = PARTNERSHIP[incumbent.seat];
  const canWin = legal.filter((card) => cardBeats(card, incumbent.card, game.trick[0].card.suit, game.contract.strain === 4 ? null : game.contract.strain)).sort((a, b) => a.rank - b.rank);
  if (canWin.length && currentSide !== seatSide) return canWin[0].id;
  return [...legal].sort((a, b) => a.rank - b.rank)[0].id;
}

export function runBridgeCpuPlay(game, humanSeat = 2) {
  let safety = 0;
  const controlledByHuman = (seat) => seat === humanSeat && seat !== game.dummy || game.declarer === humanSeat && seat === game.dummy;
  while (game?.phase === 'play' && game.status === 'playing' && !controlledByHuman(game.toMove) && safety < 52) {
    safety += 1;
    const seat = game.toMove;
    const actingSeat = seat === game.dummy ? game.declarer : seat;
    playBridgeCard(game, seat, chooseBridgeCpuCard(game, seat), actingSeat);
  }
  assert(safety < 52 || game.phase !== 'play', 'CPU play exceeded its safety limit.');
  return game;
}

export function startNextBridgeHand(game, { vulnerability = game.vulnerability } = {}) {
  assert(game?.status === 'complete', 'Finish the current hand before dealing another.');
  const nextSeed = (game.seed + 0x9e3779b9) >>> 0 || 1;
  const nextNumber = game.handNumber + 1;
  return deal({ seed: nextSeed, dealer: (game.dealer + 1) % 4, vulnerability: validateVulnerability(vulnerability), scores: game.scores, handNumber: nextNumber });
}

export const bridgeCard = Object.freeze({ label: (card) => `${card.suit}:${card.rank}` });

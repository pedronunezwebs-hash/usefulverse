export const DOKO_RANKS = Object.freeze(['9', 'J', 'Q', 'K', '10', 'A']);
export const DOKO_SUITS = Object.freeze(['hearts', 'diamonds', 'clubs', 'spades']);
export const DOKO_CARD_POINTS = Object.freeze([0, 2, 3, 4, 10, 11]);
export const DOKO_TRUMP_ORDER = Object.freeze([
  '0:4', '2:2', '3:2', '0:2', '1:2', '2:1', '3:1', '0:1', '1:1', '1:5', '1:4', '1:3', '1:0',
]);

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const nextSeat = (seat) => (seat + 1) % 4;
const keyOf = (card) => `${card.suit}:${card.rank}`;
const cardPoints = (card) => DOKO_CARD_POINTS[card.rank];
const isTrump = (card) => DOKO_TRUMP_ORDER.includes(keyOf(card));
const seededRandom = (seed) => {
  let state = seed >>> 0;
  return () => { state = (state + 0x6d2b79f5) >>> 0; let value = state; value = Math.imul(value ^ (value >>> 15), value | 1); value ^= value + Math.imul(value ^ (value >>> 7), value | 61); return ((value ^ (value >>> 14)) >>> 0) / 4294967296; };
};

export function createDoppelkopfDeck(seed = 1) {
  const cards = [];
  for (let suit = 0; suit < 4; suit += 1) {
    for (let rank = 0; rank < 6; rank += 1) {
      for (let copy = 0; copy < 2; copy += 1) cards.push({ id: suit * 12 + rank * 2 + copy, suit, rank, copy });
    }
  }
  const random = seededRandom(seed);
  for (let index = cards.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [cards[index], cards[swap]] = [cards[swap], cards[index]];
  }
  return cards;
}

function sideAtDeal(hand) {
  return hand.some((card) => card.suit === 2 && card.rank === 2) ? 're' : 'kontra';
}

export function createDoppelkopfGame({ seed = Date.now() >>> 0, leader = (seed >>> 0) % 4, scores = [0, 0, 0, 0] } = {}) {
  assert(Number.isInteger(leader) && leader >= 0 && leader < 4, 'The first player must be one of four seats.');
  assert(Array.isArray(scores) && scores.length === 4 && scores.every(Number.isFinite), 'Scores must contain four finite numbers.');
  const deck = createDoppelkopfDeck(seed);
  const hands = Array.from({ length: 4 }, () => []);
  for (let card = 0; card < deck.length; card += 1) hands[(leader + card) % 4].push(deck[card]);
  const weddingSeat = hands.findIndex((hand) => hand.filter((card) => card.suit === 2 && card.rank === 2).length === 2);
  const teams = weddingSeat >= 0 ? hands.map((_, seat) => seat === weddingSeat ? 're' : null) : hands.map(sideAtDeal);
  const owners = Array(48);
  for (let seat = 0; seat < 4; seat += 1) for (const card of hands[seat]) owners[card.id] = seat;
  return {
    hands, teams, owners, scores: [...scores], leader, toMove: leader, phase: 'play', status: 'playing',
    trick: [], tricks: [], pointsWon: { re: 0, kontra: 0 }, tricksWon: { re: 0, kontra: 0 },
    announcements: { re: false, kontra: false }, announcementEvents: [],
    wedding: weddingSeat < 0 ? null : { seat: weddingSeat, status: 'pending', resolvedAt: null },
    specialPoints: { re: 0, kontra: 0 }, seed: seed >>> 0,
  };
}

export function doppelkopfCardCount(game) {
  return game.hands.flat().length + game.trick.length + game.tricks.flat().reduce((sum, trick) => sum + trick.plays.length, 0);
}

export function doppelkopfIsTrump(card) { return isTrump(card); }

function trumpStrength(card) {
  const position = DOKO_TRUMP_ORDER.indexOf(keyOf(card));
  return position < 0 ? -1 : DOKO_TRUMP_ORDER.length - position;
}

function plainStrength(card) {
  const order = card.suit === 0 ? [5, 3, 0] : [5, 4, 3, 0];
  const position = order.indexOf(card.rank);
  return position < 0 ? 0 : order.length - position;
}

function beatsDoppelkopfCard(card, current, lead) {
  const cardTrump = isTrump(card);
  const currentTrump = isTrump(current);
  if (cardTrump !== currentTrump) return cardTrump;
  if (cardTrump) return trumpStrength(card) > trumpStrength(current);
  if (card.suit !== lead.suit) return false;
  if (current.suit !== lead.suit) return true;
  return plainStrength(card) > plainStrength(current);
}

export function winningDoppelkopfPlay(plays) {
  assert(Array.isArray(plays) && plays.length > 0, 'A trick must contain at least one card.');
  const lead = plays[0].card;
  return plays.reduce((winner, play) => beatsDoppelkopfCard(play.card, winner.card, lead) ? play : winner);
}

export function legalDoppelkopfCards(hand, trick) {
  if (!hand.length || !trick.length) return [...hand];
  const lead = trick[0].card;
  const matching = hand.filter((card) => isTrump(lead) ? isTrump(card) : !isTrump(card) && card.suit === lead.suit);
  return matching.length ? matching : [...hand];
}

export function canAnnounceDoppelkopf(game, seat) {
  if (!game || game.status !== 'playing' || game.toMove !== seat || game.announcements[game.teams[seat]] || !game.teams[seat]) return false;
  const cardsInHand = game.hands[seat]?.length ?? 0;
  if (!game.wedding) return game.tricks.length === 0 && cardsInHand >= 11;
  if (game.wedding.status === 'pending') return false;
  const latest = 12 - game.wedding.resolvedAt;
  return game.tricks.length === game.wedding.resolvedAt && cardsInHand >= latest;
}

export function announceDoppelkopf(game, seat) {
  assert(canAnnounceDoppelkopf(game, seat), 'An announcement is not available now.');
  const side = game.teams[seat];
  game.announcements[side] = true;
  game.announcementEvents.push({ seat, side, trick: game.tricks.length + 1 });
  return game;
}

function addSpecialPoint(game, side, count = 1) {
  if (side === 're' || side === 'kontra') game.specialPoints[side] += count;
}

function resolveWedding(game, winnerSeat) {
  if (!game.wedding || game.wedding.status !== 'pending') return;
  const weddingSeat = game.wedding.seat;
  const completed = game.tricks.length;
  if (winnerSeat !== weddingSeat) {
    game.teams = game.teams.map((_, seat) => seat === weddingSeat || seat === winnerSeat ? 're' : 'kontra');
    game.wedding.status = 'partnerFound';
    game.wedding.partner = winnerSeat;
    game.wedding.resolvedAt = completed;
    return;
  }
  if (completed >= 3) {
    game.teams = game.teams.map((_, seat) => seat === weddingSeat ? 're' : 'kontra');
    game.wedding.status = 'diamondSolo';
    game.wedding.resolvedAt = completed;
  }
}

function recordTrickSpecials(game, trick, winnerSeat, trickEyes, index) {
  if (game.wedding?.status === 'diamondSolo') return;
  const winnerSide = game.teams[winnerSeat];
  if (!winnerSide) return;
  if (trickEyes >= 40) addSpecialPoint(game, winnerSide);
  for (const play of trick) {
    if (play.card.suit === 1 && play.card.rank === 5 && game.teams[game.owners[play.card.id]] !== winnerSide) addSpecialPoint(game, winnerSide);
  }
  if (index === 11 && trick.some((play) => play.seat === winnerSeat && play.card.suit === 2 && play.card.rank === 1)) addSpecialPoint(game, winnerSide);
}

function recalculateDoppelkopfTotals(game) {
  game.pointsWon = { re: 0, kontra: 0 };
  game.tricksWon = { re: 0, kontra: 0 };
  game.specialPoints = { re: 0, kontra: 0 };
  game.tricks.forEach((trick, index) => {
    const side = game.teams[trick.winner];
    if (!side) return;
    game.pointsWon[side] += trick.eyes;
    game.tricksWon[side] += 1;
    recordTrickSpecials(game, trick.plays, trick.winner, trick.eyes, index);
  });
}

export function scoreDoppelkopfGame(game) {
  const reEyes = game.pointsWon.re;
  const kontraEyes = game.pointsWon.kontra;
  const solo = game.wedding?.status === 'diamondSolo';
  const reThreshold = game.announcements.kontra && !game.announcements.re ? 120 : 121;
  const reWon = reEyes >= reThreshold;
  const winner = reWon ? 're' : 'kontra';
  const loser = reWon ? 'kontra' : 're';
  if (!solo && winner === 'kontra') game.specialPoints.kontra += 1; // won against the club queens
  const loserEyes = game.pointsWon[loser];
  let value = 1 + Number(loserEyes < 90) + Number(loserEyes < 60) + Number(loserEyes < 30) + Number(loserEyes === 0);
  if (!solo) value += Number(game.announcements.re) * 2 + Number(game.announcements.kontra) * 2;
  else value += 0;
  if (!solo) value += game.specialPoints[winner] - game.specialPoints[loser];
  value = Math.max(1, value);
  const reDelta = solo
    ? winner === 're' ? value * 3 : -value * 3
    : winner === 're' ? value : -value;
  const roundScore = game.teams.map((side, seat) => solo ? (seat === game.wedding.seat ? reDelta : -Math.sign(reDelta) * value) : side === 're' ? reDelta : -reDelta);
  game.scores = game.scores.map((score, seat) => score + roundScore[seat]);
  game.roundScore = roundScore;
  game.result = { winner, reEyes, kontraEyes, value, solo, announcements: { ...game.announcements }, specialPoints: { ...game.specialPoints } };
  game.phase = 'complete';
  game.status = 'complete';
  return game.result;
}

export function playDoppelkopfCard(game, seat, id) {
  assert(game?.status === 'playing' && game.phase === 'play' && game.toMove === seat, 'It is not this player’s turn.');
  const hand = game.hands[seat];
  const index = hand.findIndex((card) => card.id === id);
  assert(index >= 0, 'Choose a card in your hand.');
  const legal = legalDoppelkopfCards(hand, game.trick);
  assert(legal.some((card) => card.id === id), 'You must follow the led suit or trump when possible.');
  const [played] = hand.splice(index, 1);
  game.trick.push({ seat, card: played });
  if (game.trick.length < 4) {
    game.toMove = nextSeat(seat);
    return game;
  }
  const trick = [...game.trick];
  const winnerPlay = winningDoppelkopfPlay(trick);
  const winnerSeat = winnerPlay.seat;
  const trickEyes = trick.reduce((sum, play) => sum + cardPoints(play.card), 0);
  game.tricks.push({ plays: trick, winner: winnerSeat, eyes: trickEyes });
  game.trick = [];
  resolveWedding(game, winnerSeat);
  recalculateDoppelkopfTotals(game);
  game.leader = winnerSeat;
  game.toMove = winnerSeat;
  if (game.tricks.length === 12) scoreDoppelkopfGame(game);
  return game;
}

function handStrength(hand) {
  return hand.reduce((sum, card) => sum + (card.suit === 2 && card.rank === 2 ? 4 : 0) + (card.suit === 0 && card.rank === 4 ? 3 : 0)
    + (isTrump(card) ? 2 : 0) + (card.rank === 5 && !isTrump(card) ? 1 : 0), 0);
}

function faceValue(card) { return cardPoints(card); }

export function chooseDoppelkopfCpuCard(game, seat) {
  assert(game?.status === 'playing' && game.toMove === seat, 'It is not this CPU’s turn.');
  const legal = legalDoppelkopfCards(game.hands[seat], game.trick);
  const currentWinner = game.trick.length ? winningDoppelkopfPlay(game.trick) : null;
  const currentSide = currentWinner ? game.teams[currentWinner.seat] : null;
  const cpuSide = game.teams[seat];
  return [...legal].sort((a, b) => {
    const aWins = game.trick.length > 0 && winningDoppelkopfPlay([...game.trick, { seat, card: a }]).seat === seat;
    const bWins = game.trick.length > 0 && winningDoppelkopfPlay([...game.trick, { seat, card: b }]).seat === seat;
    let aCost = faceValue(a) + Number(isTrump(a)) * 3;
    let bCost = faceValue(b) + Number(isTrump(b)) * 3;
    if (!game.trick.length) { aCost -= Number(isTrump(a)) * 2; bCost -= Number(isTrump(b)) * 2; }
    else if (currentSide && cpuSide && currentSide !== cpuSide) {
      aCost += aWins ? -18 : 0; bCost += bWins ? -18 : 0;
      aCost -= (aWins ? faceValue(a) : 0) * 0.4; bCost -= (bWins ? faceValue(b) : 0) * 0.4;
    } else if (currentSide === cpuSide) {
      aCost += aWins ? 8 : 0; bCost += bWins ? 8 : 0;
    }
    return aCost - bCost || a.id - b.id;
  })[0].id;
}

export function playDoppelkopfCpuTurn(game, seat) {
  assert(game?.status === 'playing' && game.toMove === seat && seat !== 0, 'It is not a CPU turn.');
  if (canAnnounceDoppelkopf(game, seat) && handStrength(game.hands[seat]) >= 19) announceDoppelkopf(game, seat);
  return playDoppelkopfCard(game, seat, chooseDoppelkopfCpuCard(game, seat));
}


export const SCHAFKOPF_SUITS = Object.freeze(['eichel', 'gras', 'heart', 'schellen']);
export const SCHAFKOPF_RANKS = Object.freeze(['seven', 'eight', 'nine', 'ten', 'king', 'ober', 'unter', 'sau']);
export const SCHAFKOPF_EYES = Object.freeze([0, 0, 0, 10, 4, 3, 2, 11]);
const assert = (ok, message) => { if (!ok) throw new Error(message); };
const next = (seat) => (seat + 1) % 4;
const card = (id) => ({ id, suit: Math.floor(id / 8), rank: id % 8 });
const shuffled = (seed) => {
  const cards = Array.from({ length: 32 }, (_, id) => card(id)); let state = seed >>> 0;
  const random = () => { state = (state + 0x6d2b79f5) >>> 0; let t = state; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  for (let i = cards.length - 1; i > 0; i -= 1) { const j = Math.floor(random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
  return cards;
};

export function schafkopfIsTrump(c, calledSuit) {
  return c.suit === 2 || c.rank === 5 || c.rank === 6;
}
export function legalSchafkopfCards(hand, trick, calledSuit) {
  if (!trick.length) return [...hand];
  const lead = trick[0].card;
  const matching = schafkopfIsTrump(lead, calledSuit)
    ? hand.filter((item) => schafkopfIsTrump(item, calledSuit))
    : hand.filter((item) => !schafkopfIsTrump(item, calledSuit) && item.suit === lead.suit);
  return matching.length ? matching : [...hand];
}
function strength(c, lead, calledSuit) {
  if (schafkopfIsTrump(c, calledSuit)) {
    if (c.rank === 5) return 500 + (3 - c.suit);
    if (c.rank === 6) return 400 + (3 - c.suit);
    if (c.suit === 2) return 300 + [7, 3, 4, 2, 1, 0].indexOf(c.rank) * -1;
  }
  if (schafkopfIsTrump(lead, calledSuit) || c.suit !== lead.suit) return 0;
  return 100 + c.rank;
}
export function winningSchafkopfPlay(trick, calledSuit) {
  assert(trick.length > 0, 'The trick is empty.');
  const lead = trick[0].card;
  return trick.reduce((best, play) => strength(play.card, lead, calledSuit) > strength(best.card, lead, calledSuit) ? play : best);
}
export function createSchafkopfGame({ seed = Date.now() >>> 0 } = {}) {
  let dealSeed = seed >>> 0; let hands;
  do { const deck = shuffled(dealSeed); hands = [0, 1, 2, 3].map((seat) => deck.slice(seat * 8, seat * 8 + 8)); dealSeed = (dealSeed + 1) >>> 0; }
  while (![0, 1, 3].some((suit) => !hands[0].some((c) => c.suit === suit && c.rank === 7) && hands[0].some((c) => c.suit === suit)));
  return { hands, seed: seed >>> 0, calledSuit: null, partner: null,
    phase: 'call', status: 'playing', leader: 0, toMove: 0, trick: [], tricks: [], tricksWon: [0, 0, 0, 0],
    pointsWon: [0, 0, 0, 0], teamsKnown: false, score: null };
}
export function availableSchafkopfCalls(game) {
  return [0, 1, 3].filter((suit) => !game.hands[0].some((c) => c.suit === suit && c.rank === 7)
    && game.hands[0].some((c) => c.suit === suit));
}
export function callSchafkopfAce(game, suit) {
  assert(game?.phase === 'call' && availableSchafkopfCalls(game).includes(suit), 'Choose a non-heart ace you do not hold, with another card of that suit in your hand.');
  game.calledSuit = suit;
  game.partner = game.hands.findIndex((hand, seat) => seat !== 0 && hand.some((c) => c.suit === suit && c.rank === 7));
  assert(game.partner > 0, 'The called ace must be held by another player.');
  game.phase = 'play'; game.toMove = game.leader;
  return game;
}
export function playSchafkopfCard(game, seat, id) {
  assert(game?.phase === 'play' && game.status === 'playing' && game.toMove === seat, 'It is not this seat’s turn.');
  const hand = game.hands[seat];
  assert(legalSchafkopfCards(hand, game.trick, game.calledSuit).some((c) => c.id === id), 'Follow the led suit or trump when possible.');
  const index = hand.findIndex((c) => c.id === id); const played = hand.splice(index, 1)[0];
  game.trick.push({ seat, card: played });
  if (seat === game.partner && played.suit === game.calledSuit && played.rank === 7) game.teamsKnown = true;
  if (game.trick.length < 4) { game.toMove = next(seat); return game; }
  const winner = winningSchafkopfPlay(game.trick, game.calledSuit);
  game.pointsWon[winner.seat] += game.trick.reduce((sum, play) => sum + SCHAFKOPF_EYES[play.card.rank], 0);
  game.tricksWon[winner.seat] += 1; game.tricks.push([...game.trick]); game.trick = []; game.leader = winner.seat; game.toMove = winner.seat;
  if (game.tricks.length === 8) {
    const callerSide = game.pointsWon[0] + game.pointsWon[game.partner];
    game.score = { callerSide, defenderSide: 120 - callerSide, winner: callerSide >= 61 ? 'callers' : 'defenders' };
    game.phase = 'complete'; game.status = 'complete';
  }
  return game;
}
export function schafkopfCpuCard(game, seat) {
  const legal = legalSchafkopfCards(game.hands[seat], game.trick, game.calledSuit);
  const partnerSide = seat === 0 || seat === game.partner;
  const winning = game.trick.length ? winningSchafkopfPlay(game.trick, game.calledSuit) : null;
  const candidate = legal.find((c) => winning && (partnerSide === (winning.seat === 0 || winning.seat === game.partner))
    ? strength(c, game.trick[0].card, game.calledSuit) > strength(winning.card, game.trick[0].card, game.calledSuit) : false);
  return (candidate ?? [...legal].sort((a, b) => SCHAFKOPF_EYES[a.rank] - SCHAFKOPF_EYES[b.rank])[0]).id;
}
export function playSchafkopfCpuUntilHuman(game, limit = 4) {
  let count = 0;
  while (game.phase === 'play' && game.toMove !== 0 && count < limit) { count += 1; playSchafkopfCard(game, game.toMove, schafkopfCpuCard(game, game.toMove)); }
  return game;
}

export const MUS_SUITS = Object.freeze(['espadas', 'bastos', 'copas', 'oros']);
export const MUS_RANKS = Object.freeze([1, 2, 3, 4, 5, 6, 7, 10, 11, 12]);
const HIGH_ORDER = Object.freeze([1, 4, 5, 6, 7, 10, 11, 12]);
const GAME_ORDER = Object.freeze([33, 34, 35, 36, 37, 40, 32, 31]);
const TEAMMATE = Object.freeze([2, 3, 0, 1]);
const CARD_LABEL = Object.freeze({ 1: 'As', 2: 'Dos', 3: 'Tres', 4: 'Cuatro', 5: 'Cinco', 6: 'Seis', 7: 'Siete', 10: 'Sota', 11: 'Caballo', 12: 'Rey' });

export function createMusDeck() {
  return Object.freeze(MUS_SUITS.flatMap((suit) => MUS_RANKS.map((rank) => Object.freeze({ id: `${suit}-${rank}`, suit, rank, label: CARD_LABEL[rank] }))));
}
export function musRankValue(card) {
  if (!card || !MUS_RANKS.includes(card.rank)) throw new RangeError('Invalid Spanish-suited card.');
  if (card.rank === 2) return 1;
  if (card.rank === 3) return 12;
  return card.rank;
}
export function musGameCardValue(card) {
  const rank = musRankValue(card);
  return rank >= 10 ? 10 : rank;
}
function validateHand(hand) {
  if (!Array.isArray(hand) || hand.length !== 4) throw new RangeError('A Mus hand must contain exactly four cards.');
  hand.forEach(musRankValue);
}
function descending(hand) { return hand.map(musRankValue).sort((a, b) => b - a); }
function ascending(hand) { return hand.map(musRankValue).sort((a, b) => a - b); }
function compareVector(a, b) {
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    const difference = (a[index] ?? 0) - (b[index] ?? 0);
    if (difference) return Math.sign(difference);
  }
  return 0;
}
function pairsProfile(hand) {
  const counts = new Map();
  for (const card of hand) { const value = musRankValue(card); counts.set(value, (counts.get(value) ?? 0) + 1); }
  const groups = [...counts.entries()].filter(([, count]) => count >= 2).map(([value, count]) => ({ value, count })).sort((a, b) => b.value - a.value);
  if (!groups.length) return Object.freeze({ type: 'none', strength: 0, rank: 0, value: 0 });
  if (groups.length === 1 && groups[0].count === 3) return Object.freeze({ type: 'medias', strength: 2, rank: groups[0].value, value: 2 });
  if (groups.length === 1 && groups[0].count === 2) return Object.freeze({ type: 'simple', strength: 1, rank: groups[0].value, value: 1 });
  const high = groups[0].value, low = groups[1]?.value ?? high;
  return Object.freeze({ type: 'duples', strength: 3, rank: high, high, low, value: 3 });
}
function gameTotal(hand) { return hand.reduce((sum, card) => sum + musGameCardValue(card), 0); }
function gameStrength(total) { const index = GAME_ORDER.indexOf(total); return index < 0 ? 0 : index + 1; }

export function evaluateMusHand(hand) {
  validateHand(hand);
  const total = gameTotal(hand), pairs = pairsProfile(hand);
  return Object.freeze({ grande: Object.freeze(descending(hand)), chica: Object.freeze(ascending(hand)), pairs, gameTotal: total, game: gameStrength(total), gameType: total >= 31 ? 'juego' : 'punto', gameRank: total >= 31 ? gameStrength(total) : total });
}

export function compareMusHands(first, second, lance) {
  const a = evaluateMusHand(first), b = evaluateMusHand(second);
  if (lance === 'grande') return compareVector(a.grande, b.grande);
  if (lance === 'chica') return -compareVector(a.chica, b.chica);
  if (lance === 'pares') return compareVector([a.pairs.strength, a.pairs.rank, a.pairs.low ?? 0], [b.pairs.strength, b.pairs.rank, b.pairs.low ?? 0]);
  if (lance === 'juego') return compareVector([a.game, a.gameTotal], [b.game, b.gameTotal]);
  if (lance === 'punto') return compareVector([a.gameTotal], [b.gameTotal]);
  throw new RangeError('Unknown Mus lance.');
}

export function chooseMusWinner(hands, lance, mano = 0) {
  if (!Array.isArray(hands) || hands.length !== 4 || !Number.isInteger(mano) || mano < 0 || mano > 3) throw new RangeError('Mus needs four hands and a mano seat from 0 to 3.');
  if (['pares', 'juego'].includes(lance)) {
    const hasLance = hands.map((hand) => { const value = evaluateMusHand(hand); return lance === 'pares' ? value.pairs.strength > 0 : value.game > 0; });
    if (!hasLance.some(Boolean)) return null;
  }
  const order = Array.from({ length: 4 }, (_, offset) => (mano + offset) % 4);
  let winner = order[0];
  for (const seat of order.slice(1)) if (compareMusHands(hands[seat], hands[winner], lance) > 0) winner = seat;
  return Object.freeze({ seat: winner, team: winner % 2, mano, tiebreakOffset: (winner - mano + 4) % 4 });
}

export function scorePassedLance(hands, lance, mano = 0) {
  const winner = chooseMusWinner(hands, lance, mano);
  if (!winner) return Object.freeze({ winner: null, team: null, points: 0, reason: 'no qualifying hand' });
  const winningTeamHands = [winner.team, winner.team + 2].map((seat) => evaluateMusHand(hands[seat]));
  let points = 1;
  if (lance === 'pares') points = winningTeamHands.reduce((sum, hand) => sum + hand.pairs.value, 0);
  else if (lance === 'juego') points = winningTeamHands.reduce((sum, hand) => sum + (hand.game ? (hand.gameTotal === 31 ? 3 : 2) : 0), 0);
  else if (lance === 'punto') points = 1;
  return Object.freeze({ winner: winner.seat, team: winner.team, points, lance });
}

export function musTeammateSeat(seat) {
  if (!Number.isInteger(seat) || seat < 0 || seat > 3) throw new RangeError('Seat must be from 0 to 3.');
  return TEAMMATE[seat];
}

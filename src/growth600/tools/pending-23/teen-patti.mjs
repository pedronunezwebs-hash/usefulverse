const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const rankValue = (rank) => RANKS.indexOf(rank) + 2;

function randomIndex(random, max) {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a value from 0 up to 1.');
  return Math.floor(value * max);
}

export function dealTeenPatti(random = Math.random) {
  if (typeof random !== 'function') throw new TypeError('Random source must be a function.');
  const deck = SUITS.flatMap((suit) => RANKS.map((rank) => ({ rank, suit })));
  for (let i = deck.length - 1; i > 0; i--) { const j = randomIndex(random, i + 1); [deck[i], deck[j]] = [deck[j], deck[i]]; }
  return Object.freeze({ hands: Object.freeze([0, 1, 2].map((player) => Object.freeze(deck.slice(player * 3, player * 3 + 3).map(Object.freeze)))), deckRemaining: deck.length - 9 });
}

export function rankTeenPattiHand(hand) {
  if (!Array.isArray(hand) || hand.length !== 3 || hand.some((card) => !RANKS.includes(card.rank) || !SUITS.includes(card.suit)) || new Set(hand.map(({ rank, suit }) => `${rank}-${suit}`)).size !== 3) throw new RangeError('A hand must contain three distinct valid cards.');
  const values = hand.map(({ rank }) => rankValue(rank)).sort((a, b) => b - a);
  const counts = new Map(); for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  const sameSuit = hand.every(({ suit }) => suit === hand[0].suit);
  const unique = [...new Set(values)].sort((a, b) => a - b);
  const aceLow = unique.join(',') === '2,3,14';
  const sequence = unique.length === 3 && (unique[2] - unique[0] === 2 || aceLow);
  // Common ordering: A-K-Q, then A-2-3, then K-Q-J down to 4-3-2.
  const sequenceHigh = aceLow ? 13 : unique.join(',') === '11,12,13' ? 12 : Math.max(...values);
  let category; let tiebreak;
  if (counts.size === 1) { category = 'trail'; tiebreak = values; }
  else if (sameSuit && sequence) { category = 'pureSequence'; tiebreak = [sequenceHigh]; }
  else if (sequence) { category = 'sequence'; tiebreak = [sequenceHigh]; }
  else if (sameSuit) { category = 'color'; tiebreak = values; }
  else if (counts.size === 2) { category = 'pair'; tiebreak = [values.find((value) => counts.get(value) === 2), values.find((value) => counts.get(value) === 1)]; }
  else { category = 'highCard'; tiebreak = values; }
  return Object.freeze({ category, tiebreak: Object.freeze(tiebreak) });
}

export function compareTeenPattiHands(first, second) {
  const a = rankTeenPattiHand(first); const b = rankTeenPattiHand(second);
  const order = ['highCard', 'pair', 'color', 'sequence', 'pureSequence', 'trail'];
  const categoryDifference = order.indexOf(a.category) - order.indexOf(b.category);
  if (categoryDifference) return Math.sign(categoryDifference);
  for (let i = 0; i < Math.max(a.tiebreak.length, b.tiebreak.length); i++) {
    const difference = (a.tiebreak[i] ?? 0) - (b.tiebreak[i] ?? 0);
    if (difference) return Math.sign(difference);
  }
  return 0;
}

export function resolveTeenPattiShowdown(hands, action = 'showdown') {
  if (!Array.isArray(hands) || hands.length !== 3 || hands.some((hand) => !Array.isArray(hand) || hand.length !== 3)) throw new RangeError('A round needs three hands of three cards.');
  if (!['showdown', 'fold'].includes(action)) throw new RangeError('Choose showdown or fold.');
  if (action === 'fold') return Object.freeze({ action, playerHand: hands[0], opponentHands: Object.freeze([]), rankings: Object.freeze([]), winners: Object.freeze([1, 2]), outcome: 'fold' });
  const rankings = hands.map(rankTeenPattiHand);
  const bestIndex = rankings.reduce((best, _rank, index) => compareTeenPattiHands(hands[index], hands[best]) > 0 ? index : best, 0);
  const winners = hands.flatMap((hand, index) => compareTeenPattiHands(hand, hands[bestIndex]) === 0 ? [index] : []);
  return Object.freeze({ action, playerHand: hands[0], opponentHands: Object.freeze([hands[1], hands[2]]), rankings: Object.freeze(rankings), winners: Object.freeze(winners), outcome: winners.length > 1 ? 'tie' : winners[0] === 0 ? 'win' : 'loss' });
}

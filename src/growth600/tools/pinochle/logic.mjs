export const PINOCHLE_SUITS = Object.freeze(['clubs', 'diamonds', 'hearts', 'spades']);
export const PINOCHLE_RANKS = Object.freeze([9, 11, 12, 13, 10, 14]);
const ORDER = Object.freeze([9, 11, 12, 13, 10, 14]);
const SCORE_RANKS = Object.freeze([14, 10, 13, 12, 11]);
const team = (player) => player % 2;

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

export function createPinochleDeck(decks = 1) {
  if (![1, 2].includes(decks)) throw new RangeError('Choose one or two decks.');
  const copies = decks === 1 ? 2 : 4;
  const ranks = decks === 1 ? [9, 10, 11, 12, 13, 14] : [10, 11, 12, 13, 14];
  return PINOCHLE_SUITS.flatMap((suit) => ranks.flatMap((rank) => Array.from({ length: copies }, (_, copy) => Object.freeze({ id: `${suit}-${rank}-${copy}`, suit, rank, copy }))));
}

function countsFor(hand) {
  const counts = Object.fromEntries(PINOCHLE_SUITS.map((suit) => [suit, Object.create(null)]));
  for (const card of hand) counts[card.suit][card.rank] = (counts[card.suit][card.rank] ?? 0) + 1;
  return counts;
}

export function scorePinochleMeld(hand, trump, decks = 1) {
  if (!Array.isArray(hand) || !PINOCHLE_SUITS.includes(trump) || ![1, 2].includes(decks)) throw new RangeError('Provide a valid hand, trump suit, and one- or two-deck profile.');
  const c = countsFor(hand), meld = [];
  const deckCopies = decks === 1 ? 2 : 4;
  const values = decks === 1
    ? { run: [150, 1500], royal: 40, marriage: 20, pinochle: [40, 300], aces: [100, 1000], kings: [80, 800], queens: [60, 600], jacks: [40, 400], dix: 10 }
    : { run: [15, 150, 225, 300], royal: 4, marriage: 2, pinochle: [4, 30, 60, 90], aces: [10, 100, 150, 200], kings: [8, 80, 120, 160], queens: [6, 60, 90, 120], jacks: [4, 40, 60, 80], dix: 0 };
  const add = (kind, score, count = 1) => { if (count > 0 && score > 0) meld.push(Object.freeze({ kind, count, points: score })); };
  const pick = (scores, count) => count > 0 ? scores[Math.min(count, scores.length) - 1] : 0;
  const runCount = Math.min(...[14, 10, 13, 12, 11].map((rank) => c[trump][rank] ?? 0));
  add('run', pick(values.run, runCount), runCount);
  const trumpMarriages = Math.min(Math.max(0, (c[trump][13] ?? 0) - runCount), Math.max(0, (c[trump][12] ?? 0) - runCount));
  add('royal-marriage', values.royal * trumpMarriages, trumpMarriages);
  for (const suit of PINOCHLE_SUITS.filter((item) => item !== trump)) {
    const marriages = Math.min(c[suit][13] ?? 0, c[suit][12] ?? 0);
    add('marriage', values.marriage * marriages, marriages);
  }
  if (decks === 1) add('dix', values.dix * (c[trump][9] ?? 0), c[trump][9] ?? 0);
  const pinochles = Math.min(c.diamonds[11] ?? 0, c.spades[12] ?? 0);
  add('pinochle', pick(values.pinochle, pinochles), pinochles);
  for (const [rank, kind, key] of [[14, 'aces-around', 'aces'], [13, 'kings-around', 'kings'], [12, 'queens-around', 'queens'], [11, 'jacks-around', 'jacks']]) {
    const arounds = Math.min(...PINOCHLE_SUITS.map((suit) => c[suit][rank] ?? 0));
    add(kind, pick(values[key], arounds), arounds);
  }
  return Object.freeze({ total: meld.reduce((sum, row) => sum + row.points, 0), parts: Object.freeze(meld) });
}

export function createPinochleGame({ decks = 1, random, cryptoImpl = globalThis.crypto, scores = [0, 0], dealer = 3 } = {}) {
  if (![1, 2].includes(decks) || !Array.isArray(scores) || scores.length !== 2 || scores.some((score) => !Number.isInteger(score) || score < 0) || !Number.isInteger(dealer) || dealer < 0 || dealer > 3) throw new RangeError('Invalid Pinochle setup.');
  const deck = createPinochleDeck(decks);
  for (let i = deck.length - 1; i > 0; i -= 1) { const j = randomIndex(i + 1, random, cryptoImpl); [deck[i], deck[j]] = [deck[j], deck[i]]; }
  const handSize = deck.length / 4;
  const hands = Array.from({ length: 4 }, () => []);
  deck.forEach((card, i) => hands[(dealer + 1 + i) % 4].push(card));
  const firstBidder = (dealer + 1) % 4;
  return Object.freeze({ phase: 'auction', decks, hands: Object.freeze(hands.map((hand) => Object.freeze(hand))), dealer, firstBidder, currentPlayer: firstBidder, bidTurn: 0, highestBid: 0, declarer: null, passed: Object.freeze([]), trump: null, meldScores: Object.freeze([0, 0]), teamScores: Object.freeze([...scores]), trickPoints: Object.freeze([0, 0]), currentTrick: Object.freeze([]), tricks: Object.freeze([]), trickNumber: 1, handSize, targetScore: decks === 1 ? 1500 : 500, bids: Object.freeze([]) });
}

export function minimumPinochleBid(game) {
  if (!game || game.phase !== 'auction') return null;
  const opening = game.decks === 1 ? 250 : 50;
  if (game.highestBid < opening) return opening;
  return game.decks === 1 ? game.highestBid + 10 : game.highestBid < 60 ? game.highestBid + 1 : Math.ceil((game.highestBid + 1) / 5) * 5;
}

function finishAuction(game, declarer, bid) {
  return Object.freeze({ ...game, phase: 'choose-trump', declarer, currentPlayer: declarer, highestBid: bid, passed: Object.freeze([]) });
}

export function bidPinochle(game, player, bid) {
  if (!game || game.phase !== 'auction' || player !== game.currentPlayer) throw new RangeError('It is not this player’s auction turn.');
  if (game.passed.includes(player)) throw new RangeError('A player who has passed cannot re-enter the auction.');
  const minimum = minimumPinochleBid(game);
  if (bid !== null && (!Number.isInteger(bid) || bid < minimum || (game.decks === 1 && bid % 10 !== 0) || (game.decks === 2 && bid > 60 && bid % 5 !== 0))) throw new RangeError(`Bid at least ${minimum} using the selected profile’s increments, or pass.`);
  const bids = [...game.bids, Object.freeze({ player, bid })];
  const passed = bid === null ? [...game.passed, player] : [...game.passed];
  const highestBid = bid ?? game.highestBid;
  const declarer = bid === null ? game.declarer : player;
  if (passed.length >= 3 && highestBid > 0) return Object.freeze({ ...finishAuction(game, declarer, highestBid), bids: Object.freeze(bids) });
  if (passed.length >= 3 && highestBid === 0) {
    const forced = game.dealer;
    return Object.freeze({ ...finishAuction(game, forced, game.decks === 1 ? 250 : 50), bids: Object.freeze(bids) });
  }
  if (passed.length >= 3 && highestBid > 0) return Object.freeze({ ...finishAuction(game, declarer, highestBid), bids: Object.freeze(bids) });
  let currentPlayer = (player + 1) % 4;
  while (passed.includes(currentPlayer)) currentPlayer = (currentPlayer + 1) % 4;
  return Object.freeze({ ...game, currentPlayer, bidTurn: game.bidTurn + 1, highestBid, declarer, passed: Object.freeze(passed), bids: Object.freeze(bids) });
}

export function choosePinochleTrump(game, player, trump) {
  if (!game || game.phase !== 'choose-trump' || player !== game.declarer || !PINOCHLE_SUITS.includes(trump)) throw new RangeError('Only the bidder can choose a valid trump suit.');
  if (game.decks === 1) {
    const partner = (game.declarer + 2) % 4;
    const partnerHand = [...game.hands[partner]];
    const passed = choosePinochleExchangeCards(partnerHand, trump, 4);
    const hands = game.hands.map((hand, seat) => seat === partner ? hand.filter((card) => !passed.some((item) => item.id === card.id)) : seat === game.declarer ? [...hand, ...passed] : [...hand]);
    return Object.freeze({ ...game, phase: 'exchange-return', trump, exchangePartner: partner, currentPlayer: game.declarer, hands: Object.freeze(hands.map((hand) => Object.freeze(hand))), exchangeReceived: Object.freeze(passed) });
  }
  const teamMeld = [0, 0];
  for (let seat = 0; seat < 4; seat += 1) teamMeld[team(seat)] += scorePinochleMeld(game.hands[seat], trump, game.decks).total;
  const dixMeld = [0, 0];
  if (game.decks === 1) for (let seat = 0; seat < 4; seat += 1) dixMeld[team(seat)] += scorePinochleMeld(game.hands[seat], trump, game.decks).parts.filter((part) => part.kind === 'dix').reduce((sum, part) => sum + part.points, 0);
  return Object.freeze({ ...game, phase: 'playing', trump, currentPlayer: game.declarer, meldScores: Object.freeze(teamMeld), dixMeldScores: Object.freeze(dixMeld) });
}

export function choosePinochleExchangeCards(hand, trump, count = 4) {
  if (!Array.isArray(hand) || !PINOCHLE_SUITS.includes(trump) || !Number.isInteger(count) || count < 1 || count > hand.length) throw new RangeError('Choose a valid hand, trump, and exchange count.');
  const strength = (card) => (card.suit === trump ? 6 : 0) + ({ 14:5, 10:4, 13:3, 12:2, 11:1, 9:0 })[card.rank];
  return Object.freeze([...hand].sort((a,b) => strength(a)-strength(b) || a.id.localeCompare(b.id)).slice(0,count));
}

export function returnPinochleExchange(game, player, cardIds) {
  if (!game || game.phase !== 'exchange-return' || player !== game.declarer || !Array.isArray(cardIds) || cardIds.length !== 4 || new Set(cardIds).size !== 4) throw new RangeError('The declarer must return four distinct cards to the partner.');
  const returned = cardIds.map((id) => game.hands[player].find((card) => card.id === id));
  if (returned.some((card) => !card)) throw new RangeError('Return four cards from the declarer’s hand.');
  const hands = game.hands.map((hand, seat) => seat === player ? hand.filter((card) => !cardIds.includes(card.id)) : seat === game.exchangePartner ? [...hand, ...returned] : [...hand]);
  if (hands.some((hand) => hand.length !== 12)) throw new RangeError('The exchange must leave each player with twelve cards.');
  const meldScores = [0, 0], dixMeldScores = [0, 0];
  for (let seat = 0; seat < 4; seat += 1) {
    const meld = scorePinochleMeld(hands[seat], game.trump, 1);
    meldScores[team(seat)] += meld.total;
    dixMeldScores[team(seat)] += meld.parts.filter((part) => part.kind === 'dix').reduce((sum, part) => sum + part.points, 0);
  }
  return Object.freeze({ ...game, phase: 'playing', hands: Object.freeze(hands.map((hand) => Object.freeze(hand))), currentPlayer: game.declarer, meldScores: Object.freeze(meldScores), dixMeldScores: Object.freeze(dixMeldScores), exchangeReturned: Object.freeze(returned) });
}

const cardStrength = (card) => ORDER.indexOf(card.rank);
function currentWinner(plays, trump) {
  const leadSuit = plays[0].card.suit;
  const eligible = plays.filter(({ card }) => card.suit === trump);
  const candidates = eligible.length ? eligible : plays.filter(({ card }) => card.suit === leadSuit);
  return candidates.reduce((best, play) => cardStrength(play.card) > cardStrength(best.card) ? play : best);
}

export function legalPinochleCards(game, player = game?.currentPlayer) {
  if (!game || game.phase !== 'playing' || player !== game.currentPlayer || !Number.isInteger(player) || player < 0 || player > 3) return [];
  const hand = game.hands[player];
  if (!game.currentTrick.length) return hand;
  const leadSuit = game.currentTrick[0].card.suit;
  const sameSuit = hand.filter((card) => card.suit === leadSuit);
  const current = currentWinner(game.currentTrick, game.trump);
  const beats = (card) => (card.suit === game.trump && current.card.suit !== game.trump)
    || (card.suit === current.card.suit && cardStrength(card) > cardStrength(current.card));
  if (sameSuit.length) {
    const winners = sameSuit.filter(beats);
    return winners.length ? winners : sameSuit;
  }
  const trumps = hand.filter((card) => card.suit === game.trump);
  if (!trumps.length) return hand;
  const overtrumps = trumps.filter(beats);
  return overtrumps.length ? overtrumps : trumps;
}

function trickCardPoints(card, decks) {
  if (decks === 1) return ({ 14: 10, 10: 10, 13: 10 })[card.rank] ?? 0;
  return ({ 14: 1, 10: 1, 13: 1 })[card.rank] ?? 0;
}

export function playPinochleCard(game, player, cardId) {
  const legal = legalPinochleCards(game, player);
  const card = game?.hands?.[player]?.find(({ id }) => id === cardId);
  if (!card || !legal.some(({ id }) => id === cardId)) throw new RangeError('That card is not legal in this trick.');
  const hands = game.hands.map((hand, index) => Object.freeze(index === player ? hand.filter(({ id }) => id !== cardId) : [...hand]));
  const currentTrick = [...game.currentTrick, Object.freeze({ player, card })];
  let tricks = [...game.tricks], trickPoints = [...game.trickPoints], currentPlayer = (player + 1) % 4;
  let nextTrick = currentTrick, trickNumber = game.trickNumber, phase = 'playing', winner = null, teamScores = [...game.teamScores];
  if (currentTrick.length === 4) {
    const winningPlay = currentWinner(currentTrick, game.trump);
    const points = currentTrick.reduce((sum, play) => sum + trickCardPoints(play.card, game.decks), 0) + (trickNumber === game.handSize ? (game.decks === 1 ? 10 : 2) : 0);
    trickPoints[team(winningPlay.player)] += points;
    tricks.push(Object.freeze({ plays: Object.freeze(currentTrick), winner: winningPlay.player, points, number: trickNumber }));
    currentPlayer = winningPlay.player;
    trickNumber += 1;
    nextTrick = [];
    if (hands.every((hand) => hand.length === 0)) {
      phase = 'complete';
      const declarerTeam = team(game.declarer);
      for (const t of [0, 1]) {
        const earned = game.meldScores[t] + trickPoints[t];
        if (t === declarerTeam) teamScores[t] += earned >= game.highestBid ? earned : -game.highestBid;
        else if (trickPoints[t] > 0) teamScores[t] += earned;
        else if (game.dixMeldScores?.[t] > 0) teamScores[t] += game.dixMeldScores[t];
      }
      winner = teamScores[0] >= game.targetScore || teamScores[1] >= game.targetScore ? (teamScores[0] >= teamScores[1] ? 0 : 1) : null;
    }
  }
  return Object.freeze({ ...game, phase, hands: Object.freeze(hands), currentTrick: Object.freeze(nextTrick), tricks: Object.freeze(tricks), trickPoints: Object.freeze(trickPoints), currentPlayer, trickNumber, teamScores: Object.freeze(teamScores), winner });
}

export function choosePinochleBotBid(game, player) {
  const hand = game.hands[player];
  const aces = hand.filter((card) => card.rank === 14).length;
  const tens = hand.filter((card) => card.rank === 10).length;
  const marriages = PINOCHLE_SUITS.filter((suit) => hand.some((c) => c.suit === suit && c.rank === 13) && hand.some((c) => c.suit === suit && c.rank === 12)).length;
  const strength = aces * 0.8 + tens * 0.35 + marriages * 0.7;
  const next = minimumPinochleBid(game);
  if (strength < (game.highestBid ? 3.7 : 4.8)) return null;
  const step = game.decks === 1 ? 10 : game.highestBid < 60 ? 1 : 5;
  return Math.max(next, game.highestBid ? game.highestBid + step : (game.decks === 1 ? 250 : 50));
}

export function choosePinochleBotCard(game) {
  const legal = legalPinochleCards(game);
  if (!legal.length) return null;
  if (!game.currentTrick.length) return [...legal].sort((a, b) => cardStrength(b) - cardStrength(a))[0];
  const winning = currentWinner(game.currentTrick, game.trump);
  const winnerCanBeOvertaken = legal.some((card) => (card.suit === game.trump && winning.card.suit !== game.trump) || (card.suit === winning.card.suit && cardStrength(card) > cardStrength(winning.card)));
  return [...legal].sort((a, b) => (winnerCanBeOvertaken ? cardStrength(a) - cardStrength(b) : trickCardPoints(a, game.decks) - trickCardPoints(b, game.decks)))[0];
}

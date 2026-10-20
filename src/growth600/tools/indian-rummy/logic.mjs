const SUITS = ['S', 'H', 'D', 'C'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const rankValue = (rank) => RANKS.indexOf(rank) + 1;
const isWild = (card, wildRank) => card.joker || (RANKS.includes(wildRank) && card.rank === wildRank);
const shuffle = (items, random = Math.random) => {
  if (typeof random !== 'function') throw new TypeError('A random source is required.');
  const cards = [...items];
  for (let i = cards.length - 1; i > 0; i--) {
    const value = random();
    if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random values must be from 0 up to 1.');
    const j = Math.floor(value * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
};

function handGroups(hand, wildRank) {
  if (!Array.isArray(hand) || hand.length !== 13) return [];
  const wild = hand.filter((card) => isWild(card, wildRank));
  const natural = hand.filter((card) => !isWild(card, wildRank));
  const groups = new Map();
  const add = (cards, type, pure = false) => {
    if (cards.length < 3 || cards.length > 5) return;
    if (type === 'set' && cards.length > 4) return;
    const ids = cards.map((card) => card.id).sort();
    const key = `${type}:${ids.join(',')}`;
    if (!groups.has(key)) groups.set(key, { ids, type, pure });
  };
  const sequences = [];
  for (const suit of SUITS) {
    for (let start = 1; start <= 13; start++) {
      for (let length = 3; length <= 5 && start + length - 1 <= 13; length++) sequences.push({ suit, ranks: Array.from({ length }, (_, i) => start + i) });
    }
    for (let start = 2; start <= 13; start++) {
      for (let length = 3; length <= 5 && start + length - 1 <= 14; length++) sequences.push({ suit, ranks: Array.from({ length }, (_, i) => start + i) });
    }
  }
  for (const sequence of sequences) {
    const options = sequence.ranks.map((rank) => [
      ...natural.filter((card) => card.suit === sequence.suit && rankValue(card.rank) === (rank === 14 ? 1 : rank)),
      ...wild,
    ]);
    const chosen = [];
    const visit = (position, used, naturalCount, hasWild) => {
      if (position === options.length) { if (naturalCount) add(chosen, 'sequence', !hasWild); return; }
      for (const card of options[position]) {
        if (used.has(card.id)) continue;
        if (!isWild(card, wildRank) && chosen.some((other) => !isWild(other, wildRank) && other.suit === card.suit && other.rank === card.rank)) continue;
        used.add(card.id); chosen.push(card);
        visit(position + 1, used, naturalCount + (isWild(card, wildRank) ? 0 : 1), hasWild || isWild(card, wildRank));
        chosen.pop(); used.delete(card.id);
      }
    };
    visit(0, new Set(), 0, false);
  }
  for (const rank of RANKS) {
    for (const size of [3, 4]) {
      for (let mask = 0; mask < 16; mask++) {
        const suits = SUITS.filter((_, index) => mask & (1 << index));
        if (suits.length !== size) continue;
        const options = suits.map((suit) => [...natural.filter((card) => card.rank === rank && card.suit === suit), ...wild]);
        const chosen = [];
        const visit = (position, used, naturalCount) => {
          if (position === options.length) { if (naturalCount) add(chosen, 'set'); return; }
          for (const card of options[position]) {
            if (used.has(card.id)) continue;
            used.add(card.id); chosen.push(card);
            visit(position + 1, used, naturalCount + (isWild(card, wildRank) ? 0 : 1));
            chosen.pop(); used.delete(card.id);
          }
        };
        visit(0, new Set(), 0);
      }
    }
  }
  return [...groups.values()];
}

export function validateIndianRummyHand(hand, wildRank) {
  if (!(RANKS.includes(wildRank) || wildRank === 'Joker') || !Array.isArray(hand) || hand.length !== 13) return { valid: false, groups: [] };
  const groups = handGroups(hand, wildRank);
  const byCard = Array.from({ length: hand.length }, (_, index) => groups.filter((group) => group.ids.includes(hand[index].id)));
  const fullMask = (1 << hand.length) - 1; const memo = new Map();
  const solve = (mask, sequenceCount, pureCount) => {
    if (mask === fullMask) return sequenceCount >= 2 && pureCount >= 1 ? [] : null;
    const key = `${mask}:${sequenceCount}:${pureCount}`; if (memo.has(key)) return memo.get(key);
    let first = 0; while (mask & (1 << first)) first++;
    for (const group of byCard[first]) {
      let groupMask = 0;
      for (const id of group.ids) { const index = hand.findIndex((card) => card.id === id); groupMask |= 1 << index; }
      if ((groupMask & mask) !== 0) continue;
      const nextSequences = sequenceCount + (group.type === 'sequence' ? 1 : 0);
      const nextPure = pureCount + (group.type === 'sequence' && group.pure ? 1 : 0);
      const result = solve(mask | groupMask, nextSequences, nextPure);
      if (result) { const solution = [group, ...result]; memo.set(key, solution); return solution; }
    }
    memo.set(key, null); return null;
  };
  const result = solve(0, 0, 0);
  return result ? { valid: true, groups: result } : { valid: false, groups: [] };
}

function createDeck() {
  return Array.from({ length: 2 }, (_, deck) => [
    ...SUITS.flatMap((suit) => RANKS.map((rank) => ({ id: `${deck}-${suit}-${rank}`, suit, rank, joker: false }))),
    { id: `${deck}-JOKER`, suit: '', rank: 'Joker', joker: true },
  ]).flat();
}

export function startIndianRummy(random = Math.random) {
  const deck = shuffle(createDeck(), random); const indicator = deck.pop();
  const human = deck.splice(0, 13); const bot = deck.splice(0, 13); const firstDiscard = deck.pop();
  return { human, bot, stock: deck, discards: [firstDiscard], wildRank: indicator.joker ? 'Joker' : indicator.rank, wildIndicator: indicator, turn: 'human', phase: 'draw', status: 'playing', winner: null, lastDrawnId: null, lastDrawFromDiscard: false, lastAction: 'started' };
}

function draw(game, fromDiscard) {
  if (!fromDiscard && !game.stock.length) return { ...game, status: 'draw', phase: 'done', lastAction: 'stockEmpty' };
  if (fromDiscard && !game.discards.length) throw new RangeError('The discard pile is empty.');
  const stock = [...game.stock]; const discards = [...game.discards];
  const card = fromDiscard ? discards.pop() : stock.pop();
  return { ...game, stock, discards, human: [...game.human, card], lastDrawnId: card.id, lastDrawFromDiscard: fromDiscard, phase: 'discard', lastAction: fromDiscard ? 'drewDiscard' : 'drewStock' };
}

function botTurn(game, random) {
  let next = { ...game, human: [...game.human], bot: [...game.bot], stock: [...game.stock], discards: [...game.discards] };
  const topDiscard = next.discards.at(-1);
  const usesTop = topDiscard && (next.bot.some((card) => card.rank === topDiscard.rank || card.suit === topDiscard.suit && Math.abs(rankValue(card.rank) - rankValue(topDiscard.rank)) <= 2) || topDiscard.joker);
  if (!usesTop && !next.stock.length) return { ...next, status: 'draw', turn: 'bot', phase: 'done', lastAction: 'stockEmpty' };
  const drawn = usesTop ? next.discards.pop() : next.stock.pop();
  if (!drawn) return { ...next, status: 'draw', lastAction: 'stockEmpty' };
  next.bot.push(drawn);
  for (let index = 0; index < next.bot.length; index++) {
    if (usesTop && next.bot[index].id === drawn.id) continue;
    const candidate = next.bot.filter((_, i) => i !== index);
    if (candidate.length === 13 && validateIndianRummyHand(candidate, next.wildRank).valid) {
      next.bot = candidate; next.status = 'won'; next.winner = 'bot'; next.turn = 'bot'; next.phase = 'done'; next.lastAction = 'botWon'; return next;
    }
  }
  const value = (card) => card.joker || card.rank === next.wildRank ? -100 : (['A','K','Q','J'].includes(card.rank) ? 10 : rankValue(card.rank));
  let discardIndex = 0; let weakest = Infinity;
  next.bot.forEach((card, index) => {
    if (usesTop && card.id === drawn.id) return;
    const connected = next.bot.some((other, otherIndex) => otherIndex !== index && !other.joker && other.rank !== next.wildRank && !card.joker && card.rank !== next.wildRank && (other.rank === card.rank && other.suit !== card.suit || other.suit === card.suit && Math.abs(rankValue(other.rank)-rankValue(card.rank)) <= 2));
    const score = value(card) - (connected ? 8 : 0);
    if (score < weakest) { weakest = score; discardIndex = index; }
  });
  next.discards.push(next.bot.splice(discardIndex, 1)[0]);
  next.turn = 'human'; next.phase = 'draw'; next.lastAction = 'botPlayed'; next.lastDrawnId = null; next.lastDrawFromDiscard = false;
  if (!next.stock.length) { next.status = 'draw'; next.phase = 'done'; }
  return next;
}

export function takeIndianRummyDraw(game, source = 'stock', random = Math.random) {
  if (game?.status !== 'playing' || game.turn !== 'human' || game.phase !== 'draw' || !['stock','discard'].includes(source)) throw new RangeError('A card cannot be drawn now.');
  if (source === 'discard' && !game.discards.length) throw new RangeError('The discard pile is empty.');
  return draw(game, source === 'discard');
}

export function discardIndianRummyCard(game, cardId, random = Math.random) {
  if (game?.status !== 'playing' || game.turn !== 'human' || game.phase !== 'discard') throw new RangeError('A card cannot be discarded now.');
  const index = game.human.findIndex((card) => card.id === cardId); if (index < 0) throw new RangeError('Choose a card in your hand.');
  if (game.lastDrawFromDiscard && cardId === game.lastDrawnId) throw new RangeError('You must discard a different card from the one taken from the discard pile.');
  const human = [...game.human]; const [card] = human.splice(index, 1);
  const next = { ...game, human, discards: [...game.discards, card] };
  if (validateIndianRummyHand(human, game.wildRank).valid) return { ...next, status: 'won', winner: 'human', turn: 'human', phase: 'done', lastAction: 'humanWon' };
  if (!next.stock.length) return { ...next, status: 'draw', turn: 'human', phase: 'done', lastAction: 'stockEmpty' };
  return botTurn(next, random);
}

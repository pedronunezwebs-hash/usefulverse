const RANKS = Object.freeze(['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']);
const SUITS = Object.freeze(['clubs', 'diamonds', 'hearts', 'spades']);

function randomIndex(length) {
  if (!globalThis.crypto?.getRandomValues || !Number.isInteger(length) || length < 1) throw new TypeError('Secure random selection is unavailable.');
  const ceiling = Math.floor(0x1_0000_0000 / length) * length;
  const value = new Uint32Array(1);
  do { globalThis.crypto.getRandomValues(value); } while (value[0] >= ceiling);
  return value[0] % length;
}

function createDeck() {
  const cards = SUITS.flatMap((suit) => RANKS.map((rank, value) => Object.freeze({ id: `${suit}-${rank}`, suit, rank, value })));
  for (let index = cards.length - 1; index > 0; index -= 1) {
    const target = randomIndex(index + 1);
    [cards[index], cards[target]] = [cards[target], cards[index]];
  }
  return cards;
}

const playerHand = (state, player) => player === 'human' ? state.humanHand : state.computerHand;
const replaceHand = (state, player, hand) => player === 'human' ? { ...state, humanHand: Object.freeze(hand) } : { ...state, computerHand: Object.freeze(hand) };
const cardById = (hand, id) => hand.find((card) => card.id === id);
const tableRanks = (table) => new Set(table.flatMap(({ attack, defense }) => defense ? [attack.rank, defense.rank] : [attack.rank]));
const hasUncoveredAttack = (table) => table.some(({ defense }) => !defense);

function validate(state, phase) {
  if (!state || state.phase !== phase) throw new RangeError(`The current game is not in the ${phase} phase.`);
}

function afterRound(state, { nextAttacker, taken = false }) {
  const humanHand = [...state.humanHand]; const computerHand = [...state.computerHand]; const deck = [...state.deck];
  if (taken) {
    const receiver = state.defender === 'human' ? humanHand : computerHand;
    for (const row of state.table) { receiver.push(row.attack); if (row.defense) receiver.push(row.defense); }
  }
  const hands = { human: humanHand, computer: computerHand };
  const drawOrder = [nextAttacker, nextAttacker === 'human' ? 'computer' : 'human'];
  for (const player of drawOrder) while (hands[player].length < 6 && deck.length) hands[player].push(deck.shift());
  let next = { ...state, humanHand: Object.freeze(hands.human), computerHand: Object.freeze(hands.computer), deck: Object.freeze(deck), table: Object.freeze([]), attacker: nextAttacker, defender: nextAttacker === 'human' ? 'computer' : 'human', maxAttacks: hands[nextAttacker === 'human' ? 'computer' : 'human'].length, phase: 'attack', roundTaken: taken };
  if (deck.length === 0) {
    if (hands.human.length === 0 && hands.computer.length === 0) next = { ...next, phase: 'finished', winner: 'draw' };
    else if (hands.human.length === 0) next = { ...next, phase: 'finished', winner: 'human' };
    else if (hands.computer.length === 0) next = { ...next, phase: 'finished', winner: 'computer' };
  }
  return Object.freeze(next);
}

export function createDurakGame() {
  const deck = createDeck(); const humanHand = []; const computerHand = [];
  for (let index = 0; index < 6; index += 1) { humanHand.push(deck.shift()); computerHand.push(deck.shift()); }
  const trumpCard = deck.pop();
  const humanTrumps = humanHand.filter((card) => card.suit === trumpCard.suit).sort((a, b) => a.value - b.value);
  const computerTrumps = computerHand.filter((card) => card.suit === trumpCard.suit).sort((a, b) => a.value - b.value);
  let attacker;
  if (!humanTrumps.length && !computerTrumps.length) attacker = randomIndex(2) ? 'human' : 'computer';
  else if (!computerTrumps.length) attacker = 'human';
  else if (!humanTrumps.length) attacker = 'computer';
  else attacker = humanTrumps[0].value <= computerTrumps[0].value ? 'human' : 'computer';
  const defender = attacker === 'human' ? 'computer' : 'human';
  return Object.freeze({ phase: 'attack', winner: null, humanHand: Object.freeze(humanHand), computerHand: Object.freeze(computerHand), deck: Object.freeze(deck), trumpCard, trump: trumpCard.suit, table: Object.freeze([]), attacker, defender, maxAttacks: playerHand({ humanHand, computerHand }, defender).length, roundTaken: false });
}

export function playDurakAttack(state, cardId) {
  validate(state, 'attack');
  const hand = playerHand(state, state.attacker); const card = cardById(hand, cardId);
  if (!card) throw new RangeError('Choose a card from the attacker hand.');
  const remaining = hand.filter(({ id }) => id !== cardId);
  return Object.freeze({ ...replaceHand(state, state.attacker, remaining), table: Object.freeze([{ attack: card, defense: null }]), maxAttacks: playerHand(state, state.defender).length, phase: 'defend' });
}

export function defendDurakAttack(state, cardId) {
  validate(state, 'defend');
  const hand = playerHand(state, state.defender); const card = cardById(hand, cardId);
  if (!card) throw new RangeError('Choose a card from the defender hand.');
  const last = state.table[state.table.length - 1];
  const beats = card.suit === last.attack.suit ? card.value > last.attack.value : card.suit === state.trump && last.attack.suit !== state.trump;
  if (!beats) throw new RangeError('That card cannot cover the attack.');
  const table = [...state.table]; table[table.length - 1] = Object.freeze({ ...last, defense: card });
  return Object.freeze({ ...replaceHand(state, state.defender, hand.filter(({ id }) => id !== cardId)), table: Object.freeze(table), phase: 'throw-in' });
}

export function throwInDurakCard(state, cardId) {
  validate(state, 'throw-in');
  if (hasUncoveredAttack(state.table)) throw new RangeError('Cover the current attack before adding another card.');
  if (state.table.length >= Math.min(6, state.maxAttacks)) throw new RangeError('The defender cannot receive another attack card.');
  const hand = playerHand(state, state.attacker); const card = cardById(hand, cardId);
  if (!card || !tableRanks(state.table).has(card.rank)) throw new RangeError('A throw-in must match a rank already on the table.');
  return Object.freeze({ ...replaceHand(state, state.attacker, hand.filter(({ id }) => id !== cardId)), table: Object.freeze([...state.table, Object.freeze({ attack: card, defense: null })]), phase: 'defend' });
}

export function takeDurakCards(state) {
  validate(state, 'defend');
  return afterRound(state, { nextAttacker: state.attacker, taken: true });
}

export function finishDurakAttack(state) {
  validate(state, 'throw-in');
  if (hasUncoveredAttack(state.table)) throw new RangeError('The defender must cover or take every attack card.');
  return afterRound(state, { nextAttacker: state.defender });
}

function computerCover(hand, attack, trump) {
  const covers = hand.filter((card) => card.suit === attack.suit && card.value > attack.value || card.suit === trump && attack.suit !== trump);
  covers.sort((a, b) => {
    const aTrump = a.suit === trump ? 1 : 0; const bTrump = b.suit === trump ? 1 : 0;
    return aTrump - bTrump || a.value - b.value;
  });
  return covers[0] ?? null;
}

export function playDurakComputerTurn(state) {
  if (state?.phase === 'attack' && state.attacker === 'computer') {
    const card = [...state.computerHand].sort((a, b) => a.value - b.value || Number(a.suit === state.trump) - Number(b.suit === state.trump))[0];
    return playDurakAttack(state, card.id);
  }
  if (state?.phase === 'defend' && state.defender === 'computer') {
    const card = computerCover(state.computerHand, state.table[state.table.length - 1].attack, state.trump);
    return card ? defendDurakAttack(state, card.id) : takeDurakCards(state);
  }
  if (state?.phase === 'throw-in' && state.attacker === 'computer') {
    const eligible = state.computerHand.filter((card) => tableRanks(state.table).has(card.rank));
    if (eligible.length && state.table.length < Math.min(6, state.maxAttacks)) {
      eligible.sort((a, b) => a.value - b.value); return throwInDurakCard(state, eligible[0].id);
    }
    return finishDurakAttack(state);
  }
  throw new RangeError('It is not the computer turn.');
}

const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];
const isRed = (suit) => suit === 'diamonds' || suit === 'hearts';
const validRandom = (random) => {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a number from 0 (inclusive) to 1 (exclusive).');
  return value;
};

export function shuffleDeck(random = Math.random) {
  if (typeof random !== 'function') throw new TypeError('Provide a random function.');
  const deck = SUITS.flatMap((suit) => Array.from({ length: 13 }, (_, index) => ({ id: `${suit}-${index + 1}`, suit, rank: index + 1, red: isRed(suit), faceUp: false })));
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const target = Math.floor(validRandom(random) * (index + 1));
    [deck[index], deck[target]] = [deck[target], deck[index]];
  }
  return deck;
}

export function newSolitaireGame(random = Math.random) {
  const deck = shuffleDeck(random);
  const tableau = Array.from({ length: 7 }, (_, column) => {
    const cards = deck.splice(0, column + 1);
    cards.forEach((card, index) => { card.faceUp = index === cards.length - 1; });
    return cards;
  });
  return { stock: deck, waste: [], foundations: Object.fromEntries(SUITS.map((suit) => [suit, []])), tableau, drawCount: 1 };
}

export function cloneSolitaireGame(game) {
  return structuredClone(game);
}

export function canPlaceInTableau(card, destination) {
  if (!card) return false;
  if (!destination) return card.rank === 13;
  return destination.faceUp && card.rank === destination.rank - 1 && card.red !== destination.red;
}

export function canPlaceInFoundation(card, pile) {
  if (!card || !Array.isArray(pile)) return false;
  const top = pile.at(-1);
  return top ? top.suit === card.suit && card.rank === top.rank + 1 : card.rank === 1;
}

export function drawSolitaireStock(game) {
  if (game.stock.length) {
    const count = Math.min(game.drawCount, game.stock.length);
    for (let index = 0; index < count; index += 1) game.waste.push({ ...game.stock.pop(), faceUp: true });
    return 'drawn';
  }
  if (!game.waste.length) return 'empty';
  game.stock = game.waste.reverse().map((card) => ({ ...card, faceUp: false }));
  game.waste = [];
  return 'recycled';
}

function revealTableauTop(game, column) {
  const top = game.tableau[column].at(-1);
  if (top && !top.faceUp) top.faceUp = true;
}

export function moveTableauRun(game, sourceColumn, startIndex, destinationColumn) {
  if (!Number.isInteger(sourceColumn) || !Number.isInteger(destinationColumn) || sourceColumn === destinationColumn || !Number.isInteger(startIndex) || startIndex < 0 || !game.tableau[sourceColumn] || startIndex >= game.tableau[sourceColumn].length || !game.tableau[destinationColumn]) return false;
  const source = game.tableau[sourceColumn]; const destination = game.tableau[destinationColumn];
  const run = source.slice(startIndex);
  if (!run.length || run.some((card) => !card.faceUp) || run.some((card, index) => index && !canPlaceInTableau(card, run[index - 1])) || !canPlaceInTableau(run[0], destination.at(-1))) return false;
  destination.push(...source.splice(startIndex));
  revealTableauTop(game, sourceColumn);
  return true;
}

export function moveWasteCardToTableau(game, destinationColumn) {
  const card = game.waste.at(-1); const destination = game.tableau[destinationColumn];
  if (!destination || !canPlaceInTableau(card, destination.at(-1))) return false;
  destination.push(game.waste.pop());
  return true;
}

export function moveTableauCardToFoundation(game, column) {
  const card = game.tableau[column]?.at(-1);
  if (!card || !canPlaceInFoundation(card, game.foundations[card.suit])) return false;
  game.foundations[card.suit].push(game.tableau[column].pop());
  revealTableauTop(game, column);
  return true;
}

export function moveWasteCardToFoundation(game) {
  const card = game.waste.at(-1);
  if (!card || !canPlaceInFoundation(card, game.foundations[card.suit])) return false;
  game.foundations[card.suit].push(game.waste.pop());
  return true;
}

export function moveFoundationCardToTableau(game, suit, destinationColumn) {
  const pile = game.foundations[suit]; const card = pile?.at(-1); const destination = game.tableau[destinationColumn];
  if (!card || !destination || !canPlaceInTableau(card, destination.at(-1))) return false;
  destination.push(pile.pop());
  return true;
}

export function isSolitaireWon(game) {
  return SUITS.every((suit) => game.foundations[suit].length === 13);
}

export const solitaireSuits = SUITS;

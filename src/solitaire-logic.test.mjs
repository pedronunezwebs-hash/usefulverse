import test from 'node:test';
import assert from 'node:assert/strict';
import { canPlaceInFoundation, canPlaceInTableau, cloneSolitaireGame, drawSolitaireStock, isSolitaireWon, moveFoundationCardToTableau, moveTableauCardToFoundation, moveTableauRun, moveWasteCardToFoundation, moveWasteCardToTableau, newSolitaireGame, shuffleDeck } from './solitaire-logic.mjs';

test('a new Klondike deal contains all 52 unique cards and seven valid columns', () => {
  const game = newSolitaireGame(() => 0.37);
  const cards = [...game.stock, ...game.waste, ...Object.values(game.foundations).flat(), ...game.tableau.flat()];
  assert.equal(cards.length, 52);
  assert.equal(new Set(cards.map(({ id }) => id)).size, 52);
  assert.deepEqual(game.tableau.map((column) => column.length), [1, 2, 3, 4, 5, 6, 7]);
  assert.equal(game.stock.length, 24);
  assert.ok(game.tableau.every((column) => column.filter(({ faceUp }) => faceUp).length === 1 && column.at(-1).faceUp));
  assert.throws(() => shuffleDeck(() => 1), /Random source/u);
});

test('tableau rules require descending rank, alternating color and a king on an empty column', () => {
  const redQueen = { rank: 12, red: true, faceUp: true };
  assert.equal(canPlaceInTableau(redQueen, { rank: 13, red: false, faceUp: true }), true);
  assert.equal(canPlaceInTableau(redQueen, { rank: 13, red: true, faceUp: true }), false);
  assert.equal(canPlaceInTableau({ rank: 11, red: false, faceUp: true }, { rank: 13, red: false, faceUp: true }), false);
  assert.equal(canPlaceInTableau({ rank: 13, red: false, faceUp: true }, null), true);
  assert.equal(canPlaceInTableau({ rank: 12, red: false, faceUp: true }, null), false);
});

test('tableau run moves preserve order and reveal the covered card', () => {
  const game = newSolitaireGame();
  game.tableau[0] = [{ rank: 8, red: false, faceUp: false }, { rank: 7, red: true, faceUp: true }, { rank: 6, red: false, faceUp: true }];
  game.tableau[1] = [{ rank: 8, red: false, faceUp: true }];
  assert.equal(moveTableauRun(game, 0, 1, 1), true);
  assert.deepEqual(game.tableau[1].map(({ rank }) => rank), [8, 7, 6]);
  assert.equal(game.tableau[0].at(-1).faceUp, true);
  assert.equal(moveTableauRun(game, 1, 2, 0), false);
  assert.equal(moveTableauRun(game, 1, -1, 0), false);
});

test('stock draws one or three cards and recycle returns the oldest waste card first', () => {
  const game = newSolitaireGame(() => 0.29);
  const firstStockId = game.stock.at(-1).id;
  assert.equal(drawSolitaireStock(game), 'drawn');
  assert.equal(game.waste.length, 1);
  assert.equal(game.waste.at(-1).id, firstStockId);
  game.drawCount = 3;
  drawSolitaireStock(game);
  assert.equal(game.waste.length, 4);
  const oldestWaste = game.waste[0].id;
  while (game.stock.length) drawSolitaireStock(game);
  assert.equal(drawSolitaireStock(game), 'recycled');
  assert.equal(game.waste.length, 0);
  game.drawCount = 1;
  assert.equal(drawSolitaireStock(game), 'drawn');
  assert.equal(game.waste.at(-1).id, oldestWaste);
  assert.equal(drawSolitaireStock({ stock: [], waste: [] }), 'empty');
});

test('foundation follows suit and ascending rank; cards can return to tableau', () => {
  const game = newSolitaireGame();
  game.tableau[0] = [{ id: 'clubs-1', suit: 'clubs', rank: 1, red: false, faceUp: true }];
  game.tableau[1] = [{ id: 'clubs-2', suit: 'clubs', rank: 2, red: false, faceUp: true }];
  game.tableau[2] = [{ id: 'diamonds-3', suit: 'diamonds', rank: 3, red: true, faceUp: true }];
  assert.equal(canPlaceInFoundation(game.tableau[0][0], []), true);
  assert.equal(canPlaceInFoundation(game.tableau[1][0], []), false);
  assert.equal(moveTableauCardToFoundation(game, 0), true);
  assert.equal(moveTableauCardToFoundation(game, 1), true);
  assert.equal(game.foundations.clubs.length, 2);
  assert.equal(moveTableauCardToFoundation(game, 2), false);
  assert.equal(moveFoundationCardToTableau(game, 'clubs', 2), true);
  assert.equal(game.foundations.clubs.length, 1);
  assert.equal(game.tableau[2].at(-1).id, 'clubs-2');
  assert.equal(isSolitaireWon(game), false);
});

test('waste can move to tableau or foundation and snapshots are independent', () => {
  const game = newSolitaireGame();
  game.waste = [{ id: 'hearts-1', suit: 'hearts', rank: 1, red: true, faceUp: true }];
  assert.equal(moveWasteCardToFoundation(game), true);
  assert.equal(game.waste.length, 0);
  const second = cloneSolitaireGame(game);
  second.foundations.hearts.pop();
  assert.equal(game.foundations.hearts.length, 1);
  game.waste = [{ id: 'spades-13', suit: 'spades', rank: 13, red: false, faceUp: true }];
  game.tableau[6] = [];
  assert.equal(moveWasteCardToTableau(game, 6), true);
  assert.equal(game.waste.length, 0);
});

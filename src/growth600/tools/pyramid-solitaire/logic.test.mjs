import test from 'node:test';
import assert from 'node:assert/strict';
import { clonePyramidGame, createPyramidGame, drawPyramidCard, getPyramidMoves, getPyramidStatus, isPyramidCardExposed, PYRAMID_DECK_SIZE, PYRAMID_SIZE, recyclePyramidWaste, removePyramidMove } from './logic.mjs';

const card = (id, rank, row = 6, column = 0) => Object.freeze({ id, rank, suit: 'clubs', row, column });
const state = (pyramid, { stock = [], waste = [], removed = [], recycleLimit = 1, recycleCount = 0, draws = 0 } = {}) => ({ pyramid, stock, waste, removed, recycleLimit, recycleCount, draws });

test('deals a shuffled 52-card deck into a 28-card seven-row pyramid and 24-card stock', () => {
  const first = createPyramidGame({ random: () => 0.5 });
  const second = createPyramidGame({ random: () => 0.25 });
  assert.equal(first.pyramid.length, PYRAMID_SIZE);
  assert.equal(first.stock.length, PYRAMID_DECK_SIZE - PYRAMID_SIZE);
  assert.equal(new Set([...first.pyramid, ...first.stock].map(({ id }) => id)).size, PYRAMID_DECK_SIZE);
  assert.equal(first.pyramid[0].row, 0);
  assert.equal(first.pyramid[27].row, 6);
  assert.deepEqual(first.pyramid.slice(0, 3).map(({ column }) => column), [0, 0, 1]);
  assert.notDeepEqual(first.pyramid.map(({ id }) => id), second.pyramid.map(({ id }) => id));
  assert.throws(() => createPyramidGame({ random: () => 1 }), /0 inclusive/u);
  assert.throws(() => createPyramidGame({ recycleLimit: -1 }), /Recycling/u);
});

test('exposes a card only after both cards directly below it are gone', () => {
  const game = state([card('top', 4, 0, 0), card('left-child', 5, 1, 0), card('right-child', 6, 1, 1)]);
  assert.equal(isPyramidCardExposed(game, 'top'), false);
  assert.equal(isPyramidCardExposed(game, 'left-child'), true);
  const afterOneChild = state([game.pyramid[0], game.pyramid[2]]);
  assert.equal(isPyramidCardExposed(afterOneChild, 'top'), false);
  assert.equal(isPyramidCardExposed(state([game.pyramid[0]]), 'top'), true);
});

test('removes a king alone and pairs only exposed cards that total thirteen', () => {
  const king = card('king', 13);
  const singleKingGame = state([king], { recycleLimit: 0 });
  assert.deepEqual(getPyramidMoves(singleKingGame), [{ kind: 'king', cards: ['king'] }]);
  const won = removePyramidMove(singleKingGame, ['king']);
  assert.equal(getPyramidStatus(won), 'won');
  assert.deepEqual(won.removed.map(({ id }) => id), ['king']);

  const pairGame = state([card('five', 5), card('eight', 8, 6, 1), card('covered-six', 6, 0, 0), card('cover-a', 2, 1, 0), card('cover-b', 3, 1, 1)]);
  const moves = getPyramidMoves(pairGame);
  assert.ok(moves.some(({ kind, cards }) => kind === 'pair' && cards.includes('five') && cards.includes('eight')));
  assert.ok(!moves.some(({ cards }) => cards.includes('covered-six')));
  assert.equal(removePyramidMove(pairGame, ['covered-six', 'five']), null);
  const removed = removePyramidMove(pairGame, ['five', 'eight']);
  assert.equal(removed.pyramid.some(({ id }) => id === 'five' || id === 'eight'), false);
  assert.equal(pairGame.pyramid.length, 5, 'moves must not mutate the source state');
});

test('stock draws to waste and recycling preserves draw order within the chosen limit', () => {
  const game = state([], { stock: [card('bottom', 2), card('middle', 3), card('top', 4)], recycleLimit: 1 });
  const first = drawPyramidCard(game);
  assert.equal(first.waste.at(-1).id, 'top');
  const second = drawPyramidCard(first);
  const third = drawPyramidCard(second);
  assert.deepEqual(third.waste.map(({ id }) => id), ['top', 'middle', 'bottom']);
  const recycled = recyclePyramidWaste(third);
  assert.equal(recycled.recycleCount, 1);
  assert.equal(drawPyramidCard(recycled).waste.at(-1).id, 'top', 'the first card drawn on a new pass is the oldest waste card');
  assert.equal(recyclePyramidWaste(recycled), null);
  assert.equal(recyclePyramidWaste(state([], { waste: [card('held', 1)], recycleLimit: 0 })), null);
  const unlimited = recyclePyramidWaste(state([], { waste: [card('unlimited', 1)], recycleLimit: Infinity, recycleCount: 99 }));
  assert.equal(unlimited.recycleCount, 100);
  assert.equal(drawPyramidCard(game).draws, 1);
  assert.equal(drawPyramidCard(state([], { stock: [] })), null);
});

test('the top waste card pairs only with an exposed pyramid card, never with another waste card', () => {
  const pyramidMatch = state([card('pyramid-five', 5)], { waste: [card('waste-eight', 8)], recycleLimit: 0 });
  assert.deepEqual(getPyramidMoves(pyramidMatch), [{ kind: 'pair', cards: ['pyramid-five', 'waste-eight'] }]);
  const cleared = removePyramidMove(pyramidMatch, ['waste-eight', 'pyramid-five']);
  assert.equal(getPyramidStatus(cleared), 'won');
  assert.deepEqual(cleared.removed.map(({ id }) => id).sort(), ['pyramid-five', 'waste-eight']);

  const wasteOnly = state([card('pyramid-queen', 12)], { waste: [card('waste-five', 5), card('waste-eight', 8)], recycleLimit: 0 });
  assert.deepEqual(getPyramidMoves(wasteOnly), []);
  assert.equal(getPyramidStatus(wasteOnly), 'no-moves');
  assert.equal(removePyramidMove(wasteOnly, ['waste-five', 'waste-eight']), null);
});

test('a card keeps its suit/rank identity across pyramid, stock, waste and removed piles', () => {
  const deal = createPyramidGame({ random: () => 0.41 });
  const copy = clonePyramidGame(deal);
  assert.notEqual(copy.pyramid, deal.pyramid);
  assert.deepEqual(copy.pyramid, deal.pyramid);
  const all = [...copy.pyramid, ...copy.stock, ...copy.waste, ...copy.removed];
  assert.equal(all.length, 52);
  assert.equal(new Set(all.map(({ id }) => id)).size, 52);
  assert.equal(all.filter(({ rank, suit }) => rank === 1 && suit === 'hearts').length, 1);
});

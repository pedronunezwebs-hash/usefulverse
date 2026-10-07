import assert from 'node:assert/strict';
import test from 'node:test';
import { chooseDominoMove, createDoubleSixSet, createDominoGame, drawDomino, legalDominoMoves, passDominoTurn, playDomino } from './logic.mjs';

function seededRandom(seed = 1) {
  let state = seed >>> 0;
  return () => ((state = (state * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

test('double-six set contains each unordered pair exactly once', () => {
  const tiles = createDoubleSixSet();
  assert.equal(tiles.length, 28);
  assert.equal(new Set(tiles.map(({ id }) => id)).size, 28);
  assert.ok(tiles.some(({ a, b }) => a === 6 && b === 6));
  assert.ok(tiles.every(({ a, b }) => a <= b));
});

test('random deals are reproducible, complete and force a legal opening tile', () => {
  const game = createDominoGame({ random: seededRandom(23) });
  const repeated = createDominoGame({ random: seededRandom(23) });
  assert.deepEqual(game, repeated);
  assert.equal(game.hands[0].length, 7);
  assert.equal(game.hands[1].length, 7);
  assert.equal(game.stock.length, 14);
  assert.equal(new Set([...game.hands.flat(), ...game.stock].map(({ id }) => id)).size, 28);
  assert.deepEqual(legalDominoMoves(game).map(({ tileId }) => tileId), [game.openingTileId]);
  assert.equal(createDominoGame({ random: seededRandom(23) }).openingTileId, game.openingTileId);
  assert.throws(() => createDominoGame({ random: () => 1 }), /Random source/u);
});

test('draw and block variants enforce matching ends and preserve every tile', () => {
  const game = createDominoGame({ random: seededRandom(8), variant: 'block' });
  const opening = legalDominoMoves(game)[0];
  const afterOpen = playDomino(game, opening);
  assert.equal(afterOpen.board.length, 1);
  assert.equal(afterOpen.hands[game.currentPlayer].length, 6);
  assert.equal(playDomino(afterOpen, { tileId: afterOpen.hands[afterOpen.currentPlayer][0].id, side: 'invalid' }), null);
  const move = chooseDominoMove(afterOpen);
  if (move) {
    const tile = afterOpen.hands[afterOpen.currentPlayer].find(({ id }) => id === move.tileId);
    const edge = move.side === 'left' ? afterOpen.board[0].a : afterOpen.board.at(-1).b;
    assert.ok(tile.a === edge || tile.b === edge);
    const next = playDomino(afterOpen, move);
    assert.equal(next.board.length, 2);
    assert.equal(new Set([...next.hands.flat(), ...next.stock, ...next.board].map(({ id }) => id)).size, 28);
  }
  assert.equal(drawDomino(afterOpen), null);
});

test('draw mode removes exactly one stock tile and pass is rejected while drawing is possible', () => {
  const game = createDominoGame({ random: seededRandom(13), variant: 'draw' });
  const opening = playDomino(game, legalDominoMoves(game)[0]);
  if (!legalDominoMoves(opening).length) {
    const drawn = drawDomino(opening);
    assert.equal(drawn.stock.length, opening.stock.length - 1);
    assert.equal(drawn.hands[opening.currentPlayer].length, opening.hands[opening.currentPlayer].length + 1);
    assert.equal(passDominoTurn(opening), null);
  } else assert.equal(drawDomino(opening), null);
});

test('computer selects a legal move and final score follows the empty-hand rule', () => {
  let game = createDominoGame({ random: seededRandom(42), mode: 'two-player', variant: 'block' });
  for (let turn = 0; turn < 120 && !game.over; turn += 1) {
    let move = chooseDominoMove(game);
    if (!move) {
      const passed = passDominoTurn(game);
      if (passed) game = passed;
      else {
        const drawn = drawDomino(game);
        if (drawn) game = drawn;
        else break;
      }
    } else game = playDomino(game, move);
  }
  assert.equal(game.over, true);
  assert.ok([0, 1, 'tie'].includes(game.winner));
  assert.ok(['empty-hand', 'blocked'].includes(game.reason));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { createPegSolitaireGame, PEG_HOLES, PEG_START, pegSolitaireHint, pegSolitaireMoves, pegSolitaireStatus, playPegSolitaireMove } from './logic.mjs';

test('classic English board starts with 32 pegs and a center vacancy', () => {
  const game = createPegSolitaireGame();
  assert.equal(PEG_HOLES.filter(Boolean).length, 33);
  assert.equal(PEG_START.length, 32);
  assert.equal(game.pegs.size, 32);
  assert.equal(game.pegs.has(24), false);
  assert.equal(pegSolitaireStatus(game), 'playing');
});

test('a legal jump removes the source and middle peg and fills the empty destination', () => {
  const game = createPegSolitaireGame();
  const move = pegSolitaireMoves(game).find(({ from, middle, to }) => from === 10 && middle === 17 && to === 24);
  assert.ok(move);
  const next = playPegSolitaireMove(game, move);
  assert.equal(next.pegs.size, 31);
  assert.equal(next.pegs.has(10), false);
  assert.equal(next.pegs.has(17), false);
  assert.equal(next.pegs.has(24), true);
  assert.equal(next.moves, 1);
  assert.equal(game.pegs.size, 32);
});

test('rejects jumps that are illegal or incomplete', () => {
  const game = createPegSolitaireGame();
  assert.equal(playPegSolitaireMove(game, { from: 0, middle: 1, to: 2 }), null);
  assert.equal(playPegSolitaireMove(game, null), null);
});

test('hint always points to an actually legal jump and is absent when none exists', () => {
  const game = createPegSolitaireGame();
  const hint = pegSolitaireHint(game);
  assert.ok(pegSolitaireMoves(game).some((move) => move.from === hint.from && move.middle === hint.middle && move.to === hint.to));
  const stuck = { pegs: new Set([0, 6]), moves: 0 };
  assert.equal(pegSolitaireStatus(stuck), 'no-moves');
  assert.equal(pegSolitaireHint(stuck), null);
});

test('one remaining peg wins', () => {
  assert.equal(pegSolitaireStatus({ pegs: new Set([24]), moves: 31 }), 'won');
});

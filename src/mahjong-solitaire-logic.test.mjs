import test from 'node:test';
import assert from 'node:assert/strict';
import { createMahjongGame, getMahjongTileLabel, isMahjongTileFree, selectMahjongTile } from './mahjong-solitaire-logic.mjs';

test('creates a full 48-tile board with 24 matching pairs and a valid complete removal path', () => {
  for (let seed = 0; seed < 20; seed += 1) {
    let randomState = seed + 1;
    const random = () => { randomState = (randomState * 48271) % 2147483647; return randomState / 2147483647; };
    let state = createMahjongGame(random);
    assert.equal(state.tiles.length, 48);
    assert.equal(state.tiles.filter(Boolean).length, 48);
    for (const [left, right] of state.solution) {
      assert.equal(isMahjongTileFree(state, left), true);
      assert.equal(isMahjongTileFree(state, right), true);
      assert.equal(state.tiles[left], state.tiles[right]);
      state = selectMahjongTile(state, null, left).game;
      const move = selectMahjongTile(state, left, right);
      assert.ok(['matched', 'won'].includes(move.status));
      state = move.game;
    }
    assert.equal(state.tiles.filter(Boolean).length, 0);
  }
});

test('different random streams generate distinct new boards', () => {
  const boards = new Set();
  for (let seed = 1; seed <= 20; seed += 1) {
    let state = seed;
    const random = () => { state = (state * 48271) % 2147483647; return state / 2147483647; };
    boards.add(createMahjongGame(random).tiles.join(','));
  }
  assert.equal(boards.size, 20);
});

test('selection rejects blocked tiles and mismatches without changing board contents', () => {
  const game = createMahjongGame();
  const blocked = game.tiles.findIndex((tile, index) => tile && !isMahjongTileFree(game, index));
  assert.ok(blocked >= 0);
  assert.equal(selectMahjongTile(game, null, blocked).status, 'blocked');
  const first = game.tiles.findIndex((tile, index) => tile && isMahjongTileFree(game, index));
  const different = game.tiles.findIndex((tile, index) => tile && tile !== game.tiles[first] && isMahjongTileFree(game, index));
  const selected = selectMahjongTile(game, null, first);
  const mismatch = selectMahjongTile(game, selected.selected, different);
  assert.equal(mismatch.status, 'mismatch');
  assert.equal(mismatch.game, game);
  assert.equal(mismatch.selected, different);
});

test('matched pair is removed and invalid random sources are rejected', () => {
  const game = createMahjongGame();
  const [left, right] = game.solution[0];
  const one = selectMahjongTile(game, null, left);
  const two = selectMahjongTile(game, one.selected, right);
  assert.equal(two.status, 'matched');
  assert.equal(two.game.tiles[left], null);
  assert.throws(() => createMahjongGame(() => 1), RangeError);
  assert.deepEqual(getMahjongTileLabel('◆4'), { suit: '◆', value: 4 });
  assert.equal(getMahjongTileLabel('X4'), null);
});

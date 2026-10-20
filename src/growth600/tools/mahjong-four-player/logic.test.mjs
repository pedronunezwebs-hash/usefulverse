import test from 'node:test';
import assert from 'node:assert/strict';
import { MAHJONG_TILES, mahjongHandWins, startMahjongGame, drawMahjongTile, discardMahjongTile, declareMahjongWin } from './logic.mjs';

test('mahjong hand validator accepts a standard hand of four sets and a pair', () => {
  assert.equal(mahjongHandWins(['1m','2m','3m','4m','5m','6m','7m','8m','9m','1p','2p','3p','E','E']), true);
  assert.equal(mahjongHandWins(['1m','1m','1m','2m','2m','2m','3p','3p','3p','4p','4p','4p','G','G']), true);
});

test('mahjong hand validator rejects malformed counts, excess copies and incomplete or invalid hands', () => {
  assert.equal(mahjongHandWins(Array(14).fill('1m')), false);
  assert.equal(mahjongHandWins(['1m','2m','3m','4m','5m','6m','7m','8m','9m','1p','2p','3p','E']), false);
  assert.equal(mahjongHandWins(['1m','1m','1m','1m','1m','2m','3m','4m','5m','6m','7m','8m','9m','E']), false);
  assert.equal(mahjongHandWins(Array(14).fill('invalid')), false);
  assert.equal(MAHJONG_TILES.length, 34);
});

test('mahjong game deals one extra tile to the dealer and advances draw/discard turns', () => {
  const game = startMahjongGame(['A','B','C','D'], () => 0);
  assert.equal(game.players.length, 4);
  assert.equal(game.players[game.dealer].hand.length, 14);
  assert.equal(game.players.filter((player) => player.hand.length === 13).length, 3);
  assert.equal(game.wall.length, 83);
  const afterDiscard = discardMahjongTile(game, 0);
  assert.equal(afterDiscard.phase, 'draw');
  assert.equal(afterDiscard.turn, (game.dealer + 1) % 4);
  const afterDraw = drawMahjongTile(afterDiscard);
  assert.equal(afterDraw.phase, 'discard');
  assert.equal(afterDraw.players[afterDraw.turn].hand.length, 14);
  assert.throws(() => declareMahjongWin(afterDraw), RangeError);
});

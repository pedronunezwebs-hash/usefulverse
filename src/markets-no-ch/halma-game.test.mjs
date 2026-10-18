import test from 'node:test';
import assert from 'node:assert/strict';
import {
  HALMA_CAMPS, HALMA_DIRECTIONS, HALMA_PIECES, HALMA_SIZE, applyHalmaMove, chooseHalmaCpuMove,
  createHalmaGame, getHalmaNextHops, legalHalmaMoves, playHalmaCpuTurn,
} from './halma-game.mjs';

const point = (x, y) => y * HALMA_SIZE + x;

function fixture({ pieces = [], toMove = 0, mode = 'local', turnCount = 0 } = {}) {
  const initial = createHalmaGame({ seed: 43, mode });
  const board = Array(HALMA_SIZE * HALMA_SIZE).fill(null);
  pieces.forEach(([owner, index]) => { board[index] = owner; });
  return Object.freeze({ ...initial, board: Object.freeze(board), toMove, turnCount });
}

test('the standard two-player board has two opposite 19-cell corner camps', () => {
  assert.equal(HALMA_SIZE, 16);
  assert.equal(HALMA_PIECES, 19);
  assert.equal(HALMA_CAMPS[0].length, 19);
  assert.equal(HALMA_CAMPS[1].length, 19);
  assert.equal(new Set([...HALMA_CAMPS[0], ...HALMA_CAMPS[1]]).size, 38);
  assert.deepEqual(HALMA_CAMPS[0].map((index) => [index % 16, Math.floor(index / 16)]).sort((a, b) => a[1] - b[1] || a[0] - b[0]), [
    [11, 0], [12, 0], [13, 0], [14, 0], [15, 0],
    [11, 1], [12, 1], [13, 1], [14, 1], [15, 1],
    [11, 2], [12, 2], [13, 2], [14, 2], [15, 2],
    [13, 3], [14, 3], [15, 3], [15, 4],
  ].sort((a, b) => a[1] - b[1] || a[0] - b[0]));
  assert.ok(HALMA_CAMPS[0].every((index) => HALMA_CAMPS[1].every((otherIndex) => otherIndex !== index)));
});

test('new games place every piece and expose eight-direction empty steps', () => {
  const game = createHalmaGame();
  assert.equal(game.board.filter((owner) => owner === 0).length, HALMA_PIECES);
  assert.equal(game.board.filter((owner) => owner === 1).length, HALMA_PIECES);
  assert.equal(game.mode, 'cpu');
  const open = fixture({ pieces: [[0, point(5, 5)]] });
  const moves = legalHalmaMoves(open, 0, point(5, 5));
  assert.equal(moves.filter(({ kind }) => kind === 'step').length, 8);
  assert.ok(moves.some(({ to }) => to === point(4, 4)));
});

test('a jump chain may hop over either color without removing any jumped piece', () => {
  const from = point(5, 5);
  const firstLanding = point(7, 5);
  const secondLanding = point(9, 5);
  const game = fixture({ pieces: [[0, from], [0, point(6, 5)], [1, point(8, 5)]] });
  const moves = legalHalmaMoves(game, 0, from).filter(({ kind }) => kind === 'hop');
  assert.ok(moves.some((move) => move.to === firstLanding && move.path.join(',') === String(firstLanding)));
  assert.ok(moves.some((move) => move.to === secondLanding && move.path.join(',') === `${firstLanding},${secondLanding}`));
  assert.deepEqual(getHalmaNextHops(game, 0, from), [firstLanding]);
  assert.deepEqual(getHalmaNextHops(game, 0, from, [firstLanding]), [secondLanding]);
  const after = applyHalmaMove(game, 0, moves.find(({ to, path }) => to === secondLanding && path.length === 2));
  assert.equal(after.board[from], null);
  assert.equal(after.board[secondLanding], 0);
  assert.equal(after.board[point(6, 5)], 0);
  assert.equal(after.board[point(8, 5)], 1);
  assert.equal(after.toMove, 1);
});

test('occupied landings, non-adjacent steps and forged hop paths are rejected without mutation', () => {
  const from = point(5, 5);
  const game = fixture({ pieces: [[0, from], [1, point(6, 5)], [1, point(7, 5)]] });
  const original = [...game.board];
  assert.throws(() => applyHalmaMove(game, 0, { from, to: point(7, 5), path: [point(7, 5)], kind: 'hop' }), /not legal/u);
  assert.throws(() => applyHalmaMove(game, 0, { from, to: point(8, 8), path: [point(8, 8)], kind: 'step' }), /not legal/u);
  assert.deepEqual(game.board, original);
});

test('a piece in the destination camp cannot leave it', () => {
  const target = HALMA_CAMPS[1][0];
  const x = target % 16;
  const y = Math.floor(target / 16);
  const game = fixture({ pieces: [[0, target], [1, HALMA_CAMPS[0][0]]] });
  const moves = legalHalmaMoves(game, 0, target);
  assert.ok(moves.length > 0);
  assert.ok(moves.every(({ to }) => HALMA_CAMPS[1].includes(to)));
  const outward = HALMA_DIRECTIONS.map(([dx, dy]) => [x + dx, y + dy]).find(([nx, ny]) => nx >= 0 && nx < 16 && ny >= 0 && ny < 16 && !HALMA_CAMPS[1].includes(point(nx, ny)));
  assert.ok(outward);
  assert.ok(!moves.some(({ to }) => to === point(...outward)));
});

test('filling the opposing camp wins, while a safety turn cap prevents endless local games', () => {
  const target = HALMA_CAMPS[1];
  const finalSquare = target.find((index) => HALMA_DIRECTIONS.some(([dx, dy]) => {
    const x = index % 16 - dx; const y = Math.floor(index / 16) - dy;
    return x >= 0 && x < 16 && y >= 0 && y < 16 && !target.includes(point(x, y));
  }));
  assert.ok(finalSquare !== undefined);
  const [dx, dy] = HALMA_DIRECTIONS.find(([ox, oy]) => {
    const x = finalSquare % 16 - ox; const y = Math.floor(finalSquare / 16) - oy;
    return x >= 0 && x < 16 && y >= 0 && y < 16 && !target.includes(point(x, y));
  });
  const source = point(finalSquare % 16 - dx, Math.floor(finalSquare / 16) - dy);
  const nearlyWon = fixture({ pieces: [...target.filter((index) => index !== finalSquare).map((index) => [0, index]), [0, source]] });
  const winningMove = legalHalmaMoves(nearlyWon, 0, source).find((move) => move.to === finalSquare);
  assert.ok(winningMove);
  const won = applyHalmaMove(nearlyWon, 0, winningMove);
  assert.equal(won.status, 'won');
  assert.equal(won.winner, 0);

  const capped = fixture({ pieces: [[0, point(5, 5)], [1, point(10, 10)]], turnCount: 399 });
  const draw = applyHalmaMove(capped, 0, legalHalmaMoves(capped, 0)[0]);
  assert.equal(draw.status, 'draw');
});

test('CPU mode selects and plays only legal moves; shared-device mode never invokes it', () => {
  const initial = createHalmaGame({ seed: 9, mode: 'cpu' });
  const cpuMove = chooseHalmaCpuMove(Object.freeze({ ...initial, toMove: 1 }));
  assert.ok(cpuMove);
  assert.ok(legalHalmaMoves(Object.freeze({ ...initial, toMove: 1 }), 1).some((move) => move.from === cpuMove.from && move.to === cpuMove.to && move.path.join(',') === cpuMove.path.join(',')));
  const after = playHalmaCpuTurn(Object.freeze({ ...initial, toMove: 1 }));
  assert.equal(after.toMove, 0);
  assert.equal(after.board.filter((owner) => owner === 1).length, HALMA_PIECES);
  const local = createHalmaGame({ mode: 'local' });
  assert.equal(chooseHalmaCpuMove(Object.freeze({ ...local, toMove: 1 })), null);
  assert.throws(() => createHalmaGame({ mode: 'network' }), /computer or local/u);
});

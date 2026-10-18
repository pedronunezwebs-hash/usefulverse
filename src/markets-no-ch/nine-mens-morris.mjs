export const MORRIS_MILLS = Object.freeze([
  [0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 0],
  [8, 9, 10], [10, 11, 12], [12, 13, 14], [14, 15, 8],
  [16, 17, 18], [18, 19, 20], [20, 21, 22], [22, 23, 16],
  [1, 9, 17], [3, 11, 19], [5, 13, 21], [7, 15, 23],
]);

export const MORRIS_POINTS = Object.freeze([
  [0, 0], [6, 0], [12, 0], [12, 6], [12, 12], [6, 12], [0, 12], [0, 6],
  [2, 2], [6, 2], [10, 2], [10, 6], [10, 10], [6, 10], [2, 10], [2, 6],
  [4, 4], [6, 4], [8, 4], [8, 6], [8, 8], [6, 8], [4, 8], [4, 6],
]);

export const MORRIS_NEIGHBORS = Object.freeze([
  [1, 7], [0, 2, 9], [1, 3], [2, 4, 11], [3, 5], [4, 6, 13], [5, 7], [0, 6, 15],
  [9, 15], [1, 8, 10, 17], [9, 11], [3, 10, 12, 19], [11, 13], [5, 12, 14, 21], [13, 15], [7, 8, 14, 23],
  [17, 23], [9, 16, 18], [17, 19], [11, 18, 20], [19, 21], [13, 20, 22], [21, 23], [15, 16, 22],
].map((neighbors) => Object.freeze(neighbors)));

const PIECES = 9;
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const other = (player) => 1 - player;
const isMill = (board, player, point) => MORRIS_MILLS.some((mill) => mill.includes(point) && mill.every((index) => board[index] === player));
const millsFormedBy = (board, player, point) => MORRIS_MILLS.filter((mill) => mill.includes(point) && mill.every((index) => board[index] === player)).length;
const completesMillAt = (board, player, point) => MORRIS_MILLS.some((mill) => mill.includes(point) && mill.filter((index) => index !== point).every((index) => board[index] === player));
const hash32 = (value) => {
  let x = value >>> 0;
  x ^= x >>> 16; x = Math.imul(x, 0x7feb352d); x ^= x >>> 15; x = Math.imul(x, 0x846ca68b); x ^= x >>> 16;
  return x >>> 0;
};
const positionKey = (board, toMove, phase) => `${board.map((player) => player === null ? '-' : player).join('')}:${toMove}:${phase}`;

export function createMorrisGame({ seed = 1 } = {}) {
  const board = Array(24).fill(null);
  const key = positionKey(board, 0, 'placing');
  return Object.freeze({
    board: Object.freeze(board), placed: Object.freeze([0, 0]), onBoard: Object.freeze([0, 0]),
    toMove: 0, phase: 'placing', pendingMill: false, status: 'playing', winner: null,
    seed: hash32(seed), turnCount: 0, repetitions: Object.freeze({ [key]: 1 }),
  });
}

export function millsAt(board, player, point) {
  return MORRIS_MILLS.filter((mill) => mill.includes(point) && mill.every((index) => board[index] === player)).map((mill) => [...mill]);
}

export function legalMorrisMoves(game, player = game.toMove) {
  if (game.status !== 'playing' || game.pendingMill || player !== game.toMove || game.phase === 'placing') return [];
  const empty = game.board.flatMap((occupant, point) => occupant === null ? [point] : []);
  const pieces = game.board.flatMap((occupant, point) => occupant === player ? [point] : []);
  if (game.phase === 'flying' && game.onBoard[player] === 3) return pieces.flatMap((from) => empty.map((to) => ({ from, to })));
  return pieces.flatMap((from) => MORRIS_NEIGHBORS[from].filter((to) => game.board[to] === null).map((to) => ({ from, to })));
}

function finishTurn(game, board, placed, onBoard, nextPlayer, seed = game.seed) {
  const phase = placed.every((count) => count === PIECES) ? (onBoard.some((count) => count === 3) ? 'flying' : 'moving') : 'placing';
  let status = 'playing'; let winner = null;
  if (placed.every((count) => count === PIECES)) {
    if (onBoard[nextPlayer] < 3) { status = 'won'; winner = other(nextPlayer); }
    else if (phase !== 'placing' && legalMorrisMoves({ board, onBoard, phase, status, pendingMill: false, toMove: nextPlayer }, nextPlayer).length === 0) {
      status = 'won'; winner = other(nextPlayer);
    }
  }
  const turnCount = game.turnCount + 1;
  const key = positionKey(board, nextPlayer, phase);
  const repetitions = { ...game.repetitions, [key]: (game.repetitions[key] ?? 0) + 1 };
  if (status === 'playing' && repetitions[key] >= 3) status = 'draw';
  if (status === 'playing' && turnCount >= 200) status = 'draw';
  return Object.freeze({ ...game, board: Object.freeze(board), placed: Object.freeze(placed), onBoard: Object.freeze(onBoard), toMove: nextPlayer, phase, pendingMill: false, status, winner, seed: hash32(seed + turnCount), turnCount, repetitions: Object.freeze(repetitions) });
}

function pendingCapture(game, board, placed, onBoard, player) {
  const completed = board.some((occupant, point) => occupant === player && millsFormedBy(board, player, point) && !isMill(game.board, player, point));
  return Object.freeze({ ...game, board: Object.freeze(board), placed: Object.freeze(placed), onBoard: Object.freeze(onBoard), pendingMill: completed, lastMillBy: completed ? player : null, phase: game.placed.every((count) => count === PIECES) ? game.phase : 'placing' });
}

export function placeMorrisPiece(game, player, point) {
  assert(game?.status === 'playing' && game.phase === 'placing' && game.toMove === player && !game.pendingMill, 'It is not this player’s placement turn.');
  assert(Number.isInteger(point) && point >= 0 && point < 24 && game.board[point] === null, 'Choose an empty board point.');
  assert(game.placed[player] < PIECES, 'All nine pieces are already placed.');
  const board = [...game.board]; board[point] = player;
  const placed = [...game.placed]; placed[player] += 1;
  const onBoard = [...game.onBoard]; onBoard[player] += 1;
  const provisional = pendingCapture(game, board, placed, onBoard, player);
  return provisional.pendingMill ? provisional : finishTurn(game, board, placed, onBoard, other(player));
}

function removableMorrisPoints(game, victim) {
  const pieces = game.board.flatMap((owner, point) => owner === victim ? [point] : []);
  const outsideMills = pieces.filter((point) => !isMill(game.board, victim, point));
  return outsideMills.length ? outsideMills : pieces;
}

export function removeMorrisPiece(game, player, point) {
  assert(game?.status === 'playing' && game.pendingMill && game.lastMillBy === player && game.toMove === player, 'A mill must be completed before removing a piece.');
  assert(removableMorrisPoints(game, other(player)).includes(point), 'That opponent piece cannot be removed now.');
  const board = [...game.board]; board[point] = null;
  const onBoard = [...game.onBoard]; onBoard[other(player)] -= 1;
  return finishTurn(game, board, [...game.placed], onBoard, other(player));
}

export function moveMorrisPiece(game, player, from, to) {
  assert(game?.status === 'playing' && ['moving', 'flying'].includes(game.phase) && game.toMove === player && !game.pendingMill, 'It is not this player’s move.');
  assert(legalMorrisMoves(game, player).some((move) => move.from === from && move.to === to), 'That move is not legal.');
  const board = [...game.board]; board[from] = null; board[to] = player;
  const provisional = pendingCapture(game, board, [...game.placed], [...game.onBoard], player);
  return provisional.pendingMill ? provisional : finishTurn(game, board, [...game.placed], [...game.onBoard], other(player));
}

function seededChoice(options, seed) {
  return options[hash32(seed) % options.length];
}

function cpuCapture(game) {
  const targets = removableMorrisPoints(game, 0);
  return targets.length ? removeMorrisPiece(game, 1, seededChoice(targets, game.seed)) : game;
}

export function playMorrisCpuTurn(game) {
  let next = game;
  while (next.status === 'playing' && next.toMove === 1) {
    if (next.pendingMill) { next = cpuCapture(next); continue; }
    if (next.phase === 'placing') {
      const empty = next.board.flatMap((owner, point) => owner === null ? [point] : []);
      const ownMillPoints = empty.filter((point) => completesMillAt(next.board, 1, point));
      const blockPoints = empty.filter((point) => completesMillAt(next.board, 0, point));
      const target = seededChoice(ownMillPoints.length ? ownMillPoints : blockPoints.length ? blockPoints : empty, next.seed);
      next = placeMorrisPiece(next, 1, target);
    } else {
      const moves = legalMorrisMoves(next, 1);
      if (!moves.length) return Object.freeze({ ...next, status: 'won', winner: 0 });
      const formsMill = moves.filter(({ from, to }) => completesMillAt(next.board.map((owner, point) => point === from ? null : owner), 1, to));
      const blocksMill = moves.filter(({ from, to }) => completesMillAt(next.board.map((owner, point) => point === from ? null : owner), 0, to));
      const options = formsMill.length ? formsMill : blocksMill.length ? blocksMill : moves;
      const { from, to } = seededChoice(options, next.seed);
      next = moveMorrisPiece(next, 1, from, to);
    }
  }
  return next;
}

export function getMorrisRemovablePoints(game, player = game.toMove) {
  return game.pendingMill && game.lastMillBy === player ? removableMorrisPoints(game, other(player)) : [];
}

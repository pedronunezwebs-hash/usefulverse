export const HALMA_SIZE = 16;
export const HALMA_PIECES = 19;
export const HALMA_DIRECTIONS = Object.freeze([
  [-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1],
].map((direction) => Object.freeze(direction)));

const lowerRightCamp = Array.from({ length: 5 }, (_, column) => Array.from({ length: [3, 3, 4, 4, 5][column] }, (_, row) => [11 + column, row])).flat();
const upperLeftCamp = lowerRightCamp.map(([x, y]) => [HALMA_SIZE - 1 - x, HALMA_SIZE - 1 - y]);
export const HALMA_CAMPS = Object.freeze([lowerRightCamp, upperLeftCamp].map((camp) => Object.freeze(camp.map(([x, y]) => y * HALMA_SIZE + x))));

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const other = (player) => 1 - player;
const inside = (x, y) => x >= 0 && x < HALMA_SIZE && y >= 0 && y < HALMA_SIZE;
const hash32 = (value) => {
  let x = value >>> 0;
  x ^= x >>> 16; x = Math.imul(x, 0x7feb352d); x ^= x >>> 15; x = Math.imul(x, 0x846ca68b); x ^= x >>> 16;
  return x >>> 0;
};
const positionKey = (board, toMove) => `${board.map((owner) => owner === null ? '-' : owner).join('')}:${toMove}`;
const isGoalCell = (player, index) => HALMA_CAMPS[other(player)].includes(index);

function newPosition(board, toMove, turnCount, repetitions, seed, mode, status = 'playing', winner = null) {
  return Object.freeze({ board: Object.freeze(board), toMove, turnCount, repetitions: Object.freeze(repetitions), seed: hash32(seed), mode, status, winner });
}

export function createHalmaGame({ seed = 1, mode = 'cpu', firstPlayer = 0 } = {}) {
  assert(mode === 'cpu' || mode === 'local', 'Choose computer or local two-player mode.');
  assert(firstPlayer === 0 || firstPlayer === 1, 'Choose a valid first player.');
  const board = Array(HALMA_SIZE * HALMA_SIZE).fill(null);
  HALMA_CAMPS[0].forEach((index) => { board[index] = 0; });
  HALMA_CAMPS[1].forEach((index) => { board[index] = 1; });
  const key = positionKey(board, firstPlayer);
  return newPosition(board, firstPlayer, 0, { [key]: 1 }, seed, mode);
}

function buildMovesForPiece(game, player, from) {
  const board = game.board;
  const originX = from % HALMA_SIZE;
  const originY = Math.floor(from / HALMA_SIZE);
  const goal = new Set(HALMA_CAMPS[other(player)]);
  const lockedInGoal = goal.has(from);
  const results = [];

  for (const [dx, dy] of HALMA_DIRECTIONS) {
    const x = originX + dx;
    const y = originY + dy;
    if (!inside(x, y)) continue;
    const to = y * HALMA_SIZE + x;
    if (board[to] === null && (!lockedInGoal || goal.has(to))) results.push({ from, to, path: [to], kind: 'step' });
  }

  const path = [];
  const visited = new Set([from]);
  function continueHops(current) {
    const x = current % HALMA_SIZE;
    const y = Math.floor(current / HALMA_SIZE);
    for (const [dx, dy] of HALMA_DIRECTIONS) {
      const middleX = x + dx;
      const middleY = y + dy;
      const landingX = x + 2 * dx;
      const landingY = y + 2 * dy;
      if (!inside(landingX, landingY) || !inside(middleX, middleY)) continue;
      const middle = middleY * HALMA_SIZE + middleX;
      const landing = landingY * HALMA_SIZE + landingX;
      // The moving piece is the jumper, not a piece it may jump over. Previously visited
      // landings are empty again, so only pieces from the starting position block a hop.
      if (board[middle] === null || middle === from || board[landing] !== null || visited.has(landing)) continue;
      const hasEnteredGoal = lockedInGoal || goal.has(landing) || path.some((point) => goal.has(point));
      if (hasEnteredGoal && !goal.has(landing)) continue;
      path.push(landing);
      visited.add(landing);
      results.push({ from, to: landing, path: [...path], kind: 'hop' });
      continueHops(landing);
      visited.delete(landing);
      path.pop();
    }
  }
  continueHops(from);
  return results;
}

export function legalHalmaMoves(game, player = game?.toMove, from = null) {
  if (!game || game.status !== 'playing' || player !== game.toMove || ![0, 1].includes(player)) return [];
  const pieces = from === null
    ? game.board.flatMap((owner, index) => owner === player ? [index] : [])
    : (Number.isInteger(from) && game.board[from] === player ? [from] : []);
  return pieces.flatMap((piece) => buildMovesForPiece(game, player, piece));
}

export function getHalmaNextHops(game, player, from, path = []) {
  if (!path.length) return [...new Set(legalHalmaMoves(game, player, from).filter((move) => move.kind === 'hop').map((move) => move.path[0]))];
  return [...new Set(legalHalmaMoves(game, player, from)
    .filter((move) => move.kind === 'hop' && move.path.length > path.length && path.every((point, index) => move.path[index] === point))
    .map((move) => move.path[path.length]))];
}

function completeTurn(game, board, nextPlayer) {
  let status = 'playing';
  let winner = null;
  if (HALMA_CAMPS[nextPlayer].every((index) => board[index] === other(nextPlayer))) {
    status = 'won';
    winner = other(nextPlayer);
  }
  const turnCount = game.turnCount + 1;
  const key = positionKey(board, nextPlayer);
  const repetitions = { ...game.repetitions, [key]: (game.repetitions[key] ?? 0) + 1 };
  if (status === 'playing' && repetitions[key] >= 3) status = 'draw';
  if (status === 'playing' && turnCount >= 400) status = 'draw';
  return newPosition(board, nextPlayer, turnCount, repetitions, game.seed + turnCount, game.mode, status, winner);
}

export function applyHalmaMove(game, player, move) {
  assert(game?.status === 'playing' && game.toMove === player, 'It is not this player’s turn.');
  const legal = legalHalmaMoves(game, player).some((candidate) => candidate.from === move?.from && candidate.to === move?.to && candidate.kind === move?.kind && candidate.path.length === move?.path?.length && candidate.path.every((point, index) => point === move.path[index]));
  assert(legal, 'That move or jump chain is not legal.');
  const board = [...game.board];
  board[move.from] = null;
  board[move.to] = player;
  return completeTurn(game, board, other(player));
}

function distanceToCamp(index, camp) {
  const x = index % HALMA_SIZE;
  const y = Math.floor(index / HALMA_SIZE);
  let distance = HALMA_SIZE;
  for (const target of camp) {
    const dx = Math.abs(x - (target % HALMA_SIZE));
    const dy = Math.abs(y - Math.floor(target / HALMA_SIZE));
    distance = Math.min(distance, Math.max(dx, dy));
  }
  return distance;
}

function seededChoice(options, seed) {
  return options[hash32(seed) % options.length];
}

export function chooseHalmaCpuMove(game) {
  if (game?.status !== 'playing' || game.mode !== 'cpu' || game.toMove !== 1) return null;
  const moves = legalHalmaMoves(game, 1);
  if (!moves.length) return null;
  const goal = HALMA_CAMPS[0];
  const scored = moves.map((move) => {
    const score = distanceToCamp(move.from, goal) - distanceToCamp(move.to, goal)
      + (HALMA_CAMPS[1].includes(move.from) ? -2 : 0)
      + (move.kind === 'hop' ? Math.min(move.path.length, 6) * 0.08 : 0);
    return { move, score };
  });
  const best = Math.max(...scored.map(({ score }) => score));
  return seededChoice(scored.filter(({ score }) => score === best).map(({ move }) => move), game.seed);
}

export function playHalmaCpuTurn(game) {
  const move = chooseHalmaCpuMove(game);
  return move ? applyHalmaMove(game, 1, move) : game;
}

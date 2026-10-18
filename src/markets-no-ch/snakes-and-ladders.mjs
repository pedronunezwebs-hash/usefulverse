export const SNAKES_AND_LADDERS_BOARD_SIZE = 100;
export const SNAKES_AND_LADDERS_JUMPS = Object.freeze({
  3: 22, 5: 8, 11: 26, 20: 29, 27: 1, 21: 9, 36: 44, 43: 24,
  50: 67, 54: 34, 62: 19, 66: 87, 71: 91, 80: 100, 89: 68,
  95: 75, 99: 78,
});

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const hash32 = (value) => {
  let x = value >>> 0;
  x ^= x >>> 16; x = Math.imul(x, 0x7feb352d); x ^= x >>> 15; x = Math.imul(x, 0x846ca68b); x ^= x >>> 16;
  return x >>> 0;
};

function freezeState(state) {
  return Object.freeze({ ...state, positions: Object.freeze([...state.positions]), names: Object.freeze([...state.names]) });
}

export function createSnakesAndLaddersGame({ seed = 1, playerCount = 2, mode = 'cpu', finishRule = 'exact', names = [] } = {}) {
  assert(Number.isInteger(playerCount) && playerCount >= 2 && playerCount <= 4, 'Choose 2 to 4 players.');
  assert(mode === 'cpu' || mode === 'shared', 'Choose computer or shared-device play.');
  assert(finishRule === 'exact' || finishRule === 'bounce', 'Choose an exact finish or bounce-back rule.');
  const cleanNames = Array.from({ length: playerCount }, (_, index) => String(names[index] ?? '').trim().slice(0, 24) || `Player ${index + 1}`);
  return freezeState({
    positions: Array(playerCount).fill(0), names: cleanNames, toMove: 0, turnCount: 0,
    seed: hash32(seed), mode, finishRule, status: 'playing', winner: null, lastRoll: null, lastMove: null,
  });
}

export function rollSnakesAndLaddersDie(state, roll = null) {
  assert(state?.status === 'playing', 'This game is not accepting another turn.');
  assert(Number.isInteger(roll) ? roll >= 1 && roll <= 6 : roll === null, 'A die roll must be from 1 to 6.');
  const nextSeed = hash32(state.seed + 0x6d2b79f5);
  const die = roll ?? ((nextSeed % 6) + 1);
  const from = state.positions[state.toMove];
  const raw = from + die;
  let landed = raw;
  if (raw > SNAKES_AND_LADDERS_BOARD_SIZE) {
    landed = state.finishRule === 'exact' ? from : SNAKES_AND_LADDERS_BOARD_SIZE - (raw - SNAKES_AND_LADDERS_BOARD_SIZE);
  }
  const jumpTo = SNAKES_AND_LADDERS_JUMPS[landed] ?? null;
  const to = jumpTo ?? landed;
  const positions = [...state.positions];
  positions[state.toMove] = to;
  const won = to === SNAKES_AND_LADDERS_BOARD_SIZE;
  const turnCount = state.turnCount + 1;
  return freezeState({
    ...state, positions, seed: nextSeed, toMove: won ? state.toMove : (state.toMove + 1) % positions.length,
    turnCount, status: won ? 'won' : 'playing', winner: won ? state.toMove : null,
    lastRoll: die, lastMove: Object.freeze({ player: state.toMove, from, roll: die, landed, to, jump: jumpTo === null ? null : (jumpTo > landed ? 'ladder' : 'snake') }),
  });
}

export function getSnakesAndLaddersPathPosition(cell) {
  assert(Number.isInteger(cell) && cell >= 1 && cell <= SNAKES_AND_LADDERS_BOARD_SIZE, 'Board cell must be between 1 and 100.');
  const offset = cell - 1;
  const rowFromBottom = Math.floor(offset / 10);
  const columnInRow = offset % 10;
  const columnFromLeft = rowFromBottom % 2 === 0 ? columnInRow : 9 - columnInRow;
  return Object.freeze({ row: 9 - rowFromBottom, column: columnFromLeft });
}

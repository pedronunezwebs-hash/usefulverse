function secureLane() {
  if (!globalThis.crypto?.getRandomValues) throw new TypeError('Secure random selection is unavailable.');
  const value = new Uint32Array(1); const ceiling = Math.floor(0x1_0000_0000 / 3) * 3;
  do { globalThis.crypto.getRandomValues(value); } while (value[0] >= ceiling);
  return value[0] % 3;
}

export function createRacingGame() {
  return Object.freeze({ status: 'ready', lane: 1, obstacle: null, score: 0, ticks: 0 });
}

export function startRacingGame(state = createRacingGame()) {
  return Object.freeze({ ...state, status: 'running', lane: 1, obstacle: null, score: 0, ticks: 0 });
}

export function moveRacingCar(state, direction) {
  if (!state || state.status !== 'running' || !['left', 'right'].includes(direction)) return state;
  const delta = direction === 'left' ? -1 : 1;
  return Object.freeze({ ...state, lane: Math.max(0, Math.min(2, state.lane + delta)) });
}

export function stepRacingGame(state) {
  if (!state || state.status !== 'running') return state;
  const obstacle = state.obstacle ? { ...state.obstacle, row: state.obstacle.row + 1 } : { lane: secureLane(), row: 0 };
  const ticks = state.ticks + 1;
  if (obstacle.row === 6 && obstacle.lane === state.lane) return Object.freeze({ ...state, obstacle: Object.freeze(obstacle), ticks, status: 'finished' });
  if (obstacle.row > 6) return Object.freeze({ ...state, obstacle: null, ticks, score: state.score + 1 });
  return Object.freeze({ ...state, obstacle: Object.freeze(obstacle), ticks });
}

export function pauseRacingGame(state) {
  if (!state || !['running', 'paused'].includes(state.status)) return state;
  return Object.freeze({ ...state, status: state.status === 'running' ? 'paused' : 'running' });
}

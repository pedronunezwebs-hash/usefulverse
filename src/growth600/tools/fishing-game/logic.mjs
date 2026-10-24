function secureInteger(min, max) {
  if (!globalThis.crypto?.getRandomValues || !Number.isInteger(min) || !Number.isInteger(max) || max < min) throw new TypeError('Secure random selection is unavailable.');
  const size = max - min + 1; const ceiling = Math.floor(0x1_0000_0000 / size) * size; const value = new Uint32Array(1);
  do { globalThis.crypto.getRandomValues(value); } while (value[0] >= ceiling);
  return min + value[0] % size;
}

export function createFishingGame() {
  return Object.freeze({ phase: 'idle', casts: 0, catches: 0, escapes: 0, catchKind: null });
}

export function castFishingLine(state) {
  if (!state || !['idle', 'finished'].includes(state.phase)) throw new RangeError('Finish the current cast before casting again.');
  return Object.freeze({ ...state, phase: 'waiting', casts: state.casts + 1, catchKind: null, biteDelayMs: 1200 + secureInteger(0, 3300) });
}

export function triggerFishingBite(state) {
  if (!state || state.phase !== 'waiting') throw new RangeError('Wait for a bite before reeling in.');
  return Object.freeze({ ...state, phase: 'bite', catchKind: secureInteger(1, 100) <= 60 ? 'small' : secureInteger(1, 100) <= 70 ? 'medium' : 'large' });
}

export function reelFishingCatch(state) {
  if (!state || state.phase !== 'bite') throw new RangeError('There is no bite to reel in.');
  return Object.freeze({ ...state, phase: 'finished', catches: state.catches + 1 });
}

export function loseFishingCatch(state) {
  if (!state || state.phase !== 'bite') throw new RangeError('There is no fish on the line.');
  return Object.freeze({ ...state, phase: 'finished', escapes: state.escapes + 1, catchKind: null });
}

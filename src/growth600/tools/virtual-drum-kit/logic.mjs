export const DRUM_PADS = Object.freeze([
  { id: 'kick', key: 'a' }, { id: 'snare', key: 's' }, { id: 'closed-hat', key: 'd' },
  { id: 'open-hat', key: 'f' }, { id: 'high-tom', key: 'j' }, { id: 'low-tom', key: 'k' }, { id: 'crash', key: 'l' },
]);
export const MAX_PATTERN_MS = 5 * 60 * 1000;
export const MAX_DRUM_HITS = 5000;

export function createDrumPattern() { return { startedAt: null, stoppedAt: null, hits: [] }; }

export function recordDrumHit(pattern, padId, elapsedMs) {
  if (!DRUM_PADS.some(({ id }) => id === padId)) throw new RangeError('Unknown drum pad.');
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0 || elapsedMs > MAX_PATTERN_MS) throw new RangeError('Hit time is outside the recording limit.');
  if (pattern.hits.length >= MAX_DRUM_HITS) throw new RangeError('The recording reached its hit limit.');
  if (pattern.startedAt === null) pattern.startedAt = 0;
  pattern.hits.push({ pad: padId, atMs: Math.round(elapsedMs) });
  return pattern.hits.at(-1);
}

export function exportDrumPattern(pattern) {
  const hits = pattern.hits.map(({ pad, atMs }) => ({ pad, atMs }));
  const durationMs = Math.min(MAX_PATTERN_MS, Math.max(pattern.stoppedAt ?? 0, ...hits.map(({ atMs }) => atMs)));
  return { format: 'UsefulVerse drum pattern', version: 1, durationMs, hitCount: hits.length, hits };
}

export function skipOverdueMetronomeBeats({ nextNoteAt, currentTime, secondsPerBeat, beatIndex, beatsPerBar }) {
  if (![nextNoteAt, currentTime, secondsPerBeat, beatIndex, beatsPerBar].every(Number.isFinite)
      || secondsPerBeat <= 0 || !Number.isInteger(beatIndex) || beatIndex < 0
      || !Number.isInteger(beatsPerBar) || beatsPerBar < 1) {
    throw new RangeError('Metronome timing values must be finite and positive.');
  }

  const skipped = Math.max(0, Math.floor((currentTime - nextNoteAt) / secondsPerBeat));
  return {
    nextNoteAt: nextNoteAt + skipped * secondsPerBeat,
    beatIndex: (beatIndex + skipped) % beatsPerBar,
    skipped,
  };
}

export function scoreRhythmTaps({ tapTimes, firstBeatAt, secondsPerBeat, targetCount = 16, toleranceMs = 100 }) {
  if (!Array.isArray(tapTimes) || !Number.isFinite(firstBeatAt) || !Number.isFinite(secondsPerBeat) || secondsPerBeat <= 0
      || !Number.isInteger(targetCount) || targetCount < 1 || !Number.isFinite(toleranceMs) || toleranceMs < 0
      || tapTimes.some((time) => !Number.isFinite(time))) {
    throw new RangeError('Rhythm practice values are invalid.');
  }
  const offsets = tapTimes.slice(0, targetCount).map((time, index) => (time - (firstBeatAt + index * secondsPerBeat)) * 1000);
  const averageOffsetMs = offsets.length ? offsets.reduce((sum, value) => sum + value, 0) / offsets.length : 0;
  const accuracy = offsets.length ? Math.round(offsets.filter((value) => Math.abs(value) <= toleranceMs).length / offsets.length * 100) : 0;
  return { taps: offsets.length, targetCount, accuracy, averageAbsoluteOffsetMs: offsets.length ? Math.round(offsets.reduce((sum, value) => sum + Math.abs(value), 0) / offsets.length) : 0, complete: offsets.length === targetCount };
}

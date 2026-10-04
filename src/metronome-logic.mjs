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

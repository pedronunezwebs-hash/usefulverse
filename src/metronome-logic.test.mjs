import test from 'node:test';
import assert from 'node:assert/strict';
import { skipOverdueMetronomeBeats } from './metronome-logic.mjs';

test('metronome keeps upcoming beats when its scheduler is on time', () => {
  assert.deepEqual(skipOverdueMetronomeBeats({ nextNoteAt: 10.1, currentTime: 10, secondsPerBeat: 0.5, beatIndex: 2, beatsPerBar: 4 }), {
    nextNoteAt: 10.1, beatIndex: 2, skipped: 0,
  });
});

test('metronome skips overdue beats after throttling and preserves the bar phase', () => {
  assert.deepEqual(skipOverdueMetronomeBeats({ nextNoteAt: 10, currentTime: 12.1, secondsPerBeat: 0.5, beatIndex: 1, beatsPerBar: 4 }), {
    nextNoteAt: 12, beatIndex: 1, skipped: 4,
  });
});

test('metronome rejects invalid scheduler values', () => {
  assert.throws(() => skipOverdueMetronomeBeats({ nextNoteAt: 0, currentTime: 1, secondsPerBeat: 0, beatIndex: 0, beatsPerBar: 4 }), RangeError);
  assert.throws(() => skipOverdueMetronomeBeats({ nextNoteAt: 0, currentTime: 1, secondsPerBeat: 0.5, beatIndex: 0, beatsPerBar: 4.5 }), RangeError);
});

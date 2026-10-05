import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreRhythmTaps, skipOverdueMetronomeBeats } from './metronome-logic.mjs';

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

test('rhythm practice scores timing against the audio clock and reports accuracy without rounding away error', () => {
  const result = scoreRhythmTaps({ tapTimes: [10, 10.5, 11.14, 11.5], firstBeatAt: 10, secondsPerBeat: 0.5, targetCount: 4, toleranceMs: 100 });
  assert.deepEqual(result, { taps: 4, targetCount: 4, accuracy: 75, averageAbsoluteOffsetMs: 35, complete: true });
  assert.equal(scoreRhythmTaps({ tapTimes: [1, 1.5], firstBeatAt: 1, secondsPerBeat: 0.5 }).complete, false);
  assert.equal(scoreRhythmTaps({ tapTimes: [], firstBeatAt: 1, secondsPerBeat: 0.5 }).accuracy, 0);
});

test('rhythm practice rejects invalid clock values', () => {
  assert.throws(() => scoreRhythmTaps({ tapTimes: [NaN], firstBeatAt: 0, secondsPerBeat: 0.5 }), RangeError);
  assert.throws(() => scoreRhythmTaps({ tapTimes: [], firstBeatAt: 0, secondsPerBeat: 0 }), RangeError);
});

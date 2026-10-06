import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createChessClock,
  getChessClockSnapshot,
  pauseChessClock,
  resetChessClock,
  startChessClock,
  switchChessClockPlayer,
  validateChessClockSettings,
} from './chess-clock-logic.mjs';

test('validates bounded clock settings and rejects fractions', () => {
  assert.deepEqual(validateChessClockSettings({ minutes: '5', incrementSeconds: '3' }), { minutes: 5, incrementSeconds: 3 });
  assert.throws(() => validateChessClockSettings({ minutes: 0 }), /Starting time/u);
  assert.throws(() => validateChessClockSettings({ minutes: 181 }), /Starting time/u);
  assert.throws(() => validateChessClockSettings({ minutes: 5, incrementSeconds: 1.5 }), /Increment/u);
});

test('starts with White and counts down from a monotonic reference', () => {
  const initial = createChessClock({ minutes: 5, incrementSeconds: 2 });
  const started = startChessClock(initial, 1_000);
  assert.equal(started.active, 'white');
  assert.deepEqual(getChessClockSnapshot(started, 3_500), { whiteMs: 297_500, blackMs: 300_000, active: 'white', running: true, flagged: null });
});

test('switches sides and awards increment to the player who completed the move', () => {
  let clock = startChessClock(createChessClock({ minutes: 1, incrementSeconds: 3 }), 0);
  clock = switchChessClockPlayer(clock, 12_000);
  assert.equal(clock.whiteMs, 51_000);
  assert.equal(clock.active, 'black');
  assert.equal(clock.deadline, 72_000);
});

test('pause and resume preserve remaining time; reset clears moves and flags', () => {
  let clock = startChessClock(createChessClock({ minutes: 2, incrementSeconds: 0 }), 10_000);
  clock = pauseChessClock(clock, 35_000);
  assert.equal(clock.whiteMs, 95_000);
  clock = startChessClock(clock, 100_000);
  assert.equal(getChessClockSnapshot(clock, 110_000).whiteMs, 85_000);
  clock = resetChessClock(clock, 111_000);
  assert.deepEqual(getChessClockSnapshot(clock, 111_000), { whiteMs: 120_000, blackMs: 120_000, active: null, running: false, flagged: null });
});

test('flags the active side on time and cannot switch after the flag', () => {
  let clock = startChessClock(createChessClock({ minutes: 1 }), 0);
  assert.equal(getChessClockSnapshot(clock, 60_000).flagged, 'white');
  clock = switchChessClockPlayer(clock, 60_000);
  assert.equal(clock.flagged, 'white');
  assert.equal(clock.running, false);
});

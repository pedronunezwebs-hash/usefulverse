import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_POMODORO_SETTINGS, nextPomodoroPhase, normalizePomodoroSettings, remainingUntil } from './timer-logic.mjs';

test('Pomodoro cycles short breaks and schedules a long break after the selected number of completed focus sessions', () => {
  assert.equal(nextPomodoroPhase('focus', 1, 4), 'short-break');
  assert.equal(nextPomodoroPhase('short-break', 1, 4), 'focus');
  assert.equal(nextPomodoroPhase('focus', 4, 4), 'long-break');
  assert.equal(nextPomodoroPhase('long-break', 4, 4), 'focus');
  assert.equal(nextPomodoroPhase('focus', 6, 3), 'long-break');
});

test('Pomodoro preferences accept bounded values and safely fall back for corrupt local data', () => {
  assert.deepEqual(normalizePomodoroSettings({ focusMinutes: 50, shortBreakMinutes: 7, longBreakEvery: 3, autoStart: true, sound: false, volume: 80 }), {
    focusMinutes: 50, shortBreakMinutes: 7, longBreakMinutes: 15, longBreakEvery: 3, autoStart: true, sound: false, volume: 80,
  });
  assert.deepEqual(normalizePomodoroSettings({ focusMinutes: 0, longBreakEvery: 'many', volume: 101 }), DEFAULT_POMODORO_SETTINGS);
});

test('timer deadlines remain accurate after delayed browser ticks and never go below zero', () => {
  assert.equal(remainingUntil(10_000, 8_500), 1_500);
  assert.equal(remainingUntil(10_000, 12_500), 0);
  assert.throws(() => remainingUntil(Number.NaN, 0), /finite/u);
});

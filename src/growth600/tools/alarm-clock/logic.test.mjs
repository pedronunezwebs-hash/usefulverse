import assert from 'node:assert/strict';
import test from 'node:test';
import { alarmStateAt, ALARM_CLOCK_LIMITS, localDateTimeInputValue, parseLocalAlarmDateTime, snoozedAlarmTarget } from './logic.mjs';

test('parses future local date-times and enforces the seven-day scheduling boundary', () => {
  const target = parseLocalAlarmDateTime('2026-10-13T07:30', new Date(2026, 9, 12, 12).getTime());
  assert.equal(new Date(target).getHours(), 7);
  assert.throws(() => parseLocalAlarmDateTime('2026-10-12T11:59', new Date(2026, 9, 12, 12).getTime()), /future time/);
  assert.throws(() => parseLocalAlarmDateTime('2026-10-19T12:01', new Date(2026, 9, 12, 12).getTime()), /seven days/);
  assert.equal(parseLocalAlarmDateTime('2026-10-19T11:59', new Date(2026, 9, 12, 12).getTime()), new Date(2026, 9, 19, 11, 59).getTime());
});

test('rejects malformed and nonexistent local times, including a DST spring-forward gap', () => {
  assert.throws(() => parseLocalAlarmDateTime('tomorrow', Date.now()), /date and time/);
  assert.throws(() => parseLocalAlarmDateTime('2026-02-30T07:00', new Date(2026, 1, 1).getTime()), /does not exist/);
  const dstGap = new Date(2026, 2, 8, 2, 30);
  if (dstGap.getHours() !== 2) assert.throws(() => parseLocalAlarmDateTime('2026-03-08T02:30', new Date(2026, 2, 7).getTime()), /does not exist/);
});

test('alarm state reaches ringing at the target and snooze is exactly five minutes', () => {
  const target = 1_800_000;
  assert.deepEqual(alarmStateAt(target, target - 1_200), { phase: 'waiting', remainingMs: 1_200, remainingSeconds: 2 });
  assert.deepEqual(alarmStateAt(target, target), { phase: 'ringing', remainingMs: 0, remainingSeconds: 0 });
  assert.equal(snoozedAlarmTarget(5_000), 305_000);
  assert.deepEqual(ALARM_CLOCK_LIMITS, { maxScheduleMs: 604_800_000, snoozeMs: 300_000 });
  assert.throws(() => alarmStateAt(Number.NaN, 0), /finite/);
});

test('local input formatter emits browser-local wall time without seconds', () => {
  assert.match(localDateTimeInputValue(new Date(2026, 0, 2, 3, 4)), /^2026-01-02T03:04$/);
});

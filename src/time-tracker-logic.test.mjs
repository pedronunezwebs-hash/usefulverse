import test from 'node:test';
import assert from 'node:assert/strict';
import { elapsedTimeSession, exportTimeSessionsCsv, finishTimeSession, normalizeProjectName, pauseTimeSession, resumeTimeSession, serializeTimeSessions, startTimeSession, summarizeTimeSessions, validateTimeSessions } from './time-tracker-logic.mjs';

test('time tracker trims Unicode task names and rejects empty or oversized names', () => {
  assert.equal(normalizeProjectName('  Café   仕事  '), 'Café 仕事');
  assert.throws(() => normalizeProjectName('  '), /name/u);
  assert.throws(() => normalizeProjectName('x'.repeat(121)), /120/u);
});

test('elapsed time uses a monotonic clock and pause/resume does not count paused time', () => {
  let session = startTimeSession('Writing', 1_000_000, 10);
  assert.equal(elapsedTimeSession(session, 70_000), 69_990);
  session = pauseTimeSession(session, 70_000);
  assert.equal(elapsedTimeSession(session, 500_000), 69_990);
  session = resumeTimeSession(session, 500_000);
  assert.equal(elapsedTimeSession(session, 510_000), 79_990);
  assert.throws(() => pauseTimeSession(session, 1), /paused/u);
});

test('finished sessions keep start wall-time while elapsed duration uses monotonic time', () => {
  const started = startTimeSession('Design', 1_000_000, 50);
  const finished = finishTimeSession(started, 1_250, 1_001_300);
  assert.deepEqual(finished, { name: 'Design', startedAt: 1_000_000, endedAt: 1_001_300, durationMs: 1_200 });
  assert.throws(() => finishTimeSession(started, 100, 1_000_050), /1 second/u);
});

test('time-session backups validate, export deterministic CSV and summarize by task', () => {
  const sessions = [
    { name: 'Writing', startedAt: 1_000_000, endedAt: 1_003_000, durationMs: 3_000 },
    { name: 'Writing', startedAt: 2_000_000, endedAt: 2_002_000, durationMs: 2_000 },
    { name: '=SUM(A1:A2)', startedAt: 3_000_000, endedAt: 3_001_000, durationMs: 1_000 },
  ];
  assert.deepEqual(validateTimeSessions(serializeTimeSessions(sessions)), sessions);
  assert.deepEqual(summarizeTimeSessions(sessions), [{ name: 'Writing', durationMs: 5_000 }, { name: '=SUM(A1:A2)', durationMs: 1_000 }]);
  assert.match(exportTimeSessionsCsv(sessions), /'=SUM\(A1:A2\)/u);
  assert.throws(() => validateTimeSessions({ version: 1, sessions: [{ ...sessions[0], durationMs: 0 }] }), /not valid/u);
  assert.throws(() => validateTimeSessions({ version: 2, sessions: [] }), /backup/u);
});

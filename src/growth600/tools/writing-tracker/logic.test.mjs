import assert from 'node:assert/strict';
import test from 'node:test';
import { addWritingProject, createWritingTrackerState, deleteWritingProject, deleteWritingSession, escapeWritingCsvCell, recordWritingSession, restoreWritingTrackerState, summarizeWritingTracker } from './logic.mjs';

const empty = createWritingTrackerState();
const project = addWritingProject(empty, { id: 'novel', name: 'Novel', targetWords: 1000 });

test('writing sessions roll up to their project and a goal without changing word counts', () => {
  let state = recordWritingSession(project, { id: 's1', projectId: 'novel', date: '2026-10-14', words: 400, minutes: 30 });
  state = recordWritingSession(state, { id: 's2', projectId: 'novel', date: '2026-10-15', words: 250, minutes: 20 });
  const summary = summarizeWritingTracker(state, '2026-10-15');
  assert.equal(summary.totalWords, 650);
  assert.equal(summary.totalMinutes, 50);
  assert.equal(summary.currentStreak, 2);
  assert.deepEqual(summary.projects[0], { id: 'novel', name: 'Novel', targetWords: 1000, words: 650, remainingWords: 350, progressPercent: 65, sessions: 2 });
});

test('editing a session upserts its stable ID and never double-counts the original', () => {
  const first = recordWritingSession(project, { id: 'session', projectId: 'novel', date: '2026-10-15', words: 100 });
  const edited = recordWritingSession(first, { id: 'session', projectId: 'novel', date: '2026-10-15', words: 160 });
  assert.equal(edited.sessions.length, 1);
  assert.equal(summarizeWritingTracker(edited, '2026-10-15').totalWords, 160);
});

test('zero-word sessions do not create a writing streak and deletion updates totals', () => {
  const state = recordWritingSession(project, { id: 'zero', projectId: 'novel', date: '2026-10-15', words: 0 });
  assert.equal(summarizeWritingTracker(state, '2026-10-15').currentStreak, 0);
  assert.equal(deleteWritingSession(state, 'zero').sessions.length, 0);
});

test('deleting a project explicitly removes its associated session history', () => {
  const state = recordWritingSession(project, { id: 's1', projectId: 'novel', date: '2026-10-15', words: 10 });
  const deleted = deleteWritingProject(state, 'novel');
  assert.equal(deleted.projects.length, 0);
  assert.equal(deleted.sessions.length, 0);
});

test('rejects missing projects, duplicate project IDs, malformed dates and unsafe counts', () => {
  assert.throws(() => addWritingProject(project, { id: 'novel', name: 'Again' }), /already exists/u);
  assert.throws(() => recordWritingSession(project, { id: 'x', projectId: 'unknown', date: '2026-10-15', words: 1 }), /existing project/u);
  assert.throws(() => recordWritingSession(project, { id: 'x', projectId: 'novel', date: '2026-02-30', words: 1 }), /valid session date/u);
  assert.throws(() => recordWritingSession(project, { id: 'x', projectId: 'novel', date: '2026-10-15', words: 1.5 }), /whole number/u);
  assert.throws(() => recordWritingSession(project, { id: 'x', projectId: 'novel', date: '2026-10-15', words: 1, minutes: 1441 }), /whole number/u);
});

test('restores only a supported, internally consistent local backup', () => {
  const state = recordWritingSession(project, { id: 's1', projectId: 'novel', date: '2026-10-15', words: 25, minutes: 5 });
  assert.deepEqual(restoreWritingTrackerState(JSON.parse(JSON.stringify(state))), state);
  assert.throws(() => restoreWritingTrackerState({ schemaVersion: 2, projects: [], sessions: [] }), /supported/u);
  assert.throws(() => restoreWritingTrackerState({ schemaVersion: 1, projects: [], sessions: [{ id: 's1', projectId: 'missing', date: '2026-10-15', words: 1 }] }), /existing project/u);
});

test('CSV cells quote delimiters and neutralize spreadsheet formula prefixes after whitespace', () => {
  assert.equal(escapeWritingCsvCell('A "quote", here'), '"A ""quote"", here"');
  assert.equal(escapeWritingCsvCell('  =HYPERLINK("https://example.com")'), '"\'  =HYPERLINK(""https://example.com"")"');
  assert.equal(escapeWritingCsvCell(250), '"250"');
});

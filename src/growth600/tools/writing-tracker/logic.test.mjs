import test from 'node:test';
import assert from 'node:assert/strict';
import { createWritingProject, createWritingSession, getWritingSummary, removeWritingSession, restoreWritingTracker, upsertWritingProject, upsertWritingSession } from './logic.mjs';

const project = createWritingProject({ id: 'p1', name: 'Draft', goalWords: 1000 });
const projects = [project];
const session = { id: 's1', projectId: 'p1', date: '2026-10-12', words: 250, minutes: 30, note: 'Chapter 1' };

test('project names are case-insensitively unique and goals are optional', () => {
  assert.throws(() => upsertWritingProject(projects, { id: 'p2', name: 'draft' }), /already exists/u);
  assert.throws(() => upsertWritingProject([...projects, createWritingProject({ id: 'p2', name: 'Notes' })], { id: 'p2', name: 'DRAFT' }), /already exists/u);
  assert.equal(createWritingProject({ id: 'p2', name: 'Notes' }).goalWords, null);
});

test('saving the same session ID replaces it instead of double counting', () => {
  const one = upsertWritingSession([], session, projects);
  const edited = upsertWritingSession(one, { ...session, words: 300 }, projects);
  assert.equal(edited.length, 1);
  assert.equal(edited[0].words, 300);
});

test('session input requires a real project, date, bounded words and valid optional duration', () => {
  assert.equal(createWritingSession(session, projects).words, 250);
  assert.throws(() => createWritingSession({ ...session, projectId: 'missing' }, projects), /existing project/u);
  assert.throws(() => createWritingSession({ ...session, date: '2026-02-30' }, projects), /valid session date/u);
  assert.throws(() => createWritingSession({ ...session, words: -1 }, projects), /supported range/u);
  assert.throws(() => createWritingSession({ ...session, minutes: 1441 }, projects), /supported range/u);
});

test('summary separates today from rolling seven-day trend without counting other projects', () => {
  const other = createWritingProject({ id: 'p2', name: 'Other' });
  const entries = upsertWritingSession([], session, [...projects, other]);
  const withYesterday = upsertWritingSession(entries, { ...session, id: 's2', date: '2026-10-11', words: 100 }, [...projects, other]);
  const all = upsertWritingSession(withYesterday, { ...session, id: 's3', projectId: 'p2', words: 999 }, [...projects, other]);
  const summary = getWritingSummary(all, 'p1', '2026-10-12');
  assert.equal(summary.todayWords, 250);
  assert.equal(summary.weekWords, 350);
  assert.equal(summary.weekSessions, 2);
  assert.deepEqual(summary.daily.at(-2), { date: '2026-10-11', words: 100 });
});

test('remove, export/import round trip and backups reject duplicate IDs or orphan sessions', () => {
  const entries = upsertWritingSession([], session, projects);
  assert.equal(removeWritingSession(entries, 's1', projects).length, 0);
  const backup = restoreWritingTracker({ schemaVersion: 1, projects, sessions: entries });
  assert.deepEqual(backup.sessions, entries);
  assert.throws(() => restoreWritingTracker({ schemaVersion: 1, projects, sessions: [session, session] }), /duplicate session IDs/u);
  assert.throws(() => restoreWritingTracker({ schemaVersion: 1, projects, sessions: [{ ...session, projectId: 'orphan' }] }), /existing project/u);
});

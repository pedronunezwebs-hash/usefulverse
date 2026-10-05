import test from 'node:test';
import assert from 'node:assert/strict';
import { addReadingBook, serializeReadingLog, summarizeReadingLog, updateReadingProgress, validateReadingGoal, validateReadingLog } from './reading-log-logic.mjs';

test('reading log accepts Unicode titles and tracks progress and completion', () => {
  const books = addReadingBook([], { id: 'book-1', title: '雪国', author: '川端康成', totalPages: 120, currentPage: 0 });
  const first = updateReadingProgress(books, [], 'book-1', 25, 30, '2026-10-05');
  assert.equal(first.pagesRead, 25);
  assert.equal(first.books[0].status, 'reading');
  const done = updateReadingProgress(first.books, first.sessions, 'book-1', 120, 40, '2026-10-06');
  assert.equal(done.books[0].status, 'finished');
  assert.equal(done.sessions[1].pagesRead, 95);
});

test('progress corrections do not create negative reading sessions', () => {
  const books = addReadingBook([], { id: 'b', title: 'Book', totalPages: 100, currentPage: 50 });
  const corrected = updateReadingProgress(books, [], 'b', 40, null, '2026-10-05');
  assert.equal(corrected.pagesRead, 0);
  assert.equal(corrected.books[0].currentPage, 40);
  assert.deepEqual(corrected.sessions, []);
});

test('weekly totals include only dates in the selected Monday-to-Sunday week', () => {
  const books = addReadingBook([], { id: 'b', title: 'Book', totalPages: 200, currentPage: 0 });
  let result = updateReadingProgress(books, [], 'b', 12, 15, '2026-10-05');
  result = updateReadingProgress(result.books, result.sessions, 'b', 30, 20, '2026-10-06');
  result = updateReadingProgress(result.books, result.sessions, 'b', 35, 10, '2026-10-12');
  assert.deepEqual(summarizeReadingLog(result.books, result.sessions, '2026-10-05'), {
    totalBooks: 1, readingBooks: 1, finishedBooks: 0, pagesThisWeek: 30, minutesThisWeek: 35,
  });
});

test('reading log validates backups, page and goal boundaries', () => {
  assert.equal(validateReadingGoal(100), 100);
  assert.throws(() => validateReadingGoal(0), /1 to 10,000/u);
  assert.throws(() => addReadingBook([], { id: 'b', title: 'Book', totalPages: 5, currentPage: 6 }), /outside/u);
  const log = { version: 1, goalPages: 50, books: [{ id: 'b', title: 'Book', author: '', totalPages: 10, currentPage: 3, status: 'reading' }], sessions: [{ id: 's1', bookId: 'b', date: '2026-10-05', pagesRead: 3, minutes: 15 }] };
  assert.deepEqual(validateReadingLog(serializeReadingLog(log)), log);
  assert.throws(() => validateReadingLog({ ...log, sessions: [{ ...log.sessions[0], bookId: 'missing' }] }), /session is invalid/u);
});

const MAX_BOOKS = 500;
const MAX_SESSIONS = 10_000;
const MAX_TITLE = 180;
const MAX_AUTHOR = 120;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/u;

function cleanText(value, maximum, label, optional = false) {
  if (typeof value !== 'string') throw new TypeError(`${label} must be text.`);
  const text = value.normalize('NFC').trim().replace(/\s+/gu, ' ');
  if (!text && optional) return '';
  if (!text) throw new TypeError(`${label} cannot be empty.`);
  if ([...text].length > maximum) throw new RangeError(`${label} is too long.`);
  return text;
}

export function validReadingDate(value) {
  if (typeof value !== 'string' || !ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export function createReadingBook({ id, title, author = '', totalPages = null, currentPage = 0, status }) {
  if (typeof id !== 'string' || !/^[\w-]{1,80}$/u.test(id)) throw new TypeError('Book ID is invalid.');
  const name = cleanText(title, MAX_TITLE, 'Book title');
  const by = cleanText(author, MAX_AUTHOR, 'Author', true);
  if (totalPages !== null && (!Number.isSafeInteger(totalPages) || totalPages < 1 || totalPages > 1_000_000)) throw new RangeError('Total pages must be from 1 to 1,000,000.');
  if (!Number.isSafeInteger(currentPage) || currentPage < 0 || currentPage > (totalPages ?? 1_000_000)) throw new RangeError('Current page is outside the valid range.');
  const expectedStatus = totalPages !== null && currentPage === totalPages ? 'finished' : currentPage > 0 ? 'reading' : 'planned';
  if (status !== undefined && status !== expectedStatus) throw new TypeError('Book status does not match its reading progress.');
  return { id, title: name, author: by, totalPages, currentPage, status: expectedStatus };
}

export function addReadingBook(books, input) {
  if (!Array.isArray(books) || books.length >= MAX_BOOKS) throw new RangeError('The reading log can contain up to 500 books.');
  const book = createReadingBook(input);
  if (books.some((item) => item.id === book.id)) throw new TypeError('Book IDs must be unique.');
  return [...books, book];
}

export function updateReadingProgress(books, sessions, bookId, currentPage, minutes, date) {
  if (!Array.isArray(books) || !Array.isArray(sessions)) throw new TypeError('Reading log data is invalid.');
  if (!validReadingDate(date)) throw new TypeError('Choose a valid reading date.');
  if (minutes !== null && (!Number.isSafeInteger(minutes) || minutes < 0 || minutes > 1_440)) throw new RangeError('Reading time must be from 0 to 1,440 minutes.');
  const index = books.findIndex((book) => book.id === bookId);
  if (index < 0) throw new TypeError('Choose a book from your list.');
  const book = createReadingBook(books[index]);
  if (!Number.isSafeInteger(currentPage) || currentPage < 0 || currentPage > (book.totalPages ?? 1_000_000)) throw new RangeError('Current page is outside the valid range.');
  const pageDelta = Math.max(0, currentPage - book.currentPage);
  const status = book.totalPages !== null && currentPage === book.totalPages ? 'finished' : currentPage > 0 ? 'reading' : 'planned';
  const nextBooks = books.map((item, i) => i === index ? { ...book, currentPage, status } : item);
  const shouldLog = pageDelta > 0 || (minutes ?? 0) > 0;
  if (shouldLog && sessions.length >= MAX_SESSIONS) throw new RangeError('The reading log has reached its session limit.');
  const sessionId = shouldLog ? globalThis.crypto?.randomUUID?.() ?? `${date}-${bookId}-${Date.now()}-${sessions.length}` : null;
  if (sessionId && sessions.some(({ id }) => id === sessionId)) throw new TypeError('Reading session ID must be unique.');
  const nextSessions = shouldLog
    ? [...sessions, { id: sessionId, bookId, date, pagesRead: pageDelta, minutes: minutes ?? 0 }]
    : sessions;
  return { books: nextBooks, sessions: nextSessions, pagesRead: pageDelta };
}

export function summarizeReadingLog(books, sessions, weekOf) {
  if (!Array.isArray(books) || !Array.isArray(sessions) || !validReadingDate(weekOf)) throw new TypeError('Reading log summary input is invalid.');
  const start = new Date(`${weekOf}T00:00:00Z`).valueOf();
  if (new Date(start).getUTCDay() !== 1) throw new TypeError('The week must start on Monday.');
  const weekEnd = start + 7 * 86_400_000;
  const inWeek = sessions.filter((session) => {
    if (!validReadingDate(session.date)) return false;
    const time = Date.parse(`${session.date}T00:00:00Z`);
    return time >= start && time < weekEnd;
  });
  return {
    totalBooks: books.length,
    readingBooks: books.filter(({ status }) => status === 'reading').length,
    finishedBooks: books.filter(({ status }) => status === 'finished').length,
    pagesThisWeek: inWeek.reduce((total, { pagesRead }) => total + pagesRead, 0),
    minutesThisWeek: inWeek.reduce((total, { minutes }) => total + minutes, 0),
  };
}

export function validateReadingLog(value) {
  const data = typeof value === 'string' ? JSON.parse(value) : value;
  if (!data || data.version !== 1 || !Array.isArray(data.books) || data.books.length > MAX_BOOKS || !Array.isArray(data.sessions) || data.sessions.length > MAX_SESSIONS) throw new TypeError('This is not a supported reading-log backup.');
  const ids = new Set();
  const books = data.books.map((book) => {
    const valid = createReadingBook(book);
    if (ids.has(valid.id)) throw new TypeError('Book IDs must be unique.');
    ids.add(valid.id);
    return valid;
  });
  const sessionIds = new Set();
  const sessions = data.sessions.map((session) => {
    if (!session || typeof session.id !== 'string' || session.id.length > 300 || sessionIds.has(session.id) || !ids.has(session.bookId) || !validReadingDate(session.date)
      || !Number.isSafeInteger(session.pagesRead) || session.pagesRead < 0 || session.pagesRead > 1_000_000
      || !Number.isSafeInteger(session.minutes) || session.minutes < 0 || session.minutes > 1_440) throw new TypeError('A reading session is invalid.');
    sessionIds.add(session.id);
    return { id: session.id, bookId: session.bookId, date: session.date, pagesRead: session.pagesRead, minutes: session.minutes };
  });
  return { version: 1, goalPages: validateReadingGoal(data.goalPages), books, sessions };
}

export function validateReadingGoal(value) {
  if (!Number.isSafeInteger(value) || value < 1 || value > 10_000) throw new RangeError('Weekly goal must be from 1 to 10,000 pages.');
  return value;
}

export function serializeReadingLog(log) {
  return JSON.stringify(validateReadingLog(log), null, 2);
}

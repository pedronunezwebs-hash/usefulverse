import { addReadingBook, serializeReadingLog, summarizeReadingLog, updateReadingProgress, validateReadingGoal, validateReadingLog } from './reading-log-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);
const localIsoDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const mondayOf = (date) => {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return localIsoDate(monday);
};

export function setupReadingLog(root) {
  const ui = JSON.parse(root.dataset.readingLogMessages || '{}');
  const say = (key) => ui[key] ?? key;
  const status = $('[data-reading-log-status]', root);
  const books = [];
  let sessions = [];
  let goalPages = 50;
  let nextId = 0;
  const storageKey = 'usefulverse:reading-log:v1';
  const weekOf = mondayOf(new Date());
  $('[data-reading-log-date]', root).value = localIsoDate(new Date());
  const announce = (message, error = false) => {
    status.textContent = say(message);
    status.className = `tool-status${error ? ' is-error' : ' is-success'}`;
  };
  const storageAvailable = () => {
    let exists = false;
    try { exists = localStorage.getItem(storageKey) !== null; } catch { /* local storage may be disabled */ }
    $('[data-reading-log-load]', root).disabled = !exists;
    $('[data-reading-log-delete]', root).disabled = !exists;
  };
  const render = () => {
    const list = $('[data-reading-log-books]', root);
    list.replaceChildren();
    for (const book of books) {
      const card = document.createElement('li');
      card.className = 'calculator-card';
      const heading = document.createElement('h3');
      heading.textContent = book.title;
      const author = document.createElement('p');
      author.textContent = book.author;
      const progress = document.createElement('p');
      progress.textContent = book.totalPages ? `${book.currentPage} / ${book.totalPages} · ${Math.round(book.currentPage / book.totalPages * 100)}%` : `${say('Current page')}: ${book.currentPage}`;
      const state = document.createElement('p');
      state.textContent = say(book.status[0].toUpperCase() + book.status.slice(1));
      const form = document.createElement('form');
      form.className = 'calculator-grid';
      form.dataset.readingProgressForm = book.id;
      const currentLabel = document.createElement('label');
      currentLabel.className = 'field-label';
      currentLabel.textContent = `${say('Current page')} `;
      const current = document.createElement('input');
      current.className = 'tool-input'; current.type = 'number'; current.min = '0'; current.max = String(book.totalPages ?? 1_000_000); current.step = '1'; current.required = true; current.value = String(book.currentPage); current.dataset.progressPage = '';
      currentLabel.append(current);
      const minutesLabel = document.createElement('label');
      minutesLabel.className = 'field-label';
      minutesLabel.textContent = `${say('Minutes read today')} `;
      const minutes = document.createElement('input');
      minutes.className = 'tool-input'; minutes.type = 'number'; minutes.min = '0'; minutes.max = '1440'; minutes.step = '1'; minutes.required = true; minutes.value = '0'; minutes.dataset.progressMinutes = '';
      minutesLabel.append(minutes);
      const update = document.createElement('button'); update.type = 'submit'; update.className = 'button button--primary'; update.textContent = say('Save progress');
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'button button--ghost'; remove.textContent = say('Remove book'); remove.dataset.readingRemove = book.id;
      form.append(currentLabel, minutesLabel, update, remove);
      card.append(heading, author, progress, state, form);
      list.append(card);
    }
    $('[data-reading-log-empty]', root).hidden = books.length > 0;
    const summary = summarizeReadingLog(books, sessions, weekOf);
    $('[data-reading-log-books-count]', root).textContent = String(summary.totalBooks);
    $('[data-reading-log-finished-count]', root).textContent = String(summary.finishedBooks);
    $('[data-reading-log-week-count]', root).textContent = String(summary.pagesThisWeek);
    $('[data-reading-log-minute-count]', root).textContent = String(summary.minutesThisWeek);
    $('[data-reading-log-goal]', root).value = String(goalPages);
    const progress = $('[data-reading-log-goal-progress]', root);
    progress.max = String(goalPages); progress.value = String(Math.min(goalPages, summary.pagesThisWeek));
    $('[data-reading-log-goal-label]', root).textContent = `${summary.pagesThisWeek} / ${goalPages}`;
  };

  $('[data-reading-log-add-form]', root).addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const total = $('[data-reading-log-total]', root).value;
      const next = addReadingBook(books, { id: globalThis.crypto?.randomUUID?.() ?? `book-${Date.now()}-${nextId++}`, title: $('[data-reading-log-title]', root).value, author: $('[data-reading-log-author]', root).value, totalPages: total ? Number(total) : null });
      books.splice(0, books.length, ...next);
      event.currentTarget.reset();
      render(); announce('Book added.');
    } catch { announce('Could not save progress. Check the page, minutes and date.', true); }
  });
  $('[data-reading-log-books]', root).addEventListener('submit', (event) => {
    const form = event.target.closest('[data-reading-progress-form]');
    if (!form) return;
    event.preventDefault();
    try {
      const minutesInput = $('[data-progress-minutes]', form);
      const result = updateReadingProgress(books, sessions, form.dataset.readingProgressForm, Number($('[data-progress-page]', form).value), Number(minutesInput.value), $('[data-reading-log-date]', root).value);
      books.splice(0, books.length, ...result.books); sessions = result.sessions;
      render();
      announce('Progress saved.');
    } catch { announce('A book needs a title. Check its page number and reading date.', true); }
  });
  $('[data-reading-log-books]', root).addEventListener('click', (event) => {
    const button = event.target.closest('[data-reading-remove]');
    if (!button) return;
    const index = books.findIndex(({ id }) => id === button.dataset.readingRemove);
    if (index < 0) return;
    const [removed] = books.splice(index, 1);
    sessions = sessions.filter(({ bookId }) => bookId !== removed.id);
    render(); announce('Book removed.');
  });
  $('[data-reading-log-goal-form]', root).addEventListener('submit', (event) => {
    event.preventDefault();
    try { goalPages = validateReadingGoal(Number($('[data-reading-log-goal]', root).value)); render(); announce('Reading goal saved.'); }
    catch { announce('Weekly goal must be from 1 to 10,000 pages.', true); }
  });
  $('[data-reading-log-save]', root).addEventListener('click', () => {
    try { localStorage.setItem(storageKey, serializeReadingLog({ version: 1, goalPages, books, sessions })); storageAvailable(); announce('Reading log saved on this device.'); }
    catch { announce('Could not save the reading log. Browser storage may be unavailable or full.', true); }
  });
  $('[data-reading-log-load]', root).addEventListener('click', () => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw === null) return announce('No saved reading log was found.', true);
      const loaded = validateReadingLog(raw);
      books.splice(0, books.length, ...loaded.books); sessions = loaded.sessions; goalPages = loaded.goalPages;
      render(); announce('Saved reading log loaded.');
    } catch { announce('Choose a valid reading-log backup.', true); }
  });
  $('[data-reading-log-delete]', root).addEventListener('click', () => {
    try { localStorage.removeItem(storageKey); storageAvailable(); announce('Saved reading log deleted.'); }
    catch { announce('Could not save the reading log. Browser storage may be unavailable or full.', true); }
  });
  $('[data-reading-log-download]', root).addEventListener('click', () => {
    try {
      const blob = new Blob([serializeReadingLog({ version: 1, goalPages, books, sessions })], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob); const link = document.createElement('a');
      link.href = url; link.download = `usefulverse-reading-log-${weekOf}.json`; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000); announce('Backup download started.');
    } catch { announce('Could not create the backup.', true); }
  });
  const fileInput = $('[data-reading-log-import]', root);
  $('[data-reading-log-import-trigger]', root).addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0]; if (!file) return;
    try {
      if (file.size > 1_000_000) throw new Error('Backup exceeds the size limit.');
      const loaded = validateReadingLog(await file.text());
      books.splice(0, books.length, ...loaded.books); sessions = loaded.sessions; goalPages = loaded.goalPages;
      render(); announce('Reading-log backup imported.');
    } catch { announce('Choose a valid reading-log backup.', true); }
    finally { fileInput.value = ''; }
  });
  $('[data-reading-log-clear]', root).addEventListener('click', () => { books.length = 0; sessions = []; goalPages = 50; render(); announce('This page was cleared. Saved data was not deleted.'); });
  storageAvailable(); render();
}

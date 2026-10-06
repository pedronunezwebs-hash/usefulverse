import { createHabit, habitCalendarDays, habitStats, localDateKey, parseHabitBackup, removeHabit, toggleHabitCheckIn, validateHabitState } from './habit-tracker-logic.mjs';
import './habit-tracker.css';

const STORAGE_KEY = 'usefulverse:habit-tracker:v1';
const $ = (selector, root) => root.querySelector(selector);

export function setupHabitTracker(root) {
  if (!document.querySelector('link[data-habit-tracker-styles]')) {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.dataset.habitTrackerStyles = '';
    stylesheet.href = `/assets/habit-tracker-runtime.css?v=${document.documentElement.dataset.assetVersion ?? ''}`;
    document.head.append(stylesheet);
  }
  const messages = JSON.parse(root.dataset.habitMessages ?? '{}');
  const say = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), messages[key] ?? key);
  const form = $('[data-habit-form]', root);
  const nameInput = $('[data-habit-name]', root);
  const list = $('[data-habit-list]', root);
  const empty = $('[data-habit-empty]', root);
  const status = $('[data-habit-status]', root);
  const importInput = $('[data-habit-import]', root);
  let state = { version: 1, habits: [] };

  const setStatus = (key, success = false) => {
    status.textContent = say(key);
    status.classList.toggle('is-success', success);
    status.classList.toggle('is-error', !success);
  };
  const dateLabel = (key, options = { dateStyle: 'medium' }) => new Intl.DateTimeFormat(document.documentElement.lang || 'en', options).format(new Date(`${key}T12:00:00`));
  const makeButton = (label, action, className = 'button button--ghost') => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = className; button.textContent = label; button.dataset[action] = '';
    return button;
  };

  function render() {
    const today = localDateKey();
    empty.hidden = state.habits.length > 0;
    list.replaceChildren();
    const dates = habitCalendarDays(today, 35);
    for (const habit of state.habits) {
      const stats = habitStats(habit, today);
      const item = document.createElement('li');
      item.className = 'habit-tracker__item';
      item.dataset.habitId = habit.id;
      const header = document.createElement('div'); header.className = 'habit-tracker__heading';
      const title = document.createElement('h3'); title.textContent = habit.name;
      const remove = makeButton(say('Remove habit'), 'habitRemove');
      remove.dataset.habitId = habit.id;
      header.append(title, remove);
      const metrics = document.createElement('dl'); metrics.className = 'habit-tracker__metrics';
      for (const [label, value] of [
        ['Current streak', stats.currentStreak],
        ['Best streak', stats.bestStreak],
        ['Days completed in the last 30', stats.completedLast30Days],
      ]) {
        const entry = document.createElement('div');
        const term = document.createElement('dt'); term.textContent = say(label);
        const amount = document.createElement('dd'); amount.textContent = new Intl.NumberFormat(document.documentElement.lang || 'en').format(value);
        entry.append(term, amount); metrics.append(entry);
      }
      const calendar = document.createElement('div'); calendar.className = 'habit-tracker__calendar';
      calendar.setAttribute('role', 'group'); calendar.setAttribute('aria-label', say('35-day history'));
      const checkIns = new Set(habit.checkIns);
      for (const date of dates) {
        const complete = checkIns.has(date);
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'habit-tracker__day';
        if (complete) button.classList.add('is-complete');
        if (date === today) button.classList.add('is-today');
        button.dataset.habitToggle = ''; button.dataset.habitId = habit.id; button.dataset.date = date;
        button.setAttribute('aria-pressed', String(complete));
        button.setAttribute('aria-label', `${say('Toggle a date in the habit history')}: ${dateLabel(date)}, ${say(complete ? 'Completed' : 'Not completed')}`);
        button.title = date === today ? `${say('Today’s check-in')} · ${dateLabel(date)}` : dateLabel(date);
        button.textContent = new Intl.DateTimeFormat(document.documentElement.lang || 'en', { day: 'numeric' }).format(new Date(`${date}T12:00:00`));
        calendar.append(button);
      }
      const current = document.createElement('p'); current.className = 'habit-tracker__today';
      current.textContent = `${say('Today’s check-in')}: ${say(stats.completedToday ? 'Completed' : 'Not completed')}`;
      item.append(header, metrics, current, calendar);
      list.append(item);
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      state = createHabit(state, nameInput.value, crypto.randomUUID(), localDateKey());
      nameInput.value = ''; render(); setStatus('Habit added.', true); nameInput.focus();
    } catch (error) {
      const key = error instanceof RangeError ? 'Use no more than 20 habits.'
        : error.message.includes('80 characters') ? 'Habit names must be 80 characters or fewer.'
          : error.message.includes('unique') ? 'Habit names must be unique.' : 'Enter a habit name.';
      setStatus(key);
    }
  });

  list.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-habit-toggle]');
    if (toggle) {
      try {
        state = toggleHabitCheckIn(state, toggle.dataset.habitId, toggle.dataset.date, localDateKey());
        render(); setStatus(toggle.getAttribute('aria-pressed') === 'true' ? 'Check-in removed.' : 'Marked complete.', true);
      } catch { setStatus('Choose a date within the last ten years.'); }
      return;
    }
    const remove = event.target.closest('[data-habit-remove]');
    if (remove) {
      try { state = removeHabit(state, remove.dataset.habitId, localDateKey()); render(); setStatus('Habit removed from this page. Save to keep the change.', true); }
      catch { setStatus('Saved data is not valid.'); }
    }
  });

  $('[data-habit-save]', root).addEventListener('click', () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(validateHabitState(state))); setStatus('Saved habits on this device.', true); }
    catch { setStatus('Could not save habits. Browser storage may be unavailable or full.'); }
  });

  $('[data-habit-load]', root).addEventListener('click', () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === null) return setStatus('No saved habits were found on this device.');
      state = parseHabitBackup(saved); render(); setStatus('Saved habits loaded.', true);
    } catch { setStatus('Saved data is not valid.'); }
  });

  $('[data-habit-delete-saved]', root).addEventListener('click', () => {
    if (!window.confirm(say('Delete saved habits from this device?'))) return;
    try { localStorage.removeItem(STORAGE_KEY); setStatus('Saved habits deleted from this device.', true); }
    catch { setStatus('Could not delete saved habits in this browser.'); }
  });

  $('[data-habit-download]', root).addEventListener('click', () => {
    try {
      const backup = JSON.stringify(validateHabitState(state), null, 2);
      const url = URL.createObjectURL(new Blob([backup], { type: 'application/json' }));
      const link = document.createElement('a'); link.href = url; link.download = 'usefulverse-habits.json'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000); setStatus('Backup download started.', true);
    } catch { setStatus('Could not save habits. Browser storage may be unavailable or full.'); }
  });

  $('[data-habit-import-trigger]', root).addEventListener('click', () => importInput.click());
  importInput.addEventListener('change', async () => {
    const file = importInput.files?.[0]; importInput.value = '';
    if (!file) return;
    if (file.size > 1_000_000) return setStatus('Choose a JSON backup file under 1 MB.');
    try {
      const imported = parseHabitBackup(await file.text());
      if (!window.confirm(say('Replace the current list with this backup?'))) return;
      state = imported; render(); setStatus('Backup imported. Current habits replaced.', true);
    } catch { setStatus('Could not import this backup.'); }
  });

  $('[data-habit-clear]', root).addEventListener('click', () => {
    state = { version: 1, habits: [] }; render(); setStatus('All habits cleared from this page. Saved data was not deleted.', true);
  });

  document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); }, { signal: new AbortController().signal });
  render();
}

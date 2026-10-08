import { createMoodEntry, getMoodCalendar, getMoodSummary, removeMoodEntry, restoreMoodLog, upsertMoodEntry } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="mood-tracker"]');
const STORAGE_KEY = 'usefulverse:mood-tracker:v1';
const MAX_BACKUP_BYTES = 500_000;

if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const dateInput = form.elements.namedItem('date');
  const moodInput = form.elements.namedItem('mood');
  const noteInput = form.elements.namedItem('note');
  const consentInput = form.elements.namedItem('saveConsent');
  const result = root.querySelector('[data-result]');
  const calendar = root.querySelector('[data-calendar]');
  const summary = root.querySelector('[data-summary]');
  const distribution = root.querySelector('[data-distribution]');
  const selectedEntry = root.querySelector('[data-selected-entry]');
  const status = root.querySelector('[data-status]');
  const importInput = form.elements.namedItem('backupFile');
  let entries = [];
  let selectedDate = '';
  let month = new Date().getMonth();
  let year = new Date().getFullYear();

  const localToday = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };
  const moodLabel = (score) => copy.fields[`mood${score}`];
  const dateFormatter = new Intl.DateTimeFormat(document.documentElement.lang || 'en', { dateStyle: 'medium', timeZone: 'UTC' });
  const formatDate = (value) => dateFormatter.format(new Date(`${value}T00:00:00.000Z`));

  function selectedTags() {
    return [...form.querySelectorAll('[data-mood-tag]:checked')].map((input) => input.value);
  }

  function setEntry(entry) {
    dateInput.value = entry?.date ?? selectedDate ?? localToday();
    moodInput.value = String(entry?.mood ?? 3);
    noteInput.value = entry?.note ?? '';
    for (const input of form.querySelectorAll('[data-mood-tag]')) input.checked = entry?.tags.includes(input.value) ?? false;
    selectedDate = dateInput.value;
    form.querySelector('[data-action="record"]').textContent = entries.some(({ date }) => date === selectedDate) ? copy.actions.updateEntry : copy.actions.saveEntry;
    root.querySelector('[data-action="delete-entry"]').disabled = !entries.some(({ date }) => date === selectedDate);
  }

  function saveIfConsented() {
    if (!consentInput.checked) return true;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 1, entries }));
      return true;
    } catch {
      consentInput.checked = false;
      announce(root, copy.messages.storageUnavailable, 'error');
      return false;
    }
  }

  function renderCalendar() {
    const locale = document.documentElement.lang || 'en';
    root.querySelector('[data-calendar-month]').textContent = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month, 1)));
    calendar.replaceChildren();
    const head = document.createElement('thead');
    const headingRow = document.createElement('tr');
    for (const key of ['weekdaySun', 'weekdayMon', 'weekdayTue', 'weekdayWed', 'weekdayThu', 'weekdayFri', 'weekdaySat']) {
      const cell = document.createElement('th');
      cell.scope = 'col';
      cell.textContent = copy.fields[key];
      headingRow.append(cell);
    }
    head.append(headingRow);
    const body = document.createElement('tbody');
    const cells = getMoodCalendar(entries, year, month);
    root.querySelector('[data-action="previous-month"]').disabled = year === 1900 && month === 0;
    root.querySelector('[data-action="next-month"]').disabled = year === 2100 && month === 11;
    for (let offset = 0; offset < cells.length; offset += 7) {
      const row = document.createElement('tr');
      for (const cellData of cells.slice(offset, offset + 7)) {
        const cell = document.createElement('td');
        if (cellData) {
          const day = document.createElement('button');
          day.type = 'button';
          day.className = 'button button--secondary';
          day.dataset.selectDate = cellData.date;
          day.textContent = String(cellData.day);
          day.setAttribute('aria-label', cellData.entry ? `${formatDate(cellData.date)} — ${moodLabel(cellData.entry.mood)}` : formatDate(cellData.date));
          if (cellData.entry) day.dataset.mood = String(cellData.entry.mood);
          if (cellData.date === selectedDate) day.setAttribute('aria-current', 'date');
          cell.append(day);
        }
        row.append(cell);
      }
      body.append(row);
    }
    calendar.append(head, body);
  }

  function renderSummary() {
    const week = getMoodSummary(entries, localToday());
    summary.replaceChildren();
    const count = document.createElement('p');
    count.textContent = `${copy.fields.countLabel}: ${week.count}`;
    summary.append(count);
    const average = document.createElement('p');
    average.textContent = `${copy.fields.averageLabel}: ${week.average === null ? '—' : `${new Intl.NumberFormat(document.documentElement.lang || 'en', { maximumFractionDigits: 1 }).format(week.average)} / 5`}`;
    summary.append(average);
    distribution.replaceChildren();
    for (let mood = 1; mood <= 5; mood += 1) {
      const item = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = `${moodLabel(mood)}: ${week.distribution[mood - 1]}`;
      const bar = document.createElement('progress');
      bar.max = Math.max(week.count, 1);
      bar.value = week.distribution[mood - 1];
      bar.setAttribute('aria-label', label.textContent);
      item.append(label, bar);
      distribution.append(item);
    }
    if (!week.count) {
      const empty = document.createElement('p');
      empty.textContent = copy.fields.noEntries;
      summary.append(empty);
    }
  }

  function renderSelected() {
    selectedEntry.replaceChildren();
    const entry = entries.find(({ date }) => date === selectedDate);
    if (entry) {
      const date = document.createElement('p');
      date.textContent = `${formatDate(entry.date)} · ${copy.messages.mood}: ${moodLabel(entry.mood)}`;
      selectedEntry.append(date);
      if (entry.tags.length) {
        const tags = document.createElement('p');
        tags.textContent = `${copy.messages.tags}: ${entry.tags.map((tag) => copy.fields[`tag${tag[0].toUpperCase()}${tag.slice(1)}`]).join(', ')}`;
        selectedEntry.append(tags);
      }
      if (entry.note) {
        const note = document.createElement('p');
        note.textContent = `${copy.messages.note}: ${entry.note}`;
        selectedEntry.append(note);
      }
    } else {
      const empty = document.createElement('p');
      empty.textContent = copy.fields.noEntries;
      selectedEntry.append(empty);
    }
    setEntry(entry);
  }

  function render() {
    result.hidden = false;
    renderCalendar();
    renderSummary();
    renderSelected();
  }

  function persistAfterChange(message) {
    const saved = saveIfConsented();
    render();
    if (!saved) return;
    if (consentInput.checked) announce(root, `${message} ${copy.messages.saved}`, 'success');
    else announce(root, message, 'success');
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const entry = createMoodEntry({ date: dateInput.value, mood: moodInput.value, tags: selectedTags(), note: noteInput.value });
      entries = [...upsertMoodEntry(entries, entry)];
      selectedDate = entry.date;
      year = Number(entry.date.slice(0, 4));
      month = Number(entry.date.slice(5, 7)) - 1;
      persistAfterChange(copy.messages.recorded);
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  });

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    const date = localToday();
    dateInput.value = date;
    moodInput.value = '4';
    noteInput.value = 'A short, optional reflection.';
    for (const input of form.querySelectorAll('[data-mood-tag]')) input.checked = input.value === 'hopeful';
    selectedDate = date;
    form.querySelector('[data-action="record"]').textContent = entries.some((entry) => entry.date === date) ? copy.actions.updateEntry : copy.actions.saveEntry;
  });

  form.querySelector('[data-action="reset"]')?.addEventListener('click', () => setTimeout(() => {
    selectedDate = dateInput.value || localToday();
    setEntry(entries.find(({ date }) => date === selectedDate));
    status.textContent = '';
  }, 0));

  calendar.addEventListener('click', (event) => {
    const day = event.target.closest('[data-select-date]');
    if (!day) return;
    selectedDate = day.dataset.selectDate;
    setEntry(entries.find(({ date }) => date === selectedDate));
    renderCalendar();
  });

  root.querySelector('[data-action="previous-month"]')?.addEventListener('click', () => {
    if (year === 1900 && month === 0) return;
    month -= 1;
    if (month < 0) { month = 11; year -= 1; }
    renderCalendar();
  });
  root.querySelector('[data-action="next-month"]')?.addEventListener('click', () => {
    if (year === 2100 && month === 11) return;
    month += 1;
    if (month > 11) { month = 0; year += 1; }
    renderCalendar();
  });

  root.querySelector('[data-action="delete-entry"]')?.addEventListener('click', () => {
    if (!entries.some(({ date }) => date === selectedDate)) {
      announce(root, copy.messages.noEntry, 'error');
      return;
    }
    entries = [...removeMoodEntry(entries, selectedDate)];
    persistAfterChange(copy.messages.removed);
  });

  root.querySelector('[data-action="clear-history"]')?.addEventListener('click', () => {
    const confirmation = consentInput.checked ? copy.messages.confirmClear : copy.messages.confirmClearSession;
    if (!entries.length || !window.confirm(confirmation)) return;
    entries = [];
    selectedDate = dateInput.value || localToday();
    if (consentInput.checked) {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* Entries are still removed from page memory. */ }
    }
    render();
    announce(root, copy.messages.cleared, 'success');
  });

  consentInput.addEventListener('change', () => {
    if (consentInput.checked) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = restoreMoodLog(JSON.parse(raw));
          entries = saved.entries.reduce((all, entry) => [...upsertMoodEntry(all, entry)], entries);
        }
        if (saveIfConsented()) announce(root, copy.messages.storageEnabled, 'success');
      } catch {
        consentInput.checked = false;
        announce(root, copy.messages.storageUnavailable, 'error');
      }
    } else {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* The in-memory log remains available in this tab. */ }
      announce(root, copy.messages.storageDisabled, 'success');
    }
    render();
  });

  root.querySelector('[data-action="export"]')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ schemaVersion: 1, entries }, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'usefulverse-mood-log.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce(root, copy.messages.downloaded, 'success');
  });

  importInput.addEventListener('change', async (event) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    try {
      if (file.size > MAX_BACKUP_BYTES) throw new RangeError('Backup exceeds the size limit.');
      const backup = restoreMoodLog(JSON.parse(await file.text()));
      entries = [...backup.entries];
      selectedDate = entries.at(-1)?.date ?? localToday();
      year = Number(selectedDate.slice(0, 4));
      month = Number(selectedDate.slice(5, 7)) - 1;
      dateInput.value = selectedDate;
      persistAfterChange(copy.messages.imported);
    } catch {
      announce(root, copy.messages.importFailed, 'error');
    } finally {
      event.currentTarget.value = '';
    }
  });

  dateInput.value = localToday();
  selectedDate = dateInput.value;
  setEntry(null);
  render();
}

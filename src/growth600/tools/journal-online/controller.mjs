import { decryptJournalBackup, encryptJournalBackup, MAX_JOURNAL_BACKUP_BYTES, MAX_JOURNAL_ENCRYPTED_BACKUP_BYTES, restoreJournalLog, searchJournalEntries, serializeJournalBackup, upsertJournalEntry, removeJournalEntry } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="journal-online"]');
const STORAGE_KEY = 'usefulverse:journal-online:v1';

if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const status = root.querySelector('[data-status]');
  const list = root.querySelector('[data-journal-list]');
  const empty = root.querySelector('[data-empty]');
  const selected = root.querySelector('[data-selected-entry]');
  const consent = form.elements.namedItem('saveConsent');
  const fileInput = form.elements.namedItem('backupFile');
  let entries = [];
  let selectedId = '';
  let visibleEntries = [];

  const localToday = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };
  const dateFormatter = new Intl.DateTimeFormat(document.documentElement.lang || 'en', { dateStyle: 'medium', timeZone: 'UTC' });
  const formatDate = (value) => dateFormatter.format(new Date(`${value}T00:00:00.000Z`));

  function selectedEntry() { return entries.find(({ id }) => id === selectedId) ?? null; }

  function loadEntry(entry) {
    selectedId = entry?.id ?? '';
    form.elements.namedItem('date').value = entry?.date ?? localToday();
    form.elements.namedItem('title').value = entry?.title ?? '';
    form.elements.namedItem('body').value = entry?.body ?? '';
    form.elements.namedItem('tags').value = entry?.tags.join(', ') ?? '';
    form.elements.namedItem('backupPassword').value = '';
    form.elements.namedItem('confirmPassword').value = '';
    form.querySelector('[data-action="record"]').textContent = entry ? copy.actions.updateEntry : copy.actions.saveEntry;
    root.querySelector('[data-action="delete-entry"]').disabled = !entry;
    renderList();
    renderSelected();
  }

  function saveIfConsented() {
    if (!consent.checked) return true;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 1, entries }));
      return true;
    } catch {
      consent.checked = false;
      announce(root, copy.messages.storageFailed, 'error');
      return false;
    }
  }

  function renderSelected() {
    selected.replaceChildren();
    const entry = selectedEntry();
    if (!entry) {
      root.querySelector('[data-action="delete-entry"]').disabled = true;
      return;
    }
    const heading = document.createElement('h4');
    heading.textContent = entry.title;
    const date = document.createElement('time');
    date.dateTime = entry.date;
    date.textContent = formatDate(entry.date);
    const content = document.createElement('p');
    content.textContent = entry.body;
    const tags = document.createElement('p');
    tags.textContent = entry.tags.join(', ');
    selected.append(heading, date, content);
    if (entry.tags.length) selected.append(tags);
    root.querySelector('[data-action="delete-entry"]').disabled = false;
  }

  function renderList() {
    try {
      visibleEntries = searchJournalEntries(entries, {
        query: form.elements.namedItem('search').value,
        dateFrom: form.elements.namedItem('dateFrom').value,
        dateTo: form.elements.namedItem('dateTo').value,
        locale: document.documentElement.lang || 'en',
      });
    } catch {
      visibleEntries = [];
      announce(root, copy.messages.searchRange, 'error');
    }
    list.replaceChildren();
    for (const entry of visibleEntries) {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'button button--secondary';
      button.dataset.journalId = entry.id;
      button.setAttribute('aria-pressed', String(entry.id === selectedId));
      const title = document.createElement('strong');
      title.textContent = entry.title;
      const date = document.createElement('time');
      date.dateTime = entry.date;
      date.textContent = formatDate(entry.date);
      button.append(title, document.createTextNode(` — ${date.textContent}`));
      item.append(button);
      list.append(item);
    }
    root.querySelector('[data-entry-count]').textContent = new Intl.NumberFormat(document.documentElement.lang || 'en').format(visibleEntries.length);
    empty.hidden = visibleEntries.length > 0;
    renderSelected();
  }

  function persist(message) {
    const saved = saveIfConsented();
    renderList();
    if (!saved) return;
    announce(root, consent.checked ? `${message} ${copy.messages.localSaved}` : message, 'success');
  }

  function download(contents, filename) {
    const blob = new Blob([contents], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1_000);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const wasExisting = Boolean(selectedEntry());
      const id = selectedId || crypto.randomUUID();
      const entry = {
        id,
        date: form.elements.namedItem('date').value,
        title: form.elements.namedItem('title').value,
        body: form.elements.namedItem('body').value,
        tags: form.elements.namedItem('tags').value.split(',').map((tag) => tag.trim()).filter(Boolean),
      };
      entries = [...upsertJournalEntry(entries, entry)];
      selectedId = id;
      persist(wasExisting ? copy.messages.updatedInTab : copy.messages.savedInTab);
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  });

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('date').value = localToday();
    form.elements.namedItem('title').value = copy.fields.exampleTitle;
    form.elements.namedItem('body').value = copy.fields.exampleBody;
    form.elements.namedItem('tags').value = copy.fields.exampleTags;
    selectedId = '';
    form.querySelector('[data-action="record"]').textContent = copy.actions.saveEntry;
    announce(root, copy.fields.exampleHint, 'status');
  });

  root.querySelector('[data-action="new-entry"]')?.addEventListener('click', () => loadEntry(null));
  form.querySelector('[data-action="reset"]')?.addEventListener('click', () => setTimeout(() => loadEntry(null), 0));
  root.querySelector('[data-action="search"]')?.addEventListener('click', () => {
    renderList();
    announce(root, copy.messages.searchUpdated, 'status');
  });
  root.querySelector('[data-action="clear-search"]')?.addEventListener('click', () => {
    form.elements.namedItem('search').value = '';
    form.elements.namedItem('dateFrom').value = '';
    form.elements.namedItem('dateTo').value = '';
    renderList();
  });

  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-journal-id]');
    if (!button) return;
    loadEntry(entries.find(({ id }) => id === button.dataset.journalId));
  });

  root.querySelector('[data-action="delete-entry"]')?.addEventListener('click', () => {
    if (!selectedId) return announce(root, copy.messages.noSelection, 'error');
    if (!window.confirm(copy.messages.confirmDelete)) return;
    entries = [...removeJournalEntry(entries, selectedId)];
    selectedId = '';
    persist(copy.messages.deleted);
    loadEntry(null);
  });

  root.querySelector('[data-action="clear-all"]')?.addEventListener('click', () => {
    if (!entries.length || !window.confirm(copy.messages.confirmClear)) return;
    entries = [];
    selectedId = '';
    let storageRemoved = true;
    if (consent.checked) {
      try { localStorage.removeItem(STORAGE_KEY); }
      catch { storageRemoved = false; }
    }
    consent.checked = false;
    loadEntry(null);
    announce(root, storageRemoved ? copy.messages.allDeleted : copy.messages.allDeletedStorageFailed, storageRemoved ? 'success' : 'error');
  });

  consent.addEventListener('change', () => {
    if (consent.checked) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const stored = restoreJournalLog(JSON.parse(raw));
          for (const entry of stored.entries) if (!entries.some(({ id }) => id === entry.id)) entries = [...upsertJournalEntry(entries, entry)];
        }
        if (saveIfConsented()) announce(root, copy.messages.localSaved, 'success');
      } catch { consent.checked = false; announce(root, copy.messages.storageFailed, 'error'); }
    } else {
      try { localStorage.removeItem(STORAGE_KEY); announce(root, copy.messages.localSaveRemoved, 'success'); }
      catch { announce(root, copy.messages.storageFailed, 'error'); }
    }
    renderList();
  });

  root.querySelector('[data-action="export-json"]')?.addEventListener('click', () => {
    try {
      download(serializeJournalBackup({ schemaVersion: 1, entries }), 'usefulverse-journal.json');
      announce(root, copy.messages.exported, 'success');
    } catch {
      announce(root, copy.messages.backupTooLarge, 'error');
    }
  });

  root.querySelector('[data-action="save-backup"]')?.addEventListener('click', async () => {
    const password = form.elements.namedItem('backupPassword').value;
    if (!password) return announce(root, copy.messages.passwordNeeded, 'error');
    if (password !== form.elements.namedItem('confirmPassword').value) return announce(root, copy.messages.passwordMismatch, 'error');
    announce(root, copy.messages.encrypting, 'status');
    try {
      const encrypted = await encryptJournalBackup({ schemaVersion: 1, entries }, password);
      download(JSON.stringify(encrypted, null, 2), 'usefulverse-journal-encrypted.json');
      form.elements.namedItem('backupPassword').value = '';
      form.elements.namedItem('confirmPassword').value = '';
      announce(root, copy.messages.encryptedExported, 'success');
    } catch (error) {
      announce(root, error?.message?.includes('Secure browser encryption') ? copy.messages.unsupportedCrypto : copy.messages.importFailed, 'error');
    }
  });

  fileInput.addEventListener('change', async (event) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    try {
      if (file.size > MAX_JOURNAL_ENCRYPTED_BACKUP_BYTES) throw new RangeError('Backup too large.');
      const data = JSON.parse(await file.text());
      let backup;
      if (data?.format === 'usefulverse-journal-encrypted-backup') {
        announce(root, copy.messages.decrypting, 'status');
        backup = await decryptJournalBackup(data, form.elements.namedItem('backupPassword').value);
      } else {
        if (file.size > MAX_JOURNAL_BACKUP_BYTES) throw new RangeError('Backup too large.');
        backup = restoreJournalLog(data);
      }
      if (entries.length && !window.confirm(copy.messages.confirmImport)) {
        announce(root, copy.messages.importCancelled, 'status');
        return;
      }
      entries = [...backup.entries];
      selectedId = '';
      loadEntry(null);
      persist(copy.messages.imported);
    } catch {
      announce(root, copy.messages.importFailed, 'error');
    } finally {
      form.elements.namedItem('backupPassword').value = '';
      form.elements.namedItem('confirmPassword').value = '';
      event.currentTarget.value = '';
    }
  });

  form.elements.namedItem('date').value = localToday();
  renderList();
}

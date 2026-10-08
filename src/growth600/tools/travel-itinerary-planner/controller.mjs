import { analyzeItinerary, buildItineraryIcs, createTravelPlan, MAX_ITINERARY_BACKUP_BYTES, removeItineraryItem, restoreItineraryPlan, serializeItineraryBackup, upsertItineraryItem } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const STORAGE_KEY = 'usefulverse:travel-itinerary-planner:v1';
const root = document.querySelector('[data-tool="travel-itinerary-planner"]');

if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const status = root.querySelector('[data-status]');
  const list = root.querySelector('[data-itinerary-list]');
  const conflictList = root.querySelector('[data-conflict-list]');
  const consent = form.elements.namedItem('saveConsent');
  const backupFile = form.elements.namedItem('backupFile');
  let plan = null;
  let selectedId = '';

  function persist(message) {
    if (consent.checked && plan) {
      try { localStorage.setItem(STORAGE_KEY, serializeItineraryBackup(plan)); }
      catch { consent.checked = false; announce(root, copy.messages.storageFailed, 'error'); return; }
      announce(root, `${message} ${copy.messages.localSaved}`, 'success');
    } else announce(root, message, 'success');
  }

  function setTripFields(value) {
    form.elements.namedItem('tripName').value = value?.title ?? '';
    form.elements.namedItem('tripStartDate').value = value?.startDate ?? '';
    form.elements.namedItem('tripEndDate').value = value?.endDate ?? '';
    form.elements.namedItem('bufferMinutes').value = String(value?.bufferMinutes ?? 0);
  }

  function setItemFields(item) {
    selectedId = item?.id ?? '';
    for (const name of ['itemDate', 'startTime', 'endTime', 'itemTitle', 'category', 'location', 'reservation', 'notes']) {
      const value = name === 'itemDate' ? item?.date : name === 'itemTitle' ? item?.title : item?.[name];
      const fallback = name === 'itemDate' ? plan?.startDate ?? '' : name === 'startTime' ? '09:00' : name === 'endTime' ? '10:00' : name === 'category' ? 'activity' : '';
      form.elements.namedItem(name).value = value ?? fallback;
    }
    form.querySelector('[data-action="save-item"]').textContent = item ? copy.actions.updateItem : copy.actions.saveItem;
    root.querySelector('[data-action="delete-item"]').disabled = !item;
    for (const button of list.querySelectorAll('[data-item-id]')) button.setAttribute('aria-pressed', String(button.dataset.itemId === selectedId));
  }

  function render() {
    list.replaceChildren();
    conflictList.replaceChildren();
    if (!plan) {
      root.querySelector('[data-trip-summary]').textContent = copy.fields.noTrip;
      root.querySelector('[data-item-count]').textContent = '0';
      root.querySelector('[data-overlap-count]').textContent = '0';
      root.querySelector('[data-buffer-count]').textContent = '0';
      root.querySelector('[data-empty]').hidden = false;
      return;
    }
    const formatter = new Intl.DateTimeFormat(document.documentElement.lang || 'en', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
    root.querySelector('[data-trip-summary]').textContent = `${plan.title} · ${formatter.format(new Date(`${plan.startDate}T00:00:00Z`))} – ${formatter.format(new Date(`${plan.endDate}T00:00:00Z`))}`;
    root.querySelector('[data-item-count]').textContent = new Intl.NumberFormat(document.documentElement.lang || 'en').format(plan.items.length);
    root.querySelector('[data-empty]').hidden = plan.items.length > 0;
    for (const item of plan.items) {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'button button--secondary itinerary-item';
      button.dataset.itemId = item.id;
      button.setAttribute('aria-pressed', String(item.id === selectedId));
      const title = document.createElement('strong');
      title.textContent = `${item.startTime}–${item.endTime} · ${item.title}`;
      const detail = document.createElement('span');
      detail.textContent = `${formatter.format(new Date(`${item.date}T00:00:00Z`))} · ${copy.fields.categories[item.category]}${item.location ? ` · ${item.location}` : ''}`;
      button.append(title, document.createElement('br'), detail);
      li.append(button);
      list.append(li);
    }
    const analysis = analyzeItinerary(plan);
    root.querySelector('[data-overlap-count]').textContent = new Intl.NumberFormat(document.documentElement.lang || 'en').format(analysis.overlaps.length);
    root.querySelector('[data-buffer-count]').textContent = new Intl.NumberFormat(document.documentElement.lang || 'en').format(analysis.shortConnections.length);
    for (const issue of analysis.overlaps) {
      const first = plan.items.find(({ id }) => id === issue.firstId);
      const second = plan.items.find(({ id }) => id === issue.secondId);
      const li = document.createElement('li');
      li.textContent = copy.messages.overlap.replace('{first}', first.title).replace('{second}', second.title).replace('{minutes}', String(issue.overlapMinutes));
      conflictList.append(li);
    }
    for (const issue of analysis.shortConnections) {
      const first = plan.items.find(({ id }) => id === issue.firstId);
      const second = plan.items.find(({ id }) => id === issue.secondId);
      const li = document.createElement('li');
      li.textContent = copy.messages.shortConnection.replace('{first}', first.title).replace('{second}', second.title).replace('{minutes}', String(issue.gapMinutes)).replace('{needed}', String(issue.neededMinutes));
      conflictList.append(li);
    }
  }

  root.querySelector('[data-action="create-trip"]')?.addEventListener('click', () => {
    try {
      plan = createTravelPlan({
        title: form.elements.namedItem('tripName').value,
        startDate: form.elements.namedItem('tripStartDate').value,
        endDate: form.elements.namedItem('tripEndDate').value,
        bufferMinutes: form.elements.namedItem('bufferMinutes').value,
        items: plan?.items ?? [],
      });
      selectedId = '';
      setItemFields(null);
      render();
      persist(copy.messages.tripSaved);
    } catch { announce(root, copy.messages.checkTrip, 'error'); }
  });

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    plan = createTravelPlan({ title: copy.fields.exampleTrip, startDate: '2026-11-01', endDate: '2026-11-02', bufferMinutes: 30 });
    plan = upsertItineraryItem(plan, { id: 'example-temple', date: '2026-11-01', startTime: '09:00', endTime: '10:30', title: copy.fields.exampleActivity, category: 'activity', location: copy.fields.exampleLocation, reservation: copy.fields.exampleReservation, notes: '' });
    plan = upsertItineraryItem(plan, { id: 'example-lunch', date: '2026-11-01', startTime: '10:45', endTime: '11:30', title: copy.fields.exampleMeal, category: 'meal', location: '', reservation: '', notes: '' });
    setTripFields(plan);
    setItemFields(null);
    render();
    announce(root, copy.messages.exampleLoaded, 'status');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!plan) return announce(root, copy.messages.createTripFirst, 'error');
    try {
      const updating = Boolean(selectedId);
      const itemId = selectedId || crypto.randomUUID();
      plan = upsertItineraryItem(plan, {
        id: itemId,
        date: form.elements.namedItem('itemDate').value,
        startTime: form.elements.namedItem('startTime').value,
        endTime: form.elements.namedItem('endTime').value,
        title: form.elements.namedItem('itemTitle').value,
        category: form.elements.namedItem('category').value,
        location: form.elements.namedItem('location').value,
        reservation: form.elements.namedItem('reservation').value,
        notes: form.elements.namedItem('notes').value,
      });
      setItemFields(plan.items.find(({ id }) => id === itemId) ?? null);
      render();
      persist(updating ? copy.messages.itemUpdated : copy.messages.itemSaved);
    } catch { announce(root, copy.messages.checkItem, 'error'); }
  });

  root.querySelector('[data-action="new-item"]')?.addEventListener('click', () => setItemFields(null));
  root.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
    plan = null; selectedId = ''; setTripFields(null); setItemFields(null); render(); announce(root, copy.messages.formCleared, 'status');
  });
  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-item-id]');
    if (button) setItemFields(plan.items.find(({ id }) => id === button.dataset.itemId));
  });
  root.querySelector('[data-action="delete-item"]')?.addEventListener('click', () => {
    if (!plan || !selectedId) return;
    plan = removeItineraryItem(plan, selectedId); selectedId = ''; setItemFields(null); render(); persist(copy.messages.itemDeleted);
  });
  root.querySelector('[data-action="delete-trip"]')?.addEventListener('click', () => {
    if (!plan || !window.confirm(copy.messages.confirmDeleteTrip)) return;
    plan = null; selectedId = ''; setTripFields(null); setItemFields(null);
    let storageRemovalFailed = false;
    if (consent.checked) {
      try { localStorage.removeItem(STORAGE_KEY); consent.checked = false; }
      catch { storageRemovalFailed = true; }
    }
    render();
    announce(root, storageRemovalFailed ? copy.messages.tripDeletedStorageFailed : copy.messages.tripDeleted, storageRemovalFailed ? 'error' : 'success');
  });

  consent.addEventListener('change', () => {
    if (consent.checked) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const restored = restoreItineraryPlan(JSON.parse(raw));
          if (plan && !window.confirm(copy.messages.confirmRestore)) { consent.checked = false; return; }
          plan = restored; setTripFields(plan); setItemFields(null); render();
        }
        if (plan) localStorage.setItem(STORAGE_KEY, serializeItineraryBackup(plan));
        announce(root, copy.messages.localSaved, 'success');
      } catch { consent.checked = false; announce(root, copy.messages.storageFailed, 'error'); }
    } else {
      try { localStorage.removeItem(STORAGE_KEY); announce(root, copy.messages.localRemoved, 'success'); }
      catch { announce(root, copy.messages.storageFailed, 'error'); }
    }
  });

  root.querySelector('[data-action="export-json"]')?.addEventListener('click', () => {
    if (!plan) return announce(root, copy.messages.createTripFirst, 'error');
    try { download(serializeItineraryBackup(plan), 'usefulverse-itinerary.json', 'application/json;charset=utf-8'); announce(root, copy.messages.jsonDownloaded, 'success'); }
    catch { announce(root, copy.messages.backupTooLarge, 'error'); }
  });
  root.querySelector('[data-action="export-ics"]')?.addEventListener('click', () => {
    if (!plan) return announce(root, copy.messages.createTripFirst, 'error');
    if (!plan.items.length) return announce(root, copy.messages.noItemsToExport, 'error');
    try { download(buildItineraryIcs(plan), 'usefulverse-itinerary.ics', 'text/calendar;charset=utf-8'); announce(root, copy.messages.icsDownloaded, 'success'); }
    catch { announce(root, copy.messages.exportFailed, 'error'); }
  });
  root.querySelector('[data-action="print"]')?.addEventListener('click', () => { if (plan) window.print(); else announce(root, copy.messages.createTripFirst, 'error'); });

  backupFile.addEventListener('change', async (event) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    try {
      if (file.size > MAX_ITINERARY_BACKUP_BYTES) throw new RangeError('Backup too large.');
      const restored = restoreItineraryPlan(JSON.parse(await file.text()));
      if (plan && !window.confirm(copy.messages.confirmImport)) { announce(root, copy.messages.importCancelled, 'status'); return; }
      plan = restored; selectedId = ''; setTripFields(plan); setItemFields(null); render(); persist(copy.messages.imported);
    } catch { announce(root, copy.messages.importFailed, 'error'); }
    finally { backupFile.value = ''; }
  });

  function download(contents, filename, type) {
    const url = URL.createObjectURL(new Blob([contents], { type }));
    const link = document.createElement('a'); link.href = url; link.download = filename; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  setTripFields(null); setItemFields(null); render();
}

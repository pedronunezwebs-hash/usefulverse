import { elapsedTimeSession, exportTimeSessionsCsv, finishTimeSession, pauseTimeSession, resumeTimeSession, serializeTimeSessions, startTimeSession, summarizeTimeSessions, validateTimeSessions } from './time-tracker-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);
const locale = document.documentElement.lang || 'en';

export function setupTimeTracker(root) {
  const ui = JSON.parse(root.dataset.timeMessages || '{}');
  const sayTime = (key) => ui[key] ?? key;
  const status = $('[data-time-status]', root);
  const nameInput = $('[data-time-name]', root);
  const clock = $('[data-time-clock]', root);
  const currentLabel = $('[data-time-current]', root);
  const list = $('[data-time-list]', root);
  const empty = $('[data-time-empty]', root);
  const total = $('[data-time-total]', root);
  const startButton = $('[data-time-start]', root);
  const pauseButton = $('[data-time-pause]', root);
  const resumeButton = $('[data-time-resume]', root);
  const stopButton = $('[data-time-stop]', root);
  const saveButton = $('[data-time-save]', root);
  const loadButton = $('[data-time-load]', root);
  const deleteButton = $('[data-time-delete]', root);
  const csvButton = $('[data-time-csv]', root);
  const storageKey = 'usefulverse:time-tracker:v1';
  const drafts = [];
  let active = null;
  let tick = 0;
  const announce = (message, error = false) => {
    status.textContent = sayTime(message);
    status.className = `tool-status${error ? ' is-error' : ' is-success'}`;
  };
  const durationLabel = (milliseconds) => {
    const seconds = Math.floor(Math.max(0, milliseconds) / 1000);
    const hours = Math.floor(seconds / 3600);
    return `${String(hours).padStart(2, '0')}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  };
  const render = () => {
    const liveMs = active ? elapsedTimeSession(active, performance.now()) : 0;
    clock.textContent = durationLabel(liveMs);
    currentLabel.textContent = active ? `${active.name}${active.paused ? ` · ${sayTime('Timer paused.')}` : ''}` : sayTime('No timer is running.');
    pauseButton.disabled = !active || active.paused;
    pauseButton.hidden = !active || active.paused;
    resumeButton.hidden = !active || !active.paused;
    resumeButton.disabled = !active || !active.paused;
    stopButton.disabled = !active;
    startButton.disabled = Boolean(active);
    saveButton.disabled = drafts.length === 0;
    csvButton.disabled = drafts.length === 0;
    const summaries = summarizeTimeSessions(drafts);
    const allMs = drafts.reduce((sum, item) => sum + item.durationMs, 0);
    total.textContent = durationLabel(allMs);
    list.replaceChildren();
    for (const summary of summaries) {
      const group = document.createElement('li');
      const heading = document.createElement('strong');
      heading.textContent = `${summary.name} · ${durationLabel(summary.durationMs)}`;
      group.append(heading);
      const entries = document.createElement('ul');
      drafts.forEach((session, index) => {
        if (session.name !== summary.name) return;
        const row = document.createElement('li');
        const date = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(session.startedAt));
        const label = document.createElement('span');
        label.textContent = `${date} · ${durationLabel(session.durationMs)}`;
        const remove = document.createElement('button');
        remove.type = 'button'; remove.className = 'button button--ghost'; remove.dataset.timeRemove = String(index); remove.textContent = sayTime('Remove session');
        row.append(label, remove); entries.append(row);
      });
      group.append(entries); list.append(group);
    }
    empty.hidden = drafts.length > 0;
  };
  const storageAvailable = () => {
    try { loadButton.disabled = localStorage.getItem(storageKey) === null; deleteButton.disabled = loadButton.disabled; }
    catch { loadButton.disabled = true; deleteButton.disabled = true; }
  };
  $('[data-time-form]', root).addEventListener('submit', (event) => {
    event.preventDefault();
    if (active) return;
    try {
      active = startTimeSession(nameInput.value, Date.now(), performance.now());
      nameInput.value = ''; render(); nameInput.blur(); announce('Timer started.');
    } catch { announce('Check the task name and try again.', true); }
  });
  pauseButton.addEventListener('click', () => {
    try { active = pauseTimeSession(active, performance.now()); render(); announce('Timer paused.'); }
    catch { announce('The timer could not be paused. Try again.', true); }
  });
  resumeButton.addEventListener('click', () => {
    try { active = resumeTimeSession(active, performance.now()); render(); announce('Timer resumed.'); }
    catch { announce('The timer could not be resumed. Try again.', true); }
  });
  stopButton.addEventListener('click', () => {
    try {
      if (drafts.length >= 500) return announce('This page can hold up to 500 sessions. Save or clear some first.', true);
      drafts.unshift(finishTimeSession(active, performance.now(), Date.now())); active = null; render(); announce('Time entry saved.');
    } catch { announce('The session could not be saved.', true); }
  });
  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-time-remove]');
    if (!button) return;
    drafts.splice(Number(button.dataset.timeRemove), 1); render(); announce('Time entry removed.');
  });
  saveButton.addEventListener('click', () => {
    try { localStorage.setItem(storageKey, serializeTimeSessions(drafts)); storageAvailable(); announce('Sessions saved on this device.'); }
    catch { announce('Could not save sessions. Browser storage may be unavailable or full.', true); }
  });
  loadButton.addEventListener('click', () => {
    let raw;
    try {
      raw = localStorage.getItem(storageKey);
    } catch { announce('Browser storage is unavailable.', true); return; }
    if (raw === null) return announce('No saved sessions were found.', true);
    try {
      const loaded = validateTimeSessions(raw);
      drafts.splice(0, drafts.length, ...loaded); render(); announce('Saved sessions loaded.');
    } catch { announce('Could not load saved sessions.', true); }
  });
  deleteButton.addEventListener('click', () => {
    try { localStorage.removeItem(storageKey); storageAvailable(); announce('Saved sessions deleted from this device.'); }
    catch { announce('Browser storage is unavailable.', true); }
  });
  csvButton.addEventListener('click', () => {
    try {
      const blob = new Blob([exportTimeSessionsCsv(drafts, ['Task or project', 'Started at', 'Ended at', 'Duration (seconds)'].map(sayTime))], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = 'usefulverse-time-sessions.csv'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000); announce('CSV download started.');
    } catch { announce('Could not create the CSV backup.', true); }
  });
  $('[data-time-clear]', root).addEventListener('click', () => {
    active = null; drafts.length = 0; clock.textContent = '00:00:00'; render(); announce('This page was cleared. Saved data was not deleted.');
  });
  const timer = () => { if (active && !active.paused) render(); };
  tick = window.setInterval(timer, 1000);
  document.addEventListener('visibilitychange', timer);
  window.addEventListener('pagehide', () => { clearInterval(tick); document.removeEventListener('visibilitychange', timer); }, { once: true });
  window.addEventListener('beforeunload', (event) => { if (active) { event.preventDefault(); event.returnValue = ''; } });
  storageAvailable(); render();
}

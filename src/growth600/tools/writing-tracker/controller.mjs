import { announce, copyText, readToolCopy } from '../controller-helpers.mjs';
import { createWritingProject, getWritingSummary, removeWritingSession, restoreWritingTracker, upsertWritingProject, upsertWritingSession } from './logic.mjs';

const root = document.querySelector('[data-tool="writing-tracker"]');
const STORAGE_KEY = 'usefulverse:writing-tracker:v1';
const MAX_BACKUP_BYTES = 300_000;

if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const field = (name) => form.elements.namedItem(name);
  const projectSelect = root.querySelector('[data-project-select]');
  const history = root.querySelector('[data-writing-history]');
  const trend = root.querySelector('[data-writing-trend]');
  const empty = root.querySelector('[data-writing-empty]');
  const submitButton = root.querySelector('[data-session-submit]');
  const showMoreButton = root.querySelector('[data-action="show-more"]');
  let data = { schemaVersion: 1, projects: [], sessions: [] };
  let visibleSessions = 30;

  const today = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };
  const makeId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  const locale = document.documentElement.lang || 'en';
  const number = (value) => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
  const dateFormat = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', timeZone: 'UTC' });
  const dateLabel = (date) => dateFormat.format(new Date(`${date}T00:00:00.000Z`));

  function selectedProject() { return data.projects.find(({ id }) => id === projectSelect.value) ?? null; }

  function saveIfConsented(message) {
    if (!field('persistConsent').checked) {
      announce(root, message ?? copy.messages.saveDisabled, 'success');
      return true;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      announce(root, `${message ?? ''} ${copy.messages.saved}`.trim(), 'success');
      return true;
    } catch {
      field('persistConsent').checked = false;
      announce(root, copy.messages.storageUnavailable, 'error');
      return false;
    }
  }

  function renderProjects() {
    const current = projectSelect.value;
    projectSelect.replaceChildren();
    for (const project of data.projects) {
      const option = document.createElement('option');
      option.value = project.id;
      option.textContent = project.name;
      projectSelect.append(option);
    }
    if (data.projects.some(({ id }) => id === current)) projectSelect.value = current;
    else if (data.projects.length) projectSelect.value = data.projects[0].id;
  }

  function renderTrend(summary) {
    trend.replaceChildren();
    const maxWords = Math.max(1, ...summary.daily.map(({ words }) => words));
    for (const day of summary.daily) {
      const item = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = `${dateLabel(day.date)}: ${number(day.words)} ${copy.fields.wordsUnit}`;
      const bar = document.createElement('progress');
      bar.max = maxWords;
      bar.value = day.words;
      bar.setAttribute('aria-label', label.textContent);
      item.append(label, bar);
      trend.append(item);
    }
  }

  function renderHistory(project) {
    history.replaceChildren();
    const entries = data.sessions.filter(({ projectId }) => projectId === project.id).sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
    for (const session of entries.slice(0, visibleSessions)) {
      const item = document.createElement('li');
      const details = document.createElement('p');
      details.textContent = `${dateLabel(session.date)} · ${number(session.words)} ${copy.fields.wordsUnit}${session.minutes === null ? '' : ` · ${number(session.minutes)} ${copy.fields.minutesUnit}`}${session.note ? ` · ${session.note}` : ''}`;
      const edit = document.createElement('button');
      edit.type = 'button'; edit.className = 'button button--secondary'; edit.dataset.editSession = session.id; edit.textContent = copy.fields.editSession;
      edit.setAttribute('aria-label', `${copy.fields.editSession}: ${dateLabel(session.date)}`);
      const remove = document.createElement('button');
      remove.type = 'button'; remove.className = 'button button--secondary'; remove.dataset.deleteSession = session.id; remove.textContent = copy.fields.deleteSession;
      remove.setAttribute('aria-label', `${copy.fields.deleteSession}: ${dateLabel(session.date)}`);
      item.append(details, edit, remove); history.append(item);
    }
    showMoreButton.hidden = entries.length <= visibleSessions;
  }

  function render() {
    root.querySelector('[data-result]').hidden = false;
    renderProjects();
    const project = selectedProject();
    empty.textContent = project ? copy.fields.noSessions : copy.fields.noProjects;
    empty.hidden = Boolean(project && data.sessions.some(({ projectId }) => projectId === project.id));
    if (!project) {
      for (const selector of ['[data-today-words]', '[data-week-words]', '[data-week-sessions]']) root.querySelector(selector).textContent = '0';
      root.querySelector('[data-goal-wrap]').hidden = true;
      trend.replaceChildren(); history.replaceChildren(); showMoreButton.hidden = true;
      return;
    }
    const summary = getWritingSummary(data.sessions, project.id, today());
    root.querySelector('[data-today-words]').textContent = number(summary.todayWords);
    root.querySelector('[data-week-words]').textContent = number(summary.weekWords);
    root.querySelector('[data-week-sessions]').textContent = number(summary.weekSessions);
    const goalWrap = root.querySelector('[data-goal-wrap]');
    goalWrap.hidden = project.goalWords === null;
    if (project.goalWords !== null) {
      const total = data.sessions.filter(({ projectId }) => projectId === project.id).reduce((sum, session) => sum + session.words, 0);
      const percent = total / project.goalWords * 100;
      root.querySelector('[data-goal-progress]').value = Math.min(100, percent);
      root.querySelector('[data-goal-copy]').textContent = `${number(total)} / ${number(project.goalWords)} (${number(percent)}%)`;
      root.querySelector('[data-goal-progress]').setAttribute('aria-label', `${copy.fields.goalProgress}: ${number(total)} / ${number(project.goalWords)}`);
    }
    renderTrend(summary);
    renderHistory(project);
  }

  function clearSessionForm() {
    field('sessionId').value = '';
    field('date').value = today();
    field('words').value = '0';
    field('minutes').value = '';
    field('note').value = '';
    submitButton.textContent = copy.actions.saveSession;
  }

  function projectFromForm() {
    const project = createWritingProject({ id: makeId(), name: field('projectName').value, goalWords: field('projectGoal').value });
    data = { ...data, projects: [...upsertWritingProject(data.projects, project)] };
    field('projectName').value = '';
    field('projectGoal').value = '';
    render();
    projectSelect.value = project.id;
    render();
    saveIfConsented(copy.messages.projectAdded);
  }

  root.querySelector('[data-action="add-project"]').addEventListener('click', () => {
    try { projectFromForm(); } catch { announce(root, copy.messages.checkProject, 'error'); }
  });

  projectSelect.addEventListener('change', () => { visibleSessions = 30; render(); });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const project = selectedProject();
    if (!project) { announce(root, copy.messages.projectRequired, 'error'); return; }
    const sessionId = field('sessionId').value || makeId();
    const isUpdate = Boolean(field('sessionId').value);
    try {
      data = { ...data, sessions: [...upsertWritingSession(data.sessions, {
        id: sessionId, projectId: project.id, date: field('date').value,
        words: field('words').value, minutes: field('minutes').value, note: field('note').value,
      }, data.projects)] };
      render();
      clearSessionForm();
      saveIfConsented(isUpdate ? copy.messages.sessionUpdated : copy.messages.sessionSaved);
    } catch { announce(root, copy.messages.checkSession, 'error'); }
  });

  root.querySelector('[data-action="reset"]').addEventListener('click', () => { clearSessionForm(); announce(root, copy.messages.saveDisabled); });

  root.querySelector('[data-action="example"]').addEventListener('click', () => {
    let project = data.projects.find(({ name }) => name === 'Sample draft');
    if (!project) {
      project = createWritingProject({ id: makeId(), name: 'Sample draft', goalWords: 5000 });
      data = { ...data, projects: [...upsertWritingProject(data.projects, project)] };
    }
    render(); projectSelect.value = project.id;
    field('date').value = today(); field('words').value = '450'; field('minutes').value = '45'; field('note').value = 'Example session';
    saveIfConsented(copy.messages.exampleLoaded);
  });

  root.querySelector('[data-action="copy"]').addEventListener('click', () => {
    const project = selectedProject();
    if (!project) { announce(root, copy.messages.empty, 'error'); return; }
    const summary = getWritingSummary(data.sessions, project.id, today());
    const total = data.sessions.filter(({ projectId }) => projectId === project.id).reduce((sum, session) => sum + session.words, 0);
    void copyText(root, `${project.name}: ${number(total)} ${copy.fields.wordsUnit}; ${number(summary.weekWords)} ${copy.fields.weekLabel.toLowerCase()}.`, copy);
  });

  root.querySelector('[data-action="export"]').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ schemaVersion: 1, projects: data.projects, sessions: data.sessions }, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'usefulverse-writing-tracker.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce(root, copy.messages.backupDownloaded, 'success');
  });

  root.querySelector('[data-action="import"]').addEventListener('click', () => field('backupFile').click());
  field('backupFile').addEventListener('change', async () => {
    const file = field('backupFile').files?.[0];
    field('backupFile').value = '';
    if (!file) return;
    try {
      if (file.size > MAX_BACKUP_BYTES) throw new RangeError(copy.messages.fileTooLarge);
      data = restoreWritingTracker(JSON.parse(await file.text()));
      visibleSessions = 30; render(); saveIfConsented(copy.messages.backupRestored);
    } catch (error) { announce(root, error instanceof RangeError && error.message === copy.messages.fileTooLarge ? copy.messages.fileTooLarge : copy.messages.backupInvalid, 'error'); }
  });

  field('persistConsent').addEventListener('change', () => {
    if (field('persistConsent').checked) saveIfConsented();
    else {
      try { localStorage.removeItem(STORAGE_KEY); announce(root, copy.messages.saveDisabled, 'success'); }
      catch { announce(root, copy.messages.storageUnavailable, 'error'); }
    }
  });

  history.addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-edit-session]');
    const deleteButton = event.target.closest('[data-delete-session]');
    if (editButton) {
      const session = data.sessions.find(({ id }) => id === editButton.dataset.editSession);
      if (!session) return;
      field('sessionId').value = session.id; projectSelect.value = session.projectId;
      field('date').value = session.date; field('words').value = String(session.words);
      field('minutes').value = session.minutes === null ? '' : String(session.minutes); field('note').value = session.note;
      submitButton.textContent = copy.actions.updateSession; render(); field('words').focus();
    } else if (deleteButton && window.confirm(copy.messages.confirmDelete)) {
      data = { ...data, sessions: [...removeWritingSession(data.sessions, deleteButton.dataset.deleteSession, data.projects)] };
      render(); saveIfConsented(copy.messages.sessionDeleted);
    }
  });

  showMoreButton.addEventListener('click', () => { visibleSessions += 30; render(); });

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      data = restoreWritingTracker(JSON.parse(saved));
      field('persistConsent').checked = true;
    }
  } catch { announce(root, copy.messages.storageUnavailable, 'error'); }
  field('date').value = today();
  render();
}

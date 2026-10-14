import { addWritingProject, createWritingTrackerState, deleteWritingProject, deleteWritingSession, escapeWritingCsvCell, recordWritingSession, restoreWritingTrackerState, summarizeWritingTracker } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const STORAGE_KEY = 'usefulverse:writing-tracker:v1';
const root = document.querySelector('[data-tool="writing-tracker"]');

if (root) {
  const copy = readToolCopy(root);
  const projectForm = root.querySelector('#writing-project-form');
  const sessionForm = root.querySelector('#writing-session-form');
  const projectList = root.querySelector('[data-project-list]');
  const sessionList = root.querySelector('[data-session-list]');
  const projectSelect = sessionForm.elements.namedItem('projectId');
  const today = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  const locale = document.documentElement.lang || 'en';
  const number = (value) => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' });
  let state = createWritingTrackerState();
  let editingId = '';

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) state = restoreWritingTrackerState(JSON.parse(saved));
  } catch {
    announce(root, copy.messages.storageUnavailable, 'error');
  }

  function persist(message) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      render();
      announce(root, `${message} ${copy.messages.storageSaved}`, 'success');
      return true;
    } catch {
      render();
      announce(root, copy.messages.storageUnavailable, 'error');
      return false;
    }
  }

  function makeButton(text, action, id, context = '') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button button--secondary';
    button.dataset.action = action;
    if (id) button.dataset.id = id;
    button.textContent = text;
    if (context) button.setAttribute('aria-label', `${text}: ${context}`);
    return button;
  }

  function renderProjects(summary) {
    projectList.replaceChildren();
    projectSelect.replaceChildren();
    const prompt = document.createElement('option');
    prompt.value = '';
    prompt.textContent = copy.fields.chooseProject;
    projectSelect.append(prompt);
    for (const project of summary.projects) {
      const option = document.createElement('option');
      option.value = project.id;
      option.textContent = project.name;
      projectSelect.append(option);

      const item = document.createElement('li');
      const heading = document.createElement('strong');
      heading.textContent = project.name;
      const progress = document.createElement('p');
      progress.textContent = project.targetWords
        ? `${number(project.words)} / ${number(project.targetWords)} · ${project.progressPercent.toFixed(0)}% · ${project.remainingWords ? copy.fields.projectRemaining.replace('{count}', number(project.remainingWords)) : copy.fields.projectReached}`
        : `${number(project.words)} · ${copy.fields.projectGoalNone}`;
      const remove = makeButton(copy.actions.deleteProject, 'delete-project', project.id, project.name);
      item.append(heading, progress, remove);
      projectList.append(item);
    }
    root.querySelector('[data-no-projects]').hidden = summary.projects.length > 0;
    sessionForm.querySelector('[data-action="record-session"]').disabled = summary.projects.length === 0;
  }

  function renderSessions(summary) {
    sessionList.replaceChildren();
    const byId = new Map(summary.projects.map((project) => [project.id, project.name]));
    for (const session of state.sessions) {
      const item = document.createElement('li');
      const heading = document.createElement('strong');
      heading.textContent = byId.get(session.projectId) ?? '';
      const date = document.createElement('time');
      date.dateTime = session.date;
      date.textContent = dateFormatter.format(new Date(`${session.date}T00:00:00.000Z`));
      const detail = document.createElement('p');
      detail.textContent = `${number(session.words)} ${copy.fields.words.toLocaleLowerCase(locale)} · ${number(session.minutes)} ${copy.fields.minutes.toLocaleLowerCase(locale)}${session.note ? ` · ${session.note}` : ''}`;
      const edit = makeButton(copy.actions.edit, 'edit-session', session.id, `${byId.get(session.projectId) ?? ''}, ${date.textContent}`);
      const remove = makeButton(copy.actions.delete, 'delete-session', session.id, `${byId.get(session.projectId) ?? ''}, ${date.textContent}`);
      item.append(heading, date, detail, edit, remove);
      sessionList.append(item);
    }
    root.querySelector('[data-no-sessions]').hidden = state.sessions.length > 0;
  }

  function renderSummary(summary) {
    for (const key of ['totalWords', 'totalMinutes', 'sessions', 'activeDays', 'currentStreak']) {
      root.querySelector(`[data-summary="${key}"]`).textContent = number(summary[key]);
    }
  }

  function render() {
    const summary = summarizeWritingTracker(state, today());
    renderProjects(summary);
    renderSessions(summary);
    renderSummary(summary);
  }

  function clearSessionForm() {
    editingId = '';
    sessionForm.reset();
    sessionForm.elements.namedItem('date').value = today();
    sessionForm.querySelector('[data-action="record-session"]').textContent = copy.actions.recordSession;
    root.querySelector('[data-action="cancel-edit"]').hidden = true;
  }

  function createId(prefix) {
    return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`}`;
  }

  function exportCsv() {
    const lines = [[copy.fields.sessionProject, copy.fields.sessionDate, copy.fields.sessionWords, copy.fields.sessionMinutes, copy.fields.sessionNote]];
    const names = new Map(state.projects.map(({ id, name }) => [id, name]));
    for (const session of state.sessions) lines.push([names.get(session.projectId), session.date, session.words, session.minutes, session.note]);
    const blob = new Blob([`\uFEFF${lines.map((line) => line.map(escapeWritingCsvCell).join(',')).join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'usefulverse-writing-sessions.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce(root, copy.messages.copied, 'success');
  }

  projectForm.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const data = new FormData(projectForm);
      const target = String(data.get('targetWords') ?? '').trim();
      state = addWritingProject(state, { id: createId('project'), name: data.get('name'), targetWords: target ? Number(target) : 0 });
      projectForm.reset();
      persist(copy.messages.projectAdded);
    } catch { announce(root, copy.messages.checkProject, 'error'); }
  });

  sessionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const data = new FormData(sessionForm);
      const previous = Boolean(editingId);
      state = recordWritingSession(state, {
        id: editingId || createId('session'), projectId: data.get('projectId'), date: data.get('date'),
        words: Number(data.get('words')), minutes: String(data.get('minutes') ?? '').trim() ? Number(data.get('minutes')) : 0,
        note: data.get('note'),
      });
      clearSessionForm();
      persist(previous ? copy.messages.sessionUpdated : copy.messages.sessionSaved);
    } catch { announce(root, copy.messages.checkSession, 'error'); }
  });

  projectList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action="delete-project"]');
    if (!button || !window.confirm(copy.messages.confirmDeleteProject)) return;
    state = deleteWritingProject(state, button.dataset.id);
    if (editingId && !state.sessions.some(({ id }) => id === editingId)) clearSessionForm();
    persist(copy.messages.projectDeleted);
  });

  sessionList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-id]');
    if (!button) return;
    const session = state.sessions.find(({ id }) => id === button.dataset.id);
    if (!session) return;
    if (button.dataset.action === 'edit-session') {
      editingId = session.id;
      for (const [key, value] of Object.entries({ projectId: session.projectId, date: session.date, words: session.words, minutes: session.minutes, note: session.note })) sessionForm.elements.namedItem(key).value = value;
      sessionForm.querySelector('[data-action="record-session"]').textContent = copy.actions.updateSession;
      root.querySelector('[data-action="cancel-edit"]').hidden = false;
      sessionForm.elements.namedItem('words').focus();
    } else if (button.dataset.action === 'delete-session') {
      state = deleteWritingSession(state, session.id);
      if (editingId === session.id) clearSessionForm();
      persist(copy.messages.sessionDeleted);
    }
  });

  root.querySelector('[data-action="cancel-edit"]').addEventListener('click', clearSessionForm);
  root.querySelector('[data-action="export-csv"]').addEventListener('click', exportCsv);
  root.querySelector('[data-action="writing-example"]').addEventListener('click', () => {
    if (!state.projects.length) state = addWritingProject(state, { id: 'writing-example-project', name: 'Sample project', targetWords: 10000 });
    const project = state.projects[0];
    const existing = state.sessions.find(({ id }) => id === 'writing-example-session');
    state = recordWritingSession(state, { id: 'writing-example-session', projectId: project.id, date: existing?.date ?? today(), words: 500, minutes: 30, note: 'Sample session' });
    persist(copy.messages.sessionSaved);
  });

  render();
}

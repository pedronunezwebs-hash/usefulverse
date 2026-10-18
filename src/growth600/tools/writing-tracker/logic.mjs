const MAX_PROJECTS = 50;
const MAX_SESSIONS = 2000;
const MAX_NAME = 80;
const MAX_NOTE = 500;

function shortText(value, label, maxLength) {
  const text = String(value ?? '').trim();
  if (!text || text.length > maxLength) throw new RangeError(`${label} must contain 1–${maxLength} characters.`);
  return text;
}

function nonNegative(value, label, maximum) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 0 || number > maximum) throw new RangeError(`${label} must be a whole number from 0 to ${maximum}.`);
  return number;
}

function dateValue(value) {
  const text = String(value ?? '');
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(text)) throw new RangeError('Enter a valid session date.');
  const date = new Date(`${text}T00:00:00.000Z`);
  if (!Number.isFinite(date.valueOf()) || date.toISOString().slice(0, 10) !== text) throw new RangeError('Enter a valid session date.');
  return text;
}

function identifier(value, label) {
  const id = String(value ?? '').trim();
  if (!/^[a-zA-Z0-9_-]{1,80}$/u.test(id)) throw new RangeError(`${label} is invalid.`);
  return id;
}

function validateState(state) {
  if (!state || state.schemaVersion !== 1 || !Array.isArray(state.projects) || !Array.isArray(state.sessions)
    || state.projects.length > MAX_PROJECTS || state.sessions.length > MAX_SESSIONS) {
    throw new TypeError('A valid writing tracker is required.');
  }
  const projects = new Set();
  for (const project of state.projects) {
    identifier(project.id, 'Project ID');
    if (projects.has(project.id)) throw new TypeError('Project IDs must be unique.');
    projects.add(project.id);
  }
  const sessions = new Set();
  for (const session of state.sessions) {
    identifier(session.id, 'Session ID');
    if (sessions.has(session.id)) throw new TypeError('Session IDs must be unique.');
    if (!projects.has(session.projectId)) throw new TypeError('Every session must belong to an existing project.');
    sessions.add(session.id);
  }
  return state;
}

export function createWritingTrackerState() {
  return Object.freeze({ schemaVersion: 1, projects: Object.freeze([]), sessions: Object.freeze([]) });
}

export function restoreWritingTrackerState(value) {
  if (!value || value.schemaVersion !== 1 || !Array.isArray(value.projects) || !Array.isArray(value.sessions)
    || value.projects.length > MAX_PROJECTS || value.sessions.length > MAX_SESSIONS) {
    throw new TypeError('This is not a supported writing-tracker backup.');
  }
  let state = createWritingTrackerState();
  for (const project of value.projects) state = addWritingProject(state, project);
  for (const session of value.sessions) state = recordWritingSession(state, session);
  return validateState(state);
}

export function addWritingProject(state, { id, name, targetWords = 0 } = {}) {
  validateState(state);
  if (state.projects.length >= MAX_PROJECTS) throw new RangeError(`Keep no more than ${MAX_PROJECTS} projects.`);
  const projectId = identifier(id, 'Project ID');
  if (state.projects.some((project) => project.id === projectId)) throw new RangeError('This project already exists.');
  const project = Object.freeze({ id: projectId, name: shortText(name, 'Project name', MAX_NAME), targetWords: nonNegative(targetWords, 'Word goal', 100_000_000) });
  return Object.freeze({ ...state, projects: Object.freeze([...state.projects, project]) });
}

export function recordWritingSession(state, { id, projectId, date, words, minutes = 0, note = '' } = {}) {
  validateState(state);
  const sessionId = identifier(id, 'Session ID');
  const parentId = identifier(projectId, 'Project ID');
  if (!state.projects.some((project) => project.id === parentId)) throw new RangeError('Choose an existing project.');
  const existingIndex = state.sessions.findIndex((session) => session.id === sessionId);
  if (existingIndex < 0 && state.sessions.length >= MAX_SESSIONS) throw new RangeError(`Keep no more than ${MAX_SESSIONS} sessions.`);
  const session = Object.freeze({
    id: sessionId,
    projectId: parentId,
    date: dateValue(date),
    words: nonNegative(words, 'Words written', 10_000_000),
    minutes: nonNegative(minutes, 'Minutes', 1440),
    note: String(note ?? '').trim().slice(0, MAX_NOTE),
  });
  const sessions = state.sessions.filter((entry) => entry.id !== sessionId);
  sessions.push(session);
  sessions.sort((left, right) => right.date.localeCompare(left.date) || right.id.localeCompare(left.id));
  return Object.freeze({ ...state, sessions: Object.freeze(sessions) });
}

export function deleteWritingSession(state, sessionId) {
  validateState(state);
  const id = identifier(sessionId, 'Session ID');
  return Object.freeze({ ...state, sessions: Object.freeze(state.sessions.filter((session) => session.id !== id)) });
}

export function deleteWritingProject(state, projectId) {
  validateState(state);
  const id = identifier(projectId, 'Project ID');
  return Object.freeze({
    ...state,
    projects: Object.freeze(state.projects.filter((project) => project.id !== id)),
    sessions: Object.freeze(state.sessions.filter((session) => session.projectId !== id)),
  });
}

function dateOrdinal(text) { return Date.parse(`${text}T00:00:00.000Z`) / 86_400_000; }

export function summarizeWritingTracker(state, todayInput) {
  validateState(state);
  const today = dateValue(todayInput);
  const days = new Set(state.sessions.filter(({ words }) => words > 0).map(({ date }) => date));
  let streak = 0;
  const todayOrdinal = dateOrdinal(today);
  let ordinal = days.has(today) ? todayOrdinal : todayOrdinal - 1;
  for (; days.has(new Date(ordinal * 86_400_000).toISOString().slice(0, 10)); ordinal -= 1) streak += 1;
  const projects = state.projects.map((project) => {
    const sessions = state.sessions.filter((session) => session.projectId === project.id);
    const words = sessions.reduce((sum, session) => sum + session.words, 0);
    return Object.freeze({ ...project, words, remainingWords: Math.max(0, project.targetWords - words), progressPercent: project.targetWords ? Math.min(100, (words / project.targetWords) * 100) : null, sessions: sessions.length });
  });
  return Object.freeze({
    totalWords: state.sessions.reduce((sum, session) => sum + session.words, 0),
    totalMinutes: state.sessions.reduce((sum, session) => sum + session.minutes, 0),
    sessions: state.sessions.length,
    activeDays: days.size,
    currentStreak: streak,
    projects: Object.freeze(projects),
  });
}

export function escapeWritingCsvCell(value) {
  let text = String(value ?? '');
  if (/^[\s\uFEFF]*[=+\-@]/u.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

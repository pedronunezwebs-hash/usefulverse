export const MAX_WRITING_PROJECTS = 100;
export const MAX_WRITING_SESSIONS = 2_000;
export const MAX_WRITING_NAME_LENGTH = 80;
export const MAX_WRITING_NOTE_LENGTH = 300;

function cleanText(value, max, label, required = false) {
  const text = String(value ?? '').trim();
  if ((required && !text) || text.length > max) throw new RangeError(`${label} is missing or too long.`);
  return text;
}

function cleanDate(value) {
  const text = String(value ?? '');
  const date = new Date(`${text}T00:00:00.000Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(text) || Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== text || Number(text.slice(0, 4)) < 1900 || Number(text.slice(0, 4)) > 2100) throw new RangeError('Enter a valid session date.');
  return text;
}

function positiveInteger(value, label, maximum, allowZero = false) {
  if (value === '' || value === null || value === undefined) throw new RangeError(`${label} is required.`);
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < (allowZero ? 0 : 1) || number > maximum) throw new RangeError(`${label} is outside its supported range.`);
  return number;
}

function cleanProject(project) {
  const id = cleanText(project?.id, 80, 'Project ID', true);
  const name = cleanText(project?.name, MAX_WRITING_NAME_LENGTH, 'Project name', true);
  const goalWords = project?.goalWords === '' || project?.goalWords === null || project?.goalWords === undefined ? null : positiveInteger(project.goalWords, 'Word goal', 100_000_000);
  return Object.freeze({ id, name, goalWords });
}

function cleanSession(session, projectIds) {
  const id = cleanText(session?.id, 80, 'Session ID', true);
  const projectId = cleanText(session?.projectId, 80, 'Project ID', true);
  if (!projectIds.has(projectId)) throw new RangeError('Choose an existing project.');
  return Object.freeze({
    id,
    projectId,
    date: cleanDate(session?.date),
    words: positiveInteger(session?.words, 'Words written', 10_000_000, true),
    minutes: session?.minutes === '' || session?.minutes === null || session?.minutes === undefined ? null : positiveInteger(session.minutes, 'Minutes', 1440),
    note: cleanText(session?.note, MAX_WRITING_NOTE_LENGTH, 'Session note'),
  });
}

export function createWritingProject(value) {
  return cleanProject({ id: value?.id, name: value?.name, goalWords: value?.goalWords });
}

export function upsertWritingProject(projects, value) {
  if (!Array.isArray(projects)) throw new TypeError('A project list is required.');
  const clean = projects.map(cleanProject);
  const project = createWritingProject(value);
  if (clean.some(({ id, name }) => id !== project.id && name.toLocaleLowerCase() === project.name.toLocaleLowerCase())) throw new RangeError('A project with this name already exists.');
  const existing = clean.findIndex(({ id }) => id === project.id);
  if (existing >= 0) clean[existing] = project;
  else {
    if (clean.length >= MAX_WRITING_PROJECTS) throw new RangeError(`A tracker can contain at most ${MAX_WRITING_PROJECTS} projects.`);
    clean.push(project);
  }
  return Object.freeze(clean);
}

export function createWritingSession(value, projects) {
  if (!Array.isArray(projects) || !projects.length) throw new RangeError('Create a project first.');
  return cleanSession(value, new Set(projects.map(({ id }) => id)));
}

export function upsertWritingSession(sessions, value, projects) {
  if (!Array.isArray(sessions)) throw new TypeError('A session list is required.');
  const projectIds = new Set(projects.map(({ id }) => id));
  const clean = sessions.map((session) => cleanSession(session, projectIds));
  const session = cleanSession(value, projectIds);
  const existing = clean.findIndex(({ id }) => id === session.id);
  if (existing >= 0) clean[existing] = session;
  else {
    if (clean.length >= MAX_WRITING_SESSIONS) throw new RangeError(`A tracker can contain at most ${MAX_WRITING_SESSIONS} sessions.`);
    clean.push(session);
  }
  return Object.freeze(clean.sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id)));
}

export function removeWritingSession(sessions, id, projects) {
  if (!Array.isArray(sessions)) throw new TypeError('A session list is required.');
  const projectIds = new Set(projects.map(({ id: projectId }) => projectId));
  const clean = sessions.map((session) => cleanSession(session, projectIds));
  return Object.freeze(clean.filter((session) => session.id !== String(id)));
}

export function restoreWritingTracker(value) {
  if (!value || value.schemaVersion !== 1 || !Array.isArray(value.projects) || !Array.isArray(value.sessions) || value.projects.length > MAX_WRITING_PROJECTS || value.sessions.length > MAX_WRITING_SESSIONS) throw new TypeError('This is not a supported writing-tracker backup.');
  const projects = value.projects.map(cleanProject);
  const projectIds = new Set(projects.map(({ id }) => id));
  const projectNames = projects.map(({ name }) => name.toLocaleLowerCase());
  if (projectIds.size !== projects.length || new Set(projectNames).size !== projects.length) throw new TypeError('A backup cannot contain duplicate project IDs or names.');
  const sessions = value.sessions.map((session) => cleanSession(session, projectIds));
  if (new Set(sessions.map(({ id }) => id)).size !== sessions.length) throw new TypeError('A backup cannot contain duplicate session IDs.');
  return Object.freeze({ schemaVersion: 1, projects: Object.freeze(projects), sessions: Object.freeze(sessions.sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))) });
}

export function getWritingSummary(sessions, projectId, endDate) {
  const projectSessions = sessions.filter((session) => session.projectId === projectId);
  const end = cleanDate(endDate);
  const endMs = Date.parse(`${end}T00:00:00.000Z`);
  const start = new Date(endMs - 6 * 86_400_000).toISOString().slice(0, 10);
  const week = projectSessions.filter(({ date }) => date >= start && date <= end);
  const today = projectSessions.filter(({ date }) => date === end);
  const daily = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(endMs - (6 - index) * 86_400_000).toISOString().slice(0, 10);
    return Object.freeze({ date, words: week.filter((session) => session.date === date).reduce((sum, session) => sum + session.words, 0) });
  });
  return Object.freeze({ todayWords: today.reduce((sum, session) => sum + session.words, 0), weekWords: week.reduce((sum, session) => sum + session.words, 0), weekSessions: week.length, daily: Object.freeze(daily) });
}

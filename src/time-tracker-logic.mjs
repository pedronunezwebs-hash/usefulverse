const MAX_SESSIONS = 500;
const MAX_NAME = 120;
const MAX_SESSION_MS = 7 * 24 * 60 * 60 * 1000;

export function normalizeProjectName(value) {
  if (typeof value !== 'string') throw new TypeError('Enter a task or project name.');
  const name = value.normalize('NFC').trim().replace(/\s+/gu, ' ');
  if (!name) throw new TypeError('Enter a task or project name.');
  if (Array.from(name).length > MAX_NAME) throw new RangeError('Use 120 characters or fewer.');
  return name;
}

export function startTimeSession(name, wallTime, monotonicTime) {
  const project = normalizeProjectName(name);
  if (![wallTime, monotonicTime].every(Number.isFinite) || wallTime < 0 || monotonicTime < 0) throw new RangeError('Timer values must be valid non-negative timestamps.');
  return { name: project, startedAt: Math.trunc(wallTime), elapsedMs: 0, segmentStartedAt: monotonicTime, paused: false };
}

export function pauseTimeSession(session, monotonicTime) {
  if (!session || session.paused || !Number.isFinite(monotonicTime) || monotonicTime < session.segmentStartedAt) throw new RangeError('The current timer cannot be paused at that time.');
  return { ...session, elapsedMs: session.elapsedMs + monotonicTime - session.segmentStartedAt, segmentStartedAt: null, paused: true };
}

export function resumeTimeSession(session, monotonicTime) {
  if (!session || !session.paused || !Number.isFinite(monotonicTime) || monotonicTime < 0) throw new RangeError('The current timer cannot be resumed.');
  return { ...session, segmentStartedAt: monotonicTime, paused: false };
}

export function elapsedTimeSession(session, monotonicTime) {
  if (!session || !Number.isFinite(session.elapsedMs) || session.elapsedMs < 0) throw new TypeError('The current timer is invalid.');
  const live = session.paused ? 0 : Number(monotonicTime) - Number(session.segmentStartedAt);
  if (!Number.isFinite(live) || live < 0) throw new RangeError('The current timer cannot move backwards.');
  return session.elapsedMs + live;
}

export function finishTimeSession(session, monotonicTime, wallTime) {
  if (![monotonicTime, wallTime].every(Number.isFinite) || wallTime < session.startedAt) throw new RangeError('Choose a valid finish time.');
  const durationMs = Math.round(elapsedTimeSession(session, session.paused ? session.segmentStartedAt ?? monotonicTime : monotonicTime));
  if (durationMs < 1_000 || durationMs > MAX_SESSION_MS) throw new RangeError('A saved session must last from 1 second to 7 days.');
  return { name: normalizeProjectName(session.name), startedAt: Math.trunc(session.startedAt), endedAt: Math.trunc(wallTime), durationMs };
}

export function validateTimeSessions(value) {
  const data = typeof value === 'string' ? JSON.parse(value) : value;
  if (!data || data.version !== 1 || !Array.isArray(data.sessions) || data.sessions.length > MAX_SESSIONS) throw new TypeError('This is not a supported time-tracker backup.');
  return data.sessions.map((session) => {
    if (!session || !Number.isSafeInteger(session.startedAt) || !Number.isSafeInteger(session.endedAt) || !Number.isSafeInteger(session.durationMs)
      || session.startedAt < 0 || session.endedAt < session.startedAt || session.durationMs < 1_000 || session.durationMs > MAX_SESSION_MS
      || session.durationMs > session.endedAt - session.startedAt + 1_000) throw new TypeError('A saved time entry is not valid.');
    return { name: normalizeProjectName(session.name), startedAt: session.startedAt, endedAt: session.endedAt, durationMs: session.durationMs };
  });
}

export function serializeTimeSessions(sessions) {
  return JSON.stringify({ version: 1, sessions: validateTimeSessions({ version: 1, sessions }) }, null, 2);
}

export function summarizeTimeSessions(sessions) {
  const totals = new Map();
  for (const session of validateTimeSessions({ version: 1, sessions })) totals.set(session.name, (totals.get(session.name) ?? 0) + session.durationMs);
  return [...totals].map(([name, durationMs]) => ({ name, durationMs })).sort((a, b) => b.durationMs - a.durationMs || a.name.localeCompare(b.name));
}

const csvCell = (value) => {
  let text = String(value ?? '');
  if (/^[\s\u0000-\u001f]*[=+@-]/u.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
};

export function exportTimeSessionsCsv(sessions, headers = ['Project', 'Started at', 'Ended at', 'Duration (seconds)']) {
  const safe = validateTimeSessions({ version: 1, sessions });
  if (!Array.isArray(headers) || headers.length !== 4 || headers.some((item) => typeof item !== 'string')) throw new TypeError('CSV headers are invalid.');
  const rows = [headers, ...safe.map((item) => [item.name, new Date(item.startedAt).toISOString(), new Date(item.endedAt).toISOString(), (item.durationMs / 1000).toFixed(1)])];
  return `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
}

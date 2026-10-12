export const MEETING_MINUTES_LIMITS = Object.freeze({ maxTitle: 160, maxPerson: 120, maxAttendees: 80, maxAgenda: 40, maxDecisions: 80, maxActions: 80, maxLine: 240 });

function lines(value, maximum, label) {
  const entries = String(value ?? '').split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (entries.length > maximum || entries.some((line) => line.length > MEETING_MINUTES_LIMITS.maxLine)) throw new RangeError(`${label} is outside the supported limits.`);
  return entries;
}

function person(value, label, optional = false) {
  const text = String(value ?? '').trim();
  if ((!optional && !text) || text.length > MEETING_MINUTES_LIMITS.maxPerson) throw new RangeError(`${label} is required and must fit the supported length.`);
  return text;
}

function validDate(value) {
  if (!value) return '';
  const text = String(value);
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(text)) throw new RangeError('Use a valid YYYY-MM-DD date.');
  const date = new Date(`${text}T00:00:00.000Z`);
  if (!Number.isFinite(date.valueOf()) || date.toISOString().slice(0, 10) !== text) throw new RangeError('Use a valid calendar date.');
  return text;
}

export function createMeetingMinutes(input) {
  const title = String(input?.title ?? '').trim();
  if (!title || title.length > MEETING_MINUTES_LIMITS.maxTitle) throw new RangeError('Enter a meeting title within the supported length.');
  const attendees = lines(input?.attendees, MEETING_MINUTES_LIMITS.maxAttendees, 'Attendees').map((entry) => person(entry, 'Attendee'));
  const normalizedAttendees = new Set(attendees.map((entry) => entry.toLocaleLowerCase('en')));
  if (normalizedAttendees.size !== attendees.length) throw new RangeError('Attendee names must be unique.');
  const agenda = lines(input?.agenda, MEETING_MINUTES_LIMITS.maxAgenda, 'Agenda');
  const decisions = lines(input?.decisions, MEETING_MINUTES_LIMITS.maxDecisions, 'Decisions');
  const rawActions = lines(input?.actions, MEETING_MINUTES_LIMITS.maxActions, 'Actions');
  const actions = rawActions.map((line) => {
    const parts = line.split('|').map((part) => part.trim());
    if (parts.length !== 3 || parts.some((part) => !part)) throw new RangeError('Each action must use: task | owner | due date (YYYY-MM-DD).');
    const task = person(parts[0], 'Action');
    const owner = person(parts[1], 'Action owner');
    const dueDate = validDate(parts[2]);
    if (!dueDate) throw new RangeError('Every action needs a due date.');
    return Object.freeze({ task, owner, dueDate });
  });
  return Object.freeze({
    title,
    date: validDate(input?.date),
    facilitator: person(input?.facilitator, 'Facilitator', true),
    attendees: Object.freeze(attendees), agenda: Object.freeze(agenda), decisions: Object.freeze(decisions), actions: Object.freeze(actions),
  });
}

export function renderMeetingMinutesMarkdown(minutes) {
  const checked = createMeetingMinutes({ ...minutes, attendees: (minutes.attendees ?? []).join('\n'), agenda: (minutes.agenda ?? []).join('\n'), decisions: (minutes.decisions ?? []).join('\n'), actions: (minutes.actions ?? []).map(({ task, owner, dueDate }) => `${task} | ${owner} | ${dueDate}`).join('\n') });
  const section = (heading, items) => `## ${heading}\n${items.length ? items.map((item) => `- ${item}`).join('\n') : '- ' + '—'}`;
  const metadata = [`Date: ${checked.date || '—'}`, `Facilitator: ${checked.facilitator || '—'}`, `Attendees: ${checked.attendees.length ? checked.attendees.join(', ') : '—'}`].join('\n');
  const actions = checked.actions.length ? checked.actions.map(({ task, owner, dueDate }) => `- [ ] ${task} — Owner: ${owner} — Due: ${dueDate}`).join('\n') : '- —';
  return `# ${checked.title}\n\n${metadata}\n\n${section('Agenda', checked.agenda)}\n\n${section('Decisions', checked.decisions)}\n\n## Action items\n${actions}\n`;
}

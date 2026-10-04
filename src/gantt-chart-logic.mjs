const MAX_TASKS = 120;
const MAX_DURATION_DAYS = 365;
const MAX_PROJECT_DAYS = 1_095;
const DAY_MS = 86_400_000;

function parseDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(String(value));
  if (!match) throw new TypeError('Enter dates as YYYY-MM-DD.');
  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) throw new TypeError('Enter a valid calendar date.');
  return date;
}

export function parseGanttTasks(text) {
  const lines = String(text ?? '').split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) throw new TypeError('Add at least one task.');
  if (lines.length > MAX_TASKS) throw new RangeError(`Use no more than ${MAX_TASKS} tasks.`);
  const tasks = lines.map((line, index) => {
    const [rawName, rawStart, rawDuration, rawDependency = ''] = line.split('|').map((part) => part.trim());
    const name = rawName ?? '';
    if (!name) throw new TypeError('Every task needs a name.');
    if (name.length > 100) throw new RangeError('Task names must be 100 characters or fewer.');
    const startDate = parseDate(rawStart);
    const duration = Number(rawDuration);
    if (!Number.isInteger(duration) || duration < 1 || duration > MAX_DURATION_DAYS) throw new RangeError(`Task duration must be a whole number from 1 to ${MAX_DURATION_DAYS} days.`);
    const dependency = rawDependency === '' ? null : Number(rawDependency);
    if (dependency !== null && (!Number.isInteger(dependency) || dependency < 1 || dependency >= index + 1)) {
      throw new RangeError('A task can depend only on an earlier task.');
    }
    const endDate = new Date(startDate.getTime() + (duration - 1) * DAY_MS);
    return { id: index + 1, name, start: startDate.toISOString().slice(0, 10), startMs: startDate.getTime(), duration, end: endDate.toISOString().slice(0, 10), endMs: endDate.getTime(), dependency };
  });
  const minStart = Math.min(...tasks.map((task) => task.startMs));
  const maxEnd = Math.max(...tasks.map((task) => task.endMs));
  const spanDays = Math.floor((maxEnd - minStart) / DAY_MS) + 1;
  if (spanDays > MAX_PROJECT_DAYS) throw new RangeError(`The whole plan must fit within ${MAX_PROJECT_DAYS} calendar days.`);
  for (const task of tasks) {
    if (task.dependency !== null) {
      const parent = tasks[task.dependency - 1];
      if (task.startMs < parent.endMs + DAY_MS) throw new RangeError('A dependent task cannot start before its earlier task finishes.');
    }
  }
  return { tasks, start: minStart, end: maxEnd, spanDays };
}

export function positionGanttTasks(plan) {
  if (!plan || !Array.isArray(plan.tasks) || !Number.isInteger(plan.spanDays) || plan.spanDays < 1) throw new TypeError('Create a valid project plan first.');
  return plan.tasks.map((task) => ({
    ...task,
    leftPercent: ((task.startMs - plan.start) / DAY_MS) / plan.spanDays * 100,
    widthPercent: task.duration / plan.spanDays * 100,
    dependencyTask: task.dependency === null ? null : plan.tasks[task.dependency - 1].name,
  }));
}

export function ganttPlanToCsv(plan) {
  const quote = (value) => `"${String(value).replaceAll('"', '""')}"`;
  return ['Task,Start,Duration (days),Finish,Depends on', ...plan.tasks.map((task) => [task.name, task.start, task.duration, task.end, task.dependency ?? ''].map(quote).join(','))].join('\r\n');
}

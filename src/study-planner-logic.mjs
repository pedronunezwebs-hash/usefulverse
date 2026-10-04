const DAY_MS = 86_400_000;
const SESSION_MINUTES = 25;
const MAX_COURSES = 12;
const MAX_TASKS = 120;
const MAX_TASK_MINUTES = 2_400;

function parseDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(String(value));
  if (!match) throw new TypeError('Enter a valid exam date.');
  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) throw new TypeError('Enter a valid exam date.');
  return date;
}

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

export function buildStudyPlan(courses, today = new Date()) {
  if (!Array.isArray(courses) || courses.length < 1 || courses.length > MAX_COURSES) throw new RangeError('Add 1 to 12 subjects.');
  const start = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const subjects = courses.map((course, index) => {
    const name = String(course.name ?? '').trim().slice(0, 80);
    const exam = parseDate(course.examDate);
    const available = Number(course.minutesPerDay);
    if (!name) throw new TypeError('Enter a subject name for every row.');
    if (!Number.isInteger(available) || available < 25 || available > 600) throw new RangeError('Daily study time must be 25 to 600 minutes.');
    const daysUntil = Math.floor((exam.getTime() - start.getTime()) / DAY_MS);
    if (daysUntil < 1 || daysUntil > 180) throw new RangeError('Choose an exam date from tomorrow up to 180 days away.');
    const rawTasks = String(course.tasks ?? '').split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
    if (!rawTasks.length) throw new TypeError('Add at least one topic or task for every subject.');
    if (rawTasks.length > MAX_TASKS) throw new RangeError('Use up to 120 topics per subject.');
    const tasks = rawTasks.map((line) => {
      const divider = line.lastIndexOf('|');
      const title = (divider < 0 ? line : line.slice(0, divider)).trim().slice(0, 140);
      const estimate = divider < 0 ? SESSION_MINUTES : Number(line.slice(divider + 1).trim());
      if (!title || !Number.isInteger(estimate) || estimate < 1 || estimate > MAX_TASK_MINUTES) throw new TypeError('Write each topic as a name, optionally followed by | minutes (1–2400).');
      return { title, totalSessions: Math.ceil(estimate / SESSION_MINUTES), remaining: Math.ceil(estimate / SESSION_MINUTES), estimate };
    });
    return { name, examDate: dateKey(exam), exam, minutesPerDay: available, dailySessions: Math.floor(available / SESSION_MINUTES), tasks };
  });

  const totalTasks = subjects.reduce((sum, subject) => sum + subject.tasks.length, 0);
  if (totalTasks > MAX_TASKS) throw new RangeError('Use up to 120 topics across the whole plan.');
  const schedule = [];
  const maxDays = Math.max(...subjects.map((subject) => Math.floor((subject.exam.getTime() - start.getTime()) / DAY_MS)));
  for (let offset = 0; offset < maxDays; offset += 1) {
    const date = new Date(start.getTime() + offset * DAY_MS);
    const availableSubjects = subjects.filter((subject) => date.getTime() < subject.exam.getTime() && subject.tasks.some((task) => task.remaining > 0));
    // Share each day's capacity fairly while still favoring nearer exams.
    availableSubjects.sort((a, b) => a.exam.getTime() - b.exam.getTime() || a.name.localeCompare(b.name));
    const capacity = new Map(availableSubjects.map((subject) => [subject, subject.dailySessions]));
    let placed = true;
    while (placed) {
      placed = false;
      for (const subject of availableSubjects) {
        if (!capacity.get(subject)) continue;
        const task = subject.tasks.find((item) => item.remaining > 0);
        if (!task) continue;
        const sessionNumber = task.totalSessions - task.remaining + 1;
        schedule.push({ date: dateKey(date), subject: subject.name, topic: task.title, session: sessionNumber, totalSessions: task.totalSessions, minutes: Math.min(SESSION_MINUTES, task.estimate - (sessionNumber - 1) * SESSION_MINUTES) });
        task.remaining -= 1;
        capacity.set(subject, capacity.get(subject) - 1);
        placed = true;
      }
    }
  }

  const unfinished = subjects.flatMap((subject) => subject.tasks.filter((task) => task.remaining > 0).map((task) => ({ subject: subject.name, topic: task.title, remainingSessions: task.remaining })));
  return {
    sessionMinutes: SESSION_MINUTES,
    schedule,
    unfinished,
    subjectCount: subjects.length,
    totalSessions: schedule.length,
    studyMinutes: schedule.reduce((sum, session) => sum + session.minutes, 0),
  };
}

const DAY_MS = 86_400_000;
const MAX_PEOPLE = 12;
const MAX_CHORES = 48;
const MAX_WEEKS = 12;

function cleanLabel(value, max, kind) {
  const label = String(value ?? '').trim().replace(/\s+/gu, ' ');
  if (!label || label.length > max) throw new RangeError(`${kind} must contain 1 to ${max} characters.`);
  return label;
}

function parseDate(value) {
  const date = String(value ?? '');
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(date)) throw new TypeError('Enter a valid Monday start date.');
  const time = Date.parse(`${date}T00:00:00.000Z`);
  if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== date) throw new RangeError('Enter a valid calendar date.');
  if (new Date(time).getUTCDay() !== 1) throw new RangeError('The start date must be a Monday.');
  return date;
}

export function parseChorePeople(source) {
  const lines = String(source ?? '').split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (!lines.length || lines.length > MAX_PEOPLE) throw new RangeError(`Enter 1 to ${MAX_PEOPLE} household members, one per line.`);
  const seen = new Set();
  return lines.map((line, index) => {
    const name = cleanLabel(line, 60, `Member ${index + 1}`);
    const key = name.toLocaleLowerCase();
    if (seen.has(key)) throw new RangeError(`Member “${name}” is listed more than once.`);
    seen.add(key);
    return name;
  });
}

export function parseChores(source) {
  const lines = String(source ?? '').split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (!lines.length || lines.length > MAX_CHORES) throw new RangeError(`Enter 1 to ${MAX_CHORES} chores, one per line.`);
  const seen = new Set();
  return lines.map((line, index) => {
    const divider = line.lastIndexOf('|');
    const hasPoints = divider !== -1;
    const rawTitle = hasPoints ? line.slice(0, divider) : line;
    const rawPoints = hasPoints ? line.slice(divider + 1).trim() : '1';
    if (!/^[1-5]$/u.test(rawPoints)) throw new RangeError(`Chore ${index + 1} effort must be from 1 to 5.`);
    const title = cleanLabel(rawTitle, 100, `Chore ${index + 1}`);
    const key = title.toLocaleLowerCase();
    if (seen.has(key)) throw new RangeError(`Chore “${title}” is listed more than once.`);
    seen.add(key);
    return Object.freeze({ title, points: Number(rawPoints) });
  });
}

export function createChoreSchedule({ people: peopleSource, chores: choresSource, startDate: startInput, weeks: weeksInput = 1 } = {}) {
  const people = parseChorePeople(peopleSource);
  const chores = parseChores(choresSource);
  const startDate = parseDate(startInput);
  const weeks = Number(weeksInput);
  if (!Number.isInteger(weeks) || weeks < 1 || weeks > MAX_WEEKS) throw new RangeError(`Choose 1 to ${MAX_WEEKS} weeks.`);
  const cumulative = people.map(() => 0);
  const schedule = [];
  const orderedChores = [...chores].sort((a, b) => b.points - a.points || a.title.localeCompare(b.title));

  for (let week = 0; week < weeks; week += 1) {
    const weekly = people.map(() => 0);
    const assignments = orderedChores.map((chore, choreIndex) => {
      const rotation = (week + choreIndex) % people.length;
      let selected = rotation;
      for (let offset = 1; offset < people.length; offset += 1) {
        const candidate = (rotation + offset) % people.length;
        if (cumulative[candidate] < cumulative[selected]
          || (cumulative[candidate] === cumulative[selected] && weekly[candidate] < weekly[selected])) selected = candidate;
      }
      cumulative[selected] += chore.points;
      weekly[selected] += chore.points;
      return Object.freeze({ chore: chore.title, points: chore.points, person: people[selected] });
    });
    const monday = new Date(Date.parse(`${startDate}T00:00:00.000Z`) + week * 7 * DAY_MS).toISOString().slice(0, 10);
    schedule.push(Object.freeze({ week: week + 1, startDate: monday, assignments: Object.freeze(assignments) }));
  }

  const loads = Object.freeze(people.map((person, index) => Object.freeze({ person, points: cumulative[index] })));
  return Object.freeze({ schemaVersion: 1, people: Object.freeze(people), chores: Object.freeze(chores), weeks, schedule: Object.freeze(schedule), loads, loadSpread: Math.max(...cumulative) - Math.min(...cumulative) });
}

export function choreScheduleToCsv(schedule) {
  if (!schedule || schedule.schemaVersion !== 1 || !Array.isArray(schedule.schedule)) throw new TypeError('A valid chore schedule is required.');
  const cell = (value) => `"${String(value).replace(/"/gu, '""')}"`;
  return ['Week,Starts,Chore,Assigned to,Effort points', ...schedule.schedule.flatMap((week) => week.assignments.map((item) => [week.week, week.startDate, item.chore, item.person, item.points].map(cell).join(',')))].join('\r\n');
}

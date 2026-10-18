const dayMs = 86_400_000;
const dateValue = (value, name) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/u.test(value)) throw new TypeError(`${name} must be a calendar date.`);
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) throw new RangeError(`${name} is not a valid calendar date.`);
  return date;
};

/** A calendar-day prorating estimate; contract and absence rules are not adjudicated. */
export function estimateSwissVacationAccrual({ year, annualWeeks, workdaysPerWeek, employmentStart, employmentEnd, daysTaken }) {
  const y = Number(year);
  const weeks = Number(annualWeeks);
  const workdays = Number(workdaysPerWeek);
  const taken = Number(daysTaken);
  if (!Number.isInteger(y) || y < 1900 || y > 2100) throw new RangeError('Year must be between 1900 and 2100.');
  if (!Number.isFinite(weeks) || weeks < 4 || weeks > 12) throw new RangeError('Annual leave must be between 4 and 12 weeks.');
  if (!Number.isFinite(workdays) || workdays < 1 || workdays > 7) throw new RangeError('Scheduled workdays per week must be between 1 and 7.');
  if (!Number.isFinite(taken) || taken < 0 || taken > 366) throw new RangeError('Days already taken must be between 0 and 366.');
  const start = dateValue(employmentStart, 'Employment start');
  const end = dateValue(employmentEnd, 'Employment end');
  const yearStart = new Date(Date.UTC(y, 0, 1));
  const yearEnd = new Date(Date.UTC(y, 11, 31));
  if (start > end) throw new RangeError('Employment start must not follow employment end.');
  if (start.getUTCFullYear() > y || end.getUTCFullYear() < y) throw new RangeError('The employment period must overlap the selected leave year.');
  const first = Math.max(start.getTime(), yearStart.getTime());
  const last = Math.min(end.getTime(), yearEnd.getTime());
  const employedCalendarDays = Math.floor((last - first) / dayMs) + 1;
  const daysInYear = Math.floor((yearEnd.getTime() - yearStart.getTime()) / dayMs) + 1;
  const annualDays = weeks * workdays;
  const earnedDays = annualDays * employedCalendarDays / daysInYear;
  return Object.freeze({ year: y, annualWeeks: weeks, workdaysPerWeek: workdays, annualDays, employedCalendarDays, daysInYear, earnedDays, daysTaken: taken, remainingDays: earnedDays - taken });
}

const MAX_WEEKLY_PAY = 1_000_000_000;
const MAX_SERVICE_YEARS = 80;
const UK_RULES_START = '2026-04-06';
const UK_WEEKLY_CAP = 751;
const UK_SERVICE_CAP = 20;

function amount(value, name, max = MAX_WEEKLY_PAY) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > max) throw new RangeError(`${name} is outside the supported range.`);
  return number;
}

function isoDate(value, name) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/u.test(value)) throw new RangeError(`${name} must be a calendar date.`);
  const date = new Date(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) throw new RangeError(`${name} must be a real calendar date.`);
  return date;
}

function dateString(date) { return date.toISOString().slice(0, 10); }

function shiftCalendarYears(date, years) {
  const year = date.getUTCFullYear() + years;
  const month = date.getUTCMonth();
  const day = Math.min(date.getUTCDate(), new Date(Date.UTC(year, month + 1, 0)).getUTCDate());
  return new Date(Date.UTC(year, month, day));
}

function ageOn(birthDate, referenceDate) {
  let age = referenceDate.getUTCFullYear() - birthDate.getUTCFullYear();
  const birthdayThisYear = new Date(Date.UTC(referenceDate.getUTCFullYear(), birthDate.getUTCMonth(), Math.min(birthDate.getUTCDate(), new Date(Date.UTC(referenceDate.getUTCFullYear(), birthDate.getUTCMonth() + 1, 0)).getUTCDate())));
  if (referenceDate < birthdayThisYear) age -= 1;
  return age;
}

export function calculateSeverance({ mode = 'custom', weeklyPay, yearsOfService, weeksPerYear, birthDate, employmentStartDate, redundancyDate }) {
  if (!['custom', 'uk-statutory'].includes(mode)) throw new RangeError('Choose a supported calculation mode.');
  const weekly = amount(weeklyPay, 'Weekly pay');
  if (mode === 'custom') {
    const years = amount(yearsOfService, 'Years of service', MAX_SERVICE_YEARS);
    const weeks = amount(weeksPerYear, 'Weeks per service year', 52);
    return { mode, amount: weekly * years * weeks, weeklyPay: weekly, yearsOfService: years, weeksPerYear: weeks, totalWeeks: years * weeks, capped: false, eligible: true };
  }

  const birth = isoDate(birthDate, 'Birth date');
  const start = isoDate(employmentStartDate, 'Employment start date');
  const redundancy = isoDate(redundancyDate, 'Redundancy date');
  if (birth >= start || start >= redundancy) throw new RangeError('Birth, employment-start and redundancy dates must be in chronological order.');
  if (dateString(redundancy) < UK_RULES_START) throw new RangeError(`The selected UK rules only cover redundancy dates on or after ${UK_RULES_START}.`);

  const serviceYearStarts = [];
  for (let year = 1; year <= UK_SERVICE_CAP; year += 1) {
    const periodStart = shiftCalendarYears(redundancy, -year);
    if (periodStart < start) break;
    serviceYearStarts.push(periodStart);
  }
  const completedYears = serviceYearStarts.length;
  let totalWeeks = 0;
  for (const periodStart of serviceYearStarts) {
    // Section 162 reckons full service years backwards from the relevant date.
    // Using the older edge of each backward year keeps a partial higher-age
    // band from upgrading a year that was not wholly in that band.
    const ageForYear = ageOn(birth, periodStart);
    totalWeeks += ageForYear < 22 ? 0.5 : ageForYear < 41 ? 1 : 1.5;
  }
  const appliedWeeklyPay = Math.min(weekly, UK_WEEKLY_CAP);
  const eligible = completedYears >= 2;
  const uncappedAmount = eligible ? totalWeeks * appliedWeeklyPay : 0;
  return {
    mode,
    amount: Math.min(uncappedAmount, 30 * UK_WEEKLY_CAP),
    weeklyPay: weekly,
    appliedWeeklyPay,
    yearsOfService: completedYears,
    cappedServiceYears: completedYears === UK_SERVICE_CAP,
    totalWeeks,
    weeklyCap: UK_WEEKLY_CAP,
    capped: weekly > UK_WEEKLY_CAP || uncappedAmount > 30 * UK_WEEKLY_CAP,
    eligible,
    rulesAsOf: UK_RULES_START,
  };
}

const parseDate = (value, name) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/u.test(value)) throw new TypeError(`${name} must be a YYYY-MM-DD date.`);
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) throw new RangeError(`${name} is not a real calendar date.`);
  return date;
};
const iso = (date) => date.toISOString().slice(0, 10);
const weekday = (date) => date.getUTCDay() !== 0 && date.getUTCDay() !== 6;
const nextDate = (date) => new Date(date.getTime() + 86400000);
const validParents = new Set(['mother', 'otherParent']);
const validQuotas = new Set(['prenatal', 'mother', 'otherParent', 'shared']);
const addYears = (date, years) => {
  const targetYear = date.getUTCFullYear() + years;
  const month = date.getUTCMonth();
  const lastDay = new Date(Date.UTC(targetYear, month + 1, 0)).getUTCDate();
  return new Date(Date.UTC(targetYear, month, Math.min(date.getUTCDate(), lastDay)));
};

/**
 * Checks a user-authored Norwegian parental-benefit calendar against the standard
 * weekday quota table. Partial withdrawal is represented as its percentage of a
 * full weekday. Public holidays, activity exceptions and cross-border cases are
 * deliberately not inferred.
 */
export function validateNorwayParentalCalendar(entitlement, periods = []) {
  if (!entitlement || !['birth', 'adoption'].includes(entitlement.eventType) || !entitlement.total) throw new TypeError('A Norwegian NAV entitlement result is required.');
  if (!Array.isArray(periods) || periods.length > 30) throw new RangeError('Enter up to 30 calendar periods.');
  const quotas = {
    prenatal: entitlement.prenatal.benefitDays,
    mother: entitlement.motherQuota.benefitDays,
    otherParent: entitlement.otherParentQuota.benefitDays,
    shared: entitlement.shared.benefitDays,
  };
  const used = { prenatal: 0, mother: 0, otherParent: 0, shared: 0 };
  const dateUsage = new Map();
  const ids = new Set();
  const validThrough = addYears(parseDate(entitlement.eventDate, 'Birth/adoption date'), 3);
  const normalized = periods.map((period, index) => {
    if (!period || typeof period !== 'object') throw new TypeError(`Period ${index + 1} must be an object.`);
    const id = String(period.id ?? `period-${index + 1}`);
    const label = String(period.label ?? '').trim();
    if (!/^[\w-]{1,40}$/u.test(id) || label.length > 80) throw new RangeError(`Period ${index + 1} has an invalid ID or label.`);
    if (ids.has(id)) throw new RangeError(`Period ID ${id} is duplicated.`);
    ids.add(id);
    if (!validParents.has(period.parent)) throw new RangeError(`Period ${index + 1} must name a parent.`);
    if (!validQuotas.has(period.quota)) throw new RangeError(`Period ${index + 1} must select a NAV quota.`);
    const start = parseDate(period.startDate, `Period ${index + 1} start`);
    const end = parseDate(period.endDate, `Period ${index + 1} end`);
    if (end < start) throw new RangeError(`Period ${index + 1} ends before it starts.`);
    if (end > validThrough) throw new RangeError(`Period ${index + 1} ends after the three-year NAV window (${iso(validThrough)}).`);
    const pct = Number(period.withdrawalPct ?? 100);
    if (!Number.isInteger(pct) || pct < 1 || pct > 100) throw new RangeError(`Period ${index + 1} withdrawal must be an integer from 1 to 100 percent.`);
    if ((period.quota === 'prenatal' || period.quota === 'mother') && period.parent !== 'mother') throw new RangeError(`Period ${index + 1} uses a mother-only quota.`);
    if (period.quota === 'otherParent' && period.parent !== 'otherParent') throw new RangeError(`Period ${index + 1} uses the other parent's quota.`);
    if (period.quota === 'prenatal' && entitlement.eventType !== 'birth') throw new RangeError('Adoption plans do not have prenatal leave.');

    let weekdays = 0;
    for (let day = start; day <= end; day = nextDate(day)) {
      if (!weekday(day)) continue;
      weekdays++;
      const key = iso(day);
      const totalPct = (dateUsage.get(key) ?? 0) + pct;
      if (totalPct > 100) throw new RangeError(`Combined withdrawal exceeds 100 percent on ${key}.`);
      dateUsage.set(key, totalPct);
    }
    const benefitDays = weekdays * pct / 100;
    used[period.quota] += benefitDays;
    if (used[period.quota] > quotas[period.quota] + 1e-9) throw new RangeError(`The ${period.quota} quota is exceeded.`);
    return Object.freeze({ id, label, parent: period.parent, quota: period.quota, startDate: iso(start), endDate: iso(end), withdrawalPct: pct, weekdays, benefitDays });
  });
  const totalUsed = Object.values(used).reduce((sum, value) => sum + value, 0);
  if (totalUsed > entitlement.total.benefitDays + 1e-9) throw new RangeError('The total parental-benefit period is exceeded.');
  return Object.freeze({
    periods: Object.freeze(normalized),
    used: Object.freeze(used),
    remaining: Object.freeze(Object.fromEntries(Object.keys(quotas).map((key) => [key, Math.max(0, quotas[key] - used[key])]))),
    totalUsed,
    totalRemaining: entitlement.total.benefitDays - totalUsed,
    simultaneousWithdrawalMaxPct: Math.max(0, ...dateUsage.values()),
    usesWeekdaysOnly: true,
    ruleCheckedAt: entitlement.checkedAt,
  });
}

const escapeIcs = (value) => String(value).replace(/\\/gu, '\\\\').replace(/\r?\n/gu, '\\n').replace(/,/gu, '\\,').replace(/;/gu, '\\;');
const compact = (date) => date.replaceAll('-', '');

/** Creates an offline, all-day RFC 5545 calendar for validated user-authored periods. */
export function createNorwayParentalPlanIcs(validation, calendarName = 'Norway parental leave plan') {
  if (!validation || !Array.isArray(validation.periods)) throw new TypeError('Validate the calendar before exporting it.');
  const events = validation.periods.map((period) => {
    const exclusiveEnd = iso(nextDate(parseDate(period.endDate, 'Period end')));
    const summary = period.label || `${period.parent} · ${period.quota} · ${period.withdrawalPct}%`;
    return [
      'BEGIN:VEVENT',
      `UID:${period.id}@usefulverse.local`,
      `DTSTART;VALUE=DATE:${compact(period.startDate)}`,
      `DTEND;VALUE=DATE:${compact(exclusiveEnd)}`,
      `SUMMARY:${escapeIcs(summary)}`,
      `DESCRIPTION:${escapeIcs(`Norway planning scenario · ${period.parent} · ${period.quota} quota · ${period.withdrawalPct}% withdrawal. Check current NAV rules.`)}`,
      'END:VEVENT',
    ].join('\r\n');
  });
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//UsefulVerse//Norway parental plan//EN', `X-WR-CALNAME:${escapeIcs(calendarName)}`, ...events, 'END:VCALENDAR', ''].join('\r\n');
}


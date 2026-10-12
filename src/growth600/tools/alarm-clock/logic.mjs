const MAX_SCHEDULE_MS = 7 * 24 * 60 * 60 * 1_000;
const SNOOZE_MS = 5 * 60 * 1_000;

export function parseLocalAlarmDateTime(value, now = Date.now()) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(String(value));
  if (!match) throw new RangeError('Choose a local date and time.');
  const [, year, month, day, hour, minute] = match.map(Number);
  const target = new Date(year, month - 1, day, hour, minute, 0, 0);
  if (target.getFullYear() !== year || target.getMonth() !== month - 1 || target.getDate() !== day || target.getHours() !== hour || target.getMinutes() !== minute) {
    throw new RangeError('That local time does not exist. Choose another time.');
  }
  const timestamp = target.getTime();
  if (!Number.isFinite(now) || !Number.isFinite(timestamp) || timestamp <= now) throw new RangeError('Choose a future time.');
  if (timestamp - now > MAX_SCHEDULE_MS) throw new RangeError('Choose a time within the next seven days.');
  return timestamp;
}

export function alarmStateAt(target, now = Date.now()) {
  const timestamp = Number(target);
  const current = Number(now);
  if (!Number.isFinite(timestamp) || !Number.isFinite(current) || timestamp < 0 || current < 0) throw new RangeError('Alarm timestamps must be finite non-negative milliseconds.');
  const remainingMs = Math.max(0, timestamp - current);
  return Object.freeze({ phase: remainingMs === 0 ? 'ringing' : 'waiting', remainingMs, remainingSeconds: Math.ceil(remainingMs / 1_000) });
}

export function snoozedAlarmTarget(now = Date.now()) {
  const current = Number(now);
  if (!Number.isFinite(current) || current < 0) throw new RangeError('Current time must be finite non-negative milliseconds.');
  return current + SNOOZE_MS;
}

export function localDateTimeInputValue(date = new Date()) {
  const pad = (number) => String(number).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export const ALARM_CLOCK_LIMITS = Object.freeze({ maxScheduleMs: MAX_SCHEDULE_MS, snoozeMs: SNOOZE_MS });

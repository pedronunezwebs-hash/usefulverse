const MINUTES_PER_DAY = 24 * 60;

function validClock(value) {
  if (typeof value !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/u.test(value)) throw new RangeError('Enter a valid 24-hour time.');
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

function clockText(totalMinutes) {
  const minute = ((totalMinutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return String(Math.floor(minute / 60)).padStart(2, '0') + ':' + String(minute % 60).padStart(2, '0');
}

export function calculateSleepTime({ time, durationHours, durationMinutes = 0, latencyMinutes = 15, direction = 'bedtime' }) {
  const anchor = validClock(time);
  if (!Number.isFinite(durationHours) || durationHours < 1 || durationHours > 16) throw new RangeError('Sleep duration must be from 1 to 16 hours.');
  if (!Number.isInteger(durationMinutes) || ![0, 15, 30, 45].includes(durationMinutes)) throw new RangeError('Additional sleep minutes must be 0, 15, 30, or 45.');
  if (!Number.isInteger(latencyMinutes) || latencyMinutes < 0 || latencyMinutes > 180) throw new RangeError('Time to fall asleep must be from 0 to 180 minutes.');
  if (durationHours * 60 + durationMinutes > 960) throw new RangeError('Sleep duration cannot exceed 16 hours.');
  if (!['bedtime', 'wake'].includes(direction)) throw new RangeError('Choose bedtime or wake-up time.');
  const total = durationHours * 60 + durationMinutes + latencyMinutes;
  const raw = direction === 'bedtime' ? anchor - total : anchor + total;
  const dayOffset = direction === 'bedtime' ? Math.floor(raw / MINUTES_PER_DAY) : Math.floor(raw / MINUTES_PER_DAY);
  return Object.freeze({ time: clockText(raw), dayOffset, direction, sleepMinutes: durationHours * 60 + durationMinutes, latencyMinutes });
}

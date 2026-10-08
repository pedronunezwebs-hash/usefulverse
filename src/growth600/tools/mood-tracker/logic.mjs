export const MAX_MOOD_ENTRIES = 730;
export const MAX_MOOD_NOTE_LENGTH = 500;
export const MOOD_TAGS = Object.freeze(['calm', 'anxious', 'sad', 'happy', 'tired', 'focused', 'stressed', 'hopeful', 'grateful', 'angry']);

function parseDate(value) {
  const text = String(value ?? '');
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(text)) throw new RangeError('Enter a valid calendar date.');
  const date = new Date(`${text}T00:00:00.000Z`);
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== text || Number(text.slice(0, 4)) < 1900 || Number(text.slice(0, 4)) > 2100) throw new RangeError('Enter a valid calendar date.');
  return date;
}

function cleanEntry(value) {
  const date = parseDate(value?.date).toISOString().slice(0, 10);
  const mood = Number(value?.mood);
  if (!Number.isInteger(mood) || mood < 1 || mood > 5) throw new RangeError('Mood must be a whole number from 1 to 5.');
  const tags = [...new Set(Array.isArray(value?.tags) ? value.tags.map(String) : [])];
  if (tags.length > MOOD_TAGS.length || tags.some((tag) => !MOOD_TAGS.includes(tag))) throw new RangeError('Choose supported mood tags.');
  const note = String(value?.note ?? '').trim();
  if (note.length > MAX_MOOD_NOTE_LENGTH) throw new RangeError(`A note can contain at most ${MAX_MOOD_NOTE_LENGTH} characters.`);
  return Object.freeze({ date, mood, tags: Object.freeze(tags), note });
}

export function createMoodEntry(value) {
  return cleanEntry(value);
}

export function upsertMoodEntry(entries, value) {
  if (!Array.isArray(entries)) throw new TypeError('A mood-entry list is required.');
  const clean = entries.map(cleanEntry);
  const entry = cleanEntry(value);
  const index = clean.findIndex(({ date }) => date === entry.date);
  if (index >= 0) clean[index] = entry;
  else clean.push(entry);
  if (clean.length > MAX_MOOD_ENTRIES) throw new RangeError(`A log can contain at most ${MAX_MOOD_ENTRIES} days.`);
  return Object.freeze(clean.sort((a, b) => a.date.localeCompare(b.date)));
}

export function removeMoodEntry(entries, date) {
  if (!Array.isArray(entries)) throw new TypeError('A mood-entry list is required.');
  const key = parseDate(date).toISOString().slice(0, 10);
  return Object.freeze(entries.map(cleanEntry).filter((entry) => entry.date !== key).sort((a, b) => a.date.localeCompare(b.date)));
}

export function restoreMoodLog(value) {
  if (!value || value.schemaVersion !== 1 || !Array.isArray(value.entries) || value.entries.length > MAX_MOOD_ENTRIES) throw new TypeError('This is not a supported mood-log backup.');
  const entries = value.entries.map(cleanEntry).sort((a, b) => a.date.localeCompare(b.date));
  if (new Set(entries.map(({ date }) => date)).size !== entries.length) throw new TypeError('A backup cannot contain duplicate dates.');
  return Object.freeze({ schemaVersion: 1, entries: Object.freeze(entries) });
}

export function getMoodCalendar(entries, year, month) {
  if (!Number.isInteger(year) || year < 1900 || year > 2100 || !Number.isInteger(month) || month < 0 || month > 11) throw new RangeError('Choose a supported month.');
  const byDate = new Map(entries.map(cleanEntry).map((entry) => [entry.date, entry]));
  const first = new Date(Date.UTC(year, month, 1));
  const offset = first.getUTCDay();
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cellCount = Math.ceil((offset + days) / 7) * 7;
  return Object.freeze(Array.from({ length: cellCount }, (_, index) => {
    const day = index - offset + 1;
    if (day < 1 || day > days) return null;
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return Object.freeze({ date, day, entry: byDate.get(date) ?? null });
  }));
}

export function getMoodSummary(entries, endDate) {
  const end = parseDate(endDate);
  const start = new Date(end.valueOf() - 6 * 86_400_000);
  const recent = entries.map(cleanEntry).filter(({ date }) => {
    const value = parseDate(date);
    return value >= start && value <= end;
  });
  const distribution = [1, 2, 3, 4, 5].map((mood) => recent.filter((entry) => entry.mood === mood).length);
  return Object.freeze({
    count: recent.length,
    average: recent.length ? recent.reduce((sum, entry) => sum + entry.mood, 0) / recent.length : null,
    distribution: Object.freeze(distribution),
    entries: Object.freeze(recent.sort((a, b) => a.date.localeCompare(b.date))),
  });
}

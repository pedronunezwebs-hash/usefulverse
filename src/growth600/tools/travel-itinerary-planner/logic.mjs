const MAX_TITLE = 140;
const MAX_ITEMS = 250;
const MAX_NOTE = 2_000;
const MAX_TRIP_DAYS = 366;
export const MAX_ITINERARY_BACKUP_BYTES = 1_000_000;
const DAY_MS = 86_400_000;
const CATEGORIES = new Set(['activity', 'meal', 'transport', 'stay', 'reservation', 'other']);

function text(value, label, max, optional = false) {
  const result = String(value ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/gu, '').trim();
  if (!optional && !result) throw new TypeError(`${label} is required.`);
  if (result.length > max) throw new RangeError(`${label} must be ${max} characters or fewer.`);
  return result;
}

function date(value, label) {
  const result = String(value ?? '');
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(result)) throw new TypeError(`${label} must use YYYY-MM-DD.`);
  const parsed = new Date(`${result}T00:00:00.000Z`);
  if (!Number.isFinite(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== result) throw new RangeError(`${label} is not a valid date.`);
  if (Number(result.slice(0, 4)) < 1900 || Number(result.slice(0, 4)) > 2100) throw new RangeError(`${label} must be between 1900 and 2100.`);
  return result;
}

function time(value, label) {
  const result = String(value ?? '');
  if (!/^([01]\d|2[0-3]):[0-5]\d$/u.test(result)) throw new TypeError(`${label} must use 24-hour HH:MM time.`);
  return result;
}

function minutes(value) { const [hours, mins] = value.split(':').map(Number); return hours * 60 + mins; }
function dayNumber(value) { return Date.parse(`${value}T00:00:00.000Z`) / DAY_MS; }

function normalizeItem(item, plan) {
  const id = text(item?.id, 'Item ID', 80);
  if (!/^[\w-]+$/u.test(id)) throw new TypeError('Item ID contains unsupported characters.');
  const itemDate = date(item?.date, 'Item date');
  const startTime = time(item?.startTime, 'Start time');
  const endTime = time(item?.endTime, 'End time');
  if (itemDate < plan.startDate || itemDate > plan.endDate) throw new RangeError('Every item must fall within the trip dates.');
  if (minutes(endTime) <= minutes(startTime)) throw new RangeError('End time must be later than start time on the same date. Overnight items are not supported.');
  const category = String(item?.category ?? 'other');
  if (!CATEGORIES.has(category)) throw new RangeError('Choose a supported itinerary category.');
  return Object.freeze({
    id,
    date: itemDate,
    startTime,
    endTime,
    title: text(item?.title, 'Item title', MAX_TITLE),
    category,
    location: text(item?.location, 'Location', 180, true),
    reservation: text(item?.reservation, 'Reservation details', 180, true),
    notes: text(item?.notes, 'Notes', MAX_NOTE, true),
  });
}

export function createTravelPlan({ title, startDate: startInput, endDate: endInput, bufferMinutes = 0, items = [] } = {}) {
  const normalizedTitle = text(title, 'Trip name', MAX_TITLE);
  const startDate = date(startInput, 'Trip start date');
  const endDate = date(endInput, 'Trip end date');
  if (endDate < startDate) throw new RangeError('Trip end date must be on or after its start date.');
  const days = dayNumber(endDate) - dayNumber(startDate) + 1;
  if (days > MAX_TRIP_DAYS) throw new RangeError(`A trip can cover no more than ${MAX_TRIP_DAYS} days.`);
  const buffer = Number(bufferMinutes);
  if (!Number.isInteger(buffer) || buffer < 0 || buffer > 240) throw new RangeError('Connection buffer must be a whole number from 0 to 240 minutes.');
  if (!Array.isArray(items) || items.length > MAX_ITEMS) throw new RangeError(`Use no more than ${MAX_ITEMS} itinerary items.`);
  const base = { schemaVersion: 1, title: normalizedTitle, startDate, endDate, bufferMinutes: buffer };
  const normalizedItems = items.map((item) => normalizeItem(item, base));
  if (new Set(normalizedItems.map(({ id }) => id)).size !== normalizedItems.length) throw new RangeError('Itinerary item IDs must be unique.');
  return Object.freeze({ ...base, items: Object.freeze(sortItineraryItems(normalizedItems)) });
}

export function sortItineraryItems(items) {
  return [...items].sort((left, right) => left.date.localeCompare(right.date) || left.startTime.localeCompare(right.startTime) || left.endTime.localeCompare(right.endTime) || left.id.localeCompare(right.id));
}

export function upsertItineraryItem(plan, item) {
  if (!plan || plan.schemaVersion !== 1 || !Array.isArray(plan.items)) throw new TypeError('A valid itinerary is required.');
  const normalized = normalizeItem(item, plan);
  const exists = plan.items.some(({ id }) => id === normalized.id);
  if (!exists && plan.items.length >= MAX_ITEMS) throw new RangeError(`Use no more than ${MAX_ITEMS} itinerary items.`);
  const items = [...plan.items.filter(({ id }) => id !== normalized.id), normalized];
  return createTravelPlan({ ...plan, items });
}

export function removeItineraryItem(plan, id) {
  if (!plan || plan.schemaVersion !== 1 || !Array.isArray(plan.items)) throw new TypeError('A valid itinerary is required.');
  return createTravelPlan({ ...plan, items: plan.items.filter((item) => item.id !== id) });
}

export function analyzeItinerary(plan) {
  if (!plan || plan.schemaVersion !== 1 || !Array.isArray(plan.items)) throw new TypeError('A valid itinerary is required.');
  const items = sortItineraryItems(plan.items);
  const overlaps = [];
  const shortConnections = [];
  for (let index = 0; index < items.length; index += 1) {
    const current = items[index];
    const start = minutes(current.startTime);
    let nearestPriorFinish = null;
    for (let previousIndex = index - 1; previousIndex >= 0; previousIndex -= 1) {
      const previous = items[previousIndex];
      if (previous.date !== current.date) break;
      const finish = minutes(previous.endTime);
      if (finish > start) {
        overlaps.push(Object.freeze({ firstId: previous.id, secondId: current.id, overlapMinutes: finish - start }));
      } else if (!nearestPriorFinish || finish > nearestPriorFinish.finish) {
        nearestPriorFinish = { item: previous, finish };
      }
    }
    if (nearestPriorFinish && plan.bufferMinutes > 0) {
      const gap = start - nearestPriorFinish.finish;
      if (gap < plan.bufferMinutes) shortConnections.push(Object.freeze({ firstId: nearestPriorFinish.item.id, secondId: current.id, gapMinutes: gap, neededMinutes: plan.bufferMinutes }));
    }
  }
  return Object.freeze({ overlaps: Object.freeze(overlaps), shortConnections: Object.freeze(shortConnections) });
}

export function serializeItineraryBackup(plan) {
  const normalized = restoreItineraryPlan(plan);
  const result = JSON.stringify(normalized, null, 2);
  if (new TextEncoder().encode(result).byteLength > MAX_ITINERARY_BACKUP_BYTES) throw new RangeError('Itinerary backup exceeds 1 MB.');
  return result;
}

export function restoreItineraryPlan(value) {
  if (!value || value.schemaVersion !== 1 || !Array.isArray(value.items)) throw new TypeError('This is not a supported itinerary backup.');
  return createTravelPlan(value);
}

function icsEscape(value) {
  return String(value ?? '')
    .replace(/\\/gu, '\\\\')
    .replace(/\r\n|\r|\n/gu, '\\n')
    .replace(/([,;])/gu, '\\$1')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/gu, '');
}

function foldIcsLine(line) {
  const chunks = [];
  let chunk = '';
  let bytes = 0;
  for (const character of line) {
    const size = new TextEncoder().encode(character).byteLength;
    if (bytes + size > 75) { chunks.push(chunk); chunk = ` ${character}`; bytes = 1 + size; }
    else { chunk += character; bytes += size; }
  }
  chunks.push(chunk);
  return chunks.join('\r\n');
}

export function buildItineraryIcs(plan, now = new Date()) {
  const normalized = restoreItineraryPlan(plan);
  if (!(now instanceof Date) || !Number.isFinite(now.valueOf())) throw new TypeError('A valid export timestamp is required.');
  const stamp = now.toISOString().replaceAll('-', '').replaceAll(':', '').replace(/\.\d{3}/u, '');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//UsefulVerse//Travel Itinerary//EN',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', `X-WR-CALNAME:${icsEscape(normalized.title)}`,
  ];
  for (const item of sortItineraryItems(normalized.items)) {
    const base = item.date.replaceAll('-', '');
    const start = `${base}T${item.startTime.replace(':', '')}00`;
    const end = `${base}T${item.endTime.replace(':', '')}00`;
    lines.push(
      'BEGIN:VEVENT', `UID:${icsEscape(item.id)}@usefulverse.com`, `DTSTAMP:${stamp}`,
      `DTSTART:${start}`, `DTEND:${end}`, `SUMMARY:${icsEscape(item.title)}`,
      `CATEGORIES:${icsEscape(item.category)}`,
    );
    if (item.location) lines.push(`LOCATION:${icsEscape(item.location)}`);
    const description = [item.reservation ? `Reservation: ${item.reservation}` : '', item.notes].filter(Boolean).join('\n');
    if (description) lines.push(`DESCRIPTION:${icsEscape(description)}`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR', '');
  return lines.map(foldIcsLine).join('\r\n');
}

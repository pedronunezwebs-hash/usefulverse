export const WEEK_DAYS = Object.freeze(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
export const WEEKLY_PLANNER_LIMITS = Object.freeze({ maxBlocks: 100, maxTitleLength: 120, maxDurationMinutes: 1_080, schemaVersion: 1 });
const CATEGORIES = new Set(['work', 'personal', 'study', 'health', 'other']);
const MINUTES_PER_DAY = 1_440;
const MINUTES_PER_WEEK = MINUTES_PER_DAY * 7;

function clockMinutes(value) {
  const match = /^(\d{2}):(\d{2})$/u.exec(String(value ?? ''));
  if (!match) throw new RangeError('Enter a valid 24-hour time.');
  const hour = Number(match[1]); const minute = Number(match[2]);
  if (hour > 23 || minute > 59) throw new RangeError('Enter a valid 24-hour time.');
  return hour * 60 + minute;
}

export function createWeeklyBlock(input, id) {
  const day = Number(input?.day);
  const title = String(input?.title ?? '').trim();
  const category = String(input?.category ?? 'other');
  if (!Number.isInteger(day) || day < 0 || day > 6) throw new RangeError('Choose a day of the week.');
  if (!title || title.length > WEEKLY_PLANNER_LIMITS.maxTitleLength) throw new RangeError('Enter a title within the supported length.');
  if (!CATEGORIES.has(category)) throw new RangeError('Choose a supported block category.');
  const startMinutes = clockMinutes(input?.start);
  const endMinutes = clockMinutes(input?.end);
  const durationMinutes = (endMinutes - startMinutes + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  if (durationMinutes === 0 || durationMinutes > WEEKLY_PLANNER_LIMITS.maxDurationMinutes) throw new RangeError('A block must last from 1 minute to 18 hours.');
  const safeId = String(id ?? input?.id ?? '').trim();
  if (!safeId || safeId.length > 80) throw new RangeError('A valid block ID is required.');
  return Object.freeze({ id: safeId, day, title, category, start: input.start, end: input.end, startMinutes, endMinutes, durationMinutes, overnight: endMinutes <= startMinutes });
}

export function addWeeklyBlock(blocks, input) {
  if (!Array.isArray(blocks) || blocks.length >= WEEKLY_PLANNER_LIMITS.maxBlocks) throw new RangeError('Keep up to 100 weekly blocks.');
  const ids = new Set(blocks.map((block) => block.id));
  let sequence = blocks.length + 1;
  while (ids.has(`block-${sequence}`)) sequence += 1;
  return Object.freeze([...blocks, createWeeklyBlock(input, `block-${sequence}`)]);
}

export function removeWeeklyBlock(blocks, id) {
  if (!Array.isArray(blocks)) throw new TypeError('A block list is required.');
  return Object.freeze(blocks.filter((block) => block.id !== id));
}

function daySegments(block) {
  const absoluteStart = block.day * MINUTES_PER_DAY + block.startMinutes;
  const absoluteEnd = absoluteStart + block.durationMinutes;
  const segments = [];
  for (const shift of [-MINUTES_PER_WEEK, 0, MINUTES_PER_WEEK]) {
    const start = absoluteStart + shift;
    const end = absoluteEnd + shift;
    const firstDay = Math.floor(start / MINUTES_PER_DAY);
    const lastDay = Math.floor((end - 1) / MINUTES_PER_DAY);
    for (let day = firstDay; day <= lastDay; day += 1) {
      const dayStart = day * MINUTES_PER_DAY;
      const segmentStart = Math.max(start, dayStart) - dayStart;
      const segmentEnd = Math.min(end, dayStart + MINUTES_PER_DAY) - dayStart;
      if (segmentEnd > segmentStart) segments.push({ day: (day + 7) % 7, start: segmentStart, end: segmentEnd });
    }
  }
  return segments;
}

export function findWeeklyOverlaps(blocks) {
  if (!Array.isArray(blocks)) throw new TypeError('A block list is required.');
  const overlaps = new Map();
  const segments = blocks.map((block) => ({ block, segments: daySegments(block) }));
  for (let left = 0; left < segments.length; left += 1) {
    for (let right = left + 1; right < segments.length; right += 1) {
      for (const first of segments[left].segments) for (const second of segments[right].segments) {
        if (first.day !== second.day || first.start >= second.end || second.start >= first.end) continue;
        const ids = [segments[left].block.id, segments[right].block.id].sort();
        const key = `${ids.join('|')}:${first.day}`;
        overlaps.set(key, Object.freeze({ blockIds: Object.freeze(ids), day: first.day, start: Math.max(first.start, second.start), end: Math.min(first.end, second.end) }));
      }
    }
  }
  return Object.freeze([...overlaps.values()].sort((a, b) => a.day - b.day || a.start - b.start));
}

export function exportWeeklyPlan(blocks) {
  if (!Array.isArray(blocks) || blocks.length > WEEKLY_PLANNER_LIMITS.maxBlocks) throw new RangeError('Invalid weekly plan.');
  const checked = blocks.map((block) => createWeeklyBlock(block, block.id));
  if (new Set(checked.map((block) => block.id)).size !== checked.length) throw new RangeError('Block IDs must be unique.');
  return JSON.stringify({ schema: 'usefulverse-weekly-plan', version: WEEKLY_PLANNER_LIMITS.schemaVersion, blocks: checked.map(({ id, day, title, category, start, end }) => ({ id, day, title, category, start, end })) }, null, 2);
}

export function importWeeklyPlan(text) {
  if (typeof text !== 'string' || text.length > 100_000) throw new RangeError('The backup file is too large.');
  let data;
  try { data = JSON.parse(text); } catch { throw new SyntaxError('The backup is not valid JSON.'); }
  if (data?.schema !== 'usefulverse-weekly-plan' || data?.version !== WEEKLY_PLANNER_LIMITS.schemaVersion || !Array.isArray(data.blocks) || data.blocks.length > WEEKLY_PLANNER_LIMITS.maxBlocks) throw new RangeError('This is not a supported weekly plan backup.');
  const blocks = data.blocks.map((block) => createWeeklyBlock(block, block.id));
  if (new Set(blocks.map((block) => block.id)).size !== blocks.length) throw new RangeError('Block IDs must be unique.');
  return Object.freeze(blocks);
}

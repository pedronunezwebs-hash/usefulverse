const DAY_MS = 86_400_000;

export function parseIsoDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(String(value));
  if (!match) throw new TypeError('Enter a valid calendar date.');
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) throw new TypeError('Enter a valid calendar date.');
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) throw new TypeError('Enter a valid calendar date.');
  return date;
}

export function formatIsoDate(date) {
  const year = String(date.getUTCFullYear()).padStart(4, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addCalendarDays(dateValue, amount) {
  const date = parseIsoDate(dateValue);
  if (!Number.isInteger(amount) || Math.abs(amount) > 3_652_425) throw new RangeError('Use a whole-number date offset within 10,000 years.');
  date.setUTCDate(date.getUTCDate() + amount);
  return formatIsoDate(date);
}

const isLeapYear = (year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

function birthdayInYear(birth, year, leapDayPolicy) {
  if (birth.getUTCMonth() === 1 && birth.getUTCDate() === 29 && !isLeapYear(year)) {
    if (leapDayPolicy === 'march1') return parseIsoDate(`${year}-03-01`);
    if (leapDayPolicy !== 'feb28') throw new TypeError('Choose February 28 or March 1 for a non-leap-year birthday.');
    return parseIsoDate(`${year}-02-28`);
  }
  return parseIsoDate(`${year}-${String(birth.getUTCMonth() + 1).padStart(2, '0')}-${String(birth.getUTCDate()).padStart(2, '0')}`);
}

function addCalendarMonths(date, amount) {
  const monthIndex = date.getUTCMonth() + amount;
  const year = date.getUTCFullYear() + Math.floor(monthIndex / 12);
  const month = ((monthIndex % 12) + 12) % 12;
  const monthEnd = new Date(0);
  monthEnd.setUTCHours(0, 0, 0, 0);
  monthEnd.setUTCFullYear(year, month + 1, 0);
  const lastDay = monthEnd.getUTCDate();
  const result = new Date(0);
  result.setUTCHours(0, 0, 0, 0);
  result.setUTCFullYear(year, month, Math.min(date.getUTCDate(), lastDay));
  return result;
}

export function calculateAge(birthValue, asOfValue, leapDayPolicy = 'feb28') {
  const birth = parseIsoDate(birthValue);
  const asOf = parseIsoDate(asOfValue);
  if (asOf < birth) throw new RangeError('The calculation date cannot be before the birth date.');

  let years = asOf.getUTCFullYear() - birth.getUTCFullYear();
  if (birthdayInYear(birth, asOf.getUTCFullYear(), leapDayPolicy) > asOf) years -= 1;
  let anchor = birthdayInYear(birth, birth.getUTCFullYear() + years, leapDayPolicy);
  let months = (asOf.getUTCFullYear() - anchor.getUTCFullYear()) * 12 + asOf.getUTCMonth() - anchor.getUTCMonth();
  let monthAnchor = addCalendarMonths(anchor, months);
  while (months > 0 && (monthAnchor > asOf || months >= 12)) {
    months -= 1;
    monthAnchor = addCalendarMonths(anchor, months);
  }
  const days = Math.round((asOf - monthAnchor) / DAY_MS);
  return {
    years,
    months,
    days,
    totalDays: Math.round((asOf - birth) / DAY_MS),
    nextBirthday: formatIsoDate(birthdayInYear(birth, asOf.getUTCFullYear() + (birthdayInYear(birth, asOf.getUTCFullYear(), leapDayPolicy) < asOf ? 1 : 0), leapDayPolicy)),
  };
}

const asDateSet = (values = []) => new Set([...values].map((value) => formatIsoDate(parseIsoDate(value))));

function isWorkday(date, weekendDays, holidays) {
  return !weekendDays.has(date.getUTCDay()) && !holidays.has(formatIsoDate(date));
}

function normalizeWorkCalendar(weekendDays, holidayDates) {
  const weekend = new Set([...weekendDays].map(Number));
  if ([...weekend].some((day) => !Number.isInteger(day) || day < 0 || day > 6)) throw new RangeError('Choose valid days of the week.');
  if (weekend.size === 7) throw new RangeError('At least one day must remain a working day.');
  return { weekend, holidays: asDateSet(holidayDates) };
}

export function countBusinessDays(startValue, endValue, weekendDays = [0, 6], holidayDates = [], inclusive = true) {
  const start = parseIsoDate(startValue);
  const end = parseIsoDate(endValue);
  if (end < start) throw new RangeError('The end date must be on or after the start date.');
  const interval = Math.round((end - start) / DAY_MS);
  if (interval > 365_250) throw new RangeError('Choose a date range of 1,000 years or less.');
  const { weekend, holidays } = normalizeWorkCalendar(weekendDays, holidayDates);
  let count = 0;
  const cursor = new Date(start);
  if (!inclusive) cursor.setUTCDate(cursor.getUTCDate() + 1);
  for (; cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) if (isWorkday(cursor, weekend, holidays)) count += 1;
  return count;
}

export function addBusinessDays(startValue, amount, weekendDays = [0, 6], holidayDates = []) {
  const start = parseIsoDate(startValue);
  if (!Number.isInteger(amount) || Math.abs(amount) > 100_000) throw new RangeError('Enter a whole number from −100,000 to 100,000.');
  const { weekend, holidays } = normalizeWorkCalendar(weekendDays, holidayDates);
  if (amount === 0) return formatIsoDate(start);
  const direction = Math.sign(amount);
  let remaining = Math.abs(amount);
  const cursor = new Date(start);
  while (remaining > 0) {
    cursor.setUTCDate(cursor.getUTCDate() + direction);
    if (isWorkday(cursor, weekend, holidays)) remaining -= 1;
  }
  return formatIsoDate(cursor);
}

export function calculateWeightedAverage(rows) {
  if (!Array.isArray(rows) || !rows.length) throw new RangeError('Add at least one value and weight.');
  let weightedSum = 0;
  let totalWeight = 0;
  const values = [];
  for (const [index, row] of rows.entries()) {
    const value = Number(row.value);
    const weight = Number(row.weight);
    if (!Number.isFinite(value) || !Number.isFinite(weight) || weight < 0) throw new TypeError(`Row ${index + 1}: enter a valid value and a non-negative weight.`);
    weightedSum += value * weight;
    totalWeight += weight;
    values.push(value);
  }
  if (totalWeight <= 0 || !Number.isFinite(weightedSum)) throw new RangeError('The total weight must be greater than zero.');
  return { average: weightedSum / totalWeight, weightedSum, totalWeight, count: rows.length, min: Math.min(...values), max: Math.max(...values) };
}

export function removeDuplicateLines(text, { trim = true, ignoreCase = false, removeEmpty = true, locale = 'en' } = {}) {
  const seen = new Set();
  const lines = [];
  let removed = 0;
  for (const original of String(text).split(/\r?\n/u)) {
    const line = trim ? original.trim() : original;
    if (removeEmpty && line === '') continue;
    const key = ignoreCase ? line.toLocaleLowerCase(locale) : line;
    if (seen.has(key)) { removed += 1; continue; }
    seen.add(key);
    lines.push(line);
  }
  return { lines, removed };
}

export function toRomanNumeral(value) {
  if (!Number.isInteger(value) || value < 1 || value > 3999) throw new RangeError('Roman numerals support whole numbers from 1 to 3,999.');
  const digits = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let remainder = value;
  let result = '';
  for (const [number, glyph] of digits) while (remainder >= number) { result += glyph; remainder -= number; }
  return result;
}

export function romanDate(dateValue, order = 'dmy', separator = '/') {
  const date = parseIsoDate(dateValue);
  const values = { d: date.getUTCDate(), m: date.getUTCMonth() + 1, y: date.getUTCFullYear() };
  if (!['dmy', 'mdy', 'ymd'].includes(order)) throw new TypeError('Choose a supported date order.');
  return [...order].map((part) => toRomanNumeral(values[part])).join(separator);
}

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    table[index] = value >>> 0;
  }
  return table;
})();

export function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

export function buildIco(pngImages) {
  if (!Array.isArray(pngImages) || !pngImages.length || pngImages.length > 16) throw new RangeError('Add between 1 and 16 PNG icon sizes.');
  const headerSize = 6 + pngImages.length * 16;
  const totalSize = headerSize + pngImages.reduce((sum, image) => sum + image.bytes.byteLength, 0);
  if (totalSize > 0xffffffff) throw new RangeError('The icon file is too large.');
  const result = new Uint8Array(totalSize);
  const view = new DataView(result.buffer);
  view.setUint16(2, 1, true);
  view.setUint16(4, pngImages.length, true);
  let offset = headerSize;
  pngImages.forEach(({ size, bytes }, index) => {
    if (!(bytes instanceof Uint8Array) || bytes[0] !== 0x89 || bytes[1] !== 0x50 || bytes[2] !== 0x4e || bytes[3] !== 0x47) throw new TypeError('An icon size is not a PNG image.');
    const entry = 6 + index * 16;
    result[entry] = size === 256 ? 0 : size;
    result[entry + 1] = size === 256 ? 0 : size;
    view.setUint16(entry + 4, 1, true);
    view.setUint16(entry + 6, 32, true);
    view.setUint32(entry + 8, bytes.byteLength, true);
    view.setUint32(entry + 12, offset, true);
    result.set(bytes, offset);
    offset += bytes.byteLength;
  });
  return result;
}

async function asBytes(value) {
  if (typeof value === 'string') return new TextEncoder().encode(value);
  if (value instanceof Uint8Array) return value;
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (value instanceof Blob) return new Uint8Array(await value.arrayBuffer());
  throw new TypeError('ZIP entries must be text, bytes or Blob files.');
}

export async function buildZip(files) {
  if (!Array.isArray(files) || !files.length || files.length > 200) throw new RangeError('Choose between 1 and 200 files for the ZIP archive.');
  const encoder = new TextEncoder();
  const entries = [];
  let localSize = 0;
  for (const file of files) {
    const name = encoder.encode(String(file.name));
    const data = await asBytes(file.data);
    if (!name.length || name.length > 65_535 || data.length > 0xffffffff) throw new RangeError('A ZIP file name or file is too large.');
    const crc = crc32(data);
    entries.push({ name, data, crc, offset: localSize });
    localSize += 30 + name.length + data.length;
    if (localSize > 0xffffffff) throw new RangeError('The ZIP archive is too large to create safely.');
  }
  const centralSize = entries.reduce((sum, entry) => sum + 46 + entry.name.length, 0);
  const totalSize = localSize + centralSize + 22;
  if (totalSize > 0xffffffff) throw new RangeError('The ZIP archive is too large to create safely.');
  const output = new Uint8Array(totalSize);
  const view = new DataView(output.buffer);
  let cursor = 0;
  for (const entry of entries) {
    view.setUint32(cursor, 0x04034b50, true);
    view.setUint16(cursor + 4, 20, true);
    view.setUint16(cursor + 6, 0x0800, true);
    view.setUint16(cursor + 8, 0, true);
    view.setUint16(cursor + 10, 0, true);
    view.setUint16(cursor + 12, 0x0021, true);
    view.setUint32(cursor + 14, entry.crc, true);
    view.setUint32(cursor + 18, entry.data.length, true);
    view.setUint32(cursor + 22, entry.data.length, true);
    view.setUint16(cursor + 26, entry.name.length, true);
    view.setUint16(cursor + 28, 0, true);
    output.set(entry.name, cursor + 30);
    output.set(entry.data, cursor + 30 + entry.name.length);
    cursor += 30 + entry.name.length + entry.data.length;
  }
  const centralOffset = cursor;
  for (const entry of entries) {
    view.setUint32(cursor, 0x02014b50, true);
    view.setUint16(cursor + 4, 20, true);
    view.setUint16(cursor + 6, 20, true);
    view.setUint16(cursor + 8, 0x0800, true);
    view.setUint16(cursor + 10, 0, true);
    view.setUint16(cursor + 12, 0, true);
    view.setUint16(cursor + 14, 0x0021, true);
    view.setUint32(cursor + 16, entry.crc, true);
    view.setUint32(cursor + 20, entry.data.length, true);
    view.setUint32(cursor + 24, entry.data.length, true);
    view.setUint16(cursor + 28, entry.name.length, true);
    view.setUint16(cursor + 30, 0, true);
    view.setUint16(cursor + 32, 0, true);
    view.setUint16(cursor + 34, 0, true);
    view.setUint16(cursor + 36, 0, true);
    view.setUint32(cursor + 38, 0, true);
    view.setUint32(cursor + 42, entry.offset, true);
    output.set(entry.name, cursor + 46);
    cursor += 46 + entry.name.length;
  }
  view.setUint32(cursor, 0x06054b50, true);
  view.setUint16(cursor + 4, 0, true);
  view.setUint16(cursor + 6, 0, true);
  view.setUint16(cursor + 8, entries.length, true);
  view.setUint16(cursor + 10, entries.length, true);
  view.setUint32(cursor + 12, centralSize, true);
  view.setUint32(cursor + 16, centralOffset, true);
  view.setUint16(cursor + 20, 0, true);
  return output;
}

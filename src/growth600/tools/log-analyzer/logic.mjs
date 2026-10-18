export const LOG_MAX_BYTES = 10 * 1024 * 1024;
export const LOG_MAX_LINES = 100_000;
export const LOG_MAX_LINE_CHARS = 8_192;
const encoder = new TextEncoder();
const MONTHS = Object.freeze({ Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 });

function isValidDateFilter(value) {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function parseApacheDate(value) {
  const match = /^(\d{2})\/([A-Z][a-z]{2})\/(\d{4}):(\d{2}):(\d{2}):(\d{2}) ([+-])(\d{2})(\d{2})$/u.exec(value);
  if (!match || !(match[2] in MONTHS)) return null;
  const [, dayText, monthName, yearText, hourText, minuteText, secondText, sign, zoneHour, zoneMinute] = match;
  const day = Number(dayText); const month = MONTHS[monthName]; const year = Number(yearText);
  const hour = Number(hourText); const minute = Number(minuteText); const second = Number(secondText);
  if (day < 1 || day > 31 || hour > 23 || minute > 59 || second > 59 || Number(zoneHour) > 23 || Number(zoneMinute) > 59) return null;
  const utc = Date.UTC(year, month, day, hour, minute, second);
  const check = new Date(utc);
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month || check.getUTCDate() !== day) return null;
  const offset = (Number(zoneHour) * 60 + Number(zoneMinute)) * (sign === '+' ? 1 : -1);
  return new Date(utc - offset * 60_000);
}

export function parseCombinedAccessLogLine(line) {
  if (typeof line !== 'string' || !line || line.length > LOG_MAX_LINE_CHARS) return null;
  const match = /^(\S+) \S+ \S+ \[([^\x5d]+)\] "([^"]*)" (\d{3}) (\d+|-)(?: "[^"]*" "[^"]*")?$/u.exec(line);
  if (!match) return null;
  const [, , rawDate, request, statusText, bytesText] = match;
  const requestMatch = /^([A-Z]{1,16})\s+\S+(?:\s+HTTP\/\d(?:\.\d)?)?$/u.exec(request);
  const timestamp = parseApacheDate(rawDate);
  const bytes = bytesText === '-' ? 0 : Number(bytesText);
  const status = Number(statusText);
  if (!requestMatch || !timestamp || !Number.isSafeInteger(bytes) || bytes < 0 || status < 100 || status > 599) return null;
  return Object.freeze({ timestamp, day: timestamp.toISOString().slice(0, 10), method: requestMatch[1], status, bytes });
}

export function analyzeAccessLogs(text, { statusClass = 'all', fromDate = '', toDate = '' } = {}) {
  if (typeof text !== 'string') throw new TypeError('Paste a text log or choose a local file.');
  if (!text.trim()) throw new TypeError('Paste a supported log or choose a file.');
  if (text.length > LOG_MAX_BYTES) throw new RangeError('The log exceeds the 10 MiB local limit.');
  const byteCount = encoder.encode(text).byteLength;
  if (byteCount > LOG_MAX_BYTES) throw new RangeError('The log exceeds the 10 MiB local limit.');
  const lines = text.split(/\r?\n/u);
  if (lines.length > LOG_MAX_LINES) throw new RangeError('The log exceeds the 100,000-line limit.');
  if (statusClass !== 'all' && !/^[2-5]xx$/u.test(statusClass)) throw new TypeError('Choose all statuses or a 2xx–5xx class.');
  if (!isValidDateFilter(fromDate) || !isValidDateFilter(toDate)) throw new TypeError('Dates must be valid calendar dates in YYYY-MM-DD format.');
  if (fromDate && toDate && fromDate > toDate) throw new RangeError('The start date must not be after the end date.');

  const records = [];
  const invalidLineNumbers = [];
  let invalidLines = 0;
  lines.forEach((line, index) => {
    if (!line.trim()) return;
    const record = parseCombinedAccessLogLine(line);
    if (!record) { invalidLines += 1; if (invalidLineNumbers.length < 20) invalidLineNumbers.push(index + 1); return; }
    records.push(record);
  });
  const filtered = records.filter((record) => {
    const classMatches = statusClass === 'all' || `${Math.floor(record.status / 100)}xx` === statusClass;
    return classMatches && (!fromDate || record.day >= fromDate) && (!toDate || record.day <= toDate);
  });
  const byStatus = new Map(); const byMethod = new Map(); const byDay = new Map();
  let transferredBytes = 0;
  for (const record of filtered) {
    byStatus.set(record.status, (byStatus.get(record.status) ?? 0) + 1);
    byMethod.set(record.method, (byMethod.get(record.method) ?? 0) + 1);
    byDay.set(record.day, (byDay.get(record.day) ?? 0) + 1);
    if (transferredBytes > Number.MAX_SAFE_INTEGER - record.bytes) throw new RangeError('The reported response-byte total exceeds the safe calculation range.');
    transferredBytes += record.bytes;
  }
  const rows = (map, keyName) => [...map].sort(([a], [b]) => a > b ? 1 : a < b ? -1 : 0).map(([key, count]) => Object.freeze({ [keyName]: key, requests: count }));
  return Object.freeze({
    totalLines: lines.filter((line) => line.trim()).length,
    parsedLines: records.length,
    invalidLines,
    invalidLineNumbers: Object.freeze(invalidLineNumbers),
    matchedRequests: filtered.length,
    transferredBytes,
    byStatus: Object.freeze(rows(byStatus, 'status')),
    byMethod: Object.freeze(rows(byMethod, 'method')),
    byDay: Object.freeze(rows(byDay, 'day')),
  });
}

function csvCell(value) {
  const text = String(value);
  const safe = /^[=+@\-]/u.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

export function accessLogSummaryCsv(analysis) {
  if (!analysis || !Array.isArray(analysis.byStatus) || !Array.isArray(analysis.byMethod) || !Array.isArray(analysis.byDay)) throw new TypeError('Analyze a log before exporting.');
  const rows = [['group', 'value', 'requests']];
  for (const row of analysis.byStatus) rows.push(['status', row.status, row.requests]);
  for (const row of analysis.byMethod) rows.push(['method', row.method, row.requests]);
  for (const row of analysis.byDay) rows.push(['day', row.day, row.requests]);
  return `${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}\r\n`;
}

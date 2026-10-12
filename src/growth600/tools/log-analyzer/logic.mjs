export const LOG_ANALYZER_MAX_BYTES = 5 * 1024 * 1024;
export const LOG_ANALYZER_MAX_LINES = 20_000;
const MONTHS = Object.freeze({ Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 });
const encoder = new TextEncoder();

function parseLogDate(value) {
  const match = /^(\d{1,2})\/(\w{3})\/(\d{4}):(\d{2}):(\d{2}):(\d{2}) ([+-])(\d{2})(\d{2})$/u.exec(value);
  if (!match || MONTHS[match[2]] === undefined) return null;
  const [, day, month, year, hour, minute, second, sign, offsetHours, offsetMinutes] = match;
  const utc = Date.UTC(Number(year), MONTHS[month], Number(day), Number(hour), Number(minute), Number(second));
  const check = new Date(utc);
  if (check.getUTCFullYear() !== Number(year) || check.getUTCMonth() !== MONTHS[month] || check.getUTCDate() !== Number(day) || Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59 || Number(offsetHours) > 23 || Number(offsetMinutes) > 59) return null;
  const offset = (Number(offsetHours) * 60 + Number(offsetMinutes)) * 60_000 * (sign === '+' ? 1 : -1);
  return new Date(utc - offset);
}

export function parseAccessLogLine(line) {
  if (typeof line !== 'string' || line.length > 8192) return null;
  // NCSA common/combined log format: host ident auth [date] "request" status bytes ["referer" "agent"].
  const match = /^(\S+)\s+(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+"((?:\\.|[^"\\\r\n])*)"\s+(\d{3})\s+(\d+|-)(?:\s+"((?:\\.|[^"\\\r\n])*)"\s+"((?:\\.|[^"\\\r\n])*)")?$/u.exec(line);
  if (!match) return null;
  const [, ip, , , rawDate, escapedRequest, rawStatus, rawBytes, escapedReferer = '', escapedUserAgent = ''] = match;
  const unescape = (value) => value.replaceAll('\\"', '"').replaceAll('\\\\', '\\');
  const rawRequest = unescape(escapedRequest);
  const referer = unescape(escapedReferer);
  const userAgent = unescape(escapedUserAgent);
  const date = parseLogDate(rawDate);
  if (!date) return null;
  const request = rawRequest === '-' ? null : /^(\S+)\s+(\S+)(?:\s+(\S+))?$/u.exec(rawRequest);
  if (rawRequest !== '-' && !request) return null;
  const method = request?.[1] ?? '—';
  const rawPath = request?.[2] ?? '—';
  let path = rawPath;
  if (!path.startsWith('/') && path !== '*') {
    const schemeEnd = path.indexOf('://');
    if (schemeEnd < 1 || !/^[a-z][a-z\d+.-]*$/iu.test(path.slice(0, schemeEnd))) return null;
    const authorityStart = schemeEnd + 3;
    const firstPathSeparator = path.indexOf('/', authorityStart);
    const queryOrFragment = path.search(/[?#]/u);
    if (queryOrFragment >= 0 && (firstPathSeparator < 0 || queryOrFragment < firstPathSeparator)) path = `/${path.slice(queryOrFragment)}`;
    else path = firstPathSeparator < 0 ? '/' : path.slice(firstPathSeparator);
  }
  if (path !== '*') path = path.split(/[?#]/u, 1)[0] || '/';
  const status = Number(rawStatus);
  if (status < 100 || status > 599) return null;
  const bytes = rawBytes === '-' ? 0 : Number(rawBytes);
  if (!Number.isSafeInteger(bytes) || bytes < 0) return null;
  return Object.freeze({ ip, date, day: date.toISOString().slice(0, 10), method, path, status, bytes, referer, userAgent });
}

export function analyzeAccessLog(text, { maxBytes = LOG_ANALYZER_MAX_BYTES, maxLines = LOG_ANALYZER_MAX_LINES } = {}) {
  if (typeof text !== 'string') throw new TypeError('Provide access log text.');
  if (encoder.encode(text).byteLength > maxBytes) throw new RangeError(`Input exceeds the ${maxBytes}-byte limit.`);
  const lines = text.split(/\r?\n/u).filter((line) => line.trim() !== '');
  if (lines.length > maxLines) throw new RangeError(`Input exceeds the ${maxLines}-line limit.`);
  const rows = [];
  let invalidLines = 0;
  for (const line of lines) {
    const row = parseAccessLogLine(line);
    if (row) rows.push(row); else invalidLines += 1;
  }
  const statuses = new Map();
  const methods = new Map();
  const paths = new Map();
  const days = new Map();
  let transferredBytes = 0n;
  for (const row of rows) {
    statuses.set(row.status, (statuses.get(row.status) ?? 0) + 1);
    methods.set(row.method, (methods.get(row.method) ?? 0) + 1);
    paths.set(row.path, (paths.get(row.path) ?? 0) + 1);
    days.set(row.day, (days.get(row.day) ?? 0) + 1);
    transferredBytes += BigInt(row.bytes);
  }
  const descending = (a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]));
  return Object.freeze({
    rows: Object.freeze(rows), totalLines: lines.length, validLines: rows.length, invalidLines, transferredBytes,
    statusCounts: Object.freeze([...statuses].sort(descending)), methodCounts: Object.freeze([...methods].sort(descending)),
    topPaths: Object.freeze([...paths].sort(descending).slice(0, 10)), dailyCounts: Object.freeze([...days].sort(([a], [b]) => a.localeCompare(b))),
  });
}

export function filterAccessLogRows(rows, { search = '', status = 'all', method = 'all', from = '', to = '' } = {}) {
  const query = String(search).trim().toLocaleLowerCase();
  return rows.filter((row) => (status === 'all' || String(row.status) === String(status))
    && (method === 'all' || row.method === method)
    && (!from || row.day >= from) && (!to || row.day <= to)
    && (!query || `${row.path} ${row.method} ${row.status} ${row.day}`.toLocaleLowerCase().includes(query)));
}

export function accessLogRowsToCsv(rows, { includeClientIp = false } = {}) {
  const columns = includeClientIp ? ['ip', 'date', 'method', 'path', 'status', 'bytes', 'referer', 'userAgent'] : ['date', 'method', 'path', 'status', 'bytes', 'referer', 'userAgent'];
  const safeCell = (value) => {
    let text = String(value ?? '');
    // Defang spreadsheet formula cells before quoting them.
    if (/^[\u0000-\u0020]*[=+@-]/u.test(text)) text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  };
  return [columns.join(','), ...rows.map((row) => columns.map((key) => safeCell(key === 'date' ? row.date.toISOString() : row[key])).join(','))].join('\r\n');
}

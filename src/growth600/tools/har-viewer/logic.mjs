export const HAR_LIMITS = Object.freeze({ bytes: 5 * 1024 * 1024, entries: 5_000, depth: 48, nodes: 120_000, renderedEntries: 100 });
const SENSITIVE_QUERY = /^(?:access[_-]?token|api[_-]?key|auth(?:orization)?|code|key|password|secret|session(?:id)?|signature|token)$/iu;

function fail(code) { throw new Error(code); }

function inspect(value) {
  const stack = [{ value, depth: 0 }]; let nodes = 0;
  while (stack.length) {
    const { value: current, depth } = stack.pop();
    nodes += 1;
    if (nodes > HAR_LIMITS.nodes) fail('too-many-values');
    if (depth > HAR_LIMITS.depth) fail('too-deep');
    if (current && typeof current === 'object') for (const child of Object.values(current)) stack.push({ value: child, depth: depth + 1 });
  }
}

function nonnegative(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function safeRequestUrl(raw) {
  try {
    const url = new URL(String(raw));
    if (!['http:', 'https:'].includes(url.protocol)) return '(non-HTTP request URL hidden)';
    url.username = ''; url.password = ''; url.hash = '';
    for (const key of [...url.searchParams.keys()]) {
      if (SENSITIVE_QUERY.test(key)) url.searchParams.set(key, '[redacted]');
      else url.searchParams.set(key, '[value hidden]');
    }
    return url.toString();
  } catch { return '(invalid request URL hidden)'; }
}

export function parseHarDocument(text) {
  if (typeof text !== 'string' || !text.trim()) fail('empty-input');
  if (new TextEncoder().encode(text).byteLength > HAR_LIMITS.bytes) fail('too-large');
  let document;
  try { document = JSON.parse(text); } catch { fail('invalid-json'); }
  inspect(document);
  const entries = document?.log?.entries;
  if (document?.log?.version !== '1.2' || !Array.isArray(entries)) fail('invalid-har');
  if (entries.length > HAR_LIMITS.entries) fail('too-many-entries');
  const normalized = entries.map((entry, index) => {
    const request = entry?.request; const response = entry?.response;
    if (!request || typeof request !== 'object' || !response || typeof response !== 'object') fail('invalid-har');
    const parsedStart = Date.parse(entry.startedDateTime);
    const start = Number.isFinite(parsedStart) ? parsedStart : null;
    const rawDuration = Number(entry.time);
    const timingDuration = Object.values(entry.timings ?? {}).reduce((sum, value) => sum + nonnegative(value), 0);
    const duration = Number.isFinite(rawDuration) && rawDuration >= 0 ? rawDuration : timingDuration;
    const contentSize = Number(response.content?.size);
    const bodySize = Number(response.bodySize);
    return {
      index,
      method: typeof request.method === 'string' ? request.method.slice(0, 24).toUpperCase() : '—',
      url: safeRequestUrl(request.url),
      host: (() => { try { return new URL(String(request.url)).host.slice(0, 255); } catch { return ''; } })(),
      status: Number.isInteger(Number(response.status)) && Number(response.status) >= 0 ? Number(response.status) : 0,
      duration,
      start,
      size: Number.isFinite(contentSize) && contentSize >= 0 ? contentSize : nonnegative(bodySize),
      mimeType: typeof response.content?.mimeType === 'string' ? response.content.mimeType.slice(0, 120) : '',
      resourceType: typeof entry._resourceType === 'string' ? entry._resourceType.slice(0, 40) : '',
    };
  });
  const earliest = normalized.reduce((min, item) => item.start === null ? min : Math.min(min, item.start), Infinity);
  const latest = normalized.reduce((max, item) => item.start === null ? max : Math.max(max, item.start + item.duration), -Infinity);
  const timeline = Number.isFinite(earliest) && Number.isFinite(latest) ? Math.max(1, latest - earliest) : 1;
  const datedEntries = normalized.filter((entry) => entry.start !== null).length;
  const entriesWithBars = normalized.map((entry, position) => {
    const offset = entry.start === null || !Number.isFinite(earliest) ? (position / Math.max(1, normalized.length)) * 100 : ((entry.start - earliest) / timeline) * 100;
    const width = Math.max(0.8, (entry.duration / timeline) * 100);
    return { ...entry, offsetPercent: Math.min(99.2, Math.max(0, offset)), widthPercent: Math.min(100, Math.max(0.8, width)) };
  });
  return {
    entries: entriesWithBars,
    datedEntries,
    summary: {
      total: entriesWithBars.length,
      failed: entriesWithBars.filter((entry) => entry.status >= 400).length,
      totalDuration: entriesWithBars.reduce((sum, entry) => sum + entry.duration, 0),
      totalBytes: entriesWithBars.reduce((sum, entry) => sum + entry.size, 0),
      slowestMs: entriesWithBars.reduce((max, entry) => Math.max(max, entry.duration), 0),
    },
  };
}

export function filterHarEntries(entries, { query = '', status = 'all', method = 'all' } = {}) {
  const needle = query.trim().toLocaleLowerCase();
  return entries.filter((entry) => {
    if (status === 'errors' && entry.status < 400) return false;
    if (status === 'successful' && (entry.status < 200 || entry.status >= 400)) return false;
    if (method !== 'all' && entry.method !== method) return false;
    return !needle || `${entry.url} ${entry.method} ${entry.status} ${entry.mimeType} ${entry.resourceType}`.toLocaleLowerCase().includes(needle);
  });
}

export function summarizeHarBytes(value) {
  if (!Number.isFinite(value) || value < 0) return '—';
  if (value < 1024) return `${Math.round(value)} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(2)} MB`;
}

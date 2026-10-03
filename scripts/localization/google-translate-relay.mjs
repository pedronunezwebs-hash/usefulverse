import { appendFile, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';

const directory = process.env.USEFULVERSE_TRANSLATION_DIR ?? '/tmp/usefulverse-local-translation-20261001';
const port = Number(process.env.USEFULVERSE_TRANSLATION_PORT ?? 4179);
const input = JSON.parse(await readFile(`${directory}/draft-input.json`, 'utf8'));
const protectedPattern = /\{[A-Za-z][A-Za-z0-9_]*\}|https?:\/\/[^\s<>]+|`[^`]*`|<\/?[A-Za-z][^>]*>|UsefulVerse/gu;

const outputFile = `${directory}/google-translate-output.jsonl`;
const completed = new Map();
try {
  for (const line of (await readFile(outputFile, 'utf8')).split(/\r?\n/u)) {
    if (!line) continue;
    const row = JSON.parse(line);
    const ids = completed.get(row.language) ?? new Set();
    ids.add(row.unitId);
    completed.set(row.language, ids);
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const jobs = {};
for (const [language, target] of Object.entries(input.targets)) {
  let index = 0;
  const rows = [];
  for (const [unitId, source] of Object.entries(target.units)) {
    index += 1;
    // Numeric sentinels avoid spellcheck changes in the free Translate UI
    // (it has occasionally collapsed repeated letters in hexadecimal IDs).
    const rowId = String(index).padStart(8, '0');
    const replacements = [];
    let tokenIndex = 0;
    let cursor = 0;
    let masked = '';
    for (const match of source.matchAll(protectedPattern)) {
      masked += source.slice(cursor, match.index);
      const token = `UVKEEP${String(tokenIndex++).padStart(4, '0')}X`;
      replacements.push({ token, value: match[0] });
      masked += token;
      cursor = match.index + match[0].length;
    }
    masked += source.slice(cursor);
    if (!replacements.length) masked = source;
    rows.push({ rowId, unitId, source, masked, replacements });
  }

  const finished = completed.get(language) ?? new Set();
  const remaining = rows.filter((row) => !finished.has(row.unitId));
  const batches = [];
  let batchRows = [];
  let batchText = '';
  for (const row of remaining) {
    const line = `${row.rowId}|${row.masked}`;
    if (line.length > 2400) throw new Error(`Single translation string exceeds safe limit: ${language}/${row.unitId}`);
    const addition = `${batchRows.length ? '\n' : ''}${line}`;
    if (batchText.length + addition.length > 2400 || batchRows.length >= 40) {
      batches.push(batchRows);
      batchRows = [];
      batchText = '';
    }
    batchRows.push(row);
    batchText += `${batchRows.length > 1 ? '\n' : ''}${line}`;
  }
  if (batchRows.length) batches.push(batchRows);
  jobs[language] = { rows, batches, cursor: 0, current: null };
}

function send(response, status, value) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' });
  response.end(JSON.stringify(value));
}

function responseText(job) {
  return job.map((row) => `${row.rowId}|${row.masked}`).join('\n');
}

async function readBody(request) {
  let value = '';
  for await (const chunk of request) value += chunk;
  return JSON.parse(value || '{}');
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://127.0.0.1:${port}`);
  if (request.method === 'OPTIONS') {
    response.writeHead(204, { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET,POST,OPTIONS', 'access-control-allow-headers': 'content-type' });
    return response.end();
  }
  if (request.method === 'GET' && url.pathname === '/status') {
    return send(response, 200, Object.fromEntries(Object.entries(jobs).map(([language, job]) => [language, {
      translated: completed.get(language)?.size ?? 0,
      total: job.rows.length,
      pendingBatches: job.batches.length - job.cursor,
    }])));
  }
  if (request.method === 'GET' && url.pathname === '/next') {
    const language = url.searchParams.get('language');
    const job = jobs[language];
    if (!job) return send(response, 404, { error: 'Unknown language' });
    if (!job.current && job.cursor < job.batches.length) job.current = job.batches[job.cursor];
    if (!job.current) return send(response, 200, { done: true, language });
    return send(response, 200, {
      done: false,
      language,
      batch: job.cursor,
      totalBatches: job.batches.length,
      rowIds: job.current.map((row) => row.rowId),
      text: responseText(job.current),
    });
  }
  if (request.method === 'POST' && url.pathname === '/result') {
    const body = await readBody(request);
    const job = jobs[body.language];
    if (!job?.current) return send(response, 409, { error: 'No active batch' });
    const translations = new Map();
    // Google Translate may add a space around the pipe in the visible result.
    // RTL translation UIs can visually reorder or drop the ASCII pipe while
    // retaining the numeric row sentinel. Accept that punctuation variation.
    const matcher = /(\d{8})\s*\|?\s*([\s\S]*?)(?=\d{8}\s*\|?|$)/gu;
    for (const match of String(body.text ?? '').matchAll(matcher)) translations.set(match[1], match[2].trim());
    const missing = [];
    const invalidMarkers = [];
    const results = [];
    for (const row of job.current) {
      let translation = translations.get(row.rowId)?.replace(/\nstar_border\s*$/u, '');
      if (!translation) {
        missing.push(row.rowId);
        continue;
      }
      let markerProblem = false;
      for (const replacement of row.replacements) {
        const occurrences = translation.split(replacement.token).length - 1;
        if (occurrences !== 1) {
          invalidMarkers.push(`${row.rowId}:${replacement.token}`);
          markerProblem = true;
        }
        translation = translation.replace(replacement.token, replacement.value);
      }
      if (markerProblem) translation = row.source;
      results.push({ language: body.language, unitId: row.unitId, source: row.source, translation });
    }
    if (results.length) await appendFile(outputFile, `${results.map((row) => JSON.stringify(row)).join('\n')}\n`);
    const done = completed.get(body.language) ?? new Set();
    for (const row of results) done.add(row.unitId);
    completed.set(body.language, done);
    const missingSet = new Set(missing);
    job.current = job.current.filter((row) => missingSet.has(row.rowId));
    if (!job.current.length) {
      job.cursor += 1;
      job.current = null;
    }
    return send(response, 200, { saved: results.length, retried: missing.length, invalidMarkers, language: body.language, batch: job.cursor, totalBatches: job.batches.length });
  }
  return send(response, 404, { error: 'Not found' });
});

server.listen(port, '127.0.0.1', () => console.log(`Local translation relay listening on http://127.0.0.1:${port}`));

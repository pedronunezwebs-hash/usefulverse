import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

let db;
const MAX_ROWS = 500;

function resetDatabase(sqlite3) {
  db?.close();
  db = new sqlite3.oo1.DB(':memory:', 'c');
}

try {
  const sqlite3 = await sqlite3InitModule({ locateFile: (name) => new URL(name, import.meta.url).href });
  resetDatabase(sqlite3);
  self.postMessage({ type: 'ready', version: sqlite3.version.libVersion });
  self.addEventListener('message', (event) => {
    const { type, sql, id } = event.data ?? {};
    try {
      if (type === 'reset') {
        resetDatabase(sqlite3);
        self.postMessage({ type: 'reset', id });
        return;
      }
      if (type !== 'exec') return;
      const query = String(sql ?? '').trim();
      if (!query || query.length > 20000) throw new RangeError('Enter a query of 1–20,000 characters.');
      const columnNames = [];
      const resultRows = [];
      db.exec({ sql: query, rowMode: 'array', columnNames, resultRows, returnValue: 'resultRows' });
      if (resultRows.length > MAX_ROWS) throw new RangeError(`This preview is limited to ${MAX_ROWS} rows. Add LIMIT to your query.`);
      const rows = resultRows.map((row) => row.map((value) => value instanceof Uint8Array ? `[BLOB · ${value.byteLength} bytes]` : value));
      self.postMessage({ type: 'result', id, columns: columnNames, rows, changes: db.changes() });
    } catch (error) {
      self.postMessage({ type: 'error', id, message: error instanceof Error ? error.message : 'SQLite query failed.' });
    }
  });
} catch (error) {
  self.postMessage({ type: 'init-error', message: error instanceof Error ? error.message : 'SQLite could not start.' });
}

self.addEventListener('close', () => db?.close());

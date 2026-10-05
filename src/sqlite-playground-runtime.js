export function setupSqlitePlayground(root) {
  const $ = (selector) => root.querySelector(selector);
  const output = $('#op-output'); const run = $('[data-op-calculate]'); const reset = $('[data-sql-reset]');
  const messages = window.usefulverseLocale ?? { runtime: {}, messages: {} };
  const say = (text) => messages.runtime?.[text] ?? messages.messages?.[text] ?? text;
  const setStatus = (text, type = '') => {
    const node = $('[role="status"]');
    if (node) { node.textContent = say(text); node.className = `tool-status${type ? ` is-${type}` : ''}`; }
  };
  const workerVersion = encodeURIComponent(document.documentElement.dataset.assetVersion || '');
  const worker = new Worker(`/assets/sqlite-playground-worker.js?v=${workerVersion}`, { type: 'module' });
  let nextId = 0; const pending = new Map();
  const clearResults = () => { $('#op-sql-results')?.replaceChildren(); output.textContent = '—'; };
  const renderRows = (columns, rows) => {
    const table = document.createElement('table'); table.className = 'op-sql-table';
    const head = table.createTHead().insertRow();
    for (const name of columns) { const cell = document.createElement('th'); cell.scope = 'col'; cell.textContent = String(name); head.append(cell); }
    const body = table.createTBody();
    for (const row of rows) { const tr = body.insertRow(); for (const value of row) { const cell = tr.insertCell(); cell.textContent = value === null ? 'NULL' : String(value); } }
    $('#op-sql-results')?.replaceChildren(table);
  };
  worker.addEventListener('message', ({ data }) => {
    if (data.type === 'init-error') { clearResults(); setStatus(data.message, 'error'); run.disabled = true; return; }
    if (data.type === 'ready') { setStatus('Values are processed locally in this browser.', 'success'); return; }
    const task = pending.get(data.id); if (!task) return; pending.delete(data.id);
    if (data.type === 'error') { clearResults(); setStatus(data.message, 'error'); return; }
    if (data.type === 'result') {
      output.textContent = [data.columns.join('\t'), ...data.rows.map((row) => row.map((value) => value === null ? 'NULL' : String(value)).join('\t'))].filter(Boolean).join('\n');
      renderRows(data.columns, data.rows);
      setStatus('Result ready. This calculation runs locally in your browser.', 'success');
    }
    if (data.type === 'reset') { clearResults(); setStatus('Database reset.'); }
  });
  worker.addEventListener('error', () => {
    pending.clear(); clearResults(); run.disabled = true;
    setStatus('SQLite stopped unexpectedly. Refresh the page and try again.', 'error');
  });
  const send = (type, sql = '') => { const id = ++nextId; pending.set(id, true); worker.postMessage({ type, sql, id }); };
  run.addEventListener('click', (event) => { event.preventDefault(); send('exec', $('[data-op-field="sql"]')?.value); });
  reset.addEventListener('click', () => send('reset'));
  window.addEventListener('pagehide', () => { worker.postMessage({ type: 'dispose' }); worker.terminate(); pending.clear(); }, { once: true });
}

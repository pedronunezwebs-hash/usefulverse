import { validateSwissUidBatch } from './swiss-uid.mjs';

const root = document.querySelector('[data-market-tool="swissUid"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
  const fields = copy.fields;
  const input = root.querySelector('#swiss-uid-input');
  const output = root.querySelector('[data-uid-results]');
  const status = root.querySelector('[data-uid-status]');
  let results = [];
  const setStatus = (message, error = false) => { status.textContent = message; status.classList.toggle('result--error', error); };
  const csvCell = (value) => {
    const text = String(value);
    const safe = /^[=+\-@\t\r]/u.test(text) ? `'${text}` : text;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  const render = () => {
    const table = document.createElement('table');
    const head = document.createElement('thead');
    const headRow = document.createElement('tr');
    for (const label of [fields.original, fields.normalized, fields.status]) {
      const cell = document.createElement('th'); cell.scope = 'col'; cell.textContent = label; headRow.append(cell);
    }
    head.append(headRow);
    const body = document.createElement('tbody');
    for (const result of results) {
      const row = document.createElement('tr');
      const check = result.status === 'checksum-ok' ? fields.valid
        : result.status === 'checksum-error' ? fields.invalidCheck
          : result.status === 'unassigned-check-digit' ? fields.unassigned : fields.invalidFormat;
      for (const value of [result.original, result.normalized || '—', check]) {
        const cell = document.createElement('td'); cell.textContent = value; row.append(cell);
      }
      body.append(row);
    }
    table.append(head, body);
    output.replaceChildren(table);
    output.hidden = false;
  };
  root.querySelector('[data-action="validateUid"]').addEventListener('click', () => {
    try {
      results = validateSwissUidBatch(input.value);
      if (!results.length) { output.hidden = true; setStatus(fields.noInput, true); return; }
      render(); setStatus(`${fields.complete} ${results.length}`);
    } catch { results = []; output.hidden = true; setStatus(fields.tooMany, true); }
  });
  root.querySelector('[data-action="sampleUid"]').addEventListener('click', () => {
    input.value = 'CHE-109.322.551'; setStatus(fields.exampleLoaded); input.focus();
  });
  root.querySelector('[data-action="clearUid"]').addEventListener('click', () => {
    input.value = ''; results = []; output.replaceChildren(); output.hidden = true; setStatus(fields.cleared); input.focus();
  });
  root.querySelector('[data-action="exportUid"]').addEventListener('click', () => {
    if (!results.length) { setStatus(fields.noExport, true); return; }
    const rows = [[fields.original, fields.normalized, fields.status], ...results.map((item) => [item.original, item.normalized, item.status])];
    const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'swiss-uid-check.csv'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}

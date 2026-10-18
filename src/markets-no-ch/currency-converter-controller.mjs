import { convertCurrencyAmounts, fetchEcbRates, parseEcbCsv } from './currency-converter.mjs';

const root = document.querySelector('[data-market-tool="currency"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
  const f = copy.fields;
  const $ = (selector) => root.querySelector(selector);
  const storageKey = 'usefulverse-ecb-reference-rates-v1';
  const money = () => new Intl.NumberFormat(document.documentElement.lang || 'en', { maximumFractionDigits: 4 });
  let snapshot = null;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved?.date && saved?.rates) snapshot = saved;
  } catch { /* storage can be unavailable in private browsing */ }

  function populateCurrencies() {
    if (!snapshot) return;
    for (const selector of ['#currency-from', '#currency-to']) {
      const select = $(selector);
      const oldValue = select.value;
      select.replaceChildren(...Object.keys(snapshot.rates).sort().map((code) => {
        const option = document.createElement('option');
        option.value = code; option.textContent = code;
        return option;
      }));
      select.value = snapshot.rates[oldValue] ? oldValue : selector === '#currency-from' ? 'EUR' : 'NOK';
    }
    $('[data-currency-import]').disabled = false;
  }
  function showSnapshotStatus(message) {
    $('[data-currency-status]').textContent = snapshot ? `${message} · ${snapshot.date}` : message;
  }
  function saveSnapshot(value) {
    snapshot = value;
    try { localStorage.setItem(storageKey, JSON.stringify(snapshot)); } catch { /* current tab can still use the snapshot */ }
    populateCurrencies();
  }

  populateCurrencies();
  showSnapshotStatus(snapshot ? `${f.updated}` : f.noRates);
  $('[data-currency-update]').addEventListener('click', async () => {
    const button = $('[data-currency-update]');
    button.disabled = true; showSnapshotStatus(f.requesting);
    try { saveSnapshot(await fetchEcbRates()); showSnapshotStatus(f.updated); }
    catch { showSnapshotStatus(f.updateFailed); }
    finally { button.disabled = false; }
  });
  $('[data-currency-import]').addEventListener('click', () => {
    try { saveSnapshot(parseEcbCsv($('#currency-csv').value)); showSnapshotStatus(f.imported); }
    catch { showSnapshotStatus(f.invalidCsv); }
  });
  $('[data-currency-convert]').addEventListener('click', () => {
    const output = $('[data-currency-results]');
    try {
      const result = convertCurrencyAmounts({
        amounts: $('#currency-amounts').value,
        from: $('#currency-from').value,
        to: $('#currency-to').value,
        snapshot,
        fixedFee: $('#currency-fixed-fee').value || 0,
        percentageFee: $('#currency-percentage-fee').value || 0,
        margin: $('#currency-margin').value || 0,
      });
      const formatter = money();
      const rows = result.results.map((item) => {
        const row = document.createElement('tr');
        const values = [`${formatter.format(item.amount)} ${result.from}`, `${formatter.format(item.beforeFees)} ${result.to}`, `${formatter.format(item.fixedFee)} ${result.to}`, `${formatter.format(item.percentageFee)} ${result.to}`, `${formatter.format(item.margin)} ${result.to}`, `${formatter.format(item.received)} ${result.to}`];
        for (const value of values) { const cell = document.createElement('td'); cell.textContent = value; row.append(cell); }
        return row;
      });
      const table = document.createElement('table');
      const header = document.createElement('tr');
      for (const value of [f.amounts, f.beforeFees, f.fixedFeeResult, f.percentageFeeResult, f.marginResult, f.received]) { const th = document.createElement('th'); th.textContent = value; header.append(th); }
      const head = document.createElement('thead'); head.append(header);
      const body = document.createElement('tbody'); rows.forEach((row) => body.append(row));
      table.append(head, body);
      output.replaceChildren(table); output.hidden = false;
      showSnapshotStatus(`${f.updated} · 1 ${result.from} = ${formatter.format(result.rate)} ${result.to}`);
    } catch { output.hidden = true; showSnapshotStatus(f.invalid); }
  });
  $('[data-currency-reset]').addEventListener('click', () => {
    $('#currency-amounts').value = ''; $('#currency-fixed-fee').value = '0'; $('#currency-percentage-fee').value = '0'; $('#currency-margin').value = '0';
    $('[data-currency-results]').replaceChildren(); $('[data-currency-results]').hidden = true;
    showSnapshotStatus(snapshot ? `${f.updated}` : f.noRates);
  });
}

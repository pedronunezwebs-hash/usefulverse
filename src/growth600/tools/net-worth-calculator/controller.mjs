import { parseLocalizedNumber } from '../../../advanced-logic.mjs';
import { addNetWorthSnapshot, calculateNetWorth, compareNetWorthSnapshots, exportNetWorthCsv } from './logic.mjs';

const root = document.querySelector('[data-tool="net-worth-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
  const status = root.querySelector('[data-status]');
  const result = root.querySelector('[data-result]');
  const resultContent = root.querySelector('[data-net-worth-results]');
  const historyList = root.querySelector('[data-net-worth-history]');
  const consent = form.elements.namedItem('consent');
  const saveButton = root.querySelector('[data-action="saveSnapshot"]');
  const locale = () => document.documentElement.lang || 'en';
  const storageKey = 'usefulverse-net-worth-snapshots-v1';
  const fields = [
    ['asset', 'Cash and savings', 'asset-cash'], ['asset', 'Investments', 'asset-investments'], ['asset', 'Property estimate', 'asset-property'], ['asset', 'Vehicles and valuables', 'asset-vehicles'], ['asset', 'Other assets', 'asset-other'],
    ['liability', 'Credit cards', 'liability-creditCards'], ['liability', 'Mortgage', 'liability-mortgage'], ['liability', 'Student loans', 'liability-studentLoans'], ['liability', 'Auto loans', 'liability-autoLoans'], ['liability', 'Other liabilities', 'liability-other'],
  ];
  const labels = [copy.fields.assetCash, copy.fields.assetInvestments, copy.fields.assetProperty, copy.fields.assetVehicles, copy.fields.assetOther, copy.fields.liabilityCreditCards, copy.fields.liabilityMortgage, copy.fields.liabilityStudentLoans, copy.fields.liabilityAutoLoans, copy.fields.liabilityOther];
  let lastEstimate = null;
  let lastItems = [];
  let snapshots = [];

  function announce(message, kind = 'info') { status.textContent = message; status.dataset.kind = kind; }
  function number(value) { return new Intl.NumberFormat(locale(), { maximumFractionDigits: 2 }).format(value); }
  function money(value, currency) {
    try { return new Intl.NumberFormat(locale(), { style: 'currency', currency, maximumFractionDigits: 2 }).format(value); }
    catch { return `${number(value)} ${currency}`; }
  }
  function readAmounts() {
    const currency = form.elements.namedItem('currencyCode').value.trim().toUpperCase();
    if (!/^[A-Z]{3}$/u.test(currency)) throw new RangeError('currency');
    const items = fields.map(([type, , name], index) => ({ type, category: labels[index], amount: parseLocalizedNumber(form.elements.namedItem(name).value, locale()) }));
    return { currency, items };
  }
  function readStored() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
      if (!Array.isArray(saved) || saved.length > 120) throw new Error('bad');
      snapshots = saved.reduce((valid, item) => addNetWorthSnapshot(valid, item), []);
      return true;
    } catch { snapshots = []; return false; }
  }
  function renderHistory() {
    historyList.replaceChildren();
    for (const snapshot of snapshots) {
      const item = document.createElement('li');
      item.textContent = `${snapshot.date} · ${money(snapshot.netWorth, snapshot.currency)}`;
      historyList.append(item);
    }
    if (!snapshots.length) {
      const item = document.createElement('li'); item.textContent = copy.fields.noSnapshots; historyList.append(item);
    }
  }
  function renderEstimate(estimate, currency) {
    const rows = [
      [copy.fields.totalAssets, money(estimate.totalAssets, currency)],
      [copy.fields.totalLiabilities, money(estimate.totalLiabilities, currency)],
      [copy.fields.netWorth, money(estimate.netWorth, currency)],
      [copy.fields.debtToAsset, estimate.debtToAssetPercent === null ? '—' : `${number(estimate.debtToAssetPercent)}%`],
    ];
    if (consent.checked && snapshots.length) {
      const previous = [...snapshots].reverse().find((snapshot) => snapshot.currency === currency);
      const comparison = previous && compareNetWorthSnapshots({ ...estimate, currency }, previous);
      if (comparison) rows.push([`${previous.date} comparison`, money(comparison.change, currency)]);
    }
    resultContent.replaceChildren();
    const list = document.createElement('dl');
    for (const [label, value] of rows) {
      const term = document.createElement('dt'); term.textContent = label;
      const detail = document.createElement('dd'); detail.textContent = value;
      list.append(term, detail);
    }
    resultContent.append(list);
    result.hidden = false;
    saveButton.disabled = !consent.checked;
  }
  function calculate(event) {
    event?.preventDefault();
    try {
      const { currency, items } = readAmounts();
      lastEstimate = calculateNetWorth(items); lastItems = items;
      if (consent.checked) readStored();
      renderEstimate(lastEstimate, currency); renderHistory();
      announce(copy.messages.calculated, 'success');
    } catch { lastEstimate = null; saveButton.disabled = true; announce(copy.messages.checkInputs, 'error'); }
  }
  form.addEventListener('submit', calculate);
  form.addEventListener('input', () => { lastEstimate = null; saveButton.disabled = true; });
  consent.addEventListener('change', () => {
    saveButton.disabled = !consent.checked || !lastEstimate;
    if (consent.checked && !readStored()) announce(copy.messages.storageUnavailable, 'error');
    if (lastEstimate) renderEstimate(lastEstimate, form.elements.namedItem('currencyCode').value.trim().toUpperCase());
    renderHistory();
  });
  if (!form.elements.namedItem('date').value) {
    const now = new Date();
    form.elements.namedItem('date').value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }
  saveButton.addEventListener('click', () => {
    if (!consent.checked) return announce(copy.messages.consentRequired, 'error');
    if (!lastEstimate) return announce(copy.messages.checkInputs, 'error');
    try {
      const date = form.elements.namedItem('date').value;
      const currency = form.elements.namedItem('currencyCode').value.trim().toUpperCase();
      snapshots = addNetWorthSnapshot(snapshots, { date, currency, items: lastItems });
      localStorage.setItem(storageKey, JSON.stringify(snapshots));
      renderHistory(); announce(copy.messages.saved, 'success');
    } catch { announce(copy.messages.storageUnavailable, 'error'); }
  });
  root.querySelector('[data-action="deleteHistory"]')?.addEventListener('click', () => {
    if (!consent.checked) return announce(copy.messages.consentRequired, 'error');
    try { localStorage.removeItem(storageKey); snapshots = []; renderHistory(); announce(copy.messages.deleted, 'success'); }
    catch { announce(copy.messages.storageUnavailable, 'error'); }
  });
  root.querySelector('[data-action="exportCsv"]')?.addEventListener('click', () => {
    if (!consent.checked) return announce(copy.messages.consentRequired, 'error');
    if (!snapshots.length) return announce(copy.messages.nothingToExport, 'error');
    const url = URL.createObjectURL(new Blob([exportNetWorthCsv(snapshots)], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'net-worth-history.csv'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    announce(copy.messages.exported ?? copy.messages.saved, 'success');
  });
  renderHistory();
}

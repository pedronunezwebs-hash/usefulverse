import { parseLocalizedNumber } from '../../../advanced-logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';
import { calculateInvestmentAllocation } from './logic.mjs';

const root = document.querySelector('[data-tool="investment-allocation-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const assetCount = form.elements.namedItem('assetCount');
  const result = root.querySelector('[data-allocation-result]');
  const rowsTarget = root.querySelector('[data-allocation-rows]');
  let summary = '';

  const locale = () => document.documentElement.lang || 'en';
  const number = (value, digits = 2) => new Intl.NumberFormat(locale(), { maximumFractionDigits: digits }).format(value);
  const percent = (value) => `${number(value)}%`;
  const money = (value, currency, signed = false) => {
    try {
      return new Intl.NumberFormat(locale(), {
        style: 'currency', currency, currencyDisplay: 'code', maximumFractionDigits: 2,
        ...(signed ? { signDisplay: 'always' } : {}),
      }).format(value);
    } catch {
      return `${number(value)} ${currency}`;
    }
  };

  function clear() {
    result.hidden = true;
    rowsTarget.replaceChildren();
    summary = '';
  }

  function syncRows() {
    const count = Number(assetCount.value);
    for (const row of root.querySelectorAll('[data-allocation-row]')) {
      const hidden = Number(row.dataset.index) > count;
      row.hidden = hidden;
      for (const input of row.querySelectorAll('input')) input.disabled = hidden;
    }
  }

  function readInput() {
    const count = Number(assetCount.value);
    const assets = Array.from({ length: count }, (_, index) => {
      const number = index + 1;
      return {
        name: form.elements.namedItem(`assetName${number}`).value,
        currentValue: parseLocalizedNumber(form.elements.namedItem(`currentValue${number}`).value, locale()),
        targetWeight: parseLocalizedNumber(form.elements.namedItem(`targetWeight${number}`).value, locale()),
      };
    });
    return {
      assets,
      currency: form.elements.namedItem('currencyCode').value,
      contribution: parseLocalizedNumber(form.elements.namedItem('contribution').value, locale()),
    };
  }

  function calculate(event) {
    event?.preventDefault();
    clear();
    try {
      const allocation = calculateInvestmentAllocation(readInput());
      const currencyFormatter = (value) => money(value, allocation.currency);
      const signedMoney = (value) => money(value, allocation.currency, true);
      root.querySelector('[data-current-total]').textContent = currencyFormatter(allocation.currentTotal);
      root.querySelector('[data-contribution-total]').textContent = currencyFormatter(allocation.contribution);
      root.querySelector('[data-projected-total]').textContent = currencyFormatter(allocation.projectedTotal);

      const rows = allocation.rows.map((asset) => {
        const tr = document.createElement('tr');
        const values = [asset.name, percent(asset.normalizedWeight), currencyFormatter(asset.currentValue), currencyFormatter(asset.targetValue), currencyFormatter(asset.contributionShare), signedMoney(asset.difference)];
        for (const value of values) {
          const cell = document.createElement('td');
          cell.textContent = value;
          tr.append(cell);
        }
        return tr;
      });
      rowsTarget.replaceChildren(...rows);
      summary = [
        `${copy.fields.currentTotal}: ${currencyFormatter(allocation.currentTotal)}`,
        `${copy.fields.contributionTotal}: ${currencyFormatter(allocation.contribution)}`,
        `${copy.fields.projectedTotal}: ${currencyFormatter(allocation.projectedTotal)}`,
        ...allocation.rows.map((asset) => `${asset.name} · ${percent(asset.normalizedWeight)} · ${copy.fields.targetValue}: ${currencyFormatter(asset.targetValue)} · ${copy.fields.contributionShare}: ${currencyFormatter(asset.contributionShare)} · ${copy.fields.difference}: ${signedMoney(asset.difference)}`),
      ].join('\n');
      result.hidden = false;
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  assetCount.addEventListener('change', () => { syncRows(); clear(); announce(root, ''); });
  form.addEventListener('input', () => { clear(); announce(root, ''); });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => queueMicrotask(() => { syncRows(); clear(); announce(root, ''); }));

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    assetCount.value = '2';
    form.elements.namedItem('currencyCode').value = 'USD';
    form.elements.namedItem('contribution').value = '0';
    const values = [
      ['Fund A', '6000', '60'],
      ['Fund B', '4000', '40'],
    ];
    for (let index = 0; index < 8; index += 1) {
      const number = index + 1;
      const row = values[index] ?? ['', '', ''];
      form.elements.namedItem(`assetName${number}`).value = row[0];
      form.elements.namedItem(`currentValue${number}`).value = row[1];
      form.elements.namedItem(`targetWeight${number}`).value = row[2];
    }
    syncRows();
    calculate();
    announce(root, copy.messages.exampleLoaded, 'success');
  });

  root.querySelector('[data-action="copy"]')?.addEventListener('click', async () => {
    if (!summary) return announce(root, copy.messages.checkInputs, 'error');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(summary);
      announce(root, copy.messages.copied, 'success');
    } catch {
      announce(root, copy.messages.copyUnavailable, 'error');
    }
  });
  syncRows();
}

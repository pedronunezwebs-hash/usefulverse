import { compareSwissPensionWithdrawals } from './swiss-pension-withdrawal.mjs';

const root = document.querySelector('[data-swiss-pension-withdrawal]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields;
  const list = root.querySelector('[data-withdrawal-scenarios]');
  const result = root.querySelector('[data-withdrawal-result]');
  const status = root.querySelector('[data-withdrawal-status]');
  const money = new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'currency', currency: 'CHF', maximumFractionDigits: 2 });
  const percent = new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'percent', maximumFractionDigits: 2 });
  const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  const values = () => [...list.querySelectorAll('[data-withdrawal-scenario]')].map((panel) => Object.fromEntries([...panel.querySelectorAll('[data-withdrawal-field]')].map((field) => [field.dataset.withdrawalField, field.value.trim()])));
  const csvCell = (value) => { const text = String(value ?? ''); const safe = /^[\s]*[=+@-]/u.test(text) ? `'${text}` : text; return `"${safe.replaceAll('"', '""')}"`; };
  const setStatus = (message, error = false) => { status.textContent = message; status.dataset.state = error ? 'error' : 'success'; };
  const addScenario = () => {
    const index = list.querySelectorAll('[data-withdrawal-scenario]').length;
    const panel = list.querySelector('[data-withdrawal-scenario]').cloneNode(true);
    panel.querySelector('legend').textContent = `${f.scenario} ${index + 1}`;
    panel.querySelectorAll('[data-withdrawal-field]').forEach((field) => {
      if (field.dataset.withdrawalField === 'label') field.value = `${f.scenario} ${index + 1}`;
      else if (field.dataset.withdrawalField === 'year') field.value = new Date().getUTCFullYear();
      else field.value = '';
    });
    list.append(panel); result.hidden = true;
  };
  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-withdrawal-add]')) { if (list.querySelectorAll('[data-withdrawal-scenario]').length < 4) addScenario(); return; }
    if (event.target.closest('[data-withdrawal-remove]')) {
      if (list.querySelectorAll('[data-withdrawal-scenario]').length > 1) event.target.closest('[data-withdrawal-scenario]').remove();
      [...list.querySelectorAll('[data-withdrawal-scenario]')].forEach((panel, index) => { panel.querySelector('legend').textContent = `${f.scenario} ${index + 1}`; });
      result.hidden = true; return;
    }
    if (event.target.closest('[data-withdrawal-reset]')) {
      list.replaceChildren();
      root.querySelector('[data-withdrawal-template]').content.querySelectorAll('[data-withdrawal-scenario]').forEach((panel) => list.append(panel.cloneNode(true)));
      result.hidden = true; setStatus(copy.messages.cleared); return;
    }
    if (event.target.closest('[data-withdrawal-calculate]')) {
      try {
        const scenarios = compareSwissPensionWithdrawals(values());
        result.innerHTML = `<h3>${escape(f.resultHeading)}</h3><div class="swiss-pension-withdrawal-results">${scenarios.map((scenario) => `<article><h4>${escape(scenario.label)} · ${escape(scenario.location)} (${scenario.year})</h4><dl><dt>${escape(f.totalCapital)}</dt><dd>${money.format(scenario.capital)}</dd><dt>${escape(f.officialTax)}</dt><dd>${money.format(scenario.tax)}</dd><dt>${escape(f.effectiveRate)}</dt><dd>${percent.format(scenario.effectiveRate)}</dd><dt>${escape(f.afterTax)}</dt><dd><strong>${money.format(scenario.afterTaxCapital)}</strong></dd><dt>${escape(f.delta)}</dt><dd>${money.format(scenario.deltaTaxFromFirst)}</dd></dl><p class="hint">${escape(scenario.comparableWithFirst ? f.comparable : f.notComparable)}</p></article>`).join('')}</div><button type="button" data-withdrawal-export>${escape(f.export)}</button>`;
        result.hidden = false; setStatus(copy.messages.done);
      } catch { result.hidden = true; setStatus(copy.messages.invalid, true); }
      return;
    }
    if (event.target.closest('[data-withdrawal-export]')) {
      const rows = values().map((scenario) => { const computed = compareSwissPensionWithdrawals([scenario])[0]; return [computed.label, computed.year, computed.location, computed.household, computed.capital, computed.tax, computed.effectiveRate, computed.afterTaxCapital]; });
      const csv = `\uFEFF${[[f.label,f.year,f.location,f.household,f.totalCapital,f.officialTax,f.effectiveRate,f.afterTax], ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = 'swiss-pension-withdrawal-scenarios.csv'; link.click(); URL.revokeObjectURL(url); setStatus(copy.messages.exported);
    }
  });
}

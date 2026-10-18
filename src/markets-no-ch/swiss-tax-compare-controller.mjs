import { compareSwissTaxScenarios } from './swiss-tax-compare.mjs';

const root = document.querySelector('[data-swiss-tax-compare]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields;
  const messages = copy.messages;
  const scenarios = root.querySelector('[data-tax-scenarios]');
  const result = root.querySelector('[data-tax-result]');
  const status = root.querySelector('[data-tax-status]');
  const formatter = new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'currency', currency: 'CHF', maximumFractionDigits: 2 });
  const pct = new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'percent', maximumFractionDigits: 2 });
  const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  const formatRate = (rate, unavailable) => rate === null ? unavailable : pct.format(rate);
  const setStatus = (text, error = false) => { status.textContent = text; status.dataset.state = error ? 'error' : 'success'; };
  const scenarioValues = () => [...scenarios.querySelectorAll('[data-tax-scenario]')].map((panel) => Object.fromEntries([...panel.querySelectorAll('[data-tax-field]')].map((field) => [field.dataset.taxField, field.value.trim()])));
  const addPanel = () => {
    const index = scenarios.querySelectorAll('[data-tax-scenario]').length;
    const first = scenarios.querySelector('[data-tax-scenario]');
    const panel = first.cloneNode(true);
    panel.querySelector('legend').textContent = `${f.scenario} ${index + 1}`;
    panel.querySelectorAll('[data-tax-field]').forEach((field) => {
      const key = field.dataset.taxField;
      if (key === 'label') field.value = `${f.scenario} ${index + 1}`;
      else if (key === 'year') field.value = new Date().getUTCFullYear();
      else if (['churchIncomeTax', 'personalTax'].includes(key)) field.value = '0';
      else field.value = '';
    });
    panel.querySelector('details').open = false;
    scenarios.append(panel);
  };
  const escapeCsv = (value) => {
    const text = String(value ?? '');
    const safe = /^[\s]*[=+@-]/u.test(text) ? `'${text}` : text;
    return `"${safe.replaceAll('"', '""')}"`;
  };

  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-tax-add]')) {
      if (scenarios.querySelectorAll('[data-tax-scenario]').length >= 4) return;
      addPanel(); result.hidden = true; return;
    }
    if (event.target.closest('[data-tax-remove]')) {
      if (scenarios.querySelectorAll('[data-tax-scenario]').length <= 1) return;
      event.target.closest('[data-tax-scenario]').remove();
      [...scenarios.querySelectorAll('[data-tax-scenario]')].forEach((panel, index) => { panel.querySelector('legend').textContent = `${f.scenario} ${index + 1}`; });
      result.hidden = true; return;
    }
    if (event.target.closest('[data-tax-reset]')) {
      scenarios.replaceChildren();
      addPanel(); addPanel();
      result.hidden = true; setStatus(messages.cleared); return;
    }
    if (event.target.closest('[data-tax-compare]')) {
      try {
        const compared = compareSwissTaxScenarios(scenarioValues());
        const body = compared.map((scenario) => `<article class="swiss-tax-scenario-result"><h3>${escape(scenario.label)} · ${escape(scenario.location)} (${scenario.year})</h3><dl><dt>${escape(f.incomeTaxTotal)}</dt><dd>${formatter.format(scenario.incomeTaxTotal)}</dd><dt>${escape(f.wealthTaxResult)}</dt><dd>${formatter.format(scenario.wealthTax)}</dd><dt><strong>${escape(f.totalTax)}</strong></dt><dd><strong>${formatter.format(scenario.totalTax)}</strong></dd><dt>${escape(f.incomeRate)}</dt><dd>${formatRate(scenario.incomeEffectiveRate, f.noIncomeBasis)}</dd><dt>${escape(f.wealthRate)}</dt><dd>${formatRate(scenario.wealthEffectiveRate, f.noWealthBasis)}</dd><dt>${escape(f.delta)}</dt><dd>${formatter.format(scenario.deltaFromFirst)}</dd></dl><details><summary>${escape(f.breakdownHeading)}</summary><dl><dt>${escape(f.federalIncomeTax)}</dt><dd>${formatter.format(scenario.federalIncomeTax)}</dd><dt>${escape(f.cantonalIncomeTax)}</dt><dd>${formatter.format(scenario.cantonalIncomeTax)}</dd><dt>${escape(f.municipalIncomeTax)}</dt><dd>${formatter.format(scenario.municipalIncomeTax)}</dd><dt>${escape(f.churchIncomeTax)}</dt><dd>${formatter.format(scenario.churchIncomeTax)}</dd><dt>${escape(f.personalTax)}</dt><dd>${formatter.format(scenario.personalTax)}</dd><dt>${escape(f.taxableFederalIncome)}</dt><dd>${formatter.format(scenario.taxableFederalIncome)}</dd><dt>${escape(f.taxableCantonalIncome)}</dt><dd>${formatter.format(scenario.taxableCantonalIncome)}</dd><dt>${escape(f.taxableWealth)}</dt><dd>${formatter.format(scenario.taxableWealth)}</dd></dl></details><p class="hint">${escape(scenario.comparableWithFirst ? f.comparable : f.notComparable)}</p></article>`).join('');
        result.innerHTML = `<h3>${escape(f.resultHeading)}</h3><div class="swiss-tax-results-grid">${body}</div><button type="button" data-tax-export>${escape(f.export)}</button>`;
        result.hidden = false; setStatus(messages.done);
      } catch (error) { result.hidden = true; setStatus(messages.invalid, true); }
      return;
    }
    if (event.target.closest('[data-tax-export]')) {
      const data = scenarioValues().map((scenario) => {
        const computed = compareSwissTaxScenarios([scenario])[0];
        return [computed.label, computed.year, computed.location, computed.taxableFederalIncome, computed.taxableCantonalIncome, computed.taxableWealth, computed.federalIncomeTax, computed.cantonalIncomeTax, computed.municipalIncomeTax, computed.churchIncomeTax, computed.wealthTax, computed.personalTax, computed.incomeTaxTotal, computed.totalTax, computed.incomeEffectiveRate ?? '', computed.wealthEffectiveRate ?? ''];
      });
      const headers = [f.label, f.year, f.location, f.taxableFederalIncome, f.taxableCantonalIncome, f.taxableWealth, f.federalIncomeTax, f.cantonalIncomeTax, f.municipalIncomeTax, f.churchIncomeTax, f.wealthTax, f.personalTax, f.incomeTaxTotal, f.totalTax, f.incomeRate, f.wealthRate];
      const csv = `\uFEFF${[headers, ...data].map((row) => row.map(escapeCsv).join(',')).join('\r\n')}`;
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url; link.download = 'swiss-tax-scenarios.csv'; link.click(); URL.revokeObjectURL(url);
      setStatus(messages.copied);
    }
  });
}

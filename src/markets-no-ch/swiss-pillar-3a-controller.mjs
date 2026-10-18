import { calculateSwissPillar3aScenario } from './swiss-pillar-3a.mjs';

const root = document.querySelector('[data-swiss-pillar-3a]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields;
  const messages = copy.messages;
  const controls = [...root.querySelectorAll('[data-3a-field]')];
  const result = root.querySelector('[data-3a-result]');
  const status = root.querySelector('[data-3a-status]');
  const money = new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'currency', currency: 'CHF', maximumFractionDigits: 2 });
  const percent = new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'percent', maximumFractionDigits: 2 });
  const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  const values = () => Object.fromEntries(controls.map((field) => [field.dataset['3aField'], field.type === 'checkbox' ? field.checked : field.value.trim()]));
  const csvCell = (value) => {
    const text = String(value ?? '');
    const safe = /^[\s]*[=+@-]/u.test(text) ? `'${text}` : text;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  let scenario;
  const setStatus = (text, error = false) => { status.textContent = text; status.dataset.state = error ? 'error' : 'success'; };
  const render = (data) => {
    result.innerHTML = `<h3>${escape(f.resultHeading)} · ${data.year}</h3><p>${escape(data.location)} · ${escape(data.profile)}</p><dl><dt>${escape(f.limit)}</dt><dd>${money.format(data.maximumDeduction)}</dd><dt>${escape(f.deductible)}</dt><dd>${money.format(data.deductibleContribution)}</dd><dt>${escape(f.aboveLimit)}</dt><dd>${money.format(data.contributionAboveLimit)}</dd><dt>${escape(f.taxBefore)}</dt><dd>${money.format(data.taxBefore)}</dd><dt>${escape(f.taxAfter)}</dt><dd>${money.format(data.taxAfter)}</dd><dt><strong>${escape(f.taxSavings)}</strong></dt><dd><strong>${money.format(data.estimatedTaxSavings)}</strong></dd><dt>${escape(f.savingShare)}</dt><dd>${data.taxSavingsAsShareOfContribution === null ? '—' : percent.format(data.taxSavingsAsShareOfContribution)}</dd><dt>${escape(f.effectiveRate)}</dt><dd>${data.effectiveSavingsOnDeduction === null ? '—' : percent.format(data.effectiveSavingsOnDeduction)}</dd></dl>${data.eligibleIncomeConfirmed ? '' : `<p class="hint">${escape(f.noEligibleIncome)}</p>`}${data.estimatedTaxSavings < 0 ? `<p class="hint">${escape(f.negativeDifference)}</p>` : ''}<p class="hint">${escape(f.futureTax)}</p><div class="actions"><button type="button" data-3a-export>${escape(f.export)}</button></div>`;
    result.hidden = false;
  };
  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-3a-calculate]')) {
      try {
        scenario = calculateSwissPillar3aScenario(values());
        render(scenario); setStatus(messages.done);
      } catch (error) { result.hidden = true; setStatus(messages.invalid, true); }
    }
    if (event.target.closest('[data-3a-reset]')) {
      controls.forEach((field) => { if (field.type === 'checkbox') field.checked = false; else if (field.dataset['3aField'] === 'year') field.value = '2026'; else if (field.dataset['3aField'] === 'secondPillarStatus') field.value = 'withSecondPillar'; else field.value = ''; });
      result.hidden = true; scenario = undefined; setStatus(messages.cleared);
    }
    if (event.target.closest('[data-3a-export]') && scenario) {
      const rows = [
        [f.year, scenario.year], [f.secondPillar, scenario.secondPillarStatus], [f.location, scenario.location], [f.profile, scenario.profile],
        [f.earned, scenario.qualifyingEarnedIncome], [f.eligibility, scenario.eligibleIncomeConfirmed],
        [f.contribution, scenario.contribution], [f.limit, scenario.maximumDeduction], [f.deductible, scenario.deductibleContribution],
        [f.taxBefore, scenario.taxBefore], [f.taxAfter, scenario.taxAfter], [f.taxSavings, scenario.estimatedTaxSavings],
      ];
      const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url; link.download = `swiss-pillar-3a-${scenario.year}.csv`; link.click(); URL.revokeObjectURL(url);
      setStatus(messages.exported);
    }
  });
}

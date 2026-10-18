import { calculateSwissBvgScenario } from './swiss-bvg-pension.mjs';

const root = document.querySelector('[data-swiss-bvg-pension]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields;
  const status = root.querySelector('[data-bvg-status]');
  const result = root.querySelector('[data-bvg-result]');
  const fields = [...root.querySelectorAll('[data-bvg-field]')];
  const money = new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'currency', currency: 'CHF', maximumFractionDigits: 2 });
  const percent = new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'percent', maximumFractionDigits: 2 });
  const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  const values = () => Object.fromEntries(fields.map((field) => [field.dataset.bvgField, field.value.trim()]));
  const cell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  let scenario;
  const setStatus = (message, error = false) => { status.textContent = message; status.dataset.state = error ? 'error' : 'success'; };
  const render = (data) => {
    result.innerHTML = `<h3>${escape(f.resultHeading)} · ${data.year}</h3><dl><dt>${escape(f.threshold)}</dt><dd>${money.format(data.entryThreshold)}</dd><dt>${escape(f.coordination)}</dt><dd>${money.format(data.coordinationDeduction)}</dd><dt>${escape(f.minSalary)}</dt><dd>${money.format(data.minimumCoordinatedSalary)}</dd><dt>${escape(f.maxSalary)}</dt><dd>${money.format(data.maximumSalary)}</dd><dt>${escape(f.insured)}</dt><dd>${money.format(data.insuredSalary)}</dd><dt>${escape(f.accrualRate)}</dt><dd>${percent.format(data.currentAgeAccrualRate)}</dd><dt>${escape(f.annualCredit)}</dt><dd>${money.format(data.currentAgeAnnualCredit)}</dd><dt>${escape(f.projected)}</dt><dd><strong>${money.format(data.projectedMandatoryBalance)}</strong></dd><dt>${escape(f.addedCredits)}</dt><dd>${money.format(data.totalFutureCreditsBeforeInterest)}</dd><dt>${escape(f.annualPension)}</dt><dd>${money.format(data.estimatedAnnualPension)}</dd><dt>${escape(f.monthlyPension)}</dt><dd>${money.format(data.estimatedMonthlyPension)}</dd><dt>${escape(f.years)}</dt><dd>${data.contributionYears}</dd></dl>${data.insuredSalary === 0 ? `<p class="hint">${escape(f.noCoverage)}</p>` : ''}<p class="hint">${escape(f.projectionNote)}</p><div class="actions"><button type="button" data-bvg-export>${escape(f.export)}</button></div>`;
    result.hidden = false;
  };
  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-bvg-calculate]')) {
      try { scenario = calculateSwissBvgScenario(values()); render(scenario); setStatus(copy.messages.done); }
      catch { scenario = undefined; result.hidden = true; setStatus(copy.messages.invalid, true); }
    }
    if (event.target.closest('[data-bvg-reset]')) {
      fields.forEach((field) => { if (field.dataset.bvgField === 'year') field.value = '2026'; else if (field.dataset.bvgField === 'interestRate') field.value = '1.25'; else if (field.dataset.bvgField === 'conversionRate') field.value = '6.8'; else if (field.dataset.bvgField === 'annualSalaryGrowth') field.value = '0'; else field.value = ''; });
      scenario = undefined; result.hidden = true; setStatus(copy.messages.cleared);
    }
    if (event.target.closest('[data-bvg-export]') && scenario) {
      const rows = [[f.year,scenario.year],[f.salary,scenario.annualSalary],[f.age,scenario.age],[f.retirementAge,scenario.retirementAge],[f.insured,scenario.insuredSalary],[f.balance,scenario.currentMandatoryBalance],[f.interest,scenario.assumedInterestRate],[f.conversion,scenario.assumedConversionRate],[f.projected,scenario.projectedMandatoryBalance],[f.monthlyPension,scenario.estimatedMonthlyPension]];
      const csv = `\uFEFF${rows.map((row) => row.map(cell).join(',')).join('\r\n')}`;
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url; link.download = `swiss-bvg-scenario-${scenario.year}.csv`; link.click(); URL.revokeObjectURL(url); setStatus(copy.messages.exported);
    }
  });
}

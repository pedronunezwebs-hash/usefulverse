import { compareSwissHealthDeductibles } from './swiss-health-deductible.mjs';

const root = document.querySelector('[data-swiss-health-deductible]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields;
  const group = root.querySelector('[data-health-group]');
  const quoteList = root.querySelector('[data-health-quotes]');
  const status = root.querySelector('[data-health-status]');
  const result = root.querySelector('[data-health-result]');
  const money = new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'currency', currency: 'CHF', maximumFractionDigits: 2 });
  const options = { adult: [300, 500, 1000, 1500, 2000, 2500], child: [0, 100, 200, 300, 400, 500, 600] };
  const premiums = { adult: new Map(), child: new Map() };
  const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  const setStatus = (message, error = false) => { status.textContent = message; status.dataset.state = error ? 'error' : 'success'; };
  const renderQuoteInputs = () => {
    const selected = group.value;
    quoteList.innerHTML = `<p class="hint">${escape(f[selected === 'adult' ? 'adultOptions' : 'childOptions'])}</p><p class="hint">${escape(f.leaveBlank)}</p><div class="fields">${options[selected].map((deductible) => `<label class="field">CHF ${deductible} · ${escape(f.monthlyPremium)}<input type="number" data-health-premium="${deductible}" min="0.01" max="20000" step="0.01" inputmode="decimal" value="${escape(premiums[selected].get(deductible) ?? '')}"></label>`).join('')}</div>`;
  };
  const values = () => {
    const current = group.value;
    const quotes = [...quoteList.querySelectorAll('[data-health-premium]')]
      .filter((field) => field.value.trim())
      .map((field) => ({ deductible: Number(field.dataset.healthPremium), monthlyPremium: field.value.trim() }));
    for (const field of quoteList.querySelectorAll('[data-health-premium]')) {
      if (field.value.trim()) premiums[current].set(Number(field.dataset.healthPremium), field.value.trim());
      else premiums[current].delete(Number(field.dataset.healthPremium));
    }
    return {
      insuredGroup: current,
      lowSpend: root.querySelector('[data-health-low]').value.trim(),
      expectedSpend: root.querySelector('[data-health-expected]').value.trim(),
      highSpend: root.querySelector('[data-health-high]').value.trim(),
      quotes,
    };
  };
  let comparison;
  const formatBreakEven = (option) => {
    if (option.isLowestDeductible || option.annualPremiumSavingVsLowestDeductible <= 0) return f.noSaving;
    return option.breakEvenEligibleSpend === null ? f.noBreakEven : money.format(option.breakEvenEligibleSpend);
  };
  const renderResults = () => {
    const rows = comparison.map((option, index) => `<tr${index === 0 ? ' class="is-lowest"' : ''}><th scope="row">CHF ${option.deductible}${index === 0 ? `<span class="sr-only"> · ${escape(f.lowestExpected)}</span>` : ''}</th><td>${money.format(option.annualPremium)}</td><td>${money.format(option.lowAnnualTotal)}</td><td><strong>${money.format(option.expectedAnnualTotal)}</strong></td><td>${money.format(option.highAnnualTotal)}</td><td>${option.expectedDifferenceFromLowestDeductible > 0 ? '+' : ''}${money.format(option.expectedDifferenceFromLowestDeductible)}</td><td>${escape(formatBreakEven(option))}</td></tr>`).join('');
    result.innerHTML = `<h3>${escape(f.resultHeading)}</h3><p>${escape(f.lowestExpected)}: <strong>CHF ${comparison[0].deductible}</strong></p><div class="table-wrap"><table><caption>${escape(f.detailHeading)}</caption><thead><tr><th scope="col">${escape(f.deductible)}</th><th scope="col">${escape(f.annualPremium)}</th><th scope="col">${escape(f.lowTotal)}</th><th scope="col">${escape(f.expectedTotal)}</th><th scope="col">${escape(f.highTotal)}</th><th scope="col">${escape(f.expectedDifference)}</th><th scope="col">${escape(f.breakEvenSpend)}</th></tr></thead><tbody>${rows}</tbody></table></div><div class="actions"><button type="button" data-health-export>${escape(f.export)}</button></div>`;
    result.hidden = false;
  };
  group.addEventListener('change', () => { renderQuoteInputs(); result.hidden = true; });
  quoteList.addEventListener('input', () => { for (const field of quoteList.querySelectorAll('[data-health-premium]')) premiums[group.value].set(Number(field.dataset.healthPremium), field.value); });
  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-health-calculate]')) {
      try { comparison = compareSwissHealthDeductibles(values()); renderResults(); setStatus(copy.messages.done); }
      catch { comparison = undefined; result.hidden = true; setStatus(copy.messages.invalid, true); }
    }
    if (event.target.closest('[data-health-reset]')) {
      root.querySelectorAll('[data-health-spend]').forEach((field) => { field.value = ''; });
      premiums[group.value].clear(); renderQuoteInputs(); result.hidden = true; setStatus(copy.messages.cleared);
    }
    if (event.target.closest('[data-health-export]') && comparison) {
      const rows = [[f.deductible,f.annualPremium,f.lowTotal,f.expectedTotal,f.highTotal,f.expectedDifference,f.breakEvenSpend], ...comparison.map((x) => [x.deductible,x.annualPremium,x.lowAnnualTotal,x.expectedAnnualTotal,x.highAnnualTotal,x.expectedDifferenceFromLowestDeductible,formatBreakEven(x)])];
      const csv = `\uFEFF${rows.map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n')}`;
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url; link.download = 'swiss-deductible-comparison.csv'; link.click(); URL.revokeObjectURL(url); setStatus(copy.messages.exported);
    }
  });
  renderQuoteInputs();
}

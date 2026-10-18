import { estimateSwissAhvPension } from './swiss-ahv-pension.mjs';

const root = document.querySelector('[data-swiss-ahv-pension]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields;
  const messages = copy.messages;
  const year = root.querySelector('[data-ahv-year]');
  const average = root.querySelector('[data-ahv-average]');
  const credited = root.querySelector('[data-ahv-credited]');
  const fullYears = root.querySelector('[data-ahv-full-years]');
  const result = root.querySelector('[data-ahv-result]');
  const status = root.querySelector('[data-ahv-status]');
  const money = new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 });
  const percent = new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'percent', maximumFractionDigits: 1 });
  const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  let lastScenario;
  const render = (scenario) => {
    result.innerHTML = `<h3>${escape(f.resultHeading)} · ${scenario.year}</h3><dl><dt><strong>${escape(f.monthly)}</strong></dt><dd><strong>${money.format(scenario.monthlyPension)}</strong></dd><dt>${escape(f.annual12)}</dt><dd>${money.format(scenario.regularAnnual)}</dd><dt>${escape(f.thirteenth)}</dt><dd>${money.format(scenario.thirteenthPayment)}</dd><dt><strong>${escape(f.annualTotal)}</strong></dt><dd><strong>${money.format(scenario.estimatedAnnualTotal)}</strong></dd><dt>${escape(f.fullScale)}</dt><dd>${money.format(scenario.fullScaleMonthlyPension)}</dd><dt>${escape(f.roundedAverage)}</dt><dd>${money.format(scenario.roundedDeterminingAverageAnnualIncome)}</dd><dt>${escape(f.contributionRatio)}</dt><dd>${scenario.creditedContributionYears}/${scenario.fullContributionYears} · ${percent.format(scenario.contributionRatio)}</dd><dt>${escape(f.minimum)}</dt><dd>${money.format(scenario.minimumMonthly)}</dd><dt>${escape(f.maximum)}</dt><dd>${money.format(scenario.maximumMonthly)}</dd></dl><p class="hint">${escape(f.formulaNote)}</p><div class="actions"><button type="button" data-ahv-export>${escape(copy.fields.export)}</button></div>`;
    result.hidden = false;
  };
  const setStatus = (text, error = false) => { status.textContent = text; status.dataset.state = error ? 'error' : 'success'; };
  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-ahv-calculate]')) {
      try {
        lastScenario = estimateSwissAhvPension({
          year: year.value,
          determiningAverageAnnualIncome: average.value,
          creditedContributionYears: credited.value,
          fullContributionYears: fullYears.value,
        });
        render(lastScenario);
        setStatus(messages.done);
      } catch (error) {
        result.hidden = true;
        setStatus(messages.invalid, true);
      }
    }
    if (event.target.closest('[data-ahv-reset]')) {
      average.value = ''; credited.value = ''; fullYears.value = ''; year.value = '2026';
      result.hidden = true; lastScenario = undefined; setStatus(messages.cleared);
    }
    if (event.target.closest('[data-ahv-export]') && lastScenario) {
      const rows = [
        [f.year, lastScenario.year], [f.average, lastScenario.determiningAverageAnnualIncome],
        [f.creditedYears, lastScenario.creditedContributionYears], [f.fullYears, lastScenario.fullContributionYears],
        [f.roundedAverage, lastScenario.roundedDeterminingAverageAnnualIncome],
        [f.monthly, lastScenario.monthlyPension], [f.annual12, lastScenario.regularAnnual],
        [f.thirteenth, lastScenario.thirteenthPayment], [f.annualTotal, lastScenario.estimatedAnnualTotal],
      ];
      const csv = `\uFEFF${rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n')}`;
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url; link.download = `swiss-ahv-pension-${lastScenario.year}.csv`; link.click(); URL.revokeObjectURL(url);
      setStatus(messages.exported);
    }
  });
}

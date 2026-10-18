import { calculateRingComparison } from './ring-size.mjs';

const root = document.querySelector('[data-ring-size-tool]');
if (root) {
  const copy = JSON.parse(root.closest('[data-market-tool]')?.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields; const q = (selector) => root.querySelector(selector);
  const value = q('#ring-value'); const basis = q('#ring-basis'); const unit = q('#ring-unit');
  const chart = q('#ring-chart'); const chartUnit = q('#ring-chart-unit'); const chartBasis = q('#ring-chart-basis');
  const label = q('#ring-chart-label'); const chartDate = q('#ring-chart-date'); const output = q('[data-ring-output]');
  const status = q('[data-ring-status]'); let result = null;
  const fmt = (number, digits = 2) => Number(number).toLocaleString(document.documentElement.lang, { maximumFractionDigits: digits });
  const addRow = (table, first, second) => { const row = document.createElement('tr'); const a = document.createElement('th'); a.scope = 'row'; a.textContent = first; const b = document.createElement('td'); b.textContent = second; row.append(a, b); table.append(row); };
  const calculate = () => {
    try {
      result = calculateRingComparison({ value: value.value, unit: unit.value, basis: basis.value, chart: chart.value, chartUnit: chartUnit.value, chartBasis: chartBasis.value });
      const table = document.createElement('tbody');
      addRow(table, f.circumferenceResult, `${fmt(result.circumferenceMm)} mm`);
      addRow(table, f.diameterResult, `${fmt(result.diameterMm)} mm`);
      if (label.value.trim()) addRow(table, f.chartName, label.value.trim().slice(0, 80));
      if (chartDate.value) addRow(table, f.date, chartDate.value);
      if (result.nearest) addRow(table, f.closest, result.nearest.label);
      else if (result.outside) addRow(table, f.closest, f.outside);
      else addRow(table, f.closest, f.noChart);
      if (result.chartRange) {
        const low = result.chartRange[0];
        const high = result.chartRange[1];
        const chartUnitFactor = chartUnit.value === 'cm' ? 10 : chartUnit.value === 'in' ? 25.4 : 1;
        addRow(table, f.chartRange, `${fmt(low / chartUnitFactor)}–${fmt(high / chartUnitFactor)} ${chartUnit.value}`);
      }
      q('[data-ring-result]').replaceChildren(table);
      q('[data-ring-calibration]').hidden = false;
      output.hidden = false;
      status.textContent = result.outside ? f.outside : f.success;
    } catch {
      result = null; output.hidden = true; status.textContent = f.invalid;
    }
  };
  q('[data-ring-calculate]').addEventListener('click', calculate);
  q('[data-ring-clear]').addEventListener('click', () => { value.value = ''; chart.value = ''; label.value = ''; chartDate.value = ''; result = null; output.hidden = true; q('[data-ring-calibration]').hidden = true; status.textContent = f.ready; });
  q('[data-ring-print]').addEventListener('click', () => { if (!result) calculate(); if (result) window.print(); });
  q('[data-ring-export]').addEventListener('click', () => {
    if (!result) calculate(); if (!result) return;
    const rows = [
      [f.chartName, label.value.trim()],
      [f.date, chartDate.value],
      [f.measurement, `${value.value} ${unit.value} (${basis.value})`],
      [f.circumferenceResult, `${result.circumferenceMm.toFixed(2)} mm`],
      [f.diameterResult, `${result.diameterMm.toFixed(2)} mm`],
      [f.chartBasis, `${chartBasis.value} (${chartUnit.value})`],
      [f.closest, result.nearest?.label ?? (result.outside ? f.outside : f.noChart)],
    ];
    const quote = (text) => `"${String(text).replaceAll('"', '""')}"`;
    const blob = new Blob([`\ufeff${rows.map((row) => row.map(quote).join(',')).join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'ring-measurement-comparison.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}

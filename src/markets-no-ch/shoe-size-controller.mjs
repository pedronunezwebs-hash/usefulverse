import { compareFootLengths } from './shoe-size.mjs';

const root = document.querySelector('[data-shoe-size-tool]');
if (root) {
  const copy = JSON.parse(root.closest('[data-market-tool]')?.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields;
  const q = (selector) => root.querySelector(selector);
  const number = (value) => new Intl.NumberFormat(document.documentElement.lang, { maximumFractionDigits: 1 }).format(value);
  let result = null;

  function updateFootInputBounds() {
    const maximum = { mm: '400', cm: '40', in: '15.75' }[q('#shoe-unit').value];
    for (const input of [q('#shoe-left'), q('#shoe-right')]) input.max = maximum;
  }

  function calculate() {
    try {
      result = compareFootLengths({
        left: q('#shoe-left').value,
        right: q('#shoe-right').value,
        unit: q('#shoe-unit').value,
        chartText: q('#shoe-chart').value,
        chartUnit: q('#shoe-chart-unit').value,
        chartBasis: q('#shoe-chart-basis').value,
        allowanceMm: q('#shoe-allowance').value,
      });
      const body = q('[data-shoe-result]');
      body.replaceChildren();
      const chartName = document.createElement('p'); chartName.textContent = `${f.chartLabel}: ${q('#shoe-chart-label').value || '—'} · ${f.chartDate}: ${q('#shoe-chart-date').value || '—'}`; body.append(chartName);
      const list = document.createElement('dl');
      const values = [
        [f.leftResult, `${number(result.leftMm)} mm`],
        [f.rightResult, `${number(result.rightMm)} mm`],
        [f.longer, `${number(result.longerFootMm)} mm`],
        [f.mondopoint, `MP${result.mondopointLengthMm}`],
        [f.target, `${number(result.targetMm)} mm`],
        [f.closest, result.match.label],
        [f.difference, `${number(result.match.differenceMm)} mm`],
        [f.chartRange, `${number(result.chartRange.minMm)}–${number(result.chartRange.maxMm)} mm`],
      ];
      for (const [term, value] of values) {
        const dt = document.createElement('dt'); dt.textContent = term;
        const dd = document.createElement('dd'); dd.textContent = value;
        list.append(dt, dd);
      }
      body.append(list);
      const note = document.createElement('p'); note.className = 'hint'; note.textContent = result.outsideChartRange ? f.outside : f.within; body.append(note);
      q('[data-shoe-output]').hidden = false;
      q('[data-shoe-status]').textContent = f.success;
    } catch {
      result = null; q('[data-shoe-output]').hidden = true;
      q('[data-shoe-status]').textContent = f.invalid;
    }
  }

  function csvCell(value) {
    const text = String(value);
    const safe = /^[=+\-@\t\r]/u.test(text) ? `'${text}` : text;
    return `"${safe.replaceAll('"', '""')}"`;
  }

  q('[data-shoe-calculate]').addEventListener('click', calculate);
  q('#shoe-unit').addEventListener('change', updateFootInputBounds);
  updateFootInputBounds();
  q('[data-shoe-download]').addEventListener('click', () => {
    if (!result) { q('[data-shoe-status]').textContent = f.invalid; return; }
    const rows = [
      [f.chartLabel, q('#shoe-chart-label').value], [f.chartDate, q('#shoe-chart-date').value],
      [f.leftResult, result.leftMm], [f.rightResult, result.rightMm], [f.longer, result.longerFootMm],
      [f.mondopoint, `MP${result.mondopointLengthMm}`], [f.closest, result.match.label],
      [f.difference, result.match.differenceMm], [f.chartRange, `${result.chartRange.minMm}-${result.chartRange.maxMm} mm`],
    ];
    const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'foot-length-comparison.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  q('[data-shoe-print]').addEventListener('click', () => { if (result) window.print(); else q('[data-shoe-status]').textContent = f.invalid; });
}

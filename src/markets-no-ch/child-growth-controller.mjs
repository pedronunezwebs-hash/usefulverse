import { calculateChildGrowth } from './child-growth.mjs';

const root = document.querySelector('[data-child-growth-tool]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]').textContent);
  const f = copy.fields;
  const ack = root.querySelector('[data-growth-ack]');
  const add = root.querySelector('[data-growth-add]');
  const birth = root.querySelector('#growth-birth');
  const date = root.querySelector('#growth-date');
  const height = root.querySelector('#growth-height');
  const weight = root.querySelector('#growth-weight');
  const sex = root.querySelector('#growth-sex');
  const status = root.querySelector('[data-growth-status]');
  const results = root.querySelector('[data-growth-results]');
  const tbody = root.querySelector('[data-growth-history]');
  const warning = root.querySelector('[data-growth-warning]');
  const chart = root.querySelector('[data-growth-chart]');
  const rows = [];
  const today = new Date(); date.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const format = (value) => Number(value).toLocaleString(document.documentElement.lang, { maximumFractionDigits: 1 });
  const enable = () => { add.disabled = !ack.checked || rows.length >= 100; };
  ack.addEventListener('change', enable);

  function ageText(item) {
    const birthDate = new Date(`${item.birthDate}T00:00:00.000Z`);
    const measuredDate = new Date(`${item.measurementDate}T00:00:00.000Z`);
    let completeMonths = (measuredDate.getUTCFullYear() - birthDate.getUTCFullYear()) * 12 + measuredDate.getUTCMonth() - birthDate.getUTCMonth();
    const anniversaryDay = Math.min(birthDate.getUTCDate(), new Date(Date.UTC(measuredDate.getUTCFullYear(), measuredDate.getUTCMonth() + 1, 0)).getUTCDate());
    if (measuredDate.getUTCDate() < anniversaryDay) completeMonths -= 1;
    const anniversaryMonth = birthDate.getUTCMonth() + completeMonths;
    const anniversaryYear = birthDate.getUTCFullYear() + Math.floor(anniversaryMonth / 12);
    const normalizedMonth = anniversaryMonth % 12;
    const anniversary = new Date(Date.UTC(anniversaryYear, normalizedMonth, Math.min(birthDate.getUTCDate(), new Date(Date.UTC(anniversaryYear, normalizedMonth + 1, 0)).getUTCDate())));
    const days = Math.floor((measuredDate - anniversary) / 86_400_000);
    const years = Math.floor(completeMonths / 12); const remainder = completeMonths % 12;
    return `${years} ${f.year} ${remainder} ${f.month} ${days} ${f.day}`;
  }

  function updateChart() {
    while (chart.firstChild) chart.firstChild.remove();
    const ns = 'http://www.w3.org/2000/svg';
    const make = (name, attrs = {}) => { const item = document.createElementNS(ns, name); for (const [key, value] of Object.entries(attrs)) item.setAttribute(key, String(value)); return item; };
    const y = (percentile) => 240 - percentile * 2.05;
    for (const tick of [0, 25, 50, 75, 100]) {
      const yy = y(tick); chart.append(make('line', { x1: 46, x2: 628, y1: yy, y2: yy, class: 'growth-gridline' }));
      const label = make('text', { x: 39, y: yy + 4, 'text-anchor': 'end', class: 'growth-axis-label' }); label.textContent = `${tick}%`; chart.append(label);
    }
    const x = (index) => rows.length === 1 ? 337 : 54 + index * 574 / (rows.length - 1);
    const path = make('polyline', { points: rows.map((item, index) => `${x(index)},${y(Math.min(99.9, item.result.bmiPercentile))}`).join(' '), class: 'growth-line', fill: 'none' }); chart.append(path);
    rows.forEach((item, index) => {
      const dot = make('circle', { cx: x(index), cy: y(Math.min(99.9, item.result.bmiPercentile)), r: 5, class: 'growth-dot' });
      const plottedPercentile = item.result.bmiAboveExtendedRange ? `≥${format(99.99)}%` : `${format(item.result.bmiPercentile)}%`;
      dot.setAttribute('aria-label', `${f.point}: ${item.measurementDate}, ${plottedPercentile}`); chart.append(dot);
      const label = make('text', { x: x(index), y: 266, 'text-anchor': 'middle', class: 'growth-axis-label' });
      label.textContent = item.measurementDate.slice(0, 7); chart.append(label);
    });
    chart.setAttribute('aria-label', `${f.chartHeading}: ${rows.map((item) => `${item.measurementDate} ${format(item.result.bmiPercentile)}%`).join(', ')}`);
  }

  function update() {
    tbody.replaceChildren(); warning.hidden = !rows.some((item) => item.result.bmiAboveExtendedRange);
    rows.forEach((item, index) => {
      const tr = document.createElement('tr');
      const bmiPercentile = item.result.bmiAboveExtendedRange ? `≥${format(99.99)}%` : `${format(item.result.bmiPercentile)}%`;
      const cells = [item.measurementDate, ageText(item), `${format(item.result.heightPercentile)}%`, `${format(item.result.weightPercentile)}%`, format(item.result.bmi), bmiPercentile];
      for (const value of cells) { const td = document.createElement('td'); td.textContent = value; tr.append(td); }
      const action = document.createElement('td'); const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = f.delete; remove.setAttribute('aria-label', `${f.delete}: ${item.measurementDate}`);
      remove.addEventListener('click', () => { rows.splice(index, 1); update(); }); action.append(remove); tr.append(action); tbody.append(tr);
    });
    birth.disabled = rows.length > 0; sex.disabled = rows.length > 0; add.disabled = !ack.checked || rows.length >= 100;
    results.hidden = rows.length === 0;
    updateChart();
  }

  add.addEventListener('click', () => {
    try {
      const record = { birthDate: birth.value, measurementDate: date.value, heightCm: Number(height.value), weightKg: Number(weight.value) };
      if (rows.length >= 100 || rows.some((item) => item.measurementDate === record.measurementDate)) throw new RangeError('One measurement per date, up to 100 dates.');
      const result = calculateChildGrowth({ ...record, sex: sex.value });
      rows.push({ ...record, result }); rows.sort((a, b) => a.measurementDate.localeCompare(b.measurementDate)); update();
      status.textContent = f.success; height.value = ''; weight.value = '';
    } catch { status.textContent = f.invalid; }
  });

  root.querySelector('[data-growth-clear]').addEventListener('click', () => { rows.splice(0, rows.length); update(); status.textContent = f.noHistory; });
  root.querySelector('[data-growth-print]').addEventListener('click', () => window.print());
  root.querySelector('[data-growth-csv]').addEventListener('click', () => {
    if (!rows.length) { status.textContent = f.noHistory; return; }
    const fields = [f.date, f.age, f.heightPercentile, f.weightPercentile, f.bmi, f.bmiPercentile];
    const quote = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const lines = [fields, ...rows.map((item) => [item.measurementDate, ageText(item), item.result.heightPercentile.toFixed(2), item.result.weightPercentile.toFixed(2), item.result.bmi.toFixed(2), item.result.bmiAboveExtendedRange ? '>=99.99' : item.result.bmiPercentile.toFixed(2)])];
    const blob = new Blob([`\ufeff${lines.map((line) => line.map(quote).join(',')).join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'child-growth-reference-comparison.csv'; link.click(); URL.revokeObjectURL(url);
  });
}
